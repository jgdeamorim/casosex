import React from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { canAccessTab } from '../../auth/userRules';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

interface BottomGlassDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomGlassDock({ activeTab, setActiveTab }: BottomGlassDockProps): React.ReactElement {
  const { userSession, toggleChat, isChatOpen, unreadCount } = useRenderContext();

  const dockItems = [
    { id: 'agenda', label: 'Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'dashboard', label: 'Intel', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'dossier', label: 'Dossiê', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'suppliers', label: 'Polos', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'team', label: 'Team', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
  ];

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-dock px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around border-t border-white/10 backdrop-blur-xl bg-[#161214]/95 shadow-2xl" 
      role="navigation" 
      aria-label="Navegação móvel"
    >
      {dockItems.map(item => {
        const isAllowed = canAccessTab(userSession.role, item.id);
        const isActive = item.id === 'team' ? isChatOpen : activeTab === item.id;

        if (!isAllowed) return null;

        const isTeam = item.id === 'team';
        const activeTextClass = isTeam ? 'text-emerald-400 font-bold' : 'text-rose-500 font-bold';
        const activeSvgClass = isTeam ? 'scale-110 text-emerald-400' : 'scale-110 text-rose-500';
        const activeBarClass = isTeam ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]';

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              triggerHapticFeedback(6);
              if (item.id === 'team') {
                toggleChat();
              } else {
                if (isChatOpen) {
                  toggleChat();
                }
                setActiveTab(item.id);
              }
            }}
            aria-current={isActive ? 'page' : undefined}
            className={`relative min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all active:scale-95 ${
              isActive
                ? activeTextClass
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <svg className={`w-5 h-5 transition-transform ${isActive ? activeSvgClass : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
              </svg>
              {item.id === 'team' && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-600 text-white shadow-sm shadow-emerald-500/50">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
            {isActive && (
              <span className={`absolute bottom-0 w-8 h-1 rounded-full ${activeBarClass}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

