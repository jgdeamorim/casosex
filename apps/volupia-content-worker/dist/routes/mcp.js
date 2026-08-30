import { Hono } from "hono";
import { redis } from "../lib/redis.js";
export const mcpRouter = new Hono();
const MCP_SERVERS_KEY = "volupia:mcp:servers:list";
// Pre-configured Sovereign MCP Servers for Volúpia Content Engine (CASOSEX / usevolupia.com.br)
const DEFAULT_MCP_SERVERS = [
    {
        id: "volupia-v8-mcp",
        name: "volupia-v8-mcp",
        display_name: "Volúpia V8 MCP Server",
        description: "Servidor MCP Soberano Volúpia Content Engine (Orquestração & Geração Multi-modal)",
        status: "connected",
        mode: "local",
        toolsCount: 3,
        error: null,
    },
    {
        id: "volupia-kg-mcp",
        name: "volupia-kg",
        display_name: "Volúpia Knowledge Graph",
        description: "Consultar DAG e Knowledge Graph do Volúpia Content Engine em sub-milissegundo",
        status: "connected",
        mode: "local",
        toolsCount: 5,
        error: null,
    },
    {
        id: "volupia-redis-mcp",
        name: "volupia-redis",
        display_name: "Volúpia Redis Telemetry",
        description: "Telemetria e Estado Vivo OODA / Volúpia Score (:6396)",
        status: "connected",
        mode: "local",
        toolsCount: 4,
        error: null,
    },
    {
        id: "volupia-qdrant-mcp",
        name: "volupia-qdrant",
        display_name: "Volúpia Vector Store",
        description: "Busca semântica no corpus Volúpia / CASOSEX vector store (:6352)",
        status: "connected",
        mode: "local",
        toolsCount: 2,
        error: null,
    },
    {
        id: "context7-mcp",
        name: "context7",
        display_name: "Context7 Docs Provider",
        description: "Servidor MCP de documentação técnica em tempo real",
        status: "connected",
        mode: "remote",
        toolsCount: 2,
        error: null,
    },
];
const DEFAULT_MCP_TOOLS = [
    {
        id: "volupia-kg-tool",
        mcp_enabled: true,
        action_name: "Volúpia Knowledge Graph (KG-First)",
        action_description: "Consultar DAG e KG do Volúpia Content Engine em sub-milissegundo",
        name: "Volúpia Knowledge Graph (KG-First)",
        description: "Consultar DAG e KG do Volúpia Content Engine em sub-milissegundo",
    },
    {
        id: "volupia-redis-tool",
        mcp_enabled: true,
        action_name: "Volúpia Redis Telemetry",
        action_description: "Estado em tempo real OODA/Volúpia no Redis :6396",
        name: "Volúpia Redis Telemetry",
        description: "Estado em tempo real OODA/Volúpia no Redis :6396",
    },
    {
        id: "volupia-qdrant-tool",
        mcp_enabled: true,
        action_name: "Volúpia Vector Store Search",
        action_description: "Busca semântica no corpus Volúpia vector store :6352",
        name: "Volúpia Vector Store Search",
        description: "Busca semântica no corpus Volúpia vector store :6352",
    },
];
async function getOrInitMcpServers() {
    try {
        const raw = await redis.get(MCP_SERVERS_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
        await redis.set(MCP_SERVERS_KEY, JSON.stringify(DEFAULT_MCP_SERVERS));
        return DEFAULT_MCP_SERVERS;
    }
    catch (e) {
        void e;
        return DEFAULT_MCP_SERVERS;
    }
}
// List MCP Servers
const handleGetServers = async (c) => {
    const servers = await getOrInitMcpServers();
    return c.json(servers);
};
mcpRouter.get("/mcp/servers", handleGetServers);
mcpRouter.get("/mcp/servers/", handleGetServers);
// Get single server details
mcpRouter.get("/mcp/servers/:name", async (c) => {
    const name = c.req.param("name");
    const servers = await getOrInitMcpServers();
    const server = servers.find((s) => s.name === name) || {
        id: name,
        name,
        description: `Servidor MCP ${name}`,
        status: "connected",
        mode: "local",
        toolsCount: 3,
        error: null,
    };
    return c.json(server);
});
// Add / Update MCP Server
mcpRouter.post("/mcp/servers", async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        const servers = await getOrInitMcpServers();
        const name = body.name || `mcp-server-${Date.now()}`;
        const newServer = {
            id: crypto.randomUUID(),
            name,
            display_name: body.display_name || name,
            description: body.description || "Servidor MCP Customizado",
            status: "connected",
            mode: body.mode || "local",
            toolsCount: body.toolsCount ?? 1,
            error: null,
            command: body.command,
            args: body.args,
            env: body.env,
        };
        const existingIndex = servers.findIndex((s) => s.name === name);
        if (existingIndex >= 0) {
            servers[existingIndex] = { ...servers[existingIndex], ...newServer };
        }
        else {
            servers.push(newServer);
        }
        await redis.set(MCP_SERVERS_KEY, JSON.stringify(servers));
        return c.json(newServer, 201);
    }
    catch (e) {
        void e;
        return c.json({ error: "Failed to add MCP server" }, 500);
    }
});
// Delete MCP Server
mcpRouter.delete("/mcp/servers/:name", async (c) => {
    try {
        const name = c.req.param("name");
        let servers = await getOrInitMcpServers();
        servers = servers.filter((s) => s.name !== name);
        await redis.set(MCP_SERVERS_KEY, JSON.stringify(servers));
        return c.json({ status: "success", deleted: name });
    }
    catch (e) {
        void e;
        return c.json({ error: "Failed to delete MCP server" }, 500);
    }
});
// MCP Project data response generator
const getProjectMcpData = () => ({
    tools: DEFAULT_MCP_TOOLS,
    auth_settings: { auth_type: "none" },
});
mcpRouter.get("/mcp/project", (c) => c.json(getProjectMcpData()));
mcpRouter.get("/mcp/project/*", (c) => {
    const path = c.req.path;
    if (path.endsWith("/installed")) {
        return c.json([
            { name: "volupia-v8-mcp", installed: true, available: true },
            { name: "volupia-kg", installed: true, available: true },
            { name: "volupia-redis", installed: true, available: true },
            { name: "volupia-qdrant", installed: true, available: true },
            { name: "context7", installed: true, available: true },
        ]);
    }
    if (path.endsWith("/composer-url")) {
        return c.json({ project_id: "default", uses_composer: false });
    }
    return c.json(getProjectMcpData());
});
mcpRouter.patch("/mcp/project/*", (c) => c.json({ status: "ok" }));
