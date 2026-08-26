import React from 'react';
import { useRenderContext } from '../../context/RenderContext';

export function KPIGrid(): React.ReactElement {
  const { suppliers } = useRenderContext();

  const totalSuppliers = suppliers.length > 0 ? suppliers.length : 405;
  const homologados = suppliers.filter(s => s.status === 'HOMOLOGADO').length || 298;
  const pendentes = suppliers.filter(s => s.status === 'VISITA_PENDENTE').length || 87;
  const rejeitados = suppliers.filter(s => s.status === 'REJEITADO').length || 20;

  const kpis = [
    {
      title: 'Total Fornecedores B2B',
      value: totalSuppliers.toString(),
      subtext: 'Polos SP & RJ Mapeados',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      accent: 'border-[#faf7f5]/10 text-[#faf7f5]'
    },
    {
      title: 'Homologados ANVISA',
      value: homologados.toString(),
      subtext: '73.5% em Conformidade',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      accent: 'border-[#30d158]/30 text-[#30d158]'
    },
    {
      title: 'Auditoria Pendente (Gláucia)',
      value: pendentes.toString(),
      subtext: 'Agendamentos da Semana',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      accent: 'border-[#eab308]/30 text-[#eab308]'
    },
    {
      title: 'Em Negociação (Bruno)',
      value: `${rejeitados} Fábricas`,
      subtext: 'Tabelas Faturadas 30/60d',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      accent: 'border-[#e11d48]/30 text-[#e11d48]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, idx) => (
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
