#!/usr/bin/env python3
"""
VOLÚPIA B2B — Google Sheets Field Commercial Cockpit v5.0
==========================================================

OBJETIVO
--------
Construir uma interface limpa, clara e objetiva para prospecção comercial
de fornecedores B2B no Google Sheets, com operação mobile-first.

CONTRATO OFICIAL DA GOOGLE SHEETS API v4
----------------------------------------
REST:
  GET  /v4/spreadsheets/{spreadsheetId}
  GET  /v4/spreadsheets/{spreadsheetId}/values/{range}
  PUT  /v4/spreadsheets/{spreadsheetId}/values/{range}?valueInputOption=USER_ENTERED
  POST /v4/spreadsheets/{spreadsheetId}:batchUpdate

Documentação oficial:
  https://developers.google.com/workspace/sheets/api/reference/rest
  https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets
  https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request
  https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/values/update

REGRAS IMPORTANTES
------------------
1. Nunca usar a própria matriz já transformada como se fosse a base legada.
2. Antes de escrever, detectar se a aba está no formato LEGACY ou V5.
3. Em V5, preservar status, prioridade, visita, resultado e follow-up já
   preenchidos pelo usuário.
4. Não inserir linhas de separação de polo dentro da tabela filtrável.
5. Usar setBasicFilter somente sobre uma tabela contínua.
6. Usar setDataValidation com BOOLEAN para checkbox e ONE_OF_LIST para dropdown.
7. Usar repeatCell com FieldMask válido; não usar propriedades inventadas.
8. Toda alteração visual deve estar em batchUpdate.
9. O batchUpdate é atômico: se uma request for inválida, nenhuma é aplicada.
10. Fórmulas são gravadas via values.update com USER_ENTERED.

O script não depende de google-api-python-client; usa somente urllib da biblioteca
padrão do Python.
"""

import json
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

SPREADSHEET_ID = "1P1xfMibrs8SmPhGBbWnvpvR15-OZvvYdjQgKfeYU90s"
SECRETS_FILE = Path(
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/"
    "CASOSEX/.secrets/.evn.GOOGLE-SHEETS"
)

DASH_NAME = "📊 Dashboard Executivo"
MATRIZ_NAME = "🏢 Matriz B2B RJ"

# Visual clean/light.
CRIMSON = "#881337"
CRIMSON_DARK = "#4C0519"
CRIMSON_SOFT = "#FFF1F2"
INK = "#0F172A"
MUTED = "#64748B"
WHITE = "#FFFFFF"
SURFACE = "#F8FAFC"
LINE = "#E2E8F0"

GREEN = "#15803D"
GREEN_SOFT = "#DCFCE7"
BLUE = "#1D4ED8"
BLUE_SOFT = "#DBEAFE"
PURPLE = "#7E22CE"
PURPLE_SOFT = "#F3E8FF"
YELLOW = "#A16207"
YELLOW_SOFT = "#FEF9C3"
RED = "#B91C1C"
RED_SOFT = "#FEE2E2"

# Ordem oficial da matriz V5.
HEADERS_V5 = [
    "ID", "FORNECEDOR", "☑️ VISITADO", "💬 WHATSAPP",
    "🗺️ MAPA", "STATUS", "PRIORIDADE", "POLO",
    "BAIRRO", "CIDADE", "CATEGORIA", "PERFIL B2B",
    "ENDEREÇO", "☎️ TELEFONE", "📸 INSTAGRAM", "🌐 WEBSITE",
    "★ REVIEWS", "DATA VISITA", "RESULTADO", "PRÓXIMO FOLLOW-UP",
    "PRAZO PGTO", "DESCONTO B2B", "PEDIDO MÍNIMO", "OBSERVAÇÕES",
]

LEGACY_HEADERS = {
    "ID", "Nome do Fornecedor", "Perfil B2B", "Categoria Produto",
    "Tem Zap?", "WhatsApp Direct (1-Clique)", "Telefone Oficial",
    "Endereço Completo", "Bairro", "Cidade", "GPS Rota Maps",
    "Status Visita", "Prazo Faturado", "Desconto B2B",
    "SEM 1 (01-07 Mar)", "SEM 2 (08-14 Mar)", "SEM 3 (15-21 Mar)",
    "SEM 4 (22-28 Mar)", "Anotações da Sócia",
}


