#!/usr/bin/env python3
"""
VOLÚPIA B2B — Gerador de XML Hierárquico Local de Fornecedores Nacional
=========================================================================

Gera um arquivo XML 100% local com a base completa de fornecedores B2B,
hierarquizado em 3 níveis: Estado (UF) -> Cidade -> Bairro -> Fornecedor.

Diretrizes Atendidas:
1. Execução 100% Local (sem dependência da API do Google Sheets).
2. Estrutura Hierárquica: <estado> -> <cidade> -> <bairro> -> <fornecedor>.
3. Granularidade Máxima: Razão Social, Nome Fantasia, CNPJ, Categoria, Subcategoria,
   Perfil, Polo, Endereço Completo, CEP, Coordenadas (Lat/Long), Telefone, WhatsApp (link wa.me),
   Email, Website, Instagram, Google Maps (GMB) e Avaliações (Rating / Reviews Count).
4. Exclusão Estrita: Nenhum campo de status de visita/homologação foi incluído.
"""

import json
import re
import xml.dom.minidom as minidom
import xml.etree.ElementTree as ET
from pathlib import Path

BACKUP_FILES = [
    Path("./docs/backup/suppliers.json"),
    Path("./apps/volupia-dist/suppliers.json")
]
OUTPUT_XML = Path("./output/fornecedores_b2b.xml")
OUTPUT_ROOT_XML = Path("./fornecedores_b2b.xml")

SP_CITIES = {
    "são paulo", "barueri", "carapicuíba", "diadema", "embu", "embu das artes",
    "ferraz de vasconcelos", "guarulhos", "osasco", "santo andré", "mauá",
    "são bernardo do campo", "são caetano do sul", "campinas", "sorocaba", "santos",
    "taboão da serra", "são pedro"
}

RJ_CITIES = {
    "rio de janeiro", "niterói", "são gonçalo", "duque de caxias", "nova iguaçu",
    "são joão de meriti", "petrópolis", "volta redonda", "campos dos goytacazes",
    "belford roxo", "itaboraí", "cabo frio", "macaé", "mesquita", "nilópolis"
}

ES_CITIES = {"vitória", "vitoria", "vila velha", "serra", "cariacica"}
MG_CITIES = {"belo horizonte", "uberlândia", "juiz de fora", "contagem"}


def clean_city_name(cidade):
    c = str(cidade or "").strip()
    c = re.sub(r"^[^\w\s]+", "", c).strip()
    if not c or c.lower() in ["telefone oficial", "ligar", "cidade", "n/a"]:
        return "Rio de Janeiro"
    if c.lower() == "rio de janeiro":
        return "Rio de Janeiro"
    if c.lower() == "são paulo":
        return "São Paulo"
    return c.title()


def normalize_phone(value):
    val_str = str(value or "").strip()
    return re.sub(r"\D+", "", val_str)


def build_whatsapp_url(value):
    digits = normalize_phone(value)
    if not digits or digits == "5521999999999":
        return ""
    if not digits.startswith("55"):
        digits = "55" + digits
    return f"https://wa.me/{digits}"


