import React, { useState } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";

export interface ScheduledPost {
  id: string;
  title: string;
  channel: string;
  date: string;
  status: "draft" | "approved" | "scheduled" | "published";
  thumbnail?: string;
  pillar: string;
}

const MOCK_POSTS: ScheduledPost[] = [
  { id: "1", title: "3 Guia Prático de Auto-Cuidado", channel: "Instagram Reels", date: "2026-09-01", status: "scheduled", pillar: "Educativo" },
  { id: "2", title: "Destaque do Produto Estrela HD", channel: "TikTok", date: "2026-09-03", status: "approved", pillar: "Product Showcase" },
  { id: "3", title: "Carrossel: Mitos & Verdades", channel: "Instagram Feed", date: "2026-09-05", status: "draft", pillar: "Educativo" },
  { id: "4", title: "Bastidores do Elenco Digital", channel: "Instagram Reels", date: "2026-09-08", status: "scheduled", pillar: "Lifestyle" },
];

export const ContentCalendarPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "kanban">("kanban");
  const [timeRange, setTimeRange] = useState<"30d" | "60d" | "90d">("30d");

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background/50 p-6 space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Agenda IA & Publicação (M5)</span>
            <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Content OS
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Planejamento contínuo e publicação automatizada em janelas de 30/60/90 dias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center rounded-lg border border-border/50 bg-card p-1 text-xs">
            {(["30d", "60d", "90d"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center rounded-lg border border-border/50 bg-card p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "kanban"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ForwardedIconComponent name="Kanban" className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "calendar"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ForwardedIconComponent name="CalendarDays" className="h-3.5 w-3.5" />
              <span>Calendário</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        {[
          { key: "draft", label: "Rascunho / IDEIA", color: "border-gray-500/30 bg-gray-500/5 text-gray-400" },
          { key: "approved", label: "Aprovado pelo Gemini QA", color: "border-blue-500/30 bg-blue-500/5 text-blue-400" },
          { key: "scheduled", label: "Programado (30/60/90d)", color: "border-purple-500/30 bg-purple-500/5 text-purple-400" },
          { key: "published", label: "Publicado no Instagram/TikTok", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" },
        ].map((col) => {
          const colPosts = MOCK_POSTS.filter((p) => p.status === col.key);
          return (
            <div
              key={col.key}
              className="flex flex-col rounded-xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs text-muted-foreground font-mono font-medium">
                  {colPosts.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border border-border/60 bg-background/80 p-3 shadow-xs space-y-2 hover:border-purple-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        {post.pillar}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {post.date}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-foreground line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/30 pt-2">
                      <span>{post.channel}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ForwardedIconComponent name="CheckCircle2" className="h-3 w-3" />
                        QA Ready
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentCalendarPage;
