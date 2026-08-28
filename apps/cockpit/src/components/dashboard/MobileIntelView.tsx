import React from 'react';
import { useRenderContext } from '../../context/RenderContext';

export function MobileIntelView(): React.ReactElement {
  const { userSession, selectedPolo, suppliers } = useRenderContext();

  const filtered = suppliers.filter((s) => {
    if (selectedPolo === 'SP') return s.state === 'SP';
    if (selectedPolo === 'RJ') return s.state === 'RJ';
    return true;
  });

  const homologatedCount = filtered.filter((s) => s.status === 'HOMOLOGADO').length;
  const pendingCount = filtered.filter((s) => s.status === 'VISITA_PENDENTE').length;
  const homologationRate = filtered.length > 0 ? Math.round((homologatedCount / filtered.length) * 100) : 0;

  return (
    <section className="space-y-4 animate-in fade-in duration-300">
      {/* 1. Saudação do Usuário Logado */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 block">
            Market Intel • Visão Consolidada
          </span>
          <h1 className="text-xl font-black text-stone-100 tracking-tight">
            Olá, {userSession.name.split(' ')[0]} 👋
          </h1>
        </div>
      </div>

      {/* 2. Bento Grid 2026+ (KPIs Consolidados com Estética Obsidian Glassmorphism) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Polos - Total Mapeado */}
        <div className="p-4 rounded-2xl bg-[#161214]/90 border border-white/10 backdrop-blur-md flex flex-col justify-between min-h-[110px] relative overflow-hidden group shadow-xl hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-stone-300 tracking-wider">Polos / Fábricas</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs shrink-0">🏭</span>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-100 tracking-tight">{filtered.length}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Fornecedores Mapeados</p>
          </div>
          <div className="w-full bg-stone-800/80 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 2: Dossiê - Homologados Prontos p/ Faturar */}
        <div className="p-4 rounded-2xl bg-[#161214]/90 border border-white/10 backdrop-blur-md flex flex-col justify-between min-h-[110px] relative overflow-hidden shadow-xl hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Homologados</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs shrink-0">✓</span>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight">{homologatedCount}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Prontos p/ Boleto Faturado</p>
          </div>
          <div className="w-full bg-stone-800/80 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full" style={{ width: `${homologationRate}%` }} />
          </div>
        </div>

        {/* Card 3: Auditoria Técnica de Visita */}
        <div className="p-4 rounded-2xl bg-[#161214]/90 border border-white/10 backdrop-blur-md flex flex-col justify-between min-h-[110px] relative overflow-hidden shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Em Auditoria</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs shrink-0">⏳</span>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 tracking-tight">{pendingCount}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Laudos em Andamento</p>
          </div>
          <div className="w-full bg-stone-800/80 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full" style={{ width: '45%' }} />
          </div>
        </div>

        {/* Card 4: Visitas Pendentes */}
        <div className="p-4 rounded-2xl bg-[#161214]/90 border border-white/10 backdrop-blur-md flex flex-col justify-between min-h-[110px] relative overflow-hidden shadow-xl hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">Visitas Pendentes</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs shrink-0">📋</span>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-400 tracking-tight">{pendingCount}</div>
            <p className="text-[10px] text-stone-400 font-semibold">Leads na Fila de Auditoria</p>
          </div>
          <div className="w-full bg-stone-800/80 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full" style={{ width: pendingCount > 0 ? '100%' : '15%' }} />
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

