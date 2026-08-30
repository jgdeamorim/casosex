/**
 * V8 Content OS Domain Contracts (ADR-0219)
 */

export type ContentPostStatus =
  | 'draft'
  | 'generated'
  | 'review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export type ContentObjective = 'awareness' | 'authority' | 'conversion';

export type ContentPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook';

export interface ContentPost {
  id: string; // Ex: 'POST-20260830-0001'
  title: string;
  objective: ContentObjective;
  dnaPillarId: string;
  platform: ContentPlatform;
  format: string; // Ex: 'reels_9_16', 'carousel_4_5', 'youtube_16_9'
  scheduledAt: string | null;
  hook: string;
  script: string;
  cta: string;
  brandDnaVersion: number;
  characterId: string | null;
  promptTemplateId: string | null;
  compiledPrompt: string | null;
  promptHash: string | null;
  status: ContentPostStatus;
  createdBy: string;
  approvedBy: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'founder' | 'ops' | 'commercial';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export interface ContentEvent {
  id: string;
  postId: string;
  eventType:
    | 'created'
    | 'edited'
    | 'prompt_compiled'
    | 'asset_generated'
    | 'approved'
    | 'scheduled'
    | 'published'
    | 'archived'
    | 'metric_received';
  actorId: string;
  payload?: Record<string, unknown>;
  timestamp: string;
}

export interface AssetGeneration {
  id: string;
  postId: string;
  generationNumber: number;
  model: string;
  modelVersion?: string;
  seed?: number;
  promptHash?: string;
  compiledPrompt?: string;
  assetUrl: string;
  mimeType: string;
  width: number;
  height: number;
  status: 'draft' | 'selected' | 'published' | 'discarded';
  createdBy: string;
  createdAt: string;
}

export interface ContentMetrics {
  id: string;
  postId: string;
  impressions: number;
  engagementRate: number;
  directClicks: number;
  conversionsCount: number;
  updatedAt: string;
}
