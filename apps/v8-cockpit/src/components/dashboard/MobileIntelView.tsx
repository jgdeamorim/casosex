import React from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

export function MobileIntelView(): React.ReactElement {
  const { userSession, selectedPolo, setSelectedPolo, suppliers, unreadCount } = useRenderContext();

  const availablePolos: Array<{ id: 'TODOS' | 'SP' | 'RJ'; name: string }> = [
    { id: 'TODOS', name: 'Todos os Polos' },
    { id: 'SP', name: 'São Paulo (Brás/25M)' },
    { id: 'RJ', name: 'Rio de Janeiro (Polo Moda)' },
  ];

  const filtered = suppliers.filter((s) => {
    if (selectedPolo === 'SP') return s.state === 'SP';
    if (selectedPolo === 'RJ') return s.state === 'RJ';
    return true;
  });

  const homologatedCount = filtered.filter((s) => s.status === 'HOMOLOGADO').length;
  const pendingCount = filtered.filter((s) => s.status === 'VISITA_PENDENTE').length;
  const homologationRate = filtered.length > 0 ? Math.round((homologatedCount / filtered.length) * 100) : 0;

  const handlePoloChange = (poloId: 'TODOS' | 'SP' | 'RJ'): void => {
    triggerHapticFeedback(6);
    setSelectedPolo(poloId);
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-300">
      {/* 1. Seletor de Polos/Estados (No topo, fora do bento grid, acima da saudação) */}
      <div className="p-3 rounded-2xl bg-[#161214] border border-stone-800 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
            Polo Industrial de Atuação:
          </span>
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            {selectedPolo === 'TODOS' ? 'NACIONAL' : `POLO ${selectedPolo}`}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {availablePolos.map((p) => {
            const isSelected = selectedPolo === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePoloChange(p.id)}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all min-h-[44px] flex items-center justify-center text-center ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-[1.02]'
                    : 'bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Saudação do Usuário Logado (Abaixo do Seletor) */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 block">
            Market Intel • Visão Consolidada
          </span>
          <h1 className="text-xl font-black text-stone-100 tracking-tight">
            Olá, {userSession.name.split(' ')[0]} 👋
          </h1>
        </div>
        <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ao Vivo</span>
        </div>
      </div>

      {/* 3. Bento Grid 2026+ (KPIs Consolidados das Outras Páginas - Sem Mapa) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Polos - Total Mapeado */}
        <div className="p-4 rounded-2xl bg-[#161214] border border-stone-800 flex flex-col justify-between min-h-[110px] relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-stone-400">Polos / Fábricas</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs">🏭</span>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-100">{filtered.length}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Fornecedores Mapeados</p>
          </div>
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 2: Dossiê - Homologados Prontos p/ Faturar */}
        <div className="p-4 rounded-2xl bg-[#161214] border border-stone-800 flex flex-col justify-between min-h-[110px] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-400">Homologados</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{homologatedCount}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Prontos p/ Boleto Faturado</p>
          </div>
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${homologationRate}%` }} />
          </div>
        </div>

        {/* Card 3: Auditoria Técnica de Visita */}
        <div className="p-4 rounded-2xl bg-[#161214] border border-stone-800 flex flex-col justify-between min-h-[110px] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-400">Em Auditoria</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs">⏳</span>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Laudos em Andamento</p>
          </div>
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }} />
          </div>
        </div>

        {/* Card 4: Team Chat / Cotações WhatsApp */}
        <div className="p-4 rounded-2xl bg-[#161214] border border-stone-800 flex flex-col justify-between min-h-[110px] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-rose-400">Interchat Team</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs">💬</span>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-100">{unreadCount > 0 ? `${unreadCount} Novas` : 'Ativo'}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Cotações em Tempo Real</p>
          </div>
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: unreadCount > 0 ? '100%' : '60%' }} />
          </div>
        </div>
      </div>

      {/* 4. Resumo da Operação de Inteligência B2B */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-stone-900 border border-rose-500/30 flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-stone-200">Resumo Consolidado Volúpia</h4>
          <p className="text-[11px] text-stone-400">
            {homologatedCount} de {filtered.length} fábricas prontas com limite de crédito liberado.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shrink-0 shadow-md shadow-rose-500/20">
          {homologationRate}% Eficiência
        </div>
      </div>
    </section>
  );
}

