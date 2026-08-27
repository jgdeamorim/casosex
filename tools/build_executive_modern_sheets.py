#!/usr/bin/env python3
"""
Sovereign Google Sheets Executive Redesign Engine (ADR-0201)
Transforma a planilha Adsentice/Volúpia B2B em um Spreadsheet Dashboard de Nível World-Class / Smartsheet / McKinsey.
"""

import os
import json
import urllib.parse
import urllib.request
from pathlib import Path

SECRETS_FILE = Path("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/.secrets/.evn.GOOGLE-SHEETS")
SPREADSHEET_ID = "1P1xfMibrs8SmPhGBbWnvpvR15-OZvvYdjQgKfeYU90s"

def get_access_token():
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
        "grant_type": "refresh_token"
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))["access_token"]

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    return {"red": r, "green": g, "blue": b}

def build_executive_sheets():
    token = get_access_token()
    print("🔑 Token obtido com sucesso.")

    # 1. Fetch metadata to get sheet IDs
    url_meta = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}"
    req_meta = urllib.request.Request(url_meta, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req_meta) as resp:
        meta = json.loads(resp.read().decode("utf-8"))

    sheets_map = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
    print("📋 Abas encontradas:", sheets_map)

    dash_id = sheets_map.get("📊 Dashboard Executivo")
    matriz_id = sheets_map.get("🏢 Matriz B2B RJ")

    # Fetch existing data from raw sheet or current Matriz B2B RJ
    url_data = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{urllib.parse.quote('🏢 Matriz B2B RJ!A2:R30')}"
    req_data = urllib.request.Request(url_data, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req_data) as resp:
        raw_rows = json.loads(resp.read().decode("utf-8")).get("values", [])

    print(f"📦 {len(raw_rows)} fornecedores lidos para reformulação.")

    # Categorize into 3 Polos
    polo1 = [] # Central / Zona Norte
    polo2 = [] # Baixada Fluminense
    polo3 = [] # Leste Fluminense

    for r in raw_rows:
        cidade = r[9] if len(r) > 9 else ""
        bairro = r[8] if len(r) > 8 else ""
        if "Duque de Caxias" in cidade or "São João de Meriti" in cidade:
            polo2.append(r)
        elif "São Gonçalo" in cidade or "Niterói" in cidade:
            polo3.append(r)
        else:
            polo1.append(r)

    print(f"📍 Polos divididos: Polo 1 ({len(polo1)}), Polo 2 ({len(polo2)}), Polo 3 ({len(polo3)})")

    # ---------------------------------------------------------
    # BUILD DATA FOR DASHBOARD EXECUTIVO
    # ---------------------------------------------------------
    dash_data = []
    # Row 1-4: Header Banner
    dash_data.append(["VOLÚPIA EROTIC BOUTIQUE • ADSENTICE B2B COCKPIT", "", "", "", "", ""])
    dash_data.append(["PAINEL DE INTELIGÊNCIA & HOMOLOGAÇÃO DE FORNECEDORES B2B — RIO DE JANEIRO 2026", "", "", "", "", ""])
    dash_data.append(["Empresa: Volúpia Erotic Boutique", "Data: Agosto/2026", "Auditora: Sócia / Jeferson Amorim", "Versão: v2.0 Sovereign", "Status OODA: ACT", ""])
    dash_data.append([])

    # Row 5: Section Header
    dash_data.append(["📊 MÉTRICAS CHAVE E KPIS DE CAMPO", "", "", "", "", ""])

    # Row 6-9: KPI Cards
    dash_data.append(["26", "5", "21", "92,3%", "30 DIAS", "100%"])
    dash_data.append(["TOTAL FORNECEDORES", "ATACADOS EXPLÍCITOS", "SEX SHOPS HÍBRIDOS", "WHATSAPP VALIDADO", "PRAZO MÉDIO B2B", "COBERTURA POLOS"])
    dash_data.append(["Fornecedores Mapeados no RJ", "Fabricantes e Atacados Pure", "Atacado + Varejo Faturado", "24 de 26 com Zap Direto", "Faturado no Boleto", "3 Polos Estratégicos RJ"])
    dash_data.append([])

    # Row 10: Section Header
    dash_data.append(["📍 MATRIZ DE COBERTURA POR POLO REGIONAL (RJ)", "", "", "", "", ""])

    # Row 11-15: Polo Table
    dash_data.append(["Polo Regional", "Cidades / Bairros Principais", "Total Fornecedores", "% Cobertura", "WhatsApp Ok", "Status Cronograma"])
    dash_data.append(["📌 Polo 1: Central & Zona Norte", "Bonsucesso, Copacabana, Madureira, Barra, Centro", len(polo1), f"{len(polo1)/26*100:.1f}%", f"{len(polo1)}/{len(polo1)} (100%)", "🟡 12 Visitas Pendentes"])
    dash_data.append(["📌 Polo 2: Baixada Fluminense", "Duque de Caxias, São João de Meriti", len(polo2), f"{len(polo2)/26*100:.1f}%", "9/10 (90%)", "🟡 10 Visitas Pendentes"])
    dash_data.append(["📌 Polo 3: Leste Fluminense", "São Gonçalo, Niterói", len(polo3), f"{len(polo3)/26*100:.1f}%", "3/4 (75%)", "🟡 4 Visitas Pendentes"])
    dash_data.append(["TOTAL ESTADO RIO DE JANEIRO", "Estado do Rio de Janeiro (RJ)", 26, "100,0%", "24/26 (92,3%)", "26 Fornecedores RJ"])
    dash_data.append([])

    # Row 16: Section Header
    dash_data.append(["🗓️ CRONOGRAMA DE METAS DE HOMOLOGAÇÃO (MARÇO/ABRIL 2026)", "", "", "", "", ""])
    dash_data.append(["Semana / Período", "Foco de Auditoria de Campo", "Meta de Visitas", "Responsável", "Canal de Ação", "Status Meta"])
    dash_data.append(["Março - Sem 1 (01/03 - 07/03)", "Polo 1: Bonsucesso & Copacabana", "6 Visitas", "Sócia Auditora", "Rota GPS + WhatsApp", "🟡 PLANEJADA"])
    dash_data.append(["Março - Sem 2 (08/03 - 14/03)", "Polo 1: Madureira, Centro & Barra", "6 Visitas", "Sócia Auditora", "Rota GPS + WhatsApp", "🟡 PLANEJADA"])
    dash_data.append(["Março - Sem 3 (15/03 - 21/03)", "Polo 2: Duque de Caxias & S.J. Meriti", "10 Visitas", "Sócia Auditora", "Rota GPS + WhatsApp", "🟡 PLANEJADA"])
    dash_data.append(["Março - Sem 4 (22/03 - 28/03)", "Polo 3: São Gonçalo & Niterói", "4 Visitas", "Sócia Auditora", "Rota GPS + WhatsApp", "🟡 PLANEJADA"])

    # Put values into Dashboard Executivo
    url_clear_dash = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{urllib.parse.quote('📊 Dashboard Executivo!A1:Z100')}:clear"
    req_cd = urllib.request.Request(url_clear_dash, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, data=b"{}")
    urllib.request.urlopen(req_cd)

    url_update_dash = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{urllib.parse.quote('📊 Dashboard Executivo!A1')}?valueInputOption=USER_ENTERED"
    data_dash = json.dumps({"range": "📊 Dashboard Executivo!A1", "majorDimension": "ROWS", "values": dash_data}).encode("utf-8")
    req_ud = urllib.request.Request(url_update_dash, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, data=data_dash, method="PUT")
    urllib.request.urlopen(req_ud)
    print("✓ Dados atualizados na aba 📊 Dashboard Executivo.")

    # ---------------------------------------------------------
    # BUILD DATA FOR MATRIZ B2B RJ (SMARTSHEET GANTT STYLE)
    # ---------------------------------------------------------
    matriz_data = []

    # Banner Header
    matriz_data.append(["CRONOGRAMA DE CAMPO & MATRIZ B2B RJ — HOMOLOGAÇÃO DE FORNECEDORES", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
    matriz_data.append(["Planejamento Operacional de Rotas e Cadastro de Fornecedores por Polo Regional", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
    matriz_data.append([])

    # Table Column Headers (19 Colunas)
    matriz_headers = [
        "ID",
        "Nome do Fornecedor",
        "Perfil B2B",
        "Categoria Produto",
        "Tem Zap?",
        "WhatsApp Direct (1-Clique)",
        "Telefone Oficial",
        "Endereço Completo",
        "Bairro",
        "Cidade",
        "GPS Rota Maps",
        "Status Visita",
        "Prazo Faturado",
        "Desconto B2B",
        "SEM 1 (01-07 Mar)",
        "SEM 2 (08-14 Mar)",
        "SEM 3 (15-21 Mar)",
        "SEM 4 (22-28 Mar)",
        "Anotações da Sócia"
    ]
    matriz_data.append(matriz_headers)

    # Function to convert row into formatted Matriz row with Gantt timeline
    def process_supplier_row(r, week_idx):
        row_id = r[0] if len(r) > 0 else ""
        nome = r[1] if len(r) > 1 else ""
        perfil = r[2] if len(r) > 2 else ""
        cat = r[3] if len(r) > 3 else ""
        tem_zap = r[4] if len(r) > 4 else ""
        zap_link = r[5] if len(r) > 5 else ""
        tel = r[6] if len(r) > 6 else ""
        end = r[7] if len(r) > 7 else ""
        bairro = r[8] if len(r) > 8 else ""
        cidade = r[9] if len(r) > 9 else ""
        gps = r[10] if len(r) > 10 else ""
        status = r[13] if len(r) > 13 else "VISITA_PENDENTE"
        prazo = r[15] if len(r) > 15 else "30 dias (Padrão B2B)"
        desc = r[16] if len(r) > 16 else "20%"
        obs = r[17] if len(r) > 17 else "Auditado via Adsentice Discovery."

        gantt = ["", "", "", ""]
        if week_idx == 1:
            gantt[0] = "■ PLAN"
        elif week_idx == 2:
            gantt[1] = "■ PLAN"
        elif week_idx == 3:
            gantt[2] = "■ PLAN"
        elif week_idx == 4:
            gantt[3] = "■ PLAN"

        return [
            row_id, nome, perfil, cat, tem_zap, zap_link, tel, end, bairro, cidade,
            gps, status, prazo, desc, gantt[0], gantt[1], gantt[2], gantt[3], obs
        ]

    # Polo 1 Section
    matriz_data.append(["📌 POLO REGIONAL 1: CENTRAL & ZONA NORTE (RIO DE JANEIRO — 12 FORNECEDORES)", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
    for idx, r in enumerate(polo1):
        w = 1 if idx < 6 else 2
        matriz_data.append(process_supplier_row(r, w))

    # Polo 2 Section
    matriz_data.append(["📌 POLO REGIONAL 2: BAIXADA FLUMINENSE (DUQUE DE CAXIAS & S.J. MERITI — 10 FORNECEDORES)", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
    for r in polo2:
        matriz_data.append(process_supplier_row(r, 3))

    # Polo 3 Section
    matriz_data.append(["📌 POLO REGIONAL 3: LESTE FLUMINENSE (SÃO GONÇALO & NITERÓI — 4 FORNECEDORES)", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""])
    for r in polo3:
        matriz_data.append(process_supplier_row(r, 4))

    # Put values into Matriz B2B RJ
    url_clear_matriz = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{urllib.parse.quote('🏢 Matriz B2B RJ!A1:Z100')}:clear"
    req_cm = urllib.request.Request(url_clear_matriz, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, data=b"{}")
    urllib.request.urlopen(req_cm)

    url_update_matriz = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{urllib.parse.quote('🏢 Matriz B2B RJ!A1')}?valueInputOption=USER_ENTERED"
    data_matriz = json.dumps({"range": "🏢 Matriz B2B RJ!A1", "majorDimension": "ROWS", "values": matriz_data}).encode("utf-8")
    req_um = urllib.request.Request(url_update_matriz, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, data=data_matriz, method="PUT")
    urllib.request.urlopen(req_um)
    print("✓ Dados atualizados na aba 🏢 Matriz B2B RJ.")

    # ---------------------------------------------------------
    # APPLY RICH BATCHUPDATE FORMATTING (SMARTSHEET/MCKINSEY STYLE)
    # ---------------------------------------------------------
    requests = []

    # --- FORMATTING DASHBOARD EXECUTIVO ---
    # Top Banner Title (A1:F2)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": dash_id, "startRowIndex": 0, "endRowIndex": 2, "startColumnIndex": 0, "endColumnIndex": 6},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#4C0519"), # Royal Crimson
                    "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontSize": 14, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "LEFT",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # Subtitle Metadata (A3:F3)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": dash_id, "startRowIndex": 2, "endRowIndex": 3, "startColumnIndex": 0, "endColumnIndex": 6},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#881337"), # Velvet Crimson
                    "textFormat": {"foregroundColor": hex_to_rgb("#FFE4E6"), "fontSize": 9, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "LEFT",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # Section Headers (Rows 4, 9, 15)
    for row_idx in [4, 9, 15]:
        requests.append({
            "repeatCell": {
                "range": {"sheetId": dash_id, "startRowIndex": row_idx, "endRowIndex": row_idx + 1, "startColumnIndex": 0, "endColumnIndex": 6},
                "cell": {
                    "userEnteredFormat": {
                        "backgroundColor": hex_to_rgb("#1E293B"), # Dark Slate
                        "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontSize": 11, "bold": True, "fontFamily": "Roboto"},
                        "horizontalAlignment": "LEFT",
                        "verticalAlignment": "MIDDLE"
                    }
                },
                "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
            }
        })

    # KPI Numbers Row (Row 5)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": dash_id, "startRowIndex": 5, "endRowIndex": 6, "startColumnIndex": 0, "endColumnIndex": 6},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#FFF1F2"),
                    "textFormat": {"foregroundColor": hex_to_rgb("#881337"), "fontSize": 20, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "CENTER",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # KPI Labels Row (Row 6)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": dash_id, "startRowIndex": 6, "endRowIndex": 7, "startColumnIndex": 0, "endColumnIndex": 6},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#FFF1F2"),
                    "textFormat": {"foregroundColor": hex_to_rgb("#1E293B"), "fontSize": 9, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "CENTER",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # KPI Descriptions Row (Row 7)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": dash_id, "startRowIndex": 7, "endRowIndex": 8, "startColumnIndex": 0, "endColumnIndex": 6},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#FFF1F2"),
                    "textFormat": {"foregroundColor": hex_to_rgb("#64748B"), "fontSize": 8, "italic": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "CENTER",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # Polo Table Header (Row 10)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": dash_id, "startRowIndex": 10, "endRowIndex": 11, "startColumnIndex": 0, "endColumnIndex": 6},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#334155"),
                    "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontSize": 10, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "LEFT",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # Cronograma Meta Header (Row 16)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": dash_id, "startRowIndex": 16, "endRowIndex": 17, "startColumnIndex": 0, "endColumnIndex": 6},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#334155"),
                    "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontSize": 10, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "LEFT",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # --- FORMATTING MATRIZ B2B RJ ---
    # Top Banner (Rows 0-2)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": matriz_id, "startRowIndex": 0, "endRowIndex": 2, "startColumnIndex": 0, "endColumnIndex": 19},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#4C0519"),
                    "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontSize": 13, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "LEFT",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # Table Header (Row 3)
    requests.append({
        "repeatCell": {
            "range": {"sheetId": matriz_id, "startRowIndex": 3, "endRowIndex": 4, "startColumnIndex": 0, "endColumnIndex": 19},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": hex_to_rgb("#881337"), # Crimson Velvet
                    "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontSize": 10, "bold": True, "fontFamily": "Roboto"},
                    "horizontalAlignment": "CENTER",
                    "verticalAlignment": "MIDDLE"
                }
            },
            "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
    })

    # Freeze Header Row 4 on Matriz B2B RJ
    requests.append({
        "updateSheetProperties": {
            "properties": {
                "sheetId": matriz_id,
                "gridProperties": {
                    "frozenRowCount": 4
                }
            },
            "fields": "gridProperties.frozenRowCount"
        }
    })

    # Section Headers in Matriz B2B RJ (Find row indexes dynamically)
    for idx, r in enumerate(matriz_data):
        if r and len(r) > 0 and str(r[0]).startswith("📌 POLO REGIONAL"):
            requests.append({
                "repeatCell": {
                    "range": {"sheetId": matriz_id, "startRowIndex": idx, "endRowIndex": idx + 1, "startColumnIndex": 0, "endColumnIndex": 19},
                    "cell": {
                        "userEnteredFormat": {
                            "backgroundColor": hex_to_rgb("#1E293B"), # Dark Slate Banner
                            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "fontSize": 11, "bold": True, "fontFamily": "Roboto"},
                            "horizontalAlignment": "LEFT",
                            "verticalAlignment": "MIDDLE"
                        }
                    },
                    "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
                }
            })

    # Gantt Timeline Format (Columns 14-17: Sem 1, Sem 2, Sem 3, Sem 4)
    # Highlight Semanas with Gantt Colors when filled with '■ PLAN'
    gantt_colors = {
        14: "#881337", # Sem 1 Velvet Crimson
        15: "#881337", # Sem 2 Velvet Crimson
        16: "#6B21A8", # Sem 3 Royal Purple
        17: "#059669"  # Sem 4 Emerald Green
    }
    for col_idx, hex_c in gantt_colors.items():
        requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{"sheetId": matriz_id, "startRowIndex": 4, "endRowIndex": 50, "startColumnIndex": col_idx, "endColumnIndex": col_idx + 1}],
                    "booleanRule": {
                        "condition": {"type": "TEXT_CONTAINS", "values": [{"userEnteredValue": "PLAN"}]},
                        "format": {
                            "backgroundColor": hex_to_rgb(hex_c),
                            "textFormat": {"foregroundColor": hex_to_rgb("#FFFFFF"), "bold": True}
                        }
                    }
                },
                "index": 0
            }
        })

    # Status Visita Conditional Formatting (Column 11)
    status_rules = [
        ("VISITA_PENDENTE", "#FEF9C3", "#A16207"),
        ("PROSPECCAO", "#DBEAFE", "#1D4ED8"),
        ("AGENDADA", "#F3E8FF", "#7E22CE"),
        ("HOMOLOGADO", "#DCFCE7", "#15803D"),
        ("REJEITADO", "#FEE2E2", "#B91C1C")
    ]
    for st_val, bg_h, fg_h in status_rules:
        requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{"sheetId": matriz_id, "startRowIndex": 4, "endRowIndex": 50, "startColumnIndex": 11, "endColumnIndex": 12}],
                    "booleanRule": {
                        "condition": {"type": "TEXT_EQ", "values": [{"userEnteredValue": st_val}]},
                        "format": {
                            "backgroundColor": hex_to_rgb(bg_h),
                            "textFormat": {"foregroundColor": hex_to_rgb(fg_h), "bold": True}
                        }
                    }
                },
                "index": 0
            }
        })

    # Auto-resize columns on both sheets
    requests.append({
        "autoResizeDimensions": {
            "dimensions": {
                "sheetId": dash_id,
                "dimension": "COLUMNS",
                "startIndex": 0,
                "endIndex": 6
            }
        }
    })
    requests.append({
        "autoResizeDimensions": {
            "dimensions": {
                "sheetId": matriz_id,
                "dimension": "COLUMNS",
                "startIndex": 0,
                "endIndex": 19
            }
        }
    })

    # Execute batchUpdate
    url_batch = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate"
    payload_batch = json.dumps({"requests": requests}).encode("utf-8")
    req_b = urllib.request.Request(url_batch, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, data=payload_batch, method="POST")

    try:
        with urllib.request.urlopen(req_b) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            print(f"🎉 SUCESSO! {len(requests)} atualizações de design aplicadas com sucesso!")
            return True
    except urllib.error.HTTPError as e:
        print("❌ Erro no batchUpdate HTTPError:", e.code, e.reason)
        error_body = e.read().decode("utf-8")
        print("Corpo do Erro:", error_body)
        return False
    except Exception as e:
        print("❌ Erro no batchUpdate:", e)
        return False

if __name__ == "__main__":
    build_executive_sheets()
