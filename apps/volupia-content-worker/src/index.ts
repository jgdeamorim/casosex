import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import fs from "node:fs";
import path from "node:path";
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
import { DevStore } from "./lib/devStore.js";

// Initialize local disk persistent store for standalone Node mode
DevStore.init();

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

// Serve static assets from public/
app.use("/assets/*", serveStatic({ root: "./public" }));
app.use("/icons/*", serveStatic({ root: "./public" }));
app.use("/favicon.ico", serveStatic({ root: "./public" }));
app.use("/manifest.json", serveStatic({ root: "./public" }));

// Mount router modules under /api/v1, /api/v2, and /api
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

app.route("/api", configRouter);
app.route("/api", authRouter);
app.route("/api", componentsRouter);
app.route("/api", flowsRouter);

// Helper function to serve index.html for SPA client-side routing
const serveIndexHtml = (c: Context) => {
  const indexPath = path.resolve("./public/index.html");
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, "utf-8");
    return c.html(html);
  }
  return c.text("Volúpia SPA Frontend not found", 404);
};

// Root "/" handler serves SPA index.html
app.get("/", serveIndexHtml);

// SPA fallback handler for navigation routes
app.all("*", (c) => {
  const pathName = c.req.path;

  // If request is an API request (starts with /api/), return fail-soft JSON
  if (pathName.startsWith("/api/")) {
    if (c.req.method === "GET") {
      return c.json([]);
    }
    return c.json({
      status: "ok",
      path: pathName,
      message: "volupia v8 content worker active",
    });
  }

  // If request is GET and accepts HTML or has no file extension, return index.html for SPA
  if (c.req.method === "GET") {
    const accept = c.req.header("accept") || "";
    if (accept.includes("text/html") || !pathName.includes(".")) {
      return serveIndexHtml(c);
    }
    return c.json([]);
  }

  return c.json({
    status: "ok",
    path: pathName,
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

