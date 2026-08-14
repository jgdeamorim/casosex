import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
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
import { E as handleMarketplaceSearch } from "./query-1xOcEy18_dGFoQgZT.mjs";
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
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./parse-BL49yb9D_DEZsBUX3.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/index.mjs
var marketplace_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:read");
	if (denied) return denied;
	const query = url.searchParams.get("q") ?? void 0;
	const category = url.searchParams.get("category") ?? void 0;
	const cursor = url.searchParams.get("cursor") ?? void 0;
	const limitParam = url.searchParams.get("limit");
	const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || 50), 100) : void 0;
	return unwrapResult(await handleMarketplaceSearch(emdash.config.marketplace, query, {
		category,
		cursor,
		limit
	}));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/index@_@mjs
var page = () => marketplace_exports;
//#endregion
export { page };
