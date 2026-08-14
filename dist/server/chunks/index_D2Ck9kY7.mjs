import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { T as createAstro, _ as addAttribute, a as Fragment, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { n as $$EmDashImage, t as $$Base } from "./Base_CtVAyT3t.mjs";
import { t as getSiteSettings } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./dist_C4cexd-h.mjs";
import { l as getTermsForEntries } from "./taxonomies-B61CRSha_D_3qZCRf.mjs";
import { i as getEmDashCollection } from "./query-DCiXI7OZ_B3DBnk_t.mjs";
import "./compiler_BPLn2J1w.mjs";
import { t as resolveBlogSiteIdentity } from "./site-identity_CAY1GlF8.mjs";
import { t as $$PostCard } from "./PostCard_BVJi460A.mjs";
import { t as getReadingTime } from "./reading-time_C2IH5OZr.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const POSTS_PER_PAGE = 7;
	const [{ entries: posts, cacheHint }, settings] = await Promise.all([getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
		limit: 8
	}), getSiteSettings()]);
	const { siteTitle, siteTagline } = resolveBlogSiteIdentity(settings);
	Astro.cache.set(cacheHint);
	const visiblePosts = posts.slice(0, POSTS_PER_PAGE);
	const hasMorePosts = posts.length > POSTS_PER_PAGE;
	const featuredPost = visiblePosts.find((p) => p.data.featured_image);
	const featuredIndex = featuredPost ? visiblePosts.indexOf(featuredPost) : -1;
	const gridPosts = visiblePosts.filter((_, i) => i !== featuredIndex).slice(0, 6);
	const tagEntryIds = [...featuredPost ? [featuredPost.data.id] : [], ...gridPosts.map((p) => p.data.id)];
	const tagsByEntry = await getTermsForEntries("posts", tagEntryIds, "tag");
	const featuredTags = featuredPost ? (tagsByEntry.get(featuredPost.data.id) ?? []).map((t) => ({
		slug: t.slug,
		label: t.label
	})) : [];
	const featuredBylines = featuredPost?.data.bylines ?? [];
	const gridPostsWithTags = gridPosts.map((post) => ({
		post,
		tags: (tagsByEntry.get(post.data.id) ?? []).map((t) => ({
			slug: t.slug,
			label: t.label
		})),
		bylines: post.data.bylines ?? []
	}));
	function formatDate(date) {
		if (!date) return null;
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": siteTitle,
		"description": siteTagline,
		"data-astro-cid-lcdefpme": true
	}, { "default": ($$result) => renderTemplate`${posts.length === 0 ? renderTemplate`${maybeRenderHead($$result)}<section class="empty-state" data-astro-cid-lcdefpme><h2 data-astro-cid-lcdefpme>No posts yet</h2><p data-astro-cid-lcdefpme>Create your first post in the admin panel.</p><a href="/_emdash/admin/content/posts/new" class="btn" data-astro-cid-lcdefpme>Create a post</a></section>` : renderTemplate`<div class="home-content" data-astro-cid-lcdefpme>${featuredPost && renderTemplate`<section class="featured-section" data-astro-cid-lcdefpme><div class="featured-grid" data-astro-cid-lcdefpme><a${addAttribute(`/posts/${featuredPost.id}`, "href")} class="featured-image-link" data-astro-cid-lcdefpme><div class="featured-image" data-astro-cid-lcdefpme>${renderComponent($$result, "Image", $$EmDashImage, {
		"image": featuredPost.data.featured_image,
		"data-astro-cid-lcdefpme": true
	})}</div></a><div class="featured-content" data-astro-cid-lcdefpme><div class="featured-meta" data-astro-cid-lcdefpme>${featuredBylines.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="featured-bylines" data-astro-cid-lcdefpme>${featuredBylines.slice(0, 2).map((credit, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${index > 0 && renderTemplate`<span class="byline-sep" data-astro-cid-lcdefpme>,</span>`}<span class="featured-byline" data-astro-cid-lcdefpme>${credit.byline.avatarMediaId && renderTemplate`<img${addAttribute(`/_emdash/api/media/file/${credit.byline.avatarMediaId}`, "src")}${addAttribute(credit.byline.displayName, "alt")} class="featured-byline-avatar" data-astro-cid-lcdefpme>`}<span class="featured-byline-name" data-astro-cid-lcdefpme>${credit.byline.displayName}</span></span>` })}`)}${featuredBylines.length > 2 && renderTemplate`<span class="byline-more" data-astro-cid-lcdefpme>+${featuredBylines.length - 2}</span>`}</div><span class="meta-dot" data-astro-cid-lcdefpme></span>` })}`}${formatDate(featuredPost.data.publishedAt) && renderTemplate`<time data-astro-cid-lcdefpme>${formatDate(featuredPost.data.publishedAt)}</time>`}<span class="meta-dot" data-astro-cid-lcdefpme></span><span data-astro-cid-lcdefpme>${getReadingTime(featuredPost.data.content)} min read</span></div><a${addAttribute(`/posts/${featuredPost.id}`, "href")} class="featured-title-link" data-astro-cid-lcdefpme><h1 class="featured-title" data-astro-cid-lcdefpme>${featuredPost.data.title}</h1></a>${featuredPost.data.excerpt && renderTemplate`<p class="featured-excerpt" data-astro-cid-lcdefpme>${featuredPost.data.excerpt}</p>`}${featuredTags.length > 0 && renderTemplate`<div class="featured-tags" data-astro-cid-lcdefpme>${featuredTags.map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag.slug}`, "href")} class="featured-tag" data-astro-cid-lcdefpme>${tag.label}</a>`)}</div>`}</div></div></section>`}${gridPostsWithTags.length > 0 && renderTemplate`<section class="posts-section" data-astro-cid-lcdefpme><header class="section-header" data-astro-cid-lcdefpme><h2 class="section-title" data-astro-cid-lcdefpme>Latest</h2>${hasMorePosts && renderTemplate`<a href="/posts" class="section-link" data-astro-cid-lcdefpme>View all</a>`}</header><div class="posts-grid" data-astro-cid-lcdefpme>${gridPostsWithTags.map(({ post, tags, bylines }) => renderTemplate`${renderComponent($$result, "PostCard", $$PostCard, {
		"title": post.data.title ?? "Untitled",
		"excerpt": post.data.excerpt,
		"featuredImage": post.data.featured_image,
		"href": `/posts/${post.id}`,
		"date": post.data.publishedAt ?? void 0,
		"readingTime": getReadingTime(post.data.content),
		"tags": tags,
		"bylines": bylines,
		"data-astro-cid-lcdefpme": true
	})}`)}</div></section>`}</div>`}` })}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/index.astro", void 0);
var $$file = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
