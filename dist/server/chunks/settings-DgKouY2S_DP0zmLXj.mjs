import { t as after } from "./after-B1IIdH3Y_D2PBgJNO.mjs";
import { l as invalidateObjectCache, n as cachedQuery } from "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { t as MediaRepository } from "./media-tQDZEdu7_D9hYcuMC.mjs";
import { r as requestCached } from "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import { a as getDb } from "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { n as invalidateSingleFlightCache, r as singleFlightCached, t as createSingleFlightCache } from "./single-flight-cache-C2exrGAi_CN0gTUoV.mjs";
//#region self-essentials/emdash-main/packages/core/dist/settings-DgKouY2S.mjs
/** Object-cache namespace for site settings. */
var SETTINGS_CACHE_NAMESPACE = "settings";
/** Prefix for site settings in the options table */
var SETTINGS_PREFIX = "site:";
/**
* Worker-isolate cache for the resolved `site:*` settings.
*
* Site settings (title, logo, SEO defaults) change rarely but are read on
* every public request. Caching across the isolate's lifetime drops the
* `options WHERE name LIKE 'site:%'` prefix scan from once-per-request to
* once-per-isolate. Cross-isolate staleness is bounded by isolate lifetime
* (workerd typically recycles within minutes); acceptable for chrome.
*
* Backed by single-flight-cache.ts: concurrent cold reads coalesce onto one
* query via a reclaimable single-flight lock and the resolved *value* is
* cached — never a shared in-flight promise, so a cancelled request can't
* poison the isolate (see that file's header). Stored on globalThis with a
* Symbol.for key so Vite SSR chunk duplication doesn't produce two
* independent caches (same pattern as request-context.ts).
*/
var SITE_SETTINGS_CACHE_KEY = Symbol.for("emdash:site-settings");
var g = globalThis;
var settingsCache = g[SITE_SETTINGS_CACHE_KEY] ?? (() => {
	const c = createSingleFlightCache();
	g[SITE_SETTINGS_CACHE_KEY] = c;
	return c;
})();
/**
* Bump the isolate-wide site-settings cache version, forcing the next
* `getSiteSettings()` to re-query the database.
*
* Called from every `site:*` write path. Other isolates still serve their
* own cached copy until they expire — staleness bounded by isolate lifetime.
*/
function invalidateSiteSettingsCache() {
	invalidateSingleFlightCache(settingsCache);
	invalidateObjectCache(SETTINGS_CACHE_NAMESPACE);
}
/**
* Resolve a media reference to include the full URL plus content metadata.
*
* Pulls `mimeType` and intrinsic dimensions from the media row so callers
* can emit correct head tags (e.g. `<link rel="icon" type="image/svg+xml">`,
* which Chromium requires when the URL has no `.svg` extension) without
* a second round-trip to the media table.
*/
async function resolveMediaReference(mediaRef, db, _storage) {
	if (!mediaRef?.mediaId) return mediaRef;
	try {
		const media = await new MediaRepository(db).findById(mediaRef.mediaId);
		if (media) return {
			...mediaRef,
			url: `/_emdash/api/media/file/${media.storageKey}`,
			contentType: media.mimeType,
			...media.width !== null ? { width: media.width } : {},
			...media.height !== null ? { height: media.height } : {}
		};
	} catch {}
	return mediaRef;
}
/**
* Get all site settings
*
* Returns all configured settings. Unset values are undefined.
* Media references (logo/favicon) are resolved to include URLs.
*
* @example
* ```ts
* import { getSiteSettings } from "emdash";
*
* const settings = await getSiteSettings();
* console.log(settings.title); // "My Site"
* console.log(settings.logo?.url); // "/_emdash/api/media/file/abc123"
* ```
*/
function getSiteSettings() {
	return requestCached("siteSettings", () => singleFlightCached(settingsCache, () => cachedQuery({
		namespace: SETTINGS_CACHE_NAMESPACE,
		key: "all",
		load: async () => {
			return getSiteSettingsWithDb(await getDb());
		}
	}), {
		anchor: (promise) => after(() => promise),
		ownerTimeoutMs: 3e4
	}));
}
/**
* Get all site settings (with explicit db)
*
* @internal Use `getSiteSettings()` in templates. This variant is for admin routes
* that already have a database handle.
*/
async function getSiteSettingsWithDb(db, storage = null) {
	const allOptions = await new OptionsRepository(db).getByPrefix(SETTINGS_PREFIX);
	const settings = {};
	for (const [key, value] of allOptions) {
		const settingKey = key.replace(SETTINGS_PREFIX, "");
		settings[settingKey] = value;
	}
	const typedSettings = settings;
	if (typedSettings.logo) typedSettings.logo = await resolveMediaReference(typedSettings.logo, db, storage);
	if (typedSettings.favicon) typedSettings.favicon = await resolveMediaReference(typedSettings.favicon, db, storage);
	if (typedSettings.seo?.defaultOgImage) typedSettings.seo = {
		...typedSettings.seo,
		defaultOgImage: await resolveMediaReference(typedSettings.seo.defaultOgImage, db, storage)
	};
	return typedSettings;
}
/**
* Set site settings (internal function used by admin API)
*
* Merges provided settings with existing ones. Only provided fields are updated.
* Media references should include just the mediaId; URLs are resolved on read.
*
* @param settings - Partial settings object with values to update
* @param db - Kysely database instance
* @returns Promise that resolves when settings are saved
*
* @internal
*
* @example
* ```ts
* // Update multiple settings at once
* await setSiteSettings({
*   title: "My Site",
*   tagline: "Welcome",
*   logo: { mediaId: "med_123", alt: "Logo" }
* }, db);
* ```
*/
async function setSiteSettings(settings, db) {
	const options = new OptionsRepository(db);
	const updates = {};
	for (const [key, value] of Object.entries(settings)) if (value !== void 0) updates[`${SETTINGS_PREFIX}${key}`] = value;
	try {
		await options.setMany(updates);
	} finally {
		invalidateSiteSettingsCache();
	}
}
//#endregion
export { setSiteSettings as i, getSiteSettingsWithDb as n, invalidateSiteSettingsCache as r, getSiteSettings as t };
