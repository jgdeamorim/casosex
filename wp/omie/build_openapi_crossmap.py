#!/usr/bin/env python3
import json
import os

DOCS_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/docs"
CATALOG_PATH = os.path.join(DOCS_DIR, "catalog.json")

def load_catalog():
    if os.path.exists(CATALOG_PATH):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

MODULE_ANCHORS = {
    "crm": {"hash": "#SFA", "id": "SFA", "name": "CRM / Força de Vendas"},
    "produtos": {"hash": "#VPR", "id": "VPR", "name": "Vendas e Produção / Estoque"},
    "vendas": {"hash": "#VEN", "id": "VEN", "name": "Vendas e NF-e"},
    "compras": {"hash": "#COM", "id": "COM", "name": "Compras e Suprimentos"},
    "financas": {"hash": "#FIN", "id": "FIN", "name": "Finanças e DRE"},
    "geral": {"hash": "#CTB", "id": "CTB", "name": "Contabilidade / Configurações"}
}

PORTAL_AND_AUTH_ENDPOINTS = {
    "/api/portal/users/me/": {
        "delete": {
            "summary": "Exclusão Definitiva de Perfil/Conta",
            "tags": ["Portal Security"],
            "parameters": [
                {"name": "gtoken", "in": "query", "required": True, "schema": {"type": "string"}},
                {"name": "reason", "in": "query", "required": True, "schema": {"type": "string"}}
            ],
            "responses": {"200": {"description": "Status OK ou Erro na solicitação"}}
        }
    },
    "/api/portal/users/me/validate-number": {
        "post": {
            "summary": "Validação de Número de Celular via SMS/WhatsApp Token",
            "tags": ["Portal Security"],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "gtoken": {"type": "string"},
                                "code": {"type": "string"}
                            }
                        }
                    }
                }
            },
            "responses": {"200": {"description": "Retorna o status da validação (DONE/OK/ERROR)"}}
        }
    },
    "/edit-profile/?action=UNLINK_SSO": {
        "post": {
            "summary": "Desvinculação de Provedor de Login SSO (Google/Apple)",
            "tags": ["Portal Security"],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "gtoken": {"type": "string"}
                            }
                        }
                    }
                }
            },
            "responses": {"200": {"description": "Resultado do desacoplamento da conta SSO"}}
        }
    },
    "/auth/webauthn/options": {
        "post": {
            "summary": "Gera desafio público para registro de Biometria / Passkey FIDO2",
            "tags": ["WebAuthn / Passkeys"],
            "parameters": [
                {"name": "apiVer", "in": "query", "schema": {"type": "string", "example": "2"}},
                {"name": "email", "in": "query", "required": True, "schema": {"type": "string"}}
            ],
            "responses": {"200": {"description": "Retorna o desafio e a estrutura publicKey de registro"}}
        }
    },
    "/auth/webauthn/register": {
        "post": {
            "summary": "Valida e salva a nova credencial biométrica do usuário",
            "tags": ["WebAuthn / Passkeys"],
            "parameters": [
                {"name": "apiVer", "in": "query", "schema": {"type": "string", "example": "2"}}
            ],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "credential": {"type": "object"},
                                "challenge_token": {"type": "string"},
                                "key_name": {"type": "string"}
                            }
                        }
                    }
                }
            },
            "responses": {"200": {"description": "Status de sucesso no cadastro da chave Passkey"}}
        }
    },
    "/auth/webauthn": {
        "get": {
            "summary": "Lista todas as chaves Passkey/Biometria do usuário",
            "tags": ["WebAuthn / Passkeys"],
            "responses": {"200": {"description": "Array de chaves cadastradas"}}
        },
        "delete": {
            "summary": "Remove uma chave Passkey/Biometria cadastrada",
            "tags": ["WebAuthn / Passkeys"],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"}
                            }
                        }
                    }
                }
            },
            "responses": {"200": {"description": "Confirmação de remoção"}}
        }
    },
    "/webauthn/login/options": {
        "post": {
            "summary": "Inicia processo de autenticação biométrica sem senha",
            "tags": ["WebAuthn / Passkeys"],
            "responses": {"200": {"description": "Desafio de autenticação de login"}}
        }
    },
    "/webauthn/login/verify": {
        "post": {
            "summary": "Valida a resposta assinada pelo hardware para efetuar login",
            "tags": ["WebAuthn / Passkeys"],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "rawId": {"type": "string"},
                                "challenge_token": {"type": "string"},
                                "response": {"type": "object"}
                            }
                        }
                    }
                }
            },
            "responses": {"200": {"description": "Sessão autorizada com sucesso"}}
        }
    },
    "/v5/{app_hash}/{tenant_id}/{dialog_id}/{hash}/get/fastcombo": {
        "get": {
            "summary": "Motor DBFast v5: Consulta otimizada para dropdowns e seletores de UI",
            "tags": ["DBFast v5 (Read-Replica)"],
            "parameters": [
                {"name": "cachets", "in": "query", "schema": {"type": "string"}}
            ],
            "responses": {"200": {"description": "Retorna itens formatados para combo reativo"}}
        }
    },
    "/v5/{app_hash}/{tenant_id}/{dialog_id}/{hash}/get/grid": {
        "get": {
            "summary": "Motor DBFast v5: Tabela de leitura de alta velocidade com paginação",
            "tags": ["DBFast v5 (Read-Replica)"],
            "parameters": [
                {"name": "$skip", "in": "query", "schema": {"type": "integer"}},
                {"name": "$top", "in": "query", "schema": {"type": "integer"}},
                {"name": "pk", "in": "query", "schema": {"type": "string"}}
            ],
            "responses": {"200": {"description": "Grid paginado de alta performance"}}
        }
    }
}