def get_access_token():
    """Lê OAuth refresh token do arquivo de secrets e gera access token."""
    secrets = {}
    with open(SECRETS_FILE, "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line and "=" in line and not line.startswith("#"):
                key, value = line.split("=", 1)
                secrets[key.strip()] = value.strip()

    required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"]
    missing = [key for key in required if not secrets.get(key)]
    if missing:
        raise RuntimeError(f"Secrets ausentes: {', '.join(missing)}")

    payload = urllib.parse.urlencode({
        "client_id": secrets["GOOGLE_CLIENT_ID"],
        "client_secret": secrets["GOOGLE_CLIENT_SECRET"],
        "refresh_token": secrets["GOOGLE_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode("utf-8"))
    return data["access_token"]


def api_request(token, url, method="GET", body=None):
    """Chamada REST JSON genérica com diagnóstico detalhado de erro."""
    data = None
    headers = {"Authorization": f"Bearer {token}"}
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(
        url, headers=headers, data=data, method=method
    )
    try:
        with urllib.request.urlopen(request) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        body_text = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"Google Sheets API HTTP {exc.code} {exc.reason}\n{body_text}"
        ) from exc


def hex_to_rgb(value):
    value = value.lstrip("#")
    if len(value) != 6:
        raise ValueError(f"Cor hexadecimal inválida: {value}")
    return {
        "red": int(value[0:2], 16) / 255.0,
        "green": int(value[2:4], 16) / 255.0,
        "blue": int(value[4:6], 16) / 255.0,
    }


def quote_range(sheet_name, a1):
    return urllib.parse.quote(f"{sheet_name}!{a1}", safe="")


def read_values(token, sheet_name, a1):
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/"
        f"{quote_range(sheet_name, a1)}"
    )
    return api_request(token, url).get("values", [])


def write_values(token, sheet_name, start_cell, values):
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/"
        f"{quote_range(sheet_name, start_cell)}"
        "?valueInputOption=USER_ENTERED"
    )
    body = {
        "range": f"{sheet_name}!{start_cell}",
        "majorDimension": "ROWS",
        "values": values,
    }
    return api_request(token, url, method="PUT", body=body)


def clear_values(token, sheet_name, a1):
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/"
        f"{quote_range(sheet_name, a1)}:clear"
    )
    return api_request(token, url, method="POST", body={})


def normalize_phone(value):
    return re.sub(r"\D+", "", str(value or ""))


def whatsapp_url(value):
    digits = normalize_phone(value)
    if not digits:
        return ""
    if not digits.startswith("55"):
        digits = "55" + digits
    return f"https://wa.me/{digits}"


def maps_url(address, bairro, cidade):
    query = " ".join(
        str(item).strip()
        for item in (address, bairro, cidade)
        if str(item).strip()
    )
    if not query:
        return ""
    return (
        "https://www.google.com/maps/search/?api=1&query="
        + urllib.parse.quote(query)
    )


def hyperlink(url, label):
    """Fórmula simples reconhecida pelo Sheets com USER_ENTERED."""
    if not url:
        return ""
    safe_url = str(url).replace('"', '""')
    safe_label = str(label).replace('"', '""')
    return f'=HYPERLINK("{safe_url}","{safe_label}")'


def is_http_url(value):
    value = str(value or "").strip().lower()
    return value.startswith("http://") or value.startswith("https://")


def classify_polo(cidade):
    cidade = str(cidade or "").strip().lower()
    if "duque de caxias" in cidade or "são joão de meriti" in cidade:
        return "Polo 2"
    if "são gonçalo" in cidade or "niterói" in cidade:
        return "Polo 3"
    return "Polo 1"


def row_value(row, index):
    return row[index] if len(row) > index else ""


