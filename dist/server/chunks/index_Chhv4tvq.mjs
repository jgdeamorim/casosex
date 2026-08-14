import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/index.mjs
var _revisionId__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const revisionId = params.revisionId;
	const denied = requirePerm(user, "content:read_drafts");
	if (denied) return denied;
	if (!emdash?.handleRevisionGet) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	return unwrapResult(await emdash.handleRevisionGet(revisionId));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/index@_@mjs
var page = () => _revisionId__exports;
//#endregion
export { page };
