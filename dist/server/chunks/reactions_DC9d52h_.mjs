import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import { s as invalidateCommentObjectCache } from "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import { X as createReactionBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as extractRequestMeta } from "./request-meta-DzXYYI-n_Dva0zy5x.mjs";
import { t as CommentReactionRepository } from "./comment-reaction-BUlUz2bh_Vu4AnkyX.mjs";
import { a as unwrapResult, i as requireDb, n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as resolveSecretsCached } from "./secrets-870d-7yA_DAoCQXHi.mjs";
import "./schemas_CKWG3bd1.mjs";
import { c as hashIp } from "./comments-QPKgK3nk_F0JOVKFC.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/comments/_collection_/_contentId_/reactions.mjs
var reactions_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
/** Max reactions a single voter may register per window before throttling. */
var REACTION_RATE_LIMIT = 30;
var REACTION_RATE_WINDOW_MINUTES = 10;
/**
* Reactions the system accepts. Positive-only for now (matches the shipped
* widget); kept as an allowlist so a voter can't spam arbitrary reaction
* strings and bloat a comment's count map. Extend (or make configurable) as
* the UI grows.
*/
var ALLOWED_REACTIONS = /* @__PURE__ */ new Set(["like"]);
/**
* Toggle a reaction for a voter on an approved comment belonging to the given
* content item. Rate-limited per voter.
*/
async function handleReactionToggle(db, params) {
	try {
		const { collection, contentId, commentId, reaction, voterHash } = params;
		if (!ALLOWED_REACTIONS.has(reaction)) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Unsupported reaction"
			}
		};
		const comment = await db.selectFrom("_emdash_comments").select(["id", "status"]).where("id", "=", commentId).where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
		if (!comment) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: "Comment not found"
			}
		};
		if (comment.status !== "approved") return {
			success: false,
			error: {
				code: "COMMENT_NOT_APPROVED",
				message: "Cannot react to this comment"
			}
		};
		const repo = new CommentReactionRepository(db);
		if (await repo.countRecentByVoter(voterHash, REACTION_RATE_WINDOW_MINUTES) >= REACTION_RATE_LIMIT) return {
			success: false,
			error: {
				code: "RATE_LIMITED",
				message: "Too many reactions. Please try again later."
			}
		};
		const { reacted } = await repo.toggle({
			commentId,
			reaction,
			voterHash
		});
		const countsMap = await repo.countsForComments([commentId]);
		invalidateCommentObjectCache();
		return {
			success: true,
			data: {
				commentId,
				reaction,
				reacted,
				counts: countsMap.get(commentId) ?? {}
			}
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REACTION_TOGGLE_ERROR",
				message: "Failed to toggle reaction"
			}
		};
	}
}
/**
* Read aggregate reaction counts for every approved comment on a content item,
* plus (optionally) which reactions the current voter has active.
*/
async function handleReactionCounts(db, collection, contentId, voterHash) {
	try {
		const ids = (await db.selectFrom("_emdash_comments").select("id").where("collection", "=", collection).where("content_id", "=", contentId).where("status", "=", "approved").execute()).map((c) => c.id);
		const repo = new CommentReactionRepository(db);
		const countsMap = await repo.countsForComments(ids);
		const reactions = {};
		for (const [id, counts] of countsMap) reactions[id] = counts;
		const data = { reactions };
		if (voterHash) {
			const viewerMap = await repo.viewerReactions(ids, voterHash);
			const viewer = {};
			for (const [id, list] of viewerMap) viewer[id] = list;
			data.viewer = viewer;
		}
		return {
			success: true,
			data
		};
	} catch {
		return {
			success: false,
			error: {
				code: "REACTION_COUNTS_ERROR",
				message: "Failed to read reactions"
			}
		};
	}
}
var GET = async ({ params, request, locals }) => {
	const { emdash } = locals;
	const { collection, contentId } = params;
	if (!collection || !contentId) return apiError("VALIDATION_ERROR", "Collection and content ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	try {
		const meta = extractRequestMeta(request, emdash.config);
		let voterHash = "unknown";
		if (meta.ip) {
			const { ipSalt } = await resolveSecretsCached(emdash.db);
			voterHash = await hashIp(meta.ip, ipSalt);
		}
		return unwrapResult(await handleReactionCounts(emdash.db, collection, contentId, voterHash));
	} catch (error) {
		return handleError(error, "Failed to read reactions", "REACTION_COUNTS_ERROR");
	}
};
var POST = async ({ params, request, locals }) => {
	const { emdash } = locals;
	const { collection, contentId } = params;
	if (!collection || !contentId) return apiError("VALIDATION_ERROR", "Collection and content ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	try {
		const body = await parseBody(request, createReactionBody);
		if (isParseError(body)) return body;
		if (body.website_url) return apiSuccess({
			reacted: false,
			counts: {}
		});
		const meta = extractRequestMeta(request, emdash.config);
		let voterHash = "unknown";
		if (meta.ip) {
			const { ipSalt } = await resolveSecretsCached(emdash.db);
			voterHash = await hashIp(meta.ip, ipSalt);
		}
		return unwrapResult(await handleReactionToggle(emdash.db, {
			collection,
			contentId,
			commentId: body.commentId,
			reaction: body.reaction,
			voterHash
		}), 200);
	} catch (error) {
		return handleError(error, "Failed to toggle reaction", "REACTION_TOGGLE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/comments/_collection_/_contentId_/reactions@_@mjs
var page = () => reactions_exports;
//#endregion
export { page };
