import type { Context, Next } from "hono";
import type { AuthenticatedUser, UserRole } from "../types/content-os.js";
import { verifyJwtToken } from "../lib/jwt.js";

// Extend Hono Context Variables
declare module "hono" {
  interface ContextVariableMap {
    user: AuthenticatedUser;
  }
}

/**
 * Server-Side Cryptographic Authentication Middleware (P2 Hardened)
 * Validates JWT signatures via Web Crypto API and attaches authenticated session context to Hono.
 */
export async function authMiddleware(c: Context, next: Next): Promise<Response | void> {
  try {
    const authHeader = c.req.header("Authorization");
    const isProduction = process.env.NODE_ENV === "production";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();

      // 1. Try cryptographic JWT signature verification
      const payload = await verifyJwtToken(token);
      if (payload) {
        c.set("user", {
          id: payload.id,
          username: payload.username,
          role: payload.role,
          isActive: true,
        });
        return await next();
      }

      // 2. Dev mode fallback for legacy dev tokens
      if (!isProduction) {
        let role: UserRole = "founder";
        let username = "volupia_founder";
        let id = "00000000-0000-0000-0000-000000000001";

        if (token.includes("ops")) {
          role = "ops";
          username = "volupia_ops";
          id = "00000000-0000-0000-0000-000000000002";
        } else if (token.includes("commercial")) {
          role = "commercial";
          username = "volupia_commercial";
          id = "00000000-0000-0000-0000-000000000003";
        }

        c.set("user", { id, username, role, isActive: true });
        return await next();
      }

      // In production, invalid JWT signature is an unhandled security violation
      return c.json({ error: "Invalid or expired authorization token", code: 401 }, 401);
    }

    // Missing auth header
    if (!isProduction) {
      c.set("user", {
        id: "00000000-0000-0000-0000-000000000001",
        username: "volupia_founder",
        role: "founder",
        isActive: true,
      });
      return await next();
    }

    return c.json({ error: "Missing authorization header", code: 401 }, 401);
  } catch (e: unknown) {
    void e;
    return c.json({ error: "Unauthorized access", code: 401 }, 401);
  }
}

/**
 * RBAC Role Permission Guard Middleware
 */
export function requireRole(allowedRoles: UserRole[]) {
  return async (c: Context, next: Next): Promise<Response | void> => {
    const user = c.get("user");
    if (!user || !user.isActive) {
      return c.json({ error: "User session invalid or inactive", code: 401 }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          error: "Forbidden: insufficient role permissions",
          requiredRoles: allowedRoles,
          currentRole: user.role,
        },
        403
      );
    }

    await next();
  };
}
