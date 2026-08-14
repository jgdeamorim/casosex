import { t as sql } from "./dist_D4nVBoqy.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { a as after, r as requestCached } from "./request-cache_48eSuHhA.mjs";
import { c as decodeCursor, i as getDb, l as encodeCursor } from "./loader_eyqw6jfw.mjs";
import { n as cachedQuery } from "./object-cache_BRJRfvhV.mjs";
import { n as initWithLock, t as createInitLock } from "./init-lock_CvLR-lYe.mjs";
//#region self-essentials/emdash-main/packages/core/src/database/repositories/media.ts
/** Escape LIKE wildcard characters and the escape char itself in user-supplied values */
function escapeLike$1(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
/**
* Normalize a mimeType filter (string or array) into a clean string[].
* Entries that are empty strings are dropped.
*/
function normalizeMimeFilter(input) {
	if (!input) return [];
	return (Array.isArray(input) ? input : [input]).filter((entry) => typeof entry === "string" && entry.length > 0).map((entry) => entry.endsWith("/") ? entry.toLowerCase() : entry.split(";")[0].trim().toLowerCase());
}
/**
* Build a WHERE clause that matches `mime_type` against any of the given
* filter entries — exact equality for full MIMEs, LIKE prefix for entries
* ending in "/".
*/
function mimeMatchExpr(eb, filters) {
	return eb.or(filters.map((entry) => entry.endsWith("/") ? sql`mime_type LIKE ${`${escapeLike$1(entry)}%`} ESCAPE '\\'` : eb("mime_type", "=", entry)));
}
var UPLOAD_ATTEMPT_CLEANUP_AGE_MS = 36e5;
var UPLOAD_ATTEMPT_CLEANUP_BATCH_SIZE = 100;
/**
* Media repository for database operations
*/
var MediaRepository = class {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new media item
	*/
	async create(input) {
		const id = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = {
			id,
			filename: input.filename,
			mime_type: input.mimeType,
			size: input.size ?? null,
			width: input.width ?? null,
			height: input.height ?? null,
			alt: input.alt ?? null,
			caption: input.caption ?? null,
			storage_key: input.storageKey,
			content_hash: input.contentHash ?? null,
			blurhash: input.blurhash ?? null,
			dominant_color: input.dominantColor ?? null,
			status: input.status ?? "ready",
			created_at: now,
			author_id: input.authorId ?? null
		};
		await this.db.insertInto("media").values(row).execute();
		return this.rowToItem(row);
	}
	/**
	* Create a pending media item (for signed URL upload flow)
	*/
	async createPending(input) {
		return this.create({
			...input,
			status: "pending"
		});
	}
	async createUploadAttempt(mediaId, storageKey) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await this.db.insertInto("_emdash_media_upload_attempts").values({
			media_id: mediaId,
			storage_key: storageKey,
			status: "active",
			created_at: now,
			updated_at: now
		}).execute();
	}
	async hasUploadAttempt(storageKey) {
		return await this.db.selectFrom("_emdash_media_upload_attempts").select("storage_key").where("storage_key", "=", storageKey).executeTakeFirst() !== void 0;
	}
	async claimUploadAttemptForCleanup(storageKey) {
		const result = await this.db.updateTable("_emdash_media_upload_attempts").set({
			status: "cleanup",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).where("storage_key", "=", storageKey).where((eb) => eb.not(eb.exists(eb.selectFrom("media").select("media.id").whereRef("media.storage_key", "=", "_emdash_media_upload_attempts.storage_key")))).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	async deleteUploadAttempt(storageKey) {
		await this.db.deleteFrom("_emdash_media_upload_attempts").where("storage_key", "=", storageKey).execute();
	}
	async deleteCompletedUploadAttempts() {
		const result = await this.db.deleteFrom("_emdash_media_upload_attempts").where((eb) => eb.exists(eb.selectFrom("media").select("media.id").whereRef("media.id", "=", "_emdash_media_upload_attempts.media_id").whereRef("media.storage_key", "=", "_emdash_media_upload_attempts.storage_key").where("media.status", "=", "ready"))).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	async findUploadAttemptsForCleanup(maxAgeMs = UPLOAD_ATTEMPT_CLEANUP_AGE_MS, limit = UPLOAD_ATTEMPT_CLEANUP_BATCH_SIZE) {
		const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
		return (await this.db.selectFrom("_emdash_media_upload_attempts").select("storage_key").where((eb) => eb.or([eb("status", "=", "cleanup"), eb("created_at", "<", cutoff)])).where((eb) => eb.not(eb.exists(eb.selectFrom("media").select("media.id").whereRef("media.storage_key", "=", "_emdash_media_upload_attempts.storage_key")))).orderBy("created_at", "asc").limit(limit).execute()).map((row) => row.storage_key);
	}
	async publishPendingStorageKey(id, expectedStorageKey, storageKey, contentHash) {
		const result = await this.db.updateTable("media").set({
			storage_key: storageKey,
			...contentHash !== void 0 ? { content_hash: contentHash } : {}
		}).where("id", "=", id).where("status", "=", "pending").where("storage_key", "=", expectedStorageKey).where((eb) => eb.exists(eb.selectFrom("_emdash_media_upload_attempts").select("storage_key").where("media_id", "=", id).where("storage_key", "=", storageKey).where("status", "=", "active"))).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	/**
	* Confirm upload (mark as ready)
	*/
	async confirmUpload(id, metadata, expectedStorageKey) {
		const updates = { status: "ready" };
		if (metadata?.width !== void 0) updates.width = metadata.width;
		if (metadata?.height !== void 0) updates.height = metadata.height;
		if (metadata?.size !== void 0) updates.size = metadata.size;
		if (metadata?.blurhash !== void 0) updates.blurhash = metadata.blurhash;
		if (metadata?.dominantColor !== void 0) updates.dominant_color = metadata.dominantColor;
		if (metadata?.contentHash !== void 0) updates.content_hash = metadata.contentHash;
		let query = this.db.updateTable("media").set(updates).where("id", "=", id).where("status", "=", "pending");
		if (expectedStorageKey !== void 0) query = query.where("storage_key", "=", expectedStorageKey);
		const row = await query.returningAll().executeTakeFirst();
		return row ? this.rowToItem(row) : null;
	}
	/**
	* Mark upload as failed
	*/
	async markFailed(id, expectedStorageKey) {
		let query = this.db.updateTable("media").set({ status: "failed" }).where("id", "=", id);
		if (expectedStorageKey !== void 0) query = query.where("status", "=", "pending").where("storage_key", "=", expectedStorageKey);
		const row = await query.returningAll().executeTakeFirst();
		return row ? this.rowToItem(row) : null;
	}
	/**
	* Find media by ID
	*/
	async findById(id) {
		const row = await this.db.selectFrom("media").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToItem(row) : null;
	}
	/**
	* Find media by filename
	* Useful for idempotent imports
	*/
	async findByFilename(filename) {
		const row = await this.db.selectFrom("media").selectAll().where("filename", "=", filename).executeTakeFirst();
		return row ? this.rowToItem(row) : null;
	}
	/**
	* Find media by content hash
	* Used for deduplication - same content = same hash
	*/
	async findByContentHash(contentHash) {
		const row = await this.db.selectFrom("media").selectAll().where("content_hash", "=", contentHash).where("status", "=", "ready").executeTakeFirst();
		return row ? this.rowToItem(row) : null;
	}
	/**
	* Find many media items with cursor pagination
	*
	* Uses keyset pagination (cursor-based) for consistent results.
	* The cursor encodes the created_at and id of the last item.
	*/
	async findMany(options = {}) {
		const limit = Math.min(options.limit || 50, 100);
		let query = this.db.selectFrom("media").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
		if (options.cursor) {
			const { orderValue: createdAt, id: cursorId } = decodeCursor(options.cursor);
			query = query.where((eb) => eb.or([eb("created_at", "<", createdAt), eb.and([eb("created_at", "=", createdAt), eb("id", "<", cursorId)])]));
		}
		const mimeFilters = normalizeMimeFilter(options.mimeType);
		if (mimeFilters.length > 0) query = query.where((eb) => mimeMatchExpr(eb, mimeFilters));
		const term = options.q?.trim();
		if (term) {
			const pattern = `%${escapeLike$1(term)}%`;
			query = query.where(sql`lower(filename)`, "like", sql`lower(${pattern}) escape '\\'`);
		}
		if (options.status !== "all") query = query.where("status", "=", options.status ?? "ready");
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit).map((row) => this.rowToItem(row));
		let nextCursor;
		if (hasMore && items.length > 0) {
			const lastItem = items.at(-1);
			nextCursor = encodeCursor(lastItem.createdAt, lastItem.id);
		}
		return {
			items,
			nextCursor
		};
	}
	/**
	* Update media metadata
	*/
	async update(id, input) {
		if (!await this.findById(id)) return null;
		const updates = {};
		if (input.alt !== void 0) updates.alt = input.alt;
		if (input.caption !== void 0) updates.caption = input.caption;
		if (input.width !== void 0) updates.width = input.width;
		if (input.height !== void 0) updates.height = input.height;
		if (Object.keys(updates).length > 0) await this.db.updateTable("media").set(updates).where("id", "=", id).execute();
		return this.findById(id);
	}
	/**
	* Delete media item
	*/
	async deleteWithStorageKey(id) {
		const deleted = await this.db.deleteFrom("media").where("id", "=", id).returning("storage_key").executeTakeFirst();
		if (deleted) return deleted.storage_key;
		return null;
	}
	async delete(id) {
		return await this.deleteWithStorageKey(id) !== null;
	}
	/**
	* Count media items
	*/
	async count(mimeType) {
		const filters = normalizeMimeFilter(mimeType);
		let query = this.db.selectFrom("media").select((eb) => eb.fn.count("id").as("count"));
		if (filters.length > 0) query = query.where((eb) => mimeMatchExpr(eb, filters));
		const result = await query.executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Delete pending uploads older than the given age.
	* Pending uploads that were never confirmed indicate abandoned upload flows.
	*
	* Returns the storage keys of deleted rows so callers can remove the
	* corresponding files from object storage.
	*/
	async cleanupPendingUploads(maxAgeMs = 36e5) {
		const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
		return (await this.db.deleteFrom("media").where("status", "=", "pending").where("created_at", "<", cutoff).returning("storage_key").execute()).map((r) => r.storage_key);
	}
	/**
	* Convert database row to MediaItem
	*/
	rowToItem(row) {
		return {
			id: row.id,
			filename: row.filename,
			mimeType: row.mime_type,
			size: row.size,
			width: row.width,
			height: row.height,
			alt: row.alt,
			caption: row.caption,
			storageKey: row.storage_key,
			contentHash: row.content_hash,
			blurhash: row.blurhash,
			dominantColor: row.dominant_color,
			status: row.status,
			createdAt: row.created_at,
			authorId: row.author_id
		};
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/repositories/options.ts
function escapeLike(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
/**
* Options repository for key-value settings storage
*
* Used for site settings, plugin configuration, and other arbitrary key-value data.
* Values are stored as JSON for flexibility.
*/
var OptionsRepository = class {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* Get an option value
	*/
	async get(name) {
		const row = await this.db.selectFrom("options").select("value").where("name", "=", name).executeTakeFirst();
		if (!row) return null;
		return JSON.parse(row.value);
	}
	/**
	* Get an option value with a default
	*/
	async getOrDefault(name, defaultValue) {
		return await this.get(name) ?? defaultValue;
	}
	/**
	* Set an option value (creates or updates)
	*/
	async set(name, value) {
		const row = {
			name,
			value: JSON.stringify(value)
		};
		await this.db.insertInto("options").values(row).onConflict((oc) => oc.column("name").doUpdateSet({ value: row.value })).execute();
	}
	/**
	* Set an option value only if no row with that name exists. Atomic at the
	* database level via INSERT ... ON CONFLICT DO NOTHING, so concurrent
	* callers can't race past the check.
	*
	* Returns true when the row was inserted, false when a row already
	* existed (regardless of its value — even an empty string or null).
	*/
	async setIfAbsent(name, value) {
		const row = {
			name,
			value: JSON.stringify(value)
		};
		return ((await this.db.insertInto("options").values(row).onConflict((oc) => oc.column("name").doNothing()).executeTakeFirst()).numInsertedOrUpdatedRows ?? 0n) > 0n;
	}
	/**
	* Delete an option
	*/
	async delete(name) {
		return ((await this.db.deleteFrom("options").where("name", "=", name).executeTakeFirst()).numDeletedRows ?? 0) > 0;
	}
	/**
	* Check if an option exists
	*/
	async exists(name) {
		return !!await this.db.selectFrom("options").select("name").where("name", "=", name).executeTakeFirst();
	}
	/**
	* Get multiple options at once
	*/
	async getMany(names) {
		if (names.length === 0) return /* @__PURE__ */ new Map();
		const rows = await this.db.selectFrom("options").select(["name", "value"]).where("name", "in", names).execute();
		const result = /* @__PURE__ */ new Map();
		for (const row of rows) result.set(row.name, JSON.parse(row.value));
		return result;
	}
	/**
	* Set multiple options at once
	*/
	async setMany(options) {
		const entries = Object.entries(options);
		if (entries.length === 0) return;
		for (const [name, value] of entries) await this.set(name, value);
	}
	/**
	* Get all options (use sparingly)
	*/
	async getAll() {
		const rows = await this.db.selectFrom("options").select(["name", "value"]).execute();
		const result = /* @__PURE__ */ new Map();
		for (const row of rows) result.set(row.name, JSON.parse(row.value));
		return result;
	}
	/**
	* Get all options matching a prefix
	*/
	async getByPrefix(prefix) {
		const pattern = `${escapeLike(prefix)}%`;
		const rows = await this.db.selectFrom("options").select(["name", "value"]).where(sql`name LIKE ${pattern} ESCAPE '\\'`).execute();
		const result = /* @__PURE__ */ new Map();
		for (const row of rows) result.set(row.name, JSON.parse(row.value));
		return result;
	}
	/**
	* Delete all options matching a prefix
	*/
	async deleteByPrefix(prefix) {
		const pattern = `${escapeLike(prefix)}%`;
		const result = await this.db.deleteFrom("options").where(sql`name LIKE ${pattern} ESCAPE '\\'`).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/utils/single-flight-cache.ts
/**
* Global-scope async value cache with single-flight and poison-immunity.
*
* Built for the "compute once for the lifetime of the JS global scope, read
* on every request" caches (site settings, search-health verification, ...).
* That global scope is the process on Node and the isolate on Cloudflare
* Workers — this helper is platform-neutral; the hazard it defends against is
* specific to workerd but the cache itself is not.
*
* These caches must coalesce concurrent cold reads into one query — but the
* obvious way to do that, caching the in-flight *promise* on a global and
* awaiting it from later requests, is unsafe on workerd: if the request that
* created the promise is cancelled mid-await (client disconnect, context
* teardown), its continuation never runs, so the promise neither resolves nor
* rejects. Every later request that awaits that shared promise then hangs
* until the isolate is evicted (observed as 524s at the 100s wall, near-zero
* CPU). A `.catch`/`.finally` that clears the cache doesn't help — a cancelled
* request settles neither way.
*
* This cache stores the resolved *value* (not a promise) and coalesces via
* `initWithLock`: one request becomes the owner and runs `fetch`, everyone
* else polls for the published value and never awaits the owner's promise.
* A cancelled owner can therefore never strand a waiter — the worst case is
* the lock looks held until `deadlineMs`, then the next caller reclaims. The
* owner's `fetch` is also anchored (waitUntil) so a cancelled originator's
* query still completes and populates the cache, and bounded by
* `ownerTimeoutMs` so a genuinely stuck fetch reclaims instead of hanging.
*
* Invalidation bumps `version`; reads compare against the version captured at
* call time and refetch on mismatch.
*/
function createSingleFlightCache() {
	return {
		value: null,
		hasValue: false,
		version: 0,
		valueVersion: -1,
		lock: createInitLock()
	};
}
/**
* Headroom between the owner's own timeout and the waiter reclaim deadline.
* The reclaim deadline must sit *above* `ownerTimeoutMs` so a slow-but-live
* owner times out (and releases the lock) before a waiter would reclaim it —
* otherwise a fetch slower than the deadline is superseded before it can
* publish, and steady traffic turns that into a self-sustaining stampede.
*/
var RECLAIM_HEADROOM_MS = 5e3;
function withTimeout(promise, ms) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(/* @__PURE__ */ new Error(`singleFlightCached: owner fetch exceeded ${ms}ms`));
		}, ms);
		promise.then(resolve, reject).finally(() => {
			clearTimeout(timer);
		});
	});
}
/**
* Return the cached value for `cache`, computing it via `fetch` under a
* single-flight lock on a miss. Concurrent callers coalesce onto one fetch;
* a cancelled owner cannot poison later callers (see file header).
*/
function singleFlightCached(cache, fetch, options = {}) {
	const versionAtCall = cache.version;
	const ownerTimeoutMs = options.ownerTimeoutMs !== void 0 && Number.isFinite(options.ownerTimeoutMs) && options.ownerTimeoutMs > 0 ? options.ownerTimeoutMs : void 0;
	const deadlineMs = ownerTimeoutMs === void 0 ? options.deadlineMs : Math.max(options.deadlineMs ?? 0, ownerTimeoutMs + RECLAIM_HEADROOM_MS);
	return initWithLock(cache.lock, () => cache.hasValue && cache.valueVersion === versionAtCall ? { v: cache.value } : null, (isCurrentClaim) => {
		const real = (async () => {
			const value = await fetch();
			if (isCurrentClaim()) {
				cache.value = value;
				cache.hasValue = true;
				cache.valueVersion = versionAtCall;
			}
			return { v: value };
		})();
		options.anchor?.(real.then(() => void 0, () => void 0));
		return ownerTimeoutMs === void 0 ? real : withTimeout(real, ownerTimeoutMs);
	}, {
		deadlineMs,
		pollMs: options.pollMs,
		maxWaitMs: options.maxWaitMs
	}).then((box) => box.v);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/settings/index.ts
/** Object-cache namespace for site settings. */
var SETTINGS_CACHE_NAMESPACE = "settings";
/** Prefix for site settings in the options table */
var SETTINGS_PREFIX = "site:";
/**
* Worker-isolate cache for the resolved `site:*` settings.
*
* Site settings (title, logo, SEO defaults) change rarely but are read on
* every public request. Caching across the isolate's lifetime drops the
* `options WHERE name LIKE 'site:%'` prefix scan from once-per-request to
* once-per-isolate. Cross-isolate staleness is bounded by isolate lifetime
* (workerd typically recycles within minutes); acceptable for chrome.
*
* Backed by single-flight-cache.ts: concurrent cold reads coalesce onto one
* query via a reclaimable single-flight lock and the resolved *value* is
* cached — never a shared in-flight promise, so a cancelled request can't
* poison the isolate (see that file's header). Stored on globalThis with a
* Symbol.for key so Vite SSR chunk duplication doesn't produce two
* independent caches (same pattern as request-context.ts).
*/
var SITE_SETTINGS_CACHE_KEY = Symbol.for("emdash:site-settings");
var g = globalThis;
var settingsCache = g[SITE_SETTINGS_CACHE_KEY] ?? (() => {
	const c = createSingleFlightCache();
	g[SITE_SETTINGS_CACHE_KEY] = c;
	return c;
})();
/**
* Resolve a media reference to include the full URL plus content metadata.
*
* Pulls `mimeType` and intrinsic dimensions from the media row so callers
* can emit correct head tags (e.g. `<link rel="icon" type="image/svg+xml">`,
* which Chromium requires when the URL has no `.svg` extension) without
* a second round-trip to the media table.
*/
async function resolveMediaReference(mediaRef, db, _storage) {
	if (!mediaRef?.mediaId) return mediaRef;
	try {
		const media = await new MediaRepository(db).findById(mediaRef.mediaId);
		if (media) return {
			...mediaRef,
			url: `/_emdash/api/media/file/${media.storageKey}`,
			contentType: media.mimeType,
			...media.width !== null ? { width: media.width } : {},
			...media.height !== null ? { height: media.height } : {}
		};
	} catch {}
	return mediaRef;
}
/**
* Get all site settings
*
* Returns all configured settings. Unset values are undefined.
* Media references (logo/favicon) are resolved to include URLs.
*
* @example
* ```ts
* import { getSiteSettings } from "emdash";
*
* const settings = await getSiteSettings();
* console.log(settings.title); // "My Site"
* console.log(settings.logo?.url); // "/_emdash/api/media/file/abc123"
* ```
*/
function getSiteSettings() {
	return requestCached("siteSettings", () => singleFlightCached(settingsCache, () => cachedQuery({
		namespace: SETTINGS_CACHE_NAMESPACE,
		key: "all",
		load: async () => {
			return getSiteSettingsWithDb(await getDb());
		}
	}), {
		anchor: (promise) => after(() => promise),
		ownerTimeoutMs: 3e4
	}));
}
/**
* Get all site settings (with explicit db)
*
* @internal Use `getSiteSettings()` in templates. This variant is for admin routes
* that already have a database handle.
*/
async function getSiteSettingsWithDb(db, storage = null) {
	const allOptions = await new OptionsRepository(db).getByPrefix(SETTINGS_PREFIX);
	const settings = {};
	for (const [key, value] of allOptions) {
		const settingKey = key.replace(SETTINGS_PREFIX, "");
		settings[settingKey] = value;
	}
	const typedSettings = settings;
	if (typedSettings.logo) typedSettings.logo = await resolveMediaReference(typedSettings.logo, db, storage);
	if (typedSettings.favicon) typedSettings.favicon = await resolveMediaReference(typedSettings.favicon, db, storage);
	if (typedSettings.seo?.defaultOgImage) typedSettings.seo = {
		...typedSettings.seo,
		defaultOgImage: await resolveMediaReference(typedSettings.seo.defaultOgImage, db, storage)
	};
	return typedSettings;
}
//#endregion
export { getSiteSettingsWithDb as n, getSiteSettings as t };
