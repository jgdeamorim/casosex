import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { $ as _property, A as toJSONSchema, B as _lte, F as _gte, G as _minSize, H as _maxSize, I as _includes, J as _nonnegative, K as _multipleOf, L as _length, N as _endsWith, P as _gt, Q as _positive, R as _lowercase, S as schemas_exports, U as _mime, V as _maxLength, W as _minLength, X as _normalize, Y as _nonpositive, Z as _overwrite, at as _toUpperCase, ct as globalRegistry, et as _regex, it as _toLowerCase, k as iso_exports, nt as _slugify, ot as _trim, q as _negative, rt as _startsWith, st as _uppercase, tt as _size, z as _lt } from "./schemas_CzTFUUcv.mjs";
import { A as defineMiddleware } from "./render_DtM3lYxL.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import { t as sql } from "./dist_D4nVBoqy.mjs";
import { a as Kysely } from "./kysely_CkAA5UYX.mjs";
import { n as createRequestScopedDb, t as createDialect } from "./dialect_C-0O1NJj.mjs";
import { b as validateIdentifier, g as listTablesLike, h as isSqlite, i as runMigrations, l as setI18nConfig, n as MIGRATION_RACE_WAIT_MS, o as getI18nConfig, t as ConcurrentMigrationTimeoutError } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { t as after } from "./after-B1IIdH3Y_D2PBgJNO.mjs";
import { n as getRequestContext, r as runWithContext, t as createRequestMetrics } from "./request-context_K9BAblf6.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { n as isMissingTableError } from "./db-errors-CcWLaRiR_Bz5UsdxN.mjs";
import { n as RevisionRepository, t as ContentRepository } from "./content-CpfKV9QE_DeIsRghk.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./user-BAumEmpA_79fxFfjA.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import { r as hashString } from "./hash-Cb7U1b5M_CHUcNDr6.mjs";
import "./enrich-CFJJgxs__9Ib7u08c.mjs";
import { A as handleMediaCreate, C as handleContentUpdate, G as handleRevisionGet, K as handleRevisionList, M as handleMediaGet, N as handleMediaList, P as handleMediaUpdate, S as handleContentUnschedule, _ as handleContentPublish, a as handleContentCompare, b as handleContentTranslations, c as handleContentCreate, ct as normalizeRegistryConfig, d as handleContentDuplicate, f as handleContentGet, ft as EmDashStorageError, g as handleContentPermanentDelete, h as handleContentListTrashed, i as handleContentAuthors, j as handleMediaDelete, l as handleContentDelete, m as handleContentList, o as handleContentCountScheduled, p as handleContentGetIncludingTrashed, q as handleRevisionRestore, s as handleContentCountTrashed, st as loadBundleFromR2, u as handleContentDiscardDraft, ut as validateRev, v as handleContentRestore, x as handleContentUnpublish, y as handleContentSchedule } from "./query-1xOcEy18_dGFoQgZT.mjs";
import { n as normalizeMediaValue } from "./normalize-C-SHXmra_BSrPKVar.mjs";
import { f as markContentMediaUsageCollectionStale, l as findNonTranslatableSiblingContentIds, m as refreshContentMediaUsageAfterWrite, s as deleteContentMediaUsage } from "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import { i as setRequestCacheEntry, r as requestCached } from "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import { a as getDb, c as createRecorder, d as kyselyLogOption, l as flushRecorder, u as isInstrumentationEnabled } from "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { n as initWithLock, t as createInitLock } from "./init-lock-DJkX6Hto_DCsg6SKz.mjs";
import { r as singleFlightCached, t as createSingleFlightCache } from "./single-flight-cache-C2exrGAi_CN0gTUoV.mjs";
import { r as invalidateSiteSettingsCache, t as getSiteSettings } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import { n as CronExecutor } from "./cron-BlKIMD_e_DKU8q02k.mjs";
import { c as createHookPipeline, d as getMenu, f as resolveExclusiveHooks, i as NodeCronScheduler, l as createNoopSandboxRunner, n as AuditRepository, o as PluginRouteRegistry, p as createSiteInfo, r as EmailPipeline, s as buildRouteMeta, u as definePlugin } from "./dist_C4cexd-h.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import { r as normalizeManifestRoute } from "./manifest-schema-bCq54i7F_oDiktgui.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as getTrustedProxyHeaders } from "./trusted-proxy-CwjQj0YG_BcObCAIe.mjs";
import { n as sanitizeHeadersForSandbox, t as extractRequestMeta } from "./request-meta-DzXYYI-n_Dva0zy5x.mjs";
import "./comment-reaction-BUlUz2bh_Vu4AnkyX.mjs";
import "./menus-BxPLFfIc_Qsmtjm90.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import "./byline-C5TAqs8N_UXuC5WkK.mjs";
import { t as FTSManager } from "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import { o as getTaxonomyDefs, s as getTaxonomyTerms } from "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { n as SchemaRegistry } from "./registry-BP1JK2xh_C4nDpLUe.mjs";
import { t as PluginStateRepository } from "./state-xxv6ZTMv_CY4fwMam.mjs";
import { i as Permissions } from "./dist_Lsl8Hpq0.mjs";
import "./dashboard-DoBwPnON_BZ6Klac5.mjs";
import "./media-usage-DPJcNaAq_CWA56Ri3.mjs";
import "./zod-generator-DMzfga3g_DxHzNpJC.mjs";
import "./schema-eqZhkR0S_CJC5oLyH.mjs";
import "./sections-DSuEfirn_LC35OjDp.mjs";
import "./settings-CREKyj8I_sz1CfsBP.mjs";
import "./taxonomies-Dbdki3Un_Dc3Q5ZJ8.mjs";
import "./error-DmmN74gW_Djmejxxh.mjs";
import "./parse-BL49yb9D_DEZsBUX3.mjs";
import { s as invalidateUrlPatternCache } from "./query-DCiXI7OZ_B3DBnk_t.mjs";
import { t as index_lite_default } from "./index_lite_BlYWlefL.mjs";
import "./import-PKhLeXvn_D32uTAAY.mjs";
import "./email-console-C-9Ng8DM_BLDmwlIU.mjs";
import "./preview-D4Jnbfx7_C8PM7iIF.mjs";
import "./bylines-B8-WGdja_BuJyweeN.mjs";
import { t as getWidgetAreas } from "./widgets-L-VndTKD_CdeTNh8j.mjs";
import "./validate-Bs_wT2ul_BPxJkgx-.mjs";
import "./apply-1_6ra7NP_C-N_rG76.mjs";
import "./load-BwTdWE8B_DBSeomMw.mjs";
import "./search-CeO678cp_BTXu7Bkl.mjs";
import { n as VERSION, t as COMMIT } from "./version-BGLOkzgk_9sZYHkOK.mjs";
import { t as getAuthMode } from "./mode-fiXRMfeA_C0CvJuAB.mjs";
import { c as maybeRunScheduledBackup } from "./backup-BTjSjBmr_CasaMkN4.mjs";
import { t as cleanupExpiredChallenges } from "./challenge-store-BFzgFRog_BREs9zn7.mjs";
import { t as removeUploadAttempt } from "./upload-attempts-C5yd6Gae_D8Czl75D.mjs";
import { n as validateEncryptionKeyAtStartup } from "./secrets-870d-7yA_DAoCQXHi.mjs";
import { t as resolveSessionUser } from "./session-user-BrK2zz7S_Dc_rrKQB.mjs";
import { t as config_default } from "./config_DTEuujs6.mjs";
import { t as mediaProviders } from "./media-providers_Bac2BM-N.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { createReadStream, existsSync } from "node:fs";
import * as path$1 from "node:path";
import { Readable } from "node:stream";
import * as fs$1 from "node:fs/promises";
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
		this.directory = path$1.resolve(config.directory);
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
		const resolved = path$1.resolve(this.directory, normalizedKey);
		if (!resolved.startsWith(this.directory + path$1.sep) && resolved !== this.directory) throw new EmDashStorageError("Invalid file path", "INVALID_PATH");
		return resolved;
	}
	async upload(options) {
		try {
			const filePath = this.getFilePath(options.key);
			const dir = path$1.dirname(filePath);
			await fs$1.mkdir(dir, { recursive: true });
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
			await fs$1.writeFile(filePath, buffer);
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
			const stat = await fs$1.stat(filePath);
			const nodeStream = createReadStream(filePath);
			return {
				body: Readable.toWeb(nodeStream),
				contentType: getContentType(path$1.extname(key).toLowerCase()),
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
			await fs$1.unlink(filePath);
		} catch (error) {
			if (!isNodeError(error) || error.code !== "ENOENT") throw new EmDashStorageError(`Failed to delete file: ${key}`, "DELETE_FAILED", error);
		}
	}
	async exists(key) {
		try {
			const filePath = this.getFilePath(key);
			await fs$1.access(filePath);
			return true;
		} catch {
			return false;
		}
	}
	async list(options = {}) {
		try {
			const prefix = options.prefix || "";
			const searchDir = path$1.resolve(this.directory, path$1.dirname(prefix));
			if (!searchDir.startsWith(this.directory + path$1.sep) && searchDir !== this.directory) throw new EmDashStorageError("Invalid list prefix", "INVALID_PATH");
			const prefixBase = path$1.basename(prefix);
			try {
				await fs$1.access(searchDir);
			} catch {
				return { files: [] };
			}
			const entries = await fs$1.readdir(searchDir, { withFileTypes: true });
			const files = [];
			for (const entry of entries) if (entry.isFile() && entry.name.startsWith(prefixBase)) {
				const key = path$1.join(path$1.dirname(prefix), entry.name);
				const filePath = path$1.join(searchDir, entry.name);
				const stat = await fs$1.stat(filePath);
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
			const { adaptSandboxEntry } = await import("./adapt-sandbox-entry_BVHfmKPU.mjs");
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
					const { applySeed } = await import("./apply-1_6ra7NP_W5BmYU6Y.mjs").then((n) => n.n);
					const { loadSeed } = await import("./load-BwTdWE8B_BS1O0bQj.mjs").then((n) => n.r);
					const { validateSeed } = await import("./validate-Bs_wT2ul_CEU9JEk7.mjs").then((n) => n.n);
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
		const { adaptSandboxEntry } = await import("./adapt-sandbox-entry_BVHfmKPU.mjs");
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
			const { adaptSandboxEntry } = await import("./adapt-sandbox-entry_BVHfmKPU.mjs");
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
		const { validateContentData } = await import("./validation-BngR0nit_CdHQI10v.mjs");
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
		const { ContentRepository: ContentRepository2 } = await import("./content-CpfKV9QE_CtN__kj3.mjs").then((n) => n.n);
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
			const { validateContentData } = await import("./validation-BngR0nit_CdHQI10v.mjs");
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
async function withEmDashRuntime(run) {
	const config = getConfig();
	if (!config) throw new Error("EmDash is not configured — withEmDashRuntime() requires the emdash() Astro integration.");
	return runOutsideRequest(config, async (runtime) => run(runtime));
}
async function runOutsideRequest(config, fn) {
	const runtime = await getRuntime(config);
	const scoped = createRequestScopedDb$1({
		config: config.database?.config,
		isAuthenticated: false,
		isWrite: true,
		cookies: NOOP_COOKIE_JAR,
		url: CRON_EVENT_URL
	});
	if (!scoped?.close) return fn(runtime);
	const parent = getRequestContext();
	const ctx = parent ? {
		...parent,
		db: scoped.db
	} : {
		editMode: false,
		db: scoped.db,
		metrics: createRequestMetrics(performance.now())
	};
	try {
		return await runWithContext(ctx, () => fn(runtime));
	} finally {
		try {
			scoped.commit();
		} catch (error) {
			console.error("[emdash] event-scoped db commit failed:", error);
		}
		try {
			scoped.close();
		} catch (error) {
			console.error("[emdash] event-scoped db close failed:", error);
		}
	}
}
var NOOP_COOKIE_JAR = {
	get: () => void 0,
	set: () => {}
};
var CRON_EVENT_URL = new URL("https://cron.emdash.internal/");
function finalizeResponse(response, serverTimings) {
	const res = new Response(response.body, response);
	const astroCookies = Reflect.get(response, ASTRO_COOKIES_SYMBOL);
	if (astroCookies !== void 0) Reflect.set(res, ASTRO_COOKIES_SYMBOL, astroCookies);
	if (!res.headers.has("X-Content-Type-Options")) res.headers.set("X-Content-Type-Options", "nosniff");
	if (!res.headers.has("Referrer-Policy")) res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	if (!res.headers.has("Permissions-Policy")) res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
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
var onRequest = defineMiddleware(async (context, next) => {
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
						const { getDb: getDb2 } = await import("./loader-C1XOLV5b_BQAIjMMP.mjs").then((n) => n.o);
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
export { withEmDashRuntime as n, onRequest as t };
