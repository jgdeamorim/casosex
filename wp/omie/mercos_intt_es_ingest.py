#!/usr/bin/env python3
"""
mercos_intt_es_ingest.py — Esteira Soberana CASOSEX (ADR-0237 & ADR-0238)
Sincronização Automática do Catálogo Regional INTT ES via Mercos B2B API (meuspedidos.com.br).
Ingestão de ~2.400 produtos com Metadados Ricos:
- Consulta do endpoint de detalhe (/api_b2b/v1/produtos/{pid}/) para obter descrição completa (modo de uso, precauções, composição).
- Importação das fotos HD para a Biblioteca de Mídia do WordPress com set_post_thumbnail.
- Associação de categorias e atributos.
"""

import json
import urllib.request
import urllib.parse
import ssl
import sys
import os
import subprocess
import time
import argparse
from concurrent.futures import ThreadPoolExecutor

WOOCOMMERCE_URL = os.environ.get("CASOSEX_WC_URL", "http://localhost:8085")
MERCOS_LOGIN_URL = "https://app.mercos.com/api_b2b/v1/login"
MERCOS_PRODUCTS_URL = "https://app.mercos.com/api_b2b/v1/produtos/"
MERCOS_SUBDOMAIN = "inttespiritosanto"
MERCOS_USER = os.environ.get("INTT_ES_USER", "contatevolupia@gmail.com")
MERCOS_PASS = os.environ.get("INTT_ES_PASS", "@Volupia2027!")
INTT_ES_SUPPLIER_ID = 70


def authenticate_mercos() -> str:
    """
    Autentica na API B2B do Mercos e retorna o Token Bearer.
    """
    payload = json.dumps({
        "email": MERCOS_USER,
        "senha": MERCOS_PASS,
        "subdominio": MERCOS_SUBDOMAIN
    }).encode("utf-8")

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": f"https://{MERCOS_SUBDOMAIN}.meuspedidos.com.br",
        "Referer": f"https://{MERCOS_SUBDOMAIN}.meuspedidos.com.br/entrar"
    }

    req = urllib.request.Request(MERCOS_LOGIN_URL, data=payload, headers=headers, method="POST")
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            token = data.get("token")
            if token:
                print(f"[MERCOS API] Autenticação realizada com sucesso. Account ID: {data.get('parametros_tag_manager', {}).get('account_id')}")
                return token
    except Exception as e:
        print(f"[MERCOS API ERROR] Falha ao autenticar no Mercos: {e}")
        sys.exit(1)
    return ""


def fetch_product_detail(token: str, pid: int) -> dict:
    """
    Busca o detalhe completo de um produto no Mercos (/api_b2b/v1/produtos/{pid}/)
    para extrair a descrição completa (informacoes_adicionais), imagens e categorias.
    """
    url = f"{MERCOS_PRODUCTS_URL}{pid}/"
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Origin": f"https://{MERCOS_SUBDOMAIN}.meuspedidos.com.br"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"[DETAIL FETCH ERR] PID {pid}: {e}")
        return {}


def upsert_batch_in_woocommerce(products_details: list, dry_run: bool = False) -> list:
    """
    Cria ou atualiza um LOTE de produtos enriquecidos no WooCommerce via 1 execução PHP com media_sideload_image.
    """
    items = []
    for prod in products_details:
        if not prod:
            continue
        sku = f"INTT-ES-{prod.get('codigo', '').strip()}"
        title = prod.get("nome", "").strip()
        description = (prod.get("informacoes_adicionais") or "").strip()
        images = prod.get("imagens", [])
        categories = [c.get("nome") for c in prod.get("categorias", []) if c.get("nome")]
        weight = float(prod.get("peso_bruto") or 0.0)
        height = float(prod.get("altura") or 0.0)
        width = float(prod.get("largura") or 0.0)
        length = float(prod.get("comprimento") or 0.0)
        cost_price = float(prod.get("preco_tabela") or prod.get("preco") or 0.0)

        items.append({
            "sku": sku,
            "title": title,
            "description": description,
            "images": images,
            "categories": categories,
            "weight": weight,
            "height": height,
            "width": width,
            "length": length,
            "cost_price": cost_price,
            "supplier_id": INTT_ES_SUPPLIER_ID
        })

    if dry_run:
        for it in items:
            print(f"[DRY-RUN] SKU: {it['sku']} | Nome: {it['title']} | Desc LOC: {len(it['description'])} | Fotos: {len(it['images'])}")
        return [{"sku": it["sku"], "status": "dry-run"} for it in items]

    payload_data = json.dumps(items)

    php_script = """
    require_once('/var/www/html/wp-load.php');
    require_once(ABSPATH . 'wp-admin/includes/media.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/image.php');

    $raw = file_get_contents('php://stdin');
    $items = json_decode($raw, true);
    if (!$items || !is_array($items)) {
        echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON input'));
        exit(1);
    }

    $results = array();
    foreach ($items as $data) {
        $sku = $data['sku'];
        $title = $data['title'];
        $desc = $data['description'];
        $images = $data['images'];
        $categories = $data['categories'];
        $weight = $data['weight'];
        $height = $data['height'];
        $width = $data['width'];
        $length = $data['length'];
        $cost_price = $data['cost_price'];
        $supplier_id = $data['supplier_id'];

        $product_id = wc_get_product_id_by_sku($sku);
        $is_new = false;

        if ($product_id) {
            $product = wc_get_product($product_id);
        } else {
            $product = new WC_Product_Simple();
            $product->set_sku($sku);
            $product->set_status('pending'); // Rascunho para curadoria
            $is_new = true;
        }

        $product->set_name($title);
        if (!empty($desc)) {
            $product->set_description($desc);
        }

        if ($cost_price > 0) {
            $current_price = $product->get_regular_price();
            if (empty($current_price)) {
                $sale_price = number_format($cost_price * 1.8, 2, '.', '');
                $product->set_regular_price($sale_price);
                $product->set_price($sale_price);
            }
        }

        if ($weight > 0) $product->set_weight($weight);
        if ($height > 0) $product->set_height($height);
        if ($width > 0) $product->set_width($width);
        if ($length > 0) $product->set_length($length);

        // Mapeia categorias no WooCommerce
        if (!empty($categories) && is_array($categories)) {
            $cat_ids = array();
            foreach ($categories as $cat_name) {
                $term = get_term_by('name', $cat_name, 'product_cat');
                if (!$term) {
                    $new_term = wp_insert_term($cat_name, 'product_cat');
                    if (!is_wp_error($new_term)) {
                        $cat_ids[] = $new_term['term_id'];
                    }
                } else {
                    $cat_ids[] = $term->term_id;
                }
            }
            if (!empty($cat_ids)) {
                $product->set_category_ids($cat_ids);
            }
        }

        $product_id = $product->save();

        // Metadados Soberanos CASOSEX
        update_post_meta($product_id, '_casosex_cost_price', $cost_price);
        update_post_meta($product_id, '_casosex_supplier_id', $supplier_id);
        update_post_meta($product_id, '_casosex_stock_type', 'dropshipping_intt_es');

        // Sideload de Imagens para a Biblioteca de Mídia do WordPress
        if (!empty($images) && is_array($images)) {
            $existing_thumb = get_post_thumbnail_id($product_id);
            if (empty($existing_thumb)) {
                $first_img = $images[0];
                $attach_id = media_sideload_image($first_img, $product_id, $title, 'id');
                if (!is_wp_error($attach_id)) {
                    set_post_thumbnail($product_id, $attach_id);
                }
            }
        }

        $results[] = array('id' => $product_id, 'sku' => $sku, 'is_new' => $is_new, 'status' => 'success');
    }

    echo json_encode($results);
    """

    res = subprocess.run(["docker", "exec", "-i", "casosex-wordpress", "php", "-r", php_script], input=payload_data, capture_output=True, text=True)
    try:
        results = json.loads(res.stdout.strip())
        for out in results:
            print(f"[ENRICH OK] ID: {out.get('id')} | SKU: {out.get('sku')} | Novo: {out.get('is_new')} | Status: {out.get('status')}")
        return results
    except Exception as e:
        print(f"[ENRICH ERR] stdout={res.stdout} stderr={res.stderr} err={e}")
        return [{"sku": it["sku"], "status": "error"} for it in items]


