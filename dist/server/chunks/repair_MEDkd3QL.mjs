import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { m as mediaUsageRepairBody } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as handleMediaUsageRepair } from "./media-usage-DPJcNaAq_CWA56Ri3.mjs";
import { a as unwrapResult, i as requireDb } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/media-usage/repair.mjs
var repair_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const body = await parseBody(request, mediaUsageRepairBody);
	if (isParseError(body)) return body;
	return unwrapResult(await handleMediaUsageRepair(emdash.db, body));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/media-usage/repair@_@mjs
var page = () => repair_exports;
//#endregion
export { page };
