import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import { k as bylineUpdateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import { t as BylineRepository } from "./byline-C5TAqs8N_UXuC5WkK.mjs";
import { a as unwrapResult, i as requireDb, n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./bylines-B8-WGdja_BuJyweeN.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { i as handleBylineUpdate } from "./bylines-DGuqBLjV_2-QzYBGv.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/index.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "bylines:read");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const byline = await new BylineRepository(emdash.db).findById(params.id);
		if (!byline) return apiError("NOT_FOUND", "Byline not found", 404);
		return apiSuccess(byline);
	} catch (error) {
		return handleError(error, "Failed to get byline", "BYLINE_GET_ERROR");
	}
};
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const body = await parseBody(request, bylineUpdateBody);
	if (isParseError(body)) return body;
	const result = await handleBylineUpdate(emdash.db, params.id, {
		slug: body.slug,
		displayName: body.displayName,
		bio: body.bio ?? null,
		avatarMediaId: body.avatarMediaId ?? null,
		websiteUrl: body.websiteUrl ?? null,
		userId: body.userId ?? null,
		isGuest: body.isGuest,
		customFields: body.customFields
	});
	if (result.success);
	return unwrapResult(result);
};
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		if (!await new BylineRepository(emdash.db).delete(params.id)) return apiError("NOT_FOUND", "Byline not found", 404);
		return apiSuccess({ deleted: true });
	} catch (error) {
		return handleError(error, "Failed to delete byline", "BYLINE_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/index@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
