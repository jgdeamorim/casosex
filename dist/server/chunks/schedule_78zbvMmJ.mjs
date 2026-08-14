import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { B as contentScheduleBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as mapErrorStatus } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { n as requireOwnerPerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/schedule.mjs
var schedule_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	POST: () => POST,
	prerender: () => false
});
/**
* Extract author ID from a content item response (shared by POST and DELETE).
*/
function extractOwnership(data) {
	const obj = data && typeof data === "object" ? data : void 0;
	const item = obj?.item && typeof obj.item === "object" ? obj.item : obj;
	return {
		authorId: typeof item?.authorId === "string" ? item.authorId : "",
		resolvedId: typeof item?.id === "string" ? item.id : void 0
	};
}
var POST = async ({ params, request, locals, url, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	const body = await parseBody(request, contentScheduleBody);
	if (isParseError(body)) return body;
	if (!emdash?.handleContentSchedule || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const locale = url.searchParams.get("locale") || void 0;
	const existing = await emdash.handleContentGet(collection, id, locale);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const { authorId, resolvedId } = extractOwnership(existing.data);
	const denied = requireOwnerPerm(user, authorId, "content:publish_own", "content:publish_any");
	if (denied) return denied;
	const result = await emdash.handleContentSchedule(collection, resolvedId ?? id, body.scheduledAt);
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId ?? id] });
	return unwrapResult(result);
};
var DELETE = async ({ params, locals, url, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentUnschedule || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const locale = url.searchParams.get("locale") || void 0;
	const existing = await emdash.handleContentGet(collection, id, locale);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const { authorId, resolvedId } = extractOwnership(existing.data);
	const denied = requireOwnerPerm(user, authorId, "content:publish_own", "content:publish_any");
	if (denied) return denied;
	const result = await emdash.handleContentUnschedule(collection, resolvedId ?? id);
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId ?? id] });
	return unwrapResult(result);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/schedule@_@mjs
var page = () => schedule_exports;
//#endregion
export { page };
