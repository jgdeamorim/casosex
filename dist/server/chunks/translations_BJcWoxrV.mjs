import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import { O as bylineTranslationCreateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import { t as BylineRepository } from "./byline-C5TAqs8N_UXuC5WkK.mjs";
import { a as unwrapResult, i as requireDb, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./bylines-B8-WGdja_BuJyweeN.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { n as handleBylineCreate, r as handleBylineTranslations } from "./bylines-DGuqBLjV_2-QzYBGv.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/translations.mjs
var translations_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const id = params.id;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "bylines:read");
	if (denied) return denied;
	try {
		return unwrapResult(await handleBylineTranslations(emdash.db, id));
	} catch (error) {
		return handleError(error, "Failed to fetch byline translations", "BYLINE_TRANSLATIONS_ERROR");
	}
};
var POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const id = params.id;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, bylineTranslationCreateBody);
		if (isParseError(body)) return body;
		const source = await new BylineRepository(emdash.db).findById(id);
		if (!source) return apiError("NOT_FOUND", "Byline not found", 404);
		const result = await handleBylineCreate(emdash.db, {
			slug: body.slug ?? source.slug,
			displayName: body.displayName ?? source.displayName,
			bio: body.bio ?? null,
			avatarMediaId: body.avatarMediaId ?? source.avatarMediaId,
			websiteUrl: body.websiteUrl ?? source.websiteUrl,
			userId: null,
			isGuest: source.isGuest,
			locale: body.locale,
			translationOf: id
		});
		if (result.success);
		return unwrapResult(result, 201);
	} catch (error) {
		return handleError(error, "Failed to create byline translation", "BYLINE_TRANSLATION_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/translations@_@mjs
var page = () => translations_exports;
//#endregion
export { page };
