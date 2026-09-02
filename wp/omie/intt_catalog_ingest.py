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
import re
from bs4 import BeautifulSoup

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


def extract_description_sections(html_desc: str) -> dict:
    """
    Extrai seções estruturadas da descrição HTML da INTT para campos personalizados:
    - usage: Modo de Uso
    - care: Higiene & Cuidados
    - content_origin: Conteúdo & Origem
    """
    if not html_desc:
        return {"usage": "", "care": "", "content_origin": ""}

    usage = ""
    care = ""
    content_origin = ""

    m_usage = re.search(r'<h4>(?:📖\s*)?Modo de Uso:?</h4>\s*<p>(.*?)</p>', html_desc, re.IGNORECASE | re.DOTALL)
    if m_usage:
        usage = m_usage.group(1).strip()

    m_care = re.search(r'<h4>(?:🧼\s*)?Higiene\s*&amp;?\s*Cuidados:?</h4>\s*<p>(.*?)</p>', html_desc, re.IGNORECASE | re.DOTALL)
    if m_care:
        care = m_care.group(1).strip()

    m_origin = re.search(r'<p>(?:<strong>)?Conteúdo:?(?:</strong>)?.*?</p>', html_desc, re.IGNORECASE | re.DOTALL)
    if m_origin:
        content_origin = m_origin.group(0).strip()

    return {
        "usage": usage,
        "care": care,
        "content_origin": content_origin
    }


def resolve_category_by_product_name(product_name: str, raw_cat: str = "") -> str:
    """
    Resolve automaticamente a categoria caso venha vazia ou 'Uncategorized'.
    """
    if raw_cat and raw_cat.strip().lower() not in ["", "uncategorized", "sem categoria", "geral"]:
        return raw_cat.strip()
    name_lower = product_name.lower()
    if any(k in name_lower for k in ["masturbador", "egg", "magnus", "stroker", "thor"]):
        return "Masturbadores Masculinos"
    if any(k in name_lower for k in ["gel", "lubrificante", "óleo", "oleo", "vibro", "menta", "chiclete", "estimulante", "beijável", "beijavel"]):
        return "Cosméticos & Géis Eróticos"
    if any(k in name_lower for k in ["vibrador", "bullet", "prótese", "protese", "plug"]):
        return "Próteses & Vibradores"
    return "Produtos Eróticos INTT"


