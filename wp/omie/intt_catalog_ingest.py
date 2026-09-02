#!/usr/bin/env python3
"""
intt_catalog_ingest.py — Esteira Soberana CASOSEX (ADR-0225 & ADR-0227)
Módulo de Sincronização Automática via Cron (INTT Live Sync & Curadoria Humana).
Mapeamento completo: Produtos Simples e Variáveis, Taxonomia de Categorias e Custo Atacado B2B.
"""

import json
import urllib.request
import urllib.parse
import ssl
import sys
import os
import base64
import subprocess
import http.cookiejar

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
        return _get_existing_product_via_php(sku)
    return {}


def _get_existing_product_via_php(sku: str) -> dict:
    php_code = f"""
    require_once('/var/www/html/wp-load.php');
    $product_id = wc_get_product_id_by_sku('{sku}');
    if ($product_id) {{
        $product = wc_get_product($product_id);
        echo json_encode(array('id' => $product_id, 'sku' => $product->get_sku(), 'type' => $product->get_type(), 'status' => $product->get_status()));
    }} else {{
        echo json_encode(array());
    }}
    """
    res = subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_code], capture_output=True, text=True)
    try:
        return json.loads(res.stdout.strip())
    except Exception:
        return {}


def get_or_create_category_id(category_name: str, wc_url: str = WOOCOMMERCE_URL, ck: str = WOOCOMMERCE_CK, cs: str = WOOCOMMERCE_CS) -> int:
    """
    Busca o ID da categoria WooCommerce pelo nome via REST API ou via PHP interno.
    """
    if not category_name:
        category_name = "Cosméticos & Géis Eróticos"

    endpoint = f"{wc_url}/wp-json/wc/v3/products/categories?search={urllib.parse.quote(category_name)}&consumer_key={ck}&consumer_secret={cs}"
    headers = _get_auth_header(ck, cs)
    req = urllib.request.Request(endpoint, headers=headers, method="GET")
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
            cats = json.loads(resp.read().decode("utf-8"))
            if isinstance(cats, list) and len(cats) > 0:
                for c in cats:
                    if c.get("name", "").lower() == category_name.lower():
                        return c["id"]
                return cats[0]["id"]
    except Exception:
        pass

    # Fallback PHP
    php_script = f"""
    require_once('/var/www/html/wp-load.php');
    $term = get_term_by('name', '{category_name}', 'product_cat');
    if ($term) {{
        echo json_encode(array('id' => $term->term_id));
    }} else {{
        $new_term = wp_insert_term('{category_name}', 'product_cat');
        if (!is_wp_error($new_term)) {{
            echo json_encode(array('id' => $new_term['term_id']));
        }} else {{
            echo json_encode(array('id' => 0));
        }}
    }}
    """
    res = subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_script], capture_output=True, text=True)
    try:
        data = json.loads(res.stdout.strip())
        return data.get("id", 0)
    except Exception:
        return 0


