import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { Q as createSectionBody, gt as sectionsListQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { i as handleSectionList, t as handleSectionCreate } from "./sections-DSuEfirn_LC35OjDp.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/index.mjs
var sections_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "sections:read");
	if (denied) return denied;
	try {
		const query = parseQuery(url, sectionsListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleSectionList(db, query));
	} catch (error) {
		return handleError(error, "Failed to fetch sections", "SECTION_LIST_ERROR");
	}
};
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "sections:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createSectionBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleSectionCreate(db, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create section", "SECTION_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/index@_@mjs
var page = () => sections_exports;
//#endregion
export { page };
