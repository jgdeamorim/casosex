import { a as sql } from "./migrator_BiAfLowp.mjs";
import { b as validateIdentifier, r as __exportAll } from "./runner-BsI18UgP_CTLRmh7U.mjs";
import { o as invalidateCollectionCache } from "./object-cache-Bok5j2ae_B1rhuniT.mjs";
import { a as encodeCursor, i as decodeCursor, r as ScheduledNotDueError, t as EmDashValidationError } from "./types-XrQQ-Aex_rb6o-8d1.mjs";
import { n as ulid, t as monotonicFactory } from "./node_BucsvNi-.mjs";
import { t as chunks } from "./chunks-D5dlPeRb_ZmalEYon.mjs";
import { n as isMissingTableError } from "./db-errors-CcWLaRiR_Bz5UsdxN.mjs";
//#region self-essentials/emdash-main/packages/core/dist/slugify-C_tqlU4G.mjs
var DIACRITICS_PATTERN = /[\u0300-\u036f]/g;
var WHITESPACE_UNDERSCORE_PATTERN = /[\s_]+/g;
var NON_ALPHANUMERIC_HYPHEN_PATTERN = /[^a-z0-9-]/g;
var MULTIPLE_HYPHENS_PATTERN = /-+/g;
var LEADING_TRAILING_HYPHEN_PATTERN = /^-|-$/g;
var TRAILING_HYPHEN_PATTERN = /-$/;
function slugify(text, maxLength = 80) {
	return text.toLowerCase().normalize("NFD").replace(DIACRITICS_PATTERN, "").replace(WHITESPACE_UNDERSCORE_PATTERN, "-").replace(NON_ALPHANUMERIC_HYPHEN_PATTERN, "").replace(MULTIPLE_HYPHENS_PATTERN, "-").replace(LEADING_TRAILING_HYPHEN_PATTERN, "").slice(0, maxLength).replace(TRAILING_HYPHEN_PATTERN, "");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/content-CpfKV9QE.mjs
/**
* FTS5 match-expression builder for structured (non-user-syntax) queries.
*
* Unlike `escapeQuery` in `query.ts` (which powers the public search API and
* deliberately passes through FTS5 operators like AND/OR/NOT), this builder
* treats the input as plain words: every term is double-quoted with interior
* quotes escaped, so the result can never produce an FTS5 syntax error. Used
* by the admin content-list filter, where the input is a filter box, not a
* search-syntax field.
*/
var WHITESPACE_RE = /\s+/;
var DOUBLE_QUOTE_RE = /"/g;
var GLOB_SPECIAL_RE = /[[\]*?]/g;
/**
* Build a prefix-matching FTS5 MATCH expression from free-form input.
*
* `hello wor` becomes `"hello"* "wor"*` — implicit AND with per-term prefix
* matching. Returns `""` when the input contains no usable terms; callers
* must fall back to their non-FTS path in that case.
*/
function buildFtsPrefixMatch(input) {
	const terms = input.trim().split(WHITESPACE_RE).map((term) => term.replace(DOUBLE_QUOTE_RE, "\"\"")).filter((term) => term.length > 0);
	if (terms.length === 0) return "";
	return terms.map((term) => `"${term}"*`).join(" ");
}
/**
* Build a GLOB prefix pattern from free-form input, treating GLOB
* metacharacters (`* ? [ ]`) literally by wrapping each in a character
* class (GLOB has no ESCAPE clause).
*
* GLOB (unlike default LIKE) is case-sensitive, so with a lowercased
* pattern it matches slugs (lowercase by construction) while staying
* servable by the ordinary BINARY-collated slug index — SQLite's GLOB
* optimization turns a `prefix*` pattern into an index range scan.
*/
function buildSlugGlobPrefix(input) {
	return `${input.trim().toLowerCase().replace(GLOB_SPECIAL_RE, (c) => `[${c}]`)}*`;
}
var monotonic = monotonicFactory();
/**
* Revision repository for version history
*
* Each revision stores a JSON snapshot of the content at a point in time.
* Used when collection has `supports: ["revisions"]` enabled.
*/
var RevisionRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new revision
	*/
	async create(input) {
		const id = monotonic();
		const row = {
			id,
			collection: input.collection,
			entry_id: input.entryId,
			data: JSON.stringify(input.data),
			author_id: input.authorId ?? null
		};
		await this.db.insertInto("revisions").values(row).execute();
		const revision = await this.findById(id);
		if (!revision) throw new Error("Failed to create revision");
		return revision;
	}
	/**
	* Find revision by ID
	*/
	async findById(id) {
		const row = await this.db.selectFrom("revisions").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToRevision(row) : null;
	}
	/**
	* Get all revisions for an entry (newest first)
	*
	* Orders by monotonic ULID (descending). The monotonic factory
	* guarantees strictly increasing IDs even within the same millisecond.
	*/
	async findByEntry(collection, entryId, options = {}) {
		let query = this.db.selectFrom("revisions").selectAll().where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("id", "desc");
		if (options.limit) query = query.limit(options.limit);
		return (await query.execute()).map((row) => this.rowToRevision(row));
	}
	/**
	* Get the most recent revision for an entry
	*/
	async findLatest(collection, entryId) {
		const row = await this.db.selectFrom("revisions").selectAll().where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("id", "desc").limit(1).executeTakeFirst();
		return row ? this.rowToRevision(row) : null;
	}
	/**
	* Count revisions for an entry
	*/
	async countByEntry(collection, entryId) {
		const result = await this.db.selectFrom("revisions").select((eb) => eb.fn.count("id").as("count")).where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Delete all revisions for an entry (use when entry is deleted)
	*/
	async deleteByEntry(collection, entryId) {
		const result = await this.db.deleteFrom("revisions").where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Delete old revisions, keeping the most recent N
	*/
	async pruneOldRevisions(collection, entryId, keepCount) {
		const keepIds = (await this.db.selectFrom("revisions").select("id").where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("created_at", "desc").orderBy("id", "desc").limit(keepCount).execute()).map((r) => r.id);
		if (keepIds.length === 0) return 0;
		const result = await this.db.deleteFrom("revisions").where("collection", "=", collection).where("entry_id", "=", entryId).where("id", "not in", keepIds).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Update revision data in place
	* Used for autosave to avoid creating many small revisions.
	*/
	async updateData(id, data) {
		await this.db.updateTable("revisions").set({ data: JSON.stringify(data) }).where("id", "=", id).execute();
	}
	/**
	* Convert database row to Revision object
	*/
	rowToRevision(row) {
		return {
			id: row.id,
			collection: row.collection,
			entryId: row.entry_id,
			data: JSON.parse(row.data),
			authorId: row.author_id,
			createdAt: row.created_at
		};
	}
};
var content_exports = /* @__PURE__ */ __exportAll({ ContentRepository: () => ContentRepository });
var ULID_PATTERN = /^[0-9A-Z]{26}$/;
var LIKE_WILDCARD_RE = /[\\%_]/g;
/**
* Whitelist mapping a public date-filter field to its physical column. Keeping
* this separate from `mapOrderField` makes the filterable set explicit and
* prevents filtering on arbitrary columns.
*/
var DATE_FILTER_COLUMNS = {
	createdAt: "created_at",
	updatedAt: "updated_at",
	publishedAt: "published_at"
};
/**
* System columns that exist in every ec_* table
*/
var SYSTEM_COLUMNS = /* @__PURE__ */ new Set([
	"id",
	"slug",
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
	"translation_group"
]);
/**
* Get the table name for a collection type
*/
function getTableName(type) {
	validateIdentifier(type, "collection type");
	return `ec_${type}`;
}
/**
* Serialize a value for database storage
* Objects/arrays are JSON-stringified
* Booleans are converted to 0/1 for SQLite
*/
function serializeValue(value) {
	if (value === null || value === void 0) return null;
	if (typeof value === "boolean") return value ? 1 : 0;
	if (typeof value === "object") return JSON.stringify(value);
	return value;
}
/**
* Deserialize a value from database storage
* Attempts to parse JSON strings that look like objects/arrays
*/
function deserializeValue(value) {
	if (typeof value === "string") {
		if (value.startsWith("{") || value.startsWith("[")) try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}
/** Pattern for escaping special regex characters */
var REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;
/**
* Escape special regex characters in a string for use in `new RegExp()`
*/
function escapeRegExp(s) {
	return s.replace(REGEX_ESCAPE_PATTERN, "\\$&");
}
/**
* Repository for content CRUD operations
*
* Content is stored in per-collection tables (ec_posts, ec_pages, etc.)
* Each field becomes a real column in the table.
*/
var ContentRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new content item
	*/
	async create(input) {
		const id = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const { type, slug, data, status = "draft", authorId, primaryBylineId, locale, translationOf, publishedAt, createdAt } = input;
		if (!type) throw new EmDashValidationError("Content type is required");
		const tableName = getTableName(type);
		let translationGroup = id;
		if (translationOf) {
			const source = await this.findById(type, translationOf);
			if (!source) throw new EmDashValidationError("Translation source content not found");
			translationGroup = source.translationGroup || source.id;
		}
		const columns = [
			"id",
			"slug",
			"status",
			"author_id",
			"primary_byline_id",
			"created_at",
			"updated_at",
			"published_at",
			"version",
			"locale",
			"translation_group"
		];
		const values = [
			id,
			slug || null,
			status,
			authorId || null,
			primaryBylineId ?? null,
			createdAt || now,
			now,
			publishedAt || null,
			1,
			locale || "en",
			translationGroup
		];
		if (data && typeof data === "object") {
			for (const [key, value] of Object.entries(data)) if (!SYSTEM_COLUMNS.has(key)) {
				validateIdentifier(key, "content field name");
				columns.push(key);
				values.push(serializeValue(value));
			}
		}
		const columnRefs = columns.map((c) => sql.ref(c));
		const valuePlaceholders = values.map((v) => v === null ? sql`NULL` : sql`${v}`);
		await sql`
			INSERT INTO ${sql.ref(tableName)} (${sql.join(columnRefs, sql`, `)})
			VALUES (${sql.join(valuePlaceholders, sql`, `)})
		`.execute(this.db);
		invalidateCollectionCache(type);
		const item = await this.findById(type, id);
		if (!item) throw new Error("Failed to create content");
		return item;
	}
	/**
	* Generate a unique slug for a content item within a collection.
	*
	* Checks the collection table for existing slugs that match `baseSlug`
	* (optionally scoped to a locale) and appends a numeric suffix (`-1`,
	* `-2`, etc.) on collision to guarantee uniqueness.
	*
	* Returns `null` if `baseSlug` is empty after slugification.
	*/
	async generateUniqueSlug(type, text, locale) {
		const baseSlug = slugify(text);
		if (!baseSlug) return null;
		const tableName = getTableName(type);
		if ((locale ? await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug}
					AND locale = ${locale}
					LIMIT 1
				`.execute(this.db) : await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug}
					LIMIT 1
				`.execute(this.db)).rows.length === 0) return baseSlug;
		const pattern = `${baseSlug}-%`;
		const candidates = locale ? await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE (slug = ${baseSlug} OR slug LIKE ${pattern})
					AND locale = ${locale}
				`.execute(this.db) : await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug} OR slug LIKE ${pattern}
				`.execute(this.db);
		let maxSuffix = 0;
		const suffixPattern = new RegExp(`^${escapeRegExp(baseSlug)}-(\\d+)$`);
		for (const row of candidates.rows) {
			const match = suffixPattern.exec(row.slug);
			if (match) {
				const n = parseInt(match[1], 10);
				if (n > maxSuffix) maxSuffix = n;
			}
		}
		return `${baseSlug}-${maxSuffix + 1}`;
	}
	/**
	* Duplicate a content item
	* Creates a new draft copy with "(Copy)" appended to the title.
	* A slug is auto-generated from the new title by the handler layer.
	*/
	async duplicate(type, id, authorId) {
		const original = await this.findById(type, id);
		if (!original) throw new EmDashValidationError("Content item not found");
		const newData = { ...original.data };
		if (typeof newData.title === "string") newData.title = `${newData.title} (Copy)`;
		else if (typeof newData.name === "string") newData.name = `${newData.name} (Copy)`;
		const slugSource = typeof newData.title === "string" ? newData.title : typeof newData.name === "string" ? newData.name : null;
		const slug = slugSource ? await this.generateUniqueSlug(type, slugSource, original.locale ?? void 0) : null;
		return this.create({
			type,
			slug,
			data: newData,
			status: "draft",
			authorId: authorId || original.authorId || void 0,
			locale: original.locale ?? void 0
		});
	}
	/**
	* Find content by ID
	*/
	async findById(type, id) {
		const tableName = getTableName(type);
		const row = (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find content by id, including trashed (soft-deleted) items.
	* Used by restore endpoint for ownership checks.
	*/
	async findByIdIncludingTrashed(type, id) {
		const tableName = getTableName(type);
		const row = (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE id = ${id}
		`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find content by ID or slug. Tries ID first if it looks like a ULID,
	* otherwise tries slug. Falls back to the other if the first lookup misses.
	*/
	async findByIdOrSlug(type, identifier, locale) {
		return this._findByIdOrSlug(type, identifier, false, locale);
	}
	/**
	* Find content by ID or slug, including trashed (soft-deleted) items.
	* Used by restore/permanent-delete endpoints.
	*/
	async findByIdOrSlugIncludingTrashed(type, identifier, locale) {
		return this._findByIdOrSlug(type, identifier, true, locale);
	}
	async _findByIdOrSlug(type, identifier, includeTrashed, locale) {
		const looksLikeUlid = ULID_PATTERN.test(identifier);
		const findById = includeTrashed ? (t, id) => this.findByIdIncludingTrashed(t, id) : (t, id) => this.findById(t, id);
		const findBySlug = includeTrashed ? (t, s) => this.findBySlugIncludingTrashed(t, s, locale) : (t, s) => this.findBySlug(t, s, locale);
		try {
			if (looksLikeUlid) {
				const byId = await findById(type, identifier);
				if (byId) return byId;
				return await findBySlug(type, identifier);
			}
			const bySlug = await findBySlug(type, identifier);
			if (bySlug) return bySlug;
			return await findById(type, identifier);
		} catch (error) {
			if (isMissingTableError(error)) return null;
			throw error;
		}
	}
	/**
	* Find content by slug
	*/
	async findBySlug(type, slug, locale) {
		const tableName = getTableName(type);
		const row = (locale ? await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND locale = ${locale}
					AND deleted_at IS NULL
				`.execute(this.db) : await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND deleted_at IS NULL
					ORDER BY locale ASC
					LIMIT 1
				`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find content by slug, including trashed (soft-deleted) items.
	* Used by restore/permanent-delete endpoints.
	*/
	async findBySlugIncludingTrashed(type, slug, locale) {
		const tableName = getTableName(type);
		const row = (locale ? await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND locale = ${locale}
				`.execute(this.db) : await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					ORDER BY locale ASC
					LIMIT 1
				`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find many content items with filtering and pagination
	*/
	async findMany(type, options = {}) {
		const tableName = getTableName(type);
		const limit = Math.min(options.limit || 50, 100);
		const orderField = options.orderBy?.field || "createdAt";
		const orderDirection = options.orderBy?.direction || "desc";
		const dbField = this.mapOrderField(orderField);
		const safeOrderDirection = orderDirection.toLowerCase() === "asc" ? "ASC" : "DESC";
		let query = this.db.selectFrom(tableName).selectAll().where("deleted_at", "is", null);
		if (options.where?.status) query = query.where("status", "=", options.where.status);
		if (options.where?.authorId) query = query.where("author_id", "=", options.where.authorId);
		if (options.where?.locale) query = query.where("locale", "=", options.where.locale);
		query = this.applySearchFilter(query, options.where, type);
		query = this.applyDateFilter(query, options.where);
		if (options.cursor) {
			const { orderValue, id: cursorId } = decodeCursor(options.cursor);
			if (safeOrderDirection === "DESC") query = query.where((eb) => eb.or([eb(dbField, "<", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", "<", cursorId)])]));
			else query = query.where((eb) => eb.or([eb(dbField, ">", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", ">", cursorId)])]));
		}
		query = query.orderBy(dbField, safeOrderDirection === "ASC" ? "asc" : "desc").orderBy("id", safeOrderDirection === "ASC" ? "asc" : "desc").limit(limit + 1);
		const [rows, total] = await Promise.all([query.execute(), this.count(type, options.where)]);
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit);
		const mappedResult = {
			items: items.map((row) => this.mapRow(type, row)),
			total
		};
		if (hasMore && items.length > 0) {
			const lastRow = items.at(-1);
			const lastOrderValue = lastRow[dbField];
			mappedResult.nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
		}
		return mappedResult;
	}
	/**
	* Update content
	*/
	async update(type, id, input) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const updates = {};
		if (input.status !== void 0) updates.status = input.status;
		if (input.slug !== void 0) updates.slug = input.slug;
		if (input.publishedAt !== void 0) updates.published_at = input.publishedAt;
		if (input.scheduledAt !== void 0) updates.scheduled_at = input.scheduledAt;
		if (input.authorId !== void 0) updates.author_id = input.authorId;
		if (input.primaryBylineId !== void 0) updates.primary_byline_id = input.primaryBylineId;
		if (input.data !== void 0 && typeof input.data === "object") {
			for (const [key, value] of Object.entries(input.data)) if (!SYSTEM_COLUMNS.has(key)) {
				validateIdentifier(key, "content field name");
				updates[key] = serializeValue(value);
			}
		}
		const hasColumnWrites = Object.keys(updates).length > 0;
		if (hasColumnWrites) updates.updated_at = now;
		updates.version = sql`version + 1`;
		await this.db.updateTable(tableName).set(updates).where("id", "=", id).where("deleted_at", "is", null).execute();
		if (input.status !== void 0 || input.publishedAt !== void 0 || input.scheduledAt !== void 0) await this.restampEntryPivot(type, id);
		if (hasColumnWrites) invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Delete content (soft delete - moves to trash)
	*/
	async delete(type, id) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const changed = ((await sql`
			UPDATE ${sql.ref(tableName)}
			SET deleted_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db)).numAffectedRows ?? 0n) > 0n;
		if (changed) {
			await this.restampEntryPivot(type, id);
			invalidateCollectionCache(type);
		}
		return changed;
	}
	/**
	* Restore content from trash
	*/
	async restore(type, id) {
		const tableName = getTableName(type);
		const restored = (await sql`
			UPDATE ${sql.ref(tableName)}
			SET deleted_at = NULL
			WHERE id = ${id}
			AND deleted_at IS NOT NULL
			RETURNING *
		`.execute(this.db)).rows[0];
		if (!restored) return null;
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		return this.mapRow(type, restored);
	}
	/**
	* Re-stamp the denormalized filter + sort columns on every
	* `content_taxonomies` pivot row for an entry from its authoritative `ec_*`
	* row (migration 051). Called after any mutation that moves one of those
	* columns so a taxonomy-filtered listing can seek the entry directly.
	*
	* A single correlated `UPDATE` reads the post-mutation values from `ec_*`, so
	* the pivot converges to the authoritative row. This is NOT atomic with the
	* `ec_*` mutation on D1 (no transactions), which is why the read path
	* re-checks the real predicates on the joined `ec_*` row. Untagged entries
	* have no pivot rows, so the statement is a cheap no-op for them.
	*/
	async restampEntryPivot(type, id) {
		const tableName = getTableName(type);
		await sql`
			UPDATE content_taxonomies
			SET (status, scheduled_at, deleted_at, locale, published_at, created_at) = (
				SELECT status, scheduled_at, deleted_at, locale, published_at, created_at
				FROM ${sql.ref(tableName)}
				WHERE ${sql.ref(tableName)}.id = ${id}
			)
			WHERE collection = ${type} AND entry_id = ${id}
		`.execute(this.db);
	}
	/**
	* Permanently delete content (cannot be undone)
	*/
	/**
	* Permanently delete a soft-deleted content row.
	*
	* Returns `true` only when a soft-deleted (trashed) row was removed.
	* Returns `false` when no row exists OR when the row exists but is live —
	* the caller is responsible for distinguishing these cases (typically via
	* a follow-up `findByIdOrSlugIncludingTrashed` to surface NOT_FOUND vs
	* NOT_TRASHED). The `AND deleted_at IS NOT NULL` clause is the safety net
	* that prevents permanent delete from bypassing the trash workflow.
	*/
	async permanentDelete(type, id) {
		const tableName = getTableName(type);
		const changed = ((await sql`
			DELETE FROM ${sql.ref(tableName)}
			WHERE id = ${id}
			AND deleted_at IS NOT NULL
		`.execute(this.db)).numAffectedRows ?? 0n) > 0n;
		if (changed) invalidateCollectionCache(type);
		return changed;
	}
	/**
	* Find trashed content items
	*/
	async findTrashed(type, options = {}) {
		const tableName = getTableName(type);
		const limit = Math.min(options.limit || 50, 100);
		const orderField = options.orderBy?.field || "deletedAt";
		const orderDirection = options.orderBy?.direction || "desc";
		const dbField = this.mapOrderField(orderField);
		const safeOrderDirection = orderDirection.toLowerCase() === "asc" ? "ASC" : "DESC";
		let query = this.db.selectFrom(tableName).selectAll().where("deleted_at", "is not", null);
		if (options.cursor) {
			const { orderValue, id: cursorId } = decodeCursor(options.cursor);
			if (safeOrderDirection === "DESC") query = query.where((eb) => eb.or([eb(dbField, "<", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", "<", cursorId)])]));
			else query = query.where((eb) => eb.or([eb(dbField, ">", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", ">", cursorId)])]));
		}
		query = query.orderBy(dbField, safeOrderDirection === "ASC" ? "asc" : "desc").orderBy("id", safeOrderDirection === "ASC" ? "asc" : "desc").limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit);
		const mappedResult = { items: items.map((row) => {
			const record = row;
			return {
				...this.mapRow(type, record),
				deletedAt: typeof record.deleted_at === "string" ? record.deleted_at : ""
			};
		}) };
		if (hasMore && items.length > 0) {
			const lastRow = items.at(-1);
			const lastOrderValue = lastRow[dbField];
			mappedResult.nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
		}
		return mappedResult;
	}
	/**
	* Count trashed content items
	*/
	async countTrashed(type) {
		const tableName = getTableName(type);
		const result = await this.db.selectFrom(tableName).select((eb) => eb.fn.count("id").as("count")).where("deleted_at", "is not", null).executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Apply the optional `q` filter.
	*
	* When the handler sets `useFts` (collection has a healthy FTS5 index
	* covering the display columns; SQLite only), the filter is served from
	* the index: a token-prefix MATCH against `_emdash_fts_<slug>` OR'd with
	* an index-served `slug GLOB 'term*'` prefix (the slug is not in the FTS
	* index). Both sides are index-backed, so SQLite's OR optimization avoids
	* the full-table scan the LIKE fallback needs (#1517). The trade-off is
	* search semantics: token-prefix matching instead of arbitrary substring.
	*
	* Fallback (Postgres, search disabled, or no usable terms): case-
	* insensitive substring LIKE across the handler-resolved `searchColumns`
	* (OR'd). User input is treated literally (LIKE wildcards escaped) and
	* `lower()` is applied on both sides for SQLite/Postgres parity.
	*/
	applySearchFilter(query, where, type) {
		const term = where?.q?.trim();
		const columns = where?.searchColumns;
		if (!term || !columns || columns.length === 0) return query;
		if (where.useFts) {
			const match = buildFtsPrefixMatch(term);
			if (match) {
				validateIdentifier(type, "collection slug");
				const ftsTable = `_emdash_fts_${type}`;
				const slugPrefix = buildSlugGlobPrefix(term);
				return query.where((eb) => eb.or([sql`id IN (SELECT id FROM ${sql.ref(ftsTable)} WHERE ${sql.ref(ftsTable)} MATCH ${match})`, sql`slug GLOB ${slugPrefix}`]));
			}
		}
		const pattern = `%${term.replace(LIKE_WILDCARD_RE, (c) => `\\${c}`)}%`;
		return query.where((eb) => eb.or(columns.map((col) => {
			validateIdentifier(col, "search column");
			return eb(sql`lower(${sql.ref(col)})`, "like", sql`lower(${pattern}) escape '\\'`);
		})));
	}
	/**
	* Apply the optional inclusive date-range filter. The field is mapped
	* through `DATE_FILTER_COLUMNS` (a closed whitelist), and bounds compare
	* lexicographically against the stored ISO 8601 timestamps. A `publishedAt`
	* range naturally excludes never-published rows (their column is NULL).
	*/
	applyDateFilter(query, where) {
		const filter = where?.dateFilter;
		if (!filter) return query;
		const column = DATE_FILTER_COLUMNS[filter.field];
		if (!column) throw new EmDashValidationError(`Invalid date filter field: ${filter.field}`);
		const { from, to } = filter;
		if (!from && !to) return query;
		let next = query;
		if (from) next = next.where((eb) => eb(column, ">=", from));
		if (to) next = next.where((eb) => eb(column, "<=", to));
		return next;
	}
	/**
	* Count content items
	*/
	async count(type, where) {
		const tableName = getTableName(type);
		let query = this.db.selectFrom(tableName).select((eb) => eb.fn.count("id").as("count")).where("deleted_at", "is", null);
		if (where?.status) query = query.where("status", "=", where.status);
		if (where?.authorId) query = query.where("author_id", "=", where.authorId);
		if (where?.locale) query = query.where("locale", "=", where.locale);
		query = this.applySearchFilter(query, where, type);
		query = this.applyDateFilter(query, where);
		const result = await query.executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Distinct, non-null `author_id` values across the collection's live
	* (non-trashed) content. Used to populate the admin author filter with
	* only the users who have actually authored entries, rather than the
	* full user directory (which requires admin privileges to read).
	*/
	async findDistinctAuthorIds(type) {
		const tableName = getTableName(type);
		return (await this.db.selectFrom(tableName).select("author_id").distinct().where("deleted_at", "is", null).where("author_id", "is not", null).execute()).map((row) => row.author_id).filter((id) => id !== null);
	}
	async getStats(type) {
		const tableName = getTableName(type);
		const result = await this.db.selectFrom(tableName).select((eb) => [
			eb.fn.count("id").as("total"),
			eb.fn.sum(eb.case().when("status", "=", "published").then(1).else(0).end()).as("published"),
			eb.fn.sum(eb.case().when("status", "=", "draft").then(1).else(0).end()).as("draft"),
			sql`SUM(CASE WHEN scheduled_at IS NOT NULL THEN 1 ELSE 0 END)`.as("scheduled")
		]).where("deleted_at", "is", null).executeTakeFirst();
		return {
			total: Number(result?.total || 0),
			published: Number(result?.published || 0),
			draft: Number(result?.draft || 0),
			scheduled: Number(result?.scheduled || 0)
		};
	}
	/**
	* Schedule content for future publishing
	*
	* Sets status to 'scheduled' and stores the scheduled publish time.
	* The content will be auto-published when the scheduled time is reached.
	*/
	async schedule(type, id, scheduledAt) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const scheduledDate = new Date(scheduledAt);
		if (isNaN(scheduledDate.getTime())) throw new EmDashValidationError("Invalid scheduled date");
		if (scheduledDate <= /* @__PURE__ */ new Date()) throw new EmDashValidationError("Scheduled date must be in the future");
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		const newStatus = existing.status === "published" ? "published" : "scheduled";
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET status = ${newStatus},
				scheduled_at = ${scheduledAt},
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Unschedule content
	*
	* Clears the scheduled time. Published posts stay published;
	* draft/scheduled posts revert to 'draft'.
	*/
	async unschedule(type, id) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		const newStatus = existing.status === "published" ? "published" : "draft";
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET status = ${newStatus},
				scheduled_at = NULL,
				updated_at = ${now}
			WHERE id = ${id}
			AND scheduled_at IS NOT NULL
			AND deleted_at IS NULL
		`.execute(this.db);
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Find content that is ready to be published
	*
	* Returns all content where scheduled_at <= now, regardless of status.
	* This covers both draft-scheduled posts (status='scheduled') and
	* published posts with scheduled draft changes (status='published').
	*
	* `limit` (optional) caps how many due rows are returned, oldest-due first.
	* The scheduled-publishing sweep passes a limit so a large backlog can't
	* fan out unbounded publish/webhook work in a single tick (and blow a Worker
	* invocation's CPU/subrequest budget); the remainder drains on later ticks.
	*/
	async findReadyToPublish(type, limit) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const limitClause = typeof limit === "number" && Number.isInteger(limit) && limit > 0 ? sql`LIMIT ${limit}` : sql``;
		return (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE scheduled_at IS NOT NULL
			AND scheduled_at <= ${now}
			AND deleted_at IS NULL
			ORDER BY scheduled_at ASC
			${limitClause}
		`.execute(this.db)).rows.map((row) => this.mapRow(type, row));
	}
	/**
	* Find all translations in a translation group
	*/
	async findTranslations(type, translationGroup) {
		const tableName = getTableName(type);
		return (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE translation_group = ${translationGroup}
			AND deleted_at IS NULL
			ORDER BY locale ASC
		`.execute(this.db)).rows.map((row) => this.mapRow(type, row));
	}
	/**
	* Batch variant of {@link findTranslations}: every (non-deleted) locale
	* variant for any of `translationGroups`, in one `WHERE translation_group IN
	* (...)` query chunked at `SQL_BATCH_SIZE` for D1's bind-parameter limit.
	* Lets callers resolve many edge groups without an N+1 per group. The caller
	* groups the flat result by `translationGroup` itself.
	*
	* `publishedOnly` restricts the result to `status = 'published'` — reference
	* reads pass this for callers without `content:read_drafts` so draft/scheduled
	* entries never leak through an edge traversal.
	*
	* A reference edge stores only a collection slug (no SQL FK), so the table may
	* have been dropped since the edge was written. That is a tolerated dangling
	* state, not an error: a missing table resolves to no rows, mirroring how the
	* content read handlers treat `isMissingTableError`.
	*/
	async findTranslationsForGroups(type, translationGroups, options = {}) {
		if (translationGroups.length === 0) return [];
		const tableName = getTableName(type);
		const publishedFilter = options.publishedOnly ? sql`AND status = 'published'` : sql``;
		const items = [];
		try {
			for (const chunk of chunks(translationGroups, 50)) {
				const result = await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE translation_group IN (${sql.join(chunk)})
					AND deleted_at IS NULL
					${publishedFilter}
					ORDER BY locale ASC
				`.execute(this.db);
				for (const row of result.rows) items.push(this.mapRow(type, row));
			}
		} catch (error) {
			if (isMissingTableError(error)) return [];
			throw error;
		}
		return items;
	}
	/**
	* Batch variant of {@link findByIdOrSlug}: resolve many identifiers (each an
	* id OR a slug) within `type` in a constant number of queries — one `WHERE id
	* IN (...)` and one `WHERE slug IN (...)`, each chunked at `SQL_BATCH_SIZE`.
	* Returns a map from the input identifier to its resolved item; identifiers
	* that match nothing are absent. Used on write paths that accept a list of
	* references, so a single request doesn't fan out to an N+1 of point lookups.
	*
	* Resolution mirrors {@link findByIdOrSlug}: a ULID-shaped identifier prefers
	* the id match and falls back to slug; anything else prefers the slug match
	* and falls back to id. Slug matches collapse to the lowest-locale variant
	* (`ORDER BY locale ASC`), matching the slug-without-locale lookup.
	*/
	async findManyByIdOrSlug(type, identifiers) {
		const resolved = /* @__PURE__ */ new Map();
		const unique = [...new Set(identifiers)];
		if (unique.length === 0) return resolved;
		const tableName = getTableName(type);
		const byId = /* @__PURE__ */ new Map();
		const bySlug = /* @__PURE__ */ new Map();
		try {
			for (const chunk of chunks(unique, 50)) {
				const idRows = await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE id IN (${sql.join(chunk)})
					AND deleted_at IS NULL
				`.execute(this.db);
				for (const row of idRows.rows) {
					const item = this.mapRow(type, row);
					byId.set(item.id, item);
				}
				const slugRows = await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug IN (${sql.join(chunk)})
					AND deleted_at IS NULL
					ORDER BY locale ASC
				`.execute(this.db);
				for (const row of slugRows.rows) {
					const item = this.mapRow(type, row);
					if (item.slug != null && !bySlug.has(item.slug)) bySlug.set(item.slug, item);
				}
			}
		} catch (error) {
			if (isMissingTableError(error)) return resolved;
			throw error;
		}
		for (const identifier of unique) {
			const item = ULID_PATTERN.test(identifier) ? byId.get(identifier) ?? bySlug.get(identifier) : bySlug.get(identifier) ?? byId.get(identifier);
			if (item) resolved.set(identifier, item);
		}
		return resolved;
	}
	/**
	* Publish the current draft
	*
	* Promotes draft_revision_id to live_revision_id and clears draft pointer.
	* Syncs the draft revision's data into the content table columns so the
	* content table always reflects the published version.
	* If no draft revision exists, creates one from current data and publishes it.
	*
	* `publishedAt` (optional) overrides the publication timestamp. If omitted,
	* the existing `published_at` is preserved (idempotent re-publish keeps the
	* original date) and falls back to the current time on first publish. Pass
	* an explicit value to backdate a publish (e.g. when migrating content from
	* another CMS).
	*
	* `requireDue` (optional) gates the publish on the row still being due:
	* `scheduled_at` non-null and in the past. Used by the scheduled-publishing
	* sweep to avoid publishing content an editor unscheduled or rescheduled
	* between selection and publish. It claims the row with a single conditional
	* UPDATE (clearing `scheduled_at`) before any other write, so it is atomic
	* even on D1 (no multi-statement transactions) and serialises against
	* `unschedule()` and concurrent sweeps — no TOCTOU and no double publish.
	*/
	async publish(type, id, publishedAt, requireDue = false) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		let claimedScheduledAt = null;
		let claimedUpdatedAt = null;
		if (requireDue) {
			if (((await sql`
				UPDATE ${sql.ref(tableName)}
				SET scheduled_at = NULL,
					updated_at = ${now}
				WHERE id = ${id}
				AND scheduled_at IS NOT NULL
				AND scheduled_at <= ${now}
				AND deleted_at IS NULL
			`.execute(this.db)).numAffectedRows ?? 0n) === 0n) throw new ScheduledNotDueError();
			claimedScheduledAt = existing.scheduledAt;
			claimedUpdatedAt = existing.updatedAt;
		}
		let publishCommitted = false;
		try {
			const revisionRepo = new RevisionRepository(this.db);
			let revisionToPublish = existing.draftRevisionId || existing.liveRevisionId;
			if (!revisionToPublish) revisionToPublish = (await revisionRepo.create({
				collection: type,
				entryId: id,
				data: existing.data
			})).id;
			const revision = await revisionRepo.findById(revisionToPublish);
			if (revision) {
				const stagedSlug = typeof revision.data._slug === "string" ? revision.data._slug : null;
				if (stagedSlug !== null && stagedSlug !== existing.slug && existing.locale !== null) {
					const conflict = await this.findBySlugIncludingTrashed(type, stagedSlug, existing.locale);
					if (conflict && conflict.id !== id) throw new EmDashValidationError(`Cannot publish: slug '${stagedSlug}' is already used by another entry in this collection (id: ${conflict.id}). Choose a different slug.`, { code: "SLUG_CONFLICT" });
				}
				if (stagedSlug !== null) await sql`
						UPDATE ${sql.ref(tableName)}
						SET slug = ${stagedSlug}
						WHERE id = ${id}
					`.execute(this.db);
				await this.syncDataColumns(type, id, revision.data);
			}
			if (publishedAt !== void 0) await sql`
					UPDATE ${sql.ref(tableName)}
					SET live_revision_id = ${revisionToPublish},
						draft_revision_id = NULL,
						status = 'published',
						scheduled_at = NULL,
						published_at = ${publishedAt},
						updated_at = ${now}
					WHERE id = ${id}
					AND deleted_at IS NULL
				`.execute(this.db);
			else await sql`
					UPDATE ${sql.ref(tableName)}
					SET live_revision_id = ${revisionToPublish},
						draft_revision_id = NULL,
						status = 'published',
						scheduled_at = NULL,
						published_at = COALESCE(published_at, ${now}),
						updated_at = ${now}
					WHERE id = ${id}
					AND deleted_at IS NULL
				`.execute(this.db);
			publishCommitted = true;
			await this.restampEntryPivot(type, id);
			const updated = await this.findById(type, id);
			if (!updated) throw new Error("Content not found");
			invalidateCollectionCache(type);
			return updated;
		} catch (error) {
			if (requireDue && claimedScheduledAt && !publishCommitted) try {
				await sql`
						UPDATE ${sql.ref(tableName)}
						SET scheduled_at = ${claimedScheduledAt},
							updated_at = ${claimedUpdatedAt ?? now}
						WHERE id = ${id}
						AND scheduled_at IS NULL
						AND deleted_at IS NULL
						AND (status != 'published' OR draft_revision_id IS NOT NULL)
					`.execute(this.db);
			} catch (restoreError) {
				console.error(`[content] Failed to restore schedule for ${type}/${id} after publish failure:`, restoreError);
			}
			throw error;
		}
	}
	/**
	* Unpublish content
	*
	* Removes live pointer but preserves draft. If no draft exists,
	* creates one from the live version so the content isn't lost.
	*/
	async unpublish(type, id) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		if (!existing.draftRevisionId && existing.liveRevisionId) {
			const revisionRepo = new RevisionRepository(this.db);
			const liveRevision = await revisionRepo.findById(existing.liveRevisionId);
			if (liveRevision) {
				const draft = await revisionRepo.create({
					collection: type,
					entryId: id,
					data: liveRevision.data
				});
				await sql`
					UPDATE ${sql.ref(tableName)}
					SET draft_revision_id = ${draft.id}
					WHERE id = ${id}
				`.execute(this.db);
			}
		}
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET live_revision_id = NULL,
				status = 'draft',
				published_at = NULL,
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Set the draft revision pointer for a content item.
	*
	* Used by seed/import paths that stage a new revision's data before
	* promoting it to live via `publish()`.
	*
	* Validates that the content item exists and is not soft-deleted, that
	* the revision exists, and that the revision belongs to the same
	* collection and entry. Without these checks, a caller could leave the
	* content row pointing at a missing or unrelated revision.
	*/
	async setDraftRevision(type, id, revisionId) {
		const tableName = getTableName(type);
		if (!await this.findById(type, id)) throw new EmDashValidationError("Content item not found");
		const revision = await new RevisionRepository(this.db).findById(revisionId);
		if (!revision) throw new EmDashValidationError("Revision not found");
		if (revision.collection !== type || revision.entryId !== id) throw new EmDashValidationError("Revision does not belong to the specified content item");
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET draft_revision_id = ${revisionId}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
	}
	/**
	* Discard pending draft changes
	*
	* Clears draft_revision_id. The content table columns already hold the
	* published version, so no data sync is needed.
	*/
	async discardDraft(type, id) {
		const tableName = getTableName(type);
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		if (!existing.draftRevisionId) return existing;
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET draft_revision_id = NULL
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Sync data columns in the content table from a data object.
	* Used to promote revision data into the content table on publish.
	* Keys starting with _ are revision metadata (e.g. _slug) and are skipped.
	*/
	async syncDataColumns(type, id, data) {
		const tableName = getTableName(type);
		const updates = {};
		for (const [key, value] of Object.entries(data)) {
			if (SYSTEM_COLUMNS.has(key)) continue;
			if (key.startsWith("_")) continue;
			validateIdentifier(key, "content field name");
			updates[key] = serializeValue(value);
		}
		if (Object.keys(updates).length === 0) return;
		await this.db.updateTable(tableName).set(updates).where("id", "=", id).execute();
	}
	/**
	* Count content items with a pending schedule.
	* Includes both draft-scheduled (status='scheduled') and published
	* posts with scheduled draft changes (status='published', scheduled_at set).
	*/
	async countScheduled(type) {
		const tableName = getTableName(type);
		const result = await sql`
			SELECT COUNT(id) as count FROM ${sql.ref(tableName)}
			WHERE scheduled_at IS NOT NULL
			AND deleted_at IS NULL
		`.execute(this.db);
		return Number(result.rows[0]?.count || 0);
	}
	/**
	* Map database row to ContentItem
	* Extracts system columns and puts content fields in data
	* Excludes null values from data to match input semantics
	*/
	mapRow(type, row) {
		const data = {};
		for (const [key, value] of Object.entries(row)) if (!SYSTEM_COLUMNS.has(key) && value !== null) data[key] = deserializeValue(value);
		return {
			id: row.id,
			type,
			slug: row.slug,
			status: row.status,
			data,
			authorId: row.author_id,
			primaryBylineId: row.primary_byline_id ?? null,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			publishedAt: row.published_at,
			scheduledAt: row.scheduled_at,
			liveRevisionId: row.live_revision_id ?? null,
			draftRevisionId: row.draft_revision_id ?? null,
			version: typeof row.version === "number" ? row.version : 1,
			locale: row.locale ?? null,
			translationGroup: row.translation_group ?? null
		};
	}
	/**
	* Map order field names to database columns.
	* Only allows known fields to prevent column enumeration via crafted orderBy values.
	*/
	mapOrderField(field) {
		const mapped = {
			createdAt: "created_at",
			updatedAt: "updated_at",
			publishedAt: "published_at",
			scheduledAt: "scheduled_at",
			deletedAt: "deleted_at",
			title: "title",
			name: "name",
			slug: "slug",
			status: "status",
			locale: "locale"
		}[field];
		if (!mapped) throw new EmDashValidationError(`Invalid order field: ${field}`);
		return mapped;
	}
};
//#endregion
export { slugify as i, RevisionRepository as n, content_exports as r, ContentRepository as t };
