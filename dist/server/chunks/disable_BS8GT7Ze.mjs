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
import { L as handlePluginDisable } from "./query-1xOcEy18_dGFoQgZT.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import { r as setCronTasksEnabled } from "./cron-BlKIMD_e_DKU8q02k.mjs";
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
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/disable.mjs
var disable_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:manage");
	if (denied) return denied;
	if (!id) return apiError("INVALID_REQUEST", "Plugin ID required", 400);
	const result = await handlePluginDisable(emdash.db, emdash.configuredPlugins, emdash.sandboxedPluginEntries, id);
	if (!result.success) return unwrapResult(result);
	await emdash.setPluginStatus(id, "inactive");
	await setCronTasksEnabled(emdash.db, id, false);
	return unwrapResult(result);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/disable@_@mjs
var page = () => disable_exports;
//#endregion
export { page };
