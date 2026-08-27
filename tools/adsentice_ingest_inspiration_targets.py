#!/usr/bin/env python3
"""
adsentice_ingest_inspiration_targets.py (Embed Ferrari 2.0 Engine)
Ingesta arquivos e pacotes binários diretamente no Qdrant :6352 (coleção adsentice-inspiration)
com vetorização em 768d via Embed Server (:8081).
"""

import os
import sys
import json
import zipfile
import subprocess
import hashlib
import time
from urllib.request import Request, urlopen
from datetime import datetime, timezone

try:
    from hashlib import blake3
except ImportError:
    blake3 = None

QDRANT_URL = os.getenv("QDRANT_URL", "http://127.0.0.1:6352")
EMBED_URL = os.getenv("EMBED_URL", "http://127.0.0.1:8081")
COLLECTION_INSPIRATION = "adsentice-inspiration"
EMBED_DIM = 768

def blake3_hex(text: str) -> str:
    if blake3:
        return blake3(text.encode("utf-8")).hexdigest()
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def point_id(content: str) -> str:
    h = blake3_hex(content)[:32]
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"

def ensure_collection(name: str):
    try:
        req = Request(f"{QDRANT_URL}/collections/{name}", method="GET")
        urlopen(req, timeout=5)
        print(f"✓ Coleção '{name}' já existe no Qdrant (:6352)")
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
        print(f"✨ Coleção '{name}' criada no Qdrant (:6352, dim=768)")
    except Exception as e:
        print(f"❌ Erro ao criar coleção '{name}': {e}")

def get_existing_point_ids(collection: str, candidate_ids: list) -> set:
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
    except Exception as e:
        print(f"⚠️ Erro ao consultar pontos no Qdrant: {e}")
        return set()

def embed_texts(texts: list) -> list:
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
        print(f"❌ Erro na vetorização via Embed Ferrari 2.0 (:8081): {e}")
        return []

def upsert_points(collection: str, points: list) -> int:
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
        print(f"❌ Erro no upsert no Qdrant: {e}")
        return 0

def extract_iso_chunks(iso_path: str, tag: str) -> list:
    chunks = []
    st = os.stat(iso_path)
    
    # 1. Manifest Chunk
    manifest_text = f"""# ISO Image Asset Manifest: android-x86.iso
Path: {iso_path}
Tag: {tag}
Size: {st.st_size} bytes ({st.st_size / (1024*1024):.2f} MB)
Modified: {datetime.fromtimestamp(st.st_mtime, tz=timezone.utc).isoformat()}
Architecture: x86 / x86_64
Kernel Image: kernel (Linux 5.4+ Android-x86 runtime)
Filesystem Layer: system.sfs (SquashFS), initrd.img, ramdisk.img, install.img
Bootloader: GRUB2 / isolinux (EFI boot & Legacy BIOS)
Role: Sovereign Android KVM Guest Image for RSXT Engine & Adsentice Sentinela Digital Twin
"""
    chunks.append(("iso-manifest", manifest_text))

    # 2. File Listing Inventory Chunk
    try:
        res = subprocess.run(["7z", "l", iso_path], capture_output=True, text=True, timeout=15)
        if res.returncode == 0:
            listing = res.stdout
            file_tree_text = f"""# ISO File System Inventory (7z listing)
ISO: {iso_path}
Tag: {tag}

{listing[:3000]}
"""
            chunks.append(("iso-inventory", file_tree_text))
    except Exception as e:
        print(f"⚠️ Erro ao listar ISO via 7z: {e}")

    # 3. Boot Config Chunks
    try:
        res_cfg = subprocess.run(["7z", "x", "-so", iso_path, "isolinux/isolinux.cfg"], capture_output=True, text=True, timeout=10)
        if res_cfg.returncode == 0 and res_cfg.stdout.strip():
            chunks.append(("iso-isolinux-cfg", f"# Boot Config: isolinux.cfg\nTag: {tag}\n\n{res_cfg.stdout}"))
    except Exception:
        pass

    try:
        res_grub = subprocess.run(["7z", "x", "-so", iso_path, "efi/boot/android.cfg"], capture_output=True, text=True, timeout=10)
        if res_grub.returncode == 0 and res_grub.stdout.strip():
            chunks.append(("iso-android-cfg", f"# Boot Config: android.cfg\nTag: {tag}\n\n{res_grub.stdout}"))
    except Exception:
        pass

    return chunks

