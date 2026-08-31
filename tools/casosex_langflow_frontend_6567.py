#!/usr/bin/env python3
# ==============================================================================
# Sovereign Launcher: Langflow Frontend on Port :6567
# Substrate: /media/jeffer/RSXT/alpine/rootfs + Static Build
# Source: /media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/langflow-main/src/frontend/build
# Target Port: :6567 | Memory Cap: ~20MB RAM
# ==============================================================================

import os
import sys
import time
import subprocess
import redis
import json

PORT = 6567
BUILD_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/langflow-main/src/frontend/build"
REDIS_PORT = 6396

def start_server():
    print(f"🚀 Iniciando servidor estático soberano do Langflow Frontend na porta :{PORT}...")
    print(f"   Diretório Base: {BUILD_DIR}")
    
    if not os.path.exists(BUILD_DIR):
        print(f"❌ Diretório de build não encontrado em {BUILD_DIR}", file=sys.stderr)
        sys.exit(1)
        
    cmd = [
        "python3", "-m", "http.server", str(PORT),
        "--directory", BUILD_DIR
    ]
    
    # Inicia como processo em segundo plano (nohup/subprocess)
    log_file = open("/tmp/langflow_frontend_6567.log", "w")
    proc = subprocess.Popen(cmd, stdout=log_file, stderr=log_file)
    
    print(f"✅ Servidor iniciado com PID {proc.pid} na porta :{PORT}")
    time.sleep(1)
    
    # Telemetria Redis :6396
    try:
        r = redis.Redis(host="127.0.0.1", port=REDIS_PORT, db=0, decode_responses=True)
        telemetry = {
            "service": "langflow_frontend_6567",
            "pid": proc.pid,
            "port": PORT,
            "build_dir": BUILD_DIR,
            "status": "RUNNING",
            "timestamp": time.time()
        }
        r.set("casosex:sovereign:frontend:6567", json.dumps(telemetry))
        r.set("casosex:ooda:stage:act", f"LANGFLOW_FRONTEND_LIVE: http://127.0.0.1:{PORT} (PID {proc.pid})")
        print("✅ Telemetria gravada no Redis :6396!")
    except Exception as e:
        print(f"⚠️ Aviso ao conectar com Redis: {e}")

if __name__ == "__main__":
    start_server()
