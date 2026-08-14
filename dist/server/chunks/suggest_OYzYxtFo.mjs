import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { ht as searchSuggestQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as getSuggestions } from "./search-CeO678cp_BTXu7Bkl.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/suggest.mjs
var suggest_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* Get search suggestions for autocomplete
*
* Query parameters:
* - q: Partial search query (required)
* - collections: Comma-separated list of collection slugs (optional)
* - limit: Maximum suggestions (optional, defaults to 5)
*/
var GET = async ({ url, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const query = parseQuery(url, searchSuggestQuery);
	if (isParseError(query)) return query;
	const collections = query.collections ? query.collections.split(",").map((c) => c.trim()) : void 0;
	try {
		await emdash.ensureSearchHealthy?.();
		return apiSuccess({ items: await getSuggestions(emdash.db, query.q, {
			collections,
			locale: query.locale,
			limit: query.limit
		}) });
	} catch (error) {
		return handleError(error, "Failed to get suggestions", "SUGGESTION_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/suggest@_@mjs
var page = () => suggest_exports;
//#endregion
export { page };
