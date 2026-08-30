import React, { useState, useEffect, Suspense } from 'react';
import type { CharacterEntity } from '../../types/content-os';
import { ContentOsService } from '../../services/contentOsService';

function CharacterLibraryPageInner(): React.JSX.Element {
  const [characters, setCharacters] = useState<CharacterEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingChar, setEditingChar] = useState<Partial<CharacterEntity>>({});

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const data = await ContentOsService.fetchCharacters();
      setCharacters(data);
    } catch (e: unknown) {
      void e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCharacters();
  }, []);

  const handleSaveCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChar.name) return;
    const res = await ContentOsService.createOrUpdateCharacter(editingChar);
    if (res) {
      setShowModal(false);
      setEditingChar({});
      await loadCharacters();
    }
  };

  const parseUrls = (jsonStr: string): string[] => {
    try {
      return JSON.parse(jsonStr) as string[];
    } catch (e: unknown) {
      void e;
      return [];
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <svg className="w-7 h-7 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-rose-300 to-amber-500 bg-clip-text text-transparent">
              Biblioteca de Personagens IA (Fixed Seeds)
            </h1>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Gestão de Consistência Facial, Seeds Numéricas Fixas e Modelos de Referência Visual
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => void loadCharacters()}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            title="Recarregar Personagens"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => {
              setEditingChar({
                fixedSeed: Math.floor(Math.random() * 1000000000),
                faceReferenceUrls: '[]',
              });
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-medium text-sm hover:opacity-90 transition shadow-lg shadow-amber-950/40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo Personagem</span>
          </button>
        </div>
      </div>

      {/* Grid of Characters */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <svg className="w-6 h-6 animate-spin mr-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Carregando biblioteca de personagens...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => {
            const urls = parseUrls(char.faceReferenceUrls);
            const avatarUrl = urls[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

            return (
              <div
                key={char.id}
                className="group relative bg-neutral-900/80 backdrop-blur-md border border-neutral-800/80 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Header Avatar & Identity */}
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500/40 group-hover:border-amber-400 transition shadow-md">
                      <img src={avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 bg-black/70 p-0.5 rounded">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-100 group-hover:text-amber-300 transition">
                        {char.name}
                      </h3>
                      <div className="flex items-center space-x-1 mt-1 text-xs font-mono text-amber-400/90">
                        <span># Seed: {char.fixedSeed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-300 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50 leading-relaxed">
                    {char.description}
                  </p>

                  {/* Reference Image Gallery Pill */}
                  <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                      <span className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Fotos de Referência ({urls.length})
                      </span>
                    </div>
                    {urls.length > 0 ? (
                      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                        {urls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-800 flex-shrink-0 hover:border-amber-400 transition"
                          >
                            <img src={url} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-neutral-500 italic">Nenhuma URL salva</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500">
                    ID: {char.id}
                  </span>
                  <button
                    onClick={() => {
                      setEditingChar(char);
                      setShowModal(true);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium hover:underline"
                  >
                    Editar Seed
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating / Editing Character */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingChar.id ? 'Editar Personagem IA' : 'Novo Personagem IA (Fixed Seed)'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => void handleSaveCharacter(e)} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nome da Persona</label>
                <input
                  type="text"
                  value={editingChar.name || ''}
                  onChange={(e) => setEditingChar({ ...editingChar, name: e.target.value })}
                  placeholder="Ex: Valentina Volúpia"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Descrição & Atributos Físicos</label>
                <textarea
                  value={editingChar.description || ''}
                  onChange={(e) => setEditingChar({ ...editingChar, description: e.target.value })}
                  rows={3}
                  placeholder="Descrição da pessoa, etnia, cabelo, traços faciais para o prompt compiler..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Seed Numérica Fixa (fixedSeed)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={editingChar.fixedSeed || 0}
                    onChange={(e) => setEditingChar({ ...editingChar, fixedSeed: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setEditingChar({ ...editingChar, fixedSeed: Math.floor(Math.random() * 1000000000) })}
                    className="px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200"
                    title="Gerar nova Seed Aleatória"
                  >
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">URLs de Referência Facial (JSON Array de URLs)</label>
                <textarea
                  value={editingChar.faceReferenceUrls || '[]'}
                  onChange={(e) => setEditingChar({ ...editingChar, faceReferenceUrls: e.target.value })}
                  rows={3}
                  placeholder='["https://.../img1.jpg", "https://.../img2.jpg"]'
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white font-mono"
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
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-500"
                >
                  Salvar Personagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function CharacterLibraryPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="p-6 text-neutral-400">Carregando Biblioteca de Personagens...</div>}>
      <CharacterLibraryPageInner />
    </Suspense>
  );
}
