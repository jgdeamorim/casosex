import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { E as allowedDomainUpdateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as roleFromLevel, t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/_domain_.mjs
var _domain__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	PATCH: () => PATCH,
	prerender: () => false
});
/**
* PATCH - Update domain settings
*/
var PATCH = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { domain } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!domain) return apiError("VALIDATION_ERROR", "Domain is required", 400);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		const body = await parseBody(request, allowedDomainUpdateBody);
		if (isParseError(body)) return body;
		const existing = await adapter.getAllowedDomain(domain);
		if (!existing) return apiError("NOT_FOUND", "Domain not found", 404);
		const defaultRole = body.defaultRole;
		const enabled = body.enabled ?? existing.enabled;
		await adapter.updateAllowedDomain(domain, enabled, defaultRole);
		const updated = await adapter.getAllowedDomain(domain);
		return apiSuccess({
			success: true,
			domain: updated ? {
				domain: updated.domain,
				defaultRole: updated.defaultRole,
				roleName: roleFromLevel(updated.defaultRole),
				enabled: updated.enabled,
				createdAt: updated.createdAt.toISOString()
			} : null
		});
	} catch (error) {
		return handleError(error, "Failed to update allowed domain", "DOMAIN_UPDATE_ERROR");
	}
};
/**
* DELETE - Remove an allowed domain
*/
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { domain } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!domain) return apiError("VALIDATION_ERROR", "Domain is required", 400);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		if (!await adapter.getAllowedDomain(domain)) return apiError("NOT_FOUND", "Domain not found", 404);
		await adapter.deleteAllowedDomain(domain);
		return apiSuccess({ success: true });
	} catch (error) {
		return handleError(error, "Failed to delete allowed domain", "DOMAIN_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/_domain_@_@mjs
var page = () => _domain__exports;
//#endregion
export { page };
