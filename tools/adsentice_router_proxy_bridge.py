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
import urllib.request
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

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None  # Não segue redirecionamento automaticamente

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
        # Desativa o log padrão simples para usar o nosso logger colorido de alta visibilidade
        pass

    def do_HEAD(self):
        self.proxy_request("HEAD")

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

        cookie_req = self.headers.get("Cookie", "")
        print(f"🔍 [ROUTER LIVE LOG] {method} {self.path} | Cookie in: {cookie_req[:40] if cookie_req else 'Nenhum'}")

        # Fast-Path BLAKE3 Cache check para estáticos em GET
        is_static = method == "GET" and (self.path.startswith("/_astro/") or self.path.endswith((".css", ".js", ".png", ".jpg", ".svg", ".ico")))
        cache_key = f"adsentice:dev:cache:static:{self.path}" if is_static else None

        if cache_key and r:
            cached_val = r.get(cache_key)
            if cached_val:
                ttft_ms = (time.time() - t0) * 1000
                print(f"⚡ [FAST-PATH BLAKE3] {method} {self.path} ({ttft_ms:.3f} ms)")
                self.send_response(200)
                self.send_header("X-Antigravity-FastPath", "HIT-BLAKE3")
                self.send_header("X-TTFT-Latency-Ms", f"{ttft_ms:.3f}")
                self.send_header("Content-Type", "text/css" if self.path.endswith(".css") else "application/javascript")
                self.end_headers()
                self.wfile.write(cached_val)
                return

        # Configura Opener sem auto-redirect para repassar 302/Set-Cookie perfeitamente
        opener = urllib.request.build_opener(NoRedirectHandler())

        try:
            body_data = None
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                body_data = self.rfile.read(content_length)

            req_headers = {k: v for k, v in self.headers.items() if k.lower() not in ["content-length"]}
            req_headers["Host"] = self.headers.get("Host", "localhost:2727")
            req_headers["X-Forwarded-Host"] = self.headers.get("Host", "localhost:2727")
            req_headers["X-Forwarded-Proto"] = "http"

            req = Request(url, data=body_data, headers=req_headers, method=method)
            
            try:
                resp = opener.open(req, timeout=15)
                status = resp.status
                resp_headers = resp.headers
                resp_body = resp.read()
            except HTTPError as e:
                status = e.code
                resp_headers = e.headers
                resp_body = e.read()

            ttft_ms = (time.time() - t0) * 1000
            set_cookie = resp_headers.get("Set-Cookie", "")
            location = resp_headers.get("Location", "")

            print(f"  └─> [UPSTREAM RESP] {status} ({ttft_ms:.3f} ms) | Set-Cookie: {set_cookie[:40] if set_cookie else 'Nenhum'} | Location: {location}")

            self.send_response(status)
            
            # Encaminha TODOS os cabeçalhos de resposta do upstream para o navegador
            for hk, hv in resp_headers.items():
                if hk.lower() not in ["transfer-encoding", "content-length"]:
                    self.send_header(hk, hv)

            self.send_header("X-Antigravity-Router", "Sovereign-L7-Proxy")
            self.send_header("X-TTFT-Latency-Ms", f"{ttft_ms:.3f}")
            self.end_headers()

            if method != "HEAD" and resp_body:
                self.wfile.write(resp_body)

            # Armazena em cache se for estático
            if cache_key and r and status == 200:
                r.setex(cache_key, 3600, resp_body)

            # Telemetria ao vivo no Redis
            if r:
                telemetry = {
                    "method": method,
                    "path": self.path,
                    "status": status,
                    "ttft_ms": round(ttft_ms, 3),
                    "cookie_in": bool(cookie_req),
                    "set_cookie_out": bool(set_cookie),
                    "timestamp": time.time()
                }
                r.set("adsentice:router:telemetry:2727", json.dumps(telemetry))
                r.publish("adsentice:router:logs:live", json.dumps(telemetry))

        except URLError as e:
            print(f"❌ [ROUTER ERROR] Upstream indisponível: {e}")
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
