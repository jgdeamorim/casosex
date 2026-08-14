import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { s as localeFilterQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { J as createMenuBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { c as handleMenuList, t as handleMenuCreate } from "./menus-BxPLFfIc_Qsmtjm90.mjs";
import { a as unwrapResult, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/index.mjs
var menus_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "menus:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleMenuList(emdash.db, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to fetch menus", "MENU_LIST_ERROR");
	}
};
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createMenuBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuCreate(emdash.db, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create menu", "MENU_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/index@_@mjs
var page = () => menus_exports;
//#endregion
export { page };
