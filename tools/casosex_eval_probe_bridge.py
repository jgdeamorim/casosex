#!/usr/bin/env python3
"""
CASOSEX Brand DNA & Eval/Probe Bridge Server
Escuta na porta 9876 com suporte a CORS total para receber payloads de extração visual do Console do Chrome.
Salva automaticamente os arquivos em self-essentials/probes/
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

PORT = 9876
PROBES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "self-essentials", "probes")
os.makedirs(PROBES_DIR, exist_ok=True)

class EvalProbeHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode("utf-8"))
            domain = payload.get("metadata", {}).get("hostname", "unknown-domain").replace(":", "_").replace("/", "_")
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"brand-dna-{domain}-{timestamp}.json"
            latest_filename = f"brand-dna-{domain}-latest.json"

            file_path = os.path.join(PROBES_DIR, filename)
            latest_path = os.path.join(PROBES_DIR, latest_filename)

            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)

            with open(latest_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)

            print(f"\n✅ [CASOSEX Bridge] Payload de Eval & Probe recebido com sucesso!")
            print(f"📍 Salvo em: {file_path}")
            print(f"🔗 Domínio: {payload.get('metadata', {}).get('url')}")
            print(f"🎨 Cores Coletadas: {len(payload.get('colorPalette', []))}")
            print(f"🔤 Fontes Coletadas: {len(payload.get('typography', {}).get('fontFamilies', []))}\n")

            response_data = {
                "status": "success",
                "message": "Brand DNA salvo com sucesso!",
                "file": file_path
            }

            self.send_response(200)
            self._set_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))

        except Exception as e:
            print(f"❌ [CASOSEX Bridge Error] Erro ao processar payload: {str(e)}")
            self.send_response(500)
            self._set_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))

def run():
    server_address = ("127.0.0.1", PORT)
    httpd = HTTPServer(server_address, EvalProbeHandler)
    print(f"🚀 [CASOSEX Bridge] Servidor de Eval & Probe rodando em http://127.0.0.1:{PORT}")
    print(f"📂 Diretório de Destino: {PROBES_DIR}")
    print("Aguardando capturas do Chrome Console...\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 [CASOSEX Bridge] Servidor encerrado.")
        httpd.server_close()

if __name__ == "__main__":
    run()
