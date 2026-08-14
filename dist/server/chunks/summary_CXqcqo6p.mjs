import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { ot as notFoundSummaryQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { i as handleNotFoundSummary } from "./redirects-Cwkq2H-G_CmNEpy6D.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/summary.mjs
var summary_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
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
		const query = parseQuery(url, notFoundSummaryQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleNotFoundSummary(db, query.limit));
	} catch (error) {
		return handleError(error, "Failed to fetch 404 summary", "NOT_FOUND_SUMMARY_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/summary@_@mjs
var page = () => summary_exports;
//#endregion
export { page };
