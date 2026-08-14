import { n as encodeHexLowerCase } from "./hex_0JGLvd7W.mjs";
import "./dist_CycaXRgm.mjs";
import { t as after } from "./after-B1IIdH3Y_D2PBgJNO.mjs";
import { a as encodeBase64url, r as decodeBase64url } from "./base64-B-PsqheR_CqpGr57O.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { r as singleFlightCached, t as createSingleFlightCache } from "./single-flight-cache-C2exrGAi_CN0gTUoV.mjs";
import { n as sha256 } from "./sha2_Celbjg9f.mjs";
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
export { validateEncryptionKeyAtStartup as n, resolveSecretsCached as t };
