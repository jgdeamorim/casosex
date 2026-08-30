import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Sparkles,
  Wand2,
  Eye,
  Calendar,
  Rocket,
  Plus,
  MoreVertical,
  Film,
  Camera,
  Layers,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { CustomMediaStudioModal } from "./custom-media-studio-modal";
import {
  fetchVolupiaBoard,
  saveVolupiaBoard,
  triggerMediaGeneration,
} from "../services/volupia-kanban-service";

export interface KanbanItem {
  id: string;
  title: string;
  prompt: string;
  cameraOptics: {
    camera: string;
    lens: string;
    focal: number;
    aperture: string;
  };
  platform: "reels" | "feed" | "banner" | "youtube";
  aspectRatio: "9:16" | "1:1" | "16:9" | "21:9";
  scheduledTime?: string;
  views?: number;
}

export type ColumnId = "ideas" | "creation" | "review" | "scheduled" | "published";

export interface ColumnDefinition {
  id: ColumnId;
  title: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  badgeBg: string;
}

const COLUMNS: ColumnDefinition[] = [
  {
    id: "ideas",
    title: "💡 Ideias & Prompts",
    icon: Sparkles,
    color: "text-amber-400",
    borderColor: "border-amber-500/20",
    badgeBg: "bg-amber-500/10 text-amber-300",
  },
  {
    id: "creation",
    title: "🎨 Em Criação",
    icon: Wand2,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    badgeBg: "bg-cyan-500/10 text-cyan-300",
  },
  {
    id: "review",
    title: "✍️ Revisão & Preview",
    icon: Eye,
    color: "text-purple-400",
    borderColor: "border-purple-500/20",
    badgeBg: "bg-purple-500/10 text-purple-300",
  },
  {
    id: "scheduled",
    title: "📅 Agendados",
    icon: Calendar,
    color: "text-blue-400",
    borderColor: "border-blue-500/20",
    badgeBg: "bg-blue-500/10 text-blue-300",
  },
  {
    id: "published",
    title: "🚀 Publicados",
    icon: Rocket,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    badgeBg: "bg-emerald-500/10 text-emerald-300",
  },
];

const INITIAL_BOARD: Record<ColumnId, KanbanItem[]> = {
  ideas: [
    {
      id: "post-101",
      title: "Teaser Lançamento Volúpia 2026",
      prompt: "Close-up sensual de iluminação neon em estúdio sombrio com reflexos metálicos em 8K",
      cameraOptics: { camera: "full_frame", lens: "anamorphic", focal: 35, aperture: "f/1.4" },
      platform: "reels",
      aspectRatio: "9:16",
    },
    {
      id: "post-102",
      title: "Bastidores do Ensaio Fotográfico",
      prompt: "Estética 16mm retrô com grão visível e iluminação de tungstênio suave",
      cameraOptics: { camera: "classic_16mm", lens: "vintage_prime", focal: 50, aperture: "f/1.4" },
      platform: "feed",
      aspectRatio: "1:1",
    },
  ],
  creation: [
    {
      id: "post-103",
      title: "Promoção Sensual de Inverno",
      prompt: "Modelo em ângulo contra-plongée em estúdio cibernético com fumaça e feixes azuis",
      cameraOptics: { camera: "digital_8k", lens: "tilt", focal: 85, aperture: "f/1.4" },
      platform: "reels",
      aspectRatio: "9:16",
    },
  ],
  review: [
    {
      id: "post-104",
      title: "Spot de Vídeo 4K - Lingerie Seda",
      prompt: "Profundidade de campo rasa com bokeh cremoso e foco seletivo nos tecidos de seda",
      cameraOptics: { camera: "grand_format_70mm", lens: "macro", focal: 85, aperture: "f/1.4" },
      platform: "youtube",
      aspectRatio: "16:9",
    },
  ],
  scheduled: [
    {
      id: "post-105",
      title: "Banner Campanha Noturna",
      prompt: "Super ultrawide 21:9 panorâmico de skyline urbano noturno com iluminação cinematográfica",
      cameraOptics: { camera: "super_35", lens: "anamorphic", focal: 24, aperture: "f/4" },
      platform: "banner",
      aspectRatio: "21:9",
      scheduledTime: "30/08/2026 21:00",
    },
  ],
  published: [
    {
      id: "post-106",
      title: "Lançamento Coleção Outono",
      prompt: "Composição harmônica em luz natural com desfoque de fundo cinematográfico",
      cameraOptics: { camera: "full_frame", lens: "vintage_prime", focal: 50, aperture: "f/1.4" },
      platform: "reels",
      aspectRatio: "9:16",
      views: 14250,
    },
  ],
};

