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
  Wand2,
  Copy,
  Save,
  Type,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KanbanItem } from "./custom-project-kanban";
import {
  CAMERA_OPTIONS,
  LENS_OPTIONS,
  FOCAL_OPTIONS,
  APERTURE_OPTIONS,
  ASPECT_RATIOS,
} from "../config/volupia-optics-config";

interface CustomMediaStudioModalProps {
  item: KanbanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveOptics?: (updatedItem: KanbanItem) => void;
  onTriggerGeneration?: (item: KanbanItem) => void;
}

export function CustomMediaStudioModal({
  item,
  isOpen,
  onClose,
  onSaveOptics,
  onTriggerGeneration,
}: CustomMediaStudioModalProps): JSX.Element | null {
  if (!isOpen || !item) return null;

  const [title, setTitle] = useState(item.title);
  const [prompt, setPrompt] = useState(item.prompt);
  const [optics, setOptics] = useState(item.cameraOptics);
  const [aspectRatio, setAspectRatio] = useState(item.aspectRatio);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const compiledPrompt = `${prompt}, Shot on ${optics.camera.replace("_", " ")}, ${optics.lens} lens, ${optics.focal}mm focal perspective, ${optics.aperture} aperture bokeh, 8k resolution, award-winning cinematography, hyper-detailed`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const updated: KanbanItem = {
      ...item,
      title,
      prompt,
      cameraOptics: optics,
      aspectRatio,
    };
    if (onSaveOptics) {
      onSaveOptics(updated);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const updated: KanbanItem = {
      ...item,
      title,
      prompt,
      cameraOptics: optics,
      aspectRatio,
    };
    if (onSaveOptics) {
      onSaveOptics(updated);
    }
    setTimeout(() => {
      setIsGenerating(false);
      if (onTriggerGeneration) {
        onTriggerGeneration(updated);
      }
    }, 1000);
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
          {/* Left Column: Media Preview Canvas & Title/Prompt Edit */}
          <div className="flex flex-col gap-4 md:col-span-7">
            {/* Title & Prompt Edit Section */}
            <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950 p-4">
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                  <Type className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Título do Card</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-sans text-xs text-zinc-100 focus:border-cyan-500 focus:outline-none"
                  placeholder="Nome da peça de conteúdo..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Prompt-Base de Conteúdo</span>
                </label>
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-sans text-xs text-zinc-100 focus:border-cyan-500 focus:outline-none resize-none"
                  placeholder="Descreva a cena visual..."
                />
              </div>
            </div>

            {/* Virtual Canvas Display */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 shadow-inner min-h-[220px]">
              <div
                className={cn(
                  "relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-cyan-500/40 bg-zinc-900/90 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300",
                  selectedAspect.class
                )}
              >
                {/* Visual Render */}
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
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 font-sans text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
              >
                {isSaved ? <Check className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4 text-emerald-400" />}
                <span>{isSaved ? "Salvo no Redis!" : "Salvar Card"}</span>
              </button>

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
                    <span>Gerar Mídia (Worker Engine)</span>
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
