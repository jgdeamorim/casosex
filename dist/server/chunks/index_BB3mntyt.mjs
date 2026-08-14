import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as bylineFieldCreateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import { a as unwrapResult, i as requireDb } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { i as handleBylineFieldList, t as handleBylineFieldCreate } from "./byline-fields-T9ZLZMxJ_DD-MrMTw.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/index.mjs
var byline_fields_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "schema:read");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	return unwrapResult(await handleBylineFieldList(emdash.db));
};
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const body = await parseBody(request, bylineFieldCreateBody);
	if (isParseError(body)) return body;
	return unwrapResult(await handleBylineFieldCreate(emdash.db, {
		slug: body.slug,
		label: body.label,
		type: body.type,
		required: body.required,
		translatable: body.translatable,
		validation: body.validation ?? null,
		sortOrder: body.sortOrder
	}), 201);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/index@_@mjs
var page = () => byline_fields_exports;
//#endregion
export { page };
