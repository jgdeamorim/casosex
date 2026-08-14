import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { g as setupAdminVerifyBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import { _ as verifyRegistrationResponse, g as secureCompare, h as registerPasskey } from "./passkey_eKvnpHNN.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as createChallengeStore } from "./challenge-store-BFzgFRog_BREs9zn7.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./schemas_CKWG3bd1.mjs";
import { n as validateAllowedOrigins, t as getConfiguredAllowedOrigins } from "./allowed-origins-CCEi9bPI_BHsLUy8L.mjs";
import { t as getPasskeyConfig } from "./passkey-config-KMhgFjdQ_C2RR8Qtr.mjs";
import { t as SETUP_NONCE_COOKIE } from "./setup-nonce-Ct5tjWcq_DFUJLgRp.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin-verify.mjs
var admin_verify_exports = /* @__PURE__ */ __exportAll({
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
		const adapter = createKyselyAdapter(emdash.db);
		if (await adapter.countUsers() > 0) {
			if (isComplete) return apiError("SETUP_COMPLETE", "Setup already complete", 400);
			return apiError("ADMIN_EXISTS", "Admin user already exists", 400);
		}
		const setupState = await options.get("emdash:setup_state");
		if (!setupState || setupState.step !== "admin") return apiError("INVALID_STATE", "Invalid setup state. Please restart setup.", 400);
		const cookieNonce = cookies.get(SETUP_NONCE_COOKIE)?.value;
		if (!setupState.nonce || !cookieNonce || !secureCompare(cookieNonce, setupState.nonce)) return apiError("INVALID_STATE", "Setup session expired or tampered with. Please restart the admin step.", 400);
		if (!setupState.email) return apiError("INVALID_STATE", "Invalid setup state. Please restart setup.", 400);
		const body = await parseBody(request, setupAdminVerifyBody);
		if (isParseError(body)) return body;
		const url = new URL(request.url);
		const siteName = await options.get("emdash:site_title") ?? void 0;
		const siteUrl = getPublicOrigin(url, emdash?.config);
		const passkeyConfig = getPasskeyConfig(url, siteName, siteUrl, validateAllowedOrigins(siteUrl, getConfiguredAllowedOrigins(emdash?.config)));
		const challengeStore = createChallengeStore(emdash.db);
		const verified = await verifyRegistrationResponse(passkeyConfig, body.credential, challengeStore);
		const user = await adapter.createUser({
			email: setupState.email,
			name: setupState.name ?? null,
			role: Role.ADMIN,
			emailVerified: false
		});
		await registerPasskey(adapter, user.id, verified, "Setup passkey");
		await options.set("emdash:setup_complete", true);
		await options.delete("emdash:setup_state");
		cookies.delete(SETUP_NONCE_COOKIE, { path: "/_emdash/" });
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
		return handleError(error, "Failed to verify admin setup", "SETUP_VERIFY_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin-verify@_@mjs
var page = () => admin_verify_exports;
//#endregion
export { page };
