import json
import os

api_json = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/incremental_events/chatgpt_api_full_convo.json"
out_md = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first/vm-rust-android.md"
raw_json_dest = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first/vm-rust-android.json"

with open(api_json, "r", encoding="utf-8") as f:
    data = json.load(f)

# Atualiza o vm-rust-android.json com o payload API estruturado
with open(raw_json_dest, "w", encoding="utf-8") as f_raw:
    json.dump(data, f_raw, indent=2, ensure_ascii=False)

title = data.get("title", "Criar VM Rust para APK")
create_time = data.get("create_time", "")
mapping = data.get("mapping", {})

md = []
md.append(f"# 📜 Transpilação 1:1 — Conversa ChatGPT: {title}\n")
md.append(f"> **ID da Conversa**: `6a8f985b-040c-83e9-ad00-d8073c66c58c`  ")
md.append(f"> **Arquivo JSON de Origem**: `docs/spec/mobile-app-first/vm-rust-android.json`  ")
md.append(f"> **Engine Nativa Target**: `rsxt-android` (`tag=APP-MERCADOPAGO` & `tag=app-jury`)  ")
md.append(f"> **Doutrina**: `medido=verdade` (Transpilação Fiel 1:1 sem Alucinações)\n")
md.append("---\n")

messages = []
# Percorre a árvore de mensagens em ordem cronológica via parent/children se disponível
for node_id, node in mapping.items():
    msg = node.get("message")
    if msg:
        role = msg.get("author", {}).get("role")
        content = msg.get("content", {})
        parts = content.get("parts", [])
        text_parts = [p for p in parts if isinstance(p, str)]
        create_t = msg.get("create_time", 0)
        if text_parts and role in ["user", "assistant"]:
            full_text = "\n".join(text_parts).strip()
            if full_text:
                messages.append((create_t or 0, role, full_text))

messages.sort(key=lambda x: x[0])

for idx, (t, role, text) in enumerate(messages):
    author_name = "👤 JEFERSON AMORIM (FOUNDER)" if role == "user" else "🤖 CHATGPT / ENGINE DESIGN SPEC"
    md.append(f"## [{idx+1}] {author_name}\n")
    md.append(text)
    md.append("\n\n---\n")

with open(out_md, "w", encoding="utf-8") as f_out:
    f_out.write("\n".join(md))

print(f"✅ Transpilação 1:1 de {len(messages)} mensagens concluída! Salvo em {out_md}")
