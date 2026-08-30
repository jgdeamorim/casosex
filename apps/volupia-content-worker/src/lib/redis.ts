import { Redis } from "ioredis";

const REDIS_PORT = 6396;
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  lazyConnect: true,
  retryStrategy: (times) => Math.min(times * 100, 2000),
});

redis.on("error", (err: unknown) => {
  console.warn("⚠️ Volúpia Redis Connection Notice:", err);
});

// Keys namespace
const KEYS = {
  FLOW: (id: string) => `volupia:flow:${id}`,
  FLOW_LIST: "volupia:flows:list",
  PROJECT: (id: string) => `volupia:project:${id}`,
  PROJECT_LIST: "volupia:projects:list",
  VARIABLE: (id: string) => `volupia:variable:${id}`,
  VARIABLE_LIST: "volupia:variables:list",
};

// Flow CRUD
export async function getFlowFromRedis(id: string) {
  try {
    const data = await redis.get(KEYS.FLOW(id));
    return data ? JSON.parse(data) : null;
  } catch (e: unknown) {
    void e;
    return null;
  }
}

export async function saveFlowToRedis(flow: Record<string, unknown>) {
  try {
    const id = (flow.id as string) || crypto.randomUUID();
    flow.id = id;
    flow.folder_id = flow.folder_id || "00000000-0000-0000-0000-000000000001";
    flow.updated_at = new Date().toISOString();
    flow.is_component = flow.is_component ?? false;
    flow.data = flow.data || { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };
    await redis.set(KEYS.FLOW(id), JSON.stringify(flow));
    await redis.sadd(KEYS.FLOW_LIST, id);
    return flow;
  } catch (e: unknown) {
    void e;
    return flow;
  }
}

export async function deleteFlowFromRedis(id: string) {
  try {
    await redis.del(KEYS.FLOW(id));
    await redis.srem(KEYS.FLOW_LIST, id);
    return true;
  } catch (e: unknown) {
    void e;
    return false;
  }
}

export async function listFlowsFromRedis() {
  try {
    const ids = await redis.smembers(KEYS.FLOW_LIST);
    if (!ids || ids.length === 0) return [];
    const keys = ids.map((id) => KEYS.FLOW(id));
    const items = await redis.mget(...keys);
    return items.filter((item): item is string => Boolean(item)).map((item) => JSON.parse(item));
  } catch (e: unknown) {
    void e;
    return [];
  }
}

// Project & Folder CRUD
export async function getProjectFromRedis(id: string) {
  try {
    const data = await redis.get(KEYS.PROJECT(id));
    return data ? JSON.parse(data) : null;
  } catch (e: unknown) {
    void e;
    return null;
  }
}

export async function listProjectsFromRedis() {
  try {
    const ids = await redis.smembers(KEYS.PROJECT_LIST);
    if (!ids || ids.length === 0) return [];
    const keys = ids.map((id) => KEYS.PROJECT(id));
    const items = await redis.mget(...keys);
    return items.filter((item): item is string => Boolean(item)).map((item) => JSON.parse(item));
  } catch (e: unknown) {
    void e;
    return [];
  }
}

export async function saveProjectToRedis(project: Record<string, unknown>) {
  try {
    const id = (project.id as string) || crypto.randomUUID();
    project.id = id;
    project.updated_at = new Date().toISOString();
    await redis.set(KEYS.PROJECT(id), JSON.stringify(project));
    await redis.sadd(KEYS.PROJECT_LIST, id);
    return project;
  } catch (e: unknown) {
    void e;
    return project;
  }
}

// Variable CRUD
export async function listVariablesFromRedis() {
  try {
    const ids = await redis.smembers(KEYS.VARIABLE_LIST);
    if (!ids || ids.length === 0) return [];
    const keys = ids.map((id) => KEYS.VARIABLE(id));
    const items = await redis.mget(...keys);
    return items.filter((item): item is string => Boolean(item)).map((item) => JSON.parse(item));
  } catch (e: unknown) {
    void e;
    return [];
  }
}

export async function saveVariableToRedis(variable: Record<string, unknown>) {
  try {
    const id = (variable.id as string) || (variable.name as string) || crypto.randomUUID();
    variable.id = id;
    await redis.set(KEYS.VARIABLE(id), JSON.stringify(variable));
    await redis.sadd(KEYS.VARIABLE_LIST, id);
    return variable;
  } catch (e: unknown) {
    void e;
    return variable;
  }
}

export async function deleteVariableFromRedis(id: string) {
  try {
    await redis.del(KEYS.VARIABLE(id));
    await redis.srem(KEYS.VARIABLE_LIST, id);
    return true;
  } catch (e: unknown) {
    void e;
    return false;
  }
}
