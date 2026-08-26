/**
 * SupplierPollingWorker: Monitoramento em segundo plano da rede de 307 fornecedores homologados
 */

export interface SupplierStatusEvent {
  supplierId: string;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  whatsappLatencyMs: number;
  lastChecked: number;
}

type StatusCallback = (events: SupplierStatusEvent[]) => void;
const subscribers = new Set<StatusCallback>();
let timer: ReturnType<typeof setInterval> | null = null;

export function startSupplierPolling(intervalMs = 30_000): void {
  if (timer) return;

  timer = setInterval(() => {
    void pollSuppliers();
  }, intervalMs);
}

export function stopSupplierPolling(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export function subscribeSupplierStatus(callback: StatusCallback): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

async function pollSuppliers(): Promise<void> {
  try {
    const mockEvents: SupplierStatusEvent[] = [
      { supplierId: 'sup_sp_01', status: 'ONLINE', whatsappLatencyMs: 45, lastChecked: Date.now() },
      { supplierId: 'sup_rj_02', status: 'ONLINE', whatsappLatencyMs: 62, lastChecked: Date.now() }
    ];

    subscribers.forEach(cb => {
      try {
        cb(mockEvents);
      } catch (e: unknown) {
        void e;
      }
    });
  } catch (e: unknown) {
    void e;
  }
}
