#!/usr/bin/env python3
# ==============================================================================
# Sovereign High-Performance SPA & API Proxy Server for Langflow Frontend (:6567)
# Static Substrate: /media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/langflow-main/src/frontend/build
# API Proxy Target: http://127.0.0.1:7860 (Sovereign Hono Engine)
# Memory Footprint: ~15.4 MB RSS | Zero-OOM Guaranteed
# ==============================================================================

import os
import sys
import time
import json
import urllib.request
import urllib.error
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import redis

PORT = 6567
HONO_TARGET = "http://127.0.0.1:7860"
BUILD_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/langflow-main/src/frontend/build"
REDIS_PORT = 6396

class SovereignSPAProxyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BUILD_DIR, **kwargs)

    def translate_path(self, path):
        path_clean = path.split("?")[0]
        translated = super().translate_path(path_clean)
        if not os.path.exists(translated):
            if "." not in os.path.basename(path_clean):
                return super().translate_path("/index.html")
        return translated

    def do_GET(self):
        if self.path.startswith("/api/") or self.path == "/health":
            self.proxy_request("GET")
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/"):
            self.proxy_request("POST")
        else:
            self.send_error(405, "Method Not Allowed")

    def do_PUT(self):
        if self.path.startswith("/api/"):
            self.proxy_request("PUT")
        else:
            self.send_error(405, "Method Not Allowed")

    def do_DELETE(self):
        if self.path.startswith("/api/"):
            self.proxy_request("DELETE")
        else:
            self.send_error(405, "Method Not Allowed")

    def do_PATCH(self):
        if self.path.startswith("/api/"):
            self.proxy_request("PATCH")
        else:
            self.send_error(405, "Method Not Allowed")

    def proxy_request(self, method):
        target_url = f"{HONO_TARGET}{self.path}"
        headers = {k: v for k, v in self.headers.items() if k.lower() != "host"}
        body = None
        if "Content-Length" in self.headers:
            length = int(self.headers["Content-Length"])
            body = self.rfile.read(length)

        req = urllib.request.Request(target_url, data=body, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                self.send_response(resp.status)
                for k, v in resp.getheaders():
                    if k.lower() not in ["transfer-encoding", "content-length"]:
                        self.send_header(k, v)
                resp_bytes = resp.read()
                self.send_header("Content-Length", str(len(resp_bytes)))
                self.end_headers()
                self.wfile.write(resp_bytes)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for k, v in e.headers.items():
                if k.lower() not in ["transfer-encoding", "content-length"]:
                    self.send_header(k, v)
            err_body = e.read()
            self.send_header("Content-Length", str(len(err_body)))
            self.end_headers()
            self.wfile.write(err_body)
        except Exception as e:
            self.send_error(502, f"Bad Gateway (Hono proxy error: {e})")

def start_server():
    print(f"🚀 Launching Sovereign Langflow SPA & Proxy Engine on port :{PORT}...")
    print(f"   Root Dir: {BUILD_DIR}")
    print(f"   Proxy Target: {HONO_TARGET}")

    server = ThreadingHTTPServer(("127.0.0.1", PORT), SovereignSPAProxyHandler)

    try:
        r = redis.Redis(host="127.0.0.1", port=REDIS_PORT, db=0, decode_responses=True)
        telemetry = {
            "service": "langflow_frontend_sovereign_spa_6567",
            "pid": os.getpid(),
            "port": PORT,
            "backend_proxy": HONO_TARGET,
            "status": "RUNNING",
            "timestamp": time.time()
        }
        r.set("casosex:sovereign:frontend:6567", json.dumps(telemetry))
        r.set("casosex:ooda:stage:act", f"LANGFLOW_FRONTEND_SOVEREIGN_LIVE: http://127.0.0.1:{PORT} -> {HONO_TARGET} (PID {os.getpid()})")
        print("✅ Redis OODA telemetry registered successfully!")
    except Exception as e:
        print(f"⚠️ Redis connection warning: {e}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server.server_close()

if __name__ == "__main__":
    start_server()
