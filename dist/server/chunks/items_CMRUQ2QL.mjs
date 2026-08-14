import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { s as localeFilterQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { Y as createMenuItemBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { i as handleMenuItemCreate } from "./menus-BxPLFfIc_Qsmtjm90.mjs";
import { a as unwrapResult, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items.mjs
var items_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const body = await parseBody(request, createMenuItemBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuItemCreate(emdash.db, name, body, { locale: localeQ.locale }), 201);
	} catch (error) {
		return handleError(error, "Failed to create menu item", "MENU_ITEM_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items@_@mjs
var page = () => items_exports;
//#endregion
export { page };
