#!/usr/bin/env python3
"""
casosex_skills_sensor.py — Sensor Soberano de Skills do CASOSEX (espelho do SOP vocab auto-ingest).

Padrão (medido=verdade):
  SOP: shai-sop-vocab-variants -> auto-ingest DCT -> tri-layer mmap -> entrega offset
  Aqui: .antigravity/skills/index.yaml -> sensor indexa -> Redis casosex:skills:* + Qdrant
        casosex-conversation (kind=skill-registry, tag=casosex) -> entrega skill certa no turno.

Isolamento (não quebra outros projetos):
  - Redis: apenas chaves casosex:* (:6396)
  - Qdrant: apenas coleção casosex-conversation (tag=casosex)
  - Filesystem: apenas .antigravity/skills/index.yaml + ~/.claude/skills (leitura)

Uso: python3 tools/casosex_skills_sensor.py [--ingest-qdrant]
"""
import argparse
import hashlib
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

try:
    from hashlib import blake3
except ImportError:
    blake3 = None

try:
    import yaml
except ImportError:
    yaml = None

PROJECT_ROOT = Path(__file__).parent.parent
INDEX_YAML = PROJECT_ROOT / ".antigravity" / "skills" / "index.yaml"
CLAUDE_SKILLS = Path.home() / ".claude" / "skills"
QDRANT_URL = "http://127.0.0.1:6352"
EMBED_URL = "http://127.0.0.1:8081"
COLLECTION = "casosex-conversation"
REDIS_HOST, REDIS_PORT = "127.0.0.1", 6396
STOPWORDS = {
    "com", "para", "para", "uma", "uma", "dos", "das", "que", "sistema", "sistemas",
    "usar", "usando", "sobre", "apos", "sem", "nao", "motor", "engine", "index",
    "construcao", "arquitetura", "desenvolvimento", "development", "pattern", "patterns",
}


def blake3_hex(text: str) -> str:
    if blake3:
        return blake3(text.encode("utf-8")).hexdigest()
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def point_id(content: str) -> str:
    h = blake3_hex(content)[:32]
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def read_frontmatter_description(skill_path: Path) -> str:
    try:
        head = skill_path.read_text(encoding="utf-8", errors="replace")[:600]
    except OSError:
        return ""
    m = re.search(r"(?m)^description:\s*(.+)$", head)
    return m.group(1).strip().strip('"\'') if m else ""


def tokenize(*texts: str) -> list[str]:
    words = re.findall(r"[a-z0-9]{4,}", " ".join(texts).lower())
    seen = set()
    out = []
    for w in words:
        if w not in STOPWORDS and w not in seen:
            seen.add(w)
            out.append(w)
    return out


def load_registry() -> dict:
    if yaml is None:
        sys.exit("❌ PyYAML ausente — instale com: pip install pyyaml")
    data = yaml.safe_load(INDEX_YAML.read_text(encoding="utf-8"))
    skills = []
    for cat_key in ("governance_skills", "architecture_skills",
                    "frontend_experience_skills", "quality_assurance_skills"):
        category = cat_key.replace("_skills", "").replace("_", "-")
        for entry in data.get(cat_key, []):
            sid = entry["id"]
            spath = Path(entry.get("path", ""))
            claude_synced = (CLAUDE_SKILLS / sid).is_dir()
            desc = read_frontmatter_description(spath) if spath.is_file() else ""
            skill = {
                "id": sid,
                "name": entry.get("name", sid),
                "category": category,
                "role": entry.get("role", ""),
                "path": str(spath),
                "status": entry.get("status", "active"),
                "claude_synced": claude_synced,
                "description": desc,
                "keywords": tokenize(sid, entry.get("name", ""), entry.get("role", ""), desc),
            }
            skills.append(skill)
    return {
        "project": data.get("project", "CASOSEX"),
        "version": data.get("version", "?"),
        "system": data.get("system", ""),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(skills),
        "skills": skills,
        "grounding_servers": data.get("grounding_servers", []),
    }


def redis_set_many(pairs: dict) -> bool:
    try:
        import redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=1,
                        decode_responses=True)
        r.ping()
        with r.pipeline() as pipe:
            for k, v in pairs.items():
                pipe.set(k, v)
            pipe.execute()
        return True
    except Exception as e:
        print(f"  ⚠️ Redis: {e}")
        return False


