import { C as record, D as stringGraphemes, E as string, O as stringLength, S as query, T as safeParse, _ as integerRange, a as simpleFetchHandler, b as object, c as boolean, d as constrain, f as datetimeString, g as integer, h as handleString, i as ok, k as unknown, l as bytes, m as genericUriString, o as array, p as didString, s as arrayLength, t as Client, u as cidString, v as languageCodeString, w as resourceUriString, x as optional, y as literal } from "./client_DNyJW6Ij.mjs";
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/chunk-BYypO7fO.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var labelSchema = /* @__PURE__ */ object({
	$type: /*#__PURE__*/ optional(/*#__PURE__*/ literal("com.atproto.label.defs#label")),
	/** Optionally, CID specifying the specific version of 'uri' resource this label applies to. */
	cid: /*#__PURE__*/ optional(/*#__PURE__*/ cidString()),
	/** Timestamp when this label was created. */
	cts: /*#__PURE__*/ datetimeString(),
	/** Timestamp at which this label expires (no longer applies). */
	exp: /*#__PURE__*/ optional(/*#__PURE__*/ datetimeString()),
	/** If true, this is a negation label, overwriting a previous label. */
	neg: /*#__PURE__*/ optional(/*#__PURE__*/ boolean()),
	/** Signature of dag-cbor encoded label. */
	sig: /*#__PURE__*/ optional(/*#__PURE__*/ bytes()),
	/** DID of the actor who created this label. */
	src: /*#__PURE__*/ didString(),
	/** AT URI of the record, repository (account), or other resource that this label applies to. */
	uri: /*#__PURE__*/ genericUriString(),
	/**
	* The short string name of the value or type of this label.
	*
	* @maxLength 128
	*/
	val: /*#__PURE__*/ constrain(/*#__PURE__*/ string(), [/*#__PURE__*/ stringLength(0, 128)]),
	/** The AT Protocol version of the label object. */
	ver: /*#__PURE__*/ optional(/*#__PURE__*/ integer())
});
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/aggregator/defs.js
var _packageViewSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.aggregator.defs#packageView")),
	cid: /* @__PURE__ */ cidString(),
	did: /* @__PURE__ */ didString(),
	handle: /* @__PURE__ */ optional(/* @__PURE__ */ handleString()),
	indexedAt: /* @__PURE__ */ datetimeString(),
	get labels() {
		return /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ array(labelSchema), [/* @__PURE__ */ arrayLength(0, 64)]));
	},
	latestVersion: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 64)])),
	profile: /* @__PURE__ */ unknown(),
	slug: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)]),
	uri: /* @__PURE__ */ resourceUriString()
});
var _releaseViewSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.aggregator.defs#releaseView")),
	cid: /* @__PURE__ */ cidString(),
	did: /* @__PURE__ */ didString(),
	indexedAt: /* @__PURE__ */ datetimeString(),
	get labels() {
		return /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ array(labelSchema), [/* @__PURE__ */ arrayLength(0, 64)]));
	},
	mirrors: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ array(/* @__PURE__ */ constrain(/* @__PURE__ */ genericUriString(), [/* @__PURE__ */ stringLength(0, 2048)])), [/* @__PURE__ */ arrayLength(0, 16)])),
	package: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)]),
	release: /* @__PURE__ */ unknown(),
	uri: /* @__PURE__ */ resourceUriString(),
	version: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])
});
var packageViewSchema = _packageViewSchema;
var releaseViewSchema = _releaseViewSchema;
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js
var getLatestRelease_exports = /* @__PURE__ */ __exportAll({ mainSchema: () => mainSchema$6 });
var mainSchema$6 = /* @__PURE__ */ query("com.emdashcms.experimental.aggregator.getLatestRelease", {
	params: /* @__PURE__ */ object({
		did: /* @__PURE__ */ didString(),
		package: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])
	}),
	output: {
		type: "lex",
		get schema() {
			return releaseViewSchema;
		}
	}
});
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/aggregator/getPackage.js
var getPackage_exports = /* @__PURE__ */ __exportAll({ mainSchema: () => mainSchema$5 });
var mainSchema$5 = /* @__PURE__ */ query("com.emdashcms.experimental.aggregator.getPackage", {
	params: /* @__PURE__ */ object({
		did: /* @__PURE__ */ didString(),
		slug: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])
	}),
	output: {
		type: "lex",
		get schema() {
			return packageViewSchema;
		}
	}
});
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/aggregator/listReleases.js
var listReleases_exports = /* @__PURE__ */ __exportAll({ mainSchema: () => mainSchema$4 });
var mainSchema$4 = /* @__PURE__ */ query("com.emdashcms.experimental.aggregator.listReleases", {
	params: /* @__PURE__ */ object({
		cursor: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 1024)])),
		did: /* @__PURE__ */ didString(),
		limit: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ integer(), [/* @__PURE__ */ integerRange(1, 100)]), 25),
		package: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])
	}),
	output: {
		type: "lex",
		schema: /* @__PURE__ */ object({
			cursor: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 1024)])),
			get releases() {
				return /* @__PURE__ */ constrain(/* @__PURE__ */ array(releaseViewSchema), [/* @__PURE__ */ arrayLength(0, 100)]);
			}
		})
	}
});
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/aggregator/resolvePackage.js
var resolvePackage_exports = /* @__PURE__ */ __exportAll({ mainSchema: () => mainSchema$3 });
var mainSchema$3 = /* @__PURE__ */ query("com.emdashcms.experimental.aggregator.resolvePackage", {
	params: /* @__PURE__ */ object({
		handle: /* @__PURE__ */ handleString(),
		slug: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])
	}),
	output: {
		type: "lex",
		get schema() {
			return packageViewSchema;
		}
	}
});
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/aggregator/searchPackages.js
var searchPackages_exports = /* @__PURE__ */ __exportAll({ mainSchema: () => mainSchema$2 });
var mainSchema$2 = /* @__PURE__ */ query("com.emdashcms.experimental.aggregator.searchPackages", {
	params: /* @__PURE__ */ object({
		capability: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])),
		cursor: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 1024)])),
		limit: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ integer(), [/* @__PURE__ */ integerRange(1, 100)]), 25),
		q: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256)]))
	}),
	output: {
		type: "lex",
		schema: /* @__PURE__ */ object({
			cursor: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 1024)])),
			get packages() {
				return /* @__PURE__ */ constrain(/* @__PURE__ */ array(packageViewSchema), [/* @__PURE__ */ arrayLength(0, 100)]);
			}
		})
	}
});
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/package/profile.js
var profile_exports = /* @__PURE__ */ __exportAll({
	authorSchema: () => authorSchema,
	contactSchema: () => contactSchema,
	mainSchema: () => mainSchema$1,
	sectionsSchema: () => sectionsSchema
});
var _authorSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.package.profile#author")),
	email: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256)])),
	name: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256), /* @__PURE__ */ stringGraphemes(0, 64)]),
	url: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ genericUriString(), [/* @__PURE__ */ stringLength(0, 1024)]))
});
var _contactSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.package.profile#contact")),
	email: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256)])),
	url: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ genericUriString(), [/* @__PURE__ */ stringLength(0, 1024)]))
});
var _mainSchema$1 = /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ object({
	$type: /* @__PURE__ */ literal("com.emdashcms.experimental.package.profile"),
	get authors() {
		return /* @__PURE__ */ constrain(/* @__PURE__ */ array(authorSchema), [/* @__PURE__ */ arrayLength(1, 32)]);
	},
	description: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 1024), /* @__PURE__ */ stringGraphemes(0, 140)])),
	extensions: /* @__PURE__ */ optional(/* @__PURE__ */ unknown()),
	id: /* @__PURE__ */ resourceUriString(),
	keywords: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ array(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 128), /* @__PURE__ */ stringGraphemes(0, 64)])), [/* @__PURE__ */ arrayLength(0, 5)])),
	lastUpdated: /* @__PURE__ */ optional(/* @__PURE__ */ datetimeString()),
	license: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256)]),
	name: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 1024), /* @__PURE__ */ stringGraphemes(0, 100)])),
	get sections() {
		return /* @__PURE__ */ optional(sectionsSchema);
	},
	get security() {
		return /* @__PURE__ */ constrain(/* @__PURE__ */ array(contactSchema), [/* @__PURE__ */ arrayLength(1, 8)]);
	},
	slug: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])),
	type: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 64)])
}));
var _sectionsSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.package.profile#sections")),
	changelog: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 2e4), /* @__PURE__ */ stringGraphemes(0, 2e3)])),
	description: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 2e4), /* @__PURE__ */ stringGraphemes(0, 2e3)])),
	faq: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 2e4), /* @__PURE__ */ stringGraphemes(0, 2e3)])),
	installation: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 2e4), /* @__PURE__ */ stringGraphemes(0, 2e3)])),
	security: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 2e4), /* @__PURE__ */ stringGraphemes(0, 2e3)]))
});
var authorSchema = _authorSchema;
var contactSchema = _contactSchema;
var mainSchema$1 = _mainSchema$1;
var sectionsSchema = _sectionsSchema;
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/generated/types/com/emdashcms/experimental/package/release.js
var release_exports = /* @__PURE__ */ __exportAll({
	artifactSchema: () => artifactSchema,
	artifactsSchema: () => artifactsSchema,
	mainSchema: () => mainSchema,
	sbomSchema: () => sbomSchema
});
var _artifactSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.package.release#artifact")),
	checksum: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256)]),
	contentType: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256)])),
	height: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ integer(), [/* @__PURE__ */ integerRange(1, 8192)])),
	id: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 128)])),
	lang: /* @__PURE__ */ optional(/* @__PURE__ */ languageCodeString()),
	releaseAsset: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	requiresAuth: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	signature: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 1024)])),
	url: /* @__PURE__ */ constrain(/* @__PURE__ */ genericUriString(), [/* @__PURE__ */ stringLength(0, 2048)]),
	width: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ integer(), [/* @__PURE__ */ integerRange(1, 8192)]))
});
var _artifactsSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.package.release#artifacts")),
	get banner() {
		return /* @__PURE__ */ optional(artifactSchema);
	},
	get icon() {
		return /* @__PURE__ */ optional(artifactSchema);
	},
	get package() {
		return artifactSchema;
	},
	get screenshots() {
		return /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ array(artifactSchema), [/* @__PURE__ */ arrayLength(0, 8)]));
	}
});
var _mainSchema = /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ object({
	$type: /* @__PURE__ */ literal("com.emdashcms.experimental.package.release"),
	get artifacts() {
		return artifactsSchema;
	},
	auth: /* @__PURE__ */ optional(/* @__PURE__ */ unknown()),
	extensions: /* @__PURE__ */ optional(/* @__PURE__ */ unknown()),
	package: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)]),
	provides: /* @__PURE__ */ optional(/* @__PURE__ */ unknown()),
	repo: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ genericUriString(), [/* @__PURE__ */ stringLength(0, 1024)])),
	requires: /* @__PURE__ */ optional(/* @__PURE__ */ unknown()),
	get sbom() {
		return /* @__PURE__ */ optional(sbomSchema);
	},
	suggests: /* @__PURE__ */ optional(/* @__PURE__ */ unknown()),
	version: /* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(1, 64)])
}));
var _sbomSchema = /* @__PURE__ */ object({
	$type: /* @__PURE__ */ optional(/* @__PURE__ */ literal("com.emdashcms.experimental.package.release#sbom")),
	checksum: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 256)])),
	format: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ string(), [/* @__PURE__ */ stringLength(0, 32)])),
	url: /* @__PURE__ */ optional(/* @__PURE__ */ constrain(/* @__PURE__ */ genericUriString(), [/* @__PURE__ */ stringLength(0, 2048)]))
});
var artifactSchema = _artifactSchema;
var artifactsSchema = _artifactsSchema;
var mainSchema = _mainSchema;
var sbomSchema = _sbomSchema;
//#endregion
//#region self-essentials/emdash-main/packages/registry-lexicons/dist/index.js
/**
* NSID constants for the lexicons defined by this package. Useful for consumers
* that need to reference a record collection by string (e.g. when issuing
* `listRecords` or `putRecord` calls against a PDS).
*/
var NSID = {
	packageProfile: "com.emdashcms.experimental.package.profile",
	packageProfileExtension: "com.emdashcms.experimental.package.profileExtension",
	packageRelease: "com.emdashcms.experimental.package.release",
	packageReleaseExtension: "com.emdashcms.experimental.package.releaseExtension",
	publisherProfile: "com.emdashcms.experimental.publisher.profile",
	publisherVerification: "com.emdashcms.experimental.publisher.verification",
	aggregatorDefs: "com.emdashcms.experimental.aggregator.defs",
	aggregatorGetLatestRelease: "com.emdashcms.experimental.aggregator.getLatestRelease",
	aggregatorGetPackage: "com.emdashcms.experimental.aggregator.getPackage",
	aggregatorListReleases: "com.emdashcms.experimental.aggregator.listReleases",
	aggregatorResolvePackage: "com.emdashcms.experimental.aggregator.resolvePackage",
	aggregatorSearchPackages: "com.emdashcms.experimental.aggregator.searchPackages"
};
Object.freeze({
	collection: NSID.packageRelease,
	scope: `atproto repo:${NSID.packageRelease}?action=create`
});
NSID.packageProfile, NSID.packageRelease, NSID.publisherProfile, NSID.publisherVerification;
NSID.aggregatorGetLatestRelease, NSID.aggregatorGetPackage, NSID.aggregatorListReleases, NSID.aggregatorResolvePackage, NSID.aggregatorSearchPackages;
//#endregion
//#region self-essentials/emdash-main/packages/registry-client/dist/discovery/index.js
/**
* Discovery client.
*
* Reads from an EmDash plugin registry aggregator. The aggregator implements
* the `com.emdashcms.experimental.aggregator.*` XRPC methods over plain HTTP,
* so this client works in any runtime that has `fetch` -- Node, Workers, the
* browser, the EmDash admin UI.
*
* No authentication is required for discovery: the aggregator is a public
* read-only index. Hard-enforcement labels (`!takedown`, `security:yanked`) are
* applied server-side based on the request's `atproto-accept-labelers` header,
* which the aggregator client may set per-request.
*/
/**
* Validate an untrusted, aggregator-supplied signed `profile` / `release`
* record against its lexicon. Returns the value when its known fields
* conform, or `null` when they don't (missing required fields, wrong types).
*
* This is the registry's read-side trust boundary: the aggregator hydrates
* signed records it does not author, so everything inside `profile` /
* `release` is untrusted until it passes here. Two limits callers must keep
* in mind:
*
*   - **Structure only.** The lexicon's `uri` format permits non-HTTP
*     schemes (including `javascript:`), so consumers rendering URLs in
*     markup MUST still apply their own scheme allow-list.
*   - **Non-stripping.** atcute validation does not remove unrecognised
*     keys (the lexicon objects are open). Extra keys pass through; they
*     are inert because consumers only read the typed lexicon fields. We
*     deliberately do not hand-roll a field whitelist to strip them — that
*     is the brittle per-record parsing this boundary exists to replace,
*     and unread keys are not a correctness or security risk.
*/
function validateProfile(raw) {
	const result = /* @__PURE__ */ safeParse(profile_exports.mainSchema, raw);
	return result.ok ? result.value : null;
}
function validateRelease(raw) {
	const result = /* @__PURE__ */ safeParse(release_exports.mainSchema, raw);
	return result.ok ? result.value : null;
}
/**
* Read-only client over an EmDash plugin registry aggregator.
*
* Wraps `@atcute/client` with the aggregator URL pre-bound and the
* `atproto-accept-labelers` header threaded through every request. Method
* names mirror the aggregator's XRPC method names (without the NSID prefix).
*
* Two layers of validation run at this boundary (the aggregator is an
* untrusted remote index):
*
*   - The **response envelope** (`uri`, `did`, `slug`, `labels`, …) is
*     validated by `@atcute/client` against the aggregator method's output
*     lexicon. A non-conforming envelope throws `ClientValidationError`.
*   - The **embedded signed `profile` / `release` records** — which the
*     aggregator relays verbatim and types as `unknown` — are validated
*     against the package lexicons here; a non-conforming record is
*     surfaced as `null` (callers must null-check) rather than failing the
*     whole call, so one bad record doesn't blank a search page.
*
* @example
* ```ts
* const discovery = new DiscoveryClient({
*   aggregatorUrl: "https://registry.emdashcms.com",
* });
* const result = await discovery.searchPackages({ q: "gallery", limit: 10 });
* for (const pkg of result.packages) {
*   console.log(pkg.uri, pkg.profile?.name ?? pkg.slug);
* }
* ```
*/
var DiscoveryClient = class {
	aggregatorUrl;
	acceptLabelers;
	#client;
	constructor(options) {
		this.aggregatorUrl = options.aggregatorUrl;
		this.acceptLabelers = options.acceptLabelers;
		const baseHandler = simpleFetchHandler({
			service: options.aggregatorUrl,
			fetch: options.fetch ?? globalThis.fetch
		});
		const acceptLabelers = this.acceptLabelers;
		this.#client = new Client({ handler: acceptLabelers ? async (pathname, init) => {
			const headers = new Headers(init.headers);
			headers.set("atproto-accept-labelers", acceptLabelers);
			return baseHandler(pathname, {
				...init,
				headers
			});
		} : baseHandler });
	}
	/**
	* Search packages by free-text query and optional filters. Hard-takedown
	* results are filtered server-side; remaining results have label state
	* hydrated.
	*
	* Throws `ClientResponseError` (from `@atcute/client`) on a non-2xx
	* response (carrying `.error`, `.description`, `.status`, `.headers`), or
	* `ClientValidationError` if the aggregator returns a response whose
	* envelope does not match the method's output lexicon.
	*/
	async searchPackages(params) {
		const out = await ok(this.#client.call(searchPackages_exports, { params }));
		return {
			...out,
			packages: out.packages.map((p) => ({
				...p,
				profile: validateProfile(p.profile)
			}))
		};
	}
	/**
	* Fetch a single package's full hydrated view by its AT URI.
	*/
	async getPackage(params) {
		const out = await ok(this.#client.call(getPackage_exports, { params }));
		return {
			...out,
			profile: validateProfile(out.profile)
		};
	}
	/**
	* Resolve a package by publisher handle + slug (or DID + slug). Cheaper
	* than `getPackage` when you only have human-readable identifiers.
	*/
	async resolvePackage(params) {
		const out = await ok(this.#client.call(resolvePackage_exports, { params }));
		return {
			...out,
			profile: validateProfile(out.profile)
		};
	}
	/**
	* List releases for a package, paginated and ordered by descending
	* semver version (newest version first), not by time. Yanked releases
	* are interleaved by version. Use `getLatestRelease` for the
	* convention "give me the highest non-yanked version".
	*/
	async listReleases(params) {
		const out = await ok(this.#client.call(listReleases_exports, { params }));
		return {
			...out,
			releases: out.releases.map((r) => ({
				...r,
				release: validateRelease(r.release)
			}))
		};
	}
	/**
	* Fetch the package's latest non-yanked release. Convenience wrapper around
	* `listReleases` that the aggregator can implement more efficiently than
	* client-side max-version selection (the version constraint engine lives
	* on the aggregator).
	*/
	async getLatestRelease(params) {
		const out = await ok(this.#client.call(getLatestRelease_exports, { params }));
		return {
			...out,
			release: validateRelease(out.release)
		};
	}
};
//#endregion
export { DiscoveryClient };
