import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { pt as searchQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import { m as hasPermission } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { r as searchWithDb } from "./search-CeO678cp_BTXu7Bkl.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/index.mjs
var search_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* Search content
*
* Query parameters:
* - q: Search query (required)
* - collections: Comma-separated list of collection slugs (optional, defaults to all)
* - status: Filter by status (optional, defaults to 'published')
* - limit: Maximum results (optional, defaults to 20)
*/
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const query = parseQuery(url, searchQuery);
	if (isParseError(query)) return query;
	const collections = query.collections ? query.collections.split(",").map((c) => c.trim()) : void 0;
	const status = query.status && query.status !== "published" && hasPermission(user, "content:read_drafts") ? query.status : "published";
	try {
		await emdash.ensureSearchHealthy?.();
		return apiSuccess(await searchWithDb(emdash.db, query.q, {
			collections,
			status,
			locale: query.locale,
			limit: query.limit,
			cursor: query.cursor
		}));
	} catch (error) {
		return handleError(error, "Search failed", "SEARCH_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/index@_@mjs
var page = () => search_exports;
//#endregion
export { page };
