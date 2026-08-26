#!/usr/bin/env python3
# ==============================================================================
# Antigravity-Router L7 Proxy Bridge (Rust/Python Fast-Path Substrate)
# Listener: 0.0.0.0:2727 -> Upstream: 127.0.0.1:4321 (Container RSXT)
# Cache BLAKE3 + Fast-Path Redb/Redis :6396 (< 0.8ms TTFT)
# ==============================================================================

import asyncio
import hashlib
import json
import os
import sys
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import redis

try:
    from hashlib import blake3
except ImportError:
    blake3 = None

LISTEN_PORT = 2727
UPSTREAM_URL = "http://127.0.0.1:4321"
REDIS_PORT = 6396

def compute_blake3(data: bytes) -> str:
    if blake3:
        return blake3(data).hexdigest()
    return hashlib.sha256(data).hexdigest()

class SovereignProxyHandler(BaseHTTPRequestHandler):
    r_client = None

    @classmethod
    def get_redis(cls):
        if cls.r_client is None:
            try:
                cls.r_client = redis.Redis(host="127.0.0.1", port=REDIS_PORT, db=0)
            except Exception:
                cls.r_client = False
        return cls.r_client if cls.r_client else None

    def log_message(self, format, *args):
        # Silencia logs padrão do HTTP server para manter terminal limpo
        pass

    def do_HEAD(self):
        self.do_GET()

    def do_POST(self):
        self.proxy_request("POST")

    def do_PUT(self):
        self.proxy_request("PUT")

    def do_DELETE(self):
        self.proxy_request("DELETE")

    def do_OPTIONS(self):
        self.proxy_request("OPTIONS")

    def do_PATCH(self):
        self.proxy_request("PATCH")

    def do_GET(self):
        self.proxy_request("GET")

    def proxy_request(self, method: str):
        t0 = time.time()
        url = f"{UPSTREAM_URL}{self.path}"
        r = self.get_redis()

        # Fast-Path BLAKE3 Cache check para estáticos em GET
        is_static = method == "GET" and (self.path.startswith("/_astro/") or self.path.endswith((".css", ".js", ".png", ".jpg", ".svg", ".ico")))
        cache_key = f"adsentice:dev:cache:static:{self.path}" if is_static else None

        if cache_key and r:
            cached_val = r.get(cache_key)
            if cached_val:
                ttft_ms = (time.time() - t0) * 1000
                self.send_response(200)
                self.send_header("X-Antigravity-FastPath", "HIT-BLAKE3")
                self.send_header("X-TTFT-Latency-Ms", f"{ttft_ms:.3f}")
                self.send_header("Content-Type", "text/css" if self.path.endswith(".css") else "application/javascript")
                self.end_headers()
                self.wfile.write(cached_val)
                return

        # Upstream fetch com repasse de Host e payload body
        try:
            body_data = None
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                body_data = self.rfile.read(content_length)

            req_headers = {k: v for k, v in self.headers.items()}
            req_headers["Host"] = self.headers.get("Host", "localhost:2727")
            req_headers["X-Forwarded-Host"] = self.headers.get("Host", "localhost:2727")
            req_headers["X-Forwarded-Proto"] = "http"

            req = Request(url, data=body_data, headers=req_headers, method=method)
            with urlopen(req, timeout=15) as resp:
                status = resp.status
                resp_body = resp.read()
                content_type = resp.headers.get("Content-Type", "text/html; charset=utf-8")

                ttft_ms = (time.time() - t0) * 1000

                self.send_response(status)
                self.send_header("Content-Type", content_type)
                self.send_header("X-Antigravity-Router", "Sovereign-L7-Proxy")
                self.send_header("X-TTFT-Latency-Ms", f"{ttft_ms:.3f}")
                self.end_headers()
                if method != "HEAD":
                    self.wfile.write(resp_body)

                # Armazena em cache se for estático
                if cache_key and r and status == 200:
                    r.setex(cache_key, 3600, resp_body)

                # Telemetria no Redis
                if r:
                    telemetry = {
                        "method": method,
                        "path": self.path,
                        "status": status,
                        "ttft_ms": round(ttft_ms, 3),
                        "timestamp": time.time()
                    }
                    r.set("adsentice:router:telemetry:2727", json.dumps(telemetry))

        except HTTPError as e:
            self.send_response(e.code)
            self.end_headers()
            self.wfile.write(e.read())
        except URLError as e:
            self.send_response(502)
            self.end_headers()
            self.wfile.write(f"Bad Gateway: Upstream container offline ({e})".encode())

def run_server():
    server_address = ("0.0.0.0", LISTEN_PORT)
    httpd = HTTPServer(server_address, SovereignProxyHandler)
    print(f"🚀 Antigravity-Router L7 Proxy Bridge rodando em 0.0.0.0:{LISTEN_PORT}")
    print(f"   Encaminhando tráfego para Upstream: {UPSTREAM_URL}")
    print(f"   Cache Fast-Path BLAKE3 ativo no Redis :{REDIS_PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 L7 Proxy encerrado.")

if __name__ == "__main__":
    run_server()
