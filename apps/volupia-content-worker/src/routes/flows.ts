import { Hono } from "hono";

export const flowsRouter = new Hono();

// Folders & Projects endpoints
const defaultProjects = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Volúpia Social Engine",
    description: "Estúdio de Conteúdo Volúpia",
    is_component: false,
    flows: [],
  },
];

flowsRouter.get("/projects", (c) => c.json(defaultProjects));
flowsRouter.get("/projects/", (c) => c.json(defaultProjects));
flowsRouter.get("/folders", (c) => c.json(defaultProjects));
flowsRouter.get("/folders/", (c) => c.json(defaultProjects));

// Flows & Examples endpoints
flowsRouter.get("/flows", (c) => c.json([]));
flowsRouter.get("/flows/", (c) => c.json([]));
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

// Variables, Store, Permissions & Misc endpoints
flowsRouter.get("/variables", (c) => c.json([]));
flowsRouter.get("/variables/", (c) => c.json([]));
flowsRouter.get("/store/tags", (c) => c.json([]));
flowsRouter.get("/store/components", (c) => c.json([]));
flowsRouter.get("/authz/me/permissions", (c) => c.json({ permissions: [] }));
flowsRouter.get("/monitor/transactions", (c) => c.json([]));
flowsRouter.get("/monitor/messages", (c) => c.json([]));
flowsRouter.get("/memories", (c) => c.json([]));
flowsRouter.get("/memories/", (c) => c.json([]));
flowsRouter.get("/policy-bundle", (c) => c.json({}));
