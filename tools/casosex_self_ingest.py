#!/usr/bin/env python3
"""
casosex_self_ingest.py
Pipeline Soberano de Ingestão do CASOSEX:
1. Criação e validação da coleção dedicada 'casosex-conversation' e 'casosex-self' no Qdrant :6352.
2. Deduplicação por hash BLAKE3 em sub-milissegundo.
3. Vetorização 768d via MCP Embed (:8081) com batch_size=8.
4. Ingestão de docs/briefing/self-conversation (v1 e v2) + ADRs + Specs + Handoffs.
5. Atualização da telemetria no Redis :6396.
"""

import hashlib
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

try:
    from hashlib import blake3
except ImportError:
    blake3 = None

PROJECT_ROOT = Path(__file__).parent.parent
QDRANT_URL = os.getenv("QDRANT_URL", "http://127.0.0.1:6352")
EMBED_URL = os.getenv("EMBED_URL", "http://127.0.0.1:8081")
COLLECTION_CONVERSATION = "casosex-conversation"
COLLECTION_SELF = "casosex-self"
EMBED_DIM = 768
BATCH_SIZE = 8

def blake3_hex(text: str) -> str:
    """Calcula hash BLAKE3 (ou fallback SHA256) de um trecho de texto."""
    if blake3:
        return blake3(text.encode("utf-8")).hexdigest()
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def point_id(content: str) -> str:
    """Gera UUID determinístico baseado no hash BLAKE3 do conteúdo."""
    h = blake3_hex(content)[:32]
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"

def create_collection(name: str):
    """Cria coleção dedicada no Qdrant se não existir."""
    try:
        req = Request(f"{QDRANT_URL}/collections/{name}", method="GET")
        urlopen(req, timeout=5)
        print(f"  ✅ Coleção '{name}' já existe no Qdrant (:6352)")
        return
    except Exception:
        pass

    body = json.dumps({
        "vectors": {"size": EMBED_DIM, "distance": "Cosine"},
        "hnsw_config": {"m": 16, "ef_construct": 100},
    })
    try:
        req = Request(
            f"{QDRANT_URL}/collections/{name}",
            data=body.encode(),
            headers={"Content-Type": "application/json"},
            method="PUT"
        )
        urlopen(req, timeout=10)
        print(f"  ✨ Coleção dedicada '{name}' CRIADA no Qdrant (dim={EMBED_DIM}, Cosine)")
    except Exception as e:
        print(f"  ❌ Erro ao criar coleção '{name}': {e}")

def chunk_text(text: str, max_chars: int = 800) -> list[str]:
    """Divide o texto em parágrafos preservando o contexto."""
    paragraphs = text.split("\n\n")
    chunks = []
    current = ""
    for p in paragraphs:
        if len(current) + len(p) < max_chars:
            current += p + "\n\n"
        else:
            if current.strip():
                chunks.append(current.strip())
            current = p + "\n\n"
    if current.strip():
        chunks.append(current.strip())
    return chunks or [text[:max_chars]]

def embed_batch(texts: list[str]) -> list[list[float]]:
    """Vetoriza em lote via MCP Embed server (:8081)."""
    try:
        req = Request(
            f"{EMBED_URL}/embed",
            data=json.dumps({"texts": texts}).encode(),
            headers={"Content-Type": "application/json"}
        )
        resp = urlopen(req, timeout=30)
        return json.loads(resp.read()).get("vectors", [])
    except Exception as e:
        print(f"  ⚠️ Erro ao vetorizar batch no embed server: {e}")
        return []

def ingest_to_qdrant(collection: str, vectors: list[list[float]], payloads: list[dict]):
    """Insere batch de vetores no Qdrant."""
    points = []
    for vec, payload in zip(vectors, payloads):
        points.append({
            "id": point_id(payload["content"]),
            "vector": vec,
            "payload": payload
        })
    body = json.dumps({"points": points})
    try:
        req = Request(
            f"{QDRANT_URL}/collections/{collection}/points",
            data=body.encode(),
            headers={"Content-Type": "application/json"},
            method="PUT"
        )
        urlopen(req, timeout=30)
        return len(points)
    except Exception as e:
        print(f"  ⚠️ Erro ao enviar pontos para o Qdrant: {e}")
        return 0

