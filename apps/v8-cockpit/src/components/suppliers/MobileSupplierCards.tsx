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

      {/* Modern PopUp Bottom-Sheet com Mini-Mapa 35% na parte inferior */}
      {activeModalSupplier && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-[#161214] border border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[75vh] animate-in slide-in-from-bottom duration-300">
            {/* Header do PopUp com Botão de Fechar X Moderno */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#0c0a0b]">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider block">
                  {activeModalSupplier.category} • Polo {activeModalSupplier.state}
                </span>
                <h3 className="text-sm font-bold text-stone-100 truncate">
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

            {/* Conteúdo Superior: Detalhes do Fornecedor */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Endereço da Fábrica:</span>
                <p className="text-stone-200 font-semibold">{activeModalSupplier.address}</p>
                <p className="text-stone-400">{activeModalSupplier.city} - {activeModalSupplier.state}</p>
              </div>

              <div className="flex items-center justify-between gap-2">
                {activeModalSupplier.whatsapp && (
                  <a
                    href={`https://wa.me/${activeModalSupplier.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 min-h-[44px] shadow-md shadow-emerald-500/20"
                  >
                    <span>Contatar no WhatsApp</span>
                  </a>
                )}
                {activeModalSupplier.gmb_url && (
                  <a
                    href={activeModalSupplier.gmb_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs flex items-center justify-center min-h-[44px]"
                  >
                    GMB
                  </a>
                )}
              </div>
            </div>

            {/* Mini-Mapa 35% na Parte Inferior do PopUp */}
            <div className="h-[35%] w-full border-t border-stone-800 relative bg-stone-900">
              <iframe
                title={`Mapa da Fábrica ${activeModalSupplier.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${activeModalSupplier.lat},${activeModalSupplier.lng}&z=14&output=embed`}
                className="w-full h-full opacity-90 filter contrast-125"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-stone-900/90 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase shadow-lg backdrop-blur-md">
                📍 Pin 35% Bottom • {activeModalSupplier.city}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
