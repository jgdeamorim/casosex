import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { r as bylineFieldReorderBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import { a as unwrapResult, i as requireDb } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { a as handleBylineFieldReorder } from "./byline-fields-T9ZLZMxJ_DD-MrMTw.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/reorder.mjs
var reorder_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const body = await parseBody(request, bylineFieldReorderBody);
	if (isParseError(body)) return body;
	return unwrapResult(await handleBylineFieldReorder(emdash.db, body.slugs));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/reorder@_@mjs
var page = () => reorder_exports;
//#endregion
export { page };
