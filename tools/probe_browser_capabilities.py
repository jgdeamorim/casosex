#!/usr/bin/env python3
"""
App-Jury Deep Hardware & Browser Capability Probe (Multi-Device)
Monorepo CASOSEX · Sovereign Capability Extractor via DevTools Bridge (6661)
Extracts and compares capabilities of both Mobile & Desktop connected devices.
"""

import sys
import json
import urllib.request

BRIDGE_EVAL_URL = "http://127.0.0.1:6661/eval"
BRIDGE_STATUS_URL = "http://127.0.0.1:6661/status"

PROBE_SCRIPT = """
(async function() {
  const caps = {};

  // 1. Hardware & System Specification
  caps.hardware = {
    cores: navigator.hardwareConcurrency || 'unknown',
    memory_gb: navigator.deviceMemory || 'unknown',
    max_touch_points: navigator.maxTouchPoints || 0,
    platform: navigator.platform,
    user_agent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages || []
  };

  // 2. Viewport & Display Features
  caps.display = {
    screen_resolution: screen.width + 'x' + screen.height,
    screen_avail: screen.availWidth + 'x' + screen.availHeight,
    viewport_inner: window.innerWidth + 'x' + window.innerHeight,
    viewport_outer: window.outerWidth + 'x' + window.outerHeight,
    device_pixel_ratio: window.devicePixelRatio,
    color_depth: screen.colorDepth,
    color_gamut: {
      rec2020: window.matchMedia('(color-gamut: rec2020)').matches,
      p3: window.matchMedia('(color-gamut: p3)').matches,
      srgb: window.matchMedia('(color-gamut: srgb)').matches
    },
    hdr: window.matchMedia('(dynamic-range: high)').matches,
    prefers_dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    prefers_reduced_motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // 3. GPU, WebGL 1/2 & WebGPU Capabilities
  let webgpu_info = { supported: false };
  if ('gpu' in navigator) {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) {
        webgpu_info = {
          supported: true,
          vendor: adapter.info ? adapter.info.vendor : 'generic',
          architecture: adapter.info ? adapter.info.architecture : 'generic',
          device: adapter.info ? adapter.info.device : 'generic',
          limits: {
            maxTextureDimension2D: adapter.limits.maxTextureDimension2D,
            maxComputeWorkgroupStorageSize: adapter.limits.maxComputeWorkgroupStorageSize,
            maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize
          }
        };
      }
    } catch(e) { webgpu_info = { supported: true, error: e.message }; }
  }

  let webgl1_info = { supported: false };
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      webgl1_info = {
        supported: true,
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        max_texture_size: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        max_viewport_dims: Array.from(gl.getParameter(gl.MAX_VIEWPORT_DIMS))
      };
    }
  } catch(e) {}

  let webgl2_info = { supported: false };
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
      webgl2_info = {
        supported: true,
        vendor: debugInfo ? gl2.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl2.getParameter(gl2.VENDOR),
        renderer: debugInfo ? gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl2.getParameter(gl2.RENDERER),
        max_texture_size: gl2.getParameter(gl2.MAX_TEXTURE_SIZE),
        max_3d_texture_size: gl2.getParameter(gl2.MAX_3D_TEXTURE_SIZE),
        max_color_attachments: gl2.getParameter(gl2.MAX_COLOR_ATTACHMENTS)
      };
    }
  } catch(e) {}

  caps.gpu = {
    webgpu: webgpu_info,
    webgl1: webgl1_info,
    webgl2: webgl2_info,
    offscreen_canvas: 'OffscreenCanvas' in window
  };

  // 4. Web Platform, WASM, Workers & Storage
  let wasm_simd = false;
  try {
    wasm_simd = WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]));
  } catch(e) {}

  let storage_estimate = { quota: 0, usage: 0 };
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      storage_estimate = { quota_mb: Math.round(est.quota / (1024*1024)), usage_mb: Math.round(est.usage / (1024*1024)) };
    } catch(e) {}
  }

  caps.platform = {
    wasm: typeof WebAssembly === 'object',
    wasm_simd: wasm_simd,
    shared_array_buffer: typeof SharedArrayBuffer !== 'undefined',
    web_workers: typeof Worker !== 'undefined',
    service_workers: 'serviceWorker' in navigator,
    shared_workers: typeof SharedWorker !== 'undefined',
    audio_context: typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined',
    media_capabilities: 'mediaCapabilities' in navigator,
    indexed_db: 'indexedDB' in window,
    opfs: !!(navigator.storage && navigator.storage.getDirectory),
    storage_estimate: storage_estimate
  };

  // 5. Network & Connection Features
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  caps.network = {
    online: navigator.onLine,
    effective_type: conn ? conn.effectiveType : 'unknown',
    downlink: conn ? conn.downlink : 'unknown',
    rtt: conn ? conn.rtt : 'unknown',
    save_data: conn ? conn.saveData : false
  };

  // 6. Input & Motion Sensors
  caps.inputs = {
    touch: 'ontouchstart' in window,
    pointer_events: 'PointerEvent' in window,
    gamepad: 'getGamepads' in navigator,
    device_motion: 'DeviceMotionEvent' in window,
    device_orientation: 'DeviceOrientationEvent' in window
  };

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 767;
  const devId = isMobile ? "device_mobile_android" : "device_desktop_pc";
  caps.device_id = devId;

  // Post back telemetry to bridge
  try {
    const bridgeUrl = 'http://127.0.0.1:6661';
    await fetch(`${bridgeUrl}/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_id: devId, capabilities: caps, userAgent: navigator.userAgent })
    });
  } catch(e) {}

  return JSON.stringify(caps);
})()
"""

def main():
    # 1. First trigger eval on both devices
    payload = json.dumps({"code": PROBE_SCRIPT}).encode("utf-8")
    req = urllib.request.Request(BRIDGE_EVAL_URL, data=payload, headers={"Content-Type": "application/json"})
    try:
        res = urllib.request.urlopen(req, timeout=8)
        eval_resp = json.loads(res.read().decode("utf-8"))
    except Exception as e:
        eval_resp = {"error": str(e)}

    # 2. Fetch full telemetry status from bridge to get registered devices
    try:
        req_status = urllib.request.Request(BRIDGE_STATUS_URL)
        res_status = urllib.request.urlopen(req_status, timeout=5)
        status_data = json.loads(res_status.read().decode("utf-8"))
    except Exception as e:
        status_data = {"error": str(e)}

    output = {
        "eval_result": eval_resp,
        "connected_devices": status_data.get("devices", {}),
        "status": status_data.get("status", "UNKNOWN")
    }
    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
