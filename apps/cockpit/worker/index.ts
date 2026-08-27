import { Hono } from 'hono';

interface D1Result {
  results?: Record<string, unknown>[];
  success: boolean;
  error?: string;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all(): Promise<D1Result>;
  first(): Promise<Record<string, unknown> | null>;
  run(): Promise<{ success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  ASSETS?: { fetch: (req: Request) => Promise<Response> };
  DB?: D1Database;
}

type Status = 'HOMOLOGADO' | 'VISITA_PENDENTE' | 'PROSPECCAO' | 'REJEITADO';

const VALID_STATUSES: Status[] = ['HOMOLOGADO', 'VISITA_PENDENTE', 'PROSPECCAO', 'REJEITADO'];

const app = new Hono<{ Bindings: Env }>();

app.get('/api/v8/health', (c) => {
  return c.json({
    status: 'online',
    engine: 'Cloudflare Worker V8',
    timestamp: new Date().toISOString()
  });
});

// Todos os overrides de status persistidos (deltas sobre suppliers.json).
app.get('/api/v8/status', async (c) => {
  const db = c.env?.DB;
  if (!db) return c.json({ overrides: [] });

  const res = await db.prepare('SELECT supplier_id, status, updated_by, updated_at FROM supplier_status').all();
  const overrides = (res.results ?? []).map(r => ({
    supplierId: r.supplier_id,
    status: r.status,
    updatedBy: r.updated_by,
    updatedAt: r.updated_at
  }));
  return c.json({ overrides });
});

// Write-through de status (otimista no cliente, upsert no D1).
app.patch('/api/v8/suppliers/:id/status', async (c) => {
  const db = c.env?.DB;
  if (!db) return c.json({ error: 'D1 não configurado' }, 500);

  const supplierId = c.req.param('id');
  const body = (await c.req.json().catch(() => null)) as { status?: Status; updatedBy?: string } | null;
  if (!body || !body.status || !VALID_STATUSES.includes(body.status)) {
    return c.json({ error: 'status inválido' }, 400);
  }

  await db
    .prepare(
      `INSERT INTO supplier_status (supplier_id, status, updated_by, updated_at)
       VALUES (?, ?, ?, strftime('%s','now'))
       ON CONFLICT(supplier_id) DO UPDATE SET
         status = excluded.status,
         updated_by = excluded.updated_by,
         updated_at = strftime('%s','now')`
    )
    .bind(supplierId, body.status, body.updatedBy ?? 'demo')
    .run();

  return c.json({ ok: true, supplierId, status: body.status });
});

function rowToDossier(r: Record<string, unknown>) {
  return {
    supplierId: r.supplier_id as string,
    supplierName: (r.supplier_name as string) ?? '',
    status: ((r.status as Status) ?? 'VISITA_PENDENTE') as Status,
    qualityScore: r.quality_score == null ? null : Number(r.quality_score),
    anvisaBodySafe: Number(r.anvisa_body_safe) === 1,
    moq: (r.moq as string) ?? '',
    paymentTerms: (r.payment_terms as string) ?? '',
    catalogUrl: (r.catalog_url as string) || undefined,
    catalogFileName: (r.catalog_file_name as string) || undefined,
    auditNotes: (r.audit_notes as string) ?? '',
    auditorName: (r.auditor_name as string) ?? '',
    updatedAt: r.updated_at
      ? new Date(Number(r.updated_at) * 1000).toISOString()
      : new Date().toISOString()
  };
}

app.get('/api/v8/dossier/:id', async (c) => {
  const db = c.env?.DB;
  if (!db) return c.json({ error: 'D1 não configurado' }, 500);

  const supplierId = c.req.param('id');
  const row = await db.prepare('SELECT * FROM dossiers WHERE supplier_id = ?').bind(supplierId).first();
  if (!row) return c.json({ error: 'dossier não encontrado' }, 404);

  return c.json({ dossier: rowToDossier(row) });
});

app.put('/api/v8/dossier/:id', async (c) => {
  const db = c.env?.DB;
  if (!db) return c.json({ error: 'D1 não configurado' }, 500);

  const supplierId = c.req.param('id');
  const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') return c.json({ error: 'corpo inválido' }, 400);

  const status = body.status as Status;
  if (!VALID_STATUSES.includes(status)) return c.json({ error: 'status inválido' }, 400);

  await db
    .prepare(
      `INSERT INTO dossiers (
         supplier_id, supplier_name, status, quality_score, anvisa_body_safe,
         moq, payment_terms, catalog_url, catalog_file_name, audit_notes, auditor_name, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s','now'))
       ON CONFLICT(supplier_id) DO UPDATE SET
         supplier_name = excluded.supplier_name,
         status = excluded.status,
         quality_score = excluded.quality_score,
         anvisa_body_safe = excluded.anvisa_body_safe,
         moq = excluded.moq,
         payment_terms = excluded.payment_terms,
         catalog_url = excluded.catalog_url,
         catalog_file_name = excluded.catalog_file_name,
         audit_notes = excluded.audit_notes,
         auditor_name = excluded.auditor_name,
         updated_at = strftime('%s','now')`
    )
    .bind(
      supplierId,
      String(body.supplierName ?? ''),
      status,
      body.qualityScore == null ? null : Number(body.qualityScore),
      body.anvisaBodySafe ? 1 : 0,
      String(body.moq ?? ''),
      String(body.paymentTerms ?? ''),
      body.catalogUrl ? String(body.catalogUrl) : null,
      body.catalogFileName ? String(body.catalogFileName) : null,
      String(body.auditNotes ?? ''),
      String(body.auditorName ?? '')
    )
    .run();

  const row = await db.prepare('SELECT * FROM dossiers WHERE supplier_id = ?').bind(supplierId).first();
  return c.json({ ok: true, dossier: rowToDossier(row ?? {}) });
});

// SPA fallback + assets estáticos. O proxy WooCommerce e a injeção HTMLRewriter
// morta foram removidos (o proxy 401 sem creds; a injeção não era lida pelo app).
app.all('*', async (c) => {
  if (c.env?.ASSETS) {
    try {
      const res = await c.env.ASSETS.fetch(c.req.raw);
      if (res.status !== 404) {
        return res;
      }
    } catch (e: unknown) {
      void e;
    }
    const indexUrl = new URL('/index.html', c.req.url);
    return c.env.ASSETS.fetch(new Request(indexUrl.toString(), { method: c.req.method }));
  }
  return c.text('Not Found', 404);
});

export default app;
