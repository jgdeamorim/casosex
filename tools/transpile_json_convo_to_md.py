import re
import json
from bs4 import BeautifulSoup

file_path = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first/vm-rust-android.json"
output_md = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first/vm-rust-android-conversa-full.md"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    raw_content = f.read()

soup = BeautifulSoup(raw_content, "html.parser")

md_lines = []
md_lines.append("# Transpilação 1:1 — Conversa ChatGPT: VM Rust Android & RSXT-Android Engine\n")
md_lines.append("> **Origem**: `docs/spec/mobile-app-first/vm-rust-android.json`  ")
md_lines.append("> **Data da Transpilação**: 2026-08-27  ")
md_lines.append("> **Doutrina**: `medido=verdade` (Transpilação Fiel 1:1 do Payload Extrado)\n")
md_lines.append("---")

# 1. Procura por tags <article>
articles = soup.find_all("article")
print(f"Total de articles encontrados: {len(articles)}")

if articles:
    for idx, art in enumerate(articles):
        role_elem = art.find(attrs={"data-message-author-role": True})
        role = role_elem["data-message-author-role"] if role_elem else ("user" if "Você disse:" in art.get_text() else "assistant")
        text = art.get_text().strip()
        
        md_lines.append(f"\n## [{idx+1}] Papel: `{role.upper()}`\n")
        md_lines.append(text)
        md_lines.append("\n---\n")
else:
    # 2. Se não houver articles, procura por scripts de stream ou dados inline
    print("Tags article não encontradas no SSR estático. Buscando scripts e blocos de texto...")
    scripts = soup.find_all("script")
    extracted_chunks = []
    
    for s in scripts:
        stext = s.get_text()
        if "__reactRouterContext" in stext or "enqueue" in stext:
            matches = re.findall(r'enqueue\("([^"]+)"\)', stext)
            for m in matches:
                # Decodifica escapes de string
                cleaned = m.encode("utf-8").decode("unicode_escape", errors="ignore")
                extracted_chunks.append(cleaned)
    
    if extracted_chunks:
        md_lines.append("\n## Stream Context Chunks Extraídos\n")
        for idx, chunk in enumerate(extracted_chunks):
            md_lines.append(f"### Chunk {idx+1}\n```json\n{chunk}\n```\n")
    else:
        # Se for texto HTML genérico, extrai os parágrafos e divs relevantes
        body_text = soup.get_text(separator="\n").strip()
        md_lines.append("\n## Conteúdo Transpilado do HTML/DOM\n")
        md_lines.append(body_text)

with open(output_md, "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

print(f"Transpilação 1:1 concluída com sucesso! Arquivo salvo em {output_md}")
