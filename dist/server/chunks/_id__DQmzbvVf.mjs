import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { p as passkeyRenameBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	PATCH: () => PATCH,
	prerender: () => false
});
/**
* PATCH - Rename a passkey
*/
var PATCH = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	if (!id) return apiError("MISSING_PARAM", "Passkey ID is required", 400);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		const credential = await adapter.getCredentialById(id);
		if (!credential || credential.userId !== user.id) return apiError("NOT_FOUND", "Passkey not found", 404);
		const body = await parseBody(request, passkeyRenameBody);
		if (isParseError(body)) return body;
		const trimmedName = body.name.trim() || null;
		await adapter.updateCredentialName(id, trimmedName);
		return apiSuccess({ passkey: {
			id: credential.id,
			name: trimmedName,
			deviceType: credential.deviceType,
			backedUp: credential.backedUp,
			createdAt: credential.createdAt.toISOString(),
			lastUsedAt: credential.lastUsedAt.toISOString()
		} });
	} catch (error) {
		return handleError(error, "Failed to rename passkey", "PASSKEY_RENAME_ERROR");
	}
};
/**
* DELETE - Remove a passkey
*/
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	if (!id) return apiError("MISSING_PARAM", "Passkey ID is required", 400);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		const credential = await adapter.getCredentialById(id);
		if (!credential || credential.userId !== user.id) return apiError("NOT_FOUND", "Passkey not found", 404);
		if (await adapter.countCredentialsByUserId(user.id) <= 1) return apiError("LAST_PASSKEY", "Cannot remove your last passkey", 400);
		await adapter.deleteCredential(id);
		return apiSuccess({ success: true });
	} catch (error) {
		return handleError(error, "Failed to delete passkey", "PASSKEY_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
