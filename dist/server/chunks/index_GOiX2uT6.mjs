import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { T as allowedDomainCreateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as roleFromLevel, t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/index.mjs
var allowed_domains_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9-]+)+$/;
/**
* GET - List all allowed domains
*/
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		return apiSuccess({ domains: (await adapter.getAllowedDomains()).map((d) => ({
			domain: d.domain,
			defaultRole: d.defaultRole,
			roleName: roleFromLevel(d.defaultRole),
			enabled: d.enabled,
			createdAt: d.createdAt.toISOString()
		})) });
	} catch (error) {
		return handleError(error, "Failed to list allowed domains", "DOMAIN_LIST_ERROR");
	}
};
/**
* POST - Add a new allowed domain
*/
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		const body = await parseBody(request, allowedDomainCreateBody);
		if (isParseError(body)) return body;
		const defaultRole = body.defaultRole;
		const cleanDomain = body.domain.toLowerCase().trim();
		if (!DOMAIN_REGEX.test(cleanDomain)) return apiError("VALIDATION_ERROR", "Invalid domain format", 400);
		if (await adapter.getAllowedDomain(cleanDomain)) return apiError("CONFLICT", "Domain already exists", 409);
		const domain = await adapter.createAllowedDomain(cleanDomain, defaultRole);
		return apiSuccess({
			success: true,
			domain: {
				domain: domain.domain,
				defaultRole: domain.defaultRole,
				roleName: roleFromLevel(domain.defaultRole),
				enabled: domain.enabled,
				createdAt: domain.createdAt.toISOString()
			}
		}, 201);
	} catch (error) {
		return handleError(error, "Failed to create allowed domain", "DOMAIN_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/index@_@mjs
var page = () => allowed_domains_exports;
//#endregion
export { page };
