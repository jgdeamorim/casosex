import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as getTrustedProxyHeaders } from "./trusted-proxy-CwjQj0YG_BcObCAIe.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import { n as getClientIp, r as rateLimitResponse, t as checkRateLimit } from "./rate-limit-Vkp9gQ1Y_BDw18TRB.mjs";
import "./dist_Di9U_sWQ.mjs";
import { n as handleDeviceCodeRequest } from "./device-flow-DhUsyJU6__0x_uxC2.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/code.mjs
var code_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var deviceCodeSchema = object({
	client_id: string().optional(),
	scope: string().optional()
});
var POST = async ({ request, locals, url }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, deviceCodeSchema);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "device/code", 10, 60)).allowed) return rateLimitResponse(60);
		const verificationUri = new URL("/_emdash/admin/device", getPublicOrigin(url, emdash?.config)).toString();
		return unwrapResult(await handleDeviceCodeRequest(emdash.db, body, verificationUri));
	} catch (error) {
		return handleError(error, "Failed to create device code", "DEVICE_CODE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/code@_@mjs
var page = () => code_exports;
//#endregion
export { page };
