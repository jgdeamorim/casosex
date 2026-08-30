import React from "react";
import { LayoutGrid, Workflow, Sparkles } from "lucide-react";
import { cn } from "@/utils/utils";

export type CockpitTab = "kanban" | "flows";

interface CustomProjectHeaderProps {
  activeTab: CockpitTab;
  onTabChange: (tab: CockpitTab) => void;
  postCount?: number;
}

export function CustomProjectHeader({
  activeTab,
  onTabChange,
  postCount = 0,
}: CustomProjectHeaderProps): JSX.Element {
  return (
    <div className="flex h-11 w-full items-center justify-between border-b border-cyan-950/40 bg-[#050505]/90 px-4 backdrop-blur-md">
      {/* Left Branding & Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
          <Sparkles className="h-4 w-4 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-semibold tracking-wide text-zinc-100">
            VOLÚPIA <span className="text-cyan-400">COCKPIT</span>
          </span>
          <span className="rounded bg-cyan-950/60 px-1.5 py-0.5 font-mono text-[10px] text-cyan-400/80 border border-cyan-800/30">
            ADR-0218
          </span>
        </div>
      </div>

      {/* Center 2-Tab Pill Selector */}
      <div className="flex items-center rounded-lg border border-zinc-800/80 bg-zinc-950 p-1 shadow-inner">
        <button
          type="button"
          onClick={() => onTabChange("kanban")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1 font-sans text-xs font-medium transition-all duration-150",
            activeTab === "kanban"
              ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Kanban Social & Agenda IA</span>
          {postCount > 0 && (
            <span className="ml-1 rounded-full bg-cyan-500/20 px-1.5 py-0.2 font-mono text-[10px] tabular-nums text-cyan-300 border border-cyan-500/30">
              {postCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("flows")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1 font-sans text-xs font-medium transition-all duration-150",
            activeTab === "flows"
              ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
          )}
        >
          <Workflow className="h-3.5 w-3.5" />
          <span>Fluxos de Automação</span>
        </button>
      </div>

      {/* Right Engine Status */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
        <span className="hidden sm:inline">Worker :7860</span>
        <span className="text-zinc-600">|</span>
        <span className="hidden sm:inline">Redis :6396</span>
      </div>
    </div>
  );
}
