import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import "./content-CpfKV9QE_DeIsRghk.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./user-BAumEmpA_79fxFfjA.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import { lt as validateAggregatorUrl, n as coerceRegistryConfig, t as assertSafeArtifactUrl } from "./query-1xOcEy18_dGFoQgZT.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import "./manifest-schema-bCq54i7F_oDiktgui.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
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
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./parse-BL49yb9D_DEZsBUX3.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/registry/artifact.mjs
var artifact_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* Image content types the proxy will pass through. Anything else is rejected.
*
* SVG is deliberately excluded: it is active content (an `<svg><script>`
* executes when navigated to as a top-level document), and the publisher
* supplies the bytes. Rather than serve it behind mitigations, we refuse it
* end-to-end — the publish CLI rejects SVG artifacts too, so a conforming
* release never references one. AVIF is included.
*/
var ALLOWED_IMAGE_TYPES = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif",
	"image/avif"
]);
/** Artifact kinds the proxy can resolve. `screenshot` additionally needs `index`. */
var ALLOWED_KINDS = /* @__PURE__ */ new Set([
	"icon",
	"banner",
	"screenshot"
]);
/** Loose DID shape (`did:method:id`); the aggregator lexicon is authoritative. */
var DID_PATTERN = /^did:[a-z]+:.+/;
/** Slug grammar: ASCII letter then letters / digits / `-` / `_`. Mirrors the install route. */
var SLUG_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
/** Non-negative integer, for the screenshot index param. */
var INDEX_PATTERN = /^\d+$/;
/** Cap proxied images so a hostile host can't stream an unbounded body. */
var MAX_IMAGE_BYTES = 5242880;
/** Redirect hops to follow, re-validating each target against SSRF rules. */
var MAX_REDIRECTS = 5;
/** Wall-clock budget covering connect + headers + body for the artifact fetch. */
var FETCH_TIMEOUT_MS = 15e3;
/** Per-aggregator-request timeout and overall budget for release resolution. */
var AGGREGATOR_REQUEST_TIMEOUT_MS = 15e3;
var AGGREGATOR_TOTAL_BUDGET_MS = 3e4;
/** Bound the version search: 20 pages * 50 per page = 1000 releases worth. */
var MAX_LIST_PAGES = 20;
/** Build a fetch that enforces a per-request and per-budget timeout. Mirrors the install handler. */
function timedFetch(totalDeadline) {
	return (input, init) => {
		const remaining = Math.max(0, totalDeadline - Date.now());
		if (remaining === 0) return Promise.reject(/* @__PURE__ */ new Error("Aggregator request budget exhausted"));
		const timeout = Math.min(AGGREGATOR_REQUEST_TIMEOUT_MS, remaining);
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeout);
		const callerSignal = init?.signal;
		if (callerSignal) if (callerSignal.aborted) controller.abort(callerSignal.reason);
		else callerSignal.addEventListener("abort", () => controller.abort(callerSignal.reason));
		return fetch(input, {
			...init,
			signal: controller.signal
		}).finally(() => {
			clearTimeout(timer);
		});
	};
}
/**
* Narrow one entry of a release's `artifacts` map to a usable image URL.
*
* The embedded `release` record is lexicon-validated at the DiscoveryClient
* boundary, but `artifacts` is an aggregator pass-through typed `unknown`, so
* the entry's shape is not guaranteed. Returns the `url` string only when the
* value is an object carrying a non-empty string `url`; everything else
* (missing key, wrong type, no `url`) yields `null`.
*/
function declaredArtifactUrl(value) {
	if (!value || typeof value !== "object") return null;
	const url = value.url;
	if (typeof url !== "string" || url.length === 0) return null;
	return url;
}
/**
* Resolve the declared artifact URL for `(kind, index)` from a release's
* `artifacts` map. Returns `null` when the requested artifact isn't present
* or doesn't carry a usable URL.
*/
function resolveDeclaredUrl(artifacts, kind, index) {
	if (!artifacts || typeof artifacts !== "object") return null;
	const map = artifacts;
	if (kind === "icon") return declaredArtifactUrl(map.icon);
	if (kind === "banner") return declaredArtifactUrl(map.banner);
	const screenshots = map.screenshots;
	if (!Array.isArray(screenshots)) return null;
	if (index < 0 || index >= screenshots.length) return null;
	return declaredArtifactUrl(screenshots[index]);
}
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:read");
	if (denied) return denied;
	const did = url.searchParams.get("did");
	const slug = url.searchParams.get("slug");
	const kind = url.searchParams.get("kind");
	const versionParam = url.searchParams.get("version");
	const indexParam = url.searchParams.get("index");
	if (!did || !slug || !kind) return apiError("INVALID_REQUEST", "Missing did, slug, or kind", 400);
	if (did.length > 256 || !DID_PATTERN.test(did)) return apiError("INVALID_REQUEST", "Invalid did", 400);
	if (slug.length > 64 || !SLUG_PATTERN.test(slug)) return apiError("INVALID_REQUEST", "Invalid slug", 400);
	if (!ALLOWED_KINDS.has(kind)) return apiError("INVALID_REQUEST", "Invalid kind", 400);
	let index = 0;
	if (kind === "screenshot") {
		if (indexParam === null) return apiError("INVALID_REQUEST", "Missing index for screenshot", 400);
		if (!INDEX_PATTERN.test(indexParam)) return apiError("INVALID_REQUEST", "Invalid index", 400);
		index = Number(indexParam);
		if (!Number.isSafeInteger(index)) return apiError("INVALID_REQUEST", "Invalid index", 400);
	}
	let version;
	if (versionParam !== null && versionParam.length > 0) {
		if (versionParam.length > 64) return apiError("INVALID_REQUEST", "Invalid version", 400);
		version = versionParam;
	}
	const registryConfig = coerceRegistryConfig(emdash.config.experimental?.registry);
	if (!registryConfig) return apiError("REGISTRY_NOT_CONFIGURED", "Registry is not configured", 400);
	try {
		validateAggregatorUrl(registryConfig.aggregatorUrl);
	} catch {
		return apiError("REGISTRY_NOT_CONFIGURED", "Registry aggregator URL is invalid", 500);
	}
	let declaredUrl;
	try {
		const resolved = await resolveArtifactUrl(registryConfig, did, slug, version, kind, index);
		if (resolved === null) return apiError("ARTIFACT_NOT_FOUND", "Artifact not found", 404);
		declaredUrl = resolved;
	} catch {
		return apiError("ARTIFACT_RESOLVE_FAILED", "Failed to resolve artifact", 502);
	}
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		let current;
		try {
			current = await assertSafeArtifactUrl(declaredUrl);
		} catch {
			return apiError("ARTIFACT_URL_REJECTED", "Artifact URL is not allowed", 400);
		}
		let response;
		for (let hop = 0;; hop++) {
			response = await fetch(current.href, {
				redirect: "manual",
				signal: controller.signal
			});
			if (response.status < 300 || response.status >= 400) break;
			const location = response.headers.get("location");
			if (!location) break;
			if (hop === MAX_REDIRECTS) return apiError("ARTIFACT_URL_REJECTED", "Too many redirects", 502);
			let next;
			try {
				next = await assertSafeArtifactUrl(new URL(location, current).href);
			} catch {
				return apiError("ARTIFACT_URL_REJECTED", "Redirect target is not allowed", 400);
			}
			current = next;
		}
		if (!response.ok) return apiError("ARTIFACT_FETCH_FAILED", "Failed to fetch artifact", 502);
		const contentType = (response.headers.get("content-type") ?? "").split(";", 1)[0].trim().toLowerCase();
		if (!ALLOWED_IMAGE_TYPES.has(contentType)) return apiError("ARTIFACT_NOT_IMAGE", "Artifact is not an allowed image type", 415);
		const declaredLength = response.headers.get("content-length");
		if (declaredLength) {
			const declared = Number(declaredLength);
			if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES) return apiError("ARTIFACT_TOO_LARGE", "Artifact exceeds size limit", 413);
		}
		const bytes = await readCapped(response, MAX_IMAGE_BYTES);
		if (bytes === null) return apiError("ARTIFACT_TOO_LARGE", "Artifact exceeds size limit", 413);
		return new Response(bytes, { headers: {
			"Content-Type": contentType,
			"Cache-Control": "private, no-store",
			"X-Content-Type-Options": "nosniff",
			"Content-Disposition": "attachment",
			"Content-Security-Policy": "default-src 'none'; sandbox"
		} });
	} catch {
		return apiError("ARTIFACT_FETCH_FAILED", "Failed to fetch artifact", 502);
	} finally {
		clearTimeout(timer);
	}
};
/**
* Resolve the declared artifact URL for `(did, slug, version, kind, index)`
* from the aggregator's release record. Mirrors the install handler's release
* lookup. Returns `null` when the package/release/artifact isn't found.
*
* Self-contained to this route: the install/update handlers are intentionally
* left untouched, so a small amount of resolution-pattern duplication is
* accepted here.
*/
async function resolveArtifactUrl(registryConfig, did, slug, version, kind, index) {
	const { DiscoveryClient } = await import("./discovery_uSPm7AgP.mjs");
	const aggregatorDeadline = Date.now() + AGGREGATOR_TOTAL_BUDGET_MS;
	const discovery = new DiscoveryClient({
		aggregatorUrl: registryConfig.aggregatorUrl,
		acceptLabelers: registryConfig.acceptLabelers,
		fetch: timedFetch(aggregatorDeadline)
	});
	const publisherDid = did;
	const releaseView = await (async () => {
		if (!version) return discovery.getLatestRelease({
			did: publisherDid,
			package: slug
		});
		let cursor;
		const seenCursors = /* @__PURE__ */ new Set();
		for (let page = 0; page < MAX_LIST_PAGES; page++) {
			if (cursor !== void 0) {
				if (seenCursors.has(cursor)) break;
				seenCursors.add(cursor);
			}
			const result = await discovery.listReleases({
				did: publisherDid,
				package: slug,
				cursor,
				limit: 50
			});
			for (const r of result.releases) if (r.version === version) return r;
			if (!result.cursor) break;
			cursor = result.cursor;
		}
	})();
	if (!releaseView?.release) return null;
	return resolveDeclaredUrl(releaseView.release.artifacts, kind, index);
}
/**
* Read a response body into memory, aborting once it exceeds `limit`. Returns
* `null` when the cap is breached (the streamed body lied about / omitted
* Content-Length). The cap is the real defence against an unbounded body.
*/
async function readCapped(response, limit) {
	const body = response.body;
	if (!body) {
		const buf = new Uint8Array(await response.arrayBuffer());
		return buf.length > limit ? null : buf;
	}
	const reader = body.getReader();
	const chunks = [];
	let total = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) {
			total += value.length;
			if (total > limit) {
				await reader.cancel();
				return null;
			}
			chunks.push(value);
		}
	}
	const combined = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		combined.set(chunk, offset);
		offset += chunk.length;
	}
	return combined;
}
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/registry/artifact@_@mjs
var page = () => artifact_exports;
//#endregion
export { page };
