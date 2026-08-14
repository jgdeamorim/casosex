import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { N as commentListQuery } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { o as handleCommentInbox } from "./comments-QPKgK3nk_F0JOVKFC.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/index.mjs
var comments_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
/**
* List comments for moderation inbox
*/
var GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:moderate");
	if (denied) return denied;
	try {
		const query = parseQuery(url, commentListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleCommentInbox(emdash.db, {
			status: query.status,
			collection: query.collection,
			search: query.search,
			limit: query.limit,
			cursor: query.cursor
		}));
	} catch (error) {
		return handleError(error, "Failed to list comments", "COMMENT_INBOX_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/index@_@mjs
var page = () => comments_exports;
//#endregion
export { page };
