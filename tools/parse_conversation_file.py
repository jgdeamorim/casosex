import re
import json
import glob
from bs4 import BeautifulSoup

def extract_from_html(file_path):
    print(f"\n--- Analisando HTML: {file_path} ---")
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()
    
    soup = BeautifulSoup(html, "html.parser")
    articles = soup.find_all("article")
    print(f"Número de tags <article> encontradas: {len(articles)}")
    
    messages = []
    for idx, art in enumerate(articles):
        role_elem = art.find(attrs={"data-message-author-role": True})
        role = role_elem["data-message-author-role"] if role_elem else ("user" if "Você disse:" in art.get_text() else "assistant")
        text = art.get_text().strip()
        if text:
            messages.append({"index": idx + 1, "role": role, "content": text[:200] + "..." if len(text) > 200 else text})
            print(f"[{idx+1}] [{role}]: {text[:100]}...")

    return messages

def extract_from_json(file_path):
    print(f"\n--- Analisando JSON: {file_path} ---")
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            data = json.load(f)
        
        # Procura por 'mapping' ou 'messages'
        mapping = data.get("mapping", {})
        if mapping:
            print(f"Encontrado 'mapping' com {len(mapping)} nós.")
            messages = []
            for node_id, node in mapping.items():
                msg = node.get("message")
                if msg:
                    author = msg.get("author", {}).get("role")
                    content_parts = msg.get("content", {}).get("parts", [])
                    text = "\n".join([p for p in content_parts if isinstance(p, str)])
                    if text.strip():
                        messages.append({"role": author, "text": text})
                        print(f"[{author}]: {text[:100]}...")
            return messages
        else:
            print("Mapping não encontrado no JSON raiz.")
    except Exception as e:
        print(f"Erro ao ler JSON: {e}")

# Executa nos arquivos
jdon_path = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first/vm-rust-android.jdon"
extract_from_html(jdon_path)

for html_file in glob.glob("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/chatgpt_ingest/*.html"):
    extract_from_html(html_file)

for json_file in glob.glob("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/chatgpt_ingest/*.json"):
    extract_from_json(json_file)
