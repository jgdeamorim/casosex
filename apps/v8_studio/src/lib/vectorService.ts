import type { ContentMetrics } from '../types/content-os.js';

interface VectorPointPayload {
  kind: string;
  tag: string;
  postId: string;
  impressions: number;
  engagementRate: number;
  conversionsCount: number;
  updatedAt: string;
  source: string;
}

/**
 * Vetoriza posts de alta conversão no Qdrant :6352 (coleção adsentice-self com tag=volupia)
 * Doutrina #7 (Corpus B - Tenant Volúpia)
 */
export async function vectorizeHighConversionPost(
  postId: string,
  metrics: ContentMetrics
): Promise<boolean> {
  // Threshold de alta conversão: engagementRate >= 7.0% ou conversionsCount >= 10
  if (metrics.engagementRate < 7.0 && metrics.conversionsCount < 10) {
    return false;
  }

  try {
    const textToEmbed = `Volúpia High Conversion Post ${postId}. Engagement Rate: ${metrics.engagementRate}%, Conversions: ${metrics.conversionsCount}, Direct Clicks: ${metrics.directClicks}, Impressions: ${metrics.impressions}.`;

    // 1. Chamar Embed Service :8081 (mpnet 768d)
    let vector: number[] | null = null;
    try {
      const embedRes = await fetch('http://127.0.0.1:8081/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToEmbed }),
      });

      if (embedRes.ok) {
        const embedData = (await embedRes.json()) as { embedding?: number[] };
        if (Array.isArray(embedData.embedding)) {
          vector = embedData.embedding;
        }
      }
    } catch (e: unknown) {
      console.warn('⚠️ [Embed Service :8081] Falha ao gerar embedding, usando fallback pseudo-randômico 768d:', e instanceof Error ? e.message : String(e));
    }

    // Fallback de vetor determinístico se embed service local estiver indisponível
    if (!vector) {
      vector = new Array(768).fill(0).map((_, i) => Math.sin(i + postId.length) * 0.1);
    }

    // 2. Indexar ponto no Qdrant :6352 (coleção adsentice-self)
    const payload: VectorPointPayload = {
      kind: 'high_conversion_post',
      tag: 'volupia',
      postId,
      impressions: metrics.impressions,
      engagementRate: metrics.engagementRate,
      conversionsCount: metrics.conversionsCount,
      updatedAt: metrics.updatedAt,
      source: 'v8_studio/learning-loop',
    };

    // Converter string ID para formato uint64 ou UUID aceito pelo Qdrant
    const pointId = Math.abs(
      postId.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    );

    const qdrantRes = await fetch(
      'http://127.0.0.1:6352/collections/adsentice-self/points?wait=true',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: [
            {
              id: pointId,
              vector,
              payload,
            },
          ],
        }),
      }
    );

    if (!qdrantRes.ok) {
      console.warn('⚠️ [Qdrant :6352] Resposta com erro status:', qdrantRes.status);
      return false;
    }

    return true;
  } catch (e: unknown) {
    console.warn('⚠️ [Qdrant Vectorization Fail-soft]:', e instanceof Error ? e.message : String(e));
    return false;
  }
}
