import { Hono } from "hono";
import { authMiddleware, requireRole } from "../middleware/auth-rbac.js";
import type { ContentPost, ContentPostStatus } from "../../../cockpit/src/types/content-os.js";

export const contentPostsRouter = new Hono();

// Apply auth middleware to all content routes
contentPostsRouter.use("*", authMiddleware);

// In-Memory Seed Store (fallback for development mode)
const inMemoryPosts: Map<string, ContentPost> = new Map([
  [
    "POST-20260830-0001",
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
  ],
  [
    "POST-20260830-0002",
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
  ],
]);

/**
 * GET /content/posts
 * List all content posts with optional status and platform filters
 */
contentPostsRouter.get("/content/posts", (c) => {
  try {
    const statusFilter = c.req.query("status") as ContentPostStatus | undefined;
    const platformFilter = c.req.query("platform");

    let posts = Array.from(inMemoryPosts.values());

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
contentPostsRouter.get("/content/posts/:id", (c) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json({ success: false, error: "Missing post ID" }, 400);
  }
  const post = inMemoryPosts.get(id);

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

      inMemoryPosts.set(id, newPost);
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
      const existing = inMemoryPosts.get(id);

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

      inMemoryPosts.set(id, updatedPost);
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
  (c) => {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Missing post ID" }, 400);
    }
    const existing = inMemoryPosts.get(id);

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

    inMemoryPosts.set(id, approvedPost);
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
  (c) => {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Missing post ID" }, 400);
    }
    const existing = inMemoryPosts.get(id);

    if (!existing) {
      return c.json({ success: false, error: `Post ${id} not found` }, 404);
    }

    inMemoryPosts.delete(id);
    return c.json({ success: true, message: `Post ${id} deleted successfully` });
  }
);
