import { T as LiveContentConfigError, t as AstroError } from "./errors_CPRp8csy.mjs";
var CONTENT_IMAGE_FLAG = "astroContentImageFlag";
var DATA_STORE_VIRTUAL_ID = "astro:data-layer-content";
var IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
var LIVE_CONTENT_TYPE = "live";
`${DATA_STORE_VIRTUAL_ID}`;
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/content/config.js
function getImporterFilename() {
	const stackLine = (/* @__PURE__ */ new Error()).stack?.split("\n").find((line) => !line.includes("defineCollection") && !line.includes("defineLiveCollection") && !line.includes("getImporterFilename") && !line.startsWith("Error"));
	if (!stackLine) return;
	return /\/((?:src|chunks)\/.*?):\d+:\d+/.exec(stackLine)?.[1] ?? void 0;
}
function defineLiveCollection(config) {
	const importerFilename = getImporterFilename();
	if (importerFilename && !importerFilename.includes("live.config")) throw new AstroError({
		...LiveContentConfigError,
		message: LiveContentConfigError.message("Live collections must be defined in a `src/live.config.ts` file.", importerFilename ?? "your content config file")
	});
	config.type ??= LIVE_CONTENT_TYPE;
	if (config.type !== "live") throw new AstroError({
		...LiveContentConfigError,
		message: LiveContentConfigError.message("Collections in a live config file must have a type of `live`.", importerFilename)
	});
	if (!config.loader) throw new AstroError({
		...LiveContentConfigError,
		message: LiveContentConfigError.message("Live collections must have a `loader` defined.", importerFilename)
	});
	if (!config.loader.loadCollection || !config.loader.loadEntry) throw new AstroError({
		...LiveContentConfigError,
		message: LiveContentConfigError.message("Live collection loaders must have `loadCollection()` and `loadEntry()` methods. Please check that you are not using a loader intended for build-time collections", importerFilename)
	});
	if (typeof config.schema === "function") throw new AstroError({
		...LiveContentConfigError,
		message: LiveContentConfigError.message("The schema cannot be a function for live collections. Please use a schema object instead.", importerFilename)
	});
	return config;
}
//#endregion
export { CONTENT_IMAGE_FLAG as n, IMAGE_IMPORT_PREFIX as r, defineLiveCollection as t };
