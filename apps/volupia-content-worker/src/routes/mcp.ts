import { Hono } from "hono";

export const mcpRouter = new Hono();

// Ferramentas soberanas pré-configuradas do ecossistema Adsentice/Volúpia
const DEFAULT_MCP_TOOLS = [
  {
    id: "adsentice-kg-tool",
    mcp_enabled: true,
    action_name: "Adsentice Knowledge Graph (KG-First)",
    action_description: "Consultar DAG e KG do Adsentice em sub-milissegundo",
    name: "Adsentice Knowledge Graph (KG-First)",
    description: "Consultar DAG e KG do Adsentice em sub-milissegundo",
  },
  {
    id: "adsentice-redis-tool",
    mcp_enabled: true,
    action_name: "Redis OODA & BOA Score Telemetry",
    action_description: "Estado em tempo real OODA/BOA no Redis :6396",
    name: "Redis OODA & BOA Score Telemetry",
    description: "Estado em tempo real OODA/BOA no Redis :6396",
  },
  {
    id: "adsentice-qdrant-tool",
    mcp_enabled: true,
    action_name: "Qdrant Vector Store Search",
    action_description: "Busca semântica no corpus vector store :6352",
    name: "Qdrant Vector Store Search",
    description: "Busca semântica no corpus vector store :6352",
  },
];

// MCP Servers list endpoint
mcpRouter.get("/mcp/servers", (c) => {
  return c.json([
    {
      id: "adsentice-v8-mcp",
      name: "adsentice-v8-mcp",
      display_name: "Adsentice V8 MCP Server",
      description: "Servidor MCP Soberano Adsentice/Volúpia",
      status: "connected",
      mode: "local",
      toolsCount: DEFAULT_MCP_TOOLS.length,
      error: null,
    },
  ]);
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
      { name: "adsentice-v8-mcp", installed: true, available: true },
    ]);
  }
  if (path.endsWith("/composer-url")) {
    return c.json({ project_id: "default", uses_composer: false });
  }
  return c.json(getProjectMcpData());
});

// MCP Mutations
mcpRouter.post("/mcp/servers/*", (c) => c.json({ status: "ok" }));
mcpRouter.patch("/mcp/servers/*", (c) => c.json({ status: "ok" }));
mcpRouter.delete("/mcp/servers/*", (c) => c.json({ status: "ok" }));
mcpRouter.patch("/mcp/project/*", (c) => c.json({ status: "ok" }));