def parse_location(item):
    addr = str(item.get("address") or "").strip()
    explicit_state = str(item.get("state") or "").strip().upper()
    explicit_city = str(item.get("city") or "").strip()
    explicit_bairro = str(item.get("bairro") or "").strip().title()

    cidade = clean_city_name(explicit_city)
    bairro = explicit_bairro
    uf = "RJ"

    # Extraction via regex from address string: ..., Bairro, Cidade - UF [, CEP]
    m = re.search(r"(?:^|,\s*|-)\s*([^,-]+),\s*([^,-]+)\s*-\s*([A-Za-z\s]+)(?:,\s*\d{5}-\d{3})?$", addr)
    if m:
        extracted_bairro = m.group(1).strip().title()
        extracted_cidade = clean_city_name(m.group(2))
        extracted_uf = m.group(3).strip().upper()

        if extracted_cidade and extracted_cidade not in ["Cidade", "State Of São Paulo", "State Of Rio De Janeiro"]:
            cidade = extracted_cidade
        if extracted_bairro and extracted_bairro not in ["Bairro", "Sp", "Rj", "Outros", "Centro"]:
            if not bairro or bairro == "Centro / Outros":
                bairro = extracted_bairro
        if len(extracted_uf) == 2 and extracted_uf in ["RJ", "SP", "ES", "MG", "PR", "SC", "RS"]:
            uf = extracted_uf

    # High-precision city-based state assignment
    c_lower = cidade.lower()
    if c_lower in ES_CITIES:
        uf = "ES"
    elif c_lower in MG_CITIES:
        uf = "MG"
    elif c_lower in SP_CITIES:
        uf = "SP"
    elif c_lower in RJ_CITIES:
        uf = "RJ"
    elif " - sp" in addr.lower() or ", sp" in addr.lower() or "são paulo" in addr.lower() and "rio" not in addr.lower():
        uf = "SP"
    elif " - rj" in addr.lower() or ", rj" in addr.lower() or "rio de janeiro" in addr.lower():
        uf = "RJ"
    elif explicit_state in ["RJ", "SP", "MG", "ES", "PR", "SC", "RS"]:
        uf = explicit_state

    if not cidade or cidade in ["Cidade", "N/A", "Telefone Oficial", ""]:
        cidade = "Rio de Janeiro" if uf == "RJ" else "São Paulo"
    if not bairro or bairro in ["Bairro", "Sp", "Rj", "N/A", ""]:
        bairro = "Centro / Outros"

    return uf, cidade, bairro


def load_suppliers():
    suppliers = []
    seen_ids = set()
    seen_names = set()

    for p in BACKUP_FILES:
        if p.exists():
            with open(p, "r", encoding="utf-8") as fh:
                raw_data = json.load(fh)
                for item in raw_data:
                    name = str(item.get("name") or "").strip()
                    item_id = str(item.get("id") or "").strip()
                    name_key = name.lower()

                    if name and name.upper() not in ["FORNECEDOR", "NOME", "ID"] and not name.startswith("📌"):
                        if item_id and item_id in seen_ids:
                            continue
                        if name_key in seen_names:
                            continue
                        
                        if item_id:
                            seen_ids.add(item_id)
                        seen_names.add(name_key)
                        suppliers.append(item)

    print(f"📦 Carregados {len(suppliers)} fornecedores das bases locais de dados.")
    return suppliers


def create_subelement(parent, tag, text=None):
    elem = ET.SubElement(parent, tag)
    if text is not None and str(text).strip() and str(text).strip() != "-":
        elem.text = str(text).strip()
    return elem


