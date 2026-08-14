import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { r as handleCommentCounts } from "./comments-QPKgK3nk_F0JOVKFC.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/counts.mjs
var counts_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:moderate");
	if (denied) return denied;
	try {
		return unwrapResult(await handleCommentCounts(emdash.db));
	} catch (error) {
		return handleError(error, "Failed to get comment counts", "COMMENT_COUNTS_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/counts@_@mjs
var page = () => counts_exports;
//#endregion
export { page };
