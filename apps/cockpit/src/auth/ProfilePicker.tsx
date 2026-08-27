import React from 'react';
import { useRenderContext } from '../context/RenderContext';
import type { UserRole } from '../types';

interface Profile {
  role: UserRole;
  name: string;
  title: string;
  email: string;
  initials: string;
  swatch: string;
}

const PROFILES: Profile[] = [
  { role: 'founder', name: 'Jeferson Amorim', title: 'Founder / CEO', email: 'jeferson@volupia.com.br', initials: 'JA', swatch: 'from-[#e11d48] to-[#d4a373]' },
  { role: 'ops', name: 'Gláucia Michaella', title: 'Auditora de Operações', email: 'glaucia@volupia.com.br', initials: 'GM', swatch: 'from-[#eab308] to-[#d97706]' },
  { role: 'commercial', name: 'Bruno Amin', title: 'Comercial B2B', email: 'bruno@volupia.com.br', initials: 'BA', swatch: 'from-[#3b82f6] to-[#2563eb]' }
];

/**
 * Modo Demonstração: não há autenticação real (senha/token) neste MVP —
 * a troca de perfil é um seletor explícito. A API do worker é aberta;
 * aplicar auth de verdade é decisão futura de escopo.
 */
export function ProfilePicker({ onSelect }: { onSelect?: () => void }): React.ReactElement {
  const { userSession, setUserRole } = useRenderContext();

  return (
    <div className="space-y-3" role="group" aria-label="Selecionar perfil de demonstração">
      <p className="text-xs text-[#a39b94] text-center">
        Selecione o perfil de <strong className="text-[#faf7f5]">demonstração</strong>:
      </p>
      <div className="grid grid-cols-1 gap-2">
        {PROFILES.map(p => {
          const active = userSession.role === p.role;
          return (
            <button
              key={p.role}
              type="button"
              onClick={() => {
                setUserRole(p.role);
                onSelect?.();
              }}
              aria-pressed={active}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                active
                  ? 'border-[#e11d48]/50 bg-[#e11d48]/10'
                  : 'border-white/10 bg-[#0c0a0b] hover:border-white/25'
              }`}
            >
              <span className={`w-9 h-9 rounded-full bg-gradient-to-tr ${p.swatch} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                {p.initials}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-[#faf7f5]">{p.name}</span>
                <span className="block text-[10px] text-[#a39b94]">{p.title}</span>
                <span className="block text-[10px] font-mono text-[#a39b94] truncate">{p.email}</span>
              </span>
              {active && <span className="ml-auto text-[#e11d48] text-[10px] font-bold shrink-0">ATIVO</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
