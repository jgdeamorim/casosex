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
const app = new Hono();
// Global CORS Middleware
app.use("*", cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["*"],
    credentials: true,
}));
// Mount router modules under both /api/v1 and root for maximum client compatibility
app.route("/api/v1", configRouter);
app.route("/api/v1", authRouter);
app.route("/api/v1", componentsRouter);
app.route("/api/v1", flowsRouter);
app.route("/api/v1", mcpRouter);
app.route("/api/v1", settingsRouter);
app.route("/api/v1/a2a", a2aRouter);
app.route("/", configRouter);
app.route("/", authRouter);
app.route("/", componentsRouter);
app.route("/", flowsRouter);
app.route("/", mcpRouter);
app.route("/", settingsRouter);
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
