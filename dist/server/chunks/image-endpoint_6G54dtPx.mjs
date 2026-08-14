import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { c as isRemotePath } from "./path_CsjwVQRw.mjs";
import { t as isRemoteAllowed } from "./remote_Df8tYpvm.mjs";
import { t as INTERNAL_MEDIA_PREFIX } from "./normalize-C-SHXmra_BSrPKVar.mjs";
import { a as lookup, r as imageConfig, s as getConfiguredImageService, t as getConfiguredImageService$1 } from "./_astro_assets_D5FWpGHA.mjs";
import { a as fetchWithRedirects } from "./service_DzPQ2Ryn.mjs";
//#region self-essentials/emdash-main/packages/core/dist/media/image-endpoint.mjs
/** Long-lived immutable cache -- transform output is deterministic per key+params. */
var IMMUTABLE_IMAGE_CACHE = "public, max-age=31536000, immutable";
/**
* Raster types safe to render inline. Anything else (SVG, PDF, ...) is served
* as an attachment so it can't execute as an active document. Mirrors the
* `/_emdash/api/media/file/{key}` route's allowlist.
*/
var SAFE_INLINE_IMAGE_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/avif",
	"image/x-icon"
]);
/**
* Headers for streaming **original** stored bytes (the no-transform fallback).
* Carries the same stored-XSS protections as the media file route: a sandbox
* CSP, `nosniff`, and `Content-Disposition: attachment` for anything not on the
* inline raster allowlist (so a stored SVG can't run scripts in the site
* origin). Transformed output is always generated raster and doesn't need this.
*/
function originalMediaHeaders(contentType) {
	return {
		"Content-Type": contentType,
		"Cache-Control": IMMUTABLE_IMAGE_CACHE,
		"X-Content-Type-Options": "nosniff",
		"Content-Security-Policy": "sandbox; default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
		"Content-Disposition": SAFE_INLINE_IMAGE_TYPES.has(contentType) ? "inline" : "attachment"
	};
}
/** Storage keys safe to serve: the flat `{ulid}{ext}` shape, no slashes/traversal. */
var SAFE_STORAGE_KEY = /^[A-Za-z0-9._-]+$/;
/** Whether a storage key is safe to resolve against the storage backend. */
function isSafeTransformKey(key) {
	return SAFE_STORAGE_KEY.test(key);
}
/**
* If `href` points at the internal EmDash media route
* (`/_emdash/api/media/file/{key}`) with a safe key, return the key; otherwise
* `null` (the endpoint then delegates to the stock image endpoint for bundled
* assets, allowed remote, and `publicUrl` media).
*
* The component absolutizes same-origin media (Astro only optimizes absolute,
* remote-allowed URLs), so `href` is typically `https://site/_emdash/...` but
* may be relative. We match on the **pathname** only and never fetch `href` —
* the key is read from our own storage — so the host is irrelevant and can't be
* an SSRF vector. A dummy base resolves both absolute and relative forms and
* strips any query/fragment.
*/
function matchInternalMediaKey(href) {
	if (!href) return null;
	let pathname;
	try {
		pathname = new URL(href, "http://localhost").pathname;
	} catch {
		return null;
	}
	if (!pathname.startsWith("/_emdash/api/media/file/")) return null;
	const key = pathname.slice(INTERNAL_MEDIA_PREFIX.length);
	if (!key || !isSafeTransformKey(key)) return null;
	return key;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/utils/etag.js
var fnv1a52 = (str) => {
	const len = str.length;
	let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
	while (i < len) {
		v0 ^= str.charCodeAt(i++);
		t0 = v0 * 435;
		t1 = v1 * 435;
		t2 = v2 * 435;
		t3 = v3 * 435;
		t2 += v0 << 8;
		t3 += v1 << 8;
		t1 += t0 >>> 16;
		v0 = t0 & 65535;
		t2 += t1 >>> 16;
		v1 = t1 & 65535;
		v3 = t3 + (t2 >>> 16) & 65535;
		v2 = t2 & 65535;
	}
	return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
var etag = (payload, weak = false) => {
	return (weak ? "W/\"" : "\"") + fnv1a52(payload).toString(36) + payload.length.toString(36) + "\"";
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/loadImage.js
async function loadImage(src, headers, imageConfig, isRemote, fetchFn) {
	try {
		const res = await fetchWithRedirects({
			url: src,
			headers,
			imageConfig,
			fetchFn
		});
		if (isRemote && !isRemoteAllowed(res.url, imageConfig)) return;
		if (!res.ok) return;
		return await res.arrayBuffer();
	} catch {
		return;
	}
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic.js
var GET$1 = async ({ request }) => {
	try {
		const imageService = await getConfiguredImageService();
		if (!("transform" in imageService)) throw new Error("Configured image service is not a local service");
		const url = new URL(request.url);
		const transform = await imageService.parseURL(url, imageConfig);
		if (!transform?.src) throw new Error("Incorrect transform returned by `parseURL`");
		let inputBuffer = void 0;
		const isRemoteImage = isRemotePath(transform.src);
		if (isRemoteImage && isRemoteAllowed(transform.src, imageConfig) === false) return new Response("Forbidden", { status: 403 });
		const sourceUrl = new URL(transform.src, url.origin);
		if (!isRemoteImage && sourceUrl.origin !== url.origin) return new Response("Forbidden", { status: 403 });
		inputBuffer = await loadImage(sourceUrl, isRemoteImage ? new Headers() : request.headers, imageConfig, isRemoteImage);
		if (!inputBuffer) return new Response("Not Found", { status: 404 });
		const { data, format } = await imageService.transform(new Uint8Array(inputBuffer), transform, imageConfig);
		return new Response(data, {
			status: 200,
			headers: {
				"Content-Type": lookup(format) ?? `image/${format}`,
				"Cache-Control": "public, max-age=31536000",
				ETag: etag(data.toString()),
				Date: (/* @__PURE__ */ new Date()).toUTCString()
			}
		});
	} catch (err) {
		console.error("Could not process image request:", err);
		return new Response("Internal Server Error", { status: 500 });
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/image-endpoint.mjs
var image_endpoint_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var FORMAT_MIME = {
	webp: "image/webp",
	avif: "image/avif",
	png: "image/png",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	gif: "image/gif"
};
function isNotFound(error) {
	return error instanceof Error && (error.message.includes("not found") || error.message.includes("NOT_FOUND"));
}
function streamOriginal(body, contentType) {
	return new Response(body, {
		status: 200,
		headers: originalMediaHeaders(contentType)
	});
}
var GET = async (ctx) => {
	const url = new URL(ctx.request.url);
	const key = matchInternalMediaKey(url.searchParams.get("href"));
	const storage = ctx.locals.emdash?.storage;
	if (!key || !storage) return GET$1(ctx);
	const service = await getConfiguredImageService$1();
	if (!("transform" in service)) return GET$1(ctx);
	try {
		const source = await storage.download(key);
		if (!source.contentType.startsWith("image/")) return streamOriginal(source.body, source.contentType);
		const transform = await service.parseURL(url, imageConfig);
		if (!transform) return streamOriginal(source.body, source.contentType);
		const inputBuffer = new Uint8Array(await new Response(source.body).arrayBuffer());
		const { data, format } = await service.transform(inputBuffer, transform, imageConfig);
		return new Response(data, {
			status: 200,
			headers: {
				"Content-Type": FORMAT_MIME[format] ?? source.contentType,
				"Cache-Control": IMMUTABLE_IMAGE_CACHE,
				"X-Content-Type-Options": "nosniff"
			}
		});
	} catch (error) {
		if (isNotFound(error)) return new Response("Not Found", { status: 404 });
		console.error("[emdash] image transform failed:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/image-endpoint@_@mjs
var page = () => image_endpoint_exports;
//#endregion
export { page };
