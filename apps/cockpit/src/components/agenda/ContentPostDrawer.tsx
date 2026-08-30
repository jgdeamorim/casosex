import React, { useState, useEffect } from 'react';
import type { ContentPost, ContentPostStatus, ContentObjective, ContentPlatform, UserRole } from '../../types/content-os';
import { ContentOsService } from '../../services/contentOsService';
import type { CompiledPromptResult } from '../../lib/promptCompiler';

interface ContentPostDrawerProps {
  post: ContentPost | null;
  isOpen: boolean;
  userRole: UserRole;
  onClose: () => void;
  onPostUpdated: (updatedPost: ContentPost) => void;
  onPostDeleted: (deletedId: string) => void;
}

const STATUS_BADGE_STYLES: Record<ContentPostStatus, string> = {
  draft: 'bg-stone-800/80 text-stone-300 border-stone-600/40',
  generated: 'bg-blue-950/80 text-blue-300 border-blue-600/40',
  review: 'bg-amber-950/80 text-amber-300 border-amber-600/40',
  approved: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40',
  scheduled: 'bg-purple-950/80 text-purple-300 border-purple-600/40',
  published: 'bg-rose-950/80 text-rose-300 border-rose-600/40',
  archived: 'bg-zinc-900 text-zinc-500 border-zinc-700/40',
};

const STATUS_LABELS: Record<ContentPostStatus, string> = {
  draft: 'Rascunho',
  generated: 'Gerado (AI)',
  review: 'Em Revisão',
  approved: 'Aprovado',
  scheduled: 'Agendado',
  published: 'Publicado',
  archived: 'Arquivado',
};

