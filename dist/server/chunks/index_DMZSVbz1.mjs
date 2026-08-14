import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import { c as resolveConfiguredLocale, o as getI18nConfig } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import { A as bylinesListQuery, D as bylineCreateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import { t as BylineRepository } from "./byline-C5TAqs8N_UXuC5WkK.mjs";
import { a as unwrapResult, n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./bylines-B8-WGdja_BuJyweeN.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { n as handleBylineCreate } from "./bylines-DGuqBLjV_2-QzYBGv.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/index.mjs
var bylines_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "bylines:read");
	if (denied) return denied;
	const query = parseQuery(url, bylinesListQuery);
	if (isParseError(query)) return query;
	const locale = query.locale ? resolveConfiguredLocale(query.locale) : void 0;
	const i18n = getI18nConfig();
	if (locale && i18n && !i18n.locales.includes(locale)) return apiError("VALIDATION_ERROR", `Locale "${locale}" is not configured for this site`, 400);
	try {
		return apiSuccess(await new BylineRepository(emdash.db).findMany({
			search: query.search,
			isGuest: query.isGuest,
			userId: query.userId,
			locale,
			cursor: query.cursor,
			limit: query.limit
		}));
	} catch (error) {
		return handleError(error, "Failed to list bylines", "BYLINE_LIST_ERROR");
	}
};
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	const body = await parseBody(request, bylineCreateBody);
	if (isParseError(body)) return body;
	try {
		const result = await handleBylineCreate(emdash.db, {
			slug: body.slug,
			displayName: body.displayName,
			bio: body.bio ?? null,
			avatarMediaId: body.avatarMediaId ?? null,
			websiteUrl: body.websiteUrl ?? null,
			userId: body.userId ?? null,
			isGuest: body.isGuest,
			locale: body.locale,
			translationOf: body.translationOf,
			customFields: body.customFields
		});
		if (result.success);
		return unwrapResult(result, 201);
	} catch (error) {
		return handleError(error, "Failed to create byline", "BYLINE_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/index@_@mjs
var page = () => bylines_exports;
//#endregion
export { page };
