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
    createdBy: 'Jeferson (Founder)',
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
    createdBy: 'Bruno (Commercial)',
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
    createdBy: 'Jeferson (Founder)',
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
      hook: 'Gancho inicial cativante...',
      script: 'Roteiro de teste...',
      cta: 'Acesse o link na bio!',
      dnaPillarId: 'erotic_luxury',
      brandDnaVersion: 1,
      scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
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
    <div className="space-y-6 text-[#faf7f5] pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10 bg-[#161214]/80 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/40 uppercase tracking-widest">
              V8 Content OS
            </span>
            <span className="text-xs text-stone-400 font-mono">Cloudflare D1 + Hono Edge</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Agenda Core & Matriz de Conteúdo</h1>
          <p className="text-xs text-stone-400">
            Planejamento inteligente e execução orquestrada em ciclos de 30, 60 e 90 dias.
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
            + Novo Post na Agenda
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
        /* Calendar Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calendarDays.slice(0, 28).map((day) => {
            const isToday = new Date().toISOString().split('T')[0] === day.dateStr;

            return (
              <div
                key={day.dateStr}
                className={`min-h-[140px] p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-[#1e1519]/90 border-[#e11d48]/50 shadow-lg shadow-[#e11d48]/10'
                    : 'bg-[#120e10]/60 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-bold font-mono ${isToday ? 'text-[#e11d48]' : 'text-stone-300'}`}>
                    {day.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#e11d48] text-white">
                      HOJE
                    </span>
                  )}
                </div>

                {/* Posts Cards inside day */}
                <div className="space-y-2 flex-1">
                  {day.posts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] text-stone-600 border border-dashed border-white/5 rounded-xl p-2">
                      Sem posts agendados
                    </div>
                  ) : (
                    day.posts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => {
                          setSelectedPost(post);
                          setIsDrawerOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all hover:scale-[1.02] space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wide">
                            {post.platform}
                          </span>
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
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel rounded-2xl border border-white/10 bg-[#120e10]/80 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0a0b] text-stone-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Post & Gancho</th>
                  <th className="p-4">Plataforma</th>
                  <th className="p-4">Objetivo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data Agendada</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-white text-xs">{post.title}</p>
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
                      {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString('pt-BR') : 'Sem data'}
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
                ))}
              </tbody>
            </table>
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
