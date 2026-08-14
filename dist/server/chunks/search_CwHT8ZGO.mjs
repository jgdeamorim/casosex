import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { o as getI18nConfig } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { a as PluginRouteError } from "./dist_C4cexd-h.mjs";
//#region self-essentials/emdash-main/packages/cloudflare/dist/plugins/ai-search.mjs
var MD_EXT = /\.md$/;
var INSTANCE_NOT_FOUND_MESSAGE = /ai_search_not_found|instance.*not found|not found.*instance/i;
var ACTIVE_CONFIG_KEY = Symbol.for("emdash.ai-search.config");
function activeConfigHolder() {
	const globals = globalThis;
	return globals[ACTIVE_CONFIG_KEY] ??= { value: {} };
}
function getActiveAISearchConfig() {
	return activeConfigHolder().value;
}
/**
* KV key holding query synonyms configured in the admin dashboard. Each entry
* maps a term/phrase (`from`) to a replacement (`to`) that is substituted into
* search queries before they reach AI Search, to improve recall.
*/
var CONFIG_SYNONYMS_KEY = "config:synonyms";
/**
* Separator used to pack `title` and `description` into a single metadata
* field (AI Search allows at most 5 custom_metadata fields). The ASCII Unit
* Separator (U+001F) is chosen because it never appears in extracted plain
* text, so it can't collide with title or description content.
*/
var TITLE_DESC_SEP = "";
/** Unpack a packed `title_desc` value, splitting on the first separator only. */
function unpackTitleDescription(value) {
	const i = value.indexOf(TITLE_DESC_SEP);
	if (i < 0) return {
		title: value,
		description: ""
	};
	return {
		title: value.slice(0, i),
		description: value.slice(i + 1)
	};
}
var REQUIRED_CUSTOM_METADATA = [
	{
		field_name: "visible_after",
		data_type: "number"
	},
	{
		field_name: "title_desc",
		data_type: "text"
	},
	{
		field_name: "slug",
		data_type: "text"
	},
	{
		field_name: "image",
		data_type: "text"
	},
	{
		field_name: "locale",
		data_type: "text"
	}
];
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isMissingAISearchInstanceError(error) {
	if (isRecord(error) && (error.status === 404 || error.code === "NOT_FOUND")) return true;
	return error instanceof Error && INSTANCE_NOT_FOUND_MESSAGE.test(error.message);
}
function isAiSearchNamespace(value) {
	return isRecord(value) && typeof value.get === "function" && typeof value.create === "function";
}
var WORKERS_MODULE_KEY = Symbol.for("emdash.ai-search.workers-module");
/**
* Import `cloudflare:workers` once per isolate. Several call sites need it, and
* a rejected import is not cached so a later call can retry.
*/
function loadWorkersModule() {
	const globals = globalThis;
	return globals[WORKERS_MODULE_KEY] ??= import("cloudflare:workers").catch((error) => {
		delete globals[WORKERS_MODULE_KEY];
		throw error;
	});
}
/** Get Cloudflare runtime env via cloudflare:workers. */
async function getCloudflareEnv() {
	try {
		return (await loadWorkersModule()).env;
	} catch {
		return null;
	}
}
/** Parse a content key back into collection + id. */
function parseContentKey(key) {
	const [col, ...rest] = key.split("/");
	return {
		collection: col ?? "",
		id: rest.join("/").replace(MD_EXT, "")
	};
}
/**
* Normalize a `collections` request field into a trimmed slug array.
* Accepts a comma-separated string or an array of strings; returns `null`
* when the input is neither (so callers can fall back or error).
*/
function parseCollections(value) {
	const raw = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value.filter((v) => typeof v === "string") : null;
	if (raw === null) return null;
	return raw.map((c) => c.trim()).filter(Boolean);
}
/** Escape a string for safe use inside a RegExp. */
function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function compileSynonyms(synonyms) {
	const sorted = synonyms.filter((s) => s.from).toSorted((a, b) => b.from.length - a.from.length);
	const lookup = /* @__PURE__ */ new Map();
	for (const s of sorted) {
		const key = s.from.toLowerCase();
		if (!lookup.has(key)) lookup.set(key, s.to);
	}
	if (sorted.length === 0) return {
		re: null,
		lookup
	};
	const pattern = sorted.map((s) => escapeRegex(s.from)).join("|");
	return {
		re: new RegExp(`(?<![\\p{L}\\p{N}_])(?:${pattern})(?![\\p{L}\\p{N}_])`, "giu"),
		lookup
	};
}
function applySynonyms(query, rewriter) {
	if (!rewriter.re) return query;
	rewriter.re.lastIndex = 0;
	return query.replace(rewriter.re, (match) => rewriter.lookup.get(match.toLowerCase()) ?? match);
}
var SYNONYM_CACHE_TTL_MS = 6e4;
var SYNONYM_CACHE_KEY = Symbol.for("emdash.ai-search.synonym-cache");
function synonymCacheHolder() {
	const globals = globalThis;
	return globals[SYNONYM_CACHE_KEY] ??= {
		rewriter: compileSynonyms([]),
		refreshAfter: 0,
		generation: 0
	};
}
async function getSynonymRewriter(kv) {
	const cache = synonymCacheHolder();
	const now = Date.now();
	if (now < cache.refreshAfter) return cache.rewriter;
	const generation = cache.generation;
	cache.refreshAfter = now + SYNONYM_CACHE_TTL_MS;
	const synonyms = await kv.get(CONFIG_SYNONYMS_KEY) ?? [];
	if (cache.generation === generation) cache.rewriter = compileSynonyms(synonyms);
	return cache.rewriter;
}
function renderResultUrl(config, result, locale) {
	return (config.urlTemplates?.[result.collection] ?? "/{collection}/{slug}").replaceAll("{collection}", encodeURIComponent(result.collection)).replaceAll("{id}", encodeURIComponent(result.id)).replaceAll("{slug}", encodeURIComponent(result.slug)).replaceAll("{locale}", encodeURIComponent(locale));
}
async function resolveBinding(config) {
	const env = await getCloudflareEnv();
	if (!env) return null;
	const candidate = Reflect.get(env, config.binding ?? "AI_SEARCH");
	return isAiSearchNamespace(candidate) ? candidate : null;
}
async function ensureAISearchInstance(ns, config) {
	const instanceName = config.instanceName ?? "emdash-content";
	const handle = ns.get(instanceName);
	try {
		await handle.info();
		return handle;
	} catch (error) {
		if (!isMissingAISearchInstanceError(error)) throw error;
	}
	try {
		return await ns.create({
			id: instanceName,
			index_method: {
				vector: true,
				keyword: config.hybridSearch ?? true
			},
			custom_metadata: REQUIRED_CUSTOM_METADATA
		});
	} catch (createError) {
		try {
			await handle.info();
		} catch {
			throw createError;
		}
		return handle;
	}
}
async function searchAISearch(config, input, kv, defaultLocale) {
	const ns = await resolveBinding(config);
	if (!ns) throw new PluginRouteError("SEARCH_UNAVAILABLE", "Search is not available", 503);
	const effectiveQuery = applySynonyms(input.query, await getSynonymRewriter(kv));
	const instance = await ensureAISearchInstance(ns, config);
	const nowSeconds = Math.floor(Date.now() / 1e3);
	const requestedCollections = parseCollections(input.collection) ?? [];
	const folderFilter = requestedCollections.length === 1 ? `${requestedCollections[0]}/` : requestedCollections.length > 1 ? { $in: requestedCollections.map((collection) => `${collection}/`) } : void 0;
	const searchLocale = async (locale) => {
		const response = await instance.search({
			messages: [{
				role: "user",
				content: effectiveQuery
			}],
			ai_search_options: { retrieval: {
				...input.maxResults === void 0 ? {} : { max_num_results: input.maxResults },
				filters: {
					visible_after: { $lte: nowSeconds },
					locale: { $eq: locale },
					...folderFilter === void 0 ? {} : { folder: folderFilter }
				},
				metadata_only: true
			} }
		});
		const chunks = requestedCollections.length === 0 ? response.chunks : response.chunks.filter((chunk) => requestedCollections.some((collection) => chunk.item.key.startsWith(`${collection}/`)));
		const bestByKey = /* @__PURE__ */ new Map();
		for (const chunk of chunks) {
			const existing = bestByKey.get(chunk.item.key);
			if (!existing || chunk.score > existing.score) bestByKey.set(chunk.item.key, chunk);
		}
		return {
			search_query: response.search_query,
			chunks: Array.from(bestByKey.values(), (chunk) => {
				const parsed = parseContentKey(chunk.item.key);
				const metadata = chunk.item.metadata ?? {};
				const { title, description } = unpackTitleDescription(typeof metadata.title_desc === "string" ? metadata.title_desc : "");
				const slug = typeof metadata.slug === "string" && metadata.slug ? metadata.slug : parsed.id;
				const image = typeof metadata.image === "string" && metadata.image ? metadata.image : void 0;
				return {
					id: chunk.id,
					type: chunk.type,
					score: chunk.score,
					item: {
						key: renderResultUrl(config, {
							...parsed,
							slug
						}, locale),
						metadata: {
							title: title || slug,
							description,
							...image ? { image } : {}
						}
					}
				};
			})
		};
	};
	let response = await searchLocale(input.locale);
	if (response.chunks.length === 0 && input.locale !== defaultLocale) response = await searchLocale(defaultLocale);
	return response;
}
async function handleAISearchSnippetRequest(request, options) {
	let body;
	try {
		const parsed = await request.json();
		if (!isRecord(parsed)) throw new Error("Invalid request body");
		body = parsed;
	} catch {
		return Response.json({
			success: false,
			error: "Invalid request body"
		}, { status: 400 });
	}
	const query = body.messages?.findLast((message) => message.role === "user" && typeof message.content === "string")?.content;
	if (typeof query !== "string" || !query.trim()) return Response.json({
		success: true,
		result: {
			search_query: "",
			chunks: []
		}
	});
	const locale = typeof body.locale === "string" && body.locale ? body.locale : options.defaultLocale;
	const collection = typeof body.collection === "string" && body.collection ? body.collection : void 0;
	const maxResults = body.ai_search_options?.retrieval?.max_num_results;
	if (maxResults !== void 0 && (typeof maxResults !== "number" || !Number.isInteger(maxResults) || maxResults < 1 || maxResults > 50)) return Response.json({
		success: false,
		error: "max_num_results must be an integer between 1 and 50"
	}, { status: 400 });
	try {
		const result = await searchAISearch(options.config, {
			query: query.trim(),
			locale,
			maxResults,
			collection
		}, options.kv, options.defaultLocale);
		return Response.json({
			success: true,
			result
		});
	} catch (error) {
		const status = error instanceof PluginRouteError ? error.status : 503;
		const message = status === 503 ? "Search is temporarily unavailable" : "Search failed";
		console.error("[ai-search] Snippet search failed:", error);
		return Response.json({
			success: false,
			error: message
		}, { status });
	}
}
function createAISearchSnippetEndpoint(config) {
	return async ({ request }) => {
		const { withEmDashRuntime } = await import("./middleware_Vkl0HxbX.mjs");
		return withEmDashRuntime(async (runtime) => {
			if (!runtime.getPluginRouteMeta("ai-search", "status")) return Response.json({
				success: false,
				error: "Search is not available"
			}, { status: 404 });
			const options = new OptionsRepository(runtime.db);
			const prefix = "plugin:ai-search:";
			return handleAISearchSnippetRequest(request, {
				config: config ?? getActiveAISearchConfig(),
				kv: { get: (key) => options.get(`${prefix}${key}`) },
				defaultLocale: getI18nConfig()?.defaultLocale ?? "en"
			});
		});
	};
}
var POST = createAISearchSnippetEndpoint();
//#endregion
//#region src/pages/api/ai-search/search.ts
var search_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
//#endregion
//#region \0virtual:astro:page:src/pages/api/ai-search/search@_@ts
var page = () => search_exports;
//#endregion
export { page };
