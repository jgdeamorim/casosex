import { a as encodeBase64url, r as decodeBase64url } from "./base64-B-PsqheR_CqpGr57O.mjs";
//#region self-essentials/emdash-main/packages/core/dist/tokens-DVltpO2D.mjs
var DURATION_PATTERN = /^(\d+)([smhdw])$/;
function parseDuration(duration) {
	if (typeof duration === "number") return duration;
	const match = duration.match(DURATION_PATTERN);
	if (!match) throw new Error(`Invalid duration format: "${duration}". Use "1h", "30m", "1d", "2w", or seconds.`);
	const value = parseInt(match[1], 10);
	const unit = match[2];
	switch (unit) {
		case "s": return value;
		case "m": return value * 60;
		case "h": return value * 60 * 60;
		case "d": return value * 60 * 60 * 24;
		case "w": return value * 60 * 60 * 24 * 7;
		default: throw new Error(`Unknown duration unit: ${unit}`);
	}
}
async function createSignature(data, secret) {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
	return new Uint8Array(signature);
}
async function verifySignature(data, signature, secret) {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["verify"]);
	const sigBuffer = new ArrayBuffer(signature.byteLength);
	new Uint8Array(sigBuffer).set(signature);
	return crypto.subtle.verify("HMAC", key, sigBuffer, encoder.encode(data));
}
async function generatePreviewToken(options) {
	const { contentId, expiresIn = "1h", secret } = options;
	if (!secret) throw new Error("Preview secret is required");
	if (!contentId || !contentId.includes(":")) throw new Error("Content ID must be in format \"collection:id\"");
	const now = Math.floor(Date.now() / 1e3);
	const payload = {
		cid: contentId,
		exp: now + parseDuration(expiresIn),
		iat: now
	};
	const payloadJson = JSON.stringify(payload);
	const encodedPayload = encodeBase64url(new TextEncoder().encode(payloadJson));
	return `${encodedPayload}.${encodeBase64url(await createSignature(encodedPayload, secret))}`;
}
async function verifyPreviewToken(options) {
	const { secret } = options;
	if (!secret) throw new Error("Preview secret is required");
	const token = "url" in options ? options.url.searchParams.get("_preview") : options.token;
	if (!token) return {
		valid: false,
		error: "none"
	};
	const parts = token.split(".");
	if (parts.length !== 2) return {
		valid: false,
		error: "malformed"
	};
	const [encodedPayload, encodedSignature] = parts;
	let signature;
	try {
		signature = decodeBase64url(encodedSignature);
	} catch {
		return {
			valid: false,
			error: "malformed"
		};
	}
	if (!await verifySignature(encodedPayload, signature, secret)) return {
		valid: false,
		error: "invalid"
	};
	let payload;
	try {
		const payloadBytes = decodeBase64url(encodedPayload);
		const payloadJson = new TextDecoder().decode(payloadBytes);
		payload = JSON.parse(payloadJson);
	} catch {
		return {
			valid: false,
			error: "malformed"
		};
	}
	if (typeof payload.cid !== "string" || typeof payload.exp !== "number" || typeof payload.iat !== "number") return {
		valid: false,
		error: "malformed"
	};
	const now = Math.floor(Date.now() / 1e3);
	if (payload.exp < now) return {
		valid: false,
		error: "expired"
	};
	return {
		valid: true,
		payload
	};
}
function parseContentId(contentId) {
	const colonIndex = contentId.indexOf(":");
	if (colonIndex === -1) throw new Error("Content ID must be in format \"collection:id\"");
	return {
		collection: contentId.slice(0, colonIndex),
		id: contentId.slice(colonIndex + 1)
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/preview-D4Jnbfx7.mjs
/**
* Preview URL generation
*
* Creates preview URLs that include a signed token for accessing draft content.
*/
var REPEATED_SLASHES = /\/{2,}/g;
/**
* Generate a preview URL for content
*
* The URL includes a `_preview` query parameter with a signed token.
*
* @example
* ```ts
* const url = await getPreviewUrl({
*   collection: "posts",
*   id: "hello-world",
*   secret: process.env.PREVIEW_SECRET!,
* });
* // Returns: /posts/hello-world?_preview=eyJj...
*
* // With base URL:
* const fullUrl = await getPreviewUrl({
*   collection: "posts",
*   id: "hello-world",
*   secret: process.env.PREVIEW_SECRET!,
*   baseUrl: "https://example.com",
* });
* // Returns: https://example.com/posts/hello-world?_preview=eyJj...
*
* // Custom path pattern:
* const customUrl = await getPreviewUrl({
*   collection: "posts",
*   id: "hello-world",
*   secret: process.env.PREVIEW_SECRET!,
*   pathPattern: "/blog/{id}",
* });
* // Returns: /blog/hello-world?_preview=eyJj...
* ```
*/
async function getPreviewUrl(options) {
	const { collection, id, secret, expiresIn = "1h", baseUrl, pathPattern = "/{collection}/{id}", locale = "" } = options;
	const token = await generatePreviewToken({
		contentId: `${collection}:${id}`,
		expiresIn,
		secret
	});
	let path = pathPattern.replace("{collection}", collection).replace("{id}", id).replace("{locale}", locale);
	path = path.replace(REPEATED_SLASHES, "/");
	if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
	const url = new URL(path, baseUrl || "http://placeholder");
	url.searchParams.set("_preview", token);
	if (!baseUrl) return `${url.pathname}${url.search}`;
	return url.toString();
}
//#endregion
export { parseContentId as n, verifyPreviewToken as r, getPreviewUrl as t };
