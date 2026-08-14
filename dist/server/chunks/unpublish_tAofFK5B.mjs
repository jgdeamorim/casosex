import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as mapErrorStatus } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as requireOwnerPerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs
var unpublish_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, locals, url, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentUnpublish || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const locale = url.searchParams.get("locale") || void 0;
	const existing = await emdash.handleContentGet(collection, id, locale);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const denied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:publish_own", "content:publish_any");
	if (denied) return denied;
	const resolvedId = typeof existingItem?.id === "string" ? existingItem.id : id;
	const result = await emdash.handleContentUnpublish(collection, resolvedId);
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId] });
	return unwrapResult(result);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/unpublish@_@mjs
var page = () => unpublish_exports;
//#endregion
export { page };
