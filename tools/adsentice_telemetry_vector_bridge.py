#!/usr/bin/env python3
"""
Ponte de Vetorização e Indexação Qdrant de Telemetria Físico-Soberana
Mapeia o dump do dispositivo Android via USB (/tmp/bone_dump.xml e /tmp/rsxt_sdui_ir.json),
calcula o hash BLAKE3, gera o embedding em 768d no Embed Server (:8081) e indexa no Qdrant (:6352)
com as tags soberanas: app-mercadopago, app-jury, android-usb-physical, app-mercadolivre-apkm.

Doutrina: medido=verdade | ADR-0200
"""

import sys
import os
import json
import hashlib
import uuid
import datetime
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Optional

EMBED_SERVER_URL = "http://127.0.0.1:8081/embed"
QDRANT_URL = "http://127.0.0.1:6352"
REDIS_HOST = "127.0.0.1"
REDIS_PORT = 6396

DUMP_XML_PATH = "/tmp/bone_dump.xml"
SDUI_IR_PATH = "/tmp/rsxt_sdui_ir.json"
COLLECTION_NAME = "casosex-inspiration"

def compute_blake3(filepath: str) -> str:
    """Calcula hash de arquivo (fallback sha256/md5 formatado se blake3 não instalado)"""
    if not os.path.exists(filepath):
        return "file_not_found"
    try:
        import blake3
        hasher = blake3.blake3()
        with open(filepath, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        return hasher.hexdigest()
    except ImportError:
        hasher = hashlib.sha256()
        with open(filepath, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        return f"sha256_{hasher.hexdigest()}"

def get_embedding(text: str) -> List[float]:
    """Obtém o vetor de 768 float32 a partir do Embed Server :8081"""
    req_payload = json.dumps({"texts": [text]}).encode('utf-8')
    req = urllib.request.Request(
        EMBED_SERVER_URL,
        data=req_payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        vectors = data.get("vectors", [])
        if vectors and len(vectors) > 0:
            return vectors[0]
    raise ValueError("Falha ao gerar vetor de embedding no Embed Server :8081")

def index_in_qdrant(point_id: str, vector: List[float], payload: Dict[str, Any], collection: str = COLLECTION_NAME) -> bool:
    """Upsert de ponto no Qdrant :6352"""
    upsert_url = f"{QDRANT_URL}/collections/{collection}/points"
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
        upsert_url,
        data=json.dumps(body).encode('utf-8'),
        headers={"Content-Type": "application/json"},
        method="PUT"
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res.get("status") == "ok"

def query_qdrant_similarity(query_text: str, collection: str = COLLECTION_NAME, limit: int = 3) -> List[Dict[str, Any]]:
    """Busca semântica no Qdrant usando embedding do texto de busca"""
    query_vector = get_embedding(query_text)
    search_url = f"{QDRANT_URL}/collections/{collection}/points/search"
    body = {
        "vector": query_vector,
        "limit": limit,
        "with_payload": True
    }
    req = urllib.request.Request(
        search_url,
        data=json.dumps(body).encode('utf-8'),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res.get("result", [])

def extract_andes_components(ir_doc: Dict[str, Any]) -> List[str]:
    """Extrai os tipos semânticos de componentes Andes UI presentes no IR"""
    components = set()
    root = ir_doc.get("root_node", {})
    
    def traverse(node):
        if not node:
            return
        component_type = node.get("component_type")
        if component_type:
            components.add(component_type)
        for child in node.get("children", []):
            traverse(child)
            
    traverse(root)
    return list(components)

def build_summary_text(ir_doc: Dict[str, Any], xml_hash: str, ir_hash: str) -> str:
    """Gera o texto sintético para o embedding 768d"""
    device_info = ir_doc.get("device_info", "Android Physical USB Device")
    components = extract_andes_components(ir_doc)
    
    summary = f"Mercado Pago SDUI Dump - Device: {device_info} | BLAKE3 XML: {xml_hash[:16]} | BLAKE3 IR: {ir_hash[:16]} | Andes Components: {', '.join(components)}"
    return summary

def run_bridge_ingestion():
    """Executa o pipeline completo de indexação do probe USB"""
    print("🔌 [VectorBridge] Iniciando ingestão vetorial do probe ADB USB...")
    
    if not os.path.exists(SDUI_IR_PATH):
        print(f"❌ Erro: Arquivo IR JSON não encontrado em {SDUI_IR_PATH}. Execute o mapper primeiro.")
        sys.exit(1)
        
    blake3_xml = compute_blake3(DUMP_XML_PATH)
    blake3_ir = compute_blake3(SDUI_IR_PATH)
    
    with open(SDUI_IR_PATH, "r", encoding="utf-8") as f:
        ir_doc = json.load(f)
        
    summary_text = build_summary_text(ir_doc, blake3_xml, blake3_ir)
    andes_components = extract_andes_components(ir_doc)
    
    print(f"🔑 Checksum BLAKE3 XML: {blake3_xml[:24]}...")
    print(f"🔑 Checksum BLAKE3 IR : {blake3_ir[:24]}...")
    print(f"🧩 Componentes Andes UI: {andes_components}")
    print(f"📝 Texto de Embedding: '{summary_text}'")
    
    # 1. Gerar Embedding 768d no Embed Server
    print("⚡ Solicitando vetor 768d ao Embed Server (:8081)...")
    vector = get_embedding(summary_text)
    print(f"✅ Vetor 768d gerado com sucesso! (dimensão: {len(vector)})")
    
    # 2. Gerar UUID determinístico para o Qdrant
    point_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"rsxt:sdui:probe:{blake3_ir}"))
    
    # 3. Montar Payload com metadados e tags de cruzamento
    payload = {
        "tag": "app-mercadopago",
        "sub_tags": [
            "app-jury",
            "android-usb-physical",
            "app-mercadolivre-apkm"
        ],
        "blake3_xml": blake3_xml,
        "blake3_ir": blake3_ir,
        "device": {
            "serial": "AMXCN7Q86LHIMNRK",
            "model": "Poco/Redmi 23100RN82L (gale_global)",
            "transport": "usb:1-4"
        },
        "andes_components": andes_components,
        "summary_text": summary_text,
        "source_path": SDUI_IR_PATH,
        "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    
    # 4. Upsert no Qdrant
    print(f"🗄️ Inserindo ponto {point_uuid[:8]} na coleção '{COLLECTION_NAME}' do Qdrant (:6352)...")
    success = index_in_qdrant(point_uuid, vector, payload)
    
    if success:
        print("🎯 [VectorBridge] Ponto indexado com SUCESSO no Qdrant!")
    else:
        print("❌ Erro ao indexar ponto no Qdrant.")
        sys.exit(1)
        
    # 5. Persistir estado no Redis :6396 se redis-cli disponível
    try:
        import subprocess
        redis_val = json.dumps({"status": "indexed", "point_id": point_uuid, "blake3_ir": blake3_ir, "components": andes_components})
        subprocess.run(["redis-cli", "-p", str(REDIS_PORT), "SET", "adsentice:telemetry:vector:status", redis_val], check=False, stdout=subprocess.DEVNULL)
        print("💾 Status de telemetria vetorial persistido no Redis :6396 (`adsentice:telemetry:vector:status`).")
    except Exception as e:
        print(f"⚠️ Aviso: Não foi possível salvar status no Redis: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--search":
        query = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else "Mercado Pago saldo cartões"
        print(f"🔍 Executando busca semântica de paridade no Qdrant: '{query}'...")
        results = query_qdrant_similarity(query)
        print(json.dumps(results, indent=2, ensure_ascii=False))
    else:
        run_bridge_ingestion()
