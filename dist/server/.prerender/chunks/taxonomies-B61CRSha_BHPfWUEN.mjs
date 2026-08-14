import { a as sql } from "./migrator_BiAfLowp.mjs";
import { a as getDb, s as resetTaxonomyNamesCache } from "./loader-C1XOLV5b_BlhHvfIP.mjs";
import { b as validateIdentifier, d as compoundSelectLimit, r as __exportAll, u as buildStatusCondition } from "./runner-BsI18UgP_CTLRmh7U.mjs";
import { n as getRequestContext } from "./request-context_K9BAblf6.mjs";
import { d as isObjectCacheActive, n as cachedQuery, r as contentNamespace, t as CacheNamespace, u as invalidateTaxonomyObjectCache } from "./object-cache-Bok5j2ae_B1rhuniT.mjs";
import { t as chunks } from "./chunks-D5dlPeRb_ZmalEYon.mjs";
import { n as isMissingTableError } from "./db-errors-CcWLaRiR_Bz5UsdxN.mjs";
import { i as setRequestCacheEntry, n as peekRequestCache, r as requestCached } from "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import { n as resolveLocaleChain, t as resolveLocale } from "./resolve-BUvFE0Lr_pKrvCeOd.mjs";
//#region self-essentials/emdash-main/packages/core/dist/taxonomies-B61CRSha.mjs
/**
* Per-collection count branch. `taxonomy_id` stores the term's
* translation_group, so results are keyed by group (locale-independent) and
* each assignment is counted once no matter how many locales the term has.
*
* Scoping to the taxonomy uses `translation_group IN (...)` rather than a
* join on `taxonomies.id` — the anchor row (id == group) can be deleted while
* sibling translations survive, and a plain join on `translation_group` would
* multiply counts by the number of locales.
*
* CROSS JOIN with the join predicate in WHERE keeps stats-blind SQLite/D1 from
* reordering content_taxonomies out of the outer position; it touches ec_* only
* by primary key. Postgres treats this as an ordinary inner join and plans freely.
*/
function collectionBranch(db, taxonomyName, collection) {
	return sql`
		SELECT ct.taxonomy_id AS taxonomy_id, COUNT(*) AS count
		FROM content_taxonomies AS ct
		CROSS JOIN ${sql.ref(`ec_${collection}`)} AS e
		WHERE e.id = ct.entry_id
			AND ct.collection = ${collection}
			AND ct.taxonomy_id IN (SELECT translation_group FROM taxonomies WHERE name = ${taxonomyName})
			AND ${buildStatusCondition(db, "published", "e")}
			AND e.deleted_at IS NULL
		GROUP BY ct.taxonomy_id`;
}
async function runCounts(db, taxonomyName, collections) {
	const branches = collections.map((collection) => collectionBranch(db, taxonomyName, collection));
	const result = await sql`
		SELECT taxonomy_id, SUM(count) AS count
		FROM (${sql.join(branches, sql` UNION ALL `)}) AS per_collection
		GROUP BY taxonomy_id`.execute(db);
	const counts = /* @__PURE__ */ new Map();
	for (const row of result.rows) counts.set(row.taxonomy_id, Number(row.count));
	return counts;
}
function addCounts(into, from) {
	for (const [group, count] of from) into.set(group, (into.get(group) ?? 0) + count);
}
/**
* Counts for one batch of collections, degrading to a query per collection
* when a declared collection has no ec_* table so the rest still contribute.
*/
async function runBatch(db, taxonomyName, collections) {
	try {
		return await runCounts(db, taxonomyName, collections);
	} catch (error) {
		if (!isMissingTableError(error)) throw error;
	}
	const counts = /* @__PURE__ */ new Map();
	for (const collection of collections) try {
		addCounts(counts, await runCounts(db, taxonomyName, [collection]));
	} catch (error) {
		if (!isMissingTableError(error)) throw error;
	}
	return counts;
}
/**
* Count publicly-visible term assignments for one taxonomy, keyed by the
* term's translation_group (what `content_taxonomies.taxonomy_id` stores).
*
* Counts are scoped to the taxonomy's declared collections — pass
* `TaxonomyDef.collections` (`_emdash_taxonomy_defs.collections`). Collections
* whose `ec_*` table doesn't exist (pre-migration drift, a declared collection
* that was never created) are skipped, yielding a partial-but-correct count
* rather than a throw.
*
* One database round-trip for the whole taxonomy (UNION ALL across
* collections). On a backend that caps compound-SELECT terms — D1 allows five
* — the branches are split into one statement per batch, since a taxonomy
* declaring more collections than that would otherwise take down every path
* that shows counts. Per-collection sums are commutative, so batching cannot
* change the total.
*
* Callers on the public render path should go through the request-cached
* wrapper in `taxonomies/index.ts` so a page rendering both the widget and a
* term detail shares one computation.
*/
async function fetchVisibleTermCounts(db, taxonomyName, collections) {
	const unique = [...new Set(collections)];
	for (const collection of unique) validateIdentifier(collection, "collection slug");
	if (unique.length === 0) return /* @__PURE__ */ new Map();
	const limit = compoundSelectLimit(db);
	const batched = limit === null ? [unique] : chunks(unique, limit);
	const batches = await Promise.all(batched.map((batch) => runBatch(db, taxonomyName, batch)));
	const counts = /* @__PURE__ */ new Map();
	for (const batch of batches) addCounts(counts, batch);
	return counts;
}
/**
* Runtime API for taxonomies.
*
* All helpers are locale-aware. When a locale is not passed explicitly we fall
* back to the request context or the configured `defaultLocale` (see
* `i18n/resolve.ts`).
*
* Because `content_taxonomies.taxonomy_id` stores the translation_group (not a
* specific term id), the joins here are `taxonomies.translation_group =
* content_taxonomies.taxonomy_id` + filter by `taxonomies.locale`, which picks
* the right per-locale term.
*/
var taxonomies_exports = /* @__PURE__ */ __exportAll({
	getAllTermsForEntries: () => getAllTermsForEntries,
	getEntriesByTerm: () => getEntriesByTerm,
	getEntryTerms: () => getEntryTerms,
	getTaxonomyDef: () => getTaxonomyDef,
	getTaxonomyDefs: () => getTaxonomyDefs,
	getTaxonomyTerms: () => getTaxonomyTerms,
	getTerm: () => getTerm,
	getTermsForEntries: () => getTermsForEntries,
	invalidateTaxonomyDefsCache: () => invalidateTaxonomyDefsCache,
	invalidateTermCache: () => invalidateTermCache,
	primeFoldedEntryTerms: () => primeFoldedEntryTerms
});
/** Invalidate cached taxonomy term data and any content that hydrates terms. */
function invalidateTermCache() {
	invalidateTaxonomyObjectCache();
}
var TAXONOMY_DEFS_CACHE_KEY = Symbol.for("emdash:taxonomy-defs");
var taxonomyDefsStore = globalThis;
var defsHolder = taxonomyDefsStore[TAXONOMY_DEFS_CACHE_KEY] ?? (() => {
	const h = {
		version: 0,
		cache: /* @__PURE__ */ new Map()
	};
	taxonomyDefsStore[TAXONOMY_DEFS_CACHE_KEY] = h;
	return h;
})();
/**
* Invalidate the isolate-wide taxonomy-definitions cache (and the related
* loader taxonomy-names cache). Called from every taxonomy-def write path
* (`handleTaxonomyCreate`, seed application). Other isolates refresh on their
* next recycle — staleness bounded by isolate lifetime.
*/
function invalidateTaxonomyDefsCache() {
	defsHolder.version++;
	defsHolder.cache.clear();
	resetTaxonomyNamesCache();
	invalidateTaxonomyObjectCache();
}
/**
* Fetch taxonomy definitions straight from the database (no caching).
*/
async function fetchTaxonomyDefs(locale) {
	let query = (await getDb()).selectFrom("_emdash_taxonomy_defs").selectAll();
	if (locale !== void 0) query = query.where("locale", "=", locale);
	return (await query.execute()).map(rowToTaxonomyDef);
}
/**
* Resolve taxonomy defs through the isolate fallback cache, bypassing it for
* isolated databases. The returned promise is cached (not the resolved value)
* so concurrent cold-isolate readers share one in-flight query; a rejection
* evicts the entry so the next caller retries.
*/
function loadTaxonomyDefs(localeKey, locale) {
	if (getRequestContext()?.dbIsIsolated === true) return fetchTaxonomyDefs(locale);
	const existing = defsHolder.cache.get(localeKey);
	if (existing && existing.version === defsHolder.version) return existing.promise;
	const version = defsHolder.version;
	const promise = fetchTaxonomyDefs(locale).catch((error) => {
		const current = defsHolder.cache.get(localeKey);
		if (current && current.promise === promise) defsHolder.cache.delete(localeKey);
		throw error;
	});
	defsHolder.cache.set(localeKey, {
		version,
		promise
	});
	return promise;
}
/**
* Get every taxonomy definition. Definitions are per-locale (one row per
* locale inside the same translation_group) — by default we resolve to the
* active locale.
*
* Two-tier cache: per-request via `requestCached` (so a single render that
* hydrates terms for several collections pays at most one call), then
* per-isolate via the global holder (so warm renders issue zero queries).
* The `requestCached` key is unchanged so `getTaxonomyDef`'s peek still hits.
*/
async function getTaxonomyDefs(options = {}) {
	const locale = resolveLocale(options.locale);
	const localeKey = locale ?? "*";
	return requestCached(`taxonomy-defs:${localeKey}`, async () => {
		if (await isObjectCacheActive()) return cachedQuery({
			namespace: CacheNamespace.TAXONOMIES,
			key: `defs:${localeKey}`,
			load: () => fetchTaxonomyDefs(locale)
		});
		return loadTaxonomyDefs(localeKey, locale);
	});
}
/**
* Get a single taxonomy definition by name. Uses the fallback chain so even
* if there is no translation for the active locale we still return something.
*
* If `getTaxonomyDefs()` has already loaded the full list in this request
* (which happens during entry-term hydration on every page that renders a
* collection), search the matching def in memory rather than running a
* second query against `_emdash_taxonomy_defs`.
*/
async function getTaxonomyDef(name, options = {}) {
	const chain = resolveLocaleChain(options.locale);
	const allDefs = peekRequestCache(`taxonomy-defs:${resolveLocale(options.locale) ?? "*"}`);
	if (allDefs) {
		const defs = await allDefs;
		if (chain.length === 0) return defs.find((d) => d.name === name) ?? null;
		for (const locale of chain) {
			const found = defs.find((d) => d.name === name && d.locale === locale);
			if (found) return found;
		}
		return null;
	}
	return requestCached(`taxonomy-def:${name}:${chain.join(",")}`, async () => {
		const db = await getDb();
		if (chain.length === 0) {
			const row = await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("name", "=", name).orderBy("locale", "asc").executeTakeFirst();
			return row ? rowToTaxonomyDef(row) : null;
		}
		for (const locale of chain) {
			const row = await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("name", "=", name).where("locale", "=", locale).executeTakeFirst();
			if (row) return rowToTaxonomyDef(row);
		}
		return null;
	});
}
/**
* Object-cache namespaces for values that embed visible term counts: the
* taxonomy epoch (term/assignment writes) plus each counted collection's
* content epoch, so publishing, unpublishing, or trashing an entry
* invalidates the cached count promptly. A scheduled entry becoming due
* flips visibility without a write, so that staleness stays bounded by the
* cache entry's TTL.
*/
function termCountNamespaces(collections) {
	return [...Array.from(new Set(collections), contentNamespace), CacheNamespace.TAXONOMIES];
}
/**
* All terms of a taxonomy in a specific locale (flat for non-hierarchical,
* tree for hierarchical).
*
* The term list and the visible-entry counts are loaded and cached separately:
* the list depends only on the taxonomy epoch, while the counts additionally
* depend on every counted collection's content epoch and cost an aggregate over
* the whole assignment pivot. Callers that don't render counts pass
* `includeCounts: false` and skip that aggregate entirely, while still sharing
* the term list with callers that do.
*/
async function getTaxonomyTerms(taxonomyName, options = {}) {
	const locale = resolveLocale(options.locale);
	const def = await getTaxonomyDef(taxonomyName, options);
	if (!def) return [];
	if (options.includeCounts === false) return getTermList(def, locale);
	const [terms, counts] = await Promise.all([getTermList(def, locale), getVisibleTermCounts(def.name, def.collections)]);
	return withCounts(terms, counts);
}
/** Terms without counts, under the cache keys the layout prefetch warms. */
function getTermList(def, locale) {
	const localeKey = locale ?? "*";
	return requestCached(`taxonomy-terms:${def.name}:${localeKey}`, () => cachedQuery({
		namespace: CacheNamespace.TAXONOMIES,
		key: `termList:${def.name}:${localeKey}`,
		load: () => loadTaxonomyTerms(def, locale)
	}));
}
/**
* Copy a term list with counts attached. Counts are keyed by translation_group
* (what the pivot stores) and are locale-independent. Rebuilds every node so
* the shared, cached count-free list is never mutated.
*/
function withCounts(terms, counts) {
	return terms.map((term) => ({
		...term,
		count: counts.get(term.translationGroup ?? term.id) ?? 0,
		children: withCounts(term.children, counts)
	}));
}
async function loadTaxonomyTerms(def, locale) {
	let termsQuery = (await getDb()).selectFrom("taxonomies").selectAll().where("name", "=", def.name).orderBy("label", "asc");
	if (locale !== void 0) termsQuery = termsQuery.where("locale", "=", locale);
	const flatTerms = (await termsQuery.execute()).map((row) => ({
		id: row.id,
		name: row.name,
		slug: row.slug,
		label: row.label,
		parent_id: row.parent_id,
		data: row.data,
		locale: row.locale,
		translation_group: row.translation_group
	}));
	if (def.hierarchical) return buildTree(flatTerms);
	return flatTerms.map((term) => ({
		id: term.id,
		name: term.name,
		slug: term.slug,
		label: term.label,
		description: term.data ? JSON.parse(term.data).description : void 0,
		children: [],
		locale: term.locale,
		translationGroup: term.translation_group
	}));
}
/**
* Per-translation-group visible-usage counts for one taxonomy, in a single
* round-trip (see `fetchVisibleTermCounts`). Counts are locale-independent
* (the pivot stores translation_group), and the request-cached map is shared
* by every consumer in the render — the widget (`getTaxonomyTerms`) and the
* single-term page (`getTerm`) never issue separate count queries.
*/
function getVisibleTermCounts(taxonomyName, collections) {
	const scope = [...new Set(collections)].toSorted().join(",");
	return requestCached(`taxonomy-term-counts:${taxonomyName}:${scope}`, async () => {
		const entries = await cachedQuery({
			namespace: termCountNamespaces(collections),
			key: `termCounts:${taxonomyName}:${scope}`,
			load: async () => {
				return [...await fetchVisibleTermCounts(await getDb(), taxonomyName, collections)];
			}
		});
		return new Map(entries);
	});
}
/**
* Get a single term by (taxonomy, slug). Honours the fallback chain — if the
* slug exists in a fallback locale, we return that row (useful for deep-linking
* to a term page when the translation is missing).
*/
async function getTerm(taxonomyName, slug, options = {}) {
	const chain = resolveLocaleChain(options.locale);
	const collections = (await getTaxonomyDef(taxonomyName, options))?.collections ?? [];
	return cachedQuery({
		namespace: termCountNamespaces(collections),
		key: `term:${taxonomyName}:${slug}:${chain.join(",")}`,
		load: () => loadTerm(taxonomyName, slug, chain, collections)
	});
}
async function loadTerm(taxonomyName, slug, chain, collections) {
	const db = await getDb();
	let row;
	const selectTerm = () => db.selectFrom("taxonomies").selectAll().where("name", "=", taxonomyName).where("slug", "=", slug);
	if (chain.length === 0) row = await selectTerm().orderBy("locale", "asc").executeTakeFirst();
	else {
		row = void 0;
		for (const locale of chain) {
			row = await selectTerm().where("locale", "=", locale).executeTakeFirst();
			if (row) break;
		}
	}
	if (!row) return null;
	let childrenQuery = db.selectFrom("taxonomies").selectAll().where("parent_id", "=", row.translation_group ?? row.id).orderBy("label", "asc");
	const termLocale = row.locale;
	if (termLocale) childrenQuery = childrenQuery.where("locale", "=", termLocale);
	const [counts, childRows] = await Promise.all([getVisibleTermCounts(taxonomyName, collections), childrenQuery.execute()]);
	const count = counts.get(row.translation_group ?? row.id) ?? 0;
	const children = childRows.map((child) => ({
		id: child.id,
		name: child.name,
		slug: child.slug,
		label: child.label,
		parentId: child.parent_id ?? void 0,
		children: [],
		locale: child.locale,
		translationGroup: child.translation_group
	}));
	return {
		id: row.id,
		name: row.name,
		slug: row.slug,
		label: row.label,
		parentId: row.parent_id ?? void 0,
		description: row.data ? JSON.parse(row.data).description : void 0,
		children,
		count,
		locale: row.locale,
		translationGroup: row.translation_group
	};
}
/**
* Terms assigned to a content entry, resolved into the active locale. Terms
* whose translation_group lacks a row in the requested locale are omitted.
*/
function getEntryTerms(collection, entryId, taxonomyName, options = {}) {
	const locale = resolveLocale(options.locale);
	return requestCached(`terms:${collection}:${entryId}:${taxonomyName ?? "*"}:${locale ?? "*"}`, () => cachedQuery({
		namespace: [contentNamespace(collection), CacheNamespace.TAXONOMIES],
		key: `entryTerms:${collection}:${entryId}:${taxonomyName ?? "*"}:${locale ?? "*"}`,
		load: async () => {
			let query = (await getDb()).selectFrom("content_taxonomies").innerJoin("taxonomies", "taxonomies.translation_group", "content_taxonomies.taxonomy_id").selectAll("taxonomies").where("content_taxonomies.collection", "=", collection).where("content_taxonomies.entry_id", "=", entryId);
			if (taxonomyName) query = query.where("taxonomies.name", "=", taxonomyName);
			if (locale !== void 0) query = query.where("taxonomies.locale", "=", locale);
			return (await query.execute()).map((row) => ({
				id: row.id,
				name: row.name,
				slug: row.slug,
				label: row.label,
				parentId: row.parent_id ?? void 0,
				children: [],
				locale: row.locale,
				translationGroup: row.translation_group
			}));
		}
	}));
}
/**
* Terms for multiple entries of one taxonomy, single query.
*/
async function getTermsForEntries(collection, entryIds, taxonomyName, options = {}) {
	const uniqueIds = [...new Set(entryIds)];
	if (uniqueIds.length === 0) return /* @__PURE__ */ new Map();
	const locale = resolveLocale(options.locale);
	const localeKey = locale ?? "*";
	const load = async () => {
		const result = /* @__PURE__ */ new Map();
		for (const id of uniqueIds) result.set(id, []);
		const missedIds = [];
		const cacheReads = [];
		for (const id of uniqueIds) {
			const cached = peekRequestCache(`terms:${collection}:${id}:${taxonomyName}:${localeKey}`);
			if (cached) cacheReads.push(cached.then((terms) => ({
				id,
				terms
			}), () => ({
				id,
				miss: true
			})));
			else missedIds.push(id);
		}
		for (const read of await Promise.all(cacheReads)) {
			if ("miss" in read) {
				missedIds.push(read.id);
				continue;
			}
			result.set(read.id, read.terms.map((t) => ({
				...t,
				children: [...t.children]
			})));
		}
		if (missedIds.length === 0) return [...result.entries()];
		const db = await getDb();
		for (const chunk of chunks(missedIds, 50)) {
			let rows;
			try {
				let query = db.selectFrom("content_taxonomies").innerJoin("taxonomies", "taxonomies.translation_group", "content_taxonomies.taxonomy_id").select([
					"content_taxonomies.entry_id",
					"taxonomies.id",
					"taxonomies.name",
					"taxonomies.slug",
					"taxonomies.label",
					"taxonomies.parent_id",
					"taxonomies.locale",
					"taxonomies.translation_group"
				]).where("content_taxonomies.collection", "=", collection).where("content_taxonomies.entry_id", "in", chunk).where("taxonomies.name", "=", taxonomyName).orderBy("taxonomies.label", "asc");
				if (locale !== void 0) query = query.where("taxonomies.locale", "=", locale);
				rows = await query.execute();
			} catch (error) {
				if (isMissingTableError(error)) return [...result.entries()];
				throw error;
			}
			for (const row of rows) {
				const term = {
					id: row.id,
					name: row.name,
					slug: row.slug,
					label: row.label,
					parentId: row.parent_id ?? void 0,
					children: [],
					locale: row.locale,
					translationGroup: row.translation_group
				};
				const terms = result.get(row.entry_id);
				if (terms) terms.push(term);
			}
		}
		return [...result.entries()];
	};
	const idKey = uniqueIds.toSorted().join(",");
	const pairs = idKey.length <= 256 ? await cachedQuery({
		namespace: [contentNamespace(collection), CacheNamespace.TAXONOMIES],
		key: `termsForEntries:${collection}:${taxonomyName}:${locale ?? "*"}:${idKey}`,
		load
	}) : await load();
	return new Map(pairs);
}
/**
* Batch-fetch terms for multiple entries across ALL taxonomies in one query.
* Primes the request-cache for subsequent per-entry calls to `getEntryTerms`.
*/
async function getAllTermsForEntries(collection, entryIds, options = {}) {
	const result = /* @__PURE__ */ new Map();
	const uniqueIds = [...new Set(entryIds)];
	for (const id of uniqueIds) result.set(id, {});
	if (uniqueIds.length === 0) return result;
	const db = await getDb();
	const locale = resolveLocale(options.locale);
	const applicableTaxonomyNames = await getCollectionTaxonomyNames(collection, { locale });
	for (const chunk of chunks(uniqueIds, 50)) {
		let rows;
		try {
			let query = db.selectFrom("content_taxonomies").innerJoin("taxonomies", "taxonomies.translation_group", "content_taxonomies.taxonomy_id").select([
				"content_taxonomies.entry_id",
				"taxonomies.id",
				"taxonomies.name",
				"taxonomies.slug",
				"taxonomies.label",
				"taxonomies.parent_id",
				"taxonomies.locale",
				"taxonomies.translation_group"
			]).where("content_taxonomies.collection", "=", collection).where("content_taxonomies.entry_id", "in", chunk).orderBy("taxonomies.label", "asc");
			if (locale !== void 0) query = query.where("taxonomies.locale", "=", locale);
			rows = await query.execute();
		} catch (error) {
			if (isMissingTableError(error)) {
				for (const id of uniqueIds) primeEntryTermsCache(collection, id, {}, applicableTaxonomyNames, locale);
				return result;
			}
			throw error;
		}
		for (const row of rows) {
			const term = {
				id: row.id,
				name: row.name,
				slug: row.slug,
				label: row.label,
				parentId: row.parent_id ?? void 0,
				children: [],
				locale: row.locale,
				translationGroup: row.translation_group
			};
			const byTaxonomy = result.get(row.entry_id);
			if (!byTaxonomy) continue;
			const existing = byTaxonomy[row.name];
			if (existing) existing.push(term);
			else byTaxonomy[row.name] = [term];
		}
	}
	for (const [entryId, byTaxonomy] of result) primeEntryTermsCache(collection, entryId, byTaxonomy, applicableTaxonomyNames, locale);
	return result;
}
/**
* Return the list of taxonomy names applicable to a collection, request-
* cached so a page render only pays for it once.
*
* Returns an empty list when taxonomies haven't been defined yet.
*/
async function getCollectionTaxonomyNames(collection, options) {
	try {
		return (await getTaxonomyDefs(options)).filter((d) => d.collections.includes(collection)).map((d) => d.name);
	} catch (error) {
		if (isMissingTableError(error)) return [];
		throw error;
	}
}
/**
* Pre-populate the request-cache for every getEntryTerms call-shape that
* could hit this entry:
*
*   getEntryTerms(collection, entryId)                 -> key `terms:C:E:*`
*   getEntryTerms(collection, entryId, "tag")          -> key `terms:C:E:tag`
*   getEntryTerms(collection, entryId, "category")     -> key `terms:C:E:category`
*   ...one per taxonomy that applies to this collection
*
* Taxonomies with no rows on this entry are seeded with `[]` so legacy
* callers short-circuit to the cached empty array instead of re-querying.
*/
function primeEntryTermsCache(collection, entryId, byTaxonomy, applicableTaxonomyNames, locale) {
	const localeKey = locale ?? "*";
	for (const name of applicableTaxonomyNames) setRequestCacheEntry(`terms:${collection}:${entryId}:${name}:${localeKey}`, byTaxonomy[name] ?? []);
	for (const [name, terms] of Object.entries(byTaxonomy)) setRequestCacheEntry(`terms:${collection}:${entryId}:${name}:${localeKey}`, terms);
	const allTerms = Object.values(byTaxonomy).flat();
	setRequestCacheEntry(`terms:${collection}:${entryId}:*:${localeKey}`, allTerms);
}
/**
* Prime the per-entry request cache from terms that were folded into the
* content query (query.ts `hydrateEntryTerms` fast path), so subsequent
* `getEntryTerms` calls in the same render hit the cache instead of issuing an
* N+1 query. Seeds the wildcard key and one key per taxonomy present on the
* entry — purely from the folded data, with no DB lookup.
*
* Unlike `getAllTermsForEntries`, this deliberately does NOT seed `[]` for
* taxonomies that apply to the collection but have no rows on the entry: doing
* so would require a `getTaxonomyDefs` query, adding a round trip to every fold
* render to serve the rarer `getEntryTerms(id, absentTaxonomy)` case from cache.
* That call simply falls through to its own cached query. Keeping the key shape
* here (rather than in query.ts) prevents the two from drifting.
*/
function primeFoldedEntryTerms(collection, perEntry, options = {}) {
	if (perEntry.length === 0) return;
	const locale = resolveLocale(options.locale);
	for (const { entryId, byTaxonomy } of perEntry) primeEntryTermsCache(collection, entryId, byTaxonomy, [], locale);
}
/**
* Get entries by term. Both the lookup (term slug in the active locale) and
* the content query respect the active locale.
*/
async function getEntriesByTerm(collection, taxonomyName, termSlug, options = {}) {
	const { getEmDashCollection } = await import("./query-DCiXI7OZ_B_Xp5tRe.mjs").then((n) => n.o);
	const queryOptions = { where: { [taxonomyName]: termSlug } };
	if (options.locale !== void 0) queryOptions.locale = options.locale;
	const { entries } = await getEmDashCollection(collection, queryOptions);
	return entries;
}
function rowToTaxonomyDef(row) {
	return {
		id: row.id,
		name: row.name,
		label: row.label,
		labelSingular: row.label_singular ?? void 0,
		hierarchical: row.hierarchical === 1,
		collections: row.collections ? JSON.parse(row.collections) : [],
		locale: row.locale,
		translationGroup: row.translation_group
	};
}
/**
* Build tree structure from flat terms
*/
function buildTree(flatTerms) {
	const byLocaleGroup = /* @__PURE__ */ new Map();
	const nodes = [];
	const roots = [];
	for (const term of flatTerms) {
		const node = {
			id: term.id,
			name: term.name,
			slug: term.slug,
			label: term.label,
			parentId: term.parent_id ?? void 0,
			description: term.data ? JSON.parse(term.data).description : void 0,
			children: [],
			locale: term.locale,
			translationGroup: term.translation_group
		};
		byLocaleGroup.set(`${term.locale}::${term.translation_group ?? term.id}`, node);
		nodes.push(node);
	}
	for (const node of nodes) {
		const parent = node.parentId ? byLocaleGroup.get(`${node.locale}::${node.parentId}`) : void 0;
		if (parent) parent.children.push(node);
		else roots.push(node);
	}
	return roots;
}
//#endregion
export { getTaxonomyDef as a, getTerm as c, invalidateTermCache as d, taxonomies_exports as f, getEntryTerms as i, getTermsForEntries as l, getAllTermsForEntries as n, getTaxonomyDefs as o, getEntriesByTerm as r, getTaxonomyTerms as s, fetchVisibleTermCounts as t, invalidateTaxonomyDefsCache as u };
