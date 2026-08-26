import React from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { Supplier, HomologationStatus } from '../../types';
import { canUpdateStatus } from '../../auth/userRules';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

export function MobileSupplierCards(): React.ReactElement {
  const {
    suppliers,
    selectedPolo,
    selectedSupplier,
    selectSupplier,
    userSession,
    updateSupplierStatus,
    statusSaving
  } = useRenderContext();

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
    <section className="space-y-4" aria-label="Cartões de Fornecedores Tática Mobile">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Matriz de Fornecedores ({filtered.length})</span>
        </h2>
        {selectedPolo !== 'TODOS' && (
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            Polo {selectedPolo}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((sup) => {
          const isSelected = selectedSupplier?.id === sup.id;
          const badge = getStatusBadge(sup.status);
          const isUserAllowed = canUpdateStatus(userSession.role);

          return (
            <div
              key={sup.id}
              onClick={() => handleCardClick(sup)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
                isSelected
                  ? 'bg-stone-900 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                  : 'bg-[#161214]/90 border-stone-800/80 hover:border-stone-700'
              }`}
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
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border shrink-0 min-h-[36px] flex items-center gap-1 transition-transform ${badge.style} ${
                    isUserAllowed ? 'hover:scale-105 active:scale-95' : 'opacity-80 cursor-not-allowed'
                  }`}
                  title={isUserAllowed ? 'Toque para alternar o status do fornecedor' : 'Sem permissão'}
                >
                  <span>{badge.label}</span>
                  {isUserAllowed && (
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Detalhes de Avaliação & WhatsApp no Mobile */}
              <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center space-x-1.5">
                  <span className="text-amber-400 font-bold">★ {sup.rating ?? 5.0}</span>
                  <span className="text-stone-500">Score: {sup.quality_score ?? 100}/100</span>
                </div>

                {sup.whatsapp && (
                  <a
                    href={`https://wa.me/${sup.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1 min-h-[36px]"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                    </svg>
                    <span>Zap</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