def detect_layout(rows):
    """
    Retorna LEGACY ou V5.
    Não tenta adivinhar um terceiro formato: falha explicitamente.
    """
    if not rows:
        return "EMPTY"

    header = {str(value).strip() for value in rows[0]}
    if "☑️ VISITADO" in header and "WHATSAPP" in header and "POLO" in header:
        return "V5"
    if "Nome do Fornecedor" in header and "Status Visita" in header:
        return "LEGACY"

    # Caso a aba tenha cabeçalho V5 após linhas de banner.
    for row in rows[:8]:
        values = {str(value).strip() for value in row}
        if "☑️ VISITADO" in values and "STATUS" in values and "POLO" in values:
            return "V5"

    raise RuntimeError(
        "Formato da aba Matriz B2B RJ não reconhecido. "
        "A IA deve parar e pedir inspeção da estrutura antes de sobrescrever dados."
    )


def find_header_row(rows, required):
    for index, row in enumerate(rows[:10]):
        values = {str(value).strip() for value in row}
        if required.issubset(values):
            return index
    return None


def extract_legacy(rows):
    """Converte a matriz legada de 19 colunas para o modelo interno."""
    header_index = find_header_row(rows, {"Nome do Fornecedor", "Status Visita"})
    if header_index is None:
        raise RuntimeError("Cabeçalho LEGACY não encontrado.")

    data = []
    for raw in rows[header_index + 1:]:
        if not any(str(x).strip() for x in raw):
            continue

        city = row_value(raw, 9)
        phone = row_value(raw, 6)
        zap_raw = row_value(raw, 5)
        zap = zap_raw if is_http_url(zap_raw) else whatsapp_url(phone) if row_value(raw, 4) else ""

        # O modelo legado não possui campos separados de Instagram/Site/Reviews.
        data.append({
            "id": row_value(raw, 0),
            "nome": row_value(raw, 1),
            "perfil": row_value(raw, 2),
            "categoria": row_value(raw, 3),
            "zap": zap,
            "telefone": phone,
            "instagram": "",
            "site": "",
            "reviews": "",
            "endereco": row_value(raw, 7),
            "bairro": row_value(raw, 8),
            "cidade": city,
            "polo": classify_polo(city),
            "status": row_value(raw, 13) or "PROSPECCAO",
            "prioridade": "MÉDIA",
            "visitado": False,
            "data_visita": "",
            "resultado": "",
            "followup": "",
            "prazo": row_value(raw, 15),
            "desconto": row_value(raw, 16),
            "pedido_minimo": "",
            "observacoes": row_value(raw, 17),
        })
    return data


def extract_v5(rows):
    """
    Lê a própria matriz V5 sem destruir o estado operacional.
    Esta é a correção crítica para reruns.
    """
    header_index = find_header_row(
        rows, {"FORNECEDOR", "STATUS", "POLO", "☑️ VISITADO"}
    )
    if header_index is None:
        raise RuntimeError("Cabeçalho V5 não encontrado.")

    header = [str(x).strip() for x in rows[header_index]]
    pos = {name: i for i, name in enumerate(header)}

    def get(raw, name):
        return row_value(raw, pos.get(name, -1)) if name in pos else ""

    data = []
    for raw in rows[header_index + 1:]:
        if not any(str(x).strip() for x in raw):
            continue
        # Linhas de seção antigas não devem existir na V5, mas ignoramos caso apareçam.
        if str(row_value(raw, 0)).strip().startswith("📌"):
            continue

        data.append({
            "id": get(raw, "ID"),
            "nome": get(raw, "FORNECEDOR"),
            "perfil": get(raw, "PERFIL B2B"),
            "categoria": get(raw, "CATEGORIA"),
            "zap": "",
            "telefone": get(raw, "☎️ TELEFONE"),
            "instagram": get(raw, "📸 INSTAGRAM"),
            "site": get(raw, "🌐 WEBSITE"),
            "reviews": get(raw, "★ REVIEWS"),
            "endereco": get(raw, "ENDEREÇO"),
            "bairro": get(raw, "BAIRRO"),
            "cidade": get(raw, "CIDADE"),
            "polo": get(raw, "POLO") or classify_polo(get(raw, "CIDADE")),
            "status": get(raw, "STATUS") or "PROSPECCAO",
            "prioridade": get(raw, "PRIORIDADE") or "MÉDIA",
            "visitado": str(get(raw, "☑️ VISITADO")).upper() in {"TRUE", "VERDADEIRO", "1"},
            "data_visita": get(raw, "DATA VISITA"),
            "resultado": get(raw, "RESULTADO"),
            "followup": get(raw, "PRÓXIMO FOLLOW-UP"),
            "prazo": get(raw, "PRAZO PGTO"),
            "desconto": get(raw, "DESCONTO B2B"),
            "pedido_minimo": get(raw, "PEDIDO MÍNIMO"),
            "observacoes": get(raw, "OBSERVAÇÕES"),
        })
    return data


