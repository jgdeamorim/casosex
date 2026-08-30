#!/usr/bin/env python3
"""
ingest_langflow_casosex.py (v2.0 Robust)
Ingestão Soberana do Core Langflow-Main (CASOSEX Cockpit Infrastructure) no Qdrant :6352 com tag=langflow-casosex.
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

PROJECT_ROOT = Path("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX")
LANGFLOW_ROOT = PROJECT_ROOT / "self-essentials/langflow-main"
QDRANT_URL = os.getenv("QDRANT_URL", "http://127.0.0.1:6352")
EMBED_URL = os.getenv("EMBED_URL", "http://127.0.0.1:8081")
COLLECTION_SELF = "casosex-self"
TAG_NAME = "langflow-casosex"
EMBED_DIM = 768
BATCH_SIZE = 16
MAX_WORKERS = 4

def blake3_hex(text: str) -> str:
    if blake3:
        return blake3(text.encode("utf-8")).hexdigest()
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def point_id(content: str) -> str:
    h = blake3_hex(content)[:32]
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"

def get_existing_point_ids(collection: str, candidate_ids: list[str]) -> set[str]:
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
        return {item["id"] for item in data.get("result", [])}
    except Exception:
        return set()

def chunk_text(text: str, max_chars: int = 1000) -> list[str]:
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

def embed_batch(texts: list[str], retries: int = 3) -> list[list[float]]:
    if not texts:
        return []
    for attempt in range(retries):
        try:
            req = Request(
                f"{EMBED_URL}/embed",
                data=json.dumps({"texts": texts}).encode(),
                headers={"Content-Type": "application/json"}
            )
            resp = urlopen(req, timeout=60)
            return json.loads(resp.read()).get("vectors", [])
        except Exception as e:
            if attempt == retries - 1:
                print(f"  ⚠️ Embed retry falhou ({attempt+1}/{retries}): {e}")
                return []
            time.sleep(0.5 * (attempt + 1))
    return []

def upsert_points(collection: str, points: list[dict]) -> int:
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
        print(f"  ⚠️ Qdrant upsert error: {e}")
        return 0

def process_file(full_path: Path, collection_name: str, kind: str):
    try:
        rel_path = str(full_path.relative_to(PROJECT_ROOT))
    except Exception:
        rel_path = str(full_path)

    if not full_path.exists() or not full_path.is_file():
        return 0, 0, rel_path, kind

    try:
        content = full_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return 0, 0, rel_path, kind

    if not content.strip():
        return 0, 0, rel_path, kind

    chunks = chunk_text(content)
    chunk_items = []
    candidate_ids = []

    for ci, chunk in enumerate(chunks):
        pid = point_id(f"{rel_path}:{ci}:{chunk}")
        fp = blake3_hex(chunk)
        payload = {
            "source": rel_path,
            "kind": kind,
            "content": chunk,
            "chunk_index": ci,
            "total_chunks": len(chunks),
            "ingested_at": datetime.now(timezone.utc).isoformat(),
            "tag": TAG_NAME,
            "project": "casosex",
            "blake3": fp,
        }
        chunk_items.append({"id": pid, "chunk": chunk, "payload": payload})
        candidate_ids.append(pid)

    existing_ids = get_existing_point_ids(collection_name, candidate_ids)
    missing_items = [item for item in chunk_items if item["id"] not in existing_ids]
    skipped_count = len(chunk_items) - len(missing_items)

    if not missing_items:
        return 0, skipped_count, rel_path, kind

    missing_texts = [item["chunk"] for item in missing_items]
    all_vectors = []

    for i in range(0, len(missing_texts), BATCH_SIZE):
        batch = missing_texts[i:i + BATCH_SIZE]
        vecs = embed_batch(batch)
        all_vectors.extend(vecs)

    if len(all_vectors) != len(missing_items):
        return 0, skipped_count, rel_path, kind

    points = []
    for item, vec in zip(missing_items, all_vectors):
        points.append({
            "id": item["id"],
            "vector": vec,
            "payload": item["payload"]
        })

    inserted = upsert_points(collection_name, points)
    return inserted, skipped_count, rel_path, kind

def run():
    t0 = time.time()
    print(f"🚀 INICIANDO INGESTÃO LANGFLOW-MAIN NO QDRANT ({COLLECTION_SELF})")
    print(f"   Diretório: {LANGFLOW_ROOT}")
    print(f"   Tag: {TAG_NAME} | Qdrant: {QDRANT_URL} | Embed: {EMBED_URL}")
    print("=" * 70)

    files_to_ingest = []
    
    # 1. Documentação e Specs (.md, .txt)
    for p in LANGFLOW_ROOT.glob("**/*.md"):
        if "node_modules" not in str(p) and ".venv" not in str(p):
            files_to_ingest.append((p, COLLECTION_SELF, "langflow-doc"))
    for p in LANGFLOW_ROOT.glob("docs/**/*.txt"):
        files_to_ingest.append((p, COLLECTION_SELF, "langflow-doc"))

    # 2. Somente Custom Nodes e Core API Schemas (excluindo UI bruta / frontend extenso)
    src_custom_nodes = LANGFLOW_ROOT / "src/backend/base/langflow/custom"
    if src_custom_nodes.exists():
        for p in src_custom_nodes.glob("**/*.py"):
            if "__pycache__" not in str(p) and ".venv" not in str(p) and "test" not in str(p):
                files_to_ingest.append((p, COLLECTION_SELF, "langflow-backend-node"))

    print(f"📦 Total de arquivos essenciais (Docs/Specs/Nodes): {len(files_to_ingest)}")

    total_inserted = 0
    total_skipped = 0
    total_files = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_file, item[0], item[1], item[2]): item for item in files_to_ingest}
        for future in as_completed(futures):
            inserted, skipped, rel_path, kind = future.result()
            if inserted > 0 or skipped > 0:
                total_inserted += inserted
                total_skipped += skipped
                total_files += 1
                if inserted > 0:
                    print(f"  📄 [{kind:22}] {rel_path[-60:]:60} -> ⚡ {inserted} novos | ⚡ {skipped} cached", flush=True)

    elapsed_s = time.time() - t0
    print("=" * 70)
    print(f"✅ Ingestão Langflow concluída com sucesso!")
    print(f"   Arquivos: {total_files} | Novos Chunks: {total_inserted} | Chunks em Cache: {total_skipped} | Tempo: {elapsed_s:.2f}s")

    # Registrar telemetria no Redis :6396
    try:
        import redis
        r = redis.Redis(host="127.0.0.1", port=6396, db=0, socket_timeout=2)
        r.set("casosex:ingest:langflow:total_files", str(total_files))
        r.set("casosex:ingest:langflow:total_chunks", str(total_inserted + total_skipped))
        r.set("casosex:ingest:langflow:tag", TAG_NAME)
        r.set("casosex:ingest:langflow:last_run", datetime.now(timezone.utc).isoformat())
        print("  📊 Telemetria registrada em Redis :6396 (key: casosex:ingest:langflow:*)")
    except Exception as e:
        print(f"  ⚠️ Aviso Redis: {e}")

if __name__ == "__main__":
    run()
