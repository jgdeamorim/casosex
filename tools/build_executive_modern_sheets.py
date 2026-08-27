#!/usr/bin/env python3
"""
Volúpia B2B — Field Commercial Cockpit
Google Sheets modern/light redesign engine (ADR-0201).

Objetivo:
- Interface limpa, clara e objetiva para operação comercial de campo da sócia Gláucia.
- Pesquisa e segmentação por polo/cidade/bairro.
- Ações de 1 clique: mapa, WhatsApp, telefone, Instagram, site e reviews.
- Workflow comercial e registro de follow-up.
- Dashboard executivo enxuto.
- Google Sheets API v4 via urllib, sem dependências externas.
"""

import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

SECRETS_FILE = Path("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/.secrets/.evn.GOOGLE-SHEETS")
SPREADSHEET_ID = "1P1xfMibrs8SmPhGBbWnvpvR15-OZvvYdjQgKfeYU90s"

CRIMSON = "#881337"
CRIMSON_DARK = "#4C0519"
INK = "#172033"
MUTED = "#64748B"
LINE = "#E2E8F0"
SURFACE = "#FFFFFF"
SURFACE_ALT = "#F8FAFC"
CRIMSON_SOFT = "#FFF1F2"
GREEN = "#15803D"
GREEN_SOFT = "#DCFCE7"
YELLOW = "#A16207"
YELLOW_SOFT = "#FEF9C3"
BLUE = "#1D4ED8"
BLUE_SOFT = "#DBEAFE"
PURPLE = "#7E22CE"
PURPLE_SOFT = "#F3E8FF"
RED = "#B91C1C"
RED_SOFT = "#FEE2E2"


def get_access_token():
    """Lê o arquivo de secrets e troca o refresh token por um access token."""
    secrets = {}
    with open(SECRETS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                secrets[k.strip()] = v.strip()

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
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))["access_token"]


def hex_to_rgb(value):
    """Converte #RRGGBB para o objeto RGB exigido pela Sheets API."""
    value = value.lstrip("#")
    return {
        "red": int(value[0:2], 16) / 255.0,
        "green": int(value[2:4], 16) / 255.0,
        "blue": int(value[4:6], 16) / 255.0,
    }


def api_request(token, url, method="GET", body=None):
    """Executa uma chamada JSON simples na Google Sheets API."""
    data = None
    headers = {"Authorization": f"Bearer {token}"}
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, headers=headers, data=data, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        print("❌ Erro HTTP:", e.code, e.reason)
        error_body = e.read().decode("utf-8")
        print("Corpo do Erro:", error_body)
        raise e


def clear_range(token, sheet_name, a1):
    """Limpa conteúdo/formatação de conteúdo no intervalo lógico informado."""
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/"
        f"{urllib.parse.quote(sheet_name + '!' + a1, safe='')}:clear"
    )
    return api_request(token, url, method="POST", body={})


def write_values(token, sheet_name, start_cell, values):
    """Escreve uma matriz 2D usando USER_ENTERED."""
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/"
        f"{urllib.parse.quote(sheet_name + '!' + start_cell, safe='')}"
        "?valueInputOption=USER_ENTERED"
    )
    body = {
        "range": f"{sheet_name}!{start_cell}",
        "majorDimension": "ROWS",
        "values": values,
    }
    return api_request(token, url, method="PUT", body=body)


def hyperlink(url, label):
    """Retorna fórmula HIPERLINK compatível com locale pt_BR (ponto e vírgula)."""
    if not url:
        return ""
    return f'=HIPERLINK("{url}"; "{label}")'


def normalize_phone(value):
    """Mantém apenas dígitos para links telefônicos."""
    return re.sub(r"\D+", "", str(value or ""))


def maps_url(address, bairro="", cidade=""):
    q = " ".join(x for x in [address, bairro, cidade] if x).strip()
    return "https://www.google.com/maps/search/?api=1&query=" + urllib.parse.quote(q)


def whatsapp_url(phone):
    digits = normalize_phone(phone)
    if not digits:
        return ""
    if not digits.startswith("55"):
        digits = "55" + digits
    return f"https://wa.me/{digits}"


