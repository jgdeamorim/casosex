import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, l as boolean, v as object } from "./schemas_CzTFUUcv.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import "./content-CpfKV9QE_DeIsRghk.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./user-BAumEmpA_79fxFfjA.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import { T as handleMarketplaceInstall } from "./query-1xOcEy18_dGFoQgZT.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import "./manifest-schema-bCq54i7F_oDiktgui.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./menus-BxPLFfIc_Qsmtjm90.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import "./byline-C5TAqs8N_UXuC5WkK.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import "./registry-BP1JK2xh_C4nDpLUe.mjs";
import "./dashboard-DoBwPnON_BZ6Klac5.mjs";
import "./media-usage-DPJcNaAq_CWA56Ri3.mjs";
import "./zod-generator-DMzfga3g_DxHzNpJC.mjs";
import "./schema-eqZhkR0S_CJC5oLyH.mjs";
import "./sections-DSuEfirn_LC35OjDp.mjs";
import "./settings-CREKyj8I_sz1CfsBP.mjs";
import "./taxonomies-Dbdki3Un_Dc3Q5ZJ8.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as parseOptionalBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs
var install_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var installBodySchema = object({
	version: string().min(1).optional(),
	confirmMcpTools: boolean().optional()
});
var POST = async ({ params, request, locals }) => {
	try {
		const { emdash, user } = locals;
		const { id } = params;
		if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
		const denied = requirePerm(user, "plugins:manage");
		if (denied) return denied;
		if (!id) return apiError("INVALID_REQUEST", "Plugin ID required", 400);
		const body = await parseOptionalBody(request, installBodySchema, {});
		if (isParseError(body)) return body;
		const configuredPluginIds = new Set(emdash.configuredPlugins.map((p) => p.id));
		const siteOrigin = new URL(request.url).origin;
		const result = await handleMarketplaceInstall(emdash.db, emdash.storage, emdash.getSandboxRunner(), emdash.config.marketplace, id, {
			version: body.version,
			configuredPluginIds,
			siteOrigin,
			sandboxBypassed: emdash.isSandboxBypassed(),
			confirmMcpTools: body.confirmMcpTools
		});
		if (!result.success) return unwrapResult(result);
		await emdash.syncMarketplacePlugins();
		return unwrapResult(result, 201);
	} catch (error) {
		console.error("[marketplace-install] Unhandled error:", error);
		return handleError(error, "Failed to install plugin from marketplace", "INSTALL_FAILED");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/install@_@mjs
var page = () => install_exports;
//#endregion
export { page };