def build_row(item):
    phone = item["telefone"]
    zap = item["zap"]
    if not is_http_url(zap):
        zap = whatsapp_url(zap or phone)

    phone_digits = normalize_phone(phone)
    phone_link = f"tel:+{phone_digits}" if phone_digits else ""
    map_link = maps_url(item["endereco"], item["bairro"], item["cidade"])

    def social_value(value, label):
        if not value:
            return ""
        return hyperlink(value, label) if is_http_url(value) else str(value)

    return [
        item["id"],
        item["nome"],
        bool(item["visitado"]),
        hyperlink(zap, "💬 WhatsApp") if zap else "SEM WHATSAPP",
        hyperlink(map_link, "🗺️ Mapa") if map_link else "SEM ENDEREÇO",
        item["status"],
        item["prioridade"],
        item["polo"],
        item["bairro"],
        item["cidade"],
        item["categoria"],
        item["perfil"],
        item["endereco"],
        hyperlink(phone_link, "☎️ Ligar") if phone_link else phone,
        social_value(item["instagram"], "📸 Instagram"),
        social_value(item["site"], "🌐 Site"),
        social_value(item["reviews"], "★ Reviews"),
        item["data_visita"],
        item["resultado"],
        item["followup"],
        item["prazo"],
        item["desconto"],
        item["pedido_minimo"],
        item["observacoes"],
    ]


