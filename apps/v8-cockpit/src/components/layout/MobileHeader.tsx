import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { triggerHapticFeedback, toggleFullscreen } from '../../lib/pwa-helpers';

export function MobileHeader(): React.ReactElement {
  const { userSession, selectedPolo, setSelectedPolo } = useRenderContext();
  const [showPoloDropdown, setShowPoloDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const availablePolos: Array<{ id: 'TODOS' | 'SP' | 'RJ'; name: string }> = [
    { id: 'TODOS', name: 'Todos os Polos' },
    { id: 'SP', name: 'São Paulo (Brás / 25 Março)' },
    { id: 'RJ', name: 'Rio de Janeiro (Polo Moda)' },
  ];

  const handlePoloSelect = (poloId: 'TODOS' | 'SP' | 'RJ'): void => {
    triggerHapticFeedback(6);
    setSelectedPolo(poloId);
    setShowPoloDropdown(false);
  };

  const handleFullscreenToggle = async (): Promise<void> => {
    triggerHapticFeedback(8);
    const active = await toggleFullscreen();
    setIsFullscreen(active);
  };

  const currentPoloName = availablePolos.find((p) => p.id === selectedPolo)?.name || 'Todos os Polos';

  return (
    <header className="sticky top-0 z-40 px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 border-b border-[#faf7f5]/10 bg-[#0c0a0b]/90 backdrop-blur-md transition-colors flex items-center justify-between">
      {/* Seletor de Polo / Filial estilo PWA Nativo */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            triggerHapticFeedback(4);
            setShowPoloDropdown((prev) => !prev);
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-stone-100 hover:bg-rose-500/20 transition-all min-h-[44px]"
        >
          <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate max-w-[130px] font-semibold">{currentPoloName}</span>
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showPoloDropdown && (
          <div className="absolute left-0 mt-2 w-56 rounded-2xl shadow-2xl border border-stone-800 bg-[#161214] text-stone-100 p-2 z-50 animate-in fade-in zoom-in-95">
            <div className="text-[10px] uppercase font-extrabold text-stone-400 px-3 py-1 tracking-wider">
              Polos Industriais B2B
            </div>
            {availablePolos.map((polo) => (
              <button
                key={polo.id}
                type="button"
                onClick={() => handlePoloSelect(polo.id)}
                className={`w-full text-left px-3 py-2.5 text-xs rounded-xl font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                  selectedPolo === polo.id
                    ? 'bg-rose-500 text-white font-bold'
                    : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <span>{polo.name}</span>
                {selectedPolo === polo.id && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ações Rápidas: Imersão Fullscreen + Badge do Operador */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleFullscreenToggle}
          aria-label="Modo Imersivo App"
          title="Alternar Tela Cheia"
          className="p-2.5 rounded-full bg-stone-800/80 text-rose-400 hover:bg-stone-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 5l5 5m0 0l-5 0m5 0l0-5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        <div className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate max-w-[80px]">{userSession.role.toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
}
