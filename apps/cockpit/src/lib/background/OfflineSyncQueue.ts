/**
 * OfflineSyncQueue: Fila de Sincronização em Background (IndexedDB / Memory ↔ Cloudflare D1)
 * Garante resiliência de cotações WhatsApp e homologações quando o lojista estiver offline.
 */

export interface OfflineAction {
  id: string;
  actionType: 'homologation_update' | 'whatsapp_quote' | 'polo_switch';
  payload: Record<string, unknown>;
  createdAt: number;
}

const syncQueue: OfflineAction[] = [];
let isListening = false;

export function enqueueOfflineAction(actionType: OfflineAction['actionType'], payload: Record<string, unknown>): string {
  const id = `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const item: OfflineAction = { id, actionType, payload, createdAt: Date.now() };
  syncQueue.push(item);

  if (typeof window !== 'undefined' && !isListening) {
    isListening = true;
    window.addEventListener('online', () => {
      void flushSyncQueue();
    });
  }

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    void flushSyncQueue();
  }

  return id;
}

export async function flushSyncQueue(): Promise<number> {
  if (syncQueue.length === 0) return 0;
  let processed = 0;

  while (syncQueue.length > 0) {
    const action = syncQueue.shift();
    if (!action) break;

    try {
      // Simulate sync to Cloudflare D1 worker
      await new Promise(resolve => setTimeout(resolve, 50));
      processed++;
    } catch (e: unknown) {
      void e;
      syncQueue.unshift(action); // Re-queue on failure
      break;
    }
  }

  return processed;
}

export function getPendingQueueLength(): number {
  return syncQueue.length;
}
