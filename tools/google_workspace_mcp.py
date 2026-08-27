#!/usr/bin/env python3
"""
Google Workspace Sovereign MCP Server — Antigravity Edition (ADR-0201)
Suporte soberano à criação e manipulação da Matriz Nacional de Fornecedores via Google Sheets REST API.
"""

import os
import json
import urllib.request
import urllib.parse
from pathlib import Path
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("google-workspace")

SECRETS_FILE = Path("/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/.secrets/.evn.GOOGLE-SHEETS")

def load_env_secrets():
    """Carrega segredos mascarados do cofre local sem vazar no chat."""
    secrets = {}
    if SECRETS_FILE.exists():
        with open(SECRETS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    secrets[k.strip()] = v.strip()
    return secrets

@mcp.tool()
def sheets_create_supplier_matrix(title: str = "V8 Cockpit - Matriz Nacional de Fornecedores 2026", headers: list[str] = None) -> str:
    """
    Cria uma nova planilha de fornecedores no Google Sheets.
    Retorna o JSON com o ID e URL da planilha gerada.
    """
    if headers is None:
        headers = [
            "ID",
            "Razão Social / Fornecedor",
            "CNPJ",
            "Categoria",
            "Estado (UF)",
            "Status Homologação",
            "Score BOA",
            "Contato Principal"
        ]

    secrets = load_env_secrets()
    api_key = secrets.get("key") or os.getenv("GOOGLE_SHEETS_API_KEY")

    payload = {
        "properties": {"title": title},
        "sheets": [
            {
                "properties": {
                    "title": "Fornecedores Homologados",
                    "gridProperties": {"frozenRowCount": 1}
                },
                "data": [
                    {
                        "startRow": 0,
                        "startColumn": 0,
                        "rowData": [
                            {
                                "values": [{"userEnteredValue": {"stringValue": h}} for h in headers]
                            }
                        ]
                    }
                ]
            }
        ]
    }

    url = "https://sheets.googleapis.com/v4/spreadsheets"
    if api_key:
        url += f"?key={api_key}"

    headers_dict = {"Content-Type": "application/json"}
    auth_token = os.getenv("GOOGLE_OAUTH_TOKEN")
    if auth_token:
        headers_dict["Authorization"] = f"Bearer {auth_token}"

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers_dict, method="POST")

    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            return json.dumps({
                "status": "SUCCESS",
                "spreadsheetId": res_data.get("spreadsheetId"),
                "spreadsheetUrl": res_data.get("spreadsheetUrl"),
                "sheets": [s["properties"]["title"] for s in res_data.get("sheets", [])]
            }, ensure_ascii=False)
    except Exception as e:
        return json.dumps({
            "status": "ERROR",
            "message": str(e),
            "hint": "Verifique a chave da API do Google Sheets ou autenticação OAuth em .secrets/.evn.GOOGLE-SHEETS"
        }, ensure_ascii=False)

@mcp.tool()
def sheets_append_suppliers(spreadsheet_id: str, range_name: str = "Fornecedores Homologados!A1", rows: list[list[str]] = None) -> str:
    """
    Adiciona novas linhas de fornecedores a uma planilha existente no Google Sheets.
    """
    if not rows:
        return json.dumps({"status": "ERROR", "message": "Nenhuma linha fornecida."})

    secrets = load_env_secrets()
    api_key = secrets.get("key") or os.getenv("GOOGLE_SHEETS_API_KEY")

    payload = {
        "range": range_name,
        "majorDimension": "ROWS",
        "values": rows
    }

    encoded_range = urllib.parse.quote(range_name)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_range}:append?valueInputOption=USER_ENTERED"
    if api_key:
        url += f"&key={api_key}"

    headers_dict = {"Content-Type": "application/json"}
    auth_token = os.getenv("GOOGLE_OAUTH_TOKEN")
    if auth_token:
        headers_dict["Authorization"] = f"Bearer {auth_token}"

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers_dict, method="POST")

    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            return json.dumps({
                "status": "SUCCESS",
                "updatedRange": res_data.get("updates", {}).get("updatedRange"),
                "updatedRows": res_data.get("updates", {}).get("updatedRows")
            }, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

@mcp.tool()
def sheets_read_rows(spreadsheet_id: str, range_name: str = "Fornecedores Homologados!A1:H100") -> str:
    """
    Lê linhas registradas em uma planilha do Google Sheets.
    """
    secrets = load_env_secrets()
    api_key = secrets.get("key") or os.getenv("GOOGLE_SHEETS_API_KEY")

    encoded_range = urllib.parse.quote(range_name)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_range}"
    if api_key:
        url += f"?key={api_key}"

    headers_dict = {}
    auth_token = os.getenv("GOOGLE_OAUTH_TOKEN")
    if auth_token:
        headers_dict["Authorization"] = f"Bearer {auth_token}"

    req = urllib.request.Request(url, headers=headers_dict, method="GET")

    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            return json.dumps({
                "status": "SUCCESS",
                "values": res_data.get("values", [])
            }, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

if __name__ == "__main__":
    mcp.run()