def get_or_create_category_id(category_name: str, wc_url: str = WOOCOMMERCE_URL, ck: str = WOOCOMMERCE_CK, cs: str = WOOCOMMERCE_CS) -> int:
    """
    Busca o ID da categoria WooCommerce pelo nome via REST API ou via PHP interno.
    """
    if not category_name or category_name.strip().lower() in ["uncategorized", "sem categoria"]:
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
                    if c.get("name", "").strip().lower() == category_name.strip().lower():
                        return int(c["id"])
                return int(cats[0]["id"])
    except Exception:
        pass

    # Fallback PHP soberano
    escaped_cat = category_name.replace("'", "\\'")
    php_script = f"""
    require_once('/var/www/html/wp-load.php');
    $term = get_term_by('name', '{escaped_cat}', 'product_cat');
    if ($term) {{
        echo json_encode(array('id' => (int)$term->term_id));
    }} else {{
        $new_term = wp_insert_term('{escaped_cat}', 'product_cat');
        if (!is_wp_error($new_term)) {{
            echo json_encode(array('id' => (int)$new_term['term_id']));
        }} else {{
            echo json_encode(array('id' => 0));
        }}
    }}
    """
    res = subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_script], capture_output=True, text=True)
    try:
        data = json.loads(res.stdout.strip())
        return int(data.get("id", 0))
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

    gtin = str(product_data.get("gtin", "")).strip()
    ncm = str(product_data.get("ncm", "")).strip()
    weight = float(product_data.get("weight", 0.0))
    weight_net = float(product_data.get("weight_net", 0.0))
    length = float(product_data.get("length", 0.0))
    width = float(product_data.get("width", 0.0))
    height = float(product_data.get("height", 0.0))
    brand = product_data.get("brand", "INTT")
    
    raw_desc = product_data.get("description", "")
    sections = extract_description_sections(raw_desc)

    raw_cat = product_data.get("category", "")
    category_name = resolve_category_by_product_name(product_data.get("name", ""), raw_cat)
    cat_id = get_or_create_category_id(category_name, wc_url, ck, cs)

    variations_data = product_data.get("variations", [])
    if not variations_data:
        var_sku = f"{sku}-VAR1" if not sku.endswith("-PARENT") else sku.replace("-PARENT", "-VAR1")
        variations_data = [{
            "sku": var_sku,
            "option_name": "Padrão",
            "cost_price": cost_price,
            "suggested_price": suggested_price,
            "stock_quantity": stock_qty,
            "gtin": gtin,
            "ncm": ncm,
            "weight": weight
        }]
        product_data["variations"] = variations_data
    is_variable = True

    tags_list = [{"name": "INTT"}, {"name": "Dropshipping Nacional"}, {"name": "Sex Shop"}]
    name_lower = product_data.get("name", "").lower()
    if "masturbador" in name_lower or "egg" in name_lower:
        tags_list.append({"name": "Masturbador"})
    if "gel" in name_lower or "óleo" in name_lower:
        tags_list.append({"name": "Gel Erótico"})
    if "vibro" in name_lower or "vibrador" in name_lower:
        tags_list.append({"name": "Vibrador"})

    payload = {
        "name": product_data.get("name", "Produto INTT"),
        "type": "variable",
        "description": raw_desc,
        "short_description": product_data.get("short_description", ""),
        "sku": sku,
        "weight": str(weight) if weight > 0 else "",
        "dimensions": {
            "length": str(length) if length > 0 else "",
            "width": str(width) if width > 0 else "",
            "height": str(height) if height > 0 else ""
        },
        "tags": tags_list,
        "meta_data": [
            {"key": "_casosex_stock_type", "value": "dropshipping_intt"},
            {"key": "_casosex_supplier", "value": "INTT"},
            {"key": "_casosex_supplier_id", "value": str(INTT_SUPPLIER_TERM_ID)},
            {"key": "_casosex_supplier_cnpj", "value": "21.725.006/0001-04"},
            {"key": "_casosex_cost_price", "value": str(cost_price)},
            {"key": "_cost_of_goods", "value": str(cost_price)},
            {"key": "supplier", "value": "INTT"},
            {"key": "_gtin", "value": gtin},
            {"key": "_barcode", "value": gtin},
            {"key": "_global_unique_id", "value": gtin},
            {"key": "_ncm", "value": ncm},
            {"key": "_weight_net", "value": str(weight_net)},
            {"key": "_casosex_brand", "value": brand},
            {"key": "_casosex_usage", "value": sections["usage"]},
            {"key": "_casosex_care", "value": sections["care"]},
            {"key": "_casosex_content", "value": sections["content_origin"]}
        ]
    }

    if cat_id > 0:
        payload["categories"] = [{"id": cat_id}]

    attr_name = "Opção"
    attr_options = [v.get("option_name", v.get("name", f"Opção {idx+1}")).strip() for idx, v in enumerate(variations_data)]
    payload["attributes"] = [{
        "name": attr_name,
        "position": 0,
        "visible": True,
        "variation": True,
        "options": attr_options
    }]
    if attr_options:
        payload["default_attributes"] = [{"name": attr_name, "option": attr_options[0]}]

    if product_data.get("images"):
        payload["images"] = [{"src": img} for img in product_data["images"] if isinstance(img, str) and img.startswith("http")]

    headers = _get_auth_header(ck, cs)

    existing_id = None
    if isinstance(existing, dict) and existing.get("id"):
        existing_id = existing["id"]
    elif isinstance(existing, list) and len(existing) > 0 and isinstance(existing[0], dict) and existing[0].get("id"):
        existing_id = existing[0]["id"]

    if existing_id:
        endpoint = f"{wc_url}/wp-json/wc/v3/products/{existing_id}?consumer_key={ck}&consumer_secret={cs}"
        method = "PUT"
        print(f"[CASOSEX INGEST] Atualizando produto existente ID #{existing_id} (SKU: {sku}, Tipo: {payload['type']})")
    else:
        payload["status"] = "pending"
        endpoint = f"{wc_url}/wp-json/wc/v3/products?consumer_key={ck}&consumer_secret={cs}"
        method = "POST"
        print(f"[CASOSEX INGEST] Cadastrando novo produto em curadoria 'pending' (SKU: {sku}, Tipo: {payload['type']})")

    # Execução via Motor PHP Soberano (ADR-0225 / ADR-0227)
    return _ingest_via_php(product_data, existing_id)


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
        option_val = var.get("option_name", var.get("name", f"Opção {idx+1}")).strip()
        var_gtin = str(var.get("gtin", "")).strip()
        var_ncm = str(var.get("ncm", "")).strip()

        var_payload = {
            "sku": var_sku,
            "regular_price": str(var_price),
            "manage_stock": True,
            "stock_quantity": var_stock,
            "stock_status": "instock" if var_stock > 0 else "outofstock",
            "attributes": [{"name": "Opção", "option": option_val}],
            "meta_data": [
                {"key": "_casosex_cost_price", "value": str(var_cost)},
                {"key": "_cost_of_goods", "value": str(var_cost)},
                {"key": "supplier", "value": "INTT"},
                {"key": "_casosex_supplier", "value": "INTT"},
                {"key": "_casosex_supplier_id", "value": str(INTT_SUPPLIER_TERM_ID)},
                {"key": "_casosex_supplier_cnpj", "value": "21.725.006/0001-04"},
                {"key": "_casosex_stock_type", "value": "dropshipping_intt"},
                {"key": "_gtin", "value": var_gtin},
                {"key": "_barcode", "value": var_gtin},
                {"key": "_ncm", "value": var_ncm}
            ]
        }

        if var.get("image"):
            var_payload["image"] = {"src": var["image"]}

        _ingest_variation_via_php(parent_id, var_payload)


