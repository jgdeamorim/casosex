import { Hono, type Context } from "hono";
import { authMiddleware, requireRole } from "../middleware/auth-rbac.js";
import type { ContentPost, ContentPostStatus, ContentObjective, ContentPlatform } from "../types/content-os.js";
import { DevStore } from "../lib/devStore.js";

type D1Database = {
  prepare(query: string): {
    bind(...params: unknown[]): {
      all<T = unknown>(): Promise<{ results: T[] }>;
      first<T = unknown>(): Promise<T | null>;
      run(): Promise<{ success: boolean }>;
    };
    all<T = unknown>(): Promise<{ results: T[] }>;
    first<T = unknown>(): Promise<T | null>;
    run(): Promise<{ success: boolean }>;
  };
};

type Bindings = {
  DB?: D1Database;
};

export const contentPostsRouter = new Hono<{ Bindings: Bindings }>();

// Apply auth middleware to all content routes
contentPostsRouter.use("*", authMiddleware);

// Initial seeds for local DevStore fallback
const initialSeeds: ContentPost[] = [
  {
    id: "POST-20260830-0001",
    title: "Lingerie Erotic Luxury — Coleção Primaveril",
    objective: "awareness",
    dnaPillarId: "erotic_luxury",
    platform: "instagram",
    format: "reels_9_16",
    scheduledAt: "2026-09-01T19:30:00Z",
    hook: "Você sabia que a iluminação dramática muda completamente a percepção de luxo?",
    script: "Apresentação de bastidores da nova seda bordada com enquadramento em iluminação suave.",
    cta: "Comente LUXO no Direct para receber o catálogo VIP.",
    brandDnaVersion: 1,
    characterId: "char_valeria_01",
    promptTemplateId: "tmpl_reel_9_16_luxury",
    compiledPrompt: "System: Luxury Brand | Character: Valeria | Scene: Velvet Bedroom | Lighting: Cinematic Soft Glow",
    promptHash: "b3_8492041a99f",
    status: "approved",
    createdBy: "volupia_founder",
    approvedBy: "volupia_founder",
    approvedAt: "2026-08-30T18:00:00Z",
    createdAt: "2026-08-30T12:00:00Z",
    updatedAt: "2026-08-30T18:00:00Z",
  },
  {
    id: "POST-20260830-0002",
    title: "Guia Discreto: Escolhendo o Tamanho Perfeito",
    objective: "authority",
    dnaPillarId: "educativo",
    platform: "instagram",
    format: "carousel_4_5",
    scheduledAt: "2026-09-02T14:00:00Z",
    hook: "3 erros comuns ao escolher lingerie fina online que você precisa evitar.",
    script: "Carrossel explicativo com 5 slides sobre medidas corporais e tecidos respiráveis.",
    cta: "Salve este post para consultar antes da sua próxima compra.",
    brandDnaVersion: 1,
    characterId: null,
    promptTemplateId: "tmpl_carousel_educational",
    compiledPrompt: null,
    promptHash: null,
    status: "draft",
    createdBy: "volupia_ops",
    approvedBy: null,
    createdAt: "2026-08-30T14:30:00Z",
    updatedAt: "2026-08-30T14:30:00Z",
  },
];

// Ensure local DevStore has initial seeds if empty
function ensureDevStoreSeeded(): void {
  const store = DevStore.get();
  if (!store.posts || Object.keys(store.posts).length === 0) {
    store.posts = {};
    for (const post of initialSeeds) {
      store.posts[post.id] = post as unknown as Record<string, unknown>;
    }
    DevStore.save();
  }
}

// Convert D1 database row to ContentPost interface
function mapD1RowToContentPost(row: Record<string, unknown>): ContentPost {
  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    objective: (row.objective as ContentObjective) || "awareness",
    dnaPillarId: String(row.dna_pillar_id || "erotic_luxury"),
    platform: (row.platform as ContentPlatform) || "instagram",
    format: String(row.format || "reels_9_16"),
    scheduledAt: row.scheduled_at ? String(row.scheduled_at) : null,
    hook: String(row.hook || ""),
    script: String(row.script || ""),
    cta: String(row.cta || ""),
    brandDnaVersion: typeof row.brand_dna_version === "number" ? row.brand_dna_version : 1,
    characterId: row.character_id ? String(row.character_id) : null,
    promptTemplateId: row.prompt_template_id ? String(row.prompt_template_id) : null,
    compiledPrompt: row.compiled_prompt ? String(row.compiled_prompt) : null,
    promptHash: row.prompt_hash ? String(row.prompt_hash) : null,
    status: (row.status as ContentPostStatus) || "draft",
    createdBy: String(row.created_by || "system"),
    approvedBy: row.approved_by ? String(row.approved_by) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null,
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
}

