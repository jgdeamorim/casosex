import { Hono } from "hono";
import { redis } from "../lib/redis.js";

export const settingsRouter = new Hono();

const USER_ID = "00000000-0000-0000-0000-000000000001";
const API_KEYS_LIST_KEY = "volupia:apikeys:list";
const VARIABLES_LIST_KEY = "volupia:variables:list";

interface ApiKeyItem {
  id: string;
  name: string;
  api_key: string;
  user_id: string;
  created_at: string;
  last_used_at: string | null;
  total_uses: number;
  is_active: boolean;
  expires_at: string | null;
}

// Ensure default API Key exists in Redis
async function getOrInitApiKeys(): Promise<ApiKeyItem[]> {
  try {
    const listRaw = await redis.get(API_KEYS_LIST_KEY);
    if (listRaw) {
      return JSON.parse(listRaw);
    }
    const defaultKey: ApiKeyItem = {
      id: "apikey-volupia-default-001",
      name: "Volúpia Primary Engine Key",
      api_key: "volupia_v8_live_key_sovereign_7860",
      user_id: USER_ID,
      created_at: new Date().toISOString(),
      last_used_at: new Date().toISOString(),
      total_uses: 42,
      is_active: true,
      expires_at: null,
    };
    const keys = [defaultKey];
    await redis.set(API_KEYS_LIST_KEY, JSON.stringify(keys));
    return keys;
  } catch (e: unknown) {
    void e;
    return [];
  }
}

// API Keys Endpoints
const handleGetApiKeys = async (c: any) => {
  const keys = await getOrInitApiKeys();
  return c.json({
    total_count: keys.length,
    user_id: USER_ID,
    api_keys: keys,
  });
};

settingsRouter.get("/api_key", handleGetApiKeys);
settingsRouter.get("/api_key/", handleGetApiKeys);

settingsRouter.post("/api_key", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const keys = await getOrInitApiKeys();
    const newId = crypto.randomUUID();
    const newKey: ApiKeyItem = {
      id: newId,
      name: body.name || "Volúpia API Key",
      api_key: `volupia_v8_${newId.substring(0, 16)}`,
      user_id: USER_ID,
      created_at: new Date().toISOString(),
      last_used_at: null,
      total_uses: 0,
      is_active: true,
      expires_at: body.expires_at || null,
    };
    keys.push(newKey);
    await redis.set(API_KEYS_LIST_KEY, JSON.stringify(keys));
    return c.json(newKey, 201);
  } catch (e: unknown) {
    void e;
    return c.json({ error: "Failed to create API key" }, 500);
  }
});
settingsRouter.post("/api_key/", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const keys = await getOrInitApiKeys();
    const newId = crypto.randomUUID();
    const newKey: ApiKeyItem = {
      id: newId,
      name: body.name || "Volúpia API Key",
      api_key: `volupia_v8_${newId.substring(0, 16)}`,
      user_id: USER_ID,
      created_at: new Date().toISOString(),
      last_used_at: null,
      total_uses: 0,
      is_active: true,
      expires_at: body.expires_at || null,
    };
    keys.push(newKey);
    await redis.set(API_KEYS_LIST_KEY, JSON.stringify(keys));
    return c.json(newKey, 201);
  } catch (e: unknown) {
    void e;
    return c.json({ error: "Failed to create API key" }, 500);
  }
});

settingsRouter.delete("/api_key/:id", async (c) => {
  try {
    const keyId = c.req.param("id");
    let keys = await getOrInitApiKeys();
    keys = keys.filter((k) => k.id !== keyId);
    await redis.set(API_KEYS_LIST_KEY, JSON.stringify(keys));
    return c.json({ status: "success", deleted: keyId });
  } catch (e: unknown) {
    void e;
    return c.json({ error: "Failed to delete API key" }, 500);
  }
});

// Global Variables Endpoints
const handleGetVariables = async (c: any) => {
  try {
    const varsRaw = await redis.get(VARIABLES_LIST_KEY);
    return c.json(varsRaw ? JSON.parse(varsRaw) : []);
  } catch (e: unknown) {
    void e;
    return c.json([]);
  }
};

settingsRouter.get("/variables", handleGetVariables);
settingsRouter.get("/variables/", handleGetVariables);

// Messages Endpoints
settingsRouter.get("/messages", (c) => c.json([]));
settingsRouter.get("/messages/", (c) => c.json([]));

// Folders Endpoints
settingsRouter.get("/folders", (c) => c.json([]));
settingsRouter.get("/folders/", (c) => c.json([]));

// Files Endpoints
settingsRouter.get("/files", (c) => c.json([]));
settingsRouter.get("/files/", (c) => c.json([]));

// Knowledge Bases Endpoints
settingsRouter.get("/knowledge_bases", (c) => c.json([]));
settingsRouter.get("/knowledge_bases/", (c) => c.json([]));

// Models Endpoints
settingsRouter.get("/models", (c) => c.json([]));
settingsRouter.get("/models/", (c) => c.json([]));

// Store Endpoints
settingsRouter.get("/store/check", (c) => c.json({ enabled: true, is_authenticated: true }));
settingsRouter.get("/store/check/", (c) => c.json({ enabled: true, is_authenticated: true }));
