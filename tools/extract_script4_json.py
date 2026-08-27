#!/usr/bin/env python3
"""
Extract conversation state from Script 4 (React Router / Next SSR Hydration Data)
"""

import json
import os
from bs4 import BeautifulSoup

HTML_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/chatgpt_ingest/chatgpt_convo_full_cookie.html"
OUTPUT_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/chatgpt_ingest"

with open(HTML_PATH, "r", encoding="utf-8") as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')
scripts = soup.find_all('script')

script_4_text = scripts[3].string or scripts[3].text or ''

print(f"📦 Script 4 tamanho: {len(script_4_text)} bytes")

try:
    data = json.loads(script_4_text)
    script4_json_path = os.path.join(OUTPUT_DIR, "script_4_raw.json")
    with open(script4_json_path, "w", encoding="utf-8") as out:
        json.dump(data, out, indent=2, ensure_ascii=False)
    print(f"✅ Raw JSON do Script 4 salvo em: {script4_json_path}")
    
    # Inspecionar chaves principais
    print("🔑 Chaves de nível superior no JSON:", list(data.keys()))
    
except Exception as e:
    print(f"⚠️ Erro ao decodificar JSON do Script 4: {e}")
