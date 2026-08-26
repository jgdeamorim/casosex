import React, { useState, useEffect } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

export function MobileDossierView(): React.ReactElement {
  const {
    suppliers,
    selectedSupplier,
    selectSupplier,
    updateSupplierStatus,
    statusSaving,
    currentDossier,
    dossierLoading,
    saveDossier,
    userSession
  } = useRenderContext();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    anvisaBodySafe: currentDossier?.anvisaBodySafe ?? true,
    moq: currentDossier?.moq || 'R$ 1.000,00',
    paymentTerms: currentDossier?.paymentTerms || '30/60 dias no boleto faturado',
    catalogUrl: currentDossier?.catalogUrl || '',
    catalogFileName: currentDossier?.catalogFileName || '',
    auditNotes: currentDossier?.auditNotes || 'Instalações fabris inspecionadas presencialmente. Capacidade produtiva de 50.000 un/mês confirmada.'
  });

  // Re-sincroniza formData reativamente quando o fornecedor selecionado ou o dossiê carregado mudar
  useEffect(() => {
    if (selectedSupplier) {
      setFormData({
        anvisaBodySafe: currentDossier?.anvisaBodySafe ?? true,
        moq: currentDossier?.moq || 'R$ 1.000,00',
        paymentTerms: currentDossier?.paymentTerms || '30/60 dias no boleto faturado',
        catalogUrl: currentDossier?.catalogUrl || '',
        catalogFileName: currentDossier?.catalogFileName || '',
        auditNotes: currentDossier?.auditNotes || 'Instalações fabris inspecionadas presencialmente. Capacidade produtiva de 50.000 un/mês confirmada.'
      });
    }
  }, [selectedSupplier?.id, currentDossier]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fila de Auditoria: Fornecedores em VISITA_PENDENTE
  const pendingVisits = suppliers.filter((s) => s.status === 'VISITA_PENDENTE');

  const handleSelectFromQueue = (sup: typeof suppliers[0]): void => {
    triggerHapticFeedback(4);
    selectSupplier(sup);
  };

  const handleStatusChange = (newStatus: typeof suppliers[0]['status']): void => {
    if (!selectedSupplier) return;
    triggerHapticFeedback(8);
    updateSupplierStatus(selectedSupplier.id, newStatus);
    setMessage(`✓ Status alterado para ${newStatus} com sucesso!`);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!selectedSupplier) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        {/* Fila de Auditoria se houver pendentes */}
        {pendingVisits.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#161214]/90 border border-amber-500/20 space-y-2 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Fila de Auditoria • Visita Pendente ({pendingVisits.length})
                </span>
              </div>
              <span className="text-[9px] text-stone-500 font-mono tracking-tight">rolagem lateral →</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {pendingVisits.map((sup) => (
                <button
                  key={sup.id}
                  type="button"
                  onClick={() => handleSelectFromQueue(sup)}
                  className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-stone-200 text-left shrink-0 transition-all flex flex-col min-w-[150px]"
                >
                  <span className="text-xs font-bold truncate">{sup.name}</span>
                  <span className="text-[9px] text-stone-400 font-mono">{sup.city}/{sup.state}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-[#161214]/90 backdrop-blur-xl border border-stone-800 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center text-2xl border border-rose-500/20">
            📂
          </div>
          <h3 className="text-base font-black text-stone-100">Nenhum Fornecedor Selecionado</h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            {pendingVisits.length > 0
              ? 'Selecione uma fábrica na fila de auditoria acima para preencher o Dossiê.'
              : 'Acesse a aba Polos e segure por 3s em um card de fornecedor para enviar à Fila de Auditoria.'}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    triggerHapticFeedback(8);
    setSaving(true);
    setMessage(null);

    const ok = await saveDossier({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      qualityScore: selectedSupplier.quality_score ?? 100,
      anvisaBodySafe: formData.anvisaBodySafe,
      moq: formData.moq,
      paymentTerms: formData.paymentTerms,
      catalogUrl: formData.catalogUrl,
      catalogFileName: formData.catalogFileName,
      auditNotes: formData.auditNotes,
      status: 'HOMOLOGADO',
      auditorName: userSession.name
    });

    if (ok) {
      updateSupplierStatus(selectedSupplier.id, 'HOMOLOGADO');
      setMessage('✓ Dossiê Salvo e Fornecedor HOMOLOGADO no Cloudflare D1!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('✕ Falha ao salvar no Cloudflare D1.');
    }
    setSaving(false);
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-300">
      {/* Card 1: Fila de Auditoria de Visitas Pendentes (Glass Clean + Setinha do lado esquerdo piscando) */}
      {pendingVisits.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#161214]/90 border border-amber-500/20 space-y-2 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Fila de Auditoria ({pendingVisits.length} Pendente{pendingVisits.length > 1 ? 's' : ''})
              </span>
            </div>
            <span className="text-[9px] text-stone-500 font-mono tracking-tight">rolagem lateral →</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {pendingVisits.map((sup) => {
              const isSelected = selectedSupplier.id === sup.id;
              return (
                <button
                  key={sup.id}
                  type="button"
                  onClick={() => handleSelectFromQueue(sup)}
                  className={`px-3 py-1.5 rounded-xl text-left shrink-0 transition-all border text-xs min-w-[140px] ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-extrabold shadow-md'
                      : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="truncate font-bold">{sup.name}</div>
                  <div className="text-[9px] text-stone-500">{sup.city}/{sup.state}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Card 2 & 3 UNIFICADOS: Header do Dossiê + Decisão Rápida (sem ícone de Score solto) */}
      <div className="p-3.5 rounded-2xl bg-[#161214]/90 backdrop-blur-xl border border-stone-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider">
                Laudo Técnico • Polo {selectedSupplier.city} ({selectedSupplier.state})
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  selectedSupplier.status === 'HOMOLOGADO'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : selectedSupplier.status === 'VISITA_PENDENTE'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : selectedSupplier.status === 'REJEITADO'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-stone-500/20 text-stone-300 border-stone-500/30'
                }`}
              >
                {selectedSupplier.status.replace('_', ' ')}
              </span>
              {selectedSupplier.rating && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  ★ {selectedSupplier.rating} {selectedSupplier.reviews_count ? `(${selectedSupplier.reviews_count})` : ''}
                </span>
              )}
            </div>
            <h2 className="text-base font-black text-stone-100 truncate mt-0.5">
              {selectedSupplier.name}
            </h2>
            <p className="text-xs text-stone-400 truncate">
              {selectedSupplier.category} • {selectedSupplier.city}, {selectedSupplier.state}
            </p>
          </div>
        </div>

        {/* Decisão Rápida Integrada (Unida ao Header) */}
        <div className="pt-2.5 border-t border-stone-800/80 flex items-center justify-between gap-2">
          <span className="text-[9px] font-extrabold uppercase text-stone-400 tracking-wider">
            Decisão Rápida:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={statusSaving}
              onClick={() => handleStatusChange('REJEITADO')}
              className={`py-1 px-2.5 rounded-lg text-[10px] font-extrabold border transition-all min-h-[32px] flex items-center gap-1 ${
                selectedSupplier.status === 'REJEITADO'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              <span>Rejeitado</span>
            </button>
            <button
              type="button"
              disabled={statusSaving}
              onClick={() => handleStatusChange('PROSPECTADO')}
              className={`py-1 px-2.5 rounded-lg text-[10px] font-extrabold border transition-all min-h-[32px] flex items-center gap-1 ${
                selectedSupplier.status === 'PROSPECTADO'
                  ? 'bg-indigo-700 text-white border-indigo-600 shadow-sm'
                  : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:text-stone-200'
              }`}
            >
              <span>Prospectado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Material 2026+ Tátil */}
      <div className="flex items-center justify-between p-1 bg-[#161214] border border-stone-800 rounded-2xl">
        {[
          { step: 1, label: '1. Sanitário & Reg' },
          { step: 2, label: '2. Comercial B2B' },
          { step: 3, label: '3. Parecer Técnico' }
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => {
              triggerHapticFeedback(4);
              setActiveStep(s.step as 1 | 2 | 3);
            }}
            className={`flex-1 py-2.5 px-1 text-[11px] font-extrabold rounded-xl transition-all min-h-[44px] ${
              activeStep === s.step
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-[1.01]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Formulário com Touch Targets 48px+ e Liquid Glass Inputs */}
      <form onSubmit={handleSubmit} className="p-4 rounded-3xl bg-[#161214] border border-stone-800 space-y-4 shadow-xl">
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-stone-300 uppercase tracking-wider">
                Passo 1: Conformidade Regulatória & Anvisa
              </h4>
              <span className="text-[10px] text-stone-500 font-mono">Dossiê ID #AUD-{selectedSupplier.id}</span>
            </div>

            {/* Toggle Anvisa / Body Safe */}
            <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-200 block">Licença Anvisa / Dermatologicamente Testado</span>
                <span className="text-[10px] text-stone-400">Validação rigorosa de segurança dérmica</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHapticFeedback(6);
                  setFormData((prev) => ({ ...prev, anvisaBodySafe: !prev.anvisaBodySafe }));
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all min-h-[44px] ${
                  formData.anvisaBodySafe
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {formData.anvisaBodySafe ? '✓ CONFORME' : '✕ PENDENTE'}
              </button>
            </div>

            {/* Métrica de Auditoria Sanitária */}
            <div className="p-3 rounded-2xl bg-stone-900/40 border border-stone-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Status de Inspeção Sanitária:</span>
                <span className="text-emerald-400 font-bold">Aprovado pelo Auditor Volúpia</span>
              </div>
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Selo Volúpia BodySafe:</span>
                <span className="text-rose-400 font-bold">Emitido via Cloudflare Edge</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-black text-stone-300 uppercase tracking-wider">
              Passo 2: Condições Comerciais Faturadas
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 block">Pedido Mínimo de Peças (MOQ)</label>
              <input
                type="text"
                placeholder="Ex: R$ 1.000,00 ou 100 peças"
                value={formData.moq}
                onChange={(e) => setFormData((prev) => ({ ...prev, moq: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:outline-none min-h-[48px] font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 block">Prazo de Pagamento (Boleto Faturado)</label>
              <input
                type="text"
                placeholder="Ex: 30/60 dias no boleto faturado"
                value={formData.paymentTerms}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentTerms: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:outline-none min-h-[48px] font-semibold"
              />
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-black text-stone-300 uppercase tracking-wider">
              Passo 3: Parecer Técnico & Notas do Auditor
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 block">Observações de Campo & Capacidade Produtiva</label>
              <textarea
                rows={3}
                placeholder="Detalhes da auditoria presencial, maquinário e capacidade mensal..."
                value={formData.auditNotes}
                onChange={(e) => setFormData((prev) => ({ ...prev, auditNotes: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:outline-none min-h-[90px]"
              />
            </div>
          </div>
        )}

        {/* Feedback de Salvamento */}
        {message && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold text-center animate-in fade-in">
            {message}
          </div>
        )}

        {/* Botão de Salvar & Homologar Dossiê Soberano em Verde */}
        <button
          type="submit"
          disabled={saving || dossierLoading}
          className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 min-h-[48px] active:scale-[0.99]"
        >
          {saving ? (
            <span>Homologando & Salvando Dossiê no D1...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Salvar & Homologar Dossiê</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}

