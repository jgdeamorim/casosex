import type {
  ContentPost,
  ContentPostStatus,
  ContentPlatform,
  BrandDnaPillar,
  CharacterEntity,
} from "../types/content-os.js";

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
}