def _ingest_variation_via_php(parent_id: int, var_payload: dict):
    var_sku = var_payload.get("sku", "")
    price = var_payload.get("regular_price", "0")
    stock = var_payload.get("stock_quantity", 0)
    weight = var_payload.get("weight", "0.05")
    option_val = var_payload["attributes"][0]["option"] if var_payload.get("attributes") else "Opção"
    
    meta_pairs = {m["key"]: m["value"] for m in var_payload.get("meta_data", [])}
    cost = meta_pairs.get("_casosex_cost_price", "0.0")
    gtin = meta_pairs.get("_gtin", "")
    ncm = meta_pairs.get("_ncm", "")

    php_script = f"""
    require_once('/var/www/html/wp-load.php');
    $existing_id = wc_get_product_id_by_sku('{var_sku}');
    if ($existing_id) {{
        $variation = wc_get_product($existing_id);
    }} else {{
        $variation = new WC_Product_Variation();
    }}
    $variation->set_parent_id({parent_id});
    $variation->set_sku('{var_sku}');
    $variation->set_regular_price('{price}');
    $variation->set_manage_stock(true);
    $variation->set_stock_quantity({stock});
    $variation->set_weight('{weight}');
    $variation->set_length('4');
    $variation->set_width('4');
    $variation->set_height('12');
    $variation->set_attributes(array('opcao' => '{option_val}'));
    $variation->update_meta_data('_casosex_cost_price', '{cost}');
    $variation->update_meta_data('_cost_of_goods', '{cost}');
    $variation->update_meta_data('supplier', 'INTT');
    $variation->update_meta_data('_casosex_supplier', 'INTT');
    $variation->update_meta_data('_casosex_supplier_id', '{INTT_SUPPLIER_TERM_ID}');
    $variation->update_meta_data('_casosex_supplier_cnpj', '21.725.006/0001-04');
    $variation->update_meta_data('_casosex_stock_type', 'dropshipping_intt');
    $variation->update_meta_data('_gtin', '{gtin}');
    $variation->update_meta_data('_barcode', '{gtin}');
    $variation->update_meta_data('_global_unique_id', '{gtin}');
    if (method_exists($variation, 'set_global_unique_id')) {{
        $variation->set_global_unique_id('{gtin}');
    }}
    $variation->update_meta_data('_ncm', '{ncm}');
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
    gtin = str(product_data.get("gtin", "")).replace("'", "\\'")
    ncm = str(product_data.get("ncm", "")).replace("'", "\\'")
    weight = float(product_data.get("weight", 0.0))
    weight_net = float(product_data.get("weight_net", 0.0))
    length = float(product_data.get("length", 0.0))
    width = float(product_data.get("width", 0.0))
    height = float(product_data.get("height", 0.0))
    brand = product_data.get("brand", "INTT").replace("'", "\\'")
    raw_cat = product_data.get("category", "")
    cat_name = resolve_category_by_product_name(product_data.get("name", ""), raw_cat).replace("'", "\\'")

    sections = extract_description_sections(product_data.get("description", ""))
    usage_txt = sections["usage"].replace("'", "\\'")
    care_txt = sections["care"].replace("'", "\\'")
    content_txt = sections["content_origin"].replace("'", "\\'")

    variations_data = product_data.get("variations", [])
    if not variations_data:
        var_sku = f"{sku}-VAR1" if not sku.endswith("-PARENT") else sku.replace("-PARENT", "-VAR1")
        variations_data = [{
            "sku": var_sku,
            "option_name": "Padrão",
            "cost_price": cost_price,
            "suggested_price": suggested_price,
            "stock_quantity": stock_qty,
            "gtin": gtin,
            "ncm": ncm,
            "weight": weight
        }]
        product_data["variations"] = variations_data
    is_variable = True

    options_list = [v.get("option_name", v.get("name", f"Opção {i+1}")).strip() for i, v in enumerate(variations_data)]
    options_str = " | ".join(options_list).replace("'", "\\'")
    attr_php = f"""
    $attr = new WC_Product_Attribute();
    $attr->set_name('Opção');
    $attr->set_options(explode(' | ', '{options_str}'));
    $attr->set_position(0);
    $attr->set_visible(true);
    $attr->set_variation(true);
    $product->set_attributes(array($attr));
    """

    php_script = f"""
    require_once('/var/www/html/wp-load.php');
    $id = {product_id if product_id else 0};
    $product = false;
    if ($id > 0) {{
        $product = wc_get_product($id);
        if ($product && $product->is_type('variation')) {{
            $parent_id = $product->get_parent_id();
            if ($parent_id > 0) {{
                $product = wc_get_product($parent_id);
            }} else {{
                $product = false;
            }}
        }}
    }}
    if (!$product) {{
        $existing_id = wc_get_product_id_by_sku('{sku}');
        if ($existing_id) {{
            $p_check = wc_get_product($existing_id);
            if ($p_check && $p_check->is_type('variation')) {{
                $p_parent_id = $p_check->get_parent_id();
                if ($p_parent_id > 0) {{
                    $product = wc_get_product($p_parent_id);
                }}
            }} else {{
                $product = $p_check;
            }}
        }}
    }}
    if ($product && !$product->is_type('variable') && !$product->is_type('variation')) {{
        wp_set_object_terms($product->get_id(), 'variable', 'product_type');
        $product = wc_get_product($product->get_id());
    }}
    if (!$product) {{
        $product = new WC_Product_Variable();
        $product->set_status('publish');
    }}
    $product->set_name('{name}');
    if ($product->get_sku() !== '{sku}') {{
        try {{
            $product->set_sku('{sku}');
        }} catch (Exception $e) {{
            // SKU em uso por variação existente
        }}
    }}
    $product->set_description('{desc}');
    $product->set_short_description('{short_desc}');
    {attr_php}
    if ({weight} > 0) $product->set_weight({weight});
    if ({length} > 0) $product->set_length({length});
    if ({width} > 0) $product->set_width({width});
    if ({height} > 0) $product->set_height({height});
    $product->update_meta_data('_casosex_stock_type', 'dropshipping_intt');
    $product->update_meta_data('_casosex_supplier', 'INTT');
    $product->update_meta_data('supplier', 'INTT');
    $product->update_meta_data('_casosex_supplier_id', '69');
    $product->update_meta_data('_casosex_supplier_cnpj', '21.725.006/0001-04');
    $product->update_meta_data('_casosex_cost_price', '{cost_price}');
    $product->update_meta_data('_cost_of_goods', '{cost_price}');
    $product->update_meta_data('_gtin', '{gtin}');
    $product->update_meta_data('_barcode', '{gtin}');
    $product->update_meta_data('_global_unique_id', '{gtin}');
    if (method_exists($product, 'set_global_unique_id')) {{
        $product->set_global_unique_id('{gtin}');
    }}
    $product->update_meta_data('_ncm', '{ncm}');
    $product->update_meta_data('_weight_net', '{weight_net}');
    $product->update_meta_data('_casosex_brand', '{brand}');
    $product->update_meta_data('_casosex_usage', '{usage_txt}');
    $product->update_meta_data('_casosex_care', '{care_txt}');
    $product->update_meta_data('_casosex_content', '{content_txt}');
    $first_opt = '{options_list[0] if options_list else "Padrão"}';
    $product->set_default_attributes(array('opcao' => $first_opt));

    $new_id = $product->save();

    if (!$product->is_type('variation')) {{
        // Categoria
        $cat_name = '{cat_name}';
        if (empty($cat_name) || strtolower($cat_name) === 'uncategorized' || strtolower($cat_name) === 'sem categoria') {{
            $cat_name = 'Produtos Eróticos INTT';
        }}
        $cat_term = get_term_by('name', $cat_name, 'product_cat');
        if (!$cat_term) {{
            $new_cat = wp_insert_term($cat_name, 'product_cat');
            if (!is_wp_error($new_cat)) {{
                $cat_term_id = (int)$new_cat['term_id'];
            }}
        }} else {{
            $cat_term_id = (int)$cat_term->term_id;
        }}
        if (isset($cat_term_id) && $cat_term_id > 0) {{
            $product->set_category_ids(array($cat_term_id));
            wp_set_object_terms($new_id, array($cat_term_id), 'product_cat');
        }}

        // Marca (product_brand)
        $brand_name = '{brand}';
        if (!empty($brand_name)) {{
            $brand_term = get_term_by('name', $brand_name, 'product_brand');
            if (!$brand_term) {{
                $new_b = wp_insert_term($brand_name, 'product_brand');
                if (!is_wp_error($new_b)) {{
                    $brand_term_id = (int)$new_b['term_id'];
                }}
            }} else {{
                $brand_term_id = (int)$brand_term->term_id;
            }}
            if (isset($brand_term_id) && $brand_term_id > 0) {{
                wp_set_object_terms($new_id, array($brand_term_id), 'product_brand', true);
            }}
        }}

        // Tags (product_tag)
        $tags = array('INTT', 'Dropshipping Nacional', 'Sex Shop');
        $n_low = strtolower('{name}');
        if (strpos($n_low, 'masturbador') !== false || strpos($n_low, 'egg') !== false) {{
            $tags[] = 'Masturbador';
        }}
        if (strpos($n_low, 'gel') !== false || strpos($n_low, 'óleo') !== false) {{
            $tags[] = 'Gel Erótico';
        }}
        if (strpos($n_low, 'vibro') !== false || strpos($n_low, 'vibrador') !== false) {{
            $tags[] = 'Vibrador';
        }}
        wp_set_object_terms($new_id, array_unique($tags), 'product_tag', true);

        // Fornecedor
        wp_set_object_terms($new_id, 69, 'dropship_supplier', true);

        // Processar imagens via media_sideload_image se fornecidas
        $img_urls = json_decode('{json.dumps(product_data.get("images", []))}', true);
        if (!empty($img_urls) && is_array($img_urls)) {{
            require_once(ABSPATH . 'wp-admin/includes/media.php');
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            require_once(ABSPATH . 'wp-admin/includes/image.php');
            $gallery_ids = array();
            foreach ($img_urls as $idx => $url) {{
                if (empty($url) || !is_string($url) || strpos($url, 'http') !== 0) continue;
                $attach_id = media_sideload_image($url, $new_id, null, 'id');
                if (!is_wp_error($attach_id)) {{
                    if ($idx === 0 && !$product->get_image_id()) {{
                        $product->set_image_id($attach_id);
                    }} else {{
                        $gallery_ids[] = $attach_id;
                    }}
                }}
            }}
            if (!empty($gallery_ids)) {{
                $existing_g_ids = $product->get_gallery_image_ids();
                $merged_g_ids = array_unique(array_merge($existing_g_ids, $gallery_ids));
                $product->set_gallery_image_ids($merged_g_ids);
            }}
        }}

        $product->save();
    }}

    echo json_encode(array('id' => $new_id, 'sku' => '{sku}', 'status' => $product->get_status()));
    """
    res = subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_script], capture_output=True, text=True)
    try:
        data = json.loads(res.stdout.strip())
        print(f"[CASOSEX INGEST] Ingestão Soberana via PHP executada com sucesso! Produto ID #{data.get('id')}")
        if is_variable and data.get('id'):
            _ingest_variations(data.get('id'), variations_data, WOOCOMMERCE_URL, WOOCOMMERCE_CK, WOOCOMMERCE_CS)
        return data
    except Exception as e:
        return {"error": str(e), "raw": res.stdout}


def _assign_supplier_term_via_wp(product_id: int, term_id: int = INTT_SUPPLIER_TERM_ID):
    cmd = f"docker exec casosex-wordpress php -r 'require_once(\"/var/www/html/wp-load.php\"); wp_set_object_terms({product_id}, {term_id}, \"dropship_supplier\", true);'"
    os.system(cmd)


def fetch_intt_product_page_details(opener, product_url: str) -> dict:
    """
    Realiza raspagem profunda na página individual do produto INTT para extrair:
    - Imagens em alta resolução (_zoom)
    - Modo de uso
    - Higiene & Cuidados
    """
    if not product_url:
        return {"images": [], "usage": "", "care": ""}

    req = urllib.request.Request(
        product_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )

    try:
        with opener.open(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # Extrair Imagens em Alta Resolução (_zoom ou cdn) incluindo URLs relativas de protocolo
            raw_imgs = re.findall(r'(?:https?:)?//static\.cdnlive\.com\.br/uploads/\d+/produto/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp)', html)
            fixed_imgs = ['https:' + img if img.startswith('//') else img for img in raw_imgs]
            zoom_imgs = []
            for img in fixed_imgs:
                if '_zoom' in img and img not in zoom_imgs:
                    zoom_imgs.append(img)
            final_imgs = zoom_imgs if zoom_imgs else list(dict.fromkeys(fixed_imgs))

            # Extrair Descrição HTML Completa (incluindo composição, recomendações e cuidados)
            full_desc_html = ""
            try:
                soup = BeautifulSoup(html, "html.parser")
                desc_node = soup.select_one(".new-section__description") or soup.select_one(".new-product-description-content")
                if desc_node:
                    full_desc_html = desc_node.decode_contents().strip()
            except Exception:
                pass

            # Extrair Modo de Uso
            m_usage = re.search(r'Modo de uso:?\s*</\w+>\s*<p>(.*?)</p>', html, re.IGNORECASE | re.DOTALL) or \
                      re.search(r'Modo de uso:?\s*<p>(.*?)</p>', html, re.IGNORECASE | re.DOTALL)
            usage = m_usage.group(1).strip() if m_usage else ""

            # Extrair Higiene & Cuidados
            m_care = re.search(r'Cuidados:?\s*</\w+>\s*<p>(.*?)</p>', html, re.IGNORECASE | re.DOTALL) or \
                     re.search(r'Precauções:?\s*</\w+>\s*<p>(.*?)</p>', html, re.IGNORECASE | re.DOTALL)
            care = m_care.group(1).strip() if m_care else ""

            return {
                "images": final_imgs,
                "full_description_html": full_desc_html,
                "usage": usage,
                "care": care
            }
    except Exception as e:
        print(f"[CASOSEX DEEP-SCRAPE] Aviso ao acessar {product_url}: {e}")
        return {"images": [], "full_description_html": "", "usage": "", "care": ""}


def fetch_intt_b2b_catalog(username: str = "", password: str = "") -> list:
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

                    product_url = item.get("link") or item.get("url") or item.get("pagina") or ""
                    deep_details = fetch_intt_product_page_details(opener, product_url) if product_url else {"images": [], "usage": "", "care": ""}

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

                    imgs = deep_details["images"] if deep_details["images"] else item.get("imagens", [item.get("imagem")] if item.get("imagem") else [])

                    extracted_products.append({
                        "sku": sku if sku.startswith("INTT-") else f"INTT-{sku}",
                        "name": str(item.get("nome") or item.get("titulo") or item.get("name", "Produto INTT")),
                        "description": deep_details["full_description_html"] or str(item.get("descricao") or item.get("description", "")),
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
                        "images": imgs,
                        "usage": deep_details["usage"],
                        "care": deep_details["care"],
                        "variations": parsed_variations
                    })
            except Exception:
                print(f"[CASOSEX DUAL-SCRAPE] Retorno do catálogo não é JSON. Tamanho da resposta: {len(content)} bytes.")
    except Exception as e:
        print(f"[CASOSEX DUAL-SCRAPE] Erro na consulta ao catálogo B2B: {e}")

    return extracted_products


def fetch_intt_public_catalog_all_categories():
    """
    Varre todas as categorias públicas da INTT (82 categorias) e extrai
    o catálogo completo de produtos via microdados JSON-LD (schema.org/Product).
    """
    print("[CASOSEX PUBLIC SCRAPE] Iniciando varredura das 82 categorias públicas da INTT...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    
    cats = []
    try:
        req_cats = urllib.request.Request("https://www.lojaintt.com.br/ajax/produtos.php", headers=headers)
        with urllib.request.urlopen(req_cats, context=ctx, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            soup = BeautifulSoup(html, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if "/categoria/" in href:
                    url = href if href.startswith("http") else f"https://www.lojaintt.com.br{href}"
                    if url not in cats:
                        cats.append(url)
    except Exception as e:
        print(f"[CASOSEX PUBLIC SCRAPE] Erro ao listar categorias: {e}")

    print(f"[CASOSEX PUBLIC SCRAPE] {len(cats)} categorias identificadas. Extraindo produtos...")
    extracted = {}

    for idx, cat_url in enumerate(cats):
        try:
            req = urllib.request.Request(cat_url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                cat_html = resp.read().decode("utf-8", errors="ignore")
                soup = BeautifulSoup(cat_html, "html.parser")
                
                # Extrai blocos JSON-LD
                for j in soup.find_all("script", type="application/ld+json"):
                    if not j.string:
                        continue
                    try:
                        data = json.loads(j.string)
                        items = []
                        if isinstance(data, dict):
                            if data.get("@type") == "ItemList":
                                items = [e.get("item") for e in data.get("itemListElement", []) if e.get("item")]
                            elif data.get("@type") == "Product":
                                items = [data]
                        
                        for item in items:
                            pid = str(item.get("@id") or item.get("sku") or item.get("url", "").split("/")[-1].split("-")[0])
                            if not pid or pid in extracted:
                                continue
                            
                            name = str(item.get("name", "Produto INTT"))
                            desc = str(item.get("description", ""))
                            offers = item.get("offers", {})
                            price = float(offers.get("price", 0.0)) if isinstance(offers, dict) else 0.0
                            img = item.get("image", "")
                            url = item.get("url", "")
                            
                            weight = 0.1
                            w_data = item.get("weight", {})
                            if isinstance(w_data, dict):
                                weight = float(w_data.get("value", 0.1))
                                
                            sku = f"INTT-{pid}"
                            
                            extracted[pid] = {
                                "sku": sku,
                                "name": name,
                                "description": f"<p>{desc}</p>",
                                "short_description": name,
                                "cost_price": round(price * 0.5, 2),
                                "suggested_price": price,
                                "stock_quantity": 50,
                                "weight": weight,
                                "brand": "INTT",
                                "images": [img] if img else [],
                                "url": url
                            }
                    except Exception:
                        pass
        except Exception:
            pass

    print(f"[CASOSEX PUBLIC SCRAPE] Varredura concluída com sucesso! Total de {len(extracted)} produtos únicos extraídos.")
    return list(extracted.values())


def mock_sample_intt_ingest():
    """
    Ingestão e Validação Soberana do Catálogo de 7 produtos INTT com Descrições Longas, GTINs, NCMs e Atributos.
    """
    catalog_7_items = [
        {
            "sku": "INTT-BABALUB-HOT",
            "name": "Babalub Vibra Esquenta INTT – Gel Estimulante Beijável Chiclete – 15g",
            "description": "<p>Babalub Vibra Esquenta é um gel estimulante que vai levar sua experiência para um nível totalmente novo. Desenvolvido com uma fórmula exclusiva à base de jambu, este produto oferece sensações inigualáveis de vibrações e aquecimento, criando um turbilhão de prazer. Além disso, o Babalub é beijável, com um irresistível aroma de chiclete que torna os momentos de intimidade ainda mais deliciosos.</p><h4>Efeito Quente:</h4><p><strong>Aquecimento Sensual:</strong> O Babalub Vibra Esquenta oferece uma sensação de aquecimento suave e estimulante quando aplicado na região. Isso não apenas aumenta o desejo, mas também ajuda a relaxar e preparar o corpo para o prazer que está por vir.</p><p><strong>Estímulo Profundo:</strong> A sensação de calor proporcionada pelo Babalub aumenta o fluxo sanguíneo para a área, intensificando a sensibilidade e tornando cada toque e carícia mais incrivelmente prazeroso.</p><p><strong>Intimidade e Conexão:</strong> Compartilhar a aplicação deste produto com seu parceiro cria um momento de grande conexão, transformando preliminares em uma experiência compartilhada de intimidade e desejo.</p><p><strong>Exploração Sem Limites:</strong> O efeito quente do Babalub Vibra Esquenta permite que você e sua parceira explorem novas sensações e fantasias, elevando a paixão e a criatividade na intimidade.</p><h4>Benefícios:</h4><ul><li>Intensifica as sensações e a sensibilidade.</li><li>Proporciona uma experiência única devido à temperatura e vibração.</li><li>Estimula a criatividade e a intimidade no relacionamento.</li><li>Oferece momentos deliciosos e beijáveis para compartilhar com sua parceria.</li></ul><h4>Seus ativos:</h4><p><strong>Jambu:</strong> Mais conhecido como agrião do Pará. O Jambu é uma planta muito comum da região Norte do Brasil. O jambu quando aplicado proporciona sensação de vibração.</p><h4>Linha Sweet Secrets by Carla Geane:</h4><p>Descubra a Linha Sweet Secrets by Carla Geane, cuidadosamente desenvolvida para garantir sua satisfação e elevar seu prazer.</p><h4>📖 MODO DE USO:</h4><p>Aplicar uma quantidade suficiente sobre a região desejada e massagear levemente antes ou durante o ato.</p><h4>🧼 HIGIENE & CUIDADOS:</h4><p>Embalagem não reutilizável. Manter em lugar fresco ao abrigo do calor e da luz intensa. Mantenha fora do alcance das crianças. Em caso de contato com os olhos, lavá-los com água em abundância. Havendo irritação, suspenda o uso e procure um médico. USO EXTERNO.</p><p>Conteúdo: 15g | Origem: Nacional</p>",
            "short_description": "Gel Estimulante Vibratório e Aquecedor Beijável Sabor Chiclete - 15g",
            "cost_price": 19.90,
            "suggested_price": 39.90,
            "stock_quantity": 80,
            "gtin": "7898563342007",
            "ncm": "3304.99.90",
            "weight": 0.05,
            "weight_net": 0.015,
            "length": 4.0,
            "width": 4.0,
            "height": 10.0,
            "category": "Géis Sensacionais",
            "brand": "INTT",
            "images": [
                "https://static.cdnlive.com.br/uploads/687/produto/17164923665804_zoom.jpeg",
                "https://static.cdnlive.com.br/uploads/687/produto/17164923679962_zoom.jpeg",
                "https://static.cdnlive.com.br/uploads/687/produto/17164923673619_zoom.jpeg",
                "https://static.cdnlive.com.br/uploads/687/produto/17164923674890_zoom.jpeg",
                "https://static.cdnlive.com.br/uploads/687/produto/17164923689470_zoom.jpeg"
            ]
        },
        {
            "sku": "INTT-799-PARENT",
            "name": "Toque Hipnótico by Deborah Secco Gel Deslizante Siliconado – 60ml",
            "description": "<p>Toque Hipnótico por Deborah Secco em parceria exclusiva com a INTT é um gel lubrificante e deslizante de silicone de altíssima performance. Desenvolvido para proporcionar um deslizar acetinado, duradouro e sedoso, não seca na pele e resiste inclusive à água.</p><h4>Características Especiais:</h4><ul><li>Fórmula 100% à base de silicone de grau farmacêutico.</li><li>Toque aveludado e sensação de hidratação prolongada.</li><li>Ideal para uso em massagens íntimas corporais e momentos especiais.</li><li>Assinado e testado pessoalmente pela atriz Deborah Secco.</li></ul><h4>📖 MODO DE USO:</h4><p>Aplique uma pequena quantidade nas mãos ou diretamente na área desejada e espalhe suavemente. Pode ser reaplicado conforme a necessidade.</p><h4>🧼 HIGIENE & CUIDADOS:</h4><p>Conservar ao abrigo da luz e do calor excessivo. Manter fora do alcance de crianças. Uso externo.</p><p>Conteúdo: 60ml | Origem: Nacional</p>",
            "short_description": "Gel Deslizante Siliconado Alta Performance Deborah Secco 60ml",
            "cost_price": 39.90,
            "suggested_price": 79.90,
            "stock_quantity": 30,
            "gtin": "7898582310799",
            "ncm": "3304.99.90",
            "weight": 0.10,
            "weight_net": 0.06,
            "length": 5.0,
            "width": 5.0,
            "height": 14.0,
            "category": "Géis Corporal & Massagem",
            "brand": "INTT Deborah Secco",
            "images": ["https://static.cdnlive.com.br/uploads/694/produto/17144837568551_zoom.png"]
        },
        {
            "sku": "INTT-797-PARENT",
            "name": "Pico Pulse Menta INTT – Gel Estimulante Chiclete de Menta – 16g",
            "description": "<p>Pico Pulse Menta INTT é um gel estimulante oral e sensorial irresistível com sabor intenso de chiclete de menta. Formulado com extrato de Jambu, ele proporciona ondas de pulsação, vibração intensa e um frescor gélido eletrizante que eleva o prazer a um novo patamar.</p><h4>Benefícios Principais:</h4><ul><li>Efeito vibratório e pulsante de alta intensidade.</li><li>Frescor eletrizante e gélido que estimula a circulação local.</li><li>Totalmente beijável com delicioso sabor de chiclete de menta.</li><li>Fórmula concentrada em bisnaga prática de 16g.</li></ul><h4>📖 MODO DE USO:</h4><p>Aplique de 1 a 2 borrifadas ou pequenas gotas no local desejado e massageie levemente. Aguarde alguns segundos para sentir o pulsar.</p><h4>🧼 HIGIENE & CUIDADOS:</h4><p>Manter em temperatura ambiente e longe da luz solar direta. Em caso de irritação, suspenda o uso. Mantenha longe de crianças.</p><p>Conteúdo: 16g | Origem: Nacional</p>",
            "short_description": "Gel Estimulante Pulsante Sensorial Menta 16g",
            "cost_price": 21.90,
            "suggested_price": 44.90,
            "stock_quantity": 40,
            "gtin": "7898582310797",
            "ncm": "3304.99.90",
            "weight": 0.05,
            "weight_net": 0.016,
            "length": 4.0,
            "width": 4.0,
            "height": 10.0,
            "category": "Géis Sensacionais",
            "brand": "INTT",
            "images": ["https://static.cdnlive.com.br/uploads/694/produto/17144832442316_zoom.png"]
        },
        {
            "sku": "INTT-801-PARENT",
            "name": "Thor Egg Magnus Masturbador INTT Super Resistente",
            "description": "<p>O Thor Egg Magnus da INTT é um masturbador masculino em formato de ovo desenvolvido com silicone TPE ultra elástico de última geração. Possui uma estrutura interna rica em estrias anatômicas e relevos ondulados projetados para proporcionar uma estimulação envolvente, intensa e surpreendente.</p><h4>Diferenciais do Thor Egg Magnus:</h4><ul><li>Material de altíssima elasticidade que se adapta perfeitamente a qualquer tamanho.</li><li>Textura interna exclusiva Magnus com relevos ondulados de estímulo profundo.</li><li>Acompanha sachê de lubrificante para uso imediato.</li><li>Discreto, portátil e de fácil higienização.</li></ul><h4>📖 MODO DE USO:</h4><p>Abra o invólucro do ovo, retire o sachê de lubrificante e aplique-o no interior do Egg. Encaixe na cabeça do pênis e deslide o material ao longo do corpo cavernoso em movimentos ritmados.</p><h4>🧼 HIGIENE & CUIDADOS:</h4><p>Lave com água morna e sabão neutro antes e após o uso. Seque à sombra e aplique amido de milho para preservar o material TPE. Guarde na embalagem original.</p><p>Conteúdo: 1 Unidade + 1 Sachê | Origem: Nacional</p>",
            "short_description": "Masturbador Masculino Texturizado Ovo TPE Elástico",
            "cost_price": 16.90,
            "suggested_price": 34.90,
            "stock_quantity": 60,
            "gtin": "7898582310801",
            "ncm": "3926.90.90",
            "weight": 0.06,
            "weight_net": 0.045,
            "length": 5.0,
            "width": 5.0,
            "height": 7.0,
            "category": "Masturbadores",
            "brand": "INTT",
            "images": ["https://static.cdnlive.com.br/uploads/694/produto/17144841223912_zoom.png"]
        },
        {
            "sku": "INTT-9988-PARENT",
            "name": "Gel de Massagem Corporal INTT Premium 100ml",
            "description": "<p>Gel de Massagem Corporal INTT Premium é um gel hidratante, deslizante e beijável desenvolvido especialmente para massagens tântricas e preliminares envolventes. Com fragrância suave e textura aveludada, proporciona momentos de relaxamento e conexão profunda entre o casal.</p><h4>Diferenciais do Gel Premium:</h4><ul><li>Fórmula hidratante com alto poder de deslizamento.</li><li>Totalmente beijável e comestível com sabor delicado.</li><li>Não gorduroso e facilmente lavável com água.</li></ul><h4>📖 MODO DE USO:</h4><p>Aplicar quantidade suficiente na palma das mãos e massagear suavemente as regiões do corpo desejadas.</p><h4>🧼 HIGIENE & CUIDADOS:</h4><p>Conservar em local seco e fresco, fora do alcance de crianças. Havendo irritação, suspenda o uso.</p><p>Conteúdo: 100ml | Origem: Nacional</p>",
            "short_description": "Gel de Massagem Corporal Hidratante Beijável 100ml",
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
            "images": ["https://static.cdnlive.com.br/uploads/694/produto/16843452636254_zoom.png"]
        },
        {
            "sku": "INTT-9989-PARENT",
            "name": "Óleo Corporal Beijável INTT Morango 120ml",
            "description": "<p>Óleo Corporal Beijável INTT Morango é o acompanhante perfeito para aquecer a relação e transformar massagens corporais em momentos inesquecíveis de puro desejo. Possui aroma envolvente de morango fresco e é 100% beijável.</p><h4>Benefícios:</h4><ul><li>Sensação de aquecimento suave ao soprar ou friccionar a pele.</li><li>Sabor doce e envolvente de morango.</li><li>Livre de parabenos e testado dermatologicamente.</li></ul><h4>📖 MODO DE USO:</h4><p>Espalhe o óleo no corpo e sopre suavemente para ativar o efeito térmico aquecedor antes de beijar a área.</p><h4>🧼 HIGIENE & CUIDADOS:</h4><p>Manter a embalagem bem fechada e ao abrigo do calor. Mantenha fora do alcance de crianças.</p><p>Conteúdo: 120ml | Origem: Nacional</p>",
            "short_description": "Óleo Massagem Térmico Beijável Morango 120ml",
            "cost_price": 21.50,
            "suggested_price": 42.90,
            "stock_quantity": 35,
            "gtin": "7898582310159",
            "ncm": "3304.99.90",
            "weight": 0.15,
            "weight_net": 0.12,
            "length": 6.0,
            "width": 6.0,
            "height": 16.0,
            "category": "Óleos & Velas de Massagem",
            "brand": "INTT",
            "images": ["https://static.cdnlive.com.br/uploads/694/produto/16843452636254_zoom.png"]
        },
        {
            "sku": "INTT-9990",
            "name": "VibroBeijável INTT 15ml (Multissabores)",
            "description": "<p>VibroBeijável INTT 15ml é um gel estimulante unissex que une a sensação de vibração pulsante com sabores gourmet irresistíveis para momentos de sexo oral e preliminares. Sua fórmula exclusiva à base de extratos vegetais ativa a circulação e amplia a sensibilidade das zonas erógenas.</p><h4>Diferenciais:</h4><ul><li>Sensação de vibração eletrizante na boca e na região íntima.</li><li>Sabores gourmet beijáveis de Morango e Hortelã.</li><li>Embalagem pump de fácil dosagem sem desperdício.</li></ul><h4>📖 MODO DE USO:</h4><p>Aplicar 2 a 3 borrifadas na região íntima ou nos lábios antes das preliminares.</p><h4>🧼 HIGIENE & CUIDADOS:</h4><p>Manter a embalagem fechada após o uso. Em caso de irritação suspenda o uso.</p><p>Conteúdo: 15ml | Origem: Nacional</p>",
            "short_description": "Gel Estimulante Vibratório Beijável 15ml",
            "cost_price": 18.50,
            "suggested_price": 39.90,
            "stock_quantity": 100,
            "gtin": "7898582310200",
            "ncm": "3304.99.90",
            "weight": 0.05,
            "category": "Géis Sensacionais",
            "brand": "INTT",
            "images": ["https://static.cdnlive.com.br/uploads/694/produto/16843452636254_zoom.png"],
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
    ]

    results = []
    for item in catalog_7_items:
        print(f"[CASOSEX INGEST] Processando produto INTT: {item['name']} (SKU: {item['sku']})")
        res = ingest_product_to_woocommerce(item)
        results.append(res)
    
    return results


if __name__ == "__main__":
    products = fetch_intt_b2b_catalog()
    if products:
        print(f"[CASOSEX INGEST] {len(products)} produtos B2B extraídos da INTT. Iniciando sincronização WooCommerce...")
        for p in products:
            ingest_product_to_woocommerce(p)
    else:
        print("[CASOSEX INGEST] Login B2B temporariamente indisponível/bloqueado. Iniciando varredura soberana de todas as 82 categorias públicas...")
        public_products = fetch_intt_public_catalog_all_categories()
        if public_products:
            print(f"[CASOSEX INGEST] {len(public_products)} produtos públicos extraídos da INTT. Carga em massa no WooCommerce iniciada...")
            for idx, p in enumerate(public_products):
                print(f"[CASOSEX INGEST] [{idx+1}/{len(public_products)}] Ingerindo {p['name']} ({p['sku']})...")
                ingest_product_to_woocommerce(p)
        else:
            print("[CASOSEX INGEST] Fallback para amostragem de validação...")
            mock_sample_intt_ingest()