def ingest_product_to_woocommerce(product_data: dict, wc_url: str = WOOCOMMERCE_URL, ck: str = WOOCOMMERCE_CK, cs: str = WOOCOMMERCE_CS) -> dict:
    """
    Cadastra ou atualiza um produto da INTT no WooCommerce com Mapeamento Completo de Campos (ADR-0227).
    Suporta produtos simples e produtos variáveis com variações filhas.
    """
    sku = product_data.get("sku", "")
    existing = get_existing_product_by_sku(sku, wc_url, ck, cs) if sku else {}

    stock_qty = int(product_data.get("stock_quantity", 10))
    stock_status = "instock" if stock_qty > 0 else "outofstock"
    cost_price = float(product_data.get("cost_price", 0.0))
    suggested_price = float(product_data.get("suggested_price", cost_price * 2.0))

    gtin = product_data.get("gtin", "")
    ncm = product_data.get("ncm", "")
    weight = float(product_data.get("weight", 0.0))
    weight_net = float(product_data.get("weight_net", 0.0))
    length = float(product_data.get("length", 0.0))
    width = float(product_data.get("width", 0.0))
    height = float(product_data.get("height", 0.0))
    brand = product_data.get("brand", "INTT")
    category_name = product_data.get("category", "Cosméticos & Géis Eróticos")
    cat_id = get_or_create_category_id(category_name, wc_url, ck, cs)

    variations_data = product_data.get("variations", [])
    is_variable = len(variations_data) > 0

    payload = {
        "name": product_data.get("name", "Produto INTT"),
        "type": "variable" if is_variable else "simple",
        "description": product_data.get("description", ""),
        "short_description": product_data.get("short_description", ""),
        "sku": sku,
        "weight": str(weight) if weight > 0 else "",
        "dimensions": {
            "length": str(length) if length > 0 else "",
            "width": str(width) if width > 0 else "",
            "height": str(height) if height > 0 else ""
        },
        "meta_data": [
            {"key": "_casosex_stock_type", "value": "dropshipping_intt"},
            {"key": "_casosex_supplier", "value": "INTT"},
            {"key": "_casosex_supplier_id", "value": str(INTT_SUPPLIER_TERM_ID)},
            {"key": "_casosex_supplier_cnpj", "value": "21.725.006/0001-04"},
            {"key": "_casosex_cost_price", "value": str(cost_price)},
            {"key": "_gtin", "value": gtin},
            {"key": "_barcode", "value": gtin},
            {"key": "_ncm", "value": ncm},
            {"key": "_weight_net", "value": str(weight_net)},
            {"key": "_casosex_brand", "value": brand}
        ]
    }

    if cat_id > 0:
        payload["categories"] = [{"id": cat_id}]

    if not is_variable:
        payload["regular_price"] = str(suggested_price)
        payload["manage_stock"] = True
        payload["stock_quantity"] = stock_qty
        payload["stock_status"] = stock_status
    else:
        attr_name = "Opção"
        attr_options = [v.get("option_name", v.get("name", f"Opção {idx+1}")) for idx, v in enumerate(variations_data)]
        payload["attributes"] = [{
            "name": attr_name,
            "position": 0,
            "visible": True,
            "variation": True,
            "options": attr_options
        }]

    if product_data.get("images"):
        payload["images"] = [{"src": img} for img in product_data["images"] if isinstance(img, str) and img.startswith("http")]

    headers = _get_auth_header(ck, cs)

    if existing and "id" in existing:
        product_id = existing["id"]
        endpoint = f"{wc_url}/wp-json/wc/v3/products/{product_id}?consumer_key={ck}&consumer_secret={cs}"
        method = "PUT"
        print(f"[CASOSEX INGEST] Atualizando produto existente ID #{product_id} (SKU: {sku}, Tipo: {payload['type']})")
    else:
        payload["status"] = "pending"
        endpoint = f"{wc_url}/wp-json/wc/v3/products?consumer_key={ck}&consumer_secret={cs}"
        method = "POST"
        print(f"[CASOSEX INGEST] Cadastrando novo produto em curadoria 'pending' (SKU: {sku}, Tipo: {payload['type']})")

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
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            parent_id = res.get("id")
            if parent_id:
                _assign_supplier_term_via_wp(parent_id, INTT_SUPPLIER_TERM_ID)
                if is_variable:
                    _ingest_variations(parent_id, variations_data, wc_url, ck, cs)
            return res
    except Exception:
        # Fallback via PHP soberano
        return _ingest_via_php(product_data, existing.get("id"))


