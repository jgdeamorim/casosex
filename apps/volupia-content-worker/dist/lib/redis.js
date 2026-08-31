import { Redis } from "ioredis";
import { deleteFlowFromD1, deleteMemoryFromD1, deleteVariableFromD1, logTelemetryToD1, syncFlowToD1, syncMemoryToD1, syncProjectToD1, syncVariableToD1, } from "./d1.js";
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
        void syncFlowToD1(normalized).catch(() => { });
        return normalized;
    }
    catch (e) {
        void e;
        const normalized = normalizeFlow(flow);
        void syncFlowToD1(normalized).catch(() => { });
        return normalized;
    }
}
export async function deleteFlowFromRedis(id) {
    try {
        await redis.del(KEYS.FLOW(id));
        await redis.srem(KEYS.FLOW_LIST, id);
        void deleteFlowFromD1(id).catch(() => { });
        return true;
    }
    catch (e) {
        void e;
        void deleteFlowFromD1(id).catch(() => { });
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
        void syncProjectToD1(project).catch(() => { });
        return project;
    }
    catch (e) {
        void e;
        void syncProjectToD1(project).catch(() => { });
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
        void syncVariableToD1(variable).catch(() => { });
        return variable;
    }
    catch (e) {
        void e;
        void syncVariableToD1(variable).catch(() => { });
        return variable;
    }
}
export async function deleteVariableFromRedis(id) {
    try {
        await redis.del(KEYS.VARIABLE(id));
        await redis.srem(KEYS.VARIABLE_LIST, id);
        void deleteVariableFromD1(id).catch(() => { });
        return true;
    }
    catch (e) {
        void e;
        void deleteVariableFromD1(id).catch(() => { });
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
        void syncMemoryToD1(normalized).catch(() => { });
        return normalized;
    }
    catch (e) {
        void e;
        const normalized = normalizeMemory(memory);
        void syncMemoryToD1(normalized).catch(() => { });
        return normalized;
    }
}
export async function deleteMemoryFromRedis(id) {
    try {
        await redis.del(KEYS.MEMORY(id));
        await redis.srem(KEYS.MEMORY_LIST, id);
        void deleteMemoryFromD1(id).catch(() => { });
        return true;
    }
    catch (e) {
        void e;
        void deleteMemoryFromD1(id).catch(() => { });
        return false;
    }
}
export async function recordSovereignTelemetry(event) {
    try {
        const timestamp = new Date().toISOString();
        const eventType = event.event_type || "UNKNOWN";
        const flowId = event.flow_id || "global";
        const compName = event.component_name || "core";
        const durationMs = event.duration_ms || 0;
        const isSuccess = event.success !== false;
        // 1. Record in Redis Stream & Key Metrics
        const metricKey = `casosex:volupia:metrics:flow:${flowId}`;
        const nodeMetricKey = `casosex:volupia:metrics:node:${compName}`;
        const oodaObserveKey = `casosex:volupia:ooda:stage:observe`;
        const boaScoreKey = `casosex:volupia:boa:score`;
        await redis.hincrby(metricKey, "total_calls", 1);
        if (!isSuccess) {
            await redis.hincrby(metricKey, "failed_calls", 1);
            await redis.set(`casosex:volupia:telemetry:last_error`, JSON.stringify({ event, timestamp }));
        }
        else {
            await redis.hincrby(metricKey, "successful_calls", 1);
        }
        await redis.hset(nodeMetricKey, "last_duration_ms", durationMs.toString());
        await redis.hset(nodeMetricKey, "last_seen", timestamp);
        // 2. Recalculate BOA Affective Score
        const currentScoreRaw = await redis.get(boaScoreKey);
        let currentScore = currentScoreRaw ? parseFloat(currentScoreRaw) : 95.0;
        if (isSuccess && durationMs < 500) {
            currentScore = Math.min(100.0, currentScore + 0.5);
        }
        else if (!isSuccess) {
            currentScore = Math.max(0.0, currentScore - 5.0);
        }
        else if (durationMs > 3000) {
            currentScore = Math.max(0.0, currentScore - 2.0);
        }
        await redis.set(boaScoreKey, currentScore.toFixed(2));
        // 3. Update OODA Stage Observe
        await redis.set(oodaObserveKey, `Active Telemetry: Event ${eventType} for flow ${flowId} (${durationMs}ms) | BOA: ${currentScore.toFixed(2)}`);
        // 4. Asynchronous Dual-Sync to Cloudflare D1
        void logTelemetryToD1(event).catch(() => { });
        return {
            success: true,
            boa_score: currentScore,
            recorded_at: timestamp,
        };
    }
    catch (e) {
        void e;
        void logTelemetryToD1(event).catch(() => { });
        return { success: false, boa_score: 95.0, recorded_at: new Date().toISOString() };
    }
}
export async function getSovereignTelemetryStatus() {
    try {
        const boaScore = (await redis.get(`casosex:volupia:boa:score`)) || "95.00";
        const oodaStage = (await redis.get(`casosex:volupia:ooda:stage:observe`)) || "Observação ativa";
        const lastError = await redis.get(`casosex:volupia:telemetry:last_error`);
        return {
            status: "active",
            sovereign_mode: "air_gapped",
            boa_score: parseFloat(boaScore),
            ooda_observe: oodaStage,
            last_error: lastError ? JSON.parse(lastError) : null,
        };
    }
    catch (e) {
        void e;
        return {
            status: "active",
            sovereign_mode: "air_gapped",
            boa_score: 95.0,
            ooda_observe: "Standby",
            last_error: null,
        };
    }
}
