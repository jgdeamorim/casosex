import { Redis } from "ioredis";
const REDIS_PORT = 6396;
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
export const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    lazyConnect: true,
    retryStrategy: (times) => Math.min(times * 100, 2000),
});
redis.on("error", (err) => {
    console.warn("⚠️ Volúpia Redis Connection Notice:", err);
});
// Keys namespace
const KEYS = {
    FLOW: (id) => `volupia:flow:${id}`,
    FLOW_LIST: "volupia:flows:list",
    PROJECT: (id) => `volupia:project:${id}`,
    PROJECT_LIST: "volupia:projects:list",
    VARIABLE: (id) => `volupia:variable:${id}`,
    VARIABLE_LIST: "volupia:variables:list",
    MEMORY: (id) => `volupia:memory:${id}`,
    MEMORY_LIST: "volupia:memories:list",
};
// Flow Normalizer to guarantee complete FlowType schema compatibility
export function normalizeFlow(flow) {
    const id = flow.id || crypto.randomUUID();
    const folder_id = flow.folder_id || "00000000-0000-0000-0000-000000000001";
    const data = (flow.data && typeof flow.data === "object")
        ? flow.data
        : { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };
    return {
        ...flow,
        id,
        name: flow.name || "Novo Fluxo Volúpia",
        description: flow.description || "",
        data,
        is_component: flow.is_component ?? false,
        folder_id,
        user_id: flow.user_id || "00000000-0000-0000-0000-000000000001",
        icon: flow.icon || null,
        icon_bg_color: flow.icon_bg_color || null,
        gradient: flow.gradient || null,
        tags: flow.tags || [],
        updated_at: flow.updated_at || new Date().toISOString(),
        webhook: flow.webhook ?? false,
        endpoint_name: flow.endpoint_name || null,
        locked: flow.locked ?? false,
        mcp_enabled: flow.mcp_enabled ?? false,
        access_type: flow.access_type || "PRIVATE",
        flow_type: flow.flow_type || "workflow",
    };
}
// Flow CRUD
export async function getFlowFromRedis(id) {
    try {
        const data = await redis.get(KEYS.FLOW(id));
        if (!data)
            return null;
        const parsed = JSON.parse(data);
        return normalizeFlow(parsed);
    }
    catch (e) {
        void e;
        return null;
    }
}
export async function saveFlowToRedis(flow) {
    try {
        const normalized = normalizeFlow(flow);
        const id = normalized.id;
        await redis.set(KEYS.FLOW(id), JSON.stringify(normalized));
        await redis.sadd(KEYS.FLOW_LIST, id);
        return normalized;
    }
    catch (e) {
        void e;
        return normalizeFlow(flow);
    }
}
export async function deleteFlowFromRedis(id) {
    try {
        await redis.del(KEYS.FLOW(id));
        await redis.srem(KEYS.FLOW_LIST, id);
        return true;
    }
    catch (e) {
        void e;
        return false;
    }
}
export async function listFlowsFromRedis() {
    try {
        const ids = await redis.smembers(KEYS.FLOW_LIST);
        if (!ids || ids.length === 0)
            return [];
        const keys = ids.map((id) => KEYS.FLOW(id));
        const items = await redis.mget(...keys);
        return items
            .filter((item) => Boolean(item))
            .map((item) => normalizeFlow(JSON.parse(item)));
    }
    catch (e) {
        void e;
        return [];
    }
}
// Project & Folder CRUD
export async function getProjectFromRedis(id) {
    try {
        const data = await redis.get(KEYS.PROJECT(id));
        return data ? JSON.parse(data) : null;
    }
    catch (e) {
        void e;
        return null;
    }
}
export async function listProjectsFromRedis() {
    try {
        const ids = await redis.smembers(KEYS.PROJECT_LIST);
        if (!ids || ids.length === 0)
            return [];
        const keys = ids.map((id) => KEYS.PROJECT(id));
        const items = await redis.mget(...keys);
        return items.filter((item) => Boolean(item)).map((item) => JSON.parse(item));
    }
    catch (e) {
        void e;
        return [];
    }
}
export async function saveProjectToRedis(project) {
    try {
        const id = project.id || crypto.randomUUID();
        project.id = id;
        project.updated_at = new Date().toISOString();
        await redis.set(KEYS.PROJECT(id), JSON.stringify(project));
        await redis.sadd(KEYS.PROJECT_LIST, id);
        return project;
    }
    catch (e) {
        void e;
        return project;
    }
}
// Variable CRUD
export async function listVariablesFromRedis() {
    try {
        const ids = await redis.smembers(KEYS.VARIABLE_LIST);
        if (!ids || ids.length === 0)
            return [];
        const keys = ids.map((id) => KEYS.VARIABLE(id));
        const items = await redis.mget(...keys);
        return items.filter((item) => Boolean(item)).map((item) => JSON.parse(item));
    }
    catch (e) {
        void e;
        return [];
    }
}
export async function saveVariableToRedis(variable) {
    try {
        const id = variable.id || variable.name || crypto.randomUUID();
        variable.id = id;
        await redis.set(KEYS.VARIABLE(id), JSON.stringify(variable));
        await redis.sadd(KEYS.VARIABLE_LIST, id);
        return variable;
    }
    catch (e) {
        void e;
        return variable;
    }
}
export async function deleteVariableFromRedis(id) {
    try {
        await redis.del(KEYS.VARIABLE(id));
        await redis.srem(KEYS.VARIABLE_LIST, id);
        return true;
    }
    catch (e) {
        void e;
        return false;
    }
}
// Memory CRUD
export function normalizeMemory(memory) {
    const id = memory.id || crypto.randomUUID();
    const name = memory.name || "Nova Memória Volúpia";
    const kb_name = memory.kb_name || `kb_${name.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`;
    return {
        id,
        name,
        flow_id: memory.flow_id || "",
        user_id: memory.user_id || "00000000-0000-0000-0000-000000000001",
        threshold: typeof memory.threshold === "number" ? memory.threshold : 1,
        auto_capture: memory.auto_capture ?? true,
        embedding_model: memory.embedding_model || "text-embedding-3-small",
        preprocessing: memory.preprocessing ?? false,
        preproc_model: memory.preproc_model || undefined,
        preproc_instructions: memory.preproc_instructions || undefined,
        kb_name,
        created_at: memory.created_at || new Date().toISOString(),
        backend_type: memory.backend_type || "chroma",
        backend_config: memory.backend_config || { mode: "local" },
    };
}
export async function listMemoriesFromRedis(flowId) {
    try {
        const ids = await redis.smembers(KEYS.MEMORY_LIST);
        if (!ids || ids.length === 0)
            return [];
        const keys = ids.map((id) => KEYS.MEMORY(id));
        const items = await redis.mget(...keys);
        const memories = items
            .filter((item) => Boolean(item))
            .map((item) => normalizeMemory(JSON.parse(item)));
        if (flowId) {
            return memories.filter((m) => m.flow_id === flowId);
        }
        return memories;
    }
    catch (e) {
        void e;
        return [];
    }
}
export async function getMemoryFromRedis(id) {
    try {
        const data = await redis.get(KEYS.MEMORY(id));
        if (!data)
            return null;
        return normalizeMemory(JSON.parse(data));
    }
    catch (e) {
        void e;
        return null;
    }
}
export async function saveMemoryToRedis(memory) {
    try {
        const normalized = normalizeMemory(memory);
        const id = normalized.id;
        await redis.set(KEYS.MEMORY(id), JSON.stringify(normalized));
        await redis.sadd(KEYS.MEMORY_LIST, id);
        return normalized;
    }
    catch (e) {
        void e;
        return normalizeMemory(memory);
    }
}
export async function deleteMemoryFromRedis(id) {
    try {
        await redis.del(KEYS.MEMORY(id));
        await redis.srem(KEYS.MEMORY_LIST, id);
        return true;
    }
    catch (e) {
        void e;
        return false;
    }
}