def _ingest_variations(parent_id: int, variations: list, wc_url: str, ck: str, cs: str):
    """
    Ingesta variações filhas para um produto pai no WooCommerce.
    """
    headers = _get_auth_header(ck, cs)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for idx, var in enumerate(variations):
        var_sku = var.get("sku", f"VAR-{parent_id}-{idx+1}")
        var_cost = float(var.get("cost_price", 0.0))
        var_price = float(var.get("suggested_price", var_cost * 2.0))
        var_stock = int(var.get("stock_quantity", 10))
        option_val = var.get("option_name", var.get("name", f"Opção {idx+1}"))

        var_payload = {
            "sku": var_sku,
            "regular_price": str(var_price),
            "manage_stock": True,
            "stock_quantity": var_stock,
            "stock_status": "instock" if var_stock > 0 else "outofstock",
            "attributes": [{"name": "Opção", "option": option_val}],
            "meta_data": [
                {"key": "_casosex_cost_price", "value": str(var_cost)},
                {"key": "_gtin", "value": var.get("gtin", "")}
            ]
        }

        if var.get("image"):
            var_payload["image"] = {"src": var["image"]}

        endpoint = f"{wc_url}/wp-json/wc/v3/products/{parent_id}/variations?consumer_key={ck}&consumer_secret={cs}"
        req = urllib.request.Request(
            endpoint,
            data=json.dumps(var_payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=5, context=ctx) as resp:
                var_res = json.loads(resp.read().decode("utf-8"))
                print(f"[CASOSEX INGEST] Variação '{option_val}' cadastrada com sucesso (ID #{var_res.get('id')})")
        except Exception as e:
            print(f"[CASOSEX INGEST] Falha ao cadastrar variação via REST: {e}. Invocando fallback PHP...")
            _ingest_variation_via_php(parent_id, var_payload)


def _ingest_variation_via_php(parent_id: int, var_payload: dict):
    var_sku = var_payload.get("sku", "")
    price = var_payload.get("regular_price", "0")
    stock = var_payload.get("stock_quantity", 0)
    option_val = var_payload["attributes"][0]["option"] if var_payload.get("attributes") else "Opção"

    php_script = f"""
    require_once('/var/www/html/wp-load.php');
    $variation = new WC_Product_Variation();
    $variation->set_parent_id({parent_id});
    $variation->set_sku('{var_sku}');
    $variation->set_regular_price('{price}');
    $variation->set_manage_stock(true);
    $variation->set_stock_quantity({stock});
    $variation->set_attributes(array('opcao' => '{option_val}'));
    $var_id = $variation->save();
    echo json_encode(array('id' => $var_id));
    """
    subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_script], capture_output=True, text=True)


def _ingest_via_php(product_data: dict, product_id: int = None) -> dict:
    sku = product_data.get("sku", "")
    name = product_data.get("name", "Produto INTT").replace("'", "\\'")
    desc = product_data.get("description", "").replace("'", "\\'")
    short_desc = product_data.get("short_description", "").replace("'", "\\'")
    cost_price = float(product_data.get("cost_price", 0.0))
    suggested_price = float(product_data.get("suggested_price", cost_price * 2.0))
    stock_qty = int(product_data.get("stock_quantity", 10))
    gtin = product_data.get("gtin", "")
    ncm = product_data.get("ncm", "")
    weight = float(product_data.get("weight", 0.0))
    weight_net = float(product_data.get("weight_net", 0.0))
    length = float(product_data.get("length", 0.0))
    width = float(product_data.get("width", 0.0))
    height = float(product_data.get("height", 0.0))
    brand = product_data.get("brand", "INTT").replace("'", "\\'")
    cat_name = product_data.get("category", "Cosméticos & Géis Eróticos").replace("'", "\\'")

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
    if ({weight} > 0) $product->set_weight({weight});
    if ({length} > 0) $product->set_length({length});
    if ({width} > 0) $product->set_width({width});
    if ({height} > 0) $product->set_height({height});
    $product->update_meta_data('_casosex_stock_type', 'dropshipping_intt');
    $product->update_meta_data('_casosex_supplier', 'INTT');
    $product->update_meta_data('_casosex_supplier_id', '69');
    $product->update_meta_data('_casosex_supplier_cnpj', '21.725.006/0001-04');
    $product->update_meta_data('_casosex_cost_price', '{cost_price}');
    $product->update_meta_data('_gtin', '{gtin}');
    $product->update_meta_data('_barcode', '{gtin}');
    $product->update_meta_data('_ncm', '{ncm}');
    $product->update_meta_data('_weight_net', '{weight_net}');
    $product->update_meta_data('_casosex_brand', '{brand}');
    $new_id = $product->save();
    wp_set_object_terms($new_id, 69, 'dropship_supplier', true);
    wp_set_object_terms($new_id, '{cat_name}', 'product_cat', true);
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


