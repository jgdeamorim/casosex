#!/usr/bin/env python3
"""
casosex_self_ingest.py (Versão Ferrari Turbo v2.0)
Pipeline Soberano de Ingestão do CASOSEX:
1. Validação/Criação das coleções 'casosex-conversation' e 'casosex-self' no Qdrant :6352.
2. Fast BLAKE3 Cache-Skip: Verificação de existência em lote (< 2ms) no Qdrant; pula chunks não modificados.
3. Vetorização Paralela Multi-threaded (ThreadPoolExecutor, batch_size=64) via MCP Embed (:8081).
4. Bulk Upsert em 1 única requisição HTTP por arquivo no Qdrant.
5. Ingestão de docs/conversation + docs/briefing + ADRs + Specs + Handoffs.
6. Telemetria e estado OODA registrados no Redis :6396.
"""

import hashlib
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
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
MAX_WORKERS = 1

def blake3_hex(text: str) -> str:
    """Calcula hash BLAKE3 (ou SHA256 fallback) determinístico."""
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

def get_existing_point_ids(collection: str, candidate_ids: list[str]) -> set[str]:
    """Consulta em 1 requisição HTTP quais IDs de pontos já existem no Qdrant."""
    if not candidate_ids:
        return set()
    body = json.dumps({"ids": candidate_ids})
    try:
        req = Request(
            f"{QDRANT_URL}/collections/{collection}/points",
            data=body.encode(),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        resp = urlopen(req, timeout=10)
        data = json.loads(resp.read())
        existing = {item["id"] for item in data.get("result", [])}
        return existing
    except Exception as e:
        print(f"  ⚠️ Erro ao consultar pontos existentes: {e}")
        return set()

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
    """Vetoriza lote via MCP Embed server (:8081)."""
    if not texts:
        return []
    try:
        req = Request(
            f"{EMBED_URL}/embed",
            data=json.dumps({"texts": texts}).encode(),
            headers={"Content-Type": "application/json"}
        )
        resp = urlopen(req, timeout=120)
        return json.loads(resp.read()).get("vectors", [])
    except Exception as e:
        print(f"  ⚠️ Erro ao vetorizar batch no embed server: {e}")
        return []

def upsert_points(collection: str, points: list[dict]) -> int:
    """Insere lista de pontos no Qdrant em 1 única requisição HTTP."""
    if not points:
        return 0
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
        print(f"  ⚠️ Erro ao enviar pontos para Qdrant: {e}")
        return 0

def process_file_target(target_info):
    """Processa 1 arquivo: chunking -> BLAKE3 check -> vetorização batch -> upsert."""
    rel_path, collection_name, kind = target_info
    full_path = PROJECT_ROOT / rel_path
    if not full_path.exists():
        return 0, 0, rel_path, kind, collection_name

    try:
        content = full_path.read_text(encoding="utf-8")
    except Exception:
        return 0, 0, rel_path, kind, collection_name

    if not content.strip():
        return 0, 0, rel_path, kind, collection_name

    chunks = chunk_text(content)
    chunk_items = []
    candidate_ids = []

    for ci, chunk in enumerate(chunks):
        pid = point_id(chunk)
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
        chunk_items.append({"id": pid, "chunk": chunk, "payload": payload})
        candidate_ids.append(pid)

    # 1. Fast BLAKE3 Cache-Skip Check
    existing_ids = get_existing_point_ids(collection_name, candidate_ids)
    missing_items = [item for item in chunk_items if item["id"] not in existing_ids]

    skipped_count = len(chunk_items) - len(missing_items)

    if not missing_items:
        return 0, skipped_count, rel_path, kind, collection_name

    # 2. Batch Embedding dos itens faltantes (BATCH_SIZE=64)
    missing_texts = [item["chunk"] for item in missing_items]
    all_vectors = []

    for i in range(0, len(missing_texts), BATCH_SIZE):
        batch = missing_texts[i:i + BATCH_SIZE]
        vecs = embed_batch(batch)
        all_vectors.extend(vecs)

    if len(all_vectors) != len(missing_items):
        print(f"  ⚠️ Mismatch de vetores ({len(all_vectors)} vs {len(missing_items)}) em {rel_path}")
        return 0, skipped_count, rel_path, kind, collection_name

    # 3. Construção dos pontos e Bulk Upsert
    points = []
    for item, vec in zip(missing_items, all_vectors):
        points.append({
            "id": item["id"],
            "vector": vec,
            "payload": item["payload"]
        })

    inserted = upsert_points(collection_name, points)
    return inserted, skipped_count, rel_path, kind, collection_name

def run_ingestion():
    t0 = time.time()
    print("🏎️ INICIANDO INGESTÃO FERRARI TURBO v2.0 (CASOSEX)")
    print(f"   Qdrant: {QDRANT_URL} | Embed: {EMBED_URL} | Batch: {BATCH_SIZE} | Workers: {MAX_WORKERS}")
    print("=" * 70)

    create_collection(COLLECTION_CONVERSATION)
    create_collection(COLLECTION_SELF)

    targets = [
        ("docs/briefing/self-conversation/brienfin-conversation-v1.md", COLLECTION_CONVERSATION, "briefing-v1"),
        ("docs/briefing/self-conversation/brienfin-conversation-v2.md", COLLECTION_CONVERSATION, "briefing-v2"),
        ("docs/tecnica jury padrão dashboard.md", COLLECTION_SELF, "architecture-constitution"),
        ("docs/discovery/README.md", COLLECTION_SELF, "discovery-framework"),
        (".specify/memory/constitution.md", COLLECTION_SELF, "constitution"),
    ]

    for p in sorted(PROJECT_ROOT.glob("docs/conversation/**/*.md")):
        targets.append((str(p.relative_to(PROJECT_ROOT)), COLLECTION_CONVERSATION, "conversation-log"))
    for p in sorted(PROJECT_ROOT.glob("docs/adr/**/*.md")):
        targets.append((str(p.relative_to(PROJECT_ROOT)), COLLECTION_SELF, "adr"))
    for p in sorted(PROJECT_ROOT.glob("docs/handoff/**/*.md")):
        targets.append((str(p.relative_to(PROJECT_ROOT)), COLLECTION_SELF, "handoff"))
    for p in sorted(PROJECT_ROOT.glob("specs/**/*.md")):
        targets.append((str(p.relative_to(PROJECT_ROOT)), COLLECTION_SELF, "spec"))

    total_inserted = 0
    total_skipped = 0
    total_files = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_file_target, target): target for target in targets}
        for future in as_completed(futures):
            inserted, skipped, rel_path, kind, collection_name = future.result()
            if inserted > 0 or skipped > 0:
                total_inserted += inserted
                total_skipped += skipped
                total_files += 1
                status_str = f"⚡ {inserted} novos | ⚡ {skipped} cached"
                print(f"  📄 [{kind:22}] {rel_path:50} -> {status_str} -> '{collection_name}'", flush=True)

    elapsed_ms = (time.time() - t0) * 1000
    print("=" * 70)
    print(f"✅ Ingestão Ferrari Concluída! {total_inserted} novos, {total_skipped} em cache ({total_files} arquivos) em {elapsed_ms:.2f} ms", flush=True)

    try:
        import redis
        r = redis.Redis(host="127.0.0.1", port=6396, db=0, socket_timeout=1)
        r.set("casosex:telemetry:ingest:latency_ms", f"{elapsed_ms:.2f}")
        r.set("casosex:telemetry:ingest:total_chunks", str(total_inserted + total_skipped))
        r.set("casosex:telemetry:ingest:last_run", datetime.now(timezone.utc).isoformat())
        r.set("casosex:ooda:stage:act", f"SELADO INGESTÃO FERRARI v2.0 · {total_inserted} novos / {total_skipped} cached em {elapsed_ms:.1f}ms")
        print("  📊 Telemetria registrada com sucesso no Redis (:6396)", flush=True)
    except Exception as e:
        print(f"  ⚠️ Aviso Redis: {e}", flush=True)

if __name__ == "__main__":
    run_ingestion()
