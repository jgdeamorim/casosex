import urllib.request
import json
import http.cookiejar
import subprocess
import re
import os

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

login_url = 'https://app.mercos.com/api_b2b/v1/login'
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://inttespiritosanto.meuspedidos.com.br',
    'Referer': 'https://inttespiritosanto.meuspedidos.com.br/entrar'
}

payload_login = json.dumps({
    'email': 'contatevolupia@gmail.com',
    'senha': '@Volupia2027!',
    'subdominio': 'inttespiritosanto'
}).encode('utf-8')

print("[1/4] Autenticando na API Mercos B2B...")
req_log = urllib.request.Request(login_url, data=payload_login, headers=headers, method='POST')
with opener.open(req_log) as r_log:
    token = json.loads(r_log.read().decode('utf-8'))['token']

headers['Authorization'] = f'Bearer {token}'

req_cli = urllib.request.Request('https://app.mercos.com/api_b2b/v1/login/clientes/', headers=headers)
with opener.open(req_cli) as r_cli:
    cli_data = json.loads(r_cli.read().decode('utf-8'))
    cid = cli_data['clientes'][0]['cliente_id']

payload_sel = json.dumps({'cliente_id': cid}).encode('utf-8')
req_sel = urllib.request.Request('https://app.mercos.com/api_b2b/v1/login/clientes/', data=payload_sel, headers=headers, method='POST')
opener.open(req_sel)
print("[1/4] Sessão de cliente ativada com sucesso!")

# 5 produtos selecionados de categorias e marcas diferentes para teste
# 3069: Fruit Sexy Maça do Amor (Gel beijável / Sabor)
# 3057: Esfoliante Íntimo Déborah Secco (Linha Déborah Secco)
# 3044: Cliv Intt Dessensibilizante (Cosmético Anal / Efeito)
# 3037: Bullet Mimo Rosa (Sex Toy / Importados Intt Toys)
# 3053: Desodorante Intimo Eros Morango (Desodorante / Sabor / Higiene)
test_skus = ['INTT-ES-IN0471', 'INTT-ES-IN0712', 'INTT-ES-IN0139', 'INTT-ES-IM0467', 'INTT-ES-IN0453']

print(f"[2/4] Extraindo detalhes B2B dos 5 produtos: {test_skus}...")
products_payload = []

sabores_conhecidos = [
    'Menta', 'Morango', 'Chocolate ao Leite', 'Chocolate', 'Uva', 'Framboesa', 
    'Baunilha', 'Chiclete', 'Algodão Doce', 'Neutro', 'Maçã do Amor', 'Maça do Amor',
    'Caipirinha', 'Amarula', 'Coca Cola', 'Energético', 'Maracujá', 'Melancia', 
    'Tutti Frutti', 'Ice', 'Vinho Tinto', 'Merengue'
]

efeitos_conhecidos = [
    ('Esquenta (Warm)', ['quente', 'aquecimento', 'esquenta', 'warm']),
    ('Esfria (Ice)', ['gelado', 'frio', 'ice', 'refrescante', 'esfria']),
    ('Pulsante', ['vibra', 'pulsante', 'vibration', 'choque', 'pulsação']),
    ('Dessensibilizante', ['dessensibilizante', 'dessensibiliza', 'anestésico', 'conforto anal']),
    ('Retardante', ['retardante', 'prolonga']),
    ('Aperta / Adstringente', ['aperta', 'adstringente']),
    ('Hidratante', ['hidratante', 'hidratação', 'esfoliante'])
]

