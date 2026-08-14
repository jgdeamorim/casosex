//#region self-essentials/emdash-main/packages/core/dist/media-url-BCm5vBn6.mjs
/**
* Resolve a stored SEO image reference to a URL.
*
* The CMS SEO panel stores `seo_image` in one of these shapes:
* - an absolute URL (`https://...`) — returned as-is;
* - a root-relative path that already includes the media API prefix
*   (`/_emdash/api/media/file/01KS....webp`) — prefixed with `siteUrl`;
* - a bare media id (`01KS...`) — expanded to the media API path, then
*   prefixed with `siteUrl`.
*
* Shared by the SEO meta builder (`og:image`) and the sitemap route
* (`<image:image>`) so both resolve image references identically.
*/
var TRAILING_SLASH_RE = /\/$/;
var ABSOLUTE_URL_RE = /^https?:\/\//i;
function buildSeoImageUrl(imageRef, siteUrl) {
	if (ABSOLUTE_URL_RE.test(imageRef)) return imageRef;
	if (imageRef.startsWith("/")) return siteUrl ? `${siteUrl.replace(TRAILING_SLASH_RE, "")}${imageRef}` : imageRef;
	const mediaPath = `/_emdash/api/media/file/${imageRef}`;
	return siteUrl ? `${siteUrl.replace(TRAILING_SLASH_RE, "")}${mediaPath}` : mediaPath;
}
//#endregion
export { buildSeoImageUrl as t };
