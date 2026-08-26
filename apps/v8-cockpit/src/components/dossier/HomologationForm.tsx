import React, { useState, useEffect } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { HomologationStatus } from '../../types';

export function HomologationForm(): React.ReactElement {
  const { selectedSupplier, updateSupplierStatus, userSession } = useRenderContext();

  const [qualityScore, setQualityScore] = useState<number>(95);
  const [anvisaBodySafe, setAnvisaBodySafe] = useState<boolean>(true);
  const [moq, setMoq] = useState<string>('R$ 1.500');
  const [paymentTerms, setPaymentTerms] = useState<string>('30 / 60 dias faturado');
  const [auditNotes, setAuditNotes] = useState<string>('Laudo microbiológico verificado. Embalagem com lacre de segurança Anvisa.');
  const [status, setStatus] = useState<HomologationStatus>('HOMOLOGADO');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (selectedSupplier) {
      setStatus(selectedSupplier.status);
    }
  }, [selectedSupplier]);

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

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    updateSupplierStatus(selectedSupplier.id, status);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 rounded-2xl glass-panel border border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider">Dossiê de Auditoria B2B</span>
          <h2 className="text-lg font-bold text-[#faf7f5]">{selectedSupplier.name}</h2>
          <p className="text-xs text-[#a39b94]">{selectedSupplier.category} — {selectedSupplier.city}, {selectedSupplier.state}</p>
        </div>
        <span className={`badge-status ${status}`}>{status.replace('_', ' ')}</span>
      </div>

      {isSaved && (
        <div className="mb-4 p-3 rounded-xl bg-[#30d158]/20 border border-[#30d158]/40 text-[#30d158] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Dossiê salvo e sincronizado com Cloudflare D1 / R2 Vault!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a39b94] font-semibold mb-1">Score de Qualidade (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={qualityScore}
              onChange={e => setQualityScore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] font-mono focus:border-[#e11d48] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#a39b94] font-semibold mb-1">Status de Homologação</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as HomologationStatus)}
              className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none font-bold"
            >
              <option value="HOMOLOGADO">HOMOLOGADO</option>
              <option value="VISITA_PENDENTE">VISITA PENDENTE</option>
              <option value="REJEITADO">REJEITADO</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a39b94] font-semibold mb-1">Pedido Mínimo (MOQ)</label>
            <input
              type="text"
              value={moq}
              onChange={e => setMoq(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#a39b94] font-semibold mb-1">Condição de Pagamento</label>
            <input
              type="text"
              value={paymentTerms}
              onChange={e => setPaymentTerms(e.target.value)}
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

        {/* Upload Catalog R2 */}
        <div>
          <label className="block text-[#a39b94] font-semibold mb-1">Upload de Catálogo B2B / Tabela (Cloudflare R2 Vault)</label>
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 rounded-xl bg-[#221c1f] hover:bg-[#e11d48]/20 border border-white/10 hover:border-[#e11d48]/50 text-[#faf7f5] font-semibold cursor-pointer transition-all">
              <span>Selecionar PDF/CSV</span>
              <input type="file" accept=".pdf,.csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            </label>
            {uploadedFile ? (
              <span className="text-[#30d158] font-mono font-bold text-[11px]">📎 {uploadedFile}</span>
            ) : (
              <span className="text-[#a39b94] text-[11px]">Nenhum arquivo enviado</span>
            )}
          </div>
        </div>

        {/* Audit Notes */}
        <div>
          <label className="block text-[#a39b94] font-semibold mb-1">Parecer da Auditora ({userSession.name})</label>
          <textarea
            rows={3}
            value={auditNotes}
            onChange={e => setAuditNotes(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#0c0a0b] border border-white/10 text-[#faf7f5] focus:border-[#e11d48] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#d4a373] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#e11d48]/20 hover:opacity-90 transition-all"
        >
          Salvar & Emitir Dossiê de Homologação
        </button>
      </form>
    </div>
  );
}
