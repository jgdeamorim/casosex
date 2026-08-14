import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, c as array, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import { m as isValidScope } from "./passkey_eKvnpHNN.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import { n as handleApiTokenList, t as handleApiTokenCreate } from "./api-tokens-p-iMzvXR_BFfql06_.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/index.mjs
var api_tokens_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var createTokenSchema = object({
	name: string().min(1).max(100),
	scopes: array(string().refine(isValidScope)).min(1),
	expiresAt: string().datetime().optional()
});
/**
* List API tokens for the current user.
* Admins can list all tokens (future: add ?userId= filter).
*/
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	return unwrapResult(await handleApiTokenList(emdash.db, user.id));
};
/**
* Create a new API token.
* Returns the raw token once — it cannot be retrieved again.
*/
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	try {
		const body = await parseBody(request, createTokenSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleApiTokenCreate(emdash.db, user.id, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create API token", "TOKEN_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/index@_@mjs
var page = () => api_tokens_exports;
//#endregion
export { page };
