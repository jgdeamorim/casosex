//#region self-essentials/emdash-main/packages/core/dist/mime-DfIVjNkr.mjs
function normalizeMime(mime) {
	return mime.split(";")[0].trim().toLowerCase();
}
function matchesMimeAllowlist(mime, allowList) {
	const normalized = normalizeMime(mime);
	for (const entry of allowList) {
		if (!entry || !entry.includes("/")) continue;
		const normalizedEntry = normalizeMime(entry);
		if (normalizedEntry.endsWith("/")) {
			if (normalized.startsWith(normalizedEntry)) return true;
		} else if (normalized === normalizedEntry) return true;
	}
	return false;
}
/**
* Extract the `allowedMimeTypes` list from a `_emdash_fields.validation` row
* (raw JSON string). Returns null when the value is missing, malformed, or the
* list is empty — callers treat that as "no field-specific constraint".
*/
function parseAllowedMimeTypes(rawValidation) {
	if (!rawValidation) return null;
	try {
		const parsed = JSON.parse(rawValidation);
		if (typeof parsed !== "object" || parsed === null) return null;
		const list = parsed.allowedMimeTypes;
		if (!Array.isArray(list) || list.length === 0) return null;
		return list.filter((entry) => typeof entry === "string");
	} catch {
		return null;
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/hash-Cb7U1b5M.mjs
var MAX_CONTENT_HASH_BYTES = 8388608;
function formatContentHash(hash) {
	return `sha1:${Array.from(hash, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}
/**
* SHA-256 hash of a string, truncated to 16 hex chars (64 bits).
* For cache invalidation / ETags — not for security.
*/
async function hashString(content) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
	return Array.from(new Uint8Array(buf).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}
/**
* Compute content hash using Web Crypto API
*
* Uses SHA-1 which is the fastest option in SubtleCrypto.
* SHA-1 is cryptographically weak but fine for content deduplication
* where we only need to detect identical files, not resist attacks.
*
* Returns hex string prefixed with "sha1:" for future-proofing
*/
async function computeContentHash(content) {
	let buf;
	if (content instanceof ArrayBuffer) buf = content;
	else if (content.buffer instanceof ArrayBuffer && content.byteOffset === 0 && content.byteLength === content.buffer.byteLength) buf = content.buffer;
	else {
		buf = new ArrayBuffer(content.byteLength);
		new Uint8Array(buf).set(content);
	}
	const hashBuffer = await crypto.subtle.digest("SHA-1", buf);
	return formatContentHash(new Uint8Array(hashBuffer));
}
//#endregion
export { normalizeMime as a, matchesMimeAllowlist as i, computeContentHash as n, parseAllowedMimeTypes as o, hashString as r, MAX_CONTENT_HASH_BYTES as t };
