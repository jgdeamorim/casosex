import { i as __toESM$1, n as __exportAll, r as __require, t as __commonJSMin$1 } from "./rolldown-runtime_B4iAMlE-.mjs";
import { p as encodeHexLowerCase } from "./server_BUyfTiNz.mjs";
import { P as defineMiddleware, u as sequence } from "./base-pipeline_BVoR9b4s.mjs";
import "./dist_Yqq_s2RP.mjs";
import { $ as _startsWith, A as _gt, B as _minLength, C as date, D as _coercedBoolean, E as toJSONSchema, F as _lt, G as _nonpositive, H as _multipleOf, I as _lte, J as _positive, K as _normalize, L as _maxLength, M as _includes, N as _length, O as _coercedNumber, P as _lowercase, Q as _slugify, R as _maxSize, T as iso_exports, U as _negative, V as _minSize, W as _nonnegative, X as _regex, Y as _property, Z as _size, _ as record, a as _null, b as union, c as boolean$1, d as discriminatedUnion, et as _toLowerCase, f as lazy, h as object, i as _enum, it as globalRegistry, j as _gte, k as _endsWith, m as number$1, n as ZodNumber, nt as _trim, o as any, p as literal, q as _overwrite, rt as _uppercase, s as array, t as ZodBoolean, tt as _toUpperCase, v as schemas_exports, w as datetime, x as unknown, y as string, z as _mime } from "./schemas_Cq5OeI4c.mjs";
import { a as sql } from "./migrator_BiAfLowp.mjs";
import { a as getDb, c as createRecorder, d as kyselyLogOption, f as Kysely, l as flushRecorder, u as isInstrumentationEnabled } from "./loader-C1XOLV5b_BlhHvfIP.mjs";
import { n as createRequestScopedDb, t as createDialect } from "./dialect_BAt3WMBD.mjs";
import { _ as pluginDataExtractExpr, b as validateIdentifier, c as resolveConfiguredLocale, g as listTablesLike, h as isSqlite, i as runMigrations, l as setI18nConfig, n as MIGRATION_RACE_WAIT_MS, o as getI18nConfig, s as isI18nEnabled, t as ConcurrentMigrationTimeoutError, v as pluginDataOrderExpr, x as validatePluginIdentifier } from "./runner-BsI18UgP_CTLRmh7U.mjs";
import { t as after } from "./after-B1IIdH3Y_D2PBgJNO.mjs";
import { n as getRequestContext, r as runWithContext, t as createRequestMetrics } from "./request-context_K9BAblf6.mjs";
import { n as cachedQuery, o as invalidateCollectionCache, s as invalidateCommentObjectCache, t as CacheNamespace } from "./object-cache-Bok5j2ae_B1rhuniT.mjs";
import { a as encodeCursor, c as encodeBase64, i as decodeCursor, l as encodeBase64url, n as InvalidCursorError, o as decodeBase64, r as ScheduledNotDueError, s as decodeBase64url, t as EmDashValidationError } from "./types-XrQQ-Aex_rb6o-8d1.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { _ as OptionsRepository, a as SsrfError, c as stripCredentialHeaders, d as invalidateSiteSettingsCache, f as createSingleFlightCache, g as MediaRepository, h as TaxonomyRepository, i as RedirectRepository, l as validateExternalUrl, m as imageSize, o as resolveAndValidateExternalUrl, p as singleFlightCached, r as index_lite_default, s as ssrfSafeFetch, u as getSiteSettings } from "./apply-1_6ra7NP_DwRK30si.mjs";
import { t as chunks } from "./chunks-D5dlPeRb_ZmalEYon.mjs";
import { n as isMissingTableError, t as isMissingColumnError } from "./db-errors-CcWLaRiR_Bz5UsdxN.mjs";
import { i as slugify, n as RevisionRepository, t as ContentRepository } from "./content-CpfKV9QE_etLgubJd.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { a as deleteContentMediaUsage, c as markContentMediaUsageCollectionStaleSafely, d as normalizeMediaValue, f as matchesMimeAllowlist, i as FTSManager, l as refreshContentMediaUsageAfterWrite, m as parseAllowedMimeTypes, n as SchemaRegistry, o as findNonTranslatableSiblingContentIds, p as normalizeMime, s as markContentMediaUsageCollectionStale, u as hashString } from "./registry-BP1JK2xh_BIzMuG5Y.mjs";
import { i as setRequestCacheEntry, r as requestCached } from "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import { i as initWithLock, r as createInitLock } from "./field-defs-cache-QMVnzTH6_BiUIoOqw.mjs";
import { n as resolveLocaleChain, t as resolveLocale } from "./resolve-BUvFE0Lr_pKrvCeOd.mjs";
import { a as Permissions, c as sha256, d as toRoleLevel, f as toTokenType, i as reconcileManifestAccess, l as Role, n as normalizeManifestRoute, o as hasScope, p as normalizeCapabilities, r as pluginManifestSchema, s as hashPrefixedToken, u as toDeviceType } from "./adapt-sandbox-entry_DQWjqsCm.mjs";
import { i as RESERVED_BYLINE_FIELD_SLUGS, o as RESERVED_FIELD_SLUGS } from "./types-o7xo7VgH_Bdv_7eeq.mjs";
import { t as BylineRepository } from "./byline-C5TAqs8N_VeQwI3KK.mjs";
import { d as invalidateTermCache, o as getTaxonomyDefs, s as getTaxonomyTerms } from "./taxonomies-B61CRSha_BHPfWUEN.mjs";
import { a as setCachedRedirects, i as matchCachedPatterns, n as getCachedRedirects, r as invalidateRedirectCache } from "./cache-B26cufFd_Cou1jd9N.mjs";
import "./zod-generator-DMzfga3g_Dl4m_oiC.mjs";
import { s as invalidateUrlPatternCache } from "./query-DCiXI7OZ_CGzeaVCJ.mjs";
import "./bylines-B8-WGdja_B6iZ6e06.mjs";
import "./validate-Bs_wT2ul_D6-mmjph.mjs";
import "./load-BwTdWE8B_DR9koUHl.mjs";
import { t as config_default } from "./config_DTEuujs6.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createReadStream, existsSync } from "node:fs";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { Readable } from "node:stream";
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/checks.js
var checks_exports = /* @__PURE__ */ __exportAll({
	endsWith: () => _endsWith,
	gt: () => _gt,
	gte: () => _gte,
	includes: () => _includes,
	length: () => _length,
	lowercase: () => _lowercase,
	lt: () => _lt,
	lte: () => _lte,
	maxLength: () => _maxLength,
	maxSize: () => _maxSize,
	mime: () => _mime,
	minLength: () => _minLength,
	minSize: () => _minSize,
	multipleOf: () => _multipleOf,
	negative: () => _negative,
	nonnegative: () => _nonnegative,
	nonpositive: () => _nonpositive,
	normalize: () => _normalize,
	overwrite: () => _overwrite,
	positive: () => _positive,
	property: () => _property,
	regex: () => _regex,
	size: () => _size,
	slugify: () => _slugify,
	startsWith: () => _startsWith,
	toLowerCase: () => _toLowerCase,
	toUpperCase: () => _toUpperCase,
	trim: () => _trim,
	uppercase: () => _uppercase
});
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/from-json-schema.js
var z = {
	...schemas_exports,
	...checks_exports,
	iso: iso_exports
};
var RECOGNIZED_KEYS = /*@__PURE__*/ new Set([
	"$schema",
	"$ref",
	"$defs",
	"definitions",
	"$id",
	"id",
	"$comment",
	"$anchor",
	"$vocabulary",
	"$dynamicRef",
	"$dynamicAnchor",
	"type",
	"enum",
	"const",
	"anyOf",
	"oneOf",
	"allOf",
	"not",
	"properties",
	"required",
	"additionalProperties",
	"patternProperties",
	"propertyNames",
	"minProperties",
	"maxProperties",
	"items",
	"prefixItems",
	"additionalItems",
	"minItems",
	"maxItems",
	"uniqueItems",
	"contains",
	"minContains",
	"maxContains",
	"minLength",
	"maxLength",
	"pattern",
	"format",
	"minimum",
	"maximum",
	"exclusiveMinimum",
	"exclusiveMaximum",
	"multipleOf",
	"description",
	"default",
	"contentEncoding",
	"contentMediaType",
	"contentSchema",
	"unevaluatedItems",
	"unevaluatedProperties",
	"if",
	"then",
	"else",
	"dependentSchemas",
	"dependentRequired",
	"nullable",
	"readOnly"
]);
function detectVersion(schema, defaultTarget) {
	const $schema = schema.$schema;
	if ($schema === "https://json-schema.org/draft/2020-12/schema") return "draft-2020-12";
	if ($schema === "http://json-schema.org/draft-07/schema#") return "draft-7";
	if ($schema === "http://json-schema.org/draft-04/schema#") return "draft-4";
	return defaultTarget ?? "draft-2020-12";
}
function resolveRef(ref, ctx) {
	if (!ref.startsWith("#")) throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
	const path = ref.slice(1).split("/").filter(Boolean);
	if (path.length === 0) return ctx.rootSchema;
	const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
	if (path[0] === defsKey) {
		const key = path[1];
		if (!key || !ctx.defs[key]) throw new Error(`Reference not found: ${ref}`);
		return ctx.defs[key];
	}
	throw new Error(`Reference not found: ${ref}`);
}
function convertBaseSchema(schema, ctx) {
	if (schema.not !== void 0) {
		if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) return z.never();
		throw new Error("not is not supported in Zod (except { not: {} } for never)");
	}
	if (schema.unevaluatedItems !== void 0) throw new Error("unevaluatedItems is not supported");
	if (schema.unevaluatedProperties !== void 0) throw new Error("unevaluatedProperties is not supported");
	if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) throw new Error("Conditional schemas (if/then/else) are not supported");
	if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) throw new Error("dependentSchemas and dependentRequired are not supported");
	if (schema.$ref) {
		const refPath = schema.$ref;
		if (ctx.refs.has(refPath)) return ctx.refs.get(refPath);
		if (ctx.processing.has(refPath)) return z.lazy(() => {
			if (!ctx.refs.has(refPath)) throw new Error(`Circular reference not resolved: ${refPath}`);
			return ctx.refs.get(refPath);
		});
		ctx.processing.add(refPath);
		const zodSchema = convertSchema(resolveRef(refPath, ctx), ctx);
		ctx.refs.set(refPath, zodSchema);
		ctx.processing.delete(refPath);
		return zodSchema;
	}
	if (schema.enum !== void 0) {
		const enumValues = schema.enum;
		if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) return z.null();
		if (enumValues.length === 0) return z.never();
		if (enumValues.length === 1) return z.literal(enumValues[0]);
		if (enumValues.every((v) => typeof v === "string")) return z.enum(enumValues);
		const literalSchemas = enumValues.map((v) => z.literal(v));
		if (literalSchemas.length < 2) return literalSchemas[0];
		return z.union([
			literalSchemas[0],
			literalSchemas[1],
			...literalSchemas.slice(2)
		]);
	}
	if (schema.const !== void 0) return z.literal(schema.const);
	const type = schema.type;
	if (Array.isArray(type)) {
		const typeSchemas = type.map((t) => {
			return convertBaseSchema({
				...schema,
				type: t
			}, ctx);
		});
		if (typeSchemas.length === 0) return z.never();
		if (typeSchemas.length === 1) return typeSchemas[0];
		return z.union(typeSchemas);
	}
	if (!type) return z.any();
	let zodSchema;
	switch (type) {
		case "string": {
			let stringSchema = z.string();
			if (schema.format) {
				const format = schema.format;
				if (format === "email") stringSchema = stringSchema.check(z.email());
				else if (format === "uri" || format === "uri-reference") stringSchema = stringSchema.check(z.url());
				else if (format === "uuid" || format === "guid") stringSchema = stringSchema.check(z.uuid());
				else if (format === "date-time") stringSchema = stringSchema.check(z.iso.datetime());
				else if (format === "date") stringSchema = stringSchema.check(z.iso.date());
				else if (format === "time") stringSchema = stringSchema.check(z.iso.time());
				else if (format === "duration") stringSchema = stringSchema.check(z.iso.duration());
				else if (format === "ipv4") stringSchema = stringSchema.check(z.ipv4());
				else if (format === "ipv6") stringSchema = stringSchema.check(z.ipv6());
				else if (format === "mac") stringSchema = stringSchema.check(z.mac());
				else if (format === "cidr") stringSchema = stringSchema.check(z.cidrv4());
				else if (format === "cidr-v6") stringSchema = stringSchema.check(z.cidrv6());
				else if (format === "base64") stringSchema = stringSchema.check(z.base64());
				else if (format === "base64url") stringSchema = stringSchema.check(z.base64url());
				else if (format === "e164") stringSchema = stringSchema.check(z.e164());
				else if (format === "jwt") stringSchema = stringSchema.check(z.jwt());
				else if (format === "emoji") stringSchema = stringSchema.check(z.emoji());
				else if (format === "nanoid") stringSchema = stringSchema.check(z.nanoid());
				else if (format === "cuid") stringSchema = stringSchema.check(z.cuid());
				else if (format === "cuid2") stringSchema = stringSchema.check(z.cuid2());
				else if (format === "ulid") stringSchema = stringSchema.check(z.ulid());
				else if (format === "xid") stringSchema = stringSchema.check(z.xid());
				else if (format === "ksuid") stringSchema = stringSchema.check(z.ksuid());
			}
			if (typeof schema.minLength === "number") stringSchema = stringSchema.min(schema.minLength);
			if (typeof schema.maxLength === "number") stringSchema = stringSchema.max(schema.maxLength);
			if (schema.pattern) stringSchema = stringSchema.regex(new RegExp(schema.pattern));
			zodSchema = stringSchema;
			break;
		}
		case "number":
		case "integer": {
			let numberSchema = type === "integer" ? z.number().int() : z.number();
			if (typeof schema.minimum === "number") numberSchema = numberSchema.min(schema.minimum);
			if (typeof schema.maximum === "number") numberSchema = numberSchema.max(schema.maximum);
			if (typeof schema.exclusiveMinimum === "number") numberSchema = numberSchema.gt(schema.exclusiveMinimum);
			else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") numberSchema = numberSchema.gt(schema.minimum);
			if (typeof schema.exclusiveMaximum === "number") numberSchema = numberSchema.lt(schema.exclusiveMaximum);
			else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") numberSchema = numberSchema.lt(schema.maximum);
			if (typeof schema.multipleOf === "number") numberSchema = numberSchema.multipleOf(schema.multipleOf);
			zodSchema = numberSchema;
			break;
		}
		case "boolean":
			zodSchema = z.boolean();
			break;
		case "null":
			zodSchema = z.null();
			break;
		case "object": {
			const shape = {};
			const properties = schema.properties || {};
			const requiredSet = new Set(schema.required || []);
			for (const [key, propSchema] of Object.entries(properties)) {
				const propZodSchema = convertSchema(propSchema, ctx);
				shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
			}
			if (schema.propertyNames) {
				const keySchema = convertSchema(schema.propertyNames, ctx);
				const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z.any();
				if (Object.keys(shape).length === 0) {
					zodSchema = z.record(keySchema, valueSchema);
					break;
				}
				const objectSchema = z.object(shape).passthrough();
				const recordSchema = z.looseRecord(keySchema, valueSchema);
				zodSchema = z.intersection(objectSchema, recordSchema);
				break;
			}
			if (schema.patternProperties) {
				const patternProps = schema.patternProperties;
				const patternKeys = Object.keys(patternProps);
				const looseRecords = [];
				for (const pattern of patternKeys) {
					const patternValue = convertSchema(patternProps[pattern], ctx);
					const keySchema = z.string().regex(new RegExp(pattern));
					looseRecords.push(z.looseRecord(keySchema, patternValue));
				}
				const schemasToIntersect = [];
				if (Object.keys(shape).length > 0) schemasToIntersect.push(z.object(shape).passthrough());
				schemasToIntersect.push(...looseRecords);
				if (schemasToIntersect.length === 0) zodSchema = z.object({}).passthrough();
				else if (schemasToIntersect.length === 1) zodSchema = schemasToIntersect[0];
				else {
					let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
					for (let i = 2; i < schemasToIntersect.length; i++) result = z.intersection(result, schemasToIntersect[i]);
					zodSchema = result;
				}
				break;
			}
			const objectSchema = z.object(shape);
			if (schema.additionalProperties === false) zodSchema = objectSchema.strict();
			else if (typeof schema.additionalProperties === "object") zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
			else zodSchema = objectSchema.passthrough();
			break;
		}
		case "array": {
			const prefixItems = schema.prefixItems;
			const items = schema.items;
			if (prefixItems && Array.isArray(prefixItems)) {
				const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
				const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : void 0;
				if (rest) zodSchema = z.tuple(tupleItems).rest(rest);
				else zodSchema = z.tuple(tupleItems);
				if (typeof schema.minItems === "number") zodSchema = zodSchema.check(z.minLength(schema.minItems));
				if (typeof schema.maxItems === "number") zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
			} else if (Array.isArray(items)) {
				const tupleItems = items.map((item) => convertSchema(item, ctx));
				const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : void 0;
				if (rest) zodSchema = z.tuple(tupleItems).rest(rest);
				else zodSchema = z.tuple(tupleItems);
				if (typeof schema.minItems === "number") zodSchema = zodSchema.check(z.minLength(schema.minItems));
				if (typeof schema.maxItems === "number") zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
			} else if (items !== void 0) {
				const element = convertSchema(items, ctx);
				let arraySchema = z.array(element);
				if (typeof schema.minItems === "number") arraySchema = arraySchema.min(schema.minItems);
				if (typeof schema.maxItems === "number") arraySchema = arraySchema.max(schema.maxItems);
				zodSchema = arraySchema;
			} else zodSchema = z.array(z.any());
			break;
		}
		default: throw new Error(`Unsupported type: ${type}`);
	}
	return zodSchema;
}
function convertSchema(schema, ctx) {
	if (typeof schema === "boolean") return schema ? z.any() : z.never();
	let baseSchema = convertBaseSchema(schema, ctx);
	const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		const options = schema.anyOf.map((s) => convertSchema(s, ctx));
		const anyOfUnion = z.union(options);
		baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
	}
	if (schema.oneOf && Array.isArray(schema.oneOf)) {
		const options = schema.oneOf.map((s) => convertSchema(s, ctx));
		const oneOfUnion = z.xor(options);
		baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
	}
	if (schema.allOf && Array.isArray(schema.allOf)) {
		if (schema.allOf.length === 0) baseSchema = hasExplicitType ? baseSchema : z.any();
		else {
			let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
			const startIdx = hasExplicitType ? 0 : 1;
			for (let i = startIdx; i < schema.allOf.length; i++) result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
			baseSchema = result;
		}
	}
	if (schema.nullable === true && ctx.version === "openapi-3.0") baseSchema = z.nullable(baseSchema);
	if (schema.readOnly === true) baseSchema = z.readonly(baseSchema);
	if (schema.default !== void 0) baseSchema = baseSchema.default(schema.default);
	const extraMeta = {};
	for (const key of [
		"$id",
		"id",
		"$comment",
		"$anchor",
		"$vocabulary",
		"$dynamicRef",
		"$dynamicAnchor"
	]) if (key in schema) extraMeta[key] = schema[key];
	for (const key of [
		"contentEncoding",
		"contentMediaType",
		"contentSchema"
	]) if (key in schema) extraMeta[key] = schema[key];
	for (const key of Object.keys(schema)) if (!RECOGNIZED_KEYS.has(key)) extraMeta[key] = schema[key];
	if (Object.keys(extraMeta).length > 0) ctx.registry.add(baseSchema, extraMeta);
	if (schema.description) baseSchema = baseSchema.describe(schema.description);
	return baseSchema;
}
/**
* Converts a JSON Schema to a Zod schema. This function should be considered semi-experimental. It's behavior is liable to change. */
function fromJSONSchema(schema, params) {
	if (typeof schema === "boolean") return schema ? z.any() : z.never();
	let normalized;
	try {
		normalized = JSON.parse(JSON.stringify(schema));
	} catch {
		throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
	}
	const ctx = {
		version: detectVersion(normalized, params?.defaultTarget),
		defs: normalized.$defs || normalized.definitions || {},
		refs: /* @__PURE__ */ new Map(),
		processing: /* @__PURE__ */ new Set(),
		rootSchema: normalized,
		registry: params?.registry ?? globalRegistry
	};
	return convertSchema(normalized, ctx);
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/coerce.js
function number(params) {
	return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return _coercedBoolean(ZodBoolean, params);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/comment-DnTxxVHv.mjs
/** Matches LIKE wildcard characters and the escape character itself */
var LIKE_ESCAPE_RE = /[%_\\]/g;
var CommentRepository = class CommentRepository {
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new comment
	*/
	async create(input) {
		const id = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await this.db.insertInto("_emdash_comments").values({
			id,
			collection: input.collection,
			content_id: input.contentId,
			parent_id: input.parentId ?? null,
			author_name: input.authorName,
			author_email: input.authorEmail,
			author_user_id: input.authorUserId ?? null,
			body: input.body,
			status: input.status ?? "pending",
			ip_hash: input.ipHash ?? null,
			user_agent: input.userAgent ?? null,
			moderation_metadata: input.moderationMetadata ? JSON.stringify(input.moderationMetadata) : null,
			created_at: now,
			updated_at: now
		}).execute();
		invalidateCommentObjectCache();
		const comment = await this.findById(id);
		if (!comment) throw new Error("Failed to create comment");
		return comment;
	}
	/**
	* Find comment by ID
	*/
	async findById(id) {
		const row = await this.db.selectFrom("_emdash_comments").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToComment(row) : null;
	}
	/**
	* Find comments for a content item with optional status filter.
	* Results are ordered by created_at ASC (oldest first) for display.
	*/
	async findByContent(collection, contentId, options = {}) {
		const limit = Math.min(options.limit || 50, 100);
		let query = this.db.selectFrom("_emdash_comments").selectAll().where("collection", "=", collection).where("content_id", "=", contentId);
		if (options.status) query = query.where("status", "=", options.status);
		if (options.cursor) {
			const decoded = decodeCursor(options.cursor);
			query = query.where((eb) => eb.or([eb("created_at", ">", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", ">", decoded.id)])]));
		}
		query = query.orderBy("created_at", "asc").orderBy("id", "asc").limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit).map((r) => this.rowToComment(r));
		const result = { items };
		if (hasMore && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}
		return result;
	}
	/**
	* Find comments by status (moderation inbox).
	* Results are ordered by created_at DESC (newest first).
	*/
	async findByStatus(status, options = {}) {
		const limit = Math.min(options.limit || 50, 100);
		let query = this.db.selectFrom("_emdash_comments").selectAll().where("status", "=", status);
		if (options.collection) query = query.where("collection", "=", options.collection);
		if (options.search) {
			const term = `%${options.search.replace(LIKE_ESCAPE_RE, (ch) => `\\${ch}`)}%`;
			query = query.where((eb) => eb.or([
				sql`author_name LIKE ${term} ESCAPE '\\'`,
				sql`author_email LIKE ${term} ESCAPE '\\'`,
				sql`body LIKE ${term} ESCAPE '\\'`
			]));
		}
		if (options.cursor) {
			const decoded = decodeCursor(options.cursor);
			query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
		}
		query = query.orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit).map((r) => this.rowToComment(r));
		const result = { items };
		if (hasMore && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}
		return result;
	}
	/**
	* Update comment status
	*/
	async updateStatus(id, status) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await this.db.updateTable("_emdash_comments").set({
			status,
			updated_at: now
		}).where("id", "=", id).execute();
		invalidateCommentObjectCache();
		return this.findById(id);
	}
	/**
	* Bulk update comment statuses
	*/
	async bulkUpdateStatus(ids, status) {
		if (ids.length === 0) return 0;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const result = await this.db.updateTable("_emdash_comments").set({
			status,
			updated_at: now
		}).where("id", "in", ids).executeTakeFirst();
		invalidateCommentObjectCache();
		return Number(result.numUpdatedRows ?? 0);
	}
	/**
	* Hard-delete a single comment. Replies cascade via FK.
	*/
	async delete(id) {
		const result = await this.db.deleteFrom("_emdash_comments").where("id", "=", id).executeTakeFirst();
		invalidateCommentObjectCache();
		return (result.numDeletedRows ?? 0) > 0;
	}
	/**
	* Bulk hard-delete comments
	*/
	async bulkDelete(ids) {
		if (ids.length === 0) return 0;
		const result = await this.db.deleteFrom("_emdash_comments").where("id", "in", ids).executeTakeFirst();
		invalidateCommentObjectCache();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Delete all comments for a content item (cascade on content deletion)
	*/
	async deleteByContent(collection, contentId) {
		const result = await this.db.deleteFrom("_emdash_comments").where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
		invalidateCommentObjectCache();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Count comments for a content item, optionally filtered by status
	*/
	async countByContent(collection, contentId, status) {
		let query = this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("collection", "=", collection).where("content_id", "=", contentId);
		if (status) query = query.where("status", "=", status);
		const result = await query.executeTakeFirst();
		return Number(result?.count ?? 0);
	}
	/**
	* Count comments grouped by status (for inbox badges)
	*
	* Uses four parallel COUNT queries with WHERE filters to leverage partial indexes
	* (idx_comments_pending, idx_comments_approved, idx_comments_spam, idx_comments_trash)
	* instead of a full table GROUP BY scan.
	*/
	async countByStatus() {
		const [pending, approved, spam, trash] = await Promise.all([
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "pending").executeTakeFirst(),
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "approved").executeTakeFirst(),
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "spam").executeTakeFirst(),
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "trash").executeTakeFirst()
		]);
		return {
			pending: Number(pending?.count ?? 0),
			approved: Number(approved?.count ?? 0),
			spam: Number(spam?.count ?? 0),
			trash: Number(trash?.count ?? 0)
		};
	}
	/**
	* Count approved comments from a given email address.
	* Used for "first time commenter" moderation logic.
	*/
	async countApprovedByEmail(email) {
		const result = await this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("author_email", "=", email).where("status", "=", "approved").executeTakeFirst();
		return Number(result?.count ?? 0);
	}
	/**
	* Update the moderation metadata JSON on a comment
	*/
	async updateModerationMetadata(id, metadata) {
		await this.db.updateTable("_emdash_comments").set({ moderation_metadata: JSON.stringify(metadata) }).where("id", "=", id).execute();
	}
	/**
	* Assemble a flat list of comments into a threaded structure (1-level nesting)
	*/
	static assembleThreads(comments) {
		const roots = [];
		const childrenMap = /* @__PURE__ */ new Map();
		for (const comment of comments) if (comment.parentId) {
			const siblings = childrenMap.get(comment.parentId) ?? [];
			siblings.push(comment);
			childrenMap.set(comment.parentId, siblings);
		} else roots.push(comment);
		return roots.map((root) => ({
			...root,
			_replies: childrenMap.get(root.id) ?? []
		}));
	}
	/**
	* Convert a Comment to its public-facing shape
	*/
	static toPublicComment(comment) {
		const pub = {
			id: comment.id,
			parentId: comment.parentId,
			authorName: comment.authorName,
			isRegisteredUser: comment.authorUserId !== null,
			body: comment.body,
			createdAt: comment.createdAt
		};
		if (comment._replies && comment._replies.length > 0) pub.replies = comment._replies.map((r) => CommentRepository.toPublicComment(r));
		return pub;
	}
	rowToComment(row) {
		return {
			id: row.id,
			collection: row.collection,
			contentId: row.content_id,
			parentId: row.parent_id,
			authorName: row.author_name,
			authorEmail: row.author_email,
			authorUserId: row.author_user_id,
			body: row.body,
			status: row.status,
			ipHash: row.ip_hash,
			userAgent: row.user_agent,
			moderationMetadata: row.moderation_metadata ? safeJsonParse(row.moderation_metadata) : null,
			createdAt: row.created_at,
			updatedAt: row.updated_at
		};
	}
};
function safeJsonParse(value) {
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/user-BAumEmpA.mjs
/**
* User repository for CRUD operations
*/
var UserRepository = class UserRepository {
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new user
	*/
	async create(input) {
		const id = ulid();
		const row = {
			id,
			email: input.email.toLowerCase(),
			name: input.name ?? null,
			role: UserRepository.resolveRole(input.role ?? 10),
			avatar_url: input.avatarUrl ?? null,
			email_verified: 0,
			data: input.data ? JSON.stringify(input.data) : null
		};
		await this.db.insertInto("users").values(row).execute();
		const user = await this.findById(id);
		if (!user) throw new Error("Failed to create user");
		return user;
	}
	/**
	* Find user by ID
	*/
	async findById(id) {
		const row = await this.db.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToUser(row) : null;
	}
	/**
	* Batch-resolve users by ID. Returns only the users that exist; missing
	* IDs are silently dropped. Chunked at `SQL_BATCH_SIZE` to stay within
	* D1's bind-parameter limit.
	*/
	async findByIds(ids) {
		const unique = [...new Set(ids)].filter((id) => id.length > 0);
		if (unique.length === 0) return [];
		const out = [];
		for (const batch of chunks(unique, 50)) {
			const rows = await this.db.selectFrom("users").selectAll().where("id", "in", batch).execute();
			for (const row of rows) out.push(this.rowToUser(row));
		}
		return out;
	}
	/**
	* Find user by email (case-insensitive)
	*/
	async findByEmail(email) {
		const row = await this.db.selectFrom("users").selectAll().where("email", "=", email.toLowerCase()).executeTakeFirst();
		return row ? this.rowToUser(row) : null;
	}
	/**
	* List all users with cursor-based pagination
	*/
	async findMany(options = {}) {
		const limit = Math.min(Math.max(1, options.limit || 50), 100);
		let query = this.db.selectFrom("users").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
		if (options.role !== void 0) query = query.where("role", "=", UserRepository.resolveRole(options.role));
		if (options.cursor) {
			const decoded = decodeCursor(options.cursor);
			query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
		}
		const rows = await query.execute();
		const items = rows.slice(0, limit).map((row) => this.rowToUser(row));
		const result = { items };
		if (rows.length > limit && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}
		return result;
	}
	/**
	* Update a user
	*/
	async update(id, input) {
		if (!await this.findById(id)) return null;
		const updates = {};
		if (input.name !== void 0) updates.name = input.name;
		if (input.role !== void 0) updates.role = UserRepository.resolveRole(input.role);
		if (input.avatarUrl !== void 0) updates.avatar_url = input.avatarUrl;
		if (input.data !== void 0) updates.data = JSON.stringify(input.data);
		if (Object.keys(updates).length > 0) await this.db.updateTable("users").set(updates).where("id", "=", id).execute();
		return this.findById(id);
	}
	/**
	* Delete a user
	*/
	async delete(id) {
		return ((await this.db.deleteFrom("users").where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
	}
	/**
	* Count users
	*/
	async count(role) {
		let query = this.db.selectFrom("users").select((eb) => eb.fn.count("id").as("count"));
		if (role !== void 0) query = query.where("role", "=", UserRepository.resolveRole(role));
		const result = await query.executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Check if email exists
	*/
	async emailExists(email) {
		return !!await this.db.selectFrom("users").select("id").where("email", "=", email.toLowerCase()).executeTakeFirst();
	}
	/**
	* Convert database row to User object
	*/
	rowToUser(row) {
		return {
			id: row.id,
			email: row.email,
			name: row.name,
			role: UserRepository.toRole(row.role),
			avatarUrl: row.avatar_url,
			emailVerified: row.email_verified === 1,
			data: row.data ? JSON.parse(row.data) : null,
			createdAt: row.created_at
		};
	}
	/** Map of role name strings to numeric levels */
	static ROLE_NAME_TO_LEVEL = {
		subscriber: 10,
		contributor: 20,
		author: 30,
		editor: 40,
		admin: 50
	};
	/** Valid numeric role levels */
	static VALID_LEVELS = /* @__PURE__ */ new Set([
		10,
		20,
		30,
		40,
		50
	]);
	/**
	* Resolve a role name or number to a valid numeric UserRole.
	* Accepts both string names ("admin") and numeric levels (50).
	*/
	static resolveRole(role) {
		if (typeof role === "string") {
			const level = UserRepository.ROLE_NAME_TO_LEVEL[role];
			if (level === void 0) throw new Error(`Invalid role name: ${role}`);
			return level;
		}
		if (!UserRepository.VALID_LEVELS.has(role)) throw new Error(`Invalid role level: ${role}`);
		return role;
	}
	/**
	* Convert a raw DB integer to a typed UserRole.
	* Falls back to subscriber (10) for unknown values.
	*/
	static toRole(level) {
		if (UserRepository.VALID_LEVELS.has(level)) return level;
		return 10;
	}
};
//#endregion
//#region node_modules/.pnpm/blurhash@2.0.5/node_modules/blurhash/dist/index.mjs
var q = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"#",
	"$",
	"%",
	"*",
	"+",
	",",
	"-",
	".",
	":",
	";",
	"=",
	"?",
	"@",
	"[",
	"]",
	"^",
	"_",
	"{",
	"|",
	"}",
	"~"
];
var p$1 = (t, e) => {
	var r = "";
	for (let n = 1; n <= e; n++) {
		let l = Math.floor(t) / Math.pow(83, e - n) % 83;
		r += q[Math.floor(l)];
	}
	return r;
};
var f$1 = (t) => {
	let e = t / 255;
	return e <= .04045 ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4);
};
var h = (t) => {
	let e = Math.max(0, Math.min(1, t));
	return e <= .0031308 ? Math.trunc(e * 12.92 * 255 + .5) : Math.trunc((1.055 * Math.pow(e, .4166666666666667) - .055) * 255 + .5);
};
var F = (t) => t < 0 ? -1 : 1;
var M = (t, e) => F(t) * Math.pow(Math.abs(t), e);
var d = class extends Error {
	constructor(e) {
		super(e), this.name = "ValidationError", this.message = e;
	}
};
var A$1 = 4;
var D$1 = (t, e, r, n) => {
	let l = 0, m = 0, b = 0, g = e * A$1;
	for (let u = 0; u < e; u++) {
		let c = A$1 * u;
		for (let s = 0; s < r; s++) {
			let o = c + s * g, a = n(u, s);
			l += a * f$1(t[o]), m += a * f$1(t[o + 1]), b += a * f$1(t[o + 2]);
		}
	}
	let i = 1 / (e * r);
	return [
		l * i,
		m * i,
		b * i
	];
};
var $$1 = (t) => {
	let e = h(t[0]), r = h(t[1]), n = h(t[2]);
	return (e << 16) + (r << 8) + n;
};
var H = (t, e) => {
	let r = Math.floor(Math.max(0, Math.min(18, Math.floor(M(t[0] / e, .5) * 9 + 9.5)))), n = Math.floor(Math.max(0, Math.min(18, Math.floor(M(t[1] / e, .5) * 9 + 9.5)))), l = Math.floor(Math.max(0, Math.min(18, Math.floor(M(t[2] / e, .5) * 9 + 9.5))));
	return r * 19 * 19 + n * 19 + l;
};
var O$1 = (t, e, r, n, l) => {
	if (n < 1 || n > 9 || l < 1 || l > 9) throw new d("BlurHash must have between 1 and 9 components");
	if (e * r * 4 !== t.length) throw new d("Width and height must match the pixels array");
	let m = [];
	for (let s = 0; s < l; s++) for (let o = 0; o < n; o++) {
		let a = o == 0 && s == 0 ? 1 : 2, y = D$1(t, e, r, (B, R) => a * Math.cos(Math.PI * o * B / e) * Math.cos(Math.PI * s * R / r));
		m.push(y);
	}
	let b = m[0], g = m.slice(1), i = "", u = n - 1 + (l - 1) * 9;
	i += p$1(u, 1);
	let c;
	if (g.length > 0) {
		let s = Math.max(...g.map((a) => Math.max(...a))), o = Math.floor(Math.max(0, Math.min(82, Math.floor(s * 166 - .5))));
		c = (o + 1) / 166, i += p$1(o, 1);
	} else c = 1, i += p$1(0, 1);
	return i += p$1($$1(b), 4), g.forEach((s) => {
		i += p$1(H(s, c), 2);
	}), i;
};
var S = O$1;
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/enrich-CFJJgxs_.mjs
/**
* Image Placeholder Generation
*
* Generates blurhash and dominant color from image buffers for LQIP support.
* Decodes images via jpeg-js (pure JS) and upng-js (pure JS, uses pako for
* deflate). No Node-specific dependencies — works in Workers and Node SSR.
*/
var SUPPORTED_TYPES = {
	"image/jpeg": "jpeg",
	"image/jpg": "jpeg",
	"image/png": "png"
};
/** Max width for blurhash input. Encode is O(w*h*components), so downsample first. */
var MAX_ENCODE_WIDTH = 32;
/** Max decoded RGBA size (32 MB). Images exceeding this skip placeholder generation. */
var MAX_DECODED_BYTES = 33554432;
/**
* Decode a JPEG buffer into raw RGBA pixel data.
*/
async function decodeJpeg(buffer) {
	const { decode } = await import("./jpeg-js_le77mEeL.mjs").then((m) => /* @__PURE__ */ __toESM$1(m.default, 1));
	const result = decode(buffer, { useTArray: true });
	return {
		width: result.width,
		height: result.height,
		data: result.data
	};
}
/**
* Decode a PNG buffer into raw RGBA pixel data.
* Uses upng-js (pure JS with pako deflate) — no Node zlib dependency.
*/
async function decodePng(buffer) {
	const UPNG = (await import("./UPNG_B7BsoRxB.mjs").then((m) => /* @__PURE__ */ __toESM$1(m.default, 1))).default;
	const img = UPNG.decode(buffer.buffer);
	const frames = UPNG.toRGBA8(img);
	const rgba = new Uint8Array(frames[0]);
	return {
		width: img.width,
		height: img.height,
		data: rgba
	};
}
/**
* Extract the dominant color from RGBA pixel data.
* Simple average of all non-transparent pixels.
*/
function extractDominantColor(data, width, height) {
	let r = 0;
	let g = 0;
	let b = 0;
	let count = 0;
	const len = width * height * 4;
	for (let i = 0; i < len; i += 4) {
		if (data[i + 3] < 128) continue;
		r += data[i];
		g += data[i + 1];
		b += data[i + 2];
		count++;
	}
	if (count === 0) return "rgb(0,0,0)";
	return `rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`;
}
/**
* Read image dimensions from headers without decoding pixel data.
* Returns null when the header cannot be parsed.
*
* Shared by every caller that needs pixel dimensions so the header is parsed
* once per buffer, not re-read inside generatePlaceholder.
*/
function readDimensions(buffer) {
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
/**
* Generate blurhash and dominant color from an image buffer.
* Returns null for non-image MIME types or on failure.
*
* @param dimensions - Optional pre-known dimensions. When present they are
*   trusted verbatim (the caller has typically already read them via
*   readDimensions); otherwise dimensions are read from this buffer's header.
*   Generation is skipped (returns null) when no dimensions are available at
*   all, or when the decoded size (width * height * 4) exceeds
*   MAX_DECODED_BYTES — both guards avoid OOM from unbounded decodes on
*   memory-constrained runtimes.
*/
async function generatePlaceholder(buffer, mimeType, dimensions) {
	const format = SUPPORTED_TYPES[normalizeMime(mimeType)];
	if (!format) return null;
	try {
		const dims = dimensions ?? readDimensions(buffer);
		if (!dims) return null;
		if (dims.width * dims.height * 4 > MAX_DECODED_BYTES) return null;
		const { width, height, data } = format === "jpeg" ? await decodeJpeg(buffer) : await decodePng(buffer);
		if (width === 0 || height === 0) return null;
		let encodePixels;
		let encodeWidth;
		let encodeHeight;
		if (width > MAX_ENCODE_WIDTH) {
			const scale = MAX_ENCODE_WIDTH / width;
			encodeWidth = MAX_ENCODE_WIDTH;
			encodeHeight = Math.max(1, Math.round(height * scale));
			encodePixels = downsample(data, width, height, encodeWidth, encodeHeight);
		} else {
			encodeWidth = width;
			encodeHeight = height;
			encodePixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
		}
		return {
			blurhash: S(encodePixels, encodeWidth, encodeHeight, 4, 3),
			dominantColor: extractDominantColor(data, width, height)
		};
	} catch {
		return null;
	}
}
/**
* Nearest-neighbor downsample of RGBA pixel data.
*/
function downsample(src, srcW, srcH, dstW, dstH) {
	const dst = new Uint8ClampedArray(dstW * dstH * 4);
	for (let y = 0; y < dstH; y++) {
		const srcY = Math.floor(y * srcH / dstH);
		for (let x = 0; x < dstW; x++) {
			const srcX = Math.floor(x * srcW / dstW);
			const srcIdx = (srcY * srcW + srcX) * 4;
			const dstIdx = (y * dstW + x) * 4;
			dst[dstIdx] = src[srcIdx];
			dst[dstIdx + 1] = src[srcIdx + 1];
			dst[dstIdx + 2] = src[srcIdx + 2];
			dst[dstIdx + 3] = src[srcIdx + 3];
		}
	}
	return dst;
}
/**
* Image Metadata Enrichment
*
* Single seam that derives image dimensions and LQIP placeholders (blurhash,
* dominant color) from raw image bytes. Every server-side media-creation path
* routes through this so records are populated consistently. Pure-JS and
* Workers-safe (image-size reads headers only; generatePlaceholder guards
* decode size).
*/
/**
* Derive dimensions + LQIP placeholders from image bytes.
*
* - Non-image content types return `{}`.
* - `knownDimensions` (e.g. browser `naturalWidth/Height`) win over `image-size`
*   for the *stored record* because the browser applies EXIF orientation;
*   `image-size` reports raw header dimensions, which are swapped for
*   90°/270°-rotated JPEGs. They are NOT used for the decode OOM guard — see below.
* - The placeholder OOM guard uses only header dimensions read from the bytes
*   actually decoded. Caller-supplied `knownDimensions` are untrusted for the
*   guard: a client could claim a tiny size for a huge image to bypass the cap.
* - `placeholder` lets a caller decode a smaller thumbnail for the blurhash to
*   avoid OOM on large originals; dimensions still come from `bytes`.
* - Placeholders are jpeg/png only (the generator's supported formats); other
*   image types still get dimensions.
*/
async function enrichImageMetadata(bytes, contentType, opts) {
	const normalizedContentType = normalizeMime(contentType);
	if (!normalizedContentType.startsWith("image/")) return {};
	const headerDims = readDimensions(bytes) ?? void 0;
	const recordDims = opts?.knownDimensions ?? headerDims;
	const override = opts?.placeholder;
	const placeholder = await generatePlaceholder(override ? override.bytes : bytes, override ? normalizeMime(override.contentType) : normalizedContentType, override ? void 0 : headerDims);
	return {
		width: recordDims?.width,
		height: recordDims?.height,
		blurhash: placeholder?.blurhash,
		dominantColor: placeholder?.dominantColor
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/seo-BAPKiED8.mjs
/** Default SEO values for content without an explicit SEO row */
var SEO_DEFAULTS$1 = {
	title: null,
	description: null,
	image: null,
	canonical: null,
	noIndex: false
};
/**
* Returns true if the input has at least one explicitly-set SEO field.
* Used to skip no-op upserts when callers pass `{ seo: {} }`.
*/
function hasAnyField(input) {
	return input.title !== void 0 || input.description !== void 0 || input.image !== void 0 || input.canonical !== void 0 || input.noIndex !== void 0;
}
/**
* Repository for SEO metadata stored in `_emdash_seo`.
*
* SEO data lives in a separate table keyed by (collection, content_id).
* Only collections with `has_seo = 1` should use this — callers are
* responsible for checking the flag before reading/writing.
*/
var SeoRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Check whether a collection has SEO enabled (`has_seo = 1`).
	* Returns `false` if the collection does not exist.
	*/
	async isEnabled(collection) {
		return (await this.db.selectFrom("_emdash_collections").select("has_seo").where("slug", "=", collection).executeTakeFirst())?.has_seo === 1;
	}
	/**
	* Get SEO data for a content item. Returns null defaults if no row exists.
	*/
	async get(collection, contentId) {
		const row = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
		if (!row) return { ...SEO_DEFAULTS$1 };
		return {
			title: row.seo_title ?? null,
			description: row.seo_description ?? null,
			image: row.seo_image ?? null,
			canonical: row.seo_canonical ?? null,
			noIndex: row.seo_no_index === 1
		};
	}
	/**
	* Get SEO data for multiple content items.
	* Returns a Map keyed by content_id. Items without SEO rows get defaults.
	*
	* Chunks the `content_id IN (…)` clause so the total bound-parameter count
	* per statement (ids + the `collection = ?` filter) stays within Cloudflare
	* D1's 100-variable limit regardless of how many content items are passed.
	*/
	async getMany(collection, contentIds) {
		const result = /* @__PURE__ */ new Map();
		if (contentIds.length === 0) return result;
		for (const id of contentIds) result.set(id, { ...SEO_DEFAULTS$1 });
		const uniqueContentIds = [...new Set(contentIds)];
		for (const chunk of chunks(uniqueContentIds, 50)) {
			const rows = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "in", chunk).execute();
			for (const row of rows) result.set(row.content_id, {
				title: row.seo_title ?? null,
				description: row.seo_description ?? null,
				image: row.seo_image ?? null,
				canonical: row.seo_canonical ?? null,
				noIndex: row.seo_no_index === 1
			});
		}
		return result;
	}
	/**
	* Upsert SEO data for a content item using INSERT ON CONFLICT DO UPDATE
	* for atomicity. Skips no-op writes when input has no fields set.
	*/
	async upsert(collection, contentId, input) {
		if (!hasAnyField(input)) return this.get(collection, contentId);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await sql`
			INSERT INTO _emdash_seo (
				collection, content_id,
				seo_title, seo_description, seo_image, seo_canonical, seo_no_index,
				created_at, updated_at
			) VALUES (
				${collection}, ${contentId},
				${input.title ?? null}, ${input.description ?? null},
				${input.image ?? null}, ${input.canonical ?? null},
				${input.noIndex ? 1 : 0},
				${now}, ${now}
			)
			ON CONFLICT (collection, content_id) DO UPDATE SET
				seo_title = ${input.title !== void 0 ? sql`${input.title}` : sql`_emdash_seo.seo_title`},
				seo_description = ${input.description !== void 0 ? sql`${input.description}` : sql`_emdash_seo.seo_description`},
				seo_image = ${input.image !== void 0 ? sql`${input.image}` : sql`_emdash_seo.seo_image`},
				seo_canonical = ${input.canonical !== void 0 ? sql`${input.canonical}` : sql`_emdash_seo.seo_canonical`},
				seo_no_index = ${input.noIndex !== void 0 ? sql`${input.noIndex ? 1 : 0}` : sql`_emdash_seo.seo_no_index`},
				updated_at = ${now}
		`.execute(this.db);
		invalidateCollectionCache(collection);
		return this.get(collection, contentId);
	}
	/**
	* Delete SEO data for a content item.
	*/
	async delete(collection, contentId) {
		await this.db.deleteFrom("_emdash_seo").where("collection", "=", collection).where("content_id", "=", contentId).execute();
		invalidateCollectionCache(collection);
	}
	/**
	* Copy SEO data from one content item to another.
	* Used by duplicate. Clears canonical (it pointed to the original).
	*/
	async copyForDuplicate(collection, sourceId, targetId) {
		const source = await this.get(collection, sourceId);
		if (source.title !== null || source.description !== null || source.image !== null || source.noIndex) await this.upsert(collection, targetId, {
			title: source.title,
			description: source.description,
			image: source.image,
			canonical: null,
			noIndex: source.noIndex
		});
	}
};
//#endregion
//#region node_modules/.pnpm/croner@10.0.1/node_modules/croner/dist/croner.js
function T(s) {
	return Date.UTC(s.y, s.m - 1, s.d, s.h, s.i, s.s);
}
function D(s, e) {
	return s.y === e.y && s.m === e.m && s.d === e.d && s.h === e.h && s.i === e.i && s.s === e.s;
}
function A(s, e) {
	let t = new Date(Date.parse(s));
	if (isNaN(t)) throw new Error("Invalid ISO8601 passed to timezone parser.");
	let r = s.substring(9);
	return r.includes("Z") || r.includes("+") || r.includes("-") ? b(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), "Etc/UTC") : b(t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), e);
}
function v(s, e, t) {
	return k(A(s, e), t);
}
function k(s, e) {
	let t = new Date(T(s)), r = g$1(t, s.tz), a = T(s) - T(r), o = new Date(t.getTime() + a), h = g$1(o, s.tz);
	if (D(h, s)) {
		let u = /* @__PURE__ */ new Date(o.getTime() - 36e5);
		return D(g$1(u, s.tz), s) ? u : o;
	}
	let l = new Date(o.getTime() + T(s) - T(h));
	if (D(g$1(l, s.tz), s)) return l;
	if (e) throw new Error("Invalid date passed to fromTZ()");
	return o.getTime() > l.getTime() ? o : l;
}
function g$1(s, e) {
	let t, r;
	try {
		t = new Intl.DateTimeFormat("en-US", {
			timeZone: e,
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: !1
		}), r = t.formatToParts(s);
	} catch (i) {
		let a = i instanceof Error ? i.message : String(i);
		throw new RangeError(`toTZ: Invalid timezone '${e}' or date. Please provide a valid IANA timezone (e.g., 'America/New_York', 'Europe/Stockholm'). Original error: ${a}`);
	}
	let n = {
		year: 0,
		month: 0,
		day: 0,
		hour: 0,
		minute: 0,
		second: 0
	};
	for (let i of r) (i.type === "year" || i.type === "month" || i.type === "day" || i.type === "hour" || i.type === "minute" || i.type === "second") && (n[i.type] = parseInt(i.value, 10));
	if (isNaN(n.year) || isNaN(n.month) || isNaN(n.day) || isNaN(n.hour) || isNaN(n.minute) || isNaN(n.second)) throw new Error(`toTZ: Failed to parse all date components from timezone '${e}'. This may indicate an invalid date or timezone configuration. Parsed components: ${JSON.stringify(n)}`);
	return n.hour === 24 && (n.hour = 0), {
		y: n.year,
		m: n.month,
		d: n.day,
		h: n.hour,
		i: n.minute,
		s: n.second,
		tz: e
	};
}
function b(s, e, t, r, n, i, a) {
	return {
		y: s,
		m: e,
		d: t,
		h: r,
		i: n,
		s: i,
		tz: a
	};
}
var O = [
	1,
	2,
	4,
	8,
	16
];
var C = class {
	pattern;
	timezone;
	mode;
	alternativeWeekdays;
	sloppyRanges;
	second;
	minute;
	hour;
	day;
	month;
	dayOfWeek;
	year;
	lastDayOfMonth;
	lastWeekday;
	nearestWeekdays;
	starDOM;
	starDOW;
	starYear;
	useAndLogic;
	constructor(e, t, r) {
		this.pattern = e, this.timezone = t, this.mode = r?.mode ?? "auto", this.alternativeWeekdays = r?.alternativeWeekdays ?? !1, this.sloppyRanges = r?.sloppyRanges ?? !1, this.second = Array(60).fill(0), this.minute = Array(60).fill(0), this.hour = Array(24).fill(0), this.day = Array(31).fill(0), this.month = Array(12).fill(0), this.dayOfWeek = Array(7).fill(0), this.year = Array(1e4).fill(0), this.lastDayOfMonth = !1, this.lastWeekday = !1, this.nearestWeekdays = Array(31).fill(0), this.starDOM = !1, this.starDOW = !1, this.starYear = !1, this.useAndLogic = !1, this.parse();
	}
	parse() {
		if (!(typeof this.pattern == "string" || this.pattern instanceof String)) throw new TypeError("CronPattern: Pattern has to be of type string.");
		this.pattern.indexOf("@") >= 0 && (this.pattern = this.handleNicknames(this.pattern).trim());
		let e = this.pattern.match(/\S+/g) || [""], t = e.length;
		if (e.length < 5 || e.length > 7) throw new TypeError("CronPattern: invalid configuration format ('" + this.pattern + "'), exactly five, six, or seven space separated parts are required.");
		if (this.mode !== "auto") {
			let n;
			switch (this.mode) {
				case "5-part":
					n = 5;
					break;
				case "6-part":
					n = 6;
					break;
				case "7-part":
					n = 7;
					break;
				case "5-or-6-parts":
					n = [5, 6];
					break;
				case "6-or-7-parts":
					n = [6, 7];
					break;
				default: n = 0;
			}
			if (!(Array.isArray(n) ? n.includes(t) : t === n)) {
				let a = Array.isArray(n) ? n.join(" or ") : n.toString();
				throw new TypeError(`CronPattern: mode '${this.mode}' requires exactly ${a} parts, but pattern '${this.pattern}' has ${t} parts.`);
			}
		}
		if (e.length === 5 && e.unshift("0"), e.length === 6 && e.push("*"), e[3].toUpperCase() === "LW" ? (this.lastWeekday = !0, e[3] = "") : e[3].toUpperCase().indexOf("L") >= 0 && (e[3] = e[3].replace(/L/gi, ""), this.lastDayOfMonth = !0), e[3] == "*" && (this.starDOM = !0), e[6] == "*" && (this.starYear = !0), e[4].length >= 3 && (e[4] = this.replaceAlphaMonths(e[4])), e[5].length >= 3 && (e[5] = this.alternativeWeekdays ? this.replaceAlphaDaysQuartz(e[5]) : this.replaceAlphaDays(e[5])), e[5].startsWith("+") && (this.useAndLogic = !0, e[5] = e[5].substring(1), e[5] === "")) throw new TypeError("CronPattern: Day-of-week field cannot be empty after '+' modifier.");
		switch (e[5] == "*" && (this.starDOW = !0), this.pattern.indexOf("?") >= 0 && (e[0] = e[0].replace(/\?/g, "*"), e[1] = e[1].replace(/\?/g, "*"), e[2] = e[2].replace(/\?/g, "*"), e[3] = e[3].replace(/\?/g, "*"), e[4] = e[4].replace(/\?/g, "*"), e[5] = e[5].replace(/\?/g, "*"), e[6] && (e[6] = e[6].replace(/\?/g, "*"))), this.mode) {
			case "5-part":
				e[0] = "0", e[6] = "*";
				break;
			case "6-part":
				e[6] = "*";
				break;
			case "5-or-6-parts": e[6] = "*";
		}
		this.throwAtIllegalCharacters(e), this.partToArray("second", e[0], 0, 1), this.partToArray("minute", e[1], 0, 1), this.partToArray("hour", e[2], 0, 1), this.partToArray("day", e[3], -1, 1), this.partToArray("month", e[4], -1, 1);
		let r = this.alternativeWeekdays ? -1 : 0;
		this.partToArray("dayOfWeek", e[5], r, 63), this.partToArray("year", e[6], 0, 1), !this.alternativeWeekdays && this.dayOfWeek[7] && (this.dayOfWeek[0] = this.dayOfWeek[7]);
	}
	partToArray(e, t, r, n) {
		let i = this[e], a = e === "day" && this.lastDayOfMonth, o = e === "day" && this.lastWeekday;
		if (t === "" && !a && !o) throw new TypeError("CronPattern: configuration entry " + e + " (" + t + ") is empty, check for trailing spaces.");
		if (t === "*") return i.fill(n);
		let h = t.split(",");
		if (h.length > 1) for (let l = 0; l < h.length; l++) this.partToArray(e, h[l], r, n);
		else t.indexOf("-") !== -1 && t.indexOf("/") !== -1 ? this.handleRangeWithStepping(t, e, r, n) : t.indexOf("-") !== -1 ? this.handleRange(t, e, r, n) : t.indexOf("/") !== -1 ? this.handleStepping(t, e, r, n) : t !== "" && this.handleNumber(t, e, r, n);
	}
	throwAtIllegalCharacters(e) {
		for (let t = 0; t < e.length; t++) if ((t === 3 ? /[^/*0-9,\-WwLl]+/ : t === 5 ? /[^/*0-9,\-#Ll]+/ : /[^/*0-9,\-]+/).test(e[t])) throw new TypeError("CronPattern: configuration entry " + t + " (" + e[t] + ") contains illegal characters.");
	}
	handleNumber(e, t, r, n) {
		let i = this.extractNth(e, t), a = e.toUpperCase().includes("W");
		if (t !== "day" && a) throw new TypeError("CronPattern: Nearest weekday modifier (W) only allowed in day-of-month.");
		a && (t = "nearestWeekdays");
		let o = parseInt(i[0], 10) + r;
		if (isNaN(o)) throw new TypeError("CronPattern: " + t + " is not a number: '" + e + "'");
		this.setPart(t, o, i[1] || n);
	}
	setPart(e, t, r) {
		if (!Object.prototype.hasOwnProperty.call(this, e)) throw new TypeError("CronPattern: Invalid part specified: " + e);
		if (e === "dayOfWeek") {
			if (t === 7 && (t = 0), t < 0 || t > 6) throw new RangeError("CronPattern: Invalid value for dayOfWeek: " + t);
			this.setNthWeekdayOfMonth(t, r);
			return;
		}
		if (e === "second" || e === "minute") {
			if (t < 0 || t >= 60) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
		} else if (e === "hour") {
			if (t < 0 || t >= 24) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
		} else if (e === "day" || e === "nearestWeekdays") {
			if (t < 0 || t >= 31) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
		} else if (e === "month") {
			if (t < 0 || t >= 12) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
		} else if (e === "year" && (t < 1 || t >= 1e4)) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t + " (supported range: 1-9999)");
		this[e][t] = r;
	}
	validateNotNaN(e, t) {
		if (isNaN(e)) throw new TypeError(t);
	}
	validateRange(e, t, r, n, i) {
		if (e > t) throw new TypeError("CronPattern: From value is larger than to value: '" + i + "'");
		if (r !== void 0) {
			if (r === 0) throw new TypeError("CronPattern: Syntax error, illegal stepping: 0");
			if (r > this[n].length) throw new TypeError("CronPattern: Syntax error, steps cannot be greater than maximum value of part (" + this[n].length + ")");
		}
	}
	handleRangeWithStepping(e, t, r, n) {
		if (e.toUpperCase().includes("W")) throw new TypeError("CronPattern: Syntax error, W is not allowed in ranges with stepping.");
		let i = this.extractNth(e, t), a = i[0].match(/^(\d+)-(\d+)\/(\d+)$/);
		if (a === null) throw new TypeError("CronPattern: Syntax error, illegal range with stepping: '" + e + "'");
		let [, o, h, l] = a, y = parseInt(o, 10) + r, u = parseInt(h, 10) + r, d = parseInt(l, 10);
		this.validateNotNaN(y, "CronPattern: Syntax error, illegal lower range (NaN)"), this.validateNotNaN(u, "CronPattern: Syntax error, illegal upper range (NaN)"), this.validateNotNaN(d, "CronPattern: Syntax error, illegal stepping: (NaN)"), this.validateRange(y, u, d, t, e);
		for (let c = y; c <= u; c += d) this.setPart(t, c, i[1] || n);
	}
	extractNth(e, t) {
		let r = e, n;
		if (r.includes("#")) {
			if (t !== "dayOfWeek") throw new Error("CronPattern: nth (#) only allowed in day-of-week field");
			n = r.split("#")[1], r = r.split("#")[0];
		} else if (r.toUpperCase().endsWith("L")) {
			if (t !== "dayOfWeek") throw new Error("CronPattern: L modifier only allowed in day-of-week field (use L alone for day-of-month)");
			n = "L", r = r.slice(0, -1);
		}
		return [r, n];
	}
	handleRange(e, t, r, n) {
		if (e.toUpperCase().includes("W")) throw new TypeError("CronPattern: Syntax error, W is not allowed in a range.");
		let i = this.extractNth(e, t), a = i[0].split("-");
		if (a.length !== 2) throw new TypeError("CronPattern: Syntax error, illegal range: '" + e + "'");
		let o = parseInt(a[0], 10) + r, h = parseInt(a[1], 10) + r;
		this.validateNotNaN(o, "CronPattern: Syntax error, illegal lower range (NaN)"), this.validateNotNaN(h, "CronPattern: Syntax error, illegal upper range (NaN)"), this.validateRange(o, h, void 0, t, e);
		for (let l = o; l <= h; l++) this.setPart(t, l, i[1] || n);
	}
	handleStepping(e, t, r, n) {
		if (e.toUpperCase().includes("W")) throw new TypeError("CronPattern: Syntax error, W is not allowed in parts with stepping.");
		let i = this.extractNth(e, t), a = i[0].split("/");
		if (a.length !== 2) throw new TypeError("CronPattern: Syntax error, illegal stepping: '" + e + "'");
		if (this.sloppyRanges) a[0] === "" && (a[0] = "*");
		else {
			if (a[0] === "") throw new TypeError("CronPattern: Syntax error, stepping with missing prefix ('" + e + "') is not allowed. Use wildcard (*/step) or range (min-max/step) instead.");
			if (a[0] !== "*") throw new TypeError("CronPattern: Syntax error, stepping with numeric prefix ('" + e + "') is not allowed. Use wildcard (*/step) or range (min-max/step) instead.");
		}
		let o = 0;
		a[0] !== "*" && (o = parseInt(a[0], 10) + r);
		let h = parseInt(a[1], 10);
		this.validateNotNaN(h, "CronPattern: Syntax error, illegal stepping: (NaN)"), this.validateRange(0, this[t].length - 1, h, t, e);
		for (let l = o; l < this[t].length; l += h) this.setPart(t, l, i[1] || n);
	}
	replaceAlphaDays(e) {
		return e.replace(/-sun/gi, "-7").replace(/sun/gi, "0").replace(/mon/gi, "1").replace(/tue/gi, "2").replace(/wed/gi, "3").replace(/thu/gi, "4").replace(/fri/gi, "5").replace(/sat/gi, "6");
	}
	replaceAlphaDaysQuartz(e) {
		return e.replace(/sun/gi, "1").replace(/mon/gi, "2").replace(/tue/gi, "3").replace(/wed/gi, "4").replace(/thu/gi, "5").replace(/fri/gi, "6").replace(/sat/gi, "7");
	}
	replaceAlphaMonths(e) {
		return e.replace(/jan/gi, "1").replace(/feb/gi, "2").replace(/mar/gi, "3").replace(/apr/gi, "4").replace(/may/gi, "5").replace(/jun/gi, "6").replace(/jul/gi, "7").replace(/aug/gi, "8").replace(/sep/gi, "9").replace(/oct/gi, "10").replace(/nov/gi, "11").replace(/dec/gi, "12");
	}
	handleNicknames(e) {
		let t = e.trim().toLowerCase();
		if (t === "@yearly" || t === "@annually") return "0 0 1 1 *";
		if (t === "@monthly") return "0 0 1 * *";
		if (t === "@weekly") return "0 0 * * 0";
		if (t === "@daily" || t === "@midnight") return "0 0 * * *";
		if (t === "@hourly") return "0 * * * *";
		if (t === "@reboot") throw new TypeError("CronPattern: @reboot is not supported in this environment. This is an event-based trigger that requires system startup detection.");
		return e;
	}
	setNthWeekdayOfMonth(e, t) {
		if (typeof t != "number" && t.toUpperCase() === "L") this.dayOfWeek[e] = this.dayOfWeek[e] | 32;
		else if (t === 63) this.dayOfWeek[e] = 63;
		else if (t < 6 && t > 0) this.dayOfWeek[e] = this.dayOfWeek[e] | O[t - 1];
		else throw new TypeError(`CronPattern: nth weekday out of range, should be 1-5 or L. Value: ${t}, Type: ${typeof t}`);
	}
};
var P = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
var f = [
	[
		"month",
		"year",
		0
	],
	[
		"day",
		"month",
		-1
	],
	[
		"hour",
		"day",
		0
	],
	[
		"minute",
		"hour",
		0
	],
	[
		"second",
		"minute",
		0
	]
];
var m = class s {
	tz;
	ms;
	second;
	minute;
	hour;
	day;
	month;
	year;
	constructor(e, t) {
		if (this.tz = t, e && e instanceof Date) if (!isNaN(e)) this.fromDate(e);
		else throw new TypeError("CronDate: Invalid date passed to CronDate constructor");
		else if (e == null) this.fromDate(/* @__PURE__ */ new Date());
		else if (e && typeof e == "string") this.fromString(e);
		else if (e instanceof s) this.fromCronDate(e);
		else throw new TypeError("CronDate: Invalid type (" + typeof e + ") passed to CronDate constructor");
	}
	getLastDayOfMonth(e, t) {
		return t !== 1 ? P[t] : new Date(Date.UTC(e, t + 1, 0)).getUTCDate();
	}
	getLastWeekday(e, t) {
		let r = this.getLastDayOfMonth(e, t), i = new Date(Date.UTC(e, t, r)).getUTCDay();
		return i === 0 ? r - 2 : i === 6 ? r - 1 : r;
	}
	getNearestWeekday(e, t, r) {
		let n = this.getLastDayOfMonth(e, t);
		if (r > n) return -1;
		let a = new Date(Date.UTC(e, t, r)).getUTCDay();
		return a === 0 ? r === n ? r - 2 : r + 1 : a === 6 ? r === 1 ? r + 2 : r - 1 : r;
	}
	isNthWeekdayOfMonth(e, t, r, n) {
		let a = new Date(Date.UTC(e, t, r)).getUTCDay(), o = 0;
		for (let h = 1; h <= r; h++) new Date(Date.UTC(e, t, h)).getUTCDay() === a && o++;
		if (n & 63 && O[o - 1] & n) return !0;
		if (n & 32) {
			let h = this.getLastDayOfMonth(e, t);
			for (let l = r + 1; l <= h; l++) if (new Date(Date.UTC(e, t, l)).getUTCDay() === a) return !1;
			return !0;
		}
		return !1;
	}
	fromDate(e) {
		if (this.tz !== void 0) if (typeof this.tz == "number") this.ms = e.getUTCMilliseconds(), this.second = e.getUTCSeconds(), this.minute = e.getUTCMinutes() + this.tz, this.hour = e.getUTCHours(), this.day = e.getUTCDate(), this.month = e.getUTCMonth(), this.year = e.getUTCFullYear(), this.apply();
		else try {
			let t = g$1(e, this.tz);
			this.ms = e.getMilliseconds(), this.second = t.s, this.minute = t.i, this.hour = t.h, this.day = t.d, this.month = t.m - 1, this.year = t.y;
		} catch (t) {
			let r = t instanceof Error ? t.message : String(t);
			throw new TypeError(`CronDate: Failed to convert date to timezone '${this.tz}'. This may happen with invalid timezone names or dates. Original error: ${r}`);
		}
		else this.ms = e.getMilliseconds(), this.second = e.getSeconds(), this.minute = e.getMinutes(), this.hour = e.getHours(), this.day = e.getDate(), this.month = e.getMonth(), this.year = e.getFullYear();
	}
	fromCronDate(e) {
		this.tz = e.tz, this.year = e.year, this.month = e.month, this.day = e.day, this.hour = e.hour, this.minute = e.minute, this.second = e.second, this.ms = e.ms;
	}
	apply() {
		if (this.month > 11 || this.month < 0 || this.day > P[this.month] || this.day < 1 || this.hour > 59 || this.minute > 59 || this.second > 59 || this.hour < 0 || this.minute < 0 || this.second < 0) {
			let e = new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms));
			return this.ms = e.getUTCMilliseconds(), this.second = e.getUTCSeconds(), this.minute = e.getUTCMinutes(), this.hour = e.getUTCHours(), this.day = e.getUTCDate(), this.month = e.getUTCMonth(), this.year = e.getUTCFullYear(), !0;
		} else return !1;
	}
	fromString(e) {
		if (typeof this.tz == "number") {
			let t = v(e);
			this.ms = t.getUTCMilliseconds(), this.second = t.getUTCSeconds(), this.minute = t.getUTCMinutes(), this.hour = t.getUTCHours(), this.day = t.getUTCDate(), this.month = t.getUTCMonth(), this.year = t.getUTCFullYear(), this.apply();
		} else return this.fromDate(v(e, this.tz));
	}
	findNext(e, t, r, n) {
		return this._findMatch(e, t, r, n, 1);
	}
	_findMatch(e, t, r, n, i) {
		let a = this[t], o;
		r.lastDayOfMonth && (o = this.getLastDayOfMonth(this.year, this.month));
		let h = !r.starDOW && t == "day" ? new Date(Date.UTC(this.year, this.month, 1, 0, 0, 0, 0)).getUTCDay() : void 0, l = this[t] + n, y = i === 1 ? (u) => u < r[t].length : (u) => u >= 0;
		for (let u = l; y(u); u += i) {
			let d = r[t][u];
			if (t === "day" && !d) {
				for (let c = 0; c < r.nearestWeekdays.length; c++) if (r.nearestWeekdays[c]) {
					let M = this.getNearestWeekday(this.year, this.month, c - n);
					if (M === -1) continue;
					if (M === u - n) {
						d = 1;
						break;
					}
				}
			}
			if (t === "day" && r.lastWeekday) {
				let c = this.getLastWeekday(this.year, this.month);
				u - n === c && (d = 1);
			}
			if (t === "day" && r.lastDayOfMonth && u - n == o && (d = 1), t === "day" && !r.starDOW) {
				let c = r.dayOfWeek[(h + (u - n - 1)) % 7];
				if (c && c & 63) c = this.isNthWeekdayOfMonth(this.year, this.month, u - n, c) ? 1 : 0;
				else if (c) throw new Error(`CronDate: Invalid value for dayOfWeek encountered. ${c}`);
				r.useAndLogic ? d = d && c : !e.domAndDow && !r.starDOM ? d = d || c : d = d && c;
			}
			if (d) return this[t] = u - n, a !== this[t] ? 2 : 1;
		}
		return 3;
	}
	recurse(e, t, r) {
		if (r === 0 && !e.starYear) {
			if (this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0) {
				let i = -1;
				for (let a = this.year + 1; a < e.year.length && a < 1e4; a++) if (e.year[a] === 1) {
					i = a;
					break;
				}
				if (i === -1) return null;
				this.year = i, this.month = 0, this.day = 1, this.hour = 0, this.minute = 0, this.second = 0, this.ms = 0;
			}
			if (this.year >= 1e4) return null;
		}
		let n = this.findNext(t, f[r][0], e, f[r][2]);
		if (n > 1) {
			let i = r + 1;
			for (; i < f.length;) this[f[i][0]] = -f[i][2], i++;
			if (n === 3) {
				if (this[f[r][1]]++, this[f[r][0]] = -f[r][2], this.apply(), r === 0 && !e.starYear) {
					for (; this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0 && this.year < 1e4;) this.year++;
					if (this.year >= 1e4 || this.year >= e.year.length) return null;
				}
				return this.recurse(e, t, 0);
			} else if (this.apply()) return this.recurse(e, t, r - 1);
		}
		return r += 1, r >= f.length ? this : (e.starYear ? this.year >= 3e3 : this.year >= 1e4) ? null : this.recurse(e, t, r);
	}
	increment(e, t, r) {
		return this.second += t.interval !== void 0 && t.interval > 1 && r ? t.interval : 1, this.ms = 0, this.apply(), this.recurse(e, t, 0);
	}
	decrement(e, t) {
		return this.second -= t.interval !== void 0 && t.interval > 1 ? t.interval : 1, this.ms = 0, this.apply(), this.recurseBackward(e, t, 0, 0);
	}
	recurseBackward(e, t, r, n = 0) {
		if (n > 1e4) return null;
		if (r === 0 && !e.starYear) {
			if (this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0) {
				let a = -1;
				for (let o = this.year - 1; o >= 0; o--) if (e.year[o] === 1) {
					a = o;
					break;
				}
				if (a === -1) return null;
				this.year = a, this.month = 11, this.day = 31, this.hour = 23, this.minute = 59, this.second = 59, this.ms = 0;
			}
			if (this.year < 0) return null;
		}
		let i = this.findPrevious(t, f[r][0], e, f[r][2]);
		if (i > 1) {
			let a = r + 1;
			for (; a < f.length;) {
				let o = f[a][0], h = f[a][2], l = this.getMaxPatternValue(o, e, h);
				this[o] = l, a++;
			}
			if (i === 3) {
				if (this[f[r][1]]--, r === 0) {
					let y = this.getLastDayOfMonth(this.year, this.month);
					this.day > y && (this.day = y);
				}
				if (r === 1) if (this.day <= 0) this.day = 1;
				else {
					let y = this.year, u = this.month;
					for (; u < 0;) u += 12, y--;
					for (; u > 11;) u -= 12, y++;
					let d = u !== 1 ? P[u] : new Date(Date.UTC(y, u + 1, 0)).getUTCDate();
					this.day > d && (this.day = d);
				}
				this.apply();
				let o = f[r][0], h = f[r][2], l = this.getMaxPatternValue(o, e, h);
				if (o === "day") {
					let y = this.getLastDayOfMonth(this.year, this.month);
					this[o] = Math.min(l, y);
				} else this[o] = l;
				if (this.apply(), r === 0) {
					let y = f[1][2], u = this.getMaxPatternValue("day", e, y), d = this.getLastDayOfMonth(this.year, this.month), c = Math.min(u, d);
					c !== this.day && (this.day = c, this.hour = this.getMaxPatternValue("hour", e, f[2][2]), this.minute = this.getMaxPatternValue("minute", e, f[3][2]), this.second = this.getMaxPatternValue("second", e, f[4][2]));
				}
				if (r === 0 && !e.starYear) {
					for (; this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0;) this.year--;
					if (this.year < 0) return null;
				}
				return this.recurseBackward(e, t, 0, n + 1);
			} else if (this.apply()) return this.recurseBackward(e, t, r - 1, n + 1);
		}
		return r += 1, r >= f.length ? this : this.year < 0 ? null : this.recurseBackward(e, t, r, n + 1);
	}
	getMaxPatternValue(e, t, r) {
		if (e === "day" && t.lastDayOfMonth) return this.getLastDayOfMonth(this.year, this.month);
		if (e === "day" && !t.starDOW) return this.getLastDayOfMonth(this.year, this.month);
		for (let n = t[e].length - 1; n >= 0; n--) if (t[e][n]) return n - r;
		return t[e].length - 1 - r;
	}
	findPrevious(e, t, r, n) {
		return this._findMatch(e, t, r, n, -1);
	}
	getDate(e) {
		return e || this.tz === void 0 ? new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms) : typeof this.tz == "number" ? new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute - this.tz, this.second, this.ms)) : k(b(this.year, this.month + 1, this.day, this.hour, this.minute, this.second, this.tz), !1);
	}
	getTime() {
		return this.getDate(!1).getTime();
	}
	match(e, t) {
		if (!e.starYear && (this.year < 0 || this.year >= e.year.length || e.year[this.year] === 0)) return !1;
		for (let r = 0; r < f.length; r++) {
			let n = f[r][0], i = f[r][2], a = this[n];
			if (a + i < 0 || a + i >= e[n].length) return !1;
			let o = e[n][a + i];
			if (n === "day") {
				if (!o) {
					for (let h = 0; h < e.nearestWeekdays.length; h++) if (e.nearestWeekdays[h]) {
						let l = this.getNearestWeekday(this.year, this.month, h - i);
						if (l !== -1 && l === a) {
							o = 1;
							break;
						}
					}
				}
				if (e.lastWeekday) a === this.getLastWeekday(this.year, this.month) && (o = 1);
				if (e.lastDayOfMonth) a === this.getLastDayOfMonth(this.year, this.month) && (o = 1);
				if (!e.starDOW) {
					let h = new Date(Date.UTC(this.year, this.month, 1, 0, 0, 0, 0)).getUTCDay(), l = e.dayOfWeek[(h + (a - 1)) % 7];
					l && l & 63 && (l = this.isNthWeekdayOfMonth(this.year, this.month, a, l) ? 1 : 0), e.useAndLogic ? o = o && l : !t.domAndDow && !e.starDOM ? o = o || l : o = o && l;
				}
			}
			if (!o) return !1;
		}
		return !0;
	}
};
function R(s) {
	if (s === void 0 && (s = {}), delete s.name, s.legacyMode !== void 0 && s.domAndDow === void 0 ? s.domAndDow = !s.legacyMode : s.domAndDow === void 0 && (s.domAndDow = !1), s.legacyMode = !s.domAndDow, s.paused = s.paused === void 0 ? !1 : s.paused, s.maxRuns = s.maxRuns === void 0 ? 1 / 0 : s.maxRuns, s.catch = s.catch === void 0 ? !1 : s.catch, s.interval = s.interval === void 0 ? 0 : parseInt(s.interval.toString(), 10), s.utcOffset = s.utcOffset === void 0 ? void 0 : parseInt(s.utcOffset.toString(), 10), s.dayOffset = s.dayOffset === void 0 ? 0 : parseInt(s.dayOffset.toString(), 10), s.unref = s.unref === void 0 ? !1 : s.unref, s.mode = s.mode === void 0 ? "auto" : s.mode, s.alternativeWeekdays = s.alternativeWeekdays === void 0 ? !1 : s.alternativeWeekdays, s.sloppyRanges = s.sloppyRanges === void 0 ? !1 : s.sloppyRanges, ![
		"auto",
		"5-part",
		"6-part",
		"7-part",
		"5-or-6-parts",
		"6-or-7-parts"
	].includes(s.mode)) throw new Error("CronOptions: mode must be one of 'auto', '5-part', '6-part', '7-part', '5-or-6-parts', or '6-or-7-parts'.");
	if (s.startAt && (s.startAt = new m(s.startAt, s.timezone)), s.stopAt && (s.stopAt = new m(s.stopAt, s.timezone)), s.interval !== null) {
		if (isNaN(s.interval)) throw new Error("CronOptions: Supplied value for interval is not a number");
		if (s.interval < 0) throw new Error("CronOptions: Supplied value for interval can not be negative");
	}
	if (s.utcOffset !== void 0) {
		if (isNaN(s.utcOffset)) throw new Error("CronOptions: Invalid value passed for utcOffset, should be number representing minutes offset from UTC.");
		if (s.utcOffset < -870 || s.utcOffset > 870) throw new Error("CronOptions: utcOffset out of bounds.");
		if (s.utcOffset !== void 0 && s.timezone) throw new Error("CronOptions: Combining 'utcOffset' with 'timezone' is not allowed.");
	}
	if (s.unref !== !0 && s.unref !== !1) throw new Error("CronOptions: Unref should be either true, false or undefined(false).");
	if (s.dayOffset !== void 0 && s.dayOffset !== 0 && isNaN(s.dayOffset)) throw new Error("CronOptions: Invalid value passed for dayOffset, should be a number representing days to offset.");
	return s;
}
function p(s) {
	return Object.prototype.toString.call(s) === "[object Function]" || typeof s == "function" || s instanceof Function;
}
function _(s) {
	return p(s);
}
function x(s) {
	typeof Deno < "u" && typeof Deno.unrefTimer < "u" ? Deno.unrefTimer(s) : s && typeof s.unref < "u" && s.unref();
}
var W = 3e4;
var w = [];
var E = class {
	name;
	options;
	_states;
	fn;
	getTz() {
		return this.options.timezone || this.options.utcOffset;
	}
	applyDayOffset(e) {
		if (this.options.dayOffset !== void 0 && this.options.dayOffset !== 0) {
			let t = this.options.dayOffset * 24 * 60 * 60 * 1e3;
			return new Date(e.getTime() + t);
		}
		return e;
	}
	constructor(e, t, r) {
		let n, i;
		if (p(t)) i = t;
		else if (typeof t == "object") n = t;
		else if (t !== void 0) throw new Error("Cron: Invalid argument passed for optionsIn. Should be one of function, or object (options).");
		if (p(r)) i = r;
		else if (typeof r == "object") n = r;
		else if (r !== void 0) throw new Error("Cron: Invalid argument passed for funcIn. Should be one of function, or object (options).");
		if (this.name = n?.name, this.options = R(n), this._states = {
			kill: !1,
			blocking: !1,
			previousRun: void 0,
			currentRun: void 0,
			once: void 0,
			currentTimeout: void 0,
			maxRuns: n ? n.maxRuns : void 0,
			paused: n ? n.paused : !1,
			pattern: new C("* * * * *", void 0, { mode: "auto" })
		}, e && (e instanceof Date || typeof e == "string" && e.indexOf(":") > 0) ? this._states.once = new m(e, this.getTz()) : this._states.pattern = new C(e, this.options.timezone, {
			mode: this.options.mode,
			alternativeWeekdays: this.options.alternativeWeekdays,
			sloppyRanges: this.options.sloppyRanges
		}), this.name) {
			if (w.find((o) => o.name === this.name)) throw new Error("Cron: Tried to initialize new named job '" + this.name + "', but name already taken.");
			w.push(this);
		}
		return i !== void 0 && _(i) && (this.fn = i, this.schedule()), this;
	}
	nextRun(e) {
		let t = this._next(e);
		return t ? this.applyDayOffset(t.getDate(!1)) : null;
	}
	nextRuns(e, t) {
		this._states.maxRuns !== void 0 && e > this._states.maxRuns && (e = this._states.maxRuns);
		let r = t || this._states.currentRun || void 0;
		return this._enumerateRuns(e, r, "next");
	}
	previousRuns(e, t) {
		return this._enumerateRuns(e, t || void 0, "previous");
	}
	_enumerateRuns(e, t, r) {
		let n = [], i = t ? new m(t, this.getTz()) : null, a = r === "next" ? this._next : this._previous;
		for (; e--;) {
			let o = a.call(this, i);
			if (!o) break;
			let h = o.getDate(!1);
			n.push(this.applyDayOffset(h)), i = o;
		}
		return n;
	}
	match(e) {
		if (this._states.once) {
			let r = new m(e, this.getTz());
			r.ms = 0;
			let n = new m(this._states.once, this.getTz());
			return n.ms = 0, r.getTime() === n.getTime();
		}
		let t = new m(e, this.getTz());
		return t.ms = 0, t.match(this._states.pattern, this.options);
	}
	getPattern() {
		if (!this._states.once) return this._states.pattern ? this._states.pattern.pattern : void 0;
	}
	getOnce() {
		return this._states.once ? this._states.once.getDate() : null;
	}
	isRunning() {
		let e = this.nextRun(this._states.currentRun), t = !this._states.paused, r = this.fn !== void 0, n = !this._states.kill;
		return t && r && n && e !== null;
	}
	isStopped() {
		return this._states.kill;
	}
	isBusy() {
		return this._states.blocking;
	}
	currentRun() {
		return this._states.currentRun ? this._states.currentRun.getDate() : null;
	}
	previousRun() {
		return this._states.previousRun ? this._states.previousRun.getDate() : null;
	}
	msToNext(e) {
		let t = this._next(e);
		return t ? e instanceof m || e instanceof Date ? t.getTime() - e.getTime() : t.getTime() - new m(e).getTime() : null;
	}
	stop() {
		this._states.kill = !0, this._states.currentTimeout && clearTimeout(this._states.currentTimeout);
		let e = w.indexOf(this);
		e >= 0 && w.splice(e, 1);
	}
	pause() {
		return this._states.paused = !0, !this._states.kill;
	}
	resume() {
		return this._states.paused = !1, !this._states.kill;
	}
	schedule(e) {
		if (e && this.fn) throw new Error("Cron: It is not allowed to schedule two functions using the same Croner instance.");
		e && (this.fn = e);
		let t = this.msToNext(), r = this.nextRun(this._states.currentRun);
		return t == null || isNaN(t) || r === null ? this : (t > W && (t = W), this._states.currentTimeout = setTimeout(() => this._checkTrigger(r), t), this._states.currentTimeout && this.options.unref && x(this._states.currentTimeout), this);
	}
	async _trigger(e) {
		this._states.blocking = !0, this._states.currentRun = new m(void 0, this.getTz());
		try {
			if (this.options.catch) try {
				this.fn !== void 0 && await this.fn(this, this.options.context);
			} catch (t) {
				if (p(this.options.catch)) try {
					this.options.catch(t, this);
				} catch {}
			}
			else this.fn !== void 0 && await this.fn(this, this.options.context);
		} finally {
			this._states.previousRun = new m(e, this.getTz()), this._states.blocking = !1;
		}
	}
	async trigger() {
		await this._trigger();
	}
	runsLeft() {
		return this._states.maxRuns;
	}
	_checkTrigger(e) {
		let t = /* @__PURE__ */ new Date(), r = !this._states.paused && t.getTime() >= e.getTime(), n = this._states.blocking && this.options.protect;
		r && !n ? (this._states.maxRuns !== void 0 && this._states.maxRuns--, this._trigger()) : r && n && p(this.options.protect) && setTimeout(() => this.options.protect(this), 0), this.schedule();
	}
	_next(e) {
		let t = !!(e || this._states.currentRun), r = !1;
		!e && this.options.startAt && this.options.interval && ([e, t] = this._calculatePreviousRun(e, t), r = !e), e = new m(e, this.getTz()), this.options.startAt && e && e.getTime() < this.options.startAt.getTime() && (e = this.options.startAt);
		let n = this._states.once || new m(e, this.getTz());
		return !r && n !== this._states.once && (n = n.increment(this._states.pattern, this.options, t)), this._states.once && this._states.once.getTime() <= e.getTime() || n === null || this._states.maxRuns !== void 0 && this._states.maxRuns <= 0 || this._states.kill || this.options.stopAt && n.getTime() >= this.options.stopAt.getTime() ? null : n;
	}
	_previous(e) {
		let t = new m(e, this.getTz());
		this.options.stopAt && t.getTime() > this.options.stopAt.getTime() && (t = this.options.stopAt);
		let r = new m(t, this.getTz());
		return this._states.once ? this._states.once.getTime() < t.getTime() ? this._states.once : null : (r = r.decrement(this._states.pattern, this.options), r === null || this.options.startAt && r.getTime() < this.options.startAt.getTime() ? null : r);
	}
	_calculatePreviousRun(e, t) {
		let r = new m(void 0, this.getTz()), n = e;
		if (this.options.startAt.getTime() <= r.getTime()) {
			n = this.options.startAt;
			let i = n.getTime() + this.options.interval * 1e3;
			for (; i <= r.getTime();) n = new m(n, this.getTz()).increment(this._states.pattern, this.options, !0), i = n.getTime() + this.options.interval * 1e3;
			t = !0;
		}
		return n === null && (n = void 0), [n, t];
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/cron-BlKIMD_e.mjs
/**
* Executes overdue cron tasks.
*
* Called by the platform driver: the NodeCronScheduler timer on Node, or the
* Worker's `scheduled()` handler (via runScheduledTasks) on Cloudflare.
* Stateless — all state lives in the database.
*/
var CronExecutor = class {
	/**
	* Resolves the database connection to use for this tick. A resolver (not a
	* captured instance) so connection-backed adapters work across events: on
	* Cloudflare the `scheduled()` handler installs an event-scoped connection
	* in ALS, and this resolves to it instead of the per-isolate singleton
	* whose socket belongs to an earlier request. Accepts a plain `Kysely` too
	* (wrapped in a constant resolver) for callers/tests that don't need ALS.
	*/
	resolveDb;
	constructor(db, invokeCronHook) {
		this.invokeCronHook = invokeCronHook;
		this.resolveDb = typeof db === "function" ? db : () => db;
	}
	get db() {
		return this.resolveDb();
	}
	/**
	* Process all overdue tasks.
	*
	* 1. Atomically claim tasks whose next_run_at <= now, status = idle, enabled = 1.
	* 2. For each claimed task, invoke the plugin's cron hook.
	* 3. On success: compute next_run_at and reset to idle, or delete one-shots.
	* 4. On failure: reset to idle (retry on next tick).
	*/
	async tick() {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		let processed = 0;
		const claimed = await sql`
			UPDATE _emdash_cron_tasks
			SET status = 'running', locked_at = ${now}
			WHERE id IN (
				SELECT id FROM _emdash_cron_tasks
				WHERE next_run_at <= ${now}
				  AND status = 'idle'
				  AND enabled = 1
				ORDER BY next_run_at ASC
				LIMIT 10
			)
			RETURNING id, plugin_id, task_name, schedule, is_oneshot, data, next_run_at
		`.execute(this.db);
		for (const task of claimed.rows) {
			let parsedData;
			if (task.data) try {
				parsedData = JSON.parse(task.data);
			} catch {
				console.error(`[cron] Invalid JSON data for ${task.plugin_id}:${task.task_name}, skipping`);
				await sql`
						UPDATE _emdash_cron_tasks
						SET status = 'idle', locked_at = NULL
						WHERE id = ${task.id}
					`.execute(this.db);
				continue;
			}
			const event = {
				name: task.task_name,
				data: parsedData,
				scheduledAt: task.next_run_at
			};
			let hookFailed = false;
			try {
				await this.invokeCronHook(task.plugin_id, event);
			} catch (error) {
				hookFailed = true;
				console.error(`[cron] Hook failed for ${task.plugin_id}:${task.task_name}:`, error);
			}
			if (task.is_oneshot) if (hookFailed) {
				const meta = parsedData?.__emdash != null && typeof parsedData.__emdash === "object" ? parsedData.__emdash : void 0;
				const raw = meta?.retryCount;
				const retryCount = typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
				const MAX_ONESHOT_RETRIES = 5;
				if (retryCount >= MAX_ONESHOT_RETRIES) {
					console.error(`[cron] One-shot task ${task.plugin_id}:${task.task_name} exceeded ${MAX_ONESHOT_RETRIES} retries, removing`);
					await sql`
						DELETE FROM _emdash_cron_tasks WHERE id = ${task.id}
					`.execute(this.db);
				} else {
					const backoffMs = 6e4 * Math.pow(2, retryCount);
					await sql`
						UPDATE _emdash_cron_tasks
						SET status = 'idle', locked_at = NULL, next_run_at = ${new Date(Date.now() + backoffMs).toISOString()}, data = ${JSON.stringify({
						...parsedData,
						__emdash: {
							...meta,
							retryCount: retryCount + 1
						}
					})}
						WHERE id = ${task.id}
					`.execute(this.db);
				}
			} else await sql`
						DELETE FROM _emdash_cron_tasks WHERE id = ${task.id}
					`.execute(this.db);
			else await sql`
					UPDATE _emdash_cron_tasks
					SET status = 'idle',
						locked_at = NULL,
						last_run_at = ${now},
						next_run_at = ${nextCronTime(task.schedule)}
					WHERE id = ${task.id}
				`.execute(this.db);
			processed++;
		}
		return processed;
	}
	/**
	* Recover tasks stuck in 'running' for more than STALE_LOCK_MINUTES.
	* These likely crashed mid-execution.
	*/
	async recoverStaleLocks() {
		const result = await sql`
			UPDATE _emdash_cron_tasks
			SET status = 'idle', locked_at = NULL
			WHERE status = 'running'
			  AND locked_at < ${(/* @__PURE__ */ new Date(Date.now() - 6e5)).toISOString()}
		`.execute(this.db);
		return Number(result.numAffectedRows ?? 0);
	}
	/**
	* Get the next due time across all enabled tasks.
	* Returns null if no tasks are scheduled.
	*/
	async getNextDueTime() {
		return (await sql`
			SELECT MIN(next_run_at) as next
			FROM _emdash_cron_tasks
			WHERE status = 'idle' AND enabled = 1
		`.execute(this.db)).rows[0]?.next ?? null;
	}
};
/**
* Per-plugin cron API implementation.
* Scoped to a single plugin ID — plugins cannot see or modify other plugins' tasks.
*/
var CronAccessImpl = class {
	constructor(db, pluginId, reschedule) {
		this.db = db;
		this.pluginId = pluginId;
		this.reschedule = reschedule;
	}
	async schedule(name, opts) {
		validateTaskName(name);
		validateSchedule(opts.schedule);
		const oneshot = isOneShot(opts.schedule);
		const nextRun = oneshot ? opts.schedule : nextCronTime(opts.schedule);
		const dataJson = opts.data ? JSON.stringify(opts.data) : null;
		await sql`
			INSERT INTO _emdash_cron_tasks (id, plugin_id, task_name, schedule, is_oneshot, data, next_run_at, status, enabled)
			VALUES (${ulid()}, ${this.pluginId}, ${name}, ${opts.schedule}, ${oneshot ? 1 : 0}, ${dataJson}, ${nextRun}, 'idle', 1)
			ON CONFLICT (plugin_id, task_name) DO UPDATE SET
				schedule = ${opts.schedule},
				is_oneshot = ${oneshot ? 1 : 0},
				data = ${dataJson},
				next_run_at = ${nextRun},
				status = CASE WHEN _emdash_cron_tasks.status = 'running' THEN 'running' ELSE 'idle' END,
				locked_at = CASE WHEN _emdash_cron_tasks.status = 'running' THEN _emdash_cron_tasks.locked_at ELSE NULL END,
				enabled = 1
		`.execute(this.db);
		this.reschedule();
	}
	async cancel(name) {
		await sql`
			DELETE FROM _emdash_cron_tasks
			WHERE plugin_id = ${this.pluginId} AND task_name = ${name}
		`.execute(this.db);
		this.reschedule();
	}
	async list() {
		return (await sql`
			SELECT task_name, schedule, next_run_at, last_run_at
			FROM _emdash_cron_tasks
			WHERE plugin_id = ${this.pluginId} AND enabled = 1
			ORDER BY next_run_at ASC
		`.execute(this.db)).rows.map((row) => ({
			name: row.task_name,
			schedule: row.schedule,
			nextRunAt: row.next_run_at,
			lastRunAt: row.last_run_at
		}));
	}
};
/**
* Compute the next fire time for a cron expression.
* Supports standard cron (5-field), extended (6-field with seconds), and
* aliases like @daily, @weekly, @hourly, @monthly, @yearly.
*/
function nextCronTime(expression) {
	const next = new E(expression).nextRun();
	if (!next) throw new Error(`Invalid cron expression or no future run: "${expression}"`);
	return next.toISOString();
}
/**
* Check whether a string is a valid cron expression.
*/
function isCronExpression(schedule) {
	try {
		new E(schedule);
		return true;
	} catch {
		return false;
	}
}
/**
* Check if a schedule string is a one-shot (ISO 8601 datetime) rather than
* a recurring cron expression.
*
* Tries to parse as a cron expression first. Only if that fails does it
* attempt Date.parse. This avoids misclassifying cron range expressions
* like "1-5 * * * *" which Date.parse accepts as valid dates.
*/
function isOneShot(schedule) {
	if (schedule.startsWith("@")) return false;
	if (isCronExpression(schedule)) return false;
	return !isNaN(Date.parse(schedule));
}
/** Max length for a task name */
var MAX_TASK_NAME_LENGTH = 128;
/** Task name pattern: alphanumeric, dashes, underscores */
var TASK_NAME_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
/**
* Validate a cron task name.
* Must be non-empty, ≤128 chars, alphanumeric with dashes/underscores.
*/
function validateTaskName(name) {
	if (!name || name.length > MAX_TASK_NAME_LENGTH) throw new Error(`Invalid task name: must be 1-${MAX_TASK_NAME_LENGTH} characters, got ${name.length}`);
	if (!TASK_NAME_RE.test(name)) throw new Error(`Invalid task name "${name}": must start with a letter and contain only letters, numbers, dashes, or underscores`);
}
/**
* Validate a schedule string at registration time.
* Must be a valid cron expression or a parseable ISO 8601 datetime.
*/
function validateSchedule(schedule) {
	if (!schedule || schedule.length > 256) throw new Error(`Invalid schedule: must be 1-256 characters, got ${schedule.length}`);
	if (isCronExpression(schedule)) return;
	if (isNaN(Date.parse(schedule))) throw new Error(`Invalid schedule "${schedule}": must be a valid cron expression or ISO 8601 datetime`);
}
//#endregion
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
var TRAILING_SLASH_RE = /\/$/;
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
		url: (options.siteUrl ?? "").replace(TRAILING_SLASH_RE, ""),
		locale: options.locale ?? "en",
		trailingSlash: options.trailingSlash ?? "ignore"
	};
}
/**
* Create a URL helper that generates absolute URLs from relative paths.
* Validates that path starts with "/" and rejects protocol-relative paths ("//").
*/
function createUrlHelper(siteUrl) {
	const base = siteUrl.replace(TRAILING_SLASH_RE, "");
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
//#region self-essentials/emdash-main/packages/core/dist/media-DWIzoVFL.mjs
/** Valid role level values */
var VALID_ROLE_LEVELS = /* @__PURE__ */ new Set([
	10,
	20,
	30,
	40,
	50
]);
/** Role level — coerces string/number to valid RoleLevel (10|20|30|40|50) */
var roleLevel = number().int().refine((n) => VALID_ROLE_LEVELS.has(n), { message: "Invalid role level. Must be 10, 20, 30, 40, or 50" });
/** Pagination query params — cursor-based */
var cursorPaginationQuery = object({
	cursor: string().max(2048).optional().meta({ description: "Opaque cursor for pagination" }),
	limit: number().int().min(1).max(100).optional().default(50).meta({ description: "Maximum number of items to return (1-100, default 50)" })
}).meta({ id: "CursorPaginationQuery" });
object({
	limit: number().int().min(1).max(100).optional().default(50),
	offset: number().int().min(0).optional().default(0)
}).meta({ id: "OffsetPaginationQuery" });
/** Slug pattern: lowercase letters, digits, underscores; starts with letter */
var slugPattern$1 = /^[a-z][a-z0-9_]*$/;
/** Matches http(s) scheme at start of URL */
var HTTP_SCHEME_RE = /^https?:\/\//i;
/** Validates that a URL string uses http or https scheme. Rejects javascript:/data: URI XSS vectors. */
var httpUrl = string().url().refine((url) => HTTP_SCHEME_RE.test(url), "URL must use http or https");
/**
* BCP 47 locale code — language with optional script/region subtags (e.g. en, en-US, pt-BR, es-419, zh-Hant).
* Validation is case-insensitive, but the value is preserved verbatim because the site config, stored
* `locale` columns, and public query path all keep the raw BCP-47 casing.
*/
var localeCode = string().regex(/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i, "Invalid locale code");
object({ locale: localeCode.optional() }).meta({ id: "LocaleFilterQuery" });
object({
	success: literal(false).meta({ description: "Discriminant: always false for errors" }),
	error: object({
		code: string().meta({
			description: "Machine-readable error code",
			example: "NOT_FOUND"
		}),
		message: string().meta({ description: "Human-readable error message" })
	})
}).meta({ id: "ApiError" });
object({ deleted: literal(true) }).meta({ id: "DeleteResponse" });
object({ count: number$1().int().min(0) }).meta({ id: "CountResponse" });
var mediaUsageCoverageStatusSchema = _enum([
	"complete",
	"never",
	"running",
	"partial",
	"failed",
	"stale",
	"unknown"
]).meta({ id: "MediaUsageCoverageStatus" });
var mediaUsageCoverageSchema = object({
	scope: literal("all_content_collections"),
	status: mediaUsageCoverageStatusSchema
}).meta({ id: "MediaUsageCoverage" });
var mediaUsageSummarySchema = object({
	count: number$1().int().min(0).nullable(),
	coverage: mediaUsageCoverageSchema
}).meta({ id: "MediaUsageSummary" });
object({
	cursor: string().min(1).max(2048).optional().meta({ description: "Opaque content-entry-group cursor" }),
	limit: number().int().min(1).max(100).optional().default(50).meta({ description: "Maximum number of content entry groups to return (1-100, default 50)" })
});
var mediaUsageOccurrenceDetailSchema = object({
	fieldSlug: string(),
	fieldPath: string(),
	occurrenceIndex: number$1().int().min(0),
	referenceType: _enum([
		"image_field",
		"file_field",
		"portable_text_image",
		"unknown"
	])
}).meta({ id: "MediaUsageOccurrenceDetail" });
var mediaUsageSourceDetailSchema = object({
	variant: _enum(["columns", "draft_overlay"]),
	occurrences: array(mediaUsageOccurrenceDetailSchema)
}).meta({ id: "MediaUsageSourceDetail" });
var mediaUsageEntryDetailSchema = object({
	collection: string(),
	contentId: string(),
	title: string().nullable(),
	slug: string().nullable(),
	locale: string().nullable(),
	status: string().nullable(),
	scheduledAt: string().nullable(),
	deletedAt: string().nullable(),
	sources: array(mediaUsageSourceDetailSchema)
}).meta({ id: "MediaUsageEntryDetail" });
object({
	items: array(mediaUsageEntryDetailSchema),
	nextCursor: string().optional(),
	coverage: mediaUsageCoverageSchema
}).meta({ id: "MediaUsageDetailsResponse" });
var mediaUsageRepairStatusSchema = _enum([
	"complete",
	"partial",
	"failed",
	"stale"
]).meta({ id: "MediaUsageRepairStatus" });
var mediaUsageRepairCollectionBody = object({
	scope: literal("collection"),
	collection: string().min(1).max(63).regex(slugPattern$1, "Invalid collection slug")
}).strict();
var mediaUsageRepairAllBody = object({ scope: literal("all") }).strict();
discriminatedUnion("scope", [mediaUsageRepairCollectionBody, mediaUsageRepairAllBody]).meta({ id: "MediaUsageRepairBody" });
var mediaUsageRepairCollectionSummarySchema = object({
	collection: string(),
	status: mediaUsageRepairStatusSchema,
	indexedSourceCount: number$1().int().min(0),
	failedSourceCount: number$1().int().min(0),
	skippedSourceCount: number$1().int().min(0),
	deletedSourceCount: number$1().int().min(0),
	lastErrorCode: string().nullable(),
	startedAt: string(),
	completedAt: string().nullable()
}).meta({ id: "MediaUsageRepairCollectionSummary" });
object({
	status: mediaUsageRepairStatusSchema,
	indexedSourceCount: number$1().int().min(0),
	failedSourceCount: number$1().int().min(0),
	skippedSourceCount: number$1().int().min(0),
	deletedSourceCount: number$1().int().min(0),
	collections: array(mediaUsageRepairCollectionSummarySchema)
}).meta({ id: "MediaUsageRepairResponse" });
/**
* Accepts a comma-separated string (from URL query params) or an array of
* strings (from JSON body or programmatic use) and normalises to string[].
*/
var mimeTypeFilter = union([string(), array(string())]).transform((v) => {
	return (Array.isArray(v) ? v : v.split(",")).map((s) => s.trim()).filter((s) => s.length > 0);
}).optional();
cursorPaginationQuery.extend({
	mimeType: mimeTypeFilter,
	q: string().trim().min(1).max(200).optional(),
	includeUsage: literal("1").optional().meta({ description: "Include a coverage-aware usage summary on each media item" })
}).meta({ id: "MediaListQuery" });
object({ includeUsage: literal("1").optional().meta({ description: "Include a coverage-aware usage summary on the media item" }) }).meta({ id: "MediaGetQuery" });
object({
	alt: string().optional(),
	caption: string().optional(),
	width: number$1().int().positive().optional(),
	height: number$1().int().positive().optional()
}).meta({ id: "MediaUpdateBody" });
object({
	size: number$1().int().nonnegative().optional(),
	width: number$1().int().positive().optional(),
	height: number$1().int().positive().optional()
}).meta({ id: "MediaConfirmBody" });
cursorPaginationQuery.extend({
	query: string().optional(),
	mimeType: mimeTypeFilter
}).meta({ id: "MediaProviderListQuery" });
var mediaStatusSchema = _enum([
	"pending",
	"ready",
	"failed"
]);
var mediaItemSchema = object({
	id: string(),
	filename: string(),
	mimeType: string(),
	size: number$1().nullable(),
	width: number$1().nullable(),
	height: number$1().nullable(),
	alt: string().nullable(),
	caption: string().nullable(),
	storageKey: string(),
	status: mediaStatusSchema,
	contentHash: string().nullable(),
	blurhash: string().nullable(),
	dominantColor: string().nullable(),
	createdAt: string(),
	authorId: string().nullable()
}).meta({ id: "MediaItem" });
object({ item: mediaItemSchema }).meta({ id: "MediaResponse" });
var mediaReadItemSchema = mediaItemSchema.extend({ usage: mediaUsageSummarySchema.optional() }).meta({ id: "MediaReadItem" });
object({ item: mediaReadItemSchema }).meta({ id: "MediaReadResponse" });
var mediaListReadItemSchema = mediaReadItemSchema.extend({ url: string() }).meta({ id: "MediaListReadItem" });
object({
	items: array(mediaListReadItemSchema),
	nextCursor: string().optional()
}).meta({ id: "MediaListReadResponse" });
object({
	items: array(mediaItemSchema),
	nextCursor: string().optional()
}).meta({ id: "MediaListResponse" });
object({
	uploadUrl: string(),
	method: literal("PUT"),
	headers: record(string(), string()),
	mediaId: string(),
	storageKey: string(),
	expiresAt: string()
}).meta({ id: "MediaUploadUrlResponse" });
object({
	existing: literal(true),
	mediaId: string(),
	storageKey: string(),
	url: string()
}).meta({ id: "MediaExistingResponse" });
object({ item: mediaItemSchema.extend({ url: string() }) }).meta({ id: "MediaConfirmResponse" });
object({
	uploaded: literal(true),
	size: number$1().int().nonnegative()
}).meta({ id: "MediaStreamUploadResponse" });
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/status-COfycGIU.mjs
/**
* Redirect rule status codes.
*
* A redirect rule's `type` is either a *redirect* status (issues a `Location`
* header) or a *terminal* status (serves the status with no target). Terminal
* statuses let editors mark a URL as intentionally gone:
* - `410 Gone` — permanently and intentionally deleted (Google deindexes it
*   faster than a 404).
* - `451 Unavailable For Legal Reasons`.
*/
/** Statuses that issue an HTTP redirect (require a destination). */
var REDIRECT_STATUSES = [
	301,
	302,
	307,
	308
];
/** Terminal statuses that serve a status with no `Location` / no destination. */
var TERMINAL_STATUSES = [410, 451];
/** All values accepted as a redirect rule `type`. */
var REDIRECT_RULE_STATUSES = [...REDIRECT_STATUSES, ...TERMINAL_STATUSES];
/** True for terminal statuses (410/451) — served directly, with no target. */
function isTerminalStatus(type) {
	return TERMINAL_STATUSES.includes(type);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/redirects-BOn2DIUs.mjs
/** Slug pattern: lowercase letters, digits, and hyphens; must start with a letter */
var bylineSlugPattern = /^[a-z][a-z0-9-]*$/;
var bylineSummarySchema = object({
	id: string(),
	slug: string(),
	displayName: string(),
	bio: string().nullable(),
	avatarMediaId: string().nullable(),
	avatarStorageKey: string().nullish(),
	avatarAlt: string().nullish(),
	avatarBlurhash: string().nullish(),
	avatarDominantColor: string().nullish(),
	websiteUrl: string().nullable(),
	userId: string().nullable(),
	isGuest: boolean$1(),
	createdAt: string(),
	updatedAt: string(),
	locale: string(),
	translationGroup: string().nullable(),
	customFields: record(string(), union([
		string(),
		boolean$1(),
		_null()
	])).optional()
}).meta({ id: "BylineSummary" });
var bylineCreditSchema = object({
	byline: bylineSummarySchema,
	sortOrder: number$1().int(),
	roleLabel: string().nullable(),
	source: _enum(["explicit", "inferred"]).optional().meta({ description: "Whether this credit was explicitly assigned or inferred from authorId" })
}).meta({ id: "BylineCredit" });
var contentBylineInputSchema = object({
	bylineId: string().min(1),
	roleLabel: string().nullish()
}).meta({ id: "ContentBylineInput" });
cursorPaginationQuery.extend({
	search: string().optional(),
	isGuest: boolean().optional(),
	userId: string().optional(),
	locale: localeCode.optional()
}).meta({ id: "BylinesListQuery" });
object({
	slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens"),
	displayName: string().min(1),
	bio: string().nullish(),
	avatarMediaId: string().nullish(),
	websiteUrl: httpUrl.nullish(),
	userId: string().nullish(),
	isGuest: boolean$1().optional(),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional(),
	customFields: record(string(), unknown()).optional()
}).meta({ id: "BylineCreateBody" });
object({
	locale: localeCode,
	slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens").optional(),
	displayName: string().min(1).optional(),
	bio: string().nullish(),
	avatarMediaId: string().nullish(),
	websiteUrl: httpUrl.nullish()
}).meta({ id: "BylineTranslationCreateBody" });
object({ items: array(bylineSummarySchema) }).meta({ id: "BylineTranslationsResponse" });
object({
	slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens").optional(),
	displayName: string().min(1).optional(),
	bio: string().nullish(),
	avatarMediaId: string().nullish(),
	websiteUrl: httpUrl.nullish(),
	userId: string().nullish(),
	isGuest: boolean$1().optional(),
	customFields: record(string(), unknown()).optional()
}).meta({ id: "BylineUpdateBody" });
object({
	items: array(bylineSummarySchema),
	nextCursor: string().optional()
}).meta({ id: "BylineListResponse" });
/** SEO input — per-content meta fields */
var contentSeoInput = object({
	title: string().max(200).nullish(),
	description: string().max(500).nullish(),
	image: string().nullish(),
	canonical: httpUrl.nullish(),
	noIndex: boolean$1().optional()
}).meta({ id: "ContentSeoInput" });
/** ISO 8601 date or datetime bound for the content-list date range filter. */
var contentDateBound = union([datetime({
	offset: true,
	message: "must be an ISO 8601 datetime"
}), date({ message: "must be an ISO 8601 date" })]).optional();
cursorPaginationQuery.extend({
	status: string().optional(),
	orderBy: string().optional(),
	order: _enum(["asc", "desc"]).optional(),
	locale: localeCode.optional(),
	q: string().trim().min(1).max(200).optional(),
	authorId: string().min(1).max(64).optional(),
	dateField: _enum([
		"createdAt",
		"updatedAt",
		"publishedAt"
	]).optional(),
	dateFrom: contentDateBound,
	dateTo: contentDateBound
}).meta({ id: "ContentListQuery" });
/** ISO 8601 datetime for `publishedAt` / `createdAt`. Routes gate writes behind `content:publish_any`. */
var contentDateOverride = datetime({
	offset: true,
	message: "must be an ISO 8601 datetime"
}).nullish();
object({
	data: record(string(), unknown()),
	slug: string().nullish(),
	status: _enum(["draft"]).optional(),
	bylines: array(contentBylineInputSchema).optional(),
	locale: localeCode.optional(),
	translationOf: string().optional(),
	seo: contentSeoInput.optional(),
	taxonomies: record(string(), array(string())).optional().meta({ description: "Taxonomy term assignments as { taxonomyName: [termSlug, ...] }, resolved in the entry's locale." }),
	publishedAt: contentDateOverride,
	createdAt: contentDateOverride
}).meta({ id: "ContentCreateBody" });
object({
	data: record(string(), unknown()).optional(),
	slug: string().nullish(),
	status: _enum(["draft"]).optional(),
	authorId: string().nullish(),
	bylines: array(contentBylineInputSchema).optional(),
	_rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" }),
	skipRevision: boolean$1().optional(),
	seo: contentSeoInput.optional(),
	taxonomies: record(string(), array(string())).optional().meta({ description: "Replace taxonomy assignments as { taxonomyName: [termSlug, ...] }. Only named taxonomies are touched; pass an empty array to clear a taxonomy." }),
	publishedAt: contentDateOverride
}).meta({ id: "ContentUpdateBody" });
object({ scheduledAt: string().min(1, "scheduledAt is required").meta({
	description: "ISO 8601 datetime for scheduled publishing",
	example: "2025-06-15T09:00:00Z"
}) }).meta({ id: "ContentScheduleBody" });
object({ publishedAt: datetime({
	offset: true,
	message: "must be an ISO 8601 datetime"
}).optional().meta({ description: "Optional ISO 8601 datetime to backdate the publish (e.g. when migrating content). Requires content:publish_any permission. Without this, existing published_at is preserved on re-publish." }) }).meta({ id: "ContentPublishBody" });
object({
	expiresIn: union([string(), number$1()]).optional(),
	pathPattern: string().optional()
}).meta({ id: "ContentPreviewUrlBody" });
object({ termIds: array(string()) }).meta({ id: "ContentTermsBody" });
/** SEO metadata on a content item */
var contentSeoSchema = object({
	title: string().nullable(),
	description: string().nullable(),
	image: string().nullable(),
	canonical: string().nullable(),
	noIndex: boolean$1()
}).meta({ id: "ContentSeo" });
/** A single content item as returned by the API */
var contentItemSchema = object({
	id: string(),
	type: string().meta({ description: "Collection slug this item belongs to" }),
	slug: string().nullable(),
	status: string().meta({ description: "draft, published, or scheduled" }),
	data: record(string(), unknown()).meta({ description: "User-defined field values" }),
	authorId: string().nullable(),
	primaryBylineId: string().nullable(),
	byline: bylineSummarySchema.nullable().optional(),
	bylines: array(bylineCreditSchema).optional(),
	createdAt: string(),
	updatedAt: string(),
	publishedAt: string().nullable(),
	scheduledAt: string().nullable(),
	liveRevisionId: string().nullable(),
	draftRevisionId: string().nullable(),
	version: number$1().int(),
	locale: string().nullable(),
	translationGroup: string().nullable(),
	seo: contentSeoSchema.optional()
}).meta({ id: "ContentItem" });
object({
	item: contentItemSchema,
	_rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" })
}).meta({ id: "ContentResponse" });
object({
	items: array(contentItemSchema),
	nextCursor: string().optional(),
	total: number$1().int().nonnegative().optional()
}).meta({ id: "ContentListResponse" });
/** A distinct content author for the admin author filter */
var contentAuthorSchema = object({
	id: string(),
	name: string().nullable(),
	email: string(),
	avatarUrl: string().nullable()
}).meta({ id: "ContentAuthor" });
object({ items: array(contentAuthorSchema) }).meta({ id: "ContentAuthorsResponse" });
/** Trashed content item */
var trashedContentItemSchema = object({
	id: string(),
	type: string(),
	slug: string().nullable(),
	status: string(),
	data: record(string(), unknown()),
	authorId: string().nullable(),
	createdAt: string(),
	updatedAt: string(),
	publishedAt: string().nullable(),
	deletedAt: string()
}).meta({ id: "TrashedContentItem" });
object({
	items: array(trashedContentItemSchema),
	nextCursor: string().optional()
}).meta({ id: "TrashedContentListResponse" });
object({
	hasChanges: boolean$1(),
	live: record(string(), unknown()).nullable(),
	draft: record(string(), unknown()).nullable()
}).meta({ id: "ContentCompareResponse" });
/** Translation summary for a content item */
var contentTranslationSchema = object({
	id: string(),
	locale: string().nullable(),
	slug: string().nullable(),
	status: string(),
	updatedAt: string()
});
object({
	translationGroup: string(),
	translations: array(contentTranslationSchema)
}).meta({ id: "ContentTranslationsResponse" });
var collectionSupportValues = _enum([
	"drafts",
	"revisions",
	"preview",
	"scheduling",
	"search"
]);
var collectionSourcePattern = /^(template:.+|import:.+|manual|discovered|seed)$/;
var fieldTypeValues = _enum([
	"string",
	"text",
	"url",
	"number",
	"integer",
	"boolean",
	"datetime",
	"select",
	"multiSelect",
	"portableText",
	"image",
	"file",
	"reference",
	"json",
	"slug",
	"repeater"
]);
var repeaterSubFieldSchema = object({
	slug: string().min(1).max(63).regex(slugPattern$1, "Invalid slug format"),
	type: _enum([
		"string",
		"text",
		"url",
		"number",
		"integer",
		"boolean",
		"datetime",
		"select",
		"image"
	]),
	label: string().min(1),
	required: boolean$1().optional(),
	options: array(string()).optional()
});
var fieldValidation = object({
	required: boolean$1().optional(),
	min: number$1().optional(),
	max: number$1().optional(),
	minLength: number$1().int().min(0).optional(),
	maxLength: number$1().int().min(0).optional(),
	pattern: string().optional(),
	options: array(string()).optional(),
	subFields: array(repeaterSubFieldSchema).min(1).optional(),
	minItems: number$1().int().min(0).optional(),
	maxItems: number$1().int().min(1).optional(),
	allowedMimeTypes: array(string().regex(/^[a-z0-9][a-z0-9!#$&^_+\-.]*\/[a-z0-9!#$&^_+\-.]*$/i, "Invalid MIME type")).min(1, "allowedMimeTypes must not be empty — omit the field to allow all types").max(64, "allowedMimeTypes may contain at most 64 entries").optional()
}).optional();
var fieldWidgetOptions = record(string(), unknown()).optional();
object({
	slug: string().min(1).max(63).regex(slugPattern$1, "Invalid slug format"),
	label: string().min(1),
	labelSingular: string().optional(),
	description: string().optional(),
	icon: string().optional(),
	supports: array(collectionSupportValues).optional(),
	source: string().regex(collectionSourcePattern).optional(),
	urlPattern: string().optional(),
	hasSeo: boolean$1().optional()
}).meta({ id: "CreateCollectionBody" });
object({
	label: string().min(1).optional(),
	labelSingular: string().optional(),
	description: string().optional(),
	icon: string().optional(),
	supports: array(collectionSupportValues).optional(),
	urlPattern: string().nullish(),
	hasSeo: boolean$1().optional(),
	commentsEnabled: boolean$1().optional(),
	commentsModeration: _enum([
		"all",
		"first_time",
		"none"
	]).optional(),
	commentsClosedAfterDays: number$1().int().min(0).optional(),
	commentsAutoApproveUsers: boolean$1().optional()
}).meta({ id: "UpdateCollectionBody" });
object({
	slug: string().min(1).max(63).regex(slugPattern$1, "Invalid slug format"),
	label: string().min(1),
	type: fieldTypeValues,
	required: boolean$1().optional(),
	unique: boolean$1().optional(),
	defaultValue: unknown().optional(),
	validation: fieldValidation.nullable(),
	widget: string().optional(),
	options: fieldWidgetOptions,
	sortOrder: number$1().int().min(0).optional(),
	searchable: boolean$1().optional(),
	translatable: boolean$1().optional()
}).meta({ id: "CreateFieldBody" });
object({
	label: string().min(1).optional(),
	type: fieldTypeValues.optional(),
	required: boolean$1().optional(),
	unique: boolean$1().optional(),
	defaultValue: unknown().optional(),
	validation: fieldValidation.nullable(),
	widget: string().optional(),
	options: fieldWidgetOptions,
	sortOrder: number$1().int().min(0).optional(),
	searchable: boolean$1().optional(),
	translatable: boolean$1().optional()
}).meta({ id: "UpdateFieldBody" });
object({ fieldSlugs: array(string().min(1)) }).meta({ id: "FieldReorderBody" });
object({
	label: string().optional(),
	labelSingular: string().optional(),
	description: string().optional()
}).meta({ id: "OrphanRegisterBody" });
object({ format: string().optional() });
object({ includeFields: string().transform((v) => v === "true").optional() });
var collectionSchema = object({
	id: string(),
	slug: string(),
	label: string(),
	labelSingular: string().nullable(),
	description: string().nullable(),
	icon: string().nullable(),
	supports: array(string()),
	source: string().nullable(),
	urlPattern: string().nullable(),
	hasSeo: boolean$1(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Collection" });
var fieldSchema = object({
	id: string(),
	collectionId: string(),
	slug: string(),
	label: string(),
	type: fieldTypeValues,
	required: boolean$1(),
	unique: boolean$1(),
	defaultValue: unknown().nullable(),
	validation: record(string(), unknown()).nullable(),
	widget: string().nullable(),
	options: record(string(), unknown()).nullable(),
	sortOrder: number$1().int(),
	searchable: boolean$1(),
	translatable: boolean$1(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Field" });
object({ item: collectionSchema }).meta({ id: "CollectionResponse" });
object({ item: collectionSchema.extend({ fields: array(fieldSchema) }) }).meta({ id: "CollectionWithFieldsResponse" });
object({ items: array(collectionSchema) }).meta({ id: "CollectionListResponse" });
object({ item: fieldSchema }).meta({ id: "FieldResponse" });
object({ items: array(fieldSchema) }).meta({ id: "FieldListResponse" });
var orphanedTableSchema = object({
	slug: string(),
	tableName: string(),
	rowCount: number$1().int()
}).meta({ id: "OrphanedTable" });
object({ items: array(orphanedTableSchema) }).meta({ id: "OrphanedTableListResponse" });
object({
	authorName: string().min(1).max(100),
	authorEmail: string().email(),
	body: string().min(1).max(5e3),
	parentId: string().optional(),
	website_url: string().optional(),
	turnstileToken: string().max(2048).optional()
}).meta({ id: "CreateCommentBody" });
object({
	commentId: string().min(1),
	reaction: string().min(1).max(20).default("like"),
	website_url: string().optional()
}).meta({ id: "CreateReactionBody" });
object({ status: _enum([
	"approved",
	"pending",
	"spam",
	"trash"
]) }).meta({ id: "CommentStatusBody" });
object({
	ids: array(string().min(1)).min(1).max(100),
	action: _enum([
		"approve",
		"spam",
		"trash",
		"delete"
	])
}).meta({ id: "CommentBulkBody" });
object({
	status: _enum([
		"pending",
		"approved",
		"spam",
		"trash"
	]).optional(),
	collection: string().optional(),
	search: string().optional(),
	limit: number().int().min(1).max(100).optional().default(50),
	cursor: string().max(2048).optional()
}).meta({ id: "CommentListQuery" });
var commentStatusValues = _enum([
	"pending",
	"approved",
	"spam",
	"trash"
]);
/**
* Public-facing comment (no email/IP).
*
* `replies` is recursive in practice (each reply can have replies), but we
* model it as a single level here to avoid circular type inference issues
* with tsgo. OpenAPI consumers should treat replies as the same shape.
*/
var publicCommentSchema = object({
	id: string(),
	authorName: string(),
	isRegisteredUser: boolean$1(),
	body: string(),
	parentId: string().nullable(),
	createdAt: string(),
	replies: array(any()).optional()
}).meta({ id: "PublicComment" });
/** Admin comment with full details */
var commentSchema = object({
	id: string(),
	collection: string(),
	contentId: string(),
	authorName: string(),
	authorEmail: string(),
	body: string(),
	status: commentStatusValues,
	parentId: string().nullable(),
	ipHash: string().nullable(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Comment" });
object({
	items: array(publicCommentSchema),
	nextCursor: string().optional(),
	total: number$1().int()
}).meta({ id: "PublicCommentListResponse" });
object({
	items: array(commentSchema),
	nextCursor: string().optional()
}).meta({ id: "AdminCommentListResponse" });
object({
	pending: number$1().int(),
	approved: number$1().int(),
	spam: number$1().int(),
	trash: number$1().int()
}).meta({ id: "CommentCountsResponse" });
object({ affected: number$1().int() }).meta({ id: "CommentBulkResponse" });
/**
* URL scheme validation utilities
*
* Prevents XSS via dangerous URL schemes (javascript:, data:, vbscript:, etc.)
* by allowlisting known-safe schemes before rendering into href attributes.
*/
/**
* Matches URLs that are safe to render in href attributes.
*
* Allowed:
* - http:// and https://
* - mailto: and tel:
* - Relative paths (starting with /)
* - Fragment links (starting with #)
* - Protocol-relative URLs are NOT allowed (starting with //) as they can
*   redirect to attacker-controlled hosts.
*/
var SAFE_URL_SCHEME_RE$1 = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;
/**
* Returns the URL unchanged if it uses a safe scheme, otherwise returns "#".
*
* Use this at the render layer as the primary defense against XSS via
* dangerous URL schemes like `javascript:`, `data:`, or `vbscript:`.
*
* @example
* ```ts
* sanitizeHref("https://example.com")        // "https://example.com"
* sanitizeHref("/about")                      // "/about"
* sanitizeHref("#section")                    // "#section"
* sanitizeHref("mailto:a@b.com")              // "mailto:a@b.com"
* sanitizeHref("javascript:alert(1)")         // "#"
* sanitizeHref("data:text/html,<script>")     // "#"
* sanitizeHref("")                            // "#"
* ```
*/
function sanitizeHref$1(url) {
	if (!url) return "#";
	return SAFE_URL_SCHEME_RE$1.test(url) ? url : "#";
}
/**
* Returns true if the URL uses a safe scheme for rendering in href attributes.
*/
function isSafeHref(url) {
	return SAFE_URL_SCHEME_RE$1.test(url);
}
/**
* Allowed menu item types. `custom` uses `customUrl`; the others resolve a URL
* from `referenceCollection` + `referenceId` (a translation_group id).
*/
var menuItemTypeEnum = _enum([
	"custom",
	"page",
	"post",
	"taxonomy",
	"collection"
]);
var safeHref = string().trim().refine(isSafeHref, "URL must use http, https, mailto, tel, a relative path, or a fragment identifier");
object({
	name: string().min(1),
	label: string().min(1),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).strict().meta({ id: "CreateMenuBody" });
object({ label: string().min(1).optional() }).strict().meta({ id: "UpdateMenuBody" });
object({
	type: menuItemTypeEnum,
	label: string().min(1),
	referenceCollection: string().optional(),
	referenceId: string().optional(),
	customUrl: safeHref.optional(),
	target: string().optional(),
	titleAttr: string().optional(),
	cssClasses: string().optional(),
	parentId: string().optional(),
	sortOrder: number$1().int().min(0).optional()
}).strict().meta({ id: "CreateMenuItemBody" });
object({
	label: string().min(1).optional(),
	customUrl: safeHref.optional(),
	target: string().optional(),
	titleAttr: string().optional(),
	cssClasses: string().optional(),
	parentId: string().nullish(),
	sortOrder: number$1().int().min(0).optional()
}).strict().meta({ id: "UpdateMenuItemBody" });
object({ items: array(object({
	id: string().min(1),
	parentId: string().nullable(),
	sortOrder: number$1().int().min(0)
})) }).meta({ id: "ReorderMenuItemsBody" });
var menuSchema = object({
	id: string(),
	name: string(),
	label: string(),
	createdAt: string(),
	updatedAt: string(),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "Menu" });
var menuItemSchema = object({
	id: string(),
	menuId: string(),
	parentId: string().nullable(),
	sortOrder: number$1().int(),
	type: string(),
	referenceCollection: string().nullable(),
	referenceId: string().nullable(),
	customUrl: string().nullable(),
	label: string(),
	titleAttr: string().nullable(),
	target: string().nullable(),
	cssClasses: string().nullable(),
	createdAt: string(),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "MenuItem" });
object({
	translationGroup: string().nullable(),
	translations: array(object({
		id: string(),
		name: string(),
		label: string(),
		locale: string(),
		updatedAt: string()
	}))
}).meta({ id: "MenuTranslations" });
menuSchema.extend({ itemCount: number$1().int() }).meta({ id: "MenuListItem" });
menuSchema.extend({ items: array(menuItemSchema) }).meta({ id: "MenuWithItems" });
object({
	name: string().min(1).max(63).regex(/^[a-z][a-z0-9_]*$/, "Name must be lowercase alphanumeric with underscores"),
	label: string().min(1).max(200),
	labelSingular: string().min(1).max(200).optional(),
	hierarchical: boolean$1().optional().default(false),
	collections: array(string().min(1).max(63).regex(/^[a-z][a-z0-9_]*$/, "Invalid collection slug format")).max(100).optional().default([]),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).meta({ id: "CreateTaxonomyDefBody" });
object({
	slug: string().min(1),
	label: string().min(1),
	parentId: string().nullish(),
	description: string().optional(),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).meta({ id: "CreateTermBody" });
object({
	slug: string().min(1).optional(),
	label: string().min(1).optional(),
	parentId: string().nullish(),
	description: string().optional()
}).meta({ id: "UpdateTermBody" });
object({
	locale: localeCode.optional(),
	includeCounts: _enum(["true", "false"]).transform((v) => v === "true").optional().default(true).meta({ description: "Include each term's visible-usage count. Pass false to skip the aggregate; `count` is then absent from every term." })
}).meta({ id: "TermListQuery" });
var taxonomyDefSchema = object({
	id: string(),
	name: string(),
	label: string(),
	labelSingular: string().optional(),
	hierarchical: boolean$1(),
	collections: array(string()),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "TaxonomyDef" });
object({
	translationGroup: string().nullable(),
	translations: array(object({
		id: string(),
		name: string(),
		label: string(),
		locale: string()
	}))
}).meta({ id: "TaxonomyDefTranslations" });
object({ taxonomies: array(taxonomyDefSchema) }).meta({ id: "TaxonomyListResponse" });
var termSchema = object({
	id: string(),
	name: string(),
	slug: string(),
	label: string(),
	parentId: string().nullable(),
	description: string().optional(),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "Term" });
object({
	translationGroup: string().nullable(),
	translations: array(object({
		id: string(),
		slug: string(),
		label: string(),
		locale: string()
	}))
}).meta({ id: "TermTranslations" });
var termWithCountSchema = object({
	id: string(),
	name: string(),
	slug: string(),
	label: string(),
	parentId: string().nullable(),
	description: string().optional(),
	count: number$1().int().optional(),
	children: array(lazy(() => termWithCountSchema)),
	locale: string(),
	translationGroup: string().nullable()
}).meta({ id: "TermWithCount" });
object({ terms: array(termWithCountSchema) }).meta({ id: "TermListResponse" });
object({ term: termSchema }).meta({ id: "TermResponse" });
object({ term: termSchema.extend({
	count: number$1().int(),
	children: array(object({
		id: string(),
		slug: string(),
		label: string()
	}))
}) }).meta({ id: "TermGetResponse" });
var sectionSource = _enum([
	"theme",
	"user",
	"import"
]);
object({
	source: sectionSource.optional(),
	search: string().optional(),
	limit: number().int().min(1).max(100).optional().default(50),
	cursor: string().max(2048).optional()
}).meta({ id: "SectionsListQuery" });
object({
	slug: string().min(1),
	title: string().min(1),
	description: string().optional(),
	keywords: array(string()).optional(),
	content: array(record(string(), unknown())),
	previewMediaId: string().optional(),
	source: _enum(["user", "import"]).optional(),
	themeId: string().optional()
}).meta({ id: "CreateSectionBody" });
object({
	slug: string().min(1).optional(),
	title: string().min(1).optional(),
	description: string().optional(),
	keywords: array(string()).optional(),
	content: array(record(string(), unknown())).optional(),
	previewMediaId: string().nullish()
}).meta({ id: "UpdateSectionBody" });
var sectionSchema = object({
	id: string(),
	slug: string(),
	title: string(),
	description: string().nullable(),
	keywords: array(string()).nullable(),
	content: array(record(string(), unknown())),
	previewMediaId: string().nullable(),
	source: string(),
	themeId: string().nullable(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Section" });
object({
	items: array(sectionSchema),
	nextCursor: string().optional()
}).meta({ id: "SectionListResponse" });
var mediaReferenceInput = object({
	mediaId: string(),
	alt: string().optional()
});
var socialSettings = object({
	twitter: string().optional(),
	github: string().optional(),
	facebook: string().optional(),
	instagram: string().optional(),
	linkedin: string().optional(),
	youtube: string().optional()
});
var seoSettingsInput = object({
	titleSeparator: string().max(10).optional(),
	defaultOgImage: mediaReferenceInput.optional(),
	robotsTxt: string().max(5e3).optional(),
	googleVerification: string().max(100).optional(),
	bingVerification: string().max(100).optional()
});
object({
	title: string().optional(),
	tagline: string().optional(),
	logo: mediaReferenceInput.optional(),
	favicon: mediaReferenceInput.optional(),
	url: union([httpUrl, literal("")]).optional(),
	postsPerPage: number$1().int().min(1).max(100).optional(),
	dateFormat: string().optional(),
	timezone: string().optional(),
	social: socialSettings.optional(),
	seo: seoSettingsInput.optional()
}).meta({ id: "SettingsUpdateBody" });
var mediaReferenceResponse = object({
	mediaId: string(),
	alt: string().optional(),
	url: string().optional(),
	contentType: string().optional(),
	width: number$1().int().optional(),
	height: number$1().int().optional()
});
var seoSettingsResponse = object({
	titleSeparator: string().max(10).optional(),
	defaultOgImage: mediaReferenceResponse.optional(),
	robotsTxt: string().max(5e3).optional(),
	googleVerification: string().max(100).optional(),
	bingVerification: string().max(100).optional()
});
object({
	title: string().optional(),
	tagline: string().optional(),
	logo: mediaReferenceResponse.optional(),
	favicon: mediaReferenceResponse.optional(),
	url: string().optional(),
	postsPerPage: number$1().int().optional(),
	dateFormat: string().optional(),
	timezone: string().optional(),
	social: socialSettings.optional(),
	seo: seoSettingsResponse.optional()
}).meta({ id: "SiteSettings" });
object({
	q: string().min(1),
	collections: string().optional(),
	status: string().optional(),
	locale: localeCode.optional(),
	limit: number().int().min(1).max(100).optional(),
	cursor: string().optional()
}).meta({ id: "SearchQuery" });
object({
	q: string().min(1),
	collections: string().optional(),
	locale: localeCode.optional(),
	limit: number().int().min(1).max(20).optional()
}).meta({ id: "SearchSuggestQuery" });
object({ collection: string().min(1) }).meta({ id: "SearchRebuildBody" });
object({
	collection: string().min(1),
	enabled: boolean$1(),
	weights: record(string(), number$1()).optional()
}).meta({ id: "SearchEnableBody" });
var searchResultSchema = object({
	collection: string(),
	id: string(),
	slug: string().nullable(),
	locale: string(),
	title: string().optional(),
	snippet: string().optional(),
	score: number$1()
}).meta({ id: "SearchResult" });
object({
	items: array(searchResultSchema),
	nextCursor: string().optional()
}).meta({ id: "SearchResponse" });
object({
	search: string().optional(),
	role: string().optional(),
	cursor: string().max(2048).optional(),
	limit: number().int().min(1).max(100).optional().default(50)
}).meta({ id: "UsersListQuery" });
object({
	name: string().optional(),
	email: string().email().optional(),
	role: roleLevel.optional()
}).meta({ id: "UserUpdateBody" });
object({
	domain: string().min(1),
	defaultRole: roleLevel
}).meta({ id: "AllowedDomainCreateBody" });
object({
	enabled: boolean$1().optional(),
	defaultRole: roleLevel.optional()
}).meta({ id: "AllowedDomainUpdateBody" });
var userSchema = object({
	id: string(),
	email: string(),
	name: string().nullable(),
	avatarUrl: string().nullable(),
	role: number$1().int(),
	emailVerified: boolean$1(),
	disabled: boolean$1(),
	createdAt: string(),
	updatedAt: string(),
	lastLogin: string().nullable(),
	credentialCount: number$1().int().optional(),
	oauthProviders: array(string()).optional()
}).meta({ id: "User" });
object({
	items: array(userSchema),
	nextCursor: string().optional()
}).meta({ id: "UserListResponse" });
object({
	id: string(),
	email: string(),
	name: string().nullable(),
	avatarUrl: string().nullable(),
	role: number$1().int(),
	emailVerified: boolean$1(),
	disabled: boolean$1(),
	createdAt: string(),
	updatedAt: string(),
	lastLogin: string().nullable(),
	credentials: array(object({
		id: string(),
		name: string().nullable(),
		deviceType: string().nullable(),
		createdAt: string(),
		lastUsedAt: string()
	})),
	oauthAccounts: array(object({
		provider: string(),
		createdAt: string()
	}))
}).meta({ id: "UserDetail" });
var widgetType = _enum([
	"content",
	"menu",
	"component"
]);
object({
	name: string().min(1),
	label: string().min(1),
	description: string().optional()
}).meta({ id: "CreateWidgetAreaBody" });
object({
	type: widgetType,
	title: string().optional(),
	content: array(record(string(), unknown())).optional(),
	menuName: string().optional(),
	componentId: string().optional(),
	componentProps: record(string(), unknown()).optional()
}).meta({ id: "CreateWidgetBody" });
object({
	type: widgetType.optional(),
	title: string().optional(),
	content: array(record(string(), unknown())).optional(),
	menuName: string().optional(),
	componentId: string().optional(),
	componentProps: record(string(), unknown()).optional()
}).meta({ id: "UpdateWidgetBody" });
object({ widgetIds: array(string().min(1)) }).meta({ id: "ReorderWidgetsBody" });
var widgetAreaSchema = object({
	id: string(),
	name: string(),
	label: string(),
	description: string().nullable(),
	created_at: string(),
	updated_at: string()
}).meta({ id: "WidgetArea" });
var widgetSchema = object({
	id: string(),
	type: widgetType,
	title: string().optional(),
	content: array(record(string(), unknown())).optional(),
	menuName: string().optional(),
	componentId: string().optional(),
	componentProps: record(string(), unknown()).optional()
}).meta({ id: "Widget" });
widgetAreaSchema.extend({ widgets: array(widgetSchema) }).meta({ id: "WidgetAreaWithWidgets" }).extend({ widgetCount: number$1().int() }).meta({ id: "WidgetAreaWithWidgetsAndCount" });
var redirectType = number().int().refine((n) => REDIRECT_RULE_STATUSES.includes(n), { message: "Redirect type must be 301, 302, 307, 308, 410, or 451" });
/** Matches CR or LF characters */
var CRLF = /[\r\n]/;
/** Path must start with / and not be protocol-relative, contain no CRLF, and no path traversal */
var urlPath = string().min(1).refine((s) => s.startsWith("/") && !s.startsWith("//"), { message: "Must be a path starting with / (no protocol-relative URLs)" }).refine((s) => !CRLF.test(s), { message: "URL must not contain newline characters" }).refine((s) => {
	try {
		return !decodeURIComponent(s).split("/").includes("..");
	} catch {
		return false;
	}
}, { message: "URL must not contain path traversal segments" });
object({
	source: urlPath,
	destination: union([urlPath, literal("")]).optional(),
	type: redirectType.optional().default(301),
	enabled: boolean$1().optional().default(true),
	groupName: string().nullish()
}).refine((o) => isTerminalStatus(o.type ?? 301) || !!o.destination, {
	message: "destination is required for redirect types (301, 302, 307, 308)",
	path: ["destination"]
}).meta({ id: "CreateRedirectBody" });
object({
	source: urlPath.optional(),
	destination: union([urlPath, literal("")]).optional(),
	type: redirectType.optional(),
	enabled: boolean$1().optional(),
	groupName: string().nullish()
}).refine((o) => Object.values(o).some((v) => v !== void 0), { message: "At least one field must be provided" }).meta({ id: "UpdateRedirectBody" });
cursorPaginationQuery.extend({
	search: string().optional(),
	group: string().optional(),
	enabled: _enum(["true", "false"]).transform((v) => v === "true").optional(),
	auto: _enum(["true", "false"]).transform((v) => v === "true").optional()
}).meta({ id: "RedirectsListQuery" });
cursorPaginationQuery.extend({ search: string().optional() }).meta({ id: "NotFoundListQuery" });
object({ limit: number().int().min(1).max(100).optional().default(50) });
object({ olderThan: string().datetime({ message: "olderThan must be an ISO 8601 datetime" }) }).meta({ id: "NotFoundPruneBody" });
var redirectSchema = object({
	id: string(),
	source: string(),
	destination: string(),
	type: number$1().int(),
	isPattern: boolean$1(),
	enabled: boolean$1(),
	hits: number$1().int(),
	lastHitAt: string().nullable(),
	groupName: string().nullable(),
	auto: boolean$1(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "Redirect" });
object({
	items: array(redirectSchema),
	nextCursor: string().optional(),
	loopRedirectIds: array(string()).optional()
}).meta({ id: "RedirectListResponse" });
var notFoundEntrySchema = object({
	id: string(),
	path: string(),
	referrer: string().nullable(),
	userAgent: string().nullable(),
	ip: string().nullable(),
	createdAt: string()
}).meta({ id: "NotFoundEntry" });
object({
	items: array(notFoundEntrySchema),
	nextCursor: string().optional()
}).meta({ id: "NotFoundListResponse" });
var notFoundSummarySchema = object({
	path: string(),
	count: number$1().int(),
	lastSeen: string(),
	topReferrer: string().nullable()
}).meta({ id: "NotFoundSummary" });
object({ items: array(notFoundSummarySchema) }).meta({ id: "NotFoundSummaryResponse" });
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/trusted-proxy-CwjQj0YG.mjs
var HEADER_NAME_PATTERN = /^[!#$%&'*+\-.^_`|~0-9a-z]+$/;
function normalizeTrustedHeaders(names) {
	return names.map((h) => h.trim().toLowerCase()).filter((h) => h.length > 0 && HEADER_NAME_PATTERN.test(h));
}
function isValidHeaderName(name) {
	return HEADER_NAME_PATTERN.test(name);
}
var _envCache = null;
function getEnvTrustedHeaders() {
	if (_envCache !== null) return _envCache;
	let raw;
	try {
		const importMetaEnv = Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {});
		raw = (typeof process !== "undefined" ? process.env?.EMDASH_TRUSTED_PROXY_HEADERS : void 0) || importMetaEnv?.EMDASH_TRUSTED_PROXY_HEADERS;
	} catch {
		raw = void 0;
	}
	if (!raw) {
		_envCache = [];
		return _envCache;
	}
	_envCache = raw.split(",").map((s) => s.trim().toLowerCase()).filter((s) => s.length > 0 && isValidHeaderName(s));
	return _envCache;
}
function getTrustedProxyHeaders(config) {
	if (config && config.trustedProxyHeaders !== void 0) return config.trustedProxyHeaders.map((h) => h.trim().toLowerCase()).filter((h) => h.length > 0 && isValidHeaderName(h));
	return getEnvTrustedHeaders();
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/request-meta-DzXYYI-n.mjs
/**
* Loose validation for IPv4 and IPv6 addresses.
* Accepts digits, hex chars, dots, and colons — rejects anything else
* (e.g. HTML tags, scripts, or other non-IP garbage in spoofed headers).
*/
var IP_PATTERN = /^[\da-fA-F.:]+$/;
/**
* Extract the first IP from an X-Forwarded-For header value.
* The header may contain a comma-separated list of IPs; the first
* entry is the original client IP.
*
* Returns null if the extracted value doesn't look like an IP address.
*/
function parseFirstForwardedIp(header) {
	const trimmed = header.split(",")[0]?.trim();
	if (!trimmed) return null;
	return IP_PATTERN.test(trimmed) ? trimmed : null;
}
/**
* Read an IP from an operator-declared trusted header. XFF-style headers
* (any name ending in `forwarded-for`) are parsed as comma-separated lists
* and the first entry is used; everything else is treated as a single
* trimmed value.
*/
function readIpFromHeader(headers, name) {
	const value = headers.get(name);
	if (!value) return null;
	if (name.endsWith("forwarded-for")) return parseFirstForwardedIp(value);
	const trimmed = value.trim();
	if (!trimmed) return null;
	return IP_PATTERN.test(trimmed) ? trimmed : null;
}
/**
* Get the Cloudflare `cf` object from the request, if present.
* Returns undefined when not running on Cloudflare Workers.
*/
function getCfObject(request) {
	return request.cf;
}
/**
* Extract geographic information from the Cloudflare `cf` object
* attached to the request. Returns null when not running on CF Workers.
*/
function extractGeo(cf) {
	if (!cf) return null;
	const country = cf.country ?? null;
	const region = cf.region ?? null;
	const city = cf.city ?? null;
	if (country === null && region === null && city === null) return null;
	return {
		country,
		region,
		city
	};
}
/**
* Extract normalized request metadata from a Request object.
*
* IP resolution order:
* 1. `CF-Connecting-IP` — trusted only when a `cf` object is present on the
*    request. CF edge overwrites any client-supplied value, so this is the
*    cryptographically trustworthy path on Workers. Operator-declared
*    trusted headers cannot override it.
* 2. `X-Forwarded-For` first entry — trusted only with a `cf` object.
* 3. Operator-declared trusted proxy headers (from `config.trustedProxyHeaders`
*    or the `EMDASH_TRUSTED_PROXY_HEADERS` env var), tried in order. Used as
*    the primary source off-CF and as a fill-in on CF.
* 4. `null`
*
* The second argument accepts either the EmDash config or a pre-resolved
* list of trusted headers, so callers that already have the list don't have
* to round-trip through the config every request.
*/
function extractRequestMeta(request, configOrTrustedHeaders) {
	const headers = request.headers;
	const cf = getCfObject(request);
	const trusted = resolveTrustedHeaders(configOrTrustedHeaders);
	let ip = null;
	if (cf) {
		const cfIp = headers.get("cf-connecting-ip")?.trim();
		if (cfIp && IP_PATTERN.test(cfIp)) ip = cfIp;
		if (!ip) {
			const xff = headers.get("x-forwarded-for");
			ip = xff ? parseFirstForwardedIp(xff) : null;
		}
	}
	if (!ip) for (const name of trusted) {
		const value = readIpFromHeader(headers, name);
		if (value) {
			ip = value;
			break;
		}
	}
	const userAgent = headers.get("user-agent")?.trim() || null;
	const referer = headers.get("referer")?.trim() || null;
	const geo = extractGeo(cf);
	return {
		ip,
		userAgent,
		referer,
		geo
	};
}
function resolveTrustedHeaders(value) {
	if (Array.isArray(value)) return normalizeTrustedHeaders(value);
	return getTrustedProxyHeaders(value);
}
/**
* Headers that must never cross the RPC boundary to sandboxed plugins.
* Session tokens, auth credentials, and infrastructure headers are stripped
* to prevent malicious plugins from exfiltrating sensitive data.
*/
var SANDBOX_STRIPPED_HEADERS = /* @__PURE__ */ new Set([
	"cookie",
	"set-cookie",
	"authorization",
	"proxy-authorization",
	"cf-access-jwt-assertion",
	"cf-access-client-id",
	"cf-access-client-secret",
	"x-emdash-request"
]);
/**
* Copy request headers into a plain object, stripping sensitive headers
* that must not be exposed to sandboxed plugin code.
*/
function sanitizeHeadersForSandbox(headers) {
	const safe = {};
	headers.forEach((value, key) => {
		if (!SANDBOX_STRIPPED_HEADERS.has(key)) safe[key] = value;
	});
	return safe;
}
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
	width: number$1().optional(),
	height: number$1().optional()
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
		url: sanitizeHref$1(url),
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
//#region self-essentials/emdash-main/packages/core/dist/errors-DtEXIQQV.mjs
/**
* Typed error codes and status mapping for the EmDash REST API.
*
* All handler-level and route-level error codes are defined here.
* Routes and handlers should import error codes from this module
* instead of using ad-hoc strings.
*/
var ErrorCode = {
	NOT_FOUND: "NOT_FOUND",
	VALIDATION_ERROR: "VALIDATION_ERROR",
	INVALID_INPUT: "INVALID_INPUT",
	INVALID_JSON: "INVALID_JSON",
	INVALID_CURSOR: "INVALID_CURSOR",
	CONFLICT: "CONFLICT",
	SLUG_CONFLICT: "SLUG_CONFLICT",
	NOT_CONFIGURED: "NOT_CONFIGURED",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	RATE_LIMITED: "RATE_LIMITED",
	NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
	NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
	NOT_SUPPORTED: "NOT_SUPPORTED",
	MISSING_PARAM: "MISSING_PARAM",
	CSRF_REJECTED: "CSRF_REJECTED",
	CONTENT_CREATE_ERROR: "CONTENT_CREATE_ERROR",
	CONTENT_UPDATE_ERROR: "CONTENT_UPDATE_ERROR",
	CONTENT_DELETE_ERROR: "CONTENT_DELETE_ERROR",
	CONTENT_LIST_ERROR: "CONTENT_LIST_ERROR",
	CONTENT_GET_ERROR: "CONTENT_GET_ERROR",
	CONTENT_DUPLICATE_ERROR: "CONTENT_DUPLICATE_ERROR",
	CONTENT_RESTORE_ERROR: "CONTENT_RESTORE_ERROR",
	CONTENT_PUBLISH_ERROR: "CONTENT_PUBLISH_ERROR",
	CONTENT_UNPUBLISH_ERROR: "CONTENT_UNPUBLISH_ERROR",
	CONTENT_SCHEDULE_ERROR: "CONTENT_SCHEDULE_ERROR",
	CONTENT_UNSCHEDULE_ERROR: "CONTENT_UNSCHEDULE_ERROR",
	CONTENT_DISCARD_DRAFT_ERROR: "CONTENT_DISCARD_DRAFT_ERROR",
	CONTENT_COMPARE_ERROR: "CONTENT_COMPARE_ERROR",
	CONTENT_TRANSLATIONS_ERROR: "CONTENT_TRANSLATIONS_ERROR",
	CONTENT_COUNT_ERROR: "CONTENT_COUNT_ERROR",
	REVISION_LIST_ERROR: "REVISION_LIST_ERROR",
	REVISION_GET_ERROR: "REVISION_GET_ERROR",
	REVISION_RESTORE_ERROR: "REVISION_RESTORE_ERROR",
	INVALID_REVISION: "INVALID_REVISION",
	SCHEMA_LIST_ERROR: "SCHEMA_LIST_ERROR",
	SCHEMA_GET_ERROR: "SCHEMA_GET_ERROR",
	SCHEMA_CREATE_ERROR: "SCHEMA_CREATE_ERROR",
	SCHEMA_UPDATE_ERROR: "SCHEMA_UPDATE_ERROR",
	SCHEMA_DELETE_ERROR: "SCHEMA_DELETE_ERROR",
	SCHEMA_EXPORT_ERROR: "SCHEMA_EXPORT_ERROR",
	SCHEMA_FIELD_LIST_ERROR: "SCHEMA_FIELD_LIST_ERROR",
	SCHEMA_FIELD_GET_ERROR: "SCHEMA_FIELD_GET_ERROR",
	SCHEMA_FIELD_CREATE_ERROR: "SCHEMA_FIELD_CREATE_ERROR",
	SCHEMA_FIELD_UPDATE_ERROR: "SCHEMA_FIELD_UPDATE_ERROR",
	SCHEMA_FIELD_DELETE_ERROR: "SCHEMA_FIELD_DELETE_ERROR",
	SCHEMA_FIELD_REORDER_ERROR: "SCHEMA_FIELD_REORDER_ERROR",
	TRANSLATABLE_LOCKED: "TRANSLATABLE_LOCKED",
	REORDER_MISMATCH: "REORDER_MISMATCH",
	ORPHAN_LIST_ERROR: "ORPHAN_LIST_ERROR",
	ORPHAN_REGISTER_ERROR: "ORPHAN_REGISTER_ERROR",
	COLLECTION_EXISTS: "COLLECTION_EXISTS",
	COLLECTION_NOT_FOUND: "COLLECTION_NOT_FOUND",
	COLLECTION_SCHEMA_MISMATCH: "COLLECTION_SCHEMA_MISMATCH",
	TABLE_NOT_FOUND: "TABLE_NOT_FOUND",
	FIELD_EXISTS: "FIELD_EXISTS",
	FIELD_TYPE_COLUMN_CHANGE: "FIELD_TYPE_COLUMN_CHANGE",
	RESERVED_SLUG: "RESERVED_SLUG",
	INVALID_SLUG: "INVALID_SLUG",
	CREATE_FAILED: "CREATE_FAILED",
	UPDATE_FAILED: "UPDATE_FAILED",
	REGISTER_FAILED: "REGISTER_FAILED",
	MEDIA_LIST_ERROR: "MEDIA_LIST_ERROR",
	MEDIA_GET_ERROR: "MEDIA_GET_ERROR",
	MEDIA_CREATE_ERROR: "MEDIA_CREATE_ERROR",
	MEDIA_UPDATE_ERROR: "MEDIA_UPDATE_ERROR",
	MEDIA_DELETE_ERROR: "MEDIA_DELETE_ERROR",
	MEDIA_USAGE_READ_ERROR: "MEDIA_USAGE_READ_ERROR",
	MEDIA_USAGE_REPAIR_ERROR: "MEDIA_USAGE_REPAIR_ERROR",
	NO_STORAGE: "NO_STORAGE",
	NO_FILE: "NO_FILE",
	INVALID_TYPE: "INVALID_TYPE",
	UPLOAD_ERROR: "UPLOAD_ERROR",
	UPLOAD_URL_ERROR: "UPLOAD_URL_ERROR",
	CONFIRM_ERROR: "CONFIRM_ERROR",
	CONFIRM_FAILED: "CONFIRM_FAILED",
	FILE_NOT_FOUND: "FILE_NOT_FOUND",
	INVALID_STATE: "INVALID_STATE",
	FILE_SERVE_ERROR: "FILE_SERVE_ERROR",
	STORAGE_NOT_CONFIGURED: "STORAGE_NOT_CONFIGURED",
	PROVIDER_LIST_ERROR: "PROVIDER_LIST_ERROR",
	PROVIDER_UPLOAD_ERROR: "PROVIDER_UPLOAD_ERROR",
	PROVIDER_GET_ERROR: "PROVIDER_GET_ERROR",
	PROVIDER_DELETE_ERROR: "PROVIDER_DELETE_ERROR",
	COMMENT_LIST_ERROR: "COMMENT_LIST_ERROR",
	COMMENT_GET_ERROR: "COMMENT_GET_ERROR",
	COMMENT_STATUS_ERROR: "COMMENT_STATUS_ERROR",
	COMMENT_DELETE_ERROR: "COMMENT_DELETE_ERROR",
	COMMENT_BULK_ERROR: "COMMENT_BULK_ERROR",
	COMMENT_INBOX_ERROR: "COMMENT_INBOX_ERROR",
	COMMENT_COUNTS_ERROR: "COMMENT_COUNTS_ERROR",
	COMMENT_CREATE_ERROR: "COMMENT_CREATE_ERROR",
	COMMENTS_DISABLED: "COMMENTS_DISABLED",
	COMMENTS_CLOSED: "COMMENTS_CLOSED",
	COMMENT_REJECTED: "COMMENT_REJECTED",
	ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
	ADMIN_EXISTS: "ADMIN_EXISTS",
	SETUP_COMPLETE: "SETUP_COMPLETE",
	CREDENTIAL_EXISTS: "CREDENTIAL_EXISTS",
	CHALLENGE_EXPIRED: "CHALLENGE_EXPIRED",
	PASSKEY_REGISTER_ERROR: "PASSKEY_REGISTER_ERROR",
	PASSKEY_REGISTER_OPTIONS_ERROR: "PASSKEY_REGISTER_OPTIONS_ERROR",
	PASSKEY_OPTIONS_ERROR: "PASSKEY_OPTIONS_ERROR",
	PASSKEY_VERIFY_ERROR: "PASSKEY_VERIFY_ERROR",
	PASSKEY_LIST_ERROR: "PASSKEY_LIST_ERROR",
	PASSKEY_RENAME_ERROR: "PASSKEY_RENAME_ERROR",
	PASSKEY_DELETE_ERROR: "PASSKEY_DELETE_ERROR",
	PASSKEY_LIMIT: "PASSKEY_LIMIT",
	LAST_PASSKEY: "LAST_PASSKEY",
	LOGOUT_ERROR: "LOGOUT_ERROR",
	SELF_ROLE_CHANGE: "SELF_ROLE_CHANGE",
	EMAIL_IN_USE: "EMAIL_IN_USE",
	EMAIL_NOT_CONFIGURED: "EMAIL_NOT_CONFIGURED",
	USER_EXISTS: "USER_EXISTS",
	INVALID_TOKEN: "INVALID_TOKEN",
	TOKEN_EXPIRED: "TOKEN_EXPIRED",
	DOMAIN_NOT_ALLOWED: "DOMAIN_NOT_ALLOWED",
	INVITE_CREATE_ERROR: "INVITE_CREATE_ERROR",
	INVITE_VALIDATE_ERROR: "INVITE_VALIDATE_ERROR",
	INVITE_COMPLETE_ERROR: "INVITE_COMPLETE_ERROR",
	SIGNUP_VERIFY_ERROR: "SIGNUP_VERIFY_ERROR",
	SIGNUP_COMPLETE_ERROR: "SIGNUP_COMPLETE_ERROR",
	RECOVERY_SEND_ERROR: "RECOVERY_SEND_ERROR",
	USER_LIST_ERROR: "USER_LIST_ERROR",
	USER_DETAIL_ERROR: "USER_DETAIL_ERROR",
	USER_UPDATE_ERROR: "USER_UPDATE_ERROR",
	USER_DISABLE_ERROR: "USER_DISABLE_ERROR",
	USER_ENABLE_ERROR: "USER_ENABLE_ERROR",
	UNSUPPORTED_RESPONSE_TYPE: "UNSUPPORTED_RESPONSE_TYPE",
	INVALID_REDIRECT_URI: "INVALID_REDIRECT_URI",
	INVALID_CLIENT: "INVALID_CLIENT",
	INVALID_SCOPE: "INVALID_SCOPE",
	AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
	INVALID_GRANT: "INVALID_GRANT",
	UNSUPPORTED_GRANT_TYPE: "UNSUPPORTED_GRANT_TYPE",
	INVALID_CODE: "INVALID_CODE",
	EXPIRED_CODE: "EXPIRED_CODE",
	INSUFFICIENT_ROLE: "INSUFFICIENT_ROLE",
	INSUFFICIENT_SCOPE: "INSUFFICIENT_SCOPE",
	INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
	TOKEN_EXCHANGE_ERROR: "TOKEN_EXCHANGE_ERROR",
	TOKEN_REFRESH_ERROR: "TOKEN_REFRESH_ERROR",
	TOKEN_REVOKE_ERROR: "TOKEN_REVOKE_ERROR",
	TOKEN_CREATE_ERROR: "TOKEN_CREATE_ERROR",
	TOKEN_LIST_ERROR: "TOKEN_LIST_ERROR",
	TOKEN_ERROR: "TOKEN_ERROR",
	DEVICE_CODE_ERROR: "DEVICE_CODE_ERROR",
	AUTHORIZE_ERROR: "AUTHORIZE_ERROR",
	CLIENT_LIST_ERROR: "CLIENT_LIST_ERROR",
	CLIENT_GET_ERROR: "CLIENT_GET_ERROR",
	CLIENT_CREATE_ERROR: "CLIENT_CREATE_ERROR",
	CLIENT_UPDATE_ERROR: "CLIENT_UPDATE_ERROR",
	CLIENT_DELETE_ERROR: "CLIENT_DELETE_ERROR",
	DOMAIN_LIST_ERROR: "DOMAIN_LIST_ERROR",
	DOMAIN_CREATE_ERROR: "DOMAIN_CREATE_ERROR",
	DOMAIN_UPDATE_ERROR: "DOMAIN_UPDATE_ERROR",
	DOMAIN_DELETE_ERROR: "DOMAIN_DELETE_ERROR",
	PLUGIN_LIST_ERROR: "PLUGIN_LIST_ERROR",
	PLUGIN_GET_ERROR: "PLUGIN_GET_ERROR",
	PLUGIN_ENABLE_ERROR: "PLUGIN_ENABLE_ERROR",
	PLUGIN_DISABLE_ERROR: "PLUGIN_DISABLE_ERROR",
	PLUGIN_ID_CONFLICT: "PLUGIN_ID_CONFLICT",
	PLUGIN_SETTINGS_READ_ERROR: "PLUGIN_SETTINGS_READ_ERROR",
	PLUGIN_SETTINGS_UPDATE_ERROR: "PLUGIN_SETTINGS_UPDATE_ERROR",
	MARKETPLACE_NOT_CONFIGURED: "MARKETPLACE_NOT_CONFIGURED",
	MARKETPLACE_UNAVAILABLE: "MARKETPLACE_UNAVAILABLE",
	MARKETPLACE_ERROR: "MARKETPLACE_ERROR",
	SANDBOX_NOT_AVAILABLE: "SANDBOX_NOT_AVAILABLE",
	ALREADY_INSTALLED: "ALREADY_INSTALLED",
	ALREADY_UP_TO_DATE: "ALREADY_UP_TO_DATE",
	NO_VERSION: "NO_VERSION",
	MANIFEST_MISMATCH: "MANIFEST_MISMATCH",
	MANIFEST_VERSION_MISMATCH: "MANIFEST_VERSION_MISMATCH",
	AUDIT_FAILED: "AUDIT_FAILED",
	CHECKSUM_MISMATCH: "CHECKSUM_MISMATCH",
	INVALID_BUNDLE: "INVALID_BUNDLE",
	BUNDLE_EXTRACT_FAILED: "BUNDLE_EXTRACT_FAILED",
	BUNDLE_DOWNLOAD_FAILED: "BUNDLE_DOWNLOAD_FAILED",
	AGGREGATOR_RESPONSE_INVALID: "AGGREGATOR_RESPONSE_INVALID",
	AGGREGATOR_HTTP_ERROR: "AGGREGATOR_HTTP_ERROR",
	AGGREGATOR_NOT_FOUND: "AGGREGATOR_NOT_FOUND",
	CAPABILITY_ESCALATION: "CAPABILITY_ESCALATION",
	ROUTE_VISIBILITY_ESCALATION: "ROUTE_VISIBILITY_ESCALATION",
	ENV_INCOMPATIBLE: "ENV_INCOMPATIBLE",
	INSTALL_FAILED: "INSTALL_FAILED",
	UNINSTALL_FAILED: "UNINSTALL_FAILED",
	SEARCH_FAILED: "SEARCH_FAILED",
	GET_PLUGIN_FAILED: "GET_PLUGIN_FAILED",
	GET_THEME_FAILED: "GET_THEME_FAILED",
	THEME_SEARCH_FAILED: "THEME_SEARCH_FAILED",
	UPDATE_CHECK_FAILED: "UPDATE_CHECK_FAILED",
	EXCLUSIVE_HOOKS_LIST_ERROR: "EXCLUSIVE_HOOKS_LIST_ERROR",
	EXCLUSIVE_HOOK_SET_ERROR: "EXCLUSIVE_HOOK_SET_ERROR",
	MENU_LIST_ERROR: "MENU_LIST_ERROR",
	MENU_CREATE_ERROR: "MENU_CREATE_ERROR",
	MENU_GET_ERROR: "MENU_GET_ERROR",
	MENU_UPDATE_ERROR: "MENU_UPDATE_ERROR",
	MENU_DELETE_ERROR: "MENU_DELETE_ERROR",
	MENU_ITEM_CREATE_ERROR: "MENU_ITEM_CREATE_ERROR",
	MENU_ITEM_UPDATE_ERROR: "MENU_ITEM_UPDATE_ERROR",
	MENU_ITEM_DELETE_ERROR: "MENU_ITEM_DELETE_ERROR",
	MENU_REORDER_ERROR: "MENU_REORDER_ERROR",
	AMBIGUOUS_LOCALE: "AMBIGUOUS_LOCALE",
	TAXONOMY_LIST_ERROR: "TAXONOMY_LIST_ERROR",
	TAXONOMY_CREATE_ERROR: "TAXONOMY_CREATE_ERROR",
	TERM_LIST_ERROR: "TERM_LIST_ERROR",
	TERM_CREATE_ERROR: "TERM_CREATE_ERROR",
	TERM_GET_ERROR: "TERM_GET_ERROR",
	TERM_UPDATE_ERROR: "TERM_UPDATE_ERROR",
	TERM_DELETE_ERROR: "TERM_DELETE_ERROR",
	TERMS_GET_ERROR: "TERMS_GET_ERROR",
	TERMS_SET_ERROR: "TERMS_SET_ERROR",
	RELATION_LIST_ERROR: "RELATION_LIST_ERROR",
	RELATION_CREATE_ERROR: "RELATION_CREATE_ERROR",
	RELATION_GET_ERROR: "RELATION_GET_ERROR",
	RELATION_UPDATE_ERROR: "RELATION_UPDATE_ERROR",
	RELATION_DELETE_ERROR: "RELATION_DELETE_ERROR",
	RELATION_TRANSLATIONS_ERROR: "RELATION_TRANSLATIONS_ERROR",
	REFERENCES_GET_ERROR: "REFERENCES_GET_ERROR",
	REFERENCES_SET_ERROR: "REFERENCES_SET_ERROR",
	SECTION_LIST_ERROR: "SECTION_LIST_ERROR",
	SECTION_CREATE_ERROR: "SECTION_CREATE_ERROR",
	SECTION_GET_ERROR: "SECTION_GET_ERROR",
	SECTION_UPDATE_ERROR: "SECTION_UPDATE_ERROR",
	SECTION_DELETE_ERROR: "SECTION_DELETE_ERROR",
	REDIRECT_LIST_ERROR: "REDIRECT_LIST_ERROR",
	REDIRECT_CREATE_ERROR: "REDIRECT_CREATE_ERROR",
	REDIRECT_GET_ERROR: "REDIRECT_GET_ERROR",
	REDIRECT_UPDATE_ERROR: "REDIRECT_UPDATE_ERROR",
	REDIRECT_DELETE_ERROR: "REDIRECT_DELETE_ERROR",
	NOT_FOUND_LIST_ERROR: "NOT_FOUND_LIST_ERROR",
	NOT_FOUND_SUMMARY_ERROR: "NOT_FOUND_SUMMARY_ERROR",
	NOT_FOUND_CLEAR_ERROR: "NOT_FOUND_CLEAR_ERROR",
	NOT_FOUND_PRUNE_ERROR: "NOT_FOUND_PRUNE_ERROR",
	WIDGET_AREA_LIST_ERROR: "WIDGET_AREA_LIST_ERROR",
	WIDGET_AREA_CREATE_ERROR: "WIDGET_AREA_CREATE_ERROR",
	WIDGET_AREA_GET_ERROR: "WIDGET_AREA_GET_ERROR",
	WIDGET_AREA_DELETE_ERROR: "WIDGET_AREA_DELETE_ERROR",
	WIDGET_CREATE_ERROR: "WIDGET_CREATE_ERROR",
	WIDGET_UPDATE_ERROR: "WIDGET_UPDATE_ERROR",
	WIDGET_DELETE_ERROR: "WIDGET_DELETE_ERROR",
	WIDGET_REORDER_ERROR: "WIDGET_REORDER_ERROR",
	WIDGET_COMPONENTS_ERROR: "WIDGET_COMPONENTS_ERROR",
	ALREADY_CONFIGURED: "ALREADY_CONFIGURED",
	INVALID_SEED: "INVALID_SEED",
	INVALID_REDIRECT: "INVALID_REDIRECT",
	SETUP_ERROR: "SETUP_ERROR",
	SETUP_STATUS_ERROR: "SETUP_STATUS_ERROR",
	SETUP_ADMIN_ERROR: "SETUP_ADMIN_ERROR",
	SETUP_VERIFY_ERROR: "SETUP_VERIFY_ERROR",
	DEV_BYPASS_ERROR: "DEV_BYPASS_ERROR",
	DEV_RESET_ERROR: "DEV_RESET_ERROR",
	MIGRATION_ERROR: "MIGRATION_ERROR",
	SEED_ERROR: "SEED_ERROR",
	SETTINGS_READ_ERROR: "SETTINGS_READ_ERROR",
	SETTINGS_UPDATE_ERROR: "SETTINGS_UPDATE_ERROR",
	EMAIL_SETTINGS_READ_ERROR: "EMAIL_SETTINGS_READ_ERROR",
	EMAIL_TEST_ERROR: "EMAIL_TEST_ERROR",
	BACKUP_SETTINGS_READ_ERROR: "BACKUP_SETTINGS_READ_ERROR",
	BACKUP_SETTINGS_ERROR: "BACKUP_SETTINGS_ERROR",
	BACKUP_EXPORT_ERROR: "BACKUP_EXPORT_ERROR",
	BACKUP_LIST_ERROR: "BACKUP_LIST_ERROR",
	BACKUP_CREATE_ERROR: "BACKUP_CREATE_ERROR",
	BACKUP_DELETE_ERROR: "BACKUP_DELETE_ERROR",
	BACKUP_DOWNLOAD_ERROR: "BACKUP_DOWNLOAD_ERROR",
	SEARCH_ERROR: "SEARCH_ERROR",
	STATS_ERROR: "STATS_ERROR",
	SUGGESTION_ERROR: "SUGGESTION_ERROR",
	REBUILD_ERROR: "REBUILD_ERROR",
	WXR_ANALYZE_ERROR: "WXR_ANALYZE_ERROR",
	WXR_PREPARE_ERROR: "WXR_PREPARE_ERROR",
	WXR_IMPORT_ERROR: "WXR_IMPORT_ERROR",
	IMPORT_ERROR: "IMPORT_ERROR",
	REWRITE_ERROR: "REWRITE_ERROR",
	WP_PLUGIN_ANALYZE_ERROR: "WP_PLUGIN_ANALYZE_ERROR",
	WP_PLUGIN_IMPORT_ERROR: "WP_PLUGIN_IMPORT_ERROR",
	SSRF_BLOCKED: "SSRF_BLOCKED",
	PROBE_ERROR: "PROBE_ERROR",
	DASHBOARD_ERROR: "DASHBOARD_ERROR",
	DASHBOARD_STATS_ERROR: "DASHBOARD_STATS_ERROR",
	SNAPSHOT_ERROR: "SNAPSHOT_ERROR",
	TYPEGEN_ERROR: "TYPEGEN_ERROR",
	SITEMAP_ERROR: "SITEMAP_ERROR",
	NO_DB: "NO_DB",
	INVALID_REQUEST: "INVALID_REQUEST",
	UNKNOWN_ACTION: "UNKNOWN_ACTION"
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/state-xxv6ZTMv.mjs
function toPluginStatus(value) {
	if (value === "active") return "active";
	return "inactive";
}
function toPluginSource(value) {
	if (value === "marketplace") return "marketplace";
	if (value === "registry") return "registry";
	return "config";
}
/**
* Repository for plugin state in the database
*/
var PluginStateRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Get state for a specific plugin
	*/
	async get(pluginId) {
		const row = await this.db.selectFrom("_plugin_state").selectAll().where("plugin_id", "=", pluginId).executeTakeFirst();
		if (!row) return null;
		return rowToPluginState(row);
	}
	/**
	* Get all plugin states
	*/
	async getAll() {
		return (await this.db.selectFrom("_plugin_state").selectAll().execute()).map(rowToPluginState);
	}
	/**
	* Get all marketplace-installed plugin states
	*/
	async getMarketplacePlugins() {
		return (await this.db.selectFrom("_plugin_state").selectAll().where("source", "=", "marketplace").execute()).map(rowToPluginState);
	}
	/**
	* Get all registry-installed plugin states.
	*
	* The runtime's registry sync path uses this to discover which
	* registry plugins should be loaded into the sandbox on this worker.
	*/
	async getRegistryPlugins() {
		return (await this.db.selectFrom("_plugin_state").selectAll().where("source", "=", "registry").execute()).map(rowToPluginState);
	}
	/**
	* Create or update plugin state
	*/
	async upsert(pluginId, version, status, opts) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = await this.get(pluginId);
		if (existing) {
			const updates = {
				status,
				version
			};
			if (status === "active" && existing.status !== "active") updates.activated_at = now;
			else if (status === "inactive" && existing.status !== "inactive") updates.deactivated_at = now;
			if (opts?.source) updates.source = opts.source;
			if (opts?.marketplaceVersion !== void 0) updates.marketplace_version = opts.marketplaceVersion;
			if (opts?.displayName !== void 0) updates.display_name = opts.displayName;
			if (opts?.description !== void 0) updates.description = opts.description;
			if (opts?.registryPublisherDid !== void 0) updates.registry_publisher_did = opts.registryPublisherDid;
			if (opts?.registrySlug !== void 0) updates.registry_slug = opts.registrySlug;
			if (opts?.mcpToolsEnabled !== void 0) updates.mcp_tools_enabled = opts.mcpToolsEnabled ? 1 : 0;
			if (opts?.mcpToolsConsent !== void 0) updates.mcp_tools_consent = opts.mcpToolsConsent;
			await this.db.updateTable("_plugin_state").set(updates).where("plugin_id", "=", pluginId).execute();
		} else await this.db.insertInto("_plugin_state").values({
			plugin_id: pluginId,
			status,
			version,
			installed_at: now,
			activated_at: status === "active" ? now : null,
			deactivated_at: null,
			data: null,
			source: opts?.source ?? "config",
			marketplace_version: opts?.marketplaceVersion ?? null,
			display_name: opts?.displayName ?? null,
			description: opts?.description ?? null,
			registry_publisher_did: opts?.registryPublisherDid ?? null,
			registry_slug: opts?.registrySlug ?? null,
			mcp_tools_enabled: opts?.mcpToolsEnabled ? 1 : 0,
			mcp_tools_consent: opts?.mcpToolsConsent ?? null
		}).execute();
		return await this.get(pluginId);
	}
	/**
	* Enable a plugin
	*/
	async enable(pluginId, version) {
		return this.upsert(pluginId, version, "active");
	}
	/**
	* Disable a plugin
	*/
	async disable(pluginId, version) {
		return this.upsert(pluginId, version, "inactive");
	}
	/**
	* Delete plugin state
	*/
	async delete(pluginId) {
		return ((await this.db.deleteFrom("_plugin_state").where("plugin_id", "=", pluginId).executeTakeFirst()).numDeletedRows ?? 0) > 0;
	}
};
function rowToPluginState(row) {
	return {
		pluginId: row.plugin_id,
		status: toPluginStatus(row.status),
		version: row.version,
		installedAt: new Date(row.installed_at),
		activatedAt: row.activated_at ? new Date(row.activated_at) : null,
		deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
		source: toPluginSource(row.source),
		marketplaceVersion: row.marketplace_version ?? null,
		displayName: row.display_name ?? null,
		description: row.description ?? null,
		registryPublisherDid: row.registry_publisher_did ?? null,
		registrySlug: row.registry_slug ?? null,
		mcpToolsEnabled: row.mcp_tools_enabled === 1,
		mcpToolsConsent: row.mcp_tools_consent ?? null
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/types-BD40g7zz.mjs
/**
* Storage error with additional context
*/
var EmDashStorageError = class extends Error {
	constructor(message, code, cause) {
		super(message);
		this.code = code;
		this.cause = cause;
		this.name = "EmDashStorageError";
	}
};
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		MAX_LENGTH: 256,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: 250,
		MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: "2.0.0",
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
}));
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	const debug = require_debug();
	exports = module.exports = {};
	const re = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
	createToken("FULL", `^${src[t.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
	createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re, t } = require_re();
	const parseOptions = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	const isPrereleaseIdentifier = (prerelease, identifier) => {
		const identifiers = identifier.split(".");
		if (identifiers.length > prerelease.length) return false;
		for (let i = 0; i < identifiers.length; i++) if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) return false;
		return true;
	};
	module.exports = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
			else version = version.version;
			else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (isPrereleaseIdentifier(this.prerelease, identifier)) {
							const prereleaseBase = this.prerelease[identifier.split(".").length];
							if (isNaN(prereleaseBase)) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
}));
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver();
	const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const eq = require_eq();
	const neq = require_neq();
	const gt = require_gt();
	const gte = require_gte();
	const lt = require_lt();
	const lte = require_lte();
	const cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANY = Symbol("SemVer ANY");
	module.exports = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) if (comp.loose === !!options.loose) return comp;
			else comp = comp.value;
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp = require_cmp();
	const debug = require_debug();
	const SemVer = require_semver();
	const Range = require_range();
}));
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	module.exports = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
			else return new Range(range.raw, options);
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			range = range.replace(BUILDSTRIPRE, "");
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	const cache = new (require_lrucache())();
	const parseOptions = require_parse_options();
	const Comparator = require_comparator();
	const debug = require_debug();
	const SemVer = require_semver();
	const { safeRe: re, src, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
		debug("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug("caret", comp);
		comp = replaceTildes(comp, options);
		debug("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug("xrange", comp);
		comp = replaceStars(comp, options);
		debug("stars", comp);
		return comp;
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			if (invalidXRangeOrder(M, m, p)) return comp;
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
			else ret = "*";
			else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));
require_satisfies();
require_valid$1();
require_valid();
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/api-DgPbMlng.mjs
function encodeRev(item) {
	return encodeBase64(`${item.version}:${item.updatedAt}`);
}
function decodeRev(rev) {
	try {
		const decoded = decodeBase64(rev);
		const colonIdx = decoded.indexOf(":");
		if (colonIdx === -1) return null;
		const version = parseInt(decoded.slice(0, colonIdx), 10);
		const updatedAt = decoded.slice(colonIdx + 1);
		if (isNaN(version) || !updatedAt) return null;
		return {
			version,
			updatedAt
		};
	} catch {
		return null;
	}
}
function validateRev(rev, item) {
	if (!rev) return { valid: true };
	const decoded = decodeRev(rev);
	if (!decoded) return {
		valid: false,
		message: "Malformed _rev token"
	};
	if (decoded.version !== item.version || decoded.updatedAt !== item.updatedAt) return {
		valid: false,
		message: "Content has been modified since last read (version conflict)"
	};
	return { valid: true };
}
function asMediaRef(value) {
	if (value === null || value === void 0) return null;
	if (typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function fail(message) {
	return {
		success: false,
		error: {
			code: "INVALID_MIME_FOR_FIELD",
			message
		}
	};
}
async function loadMediaFieldsForCollection(db, collectionSlug) {
	const rows = await db.selectFrom("_emdash_fields").innerJoin("_emdash_collections", "_emdash_collections.id", "_emdash_fields.collection_id").select([
		"_emdash_fields.slug",
		"_emdash_fields.type",
		"_emdash_fields.validation"
	]).where("_emdash_collections.slug", "=", collectionSlug).where("_emdash_fields.type", "in", ["file", "image"]).execute();
	const out = [];
	for (const row of rows) {
		const list = parseAllowedMimeTypes(row.validation);
		if (!list) continue;
		out.push({
			slug: row.slug,
			type: row.type,
			allowedMimeTypes: list
		});
	}
	return out;
}
async function validateMediaFields(db, collectionSlug, data) {
	const fields = await requestCached(`mediaFields:${collectionSlug}`, () => loadMediaFieldsForCollection(db, collectionSlug));
	if (fields.length === 0) return {
		success: true,
		data: true
	};
	const localIds = /* @__PURE__ */ new Set();
	for (const field of fields) {
		const ref = asMediaRef(data[field.slug]);
		if (!ref) continue;
		if ((typeof ref.provider === "string" ? ref.provider : "local") === "local" && typeof ref.id === "string") localIds.add(ref.id);
	}
	const idList = [...localIds];
	const mimeById = /* @__PURE__ */ new Map();
	if (idList.length > 0) for (const batch of chunks(idList, 50)) {
		const rows = await db.selectFrom("media").select(["id", "mime_type"]).where("id", "in", batch).execute();
		for (const r of rows) mimeById.set(r.id, r.mime_type);
	}
	for (const field of fields) {
		const value = data[field.slug];
		if (value === null || value === void 0) continue;
		const ref = asMediaRef(value);
		if (!ref) continue;
		const provider = typeof ref.provider === "string" ? ref.provider : "local";
		let mime;
		if (provider === "local") {
			if (typeof ref.id !== "string") return fail(`Field '${field.slug}' references media with an invalid id`);
			mime = mimeById.get(ref.id);
			if (!mime) return fail(`Field '${field.slug}' references media with unknown MIME type`);
		} else {
			if (typeof ref.mimeType !== "string") return fail(`Field '${field.slug}' requires a mimeType declaration for non-local media`);
			mime = ref.mimeType;
		}
		if (!matchesMimeAllowlist(mime, field.allowedMimeTypes)) return fail(`Field '${field.slug}' does not accept ${mime}`);
	}
	return {
		success: true,
		data: true
	};
}
function hasApiError(error) {
	if (!(error instanceof Error) || !("apiError" in error)) return false;
	const { apiError } = error;
	return typeof apiError === "object" && apiError !== null && "code" in apiError && typeof apiError.code === "string";
}
function getSlugSource(data) {
	if (typeof data.title === "string" && data.title.length > 0) return data.title;
	if (typeof data.name === "string" && data.name.length > 0) return data.name;
	return null;
}
var SEO_DEFAULTS = {
	title: null,
	description: null,
	image: null,
	canonical: null,
	noIndex: false
};
async function collectionHasSeo(db, collection) {
	return (await db.selectFrom("_emdash_collections").select("has_seo").where("slug", "=", collection).executeTakeFirst())?.has_seo === 1;
}
async function hydrateSeo(db, collection, item, hasSeo) {
	if (!hasSeo) return;
	item.seo = await new SeoRepository(db).get(collection, item.id);
}
async function hydrateSeoMany(db, collection, items, hasSeo) {
	if (!hasSeo || items.length === 0) return;
	const seoMap = await new SeoRepository(db).getMany(collection, items.map((i) => i.id));
	for (const item of items) item.seo = seoMap.get(item.id) ?? { ...SEO_DEFAULTS };
}
async function hydrateBylines(db, collection, item) {
	const bylineRepo = new BylineRepository(db);
	const localeOpt = item.locale ? { locale: item.locale } : void 0;
	const bylines = await bylineRepo.getContentBylines(collection, item.id, localeOpt);
	if (bylines.length > 0) {
		item.bylines = bylines.map((c) => ({
			...c,
			source: "explicit"
		}));
		item.byline = bylines[0]?.byline ?? null;
		return;
	}
	if (item.primaryBylineId) {
		item.bylines = [];
		item.byline = null;
		return;
	}
	if (item.authorId) {
		const fallback = await bylineRepo.findByUserId(item.authorId, localeOpt);
		if (fallback) {
			item.bylines = [{
				byline: fallback,
				sortOrder: 0,
				roleLabel: null,
				source: "inferred"
			}];
			item.byline = fallback;
			return;
		}
	}
	item.bylines = [];
	item.byline = null;
}
async function hydrateBylinesMany(db, collection, items) {
	if (items.length === 0) return;
	const bylineRepo = new BylineRepository(db);
	const localeBuckets = /* @__PURE__ */ new Map();
	for (const item of items) {
		const key = item.locale ?? null;
		const bucket = localeBuckets.get(key);
		if (bucket) bucket.push(item);
		else localeBuckets.set(key, [item]);
	}
	const bylinesByItem = /* @__PURE__ */ new Map();
	const itemsNeedingAuthorCheck = [];
	for (const [locale, bucket] of localeBuckets) {
		const localeOpt = locale ? { locale } : void 0;
		const ids = bucket.map((i) => i.id);
		const credits = await bylineRepo.getContentBylinesMany(collection, ids, localeOpt);
		for (const [id, list] of credits) bylinesByItem.set(id, list);
		for (const item of bucket) {
			if (credits.has(item.id) && credits.get(item.id).length > 0) continue;
			if (item.authorId) itemsNeedingAuthorCheck.push(item);
		}
	}
	const fallbackByItem = /* @__PURE__ */ new Map();
	if (itemsNeedingAuthorCheck.length > 0) {
		const authorBuckets = /* @__PURE__ */ new Map();
		for (const item of itemsNeedingAuthorCheck) {
			if (item.primaryBylineId) continue;
			const key = item.locale ?? null;
			const bucket = authorBuckets.get(key);
			if (bucket) bucket.push(item);
			else authorBuckets.set(key, [item]);
		}
		for (const [locale, bucket] of authorBuckets) {
			const localeOpt = locale ? { locale } : void 0;
			const authorIds = bucket.map((i) => i.authorId).filter((id) => id !== null);
			const uniqueAuthorIds = [...new Set(authorIds)];
			if (uniqueAuthorIds.length === 0) continue;
			const authorMap = await bylineRepo.findByUserIds(uniqueAuthorIds, localeOpt);
			for (const item of bucket) {
				if (!item.authorId) continue;
				const f = authorMap.get(item.authorId);
				if (f) fallbackByItem.set(item.id, f);
			}
		}
	}
	for (const item of items) {
		const explicit = bylinesByItem.get(item.id);
		if (explicit && explicit.length > 0) {
			item.bylines = explicit.map((c) => ({
				...c,
				source: "explicit"
			}));
			item.byline = explicit[0]?.byline ?? null;
			continue;
		}
		const fallback = fallbackByItem.get(item.id);
		if (fallback) {
			item.bylines = [{
				byline: fallback,
				sortOrder: 0,
				roleLabel: null,
				source: "inferred"
			}];
			item.byline = fallback;
			continue;
		}
		item.bylines = [];
		item.byline = null;
	}
}
async function resolveId(repo, collection, identifier, locale) {
	return (await repo.findByIdOrSlug(collection, identifier, locale ? resolveConfiguredLocale(locale) : void 0))?.id ?? null;
}
async function resolveIdIncludingTrashed(repo, collection, identifier, locale) {
	return (await repo.findByIdOrSlugIncludingTrashed(collection, identifier, locale ? resolveConfiguredLocale(locale) : void 0))?.id ?? null;
}
async function resolveSearchColumns(db, collection) {
	const columns = ["slug"];
	const row = await db.selectFrom("_emdash_collections").select("id").where("slug", "=", collection).executeTakeFirst();
	if (!row) return columns;
	const fields = await db.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", row.id).execute();
	const fieldSlugs = new Set(fields.map((f) => f.slug));
	for (const candidate of ["title", "name"]) if (fieldSlugs.has(candidate)) columns.push(candidate);
	return columns;
}
async function canUseFtsForListFilter(db, collection, searchColumns) {
	if (!isSqlite(db)) return false;
	const ftsManager = new FTSManager(db);
	if (!(await ftsManager.getSearchConfig(collection))?.enabled) return false;
	const searchable = new Set(await ftsManager.getSearchableFields(collection));
	if (!searchColumns.every((col) => col === "slug" || searchable.has(col))) return false;
	return ftsManager.ftsTableExists(collection);
}
async function createSlugChangeRedirect(db, collection, oldSlug, newSlug, contentId) {
	const collectionRow = await db.selectFrom("_emdash_collections").select("url_pattern").where("slug", "=", collection).executeTakeFirst();
	await new RedirectRepository(db).createAutoRedirect(collection, oldSlug, newSlug, contentId, collectionRow?.url_pattern ?? null);
	invalidateRedirectCache();
}
var DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
function normalizeDateBound(value, edge) {
	if (!value) return void 0;
	if (!DATE_ONLY_RE.test(value)) return value;
	return edge === "start" ? `${value}T00:00:00.000Z` : `${value}T23:59:59.999Z`;
}
async function handleContentList(db, collection, params) {
	try {
		const repo = new ContentRepository(db);
		const where = {};
		if (params.status) where.status = params.status;
		if (params.locale) where.locale = resolveConfiguredLocale(params.locale);
		if (params.authorId) where.authorId = params.authorId;
		if (params.dateField && (params.dateFrom || params.dateTo)) where.dateFilter = {
			field: params.dateField,
			from: normalizeDateBound(params.dateFrom, "start"),
			to: normalizeDateBound(params.dateTo, "end")
		};
		const q = params.q?.trim();
		if (q) {
			where.q = q;
			where.searchColumns = await resolveSearchColumns(db, collection);
			where.useFts = await canUseFtsForListFilter(db, collection, where.searchColumns);
		}
		const result = await repo.findMany(collection, {
			cursor: params.cursor,
			limit: params.limit || 50,
			where: Object.keys(where).length > 0 ? where : void 0,
			orderBy: params.orderBy ? {
				field: params.orderBy,
				direction: params.order || "desc"
			} : void 0
		});
		const hasSeo = await collectionHasSeo(db, collection);
		await hydrateSeoMany(db, collection, result.items, hasSeo);
		await hydrateBylinesMany(db, collection, result.items);
		return {
			success: true,
			data: {
				items: result.items,
				nextCursor: result.nextCursor,
				total: result.total
			}
		};
	} catch (error) {
		if (error instanceof InvalidCursorError) return {
			success: false,
			error: {
				code: "INVALID_CURSOR",
				message: error.message
			}
		};
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		if (isMissingColumnError(error, "deleted_at")) return {
			success: false,
			error: {
				code: "COLLECTION_SCHEMA_MISMATCH",
				message: `Collection '${collection}' backing table is missing the 'deleted_at' column`
			}
		};
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content list error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_LIST_ERROR",
				message: "Failed to list content"
			}
		};
	}
}
async function handleContentAuthors(db, collection) {
	try {
		const authorIds = await new ContentRepository(db).findDistinctAuthorIds(collection);
		if (authorIds.length === 0) return {
			success: true,
			data: { items: [] }
		};
		return {
			success: true,
			data: { items: (await new UserRepository(db).findByIds(authorIds)).map((u) => ({
				id: u.id,
				name: u.name,
				email: u.email,
				avatarUrl: u.avatarUrl
			})).toSorted((a, b) => (a.name ?? a.email).localeCompare(b.name ?? b.email)) }
		};
	} catch (error) {
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		console.error("Content authors error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_AUTHORS_ERROR",
				message: "Failed to list content authors"
			}
		};
	}
}
async function handleContentGet(db, collection, id, locale) {
	try {
		const item = await new ContentRepository(db).findByIdOrSlug(collection, id, locale ? resolveConfiguredLocale(locale) : void 0);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		await hydrateBylines(db, collection, item);
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		console.error("Content get error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_GET_ERROR",
				message: "Failed to get content"
			}
		};
	}
}
async function handleContentGetIncludingTrashed(db, collection, id, locale) {
	try {
		const item = await new ContentRepository(db).findByIdOrSlugIncludingTrashed(collection, id, locale ? resolveConfiguredLocale(locale) : void 0);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		await hydrateBylines(db, collection, item);
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		console.error("Content get error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_GET_ERROR",
				message: "Failed to get content"
			}
		};
	}
}
async function handleContentCreate(db, collection, body) {
	try {
		const hasSeo = await collectionHasSeo(db, collection);
		if (body.seo && !hasSeo) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
			}
		};
		const mimeCheck = await validateMediaFields(db, collection, body.data);
		if (!mimeCheck.success) return mimeCheck;
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const bylineRepo = new BylineRepository(trx);
			const effectiveLocale = body.locale ? resolveConfiguredLocale(body.locale) : getI18nConfig()?.defaultLocale;
			let slug = body.slug;
			if (!slug) {
				const slugSource = getSlugSource(body.data);
				if (slugSource) slug = await repo.generateUniqueSlug(collection, slugSource, effectiveLocale);
			}
			const created = await repo.create({
				type: collection,
				slug,
				data: body.data,
				status: body.status || "draft",
				authorId: body.authorId,
				locale: effectiveLocale,
				translationOf: body.translationOf,
				createdAt: body.createdAt,
				publishedAt: body.publishedAt
			});
			if (body.bylines !== void 0) created.primaryBylineId = (await bylineRepo.setContentBylines(collection, created.id, body.bylines))[0]?.byline.translationGroup ?? null;
			if (body.translationOf) {
				await new TaxonomyRepository(trx).copyEntryTerms(collection, body.translationOf, created.id);
				if (body.bylines === void 0) {
					await bylineRepo.copyContentBylines(collection, body.translationOf, created.id);
					const source = await repo.findById(collection, body.translationOf);
					if (source) created.primaryBylineId = source.primaryBylineId;
				}
			}
			await hydrateBylines(trx, collection, created);
			if (body.seo && hasSeo) created.seo = await new SeoRepository(trx).upsert(collection, created.id, body.seo);
			else if (hasSeo) created.seo = { ...SEO_DEFAULTS };
			if (body.taxonomies) await assignTaxonomies(trx, collection, created.id, effectiveLocale, body.taxonomies);
			return created;
		});
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		const message = error instanceof Error ? error.message.toLowerCase() : "";
		if (message.includes("unique constraint failed") || message.includes("duplicate key")) {
			if (message.includes("slug")) return {
				success: false,
				error: {
					code: "SLUG_CONFLICT",
					message: `Slug '${body.slug ?? "(auto-generated)"}' already exists in collection '${collection}'`
				}
			};
			return {
				success: false,
				error: {
					code: "CONFLICT",
					message: "Unique constraint violation"
				}
			};
		}
		console.error("Content create error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_CREATE_ERROR",
				message: "Failed to create content"
			}
		};
	}
}
async function handleContentUpdate(db, collection, id, body) {
	try {
		const hasSeo = await collectionHasSeo(db, collection);
		if (body.seo && !hasSeo) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
			}
		};
		if (body.data) {
			const mimeCheck = await validateMediaFields(db, collection, body.data);
			if (!mimeCheck.success) return mimeCheck;
		}
		const resolvedId = await resolveId(new ContentRepository(db), collection, id, body.locale) ?? id;
		const item = await withTransaction(db, async (trx) => {
			const trxRepo = new ContentRepository(trx);
			const bylineRepo = new BylineRepository(trx);
			const existing = body._rev || body.slug ? await trxRepo.findById(collection, resolvedId) : null;
			if (body._rev) {
				if (!existing) throw Object.assign(/* @__PURE__ */ new Error(`Content item not found: ${id}`), { apiError: { code: "NOT_FOUND" } });
				const revCheck = validateRev(body._rev, existing);
				if (!revCheck.valid) throw Object.assign(new Error(revCheck.message), { apiError: { code: "CONFLICT" } });
			}
			let oldSlug;
			if (body.slug && existing?.slug && existing.slug !== body.slug) oldSlug = existing.slug;
			const updated = await trxRepo.update(collection, resolvedId, {
				data: body.data,
				slug: body.slug,
				status: body.status,
				authorId: body.authorId,
				publishedAt: body.publishedAt
			});
			if (body.bylines !== void 0) updated.primaryBylineId = (await bylineRepo.setContentBylines(collection, resolvedId, body.bylines))[0]?.byline.translationGroup ?? null;
			if (oldSlug && body.slug) await createSlugChangeRedirect(trx, collection, oldSlug, body.slug, resolvedId);
			if (isI18nEnabled() && body.data && updated.translationGroup) await syncNonTranslatableFields(trx, collection, updated.id, updated.translationGroup, body.data);
			if (body.seo && hasSeo) updated.seo = await new SeoRepository(trx).upsert(collection, resolvedId, body.seo);
			else if (hasSeo) updated.seo = await new SeoRepository(trx).get(collection, resolvedId);
			await hydrateBylines(trx, collection, updated);
			if (body.taxonomies) await assignTaxonomies(trx, collection, resolvedId, updated.locale ?? body.locale, body.taxonomies);
			return updated;
		});
		return {
			success: true,
			data: {
				item,
				_rev: encodeRev(item)
			}
		};
	} catch (error) {
		if (hasApiError(error)) return {
			success: false,
			error: {
				code: error.apiError.code,
				message: error.message
			}
		};
		if (isMissingTableError(error)) return {
			success: false,
			error: {
				code: "COLLECTION_NOT_FOUND",
				message: `Collection '${collection}' not found`
			}
		};
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		const message = error instanceof Error ? error.message.toLowerCase() : "";
		if (message.includes("unique constraint failed") || message.includes("duplicate key")) {
			if (message.includes("slug")) return {
				success: false,
				error: {
					code: "SLUG_CONFLICT",
					message: `Slug '${body.slug ?? id}' already exists in collection '${collection}'`
				}
			};
			return {
				success: false,
				error: {
					code: "CONFLICT",
					message: "Unique constraint violation"
				}
			};
		}
		console.error("Content update error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_UPDATE_ERROR",
				message: "Failed to update content"
			}
		};
	}
}
async function handleContentDuplicate(db, collection, id, authorId) {
	try {
		const hasSeo = await collectionHasSeo(db, collection);
		return {
			success: true,
			data: { item: await withTransaction(db, async (trx) => {
				const repo = new ContentRepository(trx);
				const bylineRepo = new BylineRepository(trx);
				const resolvedId = await resolveId(repo, collection, id) ?? id;
				const dup = await repo.duplicate(collection, resolvedId, authorId);
				const existingBylines = await bylineRepo.getContentBylines(collection, resolvedId);
				if (existingBylines.length > 0) await bylineRepo.setContentBylines(collection, dup.id, existingBylines.map((entry) => ({
					bylineId: entry.byline.id,
					roleLabel: entry.roleLabel
				})));
				if (hasSeo) {
					const seoRepo = new SeoRepository(trx);
					await seoRepo.copyForDuplicate(collection, resolvedId, dup.id);
					dup.seo = await seoRepo.get(collection, dup.id);
				}
				await hydrateBylines(trx, collection, dup);
				return dup;
			}) }
		};
	} catch (err) {
		if (err instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: err.message
			}
		};
		console.error("Content duplicate error:", err);
		return {
			success: false,
			error: {
				code: "CONTENT_DUPLICATE_ERROR",
				message: "Failed to duplicate content"
			}
		};
	}
}
async function handleContentDelete(db, collection, id) {
	try {
		const result = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return {
				id: resolvedId,
				deleted: await repo.delete(collection, resolvedId)
			};
		});
		if (!result.deleted) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				deleted: true,
				id: result.id
			}
		};
	} catch (error) {
		console.error("Content delete error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_DELETE_ERROR",
				message: "Failed to delete content"
			}
		};
	}
}
async function handleContentRestore(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveIdIncludingTrashed(repo, collection, id) ?? id;
			return repo.restore(collection, resolvedId);
		});
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Trashed content item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				restored: true,
				item
			}
		};
	} catch (error) {
		console.error("Content restore error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_RESTORE_ERROR",
				message: "Failed to restore content"
			}
		};
	}
}
async function handleContentPermanentDelete(db, collection, id) {
	try {
		const resolvedId = await resolveIdIncludingTrashed(new ContentRepository(db), collection, id) ?? id;
		if (!await withTransaction(db, async (trx) => {
			const wasDeleted = await new ContentRepository(trx).permanentDelete(collection, resolvedId);
			if (wasDeleted) {
				await new SeoRepository(trx).delete(collection, resolvedId);
				await new CommentRepository(trx).deleteByContent(collection, resolvedId);
				await new RevisionRepository(trx).deleteByEntry(collection, resolvedId);
			}
			return wasDeleted;
		})) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				deleted: true,
				id: resolvedId
			}
		};
	} catch (error) {
		console.error("Content permanent delete error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_DELETE_ERROR",
				message: "Failed to permanently delete content"
			}
		};
	}
}
async function handleContentListTrashed(db, collection, options = {}) {
	try {
		const result = await new ContentRepository(db).findTrashed(collection, {
			limit: options.limit,
			cursor: options.cursor
		});
		return {
			success: true,
			data: {
				items: result.items.map((item) => ({
					id: item.id,
					type: item.type,
					slug: item.slug,
					status: item.status,
					data: item.data,
					authorId: item.authorId,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
					publishedAt: item.publishedAt,
					deletedAt: item.deletedAt
				})),
				nextCursor: result.nextCursor
			}
		};
	} catch (error) {
		if (error instanceof InvalidCursorError) return {
			success: false,
			error: {
				code: "INVALID_CURSOR",
				message: error.message
			}
		};
		console.error("Content list trashed error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_LIST_ERROR",
				message: "Failed to list trashed content"
			}
		};
	}
}
async function handleContentCountTrashed(db, collection) {
	try {
		return {
			success: true,
			data: { count: await new ContentRepository(db).countTrashed(collection) }
		};
	} catch (error) {
		console.error("Content count trashed error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_COUNT_ERROR",
				message: "Failed to count trashed content"
			}
		};
	}
}
async function handleContentSchedule(db, collection, id, scheduledAt) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.schedule(collection, resolvedId, scheduledAt);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content schedule error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_SCHEDULE_ERROR",
				message: "Failed to schedule content"
			}
		};
	}
}
async function handleContentUnschedule(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.unschedule(collection, resolvedId);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content unschedule error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_UNSCHEDULE_ERROR",
				message: "Failed to unschedule content"
			}
		};
	}
}
async function handleContentPublish(db, collection, id, options = {}) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			const existing = await repo.findById(collection, resolvedId);
			const published = await repo.publish(collection, resolvedId, options.publishedAt, options.requireScheduledDue);
			if (existing?.status === "published" && existing.slug && published.slug && existing.slug !== published.slug) await createSlugChangeRedirect(trx, collection, existing.slug, published.slug, resolvedId);
			return published;
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof ScheduledNotDueError) return {
			success: false,
			error: {
				code: "NOT_DUE",
				message: error.message
			}
		};
		if (error instanceof EmDashValidationError) {
			const details = error.details;
			return {
				success: false,
				error: {
					code: typeof details === "object" && details !== null && "code" in details && details.code === "SLUG_CONFLICT" ? "SLUG_CONFLICT" : "VALIDATION_ERROR",
					message: error.message
				}
			};
		}
		const message = error instanceof Error ? error.message.toLowerCase() : "";
		if ((message.includes("unique constraint failed") || message.includes("duplicate key")) && message.includes("slug")) return {
			success: false,
			error: {
				code: "SLUG_CONFLICT",
				message: `The staged slug is already used by another entry in collection '${collection}'`
			}
		};
		console.error("Content publish error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_PUBLISH_ERROR",
				message: "Failed to publish content"
			}
		};
	}
}
async function handleContentUnpublish(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.unpublish(collection, resolvedId);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error.message
			}
		};
		console.error("Content unpublish error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_UNPUBLISH_ERROR",
				message: "Failed to unpublish content"
			}
		};
	}
}
async function handleContentCountScheduled(db, collection) {
	try {
		return {
			success: true,
			data: { count: await new ContentRepository(db).countScheduled(collection) }
		};
	} catch (error) {
		console.error("Content count scheduled error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_COUNT_ERROR",
				message: "Failed to count scheduled content"
			}
		};
	}
}
async function handleContentDiscardDraft(db, collection, id) {
	try {
		const item = await withTransaction(db, async (trx) => {
			const repo = new ContentRepository(trx);
			const resolvedId = await resolveId(repo, collection, id) ?? id;
			return repo.discardDraft(collection, resolvedId);
		});
		await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
		return {
			success: true,
			data: { item }
		};
	} catch (error) {
		if (error instanceof EmDashValidationError) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: error.message
			}
		};
		console.error("Content discard draft error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_DISCARD_DRAFT_ERROR",
				message: "Failed to discard draft"
			}
		};
	}
}
async function handleContentCompare(db, collection, id) {
	try {
		const entry = await new ContentRepository(db).findByIdOrSlug(collection, id);
		if (!entry) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		const revisionRepo = new RevisionRepository(db);
		const live = entry.liveRevisionId ? await revisionRepo.findById(entry.liveRevisionId) : null;
		const draft = entry.draftRevisionId ? await revisionRepo.findById(entry.draftRevisionId) : null;
		return {
			success: true,
			data: {
				hasChanges: entry.draftRevisionId !== null && entry.draftRevisionId !== entry.liveRevisionId,
				live: live?.data ?? null,
				draft: draft?.data ?? null
			}
		};
	} catch (error) {
		console.error("Content compare error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_COMPARE_ERROR",
				message: "Failed to compare revisions"
			}
		};
	}
}
async function handleContentTranslations(db, collection, id) {
	try {
		const repo = new ContentRepository(db);
		const item = await repo.findByIdOrSlug(collection, id);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Content item not found: ${id}`
			}
		};
		if (!item.translationGroup) return {
			success: true,
			data: {
				translationGroup: item.id,
				translations: [{
					id: item.id,
					locale: item.locale,
					slug: item.slug,
					status: item.status,
					updatedAt: item.updatedAt
				}]
			}
		};
		const translations = await repo.findTranslations(collection, item.translationGroup);
		return {
			success: true,
			data: {
				translationGroup: item.translationGroup,
				translations: translations.map((t) => ({
					id: t.id,
					locale: t.locale,
					slug: t.slug,
					status: t.status,
					updatedAt: t.updatedAt
				}))
			}
		};
	} catch (error) {
		if (error instanceof Error) console.error("Content translations error:", error);
		return {
			success: false,
			error: {
				code: "CONTENT_TRANSLATIONS_ERROR",
				message: "Failed to get translations"
			}
		};
	}
}
async function syncNonTranslatableFields(trx, collectionSlug, updatedItemId, translationGroup, data) {
	const collection = await trx.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
	if (!collection) return;
	const nonTranslatableSlugs = (await trx.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("translatable", "=", 0).execute()).map((f) => f.slug);
	if (nonTranslatableSlugs.length === 0) return;
	const syncData = {};
	for (const slug of nonTranslatableSlugs) if (slug in data) syncData[slug] = data[slug];
	if (Object.keys(syncData).length === 0) return;
	validateIdentifier(collectionSlug, "collection slug");
	const tableName = `ec_${collectionSlug}`;
	const setClauses = Object.entries(syncData).map(([key, value]) => {
		validateIdentifier(key, "field slug");
		const serialized = typeof value === "object" && value !== null ? JSON.stringify(value) : value;
		return sql`${sql.ref(key)} = ${serialized}`;
	});
	await sql`
		UPDATE ${sql.ref(tableName)}
		SET ${sql.join(setClauses, sql`, `)}
		WHERE translation_group = ${translationGroup}
		AND id != ${updatedItemId}
	`.execute(trx);
}
async function assignTaxonomies(trx, collection, entryId, locale, taxonomies) {
	const taxRepo = new TaxonomyRepository(trx);
	let anyChange = false;
	for (const [taxonomyName, slugs] of Object.entries(taxonomies)) {
		if (!Array.isArray(slugs)) throw new EmDashValidationError(`taxonomies.${taxonomyName} must be an array of term slugs`);
		const termIds = [];
		for (const slug of slugs) {
			if (typeof slug !== "string" || slug.length === 0) throw new EmDashValidationError(`taxonomies.${taxonomyName} contains a non-string or empty slug`);
			const term = await taxRepo.findBySlug(taxonomyName, slug, locale);
			if (!term) throw new EmDashValidationError(`Unknown taxonomy term: ${taxonomyName}='${slug}'${locale ? ` (locale '${locale}')` : ""}`);
			termIds.push(term.id);
		}
		await taxRepo.setTermsForEntry(collection, entryId, taxonomyName, termIds);
		anyChange = true;
	}
	if (anyChange) invalidateTermCache();
}
async function handleRevisionList(db, collection, entryId, params = {}) {
	try {
		const repo = new RevisionRepository(db);
		const [items, total] = await Promise.all([repo.findByEntry(collection, entryId, { limit: Math.min(params.limit || 50, 100) }), repo.countByEntry(collection, entryId)]);
		return {
			success: true,
			data: {
				items,
				total
			}
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REVISION_LIST_ERROR",
				message: "Failed to list revisions"
			}
		};
	}
}
async function handleRevisionGet(db, revisionId) {
	try {
		const item = await new RevisionRepository(db).findById(revisionId);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Revision not found: ${revisionId}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REVISION_GET_ERROR",
				message: "Failed to get revision"
			}
		};
	}
}
async function handleRevisionRestore(db, revisionId, callerUserId) {
	try {
		const revision = await new RevisionRepository(db).findById(revisionId);
		if (!revision) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Revision not found: ${revisionId}`
			}
		};
		const { _slug, ...fieldData } = revision.data;
		const item = await withTransaction(db, async (trx) => {
			const trxContentRepo = new ContentRepository(trx);
			const trxRevisionRepo = new RevisionRepository(trx);
			const updated = await trxContentRepo.update(revision.collection, revision.entryId, {
				data: fieldData,
				slug: typeof _slug === "string" ? _slug : void 0
			});
			await trxRevisionRepo.create({
				collection: revision.collection,
				entryId: revision.entryId,
				data: revision.data,
				authorId: callerUserId
			});
			return updated;
		});
		new RevisionRepository(db).pruneOldRevisions(revision.collection, revision.entryId, 50).catch(() => {});
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REVISION_RESTORE_ERROR",
				message: "Failed to restore revision"
			}
		};
	}
}
async function handleMediaList(db, params) {
	try {
		const result = await new MediaRepository(db).findMany({
			cursor: params.cursor,
			limit: Math.min(params.limit || 50, 100),
			mimeType: params.mimeType,
			q: params.q
		});
		return {
			success: true,
			data: {
				items: result.items,
				nextCursor: result.nextCursor
			}
		};
	} catch (error) {
		if (error instanceof InvalidCursorError) return {
			success: false,
			error: {
				code: "INVALID_CURSOR",
				message: error.message
			}
		};
		return {
			success: false,
			error: {
				code: "MEDIA_LIST_ERROR",
				message: "Failed to list media"
			}
		};
	}
}
async function handleMediaGet(db, id) {
	try {
		const item = await new MediaRepository(db).findById(id);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Media item not found: ${id}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_GET_ERROR",
				message: "Failed to get media"
			}
		};
	}
}
async function handleMediaCreate(db, input) {
	try {
		return {
			success: true,
			data: { item: await new MediaRepository(db).create(input) }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_CREATE_ERROR",
				message: "Failed to create media"
			}
		};
	}
}
async function handleMediaUpdate(db, id, input) {
	try {
		const item = await new MediaRepository(db).update(id, input);
		if (!item) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Media item not found: ${id}`
			}
		};
		return {
			success: true,
			data: { item }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_UPDATE_ERROR",
				message: "Failed to update media"
			}
		};
	}
}
async function handleMediaDelete(db, id) {
	try {
		const storageKey = await new MediaRepository(db).deleteWithStorageKey(id);
		if (!storageKey) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Media item not found: ${id}`
			}
		};
		return {
			success: true,
			data: {
				deleted: true,
				storageKey
			}
		};
	} catch {
		return {
			success: false,
			error: {
				code: "MEDIA_DELETE_ERROR",
				message: "Failed to delete media"
			}
		};
	}
}
var VERSION_PATTERN = /^[a-z0-9][a-z0-9._+-]*$/i;
function validateVersion(version) {
	if (version.includes("..")) throw new Error("Invalid version format");
	if (!VERSION_PATTERN.test(version)) throw new Error("Invalid version format");
}
function bundlePrefix(source, pluginId, version) {
	return `${source}/${pluginId}/${version}`;
}
async function streamToText(stream) {
	return new Response(stream).text();
}
async function loadBundleFromR2(storage, pluginId, version, source = "marketplace") {
	validatePluginIdentifier(pluginId, "plugin ID");
	validateVersion(version);
	const prefix = bundlePrefix(source, pluginId, version);
	try {
		const manifestResult = await storage.download(`${prefix}/manifest.json`);
		const backendResult = await storage.download(`${prefix}/backend.js`);
		const manifestText = await streamToText(manifestResult.body);
		const backendCode = await streamToText(backendResult.body);
		const parsed = JSON.parse(manifestText);
		const result = pluginManifestSchema.safeParse(parsed);
		if (!result.success) return null;
		const manifest = reconcileManifestAccess(result.data);
		let adminCode;
		try {
			adminCode = await streamToText((await storage.download(`${prefix}/admin.js`)).body);
		} catch {}
		return {
			manifest,
			backendCode,
			adminCode
		};
	} catch {
		return null;
	}
}
var DURATION_PATTERN = /^(\d+)(s|m|h|d|w)$/;
var TRAILING_SLASHES$2 = /\/+$/;
var TRAILING_DOT$1 = /\.$/;
function parseDurationSeconds(duration) {
	if (typeof duration === "number") {
		if (!Number.isFinite(duration) || duration < 0) throw new Error(`Invalid duration: ${duration} (must be a non-negative finite number)`);
		return Math.floor(duration);
	}
	const match = duration.match(DURATION_PATTERN);
	if (!match) throw new Error(`Invalid duration format: "${duration}". Use a duration string like "48h", "7d", "30m", or a number of seconds.`);
	const value = parseInt(match[1], 10);
	const unit = match[2];
	switch (unit) {
		case "s": return value;
		case "m": return value * 60;
		case "h": return value * 60 * 60;
		case "d": return value * 24 * 60 * 60;
		case "w": return value * 7 * 24 * 60 * 60;
		default: throw new Error(`Unknown duration unit: ${unit}`);
	}
}
function validateAggregatorUrl(aggregatorUrl) {
	let parsed;
	try {
		parsed = new URL(aggregatorUrl);
	} catch {
		throw new Error(`registry.aggregatorUrl is not a valid URL: ${aggregatorUrl}`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`registry.aggregatorUrl must use http or https: ${aggregatorUrl}`);
	if (parsed.username || parsed.password) throw new Error("registry.aggregatorUrl must not contain embedded credentials (user:pass@)");
	const rawHostname = parsed.hostname.toLowerCase().replace(TRAILING_DOT$1, "");
	const hostname = rawHostname.startsWith("[") && rawHostname.endsWith("]") ? rawHostname.slice(1, -1) : rawHostname;
	const isLocalhost = hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "127.0.0.1" || hostname === "::1" || hostname.startsWith("::ffff:127.") || hostname.startsWith("::ffff:7f00:");
	if (parsed.protocol === "http:") throw new Error(`registry.aggregatorUrl must use https in production: ${aggregatorUrl}`);
	if (isLocalhost) throw new Error(`registry.aggregatorUrl points at localhost; allowed only in dev: ${aggregatorUrl}`);
	return parsed;
}
function coerceRegistryConfig(input) {
	if (input === void 0) return void 0;
	if (typeof input === "string") return { aggregatorUrl: input };
	return input;
}
function normalizeRegistryConfig(input) {
	const config = coerceRegistryConfig(input);
	if (!config) return null;
	const aggregatorUrl = config.aggregatorUrl?.trim();
	if (!aggregatorUrl) throw new Error("registry.aggregatorUrl is required when registry is configured");
	validateAggregatorUrl(aggregatorUrl);
	const out = { aggregatorUrl: aggregatorUrl.replace(TRAILING_SLASHES$2, "") };
	if (config.acceptLabelers) out.acceptLabelers = config.acceptLabelers;
	const policy = {};
	let hasPolicy = false;
	if (config.policy?.minimumReleaseAge !== void 0) {
		policy.minimumReleaseAgeSeconds = parseDurationSeconds(config.policy.minimumReleaseAge);
		hasPolicy = true;
	}
	if (config.policy?.minimumReleaseAgeExclude !== void 0) {
		const list = config.policy.minimumReleaseAgeExclude.map((entry) => {
			const trimmed = entry.trim();
			if (!trimmed) throw new Error("registry.policy.minimumReleaseAgeExclude entries cannot be empty");
			return trimmed.toLowerCase();
		});
		if (list.length > 0) {
			policy.minimumReleaseAgeExclude = list;
			hasPolicy = true;
		}
	}
	if (hasPolicy) out.policy = policy;
	return out;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/error-DmmN74gW.mjs
/**
* Standardized API error responses.
*
* All API routes should use these utilities instead of inline
* `new Response(JSON.stringify({ error: ... }), ...)` patterns.
*/
/**
* Standard cache headers for all API responses.
*
* Cache-Control: private, no-store -- prevents CDN/proxy caching of authenticated data.
* no-store already tells caches not to store the response, so Vary is unnecessary.
*/
var API_CACHE_HEADERS = { "Cache-Control": "private, no-store" };
/**
* Create a standardized error response.
*
* Always returns `{ success: false, error: { code, message } }` with correct
* Content-Type. Use this for all error responses in API routes.
*/
function apiError(code, message, status, details) {
	const error = {
		code,
		message
	};
	if (details !== void 0) error.details = details;
	return Response.json({
		success: false,
		error
	}, {
		status,
		headers: API_CACHE_HEADERS
	});
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/relations-C4duJnwI.mjs
var authenticatorTransport$1 = _enum([
	"usb",
	"nfc",
	"ble",
	"internal",
	"hybrid"
]);
/** RegistrationResponse — sent by the browser after navigator.credentials.create() */
var registrationCredential$1 = object({
	id: string(),
	rawId: string(),
	type: literal("public-key"),
	response: object({
		clientDataJSON: string(),
		attestationObject: string(),
		transports: array(authenticatorTransport$1).optional()
	}),
	authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
/** AuthenticationResponse — sent by the browser after navigator.credentials.get() */
var authenticationCredential = object({
	id: string(),
	rawId: string(),
	type: literal("public-key"),
	response: object({
		clientDataJSON: string(),
		authenticatorData: string(),
		signature: string(),
		userHandle: string().optional()
	}),
	authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
object({ email: string().email() }).meta({ id: "SignupRequestBody" });
object({
	token: string().min(1),
	credential: registrationCredential$1,
	name: string().optional()
}).meta({ id: "SignupCompleteBody" });
object({
	email: string().email(),
	role: roleLevel.optional()
}).meta({ id: "InviteCreateBody" });
object({
	token: string().min(1),
	name: string().optional()
}).meta({ id: "InviteRegisterOptionsBody" });
object({
	token: string().min(1),
	credential: registrationCredential$1,
	name: string().optional()
}).meta({ id: "InviteCompleteBody" });
object({ email: string().email() }).meta({ id: "MagicLinkSendBody" });
object({ email: string().email().optional() }).meta({ id: "PasskeyOptionsBody" });
object({ credential: authenticationCredential }).meta({ id: "PasskeyVerifyBody" });
object({ name: string().optional() }).meta({ id: "PasskeyRegisterOptionsBody" });
object({
	credential: registrationCredential$1,
	name: string().optional()
}).meta({ id: "PasskeyRegisterVerifyBody" });
object({ name: string().min(1) }).meta({ id: "PasskeyRenameBody" });
object({ action: string().min(1) }).meta({ id: "AuthMeActionBody" });
object({ url: httpUrl });
object({
	url: httpUrl,
	token: string().min(1)
});
object({
	url: httpUrl,
	token: string().min(1),
	config: record(string(), unknown()),
	phase: _enum([
		"content",
		"comments",
		"finalize"
	]).optional(),
	cursor: object({
		postTypeIndex: number$1().int().min(0).default(0),
		page: number$1().int().min(1).default(1)
	}).optional(),
	idMap: record(string(), object({
		id: string().min(1),
		collection: string().min(1)
	})).optional(),
	translationGroups: record(string(), string().min(1)).optional(),
	commentRoots: record(string(), string().min(1)).optional()
});
object({ postTypes: array(object({
	name: string().min(1),
	collection: string().min(1),
	fields: array(object({
		slug: string().min(1),
		label: string().min(1),
		type: string().min(1),
		required: boolean$1(),
		searchable: boolean$1().optional()
	})).optional()
})) });
object({
	attachments: array(record(string(), unknown())),
	stream: boolean$1().optional()
});
object({
	urlMap: record(string(), string()),
	collections: array(string()).optional()
});
/** Registration credential — duplicated reference for setup flow.
*  The canonical definition lives in auth.ts but setup needs it independently
*  because setup runs before auth is configured. */
var authenticatorTransport = _enum([
	"usb",
	"nfc",
	"ble",
	"internal",
	"hybrid"
]);
var registrationCredential = object({
	id: string(),
	rawId: string(),
	type: literal("public-key"),
	response: object({
		clientDataJSON: string(),
		attestationObject: string(),
		transports: array(authenticatorTransport).optional()
	}),
	authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
object({
	title: string().min(1),
	tagline: string().optional(),
	includeContent: boolean$1()
});
object({
	email: string().email(),
	name: string().optional()
});
object({ credential: registrationCredential });
object({ handle: string().trim().min(1) });
object({ handle: string().trim().min(1) });
/**
* Zod schemas for the byline-fields admin API (Discussion #1174, Phase 4).
*
* Reserved-slug + identifier validation runs at the zod layer so the
* route returns a clean 400 (`VALIDATION_ERROR` from `parseBody`) rather
* than bubbling a registry-level `BylineSchemaError` ("RESERVED_SLUG" /
* "INVALID_SLUG"). The registry repeats the same checks for non-HTTP
* callers (seeds, scripts) — see `BylineSchemaRegistry.validateSlug`.
*
* Field types are constrained to the v1 subset declared in
* `BYLINE_FIELD_TYPES`. Adding a type to the union there will require a
* corresponding update to this enum.
*/
/**
* Slug pattern for byline field definitions — matches the identifier rule
* used by `validateIdentifier` (and `slugPattern` in `common.ts`).
* Lowercase letters, digits, and underscores; must start with a letter.
*/
var bylineFieldSlugPattern = /^[a-z][a-z0-9_]*$/;
/** Hard cap on a slug — mirrors `BylineSchemaRegistry.MAX_SLUG_LENGTH`. */
var MAX_SLUG_LENGTH = 63;
/** Hard cap on a label — mirrors `BylineSchemaRegistry.MAX_LABEL_LENGTH`. */
var MAX_LABEL_LENGTH = 200;
/** Hard cap on a select field's `options` list. */
var MAX_SELECT_OPTIONS = 200;
var RESERVED_SET = new Set(RESERVED_BYLINE_FIELD_SLUGS);
var bylineFieldTypeValues = _enum([
	"string",
	"text",
	"url",
	"boolean",
	"select"
]);
/**
* Validation payload for a byline custom field. v1 only exposes
* `options` (used by `select`-type fields). Empty/duplicate options are
* rejected at the registry layer; the zod layer only enforces shape and
* caps. Future field types may add keys here.
*/
var bylineFieldValidationSchema = object({ options: array(string().min(1)).min(1, "select options must contain at least one entry").max(MAX_SELECT_OPTIONS, `select options cannot exceed ${MAX_SELECT_OPTIONS} entries`).optional() }).strict().nullable();
/**
* Slug validation chain shared by create + reorder bodies. Centralised so
* the reserved-slug message and pattern are identical everywhere.
*/
var bylineFieldSlug = string().min(1, "Byline field slug is required").max(MAX_SLUG_LENGTH, `Byline field slug must be ${MAX_SLUG_LENGTH} characters or less`).regex(bylineFieldSlugPattern, "Byline field slug must contain only lowercase letters, digits, and underscores, and start with a letter").refine((slug) => !RESERVED_SET.has(slug), { message: "Byline field slug is reserved" });
var bylineFieldLabel = string().min(1, "Byline field label is required").max(MAX_LABEL_LENGTH, `Byline field label must be ${MAX_LABEL_LENGTH} characters or less`);
object({
	slug: bylineFieldSlug,
	label: bylineFieldLabel,
	type: bylineFieldTypeValues,
	required: boolean$1().optional(),
	translatable: boolean$1().optional(),
	validation: bylineFieldValidationSchema.optional(),
	sortOrder: number$1().int().min(0).optional()
}).strict().meta({ id: "BylineFieldCreateBody" });
object({
	label: bylineFieldLabel.optional(),
	required: boolean$1().optional(),
	translatable: boolean$1().optional(),
	validation: bylineFieldValidationSchema.optional(),
	sortOrder: number$1().int().min(0).optional()
}).strict().meta({ id: "BylineFieldUpdateBody" });
object({ slugs: array(bylineFieldSlug) }).strict().meta({ id: "BylineFieldReorderBody" });
var bylineFieldDefinitionSchema = object({
	id: string(),
	slug: string(),
	label: string(),
	type: bylineFieldTypeValues,
	required: boolean$1(),
	translatable: boolean$1(),
	validation: object({ options: array(string()).optional() }).nullable(),
	sortOrder: number$1().int(),
	createdAt: string(),
	updatedAt: string()
}).meta({ id: "BylineFieldDefinition" });
object({ items: array(bylineFieldDefinitionSchema) }).meta({ id: "BylineFieldListResponse" });
object({
	translatableValueCount: number$1().int().nonnegative(),
	groupValueCount: number$1().int().nonnegative(),
	totalAffectedRows: number$1().int().nonnegative()
}).meta({ id: "BylineFieldUsageResponse" });
var slugPattern = /^[a-z][a-z0-9_]*$/;
var collectionSlug = string().min(1).max(63).regex(slugPattern, "Invalid collection slug format");
object({
	name: string().min(1).max(63).regex(slugPattern, "Name must be lowercase alphanumeric with underscores"),
	parentCollection: collectionSlug.optional(),
	childCollection: collectionSlug.optional(),
	parentLabel: string().min(1).max(200),
	childLabel: string().min(1).max(200),
	locale: localeCode.optional(),
	translationOf: string().min(1).optional()
}).refine((body) => body.translationOf !== void 0 || body.parentCollection !== void 0 && body.childCollection !== void 0, { message: "parentCollection and childCollection are required unless translationOf is set" }).meta({ id: "CreateRelationBody" });
object({
	parentLabel: string().min(1).max(200).optional(),
	childLabel: string().min(1).max(200).optional()
}).refine((body) => body.parentLabel !== void 0 || body.childLabel !== void 0, { message: "At least one of parentLabel or childLabel is required" }).meta({ id: "UpdateRelationBody" });
object({ childIds: array(string().min(1)).max(1e3) }).meta({ id: "SetReferenceChildrenBody" });
var relationDefSchema = object({
	id: string(),
	name: string(),
	parentCollection: string(),
	childCollection: string(),
	parentLabel: string(),
	childLabel: string(),
	locale: string(),
	translationGroup: string()
}).meta({ id: "RelationDef" });
object({ relations: array(relationDefSchema) }).meta({ id: "RelationListResponse" });
object({ relation: relationDefSchema }).meta({ id: "RelationResponse" });
object({
	translationGroup: string(),
	translations: array(object({
		id: string(),
		name: string(),
		locale: string(),
		parentLabel: string(),
		childLabel: string()
	}))
}).meta({ id: "RelationTranslations" });
var entryRefSchema = object({
	id: string(),
	slug: string().nullable(),
	collection: string(),
	locale: string().nullable(),
	sortOrder: number$1().int().optional()
}).meta({ id: "ReferenceEntryRef" });
object({
	children: array(entryRefSchema),
	nextCursor: string().optional()
}).meta({ id: "ReferenceChildrenResponse" });
object({
	parents: array(entryRefSchema),
	nextCursor: string().optional()
}).meta({ id: "ReferenceParentsResponse" });
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/utils-BbUgmeZG.mjs
/** Internal WordPress post types that should be excluded from import */
var INTERNAL_POST_TYPES = [
	"revision",
	"nav_menu_item",
	"custom_css",
	"customize_changeset",
	"oembed_cache",
	"wp_global_styles",
	"wp_navigation",
	"wp_template",
	"wp_template_part",
	"attachment",
	"wp_block"
];
/** Internal meta key prefixes to filter out */
var INTERNAL_META_PREFIXES = ["_edit_", "_wp_"];
var NUMERIC_PATTERN = /^-?\d+(\.\d+)?$/;
var TRAILING_SLASHES$1 = /\/+$/;
var WP_JSON_SUFFIX$1 = /\/wp-json\/?.*$/;
/** Specific internal meta keys */
var INTERNAL_META_KEYS = [
	"_edit_last",
	"_edit_lock",
	"_pingme",
	"_encloseme"
];
/** Base fields required for any WordPress import */
var BASE_REQUIRED_FIELDS = [
	{
		slug: "title",
		label: "Title",
		type: "string",
		required: true,
		searchable: true
	},
	{
		slug: "content",
		label: "Content",
		type: "portableText",
		required: false,
		searchable: true
	},
	{
		slug: "excerpt",
		label: "Excerpt",
		type: "text",
		required: false
	}
];
/** Featured image field - only added to post types that have _thumbnail_id */
var FEATURED_IMAGE_FIELD = {
	slug: "featured_image",
	label: "Featured Image",
	type: "image",
	required: false
};
/**
* Check if a post type is internal/should be excluded
*/
function isInternalPostType(type) {
	return INTERNAL_POST_TYPES.includes(type);
}
/**
* Check if a meta key is internal/should be filtered out
*/
function isInternalMetaKey(key) {
	if (INTERNAL_META_KEYS.includes(key)) return true;
	for (const prefix of INTERNAL_META_PREFIXES) if (key.startsWith(prefix)) return true;
	if (key === "_thumbnail_id") return false;
	if (key.startsWith("_yoast_")) return false;
	if (key.startsWith("_rank_math_")) return false;
	if (key.startsWith("_")) return true;
	return false;
}
/**
* Map WordPress status to normalized status
*/
function mapWpStatus(status) {
	switch (status) {
		case "publish": return "publish";
		case "draft": return "draft";
		case "pending": return "pending";
		case "private": return "private";
		case "future": return "future";
		default: return "draft";
	}
}
/** Default mappings from WordPress post types to EmDash collections */
var POST_TYPE_TO_COLLECTION = {
	post: "posts",
	page: "pages",
	attachment: "media",
	product: "products",
	portfolio: "portfolio",
	testimonial: "testimonials",
	team: "team",
	event: "events",
	faq: "faqs"
};
/**
* Map WordPress post type to EmDash collection name
*/
function mapPostTypeToCollection(postType) {
	return POST_TYPE_TO_COLLECTION[postType] || postType;
}
/**
* Map WordPress meta key to EmDash field slug
*/
function mapMetaKeyToField(key) {
	if (key === "_yoast_wpseo_title") return "seo_title";
	if (key === "_yoast_wpseo_metadesc") return "seo_description";
	if (key === "_rank_math_title") return "seo_title";
	if (key === "_rank_math_description") return "seo_description";
	if (key === "_thumbnail_id") return "featured_image";
	if (key.startsWith("_")) return key.slice(1);
	return key;
}
/**
* Infer field type from meta key name and sample value
*/
function inferMetaType(key, value) {
	if (key.endsWith("_id") || key === "_thumbnail_id") return "string";
	if (key.endsWith("_date") || key.endsWith("_time")) return "date";
	if (key.endsWith("_count") || key.endsWith("_number")) return "number";
	if (!value) return "string";
	if (value.startsWith("a:") || value.startsWith("{") || value.startsWith("[")) return "json";
	if (NUMERIC_PATTERN.test(value)) return "number";
	if ([
		"0",
		"1",
		"true",
		"false"
	].includes(value)) return "boolean";
	return "string";
}
/**
* Meta prefixes written by well-known WordPress plugins as operational
* bookkeeping (sync state, counters, cache keys) — not content. Without
* this filter, a mature site's analysis suggests dozens of junk fields
* per post type and the real content fields drown in them.
*
* ponytail: curated list of the plugins we've seen in the wild, not a
* taxonomy of the WP ecosystem. Unknown plugins' meta still gets through;
* extend the list as real sites surface new offenders.
*/
var PLUGIN_META_PREFIXES = [
	"aawp_",
	"algolia_",
	"amazon_polly_",
	"ampforwp_",
	"classifai_",
	"essb_",
	"eg_",
	"gnpub_",
	"jetpack_",
	"mashsb_",
	"monsterinsights_",
	"onesignal_",
	"penci_",
	"perfmatters_",
	"pys_",
	"rank_math_",
	"rp4wp_",
	"saswp_",
	"sbg_",
	"snap_",
	"spay_",
	"tie_",
	"wl_",
	"wpil_",
	"wprm_",
	"wpswa_",
	"wpuf_",
	"yarpp_"
];
/** Exact meta keys that are plugin/core bookkeeping, not content. */
var PLUGIN_META_KEYS = /* @__PURE__ */ new Set([
	"entity_same_as",
	"exclude_from_search",
	"footnotes",
	"inline_featured_image",
	"os_meta",
	"thirstydata"
]);
/**
* Check whether a meta key is well-known plugin bookkeeping that should
* not become a content field. Hyphens are normalized to underscores
* before matching (e.g. `ampforwp-amp-on-off`).
*/
function isPluginBookkeepingMeta(key) {
	const normalized = key.replaceAll("-", "_");
	if (PLUGIN_META_KEYS.has(normalized)) return true;
	return PLUGIN_META_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
var INVALID_FIELD_SLUG_CHARS = /[^a-z0-9_]+/g;
var LEADING_NON_ALPHA_CHARS = /^[^a-z]+/;
/**
* Sanitize a WordPress meta/ACF key into a valid EmDash field slug
* (`/^[a-z][a-z0-9_]*$/`, max 63 chars, not reserved).
*
* Must be applied consistently on both sides of an import: once when
* creating fields from the analysis, and again when matching incoming
* meta keys onto schema fields — otherwise keys like `my-field` create
* `my_field` but never receive values.
*/
function sanitizeFieldSlug(key) {
	const sanitized = key.toLowerCase().replace(INVALID_FIELD_SLUG_CHARS, "_").replace(LEADING_NON_ALPHA_CHARS, "").slice(0, 63);
	if (!sanitized) return "field";
	if (RESERVED_FIELD_SLUGS.includes(sanitized)) return `wp_${sanitized}`;
	return sanitized;
}
var REGEX_SPECIALS = /[.*+?^${}()|[\]\\]/g;
var LEADING_WWW = /^www\./;
/**
* Turn an absolute URL into a root-relative one when it points at the
* source site (www-insensitive). Returns null when the URL should be
* left alone: external links, non-http(s) schemes, and `/wp-content/`
* media files — those stay absolute so the later media pass can match
* them against its old-URL -> new-URL map.
*/
function relativizeUrl(url, sourceHost) {
	if (!url.startsWith("http://") && !url.startsWith("https://")) return null;
	try {
		const parsed = new URL(url);
		if (parsed.hostname.replace(LEADING_WWW, "") !== sourceHost) return null;
		if (parsed.pathname.startsWith("/wp-content/")) return null;
		return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
	} catch {
		return null;
	}
}
function relativizeMarkDefs(markDefs, sourceHost) {
	for (const def of markDefs ?? []) if (def._type === "link" && typeof def.href === "string") def.href = relativizeUrl(def.href, sourceHost) ?? def.href;
}
/**
* Rewrite internal links in imported content to root-relative URLs, in
* place. Without this, imported posts keep linking back to the old
* WordPress domain (e.g. `https://oldsite.com/companies/google/`)
* instead of staying on the new site.
*
* ponytail: path structures are kept as-is (WP permalink /2024/05/slug/
* stays /2024/05/slug/) — mapping old paths onto the new site's routes
* is the planned permalink->redirect-map feature.
*/
function relativizeContentLinks(blocks, siteUrl) {
	let sourceHost;
	try {
		sourceHost = new URL(siteUrl).hostname.replace(LEADING_WWW, "");
	} catch {
		return;
	}
	const hrefPattern = new RegExp(`href=(["']?)https?://(?:www\\.)?${sourceHost.replace(REGEX_SPECIALS, "\\$&")}(/[^"'\\s>]*)?\\1`, "gi");
	for (const block of blocks) switch (block._type) {
		case "block":
			relativizeMarkDefs(block.markDefs, sourceHost);
			break;
		case "image":
			if (block.link) block.link = relativizeUrl(block.link, sourceHost) ?? block.link;
			break;
		case "table":
			for (const row of block.rows) for (const cell of row.cells) relativizeMarkDefs(cell.markDefs, sourceHost);
			break;
		case "columns":
			for (const column of block.columns) relativizeContentLinks(column.content, siteUrl);
			break;
		case "cover":
			relativizeContentLinks(block.content, siteUrl);
			break;
		case "button":
			if (block.url) block.url = relativizeUrl(block.url, sourceHost) ?? block.url;
			break;
		case "buttons":
			for (const button of block.buttons) if (button.url) button.url = relativizeUrl(button.url, sourceHost) ?? button.url;
			break;
		case "htmlBlock":
			block.html = block.html.replace(hrefPattern, (_m, _quote, path) => {
				return `href="${path || "/"}"`;
			});
			break;
		case "code":
		case "embed":
		case "gallery":
		case "break":
		case "file":
		case "pullquote": break;
		default:
	}
}
/**
* Normalize URL for API requests
*/
function normalizeUrl$1(url) {
	let normalized = url.trim();
	if (!normalized.startsWith("http")) normalized = `https://${normalized}`;
	normalized = normalized.replace(TRAILING_SLASHES$1, "");
	normalized = normalized.replace(WP_JSON_SUFFIX$1, "");
	return normalized;
}
/**
* Extract filename from URL
*/
function getFilenameFromUrl(url) {
	try {
		return new URL(url).pathname.split("/").filter(Boolean).pop();
	} catch {
		return;
	}
}
/**
* Guess MIME type from filename
*/
function guessMimeType(filename) {
	return index_lite_default.getType(filename) ?? void 0;
}
/**
* Build a map of attachment IDs to URLs for resolving featured images
*/
function buildAttachmentMap(attachments) {
	const map = /* @__PURE__ */ new Map();
	for (const att of attachments) if (att.id && att.url) map.set(String(att.id), att.url);
	return map;
}
/**
* Check if two field types are compatible for import
*/
function isTypeCompatible(requiredType, existingType) {
	if (requiredType === existingType) return true;
	return {
		string: [
			"string",
			"text",
			"slug"
		],
		text: ["string", "text"],
		portableText: ["portableText", "json"],
		number: ["number", "integer"],
		integer: ["number", "integer"]
	}[requiredType]?.includes(existingType) ?? false;
}
/**
* Check schema compatibility between required fields and existing collection
*/
function checkSchemaCompatibility(requiredFields, existingCollection) {
	if (!existingCollection) {
		const fieldStatus = {};
		for (const field of requiredFields) fieldStatus[field.slug] = {
			status: "missing",
			requiredType: field.type
		};
		return {
			exists: false,
			fieldStatus,
			canImport: true
		};
	}
	const fieldStatus = {};
	const incompatibleFields = [];
	for (const field of requiredFields) {
		const existingField = existingCollection.fields.get(field.slug);
		if (!existingField) fieldStatus[field.slug] = {
			status: "missing",
			requiredType: field.type
		};
		else if (isTypeCompatible(field.type, existingField.type)) fieldStatus[field.slug] = {
			status: "compatible",
			existingType: existingField.type,
			requiredType: field.type
		};
		else {
			fieldStatus[field.slug] = {
				status: "type_mismatch",
				existingType: existingField.type,
				requiredType: field.type
			};
			incompatibleFields.push(field.slug);
		}
	}
	const canImport = incompatibleFields.length === 0;
	return {
		exists: true,
		fieldStatus,
		canImport,
		reason: canImport ? void 0 : `Incompatible field types: ${incompatibleFields.join(", ")}`
	};
}
/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
//#endregion
//#region node_modules/.pnpm/@wordpress+block-serialization-default-parser@5.53.0/node_modules/@wordpress/block-serialization-default-parser/build-module/index.mjs
var import_sax = /* @__PURE__ */ __toESM$1((/* @__PURE__ */ __commonJSMin$1(((exports) => {
	(function(sax) {
		sax.parser = function(strict, opt) {
			return new SAXParser(strict, opt);
		};
		sax.SAXParser = SAXParser;
		sax.SAXStream = SAXStream;
		sax.createStream = createStream;
		sax.MAX_BUFFER_LENGTH = 65536;
		var buffers = [
			"comment",
			"sgmlDecl",
			"textNode",
			"tagName",
			"doctype",
			"procInstName",
			"procInstBody",
			"entity",
			"attribName",
			"attribValue",
			"cdata",
			"script"
		];
		sax.EVENTS = [
			"text",
			"processinginstruction",
			"sgmldeclaration",
			"doctype",
			"comment",
			"opentagstart",
			"attribute",
			"opentag",
			"closetag",
			"opencdata",
			"cdata",
			"closecdata",
			"error",
			"end",
			"ready",
			"script",
			"opennamespace",
			"closenamespace"
		];
		function SAXParser(strict, opt) {
			if (!(this instanceof SAXParser)) return new SAXParser(strict, opt);
			var parser = this;
			clearBuffers(parser);
			parser.q = parser.c = "";
			parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
			parser.encoding = null;
			parser.opt = opt || {};
			parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
			parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
			parser.opt.maxEntityCount = parser.opt.maxEntityCount || 512;
			parser.opt.maxEntityDepth = parser.opt.maxEntityDepth || 4;
			parser.entityCount = parser.entityDepth = 0;
			parser.tags = [];
			parser.closed = parser.closedRoot = parser.sawRoot = false;
			parser.tag = parser.error = null;
			parser.strict = !!strict;
			parser.noscript = !!(strict || parser.opt.noscript);
			parser.state = S.BEGIN;
			parser.strictEntities = parser.opt.strictEntities;
			parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
			parser.attribList = [];
			if (parser.opt.xmlns) parser.ns = Object.create(rootNS);
			if (parser.opt.unquotedAttributeValues === void 0) parser.opt.unquotedAttributeValues = !strict;
			parser.trackPosition = parser.opt.position !== false;
			if (parser.trackPosition) parser.position = parser.line = parser.column = 0;
			emit(parser, "onready");
		}
		if (!Object.create) Object.create = function(o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
		if (!Object.keys) Object.keys = function(o) {
			var a = [];
			for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
			return a;
		};
		function checkBufferLength(parser) {
			var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
			var maxActual = 0;
			for (var i = 0, l = buffers.length; i < l; i++) {
				var len = parser[buffers[i]].length;
				if (len > maxAllowed) switch (buffers[i]) {
					case "textNode":
						closeText(parser);
						break;
					case "cdata":
						emitNode(parser, "oncdata", parser.cdata);
						parser.cdata = "";
						break;
					case "script":
						emitNode(parser, "onscript", parser.script);
						parser.script = "";
						break;
					default: error(parser, "Max buffer length exceeded: " + buffers[i]);
				}
				maxActual = Math.max(maxActual, len);
			}
			parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH - maxActual + parser.position;
		}
		function clearBuffers(parser) {
			for (var i = 0, l = buffers.length; i < l; i++) parser[buffers[i]] = "";
		}
		function flushBuffers(parser) {
			closeText(parser);
			if (parser.cdata !== "") {
				emitNode(parser, "oncdata", parser.cdata);
				parser.cdata = "";
			}
			if (parser.script !== "") {
				emitNode(parser, "onscript", parser.script);
				parser.script = "";
			}
		}
		SAXParser.prototype = {
			end: function() {
				end(this);
			},
			write,
			resume: function() {
				this.error = null;
				return this;
			},
			close: function() {
				return this.write(null);
			},
			flush: function() {
				flushBuffers(this);
			}
		};
		var Stream;
		try {
			Stream = __require("stream").Stream;
		} catch (ex) {
			Stream = function() {};
		}
		if (!Stream) Stream = function() {};
		var streamWraps = sax.EVENTS.filter(function(ev) {
			return ev !== "error" && ev !== "end";
		});
		function createStream(strict, opt) {
			return new SAXStream(strict, opt);
		}
		function determineBufferEncoding(data, isEnd) {
			if (data.length >= 2) {
				if (data[0] === 255 && data[1] === 254) return "utf-16le";
				if (data[0] === 254 && data[1] === 255) return "utf-16be";
			}
			if (data.length >= 3 && data[0] === 239 && data[1] === 187 && data[2] === 191) return "utf8";
			if (data.length >= 4) {
				if (data[0] === 60 && data[1] === 0 && data[2] === 63 && data[3] === 0) return "utf-16le";
				if (data[0] === 0 && data[1] === 60 && data[2] === 0 && data[3] === 63) return "utf-16be";
				return "utf8";
			}
			return isEnd ? "utf8" : null;
		}
		function SAXStream(strict, opt) {
			if (!(this instanceof SAXStream)) return new SAXStream(strict, opt);
			Stream.apply(this);
			this._parser = new SAXParser(strict, opt);
			this.writable = true;
			this.readable = true;
			var me = this;
			this._parser.onend = function() {
				me.emit("end");
			};
			this._parser.onerror = function(er) {
				me.emit("error", er);
				me._parser.error = null;
			};
			this._decoder = null;
			this._decoderBuffer = null;
			streamWraps.forEach(function(ev) {
				Object.defineProperty(me, "on" + ev, {
					get: function() {
						return me._parser["on" + ev];
					},
					set: function(h) {
						if (!h) {
							me.removeAllListeners(ev);
							me._parser["on" + ev] = h;
							return h;
						}
						me.on(ev, h);
					},
					enumerable: true,
					configurable: false
				});
			});
		}
		SAXStream.prototype = Object.create(Stream.prototype, { constructor: { value: SAXStream } });
		SAXStream.prototype._decodeBuffer = function(data, isEnd) {
			if (this._decoderBuffer) {
				data = Buffer.concat([this._decoderBuffer, data]);
				this._decoderBuffer = null;
			}
			if (!this._decoder) {
				var encoding = determineBufferEncoding(data, isEnd);
				if (!encoding) {
					this._decoderBuffer = data;
					return "";
				}
				this._parser.encoding = encoding;
				this._decoder = new TextDecoder(encoding);
			}
			return this._decoder.decode(data, { stream: !isEnd });
		};
		SAXStream.prototype.write = function(data) {
			if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) data = this._decodeBuffer(data, false);
			else if (this._decoderBuffer) {
				var remaining = this._decodeBuffer(Buffer.alloc(0), true);
				if (remaining) {
					this._parser.write(remaining);
					this.emit("data", remaining);
				}
			}
			this._parser.write(data.toString());
			this.emit("data", data);
			return true;
		};
		SAXStream.prototype.end = function(chunk) {
			if (chunk && chunk.length) this.write(chunk);
			if (this._decoderBuffer) {
				var finalChunk = this._decodeBuffer(Buffer.alloc(0), true);
				if (finalChunk) {
					this._parser.write(finalChunk);
					this.emit("data", finalChunk);
				}
			} else if (this._decoder) {
				var remaining = this._decoder.decode();
				if (remaining) {
					this._parser.write(remaining);
					this.emit("data", remaining);
				}
			}
			this._parser.end();
			return true;
		};
		SAXStream.prototype.on = function(ev, handler) {
			var me = this;
			if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) me._parser["on" + ev] = function() {
				var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
				args.splice(0, 0, ev);
				me.emit.apply(me, args);
			};
			return Stream.prototype.on.call(me, ev, handler);
		};
		var CDATAre = /^\[CDATA\[$/i;
		var DOCTYPEre = /^DOCTYPE$/i;
		var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
		var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
		var rootNS = {
			xml: XML_NAMESPACE,
			xmlns: XMLNS_NAMESPACE
		};
		var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
		var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
		var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
		var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
		function isWhitespace(c) {
			return c === " " || c === "\n" || c === "\r" || c === "	";
		}
		function isQuote(c) {
			return c === "\"" || c === "'";
		}
		function isAttribEnd(c) {
			return c === ">" || isWhitespace(c);
		}
		function isMatch(regex, c) {
			return regex.test(c);
		}
		function notMatch(regex, c) {
			return !isMatch(regex, c);
		}
		var S = 0;
		sax.STATE = {
			BEGIN: S++,
			BEGIN_WHITESPACE: S++,
			TEXT: S++,
			TEXT_ENTITY: S++,
			OPEN_WAKA: S++,
			SGML_DECL: S++,
			SGML_DECL_QUOTED: S++,
			DOCTYPE: S++,
			DOCTYPE_QUOTED: S++,
			DOCTYPE_DTD: S++,
			DOCTYPE_DTD_QUOTED: S++,
			COMMENT_STARTING: S++,
			COMMENT: S++,
			COMMENT_ENDING: S++,
			COMMENT_ENDED: S++,
			CDATA: S++,
			CDATA_ENDING: S++,
			CDATA_ENDING_2: S++,
			PROC_INST: S++,
			PROC_INST_BODY: S++,
			PROC_INST_ENDING: S++,
			OPEN_TAG: S++,
			OPEN_TAG_SLASH: S++,
			ATTRIB: S++,
			ATTRIB_NAME: S++,
			ATTRIB_NAME_SAW_WHITE: S++,
			ATTRIB_VALUE: S++,
			ATTRIB_VALUE_QUOTED: S++,
			ATTRIB_VALUE_CLOSED: S++,
			ATTRIB_VALUE_UNQUOTED: S++,
			ATTRIB_VALUE_ENTITY_Q: S++,
			ATTRIB_VALUE_ENTITY_U: S++,
			CLOSE_TAG: S++,
			CLOSE_TAG_SAW_WHITE: S++,
			SCRIPT: S++,
			SCRIPT_ENDING: S++
		};
		sax.XML_ENTITIES = Object.assign(Object.create(null), {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'"
		});
		sax.ENTITIES = Object.assign(Object.create(null), {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'",
			AElig: 198,
			Aacute: 193,
			Acirc: 194,
			Agrave: 192,
			Aring: 197,
			Atilde: 195,
			Auml: 196,
			Ccedil: 199,
			ETH: 208,
			Eacute: 201,
			Ecirc: 202,
			Egrave: 200,
			Euml: 203,
			Iacute: 205,
			Icirc: 206,
			Igrave: 204,
			Iuml: 207,
			Ntilde: 209,
			Oacute: 211,
			Ocirc: 212,
			Ograve: 210,
			Oslash: 216,
			Otilde: 213,
			Ouml: 214,
			THORN: 222,
			Uacute: 218,
			Ucirc: 219,
			Ugrave: 217,
			Uuml: 220,
			Yacute: 221,
			aacute: 225,
			acirc: 226,
			aelig: 230,
			agrave: 224,
			aring: 229,
			atilde: 227,
			auml: 228,
			ccedil: 231,
			eacute: 233,
			ecirc: 234,
			egrave: 232,
			eth: 240,
			euml: 235,
			iacute: 237,
			icirc: 238,
			igrave: 236,
			iuml: 239,
			ntilde: 241,
			oacute: 243,
			ocirc: 244,
			ograve: 242,
			oslash: 248,
			otilde: 245,
			ouml: 246,
			szlig: 223,
			thorn: 254,
			uacute: 250,
			ucirc: 251,
			ugrave: 249,
			uuml: 252,
			yacute: 253,
			yuml: 255,
			copy: 169,
			reg: 174,
			nbsp: 160,
			iexcl: 161,
			cent: 162,
			pound: 163,
			curren: 164,
			yen: 165,
			brvbar: 166,
			sect: 167,
			uml: 168,
			ordf: 170,
			laquo: 171,
			not: 172,
			shy: 173,
			macr: 175,
			deg: 176,
			plusmn: 177,
			sup1: 185,
			sup2: 178,
			sup3: 179,
			acute: 180,
			micro: 181,
			para: 182,
			middot: 183,
			cedil: 184,
			ordm: 186,
			raquo: 187,
			frac14: 188,
			frac12: 189,
			frac34: 190,
			iquest: 191,
			times: 215,
			divide: 247,
			OElig: 338,
			oelig: 339,
			Scaron: 352,
			scaron: 353,
			Yuml: 376,
			fnof: 402,
			circ: 710,
			tilde: 732,
			Alpha: 913,
			Beta: 914,
			Gamma: 915,
			Delta: 916,
			Epsilon: 917,
			Zeta: 918,
			Eta: 919,
			Theta: 920,
			Iota: 921,
			Kappa: 922,
			Lambda: 923,
			Mu: 924,
			Nu: 925,
			Xi: 926,
			Omicron: 927,
			Pi: 928,
			Rho: 929,
			Sigma: 931,
			Tau: 932,
			Upsilon: 933,
			Phi: 934,
			Chi: 935,
			Psi: 936,
			Omega: 937,
			alpha: 945,
			beta: 946,
			gamma: 947,
			delta: 948,
			epsilon: 949,
			zeta: 950,
			eta: 951,
			theta: 952,
			iota: 953,
			kappa: 954,
			lambda: 955,
			mu: 956,
			nu: 957,
			xi: 958,
			omicron: 959,
			pi: 960,
			rho: 961,
			sigmaf: 962,
			sigma: 963,
			tau: 964,
			upsilon: 965,
			phi: 966,
			chi: 967,
			psi: 968,
			omega: 969,
			thetasym: 977,
			upsih: 978,
			piv: 982,
			ensp: 8194,
			emsp: 8195,
			thinsp: 8201,
			zwnj: 8204,
			zwj: 8205,
			lrm: 8206,
			rlm: 8207,
			ndash: 8211,
			mdash: 8212,
			lsquo: 8216,
			rsquo: 8217,
			sbquo: 8218,
			ldquo: 8220,
			rdquo: 8221,
			bdquo: 8222,
			dagger: 8224,
			Dagger: 8225,
			bull: 8226,
			hellip: 8230,
			permil: 8240,
			prime: 8242,
			Prime: 8243,
			lsaquo: 8249,
			rsaquo: 8250,
			oline: 8254,
			frasl: 8260,
			euro: 8364,
			image: 8465,
			weierp: 8472,
			real: 8476,
			trade: 8482,
			alefsym: 8501,
			larr: 8592,
			uarr: 8593,
			rarr: 8594,
			darr: 8595,
			harr: 8596,
			crarr: 8629,
			lArr: 8656,
			uArr: 8657,
			rArr: 8658,
			dArr: 8659,
			hArr: 8660,
			forall: 8704,
			part: 8706,
			exist: 8707,
			empty: 8709,
			nabla: 8711,
			isin: 8712,
			notin: 8713,
			ni: 8715,
			prod: 8719,
			sum: 8721,
			minus: 8722,
			lowast: 8727,
			radic: 8730,
			prop: 8733,
			infin: 8734,
			ang: 8736,
			and: 8743,
			or: 8744,
			cap: 8745,
			cup: 8746,
			int: 8747,
			there4: 8756,
			sim: 8764,
			cong: 8773,
			asymp: 8776,
			ne: 8800,
			equiv: 8801,
			le: 8804,
			ge: 8805,
			sub: 8834,
			sup: 8835,
			nsub: 8836,
			sube: 8838,
			supe: 8839,
			oplus: 8853,
			otimes: 8855,
			perp: 8869,
			sdot: 8901,
			lceil: 8968,
			rceil: 8969,
			lfloor: 8970,
			rfloor: 8971,
			lang: 9001,
			rang: 9002,
			loz: 9674,
			spades: 9824,
			clubs: 9827,
			hearts: 9829,
			diams: 9830
		});
		Object.keys(sax.ENTITIES).forEach(function(key) {
			var e = sax.ENTITIES[key];
			var s = typeof e === "number" ? String.fromCharCode(e) : e;
			sax.ENTITIES[key] = s;
		});
		for (var s in sax.STATE) sax.STATE[sax.STATE[s]] = s;
		S = sax.STATE;
		function emit(parser, event, data) {
			parser[event] && parser[event](data);
		}
		function getDeclaredEncoding(body) {
			var match = body && body.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
			return match ? match[2] : null;
		}
		function normalizeEncodingName(encoding) {
			if (!encoding) return null;
			return encoding.toLowerCase().replace(/[^a-z0-9]/g, "");
		}
		function encodingsMatch(detectedEncoding, declaredEncoding) {
			const detected = normalizeEncodingName(detectedEncoding);
			const declared = normalizeEncodingName(declaredEncoding);
			if (!detected || !declared) return true;
			if (declared === "utf16") return detected === "utf16le" || detected === "utf16be";
			return detected === declared;
		}
		function validateXmlDeclarationEncoding(parser, data) {
			if (!parser.strict || !parser.encoding || !data || data.name !== "xml") return;
			var declaredEncoding = getDeclaredEncoding(data.body);
			if (declaredEncoding && !encodingsMatch(parser.encoding, declaredEncoding)) strictFail(parser, "XML declaration encoding " + declaredEncoding + " does not match detected stream encoding " + parser.encoding.toUpperCase());
		}
		function emitNode(parser, nodeType, data) {
			if (parser.textNode) closeText(parser);
			emit(parser, nodeType, data);
		}
		function closeText(parser) {
			parser.textNode = textopts(parser.opt, parser.textNode);
			if (parser.textNode) emit(parser, "ontext", parser.textNode);
			parser.textNode = "";
		}
		function textopts(opt, text) {
			if (opt.trim) text = text.trim();
			if (opt.normalize) text = text.replace(/\s+/g, " ");
			return text;
		}
		function error(parser, er) {
			closeText(parser);
			if (parser.trackPosition) er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
			er = new Error(er);
			parser.error = er;
			emit(parser, "onerror", er);
			return parser;
		}
		function end(parser) {
			if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
			if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) error(parser, "Unexpected end");
			closeText(parser);
			parser.c = "";
			parser.closed = true;
			emit(parser, "onend");
			SAXParser.call(parser, parser.strict, parser.opt);
			return parser;
		}
		function strictFail(parser, message) {
			if (typeof parser !== "object" || !(parser instanceof SAXParser)) throw new Error("bad call to strictFail");
			if (parser.strict) error(parser, message);
		}
		function newTag(parser) {
			if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
			var parent = parser.tags[parser.tags.length - 1] || parser;
			var tag = parser.tag = {
				name: parser.tagName,
				attributes: {}
			};
			if (parser.opt.xmlns) tag.ns = parent.ns;
			parser.attribList.length = 0;
			emitNode(parser, "onopentagstart", tag);
		}
		function qname(name, attribute) {
			var qualName = name.indexOf(":") < 0 ? ["", name] : name.split(":");
			var prefix = qualName[0];
			var local = qualName[1];
			if (attribute && name === "xmlns") {
				prefix = "xmlns";
				local = "";
			}
			return {
				prefix,
				local
			};
		}
		function attrib(parser) {
			if (!parser.strict) parser.attribName = parser.attribName[parser.looseCase]();
			if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
				parser.attribName = parser.attribValue = "";
				return;
			}
			if (parser.opt.xmlns) {
				var qn = qname(parser.attribName, true);
				var prefix = qn.prefix;
				var local = qn.local;
				if (prefix === "xmlns") {
					if (local === "xml" && parser.attribValue !== XML_NAMESPACE) strictFail(parser, "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue);
					else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) strictFail(parser, "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue);
					else {
						var tag = parser.tag;
						var parent = parser.tags[parser.tags.length - 1] || parser;
						if (tag.ns === parent.ns) tag.ns = Object.create(parent.ns);
						tag.ns[local] = parser.attribValue;
					}
				}
				parser.attribList.push([parser.attribName, parser.attribValue]);
			} else {
				parser.tag.attributes[parser.attribName] = parser.attribValue;
				emitNode(parser, "onattribute", {
					name: parser.attribName,
					value: parser.attribValue
				});
			}
			parser.attribName = parser.attribValue = "";
		}
		function openTag(parser, selfClosing) {
			if (parser.opt.xmlns) {
				var tag = parser.tag;
				var qn = qname(parser.tagName);
				tag.prefix = qn.prefix;
				tag.local = qn.local;
				tag.uri = tag.ns[qn.prefix] || "";
				if (tag.prefix && !tag.uri) {
					strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
					tag.uri = qn.prefix;
				}
				var parent = parser.tags[parser.tags.length - 1] || parser;
				if (tag.ns && parent.ns !== tag.ns) Object.keys(tag.ns).forEach(function(p) {
					emitNode(parser, "onopennamespace", {
						prefix: p,
						uri: tag.ns[p]
					});
				});
				for (var i = 0, l = parser.attribList.length; i < l; i++) {
					var nv = parser.attribList[i];
					var name = nv[0];
					var value = nv[1];
					var qualName = qname(name, true);
					var prefix = qualName.prefix;
					var local = qualName.local;
					var uri = prefix === "" ? "" : tag.ns[prefix] || "";
					var a = {
						name,
						value,
						prefix,
						local,
						uri
					};
					if (prefix && prefix !== "xmlns" && !uri) {
						strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
						a.uri = prefix;
					}
					parser.tag.attributes[name] = a;
					emitNode(parser, "onattribute", a);
				}
				parser.attribList.length = 0;
			}
			parser.tag.isSelfClosing = !!selfClosing;
			parser.sawRoot = true;
			parser.tags.push(parser.tag);
			emitNode(parser, "onopentag", parser.tag);
			if (!selfClosing) {
				if (!parser.noscript && parser.tagName.toLowerCase() === "script") parser.state = S.SCRIPT;
				else parser.state = S.TEXT;
				parser.tag = null;
				parser.tagName = "";
			}
			parser.attribName = parser.attribValue = "";
			parser.attribList.length = 0;
		}
		function closeTag(parser) {
			if (!parser.tagName) {
				strictFail(parser, "Weird empty close tag.");
				parser.textNode += "</>";
				parser.state = S.TEXT;
				return;
			}
			if (parser.script) {
				if (parser.tagName !== "script") {
					parser.script += "</" + parser.tagName + ">";
					parser.tagName = "";
					parser.state = S.SCRIPT;
					return;
				}
				emitNode(parser, "onscript", parser.script);
				parser.script = "";
			}
			var t = parser.tags.length;
			var tagName = parser.tagName;
			if (!parser.strict) tagName = tagName[parser.looseCase]();
			var closeTo = tagName;
			while (t--) if (parser.tags[t].name !== closeTo) strictFail(parser, "Unexpected close tag");
			else break;
			if (t < 0) {
				strictFail(parser, "Unmatched closing tag: " + parser.tagName);
				parser.textNode += "</" + parser.tagName + ">";
				parser.state = S.TEXT;
				return;
			}
			parser.tagName = tagName;
			var s = parser.tags.length;
			while (s-- > t) {
				var tag = parser.tag = parser.tags.pop();
				parser.tagName = parser.tag.name;
				emitNode(parser, "onclosetag", parser.tagName);
				var x = {};
				for (var i in tag.ns) x[i] = tag.ns[i];
				var parent = parser.tags[parser.tags.length - 1] || parser;
				if (parser.opt.xmlns && tag.ns !== parent.ns) Object.keys(tag.ns).forEach(function(p) {
					var n = tag.ns[p];
					emitNode(parser, "onclosenamespace", {
						prefix: p,
						uri: n
					});
				});
			}
			if (t === 0) parser.closedRoot = true;
			parser.tagName = parser.attribValue = parser.attribName = "";
			parser.attribList.length = 0;
			parser.state = S.TEXT;
		}
		function parseEntity(parser) {
			var entity = parser.entity;
			var entityLC = entity.toLowerCase();
			var num;
			var numStr = "";
			if (parser.ENTITIES[entity]) return parser.ENTITIES[entity];
			if (parser.ENTITIES[entityLC]) return parser.ENTITIES[entityLC];
			entity = entityLC;
			if (entity.charAt(0) === "#") {
				if (entity.charAt(1) === "x") {
					entity = entity.slice(2);
					num = parseInt(entity, 16);
					numStr = num.toString(16);
				} else {
					entity = entity.slice(1);
					num = parseInt(entity, 10);
					numStr = num.toString(10);
				}
			}
			entity = entity.replace(/^0+/, "");
			if (isNaN(num) || numStr.toLowerCase() !== entity || num < 0 || num > 1114111 || !isXmlChar(num)) {
				strictFail(parser, "Invalid character entity");
				return "&" + parser.entity + ";";
			}
			return String.fromCodePoint(num);
		}
		function isXmlChar(num) {
			return num === 9 || num === 10 || num === 13 || num >= 32 && num <= 55295 || num >= 57344 && num <= 65533 || num >= 65536 && num <= 1114111;
		}
		function beginWhiteSpace(parser, c) {
			if (c === "<") {
				parser.state = S.OPEN_WAKA;
				parser.startTagPosition = parser.position;
			} else if (!isWhitespace(c)) {
				strictFail(parser, "Non-whitespace before first tag.");
				parser.textNode = c;
				parser.state = S.TEXT;
			}
		}
		function charAt(chunk, i) {
			var result = "";
			if (i < chunk.length) result = chunk.charAt(i);
			return result;
		}
		function write(chunk) {
			var parser = this;
			if (this.error) throw this.error;
			if (parser.closed) return error(parser, "Cannot write after close. Assign an onready handler.");
			if (chunk === null) return end(parser);
			if (typeof chunk === "object") chunk = chunk.toString();
			var i = 0;
			var c = "";
			while (true) {
				c = charAt(chunk, i++);
				parser.c = c;
				if (!c) break;
				if (parser.trackPosition) {
					parser.position++;
					if (c === "\n") {
						parser.line++;
						parser.column = 0;
					} else parser.column++;
				}
				switch (parser.state) {
					case S.BEGIN:
						parser.state = S.BEGIN_WHITESPACE;
						if (c === "﻿") continue;
						beginWhiteSpace(parser, c);
						continue;
					case S.BEGIN_WHITESPACE:
						beginWhiteSpace(parser, c);
						continue;
					case S.TEXT:
						if (parser.sawRoot && !parser.closedRoot) {
							var starti = i - 1;
							while (c && c !== "<" && c !== "&") {
								c = charAt(chunk, i++);
								if (c && parser.trackPosition) {
									parser.position++;
									if (c === "\n") {
										parser.line++;
										parser.column = 0;
									} else parser.column++;
								}
							}
							parser.textNode += chunk.substring(starti, i - 1);
						}
						if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
							parser.state = S.OPEN_WAKA;
							parser.startTagPosition = parser.position;
						} else {
							if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) strictFail(parser, "Text data outside of root node.");
							if (c === "&") parser.state = S.TEXT_ENTITY;
							else parser.textNode += c;
						}
						continue;
					case S.SCRIPT:
						if (c === "<") parser.state = S.SCRIPT_ENDING;
						else parser.script += c;
						continue;
					case S.SCRIPT_ENDING:
						if (c === "/") parser.state = S.CLOSE_TAG;
						else {
							parser.script += "<" + c;
							parser.state = S.SCRIPT;
						}
						continue;
					case S.OPEN_WAKA:
						if (c === "!") {
							parser.state = S.SGML_DECL;
							parser.sgmlDecl = "";
						} else if (isWhitespace(c)) {} else if (isMatch(nameStart, c)) {
							parser.state = S.OPEN_TAG;
							parser.tagName = c;
						} else if (c === "/") {
							parser.state = S.CLOSE_TAG;
							parser.tagName = "";
						} else if (c === "?") {
							parser.state = S.PROC_INST;
							parser.procInstName = parser.procInstBody = "";
						} else {
							strictFail(parser, "Unencoded <");
							if (parser.startTagPosition + 1 < parser.position) {
								var pad = parser.position - parser.startTagPosition;
								c = new Array(pad).join(" ") + c;
							}
							parser.textNode += "<" + c;
							parser.state = S.TEXT;
						}
						continue;
					case S.SGML_DECL:
						if (parser.sgmlDecl + c === "--") {
							parser.state = S.COMMENT;
							parser.comment = "";
							parser.sgmlDecl = "";
							continue;
						}
						if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
							parser.state = S.DOCTYPE_DTD;
							parser.doctype += "<!" + parser.sgmlDecl + c;
							parser.sgmlDecl = "";
						} else if (CDATAre.test(parser.sgmlDecl + c)) {
							emitNode(parser, "onopencdata");
							parser.state = S.CDATA;
							parser.sgmlDecl = "";
							parser.cdata = "";
						} else if (DOCTYPEre.test(parser.sgmlDecl + c)) {
							parser.state = S.DOCTYPE;
							if (parser.doctype || parser.sawRoot) strictFail(parser, "Inappropriately located doctype declaration");
							parser.doctype = "";
							parser.sgmlDecl = "";
						} else if (c === ">") {
							emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
							parser.sgmlDecl = "";
							parser.state = S.TEXT;
						} else if (isQuote(c)) {
							parser.state = S.SGML_DECL_QUOTED;
							parser.sgmlDecl += c;
						} else parser.sgmlDecl += c;
						continue;
					case S.SGML_DECL_QUOTED:
						if (c === parser.q) {
							parser.state = S.SGML_DECL;
							parser.q = "";
						}
						parser.sgmlDecl += c;
						continue;
					case S.DOCTYPE:
						if (c === ">") {
							parser.state = S.TEXT;
							emitNode(parser, "ondoctype", parser.doctype);
							parser.doctype = true;
						} else {
							parser.doctype += c;
							if (c === "[") parser.state = S.DOCTYPE_DTD;
							else if (isQuote(c)) {
								parser.state = S.DOCTYPE_QUOTED;
								parser.q = c;
							}
						}
						continue;
					case S.DOCTYPE_QUOTED:
						parser.doctype += c;
						if (c === parser.q) {
							parser.q = "";
							parser.state = S.DOCTYPE;
						}
						continue;
					case S.DOCTYPE_DTD:
						if (c === "]") {
							parser.doctype += c;
							parser.state = S.DOCTYPE;
						} else if (c === "<") {
							parser.state = S.OPEN_WAKA;
							parser.startTagPosition = parser.position;
						} else if (isQuote(c)) {
							parser.doctype += c;
							parser.state = S.DOCTYPE_DTD_QUOTED;
							parser.q = c;
						} else parser.doctype += c;
						continue;
					case S.DOCTYPE_DTD_QUOTED:
						parser.doctype += c;
						if (c === parser.q) {
							parser.state = S.DOCTYPE_DTD;
							parser.q = "";
						}
						continue;
					case S.COMMENT:
						if (c === "-") parser.state = S.COMMENT_ENDING;
						else parser.comment += c;
						continue;
					case S.COMMENT_ENDING:
						if (c === "-") {
							parser.state = S.COMMENT_ENDED;
							parser.comment = textopts(parser.opt, parser.comment);
							if (parser.comment) emitNode(parser, "oncomment", parser.comment);
							parser.comment = "";
						} else {
							parser.comment += "-" + c;
							parser.state = S.COMMENT;
						}
						continue;
					case S.COMMENT_ENDED:
						if (c !== ">") {
							strictFail(parser, "Malformed comment");
							parser.comment += "--" + c;
							parser.state = S.COMMENT;
						} else if (parser.doctype && parser.doctype !== true) parser.state = S.DOCTYPE_DTD;
						else parser.state = S.TEXT;
						continue;
					case S.CDATA:
						var starti = i - 1;
						while (c && c !== "]") {
							c = charAt(chunk, i++);
							if (c && parser.trackPosition) {
								parser.position++;
								if (c === "\n") {
									parser.line++;
									parser.column = 0;
								} else parser.column++;
							}
						}
						parser.cdata += chunk.substring(starti, i - 1);
						if (c === "]") parser.state = S.CDATA_ENDING;
						continue;
					case S.CDATA_ENDING:
						if (c === "]") parser.state = S.CDATA_ENDING_2;
						else {
							parser.cdata += "]" + c;
							parser.state = S.CDATA;
						}
						continue;
					case S.CDATA_ENDING_2:
						if (c === ">") {
							if (parser.cdata) emitNode(parser, "oncdata", parser.cdata);
							emitNode(parser, "onclosecdata");
							parser.cdata = "";
							parser.state = S.TEXT;
						} else if (c === "]") parser.cdata += "]";
						else {
							parser.cdata += "]]" + c;
							parser.state = S.CDATA;
						}
						continue;
					case S.PROC_INST:
						if (c === "?") parser.state = S.PROC_INST_ENDING;
						else if (isWhitespace(c)) parser.state = S.PROC_INST_BODY;
						else parser.procInstName += c;
						continue;
					case S.PROC_INST_BODY:
						if (!parser.procInstBody && isWhitespace(c)) continue;
						else if (c === "?") parser.state = S.PROC_INST_ENDING;
						else parser.procInstBody += c;
						continue;
					case S.PROC_INST_ENDING:
						if (c === ">") {
							const procInstEndData = {
								name: parser.procInstName,
								body: parser.procInstBody
							};
							validateXmlDeclarationEncoding(parser, procInstEndData);
							emitNode(parser, "onprocessinginstruction", procInstEndData);
							parser.procInstName = parser.procInstBody = "";
							parser.state = S.TEXT;
						} else {
							parser.procInstBody += "?" + c;
							parser.state = S.PROC_INST_BODY;
						}
						continue;
					case S.OPEN_TAG:
						if (isMatch(nameBody, c)) parser.tagName += c;
						else {
							newTag(parser);
							if (c === ">") openTag(parser);
							else if (c === "/") parser.state = S.OPEN_TAG_SLASH;
							else {
								if (!isWhitespace(c)) strictFail(parser, "Invalid character in tag name");
								parser.state = S.ATTRIB;
							}
						}
						continue;
					case S.OPEN_TAG_SLASH:
						if (c === ">") {
							openTag(parser, true);
							closeTag(parser);
						} else {
							strictFail(parser, "Forward-slash in opening tag not followed by >");
							parser.state = S.ATTRIB;
						}
						continue;
					case S.ATTRIB:
						if (isWhitespace(c)) continue;
						else if (c === ">") openTag(parser);
						else if (c === "/") parser.state = S.OPEN_TAG_SLASH;
						else if (isMatch(nameStart, c)) {
							parser.attribName = c;
							parser.attribValue = "";
							parser.state = S.ATTRIB_NAME;
						} else strictFail(parser, "Invalid attribute name");
						continue;
					case S.ATTRIB_NAME:
						if (c === "=") parser.state = S.ATTRIB_VALUE;
						else if (c === ">") {
							strictFail(parser, "Attribute without value");
							parser.attribValue = parser.attribName;
							attrib(parser);
							openTag(parser);
						} else if (isWhitespace(c)) parser.state = S.ATTRIB_NAME_SAW_WHITE;
						else if (isMatch(nameBody, c)) parser.attribName += c;
						else strictFail(parser, "Invalid attribute name");
						continue;
					case S.ATTRIB_NAME_SAW_WHITE:
						if (c === "=") parser.state = S.ATTRIB_VALUE;
						else if (isWhitespace(c)) continue;
						else {
							strictFail(parser, "Attribute without value");
							parser.tag.attributes[parser.attribName] = "";
							parser.attribValue = "";
							emitNode(parser, "onattribute", {
								name: parser.attribName,
								value: ""
							});
							parser.attribName = "";
							if (c === ">") openTag(parser);
							else if (isMatch(nameStart, c)) {
								parser.attribName = c;
								parser.state = S.ATTRIB_NAME;
							} else {
								strictFail(parser, "Invalid attribute name");
								parser.state = S.ATTRIB;
							}
						}
						continue;
					case S.ATTRIB_VALUE:
						if (isWhitespace(c)) continue;
						else if (isQuote(c)) {
							parser.q = c;
							parser.state = S.ATTRIB_VALUE_QUOTED;
						} else {
							if (!parser.opt.unquotedAttributeValues) error(parser, "Unquoted attribute value");
							parser.state = S.ATTRIB_VALUE_UNQUOTED;
							parser.attribValue = c;
						}
						continue;
					case S.ATTRIB_VALUE_QUOTED:
						if (c !== parser.q) {
							if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_Q;
							else parser.attribValue += c;
							continue;
						}
						attrib(parser);
						parser.q = "";
						parser.state = S.ATTRIB_VALUE_CLOSED;
						continue;
					case S.ATTRIB_VALUE_CLOSED:
						if (isWhitespace(c)) parser.state = S.ATTRIB;
						else if (c === ">") openTag(parser);
						else if (c === "/") parser.state = S.OPEN_TAG_SLASH;
						else if (isMatch(nameStart, c)) {
							strictFail(parser, "No whitespace between attributes");
							parser.attribName = c;
							parser.attribValue = "";
							parser.state = S.ATTRIB_NAME;
						} else strictFail(parser, "Invalid attribute name");
						continue;
					case S.ATTRIB_VALUE_UNQUOTED:
						if (!isAttribEnd(c)) {
							if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_U;
							else parser.attribValue += c;
							continue;
						}
						attrib(parser);
						if (c === ">") openTag(parser);
						else parser.state = S.ATTRIB;
						continue;
					case S.CLOSE_TAG:
						if (!parser.tagName) {
							if (isWhitespace(c)) continue;
							else if (notMatch(nameStart, c)) {
								if (parser.script) {
									parser.script += "</" + c;
									parser.state = S.SCRIPT;
								} else strictFail(parser, "Invalid tagname in closing tag.");
							} else parser.tagName = c;
						} else if (c === ">") closeTag(parser);
						else if (isMatch(nameBody, c)) parser.tagName += c;
						else if (parser.script) {
							parser.script += "</" + parser.tagName + c;
							parser.tagName = "";
							parser.state = S.SCRIPT;
						} else {
							if (!isWhitespace(c)) strictFail(parser, "Invalid tagname in closing tag");
							parser.state = S.CLOSE_TAG_SAW_WHITE;
						}
						continue;
					case S.CLOSE_TAG_SAW_WHITE:
						if (isWhitespace(c)) continue;
						if (c === ">") closeTag(parser);
						else strictFail(parser, "Invalid characters in closing tag");
						continue;
					case S.TEXT_ENTITY:
					case S.ATTRIB_VALUE_ENTITY_Q:
					case S.ATTRIB_VALUE_ENTITY_U:
						var returnState;
						var buffer;
						switch (parser.state) {
							case S.TEXT_ENTITY:
								returnState = S.TEXT;
								buffer = "textNode";
								break;
							case S.ATTRIB_VALUE_ENTITY_Q:
								returnState = S.ATTRIB_VALUE_QUOTED;
								buffer = "attribValue";
								break;
							case S.ATTRIB_VALUE_ENTITY_U:
								returnState = S.ATTRIB_VALUE_UNQUOTED;
								buffer = "attribValue";
						}
						if (c === ";") {
							var parsedEntity = parseEntity(parser);
							if (parser.opt.unparsedEntities && !Object.values(sax.XML_ENTITIES).includes(parsedEntity)) {
								if ((parser.entityCount += 1) > parser.opt.maxEntityCount) error(parser, "Parsed entity count exceeds max entity count");
								if ((parser.entityDepth += 1) > parser.opt.maxEntityDepth) error(parser, "Parsed entity depth exceeds max entity depth");
								parser.entity = "";
								parser.state = returnState;
								parser.write(parsedEntity);
								parser.entityDepth -= 1;
							} else {
								parser[buffer] += parsedEntity;
								parser.entity = "";
								parser.state = returnState;
							}
						} else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) parser.entity += c;
						else {
							strictFail(parser, "Invalid character in entity name");
							parser[buffer] += "&" + parser.entity + c;
							parser.entity = "";
							parser.state = returnState;
						}
						continue;
					default: throw new Error(parser, "Unknown state: " + parser.state);
				}
			}
			if (parser.position >= parser.bufferCheckPosition) checkBufferLength(parser);
			return parser;
		}
		/* istanbul ignore next */
		if (!String.fromCodePoint) (function() {
			var stringFromCharCode = String.fromCharCode;
			var floor = Math.floor;
			var fromCodePoint = function() {
				var MAX_SIZE = 16384;
				var codeUnits = [];
				var highSurrogate;
				var lowSurrogate;
				var index = -1;
				var length = arguments.length;
				if (!length) return "";
				var result = "";
				while (++index < length) {
					var codePoint = Number(arguments[index]);
					if (!isFinite(codePoint) || codePoint < 0 || codePoint > 1114111 || floor(codePoint) !== codePoint) throw RangeError("Invalid code point: " + codePoint);
					if (codePoint <= 65535) codeUnits.push(codePoint);
					else {
						codePoint -= 65536;
						highSurrogate = (codePoint >> 10) + 55296;
						lowSurrogate = codePoint % 1024 + 56320;
						codeUnits.push(highSurrogate, lowSurrogate);
					}
					if (index + 1 === length || codeUnits.length > MAX_SIZE) {
						result += stringFromCharCode.apply(null, codeUnits);
						codeUnits.length = 0;
					}
				}
				return result;
			};
			/* istanbul ignore next */
			if (Object.defineProperty) Object.defineProperty(String, "fromCodePoint", {
				value: fromCodePoint,
				configurable: true,
				writable: true
			});
			else String.fromCodePoint = fromCodePoint;
		})();
	})(typeof exports === "undefined" ? exports.sax = {} : exports);
})))(), 1);
var document;
var offset;
var output;
var stack;
var tokenizer = /<!--\s+(\/)?wp:([a-z][a-z0-9_-]*\/)?([a-z][a-z0-9_-]*)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g;
function Block(blockName, attrs, innerBlocks, innerHTML, innerContent) {
	return {
		blockName,
		attrs,
		innerBlocks,
		innerHTML,
		innerContent
	};
}
function Freeform(innerHTML) {
	return Block(null, {}, [], innerHTML, [innerHTML]);
}
function Frame(block, tokenStart, tokenLength, prevOffset, leadingHtmlStart) {
	return {
		block,
		tokenStart,
		tokenLength,
		prevOffset: prevOffset || tokenStart + tokenLength,
		leadingHtmlStart
	};
}
var parse = (doc) => {
	document = doc;
	offset = 0;
	output = [];
	stack = [];
	tokenizer.lastIndex = 0;
	do	;
while (proceed());
	return output;
};
function proceed() {
	const stackDepth = stack.length;
	const [tokenType, blockName, attrs, startOffset, tokenLength] = nextToken();
	const leadingHtmlStart = startOffset > offset ? offset : null;
	switch (tokenType) {
		case "no-more-tokens":
			if (0 === stackDepth) {
				addFreeform();
				return false;
			}
			if (1 === stackDepth) {
				addBlockFromStack();
				return false;
			}
			while (0 < stack.length) addBlockFromStack();
			return false;
		case "void-block":
			if (0 === stackDepth) {
				if (null !== leadingHtmlStart) output.push(Freeform(document.substr(leadingHtmlStart, startOffset - leadingHtmlStart)));
				output.push(Block(blockName, attrs, [], "", []));
				offset = startOffset + tokenLength;
				return true;
			}
			addInnerBlock(Block(blockName, attrs, [], "", []), startOffset, tokenLength);
			offset = startOffset + tokenLength;
			return true;
		case "block-opener":
			stack.push(Frame(Block(blockName, attrs, [], "", []), startOffset, tokenLength, startOffset + tokenLength, leadingHtmlStart));
			offset = startOffset + tokenLength;
			return true;
		case "block-closer":
			if (0 === stackDepth) {
				addFreeform();
				return false;
			}
			if (1 === stackDepth) {
				addBlockFromStack(startOffset);
				offset = startOffset + tokenLength;
				return true;
			}
			const stackTop = stack.pop();
			const html = document.substr(stackTop.prevOffset, startOffset - stackTop.prevOffset);
			stackTop.block.innerHTML += html;
			stackTop.block.innerContent.push(html);
			stackTop.prevOffset = startOffset + tokenLength;
			addInnerBlock(stackTop.block, stackTop.tokenStart, stackTop.tokenLength, startOffset + tokenLength);
			offset = startOffset + tokenLength;
			return true;
		default:
			addFreeform();
			return false;
	}
}
function parseJSON(input) {
	try {
		return JSON.parse(input);
	} catch {
		return null;
	}
}
function nextToken() {
	const matches = tokenizer.exec(document);
	if (null === matches) return [
		"no-more-tokens",
		"",
		null,
		0,
		0
	];
	const startedAt = matches.index;
	const [match, closerMatch, namespaceMatch, nameMatch, attrsMatch, , voidMatch] = matches;
	const length = match.length;
	const isCloser = !!closerMatch;
	const isVoid = !!voidMatch;
	const name = (namespaceMatch || "core/") + nameMatch;
	const hasAttrs = !!attrsMatch;
	const attrs = hasAttrs ? parseJSON(attrsMatch) : {};
	if (isCloser && (isVoid || hasAttrs)) {}
	if (isVoid) return [
		"void-block",
		name,
		attrs,
		startedAt,
		length
	];
	if (isCloser) return [
		"block-closer",
		name,
		null,
		startedAt,
		length
	];
	return [
		"block-opener",
		name,
		attrs,
		startedAt,
		length
	];
}
function addFreeform(rawLength) {
	const length = rawLength ? rawLength : document.length - offset;
	if (0 === length) return;
	output.push(Freeform(document.substr(offset, length)));
}
function addInnerBlock(block, tokenStart, tokenLength, lastOffset) {
	const parent = stack[stack.length - 1];
	parent.block.innerBlocks.push(block);
	const html = document.substr(parent.prevOffset, tokenStart - parent.prevOffset);
	if (html) {
		parent.block.innerHTML += html;
		parent.block.innerContent.push(html);
	}
	parent.block.innerContent.push(null);
	parent.prevOffset = lastOffset ? lastOffset : tokenStart + tokenLength;
}
function addBlockFromStack(endOffset) {
	const { block, leadingHtmlStart, prevOffset, tokenStart } = stack.pop();
	const html = endOffset ? document.substr(prevOffset, endOffset - prevOffset) : document.substr(prevOffset);
	if (html) {
		block.innerHTML += html;
		block.innerContent.push(html);
	}
	if (null !== leadingHtmlStart) output.push(Freeform(document.substr(leadingHtmlStart, tokenStart - leadingHtmlStart)));
	output.push(block);
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/unicode.js
var UNDEFINED_CODE_POINTS = /* @__PURE__ */ new Set([
	65534,
	65535,
	131070,
	131071,
	196606,
	196607,
	262142,
	262143,
	327678,
	327679,
	393214,
	393215,
	458750,
	458751,
	524286,
	524287,
	589822,
	589823,
	655358,
	655359,
	720894,
	720895,
	786430,
	786431,
	851966,
	851967,
	917502,
	917503,
	983038,
	983039,
	1048574,
	1048575,
	1114110,
	1114111
]);
var CODE_POINTS;
(function(CODE_POINTS) {
	CODE_POINTS[CODE_POINTS["EOF"] = -1] = "EOF";
	CODE_POINTS[CODE_POINTS["NULL"] = 0] = "NULL";
	CODE_POINTS[CODE_POINTS["TABULATION"] = 9] = "TABULATION";
	CODE_POINTS[CODE_POINTS["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
	CODE_POINTS[CODE_POINTS["LINE_FEED"] = 10] = "LINE_FEED";
	CODE_POINTS[CODE_POINTS["FORM_FEED"] = 12] = "FORM_FEED";
	CODE_POINTS[CODE_POINTS["SPACE"] = 32] = "SPACE";
	CODE_POINTS[CODE_POINTS["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
	CODE_POINTS[CODE_POINTS["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
	CODE_POINTS[CODE_POINTS["AMPERSAND"] = 38] = "AMPERSAND";
	CODE_POINTS[CODE_POINTS["APOSTROPHE"] = 39] = "APOSTROPHE";
	CODE_POINTS[CODE_POINTS["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
	CODE_POINTS[CODE_POINTS["SOLIDUS"] = 47] = "SOLIDUS";
	CODE_POINTS[CODE_POINTS["DIGIT_0"] = 48] = "DIGIT_0";
	CODE_POINTS[CODE_POINTS["DIGIT_9"] = 57] = "DIGIT_9";
	CODE_POINTS[CODE_POINTS["SEMICOLON"] = 59] = "SEMICOLON";
	CODE_POINTS[CODE_POINTS["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
	CODE_POINTS[CODE_POINTS["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
	CODE_POINTS[CODE_POINTS["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
	CODE_POINTS[CODE_POINTS["QUESTION_MARK"] = 63] = "QUESTION_MARK";
	CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
	CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
	CODE_POINTS[CODE_POINTS["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
	CODE_POINTS[CODE_POINTS["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
	CODE_POINTS[CODE_POINTS["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
	CODE_POINTS[CODE_POINTS["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
})(CODE_POINTS || (CODE_POINTS = {}));
var SEQUENCES = {
	DASH_DASH: "--",
	CDATA_START: "[CDATA[",
	DOCTYPE: "doctype",
	SCRIPT: "script",
	PUBLIC: "public",
	SYSTEM: "system"
};
function isSurrogate(cp) {
	return cp >= 55296 && cp <= 57343;
}
function isSurrogatePair(cp) {
	return cp >= 56320 && cp <= 57343;
}
function getSurrogatePairCodePoint(cp1, cp2) {
	return (cp1 - 55296) * 1024 + 9216 + cp2;
}
function isControlCodePoint(cp) {
	return cp !== 32 && cp !== 10 && cp !== 13 && cp !== 9 && cp !== 12 && cp >= 1 && cp <= 31 || cp >= 127 && cp <= 159;
}
function isUndefinedCodePoint(cp) {
	return cp >= 64976 && cp <= 65007 || UNDEFINED_CODE_POINTS.has(cp);
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/error-codes.js
var ERR;
(function(ERR) {
	ERR["controlCharacterInInputStream"] = "control-character-in-input-stream";
	ERR["noncharacterInInputStream"] = "noncharacter-in-input-stream";
	ERR["surrogateInInputStream"] = "surrogate-in-input-stream";
	ERR["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
	ERR["endTagWithAttributes"] = "end-tag-with-attributes";
	ERR["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
	ERR["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
	ERR["unexpectedNullCharacter"] = "unexpected-null-character";
	ERR["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
	ERR["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
	ERR["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
	ERR["missingEndTagName"] = "missing-end-tag-name";
	ERR["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
	ERR["unknownNamedCharacterReference"] = "unknown-named-character-reference";
	ERR["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
	ERR["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
	ERR["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
	ERR["eofBeforeTagName"] = "eof-before-tag-name";
	ERR["eofInTag"] = "eof-in-tag";
	ERR["missingAttributeValue"] = "missing-attribute-value";
	ERR["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
	ERR["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
	ERR["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
	ERR["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
	ERR["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
	ERR["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
	ERR["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
	ERR["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
	ERR["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
	ERR["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
	ERR["cdataInHtmlContent"] = "cdata-in-html-content";
	ERR["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
	ERR["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
	ERR["eofInDoctype"] = "eof-in-doctype";
	ERR["nestedComment"] = "nested-comment";
	ERR["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
	ERR["eofInComment"] = "eof-in-comment";
	ERR["incorrectlyClosedComment"] = "incorrectly-closed-comment";
	ERR["eofInCdata"] = "eof-in-cdata";
	ERR["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
	ERR["nullCharacterReference"] = "null-character-reference";
	ERR["surrogateCharacterReference"] = "surrogate-character-reference";
	ERR["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
	ERR["controlCharacterReference"] = "control-character-reference";
	ERR["noncharacterCharacterReference"] = "noncharacter-character-reference";
	ERR["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
	ERR["missingDoctypeName"] = "missing-doctype-name";
	ERR["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
	ERR["duplicateAttribute"] = "duplicate-attribute";
	ERR["nonConformingDoctype"] = "non-conforming-doctype";
	ERR["missingDoctype"] = "missing-doctype";
	ERR["misplacedDoctype"] = "misplaced-doctype";
	ERR["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
	ERR["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
	ERR["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
	ERR["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
	ERR["abandonedHeadElementChild"] = "abandoned-head-element-child";
	ERR["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
	ERR["nestedNoscriptInHead"] = "nested-noscript-in-head";
	ERR["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tokenizer/preprocessor.js
var DEFAULT_BUFFER_WATERLINE = 65536;
var Preprocessor = class {
	constructor(handler) {
		this.handler = handler;
		this.html = "";
		this.pos = -1;
		this.lastGapPos = -2;
		this.gapStack = [];
		this.skipNextNewLine = false;
		this.lastChunkWritten = false;
		this.endOfChunkHit = false;
		this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
		this.isEol = false;
		this.lineStartPos = 0;
		this.droppedBufferSize = 0;
		this.line = 1;
		this.lastErrOffset = -1;
	}
	/** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */
	get col() {
		return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
	}
	get offset() {
		return this.droppedBufferSize + this.pos;
	}
	getError(code, cpOffset) {
		const { line, col, offset } = this;
		const startCol = col + cpOffset;
		const startOffset = offset + cpOffset;
		return {
			code,
			startLine: line,
			endLine: line,
			startCol,
			endCol: startCol,
			startOffset,
			endOffset: startOffset
		};
	}
	_err(code) {
		if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
			this.lastErrOffset = this.offset;
			this.handler.onParseError(this.getError(code, 0));
		}
	}
	_addGap() {
		this.gapStack.push(this.lastGapPos);
		this.lastGapPos = this.pos;
	}
	_processSurrogate(cp) {
		if (this.pos !== this.html.length - 1) {
			const nextCp = this.html.charCodeAt(this.pos + 1);
			if (isSurrogatePair(nextCp)) {
				this.pos++;
				this._addGap();
				return getSurrogatePairCodePoint(cp, nextCp);
			}
		} else if (!this.lastChunkWritten) {
			this.endOfChunkHit = true;
			return CODE_POINTS.EOF;
		}
		this._err(ERR.surrogateInInputStream);
		return cp;
	}
	willDropParsedChunk() {
		return this.pos > this.bufferWaterline;
	}
	dropParsedChunk() {
		if (this.willDropParsedChunk()) {
			this.html = this.html.substring(this.pos);
			this.lineStartPos -= this.pos;
			this.droppedBufferSize += this.pos;
			this.pos = 0;
			this.lastGapPos = -2;
			this.gapStack.length = 0;
		}
	}
	write(chunk, isLastChunk) {
		if (this.html.length > 0) this.html += chunk;
		else this.html = chunk;
		this.endOfChunkHit = false;
		this.lastChunkWritten = isLastChunk;
	}
	insertHtmlAtCurrentPos(chunk) {
		this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
		this.endOfChunkHit = false;
	}
	startsWith(pattern, caseSensitive) {
		if (this.pos + pattern.length > this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return false;
		}
		if (caseSensitive) return this.html.startsWith(pattern, this.pos);
		for (let i = 0; i < pattern.length; i++) if ((this.html.charCodeAt(this.pos + i) | 32) !== pattern.charCodeAt(i)) return false;
		return true;
	}
	peek(offset) {
		const pos = this.pos + offset;
		if (pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		const code = this.html.charCodeAt(pos);
		return code === CODE_POINTS.CARRIAGE_RETURN ? CODE_POINTS.LINE_FEED : code;
	}
	advance() {
		this.pos++;
		if (this.isEol) {
			this.isEol = false;
			this.line++;
			this.lineStartPos = this.pos;
		}
		if (this.pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		let cp = this.html.charCodeAt(this.pos);
		if (cp === CODE_POINTS.CARRIAGE_RETURN) {
			this.isEol = true;
			this.skipNextNewLine = true;
			return CODE_POINTS.LINE_FEED;
		}
		if (cp === CODE_POINTS.LINE_FEED) {
			this.isEol = true;
			if (this.skipNextNewLine) {
				this.line--;
				this.skipNextNewLine = false;
				this._addGap();
				return this.advance();
			}
		}
		this.skipNextNewLine = false;
		if (isSurrogate(cp)) cp = this._processSurrogate(cp);
		if (!(this.handler.onParseError === null || cp > 31 && cp < 127 || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.CARRIAGE_RETURN || cp > 159 && cp < 64976)) this._checkForProblematicCharacters(cp);
		return cp;
	}
	_checkForProblematicCharacters(cp) {
		if (isControlCodePoint(cp)) this._err(ERR.controlCharacterInInputStream);
		else if (isUndefinedCodePoint(cp)) this._err(ERR.noncharacterInInputStream);
	}
	retreat(count) {
		this.pos -= count;
		while (this.pos < this.lastGapPos) {
			this.lastGapPos = this.gapStack.pop();
			this.pos--;
		}
		this.isEol = false;
	}
};
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/token.js
var TokenType;
(function(TokenType) {
	TokenType[TokenType["CHARACTER"] = 0] = "CHARACTER";
	TokenType[TokenType["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
	TokenType[TokenType["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
	TokenType[TokenType["START_TAG"] = 3] = "START_TAG";
	TokenType[TokenType["END_TAG"] = 4] = "END_TAG";
	TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
	TokenType[TokenType["DOCTYPE"] = 6] = "DOCTYPE";
	TokenType[TokenType["EOF"] = 7] = "EOF";
	TokenType[TokenType["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));
function getTokenAttr(token, attrName) {
	for (let i = token.attrs.length - 1; i >= 0; i--) if (token.attrs[i].name === attrName) return token.attrs[i].value;
	return null;
}
//#endregion
//#region node_modules/.pnpm/entities@6.0.1/node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree = /* #__PURE__ */ new Uint16Array(/* #__PURE__ */ "ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((c) => c.charCodeAt(0)));
var decodeMap = /* @__PURE__ */ new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]);
String.fromCodePoint;
/**
* Replace the given code point with a replacement character if it is a
* surrogate or is outside the valid range. Otherwise return the code
* point unchanged.
*/
function replaceCodePoint(codePoint) {
	var _a;
	if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
	return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
//#endregion
//#region node_modules/.pnpm/entities@6.0.1/node_modules/entities/dist/esm/decode.js
var CharCodes;
(function(CharCodes) {
	CharCodes[CharCodes["NUM"] = 35] = "NUM";
	CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
	CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
	CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
	CharCodes[CharCodes["NINE"] = 57] = "NINE";
	CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
	CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
	CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
	CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
	CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
	CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
	CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */
var TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags) {
	BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
	BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
	BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code) {
	return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric$1(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
/**
* Checks if the given character is a valid end character for an entity in an attribute.
*
* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
*/
function isEntityInAttributeInvalidEnd(code) {
	return code === CharCodes.EQUALS || isAsciiAlphaNumeric$1(code);
}
var EntityDecoderState;
(function(EntityDecoderState) {
	EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
	EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
	EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
	EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
	EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode) {
	/** Entities in text nodes that can end with any character. */
	DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
	/** Only allow entities terminated with a semicolon. */
	DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
	/** Entities in attributes have limitations on ending characters. */
	DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
/**
* Token decoder with support of writing partial entities.
*/
var EntityDecoder = class {
	constructor(decodeTree, emitCodePoint, errors) {
		this.decodeTree = decodeTree;
		this.emitCodePoint = emitCodePoint;
		this.errors = errors;
		/** The current state of the decoder. */
		this.state = EntityDecoderState.EntityStart;
		/** Characters that were consumed while parsing an entity. */
		this.consumed = 1;
		/**
		* The result of the entity.
		*
		* Either the result index of a numeric entity, or the codepoint of a
		* numeric entity.
		*/
		this.result = 0;
		/** The current index in the decode tree. */
		this.treeIndex = 0;
		/** The number of characters that were consumed in excess. */
		this.excess = 1;
		/** The mode in which the decoder is operating. */
		this.decodeMode = DecodingMode.Strict;
	}
	/** Resets the instance to make it reusable. */
	startEntity(decodeMode) {
		this.decodeMode = decodeMode;
		this.state = EntityDecoderState.EntityStart;
		this.result = 0;
		this.treeIndex = 0;
		this.excess = 1;
		this.consumed = 1;
	}
	/**
	* Write an entity to the decoder. This can be called multiple times with partial entities.
	* If the entity is incomplete, the decoder will return -1.
	*
	* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
	* entity is incomplete, and resume when the next string is written.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	write(input, offset) {
		switch (this.state) {
			case EntityDecoderState.EntityStart:
				if (input.charCodeAt(offset) === CharCodes.NUM) {
					this.state = EntityDecoderState.NumericStart;
					this.consumed += 1;
					return this.stateNumericStart(input, offset + 1);
				}
				this.state = EntityDecoderState.NamedEntity;
				return this.stateNamedEntity(input, offset);
			case EntityDecoderState.NumericStart: return this.stateNumericStart(input, offset);
			case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(input, offset);
			case EntityDecoderState.NumericHex: return this.stateNumericHex(input, offset);
			case EntityDecoderState.NamedEntity: return this.stateNamedEntity(input, offset);
		}
	}
	/**
	* Switches between the numeric decimal and hexadecimal states.
	*
	* Equivalent to the `Numeric character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericStart(input, offset) {
		if (offset >= input.length) return -1;
		if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
			this.state = EntityDecoderState.NumericHex;
			this.consumed += 1;
			return this.stateNumericHex(input, offset + 1);
		}
		this.state = EntityDecoderState.NumericDecimal;
		return this.stateNumericDecimal(input, offset);
	}
	addToNumericResult(input, start, end, base) {
		if (start !== end) {
			const digitCount = end - start;
			this.result = this.result * Math.pow(base, digitCount) + Number.parseInt(input.substr(start, digitCount), base);
			this.consumed += digitCount;
		}
	}
	/**
	* Parses a hexadecimal numeric entity.
	*
	* Equivalent to the `Hexademical character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericHex(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char) || isHexadecimalCharacter(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 16);
				return this.emitNumericEntity(char, 3);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 16);
		return -1;
	}
	/**
	* Parses a decimal numeric entity.
	*
	* Equivalent to the `Decimal character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericDecimal(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 10);
				return this.emitNumericEntity(char, 2);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 10);
		return -1;
	}
	/**
	* Validate and emit a numeric entity.
	*
	* Implements the logic from the `Hexademical character reference start
	* state` and `Numeric character reference end state` in the HTML spec.
	*
	* @param lastCp The last code point of the entity. Used to see if the
	*               entity was terminated with a semicolon.
	* @param expectedLength The minimum number of characters that should be
	*                       consumed. Used to validate that at least one digit
	*                       was consumed.
	* @returns The number of characters that were consumed.
	*/
	emitNumericEntity(lastCp, expectedLength) {
		var _a;
		if (this.consumed <= expectedLength) {
			(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
			return 0;
		}
		if (lastCp === CharCodes.SEMI) this.consumed += 1;
		else if (this.decodeMode === DecodingMode.Strict) return 0;
		this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
		if (this.errors) {
			if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
			this.errors.validateNumericCharacterReference(this.result);
		}
		return this.consumed;
	}
	/**
	* Parses a named entity.
	*
	* Equivalent to the `Named character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNamedEntity(input, offset) {
		const { decodeTree } = this;
		let current = decodeTree[this.treeIndex];
		let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
		for (; offset < input.length; offset++, this.excess++) {
			const char = input.charCodeAt(offset);
			this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
			if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
			current = decodeTree[this.treeIndex];
			valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			if (valueLength !== 0) {
				if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
				if (this.decodeMode !== DecodingMode.Strict) {
					this.result = this.treeIndex;
					this.consumed += this.excess;
					this.excess = 0;
				}
			}
		}
		return -1;
	}
	/**
	* Emit a named entity that was not terminated with a semicolon.
	*
	* @returns The number of characters consumed.
	*/
	emitNotTerminatedNamedEntity() {
		var _a;
		const { result, decodeTree } = this;
		const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
		this.emitNamedEntityData(result, valueLength, this.consumed);
		(_a = this.errors) === null || _a === void 0 || _a.missingSemicolonAfterCharacterReference();
		return this.consumed;
	}
	/**
	* Emit a named entity.
	*
	* @param result The index of the entity in the decode tree.
	* @param valueLength The number of bytes in the entity.
	* @param consumed The number of characters consumed.
	*
	* @returns The number of characters consumed.
	*/
	emitNamedEntityData(result, valueLength, consumed) {
		const { decodeTree } = this;
		this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
		if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
		return consumed;
	}
	/**
	* Signal to the parser that the end of the input was reached.
	*
	* Remaining data will be emitted and relevant errors will be produced.
	*
	* @returns The number of characters consumed.
	*/
	end() {
		var _a;
		switch (this.state) {
			case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
			case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
			case EntityDecoderState.NumericStart:
				(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			case EntityDecoderState.EntityStart: return 0;
		}
	}
};
/**
* Determines the branch of the current node that is taken given the current
* character. This function is used to traverse the trie.
*
* @param decodeTree The trie.
* @param current The current node.
* @param nodeIdx The index right after the current node and its value.
* @param char The current character.
* @returns The index of the next node, or -1 if no branch is taken.
*/
function determineBranch(decodeTree, current, nodeIndex, char) {
	const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
	const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
	if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
	if (jumpOffset) {
		const value = char - jumpOffset;
		return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
	}
	let lo = nodeIndex;
	let hi = lo + branchCount - 1;
	while (lo <= hi) {
		const mid = lo + hi >>> 1;
		const midValue = decodeTree[mid];
		if (midValue < char) lo = mid + 1;
		else if (midValue > char) hi = mid - 1;
		else return decodeTree[mid + branchCount];
	}
	return -1;
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/html.js
/** All valid namespaces in HTML. */
var NS;
(function(NS) {
	NS["HTML"] = "http://www.w3.org/1999/xhtml";
	NS["MATHML"] = "http://www.w3.org/1998/Math/MathML";
	NS["SVG"] = "http://www.w3.org/2000/svg";
	NS["XLINK"] = "http://www.w3.org/1999/xlink";
	NS["XML"] = "http://www.w3.org/XML/1998/namespace";
	NS["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS || (NS = {}));
var ATTRS;
(function(ATTRS) {
	ATTRS["TYPE"] = "type";
	ATTRS["ACTION"] = "action";
	ATTRS["ENCODING"] = "encoding";
	ATTRS["PROMPT"] = "prompt";
	ATTRS["NAME"] = "name";
	ATTRS["COLOR"] = "color";
	ATTRS["FACE"] = "face";
	ATTRS["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
/**
* The mode of the document.
*
* @see {@link https://dom.spec.whatwg.org/#concept-document-limited-quirks}
*/
var DOCUMENT_MODE;
(function(DOCUMENT_MODE) {
	DOCUMENT_MODE["NO_QUIRKS"] = "no-quirks";
	DOCUMENT_MODE["QUIRKS"] = "quirks";
	DOCUMENT_MODE["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function(TAG_NAMES) {
	TAG_NAMES["A"] = "a";
	TAG_NAMES["ADDRESS"] = "address";
	TAG_NAMES["ANNOTATION_XML"] = "annotation-xml";
	TAG_NAMES["APPLET"] = "applet";
	TAG_NAMES["AREA"] = "area";
	TAG_NAMES["ARTICLE"] = "article";
	TAG_NAMES["ASIDE"] = "aside";
	TAG_NAMES["B"] = "b";
	TAG_NAMES["BASE"] = "base";
	TAG_NAMES["BASEFONT"] = "basefont";
	TAG_NAMES["BGSOUND"] = "bgsound";
	TAG_NAMES["BIG"] = "big";
	TAG_NAMES["BLOCKQUOTE"] = "blockquote";
	TAG_NAMES["BODY"] = "body";
	TAG_NAMES["BR"] = "br";
	TAG_NAMES["BUTTON"] = "button";
	TAG_NAMES["CAPTION"] = "caption";
	TAG_NAMES["CENTER"] = "center";
	TAG_NAMES["CODE"] = "code";
	TAG_NAMES["COL"] = "col";
	TAG_NAMES["COLGROUP"] = "colgroup";
	TAG_NAMES["DD"] = "dd";
	TAG_NAMES["DESC"] = "desc";
	TAG_NAMES["DETAILS"] = "details";
	TAG_NAMES["DIALOG"] = "dialog";
	TAG_NAMES["DIR"] = "dir";
	TAG_NAMES["DIV"] = "div";
	TAG_NAMES["DL"] = "dl";
	TAG_NAMES["DT"] = "dt";
	TAG_NAMES["EM"] = "em";
	TAG_NAMES["EMBED"] = "embed";
	TAG_NAMES["FIELDSET"] = "fieldset";
	TAG_NAMES["FIGCAPTION"] = "figcaption";
	TAG_NAMES["FIGURE"] = "figure";
	TAG_NAMES["FONT"] = "font";
	TAG_NAMES["FOOTER"] = "footer";
	TAG_NAMES["FOREIGN_OBJECT"] = "foreignObject";
	TAG_NAMES["FORM"] = "form";
	TAG_NAMES["FRAME"] = "frame";
	TAG_NAMES["FRAMESET"] = "frameset";
	TAG_NAMES["H1"] = "h1";
	TAG_NAMES["H2"] = "h2";
	TAG_NAMES["H3"] = "h3";
	TAG_NAMES["H4"] = "h4";
	TAG_NAMES["H5"] = "h5";
	TAG_NAMES["H6"] = "h6";
	TAG_NAMES["HEAD"] = "head";
	TAG_NAMES["HEADER"] = "header";
	TAG_NAMES["HGROUP"] = "hgroup";
	TAG_NAMES["HR"] = "hr";
	TAG_NAMES["HTML"] = "html";
	TAG_NAMES["I"] = "i";
	TAG_NAMES["IMG"] = "img";
	TAG_NAMES["IMAGE"] = "image";
	TAG_NAMES["INPUT"] = "input";
	TAG_NAMES["IFRAME"] = "iframe";
	TAG_NAMES["KEYGEN"] = "keygen";
	TAG_NAMES["LABEL"] = "label";
	TAG_NAMES["LI"] = "li";
	TAG_NAMES["LINK"] = "link";
	TAG_NAMES["LISTING"] = "listing";
	TAG_NAMES["MAIN"] = "main";
	TAG_NAMES["MALIGNMARK"] = "malignmark";
	TAG_NAMES["MARQUEE"] = "marquee";
	TAG_NAMES["MATH"] = "math";
	TAG_NAMES["MENU"] = "menu";
	TAG_NAMES["META"] = "meta";
	TAG_NAMES["MGLYPH"] = "mglyph";
	TAG_NAMES["MI"] = "mi";
	TAG_NAMES["MO"] = "mo";
	TAG_NAMES["MN"] = "mn";
	TAG_NAMES["MS"] = "ms";
	TAG_NAMES["MTEXT"] = "mtext";
	TAG_NAMES["NAV"] = "nav";
	TAG_NAMES["NOBR"] = "nobr";
	TAG_NAMES["NOFRAMES"] = "noframes";
	TAG_NAMES["NOEMBED"] = "noembed";
	TAG_NAMES["NOSCRIPT"] = "noscript";
	TAG_NAMES["OBJECT"] = "object";
	TAG_NAMES["OL"] = "ol";
	TAG_NAMES["OPTGROUP"] = "optgroup";
	TAG_NAMES["OPTION"] = "option";
	TAG_NAMES["P"] = "p";
	TAG_NAMES["PARAM"] = "param";
	TAG_NAMES["PLAINTEXT"] = "plaintext";
	TAG_NAMES["PRE"] = "pre";
	TAG_NAMES["RB"] = "rb";
	TAG_NAMES["RP"] = "rp";
	TAG_NAMES["RT"] = "rt";
	TAG_NAMES["RTC"] = "rtc";
	TAG_NAMES["RUBY"] = "ruby";
	TAG_NAMES["S"] = "s";
	TAG_NAMES["SCRIPT"] = "script";
	TAG_NAMES["SEARCH"] = "search";
	TAG_NAMES["SECTION"] = "section";
	TAG_NAMES["SELECT"] = "select";
	TAG_NAMES["SOURCE"] = "source";
	TAG_NAMES["SMALL"] = "small";
	TAG_NAMES["SPAN"] = "span";
	TAG_NAMES["STRIKE"] = "strike";
	TAG_NAMES["STRONG"] = "strong";
	TAG_NAMES["STYLE"] = "style";
	TAG_NAMES["SUB"] = "sub";
	TAG_NAMES["SUMMARY"] = "summary";
	TAG_NAMES["SUP"] = "sup";
	TAG_NAMES["TABLE"] = "table";
	TAG_NAMES["TBODY"] = "tbody";
	TAG_NAMES["TEMPLATE"] = "template";
	TAG_NAMES["TEXTAREA"] = "textarea";
	TAG_NAMES["TFOOT"] = "tfoot";
	TAG_NAMES["TD"] = "td";
	TAG_NAMES["TH"] = "th";
	TAG_NAMES["THEAD"] = "thead";
	TAG_NAMES["TITLE"] = "title";
	TAG_NAMES["TR"] = "tr";
	TAG_NAMES["TRACK"] = "track";
	TAG_NAMES["TT"] = "tt";
	TAG_NAMES["U"] = "u";
	TAG_NAMES["UL"] = "ul";
	TAG_NAMES["SVG"] = "svg";
	TAG_NAMES["VAR"] = "var";
	TAG_NAMES["WBR"] = "wbr";
	TAG_NAMES["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
/**
* Tag IDs are numeric IDs for known tag names.
*
* We use tag IDs to improve the performance of tag name comparisons.
*/
var TAG_ID;
(function(TAG_ID) {
	TAG_ID[TAG_ID["UNKNOWN"] = 0] = "UNKNOWN";
	TAG_ID[TAG_ID["A"] = 1] = "A";
	TAG_ID[TAG_ID["ADDRESS"] = 2] = "ADDRESS";
	TAG_ID[TAG_ID["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
	TAG_ID[TAG_ID["APPLET"] = 4] = "APPLET";
	TAG_ID[TAG_ID["AREA"] = 5] = "AREA";
	TAG_ID[TAG_ID["ARTICLE"] = 6] = "ARTICLE";
	TAG_ID[TAG_ID["ASIDE"] = 7] = "ASIDE";
	TAG_ID[TAG_ID["B"] = 8] = "B";
	TAG_ID[TAG_ID["BASE"] = 9] = "BASE";
	TAG_ID[TAG_ID["BASEFONT"] = 10] = "BASEFONT";
	TAG_ID[TAG_ID["BGSOUND"] = 11] = "BGSOUND";
	TAG_ID[TAG_ID["BIG"] = 12] = "BIG";
	TAG_ID[TAG_ID["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
	TAG_ID[TAG_ID["BODY"] = 14] = "BODY";
	TAG_ID[TAG_ID["BR"] = 15] = "BR";
	TAG_ID[TAG_ID["BUTTON"] = 16] = "BUTTON";
	TAG_ID[TAG_ID["CAPTION"] = 17] = "CAPTION";
	TAG_ID[TAG_ID["CENTER"] = 18] = "CENTER";
	TAG_ID[TAG_ID["CODE"] = 19] = "CODE";
	TAG_ID[TAG_ID["COL"] = 20] = "COL";
	TAG_ID[TAG_ID["COLGROUP"] = 21] = "COLGROUP";
	TAG_ID[TAG_ID["DD"] = 22] = "DD";
	TAG_ID[TAG_ID["DESC"] = 23] = "DESC";
	TAG_ID[TAG_ID["DETAILS"] = 24] = "DETAILS";
	TAG_ID[TAG_ID["DIALOG"] = 25] = "DIALOG";
	TAG_ID[TAG_ID["DIR"] = 26] = "DIR";
	TAG_ID[TAG_ID["DIV"] = 27] = "DIV";
	TAG_ID[TAG_ID["DL"] = 28] = "DL";
	TAG_ID[TAG_ID["DT"] = 29] = "DT";
	TAG_ID[TAG_ID["EM"] = 30] = "EM";
	TAG_ID[TAG_ID["EMBED"] = 31] = "EMBED";
	TAG_ID[TAG_ID["FIELDSET"] = 32] = "FIELDSET";
	TAG_ID[TAG_ID["FIGCAPTION"] = 33] = "FIGCAPTION";
	TAG_ID[TAG_ID["FIGURE"] = 34] = "FIGURE";
	TAG_ID[TAG_ID["FONT"] = 35] = "FONT";
	TAG_ID[TAG_ID["FOOTER"] = 36] = "FOOTER";
	TAG_ID[TAG_ID["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
	TAG_ID[TAG_ID["FORM"] = 38] = "FORM";
	TAG_ID[TAG_ID["FRAME"] = 39] = "FRAME";
	TAG_ID[TAG_ID["FRAMESET"] = 40] = "FRAMESET";
	TAG_ID[TAG_ID["H1"] = 41] = "H1";
	TAG_ID[TAG_ID["H2"] = 42] = "H2";
	TAG_ID[TAG_ID["H3"] = 43] = "H3";
	TAG_ID[TAG_ID["H4"] = 44] = "H4";
	TAG_ID[TAG_ID["H5"] = 45] = "H5";
	TAG_ID[TAG_ID["H6"] = 46] = "H6";
	TAG_ID[TAG_ID["HEAD"] = 47] = "HEAD";
	TAG_ID[TAG_ID["HEADER"] = 48] = "HEADER";
	TAG_ID[TAG_ID["HGROUP"] = 49] = "HGROUP";
	TAG_ID[TAG_ID["HR"] = 50] = "HR";
	TAG_ID[TAG_ID["HTML"] = 51] = "HTML";
	TAG_ID[TAG_ID["I"] = 52] = "I";
	TAG_ID[TAG_ID["IMG"] = 53] = "IMG";
	TAG_ID[TAG_ID["IMAGE"] = 54] = "IMAGE";
	TAG_ID[TAG_ID["INPUT"] = 55] = "INPUT";
	TAG_ID[TAG_ID["IFRAME"] = 56] = "IFRAME";
	TAG_ID[TAG_ID["KEYGEN"] = 57] = "KEYGEN";
	TAG_ID[TAG_ID["LABEL"] = 58] = "LABEL";
	TAG_ID[TAG_ID["LI"] = 59] = "LI";
	TAG_ID[TAG_ID["LINK"] = 60] = "LINK";
	TAG_ID[TAG_ID["LISTING"] = 61] = "LISTING";
	TAG_ID[TAG_ID["MAIN"] = 62] = "MAIN";
	TAG_ID[TAG_ID["MALIGNMARK"] = 63] = "MALIGNMARK";
	TAG_ID[TAG_ID["MARQUEE"] = 64] = "MARQUEE";
	TAG_ID[TAG_ID["MATH"] = 65] = "MATH";
	TAG_ID[TAG_ID["MENU"] = 66] = "MENU";
	TAG_ID[TAG_ID["META"] = 67] = "META";
	TAG_ID[TAG_ID["MGLYPH"] = 68] = "MGLYPH";
	TAG_ID[TAG_ID["MI"] = 69] = "MI";
	TAG_ID[TAG_ID["MO"] = 70] = "MO";
	TAG_ID[TAG_ID["MN"] = 71] = "MN";
	TAG_ID[TAG_ID["MS"] = 72] = "MS";
	TAG_ID[TAG_ID["MTEXT"] = 73] = "MTEXT";
	TAG_ID[TAG_ID["NAV"] = 74] = "NAV";
	TAG_ID[TAG_ID["NOBR"] = 75] = "NOBR";
	TAG_ID[TAG_ID["NOFRAMES"] = 76] = "NOFRAMES";
	TAG_ID[TAG_ID["NOEMBED"] = 77] = "NOEMBED";
	TAG_ID[TAG_ID["NOSCRIPT"] = 78] = "NOSCRIPT";
	TAG_ID[TAG_ID["OBJECT"] = 79] = "OBJECT";
	TAG_ID[TAG_ID["OL"] = 80] = "OL";
	TAG_ID[TAG_ID["OPTGROUP"] = 81] = "OPTGROUP";
	TAG_ID[TAG_ID["OPTION"] = 82] = "OPTION";
	TAG_ID[TAG_ID["P"] = 83] = "P";
	TAG_ID[TAG_ID["PARAM"] = 84] = "PARAM";
	TAG_ID[TAG_ID["PLAINTEXT"] = 85] = "PLAINTEXT";
	TAG_ID[TAG_ID["PRE"] = 86] = "PRE";
	TAG_ID[TAG_ID["RB"] = 87] = "RB";
	TAG_ID[TAG_ID["RP"] = 88] = "RP";
	TAG_ID[TAG_ID["RT"] = 89] = "RT";
	TAG_ID[TAG_ID["RTC"] = 90] = "RTC";
	TAG_ID[TAG_ID["RUBY"] = 91] = "RUBY";
	TAG_ID[TAG_ID["S"] = 92] = "S";
	TAG_ID[TAG_ID["SCRIPT"] = 93] = "SCRIPT";
	TAG_ID[TAG_ID["SEARCH"] = 94] = "SEARCH";
	TAG_ID[TAG_ID["SECTION"] = 95] = "SECTION";
	TAG_ID[TAG_ID["SELECT"] = 96] = "SELECT";
	TAG_ID[TAG_ID["SOURCE"] = 97] = "SOURCE";
	TAG_ID[TAG_ID["SMALL"] = 98] = "SMALL";
	TAG_ID[TAG_ID["SPAN"] = 99] = "SPAN";
	TAG_ID[TAG_ID["STRIKE"] = 100] = "STRIKE";
	TAG_ID[TAG_ID["STRONG"] = 101] = "STRONG";
	TAG_ID[TAG_ID["STYLE"] = 102] = "STYLE";
	TAG_ID[TAG_ID["SUB"] = 103] = "SUB";
	TAG_ID[TAG_ID["SUMMARY"] = 104] = "SUMMARY";
	TAG_ID[TAG_ID["SUP"] = 105] = "SUP";
	TAG_ID[TAG_ID["TABLE"] = 106] = "TABLE";
	TAG_ID[TAG_ID["TBODY"] = 107] = "TBODY";
	TAG_ID[TAG_ID["TEMPLATE"] = 108] = "TEMPLATE";
	TAG_ID[TAG_ID["TEXTAREA"] = 109] = "TEXTAREA";
	TAG_ID[TAG_ID["TFOOT"] = 110] = "TFOOT";
	TAG_ID[TAG_ID["TD"] = 111] = "TD";
	TAG_ID[TAG_ID["TH"] = 112] = "TH";
	TAG_ID[TAG_ID["THEAD"] = 113] = "THEAD";
	TAG_ID[TAG_ID["TITLE"] = 114] = "TITLE";
	TAG_ID[TAG_ID["TR"] = 115] = "TR";
	TAG_ID[TAG_ID["TRACK"] = 116] = "TRACK";
	TAG_ID[TAG_ID["TT"] = 117] = "TT";
	TAG_ID[TAG_ID["U"] = 118] = "U";
	TAG_ID[TAG_ID["UL"] = 119] = "UL";
	TAG_ID[TAG_ID["SVG"] = 120] = "SVG";
	TAG_ID[TAG_ID["VAR"] = 121] = "VAR";
	TAG_ID[TAG_ID["WBR"] = 122] = "WBR";
	TAG_ID[TAG_ID["XMP"] = 123] = "XMP";
})(TAG_ID || (TAG_ID = {}));
var TAG_NAME_TO_ID = /* @__PURE__ */ new Map([
	[TAG_NAMES.A, TAG_ID.A],
	[TAG_NAMES.ADDRESS, TAG_ID.ADDRESS],
	[TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML],
	[TAG_NAMES.APPLET, TAG_ID.APPLET],
	[TAG_NAMES.AREA, TAG_ID.AREA],
	[TAG_NAMES.ARTICLE, TAG_ID.ARTICLE],
	[TAG_NAMES.ASIDE, TAG_ID.ASIDE],
	[TAG_NAMES.B, TAG_ID.B],
	[TAG_NAMES.BASE, TAG_ID.BASE],
	[TAG_NAMES.BASEFONT, TAG_ID.BASEFONT],
	[TAG_NAMES.BGSOUND, TAG_ID.BGSOUND],
	[TAG_NAMES.BIG, TAG_ID.BIG],
	[TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE],
	[TAG_NAMES.BODY, TAG_ID.BODY],
	[TAG_NAMES.BR, TAG_ID.BR],
	[TAG_NAMES.BUTTON, TAG_ID.BUTTON],
	[TAG_NAMES.CAPTION, TAG_ID.CAPTION],
	[TAG_NAMES.CENTER, TAG_ID.CENTER],
	[TAG_NAMES.CODE, TAG_ID.CODE],
	[TAG_NAMES.COL, TAG_ID.COL],
	[TAG_NAMES.COLGROUP, TAG_ID.COLGROUP],
	[TAG_NAMES.DD, TAG_ID.DD],
	[TAG_NAMES.DESC, TAG_ID.DESC],
	[TAG_NAMES.DETAILS, TAG_ID.DETAILS],
	[TAG_NAMES.DIALOG, TAG_ID.DIALOG],
	[TAG_NAMES.DIR, TAG_ID.DIR],
	[TAG_NAMES.DIV, TAG_ID.DIV],
	[TAG_NAMES.DL, TAG_ID.DL],
	[TAG_NAMES.DT, TAG_ID.DT],
	[TAG_NAMES.EM, TAG_ID.EM],
	[TAG_NAMES.EMBED, TAG_ID.EMBED],
	[TAG_NAMES.FIELDSET, TAG_ID.FIELDSET],
	[TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION],
	[TAG_NAMES.FIGURE, TAG_ID.FIGURE],
	[TAG_NAMES.FONT, TAG_ID.FONT],
	[TAG_NAMES.FOOTER, TAG_ID.FOOTER],
	[TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT],
	[TAG_NAMES.FORM, TAG_ID.FORM],
	[TAG_NAMES.FRAME, TAG_ID.FRAME],
	[TAG_NAMES.FRAMESET, TAG_ID.FRAMESET],
	[TAG_NAMES.H1, TAG_ID.H1],
	[TAG_NAMES.H2, TAG_ID.H2],
	[TAG_NAMES.H3, TAG_ID.H3],
	[TAG_NAMES.H4, TAG_ID.H4],
	[TAG_NAMES.H5, TAG_ID.H5],
	[TAG_NAMES.H6, TAG_ID.H6],
	[TAG_NAMES.HEAD, TAG_ID.HEAD],
	[TAG_NAMES.HEADER, TAG_ID.HEADER],
	[TAG_NAMES.HGROUP, TAG_ID.HGROUP],
	[TAG_NAMES.HR, TAG_ID.HR],
	[TAG_NAMES.HTML, TAG_ID.HTML],
	[TAG_NAMES.I, TAG_ID.I],
	[TAG_NAMES.IMG, TAG_ID.IMG],
	[TAG_NAMES.IMAGE, TAG_ID.IMAGE],
	[TAG_NAMES.INPUT, TAG_ID.INPUT],
	[TAG_NAMES.IFRAME, TAG_ID.IFRAME],
	[TAG_NAMES.KEYGEN, TAG_ID.KEYGEN],
	[TAG_NAMES.LABEL, TAG_ID.LABEL],
	[TAG_NAMES.LI, TAG_ID.LI],
	[TAG_NAMES.LINK, TAG_ID.LINK],
	[TAG_NAMES.LISTING, TAG_ID.LISTING],
	[TAG_NAMES.MAIN, TAG_ID.MAIN],
	[TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK],
	[TAG_NAMES.MARQUEE, TAG_ID.MARQUEE],
	[TAG_NAMES.MATH, TAG_ID.MATH],
	[TAG_NAMES.MENU, TAG_ID.MENU],
	[TAG_NAMES.META, TAG_ID.META],
	[TAG_NAMES.MGLYPH, TAG_ID.MGLYPH],
	[TAG_NAMES.MI, TAG_ID.MI],
	[TAG_NAMES.MO, TAG_ID.MO],
	[TAG_NAMES.MN, TAG_ID.MN],
	[TAG_NAMES.MS, TAG_ID.MS],
	[TAG_NAMES.MTEXT, TAG_ID.MTEXT],
	[TAG_NAMES.NAV, TAG_ID.NAV],
	[TAG_NAMES.NOBR, TAG_ID.NOBR],
	[TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES],
	[TAG_NAMES.NOEMBED, TAG_ID.NOEMBED],
	[TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT],
	[TAG_NAMES.OBJECT, TAG_ID.OBJECT],
	[TAG_NAMES.OL, TAG_ID.OL],
	[TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP],
	[TAG_NAMES.OPTION, TAG_ID.OPTION],
	[TAG_NAMES.P, TAG_ID.P],
	[TAG_NAMES.PARAM, TAG_ID.PARAM],
	[TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT],
	[TAG_NAMES.PRE, TAG_ID.PRE],
	[TAG_NAMES.RB, TAG_ID.RB],
	[TAG_NAMES.RP, TAG_ID.RP],
	[TAG_NAMES.RT, TAG_ID.RT],
	[TAG_NAMES.RTC, TAG_ID.RTC],
	[TAG_NAMES.RUBY, TAG_ID.RUBY],
	[TAG_NAMES.S, TAG_ID.S],
	[TAG_NAMES.SCRIPT, TAG_ID.SCRIPT],
	[TAG_NAMES.SEARCH, TAG_ID.SEARCH],
	[TAG_NAMES.SECTION, TAG_ID.SECTION],
	[TAG_NAMES.SELECT, TAG_ID.SELECT],
	[TAG_NAMES.SOURCE, TAG_ID.SOURCE],
	[TAG_NAMES.SMALL, TAG_ID.SMALL],
	[TAG_NAMES.SPAN, TAG_ID.SPAN],
	[TAG_NAMES.STRIKE, TAG_ID.STRIKE],
	[TAG_NAMES.STRONG, TAG_ID.STRONG],
	[TAG_NAMES.STYLE, TAG_ID.STYLE],
	[TAG_NAMES.SUB, TAG_ID.SUB],
	[TAG_NAMES.SUMMARY, TAG_ID.SUMMARY],
	[TAG_NAMES.SUP, TAG_ID.SUP],
	[TAG_NAMES.TABLE, TAG_ID.TABLE],
	[TAG_NAMES.TBODY, TAG_ID.TBODY],
	[TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE],
	[TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA],
	[TAG_NAMES.TFOOT, TAG_ID.TFOOT],
	[TAG_NAMES.TD, TAG_ID.TD],
	[TAG_NAMES.TH, TAG_ID.TH],
	[TAG_NAMES.THEAD, TAG_ID.THEAD],
	[TAG_NAMES.TITLE, TAG_ID.TITLE],
	[TAG_NAMES.TR, TAG_ID.TR],
	[TAG_NAMES.TRACK, TAG_ID.TRACK],
	[TAG_NAMES.TT, TAG_ID.TT],
	[TAG_NAMES.U, TAG_ID.U],
	[TAG_NAMES.UL, TAG_ID.UL],
	[TAG_NAMES.SVG, TAG_ID.SVG],
	[TAG_NAMES.VAR, TAG_ID.VAR],
	[TAG_NAMES.WBR, TAG_ID.WBR],
	[TAG_NAMES.XMP, TAG_ID.XMP]
]);
function getTagID(tagName) {
	var _a;
	return (_a = TAG_NAME_TO_ID.get(tagName)) !== null && _a !== void 0 ? _a : TAG_ID.UNKNOWN;
}
var $ = TAG_ID;
var SPECIAL_ELEMENTS = {
	[NS.HTML]: /* @__PURE__ */ new Set([
		$.ADDRESS,
		$.APPLET,
		$.AREA,
		$.ARTICLE,
		$.ASIDE,
		$.BASE,
		$.BASEFONT,
		$.BGSOUND,
		$.BLOCKQUOTE,
		$.BODY,
		$.BR,
		$.BUTTON,
		$.CAPTION,
		$.CENTER,
		$.COL,
		$.COLGROUP,
		$.DD,
		$.DETAILS,
		$.DIR,
		$.DIV,
		$.DL,
		$.DT,
		$.EMBED,
		$.FIELDSET,
		$.FIGCAPTION,
		$.FIGURE,
		$.FOOTER,
		$.FORM,
		$.FRAME,
		$.FRAMESET,
		$.H1,
		$.H2,
		$.H3,
		$.H4,
		$.H5,
		$.H6,
		$.HEAD,
		$.HEADER,
		$.HGROUP,
		$.HR,
		$.HTML,
		$.IFRAME,
		$.IMG,
		$.INPUT,
		$.LI,
		$.LINK,
		$.LISTING,
		$.MAIN,
		$.MARQUEE,
		$.MENU,
		$.META,
		$.NAV,
		$.NOEMBED,
		$.NOFRAMES,
		$.NOSCRIPT,
		$.OBJECT,
		$.OL,
		$.P,
		$.PARAM,
		$.PLAINTEXT,
		$.PRE,
		$.SCRIPT,
		$.SECTION,
		$.SELECT,
		$.SOURCE,
		$.STYLE,
		$.SUMMARY,
		$.TABLE,
		$.TBODY,
		$.TD,
		$.TEMPLATE,
		$.TEXTAREA,
		$.TFOOT,
		$.TH,
		$.THEAD,
		$.TITLE,
		$.TR,
		$.TRACK,
		$.UL,
		$.WBR,
		$.XMP
	]),
	[NS.MATHML]: /* @__PURE__ */ new Set([
		$.MI,
		$.MO,
		$.MN,
		$.MS,
		$.MTEXT,
		$.ANNOTATION_XML
	]),
	[NS.SVG]: /* @__PURE__ */ new Set([
		$.TITLE,
		$.FOREIGN_OBJECT,
		$.DESC
	]),
	[NS.XLINK]: /* @__PURE__ */ new Set(),
	[NS.XML]: /* @__PURE__ */ new Set(),
	[NS.XMLNS]: /* @__PURE__ */ new Set()
};
var NUMBERED_HEADERS = /* @__PURE__ */ new Set([
	$.H1,
	$.H2,
	$.H3,
	$.H4,
	$.H5,
	$.H6
]);
TAG_NAMES.STYLE, TAG_NAMES.SCRIPT, TAG_NAMES.XMP, TAG_NAMES.IFRAME, TAG_NAMES.NOEMBED, TAG_NAMES.NOFRAMES, TAG_NAMES.PLAINTEXT;
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tokenizer/index.js
var State;
(function(State) {
	State[State["DATA"] = 0] = "DATA";
	State[State["RCDATA"] = 1] = "RCDATA";
	State[State["RAWTEXT"] = 2] = "RAWTEXT";
	State[State["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
	State[State["PLAINTEXT"] = 4] = "PLAINTEXT";
	State[State["TAG_OPEN"] = 5] = "TAG_OPEN";
	State[State["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
	State[State["TAG_NAME"] = 7] = "TAG_NAME";
	State[State["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
	State[State["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
	State[State["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
	State[State["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
	State[State["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
	State[State["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
	State[State["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
	State[State["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
	State[State["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
	State[State["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
	State[State["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
	State[State["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
	State[State["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
	State[State["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
	State[State["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
	State[State["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
	State[State["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
	State[State["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
	State[State["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
	State[State["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
	State[State["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
	State[State["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
	State[State["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
	State[State["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
	State[State["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
	State[State["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
	State[State["COMMENT_START"] = 42] = "COMMENT_START";
	State[State["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
	State[State["COMMENT"] = 44] = "COMMENT";
	State[State["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
	State[State["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
	State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
	State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
	State[State["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
	State[State["COMMENT_END"] = 50] = "COMMENT_END";
	State[State["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
	State[State["DOCTYPE"] = 52] = "DOCTYPE";
	State[State["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
	State[State["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
	State[State["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
	State[State["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
	State[State["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
	State[State["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
	State[State["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
	State[State["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
	State[State["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
	State[State["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
	State[State["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
	State[State["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
	State[State["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
	State[State["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
	State[State["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
	State[State["CDATA_SECTION"] = 68] = "CDATA_SECTION";
	State[State["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
	State[State["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
	State[State["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
	State[State["AMBIGUOUS_AMPERSAND"] = 72] = "AMBIGUOUS_AMPERSAND";
})(State || (State = {}));
var TokenizerMode = {
	DATA: State.DATA,
	RCDATA: State.RCDATA,
	RAWTEXT: State.RAWTEXT,
	SCRIPT_DATA: State.SCRIPT_DATA,
	PLAINTEXT: State.PLAINTEXT,
	CDATA_SECTION: State.CDATA_SECTION
};
function isAsciiDigit(cp) {
	return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
}
function isAsciiUpper(cp) {
	return cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z;
}
function isAsciiLower(cp) {
	return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
}
function isAsciiLetter(cp) {
	return isAsciiLower(cp) || isAsciiUpper(cp);
}
function isAsciiAlphaNumeric(cp) {
	return isAsciiLetter(cp) || isAsciiDigit(cp);
}
function toAsciiLower(cp) {
	return cp + 32;
}
function isWhitespace(cp) {
	return cp === CODE_POINTS.SPACE || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.TABULATION || cp === CODE_POINTS.FORM_FEED;
}
function isScriptDataDoubleEscapeSequenceEnd(cp) {
	return isWhitespace(cp) || cp === CODE_POINTS.SOLIDUS || cp === CODE_POINTS.GREATER_THAN_SIGN;
}
function getErrorForNumericCharacterReference(code) {
	if (code === CODE_POINTS.NULL) return ERR.nullCharacterReference;
	else if (code > 1114111) return ERR.characterReferenceOutsideUnicodeRange;
	else if (isSurrogate(code)) return ERR.surrogateCharacterReference;
	else if (isUndefinedCodePoint(code)) return ERR.noncharacterCharacterReference;
	else if (isControlCodePoint(code) || code === CODE_POINTS.CARRIAGE_RETURN) return ERR.controlCharacterReference;
	return null;
}
var Tokenizer = class {
	constructor(options, handler) {
		this.options = options;
		this.handler = handler;
		this.paused = false;
		/** Ensures that the parsing loop isn't run multiple times at once. */
		this.inLoop = false;
		/**
		* Indicates that the current adjusted node exists, is not an element in the HTML namespace,
		* and that it is not an integration point for either MathML or HTML.
		*
		* @see {@link https://html.spec.whatwg.org/multipage/parsing.html#tree-construction}
		*/
		this.inForeignNode = false;
		this.lastStartTagName = "";
		this.active = false;
		this.state = State.DATA;
		this.returnState = State.DATA;
		this.entityStartPos = 0;
		this.consumedAfterSnapshot = -1;
		this.currentCharacterToken = null;
		this.currentToken = null;
		this.currentAttr = {
			name: "",
			value: ""
		};
		this.preprocessor = new Preprocessor(handler);
		this.currentLocation = this.getCurrentLocation(-1);
		this.entityDecoder = new EntityDecoder(htmlDecodeTree, (cp, consumed) => {
			this.preprocessor.pos = this.entityStartPos + consumed - 1;
			this._flushCodePointConsumedAsCharacterReference(cp);
		}, handler.onParseError ? {
			missingSemicolonAfterCharacterReference: () => {
				this._err(ERR.missingSemicolonAfterCharacterReference, 1);
			},
			absenceOfDigitsInNumericCharacterReference: (consumed) => {
				this._err(ERR.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + consumed);
			},
			validateNumericCharacterReference: (code) => {
				const error = getErrorForNumericCharacterReference(code);
				if (error) this._err(error, 1);
			}
		} : void 0);
	}
	_err(code, cpOffset = 0) {
		var _a, _b;
		(_b = (_a = this.handler).onParseError) === null || _b === void 0 || _b.call(_a, this.preprocessor.getError(code, cpOffset));
	}
	getCurrentLocation(offset) {
		if (!this.options.sourceCodeLocationInfo) return null;
		return {
			startLine: this.preprocessor.line,
			startCol: this.preprocessor.col - offset,
			startOffset: this.preprocessor.offset - offset,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		};
	}
	_runParsingLoop() {
		if (this.inLoop) return;
		this.inLoop = true;
		while (this.active && !this.paused) {
			this.consumedAfterSnapshot = 0;
			const cp = this._consume();
			if (!this._ensureHibernation()) this._callState(cp);
		}
		this.inLoop = false;
	}
	pause() {
		this.paused = true;
	}
	resume(writeCallback) {
		if (!this.paused) throw new Error("Parser was already resumed");
		this.paused = false;
		if (this.inLoop) return;
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	write(chunk, isLastChunk, writeCallback) {
		this.active = true;
		this.preprocessor.write(chunk, isLastChunk);
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	insertHtmlAtCurrentPos(chunk) {
		this.active = true;
		this.preprocessor.insertHtmlAtCurrentPos(chunk);
		this._runParsingLoop();
	}
	_ensureHibernation() {
		if (this.preprocessor.endOfChunkHit) {
			this.preprocessor.retreat(this.consumedAfterSnapshot);
			this.consumedAfterSnapshot = 0;
			this.active = false;
			return true;
		}
		return false;
	}
	_consume() {
		this.consumedAfterSnapshot++;
		return this.preprocessor.advance();
	}
	_advanceBy(count) {
		this.consumedAfterSnapshot += count;
		for (let i = 0; i < count; i++) this.preprocessor.advance();
	}
	_consumeSequenceIfMatch(pattern, caseSensitive) {
		if (this.preprocessor.startsWith(pattern, caseSensitive)) {
			this._advanceBy(pattern.length - 1);
			return true;
		}
		return false;
	}
	_createStartTagToken() {
		this.currentToken = {
			type: TokenType.START_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(1)
		};
	}
	_createEndTagToken() {
		this.currentToken = {
			type: TokenType.END_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(2)
		};
	}
	_createCommentToken(offset) {
		this.currentToken = {
			type: TokenType.COMMENT,
			data: "",
			location: this.getCurrentLocation(offset)
		};
	}
	_createDoctypeToken(initialName) {
		this.currentToken = {
			type: TokenType.DOCTYPE,
			name: initialName,
			forceQuirks: false,
			publicId: null,
			systemId: null,
			location: this.currentLocation
		};
	}
	_createCharacterToken(type, chars) {
		this.currentCharacterToken = {
			type,
			chars,
			location: this.currentLocation
		};
	}
	_createAttr(attrNameFirstCh) {
		this.currentAttr = {
			name: attrNameFirstCh,
			value: ""
		};
		this.currentLocation = this.getCurrentLocation(0);
	}
	_leaveAttrName() {
		var _a;
		var _b;
		const token = this.currentToken;
		if (getTokenAttr(token, this.currentAttr.name) === null) {
			token.attrs.push(this.currentAttr);
			if (token.location && this.currentLocation) {
				const attrLocations = (_a = (_b = token.location).attrs) !== null && _a !== void 0 ? _a : _b.attrs = Object.create(null);
				attrLocations[this.currentAttr.name] = this.currentLocation;
				this._leaveAttrValue();
			}
		} else this._err(ERR.duplicateAttribute);
	}
	_leaveAttrValue() {
		if (this.currentLocation) {
			this.currentLocation.endLine = this.preprocessor.line;
			this.currentLocation.endCol = this.preprocessor.col;
			this.currentLocation.endOffset = this.preprocessor.offset;
		}
	}
	prepareToken(ct) {
		this._emitCurrentCharacterToken(ct.location);
		this.currentToken = null;
		if (ct.location) {
			ct.location.endLine = this.preprocessor.line;
			ct.location.endCol = this.preprocessor.col + 1;
			ct.location.endOffset = this.preprocessor.offset + 1;
		}
		this.currentLocation = this.getCurrentLocation(-1);
	}
	emitCurrentTagToken() {
		const ct = this.currentToken;
		this.prepareToken(ct);
		ct.tagID = getTagID(ct.tagName);
		if (ct.type === TokenType.START_TAG) {
			this.lastStartTagName = ct.tagName;
			this.handler.onStartTag(ct);
		} else {
			if (ct.attrs.length > 0) this._err(ERR.endTagWithAttributes);
			if (ct.selfClosing) this._err(ERR.endTagWithTrailingSolidus);
			this.handler.onEndTag(ct);
		}
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentComment(ct) {
		this.prepareToken(ct);
		this.handler.onComment(ct);
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentDoctype(ct) {
		this.prepareToken(ct);
		this.handler.onDoctype(ct);
		this.preprocessor.dropParsedChunk();
	}
	_emitCurrentCharacterToken(nextLocation) {
		if (this.currentCharacterToken) {
			if (nextLocation && this.currentCharacterToken.location) {
				this.currentCharacterToken.location.endLine = nextLocation.startLine;
				this.currentCharacterToken.location.endCol = nextLocation.startCol;
				this.currentCharacterToken.location.endOffset = nextLocation.startOffset;
			}
			switch (this.currentCharacterToken.type) {
				case TokenType.CHARACTER:
					this.handler.onCharacter(this.currentCharacterToken);
					break;
				case TokenType.NULL_CHARACTER:
					this.handler.onNullCharacter(this.currentCharacterToken);
					break;
				case TokenType.WHITESPACE_CHARACTER: this.handler.onWhitespaceCharacter(this.currentCharacterToken);
			}
			this.currentCharacterToken = null;
		}
	}
	_emitEOFToken() {
		const location = this.getCurrentLocation(0);
		if (location) {
			location.endLine = location.startLine;
			location.endCol = location.startCol;
			location.endOffset = location.startOffset;
		}
		this._emitCurrentCharacterToken(location);
		this.handler.onEof({
			type: TokenType.EOF,
			location
		});
		this.active = false;
	}
	_appendCharToCurrentCharacterToken(type, ch) {
		if (this.currentCharacterToken) {
			if (this.currentCharacterToken.type === type) {
				this.currentCharacterToken.chars += ch;
				return;
			} else {
				this.currentLocation = this.getCurrentLocation(0);
				this._emitCurrentCharacterToken(this.currentLocation);
				this.preprocessor.dropParsedChunk();
			}
		}
		this._createCharacterToken(type, ch);
	}
	_emitCodePoint(cp) {
		const type = isWhitespace(cp) ? TokenType.WHITESPACE_CHARACTER : cp === CODE_POINTS.NULL ? TokenType.NULL_CHARACTER : TokenType.CHARACTER;
		this._appendCharToCurrentCharacterToken(type, String.fromCodePoint(cp));
	}
	_emitChars(ch) {
		this._appendCharToCurrentCharacterToken(TokenType.CHARACTER, ch);
	}
	_startCharacterReference() {
		this.returnState = this.state;
		this.state = State.CHARACTER_REFERENCE;
		this.entityStartPos = this.preprocessor.pos;
		this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute() ? DecodingMode.Attribute : DecodingMode.Legacy);
	}
	_isCharacterReferenceInAttribute() {
		return this.returnState === State.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_UNQUOTED;
	}
	_flushCodePointConsumedAsCharacterReference(cp) {
		if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += String.fromCodePoint(cp);
		else this._emitCodePoint(cp);
	}
	_callState(cp) {
		switch (this.state) {
			case State.DATA:
				this._stateData(cp);
				break;
			case State.RCDATA:
				this._stateRcdata(cp);
				break;
			case State.RAWTEXT:
				this._stateRawtext(cp);
				break;
			case State.SCRIPT_DATA:
				this._stateScriptData(cp);
				break;
			case State.PLAINTEXT:
				this._statePlaintext(cp);
				break;
			case State.TAG_OPEN:
				this._stateTagOpen(cp);
				break;
			case State.END_TAG_OPEN:
				this._stateEndTagOpen(cp);
				break;
			case State.TAG_NAME:
				this._stateTagName(cp);
				break;
			case State.RCDATA_LESS_THAN_SIGN:
				this._stateRcdataLessThanSign(cp);
				break;
			case State.RCDATA_END_TAG_OPEN:
				this._stateRcdataEndTagOpen(cp);
				break;
			case State.RCDATA_END_TAG_NAME:
				this._stateRcdataEndTagName(cp);
				break;
			case State.RAWTEXT_LESS_THAN_SIGN:
				this._stateRawtextLessThanSign(cp);
				break;
			case State.RAWTEXT_END_TAG_OPEN:
				this._stateRawtextEndTagOpen(cp);
				break;
			case State.RAWTEXT_END_TAG_NAME:
				this._stateRawtextEndTagName(cp);
				break;
			case State.SCRIPT_DATA_LESS_THAN_SIGN:
				this._stateScriptDataLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_OPEN:
				this._stateScriptDataEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_NAME:
				this._stateScriptDataEndTagName(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START:
				this._stateScriptDataEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START_DASH:
				this._stateScriptDataEscapeStartDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED:
				this._stateScriptDataEscaped(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH:
				this._stateScriptDataEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH_DASH:
				this._stateScriptDataEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
				this._stateScriptDataEscapedEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
				this._stateScriptDataEscapedEndTagName(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_START:
				this._stateScriptDataDoubleEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED:
				this._stateScriptDataDoubleEscaped(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
				this._stateScriptDataDoubleEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
				this._stateScriptDataDoubleEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataDoubleEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_END:
				this._stateScriptDataDoubleEscapeEnd(cp);
				break;
			case State.BEFORE_ATTRIBUTE_NAME:
				this._stateBeforeAttributeName(cp);
				break;
			case State.ATTRIBUTE_NAME:
				this._stateAttributeName(cp);
				break;
			case State.AFTER_ATTRIBUTE_NAME:
				this._stateAfterAttributeName(cp);
				break;
			case State.BEFORE_ATTRIBUTE_VALUE:
				this._stateBeforeAttributeValue(cp);
				break;
			case State.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
				this._stateAttributeValueDoubleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_SINGLE_QUOTED:
				this._stateAttributeValueSingleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_UNQUOTED:
				this._stateAttributeValueUnquoted(cp);
				break;
			case State.AFTER_ATTRIBUTE_VALUE_QUOTED:
				this._stateAfterAttributeValueQuoted(cp);
				break;
			case State.SELF_CLOSING_START_TAG:
				this._stateSelfClosingStartTag(cp);
				break;
			case State.BOGUS_COMMENT:
				this._stateBogusComment(cp);
				break;
			case State.MARKUP_DECLARATION_OPEN:
				this._stateMarkupDeclarationOpen(cp);
				break;
			case State.COMMENT_START:
				this._stateCommentStart(cp);
				break;
			case State.COMMENT_START_DASH:
				this._stateCommentStartDash(cp);
				break;
			case State.COMMENT:
				this._stateComment(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN:
				this._stateCommentLessThanSign(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG:
				this._stateCommentLessThanSignBang(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH:
				this._stateCommentLessThanSignBangDash(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
				this._stateCommentLessThanSignBangDashDash(cp);
				break;
			case State.COMMENT_END_DASH:
				this._stateCommentEndDash(cp);
				break;
			case State.COMMENT_END:
				this._stateCommentEnd(cp);
				break;
			case State.COMMENT_END_BANG:
				this._stateCommentEndBang(cp);
				break;
			case State.DOCTYPE:
				this._stateDoctype(cp);
				break;
			case State.BEFORE_DOCTYPE_NAME:
				this._stateBeforeDoctypeName(cp);
				break;
			case State.DOCTYPE_NAME:
				this._stateDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_NAME:
				this._stateAfterDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_KEYWORD:
				this._stateAfterDoctypePublicKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateBeforeDoctypePublicIdentifier(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypePublicIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypePublicIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateAfterDoctypePublicIdentifier(cp);
				break;
			case State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
				this._stateBetweenDoctypePublicAndSystemIdentifiers(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_KEYWORD:
				this._stateAfterDoctypeSystemKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateBeforeDoctypeSystemIdentifier(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypeSystemIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypeSystemIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateAfterDoctypeSystemIdentifier(cp);
				break;
			case State.BOGUS_DOCTYPE:
				this._stateBogusDoctype(cp);
				break;
			case State.CDATA_SECTION:
				this._stateCdataSection(cp);
				break;
			case State.CDATA_SECTION_BRACKET:
				this._stateCdataSectionBracket(cp);
				break;
			case State.CDATA_SECTION_END:
				this._stateCdataSectionEnd(cp);
				break;
			case State.CHARACTER_REFERENCE:
				this._stateCharacterReference();
				break;
			case State.AMBIGUOUS_AMPERSAND:
				this._stateAmbiguousAmpersand(cp);
				break;
			default: throw new Error("Unknown state");
		}
	}
	_stateData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.TAG_OPEN;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRcdata(cp) {
		switch (cp) {
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RCDATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRawtext(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RAWTEXT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_statePlaintext(cp) {
		switch (cp) {
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createStartTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.MARKUP_DECLARATION_OPEN;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.END_TAG_OPEN;
				break;
			case CODE_POINTS.QUESTION_MARK:
				this._err(ERR.unexpectedQuestionMarkInsteadOfTagName);
				this._createCommentToken(1);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("<");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._emitChars("<");
				this.state = State.DATA;
				this._stateData(cp);
		}
	}
	_stateEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createEndTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingEndTagName);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("</");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._createCommentToken(2);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
		}
	}
	_stateTagName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.tagName += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: token.tagName += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateRcdataLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RCDATA_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRcdataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RCDATA_END_TAG_NAME;
			this._stateRcdataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	handleSpecialEndTag(_cp) {
		if (!this.preprocessor.startsWith(this.lastStartTagName, false)) return !this._ensureHibernation();
		this._createEndTagToken();
		const token = this.currentToken;
		token.tagName = this.lastStartTagName;
		switch (this.preprocessor.peek(this.lastStartTagName.length)) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				return false;
			case CODE_POINTS.SOLIDUS:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.SELF_CLOSING_START_TAG;
				return false;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._advanceBy(this.lastStartTagName.length);
				this.emitCurrentTagToken();
				this.state = State.DATA;
				return false;
			default: return !this._ensureHibernation();
		}
	}
	_stateRcdataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRawtextLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RAWTEXT_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RAWTEXT_END_TAG_NAME;
			this._stateRawtextEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateScriptDataLessThanSign(cp) {
		switch (cp) {
			case CODE_POINTS.SOLIDUS:
				this.state = State.SCRIPT_DATA_END_TAG_OPEN;
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.SCRIPT_DATA_ESCAPE_START;
				this._emitChars("<!");
				break;
			default:
				this._emitChars("<");
				this.state = State.SCRIPT_DATA;
				this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_END_TAG_NAME;
			this._stateScriptDataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStart(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPE_START_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStartDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
		else if (isAsciiLetter(cp)) {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_START;
			this._stateScriptDataDoubleEscapeStart(cp);
		} else {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_NAME;
			this._stateScriptDataEscapedEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeStart(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_END;
			this._emitChars("/");
		} else {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeEnd(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateBeforeAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._err(ERR.unexpectedEqualsSignBeforeAttributeName);
				this._createAttr("=");
				this.state = State.ATTRIBUTE_NAME;
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this._leaveAttrName();
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._leaveAttrName();
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
				this._err(ERR.unexpectedCharacterInAttributeName);
				this.currentAttr.name += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.name += "�";
				break;
			default: this.currentAttr.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateBeforeAttributeValue(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this.state = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingAttributeValue);
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			default:
				this.state = State.ATTRIBUTE_VALUE_UNQUOTED;
				this._stateAttributeValueUnquoted(cp);
		}
	}
	_stateAttributeValueDoubleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueSingleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueUnquoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
			case CODE_POINTS.EQUALS_SIGN:
			case CODE_POINTS.GRAVE_ACCENT:
				this._err(ERR.unexpectedCharacterInUnquotedAttributeValue);
				this.currentAttr.value += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAfterAttributeValueQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this._leaveAttrValue();
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingWhitespaceBetweenAttributes);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateSelfClosingStartTag(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN: {
				const token = this.currentToken;
				token.selfClosing = true;
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			}
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedSolidusInTag);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateBogusComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += "�";
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateMarkupDeclarationOpen(cp) {
		if (this._consumeSequenceIfMatch(SEQUENCES.DASH_DASH, true)) {
			this._createCommentToken(SEQUENCES.DASH_DASH.length + 1);
			this.state = State.COMMENT_START;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.DOCTYPE, false)) {
			this.currentLocation = this.getCurrentLocation(SEQUENCES.DOCTYPE.length + 1);
			this.state = State.DOCTYPE;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.CDATA_START, true)) {
			if (this.inForeignNode) this.state = State.CDATA_SECTION;
			else {
				this._err(ERR.cdataInHtmlContent);
				this._createCommentToken(SEQUENCES.CDATA_START.length + 1);
				this.currentToken.data = "[CDATA[";
				this.state = State.BOGUS_COMMENT;
			}
		} else if (!this._ensureHibernation()) {
			this._err(ERR.incorrectlyOpenedComment);
			this._createCommentToken(2);
			this.state = State.BOGUS_COMMENT;
			this._stateBogusComment(cp);
		}
	}
	_stateCommentStart(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_START_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				const token = this.currentToken;
				this.emitCurrentComment(token);
				break;
			}
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentStartDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				this.state = State.COMMENT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateCommentLessThanSign(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				token.data += "!";
				this.state = State.COMMENT_LESS_THAN_SIGN_BANG;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				break;
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBang(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH;
		else {
			this.state = State.COMMENT;
			this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBangDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
		else {
			this.state = State.COMMENT_END_DASH;
			this._stateCommentEndDash(cp);
		}
	}
	_stateCommentLessThanSignBangDashDash(cp) {
		if (cp !== CODE_POINTS.GREATER_THAN_SIGN && cp !== CODE_POINTS.EOF) this._err(ERR.nestedComment);
		this.state = State.COMMENT_END;
		this._stateCommentEnd(cp);
	}
	_stateCommentEndDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEnd(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.COMMENT_END_BANG;
				break;
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "-";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEndBang(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "--!";
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.incorrectlyClosedComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--!";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateDoctype(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
				break;
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._err(ERR.missingWhitespaceBeforeDoctypeName);
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
		}
	}
	_stateBeforeDoctypeName(cp) {
		if (isAsciiUpper(cp)) {
			this._createDoctypeToken(String.fromCharCode(toAsciiLower(cp)));
			this.state = State.DOCTYPE_NAME;
		} else switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._createDoctypeToken("�");
				this.state = State.DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.missingDoctypeName);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			}
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._createDoctypeToken(String.fromCodePoint(cp));
				this.state = State.DOCTYPE_NAME;
		}
	}
	_stateDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.AFTER_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.name += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: if (this._consumeSequenceIfMatch(SEQUENCES.PUBLIC, false)) this.state = State.AFTER_DOCTYPE_PUBLIC_KEYWORD;
			else if (this._consumeSequenceIfMatch(SEQUENCES.SYSTEM, false)) this.state = State.AFTER_DOCTYPE_SYSTEM_KEYWORD;
			else if (!this._ensureHibernation()) {
				this._err(ERR.invalidCharacterSequenceAfterDoctypeName);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
			}
		}
	}
	_stateAfterDoctypePublicKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypePublicIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypePublicIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBetweenDoctypePublicAndSystemIdentifiers(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateAfterDoctypeSystemKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypeSystemIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypeSystemIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBogusDoctype(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
		}
	}
	_stateCdataSection(cp) {
		switch (cp) {
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this.state = State.CDATA_SECTION_BRACKET;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInCdata);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateCdataSectionBracket(cp) {
		if (cp === CODE_POINTS.RIGHT_SQUARE_BRACKET) this.state = State.CDATA_SECTION_END;
		else {
			this._emitChars("]");
			this.state = State.CDATA_SECTION;
			this._stateCdataSection(cp);
		}
	}
	_stateCdataSectionEnd(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				break;
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this._emitChars("]");
				break;
			default:
				this._emitChars("]]");
				this.state = State.CDATA_SECTION;
				this._stateCdataSection(cp);
		}
	}
	_stateCharacterReference() {
		let length = this.entityDecoder.write(this.preprocessor.html, this.preprocessor.pos);
		if (length < 0) {
			if (this.preprocessor.lastChunkWritten) length = this.entityDecoder.end();
			else {
				this.active = false;
				this.preprocessor.pos = this.preprocessor.html.length - 1;
				this.consumedAfterSnapshot = 0;
				this.preprocessor.endOfChunkHit = true;
				return;
			}
		}
		if (length === 0) {
			this.preprocessor.pos = this.entityStartPos;
			this._flushCodePointConsumedAsCharacterReference(CODE_POINTS.AMPERSAND);
			this.state = !this._isCharacterReferenceInAttribute() && isAsciiAlphaNumeric(this.preprocessor.peek(1)) ? State.AMBIGUOUS_AMPERSAND : this.returnState;
		} else this.state = this.returnState;
	}
	_stateAmbiguousAmpersand(cp) {
		if (isAsciiAlphaNumeric(cp)) this._flushCodePointConsumedAsCharacterReference(cp);
		else {
			if (cp === CODE_POINTS.SEMICOLON) this._err(ERR.unknownNamedCharacterReference);
			this.state = this.returnState;
			this._callState(cp);
		}
	}
};
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/parser/open-element-stack.js
var IMPLICIT_END_TAG_REQUIRED = /* @__PURE__ */ new Set([
	TAG_ID.DD,
	TAG_ID.DT,
	TAG_ID.LI,
	TAG_ID.OPTGROUP,
	TAG_ID.OPTION,
	TAG_ID.P,
	TAG_ID.RB,
	TAG_ID.RP,
	TAG_ID.RT,
	TAG_ID.RTC
]);
var IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = /* @__PURE__ */ new Set([
	...IMPLICIT_END_TAG_REQUIRED,
	TAG_ID.CAPTION,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
var SCOPING_ELEMENTS_HTML = /* @__PURE__ */ new Set([
	TAG_ID.APPLET,
	TAG_ID.CAPTION,
	TAG_ID.HTML,
	TAG_ID.MARQUEE,
	TAG_ID.OBJECT,
	TAG_ID.TABLE,
	TAG_ID.TD,
	TAG_ID.TEMPLATE,
	TAG_ID.TH
]);
var SCOPING_ELEMENTS_HTML_LIST = /* @__PURE__ */ new Set([
	...SCOPING_ELEMENTS_HTML,
	TAG_ID.OL,
	TAG_ID.UL
]);
var SCOPING_ELEMENTS_HTML_BUTTON = /* @__PURE__ */ new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.BUTTON]);
var SCOPING_ELEMENTS_MATHML = /* @__PURE__ */ new Set([
	TAG_ID.ANNOTATION_XML,
	TAG_ID.MI,
	TAG_ID.MN,
	TAG_ID.MO,
	TAG_ID.MS,
	TAG_ID.MTEXT
]);
var SCOPING_ELEMENTS_SVG = /* @__PURE__ */ new Set([
	TAG_ID.DESC,
	TAG_ID.FOREIGN_OBJECT,
	TAG_ID.TITLE
]);
var TABLE_ROW_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TR,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_BODY_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TABLE,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_CELLS = /* @__PURE__ */ new Set([TAG_ID.TD, TAG_ID.TH]);
var OpenElementStack = class {
	get currentTmplContentOrNode() {
		return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
	}
	constructor(document, treeAdapter, handler) {
		this.treeAdapter = treeAdapter;
		this.handler = handler;
		this.items = [];
		this.tagIDs = [];
		this.stackTop = -1;
		this.tmplCount = 0;
		this.currentTagId = TAG_ID.UNKNOWN;
		this.current = document;
	}
	_indexOf(element) {
		return this.items.lastIndexOf(element, this.stackTop);
	}
	_isInTemplate() {
		return this.currentTagId === TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === NS.HTML;
	}
	_updateCurrentElement() {
		this.current = this.items[this.stackTop];
		this.currentTagId = this.tagIDs[this.stackTop];
	}
	push(element, tagID) {
		this.stackTop++;
		this.items[this.stackTop] = element;
		this.current = element;
		this.tagIDs[this.stackTop] = tagID;
		this.currentTagId = tagID;
		if (this._isInTemplate()) this.tmplCount++;
		this.handler.onItemPush(element, tagID, true);
	}
	pop() {
		const popped = this.current;
		if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount--;
		this.stackTop--;
		this._updateCurrentElement();
		this.handler.onItemPop(popped, true);
	}
	replace(oldElement, newElement) {
		const idx = this._indexOf(oldElement);
		this.items[idx] = newElement;
		if (idx === this.stackTop) this.current = newElement;
	}
	insertAfter(referenceElement, newElement, newElementID) {
		const insertionIdx = this._indexOf(referenceElement) + 1;
		this.items.splice(insertionIdx, 0, newElement);
		this.tagIDs.splice(insertionIdx, 0, newElementID);
		this.stackTop++;
		if (insertionIdx === this.stackTop) this._updateCurrentElement();
		if (this.current && this.currentTagId !== void 0) this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
	}
	popUntilTagNamePopped(tagName) {
		let targetIdx = this.stackTop + 1;
		do
			targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
		while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== NS.HTML);
		this.shortenToLength(Math.max(targetIdx, 0));
	}
	shortenToLength(idx) {
		while (this.stackTop >= idx) {
			const popped = this.current;
			if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount -= 1;
			this.stackTop--;
			this._updateCurrentElement();
			this.handler.onItemPop(popped, this.stackTop < idx);
		}
	}
	popUntilElementPopped(element) {
		const idx = this._indexOf(element);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilPopped(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilNumberedHeaderPopped() {
		this.popUntilPopped(NUMBERED_HEADERS, NS.HTML);
	}
	popUntilTableCellPopped() {
		this.popUntilPopped(TABLE_CELLS, NS.HTML);
	}
	popAllUpToHtmlElement() {
		this.tmplCount = 0;
		this.shortenToLength(1);
	}
	_indexOfTagNames(tagNames, namespace) {
		for (let i = this.stackTop; i >= 0; i--) if (tagNames.has(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) return i;
		return -1;
	}
	clearBackTo(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(idx + 1);
	}
	clearBackToTableContext() {
		this.clearBackTo(TABLE_CONTEXT, NS.HTML);
	}
	clearBackToTableBodyContext() {
		this.clearBackTo(TABLE_BODY_CONTEXT, NS.HTML);
	}
	clearBackToTableRowContext() {
		this.clearBackTo(TABLE_ROW_CONTEXT, NS.HTML);
	}
	remove(element) {
		const idx = this._indexOf(element);
		if (idx >= 0) {
			if (idx === this.stackTop) this.pop();
			else {
				this.items.splice(idx, 1);
				this.tagIDs.splice(idx, 1);
				this.stackTop--;
				this._updateCurrentElement();
				this.handler.onItemPop(element, false);
			}
		}
	}
	tryPeekProperlyNestedBodyElement() {
		return this.stackTop >= 1 && this.tagIDs[1] === TAG_ID.BODY ? this.items[1] : null;
	}
	contains(element) {
		return this._indexOf(element) > -1;
	}
	getCommonAncestor(element) {
		const elementIdx = this._indexOf(element) - 1;
		return elementIdx >= 0 ? this.items[elementIdx] : null;
	}
	isRootHtmlElementCurrent() {
		return this.stackTop === 0 && this.tagIDs[0] === TAG_ID.HTML;
	}
	hasInDynamicScope(tagName, htmlScope) {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS.HTML:
					if (tn === tagName) return true;
					if (htmlScope.has(tn)) return false;
					break;
				case NS.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS.MATHML: if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
			}
		}
		return true;
	}
	hasInScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML);
	}
	hasInListItemScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_LIST);
	}
	hasInButtonScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_BUTTON);
	}
	hasNumberedHeaderInScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS.HTML:
					if (NUMBERED_HEADERS.has(tn)) return true;
					if (SCOPING_ELEMENTS_HTML.has(tn)) return false;
					break;
				case NS.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS.MATHML: if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
			}
		}
		return true;
	}
	hasInTableScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasTableBodyContextInTableScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case TAG_ID.TBODY:
				case TAG_ID.THEAD:
				case TAG_ID.TFOOT: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasInSelectScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.OPTION:
				case TAG_ID.OPTGROUP: break;
				default: return false;
			}
		}
		return true;
	}
	generateImpliedEndTags() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsThoroughly() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsWithExclusion(exclusionId) {
		while (this.currentTagId !== void 0 && this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
};
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/parser/formatting-element-list.js
var NOAH_ARK_CAPACITY = 3;
var EntryType;
(function(EntryType) {
	EntryType[EntryType["Marker"] = 0] = "Marker";
	EntryType[EntryType["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
var MARKER = { type: EntryType.Marker };
var FormattingElementList = class {
	constructor(treeAdapter) {
		this.treeAdapter = treeAdapter;
		this.entries = [];
		this.bookmark = null;
	}
	_getNoahArkConditionCandidates(newElement, neAttrs) {
		const candidates = [];
		const neAttrsLength = neAttrs.length;
		const neTagName = this.treeAdapter.getTagName(newElement);
		const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
		for (let i = 0; i < this.entries.length; i++) {
			const entry = this.entries[i];
			if (entry.type === EntryType.Marker) break;
			const { element } = entry;
			if (this.treeAdapter.getTagName(element) === neTagName && this.treeAdapter.getNamespaceURI(element) === neNamespaceURI) {
				const elementAttrs = this.treeAdapter.getAttrList(element);
				if (elementAttrs.length === neAttrsLength) candidates.push({
					idx: i,
					attrs: elementAttrs
				});
			}
		}
		return candidates;
	}
	_ensureNoahArkCondition(newElement) {
		if (this.entries.length < NOAH_ARK_CAPACITY) return;
		const neAttrs = this.treeAdapter.getAttrList(newElement);
		const candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);
		if (candidates.length < NOAH_ARK_CAPACITY) return;
		const neAttrsMap = new Map(neAttrs.map((neAttr) => [neAttr.name, neAttr.value]));
		let validCandidates = 0;
		for (let i = 0; i < candidates.length; i++) {
			const candidate = candidates[i];
			if (candidate.attrs.every((cAttr) => neAttrsMap.get(cAttr.name) === cAttr.value)) {
				validCandidates += 1;
				if (validCandidates >= NOAH_ARK_CAPACITY) this.entries.splice(candidate.idx, 1);
			}
		}
	}
	insertMarker() {
		this.entries.unshift(MARKER);
	}
	pushElement(element, token) {
		this._ensureNoahArkCondition(element);
		this.entries.unshift({
			type: EntryType.Element,
			element,
			token
		});
	}
	insertElementAfterBookmark(element, token) {
		const bookmarkIdx = this.entries.indexOf(this.bookmark);
		this.entries.splice(bookmarkIdx, 0, {
			type: EntryType.Element,
			element,
			token
		});
	}
	removeEntry(entry) {
		const entryIndex = this.entries.indexOf(entry);
		if (entryIndex !== -1) this.entries.splice(entryIndex, 1);
	}
	/**
	* Clears the list of formatting elements up to the last marker.
	*
	* @see https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker
	*/
	clearToLastMarker() {
		const markerIdx = this.entries.indexOf(MARKER);
		if (markerIdx === -1) this.entries.length = 0;
		else this.entries.splice(0, markerIdx + 1);
	}
	getElementEntryInScopeWithTagName(tagName) {
		const entry = this.entries.find((entry) => entry.type === EntryType.Marker || this.treeAdapter.getTagName(entry.element) === tagName);
		return entry && entry.type === EntryType.Element ? entry : null;
	}
	getElementEntry(element) {
		return this.entries.find((entry) => entry.type === EntryType.Element && entry.element === element);
	}
};
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/tree-adapters/default.js
var defaultTreeAdapter = {
	createDocument() {
		return {
			nodeName: "#document",
			mode: DOCUMENT_MODE.NO_QUIRKS,
			childNodes: []
		};
	},
	createDocumentFragment() {
		return {
			nodeName: "#document-fragment",
			childNodes: []
		};
	},
	createElement(tagName, namespaceURI, attrs) {
		return {
			nodeName: tagName,
			tagName,
			attrs,
			namespaceURI,
			childNodes: [],
			parentNode: null
		};
	},
	createCommentNode(data) {
		return {
			nodeName: "#comment",
			data,
			parentNode: null
		};
	},
	createTextNode(value) {
		return {
			nodeName: "#text",
			value,
			parentNode: null
		};
	},
	appendChild(parentNode, newNode) {
		parentNode.childNodes.push(newNode);
		newNode.parentNode = parentNode;
	},
	insertBefore(parentNode, newNode, referenceNode) {
		const insertionIdx = parentNode.childNodes.indexOf(referenceNode);
		parentNode.childNodes.splice(insertionIdx, 0, newNode);
		newNode.parentNode = parentNode;
	},
	setTemplateContent(templateElement, contentElement) {
		templateElement.content = contentElement;
	},
	getTemplateContent(templateElement) {
		return templateElement.content;
	},
	setDocumentType(document, name, publicId, systemId) {
		const doctypeNode = document.childNodes.find((node) => node.nodeName === "#documentType");
		if (doctypeNode) {
			doctypeNode.name = name;
			doctypeNode.publicId = publicId;
			doctypeNode.systemId = systemId;
		} else {
			const node = {
				nodeName: "#documentType",
				name,
				publicId,
				systemId,
				parentNode: null
			};
			defaultTreeAdapter.appendChild(document, node);
		}
	},
	setDocumentMode(document, mode) {
		document.mode = mode;
	},
	getDocumentMode(document) {
		return document.mode;
	},
	detachNode(node) {
		if (node.parentNode) {
			const idx = node.parentNode.childNodes.indexOf(node);
			node.parentNode.childNodes.splice(idx, 1);
			node.parentNode = null;
		}
	},
	insertText(parentNode, text) {
		if (parentNode.childNodes.length > 0) {
			const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
			if (defaultTreeAdapter.isTextNode(prevNode)) {
				prevNode.value += text;
				return;
			}
		}
		defaultTreeAdapter.appendChild(parentNode, defaultTreeAdapter.createTextNode(text));
	},
	insertTextBefore(parentNode, text, referenceNode) {
		const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
		if (prevNode && defaultTreeAdapter.isTextNode(prevNode)) prevNode.value += text;
		else defaultTreeAdapter.insertBefore(parentNode, defaultTreeAdapter.createTextNode(text), referenceNode);
	},
	adoptAttributes(recipient, attrs) {
		const recipientAttrsMap = new Set(recipient.attrs.map((attr) => attr.name));
		for (let j = 0; j < attrs.length; j++) if (!recipientAttrsMap.has(attrs[j].name)) recipient.attrs.push(attrs[j]);
	},
	getFirstChild(node) {
		return node.childNodes[0];
	},
	getChildNodes(node) {
		return node.childNodes;
	},
	getParentNode(node) {
		return node.parentNode;
	},
	getAttrList(element) {
		return element.attrs;
	},
	getTagName(element) {
		return element.tagName;
	},
	getNamespaceURI(element) {
		return element.namespaceURI;
	},
	getTextNodeContent(textNode) {
		return textNode.value;
	},
	getCommentNodeContent(commentNode) {
		return commentNode.data;
	},
	getDocumentTypeNodeName(doctypeNode) {
		return doctypeNode.name;
	},
	getDocumentTypeNodePublicId(doctypeNode) {
		return doctypeNode.publicId;
	},
	getDocumentTypeNodeSystemId(doctypeNode) {
		return doctypeNode.systemId;
	},
	isTextNode(node) {
		return node.nodeName === "#text";
	},
	isCommentNode(node) {
		return node.nodeName === "#comment";
	},
	isDocumentTypeNode(node) {
		return node.nodeName === "#documentType";
	},
	isElementNode(node) {
		return Object.prototype.hasOwnProperty.call(node, "tagName");
	},
	setNodeSourceCodeLocation(node, location) {
		node.sourceCodeLocation = location;
	},
	getNodeSourceCodeLocation(node) {
		return node.sourceCodeLocation;
	},
	updateNodeSourceCodeLocation(node, endLocation) {
		node.sourceCodeLocation = {
			...node.sourceCodeLocation,
			...endLocation
		};
	}
};
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/doctype.js
var VALID_DOCTYPE_NAME = "html";
var VALID_SYSTEM_ID = "about:legacy-compat";
var QUIRKS_MODE_SYSTEM_ID = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd";
var QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
	"+//silmaril//dtd html pro v0r11 19970101//",
	"-//as//dtd html 3.0 aswedit + extensions//",
	"-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
	"-//ietf//dtd html 2.0 level 1//",
	"-//ietf//dtd html 2.0 level 2//",
	"-//ietf//dtd html 2.0 strict level 1//",
	"-//ietf//dtd html 2.0 strict level 2//",
	"-//ietf//dtd html 2.0 strict//",
	"-//ietf//dtd html 2.0//",
	"-//ietf//dtd html 2.1e//",
	"-//ietf//dtd html 3.0//",
	"-//ietf//dtd html 3.2 final//",
	"-//ietf//dtd html 3.2//",
	"-//ietf//dtd html 3//",
	"-//ietf//dtd html level 0//",
	"-//ietf//dtd html level 1//",
	"-//ietf//dtd html level 2//",
	"-//ietf//dtd html level 3//",
	"-//ietf//dtd html strict level 0//",
	"-//ietf//dtd html strict level 1//",
	"-//ietf//dtd html strict level 2//",
	"-//ietf//dtd html strict level 3//",
	"-//ietf//dtd html strict//",
	"-//ietf//dtd html//",
	"-//metrius//dtd metrius presentational//",
	"-//microsoft//dtd internet explorer 2.0 html strict//",
	"-//microsoft//dtd internet explorer 2.0 html//",
	"-//microsoft//dtd internet explorer 2.0 tables//",
	"-//microsoft//dtd internet explorer 3.0 html strict//",
	"-//microsoft//dtd internet explorer 3.0 html//",
	"-//microsoft//dtd internet explorer 3.0 tables//",
	"-//netscape comm. corp.//dtd html//",
	"-//netscape comm. corp.//dtd strict html//",
	"-//o'reilly and associates//dtd html 2.0//",
	"-//o'reilly and associates//dtd html extended 1.0//",
	"-//o'reilly and associates//dtd html extended relaxed 1.0//",
	"-//sq//dtd html 2.0 hotmetal + extensions//",
	"-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
	"-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
	"-//spyglass//dtd html 2.0 extended//",
	"-//sun microsystems corp.//dtd hotjava html//",
	"-//sun microsystems corp.//dtd hotjava strict html//",
	"-//w3c//dtd html 3 1995-03-24//",
	"-//w3c//dtd html 3.2 draft//",
	"-//w3c//dtd html 3.2 final//",
	"-//w3c//dtd html 3.2//",
	"-//w3c//dtd html 3.2s draft//",
	"-//w3c//dtd html 4.0 frameset//",
	"-//w3c//dtd html 4.0 transitional//",
	"-//w3c//dtd html experimental 19960712//",
	"-//w3c//dtd html experimental 970421//",
	"-//w3c//dtd w3 html//",
	"-//w3o//dtd w3 html 3.0//",
	"-//webtechs//dtd mozilla html 2.0//",
	"-//webtechs//dtd mozilla html//"
];
var QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...QUIRKS_MODE_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
var QUIRKS_MODE_PUBLIC_IDS = /* @__PURE__ */ new Set([
	"-//w3o//dtd w3 html strict 3.0//en//",
	"-/w3c/dtd html 4.0 transitional/en",
	"html"
]);
var LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"];
var LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
function hasPrefix(publicId, prefixes) {
	return prefixes.some((prefix) => publicId.startsWith(prefix));
}
function isConforming(token) {
	return token.name === VALID_DOCTYPE_NAME && token.publicId === null && (token.systemId === null || token.systemId === VALID_SYSTEM_ID);
}
function getDocumentMode(token) {
	if (token.name !== VALID_DOCTYPE_NAME) return DOCUMENT_MODE.QUIRKS;
	const { systemId } = token;
	if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) return DOCUMENT_MODE.QUIRKS;
	let { publicId } = token;
	if (publicId !== null) {
		publicId = publicId.toLowerCase();
		if (QUIRKS_MODE_PUBLIC_IDS.has(publicId)) return DOCUMENT_MODE.QUIRKS;
		let prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.QUIRKS;
		prefixes = systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.LIMITED_QUIRKS;
	}
	return DOCUMENT_MODE.NO_QUIRKS;
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/common/foreign-content.js
var MIME_TYPES = {
	TEXT_HTML: "text/html",
	APPLICATION_XML: "application/xhtml+xml"
};
var DEFINITION_URL_ATTR = "definitionurl";
var ADJUSTED_DEFINITION_URL_ATTR = "definitionURL";
var SVG_ATTRS_ADJUSTMENT_MAP = new Map([
	"attributeName",
	"attributeType",
	"baseFrequency",
	"baseProfile",
	"calcMode",
	"clipPathUnits",
	"diffuseConstant",
	"edgeMode",
	"filterUnits",
	"glyphRef",
	"gradientTransform",
	"gradientUnits",
	"kernelMatrix",
	"kernelUnitLength",
	"keyPoints",
	"keySplines",
	"keyTimes",
	"lengthAdjust",
	"limitingConeAngle",
	"markerHeight",
	"markerUnits",
	"markerWidth",
	"maskContentUnits",
	"maskUnits",
	"numOctaves",
	"pathLength",
	"patternContentUnits",
	"patternTransform",
	"patternUnits",
	"pointsAtX",
	"pointsAtY",
	"pointsAtZ",
	"preserveAlpha",
	"preserveAspectRatio",
	"primitiveUnits",
	"refX",
	"refY",
	"repeatCount",
	"repeatDur",
	"requiredExtensions",
	"requiredFeatures",
	"specularConstant",
	"specularExponent",
	"spreadMethod",
	"startOffset",
	"stdDeviation",
	"stitchTiles",
	"surfaceScale",
	"systemLanguage",
	"tableValues",
	"targetX",
	"targetY",
	"textLength",
	"viewBox",
	"viewTarget",
	"xChannelSelector",
	"yChannelSelector",
	"zoomAndPan"
].map((attr) => [attr.toLowerCase(), attr]));
var XML_ATTRS_ADJUSTMENT_MAP = /* @__PURE__ */ new Map([
	["xlink:actuate", {
		prefix: "xlink",
		name: "actuate",
		namespace: NS.XLINK
	}],
	["xlink:arcrole", {
		prefix: "xlink",
		name: "arcrole",
		namespace: NS.XLINK
	}],
	["xlink:href", {
		prefix: "xlink",
		name: "href",
		namespace: NS.XLINK
	}],
	["xlink:role", {
		prefix: "xlink",
		name: "role",
		namespace: NS.XLINK
	}],
	["xlink:show", {
		prefix: "xlink",
		name: "show",
		namespace: NS.XLINK
	}],
	["xlink:title", {
		prefix: "xlink",
		name: "title",
		namespace: NS.XLINK
	}],
	["xlink:type", {
		prefix: "xlink",
		name: "type",
		namespace: NS.XLINK
	}],
	["xml:lang", {
		prefix: "xml",
		name: "lang",
		namespace: NS.XML
	}],
	["xml:space", {
		prefix: "xml",
		name: "space",
		namespace: NS.XML
	}],
	["xmlns", {
		prefix: "",
		name: "xmlns",
		namespace: NS.XMLNS
	}],
	["xmlns:xlink", {
		prefix: "xmlns",
		name: "xlink",
		namespace: NS.XMLNS
	}]
]);
var SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map([
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"textPath"
].map((tn) => [tn.toLowerCase(), tn]));
var EXITS_FOREIGN_CONTENT = /* @__PURE__ */ new Set([
	TAG_ID.B,
	TAG_ID.BIG,
	TAG_ID.BLOCKQUOTE,
	TAG_ID.BODY,
	TAG_ID.BR,
	TAG_ID.CENTER,
	TAG_ID.CODE,
	TAG_ID.DD,
	TAG_ID.DIV,
	TAG_ID.DL,
	TAG_ID.DT,
	TAG_ID.EM,
	TAG_ID.EMBED,
	TAG_ID.H1,
	TAG_ID.H2,
	TAG_ID.H3,
	TAG_ID.H4,
	TAG_ID.H5,
	TAG_ID.H6,
	TAG_ID.HEAD,
	TAG_ID.HR,
	TAG_ID.I,
	TAG_ID.IMG,
	TAG_ID.LI,
	TAG_ID.LISTING,
	TAG_ID.MENU,
	TAG_ID.META,
	TAG_ID.NOBR,
	TAG_ID.OL,
	TAG_ID.P,
	TAG_ID.PRE,
	TAG_ID.RUBY,
	TAG_ID.S,
	TAG_ID.SMALL,
	TAG_ID.SPAN,
	TAG_ID.STRONG,
	TAG_ID.STRIKE,
	TAG_ID.SUB,
	TAG_ID.SUP,
	TAG_ID.TABLE,
	TAG_ID.TT,
	TAG_ID.U,
	TAG_ID.UL,
	TAG_ID.VAR
]);
function causesExit(startTagToken) {
	const tn = startTagToken.tagID;
	return tn === TAG_ID.FONT && startTagToken.attrs.some(({ name }) => name === ATTRS.COLOR || name === ATTRS.SIZE || name === ATTRS.FACE) || EXITS_FOREIGN_CONTENT.has(tn);
}
function adjustTokenMathMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) if (token.attrs[i].name === DEFINITION_URL_ATTR) {
		token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
		break;
	}
}
function adjustTokenSVGAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrName != null) token.attrs[i].name = adjustedAttrName;
	}
}
function adjustTokenXMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrEntry) {
			token.attrs[i].prefix = adjustedAttrEntry.prefix;
			token.attrs[i].name = adjustedAttrEntry.name;
			token.attrs[i].namespace = adjustedAttrEntry.namespace;
		}
	}
}
function adjustTokenSVGTagName(token) {
	const adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(token.tagName);
	if (adjustedTagName != null) {
		token.tagName = adjustedTagName;
		token.tagID = getTagID(token.tagName);
	}
}
function isMathMLTextIntegrationPoint(tn, ns) {
	return ns === NS.MATHML && (tn === TAG_ID.MI || tn === TAG_ID.MO || tn === TAG_ID.MN || tn === TAG_ID.MS || tn === TAG_ID.MTEXT);
}
function isHtmlIntegrationPoint(tn, ns, attrs) {
	if (ns === NS.MATHML && tn === TAG_ID.ANNOTATION_XML) {
		for (let i = 0; i < attrs.length; i++) if (attrs[i].name === ATTRS.ENCODING) {
			const value = attrs[i].value.toLowerCase();
			return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
		}
	}
	return ns === NS.SVG && (tn === TAG_ID.FOREIGN_OBJECT || tn === TAG_ID.DESC || tn === TAG_ID.TITLE);
}
function isIntegrationPoint(tn, ns, attrs, foreignNS) {
	return (!foreignNS || foreignNS === NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs) || (!foreignNS || foreignNS === NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns);
}
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/parser/index.js
var HIDDEN_INPUT_TYPE = "hidden";
var AA_OUTER_LOOP_ITER = 8;
var AA_INNER_LOOP_ITER = 3;
var InsertionMode;
(function(InsertionMode) {
	InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
	InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
	InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
	InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
	InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
	InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
	InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
	InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
	InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
	InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
	InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
	InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
	InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
	InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
	InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
	InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
	InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
	InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
	InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
	InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
	InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
	InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
	InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
var BASE_LOC = {
	startLine: -1,
	startCol: -1,
	startOffset: -1,
	endLine: -1,
	endCol: -1,
	endOffset: -1
};
var TABLE_STRUCTURE_TAGS = /* @__PURE__ */ new Set([
	TAG_ID.TABLE,
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
var defaultParserOptions = {
	scriptingEnabled: true,
	sourceCodeLocationInfo: false,
	treeAdapter: defaultTreeAdapter,
	onParseError: null
};
var Parser = class {
	constructor(options, document, fragmentContext = null, scriptHandler = null) {
		this.fragmentContext = fragmentContext;
		this.scriptHandler = scriptHandler;
		this.currentToken = null;
		this.stopped = false;
		/** @internal */
		this.insertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.originalInsertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.headElement = null;
		/** @internal */
		this.formElement = null;
		/** Indicates that the current node is not an element in the HTML namespace */
		this.currentNotInHTML = false;
		/**
		* The template insertion mode stack is maintained from the left.
		* Ie. the topmost element will always have index 0.
		*
		* @internal
		*/
		this.tmplInsertionModeStack = [];
		/** @internal */
		this.pendingCharacterTokens = [];
		/** @internal */
		this.hasNonWhitespacePendingCharacterToken = false;
		/** @internal */
		this.framesetOk = true;
		/** @internal */
		this.skipNextNewLine = false;
		/** @internal */
		this.fosterParentingEnabled = false;
		this.options = {
			...defaultParserOptions,
			...options
		};
		this.treeAdapter = this.options.treeAdapter;
		this.onParseError = this.options.onParseError;
		if (this.onParseError) this.options.sourceCodeLocationInfo = true;
		this.document = document !== null && document !== void 0 ? document : this.treeAdapter.createDocument();
		this.tokenizer = new Tokenizer(this.options, this);
		this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
		this.fragmentContextID = fragmentContext ? getTagID(this.treeAdapter.getTagName(fragmentContext)) : TAG_ID.UNKNOWN;
		this._setContextModes(fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : this.document, this.fragmentContextID);
		this.openElements = new OpenElementStack(this.document, this.treeAdapter, this);
	}
	static parse(html, options) {
		const parser = new this(options);
		parser.tokenizer.write(html, true);
		return parser.document;
	}
	static getFragmentParser(fragmentContext, options) {
		const opts = {
			...defaultParserOptions,
			...options
		};
		fragmentContext !== null && fragmentContext !== void 0 || (fragmentContext = opts.treeAdapter.createElement(TAG_NAMES.TEMPLATE, NS.HTML, []));
		const documentMock = opts.treeAdapter.createElement("documentmock", NS.HTML, []);
		const parser = new this(opts, documentMock, fragmentContext);
		if (parser.fragmentContextID === TAG_ID.TEMPLATE) parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
		parser._initTokenizerForFragmentParsing();
		parser._insertFakeRootElement();
		parser._resetInsertionMode();
		parser._findFormInFragmentContext();
		return parser;
	}
	getFragment() {
		const rootElement = this.treeAdapter.getFirstChild(this.document);
		const fragment = this.treeAdapter.createDocumentFragment();
		this._adoptNodes(rootElement, fragment);
		return fragment;
	}
	/** @internal */
	_err(token, code, beforeToken) {
		var _a;
		if (!this.onParseError) return;
		const loc = (_a = token.location) !== null && _a !== void 0 ? _a : BASE_LOC;
		const err = {
			code,
			startLine: loc.startLine,
			startCol: loc.startCol,
			startOffset: loc.startOffset,
			endLine: beforeToken ? loc.startLine : loc.endLine,
			endCol: beforeToken ? loc.startCol : loc.endCol,
			endOffset: beforeToken ? loc.startOffset : loc.endOffset
		};
		this.onParseError(err);
	}
	/** @internal */
	onItemPush(node, tid, isTop) {
		var _a, _b;
		(_b = (_a = this.treeAdapter).onItemPush) === null || _b === void 0 || _b.call(_a, node);
		if (isTop && this.openElements.stackTop > 0) this._setContextModes(node, tid);
	}
	/** @internal */
	onItemPop(node, isTop) {
		var _a, _b;
		if (this.options.sourceCodeLocationInfo) this._setEndLocation(node, this.currentToken);
		(_b = (_a = this.treeAdapter).onItemPop) === null || _b === void 0 || _b.call(_a, node, this.openElements.current);
		if (isTop) {
			let current;
			let currentTagId;
			if (this.openElements.stackTop === 0 && this.fragmentContext) {
				current = this.fragmentContext;
				currentTagId = this.fragmentContextID;
			} else ({current, currentTagId} = this.openElements);
			this._setContextModes(current, currentTagId);
		}
	}
	_setContextModes(current, tid) {
		const isHTML = current === this.document || current && this.treeAdapter.getNamespaceURI(current) === NS.HTML;
		this.currentNotInHTML = !isHTML;
		this.tokenizer.inForeignNode = !isHTML && current !== void 0 && tid !== void 0 && !this._isIntegrationPoint(tid, current);
	}
	/** @protected */
	_switchToTextParsing(currentToken, nextTokenizerState) {
		this._insertElement(currentToken, NS.HTML);
		this.tokenizer.state = nextTokenizerState;
		this.originalInsertionMode = this.insertionMode;
		this.insertionMode = InsertionMode.TEXT;
	}
	switchToPlaintextParsing() {
		this.insertionMode = InsertionMode.TEXT;
		this.originalInsertionMode = InsertionMode.IN_BODY;
		this.tokenizer.state = TokenizerMode.PLAINTEXT;
	}
	/** @protected */
	_getAdjustedCurrentElement() {
		return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
	}
	/** @protected */
	_findFormInFragmentContext() {
		let node = this.fragmentContext;
		while (node) {
			if (this.treeAdapter.getTagName(node) === TAG_NAMES.FORM) {
				this.formElement = node;
				break;
			}
			node = this.treeAdapter.getParentNode(node);
		}
	}
	_initTokenizerForFragmentParsing() {
		if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== NS.HTML) return;
		switch (this.fragmentContextID) {
			case TAG_ID.TITLE:
			case TAG_ID.TEXTAREA:
				this.tokenizer.state = TokenizerMode.RCDATA;
				break;
			case TAG_ID.STYLE:
			case TAG_ID.XMP:
			case TAG_ID.IFRAME:
			case TAG_ID.NOEMBED:
			case TAG_ID.NOFRAMES:
			case TAG_ID.NOSCRIPT:
				this.tokenizer.state = TokenizerMode.RAWTEXT;
				break;
			case TAG_ID.SCRIPT:
				this.tokenizer.state = TokenizerMode.SCRIPT_DATA;
				break;
			case TAG_ID.PLAINTEXT: this.tokenizer.state = TokenizerMode.PLAINTEXT;
		}
	}
	/** @protected */
	_setDocumentType(token) {
		const name = token.name || "";
		const publicId = token.publicId || "";
		const systemId = token.systemId || "";
		this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
		if (token.location) {
			const docTypeNode = this.treeAdapter.getChildNodes(this.document).find((node) => this.treeAdapter.isDocumentTypeNode(node));
			if (docTypeNode) this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
		}
	}
	/** @protected */
	_attachElementToTree(element, location) {
		if (this.options.sourceCodeLocationInfo) {
			const loc = location && {
				...location,
				startTag: location
			};
			this.treeAdapter.setNodeSourceCodeLocation(element, loc);
		}
		if (this._shouldFosterParentOnInsertion()) this._fosterParentElement(element);
		else {
			const parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.appendChild(parent !== null && parent !== void 0 ? parent : this.document, element);
		}
	}
	/**
	* For self-closing tags. Add an element to the tree, but skip adding it
	* to the stack.
	*/
	/** @protected */
	_appendElement(token, namespaceURI) {
		const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element, token.location);
	}
	/** @protected */
	_insertElement(token, namespaceURI) {
		const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element, token.location);
		this.openElements.push(element, token.tagID);
	}
	/** @protected */
	_insertFakeElement(tagName, tagID) {
		const element = this.treeAdapter.createElement(tagName, NS.HTML, []);
		this._attachElementToTree(element, null);
		this.openElements.push(element, tagID);
	}
	/** @protected */
	_insertTemplate(token) {
		const tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs);
		const content = this.treeAdapter.createDocumentFragment();
		this.treeAdapter.setTemplateContent(tmpl, content);
		this._attachElementToTree(tmpl, token.location);
		this.openElements.push(tmpl, token.tagID);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(content, null);
	}
	/** @protected */
	_insertFakeRootElement() {
		const element = this.treeAdapter.createElement(TAG_NAMES.HTML, NS.HTML, []);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(element, null);
		this.treeAdapter.appendChild(this.openElements.current, element);
		this.openElements.push(element, TAG_ID.HTML);
	}
	/** @protected */
	_appendCommentNode(token, parent) {
		const commentNode = this.treeAdapter.createCommentNode(token.data);
		this.treeAdapter.appendChild(parent, commentNode);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
	}
	/** @protected */
	_insertCharacters(token) {
		let parent;
		let beforeElement;
		if (this._shouldFosterParentOnInsertion()) {
			({parent, beforeElement} = this._findFosterParentingLocation());
			if (beforeElement) this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
			else this.treeAdapter.insertText(parent, token.chars);
		} else {
			parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.insertText(parent, token.chars);
		}
		if (!token.location) return;
		const siblings = this.treeAdapter.getChildNodes(parent);
		const textNode = siblings[(beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length) - 1];
		if (this.treeAdapter.getNodeSourceCodeLocation(textNode)) {
			const { endLine, endCol, endOffset } = token.location;
			this.treeAdapter.updateNodeSourceCodeLocation(textNode, {
				endLine,
				endCol,
				endOffset
			});
		} else if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
	}
	/** @protected */
	_adoptNodes(donor, recipient) {
		for (let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
			this.treeAdapter.detachNode(child);
			this.treeAdapter.appendChild(recipient, child);
		}
	}
	/** @protected */
	_setEndLocation(element, closingToken) {
		if (this.treeAdapter.getNodeSourceCodeLocation(element) && closingToken.location) {
			const ctLoc = closingToken.location;
			const tn = this.treeAdapter.getTagName(element);
			const endLoc = closingToken.type === TokenType.END_TAG && tn === closingToken.tagName ? {
				endTag: { ...ctLoc },
				endLine: ctLoc.endLine,
				endCol: ctLoc.endCol,
				endOffset: ctLoc.endOffset
			} : {
				endLine: ctLoc.startLine,
				endCol: ctLoc.startCol,
				endOffset: ctLoc.startOffset
			};
			this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
		}
	}
	shouldProcessStartTagTokenInForeignContent(token) {
		if (!this.currentNotInHTML) return false;
		let current;
		let currentTagId;
		if (this.openElements.stackTop === 0 && this.fragmentContext) {
			current = this.fragmentContext;
			currentTagId = this.fragmentContextID;
		} else ({current, currentTagId} = this.openElements);
		if (token.tagID === TAG_ID.SVG && this.treeAdapter.getTagName(current) === TAG_NAMES.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(current) === NS.MATHML) return false;
		return this.tokenizer.inForeignNode || (token.tagID === TAG_ID.MGLYPH || token.tagID === TAG_ID.MALIGNMARK) && currentTagId !== void 0 && !this._isIntegrationPoint(currentTagId, current, NS.HTML);
	}
	/** @protected */
	_processToken(token) {
		switch (token.type) {
			case TokenType.CHARACTER:
				this.onCharacter(token);
				break;
			case TokenType.NULL_CHARACTER:
				this.onNullCharacter(token);
				break;
			case TokenType.COMMENT:
				this.onComment(token);
				break;
			case TokenType.DOCTYPE:
				this.onDoctype(token);
				break;
			case TokenType.START_TAG:
				this._processStartTag(token);
				break;
			case TokenType.END_TAG:
				this.onEndTag(token);
				break;
			case TokenType.EOF:
				this.onEof(token);
				break;
			case TokenType.WHITESPACE_CHARACTER: this.onWhitespaceCharacter(token);
		}
	}
	/** @protected */
	_isIntegrationPoint(tid, element, foreignNS) {
		return isIntegrationPoint(tid, this.treeAdapter.getNamespaceURI(element), this.treeAdapter.getAttrList(element), foreignNS);
	}
	/** @protected */
	_reconstructActiveFormattingElements() {
		const listLength = this.activeFormattingElements.entries.length;
		if (listLength) {
			const endIndex = this.activeFormattingElements.entries.findIndex((entry) => entry.type === EntryType.Marker || this.openElements.contains(entry.element));
			const unopenIdx = endIndex === -1 ? listLength - 1 : endIndex - 1;
			for (let i = unopenIdx; i >= 0; i--) {
				const entry = this.activeFormattingElements.entries[i];
				this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
				entry.element = this.openElements.current;
			}
		}
	}
	/** @protected */
	_closeTableCell() {
		this.openElements.generateImpliedEndTags();
		this.openElements.popUntilTableCellPopped();
		this.activeFormattingElements.clearToLastMarker();
		this.insertionMode = InsertionMode.IN_ROW;
	}
	/** @protected */
	_closePElement() {
		this.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.P);
		this.openElements.popUntilTagNamePopped(TAG_ID.P);
	}
	/** @protected */
	_resetInsertionMode() {
		for (let i = this.openElements.stackTop; i >= 0; i--) switch (i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]) {
			case TAG_ID.TR:
				this.insertionMode = InsertionMode.IN_ROW;
				return;
			case TAG_ID.TBODY:
			case TAG_ID.THEAD:
			case TAG_ID.TFOOT:
				this.insertionMode = InsertionMode.IN_TABLE_BODY;
				return;
			case TAG_ID.CAPTION:
				this.insertionMode = InsertionMode.IN_CAPTION;
				return;
			case TAG_ID.COLGROUP:
				this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
				return;
			case TAG_ID.TABLE:
				this.insertionMode = InsertionMode.IN_TABLE;
				return;
			case TAG_ID.BODY:
				this.insertionMode = InsertionMode.IN_BODY;
				return;
			case TAG_ID.FRAMESET:
				this.insertionMode = InsertionMode.IN_FRAMESET;
				return;
			case TAG_ID.SELECT:
				this._resetInsertionModeForSelect(i);
				return;
			case TAG_ID.TEMPLATE:
				this.insertionMode = this.tmplInsertionModeStack[0];
				return;
			case TAG_ID.HTML:
				this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
				return;
			case TAG_ID.TD:
			case TAG_ID.TH:
				if (i > 0) {
					this.insertionMode = InsertionMode.IN_CELL;
					return;
				}
				break;
			case TAG_ID.HEAD: if (i > 0) {
				this.insertionMode = InsertionMode.IN_HEAD;
				return;
			}
		}
		this.insertionMode = InsertionMode.IN_BODY;
	}
	/** @protected */
	_resetInsertionModeForSelect(selectIdx) {
		if (selectIdx > 0) for (let i = selectIdx - 1; i > 0; i--) {
			const tn = this.openElements.tagIDs[i];
			if (tn === TAG_ID.TEMPLATE) break;
			else if (tn === TAG_ID.TABLE) {
				this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
				return;
			}
		}
		this.insertionMode = InsertionMode.IN_SELECT;
	}
	/** @protected */
	_isElementCausesFosterParenting(tn) {
		return TABLE_STRUCTURE_TAGS.has(tn);
	}
	/** @protected */
	_shouldFosterParentOnInsertion() {
		return this.fosterParentingEnabled && this.openElements.currentTagId !== void 0 && this._isElementCausesFosterParenting(this.openElements.currentTagId);
	}
	/** @protected */
	_findFosterParentingLocation() {
		for (let i = this.openElements.stackTop; i >= 0; i--) {
			const openElement = this.openElements.items[i];
			switch (this.openElements.tagIDs[i]) {
				case TAG_ID.TEMPLATE:
					if (this.treeAdapter.getNamespaceURI(openElement) === NS.HTML) return {
						parent: this.treeAdapter.getTemplateContent(openElement),
						beforeElement: null
					};
					break;
				case TAG_ID.TABLE: {
					const parent = this.treeAdapter.getParentNode(openElement);
					if (parent) return {
						parent,
						beforeElement: openElement
					};
					return {
						parent: this.openElements.items[i - 1],
						beforeElement: null
					};
				}
			}
		}
		return {
			parent: this.openElements.items[0],
			beforeElement: null
		};
	}
	/** @protected */
	_fosterParentElement(element) {
		const location = this._findFosterParentingLocation();
		if (location.beforeElement) this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
		else this.treeAdapter.appendChild(location.parent, element);
	}
	/** @protected */
	_isSpecialElement(element, id) {
		return SPECIAL_ELEMENTS[this.treeAdapter.getNamespaceURI(element)].has(id);
	}
	/** @internal */
	onCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			characterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
				characterInBody(this, token);
				break;
			case InsertionMode.TEXT:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				characterInTableText(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onNullCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			nullCharacterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.TEXT:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onComment(token) {
		this.skipNextNewLine = false;
		if (this.currentNotInHTML) {
			appendComment(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
			case InsertionMode.BEFORE_HTML:
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				appendComment(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				appendCommentToRootHtmlElement(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET: appendCommentToDocument(this, token);
		}
	}
	/** @internal */
	onDoctype(token) {
		this.skipNextNewLine = false;
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				doctypeInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
				this._err(token, ERR.misplacedDoctype);
				break;
			case InsertionMode.IN_TABLE_TEXT: tokenInTableText(this, token);
		}
	}
	/** @internal */
	onStartTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		this._processStartTag(token);
		if (token.selfClosing && !token.ackSelfClosing) this._err(token, ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
	}
	/**
	* Processes a given start tag.
	*
	* `onStartTag` checks if a self-closing tag was recognized. When a token
	* is moved inbetween multiple insertion modes, this check for self-closing
	* could lead to false positives. To avoid this, `_processStartTag` is used
	* for nested calls.
	*
	* @param token The token to process.
	* @protected
	*/
	_processStartTag(token) {
		if (this.shouldProcessStartTagTokenInForeignContent(token)) startTagInForeignContent(this, token);
		else this._startTagOutsideForeignContent(token);
	}
	/** @protected */
	_startTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				startTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				startTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				startTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				startTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				startTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				startTagInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
				startTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				startTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				startTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				startTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				startTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				startTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				startTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				startTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				startTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				startTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				startTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				startTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
				startTagAfterAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_FRAMESET: startTagAfterAfterFrameset(this, token);
		}
	}
	/** @internal */
	onEndTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		if (this.currentNotInHTML) endTagInForeignContent(this, token);
		else this._endTagOutsideForeignContent(token);
	}
	/** @protected */
	_endTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				endTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				endTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				endTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				endTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				endTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				endTagInBody(this, token);
				break;
			case InsertionMode.TEXT:
				endTagInText(this, token);
				break;
			case InsertionMode.IN_TABLE:
				endTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				endTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				endTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				endTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				endTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				endTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				endTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				endTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				endTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				endTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				endTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				endTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onEof(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				eofInBody(this, token);
				break;
			case InsertionMode.TEXT:
				eofInText(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				eofInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET: stopParsing(this, token);
		}
	}
	/** @internal */
	onWhitespaceCharacter(token) {
		if (this.skipNextNewLine) {
			this.skipNextNewLine = false;
			if (token.chars.charCodeAt(0) === CODE_POINTS.LINE_FEED) {
				if (token.chars.length === 1) return;
				token.chars = token.chars.substr(1);
			}
		}
		if (this.tokenizer.inForeignNode) {
			this._insertCharacters(token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.TEXT:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.AFTER_BODY:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET:
				whitespaceCharacterInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT: whitespaceCharacterInTableText(this, token);
		}
	}
};
function aaObtainFormattingElementEntry(p, token) {
	let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
	if (formattingElementEntry) {
		if (!p.openElements.contains(formattingElementEntry.element)) {
			p.activeFormattingElements.removeEntry(formattingElementEntry);
			formattingElementEntry = null;
		} else if (!p.openElements.hasInScope(token.tagID)) formattingElementEntry = null;
	} else genericEndTagInBody(p, token);
	return formattingElementEntry;
}
function aaObtainFurthestBlock(p, formattingElementEntry) {
	let furthestBlock = null;
	let idx = p.openElements.stackTop;
	for (; idx >= 0; idx--) {
		const element = p.openElements.items[idx];
		if (element === formattingElementEntry.element) break;
		if (p._isSpecialElement(element, p.openElements.tagIDs[idx])) furthestBlock = element;
	}
	if (!furthestBlock) {
		p.openElements.shortenToLength(Math.max(idx, 0));
		p.activeFormattingElements.removeEntry(formattingElementEntry);
	}
	return furthestBlock;
}
function aaInnerLoop(p, furthestBlock, formattingElement) {
	let lastElement = furthestBlock;
	let nextElement = p.openElements.getCommonAncestor(furthestBlock);
	for (let i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
		nextElement = p.openElements.getCommonAncestor(element);
		const elementEntry = p.activeFormattingElements.getElementEntry(element);
		const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
		if (!elementEntry || counterOverflow) {
			if (counterOverflow) p.activeFormattingElements.removeEntry(elementEntry);
			p.openElements.remove(element);
		} else {
			element = aaRecreateElementFromEntry(p, elementEntry);
			if (lastElement === furthestBlock) p.activeFormattingElements.bookmark = elementEntry;
			p.treeAdapter.detachNode(lastElement);
			p.treeAdapter.appendChild(element, lastElement);
			lastElement = element;
		}
	}
	return lastElement;
}
function aaRecreateElementFromEntry(p, elementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
	const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
	p.openElements.replace(elementEntry.element, newElement);
	elementEntry.element = newElement;
	return newElement;
}
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
	const tid = getTagID(p.treeAdapter.getTagName(commonAncestor));
	if (p._isElementCausesFosterParenting(tid)) p._fosterParentElement(lastElement);
	else {
		const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
		if (tid === TAG_ID.TEMPLATE && ns === NS.HTML) commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
		p.treeAdapter.appendChild(commonAncestor, lastElement);
	}
}
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
	const { token } = formattingElementEntry;
	const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
	p._adoptNodes(furthestBlock, newElement);
	p.treeAdapter.appendChild(furthestBlock, newElement);
	p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
	p.activeFormattingElements.removeEntry(formattingElementEntry);
	p.openElements.remove(formattingElementEntry.element);
	p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
}
function callAdoptionAgency(p, token) {
	for (let i = 0; i < AA_OUTER_LOOP_ITER; i++) {
		const formattingElementEntry = aaObtainFormattingElementEntry(p, token);
		if (!formattingElementEntry) break;
		const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
		if (!furthestBlock) break;
		p.activeFormattingElements.bookmark = formattingElementEntry;
		const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
		const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
		p.treeAdapter.detachNode(lastElement);
		if (commonAncestor) aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
		aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
	}
}
function appendComment(p, token) {
	p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}
function appendCommentToRootHtmlElement(p, token) {
	p._appendCommentNode(token, p.openElements.items[0]);
}
function appendCommentToDocument(p, token) {
	p._appendCommentNode(token, p.document);
}
function stopParsing(p, token) {
	p.stopped = true;
	if (token.location) {
		const target = p.fragmentContext ? 0 : 2;
		for (let i = p.openElements.stackTop; i >= target; i--) p._setEndLocation(p.openElements.items[i], token);
		if (!p.fragmentContext && p.openElements.stackTop >= 0) {
			const htmlElement = p.openElements.items[0];
			const htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);
			if (htmlLocation && !htmlLocation.endTag) {
				p._setEndLocation(htmlElement, token);
				if (p.openElements.stackTop >= 1) {
					const bodyElement = p.openElements.items[1];
					const bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);
					if (bodyLocation && !bodyLocation.endTag) p._setEndLocation(bodyElement, token);
				}
			}
		}
	}
}
function doctypeInInitialMode(p, token) {
	p._setDocumentType(token);
	const mode = token.forceQuirks ? DOCUMENT_MODE.QUIRKS : getDocumentMode(token);
	if (!isConforming(token)) p._err(token, ERR.nonConformingDoctype);
	p.treeAdapter.setDocumentMode(p.document, mode);
	p.insertionMode = InsertionMode.BEFORE_HTML;
}
function tokenInInitialMode(p, token) {
	p._err(token, ERR.missingDoctype, true);
	p.treeAdapter.setDocumentMode(p.document, DOCUMENT_MODE.QUIRKS);
	p.insertionMode = InsertionMode.BEFORE_HTML;
	p._processToken(token);
}
function startTagBeforeHtml(p, token) {
	if (token.tagID === TAG_ID.HTML) {
		p._insertElement(token, NS.HTML);
		p.insertionMode = InsertionMode.BEFORE_HEAD;
	} else tokenBeforeHtml(p, token);
}
function endTagBeforeHtml(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HTML || tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.BR) tokenBeforeHtml(p, token);
}
function tokenBeforeHtml(p, token) {
	p._insertFakeRootElement();
	p.insertionMode = InsertionMode.BEFORE_HEAD;
	p._processToken(token);
}
function startTagBeforeHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.HEAD:
			p._insertElement(token, NS.HTML);
			p.headElement = p.openElements.current;
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		default: tokenBeforeHead(p, token);
	}
}
function endTagBeforeHead(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.HTML || tn === TAG_ID.BR) tokenBeforeHead(p, token);
	else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenBeforeHead(p, token) {
	p._insertFakeElement(TAG_NAMES.HEAD, TAG_ID.HEAD);
	p.headElement = p.openElements.current;
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TITLE:
			p._switchToTextParsing(token, TokenizerMode.RCDATA);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			else {
				p._insertElement(token, NS.HTML);
				p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
			}
			break;
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			break;
		case TAG_ID.SCRIPT:
			p._switchToTextParsing(token, TokenizerMode.SCRIPT_DATA);
			break;
		case TAG_ID.TEMPLATE:
			p._insertTemplate(token);
			p.activeFormattingElements.insertMarker();
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_TEMPLATE;
			p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenInHead(p, token);
	}
}
function endTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HEAD:
			p.openElements.pop();
			p.insertionMode = InsertionMode.AFTER_HEAD;
			break;
		case TAG_ID.BODY:
		case TAG_ID.BR:
		case TAG_ID.HTML:
			tokenInHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function templateEndTagInHead(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.generateImpliedEndTagsThoroughly();
		if (p.openElements.currentTagId !== TAG_ID.TEMPLATE) p._err(token, ERR.closingOfElementWithOpenChildElements);
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
	} else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenInHead(p, token) {
	p.openElements.pop();
	p.insertionMode = InsertionMode.AFTER_HEAD;
	p._processToken(token);
}
function startTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.HEAD:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			p._err(token, ERR.nestedNoscriptInHead);
			break;
		default: tokenInHeadNoScript(p, token);
	}
}
function endTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.NOSCRIPT:
			p.openElements.pop();
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		case TAG_ID.BR:
			tokenInHeadNoScript(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenInHeadNoScript(p, token) {
	const errCode = token.type === TokenType.EOF ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
	p._err(token, errCode);
	p.openElements.pop();
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BODY:
			p._insertElement(token, NS.HTML);
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_BODY;
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_FRAMESET;
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			p._err(token, ERR.abandonedHeadElementChild);
			p.openElements.push(p.headElement, TAG_ID.HEAD);
			startTagInHead(p, token);
			p.openElements.remove(p.headElement);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenAfterHead(p, token);
	}
}
function endTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.BODY:
		case TAG_ID.HTML:
		case TAG_ID.BR:
			tokenAfterHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenAfterHead(p, token) {
	p._insertFakeElement(TAG_NAMES.BODY, TAG_ID.BODY);
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function modeInBody(p, token) {
	switch (token.type) {
		case TokenType.CHARACTER:
			characterInBody(p, token);
			break;
		case TokenType.WHITESPACE_CHARACTER:
			whitespaceCharacterInBody(p, token);
			break;
		case TokenType.COMMENT:
			appendComment(p, token);
			break;
		case TokenType.START_TAG:
			startTagInBody(p, token);
			break;
		case TokenType.END_TAG:
			endTagInBody(p, token);
			break;
		case TokenType.EOF: eofInBody(p, token);
	}
}
function whitespaceCharacterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
}
function characterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
	p.framesetOk = false;
}
function htmlStartTagInBody(p, token) {
	if (p.openElements.tmplCount === 0) p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
}
function bodyStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (bodyElement && p.openElements.tmplCount === 0) {
		p.framesetOk = false;
		p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
	}
}
function framesetStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (p.framesetOk && bodyElement) {
		p.treeAdapter.detachNode(bodyElement);
		p.openElements.popAllUpToHtmlElement();
		p._insertElement(token, NS.HTML);
		p.insertionMode = InsertionMode.IN_FRAMESET;
	}
}
function addressStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	if (p.openElements.currentTagId !== void 0 && NUMBERED_HEADERS.has(p.openElements.currentTagId)) p.openElements.pop();
	p._insertElement(token, NS.HTML);
}
function preStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.skipNextNewLine = true;
	p.framesetOk = false;
}
function formStartTagInBody(p, token) {
	const inTemplate = p.openElements.tmplCount > 0;
	if (!p.formElement || inTemplate) {
		if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
		p._insertElement(token, NS.HTML);
		if (!inTemplate) p.formElement = p.openElements.current;
	}
}
function listItemStartTagInBody(p, token) {
	p.framesetOk = false;
	const tn = token.tagID;
	for (let i = p.openElements.stackTop; i >= 0; i--) {
		const elementId = p.openElements.tagIDs[i];
		if (tn === TAG_ID.LI && elementId === TAG_ID.LI || (tn === TAG_ID.DD || tn === TAG_ID.DT) && (elementId === TAG_ID.DD || elementId === TAG_ID.DT)) {
			p.openElements.generateImpliedEndTagsWithExclusion(elementId);
			p.openElements.popUntilTagNamePopped(elementId);
			break;
		}
		if (elementId !== TAG_ID.ADDRESS && elementId !== TAG_ID.DIV && elementId !== TAG_ID.P && p._isSpecialElement(p.openElements.items[i], elementId)) break;
	}
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
}
function plaintextStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.tokenizer.state = TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BUTTON)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(TAG_ID.BUTTON);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
}
function aStartTagInBody(p, token) {
	const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(TAG_NAMES.A);
	if (activeElementEntry) {
		callAdoptionAgency(p, token);
		p.openElements.remove(activeElementEntry.element);
		p.activeFormattingElements.removeEntry(activeElementEntry);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	if (p.openElements.hasInScope(TAG_ID.NOBR)) {
		callAdoptionAgency(p, token);
		p._reconstructActiveFormattingElements();
	}
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.insertMarker();
	p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
	if (p.treeAdapter.getDocumentMode(p.document) !== DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
	p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function isHiddenInput(token) {
	const inputType = getTokenAttr(token, ATTRS.TYPE);
	return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS.HTML);
	if (!isHiddenInput(token)) p.framesetOk = false;
	token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
	p._appendElement(token, NS.HTML);
	token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._appendElement(token, NS.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
	token.tagName = TAG_NAMES.IMG;
	token.tagID = TAG_ID.IMG;
	areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
	p._insertElement(token, NS.HTML);
	p.skipNextNewLine = true;
	p.tokenizer.state = TokenizerMode.RCDATA;
	p.originalInsertionMode = p.insertionMode;
	p.framesetOk = false;
	p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._reconstructActiveFormattingElements();
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function rawTextStartTagInBody(p, token) {
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
	p.insertionMode = p.insertionMode === InsertionMode.IN_TABLE || p.insertionMode === InsertionMode.IN_CAPTION || p.insertionMode === InsertionMode.IN_TABLE_BODY || p.insertionMode === InsertionMode.IN_ROW || p.insertionMode === InsertionMode.IN_CELL ? InsertionMode.IN_SELECT_IN_TABLE : InsertionMode.IN_SELECT;
}
function optgroupStartTagInBody(p, token) {
	if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
}
function rbStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTags();
	p._insertElement(token, NS.HTML);
}
function rtStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.RTC);
	p._insertElement(token, NS.HTML);
}
function mathStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenMathMLAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS.MATHML);
	else p._insertElement(token, NS.MATHML);
	token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenSVGAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS.SVG);
	else p._insertElement(token, NS.SVG);
	token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
}
function startTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.B:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			bStartTagInBody(p, token);
			break;
		case TAG_ID.A:
			aStartTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderStartTagInBody(p, token);
			break;
		case TAG_ID.P:
		case TAG_ID.DL:
		case TAG_ID.OL:
		case TAG_ID.UL:
		case TAG_ID.DIV:
		case TAG_ID.DIR:
		case TAG_ID.NAV:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.DETAILS:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressStartTagInBody(p, token);
			break;
		case TAG_ID.LI:
		case TAG_ID.DD:
		case TAG_ID.DT:
			listItemStartTagInBody(p, token);
			break;
		case TAG_ID.BR:
		case TAG_ID.IMG:
		case TAG_ID.WBR:
		case TAG_ID.AREA:
		case TAG_ID.EMBED:
		case TAG_ID.KEYGEN:
			areaStartTagInBody(p, token);
			break;
		case TAG_ID.HR:
			hrStartTagInBody(p, token);
			break;
		case TAG_ID.RB:
		case TAG_ID.RTC:
			rbStartTagInBody(p, token);
			break;
		case TAG_ID.RT:
		case TAG_ID.RP:
			rtStartTagInBody(p, token);
			break;
		case TAG_ID.PRE:
		case TAG_ID.LISTING:
			preStartTagInBody(p, token);
			break;
		case TAG_ID.XMP:
			xmpStartTagInBody(p, token);
			break;
		case TAG_ID.SVG:
			svgStartTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlStartTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.STYLE:
		case TAG_ID.TITLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.BGSOUND:
		case TAG_ID.BASEFONT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.BODY:
			bodyStartTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInBody(p, token);
			break;
		case TAG_ID.NOBR:
			nobrStartTagInBody(p, token);
			break;
		case TAG_ID.MATH:
			mathStartTagInBody(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInBody(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInBody(p, token);
			break;
		case TAG_ID.PARAM:
		case TAG_ID.TRACK:
		case TAG_ID.SOURCE:
			paramStartTagInBody(p, token);
			break;
		case TAG_ID.IMAGE:
			imageStartTagInBody(p, token);
			break;
		case TAG_ID.BUTTON:
			buttonStartTagInBody(p, token);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletStartTagInBody(p, token);
			break;
		case TAG_ID.IFRAME:
			iframeStartTagInBody(p, token);
			break;
		case TAG_ID.SELECT:
			selectStartTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
		case TAG_ID.OPTGROUP:
			optgroupStartTagInBody(p, token);
			break;
		case TAG_ID.NOEMBED:
		case TAG_ID.NOFRAMES:
			rawTextStartTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			framesetStartTagInBody(p, token);
			break;
		case TAG_ID.TEXTAREA:
			textareaStartTagInBody(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) rawTextStartTagInBody(p, token);
			else genericStartTagInBody(p, token);
			break;
		case TAG_ID.PLAINTEXT:
			plaintextStartTagInBody(p, token);
			break;
		case TAG_ID.COL:
		case TAG_ID.TH:
		case TAG_ID.TD:
		case TAG_ID.TR:
		case TAG_ID.HEAD:
		case TAG_ID.FRAME:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP: break;
		default: genericStartTagInBody(p, token);
	}
}
function bodyEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		if (p.options.sourceCodeLocationInfo) {
			const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
			if (bodyElement) p._setEndLocation(bodyElement, token);
		}
	}
}
function htmlEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		endTagAfterBody(p, token);
	}
}
function addressEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function formEndTagInBody(p) {
	const inTemplate = p.openElements.tmplCount > 0;
	const { formElement } = p;
	if (!inTemplate) p.formElement = null;
	if ((formElement || inTemplate) && p.openElements.hasInScope(TAG_ID.FORM)) {
		p.openElements.generateImpliedEndTags();
		if (inTemplate) p.openElements.popUntilTagNamePopped(TAG_ID.FORM);
		else if (formElement) p.openElements.remove(formElement);
	}
}
function pEndTagInBody(p) {
	if (!p.openElements.hasInButtonScope(TAG_ID.P)) p._insertFakeElement(TAG_NAMES.P, TAG_ID.P);
	p._closePElement();
}
function liEndTagInBody(p) {
	if (p.openElements.hasInListItemScope(TAG_ID.LI)) {
		p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.LI);
		p.openElements.popUntilTagNamePopped(TAG_ID.LI);
	}
}
function ddEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTagsWithExclusion(tn);
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function numberedHeaderEndTagInBody(p) {
	if (p.openElements.hasNumberedHeaderInScope()) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilNumberedHeaderPopped();
	}
}
function appletEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
		p.activeFormattingElements.clearToLastMarker();
	}
}
function brEndTagInBody(p) {
	p._reconstructActiveFormattingElements();
	p._insertFakeElement(TAG_NAMES.BR, TAG_ID.BR);
	p.openElements.pop();
	p.framesetOk = false;
}
function genericEndTagInBody(p, token) {
	const tn = token.tagName;
	const tid = token.tagID;
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element = p.openElements.items[i];
		const elementId = p.openElements.tagIDs[i];
		if (tid === elementId && (tid !== TAG_ID.UNKNOWN || p.treeAdapter.getTagName(element) === tn)) {
			p.openElements.generateImpliedEndTagsWithExclusion(tid);
			if (p.openElements.stackTop >= i) p.openElements.shortenToLength(i);
			break;
		}
		if (p._isSpecialElement(element, elementId)) break;
	}
}
function endTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.A:
		case TAG_ID.B:
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.NOBR:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			callAdoptionAgency(p, token);
			break;
		case TAG_ID.P:
			pEndTagInBody(p);
			break;
		case TAG_ID.DL:
		case TAG_ID.UL:
		case TAG_ID.OL:
		case TAG_ID.DIR:
		case TAG_ID.DIV:
		case TAG_ID.NAV:
		case TAG_ID.PRE:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.BUTTON:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.DETAILS:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.LISTING:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressEndTagInBody(p, token);
			break;
		case TAG_ID.LI:
			liEndTagInBody(p);
			break;
		case TAG_ID.DD:
		case TAG_ID.DT:
			ddEndTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderEndTagInBody(p);
			break;
		case TAG_ID.BR:
			brEndTagInBody(p);
			break;
		case TAG_ID.BODY:
			bodyEndTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlEndTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formEndTagInBody(p);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletEndTagInBody(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: genericEndTagInBody(p, token);
	}
}
function eofInBody(p, token) {
	if (p.tmplInsertionModeStack.length > 0) eofInTemplate(p, token);
	else stopParsing(p, token);
}
function endTagInText(p, token) {
	var _a;
	if (token.tagID === TAG_ID.SCRIPT) (_a = p.scriptHandler) === null || _a === void 0 || _a.call(p, p.openElements.current);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
}
function eofInText(p, token) {
	p._err(token, ERR.eofInElementThatCanContainOnlyText);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
	p.onEof(token);
}
function characterInTable(p, token) {
	if (p.openElements.currentTagId !== void 0 && TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
		p.pendingCharacterTokens.length = 0;
		p.hasNonWhitespacePendingCharacterToken = false;
		p.originalInsertionMode = p.insertionMode;
		p.insertionMode = InsertionMode.IN_TABLE_TEXT;
		switch (token.type) {
			case TokenType.CHARACTER:
				characterInTableText(p, token);
				break;
			case TokenType.WHITESPACE_CHARACTER: whitespaceCharacterInTableText(p, token);
		}
	} else tokenInTable(p, token);
}
function captionStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p.activeFormattingElements.insertMarker();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.COLGROUP, TAG_ID.COLGROUP);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
	startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.TBODY, TAG_ID.TBODY);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
	startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
	if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
		p._resetInsertionMode();
		p._processStartTag(token);
	}
}
function inputStartTagInTable(p, token) {
	if (isHiddenInput(token)) p._appendElement(token, NS.HTML);
	else tokenInTable(p, token);
	token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
	if (!p.formElement && p.openElements.tmplCount === 0) {
		p._insertElement(token, NS.HTML);
		p.formElement = p.openElements.current;
		p.openElements.pop();
	}
}
function startTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR:
			tdStartTagInTable(p, token);
			break;
		case TAG_ID.STYLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.COL:
			colStartTagInTable(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInTable(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInTable(p, token);
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			tbodyStartTagInTable(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInTable(p, token);
			break;
		case TAG_ID.CAPTION:
			captionStartTagInTable(p, token);
			break;
		case TAG_ID.COLGROUP:
			colgroupStartTagInTable(p, token);
			break;
		default: tokenInTable(p, token);
	}
}
function endTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: tokenInTable(p, token);
	}
}
function tokenInTable(p, token) {
	const savedFosterParentingState = p.fosterParentingEnabled;
	p.fosterParentingEnabled = true;
	modeInBody(p, token);
	p.fosterParentingEnabled = savedFosterParentingState;
}
function whitespaceCharacterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
	p.hasNonWhitespacePendingCharacterToken = true;
}
function tokenInTableText(p, token) {
	let i = 0;
	if (p.hasNonWhitespacePendingCharacterToken) for (; i < p.pendingCharacterTokens.length; i++) tokenInTable(p, p.pendingCharacterTokens[i]);
	else for (; i < p.pendingCharacterTokens.length; i++) p._insertCharacters(p.pendingCharacterTokens[i]);
	p.insertionMode = p.originalInsertionMode;
	p._processToken(token);
}
var TABLE_VOID_ELEMENTS = /* @__PURE__ */ new Set([
	TAG_ID.CAPTION,
	TAG_ID.COL,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
function startTagInCaption(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
			p.openElements.generateImpliedEndTags();
			p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
			p.activeFormattingElements.clearToLastMarker();
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCaption(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.CAPTION:
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_TABLE;
				if (tn === TAG_ID.TABLE) endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: endTagInBody(p, token);
	}
}
function startTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.COL:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		default: tokenInColumnGroup(p, token);
	}
}
function endTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.COLGROUP:
			if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.COL: break;
		default: tokenInColumnGroup(p, token);
	}
}
function tokenInColumnGroup(p, token) {
	if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
		p.openElements.pop();
		p.insertionMode = InsertionMode.IN_TABLE;
		p._processToken(token);
	}
}
function startTagInTableBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			p.openElements.clearBackToTableBodyContext();
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_ROW;
			break;
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableBodyContext();
			p._insertFakeElement(TAG_NAMES.TR, TAG_ID.TR);
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				startTagInTable(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInTableBody(p, token) {
	const tn = token.tagID;
	switch (token.tagID) {
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR: break;
		default: endTagInTable(p, token);
	}
}
function startTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableRowContext();
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_CELL;
			p.activeFormattingElements.insertMarker();
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				startTagInTableBody(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH: break;
		default: endTagInTable(p, token);
	}
}
function startTagInCell(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.TD) || p.openElements.hasInTableScope(TAG_ID.TH)) {
			p._closeTableCell();
			startTagInRow(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCell(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.TD:
		case TAG_ID.TH:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(tn);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_ROW;
			}
			break;
		case TAG_ID.TABLE:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(tn)) {
				p._closeTableCell();
				endTagInRow(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML: break;
		default: endTagInBody(p, token);
	}
}
function startTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.OPTGROUP:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.HR:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.INPUT:
		case TAG_ID.KEYGEN:
		case TAG_ID.TEXTAREA:
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
				if (token.tagID !== TAG_ID.SELECT) p._processStartTag(token);
			}
			break;
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE: startTagInHead(p, token);
	}
}
function endTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.OPTGROUP:
			if (p.openElements.stackTop > 0 && p.openElements.currentTagId === TAG_ID.OPTION && p.openElements.tagIDs[p.openElements.stackTop - 1] === TAG_ID.OPTGROUP) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			break;
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE: templateEndTagInHead(p, token);
	}
}
function startTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
		p._resetInsertionMode();
		p._processStartTag(token);
	} else startTagInSelect(p, token);
}
function endTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		if (p.openElements.hasInTableScope(tn)) {
			p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
			p._resetInsertionMode();
			p.onEndTag(token);
		}
	} else endTagInSelect(p, token);
}
function startTagInTemplate(p, token) {
	switch (token.tagID) {
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
			break;
		case TAG_ID.COL:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
			p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
			startTagInColumnGroup(p, token);
			break;
		case TAG_ID.TR:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
			p.insertionMode = InsertionMode.IN_TABLE_BODY;
			startTagInTableBody(p, token);
			break;
		case TAG_ID.TD:
		case TAG_ID.TH:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		default:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
			p.insertionMode = InsertionMode.IN_BODY;
			startTagInBody(p, token);
	}
}
function endTagInTemplate(p, token) {
	if (token.tagID === TAG_ID.TEMPLATE) templateEndTagInHead(p, token);
}
function eofInTemplate(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
		p.onEof(token);
	} else stopParsing(p, token);
}
function startTagAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterBody(p, token);
}
function endTagAfterBody(p, token) {
	var _a;
	if (token.tagID === TAG_ID.HTML) {
		if (!p.fragmentContext) p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
		if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === TAG_ID.HTML) {
			p._setEndLocation(p.openElements.items[0], token);
			const bodyElement = p.openElements.items[1];
			if (bodyElement && !((_a = p.treeAdapter.getNodeSourceCodeLocation(bodyElement)) === null || _a === void 0 ? void 0 : _a.endTag)) p._setEndLocation(bodyElement, token);
		}
	} else tokenAfterBody(p, token);
}
function tokenAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagInFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.FRAME:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function endTagInFrameset(p, token) {
	if (token.tagID === TAG_ID.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
		p.openElements.pop();
		if (!p.fragmentContext && p.openElements.currentTagId !== TAG_ID.FRAMESET) p.insertionMode = InsertionMode.AFTER_FRAMESET;
	}
}
function startTagAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function endTagAfterFrameset(p, token) {
	if (token.tagID === TAG_ID.HTML) p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
}
function startTagAfterAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterAfterBody(p, token);
}
function tokenAfterAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagAfterAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function nullCharacterInForeignContent(p, token) {
	token.chars = "�";
	p._insertCharacters(token);
}
function characterInForeignContent(p, token) {
	p._insertCharacters(token);
	p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
	while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML && p.openElements.currentTagId !== void 0 && !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)) p.openElements.pop();
}
function startTagInForeignContent(p, token) {
	if (causesExit(token)) {
		popUntilHtmlOrIntegrationPoint(p);
		p._startTagOutsideForeignContent(token);
	} else {
		const current = p._getAdjustedCurrentElement();
		const currentNs = p.treeAdapter.getNamespaceURI(current);
		if (currentNs === NS.MATHML) adjustTokenMathMLAttrs(token);
		else if (currentNs === NS.SVG) {
			adjustTokenSVGTagName(token);
			adjustTokenSVGAttrs(token);
		}
		adjustTokenXMLAttrs(token);
		if (token.selfClosing) p._appendElement(token, currentNs);
		else p._insertElement(token, currentNs);
		token.ackSelfClosing = true;
	}
}
function endTagInForeignContent(p, token) {
	if (token.tagID === TAG_ID.P || token.tagID === TAG_ID.BR) {
		popUntilHtmlOrIntegrationPoint(p);
		p._endTagOutsideForeignContent(token);
		return;
	}
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element = p.openElements.items[i];
		if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
			p._endTagOutsideForeignContent(token);
			break;
		}
		const tagName = p.treeAdapter.getTagName(element);
		if (tagName.toLowerCase() === token.tagName) {
			token.tagName = tagName;
			p.openElements.shortenToLength(i);
			break;
		}
	}
}
TAG_NAMES.AREA, TAG_NAMES.BASE, TAG_NAMES.BASEFONT, TAG_NAMES.BGSOUND, TAG_NAMES.BR, TAG_NAMES.COL, TAG_NAMES.EMBED, TAG_NAMES.FRAME, TAG_NAMES.HR, TAG_NAMES.IMG, TAG_NAMES.INPUT, TAG_NAMES.KEYGEN, TAG_NAMES.LINK, TAG_NAMES.META, TAG_NAMES.PARAM, TAG_NAMES.SOURCE, TAG_NAMES.TRACK, TAG_NAMES.WBR;
//#endregion
//#region node_modules/.pnpm/parse5@7.3.0/node_modules/parse5/dist/index.js
function parseFragment(fragmentContext, html, options) {
	if (typeof fragmentContext === "string") {
		options = html;
		html = fragmentContext;
		fragmentContext = null;
	}
	const parser = Parser.getFragmentParser(fragmentContext, options);
	parser.tokenizer.write(html, true);
	return parser.getFragment();
}
//#endregion
//#region self-essentials/emdash-main/packages/gutenberg-to-portable-text/dist/index.mjs
/**
* URL scheme validation for the converter pipeline (defense-in-depth).
*
* This mirrors the canonical sanitizeHref in packages/core/src/utils/url.ts.
* The converter is a standalone zero-dependency package, so it carries its own
* copy. The render layer in core is the primary defense; this is secondary.
*/
var SAFE_URL_SCHEME_RE = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;
/**
* Returns the URL unchanged if it uses a safe scheme, otherwise returns "".
*
* Returns empty string (not "#") because this is the converter layer — we
* strip bad URLs rather than substituting anchors. The render layer handles
* the fallback to "#".
*/
function sanitizeHref(url) {
	if (!url) return "";
	return SAFE_URL_SCHEME_RE.test(url) ? url : "";
}
/**
* Inline HTML to Portable Text spans converter
*
* Parses inline HTML elements (strong, em, a, code, etc.) and converts
* them to Portable Text spans with marks.
*/
var WHITESPACE_PATTERN = /\S/;
var BLOCK_TAG_PATTERNS = {
	p: {
		open: /^<p[^>]*>/i,
		close: /<\/p>$/i
	},
	h1: {
		open: /^<h1[^>]*>/i,
		close: /<\/h1>$/i
	},
	h2: {
		open: /^<h2[^>]*>/i,
		close: /<\/h2>$/i
	},
	h3: {
		open: /^<h3[^>]*>/i,
		close: /<\/h3>$/i
	},
	h4: {
		open: /^<h4[^>]*>/i,
		close: /<\/h4>$/i
	},
	h5: {
		open: /^<h5[^>]*>/i,
		close: /<\/h5>$/i
	},
	h6: {
		open: /^<h6[^>]*>/i,
		close: /<\/h6>$/i
	},
	li: {
		open: /^<li[^>]*>/i,
		close: /<\/li>$/i
	},
	blockquote: {
		open: /^<blockquote[^>]*>/i,
		close: /<\/blockquote>$/i
	},
	figcaption: {
		open: /^<figcaption[^>]*>/i,
		close: /<\/figcaption>$/i
	}
};
var IMG_ALT_PATTERN = /<img[^>]+alt=["']([^"']*)["']/i;
var FIGCAPTION_PATTERN = /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i;
var IMG_SRC_PATTERN = /<img[^>]+src=["']([^"']*)["']/i;
var URL_AMP_ENTITY_PATTERN = /&amp;/g;
var URL_NUMERIC_AMP_ENTITY_PATTERN = /&#0?38;/g;
var URL_HEX_AMP_ENTITY_PATTERN = /&#x26;/gi;
/**
* Parse inline HTML content into Portable Text spans
*/
function parseInlineContent(html, generateKey) {
	const children = [];
	const markDefs = [];
	const markDefMap = /* @__PURE__ */ new Map();
	if (html.length > 0 && !WHITESPACE_PATTERN.test(html)) return {
		children: [{
			_type: "span",
			_key: generateKey(),
			text: html
		}],
		markDefs: []
	};
	walkNodes(parseFragment(stripBlockTags(html)).childNodes, [], children, markDefs, markDefMap, generateKey);
	if (children.length === 0) children.push({
		_type: "span",
		_key: generateKey(),
		text: ""
	});
	return {
		children,
		markDefs
	};
}
/**
* Strip common block-level wrapper tags
*/
function stripBlockTags(html) {
	let stripped = html.trim();
	for (const tag of [
		"p",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"li",
		"blockquote",
		"figcaption"
	]) {
		const patterns = BLOCK_TAG_PATTERNS[tag];
		if (patterns && patterns.open.test(stripped) && patterns.close.test(stripped)) {
			stripped = stripped.replace(patterns.open, "").replace(patterns.close, "").trim();
			break;
		}
	}
	return stripped;
}
/**
* Recursively walk DOM nodes and build spans
*/
function walkNodes(nodes, currentMarks, children, markDefs, markDefMap, generateKey) {
	for (const node of nodes) if (isTextNode(node)) {
		const text = node.value;
		if (text) {
			const parts = text.split("\n");
			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				if (part || i > 0) {
					if (part) children.push({
						_type: "span",
						_key: generateKey(),
						text: part,
						marks: currentMarks.length > 0 ? [...currentMarks] : void 0
					});
					if (i < parts.length - 1) if (children.length > 0) {
						const lastChild = children.at(-1);
						if (lastChild) lastChild.text += "\n";
					} else children.push({
						_type: "span",
						_key: generateKey(),
						text: "\n"
					});
				}
			}
		}
	} else if (isElement(node)) {
		if (node.tagName.toLowerCase() === "br") {
			if (children.length > 0) {
				const lastChild = children.at(-1);
				if (lastChild) lastChild.text += "\n";
			} else children.push({
				_type: "span",
				_key: generateKey(),
				text: "\n"
			});
			continue;
		}
		const markResult = getMarkForElement(node, markDefs, markDefMap, generateKey);
		const newMarks = markResult ? [...currentMarks, markResult] : currentMarks;
		walkNodes(node.childNodes, newMarks, children, markDefs, markDefMap, generateKey);
	}
}
/**
* Get the Portable Text mark for an HTML element
*/
function getMarkForElement(element, markDefs, markDefMap, generateKey) {
	switch (element.tagName.toLowerCase()) {
		case "strong":
		case "b": return "strong";
		case "em":
		case "i": return "em";
		case "u": return "underline";
		case "s":
		case "strike":
		case "del": return "strike-through";
		case "code": return "code";
		case "sup": return "superscript";
		case "sub": return "subscript";
		case "a": {
			const href = sanitizeHref(getAttr(element, "href"));
			const target = getAttr(element, "target");
			const existingKey = markDefMap.get(href);
			if (existingKey) return existingKey;
			const key = generateKey();
			const markDef = {
				_type: "link",
				_key: key,
				href
			};
			if (target === "_blank") markDef.blank = true;
			markDefs.push(markDef);
			markDefMap.set(href, key);
			return key;
		}
		default: return null;
	}
}
/**
* Get attribute value from element
*/
function getAttr(element, name) {
	return element.attrs.find((a) => a.name.toLowerCase() === name)?.value;
}
/**
* Type guard for text nodes
*/
function isTextNode(node) {
	return node.nodeName === "#text";
}
/**
* Type guard for elements
*/
function isElement(node) {
	return "tagName" in node;
}
/**
* Extract plain text from HTML (for alt text, captions)
*/
function extractText(html) {
	return getTextContent(parseFragment(html).childNodes);
}
function getTextContent(nodes) {
	let text = "";
	for (const node of nodes) if (isTextNode(node)) text += node.value;
	else if (isElement(node)) text += getTextContent(node.childNodes);
	return text.trim();
}
/**
* Extract alt text from an img element in HTML
*/
function extractAlt(html) {
	const match = html.match(IMG_ALT_PATTERN);
	if (match) return match[1];
}
/**
* Extract caption from a figcaption element
*/
function extractCaption(html) {
	const match = html.match(FIGCAPTION_PATTERN);
	if (match?.[1]) return extractText(match[1]);
}
/**
* Extract src from an img element
*/
function extractSrc(html) {
	const match = html.match(IMG_SRC_PATTERN);
	if (!match?.[1]) return void 0;
	return decodeUrlEntities$1(match[1]);
}
/**
* Decode HTML entities commonly found in URLs
*/
function decodeUrlEntities$1(url) {
	return url.replace(URL_AMP_ENTITY_PATTERN, "&").replace(URL_NUMERIC_AMP_ENTITY_PATTERN, "&").replace(URL_HEX_AMP_ENTITY_PATTERN, "&");
}
/** Extract a string attribute, returning undefined if missing or wrong type */
function attrString(attrs, key) {
	const v = attrs[key];
	return typeof v === "string" ? v : void 0;
}
/** Extract a number attribute, returning undefined if missing or wrong type */
function attrNumber(attrs, key) {
	const v = attrs[key];
	return typeof v === "number" ? v : void 0;
}
/** Extract a boolean attribute, returning undefined if missing or wrong type */
function attrBoolean(attrs, key) {
	const v = attrs[key];
	return typeof v === "boolean" ? v : void 0;
}
function isRecord$1(v) {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}
/** Extract an object attribute, returning undefined if missing or wrong type */
function attrObject(attrs, key) {
	const v = attrs[key];
	return isRecord$1(v) ? v : void 0;
}
var UOL_TAG_PATTERN = /<[uo]l[^>]*>([\s\S]*)<\/[uo]l>/i;
var LI_TAG_PATTERN = /<li[^>]*>([\s\S]*?)<\/li>/i;
var UL_TAG_PATTERN = /<ul[^>]*>([\s\S]*)<\/ul>/i;
var OL_TAG_PATTERN = /<ol[^>]*>([\s\S]*)<\/ol>/i;
var NESTED_LIST_PATTERN = /<[uo]l[^>]*>[\s\S]*<\/[uo]l>/gi;
var P_TAG_PATTERN = /<p[^>]*>([\s\S]*?)<\/p>/gi;
var P_TAG_SINGLE_PATTERN = /<p[^>]*>([\s\S]*?)<\/p>/i;
var HREF_PATTERN = /href="([^"]*)"/i;
var DATA_ID_PATTERN = /data-id=["'](\d+)["']/i;
var CODE_TAG_PATTERN_SINGLE = /<code[^>]*>([\s\S]*?)<\/code>/i;
var TABLE_TAG_PATTERN = /<table[^>]*>([\s\S]*?)<\/table>/i;
var THEAD_TAG_PATTERN = /<thead[^>]*>([\s\S]*?)<\/thead>/i;
var IMG_TAG_GLOBAL = /<img[^>]+>/gi;
var TABLE_ROW_PATTERN = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
var TABLE_CELL_PATTERN = /<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi;
var TBODY_TAG_PATTERN = /<tbody[^>]*>([\s\S]*?)<\/tbody>/i;
var CITE_TAG_PATTERN = /<cite[^>]*>([\s\S]*?)<\/cite>/i;
var LT_ENTITY_PATTERN = /&lt;/g;
var GT_ENTITY_PATTERN = /&gt;/g;
var AMP_ENTITY_PATTERN$1 = /&amp;/g;
var QUOT_ENTITY_PATTERN = /&quot;/g;
var APOS_ENTITY_PATTERN$1 = /&#039;/g;
var NBSP_ENTITY_PATTERN$1 = /&nbsp;/g;
/**
* core/paragraph → block with style "normal"
*/
var paragraph = (block, _options, context) => {
	const { children, markDefs } = context.parseInlineContent(block.innerHTML);
	if (children.length === 1 && children[0]?.text === "") return [];
	const result = {
		_type: "block",
		_key: context.generateKey(),
		style: "normal",
		children
	};
	if (markDefs.length > 0) result.markDefs = markDefs;
	return [result];
};
/**
* core/heading → block with style "h1"-"h6"
*/
var heading = (block, _options, context) => {
	const level = attrNumber(block.attrs, "level") ?? 2;
	const { children, markDefs } = context.parseInlineContent(block.innerHTML);
	const result = {
		_type: "block",
		_key: context.generateKey(),
		style: toHeadingStyle(level),
		children
	};
	if (markDefs.length > 0) result.markDefs = markDefs;
	return [result];
};
/**
* core/list → blocks with listItem
*
* Handles both old format (HTML list) and new format (innerBlocks with list-item)
*/
var list = (block, _options, context) => {
	const listItem = block.attrs.ordered === true ? "number" : "bullet";
	if (block.innerBlocks.length > 0) return parseListItemBlocks(block.innerBlocks, listItem, 1, context);
	return parseListItems(block.innerHTML.match(UOL_TAG_PATTERN)?.[1] || block.innerHTML, listItem, 1, context);
};
/**
* Parse list-item blocks (WordPress 6.x format)
*/
function parseListItemBlocks(innerBlocks, listItem, level, context) {
	const blocks = [];
	for (const itemBlock of innerBlocks) {
		if (itemBlock.blockName !== "core/list-item") continue;
		const textContent = itemBlock.innerHTML.match(LI_TAG_PATTERN)?.[1]?.trim() || "";
		if (textContent) {
			const { children, markDefs } = context.parseInlineContent(textContent);
			const block = {
				_type: "block",
				_key: context.generateKey(),
				style: "normal",
				listItem,
				level,
				children
			};
			if (markDefs.length > 0) block.markDefs = markDefs;
			blocks.push(block);
		}
		if (itemBlock.innerBlocks.length > 0) {
			for (const nested of itemBlock.innerBlocks) if (nested.blockName === "core/list") {
				const nestedListItem = nested.attrs.ordered === true ? "number" : "bullet";
				blocks.push(...parseListItemBlocks(nested.innerBlocks, nestedListItem, level + 1, context));
			}
		}
	}
	return blocks;
}
/**
* Parse list items from HTML
*/
function parseListItems(html, listItem, level, context) {
	const blocks = [];
	const liItems = extractTopLevelListItems(html);
	for (const liContent of liItems) {
		const nestedUl = liContent.match(UL_TAG_PATTERN);
		const nestedOl = liContent.match(OL_TAG_PATTERN);
		let textContent = liContent.replace(NESTED_LIST_PATTERN, "").trim();
		if (textContent) {
			const { children, markDefs } = context.parseInlineContent(textContent);
			const block = {
				_type: "block",
				_key: context.generateKey(),
				style: "normal",
				listItem,
				level,
				children
			};
			if (markDefs.length > 0) block.markDefs = markDefs;
			blocks.push(block);
		}
		if (nestedUl?.[1]) blocks.push(...parseListItems(nestedUl[1], "bullet", level + 1, context));
		if (nestedOl?.[1]) blocks.push(...parseListItems(nestedOl[1], "number", level + 1, context));
	}
	return blocks;
}
/**
* Extract top-level <li> items from HTML, handling nested lists correctly
*/
function extractTopLevelListItems(html) {
	const items = [];
	let depth = 0;
	let currentItem = "";
	let inLi = false;
	let i = 0;
	while (i < html.length) {
		if (html.substring(i, i + 3).toLowerCase() === "<li") {
			const tagEnd = html.indexOf(">", i);
			if (tagEnd === -1) break;
			if (!inLi) {
				inLi = true;
				i = tagEnd + 1;
				continue;
			} else {
				currentItem += html.substring(i, tagEnd + 1);
				depth++;
				i = tagEnd + 1;
				continue;
			}
		}
		if (html.substring(i, i + 5).toLowerCase() === "</li>") if (depth === 0) {
			items.push(currentItem);
			currentItem = "";
			inLi = false;
			i += 5;
			continue;
		} else {
			currentItem += "</li>";
			depth--;
			i += 5;
			continue;
		}
		if (html.substring(i, i + 3).toLowerCase() === "<ul" || html.substring(i, i + 3).toLowerCase() === "<ol") {
			const tagEnd = html.indexOf(">", i);
			if (tagEnd !== -1) {
				currentItem += html.substring(i, tagEnd + 1);
				i = tagEnd + 1;
				continue;
			}
		}
		if (html.substring(i, i + 5).toLowerCase() === "</ul>" || html.substring(i, i + 5).toLowerCase() === "</ol>") {
			currentItem += html.substring(i, i + 5);
			i += 5;
			continue;
		}
		if (inLi) currentItem += html[i];
		i++;
	}
	if (currentItem.trim()) items.push(currentItem);
	return items.filter((item) => item.trim().length > 0);
}
/**
* core/quote → block with style "blockquote"
*/
var quote = (block, _options, context) => {
	const blocks = [];
	let match;
	while ((match = P_TAG_PATTERN.exec(block.innerHTML)) !== null) {
		const content = match[1] || "";
		const { children, markDefs } = context.parseInlineContent(content);
		const quoteBlock = {
			_type: "block",
			_key: context.generateKey(),
			style: "blockquote",
			children
		};
		if (markDefs.length > 0) quoteBlock.markDefs = markDefs;
		blocks.push(quoteBlock);
	}
	if (blocks.length === 0) {
		const { children, markDefs } = context.parseInlineContent(block.innerHTML);
		const quoteBlock = {
			_type: "block",
			_key: context.generateKey(),
			style: "blockquote",
			children
		};
		if (markDefs.length > 0) quoteBlock.markDefs = markDefs;
		blocks.push(quoteBlock);
	}
	const citation = attrString(block.attrs, "citation");
	if (citation) {
		const { children, markDefs } = context.parseInlineContent(citation);
		const citationBlock = {
			_type: "block",
			_key: context.generateKey(),
			style: "normal",
			children: [{
				_type: "span",
				_key: context.generateKey(),
				text: "— "
			}, ...children]
		};
		if (markDefs.length > 0) citationBlock.markDefs = markDefs;
		blocks.push(citationBlock);
	}
	return blocks;
};
/**
* core/image → image block
*/
var image = (block, options, context) => {
	const wpId = attrNumber(block.attrs, "id");
	const src = attrString(block.attrs, "url") ?? extractSrc(block.innerHTML);
	const alt = attrString(block.attrs, "alt") ?? extractAlt(block.innerHTML);
	const caption = extractCaption(block.innerHTML);
	const align = attrString(block.attrs, "align");
	const ref = wpId && options.mediaMap?.get(wpId);
	return [{
		_type: "image",
		_key: context.generateKey(),
		asset: {
			_type: "reference",
			_ref: ref || String(wpId || src || ""),
			url: src
		},
		alt,
		caption,
		alignment: mapAlignment(align)
	}];
};
/**
* core/code → code block
*/
var code = (block, _options, context) => {
	const decoded = decodeHtmlEntities$1(block.innerHTML.match(CODE_TAG_PATTERN_SINGLE)?.[1] || block.innerHTML);
	return [{
		_type: "code",
		_key: context.generateKey(),
		code: decoded,
		language: attrString(block.attrs, "language")
	}];
};
/**
* core/preformatted → code block (no syntax highlighting)
*/
var preformatted = (block, _options, context) => {
	const text = extractText(block.innerHTML);
	return [{
		_type: "code",
		_key: context.generateKey(),
		code: text
	}];
};
/**
* core/separator / core/spacer → break block
*/
var separator = (_block, _options, context) => {
	return [{
		_type: "break",
		_key: context.generateKey(),
		style: "lineBreak"
	}];
};
/**
* core/gallery → gallery block
*/
var gallery = (block, options, context) => {
	const images = [];
	if (block.innerBlocks.length > 0) {
		for (const innerBlock of block.innerBlocks) if (innerBlock.blockName === "core/image") {
			const wpId = attrNumber(innerBlock.attrs, "id");
			const src = attrString(innerBlock.attrs, "url") ?? extractSrc(innerBlock.innerHTML);
			const alt = attrString(innerBlock.attrs, "alt") ?? extractAlt(innerBlock.innerHTML);
			const caption = extractCaption(innerBlock.innerHTML);
			const ref = wpId && options.mediaMap?.get(wpId);
			images.push({
				_type: "image",
				_key: context.generateKey(),
				asset: {
					_type: "reference",
					_ref: ref || String(wpId || src || ""),
					url: src
				},
				alt,
				caption
			});
		}
	} else {
		let match;
		while ((match = IMG_TAG_GLOBAL.exec(block.innerHTML)) !== null) {
			const imgHtml = match[0];
			const src = extractSrc(imgHtml);
			const alt = extractAlt(imgHtml);
			const idMatch = imgHtml.match(DATA_ID_PATTERN);
			const wpId = idMatch?.[1] ? parseInt(idMatch[1], 10) : void 0;
			const ref = wpId && options.mediaMap?.get(wpId);
			images.push({
				_type: "image",
				_key: context.generateKey(),
				asset: {
					_type: "reference",
					_ref: ref || String(wpId || src || ""),
					url: src
				},
				alt
			});
		}
	}
	return [{
		_type: "gallery",
		_key: context.generateKey(),
		images,
		columns: attrNumber(block.attrs, "columns")
	}];
};
/**
* core/columns → columns block
*/
var columns = (block, _options, context) => {
	const columnBlocks = block.innerBlocks.map((col) => ({
		_type: "column",
		_key: context.generateKey(),
		content: context.transformBlocks(col.innerBlocks)
	}));
	return [{
		_type: "columns",
		_key: context.generateKey(),
		columns: columnBlocks
	}];
};
/**
* core/group → flatten children (no special container)
*/
var group = (block, _options, context) => {
	return context.transformBlocks(block.innerBlocks);
};
/**
* core/table → table block
*/
var table = (block, _options, context) => {
	const tableMatch = block.innerHTML.match(TABLE_TAG_PATTERN);
	if (!tableMatch) return [];
	const tableContent = tableMatch[1];
	const theadMatch = tableContent.match(THEAD_TAG_PATTERN);
	const tbodyMatch = tableContent.match(TBODY_TAG_PATTERN);
	const rows = [];
	if (theadMatch?.[1]) {
		const headerRows = parseTableRows(theadMatch[1], context, true);
		rows.push(...headerRows);
	}
	if (tbodyMatch?.[1]) {
		const bodyRows = parseTableRows(tbodyMatch[1], context, false);
		rows.push(...bodyRows);
	} else if (!theadMatch) {
		const directRows = parseTableRows(tableContent, context, false);
		rows.push(...directRows);
	}
	if (rows.length === 0) return [];
	return [{
		_type: "table",
		_key: context.generateKey(),
		rows,
		hasHeaderRow: !!theadMatch
	}];
};
/**
* Parse table rows from HTML
*/
function parseTableRows(html, context, isHeader) {
	const rows = [];
	let rowMatch;
	while ((rowMatch = TABLE_ROW_PATTERN.exec(html)) !== null) {
		const rowContent = rowMatch[1];
		const cells = [];
		let cellMatch;
		while ((cellMatch = TABLE_CELL_PATTERN.exec(rowContent)) !== null) {
			const isHeaderCell = cellMatch[1].toLowerCase() === "th" || isHeader;
			const cellContent = cellMatch[2];
			const { children, markDefs } = context.parseInlineContent(cellContent);
			cells.push({
				_type: "tableCell",
				_key: context.generateKey(),
				content: children,
				markDefs: markDefs.length > 0 ? markDefs : void 0,
				isHeader: isHeaderCell || void 0
			});
		}
		if (cells.length > 0) rows.push({
			_type: "tableRow",
			_key: context.generateKey(),
			cells
		});
	}
	return rows;
}
/**
* Convert a heading level number to a PortableTextTextBlock style
*/
function toHeadingStyle(level) {
	switch (level) {
		case 1: return "h1";
		case 2: return "h2";
		case 3: return "h3";
		case 4: return "h4";
		case 5: return "h5";
		case 6: return "h6";
		default: return "h2";
	}
}
/**
* Map WordPress alignment to Portable Text alignment
*/
function mapAlignment(align) {
	switch (align) {
		case "left":
		case "center":
		case "right":
		case "wide":
		case "full": return align;
		default: return;
	}
}
/**
* Decode HTML entities
*/
function decodeHtmlEntities$1(html) {
	return html.replace(LT_ENTITY_PATTERN, "<").replace(GT_ENTITY_PATTERN, ">").replace(AMP_ENTITY_PATTERN$1, "&").replace(QUOT_ENTITY_PATTERN, "\"").replace(APOS_ENTITY_PATTERN$1, "'").replace(NBSP_ENTITY_PATTERN$1, " ");
}
/**
* core/button → button block
*/
var button = (block, _options, context) => {
	const url = sanitizeHref(attrString(block.attrs, "url"));
	const text = extractText(block.innerHTML).trim() || "Button";
	let style = "default";
	const className = attrString(block.attrs, "className");
	if (className?.includes("is-style-outline")) style = "outline";
	else if (className?.includes("is-style-fill")) style = "fill";
	return [{
		_type: "button",
		_key: context.generateKey(),
		text,
		url,
		style
	}];
};
/**
* core/buttons → buttons container block
*/
var buttons = (block, _options, context) => {
	const buttonBlocks = [];
	for (const innerBlock of block.innerBlocks) if (innerBlock.blockName === "core/button") {
		const url = attrString(innerBlock.attrs, "url");
		const text = extractText(innerBlock.innerHTML).trim() || "Button";
		let style = "default";
		const className = attrString(innerBlock.attrs, "className");
		if (className?.includes("is-style-outline")) style = "outline";
		else if (className?.includes("is-style-fill")) style = "fill";
		buttonBlocks.push({
			_type: "button",
			_key: context.generateKey(),
			text,
			url,
			style
		});
	}
	const layoutObj = attrObject(block.attrs, "layout");
	const layout = layoutObj && typeof layoutObj["type"] === "string" && layoutObj["type"] === "flex" ? "horizontal" : "vertical";
	return [{
		_type: "buttons",
		_key: context.generateKey(),
		buttons: buttonBlocks,
		layout
	}];
};
/**
* core/cover → cover block
*/
var cover = (block, _options, context) => {
	const url = attrString(block.attrs, "url");
	const overlayColor = attrString(block.attrs, "overlayColor");
	const customOverlayColor = attrString(block.attrs, "customOverlayColor");
	const dimRatio = attrNumber(block.attrs, "dimRatio");
	const minHeight = attrNumber(block.attrs, "minHeight");
	const minHeightUnit = attrString(block.attrs, "minHeightUnit");
	const contentPosition = attrString(block.attrs, "contentPosition");
	const content = context.transformBlocks(block.innerBlocks);
	let alignment;
	if (contentPosition?.includes("left")) alignment = "left";
	else if (contentPosition?.includes("right")) alignment = "right";
	else if (contentPosition?.includes("center")) alignment = "center";
	let minHeightStr;
	if (minHeight !== void 0) minHeightStr = minHeightUnit ? `${minHeight}${minHeightUnit}` : `${minHeight}px`;
	return [{
		_type: "cover",
		_key: context.generateKey(),
		backgroundImage: url,
		overlayColor: customOverlayColor || overlayColor,
		overlayOpacity: dimRatio !== void 0 ? dimRatio / 100 : void 0,
		content,
		minHeight: minHeightStr,
		alignment
	}];
};
/**
* core/file → file block
*/
var file = (block, _options, context) => {
	const href = sanitizeHref(attrString(block.attrs, "href"));
	const fileName = attrString(block.attrs, "fileName");
	const showDownloadButton = attrBoolean(block.attrs, "showDownloadButton");
	let url = href;
	if (!url) url = sanitizeHref(block.innerHTML.match(HREF_PATTERN)?.[1]);
	let filename = fileName;
	if (!filename && url) filename = url.split("/").pop()?.split("?")[0];
	return [{
		_type: "file",
		_key: context.generateKey(),
		url: url || "",
		filename,
		showDownloadButton: showDownloadButton !== false
	}];
};
/**
* core/pullquote → pullquote block
*/
var pullquote = (block, _options, context) => {
	const pMatch = block.innerHTML.match(P_TAG_SINGLE_PATTERN);
	const text = pMatch ? extractText(pMatch[1]) : extractText(block.innerHTML);
	const citeMatch = block.innerHTML.match(CITE_TAG_PATTERN);
	const citation = citeMatch ? extractText(citeMatch[1]) : attrString(block.attrs, "citation");
	return [{
		_type: "pullquote",
		_key: context.generateKey(),
		text: text.trim(),
		citation: citation?.trim()
	}];
};
/**
* core/html → htmlBlock (pass through)
*/
var html = (block, _options, context) => {
	return [{
		_type: "htmlBlock",
		_key: context.generateKey(),
		html: block.innerHTML.trim(),
		originalBlockName: "core/html"
	}];
};
/**
* core/verse → code block (preserves whitespace like preformatted)
*/
var verse = (block, _options, context) => {
	const text = extractText(block.innerHTML);
	return [{
		_type: "code",
		_key: context.generateKey(),
		code: text,
		language: "text"
	}];
};
/**
* core/more → break block with "readMore" style
*/
var more = (_block, _options, context) => {
	return [{
		_type: "break",
		_key: context.generateKey(),
		style: "lineBreak"
	}];
};
/**
* core/nextpage → break block with page break indicator
*/
var nextpage = (_block, _options, context) => {
	return [{
		_type: "break",
		_key: context.generateKey(),
		style: "lineBreak"
	}];
};
/**
* core/shortcode → htmlBlock (preserve for manual handling)
*/
var shortcode = (block, _options, context) => {
	return [{
		_type: "htmlBlock",
		_key: context.generateKey(),
		html: block.innerHTML.trim(),
		originalBlockName: "core/shortcode"
	}];
};
/**
* core/media-text → columns block with 2 columns
*/
var mediaText = (block, _options, context) => {
	const mediaId = attrNumber(block.attrs, "mediaId");
	const mediaUrl = attrString(block.attrs, "mediaUrl");
	const mediaType = attrString(block.attrs, "mediaType");
	const mediaPosition = attrString(block.attrs, "mediaPosition");
	const mediaAlt = attrString(block.attrs, "mediaAlt");
	const mediaBlock = mediaType === "video" ? [{
		_type: "embed",
		_key: context.generateKey(),
		url: mediaUrl || "",
		provider: "video"
	}] : [{
		_type: "image",
		_key: context.generateKey(),
		asset: {
			_type: "reference",
			_ref: String(mediaId || mediaUrl || ""),
			url: mediaUrl
		},
		alt: mediaAlt
	}];
	const contentBlocks = context.transformBlocks(block.innerBlocks);
	const mediaTextColumns = mediaPosition === "right" ? [{
		_type: "column",
		_key: context.generateKey(),
		content: contentBlocks
	}, {
		_type: "column",
		_key: context.generateKey(),
		content: mediaBlock
	}] : [{
		_type: "column",
		_key: context.generateKey(),
		content: mediaBlock
	}, {
		_type: "column",
		_key: context.generateKey(),
		content: contentBlocks
	}];
	return [{
		_type: "columns",
		_key: context.generateKey(),
		columns: mediaTextColumns
	}];
};
var IFRAME_SRC_PATTERN = /<iframe[^>]+src=["']([^"']+)["']/i;
var VIDEO_SRC_PATTERN = /<video[^>]+src=["']([^"']+)["']/i;
var VIDEO_SOURCE_PATTERN = /<source[^>]+src=["']([^"']+)["']/i;
var AUDIO_SRC_PATTERN = /<audio[^>]+src=["']([^"']+)["']/i;
var AUDIO_SOURCE_PATTERN = /<source[^>]+src=["']([^"']+)["']/i;
/**
* core/embed and variants → embed block
*/
var embed = (block, _options, context) => {
	const url = attrString(block.attrs, "url");
	const providerSlug = attrString(block.attrs, "providerNameSlug");
	const iframeSrc = block.innerHTML.match(IFRAME_SRC_PATTERN)?.[1];
	return [{
		_type: "embed",
		_key: context.generateKey(),
		url: url || iframeSrc || "",
		provider: providerSlug || detectProvider(url || iframeSrc || ""),
		html: block.innerHTML.trim() || void 0
	}];
};
/**
* core-embed/youtube → embed block
*/
var youtube = (block, options, context) => {
	return embed(block, options, context);
};
/**
* core-embed/twitter → embed block
*/
var twitter = (block, options, context) => {
	return embed(block, options, context);
};
/**
* core-embed/vimeo → embed block
*/
var vimeo = (block, options, context) => {
	return embed(block, options, context);
};
/**
* core/video → embed block (self-hosted video)
*/
var video = (block, _options, context) => {
	const src = attrString(block.attrs, "src");
	const videoMatch = block.innerHTML.match(VIDEO_SRC_PATTERN);
	const sourceMatch = block.innerHTML.match(VIDEO_SOURCE_PATTERN);
	const videoSrc = src || videoMatch?.[1] || sourceMatch?.[1];
	return [{
		_type: "embed",
		_key: context.generateKey(),
		url: videoSrc || "",
		provider: "video",
		html: block.innerHTML.trim() || void 0
	}];
};
/**
* core/audio → embed block (self-hosted audio)
*/
var audio = (block, _options, context) => {
	const src = attrString(block.attrs, "src");
	const audioMatch = block.innerHTML.match(AUDIO_SRC_PATTERN);
	const sourceMatch = block.innerHTML.match(AUDIO_SOURCE_PATTERN);
	const audioSrc = src || audioMatch?.[1] || sourceMatch?.[1];
	return [{
		_type: "embed",
		_key: context.generateKey(),
		url: audioSrc || "",
		provider: "audio",
		html: block.innerHTML.trim() || void 0
	}];
};
/**
* Detect embed provider from URL
*/
function detectProvider(url) {
	if (!url) return void 0;
	const urlLower = url.toLowerCase();
	if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return "youtube";
	if (urlLower.includes("vimeo.com")) return "vimeo";
	if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
	if (urlLower.includes("instagram.com")) return "instagram";
	if (urlLower.includes("facebook.com")) return "facebook";
	if (urlLower.includes("tiktok.com")) return "tiktok";
	if (urlLower.includes("spotify.com")) return "spotify";
	if (urlLower.includes("soundcloud.com")) return "soundcloud";
	if (urlLower.includes("codepen.io")) return "codepen";
	if (urlLower.includes("gist.github.com")) return "gist";
}
/**
* Default block transformers for core WordPress blocks
*/
var defaultTransformers = {
	"core/paragraph": paragraph,
	"core/heading": heading,
	"core/list": list,
	"core/quote": quote,
	"core/code": code,
	"core/preformatted": preformatted,
	"core/pullquote": pullquote,
	"core/verse": verse,
	"core/image": image,
	"core/gallery": gallery,
	"core/file": file,
	"core/media-text": mediaText,
	"core/cover": cover,
	"core/columns": columns,
	"core/group": group,
	"core/separator": separator,
	"core/spacer": separator,
	"core/table": table,
	"core/buttons": buttons,
	"core/button": button,
	"core/more": more,
	"core/nextpage": nextpage,
	"core/html": html,
	"core/shortcode": shortcode,
	"core/embed": embed,
	"core/video": video,
	"core/audio": audio,
	"core-embed/youtube": youtube,
	"core-embed/twitter": twitter,
	"core-embed/vimeo": vimeo,
	"core-embed/facebook": embed,
	"core-embed/instagram": embed,
	"core-embed/soundcloud": embed,
	"core-embed/spotify": embed
};
/**
* Fallback transformer for unknown blocks
* Stores the original HTML for manual review
*/
var fallbackTransformer = (block, _options, context) => {
	if (!block.innerHTML.trim() && block.innerBlocks.length === 0) return [];
	if (block.innerBlocks.length > 0) return context.transformBlocks(block.innerBlocks);
	return [{
		_type: "htmlBlock",
		_key: context.generateKey(),
		html: block.innerHTML,
		originalBlockName: block.blockName,
		originalAttrs: Object.keys(block.attrs).length > 0 ? block.attrs : void 0
	}];
};
/**
* Get transformer for a block
*/
function getTransformer(blockName, customTransformers) {
	if (!blockName) return fallbackTransformer;
	if (customTransformers?.[blockName]) return customTransformers[blockName];
	if (defaultTransformers[blockName]) return defaultTransformers[blockName];
	return fallbackTransformer;
}
/**
* Gutenberg to Portable Text Converter
*
* Converts WordPress Gutenberg block content to Portable Text format.
* Uses @wordpress/block-serialization-default-parser to parse the hybrid
* HTML+JSON format that WordPress uses.
*/
var BLOCK_ELEMENT_PATTERN = /<(p|h[1-6]|blockquote|pre|ul|ol|figure|div|hr)[^>]*>([\s\S]*?)<\/\1>|<(hr|br)\s*\/?>|<img\s+[^>]+\/?>/gu;
var LINKED_IMAGE_PATTERN = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>\s*<img\s+([^>]+)\/?>\s*<\/a>/gu;
var STANDALONE_IMAGE_PATTERN = /<img\s+[^>]+\/?>/gu;
var IMG_TAG_PATTERN = /<img[^>]+>/i;
var SRC_ATTR_PATTERN = /src=["']([^"']+)["']/i;
var ALT_ATTR_PATTERN = /alt=["']([^"']*)["']/i;
var LIST_ITEM_PATTERN = /<li[^>]*>([\s\S]*?)<\/li>/gu;
var CODE_TAG_PATTERN = /<code[^>]*>([\s\S]*?)<\/code>/i;
var HTML_TAG_PATTERN = /<[^>]+>/g;
var FIGCAPTION_TAG_PATTERN = /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i;
var AMP_ENTITY_PATTERN = /&amp;/g;
var LESS_THAN_ENTITY_PATTERN = /&lt;/g;
var GREATER_THAN_ENTITY_PATTERN = /&gt;/g;
var QUOTE_ENTITY_PATTERN = /&quot;/g;
var APOS_ENTITY_PATTERN = /&#039;/g;
var NUMERIC_AMP_ENTITY_PATTERN = /&#0?38;/g;
var HEX_AMP_ENTITY_PATTERN = /&#x26;/gi;
var NBSP_ENTITY_PATTERN = /&nbsp;/g;
/**
* Default key generator
*/
function createKeyGenerator() {
	let counter = 0;
	return () => {
		counter++;
		return `key-${counter}-${Math.random().toString(36).substring(2, 7)}`;
	};
}
/**
* Normalize parsed blocks from the WP parser into our GutenbergBlock type.
* The WP parser returns `attrs: Record<string, any> | null`, so we normalize
* null attrs to empty objects and recursively process innerBlocks.
*/
function normalizeBlocks(blocks) {
	return blocks.map((block) => ({
		blockName: block.blockName,
		attrs: block.attrs ?? {},
		innerHTML: block.innerHTML,
		innerBlocks: normalizeBlocks(block.innerBlocks),
		innerContent: block.innerContent
	}));
}
/**
* Convert WordPress Gutenberg content to Portable Text
*
* @param content - WordPress post content (HTML with Gutenberg block comments)
* @param options - Conversion options
* @returns Array of Portable Text blocks
*
* @example
* ```ts
* const portableText = gutenbergToPortableText(`
*   <!-- wp:paragraph -->
*   <p>Hello <strong>world</strong>!</p>
*   <!-- /wp:paragraph -->
* `);
* // → [{ _type: "block", style: "normal", children: [...] }]
* ```
*/
function gutenbergToPortableText(content, options = {}) {
	if (!content || !content.trim()) return [];
	if (!content.includes("<!-- wp:")) return htmlToPortableText(content, options);
	const blocks = normalizeBlocks(parse(content));
	const context = createTransformContext(options, options.keyGenerator || createKeyGenerator());
	return blocks.flatMap((block) => transformBlock(block, options, context));
}
/**
* Convert plain HTML (classic editor) to Portable Text
*/
function htmlToPortableText(html, options = {}) {
	const generateKey = options.keyGenerator || createKeyGenerator();
	const blocks = [];
	let lastIndex = 0;
	let match;
	while ((match = BLOCK_ELEMENT_PATTERN.exec(html)) !== null) {
		const fullMatch = match[0];
		const tag = (match[1] || match[3] || "").toLowerCase();
		const content = match[2] || "";
		const between = html.slice(lastIndex, match.index).trim();
		if (between) {
			const { children, markDefs } = parseInlineContent(between, generateKey);
			if (children.some((c) => c.text.trim())) blocks.push({
				_type: "block",
				_key: generateKey(),
				style: "normal",
				children,
				markDefs: markDefs.length > 0 ? markDefs : void 0
			});
		}
		lastIndex = match.index + match[0].length;
		if (fullMatch.toLowerCase().startsWith("<img")) {
			const srcMatch = fullMatch.match(SRC_ATTR_PATTERN);
			const altMatch = fullMatch.match(ALT_ATTR_PATTERN);
			if (srcMatch?.[1]) {
				const imgUrl = decodeUrlEntities(srcMatch[1]);
				blocks.push({
					_type: "image",
					_key: generateKey(),
					asset: {
						_type: "reference",
						_ref: imgUrl,
						url: imgUrl
					},
					alt: altMatch?.[1]
				});
			}
			continue;
		}
		switch (tag) {
			case "p":
			case "div": {
				const linkedImgPositions = [];
				let linkedMatch;
				while ((linkedMatch = LINKED_IMAGE_PATTERN.exec(content)) !== null) {
					const linkUrl = decodeUrlEntities(linkedMatch[1]);
					const imgAttrs = linkedMatch[2];
					const srcMatch = imgAttrs.match(SRC_ATTR_PATTERN);
					const altMatch = imgAttrs.match(ALT_ATTR_PATTERN);
					if (srcMatch?.[1]) {
						const imgUrl = decodeUrlEntities(srcMatch[1]);
						blocks.push({
							_type: "image",
							_key: generateKey(),
							asset: {
								_type: "reference",
								_ref: imgUrl,
								url: imgUrl
							},
							alt: altMatch?.[1],
							link: linkUrl
						});
					}
					linkedImgPositions.push({
						start: linkedMatch.index,
						end: linkedMatch.index + linkedMatch[0].length
					});
				}
				let imgMatch;
				while ((imgMatch = STANDALONE_IMAGE_PATTERN.exec(content)) !== null) {
					if (linkedImgPositions.some((pos) => imgMatch.index >= pos.start && imgMatch.index < pos.end)) continue;
					const srcMatch = imgMatch[0].match(SRC_ATTR_PATTERN);
					const altMatch = imgMatch[0].match(ALT_ATTR_PATTERN);
					if (srcMatch?.[1]) {
						const imgUrl = decodeUrlEntities(srcMatch[1]);
						blocks.push({
							_type: "image",
							_key: generateKey(),
							asset: {
								_type: "reference",
								_ref: imgUrl,
								url: imgUrl
							},
							alt: altMatch?.[1]
						});
					}
				}
				let textContent = content.replace(LINKED_IMAGE_PATTERN, "").replace(STANDALONE_IMAGE_PATTERN, "").trim();
				if (textContent) {
					const { children, markDefs } = parseInlineContent(textContent, generateKey);
					if (children.some((c) => c.text.trim())) blocks.push({
						_type: "block",
						_key: generateKey(),
						style: "normal",
						children,
						markDefs: markDefs.length > 0 ? markDefs : void 0
					});
				}
				break;
			}
			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6": {
				const { children, markDefs } = parseInlineContent(content, generateKey);
				blocks.push({
					_type: "block",
					_key: generateKey(),
					style: tag,
					children,
					markDefs: markDefs.length > 0 ? markDefs : void 0
				});
				break;
			}
			case "blockquote": {
				const { children, markDefs } = parseInlineContent(content, generateKey);
				blocks.push({
					_type: "block",
					_key: generateKey(),
					style: "blockquote",
					children,
					markDefs: markDefs.length > 0 ? markDefs : void 0
				});
				break;
			}
			case "pre": {
				const code = content.match(CODE_TAG_PATTERN)?.[1] || content;
				blocks.push({
					_type: "code",
					_key: generateKey(),
					code: decodeHtmlEntities(code)
				});
				break;
			}
			case "ul":
			case "ol": {
				const listItem = tag === "ol" ? "number" : "bullet";
				let liMatch;
				while ((liMatch = LIST_ITEM_PATTERN.exec(content)) !== null) {
					const { children, markDefs } = parseInlineContent(liMatch[1] || "", generateKey);
					blocks.push({
						_type: "block",
						_key: generateKey(),
						style: "normal",
						listItem,
						level: 1,
						children,
						markDefs: markDefs.length > 0 ? markDefs : void 0
					});
				}
				break;
			}
			case "hr":
				blocks.push({
					_type: "break",
					_key: generateKey(),
					style: "lineBreak"
				});
				break;
			case "figure": {
				const imgMatch = content.match(IMG_TAG_PATTERN);
				if (imgMatch) {
					const srcMatch = imgMatch[0].match(SRC_ATTR_PATTERN);
					const altMatch = imgMatch[0].match(ALT_ATTR_PATTERN);
					const captionMatch = content.match(FIGCAPTION_TAG_PATTERN);
					const imgUrl = srcMatch?.[1] ? decodeUrlEntities(srcMatch[1]) : "";
					blocks.push({
						_type: "image",
						_key: generateKey(),
						asset: {
							_type: "reference",
							_ref: imgUrl,
							url: imgUrl || void 0
						},
						alt: altMatch?.[1],
						caption: captionMatch?.[1]?.replace(HTML_TAG_PATTERN, "").trim()
					});
				}
				break;
			}
		}
	}
	const remaining = html.slice(lastIndex).trim();
	if (remaining) {
		const { children, markDefs } = parseInlineContent(remaining, generateKey);
		if (children.some((c) => c.text.trim())) blocks.push({
			_type: "block",
			_key: generateKey(),
			style: "normal",
			children,
			markDefs: markDefs.length > 0 ? markDefs : void 0
		});
	}
	return blocks;
}
/**
* Create transform context for recursive block transformation
*/
function createTransformContext(options, generateKey) {
	const context = {
		generateKey,
		parseInlineContent: (html) => parseInlineContent(html, generateKey),
		transformBlocks: (blocks) => blocks.flatMap((block) => transformBlock(block, options, context))
	};
	return context;
}
/**
* Transform a single block
*/
function transformBlock(block, options, context) {
	return getTransformer(block.blockName, options.customTransformers)(block, options, context);
}
/**
* Decode HTML entities
*/
function decodeHtmlEntities(html) {
	return html.replace(LESS_THAN_ENTITY_PATTERN, "<").replace(GREATER_THAN_ENTITY_PATTERN, ">").replace(AMP_ENTITY_PATTERN, "&").replace(QUOTE_ENTITY_PATTERN, "\"").replace(APOS_ENTITY_PATTERN, "'").replace(NUMERIC_AMP_ENTITY_PATTERN, "&").replace(HEX_AMP_ENTITY_PATTERN, "&").replace(NBSP_ENTITY_PATTERN, " ");
}
/**
* Decode HTML entities in URLs (used for image src attributes)
*/
function decodeUrlEntities(url) {
	return url.replace(AMP_ENTITY_PATTERN, "&").replace(NUMERIC_AMP_ENTITY_PATTERN, "&").replace(HEX_AMP_ENTITY_PATTERN, "&");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/import-PKhLeXvn.mjs
var PHP_SERIALIZED_STRING_PATTERN = /s:\d+:"([^"]+)"/g;
var PHP_SERIALIZED_STRING_MATCH_PATTERN = /s:\d+:"([^"]+)"/;
/**
* WPML stores per-post language in postmeta as `_icl_lang_code`. The shared
* translation id is `trid` (this is the group ID -- every translation of the
* same content shares it). `_icl_translation_id` exists on some exports too
* but is a per-translation row id from `wp_icl_translations`, NOT the group
* id, so it must NOT be used as the group key. We accept it only when `trid`
* is absent and trust the export to be internally consistent (the only case
* where that's reasonable is single-post exports with no real grouping).
*
* See `wpml_element_trid` in the WPML hook docs: "the ID of the translation
* group".
*/
var WPML_LOCALE_META_KEYS = ["_icl_lang_code"];
var WPML_TRID_META_KEYS = ["trid", "_icl_translation_id"];
/**
* Polylang stores per-post language in postmeta as `_locale` on newer
* exports. The actual language taxonomy assignment lives on
* `customTaxonomies.language`, which we use as a fallback. Translation
* grouping is encoded in `_translations` as a serialized PHP map of
* `{ lang_code => post_id }`; we synthesize a stable group key from the
* sorted IDs so every member of the group resolves to the same string.
*/
var POLYLANG_LOCALE_META_KEY = "_locale";
var POLYLANG_TRANSLATIONS_META_KEY = "_translations";
var POLYLANG_LANG_TAXONOMY = "language";
/**
* Extract a list of post-IDs from Polylang's `_translations` PHP-serialized
* value. The format we care about is roughly:
*
*   a:2:{s:2:"en";i:1;s:2:"ar";i:7;}
*
* We don't need to round-trip the PHP value -- we just need a stable group
* key shared by every translation of the same content. Concatenating the
* sorted IDs gives us exactly that: every post in the group derives the
* same key from its own copy of `_translations`.
*
* Naïve `/i:(\d+);/g` would also match `i:N;` literals embedded INSIDE
* string values (e.g. `s:11:"i:42;hello";`), which would silently corrupt
* the group key. We walk the serialized blob token-by-token instead.
*
* PHP serializes `s:LEN:"..."` with LEN counted in BYTES, not characters
* (UTF-8 byte length). JS string positions are UTF-16 code units, so we
* encode to bytes via `TextEncoder` and walk byte offsets. Single-byte-only
* inputs (the common case for Polylang's `_translations` which only stores
* ASCII locale codes) take the same path; the encoder is cheap.
*/
function polylangTranslationGroupFromMeta(serialized) {
	const bytes = new TextEncoder().encode(serialized);
	const decoder = new TextDecoder("utf-8");
	const ids = [];
	let i = 0;
	const n = bytes.length;
	const CHAR_S = 115;
	const CHAR_I = 105;
	const CHAR_COLON = 58;
	const CHAR_SEMI = 59;
	const CHAR_QUOTE = 34;
	const indexOf = (byte, from) => {
		for (let k = from; k < n; k++) if (bytes[k] === byte) return k;
		return -1;
	};
	while (i < n) {
		const ch = bytes[i];
		if (ch === CHAR_S && bytes[i + 1] === CHAR_COLON) {
			const lenStart = i + 2;
			const lenEnd = indexOf(CHAR_COLON, lenStart);
			if (lenEnd === -1) break;
			const lenText = decoder.decode(bytes.slice(lenStart, lenEnd));
			const len = Number.parseInt(lenText, 10);
			if (!Number.isFinite(len) || len < 0) {
				i = lenEnd + 1;
				continue;
			}
			if (bytes[lenEnd + 1] !== CHAR_QUOTE) {
				i = lenEnd + 1;
				continue;
			}
			i = lenEnd + 2 + len + 2;
			continue;
		}
		if (ch === CHAR_I && bytes[i + 1] === CHAR_COLON) {
			const valStart = i + 2;
			const valEnd = indexOf(CHAR_SEMI, valStart);
			if (valEnd === -1) break;
			const idText = decoder.decode(bytes.slice(valStart, valEnd));
			const id = Number.parseInt(idText, 10);
			if (Number.isFinite(id)) ids.push(id);
			i = valEnd + 1;
			continue;
		}
		i++;
	}
	if (ids.length === 0) return void 0;
	return `pll:${[...new Set(ids)].toSorted((a, b) => a - b).join(",")}`;
}
/**
* Promote multilingual-plugin metadata from `post.meta` and
* `post.customTaxonomies` into `post.locale` / `post.translationGroup`.
*
* Called once per `<item>` after all of its `<wp:postmeta>` and per-item
* `<category>` entries have been parsed. Safe to call on posts that have no
* multilingual metadata -- it's a no-op in that case.
*
* WPML wins over Polylang when both are present (they shouldn't co-exist on
* the same site, but defensive precedence avoids ambiguity).
*/
function promoteI18nMetadata(post) {
	for (const key of WPML_LOCALE_META_KEYS) {
		const value = post.meta.get(key);
		if (value) {
			post.locale = value;
			break;
		}
	}
	for (const key of WPML_TRID_META_KEYS) {
		const value = post.meta.get(key);
		if (value) {
			post.translationGroup = `wpml:${value}`;
			break;
		}
	}
	if (!post.locale) {
		const pllLocale = post.meta.get(POLYLANG_LOCALE_META_KEY);
		if (pllLocale) post.locale = pllLocale;
		else {
			const firstLang = (post.customTaxonomies?.get(POLYLANG_LANG_TAXONOMY))?.[0];
			if (firstLang) post.locale = firstLang;
		}
	}
	if (!post.translationGroup) {
		const pllTranslations = post.meta.get(POLYLANG_TRANSLATIONS_META_KEY);
		if (pllTranslations) {
			const group = polylangTranslationGroupFromMeta(pllTranslations);
			if (group) post.translationGroup = group;
		}
	}
}
/** Extract string value from a SAX attribute (handles both Tag and QualifiedTag) */
function attrStr(attr) {
	if (typeof attr === "string") return attr;
	if (attr && typeof attr === "object" && "value" in attr) return attr.value;
	return "";
}
/**
* Normalise a `<category domain="...">` value to the matching EmDash
* taxonomy name so per-item label captures can be retrieved later using
* the same key.
*/
function normaliseDomain(domain) {
	if (domain === "post_tag") return "tag";
	return domain;
}
/**
* Persist the human label of a `<category>` text body keyed by the
* normalised `(taxonomy, slug)` pair. Skips trivial labels that equal the
* slug (no information vs. just storing the slug).
*/
function captureItemCategoryLabel(item, pair, label) {
	if (!label || label === pair.nicename) return;
	if (!item.taxonomyLabels) item.taxonomyLabels = /* @__PURE__ */ new Map();
	const key = `${normaliseDomain(pair.domain)}\u0000${pair.nicename}`;
	if (!item.taxonomyLabels.has(key)) item.taxonomyLabels.set(key, label);
}
/** Type guard for complete WxrTerm (all required fields present) */
function isCompleteWxrTerm(term) {
	return term.id !== void 0 && term.taxonomy !== void 0 && term.slug !== void 0 && term.name !== void 0;
}
/**
* Parse a WordPress WXR export from a string
*
* Uses the non-streaming SAX parser API for compatibility with
* environments that don't have Node.js streams (e.g., Cloudflare Workers).
*/
function parseWxrString(xml) {
	return new Promise((resolve, reject) => {
		const parser = import_sax.default.parser(true, {
			trim: false,
			normalize: false
		});
		const data = {
			site: {},
			posts: [],
			attachments: [],
			categories: [],
			tags: [],
			authors: [],
			terms: [],
			navMenus: []
		};
		let currentPath = [];
		let currentText = "";
		let currentItem = null;
		let currentAttachment = null;
		let currentCategory = null;
		let currentTag = null;
		let currentAuthor = null;
		let currentTerm = null;
		let currentMetaKey = "";
		let pendingItemCategory = null;
		const navMenuItemPosts = [];
		const menuTermsBySlug = /* @__PURE__ */ new Map();
		parser.onopentag = (node) => {
			const tag = node.name.toLowerCase();
			currentPath.push(tag);
			currentText = "";
			if (tag === "item") currentItem = {
				categories: [],
				tags: [],
				customTaxonomies: /* @__PURE__ */ new Map(),
				meta: /* @__PURE__ */ new Map()
			};
			else if (tag === "wp:category") currentCategory = {};
			else if (tag === "wp:tag") currentTag = {};
			else if (tag === "wp:author") currentAuthor = {};
			else if (tag === "wp:term") currentTerm = {};
			if (tag === "category" && currentItem && node.attributes) {
				const domain = attrStr(node.attributes.domain);
				const nicename = attrStr(node.attributes.nicename);
				if (domain === "category" && nicename) {
					currentItem.categories.push(nicename);
					pendingItemCategory = {
						domain,
						nicename
					};
				} else if (domain === "post_tag" && nicename) {
					currentItem.tags.push(nicename);
					pendingItemCategory = {
						domain,
						nicename
					};
				} else if (domain && nicename && domain !== "category" && domain !== "post_tag") {
					if (!currentItem.customTaxonomies) currentItem.customTaxonomies = /* @__PURE__ */ new Map();
					const existing = currentItem.customTaxonomies.get(domain) || [];
					existing.push(nicename);
					currentItem.customTaxonomies.set(domain, existing);
					pendingItemCategory = {
						domain,
						nicename
					};
				}
			}
		};
		parser.ontext = (text) => {
			currentText += text;
		};
		parser.oncdata = (cdata) => {
			currentText += cdata;
		};
		parser.onclosetag = (tagName) => {
			const tag = tagName.toLowerCase();
			const text = currentText.trim();
			if (currentPath.length === 2 && currentPath[0] === "rss") switch (tag) {
				case "title":
					data.site.title = text;
					break;
				case "link":
					data.site.link = text;
					break;
				case "description":
					data.site.description = text;
					break;
				case "language":
					data.site.language = text;
					break;
				case "wp:base_site_url":
					data.site.baseSiteUrl = text;
					break;
				case "wp:base_blog_url":
					data.site.baseBlogUrl = text;
					break;
			}
			if (currentItem) switch (tag) {
				case "title":
					currentItem.title = text;
					break;
				case "link":
					currentItem.link = text;
					break;
				case "pubdate":
					currentItem.pubDate = text;
					break;
				case "dc:creator":
					currentItem.creator = text;
					break;
				case "guid":
					currentItem.guid = text;
					break;
				case "description":
					currentItem.description = text;
					break;
				case "content:encoded":
					currentItem.content = text;
					break;
				case "excerpt:encoded":
					currentItem.excerpt = text;
					break;
				case "wp:post_id":
					currentItem.id = parseInt(text, 10);
					break;
				case "wp:post_date":
					currentItem.postDate = text;
					break;
				case "wp:post_date_gmt":
					currentItem.postDateGmt = text;
					break;
				case "wp:post_modified":
					currentItem.postModified = text;
					break;
				case "wp:post_modified_gmt":
					currentItem.postModifiedGmt = text;
					break;
				case "wp:comment_status":
					currentItem.commentStatus = text;
					break;
				case "wp:ping_status":
					currentItem.pingStatus = text;
					break;
				case "wp:post_name":
					currentItem.postName = text;
					break;
				case "wp:status":
					currentItem.status = text;
					break;
				case "wp:post_parent":
					currentItem.postParent = parseInt(text, 10);
					break;
				case "wp:menu_order":
					currentItem.menuOrder = parseInt(text, 10);
					break;
				case "wp:post_type":
					currentItem.postType = text;
					if (text === "attachment") currentAttachment = {
						id: currentItem.id,
						title: currentItem.title,
						url: currentItem.link,
						postDate: currentItem.postDate,
						meta: /* @__PURE__ */ new Map()
					};
					break;
				case "wp:post_password":
					currentItem.postPassword = text || void 0;
					break;
				case "wp:is_sticky":
					currentItem.isSticky = text === "1";
					break;
				case "wp:attachment_url":
					if (currentAttachment) currentAttachment.url = text;
					break;
				case "wp:meta_key":
					currentMetaKey = text;
					break;
				case "wp:meta_value":
					if (currentMetaKey && currentItem.meta) currentItem.meta.set(currentMetaKey, text);
					break;
				case "category":
					if (pendingItemCategory && text) captureItemCategoryLabel(currentItem, pendingItemCategory, text);
					pendingItemCategory = null;
					break;
				case "item":
					if (currentAttachment) {
						data.attachments.push(currentAttachment);
						currentAttachment = null;
					} else if (currentItem.postType === "nav_menu_item") {
						navMenuItemPosts.push(currentItem);
						data.posts.push(currentItem);
					} else if (currentItem.postType !== "attachment") {
						promoteI18nMetadata(currentItem);
						data.posts.push(currentItem);
					}
					currentItem = null;
					break;
			}
			if (currentCategory) switch (tag) {
				case "wp:term_id":
					currentCategory.id = parseInt(text, 10);
					break;
				case "wp:category_nicename":
					currentCategory.nicename = text;
					break;
				case "wp:cat_name":
					currentCategory.name = text;
					break;
				case "wp:category_parent":
					currentCategory.parent = text || void 0;
					break;
				case "wp:category_description":
					currentCategory.description = text || void 0;
					break;
				case "wp:category":
					if (currentCategory.name) data.categories.push(currentCategory);
					currentCategory = null;
					break;
			}
			if (currentTag) switch (tag) {
				case "wp:term_id":
					currentTag.id = parseInt(text, 10);
					break;
				case "wp:tag_slug":
					currentTag.slug = text;
					break;
				case "wp:tag_name":
					currentTag.name = text;
					break;
				case "wp:tag_description":
					currentTag.description = text || void 0;
					break;
				case "wp:tag":
					if (currentTag.name) data.tags.push(currentTag);
					currentTag = null;
					break;
			}
			if (currentAuthor) switch (tag) {
				case "wp:author_id":
					currentAuthor.id = parseInt(text, 10);
					break;
				case "wp:author_login":
					currentAuthor.login = text;
					break;
				case "wp:author_email":
					currentAuthor.email = text;
					break;
				case "wp:author_display_name":
					currentAuthor.displayName = text;
					break;
				case "wp:author_first_name":
					currentAuthor.firstName = text;
					break;
				case "wp:author_last_name":
					currentAuthor.lastName = text;
					break;
				case "wp:author":
					if (currentAuthor.login) data.authors.push(currentAuthor);
					currentAuthor = null;
					break;
			}
			if (currentTerm) switch (tag) {
				case "wp:term_id":
					currentTerm.id = parseInt(text, 10);
					break;
				case "wp:term_taxonomy":
					currentTerm.taxonomy = text;
					break;
				case "wp:term_slug":
					currentTerm.slug = text;
					break;
				case "wp:term_name":
					currentTerm.name = text;
					break;
				case "wp:term_parent":
					currentTerm.parent = text || void 0;
					break;
				case "wp:term_description":
					currentTerm.description = text || void 0;
					break;
				case "wp:term":
					if (isCompleteWxrTerm(currentTerm)) {
						data.terms.push(currentTerm);
						if (currentTerm.taxonomy === "nav_menu") menuTermsBySlug.set(currentTerm.slug, currentTerm.id);
					}
					currentTerm = null;
					break;
			}
			currentPath.pop();
			currentText = "";
		};
		parser.onerror = (err) => {
			reject(/* @__PURE__ */ new Error(`XML parsing error: ${err.message}`));
		};
		parser.onend = () => {
			data.navMenus = buildNavMenus(navMenuItemPosts, menuTermsBySlug);
			resolve(data);
		};
		parser.write(xml).close();
	});
}
/**
* Build structured navigation menus from nav_menu_item posts
*/
function buildNavMenus(navMenuItemPosts, menuTermsBySlug) {
	const menuItemsByMenu = /* @__PURE__ */ new Map();
	for (const post of navMenuItemPosts) {
		const navMenuSlugs = post.customTaxonomies?.get("nav_menu");
		if (!navMenuSlugs || navMenuSlugs.length === 0) continue;
		const menuSlug = navMenuSlugs[0];
		if (!menuSlug) continue;
		const items = menuItemsByMenu.get(menuSlug) || [];
		items.push(post);
		menuItemsByMenu.set(menuSlug, items);
	}
	const menus = [];
	for (const [menuSlug, posts] of menuItemsByMenu) {
		const menuId = menuTermsBySlug.get(menuSlug) || 0;
		const items = posts.map((post) => {
			const meta = post.meta;
			const menuItemTypeRaw = meta.get("_menu_item_type") || "custom";
			const menuItemType = menuItemTypeRaw === "post_type" || menuItemTypeRaw === "taxonomy" ? menuItemTypeRaw : "custom";
			const objectType = meta.get("_menu_item_object");
			const objectIdStr = meta.get("_menu_item_object_id");
			const url = meta.get("_menu_item_url");
			const parentIdStr = meta.get("_menu_item_menu_item_parent");
			const target = meta.get("_menu_item_target");
			const classesStr = meta.get("_menu_item_classes");
			let classes;
			if (classesStr) {
				const matches = classesStr.match(PHP_SERIALIZED_STRING_PATTERN);
				if (matches) classes = matches.map((m) => m.match(PHP_SERIALIZED_STRING_MATCH_PATTERN)?.[1]).filter(Boolean).join(" ");
			}
			return {
				id: post.id || 0,
				menuId,
				parentId: parentIdStr ? parseInt(parentIdStr, 10) || void 0 : void 0,
				sortOrder: post.menuOrder || 0,
				type: menuItemType,
				objectType: objectType || void 0,
				objectId: objectIdStr ? parseInt(objectIdStr, 10) : void 0,
				url: url || void 0,
				title: post.title || "",
				target: target || void 0,
				classes: classes || void 0
			};
		});
		items.sort((a, b) => a.sortOrder - b.sortOrder);
		menus.push({
			id: menuId,
			name: menuSlug,
			label: menuSlug,
			items
		});
	}
	return menus;
}
/** Registered import sources */
var sources = /* @__PURE__ */ new Map();
/**
* Register an import source
*/
function registerSource(source) {
	sources.set(source.id, source);
}
/**
* WXR (WordPress eXtended RSS) import source
*
* Handles WordPress export file uploads (.xml).
* This wraps the existing WXR parsing and analysis logic.
*/
var wxrSource = {
	id: "wxr",
	name: "WordPress Export File",
	description: "Upload a WordPress export file (.xml)",
	icon: "upload",
	requiresFile: true,
	canProbe: false,
	async analyze(input, context) {
		if (input.type !== "file") throw new Error("WXR source requires a file input");
		return analyzeWxrData(await parseWxrString(await input.file.text()), context.getExistingCollections ? await context.getExistingCollections() : /* @__PURE__ */ new Map());
	},
	async *fetchContent(input, options) {
		if (input.type !== "file") throw new Error("WXR source requires a file input");
		const wxr = await parseWxrString(await input.file.text());
		const attachmentMap = buildAttachmentMap(wxr.attachments);
		let count = 0;
		for (const post of wxr.posts) {
			const postType = post.postType || "post";
			if (!options.postTypes.includes(postType)) continue;
			if (isInternalPostType(postType)) continue;
			if (!options.includeDrafts && post.status !== "publish") continue;
			yield wxrPostToNormalizedItem(post, attachmentMap, wxr.site.link || "");
			count++;
			if (options.limit && count >= options.limit) break;
		}
	}
};
/**
* Analyze WXR data and return normalized ImportAnalysis
*/
function analyzeWxrData(wxr, existingCollections) {
	const postTypeCounts = /* @__PURE__ */ new Map();
	const postTypesWithThumbnails = /* @__PURE__ */ new Set();
	const metaKeys = /* @__PURE__ */ new Map();
	const authorPostCounts = /* @__PURE__ */ new Map();
	for (const post of wxr.posts) {
		const type = post.postType || "post";
		postTypeCounts.set(type, (postTypeCounts.get(type) || 0) + 1);
		if (post.creator) authorPostCounts.set(post.creator, (authorPostCounts.get(post.creator) || 0) + 1);
		if (post.meta.has("_thumbnail_id")) postTypesWithThumbnails.add(type);
		for (const [key, value] of post.meta) {
			const existing = metaKeys.get(key);
			if (existing) {
				existing.count++;
				if (existing.samples.length < 3 && value) existing.samples.push(value.slice(0, 100));
			} else metaKeys.set(key, {
				count: 1,
				samples: value ? [value.slice(0, 100)] : [],
				isInternal: isInternalMetaKey(key)
			});
		}
	}
	const customFields = [...metaKeys.entries()].filter(([_, info]) => !info.isInternal).map(([key, info]) => ({
		key,
		count: info.count,
		samples: info.samples,
		suggestedField: mapMetaKeyToField(key),
		suggestedType: inferMetaType(key, info.samples[0]),
		isInternal: info.isInternal
	})).toSorted((a, b) => b.count - a.count);
	const postTypes = [...postTypeCounts.entries()].filter(([type]) => !isInternalPostType(type)).map(([name, count]) => {
		const suggestedCollection = mapPostTypeToCollection(name);
		const existingCollection = existingCollections.get(suggestedCollection);
		const requiredFields = [...BASE_REQUIRED_FIELDS];
		if (postTypesWithThumbnails.has(name)) requiredFields.push(FEATURED_IMAGE_FIELD);
		return {
			name,
			count,
			suggestedCollection,
			requiredFields,
			schemaStatus: checkSchemaCompatibility(requiredFields, existingCollection)
		};
	}).toSorted((a, b) => b.count - a.count);
	const attachmentItems = wxr.attachments.map((att) => {
		const filename = att.url ? getFilenameFromUrl(att.url) : void 0;
		const mimeType = filename ? guessMimeType(filename) : void 0;
		return {
			id: att.id,
			title: att.title,
			url: att.url,
			filename,
			mimeType
		};
	});
	const navMenus = wxr.navMenus.map((menu) => ({
		name: menu.name,
		label: menu.label,
		itemCount: menu.items.length
	}));
	const taxonomyMap = /* @__PURE__ */ new Map();
	for (const term of wxr.terms) {
		if (term.taxonomy === "category" || term.taxonomy === "post_tag" || term.taxonomy === "nav_menu") continue;
		const existing = taxonomyMap.get(term.taxonomy);
		if (existing) {
			existing.count++;
			if (existing.samples.length < 3) existing.samples.push(term.name);
		} else taxonomyMap.set(term.taxonomy, {
			count: 1,
			samples: [term.name]
		});
	}
	const customTaxonomies = Array.from(taxonomyMap.entries(), ([slug, info]) => ({
		slug,
		termCount: info.count,
		sampleTerms: info.samples
	})).toSorted((a, b) => b.termCount - a.termCount);
	const reusableBlocks = wxr.posts.filter((post) => post.postType === "wp_block").map((post) => ({
		id: post.id || 0,
		title: post.title || "Untitled Block",
		slug: post.postName || slugify(post.title || `block-${post.id || Date.now()}`)
	}));
	return {
		sourceId: "wxr",
		site: {
			title: wxr.site.title || "WordPress Site",
			url: wxr.site.link || ""
		},
		postTypes,
		attachments: {
			count: wxr.attachments.length,
			items: attachmentItems
		},
		categories: wxr.categories.length,
		tags: wxr.tags.length,
		authors: wxr.authors.map((a) => ({
			id: a.id,
			login: a.login,
			email: a.email,
			displayName: a.displayName || a.login || "Unknown",
			postCount: a.login ? authorPostCounts.get(a.login) || 0 : 0
		})),
		navMenus: navMenus.length > 0 ? navMenus : void 0,
		customTaxonomies: customTaxonomies.length > 0 ? customTaxonomies : void 0,
		reusableBlocks: reusableBlocks.length > 0 ? reusableBlocks : void 0,
		customFields
	};
}
/**
* Convert a WXR post to a normalized item
*/
function wxrPostToNormalizedItem(post, attachmentMap, siteUrl) {
	const content = post.content ? gutenbergToPortableText(post.content) : [];
	if (siteUrl) relativizeContentLinks(content, siteUrl);
	const thumbnailId = post.meta.get("_thumbnail_id");
	const featuredImage = thumbnailId ? attachmentMap.get(String(thumbnailId)) : void 0;
	let customTaxonomies;
	if (post.customTaxonomies && post.customTaxonomies.size > 0) {
		const filtered = Object.fromEntries([...post.customTaxonomies].filter(([taxonomy]) => taxonomy !== "language"));
		if (Object.keys(filtered).length > 0) customTaxonomies = filtered;
	}
	return {
		sourceId: post.id || 0,
		postType: post.postType || "post",
		status: mapWpStatus(post.status),
		slug: post.postName || slugify(post.title || `post-${post.id || Date.now()}`),
		title: post.title || "Untitled",
		content,
		excerpt: post.excerpt,
		date: parseWxrDate(post.postDateGmt, post.pubDate, post.postDate) ?? /* @__PURE__ */ new Date(),
		modified: parseWxrDate(post.postModifiedGmt, void 0, post.postModified),
		author: post.creator,
		categories: post.categories,
		tags: post.tags,
		meta: Object.fromEntries(post.meta),
		featuredImage,
		parentId: post.postParent && post.postParent !== 0 ? post.postParent : void 0,
		menuOrder: post.menuOrder,
		customTaxonomies,
		locale: post.locale,
		translationGroup: post.translationGroup
	};
}
/**
* WordPress uses "0000-00-00 00:00:00" as a sentinel for missing GMT dates
* (e.g. unpublished drafts). This must be treated as absent.
*/
var WXR_ZERO_DATE = "0000-00-00 00:00:00";
/**
* Parse a WXR date with the correct fallback chain:
* 1. GMT date (always UTC, most reliable)
* 2. pubDate (RFC 2822, includes timezone offset)
* 3. Site-local date (MySQL datetime without timezone, imprecise but best available)
*
* Returns undefined when none of the inputs yield a valid date.
* Callers that need a guaranteed Date should use `?? new Date()`.
*/
function parseWxrDate(gmtDate, pubDate, localDate) {
	if (gmtDate && gmtDate !== WXR_ZERO_DATE) return /* @__PURE__ */ new Date(gmtDate.replace(" ", "T") + "Z");
	if (pubDate) {
		const d = new Date(pubDate);
		if (!isNaN(d.getTime())) return d;
	}
	if (localDate) {
		const d = new Date(localDate.replace(" ", "T"));
		if (!isNaN(d.getTime())) return d;
	}
}
/**
* WordPress REST API probe
*
* Probes self-hosted WordPress sites to detect capabilities.
* This source is probe-only - it tells users what's available
* and suggests next steps (usually: upload WXR file).
*/
var TRAILING_SLASHES = /\/+$/;
var WP_JSON_SUFFIX = /\/wp-json\/?$/;
var wordpressRestSource = {
	id: "wordpress-rest",
	name: "WordPress Site",
	description: "Connect to a self-hosted WordPress site",
	icon: "globe",
	requiresFile: false,
	canProbe: true,
	async probe(url) {
		try {
			const siteUrl = normalizeUrl(url);
			validateExternalUrl(siteUrl);
			const response = await ssrfSafeFetch(`${siteUrl}/wp-json/`, {
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(1e4)
			});
			if (!response.ok) {
				if (!(await ssrfSafeFetch(`${siteUrl}/?rest_route=/`, {
					headers: { Accept: "application/json" },
					signal: AbortSignal.timeout(1e4)
				})).ok) return null;
			}
			const data = await response.json();
			if (!data.namespaces?.includes("wp/v2")) return null;
			const preview = await getPublicContentCounts(siteUrl);
			const hasAppPasswords = !!data.authentication?.["application-passwords"];
			return {
				sourceId: "wordpress-rest",
				confidence: "definite",
				detected: {
					platform: "wordpress",
					siteTitle: data.name,
					siteUrl: data.url || data.home || siteUrl
				},
				capabilities: {
					publicContent: true,
					privateContent: false,
					customPostTypes: false,
					allMeta: false,
					mediaStream: true
				},
				auth: hasAppPasswords ? {
					type: "password",
					instructions: "To import drafts and private content, create an Application Password in WordPress → Users → Your Profile → Application Passwords"
				} : void 0,
				preview,
				suggestedAction: {
					type: "upload",
					instructions: "For a complete import including drafts, custom post types, and all metadata, export your content from WordPress (Tools → Export) and upload the file here."
				}
			};
		} catch {
			return null;
		}
	},
	async analyze(_input, _context) {
		throw new Error("Direct REST API import not implemented. Please upload a WXR export file.");
	},
	async *fetchContent(_input, _options) {
		throw new Error("Direct REST API import not implemented. Please upload a WXR export file.");
	}
};
/**
* Normalize a URL for API requests
*/
function normalizeUrl(url) {
	let normalized = url.trim();
	if (!normalized.startsWith("http")) normalized = `https://${normalized}`;
	normalized = normalized.replace(TRAILING_SLASHES, "");
	normalized = normalized.replace(WP_JSON_SUFFIX, "");
	return normalized;
}
/**
* Get public content counts from REST API
*/
async function getPublicContentCounts(siteUrl) {
	const result = {};
	try {
		const [postsRes, pagesRes, mediaRes] = await Promise.allSettled([
			ssrfSafeFetch(`${siteUrl}/wp-json/wp/v2/posts?per_page=1`, { signal: AbortSignal.timeout(5e3) }),
			ssrfSafeFetch(`${siteUrl}/wp-json/wp/v2/pages?per_page=1`, { signal: AbortSignal.timeout(5e3) }),
			ssrfSafeFetch(`${siteUrl}/wp-json/wp/v2/media?per_page=1`, { signal: AbortSignal.timeout(5e3) })
		]);
		if (postsRes.status === "fulfilled" && postsRes.value.ok) {
			const total = postsRes.value.headers.get("X-WP-Total");
			if (total) result.posts = parseInt(total, 10);
		}
		if (pagesRes.status === "fulfilled" && pagesRes.value.ok) {
			const total = pagesRes.value.headers.get("X-WP-Total");
			if (total) result.pages = parseInt(total, 10);
		}
		if (mediaRes.status === "fulfilled" && mediaRes.value.ok) {
			const total = mediaRes.value.headers.get("X-WP-Total");
			if (total) result.media = parseInt(total, 10);
		}
	} catch {}
	return result;
}
/**
* WordPress Plugin (EmDash Exporter) import source
*
* Connects to self-hosted WordPress sites running the EmDash Exporter plugin.
* Provides full access to all content including drafts, custom post types, and ACF fields.
*/
/**
* Build the REST API URL for a plugin endpoint.
*
* `restRoute: false` uses the pretty form (`/wp-json/emdash/v1/...`),
* `restRoute: true` uses the `?rest_route=` form that works on sites with
* plain permalinks (where `/wp-json/` doesn't exist).
*/
function pluginApiUrl(siteUrl, path, params = {}, restRoute = false) {
	if (restRoute) {
		const url = new URL(siteUrl + "/");
		url.searchParams.set("rest_route", `/emdash/v1/${path}`);
		for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
		return url.toString();
	}
	const url = new URL(`${siteUrl}/wp-json/emdash/v1/${path}`);
	for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
	return url.toString();
}
/**
* Fetch a plugin API endpoint, falling back to the `?rest_route=` form when
* the pretty `/wp-json/` route 404s or is unreachable. Sites with "Plain"
* permalinks have no `/wp-json/` rewrite, so without this fallback they
* always fail with a misleading 404.
*/
async function fetchPluginApi(siteUrl, path, params, headers, timeoutMs) {
	let pretty = null;
	try {
		pretty = await ssrfSafeFetch(pluginApiUrl(siteUrl, path, params), {
			headers,
			signal: AbortSignal.timeout(timeoutMs)
		});
	} catch {}
	if (pretty && pretty.status !== 404) return pretty;
	return ssrfSafeFetch(pluginApiUrl(siteUrl, path, params, true), {
		headers,
		signal: AbortSignal.timeout(timeoutMs)
	});
}
var wordpressPluginSource = {
	id: "wordpress-plugin",
	name: "WordPress (EmDash Exporter)",
	description: "Import from WordPress sites with the EmDash Exporter plugin installed",
	icon: "plug",
	requiresFile: false,
	canProbe: true,
	async probe(url) {
		try {
			const siteUrl = normalizeUrl$1(url);
			validateExternalUrl(siteUrl);
			const response = await fetchPluginApi(siteUrl, "probe", {}, { Accept: "application/json" }, 1e4);
			if (!response.ok) return null;
			const data = await response.json();
			if (!data.emdash_exporter) return null;
			return {
				sourceId: "wordpress-plugin",
				confidence: "definite",
				detected: {
					platform: "wordpress",
					version: data.wordpress_version,
					siteTitle: data.site.title,
					siteUrl: data.site.url
				},
				capabilities: {
					publicContent: true,
					privateContent: true,
					customPostTypes: true,
					allMeta: true,
					mediaStream: true
				},
				auth: data.capabilities.application_passwords ? {
					type: "password",
					instructions: data.auth_instructions.instructions
				} : void 0,
				preview: {
					posts: data.post_types.find((p) => p.name === "post")?.count,
					pages: data.post_types.find((p) => p.name === "page")?.count,
					media: data.media_count
				},
				suggestedAction: { type: "proceed" },
				i18n: pluginI18nToDetection(data.i18n)
			};
		} catch {
			return null;
		}
	},
	async analyze(input, context) {
		const { siteUrl, headers } = getRequestConfig(input);
		const response = await fetchPluginApi(siteUrl, "analyze", {}, headers, 3e4);
		if (!response.ok) {
			const body = await response.json().catch(() => void 0);
			const message = typeof body === "object" && body !== null && "message" in body && typeof body.message === "string" ? body.message : "";
			throw new Error(message || `Failed to analyze site: ${response.statusText}`);
		}
		const data = await response.json();
		const existingCollections = context.getExistingCollections ? await context.getExistingCollections() : /* @__PURE__ */ new Map();
		const postTypes = data.post_types.filter((pt) => pt.total > 0).map((pt) => {
			const suggestedCollection = mapPostTypeToCollection(pt.name);
			const existingCollection = existingCollections.get(suggestedCollection);
			const requiredFields = pt.supports && "thumbnail" in pt.supports ? [...BASE_REQUIRED_FIELDS, FEATURED_IMAGE_FIELD] : [...BASE_REQUIRED_FIELDS];
			const knownSlugs = new Set(requiredFields.map((f) => f.slug));
			for (const customField of pt.custom_fields ?? []) {
				if (isPluginBookkeepingMeta(customField.key)) continue;
				const slug = sanitizeFieldSlug(customField.key);
				if (knownSlugs.has(slug)) continue;
				knownSlugs.add(slug);
				requiredFields.push({
					slug,
					label: fieldLabelFromKey(customField.key),
					type: mapInferredFieldType(customField.inferred_type),
					required: false
				});
			}
			return {
				name: pt.name,
				count: pt.total,
				suggestedCollection,
				requiredFields,
				schemaStatus: checkSchemaCompatibility(requiredFields, existingCollection)
			};
		});
		const attachments = [];
		if (data.attachments.count > 0) try {
			let page = 1;
			let totalPages = 1;
			while (page <= totalPages) {
				const mediaResponse = await fetchPluginApi(siteUrl, "media", {
					per_page: "500",
					page: String(page)
				}, headers, 3e4);
				if (!mediaResponse.ok) break;
				const mediaData = await mediaResponse.json();
				totalPages = mediaData.pages;
				for (const item of mediaData.items) attachments.push({
					id: item.id,
					url: item.url,
					filename: item.filename,
					mimeType: item.mime_type,
					title: item.title,
					alt: item.alt,
					caption: item.caption,
					width: item.width,
					height: item.height
				});
				page++;
			}
		} catch (e) {
			console.warn("Failed to fetch media list:", e);
		}
		const categoryTaxonomy = data.taxonomies.find((t) => t.name === "category");
		const tagTaxonomy = data.taxonomies.find((t) => t.name === "post_tag");
		return {
			sourceId: "wordpress-plugin",
			site: {
				title: data.site.title,
				url: data.site.url
			},
			postTypes,
			attachments: {
				count: data.attachments.count,
				items: attachments
			},
			categories: categoryTaxonomy?.term_count ?? 0,
			tags: tagTaxonomy?.term_count ?? 0,
			authors: data.authors.map((a) => ({
				id: a.id,
				login: a.login,
				email: a.email,
				displayName: a.display_name,
				postCount: a.post_count
			})),
			i18n: pluginI18nToDetection(data.i18n)
		};
	},
	async *fetchContent(input, options) {
		const { siteUrl, headers } = getRequestConfig(input);
		for (const postType of options.postTypes) {
			let page = 1;
			let totalPages = 1;
			let yielded = 0;
			while (page <= totalPages) {
				const response = await fetchPluginApi(siteUrl, "content", {
					post_type: postType,
					status: options.includeDrafts ? "any" : "publish",
					per_page: "100",
					page: String(page)
				}, headers, 6e4);
				if (!response.ok) throw new Error(`Failed to fetch ${postType}: ${response.statusText}`);
				const data = await response.json();
				totalPages = data.pages;
				for (const post of data.items) {
					yield pluginPostToNormalizedItem(post, siteUrl);
					yielded++;
					if (options.limit && yielded >= options.limit) return;
				}
				page++;
			}
		}
	},
	async fetchMedia(url, _input) {
		validateExternalUrl(url);
		const response = await ssrfSafeFetch(url);
		if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);
		return response.blob();
	}
};
/** Plugin `inferred_type` values that are valid EmDash field types as-is */
var VALID_INFERRED_TYPES = /* @__PURE__ */ new Set([
	"string",
	"text",
	"number",
	"integer",
	"boolean",
	"datetime",
	"json",
	"reference"
]);
/**
* Map the plugin's inferred custom-field type to an EmDash field type.
* Unknown values fall back to string (always safe for TEXT storage).
*/
function mapInferredFieldType(inferredType) {
	return VALID_INFERRED_TYPES.has(inferredType) ? inferredType : "string";
}
var FIELD_KEY_SEPARATORS = /[_-]+/;
/** Derive a human label from a meta key: "event_start-date" -> "Event Start Date" */
function fieldLabelFromKey(key) {
	return key.split(FIELD_KEY_SEPARATORS).filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
/**
* Convert plugin i18n info to the shared I18nDetection type.
* Returns undefined when no multilingual plugin is detected.
*/
function pluginI18nToDetection(i18n) {
	if (!i18n) return void 0;
	return {
		plugin: i18n.plugin,
		defaultLocale: i18n.default_locale,
		locales: i18n.locales
	};
}
/**
* Get request configuration from input
*/
function getRequestConfig(input) {
	if (input.type === "url") {
		const siteUrl = normalizeUrl$1(input.url);
		validateExternalUrl(siteUrl);
		const headers = { Accept: "application/json" };
		if (input.token) headers["Authorization"] = `Basic ${input.token}`;
		return {
			siteUrl,
			headers
		};
	}
	if (input.type === "oauth") {
		const oauthSiteUrl = normalizeUrl$1(input.url);
		validateExternalUrl(oauthSiteUrl);
		return {
			siteUrl: oauthSiteUrl,
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${input.accessToken}`
			}
		};
	}
	throw new Error("WordPress plugin source requires URL or OAuth input");
}
/**
* Convert plugin post to normalized item
*/
function pluginPostToNormalizedItem(post, siteUrl) {
	const content = post.content ? gutenbergToPortableText(post.content) : [];
	relativizeContentLinks(content, siteUrl);
	const categories = post.taxonomies?.category?.map((c) => c.slug) ?? post.taxonomies?.categories?.map((c) => c.slug) ?? [];
	const tags = post.taxonomies?.post_tag?.map((t) => t.slug) ?? post.taxonomies?.tags?.map((t) => t.slug) ?? [];
	const customTaxonomies = {};
	for (const [name, terms] of Object.entries(post.taxonomies ?? {})) {
		if ([
			"category",
			"categories",
			"post_tag",
			"tags"
		].includes(name)) continue;
		if (Array.isArray(terms) && terms.length > 0) customTaxonomies[name] = terms.map((t) => t.slug);
	}
	const meta = { ...post.meta };
	if (post.acf) meta._acf = post.acf;
	if (post.yoast) meta._yoast = post.yoast;
	if (post.rankmath) meta._rankmath = post.rankmath;
	return {
		sourceId: post.id,
		postType: post.post_type,
		status: mapWpStatus(post.status),
		slug: post.slug,
		title: post.title,
		content,
		excerpt: post.excerpt || void 0,
		date: new Date(post.date_gmt || post.date),
		modified: post.modified_gmt ? new Date(post.modified_gmt) : new Date(post.modified),
		author: post.author?.login,
		categories,
		tags,
		customTaxonomies: Object.keys(customTaxonomies).length > 0 ? customTaxonomies : void 0,
		meta,
		featuredImage: post.featured_image?.url,
		locale: post.locale,
		translationGroup: post.translation_group
	};
}
registerSource(wordpressPluginSource);
registerSource(wordpressRestSource);
registerSource(wxrSource);
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/email-console-C-9Ng8DM.mjs
/**
* In-memory store for dev emails.
* Uses globalThis so the same array is shared across Vite SSR module
* instances (the runtime and the route handler may load separate copies
* of this module, but globalThis is always the same object).
*/
var GLOBAL_KEY = Symbol.for("emdash:dev-emails");
var g = globalThis;
(() => {
	const existing = g[GLOBAL_KEY];
	if (existing) return existing;
	const fresh = [];
	g[GLOBAL_KEY] = fresh;
	return fresh;
})();
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/tokens-DVltpO2D.mjs
async function verifySignature(data, signature, secret) {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["verify"]);
	const sigBuffer = new ArrayBuffer(signature.byteLength);
	new Uint8Array(sigBuffer).set(signature);
	return crypto.subtle.verify("HMAC", key, sigBuffer, encoder.encode(data));
}
async function verifyPreviewToken(options) {
	const { secret } = options;
	if (!secret) throw new Error("Preview secret is required");
	const token = "url" in options ? options.url.searchParams.get("_preview") : options.token;
	if (!token) return {
		valid: false,
		error: "none"
	};
	const parts = token.split(".");
	if (parts.length !== 2) return {
		valid: false,
		error: "malformed"
	};
	const [encodedPayload, encodedSignature] = parts;
	let signature;
	try {
		signature = decodeBase64url(encodedSignature);
	} catch {
		return {
			valid: false,
			error: "malformed"
		};
	}
	if (!await verifySignature(encodedPayload, signature, secret)) return {
		valid: false,
		error: "invalid"
	};
	let payload;
	try {
		const payloadBytes = decodeBase64url(encodedPayload);
		const payloadJson = new TextDecoder().decode(payloadBytes);
		payload = JSON.parse(payloadJson);
	} catch {
		return {
			valid: false,
			error: "malformed"
		};
	}
	if (typeof payload.cid !== "string" || typeof payload.exp !== "number" || typeof payload.iat !== "number") return {
		valid: false,
		error: "malformed"
	};
	const now = Math.floor(Date.now() / 1e3);
	if (payload.exp < now) return {
		valid: false,
		error: "expired"
	};
	return {
		valid: true,
		payload
	};
}
function parseContentId(contentId) {
	const colonIndex = contentId.indexOf(":");
	if (colonIndex === -1) throw new Error("Content ID must be in format \"collection:id\"");
	return {
		collection: contentId.slice(0, colonIndex),
		id: contentId.slice(colonIndex + 1)
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/widgets-L-VndTKD.mjs
/**
* Get all widget areas with their widgets
*/
async function getWidgetAreas() {
	const db = await getDb();
	const areaRows = await db.selectFrom("_emdash_widget_areas").selectAll().execute();
	const widgetRows = await db.selectFrom("_emdash_widgets").selectAll().$castTo().orderBy("sort_order", "asc").execute();
	const widgetsByArea = /* @__PURE__ */ new Map();
	for (const row of widgetRows) {
		if (!widgetsByArea.has(row.area_id)) widgetsByArea.set(row.area_id, []);
		widgetsByArea.get(row.area_id).push(rowToWidget(row));
	}
	return areaRows.map((areaRow) => ({
		id: areaRow.id,
		name: areaRow.name,
		label: areaRow.label,
		description: areaRow.description ?? void 0,
		widgets: widgetsByArea.get(areaRow.id) || []
	}));
}
/**
* Convert a widget row to the API type
*/
function rowToWidget(row) {
	const widget = {
		id: row.id,
		type: row.type,
		title: row.title ?? void 0
	};
	if (row.type === "content" && row.content) try {
		widget.content = JSON.parse(row.content);
	} catch {}
	if (row.type === "menu" && row.menu_name) widget.menuName = row.menu_name;
	if (row.type === "component" && row.component_id) {
		widget.componentId = row.component_id;
		if (row.component_props) try {
			widget.componentProps = JSON.parse(row.component_props);
		} catch {}
	}
	return widget;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/version-BGLOkzgk.mjs
var VERSION = "0.31.1";
var COMMIT = "974cb76";
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/mode-fiXRMfeA.mjs
/**
* Determine the active auth mode from config.
*
* Accepts `EmDashConfig` (or subtype) — checks for `auth` field via duck typing.
*
* @param config EmDash configuration
* @returns The active auth mode
*/
function getAuthMode(config) {
	const auth = config?.auth;
	if (auth && "entrypoint" in auth && auth.entrypoint) return {
		type: "external",
		providerType: auth.type,
		entrypoint: auth.entrypoint,
		config: auth.config
	};
	return { type: "passkey" };
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/snapshot-BdpUJKD-.mjs
var MEDIA_FILE_PREFIX = "/_emdash/api/media/file/";
/**
* Parse a JSON string value and inject `src` for local media objects.
* Returns the original string if it's not a local media value.
*/
function injectMediaSrc(jsonStr, origin) {
	try {
		const obj = JSON.parse(jsonStr);
		if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return jsonStr;
		if (injectMediaSrcInto(obj, origin)) return JSON.stringify(obj);
		return jsonStr;
	} catch {
		return jsonStr;
	}
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Recursively walk an object and inject `src` into local media values.
* Returns true if any modifications were made.
*/
function injectMediaSrcInto(obj, origin) {
	let modified = false;
	if ((obj.provider === "local" || !obj.provider && obj.id && obj.meta) && !obj.src) {
		const storageKey = (isRecord(obj.meta) ? obj.meta : void 0)?.storageKey ?? obj.id;
		if (typeof storageKey === "string" && storageKey) {
			obj.src = `${origin}${MEDIA_FILE_PREFIX}${storageKey}`;
			modified = true;
		}
	}
	for (const value of Object.values(obj)) if (Array.isArray(value)) {
		for (const item of value) if (isRecord(item)) {
			if (injectMediaSrcInto(item, origin)) modified = true;
		}
	} else if (isRecord(value)) {
		if (injectMediaSrcInto(value, origin)) modified = true;
	}
	return modified;
}
/**
* Safe identifier pattern for snapshot table names.
* More permissive than validateIdentifier() — allows leading underscores
* (needed for system tables like _emdash_collections).
*/
var SAFE_TABLE_NAME = /^[a-z_][a-z0-9_]*$/;
/**
* System tables included in snapshots.
* Content tables (ec_*) are discovered dynamically.
*/
var SYSTEM_TABLES = [
	"_emdash_collections",
	"_emdash_fields",
	"_emdash_taxonomy_defs",
	"_emdash_menus",
	"_emdash_menu_items",
	"_emdash_sections",
	"_emdash_widget_areas",
	"_emdash_widgets",
	"_emdash_seo",
	"_emdash_migrations",
	"taxonomies",
	"content_taxonomies",
	"media",
	"options",
	"revisions"
];
/**
* Table name prefixes excluded from snapshots (auth/security data).
*/
var EXCLUDED_PREFIXES = [
	"_emdash_api_tokens",
	"_emdash_oauth_tokens",
	"_emdash_authorization_codes",
	"_emdash_device_codes",
	"_emdash_migrations_lock",
	"_plugin_",
	"users",
	"sessions",
	"credentials",
	"challenges"
];
/**
* Options key prefixes safe for inclusion in snapshots.
*
* The options table contains plugin secrets (plugin:*), passkey challenges
* (emdash:passkey_pending:*), and setup state that must not leak to
* preview databases. Only site-level rendering settings are needed.
*/
var SAFE_OPTIONS_PREFIXES = ["site:"];
function isExcluded(tableName) {
	return EXCLUDED_PREFIXES.some((prefix) => tableName.startsWith(prefix));
}
/**
* Generate a portable database snapshot.
*
* Discovers ec_* content tables dynamically, exports system tables
* needed for rendering, and includes schema info for table recreation.
*/
async function generateSnapshot(db, options) {
	const includeDrafts = options?.includeDrafts ?? false;
	const includeTrashed = options?.includeTrashed ?? false;
	const optionPrefixes = options?.optionPrefixes ?? SAFE_OPTIONS_PREFIXES;
	const allTables = [...(await sql`
		SELECT name FROM sqlite_master
		WHERE type = 'table'
		AND name LIKE 'ec_%'
		ORDER BY name
	`.execute(db)).rows.map((r) => r.name), ...SYSTEM_TABLES];
	const tables = {};
	const schema = {};
	for (const tableName of allTables) {
		if (isExcluded(tableName)) continue;
		if (!SAFE_TABLE_NAME.test(tableName)) continue;
		try {
			const pragmaResult = await sql`
				PRAGMA table_info(${sql.raw(`"${tableName}"`)})
			`.execute(db);
			if (pragmaResult.rows.length === 0) continue;
			const columns = pragmaResult.rows.map((r) => r.name);
			const types = {};
			for (const row of pragmaResult.rows) types[row.name] = row.type || "TEXT";
			schema[tableName] = {
				columns,
				types
			};
			let rows;
			if (tableName.startsWith("ec_")) if (includeTrashed) rows = (await sql`
						SELECT * FROM ${sql.raw(`"${tableName}"`)}
					`.execute(db)).rows;
			else if (includeDrafts) rows = (await sql`
						SELECT * FROM ${sql.raw(`"${tableName}"`)}
						WHERE deleted_at IS NULL
					`.execute(db)).rows;
			else rows = (await sql`
						SELECT * FROM ${sql.raw(`"${tableName}"`)}
						WHERE deleted_at IS NULL
						AND (status = 'published' OR (status = 'scheduled' AND scheduled_at <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now')))
					`.execute(db)).rows;
			else if (tableName === "options") rows = (await sql`
					SELECT * FROM ${sql.raw(`"${tableName}"`)}
				`.execute(db)).rows.filter((row) => {
				const name = typeof row.name === "string" ? row.name : "";
				return optionPrefixes.some((prefix) => name.startsWith(prefix));
			});
			else rows = (await sql`
					SELECT * FROM ${sql.raw(`"${tableName}"`)}
				`.execute(db)).rows;
			if (rows.length > 0) tables[tableName] = rows;
		} catch {}
	}
	if (options?.origin) {
		const origin = options.origin;
		for (const [tableName, rows] of Object.entries(tables)) {
			if (!tableName.startsWith("ec_")) continue;
			for (const row of rows) for (const [col, value] of Object.entries(row)) {
				if (typeof value !== "string" || !value.startsWith("{")) continue;
				row[col] = injectMediaSrc(value, origin);
			}
		}
	}
	return {
		tables,
		schema,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/backup-BTjSjBmr.mjs
/** Storage key prefix for scheduled/manual archives. */
var BACKUP_STORAGE_PREFIX = "backups/";
/**
* Filename prefix within the backups/ folder. Included in the list() prefix
* so LocalStorage (which matches directory + filename prefix, not flat keys
* like S3/R2) finds the archives too.
*/
var BACKUP_FILE_PREFIX = "emdash-backup-";
/** Options key holding the scheduled-backup settings. */
var BACKUP_SETTINGS_KEY = "emdash:backups";
/** Options key holding the ISO timestamp of the last scheduled run. */
var BACKUP_LAST_RUN_KEY = "emdash:backups_last_run";
/** Minimum interval between scheduled backups (23h — daily with cron jitter). */
var SCHEDULED_BACKUP_INTERVAL_MS = 828e5;
var BACKUP_RETENTION_DEFAULT = 7;
/**
* Options-table key prefixes included in backups. Site settings plus the
* site-identity keys (`emdash:site_title`, `emdash:site_tagline`,
* `emdash:site_url`). Never widen this to a prefix that can match secrets
* (`emdash:preview_secret`, `plugin:`, `emdash:passkey_pending:`).
*/
var BACKUP_OPTION_PREFIXES = [
	"site:",
	"emdash:site_",
	"emdash:locale"
];
/**
* Archive filename shape. Strict allowlist — the download/delete routes
* interpolate this into a storage key, so it must never contain `/` or `..`.
* The random suffix makes names unguessable (defense in depth on top of the
* media route's backups/ deny) and avoids same-second collisions.
*/
var ARCHIVE_NAME_PATTERN = /^emdash-backup-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-[0-9a-f]{8}\.json$/;
function isValidArchiveName(name) {
	return ARCHIVE_NAME_PATTERN.test(name);
}
var DEFAULT_SETTINGS = {
	enabled: false,
	retention: BACKUP_RETENTION_DEFAULT
};
function clampRetention(value) {
	if (!Number.isFinite(value)) return BACKUP_RETENTION_DEFAULT;
	return Math.min(30, Math.max(1, Math.trunc(value)));
}
/**
* Generate a full content backup as a JSON string.
*
* ponytail: the whole backup is materialized in memory. Fine for the sites
* EmDash targets today; truly huge databases should use `wrangler d1 export`
* (documented on the backups docs page). Upgrade path: stream table-by-table.
*/
async function generateBackupJson(db) {
	const snapshot = await generateSnapshot(db, {
		includeDrafts: true,
		includeTrashed: true,
		optionPrefixes: BACKUP_OPTION_PREFIXES
	});
	return JSON.stringify({
		format: "emdash-backup",
		formatVersion: 1,
		emdashVersion: VERSION,
		generatedAt: snapshot.generatedAt,
		schema: snapshot.schema,
		tables: snapshot.tables
	});
}
/** Derive the archive filename for a given date (plus a random suffix). */
function archiveNameForDate(date) {
	return `emdash-backup-${date.toISOString().slice(0, 19).replaceAll(":", "-")}-${crypto.randomUUID().replaceAll("-", "").slice(0, 8)}.json`;
}
async function getBackupSettings(db) {
	const stored = await new OptionsRepository(db).get(BACKUP_SETTINGS_KEY);
	if (!stored) return { ...DEFAULT_SETTINGS };
	return {
		enabled: stored.enabled === true,
		retention: clampRetention(stored.retention ?? BACKUP_RETENTION_DEFAULT)
	};
}
/**
* List stored archives, newest first.
*
* ponytail: single unpaginated list. The retention cap (max 30) bounds the
* archive count, so one page always suffices.
*/
async function listBackupArchives(storage) {
	try {
		return {
			success: true,
			data: (await storage.list({
				prefix: `${BACKUP_STORAGE_PREFIX}${BACKUP_FILE_PREFIX}`,
				limit: 100
			})).files.map((file) => ({
				name: file.key.slice(8),
				size: file.size,
				lastModified: file.lastModified.toISOString()
			})).filter((archive) => isValidArchiveName(archive.name)).toSorted((a, b) => a.name < b.name ? 1 : -1)
		};
	} catch (error) {
		console.error("[backup] Failed to list archives:", error);
		return {
			success: false,
			error: {
				code: ErrorCode.BACKUP_LIST_ERROR,
				message: "Failed to list backup archives"
			}
		};
	}
}
/**
* Create a backup and store it as an archive, then prune old archives
* beyond `retention`.
*/
async function runBackupToStorage(db, storage, retention) {
	try {
		const json = await generateBackupJson(db);
		const name = archiveNameForDate(/* @__PURE__ */ new Date());
		const body = new TextEncoder().encode(json);
		await storage.upload({
			key: `${BACKUP_STORAGE_PREFIX}${name}`,
			body,
			contentType: "application/json"
		});
		await pruneArchives(storage, clampRetention(retention));
		return {
			success: true,
			data: {
				name,
				size: body.byteLength,
				lastModified: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
	} catch (error) {
		console.error("[backup] Failed to create archive:", error);
		return {
			success: false,
			error: {
				code: ErrorCode.BACKUP_CREATE_ERROR,
				message: "Failed to create backup archive"
			}
		};
	}
}
/** Delete archives beyond the newest `keep`. Failures are logged, not fatal. */
async function pruneArchives(storage, keep) {
	const listed = await listBackupArchives(storage);
	if (!listed.success) return;
	for (const archive of listed.data.slice(keep)) try {
		await storage.delete(`${BACKUP_STORAGE_PREFIX}${archive.name}`);
	} catch (error) {
		console.error(`[backup] Failed to prune archive ${archive.name}:`, error);
	}
}
/**
* Run a scheduled backup if enabled and due. Called from the maintenance
* tick alongside scheduled publishing and system cleanup — never from a
* request. Never throws.
*
* ponytail: last-run bookkeeping is a plain read-then-write, so two isolates
* ticking simultaneously could both back up. Worst case is a duplicate
* archive that retention prunes; not worth a lock.
*/
async function maybeRunScheduledBackup(db, storage) {
	try {
		if (!storage) return;
		const settings = await getBackupSettings(db);
		if (!settings.enabled) return;
		const options = new OptionsRepository(db);
		const lastRun = await options.get(BACKUP_LAST_RUN_KEY);
		if (lastRun) {
			const elapsed = Date.now() - Date.parse(lastRun);
			if (Number.isFinite(elapsed) && elapsed < SCHEDULED_BACKUP_INTERVAL_MS) return;
		}
		const result = await runBackupToStorage(db, storage, settings.retention);
		if (result.success) {
			await options.set(BACKUP_LAST_RUN_KEY, (/* @__PURE__ */ new Date()).toISOString());
			console.log(`[backup] Scheduled backup stored: ${result.data.name}`);
		}
	} catch (error) {
		console.error("[backup] Scheduled backup failed:", error);
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/challenge-store-BFzgFRog.mjs
/**
* Clean up expired challenges.
* Should be called periodically (e.g., on startup, or via cron).
*/
async function cleanupExpiredChallenges(db) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const result = await db.deleteFrom("auth_challenges").where("expires_at", "<", now).executeTakeFirst();
	return Number(result.numDeletedRows ?? 0);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/upload-attempts-C5yd6Gae.mjs
async function removeUploadAttempt(storage, repo, storageKey, options = {}) {
	try {
		if (!await repo.claimUploadAttemptForCleanup(storageKey)) {
			if (await repo.hasUploadAttempt(storageKey) || !options.allowUntracked) return false;
		}
	} catch (error) {
		console.error("[media] upload cleanup claim failed:", error);
		return false;
	}
	try {
		await storage.delete(storageKey);
	} catch (error) {
		console.error("[media] upload cleanup failed:", error);
		return false;
	}
	try {
		await repo.deleteUploadAttempt(storageKey);
	} catch (error) {
		console.error("[media] upload cleanup record deletion failed:", error);
	}
	return true;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/secrets-870d-7yA.mjs
var ENCRYPTION_KEY_PREFIX = "emdash_enc_v1_";
var ENCRYPTION_KEY_BODY_LENGTH = 43;
var ENCRYPTION_KEY_PATTERN = new RegExp(`^${ENCRYPTION_KEY_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[A-Za-z0-9_-]{${ENCRYPTION_KEY_BODY_LENGTH}}$`);
var IP_SALT_OPTION_KEY = "emdash:ip_salt";
var PREVIEW_SECRET_OPTION_KEY = "emdash:preview_secret";
var GENERATED_SECRET_BYTES = 32;
var EmDashSecretsError = class extends Error {
	name = "EmDashSecretsError";
	code;
	constructor(message, code) {
		super(message);
		this.code = code;
	}
};
async function parseEncryptionKeys(raw) {
	if (!raw) return null;
	const entries = raw.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
	if (entries.length === 0) return null;
	const parsed = [];
	const seenKids = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		if (!ENCRYPTION_KEY_PATTERN.test(entry)) throw new EmDashSecretsError(`EMDASH_ENCRYPTION_KEY entry is malformed (expected "${ENCRYPTION_KEY_PREFIX}" followed by ${ENCRYPTION_KEY_BODY_LENGTH} base64url chars). Generate one with \`emdash secrets generate\`.`, "INVALID_ENCRYPTION_KEY");
		const body = entry.slice(14);
		const key = decodeBase64urlStrict(body);
		if (!key) throw new EmDashSecretsError("EMDASH_ENCRYPTION_KEY body is not valid base64url", "INVALID_ENCRYPTION_KEY");
		if (key.length !== GENERATED_SECRET_BYTES) throw new EmDashSecretsError(`EMDASH_ENCRYPTION_KEY must decode to ${GENERATED_SECRET_BYTES} bytes, got ${key.length}`, "INVALID_ENCRYPTION_KEY");
		if (encodeBase64url(key) !== body) throw new EmDashSecretsError("EMDASH_ENCRYPTION_KEY body is not canonical base64url. Generate one with `emdash secrets generate`.", "INVALID_ENCRYPTION_KEY");
		const kid = fingerprintKeyBytes(key);
		if (seenKids.has(kid)) continue;
		seenKids.add(kid);
		parsed.push({
			kid,
			key,
			raw: entry
		});
	}
	return parsed;
}
function fingerprintKeyBytes(key) {
	return encodeHexLowerCase(sha256(key)).slice(0, 8);
}
async function resolveSecrets(options) {
	const env = options.env ?? readDefaultEnv();
	const repo = options._repo ?? new OptionsRepository(options.db);
	const previewEnvOverride = pickFirstNonEmpty(env.EMDASH_PREVIEW_SECRET, env.PREVIEW_SECRET);
	const ipSaltEnvOverride = pickFirstNonEmpty(env.EMDASH_IP_SALT, env.EMDASH_AUTH_SECRET, env.AUTH_SECRET);
	const [previewSecret, ipSalt] = await Promise.all([previewEnvOverride !== null ? Promise.resolve({
		value: previewEnvOverride,
		source: "env"
	}) : ensureGeneratedOption(repo, PREVIEW_SECRET_OPTION_KEY), ipSaltEnvOverride !== null ? Promise.resolve({
		value: ipSaltEnvOverride,
		source: "env"
	}) : ensureGeneratedOption(repo, IP_SALT_OPTION_KEY)]);
	return {
		previewSecret: previewSecret.value,
		previewSecretSource: previewSecret.source,
		ipSalt: ipSalt.value,
		ipSaltSource: ipSalt.source
	};
}
async function validateEncryptionKeyAtStartup(env) {
	const resolved = env ?? readDefaultEnv();
	try {
		await parseEncryptionKeys(resolved.EMDASH_ENCRYPTION_KEY);
		return true;
	} catch (error) {
		if (error instanceof EmDashSecretsError) {
			console.error(`[emdash] EMDASH_ENCRYPTION_KEY is invalid: ${error.message} Plugin-secret encryption will fail once it ships. Generate a fresh key with \`emdash secrets generate\`.`);
			return false;
		}
		throw error;
	}
}
var SECRETS_CACHE_KEY = /* @__PURE__ */ Symbol.for("@emdash-cms/core/secrets-cache@2");
function getSecretsCache() {
	const holder = globalThis;
	let entry = holder[SECRETS_CACHE_KEY];
	if (!entry) {
		entry = { cache: /* @__PURE__ */ new WeakMap() };
		holder[SECRETS_CACHE_KEY] = entry;
	}
	return entry.cache;
}
function resolveSecretsCached(db) {
	const caches = getSecretsCache();
	let cache = caches.get(db);
	if (!cache) {
		cache = createSingleFlightCache();
		caches.set(db, cache);
	}
	return singleFlightCached(cache, () => resolveSecrets({ db }), {
		anchor: (promise) => after(() => promise),
		ownerTimeoutMs: 3e4
	});
}
async function ensureGeneratedOption(repo, optionKey) {
	const existing = await repo.get(optionKey);
	if (typeof existing === "string" && existing.length > 0) return {
		value: existing,
		source: "db"
	};
	const generated = generateRandomSecret();
	if (await repo.setIfAbsent(optionKey, generated)) return {
		value: generated,
		source: "db"
	};
	const winner = await repo.get(optionKey);
	if (typeof winner !== "string" || winner.length === 0) throw new EmDashSecretsError(`Failed to persist generated secret for "${optionKey}"`, "SECRET_PERSIST_FAILED");
	return {
		value: winner,
		source: "db"
	};
}
function generateRandomSecret() {
	const bytes = new Uint8Array(GENERATED_SECRET_BYTES);
	crypto.getRandomValues(bytes);
	return encodeBase64url(bytes);
}
function pickFirstNonEmpty(...values) {
	for (const value of values) if (typeof value === "string" && value.length > 0) return value;
	return null;
}
var BASE64URL_CHARSET_PATTERN = /^[A-Za-z0-9_-]+$/;
function decodeBase64urlStrict(input) {
	if (!BASE64URL_CHARSET_PATTERN.test(input)) return null;
	try {
		return decodeBase64url(input);
	} catch {
		return null;
	}
}
function readDefaultEnv() {
	const proc = typeof process !== "undefined" && process.env ? process.env : {};
	return {
		EMDASH_ENCRYPTION_KEY: proc.EMDASH_ENCRYPTION_KEY,
		EMDASH_PREVIEW_SECRET: proc.EMDASH_PREVIEW_SECRET,
		PREVIEW_SECRET: proc.PREVIEW_SECRET,
		EMDASH_IP_SALT: proc.EMDASH_IP_SALT,
		EMDASH_AUTH_SECRET: proc.EMDASH_AUTH_SECRET,
		AUTH_SECRET: proc.AUTH_SECRET
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/session-user-BrK2zz7S.mjs
/**
* Backstop timeout for resolving the session user. A live session-store read
* settles in a few ms, so this only ever fires on a genuinely stalled read.
*/
var SESSION_GET_TIMEOUT_MS = 3e3;
/**
* Resolve the Astro session user without risking an isolate-wide hang.
*
* On Cloudflare Workers, a request cancelled mid-`session.get()` (client
* disconnect, context teardown) can leave the underlying session-store read as
* a promise that never settles — neither resolving nor rejecting. Awaiting it
* directly hangs the request, and because the stalled promise is shared at the
* isolate level, every later session-bearing request hangs too (observed as
* 0-CPU, multi-minute, `canceled` responses; see #1274). A surrounding
* try/catch cannot help: the promise never rejects.
*
* Two layers, mirroring the reclaimable-cache pattern used elsewhere in core:
*  1. `after()` anchors the read so a cancelled request still drives it to
*     completion — the promise settles and the isolate is not poisoned for
*     subsequent requests (prevents the hang rather than merely surviving it).
*  2. A timeout is a fail-closed backstop: a still-stalled (or rejecting) read
*     resolves to `undefined`, and every caller treats the absence of a session
*     user as unauthenticated (anonymous on public routes, 401/redirect on
*     protected ones). It can only ever drop privileges for that one request,
*     never grant them.
*
* Used by every session read on the request path: the main middleware (the
* first read on a session-bearing request), the auth middleware, and the
* preview-snapshot route (which bypasses the auth middleware).
*/
async function resolveSessionUser(session, timeoutMs = SESSION_GET_TIMEOUT_MS) {
	if (!session) return void 0;
	const read = Promise.resolve(session.get("user")).catch(() => void 0);
	after(() => read.then(() => void 0, () => void 0));
	let timer;
	const timeout = new Promise((resolve) => {
		timer = setTimeout(resolve, timeoutMs, void 0);
	});
	try {
		return await Promise.race([read, timeout]);
	} finally {
		clearTimeout(timer);
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/media/local-runtime.mjs
/**
* Create the local media provider
*/
var createMediaProvider = (config) => {
	const { db, storage } = config;
	if (!db) throw new Error("Local media provider requires database connection");
	const resolveDb = config.getDb ?? (() => db);
	const repo = () => new MediaRepository(resolveDb());
	return {
		async list(options) {
			const result = await repo().findMany({
				cursor: options.cursor,
				limit: options.limit,
				mimeType: options.mimeType
			});
			return {
				items: result.items.map((item) => ({
					id: item.id,
					filename: item.filename,
					mimeType: item.mimeType,
					size: item.size ?? void 0,
					width: item.width ?? void 0,
					height: item.height ?? void 0,
					blurhash: item.blurhash ?? void 0,
					dominantColor: item.dominantColor ?? void 0,
					alt: item.alt ?? void 0,
					previewUrl: `/_emdash/api/media/file/${item.storageKey}`,
					meta: {
						storageKey: item.storageKey,
						caption: item.caption,
						blurhash: item.blurhash,
						dominantColor: item.dominantColor
					}
				})),
				nextCursor: result.nextCursor
			};
		},
		async get(id) {
			const item = await repo().findById(id);
			if (!item) return null;
			return {
				id: item.id,
				filename: item.filename,
				mimeType: item.mimeType,
				size: item.size ?? void 0,
				width: item.width ?? void 0,
				height: item.height ?? void 0,
				blurhash: item.blurhash ?? void 0,
				dominantColor: item.dominantColor ?? void 0,
				alt: item.alt ?? void 0,
				previewUrl: `/_emdash/api/media/file/${item.storageKey}`,
				meta: {
					storageKey: item.storageKey,
					caption: item.caption,
					blurhash: item.blurhash,
					dominantColor: item.dominantColor
				}
			};
		},
		async upload(_input) {
			if (!storage) throw new Error("Storage not configured for local media provider");
			throw new Error("Local upload should use /_emdash/api/media endpoint");
		},
		async delete(id) {
			const repoInstance = repo();
			const item = await repoInstance.findById(id);
			if (!item) return;
			if (storage) try {
				await storage.delete(item.storageKey);
			} catch {}
			await repoInstance.delete(id);
			invalidateSiteSettingsCache();
		},
		getEmbed(value, _options) {
			const src = `/_emdash/api/media/file/${typeof value.meta?.storageKey === "string" ? value.meta.storageKey : value.id}`;
			const mimeType = value.mimeType || "";
			const blurhash = value.blurhash ?? (typeof value.meta?.blurhash === "string" ? value.meta.blurhash : void 0);
			const dominantColor = value.dominantColor ?? (typeof value.meta?.dominantColor === "string" ? value.meta.dominantColor : void 0);
			if (mimeType.startsWith("image/")) return {
				type: "image",
				src,
				width: value.width,
				height: value.height,
				blurhash,
				dominantColor,
				alt: value.alt
			};
			if (mimeType.startsWith("video/")) return {
				type: "video",
				src,
				width: value.width,
				height: value.height,
				controls: true,
				preload: "metadata"
			};
			if (mimeType.startsWith("audio/")) return {
				type: "audio",
				src,
				controls: true,
				preload: "metadata"
			};
			return {
				type: "image",
				src,
				width: value.width,
				height: value.height,
				blurhash,
				dominantColor,
				alt: value.alt
			};
		},
		getThumbnailUrl(id, _mimeType) {
			return `/_emdash/api/media/file/${id}`;
		}
	};
};
//#endregion
//#region \0virtual:emdash/media-providers
/** Media provider descriptors with factory functions */
var mediaProviders = [{
	id: "local",
	name: "Library",
	icon: "folder",
	capabilities: {
		browse: true,
		search: false,
		upload: true,
		delete: true
	},
	createProvider: (ctx) => createMediaProvider({
		...ctx,
		enabled: true
	})
}];
//#endregion
//#region \0virtual:emdash/plugins
var plugins = [];
//#endregion
//#region \0virtual:emdash/sandbox-runner
var sandbox_runner_exports = /* @__PURE__ */ __exportAll({
	createSandboxRunner: () => createSandboxRunner,
	sandboxEnabled: () => false
});
var createSandboxRunner = createNoopSandboxRunner;
//#endregion
//#region \0virtual:emdash/sandboxed-plugins
var sandboxedPlugins = [];
//#endregion
//#region \0virtual:emdash/scheduler
function createScheduler(executor) {
	return new NodeCronScheduler(executor);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/storage/local.mjs
/**
* Local Filesystem Storage Implementation
*
* For development and testing. Stores files in a local directory.
*/
/** Type guard for Node.js ErrnoException */
function isNodeError(error) {
	return error instanceof Error && "code" in error;
}
/** Pattern to remove leading slashes */
var LEADING_SLASH_PATTERN$1 = /^\//;
/** Pattern to remove trailing slashes */
var TRAILING_SLASH_PATTERN = /\/$/;
/**
* Local filesystem storage implementation
*/
var LocalStorage = class {
	/** Resolved absolute base directory for all stored files */
	directory;
	baseUrl;
	constructor(config) {
		this.directory = path.resolve(config.directory);
		this.baseUrl = config.baseUrl.replace(TRAILING_SLASH_PATTERN, "");
	}
	/**
	* Resolve a storage key to an absolute file path, ensuring it stays
	* within the configured storage directory. Uses path.resolve() for
	* canonical resolution rather than regex stripping.
	*
	* @throws EmDashStorageError if the resolved path escapes the base directory
	*/
	getFilePath(key) {
		const normalizedKey = key.replace(LEADING_SLASH_PATTERN$1, "");
		const resolved = path.resolve(this.directory, normalizedKey);
		if (!resolved.startsWith(this.directory + path.sep) && resolved !== this.directory) throw new EmDashStorageError("Invalid file path", "INVALID_PATH");
		return resolved;
	}
	async upload(options) {
		try {
			const filePath = this.getFilePath(options.key);
			const dir = path.dirname(filePath);
			await fs.mkdir(dir, { recursive: true });
			let buffer;
			if (options.body instanceof ReadableStream) {
				const chunks = [];
				const reader = options.body.getReader();
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					chunks.push(value);
				}
				buffer = Buffer.concat(chunks);
			} else if (options.body instanceof Uint8Array) buffer = Buffer.from(options.body);
			else buffer = options.body;
			await fs.writeFile(filePath, buffer);
			return {
				key: options.key,
				url: this.getPublicUrl(options.key),
				size: buffer.length
			};
		} catch (error) {
			throw new EmDashStorageError(`Failed to upload file: ${options.key}`, "UPLOAD_FAILED", error);
		}
	}
	async download(key) {
		try {
			const filePath = this.getFilePath(key);
			if (!existsSync(filePath)) throw new EmDashStorageError(`File not found: ${key}`, "NOT_FOUND");
			const stat = await fs.stat(filePath);
			const nodeStream = createReadStream(filePath);
			return {
				body: Readable.toWeb(nodeStream),
				contentType: getContentType(path.extname(key).toLowerCase()),
				size: stat.size
			};
		} catch (error) {
			if (error instanceof EmDashStorageError) throw error;
			throw new EmDashStorageError(`Failed to download file: ${key}`, "DOWNLOAD_FAILED", error);
		}
	}
	async delete(key) {
		try {
			const filePath = this.getFilePath(key);
			await fs.unlink(filePath);
		} catch (error) {
			if (!isNodeError(error) || error.code !== "ENOENT") throw new EmDashStorageError(`Failed to delete file: ${key}`, "DELETE_FAILED", error);
		}
	}
	async exists(key) {
		try {
			const filePath = this.getFilePath(key);
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}
	async list(options = {}) {
		try {
			const prefix = options.prefix || "";
			const searchDir = path.resolve(this.directory, path.dirname(prefix));
			if (!searchDir.startsWith(this.directory + path.sep) && searchDir !== this.directory) throw new EmDashStorageError("Invalid list prefix", "INVALID_PATH");
			const prefixBase = path.basename(prefix);
			try {
				await fs.access(searchDir);
			} catch {
				return { files: [] };
			}
			const entries = await fs.readdir(searchDir, { withFileTypes: true });
			const files = [];
			for (const entry of entries) if (entry.isFile() && entry.name.startsWith(prefixBase)) {
				const key = path.join(path.dirname(prefix), entry.name);
				const filePath = path.join(searchDir, entry.name);
				const stat = await fs.stat(filePath);
				files.push({
					key,
					size: stat.size,
					lastModified: stat.mtime
				});
			}
			files.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
			const startIndex = options.cursor ? parseInt(options.cursor, 10) : 0;
			const limit = options.limit || 1e3;
			return {
				files: files.slice(startIndex, startIndex + limit),
				nextCursor: startIndex + limit < files.length ? String(startIndex + limit) : void 0
			};
		} catch (error) {
			throw new EmDashStorageError("Failed to list files", "LIST_FAILED", error);
		}
	}
	async getSignedUploadUrl(_options) {
		throw new EmDashStorageError("Local storage does not support signed upload URLs. Upload files directly through the API.", "NOT_SUPPORTED");
	}
	getPublicUrl(key) {
		return `${this.baseUrl}/${key}`;
	}
};
/**
* Get content type from file extension
*/
function getContentType(ext) {
	return index_lite_default.getType(ext) ?? "application/octet-stream";
}
/**
* Create local storage adapter
* This is the factory function called at runtime
*/
function createStorage$1(config) {
	return new LocalStorage({
		directory: typeof config.directory === "string" ? config.directory : "",
		baseUrl: typeof config.baseUrl === "string" ? config.baseUrl : ""
	});
}
//#endregion
//#region \0virtual:emdash/storage
var createStorage = createStorage$1;
//#endregion
//#region self-essentials/emdash-main/packages/auth/dist/adapters/kysely.mjs
function createKyselyAdapter(db) {
	const kdb = db;
	return {
		async getUserById(id) {
			const row = await kdb.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
			return row ? rowToUser(row) : null;
		},
		async getUserByEmail(email) {
			const row = await kdb.selectFrom("users").selectAll().where("email", "=", email.toLowerCase()).executeTakeFirst();
			return row ? rowToUser(row) : null;
		},
		async createUser(user) {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const id = ulid();
			const row = {
				id,
				email: user.email.toLowerCase(),
				name: user.name ?? null,
				avatar_url: user.avatarUrl ?? null,
				role: user.role ?? Role.SUBSCRIBER,
				email_verified: user.emailVerified ? 1 : 0,
				disabled: 0,
				data: user.data ? JSON.stringify(user.data) : null,
				created_at: now,
				updated_at: now
			};
			await kdb.insertInto("users").values(row).execute();
			return {
				id,
				email: row.email,
				name: user.name ?? null,
				avatarUrl: user.avatarUrl ?? null,
				role: toRoleLevel(row.role),
				emailVerified: row.email_verified === 1,
				disabled: false,
				data: user.data ?? null,
				createdAt: new Date(now),
				updatedAt: new Date(now)
			};
		},
		async updateUser(id, data) {
			const update = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
			if (data.email !== void 0) update.email = data.email.toLowerCase();
			if (data.name !== void 0) update.name = data.name;
			if (data.avatarUrl !== void 0) update.avatar_url = data.avatarUrl;
			if (data.role !== void 0) update.role = data.role;
			if (data.emailVerified !== void 0) update.email_verified = data.emailVerified ? 1 : 0;
			if (data.disabled !== void 0) update.disabled = data.disabled ? 1 : 0;
			if (data.data !== void 0) update.data = data.data ? JSON.stringify(data.data) : null;
			await kdb.updateTable("users").set(update).where("id", "=", id).execute();
		},
		async deleteUser(id) {
			await kdb.deleteFrom("users").where("id", "=", id).execute();
		},
		async countUsers() {
			return (await kdb.selectFrom("users").select((eb) => eb.fn.countAll().as("count")).executeTakeFirstOrThrow()).count;
		},
		async getUsers(options) {
			const limit = Math.min(options?.limit ?? 20, 100);
			let query = kdb.selectFrom("users").leftJoin("credentials", "users.id", "credentials.user_id").selectAll("users").select((eb) => [eb.fn.count("credentials.id").as("credential_count"), eb.fn.max("credentials.last_used_at").as("last_login")]).groupBy("users.id").orderBy("users.created_at", "desc").limit(limit + 1);
			if (options?.search) {
				const searchPattern = `%${options.search}%`;
				query = query.where((eb) => eb.or([eb("users.email", "like", searchPattern), eb("users.name", "like", searchPattern)]));
			}
			if (options?.role !== void 0) query = query.where("users.role", "=", options.role);
			if (options?.cursor) {
				const cursorUser = await kdb.selectFrom("users").select("created_at").where("id", "=", options.cursor).executeTakeFirst();
				if (cursorUser) query = query.where("users.created_at", "<", cursorUser.created_at);
			}
			const rows = await query.execute();
			const userIds = rows.slice(0, limit).map((r) => r.id);
			const oauthAccounts = userIds.length > 0 ? await kdb.selectFrom("oauth_accounts").select(["user_id", "provider"]).where("user_id", "in", userIds).execute() : [];
			const oauthByUser = /* @__PURE__ */ new Map();
			for (const account of oauthAccounts) {
				const providers = oauthByUser.get(account.user_id) ?? [];
				providers.push(account.provider);
				oauthByUser.set(account.user_id, providers);
			}
			const hasMore = rows.length > limit;
			const items = rows.slice(0, limit).map((row) => ({
				id: row.id,
				email: row.email,
				name: row.name,
				avatarUrl: row.avatar_url,
				role: toRoleLevel(row.role),
				emailVerified: row.email_verified === 1,
				disabled: row.disabled === 1,
				data: row.data ? JSON.parse(row.data) : null,
				createdAt: new Date(row.created_at),
				updatedAt: new Date(row.updated_at),
				lastLogin: row.last_login ? new Date(row.last_login) : null,
				credentialCount: row.credential_count ?? 0,
				oauthProviders: oauthByUser.get(row.id) ?? []
			}));
			return {
				items,
				nextCursor: hasMore ? items.at(-1)?.id : void 0
			};
		},
		async getUserWithDetails(id) {
			const user = await kdb.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
			if (!user) return null;
			const [credentials, oauthAccounts] = await Promise.all([kdb.selectFrom("credentials").selectAll().where("user_id", "=", id).orderBy("created_at", "desc").execute(), kdb.selectFrom("oauth_accounts").selectAll().where("user_id", "=", id).execute()]);
			const lastLogin = credentials.reduce((latest, cred) => {
				const lastUsed = new Date(cred.last_used_at);
				return !latest || lastUsed > latest ? lastUsed : latest;
			}, null);
			return {
				user: rowToUser(user),
				credentials: credentials.map(rowToCredential),
				oauthAccounts: oauthAccounts.map(rowToOAuthAccount),
				lastLogin
			};
		},
		async countAdmins() {
			return (await kdb.selectFrom("users").select((eb) => eb.fn.countAll().as("count")).where("role", "=", Role.ADMIN).where("disabled", "=", 0).executeTakeFirstOrThrow()).count;
		},
		async getCredentialById(id) {
			const row = await kdb.selectFrom("credentials").selectAll().where("id", "=", id).executeTakeFirst();
			return row ? rowToCredential(row) : null;
		},
		async getCredentialsByUserId(userId) {
			return (await kdb.selectFrom("credentials").selectAll().where("user_id", "=", userId).execute()).map(rowToCredential);
		},
		async createCredential(credential) {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const row = {
				id: credential.id,
				user_id: credential.userId,
				public_key: credential.publicKey,
				algorithm: credential.algorithm,
				counter: credential.counter,
				device_type: credential.deviceType,
				backed_up: credential.backedUp ? 1 : 0,
				transports: credential.transports.length > 0 ? JSON.stringify(credential.transports) : null,
				name: credential.name ?? null,
				created_at: now,
				last_used_at: now
			};
			await kdb.insertInto("credentials").values(row).execute();
			return {
				id: credential.id,
				userId: credential.userId,
				publicKey: credential.publicKey,
				algorithm: credential.algorithm,
				counter: credential.counter,
				deviceType: credential.deviceType,
				backedUp: credential.backedUp,
				transports: credential.transports,
				name: credential.name ?? null,
				createdAt: new Date(now),
				lastUsedAt: new Date(now)
			};
		},
		async updateCredentialCounter(id, counter) {
			await kdb.updateTable("credentials").set({
				counter,
				last_used_at: (/* @__PURE__ */ new Date()).toISOString()
			}).where("id", "=", id).execute();
		},
		async updateCredentialName(id, name) {
			await kdb.updateTable("credentials").set({ name }).where("id", "=", id).execute();
		},
		async deleteCredential(id) {
			await kdb.deleteFrom("credentials").where("id", "=", id).execute();
		},
		async countCredentialsByUserId(userId) {
			return (await kdb.selectFrom("credentials").select((eb) => eb.fn.countAll().as("count")).where("user_id", "=", userId).executeTakeFirstOrThrow()).count;
		},
		async createToken(token) {
			const row = {
				hash: token.hash,
				user_id: token.userId ?? null,
				email: token.email ?? null,
				type: token.type,
				role: token.role ?? null,
				invited_by: token.invitedBy ?? null,
				expires_at: token.expiresAt.toISOString(),
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			await kdb.insertInto("auth_tokens").values(row).execute();
		},
		async getToken(hash, type) {
			const row = await kdb.selectFrom("auth_tokens").selectAll().where("hash", "=", hash).where("type", "=", type).executeTakeFirst();
			return row ? rowToAuthToken(row) : null;
		},
		async deleteToken(hash) {
			await kdb.deleteFrom("auth_tokens").where("hash", "=", hash).execute();
		},
		async deleteExpiredTokens() {
			await kdb.deleteFrom("auth_tokens").where("expires_at", "<", (/* @__PURE__ */ new Date()).toISOString()).execute();
		},
		async getOAuthAccount(provider, providerAccountId) {
			const row = await kdb.selectFrom("oauth_accounts").selectAll().where("provider", "=", provider).where("provider_account_id", "=", providerAccountId).executeTakeFirst();
			return row ? rowToOAuthAccount(row) : null;
		},
		async getOAuthAccountsByUserId(userId) {
			return (await kdb.selectFrom("oauth_accounts").selectAll().where("user_id", "=", userId).execute()).map(rowToOAuthAccount);
		},
		async createOAuthAccount(account) {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const row = {
				provider: account.provider,
				provider_account_id: account.providerAccountId,
				user_id: account.userId,
				created_at: now
			};
			await kdb.insertInto("oauth_accounts").values(row).execute();
			return {
				provider: account.provider,
				providerAccountId: account.providerAccountId,
				userId: account.userId,
				createdAt: new Date(now)
			};
		},
		async deleteOAuthAccount(provider, providerAccountId) {
			await kdb.deleteFrom("oauth_accounts").where("provider", "=", provider).where("provider_account_id", "=", providerAccountId).execute();
		},
		async getAllowedDomain(domain) {
			const row = await kdb.selectFrom("allowed_domains").selectAll().where("domain", "=", domain.toLowerCase()).executeTakeFirst();
			return row ? rowToAllowedDomain(row) : null;
		},
		async getAllowedDomains() {
			return (await kdb.selectFrom("allowed_domains").selectAll().execute()).map(rowToAllowedDomain);
		},
		async createAllowedDomain(domain, defaultRole) {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const row = {
				domain: domain.toLowerCase(),
				default_role: defaultRole,
				enabled: 1,
				created_at: now
			};
			await kdb.insertInto("allowed_domains").values(row).execute();
			return {
				domain: row.domain,
				defaultRole,
				enabled: true,
				createdAt: new Date(now)
			};
		},
		async updateAllowedDomain(domain, enabled, defaultRole) {
			const update = { enabled: enabled ? 1 : 0 };
			if (defaultRole !== void 0) update.default_role = defaultRole;
			await kdb.updateTable("allowed_domains").set(update).where("domain", "=", domain.toLowerCase()).execute();
		},
		async deleteAllowedDomain(domain) {
			await kdb.deleteFrom("allowed_domains").where("domain", "=", domain.toLowerCase()).execute();
		}
	};
}
function rowToUser(row) {
	return {
		id: row.id,
		email: row.email,
		name: row.name,
		avatarUrl: row.avatar_url,
		role: toRoleLevel(row.role),
		emailVerified: row.email_verified === 1,
		disabled: row.disabled === 1,
		data: row.data ? JSON.parse(row.data) : null,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at)
	};
}
function rowToCredential(row) {
	return {
		id: row.id,
		userId: row.user_id,
		publicKey: row.public_key,
		algorithm: row.algorithm,
		counter: row.counter,
		deviceType: toDeviceType(row.device_type),
		backedUp: row.backed_up === 1,
		transports: row.transports ? JSON.parse(row.transports) : [],
		name: row.name,
		createdAt: new Date(row.created_at),
		lastUsedAt: new Date(row.last_used_at)
	};
}
function rowToAuthToken(row) {
	return {
		hash: row.hash,
		userId: row.user_id,
		email: row.email,
		type: toTokenType(row.type),
		role: row.role != null ? toRoleLevel(row.role) : null,
		invitedBy: row.invited_by,
		expiresAt: new Date(row.expires_at),
		createdAt: new Date(row.created_at)
	};
}
function rowToOAuthAccount(row) {
	return {
		provider: row.provider,
		providerAccountId: row.provider_account_id,
		userId: row.user_id,
		createdAt: new Date(row.created_at)
	};
}
function rowToAllowedDomain(row) {
	return {
		domain: row.domain,
		defaultRole: toRoleLevel(row.default_role),
		enabled: row.enabled === 1,
		createdAt: new Date(row.created_at)
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/middleware.mjs
async function repairLocaleCasing(db, configuredLocales) {
	const tableNames = await listTablesLike(db, "ec_%");
	for (const tableName of tableNames) {
		const table = sql.ref(tableName);
		const slug = tableName.slice(3);
		for (const locale of configuredLocales) {
			await sql`
				UPDATE ${table} AS target
				SET locale = ${locale}
				WHERE lower(target.locale) = lower(${locale})
					AND target.locale != ${locale}
					AND NOT EXISTS (
						SELECT 1
						FROM ${table} AS existing
						WHERE existing.slug = target.slug AND existing.locale = ${locale}
					)
					AND target.id = (
						SELECT MIN(candidate.id)
						FROM ${table} AS candidate
						WHERE candidate.slug = target.slug
							AND lower(candidate.locale) = lower(${locale})
							AND candidate.locale != ${locale}
					)
			`.execute(db);
			await sql`
				UPDATE content_taxonomies AS pivot
				SET locale = ${locale}
				WHERE pivot.collection = ${slug}
					AND lower(pivot.locale) = lower(${locale})
					AND pivot.locale != ${locale}
					AND EXISTS (
						SELECT 1
						FROM ${table} AS content
						WHERE content.id = pivot.entry_id AND content.locale = ${locale}
					)
			`.execute(db);
		}
	}
}
function createSandboxRunnerOptions(options, siteInfo) {
	return {
		...options,
		siteInfo: createSiteInfo(siteInfo ?? {})
	};
}
var REVISION_KEEP_COUNT = 50;
var REVISION_PRUNE_THRESHOLD = REVISION_KEEP_COUNT;
async function runSystemCleanup(db, storage) {
	const result = {
		challenges: -1,
		expiredTokens: -1,
		pendingUploads: -1,
		pendingUploadFiles: -1,
		uploadAttempts: -1,
		revisionsPruned: -1
	};
	try {
		result.challenges = await cleanupExpiredChallenges(db);
	} catch (error) {
		console.error("[cleanup] Failed to clean expired challenges:", error);
	}
	try {
		await createKyselyAdapter(db).deleteExpiredTokens();
		result.expiredTokens = 0;
	} catch (error) {
		console.error("[cleanup] Failed to clean expired tokens:", error);
	}
	try {
		const orphanedKeys = await new MediaRepository(db).cleanupPendingUploads();
		result.pendingUploads = orphanedKeys.length;
		if (storage && orphanedKeys.length > 0) {
			let filesDeleted = 0;
			for (const key of orphanedKeys) try {
				await storage.delete(key);
				filesDeleted++;
			} catch (error) {
				console.error(`[cleanup] Failed to delete storage file ${key}:`, error);
			}
			result.pendingUploadFiles = filesDeleted;
		} else result.pendingUploadFiles = 0;
	} catch (error) {
		console.error("[cleanup] Failed to clean pending uploads:", error);
	}
	try {
		const mediaRepo = new MediaRepository(db);
		const completedAttemptsDeleted = await mediaRepo.deleteCompletedUploadAttempts();
		if (!storage) result.uploadAttempts = completedAttemptsDeleted;
		else {
			const storageKeys = await mediaRepo.findUploadAttemptsForCleanup();
			let attemptsDeleted = completedAttemptsDeleted;
			for (const storageKey of storageKeys) if (await removeUploadAttempt(storage, mediaRepo, storageKey)) attemptsDeleted++;
			result.uploadAttempts = attemptsDeleted;
		}
	} catch (error) {
		console.error("[cleanup] Failed to clean media upload attempts:", error);
	}
	try {
		result.revisionsPruned = await pruneExcessiveRevisions(db);
	} catch (error) {
		console.error("[cleanup] Failed to prune revisions:", error);
	}
	return result;
}
async function pruneExcessiveRevisions(db) {
	const entries = await sql`
		SELECT collection, entry_id
		FROM revisions
		GROUP BY collection, entry_id
		HAVING COUNT(*) > ${REVISION_PRUNE_THRESHOLD}
	`.execute(db);
	if (entries.rows.length === 0) return 0;
	const revisionRepo = new RevisionRepository(db);
	let totalPruned = 0;
	for (const row of entries.rows) try {
		const pruned = await revisionRepo.pruneOldRevisions(row.collection, row.entry_id, REVISION_KEEP_COUNT);
		totalPruned += pruned;
	} catch (error) {
		console.error(`[cleanup] Failed to prune revisions for ${row.collection}/${row.entry_id}:`, error);
	}
	return totalPruned;
}
var DEFAULT_COMMENT_MODERATOR_PLUGIN_ID = "emdash-default-comment-moderator";
async function defaultCommentModerate(event, _ctx) {
	const { comment, collectionSettings, priorApprovedCount } = event;
	if (collectionSettings.commentsAutoApproveUsers && comment.authorUserId) return {
		status: "approved",
		reason: "Authenticated CMS user"
	};
	if (collectionSettings.commentsModeration === "none") return {
		status: "approved",
		reason: "Moderation disabled"
	};
	if (collectionSettings.commentsModeration === "first_time" && priorApprovedCount > 0) return {
		status: "approved",
		reason: "Returning commenter"
	};
	return {
		status: "pending",
		reason: "Held for review"
	};
}
var SCHEDULED_PUBLISH_BATCH_LIMIT = 100;
async function publishDueContent(db, options = {}) {
	const { publish, onPublished, limit = SCHEDULED_PUBLISH_BATCH_LIMIT } = options;
	const published = [];
	let collections;
	try {
		collections = await new SchemaRegistry(db).listCollections();
	} catch (error) {
		console.error("[scheduled-publish] Failed to list collections:", error);
		return published;
	}
	const repo = new ContentRepository(db);
	const doPublish = publish ?? ((collection, id, opts) => handleContentPublish(db, collection, id, opts));
	const batchLimit = limit > 0 ? limit : void 0;
	for (const collection of collections) try {
		const due = await repo.findReadyToPublish(collection.slug, batchLimit);
		const batch = [];
		for (const item of due) {
			const publishedAt = item.publishedAt == null ? item.scheduledAt ?? void 0 : void 0;
			const result = await doPublish(collection.slug, item.id, {
				publishedAt,
				requireScheduledDue: true
			});
			if (result.success) batch.push({
				collection: collection.slug,
				id: item.id
			});
			else if (result.error?.code === "NOT_DUE") {} else console.error(`[scheduled-publish] Failed to publish ${collection.slug}/${item.id}:`, result.error);
		}
		if (batch.length > 0) {
			published.push(...batch);
			if (onPublished) try {
				await onPublished(batch);
			} catch (error) {
				console.error(`[scheduled-publish] onPublished failed after "${collection.slug}" batch:`, error);
			}
		}
	} catch (error) {
		console.error(`[scheduled-publish] Sweep failed for "${collection.slug}":`, error);
	}
	return published;
}
var LEADING_SLASH_PATTERN = /^\//;
var LOCALE_CASING_REPAIR_OPTION = "emdash:repair_locale_casing";
function getLocaleCasingRepairVersion(locales) {
	if (locales.length === 0) return null;
	return `1:${locales.toSorted().join(",")}`;
}
function parseStringArray(raw) {
	if (!raw) return [];
	const parsed = JSON.parse(raw);
	if (!Array.isArray(parsed)) return [];
	return parsed.filter((v) => typeof v === "string");
}
var VALID_METADATA_KINDS = /* @__PURE__ */ new Set([
	"meta",
	"property",
	"link",
	"jsonld"
]);
var VALID_LINK_REL = /* @__PURE__ */ new Set([
	"canonical",
	"alternate",
	"author",
	"license",
	"nlweb",
	"site.standard.document"
]);
function isValidMetadataContribution(c) {
	if (!c || typeof c !== "object" || !("kind" in c)) return false;
	const obj = c;
	if (typeof obj.kind !== "string" || !VALID_METADATA_KINDS.has(obj.kind)) return false;
	switch (obj.kind) {
		case "meta": return typeof obj.name === "string" && typeof obj.content === "string";
		case "property": return typeof obj.property === "string" && typeof obj.content === "string";
		case "link": return typeof obj.href === "string" && typeof obj.rel === "string" && VALID_LINK_REL.has(obj.rel);
		case "jsonld": return obj.graph != null && typeof obj.graph === "object";
		default: return false;
	}
}
var FIELD_TYPE_TO_KIND = {
	string: "string",
	slug: "string",
	url: "url",
	text: "richText",
	number: "number",
	integer: "number",
	boolean: "boolean",
	datetime: "datetime",
	select: "select",
	multiSelect: "multiSelect",
	portableText: "portableText",
	image: "image",
	file: "file",
	reference: "reference",
	json: "json",
	repeater: "repeater"
};
var DRAFT_ONLY_UPDATE_KEYS = /* @__PURE__ */ new Set([
	"data",
	"slug",
	"locale",
	"skipRevision"
]);
function contentItemToRecord(item) {
	return { ...item };
}
var DB_INIT_DEADLINE_MS = MIGRATION_RACE_WAIT_MS + 2e4;
var DB_HOLDER_KEY = /* @__PURE__ */ Symbol.for("emdash:db-cache");
var globalSymbolStore = globalThis;
function getDbHolder() {
	let holder = globalSymbolStore[DB_HOLDER_KEY];
	if (!holder) {
		holder = {
			cache: /* @__PURE__ */ new Map(),
			lock: createInitLock(),
			failures: /* @__PURE__ */ new Map()
		};
		globalSymbolStore[DB_HOLDER_KEY] = holder;
	}
	holder.failures ??= /* @__PURE__ */ new Map();
	return holder;
}
var DB_INIT_FAILURE_BACKOFF_MS = 3e4;
var SEED_HOLDER_KEY = /* @__PURE__ */ Symbol.for("emdash:seed-state");
function getSeedHolder() {
	let holder = globalSymbolStore[SEED_HOLDER_KEY];
	if (!holder) {
		holder = {
			done: /* @__PURE__ */ new Set(),
			lock: createInitLock()
		};
		globalSymbolStore[SEED_HOLDER_KEY] = holder;
	}
	return holder;
}
var storageCache = /* @__PURE__ */ new Map();
var sandboxedPluginCache = /* @__PURE__ */ new Map();
var marketplacePluginKeys = /* @__PURE__ */ new Set();
var registryPluginKeys = /* @__PURE__ */ new Set();
var marketplaceManifestCache = /* @__PURE__ */ new Map();
var sandboxedRouteMetaCache = /* @__PURE__ */ new Map();
var sandboxRunner = null;
var EmDashRuntime = class EmDashRuntime2 {
	/**
	* The singleton database instance (worker-lifetime cached).
	* Use the `db` getter instead — it checks the request context first
	* for per-request overrides (D1 read replica sessions, DO multi-site).
	*/
	_db;
	storage;
	configuredPlugins;
	sandboxedPlugins;
	sandboxedPluginEntries;
	/**
	* Schema registry bound to the current request/event-scoped connection.
	* Built per access (SchemaRegistry just wraps a db) against `this.db`, the
	* ALS-aware getter — never a captured snapshot of the singleton. On a
	* connection-backed adapter (Postgres over Hyperdrive) a captured singleton
	* would query a socket opened by an earlier event and trip workerd's
	* cross-request I/O guard; the catch in handlers like handleContentUpdate
	* would then silently treat a revision-enabled collection as non-revisioned
	* and write draft edits to live columns. Same reasoning as the per-call
	* registry in _buildManifest().
	*/
	get schemaRegistry() {
		return new SchemaRegistry(this.db);
	}
	_hooks;
	config;
	mediaProviders;
	mediaProviderEntries;
	cronExecutor;
	email;
	cronScheduler;
	enabledPlugins;
	pluginStates;
	/**
	* Isolate-lifetime guard so FTS indexes are verified at most once per
	* worker rather than on every admin request. See ensureSearchHealthy().
	* Uses the poison-immune single-flight cache (never a shared awaitable
	* promise) so a cancelled first caller can't wedge later ones.
	*/
	_searchHealthCache = createSingleFlightCache();
	/** Current hook pipeline. Use the `hooks` getter for external access. */
	get hooks() {
		return this._hooks;
	}
	/** All plugins eligible for the hook pipeline (includes built-in plugins).
	*  Stored so we can rebuild the pipeline when plugins are enabled/disabled. */
	allPipelinePlugins;
	/** Factory options for the hook pipeline context factory */
	pipelineFactoryOptions;
	/** Dependencies needed for exclusive hook resolution */
	runtimeDeps;
	/** Mutable ref for the cron invokeCronHook closure to read the current pipeline */
	pipelineRef;
	/**
	* Get the database instance for the current request.
	*
	* Checks the ALS-based request context first — middleware sets a
	* per-request Kysely instance there for D1 read replica sessions
	* or DO preview databases. Falls back to the singleton instance.
	*/
	get db() {
		const ctx = getRequestContext();
		if (ctx?.db) return ctx.db;
		return this._db;
	}
	constructor(parts) {
		this._db = parts.db;
		this.storage = parts.storage;
		this.configuredPlugins = parts.configuredPlugins;
		this.sandboxedPlugins = parts.sandboxedPlugins;
		this.sandboxedPluginEntries = parts.sandboxedPluginEntries;
		this._hooks = parts.hooks;
		this.enabledPlugins = parts.enabledPlugins;
		this.pluginStates = parts.pluginStates;
		this.config = parts.config;
		this.mediaProviders = parts.mediaProviders;
		this.mediaProviderEntries = parts.mediaProviderEntries;
		this.cronExecutor = parts.cronExecutor;
		this.cronScheduler = parts.cronScheduler;
		this.email = parts.emailPipeline;
		this.allPipelinePlugins = parts.allPipelinePlugins;
		this.pipelineFactoryOptions = parts.pipelineFactoryOptions;
		this.runtimeDeps = parts.runtimeDeps;
		this.pipelineRef = parts.pipelineRef;
	}
	/**
	* Get the sandbox runner instance (for marketplace install/update)
	*/
	getSandboxRunner() {
		return sandboxRunner;
	}
	/**
	* Whether the sandbox bypass mode (sandbox: false) is active.
	* Marketplace install/update handlers use this to skip the
	* SANDBOX_NOT_AVAILABLE gate, since the bypass path loads
	* marketplace plugins in-process via syncMarketplacePlugins().
	*/
	isSandboxBypassed() {
		return this.runtimeDeps.sandboxBypassed === true;
	}
	/**
	* Publish any content whose scheduled time has passed.
	* Returns the items promoted so callers can invalidate their cache tags.
	*/
	async publishScheduled() {
		return publishDueContent(this.db, { publish: (collection, id, options) => this.handleContentPublish(collection, id, options) });
	}
	/**
	* Run the full scheduled-maintenance batch: cron tasks, scheduled
	* publishing, and system cleanup. For request-less drivers — the
	* Cloudflare `scheduled()` handler invokes this from a Cron Trigger.
	* (On Node the timer-based scheduler drives the same work itself.)
	*
	* Each step is independent and non-fatal. Returns the content promoted
	* by the publishing sweep so the caller can purge edge-cache tags.
	*
	* `onPublished` (optional) is awaited after each collection's batch so a
	* request-less driver can invalidate edge-cache tags incrementally rather
	* than only after the whole sweep — bounding stale-cache exposure if the
	* runtime is killed mid-sweep.
	*/
	async runScheduledTasks(options = {}) {
		if (this.cronExecutor) {
			try {
				await this.cronExecutor.tick();
			} catch (error) {
				console.error("[cron] Tick failed:", error);
			}
			try {
				await this.cronExecutor.recoverStaleLocks();
			} catch (error) {
				console.error("[cron] Stale lock recovery failed:", error);
			}
		}
		let published = [];
		try {
			published = await publishDueContent(this.db, {
				publish: (collection, id, opts) => this.handleContentPublish(collection, id, opts),
				onPublished: options.onPublished
			});
		} catch (error) {
			console.error("[scheduled-publish] Sweep failed:", error);
		}
		try {
			await runSystemCleanup(this.db, this.storage ?? void 0);
		} catch (error) {
			console.error("[cleanup] System cleanup failed:", error);
		}
		await maybeRunScheduledBackup(this.db, this.storage ?? void 0);
		return { published };
	}
	/**
	* Stop the cron scheduler gracefully.
	* Call during worker shutdown or hot-reload.
	*/
	async stopCron() {
		if (this.cronScheduler) await this.cronScheduler.stop();
	}
	/**
	* Update in-memory plugin status and rebuild the hook pipeline.
	*
	* Rebuilding the pipeline ensures disabled plugins' hooks stop firing
	* and re-enabled plugins' hooks start firing again without a restart.
	* Exclusive hook selections are re-resolved after each rebuild.
	*/
	async setPluginStatus(pluginId, status) {
		this.pluginStates.set(pluginId, status);
		if (status === "active") {
			this.enabledPlugins.add(pluginId);
			await this.rebuildHookPipeline();
			await this._hooks.runPluginActivate(pluginId);
		} else {
			await this._hooks.runPluginDeactivate(pluginId);
			this.enabledPlugins.delete(pluginId);
			await this.rebuildHookPipeline();
		}
	}
	/**
	* Rebuild the hook pipeline from the current set of enabled plugins.
	*
	* Filters `allPipelinePlugins` to only those in `enabledPlugins`,
	* creates a fresh HookPipeline, re-resolves exclusive hook selections,
	* and re-wires the context factory so existing references (cron
	* callbacks, email pipeline) use the new pipeline.
	*/
	async rebuildHookPipeline() {
		const newPipeline = createHookPipeline(this.allPipelinePlugins.filter((p) => this.enabledPlugins.has(p.id)), this.pipelineFactoryOptions);
		await EmDashRuntime2.resolveExclusiveHooks(newPipeline, this.db, this.runtimeDeps);
		if (this.email) newPipeline.setContextFactory({ emailPipeline: this.email });
		newPipeline.setContextFactory({ cronReschedule: () => this.cronScheduler?.reschedule() });
		if (this.email) this.email.setPipeline(newPipeline);
		this.pipelineRef.current = newPipeline;
		this._hooks = newPipeline;
	}
	/**
	* Synchronize marketplace plugin runtime state with DB + storage.
	*
	* Ensures install/update/uninstall changes take effect immediately in the
	* current worker: loads newly active plugins and removes uninstalled ones.
	*/
	async syncMarketplacePlugins() {
		if (!this.config.marketplace) return;
		if (this.runtimeDeps.sandboxBypassed) {
			await this.syncMarketplacePluginsBypassed();
			return;
		}
		await this.syncSandboxedSourcePlugins("marketplace");
	}
	/**
	* Synchronize registry plugin runtime state with DB + storage.
	*
	* Mirrors {@link syncMarketplacePlugins} for plugins installed via the
	* experimental decentralized plugin registry. Called after install,
	* update, and uninstall handlers complete.
	*/
	async syncRegistryPlugins() {
		if (!this.config.experimental?.registry) return;
		await this.syncSandboxedSourcePlugins("registry");
	}
	/**
	* Internal: reconcile in-memory sandboxed-plugin state with the
	* `_plugin_state` table for the given source tier. Shared
	* implementation behind {@link syncMarketplacePlugins} and
	* {@link syncRegistryPlugins}.
	*
	* Each source tier has its own key set in `${source}PluginKeys` so a
	* sync for one tier doesn't invalidate the other.
	*/
	async syncSandboxedSourcePlugins(source) {
		if (!this.storage) return;
		if (!sandboxRunner || !sandboxRunner.isAvailable()) return;
		const keySet = source === "marketplace" ? marketplacePluginKeys : registryPluginKeys;
		try {
			const stateRepo = new PluginStateRepository(this.db);
			const states = source === "marketplace" ? await stateRepo.getMarketplacePlugins() : await stateRepo.getRegistryPlugins();
			const desired = /* @__PURE__ */ new Map();
			for (const state of states) {
				this.pluginStates.set(state.pluginId, state.status);
				if (state.status === "active") this.enabledPlugins.add(state.pluginId);
				else this.enabledPlugins.delete(state.pluginId);
				if (state.status !== "active") continue;
				const desiredVersion = source === "marketplace" ? state.marketplaceVersion ?? state.version : state.version;
				desired.set(state.pluginId, desiredVersion);
			}
			const keysToRemove = [];
			for (const key of keySet) {
				const [pluginId] = key.split(":");
				if (!pluginId) continue;
				const desiredVersion = desired.get(pluginId);
				if (desiredVersion && key === `${pluginId}:${desiredVersion}`) continue;
				keysToRemove.push(key);
			}
			for (const key of keysToRemove) {
				const [pluginId] = key.split(":");
				if (!pluginId) continue;
				if (!desired.get(pluginId)) {
					this.pluginStates.delete(pluginId);
					this.enabledPlugins.delete(pluginId);
				}
				const existing = sandboxedPluginCache.get(key);
				if (existing) try {
					await existing.terminate();
				} catch (error) {
					console.warn(`EmDash: Failed to terminate sandboxed plugin ${key}:`, error);
				}
				sandboxedPluginCache.delete(key);
				this.sandboxedPlugins.delete(key);
				keySet.delete(key);
				if (pluginId) {
					sandboxedRouteMetaCache.delete(pluginId);
					marketplaceManifestCache.delete(pluginId);
				}
			}
			for (const [pluginId, version] of desired) {
				const key = `${pluginId}:${version}`;
				if (sandboxedPluginCache.has(key)) {
					keySet.add(key);
					continue;
				}
				const bundle = await loadBundleFromR2(this.storage, pluginId, version, source);
				if (!bundle) {
					console.warn(`EmDash: ${source} plugin ${pluginId}@${version} not found in R2`);
					continue;
				}
				const loaded = await sandboxRunner.load(bundle.manifest, bundle.backendCode);
				sandboxedPluginCache.set(key, loaded);
				this.sandboxedPlugins.set(key, loaded);
				keySet.add(key);
				marketplaceManifestCache.set(pluginId, {
					id: bundle.manifest.id,
					version: bundle.manifest.version,
					admin: bundle.manifest.admin,
					mcp: bundle.manifest.mcp
				});
				if (bundle.manifest.routes.length > 0) {
					const routeMetaMap = /* @__PURE__ */ new Map();
					for (const entry of bundle.manifest.routes) {
						const normalized = normalizeManifestRoute(entry);
						routeMetaMap.set(normalized.name, buildRouteMeta(normalized));
					}
					sandboxedRouteMetaCache.set(pluginId, routeMetaMap);
				} else sandboxedRouteMetaCache.delete(pluginId);
			}
		} catch (error) {
			console.error(`EmDash: Failed to sync ${source} plugins:`, error);
		}
	}
	/**
	* Remove a plugin from the in-memory pipeline lists by ID.
	* Mutates allPipelinePlugins and configuredPlugins in place.
	*/
	removePluginFromLists(pluginId) {
		const allIdx = this.allPipelinePlugins.findIndex((p) => p.id === pluginId);
		if (allIdx !== -1) this.allPipelinePlugins.splice(allIdx, 1);
		const configIdx = this.configuredPlugins.findIndex((p) => p.id === pluginId);
		if (configIdx !== -1) this.configuredPlugins.splice(configIdx, 1);
	}
	/**
	* Sync marketplace plugin metadata in sandbox: false bypass mode.
	*
	* In bypass mode the noop runner can't load plugins, but admin pages,
	* widgets, and route metadata still need to refresh in-process when an
	* admin installs/updates/uninstalls a marketplace plugin. Otherwise the
	* admin UI shows stale data until the server restarts.
	*
	* Hooks and routes still won't execute under bypass (matches the
	* cold-start bypass behavior in loadMarketplacePluginsBypassed).
	*
	* Known limitation: bypass plugins are loaded via `import(dataUrl)`,
	* which Node's ESM cache keys on the full URL. Updates create fresh
	* module objects, but old ones remain cached for the worker's lifetime.
	* In practice this is a few KB per update — only matters for sites with
	* very frequent marketplace updates running long-lived processes. The
	* fix would be vm.SourceTextModule for explicit lifecycle management.
	*/
	async syncMarketplacePluginsBypassed() {
		if (!this.storage) return;
		try {
			const marketplaceStates = await new PluginStateRepository(this.db).getMarketplacePlugins();
			const desired = /* @__PURE__ */ new Map();
			for (const state of marketplaceStates) {
				this.pluginStates.set(state.pluginId, state.status);
				if (state.status === "active") this.enabledPlugins.add(state.pluginId);
				else this.enabledPlugins.delete(state.pluginId);
				if (state.status !== "active") continue;
				desired.set(state.pluginId, state.marketplaceVersion ?? state.version);
			}
			const toRemove = [];
			for (const pluginId of marketplaceManifestCache.keys()) if (!desired.has(pluginId)) toRemove.push(pluginId);
			for (const pluginId of toRemove) {
				const resolved = this.allPipelinePlugins.find((p) => p.id === pluginId);
				if (resolved) try {
					const deactivateHook = resolved.hooks?.["plugin:deactivate"];
					if (deactivateHook) {
						const handler = typeof deactivateHook === "function" ? deactivateHook : deactivateHook.handler;
						if (typeof handler === "function") await handler({ pluginId }, {});
					}
				} catch (err) {
					console.warn(`[emdash] plugin:deactivate hook failed for ${pluginId}:`, err);
				}
				marketplaceManifestCache.delete(pluginId);
				sandboxedRouteMetaCache.delete(pluginId);
				this.removePluginFromLists(pluginId);
				this.enabledPlugins.delete(pluginId);
			}
			const { adaptSandboxEntry } = await import("./adapt-sandbox-entry_lGLRTEnk.mjs");
			const newPlugins = [];
			for (const [pluginId, version] of desired) {
				const bundle = await loadBundleFromR2(this.storage, pluginId, version);
				if (!bundle) {
					console.warn(`EmDash: Marketplace plugin ${pluginId}@${version} not found in R2`);
					continue;
				}
				marketplaceManifestCache.set(pluginId, {
					id: bundle.manifest.id,
					version: bundle.manifest.version,
					admin: bundle.manifest.admin,
					mcp: bundle.manifest.mcp
				});
				if (bundle.manifest.routes.length > 0) {
					const routeMetaMap = /* @__PURE__ */ new Map();
					for (const entry of bundle.manifest.routes) {
						const normalized = normalizeManifestRoute(entry);
						routeMetaMap.set(normalized.name, buildRouteMeta(normalized));
					}
					sandboxedRouteMetaCache.set(pluginId, routeMetaMap);
				} else sandboxedRouteMetaCache.delete(pluginId);
				const existing = this.allPipelinePlugins.find((p) => p.id === pluginId);
				if (existing && existing.version === bundle.manifest.version) continue;
				if (existing) this.removePluginFromLists(pluginId);
				try {
					const pluginModule = await import(`data:text/javascript;base64,${Buffer.from(bundle.backendCode).toString("base64")}`);
					const adapted = adaptSandboxEntry(pluginModule.default ?? pluginModule, {
						id: bundle.manifest.id,
						version: bundle.manifest.version,
						entrypoint: "",
						capabilities: bundle.manifest.capabilities ?? [],
						allowedHosts: bundle.manifest.allowedHosts ?? [],
						storage: bundle.manifest.storage ?? {},
						adminPages: bundle.manifest.admin?.pages,
						adminWidgets: bundle.manifest.admin?.widgets?.map((w) => ({
							id: w.id,
							title: w.title,
							size: w.size === "full" || w.size === "half" || w.size === "third" ? w.size : void 0
						})),
						settingsSchema: bundle.manifest.admin?.settingsSchema
					});
					newPlugins.push(adapted);
					this.allPipelinePlugins.push(adapted);
					this.configuredPlugins.push(adapted);
					this.enabledPlugins.add(adapted.id);
				} catch (error) {
					console.error(`EmDash: Failed to load marketplace plugin ${pluginId}@${version} in-process:`, error);
				}
			}
			if (toRemove.length > 0 || newPlugins.length > 0) await this.rebuildHookPipeline();
		} catch (error) {
			console.error("EmDash: Failed to sync marketplace plugins (bypass):", error);
		}
	}
	/**
	* Create and initialize the runtime
	*/
	static async create(deps, timings) {
		const phase = async (name, desc, fn) => {
			if (!timings) return fn();
			const t0 = performance.now();
			try {
				return await fn();
			} finally {
				timings.push({
					name,
					dur: performance.now() - t0,
					desc
				});
			}
		};
		const db = await phase("rt.db", "DB init + migrations", () => EmDashRuntime2.getDatabase(deps));
		const resolveDb = () => {
			return getRequestContext()?.db ?? db;
		};
		await phase("rt.secrets", "Validate encryption key", () => validateEncryptionKeyAtStartup());
		const storage = EmDashRuntime2.getStorage(deps);
		let pluginStates = /* @__PURE__ */ new Map();
		const configuredLocales = config_default?.i18n?.locales ?? getI18nConfig()?.locales ?? [];
		const localeCasingRepairVersion = getLocaleCasingRepairVersion(configuredLocales);
		let storedLocaleCasingRepairVersion;
		let siteInfo;
		let seedGate = {
			collectionCount: 1,
			setupDone: true
		};
		const reqCtx = getRequestContext();
		const ownsConfiguredDb = !!deps.config.database && !(reqCtx?.dbIsIsolated && reqCtx.db);
		let readDb = db;
		let readDbDisposable;
		if (ownsConfiguredDb && deps.createCoalescingDialect && deps.config.database) try {
			const dialect = deps.createCoalescingDialect(deps.config.database.config);
			if (dialect) {
				readDb = new Kysely({
					dialect,
					log: kyselyLogOption()
				});
				readDbDisposable = readDb;
			}
		} catch {
			readDb = db;
		}
		const optionsRepo = new OptionsRepository(readDb);
		const readSiteInfo = async () => {
			const siteOpts = await optionsRepo.getMany([
				"emdash:site_title",
				"emdash:site_url",
				"emdash:locale",
				LOCALE_CASING_REPAIR_OPTION
			]);
			storedLocaleCasingRepairVersion = siteOpts.get(LOCALE_CASING_REPAIR_OPTION);
			return {
				siteName: siteOpts.get("emdash:site_title") ?? void 0,
				siteUrl: siteOpts.get("emdash:site_url") ?? void 0,
				locale: siteOpts.get("emdash:locale") ?? void 0,
				trailingSlash: config_default?.trailingSlash
			};
		};
		const coldStartReads = [phase("rt.plugins", "Plugin states", async () => {
			try {
				const states = await readDb.selectFrom("_plugin_state").select(["plugin_id", "status"]).execute();
				pluginStates = new Map(states.map((s) => [s.plugin_id, s.status]));
			} catch {}
		}), phase("rt.site", "Site info options", async () => {
			try {
				siteInfo = await readSiteInfo();
			} catch {}
		})];
		if (ownsConfiguredDb) coldStartReads.push(phase("rt.seedcheck", "Auto-seed gate", async () => {
			try {
				const [collectionCount, setupOption] = await Promise.all([readDb.selectFrom("_emdash_collections").select((eb) => eb.fn.countAll().as("count")).executeTakeFirstOrThrow(), readDb.selectFrom("options").select("value").where("name", "=", "emdash:setup_complete").executeTakeFirst()]);
				const setupDone = (() => {
					try {
						return !!setupOption && JSON.parse(setupOption.value) === true;
					} catch {
						return false;
					}
				})();
				seedGate = {
					collectionCount: collectionCount.count,
					setupDone
				};
			} catch {}
		}));
		await Promise.all(coldStartReads);
		if (localeCasingRepairVersion && (configuredLocales.some((locale) => locale.includes("-") || locale !== locale.toLowerCase()) || storedLocaleCasingRepairVersion !== void 0) && storedLocaleCasingRepairVersion !== localeCasingRepairVersion) await phase("rt.locale", "Repair locale casing", async () => {
			await repairLocaleCasing(db, configuredLocales);
			await new OptionsRepository(db).set(LOCALE_CASING_REPAIR_OPTION, localeCasingRepairVersion);
		});
		if (seedGate.collectionCount === 0 && !seedGate.setupDone) {
			const seedKey = deps.config.database?.entrypoint ?? "default";
			const seedHolder = getSeedHolder();
			try {
				await initWithLock(seedHolder.lock, () => seedHolder.done.has(seedKey) ? true : void 0, async () => {
					const { applySeed } = await import("./apply-1_6ra7NP_CWtC2DUD.mjs").then((n) => n.n);
					const { loadSeed } = await import("./load-BwTdWE8B_C3T6EML7.mjs").then((n) => n.r);
					const { validateSeed } = await import("./validate-Bs_wT2ul_VP2gsRTl.mjs").then((n) => n.n);
					const seed = await loadSeed();
					if (validateSeed(seed).valid) {
						await applySeed(db, seed, { onConflict: "skip" });
						console.log("Auto-seeded default collections");
					}
					seedHolder.done.add(seedKey);
					return true;
				}, {
					deadlineMs: DB_INIT_DEADLINE_MS,
					anchor: (promise) => after(() => promise)
				});
				try {
					siteInfo = await readSiteInfo();
				} catch {}
			} catch {}
		}
		if (readDbDisposable) try {
			await readDbDisposable.destroy();
		} catch {}
		const enabledPlugins = /* @__PURE__ */ new Set();
		for (const plugin of deps.plugins) {
			const status = pluginStates.get(plugin.id);
			if (status === void 0 || status === "active") enabledPlugins.add(plugin.id);
		}
		const allPipelinePlugins = [...deps.plugins];
		const bypassedPluginsList = [];
		try {
			const defaultModeratorPlugin = definePlugin({
				id: DEFAULT_COMMENT_MODERATOR_PLUGIN_ID,
				version: "0.0.0",
				capabilities: ["users:read"],
				hooks: { "comment:moderate": {
					exclusive: true,
					handler: defaultCommentModerate
				} }
			});
			allPipelinePlugins.push(defaultModeratorPlugin);
			enabledPlugins.add(defaultModeratorPlugin.id);
		} catch (error) {
			console.warn("[comments] Failed to register default moderator:", error);
		}
		if (deps.sandboxBypassed && deps.sandboxedPluginEntries.length > 0) {
			if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string" && navigator.userAgent.includes("Cloudflare-Workers")) throw new Error("sandbox: false is not supported in Cloudflare Workers. Remove the sandbox: false option or use the Cloudflare sandbox runner.");
			console.info("EmDash: Sandbox disabled (sandbox: false). Sandboxed plugins will run in-process without isolation.");
			const bypassedPlugins = await EmDashRuntime2.loadBypassedPlugins(deps.sandboxedPluginEntries);
			for (const plugin of bypassedPlugins) {
				allPipelinePlugins.push(plugin);
				bypassedPluginsList.push(plugin);
				const status = pluginStates.get(plugin.id);
				if (status === void 0 || status === "active") enabledPlugins.add(plugin.id);
			}
		}
		if (deps.sandboxBypassed && deps.config.marketplace && storage) {
			const marketplaceBypassed = await EmDashRuntime2.loadMarketplacePluginsBypassed(db, storage);
			for (const plugin of marketplaceBypassed) {
				allPipelinePlugins.push(plugin);
				bypassedPluginsList.push(plugin);
				const status = pluginStates.get(plugin.id);
				if (status === void 0 || status === "active") enabledPlugins.add(plugin.id);
			}
		}
		const enabledPluginList = allPipelinePlugins.filter((p) => enabledPlugins.has(p.id));
		const pipelineFactoryOptions = {
			db,
			getDb: resolveDb,
			storage: storage ?? void 0,
			siteInfo
		};
		const pipeline = createHookPipeline(enabledPluginList, pipelineFactoryOptions);
		const sandboxedPlugins2 = await phase("rt.sandbox", "Sandboxed plugins", () => EmDashRuntime2.loadSandboxedPlugins(deps, db, storage, siteInfo));
		const installedTierPhases = [];
		if (deps.config.marketplace && storage && !deps.sandboxBypassed) installedTierPhases.push(phase("rt.market", "Marketplace plugins", () => EmDashRuntime2.loadInstalledSandboxedPlugins("marketplace", db, storage, deps, sandboxedPlugins2, siteInfo)));
		if (deps.config.experimental?.registry && storage) installedTierPhases.push(phase("rt.registry", "Registry plugins", () => EmDashRuntime2.loadInstalledSandboxedPlugins("registry", db, storage, deps, sandboxedPlugins2, siteInfo)));
		if (installedTierPhases.length > 0) await Promise.all(installedTierPhases);
		const mediaProviders2 = /* @__PURE__ */ new Map();
		const mediaProviderEntries = deps.mediaProviderEntries ?? [];
		const providerContext = {
			db,
			storage,
			getDb: resolveDb
		};
		for (const entry of mediaProviderEntries) try {
			const provider = entry.createProvider(providerContext);
			mediaProviders2.set(entry.id, provider);
		} catch (error) {
			console.warn(`Failed to initialize media provider "${entry.id}":`, error);
		}
		await phase("rt.hooks", "Exclusive hook resolution", () => EmDashRuntime2.resolveExclusiveHooks(pipeline, db, deps));
		const emailPipeline = new EmailPipeline(pipeline);
		if (sandboxRunner) sandboxRunner.setEmailSend((message, pluginId) => emailPipeline.send(message, pluginId));
		const pipelineRef = { current: pipeline };
		const invokeCronHook = async (pluginId, event) => {
			const result = await pipelineRef.current.invokeCronHook(pluginId, event);
			if (!result.success && result.error) throw result.error;
		};
		pipeline.setContextFactory({ emailPipeline });
		let cronExecutor = null;
		let cronScheduler = null;
		const runtimeRef = { current: null };
		await phase("rt.cron", "Cron init (recovery deferred post-response)", async () => {
			try {
				cronExecutor = new CronExecutor(resolveDb, invokeCronHook);
				pipeline.setContextFactory({ cronReschedule: () => cronScheduler?.reschedule() });
				const executorForRecovery = cronExecutor;
				after(async () => {
					try {
						const recovered = await executorForRecovery.recoverStaleLocks();
						if (recovered > 0) console.log(`[cron] Recovered ${recovered} stale task lock(s)`);
					} catch (error) {
						console.error("[cron] Failed to recover stale task locks:", error);
					}
				});
				if (deps.createScheduler) {
					const scheduler = deps.createScheduler(cronExecutor);
					cronScheduler = scheduler;
					scheduler.setSystemCleanup(async () => {
						try {
							const runtime2 = runtimeRef.current;
							await publishDueContent(db, { publish: runtime2 ? (collection, id, options) => runtime2.handleContentPublish(collection, id, options) : void 0 });
						} catch (error) {
							console.error("[scheduled-publish] Sweep failed:", error);
						}
						try {
							await runSystemCleanup(db, storage ?? void 0);
						} catch (error) {
							console.error("[cleanup] System cleanup failed:", error);
						}
						await maybeRunScheduledBackup(db, storage ?? void 0);
					});
					scheduler.start();
				}
			} catch (error) {
				console.warn("[cron] Failed to initialize cron system:", error);
			}
		});
		const runtime = new EmDashRuntime2({
			db,
			storage,
			configuredPlugins: [...deps.plugins, ...bypassedPluginsList],
			sandboxedPlugins: sandboxedPlugins2,
			sandboxedPluginEntries: deps.sandboxedPluginEntries,
			hooks: pipeline,
			enabledPlugins,
			pluginStates,
			config: deps.config,
			mediaProviders: mediaProviders2,
			mediaProviderEntries,
			cronExecutor,
			cronScheduler,
			emailPipeline,
			allPipelinePlugins,
			pipelineFactoryOptions,
			runtimeDeps: deps,
			pipelineRef
		});
		runtimeRef.current = runtime;
		return runtime;
	}
	/**
	* Get a media provider by ID
	*/
	getMediaProvider(providerId) {
		return this.mediaProviders.get(providerId);
	}
	/**
	* Get all media provider entries (for admin UI)
	*/
	getMediaProviderList() {
		return this.mediaProviderEntries.map((e) => ({
			id: e.id,
			name: e.name,
			icon: e.icon,
			capabilities: e.capabilities
		}));
	}
	/**
	* Get or create database instance
	*/
	static async getDatabase(deps) {
		const ctx = getRequestContext();
		if (ctx?.dbIsIsolated && ctx.db) return ctx.db;
		const dbConfig = deps.config.database;
		if (!dbConfig) try {
			return await getDb();
		} catch {
			throw new Error("EmDash database not configured. Either configure database in astro.config.mjs or use emdashLoader in live.config.ts");
		}
		const cacheKey = dbConfig.entrypoint;
		const holder = getDbHolder();
		const throwIfBackingOff = () => {
			const failure = holder.failures.get(cacheKey);
			if (!failure) return;
			if (Date.now() - failure.at < DB_INIT_FAILURE_BACKOFF_MS) throw new Error(`Database initialization is backing off after a recent migration failure: ${failure.message}`);
			holder.failures.delete(cacheKey);
		};
		throwIfBackingOff();
		return initWithLock(holder.lock, () => holder.cache.get(cacheKey), async (isCurrentClaim) => {
			throwIfBackingOff();
			const db = new Kysely({
				dialect: deps.createDialect(dbConfig.config),
				log: kyselyLogOption()
			});
			try {
				await runMigrations(db);
			} catch (error) {
				if (!(error instanceof ConcurrentMigrationTimeoutError)) holder.failures.set(cacheKey, {
					at: Date.now(),
					message: error instanceof Error ? error.message : String(error)
				});
				await db.destroy().catch(() => {});
				throw error;
			}
			holder.failures.delete(cacheKey);
			if (isCurrentClaim()) holder.cache.set(cacheKey, db);
			return db;
		}, {
			deadlineMs: DB_INIT_DEADLINE_MS,
			anchor: (promise) => after(() => promise)
		});
	}
	/**
	* Get or create storage instance
	*/
	static getStorage(deps) {
		const storageConfig = deps.config.storage;
		if (!storageConfig || !deps.createStorage) return null;
		const cacheKey = storageConfig.entrypoint;
		const cached = storageCache.get(cacheKey);
		if (cached) return cached;
		const storage = deps.createStorage(storageConfig.config);
		storageCache.set(cacheKey, storage);
		return storage;
	}
	/**
	* Load sandboxed plugin entries as trusted in-process plugins.
	* Used by the sandbox: false debugging escape hatch.
	*
	* Imports each plugin's bundled ESM code via a data URL, adapts it
	* with adaptSandboxEntry, and returns ResolvedPlugin objects ready
	* to be merged into the pipeline plugin list.
	*/
	static async loadBypassedPlugins(entries) {
		const { adaptSandboxEntry } = await import("./adapt-sandbox-entry_lGLRTEnk.mjs");
		const plugins2 = [];
		for (const entry of entries) try {
			const pluginModule = await import(`data:text/javascript;base64,${Buffer.from(entry.code).toString("base64")}`);
			const pluginDef = pluginModule.default ?? pluginModule;
			const adminPages = entry.adminPages?.map((p) => ({
				path: p.path,
				label: p.label ?? p.path,
				icon: p.icon
			}));
			const adminWidgets = entry.adminWidgets?.map((w) => {
				const size = w.size === "full" || w.size === "half" || w.size === "third" ? w.size : void 0;
				return {
					id: w.id,
					title: w.title,
					size
				};
			});
			const resolved = adaptSandboxEntry(pluginDef, {
				id: entry.id,
				version: entry.version,
				entrypoint: "",
				capabilities: entry.capabilities,
				allowedHosts: entry.allowedHosts,
				storage: entry.storage,
				adminPages,
				adminWidgets,
				settingsSchema: entry.settingsSchema,
				portableTextBlocks: entry.portableTextBlocks,
				fieldWidgets: entry.fieldWidgets
			});
			plugins2.push(resolved);
			console.log(`EmDash: Loaded plugin ${entry.id}:${entry.version} in-process (sandbox bypassed)`);
		} catch (error) {
			console.error(`EmDash: Failed to load sandboxed plugin ${entry.id} in-process:`, error);
		}
		return plugins2;
	}
	/**
	* Load sandboxed plugins using SandboxRunner
	*/
	static async loadSandboxedPlugins(deps, db, mediaStorage, siteInfo) {
		if (sandboxedPluginCache.size > 0) return sandboxedPluginCache;
		if (!deps.sandboxEnabled) return sandboxedPluginCache;
		if (!sandboxRunner && deps.createSandboxRunner) sandboxRunner = deps.createSandboxRunner(createSandboxRunnerOptions({
			db,
			mediaStorage: mediaStorage ? {
				upload: (opts) => mediaStorage.upload({
					key: opts.key,
					body: opts.body,
					contentType: opts.contentType
				}),
				delete: (key) => mediaStorage.delete(key)
			} : void 0
		}, siteInfo));
		if (!sandboxRunner) return sandboxedPluginCache;
		if (!sandboxRunner.isAvailable()) {
			console.warn("EmDash: Plugin sandbox is configured but not available on this platform. Sandboxed plugins will not be loaded. If using @emdash-cms/sandbox-workerd/sandbox, ensure workerd is installed.");
			return sandboxedPluginCache;
		}
		if (deps.sandboxedPluginEntries.length === 0) return sandboxedPluginCache;
		if (deps.sandboxBypassed) return sandboxedPluginCache;
		for (const entry of deps.sandboxedPluginEntries) {
			const pluginKey = `${entry.id}:${entry.version}`;
			if (sandboxedPluginCache.has(pluginKey)) continue;
			try {
				const manifest = {
					id: entry.id,
					version: entry.version,
					capabilities: entry.capabilities ?? [],
					allowedHosts: entry.allowedHosts ?? [],
					storage: entry.storage ?? {},
					hooks: [],
					routes: [],
					admin: {},
					mcp: entry.mcp
				};
				const plugin = await sandboxRunner.load(manifest, entry.code);
				sandboxedPluginCache.set(pluginKey, plugin);
				console.log(`EmDash: Loaded sandboxed plugin ${pluginKey} with capabilities: [${manifest.capabilities.join(", ")}]`);
			} catch (error) {
				console.error(`EmDash: Failed to load sandboxed plugin ${entry.id}:`, error);
			}
		}
		return sandboxedPluginCache;
	}
	/**
	* Cold-start: load marketplace-installed plugins from site-local R2 storage
	*
	* Queries _plugin_state for source='marketplace' rows, fetches each bundle
	* from R2, and loads via SandboxRunner.
	*/
	/**
	* Cold-start load of all active sandboxed plugins for one install
	* tier (marketplace or registry) from site-local R2.
	*
	* Mirrors {@link syncSandboxedSourcePlugins} but runs once at runtime
	* creation, before request traffic arrives; the sync method runs on
	* demand after install / update / uninstall handlers.
	*/
	static async loadInstalledSandboxedPlugins(source, db, storage, deps, cache, siteInfo) {
		if (!sandboxRunner && deps.createSandboxRunner) sandboxRunner = deps.createSandboxRunner(createSandboxRunnerOptions({
			db,
			mediaStorage: {
				upload: (opts) => storage.upload({
					key: opts.key,
					body: opts.body,
					contentType: opts.contentType
				}),
				delete: (key) => storage.delete(key)
			}
		}, siteInfo));
		if (deps.sandboxBypassed) return;
		if (!sandboxRunner || !sandboxRunner.isAvailable()) return;
		const keySet = source === "marketplace" ? marketplacePluginKeys : registryPluginKeys;
		try {
			const stateRepo = new PluginStateRepository(db);
			const plugins2 = source === "marketplace" ? await stateRepo.getMarketplacePlugins() : await stateRepo.getRegistryPlugins();
			for (const plugin of plugins2) {
				if (plugin.status !== "active") continue;
				const version = source === "marketplace" ? plugin.marketplaceVersion ?? plugin.version : plugin.version;
				const pluginKey = `${plugin.pluginId}:${version}`;
				if (cache.has(pluginKey)) continue;
				try {
					const bundle = await loadBundleFromR2(storage, plugin.pluginId, version, source);
					if (!bundle) {
						console.warn(`EmDash: ${source} plugin ${plugin.pluginId}@${version} not found in R2`);
						continue;
					}
					const loaded = await sandboxRunner.load(bundle.manifest, bundle.backendCode);
					cache.set(pluginKey, loaded);
					keySet.add(pluginKey);
					marketplaceManifestCache.set(plugin.pluginId, {
						id: bundle.manifest.id,
						version: bundle.manifest.version,
						admin: bundle.manifest.admin,
						mcp: bundle.manifest.mcp
					});
					if (bundle.manifest.routes.length > 0) {
						const routeMeta = /* @__PURE__ */ new Map();
						for (const entry of bundle.manifest.routes) {
							const normalized = normalizeManifestRoute(entry);
							routeMeta.set(normalized.name, buildRouteMeta(normalized));
						}
						sandboxedRouteMetaCache.set(plugin.pluginId, routeMeta);
					}
					console.log(`EmDash: Loaded ${source} plugin ${pluginKey} with capabilities: [${bundle.manifest.capabilities.join(", ")}]`);
				} catch (error) {
					console.error(`EmDash: Failed to load ${source} plugin ${plugin.pluginId}:`, error);
				}
			}
		} catch {}
	}
	/**
	* Cold-start: load marketplace plugins in bypass mode (sandbox: false).
	*
	* Each active marketplace bundle is read, evaluated via data URL, adapted
	* with adaptSandboxEntry, and returned as a ResolvedPlugin. The caller is
	* responsible for merging these into allPipelinePlugins / configuredPlugins
	* BEFORE the hook pipeline is created, so hooks and routes register in
	* the trusted pipeline.
	*
	* Also caches manifest and route metadata so admin UI / getManifest() work.
	*
	* Returns ResolvedPlugins to be merged into the pipeline.
	*/
	static async loadMarketplacePluginsBypassed(db, storage) {
		const resolved = [];
		try {
			const marketplacePlugins = await new PluginStateRepository(db).getMarketplacePlugins();
			if (marketplacePlugins.length === 0) return resolved;
			console.info("EmDash: Sandbox disabled (sandbox: false). Marketplace plugins will run in-process without isolation.");
			const { adaptSandboxEntry } = await import("./adapt-sandbox-entry_lGLRTEnk.mjs");
			for (const plugin of marketplacePlugins) {
				if (plugin.status !== "active") continue;
				const version = plugin.marketplaceVersion ?? plugin.version;
				try {
					const bundle = await loadBundleFromR2(storage, plugin.pluginId, version);
					if (!bundle) {
						console.warn(`EmDash: Marketplace plugin ${plugin.pluginId}@${version} not found in R2`);
						continue;
					}
					marketplaceManifestCache.set(plugin.pluginId, {
						id: bundle.manifest.id,
						version: bundle.manifest.version,
						admin: bundle.manifest.admin,
						mcp: bundle.manifest.mcp
					});
					if (bundle.manifest.routes.length > 0) {
						const routeMeta = /* @__PURE__ */ new Map();
						for (const entry of bundle.manifest.routes) {
							const normalized = normalizeManifestRoute(entry);
							routeMeta.set(normalized.name, buildRouteMeta(normalized));
						}
						sandboxedRouteMetaCache.set(plugin.pluginId, routeMeta);
					}
					const pluginModule = await import(`data:text/javascript;base64,${Buffer.from(bundle.backendCode).toString("base64")}`);
					const adapted = adaptSandboxEntry(pluginModule.default ?? pluginModule, {
						id: bundle.manifest.id,
						version: bundle.manifest.version,
						entrypoint: "",
						capabilities: bundle.manifest.capabilities ?? [],
						allowedHosts: bundle.manifest.allowedHosts ?? [],
						storage: bundle.manifest.storage ?? {},
						adminPages: bundle.manifest.admin?.pages,
						adminWidgets: bundle.manifest.admin?.widgets?.map((w) => ({
							id: w.id,
							title: w.title,
							size: w.size === "full" || w.size === "half" || w.size === "third" ? w.size : void 0
						})),
						settingsSchema: bundle.manifest.admin?.settingsSchema
					});
					resolved.push(adapted);
					console.log(`EmDash: Loaded marketplace plugin ${plugin.pluginId}@${version} in-process (sandbox bypassed)`);
				} catch (error) {
					console.error(`EmDash: Failed to load marketplace plugin ${plugin.pluginId} in-process:`, error);
				}
			}
		} catch {}
		return resolved;
	}
	/**
	* Resolve exclusive hook selections on startup.
	*
	* Delegates to the shared resolveExclusiveHooks() in hooks.ts.
	* The runtime version considers all pipeline providers as "active" since
	* the pipeline was already built from only active/enabled plugins.
	*/
	static async resolveExclusiveHooks(pipeline, db, deps) {
		if (pipeline.getRegisteredExclusiveHooks().length === 0) return;
		let optionsRepo;
		try {
			optionsRepo = new OptionsRepository(db);
		} catch {
			return;
		}
		const preferredHints = /* @__PURE__ */ new Map();
		for (const entry of deps.sandboxedPluginEntries) if (entry.preferred && entry.preferred.length > 0) preferredHints.set(entry.id, entry.preferred);
		await resolveExclusiveHooks({
			pipeline,
			isActive: () => true,
			getOption: (key) => optionsRepo.get(key),
			getOptions: (keys) => optionsRepo.getMany(keys),
			setOption: (key, value) => optionsRepo.set(key, value),
			deleteOption: async (key) => {
				await optionsRepo.delete(key);
			},
			preferredHints
		});
	}
	/**
	* Build the admin manifest from the live database.
	*
	* Used by the admin UI (sidebar collections, content editor field
	* dispatch, manifest endpoint) and by WordPress import — it's never
	* read on a public request, so this isn't on any anonymous hot path.
	*
	* No cross-request cache. The previous worker-isolate cache produced
	* a class of cross-isolate staleness bugs (#776, #873, #876, #877)
	* because Cloudflare Workers keeps multiple warm isolates per region
	* and there's no fan-out primitive to invalidate them in step. The
	* cache existed to amortize an N+1 schema query pattern; now that
	* `listCollectionsWithFields()` does the same work in two queries,
	* the rebuild is fast enough to pay on every admin request.
	*
	* Within a single request, `requestCached` deduplicates concurrent
	* callers (the manifest endpoint and an admin SSR template, say).
	*/
	getManifest() {
		return requestCached("emdash:manifest", () => this._buildManifest());
	}
	/**
	* Build the manifest from the database.
	*
	* Constant query shapes via `listCollectionsWithFields()` — one query
	* for collections, one batched query for fields (chunked at
	* `SQL_BATCH_SIZE` collection IDs to stay under D1's bound-parameter
	* limit). Typical sites stay well under the chunk threshold, so this
	* is two queries in practice; never N+1.
	*/
	async _buildManifest() {
		const manifestCollections = {};
		try {
			const dbCollections = await new SchemaRegistry(this.db).listCollectionsWithFields();
			for (const collection of dbCollections) {
				const fields = {};
				for (const field of collection.fields) {
					const entry = {
						kind: FIELD_TYPE_TO_KIND[field.type] ?? "string",
						label: field.label,
						required: field.required
					};
					entry.id = field.id;
					if (field.widget) entry.widget = field.widget;
					if (field.options) entry.options = field.options;
					if (field.validation?.options) entry.options = field.validation.options.map((v) => ({
						value: v,
						label: v.charAt(0).toUpperCase() + v.slice(1)
					}));
					if ((field.type === "repeater" || field.type === "file" || field.type === "image") && field.validation) entry.validation = { ...field.validation };
					fields[field.slug] = entry;
				}
				manifestCollections[collection.slug] = {
					label: collection.label,
					labelSingular: collection.labelSingular || collection.label,
					supports: collection.supports || [],
					hasSeo: collection.hasSeo,
					urlPattern: collection.urlPattern,
					fields
				};
			}
		} catch (error) {
			console.debug("EmDash: Could not load database collections:", error);
		}
		const manifestPlugins = {};
		for (const plugin of this.configuredPlugins) {
			const status = this.pluginStates.get(plugin.id);
			const enabled = status === void 0 || status === "active";
			const hasAdminEntry = !!plugin.admin?.entry;
			const hasAdminPages = (plugin.admin?.pages?.length ?? 0) > 0;
			const hasWidgets = (plugin.admin?.widgets?.length ?? 0) > 0;
			let adminMode = "none";
			if (hasAdminEntry) adminMode = "react";
			else if (hasAdminPages || hasWidgets) adminMode = "blocks";
			manifestPlugins[plugin.id] = {
				version: plugin.version,
				enabled,
				adminMode,
				adminPages: plugin.admin?.pages ?? [],
				dashboardWidgets: plugin.admin?.widgets ?? [],
				portableTextBlocks: plugin.admin?.portableTextBlocks,
				fieldWidgets: plugin.admin?.fieldWidgets
			};
		}
		for (const entry of this.sandboxedPluginEntries) {
			const status = this.pluginStates.get(entry.id);
			const enabled = status === void 0 || status === "active";
			const hasAdminPages = (entry.adminPages?.length ?? 0) > 0;
			const hasWidgets = (entry.adminWidgets?.length ?? 0) > 0;
			manifestPlugins[entry.id] = {
				version: entry.version,
				enabled,
				sandboxed: true,
				adminMode: hasAdminPages || hasWidgets ? "blocks" : "none",
				adminPages: entry.adminPages ?? [],
				dashboardWidgets: entry.adminWidgets ?? [],
				portableTextBlocks: entry.portableTextBlocks,
				fieldWidgets: entry.fieldWidgets
			};
		}
		for (const [pluginId, meta] of marketplaceManifestCache) {
			if (manifestPlugins[pluginId]) continue;
			const enabled = this.pluginStates.get(pluginId) === "active";
			const pages = meta.admin?.pages;
			const widgets = meta.admin?.widgets;
			const hasAdminPages = (pages?.length ?? 0) > 0;
			const hasWidgets = (widgets?.length ?? 0) > 0;
			manifestPlugins[pluginId] = {
				version: meta.version,
				enabled,
				sandboxed: true,
				adminMode: hasAdminPages || hasWidgets ? "blocks" : "none",
				adminPages: pages ?? [],
				dashboardWidgets: widgets ?? []
			};
		}
		let manifestTaxonomies = [];
		try {
			manifestTaxonomies = (await this.db.selectFrom("_emdash_taxonomy_defs").selectAll().orderBy("name").execute()).map((row) => ({
				name: row.name,
				label: row.label,
				labelSingular: row.label_singular ?? void 0,
				hierarchical: row.hierarchical === 1,
				collections: parseStringArray(row.collections).toSorted()
			}));
		} catch (error) {
			console.debug("EmDash: Could not load taxonomy definitions:", error);
		}
		const manifestHash = await hashString(JSON.stringify(manifestCollections) + JSON.stringify(manifestPlugins) + JSON.stringify(manifestTaxonomies));
		const authMode = getAuthMode(this.config);
		const authModeValue = authMode.type === "external" ? authMode.providerType : "passkey";
		const i18nConfig = config_default?.i18n;
		const i18n = i18nConfig && i18nConfig.locales && i18nConfig.locales.length > 1 ? {
			defaultLocale: i18nConfig.defaultLocale,
			locales: i18nConfig.locales
		} : void 0;
		const registry = normalizeRegistryConfig(this.config.experimental?.registry) ?? void 0;
		return {
			version: VERSION,
			commit: COMMIT,
			astroVersion: this.config.astroVersion,
			hash: manifestHash,
			collections: manifestCollections,
			plugins: manifestPlugins,
			taxonomies: manifestTaxonomies,
			authMode: authModeValue,
			i18n,
			marketplace: !!this.config.marketplace,
			registry
		};
	}
	/**
	* Verify and repair FTS indexes on demand. Runs at most once per worker
	* lifetime.
	*
	* Originally called from `EmDashRuntime.create()`, but on a busy D1 link
	* (e.g. SIN replica ~80-150ms per query) it added ~1.5s to every cold
	* start for a modest-sized site — more than every other init phase
	* combined. Anonymous public reads never touch the search write path,
	* so the cost isn't paid back for the vast majority of requests.
	*
	* Instead, search endpoints call this lazily: the first request that
	* actually needs the index pays the verify cost (usually fast — no
	* rebuild needed), everyone else runs cold-free.
	*
	* Uses the runtime's singleton database (`this._db`) rather than the
	* request-scoped DB. Verify reads only, but `rebuildIndex` writes, and
	* a GET search request on D1 carries a `first-unconstrained` session
	* that's free to route at a read replica — unsafe for writes. The
	* singleton always goes through the default binding, which the D1
	* adapter will promote to `first-primary` for write statements.
	*
	* Safe to call concurrently: repeated callers share the same in-flight
	* promise. Errors are swallowed internally so callers don't need to
	* defend against FTS not existing yet (pre-setup).
	*/
	async ensureSearchHealthy() {
		if (!isSqlite(this._db)) return;
		try {
			await singleFlightCached(this._searchHealthCache, async () => {
				try {
					const repaired = await new FTSManager(this._db).verifyAndRepairAll();
					if (repaired > 0) console.log(`Repaired ${repaired} corrupted FTS index(es)`);
				} catch {}
			}, {
				anchor: (promise) => after(() => promise),
				ownerTimeoutMs: 3e4
			});
		} catch {}
	}
	async handleContentList(collection, params) {
		return handleContentList(this.db, collection, params);
	}
	async handleContentAuthors(collection) {
		return handleContentAuthors(this.db, collection);
	}
	async handleContentGet(collection, id, locale) {
		const result = await handleContentGet(this.db, collection, id, locale);
		return this.hydrateDraftData(result);
	}
	async handleContentGetIncludingTrashed(collection, id, locale) {
		const result = await handleContentGetIncludingTrashed(this.db, collection, id, locale);
		return this.hydrateDraftData(result);
	}
	/**
	* If the response item has a `draftRevisionId`, replace `item.data` with
	* the draft revision's data and expose the original published values as
	* `liveData`. This makes the content_get / content_update round-trip
	* intuitive — read returns the latest content the caller has saved
	* (their pending draft), with the previously-published values still
	* accessible for compare-style flows.
	*
	* No-op when no draft exists or the response is an error.
	*/
	async hydrateDraftData(result) {
		if (!result || typeof result !== "object") return result;
		const r = result;
		if (!r.success || !r.data?.item) return result;
		const item = r.data.item;
		const draftRevisionId = typeof item.draftRevisionId === "string" ? item.draftRevisionId : null;
		if (!draftRevisionId) return result;
		try {
			const revision = await new RevisionRepository(this.db).findById(draftRevisionId);
			if (!revision) return result;
			const liveData = item.data && typeof item.data === "object" ? item.data : {};
			const revisionData = {};
			for (const [key, value] of Object.entries(revision.data)) if (!key.startsWith("_")) revisionData[key] = value;
			const mergedData = {
				...liveData,
				...revisionData
			};
			return {
				...result,
				data: {
					...r.data,
					item: {
						...item,
						data: mergedData,
						liveData
					}
				}
			};
		} catch (error) {
			console.error("[emdash] draft hydration failed:", error);
			return result;
		}
	}
	async handleContentCreate(collection, body) {
		let processedData = body.data;
		if (this.hooks.hasHooks("content:beforeSave")) processedData = (await this.hooks.runContentBeforeSave(body.data, collection, true)).content;
		processedData = await this.runSandboxedBeforeSave(processedData, collection, true);
		processedData = await this.normalizeMediaFields(collection, processedData);
		const { validateContentData } = await import("./validation-BngR0nit_BWn_kl-b.mjs");
		const validation = await validateContentData(this.db, collection, processedData, { partial: false });
		if (!validation.ok) return {
			success: false,
			error: validation.error
		};
		const result = await handleContentCreate(this.db, collection, {
			...body,
			data: processedData,
			authorId: body.authorId,
			bylines: body.bylines
		});
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		if (result.success && result.data) this.runAfterSaveHooks(contentItemToRecord(result.data.item), collection, true);
		return result;
	}
	async handleContentUpdate(collection, id, body) {
		const { ContentRepository: ContentRepository2 } = await import("./content-CpfKV9QE_DOA8LvVw.mjs").then((n) => n.n);
		const repo = new ContentRepository2(this.db);
		const resolvedItem = await repo.findByIdOrSlug(collection, id, body.locale);
		const resolvedId = resolvedItem?.id ?? id;
		if (body._rev) {
			if (!resolvedItem) return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `Content item not found: ${id}`
				}
			};
			const revCheck = validateRev(body._rev, resolvedItem);
			if (!revCheck.valid) return {
				success: false,
				error: {
					code: "CONFLICT",
					message: revCheck.message
				}
			};
		}
		const { _rev: _discardedRev, ...bodyWithoutRev } = body;
		let processedData = bodyWithoutRev.data;
		if (bodyWithoutRev.data) {
			if (this.hooks.hasHooks("content:beforeSave")) processedData = (await this.hooks.runContentBeforeSave(bodyWithoutRev.data, collection, false)).content;
			processedData = await this.runSandboxedBeforeSave(processedData, collection, false);
			processedData = await this.normalizeMediaFields(collection, processedData);
			const { validateContentData } = await import("./validation-BngR0nit_BWn_kl-b.mjs");
			const validation = await validateContentData(this.db, collection, processedData, { partial: true });
			if (!validation.ok) return {
				success: false,
				error: validation.error
			};
		}
		let usesDraftRevisions = false;
		let draftStorageChanged = false;
		if (processedData) try {
			if ((await this.schemaRegistry.getCollectionWithFields(collection))?.supports?.includes("revisions")) {
				usesDraftRevisions = true;
				const revisionRepo = new RevisionRepository(this.db);
				const existing = await repo.findById(collection, resolvedId);
				if (existing) {
					let baseData;
					if (existing.draftRevisionId) baseData = (await revisionRepo.findById(existing.draftRevisionId))?.data ?? existing.data;
					else baseData = existing.data;
					const mergedData = {
						...baseData,
						...processedData
					};
					if (bodyWithoutRev.slug !== void 0) mergedData._slug = bodyWithoutRev.slug;
					if (bodyWithoutRev.skipRevision && existing.draftRevisionId) {
						await revisionRepo.updateData(existing.draftRevisionId, mergedData);
						draftStorageChanged = true;
					} else {
						const revision = await revisionRepo.create({
							collection,
							entryId: resolvedId,
							data: mergedData,
							authorId: bodyWithoutRev.authorId ?? void 0
						});
						validateIdentifier(collection, "collection");
						const tableName = `ec_${collection}`;
						await sql`
								UPDATE ${sql.ref(tableName)}
								SET draft_revision_id = ${revision.id}
								WHERE id = ${resolvedId}
							`.execute(this.db);
						draftStorageChanged = true;
						revisionRepo.pruneOldRevisions(collection, resolvedId, 50).catch(() => {});
					}
				}
			}
		} catch {}
		const result = await handleContentUpdate(this.db, collection, resolvedId, {
			...bodyWithoutRev,
			data: usesDraftRevisions ? void 0 : processedData,
			slug: usesDraftRevisions ? void 0 : bodyWithoutRev.slug,
			authorId: bodyWithoutRev.authorId,
			bylines: bodyWithoutRev.bylines
		});
		const liveMetaTouched = Object.entries(bodyWithoutRev).some(([key, value]) => value !== void 0 && !DRAFT_ONLY_UPDATE_KEYS.has(key));
		const liveContentChanged = usesDraftRevisions ? liveMetaTouched : Boolean(processedData || bodyWithoutRev.slug !== void 0 || liveMetaTouched);
		const hydrated = await this.hydrateDraftData(result);
		if (hydrated.success && hydrated.data) {
			const contentIdsToRefresh = [resolvedId];
			if (!usesDraftRevisions && processedData) try {
				contentIdsToRefresh.push(...await findNonTranslatableSiblingContentIds(this.db, collection, resolvedId, hydrated.data.item.translationGroup, processedData));
			} catch (error) {
				console.error(`[media-usage] Failed to discover synced i18n siblings for ${collection}/${resolvedId}:`, error);
				try {
					await markContentMediaUsageCollectionStale(this.db, collection, "CONTENT_USAGE_REFRESH_ERROR");
				} catch (staleError) {
					console.error(`[media-usage] Failed to mark ${collection} stale:`, staleError);
				}
			}
			await this.refreshContentUsageAfterSuccessfulWrite(collection, contentIdsToRefresh);
		} else if (draftStorageChanged) try {
			await markContentMediaUsageCollectionStale(this.db, collection, "CONTENT_USAGE_STALE");
		} catch (error) {
			console.error(`[media-usage] Failed to mark ${collection} stale:`, error);
		}
		if (hydrated.success && hydrated.data) this.runAfterSaveHooks(contentItemToRecord(hydrated.data.item), collection, false);
		if (hydrated.success) return {
			...hydrated,
			liveContentChanged
		};
		return hydrated;
	}
	async handleContentDelete(collection, id) {
		if (this.hooks.hasHooks("content:beforeDelete")) {
			const { allowed } = await this.hooks.runContentBeforeDelete(id, collection);
			if (!allowed) return {
				success: false,
				error: {
					code: "DELETE_BLOCKED",
					message: "Delete blocked by plugin hook"
				}
			};
		}
		if (!await this.runSandboxedBeforeDelete(id, collection)) return {
			success: false,
			error: {
				code: "DELETE_BLOCKED",
				message: "Delete blocked by sandboxed plugin hook"
			}
		};
		const result = await handleContentDelete(this.db, collection, id);
		if (result.success) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.id]);
		if (result.success) this.runAfterDeleteHooks(id, collection, false);
		return result;
	}
	async handleContentListTrashed(collection, params = {}) {
		return handleContentListTrashed(this.db, collection, params);
	}
	async handleContentRestore(collection, id) {
		const result = await handleContentRestore(this.db, collection, id);
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		if (result.success) this.runAfterRestoreHooks(contentItemToRecord(result.data.item), collection);
		return result;
	}
	async handleContentPermanentDelete(collection, id) {
		const result = await handleContentPermanentDelete(this.db, collection, id);
		if (result.success) await this.deleteContentUsageAfterSuccessfulPermanentDelete(collection, result.data.id);
		if (result.success) this.runAfterDeleteHooks(id, collection, true);
		return result;
	}
	async handleContentCountTrashed(collection) {
		return handleContentCountTrashed(this.db, collection);
	}
	async handleContentDuplicate(collection, id, authorId) {
		const result = await handleContentDuplicate(this.db, collection, id, authorId);
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		return result;
	}
	async handleContentPublish(collection, id, options = {}) {
		const result = await handleContentPublish(this.db, collection, id, options);
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		if (result.success && result.data) this.runAfterPublishHooks(contentItemToRecord(result.data.item), collection);
		return result;
	}
	async handleContentUnpublish(collection, id) {
		const result = await handleContentUnpublish(this.db, collection, id);
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		if (result.success && result.data) this.runAfterUnpublishHooks(contentItemToRecord(result.data.item), collection);
		return result;
	}
	async handleContentSchedule(collection, id, scheduledAt) {
		const result = await handleContentSchedule(this.db, collection, id, scheduledAt);
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		if (result.success && result.data) this.runAfterScheduleHooks(contentItemToRecord(result.data.item), collection);
		return result;
	}
	async handleContentUnschedule(collection, id) {
		const result = await handleContentUnschedule(this.db, collection, id);
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		if (result.success && result.data) this.runAfterUnscheduleHooks(contentItemToRecord(result.data.item), collection);
		return result;
	}
	async handleContentCountScheduled(collection) {
		return handleContentCountScheduled(this.db, collection);
	}
	async handleContentDiscardDraft(collection, id) {
		const result = await handleContentDiscardDraft(this.db, collection, id);
		if (result.success && result.data) await this.refreshContentUsageAfterSuccessfulWrite(collection, [result.data.item.id]);
		return result;
	}
	async handleContentCompare(collection, id) {
		return handleContentCompare(this.db, collection, id);
	}
	async handleContentTranslations(collection, id) {
		return handleContentTranslations(this.db, collection, id);
	}
	async handleMediaList(params) {
		return handleMediaList(this.db, params);
	}
	async handleMediaGet(id) {
		return handleMediaGet(this.db, id);
	}
	async handleMediaCreate(input) {
		let processedInput = input;
		if (this.hooks.hasHooks("media:beforeUpload")) {
			const hookResult = await this.hooks.runMediaBeforeUpload({
				name: input.filename,
				type: input.mimeType,
				size: input.size || 0
			});
			processedInput = {
				...input,
				filename: hookResult.file.name,
				mimeType: hookResult.file.type,
				size: hookResult.file.size
			};
		}
		const result = await handleMediaCreate(this.db, processedInput);
		if (result.success && this.hooks.hasHooks("media:afterUpload")) {
			const item = result.data.item;
			const mediaItem = {
				id: item.id,
				filename: item.filename,
				mimeType: item.mimeType,
				size: item.size,
				url: `/media/${item.id}/${item.filename}`,
				createdAt: item.createdAt
			};
			this.hooks.runMediaAfterUpload(mediaItem).catch((err) => console.error("EmDash afterUpload hook error:", err));
		}
		return result;
	}
	async handleMediaUpdate(id, input) {
		const result = await handleMediaUpdate(this.db, id, input);
		if (result.success) invalidateSiteSettingsCache();
		return result;
	}
	async handleMediaDelete(id) {
		const result = await handleMediaDelete(this.db, id);
		if (result.success) invalidateSiteSettingsCache();
		return result;
	}
	async handleRevisionList(collection, entryId, params = {}) {
		return handleRevisionList(this.db, collection, entryId, params);
	}
	async handleRevisionGet(revisionId) {
		return handleRevisionGet(this.db, revisionId);
	}
	async handleRevisionRestore(revisionId, callerUserId) {
		const revisionRepo = new RevisionRepository(this.db);
		const revision = await revisionRepo.findById(revisionId);
		if (!revision) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Revision not found: ${revisionId}`
			}
		};
		if (!((await this.schemaRegistry.getCollectionWithFields(revision.collection))?.supports?.includes("revisions") ?? false)) {
			const result = await handleRevisionRestore(this.db, revisionId, callerUserId);
			if (result.success) await this.refreshContentUsageAfterSuccessfulWrite(revision.collection, [revision.entryId]);
			return this.hydrateDraftData(result);
		}
		try {
			const newDraft = await revisionRepo.create({
				collection: revision.collection,
				entryId: revision.entryId,
				data: revision.data,
				authorId: callerUserId
			});
			validateIdentifier(revision.collection, "collection");
			const tableName = `ec_${revision.collection}`;
			await sql`
				UPDATE ${sql.ref(tableName)}
				SET draft_revision_id = ${newDraft.id}
				WHERE id = ${revision.entryId}
			`.execute(this.db);
			revisionRepo.pruneOldRevisions(revision.collection, revision.entryId, 50).catch(() => {});
			const refetched = await handleContentGet(this.db, revision.collection, revision.entryId);
			const hydrated = await this.hydrateDraftData(refetched);
			if (hydrated.success) await this.refreshContentUsageAfterSuccessfulWrite(revision.collection, [revision.entryId]);
			return hydrated;
		} catch (error) {
			console.error("[emdash] revision restore failed:", error);
			return {
				success: false,
				error: {
					code: "REVISION_RESTORE_ERROR",
					message: "Failed to restore revision"
				}
			};
		}
	}
	async refreshContentUsageAfterSuccessfulWrite(collection, contentIds) {
		for (const contentId of new Set(contentIds)) try {
			await refreshContentMediaUsageAfterWrite(this.db, collection, contentId);
		} catch (error) {
			console.error(`[media-usage] Failed after content write ${collection}/${contentId}:`, error);
		}
	}
	async deleteContentUsageAfterSuccessfulPermanentDelete(collection, contentId) {
		try {
			const result = await deleteContentMediaUsage(this.db, collection, contentId);
			if (!result.success) console.error(`[media-usage] Usage delete for ${collection}/${contentId} finished with ${result.errorCode}`);
		} catch (error) {
			console.error(`[media-usage] Failed after permanent content delete ${collection}/${contentId}:`, error);
		}
	}
	/**
	* Get route metadata for a plugin route without invoking the handler.
	* Used by the catch-all route to decide auth before dispatch.
	* Returns null if the plugin or route doesn't exist.
	*/
	getPluginRouteMeta(pluginId, path) {
		if (!this.isPluginEnabled(pluginId)) return null;
		const routeKey = path.replace(LEADING_SLASH_PATTERN, "");
		const trustedPlugin = this.configuredPlugins.find((p) => p.id === pluginId);
		if (trustedPlugin) {
			const route = trustedPlugin.routes[routeKey];
			if (!route) return null;
			return buildRouteMeta(route);
		}
		const meta = sandboxedRouteMetaCache.get(pluginId);
		if (meta) {
			const routeMeta = meta.get(routeKey);
			if (routeMeta) return routeMeta;
		}
		if (routeKey === "admin") {
			const manifestMeta = marketplaceManifestCache.get(pluginId);
			if (manifestMeta?.admin?.pages?.length || manifestMeta?.admin?.widgets?.length) return { public: false };
			const entry = this.sandboxedPluginEntries.find((e) => e.id === pluginId);
			if (entry?.adminPages?.length || entry?.adminWidgets?.length) return { public: false };
		}
		if (this.findSandboxedPlugin(pluginId)) return { public: false };
		return null;
	}
	/**
	* Resolve the settings schema for a runtime-installed (marketplace or
	* registry) plugin from its cached manifest. Returns `{}` for a known
	* plugin without a schema and `null` for unknown plugins, matching the
	* contract of `getPluginSettingsSchema` for build-time plugins.
	*/
	getRuntimePluginSettingsSchema(pluginId) {
		const meta = marketplaceManifestCache.get(pluginId);
		if (!meta) return null;
		return meta.admin?.settingsSchema ?? {};
	}
	async handlePluginApiRoute(pluginId, _method, path, request) {
		if (!this.isPluginEnabled(pluginId)) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Plugin not enabled: ${pluginId}`
			}
		};
		const trustedPlugin = this.configuredPlugins.find((p) => p.id === pluginId);
		if (trustedPlugin && this.enabledPlugins.has(trustedPlugin.id)) {
			const routeRegistry = new PluginRouteRegistry({
				...this.pipelineFactoryOptions,
				emailPipeline: this.email ?? void 0,
				cronReschedule: () => this.cronScheduler?.reschedule(),
				trustedProxyHeaders: getTrustedProxyHeaders(this.config)
			});
			routeRegistry.register(trustedPlugin);
			const routeKey = path.replace(LEADING_SLASH_PATTERN, "");
			let body = void 0;
			try {
				body = await request.json();
			} catch {}
			return routeRegistry.invoke(pluginId, routeKey, {
				request,
				body
			});
		}
		const sandboxedPlugin = this.findSandboxedPlugin(pluginId);
		if (sandboxedPlugin) return this.handleSandboxedRoute(sandboxedPlugin, path, request);
		return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Plugin not found: ${pluginId}`
			}
		};
	}
	async getPluginMcpTools(pluginId) {
		const tools = [];
		const seen = /* @__PURE__ */ new Set();
		for (const plugin of this.configuredPlugins) {
			if (pluginId && plugin.id !== pluginId) continue;
			for (const [name, tool] of Object.entries(plugin.mcp?.tools ?? {})) {
				const route = plugin.routes[tool.route];
				if (!route || route.public || !route.permission || !(route.permission in Permissions)) continue;
				const key = `${plugin.id}__${name}`;
				if (seen.has(key)) continue;
				seen.add(key);
				tools.push({
					pluginId: plugin.id,
					name,
					description: tool.description,
					route: tool.route,
					permission: route.permission,
					destructive: tool.destructive ?? false,
					inputSchema: tool.input,
					outputSchema: tool.output
				});
			}
		}
		const addManifestTools = (id, mcp) => {
			if (pluginId && id !== pluginId) return;
			for (const tool of mcp?.tools ?? []) {
				const key = `${id}__${tool.name}`;
				const routeMeta = this.getPluginRouteMeta(id, tool.route);
				if (seen.has(key) || !routeMeta || routeMeta.public || routeMeta.permission !== tool.permission || !(tool.permission in Permissions)) continue;
				seen.add(key);
				tools.push({
					pluginId: id,
					name: tool.name,
					description: tool.description,
					route: tool.route,
					permission: tool.permission,
					destructive: tool.destructive,
					inputSchema: fromJSONSchema({ ...tool.inputSchema }),
					outputSchema: tool.outputSchema ? fromJSONSchema({ ...tool.outputSchema }) : void 0
				});
			}
		};
		for (const entry of this.sandboxedPluginEntries) addManifestTools(entry.id, entry.mcp);
		for (const [id, manifest] of marketplaceManifestCache) addManifestTools(id, manifest.mcp);
		return tools;
	}
	async getEnabledPluginMcpTools() {
		const [tools, states] = await Promise.all([this.getPluginMcpTools(), new PluginStateRepository(this.db).getAll()]);
		const stateByPlugin = new Map(states.map((state) => [state.pluginId, state]));
		return tools.filter((tool) => {
			const state = stateByPlugin.get(tool.pluginId);
			if (!state?.mcpToolsEnabled || state.status !== "active" || !this.isPluginEnabled(tool.pluginId)) return false;
			return state.mcpToolsConsent === this.serializePluginMcpConsent(tools, tool.pluginId);
		});
	}
	serializePluginMcpConsent(tools, pluginId) {
		return JSON.stringify(tools.filter((tool) => tool.pluginId === pluginId).map((tool) => ({
			name: tool.name,
			description: tool.description,
			route: tool.route,
			permission: tool.permission,
			destructive: tool.destructive,
			inputSchema: toJSONSchema(tool.inputSchema, { target: "draft-7" }),
			...tool.outputSchema ? { outputSchema: toJSONSchema(tool.outputSchema, { target: "draft-7" }) } : {}
		})).toSorted((a, b) => a.name.localeCompare(b.name)));
	}
	async handlePluginMcpTool(pluginId, toolName, route, input, actorId, request) {
		const requestMeta = extractRequestMeta(request, getTrustedProxyHeaders(this.config));
		const audit = new AuditRepository(this.db);
		const headers = new Headers(request.headers);
		headers.delete("content-length");
		headers.delete("content-encoding");
		const internalRequest = new Request(request.url, {
			method: "POST",
			headers,
			body: JSON.stringify(input)
		});
		const result = await this.handlePluginApiRoute(pluginId, "POST", route, internalRequest);
		await audit.log({
			actorId,
			actorIp: requestMeta.ip ?? void 0,
			action: "plugin_tool_invoke",
			resourceType: "plugin_mcp_tool",
			resourceId: `${pluginId}__${toolName}`,
			details: {
				pluginId,
				tool: toolName,
				route
			},
			status: result.success ? "success" : "failure"
		});
		return result;
	}
	async handlePluginMcpDenied(pluginId, toolName, route, actorId, request, reason) {
		const requestMeta = extractRequestMeta(request, getTrustedProxyHeaders(this.config));
		await new AuditRepository(this.db).log({
			actorId,
			actorIp: requestMeta.ip ?? void 0,
			action: "plugin_tool_invoke",
			resourceType: "plugin_mcp_tool",
			resourceId: `${pluginId}__${toolName}`,
			details: {
				pluginId,
				tool: toolName,
				route,
				reason
			},
			status: "denied"
		});
	}
	findSandboxedPlugin(pluginId) {
		for (const [key, plugin] of this.sandboxedPlugins) if (key.startsWith(pluginId + ":")) return plugin;
	}
	/**
	* Normalize image/file fields in content data.
	* Fills missing dimensions, storageKey, mimeType, and filename from providers.
	*/
	async normalizeMediaFields(collection, data) {
		let collectionInfo;
		try {
			collectionInfo = await this.schemaRegistry.getCollectionWithFields(collection);
		} catch {
			return data;
		}
		if (!collectionInfo?.fields) return data;
		const imageFields = collectionInfo.fields.filter((f) => f.type === "image" || f.type === "file");
		if (imageFields.length === 0) return data;
		const getProvider = (id) => this.getMediaProvider(id);
		const result = { ...data };
		for (const field of imageFields) {
			const value = result[field.slug];
			if (value == null) continue;
			try {
				const normalized = await normalizeMediaValue(value, getProvider);
				if (normalized) result[field.slug] = normalized;
			} catch {}
		}
		return result;
	}
	async runSandboxedBeforeSave(content, collection, isNew) {
		let result = content;
		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [id] = pluginKey.split(":");
			if (!id || !this.isPluginEnabled(id)) continue;
			try {
				const hookResult = await plugin.invokeHook("content:beforeSave", {
					content: result,
					collection,
					isNew
				});
				if (hookResult && typeof hookResult === "object" && !Array.isArray(hookResult)) {
					const record = {};
					for (const [k, v] of Object.entries(hookResult)) record[k] = v;
					result = record;
				}
			} catch (error) {
				console.error(`EmDash: Sandboxed plugin ${id} beforeSave hook error:`, error);
			}
		}
		return result;
	}
	async runSandboxedBeforeDelete(id, collection) {
		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [pluginId] = pluginKey.split(":");
			if (!pluginId || !this.isPluginEnabled(pluginId)) continue;
			try {
				if (await plugin.invokeHook("content:beforeDelete", {
					id,
					collection
				}) === false) return false;
			} catch (error) {
				console.error(`EmDash: Sandboxed plugin ${pluginId} beforeDelete hook error:`, error);
			}
		}
		return true;
	}
	runAfterSaveHooks(content, collection, isNew) {
		after(async () => {
			if (this.hooks.hasHooks("content:afterSave")) try {
				await this.hooks.runContentAfterSave(content, collection, isNew);
			} catch (err) {
				console.error("EmDash afterSave hook error:", err);
			}
			const tasks = [];
			for (const [pluginKey, plugin] of this.sandboxedPlugins) {
				const [id] = pluginKey.split(":");
				if (!id || !this.isPluginEnabled(id)) continue;
				tasks.push((async () => {
					try {
						await plugin.invokeHook("content:afterSave", {
							content,
							collection,
							isNew
						});
					} catch (err) {
						console.error(`EmDash: Sandboxed plugin ${id} afterSave error:`, err);
					}
				})());
			}
			await Promise.allSettled(tasks);
		});
	}
	runAfterDeleteHooks(id, collection, permanent) {
		after(async () => {
			if (this.hooks.hasHooks("content:afterDelete")) try {
				await this.hooks.runContentAfterDelete(id, collection, permanent);
			} catch (err) {
				console.error("EmDash afterDelete hook error:", err);
			}
			const tasks = [];
			for (const [pluginKey, plugin] of this.sandboxedPlugins) {
				const [pluginId] = pluginKey.split(":");
				if (!pluginId || !this.isPluginEnabled(pluginId)) continue;
				tasks.push((async () => {
					try {
						await plugin.invokeHook("content:afterDelete", {
							id,
							collection,
							permanent
						});
					} catch (err) {
						console.error(`EmDash: Sandboxed plugin ${pluginId} afterDelete error:`, err);
					}
				})());
			}
			await Promise.allSettled(tasks);
		});
	}
	runDeferredContentHook(name, content, collection) {
		const label = name.slice(8);
		after(async () => {
			if (this.hooks.hasHooks(name)) try {
				switch (name) {
					case "content:afterPublish":
						await this.hooks.runContentAfterPublish(content, collection);
						break;
					case "content:afterUnpublish":
						await this.hooks.runContentAfterUnpublish(content, collection);
						break;
					case "content:afterRestore":
						await this.hooks.runContentAfterRestore(content, collection);
						break;
					case "content:afterSchedule":
						await this.hooks.runContentAfterSchedule(content, collection);
						break;
					case "content:afterUnschedule": await this.hooks.runContentAfterUnschedule(content, collection);
				}
			} catch (err) {
				console.error(`EmDash ${label} hook error:`, err);
			}
			const tasks = [];
			for (const [pluginKey, plugin] of this.sandboxedPlugins) {
				const [pluginId] = pluginKey.split(":");
				if (!pluginId || !this.isPluginEnabled(pluginId)) continue;
				tasks.push((async () => {
					try {
						await plugin.invokeHook(name, {
							content,
							collection
						});
					} catch (err) {
						console.error(`EmDash: Sandboxed plugin ${pluginId} ${label} error:`, err);
					}
				})());
			}
			await Promise.allSettled(tasks);
		});
	}
	runAfterPublishHooks(content, collection) {
		this.runDeferredContentHook("content:afterPublish", content, collection);
	}
	runAfterUnpublishHooks(content, collection) {
		this.runDeferredContentHook("content:afterUnpublish", content, collection);
	}
	runAfterRestoreHooks(content, collection) {
		this.runDeferredContentHook("content:afterRestore", content, collection);
	}
	runAfterScheduleHooks(content, collection) {
		this.runDeferredContentHook("content:afterSchedule", content, collection);
	}
	runAfterUnscheduleHooks(content, collection) {
		this.runDeferredContentHook("content:afterUnschedule", content, collection);
	}
	async handleSandboxedRoute(plugin, path, request) {
		const routeName = path.replace(LEADING_SLASH_PATTERN, "");
		let body = void 0;
		try {
			body = await request.json();
		} catch {}
		try {
			const headers = sanitizeHeadersForSandbox(request.headers);
			const meta = extractRequestMeta(request, this.config);
			return {
				success: true,
				data: await plugin.invokeRoute(routeName, body, {
					url: request.url,
					method: request.method,
					headers,
					meta
				})
			};
		} catch (error) {
			console.error(`EmDash: Sandboxed plugin route error:`, error);
			return {
				success: false,
				error: {
					code: "ROUTE_ERROR",
					message: error instanceof Error ? error.message : String(error)
				}
			};
		}
	}
	/**
	* Cache for page contributions. Uses a WeakMap keyed on the PublicPageContext
	* object so results are collected once per page context per request, even when
	* multiple render components (EmDashHead, EmDashBodyStart, EmDashBodyEnd)
	* request contributions from the same page.
	*/
	pageContributionCache = /* @__PURE__ */ new WeakMap();
	/**
	* Collect all page contributions (metadata + fragments) in a single pass.
	* Results are cached by page context object identity.
	*/
	async collectPageContributions(page) {
		const cached = this.pageContributionCache.get(page);
		if (cached) return cached;
		const promise = this.doCollectPageContributions(page);
		this.pageContributionCache.set(page, promise);
		return promise;
	}
	async doCollectPageContributions(page) {
		const metadata = [];
		const fragments = [];
		if (this.hooks.hasHooks("page:metadata")) {
			const results = await this.hooks.runPageMetadata({ page });
			for (const r of results) metadata.push(...r.contributions);
		}
		if (this.hooks.hasHooks("page:fragments")) {
			const results = await this.hooks.runPageFragments({ page });
			for (const r of results) fragments.push(...r.contributions);
		}
		for (const [pluginKey, plugin] of this.sandboxedPlugins) {
			const [id] = pluginKey.split(":");
			if (!id || !this.isPluginEnabled(id)) continue;
			try {
				const result = await plugin.invokeHook("page:metadata", { page });
				if (result != null) {
					const items = Array.isArray(result) ? result : [result];
					for (const item of items) if (isValidMetadataContribution(item)) metadata.push(item);
				}
			} catch (error) {
				console.error(`EmDash: Sandboxed plugin ${id} page:metadata error:`, error);
			}
		}
		return {
			metadata,
			fragments
		};
	}
	/**
	* Collect page metadata contributions from trusted and sandboxed plugins.
	* Delegates to the single-pass collector and returns the metadata portion.
	*/
	async collectPageMetadata(page) {
		const { metadata } = await this.collectPageContributions(page);
		return metadata;
	}
	/**
	* Collect page fragment contributions from trusted plugins only.
	* Delegates to the single-pass collector and returns the fragments portion.
	*/
	async collectPageFragments(page) {
		const { fragments } = await this.collectPageContributions(page);
		return fragments;
	}
	isPluginEnabled(pluginId) {
		const status = this.pluginStates.get(pluginId);
		return status === void 0 || status === "active";
	}
};
function resolvePublicMediaUrl(storage, storageKey) {
	if (!storageKey) return "";
	if (storage) return storage.getPublicUrl(storageKey);
	return `/_emdash/api/media/file/${storageKey}`;
}
function createPublicMediaUrlResolver(storage) {
	return (key) => resolvePublicMediaUrl(storage, key);
}
var ASTRO_COOKIES_SYMBOL = /* @__PURE__ */ Symbol.for("astro.cookies");
function wrapResponseForScopedClose(response, close) {
	let closed = false;
	const runClose = () => {
		if (closed) return;
		closed = true;
		try {
			close();
		} catch (error) {
			console.error("[emdash] request-scoped db close failed:", error);
		}
	};
	if (!response.body) {
		runClose();
		return response;
	}
	const transform = new TransformStream({
		flush: runClose,
		cancel: runClose
	});
	const wrapped = new Response(response.body.pipeThrough(transform), response);
	const astroCookies = Reflect.get(response, ASTRO_COOKIES_SYMBOL);
	if (astroCookies !== void 0) Reflect.set(wrapped, ASTRO_COOKIES_SYMBOL, astroCookies);
	wrapped.headers.delete("Content-Length");
	return wrapped;
}
async function finishScoped(scoped, run) {
	let response;
	try {
		response = await run();
	} catch (error) {
		commitSafely(scoped.commit);
		closeSafely(scoped.close);
		throw error;
	}
	try {
		scoped.commit();
	} catch (error) {
		closeSafely(scoped.close);
		throw error;
	}
	return scoped.close ? wrapResponseForScopedClose(response, scoped.close) : response;
}
function commitSafely(commit) {
	try {
		commit();
	} catch (error) {
		console.error("[emdash] request-scoped db commit failed during error handling:", error);
	}
}
function closeSafely(close) {
	if (!close) return;
	try {
		close();
	} catch (error) {
		console.error("[emdash] request-scoped db close failed during error handling:", error);
	}
}
var STREAM_END_PREFIX = "[emdash-stream-end]";
function wrapBodyForStreamMetrics(response) {
	if (!isInstrumentationEnabled()) return response;
	if (!response.body) return response;
	const ctx = getRequestContext();
	const metrics = ctx?.metrics;
	if (!metrics) return response;
	const recorder = ctx?.queryRecorder;
	if (recorder) recorder.deferredFlush = true;
	const transform = new TransformStream({ flush() {
		const snapshot = {
			route: recorder?.route,
			method: recorder?.method,
			phase: recorder?.phase,
			totalMs: performance.now() - metrics.start,
			dbCount: metrics.dbCount,
			dbTotalMs: metrics.dbTotalMs,
			dbFirstOffset: metrics.dbFirstOffset,
			dbLastOffset: metrics.dbLastOffset,
			cacheHits: metrics.cacheHits,
			cacheMisses: metrics.cacheMisses
		};
		console.log(`${STREAM_END_PREFIX} ${JSON.stringify(snapshot)}`);
		if (recorder) flushRecorder(recorder);
	} });
	const wrapped = new Response(response.body.pipeThrough(transform), response);
	const astroCookies = Reflect.get(response, ASTRO_COOKIES_SYMBOL);
	if (astroCookies !== void 0) Reflect.set(wrapped, ASTRO_COOKIES_SYMBOL, astroCookies);
	wrapped.headers.delete("Content-Length");
	return wrapped;
}
async function prefetchWidgetAreas() {
	const areas = await getWidgetAreas();
	for (const area of areas) setRequestCacheEntry(`widget-area:${area.name}`, area);
}
async function prefetchTaxonomyTerms() {
	const defs = await getTaxonomyDefs();
	await Promise.allSettled(defs.map((def) => getTaxonomyTerms(def.name, { includeCounts: false })));
}
async function prefetchMenus() {
	const rows = await (await getDb()).selectFrom("_emdash_menus").select("name").distinct().execute();
	const names = [...new Set(rows.map((r) => r.name))];
	await Promise.allSettled(names.map((name) => getMenu(name)));
}
async function prefetchLayoutData() {
	try {
		await Promise.allSettled([
			getSiteSettings(),
			prefetchMenus(),
			prefetchWidgetAreas(),
			prefetchTaxonomyTerms()
		]);
	} catch (error) {
		console.error("[emdash] layout prefetch failed (non-fatal):", error);
	}
}
function pluginRouteNotFound() {
	return {
		success: false,
		error: {
			code: "NOT_FOUND",
			message: "Plugin route not found"
		}
	};
}
function createPublicPluginApiRouteHandler(runtime) {
	return async (pluginId, method, path, request) => {
		if (runtime.getPluginRouteMeta(pluginId, path)?.public !== true) return pluginRouteNotFound();
		return runtime.handlePluginApiRoute(pluginId, method, path, request);
	};
}
var RUNTIME_INIT_DEADLINE_MS = DB_INIT_DEADLINE_MS + 15e3;
var RUNTIME_INIT_ERROR_LOG_INTERVAL_MS = 3e4;
var lastRuntimeInitErrorLogAt = 0;
var SETUP_VERIFIED_KEY = /* @__PURE__ */ Symbol.for("emdash:setup-verified");
var setupFlagStore = globalThis;
function isSetupVerified() {
	return setupFlagStore[SETUP_VERIFIED_KEY] === true;
}
function markSetupVerified() {
	setupFlagStore[SETUP_VERIFIED_KEY] = true;
}
var RUNTIME_HOLDER_KEY = /* @__PURE__ */ Symbol.for("emdash:runtime-holder");
function getRuntimeHolder() {
	let holder = setupFlagStore[RUNTIME_HOLDER_KEY];
	if (!holder) {
		holder = {
			instance: null,
			lock: createInitLock()
		};
		setupFlagStore[RUNTIME_HOLDER_KEY] = holder;
	}
	return holder;
}
var i18nInitialized = false;
function getConfig() {
	if (config_default && typeof config_default === "object") {
		if (!i18nInitialized) {
			i18nInitialized = true;
			const config = config_default;
			if (config.i18n && typeof config.i18n === "object") setI18nConfig(config.i18n);
			else setI18nConfig(null);
		}
		return config_default;
	}
	return null;
}
function getPlugins() {
	return plugins || [];
}
function buildDependencies(config) {
	const sandboxModule = sandbox_runner_exports;
	return {
		config,
		plugins: getPlugins(),
		createDialect,
		createCoalescingDialect: void 0,
		createStorage,
		createScheduler,
		sandboxEnabled: sandboxModule.sandboxEnabled,
		sandboxBypassed: sandboxModule.sandboxBypassed ?? false,
		sandboxedPluginEntries: sandboxedPlugins || [],
		createSandboxRunner: sandboxModule.createSandboxRunner,
		mediaProviderEntries: mediaProviders || []
	};
}
async function getRuntime(config, initTimings) {
	const holder = getRuntimeHolder();
	return initWithLock(holder.lock, () => holder.instance, async (isCurrentClaim) => {
		const deps = buildDependencies(config);
		const runtime = await EmDashRuntime.create(deps, initTimings);
		if (isCurrentClaim()) holder.instance = runtime;
		else runtime.stopCron().catch((error) => {
			console.error("[emdash] failed to stop superseded runtime's cron:", error);
		});
		return runtime;
	}, {
		deadlineMs: RUNTIME_INIT_DEADLINE_MS,
		anchor: (promise) => after(() => promise)
	});
}
new URL("https://cron.emdash.internal/");
function finalizeResponse(response, serverTimings) {
	const res = new Response(response.body, response);
	const astroCookies = Reflect.get(response, ASTRO_COOKIES_SYMBOL);
	if (astroCookies !== void 0) Reflect.set(res, ASTRO_COOKIES_SYMBOL, astroCookies);
	if (!res.headers.has("X-Content-Type-Options")) res.headers.set("X-Content-Type-Options", "nosniff");
	if (!res.headers.has("Referrer-Policy")) res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	if (!res.headers.has("Permissions-Policy")) res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
	if (!res.headers.has("Content-Security-Policy")) res.headers.set("X-Frame-Options", "SAMEORIGIN");
	if (serverTimings && serverTimings.length > 0) res.headers.set("Server-Timing", serverTimings.map((t) => {
		const dur = Math.round(t.dur);
		return t.desc ? `${t.name};dur=${dur};desc="${t.desc}"` : `${t.name};dur=${dur}`;
	}).join(", "));
	return res;
}
function pushMetricsTimings(timings, metrics) {
	if (metrics.dbCount > 0) {
		timings.push({
			name: "db.total",
			dur: metrics.dbTotalMs,
			desc: "DB total"
		});
		timings.push({
			name: "db.count",
			dur: metrics.dbCount,
			desc: "Query count"
		});
		if (metrics.dbFirstOffset !== null) timings.push({
			name: "db.first",
			dur: metrics.dbFirstOffset,
			desc: "First query at"
		});
		if (metrics.dbLastOffset !== null) timings.push({
			name: "db.last",
			dur: metrics.dbLastOffset,
			desc: "Last query at"
		});
	}
	if (metrics.rpcCount > 0) timings.push({
		name: "rpc.count",
		dur: metrics.rpcCount,
		desc: "DB round trips"
	});
	if (metrics.cacheHits + metrics.cacheMisses > 0) {
		timings.push({
			name: "cache.hit",
			dur: metrics.cacheHits,
			desc: "Cache hits"
		});
		timings.push({
			name: "cache.miss",
			dur: metrics.cacheMisses,
			desc: "Cache misses"
		});
	}
}
var PUBLIC_RUNTIME_ROUTES = /* @__PURE__ */ new Set(["/sitemap.xml", "/robots.txt"]);
var SITEMAP_COLLECTION_RE = /^\/sitemap-[a-z][a-z0-9_]*\.xml$/;
function createRequestScopedDb$1(opts) {
	if (typeof createRequestScopedDb !== "function") return null;
	return createRequestScopedDb(opts);
}
var onRequest$5 = defineMiddleware(async (context, next) => {
	const { request, locals, cookies } = context;
	const url = context.url;
	if (!url.pathname.startsWith("/_emdash") && config_default?.authProviders) {
		if (config_default.authProviders.some((p) => p.routes?.some((r) => r.pattern && url.pathname === r.pattern))) return finalizeResponse(await next());
	}
	const queryRecorder = isInstrumentationEnabled() ? createRecorder(url.pathname, request.method, request.headers.get("x-perf-phase") ?? "default") : void 0;
	const metrics = createRequestMetrics(performance.now());
	const run = async () => {
		const isEmDashRoute = url.pathname.startsWith("/_emdash");
		const isPublicRuntimeRoute = PUBLIC_RUNTIME_ROUTES.has(url.pathname) || SITEMAP_COLLECTION_RE.test(url.pathname);
		const hasEditCookie = cookies.get("emdash-edit-mode")?.value === "true";
		const hasPreviewToken = url.searchParams.has("_preview");
		const playgroundDb = locals.__playgroundDb;
		const hasSessionCookie = cookies.get("astro-session") !== void 0;
		const sessionUser = context.isPrerendered || !hasSessionCookie ? null : await resolveSessionUser(context.session);
		const hasBearerAuth = (request.headers.get("authorization") ?? "").toLowerCase().startsWith("bearer ");
		if (!isEmDashRoute && !isPublicRuntimeRoute && !hasEditCookie && !hasPreviewToken) {
			if (!sessionUser && !playgroundDb) {
				const timings = [];
				const mwStart = performance.now();
				if (!isSetupVerified() && !context.isPrerendered) {
					const t0 = performance.now();
					try {
						const { getDb: getDb2 } = await import("./loader-C1XOLV5b_BKH4a_n4.mjs").then((n) => n.o);
						await (await getDb2()).selectFrom("_emdash_migrations").selectAll().limit(1).execute();
						markSetupVerified();
					} catch (error) {
						if (isMissingTableError(error)) return context.redirect("/_emdash/admin/setup");
						console.error("Setup probe failed (non-fatal):", error);
					}
					timings.push({
						name: "setup",
						dur: performance.now() - t0,
						desc: "Setup probe"
					});
				}
				const config2 = getConfig();
				if (config2) {
					const initSubTimings = [];
					const t0 = performance.now();
					try {
						const runtime = await getRuntime(config2, initSubTimings);
						markSetupVerified();
						locals.emdash = {
							handlePublicPluginApiRoute: createPublicPluginApiRouteHandler(runtime),
							collectPageMetadata: runtime.collectPageMetadata.bind(runtime),
							collectPageFragments: runtime.collectPageFragments.bind(runtime),
							getPublicMediaUrl: createPublicMediaUrlResolver(runtime.storage),
							storage: runtime.storage
						};
					} catch (error) {
						if (Date.now() - lastRuntimeInitErrorLogAt >= RUNTIME_INIT_ERROR_LOG_INTERVAL_MS) {
							lastRuntimeInitErrorLogAt = Date.now();
							console.error("[emdash] runtime init failed (page renders without CMS data):", error);
						}
					}
					timings.push({
						name: "rt",
						dur: performance.now() - t0,
						desc: "Runtime init"
					});
					for (const sub of initSubTimings) timings.push(sub);
				}
				const anonScoped = createRequestScopedDb$1({
					config: config2?.database?.config,
					isAuthenticated: false,
					isWrite: request.method !== "GET" && request.method !== "HEAD",
					cookies,
					url
				});
				const runAnon = async () => {
					const t0 = performance.now();
					const response = await next();
					timings.push({
						name: "render",
						dur: performance.now() - t0,
						desc: "Page render"
					});
					timings.push({
						name: "mw",
						dur: performance.now() - mwStart,
						desc: "Total middleware"
					});
					pushMetricsTimings(timings, metrics);
					return wrapBodyForStreamMetrics(finalizeResponse(response, timings));
				};
				if (anonScoped) {
					const parent = getRequestContext();
					const ctx = parent ? {
						...parent,
						db: anonScoped.db
					} : {
						editMode: false,
						db: anonScoped.db,
						metrics
					};
					const acceptsHtml = (request.headers.get("accept") ?? "").split(",", 1)[0].trim().startsWith("text/html");
					return runWithContext(ctx, async () => {
						if (acceptsHtml) after(() => prefetchLayoutData());
						return finishScoped(anonScoped, runAnon);
					});
				}
				return runAnon();
			}
		}
		const config = getConfig();
		if (!config) {
			console.error("EmDash: No configuration found");
			return finalizeResponse(await next());
		}
		const doInit = async () => {
			const timings = [];
			const mwStart = performance.now();
			try {
				const initSubTimings = [];
				let t0 = performance.now();
				const runtime = await getRuntime(config, initSubTimings);
				timings.push({
					name: "rt",
					dur: performance.now() - t0,
					desc: "Runtime init"
				});
				for (const sub of initSubTimings) timings.push(sub);
				markSetupVerified();
				locals.emdash = {
					handleContentList: runtime.handleContentList.bind(runtime),
					handleContentGet: runtime.handleContentGet.bind(runtime),
					handleContentAuthors: runtime.handleContentAuthors.bind(runtime),
					handleContentCreate: runtime.handleContentCreate.bind(runtime),
					handleContentUpdate: runtime.handleContentUpdate.bind(runtime),
					handleContentDelete: runtime.handleContentDelete.bind(runtime),
					handleContentListTrashed: runtime.handleContentListTrashed.bind(runtime),
					handleContentRestore: runtime.handleContentRestore.bind(runtime),
					handleContentPermanentDelete: runtime.handleContentPermanentDelete.bind(runtime),
					handleContentCountTrashed: runtime.handleContentCountTrashed.bind(runtime),
					handleContentGetIncludingTrashed: runtime.handleContentGetIncludingTrashed.bind(runtime),
					handleContentDuplicate: runtime.handleContentDuplicate.bind(runtime),
					handleContentPublish: runtime.handleContentPublish.bind(runtime),
					handleContentUnpublish: runtime.handleContentUnpublish.bind(runtime),
					handleContentSchedule: runtime.handleContentSchedule.bind(runtime),
					handleContentUnschedule: runtime.handleContentUnschedule.bind(runtime),
					handleContentCountScheduled: runtime.handleContentCountScheduled.bind(runtime),
					handleContentDiscardDraft: runtime.handleContentDiscardDraft.bind(runtime),
					handleContentCompare: runtime.handleContentCompare.bind(runtime),
					handleContentTranslations: runtime.handleContentTranslations.bind(runtime),
					handleMediaList: runtime.handleMediaList.bind(runtime),
					handleMediaGet: runtime.handleMediaGet.bind(runtime),
					handleMediaCreate: runtime.handleMediaCreate.bind(runtime),
					handleMediaUpdate: runtime.handleMediaUpdate.bind(runtime),
					handleMediaDelete: runtime.handleMediaDelete.bind(runtime),
					handleRevisionList: runtime.handleRevisionList.bind(runtime),
					handleRevisionGet: runtime.handleRevisionGet.bind(runtime),
					handleRevisionRestore: runtime.handleRevisionRestore.bind(runtime),
					handlePluginApiRoute: runtime.handlePluginApiRoute.bind(runtime),
					handlePublicPluginApiRoute: createPublicPluginApiRouteHandler(runtime),
					getPluginRouteMeta: runtime.getPluginRouteMeta.bind(runtime),
					getPluginMcpTools: runtime.getPluginMcpTools.bind(runtime),
					getEnabledPluginMcpTools: runtime.getEnabledPluginMcpTools.bind(runtime),
					serializePluginMcpConsent: runtime.serializePluginMcpConsent.bind(runtime),
					handlePluginMcpTool: runtime.handlePluginMcpTool.bind(runtime),
					handlePluginMcpDenied: runtime.handlePluginMcpDenied.bind(runtime),
					getMediaProvider: runtime.getMediaProvider.bind(runtime),
					getMediaProviderList: runtime.getMediaProviderList.bind(runtime),
					collectPageMetadata: runtime.collectPageMetadata.bind(runtime),
					collectPageFragments: runtime.collectPageFragments.bind(runtime),
					ensureSearchHealthy: runtime.ensureSearchHealthy.bind(runtime),
					storage: runtime.storage,
					get db() {
						return runtime.db;
					},
					getPublicMediaUrl: createPublicMediaUrlResolver(runtime.storage),
					hooks: runtime.hooks,
					email: runtime.email,
					configuredPlugins: runtime.configuredPlugins,
					sandboxedPluginEntries: runtime.sandboxedPluginEntries,
					config,
					getManifest: runtime.getManifest.bind(runtime),
					invalidateUrlPatternCache,
					getSandboxRunner: runtime.getSandboxRunner.bind(runtime),
					isSandboxBypassed: runtime.isSandboxBypassed.bind(runtime),
					syncMarketplacePlugins: runtime.syncMarketplacePlugins.bind(runtime),
					syncRegistryPlugins: runtime.syncRegistryPlugins.bind(runtime),
					setPluginStatus: runtime.setPluginStatus.bind(runtime)
				};
			} catch (error) {
				console.error("EmDash middleware error:", error);
			}
			const scoped = createRequestScopedDb$1({
				config: config?.database?.config,
				isAuthenticated: !!sessionUser || hasBearerAuth,
				isWrite: request.method !== "GET" && request.method !== "HEAD",
				cookies: context.cookies,
				url
			});
			const renderAndFinalize = async () => {
				const t0 = performance.now();
				const response = await next();
				timings.push({
					name: "render",
					dur: performance.now() - t0,
					desc: "Page render"
				});
				timings.push({
					name: "mw",
					dur: performance.now() - mwStart,
					desc: "Total middleware"
				});
				pushMetricsTimings(timings, metrics);
				return wrapBodyForStreamMetrics(finalizeResponse(response, timings));
			};
			if (scoped) {
				const parent = getRequestContext();
				return runWithContext(parent ? {
					...parent,
					db: scoped.db
				} : {
					editMode: false,
					db: scoped.db,
					metrics
				}, () => finishScoped(scoped, renderAndFinalize));
			}
			return renderAndFinalize();
		};
		if (playgroundDb) {
			const editMode = context.cookies.get("emdash-edit-mode")?.value === "true";
			const parent = getRequestContext();
			return runWithContext(parent ? {
				...parent,
				editMode,
				db: playgroundDb,
				dbIsIsolated: true
			} : {
				editMode,
				db: playgroundDb,
				dbIsIsolated: true,
				metrics
			}, doInit);
		}
		return doInit();
	};
	try {
		return await runWithContext({
			editMode: false,
			queryRecorder,
			metrics
		}, run);
	} finally {
		if (queryRecorder && !queryRecorder.deferredFlush) flushRecorder(queryRecorder);
	}
});
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/middleware/redirect.mjs
/**
* Redirect middleware
*
* Intercepts incoming requests and checks for matching redirect rules.
* Runs after runtime init (needs db) but before setup/auth (should handle
* ALL routes, including public ones, and should be fast).
*
* Skip paths:
* - /_emdash/* (admin UI, API routes, auth endpoints)
* - /_image (Astro image optimization)
* - Static assets (files with extensions)
*
* 404 logging happens post-response: if next() returns 404 and the path
* wasn't already matched by a redirect, log it.
*/
/** Paths that should never be intercepted by redirects */
var SKIP_PREFIXES = ["/_emdash", "/_image"];
/** Static asset extensions -- don't redirect file requests */
var ASSET_EXTENSION = /\.\w{1,10}$/;
function isRedirectCode(code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
}
var onRequest$4 = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return next();
	if (ASSET_EXTENSION.test(pathname)) return next();
	let db = context.locals.emdash?.db;
	if (!db) try {
		db = await getDb();
	} catch {
		return next();
	}
	try {
		const repo = new RedirectRepository(db);
		let cached = getCachedRedirects();
		if (!cached) cached = setCachedRedirects(await repo.findAllEnabled());
		let exact = cached.exact.get(pathname);
		if (!exact && pathname.length > 1) {
			const alt = pathname.endsWith("/") ? pathname.slice(0, -1) : `${pathname}/`;
			exact = cached.exact.get(alt);
		}
		if (exact) {
			if (isTerminalStatus(exact.type)) {
				repo.recordHit(exact.id).catch(() => {});
				return new Response(null, { status: exact.type });
			}
			const dest = exact.destination;
			if (dest.startsWith("//") || dest.startsWith("/\\")) return next();
			repo.recordHit(exact.id).catch(() => {});
			const code = isRedirectCode(exact.type) ? exact.type : 301;
			return context.redirect(dest, code);
		}
		const patternMatch = matchCachedPatterns(cached.patterns, pathname);
		if (patternMatch) {
			const { redirect, destination } = patternMatch;
			if (isTerminalStatus(redirect.type)) {
				repo.recordHit(redirect.id).catch(() => {});
				return new Response(null, { status: redirect.type });
			}
			if (destination.startsWith("//") || destination.startsWith("/\\")) return next();
			repo.recordHit(redirect.id).catch(() => {});
			const code = isRedirectCode(redirect.type) ? redirect.type : 301;
			return context.redirect(destination, code);
		}
		const response = await next();
		if (response.status === 404) {
			const referrer = context.request.headers.get("referer") ?? null;
			const userAgent = context.request.headers.get("user-agent") ?? null;
			repo.log404({
				path: pathname,
				referrer,
				userAgent
			}).catch(() => {});
		}
		return response;
	} catch {
		return next();
	}
});
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/middleware/setup.mjs
/**
* Setup detection middleware
*
* Redirects to setup wizard if the site hasn't been set up yet.
* Checks both "emdash:setup_complete" option AND user existence.
*
* Detection logic (in order):
* 1. Does options table exist? No → setup needed
* 2. Is setup_complete true? No → setup needed
* 3. In passkey mode: Are there any users? No → setup needed
*    In Access mode: Skip user check (first user created on first login)
* 4. Proceed to admin
*/
var onRequest$3 = defineMiddleware(async (context, next) => {
	const isAdminRoute = context.url.pathname.startsWith("/_emdash/admin");
	const isSetupRoute = context.url.pathname.startsWith("/_emdash/admin/setup");
	if (isAdminRoute && !isSetupRoute) {
		const { emdash } = context.locals;
		if (!emdash?.db) return next();
		try {
			const setupComplete = await emdash.db.selectFrom("options").select("value").where("name", "=", "emdash:setup_complete").executeTakeFirst();
			if (!(setupComplete && (() => {
				try {
					const parsed = JSON.parse(setupComplete.value);
					return parsed === true || parsed === "true";
				} catch {
					return false;
				}
			})())) return context.redirect("/_emdash/admin/setup");
			if (getAuthMode(emdash.config).type === "passkey") {
				if ((await emdash.db.selectFrom("users").select((eb) => eb.fn.countAll().as("count")).executeTakeFirstOrThrow()).count === 0) return context.redirect("/_emdash/admin/setup");
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("no such table")) return context.redirect("/_emdash/admin/setup");
			console.error("Setup middleware error:", error);
		}
	}
	return next();
});
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/public-url-DSGTnJFw.mjs
var _envSiteUrl = null;
function getEnvSiteUrl() {
	if (_envSiteUrl !== null) return _envSiteUrl || void 0;
	try {
		const value = typeof process !== "undefined" && process.env?.EMDASH_SITE_URL || typeof process !== "undefined" && process.env?.SITE_URL || "";
		if (value) {
			const parsed = new URL(value);
			if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
				_envSiteUrl = "";
				return;
			}
			_envSiteUrl = parsed.origin;
		} else _envSiteUrl = "";
	} catch {
		_envSiteUrl = "";
	}
	return _envSiteUrl || void 0;
}
function getPublicOrigin(url, config) {
	return config?.siteUrl || getEnvSiteUrl() || url.origin;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/api-tokens-p-iMzvXR.mjs
/**
* Resolve a raw API token (ec_pat_...) to a user ID and scopes.
* Updates last_used_at on successful lookup.
* Returns null if the token is invalid or expired.
*/
async function resolveApiToken(db, rawToken) {
	const hash = hashPrefixedToken(rawToken);
	const row = await db.selectFrom("_emdash_api_tokens").select([
		"id",
		"user_id",
		"scopes",
		"expires_at"
	]).where("token_hash", "=", hash).executeTakeFirst();
	if (!row) return null;
	if (row.expires_at && new Date(row.expires_at) < /* @__PURE__ */ new Date()) return null;
	db.updateTable("_emdash_api_tokens").set({ last_used_at: (/* @__PURE__ */ new Date()).toISOString() }).where("id", "=", row.id).execute().catch(() => {});
	return {
		userId: row.user_id,
		scopes: JSON.parse(row.scopes)
	};
}
/**
* Resolve an OAuth access token (ec_oat_...) to a user ID and scopes.
* Returns null if the token is invalid or expired.
*/
async function resolveOAuthToken(db, rawToken) {
	const hash = hashPrefixedToken(rawToken);
	const row = await db.selectFrom("_emdash_oauth_tokens").select([
		"user_id",
		"scopes",
		"expires_at",
		"token_type"
	]).where("token_hash", "=", hash).where("token_type", "=", "access").executeTakeFirst();
	if (!row) return null;
	if (new Date(row.expires_at) < /* @__PURE__ */ new Date()) return null;
	return {
		userId: row.user_id,
		scopes: JSON.parse(row.scopes)
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/middleware/auth.mjs
function checkPublicCsrf(request, url, publicOrigin) {
	if (request.headers.get("X-EmDash-Request") === "1") return null;
	const origin = request.headers.get("Origin");
	if (origin) {
		try {
			const originUrl = new URL(origin);
			if (originUrl.origin === url.origin) return null;
			if (publicOrigin && originUrl.origin === publicOrigin) return null;
		} catch {}
		return apiError("CSRF_REJECTED", "Cross-origin request blocked", 403);
	}
	return null;
}
var S3_ADAPTER_ENTRYPOINT = "emdash/storage/s3";
function getConfiguredStorageEndpoint(storage, runtimeStorage) {
	const config = storage?.config;
	if (typeof config === "object" && config !== null && "endpoint" in config) {
		const endpoint = config.endpoint;
		if (typeof endpoint === "string") return endpoint;
	}
	if (storage?.entrypoint === S3_ADAPTER_ENTRYPOINT) {
		const envEndpoint = typeof process !== "undefined" && process.env ? process.env.S3_ENDPOINT : void 0;
		if (envEndpoint) return envEndpoint;
	}
	return runtimeStorage?.getClientUploadOrigin?.();
}
function getRegistryAggregatorOrigin(registry) {
	const aggregatorUrl = typeof registry === "string" ? registry : registry?.aggregatorUrl;
	if (!aggregatorUrl) return void 0;
	try {
		const url = new URL(aggregatorUrl);
		if (url.protocol !== "http:" && url.protocol !== "https:") return void 0;
		return url.origin;
	} catch {
		return;
	}
}
function getHttpOrigin(rawUrl) {
	if (!rawUrl) return void 0;
	try {
		const url = new URL(rawUrl);
		if (url.protocol !== "http:" && url.protocol !== "https:") return void 0;
		return url.origin;
	} catch {
		return;
	}
}
function buildEmDashCsp(registry, storageEndpoint) {
	const connectSrc = ["connect-src 'self'"];
	const origins = /* @__PURE__ */ new Set();
	const registryAggregatorOrigin = getRegistryAggregatorOrigin(registry);
	if (registryAggregatorOrigin) origins.add(registryAggregatorOrigin);
	const storageOrigin = getHttpOrigin(storageEndpoint);
	if (storageOrigin) origins.add(storageOrigin);
	connectSrc.push(...origins);
	return [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		connectSrc.join(" "),
		"form-action 'self'",
		"frame-ancestors 'none'",
		"img-src 'self' https: data: blob:",
		"object-src 'none'",
		"base-uri 'self'"
	].join("; ");
}
var MW_CACHE_HEADERS = { "Cache-Control": "private, no-store" };
var MCP_ENDPOINT_PATH = "/_emdash/api/mcp";
function isUnsafeMethod(method) {
	return method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
}
function csrfRejectedResponse() {
	return apiError("CSRF_REJECTED", "Missing required header", 403);
}
function mcpUnauthorizedResponse(url, config) {
	const origin = getPublicOrigin(url, config);
	const response = apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	response.headers.set("WWW-Authenticate", `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource"`);
	return response;
}
var PUBLIC_API_PREFIXES = [
	"/_emdash/api/setup",
	"/_emdash/api/auth/login",
	"/_emdash/api/auth/register",
	"/_emdash/api/auth/dev-bypass",
	"/_emdash/api/auth/signup/",
	"/_emdash/api/auth/magic-link/",
	"/_emdash/api/auth/invite/",
	"/_emdash/api/auth/oauth/",
	"/_emdash/api/oauth/device/token",
	"/_emdash/api/oauth/device/code",
	"/_emdash/api/oauth/token",
	"/_emdash/api/oauth/register",
	"/_emdash/api/comments/",
	"/_emdash/api/media/file/",
	"/_emdash/.well-known/"
];
var PUBLIC_API_EXACT = /* @__PURE__ */ new Set([
	"/_emdash/api/auth/passkey/options",
	"/_emdash/api/auth/passkey/verify",
	"/_emdash/api/auth/mode",
	"/_emdash/api/oauth/token",
	"/_emdash/api/snapshot",
	"/_emdash/api/search",
	"/_emdash/api/search/suggest"
]);
var { exact: _providerExactRoutes, prefixes: _providerPrefixRoutes } = (() => {
	const exact = /* @__PURE__ */ new Set();
	const prefixes = [];
	if (!config_default?.authProviders) return {
		exact,
		prefixes
	};
	for (const route of config_default.authProviders.flatMap((p) => p.publicRoutes ?? [])) if (route.endsWith("/")) prefixes.push(route);
	else exact.add(route);
	return {
		exact,
		prefixes
	};
})();
var CSRF_EXEMPT_PUBLIC_ROUTES = /* @__PURE__ */ new Set([
	"/_emdash/api/oauth/token",
	"/_emdash/api/oauth/register",
	"/_emdash/api/oauth/device/code",
	"/_emdash/api/oauth/device/token"
]);
function isPublicEmDashRoute(pathname) {
	if (PUBLIC_API_EXACT.has(pathname)) return true;
	if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return true;
	if (_providerExactRoutes.has(pathname)) return true;
	if (_providerPrefixRoutes.some((p) => pathname.startsWith(p))) return true;
	return false;
}
function isCsrfExemptPublicRoute(pathname) {
	return CSRF_EXEMPT_PUBLIC_ROUTES.has(pathname);
}
var onRequest$2 = defineMiddleware(async (context, next) => {
	const { url } = context;
	const isAdminRoute = url.pathname.startsWith("/_emdash/admin");
	const isSetupRoute = url.pathname.startsWith("/_emdash/admin/setup");
	const isApiRoute = url.pathname.startsWith("/_emdash/api");
	const isPublicApiRoute = isPublicEmDashRoute(url.pathname);
	const isPublicRoute = !isAdminRoute && !isApiRoute;
	if (isPublicApiRoute) {
		if (isUnsafeMethod(context.request.method.toUpperCase()) && !isCsrfExemptPublicRoute(url.pathname)) {
			const publicOrigin = getPublicOrigin(url, context.locals.emdash?.config);
			const csrfError = checkPublicCsrf(context.request, url, publicOrigin);
			if (csrfError) return csrfError;
		}
		return next();
	}
	if (url.pathname.startsWith("/_emdash/api/plugins/")) {
		const method2 = context.request.method.toUpperCase();
		if (method2 !== "GET" && method2 !== "HEAD" && method2 !== "OPTIONS") {
			const publicOrigin = getPublicOrigin(url, context.locals.emdash?.config);
			const csrfError = checkPublicCsrf(context.request, url, publicOrigin);
			if (csrfError) return csrfError;
		}
		return handlePluginRouteAuth(context, next);
	}
	if (isSetupRoute) {
		const method2 = context.request.method.toUpperCase();
		if (method2 !== "GET" && method2 !== "HEAD" && method2 !== "OPTIONS") {
			if (context.request.headers.get("X-EmDash-Request") !== "1") return apiError("CSRF_REJECTED", "Missing required header", 403);
		}
		return next();
	}
	if (isPublicRoute) return handlePublicRouteAuth(context, next);
	const bearerResult = await handleBearerAuth(context);
	if (bearerResult === "invalid") {
		const response2 = apiError("INVALID_TOKEN", "Invalid or expired token", 401);
		if (url.pathname === "/_emdash/api/mcp") {
			const origin = getPublicOrigin(url, context.locals.emdash?.config);
			response2.headers.set("WWW-Authenticate", `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource"`);
		}
		return response2;
	}
	const isTokenAuth = bearerResult === "authenticated";
	const method = context.request.method.toUpperCase();
	if (url.pathname === MCP_ENDPOINT_PATH && !isTokenAuth) return mcpUnauthorizedResponse(url, context.locals.emdash?.config);
	const isOAuthConsent = url.pathname.startsWith("/_emdash/oauth/authorize");
	if (isApiRoute && !isTokenAuth && !isOAuthConsent && isUnsafeMethod(method) && !isPublicApiRoute) {
		if (context.request.headers.get("X-EmDash-Request") !== "1") return csrfRejectedResponse();
	}
	if (isTokenAuth) {
		const scopeError = enforceTokenScope(url.pathname, method, context.locals.tokenScopes);
		if (scopeError) return scopeError;
		const response2 = await next();
		response2.headers.set("Content-Security-Policy", buildEmDashCsp(context.locals.emdash?.config.experimental?.registry, getConfiguredStorageEndpoint(context.locals.emdash?.config.storage, context.locals.emdash?.storage)));
		return response2;
	}
	const response = await handleEmDashAuth(context, next);
	response.headers.set("Content-Security-Policy", buildEmDashCsp(context.locals.emdash?.config.experimental?.registry, getConfiguredStorageEndpoint(context.locals.emdash?.config.storage, context.locals.emdash?.storage)));
	return response;
});
async function handleEmDashAuth(context, next) {
	const { url, locals } = context;
	const { emdash } = locals;
	const isPublicAdminRoute = url.pathname.startsWith("/_emdash/admin/login") || url.pathname.startsWith("/_emdash/admin/invite/accept");
	const isApiRoute = url.pathname.startsWith("/_emdash/api");
	if (!emdash?.db) return next();
	const authMode = getAuthMode(emdash.config);
	if (authMode.type === "external") return handleExternalAuth(context, next, authMode, isApiRoute);
	if (isPublicAdminRoute) return next();
	return handlePasskeyAuth(context, next, isApiRoute);
}
async function handlePluginRouteAuth(context, next) {
	const { locals, url } = context;
	const { emdash } = locals;
	try {
		const bearerResult = await handleBearerAuth(context);
		if (bearerResult === "authenticated") return next();
		if (bearerResult === "invalid") return apiError("INVALID_TOKEN", "Invalid or expired token", 401);
	} catch (error) {
		console.error("Plugin route bearer auth error:", error);
	}
	const authMode = getAuthMode(emdash?.config);
	if (authMode.type === "external" && !isPublicPluginApiRoute(url.pathname, emdash)) return handleExternalAuth(context, next, authMode, true);
	try {
		const { session } = context;
		const sessionUser = await resolveSessionUser(session);
		if (sessionUser?.id && emdash?.db) {
			const user = await createKyselyAdapter(emdash.db).getUserById(sessionUser.id);
			if (user && !user.disabled) locals.user = user;
		}
	} catch (error) {
		console.error("Plugin route session auth error:", error);
	}
	return next();
}
function isPublicPluginApiRoute(pathname, emdash) {
	const route = pathname.slice(21);
	const slashIndex = route.indexOf("/");
	if (slashIndex <= 0 || !emdash?.getPluginRouteMeta) return false;
	return emdash.getPluginRouteMeta(route.slice(0, slashIndex), route.slice(slashIndex))?.public === true;
}
async function handlePublicRouteAuth(context, next) {
	const { locals, session } = context;
	const { emdash } = locals;
	try {
		const sessionUser = await resolveSessionUser(session);
		if (sessionUser?.id && emdash?.db) {
			const user = await createKyselyAdapter(emdash.db).getUserById(sessionUser.id);
			if (user && !user.disabled) locals.user = user;
		}
	} catch {}
	return next();
}
async function handleExternalAuth(context, next, authMode, _isApiRoute) {
	const { locals, request } = context;
	const { emdash } = locals;
	try {
		throw new Error(`Auth provider ${authMode.entrypoint} does not export an authenticate function`);
	} catch (error) {
		console.error("[external-auth] Auth error:", error);
		return new Response("Authentication failed", {
			status: 401,
			headers: {
				"Content-Type": "text/plain",
				...MW_CACHE_HEADERS
			}
		});
	}
}
async function handleBearerAuth(context) {
	const authHeader = context.request.headers.get("Authorization");
	if (!authHeader?.startsWith("Bearer ")) return "none";
	const token = authHeader.slice(7);
	if (!token) return "none";
	const { locals } = context;
	const { emdash } = locals;
	if (!emdash?.db) return "none";
	let resolved = null;
	if (token.startsWith("ec_pat_")) resolved = await resolveApiToken(emdash.db, token);
	else if (token.startsWith("ec_oat_")) resolved = await resolveOAuthToken(emdash.db, token);
	else return "invalid";
	if (!resolved) return "invalid";
	const user = await createKyselyAdapter(emdash.db).getUserById(resolved.userId);
	if (!user || user.disabled) return "invalid";
	locals.user = user;
	locals.tokenScopes = resolved.scopes;
	return "authenticated";
}
async function handlePasskeyAuth(context, next, isApiRoute) {
	const { url, locals, session } = context;
	const { emdash } = locals;
	try {
		const sessionUser = await resolveSessionUser(session);
		if (!sessionUser?.id) {
			if (isApiRoute) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
			const loginUrl = new URL("/_emdash/admin/login", getPublicOrigin(url, emdash?.config));
			loginUrl.searchParams.set("redirect", url.pathname);
			return context.redirect(loginUrl.toString());
		}
		const user = await createKyselyAdapter(emdash.db).getUserById(sessionUser.id);
		if (!user) {
			session?.destroy();
			if (isApiRoute) return apiError("NOT_FOUND", "User not found", 401);
			const loginUrl = new URL("/_emdash/admin/login", getPublicOrigin(url, emdash?.config));
			return context.redirect(loginUrl.toString());
		}
		if (user.disabled) {
			session?.destroy();
			if (isApiRoute) return apiError("ACCOUNT_DISABLED", "Account disabled", 403);
			const loginUrl = new URL("/_emdash/admin/login", getPublicOrigin(url, emdash?.config));
			loginUrl.searchParams.set("error", "account_disabled");
			return context.redirect(loginUrl.toString());
		}
		locals.user = user;
	} catch (error) {
		console.error("Auth middleware error:", error);
		return context.redirect("/_emdash/admin/login");
	}
	return next();
}
var SCOPE_RULES = [
	[
		"/_emdash/api/content",
		"GET",
		"content:read"
	],
	[
		"/_emdash/api/content",
		"WRITE",
		"content:write"
	],
	[
		"/_emdash/api/media/file",
		"*",
		"media:read"
	],
	[
		"/_emdash/api/media",
		"GET",
		"media:read"
	],
	[
		"/_emdash/api/media",
		"WRITE",
		"media:write"
	],
	[
		"/_emdash/api/schema",
		"GET",
		"schema:read"
	],
	[
		"/_emdash/api/schema",
		"WRITE",
		"schema:write"
	],
	[
		"/_emdash/api/taxonomies",
		"GET",
		"content:read"
	],
	[
		"/_emdash/api/taxonomies",
		"WRITE",
		"taxonomies:manage"
	],
	[
		"/_emdash/api/menus",
		"GET",
		"content:read"
	],
	[
		"/_emdash/api/menus",
		"WRITE",
		"menus:manage"
	],
	[
		"/_emdash/api/sections",
		"GET",
		"content:read"
	],
	[
		"/_emdash/api/sections",
		"WRITE",
		"content:write"
	],
	[
		"/_emdash/api/widget-areas",
		"GET",
		"content:read"
	],
	[
		"/_emdash/api/widget-areas",
		"WRITE",
		"content:write"
	],
	[
		"/_emdash/api/revisions",
		"GET",
		"content:read"
	],
	[
		"/_emdash/api/revisions",
		"WRITE",
		"content:write"
	],
	[
		"/_emdash/api/search",
		"GET",
		"content:read"
	],
	[
		"/_emdash/api/search",
		"WRITE",
		"admin"
	],
	[
		"/_emdash/api/import",
		"*",
		"admin"
	],
	[
		"/_emdash/api/admin",
		"*",
		"admin"
	],
	[
		"/_emdash/api/plugins",
		"*",
		"admin"
	],
	[
		"/_emdash/api/settings",
		"GET",
		"settings:read"
	],
	[
		"/_emdash/api/settings",
		"WRITE",
		"settings:manage"
	]
];
var WRITE_METHODS = /* @__PURE__ */ new Set([
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
]);
function enforceTokenScope(pathname, method, tokenScopes) {
	if (!tokenScopes) return null;
	if (pathname === MCP_ENDPOINT_PATH) return null;
	const isWrite = WRITE_METHODS.has(method);
	for (const [prefix, ruleMethod, scope] of SCOPE_RULES) {
		if (pathname !== prefix && !pathname.startsWith(prefix + "/")) continue;
		if (ruleMethod === "*" || ruleMethod === "WRITE" && isWrite || ruleMethod === method) {
			if (hasScope(tokenScopes, scope)) return null;
			return apiError("INSUFFICIENT_SCOPE", `Token lacks required scope: ${scope}`, 403);
		}
	}
	if (hasScope(tokenScopes, "admin")) return null;
	return apiError("INSUFFICIENT_SCOPE", "Token lacks required scope: admin", 403);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/middleware/request-context.mjs
/**
* EmDash Toolbar Bootstrap (toolbar: "client")
*
* A tiny script injected into every public HTML response when the client
* toolbar mode is enabled. It is identical for every visitor, so the HTML
* stays fully cacheable by shared caches (Workers Cache, Cache Everything,
* Fastly, Varnish, …).
*
* Behavior: if this browser has logged into the admin (non-secret
* localStorage flag set by the admin SPA), render a small "Edit" pill.
* Clicking it verifies the session server-side and reloads the page with the
* `_edit` query param — that URL is always rendered fresh with the full
* server-side toolbar. Logged-out browsers pay one localStorage read and
* nothing else. See Discussion #1742.
*/
/**
* Non-secret localStorage flag set by the admin SPA when an editor session
* exists in this browser. It only means "a session may exist" — the click
* handler verifies the real session before entering edit mode. The literal
* is duplicated in `@emdash-cms/admin` (Shell/Header), which cannot import
* from core.
*/
var EDITOR_FLAG_KEY = "emdash-editor";
/**
* localStorage flag set when the user dismisses the toolbar in this browser.
* Cleared the next time an editor opens the admin. Also duplicated in
* `@emdash-cms/admin`.
*/
var TOOLBAR_DISMISSED_KEY = "emdash-toolbar-dismissed";
/**
* Query param that requests a fresh (never cached) editor render. Presence is
* verified server-side: non-editors are redirected to the canonical URL.
*/
var EDIT_PARAM = "_edit";
function renderToolbarBootstrap() {
	return `
<!-- EmDash Toolbar Bootstrap -->
<script>
(function() {
  var flag, dismissed;
  try {
    flag = localStorage.getItem("${EDITOR_FLAG_KEY}");
    dismissed = localStorage.getItem("${TOOLBAR_DISMISSED_KEY}");
  } catch (e) {
    return;
  }
  if (!flag || dismissed) return;
  // The server toolbar is present on _edit / edit-mode / preview renders.
  if (document.getElementById("emdash-toolbar")) return;

  var root = document.createElement("div");
  root.id = "emdash-toolbar-bootstrap";
  root.style.cssText = "position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1;-webkit-font-smoothing:antialiased;";

  var inner = document.createElement("div");
  inner.style.cssText = "display:flex;align-items:center;gap:10px;padding:8px 16px;background:#1a1a1a;color:#e0e0e0;border-radius:999px;box-shadow:0 4px 24px rgba(0,0,0,0.3),0 0 0 1px rgba(255,255,255,0.08);white-space:nowrap;user-select:none;";

  var logo = document.createElement("span");
  logo.textContent = "EmDash";
  logo.style.cssText = "font-weight:600;font-size:12px;letter-spacing:0.02em;color:#fff;opacity:0.7;";

  var divider = document.createElement("span");
  divider.style.cssText = "width:1px;height:16px;background:rgba(255,255,255,0.15);";

  var editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.style.cssText = "padding:4px 12px;background:#3b82f6;color:#fff;border:none;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;";

  var closeBtn = document.createElement("button");
  closeBtn.textContent = "\\u00d7";
  closeBtn.title = "Hide toolbar";
  closeBtn.setAttribute("aria-label", "Hide toolbar");
  closeBtn.style.cssText = "background:none;border:none;color:#666;cursor:pointer;font-size:16px;padding:0 2px;line-height:1;font-family:inherit;";

  editBtn.addEventListener("click", function() {
    editBtn.disabled = true;
    fetch("/_emdash/api/auth/me", {
      credentials: "same-origin",
      headers: { "X-EmDash-Request": "1" }
    })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(body) {
      var user = body && body.data;
      if (user && user.role >= 30) {
        var u = new URL(location.href);
        u.searchParams.set("${EDIT_PARAM}", "1");
        location.href = u.toString();
      } else if (user) {
        // Logged in but not an editor — the flag is stale for this browser.
        try { localStorage.removeItem("${EDITOR_FLAG_KEY}"); } catch (e) {}
        root.remove();
      } else {
        // No session — go to the admin login page.
        location.href = "/_emdash/admin/login";
      }
    })
    .catch(function() {
      editBtn.disabled = false;
    });
  });

  closeBtn.addEventListener("click", function() {
    try { localStorage.setItem("${TOOLBAR_DISMISSED_KEY}", "1"); } catch (e) {}
    root.remove();
  });

  inner.appendChild(logo);
  inner.appendChild(divider);
  inner.appendChild(editBtn);
  inner.appendChild(closeBtn);
  root.appendChild(inner);
  document.body.appendChild(root);
})();
<\/script>
`;
}
function renderToolbar(config) {
	const { editMode, isPreview } = config;
	return `
<!-- EmDash Visual Editing Toolbar -->
<div id="emdash-toolbar" data-edit-mode="${editMode}" data-preview="${isPreview}">
  <div class="emdash-tb-inner">
    <span class="emdash-tb-logo">EmDash</span>

    <div class="emdash-tb-divider"></div>

    <label class="emdash-tb-toggle" title="Toggle edit mode">
      <input type="checkbox" id="emdash-edit-toggle" ${editMode ? "checked" : ""} />
      <span class="emdash-tb-toggle-track">
        <span class="emdash-tb-toggle-thumb"></span>
      </span>
      <span class="emdash-tb-toggle-label">Edit</span>
    </label>

    <span class="emdash-tb-status" id="emdash-tb-status"></span>

    <span class="emdash-tb-save-status" id="emdash-tb-save-status"></span>

    <a class="emdash-tb-admin" id="emdash-tb-admin" href="#" target="emdash-admin" style="display:none" title="Open in admin">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>

    <button class="emdash-tb-publish" id="emdash-tb-publish" style="display:none">Publish</button>

    <button class="emdash-tb-dismiss" id="emdash-tb-dismiss" title="Hide toolbar" aria-label="Hide toolbar">&times;</button>
  </div>
</div>

<style>
  #emdash-toolbar {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
  }

  .emdash-tb-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    background: #1a1a1a;
    color: #e0e0e0;
    border-radius: 999px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08);
    white-space: nowrap;
    user-select: none;
  }

  .emdash-tb-logo {
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.02em;
    color: #fff;
    opacity: 0.7;
  }

  .emdash-tb-divider {
    width: 1px;
    height: 16px;
    background: rgba(255,255,255,0.15);
  }

  /* Toggle switch */
  .emdash-tb-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .emdash-tb-toggle input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .emdash-tb-toggle-track {
    position: relative;
    width: 32px;
    height: 18px;
    background: #444;
    border-radius: 9px;
    transition: background 0.2s;
  }

  .emdash-tb-toggle input:checked + .emdash-tb-toggle-track {
    background: #3b82f6;
  }

  .emdash-tb-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  .emdash-tb-toggle input:checked + .emdash-tb-toggle-track .emdash-tb-toggle-thumb {
    transform: translateX(14px);
  }

  .emdash-tb-toggle-label {
    font-size: 12px;
    color: #aaa;
  }

  .emdash-tb-toggle input:checked ~ .emdash-tb-toggle-label {
    color: #fff;
  }

  /* Status area — flex for multiple badges */
  .emdash-tb-status {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  /* Badges */
  .emdash-tb-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .emdash-tb-badge--preview {
    background: rgba(139,92,246,0.2);
    color: #a78bfa;
  }

  .emdash-tb-badge--draft {
    background: rgba(245,158,11,0.2);
    color: #fbbf24;
  }

  .emdash-tb-badge--published {
    background: rgba(34,197,94,0.2);
    color: #4ade80;
  }

  .emdash-tb-badge--pending {
    background: rgba(59,130,246,0.2);
    color: #60a5fa;
  }

  .emdash-tb-badge--unsaved {
    background: rgba(245,158,11,0.2);
    color: #fbbf24;
  }

  .emdash-tb-badge--saving {
    background: rgba(148,163,184,0.2);
    color: #94a3b8;
  }

  .emdash-tb-badge--saved {
    background: rgba(34,197,94,0.2);
    color: #4ade80;
    transition: opacity 0.3s;
  }

  .emdash-tb-badge--error {
    background: rgba(239,68,68,0.2);
    color: #f87171;
  }

  /* Admin link */
  .emdash-tb-admin {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #888;
    text-decoration: none;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .emdash-tb-admin:hover {
    color: #fff;
  }

  /* Publish button */
  .emdash-tb-publish {
    padding: 4px 12px;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
  }

  .emdash-tb-publish:hover {
    background: #2563eb;
  }

  .emdash-tb-publish:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Dismiss button */
  .emdash-tb-dismiss {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0 2px;
    font-family: inherit;
    transition: color 0.15s;
  }

  .emdash-tb-dismiss:hover {
    color: #fff;
  }

  /* Edit mode: editable hover styles — uses :has() to check toolbar state */
  body:has(#emdash-toolbar[data-edit-mode="true"]) [data-emdash-ref] {
    transition: box-shadow 0.15s, background-color 0.15s;
  }

  body:has(#emdash-toolbar[data-edit-mode="true"]) [data-emdash-ref]:hover {
    box-shadow: 0 0 0 2px rgba(59,130,246,0.5);
    border-radius: 4px;
    background-color: rgba(59,130,246,0.04);
    cursor: text;
  }

  /* Active editing state — override hover pencil cursor */
  [data-emdash-editing] {
    box-shadow: 0 0 0 2px #3b82f6 !important;
    border-radius: 4px !important;
    background-color: rgba(59,130,246,0.04) !important;
    cursor: text !important;
  }

  /* Suppress browser focus ring on contenteditable and tiptap editor */
  [data-emdash-editing]:focus,
  [data-emdash-ref] .tiptap:focus,
  [data-emdash-ref] .ProseMirror:focus {
    outline: none !important;
  }

  /* Image editor popover */
  .emdash-img-popover {
    position: fixed;
    z-index: 1000000;
    background: #1a1a1a;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08);
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    width: 320px;
    overflow: hidden;
    animation: emdash-img-fadein 0.15s ease-out;
  }

  @keyframes emdash-img-fadein {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .emdash-img-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .emdash-img-popover-title {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #999;
  }

  .emdash-img-popover-close {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 2px;
    line-height: 1;
    font-size: 16px;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .emdash-img-popover-close:hover {
    color: #fff;
  }

  .emdash-img-popover-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .emdash-img-preview {
    width: 100%;
    max-height: 160px;
    object-fit: contain;
    border-radius: 6px;
    background: #111;
  }

  .emdash-img-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    border: 2px dashed rgba(255,255,255,0.15);
    border-radius: 6px;
    color: #666;
    font-size: 12px;
  }

  .emdash-img-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .emdash-img-field label {
    font-size: 11px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .emdash-img-field input[type="text"] {
    background: #111;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    color: #e0e0e0;
    padding: 6px 8px;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
  }

  .emdash-img-field input[type="text"]:focus {
    border-color: #3b82f6;
  }

  .emdash-img-actions {
    display: flex;
    gap: 6px;
  }

  .emdash-img-btn {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    background: #222;
    color: #e0e0e0;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    text-align: center;
    white-space: nowrap;
  }

  .emdash-img-btn:hover {
    background: #333;
    border-color: rgba(255,255,255,0.2);
  }

  .emdash-img-btn--primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }

  .emdash-img-btn--primary:hover {
    background: #2563eb;
    border-color: #2563eb;
  }

  .emdash-img-btn--danger {
    color: #f87171;
    border-color: rgba(248,113,113,0.3);
  }

  .emdash-img-btn--danger:hover {
    background: rgba(248,113,113,0.1);
    border-color: rgba(248,113,113,0.5);
  }

  /* Media browser within the popover */
  .emdash-img-browser {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 12px;
  }

  .emdash-img-browser-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .emdash-img-browser-title {
    font-size: 12px;
    font-weight: 600;
    color: #999;
  }

  .emdash-img-browser-back {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    padding: 2px 4px;
  }

  .emdash-img-browser-back:hover {
    text-decoration: underline;
  }

  .emdash-img-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    max-height: 240px;
    overflow-y: auto;
  }

  .emdash-img-grid-item {
    aspect-ratio: 1;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.15s;
    background: #111;
  }

  .emdash-img-grid-item:hover {
    border-color: rgba(59,130,246,0.5);
  }

  .emdash-img-grid-item--selected {
    border-color: #3b82f6;
  }

  .emdash-img-grid-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .emdash-img-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    color: #666;
    font-size: 12px;
  }

  .emdash-img-drop {
    border: 2px dashed #3b82f6;
    background: rgba(59,130,246,0.05);
  }

  .emdash-img-uploading {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    color: #999;
    font-size: 12px;
  }

  .emdash-img-popover-backdrop {
    position: fixed;
    inset: 0;
    z-index: 999999;
  }
</style>

<script>
(function() {
  var toolbar = document.getElementById("emdash-toolbar");
  var toggle = document.getElementById("emdash-edit-toggle");
  var statusEl = document.getElementById("emdash-tb-status");
  var saveStatusEl = document.getElementById("emdash-tb-save-status");
  var publishBtn = document.getElementById("emdash-tb-publish");
  if (!toolbar || !toggle || !statusEl || !publishBtn || !saveStatusEl) return;

  // Dismissed in this browser (localStorage flag, cleared on the next admin
  // visit). Remove the toolbar entirely instead of rendering it.
  try {
    if (localStorage.getItem("emdash-toolbar-dismissed")) {
      toolbar.remove();
      return;
    }
  } catch (e) {
    // localStorage unavailable — render normally
  }

  var isEditMode = toolbar.getAttribute("data-edit-mode") === "true";

  var dismissBtn = document.getElementById("emdash-tb-dismiss");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", function() {
      try { localStorage.setItem("emdash-toolbar-dismissed", "1"); } catch (e) {}
      // Dismissing while edit mode is on would strand the user in edit mode
      // with no UI to leave it — clear the cookie too.
      if (isEditMode) {
        document.cookie = "emdash-edit-mode=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        toolbar.remove();
        location.replace(location.href);
        return;
      }
      toolbar.remove();
    });
  }

  // CSRF-protected fetch — adds X-EmDash-Request header to all API calls
  function ecFetch(url, init) {
    init = init || {};
    init.headers = Object.assign({ "X-EmDash-Request": "1" }, init.headers || {});
    return fetch(url, init);
  }

  // --- Save status tracking ---
  var saveState = "idle"; // idle | unsaved | saving | saved | error
  var saveHideTimer = null;
  var pendingSavePromise = null;

  function setSaveState(state) {
    saveState = state;
    clearTimeout(saveHideTimer);

    switch (state) {
      case "unsaved":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--unsaved">Unsaved</span>';
        break;
      case "saving":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--saving">Saving\u2026</span>';
        break;
      case "saved":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--saved">Saved</span>';
        saveHideTimer = setTimeout(function() {
          saveStatusEl.innerHTML = "";
          saveState = "idle";
        }, 2000);
        break;
      case "error":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--error">Save failed</span>';
        saveHideTimer = setTimeout(function() {
          saveStatusEl.innerHTML = "";
          saveState = "idle";
        }, 3000);
        break;
      default:
        saveStatusEl.innerHTML = "";
    }
  }

  // Listen for save events from inline editors (e.g. PT editor)
  document.addEventListener("emdash:save", function(e) {
    var detail = e.detail || {};
    if (detail.state) {
      setSaveState(detail.state);
    }
  });

  document.addEventListener("emdash:content-changed", function(e) {
    var detail = e.detail || {};
    if (detail.collection && detail.id) {
      showUnpublishedChanges(detail.collection, detail.id);
    }
  });

  // --- Entry status ---
  var entryRef = null;

  function updateStatus() {
    if (!isEditMode) {
      statusEl.innerHTML = "";
      publishBtn.style.display = "none";
      return;
    }

    var first = document.querySelector("[data-emdash-ref]");
    if (!first) {
      statusEl.innerHTML = "";
      publishBtn.style.display = "none";
      return;
    }

    try {
      var ref = JSON.parse(first.getAttribute("data-emdash-ref"));
      entryRef = ref;
      if (!ref.status) return;

      // Show admin link
      var adminLink = document.getElementById("emdash-tb-admin");
      if (adminLink) {
        adminLink.href = "/_emdash/admin/content/" + encodeURIComponent(ref.collection) + "/" + encodeURIComponent(ref.id);
        adminLink.style.display = "";
      }

      if (ref.status === "draft") {
        statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--draft">Draft</span>';
        publishBtn.style.display = "";
        publishBtn.onclick = function() { publish(ref.collection, ref.id); };
      } else if (ref.status === "published" && ref.hasDraft) {
        statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--pending">Unpublished changes</span>';
        publishBtn.style.display = "";
        publishBtn.onclick = function() { publish(ref.collection, ref.id); };
      } else if (ref.status === "published") {
        statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--published">Published</span>';
        publishBtn.style.display = "none";
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  // Publish action
  function publish(collection, id) {
    if (pendingSavePromise) {
      pendingSavePromise.then(function() { publish(collection, id); });
      return;
    }

    publishBtn.disabled = true;
    publishBtn.textContent = "Publishing\u2026";

    ecFetch("/_emdash/api/content/" + encodeURIComponent(collection) + "/" + encodeURIComponent(id) + "/publish", {
      method: "POST",
      credentials: "same-origin",
    })
    .then(function(res) {
      if (res.ok) {
        if (document.startViewTransition) {
          document.startViewTransition(function() { location.reload(); });
        } else {
          location.reload();
        }
      } else {
        publishBtn.disabled = false;
        publishBtn.textContent = "Publish";
        console.error("Publish failed:", res.status);
      }
    })
    .catch(function(err) {
      publishBtn.disabled = false;
      publishBtn.textContent = "Publish";
      console.error("Publish failed:", err);
    });
  }

  // Edit mode toggle
  toggle.addEventListener("change", function() {
    if (toggle.checked) {
      document.cookie = "emdash-edit-mode=true;path=/;samesite=lax";
    } else {
      document.cookie = "emdash-edit-mode=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    if (document.startViewTransition) {
      document.startViewTransition(function() { location.replace(location.href); });
    } else {
      location.replace(location.href);
    }
  });

  // --- Inline editing ---

  // Cached manifest (fetched once on first edit click)
  var manifestCache = null;
  var manifestPromise = null;

  function fetchManifest() {
    if (manifestCache) return Promise.resolve(manifestCache);
    if (manifestPromise) return manifestPromise;
    manifestPromise = ecFetch("/_emdash/api/manifest", { credentials: "same-origin" })
      .then(function(r) { return r.json(); })
      .then(function(m) {
        // The manifest endpoint wraps the payload in a { success, data } envelope (ApiResponse shape).
        // Unwrap it so getFieldKind can read manifest.collections directly.
        manifestCache = m && m.data ? m.data : m;
        return manifestCache;
      });
    return manifestPromise;
  }

  function getFieldKind(manifest, collection, field) {
    var col = manifest.collections && manifest.collections[collection];
    if (!col || !col.fields) return null;
    var f = col.fields[field];
    return f ? f.kind : null;
  }

  // Load manifest early so the first click can resolve field kinds without racing the event.
  if (isEditMode) {
    fetchManifest();
  }

  // Save a single field value
  function saveField(collection, id, field, value) {
    setSaveState("saving");
    return ecFetch("/_emdash/api/content/" + encodeURIComponent(collection) + "/" + encodeURIComponent(id), {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { [field]: value } }),
    })
    .then(function(res) {
      if (res.ok) {
        setSaveState("saved");
        // A save creates/updates a draft — show unpublished changes
        showUnpublishedChanges(collection, id);
      } else {
        setSaveState("error");
        console.error("Save failed:", res.status);
      }
    })
    .catch(function(err) {
      setSaveState("error");
      console.error("Save failed:", err);
    });
  }

  function showUnpublishedChanges(collection, id) {
    statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--pending">Unpublished changes</span>';
    publishBtn.style.display = "";
    publishBtn.disabled = false;
    publishBtn.textContent = "Publish";
    publishBtn.onclick = function() { publish(collection, id); };
  }

  // Plain text inline editing (contenteditable)
  var currentlyEditing = null;

  function startTextEdit(element, annotation) {
    if (currentlyEditing === element) return;
    if (currentlyEditing) endCurrentEdit();

    currentlyEditing = element;
    var originalText = element.textContent || "";

    element.setAttribute("data-emdash-editing", "");
    element.contentEditable = "plaintext-only";
    element.focus();

    // Select all text
    var range = document.createRange();
    range.selectNodeContents(element);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // Track dirty state via input events
    function handleInput() {
      var current = (element.textContent || "").trim();
      if (current !== originalText.trim()) {
        setSaveState("unsaved");
      } else {
        setSaveState("idle");
      }
    }

    function handleBlur() {
      element.removeEventListener("blur", handleBlur);
      element.removeEventListener("keydown", handleKeydown);
      element.removeEventListener("input", handleInput);
      element.contentEditable = "false";
      element.removeAttribute("data-emdash-editing");
      currentlyEditing = null;

      var newValue = (element.textContent || "").trim();
      if (newValue !== originalText.trim()) {
        pendingSavePromise = saveField(annotation.collection, annotation.id, annotation.field, newValue).then(function() {
          pendingSavePromise = null;
        }, function() {
          pendingSavePromise = null;
        });
      } else {
        setSaveState("idle");
      }
    }

    function handleKeydown(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        element.blur();
      }
      if (e.key === "Escape") {
        element.textContent = originalText;
        setSaveState("idle");
        element.blur();
      }
    }

    element.addEventListener("input", handleInput);
    element.addEventListener("blur", handleBlur);
    element.addEventListener("keydown", handleKeydown);
  }

  function endCurrentEdit() {
    if (currentlyEditing) {
      currentlyEditing.blur();
    }
  }

  // Fallback: open admin
  function openAdmin(annotation) {
    var url = "/_emdash/admin/content/" + encodeURIComponent(annotation.collection) + "/" + encodeURIComponent(annotation.id);
    if (annotation.field) {
      url += "?field=" + encodeURIComponent(annotation.field);
    }
    window.open(url, "emdash-admin");
  }

  // --- Inline image editing ---
  var activeImagePopover = null;

  function closeImagePopover() {
    if (activeImagePopover) {
      activeImagePopover.backdrop.remove();
      activeImagePopover.popover.remove();
      if (activeImagePopover.escapeHandler) {
        document.removeEventListener("keydown", activeImagePopover.escapeHandler);
      }
      activeImagePopover = null;
    }
  }

  function startImageEdit(element, annotation) {
    closeImagePopover();

    // Find the current image value by fetching the entry
    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    // Find img element inside the annotated container (or the element itself if it's an img)
    var imgEl = element.tagName === "IMG" ? element : element.querySelector("img");

    // Fetch current field value from the content API
    ecFetch("/_emdash/api/content/" + encodeURIComponent(collection) + "/" + encodeURIComponent(id), {
      credentials: "same-origin"
    })
    .then(function(r) { return r.json(); })
    .then(function(entry) {
      var currentValue = entry.data && entry.data[field];
      showImagePopover(element, imgEl, annotation, currentValue);
    })
    .catch(function() {
      // If fetch fails, still show popover with what we can infer from DOM
      showImagePopover(element, imgEl, annotation, null);
    });
  }

  function showImagePopover(element, imgEl, annotation, currentValue) {
    closeImagePopover();

    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    // Position near the element
    var rect = element.getBoundingClientRect();
    var viewportH = window.innerHeight;
    var viewportW = window.innerWidth;

    // Create backdrop for click-outside-to-close
    var backdrop = document.createElement("div");
    backdrop.className = "emdash-img-popover-backdrop";
    backdrop.addEventListener("click", function(e) {
      if (e.target === backdrop) closeImagePopover();
    });

    // Create popover
    var popover = document.createElement("div");
    popover.className = "emdash-img-popover";

    var currentSrc = currentValue ? (currentValue.previewUrl || currentValue.src) : (imgEl ? imgEl.src : null);
    var currentAlt = currentValue ? (currentValue.alt || "") : (imgEl ? (imgEl.alt || "") : "");

    // Build popover HTML
    var html = '';
    html += '<div class="emdash-img-popover-header">';
    html += '  <span class="emdash-img-popover-title">Image</span>';
    html += '  <button class="emdash-img-popover-close" data-action="close">&times;</button>';
    html += '</div>';
    html += '<div class="emdash-img-popover-body" id="emdash-img-main">';

    if (currentSrc) {
      html += '<img class="emdash-img-preview" src="' + escapeAttr(currentSrc) + '" alt="" />';
    } else {
      html += '<div class="emdash-img-empty">No image selected</div>';
    }

    html += '<div class="emdash-img-field">';
    html += '  <label for="emdash-img-alt">Alt text</label>';
    html += '  <input type="text" id="emdash-img-alt" value="' + escapeAttr(currentAlt) + '" placeholder="Describe the image" />';
    html += '</div>';

    html += '<div class="emdash-img-actions">';
    html += '  <button class="emdash-img-btn emdash-img-btn--primary" data-action="browse">Replace</button>';
    html += '  <label class="emdash-img-btn" style="cursor:pointer">';
    html += '    Upload';
    html += '    <input type="file" accept="image/*" id="emdash-img-upload" style="display:none" />';
    html += '  </label>';
    if (currentSrc) {
      html += '  <button class="emdash-img-btn emdash-img-btn--danger" data-action="remove">Remove</button>';
    }
    html += '</div>';
    html += '</div>';

    popover.innerHTML = html;

    backdrop.appendChild(popover);
    document.body.appendChild(backdrop);

    // Position the popover
    positionPopover(popover, rect, viewportW, viewportH);

    // Escape key handler
    function handleEscape(e) {
      if (e.key === "Escape") {
        closeImagePopover();
        document.removeEventListener("keydown", handleEscape);
      }
    }
    document.addEventListener("keydown", handleEscape);

    activeImagePopover = {
      backdrop: backdrop,
      popover: popover,
      annotation: annotation,
      currentValue: currentValue,
      element: element,
      imgEl: imgEl,
      escapeHandler: handleEscape
    };

    // Event handlers
    popover.querySelector('[data-action="close"]').addEventListener("click", closeImagePopover);

    popover.querySelector('[data-action="browse"]').addEventListener("click", function() {
      showMediaBrowser(popover, annotation, currentValue, element, imgEl);
    });

    var uploadInput = popover.querySelector("#emdash-img-upload");
    uploadInput.addEventListener("change", function(e) {
      var file = e.target.files && e.target.files[0];
      if (file) handleImageUpload(file, popover, annotation, element, imgEl);
    });

    var removeBtn = popover.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.addEventListener("click", function() {
        saveField(collection, id, field, null).then(function() {
          if (imgEl) {
            imgEl.style.display = "none";
          }
          closeImagePopover();
        });
      });
    }

    // Save alt text on change (debounced)
    var altInput = popover.querySelector("#emdash-img-alt");
    var altTimer = null;
    altInput.addEventListener("input", function() {
      clearTimeout(altTimer);
      altTimer = setTimeout(function() {
        var newAlt = altInput.value;
        if (currentValue) {
          var updated = Object.assign({}, currentValue, { alt: newAlt });
          saveField(collection, id, field, updated);
          if (imgEl) imgEl.alt = newAlt;
        }
      }, 500);
    });

    // Handle drag and drop on the popover body
    var body = popover.querySelector(".emdash-img-popover-body");
    body.addEventListener("dragover", function(e) {
      e.preventDefault();
      body.classList.add("emdash-img-drop");
    });
    body.addEventListener("dragleave", function() {
      body.classList.remove("emdash-img-drop");
    });
    body.addEventListener("drop", function(e) {
      e.preventDefault();
      body.classList.remove("emdash-img-drop");
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file, popover, annotation, element, imgEl);
      }
    });
  }

  function positionPopover(popover, targetRect, viewportW, viewportH) {
    var popoverW = 320;
    var gap = 8;

    // Try to place to the right of the element
    var left = targetRect.right + gap;
    var top = targetRect.top;

    // If it overflows right, place to the left
    if (left + popoverW > viewportW - 16) {
      left = targetRect.left - popoverW - gap;
    }
    // If it still overflows (narrow viewport), center below
    if (left < 16) {
      left = Math.max(16, (viewportW - popoverW) / 2);
      top = targetRect.bottom + gap;
    }
    // Clamp vertically
    if (top + 400 > viewportH - 80) { // 80 for toolbar
      top = Math.max(16, viewportH - 480);
    }
    if (top < 16) top = 16;

    popover.style.left = left + "px";
    popover.style.top = top + "px";
  }

  function escapeAttr(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function showMediaBrowser(popover, annotation, currentValue, element, imgEl) {
    var mainBody = popover.querySelector("#emdash-img-main");
    if (mainBody) mainBody.style.display = "none";

    // Remove existing browser if any
    var existing = popover.querySelector(".emdash-img-browser");
    if (existing) existing.remove();

    var browser = document.createElement("div");
    browser.className = "emdash-img-browser";

    browser.innerHTML = '<div class="emdash-img-browser-header">' +
      '<span class="emdash-img-browser-title">Media Library</span>' +
      '<button class="emdash-img-browser-back">Back</button>' +
      '</div>' +
      '<div class="emdash-img-loading">Loading\u2026</div>';

    popover.appendChild(browser);

    browser.querySelector(".emdash-img-browser-back").addEventListener("click", function() {
      browser.remove();
      if (mainBody) mainBody.style.display = "";
    });

    // Fetch media
    ecFetch("/_emdash/api/media?mimeType=image/&limit=30", { credentials: "same-origin" })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var items = data.items || [];
      var loadingEl = browser.querySelector(".emdash-img-loading");
      if (loadingEl) loadingEl.remove();

      if (items.length === 0) {
        var empty = document.createElement("div");
        empty.className = "emdash-img-loading";
        empty.textContent = "No images found";
        browser.appendChild(empty);
        return;
      }

      var grid = document.createElement("div");
      grid.className = "emdash-img-grid";

      items.forEach(function(item) {
        var thumb = document.createElement("div");
        thumb.className = "emdash-img-grid-item";
        if (currentValue && currentValue.id === item.id) {
          thumb.classList.add("emdash-img-grid-item--selected");
        }
        var thumbUrl = item.url || item.previewUrl || ("/_emdash/api/media/file/" + item.storageKey);
        thumb.innerHTML = '<img src="' + escapeAttr(thumbUrl) + '" alt="' + escapeAttr(item.alt || item.filename || "") + '" loading="lazy" />';

        thumb.addEventListener("click", function() {
          selectMediaItem(item, annotation, element, imgEl);
        });

        grid.appendChild(thumb);
      });

      browser.appendChild(grid);
    })
    .catch(function(err) {
      var loadingEl = browser.querySelector(".emdash-img-loading");
      if (loadingEl) loadingEl.textContent = "Failed to load media";
      console.error("Media fetch error:", err);
    });
  }

  function selectMediaItem(item, annotation, element, imgEl) {
    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    var isLocal = !item.provider || item.provider === "local";
    var itemUrl = item.url || item.previewUrl || ("/_emdash/api/media/file/" + item.storageKey);

    var newValue = {
      id: item.id,
      provider: item.provider || "local",
      src: isLocal ? itemUrl : undefined,
      previewUrl: isLocal ? undefined : itemUrl,
      alt: item.alt || "",
      width: item.width,
      height: item.height,
      meta: item.meta
    };

    // Clean undefined fields
    Object.keys(newValue).forEach(function(k) {
      if (newValue[k] === undefined) delete newValue[k];
    });

    saveField(collection, id, field, newValue).then(function() {
      // Update the image in the DOM
      if (imgEl) {
        imgEl.src = itemUrl;
        imgEl.alt = item.alt || "";
        imgEl.style.display = "";
      }
      closeImagePopover();
    });
  }

  function handleImageUpload(file, popover, annotation, element, imgEl) {
    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    // Show uploading state
    var mainBody = popover.querySelector("#emdash-img-main");
    var browserEl = popover.querySelector(".emdash-img-browser");
    if (browserEl) browserEl.remove();
    if (mainBody) {
      mainBody.innerHTML = '<div class="emdash-img-uploading">' +
        '<span>Uploading ' + escapeAttr(file.name) + '\u2026</span>' +
        '</div>';
      mainBody.style.display = "";
    }

    // Detect dimensions before upload
    var dimPromise = new Promise(function(resolve) {
      if (!file.type.startsWith("image/")) return resolve({});
      var img = new Image();
      img.onload = function() {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = function() {
        resolve({});
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });

    dimPromise.then(function(dims) {
      // Generate a thumbnail for large images to avoid OOM in server-side
      // blurhash generation on memory-constrained runtimes (Workers).
      // Thumbnail fits within a 64x64 box (scale by max dimension) so that
      // extreme aspect ratios don't explode into a huge canvas client-side.
      var thumbPromise;
      if (dims.width && dims.height && dims.width * dims.height * 4 > 32 * 1024 * 1024) {
        thumbPromise = new Promise(function(resolve) {
          try {
            var maxDim = Math.max(dims.width, dims.height);
            var scale = Math.min(1, 64 / maxDim);
            var thumbW = Math.max(1, Math.round(dims.width * scale));
            var thumbH = Math.max(1, Math.round(dims.height * scale));
            var canvas = document.createElement("canvas");
            canvas.width = thumbW;
            canvas.height = thumbH;
            var ctx = canvas.getContext("2d");
            if (ctx) {
              var img = new Image();
              img.onload = function() {
                try {
                  ctx.drawImage(img, 0, 0, thumbW, thumbH);
                  canvas.toBlob(function(blob) {
                    URL.revokeObjectURL(img.src);
                    resolve(blob);
                  }, "image/png");
                } catch (e) {
                  URL.revokeObjectURL(img.src);
                  resolve(null);
                }
              };
              img.onerror = function() {
                URL.revokeObjectURL(img.src);
                resolve(null);
              };
              img.src = URL.createObjectURL(file);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      } else {
        thumbPromise = Promise.resolve(null);
      }

      return thumbPromise.then(function(thumbnail) {
        var formData = new FormData();
        formData.append("file", file);
        if (dims.width) formData.append("width", String(dims.width));
        if (dims.height) formData.append("height", String(dims.height));
        if (thumbnail) formData.append("thumbnail", thumbnail, "thumb.png");

        return ecFetch("/_emdash/api/media", {
          method: "POST",
          credentials: "same-origin",
          body: formData
        });
      });
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.item) throw new Error("Upload failed");
      var item = data.item;
      selectMediaItem(item, annotation, element, imgEl);
    })
    .catch(function(err) {
      console.error("Upload error:", err);
      setSaveState("error");
      closeImagePopover();
    });
  }

  // Click handler for edit mode
  if (isEditMode) {
    document.addEventListener("click", function(e) {
      var target = e.target;

      // Don't intercept clicks on elements currently being edited
      if (target.hasAttribute && target.hasAttribute("data-emdash-editing")) return;

      // Walk up to find annotated element
      while (target && target !== document.body) {
        if (target.hasAttribute && target.hasAttribute("data-emdash-editing")) return;

        var ref = target.getAttribute && target.getAttribute("data-emdash-ref");
        if (ref) {
          try {
            var annotation = JSON.parse(ref);

            // Entry-level annotation (no field) — keep walking for a field-level ancestor
            if (!annotation.field) {
              target = target.parentElement;
              continue;
            }

            function dispatchInline(kind) {
              closeImagePopover();
              // Portable Text is edited in-page by InlinePortableTextEditor — do not open admin
              if (kind === "portableText") {
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              if (kind === "string" || kind === "text") {
                startTextEdit(target, annotation);
              } else if (kind === "image") {
                startImageEdit(target, annotation);
              } else {
                openAdmin(annotation);
              }
            }

            if (manifestCache) {
              dispatchInline(getFieldKind(manifestCache, annotation.collection, annotation.field));
            } else {
              fetchManifest().then(function(manifest) {
                dispatchInline(getFieldKind(manifest, annotation.collection, annotation.field));
              });
            }
          } catch (err) {
            console.error("Failed to parse emdash ref:", err);
          }
          return;
        }
        target = target.parentElement;
      }
    }, true);
  }

  updateStatus();
})();
<\/script>
`;
}
var toolbarMode = config_default?.toolbar ?? "server";
/**
* Opt the current request out of Astro's route cache (e.g. Workers Cache on
* Cloudflare). `Cache-Control` headers do NOT cover this: the adapter derives
* the shared-cache TTL from the route-cache options (on Cloudflare via
* `Cloudflare-CDN-Cache-Control`), so session-specific responses must
* explicitly disable it or they get stored in the shared cache and served to
* anonymous visitors without ever invoking the middleware again. With no cache
* provider configured this is a no-op (`NoopAstroCache`/`DisabledAstroCache`).
*/
function optOutOfRouteCache(cache) {
	cache.set(false);
}
/**
* Inject HTML before `</body>` if the response is an HTML page with a body
* end tag. Does not touch cache headers — callers decide whether the result
* is still shareable. `injected` tells the caller whether anything changed.
*/
async function injectBeforeBodyEnd(response, htmlToInject) {
	if (!response.headers.get("content-type")?.includes("text/html")) return {
		response,
		injected: false
	};
	const html = await response.text();
	if (!html.includes("</body>")) return {
		response: new Response(html, response),
		injected: false
	};
	const injected = html.replace("</body>", `${htmlToInject}</body>`);
	return {
		response: new Response(injected, {
			status: response.status,
			headers: response.headers
		}),
		injected: true
	};
}
/**
* Inject toolbar HTML into a response if it's an HTML page.
* Returns the original response if not HTML.
*/
async function injectToolbar(response, toolbarHtml, routeCache) {
	const result = await injectBeforeBodyEnd(response, toolbarHtml);
	if (result.injected) {
		result.response.headers.set("Cache-Control", "private, no-store");
		optOutOfRouteCache(routeCache);
	}
	return result.response;
}
/**
* Inject the client-toolbar bootstrap script. Identical for every visitor, so
* cache headers and route-cache options are left untouched and the response
* stays fully shareable.
*/
async function injectBootstrap(response) {
	return (await injectBeforeBodyEnd(response, renderToolbarBootstrap())).response;
}
/**
* Redirect an `_edit` URL to its canonical form (same URL without the param).
* Applied when the requester is not an authenticated editor, so a shared
* `?_edit` link degrades gracefully for everyone else (Discussion #1742).
*/
function redirectToCanonical(url) {
	const canonical = new URL(url);
	canonical.searchParams.delete(EDIT_PARAM);
	return new Response(null, {
		status: 302,
		headers: {
			Location: canonical.pathname + canonical.search + canonical.hash,
			"Cache-Control": "private, no-store"
		}
	});
}
var onRequest$1 = defineMiddleware(async (context, next) => {
	const { cookies, url } = context;
	if (url.pathname.startsWith("/_emdash")) return next();
	const { user } = context.locals;
	const isEditor = !!user && user.role >= 30;
	const playgroundDb = context.locals.__playgroundDb;
	if (playgroundDb) return runWithContext({
		editMode: cookies.get("emdash-edit-mode")?.value === "true",
		db: playgroundDb,
		dbIsIsolated: true
	}, () => next());
	const hasEditCookie = cookies.get("emdash-edit-mode")?.value === "true";
	const hasPreviewToken = url.searchParams.has("_preview");
	const hasEditParam = toolbarMode === "client" && url.searchParams.has(EDIT_PARAM);
	if (hasEditParam) {
		optOutOfRouteCache(context.cache);
		if (!isEditor) return redirectToCanonical(url);
	}
	if (!hasEditCookie && !hasPreviewToken && !isEditor) {
		if (toolbarMode === "client") return injectBootstrap(await next());
		return next();
	}
	const editMode = hasEditCookie && isEditor;
	const locale = context.currentLocale;
	const routeCache = context.cache;
	let preview;
	if (hasPreviewToken) {
		const db = context.locals.emdash?.db;
		if (db) {
			const { previewSecret } = await resolveSecretsCached(db);
			const result = await verifyPreviewToken({
				url,
				secret: previewSecret
			});
			if (result.valid) {
				const { collection, id } = parseContentId(result.payload.cid);
				preview = {
					collection,
					id
				};
			}
		} else console.warn("[emdash] Preview token present but EmDash runtime not initialized; preview disabled.");
	}
	if (hasEditCookie || hasPreviewToken) return runWithContext({
		...getRequestContext(),
		editMode,
		preview,
		locale
	}, async () => {
		let response = await next();
		if (hasPreviewToken) optOutOfRouteCache(routeCache);
		if (preview) {
			response = new Response(response.body, response);
			response.headers.set("Cache-Control", "private, no-store");
		}
		if (isEditor && toolbarMode !== false) {
			const toolbarHtml = renderToolbar({
				editMode,
				isPreview: !!preview
			});
			return injectToolbar(response, toolbarHtml, routeCache);
		}
		if (toolbarMode === "client" && !isEditor && !preview) return injectBootstrap(response);
		return response;
	});
	if (isEditor) {
		if (toolbarMode === false) return next();
		if (toolbarMode === "client" && !hasEditParam) return injectBootstrap(await next());
		return injectToolbar(await next(), renderToolbar({
			editMode: false,
			isPreview: false
		}), routeCache);
	}
	return next();
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$5, onRequest$4, onRequest$3, onRequest$2, onRequest$1);
//#endregion
export { onRequest };
