import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import { t as sql } from "./dist_D4nVBoqy.mjs";
import { b as validateIdentifier } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as normalizeMediaValue } from "./normalize-C-SHXmra_BSrPKVar.mjs";
import { p as markContentMediaUsageCollectionStaleSafely } from "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import { w as wpRewriteUrlsBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/rewrite-url-helpers.mjs
var REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;
var WORDPRESS_IMAGE_SIZE_SUFFIX = /-\d+x\d+(?=\.[^./?#]+$)/;
var BASE_URL_EXTENSION = /^(.+)(\.[^./?#]+)$/;
/**
* Strip query parameters from a URL for base matching
*/
function getBaseUrl(url) {
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return url.split("?")[0] || url;
	}
}
/**
* Build a map of base URLs to new URLs for flexible matching
*/
function buildBaseUrlMap(urlMap) {
	const baseMap = /* @__PURE__ */ new Map();
	for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
		const baseUrl = getBaseUrl(oldUrl);
		baseMap.set(baseUrl, newUrl);
	}
	return baseMap;
}
/**
* Extract the URL to match from a stored media field value.
*
* Image/file columns hold a JSON-stringified MediaValue
* (e.g. `{"provider":"external","id":"","src":"https://.../hero.jpg"}`), but legacy
* rows may hold a bare URL string. Returns the inner `src` for a MediaValue, otherwise
* the value unchanged. Without this, the whole JSON blob is passed to findMatchingUrl()
* and the embedded URL is never matched.
*/
function extractMediaUrl(value) {
	try {
		const parsed = JSON.parse(value);
		if (parsed && typeof parsed.src === "string") return parsed.src;
	} catch {}
	return value;
}
/**
* Find matching new URL for a given URL, checking exact, base, and WordPress image-size matches
*/
function findMatchingUrl(url, exactMap, baseMap) {
	if (exactMap[url]) return exactMap[url];
	const baseUrl = getBaseUrl(url);
	const baseMatch = baseMap.get(baseUrl);
	if (baseMatch) return baseMatch;
	const wordPressImageMatch = baseMap.get(stripWordPressImageSizeSuffix(baseUrl));
	if (wordPressImageMatch) return wordPressImageMatch;
	return null;
}
/**
* Rewrite URLs in a Portable Text array, returning whether any changes were made
*/
function rewritePortableTextUrls(blocks, exactMap, baseMap) {
	let changed = false;
	let urlsRewritten = 0;
	for (const block of blocks) {
		if (block._type === "image" && block.asset?.url) {
			const newUrl = findMatchingUrl(block.asset.url, exactMap, baseMap);
			if (newUrl) {
				block.asset.url = newUrl;
				block.asset._ref = newUrl;
				changed = true;
				urlsRewritten++;
			}
		}
		if (block._type === "image" && block.link) {
			const newUrl = findMatchingUrl(block.link, exactMap, baseMap);
			if (newUrl) {
				block.link = newUrl;
				changed = true;
				urlsRewritten++;
			}
		}
		if (block._type === "gallery" && Array.isArray(block.images)) {
			const result = rewritePortableTextUrls(block.images, exactMap, baseMap);
			if (result.changed) {
				changed = true;
				urlsRewritten += result.urlsRewritten;
			}
		}
		if (block._type === "columns" && Array.isArray(block.columns)) {
			for (const column of block.columns) if (Array.isArray(column.content)) {
				const result = rewritePortableTextUrls(column.content, exactMap, baseMap);
				if (result.changed) {
					changed = true;
					urlsRewritten += result.urlsRewritten;
				}
			}
		}
	}
	return {
		changed,
		urlsRewritten
	};
}
/**
* Rewrite URLs in a string field using simple string replacement
*/
function rewriteStringUrls(value, exactMap, baseMap) {
	let newValue = value;
	let changed = false;
	let urlsRewritten = 0;
	for (const [oldUrl, newUrl] of Object.entries(exactMap)) if (newValue.includes(oldUrl)) {
		newValue = newValue.split(oldUrl).join(newUrl);
		changed = true;
		urlsRewritten++;
	}
	for (const [baseUrl, newUrl] of baseMap.entries()) {
		const regex = buildBaseUrlMatchRegex(baseUrl);
		const matches = newValue.match(regex);
		if (matches) {
			for (const match of matches) if (!exactMap[match]) {
				newValue = newValue.split(match).join(newUrl);
				changed = true;
				urlsRewritten++;
			}
		}
	}
	return {
		newValue,
		changed,
		urlsRewritten
	};
}
/**
* Escape special regex characters in a string
*/
function escapeRegExp(string) {
	return string.replace(REGEX_SPECIAL_CHARS, "\\$&");
}
function stripWordPressImageSizeSuffix(url) {
	return url.replace(WORDPRESS_IMAGE_SIZE_SUFFIX, "");
}
function buildBaseUrlMatchRegex(baseUrl) {
	const extensionMatch = BASE_URL_EXTENSION.exec(baseUrl);
	const basePattern = extensionMatch ? `${escapeRegExp(extensionMatch[1])}(?:-\\d+x\\d+)?${escapeRegExp(extensionMatch[2])}` : escapeRegExp(baseUrl);
	return new RegExp(`${basePattern}(\\?[^"'\\s]*)?(?=$|["'\\s<>)\\],;:!?]|\\.(?=$|["'\\s<>)\\]]))`, "g");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/rewrite-urls.mjs
var rewrite_urls_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false,
	rewriteUrls: () => rewriteUrls
});
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NO_DB", "Database not initialized", 500);
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	try {
		const body = await parseBody(request, wpRewriteUrlsBody);
		if (isParseError(body)) return body;
		if (Object.entries(body.urlMap).length === 0) return apiSuccess({
			updated: 0,
			byCollection: {},
			urlsRewritten: 0,
			errors: []
		});
		const getProvider = (id) => emdash.getMediaProvider(id);
		return apiSuccess(await rewriteUrls(emdash.db, body.urlMap, getProvider, body.collections));
	} catch (error) {
		return handleError(error, "Failed to rewrite URLs", "REWRITE_ERROR");
	}
};
async function rewriteUrls(db, urlMap, getProvider, collections, markUsageCollectionStale = markContentMediaUsageCollectionStaleSafely) {
	const { SchemaRegistry } = await import("./registry-BP1JK2xh_Dg_nQyfY.mjs").then((n) => n.r);
	const registry = new SchemaRegistry(db);
	const result = {
		updated: 0,
		byCollection: {},
		urlsRewritten: 0,
		errors: []
	};
	const staleMarkedCollections = /* @__PURE__ */ new Set();
	const staleMarkFailedCollections = /* @__PURE__ */ new Set();
	const markCollectionStale = async (collectionSlug) => {
		if (staleMarkedCollections.has(collectionSlug)) return;
		if (await markUsageCollectionStale(db, collectionSlug, "CONTENT_USAGE_STALE")) {
			staleMarkedCollections.add(collectionSlug);
			staleMarkFailedCollections.delete(collectionSlug);
		} else staleMarkFailedCollections.add(collectionSlug);
	};
	const baseMap = buildBaseUrlMap(urlMap);
	const allCollections = await registry.listCollections();
	const targetCollections = collections?.length ? allCollections.filter((c) => collections.includes(c.slug)) : allCollections;
	try {
		for (const collection of targetCollections) {
			const fields = await registry.listFields(collection.id);
			const portableTextFields = fields.filter((f) => f.type === "portableText");
			const stringFields = fields.filter((f) => ["text", "string"].includes(f.type));
			const mediaFields = fields.filter((f) => ["image", "file"].includes(f.type));
			if (portableTextFields.length === 0 && stringFields.length === 0 && mediaFields.length === 0) continue;
			validateIdentifier(collection.slug, "collection slug");
			const tableName = `ec_${collection.slug}`;
			try {
				const rows = await sql`
				SELECT * FROM ${sql.ref(tableName)}
				WHERE deleted_at IS NULL
			`.execute(db);
				for (const row of rows.rows) {
					let rowUpdated = false;
					const updates = {};
					let rowUrlsRewritten = 0;
					for (const field of portableTextFields) {
						const value = row[field.slug];
						if (!value || typeof value !== "string") continue;
						try {
							const blocks = JSON.parse(value);
							if (!Array.isArray(blocks)) continue;
							const rewriteResult = rewritePortableTextUrls(blocks, urlMap, baseMap);
							if (rewriteResult.changed) {
								updates[field.slug] = JSON.stringify(blocks);
								rowUpdated = true;
								rowUrlsRewritten += rewriteResult.urlsRewritten;
							}
						} catch {
							const stringResult = rewriteStringUrls(value, urlMap, baseMap);
							if (stringResult.changed) {
								updates[field.slug] = stringResult.newValue;
								rowUpdated = true;
								rowUrlsRewritten += stringResult.urlsRewritten;
							}
						}
					}
					for (const field of stringFields) {
						const value = row[field.slug];
						if (!value || typeof value !== "string") continue;
						const stringResult = rewriteStringUrls(value, urlMap, baseMap);
						if (stringResult.changed) {
							updates[field.slug] = stringResult.newValue;
							rowUpdated = true;
							rowUrlsRewritten += stringResult.urlsRewritten;
						}
					}
					for (const field of mediaFields) {
						const value = row[field.slug];
						if (!value || typeof value !== "string") continue;
						const newUrl = findMatchingUrl(extractMediaUrl(value), urlMap, baseMap);
						if (newUrl) {
							try {
								const normalized = await normalizeMediaValue(newUrl, getProvider);
								updates[field.slug] = normalized ? JSON.stringify(normalized) : newUrl;
							} catch {
								updates[field.slug] = newUrl;
							}
							rowUpdated = true;
							rowUrlsRewritten++;
						}
					}
					if (rowUpdated) try {
						let query = db.updateTable(tableName).where("id", "=", row.id);
						for (const [key, value] of Object.entries(updates)) query = query.set({ [key]: value });
						await query.execute();
						result.updated++;
						result.urlsRewritten += rowUrlsRewritten;
						result.byCollection[collection.slug] = (result.byCollection[collection.slug] || 0) + 1;
						await markCollectionStale(collection.slug);
					} catch (updateError) {
						result.errors.push({
							collection: collection.slug,
							id: row.id,
							error: updateError instanceof Error ? updateError.message : "Update failed"
						});
					}
				}
			} catch (queryError) {
				result.errors.push({
					collection: collection.slug,
					id: "*",
					error: queryError instanceof Error ? queryError.message : "Query failed for collection"
				});
			}
		}
	} finally {
		for (const collectionSlug of staleMarkFailedCollections) {
			if (staleMarkedCollections.has(collectionSlug)) continue;
			if (await markUsageCollectionStale(db, collectionSlug, "CONTENT_USAGE_STALE")) staleMarkedCollections.add(collectionSlug);
		}
	}
	return result;
}
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/rewrite-urls@_@mjs
var page = () => rewrite_urls_exports;
//#endregion
export { page };
