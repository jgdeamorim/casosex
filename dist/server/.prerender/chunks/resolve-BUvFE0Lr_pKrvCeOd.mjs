import { a as getFallbackChain, o as getI18nConfig, s as isI18nEnabled } from "./runner-BsI18UgP_CTLRmh7U.mjs";
import { n as getRequestContext } from "./request-context_K9BAblf6.mjs";
//#region self-essentials/emdash-main/packages/core/dist/resolve-BUvFE0Lr.mjs
/**
* Shared locale-resolution helpers.
*
* Matches the pattern used by `query.ts` for content: an explicit locale wins,
* otherwise we fall back to the request-context locale, otherwise to
* `defaultLocale` when i18n is enabled, otherwise to `undefined` (meaning "do
* not filter by locale" — legacy single-locale behaviour).
*/
/**
* Resolve the locale to use for a query given an optional explicit value.
* Returns `undefined` when no locale information is available; callers should
* treat that as "do not filter by locale".
*/
function resolveLocale(explicit) {
	if (explicit !== void 0) return explicit;
	const ctxLocale = getRequestContext()?.locale;
	if (ctxLocale !== void 0) return ctxLocale;
	const cfg = getI18nConfig();
	if (cfg && isI18nEnabled()) return cfg.defaultLocale;
}
/**
* Fallback chain to try when looking up a single item. When i18n is disabled
* or the locale is unspecified, returns a single-element array (or empty when
* no locale resolves) so callers can iterate uniformly.
*/
function resolveLocaleChain(explicit) {
	const locale = resolveLocale(explicit);
	if (locale === void 0) return [];
	if (!isI18nEnabled()) return [locale];
	return getFallbackChain(locale);
}
//#endregion
export { resolveLocaleChain as n, resolveLocale as t };
