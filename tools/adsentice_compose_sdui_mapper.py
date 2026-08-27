#!/usr/bin/env python3
"""
Adsentice Compose SDUI Mapper
--------------------------------
Mapeia a árvore de acessibilidade do dispositivo físico (ADB UIAutomator Live Dump)
e combina com o catálogo de componentes Andes UI (Mercado Pago APK descompilado)
para gerar a Representação Intermediária (IR JSON) soberana de UI 1:1.
"""

import os
import json
import re
import xml.etree.ElementTree as ET
from blake3 import blake3

DENSITY_FACTOR = 2.0 # 320dpi (mdpi=1.0, xhdpi=2.0)

def parse_bounds(bounds_str):
    """Converte a string '[x1,y1][x2,y2]' em coordenadas e tamanhos (px e dp)."""
    m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', bounds_str)
    if not m:
        return {'x': 0, 'y': 0, 'w': 0, 'h': 0, 'w_dp': 0, 'h_dp': 0}
    x1, y1, x2, y2 = map(int, m.groups())
    w_px = x2 - x1
    h_px = y2 - y1
    return {
        'x': x1,
        'y': y1,
        'x2': x2,
        'y2': y2,
        'w_px': w_px,
        'h_px': h_px,
        'w_dp': round(w_px / DENSITY_FACTOR, 1),
        'h_dp': round(h_px / DENSITY_FACTOR, 1),
        'x_dp': round(x1 / DENSITY_FACTOR, 1),
        'y_dp': round(y1 / DENSITY_FACTOR, 1)
    }

def infer_andes_component(res_id, cls_name, content_desc, text):
    """Mapeia os nós de acessibilidade do Compose para o componente semântico correspondente no Andes UI."""
    r = res_id.lower()
    c = cls_name.lower()
    d = content_desc.lower()
    t = text.lower()

    if 'header' in r or 'topbar' in r or 'toolbar' in r or 'user_profile' in r:
        return 'RsxtHeaderNavBar'
    elif 'banking_balance_row' in r or 'balance' in r or ('saldo' in d or 'saldo' in t or 'rendendo' in d or 'rendendo' in t):
        return 'RsxtBankingBalanceRow'
    elif 'quick_action' in r or 'shortcut' in r or any(kw in d or kw in t for kw in ['pix', 'transferir', 'cobrar', 'pagar', 'recarregar', 'empréstimo', 'cartão']):
        return 'RsxtAndesQuickActionsBar'
    elif 'banner' in r or 'promo' in r or 'carousel' in r or 'campaign' in r:
        return 'RsxtPromoBanner'
    elif 'tab' in r or 'bottom_navigation' in r or 'tabbar' in c or 'navigation' in r or 'bottom_bar' in r:
        return 'RsxtAndesTabBar'
    elif 'card' in r or 'container' in r or 'card' in c or 'credit' in r or 'cartao' in d or 'cartão' in d:
        return 'RsxtAndesCard'
    elif 'button' in c or 'button' in r or 'btn' in r:
        return 'RsxtAndesButton'
    elif 'image' in c or 'icon' in r or 'imageview' in c:
        return 'RsxtAndesIcon'
    elif 'textview' in c or 'text' in c or text != '':
        return 'RsxtAndesText'
    return 'RsxtViewContainer'

def process_element_tree(element):
    """Recursivamente extrai e traduz um nó do UIAutomator dump."""
    attrib = element.attrib
    res_id = attrib.get('resource-id', '')
    cls_name = attrib.get('class', '')
    content_desc = attrib.get('content-desc', '')
    text = attrib.get('text', '')
    bounds_raw = attrib.get('bounds', '[0,0][0,0]')

    geom = parse_bounds(bounds_raw)
    component_type = infer_andes_component(res_id, cls_name, content_desc, text)

    node_data = {
        'component_type': component_type,
        'resource_id': res_id,
        'class': cls_name,
        'content_desc': content_desc,
        'text': text,
        'clickable': attrib.get('clickable', 'false') == 'true',
        'geometry': geom,
        'children': []
    }

    for child in element:
        if child.tag == 'node':
            node_data['children'].append(process_element_tree(child))

    return node_data

def generate_sdui_ir(dump_file_path):
    """Lê o XML do dump e gera o documento IR JSON soberano."""
    if not os.path.exists(dump_file_path):
        raise FileNotFoundError(f"Dump file not found: {dump_file_path}")

    tree = ET.parse(dump_file_path)
    root = tree.getroot()

    root_nodes = []
    for child in root:
        if child.tag == 'node':
            root_nodes.append(process_element_tree(child))

    ir_document = {
        'version': '1.0.0-sdui-hibrido',
        'device': 'Xiaomi Redmi 13C (23100RN82L)',
        'density_factor': DENSITY_FACTOR,
        'target_app': 'com.mercadopago.wallet',
        'blake3_checksum': blake3(open(dump_file_path, 'rb').read()).hexdigest(),
        'root': root_nodes
    }

    return ir_document

if __name__ == '__main__':
    import sys
    dump_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/bone_dump.xml'

    # Se o dump live for nulo, do lockscreen ou não contiver MercadoPago, faz fallback automático
    is_valid_mp_dump = False
    if os.path.exists(dump_path):
        try:
            content = open(dump_path, 'r', encoding='utf-8', errors='ignore').read()
            if 'com.mercadopago.wallet' in content or 'banking' in content or 'saldo' in content.lower():
                is_valid_mp_dump = True
        except Exception:
            pass

    if not is_valid_mp_dump:
        fallback_path = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/docs/inspirations/window_dump.xml'
        if os.path.exists(fallback_path):
            print(f"⚠️ Dump live ({dump_path}) pertence ao lockscreen/systemui. Utilizando dump canônico do MercadoPago: {fallback_path}")
            dump_path = fallback_path

    print(f"⚡ Mapeando árvore Jetpack Compose SDUI a partir de: {dump_path}")
    ir = generate_sdui_ir(dump_path)

    out_path = '/tmp/rsxt_sdui_ir.json'
    with open(out_path, 'w') as f:
        json.dump(ir, f, indent=2, ensure_ascii=False)

    print(f"✅ IR JSON Soberano gerado em: {out_path}")
    print(f"📊 Checksum BLAKE3: {ir['blake3_checksum']}")

