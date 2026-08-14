import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as roleFromLevel } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import { _ as validateInvite, t as InviteError } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/accept.mjs
var accept_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const token = url.searchParams.get("token");
	if (!token) return apiError("MISSING_PARAM", "Token is required", 400);
	try {
		const invite = await validateInvite(createKyselyAdapter(emdash.db), token);
		return apiSuccess({
			success: true,
			email: invite.email,
			role: invite.role,
			roleName: roleFromLevel(invite.role)
		});
	} catch (error) {
		if (error instanceof InviteError) return apiError(error.code.toUpperCase(), error.message, {
			invalid_token: 404,
			token_expired: 410,
			user_exists: 409
		}[error.code] ?? 400);
		return handleError(error, "Failed to validate invite", "INVITE_VALIDATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/accept@_@mjs
var page = () => accept_exports;
//#endregion
export { page };
