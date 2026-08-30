import { Hono } from "hono";
export const authRouter = new Hono();
// Session validation
authRouter.get("/session", (c) => {
    return c.json({
        authenticated: true,
        user: {
            id: "00000000-0000-0000-0000-000000000001",
            username: "volupia_creator",
            is_active: true,
            is_superuser: true,
        },
        store_api_key: "volupia_store_key",
    });
});
// Auto-login & login handlers
const loginResponse = {
    access_token: "volupia_v8_token_12345",
    refresh_token: "volupia_v8_refresh_12345",
    token_type: "bearer",
    user: {
        id: "00000000-0000-0000-0000-000000000001",
        username: "volupia_creator",
        is_active: true,
        is_superuser: true,
    },
};
authRouter.get("/auto_login", (c) => c.json(loginResponse));
authRouter.post("/auto_login", (c) => c.json(loginResponse));
authRouter.get("/login", (c) => c.json(loginResponse));
authRouter.post("/login", (c) => c.json(loginResponse));
// WhoAmI endpoint
authRouter.get("/users/whoami", (c) => {
    return c.json({
        id: "00000000-0000-0000-0000-000000000001",
        username: "volupia_creator",
        is_active: true,
        is_superuser: true,
        create_at: "2026-08-30T12:00:00Z",
        updated_at: "2026-08-30T12:00:00Z",
    });
});
