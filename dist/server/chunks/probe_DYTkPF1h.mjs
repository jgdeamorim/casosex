import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import { t as SsrfError } from "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import { a as importProbeBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { h as probeUrl } from "./import-PKhLeXvn_D32uTAAY.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/probe.mjs
var probe_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { user } = locals;
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	try {
		const body = await parseBody(request, importProbeBody);
		if (isParseError(body)) return body;
		return apiSuccess({
			success: true,
			result: await probeUrl(body.url)
		});
	} catch (error) {
		if (error instanceof SsrfError) return apiError("SSRF_BLOCKED", error.message, 400);
		return handleError(error, "Failed to probe URL", "PROBE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/probe@_@mjs
var page = () => probe_exports;
//#endregion
export { page };
