import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { Supplier, HomologationStatus } from '../../types';
import { canUpdateStatus } from '../../auth/userRules';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';
import { SupplierMap } from '../map/SupplierMap';

export function MobileSupplierCards(): React.ReactElement {
  const {
    suppliers,
    selectedPolo,
    userSession,
    updateSupplierStatus,
    statusSaving,
    selectSupplier
  } = useRenderContext();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [activeModalSupplier, setActiveModalSupplier] = useState<Supplier | null>(null);

  // Estados dos Filtros na Aba Lista
  const [stateFilter, setStateFilter] = useState<string>('TODOS');
  const [cityFilter, setCityFilter] = useState<string>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODOS');
  const [ratingFilter, setRatingFilter] = useState<string>('TODOS');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Lista dinâmica de cidades baseada na seleção de estado
  const availableCities = Array.from(
    new Set(
      suppliers
        .filter((s) => stateFilter === 'TODOS' || s.state === stateFilter)
        .map((s) => s.city)
        .filter(Boolean)
    )
  ).sort();

  // Filtragem composta em tempo real
  const filtered = suppliers.filter((s) => {
    // 1. Estado / Polo
    if (stateFilter !== 'TODOS') {
      if (s.state !== stateFilter) return false;
    } else {
      if (selectedPolo === 'SP' && s.state !== 'SP') return false;
      if (selectedPolo === 'RJ' && s.state !== 'RJ') return false;
    }

    // 2. Cidade / Município / Bairro
    if (cityFilter !== 'TODOS' && s.city !== cityFilter) return false;

    // 3. Classificação (Indústria, Atacadista, Fabricante, Fornecedor, etc.)
    if (categoryFilter !== 'TODOS') {
      const catLower = s.category.toLowerCase();
      const filterLower = categoryFilter.toLowerCase();
      if (!catLower.includes(filterLower)) return false;
    }

    // 4. Rating / Estrelas
    if (ratingFilter !== 'TODOS') {
      const minRating = parseFloat(ratingFilter);
      if ((s.rating ?? 5.0) < minRating) return false;
    }

    // 5. Status de Homologação
    if (statusFilter !== 'TODOS' && s.status !== statusFilter) return false;

    return true;
  });

  const hasActiveFilters =
    stateFilter !== 'TODOS' ||
    cityFilter !== 'TODOS' ||
    categoryFilter !== 'TODOS' ||
    ratingFilter !== 'TODOS' ||
    statusFilter !== 'TODOS';

  const handleResetFilters = (): void => {
    triggerHapticFeedback(4);
    setStateFilter('TODOS');
    setCityFilter('TODOS');
    setCategoryFilter('TODOS');
    setRatingFilter('TODOS');
    setStatusFilter('TODOS');
  };

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

  const [pressingId, setPressingId] = useState<string | null>(null);
  const [pressToast, setPressToast] = useState<string | null>(null);
  const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = React.useRef<boolean>(false);
  const touchHandledRef = React.useRef<boolean>(false);
  const touchStartPosRef = React.useRef<{ x: number; y: number } | null>(null);

  const startPress = (sup: Supplier, clientX?: number, clientY?: number): void => {
    // Apenas prospecções são alteradas via long-press 3s para VISITA_PENDENTE
    if (sup.status !== 'PROSPECCAO') return;

    isLongPressRef.current = false;
    setPressingId(sup.id);
    if (clientX !== undefined && clientY !== undefined) {
      touchStartPosRef.current = { x: clientX, y: clientY };
    }
    triggerHapticFeedback(4);

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      triggerHapticFeedback(20);
      updateSupplierStatus(sup.id, 'VISITA_PENDENTE');
      selectSupplier(sup);
      setPressingId(null);
      setPressToast(`✓ Fábrica "${sup.name}" atualizada ao vivo para VISITA-PENDENTE!`);
      setTimeout(() => {
        setPressToast(null);
        isLongPressRef.current = false;
      }, 4000);
    }, 3000);
  };

  const handleTouchStart = (sup: Supplier, e: React.TouchEvent): void => {
    touchHandledRef.current = true;
    const t = e.touches[0];
    startPress(sup, t?.clientX, t?.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    if (!touchStartPosRef.current || !longPressTimerRef.current) return;
    const t = e.touches[0];
    if (!t) return;
    const dx = Math.abs(t.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(t.clientY - touchStartPosRef.current.y);
    if (dx > 15 || dy > 15) {
      cancelPress();
    }
  };

  const handleMouseDown = (sup: Supplier, e: React.MouseEvent): void => {
    if (touchHandledRef.current) return;
    startPress(sup, e.clientX, e.clientY);
  };

  const cancelPress = (): void => {
    if (isLongPressRef.current) {
      return;
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    touchStartPosRef.current = null;
    setPressingId(null);
    setTimeout(() => {
      touchHandledRef.current = false;
    }, 300);
  };

  const handleCardClickWithLongPress = (sup: Supplier): void => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }
    handleCardClick(sup);
  };

  return (
    <section className="space-y-3" aria-label="Cartões de Fornecedores Polos B2B">
      {/* Toast Notification de Transição de Status Long Press */}
      {pressToast && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black text-center shadow-2xl animate-in fade-in slide-in-from-top duration-300 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>{pressToast}</span>
        </div>
      )}
      {/* Top Menu Header Compacto: py-1 (5px top/bottom) com Título + Contador e Toggle Mapa Radar/Lista */}
      <div className="flex items-center justify-between py-[5px] mb-[5px] px-1">
        <h2 className="text-xs font-black uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="truncate">POLOS INDÚSTRIAIS</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
            ({filtered.length})
          </span>
        </h2>

        {/* Alternador de Visão: Mapa Radar vs Lista */}
        <div className="flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800 text-[10px] font-bold shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback(4);
              setViewMode('map');
            }}
            className={`px-2.5 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
              viewMode === 'map'
                ? 'bg-rose-600 text-white shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Mapa Radar</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback(4);
              setViewMode('list');
            }}
            className={`px-2.5 py-0.5 rounded-lg transition-all flex items-center gap-1 ${
              viewMode === 'list'
                ? 'bg-rose-600 text-white shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Lista</span>
          </button>
        </div>
      </div>

      {/* Visão de Mapa Dark Full Lateral (0px esquerdo <> 0px direito) */}
      {viewMode === 'map' && (
        <div className="-mx-4 w-[calc(100%+2rem)] h-[calc(100vh-9.5rem)] min-h-[480px] overflow-hidden shadow-2xl border-y border-stone-800 relative">
          <SupplierMap suppliersList={filtered} onSelectSupplier={handleCardClick} className="w-full h-full" />
        </div>
      )}

      {/* Visão de Lista de Cartões com Painel de Filtros Avançados Liquid Glass */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {/* Painel de Filtros Interativos */}
          <div className="p-3.5 rounded-2xl bg-[#161214]/95 border border-stone-800/90 space-y-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros da Lista
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[10px] font-extrabold text-rose-400 hover:text-rose-300 underline transition-colors"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Grid 2x2 de Seleção Dropdown */}
            <div className="grid grid-cols-2 gap-2">
              {/* 1. Estado / Polo */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                  Estado / Polo
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="TODOS">Todos os Polos</option>
                  <option value="SP">SP (São Paulo)</option>
                  <option value="RJ">RJ (Rio de Janeiro)</option>
                </select>
              </div>

              {/* 2. Cidade / Município */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                  Município / Cidade
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="TODOS">Todas as Cidades</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Classificação */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                  Classificação
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="TODOS">Todas Categorias</option>
                  <option value="Indústria">Indústria</option>
                  <option value="Atacadista">Atacadista</option>
                  <option value="Fabricante">Fabricante</option>
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Lingerie">Lingerie / Íntimo</option>
                </select>
              </div>

              {/* 4. Avaliação / Estrelas */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                  Avaliação / Estrelas
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="TODOS">Todas as Notas</option>
                  <option value="5.0">★ 5.0 (Excelente)</option>
                  <option value="4.5">★ 4.5+ (Muito Bom)</option>
                  <option value="4.0">★ 4.0+ (Bom)</option>
                </select>
              </div>
            </div>

            {/* 5. Pills de Status de Auditoria */}
            <div className="space-y-1 pt-1.5 border-t border-stone-800/80">
              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                Status de Auditoria
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'TODOS', label: 'Todos' },
                  { id: 'HOMOLOGADO', label: 'Homologado' },
                  { id: 'VISITA_PENDENTE', label: 'Visita Pendente' },
                  { id: 'PROSPECCAO', label: 'Prospecção' },
                  { id: 'REJEITADO', label: 'Rejeitado' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 transition-all ${
                      statusFilter === st.id
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards da Lista de Fornecedores */}
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#161214]/60 border border-stone-800/60 space-y-2">
              <p className="text-sm font-bold text-stone-300">Nenhum fornecedor encontrado</p>
              <p className="text-xs text-stone-500">Tente ajustar os filtros selecionados acima.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filtered.map((sup) => {
                const badge = getStatusBadge(sup.status);
                const isUserAllowed = canUpdateStatus(userSession.role);
                const isPressing = pressingId === sup.id;

                return (
                  <div
                    key={sup.id}
                    onClick={() => handleCardClickWithLongPress(sup)}
                    onTouchStart={(e) => handleTouchStart(sup, e)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={cancelPress}
                    onTouchCancel={cancelPress}
                    onMouseDown={(e) => handleMouseDown(sup, e)}
                    onMouseUp={cancelPress}
                    onMouseLeave={cancelPress}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-[#161214]/90 relative overflow-hidden select-none ${
                      isPressing
                        ? 'border-amber-500/80 shadow-amber-500/10 shadow-xl scale-[0.99]'
                        : sup.status === 'VISITA_PENDENTE'
                        ? 'border-amber-500/50 shadow-[inset_0_0_12px_rgba(245,158,11,0.18)] shadow-amber-950/30'
                        : 'border-stone-800/80 hover:border-stone-700 active:scale-[0.98]'
                    }`}
                  >
                    {/* Barra de Progresso do Long Press (3 Segundos) */}
                    {isPressing && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-stone-800 overflow-hidden z-20">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 animate-[progress_3000ms_linear_forwards]" />
                      </div>
                    )}

                    {isPressing && (
                      <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        Segure 3s para VISITA-PENDENTE
                      </div>
                    )}

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
          )}
        </div>
      )}

      {/* Modern PopUp Bottom-Sheet Full Lateral (0px esquerdo <> 0px direito) */}
      {activeModalSupplier && (
        <div
          className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-40 bg-[#161214] border-t border-b border-stone-800 flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header do PopUp com Botão de Fechar X Moderno */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#0c0a0b]/90 backdrop-blur-md z-10 shrink-0">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                  {activeModalSupplier.category} • POLO {activeModalSupplier.state}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-100 truncate mt-0.5">
                {activeModalSupplier.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors shrink-0"
              aria-label="Fechar Detalhes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Área do Mini-Mapa e Mini-Card Operacional no PopUp */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
            {/* 60% Superior: Mini-Mapa Focus na fábrica selecionada */}
            <div className="w-full flex-1 relative bg-stone-950 overflow-hidden">
              <SupplierMap
                suppliersList={[activeModalSupplier]}
                onSelectSupplier={() => {}}
                className="w-full h-full"
              />

              {/* Floating Badge de Visita Presencial */}
              <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-xl bg-[#0c0a0b]/90 backdrop-blur-md border border-rose-500/30 text-[10px] font-bold text-rose-300 flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Fábrica Auditada Presencialmente</span>
              </div>
            </div>

            {/* 40% Inferior: Mini-Card Operacional com 35% Bottom-Offset visual */}
            <div className="p-4 bg-[#0c0a0b]/95 border-t border-stone-800/90 backdrop-blur-md flex flex-col gap-3 shrink-0 shadow-2xl z-10">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">CNPJ / Registro</span>
                  <span className="font-mono text-stone-200 font-bold">{activeModalSupplier.cnpj || 'Em Auditoria ANVISA'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Avaliação GMB</span>
                  <span className="text-amber-400 font-black">★ {activeModalSupplier.rating ?? 5.0} (Auditado)</span>
                </div>
              </div>

              <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800 text-xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">Endereço do Polo</span>
                <p className="text-stone-300 text-xs leading-relaxed truncate">{activeModalSupplier.address}</p>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {activeModalSupplier.whatsapp && (
                  <a
                    href={`https://wa.me/${activeModalSupplier.whatsapp}?text=Olá!%20Vim%20pelo%20Cockpit%20Volúpia%20B2B.`}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-1 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.05.08-1.001 3.655 3.743-.981.051.033z" />
                    </svg>
                    <span>Cotação WhatsApp</span>
                  </a>
                )}
                {activeModalSupplier.gmb_url && (
                  <a
                    href={activeModalSupplier.gmb_url}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-1 px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-extrabold text-xs flex items-center justify-center border border-stone-700 shadow transition-transform active:scale-95"
                  >
                    <span>Ver no Google GMB</span>
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
