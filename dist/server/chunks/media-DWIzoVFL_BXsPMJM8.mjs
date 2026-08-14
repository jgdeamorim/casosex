import { C as string, M as _coercedNumber, _ as number$1, a as _enum, c as array, f as discriminatedUnion, h as literal, j as _coercedBoolean, n as ZodNumber, t as ZodBoolean, v as object, w as union, x as record } from "./schemas_CzTFUUcv.mjs";
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/coerce.js
function number(params) {
	return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return _coercedBoolean(ZodBoolean, params);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/media-DWIzoVFL.mjs
/** Valid role level values */
var VALID_ROLE_LEVELS = /* @__PURE__ */ new Set([
	10,
	20,
	30,
	40,
	50
]);
/** Role level — coerces string/number to valid RoleLevel (10|20|30|40|50) */
var roleLevel = number().int().refine((n) => VALID_ROLE_LEVELS.has(n), { message: "Invalid role level. Must be 10, 20, 30, 40, or 50" });
/** Pagination query params — cursor-based */
var cursorPaginationQuery = object({
	cursor: string().max(2048).optional().meta({ description: "Opaque cursor for pagination" }),
	limit: number().int().min(1).max(100).optional().default(50).meta({ description: "Maximum number of items to return (1-100, default 50)" })
}).meta({ id: "CursorPaginationQuery" });
object({
	limit: number().int().min(1).max(100).optional().default(50),
	offset: number().int().min(0).optional().default(0)
}).meta({ id: "OffsetPaginationQuery" });
/** Slug pattern: lowercase letters, digits, underscores; starts with letter */
var slugPattern = /^[a-z][a-z0-9_]*$/;
/** Matches http(s) scheme at start of URL */
var HTTP_SCHEME_RE = /^https?:\/\//i;
/** Validates that a URL string uses http or https scheme. Rejects javascript:/data: URI XSS vectors. */
var httpUrl = string().url().refine((url) => HTTP_SCHEME_RE.test(url), "URL must use http or https");
/**
* BCP 47 locale code — language with optional script/region subtags (e.g. en, en-US, pt-BR, es-419, zh-Hant).
* Validation is case-insensitive, but the value is preserved verbatim because the site config, stored
* `locale` columns, and public query path all keep the raw BCP-47 casing.
*/
var localeCode = string().regex(/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i, "Invalid locale code");
/** Shared `?locale=xx` query shape for endpoints that filter by locale. */
var localeFilterQuery = object({ locale: localeCode.optional() }).meta({ id: "LocaleFilterQuery" });
object({
	success: literal(false).meta({ description: "Discriminant: always false for errors" }),
	error: object({
		code: string().meta({
			description: "Machine-readable error code",
			example: "NOT_FOUND"
		}),
		message: string().meta({ description: "Human-readable error message" })
	})
}).meta({ id: "ApiError" });
object({ deleted: literal(true) }).meta({ id: "DeleteResponse" });
object({ count: number$1().int().min(0) }).meta({ id: "CountResponse" });
var mediaUsageCoverageStatusSchema = _enum([
	"complete",
	"never",
	"running",
	"partial",
	"failed",
	"stale",
	"unknown"
]).meta({ id: "MediaUsageCoverageStatus" });
var mediaUsageCoverageSchema = object({
	scope: literal("all_content_collections"),
	status: mediaUsageCoverageStatusSchema
}).meta({ id: "MediaUsageCoverage" });
var mediaUsageSummarySchema = object({
	count: number$1().int().min(0).nullable(),
	coverage: mediaUsageCoverageSchema
}).meta({ id: "MediaUsageSummary" });
var mediaUsageDetailsQuery = object({
	cursor: string().min(1).max(2048).optional().meta({ description: "Opaque content-entry-group cursor" }),
	limit: number().int().min(1).max(100).optional().default(50).meta({ description: "Maximum number of content entry groups to return (1-100, default 50)" })
});
var mediaUsageOccurrenceDetailSchema = object({
	fieldSlug: string(),
	fieldPath: string(),
	occurrenceIndex: number$1().int().min(0),
	referenceType: _enum([
		"image_field",
		"file_field",
		"portable_text_image",
		"unknown"
	])
}).meta({ id: "MediaUsageOccurrenceDetail" });
var mediaUsageSourceDetailSchema = object({
	variant: _enum(["columns", "draft_overlay"]),
	occurrences: array(mediaUsageOccurrenceDetailSchema)
}).meta({ id: "MediaUsageSourceDetail" });
var mediaUsageEntryDetailSchema = object({
	collection: string(),
	contentId: string(),
	title: string().nullable(),
	slug: string().nullable(),
	locale: string().nullable(),
	status: string().nullable(),
	scheduledAt: string().nullable(),
	deletedAt: string().nullable(),
	sources: array(mediaUsageSourceDetailSchema)
}).meta({ id: "MediaUsageEntryDetail" });
object({
	items: array(mediaUsageEntryDetailSchema),
	nextCursor: string().optional(),
	coverage: mediaUsageCoverageSchema
}).meta({ id: "MediaUsageDetailsResponse" });
var mediaUsageRepairStatusSchema = _enum([
	"complete",
	"partial",
	"failed",
	"stale"
]).meta({ id: "MediaUsageRepairStatus" });
var mediaUsageRepairCollectionBody = object({
	scope: literal("collection"),
	collection: string().min(1).max(63).regex(slugPattern, "Invalid collection slug")
}).strict();
var mediaUsageRepairAllBody = object({ scope: literal("all") }).strict();
var mediaUsageRepairBody = discriminatedUnion("scope", [mediaUsageRepairCollectionBody, mediaUsageRepairAllBody]).meta({ id: "MediaUsageRepairBody" });
var mediaUsageRepairCollectionSummarySchema = object({
	collection: string(),
	status: mediaUsageRepairStatusSchema,
	indexedSourceCount: number$1().int().min(0),
	failedSourceCount: number$1().int().min(0),
	skippedSourceCount: number$1().int().min(0),
	deletedSourceCount: number$1().int().min(0),
	lastErrorCode: string().nullable(),
	startedAt: string(),
	completedAt: string().nullable()
}).meta({ id: "MediaUsageRepairCollectionSummary" });
object({
	status: mediaUsageRepairStatusSchema,
	indexedSourceCount: number$1().int().min(0),
	failedSourceCount: number$1().int().min(0),
	skippedSourceCount: number$1().int().min(0),
	deletedSourceCount: number$1().int().min(0),
	collections: array(mediaUsageRepairCollectionSummarySchema)
}).meta({ id: "MediaUsageRepairResponse" });
/**
* Accepts a comma-separated string (from URL query params) or an array of
* strings (from JSON body or programmatic use) and normalises to string[].
*/
var mimeTypeFilter = union([string(), array(string())]).transform((v) => {
	return (Array.isArray(v) ? v : v.split(",")).map((s) => s.trim()).filter((s) => s.length > 0);
}).optional();
var mediaListQuery = cursorPaginationQuery.extend({
	mimeType: mimeTypeFilter,
	q: string().trim().min(1).max(200).optional(),
	includeUsage: literal("1").optional().meta({ description: "Include a coverage-aware usage summary on each media item" })
}).meta({ id: "MediaListQuery" });
var mediaGetQuery = object({ includeUsage: literal("1").optional().meta({ description: "Include a coverage-aware usage summary on the media item" }) }).meta({ id: "MediaGetQuery" });
var mediaUpdateBody = object({
	alt: string().optional(),
	caption: string().optional(),
	width: number$1().int().positive().optional(),
	height: number$1().int().positive().optional()
}).meta({ id: "MediaUpdateBody" });
/** Default maximum allowed file upload size (50 MB). */
var DEFAULT_MAX_UPLOAD_SIZE = 52428800;
function formatFileSize(bytes) {
	if (bytes < 1024) return `${bytes}B`;
	if (bytes < 1048576) return `${Math.floor(bytes / 1024)}KB`;
	return `${Math.floor(bytes / 1024 / 1024)}MB`;
}
var CONTENT_TYPE_RE = /^[a-z0-9][a-z0-9!#$&^_+\-.]*\/[a-z0-9!#$&^_+\-.]+(\s*;[^\r\n]*)?$/i;
function mediaUploadUrlBody(maxSize) {
	if (!Number.isFinite(maxSize) || maxSize <= 0) throw new Error(`EmDash: maxUploadSize must be a positive finite number, got ${maxSize}`);
	return object({
		filename: string().min(1, "filename is required"),
		contentType: string().min(1, "contentType is required").regex(CONTENT_TYPE_RE, "Invalid content type"),
		size: number$1().int().nonnegative().max(maxSize, `File size must not exceed ${formatFileSize(maxSize)}`),
		contentHash: string().optional(),
		fieldId: string().optional()
	}).meta({ id: "MediaUploadUrlBody" });
}
var mediaConfirmBody = object({
	size: number$1().int().nonnegative().optional(),
	width: number$1().int().positive().optional(),
	height: number$1().int().positive().optional()
}).meta({ id: "MediaConfirmBody" });
cursorPaginationQuery.extend({
	query: string().optional(),
	mimeType: mimeTypeFilter
}).meta({ id: "MediaProviderListQuery" });
var mediaStatusSchema = _enum([
	"pending",
	"ready",
	"failed"
]);
var mediaItemSchema = object({
	id: string(),
	filename: string(),
	mimeType: string(),
	size: number$1().nullable(),
	width: number$1().nullable(),
	height: number$1().nullable(),
	alt: string().nullable(),
	caption: string().nullable(),
	storageKey: string(),
	status: mediaStatusSchema,
	contentHash: string().nullable(),
	blurhash: string().nullable(),
	dominantColor: string().nullable(),
	createdAt: string(),
	authorId: string().nullable()
}).meta({ id: "MediaItem" });
object({ item: mediaItemSchema }).meta({ id: "MediaResponse" });
var mediaReadItemSchema = mediaItemSchema.extend({ usage: mediaUsageSummarySchema.optional() }).meta({ id: "MediaReadItem" });
object({ item: mediaReadItemSchema }).meta({ id: "MediaReadResponse" });
var mediaListReadItemSchema = mediaReadItemSchema.extend({ url: string() }).meta({ id: "MediaListReadItem" });
object({
	items: array(mediaListReadItemSchema),
	nextCursor: string().optional()
}).meta({ id: "MediaListReadResponse" });
object({
	items: array(mediaItemSchema),
	nextCursor: string().optional()
}).meta({ id: "MediaListResponse" });
object({
	uploadUrl: string(),
	method: literal("PUT"),
	headers: record(string(), string()),
	mediaId: string(),
	storageKey: string(),
	expiresAt: string()
}).meta({ id: "MediaUploadUrlResponse" });
object({
	existing: literal(true),
	mediaId: string(),
	storageKey: string(),
	url: string()
}).meta({ id: "MediaExistingResponse" });
object({ item: mediaItemSchema.extend({ url: string() }) }).meta({ id: "MediaConfirmResponse" });
object({
	uploaded: literal(true),
	size: number$1().int().nonnegative()
}).meta({ id: "MediaStreamUploadResponse" });
//#endregion
export { boolean as _, httpUrl as a, mediaConfirmBody as c, mediaUpdateBody as d, mediaUploadUrlBody as f, slugPattern as g, roleLevel as h, formatFileSize as i, mediaGetQuery as l, mediaUsageRepairBody as m, DEFAULT_MAX_UPLOAD_SIZE as n, localeCode as o, mediaUsageDetailsQuery as p, cursorPaginationQuery as r, localeFilterQuery as s, CONTENT_TYPE_RE as t, mediaListQuery as u, number as v };
