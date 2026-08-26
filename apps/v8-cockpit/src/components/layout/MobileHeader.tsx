import React, { useSyncExternalStore } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribeOnline,
    () => (typeof navigator !== 'undefined' ? navigator.onLine : true),
    () => true
  );
}

export function MobileHeader(): React.ReactElement {
  const { userSession, toggleProfile } = useRenderContext();
  const isOnline = useOnlineStatus();

  const handleProfileClick = (): void => {
    triggerHapticFeedback(6);
    toggleProfile();
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 border-b border-[#faf7f5]/10 bg-[#0c0a0b]/90 backdrop-blur-md transition-colors flex items-center justify-between">
      {/* Top Left: Nome da Marca Volúpia B2B (sem logo icon) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-stone-100 tracking-wider text-sm leading-none">VOLÚPIA</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 leading-none">
            B2B
          </span>
        </div>
        <span className="text-[9px] text-stone-400 font-medium tracking-wide">Market Intel Cockpit</span>
      </div>

      {/* Top Right: Status Conectividade WiFi + Avatar Perfil */}
      <div className="flex items-center gap-2">
        <div
          title={isOnline ? 'Online • Conectado ao Cloudflare D1' : 'Offline • Armazenando no Cache PWA'}
          className="flex items-center justify-center p-1.5 rounded-full bg-stone-900/90 border border-stone-800"
        >
          <svg
            className={`w-3.5 h-3.5 ${
              isOnline ? 'text-emerald-400' : 'text-rose-500 animate-pulse'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label={isOnline ? 'Conectado à internet' : 'Modo Offline (PWA Cache)'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01M4.929 13.222a10 10 0 0114.142 0M1.5 9.5a15 15 0 0121 0"
            />
          </svg>
        </div>

        <button
          type="button"
          onClick={handleProfileClick}
          aria-label="Abrir Perfil do Operador"
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-stone-800/40 focus:outline-none active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 shadow-[0_0_12px_rgba(225,29,72,0.35)] shrink-0">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-[11px] font-black text-stone-100 tracking-tighter">
              {userSession.avatar || 'JA'}
            </div>
          </div>
          <div className="text-left hidden xs:block">
            <span className="text-xs font-bold text-stone-100 block leading-tight truncate max-w-[85px]">
              {userSession.name.split(' ')[0]}
            </span>
            <span className="text-[9px] font-black text-rose-400 block uppercase tracking-wider leading-none">
              {userSession.role}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
