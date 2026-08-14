import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import "./dist_Di9U_sWQ.mjs";
import { a as handleTokenRevoke } from "./device-flow-DhUsyJU6__0x_uxC2.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/revoke.mjs
var revoke_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var revokeSchema = object({ token: string().min(1) });
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, revokeSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleTokenRevoke(emdash.db, body));
	} catch (error) {
		return handleError(error, "Failed to revoke token", "TOKEN_REVOKE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/revoke@_@mjs
var page = () => revoke_exports;
//#endregion
export { page };
