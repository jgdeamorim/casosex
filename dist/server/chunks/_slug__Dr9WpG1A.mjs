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
import { I as handleOrphanedTableRegister } from "./query-1xOcEy18_dGFoQgZT.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import "./manifest-schema-bCq54i7F_oDiktgui.mjs";
import { st as orphanRegisterBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
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
import { a as unwrapResult, i as requireDb, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as parseOptionalBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/orphans/_slug_.mjs
var _slug__exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const slug = params.slug;
	if (!slug) return apiError("VALIDATION_ERROR", "Slug is required", 400);
	const options = await parseOptionalBody(request, orphanRegisterBody, {});
	if (isParseError(options)) return options;
	return unwrapResult(await handleOrphanedTableRegister(emdash.db, slug, options), 201);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/orphans/_slug_@_@mjs
var page = () => _slug__exports;
//#endregion
export { page };
