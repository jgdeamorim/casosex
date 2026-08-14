import { a as sql } from "./migrator_BiAfLowp.mjs";
import { a as getDb } from "./loader-C1XOLV5b_BlhHvfIP.mjs";
import { b as validateIdentifier, c as resolveConfiguredLocale, o as getI18nConfig, p as currentTimestampValue, r as __exportAll } from "./runner-BsI18UgP_CTLRmh7U.mjs";
import { t as after } from "./after-B1IIdH3Y_D2PBgJNO.mjs";
import { c as invalidateObjectCache, n as cachedQuery, u as invalidateTaxonomyObjectCache } from "./object-cache-Bok5j2ae_B1rhuniT.mjs";
import { a as encodeCursor, i as decodeCursor } from "./types-XrQQ-Aex_rb6o-8d1.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { n as isMissingTableError } from "./db-errors-CcWLaRiR_Bz5UsdxN.mjs";
import { n as RevisionRepository, t as ContentRepository } from "./content-CpfKV9QE_etLgubJd.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { c as markContentMediaUsageCollectionStaleSafely, i as FTSManager, n as SchemaRegistry } from "./registry-BP1JK2xh_BIzMuG5Y.mjs";
import { r as requestCached } from "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import { i as initWithLock, r as createInitLock } from "./field-defs-cache-QMVnzTH6_BiUIoOqw.mjs";
import { i as matchPattern, n as interpolateDestination, r as isPattern, t as compilePattern } from "./patterns-CiyXeDgr_BjEV9VhB.mjs";
import { t as BylineRepository } from "./byline-C5TAqs8N_VeQwI3KK.mjs";
import { t as validateSeed } from "./validate-Bs_wT2ul_D6-mmjph.mjs";
//#region self-essentials/emdash-main/packages/core/dist/options-BlmBHTvX.mjs
function escapeLike$1(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
/**
* Options repository for key-value settings storage
*
* Used for site settings, plugin configuration, and other arbitrary key-value data.
* Values are stored as JSON for flexibility.
*/
var OptionsRepository = class {
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
		const pattern = `${escapeLike$1(prefix)}%`;
		const rows = await this.db.selectFrom("options").select(["name", "value"]).where(sql`name LIKE ${pattern} ESCAPE '\\'`).execute();
		const result = /* @__PURE__ */ new Map();
		for (const row of rows) result.set(row.name, JSON.parse(row.value));
		return result;
	}
	/**
	* Delete all options matching a prefix
	*/
	async deleteByPrefix(prefix) {
		const pattern = `${escapeLike$1(prefix)}%`;
		const result = await this.db.deleteFrom("options").where(sql`name LIKE ${pattern} ESCAPE '\\'`).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/media-tQDZEdu7.mjs
/** Escape LIKE wildcard characters and the escape char itself in user-supplied values */
function escapeLike(value) {
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
	return eb.or(filters.map((entry) => entry.endsWith("/") ? sql`mime_type LIKE ${`${escapeLike(entry)}%`} ESCAPE '\\'` : eb("mime_type", "=", entry)));
}
var UPLOAD_ATTEMPT_CLEANUP_AGE_MS = 36e5;
var UPLOAD_ATTEMPT_CLEANUP_BATCH_SIZE = 100;
/**
* Media repository for database operations
*/
var MediaRepository = class {
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
			const pattern = `%${escapeLike(term)}%`;
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
//#region self-essentials/emdash-main/packages/core/dist/taxonomy-DvwWAPvA.mjs
var EMPTY_DENORM = {
	status: null,
	scheduled_at: null,
	deleted_at: null,
	locale: null,
	published_at: null,
	created_at: null
};
/**
* Taxonomy repository for categories, tags, and other classification.
*
* Terms are per-locale. Translations of the same term share a `translation_group`
* ULID. `content_taxonomies.taxonomy_id` stores the translation_group so a single
* association spans every locale of a post.
*
* The repository does not resolve locale fallbacks on its own — callers supply
* the locale they want. Runtime helpers and handlers use `getFallbackChain()`
* from `i18n/config` when they need fallback behaviour.
*/
var TaxonomyRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new taxonomy term. When `translationOf` is set the new row joins
	* the source term's translation_group; otherwise a fresh group is minted
	* (matching the migration backfill pattern `translation_group = id`).
	*/
	async create(input) {
		const id = ulid();
		const parentInput = input.parentId === void 0 || input.parentId === "" ? null : input.parentId;
		const parentId = parentInput ? await this.resolveParentRef(parentInput) : null;
		let translationGroup = id;
		if (input.translationOf) {
			const source = await this.findById(input.translationOf);
			if (source?.translationGroup) translationGroup = source.translationGroup;
		}
		await this.db.insertInto("taxonomies").values({
			id,
			name: input.name,
			slug: input.slug,
			label: input.label,
			parent_id: parentId,
			data: input.data ? JSON.stringify(input.data) : null,
			...input.locale !== void 0 ? { locale: input.locale } : {},
			translation_group: translationGroup
		}).execute();
		invalidateTaxonomyObjectCache();
		const taxonomy = await this.findById(id);
		if (!taxonomy) throw new Error("Failed to create taxonomy");
		return taxonomy;
	}
	async findById(id) {
		const row = await this.db.selectFrom("taxonomies").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToTaxonomy(row) : null;
	}
	/**
	* Find a term by (name, slug). When `locale` is provided, filter by it.
	* When omitted, returns the lowest-locale-code match (deterministic across
	* calls). Mirrors `ContentRepository.findBySlug`.
	*/
	async findBySlug(name, slug, locale) {
		let query = this.db.selectFrom("taxonomies").selectAll().where("name", "=", name).where("slug", "=", slug);
		if (locale !== void 0) query = query.where("locale", "=", locale);
		const row = await query.orderBy("locale", "asc").executeTakeFirst();
		return row ? this.rowToTaxonomy(row) : null;
	}
	/**
	* Get all terms for a taxonomy (e.g., all categories).
	*
	* `id asc` is a stable tiebreaker for terms that share a label. Without it
	* the SQL ordering is implementation-defined when labels match, which
	* breaks keyset pagination over `(label, id)`.
	*/
	async findByName(name, options = {}) {
		let query = this.db.selectFrom("taxonomies").selectAll().where("name", "=", name).orderBy("label", "asc").orderBy("id", "asc");
		if (options.locale !== void 0) query = query.where("locale", "=", options.locale);
		if (options.parentId !== void 0) if (options.parentId === null) query = query.where("parent_id", "is", null);
		else query = query.where("parent_id", "=", options.parentId);
		return (await query.execute()).map((row) => this.rowToTaxonomy(row));
	}
	/**
	* Children of a term. Accepts a term id OR a translation_group and resolves
	* to the group, since `parent_id` stores the parent's translation_group.
	* Pass `locale` to scope to one locale's tree (children share the parent's
	* group across locales); omit it to find children in every locale (used to
	* block deletes that would orphan a sibling translation's subtree).
	*/
	async findChildren(parentIdOrGroup, locale) {
		const group = await this.resolveTranslationGroup(parentIdOrGroup);
		if (!group) return [];
		let query = this.db.selectFrom("taxonomies").selectAll().where("parent_id", "=", group).orderBy("label", "asc").orderBy("id", "asc");
		if (locale !== void 0) query = query.where("locale", "=", locale);
		return (await query.execute()).map((row) => this.rowToTaxonomy(row));
	}
	/**
	* Every translation sibling of a term (including itself), identified by
	* their shared `translation_group`.
	*/
	async findTranslations(translationGroup) {
		return (await this.db.selectFrom("taxonomies").selectAll().where("translation_group", "=", translationGroup).orderBy("locale", "asc").execute()).map((row) => this.rowToTaxonomy(row));
	}
	async update(id, input) {
		if (!await this.findById(id)) return null;
		const updates = {};
		if (input.slug !== void 0) updates.slug = input.slug;
		if (input.label !== void 0) updates.label = input.label;
		if (input.parentId !== void 0) updates.parent_id = input.parentId === "" || input.parentId === null ? null : await this.resolveParentRef(input.parentId);
		if (input.data !== void 0) updates.data = JSON.stringify(input.data);
		if (Object.keys(updates).length > 0) {
			await this.db.updateTable("taxonomies").set(updates).where("id", "=", id).execute();
			invalidateTaxonomyObjectCache();
		}
		return this.findById(id);
	}
	async delete(id) {
		const term = await this.findById(id);
		if (!term) return false;
		if (term.translationGroup) {
			if ((await this.db.selectFrom("taxonomies").select("id").where("translation_group", "=", term.translationGroup).where("id", "!=", id).execute()).length === 0) await this.db.deleteFrom("content_taxonomies").where("taxonomy_id", "=", term.translationGroup).execute();
		}
		const result = await this.db.deleteFrom("taxonomies").where("id", "=", id).executeTakeFirst();
		invalidateTaxonomyObjectCache();
		return (result.numDeletedRows ?? 0n) > 0n;
	}
	async attachToEntry(collection, entryId, taxonomyId) {
		const group = await this.resolveTranslationGroup(taxonomyId);
		if (!group) return;
		const denorm = await this.fetchEntryDenorm(collection, entryId);
		await this.db.insertInto("content_taxonomies").values({
			collection,
			entry_id: entryId,
			taxonomy_id: group,
			...denorm
		}).onConflict((oc) => oc.doNothing()).execute();
		invalidateTaxonomyObjectCache();
	}
	async detachFromEntry(collection, entryId, taxonomyId) {
		const group = await this.resolveTranslationGroup(taxonomyId);
		if (!group) return;
		await this.db.deleteFrom("content_taxonomies").where("collection", "=", collection).where("entry_id", "=", entryId).where("taxonomy_id", "=", group).execute();
		invalidateTaxonomyObjectCache();
	}
	/**
	* Taxonomy terms assigned to a content entry, resolved into a specific locale.
	* Terms whose translation_group lacks a row in the requested locale are
	* omitted — callers wanting fallback behaviour apply it themselves.
	*/
	async getTermsForEntry(collection, entryId, taxonomyName, locale) {
		let query = this.db.selectFrom("content_taxonomies").innerJoin("taxonomies", "taxonomies.translation_group", "content_taxonomies.taxonomy_id").selectAll("taxonomies").where("content_taxonomies.collection", "=", collection).where("content_taxonomies.entry_id", "=", entryId);
		if (taxonomyName) query = query.where("taxonomies.name", "=", taxonomyName);
		if (locale !== void 0) query = query.where("taxonomies.locale", "=", locale);
		return (await query.orderBy("taxonomies.locale", "asc").execute()).map((row) => this.rowToTaxonomy(row));
	}
	/**
	* Replace all assignments of a given taxonomy for one content entry.
	* Term ids OR translation_groups are accepted and normalised to groups.
	*/
	async setTermsForEntry(collection, entryId, taxonomyName, termIds) {
		const groups = [];
		for (const id of termIds) {
			const group = await this.resolveTranslationGroup(id);
			if (group) groups.push(group);
		}
		const newGroups = new Set(groups);
		const current = await this.db.selectFrom("content_taxonomies").innerJoin("taxonomies", "taxonomies.translation_group", "content_taxonomies.taxonomy_id").select(["content_taxonomies.taxonomy_id as group"]).distinct().where("content_taxonomies.collection", "=", collection).where("content_taxonomies.entry_id", "=", entryId).where("taxonomies.name", "=", taxonomyName).execute();
		const currentGroups = new Set(current.map((r) => r.group));
		const toRemove = [...currentGroups].filter((g) => !newGroups.has(g));
		if (toRemove.length > 0) await this.db.deleteFrom("content_taxonomies").where("collection", "=", collection).where("entry_id", "=", entryId).where("taxonomy_id", "in", toRemove).execute();
		const toAdd = [...newGroups].filter((g) => !currentGroups.has(g));
		if (toAdd.length > 0) {
			const denorm = await this.fetchEntryDenorm(collection, entryId);
			await this.db.insertInto("content_taxonomies").values(toAdd.map((taxonomy_id) => ({
				collection,
				entry_id: entryId,
				taxonomy_id,
				...denorm
			}))).onConflict((oc) => oc.doNothing()).execute();
		}
		if (toRemove.length > 0 || toAdd.length > 0) invalidateTaxonomyObjectCache();
	}
	async clearEntryTerms(collection, entryId) {
		const result = await this.db.deleteFrom("content_taxonomies").where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
		const removed = Number(result.numDeletedRows ?? 0);
		if (removed > 0) invalidateTaxonomyObjectCache();
		return removed;
	}
	/**
	* Copy every term assignment from one content entry to another. Used when
	* creating a translation of a post so the new translation inherits the
	* source's term assignments. Safe to call when the source has no terms.
	*/
	async copyEntryTerms(collection, sourceEntryId, targetEntryId) {
		const rows = await this.db.selectFrom("content_taxonomies").select(["taxonomy_id"]).where("collection", "=", collection).where("entry_id", "=", sourceEntryId).execute();
		if (rows.length === 0) return;
		const denorm = await this.fetchEntryDenorm(collection, targetEntryId);
		await this.db.insertInto("content_taxonomies").values(rows.map((r) => ({
			collection,
			entry_id: targetEntryId,
			taxonomy_id: r.taxonomy_id,
			...denorm
		}))).onConflict((oc) => oc.doNothing()).execute();
		invalidateTaxonomyObjectCache();
	}
	/**
	* Read the denormalized filter + sort columns from an entry's `ec_*` row so
	* they can be stamped onto new pivot rows (migration 051). A missing table or
	* missing row yields all-nulls: the pivot columns are advisory, and the
	* listing read path re-checks the authoritative `ec_*` row regardless.
	*/
	async fetchEntryDenorm(collection, entryId) {
		validateIdentifier(collection, "collection type");
		const tableName = `ec_${collection}`;
		try {
			return (await sql`
				SELECT status, scheduled_at, deleted_at, locale, published_at, created_at
				FROM ${sql.ref(tableName)}
				WHERE id = ${entryId}
			`.execute(this.db)).rows[0] ?? EMPTY_DENORM;
		} catch (error) {
			if (isMissingTableError(error)) return EMPTY_DENORM;
			throw error;
		}
	}
	/**
	* Count content entries that use any translation of this term. Accepts
	* either a term id or a translation_group — we normalise to the group.
	*
	* Counts raw pivot rows regardless of the entry's status or deletion —
	* drafts and trashed entries are included. User-facing counts (admin term
	* list/get, public widget and term pages) use `fetchVisibleTermCounts`
	* from `taxonomies/term-counts.ts` instead, which counts only publicly
	* visible entries.
	*/
	async countEntriesWithTerm(termIdOrGroup) {
		const group = await this.resolveTranslationGroup(termIdOrGroup);
		if (!group) return 0;
		const result = await this.db.selectFrom("content_taxonomies").select((eb) => eb.fn.count("entry_id").as("count")).where("taxonomy_id", "=", group).executeTakeFirst();
		return Number(result?.count ?? 0);
	}
	/**
	* Resolve a parent reference (a row id or a translation_group) to the value
	* persisted in `parent_id`: the parent's translation_group, which is
	* locale-agnostic so the child stays nested in every locale. A
	* translation_group normally equals its anchor row's id, which satisfies the
	* self-FK on `parent_id`. If that anchor row is missing (a translation whose
	* anchor was deleted), fall back to the id we were given so we never write a
	* dangling FK value.
	*/
	async resolveParentRef(idOrGroup) {
		const group = await this.resolveTranslationGroup(idOrGroup);
		if (!group) return idOrGroup;
		return await this.db.selectFrom("taxonomies").select("id").where("id", "=", group).executeTakeFirst() ? group : idOrGroup;
	}
	async resolveTranslationGroup(idOrGroup) {
		return (await this.db.selectFrom("taxonomies").select(["translation_group"]).where((eb) => eb.or([eb("id", "=", idOrGroup), eb("translation_group", "=", idOrGroup)])).executeTakeFirst())?.translation_group ?? null;
	}
	/**
	* Batch count entries for multiple taxonomy translation_groups.
	* Chunks the query at SQL_BATCH_SIZE to stay below D1's bind-parameter limit.
	* Returns a Map from translation_group to count.
	*
	* Pass translation_groups (not term ids) — `content_taxonomies.taxonomy_id`
	* stores the translation_group so a single assignment spans every locale.
	*
	* Like `countEntriesWithTerm`, this counts raw pivot rows regardless of
	* status/deletion; user-facing counts go through `fetchVisibleTermCounts`.
	*/
	async countEntriesForTerms(translationGroups) {
		if (translationGroups.length === 0) return /* @__PURE__ */ new Map();
		const { chunks, SQL_BATCH_SIZE } = await import("./chunks-D5dlPeRb_W_C3r19D.mjs").then((n) => n.r);
		const counts = /* @__PURE__ */ new Map();
		for (const chunk of chunks(translationGroups, SQL_BATCH_SIZE)) {
			const rows = await this.db.selectFrom("content_taxonomies").select(["taxonomy_id", (eb) => eb.fn.count("entry_id").as("count")]).where("taxonomy_id", "in", chunk).groupBy("taxonomy_id").execute();
			for (const row of rows) counts.set(row.taxonomy_id, Number(row.count || 0));
		}
		return counts;
	}
	rowToTaxonomy(row) {
		return {
			id: row.id,
			name: row.name,
			slug: row.slug,
			label: row.label,
			parentId: row.parent_id,
			data: row.data ? JSON.parse(row.data) : null,
			locale: row.locale,
			translationGroup: row.translation_group
		};
	}
};
//#endregion
//#region node_modules/.pnpm/image-size@2.0.2/node_modules/image-size/dist/index.mjs
var decoder = new TextDecoder();
var toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
var toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + `0${i.toString(16)}`.slice(-2), "");
var getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
var readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
var readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
var readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
var readUInt24LE = (input, offset = 0) => {
	const view = getView(input, offset);
	return view.getUint16(0, true) + (view.getUint8(2) << 16);
};
var readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
var readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
var readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
var readUInt64 = (input, offset, isBigEndian) => getView(input, offset).getBigUint64(0, !isBigEndian);
var methods = {
	readUInt16BE,
	readUInt16LE,
	readUInt32BE,
	readUInt32LE
};
function readUInt(input, bits, offset = 0, isBigEndian = false) {
	return methods[`readUInt${bits}${isBigEndian ? "BE" : "LE"}`](input, offset);
}
function readBox(input, offset) {
	if (input.length - offset < 4) return;
	const boxSize = readUInt32BE(input, offset);
	if (input.length - offset < boxSize) return;
	return {
		name: toUTF8String(input, 4 + offset, 8 + offset),
		offset,
		size: boxSize
	};
}
function findBox(input, boxName, currentOffset) {
	while (currentOffset < input.length) {
		const box = readBox(input, currentOffset);
		if (!box) break;
		if (box.name === boxName) return box;
		currentOffset += box.size > 0 ? box.size : 8;
	}
}
var BMP = {
	validate: (input) => toUTF8String(input, 0, 2) === "BM",
	calculate: (input) => ({
		height: Math.abs(readInt32LE(input, 22)),
		width: readUInt32LE(input, 18)
	})
};
var TYPE_ICON = 1;
var SIZE_HEADER = 6;
var SIZE_IMAGE_ENTRY = 16;
function getSizeFromOffset(input, offset) {
	const value = input[offset];
	return value === 0 ? 256 : value;
}
function getImageSize(input, imageIndex) {
	const offset = SIZE_HEADER + imageIndex * SIZE_IMAGE_ENTRY;
	return {
		height: getSizeFromOffset(input, offset + 1),
		width: getSizeFromOffset(input, offset)
	};
}
var ICO = {
	validate(input) {
		const reserved = readUInt16LE(input, 0);
		const imageCount = readUInt16LE(input, 4);
		if (reserved !== 0 || imageCount === 0) return false;
		return readUInt16LE(input, 2) === TYPE_ICON;
	},
	calculate(input) {
		const nbImages = readUInt16LE(input, 4);
		const imageSize2 = getImageSize(input, 0);
		if (nbImages === 1) return imageSize2;
		const images = [];
		for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) images.push(getImageSize(input, imageIndex));
		return {
			width: imageSize2.width,
			height: imageSize2.height,
			images
		};
	}
};
var TYPE_CURSOR = 2;
var CUR = {
	validate(input) {
		const reserved = readUInt16LE(input, 0);
		const imageCount = readUInt16LE(input, 4);
		if (reserved !== 0 || imageCount === 0) return false;
		return readUInt16LE(input, 2) === TYPE_CURSOR;
	},
	calculate: (input) => ICO.calculate(input)
};
var DDS = {
	validate: (input) => readUInt32LE(input, 0) === 542327876,
	calculate: (input) => ({
		height: readUInt32LE(input, 12),
		width: readUInt32LE(input, 16)
	})
};
var gifRegexp = /^GIF8[79]a/;
var GIF = {
	validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
	calculate: (input) => ({
		height: readUInt16LE(input, 8),
		width: readUInt16LE(input, 6)
	})
};
var brandMap = {
	avif: "avif",
	mif1: "heif",
	msf1: "heif",
	heic: "heic",
	heix: "heic",
	hevc: "heic",
	hevx: "heic"
};
var HEIF = {
	validate(input) {
		if (toUTF8String(input, 4, 8) !== "ftyp") return false;
		const ftypBox = findBox(input, "ftyp", 0);
		if (!ftypBox) return false;
		return toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12) in brandMap;
	},
	calculate(input) {
		const metaBox = findBox(input, "meta", 0);
		const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
		const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
		if (!ipcoBox) throw new TypeError("Invalid HEIF, no ipco box found");
		const type = toUTF8String(input, 8, 12);
		const images = [];
		let currentOffset = ipcoBox.offset + 8;
		while (currentOffset < ipcoBox.offset + ipcoBox.size) {
			const ispeBox = findBox(input, "ispe", currentOffset);
			if (!ispeBox) break;
			const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
			const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
			const clapBox = findBox(input, "clap", currentOffset);
			let width = rawWidth;
			let height = rawHeight;
			if (clapBox && clapBox.offset < ipcoBox.offset + ipcoBox.size) width = rawWidth - readUInt32BE(input, clapBox.offset + 12);
			images.push({
				height,
				width
			});
			currentOffset = ispeBox.offset + ispeBox.size;
		}
		if (images.length === 0) throw new TypeError("Invalid HEIF, no sizes found");
		return {
			width: images[0].width,
			height: images[0].height,
			type,
			...images.length > 1 ? { images } : {}
		};
	}
};
var SIZE_HEADER2 = 8;
var FILE_LENGTH_OFFSET = 4;
var ENTRY_LENGTH_OFFSET = 4;
var ICON_TYPE_SIZE = {
	ICON: 32,
	"ICN#": 32,
	"icm#": 16,
	icm4: 16,
	icm8: 16,
	"ics#": 16,
	ics4: 16,
	ics8: 16,
	is32: 16,
	s8mk: 16,
	icp4: 16,
	icl4: 32,
	icl8: 32,
	il32: 32,
	l8mk: 32,
	icp5: 32,
	ic11: 32,
	ich4: 48,
	ich8: 48,
	ih32: 48,
	h8mk: 48,
	icp6: 64,
	ic12: 32,
	it32: 128,
	t8mk: 128,
	ic07: 128,
	ic08: 256,
	ic13: 256,
	ic09: 512,
	ic14: 512,
	ic10: 1024
};
function readImageHeader(input, imageOffset) {
	const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
	return [toUTF8String(input, imageOffset, imageLengthOffset), readUInt32BE(input, imageLengthOffset)];
}
function getImageSize2(type) {
	const size = ICON_TYPE_SIZE[type];
	return {
		width: size,
		height: size,
		type
	};
}
var ICNS = {
	validate: (input) => toUTF8String(input, 0, 4) === "icns",
	calculate(input) {
		const inputLength = input.length;
		const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
		let imageOffset = SIZE_HEADER2;
		const images = [];
		while (imageOffset < fileLength && imageOffset < inputLength) {
			const imageHeader = readImageHeader(input, imageOffset);
			const imageSize2 = getImageSize2(imageHeader[0]);
			images.push(imageSize2);
			imageOffset += imageHeader[1];
		}
		if (images.length === 0) throw new TypeError("Invalid ICNS, no sizes found");
		return {
			width: images[0].width,
			height: images[0].height,
			...images.length > 1 ? { images } : {}
		};
	}
};
var J2C = {
	validate: (input) => readUInt32BE(input, 0) === 4283432785,
	calculate: (input) => ({
		height: readUInt32BE(input, 12),
		width: readUInt32BE(input, 8)
	})
};
var JP2 = {
	validate(input) {
		if (toUTF8String(input, 4, 8) !== "jP  ") return false;
		const ftypBox = findBox(input, "ftyp", 0);
		if (!ftypBox) return false;
		return toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12) === "jp2 ";
	},
	calculate(input) {
		const jp2hBox = findBox(input, "jp2h", 0);
		const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
		if (ihdrBox) return {
			height: readUInt32BE(input, ihdrBox.offset + 8),
			width: readUInt32BE(input, ihdrBox.offset + 12)
		};
		throw new TypeError("Unsupported JPEG 2000 format");
	}
};
var EXIF_MARKER = "45786966";
var APP1_DATA_SIZE_BYTES = 2;
var EXIF_HEADER_BYTES = 6;
var TIFF_BYTE_ALIGN_BYTES = 2;
var BIG_ENDIAN_BYTE_ALIGN = "4d4d";
var LITTLE_ENDIAN_BYTE_ALIGN = "4949";
var IDF_ENTRY_BYTES = 12;
var NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
	return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
	return {
		height: readUInt16BE(input, index),
		width: readUInt16BE(input, index + 2)
	};
}
function extractOrientation(exifBlock, isBigEndian) {
	const offset = EXIF_HEADER_BYTES + 8;
	const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
	for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
		const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
		const end = start + IDF_ENTRY_BYTES;
		if (start > exifBlock.length) return;
		const block = exifBlock.slice(start, end);
		if (readUInt(block, 16, 0, isBigEndian) === 274) {
			if (readUInt(block, 16, 2, isBigEndian) !== 3) return;
			if (readUInt(block, 32, 4, isBigEndian) !== 1) return;
			return readUInt(block, 16, 8, isBigEndian);
		}
	}
}
function validateExifBlock(input, index) {
	const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
	const byteAlign = toHexString(exifBlock, EXIF_HEADER_BYTES, EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES);
	const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
	if (isBigEndian || byteAlign === LITTLE_ENDIAN_BYTE_ALIGN) return extractOrientation(exifBlock, isBigEndian);
}
function validateInput(input, index) {
	if (index > input.length) throw new TypeError("Corrupt JPG, exceeded buffer limits");
}
var JPG = {
	validate: (input) => toHexString(input, 0, 2) === "ffd8",
	calculate(_input) {
		let input = _input.slice(4);
		let orientation;
		let next;
		while (input.length) {
			const i = readUInt16BE(input, 0);
			validateInput(input, i);
			if (input[i] !== 255) {
				input = input.slice(1);
				continue;
			}
			if (isEXIF(input)) orientation = validateExifBlock(input, i);
			next = input[i + 1];
			if (next === 192 || next === 193 || next === 194) {
				const size = extractSize(input, i + 5);
				if (!orientation) return size;
				return {
					height: size.height,
					orientation,
					width: size.width
				};
			}
			input = input.slice(i + 2);
		}
		throw new TypeError("Invalid JPG, no size found");
	}
};
var BitReader = class {
	constructor(input, endianness) {
		this.input = input;
		this.endianness = endianness;
		this.byteOffset = 2;
		this.bitOffset = 0;
	}
	/** Reads a specified number of bits, and move the offset */
	getBits(length = 1) {
		let result = 0;
		let bitsRead = 0;
		while (bitsRead < length) {
			if (this.byteOffset >= this.input.length) throw new Error("Reached end of input");
			const currentByte = this.input[this.byteOffset];
			const bitsLeft = 8 - this.bitOffset;
			const bitsToRead = Math.min(length - bitsRead, bitsLeft);
			if (this.endianness === "little-endian") {
				const mask = (1 << bitsToRead) - 1;
				const bits = currentByte >> this.bitOffset & mask;
				result |= bits << bitsRead;
			} else {
				const bits = (currentByte & (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead) >> 8 - this.bitOffset - bitsToRead;
				result = result << bitsToRead | bits;
			}
			bitsRead += bitsToRead;
			this.bitOffset += bitsToRead;
			if (this.bitOffset === 8) {
				this.byteOffset++;
				this.bitOffset = 0;
			}
		}
		return result;
	}
};
function calculateImageDimension(reader, isSmallImage) {
	if (isSmallImage) return 8 * (1 + reader.getBits(5));
	const extraBits = [
		9,
		13,
		18,
		30
	][reader.getBits(2)];
	return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
	if (isSmallImage && widthMode === 0) return 8 * (1 + reader.getBits(5));
	if (widthMode === 0) return calculateImageDimension(reader, false);
	return Math.floor(height * [
		1,
		1.2,
		4 / 3,
		1.5,
		16 / 9,
		5 / 4,
		2
	][widthMode - 1]);
}
var JXLStream = {
	validate: (input) => {
		return toHexString(input, 0, 2) === "ff0a";
	},
	calculate(input) {
		const reader = new BitReader(input, "little-endian");
		const isSmallImage = reader.getBits(1) === 1;
		const height = calculateImageDimension(reader, isSmallImage);
		return {
			width: calculateImageWidth(reader, isSmallImage, reader.getBits(3), height),
			height
		};
	}
};
function extractCodestream(input) {
	const jxlcBox = findBox(input, "jxlc", 0);
	if (jxlcBox) return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
	const partialStreams = extractPartialStreams(input);
	if (partialStreams.length > 0) return concatenateCodestreams(partialStreams);
}
function extractPartialStreams(input) {
	const partialStreams = [];
	let offset = 0;
	while (offset < input.length) {
		const jxlpBox = findBox(input, "jxlp", offset);
		if (!jxlpBox) break;
		partialStreams.push(input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size));
		offset = jxlpBox.offset + jxlpBox.size;
	}
	return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
	const totalLength = partialCodestreams.reduce((acc, curr) => acc + curr.length, 0);
	const codestream = new Uint8Array(totalLength);
	let position = 0;
	for (const partial of partialCodestreams) {
		codestream.set(partial, position);
		position += partial.length;
	}
	return codestream;
}
var JXL = {
	validate: (input) => {
		if (toUTF8String(input, 4, 8) !== "JXL ") return false;
		const ftypBox = findBox(input, "ftyp", 0);
		if (!ftypBox) return false;
		return toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12) === "jxl ";
	},
	calculate(input) {
		const codestream = extractCodestream(input);
		if (codestream) return JXLStream.calculate(codestream);
		throw new Error("No codestream found in JXL container");
	}
};
var KTX = {
	validate: (input) => {
		const signature = toUTF8String(input, 1, 7);
		return ["KTX 11", "KTX 20"].includes(signature);
	},
	calculate: (input) => {
		const type = input[5] === 49 ? "ktx" : "ktx2";
		const offset = type === "ktx" ? 36 : 20;
		return {
			height: readUInt32LE(input, offset + 4),
			width: readUInt32LE(input, offset),
			type
		};
	}
};
var pngSignature = "PNG\r\n\n";
var pngImageHeaderChunkName = "IHDR";
var pngFriedChunkName = "CgBI";
var PNG = {
	validate(input) {
		if (pngSignature === toUTF8String(input, 1, 8)) {
			let chunkName = toUTF8String(input, 12, 16);
			if (chunkName === pngFriedChunkName) chunkName = toUTF8String(input, 28, 32);
			if (chunkName !== pngImageHeaderChunkName) throw new TypeError("Invalid PNG");
			return true;
		}
		return false;
	},
	calculate(input) {
		if (toUTF8String(input, 12, 16) === pngFriedChunkName) return {
			height: readUInt32BE(input, 36),
			width: readUInt32BE(input, 32)
		};
		return {
			height: readUInt32BE(input, 20),
			width: readUInt32BE(input, 16)
		};
	}
};
var PNMTypes = {
	P1: "pbm/ascii",
	P2: "pgm/ascii",
	P3: "ppm/ascii",
	P4: "pbm",
	P5: "pgm",
	P6: "ppm",
	P7: "pam",
	PF: "pfm"
};
var handlers = {
	default: (lines) => {
		let dimensions = [];
		while (lines.length > 0) {
			const line = lines.shift();
			if (line[0] === "#") continue;
			dimensions = line.split(" ");
			break;
		}
		if (dimensions.length === 2) return {
			height: Number.parseInt(dimensions[1], 10),
			width: Number.parseInt(dimensions[0], 10)
		};
		throw new TypeError("Invalid PNM");
	},
	pam: (lines) => {
		const size = {};
		while (lines.length > 0) {
			const line = lines.shift();
			if (line.length > 16 || line.charCodeAt(0) > 128) continue;
			const [key, value] = line.split(" ");
			if (key && value) size[key.toLowerCase()] = Number.parseInt(value, 10);
			if (size.height && size.width) break;
		}
		if (size.height && size.width) return {
			height: size.height,
			width: size.width
		};
		throw new TypeError("Invalid PAM");
	}
};
var PNM = {
	validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
	calculate(input) {
		const type = PNMTypes[toUTF8String(input, 0, 2)];
		const lines = toUTF8String(input, 3).split(/[\r\n]+/);
		return (handlers[type] || handlers.default)(lines);
	}
};
var PSD = {
	validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
	calculate: (input) => ({
		height: readUInt32BE(input, 14),
		width: readUInt32BE(input, 18)
	})
};
var svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
var extractorRegExps = {
	height: /\sheight=(['"])([^%]+?)\1/,
	root: svgReg,
	viewbox: /\sviewBox=(['"])(.+?)\1/i,
	width: /\swidth=(['"])([^%]+?)\1/
};
var INCH_CM = 2.54;
var units = {
	in: 96,
	cm: 96 / INCH_CM,
	em: 16,
	ex: 8,
	m: 96 / INCH_CM * 100,
	mm: 96 / INCH_CM / 10,
	pc: 96 / 72 / 12,
	pt: 96 / 72,
	px: 1
};
var unitsReg = new RegExp(`^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`);
function parseLength(len) {
	const m = unitsReg.exec(len);
	if (!m) return;
	return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
	const bounds = viewbox.split(" ");
	return {
		height: parseLength(bounds[3]),
		width: parseLength(bounds[2])
	};
}
function parseAttributes(root) {
	const width = root.match(extractorRegExps.width);
	const height = root.match(extractorRegExps.height);
	const viewbox = root.match(extractorRegExps.viewbox);
	return {
		height: height && parseLength(height[2]),
		viewbox: viewbox && parseViewbox(viewbox[2]),
		width: width && parseLength(width[2])
	};
}
function calculateByDimensions(attrs) {
	return {
		height: attrs.height,
		width: attrs.width
	};
}
function calculateByViewbox(attrs, viewbox) {
	const ratio = viewbox.width / viewbox.height;
	if (attrs.width) return {
		height: Math.floor(attrs.width / ratio),
		width: attrs.width
	};
	if (attrs.height) return {
		height: attrs.height,
		width: Math.floor(attrs.height * ratio)
	};
	return {
		height: viewbox.height,
		width: viewbox.width
	};
}
var SVG = {
	validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
	calculate(input) {
		const root = toUTF8String(input).match(extractorRegExps.root);
		if (root) {
			const attrs = parseAttributes(root[0]);
			if (attrs.width && attrs.height) return calculateByDimensions(attrs);
			if (attrs.viewbox) return calculateByViewbox(attrs, attrs.viewbox);
		}
		throw new TypeError("Invalid SVG");
	}
};
var TGA = {
	validate(input) {
		return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
	},
	calculate(input) {
		return {
			height: readUInt16LE(input, 14),
			width: readUInt16LE(input, 12)
		};
	}
};
var CONSTANTS = {
	TAG: {
		WIDTH: 256,
		HEIGHT: 257,
		COMPRESSION: 259
	},
	TYPE: {
		SHORT: 3,
		LONG: 4,
		LONG8: 16
	},
	ENTRY_SIZE: {
		STANDARD: 12,
		BIG: 20
	},
	COUNT_SIZE: {
		STANDARD: 2,
		BIG: 8
	}
};
function readIFD(input, { isBigEndian, isBigTiff }) {
	const ifdOffset = isBigTiff ? Number(readUInt64(input, 8, isBigEndian)) : readUInt(input, 32, 4, isBigEndian);
	const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
	return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(input, type, offset, isBigEndian) {
	switch (type) {
		case CONSTANTS.TYPE.SHORT: return readUInt(input, 16, offset, isBigEndian);
		case CONSTANTS.TYPE.LONG: return readUInt(input, 32, offset, isBigEndian);
		case CONSTANTS.TYPE.LONG8: {
			const value = Number(readUInt64(input, offset, isBigEndian));
			if (value > Number.MAX_SAFE_INTEGER) throw new TypeError("Value too large");
			return value;
		}
		default: return 0;
	}
}
function nextTag(input, isBigTiff) {
	const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
	if (input.length > entrySize) return input.slice(entrySize);
}
function extractTags(input, { isBigEndian, isBigTiff }) {
	const tags = {};
	let temp = input;
	while (temp?.length) {
		const code = readUInt(temp, 16, 0, isBigEndian);
		const type = readUInt(temp, 16, 2, isBigEndian);
		const length = isBigTiff ? Number(readUInt64(temp, 4, isBigEndian)) : readUInt(temp, 32, 4, isBigEndian);
		if (code === 0) break;
		if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) tags[code] = readTagValue(temp, type, isBigTiff ? 12 : 8, isBigEndian);
		temp = nextTag(temp, isBigTiff);
	}
	return tags;
}
function determineFormat(input) {
	const signature = toUTF8String(input, 0, 2);
	const version = readUInt(input, 16, 2, signature === "MM");
	return {
		isBigEndian: signature === "MM",
		isBigTiff: version === 43
	};
}
function validateBigTIFFHeader(input, isBigEndian) {
	const byteSize = readUInt(input, 16, 4, isBigEndian);
	const reserved = readUInt(input, 16, 6, isBigEndian);
	if (byteSize !== 8 || reserved !== 0) throw new TypeError("Invalid BigTIFF header");
}
var signatures = /* @__PURE__ */ new Set([
	"49492a00",
	"4d4d002a",
	"49492b00",
	"4d4d002b"
]);
var TIFF = {
	validate: (input) => {
		const signature = toHexString(input, 0, 4);
		return signatures.has(signature);
	},
	calculate(input) {
		const format = determineFormat(input);
		if (format.isBigTiff) validateBigTIFFHeader(input, format.isBigEndian);
		const tags = extractTags(readIFD(input, format), format);
		const info = {
			height: tags[CONSTANTS.TAG.HEIGHT],
			width: tags[CONSTANTS.TAG.WIDTH],
			type: format.isBigTiff ? "bigtiff" : "tiff"
		};
		if (tags[CONSTANTS.TAG.COMPRESSION]) info.compression = tags[CONSTANTS.TAG.COMPRESSION];
		if (!info.width || !info.height) throw new TypeError("Invalid Tiff. Missing tags");
		return info;
	}
};
function calculateExtended(input) {
	return {
		height: 1 + readUInt24LE(input, 7),
		width: 1 + readUInt24LE(input, 4)
	};
}
function calculateLossless(input) {
	return {
		height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
		width: 1 + ((input[2] & 63) << 8 | input[1])
	};
}
function calculateLossy(input) {
	return {
		height: readInt16LE(input, 8) & 16383,
		width: readInt16LE(input, 6) & 16383
	};
}
var typeHandlers = /* @__PURE__ */ new Map([
	["bmp", BMP],
	["cur", CUR],
	["dds", DDS],
	["gif", GIF],
	["heif", HEIF],
	["icns", ICNS],
	["ico", ICO],
	["j2c", J2C],
	["jp2", JP2],
	["jpg", JPG],
	["jxl", JXL],
	["jxl-stream", JXLStream],
	["ktx", KTX],
	["png", PNG],
	["pnm", PNM],
	["psd", PSD],
	["svg", SVG],
	["tga", TGA],
	["tiff", TIFF],
	["webp", {
		validate(input) {
			const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
			const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
			const vp8Header = "VP8" === toUTF8String(input, 12, 15);
			return riffHeader && webpHeader && vp8Header;
		},
		calculate(_input) {
			const chunkHeader = toUTF8String(_input, 12, 16);
			const input = _input.slice(20, 30);
			if (chunkHeader === "VP8X") {
				const extendedHeader = input[0];
				const validStart = (extendedHeader & 192) === 0;
				const validEnd = (extendedHeader & 1) === 0;
				if (validStart && validEnd) return calculateExtended(input);
				throw new TypeError("Invalid WebP");
			}
			if (chunkHeader === "VP8 " && input[0] !== 47) return calculateLossy(input);
			const signature = toHexString(input, 3, 6);
			if (chunkHeader === "VP8L" && signature !== "9d012a") return calculateLossless(input);
			throw new TypeError("Invalid WebP");
		}
	}]
]);
var types$1 = Array.from(typeHandlers.keys());
var firstBytes = /* @__PURE__ */ new Map([
	[0, "heif"],
	[56, "psd"],
	[66, "bmp"],
	[68, "dds"],
	[71, "gif"],
	[73, "tiff"],
	[77, "tiff"],
	[82, "webp"],
	[105, "icns"],
	[137, "png"],
	[255, "jpg"]
]);
function detector(input) {
	const byte = input[0];
	const type = firstBytes.get(byte);
	if (type && typeHandlers.get(type).validate(input)) return type;
	return types$1.find((type2) => typeHandlers.get(type2).validate(input));
}
var globalOptions = { disabledTypes: [] };
function imageSize(input) {
	const type = detector(input);
	if (typeof type !== "undefined") {
		if (globalOptions.disabledTypes.indexOf(type) > -1) throw new TypeError(`disabled file type: ${type}`);
		const size = typeHandlers.get(type).calculate(input);
		if (size !== void 0) {
			size.type = size.type ?? type;
			if (size.images && size.images.length > 1) {
				const largestImage = size.images.reduce((largest, current) => {
					return current.width * current.height > largest.width * largest.height ? current : largest;
				}, size.images[0]);
				size.width = largestImage.width;
				size.height = largestImage.height;
			}
			return size;
		}
	}
	throw new TypeError(`unsupported file type: ${type}`);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/single-flight-cache-C2exrGAi.mjs
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
* Force the next `singleFlightCached` call to refetch. An in-flight owner
* fetched at the old version will not publish into the new version, so its
* result is ignored by subsequent reads.
*/
function invalidateSingleFlightCache(cache) {
	cache.version++;
	cache.hasValue = false;
	cache.value = null;
	cache.valueVersion = -1;
	cache.lock.ownerStartedAt = null;
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
//#region self-essentials/emdash-main/packages/core/dist/settings-DgKouY2S.mjs
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
* Bump the isolate-wide site-settings cache version, forcing the next
* `getSiteSettings()` to re-query the database.
*
* Called from every `site:*` write path. Other isolates still serve their
* own cached copy until they expire — staleness bounded by isolate lifetime.
*/
function invalidateSiteSettingsCache() {
	invalidateSingleFlightCache(settingsCache);
	invalidateObjectCache(SETTINGS_CACHE_NAMESPACE);
}
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
/**
* Set site settings (internal function used by admin API)
*
* Merges provided settings with existing ones. Only provided fields are updated.
* Media references should include just the mediaId; URLs are resolved on read.
*
* @param settings - Partial settings object with values to update
* @param db - Kysely database instance
* @returns Promise that resolves when settings are saved
*
* @internal
*
* @example
* ```ts
* // Update multiple settings at once
* await setSiteSettings({
*   title: "My Site",
*   tagline: "Welcome",
*   logo: { mediaId: "med_123", alt: "Logo" }
* }, db);
* ```
*/
async function setSiteSettings(settings, db) {
	const options = new OptionsRepository(db);
	const updates = {};
	for (const [key, value] of Object.entries(settings)) if (value !== void 0) updates[`${SETTINGS_PREFIX}${key}`] = value;
	try {
		await options.setMany(updates);
	} finally {
		invalidateSiteSettingsCache();
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/ssrf-CviKqWmq.mjs
/**
* SSRF protection for import URLs.
*
* Validates that URLs don't target internal/private network addresses.
* Applied before any fetch() call in the import pipeline.
*/
var IPV4_MAPPED_IPV6_DOTTED_PATTERN = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i;
var IPV4_MAPPED_IPV6_HEX_PATTERN = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
var IPV4_TRANSLATED_HEX_PATTERN = /^::ffff:0:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
var IPV6_EXPANDED_MAPPED_PATTERN = /^0{0,4}:0{0,4}:0{0,4}:0{0,4}:0{0,4}:ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
/**
* IPv4-compatible (deprecated) addresses: ::XXXX:XXXX
*
* The WHATWG URL parser normalizes [::127.0.0.1] to [::7f00:1] (no ffff prefix).
* These are deprecated but still parsed, and bypass the ffff-based checks.
*/
var IPV4_COMPATIBLE_HEX_PATTERN = /^::([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
/**
* NAT64 prefix (RFC 6052): 64:ff9b::XXXX:XXXX
*
* Used by NAT64 gateways to embed IPv4 addresses in IPv6.
* [64:ff9b::127.0.0.1] normalizes to [64:ff9b::7f00:1].
*/
var NAT64_HEX_PATTERN = /^64:ff9b::([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
var IPV6_BRACKET_PATTERN = /^\[|\]$/g;
/** Match fc00::/7 ULA — first byte 0xfc or 0xfd followed by any byte. */
var IPV6_ULA_FC_PATTERN = /^fc[0-9a-f]{2}:/;
var IPV6_ULA_FD_PATTERN = /^fd[0-9a-f]{2}:/;
/** Strip trailing dots from an FQDN-form hostname ("localhost." -> "localhost"). */
var TRAILING_DOT_PATTERN = /\.+$/;
/**
* Private and reserved IP ranges that should never be fetched.
*
* Includes:
* - Loopback (127.0.0.0/8)
* - Private (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
* - Link-local (169.254.0.0/16)
* - Cloud metadata (169.254.169.254 — AWS/GCP/Azure)
* - IPv6 loopback and link-local
*/
var BLOCKED_PATTERNS = [
	{
		start: ip4ToNum(127, 0, 0, 0),
		end: ip4ToNum(127, 255, 255, 255)
	},
	{
		start: ip4ToNum(10, 0, 0, 0),
		end: ip4ToNum(10, 255, 255, 255)
	},
	{
		start: ip4ToNum(172, 16, 0, 0),
		end: ip4ToNum(172, 31, 255, 255)
	},
	{
		start: ip4ToNum(192, 168, 0, 0),
		end: ip4ToNum(192, 168, 255, 255)
	},
	{
		start: ip4ToNum(169, 254, 0, 0),
		end: ip4ToNum(169, 254, 255, 255)
	},
	{
		start: ip4ToNum(0, 0, 0, 0),
		end: ip4ToNum(0, 255, 255, 255)
	}
];
var BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"metadata.google.internal",
	"metadata.google",
	"::1"
]);
/**
* Wildcard DNS services that publicly resolve arbitrary IPs embedded in the
* hostname. Commonly used in local dev and by SSRF exploit tooling to bypass
* hostname-only blocklists (e.g. 127.0.0.1.nip.io -> 127.0.0.1).
*
* Matched case-insensitively as a suffix, so both the apex and any subdomain
* are blocked.
*/
var BLOCKED_HOSTNAME_SUFFIXES = [
	"nip.io",
	"sslip.io",
	"xip.io",
	"traefik.me",
	"lvh.me",
	"localtest.me"
];
/** Blocked URL schemes */
var ALLOWED_SCHEMES = /* @__PURE__ */ new Set(["http:", "https:"]);
function ip4ToNum(a, b, c, d) {
	return (a << 24 | b << 16 | c << 8 | d) >>> 0;
}
function parseIpv4(ip) {
	const parts = ip.split(".");
	if (parts.length !== 4) return null;
	const nums = parts.map(Number);
	if (nums.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
	return ip4ToNum(nums[0], nums[1], nums[2], nums[3]);
}
/**
* Convert IPv4-mapped/translated IPv6 addresses from hex form back to IPv4.
*
* The WHATWG URL parser normalizes dotted-decimal to hex:
*   [::ffff:127.0.0.1] -> [::ffff:7f00:1]
*   [::ffff:169.254.169.254] -> [::ffff:a9fe:a9fe]
*
* Without this conversion, the hex forms bypass isPrivateIp() regex checks.
*/
function normalizeIPv6MappedToIPv4(ip) {
	let match = ip.match(IPV4_MAPPED_IPV6_HEX_PATTERN);
	if (!match) match = ip.match(IPV4_TRANSLATED_HEX_PATTERN);
	if (!match) match = ip.match(IPV6_EXPANDED_MAPPED_PATTERN);
	if (!match) match = ip.match(IPV4_COMPATIBLE_HEX_PATTERN);
	if (!match) match = ip.match(NAT64_HEX_PATTERN);
	if (match) {
		const high = parseInt(match[1] ?? "", 16);
		const low = parseInt(match[2] ?? "", 16);
		return `${high >> 8 & 255}.${high & 255}.${low >> 8 & 255}.${low & 255}`;
	}
	return null;
}
function isPrivateIp(ip) {
	const normalized = ip.toLowerCase();
	if (normalized === "::1" || normalized === "::ffff:127.0.0.1") return true;
	const hexIpv4 = normalizeIPv6MappedToIPv4(normalized);
	if (hexIpv4) return isPrivateIp(hexIpv4);
	const v4Match = normalized.match(IPV4_MAPPED_IPV6_DOTTED_PATTERN);
	const num = parseIpv4(v4Match ? v4Match[1] : normalized);
	if (num === null) return normalized.startsWith("fe80:") || IPV6_ULA_FC_PATTERN.test(normalized) || IPV6_ULA_FD_PATTERN.test(normalized);
	return BLOCKED_PATTERNS.some((range) => num >= range.start && num <= range.end);
}
/**
* Error thrown when SSRF protection blocks a URL.
*/
var SsrfError = class extends Error {
	code = "SSRF_BLOCKED";
	constructor(message) {
		super(message);
		this.name = "SsrfError";
	}
};
/**
* Validate that a URL is safe to fetch (not targeting internal networks).
*
* Checks:
* 1. URL is well-formed with http/https scheme
* 2. Hostname is not a known internal name (localhost, metadata endpoints)
* 3. If hostname is an IP literal, it's not in a private range
*
* Note: DNS rebinding attacks are not fully mitigated (hostname could resolve
* to a private IP). Full protection requires resolving DNS and checking the IP
* before connecting, which needs a custom fetch implementation. This covers
* the most common SSRF vectors.
*
* @throws SsrfError if the URL targets an internal address
*/
/** Maximum number of redirects to follow in ssrfSafeFetch */
var MAX_REDIRECTS = 5;
function validateExternalUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new SsrfError("Invalid URL");
	}
	if (!ALLOWED_SCHEMES.has(parsed.protocol)) throw new SsrfError(`Scheme '${parsed.protocol}' is not allowed`);
	const normalizedHost = parsed.hostname.replace(IPV6_BRACKET_PATTERN, "").toLowerCase().replace(TRAILING_DOT_PATTERN, "");
	if (BLOCKED_HOSTNAMES.has(normalizedHost)) throw new SsrfError("URLs targeting internal hosts are not allowed");
	for (const suffix of BLOCKED_HOSTNAME_SUFFIXES) if (normalizedHost === suffix || normalizedHost.endsWith(`.${suffix}`)) throw new SsrfError("URLs targeting wildcard DNS services are not allowed");
	if (isPrivateIp(normalizedHost)) throw new SsrfError("URLs targeting private IP addresses are not allowed");
	return parsed;
}
/**
* Module-level default resolver. Tests can swap this with a stub so fetch
* mocks don't see unexpected DoH round-trips. Production code should leave
* it alone.
*/
var defaultResolver = null;
/** Timeout for a single DoH request, in milliseconds. */
var DOH_TIMEOUT_MS = 3e3;
/** Default DoH endpoint — Cloudflare's public resolver. */
var DEFAULT_DOH_URL = "https://cloudflare-dns.com/dns-query";
function hasProperty(obj, key) {
	return typeof obj === "object" && obj !== null && key in obj;
}
/**
* Narrow an unknown JSON body to a DohResponse shape we can read safely.
* Throws if the body doesn't look like a DoH response — a malformed body is
* indistinguishable from a failure and must not be silently treated as empty.
*/
function parseDohResponse(raw) {
	if (!hasProperty(raw, "Status") || typeof raw.Status !== "number") throw new Error("DoH response missing Status field");
	const answers = [];
	if (hasProperty(raw, "Answer") && Array.isArray(raw.Answer)) {
		for (const entry of raw.Answer) if (hasProperty(entry, "data") && typeof entry.data === "string") answers.push({ data: entry.data });
	}
	return {
		Status: raw.Status,
		Answer: answers
	};
}
/**
* Resolve a hostname via DNS over HTTPS (Cloudflare). Returns all A and AAAA
* records. Works in both Workers and Node without requiring node:dns.
*
* Fails closed: any network error, non-2xx response, or DNS rcode != 0
* causes a rejected promise so the calling validator treats it as a block.
*/
var cloudflareDohResolver = async (hostname) => {
	async function query(type) {
		const params = new URLSearchParams({
			name: hostname,
			type
		});
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), DOH_TIMEOUT_MS);
		try {
			const response = await globalThis.fetch(`${DEFAULT_DOH_URL}?${params.toString()}`, {
				headers: { Accept: "application/dns-json" },
				signal: controller.signal
			});
			if (!response.ok) throw new Error(`DoH lookup failed: ${response.status}`);
			const body = parseDohResponse(await response.json());
			if (body.Status === 3) return [];
			if (body.Status !== 0) throw new Error(`DoH ${type} lookup failed: rcode=${body.Status}`);
			return body.Answer.map((a) => a.data).filter(isIpLiteral);
		} finally {
			clearTimeout(timeout);
		}
	}
	const [a, aaaa] = await Promise.all([query("A"), query("AAAA")]);
	return [...a, ...aaaa];
};
/**
* Validate a URL and resolve its hostname to check the actual IPs against
* the private-range blocklist. This catches DNS rebinding attacks using
* attacker-controlled domains that publicly resolve to private addresses,
* and wildcard DNS services like nip.io used by exploit tooling.
*
* Runs `validateExternalUrl` first for cheap pre-flight checks (scheme,
* literal IP, known-bad hostnames). Then resolves the hostname and rejects
* if ANY returned address is private.
*
* Fails closed: if resolution fails or returns no records, throws SsrfError.
*
* **Caveats.** This does NOT fully close the TOCTOU between check and
* connect. Attacks that still work against this layer include:
*
* - TTL=0 rebind: authoritative server returns public IP to the check, then
*   private IP to the subsequent fetch() a few milliseconds later.
* - Split-view via EDNS Client Subnet or source-IP inspection: the
*   authoritative server returns public IP to Cloudflare's DoH resolver and
*   private IP to the victim's own resolver (used by fetch()).
* - Host-file overrides or split-horizon corporate DNS on self-hosted Node.
* - Attacker-controlled rebinding services the caller has allowlisted.
*
* The only complete defense is a network-layer egress firewall. On
* Cloudflare Workers, the platform fetch pipeline provides most of that.
* On self-hosted Node, operators must restrict egress themselves.
*/
async function resolveAndValidateExternalUrl(url, options) {
	const parsed = validateExternalUrl(url);
	const hostname = parsed.hostname.replace(IPV6_BRACKET_PATTERN, "");
	if (isIpLiteral(hostname)) return parsed;
	const resolver = options?.resolver ?? defaultResolver ?? cloudflareDohResolver;
	let addresses;
	try {
		addresses = await resolver(hostname);
	} catch (error) {
		throw new SsrfError(`Could not resolve hostname: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (addresses.length === 0) throw new SsrfError("Hostname resolved to no addresses");
	for (const ip of addresses) if (isPrivateIp(ip)) throw new SsrfError("Hostname resolves to a private IP address");
	return parsed;
}
/** True when a string looks like an IPv4 or IPv6 literal. */
function isIpLiteral(host) {
	if (parseIpv4(host) !== null) return true;
	return host.includes(":");
}
/**
* Fetch a URL with SSRF protection on redirects.
*
* Uses `redirect: "manual"` to intercept redirects and re-validate each
* redirect target against SSRF rules before following it. This prevents
* an attacker from setting up an allowed external URL that redirects to
* an internal IP (e.g. 169.254.169.254 for cloud metadata).
*
* @throws SsrfError if the initial URL or any redirect target is internal
*/
/** Headers that must be stripped when a redirect crosses origins */
var CREDENTIAL_HEADERS = [
	"authorization",
	"cookie",
	"proxy-authorization"
];
async function ssrfSafeFetch(url, init, options) {
	let currentUrl = url;
	let currentInit = init;
	for (let i = 0; i <= MAX_REDIRECTS; i++) {
		await resolveAndValidateExternalUrl(currentUrl, options);
		const response = await globalThis.fetch(currentUrl, {
			...currentInit,
			redirect: "manual"
		});
		if (response.status < 300 || response.status >= 400) return response;
		const location = response.headers.get("Location");
		if (!location) return response;
		const previousOrigin = new URL(currentUrl).origin;
		currentUrl = new URL(location, currentUrl).href;
		if (previousOrigin !== new URL(currentUrl).origin && currentInit) currentInit = stripCredentialHeaders(currentInit);
	}
	throw new SsrfError(`Too many redirects (max ${MAX_REDIRECTS})`);
}
/**
* Return a copy of init with credential headers removed.
*/
function stripCredentialHeaders(init) {
	if (!init.headers) return init;
	const headers = new Headers(init.headers);
	for (const name of CREDENTIAL_HEADERS) headers.delete(name);
	return {
		...init,
		headers
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/redirect-BJ6d1yHh.mjs
/**
* Hard cap on rows stored in `_emdash_404_log`. When exceeded, the oldest
* rows (by `last_seen_at`) are evicted on insert. Prevents an unauthenticated
* attacker from growing the table without bound by requesting unique URLs.
*/
var MAX_404_LOG_ROWS = 1e4;
/** Max stored length for the `Referer` header — truncated on insert. */
var REFERRER_MAX_LENGTH = 512;
/** Max stored length for the `User-Agent` header — truncated on insert. */
var USER_AGENT_MAX_LENGTH = 256;
/** Pattern to escape LIKE wildcards: %, _, and backslash */
var LIKE_ESCAPE_RE = /[\\%_]/g;
/**
* Truncate a header-derived string to `max` chars, preserving `null`/`undefined`
* as `null`. Empty strings stay empty (the caller decides whether to coerce).
*/
function truncateOrNull(value, max) {
	if (value === null || value === void 0) return null;
	return value.length > max ? value.slice(0, max) : value;
}
function rowToRedirect(row) {
	return {
		id: row.id,
		source: row.source,
		destination: row.destination,
		type: row.type,
		isPattern: row.is_pattern === 1,
		enabled: row.enabled === 1,
		hits: row.hits,
		lastHitAt: row.last_hit_at,
		groupName: row.group_name,
		auto: row.auto === 1,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
var RedirectRepository = class {
	constructor(db) {
		this.db = db;
	}
	async findById(id) {
		const row = await this.db.selectFrom("_emdash_redirects").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? rowToRedirect(row) : null;
	}
	async findBySource(source) {
		const row = await this.db.selectFrom("_emdash_redirects").selectAll().where("source", "=", source).executeTakeFirst();
		return row ? rowToRedirect(row) : null;
	}
	async findMany(opts) {
		const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);
		let query = this.db.selectFrom("_emdash_redirects").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
		if (opts.search) {
			const term = `%${opts.search.replace(LIKE_ESCAPE_RE, (c) => `\\${c}`)}%`;
			query = query.where((eb) => eb.or([sql`source LIKE ${term} ESCAPE '\\'`, sql`destination LIKE ${term} ESCAPE '\\'`]));
		}
		if (opts.group !== void 0) query = query.where("group_name", "=", opts.group);
		if (opts.enabled !== void 0) query = query.where("enabled", "=", opts.enabled ? 1 : 0);
		if (opts.auto !== void 0) query = query.where("auto", "=", opts.auto ? 1 : 0);
		if (opts.cursor) {
			const decoded = decodeCursor(opts.cursor);
			query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
		}
		const rows = await query.execute();
		const items = rows.slice(0, limit).map(rowToRedirect);
		const result = { items };
		if (rows.length > limit) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}
		return result;
	}
	async create(input) {
		const id = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const patternFlag = input.isPattern ?? isPattern(input.source);
		await this.db.insertInto("_emdash_redirects").values({
			id,
			source: input.source,
			destination: input.destination,
			type: input.type ?? 301,
			is_pattern: patternFlag ? 1 : 0,
			enabled: input.enabled !== false ? 1 : 0,
			hits: 0,
			last_hit_at: null,
			group_name: input.groupName ?? null,
			auto: input.auto ? 1 : 0,
			created_at: now,
			updated_at: now
		}).execute();
		return await this.findById(id);
	}
	async update(id, input) {
		if (!await this.findById(id)) return null;
		const values = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
		if (input.source !== void 0) {
			values.source = input.source;
			values.is_pattern = input.isPattern !== void 0 ? input.isPattern ? 1 : 0 : isPattern(input.source) ? 1 : 0;
		} else if (input.isPattern !== void 0) values.is_pattern = input.isPattern ? 1 : 0;
		if (input.destination !== void 0) values.destination = input.destination;
		if (input.type !== void 0) values.type = input.type;
		if (input.enabled !== void 0) values.enabled = input.enabled ? 1 : 0;
		if (input.groupName !== void 0) values.group_name = input.groupName;
		await this.db.updateTable("_emdash_redirects").set(values).where("id", "=", id).execute();
		return await this.findById(id);
	}
	async delete(id) {
		const result = await this.db.deleteFrom("_emdash_redirects").where("id", "=", id).executeTakeFirst();
		return BigInt(result.numDeletedRows) > 0n;
	}
	/**
	* Fetch all enabled redirects (for loop detection graph building).
	* Not paginated — returns the full set.
	*/
	async findAllEnabled() {
		return (await this.db.selectFrom("_emdash_redirects").selectAll().where("enabled", "=", 1).execute()).map(rowToRedirect);
	}
	async findExactMatch(path) {
		const row = await this.db.selectFrom("_emdash_redirects").selectAll().where("source", "=", path).where("enabled", "=", 1).where("is_pattern", "=", 0).executeTakeFirst();
		return row ? rowToRedirect(row) : null;
	}
	async findEnabledPatternRules() {
		return (await this.db.selectFrom("_emdash_redirects").selectAll().where("enabled", "=", 1).where("is_pattern", "=", 1).execute()).map(rowToRedirect);
	}
	/**
	* Match a request path against all enabled redirect rules.
	* Checks exact matches first (indexed), then pattern rules.
	* Returns the matched redirect and the resolved destination URL.
	*/
	async matchPath(path) {
		const exact = await this.findExactMatch(path);
		if (exact) return {
			redirect: exact,
			resolvedDestination: exact.destination
		};
		const patterns = await this.findEnabledPatternRules();
		for (const redirect of patterns) {
			const params = matchPattern(compilePattern(redirect.source), path);
			if (params) return {
				redirect,
				resolvedDestination: interpolateDestination(redirect.destination, params)
			};
		}
		return null;
	}
	async recordHit(id) {
		await sql`
			UPDATE _emdash_redirects
			SET hits = hits + 1, last_hit_at = ${currentTimestampValue(this.db)}, updated_at = ${currentTimestampValue(this.db)}
			WHERE id = ${id}
		`.execute(this.db);
	}
	/**
	* Create an auto-redirect when a content slug changes.
	* Uses the collection's URL pattern to compute old/new URLs.
	* Collapses existing redirect chains pointing to the old URL and
	* removes redirects that would shadow the now-live new URL, so a
	* rename that is later reverted cannot form a loop (#1986).
	*
	* Returns null when old and new URL are identical (nothing to redirect).
	*/
	async createAutoRedirect(collection, oldSlug, newSlug, contentId, urlPattern) {
		const oldUrl = urlPattern ? urlPattern.replace("{slug}", oldSlug).replace("{id}", contentId) : `/${collection}/${oldSlug}`;
		const newUrl = urlPattern ? urlPattern.replace("{slug}", newSlug).replace("{id}", contentId) : `/${collection}/${newSlug}`;
		if (oldUrl === newUrl) return null;
		await this.collapseChains(oldUrl, newUrl);
		await this.db.deleteFrom("_emdash_redirects").where("source", "=", newUrl).execute();
		const existing = await this.findBySource(oldUrl);
		if (existing) return await this.update(existing.id, { destination: newUrl });
		return this.create({
			source: oldUrl,
			destination: newUrl,
			type: 301,
			isPattern: false,
			auto: true,
			groupName: "Auto: slug change"
		});
	}
	/**
	* Update all redirects whose destination matches oldDestination
	* to point to newDestination instead. Prevents redirect chains.
	* Returns the number of updated rows.
	*/
	async collapseChains(oldDestination, newDestination) {
		const result = await this.db.updateTable("_emdash_redirects").set({
			destination: newDestination,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).where("destination", "=", oldDestination).executeTakeFirst();
		return Number(result.numUpdatedRows);
	}
	/**
	* Record a 404 hit for `entry.path`.
	*
	* Dedups by path: repeat hits increment `hits` and refresh `last_seen_at`
	* on the existing row instead of inserting a new one. Referrer and
	* user-agent are truncated to bounded lengths so a malicious client can't
	* blow up storage with huge headers. When the table would exceed
	* MAX_404_LOG_ROWS, the oldest entries (by `last_seen_at`) are evicted.
	*
	* This is called from the public redirect middleware on every 404 and
	* must never throw for an unauthenticated caller — failures bubble up to
	* the middleware, which swallows them.
	*/
	async log404(entry) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const referrer = truncateOrNull(entry.referrer, REFERRER_MAX_LENGTH);
		const userAgent = truncateOrNull(entry.userAgent, USER_AGENT_MAX_LENGTH);
		const ip = entry.ip ?? null;
		await this.db.insertInto("_emdash_404_log").values({
			id: ulid(),
			path: entry.path,
			referrer,
			user_agent: userAgent,
			ip,
			hits: 1,
			last_seen_at: now,
			created_at: now
		}).onConflict((oc) => oc.column("path").doUpdateSet({
			hits: sql`hits + 1`,
			last_seen_at: now,
			referrer,
			user_agent: userAgent,
			ip
		})).execute();
		await this.enforce404Cap();
	}
	/**
	* Delete the oldest rows from `_emdash_404_log` if the row count exceeds
	* MAX_404_LOG_ROWS. "Oldest" is by `last_seen_at`, so a path that keeps
	* getting hit stays in the table even if it was first seen long ago.
	*
	* Private — callers use `log404`, which invokes this after every upsert.
	*/
	async enforce404Cap() {
		const countRow = await this.db.selectFrom("_emdash_404_log").select((eb) => eb.fn.countAll().as("c")).executeTakeFirst();
		const count = Number(countRow?.c ?? 0);
		if (count <= MAX_404_LOG_ROWS) return;
		const excess = count - MAX_404_LOG_ROWS;
		await this.db.deleteFrom("_emdash_404_log").where("id", "in", this.db.selectFrom("_emdash_404_log").select("id").orderBy("last_seen_at", "asc").orderBy("id", "asc").limit(excess)).execute();
	}
	async find404s(opts) {
		const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);
		let query = this.db.selectFrom("_emdash_404_log").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
		if (opts.search) {
			const term = `%${opts.search.replace(LIKE_ESCAPE_RE, (c) => `\\${c}`)}%`;
			query = query.where(sql`path LIKE ${term} ESCAPE '\\'`);
		}
		if (opts.cursor) {
			const decoded = decodeCursor(opts.cursor);
			query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
		}
		const rows = await query.execute();
		const items = rows.slice(0, limit).map((row) => ({
			id: row.id,
			path: row.path,
			referrer: row.referrer,
			userAgent: row.user_agent,
			ip: row.ip,
			createdAt: row.created_at
		}));
		const result = { items };
		if (rows.length > limit) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}
		return result;
	}
	async get404Summary(limit = 50) {
		return (await sql`
			SELECT
				path,
				SUM(hits) as count,
				MAX(last_seen_at) as last_seen,
				(
					SELECT referrer FROM _emdash_404_log AS inner_log
					WHERE inner_log.path = _emdash_404_log.path
						AND referrer IS NOT NULL AND referrer != ''
					LIMIT 1
				) as top_referrer
			FROM _emdash_404_log
			GROUP BY path
			ORDER BY count DESC
			LIMIT ${limit}
		`.execute(this.db)).rows.map((row) => ({
			path: row.path,
			count: Number(row.count),
			lastSeen: row.last_seen,
			topReferrer: row.top_referrer
		}));
	}
	async delete404(id) {
		const result = await this.db.deleteFrom("_emdash_404_log").where("id", "=", id).executeTakeFirst();
		return BigInt(result.numDeletedRows) > 0n;
	}
	async clear404s() {
		const result = await this.db.deleteFrom("_emdash_404_log").executeTakeFirst();
		return Number(result.numDeletedRows);
	}
	async prune404s(olderThan) {
		const result = await this.db.deleteFrom("_emdash_404_log").where("created_at", "<", olderThan).executeTakeFirst();
		return Number(result.numDeletedRows);
	}
};
//#endregion
//#region node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/types/standard.js
var types = {
	"application/andrew-inset": ["ez"],
	"application/appinstaller": ["appinstaller"],
	"application/applixware": ["aw"],
	"application/appx": ["appx"],
	"application/appxbundle": ["appxbundle"],
	"application/atom+xml": ["atom"],
	"application/atomcat+xml": ["atomcat"],
	"application/atomdeleted+xml": ["atomdeleted"],
	"application/atomsvc+xml": ["atomsvc"],
	"application/atsc-dwd+xml": ["dwd"],
	"application/atsc-held+xml": ["held"],
	"application/atsc-rsat+xml": ["rsat"],
	"application/automationml-aml+xml": ["aml"],
	"application/automationml-amlx+zip": ["amlx"],
	"application/bdoc": ["bdoc"],
	"application/calendar+xml": ["xcs"],
	"application/ccxml+xml": ["ccxml"],
	"application/cdfx+xml": ["cdfx"],
	"application/cdmi-capability": ["cdmia"],
	"application/cdmi-container": ["cdmic"],
	"application/cdmi-domain": ["cdmid"],
	"application/cdmi-object": ["cdmio"],
	"application/cdmi-queue": ["cdmiq"],
	"application/cpl+xml": ["cpl"],
	"application/cu-seeme": ["cu"],
	"application/cwl": ["cwl"],
	"application/dash+xml": ["mpd"],
	"application/dash-patch+xml": ["mpp"],
	"application/davmount+xml": ["davmount"],
	"application/dicom": ["dcm"],
	"application/docbook+xml": ["dbk"],
	"application/dssc+der": ["dssc"],
	"application/dssc+xml": ["xdssc"],
	"application/ecmascript": ["ecma"],
	"application/emma+xml": ["emma"],
	"application/emotionml+xml": ["emotionml"],
	"application/epub+zip": ["epub"],
	"application/exi": ["exi"],
	"application/express": ["exp"],
	"application/fdf": ["fdf"],
	"application/fdt+xml": ["fdt"],
	"application/font-tdpfr": ["pfr"],
	"application/geo+json": ["geojson"],
	"application/gml+xml": ["gml"],
	"application/gpx+xml": ["gpx"],
	"application/gxf": ["gxf"],
	"application/gzip": ["gz"],
	"application/hjson": ["hjson"],
	"application/hyperstudio": ["stk"],
	"application/inkml+xml": ["ink", "inkml"],
	"application/ipfix": ["ipfix"],
	"application/its+xml": ["its"],
	"application/java-archive": [
		"jar",
		"war",
		"ear"
	],
	"application/java-serialized-object": ["ser"],
	"application/java-vm": ["class"],
	"application/javascript": ["*js"],
	"application/json": ["json", "map"],
	"application/json5": ["json5"],
	"application/jsonml+json": ["jsonml"],
	"application/ld+json": ["jsonld"],
	"application/lgr+xml": ["lgr"],
	"application/lost+xml": ["lostxml"],
	"application/mac-binhex40": ["hqx"],
	"application/mac-compactpro": ["cpt"],
	"application/mads+xml": ["mads"],
	"application/manifest+json": ["webmanifest"],
	"application/marc": ["mrc"],
	"application/marcxml+xml": ["mrcx"],
	"application/mathematica": [
		"ma",
		"nb",
		"mb"
	],
	"application/mathml+xml": ["mathml"],
	"application/mbox": ["mbox"],
	"application/media-policy-dataset+xml": ["mpf"],
	"application/mediaservercontrol+xml": ["mscml"],
	"application/metalink+xml": ["metalink"],
	"application/metalink4+xml": ["meta4"],
	"application/mets+xml": ["mets"],
	"application/mmt-aei+xml": ["maei"],
	"application/mmt-usd+xml": ["musd"],
	"application/mods+xml": ["mods"],
	"application/mp21": ["m21", "mp21"],
	"application/mp4": [
		"*mp4",
		"*mpg4",
		"mp4s",
		"m4p"
	],
	"application/msix": ["msix"],
	"application/msixbundle": ["msixbundle"],
	"application/msword": ["doc", "dot"],
	"application/mxf": ["mxf"],
	"application/n-quads": ["nq"],
	"application/n-triples": ["nt"],
	"application/node": ["cjs"],
	"application/octet-stream": [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"exe",
		"dll",
		"deb",
		"dmg",
		"iso",
		"img",
		"msi",
		"msp",
		"msm",
		"buffer"
	],
	"application/oda": ["oda"],
	"application/oebps-package+xml": ["opf"],
	"application/ogg": ["ogx"],
	"application/omdoc+xml": ["omdoc"],
	"application/onenote": [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg",
		"one",
		"onea"
	],
	"application/oxps": ["oxps"],
	"application/p2p-overlay+xml": ["relo"],
	"application/patch-ops-error+xml": ["xer"],
	"application/pdf": ["pdf"],
	"application/pgp-encrypted": ["pgp"],
	"application/pgp-keys": ["asc"],
	"application/pgp-signature": ["sig", "*asc"],
	"application/pics-rules": ["prf"],
	"application/pkcs10": ["p10"],
	"application/pkcs7-mime": ["p7m", "p7c"],
	"application/pkcs7-signature": ["p7s"],
	"application/pkcs8": ["p8"],
	"application/pkix-attr-cert": ["ac"],
	"application/pkix-cert": ["cer"],
	"application/pkix-crl": ["crl"],
	"application/pkix-pkipath": ["pkipath"],
	"application/pkixcmp": ["pki"],
	"application/pls+xml": ["pls"],
	"application/postscript": [
		"ai",
		"eps",
		"ps"
	],
	"application/provenance+xml": ["provx"],
	"application/pskc+xml": ["pskcxml"],
	"application/raml+yaml": ["raml"],
	"application/rdf+xml": ["rdf", "owl"],
	"application/reginfo+xml": ["rif"],
	"application/relax-ng-compact-syntax": ["rnc"],
	"application/resource-lists+xml": ["rl"],
	"application/resource-lists-diff+xml": ["rld"],
	"application/rls-services+xml": ["rs"],
	"application/route-apd+xml": ["rapd"],
	"application/route-s-tsid+xml": ["sls"],
	"application/route-usd+xml": ["rusd"],
	"application/rpki-ghostbusters": ["gbr"],
	"application/rpki-manifest": ["mft"],
	"application/rpki-roa": ["roa"],
	"application/rsd+xml": ["rsd"],
	"application/rss+xml": ["rss"],
	"application/rtf": ["rtf"],
	"application/sbml+xml": ["sbml"],
	"application/scvp-cv-request": ["scq"],
	"application/scvp-cv-response": ["scs"],
	"application/scvp-vp-request": ["spq"],
	"application/scvp-vp-response": ["spp"],
	"application/sdp": ["sdp"],
	"application/senml+xml": ["senmlx"],
	"application/sensml+xml": ["sensmlx"],
	"application/set-payment-initiation": ["setpay"],
	"application/set-registration-initiation": ["setreg"],
	"application/shf+xml": ["shf"],
	"application/sieve": ["siv", "sieve"],
	"application/smil+xml": ["smi", "smil"],
	"application/sparql-query": ["rq"],
	"application/sparql-results+xml": ["srx"],
	"application/sql": ["sql"],
	"application/srgs": ["gram"],
	"application/srgs+xml": ["grxml"],
	"application/sru+xml": ["sru"],
	"application/ssdl+xml": ["ssdl"],
	"application/ssml+xml": ["ssml"],
	"application/swid+xml": ["swidtag"],
	"application/tei+xml": ["tei", "teicorpus"],
	"application/thraud+xml": ["tfi"],
	"application/timestamped-data": ["tsd"],
	"application/toml": ["toml"],
	"application/trig": ["trig"],
	"application/ttml+xml": ["ttml"],
	"application/ubjson": ["ubj"],
	"application/urc-ressheet+xml": ["rsheet"],
	"application/urc-targetdesc+xml": ["td"],
	"application/voicexml+xml": ["vxml"],
	"application/wasm": ["wasm"],
	"application/watcherinfo+xml": ["wif"],
	"application/widget": ["wgt"],
	"application/winhlp": ["hlp"],
	"application/wsdl+xml": ["wsdl"],
	"application/wspolicy+xml": ["wspolicy"],
	"application/xaml+xml": ["xaml"],
	"application/xcap-att+xml": ["xav"],
	"application/xcap-caps+xml": ["xca"],
	"application/xcap-diff+xml": ["xdf"],
	"application/xcap-el+xml": ["xel"],
	"application/xcap-ns+xml": ["xns"],
	"application/xenc+xml": ["xenc"],
	"application/xfdf": ["xfdf"],
	"application/xhtml+xml": ["xhtml", "xht"],
	"application/xliff+xml": ["xlf"],
	"application/xml": [
		"xml",
		"xsl",
		"xsd",
		"rng"
	],
	"application/xml-dtd": ["dtd"],
	"application/xop+xml": ["xop"],
	"application/xproc+xml": ["xpl"],
	"application/xslt+xml": ["*xsl", "xslt"],
	"application/xspf+xml": ["xspf"],
	"application/xv+xml": [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	],
	"application/yang": ["yang"],
	"application/yin+xml": ["yin"],
	"application/zip": ["zip"],
	"application/zip+dotlottie": ["lottie"],
	"audio/3gpp": ["*3gpp"],
	"audio/aac": ["adts", "aac"],
	"audio/adpcm": ["adp"],
	"audio/amr": ["amr"],
	"audio/basic": ["au", "snd"],
	"audio/midi": [
		"mid",
		"midi",
		"kar",
		"rmi"
	],
	"audio/mobile-xmf": ["mxmf"],
	"audio/mp3": ["*mp3"],
	"audio/mp4": [
		"m4a",
		"mp4a",
		"m4b"
	],
	"audio/mpeg": [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	],
	"audio/ogg": [
		"oga",
		"ogg",
		"spx",
		"opus"
	],
	"audio/s3m": ["s3m"],
	"audio/silk": ["sil"],
	"audio/wav": ["wav"],
	"audio/wave": ["*wav"],
	"audio/webm": ["weba"],
	"audio/xm": ["xm"],
	"font/collection": ["ttc"],
	"font/otf": ["otf"],
	"font/ttf": ["ttf"],
	"font/woff": ["woff"],
	"font/woff2": ["woff2"],
	"image/aces": ["exr"],
	"image/apng": ["apng"],
	"image/avci": ["avci"],
	"image/avcs": ["avcs"],
	"image/avif": ["avif"],
	"image/bmp": ["bmp", "dib"],
	"image/cgm": ["cgm"],
	"image/dicom-rle": ["drle"],
	"image/dpx": ["dpx"],
	"image/emf": ["emf"],
	"image/fits": ["fits"],
	"image/g3fax": ["g3"],
	"image/gif": ["gif"],
	"image/heic": ["heic"],
	"image/heic-sequence": ["heics"],
	"image/heif": ["heif"],
	"image/heif-sequence": ["heifs"],
	"image/hej2k": ["hej2"],
	"image/ief": ["ief"],
	"image/jaii": ["jaii"],
	"image/jais": ["jais"],
	"image/jls": ["jls"],
	"image/jp2": ["jp2", "jpg2"],
	"image/jpeg": [
		"jpg",
		"jpeg",
		"jpe"
	],
	"image/jph": ["jph"],
	"image/jphc": ["jhc"],
	"image/jpm": ["jpm", "jpgm"],
	"image/jpx": ["jpx", "jpf"],
	"image/jxl": ["jxl"],
	"image/jxr": ["jxr"],
	"image/jxra": ["jxra"],
	"image/jxrs": ["jxrs"],
	"image/jxs": ["jxs"],
	"image/jxsc": ["jxsc"],
	"image/jxsi": ["jxsi"],
	"image/jxss": ["jxss"],
	"image/ktx": ["ktx"],
	"image/ktx2": ["ktx2"],
	"image/pjpeg": ["jfif"],
	"image/png": ["png"],
	"image/sgi": ["sgi"],
	"image/svg+xml": ["svg", "svgz"],
	"image/t38": ["t38"],
	"image/tiff": ["tif", "tiff"],
	"image/tiff-fx": ["tfx"],
	"image/webp": ["webp"],
	"image/wmf": ["wmf"],
	"message/disposition-notification": ["disposition-notification"],
	"message/global": ["u8msg"],
	"message/global-delivery-status": ["u8dsn"],
	"message/global-disposition-notification": ["u8mdn"],
	"message/global-headers": ["u8hdr"],
	"message/rfc822": [
		"eml",
		"mime",
		"mht",
		"mhtml"
	],
	"model/3mf": ["3mf"],
	"model/gltf+json": ["gltf"],
	"model/gltf-binary": ["glb"],
	"model/iges": ["igs", "iges"],
	"model/jt": ["jt"],
	"model/mesh": [
		"msh",
		"mesh",
		"silo"
	],
	"model/mtl": ["mtl"],
	"model/obj": ["obj"],
	"model/prc": ["prc"],
	"model/step": [
		"step",
		"stp",
		"stpnc",
		"p21",
		"210"
	],
	"model/step+xml": ["stpx"],
	"model/step+zip": ["stpz"],
	"model/step-xml+zip": ["stpxz"],
	"model/stl": ["stl"],
	"model/u3d": ["u3d"],
	"model/vrml": ["wrl", "vrml"],
	"model/x3d+binary": ["*x3db", "x3dbz"],
	"model/x3d+fastinfoset": ["x3db"],
	"model/x3d+vrml": ["*x3dv", "x3dvz"],
	"model/x3d+xml": ["x3d", "x3dz"],
	"model/x3d-vrml": ["x3dv"],
	"text/cache-manifest": ["appcache", "manifest"],
	"text/calendar": ["ics", "ifb"],
	"text/coffeescript": ["coffee", "litcoffee"],
	"text/css": ["css"],
	"text/csv": ["csv"],
	"text/html": [
		"html",
		"htm",
		"shtml"
	],
	"text/jade": ["jade"],
	"text/javascript": ["js", "mjs"],
	"text/jsx": ["jsx"],
	"text/less": ["less"],
	"text/markdown": ["md", "markdown"],
	"text/mathml": ["mml"],
	"text/mdx": ["mdx"],
	"text/n3": ["n3"],
	"text/plain": [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	],
	"text/richtext": ["rtx"],
	"text/rtf": ["*rtf"],
	"text/sgml": ["sgml", "sgm"],
	"text/shex": ["shex"],
	"text/slim": ["slim", "slm"],
	"text/spdx": ["spdx"],
	"text/stylus": ["stylus", "styl"],
	"text/tab-separated-values": ["tsv"],
	"text/troff": [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	],
	"text/turtle": ["ttl"],
	"text/uri-list": [
		"uri",
		"uris",
		"urls"
	],
	"text/vcard": ["vcard"],
	"text/vtt": ["vtt"],
	"text/wgsl": ["wgsl"],
	"text/xml": ["*xml"],
	"text/yaml": ["yaml", "yml"],
	"video/3gpp": ["3gp", "3gpp"],
	"video/3gpp2": ["3g2"],
	"video/h261": ["h261"],
	"video/h263": ["h263"],
	"video/h264": ["h264"],
	"video/iso.segment": ["m4s"],
	"video/jpeg": ["jpgv"],
	"video/jpm": ["*jpm", "*jpgm"],
	"video/mj2": ["mj2", "mjp2"],
	"video/mp2t": [
		"ts",
		"m2t",
		"m2ts",
		"mts"
	],
	"video/mp4": [
		"mp4",
		"mp4v",
		"mpg4"
	],
	"video/mpeg": [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	],
	"video/ogg": ["ogv"],
	"video/quicktime": ["qt", "mov"],
	"video/webm": ["webm"]
};
Object.freeze(types);
//#endregion
//#region node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/Mime.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Mime_extensionToType;
var _Mime_typeToExtension;
var _Mime_typeToExtensions;
var Mime = class {
	constructor(...args) {
		_Mime_extensionToType.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtension.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtensions.set(this, /* @__PURE__ */ new Map());
		for (const arg of args) this.define(arg);
	}
	define(typeMap, force = false) {
		for (let [type, extensions] of Object.entries(typeMap)) {
			type = type.toLowerCase();
			extensions = extensions.map((ext) => ext.toLowerCase());
			if (!__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").has(type)) __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").set(type, /* @__PURE__ */ new Set());
			const allExtensions = __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type);
			let first = true;
			for (let extension of extensions) {
				const starred = extension.startsWith("*");
				extension = starred ? extension.slice(1) : extension;
				allExtensions?.add(extension);
				if (first) __classPrivateFieldGet(this, _Mime_typeToExtension, "f").set(type, extension);
				first = false;
				if (starred) continue;
				const currentType = __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(extension);
				if (currentType && currentType != type && !force) throw new Error(`"${type} -> ${extension}" conflicts with "${currentType} -> ${extension}". Pass \`force=true\` to override this definition.`);
				__classPrivateFieldGet(this, _Mime_extensionToType, "f").set(extension, type);
			}
		}
		return this;
	}
	getType(path) {
		if (typeof path !== "string") return null;
		const last = path.replace(/^.*[/\\]/s, "").toLowerCase();
		const ext = last.replace(/^.*\./s, "").toLowerCase();
		const hasPath = last.length < path.length;
		if (!(ext.length < last.length - 1) && hasPath) return null;
		return __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(ext) ?? null;
	}
	getExtension(type) {
		if (typeof type !== "string") return null;
		type = type?.split?.(";")[0];
		return (type && __classPrivateFieldGet(this, _Mime_typeToExtension, "f").get(type.trim().toLowerCase())) ?? null;
	}
	getAllExtensions(type) {
		if (typeof type !== "string") return null;
		return __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type.toLowerCase()) ?? null;
	}
	_freeze() {
		this.define = () => {
			throw new Error("define() not allowed for built-in Mime objects. See https://github.com/broofa/mime/blob/main/README.md#custom-mime-instances");
		};
		Object.freeze(this);
		for (const extensions of __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").values()) Object.freeze(extensions);
		return this;
	}
	_getTestState() {
		return {
			types: __classPrivateFieldGet(this, _Mime_extensionToType, "f"),
			extensions: __classPrivateFieldGet(this, _Mime_typeToExtension, "f")
		};
	}
};
_Mime_extensionToType = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtension = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtensions = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/index_lite.js
var index_lite_default = new Mime(types)._freeze();
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/apply-1_6ra7NP.mjs
/**
* Seed engine - applies seed files to database
*
* This is the core implementation that bootstraps an EmDash site from a seed file.
* Apply order is critical for foreign keys and references.
*/
var apply_exports = /* @__PURE__ */ __exportAll({ applySeed: () => applySeed });
var FILE_EXTENSION_PATTERN = /\.([a-z0-9]+)(?:\?|$)/i;
/** Pattern to remove file extensions */
var EXTENSION_PATTERN = /\.[^.]+$/;
/** Pattern to remove query parameters */
var QUERY_PARAM_PATTERN = /\?.*$/;
/** Pattern to remove non-alphanumeric characters (except dash and underscore) */
var SANITIZE_PATTERN = /[^a-zA-Z0-9_-]/g;
/** Pattern to collapse multiple hyphens */
var MULTIPLE_HYPHENS_PATTERN = /-+/g;
/**
* Apply a seed file to the database
*
* This function is idempotent - safe to run multiple times.
*
* @param db - Kysely database instance
* @param seed - Seed file to apply
* @param options - Application options
* @returns Result summary
*/
async function applySeed(db, seed, options = {}) {
	const validation = validateSeed(seed);
	if (!validation.valid) throw new Error(`Invalid seed file:\n${validation.errors.join("\n")}`);
	const { includeContent = false, storage, skipMediaDownload = false, onConflict = "skip" } = options;
	const result = {
		collections: {
			created: 0,
			skipped: 0,
			updated: 0
		},
		fields: {
			created: 0,
			skipped: 0,
			updated: 0
		},
		taxonomies: {
			created: 0,
			terms: 0
		},
		bylines: {
			created: 0,
			skipped: 0,
			updated: 0
		},
		menus: {
			created: 0,
			items: 0
		},
		redirects: {
			created: 0,
			skipped: 0,
			updated: 0
		},
		widgetAreas: {
			created: 0,
			widgets: 0
		},
		sections: {
			created: 0,
			skipped: 0,
			updated: 0
		},
		settings: { applied: 0 },
		content: {
			created: 0,
			skipped: 0,
			updated: 0
		},
		media: {
			created: 0,
			skipped: 0
		}
	};
	const mediaContext = {
		db,
		storage: storage ?? null,
		skipMediaDownload,
		mediaCache: /* @__PURE__ */ new Map()
	};
	const seedIdMap = /* @__PURE__ */ new Map();
	const seedBylineIdMap = /* @__PURE__ */ new Map();
	const staleMarkedContentCollections = /* @__PURE__ */ new Set();
	const failedStaleContentCollections = /* @__PURE__ */ new Set();
	const defaultLocale = getI18nConfig()?.defaultLocale ?? seed.defaultLocale ?? "en";
	const markSeedContentCollectionStale = async (collectionSlug) => {
		if (staleMarkedContentCollections.has(collectionSlug)) return;
		if (await markContentMediaUsageCollectionStaleSafely(db, collectionSlug, "CONTENT_USAGE_STALE")) {
			staleMarkedContentCollections.add(collectionSlug);
			failedStaleContentCollections.delete(collectionSlug);
		} else failedStaleContentCollections.add(collectionSlug);
	};
	const retryFailedSeedContentStaleMarks = async () => {
		for (const collectionSlug of failedStaleContentCollections) if (await markContentMediaUsageCollectionStaleSafely(db, collectionSlug, "CONTENT_USAGE_STALE")) {
			staleMarkedContentCollections.add(collectionSlug);
			failedStaleContentCollections.delete(collectionSlug);
		}
	};
	if (seed.settings) {
		await setSiteSettings(seed.settings, db);
		result.settings.applied = Object.keys(seed.settings).length;
	}
	if (seed.collections) {
		const registry = new SchemaRegistry(db);
		for (const collection of seed.collections) {
			if (await registry.getCollection(collection.slug)) {
				if (onConflict === "error") throw new Error(`Conflict: collection "${collection.slug}" already exists`);
				if (onConflict === "update") {
					await registry.updateCollection(collection.slug, {
						label: collection.label,
						labelSingular: collection.labelSingular,
						description: collection.description,
						icon: collection.icon,
						supports: collection.supports || [],
						urlPattern: collection.urlPattern,
						commentsEnabled: collection.commentsEnabled
					});
					result.collections.updated++;
					for (const field of collection.fields) if (await registry.getField(collection.slug, field.slug)) {
						await registry.updateField(collection.slug, field.slug, {
							label: field.label,
							type: field.type,
							required: field.required || false,
							unique: field.unique || false,
							searchable: field.searchable || false,
							defaultValue: field.defaultValue,
							validation: field.validation,
							widget: field.widget,
							options: field.options
						});
						result.fields.updated++;
					} else {
						await registry.createField(collection.slug, {
							slug: field.slug,
							label: field.label,
							type: field.type,
							required: field.required || false,
							unique: field.unique || false,
							searchable: field.searchable || false,
							defaultValue: field.defaultValue,
							validation: field.validation,
							widget: field.widget,
							options: field.options
						});
						result.fields.created++;
					}
					continue;
				}
				result.collections.skipped++;
				result.fields.skipped += collection.fields.length;
				continue;
			}
			const fields = collection.fields.map((field) => ({
				slug: field.slug,
				label: field.label,
				type: field.type,
				required: field.required || false,
				unique: field.unique || false,
				searchable: field.searchable || false,
				defaultValue: field.defaultValue,
				validation: field.validation,
				widget: field.widget,
				options: field.options
			}));
			await registry.createSeedCollection({
				slug: collection.slug,
				label: collection.label,
				labelSingular: collection.labelSingular,
				description: collection.description,
				icon: collection.icon,
				supports: collection.supports || [],
				urlPattern: collection.urlPattern,
				commentsEnabled: collection.commentsEnabled
			}, fields);
			result.collections.created++;
			result.fields.created += fields.length;
		}
	}
	if (seed.taxonomies) {
		const defSeedIdMap = /* @__PURE__ */ new Map();
		const termSeedIdMap = /* @__PURE__ */ new Map();
		for (const taxonomy of seed.taxonomies) {
			const defLocale = resolveConfiguredLocale(taxonomy.locale ?? defaultLocale);
			const existingDef = await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("name", "=", taxonomy.name).where("locale", "=", defLocale).executeTakeFirst();
			let defId;
			let defTranslationGroup;
			if (existingDef) {
				defId = existingDef.id;
				defTranslationGroup = existingDef.translation_group ?? existingDef.id;
				if (onConflict === "error") throw new Error(`Conflict: taxonomy "${taxonomy.name}" (${defLocale}) already exists`);
				if (onConflict === "update") await db.updateTable("_emdash_taxonomy_defs").set({
					label: taxonomy.label,
					label_singular: taxonomy.labelSingular ?? null,
					hierarchical: taxonomy.hierarchical ? 1 : 0,
					collections: JSON.stringify(taxonomy.collections)
				}).where("id", "=", existingDef.id).execute();
			} else {
				defId = ulid();
				defTranslationGroup = defId;
				if (taxonomy.translationOf) {
					const source = defSeedIdMap.get(taxonomy.translationOf);
					if (source) defTranslationGroup = source.translationGroup;
					else console.warn(`taxonomy "${taxonomy.name}" (${defLocale}): translationOf "${taxonomy.translationOf}" not found yet; minting a fresh group.`);
				}
				await db.insertInto("_emdash_taxonomy_defs").values({
					id: defId,
					name: taxonomy.name,
					label: taxonomy.label,
					label_singular: taxonomy.labelSingular ?? null,
					hierarchical: taxonomy.hierarchical ? 1 : 0,
					collections: JSON.stringify(taxonomy.collections),
					locale: defLocale,
					translation_group: defTranslationGroup
				}).execute();
				result.taxonomies.created++;
			}
			if (taxonomy.id) defSeedIdMap.set(taxonomy.id, {
				id: defId,
				translationGroup: defTranslationGroup
			});
			if (includeContent && taxonomy.terms && taxonomy.terms.length > 0) {
				const termRepo = new TaxonomyRepository(db);
				if (taxonomy.hierarchical) await applyHierarchicalTerms(termRepo, taxonomy.name, defLocale, taxonomy.terms, termSeedIdMap, result, onConflict);
				else for (const term of taxonomy.terms) {
					const termLocale = resolveConfiguredLocale(term.locale ?? defLocale);
					const existing = await termRepo.findBySlug(taxonomy.name, term.slug, termLocale);
					if (existing) {
						if (onConflict === "error") throw new Error(`Conflict: taxonomy term "${term.slug}" in "${taxonomy.name}" (${termLocale}) already exists`);
						if (onConflict === "update") {
							await termRepo.update(existing.id, {
								label: term.label,
								data: term.description ? { description: term.description } : {}
							});
							result.taxonomies.terms++;
						}
						if (term.id) termSeedIdMap.set(term.id, existing.id);
					} else {
						const translationOf = term.translationOf ? termSeedIdMap.get(term.translationOf) : void 0;
						const created = await termRepo.create({
							name: taxonomy.name,
							slug: term.slug,
							label: term.label,
							data: term.description ? { description: term.description } : void 0,
							locale: termLocale,
							translationOf
						});
						if (term.id) termSeedIdMap.set(term.id, created.id);
						result.taxonomies.terms++;
					}
				}
			}
		}
		const { invalidateTaxonomyDefsCache } = await import("./taxonomies-B61CRSha_ovv5Cg26.mjs").then((n) => n.d);
		invalidateTaxonomyDefsCache();
	}
	if (includeContent && seed.bylines) {
		const bylineRepo = new BylineRepository(db);
		for (const byline of seed.bylines) {
			const existing = await bylineRepo.findBySlug(byline.slug);
			if (existing) {
				if (onConflict === "error") throw new Error(`Conflict: byline "${byline.slug}" already exists`);
				if (onConflict === "update") {
					const avatar = byline.avatar ? await resolveSeedBylineAvatar(db, byline.avatar) : null;
					try {
						if (!await bylineRepo.update(existing.id, {
							displayName: byline.displayName,
							bio: byline.bio ?? null,
							websiteUrl: byline.websiteUrl ?? null,
							isGuest: byline.isGuest,
							...avatar ? { avatarMediaId: avatar.id } : {}
						})) throw new Error(`Byline "${byline.slug}" disappeared during update`);
					} catch (error) {
						if (avatar?.created) await deleteMediaRow(db, avatar.id);
						throw error;
					}
					seedBylineIdMap.set(byline.id, existing.id);
					result.bylines.updated++;
					if (avatar?.created) result.media.created++;
					continue;
				}
				seedBylineIdMap.set(byline.id, existing.id);
				result.bylines.skipped++;
				continue;
			}
			const avatar = byline.avatar ? await resolveSeedBylineAvatar(db, byline.avatar) : null;
			let createdId;
			try {
				createdId = (await bylineRepo.create({
					slug: byline.slug,
					displayName: byline.displayName,
					bio: byline.bio ?? null,
					websiteUrl: byline.websiteUrl ?? null,
					isGuest: byline.isGuest,
					avatarMediaId: avatar?.id ?? null
				})).id;
			} catch (error) {
				if (avatar?.created) await deleteMediaRow(db, avatar.id);
				throw error;
			}
			seedBylineIdMap.set(byline.id, createdId);
			result.bylines.created++;
			if (avatar?.created) result.media.created++;
		}
	}
	if (includeContent && seed.content) {
		const contentRepo = new ContentRepository(db);
		try {
			for (const [collectionSlug, entries] of Object.entries(seed.content)) for (const entry of entries) {
				const entryLocale = resolveConfiguredLocale(entry.locale ?? defaultLocale);
				const existing = await contentRepo.findBySlug(collectionSlug, entry.slug, entryLocale);
				if (existing) {
					if (onConflict === "error") throw new Error(`Conflict: content "${entry.slug}" in "${collectionSlug}" already exists`);
					if (onConflict === "update") {
						const resolvedData = await resolveReferences(entry.data, seedIdMap, mediaContext, result);
						const status = entry.status || "published";
						let contentMutated = false;
						try {
							await withTransaction(db, async (trx) => {
								const trxContentRepo = new ContentRepository(trx);
								const trxBylineRepo = new BylineRepository(trx);
								const trxRevisionRepo = new RevisionRepository(trx);
								await trxContentRepo.update(collectionSlug, existing.id, {
									status,
									data: resolvedData
								});
								contentMutated = true;
								await applyContentBylines(trxBylineRepo, collectionSlug, existing.id, entry, seedBylineIdMap, true);
								await applyContentTaxonomies(trx, collectionSlug, existing.id, entry, true);
								if (status === "published") {
									const draft = await trxRevisionRepo.create({
										collection: collectionSlug,
										entryId: existing.id,
										data: resolvedData
									});
									await trxContentRepo.setDraftRevision(collectionSlug, existing.id, draft.id);
									await trxContentRepo.publish(collectionSlug, existing.id);
								}
							});
						} catch (error) {
							if (contentMutated) await markSeedContentCollectionStale(collectionSlug);
							throw error;
						}
						seedIdMap.set(entry.id, existing.id);
						result.content.updated++;
						await markSeedContentCollectionStale(collectionSlug);
						continue;
					}
					result.content.skipped++;
					seedIdMap.set(entry.id, existing.id);
					continue;
				}
				const resolvedData = await resolveReferences(entry.data, seedIdMap, mediaContext, result);
				let translationOf;
				if (entry.translationOf) {
					const sourceId = seedIdMap.get(entry.translationOf);
					if (!sourceId) console.warn(`content.${collectionSlug}: translationOf "${entry.translationOf}" not found (not yet created or missing). Skipping translation link.`);
					else translationOf = sourceId;
				}
				const status = entry.status || "published";
				let contentMutated = false;
				let created;
				try {
					created = await withTransaction(db, async (trx) => {
						const trxContentRepo = new ContentRepository(trx);
						const trxBylineRepo = new BylineRepository(trx);
						const item = await trxContentRepo.create({
							type: collectionSlug,
							slug: entry.slug,
							status,
							data: resolvedData,
							locale: entryLocale,
							translationOf,
							publishedAt: status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
						});
						contentMutated = true;
						await applyContentBylines(trxBylineRepo, collectionSlug, item.id, entry, seedBylineIdMap);
						await applyContentTaxonomies(trx, collectionSlug, item.id, entry, false);
						if (status === "published") await trxContentRepo.publish(collectionSlug, item.id);
						return item;
					});
				} catch (error) {
					if (contentMutated) await markSeedContentCollectionStale(collectionSlug);
					throw error;
				}
				seedIdMap.set(entry.id, created.id);
				result.content.created++;
				await markSeedContentCollectionStale(collectionSlug);
			}
		} finally {
			await retryFailedSeedContentStaleMarks();
		}
	}
	if (seed.menus) {
		const menuSeedIdMap = /* @__PURE__ */ new Map();
		const itemSeedIdMap = /* @__PURE__ */ new Map();
		for (const menu of seed.menus) {
			const locale = resolveConfiguredLocale(menu.locale ?? defaultLocale);
			const existingMenu = await db.selectFrom("_emdash_menus").selectAll().where("name", "=", menu.name).where("locale", "=", locale).executeTakeFirst();
			let menuId;
			let translationGroup;
			if (existingMenu) {
				menuId = existingMenu.id;
				translationGroup = existingMenu.translation_group ?? existingMenu.id;
				await db.deleteFrom("_emdash_menu_items").where("menu_id", "=", menuId).execute();
			} else {
				menuId = ulid();
				translationGroup = menuId;
				if (menu.translationOf) {
					const source = menuSeedIdMap.get(menu.translationOf);
					if (source) translationGroup = source.translationGroup;
					else console.warn(`menu "${menu.name}" (${locale}): translationOf "${menu.translationOf}" not found yet; minting a fresh group.`);
				}
				await db.insertInto("_emdash_menus").values({
					id: menuId,
					name: menu.name,
					label: menu.label,
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					updated_at: (/* @__PURE__ */ new Date()).toISOString(),
					locale,
					translation_group: translationGroup
				}).execute();
				result.menus.created++;
			}
			if (menu.id) menuSeedIdMap.set(menu.id, {
				id: menuId,
				translationGroup
			});
			const itemCount = await applyMenuItems(db, menuId, locale, menu.items, null, 0, seedIdMap, itemSeedIdMap);
			result.menus.items += itemCount;
		}
	}
	if (seed.redirects) {
		const redirectRepo = new RedirectRepository(db);
		for (const redirect of seed.redirects) {
			const existing = await redirectRepo.findBySource(redirect.source);
			if (existing) {
				if (onConflict === "error") throw new Error(`Conflict: redirect "${redirect.source}" already exists`);
				if (onConflict === "update") {
					await redirectRepo.update(existing.id, {
						destination: redirect.destination,
						type: redirect.type,
						enabled: redirect.enabled,
						groupName: redirect.groupName
					});
					result.redirects.updated++;
					continue;
				}
				result.redirects.skipped++;
				continue;
			}
			await redirectRepo.create({
				source: redirect.source,
				destination: redirect.destination,
				type: redirect.type,
				enabled: redirect.enabled,
				groupName: redirect.groupName
			});
			result.redirects.created++;
		}
	}
	if (seed.widgetAreas) for (const area of seed.widgetAreas) {
		const existingArea = await db.selectFrom("_emdash_widget_areas").selectAll().where("name", "=", area.name).executeTakeFirst();
		let areaId;
		if (existingArea) {
			areaId = existingArea.id;
			await db.deleteFrom("_emdash_widgets").where("area_id", "=", areaId).execute();
		} else {
			areaId = ulid();
			await db.insertInto("_emdash_widget_areas").values({
				id: areaId,
				name: area.name,
				label: area.label,
				description: area.description ?? null
			}).execute();
			result.widgetAreas.created++;
		}
		for (let i = 0; i < area.widgets.length; i++) {
			const widget = area.widgets[i];
			await applyWidget(db, areaId, widget, i);
			result.widgetAreas.widgets++;
		}
	}
	if (seed.sections) for (const section of seed.sections) {
		const existing = await db.selectFrom("_emdash_sections").select("id").where("slug", "=", section.slug).executeTakeFirst();
		if (existing) {
			if (onConflict === "error") throw new Error(`Conflict: section "${section.slug}" already exists`);
			if (onConflict === "update") {
				await db.updateTable("_emdash_sections").set({
					title: section.title,
					description: section.description ?? null,
					keywords: section.keywords ? JSON.stringify(section.keywords) : null,
					content: JSON.stringify(section.content),
					source: section.source || "theme",
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				}).where("id", "=", existing.id).execute();
				result.sections.updated++;
				continue;
			}
			result.sections.skipped++;
			continue;
		}
		const id = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await db.insertInto("_emdash_sections").values({
			id,
			slug: section.slug,
			title: section.title,
			description: section.description ?? null,
			keywords: section.keywords ? JSON.stringify(section.keywords) : null,
			content: JSON.stringify(section.content),
			preview_media_id: null,
			source: section.source || "theme",
			theme_id: section.source === "theme" ? section.slug : null,
			created_at: now,
			updated_at: now
		}).execute();
		result.sections.created++;
	}
	if (seed.collections) {
		const ftsManager = new FTSManager(db);
		for (const collection of seed.collections) if (collection.supports?.includes("search")) {
			if ((await ftsManager.getSearchableFields(collection.slug)).length > 0) try {
				await ftsManager.enableSearch(collection.slug);
			} catch (err) {
				console.warn(`Failed to enable search for ${collection.slug}:`, err);
			}
		}
	}
	const { invalidateBylineCache } = await import("./bylines-B8-WGdja_D8ZeFr9T.mjs").then((n) => n.t);
	const { invalidateRedirectCache } = await import("./cache-B26cufFd_xrDcXR5c.mjs").then((n) => n.t);
	const { invalidateUrlPatternCache } = await import("./query-DCiXI7OZ_B_Xp5tRe.mjs").then((n) => n.o);
	invalidateBylineCache();
	invalidateRedirectCache();
	invalidateUrlPatternCache();
	return result;
}
/**
* Apply hierarchical taxonomy terms (parents before children)
*/
async function applyHierarchicalTerms(termRepo, taxonomyName, defLocale, terms, termSeedIdMap, result, onConflict = "skip") {
	const slugToId = /* @__PURE__ */ new Map();
	const resolveTermLocale = (term) => resolveConfiguredLocale(term.locale ?? defLocale);
	let remaining = [...terms];
	let maxPasses = 10;
	while (remaining.length > 0 && maxPasses > 0) {
		const processedThisPass = [];
		for (const term of remaining) {
			const termLocale = resolveTermLocale(term);
			const parentReady = !term.parent || slugToId.has(`${termLocale}::${term.parent}`);
			const translationReady = !term.translationOf || termSeedIdMap.has(term.translationOf);
			if (!parentReady || !translationReady) continue;
			const parentId = term.parent ? slugToId.get(`${termLocale}::${term.parent}`) : void 0;
			const translationOf = term.translationOf ? termSeedIdMap.get(term.translationOf) : void 0;
			const existing = await termRepo.findBySlug(taxonomyName, term.slug, termLocale);
			if (existing) {
				if (onConflict === "error") throw new Error(`Conflict: taxonomy term "${term.slug}" in "${taxonomyName}" (${termLocale}) already exists`);
				if (onConflict === "update") {
					await termRepo.update(existing.id, {
						label: term.label,
						parentId,
						data: term.description ? { description: term.description } : {}
					});
					result.taxonomies.terms++;
				}
				slugToId.set(`${termLocale}::${term.slug}`, existing.id);
				if (term.id) termSeedIdMap.set(term.id, existing.id);
			} else {
				const created = await termRepo.create({
					name: taxonomyName,
					slug: term.slug,
					label: term.label,
					parentId,
					data: term.description ? { description: term.description } : void 0,
					locale: termLocale,
					translationOf
				});
				slugToId.set(`${termLocale}::${term.slug}`, created.id);
				if (term.id) termSeedIdMap.set(term.id, created.id);
				result.taxonomies.terms++;
			}
			processedThisPass.push(term.slug + "::" + termLocale);
		}
		remaining = remaining.filter((term) => !processedThisPass.includes(term.slug + "::" + resolveTermLocale(term)));
		maxPasses--;
	}
	if (remaining.length > 0) console.warn(`Could not process ${remaining.length} terms due to missing parents/translations`);
}
/**
* Apply byline credits to a content entry.
* In update mode, clears existing credits even if the seed has none.
*/
async function applyContentBylines(bylineRepo, collectionSlug, contentId, entry, seedBylineIdMap, isUpdate = false) {
	if (!entry.bylines || entry.bylines.length === 0) {
		if (isUpdate) await bylineRepo.setContentBylines(collectionSlug, contentId, []);
		return;
	}
	const credits = entry.bylines.map((credit) => {
		const bylineId = seedBylineIdMap.get(credit.byline);
		if (!bylineId) return null;
		return {
			bylineId,
			roleLabel: credit.roleLabel ?? null
		};
	}).filter((credit) => Boolean(credit));
	if (credits.length !== entry.bylines.length) console.warn(`content.${collectionSlug}.${entry.slug}: one or more byline refs could not be resolved`);
	if (credits.length > 0 || isUpdate) await bylineRepo.setContentBylines(collectionSlug, contentId, credits);
}
/**
* Apply taxonomy term assignments to a content entry.
* In update mode, clears existing assignments before re-attaching.
*/
async function applyContentTaxonomies(db, collectionSlug, contentId, entry, isUpdate) {
	if (isUpdate) await db.deleteFrom("content_taxonomies").where("collection", "=", collectionSlug).where("entry_id", "=", contentId).execute();
	if (!entry.taxonomies) {
		if (isUpdate) {
			const { invalidateTermCache } = await import("./taxonomies-B61CRSha_ovv5Cg26.mjs").then((n) => n.d);
			invalidateTermCache();
		}
		return;
	}
	for (const [taxonomyName, termSlugs] of Object.entries(entry.taxonomies)) {
		const termRepo = new TaxonomyRepository(db);
		for (const termSlug of termSlugs) {
			const term = await termRepo.findBySlug(taxonomyName, termSlug);
			if (term) await termRepo.attachToEntry(collectionSlug, contentId, term.id);
		}
	}
	const { invalidateTermCache } = await import("./taxonomies-B61CRSha_ovv5Cg26.mjs").then((n) => n.d);
	invalidateTermCache();
}
/**
* Apply menu items recursively.
*
* When a `SeedMenuItem` carries `id`/`translationOf`, the import resolves the
* source item's `translation_group` so cross-locale "same nav entry" links
* survive export → apply. Items without `translationOf` get a fresh group
* (= their own id).
*/
async function applyMenuItems(db, menuId, locale, items, parentId, startOrder, seedIdMap, itemSeedIdMap) {
	let count = 0;
	let order = startOrder;
	for (const item of items) {
		const itemId = ulid();
		const itemLocale = item.locale ?? locale;
		let referenceId = null;
		let referenceCollection = null;
		if (item.type === "page" || item.type === "post") {
			if (item.ref && seedIdMap.has(item.ref)) {
				referenceId = seedIdMap.get(item.ref);
				referenceCollection = item.collection || `${item.type}s`;
			}
		}
		let translationGroup = itemId;
		if (item.translationOf) {
			const source = itemSeedIdMap.get(item.translationOf);
			if (source) translationGroup = source.translationGroup;
			else console.warn(`menu item "${item.label ?? item.url ?? item.ref ?? "(unlabeled)"}" (${itemLocale}): translationOf "${item.translationOf}" not found yet; minting a fresh group.`);
		}
		await db.insertInto("_emdash_menu_items").values({
			id: itemId,
			menu_id: menuId,
			parent_id: parentId,
			sort_order: order,
			type: item.type,
			reference_collection: referenceCollection,
			reference_id: referenceId,
			custom_url: item.url ?? null,
			label: item.label || "",
			title_attr: item.titleAttr ?? null,
			target: item.target ?? null,
			css_classes: item.cssClasses ?? null,
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			locale: itemLocale,
			translation_group: translationGroup
		}).execute();
		if (item.id) itemSeedIdMap.set(item.id, {
			id: itemId,
			translationGroup
		});
		count++;
		order++;
		if (item.children && item.children.length > 0) {
			const childCount = await applyMenuItems(db, menuId, itemLocale, item.children, itemId, 0, seedIdMap, itemSeedIdMap);
			count += childCount;
		}
	}
	return count;
}
/**
* Apply a widget
*/
async function applyWidget(db, areaId, widget, sortOrder) {
	await db.insertInto("_emdash_widgets").values({
		id: ulid(),
		area_id: areaId,
		sort_order: sortOrder,
		type: widget.type,
		title: widget.title ?? null,
		content: widget.content ? JSON.stringify(widget.content) : null,
		menu_name: widget.menuName ?? null,
		component_id: widget.componentId ?? null,
		component_props: widget.props ? JSON.stringify(widget.props) : null
	}).execute();
}
/**
* Type guard for $media reference
*/
function isSeedMediaReference(value) {
	if (typeof value !== "object" || value === null || !("$media" in value)) return false;
	const media = value.$media;
	return typeof media === "object" && media !== null && "url" in media && typeof media.url === "string";
}
/**
* Resolve $ref: and $media references in content data
*/
async function resolveReferences(data, seedIdMap, mediaContext, result) {
	const resolved = {};
	for (const [key, value] of Object.entries(data)) resolved[key] = await resolveValue(value, seedIdMap, mediaContext, result);
	return resolved;
}
/**
* Resolve a single value recursively
*/
async function resolveValue(value, seedIdMap, mediaContext, result) {
	if (typeof value === "string" && value.startsWith("$ref:")) {
		const seedId = value.slice(5);
		return seedIdMap.get(seedId) ?? value;
	}
	if (isSeedMediaReference(value)) return resolveMedia(value, mediaContext, result);
	if (Array.isArray(value)) return Promise.all(value.map((item) => resolveValue(item, seedIdMap, mediaContext, result)));
	if (typeof value === "object" && value !== null) {
		const resolved = {};
		for (const [k, v] of Object.entries(value)) resolved[k] = await resolveValue(v, seedIdMap, mediaContext, result);
		return resolved;
	}
	return value;
}
/**
* Resolve a seeded byline avatar to a `media` row id. The file is assumed to
* already exist in storage (the caller supplies its `storageKey`), so nothing
* is downloaded or uploaded.
*
* Idempotent: if a media row with the same `storageKey` already exists it is
* reused rather than duplicated, so re-applying a seed in `update` mode does
* not leak rows. `created` reports whether a new row was inserted, so the
* caller can both account for it and delete it if the subsequent byline write
* fails (the only cross-dialect way to avoid an orphan — `withTransaction`
* is a no-op on D1).
*/
async function resolveSeedBylineAvatar(db, avatar) {
	const existing = await db.selectFrom("media").select("id").where("storage_key", "=", avatar.storageKey).orderBy("id", "asc").executeTakeFirst();
	if (existing) return {
		id: existing.id,
		created: false
	};
	const basename = avatar.storageKey.split("/").pop();
	const filename = avatar.filename ?? (basename && basename.length > 0 ? basename : avatar.storageKey);
	return {
		id: (await new MediaRepository(db).create({
			filename,
			mimeType: avatar.mimeType ?? "image/jpeg",
			storageKey: avatar.storageKey,
			alt: avatar.alt,
			width: avatar.width,
			height: avatar.height,
			status: "ready"
		})).id,
		created: true
	};
}
/**
* Delete a media row by id. Best-effort cleanup for a failed byline write: a
* failure here must not mask the original error that triggered the cleanup, so
* it is logged and swallowed rather than thrown.
*/
async function deleteMediaRow(db, id) {
	try {
		await db.deleteFrom("media").where("id", "=", id).execute();
	} catch (error) {
		console.warn(`[seed] failed to clean up orphaned avatar media ${id}:`, error);
	}
}
/**
* Resolve a $media reference by downloading and uploading the media
*/
async function resolveMedia(ref, ctx, result) {
	const { url, alt, filename, caption } = ref.$media;
	const cached = ctx.mediaCache.get(url);
	if (cached) {
		result.media.skipped++;
		return {
			...cached,
			alt: alt ?? cached.alt
		};
	}
	if (ctx.skipMediaDownload) {
		const mediaValue = {
			provider: "external",
			id: ulid(),
			src: url,
			alt: alt ?? void 0,
			filename: filename ?? void 0
		};
		ctx.mediaCache.set(url, mediaValue);
		result.media.created++;
		return mediaValue;
	}
	if (!ctx.storage) {
		console.warn(`Skipping $media reference (no storage configured): ${url}`);
		result.media.skipped++;
		return null;
	}
	try {
		validateExternalUrl(url);
		console.log(`  📥 Downloading: ${url}`);
		const response = await ssrfSafeFetch(url, { headers: { "User-Agent": "EmDash-CMS/1.0" } });
		if (!response.ok) {
			console.warn(`  ⚠️ Failed to download ${url}: ${response.status}`);
			result.media.skipped++;
			return null;
		}
		const contentType = response.headers.get("content-type") || "application/octet-stream";
		const ext = getExtensionFromContentType(contentType) || getExtensionFromUrl(url) || ".bin";
		const id = ulid();
		const finalFilename = filename || generateFilename(url, ext);
		const storageKey = `${id}${ext}`;
		const arrayBuffer = await response.arrayBuffer();
		const body = new Uint8Array(arrayBuffer);
		let width;
		let height;
		if (contentType.startsWith("image/")) {
			const dimensions = getImageDimensions(body);
			width = dimensions?.width;
			height = dimensions?.height;
		}
		await ctx.storage.upload({
			key: storageKey,
			body,
			contentType
		});
		await new MediaRepository(ctx.db).create({
			filename: finalFilename,
			mimeType: contentType,
			size: body.length,
			width,
			height,
			alt,
			caption,
			storageKey,
			status: "ready"
		});
		const mediaValue = {
			provider: "local",
			id,
			alt: alt ?? void 0,
			width,
			height,
			mimeType: contentType,
			filename: finalFilename,
			meta: { storageKey }
		};
		ctx.mediaCache.set(url, mediaValue);
		result.media.created++;
		console.log(`  ✅ Uploaded: ${finalFilename}`);
		return mediaValue;
	} catch (error) {
		console.warn(`  ⚠️ Error processing $media ${url}:`, error instanceof Error ? error.message : error);
		result.media.skipped++;
		return null;
	}
}
/**
* Get file extension from content type
*/
function getExtensionFromContentType(contentType) {
	const baseMime = contentType.split(";")[0].trim();
	const ext = index_lite_default.getExtension(baseMime);
	return ext ? `.${ext}` : null;
}
/**
* Get file extension from URL
*/
function getExtensionFromUrl(url) {
	try {
		const match = new URL(url).pathname.match(FILE_EXTENSION_PATTERN);
		return match ? `.${match[1]}` : null;
	} catch {
		return null;
	}
}
/**
* Generate a filename from URL
*/
function generateFilename(url, ext) {
	try {
		return `${(new URL(url).pathname.split("/").pop() || "media").replace(EXTENSION_PATTERN, "").replace(QUERY_PARAM_PATTERN, "").replace(SANITIZE_PATTERN, "-").replace(MULTIPLE_HYPHENS_PATTERN, "-") || "media"}${ext}`;
	} catch {
		return `media${ext}`;
	}
}
/**
* Get image dimensions from buffer using image-size.
* Supports PNG, JPEG, GIF, WebP, AVIF, SVG, TIFF, and more.
*/
function getImageDimensions(buffer) {
	try {
		const result = imageSize(buffer);
		if (result.width != null && result.height != null) return {
			width: result.width,
			height: result.height
		};
		return null;
	} catch {
		return null;
	}
}
//#endregion
export { OptionsRepository as _, SsrfError as a, stripCredentialHeaders as c, invalidateSiteSettingsCache as d, createSingleFlightCache as f, MediaRepository as g, TaxonomyRepository as h, RedirectRepository as i, validateExternalUrl as l, imageSize as m, apply_exports as n, resolveAndValidateExternalUrl as o, singleFlightCached as p, index_lite_default as r, ssrfSafeFetch as s, applySeed as t, getSiteSettings as u };
