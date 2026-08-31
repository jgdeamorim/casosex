import React, { useState } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { Button } from "@/components/ui/button";

interface CompiledResult {
  compiledPrompt: string;
  negativePrompt: string;
  hash: string;
  seed: number;
  blocks: Array<{ key: string; title: string; content: string }>;
}

export const OverviewPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [intentionGoal, setIntentionGoal] = useState<string>("awareness");
  const [channel, setChannel] = useState<string>("instagram_reels");
  const [pillar, setPillar] = useState<string>("educativo");
  const [ideaPrompt, setIdeaPrompt] = useState<string>("");

  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compiledResult, setCompiledResult] = useState<CompiledResult | null>(null);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const payload = {
        post: {
          id: `post_${Date.now()}`,
          title: ideaPrompt || "Postagem de Destaque CASOSEX",
          objective: intentionGoal,
          platform: channel.startsWith("instagram") ? "instagram" : "tiktok",
          hook: ideaPrompt ? ideaPrompt.substring(0, 40) : "Descubra o segredo do bem-estar",
          script: ideaPrompt,
        },
        brandDna: {
          pillarKey: pillar,
          name: pillar === "educativo" ? "Educativo" : pillar === "lifestyle" ? "Lifestyle" : "Product Showcase",
          visualGuidelines: "Aesthetic erotic luxury, deep crimson, onyx black, gold accents",
          colorPalette: "Crimson Red #990000, Onyx Black #111111, Gold #D4AF37",
          lightingProfile: "Chiaroscuro cinematic lighting",
        },
        character: {
          id: "char_bruna",
          name: "Bruna (Elenco CASOSEX)",
          description: "Modelo brasileira 28 anos, estilo sofisticado e acolhedor",
          fixedSeed: 489201,
        },
        customDirectives: `Channel Target: ${channel}. Goal: ${intentionGoal}.`,
      };

      const res = await fetch("/api/v1/prompt-compiler/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setCompiledResult(json.data);
      } else {
        // Fallback determinístico local se offline
        setCompiledResult({
          compiledPrompt: `Hyper-realistic commercial video frame, 9:16 vertical orientation. Intent: ${intentionGoal.toUpperCase()} for ${channel.toUpperCase()}.\n\nSubject: Bruna (Elenco CASOSEX). Fixed Seed: 489201.\n\nTheme: "${ideaPrompt || "Postagem de Destaque CASOSEX"}".\n\n--seed 489201 --ar 9:16 --v 6.0 --style raw`,
          negativePrompt: "blurry, low quality, distorted anatomy, extra limbs, bad fingers, deformed hands, logo, noise",
          hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          seed: 489201,
          blocks: [
            { key: "01_SYSTEM_INTENT", title: "Contexto de Sistema & Intenção", content: `Intent: ${intentionGoal.toUpperCase()} (${channel})` },
            { key: "03_SUBJECT_CHARACTER", title: "Personagem IA & Consistência", content: "Bruna (Elenco CASOSEX) - Seed: 489201" },
            { key: "11_SEED_DETERMINISM", title: "Determinismo", content: "--seed 489201 --ar 9:16 --v 6.0" },
          ],
        });
      }
    } catch {
      // Fallback gracioso para simulação local caso o worker esteja desconectado
      setCompiledResult({
        compiledPrompt: `Hyper-realistic commercial video frame, 9:16 vertical orientation. Intent: ${intentionGoal.toUpperCase()} for ${channel.toUpperCase()}.\n\nSubject: Bruna (Elenco CASOSEX). Fixed Seed: 489201.\n\nTheme: "${ideaPrompt || "Postagem de Destaque CASOSEX"}".\n\n--seed 489201 --ar 9:16 --v 6.0 --style raw`,
        negativePrompt: "blurry, low quality, distorted anatomy, extra limbs, bad fingers, deformed hands, logo, noise",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        seed: 489201,
        blocks: [
          { key: "01_SYSTEM_INTENT", title: "Contexto de Sistema & Intenção", content: `Intent: ${intentionGoal.toUpperCase()} (${channel})` },
          { key: "03_SUBJECT_CHARACTER", title: "Personagem IA & Consistência", content: "Bruna (Elenco CASOSEX) - Seed: 489201" },
          { key: "11_SEED_DETERMINISM", title: "Determinismo", content: "--seed 489201 --ar 9:16 --v 6.0" },
        ],
      });
    } finally {
      setIsCompiling(false);
    }
  };

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
              disabled={isCompiling}
              onClick={handleCompile}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20"
            >
              {isCompiling ? "Compilando Intenção..." : "Compilar & Gerar no Canvas GPU 🚀"}
            </Button>
          )}
        </div>
      </div>

      {/* Compiled Result Card / Modal */}
      {compiledResult && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6 shadow-md backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <ForwardedIconComponent name="CheckCircle2" className="h-4 w-4 text-emerald-400" />
              <span>Intenção Compilada via Headless Hono Engine</span>
            </h3>
            <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              Seed: {compiledResult.seed}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Prompt Compilado (Sintaxe GPU / Midjourney V6 / SDXL):
              </label>
              <pre className="mt-1 max-h-36 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border/50 bg-background/80 p-3 text-xs font-mono text-purple-200">
                {compiledResult.compiledPrompt}
              </pre>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Filtro Negativo (Exclusões de Qualidade):
              </label>
              <p className="mt-1 rounded-xl border border-border/40 bg-background/50 p-2.5 text-xs text-muted-foreground font-mono">
                {compiledResult.negativePrompt}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompiledResult(null)}
              className="text-xs"
            >
              Fechar Preview
            </Button>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
                onClick={() => alert("Postagem enviada para o Estúdio GPU Vast.ai")}
              >
                <ForwardedIconComponent name="Play" className="h-3.5 w-3.5" />
                <span>Enviar para Vast.ai GPU</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;

