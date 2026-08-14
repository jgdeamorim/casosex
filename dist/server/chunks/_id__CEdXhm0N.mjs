import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { Ct as updateRedirectBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import { r as invalidateRedirectCache } from "./cache-B26cufFd_FubCBUTM.mjs";
import { a as unwrapResult, i as requireDb, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { l as handleRedirectUpdate, o as handleRedirectDelete, s as handleRedirectGet } from "./redirects-Cwkq2H-G_CmNEpy6D.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { id } = params;
	const denied = requirePerm(user, "redirects:read");
	if (denied) return denied;
	if (!id) return apiError("VALIDATION_ERROR", "id is required", 400);
	try {
		return unwrapResult(await handleRedirectGet(db, id));
	} catch (error) {
		return handleError(error, "Failed to fetch redirect", "REDIRECT_GET_ERROR");
	}
};
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { id } = params;
	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;
	if (!id) return apiError("VALIDATION_ERROR", "id is required", 400);
	try {
		const body = await parseBody(request, updateRedirectBody);
		if (isParseError(body)) return body;
		const result = await handleRedirectUpdate(db, id, body);
		invalidateRedirectCache();
		return unwrapResult(result);
	} catch (error) {
		return handleError(error, "Failed to update redirect", "REDIRECT_UPDATE_ERROR");
	}
};
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { id } = params;
	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;
	if (!id) return apiError("VALIDATION_ERROR", "id is required", 400);
	try {
		const result = await handleRedirectDelete(db, id);
		invalidateRedirectCache();
		return unwrapResult(result);
	} catch (error) {
		return handleError(error, "Failed to delete redirect", "REDIRECT_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
