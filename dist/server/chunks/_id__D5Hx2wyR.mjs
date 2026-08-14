import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { a as unwrapResult, i as requireDb, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { a as handleCommentGet, i as handleCommentDelete } from "./comments-QPKgK3nk_F0JOVKFC.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	prerender: () => false
});
/**
* Get single comment detail (includes moderation_metadata)
*/
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "Comment ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:moderate");
	if (denied) return denied;
	try {
		return unwrapResult(await handleCommentGet(emdash.db, id));
	} catch (error) {
		return handleError(error, "Failed to get comment", "COMMENT_GET_ERROR");
	}
};
/**
* Hard delete a comment (ADMIN only)
*/
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "Comment ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:delete");
	if (denied) return denied;
	try {
		return unwrapResult(await handleCommentDelete(emdash.db, id));
	} catch (error) {
		return handleError(error, "Failed to delete comment", "COMMENT_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
