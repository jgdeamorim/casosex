import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth-rbac.js';
import type { AssetGeneration } from '../../../cockpit/src/types/content-os.js';

type D1Database = any;

type Bindings = {
  DB?: D1Database;
};

export const assetRegistryRouter = new Hono<{ Bindings: Bindings }>();

assetRegistryRouter.use('*', authMiddleware);

// In-memory fallback for local dev when D1 is not bound
const mockAssetGenerationsStore: Map<string, AssetGeneration[]> = new Map([
  [
    'POST-20260830-0001',
    [
      {
        id: 'ASSET-20260830-0001-V1',
        postId: 'POST-20260830-0001',
        generationNumber: 1,
        model: 'flux-1-schnell',
        modelVersion: 'v1.0',
        seed: 8492041,
        promptHash: 'd3b07384d113edec49eaa6238ad5ff00',
        compiledPrompt: 'Hyper-realistic commercial video frame, 9:16 vertical orientation.',
        assetUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1080&auto=format&fit=crop',
        mimeType: 'image/jpeg',
        width: 1080,
        height: 1920,
        status: 'published',
        createdBy: 'volupia_founder',
        createdAt: new Date().toISOString(),
      },
    ],
  ],
]);

// GET /api/v1/assets/post/:postId - Get all asset generations for a post
assetRegistryRouter.get('/post/:postId', async (c) => {
  try {
    const postId = c.req.param('postId');
    if (!postId) {
      return c.json({ success: false, error: 'postId é obrigatório' }, 400);
    }

    const db = c.env?.DB;

    if (db) {
      const { results } = await db
        .prepare(
          `SELECT 
            id, post_id as postId, generation_number as generationNumber,
            model, model_version as modelVersion, seed, prompt_hash as promptHash,
            compiled_prompt as compiledPrompt, asset_url as assetUrl,
            mime_type as mimeType, width, height, status,
            created_by as createdBy, created_at as createdAt
          FROM asset_generations
          WHERE post_id = ?
          ORDER BY generation_number DESC`
        )
        .bind(postId)
        .all();

      return c.json({ success: true, data: results || [] });
    }

    const assets = mockAssetGenerationsStore.get(postId) || [];
    return c.json({ success: true, data: assets });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao carregar assets' },
      500
    );
  }
});

// POST /api/v1/assets/generate - Register a new generation attempt
assetRegistryRouter.post('/generate', async (c) => {
  try {
    const body = await c.req.json<Partial<AssetGeneration>>();
    if (!body || !body.postId || !body.assetUrl) {
      return c.json({ success: false, error: 'postId e assetUrl são obrigatórios' }, 400);
    }

    const db = c.env?.DB;
    const postId = body.postId;
    const existing = mockAssetGenerationsStore.get(postId) || [];
    const nextGenNum = body.generationNumber || existing.length + 1;

    const newAsset: AssetGeneration = {
      id: body.id || `ASSET-${Date.now()}-V${nextGenNum}`,
      postId,
      generationNumber: nextGenNum,
      model: body.model || 'flux-1-schnell',
      modelVersion: body.modelVersion || 'v1.0',
      seed: body.seed || Math.floor(Math.random() * 100000000),
      promptHash: body.promptHash || '',
      compiledPrompt: body.compiledPrompt || '',
      assetUrl: body.assetUrl,
      mimeType: body.mimeType || 'image/webp',
      width: body.width || 1080,
      height: body.height || 1920,
      status: body.status || 'draft',
      createdBy: body.createdBy || 'volupia_ops',
      createdAt: new Date().toISOString(),
    };

    if (db) {
      await db
        .prepare(
          `INSERT INTO asset_generations (
            id, post_id, generation_number, model, model_version,
            seed, prompt_hash, compiled_prompt, asset_url, mime_type,
            width, height, status, created_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          newAsset.id,
          newAsset.postId,
          newAsset.generationNumber,
          newAsset.model,
          newAsset.modelVersion || null,
          newAsset.seed || null,
          newAsset.promptHash || null,
          newAsset.compiledPrompt || null,
          newAsset.assetUrl,
          newAsset.mimeType,
          newAsset.width,
          newAsset.height,
          newAsset.status,
          newAsset.createdBy,
          newAsset.createdAt
        )
        .run();

      return c.json({ success: true, data: newAsset });
    }

    existing.unshift(newAsset);
    mockAssetGenerationsStore.set(postId, existing);

    return c.json({ success: true, data: newAsset });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao criar asset' },
      500
    );
  }
});

// POST /api/v1/assets/select/:id - Select an asset as the published version for a post
assetRegistryRouter.post('/select/:id', async (c) => {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'ID do asset é obrigatório' }, 400);
    }

    const db = c.env?.DB;

    if (db) {
      // Find asset to get postId
      const asset = await db
        .prepare('SELECT post_id as postId FROM asset_generations WHERE id = ?')
        .bind(id)
        .first();

      if (!asset) {
        return c.json({ success: false, error: 'Asset não encontrado' }, 404);
      }

      // Reset all status to draft for this post, then set selected asset to 'selected' or 'published'
      await db
        .prepare("UPDATE asset_generations SET status = 'draft' WHERE post_id = ?")
        .bind(asset.postId)
        .run();

      await db
        .prepare("UPDATE asset_generations SET status = 'published' WHERE id = ?")
        .bind(id)
        .run();

      return c.json({ success: true, message: 'Asset selecionado como versão publicada' });
    }

    // Fallback in-memory logic
    for (const [postId, list] of mockAssetGenerationsStore.entries()) {
      const item = list.find((a) => a.id === id);
      if (item) {
        mockAssetGenerationsStore.set(
          postId,
          list.map((a) => ({
            ...a,
            status: a.id === id ? 'published' : 'draft',
          }))
        );
        return c.json({ success: true, message: 'Asset selecionado como versão publicada' });
      }
    }

    return c.json({ success: false, error: 'Asset não encontrado' }, 404);
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao selecionar asset' },
      500
    );
  }
});

// DELETE /api/v1/assets/:id - Delete an asset generation entry
assetRegistryRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'ID é obrigatório' }, 400);
    }

    const db = c.env?.DB;

    if (db) {
      await db.prepare('DELETE FROM asset_generations WHERE id = ?').bind(id).run();
      return c.json({ success: true, message: 'Asset removido com sucesso' });
    }

    for (const [postId, list] of mockAssetGenerationsStore.entries()) {
      mockAssetGenerationsStore.set(
        postId,
        list.filter((a) => a.id !== id)
      );
    }

    return c.json({ success: true, message: 'Asset removido com sucesso' });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao deletar asset' },
      500
    );
  }
});
