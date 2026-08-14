import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as apiSuccess, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as resolveSecretsCached } from "./secrets-870d-7yA_DAoCQXHi.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/themes/preview.mjs
var preview_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:read");
	if (denied) return denied;
	const { previewSecret: secret } = await resolveSecretsCached(emdash.db);
	let body;
	try {
		body = await request.json();
	} catch {
		return apiError("INVALID_REQUEST", "Invalid JSON body", 400);
	}
	if (!body.previewUrl || typeof body.previewUrl !== "string") return apiError("INVALID_REQUEST", "previewUrl is required", 400);
	let parsedPreviewUrl;
	try {
		parsedPreviewUrl = new URL(body.previewUrl);
	} catch {
		return apiError("INVALID_REQUEST", "previewUrl must be a valid URL", 400);
	}
	if (parsedPreviewUrl.protocol !== "https:") return apiError("INVALID_REQUEST", "previewUrl must use HTTPS", 400);
	const source = getPublicOrigin(url, emdash?.config);
	const exp = Math.floor(Date.now() / 1e3) + 3600;
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const buffer = await crypto.subtle.sign("HMAC", key, encoder.encode(`${source}:${exp}`));
	const sig = Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
	const previewUrl = new URL(body.previewUrl);
	previewUrl.searchParams.set("source", source);
	previewUrl.searchParams.set("exp", String(exp));
	previewUrl.searchParams.set("sig", sig);
	return apiSuccess({ url: previewUrl.toString() });
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/themes/preview@_@mjs
var page = () => preview_exports;
//#endregion
export { page };
