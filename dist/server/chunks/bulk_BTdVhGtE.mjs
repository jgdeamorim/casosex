import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { M as commentBulkBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { n as handleCommentBulk } from "./comments-QPKgK3nk_F0JOVKFC.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/bulk.mjs
var bulk_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	try {
		const body = await parseBody(request, commentBulkBody);
		if (isParseError(body)) return body;
		if (body.action === "delete") {
			const denied = requirePerm(user, "comments:delete");
			if (denied) return denied;
		} else {
			const denied = requirePerm(user, "comments:moderate");
			if (denied) return denied;
		}
		return unwrapResult(await handleCommentBulk(emdash.db, body.ids, body.action));
	} catch (error) {
		return handleError(error, "Failed to perform bulk operation", "COMMENT_BULK_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/bulk@_@mjs
var page = () => bulk_exports;
//#endregion
export { page };
