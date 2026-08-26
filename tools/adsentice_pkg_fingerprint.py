#!/usr/bin/env python3
"""
adsentice_pkg_fingerprint.py — Sensor Fingerprint BLAKE3 de package.json (ADR-0135 §4.6)

Calcula e valida assinaturas determinísticas BLAKE3 dos arquivos package.json do monorepo.
Armazena a impressão digital no Redis :6396 sob o namespace `adsentice:dev:pkg:*`.

Uso:
  python3 tools/adsentice_pkg_fingerprint.py           # Calcula, salva no Redis e exibe o fingerprint
  python3 tools/adsentice_pkg_fingerprint.py --check   # Retorna código 0 se inalterado, 1 se modificado
"""
import argparse
import hashlib
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

try:
    from hashlib import blake3
except ImportError:
    blake3 = None

PROJECT_ROOT = Path(__file__).parent.parent
REDIS_HOST, REDIS_PORT = "127.0.0.1", 6396
REDIS_KEY_FINGERPRINT = "adsentice:dev:pkg:fingerprint"
REDIS_KEY_HASH = "adsentice:dev:pkg:combined_hash"
REDIS_KEY_SYNC = "adsentice:dev:pkg:last_sync"


def compute_blake3(data: bytes) -> str:
    if blake3:
        return blake3(data).hexdigest()
    return hashlib.sha256(data).hexdigest()


def scan_package_files() -> dict[str, str]:
    pkg_files = sorted(PROJECT_ROOT.glob("**/package.json"))
    hashes = {}
    for p in pkg_files:
        # Ignora node_modules e subpastas de depuração/build
        rel_path = str(p.relative_to(PROJECT_ROOT))
        if "node_modules" in rel_path or ".next" in rel_path or "dist" in rel_path:
            continue
        try:
            content = p.read_bytes()
            hashes[rel_path] = compute_blake3(content)
        except OSError:
            pass
    return hashes


def get_redis_client():
    try:
        import redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=1, decode_responses=True)
        r.ping()
        return r
    except Exception as e:
        print(f"⚠️ Redis (:6396) indisponível: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(description="BLAKE3 Fingerprint Sensor for package.json")
    parser.add_argument("--check", action="store_true", help="Verifica se houve alteração desde o último registro no Redis")
    args = parser.parse_args()

    t0 = time.time()
    pkg_hashes = scan_package_files()
    if not pkg_hashes:
        print("⚠️ Nenhum package.json encontrado no monorepo.")
        sys.exit(1)

    combined_input = "".join(f"{k}:{v}" for k, v in sorted(pkg_hashes.items()))
    combined_hash = compute_blake3(combined_input.encode("utf-8"))
    iso_now = datetime.now(timezone.utc).isoformat()

    r = get_redis_client()

    if args.check:
        if not r:
            print("⚠️ Impossível checar sem conexão com Redis.")
            sys.exit(1)
        cached_hash = r.get(REDIS_KEY_HASH)
        if cached_hash == combined_hash:
            print(f"✅ package.json Inalterado (BLAKE3: {combined_hash[:16]}...)")
            sys.exit(0)
        else:
            print(f"⚡ DIVERGÊNCIA DETECTADA: cached={cached_hash[:16] if cached_hash else 'NONE'}, live={combined_hash[:16]}...")
            sys.exit(1)

    # Persiste no Redis
    if r:
        payload = {
            "combined_hash": combined_hash,
            "updated_at": iso_now,
            "file_count": len(pkg_hashes),
            "files": pkg_hashes,
        }
        with r.pipeline() as pipe:
            pipe.set(REDIS_KEY_FINGERPRINT, json.dumps(payload, ensure_ascii=False))
            pipe.set(REDIS_KEY_HASH, combined_hash)
            pipe.set(REDIS_KEY_SYNC, iso_now)
            pipe.execute()

    elapsed_ms = (time.time() - t0) * 1000
    print(f"📦 Fingerprint BLAKE3 package.json Concluído em {elapsed_ms:.2f}ms")
    print(f"   Arquivos Auditados: {len(pkg_hashes)}")
    print(f"   Hash Combinado: {combined_hash}")
    for k, v in pkg_hashes.items():
        print(f"   • {k}: {v[:16]}...")


if __name__ == "__main__":
    main()