def qdrant_upsert(manifest: dict) -> int:
    items = []
    header = {
        "kind": "skill-registry",
        "content": (
            f"Skill Registry {manifest['project']} v{manifest['version']} — "
            f"{manifest['count']} skills ativas em 4 categorias. "
            f"Catálogo para o sensor de auto-ativação. Fontes: {INDEX_YAML}"
        ),
        "chunk_index": 0,
        "tag": "casosex",
        "project": "casosex",
    }
    chunks = [header]
    for s in manifest["skills"]:
        chunks.append({
            "kind": "skill-registry",
            "content": (f"[{s['category']}] {s['id']} — {s['name']}. "
                        f"Role: {s['role']} | claude_synced={s['claude_synced']} | {s['description']}"),
            "chunk_index": 0,
            "source": str(INDEX_YAML),
            "skill_id": s["id"],
            "category": s["category"],
            "claude_synced": s["claude_synced"],
            "tag": "casosex",
            "project": "casosex",
        })
    for ci, c in enumerate(chunks):
        pid = point_id(c["content"])
        chunks[ci]["id"] = pid
        chunks[ci]["chunk"] = c["content"]
    candidate_ids = [c["id"] for c in chunks]

    try:
        req = Request(f"{QDRANT_URL}/collections/{COLLECTION}/points",
                      data=json.dumps({"ids": candidate_ids}).encode(),
                      headers={"Content-Type": "application/json"}, method="POST")
        existing = {p["id"] for p in json.loads(urlopen(req, timeout=10).read()).get("result", [])}
    except Exception as e:
        print(f"  ⚠️ Qdrant check: {e}")
        return 0

    missing = [c for c in chunks if c["id"] not in existing]
    if not missing:
        return len(chunks)  # todos em cache

    texts = [c["chunk"] for c in missing]
    try:
        req = Request(f"{EMBED_URL}/embed", data=json.dumps({"texts": texts}).encode(),
                      headers={"Content-Type": "application/json"})
        vectors = json.loads(urlopen(req, timeout=120).read()).get("vectors", [])
    except Exception as e:
        print(f"  ⚠️ Embed: {e}")
        return 0

    if len(vectors) != len(missing):
        print(f"  ⚠️ Mismatch vetores ({len(vectors)} vs {len(missing)})")
        return 0

    points = []
    for c, vec in zip(missing, vectors):
        payload = {k: v for k, v in c.items() if k not in ("id", "chunk")}
        payload["ingested_at"] = datetime.now(timezone.utc).isoformat()
        payload["blake3"] = blake3_hex(c["chunk"])
        points.append({"id": c["id"], "vector": vec, "payload": payload})
    try:
        req = Request(f"{QDRANT_URL}/collections/{COLLECTION}/points",
                      data=json.dumps({"points": points}).encode(),
                      headers={"Content-Type": "application/json"}, method="PUT")
        urlopen(req, timeout=30)
        return len(points)
    except Exception as e:
        print(f"  ⚠️ Qdrant upsert: {e}")
        return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ingest-qdrant", action="store_true",
                    help="Ingerir manifest em casosex-conversation (tag=casosex)")
    args = ap.parse_args()

    t0 = time.time()
    manifest = load_registry()
    print(f"🏎️ CASOSEX SKILL SENSOR — registry v{manifest['version']} · {manifest['count']} skills")

    pairs = {
        "casosex:skills:manifest": json.dumps(manifest, ensure_ascii=False),
        "casosex:skills:count": str(manifest["count"]),
        "casosex:skills:version": manifest["version"],
        "casosex:skills:last_sync": datetime.now(timezone.utc).isoformat(),
        "casosex:skills:categories": json.dumps(
            {c: [s["id"] for s in manifest["skills"] if s["category"] == c]
             for c in sorted({s["category"] for s in manifest["skills"]})}, ensure_ascii=False),
    }
    for s in manifest["skills"]:
        pairs[f"casosex:skills:{s['id']}"] = json.dumps(
            {k: s[k] for k in ("id", "name", "category", "role", "status",
                               "claude_synced", "description")}, ensure_ascii=False)

    ok_redis = redis_set_many(pairs)

    only_antigravity = [s["id"] for s in manifest["skills"] if not s["claude_synced"]]
    print(f"   Redis: {'OK' if ok_redis else 'FALHOU'} · claude-sync: "
          f"{manifest['count'] - len(only_antigravity)}/{manifest['count']}")
    if only_antigravity:
        print(f"   Só-Antigravity: {', '.join(only_antigravity)}")

    ingested = 0
    if args.ingest_qdrant:
        ingested = qdrant_upsert(manifest)
        print(f"   Qdrant {COLLECTION}: {ingested} pontos novos/em cache (kind=skill-registry)")

    print(f"✅ Sensor executado em {(time.time() - t0) * 1000:.0f}ms · "
          f"Redis={ok_redis} · Qdrant={ingested}")


if __name__ == "__main__":
    main()
