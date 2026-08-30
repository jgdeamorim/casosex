import { Context, Hono } from "hono";
import {
  deleteFlowFromRedis,
  deleteVariableFromRedis,
  getFlowFromRedis,
  getProjectFromRedis,
  listFlowsFromRedis,
  listProjectsFromRedis,
  listVariablesFromRedis,
  saveFlowToRedis,
  saveProjectToRedis,
  saveVariableToRedis,
} from "../lib/redis.js";
import {
  computeVertexOrder,
  executeVertexNode,
  type FlowGraph,
  type FlowNode,
} from "../lib/execution.js";

export const flowsRouter = new Hono();

const defaultProjects = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Volúpia Social Engine",
    description: "Estúdio de Conteúdo Volúpia",
    is_component: false,
    flows: [],
  },
];

// Projects & Folders CRUD
flowsRouter.get("/projects", async (c) => {
  const projects = await listProjectsFromRedis();
  return c.json(projects.length > 0 ? projects : defaultProjects);
});
flowsRouter.get("/projects/", async (c) => {
  const projects = await listProjectsFromRedis();
  return c.json(projects.length > 0 ? projects : defaultProjects);
});
flowsRouter.post("/projects", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const saved = await saveProjectToRedis(body);
  return c.json(saved, 201);
});

flowsRouter.get("/folders", async (c) => {
  const projects = await listProjectsFromRedis();
  return c.json(projects.length > 0 ? projects : defaultProjects);
});
flowsRouter.get("/folders/", async (c) => {
  const projects = await listProjectsFromRedis();
  return c.json(projects.length > 0 ? projects : defaultProjects);
});
flowsRouter.post("/folders", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const saved = await saveProjectToRedis(body);
  return c.json(saved, 201);
});

// Single Project/Folder Read (PaginatedFolderType expected by React Cockpit)
const handleGetProjectById = async (c: Context) => {
  const id = c.req.param("id") || "";
  let project = (await getProjectFromRedis(id)) as Record<string, unknown> | null;
  if (!project && id === "00000000-0000-0000-0000-000000000001") {
    project = defaultProjects[0];
  }
  if (!project) {
    project = {
      id,
      name: "Volúpia Social Engine",
      description: "Estúdio de Conteúdo Volúpia",
      parent_id: null,
      components: [],
    };
  }

  const allFlows = await listFlowsFromRedis();
  const flows = allFlows.filter((f: Record<string, unknown>) => {
    const fId = f.folder_id as string | undefined;
    return !fId || fId === id || id === "00000000-0000-0000-0000-000000000001";
  });

  return c.json({
    folder: {
      id: project.id || id,
      name: project.name || "Volúpia Social Engine",
      description: project.description || "Estúdio de Conteúdo Volúpia",
      parent_id: project.parent_id || null,
      components: project.components || [],
    },
    flows: {
      items: flows,
      total: flows.length,
      page: 1,
      size: 50,
      pages: 1,
    },
  });
};

flowsRouter.get("/projects/:id", handleGetProjectById);
flowsRouter.get("/projects/:id/", handleGetProjectById);
flowsRouter.get("/folders/:id", handleGetProjectById);
flowsRouter.get("/folders/:id/", handleGetProjectById);

// Flows CRUD
flowsRouter.get("/flows", async (c) => {
  const flows = await listFlowsFromRedis();
  return c.json(flows);
});
flowsRouter.get("/flows/", async (c) => {
  const flows = await listFlowsFromRedis();
  return c.json(flows);
});
flowsRouter.get("/flows/:id", async (c) => {
  const id = c.req.param("id");
  const flow = await getFlowFromRedis(id);
  if (!flow) {
    return c.json({ detail: "Flow not found" }, 404);
  }
  return c.json(flow);
});
flowsRouter.post("/flows", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const saved = await saveFlowToRedis(body);
  return c.json(saved, 201);
});
flowsRouter.post("/flows/", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const saved = await saveFlowToRedis(body);
  return c.json(saved, 201);
});
flowsRouter.put("/flows/:id", async (c) => {
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  body.id = id;
  const saved = await saveFlowToRedis(body);
  return c.json(saved);
});
flowsRouter.delete("/flows/:id", async (c) => {
  const id = c.req.param("id");
  await deleteFlowFromRedis(id);
  return c.json({ message: "Flow deleted successfully" });
});

// --- Phase 4: Graph Build & Execution Engine ---

