/**
 * Volúpia Content Engine - Single Source of Truth for Optics, Configs & Endpoints
 * ADR-0218 & SOP v3.4 Compliant
 */

export interface CameraOption {
  value: string;
  label: string;
}

export interface LensOption {
  value: string;
  label: string;
}

export interface AspectRatioOption {
  value: "9:16" | "1:1" | "16:9" | "21:9";
  label: string;
  class: string;
}

export const CAMERA_OPTIONS: CameraOption[] = [
  { value: "digital_8k", label: "RED V-Raptor XL 8K (Digital)" },
  { value: "full_frame", label: "ARRI Alexa Mini LF (Full Frame)" },
  { value: "grand_format_70mm", label: "IMAX 70mm Panavision (Analógico)" },
  { value: "super_35", label: "Sony FX9 Super 35mm (Studio)" },
  { value: "classic_16mm", label: "Arriflex 16 SR3 16mm (Retro Film)" },
];

export const LENS_OPTIONS: LensOption[] = [
  { value: "anamorphic", label: "2.39:1 Anamorphic Flare" },
  { value: "tilt", label: "Selective Focus Tilt-Lens" },
  { value: "macro", label: "Extreme Macro Probe Lens" },
  { value: "vintage_prime", label: "1970s Canon K35 Prime" },
  { value: "halation", label: "Highlight Halation Bloom" },
];

export const FOCAL_OPTIONS: number[] = [8, 14, 24, 35, 50, 85];

export const APERTURE_OPTIONS: string[] = ["f/1.4", "f/4", "f/11"];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { value: "9:16", label: "9:16 Reels/TikTok", class: "aspect-[9/16] max-h-[420px]" },
  { value: "1:1", label: "1:1 Square Feed", class: "aspect-square max-h-[380px]" },
  { value: "16:9", label: "16:9 YouTube/TV", class: "aspect-[16/9] max-h-[320px]" },
  { value: "21:9", label: "21:9 Ultrawide", class: "aspect-[21/9] max-h-[260px]" },
];

/**
 * Resolução dinâmica do Endpoint do Worker Volúpia (:7860).
 * Garante compatibilidade zero-friction entre Dev Local e Prod V8 Cockpit.
 */
export function getWorkerApiUrl(): string {
  if (typeof window !== "undefined") {
    const envUrl = (window as unknown as { NEXT_PUBLIC_VOLUPIA_WORKER_URL?: string }).NEXT_PUBLIC_VOLUPIA_WORKER_URL;
    if (envUrl) return envUrl;

    const hostname = window.location.hostname || "localhost";
    const protocol = window.location.protocol || "http:";

    // Se estiver em produção V8 Cockpit (domínio real ou worker), usa proxy relativo
    if (!hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
      return `${protocol}//${window.location.host}/api/v1/volupia/worker/generate`;
    }

    // Dev Local
    return `${protocol}//${hostname}:7860/api/v1/generate`;
  }

  return "http://localhost:7860/api/v1/generate";
}

/**
 * Resolução dinâmica da URL do Vault de Mídia.
 */
export function getMediaVaultUrl(postId: string, platform?: string): string {
  const extension = platform === "reels" || platform === "youtube" ? "mp4" : "webp";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "localhost";
    const protocol = window.location.protocol || "http:";

    if (!hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
      return `${protocol}//${window.location.host}/vault/${postId}.${extension}`;
    }

    return `${protocol}//${hostname}:7860/vault/${postId}.${extension}`;
  }

  return `http://localhost:7860/vault/${postId}.${extension}`;
}
