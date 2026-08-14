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
import { Tt as updateTermBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { a as handleTermGet, c as handleTermUpdate, i as handleTermDelete } from "./taxonomies-Dbdki3Un_Dc3Q5ZJ8.mjs";
import { a as unwrapResult, i as requireDb, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs
var _slug__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
/**
* Get a single term
*/
var GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { name, slug } = params;
	if (!name || !slug) return apiError("VALIDATION_ERROR", "Taxonomy name and slug required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleTermGet(emdash.db, name, slug, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to get term", "TERM_GET_ERROR");
	}
};
/**
* Update a term
*/
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { name, slug } = params;
	if (!name || !slug) return apiError("VALIDATION_ERROR", "Taxonomy name and slug required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:manage");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		const body = await parseBody(request, updateTermBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleTermUpdate(emdash.db, name, slug, body, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to update term", "TERM_UPDATE_ERROR");
	}
};
/**
* Delete a term
*/
var DELETE = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { name, slug } = params;
	if (!name || !slug) return apiError("VALIDATION_ERROR", "Taxonomy name and slug required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:manage");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleTermDelete(emdash.db, name, slug, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to delete term", "TERM_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_@_@mjs
var page = () => _slug__exports;
//#endregion
export { page };
