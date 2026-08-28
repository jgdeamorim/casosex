import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { ROLE_CONFIGS } from '../../auth/userRules';
import type { UserRole } from '../../types';

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps): React.ReactElement {
  const { userSession, setUserRole, selectedPolo, setSelectedPolo, toggleChat, unreadCount } = useRenderContext();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const currentConfig = ROLE_CONFIGS[userSession.role];

  return (
    <header className="h-16 px-4 md:px-6 glass-panel border-b border-[#ffffff]/10 flex items-center justify-between sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e11d48] to-[#d4a373] flex items-center justify-center font-extrabold text-white text-xs shadow-lg shadow-[#e11d48]/20 shrink-0">
            V8
          </div>
          <div className="shrink-0">
            <h1 className="text-sm font-bold text-[#faf7f5] leading-none whitespace-nowrap">Volúpia Cockpit</h1>
            <span className="text-[10px] text-[#a39b94] font-medium whitespace-nowrap">B2B Intelligence & Auditoria</span>
          </div>
        </div>

        {/* Polo Filter - Unified Segmented Control */}
        <div className="hidden lg:flex items-center bg-[#0c0a0b] p-1 rounded-xl border border-white/10 text-xs shrink-0">
          {(['TODOS', 'SP', 'RJ'] as const).map(polo => (
            <button
              key={polo}
              type="button"
              onClick={() => setSelectedPolo(polo)}
              className={`px-3 py-2 min-h-[44px] rounded-lg font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] ${
                selectedPolo === polo
                  ? 'bg-[#e11d48] text-white shadow-md shadow-[#e11d48]/20 border border-[#e11d48]/50'
                  : 'text-[#a39b94] hover:text-[#faf7f5] hover:bg-[#221c1f]'
              }`}
            >
              {polo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* User Role Switcher (modo demonstração) */}
        <div
          role="group"
          aria-label="Trocar perfil de demonstração"
          className="hidden sm:flex items-center gap-1 bg-[#0c0a0b] p-1 rounded-xl border border-white/10 text-xs shrink-0"
        >
          <span className="px-1.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#a39b94] border-r border-white/10 mr-0.5 whitespace-nowrap">
            Demo
          </span>
          {(['founder', 'ops', 'commercial'] as const).map(role => (
            <button
              key={role}
              type="button"
              onClick={() => setUserRole(role as UserRole)}
              aria-pressed={userSession.role === role}
              className={`px-2.5 py-2 min-h-[44px] rounded-lg font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] ${
                userSession.role === role
                  ? 'bg-[#e11d48] text-white shadow-sm border border-[#e11d48]/50'
                  : 'text-[#a39b94] hover:text-[#faf7f5] hover:bg-[#221c1f]'
              }`}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Profile Pill with Dropdown Popover */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsLoginOpen(!isLoginOpen)}
            aria-expanded={isLoginOpen}
            aria-haspopup="dialog"
            className={`flex items-center gap-2.5 px-3 py-1.5 min-h-[44px] rounded-xl border transition-all text-left shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] ${
              isLoginOpen 
                ? 'bg-[#221c1f] border-[#e11d48]/50 shadow-lg shadow-[#e11d48]/10' 
                : 'bg-[#161214] border-white/10 hover:border-white/20'
            }`}
            title="Gerenciar Perfil B2B & Escopos"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#d4a373] flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0 overflow-hidden">
              {userSession.picture ? (
                <img src={userSession.picture} alt={userSession.name} className="w-full h-full object-cover" />
              ) : (
                userSession.avatar
              )}
            </div>
            <div className="text-left hidden sm:block shrink-0">
              <p className="text-xs font-bold text-[#faf7f5] leading-none mb-1 whitespace-nowrap">{userSession.name}</p>
              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold whitespace-nowrap ${currentConfig.badgeColor}`}>
                {currentConfig.title.split(' ')[0]}
              </span>
            </div>
            <svg className={`w-3.5 h-3.5 text-[#a39b94] transition-transform duration-200 ${isLoginOpen ? 'rotate-180 text-[#e11d48]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile & Scope Popover */}
          {isLoginOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-[#e11d48]/30 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div>
                  <h3 className="text-xs font-bold text-[#faf7f5] uppercase tracking-wider">Perfil & Escopo B2B</h3>
                  <p className="text-[10px] text-[#a39b94]">Selecione a identidade operacional</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/30">
                  DEMO
                </span>
              </div>

              <div className="space-y-2">
                {(['founder', 'ops', 'commercial'] as const).map(role => {
                  const cfg = ROLE_CONFIGS[role as UserRole];
                  const active = userSession.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setUserRole(role as UserRole);
                        setIsLoginOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-[#e11d48]/15 border-[#e11d48]/50 shadow-md shadow-[#e11d48]/10'
                          : 'bg-[#0c0a0b] border-white/10 hover:border-white/20 hover:bg-[#1a1518]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs ${cfg.badgeColor}`}>
                          {role[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#faf7f5] truncate">{cfg.title}</p>
                          <p className="text-[10px] text-[#a39b94] font-mono capitalize">{role} access</p>
                        </div>
                      </div>
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] text-[#a39b94]">
                  <span>Escopos ativos:</span>
                  <span className="font-mono text-[#faf7f5]">{currentConfig.allowedTabs.length} rotas liberadas</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(false);
                    onLogout?.();
                  }}
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-[#e11d48]/20 text-[#faf7f5] hover:text-[#e11d48] border border-white/10 hover:border-[#e11d48]/40 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Toggle Button */}
        <button
          type="button"
          onClick={toggleChat}
          aria-label="Abrir ou fechar chat da equipe"
          className="relative p-2.5 min-h-[44px] rounded-xl bg-[#161214] border border-white/10 text-[#faf7f5] hover:border-[#e11d48]/50 transition-all shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]"
          title="Abrir Chat da Equipe"
        >
          <svg className="w-5 h-5 text-[#a39b94] hover:text-[#faf7f5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e11d48] text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
