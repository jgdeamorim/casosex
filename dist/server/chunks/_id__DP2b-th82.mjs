import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, c as array, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { a as handleOAuthClientUpdate, n as handleOAuthClientDelete, r as handleOAuthClientGet } from "./oauth-clients-BwTxE1aE_Bl65d5J5.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var updateClientSchema = object({
	name: string().min(1).max(255).optional(),
	redirectUris: array(string().url("Each redirect URI must be a valid URL")).min(1, "At least one redirect URI is required").optional(),
	scopes: array(string()).nullable().optional()
});
/**
* Get a single OAuth client.
*/
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const clientId = params.id;
	if (!clientId) return apiError("VALIDATION_ERROR", "Client ID is required", 400);
	return unwrapResult(await handleOAuthClientGet(emdash.db, clientId));
};
/**
* Update an OAuth client.
*/
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const clientId = params.id;
	if (!clientId) return apiError("VALIDATION_ERROR", "Client ID is required", 400);
	try {
		const body = await parseBody(request, updateClientSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleOAuthClientUpdate(emdash.db, clientId, body));
	} catch (error) {
		return handleError(error, "Failed to update OAuth client", "CLIENT_UPDATE_ERROR");
	}
};
/**
* Delete an OAuth client.
*/
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const clientId = params.id;
	if (!clientId) return apiError("VALIDATION_ERROR", "Client ID is required", 400);
	try {
		return unwrapResult(await handleOAuthClientDelete(emdash.db, clientId));
	} catch (error) {
		return handleError(error, "Failed to delete OAuth client", "CLIENT_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
