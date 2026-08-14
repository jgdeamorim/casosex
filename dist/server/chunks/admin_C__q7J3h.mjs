import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { h as setupAdminBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { c as generateRegistrationOptions, l as generateToken } from "./passkey_eKvnpHNN.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as createChallengeStore } from "./challenge-store-BFzgFRog_BREs9zn7.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./schemas_CKWG3bd1.mjs";
import { t as getPasskeyConfig } from "./passkey-config-KMhgFjdQ_C2RR8Qtr.mjs";
import { n as SETUP_NONCE_MAX_AGE_SECONDS, t as SETUP_NONCE_COOKIE } from "./setup-nonce-Ct5tjWcq_DFUJLgRp.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin.mjs
var admin_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ cookies, request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const options = new OptionsRepository(emdash.db);
		const setupComplete = await options.get("emdash:setup_complete");
		const isComplete = setupComplete === true || setupComplete === "true";
		if (await createKyselyAdapter(emdash.db).countUsers() > 0) {
			if (isComplete) return apiError("SETUP_COMPLETE", "Setup already complete", 400);
			return apiError("ADMIN_EXISTS", "Admin user already exists", 400);
		}
		const body = await parseBody(request, setupAdminBody);
		if (isParseError(body)) return body;
		const existingState = await options.get("emdash:setup_state");
		const nonce = generateToken();
		const url = new URL(request.url);
		const siteName = await options.get("emdash:site_title") ?? void 0;
		const siteUrl = getPublicOrigin(url, emdash?.config);
		const passkeyConfig = getPasskeyConfig(url, siteName, siteUrl);
		const challengeStore = createChallengeStore(emdash.db);
		const tempUser = {
			id: `setup-${Date.now()}`,
			email: body.email.toLowerCase(),
			name: body.name || null
		};
		const registrationOptions = await generateRegistrationOptions(passkeyConfig, tempUser, [], challengeStore);
		await options.set("emdash:setup_state", {
			...existingState,
			step: "admin",
			email: body.email.toLowerCase(),
			name: body.name || null,
			tempUserId: tempUser.id,
			nonce
		});
		const publicOrigin = new URL(siteUrl);
		cookies.set(SETUP_NONCE_COOKIE, nonce, {
			path: "/_emdash/",
			httpOnly: true,
			sameSite: "strict",
			secure: publicOrigin.protocol === "https:",
			maxAge: SETUP_NONCE_MAX_AGE_SECONDS
		});
		return apiSuccess({
			success: true,
			options: registrationOptions
		});
	} catch (error) {
		return handleError(error, "Failed to create admin", "SETUP_ADMIN_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin@_@mjs
var page = () => admin_exports;
//#endregion
export { page };
