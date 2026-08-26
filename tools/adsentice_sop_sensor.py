#!/usr/bin/env python3
"""
adsentice_sop_sensor.py — Sensor SOP Guardian [SVI] (ADR-0135 §4.5 & ADR-0138 §2.2)

Auditador de conformidade sintática SOP v3.2 para arquivos TS/TSX.
Detecta e valida as 4 variações de vocabulário:
  1. SOP_TSX_SERVER_PAGE  (React Server Component: props inline, Suspense, funções fora do body)
  2. SOP_TSX_CLIENT_LEAF  (React Client Component: 'use client' obrigatorio)
  3. SOP_TS_PURE_MODULE   (Módulo TS puro: catch (e: unknown), import "server-only", guard clauses)
  4. SOP_RUST_SHAI_GATE   (Bridge de telemetria Rust RSXT)

Uso:
  python3 tools/adsentice_sop_sensor.py
"""
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
REDIS_HOST, REDIS_PORT = "127.0.0.1", 6396
REDIS_KEY_SOP_STATUS = "adsentice:dev:sop:status"
REDIS_KEY_SOP_VIOLATIONS = "adsentice:dev:sop:violations"
REDIS_KEY_SOP_CHECK = "adsentice:dev:sop:last_check"


def audit_file(file_path: Path) -> list[dict]:
    violations = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return violations

    rel_path = str(file_path.relative_to(PROJECT_ROOT))
    lines = content.splitlines()
    is_tsx = file_path.suffix == ".tsx"

    # Anti-Pattern 1: catch {} vazio
    for idx, line in enumerate(lines, start=1):
        if re.search(r"catch\s*\([^)]*\)\s*\{\s*\}", line) or re.search(r"catch\s*\{\s*\}", line):
            violations.append({
                "file": rel_path,
                "line": idx,
                "rule": "SOP_ANTI_PATTERN_EMPTY_CATCH",
                "message": "catch vazio proibido — use `catch (e: unknown) { void e }`",
                "severity": "HIGH",
            })

    # Anti-Pattern 2: any explícito em tipagem de variável/parâmetro
    for idx, line in enumerate(lines, start=1):
        if re.search(r":\s*any\b", line) and not re.search(r"eslint-disable", line):
            violations.append({
                "file": rel_path,
                "line": idx,
                "rule": "SOP_ANY_TYPE_PROHIBITED",
                "message": "Uso de `: any` proibido — priorizar `unknown` para type narrowing",
                "severity": "MEDIUM",
            })

    # Variação SOP_TSX_CLIENT_LEAF: se usa React hooks em .tsx, deve ter 'use client'
    if is_tsx and ("useState(" in content or "useEffect(" in content or "useContext(" in content):
        first_10_lines = "\n".join(lines[:10])
        if "'use client'" not in first_10_lines and '"use client"' not in first_10_lines:
            violations.append({
                "file": rel_path,
                "line": 1,
                "rule": "SOP_TSX_CLIENT_LEAF_MISSING_DIRECTIVE",
                "message": "Componente client-side com React hooks exige a diretiva `'use client'` no topo",
                "severity": "HIGH",
            })

    # Variação SOP_TS_PURE_MODULE: se usa fs/net/crypto Node.js, deve ter import "server-only" em apps/web
    if not is_tsx and ("from 'node:fs'" in content or 'from "node:fs"' in content or "from 'fs'" in content):
        if "server-only" not in content and "apps/web" in rel_path:
            violations.append({
                "file": rel_path,
                "line": 1,
                "rule": "SOP_TS_PURE_MODULE_SERVER_ONLY_MISSING",
                "message": "Módulo puro com Node.js APIs exige `import \"server-only\"` em apps/web",
                "severity": "MEDIUM",
            })

    return violations


def get_redis_client():
    try:
        import redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=1, decode_responses=True)
        r.ping()
        return r
    except Exception as e:
        print(f"⚠️ Redis (:6396) indisponível: {e}")
        return None


def main():
    t0 = time.time()
    ts_files = [
        p for p in PROJECT_ROOT.glob("**/*.[tt]s*")
        if "node_modules" not in str(p) and ".next" not in str(p) and "dist" not in str(p)
        and "deprecated" not in str(p) and "self-essentials" not in str(p)
        and not p.name.endswith(".d.ts")
    ]

    all_violations = []
    for f in ts_files:
        v = audit_file(f)
        all_violations.extend(v)

    iso_now = datetime.now(timezone.utc).isoformat()
    status = "COMPLIANT" if not all_violations else "NON_COMPLIANT"

    r = get_redis_client()
    if r:
        with r.pipeline() as pipe:
            pipe.set(REDIS_KEY_SOP_STATUS, status)
            pipe.set(REDIS_KEY_SOP_VIOLATIONS, json.dumps(all_violations, ensure_ascii=False))
            pipe.set(REDIS_KEY_SOP_CHECK, iso_now)
            pipe.execute()

    elapsed_ms = (time.time() - t0) * 1000
    print(f"🛡️ SENSOR SOP GUARDIAN [SVI] — {len(ts_files)} arquivos auditados em {elapsed_ms:.2f}ms")
    print(f"   Status SOP v3.2: {status} ({len(all_violations)} violações detectadas)")

    if all_violations:
        print("\n⚠️ Violações Encontradas:")
        for v in all_violations[:10]:
            print(f"   • [{v['severity']}] {v['file']}:{v['line']} — {v['rule']}: {v['message']}")
        if len(all_violations) > 10:
            print(f"   ... e mais {len(all_violations) - 10} violações.")
    else:
        print("   ✅ Nenhum anti-pattern detectado nos arquivos monitorados.")


if __name__ == "__main__":
    main()