def make_dashboard():
    """
    Dashboard com fórmulas simples e referências exclusivamente às colunas V5.
    B3 é o seletor de polo.
    """
    s = MATRIZ_NAME
    q = lambda x: "'" + s.replace("'", "''") + "'!" + x

    total = f'=IF(B3="TODOS OS POLOS",COUNTIF({q("A5:A")},"<>"),COUNTIF({q("H5:H")},B3))'
    visited = f'=IF(B3="TODOS OS POLOS",COUNTIF({q("C5:C")},TRUE),COUNTIFS({q("C5:C")},TRUE,{q("H5:H")},B3))'
    coverage = "=IFERROR(B6/B5,0)"
    whatsapp = f'=IF(B3="TODOS OS POLOS",COUNTIF({q("D5:D")},"*WhatsApp*"),COUNTIFS({q("D5:D")},"*WhatsApp*",{q("H5:H")},B3))'
    homologated = f'=IF(B3="TODOS OS POLOS",COUNTIF({q("F5:F")},"HOMOLOGADO"),COUNTIFS({q("F5:F")},"HOMOLOGADO",{q("H5:H")},B3))'
    followup = f'=IF(B3="TODOS OS POLOS",COUNTIF({q("F5:F")},"FOLLOW_UP"),COUNTIFS({q("F5:F")},"FOLLOW_UP",{q("H5:H")},B3))'

    return [
        ["VOLÚPIA", "COCKPIT COMERCIAL B2B", "", "", "", "", "", ""],
        ["Prospecção • contato • rota • visita • homologação", "", "", "", "", "", "", ""],
        ["FILTRO DE POLO", "TODOS OS POLOS", "", "", "", "", "", ""],
        [],
        ["KPIs DA OPERAÇÃO", "", "", "", "", "", "", ""],
        [total, visited, coverage, whatsapp, homologated, followup, "", ""],
        ["FORNECEDORES", "VISITADOS", "COBERTURA", "WHATSAPP", "HOMOLOGADOS", "FOLLOW-UP", "", ""],
        ["Base ativa", "Visitas realizadas", "% da base", "Contato direto", "Aprovados", "Próxima ação", "", ""],
        [],
        ["COBERTURA POR POLO", "", "", "", "", "", "", ""],
        ["POLO", "REGIÃO", "BASE", "VISITADOS", "%", "DIRETRIZ", "", ""],
        ["Polo 1", "Central / Zona Norte", f'=COUNTIF({q("H5:H")},"Polo 1")', f'=COUNTIFS({q("H5:H")},"Polo 1",{q("C5:C")},TRUE)', "=IFERROR(D11/C11,0)", "Trabalhar por bairro", "", ""],
        ["Polo 2", "Baixada Fluminense", f'=COUNTIF({q("H5:H")},"Polo 2")', f'=COUNTIFS({q("H5:H")},"Polo 2",{q("C5:C")},TRUE)', "=IFERROR(D12/C12,0)", "Agrupar rota", "", ""],
        ["Polo 3", "Leste Fluminense", f'=COUNTIF({q("H5:H")},"Polo 3")', f'=COUNTIFS({q("H5:H")},"Polo 3",{q("C5:C")},TRUE)', "=IFERROR(D13/C13,0)", "Agrupar agendamentos", "", ""],
        [],
        ["FUNIL", "", "", "", "", "", "", ""],
        ["STATUS", "ETAPA", "PRÓXIMA AÇÃO", "TOTAL", "", "", "", ""],
        ["PROSPECCAO", "Lead identificado", "WhatsApp / telefone", f'=COUNTIF({q("F5:F")},"PROSPECCAO")', "", "", "", ""],
        ["CONTATO_REALIZADO", "Qualificação", "Registrar retorno", f'=COUNTIF({q("F5:F")},"CONTATO_REALIZADO")', "", "", "", ""],
        ["AGENDADA", "Visita marcada", "Abrir mapa", f'=COUNTIF({q("F5:F")},"AGENDADA")', "", "", "", ""],
        ["VISITA_REALIZADA", "Visita concluída", "Registrar resultado", f'=COUNTIF({q("F5:F")},"VISITA_REALIZADA")', "", "", "", ""],
        ["HOMOLOGADO", "Aprovado", "Iniciar relacionamento", f'=COUNTIF({q("F5:F")},"HOMOLOGADO")', "", "", "", ""],
        ["FOLLOW_UP", "Negociação", "Retomar contato", f'=COUNTIF({q("F5:F")},"FOLLOW_UP")', "", "", "", ""],
        ["REJEITADO", "Fora do perfil", "Registrar motivo", f'=COUNTIF({q("F5:F")},"REJEITADO")', "", "", "", ""],
    ]


def repeat_cell(requests, sheet_id, r1, r2, c1, c2, fmt, fields):
    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": r1,
                "endRowIndex": r2,
                "startColumnIndex": c1,
                "endColumnIndex": c2,
            },
            "cell": {"userEnteredFormat": fmt},
            "fields": fields,
        }
    })


def set_validation(requests, sheet_id, r1, r2, c1, c2, condition, strict=False):
    requests.append({
        "setDataValidation": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": r1,
                "endRowIndex": r2,
                "startColumnIndex": c1,
                "endColumnIndex": c2,
            },
            "rule": {
                "condition": condition,
                "showCustomUi": True,
                "strict": strict,
            },
        }
    })


def add_text_rule(requests, sheet_id, r1, r2, c1, c2, value, bg, fg):
    requests.append({
        "addConditionalFormatRule": {
            "rule": {
                "ranges": [{
                    "sheetId": sheet_id,
                    "startRowIndex": r1,
                    "endRowIndex": r2,
                    "startColumnIndex": c1,
                    "endColumnIndex": c2,
                }],
                "booleanRule": {
                    "condition": {
                        "type": "TEXT_EQ",
                        "values": [{"userEnteredValue": value}],
                    },
                    "format": {
                        "backgroundColor": hex_to_rgb(bg),
                        "textFormat": {
                            "foregroundColor": hex_to_rgb(fg),
                            "bold": True,
                        },
                    },
                },
            },
            "index": 0,
        }
    })


