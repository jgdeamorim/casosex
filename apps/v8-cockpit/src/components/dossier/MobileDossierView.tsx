import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

export function MobileDossierView(): React.ReactElement {
  const { selectedSupplier, currentDossier, dossierLoading, saveDossier, userSession } = useRenderContext();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    anvisaBodySafe: currentDossier?.anvisaBodySafe ?? true,
    moq: currentDossier?.moq || 'R$ 1.000,00',
    paymentTerms: currentDossier?.paymentTerms || '30/60 dias no boleto',
    catalogUrl: currentDossier?.catalogUrl || '',
    catalogFileName: currentDossier?.catalogFileName || '',
    auditNotes: currentDossier?.auditNotes || ''
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!selectedSupplier) {
    return (
      <div className="p-6 rounded-2xl bg-[#161214] border border-stone-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center text-xl">
          📂
        </div>
        <h3 className="text-sm font-bold text-stone-200">Nenhum Fornecedor Selecionado</h3>
        <p className="text-xs text-stone-400">
          Selecione um fornecedor na aba <span className="text-rose-400 font-bold">Polos</span> para abrir e auditar o Dossiê.
        </p>
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
      status: selectedSupplier.status,
      auditorName: userSession.name
    });

    setSaving(false);
    if (ok) {
      setMessage('✓ Dossiê B2B salvo com sucesso!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('✕ Falha ao salvar no Cloudflare D1.');
    }
  };

  return (
    <section className="space-y-4 animate-in fade-in duration-300">
      {/* Header do Dossiê Móvel */}
      <div className="p-4 rounded-2xl bg-[#161214] border border-stone-800 flex items-center justify-between">
        <div className="min-w-0">
          <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider">
            Auditoria Técnica & Comercial
          </span>
          <h2 className="text-base font-black text-stone-100 truncate">
            {selectedSupplier.name}
          </h2>
          <p className="text-xs text-stone-400 truncate">
            {selectedSupplier.category} • {selectedSupplier.city}/{selectedSupplier.state}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-black text-sm shrink-0">
          ★ {selectedSupplier.rating ?? 5.0}
        </div>
      </div>

      {/* Stepper Material UI 3 Passos Tátil */}
      <div className="flex items-center justify-between p-1 bg-[#161214] border border-stone-800 rounded-2xl">
        {[
          { step: 1, label: '1. Licença Anvisa' },
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
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Formulário com Floating Labels e Touch Targets 48px+ */}
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-[#161214] border border-stone-800 space-y-4">
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Passo 1: Conformidade Regulatória & Anvisa
            </h4>

            {/* Toggle Anvisa Body Safe */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-200 block">Certificação Anvisa / Body Safe</span>
                <span className="text-[10px] text-stone-400">Validação de dermocosméticos e insumos</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHapticFeedback(6);
                  setFormData((prev) => ({ ...prev, anvisaBodySafe: !prev.anvisaBodySafe }));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  formData.anvisaBodySafe
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {formData.anvisaBodySafe ? '✓ CONFORME' : '✕ PENDENTE'}
              </button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Passo 2: Condições Comerciais Faturadas
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 block">Pedido Mínimo (MOQ)</label>
              <input
                type="text"
                placeholder="Ex: R$ 1.000,00 ou 100 peças"
                value={formData.moq}
                onChange={(e) => setFormData((prev) => ({ ...prev, moq: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:outline-none min-h-[48px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 block">Prazo de Pagamento Faturado</label>
              <input
                type="text"
                placeholder="Ex: 30/60 dias no boleto"
                value={formData.paymentTerms}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentTerms: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:outline-none min-h-[48px]"
              />
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Passo 3: Parecer Técnico & Notas da Auditoria
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-400 block">Observações do Auditor</label>
              <textarea
                rows={3}
                placeholder="Detalhes da auditoria presencial, capacidade produtiva e prazos..."
                value={formData.auditNotes}
                onChange={(e) => setFormData((prev) => ({ ...prev, auditNotes: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:outline-none min-h-[80px]"
              />
            </div>
          </div>
        )}

        {/* Feedback de salvamento */}
        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
            {message}
          </div>
        )}

        {/* Botão de Salvar Dossiê */}
        <button
          type="submit"
          disabled={saving || dossierLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2 min-h-[48px]"
        >
          {saving ? (
            <span>Salvando Dossiê...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Salvar Dossiê Soberano</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
