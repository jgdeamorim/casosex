import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./comment-DnTxxVHv__NAQiWHX.mjs";
import "./content-CpfKV9QE_DeIsRghk.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./user-BAumEmpA_79fxFfjA.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import { Q as handleSchemaCollectionUpdate, X as handleSchemaCollectionGet, Y as handleSchemaCollectionDelete } from "./query-1xOcEy18_dGFoQgZT.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import "./manifest-schema-bCq54i7F_oDiktgui.mjs";
import { j as collectionGetQuery, yt as updateCollectionBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./menus-BxPLFfIc_Qsmtjm90.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import "./byline-C5TAqs8N_UXuC5WkK.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import "./registry-BP1JK2xh_C4nDpLUe.mjs";
import "./dashboard-DoBwPnON_BZ6Klac5.mjs";
import "./media-usage-DPJcNaAq_CWA56Ri3.mjs";
import "./zod-generator-DMzfga3g_DxHzNpJC.mjs";
import "./schema-eqZhkR0S_CJC5oLyH.mjs";
import "./sections-DSuEfirn_LC35OjDp.mjs";
import "./settings-CREKyj8I_sz1CfsBP.mjs";
import "./taxonomies-Dbdki3Un_Dc3Q5ZJ8.mjs";
import { a as unwrapResult, i as requireDb } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/index.mjs
var _slug__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const slug = params.slug;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:read");
	if (denied) return denied;
	const query = parseQuery(url, collectionGetQuery);
	if (isParseError(query)) return query;
	return unwrapResult(await handleSchemaCollectionGet(emdash.db, slug, { includeFields: query.includeFields ?? false }));
};
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const slug = params.slug;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const body = await parseBody(request, updateCollectionBody);
	if (isParseError(body)) return body;
	const result = await handleSchemaCollectionUpdate(emdash.db, slug, body);
	emdash.invalidateUrlPatternCache();
	return unwrapResult(result);
};
var DELETE = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const slug = params.slug;
	const force = url.searchParams.get("force") === "true";
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const result = await handleSchemaCollectionDelete(emdash.db, slug, { force });
	emdash.invalidateUrlPatternCache();
	return unwrapResult(result);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/index@_@mjs
var page = () => _slug__exports;
//#endregion
export { page };
