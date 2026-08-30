import { Redis } from 'ioredis';
import type { ContentEvent } from '../../../cockpit/src/types/content-os.js';

let redisInstance: InstanceType<typeof Redis> | null = null;
let isRedisAvailable = true;

function getRedisClient(): InstanceType<typeof Redis> | null {
  if (!isRedisAvailable) return null;

  if (!redisInstance) {
    try {
      redisInstance = new Redis({
        host: '127.0.0.1',
        port: 6396,
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        retryStrategy(times: number) {
          if (times > 3) {
            isRedisAvailable = false;
            console.warn('⚠️ [OODA Redis] Redis :6396 indisponível após 3 tentativas. Alternando para modo offline fail-soft.');
            return null;
          }
          return Math.min(times * 500, 2000);
        },
      });

      redisInstance.on('error', (err: unknown) => {
        console.warn('⚠️ [OODA Redis Error]:', err instanceof Error ? err.message : String(err));
      });
    } catch (e: unknown) {
      isRedisAvailable = false;
      console.warn('⚠️ [OODA Redis Init Failed]:', e instanceof Error ? e.message : String(e));
      return null;
    }
  }

  return redisInstance;
}

/**
 * Publica evento telemétrico assíncrono no Redis OODA (:6396)
 * Namespace: casosex:volupia:ooda:events (Corpus B - Tenant Volúpia)
 */
export async function publishOodaEvent(event: ContentEvent): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    const payloadStr = JSON.stringify(event);

    const pipeline = redis.pipeline();
    // 1. LPUSH no barramento de eventos do tenant
    pipeline.lpush('casosex:volupia:ooda:events', payloadStr);
    // 2. LTRIM para manter no máximo 1000 eventos no buffer
    pipeline.ltrim('casosex:volupia:ooda:events', 0, 999);
    // 3. SET ponteiro de último evento
    pipeline.set('casosex:volupia:ooda:latest', payloadStr);
    // 4. Atualizar o estágio OBSERVE do OODA loop da Volúpia
    pipeline.set(
      'casosex:volupia:ooda:stage:observe',
      `EVENT_RECEIVED: ${event.eventType} | Post: ${event.postId} | TS: ${event.timestamp}`
    );

    await pipeline.exec();
    return true;
  } catch (e: unknown) {
    console.warn('⚠️ [OODA Redis Publish Error]:', e instanceof Error ? e.message : String(e));
    return false;
  }
}
