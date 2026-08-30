import type { UserRole } from "../types/content-os.js";

export interface JwtPayload {
  id: string;
  username: string;
  role: UserRole;
  tenantId: string;
  iat: number;
  exp: number;
}

const DEFAULT_SECRET = "volupia-sovereign-v8-secret-2026";

function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Generate a signed JWT token using HMAC-SHA256 (Web Crypto API)
 */
export async function generateJwtToken(
  user: { id: string; username: string; role: UserRole; tenantId?: string },
  expiresInSeconds = 86400,
  secret = DEFAULT_SECRET
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
    tenantId: user.tenantId || "default",
    iat: now,
    exp: now + expiresInSeconds,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureString = String.fromCharCode(...signatureArray);
  const signatureB64 = base64UrlEncode(signatureString);

  return `${dataToSign}.${signatureB64}`;
}

/**
 * Cryptographically verify a JWT token signature and expiration
 */
export async function verifyJwtToken(
  token: string,
  secret = DEFAULT_SECRET
): Promise<JwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToSign = `${headerB64}.${payloadB64}`;

    const key = await getHmacKey(secret);
    const enc = new TextEncoder();

    const signatureString = base64UrlDecode(signatureB64);
    const signatureBuffer = new Uint8Array(signatureString.length);
    for (let i = 0; i < signatureString.length; i++) {
      signatureBuffer[i] = signatureString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      enc.encode(dataToSign)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadJson) as JwtPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch (e: unknown) {
    void e;
    return null;
  }
}
