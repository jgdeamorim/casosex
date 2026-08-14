import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { s as localeFilterQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import { $ as createTaxonomyDefBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { n as handleTaxonomyList, t as handleTaxonomyCreate } from "./taxonomies-Dbdki3Un_Dc3Q5ZJ8.mjs";
import { a as unwrapResult, i as requireDb, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/index.mjs
var taxonomies_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
/**
* List taxonomy definitions
*/
var GET = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleTaxonomyList(emdash.db, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to list taxonomies", "TAXONOMY_LIST_ERROR");
	}
};
/**
* Create a custom taxonomy definition
*/
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createTaxonomyDefBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleTaxonomyCreate(emdash.db, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create taxonomy", "TAXONOMY_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/index@_@mjs
var page = () => taxonomies_exports;
//#endregion
export { page };
