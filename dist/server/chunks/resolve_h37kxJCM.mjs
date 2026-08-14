import { t as sql } from "./dist_D4nVBoqy.mjs";
import { t as PostgresAdapter } from "./postgres-adapter_Yfi1sMc9.mjs";
import { t as getRequestContext } from "./request-context_E8kV37BM.mjs";
import { n as getI18nConfig, r as isI18nEnabled, t as getFallbackChain } from "./config_BJC5khv8.mjs";
//#region self-essentials/emdash-main/packages/core/src/database/dialect-helpers.ts
/**
* Detect dialect type from a Kysely instance via the adapter class.
*/
function detectDialect(db) {
	if (db.getExecutor().adapter instanceof PostgresAdapter) return "postgres";
	return "sqlite";
}
function isSqlite(db) {
	return detectDialect(db) === "sqlite";
}
function isPostgres(db) {
	return detectDialect(db) === "postgres";
}
/**
* The backend's compound-SELECT ceiling, or null when it has none worth
* splitting statements for. Only the adapter knows: the limit is a property of
* the SQLite build behind the dialect, not of the SQL flavour, so two "sqlite"
* dialects can answer differently.
*
* A declared ceiling must be a positive integer — callers batch by it, and
* every other value silently misbehaves rather than failing: 0 and negatives
* never advance the batch cursor, fractions overlap batches and double-count,
* NaN yields an empty batch. A malformed declaration throws here, where the
* message can name the adapter.
*/
function compoundSelectLimit(db) {
	const adapter = db.getExecutor().adapter;
	if (!("compoundSelectLimit" in adapter)) return null;
	const limit = adapter.compoundSelectLimit;
	if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1) throw new Error(`${adapter.constructor.name} declares compoundSelectLimit ${String(limit)}; it must be a positive integer.`);
	return limit;
}
/**
* Default timestamp expression for column defaults.
* Wrapped in parens for use in CREATE TABLE ... DEFAULT (...).
*
* sqlite:   (datetime('now'))
* postgres: CURRENT_TIMESTAMP
*/
function currentTimestamp(db) {
	if (isPostgres(db)) return sql`CURRENT_TIMESTAMP`;
	return sql`(datetime('now'))`;
}
/**
* Timestamp expression for use in WHERE clauses and SET expressions.
* No wrapping parens.
*
* sqlite:   datetime('now')
* postgres: CURRENT_TIMESTAMP
*/
function currentTimestampValue(db) {
	if (isPostgres(db)) return sql`CURRENT_TIMESTAMP`;
	return sql`datetime('now')`;
}
/**
* Build WHERE clause for status filtering on a content table.
* When filtering for 'published' status, also include scheduled content
* whose scheduled_at time has passed (treating it as effectively published).
*
* Visibility is computed, not flipped by cron, so a literal
* `status = 'published'` comparison undercounts scheduled-and-due entries —
* every "publicly visible" filter must go through this helper.
*/
function buildStatusCondition(db, status, tablePrefix) {
	const statusField = tablePrefix ? `${tablePrefix}.status` : "status";
	const scheduledAtField = tablePrefix ? `${tablePrefix}.scheduled_at` : "scheduled_at";
	if (status === "published") {
		const scheduledAtExpr = isPostgres(db) ? sql`${sql.ref(scheduledAtField)}::timestamptz` : sql.ref(scheduledAtField);
		const nowExpr = isPostgres(db) ? currentTimestampValue(db) : sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`;
		return sql`(${sql.ref(statusField)} = 'published' OR (${sql.ref(statusField)} = 'scheduled' AND ${scheduledAtExpr} <= ${nowExpr}))`;
	}
	return sql`${sql.ref(statusField)} = ${status}`;
}
/**
* Check if a table exists in the database.
*/
async function tableExists(db, tableName) {
	if (isPostgres(db)) return (await sql`
			SELECT EXISTS(
				SELECT 1 FROM information_schema.tables
				WHERE table_schema = current_schema() AND table_name = ${tableName}
			) as exists
		`.execute(db)).rows[0]?.exists === true;
	return (await sql`
		SELECT name FROM sqlite_master
		WHERE type = 'table' AND name = ${tableName}
	`.execute(db)).rows.length > 0;
}
/**
* List tables matching a LIKE pattern.
*/
async function listTablesLike(db, pattern) {
	if (isPostgres(db)) return (await sql`
			SELECT table_name FROM information_schema.tables
			WHERE table_schema = current_schema() AND table_name LIKE ${pattern}
		`.execute(db)).rows.map((r) => r.table_name);
	return (await sql`
		SELECT name FROM sqlite_master
		WHERE type = 'table' AND name LIKE ${pattern}
	`.execute(db)).rows.map((r) => r.name);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/utils/chunks.ts
/**
* Split an array into chunks of at most `size` elements.
*
* Used to keep SQL `IN (?, ?, …)` clauses within Cloudflare D1's
* bound-parameter limit (~100 per statement).
*/
function chunks(arr, size) {
	if (arr.length === 0) return [];
	const result = [];
	for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
	return result;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/i18n/resolve.ts
/**
* Shared locale-resolution helpers.
*
* Matches the pattern used by `query.ts` for content: an explicit locale wins,
* otherwise we fall back to the request-context locale, otherwise to
* `defaultLocale` when i18n is enabled, otherwise to `undefined` (meaning "do
* not filter by locale" — legacy single-locale behaviour).
*/
/**
* Resolve the locale to use for a query given an optional explicit value.
* Returns `undefined` when no locale information is available; callers should
* treat that as "do not filter by locale".
*/
function resolveLocale(explicit) {
	if (explicit !== void 0) return explicit;
	const ctxLocale = getRequestContext()?.locale;
	if (ctxLocale !== void 0) return ctxLocale;
	const cfg = getI18nConfig();
	if (cfg && isI18nEnabled()) return cfg.defaultLocale;
}
/**
* Fallback chain to try when looking up a single item. When i18n is disabled
* or the locale is unspecified, returns a single-element array (or empty when
* no locale resolves) so callers can iterate uniformly.
*/
function resolveLocaleChain(explicit) {
	const locale = resolveLocale(explicit);
	if (locale === void 0) return [];
	if (!isI18nEnabled()) return [locale];
	return getFallbackChain(locale);
}
var REPEATED_SLASHES = /\/{2,}/g;
/**
* Interpolate a collection `url_pattern` with a row's slug and id.
*
* Falls back to `/{collection}/{slug}` when no pattern is configured.
* Does NOT apply any locale prefix — pass the result through
* Astro's `getRelativeLocaleUrl` / `getAbsoluteLocaleUrl` (or the
* `localizePath` helper below) to add the locale segment.
*/
function interpolateUrlPattern(options) {
	const { pattern, collection, slug, id } = options;
	let path = (pattern ?? `/${encodeURIComponent(collection)}/{slug}`).replace("{slug}", encodeURIComponent(slug)).replace("{id}", encodeURIComponent(id));
	path = path.replace(REPEATED_SLASHES, "/");
	if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
	if (!path.startsWith("/")) path = `/${path}`;
	return path;
}
/**
* Apply a locale prefix to a path, honouring the user's Astro `i18n`
* routing config (`prefixDefaultLocale`, custom `path`/`codes` mappings).
*
* Reads the resolved config from `astro:config/server`, which is always
* available regardless of whether i18n is enabled -- so this function
* works in both i18n and non-i18n builds without tripping Astro's
* `i18nNotEnabled` resolver (the case with importing `astro:i18n`).
*
* Returns:
*   - The original `path` when i18n is not configured.
*   - The original `path` for the default locale when
*     `prefixDefaultLocale` is false.
*   - `/{segment}{path}` for any other configured locale, where
*     `{segment}` is the locale's custom `path` if one is set,
*     otherwise the locale code.
*   - `null` when the row's locale isn't in the configured list.
*     Callers should drop the entry: a sitemap link to a route the
*     site can't serve is worse than no link at all (search engines
*     get a 404 / soft-404 and downrank the page).
*
* Falls back to `getI18nConfig()` (EmDash's mirror of the same config,
* populated at runtime startup) when `astro:config/server` is
* unavailable -- e.g. running outside an Astro build context, such as
* in vitest.
*/
async function localizePath(path, locale) {
	const segment = await resolveLocaleSegment(locale);
	if (segment === void 0) return null;
	if (segment === null || segment === "") return normalizePath(path);
	return normalizePath(`/${segment}${path}`);
}
/**
* Resolve the URL segment to use for a locale.
*
* Returns:
*   - `null` when i18n isn't configured (caller should not prefix).
*   - `""` when the locale is the default locale and
*     `prefixDefaultLocale` is false (caller should not prefix).
*   - The locale's custom `path` value, or the locale string itself.
*   - `undefined` when the locale isn't in the configured list --
*     the row points at a route the site can't serve.
*/
async function resolveLocaleSegment(locale) {
	const i18n = await readAstroI18nConfig();
	if (!i18n || !i18n.locales || i18n.locales.length <= 1) return null;
	if (locale === i18n.defaultLocale && !i18n.prefixDefaultLocale) return "";
	for (const entry of i18n.locales) if (typeof entry === "string") {
		if (entry === locale) return entry;
	} else if (entry.codes.includes(locale)) return entry.path;
}
var astroI18nCache;
async function readAstroI18nConfig() {
	if (astroI18nCache !== void 0) return astroI18nCache;
	try {
		const mod = await import("./server_D5T5vt3s.mjs");
		if (!mod.i18n) {
			astroI18nCache = null;
			return null;
		}
		const routing = mod.i18n.routing;
		astroI18nCache = {
			defaultLocale: mod.i18n.defaultLocale,
			locales: mod.i18n.locales,
			prefixDefaultLocale: typeof routing === "object" ? routing.prefixDefaultLocale ?? false : false
		};
		return astroI18nCache;
	} catch {
		const cfg = getI18nConfig();
		if (!cfg || !isI18nEnabled()) {
			astroI18nCache = null;
			return null;
		}
		astroI18nCache = {
			defaultLocale: cfg.defaultLocale,
			locales: cfg.locales,
			prefixDefaultLocale: cfg.prefixDefaultLocale
		};
		return astroI18nCache;
	}
}
function normalizePath(path) {
	let p = path.replace(REPEATED_SLASHES, "/");
	if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
	if (!p.startsWith("/")) p = `/${p}`;
	return p;
}
//#endregion
export { chunks as a, currentTimestamp as c, tableExists as d, resolveLocaleChain as i, isSqlite as l, localizePath as n, buildStatusCondition as o, resolveLocale as r, compoundSelectLimit as s, interpolateUrlPattern as t, listTablesLike as u };
