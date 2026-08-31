import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Sparkles,
  Instagram,
  Youtube,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Edit3,
  Film,
  Layers,
  Filter,
  Eye,
  X,
  Share2,
} from "lucide-react";

export interface AgendaPostIt {
  id: string;
  title: string;
  platform: "youtube" | "instagram" | "tiktok" | "facebook" | "reels";
  thumbnailType: string; // "Thumbnail (Miniatura)" | "Capa do Reel" | "Capa do Vídeo" | "Miniatura / Capa"
  thumbnailUrl: string;
  aspectRatio: "9:16" | "16:9" | "1:1";
  dayOfWeek: "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo";
  timeSlot: "09:00" | "12:00" | "15:00" | "18:00" | "21:00";
  scheduledDate: string;
  status: "Agendado" | "Rascunho" | "Renderizando" | "Publicado";
  colorTheme: "yellow" | "pink" | "cyan" | "mint" | "purple";
  caption?: string;
}

const INITIAL_POSTITS: AgendaPostIt[] = [
  {
    id: "post-1",
    title: "Teaser Lançamento V8 - Acompanhe os Bastidores",
    platform: "reels",
    thumbnailType: "Capa do Reel",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    aspectRatio: "9:16",
    dayOfWeek: "Segunda",
    timeSlot: "18:00",
    scheduledDate: "2026-09-01",
    status: "Agendado",
    colorTheme: "pink",
    caption: "Capítulo 1 do novo ecossistema V8 em alta definição.",
  },
  {
    id: "post-2",
    title: "Tutorial Completo: Como Usar o Kanban CRM",
    platform: "youtube",
    thumbnailType: "Thumbnail (Miniatura)",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    aspectRatio: "16:9",
    dayOfWeek: "Terça",
    timeSlot: "12:00",
    scheduledDate: "2026-09-02",
    status: "Agendado",
    colorTheme: "cyan",
    caption: "Miniatura oficial do vídeo do YouTube para alta taxa de clique (CTR).",
  },
  {
    id: "post-3",
    title: "Carrossel Exclusivo: Mídia Sensorial 4K",
    platform: "instagram",
    thumbnailType: "Capa do Vídeo",
    thumbnailUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    aspectRatio: "1:1",
    dayOfWeek: "Quarta",
    timeSlot: "15:00",
    scheduledDate: "2026-09-03",
    status: "Rascunho",
    colorTheme: "yellow",
    caption: "Design com tom de ouro aquecido e obsidian.",
  },
  {
    id: "post-4",
    title: "Highlights TikTok: Tendências da Semana",
    platform: "tiktok",
    thumbnailType: "Capa do Vídeo",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    aspectRatio: "9:16",
    dayOfWeek: "Sexta",
    timeSlot: "21:00",
    scheduledDate: "2026-09-05",
    status: "Renderizando",
    colorTheme: "purple",
    caption: "Efeito de corte dinâmico em 9:16 com áudio em alta.",
  },
  {
    id: "post-5",
    title: "Postagem Especial de Fim de Semana",
    platform: "facebook",
    thumbnailType: "Miniatura / Capa",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    aspectRatio: "16:9",
    dayOfWeek: "Domingo",
    timeSlot: "09:00",
    scheduledDate: "2026-09-07",
    status: "Agendado",
    colorTheme: "mint",
    caption: "Capa otimizada para o Feed do Facebook e grupos.",
  },
];

const DAYS: ("Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo")[] = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const TIME_SLOTS: ("09:00" | "12:00" | "15:00" | "18:00" | "21:00")[] = [
  "09:00",
  "12:00",
  "15:00",
  "18:00",
  "21:00",
];

