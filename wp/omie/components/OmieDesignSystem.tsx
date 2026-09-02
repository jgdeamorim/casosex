import React, { useState } from 'react';

export interface OmieDesignSystemProps {
  title?: string;
  theme?: 'dark' | 'light';
}

export type TabType = 'dashboard' | 'vendas' | 'estoque' | 'financeiro' | 'crm' | 'configuracoes';

export const OmieDesignSystemContainer: React.FC<OmieDesignSystemProps> = ({
  title = "Omie ERP Sovereign Replica (CASOSEX)",
  theme = "dark"
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#001E27] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans p-6`}>
      {/* Header Soberano Omie (#001E27 + Cyan #00E2F4) */}
      <header className="flex items-center justify-between border-b border-cyan-900/40 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#00E2F4] flex items-center justify-center font-extrabold text-[#001E27] shadow-lg shadow-cyan-500/20">
            O
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-xs text-cyan-400/80">RSXT Tri-Layer Engine · BOA Score: <span className="text-emerald-400 font-semibold">10.00</span> · OpenAPI 3.1 Gated</p>
          </div>
        </div>

        {/* NAVEGAÇÃO REATIVA DOS 6 MÓDULOS */}
        <nav className="flex space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-cyan-900/50 shadow-inner">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-[#00E2F4] text-[#001E27] shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('vendas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'vendas' ? 'bg-[#00E2F4] text-[#001E27] shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
          >
            Vendas & NFe
          </button>
          <button
            onClick={() => setActiveTab('estoque')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'estoque' ? 'bg-[#00E2F4] text-[#001E27] shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
          >
            Estoque & SKUs
          </button>
          <button
            onClick={() => setActiveTab('financeiro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'financeiro' ? 'bg-[#00E2F4] text-[#001E27] shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
          >
            Financeiro & DRE
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'crm' ? 'bg-[#00E2F4] text-[#001E27] shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
          >
            CRM & Clientes
          </button>
          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'configuracoes' ? 'bg-[#00E2F4] text-[#001E27] shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
          >
            Configurações
          </button>
        </nav>
      </header>

      {/* CONTEÚDO DINÂMICO DOS MÓDULOS */}
      <main className="grid grid-cols-1 gap-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
                <span className="text-xs text-slate-400 uppercase tracking-wider">SKUs Mapeados</span>
                <p className="text-3xl font-extrabold text-[#00E2F4] mt-2">1,248</p>
                <span className="text-[10px] text-emerald-400 font-mono">100% Sincronizado</span>
              </div>
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Pedidos Dropshipping B2B</span>
                <p className="text-3xl font-extrabold text-emerald-400 mt-2">342</p>
                <span className="text-[10px] text-slate-400 font-mono">Últimas 24h</span>
              </div>
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Faturamento Atacado</span>
                <p className="text-3xl font-extrabold text-indigo-400 mt-2">R$ 184.500</p>
                <span className="text-[10px] text-indigo-300 font-mono">NFe SEFAZ Aprovadas</span>
              </div>
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Endpoints Mapeados</span>
                <p className="text-3xl font-extrabold text-amber-400 mt-2">138 / 138</p>
                <span className="text-[10px] text-amber-300 font-mono">OpenAPI 3.1 Gated</span>
              </div>
            </div>

            <div className="p-6 bg-slate-900/90 border border-cyan-900/40 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-2">Status da Infraestrutura Soberana Omie</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                A réplica do ecossistema Omie ERP opera em modo soberano através da Bridge Militar (porta `:6661`), contornando bloqueios de CSP e fornecendo respostas JSON-RPC no modelo Intent-Mating com score Afetivo BOA 10.0.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: VENDAS & NFE */}
        {activeTab === 'vendas' && (
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#00E2F4]">Emissão e Faturamento de Pedidos de Venda</h2>
                <p className="text-xs text-slate-400">Endpoint RPC: <code className="text-emerald-400">/api/v1/produtos/pedidovenda/</code> (Ação: <span className="text-white">IncluirPedido</span>)</p>
              </div>
              <button className="px-4 py-2 bg-[#00E2F4] text-[#001E27] font-bold text-xs rounded-xl hover:brightness-110 shadow-md">
                + Novo Pedido B2B
              </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente / Razão Social</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E2F4] focus:outline-none" placeholder="Ex: CASOSEX Distribuidora Ltda" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Código Pedido Integrador</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E2F4] focus:outline-none" placeholder="PED-CASOSEX-001" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Etapa do Funil</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00E2F4] focus:outline-none">
                  <option value="10">10 - Orçamento</option>
                  <option value="20">20 - Pedido Confirmado</option>
                  <option value="50">50 - Pronto para Faturar (NF-e)</option>
                </select>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ESTOQUE & SKUS */}
        {activeTab === 'estoque' && (
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-[#00E2F4]">Consulta e Movimentação de Estoque Reativo</h2>
            <p className="text-xs text-slate-400">Endpoint RPC: <code className="text-emerald-400">/api/v1/estoque/consulta/</code></p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="py-2">SKU</th>
                    <th className="py-2">Descrição do Produto</th>
                    <th className="py-2">Local Estoque</th>
                    <th className="py-2">Saldo Físico</th>
                    <th className="py-2">Saldo Disponível</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr>
                    <td className="py-2.5 font-mono text-[#00E2F4]">SKU-VIB-01</td>
                    <td className="py-2.5">Vibrador Líquido Premium 15ml</td>
                    <td className="py-2.5">Matriz - SP</td>
                    <td className="py-2.5 font-bold text-white">450</td>
                    <td className="py-2.5 font-bold text-emerald-400">412</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-mono text-[#00E2F4]">SKU-GEL-05</td>
                    <td className="py-2.5">Gel Beijável Menta 50g</td>
                    <td className="py-2.5">Matriz - SP</td>
                    <td className="py-2.5 font-bold text-white">1,200</td>
                    <td className="py-2.5 font-bold text-emerald-400">1,150</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCEIRO & DRE */}
        {activeTab === 'financeiro' && (
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-emerald-400">Gestão Financeira & Contas a Pagar / Receber</h2>
            <p className="text-xs text-slate-400">Endpoints RPC: <code className="text-emerald-400">/api/v1/financas/contapagar/</code> & <code className="text-emerald-400">/api/v1/financas/contareceber/</code></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Contas a Pagar (Aberto)</h3>
                <p className="text-2xl font-bold text-white">R$ 34.200,00</p>
                <span className="text-[10px] text-slate-400">12 títulos de fornecedores sexshop</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Contas a Receber (Conciliado)</h3>
                <p className="text-2xl font-bold text-white">R$ 128.900,00</p>
                <span className="text-[10px] text-emerald-400">PIX & Boleto Omie ERP</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CRM & CLIENTES */}
        {activeTab === 'crm' && (
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-indigo-400">CRM & Oportunidades B2B</h2>
            <p className="text-xs text-slate-400">Endpoint RPC: <code className="text-emerald-400">/api/v1/crm/oportunidades/</code></p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Prospecção</span>
                <p className="text-sm font-bold text-white mt-1">Livraria & Sexshop Luxo</p>
                <span className="text-xs text-slate-400">Valor Est.: R$ 25.000</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-sky-400 font-bold uppercase">Proposta Enviada</span>
                <p className="text-sm font-bold text-white mt-1">Rede Distribuição Sul</p>
                <span className="text-xs text-slate-400">Valor Est.: R$ 85.000</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Fechado / Ganho</span>
                <p className="text-sm font-bold text-white mt-1">E-commerce Volúpia</p>
                <span className="text-xs text-slate-400">Valor Real: R$ 140.000</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONFIGURAÇÕES */}
        {activeTab === 'configuracoes' && (
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-[#00E2F4]">Credenciais e Configurações de API (Omie Bridge)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">App Key Omie</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none" value="4020942403" readOnly />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">App Secret Omie</label>
                <input type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none" value="b1b0e0081d09e1c107bf45778848792a" readOnly />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
