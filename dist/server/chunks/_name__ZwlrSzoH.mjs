import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { s as localeFilterQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { xt as updateMenuBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as handleMenuDelete, r as handleMenuGet, u as handleMenuUpdate } from "./menus-BxPLFfIc_Qsmtjm90.mjs";
import { a as unwrapResult, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_.mjs
var _name__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleMenuGet(emdash.db, name, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to fetch menu", "MENU_GET_ERROR");
	}
};
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		const body = await parseBody(request, updateMenuBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuUpdate(emdash.db, name, {
			...body,
			locale: query.locale
		}));
	} catch (error) {
		return handleError(error, "Failed to update menu", "MENU_UPDATE_ERROR");
	}
};
var DELETE = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleMenuDelete(emdash.db, name, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to delete menu", "MENU_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_@_@mjs
var page = () => _name__exports;
//#endregion
export { page };
