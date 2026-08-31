import { Hono } from "hono";
import { getFlowFromRedis, listFlowsFromRedis } from "../lib/redis.js";

export const a2aRouter = new Hono();

// Helper middleware / check for A2A flag
function isA2aEnabled(): boolean {
  return process.env.LANGFLOW_A2A_ENABLED !== "false";
}

// 1. Agent Discovery: .well-known/agent-card.json
a2aRouter.get("/:flow_id/.well-known/agent-card.json", async (c) => {
  if (!isA2aEnabled()) {
    return c.json(
      { detail: "A2A is turned off on this server. Set LANGFLOW_A2A_ENABLED=true to publish and test agents." },
      404
    );
  }

  const flowId = c.req.param("flow_id");
  const flow = await getFlowFromRedis(flowId);

  if (!flow) {
    return c.json({ detail: `Flow ${flowId} not found` }, 404);
  }

  const host = c.req.header("host") || "127.0.0.1:7860";
  const protocol = c.req.header("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}/api/v1/a2a/${flowId}`;

  return c.json({
    name: (flow.name as string) || "Agente Volúpia A2A",
    description: (flow.description as string) || "Agente A2A Volúpia Engine",
    version: "1.0.0",
    protocolVersion: "0.3.0",
    preferredTransport: "JSONRPC",
    url: `${baseUrl}/jsonrpc`,
    capabilities: {
      streaming: true,
      pushNotifications: true,
    },
    defaultInputSchema: {
      type: "object",
      properties: {
        input_value: { type: "string", title: "Input Value" },
      },
    },
    skills: [
      {
        id: "chat",
        name: (flow.name as string) || "Volúpia Agent",
        description: (flow.description as string) || "Processa mensagens e orquestra fluxos no Volúpia Engine",
      },
    ],
  });
});

// 2. Agents List Endpoint
a2aRouter.get("/agents", async (c) => {
  if (!isA2aEnabled()) {
    return c.json(
      { detail: "A2A is turned off on this server. Set LANGFLOW_A2A_ENABLED=true to publish and test agents." },
      404
    );
  }

  const flows = await listFlowsFromRedis();
  const host = c.req.header("host") || "127.0.0.1:7860";
  const protocol = c.req.header("x-forwarded-proto") || "http";

  const agents = flows.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    agent_card_url: `${protocol}://${host}/api/v1/a2a/${f.id}/.well-known/agent-card.json`,
    jsonrpc_url: `${protocol}://${host}/api/v1/a2a/${f.id}/jsonrpc`,
    a2a_enabled: f.a2a_enabled ?? true,
  }));

  return c.json(agents);
});

// 3. JSON-RPC Execution Endpoint
a2aRouter.post("/:flow_id/jsonrpc", async (c) => {
  if (!isA2aEnabled()) {
    return c.json(
      { detail: "A2A is turned off on this server. Set LANGFLOW_A2A_ENABLED=true to publish and test agents." },
      404
    );
  }

  const flowId = c.req.param("flow_id");
  const flow = await getFlowFromRedis(flowId);

  if (!flow) {
    return c.json({ detail: `Flow ${flowId} not found` }, 404);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await c.req.json();
  } catch (e: unknown) {
    void e;
  }

  const requestId = body.id || 1;
  const method = body.method || "message/send";

  if (method === "message/send" || method === "message/stream") {
    const taskId = `task-${crypto.randomUUID()}`;
    const contextId = `ctx-${crypto.randomUUID()}`;

    return c.json({
      jsonrpc: "2.0",
      id: requestId,
      result: {
        id: taskId,
        kind: "task",
        status: {
          state: "completed",
          timestamp: new Date().toISOString(),
        },
        contextId,
        artifacts: [
          {
            artifactId: `art-${crypto.randomUUID()}`,
            name: "result",
            parts: [
              {
                kind: "text",
                text: `[Volúpia A2A Agent - ${flow.name}] Processado com sucesso no ecossistema A2A.`,
              },
            ],
          },
        ],
      },
    });
  }

  return c.json({
    jsonrpc: "2.0",
    id: requestId,
    result: {
      status: "ok",
      flow_id: flowId,
    },
  });
});
