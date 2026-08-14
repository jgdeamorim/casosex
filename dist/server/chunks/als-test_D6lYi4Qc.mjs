import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { d as renderTemplate, g as renderHead } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { n as getRequestContext } from "./request-context_K9BAblf6.mjs";
import "./compiler_BPLn2J1w.mjs";
//#region src/pages/als-test.astro
var als_test_exports = /* @__PURE__ */ __exportAll({
	default: () => $$AlsTest,
	file: () => $$file,
	url: () => $$url
});
var $$AlsTest = createComponent(($$result, $$props, $$slots) => {
	const ctx = getRequestContext();
	return renderTemplate`<html><head><title>ALS Test (Cloudflare)</title>${renderHead($$result)}</head><body><h1>ALS Request Context Test</h1><pre id="result">${JSON.stringify({
		hasContext: ctx !== void 0,
		editMode: ctx?.editMode ?? false,
		preview: ctx?.preview ?? null
	}, null, 2)}</pre></body></html>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/als-test.astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/als-test.astro";
var $$url = "/als-test";
//#endregion
//#region \0virtual:astro:page:src/pages/als-test@_@astro
var page = () => als_test_exports;
//#endregion
export { page };
