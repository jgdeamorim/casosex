#!/usr/bin/env python3
# ==============================================================================
# Ingestor Soberano EmDash + Astro — Coleção 'adsentice-deploy'
# Qdrant :6352 | Embed :8081 | Redis :6396 | BLAKE3 Cache-Skip
# Tag: astro-emdash | Target: self-inspirations/emdash
# ==============================================================================

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

EMDASH_ROOT = Path("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/self-inspirations/emdash")
QDRANT_URL = os.getenv("QDRANT_URL", "http://127.0.0.1:6352")
EMBED_URL = os.getenv("EMBED_URL", "http://127.0.0.1:8081")
COLLECTION_NAME = "adsentice-deploy"
TAG_NAME = "astro-emdash"
EMBED_DIM = 768
BATCH_SIZE = 64
MAX_WORKERS = 8

def blake3_hex(text: str) -> str:
    """Calcula hash BLAKE3 (ou SHA256 fallback) determinístico."""
    if blake3:
        return blake3(text.encode("utf-8")).hexdigest()
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def point_id(content: str) -> str:
    """Gera UUID determinístico baseado no hash BLAKE3 do conteúdo."""
    h = blake3_hex(content)[:32]
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"

def create_collection_if_missing(name: str):
    """Garante a existência da coleção 'adsentice-deploy' no Qdrant :6352 com 768d Cosine."""
    try:
        req = Request(f"{QDRANT_URL}/collections/{name}", method="GET")
        urlopen(req, timeout=5)
        print(f"  ℹ️ Coleção '{name}' já existente no Qdrant.")
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
        print(f"  ✨ Coleção dedicada '{name}' CRIADA com sucesso no Qdrant (dim={EMBED_DIM}, Cosine)")
    except Exception as e:
        print(f"  ❌ Erro ao criar coleção '{name}': {e}", file=sys.stderr)

def get_existing_point_ids(collection: str, candidate_ids: list[str]) -> set[str]:
    """Fast Cache Check: Consulta em 1 requisição HTTP os IDs existentes no Qdrant (< 2ms)."""
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
        print(f"  ⚠️ Erro no Fast Cache Check: {e}", file=sys.stderr)
        return set()

def chunk_text(text: str, max_chars: int = 800) -> list[str]:
    """Divide o texto em blocos contínuos por parágrafo."""
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
    """Vetoriza lote em 768d no Embed Server (:8081) com 3 retentativas."""
    if not texts:
        return []
    for attempt in range(3):
        try:
            req = Request(
                f"{EMBED_URL}/embed",
                data=json.dumps({"texts": texts}).encode(),
                headers={"Content-Type": "application/json"}
            )
            resp = urlopen(req, timeout=30)
            return json.loads(resp.read()).get("vectors", [])
        except Exception as e:
            if attempt < 2:
                time.sleep(0.5 * (attempt + 1))
            else:
                print(f"  ⚠️ Erro no embed server (tentativa {attempt + 1}): {e}", file=sys.stderr)
    return []

def upsert_points(collection: str, points: list[dict]) -> int:
    """Insere pontos no Qdrant em 1 chamada HTTP."""
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
        print(f"  ⚠️ Erro ao enviar pontos para Qdrant: {e}", file=sys.stderr)
        return 0

def process_single_file(file_path: Path):
    """Processa 1 arquivo do acervo Emdash/Astro."""
    try:
        rel_path = str(file_path.relative_to(EMDASH_ROOT))
    except Exception:
        rel_path = str(file_path)

    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return 0, 0, rel_path

    if not content.strip():
        return 0, 0, rel_path

    ext = file_path.suffix.lower()
    kind = f"astro-{ext[1:]}" if ext.startswith(".") else "astro-code"

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
            "tag": TAG_NAME,
            "project": "astro-emdash",
            "blake3": fp,
        }
        chunk_items.append({"id": pid, "chunk": chunk, "payload": payload})
        candidate_ids.append(pid)

    existing_ids = get_existing_point_ids(COLLECTION_NAME, candidate_ids)
    missing_items = [item for item in chunk_items if item["id"] not in existing_ids]
    skipped_count = len(chunk_items) - len(missing_items)

    if not missing_items:
        return 0, skipped_count, rel_path

    missing_texts = [item["chunk"] for item in missing_items]
    all_vectors = []

    for i in range(0, len(missing_texts), BATCH_SIZE):
        batch = missing_texts[i:i + BATCH_SIZE]
        vecs = embed_batch(batch)
        all_vectors.extend(vecs)

    if len(all_vectors) != len(missing_items):
        return 0, skipped_count, rel_path

    points = []
    for item, vec in zip(missing_items, all_vectors):
        points.append({
            "id": item["id"],
            "vector": vec,
            "payload": item["payload"]
        })

    inserted = upsert_points(COLLECTION_NAME, points)
    return inserted, skipped_count, rel_path