def build():
    token = get_access_token()
    print("🔑 OAuth OK.")

    meta = api_request(
        token,
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}",
    )
    sheets = {
        s["properties"]["title"]: s["properties"]["sheetId"]
        for s in meta.get("sheets", [])
    }

    if DASH_NAME not in sheets or MATRIZ_NAME not in sheets:
        raise RuntimeError(
            f"Abas necessárias ausentes. Encontradas: {list(sheets.keys())}"
        )

    dash_id = sheets[DASH_NAME]
    matriz_id = sheets[MATRIZ_NAME]

    # IMPORTANTE: ler antes de qualquer clear.
    existing = read_values(token, MATRIZ_NAME, "A1:AZ500")
    layout = detect_layout(existing)
    print(f"🔎 Layout detectado: {layout}")

    if layout == "LEGACY":
        records = extract_legacy(existing)
    elif layout == "V5":
        records = extract_v5(existing)
    else:
        records = []

    # Ordenação operacional: polo -> cidade -> bairro -> fornecedor.
    records.sort(
        key=lambda x: (
            str(x["polo"]),
            str(x["cidade"]).lower(),
            str(x["bairro"]).lower(),
            str(x["nome"]).lower(),
        )
    )

    matrix = [
        ["MATRIZ B2B RJ", "FIELD COMMERCIAL COCKPIT v5", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Busca • contato • mapa • visita • follow-up • homologação", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [],
        HEADERS_V5,
    ] + [build_row(item) for item in records]

    dashboard = make_dashboard()

    # Somente valores. Não usar values.clear para prometer limpeza de formato.
    clear_values(token, DASH_NAME, "A1:Z200")
    clear_values(token, MATRIZ_NAME, "A1:AZ500")
    write_values(token, DASH_NAME, "A1", dashboard)
    write_values(token, MATRIZ_NAME, "A1", matrix)

    requests = []

    # Base.
    repeat_cell(
        requests, dash_id, 0, 40, 0, 8,
        {
            "backgroundColor": hex_to_rgb(WHITE),
            "textFormat": {"foregroundColor": hex_to_rgb(INK), "fontFamily": "Roboto", "fontSize": 10},
            "verticalAlignment": "MIDDLE",
        },
        "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)",
    )
    repeat_cell(
        requests, matriz_id, 0, max(5, len(matrix)), 0, 24,
        {
            "backgroundColor": hex_to_rgb(WHITE),
            "textFormat": {"foregroundColor": hex_to_rgb(INK), "fontFamily": "Roboto", "fontSize": 10},
            "verticalAlignment": "MIDDLE",
        },
        "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)",
    )

    # Dashboard header.
    repeat_cell(
        requests, dash_id, 0, 2, 0, 8,
        {
            "backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb(WHITE), "fontFamily": "Roboto", "fontSize": 16, "bold": True},
            "horizontalAlignment": "LEFT",
            "verticalAlignment": "MIDDLE",
        },
        "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
    )
    repeat_cell(
        requests, dash_id, 2, 3, 0, 2,
        {
            "backgroundColor": hex_to_rgb(CRIMSON_SOFT),
            "textFormat": {"foregroundColor": hex_to_rgb(CRIMSON), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            "horizontalAlignment": "LEFT",
        },
        "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
    )

    # Seletor de polo.
    set_validation(
        requests, dash_id, 2, 3, 1, 2,
        {
            "type": "ONE_OF_LIST",
            "values": [
                {"userEnteredValue": "TODOS OS POLOS"},
                {"userEnteredValue": "Polo 1"},
                {"userEnteredValue": "Polo 2"},
                {"userEnteredValue": "Polo 3"},
            ],
        },
        strict=True,
    )

    # KPI cards.
    for col, bg, fg in [
        (0, CRIMSON_SOFT, CRIMSON),
        (1, GREEN_SOFT, GREEN),
        (2, BLUE_SOFT, BLUE),
        (3, GREEN_SOFT, GREEN),
        (4, PURPLE_SOFT, PURPLE),
        (5, YELLOW_SOFT, YELLOW),
    ]:
        repeat_cell(
            requests, dash_id, 5, 8, col, col + 1,
            {"backgroundColor": hex_to_rgb(bg), "horizontalAlignment": "CENTER"},
            "userEnteredFormat(backgroundColor,horizontalAlignment)",
        )
        repeat_cell(
            requests, dash_id, 5, 6, col, col + 1,
            {"textFormat": {"foregroundColor": hex_to_rgb(fg), "fontFamily": "Roboto", "fontSize": 21, "bold": True}},
            "userEnteredFormat(textFormat)",
        )
        repeat_cell(
            requests, dash_id, 6, 8, col, col + 1,
            {"textFormat": {"foregroundColor": hex_to_rgb(MUTED), "fontFamily": "Roboto", "fontSize": 8}},
            "userEnteredFormat(textFormat)",
        )

    # Percentuais.
    repeat_cell(
        requests, dash_id, 5, 6, 2, 3,
        {"numberFormat": {"type": "PERCENT", "pattern": "0.0%"}},
        "userEnteredFormat(numberFormat)",
    )
    repeat_cell(
        requests, dash_id, 10, 14, 4, 5,
        {"numberFormat": {"type": "PERCENT", "pattern": "0.0%"}},
        "userEnteredFormat(numberFormat)",
    )

    # Títulos de seção.
    for row in [4, 9, 15]:
        repeat_cell(
            requests, dash_id, row, row + 1, 0, 8,
            {
                "backgroundColor": hex_to_rgb(SURFACE),
                "textFormat": {"foregroundColor": hex_to_rgb(INK), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            },
            "userEnteredFormat(backgroundColor,textFormat)",
        )

    # Cabeçalho da matriz.
    repeat_cell(
        requests, matriz_id, 0, 2, 0, 24,
        {
            "backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb(WHITE), "fontFamily": "Roboto", "fontSize": 15, "bold": True},
            "horizontalAlignment": "LEFT",
        },
        "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
    )
    repeat_cell(
        requests, matriz_id, 3, 4, 0, 24,
        {
            "backgroundColor": hex_to_rgb(INK),
            "textFormat": {"foregroundColor": hex_to_rgb(WHITE), "fontFamily": "Roboto", "fontSize": 8, "bold": True},
            "horizontalAlignment": "CENTER",
            "verticalAlignment": "MIDDLE",
            "wrapStrategy": "WRAP",
        },
        "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
    )

    data_start = 4
    data_end = max(data_start + 1, len(matrix))

    # Checkbox.
    set_validation(
        requests, matriz_id, data_start, data_end, 2, 3,
        {"type": "BOOLEAN"},
    )

    # Status / prioridade / resultado.
    set_validation(
        requests, matriz_id, data_start, data_end, 5, 6,
        {"type": "ONE_OF_LIST", "values": [
            {"userEnteredValue": x} for x in [
                "PROSPECCAO", "CONTATO_REALIZADO", "AGENDADA",
                "VISITA_REALIZADA", "HOMOLOGADO", "FOLLOW_UP", "REJEITADO"
            ]
        ]},
    )
    set_validation(
        requests, matriz_id, data_start, data_end, 6, 7,
        {"type": "ONE_OF_LIST", "values": [
            {"userEnteredValue": x} for x in ["ALTA", "MÉDIA", "BAIXA"]
        ]},
    )
    set_validation(
        requests, matriz_id, data_start, data_end, 18, 19,
        {"type": "ONE_OF_LIST", "values": [
            {"userEnteredValue": x} for x in [
                "INTERESSADO", "NEGOCIACAO", "SEM_INTERESSE",
                "SEM_CONTATO", "VISITA_REAGENDAR", "HOMOLOGADO", "REJEITADO"
            ]
        ]},
    )

    # Ações visuais.
    for col, bg in [
        (3, GREEN), (4, BLUE), (13, BLUE),
        (14, CRIMSON), (15, PURPLE), (16, YELLOW),
    ]:
        repeat_cell(
            requests, matriz_id, data_start, data_end, col, col + 1,
            {
                "backgroundColor": hex_to_rgb(bg),
                "textFormat": {"foregroundColor": hex_to_rgb(WHITE), "fontFamily": "Roboto", "fontSize": 9, "bold": True},
                "horizontalAlignment": "CENTER",
            },
            "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
        )

    # Status.
    for value, bg, fg in [
        ("PROSPECCAO", YELLOW_SOFT, YELLOW),
        ("CONTATO_REALIZADO", BLUE_SOFT, BLUE),
        ("AGENDADA", PURPLE_SOFT, PURPLE),
        ("VISITA_REALIZADA", BLUE_SOFT, BLUE),
        ("HOMOLOGADO", GREEN_SOFT, GREEN),
        ("FOLLOW_UP", YELLOW_SOFT, YELLOW),
        ("REJEITADO", RED_SOFT, RED),
    ]:
        add_text_rule(requests, matriz_id, data_start, data_end, 5, 6, value, bg, fg)

    for value, bg, fg in [
        ("ALTA", RED_SOFT, RED),
        ("MÉDIA", YELLOW_SOFT, YELLOW),
        ("BAIXA", GREEN_SOFT, GREEN),
    ]:
        add_text_rule(requests, matriz_id, data_start, data_end, 6, 7, value, bg, fg)

    # Filtro básico em tabela contínua.
    requests.append({
        "clearBasicFilter": {"sheetId": matriz_id}
    })
    requests.append({
        "setBasicFilter": {
            "filter": {
                "range": {
                    "sheetId": matriz_id,
                    "startRowIndex": 3,
                    "endRowIndex": len(matrix),
                    "startColumnIndex": 0,
                    "endColumnIndex": 24,
                }
            }
        }
    })

    # Congelamento.
    requests.append({
        "updateSheetProperties": {
            "properties": {
                "sheetId": matriz_id,
                "gridProperties": {
                    "frozenRowCount": 4,
                    "frozenColumnCount": 2,
                },
            },
            "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
        }
    })
    requests.append({
        "updateSheetProperties": {
            "properties": {
                "sheetId": dash_id,
                "gridProperties": {"frozenRowCount": 3},
            },
            "fields": "gridProperties.frozenRowCount",
        }
    })

    # Larguras.
    widths = {
        0: 55, 1: 200, 2: 85, 3: 125, 4: 105, 5: 135, 6: 90,
        7: 80, 8: 115, 9: 125, 10: 115, 11: 115, 12: 220,
        13: 105, 14: 105, 15: 95, 16: 105, 17: 105, 18: 125,
        19: 135, 20: 95, 21: 90, 22: 100, 23: 220,
    }
    for col, px in widths.items():
        requests.append({
            "updateDimensionProperties": {
                "range": {
                    "sheetId": matriz_id,
                    "dimension": "COLUMNS",
                    "startIndex": col,
                    "endIndex": col + 1,
                },
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        })

    for col, px in {
        0: 170, 1: 180, 2: 150, 3: 150, 4: 150, 5: 150
    }.items():
        requests.append({
            "updateDimensionProperties": {
                "range": {
                    "sheetId": dash_id,
                    "dimension": "COLUMNS",
                    "startIndex": col,
                    "endIndex": col + 1,
                },
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        })

    # Altura confortável.
    for sheet_id, end_row in [
        (dash_id, min(40, len(dashboard))),
        (matriz_id, min(500, len(matrix))),
    ]:
        requests.append({
            "updateDimensionProperties": {
                "range": {
                    "sheetId": sheet_id,
                    "dimension": "ROWS",
                    "startIndex": 0,
                    "endIndex": end_row,
                },
                "properties": {"pixelSize": 30},
                "fields": "pixelSize",
            }
        })

    # BatchUpdate oficial e atômico.
    batch_url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/"
        f"{SPREADSHEET_ID}:batchUpdate"
    )
    api_request(
        token, batch_url, method="POST", body={"requests": requests}
    )

    print("✅ V5 aplicada com sucesso.")
    print(f"   Layout de origem: {layout}")
    print(f"   Fornecedores preservados: {len(records)}")
    print(f"   Requests batchUpdate: {len(requests)}")
    print("   Nenhuma linha artificial de polo foi inserida na tabela filtrável.")


if __name__ == "__main__":
    build()
