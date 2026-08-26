#!/usr/bin/env python3
# ==============================================================================
# Digital Twin Soberano — FASE D3 (Adsentice / CASOSEX Hub)
# Comparador em tempo real: Roteiro Oficial Repo (Node Host) VS Soberania Total (Alpine RootFS)
# Ref: ADR-0016, ADR-0082, ADR-0094, ADR-0207
# ==============================================================================

import os
import sys
import time
import json
import psutil
import urllib.request
import hashlib
import subprocess
from typing import Dict, Any

REDIS_HOST = "127.0.0.1"
REDIS_PORT = 6396
ALPINE_ROOTFS = "/media/jeffer/RSXT/alpine/rootfs"
TARGET_URL = "http://127.0.0.1:2727"
EMDASH_REPO_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/self-inspirations/emdash"

def compute_blake3_or_sha256(data_bytes: bytes) -> str:
    """Calcula hash determinística usando BLAKE3 (ou fallback SHA256)."""
    try:
        import blake3
        return blake3.blake3(data_bytes).hexdigest()
    except ImportError:
        return hashlib.sha256(data_bytes).hexdigest()

def update_redis(key: str, value: str):
    """Atualiza chave no Redis :6396."""
    try:
        import redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=1.0)
        r.set(key, value)
    except Exception as e:
        print(f"⚠ Redis Warning ({REDIS_PORT}): {e}", file=sys.stderr)

def get_process_metrics_by_port(port: int = 2727) -> Dict[str, Any]:
    """Captura métricas de CPU, RAM (RSS) e PID do processo escutando na porta especificada."""
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            for conn in proc.connections(kind='inet'):
                if conn.laddr.port == port:
                    mem_info = proc.memory_info()
                    cpu_percent = proc.cpu_percent(interval=0.1)
                    cmdline = " ".join(proc.cmdline())
                    is_node_host = "node" in proc.name().lower() or "pnpm" in cmdline or "vite" in cmdline
                    is_docker_alpine = "docker" in proc.name().lower() or "containerd" in proc.name().lower() or "alpine" in cmdline
                    
                    return {
                        "pid": proc.pid,
                        "process_name": proc.name(),
                        "cmdline": cmdline[:120],
                        "memory_rss_mb": round(mem_info.rss / (1024 * 1024), 2),
                        "memory_vms_mb": round(mem_info.vms / (1024 * 1024), 2),
                        "cpu_percent": cpu_percent,
                        "runtime_type": "Node.js Host (Oficial Repo)" if is_node_host else ("Docker/Alpine (Soberano)" if is_docker_alpine else "Outro"),
                        "is_sovereign_container": is_docker_alpine and not is_node_host
                    }
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return {
        "pid": None,
        "process_name": "Nenhum",
        "memory_rss_mb": 0.0,
        "runtime_type": "Servidor Desligado",
        "is_sovereign_container": False
    }

def audit_http_endpoint(url: str = TARGET_URL) -> Dict[str, Any]:
    """Mede a resposta HTTP, status code e tempo de latência do servidor na porta 2727."""
    start = time.perf_counter()
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'DigitalTwin-Sovereign-Audit/1.0'})
        with urllib.request.urlopen(req, timeout=3.0) as resp:
            latency_ms = round((time.perf_counter() - start) * 1000, 2)
            html_snippet = resp.read(512).decode('utf-8', errors='ignore')
            has_emdash_head = "emdash" in html_snippet.lower() or "astro" in html_snippet.lower()
            return {
                "status_code": resp.status,
                "latency_ms": latency_ms,
                "reachable": True,
                "is_emdash_rendered": has_emdash_head,
                "snippet": html_snippet[:150].replace("\n", " ")
            }
    except Exception as e:
        return {
            "status_code": 0,
            "latency_ms": 0.0,
            "reachable": False,
            "error": str(e)
        }

