import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { I as contentCreateBody, L as contentListQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as mapErrorStatus } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { m as hasPermission } from "./dist_Lsl8Hpq0.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { n as requireOwnerPerm, r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/index.mjs
var _collection__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.handleContentList) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	const collection = params.collection;
	const query = parseQuery(url, contentListQuery);
	if (isParseError(query)) return query;
	const params_ = hasPermission(user, "content:read_drafts") ? query : {
		...query,
		status: "published"
	};
	return unwrapResult(await emdash.handleContentList(collection, params_));
};
var POST = async ({ params, request, locals, cache }) => {
	const { emdash, user } = locals;
	if (!emdash?.handleContentCreate || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "content:create");
	if (denied) return denied;
	const collection = params.collection;
	const body = await parseBody(request, contentCreateBody);
	if (isParseError(body)) return body;
	if (body.translationOf) {
		const source = await emdash.handleContentGet(collection, body.translationOf);
		if (!source.success) return apiError(source.error?.code ?? "NOT_FOUND", source.error?.message ?? "Translation source not found", mapErrorStatus(source.error?.code));
		const translationDenied = requireOwnerPerm(user, source.data.item.authorId ?? "", "content:edit_own", "content:edit_any");
		if (translationDenied) return translationDenied;
	}
	if ((body.publishedAt !== void 0 || body.createdAt !== void 0) && !hasPermission(user, "content:publish_any")) return apiError("FORBIDDEN", "Writing publishedAt or createdAt requires content:publish_any permission", 403);
	const result = await emdash.handleContentCreate(collection, {
		...body,
		authorId: user?.id,
		locale: body.locale,
		translationOf: body.translationOf
	});
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection] });
	return unwrapResult(result, 201);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/index@_@mjs
var page = () => _collection__exports;
//#endregion
export { page };
