import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import { n as resolveAndValidateExternalUrl, t as SsrfError } from "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import "./dist_C4cexd-h.mjs";
import { x as wpPluginAnalyzeBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as SchemaRegistry } from "./registry-BP1JK2xh_C4nDpLUe.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { s as getSource } from "./import-PKhLeXvn_D32uTAAY.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/analyze.mjs
var analyze_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	try {
		const body = await parseBody(request, wpPluginAnalyzeBody);
		if (isParseError(body)) return body;
		try {
			await resolveAndValidateExternalUrl(body.url);
		} catch (e) {
			return apiError("SSRF_BLOCKED", e instanceof SsrfError ? e.message : "Invalid URL", 400);
		}
		const source = getSource("wordpress-plugin");
		if (!source) return apiError("NOT_CONFIGURED", "WordPress plugin source not available", 500);
		const existingCollections = await fetchExistingCollections(emdash?.db);
		return apiSuccess({
			success: true,
			analysis: await source.analyze({
				type: "url",
				url: body.url,
				token: body.token
			}, {
				db: emdash?.db,
				getExistingCollections: async () => existingCollections
			})
		});
	} catch (error) {
		return handleError(error, "Failed to analyze WordPress site", "WP_PLUGIN_ANALYZE_ERROR");
	}
};
/** Fetch collections and their fields from schema registry */
async function fetchExistingCollections(db) {
	const result = /* @__PURE__ */ new Map();
	if (!db) return result;
	try {
		const registry = new SchemaRegistry(db);
		const collections = await registry.listCollections();
		for (const collection of collections) {
			const fields = await registry.listFields(collection.id);
			const fieldMap = /* @__PURE__ */ new Map();
			for (const field of fields) fieldMap.set(field.slug, { type: field.type });
			result.set(collection.slug, {
				slug: collection.slug,
				fields: fieldMap
			});
		}
	} catch (error) {
		console.warn("Could not fetch schema registry:", error);
	}
	return result;
}
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/analyze@_@mjs
var page = () => analyze_exports;
//#endregion
export { page };
