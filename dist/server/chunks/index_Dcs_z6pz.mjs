import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as withTransaction } from "./transaction-D0FOsb3X_huCh3mhl.mjs";
import { Dt as userUpdateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/index.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user: currentUser } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!currentUser || currentUser.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("MISSING_PARAM", "User ID required", 400);
	try {
		const result = await adapter.getUserWithDetails(id);
		if (!result) return apiError("NOT_FOUND", "User not found", 404);
		return apiSuccess({ item: {
			id: result.user.id,
			email: result.user.email,
			name: result.user.name,
			avatarUrl: result.user.avatarUrl,
			role: result.user.role,
			emailVerified: result.user.emailVerified,
			disabled: result.user.disabled,
			createdAt: result.user.createdAt.toISOString(),
			updatedAt: result.user.updatedAt.toISOString(),
			lastLogin: result.lastLogin?.toISOString() ?? null,
			credentials: result.credentials.map((c) => ({
				id: c.id,
				name: c.name,
				deviceType: c.deviceType,
				createdAt: c.createdAt.toISOString(),
				lastUsedAt: c.lastUsedAt.toISOString()
			})),
			oauthAccounts: result.oauthAccounts.map((a) => ({
				provider: a.provider,
				createdAt: a.createdAt.toISOString()
			}))
		} });
	} catch (error) {
		return handleError(error, "Failed to get user details", "USER_DETAIL_ERROR");
	}
};
var PUT = async ({ params, request, locals }) => {
	const { emdash, user: currentUser } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!currentUser || currentUser.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("MISSING_PARAM", "User ID required", 400);
	try {
		const targetUser = await adapter.getUserById(id);
		if (!targetUser) return apiError("NOT_FOUND", "User not found", 404);
		const body = await parseBody(request, userUpdateBody);
		if (isParseError(body)) return body;
		const role = body.role;
		if (role !== void 0 && id === currentUser.id) return apiError("SELF_ROLE_CHANGE", "Cannot change your own role", 400);
		if (body.email && body.email !== targetUser.email) {
			if (await adapter.getUserByEmail(body.email)) return apiError("EMAIL_IN_USE", "Email already in use", 409);
		}
		const isDemotingAdmin = role !== void 0 && role < Role.ADMIN && targetUser.role === Role.ADMIN;
		if (await withTransaction(emdash.db, async (trx) => {
			const trxAdapter = createKyselyAdapter(trx);
			if (isDemotingAdmin) {
				if (await trxAdapter.countAdmins() <= 1) return true;
			}
			await trxAdapter.updateUser(id, {
				name: body.name,
				email: body.email,
				role
			});
			return false;
		})) return apiError("LAST_ADMIN", "Cannot demote the last admin. Promote another user first.", 400);
		const updated = await adapter.getUserById(id);
		return apiSuccess({ item: {
			id: updated.id,
			email: updated.email,
			name: updated.name,
			avatarUrl: updated.avatarUrl,
			role: updated.role,
			emailVerified: updated.emailVerified,
			disabled: updated.disabled,
			createdAt: updated.createdAt.toISOString(),
			updatedAt: updated.updatedAt.toISOString()
		} });
	} catch (error) {
		return handleError(error, "Failed to update user", "USER_UPDATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/index@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
