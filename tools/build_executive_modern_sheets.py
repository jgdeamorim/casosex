#!/usr/bin/env python3
"""
Volúpia B2B — Sovereign Field Commercial Cockpit v3.0
Google Sheets Ultra-Modern Executive App Redesign (ADR-0201).

Destaques da Interface Avançada:
- Botões de Ação Visual (Pill Buttons) com fundo colorido e texto branco centralizado.
- Checkboxes nativas de 1-toque no celular (BOOLEAN validation).
- Disposição Mobile-First: Botões de GPS e WhatsApp nas primeiras colunas visíveis.
- Dropdowns nativos de Status e Prioridade com formatação condicional de Badges.
- Google Sheets API v4 via urllib.
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

# Paleta de Cores Executiva Volúpia (Crimson & Slate) + Botões de Ação Acessíveis
CRIMSON_DARK = "#4C0519"
CRIMSON_PRIMARY = "#881337"
CRIMSON_SOFT = "#FFF1F2"

INK_MAIN = "#0F172A"
MUTED_TEXT = "#475569"
SURFACE_WHITE = "#FFFFFF"
SURFACE_ALT = "#F8FAFC"
LINE_BORDER = "#CBD5E1"

# Cores de Botões de Ação (Vibrant Action Pills)
BTN_ZAP_BG = "#16A34A"        # Emerald 600 (WhatsApp)
BTN_MAPS_BG = "#2563EB"       # Blue 600 (Google Maps GPS)
BTN_PHONE_BG = "#0284C7"      # Sky 600 (Telefone)
BTN_IG_BG = "#E11D48"         # Rose 600 (Instagram)
BTN_SITE_BG = "#7C3AED"       # Violet 600 (Website)
BTN_GMB_BG = "#D97706"        # Amber 600 (Reviews GMB)

# Cores de Badges / Status
GREEN_SOFT = "#DCFCE7"
GREEN_TEXT = "#15803D"
BLUE_SOFT = "#DBEAFE"
BLUE_TEXT = "#1D4ED8"
PURPLE_SOFT = "#F3E8FF"
PURPLE_TEXT = "#7E22CE"
YELLOW_SOFT = "#FEF9C3"
YELLOW_TEXT = "#A16207"
RED_SOFT = "#FEE2E2"
RED_TEXT = "#B91C1C"


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
    """Limpa conteúdo/formatação no intervalo informado."""
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
    """Retorna fórmula HIPERLINK com separador ; (padrão pt_BR)."""
    if not url:
        return ""
    return f'=HIPERLINK("{url}"; "{label}")'


def normalize_phone(value):
    """Mantém apenas dígitos para links de chamada/whatsapp."""
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


def build_field_cockpit():
    """Executa a construção da planilha avançada com botões interativos e layout mobile-first."""
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

    # Leitura dos dados originais
    data_url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/"
        f"{urllib.parse.quote(matriz_name + '!A2:R100', safe='')}"
    )
    raw = api_request(token, data_url).get("values", [])
    raw = [r for r in raw if any(str(x).strip() for x in r)]
    print(f"📦 {len(raw)} fornecedores homologados lidos.")

    # Classificação Regional dos Polos
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
        bool(str(r[5] if len(r) > 5 else "").strip() or str(r[4] if len(r) > 4 else "").strip())
        for r in raw
    )

    # -------------------------------------------------------------
    # 1. ABA DASHBOARD EXECUTIVO
    # -------------------------------------------------------------
    dash = [
        ["VOLÚPIA EROTIC BOUTIQUE", "B2B COCKPIT DE CAMPO — RIO DE JANEIRO", "", "", "", "", "", ""],
        ["Painel de Controle de Prospecção, Auditoria e Relacionamento Comercial em Campo", "", "", "", "", "", "", ""],
        [],
        ["📊 METRICAS CHAVE DO FUNIL", "", "", "", "", "", "", ""],
        ["FORNECEDORES", "COM WHATSAPP", "POLOS RJ", "PROSPECCAO", "HOMOLOGADOS", "FOLLOW-UP", "", ""],
        [total, whatsapp_count, 3, f'=CONT.SE(\'{matriz_name}\'!F:F; "PROSPECCAO")', f'=CONT.SE(\'{matriz_name}\'!F:F; "HOMOLOGADO")', f'=CONT.SE(\'{matriz_name}\'!F:F; "FOLLOW_UP")', "", ""],
        ["Base Cadastrada", "Com Contato Direto", "Regiões Mapeadas", "Aguardando Visita", "Aprovados", "Pendente Retorno", "", ""],
        [],
        ["📍 COBERTURA E DENSIDADE REGIONAL", "", "", "", "", "", "", ""],
        ["POLO", "CIDADES / REGIÃO", "FORNECEDORES", "% PARTICIPAÇÃO", "FOCO LOGÍSTICO", "DIRETRIZ DE CAMPO", "", ""],
        ["Polo 1", "Rio de Janeiro (Capital & Zona Norte)", len(polo1), f"={len(polo1)}/{max(total,1)}", "Alta Concentração", "Visitas por Bairro", "", ""],
        ["Polo 2", "Baixada Fluminense (Caxias / Meriti)", len(polo2), f"={len(polo2)}/{max(total,1)}", "Cluster Industrial", "Rota Concentrada", "", ""],
        ["Polo 3", "Leste Fluminense (Niterói / SG)", len(polo3), f"={len(polo3)}/{max(total,1)}", "Ponte / Distribuição", "Agrupar Agendamentos", "", ""],
        [],
        ["🎯 WORKFLOW DE STATUS (GLÁUCIA)", "", "", "", "", "", "", ""],
        ["STATUS", "ETAPA OPERACIONAL", "AÇÃO EXIGIDA EM CAMPO", "", "", "", "", ""],
        ["PROSPECCAO", "Identificação", "Acionar WhatsApp / Telefone e solicitar catálogo B2B", "", "", "", "", ""],
        ["CONTATO_REALIZADO", "Qualificação Inicial", "Analisar prazo de pagamento e pedido mínimo", "", "", "", "", ""],
        ["AGENDADA", "Visita Confirmada", "Abrir GPS (Botão Azul) e realizar auditoria presencial", "", "", "", "", ""],
        ["VISITA_REALIZADA", "Auditoria Efetuada", "Registrar termos, amostras e margem de lucro", "", "", "", "", ""],
        ["HOMOLOGADO", "Parceiro Aprovado", "Marcar Checkbox e liberar primeiros pedidos de compra", "", "", "", "", ""],
        ["FOLLOW_UP", "Em Negociação", "Registrar data de retorno e acompanhar representante", "", "", "", "", ""],
        ["REJEITADO", "Fora de Perfil", "Registrar justificativa nas observações", "", "", "", "", ""],
        [],
        ["📱 MANUAL DE USO RÁPIDO NO CELULAR", "", "", "", "", "", "", ""],
        ["1", "Toque no BOTÃO VERDE [ 💬 ZAP DIRECT ] para abrir a conversa instantânea no WhatsApp.", "", "", "", "", "", ""],
        ["2", "Toque no BOTÃO AZUL [ 🗺️ ABRIR GPS ] para iniciar o Waze / Google Maps até a porta do fornecedor.", "", "", "", "", "", ""],
        ["3", "Marque a CAIXA DE SELEÇÃO [ ☑️ VISITADO ] com 1 toque assim que concluir a visita.", "", "", "", "", "", ""],
        ["4", "Altere o STATUS diretamente no Dropdown interativo para atualizar os gráficos.", "", "", "", "", "", ""],
    ]

    # -------------------------------------------------------------
    # 2. ABA MATRIZ B2B RJ — MOBILE-FIRST LAYOUT COM BOTÕES
    # -------------------------------------------------------------
    # Estrutura otimizada para o celular: Colunas de Ação Rápida no topo da visualização
    headers = [
        "ID",                      # Col A (0)
        "FORNECEDOR",              # Col B (1)
        "☑️ VISITADO",             # Col C (2) - CHECKBOX NATIVA
        "💬 WHATSAPP DIRECT",      # Col D (3) - BOTÃO VERDE
        "🗺️ NAVEGAÇÃO GPS",        # Col E (4) - BOTÃO AZUL
        "STATUS",                  # Col F (5) - DROPDOWN COLORIDO
        "PRIORIDADE",              # Col G (6) - DROPDOWN COLORIDO
        "POLO",                    # Col H (7)
        "BAIRRO",                  # Col I (8)
        "CIDADE",                  # Col J (9)
        "CATEGORIA",               # Col K (10)
        "PERFIL B2B",              # Col L (11)
        "ENDEREÇO COMPLETO",       # Col M (12)
        "☎️ TELEFONE / LIGAR",     # Col N (13) - BOTÃO AZUL CELESTE
        "📸 INSTAGRAM",            # Col O (14) - BOTÃO ROSA
        "🌐 WEBSITE",              # Col P (15) - BOTÃO ROXO
        "★ REVIEWS GMB",           # Col Q (16) - BOTÃO ÂMBAR
        "DATA VISITA",             # Col R (17)
        "RESULTADO",               # Col S (18)
        "PRÓXIMO FOLLOW-UP",       # Col T (19)
        "PRAZO PGTO",              # Col U (20)
        "DESCONTO B2B",            # Col V (21)
        "PEDIDO MÍNIMO",           # Col W (22)
        "OBSERVAÇÕES & TERMOS",    # Col X (23)
    ]

    matriz = [
        ["MATRIZ B2B RJ — FIELD COMMERCIAL COCKPIT v3.0", "VOLÚPIA EROTIC BOUTIQUE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Cockpit Comercial com Botões Visuais de 1-Clique (WhatsApp, Maps GPS, Telefone e Mídias)", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
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

        return [
            rid,                                                       # A: ID
            nome,                                                      # B: FORNECEDOR
            False,                                                     # C: VISITADO? (Checkbox)
            hyperlink(zap, "💬 ABRIR WHATSAPP") if zap else "SEM ZAP", # D: BOTÃO ZAP
            hyperlink(map_link, "🗺️ ABRIR GPS") if map_link else "SEM ENDEREÇO", # E: BOTÃO MAPA
            status,                                                    # F: STATUS
            "MÉDIA",                                                   # G: PRIORIDADE
            polo,                                                      # H: POLO
            bairro,                                                    # I: BAIRRO
            cidade,                                                    # J: CIDADE
            cat,                                                       # K: CATEGORIA
            perfil,                                                    # L: PERFIL B2B
            endereco,                                                  # M: ENDEREÇO
            hyperlink(phone_link, "☎️ LIGAR AGORA") if phone_link else telefone, # N: BOTÃO TEL
            hyperlink(ig, "📸 INSTAGRAM") if ig else "-",             # O: BOTÃO IG
            hyperlink(site, "🌐 WEBSITE") if site else "-",             # P: BOTÃO SITE
            hyperlink(reviews, "★ REVIEWS GMB") if reviews else "-",    # Q: BOTÃO GMB
            "",                                                        # R: DATA VISITA
            "",                                                        # S: RESULTADO
            "",                                                        # T: FOLLOW-UP
            prazo,                                                     # U: PRAZO
            desconto,                                                  # V: DESCONTO
            "",                                                        # W: PEDIDO MIN
            obs,                                                       # X: OBS
        ]

    for polo_name, rows in [
        ("Polo 1", polo1),
        ("Polo 2", polo2),
        ("Polo 3", polo3),
    ]:
        if rows:
            matriz.append([f"📌 {polo_name.upper()} • {len(rows)} FORNECEDORES", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
            for r in rows:
                matriz.append(convert_row(r, polo_name))

    # -------------------------------------------------------------
    # 3. GRAVAÇÃO DOS DADOS NA PLANILHA
    # -------------------------------------------------------------
    clear_range(token, dash_name, "A1:Z200")
    clear_range(token, matriz_name, "A1:AZ200")
    write_values(token, dash_name, "A1", dash)
    write_values(token, matriz_name, "A1", matriz)

    # -------------------------------------------------------------
    # 4. CONFIGURAÇÃO DE DESIGN & FORMATAÇÃO DOS BOTÕES VISUAIS
    # -------------------------------------------------------------
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



    # Superfície Base do Dashboard
    repeat(dash_id, 0, 40, 0, 8,
           {"backgroundColor": hex_to_rgb(SURFACE_WHITE),
            "textFormat": {"foregroundColor": hex_to_rgb(INK_MAIN), "fontFamily": "Roboto", "fontSize": 10},
            "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)")

    # Superfície Base da Matriz
    repeat(matriz_id, 0, 120, 0, 24,
           {"backgroundColor": hex_to_rgb(SURFACE_WHITE),
            "textFormat": {"foregroundColor": hex_to_rgb(INK_MAIN), "fontFamily": "Roboto", "fontSize": 10},
            "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)")

    # Header Principal (Volúpia Crimson)
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

    repeat(matriz_id, 0, 1, 0, 24,
           {"backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 14, "bold": True},
            "horizontalAlignment": "LEFT", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")
    repeat(matriz_id, 1, 2, 0, 24,
           {"backgroundColor": hex_to_rgb(CRIMSON_DARK),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFE4E6"), "fontFamily": "Roboto", "fontSize": 9},
            "horizontalAlignment": "LEFT"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")

    # Cabeçalho da Tabela Matriz (Dark Navy Header)
    repeat(matriz_id, 3, 4, 0, 24,
           {"backgroundColor": hex_to_rgb(INK_MAIN),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 9, "bold": True},
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE", "wrapStrategy": "WRAP"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)")

    # Separadores de Polo (Crimson Light Bar)
    for idx, row in enumerate(matriz):
        if row and str(row[0]).startswith("📌 POLO"):
            repeat(matriz_id, idx, idx + 1, 0, 24,
                   {"backgroundColor": hex_to_rgb(CRIMSON_SOFT),
                    "textFormat": {"foregroundColor": hex_to_rgb(CRIMSON_PRIMARY), "fontFamily": "Roboto", "fontSize": 11, "bold": True},
                    "horizontalAlignment": "LEFT", "verticalAlignment": "MIDDLE"},
                   "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")

    # Congelar Linhas e Colunas para Mobile Navegação Eficiente
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

    # KPI Cards do Dashboard
    repeat(dash_id, 4, 7, 0, 6,
           {"backgroundColor": hex_to_rgb(CRIMSON_SOFT),
            "textFormat": {"fontFamily": "Roboto"},
            "horizontalAlignment": "CENTER"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)")
    repeat(dash_id, 5, 6, 0, 6,
           {"textFormat": {"foregroundColor": hex_to_rgb(CRIMSON_PRIMARY), "fontFamily": "Roboto", "fontSize": 20, "bold": True},
            "horizontalAlignment": "CENTER"},
           "userEnteredFormat(textFormat,horizontalAlignment)")

    # -------------------------------------------------------------
    # 5. CONSTRUÇÃO DOS BOTÕES VISUAIS (ACTION PILLS) NA MATRIZ
    # -------------------------------------------------------------
    data_start = 4
    data_end = len(matriz)

    # BOTÃO WHATSAPP DIRECT (Coluna D / Col 3) -> Fundo Verde Esmeralda, Texto Branco Bold
    repeat(matriz_id, data_start, data_end, 3, 4,
           {"backgroundColor": hex_to_rgb(BTN_ZAP_BG),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")

    # BOTÃO NAVEGAÇÃO GPS (Coluna E / Col 4) -> Fundo Azul Google Maps, Texto Branco Bold
    repeat(matriz_id, data_start, data_end, 4, 5,
           {"backgroundColor": hex_to_rgb(BTN_MAPS_BG),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")

    # BOTÃO TELEFONE (Coluna N / Col 13) -> Fundo Azul Celeste, Texto Branco Bold
    repeat(matriz_id, data_start, data_end, 13, 14,
           {"backgroundColor": hex_to_rgb(BTN_PHONE_BG),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")

    # BOTÃO INSTAGRAM (Coluna O / Col 14) -> Fundo Rosa Instagram, Texto Branco Bold
    repeat(matriz_id, data_start, data_end, 14, 15,
           {"backgroundColor": hex_to_rgb(BTN_IG_BG),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")

    # BOTÃO WEBSITE (Coluna P / Col 15) -> Fundo Roxo, Texto Branco Bold
    repeat(matriz_id, data_start, data_end, 15, 16,
           {"backgroundColor": hex_to_rgb(BTN_SITE_BG),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")

    # BOTÃO REVIEWS GMB (Coluna Q / Col 16) -> Fundo Âmbar Ouro, Texto Branco Bold
    repeat(matriz_id, data_start, data_end, 16, 17,
           {"backgroundColor": hex_to_rgb(BTN_GMB_BG),
            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontFamily": "Roboto", "fontSize": 10, "bold": True},
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)")

    # -------------------------------------------------------------
    # 6. CAIXAS DE SELEÇÃO NATIVAS (CHECKBOXES DE 1-TOQUE)
    # -------------------------------------------------------------
    # Coluna C (Col 2): ☑️ VISITADO? -> Checkbox Nativa
    requests.append({
        "setDataValidation": {
            "range": {
                "sheetId": matriz_id,
                "startRowIndex": data_start,
                "endRowIndex": data_end,
                "startColumnIndex": 2,
                "endColumnIndex": 3,
            },
            "rule": {
                "condition": {"type": "BOOLEAN"},
                "showCustomUi": True
            }
        }
    })
    repeat(matriz_id, data_start, data_end, 2, 3,
           {"horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
           "userEnteredFormat(horizontalAlignment,verticalAlignment)")

    # -------------------------------------------------------------
    # 7. DROPDOWNS E VALIDAÇÃO DE DADOS (STATUS / PRIORIDADE / RESULTADO)
    # -------------------------------------------------------------
    validations = [
        (5, ["PROSPECCAO", "CONTATO_REALIZADO", "AGENDADA", "VISITA_REALIZADA", "HOMOLOGADO", "FOLLOW_UP", "REJEITADO"]), # STATUS (Col F)
        (6, ["ALTA", "MÉDIA", "BAIXA"]),                                                                                 # PRIORIDADE (Col G)
        (18, ["INTERESSADO", "NEGOCIACAO", "SEM_INTERESSE", "SEM_CONTATO", "VISITA_REAGENDAR", "HOMOLOGADO", "REJEITADO"]), # RESULTADO (Col S)
    ]
    for col_idx, values in validations:
        requests.append({
            "setDataValidation": {
                "range": {
                    "sheetId": matriz_id,
                    "startRowIndex": data_start,
                    "endRowIndex": data_end,
                    "startColumnIndex": col_idx,
                    "endColumnIndex": col_idx + 1,
                },
                "rule": {
                    "condition": {"type": "ONE_OF_LIST", "values": [{"userEnteredValue": x} for x in values]},
                    "showCustomUi": True,
                    "strict": False,
                },
            }
        })
        repeat(matriz_id, data_start, data_end, col_idx, col_idx + 1,
               {"horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE"},
               "userEnteredFormat(horizontalAlignment,verticalAlignment)")

    # Formatação Condicional de Status (Col F / Col 5)
    status_colors = [
        ("PROSPECCAO", YELLOW_SOFT, YELLOW_TEXT),
        ("CONTATO_REALIZADO", BLUE_SOFT, BLUE_TEXT),
        ("AGENDADA", PURPLE_SOFT, PURPLE_TEXT),
        ("VISITA_REALIZADA", BLUE_SOFT, BLUE_TEXT),
        ("HOMOLOGADO", GREEN_SOFT, GREEN_TEXT),
        ("FOLLOW_UP", YELLOW_SOFT, YELLOW_TEXT),
        ("REJEITADO", RED_SOFT, RED_TEXT),
    ]
    for value, bg, fg in status_colors:
        requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{
                        "sheetId": matriz_id,
                        "startRowIndex": data_start,
                        "endRowIndex": data_end,
                        "startColumnIndex": 5,
                        "endColumnIndex": 6,
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

    # Prioridade Colors (Col G / Col 6)
    for value, bg, fg in [("ALTA", RED_SOFT, RED_TEXT), ("MÉDIA", YELLOW_SOFT, YELLOW_TEXT), ("BAIXA", GREEN_SOFT, GREEN_TEXT)]:
        requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{
                        "sheetId": matriz_id,
                        "startRowIndex": data_start,
                        "endRowIndex": data_end,
                        "startColumnIndex": 6,
                        "endColumnIndex": 7,
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

    # -------------------------------------------------------------
    # 8. LARGURA E ALTURA DAS LINHAS (TOUCH-TARGET MOBILE COMPATIBLE)
    # -------------------------------------------------------------
    widths = {
        0: 55,   # A: ID
        1: 210,  # B: FORNECEDOR
        2: 100,  # C: CHECKBOX VISITADO
        3: 165,  # D: BOTÃO WHATSAPP DIRECT
        4: 155,  # E: BOTÃO GPS NAVEGAÇÃO
        5: 150,  # F: STATUS
        6: 100,  # G: PRIORIDADE
        7: 90,   # H: POLO
        8: 120,  # I: BAIRRO
        9: 130,  # J: CIDADE
        10: 120, # K: CATEGORIA
        11: 120, # L: PERFIL
        12: 240, # M: ENDEREÇO
        13: 140, # N: BOTÃO TEL
        14: 135, # O: BOTÃO IG
        15: 135, # P: BOTÃO SITE
        16: 140, # Q: BOTÃO REVIEWS
        17: 110, # R: DATA VISITA
        18: 130, # S: RESULTADO
        19: 135, # T: FOLLOW-UP
        20: 100, # U: PRAZO
        21: 100, # V: DESCONTO
        22: 110, # W: PEDIDO MIN
        23: 250, # X: OBS
    }
    for col, px in widths.items():
        requests.append({
            "updateDimensionProperties": {
                "range": {"sheetId": matriz_id, "dimension": "COLUMNS", "startIndex": col, "endIndex": col + 1},
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        })

    # Dashboard Column Widths
    for col, px in {0: 150, 1: 220, 2: 130, 3: 130, 4: 130, 5: 130}.items():
        requests.append({
            "updateDimensionProperties": {
                "range": {"sheetId": dash_id, "dimension": "COLUMNS", "startIndex": col, "endIndex": col + 1},
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        })

    # Altura de Linha Alta (38px Touch Target) para facilitar o clique no celular
    for sheet_id, end_row in [(dash_id, min(len(dash), 40)), (matriz_id, min(len(matriz), 120))]:
        requests.append({
            "updateDimensionProperties": {
                "range": {"sheetId": sheet_id, "dimension": "ROWS", "startIndex": 3, "endIndex": end_row},
                "properties": {"pixelSize": 38},
                "fields": "pixelSize",
            }
        })

    batch_url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate"
    result = api_request(token, batch_url, method="POST", body={"requests": requests})
    print(f"🚀 COCKPIT V3.0 ATUALIZADO! {len(requests)} operações visuais de botões e checkboxes concluídas com sucesso.")
    print("📊 Dashboard:", dash_name)
    print("🏢 Matriz:", matriz_name)
    return result


if __name__ == "__main__":
    build_field_cockpit()
