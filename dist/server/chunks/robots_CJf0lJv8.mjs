import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { n as getSiteSettingsWithDb } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/robots.txt.mjs
var robots_txt_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var TRAILING_SLASH_RE = /\/$/;
var GET = async ({ locals, url }) => {
	const { emdash } = locals;
	if (!emdash?.db) return new Response("User-agent: *\nAllow: /\n", {
		status: 200,
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
	try {
		const settings = await getSiteSettingsWithDb(emdash.db);
		const sitemapUrl = `${(settings.url || getPublicOrigin(url, emdash?.config)).replace(TRAILING_SLASH_RE, "")}/sitemap.xml`;
		if (settings.seo?.robotsTxt) {
			let content = settings.seo.robotsTxt;
			if (!content.toLowerCase().includes("sitemap:")) content = `${content.trimEnd()}\n\nSitemap: ${sitemapUrl}\n`;
			return new Response(content, {
				status: 200,
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					"Cache-Control": "public, max-age=86400"
				}
			});
		}
		const defaultRobots = [
			"User-agent: *",
			"Allow: /",
			"",
			"# Disallow admin and API routes",
			"Disallow: /_emdash/",
			"",
			`Sitemap: ${sitemapUrl}`,
			""
		].join("\n");
		return new Response(defaultRobots, {
			status: 200,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "public, max-age=86400"
			}
		});
	} catch {
		return new Response("User-agent: *\nAllow: /\n", {
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/robots.txt@_@mjs
var page = () => robots_txt_exports;
//#endregion
export { page };
