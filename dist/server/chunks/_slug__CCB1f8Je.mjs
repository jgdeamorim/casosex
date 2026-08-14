import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { wt as updateSectionBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { a as handleSectionUpdate, n as handleSectionDelete, r as handleSectionGet } from "./sections-DSuEfirn_LC35OjDp.mjs";
import { a as unwrapResult, i as requireDb, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/_slug_.mjs
var _slug__exports = /* @__PURE__ */ __exportAll({
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
	const { slug } = params;
	const denied = requirePerm(user, "sections:read");
	if (denied) return denied;
	if (!slug) return apiError("VALIDATION_ERROR", "slug is required", 400);
	try {
		return unwrapResult(await handleSectionGet(db, slug));
	} catch (error) {
		return handleError(error, "Failed to fetch section", "SECTION_GET_ERROR");
	}
};
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { slug } = params;
	const denied = requirePerm(user, "sections:manage");
	if (denied) return denied;
	if (!slug) return apiError("VALIDATION_ERROR", "slug is required", 400);
	try {
		const body = await parseBody(request, updateSectionBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleSectionUpdate(db, slug, body));
	} catch (error) {
		return handleError(error, "Failed to update section", "SECTION_UPDATE_ERROR");
	}
};
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { slug } = params;
	const denied = requirePerm(user, "sections:manage");
	if (denied) return denied;
	if (!slug) return apiError("VALIDATION_ERROR", "slug is required", 400);
	try {
		return unwrapResult(await handleSectionDelete(db, slug));
	} catch (error) {
		return handleError(error, "Failed to delete section", "SECTION_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/_slug_@_@mjs
var page = () => _slug__exports;
//#endregion
export { page };
