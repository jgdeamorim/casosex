import { C as string, D as date, O as datetime, T as unknown, _ as number, a as _enum, c as array, h as literal, l as boolean, m as lazy, o as _null, s as any, v as object, w as union, x as record } from "./schemas_CzTFUUcv.mjs";
import { _ as boolean$1, a as httpUrl, g as slugPattern$1, h as roleLevel, o as localeCode, r as cursorPaginationQuery, v as number$1 } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import { i as RESERVED_BYLINE_FIELD_SLUGS } from "./types-o7xo7VgH_Bdv_7eeq.mjs";
//#region self-essentials/emdash-main/packages/core/dist/status-COfycGIU.mjs
/**
* Redirect rule status codes.
*
* A redirect rule's `type` is either a *redirect* status (issues a `Location`
* header) or a *terminal* status (serves the status with no target). Terminal
* statuses let editors mark a URL as intentionally gone:
* - `410 Gone` — permanently and intentionally deleted (Google deindexes it
*   faster than a 404).
* - `451 Unavailable For Legal Reasons`.
*/
/** Statuses that issue an HTTP redirect (require a destination). */
var REDIRECT_STATUSES = [
	301,
	302,
	307,
	308
];
/** Terminal statuses that serve a status with no `Location` / no destination. */
var TERMINAL_STATUSES = [410, 451];
/** All values accepted as a redirect rule `type`. */
var REDIRECT_RULE_STATUSES = [...REDIRECT_STATUSES, ...TERMINAL_STATUSES];
/** True for terminal statuses (410/451) — served directly, with no target. */
function isTerminalStatus(type) {
	return TERMINAL_STATUSES.includes(type);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/redirects-BOn2DIUs.mjs
/** Slug pattern: lowercase letters, digits, and hyphens; must start with a letter */
var bylineSlugPattern = /^[a-z][a-z0-9-]*$/;
var bylineSummarySchema = object({
	id: string(),
	slug: string(),
	displayName: string(),
	bio: string().nullable(),
	avatarMediaId: string().nullable(),
	avatarStorageKey: string().nullish(),
	avatarAlt: string().nullish(),
	avatarBlurhash: string().nullish(),
	avatarDominantColor: string().nullish(),
	websiteUrl: string().nullable(),
	userId: string().nullable(),
	isGuest: boolean(),
	createdAt: string(),
	updatedAt: string(),
	locale: string(),
	translationGroup: string().nullable(),
	customFields: record(string(), union([
		string(),
		boolean(),
		_null()
	])).optional()
}).meta({ id: "BylineSummary" });
var bylineCreditSchema = object({
	byline: bylineSummarySchema,
	sortOrder: number().int(),
	roleLabel: string().nullable(),
	source: _enum(["explicit", "inferred"]).optional().meta({ description: "Whether this credit was explicitly assigned or inferred from authorId" })
}).meta({ id: "BylineCredit" });
var contentBylineInputSchema = object({
	bylineId: string().min(1),
	roleLabel: string().nullish()
}).meta({ id: "ContentBylineInput" });
var bylinesListQuery = cursorPaginationQuery.extend({
	search: string().optional(),
	isGuest: boolean$1().optional(),
	userId: string().optional(),
	locale: localeCode.optional()
}).meta({ id: "BylinesListQuery" });
var bylineCreateBody = object({
	slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens"),
	displayName: string().min(1),
	bio: string().nullish(),
	avatarMediaId: string().nullish(),
	websiteUrl: httpUrl.nullish(),
	userId: string().nullish(),
	isGuest: boolean().optional(),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional(),
	customFields: record(string(), unknown()).optional()
}).meta({ id: "BylineCreateBody" });
var bylineTranslationCreateBody = object({
	locale: localeCode,
	slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens").optional(),
	displayName: string().min(1).optional(),
	bio: string().nullish(),
	avatarMediaId: string().nullish(),
	websiteUrl: httpUrl.nullish()
}).meta({ id: "BylineTranslationCreateBody" });
object({ items: array(bylineSummarySchema) }).meta({ id: "BylineTranslationsResponse" });
var bylineUpdateBody = object({
	slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens").optional(),
	displayName: string().min(1).optional(),
	bio: string().nullish(),
	avatarMediaId: string().nullish(),
	websiteUrl: httpUrl.nullish(),
	userId: string().nullish(),
	isGuest: boolean().optional(),
	customFields: record(string(), unknown()).optional()
}).meta({ id: "BylineUpdateBody" });
object({
	items: array(bylineSummarySchema),
	nextCursor: string().optional()
}).meta({ id: "BylineListResponse" });
/** SEO input — per-content meta fields */
var contentSeoInput = object({
	title: string().max(200).nullish(),
	description: string().max(500).nullish(),
	image: string().nullish(),
	canonical: httpUrl.nullish(),
	noIndex: boolean().optional()
}).meta({ id: "ContentSeoInput" });
/** ISO 8601 date or datetime bound for the content-list date range filter. */
var contentDateBound = union([datetime({
	offset: true,
	message: "must be an ISO 8601 datetime"
}), date({ message: "must be an ISO 8601 date" })]).optional();
var contentListQuery = cursorPaginationQuery.extend({
	status: string().optional(),
	orderBy: string().optional(),
	order: _enum(["asc", "desc"]).optional(),
	locale: localeCode.optional(),
	q: string().trim().min(1).max(200).optional(),
	authorId: string().min(1).max(64).optional(),
	dateField: _enum([
		"createdAt",
		"updatedAt",
		"publishedAt"
	]).optional(),
	dateFrom: contentDateBound,
	dateTo: contentDateBound
}).meta({ id: "ContentListQuery" });
/** ISO 8601 datetime for `publishedAt` / `createdAt`. Routes gate writes behind `content:publish_any`. */
var contentDateOverride = datetime({
	offset: true,
	message: "must be an ISO 8601 datetime"
}).nullish();
var contentCreateBody = object({
	data: record(string(), unknown()),
	slug: string().nullish(),
	status: _enum(["draft"]).optional(),
	bylines: array(contentBylineInputSchema).optional(),
	locale: localeCode.optional(),
	translationOf: string().optional(),
	seo: contentSeoInput.optional(),
	taxonomies: record(string(), array(string())).optional().meta({ description: "Taxonomy term assignments as { taxonomyName: [termSlug, ...] }, resolved in the entry's locale." }),
	publishedAt: contentDateOverride,
	createdAt: contentDateOverride
}).meta({ id: "ContentCreateBody" });
var contentUpdateBody = object({
	data: record(string(), unknown()).optional(),
	slug: string().nullish(),
	status: _enum(["draft"]).optional(),
	authorId: string().nullish(),
	bylines: array(contentBylineInputSchema).optional(),
	_rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" }),
	skipRevision: boolean().optional(),
	seo: contentSeoInput.optional(),
	taxonomies: record(string(), array(string())).optional().meta({ description: "Replace taxonomy assignments as { taxonomyName: [termSlug, ...] }. Only named taxonomies are touched; pass an empty array to clear a taxonomy." }),
	publishedAt: contentDateOverride
}).meta({ id: "ContentUpdateBody" });
var contentScheduleBody = object({ scheduledAt: string().min(1, "scheduledAt is required").meta({
	description: "ISO 8601 datetime for scheduled publishing",
	example: "2025-06-15T09:00:00Z"
}) }).meta({ id: "ContentScheduleBody" });
var contentPublishBody = object({ publishedAt: datetime({
	offset: true,
	message: "must be an ISO 8601 datetime"
}).optional().meta({ description: "Optional ISO 8601 datetime to backdate the publish (e.g. when migrating content). Requires content:publish_any permission. Without this, existing published_at is preserved on re-publish." }) }).meta({ id: "ContentPublishBody" });
var contentPreviewUrlBody = object({
	expiresIn: union([string(), number()]).optional(),
	pathPattern: string().optional()
}).meta({ id: "ContentPreviewUrlBody" });
var contentTermsBody = object({ termIds: array(string()) }).meta({ id: "ContentTermsBody" });
var contentTrashQuery = cursorPaginationQuery;
/** SEO metadata on a content item */
var contentSeoSchema = object({
	title: string().nullable(),
	description: string().nullable(),
	image: string().nullable(),
	canonical: string().nullable(),
	noIndex: boolean()
}).meta({ id: "ContentSeo" });
/** A single content item as returned by the API */
var contentItemSchema = object({
	id: string(),
	type: string().meta({ description: "Collection slug this item belongs to" }),
	slug: string().nullable(),
	status: string().meta({ description: "draft, published, or scheduled" }),
	data: record(string(), unknown()).meta({ description: "User-defined field values" }),
	authorId: string().nullable(),
	primaryBylineId: string().nullable(),
	byline: bylineSummarySchema.nullable().optional(),
	bylines: array(bylineCreditSchema).optional(),
	createdAt: string(),
	updatedAt: string(),
	publishedAt: string().nullable(),
	scheduledAt: string().nullable(),
	liveRevisionId: string().nullable(),
	draftRevisionId: string().nullable(),
	version: number().int(),
	locale: string().nullable(),
	translationGroup: string().nullable(),
	seo: contentSeoSchema.optional()
}).meta({ id: "ContentItem" });
object({
	item: contentItemSchema,
	_rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" })
}).meta({ id: "ContentResponse" });
object({
	items: array(contentItemSchema),
	nextCursor: string().optional(),
	total: number().int().nonnegative().optional()
}).meta({ id: "ContentListResponse" });
/** A distinct content author for the admin author filter */
var contentAuthorSchema = object({
	id: string(),
	name: string().nullable(),
	email: string(),
	avatarUrl: string().nullable()
}).meta({ id: "ContentAuthor" });
object({ items: array(contentAuthorSchema) }).meta({ id: "ContentAuthorsResponse" });
/** Trashed content item */
var trashedContentItemSchema = object({
	id: string(),
	type: string(),
	slug: string().nullable(),
	status: string(),
	data: record(string(), unknown()),
	authorId: string().nullable(),
	createdAt: string(),
	updatedAt: string(),
	publishedAt: string().nullable(),
	deletedAt: string()
}).meta({ id: "TrashedContentItem" });
object({
	items: array(trashedContentItemSchema),
	nextCursor: string().optional()
}).meta({ id: "TrashedContentListResponse" });
object({
	hasChanges: boolean(),
	live: record(string(), unknown()).nullable(),
	draft: record(string(), unknown()).nullable()
}).meta({ id: "ContentCompareResponse" });
/** Translation summary for a content item */
var contentTranslationSchema = object({
	id: string(),
	locale: string().nullable(),
	slug: string().nullable(),
	status: string(),
	updatedAt: string()
});
object({
	translationGroup: string(),
	translations: array(contentTranslationSchema)
}).meta({ id: "ContentTranslationsResponse" });
var collectionSupportValues = _enum([
	"drafts",
	"revisions",
	"preview",
	"scheduling",
	"search"
]);
var collectionSourcePattern = /^(template:.+|import:.+|manual|discovered|seed)$/;
var fieldTypeValues = _enum([
	"string",
	"text",
	"url",
	"number",
	"integer",
	"boolean",
	"datetime",
	"select",
	"multiSelect",
	"portableText",
	"image",
	"file",
	"reference",
	"json",
	"slug",
	"repeater"
]);
var repeaterSubFieldSchema = object({
	slug: string().min(1).max(63).regex(slugPattern$1, "Invalid slug format"),
	type: _enum([
		"string",
		"text",
		"url",
		"number",
		"integer",
		"boolean",
		"datetime",
		"select",
		"image"
	]),
	label: string().min(1),
	required: boolean().optional(),
	options: array(string()).optional()
});
var fieldValidation = object({
	required: boolean().optional(),
	min: number().optional(),
	max: number().optional(),
	minLength: number().int().min(0).optional(),
	maxLength: number().int().min(0).optional(),
	pattern: string().optional(),
	options: array(string()).optional(),
	subFields: array(repeaterSubFieldSchema).min(1).optional(),
	minItems: number().int().min(0).optional(),
	maxItems: number().int().min(1).optional(),
	allowedMimeTypes: array(string().regex(/^[a-z0-9][a-z0-9!#$&^_+\-.]*\/[a-z0-9!#$&^_+\-.]*$/i, "Invalid MIME type")).min(1, "allowedMimeTypes must not be empty — omit the field to allow all types").max(64, "allowedMimeTypes may contain at most 64 entries").optional()
}).optional();
var fieldWidgetOptions = record(string(), unknown()).optional();
var createCollectionBody = object({
	slug: string().min(1).max(63).regex(slugPattern$1, "Invalid slug format"),
	label: string().min(1),
	labelSingular: string().optional(),
	description: string().optional(),
	icon: string().optional(),
	supports: array(collectionSupportValues).optional(),
	source: string().regex(collectionSourcePattern).optional(),
	urlPattern: string().optional(),
	hasSeo: boolean().optional()
}).meta({ id: "CreateCollectionBody" });
var updateCollectionBody = object({
	label: string().min(1).optional(),
	labelSingular: string().optional(),
	description: string().optional(),
	icon: string().optional(),
	supports: array(collectionSupportValues).optional(),
	urlPattern: string().nullish(),
	hasSeo: boolean().optional(),
	commentsEnabled: boolean().optional(),
	commentsModeration: _enum([
		"all",
		"first_time",
		"none"
	]).optional(),
	commentsClosedAfterDays: number().int().min(0).optional(),
	commentsAutoApproveUsers: boolean().optional()
}).meta({ id: "UpdateCollectionBody" });
var createFieldBody = object({
	slug: string().min(1).max(63).regex(slugPattern$1, "Invalid slug format"),
	label: string().min(1),
	type: fieldTypeValues,
	required: boolean().optional(),
	unique: boolean().optional(),
	defaultValue: unknown().optional(),
	validation: fieldValidation.nullable(),
	widget: string().optional(),
	options: fieldWidgetOptions,
	sortOrder: number().int().min(0).optional(),
	searchable: boolean().optional(),
	translatable: boolean().optional()
}).meta({ id: "CreateFieldBody" });
var updateFieldBody = object({
	label: string().min(1).optional(),
	type: fieldTypeValues.optional(),
	required: boolean().optional(),
	unique: boolean().optional(),
	defaultValue: unknown().optional(),
	validation: fieldValidation.nullable(),
	widget: string().optional(),
	options: fieldWidgetOptions,
	sortOrder: number().int().min(0).optional(),
	searchable: boolean().optional(),
	translatable: boolean().optional()
}).meta({ id: "UpdateFieldBody" });
var fieldReorderBody = object({ fieldSlugs: array(string().min(1)) }).meta({ id: "FieldReorderBody" });
var orphanRegisterBody = object({
	label: string().optional(),
	labelSingular: string().optional(),
	description: string().optional()
}).meta({ id: "OrphanRegisterBody" });
object({ format: string().optional() });
var collectionGetQuery = object({ includeFields: string().transform((v) => v === "true").optional() });
var collectionSchema = object({
	id: string(),
	slug: string(),
	label: string(),
	labelSingular: string().nullable(),
	description: string().nullable(),
	icon: string().nullable(),
	supports: array(string()),
	source: string().nullable(),
	urlPattern: string().nullable(),
	hasSeo: boolean(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Collection" });
var fieldSchema = object({
	id: string(),
	collectionId: string(),
	slug: string(),
	label: string(),
	type: fieldTypeValues,
	required: boolean(),
	unique: boolean(),
	defaultValue: unknown().nullable(),
	validation: record(string(), unknown()).nullable(),
	widget: string().nullable(),
	options: record(string(), unknown()).nullable(),
	sortOrder: number().int(),
	searchable: boolean(),
	translatable: boolean(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Field" });
object({ item: collectionSchema }).meta({ id: "CollectionResponse" });
object({ item: collectionSchema.extend({ fields: array(fieldSchema) }) }).meta({ id: "CollectionWithFieldsResponse" });
object({ items: array(collectionSchema) }).meta({ id: "CollectionListResponse" });
object({ item: fieldSchema }).meta({ id: "FieldResponse" });
object({ items: array(fieldSchema) }).meta({ id: "FieldListResponse" });
var orphanedTableSchema = object({
	slug: string(),
	tableName: string(),
	rowCount: number().int()
}).meta({ id: "OrphanedTable" });
object({ items: array(orphanedTableSchema) }).meta({ id: "OrphanedTableListResponse" });
var createCommentBody = object({
	authorName: string().min(1).max(100),
	authorEmail: string().email(),
	body: string().min(1).max(5e3),
	parentId: string().optional(),
	website_url: string().optional(),
	turnstileToken: string().max(2048).optional()
}).meta({ id: "CreateCommentBody" });
var createReactionBody = object({
	commentId: string().min(1),
	reaction: string().min(1).max(20).default("like"),
	website_url: string().optional()
}).meta({ id: "CreateReactionBody" });
var commentStatusBody = object({ status: _enum([
	"approved",
	"pending",
	"spam",
	"trash"
]) }).meta({ id: "CommentStatusBody" });
var commentBulkBody = object({
	ids: array(string().min(1)).min(1).max(100),
	action: _enum([
		"approve",
		"spam",
		"trash",
		"delete"
	])
}).meta({ id: "CommentBulkBody" });
var commentListQuery = object({
	status: _enum([
		"pending",
		"approved",
		"spam",
		"trash"
	]).optional(),
	collection: string().optional(),
	search: string().optional(),
	limit: number$1().int().min(1).max(100).optional().default(50),
	cursor: string().max(2048).optional()
}).meta({ id: "CommentListQuery" });
var commentStatusValues = _enum([
	"pending",
	"approved",
	"spam",
	"trash"
]);
/**
* Public-facing comment (no email/IP).
*
* `replies` is recursive in practice (each reply can have replies), but we
* model it as a single level here to avoid circular type inference issues
* with tsgo. OpenAPI consumers should treat replies as the same shape.
*/
var publicCommentSchema = object({
	id: string(),
	authorName: string(),
	isRegisteredUser: boolean(),
	body: string(),
	parentId: string().nullable(),
	createdAt: string(),
	replies: array(any()).optional()
}).meta({ id: "PublicComment" });
/** Admin comment with full details */
var commentSchema = object({
	id: string(),
	collection: string(),
	contentId: string(),
	authorName: string(),
	authorEmail: string(),
	body: string(),
	status: commentStatusValues,
	parentId: string().nullable(),
	ipHash: string().nullable(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Comment" });
object({
	items: array(publicCommentSchema),
	nextCursor: string().optional(),
	total: number().int()
}).meta({ id: "PublicCommentListResponse" });
object({
	items: array(commentSchema),
	nextCursor: string().optional()
}).meta({ id: "AdminCommentListResponse" });
object({
	pending: number().int(),
	approved: number().int(),
	spam: number().int(),
	trash: number().int()
}).meta({ id: "CommentCountsResponse" });
object({ affected: number().int() }).meta({ id: "CommentBulkResponse" });
/**
* URL scheme validation utilities
*
* Prevents XSS via dangerous URL schemes (javascript:, data:, vbscript:, etc.)
* by allowlisting known-safe schemes before rendering into href attributes.
*/
/**
* Matches URLs that are safe to render in href attributes.
*
* Allowed:
* - http:// and https://
* - mailto: and tel:
* - Relative paths (starting with /)
* - Fragment links (starting with #)
* - Protocol-relative URLs are NOT allowed (starting with //) as they can
*   redirect to attacker-controlled hosts.
*/
var SAFE_URL_SCHEME_RE = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;
/**
* Returns the URL unchanged if it uses a safe scheme, otherwise returns "#".
*
* Use this at the render layer as the primary defense against XSS via
* dangerous URL schemes like `javascript:`, `data:`, or `vbscript:`.
*
* @example
* ```ts
* sanitizeHref("https://example.com")        // "https://example.com"
* sanitizeHref("/about")                      // "/about"
* sanitizeHref("#section")                    // "#section"
* sanitizeHref("mailto:a@b.com")              // "mailto:a@b.com"
* sanitizeHref("javascript:alert(1)")         // "#"
* sanitizeHref("data:text/html,<script>")     // "#"
* sanitizeHref("")                            // "#"
* ```
*/
function sanitizeHref(url) {
	if (!url) return "#";
	return SAFE_URL_SCHEME_RE.test(url) ? url : "#";
}
/**
* Returns true if the URL uses a safe scheme for rendering in href attributes.
*/
function isSafeHref(url) {
	return SAFE_URL_SCHEME_RE.test(url);
}
/**
* Allowed menu item types. `custom` uses `customUrl`; the others resolve a URL
* from `referenceCollection` + `referenceId` (a translation_group id).
*/
var menuItemTypeEnum = _enum([
	"custom",
	"page",
	"post",
	"taxonomy",
	"collection"
]);
var safeHref = string().trim().refine(isSafeHref, "URL must use http, https, mailto, tel, a relative path, or a fragment identifier");
var createMenuBody = object({
	name: string().min(1),
	label: string().min(1),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).strict().meta({ id: "CreateMenuBody" });
var updateMenuBody = object({ label: string().min(1).optional() }).strict().meta({ id: "UpdateMenuBody" });
var createMenuItemBody = object({
	type: menuItemTypeEnum,
	label: string().min(1),
	referenceCollection: string().optional(),
	referenceId: string().optional(),
	customUrl: safeHref.optional(),
	target: string().optional(),
	titleAttr: string().optional(),
	cssClasses: string().optional(),
	parentId: string().optional(),
	sortOrder: number().int().min(0).optional()
}).strict().meta({ id: "CreateMenuItemBody" });
var updateMenuItemBody = object({
	label: string().min(1).optional(),
	customUrl: safeHref.optional(),
	target: string().optional(),
	titleAttr: string().optional(),
	cssClasses: string().optional(),
	parentId: string().nullish(),
	sortOrder: number().int().min(0).optional()
}).strict().meta({ id: "UpdateMenuItemBody" });
var reorderMenuItemsBody = object({ items: array(object({
	id: string().min(1),
	parentId: string().nullable(),
	sortOrder: number().int().min(0)
})) }).meta({ id: "ReorderMenuItemsBody" });
var menuSchema = object({
	id: string(),
	name: string(),
	label: string(),
	createdAt: string(),
	updatedAt: string(),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "Menu" });
var menuItemSchema = object({
	id: string(),
	menuId: string(),
	parentId: string().nullable(),
	sortOrder: number().int(),
	type: string(),
	referenceCollection: string().nullable(),
	referenceId: string().nullable(),
	customUrl: string().nullable(),
	label: string(),
	titleAttr: string().nullable(),
	target: string().nullable(),
	cssClasses: string().nullable(),
	createdAt: string(),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "MenuItem" });
object({
	translationGroup: string().nullable(),
	translations: array(object({
		id: string(),
		name: string(),
		label: string(),
		locale: string(),
		updatedAt: string()
	}))
}).meta({ id: "MenuTranslations" });
menuSchema.extend({ itemCount: number().int() }).meta({ id: "MenuListItem" });
menuSchema.extend({ items: array(menuItemSchema) }).meta({ id: "MenuWithItems" });
var createTaxonomyDefBody = object({
	name: string().min(1).max(63).regex(/^[a-z][a-z0-9_]*$/, "Name must be lowercase alphanumeric with underscores"),
	label: string().min(1).max(200),
	labelSingular: string().min(1).max(200).optional(),
	hierarchical: boolean().optional().default(false),
	collections: array(string().min(1).max(63).regex(/^[a-z][a-z0-9_]*$/, "Invalid collection slug format")).max(100).optional().default([]),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).meta({ id: "CreateTaxonomyDefBody" });
var createTermBody = object({
	slug: string().min(1),
	label: string().min(1),
	parentId: string().nullish(),
	description: string().optional(),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).meta({ id: "CreateTermBody" });
var updateTermBody = object({
	slug: string().min(1).optional(),
	label: string().min(1).optional(),
	parentId: string().nullish(),
	description: string().optional()
}).meta({ id: "UpdateTermBody" });
var termListQuery = object({
	locale: localeCode.optional(),
	includeCounts: _enum(["true", "false"]).transform((v) => v === "true").optional().default(true).meta({ description: "Include each term's visible-usage count. Pass false to skip the aggregate; `count` is then absent from every term." })
}).meta({ id: "TermListQuery" });
var taxonomyDefSchema = object({
	id: string(),
	name: string(),
	label: string(),
	labelSingular: string().optional(),
	hierarchical: boolean(),
	collections: array(string()),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "TaxonomyDef" });
object({
	translationGroup: string().nullable(),
	translations: array(object({
		id: string(),
		name: string(),
		label: string(),
		locale: string()
	}))
}).meta({ id: "TaxonomyDefTranslations" });
object({ taxonomies: array(taxonomyDefSchema) }).meta({ id: "TaxonomyListResponse" });
var termSchema = object({
	id: string(),
	name: string(),
	slug: string(),
	label: string(),
	parentId: string().nullable(),
	description: string().optional(),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "Term" });
object({
	translationGroup: string().nullable(),
	translations: array(object({
		id: string(),
		slug: string(),
		label: string(),
		locale: string()
	}))
}).meta({ id: "TermTranslations" });
var termWithCountSchema = object({
	id: string(),
	name: string(),
	slug: string(),
	label: string(),
	parentId: string().nullable(),
	description: string().optional(),
	count: number().int().optional(),
	children: array(lazy(() => termWithCountSchema)),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "TermWithCount" });
object({ terms: array(termWithCountSchema) }).meta({ id: "TermListResponse" });
object({ term: termSchema }).meta({ id: "TermResponse" });
object({ term: termSchema.extend({
	count: number().int(),
	children: array(object({
		id: string(),
		slug: string(),
		label: string()
	}))
}) }).meta({ id: "TermGetResponse" });
var sectionSource = _enum([
	"theme",
	"user",
	"import"
]);
var sectionsListQuery = object({
	source: sectionSource.optional(),
	search: string().optional(),
	limit: number$1().int().min(1).max(100).optional().default(50),
	cursor: string().max(2048).optional()
}).meta({ id: "SectionsListQuery" });
var createSectionBody = object({
	slug: string().min(1),
	title: string().min(1),
	description: string().optional(),
	keywords: array(string()).optional(),
	content: array(record(string(), unknown())),
	previewMediaId: string().optional(),
	source: _enum(["user", "import"]).optional(),
	themeId: string().optional()
}).meta({ id: "CreateSectionBody" });
var updateSectionBody = object({
	slug: string().min(1).optional(),
	title: string().min(1).optional(),
	description: string().optional(),
	keywords: array(string()).optional(),
	content: array(record(string(), unknown())).optional(),
	previewMediaId: string().nullish()
}).meta({ id: "UpdateSectionBody" });
var sectionSchema = object({
	id: string(),
	slug: string(),
	title: string(),
	description: string().nullable(),
	keywords: array(string()).nullable(),
	content: array(record(string(), unknown())),
	previewMediaId: string().nullable(),
	source: string(),
	themeId: string().nullable(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Section" });
object({
	items: array(sectionSchema),
	nextCursor: string().optional()
}).meta({ id: "SectionListResponse" });
var mediaReferenceInput = object({
	mediaId: string(),
	alt: string().optional()
});
var socialSettings = object({
	twitter: string().optional(),
	github: string().optional(),
	facebook: string().optional(),
	instagram: string().optional(),
	linkedin: string().optional(),
	youtube: string().optional()
});
var seoSettingsInput = object({
	titleSeparator: string().max(10).optional(),
	defaultOgImage: mediaReferenceInput.optional(),
	robotsTxt: string().max(5e3).optional(),
	googleVerification: string().max(100).optional(),
	bingVerification: string().max(100).optional()
});
var settingsUpdateBody = object({
	title: string().optional(),
	tagline: string().optional(),
	logo: mediaReferenceInput.optional(),
	favicon: mediaReferenceInput.optional(),
	url: union([httpUrl, literal("")]).optional(),
	postsPerPage: number().int().min(1).max(100).optional(),
	dateFormat: string().optional(),
	timezone: string().optional(),
	social: socialSettings.optional(),
	seo: seoSettingsInput.optional()
}).meta({ id: "SettingsUpdateBody" });
var mediaReferenceResponse = object({
	mediaId: string(),
	alt: string().optional(),
	url: string().optional(),
	contentType: string().optional(),
	width: number().int().optional(),
	height: number().int().optional()
});
var seoSettingsResponse = object({
	titleSeparator: string().max(10).optional(),
	defaultOgImage: mediaReferenceResponse.optional(),
	robotsTxt: string().max(5e3).optional(),
	googleVerification: string().max(100).optional(),
	bingVerification: string().max(100).optional()
});
object({
	title: string().optional(),
	tagline: string().optional(),
	logo: mediaReferenceResponse.optional(),
	favicon: mediaReferenceResponse.optional(),
	url: string().optional(),
	postsPerPage: number().int().optional(),
	dateFormat: string().optional(),
	timezone: string().optional(),
	social: socialSettings.optional(),
	seo: seoSettingsResponse.optional()
}).meta({ id: "SiteSettings" });
var searchQuery = object({
	q: string().min(1),
	collections: string().optional(),
	status: string().optional(),
	locale: localeCode.optional(),
	limit: number$1().int().min(1).max(100).optional(),
	cursor: string().optional()
}).meta({ id: "SearchQuery" });
var searchSuggestQuery = object({
	q: string().min(1),
	collections: string().optional(),
	locale: localeCode.optional(),
	limit: number$1().int().min(1).max(20).optional()
}).meta({ id: "SearchSuggestQuery" });
var searchRebuildBody = object({ collection: string().min(1) }).meta({ id: "SearchRebuildBody" });
var searchEnableBody = object({
	collection: string().min(1),
	enabled: boolean(),
	weights: record(string(), number()).optional()
}).meta({ id: "SearchEnableBody" });
var searchResultSchema = object({
	collection: string(),
	id: string(),
	slug: string().nullable(),
	locale: string(),
	title: string().optional(),
	snippet: string().optional(),
	score: number()
}).meta({ id: "SearchResult" });
object({
	items: array(searchResultSchema),
	nextCursor: string().optional()
}).meta({ id: "SearchResponse" });
var usersListQuery = object({
	search: string().optional(),
	role: string().optional(),
	cursor: string().max(2048).optional(),
	limit: number$1().int().min(1).max(100).optional().default(50)
}).meta({ id: "UsersListQuery" });
var userUpdateBody = object({
	name: string().optional(),
	email: string().email().optional(),
	role: roleLevel.optional()
}).meta({ id: "UserUpdateBody" });
var allowedDomainCreateBody = object({
	domain: string().min(1),
	defaultRole: roleLevel
}).meta({ id: "AllowedDomainCreateBody" });
var allowedDomainUpdateBody = object({
	enabled: boolean().optional(),
	defaultRole: roleLevel.optional()
}).meta({ id: "AllowedDomainUpdateBody" });
var userSchema = object({
	id: string(),
	email: string(),
	name: string().nullable(),
	avatarUrl: string().nullable(),
	role: number().int(),
	emailVerified: boolean(),
	disabled: boolean(),
	createdAt: string(),
	updatedAt: string(),
	lastLogin: string().nullable(),
	credentialCount: number().int().optional(),
	oauthProviders: array(string()).optional()
}).meta({ id: "User" });
object({
	items: array(userSchema),
	nextCursor: string().optional()
}).meta({ id: "UserListResponse" });
object({
	id: string(),
	email: string(),
	name: string().nullable(),
	avatarUrl: string().nullable(),
	role: number().int(),
	emailVerified: boolean(),
	disabled: boolean(),
	createdAt: string(),
	updatedAt: string(),
	lastLogin: string().nullable(),
	credentials: array(object({
		id: string(),
		name: string().nullable(),
		deviceType: string().nullable(),
		createdAt: string(),
		lastUsedAt: string()
	})),
	oauthAccounts: array(object({
		provider: string(),
		createdAt: string()
	}))
}).meta({ id: "UserDetail" });
var widgetType = _enum([
	"content",
	"menu",
	"component"
]);
var createWidgetAreaBody = object({
	name: string().min(1),
	label: string().min(1),
	description: string().optional()
}).meta({ id: "CreateWidgetAreaBody" });
var createWidgetBody = object({
	type: widgetType,
	title: string().optional(),
	content: array(record(string(), unknown())).optional(),
	menuName: string().optional(),
	componentId: string().optional(),
	componentProps: record(string(), unknown()).optional()
}).meta({ id: "CreateWidgetBody" });
var updateWidgetBody = object({
	type: widgetType.optional(),
	title: string().optional(),
	content: array(record(string(), unknown())).optional(),
	menuName: string().optional(),
	componentId: string().optional(),
	componentProps: record(string(), unknown()).optional()
}).meta({ id: "UpdateWidgetBody" });
var reorderWidgetsBody = object({ widgetIds: array(string().min(1)) }).meta({ id: "ReorderWidgetsBody" });
var widgetAreaSchema = object({
	id: string(),
	name: string(),
	label: string(),
	description: string().nullable(),
	created_at: string(),
	updated_at: string()
}).meta({ id: "WidgetArea" });
var widgetSchema = object({
	id: string(),
	type: widgetType,
	title: string().optional(),
	content: array(record(string(), unknown())).optional(),
	menuName: string().optional(),
	componentId: string().optional(),
	componentProps: record(string(), unknown()).optional()
}).meta({ id: "Widget" });
widgetAreaSchema.extend({ widgets: array(widgetSchema) }).meta({ id: "WidgetAreaWithWidgets" }).extend({ widgetCount: number().int() }).meta({ id: "WidgetAreaWithWidgetsAndCount" });
var redirectType = number$1().int().refine((n) => REDIRECT_RULE_STATUSES.includes(n), { message: "Redirect type must be 301, 302, 307, 308, 410, or 451" });
/** Matches CR or LF characters */
var CRLF = /[\r\n]/;
/** Path must start with / and not be protocol-relative, contain no CRLF, and no path traversal */
var urlPath = string().min(1).refine((s) => s.startsWith("/") && !s.startsWith("//"), { message: "Must be a path starting with / (no protocol-relative URLs)" }).refine((s) => !CRLF.test(s), { message: "URL must not contain newline characters" }).refine((s) => {
	try {
		return !decodeURIComponent(s).split("/").includes("..");
	} catch {
		return false;
	}
}, { message: "URL must not contain path traversal segments" });
var createRedirectBody = object({
	source: urlPath,
	destination: union([urlPath, literal("")]).optional(),
	type: redirectType.optional().default(301),
	enabled: boolean().optional().default(true),
	groupName: string().nullish()
}).refine((o) => isTerminalStatus(o.type ?? 301) || !!o.destination, {
	message: "destination is required for redirect types (301, 302, 307, 308)",
	path: ["destination"]
}).meta({ id: "CreateRedirectBody" });
var updateRedirectBody = object({
	source: urlPath.optional(),
	destination: union([urlPath, literal("")]).optional(),
	type: redirectType.optional(),
	enabled: boolean().optional(),
	groupName: string().nullish()
}).refine((o) => Object.values(o).some((v) => v !== void 0), { message: "At least one field must be provided" }).meta({ id: "UpdateRedirectBody" });
var redirectsListQuery = cursorPaginationQuery.extend({
	search: string().optional(),
	group: string().optional(),
	enabled: _enum(["true", "false"]).transform((v) => v === "true").optional(),
	auto: _enum(["true", "false"]).transform((v) => v === "true").optional()
}).meta({ id: "RedirectsListQuery" });
var notFoundListQuery = cursorPaginationQuery.extend({ search: string().optional() }).meta({ id: "NotFoundListQuery" });
var notFoundSummaryQuery = object({ limit: number$1().int().min(1).max(100).optional().default(50) });
var notFoundPruneBody = object({ olderThan: string().datetime({ message: "olderThan must be an ISO 8601 datetime" }) }).meta({ id: "NotFoundPruneBody" });
var redirectSchema = object({
	id: string(),
	source: string(),
	destination: string(),
	type: number().int(),
	isPattern: boolean(),
	enabled: boolean(),
	hits: number().int(),
	lastHitAt: string().nullable(),
	groupName: string().nullable(),
	auto: boolean(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Redirect" });
object({
	items: array(redirectSchema),
	nextCursor: string().optional(),
	loopRedirectIds: array(string()).optional()
}).meta({ id: "RedirectListResponse" });
var notFoundEntrySchema = object({
	id: string(),
	path: string(),
	referrer: string().nullable(),
	userAgent: string().nullable(),
	ip: string().nullable(),
	createdAt: string()
}).meta({ id: "NotFoundEntry" });
object({
	items: array(notFoundEntrySchema),
	nextCursor: string().optional()
}).meta({ id: "NotFoundListResponse" });
var notFoundSummarySchema = object({
	path: string(),
	count: number().int(),
	lastSeen: string(),
	topReferrer: string().nullable()
}).meta({ id: "NotFoundSummary" });
object({ items: array(notFoundSummarySchema) }).meta({ id: "NotFoundSummaryResponse" });
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/relations-C4duJnwI.mjs
var authenticatorTransport$1 = _enum([
	"usb",
	"nfc",
	"ble",
	"internal",
	"hybrid"
]);
/** RegistrationResponse — sent by the browser after navigator.credentials.create() */
var registrationCredential$1 = object({
	id: string(),
	rawId: string(),
	type: literal("public-key"),
	response: object({
		clientDataJSON: string(),
		attestationObject: string(),
		transports: array(authenticatorTransport$1).optional()
	}),
	authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
/** AuthenticationResponse — sent by the browser after navigator.credentials.get() */
var authenticationCredential = object({
	id: string(),
	rawId: string(),
	type: literal("public-key"),
	response: object({
		clientDataJSON: string(),
		authenticatorData: string(),
		signature: string(),
		userHandle: string().optional()
	}),
	authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
var signupRequestBody = object({ email: string().email() }).meta({ id: "SignupRequestBody" });
var signupCompleteBody = object({
	token: string().min(1),
	credential: registrationCredential$1,
	name: string().optional()
}).meta({ id: "SignupCompleteBody" });
var inviteCreateBody = object({
	email: string().email(),
	role: roleLevel.optional()
}).meta({ id: "InviteCreateBody" });
var inviteRegisterOptionsBody = object({
	token: string().min(1),
	name: string().optional()
}).meta({ id: "InviteRegisterOptionsBody" });
var inviteCompleteBody = object({
	token: string().min(1),
	credential: registrationCredential$1,
	name: string().optional()
}).meta({ id: "InviteCompleteBody" });
var magicLinkSendBody = object({ email: string().email() }).meta({ id: "MagicLinkSendBody" });
var passkeyOptionsBody = object({ email: string().email().optional() }).meta({ id: "PasskeyOptionsBody" });
var passkeyVerifyBody = object({ credential: authenticationCredential }).meta({ id: "PasskeyVerifyBody" });
var passkeyRegisterOptionsBody = object({ name: string().optional() }).meta({ id: "PasskeyRegisterOptionsBody" });
var passkeyRegisterVerifyBody = object({
	credential: registrationCredential$1,
	name: string().optional()
}).meta({ id: "PasskeyRegisterVerifyBody" });
var passkeyRenameBody = object({ name: string().min(1) }).meta({ id: "PasskeyRenameBody" });
var authMeActionBody = object({ action: string().min(1) }).meta({ id: "AuthMeActionBody" });
var importProbeBody = object({ url: httpUrl });
var wpPluginAnalyzeBody = object({
	url: httpUrl,
	token: string().min(1)
});
var wpPluginExecuteBody = object({
	url: httpUrl,
	token: string().min(1),
	config: record(string(), unknown()),
	phase: _enum([
		"content",
		"comments",
		"finalize"
	]).optional(),
	cursor: object({
		postTypeIndex: number().int().min(0).default(0),
		page: number().int().min(1).default(1)
	}).optional(),
	idMap: record(string(), object({
		id: string().min(1),
		collection: string().min(1)
	})).optional(),
	translationGroups: record(string(), string().min(1)).optional(),
	commentRoots: record(string(), string().min(1)).optional()
});
var wpPrepareBody = object({ postTypes: array(object({
	name: string().min(1),
	collection: string().min(1),
	fields: array(object({
		slug: string().min(1),
		label: string().min(1),
		type: string().min(1),
		required: boolean(),
		searchable: boolean().optional()
	})).optional()
})) });
var wpMediaImportBody = object({
	attachments: array(record(string(), unknown())),
	stream: boolean().optional()
});
var wpRewriteUrlsBody = object({
	urlMap: record(string(), string()),
	collections: array(string()).optional()
});
/** Registration credential — duplicated reference for setup flow.
*  The canonical definition lives in auth.ts but setup needs it independently
*  because setup runs before auth is configured. */
var authenticatorTransport = _enum([
	"usb",
	"nfc",
	"ble",
	"internal",
	"hybrid"
]);
var registrationCredential = object({
	id: string(),
	rawId: string(),
	type: literal("public-key"),
	response: object({
		clientDataJSON: string(),
		attestationObject: string(),
		transports: array(authenticatorTransport).optional()
	}),
	authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
var setupBody = object({
	title: string().min(1),
	tagline: string().optional(),
	includeContent: boolean()
});
var setupAdminBody = object({
	email: string().email(),
	name: string().optional()
});
var setupAdminVerifyBody = object({ credential: registrationCredential });
object({ handle: string().trim().min(1) });
object({ handle: string().trim().min(1) });
/**
* Zod schemas for the byline-fields admin API (Discussion #1174, Phase 4).
*
* Reserved-slug + identifier validation runs at the zod layer so the
* route returns a clean 400 (`VALIDATION_ERROR` from `parseBody`) rather
* than bubbling a registry-level `BylineSchemaError` ("RESERVED_SLUG" /
* "INVALID_SLUG"). The registry repeats the same checks for non-HTTP
* callers (seeds, scripts) — see `BylineSchemaRegistry.validateSlug`.
*
* Field types are constrained to the v1 subset declared in
* `BYLINE_FIELD_TYPES`. Adding a type to the union there will require a
* corresponding update to this enum.
*/
/**
* Slug pattern for byline field definitions — matches the identifier rule
* used by `validateIdentifier` (and `slugPattern` in `common.ts`).
* Lowercase letters, digits, and underscores; must start with a letter.
*/
var bylineFieldSlugPattern = /^[a-z][a-z0-9_]*$/;
/** Hard cap on a slug — mirrors `BylineSchemaRegistry.MAX_SLUG_LENGTH`. */
var MAX_SLUG_LENGTH = 63;
/** Hard cap on a label — mirrors `BylineSchemaRegistry.MAX_LABEL_LENGTH`. */
var MAX_LABEL_LENGTH = 200;
/** Hard cap on a select field's `options` list. */
var MAX_SELECT_OPTIONS = 200;
var RESERVED_SET = new Set(RESERVED_BYLINE_FIELD_SLUGS);
var bylineFieldTypeValues = _enum([
	"string",
	"text",
	"url",
	"boolean",
	"select"
]);
/**
* Validation payload for a byline custom field. v1 only exposes
* `options` (used by `select`-type fields). Empty/duplicate options are
* rejected at the registry layer; the zod layer only enforces shape and
* caps. Future field types may add keys here.
*/
var bylineFieldValidationSchema = object({ options: array(string().min(1)).min(1, "select options must contain at least one entry").max(MAX_SELECT_OPTIONS, `select options cannot exceed ${MAX_SELECT_OPTIONS} entries`).optional() }).strict().nullable();
/**
* Slug validation chain shared by create + reorder bodies. Centralised so
* the reserved-slug message and pattern are identical everywhere.
*/
var bylineFieldSlug = string().min(1, "Byline field slug is required").max(MAX_SLUG_LENGTH, `Byline field slug must be ${MAX_SLUG_LENGTH} characters or less`).regex(bylineFieldSlugPattern, "Byline field slug must contain only lowercase letters, digits, and underscores, and start with a letter").refine((slug) => !RESERVED_SET.has(slug), { message: "Byline field slug is reserved" });
var bylineFieldLabel = string().min(1, "Byline field label is required").max(MAX_LABEL_LENGTH, `Byline field label must be ${MAX_LABEL_LENGTH} characters or less`);
var bylineFieldCreateBody = object({
	slug: bylineFieldSlug,
	label: bylineFieldLabel,
	type: bylineFieldTypeValues,
	required: boolean().optional(),
	translatable: boolean().optional(),
	validation: bylineFieldValidationSchema.optional(),
	sortOrder: number().int().min(0).optional()
}).strict().meta({ id: "BylineFieldCreateBody" });
/**
* Update body. `slug` and `type` are intentionally absent — both are
* immutable post-create (changing them would invalidate stored values).
* `translatable` flips are gated at the registry layer when value rows
* exist (`TRANSLATABLE_LOCKED`).
*/
var bylineFieldUpdateBody = object({
	label: bylineFieldLabel.optional(),
	required: boolean().optional(),
	translatable: boolean().optional(),
	validation: bylineFieldValidationSchema.optional(),
	sortOrder: number().int().min(0).optional()
}).strict().meta({ id: "BylineFieldUpdateBody" });
var bylineFieldReorderBody = object({ slugs: array(bylineFieldSlug) }).strict().meta({ id: "BylineFieldReorderBody" });
var bylineFieldDefinitionSchema = object({
	id: string(),
	slug: string(),
	label: string(),
	type: bylineFieldTypeValues,
	required: boolean(),
	translatable: boolean(),
	validation: object({ options: array(string()).optional() }).nullable(),
	sortOrder: number().int(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "BylineFieldDefinition" });
object({ items: array(bylineFieldDefinitionSchema) }).meta({ id: "BylineFieldListResponse" });
object({
	translatableValueCount: number().int().nonnegative(),
	groupValueCount: number().int().nonnegative(),
	totalAffectedRows: number().int().nonnegative()
}).meta({ id: "BylineFieldUsageResponse" });
var slugPattern = /^[a-z][a-z0-9_]*$/;
var collectionSlug = string().min(1).max(63).regex(slugPattern, "Invalid collection slug format");
object({
	name: string().min(1).max(63).regex(slugPattern, "Name must be lowercase alphanumeric with underscores"),
	parentCollection: collectionSlug.optional(),
	childCollection: collectionSlug.optional(),
	parentLabel: string().min(1).max(200),
	childLabel: string().min(1).max(200),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).refine((body) => body.translationOf !== void 0 || body.parentCollection !== void 0 && body.childCollection !== void 0, { message: "parentCollection and childCollection are required unless translationOf is set" }).meta({ id: "CreateRelationBody" });
object({
	parentLabel: string().min(1).max(200).optional(),
	childLabel: string().min(1).max(200).optional()
}).refine((body) => body.parentLabel !== void 0 || body.childLabel !== void 0, { message: "At least one of parentLabel or childLabel is required" }).meta({ id: "UpdateRelationBody" });
object({ childIds: array(string().min(1)).max(1e3) }).meta({ id: "SetReferenceChildrenBody" });
var relationDefSchema = object({
	id: string(),
	name: string(),
	parentCollection: string(),
	childCollection: string(),
	parentLabel: string(),
	childLabel: string(),
	locale: string(),
	translationGroup: string()
}).meta({ id: "RelationDef" });
object({ relations: array(relationDefSchema) }).meta({ id: "RelationListResponse" });
object({ relation: relationDefSchema }).meta({ id: "RelationResponse" });
object({
	translationGroup: string(),
	translations: array(object({
		id: string(),
		name: string(),
		locale: string(),
		parentLabel: string(),
		childLabel: string()
	}))
}).meta({ id: "RelationTranslations" });
var entryRefSchema = object({
	id: string(),
	slug: string().nullable(),
	collection: string(),
	locale: string().nullable(),
	sortOrder: number().int().optional()
}).meta({ id: "ReferenceEntryRef" });
object({
	children: array(entryRefSchema),
	nextCursor: string().optional()
}).meta({ id: "ReferenceChildrenResponse" });
object({
	parents: array(entryRefSchema),
	nextCursor: string().optional()
}).meta({ id: "ReferenceParentsResponse" });
//#endregion
export { createTaxonomyDefBody as $, bylinesListQuery as A, contentScheduleBody as B, wpPrepareBody as C, updateRedirectBody as Ct, bylineCreateBody as D, userUpdateBody as Dt, allowedDomainUpdateBody as E, updateWidgetBody as Et, contentBylineInputSchema as F, createCollectionBody as G, contentTermsBody as H, contentCreateBody as I, createMenuBody as J, createCommentBody as K, contentListQuery as L, commentBulkBody as M, commentListQuery as N, bylineTranslationCreateBody as O, usersListQuery as Ot, commentStatusBody as P, createSectionBody as Q, contentPreviewUrlBody as R, wpPluginExecuteBody as S, updateMenuItemBody as St, allowedDomainCreateBody as T, updateTermBody as Tt, contentTrashQuery as U, contentSeoInput as V, contentUpdateBody as W, createReactionBody as X, createMenuItemBody as Y, createRedirectBody as Z, setupBody as _, settingsUpdateBody as _t, importProbeBody as a, notFoundPruneBody as at, wpMediaImportBody as b, updateFieldBody as bt, inviteRegisterOptionsBody as c, redirectsListQuery as ct, passkeyRegisterOptionsBody as d, sanitizeHref as dt, createTermBody as et, passkeyRegisterVerifyBody as f, searchEnableBody as ft, setupAdminVerifyBody as g, sectionsListQuery as gt, setupAdminBody as h, searchSuggestQuery as ht, bylineFieldUpdateBody as i, notFoundListQuery as it, collectionGetQuery as j, bylineUpdateBody as k, isTerminalStatus as kt, magicLinkSendBody as l, reorderMenuItemsBody as lt, passkeyVerifyBody as m, searchRebuildBody as mt, bylineFieldCreateBody as n, createWidgetBody as nt, inviteCompleteBody as o, notFoundSummaryQuery as ot, passkeyRenameBody as p, searchQuery as pt, createFieldBody as q, bylineFieldReorderBody as r, fieldReorderBody as rt, inviteCreateBody as s, orphanRegisterBody as st, authMeActionBody as t, createWidgetAreaBody as tt, passkeyOptionsBody as u, reorderWidgetsBody as ut, signupCompleteBody as v, termListQuery as vt, wpRewriteUrlsBody as w, updateSectionBody as wt, wpPluginAnalyzeBody as x, updateMenuBody as xt, signupRequestBody as y, updateCollectionBody as yt, contentPublishBody as z };
