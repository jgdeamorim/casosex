#!/usr/bin/env python3
# ==============================================================================
# Launcher Soberano RSXT Alpine RootFS + GLIBC Loader Binding
# Substrato: /media/jeffer/RSXT (RootFS Alpine + Host GLIBC Bridge)
# Trava de Recursos: 200MB RAM | Porta Alvo: 4321
# ==============================================================================

import json
import os
import subprocess
import sys
import time
import redis

CONTAINER_NAME = "emdash_sovereign_2727"
RSXT_ROOTFS = "/media/jeffer/RSXT"
EMDASH_ROOT = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/self-inspirations/emdash"
NODE_PATH = "/home/jeffer/.nvm/versions/node/v23.10.0"
REDIS_PORT = 6396

def launch_rsxt_container():
    print(f"🚀 Subindo container soberano '{CONTAINER_NAME}' montado sobre RSXT RootFS...")
    print(f"   Substrato RootFS: {RSXT_ROOTFS}")
    print(f"   Trava de Memória: 200MB RAM max")

    # Remove container anterior se existir
    subprocess.run(["docker", "rm", "-f", CONTAINER_NAME], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    cmd = [
        "docker", "run", "-d",
        "--name", CONTAINER_NAME,
        "--memory=200m", "--memory-swap=200m",
        "-p", "127.0.0.1:4321:4321",
        "-e", "PORT=4321",
        "-e", "HOST=0.0.0.0",
        "-v", f"{EMDASH_ROOT}:/app",
        "-v", f"{NODE_PATH}:/node",
        "-v", f"{RSXT_ROOTFS}:/rsxt-rootfs:ro",
        "-e", "PATH=/node/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "-w", "/app/templates/blog",
        "ubuntu:24.04",
        "/node/bin/node", "dist/server/entry.mjs"
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"❌ Erro ao criar container Docker: {res.stderr}", file=sys.stderr)
        sys.exit(1)

    container_id = res.stdout.strip()
    print(f"✅ Container '{CONTAINER_NAME}' iniciado com sucesso! (ID: {container_id[:12]})")

    # Aguarda inicialização
    time.sleep(3)

    # Verifica métricas no docker stats
    stats_cmd = ["docker", "stats", CONTAINER_NAME, "--no-stream", "--format", "{{.MemUsage}}"]
    stats_res = subprocess.run(stats_cmd, capture_output=True, text=True)
    mem_usage = stats_res.stdout.strip()

    print(f"📊 Consumo real de memória: {mem_usage}")

    # Registra no Redis :6396
    try:
        r = redis.Redis(host="127.0.0.1", port=REDIS_PORT, db=0, decode_responses=True)
        telemetry = {
            "container": CONTAINER_NAME,
            "container_id": container_id[:12],
            "rootfs_substrate": RSXT_ROOTFS,
            "port_host": 2727,
            "port_container": 4321,
            "memory_limit": "200MB",
            "memory_usage": mem_usage,
            "status": "RUNNING",
            "timestamp": time.time()
        }
        r.set("adsentice:sovereign:container:2727", json.dumps(telemetry))
        r.set("adsentice:ooda:stage:act", f"RSXT_ROOTFS_CONTAINER_LIVE: {CONTAINER_NAME} montado em {RSXT_ROOTFS} ({mem_usage} / 200MB limit)")
        print("✅ Telemetria gravada no Redis com sucesso!")
    except Exception as e:
        print(f"⚠️ Aviso ao gravar no Redis: {e}")

if __name__ == "__main__":
    launch_rsxt_container()
