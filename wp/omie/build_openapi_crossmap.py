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
        
    openapi_doc = {
        "openapi": "3.1.0",
        "info": {
            "title": "CASOSEX Sovereign Omie ERP API Specification",
            "version": "1.1.0",
            "description": "Matriz Soberana OpenAPI 3.1 compilada a partir de 138 serviços mapeados do Omie ERP com cruzamento Knockout.js UI."
        },
        "servers": [
            { "url": "https://app.omie.com.br", "description": "Servidor Oficial Omie ERP" },
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
