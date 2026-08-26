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
    <div className="p-6 rounded-2xl glass-panel border border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider font-mono-kpi">✦ Dossiê de Auditoria B2B</span>
          <h2 className="text-xl font-bold text-[#f5d0a9] font-serif-luxury">{selectedSupplier.name}</h2>
          <p className="text-xs text-[#a39b94] font-medium">{selectedSupplier.category} — {selectedSupplier.city}, {selectedSupplier.state}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`badge-status ${status}`}>{statusLabel(status)}</span>
          {dossierLoading && <span className="text-[10px] text-[#a39b94] font-mono">carregando dossiê…</span>}
        </div>
      </div>

      {isSaved && (
        <div className="mb-4 p-3 rounded-xl bg-[#30d158]/20 border border-[#30d158]/40 text-[#30d158] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Dossiê salvo no Cloudflare D1.
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qualityScore" className="block text-[#a39b94] font-semibold mb-1">Score de Qualidade (0-100)</label>
            <input
              id="qualityScore"
              type="number"
              min="0"
              max="100"
              value={qualityScore}
              onChange={e => setQualityScore(e.target.value)}
              placeholder="—"
              className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] font-mono focus:border-[#e11d48] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-[#a39b94] font-semibold mb-1">Status de Homologação</label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as HomologationStatus)}
              className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none font-bold"
            >
              <option value="HOMOLOGADO">HOMOLOGADO</option>
              <option value="VISITA_PENDENTE">VISITA PENDENTE</option>
              <option value="PROSPECCAO">PROSPECÇÃO</option>
              <option value="REJEITADO">REJEITADO</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="moq" className="block text-[#a39b94] font-semibold mb-1">Pedido Mínimo (MOQ)</label>
            <input
              id="moq"
              type="text"
              value={moq}
              onChange={e => setMoq(e.target.value)}
              placeholder="—"
              className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="paymentTerms" className="block text-[#a39b94] font-semibold mb-1">Condição de Pagamento</label>
            <input
              id="paymentTerms"
              type="text"
              value={paymentTerms}
              onChange={e => setPaymentTerms(e.target.value)}
              placeholder="—"
              className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none"
            />
          </div>
        </div>

        {/* Checkbox Body-Safe */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0c0a0b] border border-white/10">
          <input
            type="checkbox"
            id="bodySafe"
            checked={anvisaBodySafe}
            onChange={e => setAnvisaBodySafe(e.target.checked)}
            className="w-4 h-4 accent-[#e11d48] rounded cursor-pointer"
          />
          <label htmlFor="bodySafe" className="text-[#faf7f5] font-semibold cursor-pointer">
            Conformidade ANVISA Body-Safe & Atóxico (LUB / Cosméticos Eróticos)
          </label>
        </div>

        {/* Catalog file name (nota: Fase 1 guarda só o nome do arquivo) */}
        <div>
          <label className="block text-[#a39b94] font-semibold mb-1">Catálogo B2B / Tabela (nome do arquivo)</label>
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-[#221c1f] hover:bg-[#e11d48]/20 border border-white/10 hover:border-[#e11d48]/50 text-[#faf7f5] font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]">
              <span>Selecionar PDF/CSV</span>
              <input type="file" accept=".pdf,.csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            </label>
            {uploadedFile ? (
              <span className="text-[#30d158] font-mono font-bold text-[11px] whitespace-nowrap">📎 {uploadedFile}</span>
            ) : (
              <span className="text-[#a39b94] text-[11px] whitespace-nowrap">Nenhum arquivo selecionado</span>
            )}
          </div>
        </div>

        {/* Audit Notes */}
        <div>
          <label htmlFor="auditNotes" className="block text-[#a39b94] font-semibold mb-1">Parecer da Auditora ({userSession.name})</label>
          <textarea
            id="auditNotes"
            rows={3}
            value={auditNotes}
            onChange={e => setAuditNotes(e.target.value)}
            placeholder="Registre aqui o parecer técnico da auditoria…"
            className="w-full p-3 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#d4a373] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#e11d48]/20 hover:opacity-90 disabled:opacity-60 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]"
        >
          {saving ? 'Salvando no Cloudflare D1…' : 'Salvar & Emitir Dossiê de Homologação'}
        </button>
      </form>
    </div>
  );
}
