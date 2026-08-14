import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { n as getSiteSettingsWithDb } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import { t as handleSitemapData } from "./seo-C3GDfT0V_CjA1ZkDg.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap.xml.mjs
var sitemap_xml_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var TRAILING_SLASH_RE = /\/$/;
var AMP_RE = /&/g;
var LT_RE = /</g;
var GT_RE = />/g;
var QUOT_RE = /"/g;
var APOS_RE = /'/g;
var GET = async ({ locals, url }) => {
	const { emdash } = locals;
	if (!emdash?.db) return new Response("<!-- EmDash not configured -->", {
		status: 500,
		headers: { "Content-Type": "application/xml" }
	});
	try {
		const siteUrl = ((await getSiteSettingsWithDb(emdash.db)).url || getPublicOrigin(url, emdash?.config)).replace(TRAILING_SLASH_RE, "");
		const result = await handleSitemapData(emdash.db);
		if (!result.success || !result.data) return new Response("<!-- Failed to generate sitemap -->", {
			status: 500,
			headers: { "Content-Type": "application/xml" }
		});
		const { collections } = result.data;
		const lines = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"];
		for (const col of collections) {
			const loc = `${siteUrl}/sitemap-${encodeURIComponent(col.collection)}.xml`;
			lines.push("  <sitemap>");
			lines.push(`    <loc>${escapeXml(loc)}</loc>`);
			lines.push(`    <lastmod>${escapeXml(col.lastmod)}</lastmod>`);
			lines.push("  </sitemap>");
		}
		lines.push("</sitemapindex>");
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
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap.xml@_@mjs
var page = () => sitemap_xml_exports;
//#endregion
export { page };
