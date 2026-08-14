import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { u as passkeyOptionsBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as getTrustedProxyHeaders } from "./trusted-proxy-CwjQj0YG_BcObCAIe.mjs";
import { o as generateAuthenticationOptions } from "./passkey_eKvnpHNN.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as parseOptionalBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as createChallengeStore, t as cleanupExpiredChallenges } from "./challenge-store-BFzgFRog_BREs9zn7.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./schemas_CKWG3bd1.mjs";
import { t as getPasskeyConfig } from "./passkey-config-KMhgFjdQ_C2RR8Qtr.mjs";
import { n as getClientIp, r as rateLimitResponse, t as checkRateLimit } from "./rate-limit-Vkp9gQ1Y_BDw18TRB.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/options.mjs
var options_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		cleanupExpiredChallenges(emdash.db).catch(() => {});
		const body = await parseOptionalBody(request, passkeyOptionsBody, {});
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "passkey/options", 10, 60)).allowed) return rateLimitResponse(60);
		const adapter = createKyselyAdapter(emdash.db);
		let credentials = [];
		if (body.email) {
			const user = await adapter.getUserByEmail(body.email);
			if (user) credentials = await adapter.getCredentialsByUserId(user.id);
		}
		const url = new URL(request.url);
		const passkeyConfig = getPasskeyConfig(url, await new OptionsRepository(emdash.db).get("emdash:site_title") ?? void 0, getPublicOrigin(url, emdash?.config));
		const challengeStore = createChallengeStore(emdash.db);
		return apiSuccess({
			success: true,
			options: await generateAuthenticationOptions(passkeyConfig, credentials, challengeStore)
		});
	} catch (error) {
		return handleError(error, "Failed to generate passkey options", "PASSKEY_OPTIONS_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/options@_@mjs
var page = () => options_exports;
//#endregion
export { page };
