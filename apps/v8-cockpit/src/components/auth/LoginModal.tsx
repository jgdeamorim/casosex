import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps): React.ReactElement | null {
  const { setUserRole, userSession } = useRenderContext();
  const [email, setEmail] = useState<string>(userSession.email);
  const [password, setPassword] = useState<string>('••••••••');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail.includes('jeferson') || cleanEmail.includes('founder') || cleanEmail.includes('admin')) {
      setUserRole('founder');
      setError(null);
      onClose();
    } else if (cleanEmail.includes('glaucia') || cleanEmail.includes('ops') || cleanEmail.includes('auditora')) {
      setUserRole('ops');
      setError(null);
      onClose();
    } else if (cleanEmail.includes('bruno') || cleanEmail.includes('commercial') || cleanEmail.includes('vendas')) {
      setUserRole('commercial');
      setError(null);
      onClose();
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#141012] border border-[#e11d48]/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e11d48]/20 text-[#e11d48] font-bold text-xl">
            V8
          </div>
          <h2 className="text-2xl font-bold text-[#faf7f5]">Volúpia Cockpit B2B</h2>
          <p className="text-xs text-[#a39b94]">Autenticação Soberana & Regras de Acesso por E-mail</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#e11d48]/20 border border-[#e11d48]/40 text-xs text-[#e11d48] text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-[#a39b94] mb-1 font-medium">E-mail Corporativo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1c181a] border border-[#2e2629] rounded-lg px-3 py-2 text-sm text-[#faf7f5] focus:outline-none focus:border-[#e11d48] transition-colors"
              placeholder="seu.email@volupia.com.br"
            />
          </div>

          <div>
            <label className="block text-xs text-[#a39b94] mb-1 font-medium">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1c181a] border border-[#2e2629] rounded-lg px-3 py-2 text-sm text-[#faf7f5] focus:outline-none focus:border-[#e11d48] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#e11d48] to-[#9f1239] text-white text-sm font-bold shadow-lg shadow-[#e11d48]/20 hover:brightness-110 transition-all"
          >
            Entrar no Cockpit V8
          </button>
        </form>

        <div className="pt-4 border-t border-[#2e2629] space-y-2">
          <p className="text-xs text-[#a39b94] text-center">Ou selecione um perfil de teste 1-Clique:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => selectQuickRole('founder')}
              className="p-2 rounded-lg bg-[#e11d48]/10 border border-[#e11d48]/30 text-[#e11d48] hover:bg-[#e11d48]/20 font-bold transition-all text-center"
            >
              Jeferson (CEO)
            </button>
            <button
              onClick={() => selectQuickRole('ops')}
              className="p-2 rounded-lg bg-[#eab308]/10 border border-[#eab308]/30 text-[#eab308] hover:bg-[#eab308]/20 font-bold transition-all text-center"
            >
              Gláucia (Ops)
            </button>
            <button
              onClick={() => selectQuickRole('commercial')}
              className="p-2 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/20 font-bold transition-all text-center"
            >
              Bruno (Vendas)
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full text-center text-xs text-[#a39b94] hover:text-[#faf7f5] transition-colors"
        >
          Fechar Tela de Login
        </button>
      </div>
    </div>
  );
}
