import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import { a as unwrapResult, i as requireDb, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { s as handleBylineFieldUsage } from "./byline-fields-T9ZLZMxJ_DD-MrMTw.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs
var usage_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "schema:read");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const slug = params.slug;
	if (!slug) return apiError("MISSING_PARAM", "Field slug is required", 400);
	return unwrapResult(await handleBylineFieldUsage(emdash.db, slug));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_/usage@_@mjs
var page = () => usage_exports;
//#endregion
export { page };
