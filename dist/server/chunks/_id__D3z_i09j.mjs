import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { W as contentUpdateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as mapErrorStatus } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { m as hasPermission } from "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { n as requireOwnerPerm, r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	const collection = params.collection;
	const id = params.id;
	const locale = url.searchParams.get("locale") || void 0;
	const result = await emdash.handleContentGet(collection, id, locale);
	if (result.success && !hasPermission(user, "content:read_drafts")) {
		const data = result.data && typeof result.data === "object" ? result.data : void 0;
		const item = data?.item && typeof data.item === "object" ? data.item : void 0;
		if ((typeof item?.status === "string" ? item.status : null) !== "published") return apiError("NOT_FOUND", `Content item not found: ${id}`, 404);
		if (item) {
			if (item.liveData && typeof item.liveData === "object") item.data = item.liveData;
			delete item.liveData;
			delete item.draftRevisionId;
		}
	}
	return unwrapResult(result);
};
var PUT = async ({ params, request, locals, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	const locale = new URL(request.url).searchParams.get("locale") || void 0;
	const body = await parseBody(request, contentUpdateBody);
	if (isParseError(body)) return body;
	if (!emdash?.handleContentUpdate || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const existing = await emdash.handleContentGet(collection, id, locale);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const editDenied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:edit_own", "content:edit_any");
	if (editDenied) return editDenied;
	if (body.publishedAt !== void 0 && !hasPermission(user, "content:publish_any")) return apiError("FORBIDDEN", "Writing publishedAt requires content:publish_any permission", 403);
	const resolvedId = typeof existingItem?.id === "string" ? existingItem.id : id;
	const updateBody = body.authorId !== void 0 && user && hasPermission(user, "content:edit_any") ? body : {
		...body,
		authorId: void 0
	};
	const result = await emdash.handleContentUpdate(collection, resolvedId, {
		...updateBody,
		locale,
		_rev: body._rev
	});
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled && result.liveContentChanged !== false) await cache.invalidate({ tags: [collection, resolvedId] });
	return unwrapResult(result);
};
var DELETE = async ({ params, locals, url, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentDelete || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const locale = url.searchParams.get("locale") || void 0;
	const existing = await emdash.handleContentGet(collection, id, locale);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const deleteData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const deleteItem = deleteData?.item && typeof deleteData.item === "object" ? deleteData.item : deleteData;
	const deleteDenied = requireOwnerPerm(user, typeof deleteItem?.authorId === "string" ? deleteItem.authorId : "", "content:delete_own", "content:delete_any");
	if (deleteDenied) return deleteDenied;
	const resolvedId = typeof deleteItem?.id === "string" ? deleteItem.id : id;
	const result = await emdash.handleContentDelete(collection, resolvedId);
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId] });
	return unwrapResult(result);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
