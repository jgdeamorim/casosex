import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { Supplier, HomologationStatus } from '../../types';
import { canUpdateStatus } from '../../auth/userRules';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

export function MobileSupplierCards(): React.ReactElement {
  const {
    suppliers,
    selectedPolo,
    userSession,
    updateSupplierStatus,
    statusSaving,
    selectSupplier
  } = useRenderContext();

  const [activeModalSupplier, setActiveModalSupplier] = useState<Supplier | null>(null);

  const filtered = suppliers.filter((s) => {
    if (selectedPolo === 'SP') return s.state === 'SP';
    if (selectedPolo === 'RJ') return s.state === 'RJ';
    return true;
  });

  const getStatusBadge = (status: HomologationStatus): { label: string; style: string } => {
    switch (status) {
      case 'HOMOLOGADO':
        return { label: 'HOMOLOGADO', style: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'VISITA_PENDENTE':
        return { label: 'VISITA PENDENTE', style: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'REJEITADO':
        return { label: 'REJEITADO', style: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      case 'PROSPECCAO':
      default:
        return { label: 'PROSPECÇÃO', style: 'bg-stone-500/20 text-stone-300 border-stone-500/30' };
    }
  };

  const handleCardClick = (sup: Supplier): void => {
    triggerHapticFeedback(6);
    selectSupplier(sup);
    setActiveModalSupplier(sup);
  };

  const handleCloseModal = (): void => {
    triggerHapticFeedback(6);
    setActiveModalSupplier(null);
  };

  const handleStatusClick = (e: React.MouseEvent, supId: string, currentStatus: HomologationStatus): void => {
    e.stopPropagation();
    if (!canUpdateStatus(userSession.role)) return;
    triggerHapticFeedback(8);

    const statusCycle: HomologationStatus[] = ['PROSPECCAO', 'VISITA_PENDENTE', 'HOMOLOGADO', 'REJEITADO'];
    const nextIdx = (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length;
    updateSupplierStatus(supId, statusCycle[nextIdx]);
  };

  return (
    <section className="space-y-4" aria-label="Cartões de Fornecedores Polos B2B">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Polos Industriais ({filtered.length})</span>
        </h2>
        {selectedPolo !== 'TODOS' && (
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            Polo {selectedPolo}
          </span>
        )}
      </div>

      {/* Lista de Cartões de Fornecedores */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((sup) => {
          const badge = getStatusBadge(sup.status);
          const isUserAllowed = canUpdateStatus(userSession.role);

          return (
            <div
              key={sup.id}
              onClick={() => handleCardClick(sup)}
              className="p-4 rounded-2xl border transition-all cursor-pointer bg-[#161214]/90 border-stone-800/80 hover:border-stone-700 active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                    {sup.category} • {sup.city}/{sup.state}
                  </span>
                  <h3 className="text-sm font-bold text-stone-100 truncate leading-snug">
                    {sup.name}
                  </h3>
                  <p className="text-xs text-stone-400 truncate">
                    {sup.address}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!isUserAllowed || statusSaving}
                  onClick={(e) => handleStatusClick(e, sup.id, sup.status)}
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border shrink-0 min-h-[36px] flex items-center gap-1 transition-transform ${badge.style}`}
                >
                  <span>{badge.label}</span>
                </button>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center space-x-1.5">
                  <span className="text-amber-400 font-bold">★ {sup.rating ?? 5.0}</span>
                  <span className="text-stone-500">Score: {sup.quality_score ?? 100}/100</span>
                </div>
                <span className="text-[10px] text-rose-400 font-bold underline">Ver Mapa & PopUp →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern PopUp Bottom-Sheet com Mini-Mapa & Mini-Card Calibrado (35% Bottom Offset) */}
      {activeModalSupplier && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-[#161214] border border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[88vh] sm:h-[78vh] animate-in slide-in-from-bottom duration-300">
            {/* Header do PopUp com Botão de Fechar X Moderno */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#0c0a0b]/90 backdrop-blur-md z-10 shrink-0">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                    {activeModalSupplier.category} • POLO {activeModalSupplier.state}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    SCORE BOA {activeModalSupplier.quality_score ?? 100}/100
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-100 truncate mt-0.5">
                  {activeModalSupplier.name}
                </h3>
              </div>

              {/* Botão de Fechar X Moderno */}
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Fechar PopUp do Fornecedor"
                className="w-9 h-9 rounded-full bg-stone-800/80 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0 min-h-[44px] min-w-[44px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo Superior (65%): Mapa Pin de Campo Volúpia */}
            <div className="relative flex-1 bg-stone-900 overflow-hidden">
              <iframe
                title={`Mapa da Fábrica ${activeModalSupplier.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${activeModalSupplier.lat},${activeModalSupplier.lng}&z=15&output=embed`}
                className="w-full h-full opacity-90 filter contrast-125 saturate-110"
              />
              
              {/* Overlay de Pin de Localização com Marcador Flutuante (Offset 35% Bottom) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center pb-12">
                <div className="relative flex flex-col items-center animate-bounce duration-1000">
                  <div className="px-3 py-1 rounded-xl bg-rose-600 text-white font-extrabold text-[11px] shadow-xl shadow-rose-600/40 border border-rose-400/30 flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{activeModalSupplier.name}</span>
                  </div>
                  <div className="w-3 h-3 bg-rose-600 rotate-45 -mt-1.5 shadow-md" />
                </div>
              </div>

              {/* Tag de Posicionamento Volúpia */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/80 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase shadow-lg backdrop-blur-md">
                📍 Pin Visita Presencial • {activeModalSupplier.city} ({activeModalSupplier.state})
              </div>
            </div>

            {/* Mini-Card Inferior (35% Height): Informações Operacionais & Faturamento */}
            <div className="h-[38%] min-h-[220px] p-4 bg-[#120e10] border-t border-stone-800 flex flex-col justify-between shrink-0 space-y-3">
              <div className="space-y-2 overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] font-bold">
                      CNPJ Cadastrado
                    </span>
                    <span className="text-stone-400 text-xs font-mono">
                      {activeModalSupplier.cnpj || '12.345.678/0001-90'}
                    </span>
                  </div>
                  <span className="text-amber-400 font-extrabold text-xs">
                    ★ {activeModalSupplier.rating ?? 5.0} / 5.0
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">Endereço Industrial:</span>
                    <span className="text-rose-400 font-bold">Polo {activeModalSupplier.state}</span>
                  </div>
                  <p className="text-stone-200 text-xs font-semibold truncate">
                    {activeModalSupplier.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-xl bg-stone-900/50 border border-stone-800 flex flex-col">
                    <span className="text-stone-400 font-bold uppercase">Modalidade Pago</span>
                    <span className="text-emerald-400 font-extrabold mt-0.5">Boleto Faturado (Bingo)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900/50 border border-stone-800 flex flex-col">
                    <span className="text-stone-400 font-bold uppercase">Margem Recomendada</span>
                    <span className="text-rose-400 font-extrabold mt-0.5">Margem Dourada +45%</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Rápida (WhatsApp Direct Cotação) */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {activeModalSupplier.whatsapp && (
                  <a
                    href={`https://wa.me/${activeModalSupplier.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                    <span>Faturar via WhatsApp</span>
                  </a>
                )}
                {activeModalSupplier.gmb_url && (
                  <a
                    href={activeModalSupplier.gmb_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-extrabold text-xs flex items-center justify-center min-h-[48px] border border-stone-700"
                  >
                    GMB
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

