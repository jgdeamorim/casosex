import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { c as inviteRegisterOptionsBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { c as generateRegistrationOptions } from "./passkey_eKvnpHNN.mjs";
import { _ as validateInvite, t as InviteError } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as createChallengeStore } from "./challenge-store-BFzgFRog_BREs9zn7.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./schemas_CKWG3bd1.mjs";
import { t as getPasskeyConfig } from "./passkey-config-KMhgFjdQ_C2RR8Qtr.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/register-options.mjs
var register_options_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, inviteRegisterOptionsBody);
		if (isParseError(body)) return body;
		const invite = await validateInvite(createKyselyAdapter(emdash.db), body.token);
		const url = new URL(request.url);
		const passkeyConfig = getPasskeyConfig(url, await new OptionsRepository(emdash.db).get("emdash:site_title") ?? void 0, getPublicOrigin(url, emdash?.config));
		const challengeStore = createChallengeStore(emdash.db);
		return apiSuccess({ options: await generateRegistrationOptions(passkeyConfig, {
			id: ulid(),
			email: invite.email,
			name: body.name || null
		}, [], challengeStore) });
	} catch (error) {
		if (error instanceof InviteError) return apiError(error.code.toUpperCase(), error.message, {
			invalid_token: 404,
			token_expired: 410,
			user_exists: 409
		}[error.code] ?? 400);
		return handleError(error, "Failed to generate registration options", "INVITE_REGISTER_OPTIONS_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/register-options@_@mjs
var page = () => register_options_exports;
//#endregion
export { page };
