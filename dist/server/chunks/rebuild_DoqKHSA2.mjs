import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { mt as searchRebuildBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as FTSManager } from "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./search-CeO678cp_BTXu7Bkl.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/rebuild.mjs
var rebuild_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
/**
* Rebuild the search index for a collection
*
* Body:
* - collection: Collection slug to rebuild (required)
*/
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const denied = requirePerm(user, "search:manage");
	if (denied) return denied;
	const body = await parseBody(request, searchRebuildBody);
	if (isParseError(body)) return body;
	const ftsManager = new FTSManager(emdash.db);
	try {
		const config = await ftsManager.getSearchConfig(body.collection);
		if (!config?.enabled) return apiError("SEARCH_NOT_ENABLED", `Search is not enabled for collection "${body.collection}"`, 400);
		const searchableFields = await ftsManager.getSearchableFields(body.collection);
		if (searchableFields.length === 0) return apiError("NO_SEARCHABLE_FIELDS", `No searchable fields defined for collection "${body.collection}"`, 400);
		await ftsManager.rebuildIndex(body.collection, searchableFields, config.weights);
		const stats = await ftsManager.getIndexStats(body.collection);
		return apiSuccess({
			collection: body.collection,
			indexed: stats?.indexed ?? 0
		});
	} catch (error) {
		return handleError(error, "Failed to rebuild index", "REBUILD_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/rebuild@_@mjs
var page = () => rebuild_exports;
//#endregion
export { page };
