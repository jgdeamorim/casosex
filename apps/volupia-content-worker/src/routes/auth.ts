import { Hono } from "hono";
import { generateJwtToken } from "../lib/jwt.js";

export const authRouter = new Hono();

// Session validation
authRouter.get("/session", (c) => {
  return c.json({
    authenticated: true,
    user: {
      id: "00000000-0000-0000-0000-000000000001",
      username: "volupia_founder",
      role: "founder",
      is_active: true,
      is_superuser: true,
    },
    store_api_key: "volupia_store_key",
  });
});

// Auto-login & login handlers returning real signed JWT token
async function handleLoginResponse(c: any) {
  const token = await generateJwtToken({
    id: "00000000-0000-0000-0000-000000000001",
    username: "volupia_founder",
    role: "founder",
    tenantId: "default",
  });

  return c.json({
    access_token: token,
    refresh_token: token,
    token_type: "bearer",
    user: {
      id: "00000000-0000-0000-0000-000000000001",
      username: "volupia_founder",
      role: "founder",
      is_active: true,
      is_superuser: true,
    },
  });
}

authRouter.get("/auto_login", handleLoginResponse);
authRouter.post("/auto_login", handleLoginResponse);
authRouter.get("/login", handleLoginResponse);
authRouter.post("/login", handleLoginResponse);

// WhoAmI endpoint
authRouter.get("/users/whoami", (c) => {
  return c.json({
    id: "00000000-0000-0000-0000-000000000001",
    username: "volupia_founder",
    role: "founder",
    is_active: true,
    is_superuser: true,
    created_at: "2026-08-30T12:00:00Z",
    updated_at: "2026-08-30T12:00:00Z",
  });
});
