import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { T as createAstro, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { t as $$Base } from "./Base_CtVAyT3t.mjs";
import { t as decodeSlug } from "./slugify-C_tqlU4G_CNEf4FGV.mjs";
import "./dist_C4cexd-h.mjs";
import { c as getTerm, l as getTermsForEntries } from "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { i as getEmDashCollection } from "./query-DCiXI7OZ_B3DBnk_t.mjs";
import "./compiler_BPLn2J1w.mjs";
import { t as $$PostCard } from "./PostCard_BVJi460A.mjs";
import { t as getReadingTime } from "./reading-time_C2IH5OZr.mjs";
//#region src/pages/tag/[slug].astro
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
	const term = slug ? await getTerm("tag", slug) : null;
	if (!term) return Astro.redirect("/404");
	const { entries: posts, cacheHint } = await getEmDashCollection("posts", {
		where: { tag: term.slug },
		orderBy: { published_at: "desc" }
	});
	Astro.cache.set(cacheHint);
	const tagsByEntry = await getTermsForEntries("posts", posts.map((p) => p.data.id), "tag");
	const filteredPosts = posts.map((post) => ({
		post,
		tags: tagsByEntry.get(post.data.id) ?? []
	}));
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": `Posts tagged "${term.label}"`,
		"description": `All posts tagged with ${term.label}`,
		"data-astro-cid-ln763jns": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="archive-section" data-astro-cid-ln763jns><header class="archive-header" data-astro-cid-ln763jns><span class="archive-label" data-astro-cid-ln763jns>Tag</span><h1 class="archive-title" data-astro-cid-ln763jns>${term.label}</h1><p class="archive-count" data-astro-cid-ln763jns>${filteredPosts.length}${filteredPosts.length === 1 ? "post" : "posts"}</p></header>${filteredPosts.length === 0 ? renderTemplate`<p class="no-posts" data-astro-cid-ln763jns>No posts with this tag yet.</p>` : renderTemplate`<div class="posts-grid" data-astro-cid-ln763jns>${filteredPosts.map(({ post, tags }) => renderTemplate`${renderComponent($$result, "PostCard", $$PostCard, {
		"title": post.data.title,
		"excerpt": post.data.excerpt,
		"featuredImage": post.data.featured_image,
		"href": `/posts/${post.id}`,
		"date": post.data.publishedAt ?? void 0,
		"readingTime": getReadingTime(post.data.content),
		"tags": tags.map((t) => ({
			slug: t.slug,
			label: t.label
		})),
		"data-astro-cid-ln763jns": true
	})}`)}</div>`}</section>` })}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/tag/[slug].astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/tag/[slug].astro";
var $$url = "/tag/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/tag/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
