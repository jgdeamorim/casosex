import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import "./dist_Di9U_sWQ.mjs";
import { i as handleTokenRefresh } from "./device-flow-DhUsyJU6__0x_uxC2.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/refresh.mjs
var refresh_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var refreshSchema = object({
	refresh_token: string().min(1),
	grant_type: string().min(1)
});
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, refreshSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleTokenRefresh(emdash.db, body));
	} catch (error) {
		return handleError(error, "Failed to refresh token", "TOKEN_REFRESH_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/refresh@_@mjs
var page = () => refresh_exports;
//#endregion
export { page };