def fetch_and_sync_mercos_catalog(token: str, max_pages: int = 100, limit: int = 0, dry_run: bool = False):
    """
    Itera sobre o catálogo B2B do Mercos INTT ES, busca o detalhe completo via multithreading e sincroniza no WooCommerce.
    """
    page = 1
    total_synced = 0
    total_new = 0

    print(f"=== INICIANDO ENRIQUECIMENTO COMPLETO INTT ES (DESCRICAO + FOTOS HD) ===")
    print(f"Target WC: {WOOCOMMERCE_URL} | Supplier ID: {INTT_ES_SUPPLIER_ID} | Dry-run: {dry_run}\n")

    while page <= max_pages:
        url = f"{MERCOS_PRODUCTS_URL}?page={page}"
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "Origin": f"https://{MERCOS_SUBDOMAIN}.meuspedidos.com.br"
        }

        req = urllib.request.Request(url, headers=headers)
        try:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                products_summary = json.loads(resp.read().decode("utf-8"))
                if not products_summary:
                    print(f"Fim do catálogo atingido na página {page}.")
                    break

                if limit > 0 and (total_synced + len(products_summary)) > limit:
                    products_summary = products_summary[:(limit - total_synced)]

                print(f"--- Buscando Detalhes Ricos da Página {page} ({len(products_summary)} produtos) ---")
                
                # Fetch multi-threaded dos detalhes de cada produto
                details = []
                with ThreadPoolExecutor(max_workers=8) as executor:
                    futures = [executor.submit(fetch_product_detail, token, p["produto_id"]) for p in products_summary]
                    for fut in futures:
                        res_det = fut.result()
                        if res_det:
                            details.append(res_det)

                print(f"--- Sincronizando Lote Página {page} no WooCommerce ({len(details)} itens enriquecidos) ---")
                results = upsert_batch_in_woocommerce(details, dry_run=dry_run)
                
                for r in results:
                    total_synced += 1
                    if r.get("is_new"):
                        total_new += 1

                if limit > 0 and total_synced >= limit:
                    print(f"\n[LIMIT HIT] Atingido o limite configurado de {limit} produtos.")
                    break

                page += 1
                time.sleep(0.1)
        except Exception as e:
            print(f"[FETCH ERR] Erro na página {page}: {e}")
            break

    print(f"\n✅ SINCRONIZAÇÃO COMPLETA & ENRIQUECIMENTO CONCLUÍDO!")
    print(f"Total Processado: {total_synced} produtos | Novos Criados: {total_new}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingestão Rica de Catálogo INTT ES (Mercos B2B API) -> WooCommerce")
    parser.add_argument("--pages", type=int, default=100, help="Número máximo de páginas a buscar (48 itens/pág)")
    parser.add_argument("--limit", type=int, default=0, help="Limite máximo de produtos a processar (0 = sem limite)")
    parser.add_argument("--dry-run", action="store_true", help="Executa sem alterar o banco de dados do WooCommerce")

    args = parser.parse_args()

    token = authenticate_mercos()
    if token:
        fetch_and_sync_mercos_catalog(token, max_pages=args.pages, limit=args.limit, dry_run=args.dry_run)
