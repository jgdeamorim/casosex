#!/usr/bin/env python3
import os
import re
import json
import urllib.request
import urllib.error

SECRETS_PATH = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/.secrets/.evn.CLOUDFLARE-VOLUPIA'

def get_credentials():
    with open(SECRETS_PATH) as f:
        text = f.read()
    acc_match = re.search(r'Account ID\s*[:=]?\s*([a-f0-9]{32})', text, re.IGNORECASE)
    account_id = acc_match.group(1) if acc_match else None
    token_match = re.search(r'Bearer\s+([A-Za-z0-9_\-]+)', text) or re.search(r'Token\s*[:=]?\s*([A-Za-z0-9_\-]+)', text)
    token = token_match.group(1) if token_match else None
    return account_id, token

def query_d1(account_id, token, db_id, sql_query):
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{db_id}/query"
    body = json.dumps({"sql": sql_query}).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {'success': False, 'error': str(e)}

SCHEMAS = [
    """
    CREATE TABLE IF NOT EXISTS volupia_flows (
        id TEXT PRIMARY KEY,
        folder_id TEXT DEFAULT '00000000-0000-0000-0000-000000000001',
        name TEXT NOT NULL,
        description TEXT,
        data TEXT,
        is_component INTEGER DEFAULT 0,
        tags TEXT,
        updated_at TEXT
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS volupia_projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        parent_id TEXT,
        components TEXT,
        created_at TEXT,
        updated_at TEXT
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS volupia_variables (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        value TEXT,
        type TEXT,
        created_at TEXT
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS volupia_memories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        flow_id TEXT,
        user_id TEXT,
        threshold REAL DEFAULT 1.0,
        auto_capture INTEGER DEFAULT 1,
        created_at TEXT
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS volupia_telemetry (
        id TEXT PRIMARY KEY,
        stage TEXT,
        boa_score REAL,
        commit_count INTEGER,
        timestamp TEXT
    );
    """
]

def main():
    account_id, token = get_credentials()
    db_id = "a7e5672c-8eb6-4871-a60b-17541e2da457" # volupia-db
    
    print("🚀 Initializing D1 Volúpia Engine Schemas...")
    for sql in SCHEMAS:
        resp = query_d1(account_id, token, db_id, sql)
        if resp.get('success'):
            print("  ✅ Query executed successfully")
        else:
            print("  ❌ Query error:", resp.get('error'))

    print("\n🔍 Verifying updated table list...")
    resp = query_d1(account_id, token, db_id, "SELECT name FROM sqlite_master WHERE type='table';")
    if resp.get('success'):
        results = resp.get('result', [{}])[0].get('results', [])
        tables = [r.get('name') for r in results if r.get('name') and not r.get('name').startswith('_')]
        print(f"📊 Total Tables in volupia-db D1 ({len(tables)}):")
        for t in tables:
            print(f"  - {t}")

if __name__ == '__main__':
    main()
