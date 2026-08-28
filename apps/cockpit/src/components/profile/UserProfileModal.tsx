import React, { useRef, useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { triggerHapticFeedback, toggleFullscreen } from '../../lib/pwa-helpers';

interface UserProfileModalProps {
  onLogout?: () => void;
}

export function UserProfileModal({ onLogout }: UserProfileModalProps): React.ReactElement | null {
  const { isProfileOpen, toggleProfile, userSession, setUserRole } = useRenderContext();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('v8_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.getAttribute('data-theme') !== 'light' && !document.documentElement.classList.contains('light-theme');
    }
    return true;
  });

  useFocusTrap(modalRef, isProfileOpen, toggleProfile);

  if (!isProfileOpen) return null;

  const handleFullscreenToggle = async (): Promise<void> => {
    triggerHapticFeedback(8);
    const active = await toggleFullscreen();
    setIsFullscreen(active);
  };

  const handleThemeToggle = (): void => {
    triggerHapticFeedback(6);
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light-theme', 'light');
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('v8_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light-theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('v8_theme', 'light');
      }
      return next;
    });
  };

  const handleClose = (): void => {
    triggerHapticFeedback(6);
    toggleProfile();
  };

  const handleSignOut = (): void => {
    triggerHapticFeedback(10);
    toggleProfile();
    if (onLogout) onLogout();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Perfil do Usuário Logado"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#161214] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header com Botão X Moderno */}
        <div className="px-6 py-4 border-b border-stone-800/80 flex items-center justify-between bg-[#0c0a0b]/80 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-200">
              Perfil do Operador
            </h3>
          </div>

          {/* Botão de Fechar X Moderno com Haptics */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar Modal de Perfil"
            className="w-9 h-9 rounded-full bg-stone-800/80 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[44px] min-w-[44px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Informações Principais do Usuário */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="relative group cursor-pointer shrink-0" title="Clique para alterar foto de perfil">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-rose-500/20 overflow-hidden">
                {userSession.picture ? (
                  <img src={userSession.picture} alt={userSession.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  userSession.avatar || 'JA'
                )}
              </div>
              <label className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity cursor-pointer text-stone-200 text-[10px] font-bold">
                📷 Alterar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const result = evt.target?.result as string;
                        if (result) {
                          setUserRole(userSession.role, result);
                          triggerHapticFeedback(10);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-stone-100 truncate">{userSession.name}</h4>
              <p className="text-xs text-stone-400 truncate">{userSession.email}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {userSession.role.toUpperCase()}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Sessão Soberana Active</span>
              </div>
            </div>
          </div>

          {/* Toggles Rápidos (Fullscreen e Light/Dark Mode) */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-black text-stone-400 uppercase tracking-wider px-1">
              Controles de Visualização App
            </h5>

            <div className="grid grid-cols-2 gap-3">
              {/* Toggle Fullscreen */}
              <button
                type="button"
                onClick={handleFullscreenToggle}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-start gap-2 text-left min-h-[56px] ${
                  isFullscreen
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    : 'bg-stone-900/40 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isFullscreen ? 'bg-rose-500 text-white' : 'bg-stone-800 text-stone-400'}`}>
                    {isFullscreen ? 'ATIVO' : 'DESATIVADO'}
                  </span>
                </div>
                <span className="text-xs font-bold">Imersão Fullscreen</span>
              </button>

              {/* Toggle Dark / Light Theme */}
              <button
                type="button"
                onClick={handleThemeToggle}
                className="p-3.5 rounded-2xl border bg-stone-900/40 border-stone-800 text-stone-300 hover:border-stone-700 transition-all flex flex-col items-start gap-2 text-left min-h-[56px]"
              >
                <div className="flex items-center justify-between w-full">
                  {isDarkMode ? (
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                    {isDarkMode ? 'DARK' : 'LIGHT'}
                  </span>
                </div>
                <span className="text-xs font-bold">Modo de Cores</span>
              </button>
            </div>
          </div>



          {/* Botão Sair / Logoff */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold transition-all flex items-center justify-center space-x-2 min-h-[48px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
