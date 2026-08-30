import React, { useState, useEffect } from 'react';
import type {
  ContentPost,
  ContentPostStatus,
  ContentObjective,
  ContentPlatform,
  UserRole,
  AssetGeneration,
  ContentEvent,
  ContentMetrics,
} from '../../types/content-os';
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
  const [activeTab, setActiveTab] = useState<
    'overview' | 'script' | 'preview' | 'dna' | 'prompt' | 'assets' | 'learning_loop'
  >('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResult, setCompiledResult] = useState<CompiledPromptResult | null>(null);
  const [editedPost, setEditedPost] = useState<Partial<ContentPost>>({});

  // Asset Registry M4 state
  const [assetsList, setAssetsList] = useState<AssetGeneration[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetModel, setNewAssetModel] = useState('flux-1-schnell');
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);

  // Learning Loop M5 state
  const [eventsList, setEventsList] = useState<ContentEvent[]>([]);
  const [postMetrics, setPostMetrics] = useState<ContentMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<{
    oodaStage: string;
    confidenceScore: number;
    topPerformingPillars: Array<{ pillar: string; avgConversionRate: string; recommendedHookType: string }>;
    recommendations: string[];
  } | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [metricImpressions, setMetricImpressions] = useState<number>(0);
  const [metricClicks, setMetricClicks] = useState<number>(0);
  const [metricConversions, setMetricConversions] = useState<number>(0);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);

  useEffect(() => {
    if (post) {
      setEditedPost(post);
    }
  }, [post]);

  useEffect(() => {
    if (post && activeTab === 'assets') {
      void loadAssets();
    }
    if (post && activeTab === 'learning_loop') {
      void loadLearningLoopData();
    }
  }, [post, activeTab]);

  const loadLearningLoopData = async (): Promise<void> => {
    if (!post) return;
    try {
      setIsLoadingMetrics(true);
      const [eventsData, metricsData, recsData] = await Promise.all([
        ContentOsService.fetchPostEvents(post.id),
        ContentOsService.fetchPostMetrics(post.id),
        ContentOsService.fetchLearningLoopRecommendations(),
      ]);
      setEventsList(eventsData);
      setPostMetrics(metricsData);
      setRecommendations(recsData);
      if (metricsData) {
        setMetricImpressions(metricsData.impressions || 0);
        setMetricClicks(metricsData.directClicks || 0);
        setMetricConversions(metricsData.conversionsCount || 0);
      }
    } catch (e: unknown) {
      void e;
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleUpdateMetricsForm = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!post) return;
    try {
      setIsSavingMetrics(true);
      const engagementRate =
        metricImpressions > 0 ? Number(((metricClicks / metricImpressions) * 100).toFixed(2)) : 0;

      const updated = await ContentOsService.updatePostMetrics({
        postId: post.id,
        impressions: metricImpressions,
        engagementRate,
        directClicks: metricClicks,
        conversionsCount: metricConversions,
      });

      if (updated) {
        setPostMetrics(updated);
        await ContentOsService.recordPostEvent(post.id, 'metric_received', {
          impressions: metricImpressions,
          directClicks: metricClicks,
          conversionsCount: metricConversions,
        });
        const freshEvents = await ContentOsService.fetchPostEvents(post.id);
        setEventsList(freshEvents);
      }
    } catch (err: unknown) {
      void err;
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const loadAssets = async (): Promise<void> => {
    if (!post) return;
    try {
      setIsLoadingAssets(true);
      const data = await ContentOsService.fetchAssetsForPost(post.id);
      setAssetsList(data);
    } catch (e: unknown) {
      void e;
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const handleSelectAssetVersion = async (assetId: string): Promise<void> => {
    if (!post) return;
    try {
      const success = await ContentOsService.selectPublishedAsset(assetId);
      if (success) {
        setAssetsList((prev) =>
          prev.map((a) => ({
            ...a,
            status: a.id === assetId ? 'published' : 'draft',
          }))
        );
        const updated = { ...post, status: 'generated' as ContentPostStatus };
        onPostUpdated(updated);
      }
    } catch (e: unknown) {
      void e;
    }
  };

  const handleRegisterNewAsset = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!post || !newAssetUrl.trim()) return;
    try {
      setIsCreatingAsset(true);
      const created = await ContentOsService.createAssetGeneration({
        postId: post.id,
        assetUrl: newAssetUrl.trim(),
        model: newAssetModel,
        seed: Math.floor(Math.random() * 100000000),
        promptHash: editedPost.promptHash || post.promptHash || '',
        compiledPrompt: editedPost.compiledPrompt || post.compiledPrompt || '',
        mimeType: 'image/jpeg',
        width: 1080,
        height: 1920,
        createdBy: userRole,
      });

      if (created) {
        setAssetsList((prev) => [created, ...prev]);
        setNewAssetUrl('');
      }
    } catch (err: unknown) {
      void err;
    } finally {
      setIsCreatingAsset(false);
    }
  };

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
        <div className="px-5 border-b border-white/10 flex items-center gap-1 bg-[#120e10] overflow-x-auto whitespace-nowrap scrollbar-none">
          {(['overview', 'script', 'preview', 'dna', 'prompt', 'assets', 'learning_loop'] as const).map((tab) => {
            const labels = {
              overview: 'Visão Geral',
              script: 'Roteiro & Hook',
              preview: 'Safe Zone 9:16',
              dna: 'Brand & Personagem',
              prompt: 'Prompt Compiler',
              assets: 'Galeria M4 (Mídia)',
              learning_loop: 'Métricas & OODA (M5)',
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

          {activeTab === 'assets' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Asset Registry & Versões de Mídia (M4)</h3>
                  <p className="text-stone-400 text-[11px]">
                    Histórico de gerações 9:16 associadas ao post com rastreabilidade por Seed, Modelo e Hash BLAKE3.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadAssets}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-[11px] transition-colors"
                >
                  🔄 Recarregar
                </button>
              </div>

              {/* Form de Simulação de Nova Geração */}
              <form onSubmit={handleRegisterNewAsset} className="p-4 rounded-xl bg-stone-950 border border-white/10 space-y-3">
                <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider">Simular / Registrar Nova Geração (AI)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-stone-400 mb-1 font-medium text-[11px]">URL da Mídia (R2 ou preview)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newAssetUrl}
                      onChange={(e) => setNewAssetUrl(e.target.value)}
                      className="w-full bg-[#0c0a0b] border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-[11px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-medium text-[11px]">Modelo AI</label>
                    <select
                      value={newAssetModel}
                      onChange={(e) => setNewAssetModel(e.target.value)}
                      className="w-full bg-[#0c0a0b] border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-[11px]"
                    >
                      <option value="flux-1-schnell">Flux 1 Schnell</option>
                      <option value="kling-o3">Kling O3 (Vídeo)</option>
                      <option value="sora">OpenAI Sora</option>
                      <option value="sdxl-turbo">SDXL Turbo</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isCreatingAsset}
                  className="w-full py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all shadow-md shadow-rose-900/30 disabled:opacity-50"
                >
                  {isCreatingAsset ? 'Registrando...' : '✨ Registrar Nova Versão na Galeria'}
                </button>
              </form>

              {/* Lista de Ativos em Galeria */}
              {isLoadingAssets ? (
                <div className="p-8 text-center text-stone-400 font-mono">Carregando registro de mídias...</div>
              ) : assetsList.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-stone-800 rounded-xl space-y-2">
                  <p className="text-stone-400 font-medium">Nenhuma mídia registrada para este post.</p>
                  <p className="text-stone-600 text-[11px]">Submeta um asset acima ou execute o pipeline de geração AI.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {assetsList.map((asset) => {
                    const isPublished = asset.status === 'published';
                    return (
                      <div
                        key={asset.id}
                        className={`group relative rounded-xl overflow-hidden border transition-all ${
                          isPublished
                            ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/50'
                            : 'border-white/10 bg-[#0c0a0b] hover:border-stone-600'
                        }`}
                      >
                        {/* Status Badge */}
                        <div className="absolute top-2 left-2 z-10 flex gap-1">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md shadow ${
                              isPublished
                                ? 'bg-emerald-500 text-black'
                                : 'bg-stone-900/90 text-stone-300 border border-stone-700'
                            }`}
                          >
                            {isPublished ? '✓ Publicado' : `Gen #${asset.generationNumber}`}
                          </span>
                        </div>

                        {/* Image Preview 9:16 Aspect */}
                        <div className="relative aspect-[9/16] bg-black/40 overflow-hidden">
                          <img
                            src={asset.assetUrl}
                            alt={`Geração #${asset.generationNumber}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Metadata Footer */}
                        <div className="p-3 space-y-2 text-[10px] border-t border-white/10 bg-[#120e10]">
                          <div className="flex items-center justify-between font-mono text-stone-300">
                            <span className="font-bold text-rose-400">{asset.model}</span>
                            <span>Seed: {asset.seed || 'N/A'}</span>
                          </div>
                          {asset.promptHash && (
                            <div className="font-mono text-[9px] text-stone-500 truncate" title={asset.promptHash}>
                              BLAKE3: {asset.promptHash}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-stone-400 pt-1">
                            <span>{asset.width}x{asset.height}</span>
                            <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                          </div>

                          {!isPublished && (
                            <button
                              type="button"
                              onClick={() => handleSelectAssetVersion(asset.id)}
                              className="w-full mt-2 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold rounded text-[11px] transition-colors shadow"
                            >
                              Seleção 1-Click (Ativar)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'learning_loop' && (
            <div className="space-y-6 text-xs">
              {/* Header Box */}
              <div className="p-4 bg-gradient-to-r from-stone-900 via-[#1c1418] to-stone-900 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                    <span>⚡</span> OODA Learning Loop & Performance (M5)
                  </h3>
                  {recommendations && (
                    <span className="px-2.5 py-1 text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full font-bold">
                      Confidence: {(recommendations.confidenceScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-[#a8a29e] text-[11px] mt-1">
                  Telemetria viva de eventos, métricas de conversão e motor de recomendação inteligente do Adsentice.
                </p>
              </div>

              {/* Performance Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#0c0a0b] border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Impressões</span>
                  <div className="text-xl font-bold font-mono text-white">
                    {postMetrics?.impressions?.toLocaleString() || 0}
                  </div>
                </div>

                <div className="p-3 bg-[#0c0a0b] border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Taxa de Engajamento</span>
                  <div className="text-xl font-bold font-mono text-amber-400">
                    {postMetrics?.engagementRate || 0}%
                  </div>
                </div>

                <div className="p-3 bg-[#0c0a0b] border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Cliques Diretos (Direct)</span>
                  <div className="text-xl font-bold font-mono text-blue-400">
                    {postMetrics?.directClicks || 0}
                  </div>
                </div>

                <div className="p-3 bg-[#0c0a0b] border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Conversões (Vendas)</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {postMetrics?.conversionsCount || 0}
                  </div>
                </div>
              </div>

              {/* Update Metrics Form */}
              <form onSubmit={handleUpdateMetricsForm} className="p-4 bg-[#0c0a0b]/60 border border-white/10 rounded-xl space-y-3">
                <h4 className="font-bold text-stone-200 text-xs">Atualizar Métricas de Performance</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Impressões</label>
                    <input
                      type="number"
                      value={metricImpressions}
                      onChange={(e) => setMetricImpressions(Number(e.target.value))}
                      className="w-full bg-[#161214] border border-white/15 rounded-lg p-2 text-white font-mono text-xs focus:ring-1 focus:ring-[#e11d48]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Cliques</label>
                    <input
                      type="number"
                      value={metricClicks}
                      onChange={(e) => setMetricClicks(Number(e.target.value))}
                      className="w-full bg-[#161214] border border-white/15 rounded-lg p-2 text-white font-mono text-xs focus:ring-1 focus:ring-[#e11d48]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Conversões</label>
                    <input
                      type="number"
                      value={metricConversions}
                      onChange={(e) => setMetricConversions(Number(e.target.value))}
                      className="w-full bg-[#161214] border border-white/15 rounded-lg p-2 text-white font-mono text-xs focus:ring-1 focus:ring-[#e11d48]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingMetrics}
                  className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-lg transition-colors text-xs border border-white/10 disabled:opacity-50"
                >
                  {isSavingMetrics ? 'Registrando Telemetria...' : 'Salvar Métricas & Registrar Evento'}
                </button>
              </form>

              {/* OODA Recommendations Engine Insights */}
              {recommendations && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
                  <h4 className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                    <span>🧠</span> Recomendações do OODA Learning Loop
                  </h4>

                  <div className="space-y-2">
                    {recommendations.recommendations.map((rec, i) => (
                      <div key={i} className="p-2.5 bg-[#0c0a0b]/80 border border-emerald-500/20 rounded-lg text-emerald-200/90 text-[11px]">
                        • {rec}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <span className="block text-[10px] uppercase font-bold text-emerald-400 mb-1.5">Top Pilares de Conversão</span>
                    <div className="space-y-1">
                      {recommendations.topPerformingPillars.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] p-2 bg-[#120e10] rounded border border-white/5">
                          <span className="font-mono font-bold text-stone-300">{p.pillar}</span>
                          <span className="text-stone-400">Hook: {p.recommendedHookType}</span>
                          <span className="font-mono text-emerald-400 font-bold">{p.avgConversionRate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Telemetry Event Trail */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-300 text-xs flex items-center gap-1.5">
                  <span>📜</span> Trilha Telemétrica de Eventos (D1 Audit)
                </h4>

                {isLoadingMetrics ? (
                  <div className="py-6 text-center text-stone-500 animate-pulse">Carregando eventos...</div>
                ) : eventsList.length === 0 ? (
                  <div className="p-4 text-center text-stone-500 bg-[#0c0a0b] rounded-xl border border-white/5">
                    Nenhum evento telemétrico registrado ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {eventsList.map((evt) => (
                      <div key={evt.id} className="p-3 bg-[#0c0a0b] border border-white/10 rounded-xl flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                              {evt.eventType}
                            </span>
                            <span className="font-mono text-[10px] text-stone-400">{evt.actorId}</span>
                          </div>
                          {evt.payload && Object.keys(evt.payload).length > 0 && (
                            <pre className="text-[10px] font-mono text-stone-400 bg-[#161214] p-1.5 rounded overflow-x-auto max-w-md">
                              {JSON.stringify(evt.payload, null, 2)}
                            </pre>
                          )}
                        </div>
                        <span className="font-mono text-[9px] text-stone-500 whitespace-nowrap">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
