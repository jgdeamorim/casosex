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
