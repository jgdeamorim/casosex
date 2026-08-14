import { t as sql } from "./dist_D4nVBoqy.mjs";
//#region self-essentials/emdash-main/packages/core/dist/snapshot-BdpUJKD-.mjs
/**
* Verify HMAC-SHA256 preview signature using crypto.subtle.
* Returns true if the signature is valid and not expired.
*/
async function verifyPreviewSignature(source, exp, sig, secret) {
	if (exp < Date.now() / 1e3) return false;
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["verify"]);
	const sigBytes = new Uint8Array(sig.length / 2);
	for (let i = 0; i < sig.length; i += 2) sigBytes[i / 2] = parseInt(sig.substring(i, i + 2), 16);
	return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(`${source}:${exp}`));
}
/**
* Parse an X-Preview-Signature header value into its components.
*
* Format: "source:exp:sig" where source is a URL (contains colons),
* exp is a unix timestamp, and sig is 64 hex chars.
*
* Parses from the right since source URLs contain colons.
*
* @returns Parsed components, or null if the format is invalid
*/
function parsePreviewSignatureHeader(header) {
	const lastColon = header.lastIndexOf(":");
	if (lastColon <= 0) return null;
	const sig = header.substring(lastColon + 1);
	if (sig.length !== 64) return null;
	const rest = header.substring(0, lastColon);
	const secondLastColon = rest.lastIndexOf(":");
	if (secondLastColon <= 0) return null;
	const source = rest.substring(0, secondLastColon);
	const exp = parseInt(rest.substring(secondLastColon + 1), 10);
	if (isNaN(exp) || source.length === 0) return null;
	return {
		source,
		exp,
		sig
	};
}
var MEDIA_FILE_PREFIX = "/_emdash/api/media/file/";
/**
* Parse a JSON string value and inject `src` for local media objects.
* Returns the original string if it's not a local media value.
*/
function injectMediaSrc(jsonStr, origin) {
	try {
		const obj = JSON.parse(jsonStr);
		if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return jsonStr;
		if (injectMediaSrcInto(obj, origin)) return JSON.stringify(obj);
		return jsonStr;
	} catch {
		return jsonStr;
	}
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Recursively walk an object and inject `src` into local media values.
* Returns true if any modifications were made.
*/
function injectMediaSrcInto(obj, origin) {
	let modified = false;
	if ((obj.provider === "local" || !obj.provider && obj.id && obj.meta) && !obj.src) {
		const storageKey = (isRecord(obj.meta) ? obj.meta : void 0)?.storageKey ?? obj.id;
		if (typeof storageKey === "string" && storageKey) {
			obj.src = `${origin}${MEDIA_FILE_PREFIX}${storageKey}`;
			modified = true;
		}
	}
	for (const value of Object.values(obj)) if (Array.isArray(value)) {
		for (const item of value) if (isRecord(item)) {
			if (injectMediaSrcInto(item, origin)) modified = true;
		}
	} else if (isRecord(value)) {
		if (injectMediaSrcInto(value, origin)) modified = true;
	}
	return modified;
}
/**
* Safe identifier pattern for snapshot table names.
* More permissive than validateIdentifier() — allows leading underscores
* (needed for system tables like _emdash_collections).
*/
var SAFE_TABLE_NAME = /^[a-z_][a-z0-9_]*$/;
/**
* System tables included in snapshots.
* Content tables (ec_*) are discovered dynamically.
*/
var SYSTEM_TABLES = [
	"_emdash_collections",
	"_emdash_fields",
	"_emdash_taxonomy_defs",
	"_emdash_menus",
	"_emdash_menu_items",
	"_emdash_sections",
	"_emdash_widget_areas",
	"_emdash_widgets",
	"_emdash_seo",
	"_emdash_migrations",
	"taxonomies",
	"content_taxonomies",
	"media",
	"options",
	"revisions"
];
/**
* Table name prefixes excluded from snapshots (auth/security data).
*/
var EXCLUDED_PREFIXES = [
	"_emdash_api_tokens",
	"_emdash_oauth_tokens",
	"_emdash_authorization_codes",
	"_emdash_device_codes",
	"_emdash_migrations_lock",
	"_plugin_",
	"users",
	"sessions",
	"credentials",
	"challenges"
];
/**
* Options key prefixes safe for inclusion in snapshots.
*
* The options table contains plugin secrets (plugin:*), passkey challenges
* (emdash:passkey_pending:*), and setup state that must not leak to
* preview databases. Only site-level rendering settings are needed.
*/
var SAFE_OPTIONS_PREFIXES = ["site:"];
function isExcluded(tableName) {
	return EXCLUDED_PREFIXES.some((prefix) => tableName.startsWith(prefix));
}
/**
* Generate a portable database snapshot.
*
* Discovers ec_* content tables dynamically, exports system tables
* needed for rendering, and includes schema info for table recreation.
*/
async function generateSnapshot(db, options) {
	const includeDrafts = options?.includeDrafts ?? false;
	const includeTrashed = options?.includeTrashed ?? false;
	const optionPrefixes = options?.optionPrefixes ?? SAFE_OPTIONS_PREFIXES;
	const allTables = [...(await sql`
		SELECT name FROM sqlite_master
		WHERE type = 'table'
		AND name LIKE 'ec_%'
		ORDER BY name
	`.execute(db)).rows.map((r) => r.name), ...SYSTEM_TABLES];
	const tables = {};
	const schema = {};
	for (const tableName of allTables) {
		if (isExcluded(tableName)) continue;
		if (!SAFE_TABLE_NAME.test(tableName)) continue;
		try {
			const pragmaResult = await sql`
				PRAGMA table_info(${sql.raw(`"${tableName}"`)})
			`.execute(db);
			if (pragmaResult.rows.length === 0) continue;
			const columns = pragmaResult.rows.map((r) => r.name);
			const types = {};
			for (const row of pragmaResult.rows) types[row.name] = row.type || "TEXT";
			schema[tableName] = {
				columns,
				types
			};
			let rows;
			if (tableName.startsWith("ec_")) if (includeTrashed) rows = (await sql`
						SELECT * FROM ${sql.raw(`"${tableName}"`)}
					`.execute(db)).rows;
			else if (includeDrafts) rows = (await sql`
						SELECT * FROM ${sql.raw(`"${tableName}"`)}
						WHERE deleted_at IS NULL
					`.execute(db)).rows;
			else rows = (await sql`
						SELECT * FROM ${sql.raw(`"${tableName}"`)}
						WHERE deleted_at IS NULL
						AND (status = 'published' OR (status = 'scheduled' AND scheduled_at <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now')))
					`.execute(db)).rows;
			else if (tableName === "options") rows = (await sql`
					SELECT * FROM ${sql.raw(`"${tableName}"`)}
				`.execute(db)).rows.filter((row) => {
				const name = typeof row.name === "string" ? row.name : "";
				return optionPrefixes.some((prefix) => name.startsWith(prefix));
			});
			else rows = (await sql`
					SELECT * FROM ${sql.raw(`"${tableName}"`)}
				`.execute(db)).rows;
			if (rows.length > 0) tables[tableName] = rows;
		} catch {}
	}
	if (options?.origin) {
		const origin = options.origin;
		for (const [tableName, rows] of Object.entries(tables)) {
			if (!tableName.startsWith("ec_")) continue;
			for (const row of rows) for (const [col, value] of Object.entries(row)) {
				if (typeof value !== "string" || !value.startsWith("{")) continue;
				row[col] = injectMediaSrc(value, origin);
			}
		}
	}
	return {
		tables,
		schema,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
export { parsePreviewSignatureHeader as n, verifyPreviewSignature as r, generateSnapshot as t };
