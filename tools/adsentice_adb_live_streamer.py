#!/usr/bin/env python3
"""
adsentice_adb_live_streamer.py
--------------------------------
Ponte Live USB ADB Bidirecional (Smartphone Android Físico <-> Engine RSXT Slint).

Funcionalidades:
1. Polling Reativo de Layout: Monitora mCurrentFocus e uiautomator dump do smartphone USB.
2. Atualização Automática do SDUI IR: Chama adsentice_compose_sdui_mapper.py para atualizar /tmp/rsxt_sdui_ir.json.
3. IPC Injetor de Gestos: Escuta comandos em /tmp/rsxt_adb_events.fifo (ou socket) e dispara `adb shell input tap/swipe`.

Uso:
  python3 tools/adsentice_adb_live_streamer.py
"""

import os
import sys
import time
import subprocess
import json
import hashlib
from pathlib import Path

ADB_DUMP_SDCARD = "/sdcard/window_dump.xml"
LOCAL_BONE_DUMP = "/tmp/bone_dump.xml"
IR_JSON_OUTPUT = "/tmp/rsxt_sdui_ir.json"
FIFO_PATH = "/tmp/rsxt_adb_events.fifo"

def get_blake3_hash(filepath: str) -> str:
    if not os.path.exists(filepath):
        return ""
    hasher = hashlib.blake2b()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def get_current_window_focus() -> str:
    try:
        res = subprocess.run(
            ["adb", "shell", "dumpsys", "window", "displays"],
            capture_output=True,
            text=True,
            timeout=3
        )
        for line in res.stdout.splitlines():
            if "mCurrentFocus" in line or "mFocusedApp" in line:
                return line.strip()
    except Exception as e:
        pass
    return ""

def capture_and_map_live_layout() -> bool:
    try:
        # 1. Capture dump from device
        dump_res = subprocess.run(
            ["adb", "shell", "uiautomator", "dump", ADB_DUMP_SDCARD],
            capture_output=True,
            text=True,
            timeout=5
        )
        if "UI hierchary dumped to" not in dump_res.stdout and "dumped to" not in dump_res.stdout:
            # Fallback check if dump exists
            pass

        # 2. Pull dump to local /tmp/bone_dump.xml
        pull_res = subprocess.run(
            ["adb", "pull", ADB_DUMP_SDCARD, LOCAL_BONE_DUMP],
            capture_output=True,
            text=True,
            timeout=5
        )
        if pull_res.returncode != 0 or not os.path.exists(LOCAL_BONE_DUMP):
            return False

        # 3. Trigger SDUI Mapper
        mapper_script = Path(__file__).parent / "adsentice_compose_sdui_mapper.py"
        map_res = subprocess.run(
            [sys.executable, str(mapper_script)],
            capture_output=True,
            text=True,
            timeout=5
        )
        return map_res.returncode == 0
    except Exception as e:
        print(f"⚠️ Erro ao capturar layout live: {e}")
        return False

def inject_adb_tap(x: int, y: int):
    try:
        print(f"👆 [LiveStreamer] Injetando toque físico no smartphone: ({x}, {y})")
        subprocess.run(["adb", "shell", "input", "tap", str(x), str(y)], timeout=2)
    except Exception as e:
        print(f"⚠️ Falha ao injetar toque ADB: {e}")

def setup_fifo_listener():
    if os.path.exists(FIFO_PATH):
        try:
            os.remove(FIFO_PATH)
        except OSError:
            pass
    try:
        os.mkfifo(FIFO_PATH)
        os.chmod(FIFO_PATH, 0o666)
        print(f"📡 FIFO listener de gestos ativado em: {FIFO_PATH}")
    except Exception as e:
        print(f"⚠️ Não foi possível criar FIFO: {e}")

def main():
    print("🚀 Inicializando Ponte Live USB ADB Bidirecional (Smartphone <-> RSXT Slint)")
    
    # Check ADB device connection
    dev_check = subprocess.run(["adb", "devices"], capture_output=True, text=True)
    devices = [line for line in dev_check.stdout.splitlines() if "\tdevice" in line]
    if not devices:
        print("⚠️ Nenhum dispositivo Android conectado via USB ADB. Aguardando conexão...")
    else:
        print(f"✓ Dispositivo Android USB detectado: {devices[0].split()[0]}")

    setup_fifo_listener()

    last_focus = ""
    last_hash = ""

    print("🔄 Loop reativo de sincronização iniciado (Pressione Ctrl+C para encerrar)...")
    
    # Initial capture
    if capture_and_map_live_layout():
        last_hash = get_blake3_hash(IR_JSON_OUTPUT)
        print(f"✅ IR JSON Soberano sincronizado inicialmente! Checksum: {last_hash[:16]}...")

    while True:
        try:
            current_focus = get_current_window_focus()
            
            # Check if focus changed or periodic check
            if current_focus != last_focus and current_focus != "":
                print(f"📱 Mudança de foco detectada no Android: {current_focus[:60]}")
                last_focus = current_focus
                if capture_and_map_live_layout():
                    new_hash = get_blake3_hash(IR_JSON_OUTPUT)
                    if new_hash != last_hash:
                        last_hash = new_hash
                        print(f"⚡ Layout Slint atualizado ao vivo! Checksum: {last_hash[:16]}...")

            # Non-blocking read from FIFO if events arrive
            if os.path.exists(FIFO_PATH):
                try:
                    fifo_fd = os.open(FIFO_PATH, os.O_RDONLY | os.O_NONBLOCK)
                    with os.fdopen(fifo_fd, "r") as fifo:
                        data = fifo.read()
                        if data:
                            for line in data.splitlines():
                                if line.startswith("TAP:"):
                                    parts = line.split(":")
                                    if len(parts) == 3:
                                        inject_adb_tap(int(parts[1]), int(parts[2]))
                except OSError:
                    pass

            time.sleep(1.0)
        except KeyboardInterrupt:
            print("\n🛑 Encerrando Ponte Live USB ADB...")
            break
        except Exception as e:
            print(f"⚠️ Erro no loop de sincronização: {e}")
            time.sleep(2.0)

if __name__ == "__main__":
    main()
