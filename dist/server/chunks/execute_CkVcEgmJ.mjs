import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as slugify } from "./slugify-C_tqlU4G_CNEf4FGV.mjs";
import { t as ContentRepository } from "./content-CpfKV9QE_DeIsRghk.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./dist_C4cexd-h.mjs";
import "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import { t as BylineRepository } from "./byline-C5TAqs8N_UXuC5WkK.mjs";
import "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { _ as resolveImportByline, g as gutenbergToPortableText, m as parseWxrString, p as parseWxrDate, u as importReusableBlocksAsSections } from "./import-PKhLeXvn_D32uTAAY.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { a as preImportWxrTaxonomies, i as mirrorTermsToLocales, n as isWxrTaxonomyConflictError, o as setPostTermAssignmentsReplacing, t as attachPostTaxonomies } from "./wxr-taxonomies-BexjtNid_D5EregNj.mjs";
import { r as sanitizeSlug } from "./analyze_Avw26n6H.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/execute.mjs
var execute_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	importContent: () => importContent,
	prerender: () => false
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	if (!emdash?.handleContentCreate) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	try {
		const emdashManifest = await emdash.getManifest();
		const formData = await request.formData();
		const fileEntry = formData.get("file");
		const file = fileEntry instanceof File ? fileEntry : null;
		const configEntry = formData.get("config");
		const configJson = typeof configEntry === "string" ? configEntry : null;
		if (!file) return apiError("VALIDATION_ERROR", "No file provided", 400);
		if (!configJson) return apiError("VALIDATION_ERROR", "No config provided", 400);
		const config = JSON.parse(configJson);
		const wxr = await parseWxrString(await file.text());
		const attachmentMap = /* @__PURE__ */ new Map();
		for (const att of wxr.attachments) if (att.id && att.url) attachmentMap.set(String(att.id), att.url);
		const authorDisplayNames = /* @__PURE__ */ new Map();
		for (const author of wxr.authors) {
			if (!author.login) continue;
			authorDisplayNames.set(author.login, author.displayName || author.login);
		}
		const taxonomyPlan = await preImportWxrTaxonomies(emdash.db, wxr.posts, wxr.categories, wxr.tags, wxr.terms, config.locale);
		const postLocales = /* @__PURE__ */ new Set();
		for (const post of wxr.posts) if (post.locale) postLocales.add(post.locale);
		if (postLocales.size > 0) try {
			await mirrorTermsToLocales(emdash.db, taxonomyPlan, postLocales, config.locale);
		} catch (mirrorError) {
			if (isWxrTaxonomyConflictError(mirrorError)) {
				console.error("[WXR_IMPORT_TAXONOMY_CONFLICT]", mirrorError);
				return apiError("WXR_IMPORT_TAXONOMY_CONFLICT", mirrorError.publicMessage, 409);
			}
			throw mirrorError;
		}
		const result = await importContent(wxr.posts, config, emdash, emdashManifest, attachmentMap, config.locale, authorDisplayNames, taxonomyPlan);
		if (config.importSections !== false) {
			const sectionsResult = await importReusableBlocksAsSections(wxr.posts, emdash.db);
			result.sections = {
				created: sectionsResult.sectionsCreated,
				skipped: sectionsResult.sectionsSkipped
			};
			result.errors.push(...sectionsResult.errors);
			if (sectionsResult.errors.length > 0) result.success = false;
		}
		return apiSuccess(result);
	} catch (error) {
		return handleError(error, "Failed to import content", "WXR_IMPORT_ERROR");
	}
};
async function importContent(posts, config, emdash, manifest, attachmentMap, locale, authorDisplayNames, taxonomyPlan) {
	const result = {
		success: true,
		imported: 0,
		skipped: 0,
		errors: [],
		byCollection: {},
		taxonomies: {
			termsCreated: taxonomyPlan.termsCreated,
			termsReused: taxonomyPlan.termsReused,
			assignments: 0,
			missingTaxonomies: taxonomyPlan.missingTaxonomies
		}
	};
	const contentRepo = new ContentRepository(emdash.db);
	const bylineRepo = new BylineRepository(emdash.db);
	const bylineCache = /* @__PURE__ */ new Map();
	const translationGroupMap = /* @__PURE__ */ new Map();
	for (const post of posts) {
		const postType = post.postType || "post";
		const mapping = config.postTypeMappings[postType];
		if (!mapping || !mapping.enabled) {
			result.skipped++;
			continue;
		}
		const collection = sanitizeSlug(mapping.collection);
		if (!manifest?.collections[collection]) {
			result.errors.push({
				title: post.title || "Untitled",
				error: `Collection "${collection}" does not exist`
			});
			continue;
		}
		try {
			const content = post.content ? gutenbergToPortableText(post.content) : [];
			const slug = post.postName || slugify(post.title || `post-${post.id || Date.now()}`);
			const postLocale = post.locale ?? locale;
			if (config.skipExisting) {
				const existing = await contentRepo.findBySlug(collection, slug, postLocale);
				if (existing) {
					if (post.translationGroup) translationGroupMap.set(post.translationGroup, existing.id);
					result.skipped++;
					continue;
				}
			}
			let translationOf;
			if (post.translationGroup) translationOf = translationGroupMap.get(post.translationGroup);
			const status = mapStatus(post.status);
			const data = {
				title: post.title || "Untitled",
				content,
				excerpt: post.excerpt || void 0
			};
			const collectionSchema = manifest.collections[collection];
			if (collectionSchema?.fields ? "featured_image" in collectionSchema.fields : false) {
				const thumbnailId = post.meta.get("_thumbnail_id");
				const featuredImage = thumbnailId ? attachmentMap.get(String(thumbnailId)) : void 0;
				if (featuredImage) data.featured_image = featuredImage;
			}
			let authorId;
			if (config.authorMappings && post.creator) {
				const mappedUserId = config.authorMappings[post.creator];
				if (mappedUserId !== void 0 && mappedUserId !== null) authorId = mappedUserId;
			}
			const bylineId = await resolveImportByline(post.creator, authorDisplayNames?.get(post.creator ?? "") ?? post.creator, authorId, bylineRepo, bylineCache);
			const parsedDate = parseWxrDate(post.postDateGmt, post.pubDate, post.postDate);
			const createdAt = parsedDate ? parsedDate.toISOString() : void 0;
			const publishedAt = status === "published" && createdAt ? createdAt : void 0;
			const createResult = await emdash.handleContentCreate(collection, {
				data,
				slug,
				status,
				authorId,
				bylines: bylineId ? [{ bylineId }] : void 0,
				locale: postLocale,
				translationOf,
				createdAt,
				publishedAt
			});
			if (createResult.success) {
				result.imported++;
				result.byCollection[collection] = (result.byCollection[collection] || 0) + 1;
				const createdItem = createResult.data?.item;
				if (createdItem && post.translationGroup && !translationGroupMap.has(post.translationGroup)) translationGroupMap.set(post.translationGroup, createdItem.id);
				if (createdItem) try {
					const written = translationOf ? await setPostTermAssignmentsReplacing(emdash.db, collection, createdItem.id, post, taxonomyPlan) : await attachPostTaxonomies(emdash.db, collection, createdItem.id, post, taxonomyPlan);
					if (result.taxonomies) result.taxonomies.assignments += written;
				} catch (taxError) {
					console.error(`Failed to attach taxonomies for "${post.title || "Untitled"}":`, taxError);
					result.errors.push({
						title: post.title || "Untitled",
						error: taxError instanceof Error && taxError.message ? `Imported but failed to attach taxonomies: ${taxError.message}` : "Imported but failed to attach taxonomies"
					});
				}
			} else result.errors.push({
				title: post.title || "Untitled",
				error: typeof createResult.error === "object" && createResult.error !== null ? createResult.error.message || "Unknown error" : String(createResult.error)
			});
		} catch (error) {
			console.error(`Import error for "${post.title || "Untitled"}":`, error);
			result.errors.push({
				title: post.title || "Untitled",
				error: error instanceof Error && error.message ? error.message : "Failed to import item"
			});
		}
	}
	result.success = result.errors.length === 0;
	return result;
}
function mapStatus(wpStatus) {
	switch (wpStatus) {
		case "publish": return "published";
		case "draft": return "draft";
		case "pending": return "draft";
		case "private": return "draft";
		default: return "draft";
	}
}
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/execute@_@mjs
var page = () => execute_exports;
//#endregion
export { page };
