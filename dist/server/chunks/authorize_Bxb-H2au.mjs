import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, a as _enum, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import "./dist_Di9U_sWQ.mjs";
import { t as handleDeviceAuthorize } from "./device-flow-DhUsyJU6__0x_uxC2.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/authorize.mjs
var authorize_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var authorizeSchema = object({
	user_code: string().min(1),
	action: _enum(["approve", "deny"]).optional()
});
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	const { user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Authentication required", 401);
	try {
		const body = await parseBody(request, authorizeSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleDeviceAuthorize(emdash.db, user.id, user.role, body));
	} catch (error) {
		return handleError(error, "Failed to authorize device", "AUTHORIZE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/authorize@_@mjs
var page = () => authorize_exports;
//#endregion
export { page };
