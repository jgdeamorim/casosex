import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { U as contentTrashQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/trash.mjs
var trash_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	if (!emdash?.handleContentListTrashed) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "content:read_drafts");
	if (denied) return denied;
	const query = parseQuery(url, contentTrashQuery);
	if (isParseError(query)) return query;
	return unwrapResult(await emdash.handleContentListTrashed(collection, query));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/trash@_@mjs
var page = () => trash_exports;
//#endregion
export { page };
