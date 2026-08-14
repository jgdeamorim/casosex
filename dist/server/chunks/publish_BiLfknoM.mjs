import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { z as contentPublishBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as mapErrorStatus } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { m as hasPermission } from "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as parseOptionalBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { n as requireOwnerPerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/publish.mjs
var publish_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, request, locals, url, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentPublish || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const body = await parseOptionalBody(request, contentPublishBody, {});
	if (isParseError(body)) return body;
	const locale = url.searchParams.get("locale") || void 0;
	const existing = await emdash.handleContentGet(collection, id, locale);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const denied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:publish_own", "content:publish_any");
	if (denied) return denied;
	const publishedAt = body?.publishedAt;
	if (publishedAt !== void 0 && !hasPermission(user, "content:publish_any")) return apiError("FORBIDDEN", "Setting publishedAt requires content:publish_any permission", 403);
	const resolvedId = typeof existingItem?.id === "string" ? existingItem.id : id;
	const result = await emdash.handleContentPublish(collection, resolvedId, { publishedAt });
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId] });
	return unwrapResult(result);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/publish@_@mjs
var page = () => publish_exports;
//#endregion
export { page };
