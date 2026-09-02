-- DDL SQL Schema Soberano Omie ERP (CASOSEX)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS portal_workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT UNIQUE NOT NULL,
    app_hash TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sfa_clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_cliente_omie INTEGER UNIQUE NOT NULL,
    codigo_cliente_integracao TEXT UNIQUE,
    razao_social TEXT NOT NULL,
    nome_fantasia TEXT,
    cnpj_cpf TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    etapa TEXT DEFAULT 'LEAD',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vpr_produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_produto_omie INTEGER UNIQUE NOT NULL,
    codigo TEXT UNIQUE NOT NULL,
    descricao TEXT NOT NULL,
    valor_unitario REAL NOT NULL,
    estoque REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ven_pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_pedido_omie INTEGER UNIQUE NOT NULL,
    numero_pedido TEXT NOT NULL,
    codigo_cliente INTEGER NOT NULL,
    cliente TEXT NOT NULL,
    valor_total REAL NOT NULL,
    etapa TEXT DEFAULT 'PROPOSTA',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS com_pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_pedido_omie INTEGER UNIQUE NOT NULL,
    numero_pedido TEXT NOT NULL,
    fornecedor TEXT NOT NULL,
    valor_total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fin_titulos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_lancamento_omie INTEGER UNIQUE NOT NULL,
    tipo TEXT NOT NULL, -- 'RECEBER' ou 'PAGAR'
    categoria TEXT NOT NULL,
    valor REAL NOT NULL,
    data_vencimento TEXT NOT NULL,
    status TEXT DEFAULT 'A_VENCER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ctb_dre (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    mes_referencia TEXT NOT NULL,
    receita_bruta REAL DEFAULT 0,
    deducoes REAL DEFAULT 0,
    receita_liquida REAL DEFAULT 0,
    custos REAL DEFAULT 0,
    lucro_bruto REAL DEFAULT 0,
    despesas_operacionais REAL DEFAULT 0,
    lucro_liquido REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
