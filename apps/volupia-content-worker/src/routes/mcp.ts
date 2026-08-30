import { Hono } from "hono";

export const mcpRouter = new Hono();

// MCP Servers list endpoint - expected to return Array<MCPServerInfoType>
mcpRouter.get("/mcp/servers", (c) => {
  return c.json([
    {
      name: "adsentice-v8-mcp",
      display_name: "Adsentice V8 MCP Server",
      description: "Servidor MCP Soberano Adsentice/Volúpia",
      status: "connected",
      mode: "local",
      toolsCount: 5,
      error: null,
    },
  ]);
});

// MCP Project settings endpoint
mcpRouter.get("/mcp/project", (c) => {
  return c.json({
    enabled: true,
    servers: ["adsentice-v8-mcp"],
  });
});

// Other MCP mutation endpoints
mcpRouter.post("/mcp/servers/*", (c) => c.json({ status: "ok" }));
mcpRouter.patch("/mcp/servers/*", (c) => c.json({ status: "ok" }));
mcpRouter.delete("/mcp/servers/*", (c) => c.json({ status: "ok" }));
