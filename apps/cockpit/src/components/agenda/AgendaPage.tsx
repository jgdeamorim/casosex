import React, { useState, useEffect, useMemo } from 'react';
import type { ContentPost, ContentPostStatus, ContentObjective, ContentPlatform, UserRole } from '../../types/content-os';
import { ContentOsService } from '../../services/contentOsService';
import { ContentPostDrawer } from './ContentPostDrawer';

interface AgendaPageProps {
  userRole: UserRole;
}

const INITIAL_MOCK_POSTS: ContentPost[] = [
  {
    id: 'post-001',
    title: 'Lançamento Coleção Sensual Luxury',
    objective: 'awareness',
    platform: 'instagram',
    format: 'reels_9_16',
    hook: 'Você sabia que o toque de seda pura altera a temperatura do seu corpo?',
    script: 'Cena 1: Close-up em movimento lento nos tecidos luxuosos.\nCena 2: Transição suave para modelo vestindo a nova peça.\nCena 3: Revelação do frasco e ambiente intimista.',
    cta: 'Comente "SEDA" para receber o catálogo exclusivo em primeira mão no Direct.',
    status: 'approved',
    dnaPillarId: 'erotic_luxury',
    brandDnaVersion: 1,
    characterId: 'char-sofia-01',
    promptTemplateId: 'tpl-luxury-01',
    compiledPrompt: 'Hyperrealistic portrait of Sofia in silk dress, cinematic lighting, 8k resolution',
    promptHash: 'b3_8f9a2b1c4e7d',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdBy: 'Agente V8 (Auto)',
    approvedBy: 'Gláucia (Ops)',
    approvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-002',
    title: 'Segredos de Bastidores - Fragrância Volúpia',
    objective: 'authority',
    platform: 'tiktok',
    format: 'tiktok_9_16',
    hook: 'Descobri o ingrediente secreto que torna esse perfume irresistível por 12 horas...',
    script: 'Cena 1: Frasco com luz dramática e vapor sutil.\nCena 2: Narração em off revelando as notas olfativas.\nCena 3: Demonstração de frasco e embalagem de presente.',
    cta: 'Link na bio para garantir com frete grátis esta semana!',
    status: 'review',
    dnaPillarId: 'sensory_authority',
    brandDnaVersion: 1,
    characterId: 'char-lucas-02',
    promptTemplateId: 'tpl-fragrance-02',
    compiledPrompt: 'Perfume bottle with dramatic mist, moody ambient lighting, luxury product photography',
    promptHash: 'b3_1a2b3c4d5e6f',
    scheduledAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdBy: 'Agente V8 (Auto)',
    approvedBy: null,
    approvedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-003',
    title: '3 Erros ao Escolher a Lingerie Perfeita',
    objective: 'conversion',
    platform: 'instagram',
    format: 'carousel_1_1',
    hook: 'Parou de comprar peças que machucam? Evite esses 3 erros comuns agora!',
    script: 'Slide 1: Capa impactante.\nSlide 2: Erro 1 - Tamanho incorreto da taça.\nSlide 3: Erro 2 - Tecido sintético sem respirabilidade.\nSlide 4: Solução Volúpia.',
    cta: 'Salve este post para não errar na próxima compra.',
    status: 'draft',
    dnaPillarId: 'education_fit',
    brandDnaVersion: 1,
    characterId: null,
    promptTemplateId: null,
    compiledPrompt: null,
    promptHash: null,
    scheduledAt: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdBy: 'Agente V8 (Auto)',
    approvedBy: null,
    approvedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function AgendaPage({ userRole }: AgendaPageProps): React.ReactElement {
  const [posts, setPosts] = useState<ContentPost[]>(INITIAL_MOCK_POSTS);
  const [cycleDays, setCycleDays] = useState<30 | 60 | 90>(30);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedPlatform, setSelectedPlatform] = useState<ContentPlatform | 'all'>('all');
  const [selectedObjective, setSelectedObjective] = useState<ContentObjective | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ContentPostStatus | 'all'>('all');
  
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Drag and Drop & Batch Action States (P6)
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [dragOverDateStr, setDragOverDateStr] = useState<string | null>(null);
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    void ContentOsService.fetchPosts().then((fetched) => {
      if (isMounted && fetched.length > 0) {
        setPosts(fetched);
      }
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) return false;
      if (selectedObjective !== 'all' && post.objective !== selectedObjective) return false;
      if (selectedStatus !== 'all' && post.status !== selectedStatus) return false;
      return true;
    });
  }, [posts, selectedPlatform, selectedObjective, selectedStatus]);

  const handleCreateNewPost = async (): Promise<void> => {
    const newPostData: Partial<ContentPost> = {
      title: `Novo Conteúdo #${posts.length + 1}`,
      objective: 'awareness',
      platform: 'instagram',
      format: 'reels_9_16',
      hook: 'Gancho inicial cativante orquestrado pelo Agente...',
      script: 'Roteiro de teste...',
      cta: 'Acesse o link na bio!',
      dnaPillarId: 'erotic_luxury',
      brandDnaVersion: 1,
      scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdBy: 'Agente V8 (Auto)',
    };

    try {
      const created = await ContentOsService.createPost(newPostData);
      if (created) {
        setPosts((prev) => [created, ...prev]);
        setSelectedPost(created);
        setIsDrawerOpen(true);
      }
    } catch (e: unknown) {
      void e;
    }
  };

  const handlePostUpdated = (updated: ContentPost): void => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedPost?.id === updated.id) {
      setSelectedPost(updated);
    }
  };

  const handlePostDeleted = (deletedId: string): void => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
    setSelectedPostIds((prev) => {
      const next = new Set(prev);
      next.delete(deletedId);
      return next;
    });
  };

  // Drag and Drop Handler for Rescheduling Event Slots
  const handleDropOnDate = async (targetDateStr: string): Promise<void> => {
    if (!draggedPostId) return;

    const postToMove = posts.find((p) => p.id === draggedPostId);
    if (!postToMove) return;

    // Calculate new scheduled date, keeping original time if available, or default 14:00
    const targetDate = new Date(targetDateStr);
    if (postToMove.scheduledAt) {
      const orig = new Date(postToMove.scheduledAt);
      targetDate.setHours(orig.getHours(), orig.getMinutes(), orig.getSeconds());
    } else {
      targetDate.setHours(14, 0, 0);
    }

    const newScheduledIso = targetDate.toISOString();

    // Optimistic Update
    const updatedPost = { ...postToMove, scheduledAt: newScheduledIso, updatedAt: new Date().toISOString() };
    setPosts((prev) => prev.map((p) => (p.id === draggedPostId ? updatedPost : p)));
    setDraggedPostId(null);
    setDragOverDateStr(null);

    try {
      await ContentOsService.updatePost(draggedPostId, { scheduledAt: newScheduledIso });
      await ContentOsService.recordPostEvent(draggedPostId, 'scheduled', {
        rescheduledTo: newScheduledIso,
        trigger: 'founder_drag_and_drop',
      });
    } catch (e: unknown) {
      void e;
    }
  };

  // Batch Operations Logic
  const toggleSelectPost = (id: string, e?: React.MouseEvent): void => {
    if (e) e.stopPropagation();
    setSelectedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllFiltered = (): void => {
    setSelectedPostIds(new Set(filteredPosts.map((p) => p.id)));
  };

  const clearSelection = (): void => {
    setSelectedPostIds(new Set());
  };

  const handleBatchApprove = async (): Promise<void> => {
    if (selectedPostIds.size === 0) return;
    setIsBatchProcessing(true);
    try {
      const ids = Array.from(selectedPostIds);
      for (const id of ids) {
        const approved = await ContentOsService.approvePost(id);
        if (approved) {
          setPosts((prev) => prev.map((p) => (p.id === id ? approved : p)));
        } else {
          // Fallback optimistic update
          setPosts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: 'approved', approvedBy: 'Founder (Batch)' } : p))
          );
        }
      }
      clearSelection();
    } catch (e: unknown) {
      void e;
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchShiftDays = async (daysDelta: number): Promise<void> => {
    if (selectedPostIds.size === 0) return;
    setIsBatchProcessing(true);
    try {
      const ids = Array.from(selectedPostIds);
      for (const id of ids) {
        const post = posts.find((p) => p.id === id);
        if (!post) continue;
        const currentSched = post.scheduledAt ? new Date(post.scheduledAt) : new Date();
        currentSched.setDate(currentSched.getDate() + daysDelta);
        const newIso = currentSched.toISOString();

        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, scheduledAt: newIso } : p)));
        await ContentOsService.updatePost(id, { scheduledAt: newIso });
        await ContentOsService.recordPostEvent(id, 'scheduled', {
          batchShiftDays: daysDelta,
          trigger: 'founder_batch_reschedule',
        });
      }
      clearSelection();
    } catch (e: unknown) {
      void e;
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < cycleDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const postsForDay = filteredPosts.filter(
        (p) => p.scheduledAt && p.scheduledAt.startsWith(dateStr)
      );
      days.push({ date: d, dateStr, posts: postsForDay });
    }
    return days;
  }, [cycleDays, filteredPosts]);

  return (
    <div className="space-y-6 text-[#faf7f5] pb-24 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10 bg-[#161214]/80 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/40 uppercase tracking-widest">
              V8 Content OS
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1">
              <span>🤖</span> Agente IA Automatizado
            </span>
            <span className="text-xs text-stone-400 font-mono hidden sm:inline">Cloudflare D1 + Hono Edge</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Agenda Core & Matriz de Conteúdo</h1>
          <p className="text-xs text-stone-400">
            A agenda é orquestrada pelo Agente IA. Arraste e solte eventos de publicação para reagendar slots ou aprove em lote.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCreateNewPost}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e11d48] hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-lg shadow-[#e11d48]/20 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            + Novo Post (Solicitar Agente)
          </button>
        </div>
      </div>

      {/* Controls & Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-[#120e10]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Cycle & View Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-semibold mr-1">Ciclo:</span>
          {([30, 60, 90] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setCycleDays(days)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                cycleDays === days
                  ? 'bg-[#e11d48] text-white shadow'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {days} Dias
            </button>
          ))}

          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-stone-800 text-white border border-stone-700'
                : 'bg-white/5 text-stone-400 hover:text-white'
            }`}
          >
            📅 Visão Calendário
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-stone-800 text-white border border-stone-700'
                : 'bg-white/5 text-stone-400 hover:text-white'
            }`}
          >
            📋 Visão Lista
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as ContentPlatform | 'all')}
            className="bg-[#0c0a0b] border border-white/15 rounded-lg px-3 py-1.5 text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#e11d48]"
          >
            <option value="all">Todas as Plataformas</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube Shorts</option>
            <option value="facebook">Facebook</option>
          </select>

          <select
            value={selectedObjective}
            onChange={(e) => setSelectedObjective(e.target.value as ContentObjective | 'all')}
            className="bg-[#0c0a0b] border border-white/15 rounded-lg px-3 py-1.5 text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#e11d48]"
          >
            <option value="all">Todos os Objetivos</option>
            <option value="awareness">Awareness (Alcance)</option>
            <option value="authority">Autoridade (Engajamento)</option>
            <option value="conversion">Conversão (Vendas)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ContentPostStatus | 'all')}
            className="bg-[#0c0a0b] border border-white/15 rounded-lg px-3 py-1.5 text-stone-300 focus:outline-none focus:ring-1 focus:ring-[#e11d48]"
          >
            <option value="all">Todos os Status</option>
            <option value="draft">Rascunho</option>
            <option value="generated">Gerado (AI)</option>
            <option value="review">Em Revisão</option>
            <option value="approved">Aprovado</option>
            <option value="scheduled">Agendado</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-400 font-mono text-xs">
          Carregando dados da Agenda V8 via D1...
        </div>
      ) : viewMode === 'calendar' ? (
        /* Calendar Grid View with Drag and Drop Support */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calendarDays.slice(0, 28).map((day) => {
            const isToday = new Date().toISOString().split('T')[0] === day.dateStr;
            const isDragOver = dragOverDateStr === day.dateStr;

            return (
              <div
                key={day.dateStr}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverDateStr !== day.dateStr) setDragOverDateStr(day.dateStr);
                }}
                onDragLeave={() => {
                  if (dragOverDateStr === day.dateStr) setDragOverDateStr(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  void handleDropOnDate(day.dateStr);
                }}
                className={`min-h-[160px] p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDragOver
                    ? 'bg-[#e11d48]/20 border-[#e11d48] scale-[1.02] shadow-xl shadow-[#e11d48]/20'
                    : isToday
                    ? 'bg-[#1e1519]/90 border-[#e11d48]/50 shadow-lg shadow-[#e11d48]/10'
                    : 'bg-[#120e10]/60 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between text-xs mb-2 pb-1 border-b border-white/5">
                  <span className={`font-bold font-mono ${isToday ? 'text-[#e11d48]' : 'text-stone-300'}`}>
                    {day.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </span>
                  <div className="flex items-center gap-1">
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#e11d48] text-white">
                        HOJE
                      </span>
                    )}
                    <span className="text-[10px] text-stone-500 font-mono">
                      {day.posts.length} {day.posts.length === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                </div>

                {/* Posts Cards inside day */}
                <div className="space-y-2 flex-1">
                  {day.posts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] text-stone-600 border border-dashed border-white/5 rounded-xl p-3 text-center">
                      Arrastar evento aqui
                    </div>
                  ) : (
                    day.posts.map((post) => {
                      const isSelected = selectedPostIds.has(post.id);

                      return (
                        <div
                          key={post.id}
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', post.id);
                            setDraggedPostId(post.id);
                          }}
                          onDragEnd={() => {
                            setDraggedPostId(null);
                            setDragOverDateStr(null);
                          }}
                          onClick={() => {
                            setSelectedPost(post);
                            setIsDrawerOpen(true);
                          }}
                          className={`p-2.5 rounded-xl border cursor-grab active:cursor-grabbing transition-all space-y-1.5 group relative ${
                            isSelected
                              ? 'bg-rose-950/40 border-[#e11d48] ring-1 ring-[#e11d48]'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectPost(post.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-3.5 h-3.5 rounded border-white/20 bg-stone-900 text-[#e11d48] focus:ring-0 cursor-pointer"
                              />
                              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wide">
                                {post.platform}
                              </span>
                            </div>

                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                post.status === 'approved'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : post.status === 'review'
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white group-hover:text-rose-300 line-clamp-1">
                            {post.title}
                          </h4>

                          {post.hook && (
                            <p className="text-[10px] text-stone-400 line-clamp-2 italic">
                              "{post.hook}"
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[9px] text-stone-500 pt-1 border-t border-white/5">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Agente V8
                            </span>
                            <span className="font-mono">
                              {post.scheduledAt ? new Date(post.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel rounded-2xl border border-white/10 bg-[#120e10]/80 backdrop-blur-xl overflow-hidden">
          <div className="p-3 bg-[#0c0a0b] border-b border-white/10 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllFiltered}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] font-medium"
              >
                Selecionar Todos ({filteredPosts.length})
              </button>
              {selectedPostIds.size > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 text-[11px]"
                >
                  Limpar Seleção
                </button>
              )}
            </div>
            <span className="text-[11px] text-stone-500 font-mono">
              {selectedPostIds.size} selecionado(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0a0b]/80 text-stone-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 w-8">
                    <input
                      type="checkbox"
                      checked={selectedPostIds.size > 0 && selectedPostIds.size === filteredPosts.length}
                      onChange={(e) => {
                        if (e.target.checked) selectAllFiltered();
                        else clearSelection();
                      }}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-stone-900 text-[#e11d48]"
                    />
                  </th>
                  <th className="p-4">Post & Gancho (Agente IA)</th>
                  <th className="p-4">Plataforma</th>
                  <th className="p-4">Objetivo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data Agendada</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filteredPosts.map((post) => {
                  const isSelected = selectedPostIds.has(post.id);

                  return (
                    <tr
                      key={post.id}
                      className={`transition-colors ${isSelected ? 'bg-rose-950/30' : 'hover:bg-white/5'}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPost(post.id)}
                          className="w-3.5 h-3.5 rounded border-white/20 bg-stone-900 text-[#e11d48] cursor-pointer"
                        />
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-xs">{post.title}</p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                            Agente V8
                          </span>
                        </div>
                        {post.hook && <p className="text-[10px] text-stone-400 italic">"{post.hook}"</p>}
                      </td>
                      <td className="p-4 font-mono uppercase text-rose-400 font-bold">{post.platform}</td>
                      <td className="p-4 font-medium uppercase text-stone-400">{post.objective}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 text-stone-300 uppercase">
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 text-stone-400 font-mono text-[11px]">
                        {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sem data'}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsDrawerOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-colors"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Batch Action Bar (P6) */}
      {selectedPostIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1e1519]/95 border border-[#e11d48]/40 shadow-2xl shadow-rose-950/80 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <span className="w-6 h-6 rounded-full bg-[#e11d48] text-white font-black text-xs flex items-center justify-center">
              {selectedPostIds.size}
            </span>
            <span className="text-xs font-bold text-white">Eventos Selecionados</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isBatchProcessing}
              onClick={() => void handleBatchApprove()}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>✓</span> Aprovar em Lote
            </button>

            <button
              type="button"
              disabled={isBatchProcessing}
              onClick={() => void handleBatchShiftDays(1)}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-white/10 transition-all flex items-center gap-1 disabled:opacity-50"
            >
              <span>+1 Dia</span>
            </button>

            <button
              type="button"
              disabled={isBatchProcessing}
              onClick={() => void handleBatchShiftDays(7)}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-white/10 transition-all flex items-center gap-1 disabled:opacity-50"
            >
              <span>+7 Dias</span>
            </button>

            <button
              type="button"
              onClick={clearSelection}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white font-semibold text-xs transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Sovereign Content Post Drawer */}
      <ContentPostDrawer
        post={selectedPost}
        isOpen={isDrawerOpen}
        userRole={userRole}
        onClose={() => setIsDrawerOpen(false)}
        onPostUpdated={handlePostUpdated}
        onPostDeleted={handlePostDeleted}
      />
    </div>
  );
}
