import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { Ot as usersListQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/index.mjs
var users_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		const query = parseQuery(url, usersListQuery);
		if (isParseError(query)) return query;
		const result = await adapter.getUsers({
			search: query.search,
			role: query.role ? parseInt(query.role, 10) : void 0,
			cursor: query.cursor,
			limit: query.limit
		});
		return apiSuccess({
			items: result.items.map((u) => ({
				id: u.id,
				email: u.email,
				name: u.name,
				avatarUrl: u.avatarUrl,
				role: u.role,
				emailVerified: u.emailVerified,
				disabled: u.disabled,
				createdAt: u.createdAt.toISOString(),
				updatedAt: u.updatedAt.toISOString(),
				lastLogin: u.lastLogin?.toISOString() ?? null,
				credentialCount: u.credentialCount,
				oauthProviders: u.oauthProviders
			})),
			nextCursor: result.nextCursor
		});
	} catch (error) {
		return handleError(error, "Failed to list users", "USER_LIST_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/index@_@mjs
var page = () => users_exports;
//#endregion
export { page };
