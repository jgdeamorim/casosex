import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { at as notFoundPruneBody, it as notFoundListQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { n as handleNotFoundList, r as handleNotFoundPrune, t as handleNotFoundClear } from "./redirects-Cwkq2H-G_CmNEpy6D.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/index.mjs
var _404s_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:read");
	if (denied) return denied;
	try {
		const query = parseQuery(url, notFoundListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleNotFoundList(db, query));
	} catch (error) {
		return handleError(error, "Failed to fetch 404 log", "NOT_FOUND_LIST_ERROR");
	}
};
var DELETE = async ({ locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;
	try {
		return unwrapResult(await handleNotFoundClear(db));
	} catch (error) {
		return handleError(error, "Failed to clear 404 log", "NOT_FOUND_CLEAR_ERROR");
	}
};
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, notFoundPruneBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleNotFoundPrune(db, body.olderThan));
	} catch (error) {
		return handleError(error, "Failed to prune 404 log", "NOT_FOUND_PRUNE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/index@_@mjs
var page = () => _404s_exports;
//#endregion
export { page };
