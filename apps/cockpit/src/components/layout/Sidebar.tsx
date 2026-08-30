'use client';

import React, { useEffect, useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { canAccessTab } from '../../auth/userRules';
import { fetchHealth } from '../../lib/api';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps): React.ReactElement {
  const { userSession, suppliers } = useRenderContext();
  const [workerOnline, setWorkerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    void fetchHealth().then(ok => {
      if (mounted) setWorkerOnline(ok);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const supplierCount = suppliers.length;

  const navItems = [
    { id: 'agenda', label: 'Agenda IA (Content OS)', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'dashboard', label: 'Market Intel', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'map', label: 'Geomapeamento Comercial', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'dossier', label: 'Dossiê de Homologação', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'suppliers', label: supplierCount > 0 ? `Matriz de Fornecedores (${supplierCount})` : 'Matriz de Fornecedores', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <nav className="space-y-1" aria-label="Navegação principal">
        <p className="px-3 text-[10px] font-bold text-[#a39b94] uppercase tracking-wider mb-2">
          Navegação Principal
        </p>
        {navItems.map(item => {
          const isAllowed = canAccessTab(userSession.role, item.id);
          const isActive = activeTab === item.id;

          if (!isAllowed) return null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] ${
                isActive
                  ? 'bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/20'
                  : 'text-[#a39b94] hover:text-[#faf7f5] hover:bg-[#221c1f]'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 rounded-xl bg-[#0c0a0b] border border-white/10 text-[11px]">
        <div className="flex items-center justify-between text-[#a39b94] mb-1">
          <span>Worker Edge V8:</span>
          {workerOnline === null ? (
            <span className="text-[10px]">verificando…</span>
          ) : (
            <span
              className={`w-2 h-2 rounded-full ${workerOnline ? 'bg-[#30d158]' : 'bg-[#e11d48]'}`}
              aria-label={workerOnline ? 'API online' : 'API indisponível'}
            />
          )}
        </div>
        <p className="font-mono text-[10px] text-[#faf7f5]">
          {workerOnline ? 'API Hono online' : 'API indisponível (offline / vite dev)'}
        </p>
      </div>
    </aside>
  );
}