// Retrieve topological vertex order for DAG build
flowsRouter.post("/build/:flow_id/vertices", async (c) => {
  const flowId = c.req.param("flow_id");
  const stopNodeId = c.req.query("stop_component_id");
  const startNodeId = c.req.query("start_component_id");

  const body = (await c.req.json().catch(() => ({}))) as FlowGraph;
  let graph: FlowGraph = body;

  if (!graph.nodes || graph.nodes.length === 0) {
    const storedFlow = (await getFlowFromRedis(flowId)) as { data?: FlowGraph } | null;
    if (storedFlow?.data?.nodes) {
      graph = storedFlow.data;
    }
  }

  const result = computeVertexOrder(graph, startNodeId, stopNodeId);
  return c.json(result);
});

// Build individual vertex node in flow
flowsRouter.post("/build/:flow_id/vertices/:vertex_id", async (c) => {
  const vertexId = c.req.param("vertex_id");
  const body = (await c.req.json().catch(() => ({}))) as {
    inputs?: Record<string, unknown>;
    node?: FlowNode;
  };

  const dummyNode: FlowNode = body.node || {
    id: vertexId,
    data: { node: { display_name: "Nó Customizado Volúpia" } },
  };

  const result = await executeVertexNode(dummyNode, body.inputs || {});
  return c.json({
    vertex_builds: {
      [vertexId]: [result],
    },
  });
});

// Build full flow graph topology
flowsRouter.post("/build/:flow_id/flow", async (c) => {
  const flowId = c.req.param("flow_id");
  const body = (await c.req.json().catch(() => ({}))) as FlowGraph;

  const orderResult = computeVertexOrder(body);
  return c.json({
    status: "success",
    flow_id: flowId,
    vertex_order: orderResult.ids,
    run_id: orderResult.run_id,
  });
});

// Run flow execution
flowsRouter.post("/run/:flow_id", async (c) => {
  const flowId = c.req.param("flow_id");
  const body = (await c.req.json().catch(() => ({}))) as {
    inputs?: Record<string, unknown>;
    graph?: FlowGraph;
  };

  let graph: FlowGraph = body.graph || { nodes: [], edges: [] };
  if (!graph.nodes || graph.nodes.length === 0) {
    const stored = (await getFlowFromRedis(flowId)) as { data?: FlowGraph } | null;
    if (stored?.data?.nodes) {
      graph = stored.data;
    }
  }

  const order = computeVertexOrder(graph);
  const outputs: Record<string, unknown> = {};

  for (const nodeId of order.vertices_to_run) {
    const node = graph.nodes.find((n) => n.id === nodeId) || { id: nodeId };
    const res = await executeVertexNode(node, body.inputs || {});
    outputs[nodeId] = res.outputs;
  }

  return c.json({
    run_id: order.run_id,
    status: "completed",
    outputs,
  });
});

// Session-based run execution
flowsRouter.post("/run/session", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const run_id = crypto.randomUUID();

  return c.json({
    run_id,
    session_id: body.session_id || crypto.randomUUID(),
    outputs: {
      result: "Fluxo executado via sessão Volúpia V8 Engine",
    },
  });
});

// Examples & Starters
flowsRouter.get("/flows/basic_examples", (c) => c.json([]));
flowsRouter.get("/flows/basic_examples/", (c) => c.json([]));
flowsRouter.get("/starter-projects", (c) => c.json([]));
flowsRouter.get("/starter-projects/", (c) => c.json([]));

// Sidebar, Models, Knowledge & Extension endpoints
flowsRouter.get("/sidebar_categories", (c) => c.json([]));
flowsRouter.get("/models", (c) => c.json([]));
flowsRouter.get("/models/providers", (c) => c.json([]));
flowsRouter.get("/knowledge_bases", (c) => c.json([]));
flowsRouter.get("/extensions", (c) => c.json([]));
flowsRouter.get("/a2a", (c) => c.json([]));
flowsRouter.get("/files", (c) => c.json([]));

// Variables CRUD
flowsRouter.get("/variables", async (c) => {
  const vars = await listVariablesFromRedis();
  return c.json(vars);
});
flowsRouter.get("/variables/", async (c) => {
  const vars = await listVariablesFromRedis();
  return c.json(vars);
});
flowsRouter.post("/variables", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const saved = await saveVariableToRedis(body);
  return c.json(saved, 201);
});
flowsRouter.delete("/variables/:id", async (c) => {
  const id = c.req.param("id");
  await deleteVariableFromRedis(id);
  return c.json({ message: "Variable deleted" });
});

// Store, Permissions & Monitoring
flowsRouter.get("/store/tags", (c) => c.json([]));
flowsRouter.get("/store/components", (c) => c.json([]));
flowsRouter.get("/authz/me/permissions", (c) => c.json({ permissions: [] }));
flowsRouter.get("/monitor/transactions", (c) => c.json([]));
flowsRouter.get("/monitor/messages", (c) => c.json([]));
flowsRouter.get("/memories", (c) => c.json([]));
flowsRouter.get("/memories/", (c) => c.json([]));
flowsRouter.get("/policy-bundle", (c) => c.json({}));
