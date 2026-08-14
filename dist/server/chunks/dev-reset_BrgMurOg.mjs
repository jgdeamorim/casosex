import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-reset.mjs
var dev_reset_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ locals }) => {
	return apiError("FORBIDDEN", "Dev reset is only available in development mode", 403);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-reset@_@mjs
var page = () => dev_reset_exports;
//#endregion
export { page };
