import { i as formatFileSize, t as CONTENT_TYPE_RE } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import { n as decodeBase64Bytes } from "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import { a as normalizeMime, i as matchesMimeAllowlist, n as computeContentHash } from "./hash-Cb7U1b5M_CHUcNDr6.mjs";
import { t as enrichImageMetadata } from "./enrich-CFJJgxs__9Ib7u08c.mjs";
import { r as ssrfSafeFetch, t as SsrfError } from "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import { t as GLOBAL_UPLOAD_ALLOWLIST } from "./media-allowlist-B7TPD6aq_DajhhggI.mjs";
import * as path$1 from "node:path";
//#region self-essentials/emdash-main/packages/core/dist/media-upload-Bc9Nc5Zf.mjs
/**
* Programmatic media upload handler (MCP `media_upload` tool).
*
* Accepts file bytes as base64 or fetches them from an external URL
* (SSRF-guarded), then runs the same pipeline as the multipart REST
* upload route: allowlist + size validation, content-hash deduplication,
* storage upload, image metadata enrichment, and record creation.
*/
function fail(code, message) {
	return {
		success: false,
		error: {
			code,
			message
		}
	};
}
/** Same relative-URL shape the REST media routes return. */
function withUrl(item) {
	return {
		...item,
		url: `/_emdash/api/media/file/${item.storageKey}`
	};
}
/** Strip parameters from a Content-Type header value (e.g. '; charset=...'). */
function bareMime(headerValue) {
	return (headerValue.split(";")[0] ?? "").trim();
}
/**
* Acquire the file bytes and MIME type from either the base64 payload or
* the external URL. Returns an error result on any validation failure.
*/
async function acquireBytes(input, maxUploadSize) {
	if (input.base64) {
		if (!input.contentType) return fail("VALIDATION_ERROR", "contentType is required when uploading base64 data");
		if (input.base64.length * 3 / 4 > maxUploadSize) return fail("PAYLOAD_TOO_LARGE", `File exceeds maximum size of ${formatFileSize(maxUploadSize)}`);
		try {
			return {
				bytes: decodeBase64Bytes(input.base64),
				mimeType: input.contentType
			};
		} catch {
			return fail("VALIDATION_ERROR", "Invalid base64 data");
		}
	}
	const url = input.url;
	if (!url) return fail("VALIDATION_ERROR", "Provide exactly one of 'base64' or 'url'");
	let response;
	try {
		response = await ssrfSafeFetch(url, { headers: { accept: "*/*" } });
	} catch (error) {
		if (error instanceof SsrfError) return fail("VALIDATION_ERROR", `URL not allowed: ${error.message}`);
		return fail("FETCH_ERROR", "Failed to fetch file from URL");
	}
	if (!response.ok) return fail("FETCH_ERROR", `Failed to fetch file from URL (HTTP ${response.status})`);
	const contentLength = response.headers.get("Content-Length");
	if (contentLength && parseInt(contentLength, 10) > maxUploadSize) return fail("PAYLOAD_TOO_LARGE", `File exceeds maximum size of ${formatFileSize(maxUploadSize)}`);
	const mimeType = input.contentType ?? bareMime(response.headers.get("Content-Type") ?? "");
	if (!mimeType) return fail("VALIDATION_ERROR", "Could not determine MIME type — pass contentType explicitly");
	return {
		bytes: new Uint8Array(await response.arrayBuffer()),
		mimeType
	};
}
/**
* Upload a media file from base64 data or an external URL.
*
* Mirrors the REST `POST /_emdash/api/media` route: global MIME allowlist,
* size limit, content-hash dedupe (returns the existing item with
* `deduplicated: true`), storage upload with cleanup on failure, and
* image metadata enrichment (dimensions, blurhash, dominant color).
*/
async function handleMediaUpload(db, storage, input) {
	if (!input.base64 === !input.url) return fail("VALIDATION_ERROR", "Provide exactly one of 'base64' or 'url'");
	const rawMax = input.maxUploadSize ?? 52428800;
	if (!Number.isFinite(rawMax) || rawMax <= 0) return fail("CONFIGURATION_ERROR", "Invalid maxUploadSize configuration");
	const acquired = await acquireBytes(input, rawMax);
	if ("success" in acquired) return acquired;
	const { bytes } = acquired;
	if (!CONTENT_TYPE_RE.test(acquired.mimeType)) return fail("VALIDATION_ERROR", "Invalid content type");
	const mimeType = normalizeMime(acquired.mimeType);
	if (!matchesMimeAllowlist(mimeType, GLOBAL_UPLOAD_ALLOWLIST)) return fail("INVALID_TYPE", "File type not allowed");
	if (bytes.byteLength > rawMax) return fail("PAYLOAD_TOO_LARGE", `File exceeds maximum size of ${formatFileSize(rawMax)}`);
	try {
		const contentHash = await computeContentHash(bytes);
		const repo = new MediaRepository(db);
		const existing = await repo.findByContentHash(contentHash);
		if (existing) return {
			success: true,
			data: {
				item: withUrl(existing),
				deduplicated: true
			}
		};
		const storageKey = `${ulid()}${path$1.extname(input.filename)}`;
		await storage.upload({
			key: storageKey,
			body: bytes,
			contentType: mimeType
		});
		try {
			const enriched = await enrichImageMetadata(bytes, mimeType);
			return {
				success: true,
				data: { item: withUrl(await repo.create({
					filename: input.filename,
					mimeType,
					size: bytes.byteLength,
					width: enriched.width,
					height: enriched.height,
					alt: input.alt,
					storageKey,
					contentHash,
					blurhash: enriched.blurhash,
					dominantColor: enriched.dominantColor,
					authorId: input.authorId
				})) }
			};
		} catch (error) {
			try {
				await storage.delete(storageKey);
			} catch {}
			throw error;
		}
	} catch {
		return fail("UPLOAD_ERROR", "Upload failed");
	}
}
//#endregion
export { handleMediaUpload };
