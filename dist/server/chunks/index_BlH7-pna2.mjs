import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, c as array, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { i as handleOAuthClientList, t as handleOAuthClientCreate } from "./oauth-clients-BwTxE1aE_Bl65d5J5.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/index.mjs
var oauth_clients_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var createClientSchema = object({
	id: string().min(1, "Client ID is required").max(255, "Client ID must be at most 255 characters"),
	name: string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
	redirectUris: array(string().url("Each redirect URI must be a valid URL")).min(1, "At least one redirect URI is required"),
	scopes: array(string()).optional()
});
/**
* List all registered OAuth clients.
*/
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	return unwrapResult(await handleOAuthClientList(emdash.db));
};
/**
* Register a new OAuth client.
*/
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	try {
		const body = await parseBody(request, createClientSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleOAuthClientCreate(emdash.db, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create OAuth client", "CLIENT_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/index@_@mjs
var page = () => oauth_clients_exports;
//#endregion
export { page };
