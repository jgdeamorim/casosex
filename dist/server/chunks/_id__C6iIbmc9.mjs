import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import { r as handleApiTokenRevoke } from "./api-tokens-p-iMzvXR_BFfql06_.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	prerender: () => false
});
/**
* Revoke (delete) an API token.
*/
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const tokenId = params.id;
	if (!tokenId) return apiError("VALIDATION_ERROR", "Token ID is required", 400);
	try {
		return unwrapResult(await handleApiTokenRevoke(emdash.db, tokenId, user.id));
	} catch (error) {
		return handleError(error, "Failed to revoke API token", "TOKEN_REVOKE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
