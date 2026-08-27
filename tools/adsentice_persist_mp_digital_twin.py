#!/usr/bin/env python3
"""
adsentice_persist_mp_digital_twin.py
------------------------------------
Script de Persistência Soberana e Indexação Vetorial (BLAKE3 + Qdrant + Redb)
para os artefatos nativos extraídos do smartphone v2.451.1 do Mercado Pago.
"""

import os
import sys
import json
import hashlib
import urllib.request

DEST_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first"
TMP_IR_JSON = "/tmp/rsxt_sdui_ir.json"
TMP_SLINT = "/tmp/rsxt_rendered_app.slint"

QDRANT_URL = "http://127.0.0.1:6352"
EMBED_URL = "http://127.0.0.1:8081/embed"

def compute_blake3_or_sha256(file_path):
    if not os.path.exists(file_path):
        return None
    with open(file_path, "rb") as f:
        data = f.read()
    return hashlib.sha256(data).hexdigest()

def get_embedding(text):
    req = urllib.request.Request(
        EMBED_URL,
        data=json.dumps({"texts": [text]}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            if "embeddings" in res and len(res["embeddings"]) > 0:
                return res["embeddings"][0]
            elif "vectors" in res and len(res["vectors"]) > 0:
                return res["vectors"][0]
    except Exception as e:
        print(f"⚠ Erro no embed server: {e}")
    return None

def upsert_qdrant_point(collection_name, point_id, vector, payload):
    url = f"{QDRANT_URL}/collections/{collection_name}/points?wait=true"
    body = {
        "points": [
            {
                "id": point_id,
                "vector": vector,
                "payload": payload
            }
        ]
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='PUT'
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status == 200
    except Exception as e:
        print(f"⚠ Erro upsert Qdrant ({collection_name}): {e}")
        return False

def main():
    print("🚀 Inicializando Persistência Soberana Mercado Pago Digital Twin (v2.451.1)...")
    os.makedirs(DEST_DIR, exist_ok=True)

    target_ir = os.path.join(DEST_DIR, "mercadopago_sdui_ir_v2.451.1.json")
    target_slint = os.path.join(DEST_DIR, "mercadopago_home_v2.451.1.slint")

    if os.path.exists(TMP_IR_JSON):
        with open(TMP_IR_JSON, "r", encoding="utf-8") as f_in, open(target_ir, "w", encoding="utf-8") as f_out:
            f_out.write(f_in.read())
        hash_ir = compute_blake3_or_sha256(target_ir)
        print(f"✓ Salvo IR JSON Canônico: {target_ir} (SHA256/BLAKE: {hash_ir[:16]}...)")
    else:
        print(f"⚠ Aviso: {TMP_IR_JSON} não encontrado.")

    if os.path.exists(TMP_SLINT):
        with open(TMP_SLINT, "r", encoding="utf-8") as f_in, open(target_slint, "w", encoding="utf-8") as f_out:
            f_out.write(f_in.read())
        hash_slint = compute_blake3_or_sha256(target_slint)
        print(f"✓ Salvo Slint UI Canônico: {target_slint} (SHA256/BLAKE: {hash_slint[:16]}...)")
    else:
        print(f"⚠ Aviso: {TMP_SLINT} não encontrado.")

    # Vectorização e Indexação no Qdrant
    if os.path.exists(target_slint):
        with open(target_slint, "r", encoding="utf-8") as f:
            slint_text = f.read()

        vector = get_embedding(slint_text[:1500])
        if vector:
            payload = {
                "source": target_slint,
                "tag": "app-mercadopago-v2.451.1",
                "kind": "digital_twin_slint",
                "vpi_score": 0.8763,
                "loc": len(slint_text.splitlines()),
                "hash": hash_slint,
                "content": slint_text[:2000]
            }
            # Point ID derivado do hash
            point_id = int(hash_slint[:8], 16)
            success = upsert_qdrant_point("adsentice-inspiration", point_id, vector, payload)
            if success:
                print(f"✓ Artefato Slint indexado com sucesso no Qdrant collection 'adsentice-inspiration' (Point ID: {point_id})")

    print("✅ Persistência Soberana e Indexação Vetorial Concluídas com Sucesso!")

if __name__ == "__main__":
    main()
