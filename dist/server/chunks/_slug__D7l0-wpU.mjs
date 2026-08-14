import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { T as createAstro, _ as addAttribute, a as Fragment, d as renderTemplate, h as maybeRenderHead, i as renderComponent, t as spreadAttributes } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { a as $$Comments, i as $$CommentForm, n as $$EmDashImage, o as $$PortableText, r as $$WidgetArea, s as renderScript, t as $$Base } from "./Base_CtVAyT3t.mjs";
import { t as decodeSlug } from "./slugify-C_tqlU4G_CNEf4FGV.mjs";
import { t as getSiteSettings } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import { t as getSeoMeta } from "./dist_C4cexd-h.mjs";
import { l as getTermsForEntries } from "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { a as getEmDashEntry, i as getEmDashCollection } from "./query-DCiXI7OZ_B3DBnk_t.mjs";
import "./compiler_BPLn2J1w.mjs";
import { t as resolveBlogSiteIdentity } from "./site-identity_CAY1GlF8.mjs";
import { t as $$PostCard } from "./PostCard_BVJi460A.mjs";
import { t as getReadingTime } from "./reading-time_C2IH5OZr.mjs";
//#region src/pages/posts/[slug].astro
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
	const { entry: post, cacheHint } = await getEmDashEntry("posts", slug);
	if (!post) return Astro.redirect("/404");
	Astro.cache.set(cacheHint);
	function getImageUrl(img) {
		if (!img || typeof img !== "object") return void 0;
		const image = img;
		if (typeof image.src === "string" && image.src) return image.src.startsWith("http") ? image.src : `${Astro.url.origin}${image.src}`;
		const meta = image.meta;
		const storageKey = (typeof meta?.storageKey === "string" ? meta.storageKey : void 0) || (typeof image.id === "string" ? image.id : void 0);
		if (storageKey) return `${Astro.url.origin}/_emdash/api/media/file/${storageKey}`;
	}
	const featuredImageUrl = getImageUrl(post.data.featured_image);
	const { siteTitle } = resolveBlogSiteIdentity(await getSiteSettings());
	const seo = getSeoMeta(post, {
		siteTitle,
		siteUrl: Astro.url.origin,
		path: `/posts/${slug}`,
		defaultOgImage: featuredImageUrl
	});
	const bylines = post.data.bylines ?? [];
	const readingTime = getReadingTime(post.data.content);
	const tags = post.data.terms?.tag ?? [];
	const { entries: recentPosts } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
		limit: 4
	});
	const otherPosts = recentPosts.filter((p) => p.id !== post.id).slice(0, 3);
	const otherTagsByEntry = await getTermsForEntries("posts", otherPosts.map((p) => p.data.id), "tag");
	const otherPostsWithTags = otherPosts.map((p) => ({
		post: p,
		tags: otherTagsByEntry.get(p.data.id) ?? [],
		bylines: p.data.bylines ?? []
	}));
	const publishDate = post.data.publishedAt?.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) ?? null;
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": seo.title,
		"pageTitle": seo.ogTitle,
		"description": seo.description,
		"image": seo.ogImage,
		"canonical": seo.canonical,
		"robots": seo.robots,
		"type": "article",
		"publishedTime": post.data.publishedAt?.toISOString() ?? null,
		"modifiedTime": post.data.updatedAt.toISOString(),
		"content": {
			collection: "posts",
			id: post.data.id,
			slug
		},
		"data-astro-cid-ruv7hgo6": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<article class="article" data-astro-cid-ruv7hgo6>${post.data.featured_image && renderTemplate`<div class="article-hero"${spreadAttributes(post.edit.featured_image)} data-astro-cid-ruv7hgo6>${renderComponent($$result, "Image", $$EmDashImage, {
		"image": post.data.featured_image,
		"data-astro-cid-ruv7hgo6": true
	})}</div>`}<div class="article-grid" data-astro-cid-ruv7hgo6><aside class="article-meta-col" data-astro-cid-ruv7hgo6><div class="meta-sticky" data-astro-cid-ruv7hgo6>${bylines.length > 0 && renderTemplate`<div class="meta-block byline-block" data-astro-cid-ruv7hgo6><span class="meta-label" data-astro-cid-ruv7hgo6>${bylines.length === 1 ? "Author" : "Authors"}</span><div class="bylines" data-astro-cid-ruv7hgo6>${bylines.map((credit) => renderTemplate`<div class="byline" data-astro-cid-ruv7hgo6>${credit.byline.avatarMediaId && renderTemplate`<img${addAttribute(`/_emdash/api/media/file/${credit.byline.avatarMediaId}`, "src")}${addAttribute(credit.byline.displayName, "alt")} class="byline-avatar" data-astro-cid-ruv7hgo6>`}<div class="byline-info" data-astro-cid-ruv7hgo6><span class="byline-name" data-astro-cid-ruv7hgo6>${credit.byline.displayName}</span>${credit.roleLabel && renderTemplate`<span class="byline-role" data-astro-cid-ruv7hgo6>${credit.roleLabel}</span>`}</div></div>`)}</div></div>`}${publishDate && renderTemplate`<div class="meta-block" data-astro-cid-ruv7hgo6><span class="meta-label" data-astro-cid-ruv7hgo6>Published</span><time class="meta-value" data-astro-cid-ruv7hgo6>${publishDate}</time></div>`}<div class="meta-block" data-astro-cid-ruv7hgo6><span class="meta-label" data-astro-cid-ruv7hgo6>Reading time</span><span class="meta-value" data-astro-cid-ruv7hgo6>${readingTime} min</span></div>${tags.length > 0 && renderTemplate`<div class="meta-block" data-astro-cid-ruv7hgo6><span class="meta-label" data-astro-cid-ruv7hgo6>Tags</span><div class="meta-tags" data-astro-cid-ruv7hgo6>${tags.map((t) => renderTemplate`<a${addAttribute(`/tag/${t.slug}`, "href")} class="meta-tag" data-astro-cid-ruv7hgo6>${t.label}</a>`)}</div></div>`}</div></aside><div class="article-main" data-astro-cid-ruv7hgo6><header class="article-header" data-astro-cid-ruv7hgo6><div class="article-meta" data-astro-cid-ruv7hgo6>${bylines.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<span class="article-meta-byline" data-astro-cid-ruv7hgo6>${bylines.map((credit, i) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${i > 0 && ", "}${credit.byline.displayName}` })}`)}</span><span class="meta-dot" data-astro-cid-ruv7hgo6></span>` })}`}${publishDate && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<time data-astro-cid-ruv7hgo6>${publishDate}</time><span class="meta-dot" data-astro-cid-ruv7hgo6></span>` })}`}<span data-astro-cid-ruv7hgo6>${readingTime} min read</span></div><h1 class="article-title"${spreadAttributes(post.edit.title)} data-astro-cid-ruv7hgo6>${post.data.title}</h1>${post.data.excerpt && renderTemplate`<p class="article-excerpt"${spreadAttributes(post.edit.excerpt)} data-astro-cid-ruv7hgo6>${post.data.excerpt}</p>`}</header><div class="article-content" data-astro-cid-ruv7hgo6>${renderComponent($$result, "PortableText", $$PortableText, {
		"value": post.data.content,
		"data-astro-cid-ruv7hgo6": true
	})}</div><div class="article-comments" data-astro-cid-ruv7hgo6>${renderComponent($$result, "Comments", $$Comments, {
		"collection": "posts",
		"contentId": post.data.id,
		"threaded": true,
		"data-astro-cid-ruv7hgo6": true
	})}${renderComponent($$result, "CommentForm", $$CommentForm, {
		"collection": "posts",
		"contentId": post.data.id,
		"data-astro-cid-ruv7hgo6": true
	})}</div></div><aside class="article-sidebar" data-astro-cid-ruv7hgo6><div class="sidebar-sticky" data-astro-cid-ruv7hgo6><nav class="toc" aria-label="Table of contents" data-astro-cid-ruv7hgo6><h4 class="toc-title" data-astro-cid-ruv7hgo6>On this page</h4><div class="toc-content" id="toc-content" data-astro-cid-ruv7hgo6><!-- Populated by JS --></div></nav><div class="sidebar-widgets" data-astro-cid-ruv7hgo6>${renderComponent($$result, "WidgetArea", $$WidgetArea, {
		"name": "sidebar",
		"data-astro-cid-ruv7hgo6": true
	})}</div></div></aside></div></article>${otherPostsWithTags.length > 0 && renderTemplate`<section class="more-posts" data-astro-cid-ruv7hgo6><div class="more-inner" data-astro-cid-ruv7hgo6><h2 class="more-title" data-astro-cid-ruv7hgo6>Continue reading</h2><div class="more-grid" data-astro-cid-ruv7hgo6>${otherPostsWithTags.map(({ post: p, tags: postTags, bylines: postBylines }) => renderTemplate`${renderComponent($$result, "PostCard", $$PostCard, {
		"title": p.data.title,
		"excerpt": p.data.excerpt,
		"featuredImage": p.data.featured_image,
		"href": `/posts/${p.id}`,
		"date": p.data.publishedAt ?? void 0,
		"readingTime": getReadingTime(p.data.content),
		"tags": postTags.map((t) => ({
			slug: t.slug,
			label: t.label
		})),
		"bylines": postBylines,
		"data-astro-cid-ruv7hgo6": true
	})}`)}</div></div></section>`}${renderScript($$result, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/posts/[slug].astro?astro&type=script&index=0&lang.ts")}` })}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/posts/[slug].astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/posts/[slug].astro";
var $$url = "/posts/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/posts/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
