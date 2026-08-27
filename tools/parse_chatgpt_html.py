#!/usr/bin/env python3
"""
Parse ChatGPT conversation HTML page to extract __NEXT_DATA__ or conversation messages
"""

import json
import os
import re
from bs4 import BeautifulSoup

HTML_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/chatgpt_ingest/chatgpt_convo_full_cookie.html"
OUTPUT_JSON = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/chatgpt_ingest/extracted_chatgpt_convo.json"

def parse_html():
    if not os.path.exists(HTML_PATH):
        print("❌ HTML file not found!")
        return

    with open(HTML_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"🔍 [HTML Parser] Analisando {len(content)} bytes de HTML...")
    
    # 1. Procurar por script __NEXT_DATA__
    next_data_match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', content, re.DOTALL)
    if next_data_match:
        try:
            data = json.loads(next_data_match.group(1))
            print("✅ __NEXT_DATA__ localizado e decodificado!")
            with open(OUTPUT_JSON, "w", encoding="utf-8") as out:
                json.dump(data, out, indent=2, ensure_ascii=False)
            print(f"📂 Salvo em: {OUTPUT_JSON}")
            return
        except Exception as e:
            print(f"⚠️ Erro ao decodificar __NEXT_DATA__: {e}")

    # 2. Procurar por scripts window.__remixContext ou json embutido
    json_scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    print(f"ℹ️ Total de scripts inline encontrados: {len(json_scripts)}")
    
    # Fallback BeautifulSoup para tags de artigo/mensagem
    soup = BeautifulSoup(content, 'html.parser')
    title = soup.title.string if soup.title else "ChatGPT Conversation"
    
    articles = soup.find_all('article')
    print(f"🗣️ Total de elementos <article> encontrados no HTML SSR: {len(articles)}")
    
    extracted_messages = []
    for idx, art in enumerate(articles, 1):
        text = art.get_text(separator="\n").strip()
        extracted_messages.append({
            "index": idx,
            "text": text
        })
        
    result = {
        "title": title,
        "articles_count": len(articles),
        "messages": extracted_messages
    }
    
    with open(OUTPUT_JSON, "w", encoding="utf-8") as out:
        json.dump(result, out, indent=2, ensure_ascii=False)
        
    print(f"✅ Extração de HTML/Articles salva em: {OUTPUT_JSON}")

if __name__ == "__main__":
    parse_html()
