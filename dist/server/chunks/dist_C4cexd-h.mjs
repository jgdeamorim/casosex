import { C as string, _ as number, v as object } from "./schemas_CzTFUUcv.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import { t as sql } from "./dist_D4nVBoqy.mjs";
import { _ as pluginDataExtractExpr, b as validateIdentifier, v as pluginDataOrderExpr } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./request-context_K9BAblf6.mjs";
import { n as cachedQuery, t as CacheNamespace } from "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import { a as encodeCursor, i as decodeCursor } from "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import "./chunks-D5dlPeRb_ZNPg27dD.mjs";
import { t as ContentRepository } from "./content-CpfKV9QE_DeIsRghk.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import { t as UserRepository } from "./user-BAumEmpA_79fxFfjA.mjs";
import { t as TaxonomyRepository } from "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { t as enrichImageMetadata } from "./enrich-CFJJgxs__9Ib7u08c.mjs";
import { pt as SeoRepository } from "./query-1xOcEy18_dGFoQgZT.mjs";
import { p as markContentMediaUsageCollectionStaleSafely } from "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import { r as requestCached } from "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import { a as getDb } from "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { r as invalidateSiteSettingsCache } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import { i as stripCredentialHeaders, n as resolveAndValidateExternalUrl, t as SsrfError } from "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import { t as CronAccessImpl } from "./cron-BlKIMD_e_DKU8q02k.mjs";
import { i as resolveLocaleChain, r as resolveLocale } from "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import { s as normalizeCapabilities } from "./manifest-schema-bCq54i7F_oDiktgui.mjs";
import { dt as sanitizeHref } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as extractRequestMeta } from "./request-meta-DzXYYI-n_Dva0zy5x.mjs";
import "./comment-reaction-BUlUz2bh_Vu4AnkyX.mjs";
import "./menus-BxPLFfIc_Qsmtjm90.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import "./byline-C5TAqs8N_UXuC5WkK.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import "./registry-BP1JK2xh_C4nDpLUe.mjs";
import "./dashboard-DoBwPnON_BZ6Klac5.mjs";
import "./media-usage-DPJcNaAq_CWA56Ri3.mjs";
import "./zod-generator-DMzfga3g_DxHzNpJC.mjs";
import "./schema-eqZhkR0S_CJC5oLyH.mjs";
import "./sections-DSuEfirn_LC35OjDp.mjs";
import "./settings-CREKyj8I_sz1CfsBP.mjs";
import "./taxonomies-Dbdki3Un_Dc3Q5ZJ8.mjs";
import "./error-DmmN74gW_Djmejxxh.mjs";
import "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./query-DCiXI7OZ_B3DBnk_t.mjs";
import "./import-PKhLeXvn_D32uTAAY.mjs";
import "./email-console-C-9Ng8DM_BLDmwlIU.mjs";
import "./preview-D4Jnbfx7_C8PM7iIF.mjs";
import "./bylines-B8-WGdja_BuJyweeN.mjs";
import "./widgets-L-VndTKD_CdeTNh8j.mjs";
import "./validate-Bs_wT2ul_BPxJkgx-.mjs";
import "./apply-1_6ra7NP_C-N_rG76.mjs";
import "./load-BwTdWE8B_DBSeomMw.mjs";
import "./search-CeO678cp_BTXu7Bkl.mjs";
import "./adapt-sandbox-entry_JNVXbwwQ.mjs";
import { t as buildSeoImageUrl } from "./media-url-BCm5vBn6_i6P7Yse3.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region self-essentials/emdash-main/packages/core/dist/context-kO4YZB03.mjs
/**
* Error thrown when querying non-indexed fields
*/
var StorageQueryError = class extends Error {
	constructor(message, field, suggestion) {
		super(message);
		this.field = field;
		this.suggestion = suggestion;
		this.name = "StorageQueryError";
	}
};
/**
* Check if a value is a range filter
*/
function isRangeFilter(value) {
	if (typeof value !== "object" || value === null) return false;
	return "gt" in value || "gte" in value || "lt" in value || "lte" in value;
}
/**
* Check if a value is an IN filter
*/
function isInFilter(value) {
	if (typeof value !== "object" || value === null) return false;
	return "in" in value && Array.isArray(value.in);
}
/**
* Check if a value is a startsWith filter
*/
function isStartsWithFilter(value) {
	if (typeof value !== "object" || value === null) return false;
	return "startsWith" in value && typeof value.startsWith === "string";
}
/**
* Escape LIKE pattern metacharacters so a startsWith prefix matches
* literally. Without this, `%` and `_` in the prefix act as wildcards
* (e.g. `{ startsWith: "50%" }` would match "50x off").
*/
function escapeLikePattern(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
/**
* Get the set of indexed fields from index declarations
*/
function getIndexedFields(indexes) {
	const fields = /* @__PURE__ */ new Set();
	for (const index of indexes) if (Array.isArray(index)) for (const field of index) fields.add(field);
	else fields.add(index);
	return fields;
}
/**
* Validate that all fields in a where clause are indexed
*/
function validateWhereClause(where, indexedFields, pluginId, collection) {
	for (const field of Object.keys(where)) if (!indexedFields.has(field)) throw new StorageQueryError(`Cannot query on non-indexed field '${field}'.`, field, `Add '${field}' to storage.${collection}.indexes in plugin '${pluginId}' to enable this query.`);
}
/**
* Validate orderBy fields are indexed
*/
function validateOrderByClause(orderBy, indexedFields, pluginId, collection) {
	for (const field of Object.keys(orderBy)) if (!indexedFields.has(field)) throw new StorageQueryError(`Cannot order by non-indexed field '${field}'.`, field, `Add '${field}' to storage.${collection}.indexes in plugin '${pluginId}' to enable ordering by this field.`);
}
/**
* SQL expression for extracting a queryable field from the `_plugin_storage.data`
* column.
*
* Delegates to `pluginDataExtractExpr`, which validates the field name before
* interpolation and applies the dialect-correct extraction: a `::jsonb` cast on
* Postgres (the `data` column is `text`) plus an optional type-guarded
* `::numeric` cast so numeric comparisons don't fall back to lexical text
* ordering.
*/
function jsonExtract(db, field, options) {
	return pluginDataExtractExpr(db, field, options);
}
/**
* SQL expression for ordering by a `_plugin_storage.data` field.
*
* Delegates to `pluginDataOrderExpr`, which orders over the jsonb-native value
* on Postgres so numeric fields sort numerically (not lexically) while staying
* total across heterogeneous data. SQLite keeps `json_extract` (already numeric).
*/
function jsonOrderExtract(db, field) {
	return pluginDataOrderExpr(db, field);
}
/**
* Build a WHERE clause condition for a single field
*/
function buildCondition(db, field, value) {
	const extractFor = (numeric) => jsonExtract(db, field, { numeric });
	if (value === null) return {
		sql: `${extractFor(false)} IS NULL`,
		params: []
	};
	if (typeof value === "number") return {
		sql: `${extractFor(true)} = ?`,
		params: [value]
	};
	if (typeof value === "string") return {
		sql: `${extractFor(false)} = ?`,
		params: [value]
	};
	if (typeof value === "boolean") return {
		sql: `${extractFor(false)} = ?`,
		params: [value]
	};
	if (isInFilter(value)) {
		const numeric = value.in.length > 0 && value.in.every((v) => typeof v === "number");
		const placeholders = value.in.map(() => "?").join(", ");
		return {
			sql: `${extractFor(numeric)} IN (${placeholders})`,
			params: value.in
		};
	}
	if (isStartsWithFilter(value)) return {
		sql: `${extractFor(false)} LIKE ? ESCAPE '\\'`,
		params: [`${escapeLikePattern(value.startsWith)}%`]
	};
	if (isRangeFilter(value)) {
		const conditions = [];
		const params = [];
		const pushBound = (op, bound) => {
			conditions.push(`${extractFor(typeof bound === "number")} ${op} ?`);
			params.push(bound);
		};
		if (value.gt !== void 0) pushBound(">", value.gt);
		if (value.gte !== void 0) pushBound(">=", value.gte);
		if (value.lt !== void 0) pushBound("<", value.lt);
		if (value.lte !== void 0) pushBound("<=", value.lte);
		return {
			sql: conditions.join(" AND "),
			params
		};
	}
	throw new StorageQueryError(`Unknown filter type for field '${field}'`);
}
/**
* Build a complete WHERE clause from a WhereClause object
*/
function buildWhereClause(db, where) {
	const conditions = [];
	const params = [];
	for (const [field, value] of Object.entries(where)) {
		const condition = buildCondition(db, field, value);
		conditions.push(condition.sql);
		params.push(...condition.params);
	}
	if (conditions.length === 0) return {
		sql: "",
		params: []
	};
	return {
		sql: conditions.join(" AND "),
		params
	};
}
/**
* Interleave a `?`-placeholder SQL string with its params into a single
* boolean raw expression. Used as a WHERE predicate directly — wrapping it
* in `(...) = 1` breaks on Postgres, which has a strict boolean type (#920).
*/
function rawWhereExpr(sqlText, params) {
	const parts = [];
	let paramIndex = 0;
	const sqlParts = sqlText.split("?");
	for (let i = 0; i < sqlParts.length; i++) {
		if (i > 0) parts.push(sql`${params[paramIndex++]}`);
		if (sqlParts[i]) parts.push(sql.raw(sqlParts[i]));
	}
	return sql`(${sql.join(parts, sql.raw(""))})`;
}
/**
* Plugin Storage Repository
*
* Implements the StorageCollection interface for a specific plugin and collection.
*/
var PluginStorageRepository = class {
	indexedFields;
	constructor(db, pluginId, collection, indexes) {
		this.db = db;
		this.pluginId = pluginId;
		this.collection = collection;
		this.indexedFields = getIndexedFields(indexes);
	}
	/**
	* Get a document by ID
	*/
	async get(id) {
		const row = await this.db.selectFrom("_plugin_storage").select("data").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst();
		if (!row) return null;
		return JSON.parse(row.data);
	}
	/**
	* Store a document
	*/
	async put(id, data) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const jsonData = JSON.stringify(data);
		await this.db.insertInto("_plugin_storage").values({
			plugin_id: this.pluginId,
			collection: this.collection,
			id,
			data: jsonData,
			created_at: now,
			updated_at: now
		}).onConflict((oc) => oc.columns([
			"plugin_id",
			"collection",
			"id"
		]).doUpdateSet({
			data: jsonData,
			updated_at: now
		})).execute();
	}
	/**
	* Delete a document
	*/
	async delete(id) {
		return ((await this.db.deleteFrom("_plugin_storage").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
	}
	/**
	* Check if a document exists
	*/
	async exists(id) {
		return !!await this.db.selectFrom("_plugin_storage").select("id").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst();
	}
	/**
	* Get multiple documents by ID
	*/
	async getMany(ids) {
		if (ids.length === 0) return /* @__PURE__ */ new Map();
		const rows = await this.db.selectFrom("_plugin_storage").select(["id", "data"]).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "in", ids).execute();
		const result = /* @__PURE__ */ new Map();
		for (const row of rows) result.set(row.id, JSON.parse(row.data));
		return result;
	}
	/**
	* Store multiple documents
	*/
	async putMany(items) {
		if (items.length === 0) return;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await withTransaction(this.db, async (trx) => {
			for (const item of items) {
				const jsonData = JSON.stringify(item.data);
				await trx.insertInto("_plugin_storage").values({
					plugin_id: this.pluginId,
					collection: this.collection,
					id: item.id,
					data: jsonData,
					created_at: now,
					updated_at: now
				}).onConflict((oc) => oc.columns([
					"plugin_id",
					"collection",
					"id"
				]).doUpdateSet({
					data: jsonData,
					updated_at: now
				})).execute();
			}
		});
	}
	/**
	* Delete multiple documents
	*/
	async deleteMany(ids) {
		if (ids.length === 0) return 0;
		const result = await this.db.deleteFrom("_plugin_storage").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "in", ids).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Query documents with filters
	*/
	async query(options = {}) {
		const { where = {}, orderBy = {}, cursor } = options;
		const limit = Math.min(options.limit ?? 50, 100);
		validateWhereClause(where, this.indexedFields, this.pluginId, this.collection);
		if (Object.keys(orderBy).length > 0) validateOrderByClause(orderBy, this.indexedFields, this.pluginId, this.collection);
		let query = this.db.selectFrom("_plugin_storage").select([
			"id",
			"data",
			"created_at"
		]).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection);
		const whereResult = buildWhereClause(this.db, where);
		if (whereResult.sql) query = query.where(rawWhereExpr(whereResult.sql, whereResult.params));
		if (cursor) {
			const decoded = decodeCursor(cursor);
			query = query.where(({ eb }) => eb(sql`(created_at, id)`, ">", sql`(${decoded.orderValue}, ${decoded.id})`));
		}
		if (Object.keys(orderBy).length > 0) for (const [field, direction] of Object.entries(orderBy)) {
			const extract = jsonOrderExtract(this.db, field);
			const orderExpr = direction === "desc" ? sql`${sql.raw(extract)} desc` : sql`${sql.raw(extract)} asc`;
			query = query.orderBy(orderExpr);
		}
		else query = query.orderBy("created_at", "asc").orderBy("id", "asc");
		query = query.limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit).map((row) => ({
			id: row.id,
			data: JSON.parse(row.data)
		}));
		let nextCursor;
		if (hasMore) {
			const lastItem = rows[limit - 1];
			if (lastItem) nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
		}
		return {
			items,
			cursor: nextCursor,
			hasMore
		};
	}
	/**
	* Count documents matching a filter
	*/
	async count(where) {
		if (where && Object.keys(where).length > 0) validateWhereClause(where, this.indexedFields, this.pluginId, this.collection);
		let query = this.db.selectFrom("_plugin_storage").select(sql`COUNT(*)`.as("count")).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection);
		if (where && Object.keys(where).length > 0) {
			const whereResult = buildWhereClause(this.db, where);
			if (whereResult.sql) query = query.where(rawWhereExpr(whereResult.sql, whereResult.params));
		}
		const result = await query.executeTakeFirst();
		return Number(result?.count ?? 0);
	}
};
/**
* Create KV accessor for a plugin
* All keys are automatically prefixed with the plugin ID
*/
function createKVAccess(optionsRepo, pluginId) {
	const prefix = `plugin:${pluginId}:`;
	return {
		async get(key) {
			return optionsRepo.get(`${prefix}${key}`);
		},
		async set(key, value) {
			await optionsRepo.set(`${prefix}${key}`, value);
		},
		async delete(key) {
			return optionsRepo.delete(`${prefix}${key}`);
		},
		async list(keyPrefix) {
			const fullPrefix = `${prefix}${keyPrefix ?? ""}`;
			const entriesMap = await optionsRepo.getByPrefix(fullPrefix);
			const result = [];
			for (const [fullKey, value] of entriesMap) result.push({
				key: fullKey.slice(prefix.length),
				value
			});
			return result;
		}
	};
}
/**
* Create storage collection accessor for a plugin
* Wraps PluginStorageRepository with the v2 interface (no async iterators)
*/
function createStorageCollection(db, pluginId, collectionName, indexes) {
	const repo = new PluginStorageRepository(db, pluginId, collectionName, indexes);
	return {
		get: (id) => repo.get(id),
		put: (id, data) => repo.put(id, data),
		delete: (id) => repo.delete(id),
		exists: (id) => repo.exists(id),
		getMany: (ids) => repo.getMany(ids),
		putMany: (items) => repo.putMany(items),
		deleteMany: (ids) => repo.deleteMany(ids),
		count: (where) => repo.count(where),
		async query(options) {
			const result = await repo.query({
				where: options?.where,
				orderBy: options?.orderBy,
				limit: options?.limit,
				cursor: options?.cursor
			});
			return {
				items: result.items,
				cursor: result.cursor,
				hasMore: result.hasMore
			};
		}
	};
}
/**
* Create storage accessor with all declared collections
*/
function createStorageAccess(db, pluginId, storageConfig) {
	const storage = {};
	for (const [collectionName, config] of Object.entries(storageConfig)) storage[collectionName] = createStorageCollection(db, pluginId, collectionName, [...config.indexes, ...config.uniqueIndexes ?? []]);
	return storage;
}
/**
* Extract `seo` from a plugin-supplied content write input and return both
* parts. Mutates nothing — returns a new field map without the `seo` key.
*/
function splitSeoFromInput(input) {
	const { seo, ...fields } = input;
	if (seo !== void 0 && (seo === null || typeof seo !== "object" || Array.isArray(seo))) throw new Error("content.seo must be an object");
	return {
		fields,
		seo
	};
}
/**
* Reject writing SEO to a collection that does not have it enabled.
* Matches the REST API behavior (VALIDATION_ERROR).
*/
async function assertSeoEnabled(seoRepo, collection, seo) {
	const hasSeo = await seoRepo.isEnabled(collection);
	if (seo !== void 0 && !hasSeo) throw new Error(`Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`);
	return hasSeo;
}
/**
* Parse the `collections` JSON column into a string array (`[]` on anything
* else). Mirrors the guards in the Cloudflare/workerd bridges so an
* in-process plugin degrades on malformed data instead of crashing.
*/
function parseCollectionsColumn(value) {
	if (!value) return [];
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
	} catch {
		return [];
	}
}
/** Map a repository `Taxonomy` row to the plugin-facing term shape. */
function taxonomyToTermInfo(term) {
	return {
		id: term.id,
		taxonomy: term.name,
		slug: term.slug,
		label: term.label,
		parentId: term.parentId,
		data: term.data,
		locale: term.locale,
		translationGroup: term.translationGroup
	};
}
/**
* Create read-only content access
*/
function createContentAccess(db) {
	const contentRepo = new ContentRepository(db);
	const seoRepo = new SeoRepository(db);
	return {
		async get(collection, id) {
			const item = await contentRepo.findById(collection, id);
			if (!item) return null;
			const result = {
				id: item.id,
				type: item.type,
				slug: item.slug,
				status: item.status,
				data: item.data,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
				locale: item.locale,
				publishedAt: item.publishedAt,
				scheduledAt: item.scheduledAt
			};
			if (await seoRepo.isEnabled(collection)) result.seo = await seoRepo.get(collection, item.id);
			return result;
		},
		async list(collection, options) {
			let orderBy;
			if (options?.orderBy) {
				const first = Object.entries(options.orderBy)[0];
				if (first) orderBy = {
					field: first[0],
					direction: first[1]
				};
			}
			const result = await contentRepo.findMany(collection, {
				limit: options?.limit ?? 50,
				cursor: options?.cursor,
				orderBy,
				where: options?.where
			});
			const items = result.items.map((item) => ({
				id: item.id,
				type: item.type,
				slug: item.slug,
				status: item.status,
				data: item.data,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
				locale: item.locale,
				publishedAt: item.publishedAt,
				scheduledAt: item.scheduledAt
			}));
			if (items.length > 0 && await seoRepo.isEnabled(collection)) {
				const seoMap = await seoRepo.getMany(collection, items.map((i) => i.id));
				for (const item of items) {
					const seo = seoMap.get(item.id);
					if (seo) item.seo = seo;
				}
			}
			return {
				items,
				cursor: result.nextCursor,
				hasMore: !!result.nextCursor
			};
		}
	};
}
/**
* Create read-only taxonomy access (gated on `taxonomies:read`).
*/
function createTaxonomyAccess(db) {
	const taxonomyRepo = new TaxonomyRepository(db);
	return {
		async getAll(options) {
			let query = db.selectFrom("_emdash_taxonomy_defs").selectAll();
			if (options?.locale !== void 0) query = query.where("locale", "=", options.locale);
			return (await query.orderBy("name", "asc").execute()).map((row) => ({
				name: row.name,
				label: row.label,
				labelSingular: row.label_singular,
				hierarchical: row.hierarchical === 1,
				collections: parseCollectionsColumn(row.collections),
				locale: row.locale
			}));
		},
		async getTerms(taxonomy, options) {
			return (await taxonomyRepo.findByName(taxonomy, { locale: options?.locale })).map(taxonomyToTermInfo);
		},
		async getEntryTerms(collection, entryId, options) {
			return (await taxonomyRepo.getTermsForEntry(collection, entryId, options?.taxonomy, options?.locale)).map(taxonomyToTermInfo);
		}
	};
}
/**
* Create full content access with write operations.
*
* `create` and `update` accept a reserved `seo` key in their `data`
* argument. When present, it is routed to the core SEO panel
* (`_emdash_seo`) via `SeoRepository.upsert`, in the same transaction as
* the content write. The returned `ContentItem.seo` reflects the resulting
* SEO state for SEO-enabled collections.
*/
function createContentAccessWithWrite(db) {
	return {
		...createContentAccess(db),
		async create(collection, data) {
			const { fields, seo } = splitSeoFromInput(data);
			let contentMutated = false;
			try {
				const created = await withTransaction(db, async (trx) => {
					const trxContentRepo = new ContentRepository(trx);
					const trxSeoRepo = new SeoRepository(trx);
					const hasSeo = await assertSeoEnabled(trxSeoRepo, collection, seo);
					const item = await trxContentRepo.create({
						type: collection,
						data: fields
					});
					contentMutated = true;
					const result = {
						id: item.id,
						type: item.type,
						slug: item.slug,
						status: item.status,
						data: item.data,
						createdAt: item.createdAt,
						updatedAt: item.updatedAt,
						locale: item.locale,
						publishedAt: item.publishedAt,
						scheduledAt: item.scheduledAt
					};
					if (hasSeo) result.seo = seo !== void 0 ? await trxSeoRepo.upsert(collection, item.id, seo) : await trxSeoRepo.get(collection, item.id);
					return result;
				});
				await markContentMediaUsageCollectionStaleSafely(db, collection, "CONTENT_USAGE_STALE");
				return created;
			} catch (error) {
				if (contentMutated) await markContentMediaUsageCollectionStaleSafely(db, collection, "CONTENT_USAGE_STALE");
				throw error;
			}
		},
		async update(collection, id, data) {
			const { fields, seo } = splitSeoFromInput(data);
			const hasFieldUpdates = Object.keys(fields).length > 0;
			let contentMutated = false;
			try {
				const updated = await withTransaction(db, async (trx) => {
					const trxContentRepo = new ContentRepository(trx);
					const trxSeoRepo = new SeoRepository(trx);
					const hasSeo = await assertSeoEnabled(trxSeoRepo, collection, seo);
					const item = hasFieldUpdates ? await trxContentRepo.update(collection, id, { data: fields }) : await (async () => {
						const existing = await trxContentRepo.findById(collection, id);
						if (!existing) throw new Error("Content not found");
						return existing;
					})();
					if (hasFieldUpdates) contentMutated = true;
					const result = {
						id: item.id,
						type: item.type,
						slug: item.slug,
						status: item.status,
						data: item.data,
						createdAt: item.createdAt,
						updatedAt: item.updatedAt,
						locale: item.locale,
						publishedAt: item.publishedAt,
						scheduledAt: item.scheduledAt
					};
					if (hasSeo) result.seo = seo !== void 0 ? await trxSeoRepo.upsert(collection, item.id, seo) : await trxSeoRepo.get(collection, item.id);
					return result;
				});
				if (hasFieldUpdates) await markContentMediaUsageCollectionStaleSafely(db, collection, "CONTENT_USAGE_STALE");
				return updated;
			} catch (error) {
				if (contentMutated) await markContentMediaUsageCollectionStaleSafely(db, collection, "CONTENT_USAGE_STALE");
				throw error;
			}
		},
		async delete(collection, id) {
			const deleted = await new ContentRepository(db).delete(collection, id);
			if (deleted) await markContentMediaUsageCollectionStaleSafely(db, collection, "CONTENT_USAGE_STALE");
			return deleted;
		}
	};
}
/**
* Create read-only media access
*/
function createMediaAccess(db) {
	const mediaRepo = new MediaRepository(db);
	return {
		async get(id) {
			const item = await mediaRepo.findById(id);
			if (!item) return null;
			return {
				id: item.id,
				filename: item.filename,
				mimeType: item.mimeType,
				size: item.size,
				url: `/media/${item.id}/${item.filename}`,
				createdAt: item.createdAt
			};
		},
		async list(options) {
			const result = await mediaRepo.findMany({
				limit: options?.limit ?? 50,
				cursor: options?.cursor,
				mimeType: options?.mimeType
			});
			return {
				items: result.items.map((item) => ({
					id: item.id,
					filename: item.filename,
					mimeType: item.mimeType,
					size: item.size,
					url: `/media/${item.id}/${item.filename}`,
					createdAt: item.createdAt
				})),
				cursor: result.nextCursor,
				hasMore: !!result.nextCursor
			};
		}
	};
}
/**
* Create full media access with write operations.
*
* `getUploadUrlFn` is optional: when omitted, `getUploadUrl()` is derived from
* `storage` (create a pending record + a signed PUT URL), mirroring the REST
* `/_emdash/api/media/upload-url` endpoint. `upload()` only needs `storage`.
* If storage is not provided, both throw at call time.
*/
function createMediaAccessWithWrite(db, getUploadUrlFn, storage) {
	const mediaRepo = new MediaRepository(db);
	const readAccess = createMediaAccess(db);
	const getUploadUrl = getUploadUrlFn ?? (async (filename, contentType) => {
		if (!storage) throw new Error("Media getUploadUrl() requires a storage backend. Configure storage in PluginContextFactoryOptions.");
		const basename = filename.split("/").pop() ?? filename;
		const dotIdx = basename.lastIndexOf(".");
		const ext = dotIdx > 0 ? basename.slice(dotIdx).toLowerCase() : "";
		const storageKey = `${ulid()}${ext}`;
		const media = await mediaRepo.createPending({
			filename: basename,
			mimeType: contentType,
			storageKey
		});
		return {
			uploadUrl: (await storage.getSignedUploadUrl({
				key: storageKey,
				contentType,
				expiresIn: 3600
			})).url,
			mediaId: media.id
		};
	});
	return {
		...readAccess,
		getUploadUrl,
		async upload(filename, contentType, bytes) {
			if (!storage) throw new Error("Media upload() requires a storage backend. Configure storage in PluginContextFactoryOptions.");
			const keyPrefix = ulid();
			const basename = filename.split("/").pop() ?? filename;
			const dotIdx = basename.lastIndexOf(".");
			const storageKey = `${keyPrefix}${dotIdx > 0 ? basename.slice(dotIdx).toLowerCase() : ""}`;
			await storage.upload({
				key: storageKey,
				body: new Uint8Array(bytes),
				contentType
			});
			const enriched = await enrichImageMetadata(new Uint8Array(bytes), contentType);
			let media;
			try {
				media = await mediaRepo.create({
					filename: basename,
					mimeType: contentType,
					size: bytes.byteLength,
					storageKey,
					status: "ready",
					width: enriched.width,
					height: enriched.height,
					blurhash: enriched.blurhash,
					dominantColor: enriched.dominantColor
				});
			} catch (error) {
				try {
					await storage.delete(storageKey);
				} catch {}
				throw error;
			}
			return {
				mediaId: media.id,
				storageKey,
				url: `/_emdash/api/media/file/${storageKey}`
			};
		},
		async delete(id) {
			const deleted = await mediaRepo.delete(id);
			if (deleted) invalidateSiteSettingsCache();
			return deleted;
		}
	};
}
/** Maximum number of redirects to follow in plugin HTTP access */
var MAX_PLUGIN_REDIRECTS = 5;
/**
* Check if a hostname matches any pattern in the allowed list.
* Patterns: "*" matches all, "*.example.com" matches subdomains AND bare "example.com",
* "api.example.com" matches exactly.
*/
function isHostAllowed(host, allowedHosts) {
	return allowedHosts.some((pattern) => {
		if (pattern === "*") return true;
		if (pattern.startsWith("*.")) {
			const suffix = pattern.slice(1);
			return host.endsWith(suffix) || host === pattern.slice(2);
		}
		return host === pattern;
	});
}
/**
* Create HTTP access with host validation.
*
* Uses redirect: "manual" to re-validate each redirect target against
* the allowedHosts list, preventing redirects to unauthorized hosts.
*/
function createHttpAccess(pluginId, allowedHosts) {
	return { async fetch(url, init) {
		if (allowedHosts.length === 0) throw new Error(`Plugin "${pluginId}" has no allowed hosts configured. Add hosts to the plugin's allowedHosts array to enable HTTP requests.`);
		let currentUrl = url;
		let currentInit = init;
		for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
			const hostname = new URL(currentUrl).hostname;
			if (!isHostAllowed(hostname, allowedHosts)) throw new Error(`Plugin "${pluginId}" is not allowed to fetch from host "${hostname}". Allowed hosts: ${allowedHosts.join(", ")}`);
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
		throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
	} };
}
/**
* Create unrestricted HTTP access (for plugins with network:fetch:any capability).
* No host validation, but applies SSRF protection on redirect targets to
* prevent plugins from being tricked into reaching internal services.
*/
function createUnrestrictedHttpAccess(pluginId) {
	return { async fetch(url, init) {
		let currentUrl = url;
		let currentInit = init;
		for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
			try {
				await resolveAndValidateExternalUrl(currentUrl);
			} catch (e) {
				const msg = e instanceof SsrfError ? e.message : "SSRF validation failed";
				throw new Error(`Plugin "${pluginId}": blocked fetch to "${new URL(currentUrl).hostname}": ${msg}`, { cause: e });
			}
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
		throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
	} };
}
/**
* Create logger for a plugin
*/
function createLogAccess(pluginId) {
	const prefix = `[plugin:${pluginId}]`;
	return {
		debug(message, data) {
			if (data !== void 0) console.debug(prefix, message, data);
			else console.debug(prefix, message);
		},
		info(message, data) {
			if (data !== void 0) console.info(prefix, message, data);
			else console.info(prefix, message);
		},
		warn(message, data) {
			if (data !== void 0) console.warn(prefix, message, data);
			else console.warn(prefix, message);
		},
		error(message, data) {
			if (data !== void 0) console.error(prefix, message, data);
			else console.error(prefix, message);
		}
	};
}
var TRAILING_SLASH_RE$1 = /\/$/;
/**
* Create site info from config and settings.
*
* Resolution order for URL:
* 1. options table (emdash:site_url)
* 2. Astro `site` config
* 3. fallback to empty string
*/
function createSiteInfo(options) {
	return {
		name: options.siteName ?? "",
		url: (options.siteUrl ?? "").replace(TRAILING_SLASH_RE$1, ""),
		locale: options.locale ?? "en",
		trailingSlash: options.trailingSlash ?? "ignore"
	};
}
/**
* Create a URL helper that generates absolute URLs from relative paths.
* Validates that path starts with "/" and rejects protocol-relative paths ("//").
*/
function createUrlHelper(siteUrl) {
	const base = siteUrl.replace(TRAILING_SLASH_RE$1, "");
	return (path) => {
		if (!path.startsWith("/")) throw new Error(`URL path must start with "/", got: "${path}"`);
		if (path.startsWith("//")) throw new Error(`URL path must not be protocol-relative, got: "${path}"`);
		return `${base}${path}`;
	};
}
/**
* Convert a UserRepository user to the plugin-facing UserInfo shape.
* Strips sensitive fields (avatarUrl, emailVerified, data).
*/
function toUserInfo(user) {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt
	};
}
/**
* Create read-only user access for plugins.
* Excludes sensitive fields (password hashes, sessions, passkeys, avatar URL, data).
*/
function createUserAccess(db) {
	const userRepo = new UserRepository(db);
	return {
		async get(id) {
			const user = await userRepo.findById(id);
			if (!user) return null;
			return toUserInfo(user);
		},
		async getByEmail(email) {
			const user = await userRepo.findByEmail(email);
			if (!user) return null;
			return toUserInfo(user);
		},
		async list(opts) {
			const result = await userRepo.findMany({
				role: opts?.role,
				cursor: opts?.cursor,
				limit: opts?.limit
			});
			return {
				items: result.items.map(toUserInfo),
				nextCursor: result.nextCursor
			};
		}
	};
}
/**
* Factory for creating plugin contexts
*/
var PluginContextFactory = class {
	resolveDb;
	storage;
	getUploadUrl;
	site;
	urlHelper;
	cronReschedule;
	emailPipeline;
	/**
	* Plugin IDs already warned about a missing media-write backend, so the
	* warning fires once per factory instead of on every hook/route context
	* creation (which would spam logs for hook-participating plugins).
	*/
	warnedMissingMediaBackend = /* @__PURE__ */ new Set();
	constructor(options) {
		const fixedDb = options.db;
		this.resolveDb = options.getDb ?? (() => fixedDb);
		this.storage = options.storage;
		this.getUploadUrl = options.getUploadUrl;
		this.site = createSiteInfo(options.siteInfo ?? {});
		this.urlHelper = createUrlHelper(this.site.url);
		this.cronReschedule = options.cronReschedule;
		this.emailPipeline = options.emailPipeline;
	}
	/**
	* Create the unified plugin context
	*/
	createContext(plugin) {
		const capabilities = new Set(plugin.capabilities);
		const db = this.resolveDb();
		const kv = createKVAccess(new OptionsRepository(db), plugin.id);
		const log = createLogAccess(plugin.id);
		const storage = createStorageAccess(db, plugin.id, plugin.storage);
		let content;
		if (capabilities.has("content:write")) content = createContentAccessWithWrite(db);
		else if (capabilities.has("content:read")) content = createContentAccess(db);
		let taxonomies;
		if (capabilities.has("taxonomies:read")) taxonomies = createTaxonomyAccess(db);
		let media;
		if (capabilities.has("media:write")) if (this.getUploadUrl || this.storage) media = createMediaAccessWithWrite(db, this.getUploadUrl, this.storage);
		else {
			if (!this.warnedMissingMediaBackend.has(plugin.id)) {
				this.warnedMissingMediaBackend.add(plugin.id);
				log.warn("declares the media:write capability but no storage backend is configured; upload() is unavailable.");
			}
			if (capabilities.has("media:read")) media = createMediaAccess(db);
		}
		else if (capabilities.has("media:read")) media = createMediaAccess(db);
		let http;
		if (capabilities.has("network:request:unrestricted")) http = createUnrestrictedHttpAccess(plugin.id);
		else if (capabilities.has("network:request")) http = createHttpAccess(plugin.id, plugin.allowedHosts);
		let users;
		if (capabilities.has("users:read")) users = createUserAccess(db);
		let cron;
		if (this.cronReschedule) cron = new CronAccessImpl(db, plugin.id, this.cronReschedule);
		let email;
		if (capabilities.has("email:send") && this.emailPipeline?.isAvailable()) {
			const pipeline = this.emailPipeline;
			const pluginId = plugin.id;
			email = { send: (message) => pipeline.send(message, pluginId) };
		}
		return {
			plugin: {
				id: plugin.id,
				version: plugin.version
			},
			storage,
			kv,
			content,
			taxonomies,
			media,
			http,
			log,
			site: this.site,
			url: this.urlHelper,
			users,
			cron,
			email
		};
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/menus-C6qhqP4X.mjs
/**
* Audit repository for logging system events
*
* Tracks user actions for security, debugging, and compliance.
* All mutations should create an audit log entry.
*/
var AuditRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Create an audit log entry
	*/
	async log(input) {
		const id = ulid();
		const row = {
			id,
			actor_id: input.actorId ?? null,
			actor_ip: input.actorIp ?? null,
			action: input.action,
			resource_type: input.resourceType ?? null,
			resource_id: input.resourceId ?? null,
			details: input.details ? JSON.stringify(input.details) : null,
			status: input.status ?? null
		};
		await this.db.insertInto("audit_logs").values(row).execute();
		const log = await this.findById(id);
		if (!log) throw new Error("Failed to create audit log");
		return log;
	}
	/**
	* Find audit log by ID
	*/
	async findById(id) {
		const row = await this.db.selectFrom("audit_logs").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToAuditLog(row) : null;
	}
	/**
	* Query audit logs with filters and cursor-based pagination
	*/
	async findMany(query = {}) {
		const limit = Math.min(Math.max(1, query.limit || 50), 100);
		let q = this.db.selectFrom("audit_logs").selectAll().orderBy("timestamp", "desc").orderBy("id", "desc").limit(limit + 1);
		if (query.actorId) q = q.where("actor_id", "=", query.actorId);
		if (query.action) q = q.where("action", "=", query.action);
		if (query.resourceType) q = q.where("resource_type", "=", query.resourceType);
		if (query.resourceId) q = q.where("resource_id", "=", query.resourceId);
		if (query.status) q = q.where("status", "=", query.status);
		if (query.since) q = q.where("timestamp", ">=", query.since);
		if (query.until) q = q.where("timestamp", "<=", query.until);
		if (query.cursor) {
			const decoded = decodeCursor(query.cursor);
			q = q.where((eb) => eb.or([eb("timestamp", "<", decoded.orderValue), eb.and([eb("timestamp", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
		}
		const rows = await q.execute();
		const items = rows.slice(0, limit).map((row) => this.rowToAuditLog(row));
		const result = { items };
		if (rows.length > limit && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.timestamp, last.id);
		}
		return result;
	}
	/**
	* Get all logs for a specific resource
	*/
	async findByResource(resourceType, resourceId, options = {}) {
		let query = this.db.selectFrom("audit_logs").selectAll().where("resource_type", "=", resourceType).where("resource_id", "=", resourceId).orderBy("timestamp", "desc");
		if (options.limit) query = query.limit(options.limit);
		return (await query.execute()).map((row) => this.rowToAuditLog(row));
	}
	/**
	* Get all logs for a specific user
	*/
	async findByActor(actorId, options = {}) {
		let query = this.db.selectFrom("audit_logs").selectAll().where("actor_id", "=", actorId).orderBy("timestamp", "desc");
		if (options.since) query = query.where("timestamp", ">=", options.since);
		if (options.limit) query = query.limit(options.limit);
		return (await query.execute()).map((row) => this.rowToAuditLog(row));
	}
	/**
	* Count logs matching a query
	*/
	async count(query = {}) {
		let q = this.db.selectFrom("audit_logs").select((eb) => eb.fn.count("id").as("count"));
		if (query.actorId) q = q.where("actor_id", "=", query.actorId);
		if (query.action) q = q.where("action", "=", query.action);
		if (query.resourceType) q = q.where("resource_type", "=", query.resourceType);
		if (query.resourceId) q = q.where("resource_id", "=", query.resourceId);
		if (query.status) q = q.where("status", "=", query.status);
		if (query.since) q = q.where("timestamp", ">=", query.since);
		if (query.until) q = q.where("timestamp", "<=", query.until);
		const result = await q.executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Delete old audit logs (for retention policy)
	*/
	async deleteOlderThan(date) {
		const result = await this.db.deleteFrom("audit_logs").where("timestamp", "<", date).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Convert database row to AuditLog object
	*/
	rowToAuditLog(row) {
		return {
			id: row.id,
			timestamp: row.timestamp,
			actorId: row.actor_id,
			actorIp: row.actor_ip,
			action: row.action,
			resourceType: row.resource_type,
			resourceId: row.resource_id,
			details: row.details ? JSON.parse(row.details) : null,
			status: row.status
		};
	}
};
object({
	id: string(),
	src: string(),
	alt: string().optional(),
	width: number().optional(),
	height: number().optional()
});
object({
	_type: string(),
	_key: string()
}).passthrough();
/**
* definePlugin() Helper
*
* Native plugin authoring entry. Returns a fully-resolved
* `ResolvedPlugin` ready for the host integration to mount.
*
* Sandboxed plugins do NOT use this function. They default-export
* a bare `{ hooks?, routes? }` object with a `satisfies SandboxedPlugin`
* annotation from `emdash/plugin`. See the `emdash` changeset for the
* authoring shape.
*/
var MCP_TOOL_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
/**
* Define a native EmDash plugin.
*
* Native plugins ship as regular npm modules, get installed via
* `pnpm add` + an `astro.config.mjs` edit, and run in the host
* process. They have full access to the runtime — capabilities are
* still enforced by `PluginContextFactory`, but there is no isolation
* boundary.
*
* @example
* ```typescript
* import { definePlugin } from "emdash";
*
* export default definePlugin({
*   id: "my-plugin",
*   version: "1.0.0",
*   capabilities: ["content:read"],
*   hooks: {
*     "content:beforeSave": async (event, ctx) => {
*       ctx.log.info("Saving content", { collection: event.collection });
*       return event.content;
*     }
*   },
*   routes: {
*     "sync": {
*       handler: async (ctx) => {
*         return { status: "ok" };
*       }
*     }
*   }
* });
* ```
*
* Sandboxed-format plugins do not use `definePlugin`. They
* default-export a bare `{ hooks?, routes? }` object with a
* `satisfies SandboxedPlugin` annotation from `emdash/plugin`. Calling
* `definePlugin` with an object that has no `id` throws at runtime
* (the type system already rejects it at compile time — this check is
* for callers that bypass typechecking).
*/
function definePlugin(definition) {
	if (typeof definition.id !== "string" || definition.id.length === 0) throw new Error(`definePlugin() requires \`id\` (got ${typeof definition.id}). For native plugins, make sure your definition has both \`id\` and \`version\`. For sandboxed plugins, drop \`definePlugin()\` entirely and \`export default { hooks, routes } satisfies SandboxedPlugin\` from "emdash/plugin" — identity comes from \`emdash-plugin.jsonc\`.`);
	return defineNativePlugin(definition);
}
/**
* Internal: define a native-format plugin with full validation and normalization.
*/
function defineNativePlugin(definition) {
	const SIMPLE_ID = /^[a-z0-9-]+$/;
	const SCOPED_ID = /^@[a-z0-9-]+\/[a-z0-9-]+$/;
	const SEMVER_PATTERN = /^\d+\.\d+\.\d+/;
	const { id, version, capabilities = [], allowedHosts = [], hooks = {}, routes = {}, mcp = { tools: {} }, admin = {} } = definition;
	const storage = definition.storage ?? {};
	if (!SIMPLE_ID.test(id) && !SCOPED_ID.test(id)) throw new Error(`Invalid plugin id "${id}". Must be lowercase alphanumeric with dashes (e.g., "my-plugin" or "@scope/my-plugin").`);
	if (!SEMVER_PATTERN.test(version)) throw new Error(`Invalid plugin version "${version}". Must be semver format (e.g., "1.0.0").`);
	for (const [name, tool] of Object.entries(mcp.tools)) {
		if (!MCP_TOOL_NAME_PATTERN.test(name)) throw new Error(`Invalid MCP tool name "${name}" in plugin "${id}".`);
		const route = routes[tool.route];
		if (!route) throw new Error(`MCP tool "${name}" references unknown route "${tool.route}".`);
		if (route.public) throw new Error(`MCP tool "${name}" cannot reference a public route.`);
		if (!route.permission) throw new Error(`MCP route "${tool.route}" must declare a permission.`);
	}
	const validCapabilities = /* @__PURE__ */ new Set([
		"network:request",
		"network:request:unrestricted",
		"content:read",
		"content:write",
		"taxonomies:read",
		"media:read",
		"media:write",
		"users:read",
		"email:send",
		"hooks.email-transport:register",
		"hooks.email-events:register",
		"hooks.page-fragments:register",
		"network:fetch",
		"network:fetch:any",
		"read:content",
		"write:content",
		"read:media",
		"write:media",
		"read:users",
		"email:provide",
		"email:intercept",
		"page:inject"
	]);
	for (const cap of capabilities) if (!validCapabilities.has(cap)) throw new Error(`Invalid capability "${cap}" in plugin "${id}".`);
	const canonical = normalizeCapabilities(capabilities);
	const normalizedCapabilities = [...canonical];
	if (canonical.includes("content:write") && !canonical.includes("content:read")) normalizedCapabilities.push("content:read");
	if (canonical.includes("media:write") && !canonical.includes("media:read")) normalizedCapabilities.push("media:read");
	if (canonical.includes("network:request:unrestricted") && !canonical.includes("network:request")) normalizedCapabilities.push("network:request");
	return {
		id,
		version,
		capabilities: normalizedCapabilities,
		allowedHosts,
		storage,
		hooks: resolveHooks(hooks, id),
		routes,
		mcp,
		admin
	};
}
/**
* Resolve hooks to normalized format with defaults.
*
* PluginHooks and ResolvedPluginHooks share the same keys — each input value is
* `HookConfig<H> | H` and the output is `ResolvedHook<H>`.  TS can't narrow
* the handler type through a dynamic key, so we assert at the loop boundary.
*/
function resolveHooks(hooks, pluginId) {
	const resolved = {};
	for (const key of Object.keys(hooks)) {
		const hook = hooks[key];
		if (hook) resolved[key] = resolveHook(hook, pluginId);
	}
	return resolved;
}
/**
* Check if a hook value is a config object (has a `handler` property)
*/
function isHookConfig(hook) {
	return typeof hook === "object" && hook !== null && "handler" in hook;
}
/**
* Resolve a single hook to normalized format
*/
function resolveHook(hook, pluginId) {
	if (isHookConfig(hook)) {
		if (hook.exclusive !== void 0 && typeof hook.exclusive !== "boolean") throw new Error(`Invalid "exclusive" value in hook config for plugin "${pluginId}". Must be boolean.`);
		return {
			priority: hook.priority ?? 100,
			timeout: hook.timeout ?? 5e3,
			dependencies: hook.dependencies ?? [],
			errorPolicy: hook.errorPolicy ?? "abort",
			exclusive: hook.exclusive ?? false,
			handler: hook.handler,
			pluginId
		};
	}
	return {
		priority: 100,
		timeout: 5e3,
		dependencies: [],
		errorPolicy: "abort",
		exclusive: false,
		handler: hook,
		pluginId
	};
}
/**
* Plugin Hooks System v2
*
* Uses the unified PluginContext for all hooks.
* Manages lifecycle hooks with:
* - Deterministic ordering via priority + dependencies
* - Timeout enforcement
* - Error isolation
* - Observability
*
*/
/**
* Hook pipeline for executing hooks in order
*/
var HookPipeline = class HookPipeline {
	hooks = /* @__PURE__ */ new Map();
	pluginMap = /* @__PURE__ */ new Map();
	contextFactory = null;
	/** Stored so setContextFactory can merge incrementally. */
	contextFactoryOptions = {};
	/** Hook names where at least one handler declared exclusive: true */
	exclusiveHookNames = /* @__PURE__ */ new Set();
	/**
	* Selected provider plugin ID for each exclusive hook.
	* Set by the PluginManager after resolution.
	*/
	exclusiveSelections = /* @__PURE__ */ new Map();
	constructor(plugins, factoryOptions) {
		if (factoryOptions) {
			this.contextFactory = new PluginContextFactory(factoryOptions);
			this.contextFactoryOptions = { ...factoryOptions };
		}
		for (const plugin of plugins) this.pluginMap.set(plugin.id, plugin);
		this.registerPlugins(plugins);
	}
	/**
	* Set or update the context factory options.
	*
	* When called on a pipeline that already has a factory, the new options
	* are merged on top of the existing ones so that callers don't need to
	* repeat every field (e.g. adding `cronReschedule` without losing
	* `storage` / `getUploadUrl`).
	*/
	setContextFactory(options) {
		const merged = {
			...this.contextFactoryOptions,
			...options
		};
		this.contextFactory = new PluginContextFactory(merged);
		this.contextFactoryOptions = merged;
	}
	/**
	* Get context for a plugin
	*/
	getContext(pluginId) {
		const plugin = this.pluginMap.get(pluginId);
		if (!plugin) throw new Error(`Plugin "${pluginId}" not found`);
		if (!this.contextFactory) throw new Error("Context factory not initialized - call setContextFactory first");
		return this.contextFactory.createContext(plugin);
	}
	/**
	* Get typed hooks for a specific hook name.
	* The internal map stores ResolvedHook<unknown>, but we know each name
	* maps to a specific handler type via HookHandlerMap.
	*
	* Exclusive hooks that have a selected provider are filtered out — they
	* should only run via invokeExclusiveHook(), not in the regular pipeline.
	*/
	getTypedHooks(name) {
		const all = this.hooks.get(name) ?? [];
		if (this.exclusiveSelections.has(name)) return all.filter((h) => !h.exclusive);
		return all;
	}
	/**
	* Register all hooks from plugins.
	*
	* Registers each hook name individually to preserve type safety. The
	* internal map stores ResolvedHook<unknown> since it's keyed by string,
	* but getTypedHooks() restores the correct handler type on retrieval.
	*/
	registerPlugins(plugins) {
		for (const plugin of plugins) {
			this.registerPluginHook(plugin, "plugin:install");
			this.registerPluginHook(plugin, "plugin:activate");
			this.registerPluginHook(plugin, "plugin:deactivate");
			this.registerPluginHook(plugin, "plugin:uninstall");
			this.registerPluginHook(plugin, "content:beforeSave");
			this.registerPluginHook(plugin, "content:afterSave");
			this.registerPluginHook(plugin, "content:beforeDelete");
			this.registerPluginHook(plugin, "content:afterDelete");
			this.registerPluginHook(plugin, "content:afterPublish");
			this.registerPluginHook(plugin, "content:afterUnpublish");
			this.registerPluginHook(plugin, "content:afterRestore");
			this.registerPluginHook(plugin, "content:afterSchedule");
			this.registerPluginHook(plugin, "content:afterUnschedule");
			this.registerPluginHook(plugin, "media:beforeUpload");
			this.registerPluginHook(plugin, "media:afterUpload");
			this.registerPluginHook(plugin, "cron");
			this.registerPluginHook(plugin, "email:beforeSend");
			this.registerPluginHook(plugin, "email:deliver");
			this.registerPluginHook(plugin, "email:afterSend");
			this.registerPluginHook(plugin, "comment:beforeCreate");
			this.registerPluginHook(plugin, "comment:moderate");
			this.registerPluginHook(plugin, "comment:afterCreate");
			this.registerPluginHook(plugin, "comment:afterModerate");
			this.registerPluginHook(plugin, "page:metadata");
			this.registerPluginHook(plugin, "page:fragments");
		}
		for (const [hookName, hooks] of this.hooks) this.hooks.set(hookName, this.sortHooks(hooks));
	}
	/**
	* Maps hook names to the capability required to register them.
	*
	* Hooks not listed here have no capability requirement (e.g. lifecycle
	* hooks, cron). Any plugin declaring a listed hook without the required
	* capability will have that hook silently skipped at registration time.
	*/
	static HOOK_REQUIRED_CAPABILITY = /* @__PURE__ */ new Map([
		["email:beforeSend", "hooks.email-events:register"],
		["email:afterSend", "hooks.email-events:register"],
		["email:deliver", "hooks.email-transport:register"],
		["content:beforeSave", "content:write"],
		["content:afterSave", "content:read"],
		["content:beforeDelete", "content:read"],
		["content:afterDelete", "content:read"],
		["content:afterPublish", "content:read"],
		["content:afterUnpublish", "content:read"],
		["content:afterRestore", "content:read"],
		["content:afterSchedule", "content:read"],
		["content:afterUnschedule", "content:read"],
		["media:beforeUpload", "media:write"],
		["media:afterUpload", "media:read"],
		["comment:beforeCreate", "users:read"],
		["comment:moderate", "users:read"],
		["comment:afterCreate", "users:read"],
		["comment:afterModerate", "users:read"],
		["page:fragments", "hooks.page-fragments:register"]
	]);
	/**
	* Register a single plugin's hook by name
	*/
	registerPluginHook(plugin, name) {
		const hook = plugin.hooks[name];
		if (!hook) return;
		const requiredCapability = HookPipeline.HOOK_REQUIRED_CAPABILITY.get(name);
		if (requiredCapability && !plugin.capabilities.includes(requiredCapability)) {
			console.warn(`[hooks] Plugin "${plugin.id}" declares ${name} hook without ${requiredCapability} capability — skipping`);
			return;
		}
		if (hook.exclusive) this.exclusiveHookNames.add(name);
		this.registerHook(name, hook);
	}
	/**
	* Register a single hook
	*/
	registerHook(name, hook) {
		const existing = this.hooks.get(name) || [];
		existing.push(hook);
		this.hooks.set(name, existing);
	}
	/**
	* Sort hooks by priority and dependencies
	*/
	sortHooks(hooks) {
		const sorted = [];
		const remaining = [...hooks];
		while (remaining.length > 0) {
			const ready = remaining.filter((hook) => hook.dependencies.every((dep) => sorted.some((s) => s.pluginId === dep)));
			if (ready.length === 0) {
				const pluginIds = remaining.map((h) => h.pluginId).join(", ");
				console.warn(`[hooks] Hook dependency cycle or missing dependency detected among plugins: ${pluginIds}. Falling back to priority order.`);
				remaining.sort((a, b) => a.priority - b.priority);
				sorted.push(...remaining);
				break;
			}
			ready.sort((a, b) => a.priority - b.priority);
			const next = ready[0];
			sorted.push(next);
			remaining.splice(remaining.indexOf(next), 1);
		}
		return sorted;
	}
	/**
	* Execute a hook with timeout
	*/
	async executeWithTimeout(fn, timeout) {
		let timer;
		const timeoutPromise = new Promise((_, reject) => timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`Hook timeout after ${timeout}ms`)), timeout));
		try {
			return await Promise.race([fn(), timeoutPromise]);
		} finally {
			clearTimeout(timer);
		}
	}
	/**
	* Run plugin:install hooks
	*/
	async runPluginInstall(pluginId) {
		return this.runLifecycleHook("plugin:install", pluginId);
	}
	/**
	* Run plugin:activate hooks
	*/
	async runPluginActivate(pluginId) {
		return this.runLifecycleHook("plugin:activate", pluginId);
	}
	/**
	* Run plugin:deactivate hooks
	*/
	async runPluginDeactivate(pluginId) {
		return this.runLifecycleHook("plugin:deactivate", pluginId);
	}
	/**
	* Run plugin:uninstall hooks
	*/
	async runPluginUninstall(pluginId, deleteData) {
		const hooks = this.getTypedHooks("plugin:uninstall");
		const results = [];
		const hook = hooks.find((h) => h.pluginId === pluginId);
		if (!hook) return results;
		const { handler } = hook;
		const event = { deleteData };
		const ctx = this.getContext(pluginId);
		const start = Date.now();
		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			results.push({
				success: true,
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		} catch (error) {
			results.push({
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		}
		return results;
	}
	async runLifecycleHook(hookName, pluginId) {
		const hooks = this.getTypedHooks(hookName);
		const results = [];
		const hook = hooks.find((h) => h.pluginId === pluginId);
		if (!hook) return results;
		const { handler } = hook;
		const event = {};
		const ctx = this.getContext(pluginId);
		const start = Date.now();
		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			results.push({
				success: true,
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		} catch (error) {
			results.push({
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		}
		return results;
	}
	/**
	* Run content:beforeSave hooks
	* Returns modified content from the pipeline
	*/
	async runContentBeforeSave(content, collection, isNew) {
		const hooks = this.getTypedHooks("content:beforeSave");
		const results = [];
		let currentContent = content;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				content: currentContent,
				collection,
				isNew
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result !== void 0) currentContent = result;
				results.push({
					success: true,
					value: currentContent,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			content: currentContent,
			results
		};
	}
	/**
	* Run content:afterSave hooks
	*/
	async runContentAfterSave(content, collection, isNew) {
		const hooks = this.getTypedHooks("content:afterSave");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				content,
				collection,
				isNew
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Run content:beforeDelete hooks
	* Returns whether deletion is allowed
	*/
	async runContentBeforeDelete(id, collection) {
		const hooks = this.getTypedHooks("content:beforeDelete");
		const results = [];
		let allowed = true;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				id,
				collection,
				permanent: false
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result === false) allowed = false;
				results.push({
					success: true,
					value: result !== false,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			allowed,
			results
		};
	}
	/**
	* Run content:afterDelete hooks
	*/
	async runContentAfterDelete(id, collection, permanent) {
		const hooks = this.getTypedHooks("content:afterDelete");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				id,
				collection,
				permanent
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Run content state-change hooks that all share the same event shape.
	*/
	async runContentStateChangeHook(name, content, collection) {
		const hooks = this.getTypedHooks(name);
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				content,
				collection
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Run content:afterPublish hooks (fire-and-forget).
	*/
	async runContentAfterPublish(content, collection) {
		return this.runContentStateChangeHook("content:afterPublish", content, collection);
	}
	/**
	* Run content:afterUnpublish hooks (fire-and-forget).
	*/
	async runContentAfterUnpublish(content, collection) {
		return this.runContentStateChangeHook("content:afterUnpublish", content, collection);
	}
	/**
	* Run content:afterRestore hooks (fire-and-forget).
	*/
	async runContentAfterRestore(content, collection) {
		return this.runContentStateChangeHook("content:afterRestore", content, collection);
	}
	/**
	* Run content:afterSchedule hooks (fire-and-forget).
	*/
	async runContentAfterSchedule(content, collection) {
		return this.runContentStateChangeHook("content:afterSchedule", content, collection);
	}
	/**
	* Run content:afterUnschedule hooks (fire-and-forget).
	*/
	async runContentAfterUnschedule(content, collection) {
		return this.runContentStateChangeHook("content:afterUnschedule", content, collection);
	}
	/**
	* Run media:beforeUpload hooks
	*/
	async runMediaBeforeUpload(file) {
		const hooks = this.getTypedHooks("media:beforeUpload");
		const results = [];
		let currentFile = file;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = { file: currentFile };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result !== void 0) currentFile = result;
				results.push({
					success: true,
					value: currentFile,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			file: currentFile,
			results
		};
	}
	/**
	* Run media:afterUpload hooks
	*/
	async runMediaAfterUpload(media) {
		const hooks = this.getTypedHooks("media:afterUpload");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = { media };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Invoke the cron hook for a specific plugin.
	*
	* Unlike other hooks which broadcast to all plugins, the cron hook is
	* dispatched only to the target plugin — the one that owns the task.
	*/
	async invokeCronHook(pluginId, event) {
		const hook = this.getTypedHooks("cron").find((h) => h.pluginId === pluginId);
		if (!hook) return {
			success: false,
			error: /* @__PURE__ */ new Error(`Plugin "${pluginId}" has no cron hook registered`),
			pluginId,
			duration: 0
		};
		const { handler } = hook;
		const ctx = this.getContext(pluginId);
		const start = Date.now();
		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			return {
				success: true,
				pluginId,
				duration: Date.now() - start
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId,
				duration: Date.now() - start
			};
		}
	}
	/**
	* Run email:beforeSend hooks (middleware pipeline).
	*
	* Each handler receives the message and returns a modified message or
	* `false` to cancel delivery. The pipeline chains message transformations —
	* each handler receives the output of the previous one.
	*/
	async runEmailBeforeSend(message, source) {
		const hooks = this.getTypedHooks("email:beforeSend");
		const results = [];
		let currentMessage = message;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				message: { ...currentMessage },
				source
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result === false) {
					results.push({
						success: true,
						value: false,
						pluginId: hook.pluginId,
						duration: Date.now() - start
					});
					return {
						message: false,
						results
					};
				}
				if (result && typeof result === "object") currentMessage = result;
				results.push({
					success: true,
					value: currentMessage,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			message: currentMessage,
			results
		};
	}
	/**
	* Run email:afterSend hooks (fire-and-forget).
	*
	* Errors are logged but don't propagate — they don't affect the caller.
	*/
	async runEmailAfterSend(message, source) {
		const hooks = this.getTypedHooks("email:afterSend");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				message,
				source
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				console.error(`[email:afterSend] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			}
		}
		return results;
	}
	/**
	* Run comment:beforeCreate hooks (middleware pipeline).
	*
	* Each handler receives the event and returns a modified event or
	* `false` to reject the comment. The pipeline chains transformations —
	* each handler receives the output of the previous one.
	*/
	async runCommentBeforeCreate(event) {
		const hooks = this.getTypedHooks("comment:beforeCreate");
		let currentEvent = event;
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler({ ...currentEvent }, ctx), hook.timeout);
				if (result === false) return false;
				if (result && typeof result === "object") currentEvent = result;
			} catch (error) {
				console.error(`[comment:beforeCreate] Plugin "${hook.pluginId}" error (${Date.now() - start}ms):`, error instanceof Error ? error.message : error);
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return currentEvent;
	}
	/**
	* Run comment:afterCreate hooks (fire-and-forget).
	*
	* Errors are logged but don't propagate — they don't affect the caller.
	*/
	async runCommentAfterCreate(event) {
		const hooks = this.getTypedHooks("comment:afterCreate");
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			} catch (error) {
				console.error(`[comment:afterCreate] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
	}
	/**
	* Run comment:afterModerate hooks (fire-and-forget).
	*
	* Errors are logged but don't propagate — they don't affect the caller.
	*/
	async runCommentAfterModerate(event) {
		const hooks = this.getTypedHooks("comment:afterModerate");
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			} catch (error) {
				console.error(`[comment:afterModerate] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
	}
	/**
	* Run page:metadata hooks. Each handler returns contributions that are
	* merged by the metadata collector. Errors are logged but don't propagate.
	*/
	async runPageMetadata(event) {
		const hooks = this.getTypedHooks("page:metadata");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				const result = await this.executeWithTimeout(() => Promise.resolve(handler(event, ctx)), hook.timeout);
				if (result != null) {
					const contributions = Array.isArray(result) ? result : [result];
					results.push({
						pluginId: hook.pluginId,
						contributions
					});
				}
			} catch (error) {
				console.error(`[page:metadata] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
		return results;
	}
	/**
	* Run page:fragments hooks. Only trusted plugins should be registered
	* for this hook. Errors are logged but don't propagate.
	*/
	async runPageFragments(event) {
		const hooks = this.getTypedHooks("page:fragments");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				const result = await this.executeWithTimeout(() => Promise.resolve(handler(event, ctx)), hook.timeout);
				if (result != null) {
					const contributions = Array.isArray(result) ? result : [result];
					results.push({
						pluginId: hook.pluginId,
						contributions
					});
				}
			} catch (error) {
				console.error(`[page:fragments] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
		return results;
	}
	/**
	* Check if any hooks are registered for a given name
	*/
	hasHooks(name) {
		const hooks = this.hooks.get(name);
		return hooks !== void 0 && hooks.length > 0;
	}
	/**
	* Get hook count for debugging
	*/
	getHookCount(name) {
		return this.hooks.get(name)?.length || 0;
	}
	/**
	* Get all registered hook names
	*/
	getRegisteredHooks() {
		return [...this.hooks.keys()];
	}
	/**
	* Returns hook names where at least one handler declared exclusive: true
	*/
	getRegisteredExclusiveHooks() {
		return [...this.exclusiveHookNames];
	}
	/**
	* Check if a hook is exclusive
	*/
	isExclusiveHook(name) {
		return this.exclusiveHookNames.has(name);
	}
	/**
	* Set the selected provider for an exclusive hook.
	* Called by PluginManager after resolution.
	*/
	setExclusiveSelection(hookName, pluginId) {
		this.exclusiveSelections.set(hookName, pluginId);
	}
	/**
	* Clear the selected provider for an exclusive hook.
	*/
	clearExclusiveSelection(hookName) {
		this.exclusiveSelections.delete(hookName);
	}
	/**
	* Get the selected provider for an exclusive hook (if any).
	*/
	getExclusiveSelection(hookName) {
		return this.exclusiveSelections.get(hookName);
	}
	/**
	* Get all plugins that registered a handler for a given exclusive hook.
	*/
	getExclusiveHookProviders(hookName) {
		return (this.hooks.get(hookName) ?? []).filter((h) => h.exclusive).map((h) => ({ pluginId: h.pluginId }));
	}
	/**
	* Get all plugins that registered a non-exclusive handler for a given
	* hook (e.g. `email:beforeSend`, `email:afterSend`), preserving priority
	* order. Partitions with `getExclusiveHookProviders()`, which returns
	* plugins whose registration is marked `exclusive: true`.
	*/
	getHookProviders(hookName) {
		return (this.hooks.get(hookName) ?? []).filter((h) => !h.exclusive).map((h) => ({ pluginId: h.pluginId }));
	}
	/**
	* Invoke an exclusive hook — dispatch only to the selected provider.
	* Returns null if no provider is selected or if the selected hook
	* is not found in the pipeline.
	*
	* This is a generic dispatch used by the email pipeline and other
	* exclusive hook consumers. The handler type is unknown — callers
	* must know the expected signature.
	*
	* Errors are isolated: a failing handler returns an error result
	* instead of propagating the exception to the caller.
	*/
	async invokeExclusiveHook(hookName, event) {
		const selectedPluginId = this.exclusiveSelections.get(hookName);
		if (!selectedPluginId) return null;
		const hook = (this.hooks.get(hookName) ?? []).find((h) => h.pluginId === selectedPluginId && h.exclusive);
		if (!hook) return null;
		const start = Date.now();
		try {
			const ctx = this.getContext(selectedPluginId);
			const handler = hook.handler;
			return {
				result: await this.executeWithTimeout(() => handler(event, ctx), hook.timeout),
				pluginId: selectedPluginId,
				duration: Date.now() - start
			};
		} catch (error) {
			return {
				result: void 0,
				pluginId: selectedPluginId,
				error: error instanceof Error ? error : new Error(String(error)),
				duration: Date.now() - start
			};
		}
	}
};
/**
* Create a hook pipeline from plugins
*/
function createHookPipeline(plugins, factoryOptions) {
	return new HookPipeline(plugins, factoryOptions);
}
/** Options table key prefix for exclusive hook selections */
var EXCLUSIVE_HOOK_KEY_PREFIX$1 = "emdash:exclusive_hook:";
/**
* Resolve exclusive hook selections.
*
* Shared algorithm used by both PluginManager and EmDashRuntime:
* 1. If a DB selection exists and that plugin is active → keep it.
* 2. If DB selection is stale (plugin inactive/gone) → clear it.
* 3. If no selection and only one active provider → auto-select it.
* 4. If preferred hints match an active provider → first match wins.
* 5. If multiple providers and no hint → leave unselected (admin must choose).
*/
async function resolveExclusiveHooks(opts) {
	const { pipeline, isActive, getOption, getOptions, setOption, deleteOption, preferredHints } = opts;
	const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();
	if (exclusiveHookNames.length === 0) return;
	let batchedSelections;
	if (getOptions) try {
		batchedSelections = await getOptions(exclusiveHookNames.map((hookName) => `${EXCLUSIVE_HOOK_KEY_PREFIX$1}${hookName}`));
	} catch {
		return;
	}
	for (const hookName of exclusiveHookNames) {
		const providers = pipeline.getExclusiveHookProviders(hookName);
		const activeProviderIds = new Set(providers.map((p) => p.pluginId).filter((id) => isActive(id)));
		const key = `${EXCLUSIVE_HOOK_KEY_PREFIX$1}${hookName}`;
		let currentSelection = null;
		if (batchedSelections) currentSelection = batchedSelections.get(key) ?? null;
		else try {
			currentSelection = await getOption(key);
		} catch {
			continue;
		}
		if (currentSelection && activeProviderIds.has(currentSelection)) {
			pipeline.setExclusiveSelection(hookName, currentSelection);
			continue;
		}
		if (currentSelection) try {
			await deleteOption(key);
		} catch {}
		if (activeProviderIds.size === 1) {
			const [onlyProvider] = activeProviderIds;
			try {
				await setOption(key, onlyProvider);
			} catch {}
			pipeline.setExclusiveSelection(hookName, onlyProvider);
			continue;
		}
		if (preferredHints) {
			let found = false;
			for (const [pluginId, hooks] of preferredHints) if (hooks.includes(hookName) && activeProviderIds.has(pluginId)) {
				try {
					await setOption(key, pluginId);
				} catch {}
				pipeline.setExclusiveSelection(hookName, pluginId);
				found = true;
				break;
			}
			if (found) continue;
		}
		pipeline.clearExclusiveSelection(hookName);
	}
}
/**
* Email Pipeline
*
* Orchestrates the three-stage email pipeline:
* 1. email:beforeSend hooks (middleware — transform, validate, cancel)
* 2. email:deliver hook (exclusive — exactly one provider delivers)
* 3. email:afterSend hooks (logging, analytics, fire-and-forget)
*
* Security features:
* - Recursion guard prevents re-entrant sends (e.g. plugin calling ctx.email.send from a hook)
* - System emails (source="system") bypass email:beforeSend and email:afterSend hooks entirely
*   to protect auth tokens from exfiltration by plugin hooks
*
*/
/** Hook name for the exclusive email delivery hook */
var EMAIL_DELIVER_HOOK = "email:deliver";
/** Source value used for auth emails (magic links, invites, password resets) */
var SYSTEM_SOURCE = "system";
/**
* Error thrown when ctx.email.send() is called but no provider is configured.
*/
var EmailNotConfiguredError = class extends Error {
	constructor() {
		super("No email provider is configured. Install and activate an email provider plugin, then select it in Settings > Email.");
		this.name = "EmailNotConfiguredError";
	}
};
/**
* Error thrown when a recursive email send is detected.
*/
var EmailRecursionError = class extends Error {
	constructor() {
		super("Recursive email send detected. A plugin hook attempted to send an email from within the email pipeline, which would cause infinite recursion.");
		this.name = "EmailRecursionError";
	}
};
/**
* Recursion guard using AsyncLocalStorage.
*
* EmailPipeline is a singleton (worker-lifetime cached via EmDashRuntime).
* Instance state like `sendDepth` would false-positive under concurrent
* requests because two unrelated sends would increment the same counter.
* ALS scopes the guard to the current async execution context, so concurrent
* requests each get their own independent recursion tracking.
*/
var emailSendALS = new AsyncLocalStorage();
/**
* EmailPipeline orchestrates email delivery through the plugin hook system.
*
* The pipeline runs in three stages:
* 1. email:beforeSend — middleware hooks that can transform or cancel messages
* 2. email:deliver — exclusive hook dispatching to the selected provider
* 3. email:afterSend — fire-and-forget hooks for logging/analytics
*/
var EmailPipeline = class {
	pipeline;
	constructor(pipeline) {
		this.pipeline = pipeline;
	}
	/**
	* Replace the underlying hook pipeline.
	*
	* Called by the runtime when rebuilding the hook pipeline after a
	* plugin is enabled or disabled, so the email pipeline dispatches
	* to the current set of active hooks.
	*/
	setPipeline(pipeline) {
		this.pipeline = pipeline;
	}
	/**
	* Send an email through the full pipeline.
	*
	* @param message - The email to send
	* @param source - Where the email originated ("system" for auth, plugin ID for plugins)
	* @throws EmailNotConfiguredError if no provider is selected
	* @throws EmailRecursionError if called re-entrantly from within a hook
	* @throws Error if the provider handler throws
	*/
	async send(message, source) {
		const store = emailSendALS.getStore();
		if (store && store.depth > 0) throw new EmailRecursionError();
		const run = () => this.sendInner(message, source);
		if (store) {
			store.depth++;
			try {
				await run();
			} finally {
				store.depth--;
			}
		} else await emailSendALS.run({ depth: 1 }, run);
	}
	/**
	* Inner send implementation, separated from the recursion guard.
	*/
	async sendInner(message, source) {
		if (!message || typeof message !== "object") throw new Error("Invalid email message: message must be an object");
		if (!message.to || typeof message.to !== "string") throw new Error("Invalid email message: 'to' is required and must be a string");
		if (!message.subject || typeof message.subject !== "string") throw new Error("Invalid email message: 'subject' is required and must be a string");
		if (!message.text || typeof message.text !== "string") throw new Error("Invalid email message: 'text' is required and must be a string");
		const isSystemEmail = source === SYSTEM_SOURCE;
		let finalMessage;
		if (isSystemEmail) finalMessage = message;
		else {
			const beforeResult = await this.pipeline.runEmailBeforeSend(message, source);
			if (beforeResult.message === false) {
				const cancelledBy = beforeResult.results.find((r) => r.value === false)?.pluginId ?? "unknown";
				console.info(`[email] Email to "${message.to}" cancelled by plugin "${cancelledBy}"`);
				return;
			}
			finalMessage = beforeResult.message;
		}
		const deliverEvent = {
			message: finalMessage,
			source
		};
		const deliverResult = await this.pipeline.invokeExclusiveHook(EMAIL_DELIVER_HOOK, deliverEvent);
		if (!deliverResult) throw new EmailNotConfiguredError();
		if (deliverResult.error) throw deliverResult.error;
		if (!isSystemEmail) this.pipeline.runEmailAfterSend(finalMessage, source).catch((err) => console.error("[email] afterSend pipeline error:", err instanceof Error ? err.message : err));
	}
	/**
	* Check if an email provider is configured and available.
	*
	* Returns true if an email:deliver provider is selected in the exclusive
	* hook system. Plugins and auth code use this to decide whether to show
	* "send invite" vs "copy invite link" UI.
	*/
	isAvailable() {
		return this.pipeline.getExclusiveSelection(EMAIL_DELIVER_HOOK) !== void 0;
	}
};
/**
* Plugin Routes v2
*
* Handles plugin API route invocation with:
* - Input validation via Zod schemas
* - Route context creation
* - Error handling
*
*/
/**
* Body-reading methods on `Request`. EmDash parses the request body once before
* the handler runs and exposes the result as `ctx.input`, leaving the underlying
* stream consumed. Calling any of these on `ctx.request` would re-read a spent
* stream and throw an opaque platform error ("Body is unusable: Body has already
* been read") with no hint about `ctx.input` — so the guard replaces them with an
* actionable message instead (#1293).
*/
var CONSUMED_BODY_METHODS = /* @__PURE__ */ new Set([
	"json",
	"text",
	"arrayBuffer",
	"blob",
	"formData",
	"bytes"
]);
/**
* Wrap the request handed to a plugin route handler so an accidental
* `ctx.request.json()` (or `.text()`, `.formData()`, …) fails with a message
* pointing at `ctx.input` rather than the runtime's cryptic "body already read"
* error. Every non-body member passes through unchanged; function members are
* bound to the underlying request so methods like `clone()` don't throw an
* "Illegal invocation" when called on the proxy.
*/
function guardConsumedRequestBody(request) {
	return new Proxy(request, { get(target, prop) {
		if (typeof prop === "string" && CONSUMED_BODY_METHODS.has(prop)) return () => {
			throw new Error(`[emdash] ctx.request.${prop}() is not available inside a plugin route handler: EmDash has already parsed the request body and exposes it as ctx.input. Read ctx.input instead of ctx.request.${prop}().`);
		};
		const value = Reflect.get(target, prop, target);
		return typeof value === "function" ? value.bind(target) : value;
	} });
}
/**
* Build RouteMeta from a route's `public`/`cacheControl` flags. Single source
* of truth for the "cacheControl is only ever exposed on public routes"
* invariant — used for trusted routes and manifest-declared sandboxed routes.
*/
function buildRouteMeta(route) {
	const meta = { public: route.public === true };
	if (route.permission !== void 0) meta.permission = route.permission;
	if (meta.public && typeof route.cacheControl === "string" && route.cacheControl.length > 0) meta.cacheControl = route.cacheControl;
	return meta;
}
/**
* Route handler for a plugin
*/
var PluginRouteHandler = class {
	contextFactory;
	plugin;
	trustedProxyHeaders;
	constructor(plugin, factoryOptions) {
		this.plugin = plugin;
		this.contextFactory = new PluginContextFactory(factoryOptions);
		this.trustedProxyHeaders = factoryOptions.trustedProxyHeaders ?? [];
	}
	/**
	* Invoke a route by name
	*/
	async invoke(routeName, options) {
		const route = this.plugin.routes[routeName];
		if (!route) return {
			success: false,
			error: {
				code: "ROUTE_NOT_FOUND",
				message: `Route "${routeName}" not found in plugin "${this.plugin.id}"`
			},
			status: 404
		};
		let validatedInput;
		if (route.input) {
			const parseResult = route.input.safeParse(options.body);
			if (!parseResult.success) return {
				success: false,
				error: {
					code: "VALIDATION_ERROR",
					message: "Invalid request body",
					details: parseResult.error.format()
				},
				status: 400
			};
			validatedInput = parseResult.data;
		} else validatedInput = options.body;
		const routeContext = {
			...this.contextFactory.createContext(this.plugin),
			input: validatedInput,
			request: guardConsumedRequestBody(options.request),
			requestMeta: extractRequestMeta(options.request, this.trustedProxyHeaders)
		};
		try {
			return {
				success: true,
				data: await route.handler(routeContext),
				status: 200
			};
		} catch (error) {
			if (error instanceof PluginRouteError) return {
				success: false,
				error: {
					code: error.code,
					message: error.message,
					details: error.details
				},
				status: error.status
			};
			console.error(`[plugin:${this.plugin.id}] Route handler failed:`, error);
			return {
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "An internal error occurred"
				},
				status: 500
			};
		}
	}
	/**
	* Get all route names
	*/
	getRouteNames() {
		return Object.keys(this.plugin.routes);
	}
	/**
	* Check if a route exists
	*/
	hasRoute(name) {
		return name in this.plugin.routes;
	}
	/**
	* Get route metadata without invoking the handler.
	* Returns null if the route doesn't exist.
	*/
	getRouteMeta(name) {
		const route = this.plugin.routes[name];
		if (!route) return null;
		return buildRouteMeta(route);
	}
};
/**
* Error class for plugin routes
* Allows plugins to return structured errors with specific HTTP status codes
*/
var PluginRouteError = class PluginRouteError extends Error {
	constructor(code, message, status = 400, details) {
		super(message);
		this.code = code;
		this.status = status;
		this.details = details;
		this.name = "PluginRouteError";
	}
	/**
	* Create a bad request error (400)
	*/
	static badRequest(message, details) {
		return new PluginRouteError("BAD_REQUEST", message, 400, details);
	}
	/**
	* Create an unauthorized error (401)
	*/
	static unauthorized(message = "Unauthorized") {
		return new PluginRouteError("UNAUTHORIZED", message, 401);
	}
	/**
	* Create a forbidden error (403)
	*/
	static forbidden(message = "Forbidden") {
		return new PluginRouteError("FORBIDDEN", message, 403);
	}
	/**
	* Create a not found error (404)
	*/
	static notFound(message = "Not found") {
		return new PluginRouteError("NOT_FOUND", message, 404);
	}
	/**
	* Create a conflict error (409)
	*/
	static conflict(message, details) {
		return new PluginRouteError("CONFLICT", message, 409, details);
	}
	/**
	* Create an internal error (500)
	*/
	static internal(message = "Internal error") {
		return new PluginRouteError("INTERNAL_ERROR", message, 500);
	}
};
/**
* Registry for all plugin route handlers
*/
var PluginRouteRegistry = class {
	handlers = /* @__PURE__ */ new Map();
	constructor(factoryOptions) {
		this.factoryOptions = factoryOptions;
	}
	/**
	* Register a plugin's routes
	*/
	register(plugin) {
		const handler = new PluginRouteHandler(plugin, this.factoryOptions);
		this.handlers.set(plugin.id, handler);
	}
	/**
	* Unregister a plugin's routes
	*/
	unregister(pluginId) {
		this.handlers.delete(pluginId);
	}
	/**
	* Invoke a plugin route
	*/
	async invoke(pluginId, routeName, options) {
		const handler = this.handlers.get(pluginId);
		if (!handler) return {
			success: false,
			error: {
				code: "PLUGIN_NOT_FOUND",
				message: `Plugin "${pluginId}" not found`
			},
			status: 404
		};
		return handler.invoke(routeName, options);
	}
	/**
	* Get all registered plugin IDs
	*/
	getPluginIds() {
		return [...this.handlers.keys()];
	}
	/**
	* Get routes for a plugin
	*/
	getRoutes(pluginId) {
		return this.handlers.get(pluginId)?.getRouteNames() ?? [];
	}
	/**
	* Get route metadata for a specific plugin route.
	* Returns null if the plugin or route doesn't exist.
	*/
	getRouteMeta(pluginId, routeName) {
		const handler = this.handlers.get(pluginId);
		if (!handler) return null;
		return handler.getRouteMeta(routeName);
	}
};
/** Minimum polling interval (ms) — prevents tight loops if next_run_at is in the past */
var MIN_INTERVAL_MS = 1e3;
/**
* Maximum polling interval (ms). Each wake runs the maintenance pass — stale
* lock recovery *and* the scheduled-publishing sweep + system cleanup. The cap
* is the worst-case latency for scheduled content when no plugin cron task is
* due sooner (`getNextDueTime()` only knows about cron tasks, not content
* `scheduled_at`). Held at 60s so Node publish latency matches the Cloudflare
* Cron Trigger cadence (`* * * * *`) rather than lagging up to five minutes.
*/
var MAX_INTERVAL_MS = 6e4;
var NodeCronScheduler = class {
	timer = null;
	running = false;
	systemCleanup = null;
	constructor(executor) {
		this.executor = executor;
	}
	setSystemCleanup(fn) {
		this.systemCleanup = fn;
	}
	start() {
		this.running = true;
		this.arm();
	}
	stop() {
		this.running = false;
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
	reschedule() {
		if (!this.running) return;
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		this.arm();
	}
	arm() {
		if (!this.running) return;
		this.executor.getNextDueTime().then((nextDue) => {
			if (!this.running) return void 0;
			let delayMs;
			if (nextDue) {
				const dueAt = new Date(nextDue).getTime();
				delayMs = Math.max(dueAt - Date.now(), MIN_INTERVAL_MS);
				delayMs = Math.min(delayMs, MAX_INTERVAL_MS);
			} else delayMs = MAX_INTERVAL_MS;
			this.timer = setTimeout(() => {
				if (!this.running) return;
				this.executeTick();
			}, delayMs);
			if (this.timer && typeof this.timer === "object" && "unref" in this.timer) this.timer.unref();
		}).catch((error) => {
			console.error("[cron:node] Failed to get next due time:", error);
			if (this.running) {
				this.timer = setTimeout(() => this.arm(), MAX_INTERVAL_MS);
				if (this.timer && typeof this.timer === "object" && "unref" in this.timer) this.timer.unref();
			}
		});
	}
	executeTick() {
		if (!this.running) return;
		const tasks = [this.executor.tick(), this.executor.recoverStaleLocks()];
		if (this.systemCleanup) tasks.push(this.systemCleanup());
		Promise.allSettled(tasks).then((results) => {
			for (const r of results) if (r.status === "rejected") console.error("[cron:node] Tick task failed:", r.reason);
		}).finally(() => {
			if (this.running) this.arm();
		});
	}
};
/**
* Error thrown when attempting to use sandboxing on an unsupported platform.
*/
var SandboxNotAvailableError = class extends Error {
	constructor() {
		super("Plugin sandboxing is not available. Configure a sandbox runner: use @emdash-cms/cloudflare/sandbox on Cloudflare, or @emdash-cms/sandbox-workerd/sandbox on Node.js (requires workerd). Without sandboxing, use trusted plugins (from config) instead.");
		this.name = "SandboxNotAvailableError";
	}
};
/**
* No-op sandbox runner for platforms without isolation support.
*
* - `isAvailable()` returns false
* - `load()` throws SandboxNotAvailableError
* - `terminateAll()` is a no-op
*
* This is the default runner when no platform adapter is configured.
*/
var NoopSandboxRunner = class {
	/**
	* Always returns false - sandboxing is not available.
	*/
	isAvailable() {
		return false;
	}
	/**
	* Always returns false - no sandbox runtime to be healthy.
	*/
	isHealthy() {
		return false;
	}
	/**
	* Always throws - can't load sandboxed plugins without isolation.
	*/
	async load(_manifest, _code) {
		throw new SandboxNotAvailableError();
	}
	/**
	* No-op - sandboxing not available, email callback is irrelevant.
	*/
	setEmailSend() {}
	/**
	* No-op - nothing to terminate.
	*/
	async terminateAll() {}
};
/**
* Create a no-op sandbox runner.
* This is used as the default when no platform adapter is configured.
*/
function createNoopSandboxRunner(_options) {
	return new NoopSandboxRunner();
}
/**
* Get a menu by name with resolved URLs.
*
* @example
* ```ts
* const menu = await getMenu("primary");
* const menuEs = await getMenu("primary", { locale: "es" });
* ```
*/
function getMenu(name, options = {}) {
	const locale = resolveLocale(options.locale);
	return requestCached(`menu:${name}:${locale ?? "*"}`, () => cachedQuery({
		namespace: CacheNamespace.MENUS,
		key: `${name}:${locale ?? "*"}`,
		load: async () => {
			return getMenuWithDb(name, await getDb(), { locale });
		}
	}));
}
/**
* Get menu by name with resolved URLs (with explicit db). Internal helper for
* admin routes that already have a database handle.
*/
async function getMenuWithDb(name, db, options = {}) {
	const chain = resolveLocaleChain(options.locale);
	const selectMenu = () => db.selectFrom("_emdash_menus").selectAll().where("name", "=", name);
	let menuRow;
	if (chain.length === 0) menuRow = await selectMenu().orderBy("locale", "asc").executeTakeFirst();
	else {
		menuRow = void 0;
		for (const locale of chain) {
			menuRow = await selectMenu().where("locale", "=", locale).executeTakeFirst();
			if (menuRow) break;
		}
	}
	if (!menuRow) return null;
	const items = await buildMenuTree(await db.selectFrom("_emdash_menu_items").selectAll().$castTo().where("menu_id", "=", menuRow.id).orderBy("sort_order", "asc").execute(), db, menuRow.locale);
	return {
		id: menuRow.id,
		name: menuRow.name,
		label: menuRow.label,
		items,
		locale: menuRow.locale,
		translationGroup: menuRow.translation_group
	};
}
/**
* Build a hierarchical menu tree from a flat list of items. Items are
* resolved against the given `locale` so references land on the right
* per-locale content rows.
*/
async function buildMenuTree(items, db, locale) {
	const collectionSlugs = /* @__PURE__ */ new Set();
	for (const item of items) {
		if (item.reference_collection) collectionSlugs.add(item.reference_collection);
		if (item.type === "page" || item.type === "post") collectionSlugs.add(item.reference_collection || `${item.type}s`);
	}
	const urlPatterns = collectionSlugs.size > 0 ? await getCollectionUrlPatterns(db, collectionSlugs) : /* @__PURE__ */ new Map();
	const validItems = (await Promise.all(items.map((item) => resolveMenuItem(item, db, urlPatterns, locale)))).filter((item) => item !== null);
	const itemMap = /* @__PURE__ */ new Map();
	const rootItems = [];
	for (const item of validItems) itemMap.set(item.id, {
		...item,
		children: []
	});
	for (const item of items) {
		const menuItem = itemMap.get(item.id);
		if (!menuItem) continue;
		if (item.parent_id) {
			const parent = itemMap.get(item.parent_id);
			if (parent) parent.children.push(menuItem);
			else rootItems.push(menuItem);
		} else rootItems.push(menuItem);
	}
	return rootItems;
}
/**
* Look up the `url_pattern` for a set of collection slugs, request-cached so
* a page rendering several menus (header, footer, ...) only pays for the
* lookup once per distinct slug set. Callers must treat the returned map as
* read-only — it is shared across cache hits within the request.
*/
function getCollectionUrlPatterns(db, collectionSlugs) {
	return requestCached(`menu-collection-patterns:${[...collectionSlugs].toSorted().join(",")}`, async () => {
		const rows = await db.selectFrom("_emdash_collections").select(["slug", "url_pattern"]).where("slug", "in", [...collectionSlugs]).execute();
		const urlPatterns = /* @__PURE__ */ new Map();
		for (const row of rows) urlPatterns.set(row.slug, row.url_pattern);
		return urlPatterns;
	});
}
/**
* Resolve a single menu item's URL. `reference_id` is a translation_group
* (migration 036 remapped all existing references); we join it against
* the per-locale ec_* row or per-locale taxonomy row.
*/
async function resolveMenuItem(item, db, urlPatterns, locale) {
	let url;
	try {
		switch (item.type) {
			case "custom":
				url = item.custom_url || "#";
				break;
			case "page":
			case "post":
				url = await resolveContentUrl(item.reference_collection || `${item.type}s`, item.reference_id, db, urlPatterns, locale);
				if (url === null) return null;
				break;
			case "taxonomy":
				url = await resolveTaxonomyUrl(item.reference_id, db, locale);
				if (url === null) return null;
				break;
			case "collection":
				if (!item.reference_collection) return null;
				if (item.reference_id) {
					url = await resolveContentUrl(item.reference_collection, item.reference_id, db, urlPatterns, locale);
					if (url === null) return null;
				} else url = `/${item.reference_collection}/`;
				break;
			default: if (item.reference_collection && item.reference_id) {
				url = await resolveContentUrl(item.reference_collection, item.reference_id, db, urlPatterns, locale);
				if (url === null) return null;
			} else url = "#";
		}
	} catch (error) {
		console.error(`Failed to resolve menu item ${item.id}:`, error);
		return null;
	}
	return {
		id: item.id,
		label: item.label,
		url: sanitizeHref(url),
		target: item.target || void 0,
		titleAttr: item.title_attr || void 0,
		cssClasses: item.css_classes || void 0,
		children: []
	};
}
var SLUG_PLACEHOLDER = /\{slug\}/g;
var ID_PLACEHOLDER = /\{id\}/g;
/**
* Interpolate a URL pattern with entry data
*
* Replaces `{slug}` and `{id}` placeholders.
*/
function interpolateUrlPattern(pattern, slug, id) {
	return pattern.replace(SLUG_PLACEHOLDER, slug).replace(ID_PLACEHOLDER, id);
}
/**
* Resolve the URL for a content reference. `referenceGroup` is the content
* row's translation_group; we look up the row in the requested locale
* (falling back to the source if no translation exists so the menu link is
* still clickable).
*/
async function resolveContentUrl(collection, referenceGroup, db, urlPatterns, locale) {
	if (!referenceGroup) return null;
	try {
		validateIdentifier(collection, "menu item collection");
		let result = await sql`
			SELECT id, slug FROM ${sql.ref(`ec_${collection}`)}
			WHERE translation_group = ${referenceGroup} AND locale = ${locale}
			LIMIT 1
		`.execute(db);
		let row = result.rows[0];
		if (!row) {
			result = await sql`
				SELECT id, slug FROM ${sql.ref(`ec_${collection}`)}
				WHERE translation_group = ${referenceGroup}
				ORDER BY locale ASC LIMIT 1
			`.execute(db);
			row = result.rows[0];
		}
		if (!row) row = (await sql`
				SELECT id, slug FROM ${sql.ref(`ec_${collection}`)}
				WHERE id = ${referenceGroup} LIMIT 1
			`.execute(db)).rows[0];
		if (!row) return null;
		const pattern = urlPatterns.get(collection);
		if (pattern) return interpolateUrlPattern(pattern, row.slug, row.id);
		return `/${collection}/${row.slug}`;
	} catch (error) {
		console.error(`Failed to resolve content URL for ${collection}/${referenceGroup}:`, error);
		return null;
	}
}
/**
* Resolve URL for a taxonomy term reference. `referenceGroup` is the term's
* translation_group; we pick the row in the active locale (or fall back).
*/
async function resolveTaxonomyUrl(referenceGroup, db, locale) {
	if (!referenceGroup) return null;
	let taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("translation_group", "=", referenceGroup).where("locale", "=", locale).executeTakeFirst();
	if (!taxonomy) taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("translation_group", "=", referenceGroup).orderBy("locale", "asc").executeTakeFirst();
	if (!taxonomy) taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("id", "=", referenceGroup).executeTakeFirst();
	if (!taxonomy) return null;
	return `/${taxonomy.name}/${taxonomy.slug}`;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/seo/index.mjs
var TRAILING_SLASH_RE = /\/$/;
var ABSOLUTE_URL_RE = /^https?:\/\//i;
/**
* Generate resolved SEO meta tags from a content item.
*
* Uses the content item's SEO fields, falling back to content data
* (title from `data.title`, description from `data.excerpt`).
*
* @param content - The content item (from getEmDashEntry, etc.)
* @param options - Configuration for title construction, canonical URLs, etc.
* @returns Resolved meta tags ready for template use
*/
function getSeoMeta(content, options = {}) {
	const { siteTitle, siteUrl, path, defaultOgImage, defaultTitle, defaultDescription } = options;
	const separator = options.titleSeparator || " | ";
	const seo = content.seo ?? content.data.seo ?? {
		title: null,
		description: null,
		image: null,
		canonical: null,
		noIndex: false
	};
	const pageTitle = seo.title || defaultTitle || (typeof content.data.title === "string" ? content.data.title : null) || "";
	const fullTitle = siteTitle && pageTitle ? `${pageTitle}${separator}${siteTitle}` : pageTitle;
	const description = seo.description || defaultDescription || (typeof content.data.excerpt === "string" ? content.data.excerpt : null) || null;
	const ogImage = seo.image ? buildSeoImageUrl(seo.image, siteUrl) : defaultOgImage ?? null;
	let canonical = null;
	if (seo.canonical) if (siteUrl && !seo.canonical.startsWith("/") && !ABSOLUTE_URL_RE.test(seo.canonical)) canonical = `${siteUrl.replace(TRAILING_SLASH_RE, "")}/${seo.canonical}`;
	else canonical = seo.canonical;
	else if (siteUrl && path) {
		const safePath = path.startsWith("/") ? path : `/${path}`;
		canonical = `${siteUrl.replace(TRAILING_SLASH_RE, "")}${safePath}`;
	}
	const robots = seo.noIndex ? "noindex, nofollow" : null;
	return {
		title: fullTitle,
		description,
		ogTitle: pageTitle || fullTitle,
		ogDescription: description,
		ogImage,
		canonical,
		robots
	};
}
//#endregion
export { PluginRouteError as a, createHookPipeline as c, getMenu as d, resolveExclusiveHooks as f, NodeCronScheduler as i, createNoopSandboxRunner as l, AuditRepository as n, PluginRouteRegistry as o, createSiteInfo as p, EmailPipeline as r, buildRouteMeta as s, getSeoMeta as t, definePlugin as u };
