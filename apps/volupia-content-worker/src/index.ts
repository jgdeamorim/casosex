import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRouter } from "./routes/auth.js";
import { componentsRouter } from "./routes/components.js";
import { configRouter } from "./routes/config.js";
import { flowsRouter } from "./routes/flows.js";
import { mcpRouter } from "./routes/mcp.js";
import { a2aRouter } from "./routes/a2a.js";
import { settingsRouter } from "./routes/settings.js";
import { contentPostsRouter } from "./routes/content-posts.js";
import { brandDnaRouter } from "./routes/brand-dna.js";
import { charactersRouter } from "./routes/characters.js";
import { promptCompilerRouter } from "./routes/prompt-compiler.js";
import { assetRegistryRouter } from "./routes/asset-registry.js";
import { learningLoopRouter } from "./routes/learning-loop.js";

const app = new Hono();

// Global CORS Middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["*"],
    credentials: true,
  }),
);

// Mount router modules under /api/v1, /api/v2, and root for maximum client compatibility
app.route("/api/v1", configRouter);
app.route("/api/v1", authRouter);
app.route("/api/v1", componentsRouter);
app.route("/api/v1", flowsRouter);
app.route("/api/v1", mcpRouter);
app.route("/api/v1", settingsRouter);
app.route("/api/v1", contentPostsRouter);
app.route("/api/v1/brand-dna", brandDnaRouter);
app.route("/api/v1/characters", charactersRouter);
app.route("/api/v1/prompt-compiler", promptCompilerRouter);
app.route("/api/v1/assets", assetRegistryRouter);
app.route("/api/v1/learning-loop", learningLoopRouter);
app.route("/api/v1/a2a", a2aRouter);

app.route("/api/v2", configRouter);
app.route("/api/v2", authRouter);
app.route("/api/v2", componentsRouter);
app.route("/api/v2", flowsRouter);
app.route("/api/v2", mcpRouter);
app.route("/api/v2", settingsRouter);
app.route("/api/v2", contentPostsRouter);
app.route("/api/v2/brand-dna", brandDnaRouter);
app.route("/api/v2/characters", charactersRouter);
app.route("/api/v2/prompt-compiler", promptCompilerRouter);
app.route("/api/v2/assets", assetRegistryRouter);
app.route("/api/v2/learning-loop", learningLoopRouter);
app.route("/api/v2/a2a", a2aRouter);

app.route("/", configRouter);
app.route("/", authRouter);
app.route("/", componentsRouter);
app.route("/", flowsRouter);
app.route("/", mcpRouter);
app.route("/", settingsRouter);
app.route("/", contentPostsRouter);
app.route("/brand-dna", brandDnaRouter);
app.route("/characters", charactersRouter);
app.route("/prompt-compiler", promptCompilerRouter);
app.route("/assets", assetRegistryRouter);
app.route("/learning-loop", learningLoopRouter);
app.route("/a2a", a2aRouter);

// Fail-soft fallback route: return [] for GET requests to ensure .map() on list queries never crashes React
app.all("*", (c) => {
  if (c.req.method === "GET") {
    return c.json([]);
  }
  return c.json({
    status: "ok",
    path: c.req.path,
    message: "volupia v8 content worker active",
  });
});

// Start Node server if run directly (development / standalone mode on port 7860)
const port = 7860;
console.log(`⚡ Volúpia V8 Content Worker starting on http://0.0.0.0:${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

// Export default app for V8 Isolates / Cloudflare Workers runtime
export default app;
