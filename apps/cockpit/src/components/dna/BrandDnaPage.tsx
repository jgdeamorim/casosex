import React, { useState, useEffect, Suspense } from 'react';
import type { BrandDnaPillar } from '../../types/content-os';
import { ContentOsService } from '../../services/contentOsService';

function BrandDnaPageInner(): React.JSX.Element {
  const [pillars, setPillars] = useState<BrandDnaPillar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPillar, setEditingPillar] = useState<Partial<BrandDnaPillar>>({});

  const loadPillars = async () => {
    setLoading(true);
    try {
      const data = await ContentOsService.fetchBrandDnaPillars();
      setPillars(data);
    } catch (e: unknown) {
      void e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPillars();
  }, []);

  const handleSavePillar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPillar.name || !editingPillar.pillarKey) return;
    const res = await ContentOsService.createOrUpdateBrandDnaPillar(editingPillar);
    if (res) {
      setShowModal(false);
      setEditingPillar({});
      await loadPillars();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-rose-500/20 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <svg className="w-7 h-7 text-rose-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">
              Brand DNA (Brand Pillars & Visual Guidelines)
            </h1>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Gestão Soberana de Pilares Estéticos, Tom de Voz, Paleta de Cores e Iluminação do Content OS
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => void loadPillars()}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            title="Recarregar Pilares"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => {
              setEditingPillar({
                pillarKey: `pillar_${Date.now()}`,
                version: 1,
              });
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-medium text-sm hover:opacity-90 transition shadow-lg shadow-rose-950/40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo Pilar DNA</span>
          </button>
        </div>
      </div>

      {/* Grid of Brand DNA Pillars */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <svg className="w-6 h-6 animate-spin mr-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Carregando diretrizes de DNA de Marca...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.id}
              className="group relative bg-neutral-900/80 backdrop-blur-md border border-neutral-800/80 hover:border-rose-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-rose-950/60 text-rose-300 border border-rose-800/40 uppercase tracking-wider">
                      {p.pillarKey}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-100 mt-2 group-hover:text-rose-300 transition">
                      {p.name}
                    </h3>
                  </div>
                  <span className="flex items-center text-xs font-mono text-neutral-500 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                    <svg className="w-3 h-3 mr-1 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    v{p.version}
                  </span>
                </div>

                {/* Guidelines Sections */}
                <div className="space-y-3 pt-2 text-xs">
                  <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50">
                    <div className="flex items-center text-rose-400 font-semibold mb-1">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span>Diretrizes Visuais</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{p.visualGuidelines}</p>
                  </div>

                  <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50">
                    <div className="flex items-center text-amber-400 font-semibold mb-1">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>Tom Verbal</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{p.verbalTone}</p>
                  </div>

                  <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50">
                    <div className="flex items-center text-purple-400 font-semibold mb-1">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <span>Paleta de Cores</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-mono">{p.colorPalette}</p>
                  </div>

                  <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50">
                    <div className="flex items-center text-emerald-400 font-semibold mb-1">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Perfil de Iluminação</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{p.lightingProfile}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-500">
                  Criado em: {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <button
                  onClick={() => {
                    setEditingPillar(p);
                    setShowModal(true);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium hover:underline"
                >
                  Editar Pilar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating / Editing Brand DNA Pillar */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingPillar.id ? 'Editar Pilar Brand DNA' : 'Novo Pilar Brand DNA'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => void handleSavePillar(e)} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nome do Pilar</label>
                <input
                  type="text"
                  value={editingPillar.name || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, name: e.target.value })}
                  placeholder="Ex: Sensual Élite"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Chave Única (pillarKey)</label>
                <input
                  type="text"
                  value={editingPillar.pillarKey || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, pillarKey: e.target.value })}
                  placeholder="Ex: erotic_luxury"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Diretrizes Visuais</label>
                <textarea
                  value={editingPillar.visualGuidelines || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, visualGuidelines: e.target.value })}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Tom Verbal</label>
                <textarea
                  value={editingPillar.verbalTone || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, verbalTone: e.target.value })}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Paleta de Cores</label>
                <input
                  type="text"
                  value={editingPillar.colorPalette || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, colorPalette: e.target.value })}
                  placeholder="Ex: Burgundy (#800020), Dourado Champanhe (#d4af37)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Perfil de Iluminação</label>
                <input
                  type="text"
                  value={editingPillar.lightingProfile || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, lightingProfile: e.target.value })}
                  placeholder="Ex: Chiaroscuro de alta iluminação"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-500"
                >
                  Salvar Pilar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function BrandDnaPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="p-6 text-neutral-400">Carregando Brand DNA...</div>}>
      <BrandDnaPageInner />
    </Suspense>
  );
}
