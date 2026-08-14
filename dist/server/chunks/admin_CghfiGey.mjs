import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, g as renderHead, i as renderComponent } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { i as $$Font } from "./_astro_assets_D5FWpGHA.mjs";
import "./compiler_BPLn2J1w.mjs";
import { n as getSiteSettingsWithDb } from "./settings_NGFIUACf.mjs";
import "react";
import "react/jsx-runtime";
//#region self-essentials/emdash-main/packages/admin/dist/styles.css?url
var styles_default = "/_astro/styles.12WQW1au.css";
//#endregion
//#region self-essentials/emdash-main/packages/admin/dist/LocaleDirectionProvider-5U1vW9Op.js
var LOCALES = [
	{
		code: "en",
		label: "English",
		enabled: true
	},
	{
		code: "ar",
		label: "العربية",
		enabled: true,
		dir: "rtl"
	},
	{
		code: "eu",
		label: "Euskara",
		enabled: true
	},
	{
		code: "ca",
		label: "Català",
		enabled: true
	},
	{
		code: "zh-CN",
		label: "简体中文",
		enabled: true
	},
	{
		code: "zh-TW",
		label: "繁體中文",
		enabled: true
	},
	{
		code: "nl",
		label: "Nederlands",
		enabled: true
	},
	{
		code: "en-GB",
		label: "English (UK)",
		enabled: true
	},
	{
		code: "fa",
		label: "فارسی",
		enabled: true,
		dir: "rtl"
	},
	{
		code: "fr",
		label: "Français",
		enabled: true
	},
	{
		code: "de",
		label: "Deutsch",
		enabled: true
	},
	{
		code: "hu",
		label: "Magyar",
		enabled: true
	},
	{
		code: "id",
		label: "Bahasa Indonesia",
		enabled: true
	},
	{
		code: "ja",
		label: "日本語",
		enabled: true
	},
	{
		code: "ko",
		label: "한국어",
		enabled: false
	},
	{
		code: "nb",
		label: "Norsk bokmål",
		enabled: true
	},
	{
		code: "pl",
		label: "Polski",
		enabled: true
	},
	{
		code: "pt-BR",
		label: "Português (Brasil)",
		enabled: true
	},
	{
		code: "sr-Latn",
		label: "Srpski",
		enabled: true
	},
	{
		code: "es-419",
		label: "Español (Latinoamérica)",
		enabled: true
	},
	{
		code: "es-ES",
		label: "Español (España)",
		enabled: true
	},
	{
		code: "sv",
		label: "Svenska",
		enabled: true
	},
	{
		code: "th",
		label: "ไทย",
		enabled: true
	},
	{
		code: "tr",
		label: "Türkçe",
		enabled: true
	},
	{
		code: "uk",
		label: "Українська",
		enabled: true
	},
	{
		code: "pseudo",
		label: "Pseudo",
		enabled: false
	}
];
var SOURCE_LOCALE = LOCALES[0];
LOCALES.map((l) => l.code);
LOCALES.slice(1);
var ENABLED_LOCALES = LOCALES.filter((l) => l.enabled);
function isValidLocale(code) {
	try {
		return new Intl.Locale(code).baseName !== "";
	} catch {
		return false;
	}
}
var SUPPORTED_LOCALES = [...ENABLED_LOCALES.filter((l) => isValidLocale(l.code)), ...[]];
var SUPPORTED_LOCALE_CODES = new Set(SUPPORTED_LOCALES.map((l) => l.code));
var DEFAULT_LOCALE = SOURCE_LOCALE.code;
var BASE_LANGUAGE_MAP = /* @__PURE__ */ new Map();
var SCRIPT_LANGUAGE_MAP = /* @__PURE__ */ new Map();
for (const l of SUPPORTED_LOCALES) {
	const base = l.code.split("-")[0].toLowerCase();
	if (!BASE_LANGUAGE_MAP.has(base)) BASE_LANGUAGE_MAP.set(base, l.code);
	const maximized = new Intl.Locale(l.code).maximize();
	if (maximized.script) {
		const scriptKey = `${maximized.language}-${maximized.script}`.toLowerCase();
		if (!SCRIPT_LANGUAGE_MAP.has(scriptKey)) SCRIPT_LANGUAGE_MAP.set(scriptKey, l.code);
	}
}
function matchLocale(tag) {
	const trimmed = tag.trim();
	if (!trimmed) return void 0;
	let canonical;
	try {
		canonical = new Intl.Locale(trimmed).baseName;
	} catch {
		return;
	}
	if (SUPPORTED_LOCALE_CODES.has(canonical)) return canonical;
	const locale = new Intl.Locale(trimmed);
	if (locale.script) {
		const scriptKey = `${locale.language}-${locale.script}`.toLowerCase();
		const scriptMatch = SCRIPT_LANGUAGE_MAP.get(scriptKey);
		if (scriptMatch) return scriptMatch;
	}
	const base = canonical.split("-")[0].toLowerCase();
	return BASE_LANGUAGE_MAP.get(base);
}
new Map(SUPPORTED_LOCALES.map((l) => [l.code, l.label]));
var LOCALE_DIRS = new Map(SUPPORTED_LOCALES.map((l) => [l.code, l.dir]));
function getLocaleDir(code) {
	return LOCALE_DIRS.get(code) ?? "ltr";
}
var LOCALE_COOKIE_RE = /(?:^|;\s*)emdash-locale=([^;]+)/;
function resolveLocale(request) {
	const cookieLocale = (request.headers.get("cookie") ?? "").match(LOCALE_COOKIE_RE)?.[1]?.trim() ?? "";
	if (SUPPORTED_LOCALE_CODES.has(cookieLocale)) return cookieLocale;
	const acceptLang = request.headers.get("accept-language") ?? "";
	for (const entry of acceptLang.split(",")) {
		const matched = matchLocale(entry.split(";")[0].trim());
		if (matched) return matched;
	}
	return DEFAULT_LOCALE;
}
var LOCALE_LOADERS = /* @__PURE__ */ Object.assign({
	"./ar/messages.mjs": () => import("./messages-D0s7hcHS_B1Z-4wC9.mjs"),
	"./ca/messages.mjs": () => import("./messages-jmWwv5I9_BDR1zk6e.mjs"),
	"./de/messages.mjs": () => import("./messages-z8DCjl2v_BsWZvU9y.mjs"),
	"./en/messages.mjs": () => import("./messages-DhWQ6ntN_DGridRP_.mjs"),
	"./en-GB/messages.mjs": () => import("./messages-D1x_ybt3_Bii2Er0P.mjs"),
	"./es-419/messages.mjs": () => import("./messages-TIxLB_zK_z_S_mfLV.mjs"),
	"./es-ES/messages.mjs": () => import("./messages-C8wqmrr8_BCctci-p.mjs"),
	"./eu/messages.mjs": () => import("./messages-C4H363zG_BDiZuGRN.mjs"),
	"./fa/messages.mjs": () => import("./messages-n5KSdGIR_BtyD21Qi.mjs"),
	"./fr/messages.mjs": () => import("./messages-DN4lsll0_4-rkjo4d.mjs"),
	"./hu/messages.mjs": () => import("./messages-BclRCIJA_XHpVKPDs.mjs"),
	"./id/messages.mjs": () => import("./messages-DK0nSPWb_CLads3dO.mjs"),
	"./ja/messages.mjs": () => import("./messages-C1ze9eQE_CUXnGr8q.mjs"),
	"./ko/messages.mjs": () => import("./messages-C_GxB5z5_Cx1slDWz.mjs"),
	"./nb/messages.mjs": () => import("./messages-qZU4N886_DjyOc2WV.mjs"),
	"./nl/messages.mjs": () => import("./messages-DGwx2Tk0_Hpa5_hDp.mjs"),
	"./pl/messages.mjs": () => import("./messages-CyfnTXoj_odeCyYQX.mjs"),
	"./pseudo/messages.mjs": () => import("./messages-4Xvqxc1Y_BqHR7Nkv.mjs"),
	"./pt-BR/messages.mjs": () => import("./messages-BEM_otIY_DzSuBbEZ.mjs"),
	"./sr-Latn/messages.mjs": () => import("./messages-CM58Ca_k_cs5QnTb5.mjs"),
	"./sv/messages.mjs": () => import("./messages-CIJnESHn_C8AE-UQU.mjs"),
	"./th/messages.mjs": () => import("./messages-C6OGaloG_BbM0GiIr.mjs"),
	"./tr/messages.mjs": () => import("./messages-BGMVnYg4_CicPvWUb.mjs"),
	"./uk/messages.mjs": () => import("./messages-CA8wH0UZ_DEeOd7CM.mjs"),
	"./zh-CN/messages.mjs": () => import("./messages-DbGMdPqR_0QAlqI3x.mjs"),
	"./zh-TW/messages.mjs": () => import("./messages-DTFf1KbO_BoJh9tJC.mjs")
});
async function loadMessages(locale) {
	const key = `./${locale}/messages.mjs`;
	const fallbackKey = `./${DEFAULT_LOCALE}/messages.mjs`;
	const loader = LOCALE_LOADERS[key] ?? LOCALE_LOADERS[fallbackKey];
	if (!loader) throw new Error(`No locale catalog found for "${locale}" or "${DEFAULT_LOCALE}". Run \`pnpm locale:compile\` to generate catalogs.`);
	const { messages } = await loader();
	return messages;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/astro/routes/admin.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Admin,
	file: () => $$file,
	prerender: () => false,
	url: () => void 0
});
createAstro("https://astro.build");
var $$Admin = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Admin;
	const resolvedLocale = resolveLocale(Astro.request);
	const resolvedDir = getLocaleDir(resolvedLocale);
	const messages = await loadMessages(resolvedLocale);
	const adminConfig = Astro.locals.emdash?.config?.admin;
	const pageTitle = adminConfig?.siteName ? `${adminConfig.siteName} Admin` : "EmDash Admin";
	Astro.response.headers.set("Cache-Control", "private, no-store");
	const emdash = Astro.locals.emdash;
	let siteFavicon;
	let siteFaviconType;
	if (!adminConfig?.favicon && emdash?.db) try {
		const settings = await getSiteSettingsWithDb(emdash.db, emdash.storage ?? null);
		siteFavicon = settings.favicon?.url ?? void 0;
		siteFaviconType = settings.favicon?.contentType ?? void 0;
	} catch {}
	const favicon = adminConfig?.favicon ?? siteFavicon;
	const faviconType = adminConfig?.favicon ? void 0 : siteFaviconType;
	return renderTemplate`<html${addAttribute(resolvedLocale, "lang")}${addAttribute(resolvedDir, "dir")} data-theme="classic" data-astro-cid-ewgvstfs><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script>
			(() => {
				let preference = "system";

				try {
					const storedPreference = localStorage.getItem("emdash-theme");
					if (storedPreference === "light" || storedPreference === "dark") {
						preference = storedPreference;
					}
				} catch {
					// Storage can be unavailable in privacy-restricted contexts. Use the system theme.
				}

				const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				const mode =
					preference === "dark" || (preference === "system" && prefersDark) ? "dark" : "light";
				document.documentElement.setAttribute("data-mode", mode);
			})();
		<\/script><link rel="stylesheet"${addAttribute(styles_default, "href")}>${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-emdash",
		"data-astro-cid-ewgvstfs": true
	})}${favicon ? renderTemplate`<link rel="icon"${addAttribute(favicon, "href")}${addAttribute(faviconType, "type")}>` : renderTemplate`<link rel="icon" href="data:image/svg+xml,&lt;svg width='75' height='75' viewBox='0 0 75 75' fill='none' xmlns='http://www.w3.org/2000/svg'&gt; &lt;g clip-path='url(%23clip0_50_99)'&gt; &lt;rect x='3' y='3' width='69' height='69' rx='10.518' stroke='url(%23paint0_linear_50_99)' stroke-width='6'/&gt; &lt;rect x='18' y='34' width='39.3661' height='6.56101' fill='url(%23paint1_linear_50_99)'/&gt; &lt;/g&gt; &lt;defs&gt; &lt;linearGradient id='paint0_linear_50_99' x1='-42.9996' y1='124' x2='92.4233' y2='-41.7456' gradientUnits='userSpaceOnUse'&gt; &lt;stop stop-color='%230F006B'/&gt; &lt;stop offset='0.0833333' stop-color='%23281A81'/&gt; &lt;stop offset='0.166667' stop-color='%235D0C83'/&gt; &lt;stop offset='0.25' stop-color='%23911475'/&gt; &lt;stop offset='0.333333' stop-color='%23CE2F55'/&gt; &lt;stop offset='0.416667' stop-color='%23FF6633'/&gt; &lt;stop offset='0.5' stop-color='%23F6821F'/&gt; &lt;stop offset='0.583333' stop-color='%23FBAD41'/&gt; &lt;stop offset='0.666667' stop-color='%23FFCD89'/&gt; &lt;stop offset='0.75' stop-color='%23FFE9CB'/&gt; &lt;stop offset='0.833333' stop-color='%23FFF7EC'/&gt; &lt;stop offset='0.916667' stop-color='%23FFF8EE'/&gt; &lt;stop offset='1' stop-color='white'/&gt; &lt;/linearGradient&gt; &lt;linearGradient id='paint1_linear_50_99' x1='91.4992' y1='27.4982' x2='28.1217' y2='54.1775' gradientUnits='userSpaceOnUse'&gt; &lt;stop stop-color='white'/&gt; &lt;stop offset='0.129253' stop-color='%23FFF8EE'/&gt; &lt;stop offset='0.617058' stop-color='%23FBAD41'/&gt; &lt;stop offset='0.848019' stop-color='%23F6821F'/&gt; &lt;stop offset='1' stop-color='%23FF6633'/&gt; &lt;/linearGradient&gt; &lt;clipPath id='clip0_50_99'&gt; &lt;rect width='75' height='75' fill='white'/&gt; &lt;/clipPath&gt; &lt;/defs&gt; &lt;/svg&gt;">`}<title>${pageTitle}</title>${renderHead($$result)}</head><body class="isolate" data-astro-cid-ewgvstfs><div id="admin-root" class="min-h-screen" data-astro-cid-ewgvstfs><div id="emdash-boot-loader" data-astro-cid-ewgvstfs><div class="loader-inner" data-astro-cid-ewgvstfs><div class="spinner" data-astro-cid-ewgvstfs></div><p data-astro-cid-ewgvstfs>${adminConfig?.siteName ? `Loading ${adminConfig.siteName}...` : "Loading EmDash..."}</p></div></div>${renderComponent($$result, "AdminWrapper", null, {
		"client:only": "react",
		"locale": resolvedLocale,
		"messages": messages,
		"adminBranding": {
			logo: adminConfig?.logo,
			siteName: adminConfig?.siteName
		},
		"data-astro-cid-ewgvstfs": true,
		"client:component-hydration": "only",
		"client:component-path": "emdash/routes/PluginRegistry",
		"client:component-export": "default"
	})}</div></body></html>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/astro/routes/admin.astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/astro/routes/admin.astro";
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/src/astro/routes/admin@_@astro
var page = () => admin_exports;
//#endregion
export { page };
