import React from 'react';
import { useRenderContext } from '../../context/RenderContext';

interface KpiTile {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  accent: string;
}

function SkeletonCard(): React.ReactElement {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-white/10">
      <div className="h-3 w-24 bg-white/10 rounded animate-pulse mb-4" />
      <div className="h-8 w-16 bg-white/10 rounded animate-pulse mb-2" />
      <div className="h-2.5 w-32 bg-white/10 rounded animate-pulse" />
    </div>
  );
}

export function KPIGrid(): React.ReactElement {
  const { suppliers, isLoading, loadError, retry } = useRenderContext();

  const total = suppliers.length;
  const homologados = suppliers.filter(s => s.status === 'HOMOLOGADO').length;
  const prospeccao = suppliers.filter(s => s.status === 'PROSPECCAO').length;
  const pendentes = suppliers.filter(s => s.status === 'VISITA_PENDENTE').length;

  const pctHomologados = total > 0 ? Math.round((homologados / total) * 100) : 0;

  const kpis: KpiTile[] = [
    {
      title: 'Total Fornecedores B2B',
      value: total.toString(),
      subtext: 'Polos SP & RJ mapeados',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      accent: 'border-[#faf7f5]/10 text-[#faf7f5]'
    },
    {
      title: 'Homologados ANVISA',
      value: homologados.toString(),
      subtext: `${pctHomologados}% do catálogo`,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      accent: 'border-[#30d158]/30 text-[#30d158]'
    },
    {
      title: 'Em Prospecção',
      value: prospeccao.toString(),
      subtext: 'Aguardando visita técnica',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      accent: 'border-[#3b82f6]/30 text-[#3b82f6]'
    },
    {
      title: 'Auditoria Pendente',
      value: pendentes.toString(),
      subtext: 'Agendamentos da semana',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      accent: 'border-[#eab308]/30 text-[#eab308]'
    }
  ];

  if (loadError) {
    return (
      <div className="p-6 rounded-2xl glass-panel border border-[#e11d48]/30 text-center space-y-3">
        <p className="text-sm font-bold text-[#faf7f5]">Não foi possível carregar o catálogo.</p>
        <p className="text-xs text-[#a39b94] font-mono">{loadError}</p>
        <button
          type="button"
          onClick={() => void retry()}
          className="px-4 py-2 rounded-xl bg-[#e11d48] text-white text-xs font-bold hover:bg-[#e11d48]/90 transition-all"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {isLoading
        ? Array.from({ length: 4 }, (_, idx) => <SkeletonCard key={idx} />)
        : kpis.map((kpi, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl glass-panel border ${kpi.accent} hover:border-[#e11d48]/50 transition-all cursor-pointer group`}
              data-hover="glow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#a39b94]">{kpi.title}</span>
                <div className="p-2 rounded-lg bg-[#0c0a0b] border border-white/10 group-hover:border-[#e11d48]/40 transition-all">
                  <svg className="w-4 h-4 text-[#faf7f5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#faf7f5] mb-1 font-mono-kpi tracking-tight">{kpi.value}</p>
              <span className="text-[10px] text-[#a39b94] font-medium">{kpi.subtext}</span>
            </div>
          ))}
    </div>
  );
}
