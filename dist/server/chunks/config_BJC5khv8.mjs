//#region self-essentials/emdash-main/packages/core/src/utils/db-errors.ts
/**
* Shared detection helpers for database-layer error messages.
*
* Different SQL dialects phrase "table or relation does not exist" differently:
*
* - SQLite / D1:    "no such table: foo"
* - PostgreSQL:     'relation "foo" does not exist'
*                   'table "foo" does not exist'
* - MySQL (future): "Table 'db.foo' doesn't exist"
*
* Runtime code paths that short-circuit on missing tables (pre-migration
* probes, optional feature tables, etc.) should use these helpers rather
* than hand-rolling string matches per call-site.
*/
/**
* Extract a lowercase error message from any unknown value, safely.
*/
function messageOf(error) {
	if (error instanceof Error) return error.message.toLowerCase();
	if (typeof error === "string") return error.toLowerCase();
	return "";
}
/**
* Returns true when `error` is a "table does not exist" error across the
* dialects EmDash supports (D1/SQLite and PostgreSQL). Used by runtime
* probes to treat pre-migration databases as empty without logging a scary
* warning, while still propagating unrelated errors (permissions, connection
* loss, syntax issues) to callers.
*/
function isMissingTableError(error) {
	const message = messageOf(error);
	if (!message) return false;
	if (message.includes("no such table")) return true;
	if (message.includes("does not exist") || message.includes("doesn't exist")) return message.includes("relation") || message.includes("table");
	return false;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/i18n/config.ts
var I18N_CONFIG_KEY = Symbol.for("emdash:i18n-config");
function configStore() {
	return globalThis;
}
/**
* Get the current i18n config.
* Returns null if i18n is not configured.
*/
function getI18nConfig() {
	return configStore()[I18N_CONFIG_KEY] ?? null;
}
/**
* Check if i18n is enabled.
* Returns true when multiple locales are configured.
*/
function isI18nEnabled() {
	const config = getI18nConfig();
	return config != null && config.locales.length > 1;
}
/**
* Resolve fallback locale chain for a given locale.
* Returns array of locales to try, from most preferred to least.
* Always ends with defaultLocale.
*/
function getFallbackChain(locale) {
	const config = getI18nConfig();
	if (!config) return [locale];
	const chain = [locale];
	let current = locale;
	const visited = /* @__PURE__ */ new Set([locale]);
	while (config.fallback?.[current]) {
		const next = config.fallback[current];
		if (visited.has(next)) break;
		chain.push(next);
		visited.add(next);
		current = next;
	}
	if (!visited.has(config.defaultLocale)) chain.push(config.defaultLocale);
	return chain;
}
//#endregion
export { isMissingTableError as i, getI18nConfig as n, isI18nEnabled as r, getFallbackChain as t };