def run_ingestion():
    t0 = time.time()
    print("🚀 INICIANDO INGESTÃO SOBERANA CASOSEX")
    print(f"   Qdrant: {QDRANT_URL} | Embed: {EMBED_URL} | Dim: {EMBED_DIM}")
    print("=" * 60)

    create_collection(COLLECTION_CONVERSATION)
    create_collection(COLLECTION_SELF)

    targets = [
        ("docs/briefing/self-conversation/brienfin-conversation-v1.md", COLLECTION_CONVERSATION, "briefing-v1"),
        ("docs/briefing/self-conversation/brienfin-conversation-v2.md", COLLECTION_CONVERSATION, "briefing-v2"),
        ("docs/tecnica jury padrão dashboard.md", COLLECTION_SELF, "architecture-constitution"),
        ("docs/discovery/README.md", COLLECTION_SELF, "discovery-framework"),
        (".specify/memory/constitution.md", COLLECTION_SELF, "constitution"),
    ]

    for p in sorted(PROJECT_ROOT.glob("docs/adr/**/*.md")):
        targets.append((str(p.relative_to(PROJECT_ROOT)), COLLECTION_SELF, "adr"))
    for p in sorted(PROJECT_ROOT.glob("docs/handoff/**/*.md")):
        targets.append((str(p.relative_to(PROJECT_ROOT)), COLLECTION_SELF, "handoff"))
    for p in sorted(PROJECT_ROOT.glob("specs/**/*.md")):
        targets.append((str(p.relative_to(PROJECT_ROOT)), COLLECTION_SELF, "spec"))

    total_chunks = 0
    total_files = 0

    for rel_path, collection_name, kind in targets:
        full_path = PROJECT_ROOT / rel_path
        if not full_path.exists():
            continue

        try:
            content = full_path.read_text(encoding="utf-8")
        except Exception as e:
            print(f"  ⚠️ Não foi possível ler {rel_path}: {e}")
            continue

        if not content.strip():
            continue

        chunks = chunk_text(content)
        batch_texts = []
        batch_payloads = []
        file_chunks = 0

        for ci, chunk in enumerate(chunks):
            fp = blake3_hex(chunk)
            payload = {
                "source": rel_path,
                "kind": kind,
                "content": chunk,
                "chunk_index": ci,
                "total_chunks": len(chunks),
                "ingested_at": datetime.now(timezone.utc).isoformat(),
                "tag": "casosex",
                "project": "casosex",
                "blake3": fp,
            }
            batch_texts.append(chunk)
            batch_payloads.append(payload)

            if len(batch_texts) >= BATCH_SIZE:
                vectors = embed_batch(batch_texts)
                if vectors:
                    n = ingest_to_qdrant(collection_name, vectors, batch_payloads)
                    file_chunks += n
                batch_texts = []
                batch_payloads = []

        if batch_texts:
            vectors = embed_batch(batch_texts)
            if vectors:
                n = ingest_to_qdrant(collection_name, vectors, batch_payloads)
                file_chunks += n

        total_chunks += file_chunks
        total_files += 1
        print(f"  📄 [{kind:22}] {rel_path:50} -> {file_chunks} chunks -> '{collection_name}'", flush=True)

    elapsed_ms = (time.time() - t0) * 1000
    print("=" * 60)
    print(f"✅ Ingestão Soberana Concluída! {total_chunks} chunks de {total_files} arquivos em {elapsed_ms:.2f} ms", flush=True)

    try:
        import redis
        r = redis.Redis(host="127.0.0.1", port=6396, db=0, socket_timeout=1)
        r.set("casosex:telemetry:ingest:latency_ms", f"{elapsed_ms:.2f}")
        r.set("casosex:telemetry:ingest:total_chunks", str(total_chunks))
        r.set("casosex:telemetry:ingest:last_run", datetime.now(timezone.utc).isoformat())
        r.set("casosex:ooda:stage:orient", f"Coleção casosex-conversation ATIVA · {total_chunks} chunks ingeridos em {elapsed_ms:.1f}ms")
        print("  📊 Telemetria registrada com sucesso no Redis (:6396)", flush=True)
    except Exception as e:
        print(f"  ⚠️ Aviso Redis: {e}", flush=True)

if __name__ == "__main__":
    run_ingestion()