// Fetch posts from D1 with DevStore fallback
async function fetchAllPosts(c: Context<{ Bindings: Bindings }>): Promise<ContentPost[]> {
  const db = c.env?.DB;
  if (db) {
    try {
      const { results } = await db.prepare("SELECT * FROM content_posts ORDER BY created_at DESC").all<Record<string, unknown>>();
      if (results && results.length > 0) {
        return results.map(mapD1RowToContentPost);
      }
    } catch (e: unknown) {
      void e;
    }
  }

  ensureDevStoreSeeded();
  const storePosts = DevStore.get().posts;
  return Object.values(storePosts).map((p) => p as unknown as ContentPost);
}

// Fetch single post by ID from D1 with DevStore fallback
async function fetchPostById(c: Context<{ Bindings: Bindings }>, id: string): Promise<ContentPost | null> {
  const db = c.env?.DB;
  if (db) {
    try {
      const row = await db.prepare("SELECT * FROM content_posts WHERE id = ?").bind(id).first<Record<string, unknown>>();
      if (row) {
        return mapD1RowToContentPost(row);
      }
    } catch (e: unknown) {
      void e;
    }
  }

  ensureDevStoreSeeded();
  const raw = DevStore.get().posts[id];
  return raw ? (raw as unknown as ContentPost) : null;
}

// Save (Insert / Update) post to D1 and DevStore
async function persistPost(c: Context<{ Bindings: Bindings }>, post: ContentPost): Promise<void> {
  const db = c.env?.DB;
  if (db) {
    try {
      await db
        .prepare(
          `INSERT INTO content_posts (
            id, tenant_id, title, objective, dna_pillar_id, platform, format, scheduled_at,
            hook, script, cta, brand_dna_version, character_id, prompt_template_id,
            compiled_prompt, prompt_hash, status, created_by, approved_by, approved_at,
            created_at, updated_at
          ) VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            objective = excluded.objective,
            dna_pillar_id = excluded.dna_pillar_id,
            platform = excluded.platform,
            format = excluded.format,
            scheduled_at = excluded.scheduled_at,
            hook = excluded.hook,
            script = excluded.script,
            cta = excluded.cta,
            brand_dna_version = excluded.brand_dna_version,
            character_id = excluded.character_id,
            prompt_template_id = excluded.prompt_template_id,
            compiled_prompt = excluded.compiled_prompt,
            prompt_hash = excluded.prompt_hash,
            status = excluded.status,
            created_by = excluded.created_by,
            approved_by = excluded.approved_by,
            approved_at = excluded.approved_at,
            updated_at = excluded.updated_at`
        )
        .bind(
          post.id,
          post.title,
          post.objective,
          post.dnaPillarId,
          post.platform,
          post.format,
          post.scheduledAt,
          post.hook,
          post.script,
          post.cta,
          post.brandDnaVersion,
          post.characterId,
          post.promptTemplateId,
          post.compiledPrompt,
          post.promptHash,
          post.status,
          post.createdBy,
          post.approvedBy,
          post.approvedAt || null,
          post.createdAt,
          post.updatedAt
        )
        .run();
    } catch (e: unknown) {
      void e;
    }
  }

  ensureDevStoreSeeded();
  DevStore.get().posts[post.id] = post as unknown as Record<string, unknown>;
  DevStore.save();
}

// Delete post from D1 and DevStore
async function removePost(c: Context<{ Bindings: Bindings }>, id: string): Promise<void> {
  const db = c.env?.DB;
  if (db) {
    try {
      await db.prepare("DELETE FROM content_posts WHERE id = ?").bind(id).run();
    } catch (e: unknown) {
      void e;
    }
  }

  ensureDevStoreSeeded();
  delete DevStore.get().posts[id];
  DevStore.save();
}

/**
 * GET /content/posts
 * List all content posts with optional status and platform filters
 */
