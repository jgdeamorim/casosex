import crypto from "node:crypto";
import { execSync } from "node:child_process";

const dbPath = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/self-inspirations/emdash/templates/blog/data.db";
const dbPath2 = "./data.db";
const userId = "01KZZ3CPGHS2C561SN1B4GPHFZ";
const email = "jeferson@adsentice.com";

// 1. Ensure user is in users table
const now = new Date().toISOString();
execSync(`sqlite3 "${dbPath}" "INSERT OR REPLACE INTO users (id, email, name, role, email_verified, created_at, updated_at, disabled) VALUES ('${userId}', '${email}', 'Jeferson Amorim', 50, 1, '${now}', '${now}', 0);"`);
execSync(`sqlite3 "${dbPath2}" "INSERT OR REPLACE INTO users (id, email, name, role, email_verified, created_at, updated_at, disabled) VALUES ('${userId}', '${email}', 'Jeferson Amorim', 50, 1, '${now}', '${now}', 0);"`);

// 2. Magic Link Token
const rawBytes = crypto.randomBytes(32);
const token = rawBytes.toString("base64url");
const hash = crypto.createHash("sha256").update(rawBytes).digest("base64url");

const sqlMagicLink = `INSERT OR REPLACE INTO auth_tokens (hash, user_id, email, type, role, expires_at, created_at) VALUES ('${hash}', '${userId}', '${email}', 'magic_link', 50, datetime('now', '+7 days'), datetime('now'));`;

execSync(`sqlite3 "${dbPath}" "${sqlMagicLink}"`);
execSync(`sqlite3 "${dbPath2}" "${sqlMagicLink}"`);

// 3. PAT Token
const patBytes = crypto.randomBytes(32);
const patEncoded = patBytes.toString("base64url");
const rawPat = `ec_pat_${patEncoded}`;
const patHash = crypto.createHash("sha256").update(rawPat).digest("base64url");
const patPrefix = rawPat.slice(0, 10);
const tokenId = "PAT_" + Date.now();
const scopesJson = JSON.stringify(["admin", "content:read", "content:write", "media:read", "media:write", "settings:manage"]);

const sqlPat = `INSERT OR REPLACE INTO _emdash_api_tokens (id, name, token_hash, prefix, user_id, scopes, created_at) VALUES ('${tokenId}', 'Adsentice Founder PAT', '${patHash}', '${patPrefix}', '${userId}', '${scopesJson}', datetime('now'));`;

execSync(`sqlite3 "${dbPath}" "${sqlPat}"`);
execSync(`sqlite3 "${dbPath2}" "${sqlPat}"`);

console.log("LOGIN_MAGIC_LINK=http://localhost:2727/_emdash/api/auth/magic-link/verify?token=" + token);
console.log("PAT_TOKEN=" + rawPat);
