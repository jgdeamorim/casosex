import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./content-CpfKV9QE_DeIsRghk.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import "./byline-C5TAqs8N_UXuC5WkK.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import "./registry-BP1JK2xh_C4nDpLUe.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./validate-Bs_wT2ul_BPxJkgx-.mjs";
import "./apply-1_6ra7NP_C-N_rG76.mjs";
import "./load-BwTdWE8B_DBSeomMw.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import "./api-tokens-p-iMzvXR_BFfql06_.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-bypass.mjs
var dev_bypass_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
async function handleDevBypass(context) {
	return apiError("FORBIDDEN", "Dev bypass is only available in development mode", 403);
}
var GET = handleDevBypass;
var POST = handleDevBypass;
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-bypass@_@mjs
var page = () => dev_bypass_exports;
//#endregion
export { page };