const COLOR_CLASSES = {
  yellow: {
    bg: "bg-amber-500/15 border-amber-500/40 text-amber-200 hover:border-amber-400",
    pin: "bg-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  pink: {
    bg: "bg-rose-500/15 border-rose-500/40 text-rose-200 hover:border-rose-400",
    pin: "bg-rose-400",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  cyan: {
    bg: "bg-cyan-500/15 border-cyan-500/40 text-cyan-200 hover:border-cyan-400",
    pin: "bg-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  mint: {
    bg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 hover:border-emerald-400",
    pin: "bg-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  purple: {
    bg: "bg-purple-500/15 border-purple-500/40 text-purple-200 hover:border-purple-400",
    pin: "bg-purple-400",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
};

export function CustomProjectAgenda(): React.ReactElement {
  const [postits, setPostits] = useState<AgendaPostIt[]>(INITIAL_POSTITS);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [selectedPostIt, setSelectedPostIt] = useState<AgendaPostIt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState<AgendaPostIt["platform"]>("instagram");
  const [newDay, setNewDay] = useState<AgendaPostIt["dayOfWeek"]>("Segunda");
  const [newTime, setNewTime] = useState<AgendaPostIt["timeSlot"]>("18:00");
  const [newColor, setNewColor] = useState<AgendaPostIt["colorTheme"]>("pink");

  const filteredPostits = postits.filter((item) => {
    if (platformFilter === "all") return true;
    return item.platform === platformFilter;
  });

  const getPlatformLabel = (platform: AgendaPostIt["platform"]): { label: string; thumbName: string } => {
    switch (platform) {
      case "youtube":
        return { label: "YouTube", thumbName: "Thumbnail (Miniatura)" };
      case "instagram":
        return { label: "Instagram", thumbName: "Capa do Vídeo" };
      case "reels":
        return { label: "Reels / Stories", thumbName: "Capa do Reel" };
      case "tiktok":
        return { label: "TikTok", thumbName: "Capa do Vídeo" };
      case "facebook":
        return { label: "Facebook", thumbName: "Miniatura / Capa" };
    }
  };

  const handleCreatePostIt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const meta = getPlatformLabel(newPlatform);
    const newPost: AgendaPostIt = {
      id: `post-${Date.now()}`,
      title: newTitle,
      platform: newPlatform,
      thumbnailType: meta.thumbName,
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
      aspectRatio: newPlatform === "youtube" ? "16:9" : newPlatform === "facebook" ? "1:1" : "9:16",
      dayOfWeek: newDay,
      timeSlot: newTime,
      scheduledDate: new Date().toISOString().split("T")[0],
      status: "Agendado",
      colorTheme: newColor,
      caption: "Criado via Agenda IA Cockpit V8.",
    };

    setPostits((prev) => [newPost, ...prev]);
    setNewTitle("");
    setIsModalOpen(false);
  };

  const handleDeletePostIt = (id: string) => {
    setPostits((prev) => prev.filter((p) => p.id !== id));
    if (selectedPostIt?.id === id) setSelectedPostIt(null);
  };

  return (
    <div className="flex w-full flex-col bg-transparent p-4 text-zinc-100 min-h-[calc(100vh-160px)]">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
              Agenda IA & Cronograma de Postagens
            </h1>
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 font-mono text-xs text-cyan-400 border border-cyan-500/30">
              Estilo Post-it + Kanban
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Agendamento inteligente de publicações com capas (Thumbnails, Capas de Reels/Vídeos) e horários de pico.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Grade Post-it
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "timeline"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Linha do Tempo
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-900/40 transition-all hover:bg-cyan-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Novo Post-it
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Agendados</span>
            <CalendarIcon className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xl font-bold text-white mt-1">{postits.length} Post-its</p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Próximo Disparo</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-amber-300 mt-1">Hoje às 18:00 (Reels)</p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Capas Validadas</span>
            <ImageIcon className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-300 mt-1">100% Taxa CTR</p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Motor IA Volúpia</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-sm font-semibold text-purple-300 mt-1">Ativo (Dispatcher :7860)</p>
        </div>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
          <Filter className="h-3 w-3" /> Filtrar:
        </span>
        {[
          { id: "all", label: "Todas Plataformas" },
          { id: "instagram", label: "Instagram" },
          { id: "reels", label: "Reels / Stories" },
          { id: "youtube", label: "YouTube" },
          { id: "tiktok", label: "TikTok" },
          { id: "facebook", label: "Facebook" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setPlatformFilter(item.id)}
            className={`rounded-full px-3 py-1 text-xs transition-colors shrink-0 ${
              platformFilter === item.id
                ? "bg-zinc-100 text-zinc-900 font-semibold"
                : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {viewMode === "grid" ? (
        /* Weekly Post-it Grid View */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-7 overflow-x-auto">
          {DAYS.map((day) => {
            const dayItems = filteredPostits.filter((p) => p.dayOfWeek === day);
            return (
              <div
                key={day}
                className="flex flex-col gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-2.5 min-h-[420px]"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 px-1">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{day}</span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 font-mono">
                    {dayItems.length}
                  </span>
                </div>

                {/* Day Slot Cards */}
                <div className="flex flex-col gap-3">
                  {dayItems.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800/80 text-zinc-600 text-[11px]">
                      Sem postagems
                    </div>
                  ) : (
                    dayItems.map((post) => {
                      const colorTheme = COLOR_CLASSES[post.colorTheme];
                      return (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPostIt(post)}
                          className={`group relative flex flex-col gap-2 rounded-lg border p-3 shadow-md transition-all duration-200 cursor-pointer ${colorTheme.bg}`}
                        >
                          {/* Pin / Tape Header */}
                          <div className="flex items-center justify-between">
                            <div className={`h-1.5 w-8 rounded-full ${colorTheme.pin} opacity-80`} />
                            <span className="font-mono text-[10px] text-zinc-400 font-semibold">
                              {post.timeSlot}
                            </span>
                          </div>

                          {/* Thumbnail / Capa Badge */}
                          <div className="flex items-center gap-1">
                            <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold border ${colorTheme.badge}`}>
                              {post.thumbnailType}
                            </span>
                            <span className="rounded bg-zinc-900/80 px-1 py-0.5 font-mono text-[9px] text-zinc-400 border border-zinc-800">
                              {post.aspectRatio}
                            </span>
                          </div>

                          {/* Post Title */}
                          <h4 className="text-xs font-semibold leading-tight text-white line-clamp-2">
                            {post.title}
                          </h4>

                          {/* Image Capa Preview */}
                          <div className="relative overflow-hidden rounded border border-zinc-800/80 bg-zinc-950 aspect-video group-hover:border-cyan-500/40">
                            <img
                              src={post.thumbnailUrl}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 font-mono text-[9px] text-cyan-300">
                              {post.platform.toUpperCase()}
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50 text-[10px] text-zinc-400">
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="h-3 w-3" /> {post.status}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePostIt(post.id);
                              }}
                              className="text-zinc-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
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
        /* Timeline View */
        <div className="flex flex-col gap-3">
          {filteredPostits.map((post) => {
            const colorTheme = COLOR_CLASSES[post.colorTheme];
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPostIt(post)}
                className={`flex flex-col md:flex-row md:items-center justify-between rounded-xl border p-4 backdrop-blur-sm cursor-pointer transition-all hover:scale-[1.005] ${colorTheme.bg}`}
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 relative">
                    <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 left-1 rounded bg-black/80 px-1 py-0.5 font-mono text-[9px] text-cyan-300">
                      {post.aspectRatio}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold border ${colorTheme.badge}`}>
                        {post.thumbnailType}
                      </span>
                      <span className="font-mono text-xs text-zinc-400">
                        {post.dayOfWeek} às {post.timeSlot} ({post.scheduledDate})
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{post.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-1">{post.caption}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 md:mt-0 border-t md:border-t-0 border-zinc-800/60 pt-2 md:pt-0">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-400 border border-emerald-500/30">
                    {post.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePostIt(post.id);
                    }}
                    className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Novo Post-it */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" /> Criar Agendamento / Post-it
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostIt} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Título da Publicação</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Capa do Reel - Bastidores V8"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Plataforma</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as AgendaPostIt["platform"])}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="instagram">Instagram (Capa do Vídeo)</option>
                    <option value="reels">Reels / Stories (Capa do Reel)</option>
                    <option value="youtube">YouTube (Thumbnail / Miniatura)</option>
                    <option value="tiktok">TikTok (Capa do Vídeo)</option>
                    <option value="facebook">Facebook (Miniatura / Capa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cor do Post-it</label>
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value as AgendaPostIt["colorTheme"])}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="pink">Rosa Luxury</option>
                    <option value="yellow">Amarelo Post-it</option>
                    <option value="cyan">Azul Cyan</option>
                    <option value="purple">Roxo Violet</option>
                    <option value="mint">Verde Mint</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Dia da Semana</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as AgendaPostIt["dayOfWeek"])}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Horário de Pico</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value as AgendaPostIt["timeSlot"])}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
                >
                  Criar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