def generate_openapi_31():
    catalog = load_catalog()
    paths = {}
    
    for item in catalog:
        cat = item.get("category", "geral")
        srv = item.get("service", "unknown")
        url_path = f"/api/v1/{cat}/{srv}/"
        
        anchor_info = MODULE_ANCHORS.get(cat, {"hash": "#GEN", "id": cat.upper(), "name": cat.capitalize()})
        
        paths[url_path] = {
            "post": {
                "summary": f"Serviço Omie JSON-RPC: {cat.upper()} / {srv}",
                "description": f"Endpoint operacional Omie ERP para o módulo {cat}. Suporta ações JSON-RPC como Incluir, Alterar, Consultar e Excluir.",
                "operationId": f"{cat}_{srv}",
                "tags": [cat.capitalize()],
                "x-ko-module-hash": anchor_info["hash"],
                "x-ko-module-id": anchor_info["id"],
                "x-ko-module-name": anchor_info["name"],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "call": { "type": "string", "example": f"Listar{srv.capitalize()}" },
                                    "app_key": { "type": "string", "example": "4020942403" },
                                    "app_secret": { "type": "string", "example": "b1b0e0081d09e1c107bf45778848792a" },
                                    "param": {
                                        "type": "array",
                                        "items": { "type": "object" }
                                    }
                                },
                                "required": ["call", "app_key", "app_secret", "param"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Resposta JSON-RPC com o resultado da execução",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "pagina": { "type": "integer" },
                                        "total_de_paginas": { "type": "integer" },
                                        "registros": { "type": "integer" },
                                        "total_de_registros": { "type": "integer" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
    for path_key, path_item in PORTAL_AND_AUTH_ENDPOINTS.items():
        paths[path_key] = path_item

    openapi_doc = {
        "openapi": "3.1.0",
        "info": {
            "title": "CASOSEX Sovereign Omie ERP API Specification",
            "version": "1.2.0",
            "description": "Matriz Soberana OpenAPI 3.1 compilada a partir de 138 serviços mapeados do Omie ERP + Endpoints do Portal, WebAuthn e DBFast v5."
        },
        "servers": [
            { "url": "https://app.omie.com.br", "description": "Servidor Oficial Omie ERP" },
            { "url": "https://dbfast.omie.com.br", "description": "Servidor DBFast Read-Replica v5" },
            { "url": "http://localhost:6661", "description": "Bridge Militar Local CASOSEX" }
        ],
        "paths": paths
    }
    
    out_file = os.path.join(DOCS_DIR, "omie_openapi_3.1_sovereign.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(openapi_doc, f, indent=2, ensure_ascii=False)
    
    print(f"🎉 OpenAPI 3.1 Spec gerada com {len(paths)} rotas e âncoras Knockout.js em: {out_file}")
    return openapi_doc

if __name__ == "__main__":
    generate_openapi_31()
