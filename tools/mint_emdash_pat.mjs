import crypto from "node:crypto";
import { execSync } from "node:child_process";

function hashPrefixedToken(token) {
	return crypto.createHash("sha256").update(token).digest("base64url");
}

function generatePrefixedToken(prefix) {
	const bytes = crypto.randomBytes(32);
	const encoded = bytes.toString("base64url");
	const raw = `${prefix}${encoded}`;
	const hash = hashPrefixedToken(raw);
	const displayPrefix = raw.slice(0, prefix.length + 4);
	return { raw, hash, prefix: displayPrefix };
}

const dbPath = "./self-essentials/emdash-main/demos/simple/data.db";
const now = new Date().toISOString();
const userId = "01KZYYPVZVG9WAKVNAEQ561DPY";

// Clear existing test tokens
execSync(`sqlite3 "${dbPath}" "DELETE FROM _emdash_api_tokens;"`);

// Ensure user exists
execSync(`sqlite3 "${dbPath}" "INSERT OR IGNORE INTO users (id, email, name, role, email_verified, created_at, updated_at) VALUES ('${userId}', 'dev@emdash.local', 'Dev Admin', 50, 1, '${now}', '${now}');"`);

const { raw, hash, prefix } = generatePrefixedToken("ec_pat_");
const tokenId = "PAT_" + Date.now();
const scopesArray = ["admin", "content:read", "content:write", "media:read", "media:write", "settings:manage"];
const scopesJsonEscaped = JSON.stringify(scopesArray).replace(/"/g, '\\"');

execSync(`sqlite3 "${dbPath}" "INSERT INTO _emdash_api_tokens (id, name, token_hash, prefix, user_id, scopes, created_at) VALUES ('${tokenId}', 'Dev PAT', '${hash}', '${prefix}', '${userId}', '${scopesJsonEscaped}', '${now}');"`);

console.log("GENERATED_PAT=" + raw);
