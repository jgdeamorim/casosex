import React, { useState } from "react";
import {
  X,
  Camera,
  Film,
  Sparkles,
  RefreshCw,
  Download,
  Check,
  Sliders,
  Eye,
  Layers,
  Wand2,
  Maximize2,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KanbanItem } from "./custom-project-kanban";

interface CustomMediaStudioModalProps {
  item: KanbanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveOptics?: (updatedItem: KanbanItem) => void;
  onTriggerGeneration?: (item: KanbanItem) => void;
}

const CAMERA_OPTIONS = [
  { value: "digital_8k", label: "RED V-Raptor XL 8K (Digital)" },
  { value: "full_frame", label: "ARRI Alexa Mini LF (Full Frame)" },
  { value: "grand_format_70mm", label: "IMAX 70mm Panavision (Analógico)" },
  { value: "super_35", label: "Sony FX9 Super 35mm (Studio)" },
  { value: "classic_16mm", label: "Arriflex 16 SR3 16mm (Retro Film)" },
];

const LENS_OPTIONS = [
  { value: "anamorphic", label: "2.39:1 Anamorphic Flare" },
  { value: "tilt", label: "Selective Focus Tilt-Lens" },
  { value: "macro", label: "Extreme Macro Probe Lens" },
  { value: "vintage_prime", label: "1970s Canon K35 Prime" },
  { value: "halation", label: "Highlight Halation Bloom" },
];

const FOCAL_OPTIONS = [8, 14, 24, 35, 50, 85];

const APERTURE_OPTIONS = ["f/1.4", "f/4", "f/11"];

const ASPECT_RATIOS = [
  { value: "9:16", label: "9:16 Reels/TikTok", class: "aspect-[9/16] max-h-[420px]" },
  { value: "1:1", label: "1:1 Square Feed", class: "aspect-square max-h-[380px]" },
  { value: "16:9", label: "16:9 YouTube/TV", class: "aspect-[16/9] max-h-[320px]" },
  { value: "21:9", label: "21:9 Ultrawide", class: "aspect-[21/9] max-h-[260px]" },
];

export function CustomMediaStudioModal({
  item,
  isOpen,
  onClose,
  onSaveOptics,
  onTriggerGeneration,
}: CustomMediaStudioModalProps): JSX.Element | null {
  if (!isOpen || !item) return null;

  const [optics, setOptics] = useState(item.cameraOptics);
  const [aspectRatio, setAspectRatio] = useState(item.aspectRatio);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const compiledPrompt = `${item.prompt}, Shot on ${optics.camera.replace("_", " ")}, ${optics.lens} lens, ${optics.focal}mm focal perspective, ${optics.aperture} aperture bokeh, 8k resolution, award-winning cinematography, hyper-detailed`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (onTriggerGeneration) {
        onTriggerGeneration({
          ...item,
          cameraOptics: optics,
          aspectRatio,
        });
      }
    }, 1200);
  };

  const selectedAspect = ASPECT_RATIOS.find((a) => a.value === aspectRatio) || ASPECT_RATIOS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#050505] text-zinc-100 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
        {/* Modal Header */}
        <div className="flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/50 text-cyan-400">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-zinc-100">{item.title}</h3>
              <p className="font-mono text-[11px] text-cyan-400/80">Estúdio de Óptica & Preview Cinemático</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Grid Content */}
        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-12">
          {/* Left Column: Media Preview Canvas */}
          <div className="flex flex-col gap-4 md:col-span-7">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 shadow-inner">
              {/* Virtual Aspect Ratio Display Frame */}
              <div
                className={cn(
                  "relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-cyan-500/40 bg-zinc-900/90 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300",
                  selectedAspect.class
                )}
              >
                {/* Simulated Visual Render */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                  <Film className="h-10 w-10 text-cyan-400/40 mb-3 animate-pulse" />
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                    Preview Óptico {aspectRatio}
                  </span>
                  <span className="mt-1 font-mono text-[10px] text-cyan-400/80">
                    {optics.focal}mm • {optics.aperture} • {optics.lens}
                  </span>
                </div>

                {/* Aspect Ratio Badge */}
                <div className="absolute top-3 left-3 rounded bg-zinc-950/80 px-2 py-1 font-mono text-[10px] text-cyan-400 border border-cyan-800/40">
                  {aspectRatio}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-4 py-2.5 font-sans text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all hover:bg-cyan-500/30 hover:border-cyan-400 active:scale-[0.98] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                    <span>Sintetizando Mídia no Worker...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 text-cyan-400" />
                    <span>Regenerar com IA (Worker :7860)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-sans text-xs font-medium text-zinc-200 transition-all hover:bg-zinc-800"
              >
                <Download className="h-4 w-4 text-zinc-400" />
                <span>Baixar</span>
              </button>
            </div>
          </div>

          {/* Right Column: Camera Physics & Optics Controls */}
          <div className="flex flex-col gap-5 md:col-span-5 border-l border-zinc-800/60 pl-0 md:pl-6">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-cyan-400">
              <Sliders className="h-4 w-4" />
              <span>Controles de Física Óptica</span>
            </div>

            {/* Camera Body */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-medium text-zinc-300">Corpo de Câmera / Sensor</label>
              <select
                value={optics.camera}
                onChange={(e) => setOptics({ ...optics, camera: e.target.value })}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-sans text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
              >
                {CAMERA_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Lens Type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-medium text-zinc-300">Tipo de Lente / Caráter</label>
              <select
                value={optics.lens}
                onChange={(e) => setOptics({ ...optics, lens: e.target.value })}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-sans text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
              >
                {LENS_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Focal Length */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-medium text-zinc-300">Distância Focal (mm)</label>
              <div className="grid grid-cols-6 gap-1.5">
                {FOCAL_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setOptics({ ...optics, focal: f })}
                    className={cn(
                      "rounded border px-2 py-1.5 font-mono text-xs font-medium transition-all tabular-nums",
                      optics.focal === f
                        ? "border-cyan-500/60 bg-cyan-500/20 text-cyan-300"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                    )}
                  >
                    {f}mm
                  </button>
                ))}
              </div>
            </div>

            {/* Aperture */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-medium text-zinc-300">Abertura / Bokeh</label>
              <div className="grid grid-cols-3 gap-2">
                {APERTURE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setOptics({ ...optics, aperture: a })}
                    className={cn(
                      "rounded border px-3 py-1.5 font-mono text-xs font-medium transition-all tabular-nums",
                      optics.aperture === a
                        ? "border-amber-500/60 bg-amber-500/20 text-amber-300"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-medium text-zinc-300">Aspect Ratio de Saída</label>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.value}
                    type="button"
                    onClick={() => setAspectRatio(ar.value as KanbanItem["aspectRatio"])}
                    className={cn(
                      "rounded border px-3 py-1.5 font-mono text-xs text-left transition-all",
                      aspectRatio === ar.value
                        ? "border-cyan-500/60 bg-cyan-500/20 text-cyan-300 font-semibold"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                    )}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compiled Prompt Breakdown */}
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950 p-3.5 mt-auto">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">Prompt Compilado (Óptica)</span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-zinc-300 leading-relaxed line-clamp-3">
                {compiledPrompt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