// Kanban Card Component
interface KanbanCardProps {
  item: KanbanItem;
  onOpenPreview?: (item: KanbanItem) => void;
  isOverlay?: boolean;
}

function KanbanCard({ item, onOpenPreview, isOverlay = false }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenPreview?.(item)}
      className={cn(
        "group relative flex flex-col gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-3.5 shadow-lg backdrop-blur-sm transition-all duration-150 hover:border-cyan-500/40 hover:bg-zinc-900 active:scale-[0.98] cursor-pointer",
        isDragging && "opacity-40 border-cyan-500/50 scale-[0.98]",
        isOverlay && "border-cyan-400 bg-zinc-900 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.02] cursor-grabbing"
      )}
    >
      {/* Top Card Header */}
      <div className="flex items-center justify-between">
        <span className="rounded bg-cyan-950/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-400 border border-cyan-800/30">
          {item.platform} • {item.aspectRatio}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPreview?.(item);
          }}
          className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Title */}
      <h4 className="font-sans text-xs font-semibold text-zinc-100 line-clamp-1" style={{ textWrap: "balance" }}>
        {item.title}
      </h4>

      {/* Prompt Excerpt */}
      <p className="font-sans text-[11px] text-zinc-400 line-clamp-2 leading-relaxed" style={{ textWrap: "pretty" }}>
        {item.prompt}
      </p>

      {/* Optics Physics Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
          <Camera className="h-3 w-3 text-cyan-400" />
          {item.cameraOptics.focal}mm
        </span>
        <span className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
          <Film className="h-3 w-3 text-amber-400" />
          {item.cameraOptics.aperture}
        </span>
        <span className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
          <Layers className="h-3 w-3 text-purple-400" />
          {item.cameraOptics.lens}
        </span>
      </div>

      {/* Bottom Metrics / Schedule */}
      {(item.scheduledTime || item.views) && (
        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 font-mono text-[10px] text-zinc-400">
          {item.scheduledTime && (
            <span className="inline-flex items-center gap-1 text-blue-400 tabular-nums">
              <Clock className="h-3 w-3" />
              {item.scheduledTime}
            </span>
          )}
          {item.views !== undefined && (
            <span className="inline-flex items-center gap-1 text-emerald-400 tabular-nums">
              <CheckCircle2 className="h-3 w-3" />
              {item.views.toLocaleString()} views
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Droppable Column Component
interface DroppableColumnProps {
  def: ColumnDefinition;
  items: KanbanItem[];
  onOpenPreview?: (item: KanbanItem) => void;
  onAddCard?: (columnId: ColumnId) => void;
}

function DroppableColumn({ def, items, onOpenPreview, onAddCard }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: def.id });
  const Icon = def.icon;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-zinc-950/60 p-3 min-h-[500px] w-72 shrink-0 backdrop-blur-md transition-colors",
        def.borderColor
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 pb-1 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", def.color)} />
          <h3 className="font-sans text-xs font-semibold text-zinc-200">{def.title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] font-medium tabular-nums", def.badgeBg)}>
            {items.length}
          </span>
          <button
            type="button"
            onClick={() => onAddCard?.(def.id)}
            title="Adicionar Card"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-cyan-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sortable List */}
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2.5 min-h-[150px]">
          {items.map((item) => (
            <KanbanCard key={item.id} item={item} onOpenPreview={onOpenPreview} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// Main 5-Column Kanban Component
interface CustomProjectKanbanProps {
  onOpenPreview?: (item: KanbanItem) => void;
}

export function CustomProjectKanban({ onOpenPreview }: CustomProjectKanbanProps): JSX.Element {
  const [board, setBoard] = useState<Record<ColumnId, KanbanItem[]>>(INITIAL_BOARD);
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);
  const [modalItem, setModalItem] = useState<KanbanItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoadedRef = useRef<boolean>(false);

  // Carregar estado persistido no Redis / Cache local ao montar
  useEffect(() => {
    let isMounted = true;
    fetchVolupiaBoard()
      .then((loadedBoard) => {
        if (isMounted) {
          if (loadedBoard) {
            setBoard(loadedBoard);
          }
          isLoadedRef.current = true;
        }
      })
      .catch((e: unknown) => {
        void e;
        if (isMounted) {
          isLoadedRef.current = true;
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Persistir alterações de estado no Redis / Cache local (somente após carregamento inicial)
  useEffect(() => {
    if (!isLoadedRef.current) return;

    saveVolupiaBoard(board).catch((e: unknown) => {
      void e;
    });
  }, [board]);

  const handleOpenStudioModal = (item: KanbanItem) => {
    setModalItem(item);
    setIsModalOpen(true);
    if (onOpenPreview) onOpenPreview(item);
  };

  const handleSaveStudioOptics = (updatedItem: KanbanItem) => {
    const colId = findColumn(updatedItem.id);
    if (colId) {
      setBoard((prev) => ({
        ...prev,
        [colId]: prev[colId].map((i) => (i.id === updatedItem.id ? updatedItem : i)),
      }));
    }
  };

  const handleAddCard = (columnId: ColumnId) => {
    const newId = `post-${Date.now()}`;
    const newCard: KanbanItem = {
      id: newId,
      title: "Nova Peça de Mídia",
      prompt: "Descreva a cena cinemática ou conceito visual para a IA...",
      cameraOptics: { camera: "full_frame", lens: "anamorphic", focal: 35, aperture: "f/1.4" },
      platform: "reels",
      aspectRatio: "9:16",
    };
    setBoard((prev) => ({
      ...prev,
      [columnId]: [newCard, ...prev[columnId]],
    }));
    handleOpenStudioModal(newCard);
  };

  // Setup dnd-kit sensors with Pointer + Touch + Keyboard support
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function findColumn(id: string): ColumnId | null {
    if (id in board) return id as ColumnId;
    for (const [colId, items] of Object.entries(board)) {
      if (items.some((item) => item.id === id)) {
        return colId as ColumnId;
      }
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const colId = findColumn(String(active.id));
    if (colId) {
      const item = board[colId].find((i) => i.id === active.id);
      if (item) setActiveItem(item);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeCol = findColumn(String(active.id));
    const overCol = findColumn(String(over.id));

    if (!activeCol || !overCol || activeCol === overCol) return;

    setBoard((prev) => {
      const activeItems = prev[activeCol];
      const overItems = prev[overCol];

      const activeIndex = activeItems.findIndex((i) => i.id === active.id);
      const overIndex = overItems.findIndex((i) => i.id === over.id);

      const draggedItem = activeItems[activeIndex];

      const newOverItems = [...overItems];
      if (overIndex >= 0) {
        newOverItems.splice(overIndex, 0, draggedItem);
      } else {
        newOverItems.push(draggedItem);
      }

      return {
        ...prev,
        [activeCol]: activeItems.filter((i) => i.id !== active.id),
        [overCol]: newOverItems,
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveItem(null);
      return;
    }

    const activeCol = findColumn(String(active.id));
    const overCol = findColumn(String(over.id));

    if (activeCol && overCol && activeCol === overCol) {
      const items = board[activeCol];
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      if (oldIndex !== newIndex && newIndex >= 0) {
        setBoard((prev) => ({
          ...prev,
          [activeCol]: arrayMove(prev[activeCol], oldIndex, newIndex),
        }));
      }
    }

    setActiveItem(null);
  }

  return (
    <div className="flex w-full flex-col bg-transparent p-4 text-zinc-100 overflow-x-auto min-h-[calc(100vh-160px)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 pb-4 items-start">
          {COLUMNS.map((colDef) => (
            <DroppableColumn
              key={colDef.id}
              def={colDef}
              items={board[colDef.id]}
              onOpenPreview={handleOpenStudioModal}
              onAddCard={handleAddCard}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 150, easing: "ease-out" }}>
          {activeItem ? <KanbanCard item={activeItem} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <CustomMediaStudioModal
        item={modalItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveOptics={handleSaveStudioOptics}
        onTriggerGeneration={triggerMediaGeneration}
      />
    </div>
  );
}
