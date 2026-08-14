import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, v as object } from "./schemas_CzTFUUcv.mjs";
import { s as localeFilterQuery } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { a as handleTermGet, r as handleTermCreate, s as handleTermTranslations } from "./taxonomies-Dbdki3Un_Dc3Q5ZJ8.mjs";
import { a as unwrapResult, i as requireDb, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as parseQuery, n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs
var translations_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var createTermTranslationBody = object({
	locale: string().min(1),
	label: string().min(1).optional(),
	slug: string().min(1).optional()
}).meta({ id: "CreateTermTranslationBody" });
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
		const anchor = await handleTermGet(emdash.db, name, slug, { locale: query.locale });
		if (!anchor.success) return unwrapResult(anchor);
		return unwrapResult(await handleTermTranslations(emdash.db, anchor.data.term.id));
	} catch (error) {
		return handleError(error, "Failed to list term translations", "TERM_TRANSLATIONS_ERROR");
	}
};
var POST = async ({ params, request, locals }) => {
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
		const body = await parseBody(request, createTermTranslationBody);
		if (isParseError(body)) return body;
		const source = await handleTermGet(emdash.db, name, slug, { locale: query.locale });
		if (!source.success) return unwrapResult(source);
		return unwrapResult(await handleTermCreate(emdash.db, name, {
			slug: body.slug ?? source.data.term.slug,
			label: body.label ?? source.data.term.label,
			parentId: source.data.term.parentId,
			description: source.data.term.description,
			locale: body.locale,
			translationOf: source.data.term.id
		}), 201);
	} catch (error) {
		return handleError(error, "Failed to create term translation", "TERM_TRANSLATION_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations@_@mjs
var page = () => translations_exports;
//#endregion
export { page };