for sku in test_skus:
    clean_code = sku.replace('INTT-ES-', '')
    req_s = urllib.request.Request(f'https://app.mercos.com/api_b2b/v1/produtos/?busca={clean_code}', headers=headers)
    with opener.open(req_s, timeout=10) as rs:
        items = json.loads(rs.read().decode('utf-8'))
        exact = next((it for it in items if it.get('codigo') == clean_code), items[0])
        pid = exact['produto_id']
        r_det = urllib.request.Request(f'https://app.mercos.com/api_b2b/v1/produtos/{pid}/', headers=headers)
        with opener.open(r_det, timeout=10) as rd:
            d = json.loads(rd.read().decode('utf-8'))
            
            nome = d.get('nome', '')
            desc = d.get('informacoes_adicionais') or ''
            cost_price = float(d.get('preco_tabela') or d.get('preco') or 0.0)
            sale_price = round(cost_price * 1.8, 2)
            
            # Marca
            if 'deborah secco' in nome.lower() or 'déborah secco' in nome.lower():
                brand_slug = 'intt-by-deborah-secco'
            elif 'bullet' in nome.lower() or 'vibrador' in nome.lower() or 'anal control' in nome.lower() or 'bella' in nome.lower():
                brand_slug = 'intt' # Ou intt-toys
            else:
                brand_slug = 'intt'
                
            # Categorias mapeadas
            cats = [274] # Cosméticos por padrão
            if 'fruit' in nome.lower() or 'beijável' in nome.lower() or 'beijavel' in nome.lower():
                cats.extend([76, 193, 192]) # Géis Beijáveis, Beijáveis, Sexo Oral
            if 'cliv' in nome.lower() or 'anal' in nome.lower():
                cats.extend([75, 236, 228]) # Géis Anais, Anal, Sexo Anal
            if 'bullet' in nome.lower():
                cats = [88, 237, 275] # Bullets, Bullet, Importados Intt Toys
            if 'desodorante' in nome.lower() or 'esfoliante' in nome.lower():
                cats.extend([207, 204, 84]) # Desodorantes, Saúde íntima, Higiene & Bem-Estar
                
            # Extração de Atributos
            # Volume
            vol_match = re.search(r'(\d+[\.,]?\d*)\s*(ml|g|kg|l)\b', nome, re.IGNORECASE)
            volume = f"{vol_match.group(1)}{vol_match.group(2).lower()}" if vol_match else None
            
            # Sabor
            sabor = None
            for s in sabores_conhecidos:
                if re.search(r'\b' + re.escape(s) + r'\b', nome, re.IGNORECASE):
                    sabor = s
                    break
                    
            # Efeito
            efeito = None
            text_combo = f"{nome} {desc}".lower()
            for ef_label, kws in efeitos_conhecidos:
                for kw in kws:
                    if re.search(r'\b' + re.escape(kw) + r'\b', text_combo):
                        efeito = ef_label
                        break
                if efeito:
                    break
                    
            products_payload.append({
                'sku': sku,
                'name': nome,
                'cost_price': cost_price,
                'sale_price': sale_price,
                'description': desc,
                'images': d.get('imagens', []),
                'weight': float(d.get('peso_bruto') or 0.0),
                'height': float(d.get('altura') or 0.0),
                'width': float(d.get('largura') or 0.0),
                'length': float(d.get('comprimento') or 0.0),
                'brand_slug': brand_slug,
                'cat_ids': list(set(cats)),
                'volume': volume,
                'sabor': sabor,
                'efeito': efeito,
                'mercos_id': pid
            })

print("[3/4] Gravando dados enriquecidos no WooCommerce via container casosex-wordpress...")

