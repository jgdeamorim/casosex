//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/errors/errors-data.js
var ClientAddressNotAvailable = {
	name: "ClientAddressNotAvailable",
	title: "`Astro.clientAddress` is not available in current adapter.",
	message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
};
var PrerenderClientAddressNotAvailable = {
	name: "PrerenderClientAddressNotAvailable",
	title: "`Astro.clientAddress` cannot be used inside prerendered routes.",
	message: (name) => `\`Astro.clientAddress\` cannot be used inside prerendered route ${name}.`
};
var StaticClientAddressNotAvailable = {
	name: "StaticClientAddressNotAvailable",
	title: "`Astro.clientAddress` is not available in prerendered pages.",
	message: "`Astro.clientAddress` is only available on pages that are server-rendered.",
	hint: "See https://docs.astro.build/en/guides/on-demand-rendering/ for more information on how to enable SSR."
};
var NoMatchingStaticPathFound = {
	name: "NoMatchingStaticPathFound",
	title: "No static path found for requested path.",
	message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
	hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
};
var OnlyResponseCanBeReturned = {
	name: "OnlyResponseCanBeReturned",
	title: "Invalid type returned by Astro page.",
	message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
	hint: "See https://docs.astro.build/en/guides/on-demand-rendering/#response for more information."
};
var MissingMediaQueryDirective = {
	name: "MissingMediaQueryDirective",
	title: "Missing value for `client:media` directive.",
	message: "Media query not provided for `client:media` directive. A media query similar to `client:media=\"(max-width: 600px)\"` must be provided."
};
var NoMatchingRenderer = {
	name: "NoMatchingRenderer",
	title: "No matching renderer found.",
	message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
	hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`
};
var NoClientOnlyHint = {
	name: "NoClientOnlyHint",
	title: "Missing hint on client:only directive.",
	message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
	hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on \`client:only\`.`
};
var InvalidGetStaticPathsEntry = {
	name: "InvalidGetStaticPathsEntry",
	title: "Invalid entry inside `getStaticPaths()`'s return value.",
	message: (entryType) => `Invalid entry returned by \`getStaticPaths()\`. Expected an object, got \`${entryType}\`.`,
	hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
var InvalidGetStaticPathsReturn = {
	name: "InvalidGetStaticPathsReturn",
	title: "Invalid value returned by `getStaticPaths()`.",
	message: (returnType) => `Invalid type returned by \`getStaticPaths()\`. Expected an \`array\`, got \`${returnType}\`.`,
	hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
var GetStaticPathsExpectedParams = {
	name: "GetStaticPathsExpectedParams",
	title: "Missing params property on `getStaticPaths()` route.",
	message: "Missing or empty required `params` property on `getStaticPaths()` route.",
	hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
var GetStaticPathsInvalidRouteParam = {
	name: "GetStaticPathsInvalidRouteParam",
	title: "Invalid route parameter returned by `getStaticPaths()`.",
	message: (key, value, valueType) => `Invalid \`getStaticPaths()\` route parameter for \`${key}\`. Expected a string or undefined, received \`${valueType}\` (\`${value}\`).`,
	hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
};
var GetStaticPathsRequired = {
	name: "GetStaticPathsRequired",
	title: "`getStaticPaths()` function required for dynamic routes.",
	message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths()` function from your dynamic route.",
	hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

	If you meant for this route to be server-rendered, set \`export const prerender = false;\` in the page.`
};
var ReservedSlotName = {
	name: "ReservedSlotName",
	title: "Invalid slot name.",
	message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
};
var NoMatchingImport = {
	name: "NoMatchingImport",
	title: "No import found for component.",
	message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
	hint: "Please make sure the component is properly imported."
};
var InvalidComponentArgs = {
	name: "InvalidComponentArgs",
	title: "Invalid component arguments.",
	message: (name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`,
	hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
};
var PageNumberParamNotFound = {
	name: "PageNumberParamNotFound",
	title: "Page number param not found.",
	message: (paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`,
	hint: "Rename your file to `[page].astro` or `[...page].astro`."
};
var PrerenderDynamicEndpointPathCollide = {
	name: "PrerenderDynamicEndpointPathCollide",
	title: "Prerendered dynamic endpoint has path collision.",
	message: (pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`,
	hint: (filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m) => `.json` + m)}\``
};
var ResponseSentError = {
	name: "ResponseSentError",
	title: "Unable to set response.",
	message: "The response has already been sent to the browser and cannot be altered."
};
var MiddlewareNoDataOrNextCalled = {
	name: "MiddlewareNoDataOrNextCalled",
	title: "The middleware didn't return a `Response`.",
	message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
};
var MiddlewareNotAResponse = {
	name: "MiddlewareNotAResponse",
	title: "The middleware returned something that is not a `Response` object.",
	message: "Any data returned from middleware must be a valid `Response` object."
};
var EndpointDidNotReturnAResponse = {
	name: "EndpointDidNotReturnAResponse",
	title: "The endpoint did not return a `Response`.",
	message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
};
var LocalsNotAnObject = {
	name: "LocalsNotAnObject",
	title: "Value assigned to `locals` is not accepted.",
	message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
	hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
};
var LocalsReassigned = {
	name: "LocalsReassigned",
	title: "`locals` must not be reassigned.",
	message: "`locals` cannot be assigned directly.",
	hint: "Set a `locals` property instead."
};
var AstroResponseHeadersReassigned = {
	name: "AstroResponseHeadersReassigned",
	title: "`Astro.response.headers` must not be reassigned.",
	message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
	hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
};
var i18nNoLocaleFoundInPath = {
	name: "i18nNoLocaleFoundInPath",
	title: "The path doesn't contain any locale.",
	message: "You tried to use an i18n utility on a path that doesn't contain any locale. You can use `pathHasLocale` first to determine if the path has a locale."
};
var RewriteWithBodyUsed = {
	name: "RewriteWithBodyUsed",
	title: "Cannot use `Astro.rewrite()` after the request body has been read.",
	message: "`Astro.rewrite()` cannot be used if the request body has already been read. If you need to read the body, first clone the request."
};
var ForbiddenRewrite = {
	name: "ForbiddenRewrite",
	title: "Forbidden rewrite to a static route.",
	message: (from, to, component) => `You tried to rewrite the on-demand route '${from}' with the static route '${to}', when using the 'server' output. 

The static route '${to}' is rendered by the component
'${component}', which is marked as prerendered. This is a forbidden operation because during the build, the component '${component}' is compiled to an
HTML file, which can't be retrieved at runtime by Astro.`,
	hint: (component) => `Add \`export const prerender = false\` to the component '${component}', or use \`Astro.redirect()\`.`
};
var UnknownContentCollectionError = {
	name: "UnknownContentCollectionError",
	title: "Unknown content collection error."
};
var GetEntryDeprecationError = {
	name: "GetEntryDeprecationError",
	title: "Invalid use of `getDataEntryById` or `getEntryBySlug` function.",
	message: (collection, method) => `The \`${method}\` function is deprecated and cannot be used to query the "${collection}" collection. Use \`getEntry\` instead.`,
	hint: "See https://docs.astro.build/en/guides/upgrade-to/v6/#removed-legacy-content-collections for more information."
};
var LiveContentConfigError = {
	name: "LiveContentConfigError",
	title: "Error in live content config.",
	message: (error, filename) => `${error} Check your collection definitions in ${filename ?? "your live content config file"}.`,
	hint: "See https://docs.astro.build/en/reference/modules/astro-content/#definelivecollection for more information on defining live content collections."
};
var ActionsReturnedInvalidDataError = {
	name: "ActionsReturnedInvalidDataError",
	title: "Action handler returned invalid data.",
	message: (error) => `Action handler returned invalid data. Handlers should return serializable data types like objects, arrays, strings, and numbers. Parse error: ${error}`,
	hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
};
var ActionNotFoundError = {
	name: "ActionNotFoundError",
	title: "Action not found.",
	message: (actionName) => `The server received a request for an action named \`${actionName}\` but could not find a match. If you renamed an action, check that you've updated your \`actions/index\` file and your calling code to match.`,
	hint: "You can run `astro check` to detect type errors caused by mismatched action names."
};
var SessionStorageInitError = {
	name: "SessionStorageInitError",
	title: "Session storage could not be initialized.",
	message: (error, driver) => `Error when initializing session storage${driver ? ` with driver \`${driver}\`` : ""}. \`${error ?? ""}\``,
	hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
};
var SessionStorageSaveError = {
	name: "SessionStorageSaveError",
	title: "Session data could not be saved.",
	message: (error, driver) => `Error when saving session data${driver ? ` with driver \`${driver}\`` : ""}. \`${error ?? ""}\``,
	hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
};
var CacheNotEnabled = {
	name: "CacheNotEnabled",
	title: "Cache is not enabled.",
	message: "`Astro.cache` is not available because the cache feature is not enabled. To use caching, configure a cache provider in your Astro config under `cache`.",
	hint: "Use an adapter that provides a default cache provider, or set one explicitly: `cache: { provider: \"...\" }`. See https://docs.astro.build/en/guides/caching/."
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/errors/utils.js
function normalizeLF(code) {
	return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/errors/printer.js
function codeFrame(src, loc) {
	if (!loc || loc.line === void 0 || loc.column === void 0) return "";
	const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
	const visibleLines = [];
	for (let n = -2; n <= 2; n++) if (lines[loc.line + n]) visibleLines.push(loc.line + n);
	let gutterWidth = 0;
	for (const lineNo of visibleLines) {
		let w = `> ${lineNo}`;
		if (w.length > gutterWidth) gutterWidth = w.length;
	}
	let output = "";
	for (const lineNo of visibleLines) {
		const isFocusedLine = lineNo === loc.line - 1;
		output += isFocusedLine ? "> " : "  ";
		output += `${lineNo + 1} | ${lines[lineNo]}
`;
		if (isFocusedLine) output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({ length: loc.column }).join(" ")}^
`;
	}
	return output;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/errors/errors.js
var AstroError = class extends Error {
	loc;
	title;
	hint;
	frame;
	type = "AstroError";
	constructor(props, options) {
		const { name, title, message, stack, location, hint, frame } = props;
		super(message, options);
		this.title = title;
		this.name = name;
		if (message) this.message = message;
		this.stack = stack ? stack : this.stack;
		this.loc = location;
		this.hint = hint;
		this.frame = frame;
	}
	setLocation(location) {
		this.loc = location;
	}
	setName(name) {
		this.name = name;
	}
	setMessage(message) {
		this.message = message;
	}
	setHint(hint) {
		this.hint = hint;
	}
	setFrame(source, location) {
		this.frame = codeFrame(source, location);
	}
	static is(err) {
		return err?.type === "AstroError";
	}
};
//#endregion
export { ReservedSlotName as A, NoMatchingImport as C, PageNumberParamNotFound as D, OnlyResponseCanBeReturned as E, StaticClientAddressNotAvailable as F, UnknownContentCollectionError as I, i18nNoLocaleFoundInPath as L, RewriteWithBodyUsed as M, SessionStorageInitError as N, PrerenderClientAddressNotAvailable as O, SessionStorageSaveError as P, NoClientOnlyHint as S, NoMatchingStaticPathFound as T, LocalsNotAnObject as _, CacheNotEnabled as a, MiddlewareNotAResponse as b, ForbiddenRewrite as c, GetStaticPathsInvalidRouteParam as d, GetStaticPathsRequired as f, LiveContentConfigError as g, InvalidGetStaticPathsReturn as h, AstroResponseHeadersReassigned as i, ResponseSentError as j, PrerenderDynamicEndpointPathCollide as k, GetEntryDeprecationError as l, InvalidGetStaticPathsEntry as m, ActionNotFoundError as n, ClientAddressNotAvailable as o, InvalidComponentArgs as p, ActionsReturnedInvalidDataError as r, EndpointDidNotReturnAResponse as s, AstroError as t, GetStaticPathsExpectedParams as u, LocalsReassigned as v, NoMatchingRenderer as w, MissingMediaQueryDirective as x, MiddlewareNoDataOrNextCalled as y };
