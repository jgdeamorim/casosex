// Servidor Backend Soberano Nativo - Engine Omie ERP (Porta :7070)
// 100% Zero-Dependency (node:http + node:sqlite em WAL Mode)
import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const PORT = 7070;
const dbPath = path.join(process.cwd(), 'wp', 'omie', 'db', 'omie_sovereign.db');
const db = new DatabaseSync(dbPath);

db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
`);

function sendJSON(res, data, statusCode = 200) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Health check
    if (pathname === '/health') {
        return sendJSON(res, { status: 'ONLINE', engine: 'Omie Sovereign Engine :7070', mode: 'Zero-Dependency Native' });
    }

    // 1. Multi-Tenant Workspaces (meus-aplicativos)
    if (pathname === '/api/v1/portal/workspaces') {
        const stmt = db.prepare('SELECT tenant_id, app_hash, name, cnpj, active FROM portal_workspaces WHERE active = 1');
        const workspaces = stmt.all();
        return sendJSON(res, { status: 'OK', workspaces });
    }

    // 2. DBFast v5 Read-Replica Grid Endpoint
    if (pathname.includes('/get/grid')) {
        const parts = pathname.split('/');
        const tenantId = parts[3] || '57997882-gh28f5at';
        const dialogId = parts[4] || '';
        
        let table = 'vpr_produtos';
        if (dialogId.includes('SFA') || dialogId.includes('CRM')) table = 'sfa_clientes';
        if (dialogId.includes('VEN')) table = 'ven_pedidos';
        if (dialogId.includes('COM')) table = 'com_pedidos';
        if (dialogId.includes('FIN')) table = 'fin_titulos';
        if (dialogId.includes('CTB')) table = 'ctb_dre';

        try {
            const rows = db.prepare(`SELECT * FROM ${table} WHERE tenant_id = ?`).all(tenantId);
            return sendJSON(res, { status: 'SUCCESS', total: rows.length, rows });
        } catch (e) {
            return sendJSON(res, { status: 'SUCCESS', total: 0, rows: [], error: e.message });
        }
    }

    // 3. JSON-RPC Generic Dispatcher para os 6 Módulos Canônicos
    if (pathname.startsWith('/api/v1/') && req.method === 'POST') {
        let body = {};
        try {
            const buffers = [];
            for await (const chunk of req) buffers.push(chunk);
            body = JSON.parse(Buffer.concat(buffers).toString() || '{}');
        } catch (e) {
            void e;
        }

        const parts = pathname.split('/').filter(Boolean);
        const cat = parts[2] || 'geral';
        const srv = parts[3] || '';
        const tenantId = body.tenant_id || '57997882-gh28f5at';

        if (cat === 'crm') {
            const rows = db.prepare('SELECT * FROM sfa_clientes WHERE tenant_id = ?').all(tenantId);
            return sendJSON(res, { pagina: 1, total_de_paginas: 1, registros: rows.length, total_de_registros: rows.length, clientes_cadastro: rows });
        }

        if (cat === 'produtos') {
            const rows = db.prepare('SELECT * FROM vpr_produtos WHERE tenant_id = ?').all(tenantId);
            return sendJSON(res, { pagina: 1, total_de_paginas: 1, registros: rows.length, total_de_registros: rows.length, produto_servico_cadastro: rows });
        }

        if (cat === 'vendas') {
            const rows = db.prepare('SELECT * FROM ven_pedidos WHERE tenant_id = ?').all(tenantId);
            return sendJSON(res, { pagina: 1, total_de_paginas: 1, registros: rows.length, total_de_registros: rows.length, pedido_venda_produto: rows });
        }

        if (cat === 'compras') {
            const rows = db.prepare('SELECT * FROM com_pedidos WHERE tenant_id = ?').all(tenantId);
            return sendJSON(res, { pagina: 1, total_de_paginas: 1, registros: rows.length, total_de_registros: rows.length, pedidos_compra: rows });
        }

        if (cat === 'financas') {
            const rows = db.prepare('SELECT * FROM fin_titulos WHERE tenant_id = ?').all(tenantId);
            return sendJSON(res, { pagina: 1, total_de_paginas: 1, registros: rows.length, total_de_registros: rows.length, titulos: rows });
        }

        if (cat === 'geral' || cat === 'contabilidade') {
            const rows = db.prepare('SELECT * FROM ctb_dre WHERE tenant_id = ?').all(tenantId);
            return sendJSON(res, { pagina: 1, total_de_paginas: 1, registros: rows.length, total_de_registros: rows.length, dre: rows });
        }

        return sendJSON(res, { status: 'OK', message: `Engine Soberana Executada: ${cat}/${srv}` });
    }

    return sendJSON(res, { error: 'Rota não encontrada na Engine Soberana' }, 404);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Engine Omie ERP Soberana ON na porta :${PORT} (http://localhost:${PORT})`);
});
