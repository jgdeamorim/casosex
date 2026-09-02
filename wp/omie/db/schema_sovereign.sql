-- DDL Schema: Engine Omie ERP Soberana (SQLite WAL Mode)
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;

-- 1. Portal Workspaces / Multi-Tenant
CREATE TABLE IF NOT EXISTS portal_workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL UNIQUE,
    app_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Módulo #SFA: CRM & Oportunidades
CREATE TABLE IF NOT EXISTS sfa_clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_cliente_omie INTEGER UNIQUE,
    razao_social TEXT NOT NULL,
    cnpj_cpf TEXT,
    email TEXT,
    telefone TEXT,
    etapa TEXT DEFAULT 'Lead',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sfa_tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_tarefa_omie INTEGER UNIQUE,
    titulo TEXT NOT NULL,
    data TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- 3. Módulo #VPR: Produtos & Estoque
CREATE TABLE IF NOT EXISTS vpr_produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_produto_omie INTEGER UNIQUE,
    codigo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    valor_unitario REAL DEFAULT 0.0,
    estoque REAL DEFAULT 0.0
);

-- 4. Módulo #VEN: Vendas & Faturamento (NF-e)
CREATE TABLE IF NOT EXISTS ven_pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_pedido_omie INTEGER UNIQUE,
    numero_pedido TEXT NOT NULL,
    cliente TEXT NOT NULL,
    valor_total REAL DEFAULT 0.0,
    etapa TEXT DEFAULT 'Faturado',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Módulo #COM: Compras & Fornecedores
CREATE TABLE IF NOT EXISTS com_pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_compras_omie INTEGER UNIQUE,
    numero_pedido TEXT NOT NULL,
    fornecedor TEXT NOT NULL,
    valor_total REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Módulo #FIN: Finanças & Caixa
CREATE TABLE IF NOT EXISTS fin_titulos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    codigo_titulo_omie INTEGER UNIQUE,
    tipo TEXT CHECK(tipo IN ('PAGAR', 'RECEBER')),
    categoria TEXT NOT NULL,
    valor REAL DEFAULT 0.0,
    data_vencimento TEXT,
    status TEXT DEFAULT 'Aberto'
);

-- 7. Módulo #CTB: Contabilidade & DRE
CREATE TABLE IF NOT EXISTS ctb_dre (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    mes_ano TEXT NOT NULL,
    receita_bruta REAL DEFAULT 0.0,
    custos REAL DEFAULT 0.0,
    lucro_liquido REAL DEFAULT 0.0
);
