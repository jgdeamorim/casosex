-- Volúpia B2B Sovereign D1 Database Schema
-- Domain: usevolupia.com.br

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS volupia_admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- SUPER_ADMIN, OPERATIONS_AUDITOR, COMMERCIAL_MANAGER
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial admin users
INSERT OR IGNORE INTO volupia_admin_users (id, email, name, role) VALUES 
('usr_jeferson', 'jeferson@usevolupia.com.br', 'Jeferson Amorim', 'SUPER_ADMIN'),
('usr_glaucia', 'glaucia@usevolupia.com.br', 'Gláucia Michaella', 'OPERATIONS_AUDITOR'),
('usr_bruno', 'bruno@usevolupia.com.br', 'Bruno Amin', 'COMMERCIAL_MANAGER');

-- 2. Suppliers Table (Mined from Supabase discovery_listings)
CREATE TABLE IF NOT EXISTS volupia_suppliers (
    id TEXT PRIMARY KEY,
    place_id TEXT UNIQUE,
    name TEXT NOT NULL,
    trade_name TEXT,
    cnpj TEXT,
    category TEXT NOT NULL, -- Fabricante, Atacadista, Distribuidor
    subcategory TEXT, -- Cosméticos Eróticos, Lingerie, Acessórios, Protetores Body-Safe
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude REAL,
    longitude REAL,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    gmb_url TEXT,
    rating REAL DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PROSPECCAO', -- PROSPECCAO, VISITA_AGENDADA, EM_HOMOLOGACAO, HOMOLOGADO, REJEITADO
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Supplier Homologations & Visits Table (Gláucia Michaella)
CREATE TABLE IF NOT EXISTS volupia_supplier_homologations (
    id TEXT PRIMARY KEY,
    supplier_id TEXT REFERENCES volupia_suppliers(id),
    auditor_email TEXT NOT NULL, -- glaucia@usevolupia.com.br
    visit_date DATETIME,
    quality_score INTEGER DEFAULT 5, -- 1 a 5 estrelas
    packaging_audit TEXT, -- Embalagem & Discrição
    body_safe_compliance INTEGER DEFAULT 1, -- 1 = Sim, 0 = Não
    factory_capacity_notes TEXT,
    moq_minimum_order REAL DEFAULT 0.0,
    payment_terms TEXT, -- ex: 30/60/90 dias ou PIX Faturado
    catalog_url TEXT, -- Link direto para catálogo
    catalog_filename TEXT,
    approval_status TEXT DEFAULT 'PENDING',
    auditor_comments TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Commerce-Lite Internal Team Chat Messages
CREATE TABLE IF NOT EXISTS volupia_chat_messages (
    id TEXT PRIMARY KEY,
    channel TEXT NOT NULL, -- #geral, #homologacao-glaucia, #negociacao-bruno
    author_email TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    supplier_id_ref TEXT, -- Referência opcional a fornecedor
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
