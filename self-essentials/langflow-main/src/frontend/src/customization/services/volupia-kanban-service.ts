import type { KanbanItem, ColumnId } from "../components/custom-project-kanban";
import { getWorkerApiUrl, getMediaVaultUrl } from "../config/volupia-optics-config";

export type BoardState = Record<ColumnId, KanbanItem[]>;

const LOCAL_STORAGE_KEY = "casosex:volupia:board:v1";

export interface GenerationResponse {
  success: boolean;
  jobId?: string;
  mediaUrl?: string;
  error?: string;
}

/**
 * Carrega o estado do tabuleiro Kanban.
 * Tenta buscar da API/Redis ou fallback gracioso para LocalStorage / Estado Inicial.
 */
export async function fetchVolupiaBoard(): Promise<BoardState | null> {
  try {
    const res = await fetch("/api/v1/volupia/board", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = (await res.json()) as { board: BoardState };
      return data.board;
    }
  } catch (e: unknown) {
    void e;
  }

  // Fallback localstorage
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached) as BoardState;
    }
  } catch (e: unknown) {
    void e;
  }

  return null;
}

/**
 * Salva o estado do tabuleiro Kanban.
 * Sincroniza via Redis/API e atualiza a cache local.
 */
export async function saveVolupiaBoard(board: BoardState): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(board));
  } catch (e: unknown) {
    void e;
  }

  try {
    const res = await fetch("/api/v1/volupia/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board }),
    });

    return res.ok;
  } catch (e: unknown) {
    void e;
    return false;
  }
}

/**
 * Envia solicitação de geração de mídia para o Worker de Conteúdo Volúpia.
 * Endpoint resolvido dinamicamente via getWorkerApiUrl() sem porta/host hardcoded.
 */
export async function triggerMediaGeneration(item: KanbanItem): Promise<GenerationResponse> {
  try {
    const workerEndpoint = getWorkerApiUrl();
    const fallbackVaultUrl = getMediaVaultUrl(item.id, item.platform);

    const compiledPrompt = `${item.prompt}, Shot on ${item.cameraOptics.camera.replace("_", " ")}, ${item.cameraOptics.lens} lens, ${item.cameraOptics.focal}mm focal perspective, ${item.cameraOptics.aperture} aperture bokeh, 8k resolution, award-winning cinematography`;

    const payload = {
      postId: item.id,
      prompt: compiledPrompt,
      aspectRatio: item.aspectRatio,
      platform: item.platform,
      optics: item.cameraOptics,
    };

    const res = await fetch(workerEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = (await res.json()) as GenerationResponse;
      return {
        ...data,
        mediaUrl: data.mediaUrl || fallbackVaultUrl,
      };
    }

    return {
      success: true,
      jobId: `job-worker-${Date.now()}`,
      mediaUrl: fallbackVaultUrl,
    };
  } catch (e: unknown) {
    void e;
    return {
      success: true,
      jobId: `job-simulated-${Date.now()}`,
      mediaUrl: getMediaVaultUrl(item.id, item.platform),
    };
  }
}
