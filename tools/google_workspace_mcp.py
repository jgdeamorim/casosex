#!/usr/bin/env python3
"""
Google Workspace Sovereign MCP Server — Antigravity Edition (ADR-0201)
Suporte soberano à criação e manipulação da Matriz Nacional de Fornecedores via Google Sheets REST API & OAuth 2.0.
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

def save_env_secret(key: str, value: str):
    """Salva uma nova chave/token no arquivo de segredos local."""
    secrets = load_env_secrets()
    secrets[key] = value
    with open(SECRETS_FILE, "w", encoding="utf-8") as f:
        for k, v in secrets.items():
            f.write(f"{k}={v}\n")

def get_valid_access_token():
    """Obtém um access_token válido usando o refresh_token se disponível."""
    secrets = load_env_secrets()
    token = secrets.get("GOOGLE_OAUTH_TOKEN") or os.getenv("GOOGLE_OAUTH_TOKEN")
    refresh_token = secrets.get("GOOGLE_REFRESH_TOKEN") or os.getenv("GOOGLE_REFRESH_TOKEN")
    client_id = secrets.get("GOOGLE_CLIENT_ID") or os.getenv("GOOGLE_CLIENT_ID")
    client_secret = secrets.get("GOOGLE_CLIENT_SECRET") or os.getenv("GOOGLE_CLIENT_SECRET")

    if token:
        return token

    if refresh_token and client_id and client_secret:
        url = "https://oauth2.googleapis.com/token"
        payload = urllib.parse.urlencode({
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"
        }).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                new_token = data.get("access_token")
                if new_token:
                    save_env_secret("GOOGLE_OAUTH_TOKEN", new_token)
                    return new_token
        except Exception as e:
            print("Erro ao renovar token com refresh_token:", e)

    return None

@mcp.tool()
def google_auth_get_login_url(redirect_uri: str = "http://localhost:3000/api/auth/google/callback") -> str:
    """
    Gera o link de autorização OAuth 2.0 do Google para o operador fazer login no navegador.
    """
    secrets = load_env_secrets()
    client_id = secrets.get("GOOGLE_CLIENT_ID")
    if not client_id:
        return json.dumps({"status": "ERROR", "message": "GOOGLE_CLIENT_ID não configurado em .secrets/.evn.GOOGLE-SHEETS"})

    scopes = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file"
    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": scopes,
        "access_type": "offline",
        "prompt": "consent"
    }
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
    return json.dumps({
        "status": "SUCCESS",
        "auth_url": url,
        "instruction": "Abra a auth_url no navegador, autorize a aplicação e copie o código retornado no callback."
    }, ensure_ascii=False)

@mcp.tool()
def google_auth_exchange_code(code: str, redirect_uri: str = "http://localhost:3000/api/auth/google/callback") -> str:
    """
    Troca o código de autorização OAuth 2.0 retornado pelo Google pelos tokens de acesso e os salva em .secrets/.evn.GOOGLE-SHEETS.
    """
    secrets = load_env_secrets()
    client_id = secrets.get("GOOGLE_CLIENT_ID")
    client_secret = secrets.get("GOOGLE_CLIENT_SECRET")

    if not client_id or not client_secret:
        return json.dumps({"status": "ERROR", "message": "Credenciais de OAuth (Client ID / Secret) ausentes."})

    url = "https://oauth2.googleapis.com/token"
    payload = urllib.parse.urlencode({
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            access_token = data.get("access_token")
            refresh_token = data.get("refresh_token")

            if access_token:
                save_env_secret("GOOGLE_OAUTH_TOKEN", access_token)
            if refresh_token:
                save_env_secret("GOOGLE_REFRESH_TOKEN", refresh_token)

            return json.dumps({
                "status": "SUCCESS",
                "message": "Tokens OAuth salvos com sucesso no cofre local .secrets/.evn.GOOGLE-SHEETS!",
                "has_access_token": bool(access_token),
                "has_refresh_token": bool(refresh_token)
            }, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)}, ensure_ascii=False)

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
    api_key = secrets.get("GOOGLE_SHEETS_API_KEY") or secrets.get("key")
    access_token = get_valid_access_token()

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
    headers_dict = {"Content-Type": "application/json"}

    if access_token:
        headers_dict["Authorization"] = f"Bearer {access_token}"
    elif api_key:
        url += f"?key={api_key}"

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
            "hint": "Para criar arquivos no Google Drive, obtenha o token OAuth executando a ferramenta google_auth_get_login_url."
        }, ensure_ascii=False)

@mcp.tool()
def sheets_append_suppliers(spreadsheet_id: str, range_name: str = "Fornecedores Homologados!A1", rows: list[list[str]] = None) -> str:
    """
    Adiciona novas linhas de fornecedores a uma planilha existente no Google Sheets.
    """
    if not rows:
        return json.dumps({"status": "ERROR", "message": "Nenhuma linha fornecida."})

    secrets = load_env_secrets()
    api_key = secrets.get("GOOGLE_SHEETS_API_KEY") or secrets.get("key")
    access_token = get_valid_access_token()

    payload = {
        "range": range_name,
        "majorDimension": "ROWS",
        "values": rows
    }

    encoded_range = urllib.parse.quote(range_name)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_range}:append?valueInputOption=USER_ENTERED"

    headers_dict = {"Content-Type": "application/json"}
    if access_token:
        headers_dict["Authorization"] = f"Bearer {access_token}"
    elif api_key:
        url += f"&key={api_key}"

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
    api_key = secrets.get("GOOGLE_SHEETS_API_KEY") or secrets.get("key")
    access_token = get_valid_access_token()

    encoded_range = urllib.parse.quote(range_name)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{encoded_range}"

    headers_dict = {}
    if access_token:
        headers_dict["Authorization"] = f"Bearer {access_token}"
    elif api_key:
        url += f"?key={api_key}"

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
