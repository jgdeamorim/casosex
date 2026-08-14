import { t as sql } from "./dist_D4nVBoqy.mjs";
import { a as Kysely } from "./kysely_CkAA5UYX.mjs";
import { b as validateIdentifier, m as isPostgres, r as __exportAll, u as buildStatusCondition } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { n as getRequestContext } from "./request-context_K9BAblf6.mjs";
import { a as encodeCursor, i as decodeCursor } from "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as isMissingTableError, t as isMissingColumnError } from "./db-errors-CcWLaRiR_Bz5UsdxN.mjs";
var QUERY_LOG_PREFIX = "[emdash-query-log]";
function createRecorder(route, method, phase) {
	return {
		events: [],
		route,
		method,
		phase
	};
}
function recordEvent(rec, sql, params, durationMs) {
	rec.events.push({
		sql,
		params,
		durationMs,
		route: rec.route,
		method: rec.method,
		phase: rec.phase
	});
}
/**
* Emit all events from a recorder as prefixed NDJSON on stdout. The
* harness pipes the child's stdout, filters lines beginning with
* QUERY_LOG_PREFIX, and writes them to its own file. Using stdout means
* the sink works uniformly in Node and in workerd (which has no fs).
*
* Idempotent: the first call emits and marks the recorder flushed, later
* calls no-op. For streamed responses the flush is deferred to stream end
* (see wrapBodyForStreamMetrics) so it captures queries issued while the
* body is still rendering; bodyless responses fall back to a flush when
* middleware returns.
*/
function flushRecorder(rec) {
	if (rec.flushed) return;
	rec.flushed = true;
	for (const e of rec.events) console.log(`${QUERY_LOG_PREFIX} ${JSON.stringify(e)}`);
}
/**
* Whether query instrumentation is enabled. Read at Kysely construction
* time and middleware entry — the env var is a process-lifetime flag, not
* per-request. Gated via `process.env` so adapters that ship env through
* to the worker (e.g. Miniflare via wrangler.jsonc `vars` or host env
* pass-through) can enable it at runtime.
*/
function isInstrumentationEnabled() {
	return Boolean(typeof process !== "undefined" && process.env && process.env["EMDASH_QUERY_LOG"] === "1");
}
function kyselyLog(event) {
	if (event.level !== "query") return;
	const ctx = getRequestContext();
	if (!ctx) return;
	const dur = event.queryDurationMillis;
	if (ctx.metrics) {
		const m = ctx.metrics;
		m.dbCount += 1;
		m.dbTotalMs += dur;
		const finishedAt = performance.now() - m.start;
		const startedAt = finishedAt - dur;
		if (m.dbFirstOffset === null) m.dbFirstOffset = startedAt;
		m.dbLastOffset = finishedAt;
	}
	if (ctx.queryRecorder) recordEvent(ctx.queryRecorder, event.query.sql, event.query.parameters, dur);
}
/**
* Returns a Kysely `log` callback. Always returns a function so per-request
* counters (db.count, db.total, db.first, db.last) and the optional NDJSON
* recorder both get fed. The cost over the previous "undefined when off"
* behaviour is one `performance.now()` pair per query inside Kysely, which
* is in the noise compared to any real query.
*/
function kyselyLogOption() {
	return kyselyLog;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/loader-C1XOLV5b.mjs
var loader_exports = /* @__PURE__ */ __exportAll({
	CURSOR_RAW_VALUES: () => CURSOR_RAW_VALUES,
	FOLDED_BYLINES: () => FOLDED_BYLINES,
	FOLDED_TERMS: () => FOLDED_TERMS,
	buildTaxonomyPivotQuery: () => buildTaxonomyPivotQuery,
	emdashLoader: () => emdashLoader,
	getDb: () => getDb,
	resetTaxonomyNamesCache: () => resetTaxonomyNamesCache
});
var FIELD_NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
/**
* SEO columns folded into the single-entry query as a single JSON column
* (`_emdash_seo` in the result set), then expanded onto the row under these
* aliases for `extractSeo()`. Surfacing SEO as one aggregated column keeps the
* result-set width bounded regardless of how many fields the collection has,
* which matters for D1: a flat `LEFT JOIN _emdash_seo` adds 5 alias columns to
* every row and pushes wide collections (common after WordPress / ACF imports)
* past D1's per-result-set column limit, surfacing as a silent null entry.
* One JSON column is one column, so the join stays safe at any schema width.
*
* The aliases mirror the strategy used by `foldedHydrationSelects` for byline
* and taxonomy hydration: aggregate in SQL, expand in JS. SEO is 1:1 with
* content, so the subquery uses `json_object` (not the array aggregator).
*
* The `_emdash_` prefix on the aliases guarantees they can never collide with
* a content field. Field slugs must match `/^[a-z][a-z0-9_]*$/`, so a user can
* legitimately define a `seo_title` field; surfacing the SEO column under its
* bare name would shadow that field in the result set and drop the user's
* value. The prefix (illegal as a leading slug char) sidesteps this entirely.
*/
var SEO_COLUMN_ALIASES = {
	seo_title: "_emdash_seo_title",
	seo_description: "_emdash_seo_description",
	seo_image: "_emdash_seo_image",
	seo_canonical: "_emdash_seo_canonical",
	seo_no_index: "_emdash_seo_no_index"
};
/** Aliased SEO result keys — excluded from generic field mapping. */
var SEO_ALIAS_COLUMNS = Object.values(SEO_COLUMN_ALIASES);
/** Folded SEO JSON column name in the result set (expanded onto aliases in JS). */
var SEO_FOLDED_COLUMN = "_emdash_seo";
/**
* System columns excluded from entry.data
* Note: slug is intentionally NOT excluded - it's useful as data.slug in templates
*/
var SYSTEM_COLUMNS = /* @__PURE__ */ new Set([
	"id",
	"status",
	"author_id",
	"primary_byline_id",
	"created_at",
	"updated_at",
	"published_at",
	"scheduled_at",
	"deleted_at",
	"version",
	"live_revision_id",
	"draft_revision_id",
	"locale",
	"translation_group",
	...SEO_ALIAS_COLUMNS,
	"_emdash_terms",
	"_emdash_bylines",
	SEO_FOLDED_COLUMN
]);
/** Markers for byline/taxonomy hydration folded into the content query. */
var FOLDED_TERMS = Symbol.for("emdash:foldedTerms");
var FOLDED_BYLINES = Symbol.for("emdash:foldedBylines");
/**
* Correlated JSON-array subqueries that fold taxonomy-term and byline hydration
* into the content query, removing the two separate hydration round trips per
* fetch. `outer` is the content table's alias/name; each subquery correlates on
* `<outer>.id`, so the base query stays one row per entry (no join fan-out, no
* duplicated content payload). Order is NOT applied in the aggregate (it differs
* across dialects) — the consumer sorts terms by label and credits by sortOrder.
*
* Dialect-specific aggregation: SQLite `json_group_array`/`json_object` returns
* a JSON *string*; Postgres `json_agg`/`json_build_object` (coalesced to `[]`)
* returns parsed JSON. {@link stashFolded} handles both.
*/
function foldedHydrationSelects(db, type, outer) {
	const o = sql.ref(outer);
	const pg = isPostgres(db);
	const obj = (pairs) => pg ? sql.raw(`json_build_object(${pairs})`) : sql.raw(`json_object(${pairs})`);
	const agg = (inner) => pg ? sql`coalesce(json_agg(${inner}), '[]'::json)` : sql`json_group_array(${inner})`;
	const foldJoin = pg ? sql`JOIN` : sql`CROSS JOIN`;
	const terms = sql`(SELECT ${agg(obj("'id', t.id, 'name', t.name, 'slug', t.slug, 'label', t.label, 'parent_id', t.parent_id, 'locale', t.locale, 'translation_group', t.translation_group"))} FROM ${sql.ref("content_taxonomies")} AS ct ${foldJoin} ${sql.ref("taxonomies")} AS t ON t.translation_group = ct.taxonomy_id WHERE ct.collection = ${type} AND ct.entry_id = ${o}.id AND t.locale = ${o}.locale) AS ${sql.ref("_emdash_terms")}`;
	const bylineInner = obj("'id', b.id, 'slug', b.slug, 'displayName', b.display_name, 'bio', b.bio, 'avatarMediaId', b.avatar_media_id, 'avatarStorageKey', m.storage_key, 'avatarAlt', m.alt, 'avatarBlurhash', m.blurhash, 'avatarDominantColor', m.dominant_color, 'websiteUrl', b.website_url, 'userId', b.user_id, 'isGuest', b.is_guest, 'createdAt', b.created_at, 'updatedAt', b.updated_at, 'locale', b.locale, 'translationGroup', b.translation_group");
	return {
		terms,
		bylines: sql`(SELECT ${agg(sql`${pg ? sql.raw("json_build_object('roleLabel', cb.role_label, 'sortOrder', cb.sort_order, 'byline', ") : sql.raw("json_object('roleLabel', cb.role_label, 'sortOrder', cb.sort_order, 'byline', ")}${bylineInner})`)} FROM ${sql.ref("_emdash_content_bylines")} AS cb ${foldJoin} ${sql.ref("_emdash_bylines")} AS b ON b.translation_group = cb.byline_id LEFT JOIN ${sql.ref("media")} AS m ON m.id = b.avatar_media_id WHERE cb.collection_slug = ${type} AND cb.content_id = ${o}.id AND b.locale = ${o}.locale) AS ${sql.ref("_emdash_bylines")}`
	};
}
/**
* Correlated JSON-object subquery that folds per-entry SEO into the content
* query without widening the result set: 1 row of `_emdash_seo` becomes 1 JSON
* column rather than 5 flat columns. The JSON column is expanded onto the row
* via {@link expandFoldedSeo} after the query runs, preserving the alias keys
* that {@link extractSeo} reads. Missing SEO row (no entry in `_emdash_seo`)
* yields NULL, which {@link expandFoldedSeo} treats as "no SEO" - identical to
* the prior LEFT JOIN miss behavior.
*
* Dialect-specific aggregation mirrors {@link foldedHydrationSelects}: SQLite
* `json_object` returns a JSON *string*, Postgres `json_build_object` returns
* parsed JSON; both branches are handled in expansion.
*/
function foldedSeoSelect(db, type, outer) {
	const o = sql.ref(outer);
	const pg = isPostgres(db);
	const pairs = "'seo_title', s.seo_title, 'seo_description', s.seo_description, 'seo_image', s.seo_image, 'seo_canonical', s.seo_canonical, 'seo_no_index', s.seo_no_index";
	return sql`(SELECT ${pg ? sql.raw(`json_build_object(${pairs})`) : sql.raw(`json_object(${pairs})`)} FROM ${sql.ref("_emdash_seo")} AS s WHERE s.collection = ${type} AND s.content_id = ${o}.id LIMIT 1) AS ${sql.ref(SEO_FOLDED_COLUMN)}`;
}
/**
* Expand the folded `_emdash_seo` JSON column onto the row using SEO_COLUMN_ALIASES,
* so {@link extractSeo} reads it transparently. SQLite returns a JSON string
* (parse it); Postgres returns already-parsed JSON. Missing/malformed/null is
* a no-op: {@link extractSeo} returns null when the aliases are absent.
*/
function isPlainObject(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function expandFoldedSeo(row) {
	const raw = row[SEO_FOLDED_COLUMN];
	delete row[SEO_FOLDED_COLUMN];
	let parsed = null;
	if (typeof raw === "string") try {
		const candidate = JSON.parse(raw);
		if (isPlainObject(candidate)) parsed = candidate;
	} catch {
		return;
	}
	else if (isPlainObject(raw)) parsed = raw;
	if (!parsed) return;
	for (const [col, alias] of Object.entries(SEO_COLUMN_ALIASES)) row[alias] = parsed[col] ?? null;
}
/**
* Stash folded hydration JSON (non-enumerable) for the query.ts fast paths.
* SQLite returns a JSON string (parse it); Postgres returns already-parsed JSON.
*/
function stashFolded(data, row) {
	for (const [col, sym] of [["_emdash_terms", FOLDED_TERMS], ["_emdash_bylines", FOLDED_BYLINES]]) {
		const raw = row[col];
		let value;
		if (typeof raw === "string") try {
			value = JSON.parse(raw);
		} catch {
			continue;
		}
		else if (Array.isArray(raw)) value = raw;
		else continue;
		Object.defineProperty(data, sym, {
			value,
			enumerable: false,
			configurable: true
		});
	}
}
/**
* Build a `data.seo` object from the joined `_emdash_seo` columns on a row.
*
* Returns `null` when no SEO row exists (LEFT JOIN miss → `seo_no_index` is
* NULL, since the column is `NOT NULL DEFAULT 0` whenever a row is present).
* Returning null keeps the `seo` key off entries that have none, so
* `getSeoMeta()` falls back to its defaults exactly as before.
*/
function extractSeo(row) {
	const noIndex = row[SEO_COLUMN_ALIASES.seo_no_index];
	if (noIndex === null || noIndex === void 0) return null;
	const title = row[SEO_COLUMN_ALIASES.seo_title];
	const description = row[SEO_COLUMN_ALIASES.seo_description];
	const image = row[SEO_COLUMN_ALIASES.seo_image];
	const canonical = row[SEO_COLUMN_ALIASES.seo_canonical];
	return {
		title: typeof title === "string" ? title : null,
		description: typeof description === "string" ? description : null,
		image: typeof image === "string" ? image : null,
		canonical: typeof canonical === "string" ? canonical : null,
		noIndex: noIndex === 1
	};
}
/**
* Get the table name for a collection type
*/
function getTableName(type) {
	validateIdentifier(type, "collection type");
	return `ec_${type}`;
}
/**
* Cache for taxonomy names (only used for the primary database).
* Skipped when a per-request DB override is active (e.g. preview mode)
* because the override DB may have different taxonomies.
*/
var taxonomyNames = null;
/**
* Get all taxonomy names (cached for the primary DB, bypassed only when
* the per-request DB is an isolated instance — playground / DO preview).
* Plain D1 Sessions routing shares schema with the singleton, so the
* module-scoped cache stays valid.
*/
async function getTaxonomyNames(db) {
	const hasIsolatedDb = getRequestContext()?.dbIsIsolated === true;
	if (!hasIsolatedDb && taxonomyNames) return taxonomyNames;
	try {
		const defs = await db.selectFrom("_emdash_taxonomy_defs").select("name").execute();
		const names = new Set(defs.map((d) => d.name));
		if (!hasIsolatedDb) taxonomyNames = names;
		return names;
	} catch {
		const empty = /* @__PURE__ */ new Set();
		if (!hasIsolatedDb) taxonomyNames = empty;
		return empty;
	}
}
/**
* Reset the module-scoped taxonomy-names cache.
*
* Called from `invalidateTaxonomyDefsCache()` so that creating or seeding a
* taxonomy definition is reflected within the current isolate instead of
* waiting for the isolate to recycle. Keeps this cache consistent with the
* isolate-wide taxonomy-defs cache in `taxonomies/index.ts`.
*/
function resetTaxonomyNamesCache() {
	taxonomyNames = null;
}
/**
* System columns to include in data (mapped to camelCase where needed)
*/
var INCLUDE_IN_DATA = {
	id: "id",
	status: "status",
	author_id: "authorId",
	primary_byline_id: "primaryBylineId",
	created_at: "createdAt",
	updated_at: "updatedAt",
	published_at: "publishedAt",
	scheduled_at: "scheduledAt",
	draft_revision_id: "draftRevisionId",
	live_revision_id: "liveRevisionId",
	locale: "locale",
	translation_group: "translationGroup"
};
/** System date columns that should be converted to Date objects */
var DATE_COLUMNS = /* @__PURE__ */ new Set([
	"created_at",
	"updated_at",
	"published_at",
	"scheduled_at"
]);
/**
* Hidden, symbol-keyed property on each mapped data record carrying the raw
* DB string for every date column. Lets cursor encoders downstream reproduce
* the loader's exact `nextCursor` format without round-tripping through
* `new Date()`, which loses precision for stored values that aren't already
* ISO-with-milliseconds (e.g. `2026-01-01T00:00:00Z` becomes
* `2026-01-01T00:00:00.000Z`).
*/
var CURSOR_RAW_VALUES = Symbol("emdash:cursorRawValues");
var LOCAL_MEDIA_FILE_PREFIX = "/_emdash/api/media/file/";
var URL_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
/** Safely extract a string value from a record, returning fallback if not a string */
function rowStr(row, key, fallback = "") {
	const val = row[key];
	return typeof val === "string" ? val : fallback;
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isBareMediaKey(src) {
	return !src.startsWith("/") && !URL_SCHEME_PATTERN.test(src);
}
function normalizeLocalMediaValue(value) {
	if (Array.isArray(value)) return value.map(normalizeLocalMediaValue);
	if (!isRecord(value)) return value;
	const normalized = {};
	for (const [key, child] of Object.entries(value)) normalized[key] = normalizeLocalMediaValue(child);
	if (normalized.provider === "local" && typeof normalized.src === "string" && normalized.src.length > 0) {
		const src = normalized.src;
		if (src.startsWith(LOCAL_MEDIA_FILE_PREFIX)) {
			const id = src.slice(24);
			if (!normalized.id && id) normalized.id = id;
		} else if (isBareMediaKey(src)) {
			if (!normalized.id) normalized.id = src;
			normalized.src = `${LOCAL_MEDIA_FILE_PREFIX}${src}`;
		}
	}
	return normalized;
}
/**
* Map a database row to entry data
* Extracts content fields (non-system columns) and parses JSON where needed.
* System columns needed for templates (id, status, dates) are included with camelCase names.
*/
function mapRowToData(row) {
	const data = {};
	const rawDateValues = {};
	for (const [key, value] of Object.entries(row)) {
		if (key in INCLUDE_IN_DATA) {
			if (DATE_COLUMNS.has(key)) if (typeof value === "string") {
				rawDateValues[key] = value;
				data[INCLUDE_IN_DATA[key]] = new Date(value);
			} else data[INCLUDE_IN_DATA[key]] = null;
			else data[INCLUDE_IN_DATA[key]] = value;
			continue;
		}
		if (SYSTEM_COLUMNS.has(key)) continue;
		if (typeof value === "string") try {
			if (value.startsWith("{") || value.startsWith("[")) data[key] = normalizeLocalMediaValue(JSON.parse(value));
			else data[key] = value;
		} catch {
			data[key] = value;
		}
		else data[key] = value;
	}
	Object.defineProperty(data, CURSOR_RAW_VALUES, {
		value: rawDateValues,
		enumerable: false,
		configurable: false,
		writable: false
	});
	return data;
}
/**
* Map revision data (already-parsed JSON object) to entry data.
* Strips _-prefixed metadata keys (e.g. _slug) used internally by revisions.
*/
function mapRevisionData(data) {
	const result = {};
	for (const [key, value] of Object.entries(data)) {
		if (key.startsWith("_")) continue;
		result[key] = normalizeLocalMediaValue(value);
	}
	return result;
}
var virtualConfig;
var virtualCreateDialect;
async function loadVirtualModules() {
	if (virtualConfig === void 0) virtualConfig = (await import("./config_C9rc4I7T.mjs")).default;
	if (virtualCreateDialect === void 0) virtualCreateDialect = (await import("./dialect_BmWjYCdG.mjs")).createDialect;
}
/**
* Get the primary sort field from an orderBy spec (first valid field, or default).
*/
function getPrimarySort(orderBy, tablePrefix) {
	if (orderBy) {
		for (const [field, direction] of Object.entries(orderBy)) if (FIELD_NAME_PATTERN.test(field)) return {
			field: tablePrefix ? `${tablePrefix}.${field}` : field,
			direction
		};
	}
	return {
		field: tablePrefix ? `${tablePrefix}.created_at` : "created_at",
		direction: "desc"
	};
}
/**
* Build ORDER BY clause from orderBy spec
* Validates field names to prevent SQL injection (alphanumeric + underscore only)
* Supports multiple sort fields in object key order
*/
function buildOrderByClause(orderBy, tablePrefix) {
	if (!orderBy || Object.keys(orderBy).length === 0) {
		const field = tablePrefix ? `${tablePrefix}.created_at` : "created_at";
		return sql`ORDER BY ${sql.ref(field)} DESC, ${sql.ref(tablePrefix ? `${tablePrefix}.id` : "id")} DESC`;
	}
	const sortParts = [];
	for (const [field, direction] of Object.entries(orderBy)) {
		if (!FIELD_NAME_PATTERN.test(field)) continue;
		const fullField = tablePrefix ? `${tablePrefix}.${field}` : field;
		const dir = direction === "asc" ? sql`ASC` : sql`DESC`;
		sortParts.push(sql`${sql.ref(fullField)} ${dir}`);
	}
	if (sortParts.length === 0) {
		const defaultField = tablePrefix ? `${tablePrefix}.created_at` : "created_at";
		return sql`ORDER BY ${sql.ref(defaultField)} DESC, ${sql.ref(tablePrefix ? `${tablePrefix}.id` : "id")} DESC`;
	}
	const primary = getPrimarySort(orderBy, tablePrefix);
	const idField = tablePrefix ? `${tablePrefix}.id` : "id";
	const idDir = primary.direction === "asc" ? sql`ASC` : sql`DESC`;
	sortParts.push(sql`${sql.ref(idField)} ${idDir}`);
	return sql`ORDER BY ${sql.join(sortParts, sql`, `)}`;
}
/**
* Build a cursor WHERE condition for keyset pagination.
* Uses the primary sort field + id as tiebreaker for stable ordering.
*
* Throws `InvalidCursorError` if the cursor is malformed; callers should
* let this propagate so users see a real error rather than silently
* falling back to the first page.
*/
function buildCursorCondition(cursor, orderBy, tablePrefix) {
	const { orderValue, id: cursorId } = decodeCursor(cursor);
	const primary = getPrimarySort(orderBy, tablePrefix);
	const idField = tablePrefix ? `${tablePrefix}.id` : "id";
	if (primary.direction === "desc") return sql`(${sql.ref(primary.field)} < ${orderValue} OR (${sql.ref(primary.field)} = ${orderValue} AND ${sql.ref(idField)} < ${cursorId}))`;
	return sql`(${sql.ref(primary.field)} > ${orderValue} OR (${sql.ref(primary.field)} = ${orderValue} AND ${sql.ref(idField)} > ${cursorId}))`;
}
/** Type guard: is the where value a range object (not a string or array)? */
function isWhereRange(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/**
* Build AND conditions for non-taxonomy field filters.
* Returns an array of sql fragments; empty if no field filters apply.
* Field names are validated against FIELD_NAME_PATTERN to prevent injection.
*/
function buildFieldConditions(fields, tablePrefix) {
	const conditions = [];
	for (const [key, value] of Object.entries(fields)) {
		if (!FIELD_NAME_PATTERN.test(key)) {
			console.warn(`[emdash] where filter: invalid field name "${key}" ignored`);
			continue;
		}
		if (value == null) continue;
		const ref = tablePrefix ? sql.ref(`${tablePrefix}.${key}`) : sql.ref(key);
		if (isWhereRange(value)) {
			if (value.gt !== void 0) conditions.push(sql`${ref} > ${value.gt}`);
			if (value.gte !== void 0) conditions.push(sql`${ref} >= ${value.gte}`);
			if (value.lt !== void 0) conditions.push(sql`${ref} < ${value.lt}`);
			if (value.lte !== void 0) conditions.push(sql`${ref} <= ${value.lte}`);
		} else if (Array.isArray(value)) {
			if (value.length > 0) conditions.push(sql`${ref} IN (${sql.join(value.map((v) => sql`${v}`))})`);
		} else conditions.push(sql`${ref} = ${value}`);
	}
	return conditions;
}
/**
* Resolve a taxonomy filter (`name` + one or more `slug`s, optionally scoped to
* `locale`) to the set of `translation_group`s the pivot stores in
* `content_taxonomies.taxonomy_id`. Exact terms only — no subtree expansion.
*
* Mirrors the meaning of the old EXISTS join (`t.name = ? AND t.slug IN (?)
* [AND t.locale = ?]`): a pivot row matches when its group has a term with that
* name/slug in the active locale. Resolving to explicit values (rather than an
* `IN (subquery)`) keeps the single-term case a plain equality on the pivot
* index, which is what gives the clean early-`LIMIT` seek.
*/
async function resolveTermGroups(db, name, slugs, locale) {
	let query = db.selectFrom("taxonomies").select("translation_group").distinct().where("name", "=", name).where("slug", "in", slugs);
	if (locale) query = query.where("locale", "=", locale);
	const rows = await query.execute();
	const groups = /* @__PURE__ */ new Set();
	for (const row of rows) if (row.translation_group) groups.add(row.translation_group);
	return [...groups];
}
/** Equality (single) or `IN` (multiple) condition on a pivot group column. */
function pivotGroupCondition(ref, groups) {
	if (groups.length === 1) return sql`${sql.ref(ref)} = ${groups[0]}`;
	return sql`${sql.ref(ref)} IN (${sql.join(groups.map((g) => sql`${g}`))})`;
}
/** LIMIT/OFFSET fragment matching the loader's single-table variant. */
function buildPivotLimitOffset(db, fetchLimit, offset) {
	if (fetchLimit != null && offset != null) return sql`LIMIT ${fetchLimit} OFFSET ${offset}`;
	if (fetchLimit != null) return sql`LIMIT ${fetchLimit}`;
	if (offset != null) return isPostgres(db) ? sql`OFFSET ${offset}` : sql`LIMIT -1 OFFSET ${offset}`;
	return sql``;
}
/**
* Build the pivot-driven taxonomy listing query (#1834).
*
* Drives from a pivot-only CTE (`picked`) that carries the sort column, seeks
* the term on a `(taxonomy_id, collection, deleted_at, [locale,] <sort> DESC,
* entry_id DESC)` index, and lets `LIMIT` short-circuit; then joins `ec_*` by primary
* key to hydrate the page **and re-checks the real filter predicates on the
* joined row** — the pivot columns are advisory (non-atomic re-stamp on D1), so
* `ec_*` is authoritative for membership. Ordering stays pivot-driven to keep
* the early-`LIMIT`.
*
* Two shapes:
* - **Indexed sort** (`published_at`/`created_at`, single sort field): the
*   pivot index is covering for `(entry_id, sortval)`, so `LIMIT` lives in
*   `picked` and short-circuits.
* - **Temp-sort** (`updated_at` or any other field, or multi-field sort): no
*   pivot sort index applies, so `picked` collects the tagged candidate set and
*   the outer query sorts the joined rows. Bounded to tagged rows — no
*   `ec_*` full scan — but no early-`LIMIT`.
*/
function buildTaxonomyPivotQuery(opts) {
	const { db, collection, tableName, groupSets, orderBy, cursor, locale, status, deletedIsNull, bylineGroups, fetchLimit, offset } = opts;
	const primary = getPrimarySort(orderBy);
	const isIndexedSort = (orderBy ? Object.keys(orderBy).filter((k) => FIELD_NAME_PATTERN.test(k)) : []).length <= 1 && (primary.field === "published_at" || primary.field === "created_at");
	const dir = primary.direction === "asc" ? sql`ASC` : sql`DESC`;
	const cmp = primary.direction === "asc" ? sql.raw(">") : sql.raw("<");
	const firstGroups = groupSets[0] ?? [];
	const restGroups = groupSets.slice(1);
	const multiGroup = firstGroups.length > 1;
	const deletedCt = deletedIsNull ? sql`ct.deleted_at IS NULL` : sql`ct.deleted_at IS NOT NULL`;
	const statusCt = status !== void 0 ? sql`AND ${buildStatusCondition(db, status, "ct")}` : sql``;
	const localeCt = locale ? sql`AND ct.locale = ${locale}` : sql``;
	const residual = restGroups.length > 0 ? sql`${sql.join(restGroups.map((g) => sql`AND EXISTS (
						SELECT 1 FROM content_taxonomies ct2
						WHERE ct2.collection = ${collection}
							AND ct2.entry_id = ct.entry_id
							AND ${pivotGroupCondition("ct2.taxonomy_id", g)}
					)`), sql` `)}` : sql``;
	const bylineCt = bylineGroups ? sql`AND EXISTS (
				SELECT 1 FROM _emdash_content_bylines cb
				WHERE cb.collection_slug = ${collection}
					AND cb.content_id = ct.entry_id
					AND cb.byline_id IN (${sql.join(bylineGroups.map((g) => sql`${g}`))})
			)` : sql``;
	const firstGroupCond = pivotGroupCondition("ct.taxonomy_id", firstGroups);
	const { terms: termsSelect, bylines: bylinesSelect } = foldedHydrationSelects(db, collection, "r");
	const deletedR = deletedIsNull ? sql`r.deleted_at IS NULL` : sql`r.deleted_at IS NOT NULL`;
	const statusR = status !== void 0 ? sql`AND ${buildStatusCondition(db, status, "r")}` : sql``;
	const localeR = locale ? sql`AND r.locale = ${locale}` : sql``;
	if (isIndexedSort) {
		const sortRef = sql.ref(`ct.${primary.field}`);
		const sortval = multiGroup ? sql`MAX(${sortRef})` : sortRef;
		const groupByClause = multiGroup ? sql`GROUP BY ct.entry_id` : sql``;
		let cursorClause = sql``;
		let havingClause = sql``;
		if (cursor) {
			const { orderValue, id } = decodeCursor(cursor);
			const cond = sql`(${sortval} ${cmp} ${orderValue} OR (${sortval} = ${orderValue} AND ct.entry_id ${cmp} ${id}))`;
			if (multiGroup) havingClause = sql`HAVING ${cond}`;
			else cursorClause = sql`AND ${cond}`;
		}
		const limitClause = buildPivotLimitOffset(db, fetchLimit, offset);
		return sql`
			WITH picked AS (
				SELECT ct.entry_id AS entry_id, ${sortval} AS sortval
				FROM content_taxonomies ct
				WHERE ct.collection = ${collection}
					AND ${firstGroupCond}
					AND ${deletedCt}
					${statusCt}
					${localeCt}
					${residual}
					${bylineCt}
					${cursorClause}
				${groupByClause}
				${havingClause}
				ORDER BY sortval ${dir}, ct.entry_id ${dir}
				${limitClause}
			)
			SELECT r.*, ${termsSelect}, ${bylinesSelect}
			FROM picked JOIN ${sql.ref(tableName)} AS r ON r.id = picked.entry_id
			WHERE ${deletedR} ${statusR} ${localeR}
			ORDER BY picked.sortval ${dir}, picked.entry_id ${dir}
		`;
	}
	const orderByClause = buildOrderByClause(orderBy, "r");
	const cursorCond = cursor ? sql`AND ${buildCursorCondition(cursor, orderBy, "r")}` : sql``;
	const limitClause = buildPivotLimitOffset(db, fetchLimit, offset);
	return sql`
		WITH picked AS (
			SELECT DISTINCT ct.entry_id AS entry_id
			FROM content_taxonomies ct
			WHERE ct.collection = ${collection}
				AND ${firstGroupCond}
				AND ${deletedCt}
				${statusCt}
				${localeCt}
				${residual}
				${bylineCt}
		)
		SELECT r.*, ${termsSelect}, ${bylinesSelect}
		FROM picked JOIN ${sql.ref(tableName)} AS r ON r.id = picked.entry_id
		WHERE ${deletedR} ${statusR} ${localeR}
			${cursorCond}
		${orderByClause}
		${limitClause}
	`;
}
var dbInstance = null;
/**
* Get the database instance. Used by query wrapper functions and middleware.
*
* Checks the ALS request context first — if a per-request DB override is set
* (e.g. by DO preview middleware), it takes precedence over the module-level
* cached instance. This allows preview mode to route queries to an isolated
* Durable Object database without modifying any calling code.
*
* Initializes the default database on first call using config from virtual module.
*/
async function getDb() {
	const ctx = getRequestContext();
	if (ctx?.db) return ctx.db;
	if (!dbInstance) {
		await loadVirtualModules();
		if (!virtualConfig?.database || typeof virtualCreateDialect !== "function") throw new Error("EmDash database not configured. Add database config to emdash() in astro.config.mjs");
		dbInstance = new Kysely({
			dialect: virtualCreateDialect(virtualConfig.database.config),
			log: kyselyLogOption()
		});
	}
	return dbInstance;
}
/**
* Create an EmDash Live Collections loader
*
* This loader handles ALL content types in a single Astro collection.
* Use `getEmDashCollection()` and `getEmDashEntry()` to query
* specific content types.
*
* Database is configured in astro.config.mjs via the emdash() integration.
*
* @example
* ```ts
* // src/live.config.ts
* import { defineLiveCollection } from "astro:content";
* import { emdashLoader } from "emdash";
*
* export const collections = {
*   emdash: defineLiveCollection({
*     loader: emdashLoader(),
*   }),
* };
* ```
*/
function emdashLoader() {
	return {
		name: "emdash",
		async loadCollection({ filter }) {
			try {
				const db = await getDb();
				const type = filter?.type;
				if (!type) return { error: /* @__PURE__ */ new Error("type filter is required. Use getEmDashCollection() instead of getLiveCollection() directly.") };
				const tableName = getTableName(type);
				const status = filter?.status || "published";
				const limit = filter?.limit;
				const cursor = filter?.cursor;
				const where = filter?.where;
				const orderBy = filter?.orderBy;
				const locale = filter?.locale;
				const fetchLimit = limit ? limit + 1 : void 0;
				const rawOffset = cursor ? void 0 : filter?.offset;
				const offset = typeof rawOffset === "number" && Number.isInteger(rawOffset) && rawOffset > 0 ? rawOffset : void 0;
				const cursorCondition = cursor ? buildCursorCondition(cursor, orderBy) : null;
				let result;
				const taxonomyFilters = [];
				let bylineFilter = null;
				const fieldFilters = {};
				if (where && Object.keys(where).length > 0) {
					const taxNames = await getTaxonomyNames(db);
					for (const [key, value] of Object.entries(where)) {
						if (value == null) continue;
						if (key === "byline") {
							if (isWhereRange(value)) {
								console.warn(`[emdash] where filter: range operators are not supported on "byline", ignored`);
								continue;
							}
							bylineFilter = { groups: Array.isArray(value) ? value : [value] };
						} else if (taxNames.has(key)) {
							if (isWhereRange(value)) {
								console.warn(`[emdash] where filter: range operators are not supported on taxonomy "${key}", ignored`);
								continue;
							}
							const slugs = Array.isArray(value) ? value : [value];
							taxonomyFilters.push({
								name: key,
								slugs
							});
						} else fieldFilters[key] = value;
					}
				}
				if (bylineFilter && bylineFilter.groups.length === 0 || taxonomyFilters.some((f) => f.slugs.length === 0)) return {
					entries: [],
					cacheHint: { tags: [type] }
				};
				if (taxonomyFilters.length > 0 && Object.keys(fieldFilters).length === 0) {
					const groupSets = [];
					for (const taxFilter of taxonomyFilters) {
						const groups = await resolveTermGroups(db, taxFilter.name, taxFilter.slugs, locale);
						if (groups.length === 0) return {
							entries: [],
							cacheHint: { tags: [type] }
						};
						groupSets.push(groups);
					}
					result = await buildTaxonomyPivotQuery({
						db,
						collection: type,
						tableName,
						groupSets,
						orderBy,
						cursor,
						locale,
						status,
						deletedIsNull: true,
						bylineGroups: bylineFilter ? bylineFilter.groups : null,
						fetchLimit,
						offset
					}).execute(db);
				} else {
					const orderByClause = buildOrderByClause(orderBy);
					const statusCondition = buildStatusCondition(db, status);
					const localeFilter = locale ? sql`AND locale = ${locale}` : sql``;
					const cursorCond = cursorCondition ? sql`AND ${cursorCondition}` : sql``;
					const fieldConds = buildFieldConditions(fieldFilters);
					const fieldCondsSQL = fieldConds.length > 0 ? sql`${sql.join(fieldConds, sql` AND `)}` : null;
					const taxonomyCond = taxonomyFilters.length > 0 ? sql`${sql.join(taxonomyFilters.map((f) => sql`AND EXISTS (
							SELECT 1 FROM content_taxonomies ct
							INNER JOIN taxonomies t ON t.translation_group = ct.taxonomy_id
							WHERE ct.collection = ${type}
								AND ct.entry_id = ${sql.ref(tableName)}.id
								AND t.name = ${f.name}
								AND t.slug IN (${sql.join(f.slugs.map((s) => sql`${s}`))})
							${locale ? sql`AND t.locale = ${locale}` : sql``}
						)`), sql` `)}` : sql``;
					const bylineCond = bylineFilter ? sql`AND EXISTS (
							SELECT 1 FROM _emdash_content_bylines cb
							WHERE cb.collection_slug = ${type}
								AND cb.content_id = ${sql.ref(tableName)}.id
								AND cb.byline_id IN (${sql.join(bylineFilter.groups.map((g) => sql`${g}`))})
						)` : sql``;
					const { terms: termsSelect, bylines: bylinesSelect } = foldedHydrationSelects(db, type, tableName);
					let limitOffsetClause = sql``;
					if (fetchLimit != null && offset != null) limitOffsetClause = sql`LIMIT ${fetchLimit} OFFSET ${offset}`;
					else if (fetchLimit != null) limitOffsetClause = sql`LIMIT ${fetchLimit}`;
					else if (offset != null) limitOffsetClause = isPostgres(db) ? sql`OFFSET ${offset}` : sql`LIMIT -1 OFFSET ${offset}`;
					result = await sql`
						SELECT *, ${termsSelect}, ${bylinesSelect} FROM ${sql.ref(tableName)}
						WHERE deleted_at IS NULL
						AND ${statusCondition}
						${localeFilter}
						${cursorCond}
						${taxonomyCond}
						${bylineCond}
						${fieldCondsSQL ? sql`AND ${fieldCondsSQL}` : sql``}
						${orderByClause}
						${limitOffsetClause}
					`.execute(db);
				}
				const hasMore = limit ? result.rows.length > limit : false;
				const rows = hasMore ? result.rows.slice(0, limit) : result.rows;
				const i18nConfig = virtualConfig?.i18n;
				const i18nEnabled = i18nConfig && i18nConfig.locales.length > 1;
				const entries = rows.map((row) => {
					const slug = rowStr(row, "slug") || rowStr(row, "id");
					const rowLocale = rowStr(row, "locale");
					const id = i18nEnabled && rowLocale !== "" && (rowLocale !== i18nConfig.defaultLocale || i18nConfig.prefixDefaultLocale) ? `${rowLocale}/${slug}` : slug;
					const data = mapRowToData(row);
					stashFolded(data, row);
					return {
						id,
						slug: rowStr(row, "slug"),
						status: rowStr(row, "status", "draft"),
						data,
						cacheHint: {
							tags: [rowStr(row, "id")],
							lastModified: row.updated_at ? new Date(rowStr(row, "updated_at")) : void 0
						}
					};
				});
				let nextCursor;
				if (hasMore && rows.length > 0) {
					const lastRow = rows.at(-1);
					const primary = getPrimarySort(orderBy);
					const lastOrderValue = lastRow[primary.field.includes(".") ? primary.field.split(".").pop() : primary.field];
					nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
				}
				let collectionLastModified;
				for (const row of rows) if (row.updated_at) {
					const d = new Date(rowStr(row, "updated_at"));
					if (!collectionLastModified || d > collectionLastModified) collectionLastModified = d;
				}
				return {
					entries,
					nextCursor,
					cacheHint: {
						tags: [type],
						lastModified: collectionLastModified
					}
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				if (isMissingTableError(error) || isMissingColumnError(error)) {
					if (isMissingColumnError(error)) console.warn(`[emdash] where filter: ${message}`);
					return { entries: [] };
				}
				return { error: /* @__PURE__ */ new Error(`Failed to load collection: ${message}`) };
			}
		},
		async loadEntry({ filter }) {
			try {
				const db = await getDb();
				const type = filter?.type;
				const id = filter?.id;
				if (!type || !id) return { error: /* @__PURE__ */ new Error("type and id filters are required. Use getEmDashEntry() instead of getLiveEntry() directly.") };
				const tableName = getTableName(type);
				const locale = filter?.locale;
				const { terms: termsSelect, bylines: bylinesSelect } = foldedHydrationSelects(db, type, "c");
				const seoSelect = foldedSeoSelect(db, type, "c");
				const row = (locale ? await sql`
							SELECT c.*, ${seoSelect}, ${termsSelect}, ${bylinesSelect}
							FROM ${sql.ref(tableName)} AS c
							WHERE c.deleted_at IS NULL
							AND ((c.slug = ${id} AND c.locale = ${locale}) OR c.id = ${id})
							LIMIT 1
						`.execute(db) : await sql`
							SELECT c.*, ${seoSelect}, ${termsSelect}, ${bylinesSelect}
							FROM ${sql.ref(tableName)} AS c
							WHERE c.deleted_at IS NULL
							AND (c.slug = ${id} OR c.id = ${id})
							LIMIT 1
						`.execute(db)).rows[0];
				if (!row) return;
				expandFoldedSeo(row);
				const i18nConfig = virtualConfig?.i18n;
				const i18nEnabled = i18nConfig && i18nConfig.locales.length > 1;
				const entrySlug = rowStr(row, "slug") || rowStr(row, "id");
				const entryLocale = rowStr(row, "locale");
				const entryId = i18nEnabled && entryLocale !== "" && (entryLocale !== i18nConfig.defaultLocale || i18nConfig.prefixDefaultLocale) ? `${entryLocale}/${entrySlug}` : entrySlug;
				const revisionId = filter?.revisionId;
				if (revisionId) {
					const revData = (await sql`
						SELECT data FROM revisions
						WHERE id = ${revisionId}
						LIMIT 1
					`.execute(db)).rows[0];
					if (revData) {
						const parsed = JSON.parse(revData.data);
						const systemData = {};
						for (const [key, mappedKey] of Object.entries(INCLUDE_IN_DATA)) if (key in row) if (DATE_COLUMNS.has(key)) systemData[mappedKey] = typeof row[key] === "string" ? new Date(row[key]) : null;
						else systemData[mappedKey] = row[key];
						const slug = typeof parsed._slug === "string" ? parsed._slug : rowStr(row, "slug");
						const revSlug = slug || rowStr(row, "id");
						const revLocale = rowStr(row, "locale");
						const revId = i18nEnabled && revLocale !== "" && (revLocale !== i18nConfig.defaultLocale || i18nConfig.prefixDefaultLocale) ? `${revLocale}/${revSlug}` : revSlug;
						const revEntryData = {
							...systemData,
							slug,
							...mapRevisionData(parsed)
						};
						const revSeo = extractSeo(row);
						if (revSeo) revEntryData.seo = revSeo;
						return {
							id: revId,
							slug,
							status: rowStr(row, "status", "draft"),
							data: revEntryData,
							cacheHint: {
								tags: [rowStr(row, "id")],
								lastModified: row.updated_at ? new Date(rowStr(row, "updated_at")) : void 0
							}
						};
					}
				}
				const entryData = mapRowToData(row);
				const entrySeo = extractSeo(row);
				if (entrySeo) entryData.seo = entrySeo;
				stashFolded(entryData, row);
				return {
					id: entryId,
					slug: rowStr(row, "slug"),
					status: rowStr(row, "status", "draft"),
					data: entryData,
					cacheHint: {
						tags: [rowStr(row, "id")],
						lastModified: row.updated_at ? new Date(rowStr(row, "updated_at")) : void 0
					}
				};
			} catch (error) {
				if (isMissingTableError(error)) return;
				const message = error instanceof Error ? error.message : String(error);
				return { error: /* @__PURE__ */ new Error(`Failed to load entry: ${message}`) };
			}
		}
	};
}
//#endregion
export { getDb as a, createRecorder as c, kyselyLogOption as d, emdashLoader as i, flushRecorder as l, FOLDED_BYLINES as n, loader_exports as o, FOLDED_TERMS as r, resetTaxonomyNamesCache as s, CURSOR_RAW_VALUES as t, isInstrumentationEnabled as u };
