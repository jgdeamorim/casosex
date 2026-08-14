import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { y as signupRequestBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as getTrustedProxyHeaders } from "./trusted-proxy-CwjQj0YG_BcObCAIe.mjs";
import { h as requestSignup } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
import { t as getSiteBaseUrl } from "./site-url-8N3kSyVZ_Dwp-TjYy.mjs";
import { n as getClientIp, t as checkRateLimit } from "./rate-limit-Vkp9gQ1Y_BDw18TRB.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/request.mjs
var request_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var GENERIC_SUCCESS = {
	success: true,
	message: "If your email domain is allowed, you'll receive a verification email."
};
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!emdash.email?.isAvailable()) return apiError("EMAIL_NOT_CONFIGURED", "Email not configured. Self-signup is unavailable.", 503);
	try {
		const body = await parseBody(request, signupRequestBody);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "signup/request", 3, 300)).allowed) return apiSuccess(GENERIC_SUCCESS);
		const adapter = createKyselyAdapter(emdash.db);
		const siteName = await new OptionsRepository(emdash.db).get("emdash:site_title") || "EmDash";
		await requestSignup({
			baseUrl: await getSiteBaseUrl(emdash.db, request),
			siteName,
			email: (message) => emdash.email.send(message, "system")
		}, adapter, body.email.toLowerCase().trim());
		return apiSuccess(GENERIC_SUCCESS);
	} catch (error) {
		console.error("Signup request error:", error);
		return apiSuccess(GENERIC_SUCCESS);
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/request@_@mjs
var page = () => request_exports;
//#endregion
export { page };
