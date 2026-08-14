import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import { o as getI18nConfig } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { R as contentPreviewUrlBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { a as unwrapResult, n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as parseOptionalBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as getPreviewUrl } from "./preview-D4Jnbfx7_C8PM7iIF.mjs";
import { t as resolveSecretsCached } from "./secrets-870d-7yA_DAoCQXHi.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs
var preview_url_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var DURATION_PATTERN = /^(\d+)([smhdw])$/;
var POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "content:read_drafts");
	if (denied) return denied;
	const collection = params.collection;
	const id = params.id;
	const { previewSecret } = await resolveSecretsCached(emdash.db);
	let entryLocale = null;
	if (emdash?.handleContentGet) {
		const result = await emdash.handleContentGet(collection, id);
		if (!result.success) return unwrapResult(result);
		entryLocale = result.data?.item?.locale ?? null;
	}
	const body = await parseOptionalBody(request, contentPreviewUrlBody, {});
	if (isParseError(body)) return body;
	const expiresIn = body.expiresIn || "1h";
	const pathPattern = body.pathPattern || "/{collection}/{id}";
	const i18n = getI18nConfig();
	let localeSegment = "";
	if (entryLocale && i18n) localeSegment = entryLocale === i18n.defaultLocale && !i18n.prefixDefaultLocale ? "" : entryLocale;
	else if (entryLocale) localeSegment = entryLocale;
	const expiresInSeconds = typeof expiresIn === "number" ? expiresIn : parseExpiresIn(expiresIn);
	const expiresAt = Math.floor(Date.now() / 1e3) + expiresInSeconds;
	try {
		return apiSuccess({
			url: await getPreviewUrl({
				collection,
				id,
				secret: previewSecret,
				expiresIn,
				pathPattern,
				locale: localeSegment
			}),
			expiresAt
		});
	} catch (error) {
		return handleError(error, "Failed to generate preview URL", "TOKEN_ERROR");
	}
};
function parseExpiresIn(duration) {
	const match = duration.match(DURATION_PATTERN);
	if (!match) return 3600;
	const value = parseInt(match[1], 10);
	switch (match[2]) {
		case "s": return value;
		case "m": return value * 60;
		case "h": return value * 60 * 60;
		case "d": return value * 60 * 60 * 24;
		case "w": return value * 60 * 60 * 24 * 7;
		default: return 3600;
	}
}
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/preview-url@_@mjs
var page = () => preview_url_exports;
//#endregion
export { page };
