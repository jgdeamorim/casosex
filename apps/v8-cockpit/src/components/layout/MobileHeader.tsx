import React from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

export function MobileHeader(): React.ReactElement {
  const { userSession, toggleProfile } = useRenderContext();

  const handleProfileClick = (): void => {
    triggerHapticFeedback(6);
    toggleProfile();
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 border-b border-[#faf7f5]/10 bg-[#0c0a0b]/90 backdrop-blur-md transition-colors flex items-center justify-between">
      {/* Top Left: Logo Volúpia B2B */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-black text-xs shadow-md shadow-rose-500/20">
          V
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-stone-100 tracking-wider text-sm leading-none">VOLÚPIA</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 leading-none">
              B2B
            </span>
          </div>
          <span className="text-[9px] text-stone-400 font-medium tracking-wide">Market Intel Cockpit</span>
        </div>
      </div>

      {/* Top Right: Card / Avatar de Perfil Clicável */}
      <button
        type="button"
        onClick={handleProfileClick}
        aria-label="Abrir Perfil do Operador"
        className="flex items-center space-x-2 p-1.5 rounded-full bg-stone-900/80 border border-stone-800 hover:border-rose-500/50 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-rose-500 active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-xs font-black text-white shadow-sm shrink-0">
          {userSession.avatar || 'JA'}
        </div>
        <div className="text-left pr-2 hidden xs:block">
          <span className="text-[11px] font-bold text-stone-200 block leading-tight truncate max-w-[70px]">
            {userSession.name.split(' ')[0]}
          </span>
          <span className="text-[9px] font-extrabold text-rose-400 block uppercase leading-none">
            {userSession.role}
          </span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
      </button>
    </header>
  );
}
