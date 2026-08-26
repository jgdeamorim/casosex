'use client';

import React, { useState, useEffect } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { HomologationStatus } from '../../types';
import type { DossierInput } from '../../lib/api';
import { statusLabel } from '../../lib/status';

export function HomologationForm(): React.ReactElement {
  const { suppliers, selectedSupplier, selectSupplier, updateSupplierStatus, userSession, currentDossier, dossierLoading, saveDossier } =
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

  // Auto-select first supplier if none is currently selected
  useEffect(() => {
    if (!selectedSupplier && suppliers.length > 0) {
      selectSupplier(suppliers[0]);
    }
  }, [suppliers, selectedSupplier, selectSupplier]);

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
      <div className="p-6 md:p-8 rounded-2xl glass-panel text-center border border-white/10 flex flex-col items-center justify-center min-h-[560px] h-full space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#e11d48]/10 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48] text-2xl shadow-lg shadow-[#e11d48]/10">
          📋
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#faf7f5]">Dossiê de Homologação Presencial</h3>
          <p className="text-[#a39b94] text-xs max-w-xs mt-1">
            Selecione um fornecedor na tabela ao lado ou no mapa para iniciar a auditoria de compliance ANVISA e termos comerciais.
          </p>
        </div>
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
    <div className="p-6 md:p-8 rounded-2xl glass-panel border border-white/10 relative overflow-hidden flex flex-col justify-between h-full min-h-[560px] space-y-6">
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider font-mono-kpi">✦ Dossiê de Homologação Presencial</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#a39b94] font-mono">
              POLO {selectedSupplier.city.toUpperCase()} ({selectedSupplier.state})
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#faf7f5]">{selectedSupplier.name}</h2>
          <p className="text-xs text-[#a39b94] font-medium mt-0.5">
            Categoria: <strong className="text-[#faf7f5]">{selectedSupplier.category}</strong> — {selectedSupplier.city}, {selectedSupplier.state}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-[10px] text-[#a39b94] font-medium uppercase tracking-wider">Status Compliance</span>
            <span role="status" className={`badge-status ${status} inline-flex items-center mt-1`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse inline-block mr-1.5" />
              {statusLabel(status)}
            </span>
          </div>
          {dossierLoading && <span className="text-[10px] text-[#a39b94] font-mono animate-pulse">carregando…</span>}
        </div>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-[#30d158] text-xs font-bold flex items-center gap-2.5 shadow-lg shadow-[#30d158]/10 animate-fadeIn">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>Dossiê B2B salvo e sincronizado com sucesso.</span>
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 text-xs flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Quality Score Visual Gauge Section */}
          <div className="p-3.5 rounded-xl bg-[#0c0a0b] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="qualityScoreInput" className="text-xs font-bold text-[#faf7f5] uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[#d4a373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Score de Qualidade Comercial (0 - 100)
              </label>
              <span className="font-mono text-xs font-extrabold text-[#d4a373]">
                {qualityScore ? `${qualityScore}/100` : 'Não Avaliado'}
              </span>
            </div>

            <div className="w-full bg-[#161214] rounded-full h-2 border border-white/10 overflow-hidden">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
                  className="w-full px-3 py-2 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] font-mono focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] focus:outline-none transition-colors"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] font-bold focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="HOMOLOGADO">✔ HOMOLOGADO (Aprovado ANVISA)</option>
                  <option value="VISITA_PENDENTE">⌛ VISITA PENDENTE (Auditoria agendada)</option>
                  <option value="PROSPECCAO">🔍 PROSPECÇÃO (Análise preliminar)</option>
                  <option value="REJEITADO">✖ REJEITADO (Reprovado)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Commercial Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#0c0a0b] border border-white/10 space-y-1">
              <label htmlFor="moq" className="block text-[11px] font-bold text-[#faf7f5] uppercase tracking-wider">
                Pedido Mínimo (MOQ)
              </label>
              <input
                id="moq"
                type="text"
                value={moq}
                onChange={e => setMoq(e.target.value)}
                placeholder="Ex: R$ 1.500,00"
                className="w-full px-3 py-2 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] focus:outline-none font-medium"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0c0a0b] border border-white/10 space-y-1">
              <label htmlFor="paymentTerms" className="block text-[11px] font-bold text-[#faf7f5] uppercase tracking-wider">
                Prazo de Pagamento
              </label>
              <input
                id="paymentTerms"
                type="text"
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                placeholder="Ex: 30/60 dias"
                className="w-full px-3 py-2 rounded-xl bg-[#141012] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* ANVISA Compliance Checkbox */}
          <div className="p-3 rounded-xl bg-[#0c0a0b] border border-white/10 flex items-center gap-3">
            <input
              type="checkbox"
              id="bodySafe"
              checked={anvisaBodySafe}
              onChange={e => setAnvisaBodySafe(e.target.checked)}
              className="w-4 h-4 accent-[#e11d48] rounded cursor-pointer shrink-0"
            />
            <label htmlFor="bodySafe" className="text-xs text-[#faf7f5] font-semibold cursor-pointer leading-tight">
              Conformidade ANVISA Body-Safe & Atóxico
              <span className="block text-[10px] text-[#a39b94] font-normal mt-0.5">
                Laudos e controle microbiológico de lote.
              </span>
            </label>
          </div>

          {/* File Attachment & Auditor Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#faf7f5] uppercase tracking-wider mb-1">
                Catálogo / Tabela (PDF/CSV)
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0c0a0b] border border-white/10">
                <label className="px-3 py-1.5 rounded-lg bg-[#221c1f] hover:bg-[#e11d48]/20 border border-white/10 hover:border-[#e11d48]/50 text-[#faf7f5] font-bold cursor-pointer transition-all whitespace-nowrap shrink-0 text-[11px]">
                  <span>Anexar</span>
                  <input type="file" accept=".pdf,.csv,.xlsx" onChange={handleFileUpload} className="hidden" />
                </label>
                {uploadedFile ? (
                  <span className="text-[#30d158] font-mono font-bold text-[10px] truncate">📎 {uploadedFile}</span>
                ) : (
                  <span className="text-[#a39b94] text-[10px]">Sem arquivo</span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="auditNotes" className="block text-[11px] font-bold text-[#faf7f5] uppercase tracking-wider mb-1">
                Parecer do Auditor ({userSession.name})
              </label>
              <input
                id="auditNotes"
                type="text"
                value={auditNotes}
                onChange={e => setAuditNotes(e.target.value)}
                placeholder="Parecer técnico..."
                className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Executive Action */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e11d48] via-[#d4a373] to-[#e11d48] text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#e11d48]/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] mt-2"
        >
          {saving ? 'Gravando Dossiê no Cloudflare D1…' : 'Emitir Certificado & Salvar Dossiê B2B'}
        </button>
      </form>
    </div>
  );
}
