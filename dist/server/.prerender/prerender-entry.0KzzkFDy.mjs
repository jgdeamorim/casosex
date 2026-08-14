import { J as slash, U as joinPaths, W as prependForwardSlash, z as fileExtension } from "./chunks/server_BUyfTiNz.mjs";
import { i as DefaultErrorHandler, n as createConsoleLogger, r as BaseApp, t as manifest } from "./chunks/_virtual_astro_manifest_DVJU1gAk.mjs";
import { C as getFallbackRoute, E as routeIsRedirect, T as routeIsFallback, a as createDefaultRoutes, f as findRouteToRewrite, l as RedirectSinglePageBuiltModule, n as Pipeline } from "./chunks/base-pipeline_BVoR9b4s.mjs";
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/utils/getAssetsPrefix.js
function getAssetsPrefix(fileExtension, assetsPrefix) {
	let prefix = "";
	if (!assetsPrefix) prefix = "";
	else if (typeof assetsPrefix === "string") prefix = assetsPrefix;
	else prefix = assetsPrefix[fileExtension.slice(1)] || assetsPrefix.fallback;
	return prefix;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/render/ssr-element.js
var URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
	const parsed = new URL(path, URL_PARSE_BASE);
	return {
		pathname: !URL.canParse(path) && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname,
		suffix: `${parsed.search}${parsed.hash}`
	};
}
function appendQueryParams(path, queryParams) {
	const queryString = queryParams.toString();
	if (!queryString) return path;
	const hashIndex = path.indexOf("#");
	const basePath = hashIndex === -1 ? path : path.slice(0, hashIndex);
	const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
	return `${basePath}${basePath.includes("?") ? "&" : "?"}${queryString}${hash}`;
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
	const { pathname, suffix } = splitAssetPath(href);
	let url = "";
	if (assetsPrefix) {
		const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
		url = joinPaths(pf, slash(pathname)) + suffix;
	} else if (base) url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
	else url = href;
	if (queryParams) url = appendQueryParams(url, queryParams);
	return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
	if (stylesheet.type === "inline") return {
		props: {},
		children: stylesheet.content
	};
	else return {
		props: {
			rel: "stylesheet",
			href: createAssetLink(stylesheet.src, base, assetsPrefix, queryParams)
		},
		children: ""
	};
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
	return new Set(stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix, queryParams)));
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/vite-plugin-pages/const.js
var VIRTUAL_PAGE_RESOLVED_MODULE_ID = "\0virtual:astro:page:";
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/vite-plugin-pages/util.js
var ASTRO_PAGE_EXTENSION_POST_PATTERN = "@_@";
function getVirtualModulePageName(virtualModulePrefix, path) {
	const extension = fileExtension(path);
	return virtualModulePrefix + (extension.startsWith(".") ? path.slice(0, -extension.length) + extension.replace(".", ASTRO_PAGE_EXTENSION_POST_PATTERN) : path);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/vite-plugin-scripts/index.js
var SCRIPT_ID_PREFIX = `astro:scripts/`;
var BEFORE_HYDRATION_SCRIPT_ID = `${SCRIPT_ID_PREFIX}before-hydration.js`;
var PAGE_SCRIPT_ID = `${SCRIPT_ID_PREFIX}page.js`;
`${SCRIPT_ID_PREFIX}`;
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/build/plugins/util.js
var ASTRO_PAGE_KEY_SEPARATOR = "&";
function makePageDataKey(route, componentPath) {
	return route + ASTRO_PAGE_KEY_SEPARATOR + componentPath;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/build/runtime.js
function getPageData(internals, route, component) {
	let pageData = internals.pagesByKeys.get(makePageDataKey(route, component));
	if (pageData) return pageData;
}
function cssOrder(a, b) {
	let depthA = a.depth, depthB = b.depth, orderA = a.order, orderB = b.order;
	if (orderA === -1 && orderB >= 0) return 1;
	else if (orderB === -1 && orderA >= 0) return -1;
	else if (orderA > orderB) return 1;
	else if (orderA < orderB) return -1;
	else if (depthA === -1) return -1;
	else if (depthB === -1) return 1;
	else return depthA > depthB ? -1 : 1;
}
function mergeInlineCss(acc, current) {
	const lastAdded = acc.at(acc.length - 1);
	const lastWasInline = lastAdded?.type === "inline";
	const currentIsInline = current?.type === "inline";
	if (lastWasInline && currentIsInline) {
		const currentHasImport = current.content.includes("@import");
		const lastHasImport = lastAdded.content.includes("@import");
		if (!currentHasImport && !lastHasImport) {
			const merged = {
				type: "inline",
				content: lastAdded.content + current.content
			};
			acc[acc.length - 1] = merged;
			return acc;
		}
	}
	acc.push(current);
	return acc;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/build/pipeline.js
var BuildPipeline = class BuildPipeline extends Pipeline {
	internals;
	options;
	manifest;
	defaultRoutes;
	getName() {
		return "BuildPipeline";
	}
	/**
	* This cache is needed to map a single `RouteData` to its file path.
	* @private
	*/
	#routesByFilePath = /* @__PURE__ */ new WeakMap();
	getSettings() {
		if (!this.options) throw new Error("No options defined");
		return this.options.settings;
	}
	getOptions() {
		if (!this.options) throw new Error("No options defined");
		return this.options;
	}
	getInternals() {
		if (!this.internals) throw new Error("No internals defined");
		return this.internals;
	}
	constructor(manifest, defaultRoutes = createDefaultRoutes(manifest)) {
		const resolveCache = /* @__PURE__ */ new Map();
		async function resolve(specifier) {
			if (resolveCache.has(specifier)) return resolveCache.get(specifier);
			const hashedFilePath = manifest.entryModules[specifier];
			if (typeof hashedFilePath !== "string" || hashedFilePath === "") {
				if (specifier === BEFORE_HYDRATION_SCRIPT_ID) {
					resolveCache.set(specifier, "");
					return "";
				}
				throw new Error(`Cannot find the built path for ${specifier}`);
			}
			const assetLink = createAssetLink(hashedFilePath, manifest.base, manifest.assetsPrefix);
			resolveCache.set(specifier, assetLink);
			return assetLink;
		}
		const logger = createConsoleLogger({ level: manifest.logLevel });
		super(logger, manifest, "production", manifest.renderers, resolve, manifest.serverLike);
		this.manifest = manifest;
		this.defaultRoutes = defaultRoutes;
	}
	getRoutes() {
		return this.getOptions().routesList.routes;
	}
	static create({ manifest }) {
		return new BuildPipeline(manifest);
	}
	setInternals(internals) {
		this.internals = internals;
	}
	setOptions(options) {
		this.options = options;
	}
	headElements(routeData) {
		const { manifest: { assetsPrefix, base } } = this;
		const settings = this.getSettings();
		const internals = this.getInternals();
		const links = /* @__PURE__ */ new Set();
		const pageBuildData = getPageData(internals, routeData.route, routeData.component);
		const scripts = /* @__PURE__ */ new Set();
		const sortedCssAssets = pageBuildData?.styles.sort(cssOrder).map(({ sheet }) => sheet).reduce(mergeInlineCss, []);
		const styles = createStylesheetElementSet(sortedCssAssets ?? [], base, assetsPrefix);
		if (settings.scripts.some((script) => script.stage === "page")) {
			const hashedFilePath = internals.entrySpecifierToBundleMap.get(PAGE_SCRIPT_ID);
			if (typeof hashedFilePath !== "string") throw new Error(`Cannot find the built path for ${PAGE_SCRIPT_ID}`);
			const src = createAssetLink(hashedFilePath, base, assetsPrefix);
			scripts.add({
				props: {
					type: "module",
					src
				},
				children: ""
			});
		}
		for (const script of settings.scripts) if (script.stage === "head-inline") scripts.add({
			props: {},
			children: script.content
		});
		return {
			scripts,
			styles,
			links
		};
	}
	componentMetadata() {}
	/**
	* It collects the routes to generate during the build.
	* It returns a map of page information and their relative entry point as a string.
	*/
	retrieveRoutesToGenerate() {
		const pages = /* @__PURE__ */ new Set();
		const defaultRouteComponents = new Set(this.defaultRoutes.map((route) => route.component));
		for (const { routeData } of this.manifest.routes) {
			if (routeIsRedirect(routeData)) {
				pages.add(routeData);
				continue;
			}
			if (routeIsFallback(routeData) && i18nHasFallback(this.manifest)) {
				pages.add(routeData);
				continue;
			}
			if (defaultRouteComponents.has(routeData.component)) continue;
			pages.add(routeData);
			const moduleSpecifier = getVirtualModulePageName(VIRTUAL_PAGE_RESOLVED_MODULE_ID, routeData.component);
			const filePath = this.internals?.entrySpecifierToBundleMap.get(moduleSpecifier);
			if (filePath) this.#routesByFilePath.set(routeData, filePath);
		}
		return pages;
	}
	async getComponentByRoute(routeData) {
		return (await this.getModuleForRoute(routeData)).page();
	}
	async getModuleForRoute(route) {
		for (const defaultRoute of this.defaultRoutes) if (route.component === defaultRoute.component) return { page: () => Promise.resolve(defaultRoute.instance) };
		let routeToProcess = route;
		if (routeIsRedirect(route)) {
			if (route.redirectRoute) routeToProcess = route.redirectRoute;
			else return RedirectSinglePageBuiltModule;
		} else if (routeIsFallback(route)) routeToProcess = getFallbackRoute(route, this.manifest.routes);
		if (this.manifest.pageMap) {
			const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
			if (!importComponentInstance) throw new Error(`Unexpectedly unable to find a component instance for route ${route.route}`);
			return await importComponentInstance();
		} else if (this.manifest.pageModule) return this.manifest.pageModule;
		throw new Error("Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue.");
	}
	async tryRewrite(payload, request) {
		const { routeData, pathname, newUrl } = findRouteToRewrite({
			payload,
			request,
			routes: this.manifest.routes.map((routeInfo) => routeInfo.routeData),
			trailingSlash: this.manifest.trailingSlash,
			buildFormat: this.manifest.buildFormat,
			base: this.manifest.base,
			outDir: this.manifest.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
		});
		return {
			routeData,
			componentInstance: await this.getComponentByRoute(routeData),
			newUrl,
			pathname
		};
	}
};
function i18nHasFallback(manifest) {
	if (manifest.i18n && manifest.i18n.fallback) return Object.keys(manifest.i18n.fallback).length > 0;
	return false;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/errors/build-handler.js
var BuildErrorHandler = class {
	#default;
	constructor(app) {
		this.#default = new DefaultErrorHandler(app);
	}
	async renderError(request, options) {
		if (options.status === 500) {
			if (options.response) return options.response;
			throw options.error;
		}
		return this.#default.renderError(request, {
			...options,
			prerenderedErrorPageFetch: void 0
		});
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/build/app.js
var BuildApp = class extends BaseApp {
	createPipeline(_streaming, manifest, ..._args) {
		return BuildPipeline.create({ manifest });
	}
	isDev() {
		return true;
	}
	setInternals(internals) {
		this.pipeline.setInternals(internals);
	}
	setOptions(options) {
		this.pipeline.setOptions(options);
		this.logger.setDestination(options.logger.options.destination);
		this.resetAdapterLogger();
	}
	getOptions() {
		return this.pipeline.getOptions();
	}
	getSettings() {
		return this.pipeline.getSettings();
	}
	createErrorHandler() {
		return new BuildErrorHandler(this);
	}
	logRequest(_options) {}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/entrypoints/prerender.js
var app = new BuildApp(manifest);
//#endregion
export { app, manifest };
