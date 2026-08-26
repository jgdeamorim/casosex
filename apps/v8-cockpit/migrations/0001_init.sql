-- Estado de trabalho do V8 Cockpit: somente DELTAS sobre o catálogo estático
-- (public/suppliers.json, 307 fornecedores). O catálogo base não é seedado em D1.

CREATE TABLE IF NOT EXISTS supplier_status (
  supplier_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('HOMOLOGADO','VISITA_PENDENTE','PROSPECCAO','REJEITADO')),
  updated_by TEXT NOT NULL DEFAULT 'demo',
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS dossiers (
  supplier_id TEXT PRIMARY KEY,
  supplier_name TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'VISITA_PENDENTE',
  quality_score INTEGER,
  anvisa_body_safe INTEGER NOT NULL DEFAULT 0,
  moq TEXT NOT NULL DEFAULT '',
  payment_terms TEXT NOT NULL DEFAULT '',
  catalog_url TEXT,
  catalog_file_name TEXT,
  audit_notes TEXT NOT NULL DEFAULT '',
  auditor_name TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
