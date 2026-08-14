import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as apiSuccess, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/index.mjs
var providers_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* List all configured media providers
*/
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "media:read");
	if (denied) return denied;
	if (!emdash?.getMediaProviderList) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	return apiSuccess({ items: emdash.getMediaProviderList() });
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/index@_@mjs
var page = () => providers_exports;
//#endregion
export { page };
