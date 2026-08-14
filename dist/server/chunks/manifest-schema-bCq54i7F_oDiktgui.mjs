import { C as string, T as unknown, _ as number, a as _enum, c as array, f as discriminatedUnion, h as literal, l as boolean, v as object, w as union, x as record } from "./schemas_CzTFUUcv.mjs";
import { i as Permissions } from "./dist_Lsl8Hpq0.mjs";
//#region self-essentials/emdash-main/packages/plugin-types/dist/index.js
/**
* Zod schema for PluginManifest validation
*
* Used to validate manifest.json from plugin bundles at every parse site:
* - Client-side download (marketplace.ts extractBundle)
* - R2 load (api/handlers/marketplace.ts loadBundleFromR2)
* - CLI publish preview (cli/commands/publish.ts readManifestFromTarball)
* - Marketplace ingest extends this with publishing-specific fields
*/
/**
* Current capability names — the ones authors should use going forward.
* See `PluginCapability` in `types.ts` for documentation of each.
*/
var CURRENT_PLUGIN_CAPABILITIES$1 = [
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
	"hooks.page-fragments:register"
];
/**
* Legacy capability names accepted during the deprecation window.
* Normalized to current names via `normalizeCapability()` in types.ts
* before reaching the runtime. Plugin authors are warned at bundle/validate
* and hard-failed at publish.
*/
var DEPRECATED_PLUGIN_CAPABILITIES$1 = [
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
];
/**
* Full set of accepted capability strings — current + deprecated.
*
* The manifest schema accepts both during the transition. The runtime only
* ever sees current names because `normalizeCapability()` rewrites legacy
* names at every external boundary (definePlugin, adaptSandboxEntry).
*/
var PLUGIN_CAPABILITIES$1 = [...CURRENT_PLUGIN_CAPABILITIES$1, ...DEPRECATED_PLUGIN_CAPABILITIES$1];
/** Must stay in sync with FieldType in schema/types.ts */
var FIELD_TYPES$1 = [
	"string",
	"text",
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
];
var HOOK_NAMES$1 = [
	"plugin:install",
	"plugin:activate",
	"plugin:deactivate",
	"plugin:uninstall",
	"content:beforeSave",
	"content:afterSave",
	"content:beforeDelete",
	"content:afterDelete",
	"content:afterPublish",
	"content:afterUnpublish",
	"content:afterRestore",
	"content:afterSchedule",
	"content:afterUnschedule",
	"media:beforeUpload",
	"media:afterUpload",
	"cron",
	"email:beforeSend",
	"email:deliver",
	"email:afterSend",
	"comment:beforeCreate",
	"comment:moderate",
	"comment:afterCreate",
	"comment:afterModerate",
	"page:metadata",
	"page:fragments"
];
/**
* Structured hook entry for manifest — name plus optional metadata.
* During a transition period, both plain strings and objects are accepted.
*/
var manifestHookEntrySchema$1 = object({
	name: _enum(HOOK_NAMES$1),
	exclusive: boolean().optional(),
	priority: number().int().optional(),
	timeout: number().int().positive().optional()
});
/**
* Structured route entry for manifest — name plus optional metadata.
* Both plain strings and objects are accepted; strings are normalized
* to `{ name }` objects via `normalizeManifestRoute()`.
*/
/** Route names must be safe path segments — alphanumeric, hyphens, underscores, forward slashes */
var routeNamePattern$1 = /^[a-zA-Z0-9][a-zA-Z0-9_\-/]*$/;
var manifestRouteEntrySchema$1 = object({
	name: string().min(1).regex(routeNamePattern$1, "Route name must be a safe path segment"),
	public: boolean().optional()
});
/** Index field names must be valid identifiers to prevent SQL injection via JSON path expressions */
var indexFieldName$1 = string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/);
var storageCollectionSchema$1 = object({
	indexes: array(union([indexFieldName$1, array(indexFieldName$1)])),
	uniqueIndexes: array(union([indexFieldName$1, array(indexFieldName$1)])).optional()
});
var baseSettingFields$1 = {
	label: string(),
	description: string().optional()
};
var settingFieldSchema$1 = discriminatedUnion("type", [
	object({
		...baseSettingFields$1,
		type: literal("string"),
		default: string().optional(),
		multiline: boolean().optional()
	}),
	object({
		...baseSettingFields$1,
		type: literal("number"),
		default: number().optional(),
		min: number().optional(),
		max: number().optional()
	}),
	object({
		...baseSettingFields$1,
		type: literal("boolean"),
		default: boolean().optional()
	}),
	object({
		...baseSettingFields$1,
		type: literal("select"),
		options: array(object({
			value: string(),
			label: string()
		})),
		default: string().optional()
	}),
	object({
		...baseSettingFields$1,
		type: literal("secret")
	}),
	object({
		...baseSettingFields$1,
		type: literal("url"),
		default: string().optional(),
		placeholder: string().optional()
	}),
	object({
		...baseSettingFields$1,
		type: literal("email"),
		default: string().optional(),
		placeholder: string().optional()
	})
]);
var adminPageSchema$1 = object({
	path: string(),
	label: string(),
	icon: string().optional()
});
var dashboardWidgetSchema$1 = object({
	id: string(),
	size: _enum([
		"full",
		"half",
		"third"
	]).optional(),
	title: string().optional()
});
var pluginAdminConfigSchema$1 = object({
	entry: string().optional(),
	settingsSchema: record(string(), settingFieldSchema$1).optional(),
	pages: array(adminPageSchema$1).optional(),
	widgets: array(dashboardWidgetSchema$1).optional(),
	fieldWidgets: array(object({
		name: string().min(1),
		label: string().min(1),
		fieldTypes: array(_enum(FIELD_TYPES$1)),
		elements: array(object({
			type: string(),
			action_id: string(),
			label: string().optional()
		}).passthrough()).optional()
	})).optional()
});
/**
* An operation's constraint object. Open vocabulary: keys the runtime
* recognises are enforced, others are advisory. The bundler emits `{}` for a
* granted operation; presence (not value) signals the grant.
*/
var accessConstraints$1 = record(string(), unknown());
/**
* Structured trust contract embedded in the bundle manifest. Mirrors
* `DeclaredAccess` in `@emdash-cms/plugin-types`. Categories are host
* subsystems; operations are modes of participation.
*/
var declaredAccessSchema$1 = object({
	content: object({
		read: accessConstraints$1.optional(),
		write: accessConstraints$1.optional()
	}).optional(),
	taxonomies: object({ read: accessConstraints$1.optional() }).optional(),
	media: object({
		read: accessConstraints$1.optional(),
		write: accessConstraints$1.optional()
	}).optional(),
	network: object({ request: object({ allowedHosts: array(string()).min(1).optional() }).optional() }).optional(),
	email: object({
		send: accessConstraints$1.optional(),
		events: accessConstraints$1.optional(),
		transport: accessConstraints$1.optional()
	}).optional(),
	page: object({ fragments: accessConstraints$1.optional() }).optional(),
	users: object({ read: accessConstraints$1.optional() }).optional()
});
object({
	id: string().min(1),
	version: string().min(1),
	declaredAccess: declaredAccessSchema$1.optional(),
	capabilities: array(_enum(PLUGIN_CAPABILITIES$1)),
	allowedHosts: array(string()),
	storage: record(string(), storageCollectionSchema$1),
	hooks: array(union([_enum(HOOK_NAMES$1), manifestHookEntrySchema$1])),
	routes: array(union([string().min(1).regex(routeNamePattern$1, "Route name must be a safe path segment"), manifestRouteEntrySchema$1])),
	admin: pluginAdminConfigSchema$1
});
/**
* Mapping from deprecated capability names to their current replacements.
*
* Used to compare manifests across the rename without flagging spurious
* "capability changed" prompts on upgrade, and to produce the warning
* messages at bundle time.
*/
var CAPABILITY_RENAMES = Object.freeze({
	"network:fetch": "network:request",
	"network:fetch:any": "network:request:unrestricted",
	"read:content": "content:read",
	"write:content": "content:write",
	"read:media": "media:read",
	"write:media": "media:write",
	"read:users": "users:read",
	"email:provide": "hooks.email-transport:register",
	"email:intercept": "hooks.email-events:register",
	"page:inject": "hooks.page-fragments:register"
});
/**
* Type guard: is this capability one of the deprecated legacy names?
*
* Uses an own-property check so prototype keys like "toString" don't
* accidentally pass.
*/
function isDeprecatedCapability(cap) {
	return Object.hasOwn(CAPABILITY_RENAMES, cap);
}
/**
* Normalize a capability string -- deprecated names map to current names,
* current names pass through unchanged. Unknown strings are returned as-is
* so downstream validators can produce a precise error.
*/
function normalizeCapability(cap) {
	if (isDeprecatedCapability(cap)) return CAPABILITY_RENAMES[cap];
	return cap;
}
/**
* Normalize an array of capability strings, preserving order and removing
* duplicates introduced by aliasing (e.g. a manifest declaring both
* `network:fetch` and `network:request` should resolve to a single
* `network:request`).
*/
function normalizeCapabilities(caps) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const cap of caps) {
		const norm = normalizeCapability(cap);
		if (!seen.has(norm)) {
			seen.add(norm);
			out.push(norm);
		}
	}
	return out;
}
/**
* Lower a normalized capability list + `allowedHosts` into the structured
* `declaredAccess` contract. Total over the current capability vocabulary and
* the inverse of {@link declaredAccessToCapabilities} for implication-closed
* inputs (the shape `definePlugin` produces).
*
* Network semantics are faithful to the legacy capability/allowedHosts model:
* an ABSENT `allowedHosts` key means unrestricted (`network:request:unrestricted`);
* a PRESENT `allowedHosts` -- even an empty array -- means host-restricted
* (`network:request`), where the empty list is deny-all at the runtime boundary.
* An empty list never widens to unrestricted. (The record lexicon forbids the
* empty array and publish rejects `network:request` with no hosts, so deny-all
* only arises for non-registry/in-process plugins.)
*/
function capabilitiesToDeclaredAccess(capabilities, allowedHosts) {
	const caps = new Set(capabilities.map((c) => normalizeCapability(c)));
	const out = {};
	if (caps.has("content:read") || caps.has("content:write")) {
		out.content = { read: {} };
		if (caps.has("content:write")) out.content.write = {};
	}
	if (caps.has("taxonomies:read")) out.taxonomies = { read: {} };
	if (caps.has("media:read") || caps.has("media:write")) {
		out.media = { read: {} };
		if (caps.has("media:write")) out.media.write = {};
	}
	if (caps.has("network:request:unrestricted")) out.network = { request: {} };
	else if (caps.has("network:request")) out.network = { request: { allowedHosts: [...allowedHosts] } };
	if (caps.has("email:send")) (out.email ??= {}).send = {};
	if (caps.has("hooks.email-events:register")) (out.email ??= {}).events = {};
	if (caps.has("hooks.email-transport:register")) (out.email ??= {}).transport = {};
	if (caps.has("hooks.page-fragments:register")) out.page = { fragments: {} };
	if (caps.has("users:read")) out.users = { read: {} };
	return out;
}
/**
* Raise a `declaredAccess` block back to normalized capability strings +
* `allowedHosts` -- the runtime's internal enforcement currency. Total: every
* facet maps to exactly one capability. The result is closed under the same
* implications `definePlugin` applies (write implies read; unrestricted implies
* request), so it round-trips with {@link capabilitiesToDeclaredAccess}.
*/
function declaredAccessToCapabilities(declaredAccess) {
	const caps = /* @__PURE__ */ new Set();
	let allowedHosts = [];
	if (declaredAccess.content?.read) caps.add("content:read");
	if (declaredAccess.content?.write) {
		caps.add("content:write");
		caps.add("content:read");
	}
	if (declaredAccess.taxonomies?.read) caps.add("taxonomies:read");
	if (declaredAccess.media?.read) caps.add("media:read");
	if (declaredAccess.media?.write) {
		caps.add("media:write");
		caps.add("media:read");
	}
	if (declaredAccess.network?.request) {
		const hosts = declaredAccess.network.request.allowedHosts;
		if (hosts === void 0) {
			caps.add("network:request:unrestricted");
			caps.add("network:request");
		} else {
			caps.add("network:request");
			allowedHosts = [...hosts];
		}
	}
	if (declaredAccess.email?.send) caps.add("email:send");
	if (declaredAccess.email?.events) caps.add("hooks.email-events:register");
	if (declaredAccess.email?.transport) caps.add("hooks.email-transport:register");
	if (declaredAccess.page?.fragments) caps.add("hooks.page-fragments:register");
	if (declaredAccess.users?.read) caps.add("users:read");
	return {
		capabilities: [...caps],
		allowedHosts
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/manifest-schema-bCq54i7F.mjs
/**
* Zod schema for PluginManifest validation
*
* Used to validate manifest.json from plugin bundles at every parse site:
* - Client-side download (marketplace.ts extractBundle)
* - R2 load (api/handlers/marketplace.ts loadBundleFromR2)
* - CLI publish preview (cli/commands/publish.ts readManifestFromTarball)
* - Marketplace ingest extends this with publishing-specific fields
*/
/**
* Current capability names — the ones authors should use going forward.
* See `PluginCapability` in `types.ts` for documentation of each.
*/
var CURRENT_PLUGIN_CAPABILITIES = [
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
	"hooks.page-fragments:register"
];
/**
* Legacy capability names accepted during the deprecation window.
* Normalized to current names via `normalizeCapability()` in types.ts
* before reaching the runtime. Plugin authors are warned at bundle/validate
* and hard-failed at publish.
*/
var DEPRECATED_PLUGIN_CAPABILITIES = [
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
];
/**
* Full set of accepted capability strings — current + deprecated.
*
* The manifest schema accepts both during the transition. The runtime only
* ever sees current names because `normalizeCapability()` rewrites legacy
* names at every external boundary (definePlugin, adaptSandboxEntry).
*/
var PLUGIN_CAPABILITIES = [...CURRENT_PLUGIN_CAPABILITIES, ...DEPRECATED_PLUGIN_CAPABILITIES];
/** Must stay in sync with FieldType in schema/types.ts */
var FIELD_TYPES = [
	"string",
	"text",
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
];
var HOOK_NAMES = [
	"plugin:install",
	"plugin:activate",
	"plugin:deactivate",
	"plugin:uninstall",
	"content:beforeSave",
	"content:afterSave",
	"content:beforeDelete",
	"content:afterDelete",
	"content:afterPublish",
	"content:afterUnpublish",
	"content:afterRestore",
	"content:afterSchedule",
	"content:afterUnschedule",
	"media:beforeUpload",
	"media:afterUpload",
	"cron",
	"email:beforeSend",
	"email:deliver",
	"email:afterSend",
	"comment:beforeCreate",
	"comment:moderate",
	"comment:afterCreate",
	"comment:afterModerate",
	"page:metadata",
	"page:fragments"
];
/**
* Structured hook entry for manifest — name plus optional metadata.
* During a transition period, both plain strings and objects are accepted.
*/
var manifestHookEntrySchema = object({
	name: _enum(HOOK_NAMES),
	exclusive: boolean().optional(),
	priority: number().int().optional(),
	timeout: number().int().positive().optional()
});
/**
* Structured route entry for manifest — name plus optional metadata.
* Both plain strings and objects are accepted; strings are normalized
* to `{ name }` objects via `normalizeManifestRoute()`.
*/
/** Route names must be safe path segments — alphanumeric, hyphens, underscores, forward slashes */
var routeNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_\-/]*$/;
var manifestRouteEntrySchema = object({
	name: string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
	public: boolean().optional(),
	permission: string().refine((permission) => permission in Permissions).optional(),
	cacheControl: string().min(1).optional()
});
var pluginJsonSchema = record(string(), unknown());
var pluginMcpConfigSchema = object({ tools: array(object({
	name: string().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/, "Invalid MCP tool name"),
	description: string().min(1),
	route: string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
	permission: string().refine((permission) => permission in Permissions),
	destructive: boolean(),
	inputSchema: pluginJsonSchema,
	outputSchema: pluginJsonSchema.optional()
})) });
/** Index field names must be valid identifiers to prevent SQL injection via JSON path expressions */
var indexFieldName = string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/);
var storageCollectionSchema = object({
	indexes: array(union([indexFieldName, array(indexFieldName)])),
	uniqueIndexes: array(union([indexFieldName, array(indexFieldName)])).optional()
});
var baseSettingFields = {
	label: string(),
	description: string().optional()
};
var settingFieldSchema = discriminatedUnion("type", [
	object({
		...baseSettingFields,
		type: literal("string"),
		default: string().optional(),
		multiline: boolean().optional()
	}),
	object({
		...baseSettingFields,
		type: literal("number"),
		default: number().optional(),
		min: number().optional(),
		max: number().optional()
	}),
	object({
		...baseSettingFields,
		type: literal("boolean"),
		default: boolean().optional()
	}),
	object({
		...baseSettingFields,
		type: literal("select"),
		options: array(object({
			value: string(),
			label: string()
		})),
		default: string().optional()
	}),
	object({
		...baseSettingFields,
		type: literal("secret")
	}),
	object({
		...baseSettingFields,
		type: literal("url"),
		default: string().optional(),
		placeholder: string().optional()
	}),
	object({
		...baseSettingFields,
		type: literal("email"),
		default: string().optional(),
		placeholder: string().optional()
	})
]);
var adminPageSchema = object({
	path: string(),
	label: string(),
	icon: string().optional()
});
var dashboardWidgetSchema = object({
	id: string(),
	size: _enum([
		"full",
		"half",
		"third"
	]).optional(),
	title: string().optional()
});
var pluginAdminConfigSchema = object({
	entry: string().optional(),
	settingsSchema: record(string(), settingFieldSchema).optional(),
	pages: array(adminPageSchema).optional(),
	widgets: array(dashboardWidgetSchema).optional(),
	fieldWidgets: array(object({
		name: string().min(1),
		label: string().min(1),
		fieldTypes: array(_enum(FIELD_TYPES)),
		elements: array(object({
			type: string(),
			action_id: string(),
			label: string().optional()
		}).passthrough()).optional()
	})).optional()
});
/**
* An operation's constraint object. Open vocabulary: keys the runtime
* recognises are enforced, others are advisory. The bundler emits `{}` for a
* granted operation; presence (not value) signals the grant.
*/
var accessConstraints = record(string(), unknown());
/**
* Structured trust contract embedded in the bundle manifest. Mirrors
* `DeclaredAccess` in `@emdash-cms/plugin-types`. Categories are host
* subsystems; operations are modes of participation.
*/
var declaredAccessSchema = object({
	content: object({
		read: accessConstraints.optional(),
		write: accessConstraints.optional()
	}).optional(),
	taxonomies: object({ read: accessConstraints.optional() }).optional(),
	media: object({
		read: accessConstraints.optional(),
		write: accessConstraints.optional()
	}).optional(),
	network: object({ request: object({ allowedHosts: array(string()).min(1).optional() }).optional() }).optional(),
	email: object({
		send: accessConstraints.optional(),
		events: accessConstraints.optional(),
		transport: accessConstraints.optional()
	}).optional(),
	page: object({ fragments: accessConstraints.optional() }).optional(),
	users: object({ read: accessConstraints.optional() }).optional()
});
/**
* Zod schema matching the PluginManifest interface from types.ts.
*
* Every JSON.parse of a manifest.json should validate through this.
*
* `declaredAccess` is the trust contract; `capabilities`/`allowedHosts` are the
* runtime's enforcement currency. Apply `reconcileManifestAccess` after parsing
* to make them consistent (declaredAccess authoritative when present). Kept a
* plain object (no `.transform`) because callers `.pick()`/`.extend()` it.
*/
var pluginManifestSchema = object({
	id: string().min(1),
	version: string().min(1),
	declaredAccess: declaredAccessSchema.optional(),
	capabilities: array(_enum(PLUGIN_CAPABILITIES)),
	allowedHosts: array(string()),
	storage: record(string(), storageCollectionSchema),
	hooks: array(union([_enum(HOOK_NAMES), manifestHookEntrySchema])),
	routes: array(union([string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"), manifestRouteEntrySchema])),
	mcp: pluginMcpConfigSchema.optional(),
	admin: pluginAdminConfigSchema
});
/**
* Reconcile a parsed manifest's trust contract with its enforcement currency.
* `declaredAccess` is authoritative: when present, `capabilities`/`allowedHosts`
* are re-derived from it so what the runtime enforces always matches what was
* recorded and consented to. A pre-migration bundle without `declaredAccess`
* has it derived from the legacy capability list instead. The result always
* carries both, mutually consistent. Apply this at every bundle-parse site.
*/
function reconcileManifestAccess(manifest) {
	return manifest.declaredAccess ? {
		...manifest,
		...declaredAccessToCapabilities(manifest.declaredAccess)
	} : {
		...manifest,
		declaredAccess: capabilitiesToDeclaredAccess(manifest.capabilities, manifest.allowedHosts)
	};
}
/**
* Normalize a manifest route entry — plain strings become `{ name }` objects.
*/
function normalizeManifestRoute(entry) {
	if (typeof entry === "string") return { name: entry };
	return entry;
}
//#endregion
export { reconcileManifestAccess as a, pluginManifestSchema as i, PLUGIN_CAPABILITIES as n, declaredAccessToCapabilities as o, normalizeManifestRoute as r, normalizeCapabilities as s, HOOK_NAMES as t };
