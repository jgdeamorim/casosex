#!/usr/bin/env python3
"""
casosex_skill_sensor.py — Sensor de Auto-Ativação de Skills (UserPromptSubmit, escopo projeto).

Espelho do SOP vocab auto-ingest: em vez de entregar tri-layer de arquivo, entrega a SKILL
certa no turno certo. Varre o prompt vs o manifest `casosex:skills:manifest` (Redis :6396,
fallback: .antigravity/skills/index.yaml) e injeta "ativar skill X" no contexto.

Isolamento: escopo = diretório CASOSEX (registrado só em .claude/settings.local.json).
Nunca quebra o pipeline: qualquer erro -> exit 0 sem output.
"""
import json
import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
INDEX_YAML = PROJECT_ROOT / ".antigravity" / "skills" / "index.yaml"
REDIS_HOST, REDIS_PORT = "127.0.0.1", 6396
MIN_SCORE = 3       # overlap mínimo de keywords para injetar
MAX_MATCHES = 3     # máx. de skills citadas
STOPWORDS = {
    "com", "para", "dos", "das", "que", "sistema", "sistemas", "usar", "usando",
    "sobre", "apos", "sem", "nao", "motor", "engine", "index", "construcao",
    "arquitetura", "desenvolvimento", "development", "pattern", "patterns",
}


def tokenize(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]{4,}", text.lower())
    return {w for w in words if w not in STOPWORDS}


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
        return {"skills": [e for cat in ("governance_skills", "architecture_skills",
                                         "frontend_experience_skills", "quality_assurance_skills")
                           for e in data.get(cat, [])]}
    except Exception:
        return None


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    prompt = data.get("prompt", "")
    if not prompt or len(prompt) < 12:
        sys.exit(0)

    manifest = load_manifest()
    if not manifest or not manifest.get("skills"):
        sys.exit(0)

    ptoks = tokenize(prompt)
    scored = []
    for s in manifest["skills"]:
        kws = set(s.get("keywords") or tokenize(f"{s.get('id','')} {s.get('name','')} {s.get('role','')}"))
        overlap = len(ptoks & kws)
        if overlap >= 2:
            scored.append((overlap, s))
    if not scored:
        sys.exit(0)

    scored.sort(key=lambda x: -x[0])
    top = scored[:MAX_MATCHES]
    if top[0][0] < MIN_SCORE:
        sys.exit(0)

    lines = ["⚡ CASOSEX SKILL SENSOR — skill(s) relevante(s) para esta tarefa:"]
    for score, s in scored[:MAX_MATCHES]:
        lines.append(f"   • {s.get('id')} [{s.get('category','')}] — {s.get('name','')} "
                     f"(match={score}): {s.get('role','')}")
    lines.append("Ative a skill canônica via Skill tool antes de implementar; se não se aplicar, ignore.")
    ctx = "\n".join(lines)

    out = {"hookSpecificOutput": {"hookEventName": "UserPromptSubmit", "additionalContext": ctx}}
    print(json.dumps(out))


if __name__ == "__main__":
    main()
