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
    allowedTabs: ['agenda', 'dashboard', 'map', 'dossier', 'suppliers', 'chat', 'team', 'login']
  },
  ops: {
    role: 'ops',
    title: 'Auditora de Operações (Gláucia)',
    badgeColor: 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/40',
    allowedTabs: ['agenda', 'dashboard', 'map', 'dossier', 'suppliers', 'chat', 'team', 'login']
  },
  commercial: {
    role: 'commercial',
    title: 'Gerente Comercial B2B (Bruno)',
    badgeColor: 'bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/40',
    allowedTabs: ['agenda', 'dashboard', 'suppliers', 'chat', 'team', 'login']
  }
};

/**
 * Modo Demonstração: este gating é apenas uma affordance de UI para a
 * visualização por perfil — não é uma barreira de segurança real. A API
 * do worker V8 não exige autenticação.
 */
export function canAccessTab(role: UserRole, tabName: string): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  if (tabName === 'team') return config.allowedTabs.includes('chat') || config.allowedTabs.includes('team');
  return config.allowedTabs.includes(tabName);
}

export function canUpdateStatus(role: UserRole): boolean {
  return role === 'founder' || role === 'ops';
}

