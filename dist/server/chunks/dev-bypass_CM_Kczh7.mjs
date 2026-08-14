import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/dev-bypass.mjs
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
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/dev-bypass@_@mjs
var page = () => dev_bypass_exports;
//#endregion
export { page };
