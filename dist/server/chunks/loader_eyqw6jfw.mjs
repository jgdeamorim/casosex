import { a as Kysely } from "./kysely_CkAA5UYX.mjs";
import { t as getRequestContext } from "./request-context_E8kV37BM.mjs";
//#region self-essentials/emdash-main/packages/core/src/utils/base64.ts
/**
* Base64 encoding/decoding utilities.
*
* Uses native Uint8Array.prototype.toBase64 / Uint8Array.fromBase64 when
* available (workerd, Node 26+, modern browsers), falls back to btoa/atob.
*
* All base64url encoding uses the { alphabet: "base64url" } option natively
* or manual character replacement as fallback.
*
* Delete the fallback paths when the minimum Node version supports these
* methods natively.
*/
var hasNative = typeof Uint8Array.prototype.toBase64 === "function" && typeof Uint8Array.fromBase64 === "function";
/** Encode a UTF-8 string as standard base64. */
function encodeBase64(str) {
	const bytes = new TextEncoder().encode(str);
	if (hasNative) return bytes.toBase64();
	let binary = "";
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary);
}
/** Decode a standard base64 string to a UTF-8 string. */
function decodeBase64(base64) {
	return new TextDecoder().decode(decodeBase64Bytes(base64));
}
/** Decode a standard base64 string to raw bytes (for binary payloads). */
function decodeBase64Bytes(base64) {
	if (hasNative) return Uint8Array.fromBase64(base64);
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/repositories/types.ts
/**
* Hard cap on cursor length. Cursors we issue are short JSON-in-base64
* blobs; a real cursor is well under 200 chars. This guards against
* malicious callers passing megabyte-sized strings to force the base64
* decoder to allocate (decodeBase64 is O(N) in input size). The MCP and
* REST schemas also clamp at 2048 — this 4096 cap is a defense-in-depth
* floor inside the repository helpers.
*/
var MAX_CURSOR_LENGTH = 4096;
/** Encode a cursor from order value + id */
function encodeCursor(orderValue, id) {
	return encodeBase64(JSON.stringify({
		orderValue,
		id
	}));
}
/**
* Thrown when a pagination cursor cannot be decoded.
*
* Repository callers should let this propagate; handler catch blocks
* map it to a structured `INVALID_CURSOR` error so client pagination
* bugs surface immediately rather than silently re-fetching the first
* page.
*/
var InvalidCursorError = class extends Error {
	constructor(cursor) {
		const display = cursor.length > 50 ? `${cursor.slice(0, 47)}...` : cursor;
		super(`Invalid pagination cursor: ${display}`);
		this.name = "InvalidCursorError";
	}
};
/**
* Decode a cursor to order value + id.
*
* Throws `InvalidCursorError` if the cursor is empty, not valid base64,
* not valid JSON, or doesn't contain string `orderValue` and `id` fields.
*/
function decodeCursor(cursor) {
	if (!cursor) throw new InvalidCursorError(cursor);
	if (cursor.length > MAX_CURSOR_LENGTH) throw new InvalidCursorError(cursor);
	let parsed;
	try {
		parsed = JSON.parse(decodeBase64(cursor));
	} catch {
		throw new InvalidCursorError(cursor);
	}
	if (parsed === null || typeof parsed !== "object") throw new InvalidCursorError(cursor);
	const candidate = parsed;
	if (typeof candidate.orderValue !== "string" || typeof candidate.id !== "string") throw new InvalidCursorError(cursor);
	return {
		orderValue: candidate.orderValue,
		id: candidate.id
	};
}
var EmDashValidationError = class extends Error {
	details;
	constructor(message, details) {
		super(message);
		this.details = details;
		this.name = "EmDashValidationError";
	}
};
/**
* Thrown by `publish()` when called with `requireDue` for a row that is no
* longer due (its `scheduled_at` was cleared or pushed into the future between
* selection and publish — e.g. an editor unscheduled it). Lets the scheduled
* sweep skip the row silently rather than treating it as a publish failure.
*/
var ScheduledNotDueError = class extends Error {
	constructor(message = "Content is no longer scheduled to publish") {
		super(message);
		this.name = "ScheduledNotDueError";
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/instrumentation.ts
function recordEvent(rec, sql, params, durationMs) {
	rec.events.push({
		sql,
		params,
		durationMs,
		route: rec.route,
		method: rec.method,
		phase: rec.phase
	});
}
function kyselyLog(event) {
	if (event.level !== "query") return;
	const ctx = getRequestContext();
	if (!ctx) return;
	const dur = event.queryDurationMillis;
	if (ctx.metrics) {
		const m = ctx.metrics;
		m.dbCount += 1;
		m.dbTotalMs += dur;
		const finishedAt = performance.now() - m.start;
		const startedAt = finishedAt - dur;
		if (m.dbFirstOffset === null) m.dbFirstOffset = startedAt;
		m.dbLastOffset = finishedAt;
	}
	if (ctx.queryRecorder) recordEvent(ctx.queryRecorder, event.query.sql, event.query.parameters, dur);
}
/**
* Returns a Kysely `log` callback. Always returns a function so per-request
* counters (db.count, db.total, db.first, db.last) and the optional NDJSON
* recorder both get fed. The cost over the previous "undefined when off"
* behaviour is one `performance.now()` pair per query inside Kysely, which
* is in the noise compared to any real query.
*/
function kyselyLogOption() {
	return kyselyLog;
}
[...Object.values({
	seo_title: "_emdash_seo_title",
	seo_description: "_emdash_seo_description",
	seo_image: "_emdash_seo_image",
	seo_canonical: "_emdash_seo_canonical",
	seo_no_index: "_emdash_seo_no_index"
})];
/** Markers for byline/taxonomy hydration folded into the content query. */
var FOLDED_TERMS = Symbol.for("emdash:foldedTerms");
var FOLDED_BYLINES = Symbol.for("emdash:foldedBylines");
/**
* Hidden, symbol-keyed property on each mapped data record carrying the raw
* DB string for every date column. Lets cursor encoders downstream reproduce
* the loader's exact `nextCursor` format without round-tripping through
* `new Date()`, which loses precision for stored values that aren't already
* ISO-with-milliseconds (e.g. `2026-01-01T00:00:00Z` becomes
* `2026-01-01T00:00:00.000Z`).
*/
var CURSOR_RAW_VALUES = Symbol("emdash:cursorRawValues");
var virtualConfig;
var virtualCreateDialect;
async function loadVirtualModules() {
	if (virtualConfig === void 0) virtualConfig = (await import("./config_C9rc4I7T.mjs")).default;
	if (virtualCreateDialect === void 0) virtualCreateDialect = (await import("./dialect_BmWjYCdG.mjs")).createDialect;
}
var dbInstance = null;
/**
* Get the database instance. Used by query wrapper functions and middleware.
*
* Checks the ALS request context first — if a per-request DB override is set
* (e.g. by DO preview middleware), it takes precedence over the module-level
* cached instance. This allows preview mode to route queries to an isolated
* Durable Object database without modifying any calling code.
*
* Initializes the default database on first call using config from virtual module.
*/
async function getDb() {
	const ctx = getRequestContext();
	if (ctx?.db) return ctx.db;
	if (!dbInstance) {
		await loadVirtualModules();
		if (!virtualConfig?.database || typeof virtualCreateDialect !== "function") throw new Error("EmDash database not configured. Add database config to emdash() in astro.config.mjs");
		const dialect = virtualCreateDialect(virtualConfig.database.config);
		dbInstance = new Kysely({
			dialect,
			log: kyselyLogOption()
		});
	}
	return dbInstance;
}
//#endregion
export { EmDashValidationError as a, decodeCursor as c, getDb as i, encodeCursor as l, FOLDED_BYLINES as n, InvalidCursorError as o, FOLDED_TERMS as r, ScheduledNotDueError as s, CURSOR_RAW_VALUES as t };