php_sync_script = '''
require_once('/var/www/html/wp-load.php');
require_once(ABSPATH . 'wp-admin/includes/media.php');
require_once(ABSPATH . 'wp-admin/includes/file.php');
require_once(ABSPATH . 'wp-admin/includes/image.php');

$raw = file_get_contents('php://stdin');
$items = json_decode($raw, true);

$res = array();

foreach ($items as $item) {
    $sku = $item['sku'];
    $product_id = wc_get_product_id_by_sku($sku);
    if (!$product_id) {
        $res[] = array('sku' => $sku, 'status' => 'not_found');
        continue;
    }
    
    $p = wc_get_product($product_id);
    $p->set_name($item['name']);
    $p->set_status('publish');
    $p->set_regular_price($item['sale_price']);
    $p->set_price($item['sale_price']);
    if (!empty($item['description'])) {
        $p->set_description($item['description']);
    }
    if ($item['weight'] > 0) $p->set_weight($item['weight']);
    if ($item['height'] > 0) $p->set_height($item['height']);
    if ($item['width'] > 0) $p->set_width($item['width']);
    if ($item['length'] > 0) $p->set_length($item['length']);
    
    // Categorias
    $p->set_category_ids($item['cat_ids']);
    
    // Fornecedor & Marca
    wp_set_object_terms($product_id, 'intt-es-dropshipping', 'dropship_supplier');
    wp_set_object_terms($product_id, $item['brand_slug'], 'product_brand');
    
    // Atributos globais
    $attribs = array();
    $pos = 0;
    
    if (!empty($item['volume'])) {
        if (!term_exists($item['volume'], 'pa_volume')) {
            wp_insert_term($item['volume'], 'pa_volume');
        }
        wp_set_object_terms($product_id, $item['volume'], 'pa_volume');
        $attribs['pa_volume'] = array(
            'name' => 'pa_volume', 'value' => '', 'position' => $pos++,
            'is_visible' => 1, 'is_variation' => 0, 'is_taxonomy' => 1
        );
    }
    
    if (!empty($item['sabor'])) {
        if (!term_exists($item['sabor'], 'pa_sabor')) {
            wp_insert_term($item['sabor'], 'pa_sabor');
        }
        wp_set_object_terms($product_id, $item['sabor'], 'pa_sabor');
        $attribs['pa_sabor'] = array(
            'name' => 'pa_sabor', 'value' => '', 'position' => $pos++,
            'is_visible' => 1, 'is_variation' => 0, 'is_taxonomy' => 1
        );
    }
    
    if (!empty($item['efeito'])) {
        if (!term_exists($item['efeito'], 'pa_efeito')) {
            wp_insert_term($item['efeito'], 'pa_efeito');
        }
        wp_set_object_terms($product_id, $item['efeito'], 'pa_efeito');
        $attribs['pa_efeito'] = array(
            'name' => 'pa_efeito', 'value' => '', 'position' => $pos++,
            'is_visible' => 1, 'is_variation' => 0, 'is_taxonomy' => 1
        );
    }
    
    if (!empty($attribs)) {
        update_post_meta($product_id, '_product_attributes', $attribs);
    }
    
    // Metadados Soberanos CASOSEX
    update_post_meta($product_id, '_cost_price', $item['cost_price']);
    update_post_meta($product_id, '_casosex_cost_price', $item['cost_price']);
    update_post_meta($product_id, '_casosex_supplier_id', 'intt_es');
    update_post_meta($product_id, '_casosex_stock_type', 'dropshipping_intt_es');
    update_post_meta($product_id, '_mercos_id', $item['mercos_id']);
    
    $p->save();
    
    // Fotos
    $images = $item['images'];
    if (!empty($images) && is_array($images)) {
        $existing_thumb = get_post_thumbnail_id($product_id);
        if (empty($existing_thumb)) {
            $gallery_ids = array();
            $first = true;
            foreach ($images as $img_url) {
                $att_id = media_sideload_image($img_url, $product_id, $item['name'], 'id');
                if (!is_wp_error($att_id)) {
                    if ($first) {
                        set_post_thumbnail($product_id, $att_id);
                        $first = false;
                    } else {
                        $gallery_ids[] = $att_id;
                    }
                }
            }
            if (!empty($gallery_ids)) {
                $p->set_gallery_image_ids($gallery_ids);
                $p->save();
            }
        }
    }
    
    $res[] = array(
        'id' => $product_id,
        'sku' => $sku,
        'status' => 'updated',
        'price' => $p->get_price(),
        'cost' => $item['cost_price'],
        'thumb' => $p->get_image_id(),
        'gallery_count' => count($p->get_gallery_image_ids())
    );
}

echo json_encode($res);
'''

p = subprocess.Popen(['docker', 'exec', '-i', 'casosex-wordpress', 'php', '-r', php_sync_script], 
                     stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
stdout, stderr = p.communicate(input=json.dumps(products_payload).encode('utf-8'))

print("[4/4] Resultado da sincronização:")
print(stdout.decode('utf-8'))
if stderr:
    print("Stderr:", stderr.decode('utf-8'))
