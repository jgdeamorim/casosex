import React, { useState } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { Supplier } from '../../types';
import { filterSuppliers, uniqueCategories } from '../../lib/filterSuppliers';
import { statusLabel } from '../../lib/status';

export function SupplierTable(): React.ReactElement {
  const { suppliers, selectedPolo, selectedSupplier, selectSupplier, userSession } = useRenderContext();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');

  const categories = uniqueCategories(suppliers);

  const filteredSuppliers = filterSuppliers(suppliers, {
    polo: selectedPolo,
    search: searchTerm,
    category: categoryFilter
  });

  const generateWhatsAppLink = (supplier: Supplier): string | null => {
    const phone = supplier.whatsapp || supplier.phone;
    if (!phone) return null;
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    const text = encodeURIComponent(
      `Olá ${supplier.name}! Sou o ${userSession.name} da Volúpia B2B. Gostaria de solicitar a tabela de preços faturada 30/60 dias para pedidos da categoria ${supplier.category}.`
    );

    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  return (
    <div className="p-6 rounded-2xl glass-panel border border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-[#faf7f5]">
            Tabela de {suppliers.length} Fornecedores B2B
          </h2>
          <p className="text-xs text-[#a39b94]">Polos SP & RJ com contato direto WhatsApp e filtro rápido</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Buscar fornecedor, cidade ou categoria..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Buscar fornecedor, cidade ou categoria"
            className="px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-xs text-[#faf7f5] placeholder-[#a39b94] focus:border-[#e11d48] focus:outline-none w-full sm:w-64"
          />

          {/* Category Select */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filtrar por categoria"
            className="px-3 py-2 rounded-xl bg-[#0c0a0b] border border-white/10 text-xs text-[#faf7f5] focus:border-[#e11d48] focus:outline-none font-semibold"
          >
            <option value="TODAS">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Snap Carousel View (< md) */}
      <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 -mx-2 px-2 scrollbar-none">
        {filteredSuppliers.length === 0 ? (
          <div className="w-full py-8 text-center text-[#a39b94] text-xs">
            Nenhum fornecedor encontrado para os filtros selecionados.
          </div>
        ) : (
          filteredSuppliers.map(sup => {
            const isSelected = selectedSupplier?.id === sup.id;
            const waLink = generateWhatsAppLink(sup);
            return (
              <div
                key={sup.id}
                onClick={() => {
                  selectSupplier(sup);
                  document.getElementById('supplier-map-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`snap-center shrink-0 w-[280px] p-4 rounded-2xl border transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#e11d48]/20 border-rose-500 shadow-lg shadow-rose-500/20'
                    : 'bg-[#161214] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-[#faf7f5] line-clamp-1">{sup.name}</h3>
                    <span className={`badge-status text-[9px] ${sup.status}`}>{statusLabel(sup.status)}</span>
                  </div>

                  <p className="text-xs text-rose-400 font-medium mb-1">{sup.category}</p>
                  <p className="text-[11px] text-[#a39b94] font-mono mb-3">{sup.city} - {sup.state}</p>

                  {/* B2B Badges auditáveis */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sup.status === 'HOMOLOGADO' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ✓ BINGO
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      ★ MARGEM DOURADA
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      ⚡ PRONTA ENTREGA
                    </span>
                  </div>
                </div>

                <div>
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 min-h-[44px] py-2 px-4 rounded-xl bg-[#30d158]/20 hover:bg-[#30d158]/30 border border-[#30d158]/40 text-[#30d158] font-bold text-xs transition-all active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30d158]"
                      onClick={e => e.stopPropagation()}
                    >
                      💬 Cotar WhatsApp
                    </a>
                  ) : (
                    <span className="block text-center text-[#a39b94] text-xs py-2 whitespace-nowrap">Sem contato cadastrado</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto max-h-[500px] overflow-y-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0c0a0b] text-[#a39b94] font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Fornecedor / Razão</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Cidade / Polo</th>
              <th className="py-3 px-4">Status Auditoria</th>
              <th className="py-3 px-4 text-right">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#a39b94]">
                  Nenhum fornecedor encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map(sup => {
                const isSelected = selectedSupplier?.id === sup.id;
                const waLink = generateWhatsAppLink(sup);
                return (
                  <tr
                    key={sup.id}
                    onClick={() => {
                      selectSupplier(sup);
                      document.getElementById('supplier-map-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#e11d48]/15 border-l-4 border-l-[#e11d48]'
                        : 'hover:bg-[#221c1f]'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#faf7f5]">
                      {sup.name}
                      {sup.gmb_url && (
                        <a
                          href={sup.gmb_url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-[10px] text-[#d4a373] hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          [GMB]
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#a39b94] font-medium">{sup.category}</td>
                    <td className="py-3 px-4 text-[#a39b94] font-mono">{sup.city} - {sup.state}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`badge-status ${sup.status}`}>{statusLabel(sup.status)}</span>
                        {sup.status === 'HOMOLOGADO' && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            BINGO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#30d158]/20 hover:bg-[#30d158]/30 border border-[#30d158]/40 text-[#30d158] font-bold text-[11px] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30d158]"
                          onClick={e => e.stopPropagation()}
                        >
                          💬 Cotar WhatsApp
                        </a>
                      ) : (
                        <span className="text-[#a39b94] text-[11px] whitespace-nowrap">sem contato</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
