#!/usr/bin/env python3
# ==============================================================================
# Sovereign Launcher: Langflow Vite Dev Server on Port :6567
# Substrate: /media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/langflow-main/src/frontend
# Proxy API Target: http://localhost:7860 (Hono Backend) | Target Port: :6567
# ==============================================================================

import os
import sys
import time
import subprocess
import redis
import json

PORT = 6567
FRONTEND_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/langflow-main/src/frontend"
REDIS_PORT = 6396

def start_server():
    print(f"🚀 Iniciando servidor frontend Vite do Langflow na porta :{PORT}...")
    print(f"   Diretório Source: {FRONTEND_DIR}")
    print(f"   Proxy API Target: http://localhost:7860 (Hono)")
    
    if not os.path.exists(FRONTEND_DIR):
        print(f"❌ Diretório não encontrado em {FRONTEND_DIR}", file=sys.stderr)
        sys.exit(1)
        
    env = os.environ.copy()
    env["VITE_PORT"] = str(PORT)
    env["VITE_PROXY_TARGET"] = "http://localhost:7860"
    
    cmd = [
        "npx", "vite", "--port", str(PORT), "--host", "127.0.0.1"
    ]
    
    log_file = open("/tmp/langflow_frontend_6567.log", "w")
    proc = subprocess.Popen(cmd, cwd=FRONTEND_DIR, env=env, stdout=log_file, stderr=log_file)
    
    print(f"✅ Servidor Vite iniciado com PID {proc.pid} na porta :{PORT}")
    time.sleep(2)
    
    try:
        r = redis.Redis(host="127.0.0.1", port=REDIS_PORT, db=0, decode_responses=True)
        telemetry = {
            "service": "langflow_frontend_vite_6567",
            "pid": proc.pid,
            "port": PORT,
            "backend_proxy": "http://localhost:7860",
            "status": "RUNNING",
            "timestamp": time.time()
        }
        r.set("casosex:sovereign:frontend:6567", json.dumps(telemetry))
        r.set("casosex:ooda:stage:act", f"LANGFLOW_FRONTEND_VITE_LIVE: http://127.0.0.1:{PORT} -> http://localhost:7860 (PID {proc.pid})")
        print("✅ Telemetria gravada no Redis :6396 com sucesso!")
    except Exception as e:
        print(f"⚠️ Aviso ao conectar com Redis: {e}")

if __name__ == "__main__":
    start_server()
