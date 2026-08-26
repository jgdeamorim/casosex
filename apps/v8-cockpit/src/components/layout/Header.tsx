import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { ROLE_CONFIGS } from '../../auth/userRules';
import type { UserRole } from '../../types';
import { LoginModal } from '../auth/LoginModal';

export function Header(): React.ReactElement {
  const { userSession, setUserRole, selectedPolo, setSelectedPolo, toggleChat, unreadCount } = useRenderContext();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const currentConfig = ROLE_CONFIGS[userSession.role];

  return (
    <header className="h-16 px-6 glass-panel border-b border-[#ffffff]/10 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e11d48] to-[#d4a373] flex items-center justify-center font-extrabold text-white text-xs shadow-lg shadow-[#e11d48]/20">
            V8
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#faf7f5] leading-none">Volúpia Cockpit</h1>
            <span className="text-[10px] text-[#a39b94] font-medium">B2B Intelligence & Auditoria</span>
          </div>
        </div>

        {/* Polo Filter */}
        <div className="hidden md:flex items-center bg-[#0c0a0b] p-1 rounded-lg border border-white/10 text-xs">
          {(['TODOS', 'SP', 'RJ'] as const).map(polo => (
            <button
              key={polo}
              onClick={() => setSelectedPolo(polo)}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                selectedPolo === polo
                  ? 'bg-[#e11d48] text-white shadow-sm'
                  : 'text-[#a39b94] hover:text-[#faf7f5]'
              }`}
            >
              {polo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Role Switcher (modo demonstração) */}
        <div
          role="group"
          aria-label="Trocar perfil de demonstração"
          className="flex items-center gap-1 bg-[#0c0a0b] p-1 rounded-lg border border-white/10 text-xs"
        >
          <span className="px-1.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#a39b94] border-r border-white/10 mr-0.5">
            Demo
          </span>
          {(['founder', 'ops', 'commercial'] as const).map(role => (
            <button
              key={role}
              type="button"
              onClick={() => setUserRole(role as UserRole)}
              aria-pressed={userSession.role === role}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                userSession.role === role
                  ? 'bg-[#221c1f] text-[#faf7f5] border border-white/10 font-bold'
                  : 'text-[#a39b94] hover:text-[#faf7f5]'
              }`}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Profile Pill & Login Launcher */}
        <button
          type="button"
          onClick={() => setIsLoginOpen(true)}
          className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 hover:opacity-80 transition-opacity text-left"
          title="Trocar perfil de demonstração"
        >
          <div className="w-8 h-8 rounded-full bg-[#221c1f] border border-white/10 flex items-center justify-center font-bold text-xs text-[#faf7f5]">
            {userSession.avatar}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#faf7f5]">{userSession.name}</p>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${currentConfig.badgeColor}`}>
              {currentConfig.title.split(' ')[0]}
            </span>
          </div>
        </button>

        {/* Chat Toggle Button */}
        <button
          type="button"
          onClick={toggleChat}
          aria-label="Abrir ou fechar chat da equipe"
          className="relative p-2.5 rounded-lg bg-[#161214] border border-white/10 text-[#faf7f5] hover:border-[#e11d48]/50 transition-all"
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

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}
