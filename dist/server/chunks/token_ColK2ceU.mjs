import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as getTrustedProxyHeaders } from "./trusted-proxy-CwjQj0YG_BcObCAIe.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import { n as getClientIp, r as rateLimitResponse, t as checkRateLimit } from "./rate-limit-Vkp9gQ1Y_BDw18TRB.mjs";
import "./dist_Di9U_sWQ.mjs";
import { r as handleDeviceTokenExchange } from "./device-flow-DhUsyJU6__0x_uxC2.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/token.mjs
var token_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var deviceTokenSchema = object({
	device_code: string().min(1),
	grant_type: string().min(1)
});
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, deviceTokenSchema);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "device/token", 12, 60)).allowed) return rateLimitResponse(60);
		const result = await handleDeviceTokenExchange(emdash.db, body);
		if (!result.success && result.deviceFlowError) {
			const errorBody = { error: result.deviceFlowError };
			if (result.deviceFlowInterval !== void 0) errorBody.interval = result.deviceFlowInterval;
			return Response.json(errorBody, {
				status: 400,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-store",
					Pragma: "no-cache"
				}
			});
		}
		return unwrapResult(result);
	} catch (error) {
		return handleError(error, "Failed to exchange device code", "TOKEN_EXCHANGE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/token@_@mjs
var page = () => token_exports;
//#endregion
export { page };
