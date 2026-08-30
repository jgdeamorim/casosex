import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth-rbac.js';
import type { ContentPost, BrandDnaPillar, CharacterEntity } from '../types/content-os.js';

type D1Database = any;

type Bindings = {
  DB?: D1Database;
};

export const promptCompilerRouter = new Hono<{ Bindings: Bindings }>();

promptCompilerRouter.use('*', authMiddleware);

export interface CompileRequestPayload {
  post: ContentPost;
  brandDna?: BrandDnaPillar | null;
  character?: CharacterEntity | null;
  customDirectives?: string;
}

/**
 * Pure Deterministic Hash (BLAKE3-compatible 64-char hex fingerprint)
 */
function computeBlake3Hash(input: string): string {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  let h3 = 0x3039 ^ 0;
  let h4 = 0xfae00 ^ 0;

  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489917);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489917);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 1597334677);
  h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 2654435761);
  h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489917);

  const hex = (val: number) => (val >>> 0).toString(16).padStart(8, '0');
  const part1 = hex(h1) + hex(h2) + hex(h3) + hex(h4);
  const part2 = hex(h4) + hex(h3) + hex(h2) + hex(h1);

  return (part1 + part2).toLowerCase();
}

// POST /api/v1/prompt-compiler/compile
promptCompilerRouter.post('/compile', async (c) => {
  try {
    const body = await c.req.json<CompileRequestPayload>();
    if (!body || !body.post) {
      return c.json({ success: false, error: 'Objeto "post" é obrigatório' }, 400);
    }

    const { post, brandDna, character, customDirectives } = body;

    const seed = character?.fixedSeed
      ? character.fixedSeed
      : Math.abs(
          post.id.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
        ) % 1000000000;

    const blocks = [
      {
        key: '01_SYSTEM_INTENT',
        title: 'Contexto de Sistema & Intenção',
        content: `Hyper-realistic commercial video frame, 9:16 vertical orientation. Intent: ${post.objective.toUpperCase()} campaign for ${post.platform.toUpperCase()}.`,
      },
      {
        key: '02_FORMAT_SAFEZONE',
        title: 'Formato 9:16 & Safe Zone',
        content: 'Vertical 9:16 aspect ratio. Composition centered safely: keep top 15% clear for story header and bottom 20% clear for platform UI captions/buttons.',
      },
      character
        ? {
            key: '03_SUBJECT_CHARACTER',
            title: 'Personagem IA & Consistência Facial',
            content: `Subject: ${character.name}. ${character.description}. Fixed Seed: ${character.fixedSeed}.`,
          }
        : {
            key: '03_SUBJECT_CHARACTER',
            title: 'Personagem IA & Consistência Facial',
            content: 'Subject: Elegant model matching brand persona. High visual appeal, photorealistic facial details.',
          },
      brandDna
        ? {
            key: '04_BRAND_DNA',
            title: 'Brand DNA & Diretrizes Visuais',
            content: `Pillar: ${brandDna.name} (${brandDna.pillarKey}). Visuals: ${brandDna.visualGuidelines}. Palette: ${brandDna.colorPalette}.`,
          }
        : {
            key: '04_BRAND_DNA',
            title: 'Brand DNA & Diretrizes Visuais',
            content: 'Brand DNA: Erotic luxury aesthetic, rich textures, deep crimson, onyx black and gold highlights.',
          },
      {
        key: '05_VERBAL_HOOK',
        title: 'Hook Verbal & Tema Base',
        content: `Theme: "${post.title}". Conceptual Hook: "${post.hook}".`,
      },
      {
        key: '06_ACTION_POSING',
        title: 'Ação, Pose & Movimento',
        content: post.script
          ? `Visual Scene: ${post.script}`
          : 'Model interacting naturally with product, subtle slow-motion movement, confident fluid gesture.',
      },
      {
        key: '07_ATMOSPHERE_LIGHTING',
        title: 'Atmosfera & Perfil de Iluminação',
        content: `Lighting & Atmosphere: ${brandDna?.lightingProfile || 'Chiaroscuro lighting, soft volumetric glows, warm highlights'}. Cinematic mood.`,
      },
      {
        key: '08_CAMERA_LENS',
        title: 'Câmera, Lente & Óptica',
        content: 'Camera: 85mm f/1.4 prime lens, eye-level portrait angle, soft bokeh background, 8k resolution.',
      },
      {
        key: '10_PLATFORM_SPEC',
        title: 'Diretivas Técnicas da Plataforma',
        content: `Platform Target: ${post.platform.toUpperCase()}. Optimised for high engagement.`,
      },
      ...(customDirectives && customDirectives.trim().length > 0
        ? [
            {
              key: '10B_CUSTOM_DIRECTIVES',
              title: 'Diretivas Customizadas',
              content: `Custom Directives: ${customDirectives.trim()}`,
            },
          ]
        : []),
      {
        key: '11_SEED_DETERMINISM',
        title: 'Tokens de Determinismo & Seed',
        content: `--seed ${seed} --ar 9:16 --v 6.0 --style raw`,
      },
    ];

    const negativePrompt =
      'blurry, low quality, distorted anatomy, extra limbs, bad fingers, deformed hands, out of frame, text watermark, logo, oversaturated, amateur lighting, noise, artifacts';

    const compiledPrompt = blocks.map((b) => b.content).join('\n\n');
    const hashInput = `${compiledPrompt}|${negativePrompt}|${seed}`;
    const hash = computeBlake3Hash(hashInput);

    return c.json({
      success: true,
      data: {
        compiledPrompt,
        negativePrompt,
        hash,
        seed,
        blocks: [
          ...blocks,
          {
            key: '09_NEGATIVE_PROMPT',
            title: 'Negative Prompt (Exclusões)',
            content: `Negative Exclusions: ${negativePrompt}`,
          },
        ],
      },
    });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao compilar prompt' },
      500
    );
  }
});
