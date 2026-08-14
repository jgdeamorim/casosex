import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { m as hasPermission } from "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/translations.mjs
var translations_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
function isPublished(t) {
	return typeof t === "object" && t !== null && "status" in t && t.status === "published";
}
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.handleContentTranslations) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	const collection = params.collection;
	const id = params.id;
	const result = await emdash.handleContentTranslations(collection, id);
	if (result.success && !hasPermission(user, "content:read_drafts")) {
		const data = result.data && typeof result.data === "object" ? result.data : void 0;
		const filtered = (Array.isArray(data?.translations) ? data.translations : []).filter(isPublished);
		return unwrapResult({
			success: true,
			data: {
				...data,
				translations: filtered
			}
		});
	}
	return unwrapResult(result);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/translations@_@mjs
var page = () => translations_exports;
//#endregion
export { page };