export function ContentPostDrawer({
  post,
  isOpen,
  userRole,
  onClose,
  onPostUpdated,
  onPostDeleted,
}: ContentPostDrawerProps): React.ReactElement | null {
  const [activeTab, setActiveTab] = useState<'overview' | 'script' | 'preview' | 'dna' | 'prompt'>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResult, setCompiledResult] = useState<CompiledPromptResult | null>(null);
  const [editedPost, setEditedPost] = useState<Partial<ContentPost>>({});

  useEffect(() => {
    if (post) {
      setEditedPost(post);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const canApprove = userRole === 'founder' || userRole === 'ops';

  const handleSave = async (): Promise<void> => {
    try {
      setIsSaving(true);
      const result = await ContentOsService.updatePost(post.id, editedPost);
      if (result) {
        onPostUpdated(result);
      }
    } catch (e: unknown) {
      void e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async (): Promise<void> => {
    try {
      setIsApproving(true);
      const result = await ContentOsService.approvePost(post.id);
      if (result) {
        onPostUpdated(result);
      }
    } catch (e: unknown) {
      void e;
    } finally {
      setIsApproving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!window.confirm('Tem certeza que deseja excluir este post da agenda?')) return;
    try {
      const success = await ContentOsService.deletePost(post.id);
      if (success) {
        onPostDeleted(post.id);
        onClose();
      }
    } catch (e: unknown) {
      void e;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-[#161214]/95 text-[#faf7f5] border-l border-white/10 shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0c0a0b]/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-stone-400">{post.id}</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full border ${
                  STATUS_BADGE_STYLES[post.status]
                }`}
              >
                {STATUS_LABELS[post.status]}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-stone-300 bg-stone-800 rounded-full uppercase">
                {post.platform}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{post.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Navigation Tabs */}
        <div className="px-5 border-b border-white/10 flex items-center gap-1 bg-[#120e10]">
          {(['overview', 'script', 'preview', 'dna', 'prompt'] as const).map((tab) => {
            const labels = {
              overview: 'Visão Geral',
              script: 'Roteiro & Hook',
              preview: 'Safe Zone 9:16',
              dna: 'Brand & Personagem',
              prompt: 'Prompt Compiler',
            };

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-[#e11d48] text-[#e11d48]'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-medium">Título do Conteúdo</label>
                <input
                  type="text"
                  value={editedPost.title || ''}
                  onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                  className="w-full bg-[#0c0a0b] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Objetivo de Negócio</label>
                  <select
                    value={editedPost.objective || 'awareness'}
                    onChange={(e) =>
                      setEditedPost({ ...editedPost, objective: e.target.value as ContentObjective })
                    }
                    className="w-full bg-[#0c0a0b] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                  >
                    <option value="awareness">Awareness (Alcance)</option>
                    <option value="authority">Autoridade (Engajamento)</option>
                    <option value="conversion">Conversão (Vendas / Direct)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Plataforma</label>
                  <select
                    value={editedPost.platform || 'instagram'}
                    onChange={(e) =>
                      setEditedPost({ ...editedPost, platform: e.target.value as ContentPlatform })
                    }
                    className="w-full bg-[#0c0a0b] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube Shorts</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Formato</label>
                  <input
                    type="text"
                    value={editedPost.format || 'reels_9_16'}
                    onChange={(e) => setEditedPost({ ...editedPost, format: e.target.value })}
                    className="w-full bg-[#0c0a0b] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Data/Hora Agendada</label>
                  <input
                    type="datetime-local"
                    value={editedPost.scheduledAt ? editedPost.scheduledAt.slice(0, 16) : ''}
                    onChange={(e) =>
                      setEditedPost({
                        ...editedPost,
                        scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full bg-[#0c0a0b] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>Criado Por:</span>
                  <span className="text-white font-medium">{post.createdBy}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Aprovado Por:</span>
                  <span className="text-emerald-400 font-medium">{post.approvedBy || 'Pendente'}</span>
                </div>
                {post.approvedAt && (
                  <div className="flex justify-between text-stone-400">
                    <span>Aprovado Em:</span>
                    <span className="text-stone-300">{new Date(post.approvedAt).toLocaleString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold text-rose-400">⚡ Hook (Gancho 3s)</label>
                <textarea
                  rows={2}
                  value={editedPost.hook || ''}
                  onChange={(e) => setEditedPost({ ...editedPost, hook: e.target.value })}
                  placeholder="Gancho inicial para reter a atenção nos primeiros 3 segundos..."
                  className="w-full bg-[#0c0a0b] border border-rose-500/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold text-amber-400">🎬 Roteiro / Script</label>
                <textarea
                  rows={6}
                  value={editedPost.script || ''}
                  onChange={(e) => setEditedPost({ ...editedPost, script: e.target.value })}
                  placeholder="Descrição detalhada das cenas, enquadramentos e locuções..."
                  className="w-full bg-[#0c0a0b] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold text-emerald-400">📢 Call To Action (CTA)</label>
                <input
                  type="text"
                  value={editedPost.cta || ''}
                  onChange={(e) => setEditedPost({ ...editedPost, cta: e.target.value })}
                  placeholder="Instrução direta para o espectador..."
                  className="w-full bg-[#0c0a0b] border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-xs text-stone-400">Simulação de enquadramento 9:16 (Reels / TikTok)</p>

              {/* Safe Zone Preview Mockup */}
              <div className="relative w-64 h-[440px] rounded-3xl bg-black border-4 border-stone-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 bg-gradient-to-b from-stone-900/60 via-black to-black">
                {/* Upper Overlay */}
                <div className="flex justify-between items-center text-[10px] text-white/80 z-10">
                  <span className="font-bold uppercase tracking-widest">{post.platform}</span>
                  <span className="bg-rose-600 px-2 py-0.5 rounded-full font-bold text-[9px]">LIVE SAFE ZONE</span>
                </div>

                {/* Center Content Mock */}
                <div className="my-auto text-center p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 z-10">
                  <p className="text-rose-400 font-extrabold text-xs mb-1">"{editedPost.hook || post.hook || 'Sem Hook'}"</p>
                  <p className="text-stone-300 text-[10px] line-clamp-3">{editedPost.script || post.script || 'Sem Roteiro'}</p>
                </div>

                {/* Lower Action Overlay */}
                <div className="space-y-2 z-10">
                  <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold text-center">
                    👉 {editedPost.cta || post.cta || 'CTA Indefinido'}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-stone-400">
                    <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-[9px]">V</div>
                    <span className="font-semibold text-white">@volupia_oficial</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dna' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="font-bold text-white text-sm">DNA da Marca</h4>
                <div className="flex justify-between">
                  <span className="text-stone-400">Pilar de DNA:</span>
                  <span className="font-mono text-rose-400 font-bold">{post.dnaPillarId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Versão das Diretrizes:</span>
                  <span className="font-mono text-stone-300">v{post.brandDnaVersion}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="font-bold text-white text-sm">Personagem de Referência</h4>
                <div className="flex justify-between">
                  <span className="text-stone-400">ID do Personagem:</span>
                  <span className="font-mono text-amber-400 font-bold">{post.characterId || 'Nenhum (Genérico)'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#1a1215] to-[#25131b] border border-rose-500/30">
                <div>
                  <h4 className="font-bold text-white text-sm">Compiler Determinístico BLAKE3 (M3)</h4>
                  <p className="text-stone-400 text-[11px]">Compilação em 11 blocos estruturados + Fingerprinting</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsCompiling(true);
                      const result = await ContentOsService.compilePromptRemote(post);
                      if (result) {
                        setEditedPost((prev) => ({
                          ...prev,
                          compiledPrompt: result.compiledPrompt,
                          promptHash: result.hash,
                        }));
                        setCompiledResult(result);
                      }
                    } catch (e: unknown) {
                      void e;
                    } finally {
                      setIsCompiling(false);
                    }
                  }}
                  disabled={isCompiling}
                  className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-lg shadow-[#e11d48]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isCompiling ? (
                    'Compilando...'
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      ⚡ Compilar Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">BLAKE3 Hash (64-hex)</span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 break-all">
                    {editedPost.promptHash || post.promptHash || 'Pendente de Compilação'}
                  </span>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Prompt Compilado Final</label>
                  <div className="p-3 rounded-lg bg-black font-mono text-[11px] text-stone-300 border border-white/10 overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {editedPost.compiledPrompt || post.compiledPrompt || 'Clique em "Compilar Prompt" para sintetizar o prompt em 11 blocos.'}
                  </div>
                </div>
              </div>

              {compiledResult && (
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-300 text-xs uppercase tracking-wider">Decomposição em 11 Blocos Estruturados</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {compiledResult.blocks.map((block) => (
                      <div key={block.key} className="p-3 rounded-lg bg-[#0c0a0b] border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-rose-400">{block.key}</span>
                          <span className="text-stone-400">{block.title}</span>
                        </div>
                        <p className="text-stone-200 font-mono text-[11px]">{block.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-[#0c0a0b]/90 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold text-xs transition-colors"
          >
            Excluir Post
          </button>

          <div className="flex items-center gap-3">
            {canApprove && post.status !== 'approved' && (
              <button
                type="button"
                onClick={handleApprove}
                disabled={isApproving}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                {isApproving ? 'Aprovando...' : '✓ Aprovar Conteúdo'}
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#e11d48] hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-lg shadow-[#e11d48]/20 disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
