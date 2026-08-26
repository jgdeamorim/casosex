#!/usr/bin/env python3
# ==============================================================================
# Enriquecedor de Vocabulário SOP & AST — Tag: astro-emdash
# Extrai assinaturas AST de @emdash-cms/template-blog e registra no Redis :6396
# ==============================================================================

import json
import os
import re
import sys
import time
from pathlib import Path
import redis

EMDASH_ROOT = Path("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/self-inspirations/emdash")
BLOG_DIR = EMDASH_ROOT / "templates" / "blog"
REDIS_PORT = 6396

def extract_vocab_kinds(root_dir: Path) -> dict:
    vocab = {
        "tag": "astro-emdash",
        "kinds": ["astro-ts", "astro-astro", "astro-json", "astro-config"],
        "components": [],
        "imports": set(),
        "exported_functions": [],
        "astro_components": []
    }

    if not root_dir.exists():
        return vocab

    for path in root_dir.rglob("*"):
        if path.is_file() and not any(part in path.parts for part in ["node_modules", ".git", "dist", ".astro"]):
            rel = str(path.relative_to(EMDASH_ROOT))
            ext = path.suffix.lower()

            if ext == ".astro":
                vocab["astro_components"].append(path.stem)
            elif ext in [".ts", ".tsx"]:
                try:
                    content = path.read_text(encoding="utf-8", errors="ignore")
                    imports = re.findall(r'from\s+["\']([^"\']+)["\']', content)
                    vocab["imports"].update(imports)

                    exports = re.findall(r'export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)', content)
                    for exp in exports:
                        vocab["exported_functions"].append({"file": rel, "function": exp})
                except Exception:
                    pass

    vocab["imports"] = sorted(list(vocab["imports"]))
    return vocab

def main():
    print("🚀 Iniciando Enriquecedor de Vocabulário SOP para @emdash-cms/template-blog...")
    vocab = extract_vocab_kinds(BLOG_DIR)

    print(f"  ✨ Componentes Astro encontrados: {len(vocab['astro_components'])}")
    print(f"  ✨ Assinaturas de funções exportadas: {len(vocab['exported_functions'])}")
    print(f"  ✨ Importações de pacotes identificadas: {len(vocab['imports'])}")

    try:
        r = redis.Redis(host="127.0.0.1", port=REDIS_PORT, db=0, decode_responses=True)
        key = "adsentice:sop:vocab:astro-emdash"
        r.set(key, json.dumps(vocab))
        r.set("adsentice:ooda:stage:orient", f"VOCAB_ENRICHED: astro-emdash ({len(vocab['astro_components'])} componentes Astro / {len(vocab['exported_functions'])} funções)")
        print(f"✅ Vocabulário SOP persistido com sucesso no Redis (:6396) na chave '{key}'")
    except Exception as e:
        print(f"❌ Erro ao conectar ao Redis: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
