#!/usr/bin/env python3
"""
Adsentice Sovereign Bridge Server - Port 6669
Suporta POST JSON e POST Form-Data (Bypass CSP do ChatGPT).
Persiste eventos em docs/spec/incremental_events/ e notifica o Redis :6396.
"""

import http.server
import json
import os
import socketserver
import sys
import time
from urllib.parse import parse_qs

PORT = 6669
EVENTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "spec", "incremental_events")
os.makedirs(EVENTS_DIR, exist_ok=True)

# Tenta conectar ao Redis na porta 6396
REDIS_CLIENT = None
try:
    import redis
    REDIS_CLIENT = redis.Redis(host='127.0.0.1', port=6396, db=0, decode_responses=True)
    REDIS_CLIENT.ping()
    print("🔴 Redis status: CONECTADO (:6396)")
except Exception as e:
    print(f"⚠️ Redis offline ou indisponível (:6396): {e}")

class BridgeServerHandler(http.server.BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._set_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        response = {
            "status": "online",
            "server": "Adsentice Sovereign Bridge 6669",
            "port": PORT,
            "redis_connected": REDIS_CLIENT is not None,
            "events_dir": EVENTS_DIR
        }
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        raw_body = self.rfile.read(content_length).decode('utf-8')
        content_type = self.headers.get('Content-Type', '')

        payload_data = None

        try:
            if 'application/json' in content_type:
                payload_data = json.loads(raw_body)
            elif 'application/x-www-form-urlencoded' in content_type:
                parsed = parse_qs(raw_body)
                if 'payload' in parsed:
                    payload_data = json.loads(parsed['payload'][0])
                else:
                    payload_data = {k: v[0] if len(v) == 1 else v for k, v in parsed.items()}
            else:
                try:
                    payload_data = json.loads(raw_body)
                except Exception:
                    payload_data = {"raw": raw_body}
        except Exception as err:
            payload_data = {"error": f"Erro ao decodificar: {str(err)}", "raw": raw_body}

        # Gera timestamp e salva arquivo de evento
        timestamp_str = time.strftime("%Y%m%d_%H%M%S")
        filename = f"event_{timestamp_str}_{int(time.time()*1000)}.json"
        filepath = os.path.join(EVENTS_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(payload_data, f, indent=2, ensure_ascii=False)

        print(f"📥 [Bridge 6669] Evento capturado: {filename} ({len(raw_body)} bytes)")

        # Envia para o Redis se disponível
        if REDIS_CLIENT:
            try:
                REDIS_CLIENT.publish("adsentice:bridge:channel", json.dumps(payload_data))
                REDIS_CLIENT.set("adsentice:bridge:last_event", json.dumps(payload_data))
            except Exception as r_err:
                print(f"⚠️ Erro ao publicar no Redis: {r_err}")

        # Retorna resposta HTML/JSON apropriada para Form Submit ou Fetch
        self.send_response(200)
        self._set_cors_headers()
        
        if 'application/x-www-form-urlencoded' in content_type:
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<html><body><h3>OK - Payload Recebido pelo Bridge 6669</h3></body></html>")
        else:
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            res = {"status": "success", "file": filename, "received_at": timestamp_str}
            self.wfile.write(json.dumps(res).encode('utf-8'))

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

def main():
    server = ThreadedHTTPServer(('0.0.0.0', PORT), BridgeServerHandler)
    print(f"🚀 [Adsentice Bridge Server 6669] Rodando em http://localhost:{PORT}")
    print(f"📂 Eventos salvos em: {EVENTS_DIR}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Bridge Server finalizado com sucesso.")
        server.server_close()

if __name__ == "__main__":
    main()
