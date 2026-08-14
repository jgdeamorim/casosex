import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { P as commentStatusBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { a as unwrapResult, i as requireDb, n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { a as handleCommentGet } from "./comments-QPKgK3nk_F0JOVKFC.mjs";
import { t as getSiteBaseUrl } from "./site-url-8N3kSyVZ_Dwp-TjYy.mjs";
import { i as sendCommentNotification, n as lookupContentAuthor, r as moderateComment } from "./service-DyFT-k-R_Du9VjY9Z.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_/status.mjs
var status_exports = /* @__PURE__ */ __exportAll({
	PUT: () => PUT,
	prerender: () => false
});
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "Comment ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:moderate");
	if (denied) return denied;
	try {
		const body = await parseBody(request, commentStatusBody);
		if (isParseError(body)) return body;
		const newStatus = body.status;
		const hookRunner = {
			async runBeforeCreate(event) {
				return emdash.hooks.runCommentBeforeCreate(event);
			},
			async runModerate(event) {
				const result = await emdash.hooks.invokeExclusiveHook("comment:moderate", event);
				if (!result) return {
					status: "pending",
					reason: "No moderator configured"
				};
				if (result.error) return {
					status: "pending",
					reason: "Moderation error"
				};
				return result.result;
			},
			fireAfterCreate(event) {
				emdash.hooks.runCommentAfterCreate(event).catch((err) => console.error("[comments] afterCreate error:", err instanceof Error ? err.message : err));
			},
			fireAfterModerate(event) {
				emdash.hooks.runCommentAfterModerate(event).catch((err) => console.error("[comments] afterModerate error:", err instanceof Error ? err.message : err));
			}
		};
		const existing = await handleCommentGet(emdash.db, id);
		if (!existing.success) return unwrapResult(existing);
		const previousStatus = existing.data.status;
		const updated = await moderateComment(emdash.db, id, newStatus, {
			id: user.id,
			name: user.name ?? null
		}, hookRunner);
		if (!updated) return apiError("NOT_FOUND", "Comment not found", 404);
		if (newStatus === "approved" && previousStatus !== "approved" && emdash.email) try {
			const adminBaseUrl = await getSiteBaseUrl(emdash.db, request);
			const content = await lookupContentAuthor(emdash.db, updated.collection, updated.contentId);
			if (content?.author) await sendCommentNotification({
				email: emdash.email,
				comment: updated,
				contentAuthor: content.author,
				adminBaseUrl
			});
		} catch (err) {
			console.error("[comments] notification error:", err instanceof Error ? err.message : err);
		}
		return apiSuccess(updated);
	} catch (error) {
		return handleError(error, "Failed to update comment status", "COMMENT_STATUS_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_/status@_@mjs
var page = () => status_exports;
//#endregion
export { page };
