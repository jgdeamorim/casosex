#!/usr/bin/env python3
"""
Adsentice Sovereign Bridge Server - Port 6669
Escuta requisições do Chrome DevTools Console, salva payloads incrementais JSON
e notifica o ecossistema Adsentice (Redis :6396 + docs/spec/incremental_events/).
"""

import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

# Tenta carregar redis para notificação imediata no ecossistema
try:
    import redis
    redis_client = redis.Redis(host='127.0.0.1', port=6396, db=0, socket_timeout=1.0)
    redis_available = True
except Exception:
    redis_client = None
    redis_available = False

PORT = 6669
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVENTS_DIR = os.path.join(BASE_DIR, "docs", "spec", "incremental_events")
os.makedirs(EVENTS_DIR, exist_ok=True)

class BridgeServerHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        response = {
            "status": "online",
            "server": "Adsentice Sovereign Bridge 6669",
            "port": PORT,
            "redis_connected": redis_available,
            "events_dir": EVENTS_DIR
        }
        self.wfile.write(json.dumps(response, indent=2).encode("utf-8"))

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode("utf-8"))
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            action_type = payload.get("action", payload.get("type", "incremental_push"))
            filename = f"event-{action_type}-{timestamp}.json"
            latest_filename = "latest_incremental_event.json"

            file_path = os.path.join(EVENTS_DIR, filename)
            latest_path = os.path.join(EVENTS_DIR, latest_filename)

            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)

            with open(latest_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)

            # Notifica Redis OODA se disponível
            if redis_available and redis_client:
                try:
                    payload_str = json.dumps(payload, ensure_ascii=False)
                    redis_client.set("adsentice:bridge:latest_event", payload_str)
                    redis_client.publish("adsentice:bridge:channel", payload_str)
                    redis_client.set("adsentice:ooda:stage:act", f"Bridge 6669 Event Received: {action_type} at {timestamp}")
                except Exception as r_err:
                    print(f"⚠️ [Redis Warning]: {r_err}")

            print(f"\n⚡ [Bridge 6669] Evento Incremental Recebido!")
            print(f"📍 Salvo em: {file_path}")
            print(f"🏷️ Ação / Tipo: {action_type}")
            print(f"📦 Chaves do Payload: {list(payload.keys())}\n")

            response_data = {
                "status": "success",
                "message": "Evento incremental capturado com sucesso!",
                "timestamp": timestamp,
                "file": file_path,
                "latest": latest_path
            }

            self.send_response(200)
            self._set_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))

        except Exception as e:
            print(f"❌ [Bridge 6669 Error] Erro ao processar payload: {str(e)}")
            self.send_response(500)
            self._set_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

def run():
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, BridgeServerHandler)
    print(f"🚀 [Adsentice Bridge Server] Rodando em http://localhost:{PORT}")
    print(f"📂 Eventos salvos em: {EVENTS_DIR}")
    print(f"🔴 Redis status: {'CONECTADO (:6396)' if redis_available else 'INDISPONÍVEL'}")
    print("Aguardando payloads do Chrome Console...\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 [Bridge Server] Encerrado.")
        httpd.server_close()

if __name__ == "__main__":
    run()
