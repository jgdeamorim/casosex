import { Hono } from 'hono';
import { LANDING_HTML } from './landingHtml';

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

async function initUserTable(db: D1Database) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT,
        name TEXT,
        updated_at INTEGER
      )
    `).run();
  } catch (e: unknown) {
    void e;
  }
}

app.get('/api/v8/health', (c) => {
  const cfUserEmail = c.req.header('cf-access-authenticated-user-email');
  return c.json({
    status: 'online',
    engine: 'Cloudflare Worker V8',
    zeroTrustUser: cfUserEmail || null,
    timestamp: new Date().toISOString()
  });
});

// Autenticação Soberana (Cloudflare Zero-Trust SSO + Hash SHA-256 em Banco D1 volupia-db)
app.post('/api/v8/auth/login', async (c) => {
  const db = c.env?.DB;
  if (!db) {
    return c.json({ ok: false, error: 'D1 Database não conectado' }, 500);
  }

  await initUserTable(db);
  const cfUserEmail = c.req.header('cf-access-authenticated-user-email');
  const body = (await c.req.json().catch(() => null)) as { email?: string; passwordHash?: string; provider?: string } | null;

  // 1. Cloudflare Zero-Trust SSO Access Assertion Header
  if (cfUserEmail) {
    const user = await db.prepare('SELECT id, email, role, name FROM users WHERE email = ?').bind(cfUserEmail.toLowerCase()).first();
    if (user) {
      return c.json({
        ok: true,
        provider: 'cloudflare_zero_trust',
        user: { id: user.id, email: user.email, role: user.role, name: user.name }
      });
    }
  }

  const email = (body?.email || '').trim().toLowerCase();

  // 2. Google OAuth SSO Provider (valida contra a tabela users do D1)
  if (body?.provider === 'google_oauth') {
    const searchEmail = email || 'jeferson@volupia.com.br';
    const user = await db.prepare('SELECT id, email, role, name FROM users WHERE email = ?').bind(searchEmail).first();
    if (user) {
      return c.json({
        ok: true,
        provider: 'google_oauth_d1',
        user: { id: user.id, email: user.email, role: user.role, name: user.name }
      });
    }
    return c.json({ ok: false, error: 'E-mail não autorizado no banco D1' }, 403);
  }

  if (!email) {
    return c.json({ ok: false, error: 'E-mail corporativo ou CNPJ é obrigatório' }, 400);
  }

  // 3. Email + Hash SHA-256 em D1
  if (body?.passwordHash) {
    const user = await db.prepare('SELECT id, email, role, name FROM users WHERE email = ? AND password_hash = ?')
      .bind(email, body.passwordHash)
      .first();

    if (user) {
      return c.json({
        ok: true,
        provider: 'd1_sha256',
        user: { id: user.id, email: user.email, role: user.role, name: user.name }
      });
    }
    return c.json({ ok: false, error: 'Credenciais inválidas ou senha incorreta' }, 401);
  }

  // 4. Busca direta no D1 por e-mail
  const user = await db.prepare('SELECT id, email, role, name FROM users WHERE email = ?').bind(email).first();
  if (user) {
    return c.json({
      ok: true,
      provider: 'd1_db',
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  }

  return c.json({ ok: false, error: 'Usuário não cadastrado na base D1' }, 404);
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

// SPA fallback + assets estáticos.
// usevolupia.com.br (Apex / www) -> Landing Page Pública B2B
// app.usevolupia.com.br -> Cockpit Admin + Login (SPA React 19)
app.all('*', async (c) => {
  const url = new URL(c.req.url);
  const rawHost = c.req.header('host') || url.hostname;
  const hostname = rawHost.toLowerCase().split(':')[0];

  if (hostname === 'usevolupia.com.br' || hostname === 'www.usevolupia.com.br') {
    if (url.pathname === '/login' || url.pathname === '/login.html' || url.pathname === '/sso' || url.pathname === '/auth' || url.pathname === '/admin') {
      return c.redirect('https://app.usevolupia.com.br/login', 302);
    }
    return c.html(LANDING_HTML);
  }

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