def main():
    t0 = time.time()
    print(f"🚀 INICIANDO INGESTÃO SOBERANA — Coleção '{COLLECTION_NAME}' (Tag: {TAG_NAME})")
    print(f"   Origem: {EMDASH_ROOT}")
    print(f"   Qdrant: {QDRANT_URL} | Embed: {EMBED_URL} | Workers: {MAX_WORKERS}")
    print("=" * 70)

    create_collection_if_missing(COLLECTION_NAME)

    if not EMDASH_ROOT.exists():
        print(f"❌ Diretório de origem não encontrado: {EMDASH_ROOT}", file=sys.stderr)
        sys.exit(1)

    # Coleta de arquivos fonte relevantes (.astro, .ts, .tsx, .md, .json, .css, .config.ts, .yaml)
    valid_exts = {".astro", ".ts", ".tsx", ".md", ".json", ".css", ".yaml", ".yml", ".html"}
    files_to_process = []

    for root, dirs, files in os.walk(EMDASH_ROOT):
        # Ignora node_modules, .git, .astro, pnpm-store, dist
        dirs[:] = [d for d in dirs if d not in {"node_modules", ".git", ".astro", ".pnpm-store", "dist"}]
        for f in files:
            if f in {"pnpm-lock.yaml", "package-lock.json", "yarn.lock"}:
                continue
            fp = Path(root) / f
            if fp.suffix.lower() in valid_exts or f in {"README.md", "Dockerfile", "package.json", "AGENTS.md"}:
                files_to_process.append(fp)

    print(f"📦 Total de arquivos fonte identificados para ingestão: {len(files_to_process)}")

    total_inserted = 0
    total_skipped = 0
    total_files = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_single_file, fp): fp for fp in files_to_process}
        for future in as_completed(futures):
            inserted, skipped, rel_path = future.result()
            if inserted > 0 or skipped > 0:
                total_inserted += inserted
                total_skipped += skipped
                total_files += 1
                if inserted > 0:
                    print(f"  📄 ⚡ {inserted} novos | ⚡ {skipped} cached -> {rel_path}", flush=True)

    elapsed_ms = (time.time() - t0) * 1000
    print("=" * 70)
    print(f"✅ Ingestão 'adsentice-deploy' Concluída em {elapsed_ms:.2f} ms")
    print(f"📊 Novos vetores inseridos: {total_inserted} | Chunks em cache BLAKE3: {total_skipped} | Arquivos: {total_files}")

    # Registro de Telemetria no Redis :6396
    try:
        import redis
        r = redis.Redis(host="127.0.0.1", port=6396, db=0, socket_timeout=1)
        telemetry = {
            "collection": COLLECTION_NAME,
            "tag": TAG_NAME,
            "total_inserted": total_inserted,
            "total_skipped": total_skipped,
            "total_files": total_files,
            "latency_ms": round(elapsed_ms, 2),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        r.set("adsentice:telemetry:ingest:emdash", json.dumps(telemetry))
        r.set("adsentice:ooda:stage:act", f"SELADO INGESTÃO adsentice-deploy (tag=astro-emdash) · {total_inserted} novos / {total_skipped} cached em {elapsed_ms:.1f}ms")
        print("  📊 Telemetria registrada com sucesso no Redis (:6396)", flush=True)
    except Exception as e:
        print(f"  ⚠️ Aviso Redis Telemetria: {e}", flush=True)

if __name__ == "__main__":
    main()
