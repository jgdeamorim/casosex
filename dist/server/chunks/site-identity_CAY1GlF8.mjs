//#region src/utils/site-identity.ts
var DEFAULT_SITE_TITLE = "My Blog";
var DEFAULT_SITE_TAGLINE = "Thoughts, stories, and ideas.";
function resolveBlogSiteIdentity(settings) {
	return {
		siteTitle: settings?.title ?? DEFAULT_SITE_TITLE,
		siteTagline: settings?.tagline ?? DEFAULT_SITE_TAGLINE,
		siteLogo: settings?.logo?.url ? settings.logo : null
	};
}
//#endregion
export { resolveBlogSiteIdentity as t };