def fetch_intt_b2b_catalog(username: str = None, password: str = None) -> list:
    """
    Executa a raspagem autenticada (Dual-Scrape B2B - ADR-0228):
    1. Realiza POST de login em https://www.lojaintt.com.br/v2/login (se credenciais forem fornecidas).
    2. Mantém o cookie de sessão PHPSESSID via HTTPCookieProcessor.
    3. Faz GET em https://www.lojaintt.com.br/v2/ajax/catalogo.php para obter o catálogo B2B completo com estoque físico real.
    """
    username = username or os.environ.get("INTT_B2B_USER", "")
    password = password or os.environ.get("INTT_B2B_PASS", "")

    cj = http.cookiejar.CookieJar()
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj),
        urllib.request.HTTPSHandler(context=ctx)
    )

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
    }

    if username and password:
        login_data = urllib.parse.urlencode({
            "usuario": username,
            "senha": password,
            "acao": "login"
        }).encode("utf-8")

        login_req = urllib.request.Request(INTT_LOGIN_URL, data=login_data, headers=headers, method="POST")
        try:
            with opener.open(login_req, timeout=10) as resp:
                print(f"[CASOSEX DUAL-SCRAPE] Handshake B2B efetuado com sucesso em {INTT_LOGIN_URL}")
        except Exception as e:
            print(f"[CASOSEX DUAL-SCRAPE] AVISO: Falha no login B2B ({e}). Tentando endpoint de catálogo...")

    catalog_req = urllib.request.Request(INTT_CATALOG_URL, headers=headers, method="GET")
    extracted_products = []

    try:
        with opener.open(catalog_req, timeout=15) as resp:
            content = resp.read().decode("utf-8")
            try:
                raw_data = json.loads(content)
                items = raw_data if isinstance(raw_data, list) else raw_data.get("produtos", raw_data.get("data", []))
                for item in items:
                    sku = str(item.get("sku") or item.get("codigo") or item.get("id", ""))
                    if not sku:
                        continue
                    stock = int(item.get("estoque") or item.get("quantidade") or item.get("stock_quantity") or 0)
                    cost = float(item.get("preco_atacado") or item.get("preco_custo") or item.get("cost_price") or 0.0)
                    price = float(item.get("preco_sugerido") or item.get("preco_venda") or item.get("suggested_price") or (cost * 2.0 if cost > 0 else 0.0))

                    # Parse de Variações
                    raw_variations = item.get("variacoes") or item.get("opcoes") or []
                    parsed_variations = []
                    if isinstance(raw_variations, list):
                        for v in raw_variations:
                            v_sku = str(v.get("sku") or v.get("codigo") or f"{sku}-{v.get('id', '')}")
                            v_cost = float(v.get("preco_atacado") or v.get("preco_custo") or cost)
                            v_price = float(v.get("preco_sugerido") or v.get("preco_venda") or price)
                            v_stock = int(v.get("estoque") or v.get("quantidade") or stock)
                            v_name = str(v.get("sabor") or v.get("opcao") or v.get("nome") or "Variação")
                            parsed_variations.append({
                                "sku": v_sku if v_sku.startswith("INTT-") else f"INTT-{v_sku}",
                                "option_name": v_name,
                                "cost_price": v_cost,
                                "suggested_price": v_price,
                                "stock_quantity": v_stock,
                                "gtin": str(v.get("gtin") or v.get("ean") or ""),
                                "image": v.get("imagem") or v.get("image")
                            })

                    extracted_products.append({
                        "sku": sku if sku.startswith("INTT-") else f"INTT-{sku}",
                        "name": str(item.get("nome") or item.get("titulo") or item.get("name", "Produto INTT")),
                        "description": str(item.get("descricao") or item.get("description", "")),
                        "short_description": str(item.get("resumo") or item.get("short_description", "")),
                        "cost_price": cost,
                        "suggested_price": price,
                        "stock_quantity": stock,
                        "gtin": str(item.get("gtin") or item.get("ean") or item.get("barcode") or ""),
                        "ncm": str(item.get("ncm") or ""),
                        "weight": float(item.get("peso_bruto") or item.get("weight") or 0.0),
                        "weight_net": float(item.get("peso_liquido") or item.get("weight_net") or 0.0),
                        "length": float(item.get("comprimento") or item.get("length") or 0.0),
                        "width": float(item.get("largura") or item.get("width") or 0.0),
                        "height": float(item.get("altura") or item.get("height") or 0.0),
                        "category": str(item.get("categoria") or item.get("category") or "Cosméticos & Géis Eróticos"),
                        "brand": str(item.get("marca") or item.get("linha") or item.get("brand") or "INTT"),
                        "images": item.get("imagens", [item.get("imagem")] if item.get("imagem") else []),
                        "variations": parsed_variations
                    })
            except Exception:
                print(f"[CASOSEX DUAL-SCRAPE] Retorno do catálogo não é JSON. Tamanho da resposta: {len(content)} bytes.")
    except Exception as e:
        print(f"[CASOSEX DUAL-SCRAPE] Erro na consulta ao catálogo B2B: {e}")

    return extracted_products


