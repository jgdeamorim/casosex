import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/typegen.mjs
var typegen_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ locals }) => {
	return apiError("FORBIDDEN", "Typegen is only available in development", 403);
};
var POST = async ({ locals }) => {
	return apiError("FORBIDDEN", "Typegen is only available in development", 403);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/typegen@_@mjs
var page = () => typegen_exports;
//#endregion
export { page };
