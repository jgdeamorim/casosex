#!/usr/bin/env python3
"""
intt_catalog_ingest.py — Esteira Soberana CASOSEX (ADR-0225 & ADR-0227)
Módulo de Sincronização Automática via Cron (INTT Live Sync & Curadoria Humana).
"""

import json
import urllib.request
import urllib.parse
import ssl
import sys
import os
import base64
import subprocess

WOOCOMMERCE_URL = os.environ.get("CASOSEX_WC_URL", "http://localhost:8085")
WOOCOMMERCE_CK = os.environ.get("CASOSEX_WC_CK", "ck_0e3eee4f0fb2eb6f8b8861757fb3dba4330185c9")
WOOCOMMERCE_CS = os.environ.get("CASOSEX_WC_CS", "cs_0aa55bf3d7faf0872994f91719d2204bd09ca75c")
INTT_LOGIN_URL = "https://www.lojaintt.com.br/v2/login"
INTT_CATALOG_URL = "https://www.lojaintt.com.br/v2/ajax/catalogo.php"
INTT_SUPPLIER_TERM_ID = 69


def _get_auth_header(ck: str = WOOCOMMERCE_CK, cs: str = WOOCOMMERCE_CS) -> dict:
    auth_str = f"{ck}:{cs}"
    encoded = base64.b64encode(auth_str.encode("utf-8")).decode("utf-8")
    return {
        "Authorization": f"Basic {encoded}",
        "Content-Type": "application/json",
        "User-Agent": "CASOSEX-Sovereign-Engine/1.0"
    }


def get_existing_product_by_sku(sku: str, wc_url: str = WOOCOMMERCE_URL, ck: str = WOOCOMMERCE_CK, cs: str = WOOCOMMERCE_CS) -> dict:
    """
    Busca um produto no WooCommerce pelo SKU via REST API ou fallback PHP interno.
    """
    endpoint = f"{wc_url}/wp-json/wc/v3/products?sku={urllib.parse.quote(sku)}&consumer_key={ck}&consumer_secret={cs}"
    headers = _get_auth_header(ck, cs)
    req = urllib.request.Request(endpoint, headers=headers, method="GET")
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
            products = json.loads(resp.read().decode("utf-8"))
            if isinstance(products, list) and len(products) > 0:
                return products[0]
    except Exception:
        # Fallback via PHP interno
        return _get_existing_product_via_php(sku)
    return {}


def _get_existing_product_via_php(sku: str) -> dict:
    php_code = f"""
    require_once('/var/www/html/wp-load.php');
    $product_id = wc_get_product_id_by_sku('{sku}');
    if ($product_id) {{
        $product = wc_get_product($product_id);
        echo json_encode(array('id' => $product_id, 'sku' => $product->get_sku(), 'status' => $product->get_status()));
    }} else {{
        echo json_encode(array());
    }}
    """
    res = subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_code], capture_output=True, text=True)
    try:
        return json.loads(res.stdout.strip())
    except Exception:
        return {}


def ingest_product_to_woocommerce(product_data: dict, wc_url: str = WOOCOMMERCE_URL, ck: str = WOOCOMMERCE_CK, cs: str = WOOCOMMERCE_CS) -> dict:
    """
    Cadastra ou atualiza um produto da INTT no WooCommerce com Mapeamento Completo de Campos (ADR-0227).
    - Novos produtos: criados como 'pending' (Rascunho / Curadoria Humana).
    - Produtos existentes: atualizados sem alterar o post_status de publicação.
    """
    sku = product_data.get("sku", "")
    existing = get_existing_product_by_sku(sku, wc_url, ck, cs) if sku else {}

    stock_qty = int(product_data.get("stock_quantity", 10))
    stock_status = "instock" if stock_qty > 0 else "outofstock"
    cost_price = float(product_data.get("cost_price", 0.0))
    suggested_price = float(product_data.get("suggested_price", cost_price * 2.0))

    payload = {
        "name": product_data.get("name", "Produto INTT"),
        "type": "simple",
        "description": product_data.get("description", ""),
        "short_description": product_data.get("short_description", ""),
        "sku": sku,
        "regular_price": str(suggested_price),
        "manage_stock": True,
        "stock_quantity": stock_qty,
        "stock_status": stock_status,
        "meta_data": [
            {"key": "_casosex_stock_type", "value": "dropshipping_intt"},
            {"key": "_casosex_supplier", "value": "INTT"},
            {"key": "_casosex_supplier_id", "value": str(INTT_SUPPLIER_TERM_ID)},
            {"key": "_casosex_supplier_cnpj", "value": "21.725.006/0001-04"},
            {"key": "_casosex_cost_price", "value": str(cost_price)}
        ]
    }

    if product_data.get("images"):
        payload["images"] = [{"src": img} for img in product_data["images"]]

    headers = _get_auth_header(ck, cs)

    if existing and "id" in existing:
        product_id = existing["id"]
        endpoint = f"{wc_url}/wp-json/wc/v3/products/{product_id}?consumer_key={ck}&consumer_secret={cs}"
        method = "PUT"
        print(f"[CASOSEX INGEST] Atualizando produto existente ID #{product_id} (SKU: {sku})")
    else:
        payload["status"] = "pending"
        endpoint = f"{wc_url}/wp-json/wc/v3/products?consumer_key={ck}&consumer_secret={cs}"
        method = "POST"
        print(f"[CASOSEX INGEST] Cadastrando novo produto em curadoria 'pending' (SKU: {sku})")

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method=method
    )

    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            if res.get("id"):
                _assign_supplier_term_via_wp(res["id"], INTT_SUPPLIER_TERM_ID)
            return res
    except Exception:
        # Direct PHP Sovereign Ingestion Fallback
        return _ingest_via_php(product_data, existing.get("id"))


