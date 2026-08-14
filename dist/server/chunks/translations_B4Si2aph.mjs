import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, v as object } from "./schemas_CzTFUUcv.mjs";
import { s as localeFilterQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
import { l as handleMenuTranslations, r as handleMenuGet, t as handleMenuCreate } from "./menus-BxPLFfIc_Qsmtjm90.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/translations.mjs
var translations_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var createTranslationBody = object({
	locale: string().min(1),
	label: string().min(1).optional()
}).meta({ id: "CreateMenuTranslationBody" });
var GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "menus:read");
	if (denied) return denied;
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const anchor = await handleMenuGet(emdash.db, name, { locale: localeQ.locale });
		if (!anchor.success) return unwrapResult(anchor);
		return unwrapResult(await handleMenuTranslations(emdash.db, anchor.data.id));
	} catch (error) {
		return handleError(error, "Failed to fetch menu translations", "MENU_TRANSLATIONS_ERROR");
	}
};
var POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const body = await parseBody(request, createTranslationBody);
		if (isParseError(body)) return body;
		const source = await handleMenuGet(emdash.db, name, { locale: localeQ.locale });
		if (!source.success) return unwrapResult(source);
		return unwrapResult(await handleMenuCreate(emdash.db, {
			name,
			label: body.label ?? source.data.label,
			locale: body.locale,
			translationOf: source.data.id
		}), 201);
	} catch (error) {
		return handleError(error, "Failed to create menu translation", "MENU_TRANSLATION_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/translations@_@mjs
var page = () => translations_exports;
//#endregion
export { page };
