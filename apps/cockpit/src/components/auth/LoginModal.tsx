import React, { useRef } from 'react';
import { ProfilePicker } from '../../auth/ProfilePicker';
import { useFocusTrap } from '../../lib/useFocusTrap';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps): React.ReactElement | null {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(modalRef, isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Trocar perfil (modo demonstração)"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="bg-[#141012] border border-[#e11d48]/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e11d48]/20 text-[#e11d48] font-bold text-xl">
            V8
          </div>
          <h2 className="text-2xl font-bold text-[#faf7f5]">Volúpia Cockpit B2B</h2>
          <p className="text-xs text-[#a39b94]">Troca de perfil em <span className="text-[#d4a373]">modo demonstração</span></p>
        </div>

        <ProfilePicker onSelect={onClose} />

        <button
          type="button"
          onClick={onClose}
          className="w-full text-center text-xs text-[#a39b94] hover:text-[#faf7f5] transition-colors py-2.5 min-h-[44px] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] rounded-xl"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