def instagram_url(value):
    value = str(value or "").strip()
    if not value:
        return ""
    if value.startswith("http://") or value.startswith("https://"):
        return value
    value = value.lstrip("@").strip("/")
    return f"https://www.instagram.com/{value}/"


def build_field_cockpit():
    """Constrói dashboard e matriz operacional."""
    token = get_access_token()
    print("🔑 Token obtido com sucesso.")

    meta_url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}"
    meta = api_request(token, meta_url)
    sheets_map = {
        s["properties"]["title"]: s["properties"]["sheetId"]
        for s in meta.get("sheets", [])
    }
    print("📋 Abas encontradas:", sheets_map)

    dash_name = "📊 Dashboard Executivo"
    matriz_name = "🏢 Matriz B2B RJ"
    dash_id = sheets_map.get(dash_name)
    matriz_id = sheets_map.get(matriz_name)

    if dash_id is None or matriz_id is None:
        raise RuntimeError(
            f"Abas obrigatórias não encontradas. Encontradas: {list(sheets_map)}"
        )

    data_url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/"
        f"{urllib.parse.quote(matriz_name + '!A2:R100', safe='')}"
    )
    raw = api_request(token, data_url).get("values", [])
    raw = [r for r in raw if any(str(x).strip() for x in r)]
    print(f"📦 {len(raw)} registros lidos.")

    # Classificação regional baseada na estrutura existente
    polo1, polo2, polo3 = [], [], []
    for r in raw:
        cidade = str(r[9] if len(r) > 9 else "").strip()
        if "Duque de Caxias" in cidade or "São João de Meriti" in cidade:
            polo2.append(r)
        elif "São Gonçalo" in cidade or "Niterói" in cidade:
            polo3.append(r)
        else:
            polo1.append(r)

    total = len(raw)
    whatsapp_count = sum(
        bool(str(r[5] if len(r) > 5 else "").strip() or
             str(r[4] if len(r) > 4 else "").strip())
        for r in raw
    )

    # -----------------------------
    # DASHBOARD — clean / light
    # -----------------------------
    dash = [
        ["VOLÚPIA B2B", "COCKPIT COMERCIAL DE CAMPO — RIO DE JANEIRO", "", "", "", "", "", ""],
        ["Prospecção • contato • rota • visita • homologação de fornecedores", "", "", "", "", "", "", ""],
        [],
        ["📊 VISÃO GERAL DE DESEMPENHO", "", "", "", "", "", "", ""],
        ["FORNECEDORES", "COM WHATSAPP", "POLOS", "PENDENTES", "HOMOLOGADOS", "FOLLOW-UP", "", ""],
        [total, whatsapp_count, 3, f'=CONT.SE(\'{matriz_name}\'!N:N; "PROSPECCAO")', f'=CONT.SE(\'{matriz_name}\'!N:N; "HOMOLOGADO")', f'=CONT.SE(\'{matriz_name}\'!N:N; "FOLLOW_UP")', "", ""],
        ["Base ativa RJ", "Contato digital", "Cobertura regional", "Leads a visitar", "Fornecedores ok", "Ações pendentes", "", ""],
        [],
        ["📍 COBERTURA POR POLO REGIONAL", "", "", "", "", "", "", ""],
        ["POLO", "REGIÃO", "FORNECEDORES", "% BASE", "FOCO OPERACIONAL", "AÇÃO RECOMENDADA", "", ""],
        ["Polo 1", "Central & Zona Norte", len(polo1), f"={len(polo1)}/{max(total,1)}", "Alta densidade comercial", "Filtrar por Bairro", "", ""],
        ["Polo 2", "Baixada Fluminense", len(polo2), f"={len(polo2)}/{max(total,1)}", "Rota concentrada Caxias/Meriti", "Agrupar visitas", "", ""],
        ["Polo 3", "Leste Fluminense", len(polo3), f"={len(polo3)}/{max(total,1)}", "Rota Niterói/São Gonçalo", "Agrupar visitas", "", ""],
        [],
        ["🎯 STAGES DO FUNIL COMERCIAL", "", "", "", "", "", "", ""],
        ["STATUS", "SIGNIFICADO", "PRÓXIMA AÇÃO DA SÓCIA", "", "", "", "", ""],
        ["PROSPECCAO", "Lead identificado", "Fazer primeiro contato via Zap/Telefone", "", "", "", "", ""],
        ["CONTATO_REALIZADO", "Contato feito", "Qualificar catálogo e solicitar tabela B2B", "", "", "", "", ""],
        ["AGENDADA", "Visita marcada", "Executar visita presencial no polo", "", "", "", "", ""],
        ["VISITA_REALIZADA", "Visita concluída", "Registrar termos comerciais e margens", "", "", "", "", ""],
        ["HOMOLOGADO", "Fornecedor aprovado", "Cadastrar faturamento e iniciar compras", "", "", "", "", ""],
        ["FOLLOW_UP", "Aguardando retorno", "Retomar contato com o representante", "", "", "", "", ""],
        ["REJEITADO", "Fora do perfil", "Registrar motivo da recusa na matriz", "", "", "", "", ""],
        [],
        ["💡 COMO OPERAR EM CAMPO (GLÁUCIA)", "", "", "", "", "", "", ""],
        ["1", "Filtre por Polo, Cidade ou Bairro na aba Matriz B2B RJ.", "", "", "", "", "", ""],
        ["2", "Abra MAPA (Rota GPS), WHATSAPP, TELEFONE, INSTAGRAM, SITE ou REVIEWS com 1 clique.", "", "", "", "", "", ""],
        ["3", "Altere o STATUS da visita e registre o RESULTADO e FOLLOW-UP.", "", "", "", "", "", ""],
        ["4", "Acompanhe as métricas consolidadas em tempo real neste Dashboard.", "", "", "", "", "", ""],
    ]

    if total:
        dash[10][3] = f"=C11/{total}"
        dash[11][3] = f"=C12/{total}"
        dash[12][3] = f"=C13/{total}"
    else:
        dash[10][3] = dash[11][3] = dash[12][3] = 0

    # -----------------------------
    # MATRIZ — field operations
    # -----------------------------
    headers = [
        "ID", "FORNECEDOR", "PERFIL B2B", "CATEGORIA", "POLO",
        "CIDADE", "BAIRRO", "ENDEREÇO",
        "WHATSAPP", "TELEFONE", "INSTAGRAM", "WEBSITE", "REVIEWS",
        "STATUS", "PRIORIDADE", "DATA VISITA", "RESULTADO",
        "PRÓXIMO FOLLOW-UP", "PRAZO", "DESCONTO", "PED. MÍNIMO",
        "MAPA", "CONTATO", "REDES", "REPUTAÇÃO",
        "SEM 1", "SEM 2", "SEM 3", "SEM 4", "OBSERVAÇÕES",
    ]

    matriz = [
        ["MATRIZ B2B RJ — FIELD COMMERCIAL COCKPIT", "VOLÚPIA EROTIC BOUTIQUE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Pesquisa • qualificação • contato • rota • visita • homologação de fornecedores B2B", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        [],
        headers,
    ]

    def convert_row(r, polo):
        rid = r[0] if len(r) > 0 else ""
        nome = r[1] if len(r) > 1 else ""
        perfil = r[2] if len(r) > 2 else ""
        cat = r[3] if len(r) > 3 else ""
        raw_zap = r[5] if len(r) > 5 else ""
        tem_zap = r[4] if len(r) > 4 else ""
        telefone = r[6] if len(r) > 6 else ""
        endereco = r[7] if len(r) > 7 else ""
        bairro = r[8] if len(r) > 8 else ""
        cidade = r[9] if len(r) > 9 else ""
        status = r[13] if len(r) > 13 and r[13] else "PROSPECCAO"
        prazo = r[15] if len(r) > 15 else ""
        desconto = r[16] if len(r) > 16 else ""
        obs = r[17] if len(r) > 17 else ""

        zap = str(raw_zap).strip()
        if zap and not zap.startswith("http"):
            zap = whatsapp_url(zap)
        if not zap and tem_zap:
            zap = whatsapp_url(telefone)

        ig = ""
        site = ""
        reviews = ""

        candidates = [str(x).strip() for x in r[17:] if str(x).strip()]
        for value in candidates:
            low = value.lower()
            if "instagram.com" in low and not ig:
                ig = value
            elif ("http://" in low or "https://" in low) and "google" not in low and not site:
                site = value
            elif "google" in low and not reviews:
                reviews = value

        phone_digits = normalize_phone(telefone)
        phone_link = f"tel:+{phone_digits}" if phone_digits else ""
        map_link = maps_url(endereco, bairro, cidade) if (endereco or bairro or cidade) else ""

        gantt = ["", "", "", ""]
        if polo == "Polo 1":
            gantt[0] = "●"
        elif polo == "Polo 2":
            gantt[2] = "●"
        else:
            gantt[3] = "●"

        return [
            rid, nome, perfil, cat, polo, cidade, bairro, endereco,
            hyperlink(zap, "📱 WhatsApp") if zap else "",
            hyperlink(phone_link, "☎️ Ligar") if phone_link else telefone,
            hyperlink(ig, "◎ Instagram") if ig else "",
            hyperlink(site, "🌐 Site") if site else "",
            hyperlink(reviews, "★ Reviews") if reviews else "",
            status, "MÉDIA", "", "", "", prazo, desconto, "",
            hyperlink(map_link, "🗺️ Mapa") if map_link else "",
            hyperlink(zap if zap else phone_link, "💬 Contato") if (zap or phone_link) else "",
            hyperlink(ig if ig else site, "↗ Redes/Site") if (ig or site) else "",
            hyperlink(reviews, "★ Ver avaliações") if reviews else "",
            *gantt,
            obs,
        ]

    for polo_name, rows in [
        ("Polo 1", polo1),
        ("Polo 2", polo2),
        ("Polo 3", polo3),
    ]:
        if rows:
            matriz.append([f"📌 {polo_name.upper()} • {len(rows)} FORNECEDORES", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
            for r in rows:
                matriz.append(convert_row(r, polo_name))

    # -----------------------------
    # WRITE DATA
    # -----------------------------
    clear_range(token, dash_name, "A1:Z200")
    clear_range(token, matriz_name, "A1:AZ200")
    write_values(token, dash_name, "A1", dash)
    write_values(token, matriz_name, "A1", matriz)

    # -----------------------------
    # FORMAT / INTERACTION PAYLOADS
    # -----------------------------
    requests = []

    def repeat(sheet_id, r1, r2, c1, c2, fmt, fields):
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

    # Global surfaces
    repeat(dash_id, 0, 40, 0, 8,
           {"backgroundColor": hex_to_rgb(SURFACE),
            "textFormat": {"foregroundColor": hex_to_rgb(INK), "fontFamily": "Roboto", "fontSize": 10},
            "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)")
    repeat(matriz_id, 0, 120, 0, 30,
           {"backgroundColor": hex_to_rgb(SURFACE),
            "textFormat": {"foregroundColor": hex_to_rgb(INK), "fontFamily": "Roboto", "fontSize": 10},
            "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)")

    # Dashboard header
    repeat(dash_id, 0, 1, 0, 8,
           {"backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 14, "bold": True},
            "horizontalAlignment": "LEFT", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")
    repeat(dash_id, 1, 2, 0, 8,
           {"backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFE4E6"), "fontFamily": "Roboto", "fontSize": 9},
            "horizontalAlignment": "LEFT"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")

    for row in [3, 8, 14, 24]:
        repeat(dash_id, row, row + 1, 0, 8,
               {"backgroundColor": hex_to_rgb(SURFACE_ALT),
                "textFormat": {"foregroundColor": hex_to_rgb(INK), "fontFamily": "Roboto", "fontSize": 11, "bold": True},
                "horizontalAlignment": "LEFT"},
               "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")

    # KPI cards
    repeat(dash_id, 4, 7, 0, 6,
           {"backgroundColor": hex_to_rgb(CRIMSON_SOFT),
            "textFormat": {"fontFamily": "Roboto"},
            "horizontalAlignment": "CENTER"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")
    repeat(dash_id, 5, 6, 0, 6,
           {"textFormat": {"foregroundColor": hex_to_rgb(CRIMSON), "fontFamily": "Roboto", "fontSize": 20, "bold": True},
            "horizontalAlignment": "CENTER"},
           "userEnteredFormat(textFormat,horizontalAlignment)")
    repeat(dash_id, 4, 5, 0, 6,
           {"textFormat": {"foregroundColor": hex_to_rgb(MUTED), "fontFamily": "Roboto", "fontSize": 8, "bold": True},
            "horizontalAlignment": "CENTER"},
           "userEnteredFormat(textFormat,horizontalAlignment)")

    # Dashboard table headers
    for row, cols in [(9, 6), (15, 3)]:
        repeat(dash_id, row, row + 1, 0, cols,
               {"backgroundColor": hex_to_rgb(INK),
                "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 9, "bold": True},
                "horizontalAlignment": "LEFT"},
               "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")

    # Matriz header
    repeat(matriz_id, 0, 1, 0, 30,
           {"backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 14, "bold": True},
            "horizontalAlignment": "LEFT"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")
    repeat(matriz_id, 1, 2, 0, 30,
           {"backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFE4E6"), "fontFamily": "Roboto", "fontSize": 9},
            "horizontalAlignment": "LEFT"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")
    repeat(matriz_id, 3, 4, 0, 30,
           {"backgroundColor": hex_to_rgb(INK),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 8, "bold": True},
            "horizontalAlignment": "CENTER", "wrapStrategy": "WRAP"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)")

    # Polo separators
    for idx, row in enumerate(matriz):
        if row and str(row[0]).startswith("📌 POLO"):
            repeat(matriz_id, idx, idx + 1, 0, 30,
                   {"backgroundColor": hex_to_rgb(SURFACE_ALT),
                    "textFormat": {"foregroundColor": hex_to_rgb(CRIMSON), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
                    "horizontalAlignment": "LEFT"},
                   "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")

    # Freeze rows
    requests.append({
        "updateSheetProperties": {
            "properties": {"sheetId": dash_id, "gridProperties": {"frozenRowCount": 2}},
            "fields": "gridProperties.frozenRowCount",
        }
    })
    requests.append({
        "updateSheetProperties": {
            "properties": {"sheetId": matriz_id, "gridProperties": {"frozenRowCount": 4, "frozenColumnCount": 2}},
            "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount",
        }
    })

    # Data validation: status / priority / result
    validation = [
        ("status", 13, ["PROSPECCAO", "CONTATO_REALIZADO", "AGENDADA", "VISITA_REALIZADA", "HOMOLOGADO", "FOLLOW_UP", "REJEITADO"]),
        ("priority", 14, ["ALTA", "MÉDIA", "BAIXA"]),
        ("result", 16, ["INTERESSADO", "NEGOCIACAO", "SEM_INTERESSE", "SEM_CONTATO", "VISITA_REAGENDAR", "HOMOLOGADO", "REJEITADO"]),
    ]
    data_start = 4
    data_end = max(len(matriz), 5)
    for _, col, values in validation:
        requests.append({
            "setDataValidation": {
                "range": {
                    "sheetId": matriz_id,
                    "startRowIndex": data_start,
                    "endRowIndex": data_end,
                    "startColumnIndex": col,
                    "endColumnIndex": col + 1,
                },
                "rule": {
                    "condition": {"type": "ONE_OF_LIST", "values": [{"userEnteredValue": x} for x in values]},
                    "showCustomUi": True,
                    "strict": False,
                },
            }
        })

    # Conditional status colors
    status_colors = [
        ("PROSPECCAO", YELLOW_SOFT, YELLOW),
        ("CONTATO_REALIZADO", BLUE_SOFT, BLUE),
        ("AGENDADA", PURPLE_SOFT, PURPLE),
        ("VISITA_REALIZADA", BLUE_SOFT, BLUE),
        ("HOMOLOGADO", GREEN_SOFT, GREEN),
        ("FOLLOW_UP", YELLOW_SOFT, YELLOW),
        ("REJEITADO", RED_SOFT, RED),
    ]
    for value, bg, fg in status_colors:
        requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{
                        "sheetId": matriz_id,
                        "startRowIndex": data_start,
                        "endRowIndex": data_end,
                        "startColumnIndex": 13,
                        "endColumnIndex": 14,
                    }],
                    "booleanRule": {
                        "condition": {"type": "TEXT_EQ", "values": [{"userEnteredValue": value}]},
                        "format": {
                            "backgroundColor": hex_to_rgb(bg),
                            "textFormat": {"foregroundColor": hex_to_rgb(fg), "bold": True},
                        },
                    },
                },
                "index": 0,
            }
        })

    # Priority colors
    for value, bg, fg in [("ALTA", RED_SOFT, RED), ("MÉDIA", YELLOW_SOFT, YELLOW), ("BAIXA", GREEN_SOFT, GREEN)]:
        requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{
                        "sheetId": matriz_id,
                        "startRowIndex": data_start,
                        "endRowIndex": data_end,
                        "startColumnIndex": 14,
                        "endColumnIndex": 15,
                    }],
                    "booleanRule": {
                        "condition": {"type": "TEXT_EQ", "values": [{"userEnteredValue": value}]},
                        "format": {
                            "backgroundColor": hex_to_rgb(bg),
                            "textFormat": {"foregroundColor": hex_to_rgb(fg), "bold": True},
                        },
                    },
                },
                "index": 0,
            }
        })

    # Gantt light treatment
    for col in range(25, 29):
        repeat(matriz_id, data_start, data_end, col, col + 1,
               {"backgroundColor": hex_to_rgb(SURFACE_ALT),
                "textFormat": {"foregroundColor": hex_to_rgb(CRIMSON), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
                "horizontalAlignment": "CENTER"},
               "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")

    # Column widths — explicit to keep the visual clean
    widths = {
        0: 55, 1: 190, 2: 110, 3: 115, 4: 80, 5: 125, 6: 120, 7: 220,
        8: 115, 9: 100, 10: 110, 11: 100, 12: 100, 13: 140, 14: 90,
        15: 105, 16: 125, 17: 135, 18: 95, 19: 90, 20: 95,
        21: 90, 22: 100, 23: 105, 24: 110, 25: 65, 26: 65, 27: 65, 28: 65, 29: 220,
    }
    for col, px in widths.items():
        requests.append({
            "updateDimensionProperties": {
                "range": {"sheetId": matriz_id, "dimension": "COLUMNS", "startIndex": col, "endIndex": col + 1},
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        })

    for col, px in {0: 150, 1: 190, 2: 115, 3: 115, 4: 115, 5: 115}.items():
        requests.append({
            "updateDimensionProperties": {
                "range": {"sheetId": dash_id, "dimension": "COLUMNS", "startIndex": col, "endIndex": col + 1},
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        })

    # Row heights for a lighter, more breathable interface
    for sheet_id, end_row in [(dash_id, min(len(dash), 40)), (matriz_id, min(len(matriz), 120))]:
        requests.append({
            "updateDimensionProperties": {
                "range": {"sheetId": sheet_id, "dimension": "ROWS", "startIndex": 0, "endIndex": end_row},
                "properties": {"pixelSize": 28},
                "fields": "pixelSize",
            }
        })

    batch_url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate"
    result = api_request(token, batch_url, method="POST", body={"requests": requests})
    print(f"🎉 SUCESSO! {len(requests)} atualizações aplicadas com sucesso.")
    print("📊 Dashboard:", dash_name)
    print("🏢 Matriz:", matriz_name)
    return result


if __name__ == "__main__":
    build_field_cockpit()