contentPostsRouter.get("/content/posts", async (c) => {
  try {
    const statusFilter = c.req.query("status") as ContentPostStatus | undefined;
    const platformFilter = c.req.query("platform");

    let posts = await fetchAllPosts(c);

    if (statusFilter) {
      posts = posts.filter((p) => p.status === statusFilter);
    }
    if (platformFilter) {
      posts = posts.filter((p) => p.platform === platformFilter);
    }

    return c.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (e: unknown) {
    void e;
    return c.json({ success: false, error: "Failed to list posts", data: [] }, 500);
  }
});

/**
 * GET /content/posts/:id
 * Get single post by ID
 */
contentPostsRouter.get("/content/posts/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json({ success: false, error: "Missing post ID" }, 400);
  }

  const post = await fetchPostById(c, id);
  if (!post) {
    return c.json({ success: false, error: `Post with ID ${id} not found` }, 404);
  }

  return c.json({ success: true, data: post });
});

/**
 * POST /content/posts
 * Create new ContentPost (Roles: founder, ops, commercial)
 */
contentPostsRouter.post(
  "/content/posts",
  requireRole(["founder", "ops", "commercial"]),
  async (c) => {
    try {
      const body = await c.req.json<Partial<ContentPost>>();
      const user = c.get("user");

      const now = new Date().toISOString();
      const id = body.id || `POST-${now.slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newPost: ContentPost = {
        id,
        title: body.title || "Novo Conteúdo Sem Título",
        objective: body.objective || "awareness",
        dnaPillarId: body.dnaPillarId || "erotic_luxury",
        platform: body.platform || "instagram",
        format: body.format || "reels_9_16",
        scheduledAt: body.scheduledAt || null,
        hook: body.hook || "",
        script: body.script || "",
        cta: body.cta || "",
        brandDnaVersion: body.brandDnaVersion || 1,
        characterId: body.characterId || null,
        promptTemplateId: body.promptTemplateId || null,
        compiledPrompt: body.compiledPrompt || null,
        promptHash: body.promptHash || null,
        status: "draft",
        createdBy: user?.username || "system",
        approvedBy: null,
        createdAt: now,
        updatedAt: now,
      };

      await persistPost(c, newPost);
      return c.json({ success: true, data: newPost }, 201);
    } catch (e: unknown) {
      void e;
      return c.json({ success: false, error: "Invalid post payload" }, 400);
    }
  }
);

/**
 * PATCH /content/posts/:id
 * Update an existing ContentPost
 */
contentPostsRouter.patch(
  "/content/posts/:id",
  requireRole(["founder", "ops", "commercial"]),
  async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) {
        return c.json({ success: false, error: "Missing post ID" }, 400);
      }
      const existing = await fetchPostById(c, id);

      if (!existing) {
        return c.json({ success: false, error: `Post ${id} not found` }, 404);
      }

      const body = await c.req.json<Partial<ContentPost>>();
      const updatedPost: ContentPost = {
        ...existing,
        ...body,
        id: existing.id, // Immutable ID
        updatedAt: new Date().toISOString(),
      };

      await persistPost(c, updatedPost);
      return c.json({ success: true, data: updatedPost });
    } catch (e: unknown) {
      void e;
      return c.json({ success: false, error: "Failed to update post" }, 400);
    }
  }
);

/**
 * POST /content/posts/:id/approve
 * Approve a ContentPost (Roles: founder, ops)
 */
contentPostsRouter.post(
  "/content/posts/:id/approve",
  requireRole(["founder", "ops"]),
  async (c) => {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Missing post ID" }, 400);
    }
    const existing = await fetchPostById(c, id);

    if (!existing) {
      return c.json({ success: false, error: `Post ${id} not found` }, 404);
    }

    const user = c.get("user");
    const now = new Date().toISOString();

    const approvedPost: ContentPost = {
      ...existing,
      status: "approved",
      approvedBy: user?.username || "founder",
      approvedAt: now,
      updatedAt: now,
    };

    await persistPost(c, approvedPost);
    return c.json({ success: true, message: `Post ${id} approved successfully`, data: approvedPost });
  }
);

/**
 * DELETE /content/posts/:id
 * Archive / Delete a ContentPost (Roles: founder, ops)
 */
contentPostsRouter.delete(
  "/content/posts/:id",
  requireRole(["founder", "ops"]),
  async (c) => {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Missing post ID" }, 400);
    }
    const existing = await fetchPostById(c, id);

    if (!existing) {
      return c.json({ success: false, error: `Post ${id} not found` }, 404);
    }

    await removePost(c, id);
    return c.json({ success: true, message: `Post ${id} deleted successfully` });
  }
);
