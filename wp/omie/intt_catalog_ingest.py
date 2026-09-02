#!/usr/bin/env python3
"""
intt_catalog_ingest.py — Esteira Soberana CASOSEX (ADR-0225)
Módulo de Ingestão de Catálogo da INTT e Postagem Pendente no WooCommerce.
"""

import json
import urllib.request
import urllib.parse
import ssl
import sys
import os
import base64

WOOCOMMERCE_URL = os.environ.get("CASOSEX_WC_URL", "http://localhost:8085")
WOOCOMMERCE_CK = os.environ.get("CASOSEX_WC_CK", "ck_7d629e674f63624ac51ef8903e735a4beed30bd2")
WOOCOMMERCE_CS = os.environ.get("CASOSEX_WC_CS", "cs_7bd99d9165ad950dba5fd286f4d1a9e249ef1963")
INTT_LOGIN_URL = "https://www.lojaintt.com.br/v2/login"
INTT_CATALOG_URL = "https://www.lojaintt.com.br/v2/ajax/catalogo.php"

def ingest_product_to_woocommerce(product_data: dict, wc_url: str = WOOCOMMERCE_URL, ck: str = WOOCOMMERCE_CK, cs: str = WOOCOMMERCE_CS) -> dict:
    """
    Cadastra um produto vindo do catálogo INTT no WooCommerce com status 'pending' (rascunho para curadoria).
    """
    payload = {
        "name": product_data.get("name", "Produto INTT Pendente"),
        "type": "simple",
        "status": "pending",  # Status obrigatório de curadoria
        "description": product_data.get("description", ""),
        "short_description": product_data.get("short_description", ""),
        "sku": product_data.get('sku', ''),
        "regular_price": str(product_data.get("suggested_price", product_data.get("cost_price", 0.0) * 2.0)),
        "meta_data": [
            {"key": "_casosex_stock_type", "value": "dropshipping_intt"},
            {"key": "_casosex_supplier", "value": "INTT"},
            {"key": "_casosex_supplier_id", "value": "69"},
            {"key": "_casosex_supplier_cnpj", "value": "21.725.006/0001-04"},
            {"key": "_casosex_cost_price", "value": str(product_data.get("cost_price", 0.0))}
        ]
    }
    
    if product_data.get("images"):
        payload["images"] = [{"src": img} for img in product_data["images"]]

    endpoint = f"{wc_url}/wp-json/wc/v3/products?consumer_key={ck}&consumer_secret={cs}"

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "User-Agent": "CASOSEX-Sovereign-Engine/1.0"
        },
        method="POST"
    )
        
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e), "status": "failed", "payload": payload}

def mock_sample_intt_ingest():
    """
    Simula uma ingestão de teste para validação de esteira.
    """
    sample_product = {
        "sku": "INTT-9988",
        "name": "Gel de Massagem Corporal INTT Premium 100ml",
        "description": "Gel de massagem hidratante e beijável com fragrância suave.",
        "short_description": "Gel Corporal INTT 100ml",
        "cost_price": 24.90,
        "suggested_price": 49.90,
        "images": ["https://www.lojaintt.com.br/images/sample.jpg"]
    }
    print(f"[CASOSEX INGEST] Processando produto INTT: {sample_product['name']} (SKU: {sample_product['sku']})")
    res = ingest_product_to_woocommerce(sample_product)
    print(f"[CASOSEX INGEST] Resposta WooCommerce: {json.dumps(res, indent=2, ensure_ascii=False)}")
    return res

if __name__ == "__main__":
    mock_sample_intt_ingest()
