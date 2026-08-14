import { T as createAstro, _ as addAttribute, a as Fragment, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { n as $$EmDashImage } from "./Base_CtVAyT3t.mjs";
import "./compiler_BPLn2J1w.mjs";
//#region src/components/PostCard.astro
createAstro("https://astro.build");
var $$PostCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PostCard;
	const { title, excerpt, featuredImage, href, date, readingTime, tags, bylines } = Astro.props;
	const formattedDate = date ? date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	}) : null;
	return renderTemplate`${maybeRenderHead($$result)}<article class="post-card" data-astro-cid-sbmovh4h><a${addAttribute(href, "href")} class="card-link" data-astro-cid-sbmovh4h>${featuredImage ? renderTemplate`<div class="card-image" data-astro-cid-sbmovh4h>${renderComponent($$result, "Image", $$EmDashImage, {
		"image": featuredImage,
		"data-astro-cid-sbmovh4h": true
	})}</div>` : renderTemplate`<div class="card-placeholder" data-astro-cid-sbmovh4h></div>`}<div class="card-body" data-astro-cid-sbmovh4h><div class="card-meta" data-astro-cid-sbmovh4h>${bylines && bylines.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="card-bylines" data-astro-cid-sbmovh4h>${bylines.slice(0, 1).map((credit) => renderTemplate`<span class="card-byline" data-astro-cid-sbmovh4h>${credit.byline.avatarMediaId && renderTemplate`<img${addAttribute(`/_emdash/api/media/file/${credit.byline.avatarMediaId}`, "src")}${addAttribute(credit.byline.displayName, "alt")} class="card-byline-avatar" data-astro-cid-sbmovh4h>`}<span class="card-byline-name" data-astro-cid-sbmovh4h>${credit.byline.displayName}</span></span>`)}${bylines.length > 1 && renderTemplate`<span class="byline-more"${addAttribute(bylines.slice(1).map((c) => c.byline.displayName).join(", "), "data-tooltip")}${addAttribute(bylines.slice(1).map((c) => c.byline.displayName).join(", "), "title")} tabindex="0" data-astro-cid-sbmovh4h>+${bylines.length - 1}</span>`}</div>${(formattedDate || readingTime) && renderTemplate`<span class="meta-dot" data-astro-cid-sbmovh4h></span>`}` })}`}${formattedDate && renderTemplate`<time data-astro-cid-sbmovh4h>${formattedDate}</time>`}${formattedDate && readingTime && renderTemplate`<span class="meta-dot" data-astro-cid-sbmovh4h></span>`}${readingTime && renderTemplate`<span data-astro-cid-sbmovh4h>${readingTime} min</span>`}</div><h2 class="card-title" data-astro-cid-sbmovh4h>${title}</h2>${excerpt && renderTemplate`<p class="card-excerpt" data-astro-cid-sbmovh4h>${excerpt}</p>`}</div></a>${tags && tags.length > 0 && renderTemplate`<div class="card-tags" data-astro-cid-sbmovh4h>${tags.slice(0, 2).map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag.slug}`, "href")} class="card-tag" data-astro-cid-sbmovh4h>${tag.label}</a>`)}</div>`}</article>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/components/PostCard.astro", void 0);
//#endregion
export { $$PostCard as t };
