import { Hono } from 'hono';
import { blake3 } from '@noble/hashes/blake3.js';
import { bytesToHex } from '@noble/hashes/utils.js';
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
 * Pure Deterministic Hash (BLAKE3-standard 64-char hex fingerprint via @noble/hashes)
 * Computes a cryptographic 256-bit BLAKE3 hash string for parity with Cockpit frontend.
 */
function computeBlake3Hash(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return bytesToHex(blake3(bytes));
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
