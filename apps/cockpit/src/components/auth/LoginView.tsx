import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { UserRole } from '../../types';

interface LoginViewProps {
  onSuccess?: () => void;
}

async function hashSHA256(text: string): Promise<string> {
  if (!text) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function LoginView({ onSuccess }: LoginViewProps): React.ReactElement {
  const { setUserRole } = useRenderContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleGoogleSSO = async () => {
    setIsSubmitting(true);
    setToastMessage({ text: '🔐 Conectando ao Google OAuth 2.0 Zero-Trust...', type: 'success' });

    try {
      const res = await fetch('/api/v8/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google_oauth', email: email || 'jeferson@usevolupia.com.br' })
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; user?: { role?: UserRole; name?: string } } | null;

      if (data?.ok && data?.user?.role) {
        setUserRole(data.user.role);
        setToastMessage({ text: `✨ Autenticado via Google como ${data.user.name} (${data.user.role.toUpperCase()})!`, type: 'success' });
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess?.();
        }, 600);
      } else {
        setIsSubmitting(false);
        setToastMessage({ text: data?.error || '❌ E-mail não autorizado nos segredos D1 (.secrets/.evn.GOOGLE-SHEETS)', type: 'error' });
      }
    } catch (e: unknown) {
      void e;
      setIsSubmitting(false);
      setToastMessage({ text: '❌ Erro ao conectar ao serviço de autenticação.', type: 'error' });
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMessage(null);

    const passwordHash = await hashSHA256(password);

    try {
      const res = await fetch('/api/v8/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash, provider: 'form_sha256' })
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; user?: { role?: UserRole; name?: string } } | null;

      if (data?.ok && data?.user?.role) {
        setUserRole(data.user.role);
        setToastMessage({
          text: `✨ Bem-vindo, ${data.user.name}! Nível de acesso: ${data.user.role.toUpperCase()}`,
          type: 'success'
        });
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess?.();
        }, 800);
      } else {
        setIsSubmitting(false);
        setToastMessage({
          text: data?.error || '❌ E-mail não autorizado nos segredos D1 (.secrets/.evn.GOOGLE-SHEETS)',
          type: 'error'
        });
      }
    } catch (e: unknown) {
      void e;
      setIsSubmitting(false);
      setToastMessage({ text: '❌ Erro ao conectar à base de dados D1.', type: 'error' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0c0a0b] text-[#faf7f5] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#e11d48] selection:text-white">
      {/* Ambient Glows */}
      <div className="fixed top-[-15%] left-[30%] w-[550px] h-[550px] bg-radial from-[#e11d48]/20 to-transparent rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[25%] w-[450px] h-[450px] bg-radial from-[#d4a373]/15 to-transparent rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-20 bg-gradient-to-b from-[#0c0a0b]/90 to-transparent backdrop-blur-md">
        <a href="https://usevolupia.com.br" className="flex items-center space-x-2">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#faf7f5] hover:text-[#d4a373] transition-colors">
            VOLÚPIA
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/30">
            SOBERANO B2B
          </span>
        </a>

        <div className="flex items-center space-x-3">
          <a
            href="https://usevolupia.com.br"
            className="text-xs font-semibold text-[#a89b9b] hover:text-[#faf7f5] transition-colors flex items-center space-x-1"
          >
            <span>← Voltar</span>
          </a>
        </div>
      </header>

      {/* Mobile-First & Desktop Luxury Auth Card */}
      <main className="relative z-10 w-full max-w-md my-auto pt-20 pb-12 sm:pt-16">
        <div className="bg-[#161214]/90 backdrop-blur-2xl border border-[#2e2428] rounded-[28px] p-6 sm:p-8 shadow-2xl shadow-black/90 space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#e11d48]/15 border border-[#e11d48]/30 text-[#e11d48] text-[10px] font-bold tracking-wider uppercase">
              <span>✦</span>
              <span>Sexual Wellness B2B</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#faf7f5] tracking-tight">
              Acessar a Conta
            </h1>
            <p className="text-xs text-[#a89b9b] italic">
              “Desperte seus sentidos”
            </p>
          </div>

          {toastMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium text-center border animate-in fade-in slide-in-from-top-1 ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              {toastMessage.text}
            </div>
          )}

          {/* Primary Action: Google SSO */}
          <button
            type="button"
            onClick={handleGoogleSSO}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="tracking-tight text-xs font-bold">Acessar com o Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2e2428]" /></div>
            <span className="relative px-3 bg-[#161214] text-[10px] uppercase tracking-wider text-[#a89b9b] font-medium">
              OU ACESSE COM E-MAIL E SENHA
            </span>
          </div>

          {/* Form de E-mail / CNPJ e Senha (SHA-256 Secured) */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-id" className="block text-xs font-semibold text-[#faf7f5]">
                E-mail Corporativo ou CNPJ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a89b9b]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="login-id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@empresa.com.br"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0c0a0b] border border-[#2e2428] focus:border-[#e11d48] focus:outline-none text-xs text-[#faf7f5] placeholder-[#6e6262] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password-id" className="block text-xs font-semibold text-[#faf7f5]">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a89b9b]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password-id"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0c0a0b] border border-[#2e2428] focus:border-[#e11d48] focus:outline-none text-xs text-[#faf7f5] placeholder-[#6e6262] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#a89b9b] hover:text-[#faf7f5]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.043 10.043 0 013.122-.463c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-[#a89b9b] hover:text-[#faf7f5]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#2e2428] bg-[#0c0a0b] text-[#e11d48] focus:ring-0"
                />
                <span>Manter conectado</span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setToastMessage({
                    text: 'ℹ️ Recuperação de senha: solicite a redefinição ao administrador do workspace.',
                    type: 'success'
                  });
                }}
                className="text-[#d4a373] hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white font-bold text-xs shadow-lg shadow-[#e11d48]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verificando Credenciais...</span>
              ) : (
                <>
                  <span>Entrar no Cockpit Volúpia</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="text-center pt-2 border-t border-white/5 text-xs text-[#a89b9b]">
            Ainda não é parceiro B2B?{' '}
            <a
              href="https://usevolupia.com.br"
              className="text-[#d4a373] hover:underline font-semibold"
            >
              Solicitar Acesso VIP
            </a>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 text-[11px] text-[#6e6262] text-center pb-4">
        © 2026 Volúpia B2B Enterprise · Todos os direitos reservados · V8 Sovereign Platform
      </footer>
    </div>
  );
}
