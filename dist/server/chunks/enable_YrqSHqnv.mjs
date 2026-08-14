import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/enable.mjs
var enable_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "User ID required", 400);
	try {
		if (!await adapter.getUserById(id)) return apiError("NOT_FOUND", "User not found", 404);
		await adapter.updateUser(id, { disabled: false });
		return apiSuccess({ success: true });
	} catch (error) {
		return handleError(error, "Failed to enable user", "USER_ENABLE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/enable@_@mjs
var page = () => enable_exports;
//#endregion
export { page };
