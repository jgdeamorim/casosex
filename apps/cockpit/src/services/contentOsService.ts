import type {
  ContentPost,
  ContentPostStatus,
  ContentPlatform,
  BrandDnaPillar,
  CharacterEntity,
  AssetGeneration,
  ContentEvent,
  ContentMetrics,
} from "../types/content-os.js";
import { compilePrompt, type CompiledPromptResult } from "../lib/promptCompiler.js";

const WORKER_BASE_URL = "http://localhost:7860/api/v1";

/**
 * Frontend Client Service for V8 Content OS API (ADR-0219)
 */
export class ContentOsService {
  private static getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("volupia_token") || "volupia_founder_token";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Fetch list of posts from the server with optional status and platform filters
   */
  public static async fetchPosts(filters?: {
    status?: ContentPostStatus;
    platform?: ContentPlatform;
  }): Promise<ContentPost[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.platform) params.append("platform", filters.platform);

      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${WORKER_BASE_URL}/content/posts${query}`, {
        headers: this.getAuthHeader(),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const body = (await res.json()) as { success: boolean; data: ContentPost[] };
      return body.data || [];
    } catch (e: unknown) {
      void e;
      console.warn("⚠️ Failed to fetch posts from worker API, returning empty array fallback.");
      return [];
    }
  }

  /**
   * Fetch single post by ID
   */
  public static async getPostById(id: string): Promise<ContentPost | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/content/posts/${id}`, {
        headers: this.getAuthHeader(),
      });

      if (!res.ok) {
        return null;
      }

      const body = (await res.json()) as { success: boolean; data: ContentPost };
      return body.data || null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }

  /**
   * Create a new ContentPost
   */
  public static async createPost(payload: Partial<ContentPost>): Promise<ContentPost | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/content/posts`, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const body = (await res.json()) as { success: boolean; data: ContentPost };
      return body.data;
    } catch (e: unknown) {
      void e;
      console.error("⚠️ Error creating ContentPost via API:", e);
      return null;
    }
  }

  /**
   * Update an existing ContentPost
   */
  public static async updatePost(
    id: string,
    payload: Partial<ContentPost>
  ): Promise<ContentPost | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/content/posts/${id}`, {
        method: "PATCH",
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const body = (await res.json()) as { success: boolean; data: ContentPost };
      return body.data;
    } catch (e: unknown) {
      void e;
      console.error(`⚠️ Error updating post ${id}:`, e);
      return null;
    }
  }

  /**
   * Approve a ContentPost (Founder/Ops role required)
   */
  public static async approvePost(id: string): Promise<ContentPost | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/content/posts/${id}/approve`, {
        method: "POST",
        headers: this.getAuthHeader(),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const body = (await res.json()) as { success: boolean; data: ContentPost };
      return body.data;
    } catch (e: unknown) {
      void e;
      console.error(`⚠️ Error approving post ${id}:`, e);
      return null;
    }
  }

  /**
   * Delete / Archive a ContentPost
   */
  public static async deletePost(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/content/posts/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      });

      return res.ok;
    } catch (e: unknown) {
      void e;
      return false;
    }
  }

  // --- BRAND DNA METHODS ---

  public static async fetchBrandDnaPillars(): Promise<BrandDnaPillar[]> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/brand-dna`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) return [];
      const body = (await res.json()) as { success: boolean; data: BrandDnaPillar[] };
      return body.data || [];
    } catch (e: unknown) {
      void e;
      return [];
    }
  }

  public static async createOrUpdateBrandDnaPillar(
    payload: Partial<BrandDnaPillar>
  ): Promise<BrandDnaPillar | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/brand-dna`, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { success: boolean; data: BrandDnaPillar };
      return body.data || null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }

  // --- CHARACTER LIBRARY METHODS ---

  public static async fetchCharacters(): Promise<CharacterEntity[]> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/characters`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) return [];
      const body = (await res.json()) as { success: boolean; data: CharacterEntity[] };
      return body.data || [];
    } catch (e: unknown) {
      void e;
      return [];
    }
  }

  public static async createOrUpdateCharacter(
    payload: Partial<CharacterEntity>
  ): Promise<CharacterEntity | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/characters`, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { success: boolean; data: CharacterEntity };
      return body.data || null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }

  // --- PROMPT COMPILER METHODS (ADR-0219 M3) ---

  public static async compilePromptRemote(
    post: ContentPost,
    brandDna?: BrandDnaPillar | null,
    character?: CharacterEntity | null,
    customDirectives?: string
  ): Promise<CompiledPromptResult> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/prompt-compiler/compile`, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify({ post, brandDna, character, customDirectives }),
      });
      if (res.ok) {
        const body = (await res.json()) as { success: boolean; data: CompiledPromptResult };
        if (body.data) return body.data;
      }
    } catch (e: unknown) {
      void e;
    }
    // Local fallback pure compiler execution
    return compilePrompt({ post, brandDna, character, customDirectives });
  }

  // --- ASSET REGISTRY METHODS (ADR-0219 M4) ---

  public static async fetchAssetsForPost(postId: string): Promise<AssetGeneration[]> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/assets/post/${postId}`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) return [];
      const body = (await res.json()) as { success: boolean; data: AssetGeneration[] };
      return body.data || [];
    } catch (e: unknown) {
      void e;
      return [];
    }
  }

  public static async createAssetGeneration(
    payload: Partial<AssetGeneration>
  ): Promise<AssetGeneration | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/assets/generate`, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { success: boolean; data: AssetGeneration };
      return body.data || null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }

  public static async selectPublishedAsset(assetId: string): Promise<boolean> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/assets/select/${assetId}`, {
        method: "POST",
        headers: this.getAuthHeader(),
      });
      return res.ok;
    } catch (e: unknown) {
      void e;
      return false;
    }
  }

  public static async deleteAsset(assetId: string): Promise<boolean> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/assets/${assetId}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      });
      return res.ok;
    } catch (e: unknown) {
      void e;
      return false;
    }
  }

  // --- Milestone 5: Learning Loop & Telemetry Methods ---

  public static async fetchPostEvents(postId: string): Promise<ContentEvent[]> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/learning-loop/events/${postId}`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) return [];
      const json = (await res.json()) as { success: boolean; data: ContentEvent[] };
      return json.success && Array.isArray(json.data) ? json.data : [];
    } catch (e: unknown) {
      void e;
      return [];
    }
  }

  public static async recordPostEvent(
    postId: string,
    eventType: ContentEvent["eventType"],
    payload: Record<string, unknown> = {}
  ): Promise<ContentEvent | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/learning-loop/events`, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify({ postId, eventType, actorId: "cockpit_user", payload }),
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { success: boolean; data: ContentEvent };
      return json.success ? json.data : null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }

  public static async fetchPostMetrics(postId: string): Promise<ContentMetrics | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/learning-loop/metrics/${postId}`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { success: boolean; data: ContentMetrics };
      return json.success ? json.data : null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }

  public static async updatePostMetrics(
    metrics: Partial<ContentMetrics> & { postId: string }
  ): Promise<ContentMetrics | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/learning-loop/metrics`, {
        method: "POST",
        headers: this.getAuthHeader(),
        body: JSON.stringify(metrics),
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { success: boolean; data: ContentMetrics };
      return json.success ? json.data : null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }

  public static async fetchLearningLoopRecommendations(): Promise<{
    oodaStage: string;
    confidenceScore: number;
    topPerformingPillars: Array<{ pillar: string; avgConversionRate: string; recommendedHookType: string }>;
    recommendations: string[];
  } | null> {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/learning-loop/recommendations`, {
        headers: this.getAuthHeader(),
      });
      if (!res.ok) return null;
      const json = (await res.json()) as {
        success: boolean;
        data: {
          oodaStage: string;
          confidenceScore: number;
          topPerformingPillars: Array<{ pillar: string; avgConversionRate: string; recommendedHookType: string }>;
          recommendations: string[];
        };
      };
      return json.success ? json.data : null;
    } catch (e: unknown) {
      void e;
      return null;
    }
  }
}

