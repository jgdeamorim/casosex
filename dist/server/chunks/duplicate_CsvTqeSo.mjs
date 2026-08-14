import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as mapErrorStatus } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as requireOwnerPerm, r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs
var duplicate_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, locals, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentDuplicate || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "content:create");
	if (denied) return denied;
	const existing = await emdash.handleContentGet(collection, id);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const readDenied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:edit_own", "content:edit_any");
	if (readDenied) return readDenied;
	const resolvedId = typeof existingItem?.id === "string" ? existingItem.id : id;
	const result = await emdash.handleContentDuplicate(collection, resolvedId, user?.id);
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection] });
	return unwrapResult(result, 201);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/duplicate@_@mjs
var page = () => duplicate_exports;
//#endregion
export { page };
