import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as mapErrorStatus } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as requireOwnerPerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/restore.mjs
var restore_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const revisionId = params.revisionId;
	if (!emdash?.handleRevisionRestore || !emdash?.handleRevisionGet || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const revision = await emdash.handleRevisionGet(revisionId);
	if (!revision.success) return apiError(revision.error?.code ?? "UNKNOWN_ERROR", revision.error?.message ?? "Revision not found", mapErrorStatus(revision.error?.code));
	const collection = revision.data?.item?.collection;
	const entryId = revision.data?.item?.entryId;
	if (!collection || !entryId) return apiError("INVALID_REVISION", "Revision is missing collection or entry reference", 400);
	const existing = await emdash.handleContentGet(collection, entryId);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Content not found", mapErrorStatus(existing.error?.code));
	const denied = requireOwnerPerm(user, existing.data?.item?.authorId ?? "", "content:edit_own", "content:edit_any");
	if (denied) return denied;
	return unwrapResult(await emdash.handleRevisionRestore(revisionId, user.id));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/restore@_@mjs
var page = () => restore_exports;
//#endregion
export { page };
