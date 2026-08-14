import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/file/_...key_.mjs
var ____key__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* Content types that are safe to display inline (simple raster/vector images, video, audio).
* Everything else gets Content-Disposition: attachment to prevent script execution.
*/
var SAFE_INLINE_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/avif",
	"image/x-icon",
	"video/mp4",
	"video/webm",
	"audio/mpeg",
	"audio/wav",
	"audio/ogg"
]);
var GET = async ({ params, locals }) => {
	const { key } = params;
	const { emdash } = locals;
	if (!key) return apiError("NOT_FOUND", "File not found", 404);
	if (key.startsWith("backups/")) return apiError("NOT_FOUND", "File not found", 404);
	if (!emdash?.storage) return apiError("NOT_CONFIGURED", "Storage not configured", 500);
	try {
		const result = await emdash.storage.download(key);
		const headers = {
			"Content-Type": result.contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
			"X-Content-Type-Options": "nosniff",
			"Content-Security-Policy": "sandbox; default-src 'none'; img-src 'self'; style-src 'unsafe-inline'"
		};
		if (result.size) headers["Content-Length"] = String(result.size);
		if (SAFE_INLINE_TYPES.has(result.contentType)) headers["Content-Disposition"] = "inline";
		else headers["Content-Disposition"] = "attachment";
		return new Response(result.body, {
			status: 200,
			headers
		});
	} catch (error) {
		if (error instanceof Error && (error.message.includes("not found") || error.message.includes("NOT_FOUND"))) return apiError("NOT_FOUND", "File not found", 404);
		return handleError(error, "Failed to serve file", "FILE_SERVE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/file/_...key_@_@mjs
var page = () => ____key__exports;
//#endregion
export { page };
