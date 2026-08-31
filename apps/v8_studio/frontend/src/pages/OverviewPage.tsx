import React, { useState } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";

export const OverviewPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [intentionGoal, setIntentionGoal] = useState<string>("awareness");
  const [channel, setChannel] = useState<string>("instagram_reels");
  const [pillar, setPillar] = useState<string>("educativo");
  const [ideaPrompt, setIdeaPrompt] = useState<string>("");

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background/50 p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Executive Overview</span>
          <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
            Dashboard Calmo M0
          </span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Visão diária de produção, inteligência de marca e intenção criativa de conteúdo.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Postagens Agendadas</span>
            <ForwardedIconComponent name="Calendar" className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">18</span>
            <span className="text-[11px] text-emerald-400 font-medium">Próximos 30 dias</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Renderizações GPU</span>
            <ForwardedIconComponent name="Zap" className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">42</span>
            <span className="text-[11px] text-muted-foreground">Vast.ai Status: Online</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Gemini Vision QA</span>
            <ForwardedIconComponent name="ShieldCheck" className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">98.4%</span>
            <span className="text-[11px] text-emerald-400 font-medium">Score Aprovação</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Elenco Digital</span>
            <ForwardedIconComponent name="Users" className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">4 Sementes</span>
            <span className="text-[11px] text-indigo-400 font-medium">CASOSEX Brand DNA</span>
          </div>
        </div>
      </div>

      {/* Stepper de Intenção (Módulo M1) */}
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm space-y-5 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ForwardedIconComponent name="Sparkles" className="h-4 w-4 text-purple-400" />
              <span>Stepper de Intenção Criativa (M1)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Defina a intenção do post antes da síntese pelo Prompt Compiler determinístico.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <span className={`px-2 py-0.5 rounded-md ${currentStep >= 1 ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-secondary"}`}>1. Objetivo</span>
            <span>➔</span>
            <span className={`px-2 py-0.5 rounded-md ${currentStep >= 2 ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-secondary"}`}>2. Canal</span>
            <span>➔</span>
            <span className={`px-2 py-0.5 rounded-md ${currentStep >= 3 ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-secondary"}`}>3. Pilar</span>
            <span>➔</span>
            <span className={`px-2 py-0.5 rounded-md ${currentStep >= 4 ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-secondary"}`}>4. Ideia</span>
          </div>
        </div>

        {/* Step 1: Objetivo */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Passo 1: Qual o objetivo principal da postagem?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "awareness", label: "Alcance & Brand Awareness", desc: "Maximizar visualizações e topo de funil" },
                { id: "engagement", label: "Engajamento & Comunidade", desc: "Estimular comentários e compartilhamentos" },
                { id: "conversion", label: "Conversão & Vendas", desc: "Direcionar para loja ou oferta exclusiva" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIntentionGoal(item.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    intentionGoal === item.id
                      ? "border-purple-500 bg-purple-500/10 text-foreground shadow-sm"
                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span className="font-semibold text-sm text-foreground">{item.label}</span>
                  <span className="text-xs mt-1 text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Canal */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Passo 2: Qual o canal de distribuição alvo?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "instagram_reels", label: "Instagram Reels (9:16)", desc: "Vídeo curto vertical com áudio em alta" },
                { id: "tiktok", label: "TikTok Video (9:16)", desc: "Formatos dinâmicos e linguagem de retenção" },
                { id: "instagram_feed", label: "Feed Carrossel (4:5 / 1:1)", desc: "Carrossel educativo em imagens HD" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChannel(item.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    channel === item.id
                      ? "border-purple-500 bg-purple-500/10 text-foreground shadow-sm"
                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span className="font-semibold text-sm text-foreground">{item.label}</span>
                  <span className="text-xs mt-1 text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Pilar */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Passo 3: Selecione o Pilar de Conteúdo do Brand DNA:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "educativo", label: "Educativo & Dicas de Bem-Estar", desc: "Conteúdo útil sobre intimidade e produtos" },
                { id: "lifestyle", label: "Lifestyle & Autoestima", desc: "Estética refinada e auto-cuidado CASOSEX" },
                { id: "showcase", label: "Product Showcase HD", desc: "Foco nos detalhes visuais e diferenciais do produto" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPillar(item.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    pillar === item.id
                      ? "border-purple-500 bg-purple-500/10 text-foreground shadow-sm"
                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span className="font-semibold text-sm text-foreground">{item.label}</span>
                  <span className="text-xs mt-1 text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Ideia */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Passo 4: Ideia ou Tema do Post (Linguagem Natural):
            </label>
            <textarea
              rows={3}
              value={ideaPrompt}
              onChange={(e) => setIdeaPrompt(e.target.value)}
              placeholder="Ex: Vídeo mostrando 3 passos para escolher o primeiro item de autocuidado com tom elegante e bem-humorado..."
              className="w-full rounded-xl border border-border/60 bg-background/60 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>
        )}

        {/* Stepper Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          >
            Voltar
          </Button>

          {currentStep < 4 ? (
            <Button
              size="sm"
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              Próximo Passo ➔
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => alert(`Intenção Enviada para Compilação: Goal=${intentionGoal}, Channel=${channel}, Pillar=${pillar}`)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20"
            >
              Compilar & Gerar no Canvas GPU 🚀
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
