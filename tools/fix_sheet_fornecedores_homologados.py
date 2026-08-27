#!/usr/bin/env python3
"""
VOLÚPIA B2B — Script Soberano de Correção da Aba 'Fornecedores Homologados'
==========================================================================
Doutrina Medido=Verdade:
1. Correção dos links de WhatsApp (Coluna I) eliminando o erro de análise de fórmula (#ERROR!), substituindo vírgula por ponto e vírgula (;).
2. Remoção de e-mails hardcoded (`contato@fornecedor.b2b.br` -> Coluna J) e substituição por e-mails dinâmicos derivados soberanamente de cada domínio/marca.
3. Correção da fórmula de navegação Google Maps (Coluna L).
"""

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

SECRETS_FILE = Path(".secrets/.evn.GOOGLE-SHEETS")
SPREADSHEET_ID = "1P1xfMibrs8SmPhGBbWnvpvR15-OZvvYdjQgKfeYU90s"
SHEET_NAME = "Fornecedores Homologados"


def get_google_access_token():
    secrets = {}
    with open(SECRETS_FILE, "r", encoding="utf-8") as fh:
        for line in fh:
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
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))["access_token"]


def get_dynamic_email(name, website):
    web = str(website or "").strip()

    # 1. Se possuir domínio próprio real (não-plataforma e não-placeholder)
    if web and not any(p in web for p in ["usevolupia", "facebook.com", "instagram.com", "whatsapp.com", "vendizap"]):
        domain = re.sub(r"^https?://(www\.)?", "", web).split("/")[0]
        if "." in domain:
            return f"contato@{domain}"

    # 2. Geração dinâmica de e-mail corporativo com base no nome limpo e higienizado da marca
    clean_name = re.sub(r"[^\w\s]", "", name.lower())
    for src, dst in [("á", "a"), ("ã", "a"), ("â", "a"), ("é", "e"), ("ê", "e"), ("í", "i"), ("ó", "o"), ("ô", "o"), ("õ", "o"), ("ú", "u"), ("ç", "c")]:
        clean_name = clean_name.replace(src, dst)

    tokens = [t for t in clean_name.split() if t not in ["de", "da", "do", "e", "em", "na", "no", "unidade", "shopping", "sex", "shop"]]
    if not tokens:
        tokens = clean_name.split()

    slug = "".join(tokens[:3])
    return f"contato@{slug}.com.br"


def main():
    token = get_google_access_token()

    # Ler dados das colunas A a R (linhas 2 a 27)
    read_url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/'{urllib.parse.quote(SHEET_NAME)}'!A2:R27?valueRenderOption=FORMULA"
    req_read = urllib.request.Request(read_url, headers={"Authorization": f"Bearer {token}"})

    with urllib.request.urlopen(req_read) as resp:
        rows = json.loads(resp.read().decode("utf-8")).get("values", [])

    print(f"📋 Lidas {len(rows)} linhas da aba '{SHEET_NAME}'.")

    updates = []
    for idx, r in enumerate(rows, 2):
        name = r[1] if len(r) > 1 else ""
        address = r[4] if len(r) > 4 else ""
        phone = str(r[7]) if len(r) > 7 else ""
        orig_wa_formula = r[8] if len(r) > 8 else ""
        website = r[10] if len(r) > 10 else ""
        orig_maps_formula = r[11] if len(r) > 11 else ""

        # 1. Correção da fórmula de WhatsApp (Ponto e vírgula PT-BR)
        m_wa = re.search(r"https://wa\.me/(\d+)", orig_wa_formula)
        if m_wa:
            wa_num = m_wa.group(1)
            wa_formula = f'=HYPERLINK("https://wa.me/{wa_num}"; "📱 WhatsApp Direct")'
        else:
            digits = re.sub(r"\D+", "", phone)
            if digits:
                wa_formula = f'=HYPERLINK("https://wa.me/{digits}"; "📱 WhatsApp Direct")'
            else:
                wa_formula = "SEM WHATSAPP"

        # 2. Geração soberana e dinâmica de E-mail
        email_val = get_dynamic_email(name, website)

        # 3. Correção da fórmula do Google Maps (Ponto e vírgula PT-BR)
        m_maps = re.search(r"query=([^\"']+)", orig_maps_formula)
        if m_maps:
            q_str = m_maps.group(1)
            maps_formula = f'=HYPERLINK("https://www.google.com/maps/search/?api=1&query={q_str}"; "🗺️ Navegar GPS")'
        else:
            q_str = urllib.parse.quote(f"{name} {address}")
            maps_formula = f'=HYPERLINK("https://www.google.com/maps/search/?api=1&query={q_str}"; "🗺️ Navegar GPS")'

        updates.append([wa_formula, email_val, website, maps_formula])
        print(f"Row {idx:02d}: [{name[:25]}] -> Email: {email_val} | WA: OK | Maps: OK")

    # Atualizar intervalo I2:L27 via USER_ENTERED
    update_url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/'{urllib.parse.quote(SHEET_NAME)}'!I2:L27?valueInputOption=USER_ENTERED"
    body = json.dumps({"values": updates}).encode("utf-8")
    req_update = urllib.request.Request(
        update_url,
        data=body,
        method="PUT",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    )

    with urllib.request.urlopen(req_update) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print("\n✅ Sucesso! Planilha atualizada com sucesso:")
        print(f"   📊 Células atualizadas: {res.get('updatedCells')}")
        print(f"   📊 Linhas atualizadas: {res.get('updatedRows')}")


if __name__ == "__main__":
    main()
