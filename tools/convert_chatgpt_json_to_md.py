import json
import datetime
import os
import sys

def convert_json_to_md(json_path: str, md_path: str):
    if not os.path.exists(json_path):
        print(f"Erro: Arquivo {json_path} não foi encontrado.")
        sys.exit(1)

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    title = data.get('title', 'Conversa ChatGPT')
    conv_id = data.get('conversation_id', '6a94a30b-ce40-83e9-a581-bc986e7945f7')
    create_time = data.get('create_time')

    date_str = ''
    if create_time:
        try:
            dt = datetime.datetime.fromtimestamp(create_time, tz=datetime.timezone.utc)
            date_str = dt.strftime('%Y-%m-%d %H:%M:%S UTC')
        except Exception:
            date_str = str(create_time)

    md_lines = []
    md_lines.append(f"# {title}")
    md_lines.append("")
    md_lines.append(f"- **ID da Conversa:** `{conv_id}`")
    if date_str:
        md_lines.append(f"- **Data de Criação:** {date_str}")
    md_lines.append(f"- **Total de Mensagens no JSON:** {len(data.get('messages', []))}")
    md_lines.append("")
    md_lines.append("---")
    md_lines.append("")

    messages = data.get('messages', [])
    turn_count = 0

    for msg in messages:
        author = msg.get('author', {})
        role = author.get('role', 'unknown')
        name = author.get('name')
        
        content = msg.get('content', {})
        parts = content.get('parts', [])
        
        text_blocks = []
        for part in parts:
            if isinstance(part, str):
                if part.strip():
                    text_blocks.append(part)
            elif isinstance(part, dict):
                if 'text' in part and isinstance(part['text'], str) and part['text'].strip():
                    text_blocks.append(part['text'])
                else:
                    text_blocks.append("```json\n" + json.dumps(part, indent=2, ensure_ascii=False) + "\n```")
        
        full_text = "\n\n".join(text_blocks).strip()
        if not full_text:
            continue
        
        turn_count += 1
        
        if role == 'user':
            md_lines.append(f"## 👤 Turno {turn_count} — Usuário")
        elif role == 'assistant':
            md_lines.append(f"## 🤖 Turno {turn_count} — ChatGPT")
        elif role == 'system':
            md_lines.append(f"## ⚙️ Turno {turn_count} — Sistema")
        elif role == 'tool':
            tool_name = name or 'Ferramenta'
            md_lines.append(f"## 🛠️ Turno {turn_count} — {tool_name}")
        else:
            md_lines.append(f"## 💬 Turno {turn_count} — {role.capitalize()}")
        
        md_lines.append("")
        md_lines.append(full_text)
        md_lines.append("")
        md_lines.append("---")
        md_lines.append("")

    os.makedirs(os.path.dirname(md_path), exist_ok=True)
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md_lines))

    print(f"✅ Conversão concluída com sucesso!")
    print(f"📄 Arquivo MD gerado: {md_path}")
    print(f"📊 Tamanho do arquivo: {os.path.getsize(md_path)} bytes | Turnos processados: {turn_count}")

if __name__ == '__main__':
    json_input = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/conversation/chatgpt_conversa_6a94a30b-ce40-83e9-a581-bc986e7945f7.json'
    md_output = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/conversation/chatgpt_conversa_6a94a30b-ce40-83e9-a581-bc986e7945f7.md'
    
    if len(sys.argv) > 1:
        json_input = sys.argv[1]
    if len(sys.argv) > 2:
        md_output = sys.argv[2]

    convert_json_to_md(json_input, md_output)
