import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { p as mediaUsageDetailsQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as handleMediaUsageDetails } from "./media-usage-DPJcNaAq_CWA56Ri3.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { t as requireScope } from "./scopes-Be2d8bSb_D78P5SWA.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/usage.mjs
var usage_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const mediaDenied = requirePerm(user, "media:read");
	if (mediaDenied) return mediaDenied;
	const contentDenied = requirePerm(user, "content:read_drafts");
	if (contentDenied) return contentDenied;
	const scopeDenied = requireScope(locals, "admin");
	if (scopeDenied) return scopeDenied;
	const { id } = params;
	if (!id) return apiError("INVALID_REQUEST", "Media ID required", 400);
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const query = parseQuery(new URL(request.url), mediaUsageDetailsQuery);
	if (isParseError(query)) return query;
	return unwrapResult(await handleMediaUsageDetails(emdash.db, id, query));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/usage@_@mjs
var page = () => usage_exports;
//#endregion
export { page };
