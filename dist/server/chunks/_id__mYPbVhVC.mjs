import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { s as localeFilterQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { St as updateMenuItemBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { a as handleMenuItemDelete, s as handleMenuItemUpdate } from "./menus-BxPLFfIc_Qsmtjm90.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	PUT: () => PUT,
	prerender: () => false
});
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const itemId = params.id;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	if (!itemId) return apiError("VALIDATION_ERROR", "id is required", 400);
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const body = await parseBody(request, updateMenuItemBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuItemUpdate(emdash.db, name, itemId, body, { locale: localeQ.locale }));
	} catch (error) {
		return handleError(error, "Failed to update menu item", "MENU_ITEM_UPDATE_ERROR");
	}
};
var DELETE = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const itemId = params.id;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	if (!itemId) return apiError("VALIDATION_ERROR", "id is required", 400);
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		return unwrapResult(await handleMenuItemDelete(emdash.db, name, itemId, { locale: localeQ.locale }));
	} catch (error) {
		return handleError(error, "Failed to delete menu item", "MENU_ITEM_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
