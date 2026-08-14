import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { i as bylineFieldUpdateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import { a as unwrapResult, i as requireDb, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { n as handleBylineFieldDelete, o as handleBylineFieldUpdate, r as handleBylineFieldGet } from "./byline-fields-T9ZLZMxJ_DD-MrMTw.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_.mjs
var _slug__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PATCH: () => PATCH,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "schema:read");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const slug = params.slug;
	if (!slug) return apiError("MISSING_PARAM", "Field slug is required", 400);
	return unwrapResult(await handleBylineFieldGet(emdash.db, slug));
};
var PATCH = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const slug = params.slug;
	if (!slug) return apiError("MISSING_PARAM", "Field slug is required", 400);
	const body = await parseBody(request, bylineFieldUpdateBody);
	if (isParseError(body)) return body;
	return unwrapResult(await handleBylineFieldUpdate(emdash.db, slug, {
		label: body.label,
		required: body.required,
		translatable: body.translatable,
		validation: body.validation,
		sortOrder: body.sortOrder
	}));
};
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const slug = params.slug;
	if (!slug) return apiError("MISSING_PARAM", "Field slug is required", 400);
	return unwrapResult(await handleBylineFieldDelete(emdash.db, slug));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_@_@mjs
var page = () => _slug__exports;
//#endregion
export { page };
