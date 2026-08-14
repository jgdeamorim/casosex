import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/index.mjs
var passkey_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	try {
		return apiSuccess({ items: (await createKyselyAdapter(emdash.db).getCredentialsByUserId(user.id)).map((cred) => ({
			id: cred.id,
			name: cred.name,
			deviceType: cred.deviceType,
			backedUp: cred.backedUp,
			createdAt: cred.createdAt.toISOString(),
			lastUsedAt: cred.lastUsedAt.toISOString()
		})) });
	} catch (error) {
		return handleError(error, "Failed to list passkeys", "PASSKEY_LIST_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/index@_@mjs
var page = () => passkey_exports;
//#endregion
export { page };
