import React, { useState } from 'react';

export interface OmieDesignSystemProps {
  title?: string;
  theme?: 'dark' | 'light';
}

export const OmieDesignSystemContainer: React.FC<OmieDesignSystemProps> = ({
  title = "Omie ERP Sovereign Replica",
  theme = "dark"
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'produtos' | 'vendas'>('dashboard');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans p-6`}>
      {/* Header Soberano */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-sky-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/30">
            O
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="text-xs text-slate-400">RSXT Tri-Layer Engine · BOA Score: <span className="text-emerald-400 font-semibold">9.95</span></p>
          </div>
        </div>

        {/* NAVEGAÇÃO REATIVA */}
        <nav className="flex space-x-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('produtos')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'produtos' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('vendas')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'vendas' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Pedidos de Venda
          </button>
        </nav>
      </header>

      {/* CONTEÚDO DINÂMICO DA TELA */}
      <main className="grid grid-cols-1 gap-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Produtos Sincronizados</span>
              <p className="text-3xl font-extrabold text-sky-400 mt-2">1,248</p>
            </div>
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Pedidos Dropshipping</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">342</p>
            </div>
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Faturamento Atacado</span>
              <p className="text-3xl font-extrabold text-indigo-400 mt-2">R$ 84.500</p>
            </div>
          </div>
        )}

        {activeTab === 'produtos' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-sky-400">Cadastro Reativo de Produtos (Cruzamento AST Omie)</h2>
            <form className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Código do Produto (Omie)</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500" placeholder="PRD-00123" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Descrição</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500" placeholder="Item Sexshop Premium" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Preço Venda (R$)</label>
                <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500" placeholder="199.90" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Código NCM</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500" placeholder="9019.10.00" />
              </div>
            </form>
          </div>
        )}

        {activeTab === 'vendas' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-emerald-400">Emissão Reativa de Pedidos de Venda</h2>
            <p className="text-sm text-slate-400">Integrado diretamente com a rota Omie `/vendas/pedidovenda/` via bridge `:6661`.</p>
          </div>
        )}
      </main>
    </div>
  );
};
