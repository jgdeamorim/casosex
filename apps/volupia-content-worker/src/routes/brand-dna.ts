import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth-rbac.js';
import type { BrandDnaPillar } from '../../../cockpit/src/types/content-os.js';

type D1Database = any;

type Bindings = {
  DB?: D1Database;
};

export const brandDnaRouter = new Hono<{ Bindings: Bindings }>();

// Initial in-memory seed store for Brand DNA pillars
const memoryBrandDnaStore: Map<string, BrandDnaPillar> = new Map([
  [
    'dna-001',
    {
      id: 'dna-001',
      name: 'Erotic Luxury (Sensual Élite)',
      pillarKey: 'erotic_luxury',
      visualGuidelines: 'Enquadramentos 9:16 com profundidade de campo rasa, tecidos em seda pura e iluminação chiaroscuro.',
      verbalTone: 'Sedutor, sofisticado, sussurrado, elegante sem clichês.',
      colorPalette: 'Burgundy (#800020), Vermelho Volúpia (#e11d48), Preto Ônix (#0c0a0b), Dourado Champanhe (#d4af37)',
      lightingProfile: 'Cinematográfico nobre, sombras quentes, halos de neon suave',
      version: 1,
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'dna-002',
    {
      id: 'dna-002',
      name: 'Sensory Authority (Ciência dos Sentidos)',
      pillarKey: 'sensory_authority',
      visualGuidelines: 'Close-ups de texturas, borrifos de perfume em câmera lenta, frascos com iluminação de estúdio.',
      verbalTone: 'Especialista, confiante, educativo sobre feromônios e notas olfativas.',
      colorPalette: 'Âmbar Dourado (#ffbf00), Cristal (#f5f5f5), Carmim (#990000)',
      lightingProfile: 'Luz de estúdio limpa, destaques dramáticos em vidro e superfícies reflexivas',
      version: 1,
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'dna-003',
    {
      id: 'dna-003',
      name: 'Education & Perfect Fit (Guia Íntimo)',
      pillarKey: 'education_fit',
      visualGuidelines: 'Carrosséis informativos, comparações de caimento, gráficos anatômicos e dicas práticas.',
      verbalTone: 'Empático, acolhedor, libertador, sem tabus.',
      colorPalette: 'Nude Rosado (#e8c3b9), Seda Branca (#faf7f5), Cinza Grafite (#221c1f)',
      lightingProfile: 'Luz natural de janela, tomadas abertas, clima de ambiente residencial de alto padrão',
      version: 1,
      createdAt: new Date().toISOString(),
    },
  ],
]);

brandDnaRouter.use('*', authMiddleware);

// GET /api/v1/brand-dna - List pillars
brandDnaRouter.get('/', async (c) => {
  const db = c.env.DB;
  if (db) {
    try {
      const { results } = await db
        .prepare('SELECT * FROM brand_dna ORDER BY created_at DESC')
        .all();
      return c.json({ success: true, data: results });
    } catch (e: unknown) {
      void e;
    }
  }
  return c.json({ success: true, data: Array.from(memoryBrandDnaStore.values()) });
});

// GET /api/v1/brand-dna/:id - Single pillar
brandDnaRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  if (db) {
    try {
      const pillar = await db
        .prepare('SELECT * FROM brand_dna WHERE id = ? OR pillar_key = ?')
        .bind(id, id)
        .first();
      if (pillar) return c.json({ success: true, data: pillar });
    } catch (e: unknown) {
      void e;
    }
  }
  const memoryPillar = memoryBrandDnaStore.get(id);
  if (memoryPillar) return c.json({ success: true, data: memoryPillar });
  return c.json({ success: false, error: 'Pilar de DNA não encontrado' }, 404);
});

// POST /api/v1/brand-dna - Create / Update pillar (requires founder or ops)
brandDnaRouter.post('/', requireRole(['founder', 'ops']), async (c) => {
  try {
    const body = await c.req.json<Partial<BrandDnaPillar>>();
    if (!body.name || !body.pillarKey) {
      return c.json({ success: false, error: 'Campos "name" e "pillarKey" são obrigatórios' }, 400);
    }

    const id = body.id || `dna-${Date.now()}`;
    const newPillar: BrandDnaPillar = {
      id,
      name: body.name,
      pillarKey: body.pillarKey,
      visualGuidelines: body.visualGuidelines || '',
      verbalTone: body.verbalTone || '',
      colorPalette: body.colorPalette || '',
      lightingProfile: body.lightingProfile || '',
      version: body.version || 1,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const db = c.env.DB;
    if (db) {
      await db
        .prepare(
          `INSERT INTO brand_dna (id, name, pillar_key, visual_guidelines, verbal_tone, color_palette, lighting_profile, version, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(pillar_key) DO UPDATE SET
             name = excluded.name,
             visual_guidelines = excluded.visual_guidelines,
             verbal_tone = excluded.verbal_tone,
             color_palette = excluded.color_palette,
             lighting_profile = excluded.lighting_profile,
             version = version + 1`
        )
        .bind(
          newPillar.id,
          newPillar.name,
          newPillar.pillarKey,
          newPillar.visualGuidelines,
          newPillar.verbalTone,
          newPillar.colorPalette,
          newPillar.lightingProfile,
          newPillar.version,
          newPillar.createdAt
        )
        .run();
    }

    memoryBrandDnaStore.set(newPillar.id, newPillar);
    return c.json({ success: true, data: newPillar }, 201);
  } catch (e: unknown) {
    return c.json({ success: false, error: e instanceof Error ? e.message : 'Erro ao salvar Brand DNA' }, 500);
  }
});

// DELETE /api/v1/brand-dna/:id - Remove pillar (requires founder)
brandDnaRouter.delete('/:id', requireRole(['founder']), async (c) => {
  const id = c.req.param('id');
  if (!id) return c.json({ success: false, error: 'ID inválido' }, 400);
  const db = c.env.DB;
  if (db) {
    try {
      await db.prepare('DELETE FROM brand_dna WHERE id = ?').bind(id).run();
    } catch (e: unknown) {
      void e;
    }
  }
  memoryBrandDnaStore.delete(id);
  return c.json({ success: true, message: 'Pilar de DNA removido com sucesso' });
});
