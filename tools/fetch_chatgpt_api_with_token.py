import json
import requests
import re
import os

jdon_path = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first/vm-rust-android.json"

with open(jdon_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extrai o client-bootstrap JSON
match = re.search(r'<script type="application/json" id="client-bootstrap"[^>]*>(.*?)</script>', content, re.DOTALL)
if not match:
    print("❌ client-bootstrap não encontrado!")
    exit(1)

bootstrap_data = json.loads(match.group(1).strip())
session = bootstrap_data.get("session", {})
access_token = session.get("accessToken")
account_id = session.get("account", {}).get("id")

print(f"🔑 Bearer Token obtido: {access_token[:30]}...")
print(f"🆔 Account ID: {account_id}")

conversation_id = "6a8f985b-040c-83e9-ad00-d8073c66c58c"
api_url = f"https://chatgpt.com/backend-api/conversation/{conversation_id}"

headers = {
    "Authorization": f"Bearer {access_token}",
    "ChatGPT-Account-ID": account_id,
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": f"https://chatgpt.com/g/g-p-6a54f413e1c88191af9fc709cf4788ab/c/{conversation_id}"
}

print(f"📡 Efetuando requisição GET para {api_url}...")
resp = requests.get(api_url, headers=headers)

print(f"📊 HTTP Status: {resp.status_code}")
if resp.status_code == 200:
    data = resp.json()
    out_file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/incremental_events/chatgpt_api_full_convo.json"
    with open(out_file, "w", encoding="utf-8") as f_out:
        json.dump(data, f_out, indent=2, ensure_ascii=False)
    print(f"✅ Conversa COMPLETA obtida e salva em: {out_file} ({len(resp.text)} bytes)!")
else:
    print(f"❌ Erro API: {resp.text}")
