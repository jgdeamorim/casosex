import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { d as passkeyRegisterOptionsBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { c as generateRegistrationOptions } from "./passkey_eKvnpHNN.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as parseOptionalBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as createChallengeStore } from "./challenge-store-BFzgFRog_BREs9zn7.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./schemas_CKWG3bd1.mjs";
import { t as getPasskeyConfig } from "./passkey-config-KMhgFjdQ_C2RR8Qtr.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/register/options.mjs
var options_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var MAX_PASSKEYS = 10;
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		if (await adapter.countCredentialsByUserId(user.id) >= MAX_PASSKEYS) return apiError("PASSKEY_LIMIT", `Maximum of ${MAX_PASSKEYS} passkeys allowed`, 400);
		const body = await parseOptionalBody(request, passkeyRegisterOptionsBody, {});
		if (isParseError(body)) return body;
		const existingCredentials = await adapter.getCredentialsByUserId(user.id);
		const url = new URL(request.url);
		const optionsRepo = new OptionsRepository(emdash.db);
		const passkeyConfig = getPasskeyConfig(url, await optionsRepo.get("emdash:site_title") ?? void 0, getPublicOrigin(url, emdash?.config));
		const challengeStore = createChallengeStore(emdash.db);
		const registrationOptions = await generateRegistrationOptions(passkeyConfig, {
			id: user.id,
			email: user.email,
			name: user.name
		}, existingCredentials, challengeStore);
		if (body.name) await optionsRepo.set(`emdash:passkey_pending:${user.id}`, { name: body.name });
		return apiSuccess({ options: registrationOptions });
	} catch (error) {
		return handleError(error, "Failed to generate registration options", "PASSKEY_REGISTER_OPTIONS_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/register/options@_@mjs
var page = () => options_exports;
//#endregion
export { page };
