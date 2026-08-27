/**
 * TelemetryBackgroundWorker: Coletor de métricas de performance da UI (latência, BOA Score, Z-Index shifts)
 */

export interface TelemetryMetric {
  name: string;
  value: number;
  unit: 'ms' | 'score' | 'count';
  timestamp: number;
}

const metricsBuffer: TelemetryMetric[] = [];

export function recordMetric(name: string, value: number, unit: TelemetryMetric['unit'] = 'ms'): void {
  metricsBuffer.push({
    name,
    value,
    unit,
    timestamp: Date.now()
  });

  if (metricsBuffer.length >= 20) {
    void flushMetrics();
  }
}

export async function flushMetrics(): Promise<void> {
  if (metricsBuffer.length === 0) return;
  const batch = metricsBuffer.splice(0, metricsBuffer.length);

  try {
    // Send to Redis / SNC background endpoint
    void batch;
  } catch (e: unknown) {
    void e;
  }
}

export function measureRenderTime<T>(metricName: string, fn: () => T): T {
  const start = performance.now();
  const res = fn();
  const duration = performance.now() - start;
  recordMetric(metricName, duration, 'ms');
  return res;
}
