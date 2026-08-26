import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { UserRole } from '../../types';

interface LoginViewProps {
  onSuccess?: () => void;
}

export function LoginView({ onSuccess }: LoginViewProps): React.ReactElement {
  const { setUserRole, userSession } = useRenderContext();
  const [email, setEmail] = useState<string>(userSession.email);
  const [password, setPassword] = useState<string>('••••••••');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail.includes('jeferson') || cleanEmail.includes('founder') || cleanEmail.includes('admin')) {
      setUserRole('founder');
      setError(null);
      if (onSuccess) onSuccess();
    } else if (cleanEmail.includes('glaucia') || cleanEmail.includes('ops') || cleanEmail.includes('auditora')) {
      setUserRole('ops');
      setError(null);
      if (onSuccess) onSuccess();
    } else if (cleanEmail.includes('bruno') || cleanEmail.includes('commercial') || cleanEmail.includes('vendas')) {
      setUserRole('commercial');
      setError(null);
      if (onSuccess) onSuccess();
    } else {
      setError('E-mail não cadastrado no ecossistema Volúpia. Tente jeferson@, glaucia@ ou bruno@volupia.com.br');
    }
  };

  const selectQuickRole = (role: UserRole): void => {
    setUserRole(role);
    if (role === 'founder') setEmail('jeferson@volupia.com.br');
    if (role === 'ops') setEmail('glaucia@volupia.com.br');
    if (role === 'commercial') setEmail('bruno@volupia.com.br');
    setError(null);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient Radial Lights */}
      <div className="absolute top-[-10%] left-[20%] w-[450px] h-[450px] bg-[#e11d48]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-[#d4a373]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#161214]/90 backdrop-blur-xl border border-[#2e2428] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e11d48] to-[#d4a373] text-white font-extrabold text-2xl shadow-lg shadow-[#e11d48]/30">
            V8
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#faf7f5] tracking-tight">
            Portal Volúpia B2B
          </h2>
          <p className="text-xs text-[#a89b9b]">
            Autenticação Soberana & Controles de Auditoria Sexual Wellness
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#e11d48]/20 border border-[#e11d48]/40 text-xs text-[#fb7185] text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a89b9b] mb-1.5">
              E-mail Corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0c0a0b]/80 border border-[#2e2428] rounded-xl px-4 py-2.5 text-sm text-[#faf7f5] placeholder-[#6e6262] focus:outline-none focus:border-[#e11d48] transition-all"
              placeholder="jeferson@volupia.com.br"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a89b9b] mb-1.5">
              Senha Soberana
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0c0a0b]/80 border border-[#2e2428] rounded-xl px-4 py-2.5 text-sm text-[#faf7f5] focus:outline-none focus:border-[#e11d48] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e11d48] via-[#c0173e] to-[#9f1239] text-white text-sm font-bold shadow-lg shadow-[#e11d48]/25 hover:brightness-110 active:scale-[0.99] transition-all"
          >
            Acessar Cockpit V8
          </button>
        </form>

        <div className="pt-5 border-t border-[#2e2428] space-y-3">
          <p className="text-xs text-[#a89b9b] text-center font-medium">
            Seleção Rápida de Perfil de Teste (1-Clique):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => selectQuickRole('founder')}
              className="py-2.5 px-2 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/35 text-[#fb7185] hover:bg-[#e11d48]/25 text-xs font-bold transition-all text-center"
            >
              Jeferson (CEO)
            </button>
            <button
              onClick={() => selectQuickRole('ops')}
              className="py-2.5 px-2 rounded-xl bg-[#d4a373]/15 border border-[#d4a373]/35 text-[#f5d0a9] hover:bg-[#d4a373]/25 text-xs font-bold transition-all text-center"
            >
              Gláucia (Ops)
            </button>
            <button
              onClick={() => selectQuickRole('commercial')}
              className="py-2.5 px-2 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/35 text-[#93c5fd] hover:bg-[#3b82f6]/25 text-xs font-bold transition-all text-center"
            >
              Bruno (Vendas)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
