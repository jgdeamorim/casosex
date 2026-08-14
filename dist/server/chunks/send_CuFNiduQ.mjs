import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { l as magicLinkSendBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as getTrustedProxyHeaders } from "./trusted-proxy-CwjQj0YG_BcObCAIe.mjs";
import { g as sendMagicLink } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
import { t as getSiteBaseUrl } from "./site-url-8N3kSyVZ_Dwp-TjYy.mjs";
import { n as getClientIp, t as checkRateLimit } from "./rate-limit-Vkp9gQ1Y_BDw18TRB.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/send.mjs
var send_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, magicLinkSendBody);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "magic-link/send", 3, 300)).allowed) return apiSuccess({
			success: true,
			message: "If an account exists for this email, a magic link has been sent."
		});
		if (!emdash.email?.isAvailable()) return apiError("EMAIL_NOT_CONFIGURED", "Email is not configured. Magic link authentication requires an email provider.", 503);
		const options = new OptionsRepository(emdash.db);
		await sendMagicLink({
			baseUrl: await getSiteBaseUrl(emdash.db, request),
			siteName: await options.get("emdash:site_title") ?? "EmDash",
			email: (message) => emdash.email.send(message, "system")
		}, createKyselyAdapter(emdash.db), body.email.toLowerCase());
		return apiSuccess({
			success: true,
			message: "If an account exists for this email, a magic link has been sent."
		});
	} catch (error) {
		console.error("Magic link send error:", error);
		return apiSuccess({
			success: true,
			message: "If an account exists for this email, a magic link has been sent."
		});
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/send@_@mjs
var page = () => send_exports;
//#endregion
export { page };
