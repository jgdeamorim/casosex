import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { Z as createRedirectBody, ct as redirectsListQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import { r as invalidateRedirectCache } from "./cache-B26cufFd_FubCBUTM.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { a as handleRedirectCreate, c as handleRedirectList } from "./redirects-Cwkq2H-G_CmNEpy6D.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/index.mjs
var redirects_exports = /* @__PURE__ */ __exportAll({
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
		const query = parseQuery(url, redirectsListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleRedirectList(db, query));
	} catch (error) {
		return handleError(error, "Failed to fetch redirects", "REDIRECT_LIST_ERROR");
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
		const body = await parseBody(request, createRedirectBody);
		if (isParseError(body)) return body;
		const result = await handleRedirectCreate(db, body);
		invalidateRedirectCache();
		return unwrapResult(result, 201);
	} catch (error) {
		return handleError(error, "Failed to create redirect", "REDIRECT_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/index@_@mjs
var page = () => redirects_exports;
//#endregion
export { page };
