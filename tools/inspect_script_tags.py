#!/usr/bin/env python3
"""
Inspect script tags in ChatGPT HTML to find conversation JSON or endpoints
"""

import json
import re
from bs4 import BeautifulSoup

HTML_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/chatgpt_ingest/chatgpt_convo_full_cookie.html"

with open(HTML_PATH, "r", encoding="utf-8") as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')
scripts = soup.find_all('script')

print(f"Total <script> tags: {len(scripts)}")
for idx, s in enumerate(scripts, 1):
    src = s.get('src', '')
    text = s.string or s.text or ''
    print(f"\n--- Script {idx} (src: {src}, len: {len(text)}) ---")
    if text:
        # Mostra os primeiros 300 caracteres
        print(text[:300] + ("..." if len(text) > 300 else ""))
        if "conversation" in text.lower() or "message" in text.lower() or "mapping" in text.lower():
            print("  ⭐ [POTENTIAL CONVERSATION DATA DETECTED]")
