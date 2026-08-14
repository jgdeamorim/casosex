import { t as sql } from "./dist_D4nVBoqy.mjs";
import { b as validateIdentifier, f as currentTimestamp, g as listTablesLike, r as __exportAll, y as tableExists } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as chunks } from "./chunks-D5dlPeRb_ZNPg27dD.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { c as deleteContentMediaUsageCollection, p as markContentMediaUsageCollectionStaleSafely } from "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import { a as RESERVED_COLLECTION_SLUGS, o as RESERVED_FIELD_SLUGS, r as FIELD_TYPE_TO_COLUMN } from "./types-o7xo7VgH_Bdv_7eeq.mjs";
import { t as FTSManager } from "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
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
export { SchemaRegistry as n, registry_exports as r, SchemaError as t };
