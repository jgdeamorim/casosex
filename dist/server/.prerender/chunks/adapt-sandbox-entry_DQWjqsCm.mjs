import { r as encodeBase64urlNoPadding } from "./dist_Yqq_s2RP.mjs";
import { _ as record, b as union, c as boolean, d as discriminatedUnion, h as object, i as _enum, m as number, p as literal, s as array, x as unknown, y as string } from "./schemas_Cq5OeI4c.mjs";
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
//#region self-essentials/emdash-main/packages/auth/dist/types-ndj-bYfi.mjs
/**
* Core types for @emdash-cms/auth
*/
var Role = {
	SUBSCRIBER: 10,
	CONTRIBUTOR: 20,
	AUTHOR: 30,
	EDITOR: 40,
	ADMIN: 50
};
var ROLE_LEVEL_MAP = new Map(Object.values(Role).map((v) => [v, v]));
function toRoleLevel(value) {
	const level = ROLE_LEVEL_MAP.get(value);
	if (level !== void 0) return level;
	throw new Error(`Invalid role level: ${value}`);
}
var DEVICE_TYPE_MAP = {
	singleDevice: "singleDevice",
	multiDevice: "multiDevice"
};
function toDeviceType(value) {
	const dt = DEVICE_TYPE_MAP[value];
	if (dt !== void 0) return dt;
	throw new Error(`Invalid device type: ${value}`);
}
var TOKEN_TYPE_MAP = {
	magic_link: "magic_link",
	email_verify: "email_verify",
	invite: "invite",
	recovery: "recovery"
};
function toTokenType(value) {
	const tt = TOKEN_TYPE_MAP[value];
	if (tt !== void 0) return tt;
	throw new Error(`Invalid token type: ${value}`);
}
//#endregion
//#region node_modules/.pnpm/@oslojs+binary@1.0.0/node_modules/@oslojs/binary/dist/uint.js
var BigEndian = class {
	uint8(data, offset) {
		if (data.byteLength < offset + 1) throw new TypeError("Insufficient bytes");
		return data[offset];
	}
	uint16(data, offset) {
		if (data.byteLength < offset + 2) throw new TypeError("Insufficient bytes");
		return data[offset] << 8 | data[offset + 1];
	}
	uint32(data, offset) {
		if (data.byteLength < offset + 4) throw new TypeError("Insufficient bytes");
		let result = 0;
		for (let i = 0; i < 4; i++) result |= data[offset + i] << 24 - i * 8;
		return result;
	}
	uint64(data, offset) {
		if (data.byteLength < offset + 8) throw new TypeError("Insufficient bytes");
		let result = 0n;
		for (let i = 0; i < 8; i++) result |= BigInt(data[offset + i]) << BigInt(56 - i * 8);
		return result;
	}
	putUint8(target, value, offset) {
		if (target.length < offset + 1) throw new TypeError("Not enough space");
		if (value < 0 || value > 255) throw new TypeError("Invalid uint8 value");
		target[offset] = value;
	}
	putUint16(target, value, offset) {
		if (target.length < offset + 2) throw new TypeError("Not enough space");
		if (value < 0 || value > 65535) throw new TypeError("Invalid uint16 value");
		target[offset] = value >> 8;
		target[offset + 1] = value & 255;
	}
	putUint32(target, value, offset) {
		if (target.length < offset + 4) throw new TypeError("Not enough space");
		if (value < 0 || value > 4294967295) throw new TypeError("Invalid uint32 value");
		for (let i = 0; i < 4; i++) target[offset + i] = value >> (3 - i) * 8 & 255;
	}
	putUint64(target, value, offset) {
		if (target.length < offset + 8) throw new TypeError("Not enough space");
		if (value < 0 || value > 18446744073709551615n) throw new TypeError("Invalid uint64 value");
		for (let i = 0; i < 8; i++) target[offset + i] = Number(value >> BigInt((7 - i) * 8) & 255n);
	}
};
var LittleEndian = class {
	uint8(data, offset) {
		if (data.byteLength < offset + 1) throw new TypeError("Insufficient bytes");
		return data[offset];
	}
	uint16(data, offset) {
		if (data.byteLength < offset + 2) throw new TypeError("Insufficient bytes");
		return data[offset] | data[offset + 1] << 8;
	}
	uint32(data, offset) {
		if (data.byteLength < offset + 4) throw new TypeError("Insufficient bytes");
		let result = 0;
		for (let i = 0; i < 4; i++) result |= data[offset + i] << i * 8;
		return result;
	}
	uint64(data, offset) {
		if (data.byteLength < offset + 8) throw new TypeError("Insufficient bytes");
		let result = 0n;
		for (let i = 0; i < 8; i++) result |= BigInt(data[offset + i]) << BigInt(i * 8);
		return result;
	}
	putUint8(target, value, offset) {
		if (target.length < 1 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 255) throw new TypeError("Invalid uint8 value");
		target[offset] = value;
	}
	putUint16(target, value, offset) {
		if (target.length < 2 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 65535) throw new TypeError("Invalid uint16 value");
		target[offset + 1] = value >> 8;
		target[offset] = value & 255;
	}
	putUint32(target, value, offset) {
		if (target.length < 4 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 4294967295) throw new TypeError("Invalid uint32 value");
		for (let i = 0; i < 4; i++) target[offset + i] = value >> i * 8 & 255;
	}
	putUint64(target, value, offset) {
		if (target.length < 8 + offset) throw new TypeError("Insufficient space");
		if (value < 0 || value > 18446744073709551615n) throw new TypeError("Invalid uint64 value");
		for (let i = 0; i < 8; i++) target[offset + i] = Number(value >> BigInt(i * 8) & 255n);
	}
};
var bigEndian = new BigEndian();
new LittleEndian();
//#endregion
//#region node_modules/.pnpm/@oslojs+binary@1.0.0/node_modules/@oslojs/binary/dist/bits.js
function rotr32(x, n) {
	return (x << 32 - n | x >>> n) >>> 0;
}
//#endregion
//#region node_modules/.pnpm/@oslojs+binary@1.0.0/node_modules/@oslojs/binary/dist/big.js
function bigIntBytes(value) {
	if (value < 0n) value = value * -1n;
	let byteLength = 1;
	while (value > 2n ** BigInt(byteLength * 8) - 1n) byteLength++;
	const encoded = new Uint8Array(byteLength);
	for (let i = 0; i < encoded.byteLength; i++) encoded[i] = Number(value >> BigInt((encoded.byteLength - i - 1) * 8) & 255n);
	return encoded;
}
new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
//#endregion
//#region node_modules/.pnpm/@oslojs+crypto@1.0.1/node_modules/@oslojs/crypto/dist/sha2/sha256.js
function sha256(data) {
	const hash = new SHA256();
	hash.update(data);
	return hash.digest();
}
var SHA256 = class {
	blockSize = 64;
	size = 32;
	blocks = /* @__PURE__ */ new Uint8Array(64);
	currentBlockSize = 0;
	H = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
	l = 0n;
	w = /* @__PURE__ */ new Uint32Array(64);
	update(data) {
		this.l += BigInt(data.byteLength) * 8n;
		if (this.currentBlockSize + data.byteLength < 64) {
			this.blocks.set(data, this.currentBlockSize);
			this.currentBlockSize += data.byteLength;
			return;
		}
		let processed = 0;
		if (this.currentBlockSize > 0) {
			const next = data.slice(0, 64 - this.currentBlockSize);
			this.blocks.set(next, this.currentBlockSize);
			this.process();
			processed += next.byteLength;
			this.currentBlockSize = 0;
		}
		while (processed + 64 <= data.byteLength) {
			const next = data.slice(processed, processed + 64);
			this.blocks.set(next);
			this.process();
			processed += 64;
		}
		if (data.byteLength - processed > 0) {
			const remaining = data.slice(processed);
			this.blocks.set(remaining);
			this.currentBlockSize = remaining.byteLength;
		}
	}
	digest() {
		this.blocks[this.currentBlockSize] = 128;
		this.currentBlockSize += 1;
		if (64 - this.currentBlockSize < 8) {
			this.blocks.fill(0, this.currentBlockSize);
			this.process();
			this.currentBlockSize = 0;
		}
		this.blocks.fill(0, this.currentBlockSize);
		bigEndian.putUint64(this.blocks, this.l, this.blockSize - 8);
		this.process();
		const result = /* @__PURE__ */ new Uint8Array(32);
		for (let i = 0; i < 8; i++) bigEndian.putUint32(result, this.H[i], i * 4);
		return result;
	}
	process() {
		for (let t = 0; t < 16; t++) this.w[t] = (this.blocks[t * 4] << 24 | this.blocks[t * 4 + 1] << 16 | this.blocks[t * 4 + 2] << 8 | this.blocks[t * 4 + 3]) >>> 0;
		for (let t = 16; t < 64; t++) {
			const sigma1 = (rotr32(this.w[t - 2], 17) ^ rotr32(this.w[t - 2], 19) ^ this.w[t - 2] >>> 10) >>> 0;
			const sigma0 = (rotr32(this.w[t - 15], 7) ^ rotr32(this.w[t - 15], 18) ^ this.w[t - 15] >>> 3) >>> 0;
			this.w[t] = sigma1 + this.w[t - 7] + sigma0 + this.w[t - 16] | 0;
		}
		let a = this.H[0];
		let b = this.H[1];
		let c = this.H[2];
		let d = this.H[3];
		let e = this.H[4];
		let f = this.H[5];
		let g = this.H[6];
		let h = this.H[7];
		for (let t = 0; t < 64; t++) {
			const sigma1 = (rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25)) >>> 0;
			const ch = (e & f ^ ~e & g) >>> 0;
			const t1 = h + sigma1 + ch + K$4[t] + this.w[t] | 0;
			const t2 = ((rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22)) >>> 0) + ((a & b ^ a & c ^ b & c) >>> 0) | 0;
			h = g;
			g = f;
			f = e;
			e = d + t1 | 0;
			d = c;
			c = b;
			b = a;
			a = t1 + t2 | 0;
		}
		this.H[0] = a + this.H[0] | 0;
		this.H[1] = b + this.H[1] | 0;
		this.H[2] = c + this.H[2] | 0;
		this.H[3] = d + this.H[3] | 0;
		this.H[4] = e + this.H[4] | 0;
		this.H[5] = f + this.H[5] | 0;
		this.H[6] = g + this.H[6] | 0;
		this.H[7] = h + this.H[7] | 0;
	}
};
var K$4 = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
new BigUint64Array([
	4794697086780616226n,
	8158064640168781261n,
	13096744586834688815n,
	16840607885511220156n,
	4131703408338449720n,
	6480981068601479193n,
	10538285296894168987n,
	12329834152419229976n,
	15566598209576043074n,
	1334009975649890238n,
	2608012711638119052n,
	6128411473006802146n,
	8268148722764581231n,
	9286055187155687089n,
	11230858885718282805n,
	13951009754708518548n,
	16472876342353939154n,
	17275323862435702243n,
	1135362057144423861n,
	2597628984639134821n,
	3308224258029322869n,
	5365058923640841347n,
	6679025012923562964n,
	8573033837759648693n,
	10970295158949994411n,
	12119686244451234320n,
	12683024718118986047n,
	13788192230050041572n,
	14330467153632333762n,
	15395433587784984357n,
	489312712824947311n,
	1452737877330783856n,
	2861767655752347644n,
	3322285676063803686n,
	5560940570517711597n,
	5996557281743188959n,
	7280758554555802590n,
	8532644243296465576n,
	9350256976987008742n,
	10552545826968843579n,
	11727347734174303076n,
	12113106623233404929n,
	14000437183269869457n,
	14369950271660146224n,
	15101387698204529176n,
	15463397548674623760n,
	17586052441742319658n,
	1182934255886127544n,
	1847814050463011016n,
	2177327727835720531n,
	2830643537854262169n,
	3796741975233480872n,
	4115178125766777443n,
	5681478168544905931n,
	6601373596472566643n,
	7507060721942968483n,
	8399075790359081724n,
	8693463985226723168n,
	9568029438360202098n,
	10144078919501101548n,
	10430055236837252648n,
	11840083180663258601n,
	13761210420658862357n,
	14299343276471374635n,
	14566680578165727644n,
	15097957966210449927n,
	16922976911328602910n,
	17689382322260857208n,
	500013540394364858n,
	748580250866718886n,
	1242879168328830382n,
	1977374033974150939n,
	2944078676154940804n,
	3659926193048069267n,
	4368137639120453308n,
	4836135668995329356n,
	5532061633213252278n,
	6448918945643986474n,
	6902733635092675308n,
	7801388544844847127n
]);
//#endregion
//#region node_modules/.pnpm/@oslojs+crypto@1.0.1/node_modules/@oslojs/crypto/dist/ecdsa/math.js
function euclideanMod(x, y) {
	const r = x % y;
	if (r < 0n) return r + y;
	return r;
}
function inverseMod(a, n) {
	if (n < 0) n = n * -1n;
	if (a < 0) a = euclideanMod(a, n);
	let dividend = a;
	let divisor = n;
	let remainder = dividend % divisor;
	let quotient = dividend / divisor;
	let s1 = 1n;
	let s2 = 0n;
	let s3 = s1 - quotient * s2;
	while (remainder !== 0n) {
		dividend = divisor;
		divisor = remainder;
		s1 = s2;
		s2 = s3;
		remainder = dividend % divisor;
		quotient = dividend / divisor;
		s3 = s1 - quotient * s2;
	}
	if (divisor !== 1n) throw new Error("a and n is not relatively prime");
	if (s2 < 0) return s2 + n;
	return s2;
}
//#endregion
//#region node_modules/.pnpm/@oslojs+crypto@1.0.1/node_modules/@oslojs/crypto/dist/ecdsa/curve.js
var ECDSAPoint = class {
	x;
	y;
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
};
var JacobianPoint = class {
	x;
	y;
	z;
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	isAtInfinity() {
		return this.x === 0n && this.y === 1n && this.z === 0n;
	}
};
var ECDSANamedCurve = class {
	p;
	a;
	b;
	g;
	n;
	cofactor;
	size;
	objectIdentifier;
	constructor(p, a, b, gx, gy, n, cofactor, size, objectIdentifier) {
		this.p = p;
		this.a = a;
		this.b = b;
		this.g = new ECDSAPoint(gx, gy);
		this.n = n;
		this.cofactor = cofactor;
		this.size = size;
		this.objectIdentifier = objectIdentifier;
	}
	add(point1, point2) {
		const jacobian1 = this.fromAffine(point1);
		const jacobian2 = this.fromAffine(point2);
		return this.toAffine(this.addJacobian(jacobian1, jacobian2));
	}
	addJacobian(point1, point2) {
		if (point1.isAtInfinity()) return point2;
		if (point2.isAtInfinity()) return point1;
		const point1zz = point1.z ** 2n;
		const point2zz = point2.z ** 2n;
		const u1 = euclideanMod(point1.x * point2zz, this.p);
		const u2 = euclideanMod(point2.x * point1zz, this.p);
		const s1 = euclideanMod(point1.y * point2zz * point2.z, this.p);
		const s2 = euclideanMod(point2.y * point1zz * point1.z, this.p);
		if (u1 === u2) {
			if (s1 !== s2) return pointAtInfinity();
			return this.doubleJacobian(point1);
		}
		const h = u2 - u1;
		const r = s2 - s1;
		const point3x = euclideanMod(r ** 2n - h ** 3n - 2n * u1 * h ** 2n, this.p);
		return new JacobianPoint(point3x, euclideanMod(r * (u1 * h ** 2n - point3x) - s1 * h ** 3n, this.p), euclideanMod(h * point1.z * point2.z, this.p));
	}
	double(point) {
		const jacobian = this.fromAffine(point);
		return this.toAffine(this.doubleJacobian(jacobian));
	}
	doubleJacobian(point) {
		if (point.isAtInfinity()) return point;
		if (point.y === 0n) return pointAtInfinity();
		const s = euclideanMod(4n * point.x * point.y ** 2n, this.p);
		const m = euclideanMod(3n * point.x ** 2n + this.a * point.z ** 4n, this.p);
		const resultx = euclideanMod(m ** 2n - 2n * s, this.p);
		return new JacobianPoint(resultx, euclideanMod(m * (s - resultx) - 8n * point.y ** 4n, this.p), euclideanMod(2n * point.y * point.z, this.p));
	}
	toAffine(point) {
		if (point.isAtInfinity()) return null;
		const inverseZ = inverseMod(point.z, this.p);
		const inverseZ2 = inverseZ ** 2n;
		return new ECDSAPoint(euclideanMod(point.x * inverseZ2, this.p), euclideanMod(point.y * inverseZ2 * inverseZ, this.p));
	}
	fromAffine(point) {
		return new JacobianPoint(point.x, point.y, 1n);
	}
	multiply(k, point) {
		const kBytes = bigIntBytes(k);
		const bitLength = k.toString(2).length;
		let res = pointAtInfinity();
		let temp = new JacobianPoint(point.x, point.y, 1n);
		for (let i = 0; i < bitLength; i++) {
			if (kBytes[kBytes.byteLength - 1 - Math.floor(i / 8)] >> i % 8 & 1) res = this.addJacobian(res, temp);
			temp = this.doubleJacobian(temp);
		}
		return this.toAffine(res);
	}
	isOnCurve(point) {
		if (this.cofactor !== 1n && this.multiply(this.n, point) !== null) return false;
		return euclideanMod(point.y ** 2n, this.p) === euclideanMod(point.x ** 3n + this.a * point.x + this.b, this.p);
	}
};
function pointAtInfinity() {
	return new JacobianPoint(0n, 1n, 0n);
}
//#endregion
//#region node_modules/.pnpm/@oslojs+asn1@1.0.0/node_modules/@oslojs/asn1/dist/asn1.js
var RealBinaryEncodingBase;
(function(RealBinaryEncodingBase) {
	RealBinaryEncodingBase[RealBinaryEncodingBase["Base2"] = 0] = "Base2";
	RealBinaryEncodingBase[RealBinaryEncodingBase["Base8"] = 1] = "Base8";
	RealBinaryEncodingBase[RealBinaryEncodingBase["Base16"] = 2] = "Base16";
})(RealBinaryEncodingBase || (RealBinaryEncodingBase = {}));
var RealDecimalEncodingFormat;
(function(RealDecimalEncodingFormat) {
	RealDecimalEncodingFormat[RealDecimalEncodingFormat["ISO6093NR1"] = 0] = "ISO6093NR1";
	RealDecimalEncodingFormat[RealDecimalEncodingFormat["ISO6093NR2"] = 1] = "ISO6093NR2";
	RealDecimalEncodingFormat[RealDecimalEncodingFormat["ISO6093NR3"] = 2] = "ISO6093NR3";
})(RealDecimalEncodingFormat || (RealDecimalEncodingFormat = {}));
var SpecialReal;
(function(SpecialReal) {
	SpecialReal[SpecialReal["PlusInfinity"] = 0] = "PlusInfinity";
	SpecialReal[SpecialReal["MinusInfinity"] = 1] = "MinusInfinity";
})(SpecialReal || (SpecialReal = {}));
var ASN1UniversalType;
(function(ASN1UniversalType) {
	ASN1UniversalType[ASN1UniversalType["Boolean"] = 0] = "Boolean";
	ASN1UniversalType[ASN1UniversalType["Integer"] = 1] = "Integer";
	ASN1UniversalType[ASN1UniversalType["BitString"] = 2] = "BitString";
	ASN1UniversalType[ASN1UniversalType["OctetString"] = 3] = "OctetString";
	ASN1UniversalType[ASN1UniversalType["Null"] = 4] = "Null";
	ASN1UniversalType[ASN1UniversalType["ObjectIdentifier"] = 5] = "ObjectIdentifier";
	ASN1UniversalType[ASN1UniversalType["ObjectDescriptor"] = 6] = "ObjectDescriptor";
	ASN1UniversalType[ASN1UniversalType["External"] = 7] = "External";
	ASN1UniversalType[ASN1UniversalType["Real"] = 8] = "Real";
	ASN1UniversalType[ASN1UniversalType["Enumerated"] = 9] = "Enumerated";
	ASN1UniversalType[ASN1UniversalType["EmbeddedPDV"] = 10] = "EmbeddedPDV";
	ASN1UniversalType[ASN1UniversalType["UTF8String"] = 11] = "UTF8String";
	ASN1UniversalType[ASN1UniversalType["RelativeObjectIdentifier"] = 12] = "RelativeObjectIdentifier";
	ASN1UniversalType[ASN1UniversalType["Time"] = 13] = "Time";
	ASN1UniversalType[ASN1UniversalType["Sequence"] = 14] = "Sequence";
	ASN1UniversalType[ASN1UniversalType["Set"] = 15] = "Set";
	ASN1UniversalType[ASN1UniversalType["NumericString"] = 16] = "NumericString";
	ASN1UniversalType[ASN1UniversalType["PrintableString"] = 17] = "PrintableString";
	ASN1UniversalType[ASN1UniversalType["TeletexString"] = 18] = "TeletexString";
	ASN1UniversalType[ASN1UniversalType["VideotextString"] = 19] = "VideotextString";
	ASN1UniversalType[ASN1UniversalType["IA5String"] = 20] = "IA5String";
	ASN1UniversalType[ASN1UniversalType["UTCTime"] = 21] = "UTCTime";
	ASN1UniversalType[ASN1UniversalType["GeneralizedTime"] = 22] = "GeneralizedTime";
	ASN1UniversalType[ASN1UniversalType["GraphicString"] = 23] = "GraphicString";
	ASN1UniversalType[ASN1UniversalType["VisibleString"] = 24] = "VisibleString";
	ASN1UniversalType[ASN1UniversalType["GeneralString"] = 25] = "GeneralString";
	ASN1UniversalType[ASN1UniversalType["UniversalString"] = 26] = "UniversalString";
	ASN1UniversalType[ASN1UniversalType["CharacterString"] = 27] = "CharacterString";
	ASN1UniversalType[ASN1UniversalType["BMPString"] = 28] = "BMPString";
})(ASN1UniversalType || (ASN1UniversalType = {}));
var ASN1Class;
(function(ASN1Class) {
	ASN1Class[ASN1Class["Universal"] = 0] = "Universal";
	ASN1Class[ASN1Class["Application"] = 1] = "Application";
	ASN1Class[ASN1Class["ContextSpecific"] = 2] = "ContextSpecific";
	ASN1Class[ASN1Class["Private"] = 3] = "Private";
})(ASN1Class || (ASN1Class = {}));
var ASN1Form;
(function(ASN1Form) {
	ASN1Form[ASN1Form["Primitive"] = 0] = "Primitive";
	ASN1Form[ASN1Form["Constructed"] = 1] = "Constructed";
})(ASN1Form || (ASN1Form = {}));
ASN1UniversalType.Boolean, ASN1UniversalType.Integer, ASN1UniversalType.BitString, ASN1UniversalType.OctetString, ASN1UniversalType.Null, ASN1UniversalType.ObjectIdentifier, ASN1UniversalType.ObjectDescriptor, ASN1UniversalType.External, ASN1UniversalType.Real, ASN1UniversalType.Enumerated, ASN1UniversalType.EmbeddedPDV, ASN1UniversalType.UTF8String, ASN1UniversalType.RelativeObjectIdentifier, ASN1UniversalType.Time, ASN1UniversalType.Sequence, ASN1UniversalType.Set, ASN1UniversalType.NumericString, ASN1UniversalType.PrintableString, ASN1UniversalType.TeletexString, ASN1UniversalType.VideotextString, ASN1UniversalType.IA5String, ASN1UniversalType.UTCTime, ASN1UniversalType.GeneralizedTime, ASN1UniversalType.GraphicString, ASN1UniversalType.VisibleString, ASN1UniversalType.GeneralString, ASN1UniversalType.UniversalString, ASN1UniversalType.CharacterString, ASN1UniversalType.BMPString;
new ECDSANamedCurve(6277101735386680763835789423207666416102355444459739541047n, 0n, 3n, 5377521262291226325198505011805525673063229037935769709693n, 3805108391982600717572440947423858335415441070543209377693n, 6277101735386680763835789423061264271957123915200845512077n, 1n, 24, "1.3.132.0.31");
new ECDSANamedCurve(6277101735386680763835789423207666416083908700390324961279n, 6277101735386680763835789423207666416083908700390324961276n, 2455155546008943817740293915197451784769108058161191238065n, 602046282375688656758213480587526111916698976636884684818n, 174050332293622031404857552280219410364023488927386650641n, 6277101735386680763835789423176059013767194773182842284081n, 1n, 24, "1.2.840.10045.3.1.1");
new ECDSANamedCurve(26959946667150639794667015087019630673637144422540572481099315275117n, 0n, 5n, 16983810465656793445178183341822322175883642221536626637512293983324n, 13272896753306862154536785447615077600479862871316829862783613755813n, 26959946667150639794667015087019640346510327083120074548994958668279n, 1n, 28, "1.3.132.0.32");
new ECDSANamedCurve(26959946667150639794667015087019630673557916260026308143510066298881n, 26959946667150639794667015087019630673557916260026308143510066298878n, 18958286285566608000408668544493926415504680968679321075787234672564n, 19277929113566293071110308034699488026831934219452440156649784352033n, 19926808758034470970197974370888749184205991990603949537637343198772n, 26959946667150639794667015087019625940457807714424391721682722368061n, 1n, 28, "1.3.132.0.33");
new ECDSANamedCurve(115792089237316195423570985008687907853269984665640564039457584007908834671663n, 0n, 7n, 55066263022277343669578718895168534326250603453777594175500187360389116729240n, 32670510020758816978083085130507043184471273380659243275938904335757337482424n, 115792089237316195423570985008687907852837564279074904382605163141518161494337n, 1n, 32, "1.3.132.0.10");
new ECDSANamedCurve(115792089210356248762697446949407573530086143415290314195533631308867097853951n, 115792089210356248762697446949407573530086143415290314195533631308867097853948n, 41058363725152142129326129780047268409114441015993725554835256314039467401291n, 48439561293906451759052585252797914202762949526041747995844080717082404635286n, 36134250956749795798585127919587881956611106672985015071877198253568414405109n, 115792089210356248762697446949407573529996955224135760342422259061068512044369n, 1n, 32, "1.2.840.10045.3.1.7");
new ECDSANamedCurve(39402006196394479212279040100143613805079739270465446667948293404245721771496870329047266088258938001861606973112319n, 39402006196394479212279040100143613805079739270465446667948293404245721771496870329047266088258938001861606973112316n, 27580193559959705877849011840389048093056905856361568521428707301988689241309860865136260764883745107765439761230575n, 26247035095799689268623156744566981891852923491109213387815615900925518854738050089022388053975719786650872476732087n, 8325710961489029985546751289520108179287853048861315594709205902480503199884419224438643760392947333078086511627871n, 39402006196394479212279040100143613805079739270465446667946905279627659399113263569398956308152294913554433653942643n, 1n, 48, "1.3.132.0.34");
new ECDSANamedCurve(6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151n, 6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057148n, 1093849038073734274511112390766805569936207598951683748994586394495953116150735016013708737573759623248592132296706313309438452531591012912142327488478985984n, 2661740802050217063228768716723360960729859168756973147706671368418802944996427808491545080627771902352094241225065558662157113545570916814161637315895999846n, 3757180025770020463545507224491183603594455134769762486694567779615544477440556316691234405012945539562144444537289428522585666729196580810124344277578376784n, 6864797660130609714981900799081393217269435300143305409394463459185543183397655394245057746333217197532963996371363321113864768612440380340372808892707005449n, 1n, 66, "1.3.132.0.35");
//#endregion
//#region node_modules/.pnpm/@oslojs+encoding@1.0.0/node_modules/@oslojs/encoding/dist/base32.js
var EncodingPadding$1;
(function(EncodingPadding) {
	EncodingPadding[EncodingPadding["Include"] = 0] = "Include";
	EncodingPadding[EncodingPadding["None"] = 1] = "None";
})(EncodingPadding$1 || (EncodingPadding$1 = {}));
var DecodingPadding$1;
(function(DecodingPadding) {
	DecodingPadding[DecodingPadding["Required"] = 0] = "Required";
	DecodingPadding[DecodingPadding["Ignore"] = 1] = "Ignore";
})(DecodingPadding$1 || (DecodingPadding$1 = {}));
//#endregion
//#region node_modules/.pnpm/@oslojs+encoding@1.0.0/node_modules/@oslojs/encoding/dist/base64.js
var EncodingPadding;
(function(EncodingPadding) {
	EncodingPadding[EncodingPadding["Include"] = 0] = "Include";
	EncodingPadding[EncodingPadding["None"] = 1] = "None";
})(EncodingPadding || (EncodingPadding = {}));
var DecodingPadding;
(function(DecodingPadding) {
	DecodingPadding[DecodingPadding["Required"] = 0] = "Required";
	DecodingPadding[DecodingPadding["Ignore"] = 1] = "Ignore";
})(DecodingPadding || (DecodingPadding = {}));
//#endregion
//#region node_modules/.pnpm/@oslojs+webauthn@1.0.0/node_modules/@oslojs/webauthn/dist/cose.js
var COSEKeyType;
(function(COSEKeyType) {
	COSEKeyType[COSEKeyType["OKP"] = 0] = "OKP";
	COSEKeyType[COSEKeyType["EC2"] = 1] = "EC2";
	COSEKeyType[COSEKeyType["RSA"] = 2] = "RSA";
	COSEKeyType[COSEKeyType["Symmetric"] = 3] = "Symmetric";
	COSEKeyType[COSEKeyType["HSSLMS"] = 4] = "HSSLMS";
	COSEKeyType[COSEKeyType["WalnutDSA"] = 5] = "WalnutDSA";
})(COSEKeyType || (COSEKeyType = {}));
COSEKeyType.OKP, COSEKeyType.EC2, COSEKeyType.RSA, COSEKeyType.Symmetric, COSEKeyType.HSSLMS, COSEKeyType.WalnutDSA;
new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
new BigUint64Array([
	4794697086780616226n,
	8158064640168781261n,
	13096744586834688815n,
	16840607885511220156n,
	4131703408338449720n,
	6480981068601479193n,
	10538285296894168987n,
	12329834152419229976n,
	15566598209576043074n,
	1334009975649890238n,
	2608012711638119052n,
	6128411473006802146n,
	8268148722764581231n,
	9286055187155687089n,
	11230858885718282805n,
	13951009754708518548n,
	16472876342353939154n,
	17275323862435702243n,
	1135362057144423861n,
	2597628984639134821n,
	3308224258029322869n,
	5365058923640841347n,
	6679025012923562964n,
	8573033837759648693n,
	10970295158949994411n,
	12119686244451234320n,
	12683024718118986047n,
	13788192230050041572n,
	14330467153632333762n,
	15395433587784984357n,
	489312712824947311n,
	1452737877330783856n,
	2861767655752347644n,
	3322285676063803686n,
	5560940570517711597n,
	5996557281743188959n,
	7280758554555802590n,
	8532644243296465576n,
	9350256976987008742n,
	10552545826968843579n,
	11727347734174303076n,
	12113106623233404929n,
	14000437183269869457n,
	14369950271660146224n,
	15101387698204529176n,
	15463397548674623760n,
	17586052441742319658n,
	1182934255886127544n,
	1847814050463011016n,
	2177327727835720531n,
	2830643537854262169n,
	3796741975233480872n,
	4115178125766777443n,
	5681478168544905931n,
	6601373596472566643n,
	7507060721942968483n,
	8399075790359081724n,
	8693463985226723168n,
	9568029438360202098n,
	10144078919501101548n,
	10430055236837252648n,
	11840083180663258601n,
	13761210420658862357n,
	14299343276471374635n,
	14566680578165727644n,
	15097957966210449927n,
	16922976911328602910n,
	17689382322260857208n,
	500013540394364858n,
	748580250866718886n,
	1242879168328830382n,
	1977374033974150939n,
	2944078676154940804n,
	3659926193048069267n,
	4368137639120453308n,
	4836135668995329356n,
	5532061633213252278n,
	6448918945643986474n,
	6902733635092675308n,
	7801388544844847127n
]);
//#endregion
//#region node_modules/.pnpm/@oslojs+webauthn@1.0.0/node_modules/@oslojs/webauthn/dist/auth.js
var ClientDataType;
(function(ClientDataType) {
	ClientDataType[ClientDataType["Get"] = 0] = "Get";
	ClientDataType[ClientDataType["Create"] = 1] = "Create";
})(ClientDataType || (ClientDataType = {}));
var TokenBindingStatus;
(function(TokenBindingStatus) {
	TokenBindingStatus[TokenBindingStatus["Supported"] = 0] = "Supported";
	TokenBindingStatus[TokenBindingStatus["Present"] = 1] = "Present";
})(TokenBindingStatus || (TokenBindingStatus = {}));
//#endregion
//#region node_modules/.pnpm/@oslojs+webauthn@1.0.0/node_modules/@oslojs/webauthn/dist/attestation.js
var AttestationStatementFormat;
(function(AttestationStatementFormat) {
	AttestationStatementFormat[AttestationStatementFormat["Packed"] = 0] = "Packed";
	AttestationStatementFormat[AttestationStatementFormat["TPM"] = 1] = "TPM";
	AttestationStatementFormat[AttestationStatementFormat["AndroidKey"] = 2] = "AndroidKey";
	AttestationStatementFormat[AttestationStatementFormat["AndroidSafetyNet"] = 3] = "AndroidSafetyNet";
	AttestationStatementFormat[AttestationStatementFormat["FIDOU2F"] = 4] = "FIDOU2F";
	AttestationStatementFormat[AttestationStatementFormat["AppleAnonymous"] = 5] = "AppleAnonymous";
	AttestationStatementFormat[AttestationStatementFormat["None"] = 6] = "None";
})(AttestationStatementFormat || (AttestationStatementFormat = {}));
//#endregion
//#region self-essentials/emdash-main/packages/auth/dist/authenticate-aYY4r3N8.mjs
/**
* Scope grants — when a token holds the key scope, it implicitly grants
* the listed scopes too. This keeps existing tokens working when more
* granular scopes are introduced.
*
* Specifically, `content:write` was historically the only scope we checked
* for menu and taxonomy mutations. After splitting those out into
* `menus:manage` and `taxonomies:manage`, existing PATs with `content:write`
* continue to work via this grant table.
*
* Lookup is one-hop — chaining (`A → B → C`) is NOT supported. If a chain
* is needed, expand the values explicitly. Backed by a `Map` rather than a
* plain object so prototype-chain keys (`__proto__`, `constructor`, etc.)
* can't smuggle non-array values through bracket access.
*/
var IMPLICIT_SCOPE_GRANTS = /* @__PURE__ */ new Map([["content:write", ["menus:manage", "taxonomies:manage"]]]);
/**
* Check if a set of scopes includes a required scope.
*
* The `admin` scope grants access to everything. `content:write` implicitly
* grants `menus:manage` and `taxonomies:manage` to preserve backwards
* compatibility with PATs issued before those scopes were split out.
*/
function hasScope(scopes, required) {
	if (required === "mcp:tools" || required.startsWith("mcp:tools:")) return scopes.includes("mcp:tools") || scopes.includes(required);
	if (scopes.includes("admin")) return true;
	if (scopes.includes(required)) return true;
	for (const held of scopes) if (IMPLICIT_SCOPE_GRANTS.get(held)?.includes(required)) return true;
	return false;
}
/**
* Hash a prefixed API token for storage/lookup.
* Hashes the full prefixed token string via SHA-256, returns base64url (no padding).
*/
function hashPrefixedToken(token) {
	return encodeBase64urlNoPadding(sha256(new TextEncoder().encode(token)));
}
object({
	id: number(),
	login: string(),
	name: string().nullable(),
	email: string().nullable(),
	avatar_url: string()
});
object({
	email: string(),
	primary: boolean(),
	verified: boolean()
});
object({
	sub: string(),
	email: string(),
	email_verified: boolean(),
	name: string(),
	picture: string()
});
//#endregion
//#region self-essentials/emdash-main/packages/auth/dist/index.mjs
/**
* Configuration schema for @emdash-cms/auth
*/
/** Matches http(s) scheme at start of URL */
var HTTP_SCHEME_RE = /^https?:\/\//i;
/** Validates that a URL string uses http or https scheme. Rejects javascript:/data: URI XSS vectors. */
var httpUrl = string().url().refine((url) => HTTP_SCHEME_RE.test(url), "URL must use http or https");
/**
* OAuth provider configuration
*/
var oauthProviderSchema = object({
	clientId: string(),
	clientSecret: string()
});
object({
	secret: string().min(32, "Auth secret must be at least 32 characters"),
	passkeys: object({
		rpName: string(),
		rpId: string().optional()
	}).optional(),
	selfSignup: object({
		domains: array(string()),
		defaultRole: _enum([
			"subscriber",
			"contributor",
			"author"
		]).default("contributor")
	}).optional(),
	oauth: object({
		github: oauthProviderSchema.optional(),
		google: oauthProviderSchema.optional()
	}).optional(),
	provider: object({
		enabled: boolean(),
		issuer: httpUrl.optional()
	}).optional(),
	sso: object({ enabled: boolean() }).optional(),
	session: object({
		maxAge: number().default(2592e3),
		sliding: boolean().default(true)
	}).optional()
});
/**
* Permission definitions with minimum role required
*/
var Permissions = {
	"content:read": Role.SUBSCRIBER,
	"content:read_drafts": Role.CONTRIBUTOR,
	"content:create": Role.CONTRIBUTOR,
	"content:edit_own": Role.AUTHOR,
	"content:edit_any": Role.EDITOR,
	"content:delete_own": Role.AUTHOR,
	"content:delete_any": Role.EDITOR,
	"content:delete_permanent": Role.ADMIN,
	"content:publish_own": Role.AUTHOR,
	"content:publish_any": Role.EDITOR,
	"media:read": Role.SUBSCRIBER,
	"media:upload": Role.CONTRIBUTOR,
	"media:edit_own": Role.AUTHOR,
	"media:edit_any": Role.EDITOR,
	"media:delete_own": Role.AUTHOR,
	"media:delete_any": Role.EDITOR,
	"taxonomies:read": Role.SUBSCRIBER,
	"taxonomies:manage": Role.EDITOR,
	"comments:read": Role.SUBSCRIBER,
	"comments:moderate": Role.EDITOR,
	"comments:delete": Role.ADMIN,
	"comments:settings": Role.ADMIN,
	"menus:read": Role.SUBSCRIBER,
	"menus:manage": Role.EDITOR,
	"bylines:read": Role.SUBSCRIBER,
	"bylines:manage": Role.EDITOR,
	"widgets:read": Role.SUBSCRIBER,
	"widgets:manage": Role.EDITOR,
	"sections:read": Role.SUBSCRIBER,
	"sections:manage": Role.EDITOR,
	"redirects:read": Role.EDITOR,
	"redirects:manage": Role.ADMIN,
	"users:read": Role.ADMIN,
	"users:invite": Role.ADMIN,
	"users:manage": Role.ADMIN,
	"settings:read": Role.EDITOR,
	"settings:manage": Role.ADMIN,
	"schema:read": Role.EDITOR,
	"schema:manage": Role.ADMIN,
	"plugins:read": Role.EDITOR,
	"plugins:manage": Role.ADMIN,
	"import:execute": Role.ADMIN,
	"backups:manage": Role.ADMIN,
	"search:read": Role.SUBSCRIBER,
	"search:manage": Role.ADMIN,
	"auth:manage_own_credentials": Role.SUBSCRIBER,
	"auth:manage_connections": Role.ADMIN
};
Role.SUBSCRIBER, Role.CONTRIBUTOR, Role.SUBSCRIBER, Role.CONTRIBUTOR, Role.EDITOR, Role.ADMIN, Role.EDITOR, Role.EDITOR, Role.EDITOR, Role.ADMIN, Role.ADMIN, Role.ADMIN;
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
//#region self-essentials/emdash-main/packages/core/dist/plugins/adapt-sandbox-entry.mjs
/**
* Default hook configuration values
*/
var DEFAULT_PRIORITY = 100;
var DEFAULT_TIMEOUT = 5e3;
var DEFAULT_ERROR_POLICY = "abort";
/**
* Check if a hook entry is the config form (has a `handler` property).
*/
function isHookConfig(entry) {
	return typeof entry === "object" && entry !== null && "handler" in entry;
}
/**
* Resolve a single hook entry to a ResolvedHook.
*
* Sandboxed-format hooks use the standard two-arg convention:
*   handler(event, ctx)
*
* The HookPipeline dispatch methods also call handlers with (event, ctx),
* so the handler is compatible as-is — we just normalise the
* surrounding config (priority, timeout, etc.) to its defaults.
*/
function resolveSandboxedHook(entry, pluginId) {
	if (isHookConfig(entry)) return {
		priority: entry.priority ?? DEFAULT_PRIORITY,
		timeout: entry.timeout ?? DEFAULT_TIMEOUT,
		dependencies: entry.dependencies ?? [],
		errorPolicy: entry.errorPolicy ?? DEFAULT_ERROR_POLICY,
		exclusive: entry.exclusive ?? false,
		handler: entry.handler,
		pluginId
	};
	return {
		priority: DEFAULT_PRIORITY,
		timeout: DEFAULT_TIMEOUT,
		dependencies: [],
		errorPolicy: DEFAULT_ERROR_POLICY,
		exclusive: false,
		handler: entry,
		pluginId
	};
}
/**
* Normalise a `RouteEntry` (bare handler or `{ handler, public?, input? }`
* config) to the config form. The `input` schema is intentionally typed
* `unknown` in `RouteEntry` — sandboxed plugins describe it loosely
* because the strict `z.ZodType<TInput>` constraint of the runtime's
* `PluginRoute` only narrows once the route is wired into the router.
* The wider type flows through to the runtime which validates at
* invocation time.
*/
function normalizeRouteEntry(entry) {
	if (typeof entry === "function") return { handler: entry };
	return {
		handler: entry.handler,
		public: entry.public,
		permission: entry.permission,
		cacheControl: entry.cacheControl,
		input: entry.input
	};
}
var VALID_CAPABILITIES_SET = new Set(PLUGIN_CAPABILITIES);
var VALID_HOOK_NAMES_SET = new Set(HOOK_NAMES);
/**
* Adapt a sandboxed plugin's default export into a ResolvedPlugin.
*
* This is the in-process side of sandboxed-format plugins: it takes
* the `{ hooks, routes }` default export of a sandboxed plugin and
* produces a `ResolvedPlugin` that enters the HookPipeline alongside
* native plugins. The descriptor supplies identity (id, version) and
* the trust contract (capabilities, allowedHosts, storage); the
* definition supplies behaviour.
*
* @param definition - The plugin's default export (matching `SandboxedPlugin` from `emdash/plugin`).
* @param descriptor - The plugin descriptor with id, version, capabilities, etc.
* @returns A ResolvedPlugin compatible with HookPipeline.
*/
function adaptSandboxEntry(definition, descriptor) {
	const pluginId = descriptor.id;
	const version = descriptor.version;
	if (typeof definition !== "object" || definition === null || Array.isArray(definition)) throw new Error(`Plugin "${pluginId}" default export must be an object with \`hooks\` and/or \`routes\` (got ${Array.isArray(definition) ? "array" : typeof definition}). Did you forget \`export default {...} satisfies SandboxedPlugin\`?`);
	const resolvedHooks = {};
	if (definition.hooks) {
		const hookMap = definition.hooks;
		for (const [hookName, entry] of Object.entries(hookMap)) {
			if (!VALID_HOOK_NAMES_SET.has(hookName)) throw new Error(`Plugin "${pluginId}" declares unknown hook "${hookName}". Valid hooks: ${[...VALID_HOOK_NAMES_SET].join(", ")}`);
			resolvedHooks[hookName] = resolveSandboxedHook(entry, pluginId);
		}
	}
	const resolvedRoutes = {};
	if (definition.routes) for (const [routeName, rawEntry] of Object.entries(definition.routes)) {
		const { handler, public: publicFlag, cacheControl, input: inputSchema, permission } = normalizeRouteEntry(rawEntry);
		resolvedRoutes[routeName] = {
			input: inputSchema,
			public: publicFlag,
			permission,
			cacheControl,
			handler: async (ctx) => {
				const headers = {};
				ctx.request.headers.forEach((value, name) => {
					headers[name] = value;
				});
				const requestShape = {
					url: ctx.request.url,
					method: ctx.request.method,
					headers
				};
				const routeCtx = {
					input: ctx.input,
					request: requestShape,
					requestMeta: ctx.requestMeta
				};
				const { input: _, request: __, requestMeta: ___, ...pluginCtx } = ctx;
				return handler(routeCtx, pluginCtx);
			}
		};
	}
	const rawCapabilities = descriptor.capabilities ?? [];
	for (const cap of rawCapabilities) if (!VALID_CAPABILITIES_SET.has(cap)) throw new Error(`Invalid capability "${cap}" in plugin "${pluginId}". Valid capabilities: ${[...VALID_CAPABILITIES_SET].join(", ")}`);
	const capabilities = normalizeCapabilities(rawCapabilities);
	const allowedHosts = descriptor.allowedHosts ?? [];
	if (capabilities.includes("content:write") && !capabilities.includes("content:read")) capabilities.push("content:read");
	if (capabilities.includes("media:write") && !capabilities.includes("media:read")) capabilities.push("media:read");
	if (capabilities.includes("network:request:unrestricted") && !capabilities.includes("network:request")) capabilities.push("network:request");
	const rawStorage = descriptor.storage ?? {};
	const storage = {};
	for (const [name, config] of Object.entries(rawStorage)) storage[name] = {
		indexes: config.indexes ?? [],
		uniqueIndexes: config.uniqueIndexes
	};
	const admin = {};
	if (descriptor.adminPages) admin.pages = descriptor.adminPages;
	if (descriptor.adminWidgets) admin.widgets = descriptor.adminWidgets;
	if (descriptor.settingsSchema) admin.settingsSchema = descriptor.settingsSchema;
	if (descriptor.portableTextBlocks) admin.portableTextBlocks = descriptor.portableTextBlocks;
	if (descriptor.fieldWidgets) admin.fieldWidgets = descriptor.fieldWidgets;
	return {
		id: pluginId,
		version,
		capabilities,
		allowedHosts,
		storage,
		hooks: resolvedHooks,
		routes: resolvedRoutes,
		mcp: { tools: Object.fromEntries(Object.entries(definition.mcp?.tools ?? {}).map(([name, tool]) => [name, {
			description: tool.description,
			route: tool.route,
			input: tool.input,
			output: tool.output,
			destructive: tool.destructive
		}])) },
		admin
	};
}
//#endregion
export { Permissions as a, sha256 as c, toRoleLevel as d, toTokenType as f, reconcileManifestAccess as i, Role as l, normalizeManifestRoute as n, hasScope as o, normalizeCapabilities as p, pluginManifestSchema as r, hashPrefixedToken as s, adaptSandboxEntry as t, toDeviceType as u };
