import { Hono } from "hono";
import {
  deleteFlowFromRedis,
  deleteVariableFromRedis,
  getFlowFromRedis,
  listFlowsFromRedis,
  listProjectsFromRedis,
  listVariablesFromRedis,
  saveFlowToRedis,
  saveProjectToRedis,
  saveVariableToRedis,
} from "../lib/redis.js";

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
