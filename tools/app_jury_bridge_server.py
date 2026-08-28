#!/usr/bin/env python3
"""
App-Jury Multi-Device Chrome DevTools Bridge Server (Port: 6661)
Monorepo CASOSEX · Sovereign Antigravity Tool
ThreadingHTTPServer multi-threaded with multi-device registry (Mobile & Desktop).
"""

import sys
import time
import json
import queue
import threading
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

PORT = 6661

# Per-device command queues and responses
device_queues = {
    "device_mobile_android": queue.Queue(),
    "device_desktop_pc": queue.Queue()
}
latest_responses = {} # key: f"{cmd_id}:{device_id}"
lock = threading.Lock()

telemetry_store = {
    "status": "CONNECTED",
    "last_seen": time.time(),
    "devices": {},
    "logs": []
}

class BridgeHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _send_json_response(self, data, code=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(code)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        global telemetry_store
        if self.path.startswith("/poll"):
            # Determine which device queue to poll based on query param or client hint
            device_id = "device_desktop_pc"
            if "device=mobile" in self.path:
                device_id = "device_mobile_android"

            # Check if there is a command in the device queue
            q = device_queues.get(device_id)
            if q:
                try:
                    cmd = q.get_nowait()
                    self._send_json_response(cmd)
                    return
                except queue.Empty:
                    pass
            
            # Fallback: check all queues if not specific
            for dev_k, dev_q in device_queues.items():
                try:
                    cmd = dev_q.get_nowait()
                    self._send_json_response(cmd)
                    return
                except queue.Empty:
                    pass

            self._send_json_response({"action": "nop"})

        elif self.path == "/status":
            with lock:
                self._send_json_response(telemetry_store)
        else:
            self._send_json_response({"error": "Not Found"}, code=404)

    def do_POST(self):
        global telemetry_store
        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b"{}"
        
        try:
            data = json.loads(body_bytes.decode("utf-8"))
        except Exception:
            data = {}

        if self.path == "/telemetry":
            with lock:
                telemetry_store["status"] = "CONNECTED"
                telemetry_store["last_seen"] = time.time()
                
                device_id = data.get("device_id")
                if not device_id:
                    ua = str(data.get("userAgent", "") or data.get("gpu", {}).get("user_agent", ""))
                    vp = str(data.get("gpu", {}).get("viewport", "") or data.get("viewport", ""))
                    if "Android" in ua or "Mobile" in ua or (vp and vp.split("x")[0].isdigit() and int(vp.split("x")[0]) <= 767):
                        device_id = "device_mobile_android"
                    else:
                        device_id = "device_desktop_pc"

                dev_info = telemetry_store["devices"].get(device_id, {"device_id": device_id})
                dev_info["last_seen"] = time.time()
                if "fps" in data: dev_info["fps"] = data["fps"]
                if "gpu" in data: dev_info["gpu"] = data["gpu"]
                if "capabilities" in data: dev_info["capabilities"] = data["capabilities"]
                if "userAgent" in data: dev_info["user_agent"] = data["userAgent"]

                telemetry_store["devices"][device_id] = dev_info

                if "log" in data: 
                    telemetry_store["logs"].append({"device": device_id, "log": data["log"]})
                    if len(telemetry_store["logs"]) > 100:
                        telemetry_store["logs"].pop(0)

            self._send_json_response({"status": "ok", "device_id": device_id})

        elif self.path == "/response":
            cmd_id = data.get("id")
            device_id = data.get("device_id", "unknown")
            if cmd_id:
                with lock:
                    latest_responses[f"{cmd_id}:{device_id}"] = data
                    latest_responses[cmd_id] = data # fallback single
            self._send_json_response({"status": "ok"})

        elif self.path == "/eval":
            code = data.get("code", "")
            cmd_id = f"cmd_{int(time.time()*1000)}"
            
            # Queue command for both device queues
            for dev_q in device_queues.values():
                dev_q.put({"action": "eval", "id": cmd_id, "code": code})
            
            start = time.time()
            responses = {}
            while time.time() - start < 5.0:
                with lock:
                    keys_to_remove = []
                    for k, v in list(latest_responses.items()):
                        if k.startswith(f"{cmd_id}:"):
                            dev_name = k.split(":", 1)[1]
                            responses[dev_name] = v
                            keys_to_remove.append(k)
                    for k in keys_to_remove:
                        latest_responses.pop(k, None)
                
                # If we got response or fallback single response
                if len(responses) >= 1 and time.time() - start > 1.0:
                    break
                time.sleep(0.05)

            if responses:
                self._send_json_response({"status": "ok", "cmd_id": cmd_id, "responses": responses})
            elif cmd_id in latest_responses:
                self._send_json_response({"status": "ok", "cmd_id": cmd_id, "responses": {"default": latest_responses.pop(cmd_id)}})
            else:
                self._send_json_response({"error": "Timeout waiting for DevTools execution"}, code=504)
        else:
            self._send_json_response({"error": "Not Found"}, code=404)

    def log_message(self, format, *args):
        return # Silent logging

def run_server():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), BridgeHandler)
    print(f"🚀 App-Jury Multi-Device Threading Bridge Server (Porta {PORT})")
    print(f"📡 Escutando probe clients em http://127.0.0.1:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Bridge Server.")

if __name__ == "__main__":
    run_server()
