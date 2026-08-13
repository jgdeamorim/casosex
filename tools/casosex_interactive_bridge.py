#!/usr/bin/env python3
"""
CASOSEX Live Interactive Bridge Server (2-Way Chrome Console Bridge)
Mantém uma conexão viva e bidirecional com o Console do Chrome.
Fix: Ordem rigorosa dos cabeçalhos HTTP (send_response -> send_header -> end_headers) para evitar ERR_INVALID_HTTP_RESPONSE no Chrome.
"""

import json
import os
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Lock

PORT = 9876
PROBES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "self-essentials", "probes")
os.makedirs(PROBES_DIR, exist_ok=True)

# Estado Global da Ponte Interativa
bridge_state = {
    "connected": False,
    "last_ping": 0,
    "session_info": {},
    "pending_command": None,
    "last_result": None
}
state_lock = Lock()

class InteractiveBridgeHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        path = self.path

        if path == "/status":
            with state_lock:
                is_alive = bridge_state["connected"] and (time.time() - bridge_state["last_ping"] < 10)
                res = {
                    "connected": is_alive,
                    "session_info": bridge_state["session_info"],
                    "has_result": bridge_state["last_result"] is not None
                }
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/poll_cmd":
            cmd_to_send = None
            with state_lock:
                bridge_state["last_ping"] = time.time()
                bridge_state["connected"] = True
                if bridge_state["pending_command"]:
                    cmd_to_send = bridge_state["pending_command"]
                    bridge_state["pending_command"] = None

            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            if cmd_to_send:
                self.wfile.write(json.dumps({"has_cmd": True, "cmd": cmd_to_send}).encode("utf-8"))
            else:
                self.wfile.write(json.dumps({"has_cmd": False}).encode("utf-8"))

        elif path == "/result":
            with state_lock:
                res = bridge_state["last_result"] or {}
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(res).encode("utf-8"))

        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b"{}"
        path = self.path

        try:
            payload = json.loads(post_data.decode("utf-8"))
        except Exception:
            payload = {}

        if path == "/register":
            with state_lock:
                bridge_state["connected"] = True
                bridge_state["last_ping"] = time.time()
                bridge_state["session_info"] = payload.get("metadata", {})
            
            print(f"\n⚡ [BRIDGE CONECTADA] Tab ativa detectada!")
            print(f"🔗 URL: {payload.get('metadata', {}).get('url')}")
            print(f"📌 Título: {payload.get('metadata', {}).get('title')}")
            print("Ponte bidirecional estabelecida. Aguardando instrução da IA...\n")

            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "registered"}).encode("utf-8"))

        elif path == "/respond":
            with state_lock:
                bridge_state["last_result"] = payload
                bridge_state["last_ping"] = time.time()

            domain = payload.get("metadata", {}).get("hostname", "active-tab").replace(":", "_")
            file_path = os.path.join(PROBES_DIR, f"live-probe-{domain}.json")
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)

            print(f"✅ [RESPONSE RECEBIDO] Dados de Eval/Probe salvos em {file_path}")

            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "received"}).encode("utf-8"))

        elif path == "/exec_eval":
            script_code = payload.get("script")
            with state_lock:
                bridge_state["pending_command"] = script_code
                bridge_state["last_result"] = None

            print(f"⚙️ [EXEC EVAL] Comando enviado para execução na aba ativa do Chrome.")

            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "queued"}).encode("utf-8"))

        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

def run():
    server_address = ("127.0.0.1", PORT)
    httpd = HTTPServer(server_address, InteractiveBridgeHandler)
    print(f"🚀 [CASOSEX 2-Way Bridge] Servidor Bidirecional rodando em http://127.0.0.1:{PORT}")
    print("Cole o script de conexão no Console do Chrome para ativar o link vivo.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 [CASOSEX Bridge] Servidor encerrado.")
        httpd.server_close()

if __name__ == "__main__":
    run()
