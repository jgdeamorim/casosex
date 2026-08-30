-- Migration: 0001_content_os_tables.sql
-- Description: Sovereign Cloudflare D1 Relational Schema for V8 Content OS (ADR-0219)

CREATE TABLE IF NOT EXISTS content_posts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  objective TEXT NOT NULL CHECK (objective IN ('awareness', 'authority', 'conversion')),
  dna_pillar_id TEXT NOT NULL DEFAULT 'erotic_luxury',
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'facebook')),
  format TEXT NOT NULL DEFAULT 'reels_9_16',
  scheduled_at TEXT,
  hook TEXT NOT NULL DEFAULT '',
  script TEXT NOT NULL DEFAULT '',
  cta TEXT NOT NULL DEFAULT '',
  brand_dna_version INTEGER NOT NULL DEFAULT 1,
  character_id TEXT,
  prompt_template_id TEXT,
  compiled_prompt TEXT,
  prompt_hash TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'generated', 'review', 'approved', 'scheduled', 'published', 'archived')) DEFAULT 'draft',
  created_by TEXT NOT NULL DEFAULT 'system',
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brand_dna (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pillar_key TEXT NOT NULL UNIQUE,
  visual_guidelines TEXT,
  verbal_tone TEXT,
  color_palette TEXT,
  lighting_profile TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  face_reference_urls TEXT,
  fixed_seed INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prompt_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  format TEXT NOT NULL,
  objective TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  negative_rules TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asset_generations (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES content_posts(id) ON DELETE CASCADE,
  generation_number INTEGER NOT NULL,
  model TEXT NOT NULL,
  model_version TEXT,
  seed INTEGER,
  prompt_hash TEXT,
  compiled_prompt TEXT,
  asset_url TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/webp',
  width INTEGER DEFAULT 1080,
  height INTEGER DEFAULT 1920,
  status TEXT NOT NULL CHECK (status IN ('draft', 'selected', 'published', 'discarded')) DEFAULT 'draft',
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_events (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES content_posts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'edited', 'prompt_compiled', 'asset_generated', 'approved', 'scheduled', 'published', 'archived', 'metric_received')),
  actor_id TEXT NOT NULL,
  payload TEXT,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_metrics (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES content_posts(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0.0,
  direct_clicks INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid lookup
CREATE INDEX IF NOT EXISTS idx_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON content_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_asset_generations_post_id ON asset_generations(post_id);
CREATE INDEX IF NOT EXISTS idx_content_events_post_id ON content_events(post_id);
