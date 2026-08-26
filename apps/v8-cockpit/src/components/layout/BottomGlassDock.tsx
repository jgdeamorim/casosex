import React from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { canAccessTab } from '../../auth/userRules';

interface BottomGlassDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomGlassDock({ activeTab, setActiveTab }: BottomGlassDockProps): React.ReactElement {
  const { userSession } = useRenderContext();

  const dockItems = [
    { id: 'dashboard', label: 'Bento', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'map', label: 'Mapa', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'dossier', label: 'Dossiê', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'suppliers', label: 'Tabela', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'login', label: 'Login', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' }
  ];

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-dock px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around border-t border-white/10 backdrop-blur-xl bg-[#161214]/90 shadow-2xl" 
      role="navigation" 
      aria-label="Navegação móvel"
    >
      {dockItems.map(item => {
        const isAllowed = canAccessTab(userSession.role, item.id);
        const isActive = activeTab === item.id;

        if (!isAllowed) return null;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all active:scale-95 ${
              isActive
                ? 'text-rose-500 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <svg className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-rose-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
            </svg>
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute bottom-0 w-8 h-1 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
