import type { UserRole } from '../types';

export interface RoleConfig {
  role: UserRole;
  title: string;
  badgeColor: string;
  allowedTabs: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  founder: {
    role: 'founder',
    title: 'Founder / CEO (Jeferson)',
    badgeColor: 'bg-[#e11d48]/20 text-[#e11d48] border-[#e11d48]/40',
    allowedTabs: ['dashboard', 'map', 'dossier', 'suppliers', 'chat', 'settings']
  },
  ops: {
    role: 'ops',
    title: 'Auditora de Operações (Gláucia)',
    badgeColor: 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/40',
    allowedTabs: ['dashboard', 'map', 'dossier', 'chat']
  },
  commercial: {
    role: 'commercial',
    title: 'Gerente Comercial B2B (Bruno)',
    badgeColor: 'bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/40',
    allowedTabs: ['dashboard', 'suppliers', 'chat']
  }
};

export function canAccessTab(role: UserRole, tabName: string): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  return config.allowedTabs.includes(tabName) || config.allowedTabs.includes('all');
}
