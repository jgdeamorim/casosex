import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import { n as computeContentHash } from "./hash-Cb7U1b5M_CHUcNDr6.mjs";
import { t as enrichImageMetadata } from "./enrich-CFJJgxs__9Ib7u08c.mjs";
import { a as validateExternalUrl, r as ssrfSafeFetch, t as SsrfError } from "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import "./dist_C4cexd-h.mjs";
import { b as wpMediaImportBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as index_lite_default } from "./index_lite_BlYWlefL.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import * as path$1 from "node:path";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/media.mjs
var media_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	importMediaWithProgress: () => importMediaWithProgress,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	if (!emdash?.storage) return apiError("NO_STORAGE", "Storage not configured. Media import requires storage.", 501);
	if (!emdash?.db) return apiError("NO_DB", "Database not initialized", 500);
	try {
		const body = await parseBody(request, wpMediaImportBody);
		if (isParseError(body)) return body;
		const attachments = body.attachments;
		if (body.stream !== false) {
			const stream = new ReadableStream({ async start(controller) {
				const encoder = new TextEncoder();
				const sendProgress = (progress) => {
					controller.enqueue(encoder.encode(JSON.stringify(progress) + "\n"));
				};
				const result = await importMediaWithProgress(attachments, emdash.db, emdash.storage, sendProgress);
				controller.enqueue(encoder.encode(JSON.stringify({
					...result,
					type: "result"
				}) + "\n"));
				controller.close();
			} });
			return new Response(stream, {
				status: 200,
				headers: {
					"Content-Type": "application/x-ndjson",
					"Cache-Control": "private, no-store",
					"Transfer-Encoding": "chunked"
				}
			});
		}
		return apiSuccess(await importMediaWithProgress(attachments, emdash.db, emdash.storage, () => {}));
	} catch (error) {
		return handleError(error, "Failed to import media", "IMPORT_ERROR");
	}
};
async function importMediaWithProgress(attachments, db, storage, onProgress) {
	const repo = new MediaRepository(db);
	const total = attachments.length;
	const result = {
		imported: [],
		failed: [],
		urlMap: {}
	};
	for (let i = 0; i < attachments.length; i++) {
		const attachment = attachments[i];
		const current = i + 1;
		const filename = attachment.filename || `file-${attachment.id}`;
		if (!attachment.url) {
			result.failed.push({
				wpId: attachment.id,
				originalUrl: "",
				error: "No URL provided"
			});
			onProgress({
				type: "progress",
				current,
				total,
				filename,
				status: "failed",
				error: "No URL provided"
			});
			continue;
		}
		try {
			try {
				validateExternalUrl(attachment.url);
			} catch (e) {
				const msg = e instanceof SsrfError ? e.message : "Invalid URL";
				result.failed.push({
					wpId: attachment.id,
					originalUrl: attachment.url,
					error: `Blocked: ${msg}`
				});
				onProgress({
					type: "progress",
					current,
					total,
					filename,
					status: "failed",
					error: `Blocked: ${msg}`
				});
				continue;
			}
			onProgress({
				type: "progress",
				current,
				total,
				filename,
				status: "downloading"
			});
			const response = await ssrfSafeFetch(attachment.url, { headers: { "User-Agent": "EmDash-Importer/1.0" } });
			if (!response.ok) {
				result.failed.push({
					wpId: attachment.id,
					originalUrl: attachment.url,
					error: `HTTP ${response.status}: ${response.statusText}`
				});
				onProgress({
					type: "progress",
					current,
					total,
					filename,
					status: "failed",
					error: `HTTP ${response.status}`
				});
				continue;
			}
			const contentType = response.headers.get("content-type") || attachment.mimeType || "application/octet-stream";
			const buffer = await response.arrayBuffer();
			const size = buffer.byteLength;
			const contentHash = await computeContentHash(buffer);
			const existing = await repo.findByContentHash(contentHash);
			if (existing) {
				const existingUrl = `/_emdash/api/media/file/${existing.storageKey}`;
				result.urlMap[attachment.url] = existingUrl;
				result.imported.push({
					wpId: attachment.id,
					originalUrl: attachment.url,
					newUrl: existingUrl,
					mediaId: existing.id
				});
				onProgress({
					type: "progress",
					current,
					total,
					filename,
					status: "skipped"
				});
				continue;
			}
			onProgress({
				type: "progress",
				current,
				total,
				filename,
				status: "uploading"
			});
			const id = ulid();
			const ext = attachment.filename ? path$1.extname(attachment.filename) : getExtensionFromMimeType(contentType);
			const storageKey = `${id}${ext}`;
			await storage.upload({
				key: storageKey,
				body: new Uint8Array(buffer),
				contentType
			});
			const enriched = await enrichImageMetadata(new Uint8Array(buffer), contentType);
			const mediaItem = await repo.create({
				filename: attachment.filename || `media-${attachment.id}${ext}`,
				mimeType: contentType,
				size,
				storageKey,
				contentHash,
				width: enriched.width,
				height: enriched.height,
				blurhash: enriched.blurhash,
				dominantColor: enriched.dominantColor
			});
			const newUrl = `/_emdash/api/media/file/${storageKey}`;
			result.imported.push({
				wpId: attachment.id,
				originalUrl: attachment.url,
				newUrl,
				mediaId: mediaItem.id
			});
			result.urlMap[attachment.url] = newUrl;
			onProgress({
				type: "progress",
				current,
				total,
				filename,
				status: "done"
			});
		} catch (error) {
			console.error(`Media import error for "${filename}":`, error);
			const errorMsg = "Failed to import media";
			result.failed.push({
				wpId: attachment.id,
				originalUrl: attachment.url,
				error: errorMsg
			});
			onProgress({
				type: "progress",
				current,
				total,
				filename,
				status: "failed",
				error: errorMsg
			});
		}
	}
	return result;
}
function getExtensionFromMimeType(mimeType) {
	const ext = index_lite_default.getExtension(mimeType);
	return ext ? `.${ext}` : "";
}
//#endregion
export { media_exports as n, importMediaWithProgress as t };
