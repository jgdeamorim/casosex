import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth-rbac.js';
import type { CharacterEntity } from '../../../cockpit/src/types/content-os.js';

type D1Database = any;

type Bindings = {
  DB?: D1Database;
};

export const charactersRouter = new Hono<{ Bindings: Bindings }>();

// Initial in-memory seed store for Character Library
const memoryCharactersStore: Map<string, CharacterEntity> = new Map([
  [
    'char-valentina-01',
    {
      id: 'char-valentina-01',
      name: 'Valentina Volúpia (Aura Élite)',
      description: 'Modelo de referência soberana para conteúdos de luxo sensual e alta perfumaria.',
      faceReferenceUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      ]),
      fixedSeed: 884719203,
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'char-sophia-02',
    {
      id: 'char-sophia-02',
      name: 'Sophia Lingerie (Especialista em Fit)',
      description: 'Personagem voltada para vídeos educativos de caimento de lingerie e consultoria corporal.',
      faceReferenceUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
      ]),
      fixedSeed: 412093847,
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'char-hector-03',
    {
      id: 'char-hector-03',
      name: 'Hector Noir (Linha Masculina / Par)',
      description: 'Personagem masculino de apoio para campanhas de casais e fragrâncias intensas.',
      faceReferenceUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
      ]),
      fixedSeed: 902318471,
      createdAt: new Date().toISOString(),
    },
  ],
]);

charactersRouter.use('*', authMiddleware);

// GET /api/v1/characters - List characters
charactersRouter.get('/', async (c) => {
  const db = c.env.DB;
  if (db) {
    try {
      const { results } = await db
        .prepare('SELECT * FROM characters ORDER BY created_at DESC')
        .all();
      return c.json({ success: true, data: results });
    } catch (e: unknown) {
      void e;
    }
  }
  return c.json({ success: true, data: Array.from(memoryCharactersStore.values()) });
});

// GET /api/v1/characters/:id - Single character
charactersRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  if (db) {
    try {
      const char = await db
        .prepare('SELECT * FROM characters WHERE id = ?')
        .bind(id)
        .first();
      if (char) return c.json({ success: true, data: char });
    } catch (e: unknown) {
      void e;
    }
  }
  const memoryChar = memoryCharactersStore.get(id);
  if (memoryChar) return c.json({ success: true, data: memoryChar });
  return c.json({ success: false, error: 'Personagem não encontrado' }, 404);
});

// POST /api/v1/characters - Create / Update character (requires founder or ops)
charactersRouter.post('/', requireRole(['founder', 'ops']), async (c) => {
  try {
    const body = await c.req.json<Partial<CharacterEntity>>();
    if (!body.name) {
      return c.json({ success: false, error: 'Campo "name" é obrigatório' }, 400);
    }

    const id = body.id || `char-${Date.now()}`;
    const newChar: CharacterEntity = {
      id,
      name: body.name,
      description: body.description || '',
      faceReferenceUrls: body.faceReferenceUrls || '[]',
      fixedSeed: typeof body.fixedSeed === 'number' ? body.fixedSeed : Math.floor(Math.random() * 1000000000),
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const db = c.env.DB;
    if (db) {
      await db
        .prepare(
          `INSERT INTO characters (id, name, description, face_reference_urls, fixed_seed, created_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             name = excluded.name,
             description = excluded.description,
             face_reference_urls = excluded.face_reference_urls,
             fixed_seed = excluded.fixed_seed`
        )
        .bind(
          newChar.id,
          newChar.name,
          newChar.description,
          newChar.faceReferenceUrls,
          newChar.fixedSeed,
          newChar.createdAt
        )
        .run();
    }

    memoryCharactersStore.set(newChar.id, newChar);
    return c.json({ success: true, data: newChar }, 201);
  } catch (e: unknown) {
    return c.json({ success: false, error: e instanceof Error ? e.message : 'Erro ao salvar Personagem' }, 500);
  }
});

// DELETE /api/v1/characters/:id - Delete character (requires founder)
charactersRouter.delete('/:id', requireRole(['founder']), async (c) => {
  const id = c.req.param('id');
  if (!id) return c.json({ success: false, error: 'ID inválido' }, 400);
  const db = c.env.DB;
  if (db) {
    try {
      await db.prepare('DELETE FROM characters WHERE id = ?').bind(id).run();
    } catch (e: unknown) {
      void e;
    }
  }
  memoryCharactersStore.delete(id);
  return c.json({ success: true, message: 'Personagem removido com sucesso' });
});
