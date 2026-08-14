import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import { g as sendMagicLink } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { t as getSiteBaseUrl } from "./site-url-8N3kSyVZ_Dwp-TjYy.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/send-recovery.mjs
var send_recovery_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "User ID required", 400);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		const targetUser = await adapter.getUserById(id);
		if (!targetUser) return apiError("NOT_FOUND", "User not found", 404);
		if (!emdash.email?.isAvailable()) return apiError("EMAIL_NOT_CONFIGURED", "Email is not configured. Recovery links require an email provider.", 503);
		const options = new OptionsRepository(emdash.db);
		await sendMagicLink({
			baseUrl: await getSiteBaseUrl(emdash.db, request),
			siteName: await options.get("emdash:site_title") ?? "EmDash",
			email: (message) => emdash.email.send(message, "system")
		}, adapter, targetUser.email, "recovery");
		return apiSuccess({
			success: true,
			message: "Recovery link sent"
		});
	} catch (error) {
		return handleError(error, "Failed to send recovery link", "RECOVERY_SEND_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/send-recovery@_@mjs
var page = () => send_recovery_exports;
//#endregion
export { page };
