import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { f as mediaUploadUrlBody } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import { a as normalizeMime, i as matchesMimeAllowlist } from "./hash-Cb7U1b5M_CHUcNDr6.mjs";
import "./dist_C4cexd-h.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { n as resolveFieldAllowlist, t as GLOBAL_UPLOAD_ALLOWLIST } from "./media-allowlist-B7TPD6aq_DajhhggI.mjs";
import * as path$1 from "node:path";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/upload-url.mjs
var upload_url_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
function isUnsupportedSignedUpload(error) {
	return error instanceof Error && "code" in error && error.code === "NOT_SUPPORTED";
}
/**
* Get a signed upload URL for direct-to-storage upload
*/
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "media:upload");
	if (denied) return denied;
	if (!emdash?.storage) return apiError("NO_STORAGE", "Storage not configured. Signed URL uploads require S3-compatible storage.", 501);
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const maxSize = emdash.config.maxUploadSize ?? 52428800;
		if (!Number.isFinite(maxSize) || maxSize <= 0) return apiError("CONFIGURATION_ERROR", "Invalid maxUploadSize configuration. Expected a positive finite number.", 500);
		const body = await parseBody(request, mediaUploadUrlBody(maxSize));
		if (isParseError(body)) return body;
		const normalizedContentType = normalizeMime(body.contentType);
		const allowlist = (body.fieldId ? await resolveFieldAllowlist(emdash.db, body.fieldId) : null) ?? [...GLOBAL_UPLOAD_ALLOWLIST];
		if (!matchesMimeAllowlist(body.contentType, allowlist)) return apiError("INVALID_TYPE", "File type not allowed", 400);
		const repo = new MediaRepository(emdash.db);
		if (body.contentHash && body.size > 0) {
			const existing = await repo.findByContentHash(body.contentHash);
			if (existing && existing.mimeType === normalizedContentType && existing.size === body.size) return apiSuccess({
				existing: true,
				mediaId: existing.id,
				storageKey: existing.storageKey,
				url: `/_emdash/api/media/file/${existing.storageKey}`
			});
		}
		const storageKey = `${ulid()}${path$1.extname(body.filename) || ""}`;
		let signedUrl;
		try {
			signedUrl = await emdash.storage.getSignedUploadUrl({
				key: storageKey,
				contentType: body.contentType,
				size: body.size,
				expiresIn: 3600
			});
		} catch (error) {
			if (!isUnsupportedSignedUpload(error)) throw error;
			signedUrl = null;
		}
		const mediaItem = await repo.createPending({
			filename: body.filename,
			mimeType: normalizedContentType,
			size: body.size,
			storageKey,
			authorId: user?.id
		});
		return apiSuccess({
			uploadUrl: signedUrl?.url ?? `/_emdash/api/media/${mediaItem.id}/upload`,
			method: signedUrl?.method ?? "PUT",
			headers: signedUrl?.headers ?? {
				"Content-Type": normalizedContentType,
				"X-EmDash-Request": "1"
			},
			mediaId: mediaItem.id,
			storageKey,
			expiresAt: signedUrl?.expiresAt ?? new Date(Date.now() + 36e5).toISOString()
		});
	} catch (error) {
		return handleError(error, "Failed to generate upload URL", "UPLOAD_URL_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/upload-url@_@mjs
var page = () => upload_url_exports;
//#endregion
export { page };
