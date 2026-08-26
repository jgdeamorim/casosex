'use client';

import React, { useState, useEffect } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { HomologationStatus } from '../../types';
import type { DossierInput } from '../../lib/api';
import { statusLabel } from '../../lib/status';

export function HomologationForm(): React.ReactElement {
  const { selectedSupplier, updateSupplierStatus, userSession, currentDossier, dossierLoading, saveDossier } =
    useRenderContext();

  const [qualityScore, setQualityScore] = useState<string>('');
  const [anvisaBodySafe, setAnvisaBodySafe] = useState<boolean>(false);
  const [moq, setMoq] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>('');
  const [auditNotes, setAuditNotes] = useState<string>('');
  const [status, setStatus] = useState<HomologationStatus>('VISITA_PENDENTE');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedSupplier) return;
    setStatus(selectedSupplier.status);
    setQualityScore('');
    setAnvisaBodySafe(false);
    setMoq('');
    setPaymentTerms('');
    setAuditNotes('');
    setUploadedFile(null);
    setIsSaved(false);
  }, [selectedSupplier]);

  useEffect(() => {
    if (!currentDossier) return;
    setQualityScore(currentDossier.qualityScore ? String(currentDossier.qualityScore) : '');
    setAnvisaBodySafe(currentDossier.anvisaBodySafe);
    setMoq(currentDossier.moq ?? '');
    setPaymentTerms(currentDossier.paymentTerms ?? '');
    setAuditNotes(currentDossier.auditNotes ?? '');
    setUploadedFile(currentDossier.catalogFileName ?? null);
    if (currentDossier.status) setStatus(currentDossier.status);
  }, [currentDossier]);

  if (!selectedSupplier) {
    return (
      <div className="p-8 rounded-2xl glass-panel text-center border border-white/10">
        <p className="text-[#a39b94] text-sm font-medium">Selecione um fornecedor no mapa ou na tabela para auditoria.</p>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedSupplier) return;

    const input: DossierInput = {
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      qualityScore: qualityScore.trim() === '' ? null : Number(qualityScore),
      anvisaBodySafe,
      moq: moq.trim(),
      paymentTerms: paymentTerms.trim(),
      catalogFileName: uploadedFile ?? undefined,
      auditNotes: auditNotes.trim(),
      status,
      auditorName: userSession.name
    };

    setSaving(true);
    const ok = await saveDossier(input);
    setSaving(false);

    if (ok) {
      updateSupplierStatus(selectedSupplier.id, status);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl glass-panel border border-white/10 relative overflow-hidden space-y-6">
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider font-mono-kpi">✦ Dossiê de Homologação & Compliance B2B</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a39b94] font-mono">
              POLO {selectedSupplier.state}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#f5d0a9] font-serif-luxury">{selectedSupplier.name}</h2>
          <p className="text-xs text-[#a39b94] font-medium mt-0.5">
            Categoria: <strong className="text-[#faf7f5]">{selectedSupplier.category}</strong> — {selectedSupplier.city}, {selectedSupplier.state}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-[10px] text-[#a39b94] font-medium uppercase tracking-wider">Status Atual</span>
            <span role="status" className={`badge-status ${status} inline-flex items-center mt-1`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse inline-block mr-1.5" />
              {statusLabel(status)}
            </span>
          </div>
          {dossierLoading && <span className="text-[10px] text-[#a39b94] font-mono animate-pulse">carregando…</span>}
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-[#30d158] text-xs font-bold flex items-center gap-2.5 shadow-lg shadow-[#30d158]/10 animate-fadeIn">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>Dossiê B2B salvo com sucesso no banco relacional Cloudflare D1.</span>
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6 text-xs">
        {/* Quality Score Visual Gauge Section */}
        <div className="p-4 rounded-xl bg-[#0c0a0b] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="qualityScore" className="text-xs font-bold text-[#faf7f5] uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[#d4a373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Score de Qualidade Comercial (0 - 100)
            </label>
            <span className="font-mono text-sm font-extrabold text-[#d4a373]">
              {qualityScore ? `${qualityScore}/100` : 'Não Avaliado'}
            </span>
          </div>

          <div className="w-full bg-[#161214] rounded-full h-2.5 border border-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                Number(qualityScore) >= 80 
                  ? 'bg-gradient-to-r from-[#30d158] to-[#22c55e]' 
                  : Number(qualityScore) >= 50 
                  ? 'bg-gradient-to-r from-[#eab308] to-[#f59e0b]' 
                  : 'bg-gradient-to-r from-[#e11d48] to-[#f43f5e]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, Number(qualityScore) || 0))}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="qualityScoreInput" className="block text-[#a39b94] font-semibold mb-1">
                Nota Técnica (0-100)
              </label>
              <input
                id="qualityScoreInput"
                type="number"
                min="0"
                max="100"
                value={qualityScore}
                onChange={e => setQualityScore(e.target.value)}
                placeholder="Ex: 95"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] font-mono focus:border-[#e11d48] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="statusSelect" className="block text-[#a39b94] font-semibold mb-1">
                Decisão de Status
              </label>
              <select
                id="statusSelect"
                value={status}
                onChange={e => setStatus(e.target.value as HomologationStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] font-bold focus:border-[#e11d48] focus:outline-none cursor-pointer transition-colors"
              >
                <option value="HOMOLOGADO">✔ HOMOLOGADO (Aprovado ANVISA)</option>
                <option value="VISITA_PENDENTE">⌛ VISITA PENDENTE (Auditoria agendada)</option>
                <option value="PROSPECCAO">🔍 PROSPECÇÃO (Análise preliminar)</option>
                <option value="REJEITADO">✖ REJEITADO (Reprovado)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section II: Commercial Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0c0a0b] border border-white/10 space-y-2">
            <label htmlFor="moq" className="block text-xs font-bold text-[#faf7f5] uppercase tracking-wider">
              Pedido Mínimo (MOQ Comercial)
            </label>
            <input
              id="moq"
              type="text"
              value={moq}
              onChange={e => setMoq(e.target.value)}
              placeholder="Ex: R$ 1.500,00 ou 50 un"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none font-medium"
            />
            <p className="text-[10px] text-[#a39b94]">Volume mínimo aceito para lote promocional B2B</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0a0b] border border-white/10 space-y-2">
            <label htmlFor="paymentTerms" className="block text-xs font-bold text-[#faf7f5] uppercase tracking-wider">
              Condições & Prazos de Pagamento
            </label>
            <input
              id="paymentTerms"
              type="text"
              value={paymentTerms}
              onChange={e => setPaymentTerms(e.target.value)}
              placeholder="Ex: 30/60/90 dias ou PIX com 5% desc"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none font-medium"
            />
            <p className="text-[10px] text-[#a39b94]">Política de crédito faturado para parceiros cadastrados</p>
          </div>
        </div>

        {/* ANVISA Compliance Checkbox */}
        <div className="p-4 rounded-xl bg-[#0c0a0b] border border-white/10 flex items-center gap-3">
          <input
            type="checkbox"
            id="bodySafe"
            checked={anvisaBodySafe}
            onChange={e => setAnvisaBodySafe(e.target.checked)}
            className="w-5 h-5 accent-[#e11d48] rounded cursor-pointer shrink-0"
          />
          <label htmlFor="bodySafe" className="text-xs text-[#faf7f5] font-semibold cursor-pointer leading-tight">
            Conformidade ANVISA Body-Safe & Atóxico (Laudo de Lubrificantes e Cosméticos Sensuais)
            <span className="block text-[10px] text-[#a39b94] font-normal mt-0.5">
              Garantia de segurança microbiológica e isenção de substâncias restritas.
            </span>
          </label>
        </div>

        {/* File Attachment & Auditor Notes */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#faf7f5] uppercase tracking-wider mb-2">
              Anexo de Catálogo & Tabela Comercial (PDF/CSV)
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0a0b] border border-white/10">
              <label className="px-4 py-2.5 rounded-xl bg-[#221c1f] hover:bg-[#e11d48]/20 border border-white/10 hover:border-[#e11d48]/50 text-[#faf7f5] font-bold cursor-pointer transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]">
                <span>Anexar Documento</span>
                <input type="file" accept=".pdf,.csv,.xlsx" onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedFile ? (
                <span className="text-[#30d158] font-mono font-bold text-xs truncate">📎 {uploadedFile}</span>
              ) : (
                <span className="text-[#a39b94] text-xs">Nenhum catálogo anexado</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="auditNotes" className="block text-xs font-bold text-[#faf7f5] uppercase tracking-wider mb-2">
              Parecer Técnico do Auditor ({userSession.name})
            </label>
            <textarea
              id="auditNotes"
              rows={3}
              value={auditNotes}
              onChange={e => setAuditNotes(e.target.value)}
              placeholder="Registre a justificativa do status, observações de qualidade e histórico da visita técnica…"
              className="w-full p-3.5 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Executive Action */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e11d48] via-[#d4a373] to-[#e11d48] text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#e11d48]/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]"
        >
          {saving ? 'Gravando Dossiê no Cloudflare D1…' : 'Emitir Certificado & Salvar Dossiê B2B'}
        </button>
      </form>
    </div>
  );
}
