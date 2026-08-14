import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { t as getSiteSettings } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./dist_C4cexd-h.mjs";
import { i as getEmDashCollection } from "./query-DCiXI7OZ_B3DBnk_t.mjs";
import { t as resolveBlogSiteIdentity } from "./site-identity_CAY1GlF8.mjs";
//#region src/pages/rss.xml.ts
var rss_xml_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ site, url }) => {
	const siteUrl = site?.toString() || url.origin;
	const { siteTitle, siteTagline } = resolveBlogSiteIdentity(await getSiteSettings());
	const { entries: posts } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
		limit: 20
	});
	const items = posts.map((post) => {
		if (!post.data.publishedAt) return null;
		const pubDate = post.data.publishedAt.toUTCString();
		const postUrl = `${siteUrl}/posts/${post.id}`;
		return `    <item>
      <title>${escapeXml(post.data.title || "Untitled")}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.data.excerpt || "")}</description>
    </item>`;
	}).filter(Boolean).join("\n");
	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteTagline)}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
	return new Response(rss, { headers: {
		"Content-Type": "application/rss+xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600"
	} });
};
var XML_ESCAPE_PATTERNS = [
	[/&/g, "&amp;"],
	[/</g, "&lt;"],
	[/>/g, "&gt;"],
	[/"/g, "&quot;"],
	[/'/g, "&apos;"]
];
function escapeXml(str) {
	let result = str;
	for (const [pattern, replacement] of XML_ESCAPE_PATTERNS) result = result.replace(pattern, replacement);
	return result;
}
//#endregion
//#region \0virtual:astro:page:src/pages/rss.xml@_@ts
var page = () => rss_xml_exports;
//#endregion
export { page };
