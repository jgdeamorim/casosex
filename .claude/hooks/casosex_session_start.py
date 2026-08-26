#!/usr/bin/env python3
"""
casosex_session_start.py — Banner de Skills Ativas do CASOSEX (SessionStart, escopo projeto).

Lê o manifest `casosex:skills:manifest` (Redis :6396, fallback: index.yaml) e imprime
um banner compacto com o catálogo ativo. Não quebra nada: falha -> exit 0 sem output.
"""
import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
INDEX_YAML = PROJECT_ROOT / ".antigravity" / "skills" / "index.yaml"
REDIS_HOST, REDIS_PORT = "127.0.0.1", 6396


def load_manifest() -> dict | None:
    try:
        import redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=0.5,
                        decode_responses=True)
        raw = r.get("casosex:skills:manifest")
        if raw:
            return json.loads(raw)
    except Exception:
        pass
    try:
        import yaml
        data = yaml.safe_load(INDEX_YAML.read_text(encoding="utf-8"))
        return {"version": data.get("version", "?"),
                "skills": [e for cat in ("governance_skills", "architecture_skills",
                                         "frontend_experience_skills", "quality_assurance_skills")
                           for e in data.get(cat, [])]}
    except Exception:
        return None


def main():
    m = load_manifest()
    if not m or not m.get("skills"):
        sys.exit(0)
    skills = m["skills"]
    cats: dict[str, int] = {}
    for s in skills:
        c = s.get("category", "?")
        cats[c] = cats.get(c, 0) + 1
    cat_str = " · ".join(f"{c.replace('_skills','').replace('_','-')}({n})" for c, n in sorted(cats.items()))
    total = len(skills)
    claude_sync = sum(1 for s in skills if s.get("claude_synced"))
    print(f"=== CASOSEX SKILL SENSOR · v{m.get('version','?')} · {total} skills ativas "
          f"({claude_sync}/{total} claude-sync) — {cat_str} ===")


if __name__ == "__main__":
    main()
