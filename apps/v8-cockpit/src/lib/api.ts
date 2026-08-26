import type { HomologationDossier, HomologationStatus } from '../types';

const API_BASE = '/api/v8';

export interface StatusOverride {
  supplierId: string;
  status: HomologationStatus;
  updatedBy: string;
  updatedAt: number;
}

async function handle<T>(resp: Response): Promise<T> {
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`API ${resp.status}: ${body}`);
  }
  return resp.json() as Promise<T>;
}

export async function fetchStatusOverrides(): Promise<Record<string, HomologationStatus>> {
  const data = await handle<{ overrides: StatusOverride[] }>(await fetch(`${API_BASE}/status`));
  const map: Record<string, HomologationStatus> = {};
  for (const o of data.overrides ?? []) {
    map[o.supplierId] = o.status;
  }
  return map;
}

export async function patchSupplierStatus(
  supplierId: string,
  status: HomologationStatus,
  updatedBy: string
): Promise<void> {
  await handle<{ ok: boolean }>(
    await fetch(`${API_BASE}/suppliers/${encodeURIComponent(supplierId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, updatedBy })
    })
  );
}

export async function fetchDossier(supplierId: string): Promise<HomologationDossier | null> {
  const resp = await fetch(`${API_BASE}/dossier/${encodeURIComponent(supplierId)}`);
  if (resp.status === 404) return null;
  const data = await handle<{ dossier: HomologationDossier }>(resp);
  return data.dossier;
}

export interface DossierInput {
  supplierId: string;
  supplierName: string;
  qualityScore: number | null;
  anvisaBodySafe: boolean;
  moq: string;
  paymentTerms: string;
  catalogUrl?: string;
  catalogFileName?: string;
  auditNotes: string;
  status: HomologationStatus;
  auditorName: string;
}

export async function putDossier(input: DossierInput): Promise<HomologationDossier> {
  const data = await handle<{ dossier: HomologationDossier }>(
    await fetch(`${API_BASE}/dossier/${encodeURIComponent(input.supplierId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    })
  );
  return data.dossier;
}

export async function fetchHealth(): Promise<boolean> {
  try {
    const resp = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    return resp.ok;
  } catch (e: unknown) {
    void e;
    return false;
  }
}

/* ==========================================================================
 *  OFFLINE PWA & LOCALSTORAGE CACHE ENGINE
 * ========================================================================== */

const LOCAL_OVERRIDES_KEY = 'v8_status_overrides';
const PENDING_SYNC_KEY = 'v8_pending_sync_queue';

export interface PendingSyncItem {
  supplierId: string;
  status: HomologationStatus;
  updatedBy: string;
  timestamp: number;
}

export function getLocalStatusOverrides(): Record<string, HomologationStatus> {
  try {
    const raw = localStorage.getItem(LOCAL_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, HomologationStatus>) : {};
  } catch (e: unknown) {
    void e;
    return {};
  }
}

export function saveLocalStatusOverride(supplierId: string, status: HomologationStatus): void {
  try {
    const current = getLocalStatusOverrides();
    current[supplierId] = status;
    localStorage.setItem(LOCAL_OVERRIDES_KEY, JSON.stringify(current));
  } catch (e: unknown) {
    void e;
  }
}

export function getPendingSyncQueue(): PendingSyncItem[] {
  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    return raw ? (JSON.parse(raw) as PendingSyncItem[]) : [];
  } catch (e: unknown) {
    void e;
    return [];
  }
}

export function enqueuePendingSync(supplierId: string, status: HomologationStatus, updatedBy: string): void {
  try {
    const queue = getPendingSyncQueue().filter(i => i.supplierId !== supplierId);
    queue.push({ supplierId, status, updatedBy, timestamp: Date.now() });
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(queue));
  } catch (e: unknown) {
    void e;
  }
}

export function removeFromPendingSync(supplierId: string): void {
  try {
    const queue = getPendingSyncQueue().filter(i => i.supplierId !== supplierId);
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(queue));
  } catch (e: unknown) {
    void e;
  }
}

export async function flushPendingSyncQueue(): Promise<number> {
  const queue = getPendingSyncQueue();
  if (queue.length === 0) return 0;

  let syncedCount = 0;
  const remaining: PendingSyncItem[] = [];

  for (const item of queue) {
    try {
      await patchSupplierStatus(item.supplierId, item.status, item.updatedBy);
      syncedCount++;
    } catch {
      remaining.push(item);
    }
  }

  try {
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(remaining));
  } catch (e: unknown) {
    void e;
  }

  return syncedCount;
}
