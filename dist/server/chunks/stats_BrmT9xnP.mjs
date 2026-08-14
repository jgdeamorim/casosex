import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as getSearchStats } from "./search-CeO678cp_BTXu7Bkl.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/stats.mjs
var stats_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* Get search index statistics
*/
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "search:manage");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	try {
		return apiSuccess(await getSearchStats(emdash.db));
	} catch (error) {
		return handleError(error, "Failed to get stats", "STATS_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/stats@_@mjs
var page = () => stats_exports;
//#endregion
export { page };
