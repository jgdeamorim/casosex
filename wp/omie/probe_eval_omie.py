#!/usr/bin/env python3
"""
Omie API Integration Probe & Eval for CASOSEX
Validate endpoints, authentication, schemas, and connectivity.
"""

import os
import sys
import json
import urllib.request
from typing import Dict, Any

ENV_FILE = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/.env.OMIE'

def load_credentials(path: str) -> Dict[str, str]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Arquivo de credenciais não encontrado: {path}")
    
    creds = {}
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if 'App Key:' in line:
                creds['app_key'] = line.split('App Key:')[1].strip()
            elif 'App Secret:' in line:
                creds['app_secret'] = line.split('App Secret:')[1].strip()
            elif 'APP:' in line:
                creds['app_name'] = line.split('APP:')[1].strip()
    return creds

def call_omie_api(url: str, call_name: str, param: Dict[str, Any], app_key: str, app_secret: str) -> Dict[str, Any]:
    payload = {
        "call": call_name,
        "app_key": app_key,
        "app_secret": app_secret,
        "param": [param]
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {"status": "error", "message": str(e)}

def run_probe_eval():
    print("🚀 [PROBE OMIE] Iniciando Probe & Eval de Integração Omie ERP...")
    creds = load_credentials(ENV_FILE)
    print(f"🔑 Credenciais Carregadas: App={creds.get('app_name')} | Key={creds.get('app_key')[:4]}***")

    tests = [
        {"name": "Empresas", "url": "https://app.omie.com.br/api/v1/geral/empresas/", "call": "ListarEmpresas", "param": {"pagina": 1, "registros_por_pagina": 1}},
        {"name": "Clientes", "url": "https://app.omie.com.br/api/v1/geral/clientes/", "call": "ListarClientes", "param": {"pagina": 1, "registros_por_pagina": 1}},
        {"name": "Produtos", "url": "https://app.omie.com.br/api/v1/geral/produtos/", "call": "ListarProdutos", "param": {"pagina": 1, "registros_por_pagina": 1}},
        {"name": "Pedidos de Venda", "url": "https://app.omie.com.br/api/v1/produtos/pedido/", "call": "ListarPedidos", "param": {"pagina": 1, "registros_por_pagina": 1}},
        {"name": "Estoque", "url": "https://app.omie.com.br/api/v1/estoque/resumo/", "call": "ObterEstoqueResumo", "param": {"codigo_local_estoque": 0}},
    ]

    results = {}
    for t in tests:
        res = call_omie_api(t['url'], t['call'], t['param'], creds['app_key'], creds['app_secret'])
        success = "error" not in res and ("registros" in res or "empresas_cadastro" in res or "nCodigoLocal" in res or "total_de_registros" in res)
        results[t['name']] = {
            "status": "PASS" if success else "FAIL",
            "details": res
        }
        print(f"  [{'STATUS_OK' if success else 'STATUS_FAIL'}] Teste {t['name']}: {'Concluído com Sucesso' if success else res.get('message')}")

    probe_output = {
        "credentials_loaded": True,
        "app_name": creds.get('app_name'),
        "results": results
    }

    out_json = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/docs/probe_results.json'
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(probe_output, f, indent=2, ensure_ascii=False)

    print(f"\n📊 Resultados salvos em: {out_json}")

if __name__ == '__main__':
    run_probe_eval()