def mock_sample_intt_ingest():
    """
    Simula uma ingestão de teste para validação de esteira auto-sync (Simples e Variável).
    """
    sample_product_simple = {
        "sku": "INTT-9988",
        "name": "Gel de Massagem Corporal INTT Premium 100ml",
        "description": "Gel de massagem hidratante e beijável com fragrância suave.",
        "short_description": "Gel Corporal INTT 100ml",
        "cost_price": 24.90,
        "suggested_price": 49.90,
        "stock_quantity": 45,
        "gtin": "7898582310142",
        "ncm": "3304.99.90",
        "weight": 0.14,
        "weight_net": 0.10,
        "length": 15.0,
        "width": 5.0,
        "height": 5.0,
        "category": "Géis Corporal & Massagem",
        "brand": "INTT Wellness",
        "images": ["https://www.lojaintt.com.br/images/sample.jpg"]
    }

    sample_product_variable = {
        "sku": "INTT-9990",
        "name": "VibroBeijável INTT 15ml (Multissabores)",
        "description": "Gel com sensação de vibração e sabor gourmet para preliminares.",
        "short_description": "VibroBeijável INTT 15ml",
        "cost_price": 18.50,
        "suggested_price": 39.90,
        "stock_quantity": 100,
        "gtin": "7898582310200",
        "ncm": "3304.99.90",
        "weight": 0.05,
        "category": "Géis Sensacionais",
        "brand": "INTT",
        "images": ["https://www.lojaintt.com.br/images/vibrobeijavel.jpg"],
        "variations": [
            {
                "sku": "INTT-9990-MINT",
                "option_name": "Hortelã",
                "cost_price": 18.50,
                "suggested_price": 39.90,
                "stock_quantity": 50,
                "gtin": "7898582310201"
            },
            {
                "sku": "INTT-9990-STRAW",
                "option_name": "Morango",
                "cost_price": 18.50,
                "suggested_price": 39.90,
                "stock_quantity": 50,
                "gtin": "7898582310202"
            }
        ]
    }

    print(f"[CASOSEX INGEST] Processando produto Simples INTT: {sample_product_simple['name']} (SKU: {sample_product_simple['sku']})")
    res_simple = ingest_product_to_woocommerce(sample_product_simple)
    print(f"[CASOSEX INGEST] Resposta WooCommerce (Simples): {json.dumps(res_simple, indent=2, ensure_ascii=False)}")

    print(f"\n[CASOSEX INGEST] Processando produto Variável INTT: {sample_product_variable['name']} (SKU: {sample_product_variable['sku']})")
    res_var = ingest_product_to_woocommerce(sample_product_variable)
    print(f"[CASOSEX INGEST] Resposta WooCommerce (Variável): {json.dumps(res_var, indent=2, ensure_ascii=False)}")

    return {"simple": res_simple, "variable": res_var}


if __name__ == "__main__":
    products = fetch_intt_b2b_catalog()
    if products:
        print(f"[CASOSEX INGEST] {len(products)} produtos B2B extraídos da INTT. Iniciando sincronização WooCommerce...")
        for p in products:
            ingest_product_to_woocommerce(p)
    else:
        print("[CASOSEX INGEST] Nenhuma credencial/catálogo retornado via HTTP B2B live. Rodando fallback de validação Soberana...")
        mock_sample_intt_ingest()
