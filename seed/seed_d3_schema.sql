-- ==============================================================================
-- Schema SQL D1 Database Seeding — FASE D3 (CASOSEX / Adsentice)
-- Idempotente & Compatível com SQLite / Cloudflare D1 Emulator
-- ==============================================================================

CREATE TABLE IF NOT EXISTS status_overrides (
    supplier_id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS homologation_dossiers (
    supplier_id TEXT PRIMARY KEY,
    supplier_name TEXT NOT NULL,
    quality_score REAL,
    anvisa_body_safe INTEGER NOT NULL DEFAULT 0,
    moq TEXT,
    payment_terms TEXT,
    catalog_url TEXT,
    catalog_file_name TEXT,
    audit_notes TEXT,
    status TEXT NOT NULL,
    auditor_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Dados de Exemplo para Teste Sandbox ($0)
INSERT INTO status_overrides (supplier_id, status, updated_by, updated_at)
VALUES ('sup_hot_01', 'HOMOLOGADO', 'Auditor Antigravity', 1787688000)
ON CONFLICT(supplier_id) DO UPDATE SET
    status = excluded.status,
    updated_at = excluded.updated_at;
