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
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
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
        picture_url TEXT,
        google_id TEXT,
        locale TEXT,
        lgpd_consent_at INTEGER,
        created_at INTEGER,
        updated_at INTEGER
      )
    `).run();

    // Migrações idempotentes para garantir colunas em tabelas legadas
    try { await db.prepare('ALTER TABLE users ADD COLUMN picture_url TEXT').run(); } catch (e: unknown) { void e; }
    try { await db.prepare('ALTER TABLE users ADD COLUMN google_id TEXT').run(); } catch (e: unknown) { void e; }
    try { await db.prepare('ALTER TABLE users ADD COLUMN locale TEXT').run(); } catch (e: unknown) { void e; }
    try { await db.prepare('ALTER TABLE users ADD COLUMN lgpd_consent_at INTEGER').run(); } catch (e: unknown) { void e; }
    try { await db.prepare('ALTER TABLE users ADD COLUMN created_at INTEGER').run(); } catch (e: unknown) { void e; }
  } catch (e: unknown) {
    void e;
  }
}

async function initAuditLogsTable(db: D1Database) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        user_email TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at INTEGER NOT NULL
      )
    `).run();
  } catch (e: unknown) {
    void e;
  }
}

interface AuditLogEntry {
  userId?: string;
  userEmail: string;
  action: 'AUTH_LOGIN_GOOGLE' | 'AUTH_LOGIN_PASSWORD' | 'PROFILE_PICTURE_UPDATE' | 'PROFILE_NAME_UPDATE' | 'LGPD_CONSENT_GIVEN';
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

async function createAuditLog(db: D1Database, entry: AuditLogEntry) {
  try {
    await initAuditLogsTable(db);
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Math.floor(Date.now() / 1000);
    const detailsStr = entry.details ? JSON.stringify(entry.details) : null;

    await db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_email, action, details, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      entry.userId || null,
      entry.userEmail,
      entry.action,
      detailsStr,
      entry.ipAddress || null,
      entry.userAgent || null,
      now
    ).run();
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

// 1. Rota de Redirecionamento Inicial para o Google OAuth 2.0
app.get('/api/v8/auth/google/redirect', (c) => {
  const clientId = c.env?.GOOGLE_CLIENT_ID || '1024367308872-i1uo09sq0naqqcq1b8sk34prefqf55s6.apps.googleusercontent.com';
  const redirectUri = c.env?.GOOGLE_REDIRECT_URI || 'https://app.usevolupia.com.br/api/auth/google/callback';

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return c.redirect(googleAuthUrl.toString(), 302);
});

// 2. Callback Real do Google OAuth 2.0 (Troca code por access_token, consulta UserInfo API e valida Whitelist D1)
app.get('/api/auth/google/callback', async (c) => {
  const db = c.env?.DB;
  if (!db) {
    return c.redirect('/login?sso_error=D1%20Database%20não%20conectado', 302);
  }

  const code = c.req.query('code');
  if (!code) {
    return c.redirect('/login?sso_error=Código%20de%20autenticação%20do%20Google%20ausente', 302);
  }

  const clientId = c.env?.GOOGLE_CLIENT_ID || '1024367308872-i1uo09sq0naqqcq1b8sk34prefqf55s6.apps.googleusercontent.com';
  const clientSecret = c.env?.GOOGLE_CLIENT_SECRET || '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';
  const redirectUri = c.env?.GOOGLE_REDIRECT_URI || 'https://app.usevolupia.com.br/api/auth/google/callback';

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = (await tokenRes.json().catch(() => null)) as { access_token?: string; id_token?: string; error?: string } | null;
    if (!tokenData?.access_token) {
      return c.redirect(`/login?sso_error=Falha%20na%20troca%20de%20token%20Google:%20${encodeURIComponent(tokenData?.error || 'token_invalido')}`, 302);
    }

    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userinfo = (await userinfoRes.json().catch(() => null)) as { sub?: string; email?: string; name?: string; picture?: string; locale?: string } | null;

    const googleEmail = (userinfo?.email || '').trim().toLowerCase();
    if (!googleEmail) {
      return c.redirect('/login?sso_error=E-mail%20não%20retornado%20pelo%20Google', 302);
    }

    const AUTHORIZED_USERS: Record<string, string> = {
      'jeferson@usevolupia.com.br': 'jeferson@usevolupia.com.br',
      'jeferson@volupia.com.br': 'jeferson@usevolupia.com.br',
      'hypersizemultimidia@gmail.com': 'jeferson@usevolupia.com.br',
      'glaucia@usevolupia.com.br': 'glaucia@usevolupia.com.br',
      'glaucia@volupia.com.br': 'glaucia@usevolupia.com.br',
      'enf.glauciamichaella@gmail.com': 'glaucia@usevolupia.com.br',
      'bruno@usevolupia.com.br': 'bruno@usevolupia.com.br',
      'bruno@volupia.com.br': 'bruno@usevolupia.com.br',
      'bruno_amin4@gmail.com': 'bruno@usevolupia.com.br'
    };

    const canonicalEmail = AUTHORIZED_USERS[googleEmail];
    if (!canonicalEmail) {
      return c.redirect(`/login?sso_error=E-mail%20${encodeURIComponent(googleEmail)}%20não%20autorizado%20nos%20segredos%20D1%20(.secrets/.evn.GOOGLE-SHEETS)`, 302);
    }

    await initUserTable(db);
    const user = await db.prepare('SELECT id, email, role, name, picture_url FROM users WHERE email = ?').bind(canonicalEmail).first();
    if (!user) {
      return c.redirect('/login?sso_error=Usuário%20não%20encontrado%20na%20tabela%20D1', 302);
    }

    const now = Date.now();
    const pictureUrl = userinfo?.picture || (user.picture_url as string) || '';
    try {
      await db.prepare(`
        UPDATE users 
        SET picture_url = ?, google_id = ?, locale = ?, lgpd_consent_at = COALESCE(lgpd_consent_at, ?), updated_at = ?
        WHERE email = ?
      `).bind(
        pictureUrl,
        userinfo?.sub || null,
        userinfo?.locale || 'pt-BR',
        now,
        now,
        canonicalEmail
      ).run();

      const ipAddress = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || '127.0.0.1';
      const userAgent = c.req.header('user-agent') || 'Unknown';
      await createAuditLog(db, {
        userId: user.id as string,
        userEmail: canonicalEmail,
        action: 'AUTH_LOGIN_GOOGLE',
        details: {
          googleEmail,
          locale: userinfo?.locale || 'pt-BR',
          pictureUpdated: Boolean(userinfo?.picture)
        },
        ipAddress,
        userAgent
      });
    } catch (e: unknown) {
      void e;
    }

    return c.redirect(
      `/?sso_success=true&email=${encodeURIComponent(user.email as string)}&role=${encodeURIComponent(user.role as string)}&name=${encodeURIComponent(user.name as string)}&picture=${encodeURIComponent(pictureUrl)}`,
      302
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'erro_desconhecido';
    return c.redirect(`/?sso_error=Erro%20no%20processamento%20OAuth:%20${encodeURIComponent(errorMsg)}`, 302);
  }
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

  const rawEmail = (body?.email || '').trim().toLowerCase();

  // Whitelist soberana de autorização (Jeferson Amorim, Gláucia Michaella e Bruno Amin)
  const AUTHORIZED_USERS: Record<string, string> = {
    'jeferson@usevolupia.com.br': 'jeferson@usevolupia.com.br',
    'jeferson@volupia.com.br': 'jeferson@usevolupia.com.br',
    'hypersizemultimidia@gmail.com': 'jeferson@usevolupia.com.br',
    'glaucia@usevolupia.com.br': 'glaucia@usevolupia.com.br',
    'glaucia@volupia.com.br': 'glaucia@usevolupia.com.br',
    'enf.glauciamichaella@gmail.com': 'glaucia@usevolupia.com.br',
    'bruno@usevolupia.com.br': 'bruno@usevolupia.com.br',
    'bruno@volupia.com.br': 'bruno@usevolupia.com.br',
    'bruno_amin4@gmail.com': 'bruno@usevolupia.com.br'
  };

  const canonicalEmail = rawEmail ? AUTHORIZED_USERS[rawEmail] : undefined;

  // 2. Google OAuth SSO Provider (valida contra a tabela users do D1)
  if (body?.provider === 'google_oauth') {
    const searchEmail = canonicalEmail || (rawEmail ? undefined : 'jeferson@usevolupia.com.br');
    if (!searchEmail) {
      return c.json({ ok: false, error: 'E-mail não autorizado nos segredos D1 (.secrets/.evn.GOOGLE-SHEETS)' }, 403);
    }
    const user = await db.prepare('SELECT id, email, role, name FROM users WHERE email = ?').bind(searchEmail).first();
    if (user) {
      return c.json({
        ok: true,
        provider: 'google_oauth_d1',
        user: { id: user.id, email: user.email, role: user.role, name: user.name }
      });
    }
    return c.json({ ok: false, error: 'E-mail não autorizado nos segredos D1 (.secrets/.evn.GOOGLE-SHEETS)' }, 403);
  }

  if (!rawEmail) {
    return c.json({ ok: false, error: 'E-mail corporativo ou CNPJ é obrigatório' }, 400);
  }

  if (!canonicalEmail) {
    return c.json({ ok: false, error: 'E-mail não autorizado nos segredos D1 (.secrets/.evn.GOOGLE-SHEETS)' }, 403);
  }

  // 3. Email + Hash SHA-256 em D1
  if (body?.passwordHash) {
    const user = await db.prepare('SELECT id, email, role, name FROM users WHERE email = ? AND password_hash = ?')
      .bind(canonicalEmail, body.passwordHash)
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
  const user = await db.prepare('SELECT id, email, role, name FROM users WHERE email = ?').bind(canonicalEmail).first();
  if (user) {
    return c.json({
      ok: true,
      provider: 'd1_db',
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  }

  return c.json({ ok: false, error: 'E-mail não autorizado nos segredos D1 (.secrets/.evn.GOOGLE-SHEETS)' }, 403);
});

// Busca fornecedores 100% dinâmico da tabela 'suppliers' do Cloudflare D1
app.get('/api/v8/suppliers', async (c) => {
  const db = c.env?.DB;
  if (!db) return c.json([]);

  try {
    const res = await db.prepare(`
      SELECT 
        s.id, s.place_id, s.name, s.trade_name, s.cnpj, s.category, s.subcategory,
        s.address, s.city, s.state, s.zip_code, s.latitude, s.longitude, s.phone,
        s.whatsapp, s.email, s.website, s.gmb_url, s.rating, s.reviews_count,
        COALESCE(st.status, s.status, 'VISITA_PENDENTE') AS status
      FROM suppliers s
      LEFT JOIN supplier_status st ON s.id = st.supplier_id
    `).all();

    const suppliers = (res.results ?? []).map(r => ({
      id: r.id,
      place_id: r.place_id,
      name: r.name,
      trade_name: r.trade_name,
      cnpj: r.cnpj,
      category: r.category,
      subcategory: r.subcategory,
      address: r.address,
      city: r.city,
      state: r.state,
      zip_code: r.zip_code,
      latitude: r.latitude == null ? null : Number(r.latitude),
      longitude: r.longitude == null ? null : Number(r.longitude),
      phone: r.phone,
      whatsapp: r.whatsapp,
      email: r.email,
      website: r.website,
      gmb_url: r.gmb_url,
      rating: r.rating == null ? 0 : Number(r.rating),
      reviews_count: r.reviews_count == null ? 0 : Number(r.reviews_count),
      status: r.status
    }));

    return c.json(suppliers);
  } catch (e: unknown) {
    void e;
    return c.json({ error: 'Erro ao buscar fornecedores do D1' }, 500);
  }
});

// Todos os overrides de status persistidos (deltas sobre suppliers).
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

// Endpoint para atualização de perfil e log de auditoria LGPD no D1
app.post('/api/v8/user/profile', async (c) => {
  const db = c.env?.DB;
  if (!db) {
    return c.json({ ok: false, error: 'D1 Database não conectado' }, 500);
  }

  await initUserTable(db);
  await initAuditLogsTable(db);

  const body = (await c.req.json().catch(() => null)) as { email?: string; name?: string; picture?: string } | null;
  const email = (body?.email || '').trim().toLowerCase();
  if (!email) {
    return c.json({ ok: false, error: 'E-mail do usuário é obrigatório' }, 400);
  }

  const user = await db.prepare('SELECT id, email, name, picture_url FROM users WHERE email = ?').bind(email).first();
  if (!user) {
    return c.json({ ok: false, error: 'Usuário não encontrado' }, 404);
  }

  const now = Math.floor(Date.now() / 1000);
  const newName = body?.name !== undefined ? body.name : (user.name as string);
  const newPicture = body?.picture !== undefined ? body.picture : (user.picture_url as string);

  await db.prepare(`
    UPDATE users
    SET name = ?, picture_url = ?, updated_at = ?
    WHERE email = ?
  `).bind(newName, newPicture, now, email).run();

  const ipAddress = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || '127.0.0.1';
  const userAgent = c.req.header('user-agent') || 'Unknown';

  if (body?.picture !== undefined && body.picture !== user.picture_url) {
    await createAuditLog(db, {
      userId: user.id as string,
      userEmail: email,
      action: 'PROFILE_PICTURE_UPDATE',
      details: {
        previousPictureLength: user.picture_url ? (user.picture_url as string).length : 0,
        newPictureLength: newPicture ? newPicture.length : 0,
        isBase64: newPicture.startsWith('data:image/')
      },
      ipAddress,
      userAgent
    });
  }

  if (body?.name !== undefined && body.name !== user.name) {
    await createAuditLog(db, {
      userId: user.id as string,
      userEmail: email,
      action: 'PROFILE_NAME_UPDATE',
      details: {
        previousName: user.name,
        newName
      },
      ipAddress,
      userAgent
    });
  }

  return c.json({
    ok: true,
    message: 'Perfil atualizado no D1 e registrado na auditoria LGPD',
    user: {
      id: user.id,
      email,
      name: newName,
      picture: newPicture
    }
  });
});

// Endpoint para consulta auditável dos registros LGPD
app.get('/api/v8/audit-logs', async (c) => {
  const db = c.env?.DB;
  if (!db) {
    return c.json({ ok: false, error: 'D1 Database não conectado' }, 500);
  }

  await initAuditLogsTable(db);
  const email = c.req.query('email');
  const limitStr = c.req.query('limit') || '50';
  const limit = Math.min(parseInt(limitStr, 10) || 50, 200);

  let query = 'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?';
  let bindParams: (string | number)[] = [limit];

  if (email) {
    query = 'SELECT * FROM audit_logs WHERE user_email = ? ORDER BY created_at DESC LIMIT ?';
    bindParams = [email.trim().toLowerCase(), limit];
  }

  const { results } = await db.prepare(query).bind(...bindParams).all();
  return c.json({
    ok: true,
    count: results ? results.length : 0,
    logs: (results || []).map((row) => ({
      ...row,
      details: row.details ? JSON.parse(row.details as string) : null
    }))
  });
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
