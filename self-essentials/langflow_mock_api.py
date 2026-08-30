from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(title="Volúpia Social Content Engine - Langflow Mock Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/health_check")
@app.get("/api/v1/health")
@app.get("/api/v1/health_check")
def health():
    return {"status": "ok"}

@app.get("/api/v1/auto_login")
@app.post("/api/v1/auto_login")
@app.get("/api/v1/login")
@app.post("/api/v1/login")
def auto_login():
    return {
        "access_token": "volupia_mock_token_12345",
        "refresh_token": "volupia_mock_refresh_12345",
        "token_type": "bearer"
    }

@app.get("/api/v1/session")
def session():
    return {
        "authenticated": True,
        "user": {
            "id": "00000000-0000-0000-0000-000000000001",
            "username": "volupia_creator",
            "is_active": True,
            "is_superuser": True
        },
        "store_api_key": "volupia_store_key"
    }

@app.get("/api/v1/config")
def config():
    return {
        "version": "1.0.0",
        "auto_saving": True,
        "health_check_max_retries": 5,
        "max_file_size_upload": 100,
        "frontend_timeout": 30,
    }

@app.get("/api/v1/version")
def version():
    return {"version": "1.0.0", "package": "volupia-flow-engine"}

@app.get("/api/v1/users/whoami")
def whoami():
    return {
        "id": "00000000-0000-0000-0000-000000000001",
        "username": "volupia_creator",
        "is_active": True,
        "is_superuser": True,
        "create_at": "2026-08-30T12:00:00Z",
        "updated_at": "2026-08-30T12:00:00Z",
    }

@app.get("/api/v1/flows")
@app.get("/api/v1/flows/")
@app.get("/api/v1/flows/basic_examples")
@app.get("/api/v1/flows/basic_examples/")
def flows():
    return []

@app.get("/api/v1/starter-projects")
@app.get("/api/v1/starter-projects/")
def starter_projects():
    return []

@app.get("/api/v1/folders")
@app.get("/api/v1/folders/")
@app.get("/api/v1/projects")
@app.get("/api/v1/projects/")
def folders():
    return [
        {
            "id": "00000000-0000-0000-0000-000000000001",
            "name": "Volúpia Social Engine",
            "description": "Estúdio de Conteúdo Volúpia",
            "is_component": False,
            "flows": []
        }
    ]

@app.get("/api/v1/variables")
@app.get("/api/v1/variables/")
def variables():
    return []

@app.get("/api/v1/store/tags")
@app.get("/api/v1/store/components")
def store_tags():
    return []

@app.get("/api/v1/authz/me/permissions")
def permissions():
    return {"permissions": []}

@app.get("/api/v1/monitor/transactions")
@app.get("/api/v1/monitor/messages")
@app.get("/api/v1/memories")
@app.get("/api/v1/memories/")
def empty_lists():
    return []

@app.get("/api/v1/policy-bundle")
def policy_bundle():
    return {}

@app.get("/api/v1/all")
def get_all_components():
    return {
        "Volúpia Social Engine": {
            "Gemini Scriptwriter": {
                "name": "Gemini Scriptwriter",
                "description": "Gera roteiros otimizados (gancho + corpo + CTA) via Gemini Flash/DeepSeek.",
                "display_name": "Roteirista Volúpia (Gemini)",
                "field_order": ["tema", "gancho_target", "cta"],
                "template": {
                    "tema": {"type": "str", "required": True, "value": "Acompanhantes de Luxo VIP"},
                    "gancho_target": {"type": "str", "required": False, "value": "Curiosidade / Mistério"},
                    "cta": {"type": "str", "required": False, "value": "Link na Bio / DM Volúpia"}
                }
            },
            "Remote Vast.ai Renderer": {
                "name": "Remote Vast.ai Renderer",
                "description": "Dispara job de geração de imagem/vídeo 9:16 na GPU remota Vast.ai / Fal.ai.",
                "display_name": "Renderizador GPU (Vast.ai)",
                "field_order": ["prompt", "aspect_ratio", "model_type"],
                "template": {
                    "prompt": {"type": "str", "required": True, "value": "Cinematic portrait, Volupia aesthetics, 8k"},
                    "aspect_ratio": {"type": "str", "required": True, "value": "9:16"},
                    "model_type": {"type": "str", "required": True, "value": "Flux.1 / SDXL / Kling O3"}
                }
            },
            "Instagram Publisher": {
                "name": "Instagram Publisher",
                "description": "Publica Reels/Posts diretamente na API Graph do Instagram com telemetria OODA.",
                "display_name": "Publicador Instagram",
                "field_order": ["caption", "scheduled_time"],
                "template": {
                    "caption": {"type": "str", "required": True, "value": "Legenda e hashtags automáticas"},
                    "scheduled_time": {"type": "str", "required": False, "value": "Immediate"}
                }
            }
        }
    }

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
async def catch_all(request: Request, path: str):
    return JSONResponse(content={"status": "ok", "path": path, "message": "volupia mock backend"})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)

