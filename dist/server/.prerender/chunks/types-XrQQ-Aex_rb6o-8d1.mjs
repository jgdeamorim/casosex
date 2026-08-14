import "./runner-BsI18UgP_CTLRmh7U.mjs";
//#region self-essentials/emdash-main/packages/core/dist/base64-B-PsqheR.mjs
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
var BASE64_PLUS_PATTERN = /\+/g;
var BASE64_SLASH_PATTERN = /\//g;
var BASE64_PADDING_PATTERN = /=+$/;
var BASE64URL_DASH_PATTERN = /-/g;
var BASE64URL_UNDERSCORE_PATTERN = /_/g;
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
/** Encode bytes as base64url without padding. */
function encodeBase64url(bytes) {
	if (hasNative) return bytes.toBase64({
		alphabet: "base64url",
		omitPadding: true
	});
	let binary = "";
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary).replace(BASE64_PLUS_PATTERN, "-").replace(BASE64_SLASH_PATTERN, "_").replace(BASE64_PADDING_PATTERN, "");
}
/** Decode a base64url string (with or without padding) to bytes. */
function decodeBase64url(encoded) {
	if (hasNative) return Uint8Array.fromBase64(encoded, { alphabet: "base64url" });
	const base64 = encoded.replace(BASE64URL_DASH_PATTERN, "+").replace(BASE64URL_UNDERSCORE_PATTERN, "/");
	const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/types-XrQQ-Aex.mjs
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
export { encodeCursor as a, encodeBase64 as c, decodeCursor as i, encodeBase64url as l, InvalidCursorError as n, decodeBase64 as o, ScheduledNotDueError as r, decodeBase64url as s, EmDashValidationError as t };
