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

      {/* Top Right: Card / Avatar de Perfil Modernizado (Glassmorphism & Glowing Ring) */}
      <button
        type="button"
        onClick={handleProfileClick}
        aria-label="Abrir Perfil do Operador"
        className="flex items-center space-x-2 pl-1.5 pr-3 py-1 rounded-full bg-stone-900/90 border border-stone-800/80 hover:border-rose-500/40 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-rose-500/50 active:scale-95 shadow-lg shadow-black/40 backdrop-blur-xl"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-[1.5px] shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-xs font-black text-stone-100">
              {userSession.avatar || 'JA'}
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-stone-950 animate-pulse" />
        </div>

        <div className="text-left hidden xs:block">
          <span className="text-[11px] font-extrabold text-stone-100 block leading-tight truncate max-w-[70px]">
            {userSession.name.split(' ')[0]}
          </span>
          <span className="text-[9px] font-black text-rose-400/90 block uppercase tracking-wider leading-none">
            {userSession.role}
          </span>
        </div>
      </button>
    </header>
  );
}
