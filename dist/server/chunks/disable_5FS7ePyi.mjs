import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/disable.mjs
var disable_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, locals }) => {
	const { emdash, user: currentUser } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!currentUser || currentUser.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "User ID required", 400);
	if (id === currentUser.id) return apiError("VALIDATION_ERROR", "Cannot disable your own account", 400);
	try {
		const targetUser = await adapter.getUserById(id);
		if (!targetUser) return apiError("NOT_FOUND", "User not found", 404);
		if (await withTransaction(emdash.db, async (trx) => {
			const trxAdapter = createKyselyAdapter(trx);
			if (targetUser.role === Role.ADMIN) {
				if (await trxAdapter.countAdmins() <= 1) return true;
			}
			await trxAdapter.updateUser(id, { disabled: true });
			return false;
		})) return apiError("VALIDATION_ERROR", "Cannot disable the last admin. Promote another user first.", 400);
		await emdash.db.deleteFrom("_emdash_oauth_tokens").where("user_id", "=", id).execute();
		return apiSuccess({ success: true });
	} catch (error) {
		return handleError(error, "Failed to disable user", "USER_DISABLE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/disable@_@mjs
var page = () => disable_exports;
//#endregion
export { page };