def build_xml(suppliers):
    hierarchy = {}

    for s in suppliers:
        uf, cidade, bairro = parse_location(s)

        if uf not in hierarchy:
            hierarchy[uf] = {}
        if cidade not in hierarchy[uf]:
            hierarchy[uf][cidade] = {}
        if bairro not in hierarchy[uf][cidade]:
            hierarchy[uf][cidade][bairro] = []

        hierarchy[uf][cidade][bairro].append((s, uf, cidade, bairro))

    root = ET.Element("fornecedores_b2b")
    root.set("total_registros", str(len(suppliers)))
    root.set("versao", "5.0")
    root.set("gerado_em", "2026-08-27")

    for uf in sorted(hierarchy.keys()):
        total_uf = sum(len(b_list) for c in hierarchy[uf].values() for b_list in c.values())
        estado_elem = ET.SubElement(root, "estado", uf=uf, total_fornecedores=str(total_uf))

        for cidade in sorted(hierarchy[uf].keys()):
            total_cidade = sum(len(b_list) for b_list in hierarchy[uf][cidade].values())
            cidade_elem = ET.SubElement(estado_elem, "cidade", nome=cidade, total_fornecedores=str(total_cidade))

            for bairro in sorted(hierarchy[uf][cidade].keys()):
                items = hierarchy[uf][cidade][bairro]
                bairro_elem = ET.SubElement(cidade_elem, "bairro", nome=bairro, total_fornecedores=str(len(items)))

                for item, uf_val, cidade_val, bairro_val in items:
                    f_id = str(item.get("id") or "")
                    if not f_id or f_id == "ID":
                        f_id = f"sup_b2b_{abs(hash(item.get('name'))):06d}"

                    f_elem = ET.SubElement(bairro_elem, "fornecedor", id=f_id)

                    # Informações Principais
                    create_subelement(f_elem, "razao_social", item.get("name"))
                    create_subelement(f_elem, "nome_fantasia", item.get("trade_name") or item.get("name"))
                    create_subelement(f_elem, "cnpj", item.get("cnpj") or "Em Homologação Presencial")
                    create_subelement(f_elem, "categoria", item.get("category") or "Geral B2B")
                    if item.get("subcategory"):
                        create_subelement(f_elem, "subcategoria", item.get("subcategory"))
                    if item.get("perfil"):
                        create_subelement(f_elem, "perfil_b2b", item.get("perfil"))
                    if item.get("polo"):
                        create_subelement(f_elem, "polo", item.get("polo"))

                    # Localização
                    loc_elem = ET.SubElement(f_elem, "localizacao")
                    if item.get("address"):
                        create_subelement(loc_elem, "endereco_completo", item.get("address"))
                    create_subelement(loc_elem, "bairro", bairro_val)
                    create_subelement(loc_elem, "cidade", cidade_val)
                    create_subelement(loc_elem, "estado", uf_val)
                    if item.get("zip_code"):
                        create_subelement(loc_elem, "cep", item.get("zip_code"))
                    if item.get("latitude") and item.get("longitude"):
                        geo_elem = ET.SubElement(loc_elem, "coordenadas")
                        create_subelement(geo_elem, "latitude", str(item.get("latitude")))
                        create_subelement(geo_elem, "longitude", str(item.get("longitude")))

                    # Contatos Direct (1-Clique)
                    cont_elem = ET.SubElement(f_elem, "contato")
                    if item.get("phone") and item.get("phone") != "N/D":
                        create_subelement(cont_elem, "telefone", item.get("phone"))

                    zap = item.get("whatsapp") or build_whatsapp_url(item.get("phone"))
                    if zap:
                        create_subelement(cont_elem, "whatsapp", zap)
                    if item.get("email"):
                        create_subelement(cont_elem, "email", item.get("email"))

                    # Links e Mídias
                    links_elem = ET.SubElement(f_elem, "links")
                    if item.get("website"):
                        create_subelement(links_elem, "website", item.get("website"))
                    if item.get("instagram"):
                        create_subelement(links_elem, "instagram", item.get("instagram"))
                    if item.get("gmb_url"):
                        create_subelement(links_elem, "gmb_google_maps", item.get("gmb_url"))

                    # Reputação & Avaliações
                    if item.get("rating") or item.get("reviews_count"):
                        rev_elem = ET.SubElement(f_elem, "avaliacoes_gmb")
                        if item.get("rating"):
                            create_subelement(rev_elem, "nota_rating", str(item.get("rating")))
                        if item.get("reviews_count"):
                            create_subelement(rev_elem, "total_reviews", str(item.get("reviews_count")))

                    # Condições Comerciais B2B
                    if any([item.get("payment_terms"), item.get("discount_b2b"), item.get("min_order"), item.get("notes")]):
                        com_elem = ET.SubElement(f_elem, "condicoes_comerciais")
                        if item.get("payment_terms"):
                            create_subelement(com_elem, "prazo_pagamento", item.get("payment_terms"))
                        if item.get("discount_b2b"):
                            create_subelement(com_elem, "desconto_b2b", item.get("discount_b2b"))
                        if item.get("min_order"):
                            create_subelement(com_elem, "pedido_minimo", item.get("min_order"))
                        if item.get("notes"):
                            create_subelement(com_elem, "observacoes", item.get("notes"))

    return root


def main():
    suppliers = load_suppliers()
    root_elem = build_xml(suppliers)

    xml_str = ET.tostring(root_elem, encoding="utf-8")
    parsed = minidom.parseString(xml_str)
    pretty_xml = parsed.toprettyxml(indent="  ", encoding="utf-8")

    OUTPUT_XML.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_XML, "wb") as fh:
        fh.write(pretty_xml)

    with open(OUTPUT_ROOT_XML, "wb") as fh:
        fh.write(pretty_xml)

    print(f"✅ XML gerado com sucesso!")
    print(f"   📁 Arquivo 1: {OUTPUT_XML.resolve()}")
    print(f"   📁 Arquivo 2: {OUTPUT_ROOT_XML.resolve()}")
    print(f"   📊 Total de Fornecedores Exportados: {len(suppliers)}")
    print(f"   🚫 NENHUM status de visita foi incluído no XML (conforme instrução).")


if __name__ == "__main__":
    main()
