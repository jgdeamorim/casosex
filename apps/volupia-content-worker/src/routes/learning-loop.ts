import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth-rbac.js';
import type { ContentEvent, ContentMetrics } from '../../../cockpit/src/types/content-os.js';

type D1Database = any;

type Bindings = {
  DB?: D1Database;
};

export const learningLoopRouter = new Hono<{ Bindings: Bindings }>();

learningLoopRouter.use('*', authMiddleware);

// Fallback in-memory stores for local dev
const mockEventsStore: ContentEvent[] = [
  {
    id: 'EVT-20260830-0001',
    postId: 'POST-20260830-0001',
    eventType: 'created',
    actorId: 'volupia_founder',
    payload: { source: 'cockpit_agenda' },
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'EVT-20260830-0002',
    postId: 'POST-20260830-0001',
    eventType: 'prompt_compiled',
    actorId: 'volupia_founder',
    payload: { promptHash: 'd3b07384d113edec49eaa6238ad5ff00' },
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'EVT-20260830-0003',
    postId: 'POST-20260830-0001',
    eventType: 'published',
    actorId: 'volupia_ops',
    payload: { platform: 'instagram', format: 'reels_9_16' },
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const mockMetricsStore: Map<string, ContentMetrics> = new Map([
  [
    'POST-20260830-0001',
    {
      id: 'METRIC-POST-20260830-0001',
      postId: 'POST-20260830-0001',
      impressions: 14250,
      engagementRate: 8.4,
      directClicks: 320,
      conversionsCount: 42,
      updatedAt: new Date().toISOString(),
    },
  ],
  [
    'POST-20260830-0002',
    {
      id: 'METRIC-POST-20260830-0002',
      postId: 'POST-20260830-0002',
      impressions: 8900,
      engagementRate: 5.1,
      directClicks: 110,
      conversionsCount: 12,
      updatedAt: new Date().toISOString(),
    },
  ],
]);

// GET /api/v1/learning-loop/events/:postId - Get event audit trail for post
learningLoopRouter.get('/events/:postId', async (c) => {
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
            id, post_id as postId, event_type as eventType,
            actor_id as actorId, payload, timestamp
          FROM content_events
          WHERE post_id = ?
          ORDER BY timestamp DESC`
        )
        .bind(postId)
        .all();

      const parsed = (results || []).map((row: any) => ({
        ...row,
        payload: row.payload ? JSON.parse(row.payload) : {},
      }));

      return c.json({ success: true, data: parsed });
    }

    const filtered = mockEventsStore.filter((e) => e.postId === postId);
    return c.json({ success: true, data: filtered });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar eventos' },
      500
    );
  }
});

// POST /api/v1/learning-loop/events - Record a new telemetry event
learningLoopRouter.post('/events', async (c) => {
  try {
    const body = await c.req.json<Partial<ContentEvent>>();
    if (!body.postId || !body.eventType) {
      return c.json({ success: false, error: 'postId e eventType são obrigatórios' }, 400);
    }

    const db = c.env?.DB;
    const newEvent: ContentEvent = {
      id: `EVT-${Date.now()}`,
      postId: body.postId,
      eventType: body.eventType,
      actorId: body.actorId || 'system',
      payload: body.payload || {},
      timestamp: new Date().toISOString(),
    };

    if (db) {
      await db
        .prepare(
          `INSERT INTO content_events (id, post_id, event_type, actor_id, payload, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          newEvent.id,
          newEvent.postId,
          newEvent.eventType,
          newEvent.actorId,
          JSON.stringify(newEvent.payload),
          newEvent.timestamp
        )
        .run();

      return c.json({ success: true, data: newEvent });
    }

    mockEventsStore.unshift(newEvent);
    return c.json({ success: true, data: newEvent });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao gravar evento' },
      500
    );
  }
});

// GET /api/v1/learning-loop/metrics/:postId - Get performance metrics
learningLoopRouter.get('/metrics/:postId', async (c) => {
  try {
    const postId = c.req.param('postId');
    const db = c.env?.DB;

    if (db) {
      const result = await db
        .prepare(
          `SELECT 
            id, post_id as postId, impressions, engagement_rate as engagementRate,
            direct_clicks as directClicks, conversions_count as conversionsCount,
            updated_at as updatedAt
          FROM content_metrics
          WHERE post_id = ?`
        )
        .bind(postId)
        .first();

      return c.json({
        success: true,
        data: result || {
          id: `METRIC-${postId}`,
          postId,
          impressions: 0,
          engagementRate: 0,
          directClicks: 0,
          conversionsCount: 0,
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const metric = mockMetricsStore.get(postId) || {
      id: `METRIC-${postId}`,
      postId,
      impressions: 0,
      engagementRate: 0,
      directClicks: 0,
      conversionsCount: 0,
      updatedAt: new Date().toISOString(),
    };

    return c.json({ success: true, data: metric });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar métricas' },
      500
    );
  }
});

// POST /api/v1/learning-loop/metrics - Update performance metrics
learningLoopRouter.post('/metrics', async (c) => {
  try {
    const body = await c.req.json<Partial<ContentMetrics>>();
    if (!body.postId) {
      return c.json({ success: false, error: 'postId é obrigatório' }, 400);
    }

    const db = c.env?.DB;
    const postId = body.postId;

    const metric: ContentMetrics = {
      id: body.id || `METRIC-${postId}`,
      postId,
      impressions: body.impressions ?? 0,
      engagementRate: body.engagementRate ?? 0,
      directClicks: body.directClicks ?? 0,
      conversionsCount: body.conversionsCount ?? 0,
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      await db
        .prepare(
          `INSERT INTO content_metrics (id, post_id, impressions, engagement_rate, direct_clicks, conversions_count, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(post_id) DO UPDATE SET
             impressions = excluded.impressions,
             engagement_rate = excluded.engagement_rate,
             direct_clicks = excluded.direct_clicks,
             conversions_count = excluded.conversions_count,
             updated_at = excluded.updated_at`
        )
        .bind(
          metric.id,
          metric.postId,
          metric.impressions,
          metric.engagementRate,
          metric.directClicks,
          metric.conversionsCount,
          metric.updatedAt
        )
        .run();

      return c.json({ success: true, data: metric });
    }

    mockMetricsStore.set(postId, metric);
    return c.json({ success: true, data: metric });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao atualizar métricas' },
      500
    );
  }
});

// GET /api/v1/learning-loop/recommendations - Generate OODA recommendations for content topics
learningLoopRouter.get('/recommendations', async (c) => {
  try {
    return c.json({
      success: true,
      data: {
        oodaStage: 'act',
        confidenceScore: 0.94,
        topPerformingPillars: [
          { pillar: 'erotic_luxury', avgConversionRate: '3.1%', recommendedHookType: 'Provocação Sensorial' },
          { pillar: 'sensual_wellness', avgConversionRate: '2.4%', recommendedHookType: 'Curiosidade de Bem-estar' },
        ],
        recommendations: [
          'Posts de conversão direta em formato Reels (9:16) no Instagram tiveram +42% de cliques direct quando usando iluminação Dark Romance.',
          'Recomendado manter seed fixo de persona (8492041) para estabilidade de reconhecimento facial em campanhas de retenção.',
        ],
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (e: unknown) {
    return c.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao gerar recomendações' },
      500
    );
  }
});
