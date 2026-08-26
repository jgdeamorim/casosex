import React from 'react';
import { ProfilePicker } from '../../auth/ProfilePicker';

interface LoginViewProps {
  onSuccess?: () => void;
}

export function LoginView({ onSuccess }: LoginViewProps): React.ReactElement {
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
            Auditoria de Fornecedores Sexual Wellness · <span className="text-[#d4a373]">modo demonstração</span>
          </p>
        </div>

        <ProfilePicker onSelect={onSuccess} />
      </div>
    </div>
  );
}
