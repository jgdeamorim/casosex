import { a as after } from "./request-cache_48eSuHhA.mjs";
import { t as getRequestContext } from "./request-context_E8kV37BM.mjs";
//#region self-essentials/emdash-main/packages/core/src/object-cache/codec.ts
/**
* Object-cache serialization codec.
*
* Cached values are JSON, with one extension: `Date` instances are preserved
* across the round-trip. EmDash content entries carry `Date` objects for the
* system timestamp columns (`createdAt`, `updatedAt`, `publishedAt`,
* `scheduledAt`) and on `cacheHint.lastModified`; plain `JSON.stringify` would
* silently flatten those to ISO strings, so a value read from cache would no
* longer be `=== instanceof Date` and downstream `value instanceof Date`
* branches (cursor encoding, scheduled-visibility checks) would diverge from a
* fresh database read.
*
* Functions and symbol-keyed properties are NOT preserved — callers that cache
* values carrying either (e.g. content entries with their `.edit` proxy and
* the non-enumerable `CURSOR_RAW_VALUES` symbol) must reduce to a serializable
* snapshot before caching and rebuild the non-serializable parts on read. See
* `query.ts` content snapshot helpers.
*/
/** Tag used to mark a serialized `Date`. Deliberately unlikely to collide. */
var DATE_TAG = "$$emdashDate";
function isTaggedDate(value) {
	if (typeof value !== "object" || value === null) return false;
	return Object.keys(value).length === 1 && typeof value[DATE_TAG] === "string";
}
/**
* Serialize a value to a cache string, preserving `Date` instances.
*
* Uses the JSON replacer's `this` binding to inspect the *original* property
* value: `JSON.stringify` invokes `Date.prototype.toJSON` before the replacer
* sees it, so by the time `value` arrives it is already an ISO string. Reading
* `this[key]` recovers the live `Date` so we can tag it.
*/
function encode(value) {
	return JSON.stringify(value, function(key, val) {
		const original = this[key];
		if (original instanceof Date) return { [DATE_TAG]: original.toISOString() };
		return val;
	});
}
/**
* Parse a cache string produced by {@link encode}, rehydrating tagged `Date`s.
*
* Returns `undefined` if the input is not valid JSON (treated as a cache miss
* by the read-through layer rather than throwing).
*/
function decode(raw) {
	try {
		return JSON.parse(raw, (_key, value) => {
			if (isTaggedDate(value)) return new Date(value[DATE_TAG]);
			return value;
		});
	} catch {
		return;
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/object-cache/index.ts
var DEFAULT_KEY_PREFIX = "em";
var DEFAULT_TTL_SECONDS = 3600;
var DEFAULT_REVALIDATE_MS = 1e3;
var DEFAULT_TIMEOUT_MS = 2e3;
function withTimeout(promise, ms, label) {
	if (!(ms > 0)) return promise;
	let timer;
	const timeout = new Promise((_resolve, reject) => {
		timer = setTimeout(() => {
			reject(/* @__PURE__ */ new Error(`object-cache ${label} timed out after ${ms}ms`));
		}, ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
var EPOCH_READ_GRACE_MS = 1e3;
function epochReadDeadline() {
	return (holder.config.timeout > 0 ? holder.config.timeout : DEFAULT_TIMEOUT_MS) + EPOCH_READ_GRACE_MS;
}
function raceInFlightEpochRead(promise, ms, fallback) {
	let timer;
	const timeout = new Promise((resolve) => {
		timer = setTimeout(resolve, Math.max(ms, 1), fallback);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
var BACKEND_KEY = /* @__PURE__ */ Symbol.for("emdash:object-cache:backend");
var EPOCH_KEY = /* @__PURE__ */ Symbol.for("emdash:object-cache:epochs");
var PENDING_KEY = /* @__PURE__ */ Symbol.for("emdash:object-cache:pending-bumps");
var g = globalThis;
var holder = g[BACKEND_KEY] ?? (() => {
	const h = {
		initialized: false,
		backend: null,
		initPromise: null,
		config: {
			keyPrefix: DEFAULT_KEY_PREFIX,
			defaultTtl: DEFAULT_TTL_SECONDS,
			revalidate: DEFAULT_REVALIDATE_MS,
			timeout: DEFAULT_TIMEOUT_MS
		}
	};
	g[BACKEND_KEY] = h;
	return h;
})();
var epochCache = g[EPOCH_KEY] ?? (() => {
	const m = /* @__PURE__ */ new Map();
	g[EPOCH_KEY] = m;
	return m;
})();
var pendingBumps = g[PENDING_KEY] ?? (() => {
	const s = /* @__PURE__ */ new Set();
	g[PENDING_KEY] = s;
	return s;
})();
async function getBackend() {
	if (holder.initialized) return holder.backend;
	if (holder.initPromise) return holder.initPromise;
	holder.initPromise = (async () => {
		try {
			const mod = await import("./object-cache_DyS47IAq.mjs");
			const config = mod.objectCacheConfig ?? {};
			holder.config = {
				keyPrefix: typeof config.keyPrefix === "string" && config.keyPrefix.length > 0 ? config.keyPrefix : DEFAULT_KEY_PREFIX,
				defaultTtl: typeof config.defaultTtl === "number" && config.defaultTtl > 0 ? config.defaultTtl : DEFAULT_TTL_SECONDS,
				revalidate: typeof config.revalidate === "number" && config.revalidate >= 0 ? config.revalidate : DEFAULT_REVALIDATE_MS,
				timeout: typeof config.timeout === "number" && config.timeout >= 0 ? config.timeout : DEFAULT_TIMEOUT_MS
			};
			holder.backend = typeof mod.createObjectCache === "function" ? mod.createObjectCache(config) : null;
		} catch (error) {
			if (Object.assign({
				"ASSETS_PREFIX": void 0,
				"BASE_URL": "/",
				"DEV": false,
				"MODE": "production",
				"PROD": true,
				"SITE": void 0,
				"SSR": true
			}, {})?.DEV) console.warn("[object-cache] backend unavailable:", error);
			holder.backend = null;
		}
		holder.initialized = true;
		holder.initPromise = null;
		return holder.backend;
	})();
	return holder.initPromise;
}
function epochKey(namespace) {
	return `${holder.config.keyPrefix}:epoch:${namespace}`;
}
function valueKey(namespaces, key) {
	return `${holder.config.keyPrefix}:${namespaces.join(",")}:${key}`;
}
function epochsMatch(stored, current) {
	if (stored.length !== current.length) return false;
	for (let i = 0; i < stored.length; i++) if (stored[i] !== current[i]) return false;
	return true;
}
function shouldBypass() {
	const ctx = getRequestContext();
	if (!ctx) return false;
	return ctx.editMode === true || ctx.preview !== void 0 || ctx.dbIsIsolated === true;
}
async function getEpoch(namespace, backend) {
	const now = Date.now();
	const cached = epochCache.get(namespace);
	if (cached && now - cached.at < holder.config.revalidate) return cached.value;
	if (cached?.promise) {
		const age = now - (cached.promiseAt ?? 0);
		const deadline = epochReadDeadline();
		if (age < deadline) return raceInFlightEpochRead(cached.promise, deadline - age, cached.value);
	}
	const promise = (async () => {
		let value;
		try {
			const raw = await withTimeout(backend.get(epochKey(namespace)), holder.config.timeout, "epoch read");
			const parsed = raw === null ? 0 : Number(raw);
			value = Number.isFinite(parsed) ? parsed : 0;
		} catch {
			value = cached?.value ?? 0;
		}
		const merged = Math.max(value, epochCache.get(namespace)?.value ?? 0);
		epochCache.set(namespace, {
			value: merged,
			at: Date.now()
		});
		return merged;
	})();
	after(() => promise.then(() => void 0, () => void 0));
	epochCache.set(namespace, {
		value: cached?.value ?? 0,
		at: cached?.at ?? 0,
		promise,
		promiseAt: now
	});
	return promise;
}
async function cachedQuery(options) {
	const backend = await getBackend();
	if (!backend || shouldBypass()) return options.load();
	const namespaces = typeof options.namespace === "string" ? [options.namespace] : options.namespace;
	const fullKey = valueKey(namespaces, options.key);
	const epochsPromise = Promise.all(namespaces.map((ns) => getEpoch(ns, backend)));
	const rawPromise = withTimeout(backend.get(fullKey), holder.config.timeout, "read").catch(() => null);
	const currentEpochs = await epochsPromise;
	const raw = await rawPromise;
	if (raw !== null) {
		const decoded = decode(raw);
		if (decoded !== void 0) {
			const envelope = decoded;
			if (epochsMatch(envelope.e, currentEpochs)) return envelope.v;
		}
	}
	const value = await options.load();
	if (options.cacheable ? options.cacheable(value) : true) {
		const ttl = options.ttl ?? holder.config.defaultTtl;
		after(async () => {
			try {
				const encoded = encode({
					e: currentEpochs,
					v: value
				});
				await backend.set(fullKey, encoded, ttl);
			} catch (error) {
				if (Object.assign({
					"ASSETS_PREFIX": void 0,
					"BASE_URL": "/",
					"DEV": false,
					"MODE": "production",
					"PROD": true,
					"SITE": void 0,
					"SSR": true
				}, {})?.DEV) console.warn("[object-cache] set failed:", error);
			}
		});
	}
	return value;
}
async function isObjectCacheActive() {
	return await getBackend() !== null && !shouldBypass();
}
function invalidateObjectCache(namespace) {
	const prev = epochCache.get(namespace)?.value ?? 0;
	const stamp = Math.max(prev + 1, Date.now());
	epochCache.set(namespace, {
		value: stamp,
		at: stamp
	});
	if (pendingBumps.has(namespace)) return;
	pendingBumps.add(namespace);
	after(async () => {
		pendingBumps.delete(namespace);
		try {
			const backend = await getBackend();
			if (!backend) return;
			const latest = epochCache.get(namespace)?.value ?? stamp;
			await backend.set(epochKey(namespace), String(latest));
		} catch (error) {
			console.error("[object-cache] epoch bump failed for", namespace, error);
		}
	});
}
var CacheNamespace = {
	SETTINGS: "settings",
	MENUS: "menus",
	TAXONOMIES: "taxonomies",
	BYLINES: "bylines",
	/** Collection schema/metadata (label, supports, commentsEnabled, fields). */
	SCHEMA: "schema",
	/** Public (approved) comments. */
	COMMENTS: "comments"
};
function contentNamespace(collection) {
	return `content:${collection}`;
}
function contentNamespaces(collection) {
	return [
		contentNamespace(collection),
		CacheNamespace.BYLINES,
		CacheNamespace.TAXONOMIES
	];
}
function invalidateCollectionCache(collection) {
	invalidateObjectCache(contentNamespace(collection));
}
function invalidateBylineObjectCache() {
	invalidateObjectCache(CacheNamespace.BYLINES);
}
function invalidateCommentObjectCache() {
	invalidateObjectCache(CacheNamespace.COMMENTS);
}
//#endregion
export { invalidateBylineObjectCache as a, isObjectCacheActive as c, contentNamespaces as i, cachedQuery as n, invalidateCollectionCache as o, contentNamespace as r, invalidateCommentObjectCache as s, CacheNamespace as t };
