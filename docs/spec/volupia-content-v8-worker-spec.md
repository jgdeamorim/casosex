# Specification: Volúpia Content Engine V8 Worker (TypeScript / Hono)

## 1. Overview & Architectural Goal

The **Volúpia Content Engine V8 Worker** is a sovereign, zero-Python TypeScript microservice built with **Hono.js** and designed to run natively within V8 isolates (Cloudflare Workers / local V8 runtime).

It replaces the legacy Python FastAPI mock (`langflow_mock_api.py`), acting as the backend control plane for the Langflow React-based visual editor on port `:5556`.

---

## 2. Core Capabilities & Performance Targets

| Metric | Legacy Python FastAPI | V8 Worker (TypeScript / Hono) |
| :--- | :--- | :--- |
| **Runtime** | Python 3.12 + Uvicorn | Node.js / V8 Isolate (Cloudflare Worker) |
| **RAM Footprint** | ~17 MB - 6 GB (PyTorch) | **< 5 MB** |
| **Cold Start** | ~800ms - 2.5s | **< 5ms** |
| **Dependencies** | FastAPI, Uvicorn | Hono.js, TypeScript |
| **Persistence** | In-Memory Mock | Cloudflare D1 / KV / Redis :6396 |

---

## 3. Endpoints & API Contracts

### 3.1 Authentication & Health
- `GET /health` & `GET /api/v1/health`: Returns `{"status": "ok"}`
- `GET /api/v1/session`: Returns `{ "authenticated": true, "user": { "id": "00000000-0000-0000-0000-000000000001", "username": "volupia_creator", "is_superuser": true } }`
- `GET /api/v1/auto_login` & `POST /api/v1/auto_login`: Returns `{ "access_token": "volupia_v8_token_12345", "refresh_token": "volupia_v8_refresh_12345", "token_type": "bearer" }`
- `GET /api/v1/users/whoami`: Returns user profile data.

### 3.2 System & Config
- `GET /api/v1/config`: System limits (`max_file_size_upload`, `auto_saving`, `health_check_max_retries`).
- `GET /api/v1/version`: Returns `{ "version": "1.0.0", "package": "volupia-v8-content-engine" }`.

### 3.3 Component Catalog (`/api/v1/all`)
Exposes the **Volúpia Social Engine** category containing:
1. **Roteirista Volúpia (Gemini / DeepSeek)**: Inputs: `tema`, `gancho_target`, `cta`.
2. **Renderizador GPU (Vast.ai / Fal.ai)**: Inputs: `prompt`, `aspect_ratio`, `model_type`.
3. **Publicador Instagram (Graph API)**: Inputs: `caption`, `scheduled_time`.

### 3.4 Persistence & Flow Execution
- `GET /api/v1/projects` & `GET /api/v1/folders`: Returns default project list `[ { "id": "00000000-0000-0000-0000-000000000001", "name": "Volúpia Social Engine", "flows": [] } ]`.
- `GET /api/v1/flows` & `POST /api/v1/flows`: Save and load React Flow graph definitions.
- `POST /api/v1/build/{flowId}` & `POST /api/v1/run/{flowId}`: Executes node graph pipeline asynchronously.

---

## 4. Directory Structure

```
apps/volupia-content-worker/
├── package.json
├── tsconfig.json
├── wrangler.jsonc
└── src/
    ├── index.ts               # Hono App Entrypoint
    ├── routes/
    │   ├── auth.ts            # Auth & Session routes
    │   ├── config.ts          # Config & Version routes
    │   ├── components.ts      # Component Catalog (/api/v1/all)
    │   └── flows.ts           # Flow persistence & execution
    ├── services/
    │   ├── gemini.ts          # Gemini Scriptwriter caller
    │   ├── vast_ai.ts         # Vast.ai GPU Dispatcher
    │   └── instagram.ts       # Instagram Graph API Publisher
    └── types/
        └── langflow.ts        # Type contracts for Langflow UI
```

---

## 5. Verification Plan

1. **Compilation Check**: `pnpm --filter volupia-content-worker build` or `npx tsc --noEmit`.
2. **Endpoint Smoke Test**: `curl` tests against `http://127.0.0.1:7860/api/v1/session`, `/api/v1/all`, `/api/v1/projects/`.
3. **Frontend Integration**: Load `http://127.0.0.1:5556/` and confirm visual canvas loads zero errors and drag-and-drop nodes from "Volúpia Social Engine" work.