def _ingest_via_php(product_data: dict, product_id: int = None) -> dict:
    sku = product_data.get("sku", "")
    name = product_data.get("name", "Produto INTT").replace("'", "\\'")
    desc = product_data.get("description", "").replace("'", "\\'")
    short_desc = product_data.get("short_description", "").replace("'", "\\'")
    cost_price = float(product_data.get("cost_price", 0.0))
    suggested_price = float(product_data.get("suggested_price", cost_price * 2.0))
    stock_qty = int(product_data.get("stock_quantity", 10))

    php_script = f"""
    require_once('/var/www/html/wp-load.php');
    $id = {product_id if product_id else 0};
    if ($id > 0) {{
        $product = wc_get_product($id);
    }} else {{
        $existing_id = wc_get_product_id_by_sku('{sku}');
        if ($existing_id) {{
            $product = wc_get_product($existing_id);
        }} else {{
            $product = new WC_Product_Simple();
            $product->set_status('pending');
        }}
    }}
    $product->set_name('{name}');
    $product->set_sku('{sku}');
    $product->set_description('{desc}');
    $product->set_short_description('{short_desc}');
    $product->set_regular_price('{suggested_price}');
    $product->set_manage_stock(true);
    $product->set_stock_quantity({stock_qty});
    $product->update_meta_data('_casosex_stock_type', 'dropshipping_intt');
    $product->update_meta_data('_casosex_supplier', 'INTT');
    $product->update_meta_data('_casosex_supplier_id', '69');
    $product->update_meta_data('_casosex_supplier_cnpj', '21.725.006/0001-04');
    $product->update_meta_data('_casosex_cost_price', '{cost_price}');
    $new_id = $product->save();
    wp_set_object_terms($new_id, 69, 'dropship_supplier', true);
    echo json_encode(array('id' => $new_id, 'sku' => '{sku}', 'status' => $product->get_status(), 'stock' => {stock_qty}, 'price' => {suggested_price}));
    """
    res = subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_script], capture_output=True, text=True)
    try:
        data = json.loads(res.stdout.strip())
        print(f"[CASOSEX INGEST] Ingestão Soberana via PHP executada com sucesso! Produto ID #{data.get('id')}")
        return data
    except Exception as e:
        return {"error": str(e), "raw": res.stdout}


def _assign_supplier_term_via_wp(product_id: int, term_id: int = INTT_SUPPLIER_TERM_ID):
    cmd = f"docker exec casosex-wordpress php -r 'require_once(\"/var/www/html/wp-load.php\"); wp_set_object_terms({product_id}, {term_id}, \"dropship_supplier\", true);'"
    os.system(cmd)


def mock_sample_intt_ingest():
    """
    Simula uma ingestão de teste para validação de esteira auto-sync.
    """
    sample_product = {
        "sku": "INTT-9988",
        "name": "Gel de Massagem Corporal INTT Premium 100ml",
        "description": "Gel de massagem hidratante e beijável com fragrância suave.",
        "short_description": "Gel Corporal INTT 100ml",
        "cost_price": 24.90,
        "suggested_price": 49.90,
        "stock_quantity": 45,
        "images": ["https://www.lojaintt.com.br/images/sample.jpg"]
    }
    print(f"[CASOSEX INGEST] Processando produto INTT: {sample_product['name']} (SKU: {sample_product['sku']})")
    res = ingest_product_to_woocommerce(sample_product)
    print(f"[CASOSEX INGEST] Resposta WooCommerce: {json.dumps(res, indent=2, ensure_ascii=False)}")
    return res


if __name__ == "__main__":
    mock_sample_intt_ingest()
