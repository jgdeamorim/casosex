import type { HomologationStatus } from '../types';

export interface StatusMeta {
  label: string;
  color: string;
  dot: string;
}

export const STATUS_META: Record<HomologationStatus, StatusMeta> = {
  HOMOLOGADO: { label: 'Homologado', color: '#30d158', dot: 'bg-[#30d158]' },
  VISITA_PENDENTE: { label: 'Visita Pendente', color: '#eab308', dot: 'bg-[#eab308]' },
  PROSPECCAO: { label: 'Prospecção', color: '#3b82f6', dot: 'bg-[#3b82f6]' },
  PROSPECTADO: { label: 'Prospectado', color: '#6366f1', dot: 'bg-[#6366f1]' },
  REJEITADO: { label: 'Rejeitado', color: '#e11d48', dot: 'bg-[#e11d48]' }
};

export const STATUS_ORDER: HomologationStatus[] = ['HOMOLOGADO', 'VISITA_PENDENTE', 'PROSPECCAO', 'PROSPECTADO', 'REJEITADO'];

export function statusLabel(status: HomologationStatus): string {
  return STATUS_META[status].label;
}