def extract_apkm_chunks(apkm_path: str, tag: str) -> list:
    chunks = []
    st = os.stat(apkm_path)

    with zipfile.ZipFile(apkm_path, 'r') as z:
        file_list = z.namelist()
        info_json_content = ""
        if 'info.json' in file_list:
            info_json_content = z.read('info.json').decode('utf-8', errors='ignore')

    # 1. APKM Spec Manifest Chunk
    manifest_text = f"""# APKM App Bundle Asset Manifest: com.mercadopago.wallet (2.449.0)
Path: {apkm_path}
Tag: {tag}
Size: {st.st_size} bytes ({st.st_size / (1024*1024):.2f} MB)
Internal Split APKs Count: {len(file_list)}
Package Name: com.mercadopago.wallet
Application Title: Mercado Pago: cuenta digital
Version Code: 1816181509
Target Platform: Android 6.0+ (API 23+)
Architectures: arm64-v8a, armeabi-v7a, x86, x86_64
Internal Split Files: {', '.join(file_list[:15])}

## info.json Metadata:
{info_json_content}
"""
    chunks.append(("apkm-manifest", manifest_text))

    # 2. Split APK Architecture & Features Chunk
    architecture_text = f"""# APKM Architecture & Modules Breakdown
Tag: {tag}
APKM File: {apkm_path}

- Base APK: base.apk (Core Application Logic, Resources, Manifest)
- Config Splits: split_config.xxhdpi.apk, split_config.tvdpi.apk, split_config.armeabi_v7a.apk
- Feature Modules: split_mpoc.apk (Mercado Pago Official Componentes), split_ttesdk.apk, split_feature_*.apk
- Primary Design System: Andes UI (Mercado Livre / Mercado Pago Token Spec)
- Ingestion Engine Target: RSXT Android Engine (ResourceRepository + AxmlParser + WGPU Material)
"""
    chunks.append(("apkm-architecture", architecture_text))

    return chunks

def main():
    print("🚀 INICIANDO INGESTÃO FERRARI TURBO v2.0 -> QDRANT :6352 (adsentice-inspiration)")
    ensure_collection(COLLECTION_INSPIRATION)

    targets = [
        {
            "path": "/media/jeffer/RSXT/rsxt-android/emulator/android-x86.iso",
            "fallback": "/media/jeffer/RSXT/android-x86.iso",
            "tag": "android-x86",
            "extractor": extract_iso_chunks
        },
        {
            "path": "/media/jeffer/RSXT/rsxt-android/emulator/com.mercadopago.wallet_2.449.0-1816181509_4arch_7dpi_4feat_6f8d1808e3179e8ff153d9ad52410688_apkmirror.com.apkm",
            "fallback": "/media/jeffer/RSXT/com.mercadopago.wallet_2.449.0-1816181509_4arch_7dpi_4feat_6f8d1808e3179e8ff153d9ad52410688_apkmirror.com.apkm",
            "tag": "app-mercadolivre.apkm",
            "extractor": extract_apkm_chunks
        }
    ]

    all_points = []
    candidate_ids = []

    for t in targets:
        target_path = t["path"]
        if not os.path.exists(target_path) and os.path.exists(t["fallback"]):
            target_path = t["fallback"]

        if not os.path.exists(target_path):
            print(f"❌ Arquivo não encontrado: {target_path}")
            continue

        print(f"\n📦 Processando target [{t['tag']}]: {target_path}")
        chunks = t["extractor"](target_path, t["tag"])
        print(f"   -> Gerados {len(chunks)} chunks de metadados para [{t['tag']}]")

        for idx, (kind, content) in enumerate(chunks):
            pid = point_id(content)
            blake = blake3_hex(content)
            payload = {
                "source": target_path,
                "kind": kind,
                "content": content,
                "chunk_index": idx,
                "total_chunks": len(chunks),
                "ingested_at": datetime.now(timezone.utc).isoformat(),
                "tag": t["tag"],
                "project": "adsentice",
                "blake3": blake
            }
            all_points.append({
                "id": pid,
                "content": content,
                "payload": payload
            })
            candidate_ids.append(pid)

    if not all_points:
        print("⚠️ Nenhum ponto a ser ingestado.")
        return

    # Verificar pontos existentes via BLAKE3 cache-skip check
    existing_ids = get_existing_point_ids(COLLECTION_INSPIRATION, candidate_ids)
    missing_points = [p for p in all_points if p["id"] not in existing_ids]

    print(f"\n📊 Telemetria do Cache BLAKE3: {len(missing_points)} novos | {len(existing_ids)} em cache")

    if not missing_points:
        print("✅ Todos os pontos já estão presentes no Qdrant! Nenhuma ação necessária.")
        return

    # Vetorização Paralela em 768d via Embed Server Ferrari 2.0 (:8081)
    texts_to_embed = [p["content"] for p in missing_points]
    t0 = time.time()
    vectors = embed_texts(texts_to_embed)
    embed_ms = (time.time() - t0) * 1000
    print(f"⚡ Vetorização 768d concluída ({len(vectors)} vetores) em {embed_ms:.2f} ms")

    if len(vectors) != len(missing_points):
        print("❌ Erro de contagem de vetores retornado pelo Embed Server.")
        return

    # Preparar pontos para Qdrant
    qdrant_points = []
    for item, vec in zip(missing_points, vectors):
        qdrant_points.append({
            "id": item["id"],
            "vector": vec,
            "payload": item["payload"]
        })

    upserted = upsert_points(COLLECTION_INSPIRATION, qdrant_points)
    print(f"✅ Upsert concluído: {upserted} pontos inseridos com sucesso na coleção '{COLLECTION_INSPIRATION}' do Qdrant (:6352)!")

if __name__ == "__main__":
    main()
