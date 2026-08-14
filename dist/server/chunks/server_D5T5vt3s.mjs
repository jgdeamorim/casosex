import { t as manifest } from "./_virtual_astro_manifest_BgSUBQDV.mjs";
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/common.js
var PREFIX_DEFAULT_LOCALE = /* @__PURE__ */ new Set([
	"pathname-prefix-always",
	"domains-prefix-always",
	"pathname-prefix-always-no-redirect",
	"domains-prefix-always-no-redirect"
]);
var REDIRECT_TO_DEFAULT_LOCALE = /* @__PURE__ */ new Set(["pathname-prefix-always-no-redirect", "domains-prefix-always-no-redirect"]);
function fromRoutingStrategy(strategy, fallbackType) {
	let routing;
	if (strategy === "manual") routing = "manual";
	else routing = {
		prefixDefaultLocale: PREFIX_DEFAULT_LOCALE.has(strategy),
		redirectToDefaultLocale: !REDIRECT_TO_DEFAULT_LOCALE.has(strategy),
		fallbackType
	};
	return routing;
}
//#endregion
//#region \0astro:config/server
var i18n = void 0;
if (manifest.i18n) i18n = {
	defaultLocale: manifest.i18n.defaultLocale,
	locales: manifest.i18n.locales,
	routing: fromRoutingStrategy(manifest.i18n.strategy, manifest.i18n.fallbackType),
	fallback: manifest.i18n.fallback,
	domains: manifest.i18n.domains
};
if (manifest.image) manifest.image.objectFit, manifest.image.objectPosition, manifest.image.layout;
manifest.base;
new URL(manifest.buildServerDir), new URL(manifest.buildClientDir), manifest.buildFormat, manifest.assetsPrefix;
new URL(manifest.cacheDir);
new URL(manifest.outDir);
new URL(manifest.publicDir);
new URL(manifest.srcDir);
new URL(manifest.rootDir);
manifest.trailingSlash;
manifest.site;
manifest.compressHTML;
//#endregion
export { i18n };
