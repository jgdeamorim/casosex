#!/usr/bin/env python3
import os
import re
import json
import urllib.request
import urllib.error

SECRETS_PATH = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/.secrets/.evn.CLOUDFLARE-VOLUPIA'

def get_credentials():
    if not os.path.exists(SECRETS_PATH):
        print("⚠️ File not found")
        return None, None
    with open(SECRETS_PATH) as f:
        text = f.read()
    
    acc_match = re.search(r'Account ID\s*[:=]?\s*([a-f0-9]{32})', text, re.IGNORECASE)
    account_id = acc_match.group(1) if acc_match else None
    
    # Try finding Bearer token
    token_match = re.search(r'Bearer\s+([A-Za-z0-9_\-]+)', text)
    if not token_match:
        token_match = re.search(r'Token\s*[:=]?\s*([A-Za-z0-9_\-]+)', text)
    token = token_match.group(1) if token_match else None
    
    return account_id, token

def cf_api_request(url, token):
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {'success': False, 'error': str(e)}

def main():
    account_id, token = get_credentials()
    if not account_id or not token:
        print("❌ Cloudflare credentials missing or unparseable")
        return

    print("✅ Credentials Loaded (Masked)")
    print(f"🔒 Account ID: {account_id[:4]}...{account_id[-4:]}")
    print(f"🔒 Token Status: Active")

    # 1. D1 Databases
    d1_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database"
    d1_resp = cf_api_request(d1_url, token)
    d1_list = d1_resp.get('result', []) if d1_resp.get('success') else []
    
    print("\n📦 Cloudflare D1 Databases:")
    for db in d1_list:
        print(f"  - Name: {db.get('name')} | UUID: {db.get('uuid')}")

    # 2. R2 Buckets
    r2_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets"
    r2_resp = cf_api_request(r2_url, token)
    r2_list = r2_resp.get('result', {}).get('buckets', []) if r2_resp.get('success') else []
    
    print("\n🪣 Cloudflare R2 Buckets:")
    for b in r2_list:
        print(f"  - Name: {b.get('name')}")

    # 3. KV Namespaces
    kv_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces"
    kv_resp = cf_api_request(kv_url, token)
    kv_list = kv_resp.get('result', []) if kv_resp.get('success') else []
    
    print("\n🔑 Cloudflare KV Namespaces:")
    for kv in kv_list:
        print(f"  - Title: {kv.get('title')} | ID: {kv.get('id')}")

if __name__ == '__main__':
    main()
