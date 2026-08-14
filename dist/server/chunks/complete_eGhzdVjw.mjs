import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { o as inviteCompleteBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { _ as verifyRegistrationResponse, h as registerPasskey } from "./passkey_eKvnpHNN.mjs";
import { c as completeInvite, t as InviteError } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as createChallengeStore } from "./challenge-store-BFzgFRog_BREs9zn7.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./schemas_CKWG3bd1.mjs";
import { n as validateAllowedOrigins, t as getConfiguredAllowedOrigins } from "./allowed-origins-CCEi9bPI_BHsLUy8L.mjs";
import { t as getPasskeyConfig } from "./passkey-config-KMhgFjdQ_C2RR8Qtr.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/complete.mjs
var complete_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals, session }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, inviteCompleteBody);
		if (isParseError(body)) return body;
		const adapter = createKyselyAdapter(emdash.db);
		const url = new URL(request.url);
		const siteName = await new OptionsRepository(emdash.db).get("emdash:site_title") ?? void 0;
		const siteUrl = getPublicOrigin(url, emdash?.config);
		const passkeyConfig = getPasskeyConfig(url, siteName, siteUrl, validateAllowedOrigins(siteUrl, getConfiguredAllowedOrigins(emdash?.config)));
		const challengeStore = createChallengeStore(emdash.db);
		const verified = await verifyRegistrationResponse(passkeyConfig, body.credential, challengeStore);
		const user = await completeInvite(adapter, body.token, { name: body.name });
		await registerPasskey(adapter, user.id, verified, "Initial passkey");
		if (session) session.set("user", { id: user.id });
		return apiSuccess({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role
			}
		});
	} catch (error) {
		if (error instanceof InviteError) return apiError(error.code.toUpperCase(), error.message, {
			invalid_token: 404,
			token_expired: 410,
			user_exists: 409
		}[error.code] ?? 400);
		return handleError(error, "Failed to complete invite", "INVITE_COMPLETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/complete@_@mjs
var page = () => complete_exports;
//#endregion
export { page };
