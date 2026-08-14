import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { o as getI18nConfig, s as isI18nEnabled } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { n as getSiteSettingsWithDb } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import { n as localizePath, t as interpolateUrlPattern } from "./resolve-BUvFE0Lr_D5TgB8zY.mjs";
import { t as handleSitemapData } from "./seo-C3GDfT0V_CjA1ZkDg.mjs";
import { t as buildSeoImageUrl } from "./media-url-BCm5vBn6_i6P7Yse3.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap-_collection_.xml.mjs
var sitemap__collection__xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var TRAILING_SLASH_RE = /\/$/;
var AMP_RE = /&/g;
var LT_RE = /</g;
var GT_RE = />/g;
var QUOT_RE = /"/g;
var APOS_RE = /'/g;
var GET = async ({ params, locals, url }) => {
	const { emdash } = locals;
	const collectionSlug = params.collection;
	if (!emdash?.db || !collectionSlug) return new Response("<!-- EmDash not configured -->", {
		status: 500,
		headers: { "Content-Type": "application/xml" }
	});
	try {
		const siteUrl = ((await getSiteSettingsWithDb(emdash.db)).url || getPublicOrigin(url, emdash?.config)).replace(TRAILING_SLASH_RE, "");
		const result = await handleSitemapData(emdash.db, collectionSlug);
		if (!result.success || !result.data) return new Response("<!-- Failed to generate sitemap -->", {
			status: 500,
			headers: { "Content-Type": "application/xml" }
		});
		const col = result.data.collections[0];
		if (!col) return new Response("<!-- Collection not found or empty -->", {
			status: 404,
			headers: { "Content-Type": "application/xml" }
		});
		const i18nEnabled = isI18nEnabled();
		const i18nConfig = getI18nConfig();
		const groups = /* @__PURE__ */ new Map();
		const ungrouped = [];
		for (const entry of col.entries) if (i18nEnabled && entry.translationGroup) {
			const list = groups.get(entry.translationGroup);
			if (list) list.push(entry);
			else groups.set(entry.translationGroup, [entry]);
		} else ungrouped.push(entry);
		const urlByEntry = /* @__PURE__ */ new Map();
		const resolveEntryUrl = async (entry) => {
			if (urlByEntry.has(entry.id)) return urlByEntry.get(entry.id) ?? null;
			const localized = await localizePath(interpolateUrlPattern({
				pattern: col.urlPattern,
				collection: col.collection,
				slug: entry.slug || entry.id,
				id: entry.id
			}), entry.locale);
			const absolute = localized === null ? null : `${siteUrl}${localized}`;
			urlByEntry.set(entry.id, absolute);
			return absolute;
		};
		const useXhtml = i18nEnabled;
		const lines = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>"];
		lines.push(useXhtml ? "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">" : "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">");
		const writeUrl = async (entry, siblings) => {
			const loc = await resolveEntryUrl(entry);
			if (loc === null) return;
			lines.push("  <url>");
			lines.push(`    <loc>${escapeXml(loc)}</loc>`);
			lines.push(`    <lastmod>${escapeXml(entry.updatedAt)}</lastmod>`);
			if (entry.image) {
				const imageLoc = buildSeoImageUrl(entry.image, siteUrl);
				lines.push("    <image:image>");
				lines.push(`      <image:loc>${escapeXml(imageLoc)}</image:loc>`);
				lines.push("    </image:image>");
			}
			const alternateEntries = siblings ?? (useXhtml ? [entry] : null);
			if (useXhtml && alternateEntries) {
				for (const sib of alternateEntries) {
					const sibLoc = await resolveEntryUrl(sib);
					if (sibLoc === null) continue;
					lines.push(`    <xhtml:link rel="alternate" hreflang="${escapeXml(sib.locale)}" href="${escapeXml(sibLoc)}" />`);
				}
				const defaultSibling = i18nConfig && alternateEntries.find((s) => s.locale === i18nConfig.defaultLocale);
				let xDefaultLoc = null;
				if (defaultSibling) xDefaultLoc = await resolveEntryUrl(defaultSibling);
				if (xDefaultLoc === null) for (const sib of alternateEntries) {
					const sibLoc = await resolveEntryUrl(sib);
					if (sibLoc !== null) {
						xDefaultLoc = sibLoc;
						break;
					}
				}
				if (xDefaultLoc !== null) lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefaultLoc)}" />`);
			}
			lines.push("  </url>");
		};
		for (const siblings of groups.values()) for (const entry of siblings) await writeUrl(entry, siblings);
		for (const entry of ungrouped) await writeUrl(entry, null);
		lines.push("</urlset>");
		return new Response(lines.join("\n"), {
			status: 200,
			headers: {
				"Content-Type": "application/xml; charset=utf-8",
				"Cache-Control": "public, max-age=3600"
			}
		});
	} catch {
		return new Response("<!-- Internal error generating sitemap -->", {
			status: 500,
			headers: { "Content-Type": "application/xml" }
		});
	}
};
/** Escape special XML characters in a string */
function escapeXml(str) {
	return str.replace(AMP_RE, "&amp;").replace(LT_RE, "&lt;").replace(GT_RE, "&gt;").replace(QUOT_RE, "&quot;").replace(APOS_RE, "&apos;");
}
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap-_collection_.xml@_@mjs
var page = () => sitemap__collection__xml_exports;
//#endregion
export { page };
