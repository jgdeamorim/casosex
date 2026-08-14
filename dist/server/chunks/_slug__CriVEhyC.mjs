import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { T as createAstro, d as renderTemplate, h as maybeRenderHead, i as renderComponent, t as spreadAttributes } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { o as $$PortableText, t as $$Base } from "./Base_CtVAyT3t.mjs";
import { t as decodeSlug } from "./slugify-C_tqlU4G_CNEf4FGV.mjs";
import "./dist_C4cexd-h.mjs";
import { a as getEmDashEntry } from "./query-DCiXI7OZ_B3DBnk_t.mjs";
import "./compiler_BPLn2J1w.mjs";
//#region src/pages/pages/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const slug = decodeSlug(Astro.params.slug);
	if (!slug) return Astro.redirect("/404");
	const { entry: page, cacheHint } = await getEmDashEntry("pages", slug);
	if (!page) return Astro.redirect("/404");
	Astro.cache.set(cacheHint);
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": page.data.title,
		"content": {
			collection: "pages",
			id: page.data.id,
			slug
		},
		"data-astro-cid-h25gr2g4": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<article class="page-article" data-astro-cid-h25gr2g4><header class="page-header" data-astro-cid-h25gr2g4><h1 class="page-title"${spreadAttributes(page.edit.title)} data-astro-cid-h25gr2g4>${page.data.title}</h1></header><div class="page-content" data-astro-cid-h25gr2g4>${renderComponent($$result, "PortableText", $$PortableText, {
		"value": page.data.content,
		"data-astro-cid-h25gr2g4": true
	})}</div></article>` })}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/pages/[slug].astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/pages/[slug].astro";
var $$url = "/pages/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/pages/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
