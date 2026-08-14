import { a as sql } from "./migrator_BiAfLowp.mjs";
import { b as validateIdentifier, f as currentTimestamp, g as listTablesLike, h as isSqlite, r as __exportAll, s as isI18nEnabled, y as tableExists } from "./runner-BsI18UgP_CTLRmh7U.mjs";
import { a as encodeCursor, i as decodeCursor, n as InvalidCursorError } from "./types-XrQQ-Aex_rb6o-8d1.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as chunks } from "./chunks-D5dlPeRb_ZmalEYon.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { a as RESERVED_COLLECTION_SLUGS, o as RESERVED_FIELD_SLUGS, r as FIELD_TYPE_TO_COLUMN } from "./types-o7xo7VgH_Bdv_7eeq.mjs";
//#region self-essentials/emdash-main/packages/core/dist/mime-DfIVjNkr.mjs
function normalizeMime(mime) {
	return mime.split(";")[0].trim().toLowerCase();
}
function matchesMimeAllowlist(mime, allowList) {
	const normalized = normalizeMime(mime);
	for (const entry of allowList) {
		if (!entry || !entry.includes("/")) continue;
		const normalizedEntry = normalizeMime(entry);
		if (normalizedEntry.endsWith("/")) {
			if (normalized.startsWith(normalizedEntry)) return true;
		} else if (normalized === normalizedEntry) return true;
	}
	return false;
}
/**
* Extract the `allowedMimeTypes` list from a `_emdash_fields.validation` row
* (raw JSON string). Returns null when the value is missing, malformed, or the
* list is empty — callers treat that as "no field-specific constraint".
*/
function parseAllowedMimeTypes(rawValidation) {
	if (!rawValidation) return null;
	try {
		const parsed = JSON.parse(rawValidation);
		if (typeof parsed !== "object" || parsed === null) return null;
		const list = parsed.allowedMimeTypes;
		if (!Array.isArray(list) || list.length === 0) return null;
		return list.filter((entry) => typeof entry === "string");
	} catch {
		return null;
	}
}
var URL_PATTERN = /^https?:\/\//;
/**
* Normalize a media field value into a consistent MediaValue shape.
*
* - `null`/`undefined` → `null`
* - Bare URL string → `{ provider: "external", id: "", src: url }`
* - Bare internal media URL → resolved via local provider's `get()`
* - Bare local media ID → resolved via local provider's `get()`
* - Object with `provider` + `id` → enriched with missing fields from provider
*/
async function normalizeMediaValue(value, getProvider) {
	if (value == null) return null;
	if (typeof value === "string") return normalizeStringUrl(value, getProvider);
	if (!isRecord$3(value)) return null;
	if (!("id" in value) && !("src" in value)) return null;
	const provider = (typeof value.provider === "string" ? value.provider : void 0) || "local";
	const id = typeof value.id === "string" ? value.id : "";
	if (provider === "external") return recordToMediaValue(value);
	const result = {
		...recordToMediaValue(value),
		provider
	};
	if (provider === "local") delete result.src;
	const needsDimensions = result.width == null || result.height == null;
	const needsStorageKey = provider === "local" && !result.meta?.storageKey;
	const needsFileInfo = !result.mimeType || !result.filename;
	const needsLqip = (result.mimeType ?? "").startsWith("image/") && (result.blurhash == null || result.dominantColor == null);
	if (!(needsDimensions || needsStorageKey || needsFileInfo || needsLqip) || !id) return result;
	const mediaProvider = getProvider(provider);
	if (!mediaProvider?.get) return result;
	let providerItem;
	try {
		providerItem = await mediaProvider.get(id);
	} catch {
		return result;
	}
	if (!providerItem) return result;
	return mergeProviderData(result, providerItem);
}
async function normalizeStringUrl(url, getProvider) {
	if (url.startsWith("/_emdash/api/media/file/")) return resolveInternalUrl(url, getProvider);
	if (URL_PATTERN.test(url)) return Promise.resolve({
		provider: "external",
		id: "",
		src: url
	});
	const localMedia = await resolveLocalId(url, getProvider);
	if (localMedia) return localMedia;
	return {
		provider: "external",
		id: "",
		src: url
	};
}
async function resolveInternalUrl(url, getProvider) {
	const storageKey = url.slice(24);
	const localProvider = getProvider("local");
	if (!localProvider?.get) return {
		provider: "external",
		id: "",
		src: url
	};
	let item;
	try {
		item = await localProvider.get(storageKey);
	} catch {
		return {
			provider: "external",
			id: "",
			src: url
		};
	}
	if (!item) return {
		provider: "external",
		id: "",
		src: url
	};
	return {
		provider: "local",
		id: item.id,
		filename: item.filename,
		mimeType: item.mimeType,
		width: item.width,
		height: item.height,
		blurhash: item.blurhash,
		dominantColor: item.dominantColor,
		alt: item.alt,
		meta: item.meta
	};
}
async function resolveLocalId(id, getProvider) {
	const localProvider = getProvider("local");
	if (!localProvider?.get) return null;
	let item;
	try {
		item = await localProvider.get(id);
	} catch {
		return null;
	}
	if (!item) return null;
	return {
		provider: "local",
		id: item.id,
		filename: item.filename,
		mimeType: item.mimeType,
		width: item.width,
		height: item.height,
		blurhash: item.blurhash,
		dominantColor: item.dominantColor,
		alt: item.alt,
		meta: item.meta
	};
}
/**
* Merge provider data into an existing MediaValue, preserving caller-supplied fields.
* Caller `alt` takes priority over provider `alt` (per-usage, not per-image).
*/
function mergeProviderData(existing, item) {
	const result = { ...existing };
	if (result.width == null && item.width != null) result.width = item.width;
	if (result.height == null && item.height != null) result.height = item.height;
	if (result.blurhash == null && item.blurhash != null) result.blurhash = item.blurhash;
	if (result.dominantColor == null && item.dominantColor != null) result.dominantColor = item.dominantColor;
	if (!result.filename && item.filename) result.filename = item.filename;
	if (!result.mimeType && item.mimeType) result.mimeType = item.mimeType;
	if (!result.alt && item.alt) result.alt = item.alt;
	if (item.meta) result.meta = {
		...item.meta,
		...result.meta
	};
	return result;
}
function isRecord$3(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Extract known MediaValue fields from a runtime-checked record.
* Avoids unsafe `as MediaValue` cast by reading each property explicitly.
*/
function recordToMediaValue(obj) {
	const result = { id: typeof obj.id === "string" ? obj.id : "" };
	if (typeof obj.provider === "string") result.provider = obj.provider;
	if (typeof obj.src === "string") result.src = obj.src;
	if (typeof obj.previewUrl === "string") result.previewUrl = obj.previewUrl;
	if (typeof obj.filename === "string") result.filename = obj.filename;
	if (typeof obj.mimeType === "string") result.mimeType = obj.mimeType;
	if (typeof obj.width === "number") result.width = obj.width;
	if (typeof obj.height === "number") result.height = obj.height;
	if (typeof obj.blurhash === "string") result.blurhash = obj.blurhash;
	if (typeof obj.dominantColor === "string") result.dominantColor = obj.dominantColor;
	if (typeof obj.alt === "string") result.alt = obj.alt;
	if (isRecord$3(obj.meta)) result.meta = obj.meta;
	return result;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/hash-Cb7U1b5M.mjs
/**
* SHA-256 hash of a string, truncated to 16 hex chars (64 bits).
* For cache invalidation / ETags — not for security.
*/
async function hashString(content) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
	return Array.from(new Uint8Array(buf).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/content-refresh-DgqUBeTv.mjs
var OCCURRENCE_INSERT_BATCH_SIZE = Math.max(1, Math.floor(50 / 13));
var CONTENT_SOURCE_ELIGIBILITY = sql`(
	s.source_variant = 'draft_overlay'
	OR (
		s.source_variant = 'columns'
		AND (
			s.content_status = 'published'
			OR NOT EXISTS (
				SELECT 1
				FROM _emdash_media_usage_sources AS overlay
				WHERE overlay.source_type = 'content'
					AND overlay.collection_slug = s.collection_slug
					AND overlay.content_id = s.content_id
					AND overlay.source_variant = 'draft_overlay'
			)
		)
	)
)`;
/** Persistence-only repository for the internal media usage projection tables. */
var MediaUsageRepository = class {
	constructor(db) {
		this.db = db;
	}
	async replaceSource(source, occurrences) {
		const generation = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await withTransaction(this.db, async (trx) => {
			await this.insertOccurrences(trx, source.sourceKey, generation, occurrences, now);
			await this.upsertSource(trx, source, generation, now);
		});
		const replaced = await this.findSource(source.sourceKey);
		if (!replaced) throw new Error(`Media usage source ${source.sourceKey} was not persisted`);
		return replaced;
	}
	async replaceSourceIfCurrent(source, occurrences, expectedCurrentGeneration) {
		const generation = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildSourceRow(source, generation, now);
		let replaced = false;
		await withTransaction(this.db, async (trx) => {
			await this.insertOccurrences(trx, source.sourceKey, generation, occurrences, now);
			if (expectedCurrentGeneration === null) {
				replaced = await this.insertSourceIfAbsent(trx, row);
				return;
			}
			replaced = await this.updateSourceIfGeneration(trx, row, expectedCurrentGeneration);
		});
		return {
			replaced,
			source: replaced ? null : await this.findSource(source.sourceKey)
		};
	}
	async findSource(sourceKey) {
		const row = await this.db.selectFrom("_emdash_media_usage_sources").selectAll().where("source_key", "=", sourceKey).executeTakeFirst();
		return row ? rowToSource(row) : null;
	}
	async findSources(sourceKeys) {
		const uniqueSourceKeys = [...new Set(sourceKeys)];
		const sources = /* @__PURE__ */ new Map();
		if (uniqueSourceKeys.length === 0) return sources;
		for (const sourceKeyBatch of chunks(uniqueSourceKeys, 50)) {
			const rows = await this.db.selectFrom("_emdash_media_usage_sources").selectAll().where("source_key", "in", sourceKeyBatch).execute();
			for (const row of rows) {
				const source = rowToSource(row);
				sources.set(source.sourceKey, source);
			}
		}
		return sources;
	}
	async replaceSourceIfMatching(source, occurrences, expectedSource) {
		const generation = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildSourceRow(source, generation, now);
		let replaced = false;
		await withTransaction(this.db, async (trx) => {
			await this.insertOccurrences(trx, source.sourceKey, generation, occurrences, now);
			if (expectedSource === null) {
				replaced = await this.insertSourceIfAbsent(trx, row);
				return;
			}
			replaced = await this.updateSourceIfMatching(trx, row, expectedSource);
		});
		return {
			replaced,
			source: replaced ? null : await this.findSource(source.sourceKey)
		};
	}
	async markSourceAttempted(source) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildAttemptedSourceRow(source, now);
		const updates = this.attemptedSourceUpdateSet(source, row);
		await this.db.insertInto("_emdash_media_usage_sources").values(row).onConflict((oc) => oc.column("source_key").doUpdateSet(updates)).execute();
		const attempted = await this.findSource(source.sourceKey);
		if (!attempted) throw new Error(`Media usage source ${source.sourceKey} was not persisted`);
		return attempted;
	}
	async markSourceAttemptedIfMatching(source, expectedSource) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildAttemptedSourceRow(source, now);
		let attempted = false;
		if (expectedSource === null) attempted = await this.insertSourceIfAbsent(this.db, row);
		else attempted = await this.updateAttemptedSourceIfMatching(this.db, source, row, expectedSource);
		return {
			attempted,
			source: attempted ? null : await this.findSource(source.sourceKey)
		};
	}
	async findActiveEntryCountsByMediaIds(mediaIds) {
		const uniqueMediaIds = [...new Set(mediaIds)];
		const counts = new Map(uniqueMediaIds.map((mediaId) => [mediaId, 0]));
		for (const mediaIdBatch of chunks(uniqueMediaIds, 50)) {
			const visibleEntries = this.currentContentMediaUsageBaseQuery().select([
				"u.media_id as media_id",
				"s.collection_slug as collection_slug",
				"s.content_id as content_id"
			]).where("u.media_id", "in", mediaIdBatch).where((eb) => eb.not(eb.exists(eb.selectFrom("_emdash_media_usage_sources as deleted_source").select("deleted_source.source_key").where("deleted_source.source_type", "=", "content").whereRef("deleted_source.collection_slug", "=", "s.collection_slug").whereRef("deleted_source.content_id", "=", "s.content_id").where("deleted_source.source_variant", "in", ["columns", "draft_overlay"]).where("deleted_source.content_deleted_at", "is not", null)))).distinct().as("visible_entries");
			const rows = await this.db.selectFrom(visibleEntries).select("media_id").select((eb) => eb.fn.countAll().as("usage_count")).groupBy("media_id").execute();
			for (const row of rows) if (row.media_id !== null) counts.set(row.media_id, Number(row.usage_count));
		}
		return counts;
	}
	async findCollectionIndexStatusScopes(identity) {
		return (await this.db.selectFrom("_emdash_collections as collection").leftJoin("_emdash_media_usage_index_status as status", (join) => join.on("status.adapter_id", "=", identity.adapterId).on("status.scope_type", "=", identity.scopeType).onRef("status.scope_key", "=", "collection.slug")).select([
			"collection.slug as collection_slug",
			"status.status as status",
			"status.schema_version as schema_version"
		]).orderBy("collection.slug", "asc").execute()).map((row) => ({
			collectionSlug: row.collection_slug,
			status: row.status,
			schemaVersion: row.schema_version === null ? null : Number(row.schema_version)
		}));
	}
	async findCurrentEntryUsagePageByMediaId(mediaId, options = {}) {
		const requestedLimit = Math.floor(options.limit ?? 50);
		const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(1, requestedLimit), 100) : 50;
		const cursor = options.cursor ? decodeCursor(options.cursor) : null;
		if (cursor && (cursor.orderValue.length === 0 || cursor.id.length === 0)) throw new InvalidCursorError(options.cursor ?? "");
		let matchedGroups = this.currentContentMediaUsageBaseQuery().select(["s.collection_slug as collection_slug", "s.content_id as content_id"]).where("u.media_id", "=", mediaId).distinct();
		if (cursor) matchedGroups = matchedGroups.where((eb) => eb.or([eb("s.collection_slug", ">", cursor.orderValue), eb.and([eb("s.collection_slug", "=", cursor.orderValue), eb("s.content_id", ">", cursor.id)])]));
		matchedGroups = matchedGroups.orderBy("s.collection_slug", "asc").orderBy("s.content_id", "asc").limit(limit + 1);
		const rows = await this.db.with("matched_groups", () => matchedGroups).with("page_groups", (db) => db.selectFrom("matched_groups").selectAll().orderBy("collection_slug", "asc").orderBy("content_id", "asc").limit(limit)).with("entry_state", (db) => db.selectFrom("page_groups as page").crossJoin("_emdash_media_usage_sources as state").select(["page.collection_slug", "page.content_id"]).select((eb) => eb.fn.max("state.content_deleted_at").as("entry_deleted_at")).whereRef("page.collection_slug", "=", "state.collection_slug").whereRef("page.content_id", "=", "state.content_id").where("state.source_type", "=", "content").where("state.source_variant", "in", ["columns", "draft_overlay"]).groupBy(["page.collection_slug", "page.content_id"])).selectFrom("entry_state as page").crossJoin("_emdash_media_usage_sources as s").crossJoin("_emdash_media_usage as u").whereRef("page.collection_slug", "=", "s.collection_slug").whereRef("page.content_id", "=", "s.content_id").whereRef("s.source_key", "=", "u.source_key").whereRef("s.current_generation", "=", "u.generation").select(currentUsageSelect).select("page.entry_deleted_at").select(sql`CASE
					WHEN (SELECT COUNT(*) FROM matched_groups) > ${limit} THEN 1
					ELSE 0
				END`.as("has_more")).where("u.media_id", "=", mediaId).where("s.source_type", "=", "content").where("s.collection_slug", "is not", null).where("s.content_id", "is not", null).where("s.source_variant", "in", ["columns", "draft_overlay"]).where(CONTENT_SOURCE_ELIGIBILITY).orderBy("s.collection_slug", "asc").orderBy("s.content_id", "asc").orderBy("s.source_variant", "asc").orderBy("s.source_key", "asc").orderBy("u.field_path", "asc").orderBy("u.occurrence_index", "asc").orderBy("u.id", "asc").execute();
		const items = groupUsageRows(rows);
		const result = { items };
		if (Number(rows[0]?.has_more ?? 0) === 1 && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.collectionSlug, last.contentId);
		}
		return result;
	}
	async findCurrentUsageByMediaId(mediaId) {
		return (await this.db.selectFrom("_emdash_media_usage_sources as s").innerJoin("_emdash_media_usage as u", (join) => join.onRef("u.source_key", "=", "s.source_key").onRef("u.generation", "=", "s.current_generation")).select(currentUsageSelect).where("u.media_id", "=", mediaId).orderBy("s.source_key", "asc").orderBy("u.field_path", "asc").orderBy("u.occurrence_index", "asc").execute()).map(rowToUsageRecord);
	}
	async findCurrentUsageByProviderAsset(provider, providerAssetId) {
		return (await this.db.selectFrom("_emdash_media_usage_sources as s").innerJoin("_emdash_media_usage as u", (join) => join.onRef("u.source_key", "=", "s.source_key").onRef("u.generation", "=", "s.current_generation")).select(currentUsageSelect).where("u.provider", "=", provider).where("u.provider_asset_id", "=", providerAssetId).orderBy("s.source_key", "asc").orderBy("u.field_path", "asc").orderBy("u.occurrence_index", "asc").execute()).map(rowToUsageRecord);
	}
	async findCurrentUsagePageByMediaId(mediaId, options = {}) {
		return this.findCurrentUsagePage((query) => query.where("u.media_id", "=", mediaId), options);
	}
	async findCurrentUsagePageByProviderAsset(provider, providerAssetId, options = {}) {
		return this.findCurrentUsagePage((query) => query.where("u.provider", "=", provider).where("u.provider_asset_id", "=", providerAssetId), options);
	}
	async deleteSource(sourceKey) {
		return this.deleteSources([sourceKey]);
	}
	async deleteSourceIfCurrent(sourceKey, expectedCurrentGeneration) {
		let deleted = false;
		await withTransaction(this.db, async (trx) => {
			const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "=", sourceKey).where("current_generation", "=", expectedCurrentGeneration).executeTakeFirst();
			deleted = Number(result.numDeletedRows ?? 0) > 0;
			if (!deleted) return;
			await this.deleteSourceGenerationOccurrences(trx, sourceKey, expectedCurrentGeneration);
		});
		return {
			deleted,
			source: await this.findSource(sourceKey)
		};
	}
	async deleteSourceIfMatching(sourceKey, expectedSource) {
		let deleted = false;
		await withTransaction(this.db, async (trx) => {
			const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "=", sourceKey).where(this.sourceMatchExpression(expectedSource)).executeTakeFirst();
			deleted = Number(result.numDeletedRows ?? 0) > 0;
			if (!deleted) return;
			await this.deleteSourceGenerationOccurrences(trx, sourceKey, expectedSource.currentGeneration);
		});
		return {
			deleted,
			source: await this.findSource(sourceKey)
		};
	}
	async deleteSourceIfMatchingContentAbsent(sourceKey, expectedSource, collectionSlug, contentId) {
		validateIdentifier(collectionSlug, "collection slug");
		const tableName = `ec_${collectionSlug}`;
		let deleted = false;
		await withTransaction(this.db, async (trx) => {
			const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "=", sourceKey).where(this.sourceMatchExpression(expectedSource)).where(sql`NOT EXISTS (SELECT 1 FROM ${sql.ref(tableName)} WHERE id = ${contentId})`).executeTakeFirst();
			deleted = Number(result.numDeletedRows ?? 0) > 0;
			if (!deleted) return;
			await this.deleteSourceGenerationOccurrences(trx, sourceKey, expectedSource.currentGeneration);
		});
		const contentPresent = deleted ? false : await this.contentRowExists(tableName, contentId);
		return {
			deleted,
			contentPresent,
			source: deleted || contentPresent ? null : await this.findSource(sourceKey)
		};
	}
	async deleteSources(sourceKeys) {
		return this.deleteSourceKeys(sourceKeys);
	}
	async deleteContentSources(collectionSlug, contentId) {
		const sourceKeys = (await this.db.selectFrom("_emdash_media_usage_sources").select("source_key").where("source_type", "=", "content").where("collection_slug", "=", collectionSlug).where("content_id", "=", contentId).execute()).map((row) => row.source_key);
		return this.deleteSourceKeys(sourceKeys);
	}
	async deleteCollectionSources(collectionSlug) {
		let deleted = 0;
		while (true) {
			const sourceRows = await this.db.selectFrom("_emdash_media_usage_sources").select("source_key").where("source_type", "=", "content").where("collection_slug", "=", collectionSlug).orderBy("source_key", "asc").limit(50).execute();
			if (sourceRows.length === 0) break;
			deleted += await this.deleteSourceKeys(sourceRows.map((row) => row.source_key));
		}
		return deleted;
	}
	async findCollectionContentSources(collectionSlug) {
		return (await this.db.selectFrom("_emdash_media_usage_sources").selectAll().where("source_type", "=", "content").where("collection_slug", "=", collectionSlug).orderBy("source_key", "asc").execute()).map((row) => rowToSource(row));
	}
	async deleteOrphanOccurrencesOlderThan(cutoff, limit) {
		const batchLimit = Math.floor(limit);
		if (batchLimit <= 0) return 0;
		const rows = await this.db.selectFrom("_emdash_media_usage as u").leftJoin("_emdash_media_usage_sources as s", (join) => join.onRef("s.source_key", "=", "u.source_key")).select("u.id").where("s.source_key", "is", null).where("u.created_at", "<", cutoff).orderBy("u.created_at", "asc").orderBy("u.id", "asc").limit(batchLimit).execute();
		let deleted = 0;
		for (const idBatch of chunks(rows.map((row) => row.id), 50)) {
			const result = await this.db.deleteFrom("_emdash_media_usage").where("id", "in", idBatch).where("created_at", "<", cutoff).where(sql`NOT EXISTS (SELECT 1 FROM _emdash_media_usage_sources s WHERE s.source_key = _emdash_media_usage.source_key)`).executeTakeFirst();
			deleted += Number(result.numDeletedRows ?? 0);
		}
		return deleted;
	}
	async deleteStaleGenerationsOlderThan(cutoff, limit) {
		const batchLimit = Math.floor(limit);
		if (batchLimit <= 0) return 0;
		const ids = (await this.db.selectFrom("_emdash_media_usage as u").innerJoin("_emdash_media_usage_sources as s", (join) => join.onRef("s.source_key", "=", "u.source_key")).select("u.id").where("u.created_at", "<", cutoff).whereRef("u.generation", "!=", "s.current_generation").whereRef("u.created_at", "<", "s.indexed_at").orderBy("u.created_at", "asc").orderBy("u.id", "asc").limit(batchLimit).execute()).map((row) => row.id);
		if (ids.length === 0) return 0;
		let deleted = 0;
		for (const idBatch of chunks(ids, 50)) {
			const result = await this.db.deleteFrom("_emdash_media_usage").where("id", "in", idBatch).where("created_at", "<", cutoff).where((eb) => eb.exists(eb.selectFrom("_emdash_media_usage_sources as s").select("s.source_key").whereRef("s.source_key", "=", "_emdash_media_usage.source_key").whereRef("s.current_generation", "!=", "_emdash_media_usage.generation").whereRef("_emdash_media_usage.created_at", "<", "s.indexed_at"))).executeTakeFirst();
			deleted += Number(result.numDeletedRows ?? 0);
		}
		return deleted;
	}
	async deleteAbandonedGenerationsOlderThan(cutoff, limit) {
		const batchLimit = Math.floor(limit);
		if (batchLimit <= 0) return 0;
		const rows = await this.db.selectFrom("_emdash_media_usage as u").innerJoin("_emdash_media_usage_sources as s", (join) => join.onRef("s.source_key", "=", "u.source_key")).select("u.id").where("u.created_at", "<", cutoff).whereRef("u.generation", "!=", "s.current_generation").whereRef("u.created_at", ">=", "s.indexed_at").orderBy("u.created_at", "asc").orderBy("u.id", "asc").limit(batchLimit).execute();
		let deleted = 0;
		for (const idBatch of chunks(rows.map((row) => row.id), 50)) {
			const result = await this.db.deleteFrom("_emdash_media_usage").where("id", "in", idBatch).where("created_at", "<", cutoff).where((eb) => eb.exists(eb.selectFrom("_emdash_media_usage_sources as s").select("s.source_key").whereRef("s.source_key", "=", "_emdash_media_usage.source_key").whereRef("s.current_generation", "!=", "_emdash_media_usage.generation").whereRef("_emdash_media_usage.created_at", ">=", "s.indexed_at"))).executeTakeFirst();
			deleted += Number(result.numDeletedRows ?? 0);
		}
		return deleted;
	}
	async upsertIndexStatus(input) {
		const now = input.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
		const row = {
			adapter_id: input.adapterId,
			scope_type: input.scopeType,
			scope_key: input.scopeKey,
			status: input.status,
			schema_version: input.schemaVersion ?? 1,
			started_at: input.startedAt ?? null,
			completed_at: input.completedAt ?? null,
			cursor: input.cursor ?? null,
			indexed_source_count: input.indexedSourceCount ?? 0,
			failed_source_count: input.failedSourceCount ?? 0,
			last_error_code: input.lastErrorCode ?? null,
			updated_at: now
		};
		await this.db.insertInto("_emdash_media_usage_index_status").values(row).onConflict((oc) => oc.columns([
			"adapter_id",
			"scope_type",
			"scope_key"
		]).doUpdateSet({
			status: row.status,
			schema_version: row.schema_version,
			started_at: row.started_at,
			completed_at: row.completed_at,
			cursor: row.cursor,
			indexed_source_count: row.indexed_source_count,
			failed_source_count: row.failed_source_count,
			last_error_code: row.last_error_code,
			updated_at: row.updated_at
		})).execute();
		const status = await this.findIndexStatus(input);
		if (!status) throw new Error(`Media usage index status ${input.adapterId}:${input.scopeType}:${input.scopeKey} was not persisted`);
		return status;
	}
	async beginIndexStatusRepair(input) {
		return this.upsertIndexStatus({
			adapterId: input.adapterId,
			scopeType: input.scopeType,
			scopeKey: input.scopeKey,
			status: "running",
			schemaVersion: input.schemaVersion,
			startedAt: input.startedAt,
			completedAt: null,
			cursor: input.runToken,
			indexedSourceCount: 0,
			failedSourceCount: 0,
			lastErrorCode: null,
			updatedAt: input.updatedAt
		});
	}
	async finalizeIndexStatusRepairIfRunning(input) {
		const updates = {
			status: input.status,
			completed_at: input.completedAt,
			cursor: null,
			indexed_source_count: input.indexedSourceCount ?? 0,
			failed_source_count: input.failedSourceCount ?? 0,
			last_error_code: input.lastErrorCode ?? null,
			updated_at: input.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString()
		};
		if (input.schemaVersion !== void 0) updates.schema_version = input.schemaVersion;
		const result = await this.db.updateTable("_emdash_media_usage_index_status").set(updates).where("adapter_id", "=", input.adapterId).where("scope_type", "=", input.scopeType).where("scope_key", "=", input.scopeKey).where("status", "=", "running").where("cursor", "=", input.runToken).executeTakeFirst();
		return {
			finalized: Number(result.numUpdatedRows ?? 0) > 0,
			status: await this.findIndexStatus(input)
		};
	}
	async findIndexStatus(identity) {
		const row = await this.db.selectFrom("_emdash_media_usage_index_status").selectAll().where("adapter_id", "=", identity.adapterId).where("scope_type", "=", identity.scopeType).where("scope_key", "=", identity.scopeKey).executeTakeFirst();
		return row ? rowToIndexStatus(row) : null;
	}
	async deleteIndexStatus(identity) {
		const result = await this.db.deleteFrom("_emdash_media_usage_index_status").where("adapter_id", "=", identity.adapterId).where("scope_type", "=", identity.scopeType).where("scope_key", "=", identity.scopeKey).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	async findCurrentUsagePage(applyFilter, options) {
		const limit = Math.min(Math.max(1, options.limit ?? 50), 100);
		let query = applyFilter(this.currentUsageBaseQuery()).orderBy("u.id", "asc").limit(limit + 1);
		if (options.cursor) {
			const { id } = decodeCursor(options.cursor);
			query = query.where("u.id", ">", id);
		}
		const rows = await query.execute();
		const items = rows.slice(0, limit).map(rowToUsageRecord);
		const result = { items };
		if (rows.length > limit && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.occurrence.id, last.occurrence.id);
		}
		return result;
	}
	currentUsageBaseQuery() {
		return this.db.selectFrom("_emdash_media_usage_sources as s").innerJoin("_emdash_media_usage as u", (join) => join.onRef("u.source_key", "=", "s.source_key").onRef("u.generation", "=", "s.current_generation")).select(currentUsageSelect);
	}
	currentContentMediaUsageBaseQuery() {
		return this.db.selectFrom("_emdash_media_usage as u").crossJoin("_emdash_media_usage_sources as s").innerJoin("_emdash_collections as collection", "collection.slug", "s.collection_slug").whereRef("s.source_key", "=", "u.source_key").whereRef("s.current_generation", "=", "u.generation").where("s.source_type", "=", "content").where("s.collection_slug", "is not", null).where("s.content_id", "is not", null).where("s.source_variant", "in", ["columns", "draft_overlay"]).where(CONTENT_SOURCE_ELIGIBILITY);
	}
	async deleteSourceKeys(sourceKeys) {
		const uniqueSourceKeys = [...new Set(sourceKeys)];
		if (uniqueSourceKeys.length === 0) return 0;
		return withTransaction(this.db, async (trx) => {
			let deleted = 0;
			for (const sourceKeyBatch of chunks(uniqueSourceKeys, 50)) {
				const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "in", sourceKeyBatch).executeTakeFirst();
				deleted += Number(result.numDeletedRows ?? 0);
				await trx.deleteFrom("_emdash_media_usage").where("source_key", "in", sourceKeyBatch).execute();
			}
			return deleted;
		});
	}
	async deleteSourceGenerationOccurrences(db, sourceKey, generation) {
		await db.deleteFrom("_emdash_media_usage").where("source_key", "=", sourceKey).where("generation", "=", generation).execute();
	}
	async insertOccurrences(db, sourceKey, generation, occurrences, now) {
		if (occurrences.length === 0) return;
		const rows = occurrences.map((occurrence) => ({
			id: ulid(),
			source_key: sourceKey,
			generation,
			field_slug: occurrence.fieldSlug,
			field_path: occurrence.fieldPath,
			occurrence_index: occurrence.occurrenceIndex ?? 0,
			reference_type: occurrence.referenceType,
			media_id: occurrence.mediaId,
			provider: occurrence.provider,
			provider_asset_id: occurrence.providerAssetId,
			media_kind: occurrence.mediaKind ?? null,
			mime_type: occurrence.mimeType ?? null,
			created_at: now
		}));
		for (const rowBatch of chunks(rows, OCCURRENCE_INSERT_BATCH_SIZE)) await db.insertInto("_emdash_media_usage").values(rowBatch).execute();
	}
	async upsertSource(db, source, generation, now) {
		const row = this.buildSourceRow(source, generation, now);
		await db.insertInto("_emdash_media_usage_sources").values(row).onConflict((oc) => oc.column("source_key").doUpdateSet(this.sourceUpdateSet(row))).execute();
	}
	async insertSourceIfAbsent(db, row) {
		return ((await db.insertInto("_emdash_media_usage_sources").values(row).onConflict((oc) => oc.column("source_key").doNothing()).executeTakeFirst()).numInsertedOrUpdatedRows ?? 0n) > 0n;
	}
	async updateSourceIfGeneration(db, row, expectedCurrentGeneration) {
		const result = await db.updateTable("_emdash_media_usage_sources").set(this.sourceUpdateSet(row)).where("source_key", "=", row.source_key).where("current_generation", "=", expectedCurrentGeneration).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	async updateSourceIfMatching(db, row, expectedSource) {
		const result = await db.updateTable("_emdash_media_usage_sources").set(this.sourceUpdateSet(row)).where("source_key", "=", row.source_key).where(this.sourceMatchExpression(expectedSource)).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	async updateAttemptedSourceIfMatching(db, source, row, expectedSource) {
		const result = await db.updateTable("_emdash_media_usage_sources").set(this.attemptedSourceUpdateSet(source, row)).where("source_key", "=", row.source_key).where(this.sourceMatchExpression(expectedSource)).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	sourceMatchExpression(expectedSource) {
		return (eb) => eb.and([
			eb("current_generation", "=", expectedSource.currentGeneration),
			eb("source_completeness", "=", expectedSource.sourceCompleteness),
			this.nullableStringExpression(eb, "updated_at", expectedSource.updatedAt),
			this.nullableStringExpression(eb, "source_fingerprint", expectedSource.sourceFingerprint),
			this.nullableStringExpression(eb, "source_updated_at", expectedSource.sourceUpdatedAt),
			this.nullableNumberExpression(eb, "source_version", expectedSource.sourceVersion),
			this.nullableStringExpression(eb, "revision_id", expectedSource.revisionId),
			this.nullableStringExpression(eb, "last_attempted_at", expectedSource.lastAttemptedAt),
			this.nullableStringExpression(eb, "last_error_code", expectedSource.lastErrorCode)
		]);
	}
	nullableStringExpression(eb, column, value) {
		return value === null ? eb(column, "is", null) : eb(column, "=", value);
	}
	nullableNumberExpression(eb, column, value) {
		return value === null ? eb(column, "is", null) : eb(column, "=", value);
	}
	async contentRowExists(tableName, contentId) {
		return (await sql`
			SELECT id
			FROM ${sql.ref(tableName)}
			WHERE id = ${contentId}
			LIMIT 1
		`.execute(this.db)).rows.length > 0;
	}
	buildSourceRow(source, generation, now) {
		return {
			source_key: source.sourceKey,
			source_type: source.sourceType,
			collection_slug: source.collectionSlug ?? null,
			content_id: source.contentId ?? null,
			source_variant: source.sourceVariant,
			locale: source.locale ?? null,
			translation_group: source.translationGroup ?? null,
			content_slug: source.contentSlug ?? null,
			content_title: source.contentTitle ?? null,
			content_status: source.contentStatus ?? null,
			content_scheduled_at: source.contentScheduledAt ?? null,
			content_deleted_at: source.contentDeletedAt ?? null,
			revision_id: source.revisionId ?? null,
			current_generation: generation,
			schema_version: source.schemaVersion ?? 1,
			source_updated_at: source.sourceUpdatedAt ?? null,
			source_version: source.sourceVersion ?? null,
			source_fingerprint: source.sourceFingerprint ?? null,
			source_completeness: source.sourceCompleteness ?? "complete",
			last_attempted_at: source.lastAttemptedAt ?? now,
			last_error_code: null,
			indexed_at: now,
			updated_at: now
		};
	}
	buildAttemptedSourceRow(source, now) {
		return {
			source_key: source.sourceKey,
			source_type: source.sourceType,
			collection_slug: source.collectionSlug ?? null,
			content_id: source.contentId ?? null,
			source_variant: source.sourceVariant,
			locale: source.locale ?? null,
			translation_group: source.translationGroup ?? null,
			content_slug: source.contentSlug ?? null,
			content_title: source.contentTitle ?? null,
			content_status: source.contentStatus ?? null,
			content_scheduled_at: source.contentScheduledAt ?? null,
			content_deleted_at: source.contentDeletedAt ?? null,
			revision_id: source.revisionId ?? null,
			current_generation: ulid(),
			schema_version: source.schemaVersion ?? 1,
			source_updated_at: source.sourceUpdatedAt ?? null,
			source_version: source.sourceVersion ?? null,
			source_fingerprint: source.sourceFingerprint ?? null,
			source_completeness: source.sourceCompleteness ?? (source.lastErrorCode ? "failed" : "unknown"),
			last_attempted_at: source.lastAttemptedAt ?? now,
			last_error_code: source.lastErrorCode ?? null,
			indexed_at: now,
			updated_at: now
		};
	}
	attemptedSourceUpdateSet(source, row) {
		const updates = {
			source_type: row.source_type,
			source_variant: row.source_variant,
			source_completeness: row.source_completeness,
			last_attempted_at: row.last_attempted_at,
			last_error_code: row.last_error_code,
			updated_at: row.updated_at
		};
		if (source.collectionSlug !== void 0) updates.collection_slug = row.collection_slug;
		if (source.contentId !== void 0) updates.content_id = row.content_id;
		if (source.locale !== void 0) updates.locale = row.locale;
		if (source.translationGroup !== void 0) updates.translation_group = row.translation_group;
		if (source.contentSlug !== void 0) updates.content_slug = row.content_slug;
		if (source.contentTitle !== void 0) updates.content_title = row.content_title;
		if (source.contentStatus !== void 0) updates.content_status = row.content_status;
		if (source.contentScheduledAt !== void 0) updates.content_scheduled_at = row.content_scheduled_at;
		if (source.contentDeletedAt !== void 0) updates.content_deleted_at = row.content_deleted_at;
		if (source.revisionId !== void 0) updates.revision_id = row.revision_id;
		if (source.schemaVersion !== void 0) updates.schema_version = row.schema_version;
		if (source.sourceUpdatedAt !== void 0) updates.source_updated_at = row.source_updated_at;
		if (source.sourceVersion !== void 0) updates.source_version = row.source_version;
		if (source.sourceFingerprint !== void 0) updates.source_fingerprint = row.source_fingerprint;
		return updates;
	}
	sourceUpdateSet(row) {
		return {
			source_type: row.source_type,
			collection_slug: row.collection_slug,
			content_id: row.content_id,
			source_variant: row.source_variant,
			locale: row.locale,
			translation_group: row.translation_group,
			content_slug: row.content_slug,
			content_title: row.content_title,
			content_status: row.content_status,
			content_scheduled_at: row.content_scheduled_at,
			content_deleted_at: row.content_deleted_at,
			revision_id: row.revision_id,
			current_generation: row.current_generation,
			schema_version: row.schema_version,
			source_updated_at: row.source_updated_at,
			source_version: row.source_version,
			source_fingerprint: row.source_fingerprint,
			source_completeness: row.source_completeness,
			last_attempted_at: row.last_attempted_at,
			last_error_code: row.last_error_code,
			indexed_at: row.indexed_at,
			updated_at: row.updated_at
		};
	}
};
var currentUsageSelect = [
	"s.source_key as source_key",
	"s.source_type as source_type",
	"s.collection_slug as collection_slug",
	"s.content_id as content_id",
	"s.source_variant as source_variant",
	"s.locale as locale",
	"s.translation_group as translation_group",
	"s.content_slug as content_slug",
	"s.content_title as content_title",
	"s.content_status as content_status",
	"s.content_scheduled_at as content_scheduled_at",
	"s.content_deleted_at as content_deleted_at",
	"s.revision_id as revision_id",
	"s.current_generation as current_generation",
	"s.schema_version as schema_version",
	"s.source_updated_at as source_updated_at",
	"s.source_version as source_version",
	"s.source_fingerprint as source_fingerprint",
	"s.source_completeness as source_completeness",
	"s.last_attempted_at as last_attempted_at",
	"s.last_error_code as last_error_code",
	"s.indexed_at as indexed_at",
	"s.created_at as source_created_at",
	"s.updated_at as source_row_updated_at",
	"u.id as occurrence_id",
	"u.generation as generation",
	"u.field_slug as field_slug",
	"u.field_path as field_path",
	"u.occurrence_index as occurrence_index",
	"u.reference_type as reference_type",
	"u.media_id as media_id",
	"u.provider as provider",
	"u.provider_asset_id as provider_asset_id",
	"u.media_kind as media_kind",
	"u.mime_type as mime_type",
	"u.created_at as occurrence_created_at"
];
function groupUsageRows(rows) {
	const groups = [];
	for (const row of rows) {
		if (row.collection_slug === null || row.content_id === null) continue;
		const record = rowToUsageRecord(row);
		let group = groups.at(-1);
		if (!group || group.collectionSlug !== row.collection_slug || group.contentId !== row.content_id) {
			group = {
				collectionSlug: row.collection_slug,
				contentId: row.content_id,
				contentDeletedAt: row.entry_deleted_at,
				sources: []
			};
			groups.push(group);
		}
		let source = group.sources.at(-1);
		if (!source || source.source.sourceKey !== record.source.sourceKey) {
			source = {
				source: record.source,
				occurrences: []
			};
			group.sources.push(source);
		}
		source.occurrences.push(record.occurrence);
	}
	return groups;
}
function rowToSource(row) {
	return {
		sourceKey: row.source_key,
		sourceType: row.source_type,
		collectionSlug: row.collection_slug,
		contentId: row.content_id,
		sourceVariant: row.source_variant,
		locale: row.locale,
		translationGroup: row.translation_group,
		contentSlug: row.content_slug,
		contentTitle: row.content_title,
		contentStatus: row.content_status,
		contentScheduledAt: row.content_scheduled_at,
		contentDeletedAt: row.content_deleted_at,
		revisionId: row.revision_id,
		currentGeneration: row.current_generation,
		schemaVersion: Number(row.schema_version),
		sourceUpdatedAt: row.source_updated_at,
		sourceVersion: row.source_version === null ? null : Number(row.source_version),
		sourceFingerprint: row.source_fingerprint,
		sourceCompleteness: row.source_completeness,
		lastAttemptedAt: row.last_attempted_at,
		lastErrorCode: row.last_error_code,
		indexedAt: row.indexed_at,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function rowToOccurrence(row) {
	return {
		id: row.id,
		sourceKey: row.source_key,
		generation: row.generation,
		fieldSlug: row.field_slug,
		fieldPath: row.field_path,
		occurrenceIndex: Number(row.occurrence_index),
		referenceType: row.reference_type,
		mediaId: row.media_id,
		provider: row.provider,
		providerAssetId: row.provider_asset_id,
		mediaKind: row.media_kind,
		mimeType: row.mime_type,
		createdAt: row.created_at
	};
}
function rowToUsageRecord(row) {
	return {
		source: rowToSource({
			source_key: row.source_key,
			source_type: row.source_type,
			collection_slug: row.collection_slug,
			content_id: row.content_id,
			source_variant: row.source_variant,
			locale: row.locale,
			translation_group: row.translation_group,
			content_slug: row.content_slug,
			content_title: row.content_title,
			content_status: row.content_status,
			content_scheduled_at: row.content_scheduled_at,
			content_deleted_at: row.content_deleted_at,
			revision_id: row.revision_id,
			current_generation: row.current_generation,
			schema_version: row.schema_version,
			source_updated_at: row.source_updated_at,
			source_version: row.source_version,
			source_fingerprint: row.source_fingerprint,
			source_completeness: row.source_completeness,
			last_attempted_at: row.last_attempted_at,
			last_error_code: row.last_error_code,
			indexed_at: row.indexed_at,
			created_at: row.source_created_at,
			updated_at: row.source_row_updated_at
		}),
		occurrence: rowToOccurrence({
			id: row.occurrence_id,
			source_key: row.source_key,
			generation: row.generation,
			field_slug: row.field_slug,
			field_path: row.field_path,
			occurrence_index: row.occurrence_index,
			reference_type: row.reference_type,
			media_id: row.media_id,
			provider: row.provider,
			provider_asset_id: row.provider_asset_id,
			media_kind: row.media_kind,
			mime_type: row.mime_type,
			created_at: row.occurrence_created_at
		})
	};
}
function rowToIndexStatus(row) {
	return {
		adapterId: row.adapter_id,
		scopeType: row.scope_type,
		scopeKey: row.scope_key,
		status: row.status,
		schemaVersion: Number(row.schema_version),
		startedAt: row.started_at,
		completedAt: row.completed_at,
		cursor: row.cursor,
		indexedSourceCount: Number(row.indexed_source_count),
		failedSourceCount: Number(row.failed_source_count),
		lastErrorCode: row.last_error_code,
		updatedAt: row.updated_at
	};
}
var MediaUsageFieldDiscoveryError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "MediaUsageFieldDiscoveryError";
	}
};
var DISPLAY_FIELD_SLUGS = ["title", "name"];
var SUPPORTED_TOP_LEVEL_TYPES = [
	"file",
	"image",
	"portableText"
];
async function loadContentMediaUsageFields(db, collectionSlug) {
	validateIdentifier(collectionSlug, "collection slug");
	const rows = await db.selectFrom("_emdash_fields").innerJoin("_emdash_collections", "_emdash_collections.id", "_emdash_fields.collection_id").select([
		"_emdash_fields.slug",
		"_emdash_fields.type",
		"_emdash_fields.validation"
	]).where("_emdash_collections.slug", "=", collectionSlug).execute();
	const extractionFields = [];
	const rowBySlug = /* @__PURE__ */ new Map();
	for (const row of rows) {
		rowBySlug.set(row.slug, row);
		if (isSupportedTopLevelType(row.type)) {
			validateIdentifier(row.slug, "media usage field slug");
			extractionFields.push({
				slug: row.slug,
				type: row.type
			});
			continue;
		}
		if (row.type === "repeater") {
			validateIdentifier(row.slug, "media usage field slug");
			const subFields = normalizeRepeaterImageSubFields(row.validation);
			if (subFields.length > 0) extractionFields.push({
				slug: row.slug,
				type: "repeater",
				validation: { subFields }
			});
		}
	}
	extractionFields.sort((a, b) => a.slug.localeCompare(b.slug));
	return {
		extractionFields,
		displayFieldSlugs: DISPLAY_FIELD_SLUGS.filter((slug) => {
			if (!rowBySlug.has(slug)) return false;
			validateIdentifier(slug, "media usage display field slug");
			return true;
		})
	};
}
function normalizeRepeaterImageSubFields(rawValidation) {
	const validation = parseValidation(rawValidation);
	if (!isRecord$2(validation) || !Array.isArray(validation.subFields)) return [];
	const subFields = [];
	for (const subField of validation.subFields) {
		if (!isRecord$2(subField) || subField.type !== "image") continue;
		if (typeof subField.slug !== "string") continue;
		validateIdentifier(subField.slug, "media usage repeater sub-field slug");
		subFields.push({
			slug: subField.slug,
			type: "image"
		});
	}
	return subFields.toSorted((a, b) => a.slug.localeCompare(b.slug));
}
function parseValidation(rawValidation) {
	if (!rawValidation) return null;
	try {
		return JSON.parse(rawValidation);
	} catch {
		throw new MediaUsageFieldDiscoveryError("Repeater field validation must be valid JSON before media usage can be discovered", "INVALID_REPEATER_VALIDATION");
	}
}
function isSupportedTopLevelType(value) {
	return SUPPORTED_TOP_LEVEL_TYPES.includes(value);
}
function isRecord$2(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
var URL_LIKE_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function extractMediaUsageOccurrences({ fields, data }) {
	const occurrences = [];
	const seen = /* @__PURE__ */ new Set();
	for (const field of fields) {
		const value = data[field.slug];
		if (field.type === "image") {
			addOccurrence(occurrences, seen, {
				fieldSlug: field.slug,
				fieldPath: field.slug,
				referenceType: "image_field",
				value,
				fallbackKind: "image"
			});
			continue;
		}
		if (field.type === "file") {
			addOccurrence(occurrences, seen, {
				fieldSlug: field.slug,
				fieldPath: field.slug,
				referenceType: "file_field",
				value,
				fallbackKind: null
			});
			continue;
		}
		if (field.type === "repeater") {
			extractRepeaterOccurrences(occurrences, seen, field.slug, value, field.validation?.subFields);
			continue;
		}
		if (field.type === "portableText") extractPortableTextOccurrences(occurrences, seen, field.slug, value);
	}
	return occurrences;
}
function extractRepeaterOccurrences(occurrences, seen, fieldSlug, value, subFields) {
	if (!Array.isArray(value) || !Array.isArray(subFields)) return;
	for (const [itemIndex, item] of value.entries()) {
		if (!isRecord$1(item)) continue;
		for (const subField of subFields) {
			if (subField.type !== "image") continue;
			addOccurrence(occurrences, seen, {
				fieldSlug,
				fieldPath: `${fieldSlug}[${itemIndex}].${subField.slug}`,
				referenceType: "image_field",
				value: item[subField.slug],
				fallbackKind: "image"
			});
		}
	}
}
function extractPortableTextOccurrences(occurrences, seen, fieldSlug, value) {
	if (!Array.isArray(value)) return;
	for (const [blockIndex, block] of value.entries()) {
		if (!isRecord$1(block) || block._type !== "image" || !isRecord$1(block.asset)) continue;
		const provider = normalizeProvider(block.asset.provider);
		const ref = readPortableTextAssetRef(block.asset, provider);
		if (!ref) continue;
		addRefOccurrence(occurrences, seen, {
			fieldSlug,
			fieldPath: `${fieldSlug}[${blockIndex}].asset.${ref.key}`,
			referenceType: "portable_text_image",
			ref: buildMediaRef({
				id: ref.id,
				provider,
				mimeType: normalizeMimeValue(block.asset.mimeType),
				fallbackKind: "image"
			})
		});
	}
}
function addOccurrence(occurrences, seen, input) {
	const ref = readMediaRef(input.value, input.fallbackKind);
	if (!ref) return;
	addRefOccurrence(occurrences, seen, {
		fieldSlug: input.fieldSlug,
		fieldPath: input.fieldPath,
		referenceType: input.referenceType,
		ref
	});
}
function addRefOccurrence(occurrences, seen, input) {
	if (!input.ref) return;
	const occurrence = {
		fieldSlug: input.fieldSlug,
		fieldPath: input.fieldPath,
		occurrenceIndex: 0,
		referenceType: input.referenceType,
		mediaId: input.ref.mediaId,
		provider: input.ref.provider,
		providerAssetId: input.ref.providerAssetId,
		mediaKind: input.ref.mediaKind,
		mimeType: input.ref.mimeType
	};
	const key = [
		occurrence.fieldSlug,
		occurrence.fieldPath,
		occurrence.occurrenceIndex,
		occurrence.referenceType,
		occurrence.provider,
		occurrence.providerAssetId,
		occurrence.mediaId ?? ""
	].join("\0");
	if (seen.has(key)) return;
	seen.add(key);
	occurrences.push(occurrence);
}
function readMediaRef(value, fallbackKind) {
	if (typeof value === "string") {
		const id = normalizeLocalMediaId(value);
		return id ? buildMediaRef({
			id,
			provider: "local",
			mimeType: null,
			fallbackKind
		}) : null;
	}
	if (!isRecord$1(value)) return null;
	const provider = normalizeProvider(value.provider);
	const id = provider === "local" ? normalizeLocalMediaId(value.id) : normalizeStableId(value.id);
	if (!id) return null;
	return buildMediaRef({
		id,
		provider,
		mimeType: normalizeMimeValue(value.mimeType),
		fallbackKind
	});
}
function buildMediaRef(input) {
	const provider = normalizeProvider(input.provider);
	if (provider === "external") return null;
	return {
		mediaId: provider === "local" ? input.id : null,
		provider,
		providerAssetId: input.id,
		mediaKind: mediaKindFromMime(input.mimeType) ?? input.fallbackKind,
		mimeType: input.mimeType
	};
}
function readPortableTextAssetRef(asset, provider) {
	const normalizeId = provider === "local" ? normalizeLocalMediaId : normalizeStableId;
	const ref = normalizeId(asset._ref);
	if (ref) return {
		key: "_ref",
		id: ref
	};
	const id = normalizeId(asset.id);
	if (id) return {
		key: "id",
		id
	};
	return null;
}
function normalizeProvider(value) {
	return readString$1(value)?.trim() || "local";
}
function normalizeLocalMediaId(value) {
	const id = normalizeStableId(value);
	if (!id) return null;
	return id.includes("/") ? null : id;
}
function normalizeStableId(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	if (URL_LIKE_RE.test(trimmed)) return null;
	if (trimmed.startsWith("/_emdash/api/media/file/")) return null;
	return trimmed;
}
function normalizeMimeValue(value) {
	if (typeof value !== "string") return null;
	const normalized = normalizeMime(value);
	return normalized.includes("/") ? normalized : null;
}
function mediaKindFromMime(mimeType) {
	if (!mimeType) return null;
	if (mimeType.startsWith("image/")) return "image";
	if (mimeType.startsWith("video/")) return "video";
	if (mimeType.startsWith("audio/")) return "audio";
	if (mimeType.startsWith("font/") || mimeType.startsWith("application/font-")) return "font";
	if (mimeType.startsWith("text/")) return "text";
	if (isDocumentMime(mimeType)) return "document";
	if (isArchiveMime(mimeType)) return "archive";
	return "other";
}
function isDocumentMime(mimeType) {
	return mimeType === "application/pdf" || mimeType === "application/msword" || mimeType === "application/rtf" || mimeType === "application/vnd.ms-excel" || mimeType === "application/vnd.ms-powerpoint" || mimeType.startsWith("application/vnd.openxmlformats-officedocument.");
}
function isArchiveMime(mimeType) {
	return mimeType === "application/zip" || mimeType === "application/gzip" || mimeType === "application/x-tar" || mimeType === "application/x-7z-compressed" || mimeType === "application/x-rar-compressed" || mimeType === "application/vnd.rar";
}
function readString$1(value) {
	return typeof value === "string" ? value : null;
}
function isRecord$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
var MEDIA_USAGE_CONTENT_SOURCE_VARIANTS = ["columns", "draft_overlay"];
function buildContentMediaUsageSourceKey(input) {
	return `content:${input.collectionSlug}:${input.contentId}:${input.sourceVariant}`;
}
var CONTENT_SYSTEM_COLUMNS = [
	"id",
	"slug",
	"status",
	"created_at",
	"updated_at",
	"published_at",
	"scheduled_at",
	"deleted_at",
	"version",
	"live_revision_id",
	"draft_revision_id",
	"locale",
	"translation_group"
];
async function loadContentMediaUsageSnapshots(db, collectionSlug, contentId, fieldDiscovery) {
	validateIdentifier(collectionSlug, "collection slug");
	const discovery = fieldDiscovery ?? await loadContentMediaUsageFields(db, collectionSlug);
	const row = await loadContentRow(db, collectionSlug, contentId, [...discovery.extractionFields.map((field) => field.slug), ...discovery.displayFieldSlugs]);
	if (!row) return {
		success: false,
		error: "CONTENT_NOT_FOUND"
	};
	const columnsData = projectData(row, discovery.extractionFields.map((field) => field.slug));
	const displayData = projectRawData(row, discovery.displayFieldSlugs);
	const occurrences = extractMediaUsageOccurrences({
		fields: discovery.extractionFields,
		data: columnsData
	});
	const columnsRevisionId = readNullableString(row.live_revision_id);
	const snapshots = [{
		source: buildContentSource({
			collectionSlug,
			row,
			displayData,
			sourceVariant: "columns",
			revisionId: columnsRevisionId,
			sourceFingerprint: await buildSourceFingerprint({
				collectionSlug,
				sourceVariant: "columns",
				revisionId: columnsRevisionId,
				fields: discovery.extractionFields,
				data: columnsData
			})
		}),
		occurrences,
		fields: discovery.extractionFields
	}];
	const draftRevisionId = readNullableString(row.draft_revision_id);
	if (draftRevisionId) {
		const attemptedDraftSource = buildContentSource({
			collectionSlug,
			row,
			displayData,
			sourceVariant: "draft_overlay",
			revisionId: draftRevisionId
		});
		const revisionResult = await loadRevisionRow(db, draftRevisionId);
		if (!revisionResult) return {
			success: false,
			error: "DRAFT_REVISION_NOT_FOUND",
			source: attemptedDraftSource,
			snapshots
		};
		if (!revisionResult.success) return {
			success: false,
			error: "DRAFT_REVISION_INVALID",
			source: attemptedDraftSource,
			snapshots
		};
		const revision = revisionResult.revision;
		if (revision.collection !== collectionSlug || revision.entryId !== row.id) return {
			success: false,
			error: "DRAFT_REVISION_MISMATCH",
			source: attemptedDraftSource,
			snapshots
		};
		const revisionData = stripRevisionMetadata(revision.data);
		const draftOverlayData = {
			...columnsData,
			...revisionData
		};
		const draftDisplayData = {
			...displayData,
			...projectPresentData(revisionData, discovery.displayFieldSlugs)
		};
		const draftContentSlug = readNullableString(revision.data._slug) ?? readNullableString(row.slug);
		const draftFingerprint = await buildSourceFingerprint({
			collectionSlug,
			sourceVariant: "draft_overlay",
			revisionId: draftRevisionId,
			fields: discovery.extractionFields,
			data: draftOverlayData
		});
		snapshots.push({
			source: buildContentSource({
				collectionSlug,
				row,
				displayData: draftDisplayData,
				sourceVariant: "draft_overlay",
				revisionId: draftRevisionId,
				contentSlug: draftContentSlug,
				sourceFingerprint: draftFingerprint
			}),
			occurrences: extractMediaUsageOccurrences({
				fields: discovery.extractionFields,
				data: draftOverlayData
			}),
			fields: discovery.extractionFields
		});
	}
	return {
		success: true,
		snapshots
	};
}
async function loadContentRow(db, collectionSlug, contentId, fieldSlugs) {
	const tableName = getContentTableName(collectionSlug);
	const columnRefs = uniqueColumns([...CONTENT_SYSTEM_COLUMNS, ...fieldSlugs]).map((column) => sql.ref(column));
	return (await sql`
		SELECT ${sql.join(columnRefs, sql`, `)}
		FROM ${sql.ref(tableName)}
		WHERE id = ${contentId}
		LIMIT 1
	`.execute(db)).rows[0] ?? null;
}
async function loadRevisionRow(db, revisionId) {
	const row = await db.selectFrom("revisions").select([
		"id",
		"collection",
		"entry_id",
		"data"
	]).where("id", "=", revisionId).executeTakeFirst();
	if (!row) return null;
	const data = parseRevisionData(row.data);
	if (!data) return { success: false };
	return {
		success: true,
		revision: {
			id: row.id,
			collection: row.collection,
			entryId: row.entry_id,
			data
		}
	};
}
function buildContentSource(input) {
	const { collectionSlug, row, displayData, sourceVariant, revisionId } = input;
	const contentId = readString(row.id) ?? "";
	const contentSlug = input.contentSlug ?? readNullableString(row.slug);
	const source = {
		sourceKey: buildContentMediaUsageSourceKey({
			collectionSlug,
			contentId,
			sourceVariant
		}),
		sourceType: "content",
		collectionSlug,
		contentId,
		sourceVariant,
		locale: readNullableString(row.locale),
		translationGroup: readNullableString(row.translation_group),
		contentSlug,
		contentTitle: deriveContentTitle(displayData, contentSlug, contentId),
		contentStatus: readNullableString(row.status),
		contentScheduledAt: readNullableString(row.scheduled_at),
		contentDeletedAt: readNullableString(row.deleted_at),
		revisionId,
		schemaVersion: 1,
		sourceUpdatedAt: readNullableString(row.updated_at),
		sourceVersion: readNumber(row.version)
	};
	if (input.sourceFingerprint !== void 0) source.sourceFingerprint = input.sourceFingerprint;
	return source;
}
async function buildSourceFingerprint(input) {
	return hashString(canonicalJson({
		schemaVersion: 1,
		collectionSlug: input.collectionSlug,
		sourceVariant: input.sourceVariant,
		fields: normalizeFingerprintFields(input.fields),
		values: projectFingerprintData(input.data, input.fields),
		revisionId: input.sourceVariant === "draft_overlay" ? input.revisionId : null
	}));
}
function normalizeFingerprintFields(fields) {
	return fields.map((field) => {
		if (field.type !== "repeater") return {
			slug: field.slug,
			type: field.type
		};
		return {
			slug: field.slug,
			type: field.type,
			subFields: (field.validation?.subFields ?? []).map((subField) => ({
				slug: subField.slug,
				type: subField.type
			})).toSorted((a, b) => a.slug.localeCompare(b.slug))
		};
	}).toSorted((a, b) => String(a.slug).localeCompare(String(b.slug)));
}
function projectFingerprintData(data, fields) {
	const projected = {};
	for (const field of fields) projected[field.slug] = Object.hasOwn(data, field.slug) ? data[field.slug] : null;
	return projected;
}
function canonicalJson(value) {
	return JSON.stringify(canonicalize(value));
}
function canonicalize(value) {
	if (value === void 0) return null;
	if (typeof value === "bigint") return value.toString();
	if (typeof value === "number") return Number.isFinite(value) ? value : null;
	if (Array.isArray(value)) return value.map((item) => canonicalize(item));
	if (!isRecord(value)) return value;
	const canonical = {};
	for (const key of Object.keys(value).toSorted()) canonical[key] = canonicalize(value[key]);
	return canonical;
}
function projectData(row, fieldSlugs) {
	const data = {};
	for (const fieldSlug of fieldSlugs) data[fieldSlug] = deserializeValue(row[fieldSlug] ?? null);
	return data;
}
function projectRawData(row, fieldSlugs) {
	const data = {};
	for (const fieldSlug of fieldSlugs) data[fieldSlug] = row[fieldSlug] ?? null;
	return data;
}
function projectPresentData(row, fieldSlugs) {
	const data = {};
	for (const fieldSlug of fieldSlugs) if (Object.hasOwn(row, fieldSlug)) data[fieldSlug] = row[fieldSlug];
	return data;
}
function uniqueColumns(columns) {
	const unique = [...new Set(columns)];
	for (const column of unique) validateIdentifier(column, "content media usage column");
	return unique;
}
function getContentTableName(collectionSlug) {
	validateIdentifier(collectionSlug, "collection slug");
	return `ec_${collectionSlug}`;
}
function deserializeValue(value) {
	if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) try {
		return JSON.parse(value);
	} catch {
		return value;
	}
	return value;
}
function parseRevisionData(value) {
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
	return isRecord(value) ? value : null;
}
function stripRevisionMetadata(data) {
	const stripped = {};
	for (const [key, value] of Object.entries(data)) if (!key.startsWith("_")) stripped[key] = value;
	return stripped;
}
function deriveContentTitle(displayData, contentSlug, contentId) {
	for (const fieldSlug of ["title", "name"]) {
		const value = displayData[fieldSlug];
		if (typeof value === "string" && value.trim()) return value;
	}
	return contentSlug ?? contentId;
}
function readString(value) {
	return typeof value === "string" ? value : null;
}
function readNullableString(value) {
	return value === null || value === void 0 ? null : readString(value);
}
function readNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "bigint") return Number(value);
	if (typeof value === "string" && value) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
var CONTENT_MEDIA_USAGE_ADAPTER_ID = "content-media";
var CONTENT_MEDIA_USAGE_COLLECTION_SCOPE = "collection";
var CONTENT_USAGE_LOCKS_KEY = Symbol.for("emdash.mediaUsage.contentLocks");
var CONTENT_USAGE_COLLECTION_LOCKS_KEY = Symbol.for("emdash.mediaUsage.collectionLocks");
var CONTENT_USAGE_REFRESH_MAX_ATTEMPTS = 2;
var ZERO_RESULT = {
	success: true,
	refreshedSourceCount: 0,
	deletedSourceCount: 0,
	failedSourceCount: 0
};
async function refreshContentMediaUsage(db, collectionSlug, contentId) {
	validateIdentifier(collectionSlug, "collection slug");
	return withContentUsageCollectionLock(collectionSlug, () => withContentUsageLock(collectionSlug, contentId, () => refreshContentMediaUsageUnlocked(db, collectionSlug, contentId)));
}
async function refreshContentMediaUsageUnlocked(db, collectionSlug, contentId) {
	try {
		let conflictResult = null;
		for (let attempt = 0; attempt < CONTENT_USAGE_REFRESH_MAX_ATTEMPTS; attempt++) {
			const result = await refreshContentMediaUsageAttempt(db, collectionSlug, contentId);
			if (result.errorCode !== "CONTENT_USAGE_GENERATION_CONFLICT") return result;
			conflictResult = result;
		}
		return markGenerationConflict(db, collectionSlug, {
			refreshedSourceCount: conflictResult?.refreshedSourceCount ?? 0,
			deletedSourceCount: conflictResult?.deletedSourceCount ?? 0
		});
	} catch (error) {
		console.error(`[media-usage] Failed to refresh ${collectionSlug}/${contentId}:`, error);
		await markContentMediaUsageCollectionStaleSafely(db, collectionSlug, "CONTENT_USAGE_REFRESH_ERROR");
		return {
			success: false,
			refreshedSourceCount: 0,
			deletedSourceCount: 0,
			failedSourceCount: 0,
			errorCode: "CONTENT_USAGE_REFRESH_ERROR"
		};
	}
}
async function refreshContentMediaUsageAttempt(db, collectionSlug, contentId) {
	const repo = new MediaUsageRepository(db);
	const observedGenerations = await loadObservedContentSourceGenerations(db, collectionSlug, contentId);
	const snapshotsResult = await loadContentMediaUsageSnapshots(db, collectionSlug, contentId);
	if (!snapshotsResult.success) return markSnapshotFailure(db, collectionSlug, snapshotsResult);
	if (!await contentCollectionExists(db, collectionSlug)) {
		const deletedSourceCount = await repo.deleteContentSources(collectionSlug, contentId);
		return {
			...ZERO_RESULT,
			deletedSourceCount
		};
	}
	let refreshedSourceCount = 0;
	for (const snapshot of snapshotsResult.snapshots) {
		if (!(await repo.replaceSourceIfCurrent(snapshot.source, snapshot.occurrences, observedGenerations.get(snapshot.source.sourceKey) ?? null)).replaced) return generationConflictResult({
			refreshedSourceCount,
			deletedSourceCount: 0
		});
		refreshedSourceCount++;
	}
	if (!await contentCollectionExists(db, collectionSlug)) {
		const deletedSourceCount = await repo.deleteContentSources(collectionSlug, contentId);
		return {
			...ZERO_RESULT,
			deletedSourceCount
		};
	}
	const expectedSourceKeys = new Set(snapshotsResult.snapshots.map((snapshot) => snapshot.source.sourceKey));
	const absentSourceKeys = MEDIA_USAGE_CONTENT_SOURCE_VARIANTS.map((sourceVariant) => buildContentMediaUsageSourceKey({
		collectionSlug,
		contentId,
		sourceVariant
	})).filter((sourceKey) => !expectedSourceKeys.has(sourceKey));
	let deletedSourceCount = 0;
	for (const sourceKey of absentSourceKeys) {
		const expectedGeneration = observedGenerations.get(sourceKey) ?? null;
		if (expectedGeneration === null) continue;
		const result = await repo.deleteSourceIfCurrent(sourceKey, expectedGeneration);
		if (result.deleted) {
			deletedSourceCount++;
			continue;
		}
		if (result.source) return generationConflictResult({
			refreshedSourceCount,
			deletedSourceCount
		});
	}
	return {
		success: true,
		refreshedSourceCount,
		deletedSourceCount,
		failedSourceCount: 0
	};
}
async function loadObservedContentSourceGenerations(db, collectionSlug, contentId) {
	const generations = /* @__PURE__ */ new Map();
	const sourceKeys = MEDIA_USAGE_CONTENT_SOURCE_VARIANTS.map((sourceVariant) => buildContentMediaUsageSourceKey({
		collectionSlug,
		contentId,
		sourceVariant
	}));
	for (const sourceKey of sourceKeys) generations.set(sourceKey, null);
	const rows = await db.selectFrom("_emdash_media_usage_sources").select(["source_key", "current_generation"]).where("source_key", "in", sourceKeys).execute();
	for (const row of rows) generations.set(row.source_key, row.current_generation);
	return generations;
}
async function markGenerationConflict(db, collectionSlug, counts) {
	await markContentMediaUsageCollectionStaleSafely(db, collectionSlug, "CONTENT_USAGE_GENERATION_CONFLICT");
	return {
		success: false,
		refreshedSourceCount: counts.refreshedSourceCount,
		deletedSourceCount: counts.deletedSourceCount,
		failedSourceCount: 0,
		errorCode: "CONTENT_USAGE_GENERATION_CONFLICT"
	};
}
function generationConflictResult(counts) {
	return {
		success: false,
		refreshedSourceCount: counts.refreshedSourceCount,
		deletedSourceCount: counts.deletedSourceCount,
		failedSourceCount: 0,
		errorCode: "CONTENT_USAGE_GENERATION_CONFLICT"
	};
}
async function contentCollectionExists(db, collectionSlug) {
	return await db.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst() !== void 0;
}
async function deleteContentMediaUsage(db, collectionSlug, contentId) {
	validateIdentifier(collectionSlug, "collection slug");
	return withContentUsageCollectionLock(collectionSlug, () => withContentUsageLock(collectionSlug, contentId, () => deleteContentMediaUsageUnlocked(db, collectionSlug, contentId)));
}
async function deleteContentMediaUsageUnlocked(db, collectionSlug, contentId) {
	try {
		const deletedSourceCount = await new MediaUsageRepository(db).deleteContentSources(collectionSlug, contentId);
		return {
			...ZERO_RESULT,
			deletedSourceCount
		};
	} catch (error) {
		console.error(`[media-usage] Failed to delete usage for ${collectionSlug}/${contentId}:`, error);
		await markContentMediaUsageCollectionStaleSafely(db, collectionSlug, "CONTENT_USAGE_DELETE_ERROR");
		return {
			success: false,
			refreshedSourceCount: 0,
			deletedSourceCount: 0,
			failedSourceCount: 0,
			errorCode: "CONTENT_USAGE_DELETE_ERROR"
		};
	}
}
async function deleteContentMediaUsageCollection(db, collectionSlug) {
	validateIdentifier(collectionSlug, "collection slug");
	return withContentUsageCollectionLock(collectionSlug, () => deleteContentMediaUsageCollectionUnlocked(db, collectionSlug));
}
async function deleteContentMediaUsageCollectionUnlocked(db, collectionSlug) {
	try {
		const repo = new MediaUsageRepository(db);
		const deletedSourceCount = await repo.deleteCollectionSources(collectionSlug);
		await repo.deleteIndexStatus({
			adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
			scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE,
			scopeKey: collectionSlug
		});
		return {
			...ZERO_RESULT,
			deletedSourceCount
		};
	} catch (error) {
		console.error(`[media-usage] Failed to delete usage for collection ${collectionSlug}:`, error);
		try {
			await new MediaUsageRepository(db).deleteIndexStatus({
				adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
				scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE,
				scopeKey: collectionSlug
			});
		} catch (statusError) {
			console.error(`[media-usage] Failed to clear usage status for deleted collection ${collectionSlug}:`, statusError);
		}
		return {
			success: false,
			refreshedSourceCount: 0,
			deletedSourceCount: 0,
			failedSourceCount: 0,
			errorCode: "CONTENT_USAGE_DELETE_ERROR"
		};
	}
}
async function refreshContentMediaUsageAfterWrite(db, collectionSlug, contentId) {
	const result = await refreshContentMediaUsage(db, collectionSlug, contentId);
	if (!result.success) console.error(`[media-usage] Usage refresh for ${collectionSlug}/${contentId} finished with ${result.errorCode}`);
}
async function markContentMediaUsageCollectionStale(db, collectionSlug, lastErrorCode) {
	validateIdentifier(collectionSlug, "collection slug");
	const repo = new MediaUsageRepository(db);
	const identity = {
		adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
		scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE,
		scopeKey: collectionSlug
	};
	const existing = await repo.findIndexStatus(identity);
	await repo.upsertIndexStatus({
		...identity,
		status: "stale",
		schemaVersion: existing?.schemaVersion ?? 1,
		startedAt: existing?.startedAt ?? null,
		completedAt: existing?.completedAt ?? null,
		cursor: existing?.cursor ?? null,
		indexedSourceCount: existing?.indexedSourceCount ?? 0,
		failedSourceCount: existing?.failedSourceCount ?? 0,
		lastErrorCode
	});
}
async function findNonTranslatableSiblingContentIds(db, collectionSlug, updatedContentId, translationGroup, updatedData) {
	if (!isI18nEnabled() || !updatedData || !translationGroup) return [];
	validateIdentifier(collectionSlug, "collection slug");
	const collection = await db.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
	if (!collection) return [];
	const touchedNonTranslatableSlugs = (await db.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("translatable", "=", 0).execute()).filter((field) => field.slug in updatedData).map((field) => field.slug);
	if (touchedNonTranslatableSlugs.length === 0) return [];
	const usageFields = await loadContentMediaUsageFields(db, collectionSlug);
	const usageRelevantSlugs = /* @__PURE__ */ new Set([...usageFields.extractionFields.map((field) => field.slug), ...usageFields.displayFieldSlugs]);
	if (!touchedNonTranslatableSlugs.some((slug) => usageRelevantSlugs.has(slug))) return [];
	const tableName = `ec_${collectionSlug}`;
	return (await sql`
		SELECT id
		FROM ${sql.ref(tableName)}
		WHERE translation_group = ${translationGroup}
		AND id != ${updatedContentId}
		ORDER BY id ASC
	`.execute(db)).rows.map((row) => row.id);
}
async function markSnapshotFailure(db, collectionSlug, result) {
	const repo = new MediaUsageRepository(db);
	if (result.source) await repo.markSourceAttempted({
		...result.source,
		sourceCompleteness: "failed",
		lastErrorCode: result.error
	});
	await markContentMediaUsageCollectionStale(db, collectionSlug, result.error);
	return {
		success: false,
		refreshedSourceCount: 0,
		deletedSourceCount: 0,
		failedSourceCount: result.source ? 1 : 0,
		errorCode: result.error
	};
}
async function markContentMediaUsageCollectionStaleSafely(db, collectionSlug, lastErrorCode) {
	try {
		await markContentMediaUsageCollectionStale(db, collectionSlug, lastErrorCode);
		return true;
	} catch (error) {
		console.error(`[media-usage] Failed to mark ${collectionSlug} stale:`, error);
		return false;
	}
}
async function withContentUsageLock(collectionSlug, contentId, fn) {
	const locks = getContentUsageLocks();
	const lockKey = `${collectionSlug}\0${contentId}`;
	const previous = locks.get(lockKey) ?? Promise.resolve();
	let releaseCurrent;
	const current = new Promise((resolve) => {
		releaseCurrent = resolve;
	});
	const next = previous.catch(() => {}).then(() => current);
	locks.set(lockKey, next);
	try {
		await previous.catch(() => {});
		return await fn();
	} finally {
		releaseCurrent();
		if (locks.get(lockKey) === next) locks.delete(lockKey);
	}
}
async function withContentUsageCollectionLock(collectionSlug, fn) {
	const locks = getContentUsageCollectionLocks();
	const previous = locks.get(collectionSlug) ?? Promise.resolve();
	let releaseCurrent;
	const current = new Promise((resolve) => {
		releaseCurrent = resolve;
	});
	const next = previous.catch(() => {}).then(() => current);
	locks.set(collectionSlug, next);
	try {
		await previous.catch(() => {});
		return await fn();
	} finally {
		releaseCurrent();
		if (locks.get(collectionSlug) === next) locks.delete(collectionSlug);
	}
}
function getContentUsageLocks() {
	const global = globalThis;
	const existing = global[CONTENT_USAGE_LOCKS_KEY];
	if (existing instanceof Map) return existing;
	const locks = /* @__PURE__ */ new Map();
	global[CONTENT_USAGE_LOCKS_KEY] = locks;
	return locks;
}
function getContentUsageCollectionLocks() {
	const global = globalThis;
	const existing = global[CONTENT_USAGE_COLLECTION_LOCKS_KEY];
	if (existing instanceof Map) return existing;
	const locks = /* @__PURE__ */ new Map();
	global[CONTENT_USAGE_COLLECTION_LOCKS_KEY] = locks;
	return locks;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/fts-manager-vncsZIJm.mjs
/**
* FTS5 Manager
*
* Handles creation, deletion, and management of FTS5 virtual tables
* for full-text search on content collections.
*/
var FTSManager = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Validate a collection slug and its searchable field names.
	* Must be called before any raw SQL interpolation.
	*/
	validateInputs(collectionSlug, searchableFields) {
		validateIdentifier(collectionSlug, "collection slug");
		if (searchableFields) for (const field of searchableFields) validateIdentifier(field, "searchable field name");
	}
	/**
	* Get the FTS table name for a collection
	* Uses _emdash_ prefix to clearly mark as internal/system table
	*/
	getFtsTableName(collectionSlug) {
		validateIdentifier(collectionSlug, "collection slug");
		return `_emdash_fts_${collectionSlug}`;
	}
	/**
	* Get the content table name for a collection
	*/
	getContentTableName(collectionSlug) {
		validateIdentifier(collectionSlug, "collection slug");
		return `ec_${collectionSlug}`;
	}
	/**
	* Check if an FTS table exists for a collection
	*/
	async ftsTableExists(collectionSlug) {
		const ftsTable = this.getFtsTableName(collectionSlug);
		return tableExists(this.db, ftsTable);
	}
	/**
	* Create an FTS5 virtual table for a collection.
	* FTS5 is SQLite-only; on other dialects this is a no-op.
	*
	* @param collectionSlug - The collection slug
	* @param searchableFields - Array of field names to index
	* @param weights - Optional field weights for ranking
	*/
	async createFtsTable(collectionSlug, searchableFields, _weights) {
		if (!isSqlite(this.db)) return;
		this.validateInputs(collectionSlug, searchableFields);
		const ftsTable = this.getFtsTableName(collectionSlug);
		const contentTable = this.getContentTableName(collectionSlug);
		const columns = [
			"id UNINDEXED",
			"locale UNINDEXED",
			...searchableFields
		].join(", ");
		await sql.raw(`
			CREATE VIRTUAL TABLE IF NOT EXISTS "${ftsTable}" USING fts5(
				${columns},
				content='${contentTable}',
				content_rowid='rowid',
				tokenize='porter unicode61'
			)
		`).execute(this.db);
		await this.createTriggers(collectionSlug, searchableFields);
	}
	/**
	* Create triggers to keep FTS table in sync with content table.
	*
	* The insert and update triggers only add rows to the FTS index when
	* `deleted_at IS NULL`. This keeps soft-deleted content out of the
	* search index and ensures the FTS row count matches the non-deleted
	* content count (which `verifyAndRepairIndex` relies on).
	*
	* IMPORTANT: The FTS5 virtual table is created with `content='ec_<slug>'`
	* which makes it an *external content* FTS5 table. For external-content
	* tables, removing a row must use the documented `'delete'` command and
	* supply the OLD column values explicitly, e.g.:
	*
	*     INSERT INTO fts(fts, rowid, col1, col2)
	*     VALUES('delete', OLD.rowid, OLD.col1, OLD.col2);
	*
	* Using `DELETE FROM fts WHERE rowid = OLD.rowid` is the correct form
	* for *contentless* tables but is unsafe for external-content tables:
	* FTS5 then reads column values from the backing content table, which
	* in an AFTER UPDATE trigger already holds the NEW values. The wrong
	* tokens get removed and the inverted index drifts out of sync until
	* SQLite raises `SQLITE_CORRUPT_VTAB` on the next mutation. See
	* https://www.sqlite.org/fts5.html#external_content_tables.
	*
	* The UPDATE and DELETE triggers gate the `'delete'` on
	* `OLD.deleted_at IS NULL` because the INSERT trigger never indexed
	* rows that were already soft-deleted. Issuing `'delete'` for a rowid
	* that was never inserted into the FTS index is itself a corruption
	* trigger -- FTS5's `'delete'` is not a no-op on missing rowids and
	* raises `SQLITE_CORRUPT_VTAB`. Affected paths include restore-from-
	* trash (UPDATE where `OLD.deleted_at IS NOT NULL`), permanent-delete
	* from trash (DELETE on a soft-deleted row), and any edit on a row
	* that's currently in the trash.
	*/
	async createTriggers(collectionSlug, searchableFields) {
		this.validateInputs(collectionSlug, searchableFields);
		if (searchableFields.length === 0) throw new Error(`Cannot create FTS triggers for collection "${collectionSlug}": no searchable fields. Mark at least one field as searchable before enabling search.`);
		const ftsTable = this.getFtsTableName(collectionSlug);
		const contentTable = this.getContentTableName(collectionSlug);
		const fieldList = searchableFields.join(", ");
		const newFieldList = searchableFields.map((f) => `NEW.${f}`).join(", ");
		const oldFieldList = searchableFields.map((f) => `OLD.${f}`).join(", ");
		await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_insert" 
			AFTER INSERT ON "${contentTable}" 
			WHEN NEW.deleted_at IS NULL
			BEGIN
				INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
				VALUES (NEW.rowid, NEW.id, NEW.locale, ${newFieldList});
			END
		`).execute(this.db);
		await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_update" 
			AFTER UPDATE ON "${contentTable}" 
			BEGIN
				INSERT INTO "${ftsTable}"("${ftsTable}", rowid, id, locale, ${fieldList})
				SELECT 'delete', OLD.rowid, OLD.id, OLD.locale, ${oldFieldList}
				WHERE OLD.deleted_at IS NULL;
				INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
				SELECT NEW.rowid, NEW.id, NEW.locale, ${newFieldList}
				WHERE NEW.deleted_at IS NULL;
			END
		`).execute(this.db);
		await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_delete" 
			AFTER DELETE ON "${contentTable}" 
			BEGIN
				INSERT INTO "${ftsTable}"("${ftsTable}", rowid, id, locale, ${fieldList})
				SELECT 'delete', OLD.rowid, OLD.id, OLD.locale, ${oldFieldList}
				WHERE OLD.deleted_at IS NULL;
			END
		`).execute(this.db);
	}
	/**
	* Drop triggers for a collection
	*/
	async dropTriggers(collectionSlug) {
		this.validateInputs(collectionSlug);
		const ftsTable = this.getFtsTableName(collectionSlug);
		await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_insert"`).execute(this.db);
		await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_update"`).execute(this.db);
		await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_delete"`).execute(this.db);
	}
	/**
	* Drop the FTS table and triggers for a collection
	*/
	async dropFtsTable(collectionSlug) {
		if (!isSqlite(this.db)) return;
		this.validateInputs(collectionSlug);
		const ftsTable = this.getFtsTableName(collectionSlug);
		await this.dropTriggers(collectionSlug);
		await sql.raw(`DROP TABLE IF EXISTS "${ftsTable}"`).execute(this.db);
	}
	/**
	* Rebuild the FTS index for a collection
	*
	* This is useful after bulk imports or if the index gets out of sync.
	*/
	async rebuildIndex(collectionSlug, searchableFields, weights) {
		if (!isSqlite(this.db)) return;
		await this.dropFtsTable(collectionSlug);
		await this.createFtsTable(collectionSlug, searchableFields, weights);
		await this.populateFromContent(collectionSlug, searchableFields);
	}
	/**
	* Populate the FTS table from existing content
	*/
	async populateFromContent(collectionSlug, searchableFields) {
		if (!isSqlite(this.db)) return;
		this.validateInputs(collectionSlug, searchableFields);
		const ftsTable = this.getFtsTableName(collectionSlug);
		const contentTable = this.getContentTableName(collectionSlug);
		const fieldList = searchableFields.join(", ");
		await sql.raw(`
			INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
			SELECT rowid, id, locale, ${fieldList} FROM "${contentTable}"
			WHERE deleted_at IS NULL
		`).execute(this.db);
	}
	/**
	* Get the search configuration for a collection
	*/
	async getSearchConfig(collectionSlug) {
		const result = await this.db.selectFrom("_emdash_collections").select("search_config").where("slug", "=", collectionSlug).executeTakeFirst();
		if (!result?.search_config) return null;
		try {
			const parsed = JSON.parse(result.search_config);
			if (typeof parsed !== "object" || parsed === null || !("enabled" in parsed) || typeof parsed.enabled !== "boolean") return null;
			const config = { enabled: parsed.enabled };
			if ("weights" in parsed && typeof parsed.weights === "object" && parsed.weights !== null) {
				const weights = {};
				for (const [k, v] of Object.entries(parsed.weights)) if (typeof v === "number") weights[k] = v;
				config.weights = weights;
			}
			return config;
		} catch {
			return null;
		}
	}
	/**
	* Update the search configuration for a collection
	*/
	async setSearchConfig(collectionSlug, config) {
		await this.db.updateTable("_emdash_collections").set({ search_config: JSON.stringify(config) }).where("slug", "=", collectionSlug).execute();
	}
	/**
	* Get searchable fields for a collection
	*/
	async getSearchableFields(collectionSlug) {
		const collection = await this.db.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
		if (!collection) return [];
		return (await this.db.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("searchable", "=", 1).execute()).map((f) => f.slug);
	}
	/**
	* Whether a collection has a user-defined `title` field.
	*
	* `title` is not a system column on `ec_*` tables -- it exists only when a
	* collection defines a field with slug `title`. Search and suggestion SQL
	* that selects `c.title` must check this first; otherwise collections
	* without a title field raise "no such column: c.title" (#1178).
	*/
	async hasTitleColumn(collectionSlug) {
		return (await this.getCollectionsWithTitleColumn([collectionSlug])).has(collectionSlug);
	}
	/**
	* Bulk variant of `hasTitleColumn()`: which of the given collections have
	* a user-defined `title` field. One query instead of one `hasTitleColumn`
	* round-trip pair per collection -- callers that check this once per
	* collection in a loop (multi-collection search, suggestions) should use
	* this instead (AGENTS.md: "one query beats two").
	*/
	async getCollectionsWithTitleColumn(collectionSlugs) {
		if (collectionSlugs.length === 0) return /* @__PURE__ */ new Set();
		const rows = await this.db.selectFrom("_emdash_fields as f").innerJoin("_emdash_collections as c", "c.id", "f.collection_id").select(["c.slug as collection_slug"]).where("f.slug", "=", "title").execute();
		const withTitle = new Set(rows.map((r) => r.collection_slug));
		return new Set(collectionSlugs.filter((slug) => withTitle.has(slug)));
	}
	/**
	* Enable search for a collection.
	*
	* Uses rebuildIndex to ensure a clean state -- drop any existing FTS
	* table/triggers, recreate them, and populate from content. This avoids
	* duplicate rows when triggers have already populated the index (e.g.
	* during seeding where content is inserted before search is enabled).
	*/
	async enableSearch(collectionSlug, options) {
		if (!isSqlite(this.db)) throw new Error("Full-text search is only available with SQLite databases");
		const searchableFields = await this.getSearchableFields(collectionSlug);
		if (searchableFields.length === 0) throw new Error(`No searchable fields defined for collection "${collectionSlug}". Mark at least one field as searchable before enabling search.`);
		await this.rebuildIndex(collectionSlug, searchableFields, options?.weights);
		await this.setSearchConfig(collectionSlug, {
			enabled: true,
			weights: options?.weights
		});
	}
	/**
	* Disable search for a collection
	*
	* Drops the FTS table and triggers.
	*/
	async disableSearch(collectionSlug) {
		if (!isSqlite(this.db)) return;
		await this.dropFtsTable(collectionSlug);
		const existing = await this.getSearchConfig(collectionSlug);
		await this.setSearchConfig(collectionSlug, {
			enabled: false,
			weights: existing?.weights
		});
	}
	/**
	* Get index statistics for a collection
	*/
	async getIndexStats(collectionSlug) {
		if (!isSqlite(this.db)) return null;
		this.validateInputs(collectionSlug);
		const ftsDocsizeTable = `${this.getFtsTableName(collectionSlug)}_docsize`;
		if (!await this.ftsTableExists(collectionSlug)) return null;
		return { indexed: (await sql`
			SELECT COUNT(*) as count FROM "${sql.raw(ftsDocsizeTable)}"
		`.execute(this.db)).rows[0]?.count ?? 0 };
	}
	/**
	* Verify FTS index integrity and rebuild if drift is detected.
	*
	* Cheap belt-and-braces check, run lazily on the first search request
	* per isolate. The expensive cases (corrupted indexes from pre-fix
	* EmDash versions, broken legacy triggers) are handled at boot time by
	* migration `039_fix_fts5_triggers`, not here. This routine sticks to:
	*
	*   1. FTS table missing while config says search is enabled -> rebuild.
	*   2. Row count mismatch between content table and FTS docsize -> rebuild.
	*
	* Returns true if the index was rebuilt, false if it was healthy.
	*/
	async verifyAndRepairIndex(collectionSlug) {
		if (!isSqlite(this.db)) return false;
		this.validateInputs(collectionSlug);
		const ftsDocsizeTable = `${this.getFtsTableName(collectionSlug)}_docsize`;
		const contentTable = this.getContentTableName(collectionSlug);
		const fields = await this.getSearchableFields(collectionSlug);
		const config = await this.getSearchConfig(collectionSlug);
		if (!await this.ftsTableExists(collectionSlug)) {
			if (!config?.enabled || fields.length === 0) return false;
			console.warn(`FTS index for "${collectionSlug}" is missing. Rebuilding.`);
			await this.rebuildIndex(collectionSlug, fields, config.weights);
			return true;
		}
		const contentCount = await sql`
			SELECT COUNT(*) as count FROM ${sql.ref(contentTable)}
			WHERE deleted_at IS NULL
		`.execute(this.db);
		const ftsCount = await sql`
			SELECT COUNT(*) as count FROM "${sql.raw(ftsDocsizeTable)}"
		`.execute(this.db);
		const contentRows = contentCount.rows[0]?.count ?? 0;
		const ftsRows = ftsCount.rows[0]?.count ?? 0;
		if (contentRows !== ftsRows) {
			console.warn(`FTS index for "${collectionSlug}" has ${ftsRows} rows but content table has ${contentRows}. Rebuilding.`);
			if (fields.length > 0) await this.rebuildIndex(collectionSlug, fields, config?.weights);
			return true;
		}
		return false;
	}
	/**
	* Verify and repair FTS indexes for all search-enabled collections.
	*
	* Intended to run at startup to auto-heal any corruption from
	* previous process crashes.
	*/
	async verifyAndRepairAll() {
		if (!isSqlite(this.db)) return 0;
		const collections = await this.db.selectFrom("_emdash_collections").select("slug").where("search_config", "is not", null).execute();
		let repaired = 0;
		for (const { slug } of collections) {
			if (!(await this.getSearchConfig(slug))?.enabled) continue;
			try {
				if (await this.verifyAndRepairIndex(slug)) repaired++;
			} catch (error) {
				console.error(`Failed to verify/repair FTS index for "${slug}":`, error);
			}
		}
		return repaired;
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/registry-BP1JK2xh.mjs
var registry_exports = /* @__PURE__ */ __exportAll({
	SchemaError: () => SchemaError,
	SchemaRegistry: () => SchemaRegistry
});
var SLUG_VALIDATION_PATTERN = /^[a-z][a-z0-9_]*$/;
var EC_PREFIX_PATTERN = /^ec_/;
var SINGLE_QUOTE_PATTERN = /'/g;
var UNDERSCORE_PATTERN = /_/g;
var WORD_BOUNDARY_PATTERN = /\b\w/g;
/** Valid column types for runtime validation */
var COLUMN_TYPES = /* @__PURE__ */ new Set([
	"TEXT",
	"REAL",
	"INTEGER",
	"JSON"
]);
var COLUMN_TYPE_TO_DATA_TYPE = {
	TEXT: "text",
	REAL: "real",
	INTEGER: "integer",
	JSON: "json"
};
/** Valid collection source prefixes/values */
var VALID_SOURCES = /* @__PURE__ */ new Set([
	"manual",
	"discovered",
	"seed"
]);
function isCollectionSource(value) {
	return VALID_SOURCES.has(value) || value.startsWith("template:") || value.startsWith("import:");
}
function isFieldType(value) {
	return value in FIELD_TYPE_TO_COLUMN;
}
function isColumnType(value) {
	return COLUMN_TYPES.has(value);
}
var VALID_COLLECTION_SUPPORTS = /* @__PURE__ */ new Set([
	"drafts",
	"revisions",
	"preview",
	"scheduling",
	"search",
	"seo"
]);
var SEED_FIELD_INSERT_BATCH_SIZE = 6;
function isCollectionSupport(value) {
	return typeof value === "string" && VALID_COLLECTION_SUPPORTS.has(value);
}
/**
* Parse a collection's `supports` column (stored as a JSON array of
* CollectionSupport keys). Unknown/invalid entries are filtered out so the
* runtime value matches the declared `CollectionSupport[]` type.
*
* Throws on malformed JSON so corruption surfaces loudly; returns an empty
* array only for explicitly null/empty values or non-array JSON.
*/
function parseSupports(raw) {
	if (!raw) return [];
	const parsed = JSON.parse(raw);
	if (!Array.isArray(parsed)) return [];
	return parsed.filter(isCollectionSupport);
}
/**
* Error thrown when a schema operation fails
*/
var SchemaError = class extends Error {
	constructor(message, code, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "SchemaError";
	}
};
/**
* Schema Registry
*
* Manages collection and field definitions stored in D1.
* Handles runtime DDL operations (CREATE TABLE, ALTER TABLE).
*/
var SchemaRegistry = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* List all collections
	*/
	async listCollections() {
		return (await this.db.selectFrom("_emdash_collections").selectAll().orderBy("slug", "asc").execute()).map(this.mapCollectionRow);
	}
	/**
	* Get a collection by slug
	*/
	async getCollection(slug) {
		const row = await this.db.selectFrom("_emdash_collections").where("slug", "=", slug).selectAll().executeTakeFirst();
		return row ? this.mapCollectionRow(row) : null;
	}
	/**
	* Get a collection with all its fields
	*/
	async getCollectionWithFields(slug) {
		const collection = await this.getCollection(slug);
		if (!collection) return null;
		const fields = await this.listFields(collection.id);
		return {
			...collection,
			fields
		};
	}
	/**
	* List every collection together with its fields in O(1) query shapes
	* — one for collections, then one batched query for the fields of every
	* returned collection — instead of the N+1 pattern of `listCollections`
	* + per-collection `listFields`. The fields query is chunked at
	* `SQL_BATCH_SIZE` to stay under D1's bound-parameter limit, so on
	* sites with more than `SQL_BATCH_SIZE` collections the field fetch
	* becomes `ceil(collectionCount / SQL_BATCH_SIZE)` queries — still
	* a constant factor, not N+1. Typical sites have well under
	* `SQL_BATCH_SIZE` collections, so this is two queries in practice.
	*
	* Used by the manifest build, which previously paid N+1 round-trips on
	* every admin request. Each round-trip costs ~80–150ms against the D1
	* primary on a busy link, so a 10-collection site spent ~1 s rebuilding
	* a manifest that is now built fresh per admin request (no cache).
	*/
	async listCollectionsWithFields() {
		const collectionRows = await this.db.selectFrom("_emdash_collections").selectAll().orderBy("slug", "asc").execute();
		if (collectionRows.length === 0) return [];
		const fieldsByCollection = /* @__PURE__ */ new Map();
		for (const idChunk of chunks(collectionRows.map((c) => c.id), 50)) {
			const fieldRows = await this.db.selectFrom("_emdash_fields").where("collection_id", "in", idChunk).selectAll().orderBy("collection_id", "asc").orderBy("sort_order", "asc").orderBy("created_at", "asc").execute();
			for (const row of fieldRows) {
				const list = fieldsByCollection.get(row.collection_id) ?? [];
				list.push(this.mapFieldRow(row));
				fieldsByCollection.set(row.collection_id, list);
			}
		}
		return collectionRows.map((c) => ({
			...this.mapCollectionRow(c),
			fields: fieldsByCollection.get(c.id) ?? []
		}));
	}
	/**
	* Create a new collection
	*/
	async createCollection(input) {
		this.validateSlug(input.slug, "collection");
		if (RESERVED_COLLECTION_SLUGS.includes(input.slug)) throw new SchemaError(`Collection slug "${input.slug}" is reserved`, "RESERVED_SLUG");
		if (await this.getCollection(input.slug)) throw new SchemaError(`Collection "${input.slug}" already exists`, "COLLECTION_EXISTS");
		const id = ulid();
		const supports = input.supports ?? ["drafts", "revisions"];
		const hasSeo = input.hasSeo ?? supports.includes("seo") ?? false;
		await withTransaction(this.db, async (trx) => {
			await trx.insertInto("_emdash_collections").values({
				id,
				slug: input.slug,
				label: input.label,
				label_singular: input.labelSingular ?? null,
				description: input.description ?? null,
				icon: input.icon ?? null,
				supports: JSON.stringify(supports),
				source: input.source ?? "manual",
				has_seo: hasSeo ? 1 : 0,
				comments_enabled: input.commentsEnabled ? 1 : 0,
				url_pattern: input.urlPattern ?? null
			}).execute();
			await this.createContentTable(input.slug, trx);
		});
		const collection = await this.getCollection(input.slug);
		if (!collection) throw new SchemaError("Failed to create collection", "CREATE_FAILED");
		return collection;
	}
	/**
	* Create a seed-owned collection and all of its fields in bulk.
	*
	* Fresh seeds can define dozens of fields. Creating them through
	* `createField` performs multiple reads, one ALTER TABLE, and one media
	* usage invalidation per field, which can exhaust D1's per-request query
	* budget. This path validates the full schema before mutating it, creates
	* the complete content table in one statement, and inserts field metadata
	* in parameter-safe batches.
	*/
	async createSeedCollection(input, fields) {
		this.validateSlug(input.slug, "collection");
		if (RESERVED_COLLECTION_SLUGS.includes(input.slug)) throw new SchemaError(`Collection slug "${input.slug}" is reserved`, "RESERVED_SLUG");
		if (await this.getCollection(input.slug)) throw new SchemaError(`Collection "${input.slug}" already exists`, "COLLECTION_EXISTS");
		const fieldSlugs = /* @__PURE__ */ new Set();
		for (const field of fields) {
			this.validateSlug(field.slug, "field");
			if (RESERVED_FIELD_SLUGS.includes(field.slug)) throw new SchemaError(`Field slug "${field.slug}" is reserved`, "RESERVED_SLUG");
			if (fieldSlugs.has(field.slug)) throw new SchemaError(`Field "${field.slug}" already exists in collection "${input.slug}"`, "FIELD_EXISTS");
			fieldSlugs.add(field.slug);
		}
		const collectionId = ulid();
		const supports = input.supports ?? ["drafts", "revisions"];
		const hasSeo = input.hasSeo ?? supports.includes("seo") ?? false;
		let maxSortOrder = -1;
		const fieldRows = fields.map((field) => {
			const sortOrder = field.sortOrder ?? maxSortOrder + 1;
			maxSortOrder = Math.max(maxSortOrder, sortOrder);
			return {
				id: ulid(),
				collection_id: collectionId,
				slug: field.slug,
				label: field.label,
				type: field.type,
				column_type: FIELD_TYPE_TO_COLUMN[field.type],
				required: field.required ? 1 : 0,
				unique: field.unique ? 1 : 0,
				default_value: field.defaultValue !== void 0 ? JSON.stringify(field.defaultValue) : null,
				validation: field.validation ? JSON.stringify(field.validation) : null,
				widget: field.widget ?? null,
				options: field.options ? JSON.stringify(field.options) : null,
				sort_order: sortOrder,
				searchable: field.searchable ? 1 : 0,
				translatable: field.translatable === false ? 0 : 1
			};
		});
		let schemaMutated = false;
		try {
			await withTransaction(this.db, async (trx) => {
				await trx.insertInto("_emdash_collections").values({
					id: collectionId,
					slug: input.slug,
					label: input.label,
					label_singular: input.labelSingular ?? null,
					description: input.description ?? null,
					icon: input.icon ?? null,
					supports: JSON.stringify(supports),
					source: "seed",
					has_seo: hasSeo ? 1 : 0,
					comments_enabled: input.commentsEnabled ? 1 : 0,
					url_pattern: input.urlPattern ?? null
				}).execute();
				schemaMutated = true;
				await this.createContentTable(input.slug, trx, fields);
				for (const fieldBatch of chunks(fieldRows, SEED_FIELD_INSERT_BATCH_SIZE)) await trx.insertInto("_emdash_fields").values(fieldBatch).execute();
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, input.slug, "CONTENT_USAGE_STALE");
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, input.slug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Update a collection
	*/
	async updateCollection(slug, input) {
		const existing = await this.getCollection(slug);
		if (!existing) throw new SchemaError(`Collection "${slug}" not found`, "COLLECTION_NOT_FOUND");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const supportsArray = input.supports ?? existing.supports;
		const hasSeo = input.hasSeo !== void 0 ? input.hasSeo : input.supports !== void 0 ? supportsArray.includes("seo") : existing.hasSeo;
		return withTransaction(this.db, async (trx) => {
			await trx.updateTable("_emdash_collections").set({
				label: input.label ?? existing.label,
				label_singular: input.labelSingular ?? existing.labelSingular ?? null,
				description: input.description ?? existing.description ?? null,
				icon: input.icon ?? existing.icon ?? null,
				supports: input.supports ? JSON.stringify(input.supports) : JSON.stringify(existing.supports),
				url_pattern: input.urlPattern !== void 0 ? input.urlPattern ?? null : existing.urlPattern ?? null,
				has_seo: hasSeo ? 1 : 0,
				comments_enabled: input.commentsEnabled !== void 0 ? input.commentsEnabled ? 1 : 0 : existing.commentsEnabled ? 1 : 0,
				comments_moderation: input.commentsModeration ?? existing.commentsModeration,
				comments_closed_after_days: input.commentsClosedAfterDays !== void 0 ? input.commentsClosedAfterDays : existing.commentsClosedAfterDays,
				comments_auto_approve_users: input.commentsAutoApproveUsers !== void 0 ? input.commentsAutoApproveUsers ? 1 : 0 : existing.commentsAutoApproveUsers ? 1 : 0,
				updated_at: now
			}).where("slug", "=", slug).execute();
			const row = await trx.selectFrom("_emdash_collections").where("slug", "=", slug).selectAll().executeTakeFirst();
			if (!row) throw new SchemaError("Failed to update collection", "UPDATE_FAILED");
			if (input.supports !== void 0) {
				if (existing.supports.includes("search") !== parseSupports(row.supports).includes("search")) await this.syncSearchState(slug, trx);
			}
			return this.mapCollectionRow(row);
		});
	}
	/**
	* Delete a collection
	*/
	async deleteCollection(slug, options) {
		const existing = await this.getCollection(slug);
		if (!existing) throw new SchemaError(`Collection "${slug}" not found`, "COLLECTION_NOT_FOUND");
		if (!options?.force) {
			if (await this.collectionHasContent(slug)) throw new SchemaError(`Collection "${slug}" has content. Use force: true to delete.`, "COLLECTION_HAS_CONTENT");
		}
		let contentTableDropped = false;
		try {
			await withTransaction(this.db, async (trx) => {
				await new FTSManager(trx).dropFtsTable(slug);
				const tableName = this.getTableName(slug);
				await sql`DROP TABLE IF EXISTS ${sql.ref(tableName)}`.execute(trx);
				contentTableDropped = true;
				await trx.deleteFrom("_emdash_collections").where("id", "=", existing.id).execute();
			});
			await deleteContentMediaUsageCollection(this.db, slug);
		} catch (error) {
			if (contentTableDropped && !await tableExists(this.db, this.getTableName(slug))) await deleteContentMediaUsageCollection(this.db, slug);
			throw error;
		}
	}
	/**
	* List fields for a collection
	*/
	async listFields(collectionId) {
		return (await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collectionId).selectAll().orderBy("sort_order", "asc").orderBy("created_at", "asc").execute()).map(this.mapFieldRow);
	}
	/**
	* Get a field by slug within a collection
	*/
	async getField(collectionSlug, fieldSlug) {
		const collection = await this.getCollection(collectionSlug);
		if (!collection) return null;
		const row = await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).where("slug", "=", fieldSlug).selectAll().executeTakeFirst();
		return row ? this.mapFieldRow(row) : null;
	}
	/**
	* Create a new field
	*/
	async createField(collectionSlug, input) {
		const collection = await this.getCollection(collectionSlug);
		if (!collection) throw new SchemaError(`Collection "${collectionSlug}" not found`, "COLLECTION_NOT_FOUND");
		this.validateSlug(input.slug, "field");
		if (RESERVED_FIELD_SLUGS.includes(input.slug)) throw new SchemaError(`Field slug "${input.slug}" is reserved`, "RESERVED_SLUG");
		if (await this.getField(collectionSlug, input.slug)) throw new SchemaError(`Field "${input.slug}" already exists in collection "${collectionSlug}"`, "FIELD_EXISTS");
		const id = ulid();
		const columnType = FIELD_TYPE_TO_COLUMN[input.type];
		const maxSort = await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).select((eb) => eb.fn.max("sort_order").as("max")).executeTakeFirst();
		const sortOrder = input.sortOrder ?? (maxSort?.max ?? -1) + 1;
		let schemaMutated = false;
		try {
			const created = await withTransaction(this.db, async (trx) => {
				await trx.insertInto("_emdash_fields").values({
					id,
					collection_id: collection.id,
					slug: input.slug,
					label: input.label,
					type: input.type,
					column_type: columnType,
					required: input.required ? 1 : 0,
					unique: input.unique ? 1 : 0,
					default_value: input.defaultValue !== void 0 ? JSON.stringify(input.defaultValue) : null,
					validation: input.validation ? JSON.stringify(input.validation) : null,
					widget: input.widget ?? null,
					options: input.options ? JSON.stringify(input.options) : null,
					sort_order: sortOrder,
					searchable: input.searchable ? 1 : 0,
					translatable: input.translatable === false ? 0 : 1
				}).execute();
				schemaMutated = true;
				await this.addColumn(collectionSlug, input.slug, input.type, {
					required: input.required,
					defaultValue: input.defaultValue
				}, trx);
				const fieldRow = await trx.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).where("slug", "=", input.slug).selectAll().executeTakeFirst();
				if (!fieldRow) throw new SchemaError("Failed to create field", "CREATE_FAILED");
				const field = this.mapFieldRow(fieldRow);
				if (input.searchable) await this.syncSearchState(collectionSlug, trx);
				return field;
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			return created;
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Update a field
	*/
	async updateField(collectionSlug, fieldSlug, input) {
		const field = await this.getField(collectionSlug, fieldSlug);
		if (!field) throw new SchemaError(`Field "${fieldSlug}" not found in collection "${collectionSlug}"`, "FIELD_NOT_FOUND");
		const nextValidation = input.validation === void 0 ? field.validation : input.validation;
		let nextType = field.type;
		let nextColumnType = field.columnType;
		if (input.type !== void 0 && input.type !== field.type) {
			const newColumnType = FIELD_TYPE_TO_COLUMN[input.type];
			if (newColumnType !== field.columnType) throw new SchemaError(`Cannot change field "${fieldSlug}" in collection "${collectionSlug}" from type "${field.type}" to "${input.type}": the underlying column type would change from ${field.columnType} to ${newColumnType}, which requires a manual content migration. Drop and re-create the field, or migrate the column data, before changing its type.`, "FIELD_TYPE_COLUMN_CHANGE");
			nextType = input.type;
			nextColumnType = newColumnType;
		}
		let schemaMutated = false;
		try {
			const updatedField = await withTransaction(this.db, async (trx) => {
				await trx.updateTable("_emdash_fields").set({
					type: nextType,
					column_type: nextColumnType,
					label: input.label ?? field.label,
					required: input.required !== void 0 ? input.required ? 1 : 0 : field.required ? 1 : 0,
					unique: input.unique !== void 0 ? input.unique ? 1 : 0 : field.unique ? 1 : 0,
					searchable: input.searchable !== void 0 ? input.searchable ? 1 : 0 : field.searchable ? 1 : 0,
					translatable: input.translatable !== void 0 ? input.translatable ? 1 : 0 : field.translatable ? 1 : 0,
					default_value: input.defaultValue !== void 0 ? JSON.stringify(input.defaultValue) : field.defaultValue !== void 0 ? JSON.stringify(field.defaultValue) : null,
					validation: nextValidation ? JSON.stringify(nextValidation) : null,
					widget: input.widget ?? field.widget ?? null,
					options: input.options ? JSON.stringify(input.options) : field.options ? JSON.stringify(field.options) : null,
					sort_order: input.sortOrder ?? field.sortOrder
				}).where("id", "=", field.id).execute();
				schemaMutated = true;
				const updatedRow = await trx.selectFrom("_emdash_fields").where("collection_id", "=", field.collectionId).where("slug", "=", fieldSlug).selectAll().executeTakeFirst();
				if (!updatedRow) throw new SchemaError("Failed to update field", "UPDATE_FAILED");
				const updated = this.mapFieldRow(updatedRow);
				if (input.searchable !== void 0 && input.searchable !== field.searchable) await this.syncSearchState(collectionSlug, trx);
				return updated;
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			return updatedField;
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Synchronize an existing FTS index with the collection's current state.
	*
	* Only rebuilds or disables — never first-time enables. First-time FTS
	* enablement is handled by the seed's explicit enableSearch call (which
	* is try-caught) or the admin UI toggle.
	*
	* - FTS active + still has search support and searchable fields → rebuild
	* - FTS active + lost search support or no searchable fields    → disable
	* - FTS not active                                              → no-op
	*
	* Pass `db` when calling from within a transaction so FTS operations
	* participate in the same transaction and are rolled back on failure.
	*/
	async syncSearchState(collectionSlug, db) {
		const conn = db ?? this.db;
		const ftsManager = new FTSManager(conn);
		const row = await conn.selectFrom("_emdash_collections").where("slug", "=", collectionSlug).select("supports").executeTakeFirst();
		if (!row) return;
		const wantsSearch = parseSupports(row.supports).includes("search");
		const searchableFields = await ftsManager.getSearchableFields(collectionSlug);
		const config = await ftsManager.getSearchConfig(collectionSlug);
		const ftsActive = config?.enabled === true;
		if (wantsSearch && searchableFields.length > 0 && ftsActive) await ftsManager.rebuildIndex(collectionSlug, searchableFields, config?.weights);
		else if (ftsActive && (!wantsSearch || searchableFields.length === 0)) await ftsManager.disableSearch(collectionSlug);
	}
	/**
	* Delete a field
	*/
	async deleteField(collectionSlug, fieldSlug) {
		const field = await this.getField(collectionSlug, fieldSlug);
		if (!field) throw new SchemaError(`Field "${fieldSlug}" not found in collection "${collectionSlug}"`, "FIELD_NOT_FOUND");
		let schemaMutated = false;
		try {
			await withTransaction(this.db, async (trx) => {
				await trx.deleteFrom("_emdash_fields").where("id", "=", field.id).execute();
				schemaMutated = true;
				if (field.searchable) await this.syncSearchState(collectionSlug, trx);
				await this.dropColumn(collectionSlug, fieldSlug, trx);
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Reorder fields
	*/
	async reorderFields(collectionSlug, fieldSlugs) {
		const collection = await this.getCollection(collectionSlug);
		if (!collection) throw new SchemaError(`Collection "${collectionSlug}" not found`, "COLLECTION_NOT_FOUND");
		for (let i = 0; i < fieldSlugs.length; i++) await this.db.updateTable("_emdash_fields").set({ sort_order: i }).where("collection_id", "=", collection.id).where("slug", "=", fieldSlugs[i]).execute();
	}
	/**
	* Create a content table for a collection
	*/
	async createContentTable(slug, db, fields = []) {
		const conn = db ?? this.db;
		const tableName = this.getTableName(slug);
		let table = conn.schema.createTable(tableName).addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text").addColumn("status", "text", (col) => col.defaultTo("draft")).addColumn("author_id", "text").addColumn("primary_byline_id", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(conn))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(conn))).addColumn("published_at", "text").addColumn("scheduled_at", "text").addColumn("deleted_at", "text").addColumn("version", "integer", (col) => col.defaultTo(1)).addColumn("live_revision_id", "text", (col) => col.references("revisions.id")).addColumn("draft_revision_id", "text", (col) => col.references("revisions.id")).addColumn("locale", "text", (col) => col.notNull().defaultTo("en")).addColumn("translation_group", "text");
		for (const field of fields) {
			const columnName = this.getColumnName(field.slug);
			const columnType = COLUMN_TYPE_TO_DATA_TYPE[FIELD_TYPE_TO_COLUMN[field.type]];
			table = table.addColumn(columnName, columnType, (column) => {
				if (!field.required) return column;
				const defaultValue = field.defaultValue !== void 0 ? this.formatDefaultValue(field.defaultValue, field.type) : this.getEmptyDefault(field.type);
				return column.notNull().defaultTo(sql.raw(defaultValue));
			});
		}
		await table.addUniqueConstraint(`${tableName}_slug_locale_unique`, ["slug", "locale"]).execute();
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_slug`)}
			ON ${sql.ref(tableName)} (slug)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_scheduled`)}
			ON ${sql.ref(tableName)} (scheduled_at)
			WHERE scheduled_at IS NOT NULL
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_live_revision`)}
			ON ${sql.ref(tableName)} (live_revision_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_draft_revision`)}
			ON ${sql.ref(tableName)} (draft_revision_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_author`)}
			ON ${sql.ref(tableName)} (author_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_primary_byline`)}
			ON ${sql.ref(tableName)} (primary_byline_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_locale`)}
			ON ${sql.ref(tableName)} (locale)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_translation_group`)}
			ON ${sql.ref(tableName)} (translation_group)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_updated_id`)}
			ON ${sql.ref(tableName)} (deleted_at, updated_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_status`)}
			ON ${sql.ref(tableName)} (deleted_at, status)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_created_id`)}
			ON ${sql.ref(tableName)} (deleted_at, created_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_published_id`)}
			ON ${sql.ref(tableName)} (deleted_at, published_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_loc_upd`)}
			ON ${sql.ref(tableName)} (deleted_at, locale, updated_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_loc_crt`)}
			ON ${sql.ref(tableName)} (deleted_at, locale, created_at DESC, id DESC)
		`.execute(conn);
	}
	/**
	* Add a column to a content table
	*/
	async addColumn(collectionSlug, fieldSlug, fieldType, options, db) {
		const conn = db ?? this.db;
		const tableName = this.getTableName(collectionSlug);
		const columnType = FIELD_TYPE_TO_COLUMN[fieldType];
		const columnName = this.getColumnName(fieldSlug);
		if (options?.required && options?.defaultValue !== void 0) {
			const defaultVal = this.formatDefaultValue(options.defaultValue, fieldType);
			await sql`
				ALTER TABLE ${sql.ref(tableName)}
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)} NOT NULL DEFAULT ${sql.raw(defaultVal)}
			`.execute(conn);
		} else if (options?.required) {
			const defaultVal = this.getEmptyDefault(fieldType);
			await sql`
				ALTER TABLE ${sql.ref(tableName)}
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)} NOT NULL DEFAULT ${sql.raw(defaultVal)}
			`.execute(conn);
		} else await sql`
				ALTER TABLE ${sql.ref(tableName)}
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)}
			`.execute(conn);
	}
	/**
	* Drop a column from a content table
	*/
	async dropColumn(collectionSlug, fieldSlug, db) {
		const tableName = this.getTableName(collectionSlug);
		const columnName = this.getColumnName(fieldSlug);
		await sql`
			ALTER TABLE ${sql.ref(tableName)}
			DROP COLUMN ${sql.ref(columnName)}
		`.execute(db ?? this.db);
	}
	/**
	* Check if a collection has any content
	*/
	async collectionHasContent(slug) {
		const tableName = this.getTableName(slug);
		try {
			return ((await sql`
				SELECT COUNT(*) as count FROM ${sql.ref(tableName)}
				WHERE deleted_at IS NULL
			`.execute(this.db)).rows[0]?.count ?? 0) > 0;
		} catch {
			return false;
		}
	}
	/**
	* Get table name for a collection
	*/
	getTableName(slug) {
		validateIdentifier(slug, "collection slug");
		return `ec_${slug}`;
	}
	/**
	* Get column name for a field
	*/
	getColumnName(slug) {
		validateIdentifier(slug, "field slug");
		return slug;
	}
	/**
	* Validate a slug
	*/
	validateSlug(slug, type) {
		if (!slug || typeof slug !== "string") throw new SchemaError(`${type} slug is required`, "INVALID_SLUG");
		if (!SLUG_VALIDATION_PATTERN.test(slug)) throw new SchemaError(`${type} slug must start with a letter and contain only lowercase letters, numbers, and underscores`, "INVALID_SLUG");
		if (slug.length > 63) throw new SchemaError(`${type} slug must be 63 characters or less`, "INVALID_SLUG");
	}
	/**
	* Format a default value for SQL.
	*
	* SQLite `ALTER TABLE ADD COLUMN ... DEFAULT` requires a literal constant
	* expression — parameterized values cannot be used here. We manually escape
	* single quotes and coerce types to ensure the output is safe.
	*
	* INTEGER/REAL values are coerced through `Number()` which can only produce
	* digits, `.`, `-`, `e`, `Infinity`, or `NaN` — all safe in SQL.
	* TEXT/JSON values have single quotes escaped via SQL standard doubling (`''`).
	*/
	formatDefaultValue(value, fieldType) {
		if (value === null || value === void 0) return "NULL";
		const columnType = FIELD_TYPE_TO_COLUMN[fieldType];
		if (columnType === "JSON") return `'${JSON.stringify(value).replace(SINGLE_QUOTE_PATTERN, "''")}'`;
		if (columnType === "INTEGER") {
			if (typeof value === "boolean") return value ? "1" : "0";
			const num = Number(value);
			if (!Number.isFinite(num)) return "0";
			return String(Math.trunc(num));
		}
		if (columnType === "REAL") {
			const num = Number(value);
			if (!Number.isFinite(num)) return "0";
			return String(num);
		}
		let text;
		if (typeof value === "string") text = value;
		else if (typeof value === "number" || typeof value === "boolean") text = String(value);
		else if (typeof value === "object" && value !== null) text = JSON.stringify(value);
		else text = "";
		return `'${text.replace(SINGLE_QUOTE_PATTERN, "''")}'`;
	}
	/**
	* Get empty default for a field type
	*/
	getEmptyDefault(fieldType) {
		switch (FIELD_TYPE_TO_COLUMN[fieldType]) {
			case "INTEGER": return "0";
			case "REAL": return "0.0";
			case "JSON": return "'null'";
			default: return "''";
		}
	}
	/**
	* Map a collection row to a Collection object
	*/
	mapCollectionRow = (row) => {
		const moderation = row.comments_moderation;
		return {
			id: row.id,
			slug: row.slug,
			label: row.label,
			labelSingular: row.label_singular ?? void 0,
			description: row.description ?? void 0,
			icon: row.icon ?? void 0,
			supports: parseSupports(row.supports),
			source: row.source && isCollectionSource(row.source) ? row.source : void 0,
			hasSeo: row.has_seo === 1,
			urlPattern: row.url_pattern ?? void 0,
			commentsEnabled: row.comments_enabled === 1,
			commentsModeration: moderation === "all" || moderation === "first_time" || moderation === "none" ? moderation : "first_time",
			commentsClosedAfterDays: row.comments_closed_after_days ?? 90,
			commentsAutoApproveUsers: row.comments_auto_approve_users === 1,
			createdAt: row.created_at,
			updatedAt: row.updated_at
		};
	};
	/**
	* Map a field row to a Field object
	*/
	mapFieldRow = (row) => {
		return {
			id: row.id,
			collectionId: row.collection_id,
			slug: row.slug,
			label: row.label,
			type: isFieldType(row.type) ? row.type : "string",
			columnType: isColumnType(row.column_type) ? row.column_type : "TEXT",
			required: row.required === 1,
			unique: row.unique === 1,
			defaultValue: row.default_value ? JSON.parse(row.default_value) : void 0,
			validation: row.validation ? JSON.parse(row.validation) : void 0,
			widget: row.widget ?? void 0,
			options: row.options ? JSON.parse(row.options) : void 0,
			sortOrder: row.sort_order,
			searchable: row.searchable === 1,
			translatable: row.translatable !== 0,
			createdAt: row.created_at
		};
	};
	/**
	* Discover orphaned content tables
	*
	* Finds ec_* tables that exist in the database but don't have a
	* corresponding entry in _emdash_collections.
	*/
	async discoverOrphanedTables() {
		const allTables = await listTablesLike(this.db, "ec_%");
		const registered = await this.listCollections();
		const registeredSlugs = new Set(registered.map((c) => c.slug));
		const orphans = [];
		for (const tableName of allTables) {
			const slug = tableName.replace(EC_PREFIX_PATTERN, "");
			if (!registeredSlugs.has(slug)) try {
				const countResult = await sql`
						SELECT COUNT(*) as count FROM ${sql.ref(tableName)}
						WHERE deleted_at IS NULL
					`.execute(this.db);
				orphans.push({
					slug,
					tableName,
					rowCount: countResult.rows[0]?.count ?? 0
				});
			} catch {
				orphans.push({
					slug,
					tableName,
					rowCount: 0
				});
			}
		}
		return orphans;
	}
	/**
	* Register an orphaned table as a collection
	*
	* Creates a _emdash_collections entry for an existing ec_* table.
	*/
	async registerOrphanedTable(slug, options) {
		const tableName = this.getTableName(slug);
		if (!await tableExists(this.db, tableName)) throw new SchemaError(`Table "${tableName}" does not exist`, "TABLE_NOT_FOUND");
		if (await this.getCollection(slug)) throw new SchemaError(`Collection "${slug}" is already registered`, "COLLECTION_EXISTS");
		const id = ulid();
		const label = options?.label || this.slugToLabel(slug);
		let collectionRegistered = false;
		try {
			await this.db.insertInto("_emdash_collections").values({
				id,
				slug,
				label,
				label_singular: options?.labelSingular ?? null,
				description: options?.description ?? null,
				icon: null,
				supports: JSON.stringify([]),
				source: "discovered",
				has_seo: 0,
				url_pattern: null
			}).execute();
			collectionRegistered = true;
			const collection = await this.getCollection(slug);
			if (!collection) throw new SchemaError("Failed to register orphaned table", "REGISTER_FAILED");
			await markContentMediaUsageCollectionStaleSafely(this.db, slug, "CONTENT_USAGE_STALE");
			return collection;
		} catch (error) {
			if (collectionRegistered) await markContentMediaUsageCollectionStaleSafely(this.db, slug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Convert slug to human-readable label
	*/
	slugToLabel(slug) {
		return slug.replace(UNDERSCORE_PATTERN, " ").replace(WORD_BOUNDARY_PATTERN, (c) => c.toUpperCase());
	}
};
//#endregion
export { deleteContentMediaUsage as a, markContentMediaUsageCollectionStaleSafely as c, normalizeMediaValue as d, matchesMimeAllowlist as f, FTSManager as i, refreshContentMediaUsageAfterWrite as l, parseAllowedMimeTypes as m, SchemaRegistry as n, findNonTranslatableSiblingContentIds as o, normalizeMime as p, registry_exports as r, markContentMediaUsageCollectionStale as s, SchemaError as t, hashString as u };