def analyze_dependencies_sovereignty() -> Dict[str, Any]:
    """Varre o package.json do template-blog e mapeia dependências externas VS módulos soberanos."""
    pkg_path = os.path.join(EMDASH_REPO_PATH, "templates/blog/package.json")
    if not os.path.exists(pkg_path):
        return {"total_deps": 0, "blake3_pkg_hash": "none"}
    
    with open(pkg_path, "rb") as f:
        content = f.read()
    
    hash_blake3 = compute_blake3_or_sha256(content)
    pkg_data = json.loads(content.decode("utf-8"))
    
    deps = pkg_data.get("dependencies", {})
    dev_deps = pkg_data.get("devDependencies", {})
    
    external_npm = []
    internal_sovereign = []
    
    for d in {**deps, **dev_deps}.keys():
        if d.startswith("@emdash-cms/") or d.startswith("@adsentice/"):
            internal_sovereign.append(d)
        else:
            external_npm.append(d)
            
    return {
        "blake3_pkg_hash": hash_blake3,
        "total_deps_count": len(deps) + len(dev_deps),
        "internal_sovereign_count": len(internal_sovereign),
        "external_npm_count": len(external_npm),
        "sovereignty_percentage": round((len(internal_sovereign) / (len(deps) + len(dev_deps) or 1)) * 100, 1),
        "external_deps": external_npm[:10]
    }

def run_digital_twin_comparison() -> Dict[str, Any]:
    """Executa a auditoria completa do Digital Twin e gera o relatório comparativo."""
    metrics = get_process_metrics_by_port(2727)
    http_audit = audit_http_endpoint(TARGET_URL)
    deps_audit = analyze_dependencies_sovereignty()
    
    is_sovereign = metrics["is_sovereign_container"] and metrics["memory_rss_mb"] <= 200.0
    
    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "target_url": TARGET_URL,
        "execution_mode": metrics["runtime_type"],
        "sovereign_status": "SOBERANIA_TOTAL_OK" if is_sovereign else "MODO_OFICIAL_HOST_NODE",
        "delta_analysis": {
            "ram_consumption_mb": metrics["memory_rss_mb"],
            "ram_limit_target_mb": 200.0,
            "ram_compliant": metrics["memory_rss_mb"] <= 200.0 if metrics["pid"] else False,
            "isolated_in_alpine_container": metrics["is_sovereign_container"],
            "latency_ms": http_audit["latency_ms"],
            "http_status": http_audit["status_code"]
        },
        "dependency_sovereignty": deps_audit,
        "process_info": metrics,
        "kg_tag": "astro-emdash",
        "redis_key": "adsentice:digital_twin:status"
    }
    
    # Atualiza Redis
    update_redis("adsentice:digital_twin:status", json.dumps(report, ensure_ascii=False))
    update_redis("adsentice:ooda:stage:observe", f"DIGITAL TWIN: {report['sovereign_status']} | RAM: {metrics['memory_rss_mb']}MB | Latência: {http_audit['latency_ms']}ms")
    
    return report

def main():
    print("======================================================================")
    print("🤖 DIGITAL TWIN SOBERANO — AUDITORIA COMPARATIVA FASE D3")
    print("   Roteiro Oficial Repo (Node Host) VS Soberania Total (Alpine Container)")
    print("======================================================================")
    
    result = run_digital_twin_comparison()
    print(json.dumps(result, indent=2, ensure_ascii=False))
    print("======================================================================")
    
    if result["sovereign_status"] == "SOBERANIA_TOTAL_OK":
        print("✅ SOBERANIA TOTAL CONFIRMADA: Container Alpine isolado (< 200MB RAM) rodando na porta 2727.")
    else:
        print("⚠ MODO CONVENCIONAL DETECTADO: Aplicação rodando em Node.js no Host. Siga o plano de reajuste para containerizar.")
    
    sys.exit(0)

if __name__ == "__main__":
    main()
