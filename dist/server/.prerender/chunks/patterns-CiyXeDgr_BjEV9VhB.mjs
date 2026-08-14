//#region self-essentials/emdash-main/packages/core/dist/patterns-CiyXeDgr.mjs
/**
* URL pattern matching for redirects.
*
* Uses Astro's route syntax: [param] for named segments, [...rest] for catch-all.
* Compiles patterns to safe regexes -- no user-supplied regex, no ReDoS risk.
*
* @example
* ```ts
* const compiled = compilePattern("/old-blog/[...path]");
* const match = matchPattern(compiled, "/old-blog/2024/01/post");
* // match = { path: "2024/01/post" }
*
* interpolateDestination("/blog/[...path]", match);
* // "/blog/2024/01/post"
* ```
*/
/** Matches [paramName] placeholders */
var PARAM_PATTERN = /\[(\w+)\]/g;
/** Matches [...splatName] placeholders */
var SPLAT_PATTERN = /\[\.\.\.(\w+)\]/g;
/** Combined pattern for validation: matches both [param] and [...splat] */
var ANY_PLACEHOLDER = /\[(?:\.\.\.)?(\w+)\]/g;
/** Split on capture groups in compiled regex string */
var CAPTURE_GROUP_SPLIT = /(\([^)]+\))/;
/** Escape regex-special characters in literal parts */
var REGEX_SPECIAL_CHARS = /[.*+?^${}|\\]/g;
/**
* Returns true if a source string contains [param] or [...splat] placeholders.
*/
function isPattern(source) {
	return source.match(ANY_PLACEHOLDER) !== null;
}
/**
* Compile a URL pattern into a regex for matching.
*
* - `[param]` matches a single path segment (`[^/]+`)
* - `[...rest]` matches one or more remaining segments (`.+`)
*/
function compilePattern(source) {
	const paramNames = [];
	let regexStr = source.replace(SPLAT_PATTERN, (_match, name) => {
		paramNames.push(name);
		return "(.+)";
	});
	regexStr = regexStr.replace(PARAM_PATTERN, (_match, name) => {
		paramNames.push(name);
		return "([^/]+)";
	});
	const escaped = regexStr.split(CAPTURE_GROUP_SPLIT).map((part, i) => {
		if (i % 2 === 1) return part;
		return part.replace(REGEX_SPECIAL_CHARS, "\\$&");
	}).join("");
	return {
		regex: new RegExp(`^${escaped}$`),
		paramNames,
		source
	};
}
/**
* Match a path against a compiled pattern.
* Returns captured params or null if no match.
*/
function matchPattern(compiled, path) {
	const match = path.match(compiled.regex);
	if (!match) return null;
	const params = {};
	for (let i = 0; i < compiled.paramNames.length; i++) {
		const value = match[i + 1];
		if (value !== void 0) params[compiled.paramNames[i]] = value;
	}
	return params;
}
/**
* Interpolate captured params into a destination pattern.
*
* @example
* interpolateDestination("/blog/[...path]", { path: "2024/01/post" })
* // "/blog/2024/01/post"
*/
function interpolateDestination(destination, params) {
	let result = destination.replace(SPLAT_PATTERN, (_match, name) => {
		return params[name] ?? "";
	});
	result = result.replace(PARAM_PATTERN, (_match, name) => {
		return params[name] ?? "";
	});
	return result;
}
//#endregion
export { matchPattern as i, interpolateDestination as n, isPattern as r, compilePattern as t };
