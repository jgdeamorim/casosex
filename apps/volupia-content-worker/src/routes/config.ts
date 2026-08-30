import { Hono } from "hono";

export const configRouter = new Hono();

// Healthcheck endpoints
configRouter.get("/health", (c) => c.json({ status: "ok" }));
configRouter.get("/health_check", (c) => c.json({ status: "ok" }));

// Config endpoint
configRouter.get("/config", (c) => {
  return c.json({
    version: "1.0.0",
    auto_saving: true,
    health_check_max_retries: 5,
    max_file_size_upload: 100,
    frontend_timeout: 30,
  });
});

// Version endpoint
configRouter.get("/version", (c) => {
  return c.json({
    version: "1.0.0",
    package: "volupia-v8-content-engine",
  });
});
