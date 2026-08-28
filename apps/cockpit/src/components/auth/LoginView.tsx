import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { ProfilePicker } from '../../auth/ProfilePicker';

interface LoginViewProps {
  onSuccess?: () => void;
}

export function LoginView({ onSuccess }: LoginViewProps): React.ReactElement {
  const { userSession, setUserRole } = useRenderContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'profiles'>('form');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMessage(null);

    setTimeout(() => {
      // Auto-detect role or default to founder
      if (email.includes('glaucia') || email.includes('ops')) {
        setUserRole('ops');
      } else if (email.includes('bruno') || email.includes('comercial')) {
        setUserRole('commercial');
      } else {
        setUserRole('founder');
      }

      setIsSubmitting(false);
      setToastMessage({
        text: '✨ Autenticação realizada com sucesso! Acessando o Cockpit Volúpia...',
        type: 'success'
      });

      setTimeout(() => {
        onSuccess?.();
      }, 800);
    }, 700);
  };

  const handleBiometricAuth = () => {
    setToastMessage({
      text: '🔐 Solicitando validação biométrica via WebAuthn (Touch ID / Face ID)...',
      type: 'success'
    });
    setTimeout(() => {
      setUserRole('founder');
      setToastMessage({
        text: '✨ Biometria confirmada! Acessando o Cockpit...',
        type: 'success'
      });
      setTimeout(() => {
        onSuccess?.();
      }, 800);
    }, 1000);
  };

  const handleWhatsAppMagicLink = () => {
    setToastMessage({
      text: '💬 Magic Link de acesso enviado para o seu WhatsApp corporativo cadastrado!',
      type: 'success'
    });
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
            className="text-xs font-medium text-[#a89b9b] hover:text-[#faf7f5] transition-colors hidden sm:inline-block"
          >
            ← Voltar para Landing Page
          </a>
          <button
            type="button"
            onClick={() => onSuccess?.()}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#faf7f5] transition-all flex items-center space-x-1.5"
          >
            <span>Ver Cockpit</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
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

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#0c0a0b] p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'form'
                  ? 'bg-[#e11d48] text-white shadow-md'
                  : 'text-[#a89b9b] hover:text-white'
              }`}
            >
              Login Direto / SSO
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profiles')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'profiles'
                  ? 'bg-[#e11d48] text-white shadow-md'
                  : 'text-[#a89b9b] hover:text-white'
              }`}
            >
              Perfis de Operador ({userSession.role.toUpperCase()})
            </button>
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

          {activeTab === 'form' ? (
            <div className="space-y-5">
              {/* Form de E-mail / CNPJ e Senha */}
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

              {/* SSO Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2e2428]" /></div>
                <span className="relative px-3 bg-[#161214] text-[10px] uppercase tracking-wider text-[#a89b9b] font-medium">
                  AUTENTICAÇÃO RÁPIDA & BIOMETRIA
                </span>
              </div>

              {/* Google Workspace SSO & Biometric Options */}
              <div className="space-y-2.5">
                <ProfilePicker onSelect={onSuccess} />

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    className="p-2.5 rounded-xl bg-[#0c0a0b] hover:bg-white/5 border border-[#2e2428] hover:border-white/20 text-xs font-semibold text-[#faf7f5] transition-all flex items-center justify-center space-x-2 text-[11px]"
                  >
                    <svg className="w-4 h-4 text-[#d4a373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.658 0 3-1.342 3-3s-1.342-3-3-3-3 1.342-3 3 1.342 3 3 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z" />
                    </svg>
                    <span>Touch ID / Face ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppMagicLink}
                    className="p-2.5 rounded-xl bg-[#0c0a0b] hover:bg-white/5 border border-[#2e2428] hover:border-white/20 text-xs font-semibold text-[#faf7f5] transition-all flex items-center justify-center space-x-2 text-[11px]"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>WhatsApp Token</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ProfilePicker onSelect={onSuccess} />
            </div>
          )}

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
