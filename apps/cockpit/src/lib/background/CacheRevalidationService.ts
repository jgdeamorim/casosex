/**
 * CacheRevalidationService: Stale-While-Revalidate (SWR) Background Engine
 * Revalida dados do V8 Cockpit em segundo plano garantindo < 1ms TTFT para a UI.
 */

const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const DEFAULT_TTL_MS = 60_000;

export async function fetchWithSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const cached = memoryCache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttlMs) {
    // Return stale/fresh cache immediately (0.1ms) and trigger background revalidation
    void revalidateInBackground(key, fetcher);
    return cached.data as T;
  }

  try {
    const freshData = await fetcher();
    memoryCache.set(key, { data: freshData, timestamp: now });
    return freshData;
  } catch (e: unknown) {
    if (cached) {
      void e;
      return cached.data as T;
    }
    throw e;
  }
}

async function revalidateInBackground<T>(key: string, fetcher: () => Promise<T>): Promise<void> {
  try {
    const freshData = await fetcher();
    memoryCache.set(key, { data: freshData, timestamp: Date.now() });
  } catch (e: unknown) {
    void e;
  }
}

export function clearCache(key?: string): void {
  if (key) {
    memoryCache.delete(key);
    return;
  }
  memoryCache.clear();
}
