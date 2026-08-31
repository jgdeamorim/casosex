import React from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

export const InsightsPage: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Insights & Quality Control (M4)</span>
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            Performance & QA
          </span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Auditoria de qualidade multimodal Gemini Vision e inteligência de retenção de público.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Score Médio de Qualidade</span>
            <ForwardedIconComponent name="ShieldCheck" className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">94 / 100</div>
          <p className="text-xs text-emerald-400 font-medium">Aprovado pelo Gemini QA Gate</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Taxa de Retenção de Vídeo (Reels/TikTok)</span>
            <ForwardedIconComponent name="TrendingUp" className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">68.2%</div>
          <p className="text-xs text-purple-400 font-medium">+12.4% acima da média da categoria</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Custo Médio por Mídia HD</span>
            <ForwardedIconComponent name="Zap" className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">$0.008</div>
          <p className="text-xs text-amber-400 font-medium">Vast.ai GPU Allocation</p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
