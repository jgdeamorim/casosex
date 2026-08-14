import { a as __toCommonJS, i as __require, n as __esmMin, o as __toESM, r as __exportAll, t as __commonJSMin } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as unescapeHTML, T as createAstro, _ as addAttribute, a as Fragment, c as renderSlot, d as renderTemplate, g as renderHead, h as maybeRenderHead, i as renderComponent, t as spreadAttributes, v as createRenderInstruction } from "./server_Lac7W6ZE.mjs";
import { t as createComponent } from "./astro-component_CcaHMe5u.mjs";
import { t as sql } from "./dist_D4nVBoqy.mjs";
import { n as ulid, t as monotonicFactory } from "./node_BucsvNi-.mjs";
import { t as getSiteSettings } from "./settings-DgKouY2S_DP0zmLXj.mjs";
import { d as getMenu$1 } from "./dist_C4cexd-h.mjs";
import { i as getEmDashCollection } from "./query-DCiXI7OZ_B3DBnk_t.mjs";
import { t as config_default } from "./config_DTEuujs6.mjs";
import { i as $$Font, n as getImage, o as $$Image$1 } from "./_astro_assets_D5FWpGHA.mjs";
import "./compiler_BPLn2J1w.mjs";
import { r as requestCached } from "./request-cache_48eSuHhA.mjs";
import { a as EmDashValidationError, c as decodeCursor, i as getDb, l as encodeCursor, o as InvalidCursorError, s as ScheduledNotDueError } from "./loader_eyqw6jfw.mjs";
import { n as getSiteSettingsWithDb, t as getSiteSettings$1 } from "./settings_NGFIUACf.mjs";
import { t as validateIdentifier } from "./validate_CCxKkQQu.mjs";
import { a as chunks, c as currentTimestamp, d as tableExists, i as resolveLocaleChain, l as isSqlite, n as localizePath, r as resolveLocale, t as interpolateUrlPattern$1, u as listTablesLike } from "./resolve_h37kxJCM.mjs";
import { i as isMissingTableError, n as getI18nConfig, r as isI18nEnabled } from "./config_BJC5khv8.mjs";
import { n as cachedQuery, o as invalidateCollectionCache, s as invalidateCommentObjectCache, t as CacheNamespace } from "./object-cache_BRJRfvhV.mjs";
import { n as getEditMeta, r as getEmDashCollection$1 } from "./query_CQxlMFsh.mjs";
import { a as RESERVED_FIELD_SLUGS, i as RESERVED_COLLECTION_SLUGS, n as FIELD_TYPE_TO_COLUMN, o as withTransaction } from "./types_CDjRl-y9.mjs";
import { i as getTaxonomyTerms } from "./taxonomies_C496ya1S.mjs";
import { t as resolveBlogSiteIdentity } from "./site-identity_CAY1GlF8.mjs";
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region node_modules/.pnpm/@portabletext+toolkit@3.0.3/node_modules/@portabletext/toolkit/dist/index.js
function isPortableTextSpan(node) {
	return node._type === "span" && "text" in node && typeof node.text == "string" && (typeof node.marks > "u" || Array.isArray(node.marks) && node.marks.every((mark) => typeof mark == "string"));
}
function isPortableTextBlock(node) {
	return typeof node._type == "string" && node._type[0] !== "@" && (!("markDefs" in node) || !node.markDefs || Array.isArray(node.markDefs) && node.markDefs.every((def) => typeof def._key == "string")) && "children" in node && Array.isArray(node.children) && node.children.every((child) => typeof child == "object" && "_type" in child);
}
function isPortableTextListItemBlock(block) {
	return isPortableTextBlock(block) && "listItem" in block && typeof block.listItem == "string" && (typeof block.level > "u" || typeof block.level == "number");
}
function isPortableTextToolkitList(block) {
	return block._type === "@list";
}
function isPortableTextToolkitSpan(span) {
	return span._type === "@span";
}
function isPortableTextToolkitTextNode(node) {
	return node._type === "@text";
}
var knownDecorators = [
	"strong",
	"em",
	"code",
	"underline",
	"strike-through"
];
function sortMarksByOccurences(span, index, blockChildren) {
	if (!isPortableTextSpan(span) || !span.marks) return [];
	if (!span.marks.length) return [];
	const marks = span.marks.slice(), occurences = {};
	return marks.forEach((mark) => {
		occurences[mark] = 1;
		for (let siblingIndex = index + 1; siblingIndex < blockChildren.length; siblingIndex++) {
			const sibling = blockChildren[siblingIndex];
			if (sibling && isPortableTextSpan(sibling) && Array.isArray(sibling.marks) && sibling.marks.indexOf(mark) !== -1) occurences[mark]++;
			else break;
		}
	}), marks.sort((markA, markB) => sortMarks(occurences, markA, markB));
}
function sortMarks(occurences, markA, markB) {
	const aOccurences = occurences[markA], bOccurences = occurences[markB];
	if (aOccurences !== bOccurences) return bOccurences - aOccurences;
	const aKnownPos = knownDecorators.indexOf(markA), bKnownPos = knownDecorators.indexOf(markB);
	return aKnownPos !== bKnownPos ? aKnownPos - bKnownPos : markA.localeCompare(markB);
}
function buildMarksTree(block) {
	var _a;
	const { children } = block, markDefs = block.markDefs ?? [];
	if (!children || !children.length) return [];
	const sortedMarks = children.map(sortMarksByOccurences), rootNode = {
		_type: "@span",
		children: [],
		markType: "<unknown>"
	};
	let nodeStack = [rootNode];
	for (let i = 0; i < children.length; i++) {
		const span = children[i];
		if (!span) continue;
		const marksNeeded = sortedMarks[i] || [];
		let pos = 1;
		if (nodeStack.length > 1) for (; pos < nodeStack.length; pos++) {
			const mark = ((_a = nodeStack[pos]) == null ? void 0 : _a.markKey) || "", index = marksNeeded.indexOf(mark);
			if (index === -1) break;
			marksNeeded.splice(index, 1);
		}
		nodeStack = nodeStack.slice(0, pos);
		let currentNode = nodeStack[nodeStack.length - 1];
		if (currentNode) {
			for (const markKey of marksNeeded) {
				const markDef = markDefs == null ? void 0 : markDefs.find((def) => def._key === markKey), markType = markDef ? markDef._type : markKey, node = {
					_type: "@span",
					_key: span._key,
					children: [],
					markDef,
					markType,
					markKey
				};
				currentNode.children.push(node), nodeStack.push(node), currentNode = node;
			}
			if (isPortableTextSpan(span)) {
				const lines = span.text.split(`
`);
				for (let line = lines.length; line-- > 1;) lines.splice(line, 0, `
`);
				currentNode.children = currentNode.children.concat(lines.map((text) => ({
					_type: "@text",
					text
				})));
			} else currentNode.children = currentNode.children.concat(span);
		}
	}
	return rootNode.children;
}
function nestLists(blocks, mode) {
	const tree = [];
	let currentList;
	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];
		if (block) {
			if (!isPortableTextListItemBlock(block)) {
				tree.push(block), currentList = void 0;
				continue;
			}
			if (!currentList) {
				currentList = listFromBlock(block, i, mode), tree.push(currentList);
				continue;
			}
			if (blockMatchesList(block, currentList)) {
				currentList.children.push(block);
				continue;
			}
			if ((block.level || 1) > currentList.level) {
				const newList = listFromBlock(block, i, mode);
				if (mode === "html") {
					const lastListItem = currentList.children[currentList.children.length - 1], newLastChild = {
						...lastListItem,
						children: [...lastListItem.children, newList]
					};
					currentList.children[currentList.children.length - 1] = newLastChild;
				} else currentList.children.push(newList);
				currentList = newList;
				continue;
			}
			if ((block.level || 1) < currentList.level) {
				const matchingBranch = tree[tree.length - 1], match = matchingBranch && findListMatching(matchingBranch, block);
				if (match) {
					currentList = match, currentList.children.push(block);
					continue;
				}
				currentList = listFromBlock(block, i, mode), tree.push(currentList);
				continue;
			}
			if (block.listItem !== currentList.listItem) {
				const matchingBranch = tree[tree.length - 1], match = matchingBranch && findListMatching(matchingBranch, { level: block.level || 1 });
				if (match && match.listItem === block.listItem) {
					currentList = match, currentList.children.push(block);
					continue;
				} else {
					currentList = listFromBlock(block, i, mode), tree.push(currentList);
					continue;
				}
			}
			console.warn("Unknown state encountered for block", block), tree.push(block);
		}
	}
	return tree;
}
function blockMatchesList(block, list) {
	return (block.level || 1) === list.level && block.listItem === list.listItem;
}
function listFromBlock(block, index, mode) {
	return {
		_type: "@list",
		_key: `${block._key || `${index}`}-parent`,
		mode,
		level: block.level || 1,
		listItem: block.listItem,
		children: [block]
	};
}
function findListMatching(rootNode, matching) {
	const level = matching.level || 1, style = matching.listItem || "normal", filterOnType = typeof matching.listItem == "string";
	if (isPortableTextToolkitList(rootNode) && (rootNode.level || 1) === level && filterOnType && (rootNode.listItem || "normal") === style) return rootNode;
	if (!("children" in rootNode)) return;
	const node = rootNode.children[rootNode.children.length - 1];
	return node && !isPortableTextSpan(node) ? findListMatching(node, matching) : void 0;
}
var LIST_NEST_MODE_HTML = "html";
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/lib/internal.ts
/**
* Returns true if `it` is component
*/
function isComponent(it) {
	return typeof it === "function";
}
/**
* Merges two {@link SomePortableTextComponents} objects, giving priority to overrides.
*
* This function combines two component objects used in Portable Text rendering.
* If both objects have the same key, the value from `overrides` takes precedence.
* This is useful for customizing the rendering of specific components while keeping
* the default behavior for others.
*
* @typeParam Components - The type of the base components object.
* @typeParam Overrides - The type of the overrides components object.
* @typeParam MergedComponents - The type of the resulting merged components object.
*
* @param components - The base components object.
* @param overrides - The overrides components object.
*
* @returns A new object with the merged components.
*/
function mergeComponents(components, overrides) {
	const cmps = { ...components };
	for (const [key, override] of Object.entries(overrides)) {
		const current = components[key];
		cmps[key] = !current || isComponent(override) || isComponent(current) ? override : {
			...current,
			...override
		};
	}
	return cmps;
}
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/lib/warnings.ts
var getTemplate = (prop, type) => `PortableText [components.${prop}] is missing "${type}"`;
var unknownTypeWarning = (type) => getTemplate("type", type);
var unknownMarkWarning = (markType) => getTemplate("mark", markType);
var unknownBlockWarning = (style) => getTemplate("block", style);
var unknownListWarning = (listItem) => getTemplate("list", listItem);
var unknownListItemWarning = (listStyle) => getTemplate("listItem", listStyle);
var getWarningMessage = (nodeType, type) => {
	return {
		block: unknownBlockWarning,
		list: unknownListWarning,
		listItem: unknownListItemWarning,
		mark: unknownMarkWarning,
		type: unknownTypeWarning
	}[nodeType](type);
};
function printWarning(message) {
	console.warn(message);
}
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/lib/context.ts
var key = Symbol("astro-portabletext");
/**
* This function returns rendering utility functions within a Portable Text tree. It should
* only be used within an Astro component that has been passed into the PortableText `components` prop.
* It follows a naming convention similar to React hooks, though it is not a hook as such.
*
* @param node - The Portable Text node that was passed into the Astro component
* @returns Rendering utility functions
*/
function usePortableText(node) {
	if (!(key in globalThis)) throw new Error(`PortableText "context" has not been initialised`);
	return globalThis[key](node);
}
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/Block.astro
createAstro("https://astro.build");
var $$Block$1 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Block$1;
	const props = Astro.props;
	const { node, index, isInline, ...attrs } = props;
	const styleIs = (style) => style === node.style;
	const { getUnknownComponent } = usePortableText(node);
	const UnknownStyle = getUnknownComponent();
	return renderTemplate`${styleIs("h1") ? renderTemplate`${maybeRenderHead($$result)}<h1${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h1>` : styleIs("h2") ? renderTemplate`<h2${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h2>` : styleIs("h3") ? renderTemplate`<h3${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h3>` : styleIs("h4") ? renderTemplate`<h4${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h4>` : styleIs("h5") ? renderTemplate`<h5${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h5>` : styleIs("h6") ? renderTemplate`<h6${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h6>` : styleIs("blockquote") ? renderTemplate`<blockquote${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</blockquote>` : styleIs("normal") ? renderTemplate`<p${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</p>` : renderTemplate`${renderComponent($$result, "UnknownStyle", UnknownStyle, { ...props }, { "default": ($$result) => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/Block.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/HardBreak.astro
var $$HardBreak = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<br>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/HardBreak.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/List.astro
createAstro("https://astro.build");
var $$List = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$List;
	const { node, index, isInline, ...attrs } = Astro.props;
	const listItemIs = (listItem) => listItem === node.listItem;
	return renderTemplate`${listItemIs("menu") ? renderTemplate`${maybeRenderHead($$result)}<menu${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</menu>` : listItemIs("number") ? renderTemplate`<ol${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</ol>` : renderTemplate`<ul${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</ul>`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/List.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/ListItem.astro
createAstro("https://astro.build");
var $$ListItem = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ListItem;
	const { node, index, isInline, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<li${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</li>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/ListItem.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/Mark.astro
createAstro("https://astro.build");
var $$Mark = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Mark;
	const props = Astro.props;
	const { node, index, isInline, ...attrs } = props;
	const markTypeIs = (markType) => markType === node.markType;
	const { getUnknownComponent } = usePortableText(node);
	const UnknownMarkType = getUnknownComponent();
	return renderTemplate`${markTypeIs("code") ? renderTemplate`${maybeRenderHead($$result)}<code${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</code>` : markTypeIs("em") ? renderTemplate`<em${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</em>` : markTypeIs("link") ? renderTemplate`<a${addAttribute(node.markDef.href, "href")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</a>` : markTypeIs("strike-through") ? renderTemplate`<del${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</del>` : markTypeIs("strong") ? renderTemplate`<strong${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</strong>` : markTypeIs("underline") ? renderTemplate`<span style="text-decoration: underline;"${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</span>` : renderTemplate`${renderComponent($$result, "UnknownMarkType", UnknownMarkType, { ...props }, { "default": ($$result) => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/Mark.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/Text.astro
createAstro("https://astro.build");
var $$Text = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Text;
	const { node } = Astro.props;
	return renderTemplate`${node.text}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/Text.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownBlock.astro
var $$UnknownBlock = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<p data-portabletext-unknown="block">${renderSlot($$result, $$slots["default"])}</p>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownBlock.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownList.astro
var $$UnknownList = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<ul data-portabletext-unknown="list">${renderSlot($$result, $$slots["default"])}</ul>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownList.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownListItem.astro
var $$UnknownListItem = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<li data-portabletext-unknown="listitem">${renderSlot($$result, $$slots["default"])}</li>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownListItem.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownMark.astro
var $$UnknownMark = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<span data-portabletext-unknown="mark">${renderSlot($$result, $$slots["default"])}</span>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownMark.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownType.astro
createAstro("https://astro.build");
var $$UnknownType = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$UnknownType;
	const { node, isInline } = Astro.props;
	const warning = getWarningMessage("type", node._type);
	return renderTemplate`${isInline ? renderTemplate`${maybeRenderHead($$result)}<span style="display:none" data-portabletext-unknown="type">${warning}</span>` : renderTemplate`<div style="display:none" data-portabletext-unknown="type">${warning}</div>`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/UnknownType.astro", void 0);
//#endregion
//#region node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/PortableText.astro
createAstro("https://astro.build");
var $$PortableText$1 = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$PortableText$1;
	const { value, components: componentOverrides = {}, listNestingMode = LIST_NEST_MODE_HTML, onMissingComponent = true } = Astro2.props;
	const components = mergeComponents({
		type: {},
		unknownType: $$UnknownType,
		block: {
			h1: $$Block$1,
			h2: $$Block$1,
			h3: $$Block$1,
			h4: $$Block$1,
			h5: $$Block$1,
			h6: $$Block$1,
			blockquote: $$Block$1,
			normal: $$Block$1
		},
		unknownBlock: $$UnknownBlock,
		list: {
			bullet: $$List,
			number: $$List,
			menu: $$List
		},
		unknownList: $$UnknownList,
		listItem: {
			bullet: $$ListItem,
			number: $$ListItem,
			menu: $$ListItem
		},
		unknownListItem: $$UnknownListItem,
		mark: {
			code: $$Mark,
			em: $$Mark,
			link: $$Mark,
			"strike-through": $$Mark,
			strong: $$Mark,
			underline: $$Mark
		},
		unknownMark: $$UnknownMark,
		text: $$Text,
		hardBreak: $$HardBreak
	}, componentOverrides);
	const noop = () => {};
	const missingComponentHandler = ((handler) => {
		if (typeof handler === "function") return handler;
		return !handler ? noop : printWarning;
	})(onMissingComponent);
	const asComponentProps = (node, index, isInline) => ({
		node,
		index,
		isInline
	});
	const provideComponent = (nodeType, type, fallbackComponent) => {
		const component = ((component2) => {
			return component2[type] || component2;
		})(components[nodeType]);
		if (isComponent(component)) return component;
		missingComponentHandler(getWarningMessage(nodeType, type), {
			nodeType,
			type
		});
		return fallbackComponent;
	};
	const cachedNodes = /* @__PURE__ */ new WeakMap();
	function cacheNode(node, Default, Unknown) {
		cachedNodes.set(node, {
			Default,
			Unknown
		});
	}
	let fallbackRenderOptions;
	const portableTextRender = (options, isInline) => {
		if (!fallbackRenderOptions) throw new Error("[PortableText portableTextRender] fallbackRenderOptions is undefined");
		const renderChildren = (children, inline = false) => {
			return children?.map(portableTextRender(options, inline)) ?? [];
		};
		const renderOptions = {
			...fallbackRenderOptions,
			...options ?? {}
		};
		return function renderNode(node, index) {
			function run(handler, props) {
				if (!isComponent(handler)) throw new Error(`[PortableText render] No handler found for node type ${node._type}.`);
				return handler(props);
			}
			if (isPortableTextToolkitList(node)) {
				const UnknownComponent2 = components.unknownList ?? $$UnknownList;
				cacheNode(node, $$List, UnknownComponent2);
				return run(renderOptions.list, {
					Component: provideComponent("list", node.listItem, UnknownComponent2),
					props: asComponentProps(node, index, false),
					children: renderChildren(node.children, false)
				});
			}
			if (isPortableTextListItemBlock(node)) {
				const { listItem, ...blockNode } = node;
				const isStyled = node.style && node.style !== "normal";
				node.children = isStyled ? renderNode(blockNode, index) : buildMarksTree(node);
				const UnknownComponent2 = components.unknownListItem ?? $$UnknownListItem;
				cacheNode(node, $$ListItem, UnknownComponent2);
				return run(renderOptions.listItem, {
					Component: provideComponent("listItem", node.listItem, UnknownComponent2),
					props: asComponentProps(node, index, false),
					children: isStyled ? node.children : renderChildren(node.children, true)
				});
			}
			if (isPortableTextToolkitSpan(node)) {
				const UnknownComponent2 = components.unknownMark ?? $$UnknownMark;
				cacheNode(node, $$Mark, UnknownComponent2);
				return run(renderOptions.mark, {
					Component: provideComponent("mark", node.markType, UnknownComponent2),
					props: asComponentProps(node, index, true),
					children: renderChildren(node.children, true)
				});
			}
			if (isPortableTextBlock(node)) {
				node.style ??= "normal";
				node.children = buildMarksTree(node);
				const UnknownComponent2 = components.unknownBlock ?? $$UnknownBlock;
				cacheNode(node, $$Block$1, UnknownComponent2);
				return run(renderOptions.block, {
					Component: provideComponent("block", node.style, UnknownComponent2),
					props: asComponentProps(node, index, false),
					children: renderChildren(node.children, true)
				});
			}
			if (isPortableTextToolkitTextNode(node)) {
				const isHardBreak = "\n" === node.text;
				const props = asComponentProps(node, index, true);
				if (isHardBreak) return run(renderOptions.hardBreak, {
					Component: isComponent(components.hardBreak) ? components.hardBreak : $$HardBreak,
					props
				});
				return run(renderOptions.text, {
					Component: isComponent(components.text) ? components.text : $$Text,
					props
				});
			}
			const UnknownComponent = components.unknownType ?? $$UnknownType;
			return run(renderOptions.type, {
				Component: provideComponent("type", node._type, UnknownComponent),
				props: asComponentProps(node, index, isInline ?? false)
			});
		};
	};
	globalThis[key] = (node) => ({
		getDefaultComponent: provideDefaultComponent.bind(null, node),
		getUnknownComponent: provideUnknownComponent.bind(null, node),
		render: (options) => node.children?.map(portableTextRender(options))
	});
	const provideDefaultComponent = (node) => {
		const DefaultComponent = cachedNodes.get(node)?.Default;
		if (DefaultComponent) return DefaultComponent;
		if (isPortableTextToolkitList(node)) return $$List;
		if (isPortableTextListItemBlock(node)) return $$ListItem;
		if (isPortableTextToolkitSpan(node)) return $$Mark;
		if (isPortableTextBlock(node)) return $$Block$1;
		if (isPortableTextToolkitTextNode(node)) return "\n" === node.text ? $$HardBreak : $$Text;
		return $$UnknownType;
	};
	const provideUnknownComponent = (node) => {
		const UnknownComponent = cachedNodes.get(node)?.Unknown;
		if (UnknownComponent) return UnknownComponent;
		if (isPortableTextToolkitList(node)) return components.unknownList ?? $$UnknownList;
		if (isPortableTextListItemBlock(node)) return components.unknownListItem ?? $$UnknownListItem;
		if (isPortableTextToolkitSpan(node)) return components.unknownMark ?? $$UnknownMark;
		if (isPortableTextBlock(node)) return components.unknownBlock ?? $$UnknownBlock;
		if (!isPortableTextToolkitTextNode(node)) return components.unknownType ?? $$UnknownType;
		throw new Error(`[PortableText getUnknownComponent] Unable to provide component with node type ${node._type}`);
	};
	const nodes = nestLists(Array.isArray(value) ? value : value ? [value] : [], listNestingMode);
	const render = (options) => {
		fallbackRenderOptions = options;
		return portableTextRender(options);
	};
	const createSlotRenderer = (slotName) => Astro2.slots.render.bind(Astro2.slots, slotName);
	const slots = [
		"type",
		"block",
		"list",
		"listItem",
		"mark",
		"text",
		"hardBreak"
	].reduce((obj, name) => {
		obj[name] = Astro2.slots.has(name) ? createSlotRenderer(name) : void 0;
		return obj;
	}, {});
	return renderTemplate`${(() => {
		const renderNode = (slotRenderer) => {
			return ({ Component, props, children }) => slotRenderer?.([{
				Component,
				props,
				children
			}]) ?? renderTemplate`${renderComponent($$result, "Component", Component, { ...props }, { "default": ($$result2) => renderTemplate`${children}` })}`;
		};
		return nodes.map(render({
			type: renderNode(slots.type),
			block: renderNode(slots.block),
			list: renderNode(slots.list),
			listItem: renderNode(slots.listItem),
			mark: renderNode(slots.mark),
			text: renderNode(slots.text),
			hardBreak: renderNode(slots.hardBreak)
		}));
	})()}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/node_modules/.pnpm/astro-portabletext@0.11.4_astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types_9c63f11bbd32f91b38ee0c5b298b8b3b/node_modules/astro-portabletext/components/PortableText.astro", void 0);
//#endregion
//#region \0virtual:emdash/block-components
var pluginBlockComponents = {};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/InlineEditor.astro
createAstro("https://astro.build");
var $$InlineEditor = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$InlineEditor;
	const { value, collection, entryId, field } = Astro.props;
	return renderTemplate`${renderComponent($$result, "InlinePortableTextEditor", null, {
		"client:only": "react",
		"value": value,
		"collection": collection,
		"entryId": entryId,
		"field": field,
		"client:component-hydration": "only",
		"client:component-path": "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/InlinePortableTextEditor.tsx",
		"client:component-export": "InlinePortableTextEditor"
	})}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/InlineEditor.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/portable-text-blockquote-group.ts
function isBlockquoteBlock(block) {
	if (typeof block !== "object" || block === null) return false;
	const b = block;
	return b._type === "block" && b.style === "blockquote" && b.listItem === void 0;
}
function groupBlockquoteRuns(blocks) {
	const result = [];
	let i = 0;
	while (i < blocks.length) {
		const current = blocks[i];
		if (!isBlockquoteBlock(current)) {
			result.push(current);
			i++;
			continue;
		}
		const run = [];
		let next = current;
		while (i < blocks.length && isBlockquoteBlock(next)) {
			run.push(next);
			i++;
			next = blocks[i];
		}
		if (run.length === 1) result.push(run[0]);
		else {
			const group = {
				_type: "blockquoteGroup",
				_key: `${run[0]?._key ?? "quote"}-group`,
				blocks: run
			};
			result.push(group);
		}
	}
	return result;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/PortableText.astro
createAstro("https://astro.build");
var $$PortableText = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PortableText;
	const { value, components: userComponents, ...rest } = Astro.props;
	const editMeta = getEditMeta(value);
	const withPlugins = mergeComponents(emdashComponents, { type: pluginBlockComponents });
	const mergedComponents = userComponents ? mergeComponents(withPlugins, userComponents) : withPlugins;
	const renderValue = Array.isArray(value) ? groupBlockquoteRuns(value) : value;
	return renderTemplate`${editMeta ? renderTemplate`${renderComponent($$result, "InlineEditor", $$InlineEditor, {
		"value": value,
		"collection": editMeta.collection,
		"entryId": editMeta.id,
		"field": editMeta.field
	})}` : renderTemplate`${renderComponent($$result, "BasePortableText", $$PortableText$1, {
		"value": renderValue,
		"components": mergedComponents,
		...rest
	})}`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/PortableText.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/repositories/comment-reaction.ts
/**
* Repository for comment reactions (likes / emoji).
*
* Reactions are deduped per (comment, voter, reaction) by a unique index, so
* a second toggle of the same reaction by the same voter removes it.
*/
var CommentReactionRepository = class {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* Toggle a reaction for a voter on a comment.
	*
	* @returns `{ reacted: true }` if the reaction was added, `{ reacted: false }`
	*   if an existing reaction was removed.
	*/
	async toggle(input) {
		if (((await this.db.insertInto("_emdash_comment_reactions").values({
			id: ulid(),
			comment_id: input.commentId,
			reaction: input.reaction,
			voter_hash: input.voterHash,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}).onConflict((oc) => oc.columns([
			"comment_id",
			"voter_hash",
			"reaction"
		]).doNothing()).executeTakeFirst()).numInsertedOrUpdatedRows ?? 0n) > 0n) return { reacted: true };
		await this.db.deleteFrom("_emdash_comment_reactions").where("comment_id", "=", input.commentId).where("voter_hash", "=", input.voterHash).where("reaction", "=", input.reaction).execute();
		return { reacted: false };
	}
	/**
	* Aggregate reaction counts for a set of comments.
	*
	* @returns a Map keyed by comment id; comments with no reactions are absent.
	*/
	async countsForComments(commentIds) {
		const result = /* @__PURE__ */ new Map();
		if (commentIds.length === 0) return result;
		for (const batch of chunks(commentIds, 50)) {
			const rows = await this.db.selectFrom("_emdash_comment_reactions").select(["comment_id", "reaction"]).select((eb) => eb.fn.count("id").as("count")).where("comment_id", "in", batch).groupBy(["comment_id", "reaction"]).execute();
			for (const row of rows) {
				const counts = result.get(row.comment_id) ?? {};
				counts[row.reaction] = Number(row.count);
				result.set(row.comment_id, counts);
			}
		}
		return result;
	}
	/**
	* Which reactions a given voter has set, per comment.
	*
	* @returns a Map keyed by comment id whose values are the reaction names the
	*   voter has active on that comment.
	*/
	async viewerReactions(commentIds, voterHash) {
		const result = /* @__PURE__ */ new Map();
		if (commentIds.length === 0) return result;
		for (const batch of chunks(commentIds, 50)) {
			const rows = await this.db.selectFrom("_emdash_comment_reactions").select(["comment_id", "reaction"]).where("comment_id", "in", batch).where("voter_hash", "=", voterHash).execute();
			for (const row of rows) {
				const list = result.get(row.comment_id) ?? [];
				list.push(row.reaction);
				result.set(row.comment_id, list);
			}
		}
		return result;
	}
	/**
	* Count a voter's reactions within a recent time window (for rate limiting).
	*/
	async countRecentByVoter(voterHash, windowMinutes = 10) {
		const cutoff = (/* @__PURE__ */ new Date(Date.now() - windowMinutes * 60 * 1e3)).toISOString();
		const result = await this.db.selectFrom("_emdash_comment_reactions").select((eb) => eb.fn.count("id").as("count")).where("voter_hash", "=", voterHash).where("created_at", ">", cutoff).executeTakeFirst();
		return Number(result?.count ?? 0);
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/repositories/comment.ts
/** Matches LIKE wildcard characters and the escape character itself */
var LIKE_ESCAPE_RE = /[%_\\]/g;
var CommentRepository = class CommentRepository {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new comment
	*/
	async create(input) {
		const id = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await this.db.insertInto("_emdash_comments").values({
			id,
			collection: input.collection,
			content_id: input.contentId,
			parent_id: input.parentId ?? null,
			author_name: input.authorName,
			author_email: input.authorEmail,
			author_user_id: input.authorUserId ?? null,
			body: input.body,
			status: input.status ?? "pending",
			ip_hash: input.ipHash ?? null,
			user_agent: input.userAgent ?? null,
			moderation_metadata: input.moderationMetadata ? JSON.stringify(input.moderationMetadata) : null,
			created_at: now,
			updated_at: now
		}).execute();
		invalidateCommentObjectCache();
		const comment = await this.findById(id);
		if (!comment) throw new Error("Failed to create comment");
		return comment;
	}
	/**
	* Find comment by ID
	*/
	async findById(id) {
		const row = await this.db.selectFrom("_emdash_comments").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToComment(row) : null;
	}
	/**
	* Find comments for a content item with optional status filter.
	* Results are ordered by created_at ASC (oldest first) for display.
	*/
	async findByContent(collection, contentId, options = {}) {
		const limit = Math.min(options.limit || 50, 100);
		let query = this.db.selectFrom("_emdash_comments").selectAll().where("collection", "=", collection).where("content_id", "=", contentId);
		if (options.status) query = query.where("status", "=", options.status);
		if (options.cursor) {
			const decoded = decodeCursor(options.cursor);
			query = query.where((eb) => eb.or([eb("created_at", ">", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", ">", decoded.id)])]));
		}
		query = query.orderBy("created_at", "asc").orderBy("id", "asc").limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit).map((r) => this.rowToComment(r));
		const result = { items };
		if (hasMore && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}
		return result;
	}
	/**
	* Find comments by status (moderation inbox).
	* Results are ordered by created_at DESC (newest first).
	*/
	async findByStatus(status, options = {}) {
		const limit = Math.min(options.limit || 50, 100);
		let query = this.db.selectFrom("_emdash_comments").selectAll().where("status", "=", status);
		if (options.collection) query = query.where("collection", "=", options.collection);
		if (options.search) {
			const term = `%${options.search.replace(LIKE_ESCAPE_RE, (ch) => `\\${ch}`)}%`;
			query = query.where((eb) => eb.or([
				sql`author_name LIKE ${term} ESCAPE '\\'`,
				sql`author_email LIKE ${term} ESCAPE '\\'`,
				sql`body LIKE ${term} ESCAPE '\\'`
			]));
		}
		if (options.cursor) {
			const decoded = decodeCursor(options.cursor);
			query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
		}
		query = query.orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit).map((r) => this.rowToComment(r));
		const result = { items };
		if (hasMore && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}
		return result;
	}
	/**
	* Update comment status
	*/
	async updateStatus(id, status) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await this.db.updateTable("_emdash_comments").set({
			status,
			updated_at: now
		}).where("id", "=", id).execute();
		invalidateCommentObjectCache();
		return this.findById(id);
	}
	/**
	* Bulk update comment statuses
	*/
	async bulkUpdateStatus(ids, status) {
		if (ids.length === 0) return 0;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const result = await this.db.updateTable("_emdash_comments").set({
			status,
			updated_at: now
		}).where("id", "in", ids).executeTakeFirst();
		invalidateCommentObjectCache();
		return Number(result.numUpdatedRows ?? 0);
	}
	/**
	* Hard-delete a single comment. Replies cascade via FK.
	*/
	async delete(id) {
		const result = await this.db.deleteFrom("_emdash_comments").where("id", "=", id).executeTakeFirst();
		invalidateCommentObjectCache();
		return (result.numDeletedRows ?? 0) > 0;
	}
	/**
	* Bulk hard-delete comments
	*/
	async bulkDelete(ids) {
		if (ids.length === 0) return 0;
		const result = await this.db.deleteFrom("_emdash_comments").where("id", "in", ids).executeTakeFirst();
		invalidateCommentObjectCache();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Delete all comments for a content item (cascade on content deletion)
	*/
	async deleteByContent(collection, contentId) {
		const result = await this.db.deleteFrom("_emdash_comments").where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
		invalidateCommentObjectCache();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Count comments for a content item, optionally filtered by status
	*/
	async countByContent(collection, contentId, status) {
		let query = this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("collection", "=", collection).where("content_id", "=", contentId);
		if (status) query = query.where("status", "=", status);
		const result = await query.executeTakeFirst();
		return Number(result?.count ?? 0);
	}
	/**
	* Count comments grouped by status (for inbox badges)
	*
	* Uses four parallel COUNT queries with WHERE filters to leverage partial indexes
	* (idx_comments_pending, idx_comments_approved, idx_comments_spam, idx_comments_trash)
	* instead of a full table GROUP BY scan.
	*/
	async countByStatus() {
		const [pending, approved, spam, trash] = await Promise.all([
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "pending").executeTakeFirst(),
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "approved").executeTakeFirst(),
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "spam").executeTakeFirst(),
			this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("status", "=", "trash").executeTakeFirst()
		]);
		return {
			pending: Number(pending?.count ?? 0),
			approved: Number(approved?.count ?? 0),
			spam: Number(spam?.count ?? 0),
			trash: Number(trash?.count ?? 0)
		};
	}
	/**
	* Count approved comments from a given email address.
	* Used for "first time commenter" moderation logic.
	*/
	async countApprovedByEmail(email) {
		const result = await this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("author_email", "=", email).where("status", "=", "approved").executeTakeFirst();
		return Number(result?.count ?? 0);
	}
	/**
	* Update the moderation metadata JSON on a comment
	*/
	async updateModerationMetadata(id, metadata) {
		await this.db.updateTable("_emdash_comments").set({ moderation_metadata: JSON.stringify(metadata) }).where("id", "=", id).execute();
	}
	/**
	* Assemble a flat list of comments into a threaded structure (1-level nesting)
	*/
	static assembleThreads(comments) {
		const roots = [];
		const childrenMap = /* @__PURE__ */ new Map();
		for (const comment of comments) if (comment.parentId) {
			const siblings = childrenMap.get(comment.parentId) ?? [];
			siblings.push(comment);
			childrenMap.set(comment.parentId, siblings);
		} else roots.push(comment);
		return roots.map((root) => ({
			...root,
			_replies: childrenMap.get(root.id) ?? []
		}));
	}
	/**
	* Convert a Comment to its public-facing shape
	*/
	static toPublicComment(comment) {
		const pub = {
			id: comment.id,
			parentId: comment.parentId,
			authorName: comment.authorName,
			isRegisteredUser: comment.authorUserId !== null,
			body: comment.body,
			createdAt: comment.createdAt
		};
		if (comment._replies && comment._replies.length > 0) pub.replies = comment._replies.map((r) => CommentRepository.toPublicComment(r));
		return pub;
	}
	rowToComment(row) {
		return {
			id: row.id,
			collection: row.collection,
			contentId: row.content_id,
			parentId: row.parent_id,
			authorName: row.author_name,
			authorEmail: row.author_email,
			authorUserId: row.author_user_id,
			body: row.body,
			status: row.status,
			ipHash: row.ip_hash,
			userAgent: row.user_agent,
			moderationMetadata: row.moderation_metadata ? safeJsonParse(row.moderation_metadata) : null,
			createdAt: row.created_at,
			updatedAt: row.updated_at
		};
	}
};
function safeJsonParse(value) {
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/comments/ranking.ts
/**
* Comment ranking utilities (Tier 1 of the best-in-class comments RFC).
*
* Wilson score lower-bound (95% confidence) — the same primitive Reddit uses
* for its "Best" comment sort. Ranks by the statistical lower bound of the
* positive-reaction proportion rather than the raw count, so a comment with a
* couple of reactions can't outrank a heavily-reacted one until it earns
* confidence, and a late-but-popular comment still rises (submission time is
* irrelevant).
*
* Positive-only reactions (the recommended default) degrade gracefully: with
* `down = 0` the score still increases monotonically with `up` while penalising
* low-sample comments — wilson(1,0) ≈ 0.21, wilson(10,0) ≈ 0.73,
* wilson(200,0) ≈ 0.98.
*/
/** z for a 95% two-sided confidence interval. */
var DEFAULT_Z = 1.96;
/** Reactions that count against a comment when both signals are in use. */
var NEGATIVE_REACTIONS = /* @__PURE__ */ new Set(["dislike", "down"]);
/**
* Wilson score lower bound of the positive proportion.
*
* @param up   count of positive reactions
* @param down count of negative reactions
* @returns a score in [0, 1]; 0 when there are no reactions
*/
function wilsonLowerBound(up, down, z = DEFAULT_Z) {
	const n = up + down;
	if (n <= 0) return 0;
	const phat = up / n;
	const z2 = z * z;
	const denom = 1 + z2 / n;
	return (phat + z2 / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z2 / (4 * n)) / n)) / denom;
}
/**
* Reduce a per-reaction count map to a single rank score via the Wilson
* lower bound. Any reaction not in {@link NEGATIVE_REACTIONS} is treated as
* positive, so the positive-only default (just `like`) works without special
* casing.
*/
function reactionScore(counts) {
	let up = 0;
	let down = 0;
	for (const [reaction, count] of Object.entries(counts)) if (NEGATIVE_REACTIONS.has(reaction)) down += count;
	else up += count;
	return wilsonLowerBound(up, down);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/comments/query.ts
/**
* Get approved comments for a content item.
*
* @example
* ```ts
* import { getComments } from "emdash";
*
* const { items, total } = await getComments({
*   collection: "posts",
*   contentId: post.id,
*   threaded: true,
* });
* ```
*/
async function getComments(options) {
	const sort = options.sort ?? "oldest";
	const withReactions = options.reactions || sort === "best";
	const threaded = options.threaded ? "t" : "f";
	return cachedQuery({
		namespace: CacheNamespace.COMMENTS,
		key: `comments:${options.collection}:${options.contentId}:${threaded}:${withReactions ? "r" : "n"}:${sort}`,
		load: async () => {
			return getCommentsWithDb(await getDb(), options);
		}
	});
}
/**
* Get approved comments with an explicit db handle.
*
* @internal Use `getComments()` in templates. This variant is for routes
* that already have a database handle.
*/
async function getCommentsWithDb(db, options) {
	const repo = new CommentRepository(db);
	const total = await repo.countByContent(options.collection, options.contentId, "approved");
	const result = await repo.findByContent(options.collection, options.contentId, {
		status: "approved",
		limit: 500
	});
	const items = options.threaded ? CommentRepository.assembleThreads(result.items).map((c) => CommentRepository.toPublicComment(c)) : result.items.map((c) => CommentRepository.toPublicComment(c));
	if (options.reactions || options.sort === "best") {
		await attachReactions(db, items);
		if (options.sort === "best") sortByBest(items);
	}
	return {
		items,
		total
	};
}
/**
* Attach aggregate reaction counts to a list of public comments (and their
* replies), in a single batched query.
*/
async function attachReactions(db, items) {
	const ids = [];
	for (const comment of items) {
		ids.push(comment.id);
		if (comment.replies) for (const reply of comment.replies) ids.push(reply.id);
	}
	if (ids.length === 0) return;
	const counts = await new CommentReactionRepository(db).countsForComments(ids);
	const assign = (comment) => {
		const reactions = counts.get(comment.id);
		if (reactions) comment.reactions = reactions;
	};
	for (const comment of items) {
		assign(comment);
		comment.replies?.forEach(assign);
	}
}
/**
* Sort top-level comments by Wilson-scored reactions (descending), tie-broken
* by oldest-first to keep ordering stable.
*/
function sortByBest(items) {
	items.sort((a, b) => {
		const scoreDelta = reactionScore(b.reactions ?? {}) - reactionScore(a.reactions ?? {});
		if (scoreDelta !== 0) return scoreDelta;
		if (a.createdAt < b.createdAt) return -1;
		if (a.createdAt > b.createdAt) return 1;
		return 0;
	});
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/repositories/media-usage.ts
var OCCURRENCE_INSERT_BATCH_SIZE = Math.max(1, Math.floor(50 / 13));
var CONTENT_SOURCE_ELIGIBILITY = sql`(
	s.source_variant = 'draft_overlay'
	OR (
		s.source_variant = 'columns'
		AND (
			s.content_status = 'published'
			OR NOT EXISTS (
				SELECT 1
				FROM _emdash_media_usage_sources AS overlay
				WHERE overlay.source_type = 'content'
					AND overlay.collection_slug = s.collection_slug
					AND overlay.content_id = s.content_id
					AND overlay.source_variant = 'draft_overlay'
			)
		)
	)
)`;
/** Persistence-only repository for the internal media usage projection tables. */
var MediaUsageRepository = class {
	db;
	constructor(db) {
		this.db = db;
	}
	async replaceSource(source, occurrences) {
		const generation = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await withTransaction(this.db, async (trx) => {
			await this.insertOccurrences(trx, source.sourceKey, generation, occurrences, now);
			await this.upsertSource(trx, source, generation, now);
		});
		const replaced = await this.findSource(source.sourceKey);
		if (!replaced) throw new Error(`Media usage source ${source.sourceKey} was not persisted`);
		return replaced;
	}
	async replaceSourceIfCurrent(source, occurrences, expectedCurrentGeneration) {
		const generation = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildSourceRow(source, generation, now);
		let replaced = false;
		await withTransaction(this.db, async (trx) => {
			await this.insertOccurrences(trx, source.sourceKey, generation, occurrences, now);
			if (expectedCurrentGeneration === null) {
				replaced = await this.insertSourceIfAbsent(trx, row);
				return;
			}
			replaced = await this.updateSourceIfGeneration(trx, row, expectedCurrentGeneration);
		});
		return {
			replaced,
			source: replaced ? null : await this.findSource(source.sourceKey)
		};
	}
	async findSource(sourceKey) {
		const row = await this.db.selectFrom("_emdash_media_usage_sources").selectAll().where("source_key", "=", sourceKey).executeTakeFirst();
		return row ? rowToSource(row) : null;
	}
	async findSources(sourceKeys) {
		const uniqueSourceKeys = [...new Set(sourceKeys)];
		const sources = /* @__PURE__ */ new Map();
		if (uniqueSourceKeys.length === 0) return sources;
		for (const sourceKeyBatch of chunks(uniqueSourceKeys, 50)) {
			const rows = await this.db.selectFrom("_emdash_media_usage_sources").selectAll().where("source_key", "in", sourceKeyBatch).execute();
			for (const row of rows) {
				const source = rowToSource(row);
				sources.set(source.sourceKey, source);
			}
		}
		return sources;
	}
	async replaceSourceIfMatching(source, occurrences, expectedSource) {
		const generation = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildSourceRow(source, generation, now);
		let replaced = false;
		await withTransaction(this.db, async (trx) => {
			await this.insertOccurrences(trx, source.sourceKey, generation, occurrences, now);
			if (expectedSource === null) {
				replaced = await this.insertSourceIfAbsent(trx, row);
				return;
			}
			replaced = await this.updateSourceIfMatching(trx, row, expectedSource);
		});
		return {
			replaced,
			source: replaced ? null : await this.findSource(source.sourceKey)
		};
	}
	async markSourceAttempted(source) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildAttemptedSourceRow(source, now);
		const updates = this.attemptedSourceUpdateSet(source, row);
		await this.db.insertInto("_emdash_media_usage_sources").values(row).onConflict((oc) => oc.column("source_key").doUpdateSet(updates)).execute();
		const attempted = await this.findSource(source.sourceKey);
		if (!attempted) throw new Error(`Media usage source ${source.sourceKey} was not persisted`);
		return attempted;
	}
	async markSourceAttemptedIfMatching(source, expectedSource) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const row = this.buildAttemptedSourceRow(source, now);
		let attempted = false;
		if (expectedSource === null) attempted = await this.insertSourceIfAbsent(this.db, row);
		else attempted = await this.updateAttemptedSourceIfMatching(this.db, source, row, expectedSource);
		return {
			attempted,
			source: attempted ? null : await this.findSource(source.sourceKey)
		};
	}
	async findActiveEntryCountsByMediaIds(mediaIds) {
		const uniqueMediaIds = [...new Set(mediaIds)];
		const counts = new Map(uniqueMediaIds.map((mediaId) => [mediaId, 0]));
		for (const mediaIdBatch of chunks(uniqueMediaIds, 50)) {
			const visibleEntries = this.currentContentMediaUsageBaseQuery().select([
				"u.media_id as media_id",
				"s.collection_slug as collection_slug",
				"s.content_id as content_id"
			]).where("u.media_id", "in", mediaIdBatch).where((eb) => eb.not(eb.exists(eb.selectFrom("_emdash_media_usage_sources as deleted_source").select("deleted_source.source_key").where("deleted_source.source_type", "=", "content").whereRef("deleted_source.collection_slug", "=", "s.collection_slug").whereRef("deleted_source.content_id", "=", "s.content_id").where("deleted_source.source_variant", "in", ["columns", "draft_overlay"]).where("deleted_source.content_deleted_at", "is not", null)))).distinct().as("visible_entries");
			const rows = await this.db.selectFrom(visibleEntries).select("media_id").select((eb) => eb.fn.countAll().as("usage_count")).groupBy("media_id").execute();
			for (const row of rows) if (row.media_id !== null) counts.set(row.media_id, Number(row.usage_count));
		}
		return counts;
	}
	async findCollectionIndexStatusScopes(identity) {
		return (await this.db.selectFrom("_emdash_collections as collection").leftJoin("_emdash_media_usage_index_status as status", (join) => join.on("status.adapter_id", "=", identity.adapterId).on("status.scope_type", "=", identity.scopeType).onRef("status.scope_key", "=", "collection.slug")).select([
			"collection.slug as collection_slug",
			"status.status as status",
			"status.schema_version as schema_version"
		]).orderBy("collection.slug", "asc").execute()).map((row) => ({
			collectionSlug: row.collection_slug,
			status: row.status,
			schemaVersion: row.schema_version === null ? null : Number(row.schema_version)
		}));
	}
	async findCurrentEntryUsagePageByMediaId(mediaId, options = {}) {
		const requestedLimit = Math.floor(options.limit ?? 50);
		const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(1, requestedLimit), 100) : 50;
		const cursor = options.cursor ? decodeCursor(options.cursor) : null;
		if (cursor && (cursor.orderValue.length === 0 || cursor.id.length === 0)) throw new InvalidCursorError(options.cursor ?? "");
		let matchedGroups = this.currentContentMediaUsageBaseQuery().select(["s.collection_slug as collection_slug", "s.content_id as content_id"]).where("u.media_id", "=", mediaId).distinct();
		if (cursor) matchedGroups = matchedGroups.where((eb) => eb.or([eb("s.collection_slug", ">", cursor.orderValue), eb.and([eb("s.collection_slug", "=", cursor.orderValue), eb("s.content_id", ">", cursor.id)])]));
		matchedGroups = matchedGroups.orderBy("s.collection_slug", "asc").orderBy("s.content_id", "asc").limit(limit + 1);
		const rows = await this.db.with("matched_groups", () => matchedGroups).with("page_groups", (db) => db.selectFrom("matched_groups").selectAll().orderBy("collection_slug", "asc").orderBy("content_id", "asc").limit(limit)).with("entry_state", (db) => db.selectFrom("page_groups as page").crossJoin("_emdash_media_usage_sources as state").select(["page.collection_slug", "page.content_id"]).select((eb) => eb.fn.max("state.content_deleted_at").as("entry_deleted_at")).whereRef("page.collection_slug", "=", "state.collection_slug").whereRef("page.content_id", "=", "state.content_id").where("state.source_type", "=", "content").where("state.source_variant", "in", ["columns", "draft_overlay"]).groupBy(["page.collection_slug", "page.content_id"])).selectFrom("entry_state as page").crossJoin("_emdash_media_usage_sources as s").crossJoin("_emdash_media_usage as u").whereRef("page.collection_slug", "=", "s.collection_slug").whereRef("page.content_id", "=", "s.content_id").whereRef("s.source_key", "=", "u.source_key").whereRef("s.current_generation", "=", "u.generation").select(currentUsageSelect).select("page.entry_deleted_at").select(sql`CASE
					WHEN (SELECT COUNT(*) FROM matched_groups) > ${limit} THEN 1
					ELSE 0
				END`.as("has_more")).where("u.media_id", "=", mediaId).where("s.source_type", "=", "content").where("s.collection_slug", "is not", null).where("s.content_id", "is not", null).where("s.source_variant", "in", ["columns", "draft_overlay"]).where(CONTENT_SOURCE_ELIGIBILITY).orderBy("s.collection_slug", "asc").orderBy("s.content_id", "asc").orderBy("s.source_variant", "asc").orderBy("s.source_key", "asc").orderBy("u.field_path", "asc").orderBy("u.occurrence_index", "asc").orderBy("u.id", "asc").execute();
		const items = groupUsageRows(rows);
		const result = { items };
		if (Number(rows[0]?.has_more ?? 0) === 1 && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.collectionSlug, last.contentId);
		}
		return result;
	}
	async findCurrentUsageByMediaId(mediaId) {
		return (await this.db.selectFrom("_emdash_media_usage_sources as s").innerJoin("_emdash_media_usage as u", (join) => join.onRef("u.source_key", "=", "s.source_key").onRef("u.generation", "=", "s.current_generation")).select(currentUsageSelect).where("u.media_id", "=", mediaId).orderBy("s.source_key", "asc").orderBy("u.field_path", "asc").orderBy("u.occurrence_index", "asc").execute()).map(rowToUsageRecord);
	}
	async findCurrentUsageByProviderAsset(provider, providerAssetId) {
		return (await this.db.selectFrom("_emdash_media_usage_sources as s").innerJoin("_emdash_media_usage as u", (join) => join.onRef("u.source_key", "=", "s.source_key").onRef("u.generation", "=", "s.current_generation")).select(currentUsageSelect).where("u.provider", "=", provider).where("u.provider_asset_id", "=", providerAssetId).orderBy("s.source_key", "asc").orderBy("u.field_path", "asc").orderBy("u.occurrence_index", "asc").execute()).map(rowToUsageRecord);
	}
	async findCurrentUsagePageByMediaId(mediaId, options = {}) {
		return this.findCurrentUsagePage((query) => query.where("u.media_id", "=", mediaId), options);
	}
	async findCurrentUsagePageByProviderAsset(provider, providerAssetId, options = {}) {
		return this.findCurrentUsagePage((query) => query.where("u.provider", "=", provider).where("u.provider_asset_id", "=", providerAssetId), options);
	}
	async deleteSource(sourceKey) {
		return this.deleteSources([sourceKey]);
	}
	async deleteSourceIfCurrent(sourceKey, expectedCurrentGeneration) {
		let deleted = false;
		await withTransaction(this.db, async (trx) => {
			const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "=", sourceKey).where("current_generation", "=", expectedCurrentGeneration).executeTakeFirst();
			deleted = Number(result.numDeletedRows ?? 0) > 0;
			if (!deleted) return;
			await this.deleteSourceGenerationOccurrences(trx, sourceKey, expectedCurrentGeneration);
		});
		return {
			deleted,
			source: await this.findSource(sourceKey)
		};
	}
	async deleteSourceIfMatching(sourceKey, expectedSource) {
		let deleted = false;
		await withTransaction(this.db, async (trx) => {
			const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "=", sourceKey).where(this.sourceMatchExpression(expectedSource)).executeTakeFirst();
			deleted = Number(result.numDeletedRows ?? 0) > 0;
			if (!deleted) return;
			await this.deleteSourceGenerationOccurrences(trx, sourceKey, expectedSource.currentGeneration);
		});
		return {
			deleted,
			source: await this.findSource(sourceKey)
		};
	}
	async deleteSourceIfMatchingContentAbsent(sourceKey, expectedSource, collectionSlug, contentId) {
		validateIdentifier(collectionSlug, "collection slug");
		const tableName = `ec_${collectionSlug}`;
		let deleted = false;
		await withTransaction(this.db, async (trx) => {
			const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "=", sourceKey).where(this.sourceMatchExpression(expectedSource)).where(sql`NOT EXISTS (SELECT 1 FROM ${sql.ref(tableName)} WHERE id = ${contentId})`).executeTakeFirst();
			deleted = Number(result.numDeletedRows ?? 0) > 0;
			if (!deleted) return;
			await this.deleteSourceGenerationOccurrences(trx, sourceKey, expectedSource.currentGeneration);
		});
		const contentPresent = deleted ? false : await this.contentRowExists(tableName, contentId);
		return {
			deleted,
			contentPresent,
			source: deleted || contentPresent ? null : await this.findSource(sourceKey)
		};
	}
	async deleteSources(sourceKeys) {
		return this.deleteSourceKeys(sourceKeys);
	}
	async deleteContentSources(collectionSlug, contentId) {
		const sourceKeys = (await this.db.selectFrom("_emdash_media_usage_sources").select("source_key").where("source_type", "=", "content").where("collection_slug", "=", collectionSlug).where("content_id", "=", contentId).execute()).map((row) => row.source_key);
		return this.deleteSourceKeys(sourceKeys);
	}
	async deleteCollectionSources(collectionSlug) {
		let deleted = 0;
		while (true) {
			const sourceRows = await this.db.selectFrom("_emdash_media_usage_sources").select("source_key").where("source_type", "=", "content").where("collection_slug", "=", collectionSlug).orderBy("source_key", "asc").limit(50).execute();
			if (sourceRows.length === 0) break;
			deleted += await this.deleteSourceKeys(sourceRows.map((row) => row.source_key));
		}
		return deleted;
	}
	async findCollectionContentSources(collectionSlug) {
		return (await this.db.selectFrom("_emdash_media_usage_sources").selectAll().where("source_type", "=", "content").where("collection_slug", "=", collectionSlug).orderBy("source_key", "asc").execute()).map((row) => rowToSource(row));
	}
	async deleteOrphanOccurrencesOlderThan(cutoff, limit) {
		const batchLimit = Math.floor(limit);
		if (batchLimit <= 0) return 0;
		const rows = await this.db.selectFrom("_emdash_media_usage as u").leftJoin("_emdash_media_usage_sources as s", (join) => join.onRef("s.source_key", "=", "u.source_key")).select("u.id").where("s.source_key", "is", null).where("u.created_at", "<", cutoff).orderBy("u.created_at", "asc").orderBy("u.id", "asc").limit(batchLimit).execute();
		let deleted = 0;
		for (const idBatch of chunks(rows.map((row) => row.id), 50)) {
			const result = await this.db.deleteFrom("_emdash_media_usage").where("id", "in", idBatch).where("created_at", "<", cutoff).where(sql`NOT EXISTS (SELECT 1 FROM _emdash_media_usage_sources s WHERE s.source_key = _emdash_media_usage.source_key)`).executeTakeFirst();
			deleted += Number(result.numDeletedRows ?? 0);
		}
		return deleted;
	}
	async deleteStaleGenerationsOlderThan(cutoff, limit) {
		const batchLimit = Math.floor(limit);
		if (batchLimit <= 0) return 0;
		const ids = (await this.db.selectFrom("_emdash_media_usage as u").innerJoin("_emdash_media_usage_sources as s", (join) => join.onRef("s.source_key", "=", "u.source_key")).select("u.id").where("u.created_at", "<", cutoff).whereRef("u.generation", "!=", "s.current_generation").whereRef("u.created_at", "<", "s.indexed_at").orderBy("u.created_at", "asc").orderBy("u.id", "asc").limit(batchLimit).execute()).map((row) => row.id);
		if (ids.length === 0) return 0;
		let deleted = 0;
		for (const idBatch of chunks(ids, 50)) {
			const result = await this.db.deleteFrom("_emdash_media_usage").where("id", "in", idBatch).where("created_at", "<", cutoff).where((eb) => eb.exists(eb.selectFrom("_emdash_media_usage_sources as s").select("s.source_key").whereRef("s.source_key", "=", "_emdash_media_usage.source_key").whereRef("s.current_generation", "!=", "_emdash_media_usage.generation").whereRef("_emdash_media_usage.created_at", "<", "s.indexed_at"))).executeTakeFirst();
			deleted += Number(result.numDeletedRows ?? 0);
		}
		return deleted;
	}
	async deleteAbandonedGenerationsOlderThan(cutoff, limit) {
		const batchLimit = Math.floor(limit);
		if (batchLimit <= 0) return 0;
		const rows = await this.db.selectFrom("_emdash_media_usage as u").innerJoin("_emdash_media_usage_sources as s", (join) => join.onRef("s.source_key", "=", "u.source_key")).select("u.id").where("u.created_at", "<", cutoff).whereRef("u.generation", "!=", "s.current_generation").whereRef("u.created_at", ">=", "s.indexed_at").orderBy("u.created_at", "asc").orderBy("u.id", "asc").limit(batchLimit).execute();
		let deleted = 0;
		for (const idBatch of chunks(rows.map((row) => row.id), 50)) {
			const result = await this.db.deleteFrom("_emdash_media_usage").where("id", "in", idBatch).where("created_at", "<", cutoff).where((eb) => eb.exists(eb.selectFrom("_emdash_media_usage_sources as s").select("s.source_key").whereRef("s.source_key", "=", "_emdash_media_usage.source_key").whereRef("s.current_generation", "!=", "_emdash_media_usage.generation").whereRef("_emdash_media_usage.created_at", ">=", "s.indexed_at"))).executeTakeFirst();
			deleted += Number(result.numDeletedRows ?? 0);
		}
		return deleted;
	}
	async upsertIndexStatus(input) {
		const now = input.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
		const row = {
			adapter_id: input.adapterId,
			scope_type: input.scopeType,
			scope_key: input.scopeKey,
			status: input.status,
			schema_version: input.schemaVersion ?? 1,
			started_at: input.startedAt ?? null,
			completed_at: input.completedAt ?? null,
			cursor: input.cursor ?? null,
			indexed_source_count: input.indexedSourceCount ?? 0,
			failed_source_count: input.failedSourceCount ?? 0,
			last_error_code: input.lastErrorCode ?? null,
			updated_at: now
		};
		await this.db.insertInto("_emdash_media_usage_index_status").values(row).onConflict((oc) => oc.columns([
			"adapter_id",
			"scope_type",
			"scope_key"
		]).doUpdateSet({
			status: row.status,
			schema_version: row.schema_version,
			started_at: row.started_at,
			completed_at: row.completed_at,
			cursor: row.cursor,
			indexed_source_count: row.indexed_source_count,
			failed_source_count: row.failed_source_count,
			last_error_code: row.last_error_code,
			updated_at: row.updated_at
		})).execute();
		const status = await this.findIndexStatus(input);
		if (!status) throw new Error(`Media usage index status ${input.adapterId}:${input.scopeType}:${input.scopeKey} was not persisted`);
		return status;
	}
	async beginIndexStatusRepair(input) {
		return this.upsertIndexStatus({
			adapterId: input.adapterId,
			scopeType: input.scopeType,
			scopeKey: input.scopeKey,
			status: "running",
			schemaVersion: input.schemaVersion,
			startedAt: input.startedAt,
			completedAt: null,
			cursor: input.runToken,
			indexedSourceCount: 0,
			failedSourceCount: 0,
			lastErrorCode: null,
			updatedAt: input.updatedAt
		});
	}
	async finalizeIndexStatusRepairIfRunning(input) {
		const updates = {
			status: input.status,
			completed_at: input.completedAt,
			cursor: null,
			indexed_source_count: input.indexedSourceCount ?? 0,
			failed_source_count: input.failedSourceCount ?? 0,
			last_error_code: input.lastErrorCode ?? null,
			updated_at: input.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString()
		};
		if (input.schemaVersion !== void 0) updates.schema_version = input.schemaVersion;
		const result = await this.db.updateTable("_emdash_media_usage_index_status").set(updates).where("adapter_id", "=", input.adapterId).where("scope_type", "=", input.scopeType).where("scope_key", "=", input.scopeKey).where("status", "=", "running").where("cursor", "=", input.runToken).executeTakeFirst();
		return {
			finalized: Number(result.numUpdatedRows ?? 0) > 0,
			status: await this.findIndexStatus(input)
		};
	}
	async findIndexStatus(identity) {
		const row = await this.db.selectFrom("_emdash_media_usage_index_status").selectAll().where("adapter_id", "=", identity.adapterId).where("scope_type", "=", identity.scopeType).where("scope_key", "=", identity.scopeKey).executeTakeFirst();
		return row ? rowToIndexStatus(row) : null;
	}
	async deleteIndexStatus(identity) {
		const result = await this.db.deleteFrom("_emdash_media_usage_index_status").where("adapter_id", "=", identity.adapterId).where("scope_type", "=", identity.scopeType).where("scope_key", "=", identity.scopeKey).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	async findCurrentUsagePage(applyFilter, options) {
		const limit = Math.min(Math.max(1, options.limit ?? 50), 100);
		let query = applyFilter(this.currentUsageBaseQuery()).orderBy("u.id", "asc").limit(limit + 1);
		if (options.cursor) {
			const { id } = decodeCursor(options.cursor);
			query = query.where("u.id", ">", id);
		}
		const rows = await query.execute();
		const items = rows.slice(0, limit).map(rowToUsageRecord);
		const result = { items };
		if (rows.length > limit && items.length > 0) {
			const last = items.at(-1);
			result.nextCursor = encodeCursor(last.occurrence.id, last.occurrence.id);
		}
		return result;
	}
	currentUsageBaseQuery() {
		return this.db.selectFrom("_emdash_media_usage_sources as s").innerJoin("_emdash_media_usage as u", (join) => join.onRef("u.source_key", "=", "s.source_key").onRef("u.generation", "=", "s.current_generation")).select(currentUsageSelect);
	}
	currentContentMediaUsageBaseQuery() {
		return this.db.selectFrom("_emdash_media_usage as u").crossJoin("_emdash_media_usage_sources as s").innerJoin("_emdash_collections as collection", "collection.slug", "s.collection_slug").whereRef("s.source_key", "=", "u.source_key").whereRef("s.current_generation", "=", "u.generation").where("s.source_type", "=", "content").where("s.collection_slug", "is not", null).where("s.content_id", "is not", null).where("s.source_variant", "in", ["columns", "draft_overlay"]).where(CONTENT_SOURCE_ELIGIBILITY);
	}
	async deleteSourceKeys(sourceKeys) {
		const uniqueSourceKeys = [...new Set(sourceKeys)];
		if (uniqueSourceKeys.length === 0) return 0;
		return withTransaction(this.db, async (trx) => {
			let deleted = 0;
			for (const sourceKeyBatch of chunks(uniqueSourceKeys, 50)) {
				const result = await trx.deleteFrom("_emdash_media_usage_sources").where("source_key", "in", sourceKeyBatch).executeTakeFirst();
				deleted += Number(result.numDeletedRows ?? 0);
				await trx.deleteFrom("_emdash_media_usage").where("source_key", "in", sourceKeyBatch).execute();
			}
			return deleted;
		});
	}
	async deleteSourceGenerationOccurrences(db, sourceKey, generation) {
		await db.deleteFrom("_emdash_media_usage").where("source_key", "=", sourceKey).where("generation", "=", generation).execute();
	}
	async insertOccurrences(db, sourceKey, generation, occurrences, now) {
		if (occurrences.length === 0) return;
		const rows = occurrences.map((occurrence) => ({
			id: ulid(),
			source_key: sourceKey,
			generation,
			field_slug: occurrence.fieldSlug,
			field_path: occurrence.fieldPath,
			occurrence_index: occurrence.occurrenceIndex ?? 0,
			reference_type: occurrence.referenceType,
			media_id: occurrence.mediaId,
			provider: occurrence.provider,
			provider_asset_id: occurrence.providerAssetId,
			media_kind: occurrence.mediaKind ?? null,
			mime_type: occurrence.mimeType ?? null,
			created_at: now
		}));
		for (const rowBatch of chunks(rows, OCCURRENCE_INSERT_BATCH_SIZE)) await db.insertInto("_emdash_media_usage").values(rowBatch).execute();
	}
	async upsertSource(db, source, generation, now) {
		const row = this.buildSourceRow(source, generation, now);
		await db.insertInto("_emdash_media_usage_sources").values(row).onConflict((oc) => oc.column("source_key").doUpdateSet(this.sourceUpdateSet(row))).execute();
	}
	async insertSourceIfAbsent(db, row) {
		return ((await db.insertInto("_emdash_media_usage_sources").values(row).onConflict((oc) => oc.column("source_key").doNothing()).executeTakeFirst()).numInsertedOrUpdatedRows ?? 0n) > 0n;
	}
	async updateSourceIfGeneration(db, row, expectedCurrentGeneration) {
		const result = await db.updateTable("_emdash_media_usage_sources").set(this.sourceUpdateSet(row)).where("source_key", "=", row.source_key).where("current_generation", "=", expectedCurrentGeneration).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	async updateSourceIfMatching(db, row, expectedSource) {
		const result = await db.updateTable("_emdash_media_usage_sources").set(this.sourceUpdateSet(row)).where("source_key", "=", row.source_key).where(this.sourceMatchExpression(expectedSource)).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	async updateAttemptedSourceIfMatching(db, source, row, expectedSource) {
		const result = await db.updateTable("_emdash_media_usage_sources").set(this.attemptedSourceUpdateSet(source, row)).where("source_key", "=", row.source_key).where(this.sourceMatchExpression(expectedSource)).executeTakeFirst();
		return Number(result.numUpdatedRows ?? 0) > 0;
	}
	sourceMatchExpression(expectedSource) {
		return (eb) => eb.and([
			eb("current_generation", "=", expectedSource.currentGeneration),
			eb("source_completeness", "=", expectedSource.sourceCompleteness),
			this.nullableStringExpression(eb, "updated_at", expectedSource.updatedAt),
			this.nullableStringExpression(eb, "source_fingerprint", expectedSource.sourceFingerprint),
			this.nullableStringExpression(eb, "source_updated_at", expectedSource.sourceUpdatedAt),
			this.nullableNumberExpression(eb, "source_version", expectedSource.sourceVersion),
			this.nullableStringExpression(eb, "revision_id", expectedSource.revisionId),
			this.nullableStringExpression(eb, "last_attempted_at", expectedSource.lastAttemptedAt),
			this.nullableStringExpression(eb, "last_error_code", expectedSource.lastErrorCode)
		]);
	}
	nullableStringExpression(eb, column, value) {
		return value === null ? eb(column, "is", null) : eb(column, "=", value);
	}
	nullableNumberExpression(eb, column, value) {
		return value === null ? eb(column, "is", null) : eb(column, "=", value);
	}
	async contentRowExists(tableName, contentId) {
		return (await sql`
			SELECT id
			FROM ${sql.ref(tableName)}
			WHERE id = ${contentId}
			LIMIT 1
		`.execute(this.db)).rows.length > 0;
	}
	buildSourceRow(source, generation, now) {
		return {
			source_key: source.sourceKey,
			source_type: source.sourceType,
			collection_slug: source.collectionSlug ?? null,
			content_id: source.contentId ?? null,
			source_variant: source.sourceVariant,
			locale: source.locale ?? null,
			translation_group: source.translationGroup ?? null,
			content_slug: source.contentSlug ?? null,
			content_title: source.contentTitle ?? null,
			content_status: source.contentStatus ?? null,
			content_scheduled_at: source.contentScheduledAt ?? null,
			content_deleted_at: source.contentDeletedAt ?? null,
			revision_id: source.revisionId ?? null,
			current_generation: generation,
			schema_version: source.schemaVersion ?? 1,
			source_updated_at: source.sourceUpdatedAt ?? null,
			source_version: source.sourceVersion ?? null,
			source_fingerprint: source.sourceFingerprint ?? null,
			source_completeness: source.sourceCompleteness ?? "complete",
			last_attempted_at: source.lastAttemptedAt ?? now,
			last_error_code: null,
			indexed_at: now,
			updated_at: now
		};
	}
	buildAttemptedSourceRow(source, now) {
		return {
			source_key: source.sourceKey,
			source_type: source.sourceType,
			collection_slug: source.collectionSlug ?? null,
			content_id: source.contentId ?? null,
			source_variant: source.sourceVariant,
			locale: source.locale ?? null,
			translation_group: source.translationGroup ?? null,
			content_slug: source.contentSlug ?? null,
			content_title: source.contentTitle ?? null,
			content_status: source.contentStatus ?? null,
			content_scheduled_at: source.contentScheduledAt ?? null,
			content_deleted_at: source.contentDeletedAt ?? null,
			revision_id: source.revisionId ?? null,
			current_generation: ulid(),
			schema_version: source.schemaVersion ?? 1,
			source_updated_at: source.sourceUpdatedAt ?? null,
			source_version: source.sourceVersion ?? null,
			source_fingerprint: source.sourceFingerprint ?? null,
			source_completeness: source.sourceCompleteness ?? (source.lastErrorCode ? "failed" : "unknown"),
			last_attempted_at: source.lastAttemptedAt ?? now,
			last_error_code: source.lastErrorCode ?? null,
			indexed_at: now,
			updated_at: now
		};
	}
	attemptedSourceUpdateSet(source, row) {
		const updates = {
			source_type: row.source_type,
			source_variant: row.source_variant,
			source_completeness: row.source_completeness,
			last_attempted_at: row.last_attempted_at,
			last_error_code: row.last_error_code,
			updated_at: row.updated_at
		};
		if (source.collectionSlug !== void 0) updates.collection_slug = row.collection_slug;
		if (source.contentId !== void 0) updates.content_id = row.content_id;
		if (source.locale !== void 0) updates.locale = row.locale;
		if (source.translationGroup !== void 0) updates.translation_group = row.translation_group;
		if (source.contentSlug !== void 0) updates.content_slug = row.content_slug;
		if (source.contentTitle !== void 0) updates.content_title = row.content_title;
		if (source.contentStatus !== void 0) updates.content_status = row.content_status;
		if (source.contentScheduledAt !== void 0) updates.content_scheduled_at = row.content_scheduled_at;
		if (source.contentDeletedAt !== void 0) updates.content_deleted_at = row.content_deleted_at;
		if (source.revisionId !== void 0) updates.revision_id = row.revision_id;
		if (source.schemaVersion !== void 0) updates.schema_version = row.schema_version;
		if (source.sourceUpdatedAt !== void 0) updates.source_updated_at = row.source_updated_at;
		if (source.sourceVersion !== void 0) updates.source_version = row.source_version;
		if (source.sourceFingerprint !== void 0) updates.source_fingerprint = row.source_fingerprint;
		return updates;
	}
	sourceUpdateSet(row) {
		return {
			source_type: row.source_type,
			collection_slug: row.collection_slug,
			content_id: row.content_id,
			source_variant: row.source_variant,
			locale: row.locale,
			translation_group: row.translation_group,
			content_slug: row.content_slug,
			content_title: row.content_title,
			content_status: row.content_status,
			content_scheduled_at: row.content_scheduled_at,
			content_deleted_at: row.content_deleted_at,
			revision_id: row.revision_id,
			current_generation: row.current_generation,
			schema_version: row.schema_version,
			source_updated_at: row.source_updated_at,
			source_version: row.source_version,
			source_fingerprint: row.source_fingerprint,
			source_completeness: row.source_completeness,
			last_attempted_at: row.last_attempted_at,
			last_error_code: row.last_error_code,
			indexed_at: row.indexed_at,
			updated_at: row.updated_at
		};
	}
};
var currentUsageSelect = [
	"s.source_key as source_key",
	"s.source_type as source_type",
	"s.collection_slug as collection_slug",
	"s.content_id as content_id",
	"s.source_variant as source_variant",
	"s.locale as locale",
	"s.translation_group as translation_group",
	"s.content_slug as content_slug",
	"s.content_title as content_title",
	"s.content_status as content_status",
	"s.content_scheduled_at as content_scheduled_at",
	"s.content_deleted_at as content_deleted_at",
	"s.revision_id as revision_id",
	"s.current_generation as current_generation",
	"s.schema_version as schema_version",
	"s.source_updated_at as source_updated_at",
	"s.source_version as source_version",
	"s.source_fingerprint as source_fingerprint",
	"s.source_completeness as source_completeness",
	"s.last_attempted_at as last_attempted_at",
	"s.last_error_code as last_error_code",
	"s.indexed_at as indexed_at",
	"s.created_at as source_created_at",
	"s.updated_at as source_row_updated_at",
	"u.id as occurrence_id",
	"u.generation as generation",
	"u.field_slug as field_slug",
	"u.field_path as field_path",
	"u.occurrence_index as occurrence_index",
	"u.reference_type as reference_type",
	"u.media_id as media_id",
	"u.provider as provider",
	"u.provider_asset_id as provider_asset_id",
	"u.media_kind as media_kind",
	"u.mime_type as mime_type",
	"u.created_at as occurrence_created_at"
];
function groupUsageRows(rows) {
	const groups = [];
	for (const row of rows) {
		if (row.collection_slug === null || row.content_id === null) continue;
		const record = rowToUsageRecord(row);
		let group = groups.at(-1);
		if (!group || group.collectionSlug !== row.collection_slug || group.contentId !== row.content_id) {
			group = {
				collectionSlug: row.collection_slug,
				contentId: row.content_id,
				contentDeletedAt: row.entry_deleted_at,
				sources: []
			};
			groups.push(group);
		}
		let source = group.sources.at(-1);
		if (!source || source.source.sourceKey !== record.source.sourceKey) {
			source = {
				source: record.source,
				occurrences: []
			};
			group.sources.push(source);
		}
		source.occurrences.push(record.occurrence);
	}
	return groups;
}
function rowToSource(row) {
	return {
		sourceKey: row.source_key,
		sourceType: row.source_type,
		collectionSlug: row.collection_slug,
		contentId: row.content_id,
		sourceVariant: row.source_variant,
		locale: row.locale,
		translationGroup: row.translation_group,
		contentSlug: row.content_slug,
		contentTitle: row.content_title,
		contentStatus: row.content_status,
		contentScheduledAt: row.content_scheduled_at,
		contentDeletedAt: row.content_deleted_at,
		revisionId: row.revision_id,
		currentGeneration: row.current_generation,
		schemaVersion: Number(row.schema_version),
		sourceUpdatedAt: row.source_updated_at,
		sourceVersion: row.source_version === null ? null : Number(row.source_version),
		sourceFingerprint: row.source_fingerprint,
		sourceCompleteness: row.source_completeness,
		lastAttemptedAt: row.last_attempted_at,
		lastErrorCode: row.last_error_code,
		indexedAt: row.indexed_at,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function rowToOccurrence(row) {
	return {
		id: row.id,
		sourceKey: row.source_key,
		generation: row.generation,
		fieldSlug: row.field_slug,
		fieldPath: row.field_path,
		occurrenceIndex: Number(row.occurrence_index),
		referenceType: row.reference_type,
		mediaId: row.media_id,
		provider: row.provider,
		providerAssetId: row.provider_asset_id,
		mediaKind: row.media_kind,
		mimeType: row.mime_type,
		createdAt: row.created_at
	};
}
function rowToUsageRecord(row) {
	return {
		source: rowToSource({
			source_key: row.source_key,
			source_type: row.source_type,
			collection_slug: row.collection_slug,
			content_id: row.content_id,
			source_variant: row.source_variant,
			locale: row.locale,
			translation_group: row.translation_group,
			content_slug: row.content_slug,
			content_title: row.content_title,
			content_status: row.content_status,
			content_scheduled_at: row.content_scheduled_at,
			content_deleted_at: row.content_deleted_at,
			revision_id: row.revision_id,
			current_generation: row.current_generation,
			schema_version: row.schema_version,
			source_updated_at: row.source_updated_at,
			source_version: row.source_version,
			source_fingerprint: row.source_fingerprint,
			source_completeness: row.source_completeness,
			last_attempted_at: row.last_attempted_at,
			last_error_code: row.last_error_code,
			indexed_at: row.indexed_at,
			created_at: row.source_created_at,
			updated_at: row.source_row_updated_at
		}),
		occurrence: rowToOccurrence({
			id: row.occurrence_id,
			source_key: row.source_key,
			generation: row.generation,
			field_slug: row.field_slug,
			field_path: row.field_path,
			occurrence_index: row.occurrence_index,
			reference_type: row.reference_type,
			media_id: row.media_id,
			provider: row.provider,
			provider_asset_id: row.provider_asset_id,
			media_kind: row.media_kind,
			mime_type: row.mime_type,
			created_at: row.occurrence_created_at
		})
	};
}
function rowToIndexStatus(row) {
	return {
		adapterId: row.adapter_id,
		scopeType: row.scope_type,
		scopeKey: row.scope_key,
		status: row.status,
		schemaVersion: Number(row.schema_version),
		startedAt: row.started_at,
		completedAt: row.completed_at,
		cursor: row.cursor,
		indexedSourceCount: Number(row.indexed_source_count),
		failedSourceCount: Number(row.failed_source_count),
		lastErrorCode: row.last_error_code,
		updatedAt: row.updated_at
	};
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/media/normalize.ts
var INTERNAL_MEDIA_PREFIX = "/_emdash/api/media/file/";
//#endregion
//#region self-essentials/emdash-main/packages/core/src/media/usage/content-refresh.ts
var CONTENT_MEDIA_USAGE_ADAPTER_ID = "content-media";
var CONTENT_MEDIA_USAGE_COLLECTION_SCOPE = "collection";
var CONTENT_USAGE_COLLECTION_LOCKS_KEY = Symbol.for("emdash.mediaUsage.collectionLocks");
var ZERO_RESULT = {
	success: true,
	refreshedSourceCount: 0,
	deletedSourceCount: 0,
	failedSourceCount: 0
};
async function deleteContentMediaUsageCollection(db, collectionSlug) {
	validateIdentifier(collectionSlug, "collection slug");
	return withContentUsageCollectionLock(collectionSlug, () => deleteContentMediaUsageCollectionUnlocked(db, collectionSlug));
}
async function deleteContentMediaUsageCollectionUnlocked(db, collectionSlug) {
	try {
		const repo = new MediaUsageRepository(db);
		const deletedSourceCount = await repo.deleteCollectionSources(collectionSlug);
		await repo.deleteIndexStatus({
			adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
			scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE,
			scopeKey: collectionSlug
		});
		return {
			...ZERO_RESULT,
			deletedSourceCount
		};
	} catch (error) {
		console.error(`[media-usage] Failed to delete usage for collection ${collectionSlug}:`, error);
		try {
			await new MediaUsageRepository(db).deleteIndexStatus({
				adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
				scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE,
				scopeKey: collectionSlug
			});
		} catch (statusError) {
			console.error(`[media-usage] Failed to clear usage status for deleted collection ${collectionSlug}:`, statusError);
		}
		return {
			success: false,
			refreshedSourceCount: 0,
			deletedSourceCount: 0,
			failedSourceCount: 0,
			errorCode: "CONTENT_USAGE_DELETE_ERROR"
		};
	}
}
async function markContentMediaUsageCollectionStale(db, collectionSlug, lastErrorCode) {
	validateIdentifier(collectionSlug, "collection slug");
	const repo = new MediaUsageRepository(db);
	const identity = {
		adapterId: CONTENT_MEDIA_USAGE_ADAPTER_ID,
		scopeType: CONTENT_MEDIA_USAGE_COLLECTION_SCOPE,
		scopeKey: collectionSlug
	};
	const existing = await repo.findIndexStatus(identity);
	await repo.upsertIndexStatus({
		...identity,
		status: "stale",
		schemaVersion: existing?.schemaVersion ?? 1,
		startedAt: existing?.startedAt ?? null,
		completedAt: existing?.completedAt ?? null,
		cursor: existing?.cursor ?? null,
		indexedSourceCount: existing?.indexedSourceCount ?? 0,
		failedSourceCount: existing?.failedSourceCount ?? 0,
		lastErrorCode
	});
}
async function markContentMediaUsageCollectionStaleSafely(db, collectionSlug, lastErrorCode) {
	try {
		await markContentMediaUsageCollectionStale(db, collectionSlug, lastErrorCode);
		return true;
	} catch (error) {
		console.error(`[media-usage] Failed to mark ${collectionSlug} stale:`, error);
		return false;
	}
}
async function withContentUsageCollectionLock(collectionSlug, fn) {
	const locks = getContentUsageCollectionLocks();
	const previous = locks.get(collectionSlug) ?? Promise.resolve();
	let releaseCurrent;
	const current = new Promise((resolve) => {
		releaseCurrent = resolve;
	});
	const next = previous.catch(() => {}).then(() => current);
	locks.set(collectionSlug, next);
	try {
		await previous.catch(() => {});
		return await fn();
	} finally {
		releaseCurrent();
		if (locks.get(collectionSlug) === next) locks.delete(collectionSlug);
	}
}
function getContentUsageCollectionLocks() {
	const global = globalThis;
	const existing = global[CONTENT_USAGE_COLLECTION_LOCKS_KEY];
	if (existing instanceof Map) return existing;
	const locks = /* @__PURE__ */ new Map();
	global[CONTENT_USAGE_COLLECTION_LOCKS_KEY] = locks;
	return locks;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/search/fts-manager.ts
/**
* FTS5 Manager
*
* Handles creation, deletion, and management of FTS5 virtual tables
* for full-text search on content collections.
*/
var FTSManager = class {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* Validate a collection slug and its searchable field names.
	* Must be called before any raw SQL interpolation.
	*/
	validateInputs(collectionSlug, searchableFields) {
		validateIdentifier(collectionSlug, "collection slug");
		if (searchableFields) for (const field of searchableFields) validateIdentifier(field, "searchable field name");
	}
	/**
	* Get the FTS table name for a collection
	* Uses _emdash_ prefix to clearly mark as internal/system table
	*/
	getFtsTableName(collectionSlug) {
		validateIdentifier(collectionSlug, "collection slug");
		return `_emdash_fts_${collectionSlug}`;
	}
	/**
	* Get the content table name for a collection
	*/
	getContentTableName(collectionSlug) {
		validateIdentifier(collectionSlug, "collection slug");
		return `ec_${collectionSlug}`;
	}
	/**
	* Check if an FTS table exists for a collection
	*/
	async ftsTableExists(collectionSlug) {
		const ftsTable = this.getFtsTableName(collectionSlug);
		return tableExists(this.db, ftsTable);
	}
	/**
	* Create an FTS5 virtual table for a collection.
	* FTS5 is SQLite-only; on other dialects this is a no-op.
	*
	* @param collectionSlug - The collection slug
	* @param searchableFields - Array of field names to index
	* @param weights - Optional field weights for ranking
	*/
	async createFtsTable(collectionSlug, searchableFields, _weights) {
		if (!isSqlite(this.db)) return;
		this.validateInputs(collectionSlug, searchableFields);
		const ftsTable = this.getFtsTableName(collectionSlug);
		const contentTable = this.getContentTableName(collectionSlug);
		const columns = [
			"id UNINDEXED",
			"locale UNINDEXED",
			...searchableFields
		].join(", ");
		await sql.raw(`
			CREATE VIRTUAL TABLE IF NOT EXISTS "${ftsTable}" USING fts5(
				${columns},
				content='${contentTable}',
				content_rowid='rowid',
				tokenize='porter unicode61'
			)
		`).execute(this.db);
		await this.createTriggers(collectionSlug, searchableFields);
	}
	/**
	* Create triggers to keep FTS table in sync with content table.
	*
	* The insert and update triggers only add rows to the FTS index when
	* `deleted_at IS NULL`. This keeps soft-deleted content out of the
	* search index and ensures the FTS row count matches the non-deleted
	* content count (which `verifyAndRepairIndex` relies on).
	*
	* IMPORTANT: The FTS5 virtual table is created with `content='ec_<slug>'`
	* which makes it an *external content* FTS5 table. For external-content
	* tables, removing a row must use the documented `'delete'` command and
	* supply the OLD column values explicitly, e.g.:
	*
	*     INSERT INTO fts(fts, rowid, col1, col2)
	*     VALUES('delete', OLD.rowid, OLD.col1, OLD.col2);
	*
	* Using `DELETE FROM fts WHERE rowid = OLD.rowid` is the correct form
	* for *contentless* tables but is unsafe for external-content tables:
	* FTS5 then reads column values from the backing content table, which
	* in an AFTER UPDATE trigger already holds the NEW values. The wrong
	* tokens get removed and the inverted index drifts out of sync until
	* SQLite raises `SQLITE_CORRUPT_VTAB` on the next mutation. See
	* https://www.sqlite.org/fts5.html#external_content_tables.
	*
	* The UPDATE and DELETE triggers gate the `'delete'` on
	* `OLD.deleted_at IS NULL` because the INSERT trigger never indexed
	* rows that were already soft-deleted. Issuing `'delete'` for a rowid
	* that was never inserted into the FTS index is itself a corruption
	* trigger -- FTS5's `'delete'` is not a no-op on missing rowids and
	* raises `SQLITE_CORRUPT_VTAB`. Affected paths include restore-from-
	* trash (UPDATE where `OLD.deleted_at IS NOT NULL`), permanent-delete
	* from trash (DELETE on a soft-deleted row), and any edit on a row
	* that's currently in the trash.
	*/
	async createTriggers(collectionSlug, searchableFields) {
		this.validateInputs(collectionSlug, searchableFields);
		if (searchableFields.length === 0) throw new Error(`Cannot create FTS triggers for collection "${collectionSlug}": no searchable fields. Mark at least one field as searchable before enabling search.`);
		const ftsTable = this.getFtsTableName(collectionSlug);
		const contentTable = this.getContentTableName(collectionSlug);
		const fieldList = searchableFields.join(", ");
		const newFieldList = searchableFields.map((f) => `NEW.${f}`).join(", ");
		const oldFieldList = searchableFields.map((f) => `OLD.${f}`).join(", ");
		await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_insert" 
			AFTER INSERT ON "${contentTable}" 
			WHEN NEW.deleted_at IS NULL
			BEGIN
				INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
				VALUES (NEW.rowid, NEW.id, NEW.locale, ${newFieldList});
			END
		`).execute(this.db);
		await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_update" 
			AFTER UPDATE ON "${contentTable}" 
			BEGIN
				INSERT INTO "${ftsTable}"("${ftsTable}", rowid, id, locale, ${fieldList})
				SELECT 'delete', OLD.rowid, OLD.id, OLD.locale, ${oldFieldList}
				WHERE OLD.deleted_at IS NULL;
				INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
				SELECT NEW.rowid, NEW.id, NEW.locale, ${newFieldList}
				WHERE NEW.deleted_at IS NULL;
			END
		`).execute(this.db);
		await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_delete" 
			AFTER DELETE ON "${contentTable}" 
			BEGIN
				INSERT INTO "${ftsTable}"("${ftsTable}", rowid, id, locale, ${fieldList})
				SELECT 'delete', OLD.rowid, OLD.id, OLD.locale, ${oldFieldList}
				WHERE OLD.deleted_at IS NULL;
			END
		`).execute(this.db);
	}
	/**
	* Drop triggers for a collection
	*/
	async dropTriggers(collectionSlug) {
		this.validateInputs(collectionSlug);
		const ftsTable = this.getFtsTableName(collectionSlug);
		await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_insert"`).execute(this.db);
		await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_update"`).execute(this.db);
		await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_delete"`).execute(this.db);
	}
	/**
	* Drop the FTS table and triggers for a collection
	*/
	async dropFtsTable(collectionSlug) {
		if (!isSqlite(this.db)) return;
		this.validateInputs(collectionSlug);
		const ftsTable = this.getFtsTableName(collectionSlug);
		await this.dropTriggers(collectionSlug);
		await sql.raw(`DROP TABLE IF EXISTS "${ftsTable}"`).execute(this.db);
	}
	/**
	* Rebuild the FTS index for a collection
	*
	* This is useful after bulk imports or if the index gets out of sync.
	*/
	async rebuildIndex(collectionSlug, searchableFields, weights) {
		if (!isSqlite(this.db)) return;
		await this.dropFtsTable(collectionSlug);
		await this.createFtsTable(collectionSlug, searchableFields, weights);
		await this.populateFromContent(collectionSlug, searchableFields);
	}
	/**
	* Populate the FTS table from existing content
	*/
	async populateFromContent(collectionSlug, searchableFields) {
		if (!isSqlite(this.db)) return;
		this.validateInputs(collectionSlug, searchableFields);
		const ftsTable = this.getFtsTableName(collectionSlug);
		const contentTable = this.getContentTableName(collectionSlug);
		const fieldList = searchableFields.join(", ");
		await sql.raw(`
			INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
			SELECT rowid, id, locale, ${fieldList} FROM "${contentTable}"
			WHERE deleted_at IS NULL
		`).execute(this.db);
	}
	/**
	* Get the search configuration for a collection
	*/
	async getSearchConfig(collectionSlug) {
		const result = await this.db.selectFrom("_emdash_collections").select("search_config").where("slug", "=", collectionSlug).executeTakeFirst();
		if (!result?.search_config) return null;
		try {
			const parsed = JSON.parse(result.search_config);
			if (typeof parsed !== "object" || parsed === null || !("enabled" in parsed) || typeof parsed.enabled !== "boolean") return null;
			const config = { enabled: parsed.enabled };
			if ("weights" in parsed && typeof parsed.weights === "object" && parsed.weights !== null) {
				const weights = {};
				for (const [k, v] of Object.entries(parsed.weights)) if (typeof v === "number") weights[k] = v;
				config.weights = weights;
			}
			return config;
		} catch {
			return null;
		}
	}
	/**
	* Update the search configuration for a collection
	*/
	async setSearchConfig(collectionSlug, config) {
		await this.db.updateTable("_emdash_collections").set({ search_config: JSON.stringify(config) }).where("slug", "=", collectionSlug).execute();
	}
	/**
	* Get searchable fields for a collection
	*/
	async getSearchableFields(collectionSlug) {
		const collection = await this.db.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
		if (!collection) return [];
		return (await this.db.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("searchable", "=", 1).execute()).map((f) => f.slug);
	}
	/**
	* Whether a collection has a user-defined `title` field.
	*
	* `title` is not a system column on `ec_*` tables -- it exists only when a
	* collection defines a field with slug `title`. Search and suggestion SQL
	* that selects `c.title` must check this first; otherwise collections
	* without a title field raise "no such column: c.title" (#1178).
	*/
	async hasTitleColumn(collectionSlug) {
		return (await this.getCollectionsWithTitleColumn([collectionSlug])).has(collectionSlug);
	}
	/**
	* Bulk variant of `hasTitleColumn()`: which of the given collections have
	* a user-defined `title` field. One query instead of one `hasTitleColumn`
	* round-trip pair per collection -- callers that check this once per
	* collection in a loop (multi-collection search, suggestions) should use
	* this instead (AGENTS.md: "one query beats two").
	*/
	async getCollectionsWithTitleColumn(collectionSlugs) {
		if (collectionSlugs.length === 0) return /* @__PURE__ */ new Set();
		const rows = await this.db.selectFrom("_emdash_fields as f").innerJoin("_emdash_collections as c", "c.id", "f.collection_id").select(["c.slug as collection_slug"]).where("f.slug", "=", "title").execute();
		const withTitle = new Set(rows.map((r) => r.collection_slug));
		return new Set(collectionSlugs.filter((slug) => withTitle.has(slug)));
	}
	/**
	* Enable search for a collection.
	*
	* Uses rebuildIndex to ensure a clean state -- drop any existing FTS
	* table/triggers, recreate them, and populate from content. This avoids
	* duplicate rows when triggers have already populated the index (e.g.
	* during seeding where content is inserted before search is enabled).
	*/
	async enableSearch(collectionSlug, options) {
		if (!isSqlite(this.db)) throw new Error("Full-text search is only available with SQLite databases");
		const searchableFields = await this.getSearchableFields(collectionSlug);
		if (searchableFields.length === 0) throw new Error(`No searchable fields defined for collection "${collectionSlug}". Mark at least one field as searchable before enabling search.`);
		await this.rebuildIndex(collectionSlug, searchableFields, options?.weights);
		await this.setSearchConfig(collectionSlug, {
			enabled: true,
			weights: options?.weights
		});
	}
	/**
	* Disable search for a collection
	*
	* Drops the FTS table and triggers.
	*/
	async disableSearch(collectionSlug) {
		if (!isSqlite(this.db)) return;
		await this.dropFtsTable(collectionSlug);
		const existing = await this.getSearchConfig(collectionSlug);
		await this.setSearchConfig(collectionSlug, {
			enabled: false,
			weights: existing?.weights
		});
	}
	/**
	* Get index statistics for a collection
	*/
	async getIndexStats(collectionSlug) {
		if (!isSqlite(this.db)) return null;
		this.validateInputs(collectionSlug);
		const ftsDocsizeTable = `${this.getFtsTableName(collectionSlug)}_docsize`;
		if (!await this.ftsTableExists(collectionSlug)) return null;
		return { indexed: (await sql`
			SELECT COUNT(*) as count FROM "${sql.raw(ftsDocsizeTable)}"
		`.execute(this.db)).rows[0]?.count ?? 0 };
	}
	/**
	* Verify FTS index integrity and rebuild if drift is detected.
	*
	* Cheap belt-and-braces check, run lazily on the first search request
	* per isolate. The expensive cases (corrupted indexes from pre-fix
	* EmDash versions, broken legacy triggers) are handled at boot time by
	* migration `039_fix_fts5_triggers`, not here. This routine sticks to:
	*
	*   1. FTS table missing while config says search is enabled -> rebuild.
	*   2. Row count mismatch between content table and FTS docsize -> rebuild.
	*
	* Returns true if the index was rebuilt, false if it was healthy.
	*/
	async verifyAndRepairIndex(collectionSlug) {
		if (!isSqlite(this.db)) return false;
		this.validateInputs(collectionSlug);
		const ftsDocsizeTable = `${this.getFtsTableName(collectionSlug)}_docsize`;
		const contentTable = this.getContentTableName(collectionSlug);
		const fields = await this.getSearchableFields(collectionSlug);
		const config = await this.getSearchConfig(collectionSlug);
		if (!await this.ftsTableExists(collectionSlug)) {
			if (!config?.enabled || fields.length === 0) return false;
			console.warn(`FTS index for "${collectionSlug}" is missing. Rebuilding.`);
			await this.rebuildIndex(collectionSlug, fields, config.weights);
			return true;
		}
		const contentCount = await sql`
			SELECT COUNT(*) as count FROM ${sql.ref(contentTable)}
			WHERE deleted_at IS NULL
		`.execute(this.db);
		const ftsCount = await sql`
			SELECT COUNT(*) as count FROM "${sql.raw(ftsDocsizeTable)}"
		`.execute(this.db);
		const contentRows = contentCount.rows[0]?.count ?? 0;
		const ftsRows = ftsCount.rows[0]?.count ?? 0;
		if (contentRows !== ftsRows) {
			console.warn(`FTS index for "${collectionSlug}" has ${ftsRows} rows but content table has ${contentRows}. Rebuilding.`);
			if (fields.length > 0) await this.rebuildIndex(collectionSlug, fields, config?.weights);
			return true;
		}
		return false;
	}
	/**
	* Verify and repair FTS indexes for all search-enabled collections.
	*
	* Intended to run at startup to auto-heal any corruption from
	* previous process crashes.
	*/
	async verifyAndRepairAll() {
		if (!isSqlite(this.db)) return 0;
		const collections = await this.db.selectFrom("_emdash_collections").select("slug").where("search_config", "is not", null).execute();
		let repaired = 0;
		for (const { slug } of collections) {
			if (!(await this.getSearchConfig(slug))?.enabled) continue;
			try {
				if (await this.verifyAndRepairIndex(slug)) repaired++;
			} catch (error) {
				console.error(`Failed to verify/repair FTS index for "${slug}":`, error);
			}
		}
		return repaired;
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/schema/registry.ts
var SLUG_VALIDATION_PATTERN = /^[a-z][a-z0-9_]*$/;
var EC_PREFIX_PATTERN = /^ec_/;
var SINGLE_QUOTE_PATTERN = /'/g;
var UNDERSCORE_PATTERN = /_/g;
var WORD_BOUNDARY_PATTERN = /\b\w/g;
/** Valid column types for runtime validation */
var COLUMN_TYPES = /* @__PURE__ */ new Set([
	"TEXT",
	"REAL",
	"INTEGER",
	"JSON"
]);
var COLUMN_TYPE_TO_DATA_TYPE = {
	TEXT: "text",
	REAL: "real",
	INTEGER: "integer",
	JSON: "json"
};
/** Valid collection source prefixes/values */
var VALID_SOURCES = /* @__PURE__ */ new Set([
	"manual",
	"discovered",
	"seed"
]);
function isCollectionSource(value) {
	return VALID_SOURCES.has(value) || value.startsWith("template:") || value.startsWith("import:");
}
function isFieldType(value) {
	return value in FIELD_TYPE_TO_COLUMN;
}
function isColumnType(value) {
	return COLUMN_TYPES.has(value);
}
var VALID_COLLECTION_SUPPORTS = /* @__PURE__ */ new Set([
	"drafts",
	"revisions",
	"preview",
	"scheduling",
	"search",
	"seo"
]);
var SEED_FIELD_INSERT_BATCH_SIZE = 6;
function isCollectionSupport(value) {
	return typeof value === "string" && VALID_COLLECTION_SUPPORTS.has(value);
}
/**
* Parse a collection's `supports` column (stored as a JSON array of
* CollectionSupport keys). Unknown/invalid entries are filtered out so the
* runtime value matches the declared `CollectionSupport[]` type.
*
* Throws on malformed JSON so corruption surfaces loudly; returns an empty
* array only for explicitly null/empty values or non-array JSON.
*/
function parseSupports(raw) {
	if (!raw) return [];
	const parsed = JSON.parse(raw);
	if (!Array.isArray(parsed)) return [];
	return parsed.filter(isCollectionSupport);
}
/**
* Error thrown when a schema operation fails
*/
var SchemaError = class extends Error {
	code;
	details;
	constructor(message, code, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "SchemaError";
	}
};
/**
* Schema Registry
*
* Manages collection and field definitions stored in D1.
* Handles runtime DDL operations (CREATE TABLE, ALTER TABLE).
*/
var SchemaRegistry = class {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* List all collections
	*/
	async listCollections() {
		return (await this.db.selectFrom("_emdash_collections").selectAll().orderBy("slug", "asc").execute()).map(this.mapCollectionRow);
	}
	/**
	* Get a collection by slug
	*/
	async getCollection(slug) {
		const row = await this.db.selectFrom("_emdash_collections").where("slug", "=", slug).selectAll().executeTakeFirst();
		return row ? this.mapCollectionRow(row) : null;
	}
	/**
	* Get a collection with all its fields
	*/
	async getCollectionWithFields(slug) {
		const collection = await this.getCollection(slug);
		if (!collection) return null;
		const fields = await this.listFields(collection.id);
		return {
			...collection,
			fields
		};
	}
	/**
	* List every collection together with its fields in O(1) query shapes
	* — one for collections, then one batched query for the fields of every
	* returned collection — instead of the N+1 pattern of `listCollections`
	* + per-collection `listFields`. The fields query is chunked at
	* `SQL_BATCH_SIZE` to stay under D1's bound-parameter limit, so on
	* sites with more than `SQL_BATCH_SIZE` collections the field fetch
	* becomes `ceil(collectionCount / SQL_BATCH_SIZE)` queries — still
	* a constant factor, not N+1. Typical sites have well under
	* `SQL_BATCH_SIZE` collections, so this is two queries in practice.
	*
	* Used by the manifest build, which previously paid N+1 round-trips on
	* every admin request. Each round-trip costs ~80–150ms against the D1
	* primary on a busy link, so a 10-collection site spent ~1 s rebuilding
	* a manifest that is now built fresh per admin request (no cache).
	*/
	async listCollectionsWithFields() {
		const collectionRows = await this.db.selectFrom("_emdash_collections").selectAll().orderBy("slug", "asc").execute();
		if (collectionRows.length === 0) return [];
		const fieldsByCollection = /* @__PURE__ */ new Map();
		for (const idChunk of chunks(collectionRows.map((c) => c.id), 50)) {
			const fieldRows = await this.db.selectFrom("_emdash_fields").where("collection_id", "in", idChunk).selectAll().orderBy("collection_id", "asc").orderBy("sort_order", "asc").orderBy("created_at", "asc").execute();
			for (const row of fieldRows) {
				const list = fieldsByCollection.get(row.collection_id) ?? [];
				list.push(this.mapFieldRow(row));
				fieldsByCollection.set(row.collection_id, list);
			}
		}
		return collectionRows.map((c) => ({
			...this.mapCollectionRow(c),
			fields: fieldsByCollection.get(c.id) ?? []
		}));
	}
	/**
	* Create a new collection
	*/
	async createCollection(input) {
		this.validateSlug(input.slug, "collection");
		if (RESERVED_COLLECTION_SLUGS.includes(input.slug)) throw new SchemaError(`Collection slug "${input.slug}" is reserved`, "RESERVED_SLUG");
		if (await this.getCollection(input.slug)) throw new SchemaError(`Collection "${input.slug}" already exists`, "COLLECTION_EXISTS");
		const id = ulid();
		const supports = input.supports ?? ["drafts", "revisions"];
		const hasSeo = input.hasSeo ?? supports.includes("seo") ?? false;
		await withTransaction(this.db, async (trx) => {
			await trx.insertInto("_emdash_collections").values({
				id,
				slug: input.slug,
				label: input.label,
				label_singular: input.labelSingular ?? null,
				description: input.description ?? null,
				icon: input.icon ?? null,
				supports: JSON.stringify(supports),
				source: input.source ?? "manual",
				has_seo: hasSeo ? 1 : 0,
				comments_enabled: input.commentsEnabled ? 1 : 0,
				url_pattern: input.urlPattern ?? null
			}).execute();
			await this.createContentTable(input.slug, trx);
		});
		const collection = await this.getCollection(input.slug);
		if (!collection) throw new SchemaError("Failed to create collection", "CREATE_FAILED");
		return collection;
	}
	/**
	* Create a seed-owned collection and all of its fields in bulk.
	*
	* Fresh seeds can define dozens of fields. Creating them through
	* `createField` performs multiple reads, one ALTER TABLE, and one media
	* usage invalidation per field, which can exhaust D1's per-request query
	* budget. This path validates the full schema before mutating it, creates
	* the complete content table in one statement, and inserts field metadata
	* in parameter-safe batches.
	*/
	async createSeedCollection(input, fields) {
		this.validateSlug(input.slug, "collection");
		if (RESERVED_COLLECTION_SLUGS.includes(input.slug)) throw new SchemaError(`Collection slug "${input.slug}" is reserved`, "RESERVED_SLUG");
		if (await this.getCollection(input.slug)) throw new SchemaError(`Collection "${input.slug}" already exists`, "COLLECTION_EXISTS");
		const fieldSlugs = /* @__PURE__ */ new Set();
		for (const field of fields) {
			this.validateSlug(field.slug, "field");
			if (RESERVED_FIELD_SLUGS.includes(field.slug)) throw new SchemaError(`Field slug "${field.slug}" is reserved`, "RESERVED_SLUG");
			if (fieldSlugs.has(field.slug)) throw new SchemaError(`Field "${field.slug}" already exists in collection "${input.slug}"`, "FIELD_EXISTS");
			fieldSlugs.add(field.slug);
		}
		const collectionId = ulid();
		const supports = input.supports ?? ["drafts", "revisions"];
		const hasSeo = input.hasSeo ?? supports.includes("seo") ?? false;
		let maxSortOrder = -1;
		const fieldRows = fields.map((field) => {
			const sortOrder = field.sortOrder ?? maxSortOrder + 1;
			maxSortOrder = Math.max(maxSortOrder, sortOrder);
			return {
				id: ulid(),
				collection_id: collectionId,
				slug: field.slug,
				label: field.label,
				type: field.type,
				column_type: FIELD_TYPE_TO_COLUMN[field.type],
				required: field.required ? 1 : 0,
				unique: field.unique ? 1 : 0,
				default_value: field.defaultValue !== void 0 ? JSON.stringify(field.defaultValue) : null,
				validation: field.validation ? JSON.stringify(field.validation) : null,
				widget: field.widget ?? null,
				options: field.options ? JSON.stringify(field.options) : null,
				sort_order: sortOrder,
				searchable: field.searchable ? 1 : 0,
				translatable: field.translatable === false ? 0 : 1
			};
		});
		let schemaMutated = false;
		try {
			await withTransaction(this.db, async (trx) => {
				await trx.insertInto("_emdash_collections").values({
					id: collectionId,
					slug: input.slug,
					label: input.label,
					label_singular: input.labelSingular ?? null,
					description: input.description ?? null,
					icon: input.icon ?? null,
					supports: JSON.stringify(supports),
					source: "seed",
					has_seo: hasSeo ? 1 : 0,
					comments_enabled: input.commentsEnabled ? 1 : 0,
					url_pattern: input.urlPattern ?? null
				}).execute();
				schemaMutated = true;
				await this.createContentTable(input.slug, trx, fields);
				for (const fieldBatch of chunks(fieldRows, SEED_FIELD_INSERT_BATCH_SIZE)) await trx.insertInto("_emdash_fields").values(fieldBatch).execute();
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, input.slug, "CONTENT_USAGE_STALE");
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, input.slug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Update a collection
	*/
	async updateCollection(slug, input) {
		const existing = await this.getCollection(slug);
		if (!existing) throw new SchemaError(`Collection "${slug}" not found`, "COLLECTION_NOT_FOUND");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const supportsArray = input.supports ?? existing.supports;
		const hasSeo = input.hasSeo !== void 0 ? input.hasSeo : input.supports !== void 0 ? supportsArray.includes("seo") : existing.hasSeo;
		return withTransaction(this.db, async (trx) => {
			await trx.updateTable("_emdash_collections").set({
				label: input.label ?? existing.label,
				label_singular: input.labelSingular ?? existing.labelSingular ?? null,
				description: input.description ?? existing.description ?? null,
				icon: input.icon ?? existing.icon ?? null,
				supports: input.supports ? JSON.stringify(input.supports) : JSON.stringify(existing.supports),
				url_pattern: input.urlPattern !== void 0 ? input.urlPattern ?? null : existing.urlPattern ?? null,
				has_seo: hasSeo ? 1 : 0,
				comments_enabled: input.commentsEnabled !== void 0 ? input.commentsEnabled ? 1 : 0 : existing.commentsEnabled ? 1 : 0,
				comments_moderation: input.commentsModeration ?? existing.commentsModeration,
				comments_closed_after_days: input.commentsClosedAfterDays !== void 0 ? input.commentsClosedAfterDays : existing.commentsClosedAfterDays,
				comments_auto_approve_users: input.commentsAutoApproveUsers !== void 0 ? input.commentsAutoApproveUsers ? 1 : 0 : existing.commentsAutoApproveUsers ? 1 : 0,
				updated_at: now
			}).where("slug", "=", slug).execute();
			const row = await trx.selectFrom("_emdash_collections").where("slug", "=", slug).selectAll().executeTakeFirst();
			if (!row) throw new SchemaError("Failed to update collection", "UPDATE_FAILED");
			if (input.supports !== void 0) {
				if (existing.supports.includes("search") !== parseSupports(row.supports).includes("search")) await this.syncSearchState(slug, trx);
			}
			return this.mapCollectionRow(row);
		});
	}
	/**
	* Delete a collection
	*/
	async deleteCollection(slug, options) {
		const existing = await this.getCollection(slug);
		if (!existing) throw new SchemaError(`Collection "${slug}" not found`, "COLLECTION_NOT_FOUND");
		if (!options?.force) {
			if (await this.collectionHasContent(slug)) throw new SchemaError(`Collection "${slug}" has content. Use force: true to delete.`, "COLLECTION_HAS_CONTENT");
		}
		let contentTableDropped = false;
		try {
			await withTransaction(this.db, async (trx) => {
				await new FTSManager(trx).dropFtsTable(slug);
				const tableName = this.getTableName(slug);
				await sql`DROP TABLE IF EXISTS ${sql.ref(tableName)}`.execute(trx);
				contentTableDropped = true;
				await trx.deleteFrom("_emdash_collections").where("id", "=", existing.id).execute();
			});
			await deleteContentMediaUsageCollection(this.db, slug);
		} catch (error) {
			if (contentTableDropped && !await tableExists(this.db, this.getTableName(slug))) await deleteContentMediaUsageCollection(this.db, slug);
			throw error;
		}
	}
	/**
	* List fields for a collection
	*/
	async listFields(collectionId) {
		return (await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collectionId).selectAll().orderBy("sort_order", "asc").orderBy("created_at", "asc").execute()).map(this.mapFieldRow);
	}
	/**
	* Get a field by slug within a collection
	*/
	async getField(collectionSlug, fieldSlug) {
		const collection = await this.getCollection(collectionSlug);
		if (!collection) return null;
		const row = await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).where("slug", "=", fieldSlug).selectAll().executeTakeFirst();
		return row ? this.mapFieldRow(row) : null;
	}
	/**
	* Create a new field
	*/
	async createField(collectionSlug, input) {
		const collection = await this.getCollection(collectionSlug);
		if (!collection) throw new SchemaError(`Collection "${collectionSlug}" not found`, "COLLECTION_NOT_FOUND");
		this.validateSlug(input.slug, "field");
		if (RESERVED_FIELD_SLUGS.includes(input.slug)) throw new SchemaError(`Field slug "${input.slug}" is reserved`, "RESERVED_SLUG");
		if (await this.getField(collectionSlug, input.slug)) throw new SchemaError(`Field "${input.slug}" already exists in collection "${collectionSlug}"`, "FIELD_EXISTS");
		const id = ulid();
		const columnType = FIELD_TYPE_TO_COLUMN[input.type];
		const maxSort = await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).select((eb) => eb.fn.max("sort_order").as("max")).executeTakeFirst();
		const sortOrder = input.sortOrder ?? (maxSort?.max ?? -1) + 1;
		let schemaMutated = false;
		try {
			const created = await withTransaction(this.db, async (trx) => {
				await trx.insertInto("_emdash_fields").values({
					id,
					collection_id: collection.id,
					slug: input.slug,
					label: input.label,
					type: input.type,
					column_type: columnType,
					required: input.required ? 1 : 0,
					unique: input.unique ? 1 : 0,
					default_value: input.defaultValue !== void 0 ? JSON.stringify(input.defaultValue) : null,
					validation: input.validation ? JSON.stringify(input.validation) : null,
					widget: input.widget ?? null,
					options: input.options ? JSON.stringify(input.options) : null,
					sort_order: sortOrder,
					searchable: input.searchable ? 1 : 0,
					translatable: input.translatable === false ? 0 : 1
				}).execute();
				schemaMutated = true;
				await this.addColumn(collectionSlug, input.slug, input.type, {
					required: input.required,
					defaultValue: input.defaultValue
				}, trx);
				const fieldRow = await trx.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).where("slug", "=", input.slug).selectAll().executeTakeFirst();
				if (!fieldRow) throw new SchemaError("Failed to create field", "CREATE_FAILED");
				const field = this.mapFieldRow(fieldRow);
				if (input.searchable) await this.syncSearchState(collectionSlug, trx);
				return field;
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			return created;
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Update a field
	*/
	async updateField(collectionSlug, fieldSlug, input) {
		const field = await this.getField(collectionSlug, fieldSlug);
		if (!field) throw new SchemaError(`Field "${fieldSlug}" not found in collection "${collectionSlug}"`, "FIELD_NOT_FOUND");
		const nextValidation = input.validation === void 0 ? field.validation : input.validation;
		let nextType = field.type;
		let nextColumnType = field.columnType;
		if (input.type !== void 0 && input.type !== field.type) {
			const newColumnType = FIELD_TYPE_TO_COLUMN[input.type];
			if (newColumnType !== field.columnType) throw new SchemaError(`Cannot change field "${fieldSlug}" in collection "${collectionSlug}" from type "${field.type}" to "${input.type}": the underlying column type would change from ${field.columnType} to ${newColumnType}, which requires a manual content migration. Drop and re-create the field, or migrate the column data, before changing its type.`, "FIELD_TYPE_COLUMN_CHANGE");
			nextType = input.type;
			nextColumnType = newColumnType;
		}
		let schemaMutated = false;
		try {
			const updatedField = await withTransaction(this.db, async (trx) => {
				await trx.updateTable("_emdash_fields").set({
					type: nextType,
					column_type: nextColumnType,
					label: input.label ?? field.label,
					required: input.required !== void 0 ? input.required ? 1 : 0 : field.required ? 1 : 0,
					unique: input.unique !== void 0 ? input.unique ? 1 : 0 : field.unique ? 1 : 0,
					searchable: input.searchable !== void 0 ? input.searchable ? 1 : 0 : field.searchable ? 1 : 0,
					translatable: input.translatable !== void 0 ? input.translatable ? 1 : 0 : field.translatable ? 1 : 0,
					default_value: input.defaultValue !== void 0 ? JSON.stringify(input.defaultValue) : field.defaultValue !== void 0 ? JSON.stringify(field.defaultValue) : null,
					validation: nextValidation ? JSON.stringify(nextValidation) : null,
					widget: input.widget ?? field.widget ?? null,
					options: input.options ? JSON.stringify(input.options) : field.options ? JSON.stringify(field.options) : null,
					sort_order: input.sortOrder ?? field.sortOrder
				}).where("id", "=", field.id).execute();
				schemaMutated = true;
				const updatedRow = await trx.selectFrom("_emdash_fields").where("collection_id", "=", field.collectionId).where("slug", "=", fieldSlug).selectAll().executeTakeFirst();
				if (!updatedRow) throw new SchemaError("Failed to update field", "UPDATE_FAILED");
				const updated = this.mapFieldRow(updatedRow);
				if (input.searchable !== void 0 && input.searchable !== field.searchable) await this.syncSearchState(collectionSlug, trx);
				return updated;
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			return updatedField;
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Synchronize an existing FTS index with the collection's current state.
	*
	* Only rebuilds or disables — never first-time enables. First-time FTS
	* enablement is handled by the seed's explicit enableSearch call (which
	* is try-caught) or the admin UI toggle.
	*
	* - FTS active + still has search support and searchable fields → rebuild
	* - FTS active + lost search support or no searchable fields    → disable
	* - FTS not active                                              → no-op
	*
	* Pass `db` when calling from within a transaction so FTS operations
	* participate in the same transaction and are rolled back on failure.
	*/
	async syncSearchState(collectionSlug, db) {
		const conn = db ?? this.db;
		const ftsManager = new FTSManager(conn);
		const row = await conn.selectFrom("_emdash_collections").where("slug", "=", collectionSlug).select("supports").executeTakeFirst();
		if (!row) return;
		const wantsSearch = parseSupports(row.supports).includes("search");
		const searchableFields = await ftsManager.getSearchableFields(collectionSlug);
		const config = await ftsManager.getSearchConfig(collectionSlug);
		const ftsActive = config?.enabled === true;
		if (wantsSearch && searchableFields.length > 0 && ftsActive) await ftsManager.rebuildIndex(collectionSlug, searchableFields, config?.weights);
		else if (ftsActive && (!wantsSearch || searchableFields.length === 0)) await ftsManager.disableSearch(collectionSlug);
	}
	/**
	* Delete a field
	*/
	async deleteField(collectionSlug, fieldSlug) {
		const field = await this.getField(collectionSlug, fieldSlug);
		if (!field) throw new SchemaError(`Field "${fieldSlug}" not found in collection "${collectionSlug}"`, "FIELD_NOT_FOUND");
		let schemaMutated = false;
		try {
			await withTransaction(this.db, async (trx) => {
				await trx.deleteFrom("_emdash_fields").where("id", "=", field.id).execute();
				schemaMutated = true;
				if (field.searchable) await this.syncSearchState(collectionSlug, trx);
				await this.dropColumn(collectionSlug, fieldSlug, trx);
			});
			await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
		} catch (error) {
			if (schemaMutated) await markContentMediaUsageCollectionStaleSafely(this.db, collectionSlug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Reorder fields
	*/
	async reorderFields(collectionSlug, fieldSlugs) {
		const collection = await this.getCollection(collectionSlug);
		if (!collection) throw new SchemaError(`Collection "${collectionSlug}" not found`, "COLLECTION_NOT_FOUND");
		for (let i = 0; i < fieldSlugs.length; i++) await this.db.updateTable("_emdash_fields").set({ sort_order: i }).where("collection_id", "=", collection.id).where("slug", "=", fieldSlugs[i]).execute();
	}
	/**
	* Create a content table for a collection
	*/
	async createContentTable(slug, db, fields = []) {
		const conn = db ?? this.db;
		const tableName = this.getTableName(slug);
		let table = conn.schema.createTable(tableName).addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text").addColumn("status", "text", (col) => col.defaultTo("draft")).addColumn("author_id", "text").addColumn("primary_byline_id", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(conn))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(conn))).addColumn("published_at", "text").addColumn("scheduled_at", "text").addColumn("deleted_at", "text").addColumn("version", "integer", (col) => col.defaultTo(1)).addColumn("live_revision_id", "text", (col) => col.references("revisions.id")).addColumn("draft_revision_id", "text", (col) => col.references("revisions.id")).addColumn("locale", "text", (col) => col.notNull().defaultTo("en")).addColumn("translation_group", "text");
		for (const field of fields) {
			const columnName = this.getColumnName(field.slug);
			const columnType = COLUMN_TYPE_TO_DATA_TYPE[FIELD_TYPE_TO_COLUMN[field.type]];
			table = table.addColumn(columnName, columnType, (column) => {
				if (!field.required) return column;
				const defaultValue = field.defaultValue !== void 0 ? this.formatDefaultValue(field.defaultValue, field.type) : this.getEmptyDefault(field.type);
				return column.notNull().defaultTo(sql.raw(defaultValue));
			});
		}
		await table.addUniqueConstraint(`${tableName}_slug_locale_unique`, ["slug", "locale"]).execute();
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_slug`)}
			ON ${sql.ref(tableName)} (slug)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_scheduled`)}
			ON ${sql.ref(tableName)} (scheduled_at)
			WHERE scheduled_at IS NOT NULL
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_live_revision`)}
			ON ${sql.ref(tableName)} (live_revision_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_draft_revision`)}
			ON ${sql.ref(tableName)} (draft_revision_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_author`)}
			ON ${sql.ref(tableName)} (author_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_primary_byline`)}
			ON ${sql.ref(tableName)} (primary_byline_id)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_locale`)}
			ON ${sql.ref(tableName)} (locale)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_translation_group`)}
			ON ${sql.ref(tableName)} (translation_group)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_updated_id`)}
			ON ${sql.ref(tableName)} (deleted_at, updated_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_status`)}
			ON ${sql.ref(tableName)} (deleted_at, status)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_created_id`)}
			ON ${sql.ref(tableName)} (deleted_at, created_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted_published_id`)}
			ON ${sql.ref(tableName)} (deleted_at, published_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_loc_upd`)}
			ON ${sql.ref(tableName)} (deleted_at, locale, updated_at DESC, id DESC)
		`.execute(conn);
		await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_loc_crt`)}
			ON ${sql.ref(tableName)} (deleted_at, locale, created_at DESC, id DESC)
		`.execute(conn);
	}
	/**
	* Add a column to a content table
	*/
	async addColumn(collectionSlug, fieldSlug, fieldType, options, db) {
		const conn = db ?? this.db;
		const tableName = this.getTableName(collectionSlug);
		const columnType = FIELD_TYPE_TO_COLUMN[fieldType];
		const columnName = this.getColumnName(fieldSlug);
		if (options?.required && options?.defaultValue !== void 0) {
			const defaultVal = this.formatDefaultValue(options.defaultValue, fieldType);
			await sql`
				ALTER TABLE ${sql.ref(tableName)}
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)} NOT NULL DEFAULT ${sql.raw(defaultVal)}
			`.execute(conn);
		} else if (options?.required) {
			const defaultVal = this.getEmptyDefault(fieldType);
			await sql`
				ALTER TABLE ${sql.ref(tableName)}
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)} NOT NULL DEFAULT ${sql.raw(defaultVal)}
			`.execute(conn);
		} else await sql`
				ALTER TABLE ${sql.ref(tableName)}
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)}
			`.execute(conn);
	}
	/**
	* Drop a column from a content table
	*/
	async dropColumn(collectionSlug, fieldSlug, db) {
		const tableName = this.getTableName(collectionSlug);
		const columnName = this.getColumnName(fieldSlug);
		await sql`
			ALTER TABLE ${sql.ref(tableName)}
			DROP COLUMN ${sql.ref(columnName)}
		`.execute(db ?? this.db);
	}
	/**
	* Check if a collection has any content
	*/
	async collectionHasContent(slug) {
		const tableName = this.getTableName(slug);
		try {
			return ((await sql`
				SELECT COUNT(*) as count FROM ${sql.ref(tableName)}
				WHERE deleted_at IS NULL
			`.execute(this.db)).rows[0]?.count ?? 0) > 0;
		} catch {
			return false;
		}
	}
	/**
	* Get table name for a collection
	*/
	getTableName(slug) {
		validateIdentifier(slug, "collection slug");
		return `ec_${slug}`;
	}
	/**
	* Get column name for a field
	*/
	getColumnName(slug) {
		validateIdentifier(slug, "field slug");
		return slug;
	}
	/**
	* Validate a slug
	*/
	validateSlug(slug, type) {
		if (!slug || typeof slug !== "string") throw new SchemaError(`${type} slug is required`, "INVALID_SLUG");
		if (!SLUG_VALIDATION_PATTERN.test(slug)) throw new SchemaError(`${type} slug must start with a letter and contain only lowercase letters, numbers, and underscores`, "INVALID_SLUG");
		if (slug.length > 63) throw new SchemaError(`${type} slug must be 63 characters or less`, "INVALID_SLUG");
	}
	/**
	* Format a default value for SQL.
	*
	* SQLite `ALTER TABLE ADD COLUMN ... DEFAULT` requires a literal constant
	* expression — parameterized values cannot be used here. We manually escape
	* single quotes and coerce types to ensure the output is safe.
	*
	* INTEGER/REAL values are coerced through `Number()` which can only produce
	* digits, `.`, `-`, `e`, `Infinity`, or `NaN` — all safe in SQL.
	* TEXT/JSON values have single quotes escaped via SQL standard doubling (`''`).
	*/
	formatDefaultValue(value, fieldType) {
		if (value === null || value === void 0) return "NULL";
		const columnType = FIELD_TYPE_TO_COLUMN[fieldType];
		if (columnType === "JSON") return `'${JSON.stringify(value).replace(SINGLE_QUOTE_PATTERN, "''")}'`;
		if (columnType === "INTEGER") {
			if (typeof value === "boolean") return value ? "1" : "0";
			const num = Number(value);
			if (!Number.isFinite(num)) return "0";
			return String(Math.trunc(num));
		}
		if (columnType === "REAL") {
			const num = Number(value);
			if (!Number.isFinite(num)) return "0";
			return String(num);
		}
		let text;
		if (typeof value === "string") text = value;
		else if (typeof value === "number" || typeof value === "boolean") text = String(value);
		else if (typeof value === "object" && value !== null) text = JSON.stringify(value);
		else text = "";
		return `'${text.replace(SINGLE_QUOTE_PATTERN, "''")}'`;
	}
	/**
	* Get empty default for a field type
	*/
	getEmptyDefault(fieldType) {
		switch (FIELD_TYPE_TO_COLUMN[fieldType]) {
			case "INTEGER": return "0";
			case "REAL": return "0.0";
			case "JSON": return "'null'";
			default: return "''";
		}
	}
	/**
	* Map a collection row to a Collection object
	*/
	mapCollectionRow = (row) => {
		const moderation = row.comments_moderation;
		return {
			id: row.id,
			slug: row.slug,
			label: row.label,
			labelSingular: row.label_singular ?? void 0,
			description: row.description ?? void 0,
			icon: row.icon ?? void 0,
			supports: parseSupports(row.supports),
			source: row.source && isCollectionSource(row.source) ? row.source : void 0,
			hasSeo: row.has_seo === 1,
			urlPattern: row.url_pattern ?? void 0,
			commentsEnabled: row.comments_enabled === 1,
			commentsModeration: moderation === "all" || moderation === "first_time" || moderation === "none" ? moderation : "first_time",
			commentsClosedAfterDays: row.comments_closed_after_days ?? 90,
			commentsAutoApproveUsers: row.comments_auto_approve_users === 1,
			createdAt: row.created_at,
			updatedAt: row.updated_at
		};
	};
	/**
	* Map a field row to a Field object
	*/
	mapFieldRow = (row) => {
		return {
			id: row.id,
			collectionId: row.collection_id,
			slug: row.slug,
			label: row.label,
			type: isFieldType(row.type) ? row.type : "string",
			columnType: isColumnType(row.column_type) ? row.column_type : "TEXT",
			required: row.required === 1,
			unique: row.unique === 1,
			defaultValue: row.default_value ? JSON.parse(row.default_value) : void 0,
			validation: row.validation ? JSON.parse(row.validation) : void 0,
			widget: row.widget ?? void 0,
			options: row.options ? JSON.parse(row.options) : void 0,
			sortOrder: row.sort_order,
			searchable: row.searchable === 1,
			translatable: row.translatable !== 0,
			createdAt: row.created_at
		};
	};
	/**
	* Discover orphaned content tables
	*
	* Finds ec_* tables that exist in the database but don't have a
	* corresponding entry in _emdash_collections.
	*/
	async discoverOrphanedTables() {
		const allTables = await listTablesLike(this.db, "ec_%");
		const registered = await this.listCollections();
		const registeredSlugs = new Set(registered.map((c) => c.slug));
		const orphans = [];
		for (const tableName of allTables) {
			const slug = tableName.replace(EC_PREFIX_PATTERN, "");
			if (!registeredSlugs.has(slug)) try {
				const countResult = await sql`
						SELECT COUNT(*) as count FROM ${sql.ref(tableName)}
						WHERE deleted_at IS NULL
					`.execute(this.db);
				orphans.push({
					slug,
					tableName,
					rowCount: countResult.rows[0]?.count ?? 0
				});
			} catch {
				orphans.push({
					slug,
					tableName,
					rowCount: 0
				});
			}
		}
		return orphans;
	}
	/**
	* Register an orphaned table as a collection
	*
	* Creates a _emdash_collections entry for an existing ec_* table.
	*/
	async registerOrphanedTable(slug, options) {
		const tableName = this.getTableName(slug);
		if (!await tableExists(this.db, tableName)) throw new SchemaError(`Table "${tableName}" does not exist`, "TABLE_NOT_FOUND");
		if (await this.getCollection(slug)) throw new SchemaError(`Collection "${slug}" is already registered`, "COLLECTION_EXISTS");
		const id = ulid();
		const label = options?.label || this.slugToLabel(slug);
		let collectionRegistered = false;
		try {
			await this.db.insertInto("_emdash_collections").values({
				id,
				slug,
				label,
				label_singular: options?.labelSingular ?? null,
				description: options?.description ?? null,
				icon: null,
				supports: JSON.stringify([]),
				source: "discovered",
				has_seo: 0,
				url_pattern: null
			}).execute();
			collectionRegistered = true;
			const collection = await this.getCollection(slug);
			if (!collection) throw new SchemaError("Failed to register orphaned table", "REGISTER_FAILED");
			await markContentMediaUsageCollectionStaleSafely(this.db, slug, "CONTENT_USAGE_STALE");
			return collection;
		} catch (error) {
			if (collectionRegistered) await markContentMediaUsageCollectionStaleSafely(this.db, slug, "CONTENT_USAGE_STALE");
			throw error;
		}
	}
	/**
	* Convert slug to human-readable label
	*/
	slugToLabel(slug) {
		return slug.replace(UNDERSCORE_PATTERN, " ").replace(WORD_BOUNDARY_PATTERN, (c) => c.toUpperCase());
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/schema/query.ts
/**
* Get collection metadata by slug.
*
* @example
* ```ts
* import { getCollectionInfo } from "emdash";
*
* const info = await getCollectionInfo("posts");
* if (info?.commentsEnabled) {
*   // render comment UI
* }
* ```
*/
async function getCollectionInfo(slug) {
	return requestCached(`collection-info:${slug}`, () => cachedQuery({
		namespace: CacheNamespace.SCHEMA,
		key: `collection-info:${slug}`,
		load: async () => {
			return getCollectionInfoWithDb(await getDb(), slug);
		}
	}));
}
/**
* Get collection metadata with an explicit db handle.
*
* @internal Use `getCollectionInfo()` in templates. This variant is for
* routes that already have a database handle.
*/
async function getCollectionInfoWithDb(db, slug) {
	return new SchemaRegistry(db).getCollection(slug);
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Comments.astro
createAstro("https://astro.build");
var $$Comments = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Comments;
	const { collection, contentId, threaded = false, reactions = false, sort = "oldest", class: className } = Astro.props;
	const enabled = (await getCollectionInfo(collection))?.commentsEnabled ?? false;
	const { items, total } = enabled ? await getComments({
		collection,
		contentId,
		threaded,
		reactions,
		sort
	}) : {
		items: [],
		total: 0
	};
	const URL_RE = /https?:\/\/[^\s<>"')\]]+/g;
	const AMP_RE = /&/g;
	const LT_RE = /</g;
	const GT_RE = />/g;
	const QUOT_RE = /"/g;
	function autoLinkUrls(text) {
		return text.replace(URL_RE, (url) => `<a href="${url}" rel="nofollow ugc noopener" target="_blank">${url}</a>`);
	}
	function escapeHtml(text) {
		return text.replace(AMP_RE, "&amp;").replace(LT_RE, "&lt;").replace(GT_RE, "&gt;").replace(QUOT_RE, "&quot;");
	}
	function formatBody(text) {
		return autoLinkUrls(escapeHtml(text));
	}
	const REACTION_SCRIPT = `
(() => {
  const sections = document.querySelectorAll('[data-ec-comments][data-ec-reactions]');
  sections.forEach((section) => {
    const collection = section.getAttribute('data-collection');
    const contentId = section.getAttribute('data-content-id');
    if (!collection || !contentId) return;
    const base = '/_emdash/api/comments/' + encodeURIComponent(collection) + '/' + encodeURIComponent(contentId) + '/reactions';
    const headers = { 'X-EmDash-Request': '1' };

    fetch(base, { headers: headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        const viewer = payload && payload.data && payload.data.viewer;
        if (!viewer) return;
        Object.keys(viewer).forEach((commentId) => {
          (viewer[commentId] || []).forEach((reaction) => {
            const sel = '.ec-reaction[data-comment-id="' + commentId + '"][data-ec-reaction="' + reaction + '"]';
            const btn = section.querySelector(sel);
            if (btn) btn.setAttribute('aria-pressed', 'true');
          });
        });
      })
      .catch(() => {});

    section.addEventListener('click', (event) => {
      const btn = event.target.closest('.ec-reaction');
      if (!btn || !section.contains(btn)) return;
      const commentId = btn.getAttribute('data-comment-id');
      const reaction = btn.getAttribute('data-ec-reaction');
      if (!commentId || !reaction) return;
      btn.disabled = true;
      fetch(base, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        body: JSON.stringify({ commentId: commentId, reaction: reaction }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((payload) => {
          const data = payload && payload.data;
          if (!data) return;
          btn.setAttribute('aria-pressed', data.reacted ? 'true' : 'false');
          const countEl = btn.querySelector('[data-ec-reaction-count]');
          if (countEl) countEl.textContent = String((data.counts && data.counts[reaction]) || 0);
        })
        .catch(() => {})
        .finally(() => { btn.disabled = false; });
    });
  });
})();
`;
	return renderTemplate`${enabled && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section${addAttribute(["ec-comments", className], "class:list")} data-ec-comments${addAttribute(collection, "data-collection")}${addAttribute(contentId, "data-content-id")}${spreadAttributes(reactions ? { "data-ec-reactions": "" } : {})} data-astro-cid-5y5x2pno><h3 class="ec-comments-heading" data-astro-cid-5y5x2pno>${total === 0 ? "No comments yet" : total === 1 ? "1 Comment" : `${total} Comments`}</h3>${items.length > 0 && renderTemplate`<ol class="ec-comments-list" data-astro-cid-5y5x2pno>${items.map((comment) => renderTemplate`<li data-astro-cid-5y5x2pno><article class="ec-comment"${addAttribute(`comment-${comment.id}`, "id")}${addAttribute(comment.id, "data-comment-id")} data-astro-cid-5y5x2pno><header class="ec-comment-header" data-astro-cid-5y5x2pno><span class="ec-comment-author" data-astro-cid-5y5x2pno>${comment.authorName}${comment.isRegisteredUser && renderTemplate`<span class="ec-comment-badge" aria-label="Site member" data-astro-cid-5y5x2pno>&#x2713;</span>`}</span><time class="ec-comment-date"${addAttribute(comment.createdAt, "datetime")} data-astro-cid-5y5x2pno>${new Date(comment.createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	})}</time></header><div class="ec-comment-body" data-astro-cid-5y5x2pno>${unescapeHTML(formatBody(comment.body))}</div>${reactions && renderTemplate`<div class="ec-comment-actions" data-astro-cid-5y5x2pno><button type="button" class="ec-reaction" data-ec-reaction="like"${addAttribute(comment.id, "data-comment-id")} aria-pressed="false" data-astro-cid-5y5x2pno><span class="ec-reaction-icon" aria-hidden="true" data-astro-cid-5y5x2pno>&#x2661;</span><span class="ec-reaction-label" data-astro-cid-5y5x2pno>Like</span><span class="ec-reaction-count" data-ec-reaction-count data-astro-cid-5y5x2pno>${comment.reactions?.like ?? 0}</span></button></div>`}${threaded && comment.replies && comment.replies.length > 0 && renderTemplate`<ol class="ec-comment-replies" data-astro-cid-5y5x2pno>${comment.replies.map((reply) => renderTemplate`<li data-astro-cid-5y5x2pno><article class="ec-comment ec-comment-reply"${addAttribute(`comment-${reply.id}`, "id")}${addAttribute(reply.id, "data-comment-id")} data-astro-cid-5y5x2pno><header class="ec-comment-header" data-astro-cid-5y5x2pno><span class="ec-comment-author" data-astro-cid-5y5x2pno>${reply.authorName}${reply.isRegisteredUser && renderTemplate`<span class="ec-comment-badge" aria-label="Site member" data-astro-cid-5y5x2pno>&#x2713;</span>`}</span><time class="ec-comment-date"${addAttribute(reply.createdAt, "datetime")} data-astro-cid-5y5x2pno>${new Date(reply.createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	})}</time></header><div class="ec-comment-body" data-astro-cid-5y5x2pno>${unescapeHTML(formatBody(reply.body))}</div>${reactions && renderTemplate`<div class="ec-comment-actions" data-astro-cid-5y5x2pno><button type="button" class="ec-reaction" data-ec-reaction="like"${addAttribute(reply.id, "data-comment-id")} aria-pressed="false" data-astro-cid-5y5x2pno><span class="ec-reaction-icon" aria-hidden="true" data-astro-cid-5y5x2pno>&#x2661;</span><span class="ec-reaction-label" data-astro-cid-5y5x2pno>Like</span><span class="ec-reaction-count" data-ec-reaction-count data-astro-cid-5y5x2pno>${reply.reactions?.like ?? 0}</span></button></div>`}</article></li>`)}</ol>`}</article></li>`)}</ol>`}</section>${reactions && renderTemplate`<script>${unescapeHTML(REACTION_SCRIPT)}<\/script>`}` })}`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Comments.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/CommentForm.astro
createAstro("https://astro.build");
var $$CommentForm = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CommentForm;
	const { collection, contentId, parentId = null, class: className, turnstileSiteKey } = Astro.props;
	const enabled = (await getCollectionInfo(collection))?.commentsEnabled ?? false;
	const { user } = Astro.locals;
	const formId = `ec-comment-form-${parentId ?? "root"}`;
	const endpoint = `/_emdash/api/comments/${encodeURIComponent(collection)}/${encodeURIComponent(contentId)}`;
	return renderTemplate`${enabled && renderTemplate`${maybeRenderHead($$result)}<form${addAttribute(formId, "id")}${addAttribute(["ec-comment-form", className], "class:list")} data-ec-comment-form${addAttribute(endpoint, "data-endpoint")}${addAttribute(user?.name ?? "", "data-user-name")}${addAttribute(user?.email ?? "", "data-user-email")} data-astro-cid-uj74pxef>${user ? renderTemplate`<div class="ec-comment-user-info" data-astro-cid-uj74pxef><span class="ec-comment-user-name" data-astro-cid-uj74pxef>${user.name}</span><span class="ec-comment-user-email" data-astro-cid-uj74pxef>${user.email}</span></div>` : renderTemplate`<div class="ec-comment-form-fields" data-astro-cid-uj74pxef><label class="ec-comment-form-field" data-astro-cid-uj74pxef><span data-astro-cid-uj74pxef>Name</span><input type="text" name="authorName" required maxlength="100" data-astro-cid-uj74pxef></label><label class="ec-comment-form-field" data-astro-cid-uj74pxef><span data-astro-cid-uj74pxef>Email</span><input type="email" name="authorEmail" required data-astro-cid-uj74pxef></label></div>`}<div aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;" data-astro-cid-uj74pxef><label data-astro-cid-uj74pxef>Don't fill this out<input type="text" name="website_url" tabindex="-1" autocomplete="off" data-astro-cid-uj74pxef></label></div><label class="ec-comment-form-field" data-astro-cid-uj74pxef><span data-astro-cid-uj74pxef>Comment</span><textarea name="body" required maxlength="5000" rows="4" data-astro-cid-uj74pxef></textarea></label>${parentId && renderTemplate`<input type="hidden" name="parentId"${addAttribute(parentId, "value")} data-astro-cid-uj74pxef>`}${turnstileSiteKey && renderTemplate`<div class="cf-turnstile"${addAttribute(turnstileSiteKey, "data-sitekey")} data-theme="auto" data-astro-cid-uj74pxef></div>`}<button type="submit" class="ec-comment-form-submit" data-astro-cid-uj74pxef>Post Comment</button><div class="ec-comment-form-status" role="status" aria-live="polite" data-astro-cid-uj74pxef></div></form>`}${enabled && turnstileSiteKey && renderTemplate`<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer><\/script>`}${renderScript($$result, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/CommentForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/CommentForm.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/widgets/index.ts
/**
* Get a widget area by name, with all its widgets.
*
* Single query with a left join rather than area-then-widgets so the
* common case costs one round-trip. An area with no widgets yields one
* row with null widget columns, which we skip when mapping.
*/
async function getWidgetArea(name) {
	return requestCached(`widget-area:${name}`, async () => {
		const rows = await (await getDb()).selectFrom("_emdash_widget_areas as a").leftJoin("_emdash_widgets as w", "w.area_id", "a.id").select([
			"a.id as a_id",
			"a.name as a_name",
			"a.label as a_label",
			"a.description as a_description",
			"w.id as w_id",
			"w.type as w_type",
			"w.title as w_title",
			"w.content as w_content",
			"w.menu_name as w_menu_name",
			"w.component_id as w_component_id",
			"w.component_props as w_component_props",
			"w.area_id as w_area_id",
			"w.sort_order as w_sort_order",
			"w.created_at as w_created_at"
		]).where("a.name", "=", name).orderBy("w.sort_order", "asc").execute();
		const first = rows[0];
		if (!first) return null;
		const widgets = [];
		for (const row of rows) {
			if (row.w_id === null) continue;
			const widgetRow = {
				id: row.w_id,
				type: row.w_type,
				title: row.w_title,
				content: row.w_content,
				menu_name: row.w_menu_name,
				component_id: row.w_component_id,
				component_props: row.w_component_props,
				area_id: row.w_area_id,
				sort_order: row.w_sort_order,
				created_at: row.w_created_at
			};
			widgets.push(rowToWidget(widgetRow));
		}
		return {
			id: first.a_id,
			name: first.a_name,
			label: first.a_label,
			description: first.a_description ?? void 0,
			widgets
		};
	});
}
/**
* Convert a widget row to the API type
*/
function rowToWidget(row) {
	const widget = {
		id: row.id,
		type: row.type,
		title: row.title ?? void 0
	};
	if (row.type === "content" && row.content) try {
		widget.content = JSON.parse(row.content);
	} catch {}
	if (row.type === "menu" && row.menu_name) widget.menuName = row.menu_name;
	if (row.type === "component" && row.component_id) {
		widget.componentId = row.component_id;
		if (row.component_props) try {
			widget.componentProps = JSON.parse(row.component_props);
		} catch {}
	}
	return widget;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/utils/url.ts
/**
* URL scheme validation utilities
*
* Prevents XSS via dangerous URL schemes (javascript:, data:, vbscript:, etc.)
* by allowlisting known-safe schemes before rendering into href attributes.
*/
/**
* Matches URLs that are safe to render in href attributes.
*
* Allowed:
* - http:// and https://
* - mailto: and tel:
* - Relative paths (starting with /)
* - Fragment links (starting with #)
* - Protocol-relative URLs are NOT allowed (starting with //) as they can
*   redirect to attacker-controlled hosts.
*/
var SAFE_URL_SCHEME_RE = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;
/**
* Returns the URL unchanged if it uses a safe scheme, otherwise returns "#".
*
* Use this at the render layer as the primary defense against XSS via
* dangerous URL schemes like `javascript:`, `data:`, or `vbscript:`.
*
* @example
* ```ts
* sanitizeHref("https://example.com")        // "https://example.com"
* sanitizeHref("/about")                      // "/about"
* sanitizeHref("#section")                    // "#section"
* sanitizeHref("mailto:a@b.com")              // "mailto:a@b.com"
* sanitizeHref("javascript:alert(1)")         // "#"
* sanitizeHref("data:text/html,<script>")     // "#"
* sanitizeHref("")                            // "#"
* ```
*/
function sanitizeHref(url) {
	if (!url) return "#";
	return SAFE_URL_SCHEME_RE.test(url) ? url : "#";
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/menus/index.ts
/**
* Get a menu by name with resolved URLs.
*
* @example
* ```ts
* const menu = await getMenu("primary");
* const menuEs = await getMenu("primary", { locale: "es" });
* ```
*/
function getMenu(name, options = {}) {
	const locale = resolveLocale(options.locale);
	return requestCached(`menu:${name}:${locale ?? "*"}`, () => cachedQuery({
		namespace: CacheNamespace.MENUS,
		key: `${name}:${locale ?? "*"}`,
		load: async () => {
			return getMenuWithDb(name, await getDb(), { locale });
		}
	}));
}
/**
* Get menu by name with resolved URLs (with explicit db). Internal helper for
* admin routes that already have a database handle.
*/
async function getMenuWithDb(name, db, options = {}) {
	const chain = resolveLocaleChain(options.locale);
	const selectMenu = () => db.selectFrom("_emdash_menus").selectAll().where("name", "=", name);
	let menuRow;
	if (chain.length === 0) menuRow = await selectMenu().orderBy("locale", "asc").executeTakeFirst();
	else {
		menuRow = void 0;
		for (const locale of chain) {
			menuRow = await selectMenu().where("locale", "=", locale).executeTakeFirst();
			if (menuRow) break;
		}
	}
	if (!menuRow) return null;
	const items = await buildMenuTree(await db.selectFrom("_emdash_menu_items").selectAll().$castTo().where("menu_id", "=", menuRow.id).orderBy("sort_order", "asc").execute(), db, menuRow.locale);
	return {
		id: menuRow.id,
		name: menuRow.name,
		label: menuRow.label,
		items,
		locale: menuRow.locale,
		translationGroup: menuRow.translation_group
	};
}
/**
* Build a hierarchical menu tree from a flat list of items. Items are
* resolved against the given `locale` so references land on the right
* per-locale content rows.
*/
async function buildMenuTree(items, db, locale) {
	const collectionSlugs = /* @__PURE__ */ new Set();
	for (const item of items) {
		if (item.reference_collection) collectionSlugs.add(item.reference_collection);
		if (item.type === "page" || item.type === "post") collectionSlugs.add(item.reference_collection || `${item.type}s`);
	}
	const urlPatterns = collectionSlugs.size > 0 ? await getCollectionUrlPatterns(db, collectionSlugs) : /* @__PURE__ */ new Map();
	const validItems = (await Promise.all(items.map((item) => resolveMenuItem(item, db, urlPatterns, locale)))).filter((item) => item !== null);
	const itemMap = /* @__PURE__ */ new Map();
	const rootItems = [];
	for (const item of validItems) itemMap.set(item.id, {
		...item,
		children: []
	});
	for (const item of items) {
		const menuItem = itemMap.get(item.id);
		if (!menuItem) continue;
		if (item.parent_id) {
			const parent = itemMap.get(item.parent_id);
			if (parent) parent.children.push(menuItem);
			else rootItems.push(menuItem);
		} else rootItems.push(menuItem);
	}
	return rootItems;
}
/**
* Look up the `url_pattern` for a set of collection slugs, request-cached so
* a page rendering several menus (header, footer, ...) only pays for the
* lookup once per distinct slug set. Callers must treat the returned map as
* read-only — it is shared across cache hits within the request.
*/
function getCollectionUrlPatterns(db, collectionSlugs) {
	const key = `menu-collection-patterns:${[...collectionSlugs].toSorted().join(",")}`;
	return requestCached(key, async () => {
		const rows = await db.selectFrom("_emdash_collections").select(["slug", "url_pattern"]).where("slug", "in", [...collectionSlugs]).execute();
		const urlPatterns = /* @__PURE__ */ new Map();
		for (const row of rows) urlPatterns.set(row.slug, row.url_pattern);
		return urlPatterns;
	});
}
/**
* Resolve a single menu item's URL. `reference_id` is a translation_group
* (migration 036 remapped all existing references); we join it against
* the per-locale ec_* row or per-locale taxonomy row.
*/
async function resolveMenuItem(item, db, urlPatterns, locale) {
	let url;
	try {
		switch (item.type) {
			case "custom":
				url = item.custom_url || "#";
				break;
			case "page":
			case "post":
				url = await resolveContentUrl(item.reference_collection || `${item.type}s`, item.reference_id, db, urlPatterns, locale);
				if (url === null) return null;
				break;
			case "taxonomy":
				url = await resolveTaxonomyUrl(item.reference_id, db, locale);
				if (url === null) return null;
				break;
			case "collection":
				if (!item.reference_collection) return null;
				if (item.reference_id) {
					url = await resolveContentUrl(item.reference_collection, item.reference_id, db, urlPatterns, locale);
					if (url === null) return null;
				} else url = `/${item.reference_collection}/`;
				break;
			default: if (item.reference_collection && item.reference_id) {
				url = await resolveContentUrl(item.reference_collection, item.reference_id, db, urlPatterns, locale);
				if (url === null) return null;
			} else url = "#";
		}
	} catch (error) {
		console.error(`Failed to resolve menu item ${item.id}:`, error);
		return null;
	}
	return {
		id: item.id,
		label: item.label,
		url: sanitizeHref(url),
		target: item.target || void 0,
		titleAttr: item.title_attr || void 0,
		cssClasses: item.css_classes || void 0,
		children: []
	};
}
var SLUG_PLACEHOLDER = /\{slug\}/g;
var ID_PLACEHOLDER = /\{id\}/g;
/**
* Interpolate a URL pattern with entry data
*
* Replaces `{slug}` and `{id}` placeholders.
*/
function interpolateUrlPattern(pattern, slug, id) {
	return pattern.replace(SLUG_PLACEHOLDER, slug).replace(ID_PLACEHOLDER, id);
}
/**
* Resolve the URL for a content reference. `referenceGroup` is the content
* row's translation_group; we look up the row in the requested locale
* (falling back to the source if no translation exists so the menu link is
* still clickable).
*/
async function resolveContentUrl(collection, referenceGroup, db, urlPatterns, locale) {
	if (!referenceGroup) return null;
	try {
		validateIdentifier(collection, "menu item collection");
		let result = await sql`
			SELECT id, slug FROM ${sql.ref(`ec_${collection}`)}
			WHERE translation_group = ${referenceGroup} AND locale = ${locale}
			LIMIT 1
		`.execute(db);
		let row = result.rows[0];
		if (!row) {
			result = await sql`
				SELECT id, slug FROM ${sql.ref(`ec_${collection}`)}
				WHERE translation_group = ${referenceGroup}
				ORDER BY locale ASC LIMIT 1
			`.execute(db);
			row = result.rows[0];
		}
		if (!row) row = (await sql`
				SELECT id, slug FROM ${sql.ref(`ec_${collection}`)}
				WHERE id = ${referenceGroup} LIMIT 1
			`.execute(db)).rows[0];
		if (!row) return null;
		const pattern = urlPatterns.get(collection);
		if (pattern) return interpolateUrlPattern(pattern, row.slug, row.id);
		return `/${collection}/${row.slug}`;
	} catch (error) {
		console.error(`Failed to resolve content URL for ${collection}/${referenceGroup}:`, error);
		return null;
	}
}
/**
* Resolve URL for a taxonomy term reference. `referenceGroup` is the term's
* translation_group; we pick the row in the active locale (or fall back).
*/
async function resolveTaxonomyUrl(referenceGroup, db, locale) {
	if (!referenceGroup) return null;
	let taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("translation_group", "=", referenceGroup).where("locale", "=", locale).executeTakeFirst();
	if (!taxonomy) taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("translation_group", "=", referenceGroup).orderBy("locale", "asc").executeTakeFirst();
	if (!taxonomy) taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("id", "=", referenceGroup).executeTakeFirst();
	if (!taxonomy) return null;
	return `/${taxonomy.name}/${taxonomy.slug}`;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/widgets/RecentPosts.astro
createAstro("https://astro.build");
var $$RecentPosts = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RecentPosts;
	const { count = 5, showThumbnails = false, showDate = true } = Astro.props;
	const { entries: posts } = await getEmDashCollection$1("posts", {
		limit: count,
		orderBy: { published_at: "desc" }
	});
	function getString(data, key) {
		const val = data[key];
		return typeof val === "string" ? val : void 0;
	}
	return renderTemplate`${maybeRenderHead($$result)}<ul class="widget-recent-posts">${posts.map((post) => {
		const publishedAt = getString(post.data, "publishedAt");
		const featuredImage = getString(post.data, "featured_image");
		const title = getString(post.data, "title");
		return renderTemplate`<li>${showThumbnails && featuredImage && renderTemplate`<img${addAttribute(featuredImage, "src")} alt="" class="widget-recent-posts__thumbnail">`}<a${addAttribute(`/posts/${post.id}`, "href")} class="widget-recent-posts__link">${title}</a>${showDate && publishedAt && renderTemplate`<time${addAttribute(publishedAt, "datetime")} class="widget-recent-posts__date">${new Date(publishedAt).toLocaleDateString()}</time>`}</li>`;
	})}</ul>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/widgets/RecentPosts.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/widgets/Categories.astro
createAstro("https://astro.build");
var $$Categories = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Categories;
	const { showCount = true, hierarchical = true } = Astro.props;
	const categories = await getTaxonomyTerms("category", { includeCounts: showCount });
	return renderTemplate`${maybeRenderHead($$result)}<ul class="widget-categories">${categories.length > 0 ? categories.map((category) => renderTemplate`<li><a${addAttribute(`/category/${category.slug}`, "href")} class="widget-categories__link">${category.label}</a>${showCount && category.count !== void 0 && renderTemplate`<span class="widget-categories__count">(${category.count})</span>`}</li>`) : renderTemplate`<li class="widget-categories__empty">No categories yet</li>`}</ul>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/widgets/Categories.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/widgets/Tags.astro
createAstro("https://astro.build");
var $$Tags = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Tags;
	const { showCount = false, limit = 20 } = Astro.props;
	const tags = (await getTaxonomyTerms("tag", { includeCounts: showCount })).slice(0, limit);
	return renderTemplate`${maybeRenderHead($$result)}<div class="widget-tags">${tags.length > 0 ? renderTemplate`<ul class="widget-tags__cloud">${tags.map((tag) => renderTemplate`<li><a${addAttribute(`/tag/${tag.slug}`, "href")} class="widget-tags__link">${tag.label}</a>${showCount && tag.count !== void 0 && renderTemplate`<span class="widget-tags__count">(${tag.count})</span>`}</li>`)}</ul>` : renderTemplate`<p class="widget-tags__empty">No tags yet</p>`}</div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/widgets/Tags.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/widgets/Search.astro
createAstro("https://astro.build");
var $$Search = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Search;
	const { placeholder = "Search..." } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<form method="get" action="/search" class="widget-search"><input type="search" name="q"${addAttribute(placeholder, "placeholder")} aria-label="Search" class="widget-search__input"><button type="submit" class="widget-search__button">Search</button></form>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/widgets/Search.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/widgets/Archives.astro
createAstro("https://astro.build");
var $$Archives = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Archives;
	const { type = "monthly", limit = 12 } = Astro.props;
	const { entries: posts } = await getEmDashCollection$1("posts", { orderBy: { published_at: "desc" } });
	const archives = /* @__PURE__ */ new Map();
	for (const post of posts) {
		const publishedAt = post.data.publishedAt;
		if (typeof publishedAt !== "string") continue;
		const date = new Date(publishedAt);
		let key;
		let label;
		let url;
		if (type === "yearly") {
			const year = date.getFullYear();
			key = `${year}`;
			label = `${year}`;
			url = `/archives/${year}`;
		} else {
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			key = `${year}-${month.toString().padStart(2, "0")}`;
			label = date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long"
			});
			url = `/archives/${year}/${month.toString().padStart(2, "0")}`;
		}
		if (!archives.has(key)) archives.set(key, {
			label,
			count: 0,
			url
		});
		archives.get(key).count++;
	}
	const archiveList = [...archives.values()].slice(0, limit);
	return renderTemplate`${maybeRenderHead($$result)}<ul class="widget-archives">${archiveList.map((archive) => renderTemplate`<li><a${addAttribute(archive.url, "href")} class="widget-archives__link">${archive.label}</a><span class="widget-archives__count">(${archive.count})</span></li>`)}</ul>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/widgets/Archives.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/WidgetRenderer.astro
createAstro("https://astro.build");
var $$WidgetRenderer = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$WidgetRenderer;
	const { widget } = Astro.props;
	const componentMap = {
		"core:recent-posts": $$RecentPosts,
		"core:categories": $$Categories,
		"core:tags": $$Tags,
		"core:search": $$Search,
		"core:archives": $$Archives
	};
	let menuData = null;
	if (widget.type === "menu" && widget.menuName) menuData = await getMenu(widget.menuName);
	let WidgetComponent = null;
	if (widget.type === "component" && widget.componentId) WidgetComponent = componentMap[widget.componentId];
	return renderTemplate`${maybeRenderHead($$result)}<div class="widget"${addAttribute(widget.id, "data-widget-id")}${addAttribute(widget.type, "data-widget-type")}>${widget.title && renderTemplate`<h3 class="widget__title">${widget.title}</h3>`}<div class="widget__content">${widget.type === "content" && widget.content && renderTemplate`${renderComponent($$result, "PortableText", $$PortableText, { "value": widget.content })}`}${widget.type === "menu" && menuData && renderTemplate`<nav class="widget__menu"><ul>${menuData.items.map((item) => renderTemplate`<li><a${addAttribute(sanitizeHref(item.url), "href")}${addAttribute(item.titleAttr || void 0, "title")}>${item.label}</a></li>`)}</ul></nav>`}${widget.type === "component" && WidgetComponent && renderTemplate`${renderComponent($$result, "WidgetComponent", WidgetComponent, { ...widget.componentProps || {} })}`}</div></div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/WidgetRenderer.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/WidgetArea.astro
createAstro("https://astro.build");
var $$WidgetArea = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$WidgetArea;
	const { name, class: className } = Astro.props;
	const area = await getWidgetArea(name);
	return renderTemplate`${area && area.widgets.length > 0 && renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["widget-area", className], "class:list")}${addAttribute(name, "data-widget-area")}>${area.widgets.map((widget) => renderTemplate`${renderComponent($$result, "WidgetRenderer", $$WidgetRenderer, { "widget": widget })}`)}</div>`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/WidgetArea.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/media/provider-loader.ts
var virtualMediaProviders;
var mediaProviderInstances = /* @__PURE__ */ new Map();
/**
* Load media providers from virtual module
*/
async function loadMediaProviders() {
	if (virtualMediaProviders === void 0) virtualMediaProviders = (await import("./media-providers_Dva2VzW9.mjs")).mediaProviders || [];
}
/**
* Get a media provider by ID.
*
* Used by EmDashMedia component for frontend rendering.
* Providers are lazy-loaded from virtual module and cached.
*
* @example
* ```ts
* const provider = await getMediaProvider("cloudflare-images");
* if (provider) {
*   const embed = provider.getEmbed(mediaValue, { width: 800 });
* }
* ```
*/
async function getMediaProvider(providerId) {
	const cached = mediaProviderInstances.get(providerId);
	if (cached) return cached;
	await loadMediaProviders();
	const entry = virtualMediaProviders?.find((p) => p.id === providerId);
	if (!entry) return;
	const provider = entry.createProvider({});
	mediaProviderInstances.set(providerId, provider);
	return provider;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/media/url.ts
var SAFE_STORAGE_KEY = /^[A-Za-z0-9._-]+$/;
/**
* Build a render-time media URL. Prefers `storageKey`, then rewrites an
* internal `url` via `resolve`, then falls back to the internal proxy for a
* bare `id`. External URLs and non-matching internal-looking URLs pass
* through untouched. Returns `""` when nothing usable is present.
*
* @internal
*/
function buildRenderMediaUrl(resolve, ref) {
	const { storageKey, url, id } = ref;
	if (storageKey) return resolve ? resolve(storageKey) : `${INTERNAL_MEDIA_PREFIX}${storageKey}`;
	if (url) {
		if (resolve && url.startsWith("/_emdash/api/media/file/")) {
			const key = url.slice(INTERNAL_MEDIA_PREFIX.length);
			if (SAFE_STORAGE_KEY.test(key)) return resolve(key);
		}
		return url;
	}
	if (id) return `${INTERNAL_MEDIA_PREFIX}${id}`;
	return "";
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/media/responsive.ts
/**
* Responsive image helpers shared by the public Image components.
*
* These build a `srcset` for locally-stored / R2-stored media by delegating to
* Astro's configured image service (`astro:assets`). On Cloudflare that is the
* Images binding; on Node it is sharp; if neither is available it is a no-op
* passthrough. The calling `.astro` component passes Astro's `getImage` in so
* this module stays free of the `astro:assets` virtual import (which only
* resolves inside an Astro project, not in this precompiled package).
*/
/** Standard responsive breakpoints. Matches CDN-provider srcset generation. */
var RESPONSIVE_BREAKPOINTS = [
	640,
	750,
	828,
	960,
	1080,
	1280,
	1600,
	1920
];
/** Matches absolute http(s) URLs — the only shape Astro's image services optimize. */
var ABSOLUTE_HTTP_URL = /^https?:\/\//i;
/**
* Pick the srcset widths to generate for an image rendered at `maxWidth`.
* Includes breakpoints up to 2x (retina) plus the rendered width itself, so the
* browser always has an exact-fit candidate.
*/
function responsiveWidths(maxWidth) {
	const cap = maxWidth * 2;
	const widths = new Set(RESPONSIVE_BREAKPOINTS.filter((w) => w <= cap));
	widths.add(maxWidth);
	return [...widths].toSorted((a, b) => a - b);
}
/** Build the `sizes` attribute for an image with a known display width. */
function responsiveSizes(width) {
	return width ? `(min-width: ${width}px) ${width}px, 100vw` : "100vw";
}
/**
* Make a same-origin media URL absolute so Astro's image service can optimize it.
*
* Astro only optimizes absolute http(s) URLs; a same-origin proxy path like
* `/_emdash/api/media/file/x.jpg` is otherwise treated as an unoptimizable
* public asset. Resolving it against the site's public origin (and authorizing
* that origin via `image.remotePatterns`) lets the service transform it.
*
* Only **same-origin** root-relative paths are resolved. Protocol-relative
* URLs (`//evil.com/x`) and backslash tricks (`/\evil.com`) also start with `/`
* but resolve to a different origin -- a classic SSRF vector once a
* remotePattern authorizes the media path -- so anything that escapes the
* origin is returned unchanged (and then skipped by `buildResponsiveImage`,
* which only accepts absolute http(s) URLs). Already-absolute URLs (CDN/public
* bucket) and non-path values (`data:`, `blob:`) are returned unchanged too.
*/
function toAbsoluteMediaUrl(src, origin) {
	if (!src || !origin || !src.startsWith("/")) return src;
	try {
		const resolved = new URL(src, origin);
		if (resolved.origin !== new URL(origin).origin) return src;
		return resolved.href;
	} catch {
		return src;
	}
}
/**
* Generate a responsive `src`/`srcset`/`sizes` for a media URL via Astro's
* configured image service.
*
* Astro's image services (sharp, Cloudflare `/cdn-cgi/image`, and the default
* Cloudflare `cloudflare-binding` service) only optimize **absolute** URLs whose
* host is authorized via `image.domains` / `image.remotePatterns`. Anything else
* is passed through unchanged, which would yield a useless srcset (the same URL
* at every width descriptor). We therefore only attempt optimization for
* absolute http(s) URLs and verify the service actually rewrote the URL.
*
* Returns `null` so callers fall back to a plain `<img>` when:
*  - dimensions are unknown (avoids an inferSize fetch on every render),
*  - the URL is relative (a same-origin proxy/public asset Astro won't optimize),
*  - the host isn't authorized (the service passed the URL through unchanged),
*  - no image service is configured / `getImage` throws.
*/
async function buildResponsiveImage(getImage, opts) {
	const { src, width, height } = opts;
	if (!src || !width || !height) return null;
	if (!ABSOLUTE_HTTP_URL.test(src)) return null;
	try {
		const sizes = responsiveSizes(width);
		const result = await getImage({
			src,
			width,
			height,
			widths: responsiveWidths(width),
			sizes
		});
		if (!result.src || result.src === src) return null;
		return {
			src: result.src,
			srcset: result.srcSet?.attribute || void 0,
			sizes
		};
	} catch {
		return null;
	}
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/api/public-url.ts
var _envSiteUrl = null;
function getEnvSiteUrl() {
	if (_envSiteUrl !== null) return _envSiteUrl || void 0;
	try {
		const value = typeof process !== "undefined" && process.env?.EMDASH_SITE_URL || typeof process !== "undefined" && process.env?.SITE_URL || "";
		if (value) {
			const parsed = new URL(value);
			if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
				_envSiteUrl = "";
				return;
			}
			_envSiteUrl = parsed.origin;
		} else _envSiteUrl = "";
	} catch {
		_envSiteUrl = "";
	}
	return _envSiteUrl || void 0;
}
function getPublicOrigin(url, config) {
	return config?.siteUrl || getEnvSiteUrl() || url.origin;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/EmDashImage.astro
createAstro("https://astro.build");
var $$EmDashImage = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmDashImage;
	const { image, alt, width, height, priority, placeholder = true, class: className, ...attrs } = Astro.props;
	function normalizeImage(img) {
		if (!img) return null;
		if (typeof img === "string") return {
			id: "",
			src: img
		};
		return img;
	}
	function buildLocalImageUrl(img) {
		return buildRenderMediaUrl(Astro.locals.emdash?.getPublicMediaUrl, {
			storageKey: img.meta?.storageKey,
			id: img.id
		});
	}
	function generateSrcset(getSrc, maxWidth, aspectRatio) {
		return RESPONSIVE_BREAKPOINTS.filter((w) => w <= maxWidth * 2).map((w) => {
			return `${getSrc({
				width: w,
				height: aspectRatio ? Math.round(w / aspectRatio) : void 0
			})} ${w}w`;
		}).join(", ");
	}
	const img = normalizeImage(image);
	const finalWidth = width ?? img?.width;
	const finalHeight = height ?? img?.height;
	const finalAlt = alt ?? img?.alt ?? "";
	const aspectRatio = finalWidth && finalHeight ? finalWidth / finalHeight : void 0;
	let src = "";
	let srcset;
	let sizes;
	let astroImageSrc = "";
	if (img) {
		const providerId = img.provider ?? "local";
		if (providerId === "local" || img.src) {
			src = img.src || buildLocalImageUrl(img);
			const publicOrigin = getPublicOrigin(Astro.url, Astro.locals.emdash?.config);
			const absoluteSrc = toAbsoluteMediaUrl(src, publicOrigin);
			if (finalWidth && finalHeight && absoluteSrc.startsWith(`${publicOrigin}/`)) astroImageSrc = absoluteSrc;
			else {
				const optimized = await buildResponsiveImage(getImage, {
					src: absoluteSrc,
					width: finalWidth,
					height: finalHeight
				});
				if (optimized) {
					src = optimized.src;
					srcset = optimized.srcset;
					sizes = optimized.sizes;
				}
			}
		} else {
			try {
				const provider = await getMediaProvider(providerId);
				if (provider) {
					const result = provider.getEmbed(img, {
						width: finalWidth,
						height: finalHeight
					});
					const embed = result instanceof Promise ? await result : result;
					if (embed.type === "image") {
						src = embed.src;
						if (embed.getSrc) {
							const maxWidth = finalWidth || 1200;
							srcset = generateSrcset(embed.getSrc, maxWidth, aspectRatio);
							sizes = finalWidth ? `(min-width: ${finalWidth}px) ${finalWidth}px, 100vw` : "100vw";
						}
					}
				} else console.warn(`[EmDashImage] Provider not found: ${providerId}`);
			} catch (error) {
				console.error(`[EmDashImage] Failed to get embed for image ${img.id}:`, error);
			}
			if (!src) src = buildLocalImageUrl(img);
		}
	}
	const blurhash = img?.blurhash ?? img?.meta?.blurhash;
	const dominantColor = img?.dominantColor ?? img?.meta?.dominantColor;
	let placeholderStyle = "";
	if (placeholder && blurhash) {
		const { blurhashToImageCssString } = await import("./dist_B6rHSkJ4.mjs");
		placeholderStyle = blurhashToImageCssString(blurhash);
	} else if (placeholder && dominantColor) placeholderStyle = `background-color: ${dominantColor};`;
	const imgProps = {
		src,
		srcset,
		sizes,
		width: finalWidth,
		height: finalHeight,
		alt: finalAlt,
		loading: priority ? "eager" : "lazy",
		fetchpriority: priority ? "high" : void 0,
		decoding: "async",
		style: placeholderStyle || void 0,
		class: ["emdash-image-media", className].filter(Boolean).join(" "),
		...attrs
	};
	return renderTemplate`${img && astroImageSrc ? renderTemplate`${renderComponent($$result, "AstroImage", $$Image$1, {
		"src": astroImageSrc,
		"alt": finalAlt,
		"width": finalWidth,
		"height": finalHeight,
		"priority": priority,
		"layout": "constrained",
		"loading": priority ? "eager" : "lazy",
		"decoding": "async",
		"class": className,
		"style": placeholderStyle || void 0,
		...attrs,
		"data-astro-cid-7c2fdxdt": true
	})}` : img && src ? renderTemplate`${maybeRenderHead($$result)}<img${spreadAttributes(imgProps, void 0, { "class": "astro-7c2fdxdt" })} data-astro-cid-7c2fdxdt>` : null}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/EmDashImage.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/EmDashMedia.astro
createAstro("https://astro.build");
var $$EmDashMedia = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmDashMedia;
	const { value, alt, width, height, format, ...attrs } = Astro.props;
	function normalizeValue(val) {
		if (!val) return null;
		if (typeof val === "string") return {
			id: "",
			src: val,
			provider: "local"
		};
		return val;
	}
	const media = normalizeValue(value);
	let embed = null;
	if (media) {
		const providerId = media.provider ?? "local";
		const provider = await getMediaProvider(providerId);
		if (provider) {
			const embedOptions = {
				width,
				height,
				format
			};
			try {
				const result = provider.getEmbed(media, embedOptions);
				embed = result instanceof Promise ? await result : result;
			} catch (error) {
				console.warn(`Failed to get embed for media ${media.id}:`, error);
			}
		} else if (media.src) embed = {
			type: "image",
			src: media.src,
			width: media.width,
			height: media.height,
			alt: media.alt
		};
		else if (providerId === "local") {
			const storageKey = media.meta?.storageKey || media.id;
			if (storageKey) {
				const mimeType = media.mimeType || "";
				if (mimeType.startsWith("video/")) embed = {
					type: "video",
					src: `/_emdash/api/media/file/${storageKey}`,
					width: media.width,
					height: media.height,
					controls: true,
					preload: "metadata"
				};
				else if (mimeType.startsWith("audio/")) embed = {
					type: "audio",
					src: `/_emdash/api/media/file/${storageKey}`,
					controls: true,
					preload: "metadata"
				};
				else embed = {
					type: "image",
					src: `/_emdash/api/media/file/${storageKey}`,
					width: media.width,
					height: media.height,
					alt: media.alt
				};
			}
		}
	}
	const finalAlt = alt ?? (embed?.type === "image" ? embed.alt : void 0) ?? media?.alt ?? "";
	return renderTemplate`${embed?.type === "image" && renderTemplate`${maybeRenderHead($$result)}<img${addAttribute(embed.src, "src")}${addAttribute(embed.srcset, "srcset")}${addAttribute(embed.sizes, "sizes")}${addAttribute(embed.width, "width")}${addAttribute(embed.height, "height")}${addAttribute(finalAlt, "alt")} loading="lazy" decoding="async"${spreadAttributes(attrs)}>`}${embed?.type === "video" && renderTemplate`<video${addAttribute(embed.width, "width")}${addAttribute(embed.height, "height")}${addAttribute(embed.controls ?? true, "controls")}${addAttribute(embed.autoplay, "autoplay")}${addAttribute(embed.muted, "muted")}${addAttribute(embed.loop, "loop")}${addAttribute(embed.playsinline, "playsinline")}${addAttribute(embed.preload ?? "metadata", "preload")}${addAttribute(embed.crossorigin, "crossorigin")}${addAttribute(embed.poster, "poster")}${spreadAttributes(attrs)}>${embed.src && renderTemplate`<source${addAttribute(embed.src, "src")}>`}${embed.sources?.map((s) => renderTemplate`<source${addAttribute(s.src, "src")}${addAttribute(s.type, "type")}>`)}</video>`}${embed?.type === "audio" && renderTemplate`<audio${addAttribute(embed.controls ?? true, "controls")}${addAttribute(embed.autoplay, "autoplay")}${addAttribute(embed.muted, "muted")}${addAttribute(embed.loop, "loop")}${addAttribute(embed.preload ?? "metadata", "preload")}${spreadAttributes(attrs)}>${embed.src && renderTemplate`<source${addAttribute(embed.src, "src")}>`}${embed.sources?.map((s) => renderTemplate`<source${addAttribute(s.src, "src")}${addAttribute(s.type, "type")}>`)}</audio>`}${embed?.type === "component" && renderTemplate`<div class="emdash-media-component"${addAttribute(embed.package, "data-package")}${addAttribute(embed.export, "data-export")}><p>Custom media component: ${embed.package}</p></div>`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/EmDashMedia.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/portable-text-text-align.ts
var ALIGN_CLASS_MAP = {
	center: "has-text-align-center",
	right: "has-text-align-right",
	justify: "has-text-align-justify"
};
/**
* Returns the CSS class for a textAlign value, or `undefined` when no class
* should be emitted (default left, missing, or unknown values).
*
* Allowlist-only by design: arbitrary strings are rejected so a hand-edited
* or imported Portable Text block cannot inject attacker-controlled class
* names into the rendered HTML.
*/
function textAlignClassName(value) {
	if (value === void 0) return void 0;
	if (Object.hasOwn(ALIGN_CLASS_MAP, value)) return ALIGN_CLASS_MAP[value];
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Block.astro
createAstro("https://astro.build");
var $$Block = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Block;
	const { node, index: _index, isInline: _isInline, ...attrs } = Astro.props;
	const styleIs = (style) => style === node.style;
	const alignClass = textAlignClassName(node.textAlign);
	return renderTemplate`${styleIs("h1") ? renderTemplate`${maybeRenderHead($$result)}<h1${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h1>` : styleIs("h2") ? renderTemplate`<h2${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h2>` : styleIs("h3") ? renderTemplate`<h3${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h3>` : styleIs("h4") ? renderTemplate`<h4${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h4>` : styleIs("h5") ? renderTemplate`<h5${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h5>` : styleIs("h6") ? renderTemplate`<h6${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</h6>` : styleIs("blockquote") ? renderTemplate`<blockquote${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</blockquote>` : styleIs("normal") ? renderTemplate`<p${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</p>` : renderTemplate`<p${addAttribute(alignClass, "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</p>`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Block.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Image.astro
createAstro("https://astro.build");
var $$Image = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Image;
	function generateSrcset(getSrc, maxWidth, aspectRatio) {
		return RESPONSIVE_BREAKPOINTS.filter((w) => w <= maxWidth * 2).map((w) => {
			return `${getSrc({
				width: w,
				height: aspectRatio ? Math.round(w / aspectRatio) : void 0
			})} ${w}w`;
		}).join(", ");
	}
	const { node, placeholder = true } = Astro.props;
	if (!node?.asset) return null;
	const { asset, alt = "", caption, width, height, displayWidth, displayHeight, alignment } = node;
	const aspectRatio = width && height ? width / height : void 0;
	let renderWidth;
	let renderHeight;
	if (displayWidth && displayHeight) {
		renderWidth = displayWidth;
		renderHeight = displayHeight;
	} else if (displayWidth && aspectRatio) {
		renderWidth = displayWidth;
		renderHeight = Math.round(displayWidth / aspectRatio);
	} else if (displayHeight && aspectRatio) {
		renderWidth = Math.round(displayHeight * aspectRatio);
		renderHeight = displayHeight;
	} else {
		renderWidth = width;
		renderHeight = height;
	}
	let src = "";
	let srcset;
	let sizes;
	let astroImageSrc = "";
	const providerId = asset.provider;
	if (providerId && providerId !== "local") {
		const provider = await getMediaProvider(providerId);
		if (provider) try {
			const mediaValue = {
				provider: providerId,
				id: asset._ref,
				width: renderWidth,
				height: renderHeight,
				alt
			};
			const result = provider.getEmbed(mediaValue, {
				width: renderWidth,
				height: renderHeight
			});
			const embed = result instanceof Promise ? await result : result;
			if (embed.type === "image") {
				src = embed.src;
				if (embed.getSrc) {
					const maxWidth = renderWidth || 1200;
					const ar = renderWidth && renderHeight ? renderWidth / renderHeight : aspectRatio;
					srcset = generateSrcset(embed.getSrc, maxWidth, ar);
					sizes = renderWidth ? `(min-width: ${renderWidth}px) ${renderWidth}px, 100vw` : "100vw";
				}
			}
		} catch (error) {
			console.warn(`Failed to get embed for image ${asset._ref}:`, error);
		}
	}
	if (!src) {
		src = buildRenderMediaUrl(Astro.locals.emdash?.getPublicMediaUrl, {
			url: asset.url,
			id: asset._ref
		});
		if (renderWidth && renderHeight) astroImageSrc = toAbsoluteMediaUrl(src, getPublicOrigin(Astro.url, Astro.locals.emdash?.config));
	}
	const blurhash = node.blurhash ?? asset.meta?.blurhash;
	const dominantColor = node.dominantColor ?? asset.meta?.dominantColor;
	let placeholderStyle = "";
	if (placeholder && blurhash) {
		const { blurhashToImageCssString } = await import("./dist_B6rHSkJ4.mjs");
		placeholderStyle = blurhashToImageCssString(blurhash);
	} else if (placeholder && dominantColor) placeholderStyle = `background-color: ${dominantColor};`;
	return renderTemplate`${maybeRenderHead($$result)}<figure${addAttribute(["emdash-image", alignment && `emdash-image--align-${alignment}`], "class:list")} data-astro-cid-z5dljple>${astroImageSrc ? renderTemplate`${renderComponent($$result, "AstroImage", $$Image$1, {
		"src": astroImageSrc,
		"alt": alt,
		"width": renderWidth,
		"height": renderHeight,
		"layout": "constrained",
		"loading": "lazy",
		"decoding": "async",
		"style": placeholderStyle || void 0,
		"data-astro-cid-z5dljple": true
	})}` : renderTemplate`<img${addAttribute(src, "src")}${addAttribute(srcset, "srcset")}${addAttribute(sizes, "sizes")}${addAttribute(alt, "alt")}${addAttribute(renderWidth, "width")}${addAttribute(renderHeight, "height")} loading="lazy" decoding="async"${addAttribute(placeholderStyle || void 0, "style")} data-astro-cid-z5dljple>`}${caption && renderTemplate`<figcaption data-astro-cid-z5dljple>${caption}</figcaption>`}</figure>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Image.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Code.astro
createAstro("https://astro.build");
var $$Code = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Code;
	const { node } = Astro.props;
	if (!node?.code) return null;
	const { code, language, filename } = node;
	const languageClass = language ? `language-${language}` : "";
	return renderTemplate`${maybeRenderHead($$result)}<div class="emdash-code" data-astro-cid-3xic2hei>${filename && renderTemplate`<div class="emdash-code-filename" data-astro-cid-3xic2hei>${filename}</div>`}<pre${addAttribute(languageClass, "class")} data-astro-cid-3xic2hei><code${addAttribute(languageClass, "class")} data-astro-cid-3xic2hei>${code}</code></pre></div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Code.astro", void 0);
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/decode-codepoint.js
/**
* Replace the given code point with a replacement character if it is a
* surrogate or is outside the valid range. Otherwise return the code
* point unchanged.
* @param codePoint Unicode code point to convert.
*/
function replaceCodePoint(codePoint) {
	if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
	return decodeMap.get(codePoint) ?? codePoint;
}
var decodeMap;
var init_decode_codepoint = __esmMin((() => {
	decodeMap = /* @__PURE__ */ new Map([
		[0, 65533],
		[128, 8364],
		[130, 8218],
		[131, 402],
		[132, 8222],
		[133, 8230],
		[134, 8224],
		[135, 8225],
		[136, 710],
		[137, 8240],
		[138, 352],
		[139, 8249],
		[140, 338],
		[142, 381],
		[145, 8216],
		[146, 8217],
		[147, 8220],
		[148, 8221],
		[149, 8226],
		[150, 8211],
		[151, 8212],
		[152, 732],
		[153, 8482],
		[154, 353],
		[155, 8250],
		[156, 339],
		[158, 382],
		[159, 376]
	]);
}));
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/internal/decode-shared.js
/**
* Shared base64 decode helper for generated decode data.
* Assumes global atob is available.
* @param input Input string to encode or decode.
*/
function decodeBase64(input) {
	const binary = atob(input);
	const evenLength = binary.length & -2;
	const out = new Uint16Array(evenLength / 2);
	for (let index = 0, outIndex = 0; index < evenLength; index += 2) {
		const lo = binary.charCodeAt(index);
		const hi = binary.charCodeAt(index + 1);
		out[outIndex++] = lo | hi << 8;
	}
	return out;
}
var init_decode_shared = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/generated/decode-data-html.js
var htmlDecodeTree;
var init_decode_data_html = __esmMin((() => {
	init_decode_shared();
	htmlDecodeTree = /* #__PURE__ */ decodeBase64("QR08ALkAAgH6AYsDNQR2BO0EPgXZBQEGLAbdBxMISQrvCmQLfQurDKQNLw4fD4YPpA+6D/IPAAAAAAAAAAAAAAAAKhBMEY8TmxUWF2EYLBkxGuAa3RsJHDscWR8YIC8jSCSIJcMl6ie3Ku8rEC0CLjoupS7kLgAIRU1hYmNmZ2xtbm9wcnN0dVQAWgBeAGUAaQBzAHcAfgCBAIQAhwCSAJoAoACsALMAbABpAGcAO4DGAMZAUAA7gCYAJkBjAHUAdABlADuAwQDBQHIiZXZlAAJhAAFpeW0AcgByAGMAO4DCAMJAEGRyAADgNdgE3XIAYQB2AGUAO4DAAMBA8CFoYZFj4SFjcgBhZAAAoFMqAAFncIsAjgBvAG4ABGFmAADgNdg43fAlbHlGdW5jdGlvbgCgYSBpAG4AZwA7gMUAxUAAAWNzpACoAHIAAOA12Jzc6SFnbgCgVCJpAGwAZABlADuAwwDDQG0AbAA7gMQAxEAABGFjZWZvcnN1xQDYANoA7QDxAPYA+QD8AAABY3LJAM8AayNzbGFzaAAAoBYidgHTANUAAKDnKmUAZAAAoAYjeQARZIABY3J0AOAA5QDrAGEidXNlAACgNSLuI291bGxpcwCgLCFhAJJjcgAA4DXYBd1wAGYAAOA12Dnd5SF2ZdhiYwDyAOoAbSJwZXEAAKBOIgAHSE9hY2RlZmhpbG9yc3UXARoBHwE6AVIBVQFiAWQBZgGCAakB6QHtAfIBYwB5ACdkUABZADuAqQCpQIABY3B5ACUBKAE1AfUhdGUGYWmg0iJ0KGFsRGlmZmVyZW50aWFsRAAAoEUhbCJleXMAAKAtIQACYWVpb0EBRAFKAU0B8iFvbgxhZABpAGwAO4DHAMdAcgBjAAhhbiJpbnQAAKAwIm8AdAAKYQABZG5ZAV0BaSJsbGEAuGB0I2VyRG90ALdg8gA5AWkAp2NyImNsZQAAAkRNUFRwAXQBeQF9AW8AdAAAoJkiaSJudXMAAKCWIuwhdXMAoJUiaSJtZXMAAKCXIm8AAAFjc4cBlAFrKndpc2VDb250b3VySW50ZWdyYWwAAKAyImUjQ3VybHkAAAFEUZwBpAFvJXVibGVRdW90ZQAAoB0gdSJvdGUAAKAZIAACbG5wdbABtgHNAdgBbwBuAGWgNyIAoHQqgAFnaXQAvAHBAcUB8iJ1ZW50AKBhIm4AdAAAoC8i7yV1ckludGVncmFsAKAuIgABZnLRAdMBAKACIe8iZHVjdACgECJuLnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbAAAoDMi7yFzcwCgLypjAHIAAOA12J7ccABDoNMiYQBwAACgTSKABURKU1phY2VmaW9zAAsCEgIVAhgCGwIsAjQCOQI9AnMCfwNvoEUh9CJyYWhkAKARKWMAeQACZGMAeQAFZGMAeQAPZIABZ3JzACECJQIoAuchZXIAoCEgcgAAoKEhaAB2AACg5CoAAWF5MAIzAvIhb24OYRRkbAB0oAciYQCUY3IAAOA12AfdAAFhZkECawIAAWNtRQJnAvIjaXRpY2FsAAJBREdUUAJUAl8CYwJjInV0ZQC0YG8AdAFZAloC2WJiJGxlQWN1dGUA3WJyImF2ZQBgYGkibGRlANxi7yFuZACgxCJmJWVyZW50aWFsRAAAoEYhcAR9AgAAAAAAAIECjgIAABoDZgAA4DXYO91EoagAhQKJAm8AdAAAoNwgcSJ1YWwAAKBQIuIhbGUAA0NETFJVVpkCqAK1Au8C/wIRA28AbgB0AG8AdQByAEkAbgB0AGUAZwByAGEA7ADEAW8AdAKvAgAAAACwAqhgbiNBcnJvdwAAoNMhAAFlb7kC0AJmAHQAgAFBUlQAwQLGAs0CciJyb3cAAKDQIekkZ2h0QXJyb3cAoNQhZQDlACsCbgBnAAABTFLWAugC5SFmdAABQVLcAuECciJyb3cAAKD4J+kkZ2h0QXJyb3cAoPon6SRnaHRBcnJvdwCg+SdpImdodAAAAUFU9gL7AnIicm93AACg0iFlAGUAAKCoInAAQQIGAwAAAAALA3Iicm93AACg0SFvJHduQXJyb3cAAKDVIWUlcnRpY2FsQmFyAACgJSJuAAADQUJMUlRhJAM2AzoDWgNxA3oDciJyb3cAAKGTIUJVLAMwA2EAcgAAoBMpcCNBcnJvdwAAoPUhciJldmUAEWPlIWZ00gJDAwAASwMAAFIDaSVnaHRWZWN0b3IAAKBQKWUkZVZlY3RvcgAAoF4p5SJjdG9yQqC9IWEAcgAAoFYpaSJnaHQA1AFiAwAAaQNlJGVWZWN0b3IAAKBfKeUiY3RvckKgwSFhAHIAAKBXKWUAZQBBoKQiciJyb3cAAKCnIXIAcgBvAPcAtAIAAWN0gwOHA3IAAOA12J/c8iFvaxBhAAhOVGFjZGZnbG1vcHFzdHV4owOlA6kDsAO/A8IDxgPNA9ID8gP9AwEEFAQeBCAEJQRHAEphSAA7gNAA0EBjAHUAdABlADuAyQDJQIABYWl5ALYDuQO+A/Ihb24aYXIAYwA7gMoAykAtZG8AdAAWYXIAAOA12AjdcgBhAHYAZQA7gMgAyEDlIm1lbnQAoAgiAAFhcNYD2QNjAHIAEmF0AHkAUwLhAwAAAADpA20lYWxsU3F1YXJlAACg+yVlJ3J5U21hbGxTcXVhcmUAAKCrJQABZ3D2A/kDbwBuABhhZgAA4DXYPN3zImlsb26VY3UAAAFhaQYEDgRsAFSgdSppImxkZQAAoEIi7CNpYnJpdW0AoMwhAAFjaRgEGwRyAACgMCFtAACgcyphAJdjbQBsADuAywDLQAABaXApBC0E8yF0cwCgAyLvJG5lbnRpYWxFAKBHIYACY2Zpb3MAPQQ/BEMEXQRyBHkAJGRyAADgNdgJ3WwibGVkAFMCTAQAAAAAVARtJWFsbFNxdWFyZQAAoPwlZSdyeVNtYWxsU3F1YXJlAACgqiVwA2UEAABpBAAAAABtBGYAAOA12D3dwSFsbACgACLyI2llcnRyZgCgMSFjAPIAcQQABkpUYWJjZGZnb3JzdIgEiwSOBJMElwSkBKcEqwStBLIE5QTqBGMAeQADZDuAPgA+QO0hbWFkoJMD3GNyImV2ZQAeYYABZWl5AJ0EoASjBOQhaWwiYXIAYwAcYRNkbwB0ACBhcgAA4DXYCt0AoNkicABmAADgNdg+3eUiYXRlcgADRUZHTFNUvwTIBM8E1QTZBOAEcSJ1YWwATKBlIuUhc3MAoNsidSRsbEVxdWFsAACgZyJyI2VhdGVyAACgoirlIXNzAKB3IuwkYW50RXF1YWwAoH4qaSJsZGUAAKBzImMAcgAA4DXYotwAoGsiAARBYWNmaW9zdfkE/QQFBQgFCwUTBSIFKwVSIkRjeQAqZAABY3QBBQQFZQBrAMdiXmDpIXJjJGFyAACgDCFsJWJlcnRTcGFjZQAAoAsh8AEYBQAAGwVmAACgDSHpJXpvbnRhbExpbmUAoAAlAAFjdCYFKAXyABIF8iFvayZhbQBwAEQBMQU5BW8AdwBuAEgAdQBtAPAAAAFxInVhbAAAoE8iAAdFSk9hY2RmZ21ub3N0dVMFVgVZBVwFYwVtBXAFcwV6BZAFtgXFBckFzQVjAHkAFWTsIWlnMmFjAHkAAWRjAHUAdABlADuAzQDNQAABaXlnBWwFcgBjADuAzgDOQBhkbwB0ADBhcgAAoBEhcgBhAHYAZQA7gMwAzEAAoREhYXB/BYsFAAFjZ4MFhQVyACphaSNuYXJ5SQAAoEghbABpAGUA8wD6AvQBlQUAAKUFZaAsIgABZ3KaBZ4F8iFhbACgKyLzI2VjdGlvbgCgwiJpI3NpYmxlAAABQ1SsBbEFbyJtbWEAAKBjIGkibWVzAACgYiCAAWdwdAC8Bb8FwwVvAG4ALmFmAADgNdhA3WEAmWNjAHIAAKAQIWkibGRlAChh6wHSBQAA1QVjAHkABmRsADuAzwDPQIACY2Zvc3UA4QXpBe0F8gX9BQABaXnlBegFcgBjADRhGWRyAADgNdgN3XAAZgAA4DXYQd3jAfcFAAD7BXIAAOA12KXc8iFjeQhk6yFjeQRkgANISmFjZm9zAAwGDwYSBhUGHQYhBiYGYwB5ACVkYwB5AAxk8CFwYZpjAAFleRkGHAbkIWlsNmEaZHIAAOA12A7dcABmAADgNdhC3WMAcgAA4DXYptyABUpUYWNlZmxtb3N0AD0GQAZDBl4GawZkB2gHcAd0B80H2gdjAHkACWQ7gDwAPECAAmNtbnByAEwGTwZSBlUGWwb1IXRlOWHiIWRhm2NnAACg6ifsI2FjZXRyZgCgEiFyAACgniGAAWFleQBkBmcGagbyIW9uPWHkIWlsO2EbZAABZnNvBjQHdAAABUFDREZSVFVWYXKABp4GpAbGBssG3AYDByEHwQIqBwABbnKEBowGZyVsZUJyYWNrZXQAAKDoJ/Ihb3cAoZAhQlKTBpcGYQByAACg5CHpJGdodEFycm93AKDGIWUjaWxpbmcAAKAII28A9QGqBgAAsgZiJWxlQnJhY2tldAAAoOYnbgDUAbcGAAC+BmUkZVZlY3RvcgAAoGEp5SJjdG9yQqDDIWEAcgAAoFkpbCJvb3IAAKAKI2kiZ2h0AAABQVbSBtcGciJyb3cAAKCUIeUiY3RvcgCgTikAAWVy4AbwBmUAAKGjIkFW5gbrBnIicm93AACgpCHlImN0b3IAoFopaSNhbmdsZQBCorIi+wYAAAAA/wZhAHIAAKDPKXEidWFsAACgtCJwAIABRFRWAAoHEQcYB+8kd25WZWN0b3IAoFEpZSRlVmVjdG9yAACgYCnlImN0b3JCoL8hYQByAACgWCnlImN0b3JCoLwhYQByAACgUilpAGcAaAB0AGEAcgByAG8A9wDMAnMAAANFRkdMU1Q/B0cHTgdUB1gHXwfxJXVhbEdyZWF0ZXIAoNoidSRsbEVxdWFsAACgZiJyI2VhdGVyAACgdiLlIXNzAKChKuwkYW50RXF1YWwAoH0qaSJsZGUAAKByInIAAOA12A/dZaDYIuYjdGFycm93AKDaIWkiZG90AD9hgAFucHcAege1B7kHZwAAAkxSbHKCB5QHmwerB+UhZnQAAUFSiAeNB3Iicm93AACg9SfpJGdodEFycm93AKD3J+kkZ2h0QXJyb3cAoPYn5SFmdAABYXLcAqEHaQBnAGgAdABhAHIAcgBvAPcA5wJpAGcAaAB0AGEAcgByAG8A9wDuAmYAAOA12EPdZQByAAABTFK/B8YHZSRmdEFycm93AACgmSHpJGdodEFycm93AKCYIYABY2h0ANMH1QfXB/IAWgYAoLAh8iFva0FhAKBqIgAEYWNlZmlvc3XpB+wH7gf/BwMICQgOCBEIcAAAoAUpeQAcZAABZGzyB/kHaSR1bVNwYWNlAACgXyBsI2ludHJmAACgMyFyAADgNdgQ3e4jdXNQbHVzAKATInAAZgAA4DXYRN1jAPIA/gecY4AESmFjZWZvc3R1ACEIJAgoCDUIgQiFCDsKQApHCmMAeQAKZGMidXRlAENhgAFhZXkALggxCDQI8iFvbkdh5CFpbEVhHWSAAWdzdwA7CGEIfQjhInRpdmWAAU1UVgBECEwIWQhlJWRpdW1TcGFjZQAAoAsgaABpAAABY25SCFMIawBTAHAAYQBjAOUASwhlAHIAeQBUAGgAaQDuAFQI9CFlZAABR0xnCHUIcgBlAGEAdABlAHIARwByAGUAYQB0AGUA8gDrBGUAcwBzAEwAZQBzAPMA2wdMImluZQAKYHIAAOA12BHdAAJCbnB0jAiRCJkInAhyImVhawAAoGAgwiZyZWFraW5nU3BhY2WgYGYAAKAVIUOq7CqzCMIIzQgAAOcIGwkAAAAAAAAtCQAAbwkAAIcJAACdCcAJGQoAADQKAAFvdbYIvAjuI2dydWVudACgYiJwIkNhcAAAoG0ibyh1YmxlVmVydGljYWxCYXIAAKAmIoABbHF4ANII1wjhCOUibWVudACgCSL1IWFsVKBgImkibGRlAADgQiI4A2kic3RzAACgBCJyI2VhdGVyAACjbyJFRkdMU1T1CPoIAgkJCQ0JFQlxInVhbAAAoHEidSRsbEVxdWFsAADgZyI4A3IjZWF0ZXIAAOBrIjgD5SFzcwCgeSLsJGFudEVxdWFsAOB+KjgDaSJsZGUAAKB1IvUhbXBEASAJJwnvI3duSHVtcADgTiI4A3EidWFsAADgTyI4A2UAAAFmczEJRgn0JFRyaWFuZ2xlQqLqIj0JAAAAAEIJYQByAADgzyk4A3EidWFsAACg7CJzAICibiJFR0xTVABRCVYJXAlhCWkJcSJ1YWwAAKBwInIjZWF0ZXIAAKB4IuUhc3MA4GoiOAPsJGFudEVxdWFsAOB9KjgDaSJsZGUAAKB0IuUic3RlZAABR0x1CX8J8iZlYXRlckdyZWF0ZXIA4KIqOAPlI3NzTGVzcwDgoSo4A/IjZWNlZGVzAKGAIkVTjwmVCXEidWFsAADgryo4A+wkYW50RXF1YWwAoOAiAAFlaaAJqQl2JmVyc2VFbGVtZW50AACgDCLnJWh0VHJpYW5nbGVCousitgkAAAAAuwlhAHIAAODQKTgDcSJ1YWwAAKDtIgABcXXDCeAJdSNhcmVTdQAAAWJwywnVCfMhZXRF4I8iOANxInVhbAAAoOIi5SJyc2V0ReCQIjgDcSJ1YWwAAKDjIoABYmNwAOYJ8AkNCvMhZXRF4IIi0iBxInVhbAAAoIgi4yJlZWRzgKGBIkVTVAD6CQAKBwpxInVhbAAA4LAqOAPsJGFudEVxdWFsAKDhImkibGRlAADgfyI4A+UicnNldEXggyLSIHEidWFsAACgiSJpImxkZQCAoUEiRUZUACIKJwouCnEidWFsAACgRCJ1JGxsRXF1YWwAAKBHImkibGRlAACgSSJlJXJ0aWNhbEJhcgAAoCQiYwByAADgNdip3GkAbABkAGUAO4DRANFAnWMAB0VhY2RmZ21vcHJzdHV2XgphCmgKcgp2CnoKgQqRCpYKqwqtCrsKyArNCuwhaWdSYWMAdQB0AGUAO4DTANNAAAFpeWwKcQpyAGMAO4DUANRAHmRiImxhYwBQYXIAAOA12BLdcgBhAHYAZQA7gNIA0kCAAWFlaQCHCooKjQpjAHIATGFnAGEAqWNjInJvbgCfY3AAZgAA4DXYRt3lI25DdXJseQABRFGeCqYKbyV1YmxlUXVvdGUAAKAcIHUib3RlAACgGCAAoFQqAAFjbLEKtQpyAADgNdiq3GEAcwBoADuA2ADYQGkAbAHACsUKZABlADuA1QDVQGUAcwAAoDcqbQBsADuA1gDWQGUAcgAAAUJQ0wrmCgABYXLXCtoKcgAAoD4gYQBjAAABZWvgCuIKAKDeI2UAdAAAoLQjYSVyZW50aGVzaXMAAKDcI4AEYWNmaGlsb3JzAP0KAwsFCwkLCwsMCxELIwtaC3IjdGlhbEQAAKACInkAH2RyAADgNdgT3WkApmOgY/Ujc01pbnVzsWAAAWlwFQsgC24AYwBhAHIAZQBwAGwAYQBuAOUACgVmAACgGSGAobsqZWlvACoLRQtJC+MiZWRlc4CheiJFU1QANAs5C0ALcSJ1YWwAAKCvKuwkYW50RXF1YWwAoHwiaSJsZGUAAKB+Im0AZQAAoDMgAAFkcE0LUQv1IWN0AKAPIm8jcnRpb24AYaA3ImwAAKAdIgABY2leC2ILcgAA4DXYq9yoYwACVWZvc2oLbwtzC3cLTwBUADuAIgAiQHIAAOA12BTdcABmAACgGiFjAHIAAOA12KzcAAZCRWFjZWZoaW9yc3WPC5MLlwupC7YL2AvbC90LhQyTDJoMowzhIXJyAKAQKUcAO4CuAK5AgAFjbnIAnQugC6ML9SF0ZVRhZwAAoOsncgB0oKAhbAAAoBYpgAFhZXkArwuyC7UL8iFvblhh5CFpbFZhIGR2oBwhZSJyc2UAAAFFVb8LzwsAAWxxwwvIC+UibWVudACgCyL1JGlsaWJyaXVtAKDLIXAmRXF1aWxpYnJpdW0AAKBvKXIAAKAcIW8AoWPnIWh0AARBQ0RGVFVWYewLCgwQDDIMNwxeDHwM9gIAAW5y8Av4C2clbGVCcmFja2V0AACg6SfyIW93AKGSIUJM/wsDDGEAcgAAoOUhZSRmdEFycm93AACgxCFlI2lsaW5nAACgCSNvAPUBFgwAAB4MYiVsZUJyYWNrZXQAAKDnJ24A1AEjDAAAKgxlJGVWZWN0b3IAAKBdKeUiY3RvckKgwiFhAHIAAKBVKWwib29yAACgCyMAAWVyOwxLDGUAAKGiIkFWQQxGDHIicm93AACgpiHlImN0b3IAoFspaSNhbmdsZQBCorMiVgwAAAAAWgxhAHIAAKDQKXEidWFsAACgtSJwAIABRFRWAGUMbAxzDO8kd25WZWN0b3IAoE8pZSRlVmVjdG9yAACgXCnlImN0b3JCoL4hYQByAACgVCnlImN0b3JCoMAhYQByAACgUykAAXB1iQyMDGYAAKAdIe4kZEltcGxpZXMAoHAp6SRnaHRhcnJvdwCg2yEAAWNongyhDHIAAKAbIQCgsSHsJGVEZWxheWVkAKD0KYAGSE9hY2ZoaW1vcXN0dQC/DMgMzAzQDOIM5gwKDQ0NFA0ZDU8NVA1YDQABQ2PDDMYMyCFjeSlkeQAoZEYiVGN5ACxkYyJ1dGUAWmEAorwqYWVpedgM2wzeDOEM8iFvbmBh5CFpbF5hcgBjAFxhIWRyAADgNdgW3e8hcnQAAkRMUlXvDPYM/QwEDW8kd25BcnJvdwAAoJMhZSRmdEFycm93AACgkCHpJGdodEFycm93AKCSIXAjQXJyb3cAAKCRIechbWGjY+EkbGxDaXJjbGUAoBgicABmAADgNdhK3XICHw0AAAAAIg10AACgGiLhIXJlgKGhJUlTVQAqDTINSg3uJXRlcnNlY3Rpb24AoJMidQAAAWJwNw1ADfMhZXRFoI8icSJ1YWwAAKCRIuUicnNldEWgkCJxInVhbAAAoJIibiJpb24AAKCUImMAcgAA4DXYrtxhAHIAAKDGIgACYmNtcF8Nag2ODZANc6DQImUAdABFoNAicSJ1YWwAAKCGIgABY2huDYkNZSJlZHMAgKF7IkVTVAB4DX0NhA1xInVhbAAAoLAq7CRhbnRFcXVhbACgfSJpImxkZQAAoH8iVABoAGEA9ADHCwCgESIAodEiZXOVDZ8NciJzZXQARaCDInEidWFsAACghyJlAHQAAKDRIoAFSFJTYWNmaGlvcnMAtQ27Db8NyA3ODdsN3w3+DRgOHQ4jDk8AUgBOADuA3gDeQMEhREUAoCIhAAFIY8MNxg1jAHkAC2R5ACZkAAFidcwNzQ0JYKRjgAFhZXkA1A3XDdoN8iFvbmRh5CFpbGJhImRyAADgNdgX3QABZWnjDe4N8gHoDQAA7Q3lImZvcmUAoDQiYQCYYwABY27yDfkNayNTcGFjZQAA4F8gCiDTInBhY2UAoAkg7CFkZYChPCJFRlQABw4MDhMOcSJ1YWwAAKBDInUkbGxFcXVhbAAAoEUiaSJsZGUAAKBIInAAZgAA4DXYS93pI3BsZURvdACg2yAAAWN0Jw4rDnIAAOA12K/c8iFva2Zh4QpFDlYOYA5qDgAAbg5yDgAAAAAAAAAAAAB5DnwOqA6zDgAADg8RDxYPGg8AAWNySA5ODnUAdABlADuA2gDaQHIAb6CfIeMhaXIAoEkpcgDjAVsOAABdDnkADmR2AGUAbGEAAWl5Yw5oDnIAYwA7gNsA20AjZGIibGFjAHBhcgAA4DXYGN1yAGEAdgBlADuA2QDZQOEhY3JqYQABZGl/Dp8OZQByAAABQlCFDpcOAAFhcokOiw5yAF9gYQBjAAABZWuRDpMOAKDfI2UAdAAAoLUjYSVyZW50aGVzaXMAAKDdI28AbgBQoMMi7CF1cwCgjiIAAWdwqw6uDm8AbgByYWYAAOA12EzdAARBREVUYWRwc78O0g7ZDuEOBQPqDvMOBw9yInJvdwDCoZEhyA4AAMwOYQByAACgEilvJHduQXJyb3cAAKDFIW8kd25BcnJvdwAAoJUhcSV1aWxpYnJpdW0AAKBuKWUAZQBBoKUiciJyb3cAAKClIW8AdwBuAGEAcgByAG8A9wAQA2UAcgAAAUxS+Q4AD2UkZnRBcnJvdwAAoJYh6SRnaHRBcnJvdwCglyFpAGyg0gNvAG4ApWPpIW5nbmFjAHIAAOA12LDcaSJsZGUAaGFtAGwAO4DcANxAgAREYmNkZWZvc3YALQ8xDzUPNw89D3IPdg97D4AP4SFzaACgqyJhAHIAAKDrKnkAEmThIXNobKCpIgCg5ioAAWVyQQ9DDwCgwSKAAWJ0eQBJD00Paw9hAHIAAKAWIGmgFiDjIWFsAAJCTFNUWA9cD18PZg9hAHIAAKAjIukhbmV8YGUkcGFyYXRvcgAAoFgnaSJsZGUAAKBAItQkaGluU3BhY2UAoAogcgAA4DXYGd1wAGYAAOA12E3dYwByAADgNdix3GQiYXNoAACgqiKAAmNlZm9zAI4PkQ+VD5kPng/pIXJjdGHkIWdlAKDAInIAAOA12BrdcABmAADgNdhO3WMAcgAA4DXYstwAAmZpb3OqD64Prw+0D3IAAOA12BvdnmNwAGYAAOA12E/dYwByAADgNdiz3IAEQUlVYWNmb3N1AMgPyw/OD9EP2A/gD+QP6Q/uD2MAeQAvZGMAeQAHZGMAeQAuZGMAdQB0AGUAO4DdAN1AAAFpedwP3w9yAGMAdmErZHIAAOA12BzdcABmAADgNdhQ3WMAcgAA4DXYtNxtAGwAeGEABEhhY2RlZm9z/g8BEAUQDRAQEB0QIBAkEGMAeQAWZGMidXRlAHlhAAFheQkQDBDyIW9ufWEXZG8AdAB7YfIBFRAAABwQbwBXAGkAZAB0AOgAVAhhAJZjcgAAoCghcABmAACgJCFjAHIAAOA12LXc4QtCEEkQTRAAAGcQbRByEAAAAAAAAAAAeRCKEJcQ8hD9EAAAGxEhETIROREAAD4RYwB1AHQAZQA7gOEA4UByImV2ZQADYYCiPiJFZGl1eQBWEFkQWxBgEGUQAOA+IjMDAKA/InIAYwA7gOIA4kB0AGUAO4C0ALRAMGRsAGkAZwA7gOYA5kByoGEgAOA12B7dcgBhAHYAZQA7gOAA4EAAAWVwfBCGEAABZnCAEIQQ8yF5bQCgNSHoAIMQaABhALFjAAFhcI0QWwAAAWNskRCTEHIAAWFnAACgPypkApwQAAAAALEQAKInImFkc3ajEKcQqRCuEG4AZAAAoFUqAKBcKmwib3BlAACgWCoAoFoqAKMgImVsbXJzersQvRDAEN0Q5RDtEACgpCllAACgICJzAGQAYaAhImEEzhDQENIQ1BDWENgQ2hDcEACgqCkAoKkpAKCqKQCgqykAoKwpAKCtKQCgrikAoK8pdAB2oB8iYgBkoL4iAKCdKQABcHTpEOwQaAAAoCIixWDhIXJyAKB8IwABZ3D1EPgQbwBuAAVhZgAA4DXYUt0Ao0giRWFlaW9wBxEJEQ0RDxESERQRAKBwKuMhaXIAoG8qAKBKImQAAKBLInMAJ2DyIW94ZaBIIvEADhFpAG4AZwA7gOUA5UCAAWN0eQAmESoRKxFyAADgNdi23CpgbQBwAGWgSCLxAPgBaQBsAGQAZQA7gOMA40BtAGwAO4DkAORAAAFjaUERRxFvAG4AaQBuAPQA6AFuAHQAAKARKgAITmFiY2RlZmlrbG5vcHJzdWQRaBGXEZ8RpxGrEdIR1hErEjASexKKEn0RThNbE3oTbwB0AACg7SoAAWNybBGJEWsAAAJjZXBzdBF4EX0RghHvIW5nAKBMInAjc2lsb24A9mNyImltZQAAoDUgaQBtAGWgPSJxAACgzSJ2AY0RkRFlAGUAAKC9ImUAZABnoAUjZQAAoAUjcgBrAHSgtSPiIXJrAKC2IwABb3mjEaYRbgDnAHcRMWTxIXVvAKAeIIACY21wcnQAtBG5Eb4RwRHFEeEhdXPloDUi5ABwInR5dgAAoLApcwDpAH0RbgBvAPUA6gCAAWFodwDLEcwRzhGyYwCgNiHlIWVuAKBsInIAAOA12B/dZwCAA2Nvc3R1dncA4xHyEQUSEhIhEiYSKRKAAWFpdQDpEesR7xHwAKMFcgBjAACg7yVwAACgwyKAAWRwdAD4EfwRABJvAHQAAKAAKuwhdXMAoAEqaSJtZXMAAKACKnECCxIAAAAADxLjIXVwAKAGKmEAcgAAoAUm8iNpYW5nbGUAAWR1GhIeEu8hd24AoL0lcAAAoLMlcCJsdXMAAKAEKmUA5QBCD+UAkg9hInJvdwAAoA0pgAFha28ANhJoEncSAAFjbjoSZRJrAIABbHN0AEESRxJNEm8jemVuZ2UAAKDrKXEAdQBhAHIA5QBcBPIjaWFuZ2xlgKG0JWRscgBYElwSYBLvIXduAKC+JeUhZnQAoMIlaSJnaHQAAKC4JWsAAKAjJLEBbRIAAHUSsgFxEgAAcxIAoJIlAKCRJTQAAKCTJWMAawAAoIglAAFlb38ShxJx4D0A5SD1IWl2AOBhIuUgdAAAoBAjAAJwdHd4kRKVEpsSnxJmAADgNdhT3XSgpSJvAG0AAKClIvQhaWUAoMgiAAZESFVWYmRobXB0dXayEsES0RLgEvcS+xIKExoTHxMjEygTNxMAAkxSbHK5ErsSvRK/EgCgVyUAoFQlAKBWJQCgUyUAolAlRFVkdckSyxLNEs8SAKBmJQCgaSUAoGQlAKBnJQACTFJsctgS2hLcEt4SAKBdJQCgWiUAoFwlAKBZJQCjUSVITFJobHLrEu0S7xLxEvMS9RIAoGwlAKBjJQCgYCUAoGslAKBiJQCgXyVvAHgAAKDJKQACTFJscgITBBMGEwgTAKBVJQCgUiUAoBAlAKAMJQCiACVEVWR1EhMUExYTGBMAoGUlAKBoJQCgLCUAoDQlaSJudXMAAKCfIuwhdXMAoJ4iaSJtZXMAAKCgIgACTFJsci8TMRMzEzUTAKBbJQCgWCUAoBglAKAUJQCjAiVITFJobHJCE0QTRhNIE0oTTBMAoGolAKBhJQCgXiUAoDwlAKAkJQCgHCUAAWV2UhNVE3YA5QD5AGIAYQByADuApgCmQAACY2Vpb2ITZhNqE24TcgAA4DXYt9xtAGkAAKBPIG0A5aA9IogRbAAAoVwAYmh0E3YTAKDFKfMhdWIAoMgnbAF+E4QTbABloCIgdAAAoCIgcAAAoU4iRWWJE4sTAKCuKvGgTyI8BeEMqRMAAN8TABQDFB8UAAAjFDQUAAAAAIUUAAAAAI0UAAAAANcU4xT3FPsUAACIFQAAlhWAAWNwcgCuE7ET1RP1IXRlB2GAoikiYWJjZHMAuxO/E8QTzhPSE24AZAAAoEQqciJjdXAAAKBJKgABYXXIE8sTcAAAoEsqcAAAoEcqbwB0AACgQCoA4CkiAP4AAWVv2RPcE3QAAKBBIO4ABAUAAmFlaXXlE+8T9RP4E/AB6hMAAO0TcwAAoE0qbwBuAA1hZABpAGwAO4DnAOdAcgBjAAlhcABzAHOgTCptAACgUCpvAHQAC2GAAWRtbgAIFA0UEhRpAGwAO4C4ALhAcCJ0eXYAAKCyKXQAAIGiADtlGBQZFKJAcgBkAG8A9ABiAXIAAOA12CDdgAFjZWkAKBQqFDIUeQBHZGMAawBtoBMn4SFyawCgEyfHY3IAAKPLJUVjZWZtcz8UQRRHFHcUfBSAFACgwykAocYCZWxGFEkUcQAAoFciZQBhAlAUAAAAAGAUciJyb3cAAAFsclYUWhTlIWZ0AKC6IWkiZ2h0AACguyGAAlJTYWNkAGgUaRRrFG8UcxSuYACgyCRzAHQAAKCbIukhcmMAoJoi4SFzaACgnSJuImludAAAoBAqaQBkAACg7yrjIWlyAKDCKfUhYnN1oGMmaQB0AACgYybsApMUmhS2FAAAwxRvAG4AZaA6APGgVCKrAG0CnxQAAAAAoxRhAHSgLABAYAChASJmbKcUqRTuABMNZQAAAW14rhSyFOUhbnQAoAEiZQDzANIB5wG6FAAAwBRkoEUibwB0AACgbSpuAPQAzAGAAWZyeQDIFMsUzhQA4DXYVN1vAOQA1wEAgakAO3MeAdMUcgAAoBchAAFhb9oU3hRyAHIAAKC1IXMAcwAAoBcnAAFjdeYU6hRyAADgNdi43AABYnDuFPIUZaDPKgCg0SploNAqAKDSKuQhb3QAoO8igANkZWxwcnZ3AAYVEBUbFSEVRBVlFYQV4SFycgABbHIMFQ4VAKA4KQCgNSlwAhYVAAAAABkVcgAAoN4iYwAAoN8i4SFycnCgtiEAoD0pgKIqImJjZG9zACsVMBU6FT4VQRVyImNhcAAAoEgqAAFhdTQVNxVwAACgRipwAACgSipvAHQAAKCNInIAAKBFKgDgKiIA/gACYWxydksVURVuFXMVcgByAG2gtyEAoDwpeQCAAWV2dwBYFWUVaRVxAHACXxUAAAAAYxVyAGUA4wAXFXUA4wAZFWUAZQAAoM4iZSJkZ2UAAKDPImUAbgA7gKQApEBlI2Fycm93AAABbHJ7FX8V5SFmdACgtiFpImdodAAAoLchZQDkAG0VAAFjaYsVkRVvAG4AaQBuAPQAkwFuAHQAAKAxImwiY3R5AACgLSOACUFIYWJjZGVmaGlqbG9yc3R1d3oAuBW7Fb8V1RXgFegV+RUKFhUWHxZUFlcWZRbFFtsW7xb7FgUXChdyAPIAtAJhAHIAAKBlKQACZ2xyc8YVyhXOFdAV5yFlcgCgICDlIXRoAKA4IfIA9QxoAHagECAAoKMiawHZFd4VYSJyb3cAAKAPKWEA4wBfAgABYXnkFecV8iFvbg9hNGQAoUYhYW/tFfQVAAFnciEC8RVyAACgyiF0InNlcQAAoHcqgAFnbG0A/xUCFgUWO4CwALBAdABhALRjcCJ0eXYAAKCxKQABaXIOFhIW8yFodACgfykA4DXYId1hAHIAAAFschsWHRYAoMMhAKDCIYACYWVnc3YAKBauAjYWOhY+Fm0AAKHEIm9zLhY0Fm4AZABzoMQi9SFpdACgZiZhIm1tYQDdY2kAbgAAoPIiAKH3AGlvQxZRFmQAZQAAgfcAO29KFksW90BuI3RpbWVzAACgxyJuAPgAUBZjAHkAUmRjAG8CXhYAAAAAYhZyAG4AAKAeI28AcAAAoA0jgAJscHR1dwBuFnEWdRaSFp4W7CFhciRgZgAA4DXYVd0AotkCZW1wc30WhBaJFo0WcQBkoFAibwB0AACgUSJpIm51cwAAoDgi7CF1cwCgFCLxInVhcmUAoKEiYgBsAGUAYgBhAHIAdwBlAGQAZwDlANcAbgCAAWFkaAClFqoWtBZyAHIAbwD3APUMbwB3AG4AYQByAHIAbwB3APMA8xVhI3Jwb29uAAABbHK8FsAWZQBmAPQAHBZpAGcAaAD0AB4WYgHJFs8WawBhAHIAbwD3AJILbwLUFgAAAADYFnIAbgAAoB8jbwBwAACgDCOAAWNvdADhFukW7BYAAXJ55RboFgDgNdi53FVkbAAAoPYp8iFvaxFhAAFkcvMW9xZvAHQAAKDxImkA5qC/JVsSAAFhaP8WAhdyAPIANQNhAPIA1wvhIm5nbGUAoKYpAAFjaQ4XEBd5AF9k5yJyYXJyAKD/JwAJRGFjZGVmZ2xtbm9wcXJzdHV4MRc4F0YXWxcyBF4XaRd5F40XrBe0F78X2RcVGCEYLRg1GEAYAAFEbzUXgRZvAPQA+BUAAWNzPBdCF3UAdABlADuA6QDpQPQhZXIAoG4qAAJhaW95TRdQF1YXWhfyIW9uG2FyAGOgViI7gOoA6kDsIW9uAKBVIk1kbwB0ABdhAAFEcmIXZhdvAHQAAKBSIgDgNdgi3XKhmipuF3QXYQB2AGUAO4DoAOhAZKCWKm8AdAAAoJgqgKGZKmlscwCAF4UXhxfuInRlcnMAoOcjAKATIWSglSpvAHQAAKCXKoABYXBzAJMXlheiF2MAcgATYXQAeQBzogUinxcAAAAAoRdlAHQAAKAFInAAMaADIDMBqRerFwCgBCAAoAUgAAFnc7AXsRdLYXAAAKACIAABZ3C4F7sXbwBuABlhZgAA4DXYVt2AAWFscwDFF8sXzxdyAHOg1SJsAACg4yl1AHMAAKBxKmkAAKG1A2x21RfYF28AbgC1Y/VjAAJjc3V24BfoF/0XEBgAAWlv5BdWF3IAYwAAoFYiaQLuFwAAAADwF+0ADQThIW50AAFnbPUX+Rd0AHIAAKCWKuUhc3MAoJUqgAFhZWkAAxgGGAoYbABzAD1gcwB0AACgXyJ2AESgYSJEAACgeCrwImFyc2wAoOUpAAFEYRkYHRhvAHQAAKBTInIAcgAAoHEpgAFjZGkAJxgqGO0XcgAAoC8hbwD0AIwCAAFhaDEYMhi3YzuA8ADwQAABbXI5GD0YbAA7gOsA60BvAACgrCCAAWNpcABGGEgYSxhsACFgcwD0ACwEAAFlb08YVxhjAHQAYQB0AGkAbwDuABoEbgBlAG4AdABpAGEAbADlADME4Ql1GAAAgRgAAIMYiBgAAAAAoRilGAAAqhgAALsYvhjRGAAA1xgnGWwAbABpAG4AZwBkAG8AdABzAGUA8QBlF3kARGRtImFsZQAAoEAmgAFpbHIAjRiRGJ0Y7CFpZwCgA/tpApcYAAAAAJoYZwAAoAD7aQBnAACgBPsA4DXYI93sIWlnAKAB++whaWcA4GYAagCAAWFsdACvGLIYthh0AACgbSZpAGcAAKAC+24AcwAAoLElbwBmAJJh8AHCGAAAxhhmAADgNdhX3QABYWvJGMwYbADsAGsEdqDUIgCg2SphI3J0aW50AACgDSoAAWFv2hgiGQABY3PeGB8ZsQPnGP0YBRkSGRUZAAAdGbID7xjyGPQY9xj5GAAA+xg7gL0AvUAAoFMhO4C8ALxAAKBVIQCgWSEAoFshswEBGQAAAxkAoFQhAKBWIbQCCxkOGQAAAAAQGTuAvgC+QACgVyEAoFwhNQAAoFghtgEZGQAAGxkAoFohAKBdITgAAKBeIWwAAKBEIHcAbgAAoCIjYwByAADgNdi73IAIRWFiY2RlZmdpamxub3JzdHYARhlKGVoZXhlmGWkZkhmWGZkZnRmgGa0ZxhnLGc8Z4BkjGmygZyIAoIwqgAFjbXAAUBlTGVgZ9SF0ZfVhbQBhAOSgswM6FgCghipyImV2ZQAfYQABaXliGWUZcgBjAB1hM2RvAHQAIWGAoWUibHFzAMYEcBl6GfGhZSLOBAAAdhlsAGEAbgD0AN8EgKF+KmNkbACBGYQZjBljAACgqSpvAHQAb6CAKmyggioAoIQqZeDbIgD+cwAAoJQqcgAA4DXYJN3noGsirATtIWVsAKA3IWMAeQBTZIChdyJFYWoApxmpGasZAKCSKgCgpSoAoKQqAAJFYWVztBm2Gb0ZwhkAoGkicABwoIoq8iFveACgiipxoIgq8aCIKrUZaQBtAACg5yJwAGYAAOA12FjdYQB2AOUAYwIAAWNp0xnWGXIAAKAKIW0AAKFzImVs3BneGQCgjioAoJAqAIM+ADtjZGxxco0E6xn0GfgZ/BkBGgABY2nvGfEZAKCnKnIAAKB6Km8AdAAAoNci0CFhcgCglSl1ImVzdAAAoHwqgAJhZGVscwAKGvQZFhrVBCAa8AEPGgAAFBpwAHIAbwD4AFkZcgAAoHgpcQAAAWxxxAQbGmwAZQBzAPMASRlpAO0A5AQAAWVuJxouGnIjdG5lcXEAAOBpIgD+xQAsGgAFQWFiY2Vma29zeUAaQxpmGmoabRqDGocalhrCGtMacgDyAMwCAAJpbG1yShpOGlAaVBpyAHMA8ABxD2YAvWBpAGwA9AASBQABZHJYGlsaYwB5AEpkAKGUIWN3YBpkGmkAcgAAoEgpAKCtIWEAcgAAoA8h6SFyYyVhgAFhbHIAcxp7Gn8a8iF0c3WgZSZpAHQAAKBlJuwhaXAAoCYg4yFvbgCguSJyAADgNdgl3XMAAAFld4wakRphInJvdwAAoCUpYSJyb3cAAKAmKYACYW1vcHIAnxqjGqcauhq+GnIAcgAAoP8h9CFodACgOyJrAAABbHKsGrMaZSRmdGFycm93AACgqSHpJGdodGFycm93AKCqIWYAAOA12Fnd4iFhcgCgFSCAAWNsdADIGswa0BpyAADgNdi93GEAcwDoAGka8iFvaydhAAFicNca2xr1IWxsAKBDIOghZW4AoBAg4Qr2GgAA/RoAAAgbExsaGwAAIRs7GwAAAAA+G2IbmRuVG6sbAACyG80b0htjAHUAdABlADuA7QDtQAChYyBpeQEbBhtyAGMAO4DuAO5AOGQAAWN4CxsNG3kANWRjAGwAO4ChAKFAAAFmcssCFhsA4DXYJt1yAGEAdgBlADuA7ADsQIChSCFpbm8AJxsyGzYbAAFpbisbLxtuAHQAAKAMKnQAAKAtIuYhaW4AoNwpdABhAACgKSHsIWlnM2GAAWFvcABDG1sbXhuAAWNndABJG0sbWRtyACthgAFlbHAAcQVRG1UbaQBuAOUAyAVhAHIA9AByBWgAMWFmAACgtyJlAGQAtWEAoggiY2ZvdGkbbRt1G3kb4SFyZQCgBSFpAG4AdKAeImkAZQAAoN0pZABvAPQAWxsAoisiY2VscIEbhRuPG5QbYQBsAACguiIAAWdyiRuNG2UAcgDzACMQ4wCCG2EicmhrAACgFyryIW9kAKA8KgACY2dwdJ8boRukG6gbeQBRZG8AbgAvYWYAAOA12FrdYQC5Y3UAZQBzAHQAO4C/AL9AAAFjabUbuRtyAADgNdi+3G4AAKIIIkVkc3bCG8QbyBvQAwCg+SJvAHQAAKD1Inag9CIAoPMiaaBiIOwhZGUpYesB1hsAANkbYwB5AFZkbAA7gO8A70AAA2NmbW9zdeYb7hvyG/Ub+hsFHAABaXnqG+0bcgBjADVhOWRyAADgNdgn3eEhdGg3YnAAZgAA4DXYW93jAf8bAAADHHIAAOA12L/c8iFjeVhk6yFjeVRkAARhY2ZnaGpvcxUcGhwiHCYcKhwtHDAcNRzwIXBhdqC6A/BjAAFleR4cIRzkIWlsN2E6ZHIAAOA12CjdciJlZW4AOGFjAHkARWRjAHkAXGRwAGYAAOA12FzdYwByAADgNdjA3IALQUJFSGFiY2RlZmdoamxtbm9wcnN0dXYAXhxtHHEcdRx5HN8cBx0dHTwd3B3tHfEdAR4EHh0eLB5FHrwewx7hHgkfPR9LH4ABYXJ0AGQcZxxpHHIA8gBvB/IAxQLhIWlsAKAbKeEhcnIAoA4pZ6BmIgCgiyphAHIAAKBiKWMJjRwAAJAcAACVHAAAAAAAAAAAAACZHJwcAACmHKgcrRwAANIc9SF0ZTph7SJwdHl2AKC0KXIAYQDuAFoG4iFkYbtjZwAAoegnZGyhHKMcAKCRKeUAiwYAoIUqdQBvADuAqwCrQHIAgKOQIWJmaGxwc3QAuhy/HMIcxBzHHMoczhxmoOQhcwAAoB8pcwAAoB0p6wCyGnAAAKCrIWwAAKA5KWkAbQAAoHMpbAAAoKIhAKGrKmFl1hzaHGkAbAAAoBkpc6CtKgDgrSoA/oABYWJyAOUc6RztHHIAcgAAoAwpcgBrAACgcicAAWFr8Rz4HGMAAAFla/Yc9xx7YFtgAAFlc/wc/hwAoIspbAAAAWR1Ax0FHQCgjykAoI0pAAJhZXV5Dh0RHRodHB3yIW9uPmEAAWRpFR0YHWkAbAA8YewAowbiAPccO2QAAmNxcnMkHScdLB05HWEAAKA2KXUAbwDyoBwgqhEAAWR1MB00HeghYXIAoGcpcyJoYXIAAKBLKWgAAKCyIQCiZCJmZ3FzRB1FB5Qdnh10AIACYWhscnQATh1WHWUdbB2NHXIicm93AHSgkCFhAOkAzxxhI3Jwb29uAAABZHVeHWId7yF3bgCgvSFwAACgvCHlJGZ0YXJyb3dzAKDHIWkiZ2h0AIABYWhzAHUdex2DHXIicm93APOglCGdBmEAcgBwAG8AbwBuAPMAzgtxAHUAaQBnAGEAcgByAG8A9wBlGugkcmVldGltZXMAoMsi8aFkIk0HAACaHWwAYQBuAPQAXgcAon0qY2Rnc6YdqR2xHbcdYwAAoKgqbwB0AG+gfypyoIEqAKCDKmXg2iIA/nMAAKCTKoACYWRlZ3MAwB3GHcod1h3ZHXAAcAByAG8A+ACmHG8AdAAAoNYicQAAAWdxzx3SHXQA8gBGB2cAdADyAHQcdADyAFMHaQDtAGMHgAFpbHIA4h3mHeod8yFodACgfClvAG8A8gDKBgDgNdgp3UWgdiIAoJEqYQH1Hf4dcgAAAWR1YB35HWygvCEAoGopbABrAACghCVjAHkAWWQAomoiYWNodAweDx4VHhkecgDyAGsdbwByAG4AZQDyAGAW4SFyZACgaylyAGkAAKD6JQABaW8hHiQe5CFvdEBh9SFzdGGgsCPjIWhlAKCwIwACRWFlczMeNR48HkEeAKBoInAAcKCJKvIhb3gAoIkqcaCHKvGghyo0HmkAbQAAoOYiAARhYm5vcHR3elIeXB5fHoUelh6mHqsetB4AAW5yVh5ZHmcAAKDsJ3IAAKD9IXIA6wCwBmcAgAFsbXIAZh52Hnse5SFmdAABYXKIB2weaQBnAGgAdABhAHIAcgBvAPcAkwfhInBzdG8AoPwnaQBnAGgAdABhAHIAcgBvAPcAmgdwI2Fycm93AAABbHKNHpEeZQBmAPQAxhxpImdodAAAoKwhgAFhZmwAnB6fHqIecgAAoIUpAOA12F3ddQBzAACgLSppIm1lcwAAoDQqYQGvHrMecwB0AACgFyLhAIoOZaHKJbkeRhLuIWdlAKDKJWEAcgBsoCgAdAAAoJMpgAJhY2htdADMHs8e1R7bHt0ecgDyAJ0GbwByAG4AZQDyANYWYQByAGSgyyEAoG0pAKAOIHIAaQAAoL8iAANhY2hpcXTrHu8e1QfzHv0eBh/xIXVvAKA5IHIAAOA12MHcbQDloXIi+h4AAPweAKCNKgCgjyoAAWJ19xwBH28AcqAYIACgGiDyIW9rQmEAhDwAO2NkaGlscXJCBhcfxh0gHyQfKB8sHzEfAAFjaRsfHR8AoKYqcgAAoHkqcgBlAOUAkx3tIWVzAKDJIuEhcnIAoHYpdSJlc3QAAKB7KgABUGk1HzkfYQByAACglillocMlAgdfEnIAAAFkdUIfRx9zImhhcgAAoEop6CFhcgCgZikAAWVuTx9WH3IjdG5lcXEAAOBoIgD+xQBUHwAHRGFjZGVmaGlsbm9wc3VuH3Ifoh+rH68ftx+7H74f5h/uH/MfBwj/HwsgxCFvdACgOiIAAmNscHJ5H30fiR+eH3IAO4CvAK9AAAFldIEfgx8AoEImZaAgJ3MAZQAAoCAnc6CmIXQAbwCAoaYhZGx1AJQfmB+cH28AdwDuAHkDZQBmAPQA6gbwAOkO6yFlcgCgriUAAW95ph+qH+0hbWEAoCkqPGThIXNoAKAUIOElc3VyZWRhbmdsZQCgISJyAADgNdgq3W8AAKAnIYABY2RuAMQfyR/bH3IAbwA7gLUAtUBhoiMi0B8AANMf1x9zAPQAKxFpAHIAAKDwKm8AdAA7gLcAt0B1AHMA4qESIh4TAADjH3WgOCIAoCoqYwHqH+0fcAAAoNsq8gB+GnAAbAB1APMACAgAAWRw9x/7H+UhbHMAoKciZgAA4DXYXt0AAWN0AyAHIHIAAOA12MLc8CFvcwCgPiJsobwDECAVIPQiaW1hcACguCJhAPAAEyAADEdMUlZhYmNkZWZnaGlqbG1vcHJzdHV2dzwgRyBmIG0geSCqILgg2iDeIBEhFSEyIUMhTSFQIZwhnyHSIQAiIyKLIrEivyIUIwABZ3RAIEMgAODZIjgD9uBrItIgBwmAAWVsdABNIF8gYiBmAHQAAAFhclMgWCByInJvdwAAoM0h6SRnaHRhcnJvdwCgziEA4NgiOAP24Goi0iBfCekkZ2h0YXJyb3cAoM8hAAFEZHEgdSDhIXNoAKCvIuEhc2gAoK4igAJiY25wdACCIIYgiSCNIKIgbABhAACgByL1IXRlRGFnAADgICLSIACiSSJFaW9wlSCYIJwgniAA4HAqOANkAADgSyI4A3MASWFyAG8A+AAyCnUAcgBhoG4mbADzoG4mmwjzAa8gAACzIHAAO4CgAKBAbQBwAOXgTiI4AyoJgAJhZW91eQDBIMogzSDWINkg8AHGIAAAyCAAoEMqbwBuAEhh5CFpbEZhbgBnAGSgRyJvAHQAAOBtKjgDcAAAoEIqPWThIXNoAKATIACjYCJBYWRxc3jpIO0g+SD+IAIhDCFyAHIAAKDXIXIAAAFocvIg9SBrAACgJClvoJch9wAGD28AdAAA4FAiOAN1AGkA9gC7CAABZWkGIQohYQByAACgKCntAN8I6SFzdPOgBCLlCHIAAOA12CvdAAJFZXN0/wgcISshLiHxoXEiIiEAABMJ8aFxIgAJAAAnIWwAYQBuAPQAEwlpAO0AGQlyoG8iAKBvIoABQWFwADghOyE/IXIA8gBeIHIAcgAAoK4hYQByAACg8ipzogsiSiEAAAAAxwtkoPwiAKD6ImMAeQBaZIADQUVhZGVzdABcIV8hYiFmIWkhkyGWIXIA8gBXIADgZiI4A3IAcgAAoJohcgAAoCUggKFwImZxcwBwIYQhjiF0AAABYXJ1IXohcgByAG8A9wBlIWkAZwBoAHQAYQByAHIAbwD3AD4h8aFwImAhAACKIWwAYQBuAPQAZwlz4H0qOAMAoG4iaQDtAG0JcqBuImkA5aDqIkUJaQDkADoKAAFwdKMhpyFmAADgNdhf3YCBrAA7aW4AriGvIcchrEBuAIChCSJFZHYAtyG6Ib8hAOD5IjgDbwB0AADg9SI4A+EB1gjEIcYhAKD3IgCg9iJpAHagDCLhAagJzyHRIQCg/iIAoP0igAFhb3IA2CHsIfEhcgCAoSYiYXN0AOAh5SHpIWwAbABlAOwAywhsAADg/SrlIADgAiI4A2wiaW50AACgFCrjoYAi9yEAAPohdQDlAJsJY+CvKjgDZaCAIvEAkwkAAkFhaXQHIgoiFyIeInIA8gBsIHIAcgAAoZshY3cRIhQiAOAzKTgDAOCdITgDZyRodGFycm93AACgmyFyAGkA5aDrIr4JgANjaGltcHF1AC8iPCJHIpwhTSJQIloigKGBImNlcgA2Iv0JOSJ1AOUABgoA4DXYw9zvIXJ0bQKdIQAAAABEImEAcgDhAOEhbQBloEEi8aBEIiYKYQDyAMsIcwB1AAABYnBWIlgi5QDUCeUA3wmAAWJjcABgInMieCKAoYQiRWVzAGci7glqIgDgxSo4A2UAdABl4IIi0iBxAPGgiCJoImMAZaCBIvEA/gmAoYUiRWVzAH8iFgqCIgDgxio4A2UAdABl4IMi0iBxAPGgiSKAIgACZ2lscpIilCKaIpwi7AAMCWwAZABlADuA8QDxQOcAWwlpI2FuZ2xlAAABbHKkIqoi5SFmdGWg6iLxAEUJaSJnaHQAZaDrIvEAvgltoL0DAKEjAGVzuCK8InIAbwAAoBYhcAAAoAcggARESGFkZ2lscnMAziLSItYi2iLeIugi7SICIw8j4SFzaACgrSLhIXJyAKAEKXAAAOBNItIg4SFzaACgrCIAAWV04iLlIgDgZSLSIADgPgDSIG4iZmluAACg3imAAUFldADzIvci+iJyAHIAAKACKQDgZCLSIHLgPADSIGkAZQAA4LQi0iAAAUF0BiMKI3IAcgAAoAMp8iFpZQDgtSLSIGkAbQAA4Dwi0iCAAUFhbgAaIx4jKiNyAHIAAKDWIXIAAAFociMjJiNrAACgIylvoJYh9wD/DuUhYXIAoCcpUxJqFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVCMAAF4jaSN/I4IjjSOeI8AUAAAAAKYjwCMAANoj3yMAAO8jHiQvJD8kRCQAAWNzVyNsFHUAdABlADuA8wDzQAABaXlhI2cjcgBjoJoiO4D0APRAPmSAAmFiaW9zAHEjdCN3I3EBeiNzAOgAdhTsIWFjUWF2AACgOCrvIWxkAKC8KewhaWdTYQABY3KFI4kjaQByAACgvykA4DXYLN1vA5QjAAAAAJYjAACcI24A22JhAHYAZQA7gPIA8kAAoMEpAAFibaEjjAphAHIAAKC1KQACYWNpdKwjryO6I70jcgDyAFkUAAFpcrMjtiNyAACgvinvIXNzAKC7KW4A5QDZCgCgwCmAAWFlaQDFI8gjyyNjAHIATWFnAGEAyWOAAWNkbgDRI9Qj1iPyIW9uv2MAoLYpdQDzAHgBcABmAADgNdhg3YABYWVsAOQj5yPrI3IAAKC3KXIAcAAAoLkpdQDzAHwBAKMoImFkaW9zdvkj/CMPJBMkFiQbJHIA8gBeFIChXSplZm0AAyQJJAwkcgBvoDQhZgAAoDQhO4CqAKpAO4C6ALpA5yFvZgCgtiJyAACgVipsIm9wZQAAoFcqAKBbKoABY2xvACMkJSQrJPIACCRhAHMAaAA7gPgA+EBsAACgmCJpAGwBMyQ4JGQAZQA7gPUA9UBlAHMAYaCXInMAAKA2Km0AbAA7gPYA9kDiIWFyAKA9I+EKXiQAAHokAAB8JJQkAACYJKkkAAAAALUkEQsAAPAkAAAAAAQleiUAAIMlcgCAoSUiYXN0AGUkbyQBCwCBtgA7bGokayS2QGwAZQDsABgDaQJ1JAAAAAB4JG0AAKDzKgCg/Sp5AD9kcgCAAmNpbXB0AIUkiCSLJJkSjyRuAHQAJWBvAGQALmBpAGwAAKAwIOUhbmsAoDEgcgAA4DXYLd2AAWltbwCdJKAkpCR2oMYD1WNtAGEA9AD+B24AZQAAoA4m9KHAA64kAAC0JGMjaGZvcmsAAKDUItZjAAFhdbgkxCRuAAABY2u9JMIkawBooA8hAKAOIfYAaRpzAACkKwBhYmNkZW1zdNMkIRPXJNsk4STjJOck6yTjIWlyAKAjKmkAcgAAoCIqAAFvdYsW3yQAoCUqAKByKm4AO4CxALFAaQBtAACgJip3AG8AAKAnKoABaXB1APUk+iT+JO4idGludACgFSpmAADgNdhh3W4AZAA7gKMAo0CApHoiRWFjZWlub3N1ABMlFSUYJRslTCVRJVklSSV1JQCgsypwAACgtyp1AOUAPwtjoK8qgKJ6ImFjZW5zACclLSU0JTYlSSVwAHAAcgBvAPgAFyV1AHIAbAB5AGUA8QA/C/EAOAuAAWFlcwA8JUElRSXwInByb3gAoLkqcQBxAACgtSppAG0AAKDoImkA7QBEC20AZQDzoDIgIguAAUVhcwBDJVclRSXwAEAlgAFkZnAATwtfJXElgAFhbHMAZSVpJW0l7CFhcgCgLiPpIW5lAKASI/UhcmYAoBMjdKAdIu8AWQvyIWVsAKCwIgABY2l9JYElcgAA4DXYxdzIY24iY3NwAACgCCAAA2Zpb3BzdZElKxuVJZolnyWkJXIAAOA12C7dcABmAADgNdhi3XIiaW1lAACgVyBjAHIAAOA12MbcgAFhZW8AqiW6JcAldAAAAWVpryW2JXIAbgBpAG8AbgDzABkFbgB0AACgFipzAHQAZaA/APEACRj0AG0LgApBQkhhYmNkZWZoaWxtbm9wcnN0dXgA4yXyJfYl+iVpJpAmpia9JtUm5ib4JlonaCdxJ3UnnietJ7EnyCfiJ+cngAFhcnQA6SXsJe4lcgDyAJkM8gD6AuEhaWwAoBwpYQByAPIA3BVhAHIAAKBkKYADY2RlbnFydAAGJhAmEyYYJiYmKyZaJgABZXUKJg0mAOA9IjEDdABlAFVhaQDjACAN7SJwdHl2AKCzKWcAgKHpJ2RlbAAgJiImJCYAoJIpAKClKeUA9wt1AG8AO4C7ALtAcgAApZIhYWJjZmhscHN0dz0mQCZFJkcmSiZMJk4mUSZVJlgmcAAAoHUpZqDlIXMAAKAgKQCgMylzAACgHinrALka8ACVHmwAAKBFKWkAbQAAoHQpbAAAoKMhAKCdIQABYWleJmImaQBsAACgGilvAG6gNiJhAGwA8wB2C4ABYWJyAG8mciZ2JnIA8gAvEnIAawAAoHMnAAFha3omgSZjAAABZWt/JoAmfWBdYAABZXOFJocmAKCMKWwAAAFkdYwmjiYAoI4pAKCQKQACYWV1eZcmmiajJqUm8iFvbllhAAFkaZ4moSZpAGwAV2HsAA8M4gCAJkBkAAJjbHFzrSawJrUmuiZhAACgNylkImhhcgAAoGkpdQBvAPKgHSCjAWgAAKCzIYABYWNnAMMm0iaUC2wAgKEcIWlwcwDLJs4migxuAOUAoAxhAHIA9ADaC3QAAKCtJYABaWxyANsm3ybjJvMhaHQAoH0pbwBvAPIANgwA4DXYL90AAWFv6ib1JnIAAAFkde8m8SYAoMEhbKDAIQCgbCl2oMED8WOAAWducwD+Jk4nUCdoAHQAAANhaGxyc3QKJxInISc1Jz0nRydyInJvdwB0oJIhYQDpAFYmYSNycG9vbgAAAWR1GiceJ28AdwDuAPAmcAAAoMAh5SFmdAABYWgnJy0ncgByAG8AdwDzAAkMYQByAHAAbwBvAG4A8wATBGklZ2h0YXJyb3dzAACgySFxAHUAaQBnAGEAcgByAG8A9wBZJugkcmVldGltZXMAoMwiZwDaYmkAbgBnAGQAbwB0AHMAZQDxABwYgAFhaG0AYCdjJ2YncgDyAAkMYQDyABMEAKAPIG8idXN0AGGgsSPjIWhlAKCxI+0haWQAoO4qAAJhYnB0fCeGJ4knmScAAW5ygCeDJ2cAAKDtJ3IAAKD+IXIA6wAcDIABYWZsAI8nkieVJ3IAAKCGKQDgNdhj3XUAcwAAoC4qaSJtZXMAAKA1KgABYXCiJ6gncgBnoCkAdAAAoJQp7yJsaW50AKASKmEAcgDyADwnAAJhY2hxuCe8J6EMwCfxIXVvAKA6IHIAAOA12MfcAAFidYAmxCdvAPKgGSCoAYABaGlyAM4n0ifWJ3IAZQDlAE0n7SFlcwCgyiJpAIChuSVlZmwAXAxjEt4n9CFyaQCgzinsInVoYXIAoGgpAKAeIWENBSgJKA0oSyhVKIYoAACLKLAoAAAAAOMo5ygAABApJCkxKW0pcSmHKaYpAACYKgAAAACxKmMidXRlAFthcQB1AO8ABR+ApHsiRWFjZWlucHN5ABwoHignKCooLygyKEEoRihJKACgtCrwASMoAAAlKACguCpvAG4AYWF1AOUAgw1koLAqaQBsAF9hcgBjAF1hgAFFYXMAOCg6KD0oAKC2KnAAAKC6KmkAbQAAoOki7yJsaW50AKATKmkA7QCIDUFkbwB0AGKixSKRFgAAAABTKACgZiqAA0FhY21zdHgAYChkKG8ocyh1KHkogihyAHIAAKDYIXIAAAFocmkoayjrAJAab6CYIfcAzAd0ADuApwCnQGkAO2D3IWFyAKApKW0AAAFpbn4ozQBuAHUA8wDOAHQAAKA2J3IA7+A12DDdIxkAAmFjb3mRKJUonSisKHIAcAAAoG8mAAFoeZkonChjAHkASWRIZHIAdABtAqUoAAAAAKgoaQDkAFsPYQByAGEA7ABsJDuArQCtQAABZ22zKLsobQBhAAChwwNmdroouijCY4CjPCJkZWdsbnByAMgozCjPKNMo1yjaKN4obwB0AACgairxoEMiCw5FoJ4qAKCgKkWgnSoAoJ8qZQAAoEYi7CF1cwCgJCrhIXJyAKByKWEAcgDyAPwMAAJhZWl07Sj8KAEpCCkAAWxz8Sj4KGwAcwBlAHQAbQDpAH8oaABwAACgMyrwImFyc2wAoOQpAAFkbFoPBSllAACgIyNloKoqc6CsKgDgrCoA/oABZmxwABUpGCkfKfQhY3lMZGKgLwBhoMQpcgAAoD8jZgAA4DXYZN1hAAABZHIoKRcDZQBzAHWgYCZpAHQAAKBgJoABY3N1ADYpRilhKQABYXU6KUApcABzoJMiAOCTIgD+cABzoJQiAOCUIgD+dQAAAWJwSylWKQChjyJlcz4NUCllAHQAZaCPIvEAPw0AoZAiZXNIDVspZQB0AGWgkCLxAEkNAKGhJWFmZilbBHIAZQFrKVwEAKChJWEAcgDyAAMNAAJjZW10dyl7KX8pgilyAADgNdjI3HQAbQDuAM4AaQDsAAYpYQByAOYAVw0AAWFyiimOKXIA5qAGJhESAAFhbpIpoylpImdodAAAAWVwmSmgKXAAcwBpAGwAbwDuANkXaADpAKAkcwCvYIACYmNtbnAArin8KY4NJSooKgCkgiJFZGVtbnByc7wpvinCKcgpzCnUKdgp3CkAoMUqbwB0AACgvSpkoIYibwB0AACgwyr1IWx0AKDBKgABRWXQKdIpAKDLKgCgiiLsIXVzAKC/KuEhcnIAoHkpgAFlaXUA4inxKfQpdAAAoYIiZW7oKewpcQDxoIYivSllAHEA8aCKItEpbQAAoMcqAAFicPgp+ikAoNUqAKDTKmMAgKJ7ImFjZW5zAAcqDSoUKhYqRihwAHAAcgBvAPgAIyh1AHIAbAB5AGUA8QCDDfEAfA2AAWFlcwAcKiIqPShwAHAAcgBvAPgAPChxAPEAOShnAACgaiYApoMiMTIzRWRlaGxtbnBzPCo/KkIqRSpHKlIqWCpjKmcqaypzKncqO4C5ALlAO4CyALJAO4CzALNAAKDGKgABb3NLKk4qdAAAoL4qdQBiAACg2CpkoIcibwB0AACgxCpzAAABb3VdKmAqbAAAoMknYgAAoNcq4SFycgCgeyn1IWx0AKDCKgABRWVvKnEqAKDMKgCgiyLsIXVzAKDAKoABZWl1AH0qjCqPKnQAAKGDImVugyqHKnEA8aCHIkYqZQBxAPGgiyJwKm0AAKDIKgABYnCTKpUqAKDUKgCg1iqAAUFhbgCdKqEqrCpyAHIAAKDZIXIAAAFocqYqqCrrAJUab6CZIfcAxQf3IWFyAKAqKWwAaQBnADuA3wDfQOELzyrZKtwq6SrsKvEqAAD1KjQrAAAAAAAAAAAAAEwrbCsAAHErvSsAAAAAAADRK3IC1CoAAAAA2CrnIWV0AKAWI8RjcgDrAOUKgAFhZXkA4SrkKucq8iFvbmVh5CFpbGNhQmRvAPQAIg5sInJlYwAAoBUjcgAA4DXYMd0AAmVpa2/7KhIrKCsuK/IBACsAAAkrZQAAATRm6g0EK28AcgDlAOsNYQBzorgDECsAAAAAEit5AG0A0WMAAWNuFislK2sAAAFhcxsrIStwAHAAcgBvAPgAFw5pAG0AAKA8InMA8AD9DQABYXMsKyEr8AAXDnIAbgA7gP4A/kDsATgrOyswG2QA5QBnAmUAcwCAgdcAO2JkAEMrRCtJK9dAYaCgInIAAKAxKgCgMCqAAWVwcwBRK1MraSvhAAkh4qKkIlsrXysAAAAAYytvAHQAAKA2I2kAcgAAoPEqb+A12GXdcgBrAACg2irhAHgociJpbWUAAKA0IIABYWlwAHYreSu3K2QA5QC+DYADYWRlbXBzdACFK6MrmiunK6wrsCuzK24iZ2xlAACitSVkbHFykCuUK5ornCvvIXduAKC/JeUhZnRloMMl8QACBwCgXCJpImdodABloLkl8QBdDG8AdAAAoOwlaSJudXMAAKA6KuwhdXMAoDkqYgAAoM0p6SFtZQCgOyrlInppdW0AoOIjgAFjaHQAwivKK80rAAFyecYrySsA4DXYydxGZGMAeQBbZPIhb2tnYQABaW/UK9creAD0ANERaCJlYWQAAAFsct4r5ytlAGYAdABhAHIAcgBvAPcAXQbpJGdodGFycm93AKCgIQAJQUhhYmNkZmdobG1vcHJzdHV3CiwNLBEsHSwnLDEsQCxLLFIsYix6LIQsjyzLLOgs7Sz/LAotcgDyAAkDYQByAACgYykAAWNyFSwbLHUAdABlADuA+gD6QPIACQ1yAOMBIywAACUseQBeZHYAZQBtYQABaXkrLDAscgBjADuA+wD7QENkgAFhYmgANyw6LD0scgDyANEO7CFhY3FhYQDyAOAOAAFpckQsSCzzIWh0AKB+KQDgNdgy3XIAYQB2AGUAO4D5APlAYQFWLF8scgAAAWxyWixcLACgvyEAoL4hbABrAACggCUAAWN0Zix2LG8CbCwAAAAAcyxyAG4AZaAcI3IAAKAcI28AcAAAoA8jcgBpAACg+CUAAWFsfiyBLGMAcgBrYTuAqACoQAABZ3CILIssbwBuAHNhZgAA4DXYZt0AA2FkaGxzdZksniynLLgsuyzFLHIAcgBvAPcACQ1vAHcAbgBhAHIAcgBvAPcA2A5hI3Jwb29uAAABbHKvLLMsZQBmAPQAWyxpAGcAaAD0AF0sdQDzAKYOaQAAocUDaGzBLMIs0mNvAG4AxWPwI2Fycm93cwCgyCGAAWNpdADRLOEs5CxvAtcsAAAAAN4scgBuAGWgHSNyAACgHSNvAHAAAKAOI24AZwBvYXIAaQAAoPklYwByAADgNdjK3IABZGlyAPMs9yz6LG8AdAAAoPAi7CFkZWlhaQBmoLUlAKC0JQABYW0DLQYtcgDyAMosbAA7gPwA/EDhIm5nbGUAoKcpgAdBQkRhY2RlZmxub3Byc3oAJy0qLTAtNC2bLZ0toS2/LcMtxy3TLdgt3C3gLfwtcgDyABADYQByAHag6CoAoOkqYQBzAOgA/gIAAW5yOC08LechcnQAoJwpgANla25wcnN0AJkpSC1NLVQtXi1iLYItYQBwAHAA4QAaHG8AdABoAGkAbgDnAKEXgAFoaXIAoSmzJFotbwBwAPQAdCVooJUh7wD4JgABaXVmLWotZwBtAOEAuygAAWJwbi14LXMjZXRuZXEAceCKIgD+AODLKgD+cyNldG5lcQBx4IsiAP4A4MwqAP4AAWhyhi2KLWUAdADhABIraSNhbmdsZQAAAWxyki2WLeUhZnQAoLIiaSJnaHQAAKCzInkAMmThIXNoAKCiIoABZWxyAKcttC24LWKiKCKuLQAAAACyLWEAcgAAoLsicQAAoFoi7CFpcACg7iIAAWJ0vC1eD2EA8gBfD3IAAOA12DPddAByAOkAlS1zAHUAAAFicM0t0C0A4IIi0iAA4IMi0iBwAGYAAOA12GfdcgBvAPAAWQt0AHIA6QCaLQABY3XkLegtcgAA4DXYy9wAAWJw7C30LW4AAAFFZXUt8S0A4IoiAP5uAAABRWV/LfktAOCLIgD+6SJnemFnAKCaKYADY2Vmb3BycwANLhAuJS4pLiMuLi40LukhcmN1YQABZGkULiEuAAFiZxguHC5hAHIAAKBfKmUAcaAnIgCgWSLlIXJwAKAYIXIAAOA12DTdcABmAADgNdho3WWgQCJhAHQA6ABqD2MAcgAA4DXYzNzjCuQRUC4AAFQuAABYLmIuAAAAAGMubS5wLnQuAAAAAIguki4AAJouJxIqEnQAcgDpAB0ScgAA4DXYNd0AAUFhWy5eLnIA8gDnAnIA8gCTB75jAAFBYWYuaS5yAPIA4AJyAPIAjAdhAPAAeh5pAHMAAKD7IoABZHB0APgReS6DLgABZmx9LoAuAOA12GnddQDzAP8RaQBtAOUABBIAAUFhiy6OLnIA8gDuAnIA8gCaBwABY3GVLgoScgAA4DXYzdwAAXB0nS6hLmwAdQDzACUScgDpACASAARhY2VmaW9zdbEuvC7ELsguzC7PLtQu2S5jAAABdXm2LrsudABlADuA/QD9QE9kAAFpecAuwy5yAGMAd2FLZG4AO4ClAKVAcgAA4DXYNt1jAHkAV2RwAGYAAOA12GrdYwByAADgNdjO3AABY23dLt8ueQBOZGwAO4D/AP9AAAVhY2RlZmhpb3N38y73Lv8uAi8MLxAvEy8YLx0vIi9jInV0ZQB6YQABYXn7Lv4u8iFvbn5hN2RvAHQAfGEAAWV0Bi8KL3QAcgDmAB8QYQC2Y3IAAOA12DfdYwB5ADZk5yJyYXJyAKDdIXAAZgAA4DXYa91jAHIAAOA12M/cAAFqbiYvKC8AoA0gagAAoAwg");
}));
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/generated/decode-data-xml.js
var xmlDecodeTree;
var init_decode_data_xml = __esmMin((() => {
	init_decode_shared();
	xmlDecodeTree = /* #__PURE__ */ decodeBase64("AAJhZ2xxBwARABMAFQBtAg0AAAAAAA8AcAAmYG8AcwAnYHQAPmB0ADxg9SFvdCJg");
}));
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/internal/bin-trie-flags.js
var BinTrieFlags;
var init_bin_trie_flags = __esmMin((() => {
	(function(BinTrieFlags) {
		BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
		BinTrieFlags[BinTrieFlags["FLAG13"] = 8192] = "FLAG13";
		BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
		BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
	})(BinTrieFlags || (BinTrieFlags = {}));
}));
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/decode.js
function isNumber(code) {
	return code >= CharCodes$1.ZERO && code <= CharCodes$1.NINE;
}
function isHexadecimalCharacter(code) {
	return code >= CharCodes$1.UPPER_A && code <= CharCodes$1.UPPER_F || code >= CharCodes$1.LOWER_A && code <= CharCodes$1.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
	return code >= CharCodes$1.UPPER_A && code <= CharCodes$1.UPPER_Z || code >= CharCodes$1.LOWER_A && code <= CharCodes$1.LOWER_Z || isNumber(code);
}
/**
* Checks if the given character is a valid end character for an entity in an attribute.
*
* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
* @param code Code point to decode.
*/
function isEntityInAttributeInvalidEnd(code) {
	return code === CharCodes$1.EQUALS || isAsciiAlphaNumeric(code);
}
/**
* Determines the branch of the current node that is taken given the current
* character. This function is used to traverse the trie.
* @param decodeTree The trie.
* @param current The current node.
* @param nodeIndex Index immediately after the current node header.
* @param char The current character.
* @returns The index of the next node, or -1 if no branch is taken.
*/
function determineBranch(decodeTree, current, nodeIndex, char) {
	const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
	const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
	if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
	if (jumpOffset) {
		const value = char - jumpOffset;
		return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
	}
	const packedKeySlots = branchCount + 1 >> 1;
	let lo = 0;
	let hi = branchCount - 1;
	while (lo <= hi) {
		const mid = lo + hi >>> 1;
		const midKey = decodeTree[nodeIndex + (mid >> 1)] >> (mid & 1) * 8 & 255;
		if (midKey < char) lo = mid + 1;
		else if (midKey > char) hi = mid - 1;
		else return decodeTree[nodeIndex + packedKeySlots + mid];
	}
	return -1;
}
var CharCodes$1, TO_LOWER_BIT, EntityDecoderState, DecodingMode, EntityDecoder;
var init_decode = __esmMin((() => {
	init_decode_codepoint();
	init_bin_trie_flags();
	init_decode_data_html();
	init_decode_data_xml();
	(function(CharCodes) {
		CharCodes[CharCodes["NUM"] = 35] = "NUM";
		CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
		CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
		CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
		CharCodes[CharCodes["NINE"] = 57] = "NINE";
		CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
		CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
		CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
		CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
		CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
		CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
		CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
	})(CharCodes$1 || (CharCodes$1 = {}));
	TO_LOWER_BIT = 32;
	(function(EntityDecoderState) {
		EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
		EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
		EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
		EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
		EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
	})(EntityDecoderState || (EntityDecoderState = {}));
	(function(DecodingMode) {
		/** Entities in text nodes that can end with any character. */
		DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
		/** Only allow entities terminated with a semicolon. */
		DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
		/** Entities in attributes have limitations on ending characters. */
		DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
	})(DecodingMode || (DecodingMode = {}));
	EntityDecoder = class {
		decodeTree;
		emitCodePoint;
		errors;
		constructor(decodeTree, emitCodePoint, errors) {
			this.decodeTree = decodeTree;
			this.emitCodePoint = emitCodePoint;
			this.errors = errors;
		}
		/** The current state of the decoder. */
		state = EntityDecoderState.EntityStart;
		/** Characters that were consumed while parsing an entity. */
		consumed = 1;
		/**
		* The result of the entity.
		*
		* Either the result index of a numeric entity, or the codepoint of a
		* numeric entity.
		*/
		result = 0;
		/** The current index in the decode tree. */
		treeIndex = 0;
		/** The number of characters that were consumed in excess. */
		excess = 1;
		/** The mode in which the decoder is operating. */
		decodeMode = DecodingMode.Strict;
		/** The number of characters that have been consumed in the current run. */
		runConsumed = 0;
		/**
		* Resets the instance to make it reusable.
		* @param decodeMode Entity decoding mode to use.
		*/
		startEntity(decodeMode) {
			this.decodeMode = decodeMode;
			this.state = EntityDecoderState.EntityStart;
			this.result = 0;
			this.treeIndex = 0;
			this.excess = 1;
			this.consumed = 1;
			this.runConsumed = 0;
		}
		/**
		* Write an entity to the decoder. This can be called multiple times with partial entities.
		* If the entity is incomplete, the decoder will return -1.
		*
		* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
		* entity is incomplete, and resume when the next string is written.
		* @param input The string containing the entity (or a continuation of the entity).
		* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		write(input, offset) {
			switch (this.state) {
				case EntityDecoderState.EntityStart:
					if (input.charCodeAt(offset) === CharCodes$1.NUM) {
						this.state = EntityDecoderState.NumericStart;
						this.consumed += 1;
						return this.stateNumericStart(input, offset + 1);
					}
					this.state = EntityDecoderState.NamedEntity;
					return this.stateNamedEntity(input, offset);
				case EntityDecoderState.NumericStart: return this.stateNumericStart(input, offset);
				case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(input, offset);
				case EntityDecoderState.NumericHex: return this.stateNumericHex(input, offset);
				case EntityDecoderState.NamedEntity: return this.stateNamedEntity(input, offset);
			}
		}
		/**
		* Switches between the numeric decimal and hexadecimal states.
		*
		* Equivalent to the `Numeric character reference state` in the HTML spec.
		* @param input The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		stateNumericStart(input, offset) {
			if (offset >= input.length) return -1;
			if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes$1.LOWER_X) {
				this.state = EntityDecoderState.NumericHex;
				this.consumed += 1;
				return this.stateNumericHex(input, offset + 1);
			}
			this.state = EntityDecoderState.NumericDecimal;
			return this.stateNumericDecimal(input, offset);
		}
		/**
		* Parses a hexadecimal numeric entity.
		*
		* Equivalent to the `Hexademical character reference state` in the HTML spec.
		* @param input The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		stateNumericHex(input, offset) {
			while (offset < input.length) {
				const char = input.charCodeAt(offset);
				if (isNumber(char) || isHexadecimalCharacter(char)) {
					const digit = char <= CharCodes$1.NINE ? char - CharCodes$1.ZERO : (char | TO_LOWER_BIT) - CharCodes$1.LOWER_A + 10;
					this.result = this.result * 16 + digit;
					this.consumed++;
					offset++;
				} else return this.emitNumericEntity(char, 3);
			}
			return -1;
		}
		/**
		* Parses a decimal numeric entity.
		*
		* Equivalent to the `Decimal character reference state` in the HTML spec.
		* @param input The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		stateNumericDecimal(input, offset) {
			while (offset < input.length) {
				const char = input.charCodeAt(offset);
				if (isNumber(char)) {
					this.result = this.result * 10 + (char - CharCodes$1.ZERO);
					this.consumed++;
					offset++;
				} else return this.emitNumericEntity(char, 2);
			}
			return -1;
		}
		/**
		* Validate and emit a numeric entity.
		*
		* Implements the logic from the `Hexademical character reference start
		* state` and `Numeric character reference end state` in the HTML spec.
		* @param lastCp The last code point of the entity. Used to see if the
		*               entity was terminated with a semicolon.
		* @param expectedLength The minimum number of characters that should be
		*                       consumed. Used to validate that at least one digit
		*                       was consumed.
		* @returns The number of characters that were consumed.
		*/
		emitNumericEntity(lastCp, expectedLength) {
			if (this.consumed <= expectedLength) {
				this.errors?.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			}
			if (lastCp === CharCodes$1.SEMI) this.consumed += 1;
			else if (this.decodeMode === DecodingMode.Strict) return 0;
			this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
			if (this.errors) {
				if (lastCp !== CharCodes$1.SEMI) this.errors.missingSemicolonAfterCharacterReference();
				this.errors.validateNumericCharacterReference(this.result);
			}
			return this.consumed;
		}
		/**
		* Parses a named entity.
		*
		* Equivalent to the `Named character reference state` in the HTML spec.
		* @param input The string containing the entity (or a continuation of the entity).
		* @param offset The current offset.
		* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
		*/
		stateNamedEntity(input, offset) {
			const { decodeTree } = this;
			let current = decodeTree[this.treeIndex];
			let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			while (offset < input.length) {
				if (valueLength === 0 && (current & BinTrieFlags.FLAG13) !== 0) {
					const runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
					if (this.runConsumed === 0) {
						const firstChar = current & BinTrieFlags.JUMP_TABLE;
						if (input.charCodeAt(offset) !== firstChar) return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
						offset++;
						this.excess++;
						this.runConsumed++;
					}
					while (this.runConsumed < runLength) {
						if (offset >= input.length) return -1;
						const charIndexInPacked = this.runConsumed - 1;
						const packedWord = decodeTree[this.treeIndex + 1 + (charIndexInPacked >> 1)];
						const expectedChar = charIndexInPacked % 2 === 0 ? packedWord & 255 : packedWord >> 8 & 255;
						if (input.charCodeAt(offset) !== expectedChar) {
							this.runConsumed = 0;
							return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
						}
						offset++;
						this.excess++;
						this.runConsumed++;
					}
					this.runConsumed = 0;
					this.treeIndex += 1 + (runLength >> 1);
					current = decodeTree[this.treeIndex];
					valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
				}
				if (offset >= input.length) break;
				const char = input.charCodeAt(offset);
				if (char === CharCodes$1.SEMI && valueLength !== 0 && (current & BinTrieFlags.FLAG13) !== 0) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
				this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
				if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
				current = decodeTree[this.treeIndex];
				valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
				if (valueLength !== 0) {
					if (char === CharCodes$1.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
					if (this.decodeMode !== DecodingMode.Strict && (current & BinTrieFlags.FLAG13) === 0) {
						this.result = this.treeIndex;
						this.consumed += this.excess;
						this.excess = 0;
					}
				}
				offset++;
				this.excess++;
			}
			return -1;
		}
		/**
		* Emit a named entity that was not terminated with a semicolon.
		* @returns The number of characters consumed.
		*/
		emitNotTerminatedNamedEntity() {
			const { result, decodeTree } = this;
			const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
			this.emitNamedEntityData(result, valueLength, this.consumed);
			this.errors?.missingSemicolonAfterCharacterReference();
			return this.consumed;
		}
		/**
		* Emit a named entity.
		* @param result The index of the entity in the decode tree.
		* @param valueLength The number of bytes in the entity.
		* @param consumed The number of characters consumed.
		* @returns The number of characters consumed.
		*/
		emitNamedEntityData(result, valueLength, consumed) {
			const { decodeTree } = this;
			this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13) : decodeTree[result + 1], consumed);
			if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
			return consumed;
		}
		/**
		* Signal to the parser that the end of the input was reached.
		*
		* Remaining data will be emitted and relevant errors will be produced.
		* @returns The number of characters consumed.
		*/
		end() {
			switch (this.state) {
				case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
				case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
				case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
				case EntityDecoderState.NumericStart:
					this.errors?.absenceOfDigitsInNumericCharacterReference(this.consumed);
					return 0;
				case EntityDecoderState.EntityStart: return 0;
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/htmlparser2@12.0.0/node_modules/htmlparser2/dist/Tokenizer.js
function isWhitespace(c) {
	return c === CharCodes.Space || c === CharCodes.NewLine || c === CharCodes.Tab || c === CharCodes.FormFeed || c === CharCodes.CarriageReturn;
}
function isEndOfTagSection(c) {
	return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c);
}
function isASCIIAlpha(c) {
	return c >= CharCodes.LowerA && c <= CharCodes.LowerZ || c >= CharCodes.UpperA && c <= CharCodes.UpperZ;
}
var CharCodes, State, QuoteType, Sequences, specialStartSequences, Tokenizer;
var init_Tokenizer = __esmMin((() => {
	init_decode();
	(function(CharCodes) {
		CharCodes[CharCodes["Tab"] = 9] = "Tab";
		CharCodes[CharCodes["NewLine"] = 10] = "NewLine";
		CharCodes[CharCodes["FormFeed"] = 12] = "FormFeed";
		CharCodes[CharCodes["CarriageReturn"] = 13] = "CarriageReturn";
		CharCodes[CharCodes["Space"] = 32] = "Space";
		CharCodes[CharCodes["ExclamationMark"] = 33] = "ExclamationMark";
		CharCodes[CharCodes["Number"] = 35] = "Number";
		CharCodes[CharCodes["Amp"] = 38] = "Amp";
		CharCodes[CharCodes["SingleQuote"] = 39] = "SingleQuote";
		CharCodes[CharCodes["DoubleQuote"] = 34] = "DoubleQuote";
		CharCodes[CharCodes["Dash"] = 45] = "Dash";
		CharCodes[CharCodes["Slash"] = 47] = "Slash";
		CharCodes[CharCodes["Zero"] = 48] = "Zero";
		CharCodes[CharCodes["Nine"] = 57] = "Nine";
		CharCodes[CharCodes["Semi"] = 59] = "Semi";
		CharCodes[CharCodes["Lt"] = 60] = "Lt";
		CharCodes[CharCodes["Eq"] = 61] = "Eq";
		CharCodes[CharCodes["Gt"] = 62] = "Gt";
		CharCodes[CharCodes["Questionmark"] = 63] = "Questionmark";
		CharCodes[CharCodes["UpperA"] = 65] = "UpperA";
		CharCodes[CharCodes["LowerA"] = 97] = "LowerA";
		CharCodes[CharCodes["UpperF"] = 70] = "UpperF";
		CharCodes[CharCodes["LowerF"] = 102] = "LowerF";
		CharCodes[CharCodes["UpperZ"] = 90] = "UpperZ";
		CharCodes[CharCodes["LowerZ"] = 122] = "LowerZ";
		CharCodes[CharCodes["LowerX"] = 120] = "LowerX";
		CharCodes[CharCodes["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
	})(CharCodes || (CharCodes = {}));
	(function(State) {
		State[State["Text"] = 1] = "Text";
		State[State["BeforeTagName"] = 2] = "BeforeTagName";
		State[State["InTagName"] = 3] = "InTagName";
		State[State["InSelfClosingTag"] = 4] = "InSelfClosingTag";
		State[State["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
		State[State["InClosingTagName"] = 6] = "InClosingTagName";
		State[State["AfterClosingTagName"] = 7] = "AfterClosingTagName";
		State[State["BeforeAttributeName"] = 8] = "BeforeAttributeName";
		State[State["InAttributeName"] = 9] = "InAttributeName";
		State[State["AfterAttributeName"] = 10] = "AfterAttributeName";
		State[State["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
		State[State["InAttributeValueDq"] = 12] = "InAttributeValueDq";
		State[State["InAttributeValueSq"] = 13] = "InAttributeValueSq";
		State[State["InAttributeValueNq"] = 14] = "InAttributeValueNq";
		State[State["BeforeDeclaration"] = 15] = "BeforeDeclaration";
		State[State["InDeclaration"] = 16] = "InDeclaration";
		State[State["InProcessingInstruction"] = 17] = "InProcessingInstruction";
		State[State["BeforeComment"] = 18] = "BeforeComment";
		State[State["CDATASequence"] = 19] = "CDATASequence";
		State[State["DeclarationSequence"] = 20] = "DeclarationSequence";
		State[State["InSpecialComment"] = 21] = "InSpecialComment";
		State[State["InCommentLike"] = 22] = "InCommentLike";
		State[State["SpecialStartSequence"] = 23] = "SpecialStartSequence";
		State[State["InSpecialTag"] = 24] = "InSpecialTag";
		State[State["InPlainText"] = 25] = "InPlainText";
		State[State["InEntity"] = 26] = "InEntity";
	})(State || (State = {}));
	(function(QuoteType) {
		QuoteType[QuoteType["NoValue"] = 0] = "NoValue";
		QuoteType[QuoteType["Unquoted"] = 1] = "Unquoted";
		QuoteType[QuoteType["Single"] = 2] = "Single";
		QuoteType[QuoteType["Double"] = 3] = "Double";
	})(QuoteType || (QuoteType = {}));
	Sequences = {
		Empty: /* @__PURE__ */ new Uint8Array(0),
		Cdata: new Uint8Array([
			67,
			68,
			65,
			84,
			65,
			91
		]),
		CdataEnd: new Uint8Array([
			93,
			93,
			62
		]),
		CommentEnd: new Uint8Array([
			45,
			45,
			33,
			62
		]),
		Doctype: new Uint8Array([
			100,
			111,
			99,
			116,
			121,
			112,
			101
		]),
		IframeEnd: new Uint8Array([
			60,
			47,
			105,
			102,
			114,
			97,
			109,
			101
		]),
		NoembedEnd: new Uint8Array([
			60,
			47,
			110,
			111,
			101,
			109,
			98,
			101,
			100
		]),
		NoframesEnd: new Uint8Array([
			60,
			47,
			110,
			111,
			102,
			114,
			97,
			109,
			101,
			115
		]),
		Plaintext: new Uint8Array([
			60,
			47,
			112,
			108,
			97,
			105,
			110,
			116,
			101,
			120,
			116
		]),
		ScriptEnd: new Uint8Array([
			60,
			47,
			115,
			99,
			114,
			105,
			112,
			116
		]),
		StyleEnd: new Uint8Array([
			60,
			47,
			115,
			116,
			121,
			108,
			101
		]),
		TitleEnd: new Uint8Array([
			60,
			47,
			116,
			105,
			116,
			108,
			101
		]),
		TextareaEnd: new Uint8Array([
			60,
			47,
			116,
			101,
			120,
			116,
			97,
			114,
			101,
			97
		]),
		XmpEnd: new Uint8Array([
			60,
			47,
			120,
			109,
			112
		])
	};
	specialStartSequences = /* @__PURE__ */ new Map([
		[Sequences.IframeEnd[2], Sequences.IframeEnd],
		[Sequences.NoembedEnd[2], Sequences.NoembedEnd],
		[Sequences.Plaintext[2], Sequences.Plaintext],
		[Sequences.ScriptEnd[2], Sequences.ScriptEnd],
		[Sequences.TitleEnd[2], Sequences.TitleEnd],
		[Sequences.XmpEnd[2], Sequences.XmpEnd]
	]);
	Tokenizer = class {
		cbs;
		/** The current state the tokenizer is in. */
		state = State.Text;
		/** The read buffer. */
		buffer = "";
		/** The beginning of the section that is currently being read. */
		sectionStart = 0;
		/** The index within the buffer that we are currently looking at. */
		index = 0;
		/** The start of the last entity. */
		entityStart = 0;
		/** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
		baseState = State.Text;
		/** For special parsing behavior inside of script and style tags. */
		isSpecial = false;
		/** Indicates whether the tokenizer has been paused. */
		running = true;
		/** The offset of the current buffer. */
		offset = 0;
		xmlMode;
		decodeEntities;
		recognizeSelfClosing;
		entityDecoder;
		constructor({ xmlMode = false, decodeEntities = true, recognizeSelfClosing = xmlMode }, cbs) {
			this.cbs = cbs;
			this.xmlMode = xmlMode;
			this.decodeEntities = decodeEntities;
			this.recognizeSelfClosing = recognizeSelfClosing;
			this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
		}
		reset() {
			this.state = State.Text;
			this.buffer = "";
			this.sectionStart = 0;
			this.index = 0;
			this.baseState = State.Text;
			this.isSpecial = false;
			this.currentSequence = Sequences.Empty;
			this.sequenceIndex = 0;
			this.running = true;
			this.offset = 0;
		}
		write(chunk) {
			this.offset += this.buffer.length;
			this.buffer = chunk;
			this.parse();
		}
		end() {
			if (this.running) this.finish();
		}
		pause() {
			this.running = false;
		}
		resume() {
			this.running = true;
			if (this.index < this.buffer.length + this.offset) this.parse();
		}
		stateText(c) {
			if (c === CharCodes.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes.Lt)) {
				if (this.index > this.sectionStart) this.cbs.ontext(this.sectionStart, this.index);
				this.state = State.BeforeTagName;
				this.sectionStart = this.index;
			} else if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
		}
		currentSequence = Sequences.Empty;
		sequenceIndex = 0;
		enterTagBody() {
			if (this.currentSequence === Sequences.Plaintext) {
				this.currentSequence = Sequences.Empty;
				this.state = State.InPlainText;
			} else if (this.isSpecial) {
				this.state = State.InSpecialTag;
				this.sequenceIndex = 0;
			} else this.state = State.Text;
		}
		/**
		* Match the opening tag name against an HTML text-only tag sequence.
		*
		* Some tags share an initial prefix (`script`/`style`, `title`/`textarea`,
		* `noembed`/`noframes`), so we may switch to an alternate sequence at the
		* first distinguishing byte.  On a successful full match we fall back to
		* the normal tag-name state; a later `>` will enter raw-text, RCDATA, or
		* plaintext mode based on `currentSequence` / `isSpecial`.
		* @param c Current character code point.
		*/
		stateSpecialStartSequence(c) {
			const lower = c | 32;
			if (this.sequenceIndex < this.currentSequence.length) {
				if (lower === this.currentSequence[this.sequenceIndex]) {
					this.sequenceIndex++;
					return;
				}
				if (this.sequenceIndex === 3) {
					if (this.currentSequence === Sequences.ScriptEnd && lower === Sequences.StyleEnd[3]) {
						this.currentSequence = Sequences.StyleEnd;
						this.sequenceIndex = 4;
						return;
					}
					if (this.currentSequence === Sequences.TitleEnd && lower === Sequences.TextareaEnd[3]) {
						this.currentSequence = Sequences.TextareaEnd;
						this.sequenceIndex = 4;
						return;
					}
				} else if (this.sequenceIndex === 4 && this.currentSequence === Sequences.NoembedEnd && lower === Sequences.NoframesEnd[4]) {
					this.currentSequence = Sequences.NoframesEnd;
					this.sequenceIndex = 5;
					return;
				}
			} else if (isEndOfTagSection(c)) {
				this.sequenceIndex = 0;
				this.state = State.InTagName;
				this.stateInTagName(c);
				return;
			}
			this.isSpecial = false;
			this.currentSequence = Sequences.Empty;
			this.sequenceIndex = 0;
			this.state = State.InTagName;
			this.stateInTagName(c);
		}
		stateCDATASequence(c) {
			if (c === Sequences.Cdata[this.sequenceIndex]) {
				if (++this.sequenceIndex === Sequences.Cdata.length) {
					this.state = State.InCommentLike;
					this.currentSequence = Sequences.CdataEnd;
					this.sequenceIndex = 0;
					this.sectionStart = this.index + 1;
				}
			} else {
				this.sequenceIndex = 0;
				if (this.xmlMode) {
					this.state = State.InDeclaration;
					this.stateInDeclaration(c);
				} else {
					this.state = State.InSpecialComment;
					this.stateInSpecialComment(c);
				}
			}
		}
		/**
		* When we wait for one specific character, we can speed things up
		* by skipping through the buffer until we find it.
		* @param c Current character code point.
		* @returns Whether the character was found.
		*/
		fastForwardTo(c) {
			while (++this.index < this.buffer.length + this.offset) if (this.buffer.charCodeAt(this.index - this.offset) === c) return true;
			this.index = this.buffer.length + this.offset - 1;
			return false;
		}
		/**
		* Emit a comment token and return to the text state.
		* @param offset Number of characters in the end sequence that have already been matched.
		*/
		emitComment(offset) {
			this.cbs.oncomment(this.sectionStart, this.index, offset);
			this.sequenceIndex = 0;
			this.sectionStart = this.index + 1;
			this.state = State.Text;
		}
		/**
		* Comments and CDATA end with `-->` and `]]>`.
		*
		* Their common qualities are:
		* - Their end sequences have a distinct character they start with.
		* - That character is then repeated, so we have to check multiple repeats.
		* - All characters but the start character of the sequence can be skipped.
		* @param c Current character code point.
		*/
		stateInCommentLike(c) {
			if (!this.xmlMode && this.currentSequence === Sequences.CommentEnd && this.sequenceIndex <= 1 && this.index === this.sectionStart + this.sequenceIndex && c === CharCodes.Gt) this.emitComment(this.sequenceIndex);
			else if (this.currentSequence === Sequences.CommentEnd && this.sequenceIndex === 2 && c === CharCodes.Gt) this.emitComment(2);
			else if (this.currentSequence === Sequences.CommentEnd && this.sequenceIndex === this.currentSequence.length - 1 && c !== CharCodes.Gt) this.sequenceIndex = Number(c === CharCodes.Dash);
			else if (c === this.currentSequence[this.sequenceIndex]) {
				if (++this.sequenceIndex === this.currentSequence.length) {
					if (this.currentSequence === Sequences.CdataEnd) this.cbs.oncdata(this.sectionStart, this.index, 2);
					else this.cbs.oncomment(this.sectionStart, this.index, 3);
					this.sequenceIndex = 0;
					this.sectionStart = this.index + 1;
					this.state = State.Text;
				}
			} else if (this.sequenceIndex === 0) {
				if (this.fastForwardTo(this.currentSequence[0])) this.sequenceIndex = 1;
			} else if (c !== this.currentSequence[this.sequenceIndex - 1]) this.sequenceIndex = 0;
		}
		/**
		* HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
		*
		* XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
		* We allow anything that wouldn't end the tag.
		* @param c Current character code point.
		*/
		isTagStartChar(c) {
			return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
		}
		/**
		* Scan raw-text / RCDATA content for the matching end tag.
		*
		* For RCDATA tags (`<title>`, `<textarea>`) entities are decoded inline.
		* For raw-text tags (`<script>`, `<style>`, etc.) we fast-forward to `<`.
		* @param c Current character code point.
		*/
		stateInSpecialTag(c) {
			if (this.sequenceIndex === this.currentSequence.length) {
				if (isEndOfTagSection(c)) {
					const endOfText = this.index - this.currentSequence.length;
					if (this.sectionStart < endOfText) {
						const actualIndex = this.index;
						this.index = endOfText;
						this.cbs.ontext(this.sectionStart, endOfText);
						this.index = actualIndex;
					}
					this.isSpecial = false;
					this.sectionStart = endOfText + 2;
					this.stateInClosingTagName(c);
					return;
				}
				this.sequenceIndex = 0;
			}
			if ((c | 32) === this.currentSequence[this.sequenceIndex]) this.sequenceIndex += 1;
			else if (this.sequenceIndex === 0) {
				if (this.currentSequence === Sequences.TitleEnd || this.currentSequence === Sequences.TextareaEnd) {
					if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
				} else if (this.fastForwardTo(CharCodes.Lt)) this.sequenceIndex = 1;
			} else this.sequenceIndex = Number(c === CharCodes.Lt);
		}
		stateBeforeTagName(c) {
			if (c === CharCodes.ExclamationMark) {
				this.state = State.BeforeDeclaration;
				this.sectionStart = this.index + 1;
			} else if (c === CharCodes.Questionmark) {
				if (this.xmlMode) {
					this.state = State.InProcessingInstruction;
					this.sequenceIndex = 0;
					this.sectionStart = this.index + 1;
				} else {
					this.state = State.InSpecialComment;
					this.sectionStart = this.index;
				}
			} else if (this.isTagStartChar(c)) {
				this.sectionStart = this.index;
				const special = this.xmlMode || this.cbs.isInForeignContext?.() ? void 0 : specialStartSequences.get(c | 32);
				if (special === void 0) this.state = State.InTagName;
				else {
					this.isSpecial = true;
					this.currentSequence = special;
					this.sequenceIndex = 3;
					this.state = State.SpecialStartSequence;
				}
			} else if (c === CharCodes.Slash) this.state = State.BeforeClosingTagName;
			else {
				this.state = State.Text;
				this.stateText(c);
			}
		}
		stateInTagName(c) {
			if (isEndOfTagSection(c)) {
				this.cbs.onopentagname(this.sectionStart, this.index);
				this.sectionStart = -1;
				this.state = State.BeforeAttributeName;
				this.stateBeforeAttributeName(c);
			}
		}
		stateBeforeClosingTagName(c) {
			if (isWhitespace(c)) {
				if (this.xmlMode) {} else {
					this.state = State.InSpecialComment;
					this.sectionStart = this.index;
				}
			} else if (c === CharCodes.Gt) {
				this.state = State.Text;
				if (!this.xmlMode) this.sectionStart = this.index + 1;
			} else {
				this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
				this.sectionStart = this.index;
			}
		}
		stateInClosingTagName(c) {
			if (isEndOfTagSection(c)) {
				this.cbs.onclosetag(this.sectionStart, this.index);
				this.sectionStart = -1;
				this.state = State.AfterClosingTagName;
				this.stateAfterClosingTagName(c);
			}
		}
		stateAfterClosingTagName(c) {
			if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
				this.state = State.Text;
				this.sectionStart = this.index + 1;
			}
		}
		stateBeforeAttributeName(c) {
			if (c === CharCodes.Gt) {
				this.cbs.onopentagend(this.index);
				this.enterTagBody();
				this.sectionStart = this.index + 1;
			} else if (c === CharCodes.Slash) this.state = State.InSelfClosingTag;
			else if (!isWhitespace(c)) {
				this.state = State.InAttributeName;
				this.sectionStart = this.index;
			}
		}
		/**
		* Handle `/` before `>` in an opening tag.
		*
		* In HTML mode, text-only tags ignore the self-closing flag and still enter
		* their raw-text/RCDATA/plaintext state unless self-closing tags are being
		* recognized. In XML mode, or for ordinary tags, the tokenizer returns to
		* regular text parsing after emitting the self-closing callback.
		* @param c Current character code point.
		*/
		stateInSelfClosingTag(c) {
			if (c === CharCodes.Gt) {
				this.cbs.onselfclosingtag(this.index);
				this.sectionStart = this.index + 1;
				if (!this.recognizeSelfClosing) {
					this.enterTagBody();
					return;
				}
				this.state = State.Text;
				this.isSpecial = false;
				this.currentSequence = Sequences.Empty;
			} else if (!isWhitespace(c)) {
				this.state = State.BeforeAttributeName;
				this.stateBeforeAttributeName(c);
			}
		}
		stateInAttributeName(c) {
			if (c === CharCodes.Eq || isEndOfTagSection(c)) {
				this.cbs.onattribname(this.sectionStart, this.index);
				this.sectionStart = this.index;
				this.state = State.AfterAttributeName;
				this.stateAfterAttributeName(c);
			}
		}
		stateAfterAttributeName(c) {
			if (c === CharCodes.Eq) this.state = State.BeforeAttributeValue;
			else if (c === CharCodes.Slash || c === CharCodes.Gt) {
				this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
				this.sectionStart = -1;
				this.state = State.BeforeAttributeName;
				this.stateBeforeAttributeName(c);
			} else if (!isWhitespace(c)) {
				this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
				this.state = State.InAttributeName;
				this.sectionStart = this.index;
			}
		}
		stateBeforeAttributeValue(c) {
			if (c === CharCodes.DoubleQuote) {
				this.state = State.InAttributeValueDq;
				this.sectionStart = this.index + 1;
			} else if (c === CharCodes.SingleQuote) {
				this.state = State.InAttributeValueSq;
				this.sectionStart = this.index + 1;
			} else if (!isWhitespace(c)) {
				this.sectionStart = this.index;
				this.state = State.InAttributeValueNq;
				this.stateInAttributeValueNoQuotes(c);
			}
		}
		handleInAttributeValue(c, quote) {
			if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
				this.cbs.onattribdata(this.sectionStart, this.index);
				this.sectionStart = -1;
				this.cbs.onattribend(quote === CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index + 1);
				this.state = State.BeforeAttributeName;
			} else if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
		}
		stateInAttributeValueDoubleQuotes(c) {
			this.handleInAttributeValue(c, CharCodes.DoubleQuote);
		}
		stateInAttributeValueSingleQuotes(c) {
			this.handleInAttributeValue(c, CharCodes.SingleQuote);
		}
		stateInAttributeValueNoQuotes(c) {
			if (isWhitespace(c) || c === CharCodes.Gt) {
				this.cbs.onattribdata(this.sectionStart, this.index);
				this.sectionStart = -1;
				this.cbs.onattribend(QuoteType.Unquoted, this.index);
				this.state = State.BeforeAttributeName;
				this.stateBeforeAttributeName(c);
			} else if (this.decodeEntities && c === CharCodes.Amp) this.startEntity();
		}
		/**
		* Distinguish between CDATA, declarations, HTML comments, and HTML bogus
		* comments after `<!`.
		*
		* In HTML mode, only real comments and doctypes stay on declaration paths;
		* everything else becomes a bogus comment terminated by the next `>`.
		* @param c Current character code point.
		*/
		stateBeforeDeclaration(c) {
			if (c === CharCodes.OpeningSquareBracket) {
				this.state = State.CDATASequence;
				this.sequenceIndex = 0;
			} else if (this.xmlMode) this.state = c === CharCodes.Dash ? State.BeforeComment : State.InDeclaration;
			else if ((c | 32) === Sequences.Doctype[0]) {
				this.state = State.DeclarationSequence;
				this.currentSequence = Sequences.Doctype;
				this.sequenceIndex = 1;
			} else if (c === CharCodes.Gt) {
				this.cbs.oncomment(this.sectionStart, this.index, 0);
				this.state = State.Text;
				this.sectionStart = this.index + 1;
			} else if (c === CharCodes.Dash) this.state = State.BeforeComment;
			else this.state = State.InSpecialComment;
		}
		/**
		* Continue matching `doctype` after `<!d`.
		*
		* A full `doctype` match stays on the declaration path; any other name falls
		* back to an HTML bogus comment, which matches browser behavior for
		* non-doctype `<!...>` constructs.
		* @param c Current character code point.
		*/
		stateDeclarationSequence(c) {
			if (this.sequenceIndex === this.currentSequence.length) {
				this.state = State.InDeclaration;
				this.stateInDeclaration(c);
			} else if ((c | 32) === this.currentSequence[this.sequenceIndex]) this.sequenceIndex += 1;
			else if (c === CharCodes.Gt) {
				this.cbs.oncomment(this.sectionStart, this.index, 0);
				this.state = State.Text;
				this.sectionStart = this.index + 1;
			} else this.state = State.InSpecialComment;
		}
		stateInDeclaration(c) {
			if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
				this.cbs.ondeclaration(this.sectionStart, this.index);
				this.state = State.Text;
				this.sectionStart = this.index + 1;
			}
		}
		/**
		* XML processing instructions (`<?...?>`).
		*
		* In HTML mode `<?` is routed to `InSpecialComment` instead, so this
		* state is only reachable in XML mode.
		* @param c Current character code point.
		*/
		stateInProcessingInstruction(c) {
			if (c === CharCodes.Questionmark) this.sequenceIndex = 1;
			else if (c === CharCodes.Gt && this.sequenceIndex === 1) {
				this.cbs.onprocessinginstruction(this.sectionStart, this.index - 1);
				this.sequenceIndex = 0;
				this.state = State.Text;
				this.sectionStart = this.index + 1;
			} else this.sequenceIndex = Number(this.fastForwardTo(CharCodes.Questionmark));
		}
		stateBeforeComment(c) {
			if (c === CharCodes.Dash) {
				this.state = State.InCommentLike;
				this.currentSequence = Sequences.CommentEnd;
				this.sequenceIndex = 0;
				this.sectionStart = this.index + 1;
			} else if (this.xmlMode) this.state = State.InDeclaration;
			else if (c === CharCodes.Gt) {
				this.cbs.oncomment(this.sectionStart, this.index, 0);
				this.state = State.Text;
				this.sectionStart = this.index + 1;
			} else this.state = State.InSpecialComment;
		}
		stateInSpecialComment(c) {
			if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
				this.cbs.oncomment(this.sectionStart, this.index, 0);
				this.state = State.Text;
				this.sectionStart = this.index + 1;
			}
		}
		startEntity() {
			this.baseState = this.state;
			this.state = State.InEntity;
			this.entityStart = this.index;
			this.entityDecoder.startEntity(this.xmlMode ? DecodingMode.Strict : this.baseState === State.Text || this.baseState === State.InSpecialTag ? DecodingMode.Legacy : DecodingMode.Attribute);
		}
		stateInEntity() {
			const indexInBuffer = this.index - this.offset;
			const length = this.entityDecoder.write(this.buffer, indexInBuffer);
			if (length >= 0) {
				this.state = this.baseState;
				if (length === 0) this.index -= 1;
			} else {
				if (indexInBuffer < this.buffer.length && this.buffer.charCodeAt(indexInBuffer) === CharCodes.Amp) {
					this.state = this.baseState;
					this.index -= 1;
					return;
				}
				this.index = this.offset + this.buffer.length - 1;
			}
		}
		/**
		* Remove data that has already been consumed from the buffer.
		*/
		cleanup() {
			if (this.running && this.sectionStart !== this.index) {
				if (this.state === State.Text || this.state === State.InPlainText || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
					this.cbs.ontext(this.sectionStart, this.index);
					this.sectionStart = this.index;
				} else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
					this.cbs.onattribdata(this.sectionStart, this.index);
					this.sectionStart = this.index;
				}
			}
		}
		shouldContinue() {
			return this.index < this.buffer.length + this.offset && this.running;
		}
		/**
		* Iterates through the buffer, calling the function corresponding to the current state.
		*
		* States that are more likely to be hit are higher up, as a performance improvement.
		*/
		parse() {
			while (this.shouldContinue()) {
				const c = this.buffer.charCodeAt(this.index - this.offset);
				switch (this.state) {
					case State.Text:
						this.stateText(c);
						break;
					case State.InPlainText:
						this.index = this.buffer.length + this.offset - 1;
						break;
					case State.SpecialStartSequence:
						this.stateSpecialStartSequence(c);
						break;
					case State.InSpecialTag:
						this.stateInSpecialTag(c);
						break;
					case State.CDATASequence:
						this.stateCDATASequence(c);
						break;
					case State.DeclarationSequence:
						this.stateDeclarationSequence(c);
						break;
					case State.InAttributeValueDq:
						this.stateInAttributeValueDoubleQuotes(c);
						break;
					case State.InAttributeName:
						this.stateInAttributeName(c);
						break;
					case State.InCommentLike:
						this.stateInCommentLike(c);
						break;
					case State.InSpecialComment:
						this.stateInSpecialComment(c);
						break;
					case State.BeforeAttributeName:
						this.stateBeforeAttributeName(c);
						break;
					case State.InTagName:
						this.stateInTagName(c);
						break;
					case State.InClosingTagName:
						this.stateInClosingTagName(c);
						break;
					case State.BeforeTagName:
						this.stateBeforeTagName(c);
						break;
					case State.AfterAttributeName:
						this.stateAfterAttributeName(c);
						break;
					case State.InAttributeValueSq:
						this.stateInAttributeValueSingleQuotes(c);
						break;
					case State.BeforeAttributeValue:
						this.stateBeforeAttributeValue(c);
						break;
					case State.BeforeClosingTagName:
						this.stateBeforeClosingTagName(c);
						break;
					case State.AfterClosingTagName:
						this.stateAfterClosingTagName(c);
						break;
					case State.InAttributeValueNq:
						this.stateInAttributeValueNoQuotes(c);
						break;
					case State.InSelfClosingTag:
						this.stateInSelfClosingTag(c);
						break;
					case State.InDeclaration:
						this.stateInDeclaration(c);
						break;
					case State.BeforeDeclaration:
						this.stateBeforeDeclaration(c);
						break;
					case State.BeforeComment:
						this.stateBeforeComment(c);
						break;
					case State.InProcessingInstruction:
						this.stateInProcessingInstruction(c);
						break;
					case State.InEntity: this.stateInEntity();
				}
				this.index++;
			}
			this.cleanup();
		}
		finish() {
			if (this.state === State.InEntity) {
				this.entityDecoder.end();
				this.state = this.baseState;
			}
			this.handleTrailingData();
			this.cbs.onend();
		}
		handleTrailingCommentLikeData(endIndex) {
			if (this.state !== State.InCommentLike) return false;
			if (this.currentSequence === Sequences.CdataEnd) {
				if (this.xmlMode) {
					if (this.sectionStart < endIndex) this.cbs.oncdata(this.sectionStart, endIndex, 0);
				} else {
					const cdataStart = this.sectionStart - Sequences.Cdata.length - 1;
					this.cbs.oncomment(cdataStart, endIndex, 0);
				}
			} else {
				const offset = this.xmlMode ? 0 : Math.min(this.sequenceIndex, Sequences.CommentEnd.length - 1);
				this.cbs.oncomment(this.sectionStart, endIndex, offset);
			}
			return true;
		}
		handleTrailingMarkupDeclaration(endIndex) {
			if (this.xmlMode) switch (this.state) {
				case State.InSpecialComment:
				case State.BeforeComment:
				case State.CDATASequence:
				case State.DeclarationSequence:
				case State.InDeclaration:
					this.cbs.ontext(this.sectionStart, endIndex);
					return true;
				default: return false;
			}
			switch (this.state) {
				case State.BeforeDeclaration:
				case State.InSpecialComment:
				case State.BeforeComment:
				case State.CDATASequence:
					this.cbs.oncomment(this.sectionStart, endIndex, 0);
					return true;
				case State.DeclarationSequence:
					if (this.sequenceIndex !== Sequences.Doctype.length) this.cbs.oncomment(this.sectionStart, endIndex, 0);
					return true;
				case State.InDeclaration: return true;
				default: return false;
			}
		}
		/** Handle any trailing data. */
		handleTrailingData() {
			const endIndex = this.buffer.length + this.offset;
			if (this.handleTrailingCommentLikeData(endIndex) || this.handleTrailingMarkupDeclaration(endIndex)) return;
			if (this.sectionStart >= endIndex) return;
			switch (this.state) {
				case State.InTagName:
				case State.BeforeAttributeName:
				case State.BeforeAttributeValue:
				case State.AfterAttributeName:
				case State.InAttributeName:
				case State.InAttributeValueSq:
				case State.InAttributeValueDq:
				case State.InAttributeValueNq:
				case State.InClosingTagName: break;
				default: this.cbs.ontext(this.sectionStart, endIndex);
			}
		}
		emitCodePoint(cp, consumed) {
			if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
				if (this.sectionStart < this.entityStart) this.cbs.onattribdata(this.sectionStart, this.entityStart);
				this.sectionStart = this.entityStart + consumed;
				this.index = this.sectionStart - 1;
				this.cbs.onattribentity(cp);
			} else {
				if (this.sectionStart < this.entityStart) this.cbs.ontext(this.sectionStart, this.entityStart);
				this.sectionStart = this.entityStart + consumed;
				this.index = this.sectionStart - 1;
				this.cbs.ontextentity(cp, this.sectionStart);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/htmlparser2@12.0.0/node_modules/htmlparser2/dist/Parser.js
var fromCodePoint, formTags, pTag, headingTags, tableSectionTags, ddtTags, rtpTags, openImpliesClose, DOCUMENT_TYPE, voidElements$1, foreignContextElements, htmlIntegrationElements, svgTagNameAdjustments, ForeignContext, reNameEnd, Parser;
var init_Parser = __esmMin((() => {
	init_Tokenizer();
	({fromCodePoint} = String);
	formTags = /* @__PURE__ */ new Set([
		"input",
		"option",
		"optgroup",
		"select",
		"button",
		"datalist",
		"textarea"
	]);
	pTag = /* @__PURE__ */ new Set(["p"]);
	headingTags = /* @__PURE__ */ new Set([
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"p"
	]);
	tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
	ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
	rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
	openImpliesClose = /* @__PURE__ */ new Map([
		["tr", /* @__PURE__ */ new Set([
			"tr",
			"th",
			"td"
		])],
		["th", /* @__PURE__ */ new Set(["th"])],
		["td", /* @__PURE__ */ new Set([
			"thead",
			"th",
			"td"
		])],
		["body", /* @__PURE__ */ new Set([
			"head",
			"link",
			"script"
		])],
		["a", /* @__PURE__ */ new Set(["a"])],
		["li", /* @__PURE__ */ new Set(["li"])],
		["p", pTag],
		["h1", headingTags],
		["h2", headingTags],
		["h3", headingTags],
		["h4", headingTags],
		["h5", headingTags],
		["h6", headingTags],
		["select", formTags],
		["input", formTags],
		["output", formTags],
		["button", formTags],
		["datalist", formTags],
		["textarea", formTags],
		["option", /* @__PURE__ */ new Set(["option"])],
		["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
		["dd", ddtTags],
		["dt", ddtTags],
		["address", pTag],
		["article", pTag],
		["aside", pTag],
		["blockquote", pTag],
		["details", pTag],
		["div", pTag],
		["dl", pTag],
		["fieldset", pTag],
		["figcaption", pTag],
		["figure", pTag],
		["footer", pTag],
		["form", pTag],
		["header", pTag],
		["hr", pTag],
		["main", pTag],
		["nav", pTag],
		["ol", pTag],
		["pre", pTag],
		["section", pTag],
		["table", pTag],
		["ul", pTag],
		["rt", rtpTags],
		["rp", rtpTags],
		["tbody", tableSectionTags],
		["tfoot", tableSectionTags]
	]);
	DOCUMENT_TYPE = "doctype";
	voidElements$1 = /* @__PURE__ */ new Set([
		"area",
		"base",
		"basefont",
		"br",
		"col",
		"command",
		"embed",
		"frame",
		"hr",
		"img",
		"input",
		"isindex",
		"keygen",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	]);
	foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
	htmlIntegrationElements = /* @__PURE__ */ new Set([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext",
		"annotation-xml",
		"foreignObject",
		"desc",
		"title"
	]);
	svgTagNameAdjustments = /* @__PURE__ */ new Map([
		["altglyph", "altGlyph"],
		["altglyphdef", "altGlyphDef"],
		["altglyphitem", "altGlyphItem"],
		["animatecolor", "animateColor"],
		["animatemotion", "animateMotion"],
		["animatetransform", "animateTransform"],
		["clippath", "clipPath"],
		["feblend", "feBlend"],
		["fecolormatrix", "feColorMatrix"],
		["fecomponenttransfer", "feComponentTransfer"],
		["fecomposite", "feComposite"],
		["feconvolvematrix", "feConvolveMatrix"],
		["fediffuselighting", "feDiffuseLighting"],
		["fedisplacementmap", "feDisplacementMap"],
		["fedistantlight", "feDistantLight"],
		["fedropshadow", "feDropShadow"],
		["feflood", "feFlood"],
		["fefunca", "feFuncA"],
		["fefuncb", "feFuncB"],
		["fefuncg", "feFuncG"],
		["fefuncr", "feFuncR"],
		["fegaussianblur", "feGaussianBlur"],
		["feimage", "feImage"],
		["femerge", "feMerge"],
		["femergenode", "feMergeNode"],
		["femorphology", "feMorphology"],
		["feoffset", "feOffset"],
		["fepointlight", "fePointLight"],
		["fespecularlighting", "feSpecularLighting"],
		["fespotlight", "feSpotLight"],
		["fetile", "feTile"],
		["feturbulence", "feTurbulence"],
		["foreignobject", "foreignObject"],
		["glyphref", "glyphRef"],
		["lineargradient", "linearGradient"],
		["radialgradient", "radialGradient"],
		["textpath", "textPath"]
	]);
	(function(ForeignContext) {
		ForeignContext[ForeignContext["None"] = 0] = "None";
		ForeignContext[ForeignContext["Svg"] = 1] = "Svg";
		ForeignContext[ForeignContext["MathML"] = 2] = "MathML";
	})(ForeignContext || (ForeignContext = {}));
	reNameEnd = /\s|\//;
	Parser = class {
		options;
		/** The start index of the last event. */
		startIndex = 0;
		/** The end index of the last event. */
		endIndex = 0;
		/**
		* Store the start index of the current open tag,
		* so we can update the start index for attributes.
		*/
		openTagStart = 0;
		tagname = "";
		attribname = "";
		attribvalue = "";
		attribs = null;
		stack = [];
		foreignContext;
		cbs;
		lowerCaseTagNames;
		lowerCaseAttributeNames;
		recognizeSelfClosing;
		/** We are parsing HTML. Inverse of the `xmlMode` option. */
		htmlMode;
		tokenizer;
		buffers = [];
		bufferOffset = 0;
		/** The index of the last written buffer. Used when resuming after a `pause()`. */
		writeIndex = 0;
		/** Indicates whether the parser has finished running / `.end` has been called. */
		ended = false;
		constructor(cbs, options = {}) {
			this.options = options;
			this.cbs = cbs ?? {};
			this.htmlMode = !this.options.xmlMode;
			this.lowerCaseTagNames = options.lowerCaseTags ?? this.htmlMode;
			this.lowerCaseAttributeNames = options.lowerCaseAttributeNames ?? this.htmlMode;
			this.recognizeSelfClosing = options.recognizeSelfClosing ?? !this.htmlMode;
			this.tokenizer = new (options.Tokenizer ?? Tokenizer)(this.options, this);
			this.foreignContext = [ForeignContext.None];
			this.cbs.onparserinit?.(this);
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		ontext(start, endIndex) {
			const data = this.getSlice(start, endIndex);
			this.endIndex = endIndex - 1;
			this.cbs.ontext?.(data);
			this.startIndex = endIndex;
		}
		/**
		* @param cp Current Unicode code point.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		ontextentity(cp, endIndex) {
			this.endIndex = endIndex - 1;
			this.cbs.ontext?.(fromCodePoint(cp));
			this.startIndex = endIndex;
		}
		/** @internal */
		isInForeignContext() {
			return this.foreignContext[0] !== ForeignContext.None;
		}
		/**
		* Checks if the current tag is a void element. Override this if you want
		* to specify your own additional void elements.
		* @param name Name of the pseudo selector.
		*/
		isVoidElement(name) {
			return this.htmlMode && voidElements$1.has(name);
		}
		/**
		* Read a tag name from the buffer.
		*
		* When `lowerCaseTagNames` is enabled (the default in HTML mode), the name
		* is lowercased and may be adjusted for SVG casing or the `image` → `img`
		* alias.
		* @param start Start index of the tag name in the buffer.
		* @param endIndex End index of the tag name in the buffer.
		*/
		readTagName(start, endIndex) {
			const name = this.lowerCaseTagNames ? this.getSlice(start, endIndex).toLowerCase() : this.getSlice(start, endIndex);
			if (!(this.lowerCaseTagNames && this.htmlMode)) return name;
			if (this.foreignContext[0] === ForeignContext.Svg) return svgTagNameAdjustments.get(name) ?? name;
			if (this.foreignContext.length > 1) {
				const adjusted = svgTagNameAdjustments.get(name);
				if (adjusted !== void 0 && this.stack.includes(adjusted)) return adjusted;
			}
			if (!this.isInForeignContext()) return name === "image" ? "img" : name;
			return name;
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onopentagname(start, endIndex) {
			this.endIndex = endIndex;
			this.emitOpenTag(this.readTagName(start, endIndex));
		}
		emitOpenTag(name) {
			this.openTagStart = this.startIndex;
			this.tagname = name;
			if (this.htmlMode && name === "form" && this.stack.includes("form")) {
				this.tagname = "";
				return;
			}
			const impliesClose = this.htmlMode && openImpliesClose.get(name);
			if (impliesClose) while (this.stack.length > 0 && impliesClose.has(this.stack[0])) this.popElement(true);
			if (!this.isVoidElement(name)) {
				this.stack.unshift(name);
				if (this.htmlMode) {
					if (name === "svg") this.foreignContext.unshift(ForeignContext.Svg);
					else if (name === "math") this.foreignContext.unshift(ForeignContext.MathML);
					else if (htmlIntegrationElements.has(name)) this.foreignContext.unshift(ForeignContext.None);
				}
			}
			this.cbs.onopentagname?.(name);
			if (this.cbs.onopentag) this.attribs = {};
		}
		endOpenTag(isImplied) {
			this.startIndex = this.openTagStart;
			if (this.attribs) {
				this.cbs.onopentag?.(this.tagname, this.attribs, isImplied);
				this.attribs = null;
			}
			if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) this.cbs.onclosetag(this.tagname, true);
			this.tagname = "";
		}
		/**
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onopentagend(endIndex) {
			this.endIndex = endIndex;
			this.endOpenTag(false);
			this.startIndex = endIndex + 1;
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onclosetag(start, endIndex) {
			this.endIndex = endIndex;
			const name = this.readTagName(start, endIndex);
			if (!this.isVoidElement(name)) {
				const pos = this.stack.indexOf(name);
				if (pos !== -1) {
					for (let index = 0; index < pos; index++) this.popElement(true);
					this.popElement(false);
				} else if (this.htmlMode && name === "p") {
					this.emitOpenTag("p");
					this.closeCurrentTag(true);
				}
			} else if (this.htmlMode && name === "br") {
				this.cbs.onopentagname?.("br");
				this.cbs.onopentag?.("br", {}, true);
				this.cbs.onclosetag?.("br", false);
			}
			this.startIndex = endIndex + 1;
		}
		/**
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onselfclosingtag(endIndex) {
			this.endIndex = endIndex;
			if (this.recognizeSelfClosing || this.isInForeignContext()) {
				this.closeCurrentTag(false);
				this.startIndex = endIndex + 1;
			} else this.onopentagend(endIndex);
		}
		/**
		* Pop the top element off the stack, emit a close event, and maintain
		* the foreign context stack.
		* @param implied Whether this close is implied (not from an explicit end tag).
		*/
		popElement(implied) {
			const element = this.stack.shift();
			if (this.htmlMode && (foreignContextElements.has(element) || htmlIntegrationElements.has(element))) this.foreignContext.shift();
			this.cbs.onclosetag?.(element, implied);
		}
		closeCurrentTag(isOpenImplied) {
			const name = this.tagname;
			this.endOpenTag(isOpenImplied);
			if (this.stack[0] === name) this.popElement(!isOpenImplied);
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onattribname(start, endIndex) {
			this.startIndex = start;
			const name = this.getSlice(start, endIndex);
			this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onattribdata(start, endIndex) {
			this.attribvalue += this.getSlice(start, endIndex);
		}
		/**
		* @param cp Current Unicode code point.
		* @internal
		*/
		onattribentity(cp) {
			this.attribvalue += fromCodePoint(cp);
		}
		/**
		* @param quote Quote type used for the current attribute.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onattribend(quote, endIndex) {
			this.endIndex = endIndex;
			this.cbs.onattribute?.(this.attribname, this.attribvalue, quote === QuoteType.Double ? "\"" : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
			if (this.attribs && !Object.hasOwn(this.attribs, this.attribname)) this.attribs[this.attribname] = this.attribvalue;
			this.attribvalue = "";
		}
		getInstructionName(value) {
			const index = value.search(reNameEnd);
			let name = index < 0 ? value : value.substr(0, index);
			if (this.lowerCaseTagNames) name = name.toLowerCase();
			return name;
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		ondeclaration(start, endIndex) {
			this.endIndex = endIndex;
			const value = this.getSlice(start, endIndex);
			if (this.cbs.onprocessinginstruction) {
				const name = this.htmlMode ? this.lowerCaseTagNames ? DOCUMENT_TYPE : value.slice(0, 7) : this.getInstructionName(value);
				this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
			}
			this.startIndex = endIndex + 1;
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @internal
		*/
		onprocessinginstruction(start, endIndex) {
			this.endIndex = endIndex;
			const value = this.getSlice(start, endIndex);
			if (this.cbs.onprocessinginstruction) {
				const name = this.getInstructionName(value);
				this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
			}
			this.startIndex = endIndex + 1;
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @param offset Offset applied when computing parser indices.
		* @internal
		*/
		oncomment(start, endIndex, offset) {
			this.endIndex = endIndex;
			this.cbs.oncomment?.(this.getSlice(start, endIndex - offset));
			this.cbs.oncommentend?.();
			this.startIndex = endIndex + 1;
		}
		/**
		* @param start Start index for the current parser event.
		* @param endIndex End index for the current parser event.
		* @param offset Offset applied when computing parser indices.
		* @internal
		*/
		oncdata(start, endIndex, offset) {
			this.endIndex = endIndex;
			const value = this.getSlice(start, endIndex - offset);
			if (!this.htmlMode || this.options.recognizeCDATA) {
				this.cbs.oncdatastart?.();
				this.cbs.ontext?.(value);
				this.cbs.oncdataend?.();
			} else if (this.isInForeignContext()) this.cbs.ontext?.(value);
			else {
				this.cbs.oncomment?.(`[CDATA[${value}]]`);
				this.cbs.oncommentend?.();
			}
			this.startIndex = endIndex + 1;
		}
		/** @internal */
		onend() {
			if (this.cbs.onclosetag) {
				this.endIndex = this.startIndex;
				for (let index = 0; index < this.stack.length; index++) this.cbs.onclosetag(this.stack[index], true);
			}
			this.cbs.onend?.();
		}
		/**
		* Resets the parser to a blank state, ready to parse a new HTML document
		*/
		reset() {
			this.cbs.onreset?.();
			this.tokenizer.reset();
			this.tagname = "";
			this.attribname = "";
			this.attribvalue = "";
			this.attribs = null;
			this.stack.length = 0;
			this.startIndex = 0;
			this.endIndex = 0;
			this.cbs.onparserinit?.(this);
			this.buffers.length = 0;
			this.foreignContext.length = 0;
			this.foreignContext.unshift(ForeignContext.None);
			this.bufferOffset = 0;
			this.writeIndex = 0;
			this.ended = false;
		}
		/**
		* Resets the parser, then parses a complete document and
		* pushes it to the handler.
		* @param data Document to parse.
		*/
		parseComplete(data) {
			this.reset();
			this.end(data);
		}
		getSlice(start, end) {
			if (start === end) return "";
			while (start - this.bufferOffset >= this.buffers[0].length) this.shiftBuffer();
			let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
			while (end - this.bufferOffset > this.buffers[0].length) {
				this.shiftBuffer();
				slice += this.buffers[0].slice(0, end - this.bufferOffset);
			}
			return slice;
		}
		shiftBuffer() {
			this.bufferOffset += this.buffers[0].length;
			this.writeIndex--;
			this.buffers.shift();
		}
		/**
		* Parses a chunk of data and calls the corresponding callbacks.
		* @param chunk Chunk to parse.
		*/
		write(chunk) {
			if (this.ended) {
				this.cbs.onerror?.(/* @__PURE__ */ new Error(".write() after done!"));
				return;
			}
			this.buffers.push(chunk);
			if (this.tokenizer.running) {
				this.tokenizer.write(chunk);
				this.writeIndex++;
			}
		}
		/**
		* Parses the end of the buffer and clears the stack, calls onend.
		* @param chunk Optional final chunk to parse.
		*/
		end(chunk) {
			if (this.ended) {
				this.cbs.onerror?.(/* @__PURE__ */ new Error(".end() after done!"));
				return;
			}
			if (chunk) this.write(chunk);
			this.ended = true;
			this.tokenizer.end();
		}
		/**
		* Pauses parsing. The parser won't emit events until `resume` is called.
		*/
		pause() {
			this.tokenizer.pause();
		}
		/**
		* Resumes parsing after `pause` was called.
		*/
		resume() {
			this.tokenizer.resume();
			while (this.tokenizer.running && this.writeIndex < this.buffers.length) this.tokenizer.write(this.buffers[this.writeIndex++]);
			if (this.ended) this.tokenizer.end();
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/domelementtype@3.0.0/node_modules/domelementtype/dist/index.js
var dist_exports$2 = /* @__PURE__ */ __exportAll({
	CDATA: () => CDATA$1,
	Comment: () => Comment$1,
	Directive: () => Directive,
	Doctype: () => Doctype,
	ElementType: () => ElementType,
	Root: () => Root,
	Script: () => Script,
	Style: () => Style,
	Tag: () => Tag,
	Text: () => Text$1,
	isTag: () => isTag$1
});
/**
* Tests whether an element is a tag or not.
* @param element Element to test
* @param element.type Node type discriminator to check.
*/
function isTag$1(element) {
	return element.type === ElementType.Tag || element.type === ElementType.Script || element.type === ElementType.Style;
}
var ElementType, Root, Text$1, Directive, Comment$1, Script, Style, Tag, CDATA$1, Doctype;
var init_dist$5 = __esmMin((() => {
	(function(ElementType) {
		/** Type for the root element of a document */
		ElementType["Root"] = "root";
		/** Type for Text */
		ElementType["Text"] = "text";
		/** Type for <? ... ?> */
		ElementType["Directive"] = "directive";
		/** Type for <!-- ... --> */
		ElementType["Comment"] = "comment";
		/** Type for <script> tags */
		ElementType["Script"] = "script";
		/** Type for <style> tags */
		ElementType["Style"] = "style";
		/** Type for Any tag */
		ElementType["Tag"] = "tag";
		/** Type for <![CDATA[ ... ]]> */
		ElementType["CDATA"] = "cdata";
		/** Type for <!doctype ...> */
		ElementType["Doctype"] = "doctype";
	})(ElementType || (ElementType = {}));
	Root = ElementType.Root;
	Text$1 = ElementType.Text;
	Directive = ElementType.Directive;
	Comment$1 = ElementType.Comment;
	Script = ElementType.Script;
	Style = ElementType.Style;
	Tag = ElementType.Tag;
	CDATA$1 = ElementType.CDATA;
	Doctype = ElementType.Doctype;
}));
//#endregion
//#region node_modules/.pnpm/domhandler@6.0.1/node_modules/domhandler/dist/node.js
/**
* Checks if `node` is an element node.
* @param node Node to check.
* @returns `true` if the node is an element node.
*/
function isTag(node) {
	return isTag$1(node);
}
/**
* Checks if `node` is a CDATA node.
* @param node Node to check.
* @returns `true` if the node is a CDATA node.
*/
function isCDATA(node) {
	return node.type === ElementType.CDATA;
}
/**
* Checks if `node` is a text node.
* @param node Node to check.
* @returns `true` if the node is a text node.
*/
function isText(node) {
	return node.type === ElementType.Text;
}
/**
* Checks if `node` is a comment node.
* @param node Node to check.
* @returns `true` if the node is a comment node.
*/
function isComment(node) {
	return node.type === ElementType.Comment;
}
/**
* Checks if `node` is a directive node.
* @param node Node to check.
* @returns `true` if the node is a directive node.
*/
function isDirective(node) {
	return node.type === ElementType.Directive;
}
/**
* Checks if `node` is a document node.
* @param node Node to check.
* @returns `true` if the node is a document node.
*/
function isDocument(node) {
	return node.type === ElementType.Root;
}
/**
* Checks if `node` has children.
* @param node Node to check.
* @returns `true` if the node has children.
*/
function hasChildren(node) {
	return Object.hasOwn(node, "children");
}
/**
* Clone a node, and optionally its children.
* @param node Node to clone.
* @param recursive Clone child nodes as well.
* @returns A clone of the node.
*/
function cloneNode(node, recursive = false) {
	let result;
	if (isText(node)) result = new Text(node.data);
	else if (isComment(node)) result = new Comment(node.data);
	else if (isTag(node)) {
		const children = recursive ? cloneChildren(node.children) : [];
		const clone = new Element(node.name, { ...node.attribs }, children);
		for (const child of children) child.parent = clone;
		if (node.namespace != null) clone.namespace = node.namespace;
		if (node["x-attribsNamespace"]) clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
		if (node["x-attribsPrefix"]) clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
		result = clone;
	} else if (isCDATA(node)) {
		const children = recursive ? cloneChildren(node.children) : [];
		const clone = new CDATA(children);
		for (const child of children) child.parent = clone;
		result = clone;
	} else if (isDocument(node)) {
		const children = recursive ? cloneChildren(node.children) : [];
		const clone = new Document(children);
		for (const child of children) child.parent = clone;
		if (node["x-mode"]) clone["x-mode"] = node["x-mode"];
		result = clone;
	} else if (isDirective(node)) {
		const instruction = new ProcessingInstruction(node.name, node.data);
		if (node["x-name"] != null) {
			instruction["x-name"] = node["x-name"];
			instruction["x-publicId"] = node["x-publicId"];
			instruction["x-systemId"] = node["x-systemId"];
		}
		result = instruction;
	} else throw new Error(`Not implemented yet: ${node.type}`);
	result.startIndex = node.startIndex;
	result.endIndex = node.endIndex;
	if (node.sourceCodeLocation != null) result.sourceCodeLocation = node.sourceCodeLocation;
	return result;
}
/**
* Clone a list of child nodes.
* @param childs The child nodes to clone.
* @returns A list of cloned child nodes.
*/
function cloneChildren(childs) {
	const children = childs.map((child) => cloneNode(child, true));
	for (let index = 1; index < children.length; index++) {
		children[index].prev = children[index - 1];
		children[index - 1].next = children[index];
	}
	return children;
}
var Node, DataNode, Text, Comment, ProcessingInstruction, NodeWithChildren, CDATA, Document, Element;
var init_node = __esmMin((() => {
	init_dist$5();
	Node = class {
		/** Parent of the node */
		parent = null;
		/** Previous sibling */
		prev = null;
		/** Next sibling */
		next = null;
		/** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
		startIndex = null;
		/** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
		endIndex = null;
		/**
		* Same as {@link parent}.
		* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
		*/
		get parentNode() {
			return this.parent;
		}
		set parentNode(parent) {
			this.parent = parent;
		}
		/**
		* Same as {@link prev}.
		* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
		*/
		get previousSibling() {
			return this.prev;
		}
		set previousSibling(previous) {
			this.prev = previous;
		}
		/**
		* Same as {@link next}.
		* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
		*/
		get nextSibling() {
			return this.next;
		}
		set nextSibling(next) {
			this.next = next;
		}
		/**
		* Clone this node, and optionally its children.
		* @param recursive Clone child nodes as well.
		* @returns A clone of the node.
		*/
		cloneNode(recursive = false) {
			return cloneNode(this, recursive);
		}
	};
	DataNode = class extends Node {
		data;
		/**
		* @param data The content of the data node
		*/
		constructor(data) {
			super();
			this.data = data;
		}
		/**
		* Same as {@link data}.
		* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
		*/
		get nodeValue() {
			return this.data;
		}
		set nodeValue(data) {
			this.data = data;
		}
	};
	Text = class extends DataNode {
		type = ElementType.Text;
		get nodeType() {
			return 3;
		}
	};
	Comment = class extends DataNode {
		type = ElementType.Comment;
		get nodeType() {
			return 8;
		}
	};
	ProcessingInstruction = class extends DataNode {
		type = ElementType.Directive;
		name;
		constructor(name, data) {
			super(data);
			this.name = name;
		}
		get nodeType() {
			return 1;
		}
		/** If this is a doctype, the document type name (parse5 only). */
		"x-name";
		/** If this is a doctype, the document type public identifier (parse5 only). */
		"x-publicId";
		/** If this is a doctype, the document type system identifier (parse5 only). */
		"x-systemId";
	};
	NodeWithChildren = class extends Node {
		children;
		/**
		* @param children Children of the node. Only certain node types can have children.
		*/
		constructor(children) {
			super();
			this.children = children;
		}
		/** First child of the node. */
		get firstChild() {
			return this.children[0] ?? null;
		}
		/** Last child of the node. */
		get lastChild() {
			return this.children.length > 0 ? this.children[this.children.length - 1] : null;
		}
		/**
		* Same as {@link children}.
		* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
		*/
		get childNodes() {
			return this.children;
		}
		set childNodes(children) {
			this.children = children;
		}
	};
	CDATA = class extends NodeWithChildren {
		type = ElementType.CDATA;
		get nodeType() {
			return 4;
		}
	};
	Document = class extends NodeWithChildren {
		type = ElementType.Root;
		get nodeType() {
			return 9;
		}
	};
	Element = class extends NodeWithChildren {
		name;
		attribs;
		type;
		/**
		* @param name Name of the tag, eg. `div`, `span`.
		* @param attribs Object mapping attribute names to attribute values.
		* @param children Children of the node.
		* @param type Node type used for the new node instance.
		*/
		constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
			super(children);
			this.name = name;
			this.attribs = attribs;
			this.type = type;
		}
		get nodeType() {
			return 1;
		}
		/**
		* Same as {@link name}.
		* [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
		*/
		get tagName() {
			return this.name;
		}
		set tagName(name) {
			this.name = name;
		}
		get attributes() {
			return Object.keys(this.attribs).map((name) => ({
				name,
				value: this.attribs[name],
				namespace: this["x-attribsNamespace"]?.[name],
				prefix: this["x-attribsPrefix"]?.[name]
			}));
		}
		/** Element namespace (parse5 only). */
		namespace;
		/** Element attribute namespaces (parse5 only). */
		"x-attribsNamespace";
		/** Element attribute namespace-related prefixes (parse5 only). */
		"x-attribsPrefix";
	};
}));
//#endregion
//#region node_modules/.pnpm/domhandler@6.0.1/node_modules/domhandler/dist/index.js
var defaultOptions, DomHandler;
var init_dist$4 = __esmMin((() => {
	init_dist$5();
	init_node();
	init_node();
	defaultOptions = {
		withStartIndices: false,
		withEndIndices: false,
		xmlMode: false
	};
	DomHandler = class {
		/** The elements of the DOM */
		dom = [];
		/** The root element for the DOM */
		root = new Document(this.dom);
		/** Called once parsing has completed. */
		callback;
		/** Settings for the handler. */
		options;
		/** Callback whenever a tag is closed. */
		elementCB;
		/** Indicated whether parsing has been completed. */
		done = false;
		/** Stack of open tags. */
		tagStack = [this.root];
		/** A data node that is still being written to. */
		lastNode = null;
		/** Reference to the parser instance. Used for location information. */
		parser = null;
		/**
		* @param callback Called once parsing has completed.
		* @param options Settings for the handler.
		* @param elementCB Callback whenever a tag is closed.
		*/
		constructor(callback, options, elementCB) {
			if (typeof options === "function") {
				elementCB = options;
				options = defaultOptions;
			}
			if (typeof callback === "object") {
				options = callback;
				callback = void 0;
			}
			this.callback = callback ?? null;
			this.options = options ?? defaultOptions;
			this.elementCB = elementCB ?? null;
		}
		onparserinit(parser) {
			this.parser = parser;
		}
		onreset() {
			this.dom = [];
			this.root = new Document(this.dom);
			this.done = false;
			this.tagStack = [this.root];
			this.lastNode = null;
			this.parser = null;
		}
		onend() {
			if (this.done) return;
			this.done = true;
			this.parser = null;
			this.handleCallback(null);
		}
		onerror(error) {
			this.handleCallback(error);
		}
		onclosetag() {
			this.lastNode = null;
			const element = this.tagStack.pop();
			if (this.options.withEndIndices && this.parser) element.endIndex = this.parser.endIndex;
			if (this.elementCB) this.elementCB(element);
		}
		onopentag(name, attribs) {
			const type = this.options.xmlMode ? ElementType.Tag : void 0;
			const element = new Element(name, attribs, void 0, type);
			this.addNode(element);
			this.tagStack.push(element);
		}
		ontext(data) {
			const { lastNode } = this;
			if (lastNode && lastNode.type === ElementType.Text) {
				lastNode.data += data;
				if (this.options.withEndIndices && this.parser) lastNode.endIndex = this.parser.endIndex;
			} else {
				const node = new Text(data);
				this.addNode(node);
				this.lastNode = node;
			}
		}
		oncomment(data) {
			if (this.lastNode && this.lastNode.type === ElementType.Comment) {
				this.lastNode.data += data;
				return;
			}
			const node = new Comment(data);
			this.addNode(node);
			this.lastNode = node;
		}
		oncommentend() {
			this.lastNode = null;
		}
		oncdatastart() {
			const text = new Text("");
			const node = new CDATA([text]);
			this.addNode(node);
			text.parent = node;
			this.lastNode = text;
		}
		oncdataend() {
			this.lastNode = null;
		}
		onprocessinginstruction(name, data) {
			const node = new ProcessingInstruction(name, data);
			this.addNode(node);
		}
		handleCallback(error) {
			if (typeof this.callback === "function") this.callback(error, this.dom);
			else if (error) throw error;
		}
		addNode(node) {
			const parent = this.tagStack[this.tagStack.length - 1];
			const previousSibling = parent.children[parent.children.length - 1];
			if (this.options.withStartIndices && this.parser) node.startIndex = this.parser.startIndex;
			if (this.options.withEndIndices && this.parser) node.endIndex = this.parser.endIndex;
			parent.children.push(node);
			if (previousSibling) {
				node.prev = previousSibling;
				previousSibling.next = node;
			}
			node.parent = parent;
			this.lastNode = null;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/querying.js
/**
* Search a node and its children for nodes passing a test function. If `node` is not an array, it will be wrapped in one.
*
* @category Querying
* @param test Function to test nodes on.
* @param node Node to search. Will be included in the result set if it matches.
* @param recurse Also consider child nodes.
* @param limit Maximum number of nodes to return.
* @returns All nodes passing `test`.
*/
function filter(test, node, recurse = true, limit = Number.POSITIVE_INFINITY) {
	return find(test, Array.isArray(node) ? node : [node], recurse, limit);
}
/**
* Search an array of nodes and their children for nodes passing a test function.
*
* @category Querying
* @param test Function to test nodes on.
* @param nodes Array of nodes to search.
* @param recurse Also consider child nodes.
* @param limit Maximum number of nodes to return.
* @returns All nodes passing `test`.
*/
function find(test, nodes, recurse, limit) {
	const result = [];
	/** Stack of the arrays we are looking at. */
	const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
	/** Stack of the indices within the arrays. */
	const indexStack = [0];
	for (;;) {
		if (indexStack[0] >= nodeStack[0].length) {
			if (indexStack.length === 1) return result;
			nodeStack.shift();
			indexStack.shift();
			continue;
		}
		const element = nodeStack[0][indexStack[0]++];
		if (test(element)) {
			result.push(element);
			if (--limit <= 0) return result;
		}
		if (recurse && hasChildren(element) && element.children.length > 0) {
			indexStack.unshift(0);
			nodeStack.unshift(element.children);
		}
	}
}
/**
* Finds one element in a tree that passes a test.
*
* @category Querying
* @param test Function to test nodes on.
* @param nodes Node or array of nodes to search.
* @param recurse Also consider child nodes.
* @returns The first node that passes `test`.
*/
function findOne(test, nodes, recurse = true) {
	const searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
	for (const node of searchedNodes) {
		if (isTag(node) && test(node)) return node;
		if (recurse && hasChildren(node) && node.children.length > 0) {
			const found = findOne(test, node.children, true);
			if (found) return found;
		}
	}
	return null;
}
/**
* Checks if a tree of nodes contains at least one node passing a test.
*
* @category Querying
* @param test Function to test nodes on.
* @param nodes Array of nodes to search.
* @returns Whether a tree of nodes contains at least one node passing the test.
*/
function existsOne(test, nodes) {
	return (Array.isArray(nodes) ? nodes : [nodes]).some((node) => isTag(node) && test(node) || hasChildren(node) && existsOne(test, node.children));
}
/**
* Search an array of nodes and their children for elements passing a test function.
*
* Same as `find`, but limited to elements and with less options, leading to reduced complexity.
*
* @category Querying
* @param test Function to test nodes on.
* @param nodes Array of nodes to search.
* @returns All nodes passing `test`.
*/
function findAll(test, nodes) {
	const result = [];
	const nodeStack = [Array.isArray(nodes) ? nodes : [nodes]];
	const indexStack = [0];
	for (;;) {
		if (indexStack[0] >= nodeStack[0].length) {
			if (nodeStack.length === 1) return result;
			nodeStack.shift();
			indexStack.shift();
			continue;
		}
		const element = nodeStack[0][indexStack[0]++];
		if (isTag(element) && test(element)) result.push(element);
		if (hasChildren(element) && element.children.length > 0) {
			indexStack.unshift(0);
			nodeStack.unshift(element.children);
		}
	}
}
var init_querying = __esmMin((() => {
	init_dist$4();
}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/legacy.js
/**
* Returns a function to check whether a node has an attribute with a particular
* value.
*
* @param attrib Attribute to check.
* @param value Attribute value to look for.
* @returns A function to check whether the a node has an attribute with a
*   particular value.
*/
function getAttribCheck(attrib, value) {
	if (typeof value === "function") return (element) => isTag(element) && value(element.attribs[attrib]);
	return (element) => isTag(element) && element.attribs[attrib] === value;
}
/**
* Returns a function that returns `true` if either of the input functions
* returns `true` for a node.
*
* @param a First function to combine.
* @param b Second function to combine.
* @returns A function taking a node and returning `true` if either of the input
*   functions returns `true` for the node.
*/
function combineFuncs(a, b) {
	return (element) => a(element) || b(element);
}
/**
* Returns a function that executes all checks in `options` and returns `true`
* if any of them match a node.
*
* @param options An object describing nodes to look for.
* @returns A function that executes all checks in `options` and returns `true`
*   if any of them match a node.
*/
function compileTest(options) {
	const funcs = Object.keys(options).map((key) => {
		const value = options[key];
		return Object.hasOwn(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
	});
	return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
/**
* Checks whether a node matches the description in `options`.
*
* @category Legacy Query Functions
* @param options An object describing nodes to look for.
* @param node The element to test.
* @returns Whether the element matches the description in `options`.
*/
function testElement(options, node) {
	const test = compileTest(options);
	return test ? test(node) : true;
}
/**
* Returns all nodes that match `options`.
*
* @category Legacy Query Functions
* @param options An object describing nodes to look for.
* @param nodes Nodes to search through.
* @param recurse Also consider child nodes.
* @param limit Maximum number of nodes to return.
* @returns All nodes that match `options`.
*/
function getElements(options, nodes, recurse, limit = Number.POSITIVE_INFINITY) {
	const test = compileTest(options);
	return test ? filter(test, nodes, recurse, limit) : [];
}
/**
* Returns the node with the supplied ID.
*
* @category Legacy Query Functions
* @param id The unique ID attribute value to look for.
* @param nodes Nodes to search through.
* @param recurse Also consider child nodes.
* @returns The node with the supplied ID.
*/
function getElementById(id, nodes, recurse = true) {
	if (!Array.isArray(nodes)) nodes = [nodes];
	return findOne(getAttribCheck("id", id), nodes, recurse);
}
/**
* Returns all nodes with the supplied `tagName`.
*
* @category Legacy Query Functions
* @param tagName Tag name to search for.
* @param nodes Nodes to search through.
* @param recurse Also consider child nodes.
* @param limit Maximum number of nodes to return.
* @returns All nodes with the supplied `tagName`.
*/
function getElementsByTagName(tagName, nodes, recurse = true, limit = Number.POSITIVE_INFINITY) {
	return filter(Checks["tag_name"](tagName), nodes, recurse, limit);
}
/**
* Returns all nodes with the supplied `className`.
*
* @category Legacy Query Functions
* @param className Class name to search for.
* @param nodes Nodes to search through.
* @param recurse Also consider child nodes.
* @param limit Maximum number of nodes to return.
* @returns All nodes with the supplied `className`.
*/
function getElementsByClassName(className, nodes, recurse = true, limit = Number.POSITIVE_INFINITY) {
	return filter(getAttribCheck("class", className), nodes, recurse, limit);
}
/**
* Returns all nodes with the supplied `type`.
*
* @category Legacy Query Functions
* @param type Element type to look for.
* @param nodes Nodes to search through.
* @param recurse Also consider child nodes.
* @param limit Maximum number of nodes to return.
* @returns All nodes with the supplied `type`.
*/
function getElementsByTagType(type, nodes, recurse = true, limit = Number.POSITIVE_INFINITY) {
	return filter(Checks["tag_type"](type), nodes, recurse, limit);
}
var Checks;
var init_legacy = __esmMin((() => {
	init_dist$4();
	init_querying();
	Checks = {
		tag_name(name) {
			if (typeof name === "function") return (element) => isTag(element) && name(element.name);
			if (name === "*") return isTag;
			return (element) => isTag(element) && element.name === name;
		},
		tag_type(type) {
			if (typeof type === "function") return (element) => type(element.type);
			return (element) => element.type === type;
		},
		tag_contains(data) {
			if (typeof data === "function") return (element) => isText(element) && data(element.data);
			return (element) => isText(element) && element.data === data;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/escape.js
/**
* Encodes all non-ASCII characters, as well as characters not valid in XML
* documents using XML entities. Uses a fast bitset scan instead of RegExp.
*
* If a character has no equivalent entity, a numeric hexadecimal reference
* (eg. `&#xfc;`) will be used.
* @param input Input string to encode or decode.
*/
function encodeXML(input) {
	let out;
	let last = 0;
	const { length } = input;
	for (let index = 0; index < length; index++) {
		const char = input.charCodeAt(index);
		if (char < 128 && ((1342177476 >>> char & 1) === 0 || char >= 64 || char < 32)) continue;
		if (out === void 0) out = input.substring(0, index);
		else if (last !== index) out += input.substring(last, index);
		if (char < 64) {
			out += xmlCodeMap.get(char);
			last = index + 1;
			continue;
		}
		const cp = getCodePoint(input, index);
		out += `&#x${cp.toString(16)};`;
		if (cp !== char) index++;
		last = index + 1;
	}
	if (out === void 0) return input;
	if (last < length) out += input.substr(last);
	return out;
}
/**
* Creates a function that escapes all characters matched by the given regular
* expression using the given map of characters to escape to their entities.
* @param regex Regular expression to match characters to escape.
* @param map Map of characters to escape to their entities.
* @returns Function that escapes all characters matched by the given regular
* expression using the given map of characters to escape to their entities.
*/
function getEscaper(regex, map) {
	return function escape(data) {
		let match;
		let lastIndex = 0;
		let result = "";
		while (match = regex.exec(data)) {
			if (lastIndex !== match.index) result += data.substring(lastIndex, match.index);
			result += map.get(match[0].charCodeAt(0));
			lastIndex = match.index + 1;
		}
		return result + data.substring(lastIndex);
	};
}
var xmlCodeMap, getCodePoint, escapeAttribute, escapeText;
var init_escape = __esmMin((() => {
	xmlCodeMap = /* @__PURE__ */ new Map([
		[34, "&quot;"],
		[38, "&amp;"],
		[39, "&apos;"],
		[60, "&lt;"],
		[62, "&gt;"]
	]);
	getCodePoint = typeof String.prototype.codePointAt === "function" ? (input, index) => input.codePointAt(index) : (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index);
	escapeAttribute = /* #__PURE__ */ getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
		[34, "&quot;"],
		[38, "&amp;"],
		[160, "&nbsp;"]
	]));
	escapeText = /* #__PURE__ */ getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
		[38, "&amp;"],
		[60, "&lt;"],
		[62, "&gt;"],
		[160, "&nbsp;"]
	]));
}));
//#endregion
//#region node_modules/.pnpm/entities@8.0.0/node_modules/entities/dist/index.js
var init_dist$3 = __esmMin((() => {
	init_decode();
	init_escape();
}));
//#endregion
//#region node_modules/.pnpm/dom-serializer@3.1.1/node_modules/dom-serializer/dist/foreign-names.js
var elementNames, attributeNames;
var init_foreign_names = __esmMin((() => {
	elementNames = new Map("altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath".split(" ").map((name) => [name.toLowerCase(), name]));
	attributeNames = new Map("definitionURL attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits diffuseConstant edgeMode filterUnits glyphRef gradientTransform gradientUnits kernelMatrix kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent spreadMethod startOffset stdDeviation stitchTiles surfaceScale systemLanguage tableValues targetX targetY textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan".split(" ").map((name) => [name.toLowerCase(), name]));
}));
//#endregion
//#region node_modules/.pnpm/dom-serializer@3.1.1/node_modules/dom-serializer/dist/index.js
/**
* Renders a DOM node or an array of DOM nodes to a string.
*
* Can be thought of as the equivalent of the `outerHTML` of the passed
* node(s).
* @param node Node to be rendered.
* @param options Changes serialization behavior
*/
function render(node, options = {}) {
	const nodes = "length" in node ? node : [node];
	const xmlMode = options.xmlMode ?? false;
	let output = "";
	for (let index = 0; index < nodes.length; index++) output += renderNode(nodes[index], options, xmlMode);
	return output;
}
/**
* Render an array of child nodes (skips the single-node wrapping in `render`).
* @param children The child nodes to render.
* @param options The serialization options.
* @param xmlMode The XML mode to use.
*/
function renderChildren(children, options, xmlMode) {
	let output = "";
	for (let index = 0; index < children.length; index++) output += renderNode(children[index], options, xmlMode);
	return output;
}
function renderNode(node, options, xmlMode) {
	switch (node.type) {
		case Root: return renderChildren(node.children, options, xmlMode);
		case Directive: return `<${node.data}>`;
		case Comment$1: return `<!--${node.data}-->`;
		case CDATA$1: return `<![CDATA[${node.children[0].data}]]>`;
		case Script:
		case Style:
		case Tag: return renderTag(node, options, xmlMode);
		case Text$1: {
			const element = node;
			const data = element.data || "";
			if ((options.encodeEntities ?? options.decodeEntities) !== false && !(!xmlMode && element.parent && unencodedElements.has(element.parent.name))) return xmlMode || options.encodeEntities !== "utf8" ? encodeXML(data) : escapeText(data);
			return data;
		}
	}
}
function renderTag(element, options, xmlMode) {
	if (xmlMode === "foreign") {
		element.name = elementNames.get(element.name) ?? element.name;
		if (element.parent && foreignModeIntegrationPoints.has(element.parent.name)) xmlMode = false;
	}
	if (!xmlMode && foreignElements.has(element.name)) xmlMode = "foreign";
	const { name, children } = element;
	const isVoid = !xmlMode && voidElements.has(name);
	let tag = `<${name}${formatAttributes(element.attribs, options, xmlMode)}`;
	if (children.length === 0 && (xmlMode ? options.selfClosingTags !== false : options.selfClosingTags && isVoid)) tag += xmlMode ? "/>" : " />";
	else {
		tag += ">";
		if (children.length > 0) tag += renderChildren(children, options, xmlMode);
		if (!isVoid) tag += `</${name}>`;
	}
	return tag;
}
function replaceQuotes(value) {
	return value.replaceAll("\"", "&quot;");
}
/**
* Serialize an element's attribute map to a string.
*
* Returns a string with a leading space before each attribute, or an
* empty string if there are no attributes. This convention lets the
* caller unconditionally concatenate the result onto the tag name.
* @param attributes
* @param options
* @param xmlMode
*/
function formatAttributes(attributes, options, xmlMode) {
	if (!attributes) return "";
	const encode = (options.encodeEntities ?? options.decodeEntities) === false ? replaceQuotes : xmlMode || options.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
	const isForeign = xmlMode === "foreign";
	const showEmpty = !!(options.emptyAttrs ?? xmlMode);
	let result = "";
	for (const key in attributes) {
		if (!Object.hasOwn(attributes, key)) continue;
		const value = attributes[key];
		const k = isForeign ? attributeNames.get(key) ?? key : key;
		result += !showEmpty && (value == null || value === "") ? ` ${k}` : ` ${k}="${encode(value == null ? "" : String(value))}"`;
	}
	return result;
}
var unencodedElements, voidElements, foreignElements, foreignModeIntegrationPoints;
var init_dist$2 = __esmMin((() => {
	init_dist$5();
	init_dist$3();
	init_foreign_names();
	unencodedElements = new Set("style script xmp iframe noembed noframes plaintext noscript".split(" "));
	voidElements = new Set("area base basefont br col command embed frame hr img input isindex keygen link meta param source track wbr".split(" "));
	foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
	foreignModeIntegrationPoints = new Set("mi mo mn ms mtext annotation-xml foreignObject desc title".split(" "));
}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/stringify.js
/**
* @category Stringify
* @deprecated Use the `dom-serializer` module directly.
* @param node Node to get the outer HTML of.
* @param options Options for serialization.
* @returns `node`'s outer HTML.
*/
function getOuterHTML(node, options) {
	return render(node, options);
}
/**
* @category Stringify
* @deprecated Use the `dom-serializer` module directly.
* @param node Node to get the inner HTML of.
* @param options Options for serialization.
* @returns `node`'s inner HTML.
*/
function getInnerHTML(node, options) {
	return hasChildren(node) ? node.children.map((node) => getOuterHTML(node, options)).join("") : "";
}
/**
* Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags. Ignores comments.
*
* @category Stringify
* @deprecated Use `textContent` instead.
* @param node Node to get the inner text of.
* @returns `node`'s inner text.
*/
function getText(node) {
	if (Array.isArray(node)) return node.map(getText).join("");
	if (isTag(node)) return node.name === "br" ? "\n" : getText(node.children);
	if (isCDATA(node)) return getText(node.children);
	if (isText(node)) return node.data;
	return "";
}
/**
* Get a node's text content. Ignores comments.
*
* @category Stringify
* @param node Node to get the text content of.
* @returns `node`'s text content.
* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
*/
function textContent(node) {
	if (Array.isArray(node)) return node.map(textContent).join("");
	if (hasChildren(node) && !isComment(node)) return textContent(node.children);
	if (isText(node)) return node.data;
	return "";
}
/**
* Get a node's inner text, ignoring `<script>` and `<style>` tags. Ignores comments.
*
* @category Stringify
* @param node Node to get the inner text of.
* @returns `node`'s inner text.
* @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
*/
function innerText(node) {
	if (Array.isArray(node)) return node.map(innerText).join("");
	if (hasChildren(node) && (node.type === ElementType.Tag || isCDATA(node))) return innerText(node.children);
	if (isText(node)) return node.data;
	return "";
}
var init_stringify = __esmMin((() => {
	init_dist$2();
	init_dist$5();
	init_dist$4();
}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/feeds.js
/**
* Get the feed object from the root of a DOM tree.
*
* @category Feeds
* @param document The DOM to extract the feed from.
* @returns The feed.
*/
function getFeed(document) {
	const feedRoot = getOneElement(isValidFeed, document);
	return feedRoot ? feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot) : null;
}
/**
* Parse an Atom feed.
*
* @param feedRoot The root of the feed.
* @returns The parsed feed.
*/
function getAtomFeed(feedRoot) {
	const childs = feedRoot.children;
	const feed = {
		type: "atom",
		items: getElementsByTagName("entry", childs).map((item) => {
			const { children } = item;
			const entry = { media: getMediaElements(children) };
			addConditionally(entry, "id", "id", children);
			addConditionally(entry, "title", "title", children);
			const href = getOneElement("link", children)?.attribs["href"];
			if (href) entry.link = href;
			const description = fetch("summary", children) || fetch("content", children);
			if (description) entry.description = description;
			const pubDate = fetch("updated", children);
			if (pubDate) entry.pubDate = new Date(pubDate);
			return entry;
		})
	};
	addConditionally(feed, "id", "id", childs);
	addConditionally(feed, "title", "title", childs);
	const href = getOneElement("link", childs)?.attribs["href"];
	if (href) feed.link = href;
	addConditionally(feed, "description", "subtitle", childs);
	const updated = fetch("updated", childs);
	if (updated) feed.updated = new Date(updated);
	addConditionally(feed, "author", "email", childs, true);
	return feed;
}
/**
* Parse a RSS feed.
*
* @param feedRoot The root of the feed.
* @returns The parsed feed.
*/
function getRssFeed(feedRoot) {
	const childs = getOneElement("channel", feedRoot.children)?.children ?? [];
	const feed = {
		type: feedRoot.name.substr(0, 3),
		id: "",
		items: getElementsByTagName("item", feedRoot.children).map((item) => {
			const { children } = item;
			const entry = { media: getMediaElements(children) };
			addConditionally(entry, "id", "guid", children);
			addConditionally(entry, "title", "title", children);
			addConditionally(entry, "link", "link", children);
			addConditionally(entry, "description", "description", children);
			const pubDate = fetch("pubDate", children) || fetch("dc:date", children);
			if (pubDate) entry.pubDate = new Date(pubDate);
			return entry;
		})
	};
	addConditionally(feed, "title", "title", childs);
	addConditionally(feed, "link", "link", childs);
	addConditionally(feed, "description", "description", childs);
	const updated = fetch("lastBuildDate", childs);
	if (updated) feed.updated = new Date(updated);
	addConditionally(feed, "author", "managingEditor", childs, true);
	return feed;
}
/**
* Get all media elements of a feed item.
*
* @param where Nodes to search in.
* @returns Media elements.
*/
function getMediaElements(where) {
	return getElementsByTagName("media:content", where).map((element) => {
		const { attribs } = element;
		const media = {
			medium: attribs["medium"],
			isDefault: !!attribs["isDefault"]
		};
		for (const attrib of MEDIA_KEYS_STRING) if (attribs[attrib]) media[attrib] = attribs[attrib];
		for (const attrib of MEDIA_KEYS_INT) if (attribs[attrib]) media[attrib] = Number.parseInt(attribs[attrib], 10);
		if (attribs["expression"]) media.expression = attribs["expression"];
		return media;
	});
}
/**
* Get one element by tag name.
*
* @param tagName Tag name to look for
* @param node Node to search in
* @returns The element or null
*/
function getOneElement(tagName, node) {
	return getElementsByTagName(tagName, node, true, 1)[0];
}
/**
* Get the text content of an element with a certain tag name.
*
* @param tagName Tag name to look for.
* @param where Node to search in.
* @param recurse Whether to recurse into child nodes.
* @returns The text content of the element.
*/
function fetch(tagName, where, recurse = false) {
	return textContent(getElementsByTagName(tagName, where, recurse, 1)).trim();
}
/**
* Adds a property to an object if it has a value.
*
* @param object Object to be extended.
* @param property Property name.
* @param tagName Tag name that contains the conditionally added property.
* @param where Element to search for the property.
* @param recurse Whether to recurse into child nodes.
*/
function addConditionally(object, property, tagName, where, recurse = false) {
	const value = fetch(tagName, where, recurse);
	if (value) object[property] = value;
}
/**
* Checks if an element is a feed root node.
*
* @param value The name of the element to check.
* @returns Whether an element is a feed root node.
*/
function isValidFeed(value) {
	return value === "rss" || value === "feed" || value === "rdf:RDF";
}
var MEDIA_KEYS_STRING, MEDIA_KEYS_INT;
var init_feeds = __esmMin((() => {
	init_legacy();
	init_stringify();
	MEDIA_KEYS_STRING = [
		"url",
		"type",
		"lang"
	];
	MEDIA_KEYS_INT = [
		"fileSize",
		"bitrate",
		"framerate",
		"samplingrate",
		"channels",
		"duration",
		"height",
		"width"
	];
}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/helpers.js
/**
* Given an array of nodes, remove any member that is contained by another
* member.
*
* @category Helpers
* @param nodes Nodes to filter.
* @returns Remaining nodes that aren't contained by other nodes.
*/
function removeSubsets(nodes) {
	let index = nodes.length;
	while (--index >= 0) {
		const node = nodes[index];
		if (index > 0 && nodes.lastIndexOf(node, index - 1) >= 0) {
			nodes.splice(index, 1);
			continue;
		}
		for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) if (nodes.includes(ancestor)) {
			nodes.splice(index, 1);
			break;
		}
	}
	return nodes;
}
/**
* Compare the position of one node against another node in any other document,
* returning a bitmask with the values from {@link DocumentPosition}.
*
* Document order:
* > There is an ordering, document order, defined on all the nodes in the
* > document corresponding to the order in which the first character of the
* > XML representation of each node occurs in the XML representation of the
* > document after expansion of general entities. Thus, the document element
* > node will be the first node. Element nodes occur before their children.
* > Thus, document order orders element nodes in order of the occurrence of
* > their start-tag in the XML (after expansion of entities). The attribute
* > nodes of an element occur after the element and before its children. The
* > relative order of attribute nodes is implementation-dependent.
*
* Source:
* http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
*
* @category Helpers
* @param nodeA The first node to use in the comparison
* @param nodeB The second node to use in the comparison
* @returns A bitmask describing the input nodes' relative position.
*
* See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
* a description of these values.
*/
function compareDocumentPosition(nodeA, nodeB) {
	const aParents = [];
	const bParents = [];
	if (nodeA === nodeB) return 0;
	let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
	while (current) {
		aParents.unshift(current);
		current = current.parent;
	}
	current = hasChildren(nodeB) ? nodeB : nodeB.parent;
	while (current) {
		bParents.unshift(current);
		current = current.parent;
	}
	const maxIndex = Math.min(aParents.length, bParents.length);
	let index = 0;
	while (index < maxIndex && aParents[index] === bParents[index]) index++;
	if (index === 0) return DocumentPosition.DISCONNECTED;
	const sharedParent = aParents[index - 1];
	const siblings = sharedParent.children;
	const aSibling = aParents[index];
	const bSibling = bParents[index];
	if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
		if (sharedParent === nodeB) return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
		return DocumentPosition.FOLLOWING;
	}
	if (sharedParent === nodeA) return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
	return DocumentPosition.PRECEDING;
}
/**
* Sort an array of nodes based on their relative position in the document,
* removing any duplicate nodes. If the array contains nodes that do not belong
* to the same document, sort order is unspecified.
*
* @category Helpers
* @param nodes Array of DOM nodes.
* @returns Collection of unique nodes, sorted in document order.
*/
function uniqueSort(nodes) {
	nodes = nodes.filter((node, index, array) => !array.includes(node, index + 1));
	nodes.sort((a, b) => {
		const relative = compareDocumentPosition(a, b);
		if (relative & DocumentPosition.PRECEDING) return -1;
		if (relative & DocumentPosition.FOLLOWING) return 1;
		return 0;
	});
	return nodes;
}
var DocumentPosition;
var init_helpers = __esmMin((() => {
	init_dist$4();
	(function(DocumentPosition) {
		DocumentPosition[DocumentPosition["DISCONNECTED"] = 1] = "DISCONNECTED";
		DocumentPosition[DocumentPosition["PRECEDING"] = 2] = "PRECEDING";
		DocumentPosition[DocumentPosition["FOLLOWING"] = 4] = "FOLLOWING";
		DocumentPosition[DocumentPosition["CONTAINS"] = 8] = "CONTAINS";
		DocumentPosition[DocumentPosition["CONTAINED_BY"] = 16] = "CONTAINED_BY";
	})(DocumentPosition || (DocumentPosition = {}));
}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/manipulation.js
/**
* Remove an element from the dom
*
* @category Manipulation
* @param element The element to be removed.
*/
function removeElement(element) {
	if (element.prev) element.prev.next = element.next;
	if (element.next) element.next.prev = element.prev;
	if (element.parent) {
		const childs = element.parent.children;
		const childsIndex = childs.lastIndexOf(element);
		if (childsIndex !== -1) childs.splice(childsIndex, 1);
	}
	element.next = null;
	element.prev = null;
	element.parent = null;
}
/**
* Replace an element in the dom
*
* @category Manipulation
* @param element The element to be replaced.
* @param replacement The element to be added
*/
function replaceElement(element, replacement) {
	replacement.prev = element.prev;
	if (replacement.prev) replacement.prev.next = replacement;
	replacement.next = element.next;
	if (replacement.next) replacement.next.prev = replacement;
	replacement.parent = element.parent;
	if (replacement.parent) {
		const { children } = replacement.parent;
		const elementIndex = children.lastIndexOf(element);
		if (elementIndex === -1) return;
		children[elementIndex] = replacement;
		element.parent = null;
	}
}
/**
* Append a child to an element.
*
* @category Manipulation
* @param parent The element to append to.
* @param child The element to be added as a child.
*/
function appendChild(parent, child) {
	removeElement(child);
	child.next = null;
	child.parent = parent;
	if (parent.children.push(child) > 1) {
		const sibling = parent.children[parent.children.length - 2];
		sibling.next = child;
		child.prev = sibling;
	} else child.prev = null;
}
/**
* Append an element after another.
*
* @category Manipulation
* @param element The element to append after.
* @param next The element be added.
*/
function append(element, next) {
	removeElement(next);
	const { parent } = element;
	const currentNext = element.next;
	next.next = currentNext;
	next.prev = element;
	element.next = next;
	next.parent = parent;
	if (currentNext) {
		currentNext.prev = next;
		if (parent) {
			const childs = parent.children;
			childs.splice(childs.lastIndexOf(currentNext), 0, next);
		}
	} else if (parent) parent.children.push(next);
}
/**
* Prepend a child to an element.
*
* @category Manipulation
* @param parent The element to prepend before.
* @param child The element to be added as a child.
*/
function prependChild(parent, child) {
	removeElement(child);
	child.parent = parent;
	child.prev = null;
	if (parent.children.unshift(child) === 1) child.next = null;
	else {
		const sibling = parent.children[1];
		sibling.prev = child;
		child.next = sibling;
	}
}
/**
* Prepend an element before another.
*
* @category Manipulation
* @param element The element to prepend before.
* @param previous The element to be added.
*/
function prepend(element, previous) {
	removeElement(previous);
	const { parent } = element;
	if (parent) {
		const childs = parent.children;
		childs.splice(childs.indexOf(element), 0, previous);
	}
	if (element.prev) element.prev.next = previous;
	previous.parent = parent;
	previous.prev = element.prev;
	previous.next = element;
	element.prev = previous;
}
var init_manipulation = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/traversal.js
/**
* Get a node's children.
*
* @category Traversal
* @param element Node to get the children of.
* @returns `element`'s children, or an empty array.
*/
function getChildren(element) {
	return hasChildren(element) ? element.children : [];
}
function getParent(element) {
	return element.parent || null;
}
/**
* Gets an elements siblings, including the element itself.
*
* Attempts to get the children through the element's parent first. If we don't
* have a parent (the element is a root node), we walk the element's `prev` &
* `next` to get all remaining nodes.
*
* @category Traversal
* @param element Element to get the siblings of.
* @returns `element`'s siblings, including `element`.
*/
function getSiblings(element) {
	const parent = getParent(element);
	if (parent != null) return getChildren(parent);
	const siblings = [element];
	let { prev, next } = element;
	while (prev != null) {
		siblings.unshift(prev);
		({prev} = prev);
	}
	while (next != null) {
		siblings.push(next);
		({next} = next);
	}
	return siblings;
}
/**
* Gets an attribute from an element.
*
* @category Traversal
* @param element Element to check.
* @param name Attribute name to retrieve.
* @returns The element's attribute value, or `undefined`.
*/
function getAttributeValue(element, name) {
	const { attribs } = element;
	return attribs?.[name];
}
/**
* Checks whether an element has an attribute.
*
* @category Traversal
* @param element Element to check.
* @param name Attribute name to look for.
* @returns Returns whether `element` has the attribute `name`.
*/
function hasAttrib(element, name) {
	const { attribs } = element;
	return attribs != null && Object.hasOwn(attribs, name) && attribs[name] != null;
}
/**
* Get the tag name of an element.
*
* @category Traversal
* @param element The element to get the name for.
* @returns The tag name of `element`.
*/
function getName(element) {
	return element.name;
}
/**
* Returns the next element sibling of a node.
*
* @category Traversal
* @param element The element to get the next sibling of.
* @returns `element`'s next sibling that is a tag, or `null` if there is no next
* sibling.
*/
function nextElementSibling(element) {
	let { next } = element;
	while (next !== null && !isTag(next)) ({next} = next);
	return next;
}
/**
* Returns the previous element sibling of a node.
*
* @category Traversal
* @param element The element to get the previous sibling of.
* @returns `element`'s previous sibling that is a tag, or `null` if there is no
* previous sibling.
*/
function prevElementSibling(element) {
	let { prev } = element;
	while (prev !== null && !isTag(prev)) ({prev} = prev);
	return prev;
}
var init_traversal = __esmMin((() => {
	init_dist$4();
}));
//#endregion
//#region node_modules/.pnpm/domutils@4.0.2/node_modules/domutils/dist/index.js
var dist_exports$1 = /* @__PURE__ */ __exportAll({
	DocumentPosition: () => DocumentPosition,
	append: () => append,
	appendChild: () => appendChild,
	compareDocumentPosition: () => compareDocumentPosition,
	existsOne: () => existsOne,
	filter: () => filter,
	find: () => find,
	findAll: () => findAll,
	findOne: () => findOne,
	getAttributeValue: () => getAttributeValue,
	getChildren: () => getChildren,
	getElementById: () => getElementById,
	getElements: () => getElements,
	getElementsByClassName: () => getElementsByClassName,
	getElementsByTagName: () => getElementsByTagName,
	getElementsByTagType: () => getElementsByTagType,
	getFeed: () => getFeed,
	getInnerHTML: () => getInnerHTML,
	getName: () => getName,
	getOuterHTML: () => getOuterHTML,
	getParent: () => getParent,
	getSiblings: () => getSiblings,
	getText: () => getText,
	hasAttrib: () => hasAttrib,
	innerText: () => innerText,
	nextElementSibling: () => nextElementSibling,
	prepend: () => prepend,
	prependChild: () => prependChild,
	prevElementSibling: () => prevElementSibling,
	removeElement: () => removeElement,
	removeSubsets: () => removeSubsets,
	replaceElement: () => replaceElement,
	testElement: () => testElement,
	textContent: () => textContent,
	uniqueSort: () => uniqueSort
});
var init_dist$1 = __esmMin((() => {
	init_feeds();
	init_helpers();
	init_legacy();
	init_manipulation();
	init_querying();
	init_stringify();
	init_traversal();
}));
//#endregion
//#region node_modules/.pnpm/htmlparser2@12.0.0/node_modules/htmlparser2/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({
	DefaultHandler: () => DomHandler,
	DomHandler: () => DomHandler,
	DomUtils: () => dist_exports$1,
	ElementType: () => dist_exports$2,
	Parser: () => Parser,
	QuoteType: () => QuoteType,
	Tokenizer: () => Tokenizer,
	createDocumentStream: () => createDocumentStream,
	getFeed: () => getFeed,
	parseDocument: () => parseDocument,
	parseFeed: () => parseFeed
});
/**
* Parses the data, returns the resulting document.
* @param data The data that should be parsed.
* @param options Optional options for the parser and DOM handler.
*/
function parseDocument(data, options) {
	const handler = new DomHandler(void 0, options);
	new Parser(handler, options).end(data);
	return handler.root;
}
/**
* Creates a parser instance, with an attached DOM handler.
* @param callback A callback that will be called once parsing has been completed, with the resulting document.
* @param options Optional options for the parser and DOM handler.
* @param elementCallback An optional callback that will be called every time a tag has been completed inside of the DOM.
*/
function createDocumentStream(callback, options, elementCallback) {
	const handler = new DomHandler((error) => callback(error, handler.root), options, elementCallback);
	return new Parser(handler, options);
}
/**
* Parse a feed.
* @param feed The feed that should be parsed, as a string.
* @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
*/
function parseFeed(feed, options = parseFeedDefaultOptions) {
	return getFeed(parseDocument(feed, options).children);
}
var parseFeedDefaultOptions;
var init_dist = __esmMin((() => {
	init_Parser();
	init_dist$4();
	init_dist$5();
	init_Tokenizer();
	init_dist$1();
	parseFeedDefaultOptions = { xmlMode: true };
}));
//#endregion
//#region node_modules/.pnpm/escape-string-regexp@4.0.0/node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (string) => {
		if (typeof string !== "string") throw new TypeError("Expected a string");
		return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
	};
}));
//#endregion
//#region node_modules/.pnpm/is-plain-object@5.0.0/node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/*!
	* is-plain-object <https://github.com/jonschlinkert/is-plain-object>
	*
	* Copyright (c) 2014-2017, Jon Schlinkert.
	* Released under the MIT License.
	*/
	function isObject(o) {
		return Object.prototype.toString.call(o) === "[object Object]";
	}
	function isPlainObject(o) {
		var ctor, prot;
		if (isObject(o) === false) return false;
		ctor = o.constructor;
		if (ctor === void 0) return true;
		prot = ctor.prototype;
		if (isObject(prot) === false) return false;
		if (prot.hasOwnProperty("isPrototypeOf") === false) return false;
		return true;
	}
	exports.isPlainObject = isPlainObject;
}));
//#endregion
//#region node_modules/.pnpm/deepmerge@4.3.1/node_modules/deepmerge/dist/cjs.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value) && !isSpecial(value);
	};
	function isNonNullObject(value) {
		return !!value && typeof value === "object";
	}
	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);
		return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
	}
	var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for ? Symbol.for("react.element") : 60103;
	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE;
	}
	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {};
	}
	function cloneUnlessOtherwiseSpecified(value, options) {
		return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
	}
	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options);
		});
	}
	function getMergeFunction(key, options) {
		if (!options.customMerge) return deepmerge;
		var customMerge = options.customMerge(key);
		return typeof customMerge === "function" ? customMerge : deepmerge;
	}
	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol);
		}) : [];
	}
	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
	}
	function propertyIsOnObject(object, property) {
		try {
			return property in object;
		} catch (_) {
			return false;
		}
	}
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
	}
	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) return;
			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			else destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		});
		return destination;
	}
	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
		var sourceIsArray = Array.isArray(source);
		if (!(sourceIsArray === Array.isArray(target))) return cloneUnlessOtherwiseSpecified(source, options);
		else if (sourceIsArray) return options.arrayMerge(target, source, options);
		else return mergeObject(target, source, options);
	}
	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) throw new Error("first argument should be an array");
		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options);
		}, {});
	};
	module.exports = deepmerge;
}));
//#endregion
//#region node_modules/.pnpm/parse-srcset@1.0.2/node_modules/parse-srcset/src/parse-srcset.js
var require_parse_srcset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Srcset Parser
	*
	* By Alex Bell |  MIT License
	*
	* JS Parser for the string value that appears in markup <img srcset="here">
	*
	* @returns Array [{url: _, d: _, w: _, h:_}, ...]
	*
	* Based super duper closely on the reference algorithm at:
	* https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
	*
	* Most comments are copied in directly from the spec
	* (except for comments in parens).
	*/
	(function(root, factory) {
		if (typeof define === "function" && define.amd) define([], factory);
		else if (typeof module === "object" && module.exports) module.exports = factory();
		else root.parseSrcset = factory();
	})(exports, function() {
		return function(input) {
			function isSpace(c) {
				return c === " " || c === "	" || c === "\n" || c === "\f" || c === "\r";
			}
			function collectCharacters(regEx) {
				var chars, match = regEx.exec(input.substring(pos));
				if (match) {
					chars = match[0];
					pos += chars.length;
					return chars;
				}
			}
			var inputLength = input.length, regexLeadingSpaces = /^[ \t\n\r\u000c]+/, regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/, regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/, regexTrailingCommas = /[,]+$/, regexNonNegativeInteger = /^\d+$/, regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/, url, descriptors, currentDescriptor, state, c, pos = 0, candidates = [];
			while (true) {
				collectCharacters(regexLeadingCommasOrSpaces);
				if (pos >= inputLength) return candidates;
				url = collectCharacters(regexLeadingNotSpaces);
				descriptors = [];
				if (url.slice(-1) === ",") {
					url = url.replace(regexTrailingCommas, "");
					parseDescriptors();
				} else tokenize();
			}
			/**
			* Tokenizes descriptor properties prior to parsing
			* Returns undefined.
			*/
			function tokenize() {
				collectCharacters(regexLeadingSpaces);
				currentDescriptor = "";
				state = "in descriptor";
				while (true) {
					c = input.charAt(pos);
					if (state === "in descriptor") {
						if (isSpace(c)) {
							if (currentDescriptor) {
								descriptors.push(currentDescriptor);
								currentDescriptor = "";
								state = "after descriptor";
							}
						} else if (c === ",") {
							pos += 1;
							if (currentDescriptor) descriptors.push(currentDescriptor);
							parseDescriptors();
							return;
						} else if (c === "(") {
							currentDescriptor = currentDescriptor + c;
							state = "in parens";
						} else if (c === "") {
							if (currentDescriptor) descriptors.push(currentDescriptor);
							parseDescriptors();
							return;
						} else currentDescriptor = currentDescriptor + c;
					} else if (state === "in parens") {
						if (c === ")") {
							currentDescriptor = currentDescriptor + c;
							state = "in descriptor";
						} else if (c === "") {
							descriptors.push(currentDescriptor);
							parseDescriptors();
							return;
						} else currentDescriptor = currentDescriptor + c;
					} else if (state === "after descriptor") {
						if (isSpace(c)) {} else if (c === "") {
							parseDescriptors();
							return;
						} else {
							state = "in descriptor";
							pos -= 1;
						}
					}
					pos += 1;
				}
			}
			/**
			* Adds descriptor properties to a candidate, pushes to the candidates array
			* @return undefined
			*/
			function parseDescriptors() {
				var pError = false, w, d, h, i, candidate = {}, desc, lastChar, value, intVal, floatVal;
				for (i = 0; i < descriptors.length; i++) {
					desc = descriptors[i];
					lastChar = desc[desc.length - 1];
					value = desc.substring(0, desc.length - 1);
					intVal = parseInt(value, 10);
					floatVal = parseFloat(value);
					if (regexNonNegativeInteger.test(value) && lastChar === "w") {
						if (w || d) pError = true;
						if (intVal === 0) pError = true;
						else w = intVal;
					} else if (regexFloatingPoint.test(value) && lastChar === "x") {
						if (w || d || h) pError = true;
						if (floatVal < 0) pError = true;
						else d = floatVal;
					} else if (regexNonNegativeInteger.test(value) && lastChar === "h") {
						if (h || d) pError = true;
						if (intVal === 0) pError = true;
						else h = intVal;
					} else pError = true;
				}
				if (!pError) {
					candidate.url = url;
					if (w) candidate.w = w;
					if (d) candidate.d = d;
					if (h) candidate.h = h;
					candidates.push(candidate);
				} else if (console && console.log) console.log("Invalid srcset descriptor found in '" + input + "' at '" + desc + "'.");
			}
		};
	});
}));
//#endregion
//#region node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var p = process || {};
	var argv = p.argv || [];
	var env = p.env || {};
	var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
	var formatter = (open, close, replace = open) => (input) => {
		let string = "" + input, index = string.indexOf(close, open.length);
		return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
	};
	var replaceClose = (string, close, replace, index) => {
		let result = "", cursor = 0;
		do {
			result += string.substring(cursor, index) + replace;
			cursor = index + close.length;
			index = string.indexOf(close, cursor);
		} while (~index);
		return result + string.substring(cursor);
	};
	var createColors = (enabled = isColorSupported) => {
		let f = enabled ? formatter : () => String;
		return {
			isColorSupported: enabled,
			reset: f("\x1B[0m", "\x1B[0m"),
			bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
			dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
			italic: f("\x1B[3m", "\x1B[23m"),
			underline: f("\x1B[4m", "\x1B[24m"),
			inverse: f("\x1B[7m", "\x1B[27m"),
			hidden: f("\x1B[8m", "\x1B[28m"),
			strikethrough: f("\x1B[9m", "\x1B[29m"),
			black: f("\x1B[30m", "\x1B[39m"),
			red: f("\x1B[31m", "\x1B[39m"),
			green: f("\x1B[32m", "\x1B[39m"),
			yellow: f("\x1B[33m", "\x1B[39m"),
			blue: f("\x1B[34m", "\x1B[39m"),
			magenta: f("\x1B[35m", "\x1B[39m"),
			cyan: f("\x1B[36m", "\x1B[39m"),
			white: f("\x1B[37m", "\x1B[39m"),
			gray: f("\x1B[90m", "\x1B[39m"),
			bgBlack: f("\x1B[40m", "\x1B[49m"),
			bgRed: f("\x1B[41m", "\x1B[49m"),
			bgGreen: f("\x1B[42m", "\x1B[49m"),
			bgYellow: f("\x1B[43m", "\x1B[49m"),
			bgBlue: f("\x1B[44m", "\x1B[49m"),
			bgMagenta: f("\x1B[45m", "\x1B[49m"),
			bgCyan: f("\x1B[46m", "\x1B[49m"),
			bgWhite: f("\x1B[47m", "\x1B[49m"),
			blackBright: f("\x1B[90m", "\x1B[39m"),
			redBright: f("\x1B[91m", "\x1B[39m"),
			greenBright: f("\x1B[92m", "\x1B[39m"),
			yellowBright: f("\x1B[93m", "\x1B[39m"),
			blueBright: f("\x1B[94m", "\x1B[39m"),
			magentaBright: f("\x1B[95m", "\x1B[39m"),
			cyanBright: f("\x1B[96m", "\x1B[39m"),
			whiteBright: f("\x1B[97m", "\x1B[39m"),
			bgBlackBright: f("\x1B[100m", "\x1B[49m"),
			bgRedBright: f("\x1B[101m", "\x1B[49m"),
			bgGreenBright: f("\x1B[102m", "\x1B[49m"),
			bgYellowBright: f("\x1B[103m", "\x1B[49m"),
			bgBlueBright: f("\x1B[104m", "\x1B[49m"),
			bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
			bgCyanBright: f("\x1B[106m", "\x1B[49m"),
			bgWhiteBright: f("\x1B[107m", "\x1B[49m")
		};
	};
	module.exports = createColors();
	module.exports.createColors = createColors;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/tokenize.js
var require_tokenize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SINGLE_QUOTE = "'".charCodeAt(0);
	var DOUBLE_QUOTE = "\"".charCodeAt(0);
	var BACKSLASH = "\\".charCodeAt(0);
	var SLASH = "/".charCodeAt(0);
	var NEWLINE = "\n".charCodeAt(0);
	var SPACE = " ".charCodeAt(0);
	var FEED = "\f".charCodeAt(0);
	var TAB = "	".charCodeAt(0);
	var CR = "\r".charCodeAt(0);
	var OPEN_SQUARE = "[".charCodeAt(0);
	var CLOSE_SQUARE = "]".charCodeAt(0);
	var OPEN_PARENTHESES = "(".charCodeAt(0);
	var CLOSE_PARENTHESES = ")".charCodeAt(0);
	var OPEN_CURLY = "{".charCodeAt(0);
	var CLOSE_CURLY = "}".charCodeAt(0);
	var SEMICOLON = ";".charCodeAt(0);
	var ASTERISK = "*".charCodeAt(0);
	var COLON = ":".charCodeAt(0);
	var AT = "@".charCodeAt(0);
	var RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
	var RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
	var RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
	var RE_HEX_ESCAPE = /[\da-f]/i;
	module.exports = function tokenizer(input, options = {}) {
		let css = input.css.valueOf();
		let ignore = options.ignoreErrors;
		let code, content, escape, next, quote;
		let currentToken, escaped, escapePos, n, prev;
		let length = css.length;
		let pos = 0;
		let buffer = [];
		let returned = [];
		let lastBadParen = -1;
		function position() {
			return pos;
		}
		function unclosed(what) {
			throw input.error("Unclosed " + what, pos);
		}
		function endOfFile() {
			return returned.length === 0 && pos >= length;
		}
		function nextToken(opts) {
			if (returned.length) return returned.pop();
			if (pos >= length) return;
			let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
			code = css.charCodeAt(pos);
			switch (code) {
				case NEWLINE:
				case SPACE:
				case TAB:
				case CR:
				case FEED:
					next = pos;
					do {
						next += 1;
						code = css.charCodeAt(next);
					} while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
					currentToken = ["space", css.slice(pos, next)];
					pos = next - 1;
					break;
				case OPEN_SQUARE:
				case CLOSE_SQUARE:
				case OPEN_CURLY:
				case CLOSE_CURLY:
				case COLON:
				case SEMICOLON:
				case CLOSE_PARENTHESES: {
					let controlChar = String.fromCharCode(code);
					currentToken = [
						controlChar,
						controlChar,
						pos
					];
					break;
				}
				case OPEN_PARENTHESES:
					prev = buffer.length ? buffer.pop()[1] : "";
					n = css.charCodeAt(pos + 1);
					if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
						next = pos;
						do {
							escaped = false;
							next = css.indexOf(")", next + 1);
							if (next === -1) {
								if (ignore || ignoreUnclosed) {
									next = pos;
									break;
								} else unclosed("bracket");
							}
							escapePos = next;
							while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
								escapePos -= 1;
								escaped = !escaped;
							}
						} while (escaped);
						currentToken = [
							"brackets",
							css.slice(pos, next + 1),
							pos,
							next
						];
						pos = next;
					} else if (pos <= lastBadParen) currentToken = [
						"(",
						"(",
						pos
					];
					else {
						next = css.indexOf(")", pos + 1);
						content = css.slice(pos, next + 1);
						if (next === -1 || RE_BAD_BRACKET.test(content)) {
							lastBadParen = next === -1 ? length : next;
							currentToken = [
								"(",
								"(",
								pos
							];
						} else {
							currentToken = [
								"brackets",
								content,
								pos,
								next
							];
							pos = next;
						}
					}
					break;
				case SINGLE_QUOTE:
				case DOUBLE_QUOTE:
					quote = code === SINGLE_QUOTE ? "'" : "\"";
					next = pos;
					do {
						escaped = false;
						next = css.indexOf(quote, next + 1);
						if (next === -1) {
							if (ignore || ignoreUnclosed) {
								next = pos + 1;
								break;
							} else unclosed("string");
						}
						escapePos = next;
						while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
							escapePos -= 1;
							escaped = !escaped;
						}
					} while (escaped);
					currentToken = [
						"string",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				case AT:
					RE_AT_END.lastIndex = pos + 1;
					RE_AT_END.test(css);
					if (RE_AT_END.lastIndex === 0) next = css.length - 1;
					else next = RE_AT_END.lastIndex - 2;
					currentToken = [
						"at-word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				case BACKSLASH:
					next = pos;
					escape = true;
					while (css.charCodeAt(next + 1) === BACKSLASH) {
						next += 1;
						escape = !escape;
					}
					code = css.charCodeAt(next + 1);
					if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
						next += 1;
						if (RE_HEX_ESCAPE.test(css.charAt(next))) {
							while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) next += 1;
							if (css.charCodeAt(next + 1) === SPACE) next += 1;
						}
					}
					currentToken = [
						"word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
					break;
				default: if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
					next = css.indexOf("*/", pos + 2) + 1;
					if (next === 0) {
						if (ignore || ignoreUnclosed) next = css.length;
						else unclosed("comment");
					}
					currentToken = [
						"comment",
						css.slice(pos, next + 1),
						pos,
						next
					];
					pos = next;
				} else {
					RE_WORD_END.lastIndex = pos + 1;
					RE_WORD_END.test(css);
					if (RE_WORD_END.lastIndex === 0) next = css.length - 1;
					else next = RE_WORD_END.lastIndex - 2;
					currentToken = [
						"word",
						css.slice(pos, next + 1),
						pos,
						next
					];
					buffer.push(currentToken);
					pos = next;
				}
			}
			pos++;
			return currentToken;
		}
		function back(token) {
			returned.push(token);
		}
		return {
			back,
			endOfFile,
			nextToken,
			position
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/terminal-highlight.js
var require_terminal_highlight = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var pico = require_picocolors();
	var tokenizer = require_tokenize();
	var Input;
	function registerInput(dependant) {
		Input = dependant;
	}
	var HIGHLIGHT_THEME = {
		";": pico.yellow,
		":": pico.yellow,
		"(": pico.cyan,
		")": pico.cyan,
		"[": pico.yellow,
		"]": pico.yellow,
		"{": pico.yellow,
		"}": pico.yellow,
		"at-word": pico.cyan,
		"brackets": pico.cyan,
		"call": pico.cyan,
		"class": pico.yellow,
		"comment": pico.gray,
		"hash": pico.magenta,
		"string": pico.green
	};
	function getTokenType([type, value], processor) {
		if (type === "word") {
			if (value[0] === ".") return "class";
			if (value[0] === "#") return "hash";
		}
		if (!processor.endOfFile()) {
			let next = processor.nextToken();
			processor.back(next);
			if (next[0] === "brackets" || next[0] === "(") return "call";
		}
		return type;
	}
	function terminalHighlight(css) {
		let processor = tokenizer(new Input(css), { ignoreErrors: true });
		let result = "";
		while (!processor.endOfFile()) {
			let token = processor.nextToken();
			let color = HIGHLIGHT_THEME[getTokenType(token, processor)];
			if (color) result += token[1].split(/\r?\n/).map((i) => color(i)).join("\n");
			else result += token[1];
		}
		return result;
	}
	terminalHighlight.registerInput = registerInput;
	module.exports = terminalHighlight;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/css-syntax-error.js
var require_css_syntax_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var pico = require_picocolors();
	var terminalHighlight = require_terminal_highlight();
	var CssSyntaxError = class CssSyntaxError extends Error {
		constructor(message, line, column, source, file, plugin) {
			super(message);
			this.name = "CssSyntaxError";
			this.reason = message;
			if (file) this.file = file;
			if (source) this.source = source;
			if (plugin) this.plugin = plugin;
			if (typeof line !== "undefined" && typeof column !== "undefined") {
				if (typeof line === "number") {
					this.line = line;
					this.column = column;
				} else {
					this.line = line.line;
					this.column = line.column;
					this.endLine = column.line;
					this.endColumn = column.column;
				}
			}
			this.setMessage();
			if (Error.captureStackTrace) Error.captureStackTrace(this, CssSyntaxError);
		}
		setMessage() {
			this.message = this.plugin ? this.plugin + ": " : "";
			this.message += this.file ? this.file : "<css input>";
			if (typeof this.line !== "undefined") this.message += ":" + this.line + ":" + this.column;
			this.message += ": " + this.reason;
		}
		showSourceCode(color) {
			if (!this.source) return "";
			let css = this.source;
			if (color == null) color = pico.isColorSupported;
			let aside = (text) => text;
			let mark = (text) => text;
			let highlight = (text) => text;
			if (color) {
				let { bold, gray, red } = pico.createColors(true);
				mark = (text) => bold(red(text));
				aside = (text) => gray(text);
				if (terminalHighlight) highlight = (text) => terminalHighlight(text);
			}
			let lines = css.split(/\r?\n/);
			let start = Math.max(this.line - 3, 0);
			let end = Math.min(this.line + 2, lines.length);
			let maxWidth = String(end).length;
			return lines.slice(start, end).map((line, index) => {
				let number = start + 1 + index;
				let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
				if (number === this.line) {
					if (line.length > 160) {
						let padding = 20;
						let subLineStart = Math.max(0, this.column - padding);
						let subLineEnd = Math.max(this.column + padding, this.endColumn + padding);
						let subLine = line.slice(subLineStart, subLineEnd);
						let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, Math.min(this.column - 1, 19)).replace(/[^\t]/g, " ");
						return mark(">") + aside(gutter) + highlight(subLine) + "\n " + spacing + mark("^");
					}
					let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
					return mark(">") + aside(gutter) + highlight(line) + "\n " + spacing + mark("^");
				}
				return " " + aside(gutter) + highlight(line);
			}).join("\n");
		}
		toString() {
			let code = this.showSourceCode();
			if (code) code = "\n\n" + code + "\n";
			return this.name + ": " + this.message + code;
		}
	};
	module.exports = CssSyntaxError;
	CssSyntaxError.default = CssSyntaxError;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/stringifier.js
var require_stringifier = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var STYLE_TAG = /(<)(\/?style\b)/gi;
	var COMMENT_OPEN = /(<)(!--)/g;
	var AT_NAME_END = /[\t\n\f\r "#'()/;[\\\]{}]/;
	function escapeHTMLInCSS(str) {
		if (typeof str !== "string") return str;
		if (!str.includes("<")) return str;
		return str.replace(STYLE_TAG, "\\3c $2").replace(COMMENT_OPEN, "\\3c $2");
	}
	var DEFAULT_RAW = {
		after: "\n",
		beforeClose: "\n",
		beforeComment: "\n",
		beforeDecl: "\n",
		beforeOpen: " ",
		beforeRule: "\n",
		colon: ": ",
		commentLeft: " ",
		commentRight: " ",
		emptyBody: "",
		indent: "    ",
		semicolon: false
	};
	function capitalize(str) {
		return str[0].toUpperCase() + str.slice(1);
	}
	function atruleStart(str, node) {
		let name = "@" + node.name;
		let params = node.params ? str.rawValue(node, "params") : "";
		let afterName = node.raws.afterName;
		if (typeof afterName === "undefined") afterName = params ? " " : "";
		else if (afterName === "" && params && !AT_NAME_END.test(params[0])) afterName = " ";
		return name + afterName + params;
	}
	function pushBody(str, stack, node) {
		let nodes = node.nodes;
		let last = nodes.length - 1;
		while (last > 0) {
			if (nodes[last].type !== "comment") break;
			last -= 1;
		}
		let semicolon = str.raw(node, "semicolon");
		let isDocument = node.type === "document";
		for (let i = nodes.length - 1; i >= 0; i--) {
			let child = nodes[i];
			let childSemicolon = last !== i || semicolon;
			if (!childSemicolon && i < nodes.length - 1 && (child.type === "atrule" && !child.nodes || child.type === "decl" && child.prop.startsWith("--"))) childSemicolon = true;
			stack.push({
				document: isDocument,
				node: child,
				semicolon: childSemicolon
			});
		}
	}
	function pushBlock(str, stack, node, start) {
		let between = str.raw(node, "between", "beforeOpen");
		str.builder(escapeHTMLInCSS(start + between) + "{", node, "start");
		let hasNodes = node.nodes && node.nodes.length;
		let close = () => {
			let after = hasNodes ? str.raw(node, "after") : str.raw(node, "after", "emptyBody");
			if (after) str.builder(escapeHTMLInCSS(after));
			str.builder("}", node, "end");
			if (node.type === "rule" && node.raws.ownSemicolon) str.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
		};
		if (hasNodes) {
			stack.push(close);
			pushBody(str, stack, node);
		} else close();
	}
	var Stringifier = class Stringifier {
		constructor(builder) {
			this.builder = builder;
		}
		atrule(node, semicolon) {
			let start = atruleStart(this, node);
			if (node.nodes) this.block(node, start);
			else {
				let end = (node.raws.between || "") + (semicolon ? ";" : "");
				this.builder(escapeHTMLInCSS(start + end), node);
			}
		}
		beforeAfter(node, detect) {
			let value;
			if (node.type === "decl") value = this.raw(node, null, "beforeDecl");
			else if (node.type === "comment") value = this.raw(node, null, "beforeComment");
			else if (detect === "before") value = this.raw(node, null, "beforeRule");
			else value = this.raw(node, null, "beforeClose");
			let buf = node.parent;
			let depth = 0;
			while (buf && buf.type !== "root") {
				depth += 1;
				buf = buf.parent;
			}
			if (value.includes("\n")) {
				let indent = this.raw(node, null, "indent");
				if (indent.length) for (let step = 0; step < depth; step++) value += indent;
			}
			return value;
		}
		block(node, start) {
			let between = this.raw(node, "between", "beforeOpen");
			this.builder(escapeHTMLInCSS(start + between) + "{", node, "start");
			let after;
			if (node.nodes && node.nodes.length) {
				this.body(node);
				after = this.raw(node, "after");
			} else after = this.raw(node, "after", "emptyBody");
			if (after) this.builder(escapeHTMLInCSS(after));
			this.builder("}", node, "end");
		}
		body(node) {
			let proto = Stringifier.prototype;
			let expandable = [
				"atrule",
				"block",
				"body",
				"rule",
				"stringify"
			].every((method) => this[method] === proto[method]);
			let stack = [];
			pushBody(this, stack, node);
			while (stack.length > 0) {
				let entry = stack.pop();
				if (typeof entry === "function") {
					entry();
					continue;
				}
				let child = entry.node;
				let before = this.raw(child, "before");
				if (before) this.builder(entry.document ? before : escapeHTMLInCSS(before));
				if (expandable && child.type === "rule") pushBlock(this, stack, child, this.rawValue(child, "selector"));
				else if (expandable && child.type === "atrule" && child.nodes) pushBlock(this, stack, child, atruleStart(this, child));
				else this.stringify(child, entry.semicolon);
			}
		}
		comment(node) {
			let left = this.raw(node, "left", "commentLeft");
			let right = this.raw(node, "right", "commentRight");
			this.builder(escapeHTMLInCSS("/*" + left + node.text + right + "*/"), node);
		}
		decl(node, semicolon) {
			let raws = node.raws;
			let between = this.raw(node, "between", "colon");
			let string = node.prop + between + this.rawValue(node, "value");
			if (node.important) string += raws.important || " !important";
			if (semicolon) string += ";";
			this.builder(escapeHTMLInCSS(string), node);
		}
		document(node) {
			this.body(node);
		}
		raw(node, own, detect) {
			let value;
			if (!detect) detect = own;
			if (own) {
				value = node.raws[own];
				if (typeof value !== "undefined") return value;
			}
			let parent = node.parent;
			if (detect === "before") {
				if (!parent || parent.type === "root" && parent.first === node) return "";
				if (parent && parent.type === "document") return "";
			}
			if (!parent) return DEFAULT_RAW[detect];
			let root = node.root();
			let cache = root.rawCache || (root.rawCache = {});
			if (typeof cache[detect] !== "undefined") return cache[detect];
			if (detect === "before" || detect === "after") return this.beforeAfter(node, detect);
			else {
				let method = "raw" + capitalize(detect);
				if (this[method]) value = this[method](root, node);
				else root.walk((i) => {
					value = i.raws[own];
					if (typeof value !== "undefined") return false;
				});
			}
			if (typeof value === "undefined") value = DEFAULT_RAW[detect];
			cache[detect] = value;
			return value;
		}
		rawBeforeClose(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && i.nodes.length > 0) {
					if (typeof i.raws.after !== "undefined") {
						value = i.raws.after;
						if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
						return false;
					}
				}
			});
			if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeComment(root, node) {
			let value;
			root.walkComments((i) => {
				if (typeof i.raws.before !== "undefined") {
					value = i.raws.before;
					if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
					return false;
				}
			});
			if (typeof value === "undefined") value = this.raw(node, null, "beforeDecl");
			else if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeDecl(root, node) {
			let value;
			root.walkDecls((i) => {
				if (typeof i.raws.before !== "undefined") {
					value = i.raws.before;
					if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
					return false;
				}
			});
			if (typeof value === "undefined") value = this.raw(node, null, "beforeRule");
			else if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawBeforeOpen(root) {
			let value;
			root.walk((i) => {
				if (i.type !== "decl") {
					value = i.raws.between;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawBeforeRule(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && (i.parent !== root || root.first !== i)) {
					if (typeof i.raws.before !== "undefined") {
						value = i.raws.before;
						if (value.includes("\n")) value = value.replace(/[^\n]+$/, "");
						return false;
					}
				}
			});
			if (value) value = value.replace(/\S/g, "");
			return value;
		}
		rawColon(root) {
			let value;
			root.walkDecls((i) => {
				if (typeof i.raws.between !== "undefined") {
					value = i.raws.between.replace(/[^\s:]/g, "");
					return false;
				}
			});
			return value;
		}
		rawEmptyBody(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && i.nodes.length === 0) {
					value = i.raws.after;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawIndent(root) {
			if (root.raws.indent) return root.raws.indent;
			let value;
			root.walk((i) => {
				let p = i.parent;
				if (p && p !== root && p.parent && p.parent === root) {
					if (typeof i.raws.before !== "undefined") {
						let parts = i.raws.before.split("\n");
						value = parts[parts.length - 1];
						value = value.replace(/\S/g, "");
						return false;
					}
				}
			});
			return value;
		}
		rawSemicolon(root) {
			let value;
			root.walk((i) => {
				if (i.nodes && i.nodes.length && i.last.type === "decl") {
					value = i.raws.semicolon;
					if (typeof value !== "undefined") return false;
				}
			});
			return value;
		}
		rawValue(node, prop) {
			let value = node[prop];
			let raw = node.raws[prop];
			if (raw && raw.value === value) return raw.raw;
			return value;
		}
		root(node) {
			if (node.source && node.source.input.hasBOM) this.builder("﻿", node, "start");
			this.body(node);
			if (node.raws.after) {
				let after = node.raws.after;
				let isDocument = node.parent && node.parent.type === "document";
				this.builder(isDocument ? after : escapeHTMLInCSS(after));
			}
		}
		rule(node) {
			this.block(node, this.rawValue(node, "selector"));
			if (node.raws.ownSemicolon) this.builder(escapeHTMLInCSS(node.raws.ownSemicolon), node, "end");
		}
		stringify(node, semicolon) {
			/* c8 ignore start */
			if (!this[node.type]) throw new Error("Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier.");
			/* c8 ignore stop */
			this[node.type](node, semicolon);
		}
	};
	module.exports = Stringifier;
	Stringifier.default = Stringifier;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stringifier = require_stringifier();
	function stringify(node, builder) {
		new Stringifier(builder).stringify(node);
	}
	module.exports = stringify;
	stringify.default = stringify;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/symbols.js
var require_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports.isClean = Symbol("isClean");
	module.exports.my = Symbol("my");
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var CssSyntaxError = require_css_syntax_error();
	var Stringifier = require_stringifier();
	var stringify = require_stringify();
	var { isClean, my } = require_symbols();
	function cloneNode(obj, parent) {
		let cloned = new obj.constructor();
		let stack = [[
			obj,
			cloned,
			parent
		]];
		while (stack.length > 0) {
			let [source, target, targetParent] = stack.pop();
			for (let i in source) {
				if (!Object.prototype.hasOwnProperty.call(source, i))
 /* c8 ignore next 2 */
				continue;
				if (i === "proxyCache") continue;
				let value = source[i];
				let type = typeof value;
				if (i === "parent" && type === "object") {
					if (targetParent) target[i] = targetParent;
				} else if (i === "source") target[i] = value;
				else if (Array.isArray(value)) {
					let children = [];
					target[i] = children;
					for (let j of value) {
						let childClone = new j.constructor();
						children.push(childClone);
						stack.push([
							j,
							childClone,
							target
						]);
					}
				} else {
					if (type === "object" && value !== null) {
						let valueClone = new value.constructor();
						stack.push([
							value,
							valueClone,
							void 0
						]);
						value = valueClone;
					}
					target[i] = value;
				}
			}
		}
		return cloned;
	}
	function sourceOffset(inputCSS, position) {
		if (position && typeof position.offset !== "undefined") return position.offset;
		let column = 1;
		let line = 1;
		let offset = 0;
		for (let i = 0; i < inputCSS.length; i++) {
			if (line === position.line && column === position.column) {
				offset = i;
				break;
			}
			if (inputCSS[i] === "\n") {
				column = 1;
				line += 1;
			} else column += 1;
		}
		return offset;
	}
	var Node = class Node {
		get proxyOf() {
			return this;
		}
		constructor(defaults = {}) {
			this.raws = {};
			this[isClean] = false;
			this[my] = true;
			for (let name of Object.keys(defaults)) {
				if (name === "__proto__") continue;
				if (name === "nodes") {
					this.nodes = [];
					for (let node of defaults[name]) if (typeof node.clone === "function" && node.parent) this.append(node.clone());
					else this.append(node);
				} else this[name] = defaults[name];
			}
		}
		addToError(error) {
			error.postcssNode = this;
			if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
				let s = this.source;
				error.stack = error.stack.replace(/\n\s{4}at /, `$&${s.input.from}:${s.start.line}:${s.start.column}$&`);
			}
			return error;
		}
		after(add) {
			this.parent.insertAfter(this, add);
			return this;
		}
		assign(overrides = {}) {
			for (let name in overrides) this[name] = overrides[name];
			return this;
		}
		before(add) {
			this.parent.insertBefore(this, add);
			return this;
		}
		cleanRaws(keepBetween) {
			delete this.raws.before;
			delete this.raws.after;
			if (!keepBetween) delete this.raws.between;
		}
		clone(overrides = {}) {
			let cloned = cloneNode(this);
			for (let name in overrides) cloned[name] = overrides[name];
			return cloned;
		}
		cloneAfter(overrides = {}) {
			let cloned = this.clone(overrides);
			this.parent.insertAfter(this, cloned);
			return cloned;
		}
		cloneBefore(overrides = {}) {
			let cloned = this.clone(overrides);
			this.parent.insertBefore(this, cloned);
			return cloned;
		}
		error(message, opts = {}) {
			if (this.source) {
				let { end, start } = this.rangeBy(opts);
				return this.source.input.error(message, {
					column: start.column,
					line: start.line
				}, {
					column: end.column,
					line: end.line
				}, opts);
			}
			return new CssSyntaxError(message);
		}
		getProxyProcessor() {
			return {
				get(node, prop) {
					if (prop === "proxyOf") return node;
					else if (prop === "root") return () => node.root().toProxy();
					else return node[prop];
				},
				set(node, prop, value) {
					if (node[prop] === value) return true;
					node[prop] = value;
					if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || 
					/* c8 ignore next */
					prop === "text") node.markDirty();
					return true;
				}
			};
		}
		/* c8 ignore next 3 */
		markClean() {
			this[isClean] = true;
		}
		markDirty() {
			if (this[isClean]) {
				this[isClean] = false;
				let next = this;
				while (next = next.parent) next[isClean] = false;
			}
		}
		next() {
			if (!this.parent) return void 0;
			let index = this.parent.index(this);
			return this.parent.nodes[index + 1];
		}
		positionBy(opts = {}) {
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let pos = {
				column: this.source.start.column,
				line: this.source.start.line,
				offset: sourceOffset(inputString, this.source.start)
			};
			if (opts.index) pos = this.positionInside(opts.index);
			else if (opts.word) {
				let index = inputString.slice(sourceOffset(inputString, this.source.start), sourceOffset(inputString, this.source.end)).indexOf(opts.word);
				if (index !== -1) pos = this.positionInside(index);
			}
			return pos;
		}
		positionInside(index) {
			let column = this.source.start.column;
			let line = this.source.start.line;
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let offset = sourceOffset(inputString, this.source.start);
			let end = offset + index;
			for (let i = offset; i < end; i++) if (inputString[i] === "\n") {
				column = 1;
				line += 1;
			} else column += 1;
			return {
				column,
				line,
				offset: end
			};
		}
		prev() {
			if (!this.parent) return void 0;
			let index = this.parent.index(this);
			return this.parent.nodes[index - 1];
		}
		rangeBy(opts = {}) {
			let inputString = "document" in this.source.input ? this.source.input.document : this.source.input.css;
			let start = {
				column: this.source.start.column,
				line: this.source.start.line,
				offset: sourceOffset(inputString, this.source.start)
			};
			let end = this.source.end ? {
				column: this.source.end.column + 1,
				line: this.source.end.line,
				offset: typeof this.source.end.offset === "number" ? this.source.end.offset : sourceOffset(inputString, this.source.end) + 1
			} : {
				column: start.column + 1,
				line: start.line,
				offset: start.offset + 1
			};
			if (opts.word) {
				let index = inputString.slice(sourceOffset(inputString, this.source.start), sourceOffset(inputString, this.source.end)).indexOf(opts.word);
				if (index !== -1) {
					start = this.positionInside(index);
					end = this.positionInside(index + opts.word.length);
				}
			} else {
				if (opts.start) start = {
					column: opts.start.column,
					line: opts.start.line,
					offset: sourceOffset(inputString, opts.start)
				};
				else if (typeof opts.index === "number") start = this.positionInside(opts.index);
				if (opts.end) end = {
					column: opts.end.column,
					line: opts.end.line,
					offset: sourceOffset(inputString, opts.end)
				};
				else if (typeof opts.endIndex === "number") end = this.positionInside(opts.endIndex);
				else if (typeof opts.index === "number") end = this.positionInside(opts.index + 1);
			}
			if (end.line < start.line || end.line === start.line && end.column <= start.column) end = {
				column: start.column + 1,
				line: start.line,
				offset: start.offset + 1
			};
			return {
				end,
				start
			};
		}
		raw(prop, defaultType) {
			return new Stringifier().raw(this, prop, defaultType);
		}
		remove() {
			if (this.parent) this.parent.removeChild(this);
			this.parent = void 0;
			return this;
		}
		replaceWith(...nodes) {
			if (this.parent) {
				let bookmark = this;
				let foundSelf = false;
				for (let node of nodes) if (node === this) foundSelf = true;
				else if (foundSelf) {
					this.parent.insertAfter(bookmark, node);
					bookmark = node;
				} else this.parent.insertBefore(bookmark, node);
				if (!foundSelf) this.remove();
			}
			return this;
		}
		root() {
			let result = this;
			while (result.parent && result.parent.type !== "document") result = result.parent;
			return result;
		}
		toJSON(_, inputs) {
			let emitInputs = inputs == null;
			inputs = inputs || /* @__PURE__ */ new Map();
			let holderOfRoot = [];
			let queue = [[
				this,
				holderOfRoot,
				0
			]];
			for (let step = 0; step < queue.length; step++) {
				let [node, holder, key] = queue[step];
				let fixed = {};
				holder[key] = fixed;
				for (let name in node) {
					if (!Object.prototype.hasOwnProperty.call(node, name))
 /* c8 ignore next 2 */
					continue;
					if (name === "parent" || name === "proxyCache") continue;
					let value = node[name];
					if (Array.isArray(value)) {
						let fixedArray = [];
						fixed[name] = fixedArray;
						for (let i = 0; i < value.length; i++) {
							let item = value[i];
							if (typeof item === "object" && item.toJSON) {
								if (item.toJSON === Node.prototype.toJSON) queue.push([
									item,
									fixedArray,
									i
								]);
								else fixedArray[i] = item.toJSON(null, inputs);
							} else fixedArray[i] = item;
						}
					} else if (typeof value === "object" && value.toJSON) {
						if (value.toJSON === Node.prototype.toJSON) queue.push([
							value,
							fixed,
							name
						]);
						else fixed[name] = value.toJSON(null, inputs);
					} else if (name === "source") {
						if (value == null) continue;
						let inputId = inputs.get(value.input);
						if (inputId == null) {
							inputId = inputs.size;
							inputs.set(value.input, inputId);
						}
						fixed[name] = {
							end: value.end,
							inputId,
							start: value.start
						};
					} else fixed[name] = value;
				}
			}
			let fixed = holderOfRoot[0];
			if (emitInputs) fixed.inputs = [...inputs.keys()].map((input) => input.toJSON());
			return fixed;
		}
		toProxy() {
			if (!this.proxyCache) this.proxyCache = new Proxy(this, this.getProxyProcessor());
			return this.proxyCache;
		}
		toString(stringifier = stringify) {
			if (stringifier.stringify) stringifier = stringifier.stringify;
			let result = "";
			stringifier(this, (i) => {
				result += i;
			});
			return result;
		}
		warn(result, text, opts = {}) {
			let data = { node: this };
			for (let i in opts) data[i] = opts[i];
			return result.warn(text, data);
		}
	};
	module.exports = Node;
	Node.default = Node;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/comment.js
var require_comment = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Node = require_node();
	var Comment = class extends Node {
		constructor(defaults) {
			super(defaults);
			this.type = "comment";
		}
	};
	module.exports = Comment;
	Comment.default = Comment;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/declaration.js
var require_declaration = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Node = require_node();
	var Declaration = class extends Node {
		get variable() {
			return this.prop.startsWith("--") || this.prop[0] === "$";
		}
		constructor(defaults) {
			if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") defaults = {
				...defaults,
				value: String(defaults.value)
			};
			super(defaults);
			this.type = "decl";
		}
	};
	module.exports = Declaration;
	Declaration.default = Declaration;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/container.js
var require_container = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Comment = require_comment();
	var Declaration = require_declaration();
	var Node = require_node();
	var { isClean, my } = require_symbols();
	var AtRule;
	var parse;
	var Root;
	var Rule;
	function cleanSource(nodes) {
		let stack = nodes.slice();
		while (stack.length > 0) {
			let node = stack.pop();
			delete node.source;
			if (node.nodes) {
				node.nodes = node.nodes.slice();
				for (let i of node.nodes) stack.push(i);
			}
		}
		return nodes.slice();
	}
	function markTreeDirty(node) {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			next[isClean] = false;
			if (next.proxyOf.nodes) for (let i of next.proxyOf.nodes) stack.push(i);
		}
	}
	var Container = class Container extends Node {
		get first() {
			if (!this.proxyOf.nodes) return void 0;
			return this.proxyOf.nodes[0];
		}
		get last() {
			if (!this.proxyOf.nodes) return void 0;
			return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
		}
		append(...children) {
			for (let child of children) {
				let nodes = this.normalize(child, this.last);
				for (let node of nodes) this.proxyOf.nodes.push(node);
			}
			this.markDirty();
			return this;
		}
		cleanRaws(keepBetween) {
			let stack = [this];
			while (stack.length > 0) {
				let node = stack.pop();
				if (node !== this && node.cleanRaws !== Container.prototype.cleanRaws) {
					node.cleanRaws(keepBetween);
					continue;
				}
				Node.prototype.cleanRaws.call(node, keepBetween);
				if (node.nodes) for (let child of node.nodes) stack.push(child);
			}
		}
		each(callback) {
			if (!this.proxyOf.nodes) return void 0;
			let iterator = this.getIterator();
			let index, result;
			while (this.indexes[iterator] < this.proxyOf.nodes.length) {
				index = this.indexes[iterator];
				result = callback(this.proxyOf.nodes[index], index);
				if (result === false) break;
				this.indexes[iterator] += 1;
			}
			delete this.indexes[iterator];
			return result;
		}
		every(condition) {
			return this.nodes.every(condition);
		}
		getIterator() {
			if (!this.lastEach) this.lastEach = 0;
			if (!this.indexes) this.indexes = {};
			this.lastEach += 1;
			let iterator = this.lastEach;
			this.indexes[iterator] = 0;
			return iterator;
		}
		getProxyProcessor() {
			return {
				get(node, prop) {
					if (prop === "proxyOf") return node;
					else if (!node[prop]) return node[prop];
					else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) return (...args) => {
						return node[prop](...args.map((i) => {
							if (typeof i === "function") return (child, index) => i(child.toProxy(), index);
							else return i;
						}));
					};
					else if (prop === "every" || prop === "some") return (cb) => {
						return node[prop]((child, ...other) => cb(child.toProxy(), ...other));
					};
					else if (prop === "root") return () => node.root().toProxy();
					else if (prop === "nodes") return node.nodes.map((i) => i.toProxy());
					else if (prop === "first" || prop === "last") return node[prop].toProxy();
					else return node[prop];
				},
				set(node, prop, value) {
					if (node[prop] === value) return true;
					node[prop] = value;
					if (prop === "name" || prop === "params" || prop === "selector") node.markDirty();
					return true;
				}
			};
		}
		index(child) {
			if (typeof child === "number") return child;
			if (child.proxyOf) child = child.proxyOf;
			return this.proxyOf.nodes.indexOf(child);
		}
		insertAfter(exist, add) {
			let existIndex = this.index(exist);
			let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
			existIndex = this.index(exist);
			for (let node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (existIndex < index) this.indexes[id] = index + nodes.length;
			}
			this.markDirty();
			return this;
		}
		insertBefore(exist, add) {
			let existIndex = this.index(exist);
			let type = existIndex === 0 ? "prepend" : false;
			let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
			existIndex = this.index(exist);
			for (let node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (existIndex <= index) this.indexes[id] = index + nodes.length;
			}
			this.markDirty();
			return this;
		}
		normalize(nodes, sample) {
			if (typeof nodes === "string") nodes = cleanSource(parse(nodes).nodes);
			else if (typeof nodes === "undefined") nodes = [];
			else if (Array.isArray(nodes)) {
				nodes = nodes.slice(0);
				for (let i of nodes) if (i.parent) i.parent.removeChild(i, "ignore");
			} else if (nodes.type === "root" && this.type !== "document") {
				nodes = nodes.nodes.slice(0);
				for (let i of nodes) if (i.parent) i.parent.removeChild(i, "ignore");
			} else if (nodes.type) nodes = [nodes];
			else if (nodes.prop) {
				if (typeof nodes.value === "undefined") throw new Error("Value field is missed in node creation");
				else if (typeof nodes.value !== "string") nodes.value = String(nodes.value);
				nodes = [new Declaration(nodes)];
			} else if (nodes.selector || nodes.selectors) nodes = [new Rule(nodes)];
			else if (nodes.name) nodes = [new AtRule(nodes)];
			else if (nodes.text) nodes = [new Comment(nodes)];
			else throw new Error("Unknown node type in node creation");
			return nodes.map((i) => {
				/* c8 ignore next */
				if (!i[my]) Container.rebuild(i);
				i = i.proxyOf;
				if (i.parent) i.parent.removeChild(i);
				if (i[isClean]) markTreeDirty(i);
				if (!i.raws) i.raws = {};
				if (typeof i.raws.before === "undefined") {
					if (sample && typeof sample.raws.before !== "undefined") i.raws.before = sample.raws.before.replace(/\S/g, "");
				}
				i.parent = this.proxyOf;
				return i;
			});
		}
		prepend(...children) {
			children = children.reverse();
			for (let child of children) {
				let nodes = this.normalize(child, this.first, "prepend").reverse();
				for (let node of nodes) this.proxyOf.nodes.unshift(node);
				for (let id in this.indexes) this.indexes[id] = this.indexes[id] + nodes.length;
			}
			this.markDirty();
			return this;
		}
		push(child) {
			child.parent = this;
			this.proxyOf.nodes.push(child);
			return this;
		}
		removeAll() {
			for (let node of this.proxyOf.nodes) node.parent = void 0;
			this.proxyOf.nodes = [];
			this.markDirty();
			return this;
		}
		removeChild(child) {
			child = this.index(child);
			this.proxyOf.nodes[child].parent = void 0;
			this.proxyOf.nodes.splice(child, 1);
			let index;
			for (let id in this.indexes) {
				index = this.indexes[id];
				if (index >= child) this.indexes[id] = index - 1;
			}
			this.markDirty();
			return this;
		}
		replaceValues(pattern, opts, callback) {
			if (!callback) {
				callback = opts;
				opts = {};
			}
			this.walkDecls((decl) => {
				if (opts.props && !opts.props.includes(decl.prop)) return;
				if (opts.fast && !decl.value.includes(opts.fast)) return;
				decl.value = decl.value.replace(pattern, callback);
			});
			this.markDirty();
			return this;
		}
		some(condition) {
			return this.nodes.some(condition);
		}
		walk(callback) {
			if (!this.proxyOf.nodes) return void 0;
			let stack = [{
				iterator: this.getIterator(),
				node: this.proxyOf
			}];
			while (stack.length > 0) {
				let { iterator, node } = stack[stack.length - 1];
				let index = node.indexes[iterator];
				if (index >= node.proxyOf.nodes.length) {
					delete node.indexes[iterator];
					stack.pop();
					let parent = stack[stack.length - 1];
					if (parent) parent.node.indexes[parent.iterator] += 1;
					continue;
				}
				let child = node.proxyOf.nodes[index];
				let result;
				try {
					result = callback(child, index);
				} catch (e) {
					throw child.addToError(e);
				}
				if (result === false) {
					for (let opened of stack) delete opened.node.indexes[opened.iterator];
					return false;
				}
				if (child.walk && child.proxyOf.nodes) stack.push({
					iterator: child.getIterator(),
					node: child
				});
				else node.indexes[iterator] += 1;
			}
		}
		walkAtRules(name, callback) {
			if (!callback) {
				callback = name;
				return this.walk((child, i) => {
					if (child.type === "atrule") return callback(child, i);
				});
			}
			if (name instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "atrule" && name.test(child.name)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "atrule" && child.name === name) return callback(child, i);
			});
		}
		walkComments(callback) {
			return this.walk((child, i) => {
				if (child.type === "comment") return callback(child, i);
			});
		}
		walkDecls(prop, callback) {
			if (!callback) {
				callback = prop;
				return this.walk((child, i) => {
					if (child.type === "decl") return callback(child, i);
				});
			}
			if (prop instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "decl" && prop.test(child.prop)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "decl" && child.prop === prop) return callback(child, i);
			});
		}
		walkRules(selector, callback) {
			if (!callback) {
				callback = selector;
				return this.walk((child, i) => {
					if (child.type === "rule") return callback(child, i);
				});
			}
			if (selector instanceof RegExp) return this.walk((child, i) => {
				if (child.type === "rule" && selector.test(child.selector)) return callback(child, i);
			});
			return this.walk((child, i) => {
				if (child.type === "rule" && child.selector === selector) return callback(child, i);
			});
		}
	};
	Container.registerParse = (dependant) => {
		parse = dependant;
	};
	Container.registerRule = (dependant) => {
		Rule = dependant;
	};
	Container.registerAtRule = (dependant) => {
		AtRule = dependant;
	};
	Container.registerRoot = (dependant) => {
		Root = dependant;
	};
	module.exports = Container;
	Container.default = Container;
	/* c8 ignore start */
	Container.rebuild = (node) => {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			if (next.type === "atrule") Object.setPrototypeOf(next, AtRule.prototype);
			else if (next.type === "rule") Object.setPrototypeOf(next, Rule.prototype);
			else if (next.type === "decl") Object.setPrototypeOf(next, Declaration.prototype);
			else if (next.type === "comment") Object.setPrototypeOf(next, Comment.prototype);
			else if (next.type === "root") Object.setPrototypeOf(next, Root.prototype);
			next[my] = true;
			if (next.nodes) for (let child of next.nodes) stack.push(child);
		}
	};
}));
/* c8 ignore stop */
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/at-rule.js
var require_at_rule = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Container = require_container();
	var AtRule = class extends Container {
		constructor(defaults) {
			super(defaults);
			this.type = "atrule";
		}
		append(...children) {
			if (!this.proxyOf.nodes) this.nodes = [];
			return super.append(...children);
		}
		prepend(...children) {
			if (!this.proxyOf.nodes) this.nodes = [];
			return super.prepend(...children);
		}
	};
	module.exports = AtRule;
	AtRule.default = AtRule;
	Container.registerAtRule(AtRule);
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/document.js
var require_document = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Container = require_container();
	var LazyResult;
	var Processor;
	var Document = class extends Container {
		constructor(defaults) {
			super({
				type: "document",
				...defaults
			});
			if (!this.nodes) this.nodes = [];
		}
		toResult(opts = {}) {
			return new LazyResult(new Processor(), this, opts).stringify();
		}
	};
	Document.registerLazyResult = (dependant) => {
		LazyResult = dependant;
	};
	Document.registerProcessor = (dependant) => {
		Processor = dependant;
	};
	module.exports = Document;
	Document.default = Document;
}));
//#endregion
//#region node_modules/.pnpm/nanoid@3.3.18/node_modules/nanoid/non-secure/index.cjs
var require_non_secure = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
	var customAlphabet = (alphabet, defaultSize = 21) => {
		return (size = defaultSize) => {
			let id = "";
			let i = size | 0;
			while (i-- > 0) id += alphabet[Math.random() * alphabet.length | 0];
			return id;
		};
	};
	var nanoid = (size = 21) => {
		let id = "";
		let i = size | 0;
		while (i-- > 0) id += urlAlphabet[Math.random() * 64 | 0];
		return id;
	};
	module.exports = {
		nanoid,
		customAlphabet
	};
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
	/**
	* Encode an integer in the range of 0 to 63 to a single base 64 digit.
	*/
	exports.encode = function(number) {
		if (0 <= number && number < intToCharMap.length) return intToCharMap[number];
		throw new TypeError("Must be between 0 and 63: " + number);
	};
	/**
	* Decode a single base 64 character code digit to an integer. Returns -1 on
	* failure.
	*/
	exports.decode = function(charCode) {
		var bigA = 65;
		var bigZ = 90;
		var littleA = 97;
		var littleZ = 122;
		var zero = 48;
		var nine = 57;
		var plus = 43;
		var slash = 47;
		var littleOffset = 26;
		var numberOffset = 52;
		if (bigA <= charCode && charCode <= bigZ) return charCode - bigA;
		if (littleA <= charCode && charCode <= littleZ) return charCode - littleA + littleOffset;
		if (zero <= charCode && charCode <= nine) return charCode - zero + numberOffset;
		if (charCode == plus) return 62;
		if (charCode == slash) return 63;
		return -1;
	};
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/base64-vlq.js
var require_base64_vlq = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64 = require_base64();
	var VLQ_BASE_SHIFT = 5;
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
	var VLQ_BASE_MASK = VLQ_BASE - 1;
	var VLQ_CONTINUATION_BIT = VLQ_BASE;
	/**
	* Converts from a two-complement value to a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	*   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	*/
	function toVLQSigned(aValue) {
		return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
	}
	/**
	* Converts to a two-complement value from a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	*   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	*/
	function fromVLQSigned(aValue) {
		var isNegative = (aValue & 1) === 1;
		var shifted = aValue >> 1;
		return isNegative ? -shifted : shifted;
	}
	/**
	* Returns the base 64 VLQ encoded value.
	*/
	exports.encode = function base64VLQ_encode(aValue) {
		var encoded = "";
		var digit;
		var vlq = toVLQSigned(aValue);
		do {
			digit = vlq & VLQ_BASE_MASK;
			vlq >>>= VLQ_BASE_SHIFT;
			if (vlq > 0) digit |= VLQ_CONTINUATION_BIT;
			encoded += base64.encode(digit);
		} while (vlq > 0);
		return encoded;
	};
	/**
	* Decodes the next base 64 VLQ value from the given string and returns the
	* value and the rest of the string via the out parameter.
	*/
	exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
		var strLen = aStr.length;
		var result = 0;
		var shift = 0;
		var continuation, digit;
		do {
			if (aIndex >= strLen) throw new Error("Expected more digits in base 64 VLQ value.");
			digit = base64.decode(aStr.charCodeAt(aIndex++));
			if (digit === -1) throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
			continuation = !!(digit & VLQ_CONTINUATION_BIT);
			digit &= VLQ_BASE_MASK;
			result = result + (digit << shift);
			shift += VLQ_BASE_SHIFT;
		} while (continuation);
		aOutParam.value = fromVLQSigned(result);
		aOutParam.rest = aIndex;
	};
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* This is a helper function for getting values from parameter/options
	* objects.
	*
	* @param args The object we are extracting values from
	* @param name The name of the property we are getting.
	* @param defaultValue An optional value to return if the property is missing
	* from the object. If this is not specified and the property is missing, an
	* error will be thrown.
	*/
	function getArg(aArgs, aName, aDefaultValue) {
		if (aName in aArgs) return aArgs[aName];
		else if (arguments.length === 3) return aDefaultValue;
		else throw new Error("\"" + aName + "\" is a required argument.");
	}
	exports.getArg = getArg;
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;
	function urlParse(aUrl) {
		var match = aUrl.match(urlRegexp);
		if (!match) return null;
		return {
			scheme: match[1],
			auth: match[2],
			host: match[3],
			port: match[4],
			path: match[5]
		};
	}
	exports.urlParse = urlParse;
	function urlGenerate(aParsedUrl) {
		var url = "";
		if (aParsedUrl.scheme) url += aParsedUrl.scheme + ":";
		url += "//";
		if (aParsedUrl.auth) url += aParsedUrl.auth + "@";
		if (aParsedUrl.host) url += aParsedUrl.host;
		if (aParsedUrl.port) url += ":" + aParsedUrl.port;
		if (aParsedUrl.path) url += aParsedUrl.path;
		return url;
	}
	exports.urlGenerate = urlGenerate;
	var MAX_CACHED_INPUTS = 32;
	/**
	* Takes some function `f(input) -> result` and returns a memoized version of
	* `f`.
	*
	* We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
	* memoization is a dumb-simple, linear least-recently-used cache.
	*/
	function lruMemoize(f) {
		var cache = [];
		return function(input) {
			for (var i = 0; i < cache.length; i++) if (cache[i].input === input) {
				var temp = cache[0];
				cache[0] = cache[i];
				cache[i] = temp;
				return cache[0].result;
			}
			var result = f(input);
			cache.unshift({
				input,
				result
			});
			if (cache.length > MAX_CACHED_INPUTS) cache.pop();
			return result;
		};
	}
	/**
	* Normalizes a path, or the path portion of a URL:
	*
	* - Replaces consecutive slashes with one slash.
	* - Removes unnecessary '.' parts.
	* - Removes unnecessary '<dir>/..' parts.
	*
	* Based on code in the Node.js 'path' core module.
	*
	* @param aPath The path or url to normalize.
	*/
	var normalize = lruMemoize(function normalize(aPath) {
		var path = aPath;
		var url = urlParse(aPath);
		if (url) {
			if (!url.path) return aPath;
			path = url.path;
		}
		var isAbsolute = exports.isAbsolute(path);
		var parts = [];
		var start = 0;
		var i = 0;
		while (true) {
			start = i;
			i = path.indexOf("/", start);
			if (i === -1) {
				parts.push(path.slice(start));
				break;
			} else {
				parts.push(path.slice(start, i));
				while (i < path.length && path[i] === "/") i++;
			}
		}
		for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
			part = parts[i];
			if (part === ".") parts.splice(i, 1);
			else if (part === "..") up++;
			else if (up > 0) {
				if (part === "") {
					parts.splice(i + 1, up);
					up = 0;
				} else {
					parts.splice(i, 2);
					up--;
				}
			}
		}
		path = parts.join("/");
		if (path === "") path = isAbsolute ? "/" : ".";
		if (url) {
			url.path = path;
			return urlGenerate(url);
		}
		return path;
	});
	exports.normalize = normalize;
	/**
	* Joins two paths/URLs.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be joined with the root.
	*
	* - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	*   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	*   first.
	* - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	*   is updated with the result and aRoot is returned. Otherwise the result
	*   is returned.
	*   - If aPath is absolute, the result is aPath.
	*   - Otherwise the two paths are joined with a slash.
	* - Joining for example 'http://' and 'www.example.com' is also supported.
	*/
	function join(aRoot, aPath) {
		if (aRoot === "") aRoot = ".";
		if (aPath === "") aPath = ".";
		var aPathUrl = urlParse(aPath);
		var aRootUrl = urlParse(aRoot);
		if (aRootUrl) aRoot = aRootUrl.path || "/";
		if (aPathUrl && !aPathUrl.scheme) {
			if (aRootUrl) aPathUrl.scheme = aRootUrl.scheme;
			return urlGenerate(aPathUrl);
		}
		if (aPathUrl || aPath.match(dataUrlRegexp)) return aPath;
		if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
			aRootUrl.host = aPath;
			return urlGenerate(aRootUrl);
		}
		var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
		if (aRootUrl) {
			aRootUrl.path = joined;
			return urlGenerate(aRootUrl);
		}
		return joined;
	}
	exports.join = join;
	exports.isAbsolute = function(aPath) {
		return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
	};
	/**
	* Make a path relative to a URL or another path.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be made relative to aRoot.
	*/
	function relative(aRoot, aPath) {
		if (aRoot === "") aRoot = ".";
		aRoot = aRoot.replace(/\/$/, "");
		var level = 0;
		while (aPath.indexOf(aRoot + "/") !== 0) {
			var index = aRoot.lastIndexOf("/");
			if (index < 0) return aPath;
			aRoot = aRoot.slice(0, index);
			if (aRoot.match(/^([^\/]+:\/)?\/*$/)) return aPath;
			++level;
		}
		return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;
	var supportsNullProto = function() {
		return !("__proto__" in Object.create(null));
	}();
	function identity(s) {
		return s;
	}
	/**
	* Because behavior goes wacky when you set `__proto__` on objects, we
	* have to prefix all the strings in our set with an arbitrary character.
	*
	* See https://github.com/mozilla/source-map/pull/31 and
	* https://github.com/mozilla/source-map/issues/30
	*
	* @param String aStr
	*/
	function toSetString(aStr) {
		if (isProtoString(aStr)) return "$" + aStr;
		return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;
	function fromSetString(aStr) {
		if (isProtoString(aStr)) return aStr.slice(1);
		return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;
	function isProtoString(s) {
		if (!s) return false;
		var length = s.length;
		if (length < 9) return false;
		if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) return false;
		for (var i = length - 10; i >= 0; i--) if (s.charCodeAt(i) !== 36) return false;
		return true;
	}
	/**
	* Comparator between two mappings where the original positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same original source/line/column, but different generated
	* line and column the same. Useful when searching for a mapping with a
	* stubbed out mapping.
	*/
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
		var cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0 || onlyCompareOriginal) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;
	function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
		var cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0 || onlyCompareOriginal) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
	/**
	* Comparator between two mappings with deflated source and name indices where
	* the generated positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same generated line and column, but different
	* source/name/original line and column the same. Useful when searching for a
	* mapping with a stubbed out mapping.
	*/
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
		var cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0 || onlyCompareGenerated) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
		var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0 || onlyCompareGenerated) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
	function strcmp(aStr1, aStr2) {
		if (aStr1 === aStr2) return 0;
		if (aStr1 === null) return 1;
		if (aStr2 === null) return -1;
		if (aStr1 > aStr2) return 1;
		return -1;
	}
	/**
	* Comparator between two mappings with inflated source and name strings where
	* the generated positions are compared.
	*/
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
		var cmp = mappingA.generatedLine - mappingB.generatedLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		if (cmp !== 0) return cmp;
		cmp = strcmp(mappingA.source, mappingB.source);
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalLine - mappingB.originalLine;
		if (cmp !== 0) return cmp;
		cmp = mappingA.originalColumn - mappingB.originalColumn;
		if (cmp !== 0) return cmp;
		return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
	/**
	* Strip any JSON XSSI avoidance prefix from the string (as documented
	* in the source maps specification), and then parse the string as
	* JSON.
	*/
	function parseSourceMapInput(str) {
		return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
	}
	exports.parseSourceMapInput = parseSourceMapInput;
	/**
	* Compute the URL of a source given the the source root, the source's
	* URL, and the source map's URL.
	*/
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
		sourceURL = sourceURL || "";
		if (sourceRoot) {
			if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") sourceRoot += "/";
			sourceURL = sourceRoot + sourceURL;
		}
		if (sourceMapURL) {
			var parsed = urlParse(sourceMapURL);
			if (!parsed) throw new Error("sourceMapURL could not be parsed");
			if (parsed.path) {
				var index = parsed.path.lastIndexOf("/");
				if (index >= 0) parsed.path = parsed.path.substring(0, index + 1);
			}
			sourceURL = join(urlGenerate(parsed), sourceURL);
		}
		return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/array-set.js
var require_array_set = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	/**
	* A data structure which is a combination of an array and a set. Adding a new
	* member is O(1), testing for membership is O(1), and finding the index of an
	* element is O(1). Removing elements from the set is not supported. Only
	* strings are supported for membership.
	*/
	function ArraySet() {
		this._array = [];
		this._set = hasNativeMap ? /* @__PURE__ */ new Map() : Object.create(null);
	}
	/**
	* Static method for creating ArraySet instances from an existing array.
	*/
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
		var set = new ArraySet();
		for (var i = 0, len = aArray.length; i < len; i++) set.add(aArray[i], aAllowDuplicates);
		return set;
	};
	/**
	* Return how many unique items are in this ArraySet. If duplicates have been
	* added, than those do not count towards the size.
	*
	* @returns Number
	*/
	ArraySet.prototype.size = function ArraySet_size() {
		return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	/**
	* Add the given string to this set.
	*
	* @param String aStr
	*/
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
		var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
		var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
		var idx = this._array.length;
		if (!isDuplicate || aAllowDuplicates) this._array.push(aStr);
		if (!isDuplicate) {
			if (hasNativeMap) this._set.set(aStr, idx);
			else this._set[sStr] = idx;
		}
	};
	/**
	* Is the given string a member of this set?
	*
	* @param String aStr
	*/
	ArraySet.prototype.has = function ArraySet_has(aStr) {
		if (hasNativeMap) return this._set.has(aStr);
		else {
			var sStr = util.toSetString(aStr);
			return has.call(this._set, sStr);
		}
	};
	/**
	* What is the index of the given string in the array?
	*
	* @param String aStr
	*/
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
		if (hasNativeMap) {
			var idx = this._set.get(aStr);
			if (idx >= 0) return idx;
		} else {
			var sStr = util.toSetString(aStr);
			if (has.call(this._set, sStr)) return this._set[sStr];
		}
		throw new Error("\"" + aStr + "\" is not in the set.");
	};
	/**
	* What is the element at the given index?
	*
	* @param Number aIdx
	*/
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
		if (aIdx >= 0 && aIdx < this._array.length) return this._array[aIdx];
		throw new Error("No element indexed by " + aIdx);
	};
	/**
	* Returns the array representation of this set (which has the proper indices
	* indicated by indexOf). Note that this is a copy of the internal array used
	* for storing the members so that no one can mess with internal state.
	*/
	ArraySet.prototype.toArray = function ArraySet_toArray() {
		return this._array.slice();
	};
	exports.ArraySet = ArraySet;
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/mapping-list.js
var require_mapping_list = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	/**
	* Determine whether mappingB is after mappingA with respect to generated
	* position.
	*/
	function generatedPositionAfter(mappingA, mappingB) {
		var lineA = mappingA.generatedLine;
		var lineB = mappingB.generatedLine;
		var columnA = mappingA.generatedColumn;
		var columnB = mappingB.generatedColumn;
		return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	/**
	* A data structure to provide a sorted view of accumulated mappings in a
	* performance conscious manner. It trades a neglibable overhead in general
	* case for a large speedup in case of mappings being added in order.
	*/
	function MappingList() {
		this._array = [];
		this._sorted = true;
		this._last = {
			generatedLine: -1,
			generatedColumn: 0
		};
	}
	/**
	* Iterate through internal items. This method takes the same arguments that
	* `Array.prototype.forEach` takes.
	*
	* NOTE: The order of the mappings is NOT guaranteed.
	*/
	MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
		this._array.forEach(aCallback, aThisArg);
	};
	/**
	* Add the given source mapping.
	*
	* @param Object aMapping
	*/
	MappingList.prototype.add = function MappingList_add(aMapping) {
		if (generatedPositionAfter(this._last, aMapping)) {
			this._last = aMapping;
			this._array.push(aMapping);
		} else {
			this._sorted = false;
			this._array.push(aMapping);
		}
	};
	/**
	* Returns the flat, sorted array of mappings. The mappings are sorted by
	* generated position.
	*
	* WARNING: This method returns internal data without copying, for
	* performance. The return value must NOT be mutated, and should be treated as
	* an immutable borrow. If you want to take ownership, you must make your own
	* copy.
	*/
	MappingList.prototype.toArray = function MappingList_toArray() {
		if (!this._sorted) {
			this._array.sort(util.compareByGeneratedPositionsInflated);
			this._sorted = true;
		}
		return this._array;
	};
	exports.MappingList = MappingList;
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/source-map-generator.js
var require_source_map_generator = /* @__PURE__ */ __commonJSMin(((exports) => {
	var base64VLQ = require_base64_vlq();
	var util = require_util();
	var ArraySet = require_array_set().ArraySet;
	var MappingList = require_mapping_list().MappingList;
	/**
	* An instance of the SourceMapGenerator represents a source map which is
	* being built incrementally. You may pass an object with the following
	* properties:
	*
	*   - file: The filename of the generated source.
	*   - sourceRoot: A root for all relative URLs in this source map.
	*/
	function SourceMapGenerator(aArgs) {
		if (!aArgs) aArgs = {};
		this._file = util.getArg(aArgs, "file", null);
		this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
		this._skipValidation = util.getArg(aArgs, "skipValidation", false);
		this._ignoreInvalidMapping = util.getArg(aArgs, "ignoreInvalidMapping", false);
		this._sources = new ArraySet();
		this._names = new ArraySet();
		this._mappings = new MappingList();
		this._sourcesContents = null;
	}
	SourceMapGenerator.prototype._version = 3;
	/**
	* Creates a new SourceMapGenerator based on a SourceMapConsumer
	*
	* @param aSourceMapConsumer The SourceMap.
	*/
	SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer, generatorOps) {
		var sourceRoot = aSourceMapConsumer.sourceRoot;
		var generator = new SourceMapGenerator(Object.assign(generatorOps || {}, {
			file: aSourceMapConsumer.file,
			sourceRoot
		}));
		aSourceMapConsumer.eachMapping(function(mapping) {
			var newMapping = { generated: {
				line: mapping.generatedLine,
				column: mapping.generatedColumn
			} };
			if (mapping.source != null) {
				newMapping.source = mapping.source;
				if (sourceRoot != null) newMapping.source = util.relative(sourceRoot, newMapping.source);
				newMapping.original = {
					line: mapping.originalLine,
					column: mapping.originalColumn
				};
				if (mapping.name != null) newMapping.name = mapping.name;
			}
			generator.addMapping(newMapping);
		});
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var sourceRelative = sourceFile;
			if (sourceRoot !== null) sourceRelative = util.relative(sourceRoot, sourceFile);
			if (!generator._sources.has(sourceRelative)) generator._sources.add(sourceRelative);
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) generator.setSourceContent(sourceFile, content);
		});
		return generator;
	};
	/**
	* Add a single mapping from original source line and column to the generated
	* source's line and column for this source map being created. The mapping
	* object should have the following properties:
	*
	*   - generated: An object with the generated line and column positions.
	*   - original: An object with the original line and column positions.
	*   - source: The original source file (relative to the sourceRoot).
	*   - name: An optional original token name for this mapping.
	*/
	SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
		var generated = util.getArg(aArgs, "generated");
		var original = util.getArg(aArgs, "original", null);
		var source = util.getArg(aArgs, "source", null);
		var name = util.getArg(aArgs, "name", null);
		if (!this._skipValidation) {
			if (this._validateMapping(generated, original, source, name) === false) return;
		}
		if (source != null) {
			source = String(source);
			if (!this._sources.has(source)) this._sources.add(source);
		}
		if (name != null) {
			name = String(name);
			if (!this._names.has(name)) this._names.add(name);
		}
		this._mappings.add({
			generatedLine: generated.line,
			generatedColumn: generated.column,
			originalLine: original != null && original.line,
			originalColumn: original != null && original.column,
			source,
			name
		});
	};
	/**
	* Set the source content for a source file.
	*/
	SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
		var source = aSourceFile;
		if (this._sourceRoot != null) source = util.relative(this._sourceRoot, source);
		if (aSourceContent != null) {
			if (!this._sourcesContents) this._sourcesContents = Object.create(null);
			this._sourcesContents[util.toSetString(source)] = aSourceContent;
		} else if (this._sourcesContents) {
			delete this._sourcesContents[util.toSetString(source)];
			if (Object.keys(this._sourcesContents).length === 0) this._sourcesContents = null;
		}
	};
	/**
	* Applies the mappings of a sub-source-map for a specific source file to the
	* source map being generated. Each mapping to the supplied source file is
	* rewritten using the supplied source map. Note: The resolution for the
	* resulting mappings is the minimium of this map and the supplied map.
	*
	* @param aSourceMapConsumer The source map to be applied.
	* @param aSourceFile Optional. The filename of the source file.
	*        If omitted, SourceMapConsumer's file property will be used.
	* @param aSourceMapPath Optional. The dirname of the path to the source map
	*        to be applied. If relative, it is relative to the SourceMapConsumer.
	*        This parameter is needed when the two source maps aren't in the same
	*        directory, and the source map to be applied contains relative source
	*        paths. If so, those relative source paths need to be rewritten
	*        relative to the SourceMapGenerator.
	*/
	SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
		var sourceFile = aSourceFile;
		if (aSourceFile == null) {
			if (aSourceMapConsumer.file == null) throw new Error("SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's \"file\" property. Both were omitted.");
			sourceFile = aSourceMapConsumer.file;
		}
		var sourceRoot = this._sourceRoot;
		if (sourceRoot != null) sourceFile = util.relative(sourceRoot, sourceFile);
		var newSources = new ArraySet();
		var newNames = new ArraySet();
		this._mappings.unsortedForEach(function(mapping) {
			if (mapping.source === sourceFile && mapping.originalLine != null) {
				var original = aSourceMapConsumer.originalPositionFor({
					line: mapping.originalLine,
					column: mapping.originalColumn
				});
				if (original.source != null) {
					mapping.source = original.source;
					if (aSourceMapPath != null) mapping.source = util.join(aSourceMapPath, mapping.source);
					if (sourceRoot != null) mapping.source = util.relative(sourceRoot, mapping.source);
					mapping.originalLine = original.line;
					mapping.originalColumn = original.column;
					if (original.name != null) mapping.name = original.name;
				}
			}
			var source = mapping.source;
			if (source != null && !newSources.has(source)) newSources.add(source);
			var name = mapping.name;
			if (name != null && !newNames.has(name)) newNames.add(name);
		}, this);
		this._sources = newSources;
		this._names = newNames;
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) {
				if (aSourceMapPath != null) sourceFile = util.join(aSourceMapPath, sourceFile);
				if (sourceRoot != null) sourceFile = util.relative(sourceRoot, sourceFile);
				this.setSourceContent(sourceFile, content);
			}
		}, this);
	};
	/**
	* A mapping can have one of the three levels of data:
	*
	*   1. Just the generated position.
	*   2. The Generated position, original position, and original source.
	*   3. Generated and original position, original source, as well as a name
	*      token.
	*
	* To maintain consistency, we validate that any new mapping being added falls
	* in to one of these categories.
	*/
	SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
		if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
			var message = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
			if (this._ignoreInvalidMapping) {
				if (typeof console !== "undefined" && console.warn) console.warn(message);
				return false;
			} else throw new Error(message);
		}
		if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) return;
		else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) return;
		else {
			var message = "Invalid mapping: " + JSON.stringify({
				generated: aGenerated,
				source: aSource,
				original: aOriginal,
				name: aName
			});
			if (this._ignoreInvalidMapping) {
				if (typeof console !== "undefined" && console.warn) console.warn(message);
				return false;
			} else throw new Error(message);
		}
	};
	/**
	* Serialize the accumulated mappings in to the stream of base 64 VLQs
	* specified by the source map format.
	*/
	SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
		var previousGeneratedColumn = 0;
		var previousGeneratedLine = 1;
		var previousOriginalColumn = 0;
		var previousOriginalLine = 0;
		var previousName = 0;
		var previousSource = 0;
		var result = "";
		var next;
		var mapping;
		var nameIdx;
		var sourceIdx;
		var mappings = this._mappings.toArray();
		for (var i = 0, len = mappings.length; i < len; i++) {
			mapping = mappings[i];
			next = "";
			if (mapping.generatedLine !== previousGeneratedLine) {
				previousGeneratedColumn = 0;
				while (mapping.generatedLine !== previousGeneratedLine) {
					next += ";";
					previousGeneratedLine++;
				}
			} else if (i > 0) {
				if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) continue;
				next += ",";
			}
			next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
			previousGeneratedColumn = mapping.generatedColumn;
			if (mapping.source != null) {
				sourceIdx = this._sources.indexOf(mapping.source);
				next += base64VLQ.encode(sourceIdx - previousSource);
				previousSource = sourceIdx;
				next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
				previousOriginalLine = mapping.originalLine - 1;
				next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
				previousOriginalColumn = mapping.originalColumn;
				if (mapping.name != null) {
					nameIdx = this._names.indexOf(mapping.name);
					next += base64VLQ.encode(nameIdx - previousName);
					previousName = nameIdx;
				}
			}
			result += next;
		}
		return result;
	};
	SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
		return aSources.map(function(source) {
			if (!this._sourcesContents) return null;
			if (aSourceRoot != null) source = util.relative(aSourceRoot, source);
			var key = util.toSetString(source);
			return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
		}, this);
	};
	/**
	* Externalize the source map.
	*/
	SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
		var map = {
			version: this._version,
			sources: this._sources.toArray(),
			names: this._names.toArray(),
			mappings: this._serializeMappings()
		};
		if (this._file != null) map.file = this._file;
		if (this._sourceRoot != null) map.sourceRoot = this._sourceRoot;
		if (this._sourcesContents) map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
		return map;
	};
	/**
	* Render the source map being generated to a string.
	*/
	SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
		return JSON.stringify(this.toJSON());
	};
	exports.SourceMapGenerator = SourceMapGenerator;
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/binary-search.js
var require_binary_search = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	/**
	* Recursive implementation of binary search.
	*
	* @param aLow Indices here and lower do not contain the needle.
	* @param aHigh Indices here and higher do not contain the needle.
	* @param aNeedle The element being searched for.
	* @param aHaystack The non-empty array being searched.
	* @param aCompare Function which takes two elements and returns -1, 0, or 1.
	* @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	*     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*/
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
		var mid = Math.floor((aHigh - aLow) / 2) + aLow;
		var cmp = aCompare(aNeedle, aHaystack[mid], true);
		if (cmp === 0) return mid;
		else if (cmp > 0) {
			if (aHigh - mid > 1) return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
			if (aBias == exports.LEAST_UPPER_BOUND) return aHigh < aHaystack.length ? aHigh : -1;
			else return mid;
		} else {
			if (mid - aLow > 1) return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
			if (aBias == exports.LEAST_UPPER_BOUND) return mid;
			else return aLow < 0 ? -1 : aLow;
		}
	}
	/**
	* This is an implementation of binary search which will always try and return
	* the index of the closest element if there is no exact hit. This is because
	* mappings between original and generated line/col pairs are single points,
	* and there is an implicit region between each of them, so a miss just means
	* that you aren't on the very start of a region.
	*
	* @param aNeedle The element you are looking for.
	* @param aHaystack The array that is being searched.
	* @param aCompare A function which takes the needle and an element in the
	*     array and returns -1, 0, or 1 depending on whether the needle is less
	*     than, equal to, or greater than the element, respectively.
	* @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	*     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	*/
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
		if (aHaystack.length === 0) return -1;
		var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
		if (index < 0) return -1;
		while (index - 1 >= 0) {
			if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) break;
			--index;
		}
		return index;
	};
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/quick-sort.js
var require_quick_sort = /* @__PURE__ */ __commonJSMin(((exports) => {
	function SortTemplate(comparator) {
		/**
		* Swap the elements indexed by `x` and `y` in the array `ary`.
		*
		* @param {Array} ary
		*        The array.
		* @param {Number} x
		*        The index of the first item.
		* @param {Number} y
		*        The index of the second item.
		*/
		function swap(ary, x, y) {
			var temp = ary[x];
			ary[x] = ary[y];
			ary[y] = temp;
		}
		/**
		* Returns a random integer within the range `low .. high` inclusive.
		*
		* @param {Number} low
		*        The lower bound on the range.
		* @param {Number} high
		*        The upper bound on the range.
		*/
		function randomIntInRange(low, high) {
			return Math.round(low + Math.random() * (high - low));
		}
		/**
		* The Quick Sort algorithm.
		*
		* @param {Array} ary
		*        An array to sort.
		* @param {function} comparator
		*        Function to use to compare two items.
		* @param {Number} p
		*        Start index of the array
		* @param {Number} r
		*        End index of the array
		*/
		function doQuickSort(ary, comparator, p, r) {
			if (p < r) {
				var pivotIndex = randomIntInRange(p, r);
				var i = p - 1;
				swap(ary, pivotIndex, r);
				var pivot = ary[r];
				for (var j = p; j < r; j++) if (comparator(ary[j], pivot, false) <= 0) {
					i += 1;
					swap(ary, i, j);
				}
				swap(ary, i + 1, j);
				var q = i + 1;
				doQuickSort(ary, comparator, p, q - 1);
				doQuickSort(ary, comparator, q + 1, r);
			}
		}
		return doQuickSort;
	}
	function cloneSort(comparator) {
		let template = SortTemplate.toString();
		return new Function(`return ${template}`)()(comparator);
	}
	/**
	* Sort the given array in-place with the given comparator function.
	*
	* @param {Array} ary
	*        An array to sort.
	* @param {function} comparator
	*        Function to use to compare two items.
	*/
	var sortCache = /* @__PURE__ */ new WeakMap();
	exports.quickSort = function(ary, comparator, start = 0) {
		let doQuickSort = sortCache.get(comparator);
		if (doQuickSort === void 0) {
			doQuickSort = cloneSort(comparator);
			sortCache.set(comparator, doQuickSort);
		}
		doQuickSort(ary, comparator, start, ary.length - 1);
	};
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/source-map-consumer.js
var require_source_map_consumer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = require_util();
	var binarySearch = require_binary_search();
	var ArraySet = require_array_set().ArraySet;
	var base64VLQ = require_base64_vlq();
	var quickSort = require_quick_sort().quickSort;
	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}
	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
		return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	};
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	SourceMapConsumer.prototype._version = 3;
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
		configurable: true,
		enumerable: true,
		get: function() {
			if (!this.__generatedMappings) this._parseMappings(this._mappings, this.sourceRoot);
			return this.__generatedMappings;
		}
	});
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
		configurable: true,
		enumerable: true,
		get: function() {
			if (!this.__originalMappings) this._parseMappings(this._mappings, this.sourceRoot);
			return this.__originalMappings;
		}
	});
	SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
		var c = aStr.charAt(index);
		return c === ";" || c === ",";
	};
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		throw new Error("Subclasses must implement _parseMappings");
	};
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	/**
	* Iterate over each mapping between an original source/line/column and a
	* generated line/column in this source map.
	*
	* @param Function aCallback
	*        The function that is called with each mapping.
	* @param Object aContext
	*        Optional. If specified, this object will be the value of `this` every
	*        time that `aCallback` is called.
	* @param aOrder
	*        Either `SourceMapConsumer.GENERATED_ORDER` or
	*        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	*        iterate over the mappings sorted by the generated file's line/column
	*        order or the original's source/line/column order, respectively. Defaults to
	*        `SourceMapConsumer.GENERATED_ORDER`.
	*/
	SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
		var context = aContext || null;
		var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
		var mappings;
		switch (order) {
			case SourceMapConsumer.GENERATED_ORDER:
				mappings = this._generatedMappings;
				break;
			case SourceMapConsumer.ORIGINAL_ORDER:
				mappings = this._originalMappings;
				break;
			default: throw new Error("Unknown order of iteration.");
		}
		var sourceRoot = this.sourceRoot;
		var boundCallback = aCallback.bind(context);
		var names = this._names;
		var sources = this._sources;
		var sourceMapURL = this._sourceMapURL;
		for (var i = 0, n = mappings.length; i < n; i++) {
			var mapping = mappings[i];
			var source = mapping.source === null ? null : sources.at(mapping.source);
			if (source !== null) source = util.computeSourceURL(sourceRoot, source, sourceMapURL);
			boundCallback({
				source,
				generatedLine: mapping.generatedLine,
				generatedColumn: mapping.generatedColumn,
				originalLine: mapping.originalLine,
				originalColumn: mapping.originalColumn,
				name: mapping.name === null ? null : names.at(mapping.name)
			});
		}
	};
	/**
	* Returns all generated line and column information for the original source,
	* line, and column provided. If no column is provided, returns all mappings
	* corresponding to a either the line we are searching for or the next
	* closest line that has any mappings. Otherwise, returns all mappings
	* corresponding to the given line and either the column we are searching for
	* or the next closest column that has any offsets.
	*
	* The only argument is an object with the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number is 1-based.
	*   - column: Optional. the column number in the original source.
	*    The column number is 0-based.
	*
	* and an array of objects is returned, each with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*    line number is 1-based.
	*   - column: The column number in the generated source, or null.
	*    The column number is 0-based.
	*/
	SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
		var line = util.getArg(aArgs, "line");
		var needle = {
			source: util.getArg(aArgs, "source"),
			originalLine: line,
			originalColumn: util.getArg(aArgs, "column", 0)
		};
		needle.source = this._findSourceIndex(needle.source);
		if (needle.source < 0) return [];
		var mappings = [];
		var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
		if (index >= 0) {
			var mapping = this._originalMappings[index];
			if (aArgs.column === void 0) {
				var originalLine = mapping.originalLine;
				while (mapping && mapping.originalLine === originalLine) {
					mappings.push({
						line: util.getArg(mapping, "generatedLine", null),
						column: util.getArg(mapping, "generatedColumn", null),
						lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
					});
					mapping = this._originalMappings[++index];
				}
			} else {
				var originalColumn = mapping.originalColumn;
				while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
					mappings.push({
						line: util.getArg(mapping, "generatedLine", null),
						column: util.getArg(mapping, "generatedColumn", null),
						lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
					});
					mapping = this._originalMappings[++index];
				}
			}
		}
		return mappings;
	};
	exports.SourceMapConsumer = SourceMapConsumer;
	/**
	* A BasicSourceMapConsumer instance represents a parsed source map which we can
	* query for information about the original file positions by giving it a file
	* position in the generated source.
	*
	* The first parameter is the raw source map (either as a JSON string, or
	* already parsed to an object). According to the spec, source maps have the
	* following attributes:
	*
	*   - version: Which version of the source map spec this map is following.
	*   - sources: An array of URLs to the original source files.
	*   - names: An array of identifiers which can be referrenced by individual mappings.
	*   - sourceRoot: Optional. The URL root from which all sources are relative.
	*   - sourcesContent: Optional. An array of contents of the original source files.
	*   - mappings: A string of base64 VLQs which contain the actual mappings.
	*   - file: Optional. The generated file this source map is associated with.
	*
	* Here is an example source map, taken from the source map spec[0]:
	*
	*     {
	*       version : 3,
	*       file: "out.js",
	*       sourceRoot : "",
	*       sources: ["foo.js", "bar.js"],
	*       names: ["src", "maps", "are", "fun"],
	*       mappings: "AA,AB;;ABCDE;"
	*     }
	*
	* The second parameter, if given, is a string whose value is the URL
	* at which the source map was found.  This URL is used to compute the
	* sources array.
	*
	* [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	*/
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		var version = util.getArg(sourceMap, "version");
		var sources = util.getArg(sourceMap, "sources");
		var names = util.getArg(sourceMap, "names", []);
		var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
		var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
		var mappings = util.getArg(sourceMap, "mappings");
		var file = util.getArg(sourceMap, "file", null);
		if (version != this._version) throw new Error("Unsupported version: " + version);
		if (sourceRoot) sourceRoot = util.normalize(sourceRoot);
		sources = sources.map(String).map(util.normalize).map(function(source) {
			return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
		});
		this._names = ArraySet.fromArray(names.map(String), true);
		this._sources = ArraySet.fromArray(sources, true);
		this._absoluteSources = this._sources.toArray().map(function(s) {
			return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
		});
		this.sourceRoot = sourceRoot;
		this.sourcesContent = sourcesContent;
		this._mappings = mappings;
		this._sourceMapURL = aSourceMapURL;
		this.file = file;
	}
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	/**
	* Utility function to find the index of a source.  Returns -1 if not
	* found.
	*/
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
		var relativeSource = aSource;
		if (this.sourceRoot != null) relativeSource = util.relative(this.sourceRoot, relativeSource);
		if (this._sources.has(relativeSource)) return this._sources.indexOf(relativeSource);
		var i;
		for (i = 0; i < this._absoluteSources.length; ++i) if (this._absoluteSources[i] == aSource) return i;
		return -1;
	};
	/**
	* Create a BasicSourceMapConsumer from a SourceMapGenerator.
	*
	* @param SourceMapGenerator aSourceMap
	*        The source map that will be consumed.
	* @param String aSourceMapURL
	*        The URL at which the source map can be found (optional)
	* @returns BasicSourceMapConsumer
	*/
	BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
		var smc = Object.create(BasicSourceMapConsumer.prototype);
		var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
		var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
		smc.sourceRoot = aSourceMap._sourceRoot;
		smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
		smc.file = aSourceMap._file;
		smc._sourceMapURL = aSourceMapURL;
		smc._absoluteSources = smc._sources.toArray().map(function(s) {
			return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
		});
		var generatedMappings = aSourceMap._mappings.toArray().slice();
		var destGeneratedMappings = smc.__generatedMappings = [];
		var destOriginalMappings = smc.__originalMappings = [];
		for (var i = 0, length = generatedMappings.length; i < length; i++) {
			var srcMapping = generatedMappings[i];
			var destMapping = new Mapping();
			destMapping.generatedLine = srcMapping.generatedLine;
			destMapping.generatedColumn = srcMapping.generatedColumn;
			if (srcMapping.source) {
				destMapping.source = sources.indexOf(srcMapping.source);
				destMapping.originalLine = srcMapping.originalLine;
				destMapping.originalColumn = srcMapping.originalColumn;
				if (srcMapping.name) destMapping.name = names.indexOf(srcMapping.name);
				destOriginalMappings.push(destMapping);
			}
			destGeneratedMappings.push(destMapping);
		}
		quickSort(smc.__originalMappings, util.compareByOriginalPositions);
		return smc;
	};
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	BasicSourceMapConsumer.prototype._version = 3;
	/**
	* The list of original sources.
	*/
	Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", { get: function() {
		return this._absoluteSources.slice();
	} });
	/**
	* Provide the JIT with a nice shape / hidden class.
	*/
	function Mapping() {
		this.generatedLine = 0;
		this.generatedColumn = 0;
		this.source = null;
		this.originalLine = null;
		this.originalColumn = null;
		this.name = null;
	}
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	var compareGenerated = util.compareByGeneratedPositionsDeflatedNoLine;
	function sortGenerated(array, start) {
		let l = array.length;
		let n = array.length - start;
		if (n <= 1) return;
		else if (n == 2) {
			let a = array[start];
			let b = array[start + 1];
			if (compareGenerated(a, b) > 0) {
				array[start] = b;
				array[start + 1] = a;
			}
		} else if (n < 20) for (let i = start; i < l; i++) for (let j = i; j > start; j--) {
			let a = array[j - 1];
			let b = array[j];
			if (compareGenerated(a, b) <= 0) break;
			array[j - 1] = b;
			array[j] = a;
		}
		else quickSort(array, compareGenerated, start);
	}
	BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		var generatedLine = 1;
		var previousGeneratedColumn = 0;
		var previousOriginalLine = 0;
		var previousOriginalColumn = 0;
		var previousSource = 0;
		var previousName = 0;
		var length = aStr.length;
		var index = 0;
		var temp = {};
		var originalMappings = [];
		var generatedMappings = [], mapping, segment, end, value;
		let subarrayStart = 0;
		while (index < length) if (aStr.charAt(index) === ";") {
			generatedLine++;
			index++;
			previousGeneratedColumn = 0;
			sortGenerated(generatedMappings, subarrayStart);
			subarrayStart = generatedMappings.length;
		} else if (aStr.charAt(index) === ",") index++;
		else {
			mapping = new Mapping();
			mapping.generatedLine = generatedLine;
			for (end = index; end < length; end++) if (this._charIsMappingSeparator(aStr, end)) break;
			aStr.slice(index, end);
			segment = [];
			while (index < end) {
				base64VLQ.decode(aStr, index, temp);
				value = temp.value;
				index = temp.rest;
				segment.push(value);
			}
			if (segment.length === 2) throw new Error("Found a source, but no line and column");
			if (segment.length === 3) throw new Error("Found a source and line, but no column");
			mapping.generatedColumn = previousGeneratedColumn + segment[0];
			previousGeneratedColumn = mapping.generatedColumn;
			if (segment.length > 1) {
				mapping.source = previousSource + segment[1];
				previousSource += segment[1];
				mapping.originalLine = previousOriginalLine + segment[2];
				previousOriginalLine = mapping.originalLine;
				mapping.originalLine += 1;
				mapping.originalColumn = previousOriginalColumn + segment[3];
				previousOriginalColumn = mapping.originalColumn;
				if (segment.length > 4) {
					mapping.name = previousName + segment[4];
					previousName += segment[4];
				}
			}
			generatedMappings.push(mapping);
			if (typeof mapping.originalLine === "number") {
				let currentSource = mapping.source;
				while (originalMappings.length <= currentSource) originalMappings.push(null);
				if (originalMappings[currentSource] === null) originalMappings[currentSource] = [];
				originalMappings[currentSource].push(mapping);
			}
		}
		sortGenerated(generatedMappings, subarrayStart);
		this.__generatedMappings = generatedMappings;
		for (var i = 0; i < originalMappings.length; i++) if (originalMappings[i] != null) quickSort(originalMappings[i], util.compareByOriginalPositionsNoSource);
		this.__originalMappings = [].concat(...originalMappings);
	};
	/**
	* Find the mapping that best matches the hypothetical "needle" mapping that
	* we are searching for in the given "haystack" of mappings.
	*/
	BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
		if (aNeedle[aLineName] <= 0) throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
		if (aNeedle[aColumnName] < 0) throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
		return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	};
	/**
	* Compute the last column for each generated mapping. The last column is
	* inclusive.
	*/
	BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
		for (var index = 0; index < this._generatedMappings.length; ++index) {
			var mapping = this._generatedMappings[index];
			if (index + 1 < this._generatedMappings.length) {
				var nextMapping = this._generatedMappings[index + 1];
				if (mapping.generatedLine === nextMapping.generatedLine) {
					mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
					continue;
				}
			}
			mapping.lastGeneratedColumn = Infinity;
		}
	};
	/**
	* Returns the original source, line, and column information for the generated
	* source's line and column positions provided. The only argument is an object
	* with the following properties:
	*
	*   - line: The line number in the generated source.  The line number
	*     is 1-based.
	*   - column: The column number in the generated source.  The column
	*     number is 0-based.
	*   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	*     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	*
	* and an object is returned with the following properties:
	*
	*   - source: The original source file, or null.
	*   - line: The line number in the original source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the original source, or null.  The
	*     column number is 0-based.
	*   - name: The original identifier, or null.
	*/
	BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
		var needle = {
			generatedLine: util.getArg(aArgs, "line"),
			generatedColumn: util.getArg(aArgs, "column")
		};
		var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
		if (index >= 0) {
			var mapping = this._generatedMappings[index];
			if (mapping.generatedLine === needle.generatedLine) {
				var source = util.getArg(mapping, "source", null);
				if (source !== null) {
					source = this._sources.at(source);
					source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
				}
				var name = util.getArg(mapping, "name", null);
				if (name !== null) name = this._names.at(name);
				return {
					source,
					line: util.getArg(mapping, "originalLine", null),
					column: util.getArg(mapping, "originalColumn", null),
					name
				};
			}
		}
		return {
			source: null,
			line: null,
			column: null,
			name: null
		};
	};
	/**
	* Return true if we have the source content for every source in the source
	* map, false otherwise.
	*/
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
		if (!this.sourcesContent) return false;
		return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
			return sc == null;
		});
	};
	/**
	* Returns the original source content. The only argument is the url of the
	* original source file. Returns null if no original source content is
	* available.
	*/
	BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
		if (!this.sourcesContent) return null;
		var index = this._findSourceIndex(aSource);
		if (index >= 0) return this.sourcesContent[index];
		var relativeSource = aSource;
		if (this.sourceRoot != null) relativeSource = util.relative(this.sourceRoot, relativeSource);
		var url;
		if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
			var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
			if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
			if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
		}
		if (nullOnMissing) return null;
		else throw new Error("\"" + relativeSource + "\" is not in the SourceMap.");
	};
	/**
	* Returns the generated line and column information for the original source,
	* line, and column positions provided. The only argument is an object with
	* the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number
	*     is 1-based.
	*   - column: The column number in the original source.  The column
	*     number is 0-based.
	*   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	*     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	*     closest element that is smaller than or greater than the one we are
	*     searching for, respectively, if the exact element cannot be found.
	*     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	*
	* and an object is returned with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the generated source, or null.
	*     The column number is 0-based.
	*/
	BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
		var source = util.getArg(aArgs, "source");
		source = this._findSourceIndex(source);
		if (source < 0) return {
			line: null,
			column: null,
			lastColumn: null
		};
		var needle = {
			source,
			originalLine: util.getArg(aArgs, "line"),
			originalColumn: util.getArg(aArgs, "column")
		};
		var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
		if (index >= 0) {
			var mapping = this._originalMappings[index];
			if (mapping.source === needle.source) return {
				line: util.getArg(mapping, "generatedLine", null),
				column: util.getArg(mapping, "generatedColumn", null),
				lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
			};
		}
		return {
			line: null,
			column: null,
			lastColumn: null
		};
	};
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	/**
	* An IndexedSourceMapConsumer instance represents a parsed source map which
	* we can query for information. It differs from BasicSourceMapConsumer in
	* that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	* input.
	*
	* The first parameter is a raw source map (either as a JSON string, or already
	* parsed to an object). According to the spec for indexed source maps, they
	* have the following attributes:
	*
	*   - version: Which version of the source map spec this map is following.
	*   - file: Optional. The generated file this source map is associated with.
	*   - sections: A list of section definitions.
	*
	* Each value under the "sections" field has two fields:
	*   - offset: The offset into the original specified at which this section
	*       begins to apply, defined as an object with a "line" and "column"
	*       field.
	*   - map: A source map definition. This source map could also be indexed,
	*       but doesn't have to be.
	*
	* Instead of the "map" field, it's also possible to have a "url" field
	* specifying a URL to retrieve a source map from, but that's currently
	* unsupported.
	*
	* Here's an example source map, taken from the source map spec[0], but
	* modified to omit a section which uses the "url" field.
	*
	*  {
	*    version : 3,
	*    file: "app.js",
	*    sections: [{
	*      offset: {line:100, column:10},
	*      map: {
	*        version : 3,
	*        file: "section.js",
	*        sources: ["foo.js", "bar.js"],
	*        names: ["src", "maps", "are", "fun"],
	*        mappings: "AAAA,E;;ABCDE;"
	*      }
	*    }],
	*  }
	*
	* The second parameter, if given, is a string whose value is the URL
	* at which the source map was found.  This URL is used to compute the
	* sources array.
	*
	* [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	*/
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
		var sourceMap = aSourceMap;
		if (typeof aSourceMap === "string") sourceMap = util.parseSourceMapInput(aSourceMap);
		var version = util.getArg(sourceMap, "version");
		var sections = util.getArg(sourceMap, "sections");
		if (version != this._version) throw new Error("Unsupported version: " + version);
		this._sources = new ArraySet();
		this._names = new ArraySet();
		var lastOffset = {
			line: -1,
			column: 0
		};
		this._sections = sections.map(function(s) {
			if (s.url) throw new Error("Support for url field in sections not implemented.");
			var offset = util.getArg(s, "offset");
			var offsetLine = util.getArg(offset, "line");
			var offsetColumn = util.getArg(offset, "column");
			if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) throw new Error("Section offsets must be ordered and non-overlapping.");
			lastOffset = offset;
			return {
				generatedOffset: {
					generatedLine: offsetLine + 1,
					generatedColumn: offsetColumn + 1
				},
				consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
			};
		});
	}
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	/**
	* The version of the source mapping spec that we are consuming.
	*/
	IndexedSourceMapConsumer.prototype._version = 3;
	/**
	* The list of original sources.
	*/
	Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", { get: function() {
		var sources = [];
		for (var i = 0; i < this._sections.length; i++) for (var j = 0; j < this._sections[i].consumer.sources.length; j++) sources.push(this._sections[i].consumer.sources[j]);
		return sources;
	} });
	/**
	* Returns the original source, line, and column information for the generated
	* source's line and column positions provided. The only argument is an object
	* with the following properties:
	*
	*   - line: The line number in the generated source.  The line number
	*     is 1-based.
	*   - column: The column number in the generated source.  The column
	*     number is 0-based.
	*
	* and an object is returned with the following properties:
	*
	*   - source: The original source file, or null.
	*   - line: The line number in the original source, or null.  The
	*     line number is 1-based.
	*   - column: The column number in the original source, or null.  The
	*     column number is 0-based.
	*   - name: The original identifier, or null.
	*/
	IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
		var needle = {
			generatedLine: util.getArg(aArgs, "line"),
			generatedColumn: util.getArg(aArgs, "column")
		};
		var sectionIndex = binarySearch.search(needle, this._sections, function(needle, section) {
			var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
			if (cmp) return cmp;
			return needle.generatedColumn - section.generatedOffset.generatedColumn;
		});
		var section = this._sections[sectionIndex];
		if (!section) return {
			source: null,
			line: null,
			column: null,
			name: null
		};
		return section.consumer.originalPositionFor({
			line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
			column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
			bias: aArgs.bias
		});
	};
	/**
	* Return true if we have the source content for every source in the source
	* map, false otherwise.
	*/
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
		return this._sections.every(function(s) {
			return s.consumer.hasContentsOfAllSources();
		});
	};
	/**
	* Returns the original source content. The only argument is the url of the
	* original source file. Returns null if no original source content is
	* available.
	*/
	IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
		for (var i = 0; i < this._sections.length; i++) {
			var content = this._sections[i].consumer.sourceContentFor(aSource, true);
			if (content || content === "") return content;
		}
		if (nullOnMissing) return null;
		else throw new Error("\"" + aSource + "\" is not in the SourceMap.");
	};
	/**
	* Returns the generated line and column information for the original source,
	* line, and column positions provided. The only argument is an object with
	* the following properties:
	*
	*   - source: The filename of the original source.
	*   - line: The line number in the original source.  The line number
	*     is 1-based.
	*   - column: The column number in the original source.  The column
	*     number is 0-based.
	*
	* and an object is returned with the following properties:
	*
	*   - line: The line number in the generated source, or null.  The
	*     line number is 1-based. 
	*   - column: The column number in the generated source, or null.
	*     The column number is 0-based.
	*/
	IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
		for (var i = 0; i < this._sections.length; i++) {
			var section = this._sections[i];
			if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) continue;
			var generatedPosition = section.consumer.generatedPositionFor(aArgs);
			if (generatedPosition) return {
				line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
				column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
			};
		}
		return {
			line: null,
			column: null
		};
	};
	/**
	* Parse the mappings in a string in to a data structure which we can easily
	* query (the ordered arrays in the `this.__generatedMappings` and
	* `this.__originalMappings` properties).
	*/
	IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
		this.__generatedMappings = [];
		this.__originalMappings = [];
		for (var i = 0; i < this._sections.length; i++) {
			var section = this._sections[i];
			var sectionMappings = section.consumer._generatedMappings;
			for (var j = 0; j < sectionMappings.length; j++) {
				var mapping = sectionMappings[j];
				var source = section.consumer._sources.at(mapping.source);
				if (source !== null) source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
				this._sources.add(source);
				source = this._sources.indexOf(source);
				var name = null;
				if (mapping.name) {
					name = section.consumer._names.at(mapping.name);
					this._names.add(name);
					name = this._names.indexOf(name);
				}
				var adjustedMapping = {
					source,
					generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
					generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
					originalLine: mapping.originalLine,
					originalColumn: mapping.originalColumn,
					name
				};
				this.__generatedMappings.push(adjustedMapping);
				if (typeof adjustedMapping.originalLine === "number") this.__originalMappings.push(adjustedMapping);
			}
		}
		quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
		quickSort(this.__originalMappings, util.compareByOriginalPositions);
	};
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/lib/source-node.js
var require_source_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
	var util = require_util();
	var REGEX_NEWLINE = /(\r?\n)/;
	var NEWLINE_CODE = 10;
	var isSourceNode = "$$$isSourceNode$$$";
	/**
	* SourceNodes provide a way to abstract over interpolating/concatenating
	* snippets of generated JavaScript source code while maintaining the line and
	* column information associated with the original source code.
	*
	* @param aLine The original line number.
	* @param aColumn The original column number.
	* @param aSource The original source's filename.
	* @param aChunks Optional. An array of strings which are snippets of
	*        generated JS, or other SourceNodes.
	* @param aName The original identifier.
	*/
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
		this.children = [];
		this.sourceContents = {};
		this.line = aLine == null ? null : aLine;
		this.column = aColumn == null ? null : aColumn;
		this.source = aSource == null ? null : aSource;
		this.name = aName == null ? null : aName;
		this[isSourceNode] = true;
		if (aChunks != null) this.add(aChunks);
	}
	/**
	* Creates a SourceNode from generated code and a SourceMapConsumer.
	*
	* @param aGeneratedCode The generated code
	* @param aSourceMapConsumer The SourceMap for the generated code
	* @param aRelativePath Optional. The path that relative sources in the
	*        SourceMapConsumer should be relative to.
	*/
	SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
		var node = new SourceNode();
		var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
		var remainingLinesIndex = 0;
		var shiftNextLine = function() {
			return getNextLine() + (getNextLine() || "");
			function getNextLine() {
				return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
			}
		};
		var lastGeneratedLine = 1, lastGeneratedColumn = 0;
		var lastMapping = null;
		aSourceMapConsumer.eachMapping(function(mapping) {
			if (lastMapping !== null) {
				if (lastGeneratedLine < mapping.generatedLine) {
					addMappingWithCode(lastMapping, shiftNextLine());
					lastGeneratedLine++;
					lastGeneratedColumn = 0;
				} else {
					var nextLine = remainingLines[remainingLinesIndex] || "";
					var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
					remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
					lastGeneratedColumn = mapping.generatedColumn;
					addMappingWithCode(lastMapping, code);
					lastMapping = mapping;
					return;
				}
			}
			while (lastGeneratedLine < mapping.generatedLine) {
				node.add(shiftNextLine());
				lastGeneratedLine++;
			}
			if (lastGeneratedColumn < mapping.generatedColumn) {
				var nextLine = remainingLines[remainingLinesIndex] || "";
				node.add(nextLine.substr(0, mapping.generatedColumn));
				remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
				lastGeneratedColumn = mapping.generatedColumn;
			}
			lastMapping = mapping;
		}, this);
		if (remainingLinesIndex < remainingLines.length) {
			if (lastMapping) addMappingWithCode(lastMapping, shiftNextLine());
			node.add(remainingLines.splice(remainingLinesIndex).join(""));
		}
		aSourceMapConsumer.sources.forEach(function(sourceFile) {
			var content = aSourceMapConsumer.sourceContentFor(sourceFile);
			if (content != null) {
				if (aRelativePath != null) sourceFile = util.join(aRelativePath, sourceFile);
				node.setSourceContent(sourceFile, content);
			}
		});
		return node;
		function addMappingWithCode(mapping, code) {
			if (mapping === null || mapping.source === void 0) node.add(code);
			else {
				var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
				node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
			}
		}
	};
	/**
	* Add a chunk of generated JS to this source node.
	*
	* @param aChunk A string snippet of generated JS code, another instance of
	*        SourceNode, or an array where each member is one of those things.
	*/
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
		if (Array.isArray(aChunk)) aChunk.forEach(function(chunk) {
			this.add(chunk);
		}, this);
		else if (aChunk[isSourceNode] || typeof aChunk === "string") {
			if (aChunk) this.children.push(aChunk);
		} else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
		return this;
	};
	/**
	* Add a chunk of generated JS to the beginning of this source node.
	*
	* @param aChunk A string snippet of generated JS code, another instance of
	*        SourceNode, or an array where each member is one of those things.
	*/
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
		if (Array.isArray(aChunk)) for (var i = aChunk.length - 1; i >= 0; i--) this.prepend(aChunk[i]);
		else if (aChunk[isSourceNode] || typeof aChunk === "string") this.children.unshift(aChunk);
		else throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
		return this;
	};
	/**
	* Walk over the tree of JS snippets in this node and its children. The
	* walking function is called once for each snippet of JS and is passed that
	* snippet and the its original associated source's line/column location.
	*
	* @param aFn The traversal function.
	*/
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
		var chunk;
		for (var i = 0, len = this.children.length; i < len; i++) {
			chunk = this.children[i];
			if (chunk[isSourceNode]) chunk.walk(aFn);
			else if (chunk !== "") aFn(chunk, {
				source: this.source,
				line: this.line,
				column: this.column,
				name: this.name
			});
		}
	};
	/**
	* Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	* each of `this.children`.
	*
	* @param aSep The separator.
	*/
	SourceNode.prototype.join = function SourceNode_join(aSep) {
		var newChildren;
		var i;
		var len = this.children.length;
		if (len > 0) {
			newChildren = [];
			for (i = 0; i < len - 1; i++) {
				newChildren.push(this.children[i]);
				newChildren.push(aSep);
			}
			newChildren.push(this.children[i]);
			this.children = newChildren;
		}
		return this;
	};
	/**
	* Call String.prototype.replace on the very right-most source snippet. Useful
	* for trimming whitespace from the end of a source node, etc.
	*
	* @param aPattern The pattern to replace.
	* @param aReplacement The thing to replace the pattern with.
	*/
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
		var lastChild = this.children[this.children.length - 1];
		if (lastChild[isSourceNode]) lastChild.replaceRight(aPattern, aReplacement);
		else if (typeof lastChild === "string") this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
		else this.children.push("".replace(aPattern, aReplacement));
		return this;
	};
	/**
	* Set the source content for a source file. This will be added to the SourceMapGenerator
	* in the sourcesContent field.
	*
	* @param aSourceFile The filename of the source file
	* @param aSourceContent The content of the source file
	*/
	SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
		this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	};
	/**
	* Walk over the tree of SourceNodes. The walking function is called for each
	* source file content and is passed the filename and source content.
	*
	* @param aFn The traversal function.
	*/
	SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
		for (var i = 0, len = this.children.length; i < len; i++) if (this.children[i][isSourceNode]) this.children[i].walkSourceContents(aFn);
		var sources = Object.keys(this.sourceContents);
		for (var i = 0, len = sources.length; i < len; i++) aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	};
	/**
	* Return the string representation of this source node. Walks over the tree
	* and concatenates all the various snippets together to one string.
	*/
	SourceNode.prototype.toString = function SourceNode_toString() {
		var str = "";
		this.walk(function(chunk) {
			str += chunk;
		});
		return str;
	};
	/**
	* Returns the string representation of this source node along with a source
	* map.
	*/
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
		var generated = {
			code: "",
			line: 1,
			column: 0
		};
		var map = new SourceMapGenerator(aArgs);
		var sourceMappingActive = false;
		var lastOriginalSource = null;
		var lastOriginalLine = null;
		var lastOriginalColumn = null;
		var lastOriginalName = null;
		this.walk(function(chunk, original) {
			generated.code += chunk;
			if (original.source !== null && original.line !== null && original.column !== null) {
				if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) map.addMapping({
					source: original.source,
					original: {
						line: original.line,
						column: original.column
					},
					generated: {
						line: generated.line,
						column: generated.column
					},
					name: original.name
				});
				lastOriginalSource = original.source;
				lastOriginalLine = original.line;
				lastOriginalColumn = original.column;
				lastOriginalName = original.name;
				sourceMappingActive = true;
			} else if (sourceMappingActive) {
				map.addMapping({ generated: {
					line: generated.line,
					column: generated.column
				} });
				lastOriginalSource = null;
				sourceMappingActive = false;
			}
			for (var idx = 0, length = chunk.length; idx < length; idx++) if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
				generated.line++;
				generated.column = 0;
				if (idx + 1 === length) {
					lastOriginalSource = null;
					sourceMappingActive = false;
				} else if (sourceMappingActive) map.addMapping({
					source: original.source,
					original: {
						line: original.line,
						column: original.column
					},
					generated: {
						line: generated.line,
						column: generated.column
					},
					name: original.name
				});
			} else generated.column++;
		});
		this.walkSourceContents(function(sourceFile, sourceContent) {
			map.setSourceContent(sourceFile, sourceContent);
		});
		return {
			code: generated.code,
			map
		};
	};
	exports.SourceNode = SourceNode;
}));
//#endregion
//#region node_modules/.pnpm/source-map-js@1.2.1/node_modules/source-map-js/source-map.js
var require_source_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
	exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
	exports.SourceNode = require_source_node().SourceNode;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/previous-map.js
var require_previous_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { existsSync, readFileSync, realpathSync } = __require("fs");
	var { dirname: dirname$1, isAbsolute: isAbsolute$1, join, relative: relative$1, sep: sep$1 } = __require("path");
	var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	function realPath(path) {
		try {
			return realpathSync(path);
		} catch {
			return path;
		}
	}
	function fromBase64(str) {
		if (Buffer) return Buffer.from(str, "base64").toString();
		else
 /* c8 ignore next 2 */
		return window.atob(str);
	}
	var PreviousMap = class {
		constructor(css, opts) {
			if (opts.map === false) return;
			if (opts.unsafeMap) this.unsafeMap = true;
			this.loadAnnotation(css);
			this.inline = this.startWith(this.annotation, "data:");
			let prev = opts.map ? opts.map.prev : void 0;
			let text = this.loadMap(opts.from, prev);
			if (!this.mapFile && opts.from) this.mapFile = opts.from;
			if (this.mapFile) this.root = dirname$1(this.mapFile);
			if (text) this.text = text;
		}
		consumer() {
			if (!this.consumerCache) this.consumerCache = new SourceMapConsumer(this.json || this.text);
			return this.consumerCache;
		}
		decodeInline(text) {
			let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
			let baseUri = /^data:application\/json;base64,/;
			let uriMatch = text.match(/^data:application\/json;charset=utf-?8,/) || text.match(/^data:application\/json,/);
			if (uriMatch) return decodeURIComponent(text.substr(uriMatch[0].length));
			let baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
			if (baseUriMatch) return fromBase64(text.substr(baseUriMatch[0].length));
			let encoding = text.slice(22);
			encoding = encoding.slice(0, encoding.indexOf(","));
			throw new Error("Unsupported source map encoding " + encoding);
		}
		getAnnotationURL(sourceMapString) {
			return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
		}
		isMap(map) {
			if (typeof map !== "object") return false;
			return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
		}
		loadAnnotation(css) {
			let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
			if (!comments) return;
			let start = css.lastIndexOf(comments.pop());
			let end = css.indexOf("*/", start);
			if (start > -1 && end > -1) this.annotation = this.getAnnotationURL(css.substring(start, end));
		}
		loadFile(path, cssFile, trusted) {
			if (!trusted && !this.unsafeMap) {
				if (!/\.map$/i.test(path)) return void 0;
				if (!cssFile) return void 0;
				let rel = relative$1(realPath(dirname$1(cssFile)), realPath(path));
				if (rel === ".." || rel.startsWith(".." + sep$1) || isAbsolute$1(rel)) return;
			}
			this.root = dirname$1(path);
			if (existsSync(path)) {
				this.mapFile = path;
				return readFileSync(path, "utf-8").toString().trim();
			}
		}
		loadMap(file, prev) {
			if (prev === false) return false;
			if (prev) {
				if (typeof prev === "string") return prev;
				else if (typeof prev === "function") {
					let prevPath = prev(file);
					if (prevPath) {
						let map = this.loadFile(prevPath, file, true);
						if (!map) throw new Error("Unable to load previous source map: " + prevPath.toString());
						return map;
					}
				} else if (prev instanceof SourceMapConsumer) return SourceMapGenerator.fromSourceMap(prev).toString();
				else if (prev instanceof SourceMapGenerator) return prev.toString();
				else if (this.isMap(prev)) return JSON.stringify(prev);
				else throw new Error("Unsupported previous source map format: " + prev.toString());
			} else if (this.inline) return this.decodeInline(this.annotation);
			else if (this.annotation) {
				let map = this.annotation;
				if (file) map = join(dirname$1(file), map);
				let unknown = this.loadFile(map, file, false);
				if (unknown) try {
					/* c8 ignore next 4 */
					this.json = JSON.parse(unknown.replace(/^\)]}'[^\n]*\n/, ""));
				} catch {
					return;
				}
				return unknown;
			}
		}
		startWith(string, start) {
			if (!string) return false;
			return string.substr(0, start.length) === start;
		}
		withContent() {
			return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
		}
	};
	module.exports = PreviousMap;
	PreviousMap.default = PreviousMap;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/input.js
var require_input = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { nanoid } = require_non_secure();
	var { isAbsolute, resolve: resolve$1 } = __require("path");
	var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	var { fileURLToPath, pathToFileURL: pathToFileURL$1 } = __require("url");
	var CssSyntaxError = require_css_syntax_error();
	var PreviousMap = require_previous_map();
	var terminalHighlight = require_terminal_highlight();
	var lineToIndexCache = Symbol("lineToIndexCache");
	var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	var pathAvailable = Boolean(resolve$1 && isAbsolute);
	function getLineToIndex(input) {
		if (input[lineToIndexCache]) return input[lineToIndexCache];
		let lines = input.css.split("\n");
		let lineToIndex = new Array(lines.length);
		let prevIndex = 0;
		for (let i = 0, l = lines.length; i < l; i++) {
			lineToIndex[i] = prevIndex;
			prevIndex += lines[i].length + 1;
		}
		input[lineToIndexCache] = lineToIndex;
		return lineToIndex;
	}
	var Input = class {
		get from() {
			return this.file || this.id;
		}
		constructor(css, opts = {}) {
			if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) throw new Error(`PostCSS received ${css} instead of CSS string`);
			this.css = css.toString();
			if (this.css[0] === "﻿" || this.css[0] === "￾") {
				this.hasBOM = true;
				this.css = this.css.slice(1);
			} else this.hasBOM = false;
			this.document = this.css;
			if (opts.document) this.document = opts.document.toString();
			if (opts.from) {
				if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) this.file = opts.from;
				else this.file = resolve$1(opts.from);
			}
			if (pathAvailable && sourceMapAvailable) {
				let map = new PreviousMap(this.css, opts);
				if (map.text) {
					this.map = map;
					let file = map.consumer().file;
					if (!this.file && file) this.file = this.mapResolve(file);
				}
			}
			if (!this.file) this.id = "<input css " + nanoid(6) + ">";
			if (this.map) this.map.file = this.from;
		}
		error(message, line, column, opts = {}) {
			let endColumn, endLine, endOffset, offset, result;
			if (line && typeof line === "object") {
				let start = line;
				let end = column;
				if (typeof start.offset === "number") {
					offset = start.offset;
					let pos = this.fromOffset(offset);
					line = pos.line;
					column = pos.col;
				} else {
					line = start.line;
					column = start.column;
					offset = this.fromLineAndColumn(line, column);
				}
				if (typeof end.offset === "number") {
					endOffset = end.offset;
					let pos = this.fromOffset(endOffset);
					endLine = pos.line;
					endColumn = pos.col;
				} else {
					endLine = end.line;
					endColumn = end.column;
					endOffset = this.fromLineAndColumn(end.line, end.column);
				}
			} else if (!column) {
				offset = line;
				let pos = this.fromOffset(offset);
				line = pos.line;
				column = pos.col;
			} else offset = this.fromLineAndColumn(line, column);
			let origin = this.origin(line, column, endLine, endColumn);
			if (origin) result = new CssSyntaxError(message, origin.endLine === void 0 ? origin.line : {
				column: origin.column,
				line: origin.line
			}, origin.endLine === void 0 ? origin.column : {
				column: origin.endColumn,
				line: origin.endLine
			}, origin.source, origin.file, opts.plugin);
			else result = new CssSyntaxError(message, endLine === void 0 ? line : {
				column,
				line
			}, endLine === void 0 ? column : {
				column: endColumn,
				line: endLine
			}, this.css, this.file, opts.plugin);
			result.input = {
				column,
				endColumn,
				endLine,
				endOffset,
				line,
				offset,
				source: this.css
			};
			if (this.file) {
				if (pathToFileURL$1) result.input.url = pathToFileURL$1(this.file).toString();
				result.input.file = this.file;
			}
			return result;
		}
		fromLineAndColumn(line, column) {
			return getLineToIndex(this)[line - 1] + column - 1;
		}
		fromOffset(offset) {
			let lineToIndex = getLineToIndex(this);
			let lastLine = lineToIndex[lineToIndex.length - 1];
			let min = 0;
			if (offset >= lastLine) min = lineToIndex.length - 1;
			else {
				let max = lineToIndex.length - 2;
				let mid;
				while (min < max) {
					mid = min + (max - min >> 1);
					if (offset < lineToIndex[mid]) max = mid - 1;
					else if (offset >= lineToIndex[mid + 1]) min = mid + 1;
					else {
						min = mid;
						break;
					}
				}
			}
			return {
				col: offset - lineToIndex[min] + 1,
				line: min + 1
			};
		}
		mapResolve(file) {
			if (/^\w+:\/\//.test(file)) return file;
			return resolve$1(this.map.consumer().sourceRoot || this.map.root || ".", file);
		}
		origin(line, column, endLine, endColumn) {
			if (!this.map) return false;
			let consumer = this.map.consumer();
			let from = consumer.originalPositionFor({
				column: column - 1,
				line
			});
			if (!from.source) return false;
			let to;
			if (typeof endLine === "number") {
				let toPosition = consumer.originalPositionFor({
					column: endColumn - 1,
					line: endLine
				});
				if (toPosition.source) to = toPosition;
			}
			let fromUrl;
			if (isAbsolute(from.source)) fromUrl = pathToFileURL$1(from.source);
			else fromUrl = new URL(from.source, this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile));
			let result = {
				column: from.column + 1,
				endColumn: to && to.column + 1,
				endLine: to && to.line,
				line: from.line,
				url: fromUrl.toString()
			};
			if (fromUrl.protocol === "file:") {
				if (fileURLToPath) result.file = fileURLToPath(fromUrl);
				else
 /* c8 ignore next 2 */
				throw new Error(`file: protocol is not available in this PostCSS build`);
			}
			let source = consumer.sourceContentFor(from.source);
			if (source) result.source = source;
			return result;
		}
		toJSON() {
			let json = {};
			for (let name of [
				"hasBOM",
				"css",
				"file",
				"id"
			]) if (this[name] != null) json[name] = this[name];
			if (this.map) {
				json.map = { ...this.map };
				if (json.map.consumerCache) json.map.consumerCache = void 0;
			}
			return json;
		}
	};
	module.exports = Input;
	Input.default = Input;
	if (terminalHighlight && terminalHighlight.registerInput) terminalHighlight.registerInput(Input);
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/root.js
var require_root = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Container = require_container();
	var LazyResult;
	var Processor;
	var Root = class extends Container {
		constructor(defaults) {
			super(defaults);
			this.type = "root";
			if (!this.nodes) this.nodes = [];
		}
		normalize(child, sample, type) {
			let keepBefore = /* @__PURE__ */ new Set();
			for (let node of Array.isArray(child) ? child : [child]) if (node && typeof node === "object" && !node.parent && node.raws && typeof node.raws.before !== "undefined") keepBefore.add(node.raws);
			let nodes = super.normalize(child);
			if (sample) {
				if (type === "prepend") {
					if (this.nodes.length > 1) sample.raws.before = this.nodes[1].raws.before;
					else delete sample.raws.before;
				} else if (this.first !== sample) {
					for (let node of nodes) if (!keepBefore.has(node.raws)) node.raws.before = sample.raws.before;
				}
			}
			return nodes;
		}
		removeChild(child, ignore) {
			let index = this.index(child);
			if (!ignore && index === 0 && this.nodes.length > 1) this.nodes[1].raws.before = this.nodes[index].raws.before;
			return super.removeChild(child);
		}
		toResult(opts = {}) {
			return new LazyResult(new Processor(), this, opts).stringify();
		}
	};
	Root.registerLazyResult = (dependant) => {
		LazyResult = dependant;
	};
	Root.registerProcessor = (dependant) => {
		Processor = dependant;
	};
	module.exports = Root;
	Root.default = Root;
	Container.registerRoot(Root);
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/list.js
var require_list = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var list = {
		comma(string) {
			return list.split(string, [","], true);
		},
		space(string) {
			return list.split(string, [
				" ",
				"\n",
				"	"
			]);
		},
		split(string, separators, last) {
			if (typeof string !== "string") return [];
			let array = [];
			let current = "";
			let split = false;
			let func = 0;
			let inQuote = false;
			let prevQuote = "";
			let escape = false;
			for (let letter of string) {
				if (escape) escape = false;
				else if (letter === "\\") escape = true;
				else if (inQuote) {
					if (letter === prevQuote) inQuote = false;
				} else if (letter === "\"" || letter === "'") {
					inQuote = true;
					prevQuote = letter;
				} else if (letter === "(") func += 1;
				else if (letter === ")") {
					if (func > 0) func -= 1;
				} else if (func === 0) {
					if (separators.includes(letter)) split = true;
				}
				if (split) {
					if (current !== "") array.push(current.trim());
					current = "";
					split = false;
				} else current += letter;
			}
			if (last || current !== "") array.push(current.trim());
			return array;
		}
	};
	module.exports = list;
	list.default = list;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/rule.js
var require_rule = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Container = require_container();
	var list = require_list();
	var Rule = class extends Container {
		get selectors() {
			return list.comma(this.selector);
		}
		set selectors(values) {
			let match = this.selector ? this.selector.match(/,\s*/) : null;
			let sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
			this.selector = values.join(sep);
		}
		constructor(defaults) {
			super(defaults);
			this.type = "rule";
			if (!this.nodes) this.nodes = [];
		}
	};
	module.exports = Rule;
	Rule.default = Rule;
	Container.registerRule(Rule);
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/fromJSON.js
var require_fromJSON = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var AtRule = require_at_rule();
	var Comment = require_comment();
	var Declaration = require_declaration();
	var Input = require_input();
	var PreviousMap = require_previous_map();
	var Root = require_root();
	var Rule = require_rule();
	function hydrateInputs(json, inputs) {
		if (!json.inputs) return inputs;
		return json.inputs.map((input) => {
			let inputHydrated = {
				...input,
				__proto__: Input.prototype
			};
			if (inputHydrated.map) inputHydrated.map = {
				...inputHydrated.map,
				__proto__: PreviousMap.prototype
			};
			return inputHydrated;
		});
	}
	function constructNode(json, inputs, children) {
		let defaults = { ...json };
		delete defaults.inputs;
		delete defaults.nodes;
		if (defaults.source) {
			let { inputId, ...source } = defaults.source;
			defaults.source = source;
			if (inputId != null) defaults.source.input = inputs[inputId];
		}
		let node;
		if (defaults.type === "root") node = new Root(defaults);
		else if (defaults.type === "decl") node = new Declaration(defaults);
		else if (defaults.type === "rule") node = new Rule(defaults);
		else if (defaults.type === "comment") node = new Comment(defaults);
		else if (defaults.type === "atrule") node = new AtRule(defaults);
		else throw new Error("Unknown node type: " + json.type);
		if (children) {
			node.nodes = children;
			for (let child of children) child.parent = node;
		}
		return node;
	}
	function fromJSON(json, inputs) {
		if (Array.isArray(json)) return json.map((n) => fromJSON(n));
		let result;
		let stack = [{
			childIndex: 0,
			children: [],
			inputs: hydrateInputs(json, inputs),
			json
		}];
		while (stack.length > 0) {
			let frame = stack[stack.length - 1];
			let jsonNodes = frame.json.nodes;
			if (jsonNodes && frame.childIndex < jsonNodes.length) {
				let childJson = jsonNodes[frame.childIndex];
				frame.childIndex += 1;
				stack.push({
					childIndex: 0,
					children: [],
					inputs: hydrateInputs(childJson, frame.inputs),
					json: childJson
				});
				continue;
			}
			stack.pop();
			let node = constructNode(frame.json, frame.inputs, jsonNodes ? frame.children : void 0);
			if (stack.length > 0) stack[stack.length - 1].children.push(node);
			else result = node;
		}
		return result;
	}
	module.exports = fromJSON;
	fromJSON.default = fromJSON;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/map-generator.js
var require_map_generator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { dirname, relative, resolve, sep } = __require("path");
	var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
	var { pathToFileURL } = __require("url");
	var Input = require_input();
	var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	var pathAvailable = Boolean(dirname && resolve && relative && sep);
	var MapGenerator = class {
		constructor(stringify, root, opts, cssString) {
			this.stringify = stringify;
			this.mapOpts = opts.map || {};
			this.root = root;
			this.opts = opts;
			this.css = cssString;
			this.originalCSS = cssString;
			this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
			this.memoizedFileURLs = /* @__PURE__ */ new Map();
			this.memoizedPaths = /* @__PURE__ */ new Map();
			this.memoizedURLs = /* @__PURE__ */ new Map();
		}
		addAnnotation() {
			let content;
			if (this.isInline()) content = "data:application/json;base64," + this.toBase64(this.map.toString());
			else if (typeof this.mapOpts.annotation === "string") content = this.mapOpts.annotation;
			else if (typeof this.mapOpts.annotation === "function") content = this.mapOpts.annotation(this.opts.to, this.root);
			else content = this.outputFile() + ".map";
			let eol = "\n";
			if (this.css.includes("\r\n")) eol = "\r\n";
			this.css += eol + "/*# sourceMappingURL=" + content + " */";
		}
		applyPrevMaps() {
			for (let prev of this.previous()) {
				let from = this.toUrl(this.path(prev.file));
				let root = prev.root || dirname(prev.file);
				let map;
				if (this.mapOpts.sourcesContent === false) {
					map = new SourceMapConsumer(prev.text);
					if (map.sourcesContent) map.sourcesContent = null;
				} else map = prev.consumer();
				this.map.applySourceMap(map, from, this.toUrl(this.path(root)));
			}
		}
		clearAnnotation() {
			if (this.mapOpts.annotation === false) return;
			if (this.root) {
				let node;
				for (let i = this.root.nodes.length - 1; i >= 0; i--) {
					node = this.root.nodes[i];
					if (node.type !== "comment") continue;
					if (node.text.startsWith("# sourceMappingURL=")) this.root.removeChild(i);
				}
			} else if (this.css) {
				let startIndex;
				while ((startIndex = this.css.lastIndexOf("/*#")) !== -1) {
					let endIndex = this.css.indexOf("*/", startIndex + 3);
					if (endIndex === -1) break;
					while (startIndex > 0 && this.css[startIndex - 1] === "\n") startIndex--;
					this.css = this.css.slice(0, startIndex) + this.css.slice(endIndex + 2);
				}
			}
		}
		generate() {
			this.clearAnnotation();
			if (pathAvailable && sourceMapAvailable && this.isMap()) return this.generateMap();
			else {
				let result = "";
				this.stringify(this.root, (i) => {
					result += i;
				});
				return [result];
			}
		}
		generateMap() {
			if (this.root) this.generateString();
			else if (this.previous().length === 1) {
				let prev = this.previous()[0].consumer();
				prev.file = this.outputFile();
				this.map = SourceMapGenerator.fromSourceMap(prev, { ignoreInvalidMapping: true });
			} else {
				this.map = new SourceMapGenerator({
					file: this.outputFile(),
					ignoreInvalidMapping: true
				});
				this.map.addMapping({
					generated: {
						column: 0,
						line: 1
					},
					original: {
						column: 0,
						line: 1
					},
					source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
				});
			}
			if (this.isSourcesContent()) this.setSourcesContent();
			if (this.root && this.previous().length > 0) this.applyPrevMaps();
			if (this.isAnnotation()) this.addAnnotation();
			if (this.isInline()) return [this.css];
			else return [this.css, this.map];
		}
		generateString() {
			this.css = "";
			this.map = new SourceMapGenerator({
				file: this.outputFile(),
				ignoreInvalidMapping: true
			});
			let line = 1;
			let column = 1;
			let noSource = "<no source>";
			let mapping = {
				generated: {
					column: 0,
					line: 0
				},
				original: {
					column: 0,
					line: 0
				},
				source: ""
			};
			let last, lines;
			this.stringify(this.root, (str, node, type) => {
				this.css += str;
				if (node && type !== "end") {
					mapping.generated.line = line;
					mapping.generated.column = column - 1;
					if (node.source && node.source.start) {
						mapping.source = this.sourcePath(node);
						mapping.original.line = node.source.start.line;
						mapping.original.column = node.source.start.column - 1;
						this.map.addMapping(mapping);
					} else {
						mapping.source = noSource;
						mapping.original.line = 1;
						mapping.original.column = 0;
						this.map.addMapping(mapping);
					}
				}
				lines = str.match(/\n/g);
				if (lines) {
					line += lines.length;
					last = str.lastIndexOf("\n");
					column = str.length - last;
				} else column += str.length;
				if (node && type !== "start") {
					let p = node.parent || { raws: {} };
					if (!(node.type === "decl" || node.type === "atrule" && !node.nodes) || node !== p.last || p.raws.semicolon) {
						if (node.source && node.source.end) {
							mapping.source = this.sourcePath(node);
							mapping.original.line = node.source.end.line;
							mapping.original.column = node.source.end.column - 1;
							mapping.generated.line = line;
							mapping.generated.column = column - 2;
							this.map.addMapping(mapping);
						} else {
							mapping.source = noSource;
							mapping.original.line = 1;
							mapping.original.column = 0;
							mapping.generated.line = line;
							mapping.generated.column = column - 1;
							this.map.addMapping(mapping);
						}
					}
				}
			});
		}
		isAnnotation() {
			if (this.isInline()) return true;
			if (typeof this.mapOpts.annotation !== "undefined") return this.mapOpts.annotation;
			if (this.previous().length) return this.previous().some((i) => i.annotation);
			return true;
		}
		isInline() {
			if (typeof this.mapOpts.inline !== "undefined") return this.mapOpts.inline;
			let annotation = this.mapOpts.annotation;
			if (typeof annotation !== "undefined" && annotation !== true) return false;
			if (this.previous().length) return this.previous().some((i) => i.inline);
			return true;
		}
		isMap() {
			if (typeof this.opts.map !== "undefined") return !!this.opts.map;
			return this.previous().length > 0;
		}
		isSourcesContent() {
			if (typeof this.mapOpts.sourcesContent !== "undefined") return this.mapOpts.sourcesContent;
			if (this.previous().length) return this.previous().some((i) => i.withContent());
			return true;
		}
		outputFile() {
			if (this.opts.to) return this.path(this.opts.to);
			else if (this.opts.from) return this.path(this.opts.from);
			else return "to.css";
		}
		path(file) {
			if (this.mapOpts.absolute) return file;
			if (file.charCodeAt(0) === 60) return file;
			if (/^\w+:\/\//.test(file)) return file;
			let cached = this.memoizedPaths.get(file);
			if (cached) return cached;
			let from = this.opts.to ? dirname(this.opts.to) : ".";
			if (typeof this.mapOpts.annotation === "string") from = dirname(resolve(from, this.mapOpts.annotation));
			let path = relative(from, file);
			this.memoizedPaths.set(file, path);
			return path;
		}
		previous() {
			if (!this.previousMaps) {
				this.previousMaps = [];
				if (this.root) this.root.walk((node) => {
					if (node.source && node.source.input.map) {
						let map = node.source.input.map;
						if (!this.previousMaps.includes(map)) this.previousMaps.push(map);
					}
				});
				else {
					let input = new Input(this.originalCSS, this.opts);
					if (input.map) this.previousMaps.push(input.map);
				}
			}
			return this.previousMaps;
		}
		setSourcesContent() {
			let already = {};
			if (this.root) this.root.walk((node) => {
				if (node.source) {
					let from = node.source.input.from;
					if (from && !already[from]) {
						already[from] = true;
						let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
						this.map.setSourceContent(fromUrl, node.source.input.css);
					}
				}
			});
			else if (this.css) {
				let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
				this.map.setSourceContent(from, this.css);
			}
		}
		sourcePath(node) {
			if (this.mapOpts.from) return this.toUrl(this.mapOpts.from);
			else if (this.usesFileUrls) return this.toFileUrl(node.source.input.from);
			else return this.toUrl(this.path(node.source.input.from));
		}
		toBase64(str) {
			if (Buffer) return Buffer.from(str).toString("base64");
			else return window.btoa(unescape(encodeURIComponent(str)));
		}
		toFileUrl(path) {
			let cached = this.memoizedFileURLs.get(path);
			if (cached) return cached;
			if (pathToFileURL) {
				let fileURL = pathToFileURL(path).toString();
				this.memoizedFileURLs.set(path, fileURL);
				return fileURL;
			} else throw new Error("`map.absolute` option is not available in this PostCSS build");
		}
		toUrl(path) {
			let cached = this.memoizedURLs.get(path);
			if (cached) return cached;
			if (sep === "\\") path = path.replace(/\\/g, "/");
			let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
			this.memoizedURLs.set(path, url);
			return url;
		}
	};
	module.exports = MapGenerator;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var AtRule = require_at_rule();
	var Comment = require_comment();
	var Declaration = require_declaration();
	var Root = require_root();
	var Rule = require_rule();
	var tokenizer = require_tokenize();
	var SAFE_COMMENT_NEIGHBOR = {
		empty: true,
		space: true
	};
	function findLastWithPosition(tokens) {
		for (let i = tokens.length - 1; i >= 0; i--) {
			let token = tokens[i];
			let pos = token[3] || token[2];
			if (pos) return pos;
		}
	}
	function tokensToString(tokens, from, to) {
		let result = "";
		for (let i = from; i < to; i++) result += tokens[i][1];
		return result;
	}
	var Parser = class {
		constructor(input) {
			this.input = input;
			this.root = new Root();
			this.current = this.root;
			this.spaces = "";
			this.semicolon = false;
			this.createTokenizer();
			this.root.source = {
				input,
				start: {
					column: 1,
					line: 1,
					offset: 0
				}
			};
		}
		atrule(token) {
			let node = new AtRule();
			node.name = token[1].slice(1);
			if (node.name === "") this.unnamedAtrule(node, token);
			this.init(node, token[2]);
			let type;
			let prev;
			let shift;
			let last = false;
			let open = false;
			let params = [];
			let brackets = [];
			while (!this.tokenizer.endOfFile()) {
				token = this.tokenizer.nextToken();
				type = token[0];
				if (type === "(" || type === "[") brackets.push(type === "(" ? ")" : "]");
				else if (type === "{" && brackets.length > 0) brackets.push("}");
				else if (type === brackets[brackets.length - 1]) brackets.pop();
				if (brackets.length === 0) {
					if (type === ";") {
						node.source.end = this.getPosition(token[2]);
						node.source.end.offset++;
						this.semicolon = true;
						break;
					} else if (type === "{") {
						open = true;
						break;
					} else if (type === "}") {
						if (params.length > 0) {
							shift = params.length - 1;
							prev = params[shift];
							while (prev && prev[0] === "space") prev = params[--shift];
							if (prev) {
								node.source.end = this.getPosition(prev[3] || prev[2]);
								node.source.end.offset++;
							}
						}
						this.end(token);
						break;
					} else params.push(token);
				} else params.push(token);
				if (this.tokenizer.endOfFile()) {
					last = true;
					break;
				}
			}
			node.raws.between = this.spacesAndCommentsFromEnd(params);
			if (params.length) {
				node.raws.afterName = this.spacesAndCommentsFromStart(params);
				this.raw(node, "params", params);
				if (last) {
					token = params[params.length - 1];
					node.source.end = this.getPosition(token[3] || token[2]);
					node.source.end.offset++;
					this.spaces = node.raws.between;
					node.raws.between = "";
				}
			} else {
				node.raws.afterName = "";
				node.params = "";
			}
			if (open) {
				node.nodes = [];
				this.current = node;
			}
		}
		checkMissedSemicolon(tokens) {
			let colon = this.colon(tokens);
			if (colon === false) return;
			let founded = 0;
			let token;
			for (let j = colon - 1; j >= 0; j--) {
				token = tokens[j];
				if (token[0] !== "space") {
					founded += 1;
					if (founded === 2) break;
				}
			}
			throw this.input.error("Missed semicolon", token[0] === "word" ? token[3] + 1 : token[2]);
		}
		colon(tokens) {
			let brackets = 0;
			let prev, token, type;
			for (let [i, element] of tokens.entries()) {
				token = element;
				type = token[0];
				if (type === "(") brackets += 1;
				if (type === ")") brackets -= 1;
				if (brackets === 0 && type === ":") {
					if (!prev) this.doubleColon(token);
					else if (prev[0] === "word" && prev[1] === "progid") continue;
					else return i;
				}
				prev = token;
			}
			return false;
		}
		comment(token) {
			let node = new Comment();
			this.init(node, token[2]);
			node.source.end = this.getPosition(token[3] || token[2]);
			node.source.end.offset++;
			let text = token[1].slice(2, -2);
			if (!text.trim()) {
				node.text = "";
				node.raws.left = text;
				node.raws.right = "";
			} else {
				let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
				node.text = match[2];
				node.raws.left = match[1];
				node.raws.right = match[3];
			}
		}
		createTokenizer() {
			this.tokenizer = tokenizer(this.input);
		}
		decl(tokens, customProperty) {
			let node = new Declaration();
			this.init(node, tokens[0][2]);
			let last = tokens[tokens.length - 1];
			if (last[0] === ";") {
				this.semicolon = true;
				tokens.pop();
			}
			node.source.end = this.getPosition(last[3] || last[2] || findLastWithPosition(tokens));
			node.source.end.offset++;
			let start = 0;
			while (tokens[start][0] !== "word") {
				if (start === tokens.length - 1) this.unknownWord([tokens[start]]);
				start++;
			}
			node.raws.before += tokensToString(tokens, 0, start);
			node.source.start = this.getPosition(tokens[start][2]);
			let propStart = start;
			while (start < tokens.length) {
				let type = tokens[start][0];
				if (type === ":" || type === "space" || type === "comment") break;
				start++;
			}
			node.prop = tokensToString(tokens, propStart, start);
			let betweenStart = start;
			let token;
			while (start < tokens.length) {
				token = tokens[start];
				start++;
				if (token[0] === ":") break;
				if (token[0] === "word" && /\w/.test(token[1])) this.unknownWord([token]);
			}
			node.raws.between = tokensToString(tokens, betweenStart, start);
			if (node.prop[0] === "_" || node.prop[0] === "*") {
				node.raws.before += node.prop[0];
				node.prop = node.prop.slice(1);
			}
			let firstSpacesStart = start;
			while (start < tokens.length) {
				let next = tokens[start][0];
				if (next !== "space" && next !== "comment") break;
				start++;
			}
			let firstSpaces = tokens.slice(firstSpacesStart, start);
			tokens = tokens.slice(start);
			this.precheckMissedSemicolon(tokens);
			for (let i = tokens.length - 1; i >= 0; i--) {
				token = tokens[i];
				if (token[1].toLowerCase() === "!important") {
					node.important = true;
					let string = this.stringFrom(tokens, i);
					string = this.spacesFromEnd(tokens) + string;
					if (string !== " !important") node.raws.important = string;
					break;
				} else if (token[1].toLowerCase() === "important") {
					let cache = tokens.slice(0);
					let str = "";
					for (let j = i; j > 0; j--) {
						let type = cache[j][0];
						if (str.trim().startsWith("!") && type !== "space") break;
						str = cache.pop()[1] + str;
					}
					if (str.trim().startsWith("!")) {
						node.important = true;
						node.raws.important = str;
						tokens = cache;
					}
				}
				if (token[0] !== "space" && token[0] !== "comment") break;
			}
			if (tokens.some((i) => i[0] !== "space" && i[0] !== "comment")) {
				node.raws.between += firstSpaces.map((i) => i[1]).join("");
				firstSpaces = [];
			}
			this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
			if (node.value.includes(":") && !customProperty) this.checkMissedSemicolon(tokens);
		}
		doubleColon(token) {
			throw this.input.error("Double colon", { offset: token[2] }, { offset: token[2] + token[1].length });
		}
		emptyRule(token) {
			let node = new Rule();
			this.init(node, token[2]);
			node.selector = "";
			node.raws.between = "";
			this.current = node;
		}
		end(token) {
			if (this.current.nodes && this.current.nodes.length) this.current.raws.semicolon = this.semicolon;
			this.semicolon = false;
			this.current.raws.after = (this.current.raws.after || "") + this.spaces;
			this.spaces = "";
			if (this.current.parent) {
				this.current.source.end = this.getPosition(token[2]);
				this.current.source.end.offset++;
				this.current = this.current.parent;
			} else this.unexpectedClose(token);
		}
		endFile() {
			if (this.current.parent) this.unclosedBlock();
			if (this.current.nodes && this.current.nodes.length) this.current.raws.semicolon = this.semicolon;
			this.current.raws.after = (this.current.raws.after || "") + this.spaces;
			this.root.source.end = this.getPosition(this.tokenizer.position());
		}
		freeSemicolon(token) {
			this.spaces += token[1];
			if (this.current.nodes) {
				let prev = this.current.nodes[this.current.nodes.length - 1];
				if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
					prev.raws.ownSemicolon = this.spaces;
					this.spaces = "";
					prev.source.end = this.getPosition(token[2]);
					prev.source.end.offset += prev.raws.ownSemicolon.length;
				}
			}
		}
		getPosition(offset) {
			let pos = this.input.fromOffset(offset);
			return {
				column: pos.col,
				line: pos.line,
				offset
			};
		}
		init(node, offset) {
			this.current.push(node);
			node.source = {
				input: this.input,
				start: this.getPosition(offset)
			};
			node.raws.before = this.spaces;
			this.spaces = "";
			if (node.type !== "comment") this.semicolon = false;
		}
		other(start) {
			let end = false;
			let type = null;
			let colon = false;
			let bracket = null;
			let brackets = [];
			let customProperty = start[1].startsWith("--");
			let tokens = [];
			let token = start;
			while (token) {
				type = token[0];
				tokens.push(token);
				if (type === "(" || type === "[") {
					if (!bracket) bracket = token;
					brackets.push(type === "(" ? ")" : "]");
				} else if (customProperty && colon && type === "{") {
					if (!bracket) bracket = token;
					brackets.push("}");
				} else if (brackets.length === 0) {
					if (type === ";") {
						if (colon) {
							this.decl(tokens, customProperty);
							return;
						} else break;
					} else if (type === "{") {
						this.rule(tokens);
						return;
					} else if (type === "}") {
						this.tokenizer.back(tokens.pop());
						end = true;
						break;
					} else if (type === ":") colon = true;
				} else if (type === brackets[brackets.length - 1]) {
					brackets.pop();
					if (brackets.length === 0) bracket = null;
				}
				token = this.tokenizer.nextToken();
			}
			if (this.tokenizer.endOfFile()) end = true;
			if (brackets.length > 0) this.unclosedBracket(bracket);
			if (end && colon) {
				if (!customProperty) while (tokens.length) {
					token = tokens[tokens.length - 1][0];
					if (token !== "space" && token !== "comment") break;
					this.tokenizer.back(tokens.pop());
				}
				this.decl(tokens, customProperty);
			} else this.unknownWord(tokens);
		}
		parse() {
			let token;
			while (!this.tokenizer.endOfFile()) {
				token = this.tokenizer.nextToken();
				switch (token[0]) {
					case "space":
						this.spaces += token[1];
						break;
					case ";":
						this.freeSemicolon(token);
						break;
					case "}":
						this.end(token);
						break;
					case "comment":
						this.comment(token);
						break;
					case "at-word":
						this.atrule(token);
						break;
					case "{":
						this.emptyRule(token);
						break;
					default: this.other(token);
				}
			}
			this.endFile();
		}
		precheckMissedSemicolon() {}
		raw(node, prop, tokens, customProperty) {
			let token, type;
			let length = tokens.length;
			let value = "";
			let clean = true;
			let next, prev;
			for (let i = 0; i < length; i += 1) {
				token = tokens[i];
				type = token[0];
				if (type === "space" && i === length - 1 && !customProperty) clean = false;
				else if (type === "comment") {
					prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
					next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
					if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
						if (value.slice(-1) === ",") clean = false;
						else value += token[1];
					} else clean = false;
				} else value += token[1];
			}
			if (!clean) {
				let raw = tokens.reduce((all, i) => all + i[1], "");
				node.raws[prop] = {
					raw,
					value
				};
			}
			node[prop] = value;
		}
		rule(tokens) {
			tokens.pop();
			let node = new Rule();
			this.init(node, tokens[0][2]);
			node.raws.between = this.spacesAndCommentsFromEnd(tokens);
			this.raw(node, "selector", tokens);
			this.current = node;
		}
		spacesAndCommentsFromEnd(tokens) {
			let lastTokenType;
			let spaces = "";
			while (tokens.length) {
				lastTokenType = tokens[tokens.length - 1][0];
				if (lastTokenType !== "space" && lastTokenType !== "comment") break;
				spaces = tokens.pop()[1] + spaces;
			}
			return spaces;
		}
		spacesAndCommentsFromStart(tokens) {
			let next;
			let spaces = "";
			while (tokens.length) {
				next = tokens[0][0];
				if (next !== "space" && next !== "comment") break;
				spaces += tokens.shift()[1];
			}
			return spaces;
		}
		spacesFromEnd(tokens) {
			let lastTokenType;
			let spaces = "";
			while (tokens.length) {
				lastTokenType = tokens[tokens.length - 1][0];
				if (lastTokenType !== "space") break;
				spaces = tokens.pop()[1] + spaces;
			}
			return spaces;
		}
		stringFrom(tokens, from) {
			let result = "";
			for (let i = from; i < tokens.length; i++) result += tokens[i][1];
			tokens.splice(from, tokens.length - from);
			return result;
		}
		unclosedBlock() {
			let pos = this.current.source.start;
			throw this.input.error("Unclosed block", pos.line, pos.column);
		}
		unclosedBracket(bracket) {
			throw this.input.error("Unclosed bracket", { offset: bracket[2] }, { offset: bracket[2] + 1 });
		}
		unexpectedClose(token) {
			throw this.input.error("Unexpected }", { offset: token[2] }, { offset: token[2] + 1 });
		}
		unknownWord(tokens) {
			throw this.input.error("Unknown word " + tokens[0][1], { offset: tokens[0][2] }, { offset: tokens[0][2] + tokens[0][1].length });
		}
		unnamedAtrule(node, token) {
			throw this.input.error("At-rule without name", { offset: token[2] }, { offset: token[2] + token[1].length });
		}
	};
	module.exports = Parser;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Container = require_container();
	var Input = require_input();
	var Parser = require_parser();
	function parse(css, opts) {
		let parser = new Parser(new Input(css, opts));
		try {
			parser.parse();
		} catch (e) {
			if (process.env.NODE_ENV !== "production") {
				if (e.name === "CssSyntaxError" && opts && opts.from) {
					if (/\.scss$/i.test(opts.from)) e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
					else if (/\.sass/i.test(opts.from)) e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
					else if (/\.less$/i.test(opts.from)) e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
				}
			}
			throw e;
		}
		return parser.root;
	}
	module.exports = parse;
	parse.default = parse;
	Container.registerParse(parse);
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/warning.js
var require_warning = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Container = require_container();
	var { my } = require_symbols();
	var Warning = class {
		constructor(text, opts = {}) {
			this.type = "warning";
			this.text = text;
			if (opts.node && opts.node.source) {
				if (!opts.node[my]) Container.rebuild(opts.node);
				let range = opts.node.rangeBy(opts);
				this.line = range.start.line;
				this.column = range.start.column;
				this.endLine = range.end.line;
				this.endColumn = range.end.column;
			}
			for (let opt in opts) this[opt] = opts[opt];
		}
		toString() {
			if (this.node) return this.node.error(this.text, {
				index: this.index,
				plugin: this.plugin,
				word: this.word
			}).message;
			if (this.plugin) return this.plugin + ": " + this.text;
			return this.text;
		}
	};
	module.exports = Warning;
	Warning.default = Warning;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/result.js
var require_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Warning = require_warning();
	var Result = class {
		get content() {
			return this.css;
		}
		constructor(processor, root, opts) {
			this.processor = processor;
			this.messages = [];
			this.root = root;
			this.opts = opts;
			this.css = "";
			this.map = void 0;
		}
		toString() {
			return this.css;
		}
		warn(text, opts = {}) {
			if (!opts.plugin) {
				if (this.lastPlugin && this.lastPlugin.postcssPlugin) opts.plugin = this.lastPlugin.postcssPlugin;
			}
			let warning = new Warning(text, opts);
			this.messages.push(warning);
			return warning;
		}
		warnings() {
			return this.messages.filter((i) => i.type === "warning");
		}
	};
	module.exports = Result;
	Result.default = Result;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/warn-once.js
var require_warn_once = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var printed = {};
	module.exports = function warnOnce(message) {
		if (printed[message]) return;
		printed[message] = true;
		if (typeof console !== "undefined" && console.warn) console.warn(message);
	};
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/lazy-result.js
var require_lazy_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Container = require_container();
	var Document = require_document();
	var MapGenerator = require_map_generator();
	var parse = require_parse();
	var Result = require_result();
	var Root = require_root();
	var stringify = require_stringify();
	var { isClean, my } = require_symbols();
	var warnOnce = require_warn_once();
	var TYPE_TO_CLASS_NAME = {
		atrule: "AtRule",
		comment: "Comment",
		decl: "Declaration",
		document: "Document",
		root: "Root",
		rule: "Rule"
	};
	var PLUGIN_PROPS = {
		AtRule: true,
		AtRuleExit: true,
		Comment: true,
		CommentExit: true,
		Declaration: true,
		DeclarationExit: true,
		Document: true,
		DocumentExit: true,
		Once: true,
		OnceExit: true,
		postcssPlugin: true,
		prepare: true,
		Root: true,
		RootExit: true,
		Rule: true,
		RuleExit: true
	};
	var NOT_VISITORS = {
		Once: true,
		postcssPlugin: true,
		prepare: true
	};
	var CHILDREN = 0;
	function isPromise(obj) {
		return typeof obj === "object" && typeof obj.then === "function";
	}
	function getEvents(node) {
		let key = false;
		let type = TYPE_TO_CLASS_NAME[node.type];
		if (node.type === "decl") key = node.prop.toLowerCase();
		else if (node.type === "atrule") key = node.name.toLowerCase();
		if (key && node.append) return [
			type,
			type + "-" + key,
			CHILDREN,
			type + "Exit",
			type + "Exit-" + key
		];
		else if (key) return [
			type,
			type + "-" + key,
			type + "Exit",
			type + "Exit-" + key
		];
		else if (node.append) return [
			type,
			CHILDREN,
			type + "Exit"
		];
		else return [type, type + "Exit"];
	}
	function toStack(node) {
		let events;
		if (node.type === "document") events = [
			"Document",
			CHILDREN,
			"DocumentExit"
		];
		else if (node.type === "root") events = [
			"Root",
			CHILDREN,
			"RootExit"
		];
		else events = getEvents(node);
		return {
			eventIndex: 0,
			events,
			iterator: 0,
			node,
			visitorIndex: 0,
			visitors: []
		};
	}
	function cleanMarks(node) {
		let stack = [node];
		while (stack.length > 0) {
			let next = stack.pop();
			next[isClean] = false;
			if (next.nodes) for (let i of next.nodes) stack.push(i);
		}
		return node;
	}
	var postcss = {};
	var LazyResult = class LazyResult {
		get content() {
			return this.stringify().content;
		}
		get css() {
			return this.stringify().css;
		}
		get map() {
			return this.stringify().map;
		}
		get messages() {
			return this.sync().messages;
		}
		get opts() {
			return this.result.opts;
		}
		get processor() {
			return this.result.processor;
		}
		get root() {
			return this.sync().root;
		}
		get [Symbol.toStringTag]() {
			return "LazyResult";
		}
		constructor(processor, css, opts) {
			this.stringified = false;
			this.processed = false;
			let root;
			if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) root = cleanMarks(css);
			else if (css instanceof LazyResult || css instanceof Result) {
				root = cleanMarks(css.root);
				if (css.map) {
					if (typeof opts.map === "undefined") opts.map = {};
					if (!opts.map.inline) opts.map.inline = false;
					opts.map.prev = css.map;
				}
			} else {
				let parser = parse;
				if (opts.syntax) parser = opts.syntax.parse;
				if (opts.parser) parser = opts.parser;
				if (parser.parse) parser = parser.parse;
				try {
					root = parser(css, opts);
				} catch (error) {
					this.processed = true;
					this.error = error;
				}
				if (root && !root[my])
 /* c8 ignore next 2 */
				Container.rebuild(root);
			}
			this.result = new Result(processor, root, opts);
			this.helpers = {
				...postcss,
				postcss,
				result: this.result
			};
			this.plugins = this.processor.plugins.map((plugin) => {
				if (typeof plugin === "object" && plugin.prepare) return {
					...plugin,
					...plugin.prepare(this.result)
				};
				else return plugin;
			});
		}
		async() {
			if (this.error) return Promise.reject(this.error);
			if (this.processed) return Promise.resolve(this.result);
			if (!this.processing) this.processing = this.runAsync();
			return this.processing;
		}
		catch(onRejected) {
			return this.async().catch(onRejected);
		}
		finally(onFinally) {
			return this.async().then(onFinally, onFinally);
		}
		getAsyncError() {
			throw new Error("Use process(css).then(cb) to work with async plugins");
		}
		handleError(error, node) {
			let plugin = this.result.lastPlugin;
			try {
				if (node) node.addToError(error);
				this.error = error;
				if (error.name === "CssSyntaxError" && !error.plugin) {
					error.plugin = plugin.postcssPlugin;
					error.setMessage();
				} else if (plugin.postcssVersion) {
					if (process.env.NODE_ENV !== "production") {
						let pluginName = plugin.postcssPlugin;
						let pluginVer = plugin.postcssVersion;
						let runtimeVer = this.result.processor.version;
						let a = pluginVer.split(".");
						let b = runtimeVer.split(".");
						if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) console.error("Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below.");
					}
				}
			} catch (err) {
				/* c8 ignore next 3 */
				if (console && console.error) console.error(err);
			}
			return error;
		}
		prepareVisitors() {
			this.listeners = {};
			let add = (plugin, type, cb) => {
				if (!this.listeners[type]) this.listeners[type] = [];
				this.listeners[type].push([plugin, cb]);
			};
			for (let plugin of this.plugins) if (typeof plugin === "object") for (let event in plugin) {
				if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) throw new Error(`Unknown event ${event} in ${plugin.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`);
				if (!NOT_VISITORS[event]) {
					if (typeof plugin[event] === "object") for (let filter in plugin[event]) if (filter === "*") add(plugin, event, plugin[event][filter]);
					else add(plugin, event + "-" + filter.toLowerCase(), plugin[event][filter]);
					else if (typeof plugin[event] === "function") add(plugin, event, plugin[event]);
				}
			}
			this.hasListener = Object.keys(this.listeners).length > 0;
		}
		async runAsync() {
			this.plugin = 0;
			for (let i = 0; i < this.plugins.length; i++) {
				let plugin = this.plugins[i];
				let promise = this.runOnRoot(plugin);
				if (isPromise(promise)) try {
					await promise;
				} catch (error) {
					throw this.handleError(error);
				}
			}
			this.prepareVisitors();
			if (this.hasListener) {
				let root = this.result.root;
				while (!root[isClean]) {
					root[isClean] = true;
					let stack = [toStack(root)];
					while (stack.length > 0) {
						let promise = this.visitTick(stack);
						if (isPromise(promise)) try {
							await promise;
						} catch (e) {
							let node = stack[stack.length - 1].node;
							throw this.handleError(e, node);
						}
					}
				}
				if (this.listeners.OnceExit) for (let [plugin, visitor] of this.listeners.OnceExit) {
					this.result.lastPlugin = plugin;
					try {
						if (root.type === "document") {
							let roots = root.nodes.map((subRoot) => visitor(subRoot, this.helpers));
							await Promise.all(roots);
						} else await visitor(root, this.helpers);
					} catch (e) {
						throw this.handleError(e);
					}
				}
			}
			this.processed = true;
			return this.stringify();
		}
		runOnRoot(plugin) {
			this.result.lastPlugin = plugin;
			try {
				if (typeof plugin === "object" && plugin.Once) {
					if (this.result.root.type === "document") {
						let roots = this.result.root.nodes.map((root) => plugin.Once(root, this.helpers));
						if (isPromise(roots[0])) return Promise.all(roots);
						return roots;
					}
					return plugin.Once(this.result.root, this.helpers);
				} else if (typeof plugin === "function") return plugin(this.result.root, this.result);
			} catch (error) {
				throw this.handleError(error);
			}
		}
		stringify() {
			if (this.error) throw this.error;
			if (this.stringified) return this.result;
			this.stringified = true;
			this.sync();
			let opts = this.result.opts;
			let str = stringify;
			if (opts.syntax) str = opts.syntax.stringify;
			if (opts.stringifier) str = opts.stringifier;
			if (str.stringify) str = str.stringify;
			let rootSource = this.result.root.source;
			if (opts.map === void 0 && !(rootSource && rootSource.input && rootSource.input.map)) {
				let result = "";
				str(this.result.root, (i) => {
					result += i;
				});
				this.result.css = result;
				return this.result;
			}
			let data = new MapGenerator(str, this.result.root, this.result.opts).generate();
			this.result.css = data[0];
			this.result.map = data[1];
			return this.result;
		}
		sync() {
			if (this.error) throw this.error;
			if (this.processed) return this.result;
			this.processed = true;
			if (this.processing) throw this.getAsyncError();
			for (let plugin of this.plugins) if (isPromise(this.runOnRoot(plugin))) throw this.getAsyncError();
			this.prepareVisitors();
			if (this.hasListener) {
				let root = this.result.root;
				while (!root[isClean]) {
					root[isClean] = true;
					this.walkSync(root);
				}
				if (this.listeners.OnceExit) {
					if (root.type === "document") for (let subRoot of root.nodes) this.visitSync(this.listeners.OnceExit, subRoot);
					else this.visitSync(this.listeners.OnceExit, root);
				}
			}
			return this.result;
		}
		then(onFulfilled, onRejected) {
			if (process.env.NODE_ENV !== "production") {
				if (!("from" in this.opts)) warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
			}
			return this.async().then(onFulfilled, onRejected);
		}
		toString() {
			return this.css;
		}
		visitSync(visitors, node) {
			for (let [plugin, visitor] of visitors) {
				this.result.lastPlugin = plugin;
				let promise;
				try {
					promise = visitor(node, this.helpers);
				} catch (e) {
					throw this.handleError(e, node.proxyOf);
				}
				if (node.type !== "root" && node.type !== "document" && !node.parent) return true;
				if (isPromise(promise)) throw this.getAsyncError();
			}
		}
		visitTick(stack) {
			let visit = stack[stack.length - 1];
			let { node, visitors } = visit;
			if (node.type !== "root" && node.type !== "document" && !node.parent) {
				stack.pop();
				return;
			}
			if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
				let [plugin, visitor] = visitors[visit.visitorIndex];
				visit.visitorIndex += 1;
				if (visit.visitorIndex === visitors.length) {
					visit.visitors = [];
					visit.visitorIndex = 0;
				}
				this.result.lastPlugin = plugin;
				try {
					return visitor(node.toProxy(), this.helpers);
				} catch (e) {
					throw this.handleError(e, node);
				}
			}
			if (visit.iterator !== 0) {
				let iterator = visit.iterator;
				if (visit.descending) {
					visit.descending = false;
					node.indexes[iterator] += 1;
				}
				let child;
				while (child = node.nodes[node.indexes[iterator]]) {
					if (!child[isClean]) {
						child[isClean] = true;
						visit.descending = true;
						stack.push(toStack(child));
						return;
					}
					node.indexes[iterator] += 1;
				}
				visit.iterator = 0;
				delete node.indexes[iterator];
			}
			let events = visit.events;
			while (visit.eventIndex < events.length) {
				let event = events[visit.eventIndex];
				visit.eventIndex += 1;
				if (event === CHILDREN) {
					if (node.nodes && node.nodes.length) {
						node[isClean] = true;
						visit.iterator = node.getIterator();
					}
					return;
				} else if (this.listeners[event]) {
					visit.visitors = this.listeners[event];
					return;
				}
			}
			stack.pop();
		}
		walkSync(node) {
			node[isClean] = true;
			let stack = [{
				eventIndex: 0,
				events: getEvents(node),
				iterator: 0,
				node
			}];
			while (stack.length > 0) {
				let visit = stack[stack.length - 1];
				let visitNode = visit.node;
				if (visit.iterator !== 0) {
					let iterator = visit.iterator;
					if (visit.descending) {
						visit.descending = false;
						visitNode.indexes[iterator] += 1;
					}
					let child;
					let descended = false;
					while (child = visitNode.nodes[visitNode.indexes[iterator]]) {
						if (!child[isClean]) {
							child[isClean] = true;
							visit.descending = true;
							stack.push({
								eventIndex: 0,
								events: getEvents(child),
								iterator: 0,
								node: child
							});
							descended = true;
							break;
						}
						visitNode.indexes[iterator] += 1;
					}
					if (descended) continue;
					visit.iterator = 0;
					delete visitNode.indexes[iterator];
				}
				if (visit.eventIndex < visit.events.length) {
					let event = visit.events[visit.eventIndex];
					visit.eventIndex += 1;
					if (event === CHILDREN) {
						if (visitNode.nodes && visitNode.nodes.length) visit.iterator = visitNode.getIterator();
					} else {
						let visitors = this.listeners[event];
						if (visitors) {
							if (this.visitSync(visitors, visitNode.toProxy())) stack.pop();
						}
					}
					continue;
				}
				stack.pop();
			}
		}
		warnings() {
			return this.sync().warnings();
		}
	};
	LazyResult.registerPostcss = (dependant) => {
		postcss = dependant;
	};
	module.exports = LazyResult;
	LazyResult.default = LazyResult;
	Root.registerLazyResult(LazyResult);
	Document.registerLazyResult(LazyResult);
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/no-work-result.js
var require_no_work_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MapGenerator = require_map_generator();
	var parse = require_parse();
	var Result = require_result();
	var stringify = require_stringify();
	var warnOnce = require_warn_once();
	var NoWorkResult = class {
		get content() {
			return this.result.css;
		}
		get css() {
			return this.result.css;
		}
		get map() {
			return this.result.map;
		}
		get messages() {
			return [];
		}
		get opts() {
			return this.result.opts;
		}
		get processor() {
			return this.result.processor;
		}
		get root() {
			if (this._root) return this._root;
			let root;
			let parser = parse;
			try {
				root = parser(this._css, this._opts);
			} catch (error) {
				this.error = error;
			}
			if (this.error) throw this.error;
			else {
				this._root = root;
				return root;
			}
		}
		get [Symbol.toStringTag]() {
			return "NoWorkResult";
		}
		constructor(processor, css, opts) {
			css = css.toString();
			this.stringified = false;
			this._processor = processor;
			this._css = css;
			this._opts = opts;
			this._map = void 0;
			let str = stringify;
			this.result = new Result(this._processor, void 0, this._opts);
			this.result.css = css;
			let self = this;
			Object.defineProperty(this.result, "root", { get() {
				return self.root;
			} });
			let map = new MapGenerator(str, void 0, this._opts, css);
			if (map.isMap()) {
				let [generatedCSS, generatedMap] = map.generate();
				if (generatedCSS) this.result.css = generatedCSS;
				if (generatedMap) this.result.map = generatedMap;
			} else {
				map.clearAnnotation();
				this.result.css = map.css;
			}
		}
		async() {
			if (this.error) return Promise.reject(this.error);
			return Promise.resolve(this.result);
		}
		catch(onRejected) {
			return this.async().catch(onRejected);
		}
		finally(onFinally) {
			return this.async().then(onFinally, onFinally);
		}
		sync() {
			if (this.error) throw this.error;
			return this.result;
		}
		then(onFulfilled, onRejected) {
			if (process.env.NODE_ENV !== "production") {
				if (!("from" in this._opts)) warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
			}
			return this.async().then(onFulfilled, onRejected);
		}
		toString() {
			return this._css;
		}
		warnings() {
			return [];
		}
	};
	module.exports = NoWorkResult;
	NoWorkResult.default = NoWorkResult;
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/processor.js
var require_processor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Document = require_document();
	var LazyResult = require_lazy_result();
	var NoWorkResult = require_no_work_result();
	var Root = require_root();
	var Processor = class {
		constructor(plugins = []) {
			this.version = "8.5.26";
			this.plugins = this.normalize(plugins);
		}
		normalize(plugins) {
			let normalized = [];
			for (let i of plugins) {
				if (i.postcss === true) i = i();
				else if (i.postcss) i = i.postcss;
				if (typeof i === "object" && Array.isArray(i.plugins)) normalized = normalized.concat(i.plugins);
				else if (typeof i === "object" && i.postcssPlugin) normalized.push(i);
				else if (typeof i === "function") normalized.push(i);
				else if (typeof i === "object" && (i.parse || i.stringify)) {
					if (process.env.NODE_ENV !== "production") throw new Error("PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation.");
				} else throw new Error(i + " is not a PostCSS plugin");
			}
			return normalized;
		}
		process(css, opts = {}) {
			if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) return new NoWorkResult(this, css, opts);
			else return new LazyResult(this, css, opts);
		}
		use(plugin) {
			this.plugins = this.plugins.concat(this.normalize([plugin]));
			return this;
		}
	};
	module.exports = Processor;
	Processor.default = Processor;
	Root.registerProcessor(Processor);
	Document.registerProcessor(Processor);
}));
//#endregion
//#region node_modules/.pnpm/postcss@8.5.26/node_modules/postcss/lib/postcss.js
var require_postcss = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var AtRule = require_at_rule();
	var Comment = require_comment();
	var Container = require_container();
	var CssSyntaxError = require_css_syntax_error();
	var Declaration = require_declaration();
	var Document = require_document();
	var fromJSON = require_fromJSON();
	var Input = require_input();
	var LazyResult = require_lazy_result();
	var list = require_list();
	var Node = require_node();
	var parse = require_parse();
	var Processor = require_processor();
	var Result = require_result();
	var Root = require_root();
	var Rule = require_rule();
	var stringify = require_stringify();
	var Warning = require_warning();
	function postcss(...plugins) {
		if (plugins.length === 1 && Array.isArray(plugins[0])) plugins = plugins[0];
		return new Processor(plugins);
	}
	postcss.plugin = function plugin(name, initializer) {
		let warningPrinted = false;
		function creator(...args) {
			if (console && console.warn && !warningPrinted) {
				warningPrinted = true;
				console.warn(name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration");
				if (process.env.LANG && process.env.LANG.startsWith("cn"))
 /* c8 ignore next 7 */
				console.warn(name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226");
			}
			let transformer = initializer(...args);
			transformer.postcssPlugin = name;
			transformer.postcssVersion = new Processor().version;
			return transformer;
		}
		let cache;
		Object.defineProperty(creator, "postcss", { get() {
			if (!cache) cache = creator();
			return cache;
		} });
		creator.process = function(css, processOpts, pluginOpts) {
			return postcss([creator(pluginOpts)]).process(css, processOpts);
		};
		return creator;
	};
	postcss.stringify = stringify;
	postcss.parse = parse;
	postcss.fromJSON = fromJSON;
	postcss.list = list;
	postcss.comment = (defaults) => new Comment(defaults);
	postcss.atRule = (defaults) => new AtRule(defaults);
	postcss.decl = (defaults) => new Declaration(defaults);
	postcss.rule = (defaults) => new Rule(defaults);
	postcss.root = (defaults) => new Root(defaults);
	postcss.document = (defaults) => new Document(defaults);
	postcss.CssSyntaxError = CssSyntaxError;
	postcss.Declaration = Declaration;
	postcss.Container = Container;
	postcss.Processor = Processor;
	postcss.Document = Document;
	postcss.Comment = Comment;
	postcss.Warning = Warning;
	postcss.AtRule = AtRule;
	postcss.Result = Result;
	postcss.Input = Input;
	postcss.Rule = Rule;
	postcss.Root = Root;
	postcss.Node = Node;
	LazyResult.registerPostcss(postcss);
	module.exports = postcss;
	postcss.default = postcss;
}));
//#endregion
//#region node_modules/.pnpm/dayjs@1.11.21/node_modules/dayjs/dayjs.min.js
var require_dayjs_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, e) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
	})(exports, (function() {
		"use strict";
		var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
			name: "en",
			weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
			months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
			ordinal: function(t) {
				var e = [
					"th",
					"st",
					"nd",
					"rd"
				], n = t % 100;
				return "[" + t + (e[(n - 20) % 10] || e[n] || e[0]) + "]";
			}
		}, m = function(t, e, n) {
			var r = String(t);
			return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
		}, v = {
			s: m,
			z: function(t) {
				var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60;
				return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
			},
			m: function t(e, n) {
				if (e.date() < n.date()) return -t(n, e);
				var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, c), s = n - i < 0, u = e.clone().add(r + (s ? -1 : 1), c);
				return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
			},
			a: function(t) {
				return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
			},
			p: function(t) {
				return {
					M: c,
					y: h,
					w: o,
					d: a,
					D: d,
					h: u,
					m: s,
					s: i,
					ms: r,
					Q: f
				}[t] || String(t || "").toLowerCase().replace(/s$/, "");
			},
			u: function(t) {
				return void 0 === t;
			}
		}, g = "en", D = {};
		D[g] = M;
		var p = "$isDayjsObject", S = function(t) {
			return t instanceof _ || !(!t || !t[p]);
		}, w = function t(e, n, r) {
			var i;
			if (!e) return g;
			if ("string" == typeof e) {
				var s = e.toLowerCase();
				D[s] && (i = s), n && (D[s] = n, i = s);
				var u = e.split("-");
				if (!i && u.length > 1) return t(u[0]);
			} else {
				var a = e.name;
				D[a] = e, i = a;
			}
			return !r && i && (g = i), i || !r && g;
		}, O = function(t, e) {
			if (S(t)) return t.clone();
			var n = "object" == typeof e ? e : {};
			return n.date = t, n.args = arguments, new _(n);
		}, b = v;
		b.l = w, b.i = S, b.w = function(t, e) {
			return O(t, {
				locale: e.$L,
				utc: e.$u,
				x: e.$x,
				$offset: e.$offset
			});
		};
		var _ = function() {
			function M(t) {
				this.$L = w(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[p] = !0;
			}
			var m = M.prototype;
			return m.parse = function(t) {
				this.$d = function(t) {
					var e = t.date, n = t.utc;
					if (null === e) return /* @__PURE__ */ new Date(NaN);
					if (b.u(e)) return /* @__PURE__ */ new Date();
					if (e instanceof Date) return new Date(e);
					if ("string" == typeof e && !/Z$/i.test(e)) {
						var r = e.match($);
						if (r) {
							var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
							return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
						}
					}
					return new Date(e);
				}(t), this.init();
			}, m.init = function() {
				var t = this.$d;
				this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
			}, m.$utils = function() {
				return b;
			}, m.isValid = function() {
				return !(this.$d.toString() === l);
			}, m.isSame = function(t, e) {
				var n = O(t);
				return this.startOf(e) <= n && n <= this.endOf(e);
			}, m.isAfter = function(t, e) {
				return O(t) < this.startOf(e);
			}, m.isBefore = function(t, e) {
				return this.endOf(e) < O(t);
			}, m.$g = function(t, e, n) {
				return b.u(t) ? this[e] : this.set(n, t);
			}, m.unix = function() {
				return Math.floor(this.valueOf() / 1e3);
			}, m.valueOf = function() {
				return this.$d.getTime();
			}, m.startOf = function(t, e) {
				var n = this, r = !!b.u(e) || e, f = b.p(t), l = function(t, e) {
					var i = b.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
					return r ? i : i.endOf(a);
				}, $ = function(t, e) {
					return b.w(n.toDate()[t].apply(n.toDate("s"), (r ? [
						0,
						0,
						0,
						0
					] : [
						23,
						59,
						59,
						999
					]).slice(e)), n);
				}, y = this.$W, M = this.$M, m = this.$D, v = "set" + (this.$u ? "UTC" : "");
				switch (f) {
					case h: return r ? l(1, 0) : l(31, 11);
					case c: return r ? l(1, M) : l(0, M + 1);
					case o:
						var g = this.$locale().weekStart || 0, D = (y < g ? y + 7 : y) - g;
						return l(r ? m - D : m + (6 - D), M);
					case a:
					case d: return $(v + "Hours", 0);
					case u: return $(v + "Minutes", 1);
					case s: return $(v + "Seconds", 2);
					case i: return $(v + "Milliseconds", 3);
					default: return this.clone();
				}
			}, m.endOf = function(t) {
				return this.startOf(t, !1);
			}, m.$set = function(t, e) {
				var n, o = b.p(t), f = "set" + (this.$u ? "UTC" : ""), l = (n = {}, n[a] = f + "Date", n[d] = f + "Date", n[c] = f + "Month", n[h] = f + "FullYear", n[u] = f + "Hours", n[s] = f + "Minutes", n[i] = f + "Seconds", n[r] = f + "Milliseconds", n)[o], $ = o === a ? this.$D + (e - this.$W) : e;
				if (o === c || o === h) {
					var y = this.clone().set(d, 1);
					y.$d[l]($), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
				} else l && this.$d[l]($);
				return this.init(), this;
			}, m.set = function(t, e) {
				return this.clone().$set(t, e);
			}, m.get = function(t) {
				return this[b.p(t)]();
			}, m.add = function(r, f) {
				var d, l = this;
				r = Number(r);
				var $ = b.p(f), y = function(t) {
					var e = O(l);
					return b.w(e.date(e.date() + Math.round(t * r)), l);
				};
				if ($ === c) return this.set(c, this.$M + r);
				if ($ === h) return this.set(h, this.$y + r);
				if ($ === a) return y(1);
				if ($ === o) return y(7);
				var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[$] || 1, m = this.$d.getTime() + r * M;
				return b.w(m, this);
			}, m.subtract = function(t, e) {
				return this.add(-1 * t, e);
			}, m.format = function(t) {
				var e = this, n = this.$locale();
				if (!this.isValid()) return n.invalidDate || l;
				var r = t || "YYYY-MM-DDTHH:mm:ssZ", i = b.z(this), s = this.$H, u = this.$m, a = this.$M, o = n.weekdays, c = n.months, f = n.meridiem, h = function(t, n, i, s) {
					return t && (t[n] || t(e, r)) || i[n].slice(0, s);
				}, d = function(t) {
					return b.s(s % 12 || 12, t, "0");
				}, $ = f || function(t, e, n) {
					var r = t < 12 ? "AM" : "PM";
					return n ? r.toLowerCase() : r;
				};
				return r.replace(y, (function(t, r) {
					return r || function(t) {
						switch (t) {
							case "YY": return String(e.$y).slice(-2);
							case "YYYY": return b.s(e.$y, 4, "0");
							case "M": return a + 1;
							case "MM": return b.s(a + 1, 2, "0");
							case "MMM": return h(n.monthsShort, a, c, 3);
							case "MMMM": return h(c, a);
							case "D": return e.$D;
							case "DD": return b.s(e.$D, 2, "0");
							case "d": return String(e.$W);
							case "dd": return h(n.weekdaysMin, e.$W, o, 2);
							case "ddd": return h(n.weekdaysShort, e.$W, o, 3);
							case "dddd": return o[e.$W];
							case "H": return String(s);
							case "HH": return b.s(s, 2, "0");
							case "h": return d(1);
							case "hh": return d(2);
							case "a": return $(s, u, !0);
							case "A": return $(s, u, !1);
							case "m": return String(u);
							case "mm": return b.s(u, 2, "0");
							case "s": return String(e.$s);
							case "ss": return b.s(e.$s, 2, "0");
							case "SSS": return b.s(e.$ms, 3, "0");
							case "Z": return i;
						}
						return null;
					}(t) || i.replace(":", "");
				}));
			}, m.utcOffset = function() {
				return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
			}, m.diff = function(r, d, l) {
				var $, y = this, M = b.p(d), m = O(r), v = (m.utcOffset() - this.utcOffset()) * e, g = this - m, D = function() {
					return b.m(y, m);
				};
				switch (M) {
					case h:
						$ = D() / 12;
						break;
					case c:
						$ = D();
						break;
					case f:
						$ = D() / 3;
						break;
					case o:
						$ = (g - v) / 6048e5;
						break;
					case a:
						$ = (g - v) / 864e5;
						break;
					case u:
						$ = g / n;
						break;
					case s:
						$ = g / e;
						break;
					case i:
						$ = g / t;
						break;
					default: $ = g;
				}
				return l ? $ : b.a($);
			}, m.daysInMonth = function() {
				return this.endOf(c).$D;
			}, m.$locale = function() {
				return D[this.$L];
			}, m.locale = function(t, e) {
				if (!t) return this.$L;
				var n = this.clone(), r = w(t, e, !0);
				return r && (n.$L = r), n;
			}, m.clone = function() {
				return b.w(this.$d, this);
			}, m.toDate = function() {
				return new Date(this.valueOf());
			}, m.toJSON = function() {
				return this.isValid() ? this.toISOString() : null;
			}, m.toISOString = function() {
				return this.$d.toISOString();
			}, m.toString = function() {
				return this.$d.toUTCString();
			}, M;
		}(), Y = _.prototype;
		return O.prototype = Y, [
			["$ms", r],
			["$s", i],
			["$m", s],
			["$H", u],
			["$W", a],
			["$M", c],
			["$y", h],
			["$D", d]
		].forEach((function(t) {
			Y[t[1]] = function(e) {
				return this.$g(e, t[0], t[1]);
			};
		})), O.extend = function(t, e) {
			return t.$i || (t(e, _, O), t.$i = !0), O;
		}, O.locale = w, O.isDayjs = S, O.unix = function(t) {
			return O(1e3 * t);
		}, O.en = D[g], O.Ls = D, O.p = {}, O;
	}));
}));
//#endregion
//#region node_modules/.pnpm/launder@1.7.1/node_modules/launder/index.js
var require_launder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var dayjs = require_dayjs_min();
	function cleanHref(href) {
		href = href.replace(/[\x00-\x20]+/g, "");
		while (true) {
			const firstIndex = href.indexOf("<!--");
			if (firstIndex === -1) break;
			const lastIndex = href.indexOf("-->", firstIndex + 4);
			if (lastIndex === -1) break;
			href = href.substring(0, firstIndex) + href.substring(lastIndex + 3);
		}
		return href;
	}
	function naughtyHref(href, options) {
		options = options || {};
		const allowedSchemes = options.allowedSchemes || [
			"http",
			"https",
			"ftp",
			"mailto",
			"tel",
			"sms"
		];
		const allowProtocolRelative = options.allowProtocolRelative !== false;
		if (typeof href !== "string") return false;
		href = cleanHref(href);
		const matches = href.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
		if (!matches) {
			if (href.match(/^[/\\]{2}/)) return !allowProtocolRelative;
			return false;
		}
		const scheme = matches[1].toLowerCase();
		return allowedSchemes.indexOf(scheme) === -1;
	}
	module.exports = function(options) {
		const self = {};
		self.options = options || {};
		self.filterTag = self.options.filterTag || function(tag) {
			tag = tag.trim();
			return tag.toLowerCase();
		};
		self.string = function(s, def) {
			if (typeof s !== "string") {
				if (typeof s === "number" || typeof s === "boolean") s += "";
				else s = "";
			}
			s = s.trim();
			if (def !== void 0) {
				if (s === "") s = def;
			}
			return s;
		};
		self.strings = function(strings) {
			if (!Array.isArray(strings)) return [];
			return strings.map(function(s) {
				return self.string(s);
			});
		};
		self.integer = function(i, def, min, max) {
			if (def === void 0) def = 0;
			if (typeof i === "number") i = Math.floor(i);
			else try {
				i = parseInt(i, 10);
				if (isNaN(i)) i = def;
			} catch (e) {
				i = def;
			}
			if (typeof min === "number" && i < min) i = min;
			if (typeof max === "number" && i > max) i = max;
			return i;
		};
		self.padInteger = function(i, places) {
			let s = i + "";
			while (s.length < places) s = "0" + s;
			return s;
		};
		self.float = function(i, def, min, max) {
			if (def === void 0) def = 0;
			if (!(typeof i === "number")) try {
				i = parseFloat(i, 10);
				if (isNaN(i)) i = def;
			} catch (e) {
				i = def;
			}
			if (typeof min === "number" && i < min) i = min;
			if (typeof max === "number" && i > max) i = max;
			return i;
		};
		self.naughtyHref = naughtyHref;
		self.url = function(s, def, httpsFix) {
			s = self.string(s, def);
			if (s === def) return s;
			s = cleanHref(s);
			if (naughtyHref(s)) return def;
			s = fixUrl(s);
			if (s === null) return def;
			return s;
			function fixUrl(href) {
				if (href.match(/^(((https?|ftp):\/\/)|((mailto|tel|sms):)|#|([^/.]+)?\/|[^/.]+$)/)) return href;
				else if (href.match(/^[^/.]+\.[^/.]+/)) return (httpsFix ? "https://" : "http://") + href;
				else return null;
			}
		};
		self.select = function(s, choices, def) {
			s = self.string(s);
			if (!choices || !choices.length) return def;
			let choice;
			if (typeof choices[0] === "object") {
				choice = choices.find(function(choice) {
					if (choice.value === null || choice.value === void 0) return false;
					return choice.value.toString() === s;
				});
				if (choice != null) return choice.value;
				return def;
			}
			choice = choices.find(function(choice) {
				if (choice === null || choice === void 0) return false;
				return choice.toString() === s;
			});
			if (choice !== void 0) return choice;
			return def;
		};
		self.boolean = function(b, def) {
			if (b === true) return true;
			if (b === false) return false;
			b = self.string(b, def);
			if (b === def) {
				if (b === void 0) return false;
				return b;
			}
			b = b.toLowerCase().charAt(0);
			if (b === "" || b === "n" || b === "0" || b === "f") return false;
			if (b === "t" || b === "y" || b === "1") return true;
			return false;
		};
		self.addBooleanFilterToCriteria = function(options, name, criteria, def) {
			if (def === void 0) def = null;
			let value = typeof options === "object" && options !== null ? options[name] : options;
			value = value === void 0 ? def : value;
			value = self.booleanOrNull(value);
			if (value === null) {} else if (!value) criteria[name] = { $ne: true };
			else criteria[name] = true;
		};
		self.booleanOrNull = function(b, def) {
			if (b === true) return b;
			if (b === false) return b;
			if (b === null) return b;
			b = self.string(b, def);
			if (b === def) {
				if (def === void 0) return null;
				return b;
			}
			if (b === "null") return null;
			b = b.toLowerCase().charAt(0);
			if (b === "" || b === "n" || b === "0" || b === "f") return false;
			if (b === "t" || b === "y" || b === "1") return true;
			if (b === "a") return null;
			return def;
		};
		self.date = function(date, def, now) {
			let components;
			function returnDefault() {
				if (def === void 0) def = dayjs().format("YYYY-MM-DD");
				return def;
			}
			if (typeof date === "string") {
				if (date.match(/\//)) {
					components = date.split("/");
					if (components.length === 2) return (now || /* @__PURE__ */ new Date()).getFullYear() + "-" + self.padInteger(components[0], 2) + "-" + self.padInteger(components[1], 2);
					else if (components.length === 3) {
						if (components[2] < 100) {
							const d = now || /* @__PURE__ */ new Date();
							const nowYear = d.getFullYear() % 100;
							const nowCentury = d.getFullYear() - nowYear;
							let theirYear = parseInt(components[2]) + nowCentury;
							if (theirYear - d.getFullYear() > 50) theirYear -= 100;
							components[2] = theirYear;
						}
						return self.padInteger(components[2], 4) + "-" + self.padInteger(components[0], 2) + "-" + self.padInteger(components[1], 2);
					} else return returnDefault();
				} else if (date.match(/-/)) {
					components = date.split("-");
					if (components.length === 2) return (now || /* @__PURE__ */ new Date()).getFullYear() + "-" + self.padInteger(components[0], 2) + "-" + self.padInteger(components[1], 2);
					else if (components.length === 3) return self.padInteger(components[0], 4) + "-" + self.padInteger(components[1], 2) + "-" + self.padInteger(components[2], 2);
					else return returnDefault();
				}
			}
			try {
				if (date === null) return returnDefault();
				date = now || new Date(date);
				if (isNaN(date.getTime())) return returnDefault();
				return date.getFullYear() + "-" + self.padInteger(date.getMonth() + 1, 2) + "-" + self.padInteger(date.getDate(), 2);
			} catch (e) {
				return returnDefault();
			}
		};
		self.formatDate = function(date) {
			return dayjs(date).format("YYYY-MM-DD");
		};
		self.time = function(time, def) {
			time = self.string(time).toLowerCase();
			time = time.trim();
			const components = time.match(/^(\d+)([:|.](\d+))?([:|.](\d+))?\s*(am|pm|AM|PM|a|p|A|M)?$/);
			if (components) {
				let hours = parseInt(components[1], 10);
				const minutes = components[3] !== void 0 ? parseInt(components[3], 10) : 0;
				const seconds = components[5] !== void 0 ? parseInt(components[5], 10) : 0;
				let ampm = components[6] ? components[6].toLowerCase() : components[6];
				ampm = ampm && ampm.charAt(0);
				if (hours === 12 && ampm === "a") hours -= 12;
				else if (hours === 12 && ampm === "p") {} else if (ampm === "p") hours += 12;
				if (hours === 24 || hours === "24") hours = 0;
				return self.padInteger(hours, 2) + ":" + self.padInteger(minutes, 2) + ":" + self.padInteger(seconds, 2);
			} else {
				if (def !== void 0) return def;
				return dayjs().format("HH:mm");
			}
		};
		self.formatTime = function(date) {
			return dayjs(date).format("HH:mm:ss");
		};
		self.tags = function(tags, filter) {
			if (typeof tags === "string") tags = tags.split(/,\s*/);
			if (!Array.isArray(tags)) return [];
			return tags.map((tag) => self.string(tag)).map(filter || self.filterTag).filter((tag) => tag.length > 0);
		};
		self.idRegExp = self.options.idRegExp || /^[A-Za-z0-9_]+$/;
		self.id = function(s, def) {
			const id = self.string(s, def);
			if (id === def) return id;
			if (!id.match(self.idRegExp)) return def;
			return id;
		};
		self.ids = function(ids) {
			if (!Array.isArray(ids)) return [];
			return ids.filter(function(id) {
				return self.id(id) !== void 0;
			});
		};
		return self;
	};
	module.exports.naughtyHref = naughtyHref;
}));
//#endregion
//#region self-essentials/emdash-main/packages/core/src/utils/sanitize.ts
var import_sanitize_html = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var htmlparser = (init_dist(), __toCommonJS(dist_exports));
	var escapeStringRegexp = require_escape_string_regexp();
	var { isPlainObject } = require_is_plain_object();
	var deepmerge = require_cjs();
	var parseSrcset = require_parse_srcset();
	var { parse: postcssParse } = require_postcss();
	var { naughtyHref: launderNaughtyHref } = require_launder();
	var mediaTags = [
		"img",
		"audio",
		"video",
		"picture",
		"svg",
		"object",
		"map",
		"iframe",
		"embed"
	];
	var vulnerableTags = ["script", "style"];
	function each(obj, cb) {
		if (obj) Object.keys(obj).forEach(function(key) {
			cb(obj[key], key);
		});
	}
	function has(obj, key) {
		return {}.hasOwnProperty.call(obj, key);
	}
	function filter(a, cb) {
		const n = [];
		each(a, function(v) {
			if (cb(v)) n.push(v);
		});
		return n;
	}
	function isEmptyObject(obj) {
		for (const key in obj) if (has(obj, key)) return false;
		return true;
	}
	function stringifySrcset(parsedSrcset) {
		return parsedSrcset.map(function(part) {
			if (!part.url) throw new Error("URL missing");
			return part.url + (part.w ? ` ${part.w}w` : "") + (part.h ? ` ${part.h}h` : "") + (part.d ? ` ${part.d}x` : "");
		}).join(", ");
	}
	module.exports = sanitizeHtml;
	var VALID_HTML_ATTRIBUTE_NAME = /^[^\0\t\n\f\r /<=>]+$/;
	function sanitizeHtml(html, options, _recursing) {
		if (html == null) return "";
		if (typeof html === "number") html = html.toString();
		let result = "";
		let tempResult = "";
		function Frame(tag, attribs) {
			const that = this;
			this.tag = tag;
			this.attribs = attribs || {};
			this.tagPosition = result.length;
			this.text = "";
			this.openingTagLength = 0;
			this.mediaChildren = [];
			this.updateParentNodeText = function() {
				if (stack.length) {
					const parentFrame = stack[stack.length - 1];
					parentFrame.text += that.text;
				}
			};
			this.updateParentNodeMediaChildren = function() {
				if (stack.length && mediaTags.includes(this.tag)) stack[stack.length - 1].mediaChildren.push(this.tag);
			};
		}
		options = Object.assign({}, sanitizeHtml.defaults, options);
		options.parser = Object.assign({}, htmlParserDefaults, options.parser);
		const tagAllowed = function(name) {
			return options.allowedTags === false || (options.allowedTags || []).indexOf(name) > -1;
		};
		vulnerableTags.forEach(function(tag) {
			if (tagAllowed(tag) && !options.allowVulnerableTags) console.warn(`\n\n⚠️ Your \`allowedTags\` option includes, \`${tag}\`, which is inherently\nvulnerable to XSS attacks. Please remove it from \`allowedTags\`.\nOr, to disable this warning, add the \`allowVulnerableTags\` option\nand ensure you are accounting for this risk.\n\n`);
		});
		const nonTextTagsArray = options.nonTextTags || [
			"script",
			"style",
			"textarea",
			"option",
			"xmp"
		];
		let allowedAttributesMap;
		let allowedAttributesGlobMap;
		if (options.allowedAttributes) {
			allowedAttributesMap = {};
			allowedAttributesGlobMap = {};
			each(options.allowedAttributes, function(attributes, tag) {
				allowedAttributesMap[tag] = [];
				const globRegex = [];
				attributes.forEach(function(obj) {
					if (typeof obj === "string" && obj.indexOf("*") >= 0) globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, ".*"));
					else allowedAttributesMap[tag].push(obj);
				});
				if (globRegex.length) allowedAttributesGlobMap[tag] = new RegExp("^(" + globRegex.join("|") + ")$");
			});
		}
		const allowedClassesMap = {};
		const allowedClassesGlobMap = {};
		const allowedClassesRegexMap = {};
		each(options.allowedClasses, function(classes, tag) {
			if (allowedAttributesMap) {
				if (!has(allowedAttributesMap, tag)) allowedAttributesMap[tag] = [];
				allowedAttributesMap[tag].push("class");
			}
			allowedClassesMap[tag] = classes;
			if (Array.isArray(classes)) {
				const globRegex = [];
				allowedClassesMap[tag] = [];
				allowedClassesRegexMap[tag] = [];
				classes.forEach(function(obj) {
					if (typeof obj === "string" && obj.indexOf("*") >= 0) globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, ".*"));
					else if (obj instanceof RegExp) allowedClassesRegexMap[tag].push(obj);
					else allowedClassesMap[tag].push(obj);
				});
				if (globRegex.length) allowedClassesGlobMap[tag] = new RegExp("^(" + globRegex.join("|") + ")$");
			}
		});
		const transformTagsMap = {};
		let transformTagsAll;
		each(options.transformTags, function(transform, tag) {
			let transFun;
			if (typeof transform === "function") transFun = transform;
			else if (typeof transform === "string") transFun = sanitizeHtml.simpleTransform(transform);
			if (tag === "*") transformTagsAll = transFun;
			else transformTagsMap[tag] = transFun;
		});
		let depth;
		let stack;
		let skipMap;
		let transformMap;
		let skipText;
		let skipTextDepth;
		let addedText = false;
		initializeState();
		const parser = new htmlparser.Parser({
			onopentag: function(name, attribs) {
				if (options.onOpenTag) options.onOpenTag(name, attribs);
				if (options.enforceHtmlBoundary && name === "html") initializeState();
				if (skipText) {
					skipTextDepth++;
					return;
				}
				const frame = new Frame(name, attribs);
				stack.push(frame);
				let skip = false;
				const hasText = !!frame.text;
				let transformedTag;
				if (has(transformTagsMap, name)) {
					transformedTag = transformTagsMap[name](name, attribs);
					frame.attribs = attribs = transformedTag.attribs;
					if (transformedTag.text !== void 0) frame.innerText = transformedTag.text;
					if (name !== transformedTag.tagName) {
						frame.name = name = transformedTag.tagName;
						transformMap[depth] = transformedTag.tagName;
					}
				}
				if (transformTagsAll) {
					transformedTag = transformTagsAll(name, attribs);
					frame.attribs = attribs = transformedTag.attribs;
					if (name !== transformedTag.tagName) {
						frame.name = name = transformedTag.tagName;
						transformMap[depth] = transformedTag.tagName;
					}
				}
				if (!tagAllowed(name) || options.disallowedTagsMode === "recursiveEscape" && !isEmptyObject(skipMap) || options.nestingLimit != null && depth >= options.nestingLimit) {
					skip = true;
					skipMap[depth] = true;
					if (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") {
						if (nonTextTagsArray.indexOf(name) !== -1) {
							skipText = true;
							skipTextDepth = 1;
						}
					}
				}
				depth++;
				if (skip) {
					if (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") {
						if (frame.innerText && !hasText) {
							const escaped = escapeHtml(frame.innerText);
							if (options.textFilter) result += options.textFilter(escaped, name);
							else result += escaped;
							addedText = true;
						}
						return;
					}
					tempResult = result;
					result = "";
				}
				result += "<" + name;
				if (name === "script") {
					if (options.allowedScriptHostnames || options.allowedScriptDomains) frame.innerText = "";
				}
				if (skip && (options.disallowedTagsMode === "escape" || options.disallowedTagsMode === "recursiveEscape") && options.preserveEscapedAttributes) each(attribs, function(value, a) {
					result += " " + a + "=\"" + escapeHtml(value || "", true) + "\"";
				});
				else if (!allowedAttributesMap || has(allowedAttributesMap, name) || allowedAttributesMap["*"]) each(attribs, function(value, a) {
					if (!VALID_HTML_ATTRIBUTE_NAME.test(a)) {
						delete frame.attribs[a];
						return;
					}
					if (value === "" && !options.allowedEmptyAttributes.includes(a) && (options.nonBooleanAttributes.includes(a) || options.nonBooleanAttributes.includes("*"))) {
						delete frame.attribs[a];
						return;
					}
					let passedAllowedAttributesMapCheck = false;
					if (!allowedAttributesMap || has(allowedAttributesMap, name) && allowedAttributesMap[name].indexOf(a) !== -1 || allowedAttributesMap["*"] && allowedAttributesMap["*"].indexOf(a) !== -1 || has(allowedAttributesGlobMap, name) && allowedAttributesGlobMap[name].test(a) || allowedAttributesGlobMap["*"] && allowedAttributesGlobMap["*"].test(a)) passedAllowedAttributesMapCheck = true;
					else if (allowedAttributesMap && allowedAttributesMap[name]) {
						for (const o of allowedAttributesMap[name]) if (isPlainObject(o) && o.name && o.name === a) {
							passedAllowedAttributesMapCheck = true;
							let newValue = "";
							if (o.multiple === true) {
								const splitStrArray = value.split(" ");
								for (const s of splitStrArray) if (o.values.indexOf(s) !== -1) {
									if (newValue === "") newValue = s;
									else newValue += " " + s;
								}
							} else if (o.values.indexOf(value) >= 0) newValue = value;
							value = newValue;
						}
					}
					if (passedAllowedAttributesMapCheck) {
						if (options.allowedSchemesAppliedToAttributes.indexOf(a) !== -1) {
							if (naughtyHref(name, value)) {
								delete frame.attribs[a];
								return;
							}
						}
						if (name === "script" && a === "src") {
							let allowed = true;
							try {
								const parsed = parseUrl(value);
								if (options.allowedScriptHostnames || options.allowedScriptDomains) {
									const allowedHostname = (options.allowedScriptHostnames || []).find(function(hostname) {
										return hostname === parsed.url.hostname;
									});
									const allowedDomain = (options.allowedScriptDomains || []).find(function(domain) {
										return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
									});
									allowed = allowedHostname || allowedDomain;
								}
							} catch (e) {
								allowed = false;
							}
							if (!allowed) {
								delete frame.attribs[a];
								return;
							}
						}
						if (name === "iframe" && a === "src") {
							let allowed = true;
							try {
								const parsed = parseUrl(value);
								if (parsed.isRelativeUrl) allowed = has(options, "allowIframeRelativeUrls") ? options.allowIframeRelativeUrls : !options.allowedIframeHostnames && !options.allowedIframeDomains;
								else if (options.allowedIframeHostnames || options.allowedIframeDomains) {
									const allowedHostname = (options.allowedIframeHostnames || []).find(function(hostname) {
										return hostname === parsed.url.hostname;
									});
									const allowedDomain = (options.allowedIframeDomains || []).find(function(domain) {
										return parsed.url.hostname === domain || parsed.url.hostname.endsWith(`.${domain}`);
									});
									allowed = allowedHostname || allowedDomain;
								}
							} catch (e) {
								allowed = false;
							}
							if (!allowed) {
								delete frame.attribs[a];
								return;
							}
						}
						if (a === "srcset" || a === "imagesrcset") try {
							let parsed = parseSrcset(value);
							parsed.forEach(function(value) {
								if (naughtyHref(a, value.url)) value.evil = true;
							});
							parsed = filter(parsed, function(v) {
								return !v.evil;
							});
							if (!parsed.length) {
								delete frame.attribs[a];
								return;
							} else {
								value = stringifySrcset(filter(parsed, function(v) {
									return !v.evil;
								}));
								frame.attribs[a] = value;
							}
						} catch (e) {
							delete frame.attribs[a];
							return;
						}
						if (a === "class") {
							const allowedSpecificClasses = allowedClassesMap[name];
							const allowedWildcardClasses = allowedClassesMap["*"];
							const allowedSpecificClassesGlob = allowedClassesGlobMap[name];
							const allowedSpecificClassesRegex = allowedClassesRegexMap[name];
							const allowedWildcardClassesRegex = allowedClassesRegexMap["*"];
							const allowedClassesGlobs = [allowedSpecificClassesGlob, allowedClassesGlobMap["*"]].concat(allowedSpecificClassesRegex, allowedWildcardClassesRegex).filter(function(t) {
								return t;
							});
							if (allowedSpecificClasses && allowedWildcardClasses) value = filterClasses(value, deepmerge(allowedSpecificClasses, allowedWildcardClasses), allowedClassesGlobs);
							else value = filterClasses(value, allowedSpecificClasses || allowedWildcardClasses, allowedClassesGlobs);
							if (!value.length) {
								delete frame.attribs[a];
								return;
							}
						}
						if (a === "style") {
							if (options.parseStyleAttributes) try {
								value = stringifyStyleAttributes(filterCss(postcssParse(name + " {" + value + "}", { map: false }), options.allowedStyles));
								if (value.length === 0) {
									delete frame.attribs[a];
									return;
								}
							} catch (e) {
								if (typeof window !== "undefined") console.warn("Failed to parse \"" + name + " {" + value + "}\", If you're running this in a browser, we recommend to disable style parsing: options.parseStyleAttributes: false, since this only works in a node environment due to a postcss dependency, More info: https://github.com/apostrophecms/sanitize-html/issues/547");
								delete frame.attribs[a];
								return;
							}
							else if (options.allowedStyles) throw new Error("allowedStyles option cannot be used together with parseStyleAttributes: false.");
						}
						result += " " + a;
						if (value && value.length) result += "=\"" + escapeHtml(value, true) + "\"";
						else if (options.allowedEmptyAttributes.includes(a)) result += "=\"\"";
					} else delete frame.attribs[a];
				});
				if (options.selfClosing.indexOf(name) !== -1) result += " />";
				else {
					result += ">";
					if (frame.innerText && !hasText) {
						const escaped = escapeHtml(frame.innerText);
						if (options.textFilter) result += options.textFilter(escaped, name);
						else result += escaped;
						addedText = true;
					}
				}
				if (skip) {
					result = tempResult + escapeHtml(result);
					tempResult = "";
				}
				frame.openingTagLength = result.length - frame.tagPosition;
			},
			ontext: function(text) {
				if (skipText) return;
				const lastFrame = stack[stack.length - 1];
				let tag;
				if (lastFrame) {
					tag = lastFrame.tag;
					text = lastFrame.innerText !== void 0 ? lastFrame.innerText : text;
				}
				if (options.disallowedTagsMode === "completelyDiscard" && !tagAllowed(tag)) text = "";
				else if (tag && tagAllowed(tag) && (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") && (tag === "script" || tag === "style")) result += text;
				else if (tag && tagAllowed(tag) && (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") && (tag === "textarea" || tag === "xmp")) {
					if (tag === "xmp") result += text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
					else result += escapeHtml(text, false);
				} else if (!addedText) {
					const escaped = escapeHtml(text, false);
					if (options.textFilter) result += options.textFilter(escaped, tag);
					else result += escaped;
				}
				if (stack.length) {
					const frame = stack[stack.length - 1];
					frame.text += text;
				}
			},
			onclosetag: function(name, isImplied) {
				if (options.onCloseTag) options.onCloseTag(name, isImplied);
				if (skipText) {
					skipTextDepth--;
					if (!skipTextDepth) skipText = false;
					else return;
				}
				const frame = stack.pop();
				if (!frame) return;
				if (frame.tag !== name) {
					stack.push(frame);
					return;
				}
				skipText = options.enforceHtmlBoundary ? name === "html" : false;
				depth--;
				const skip = skipMap[depth];
				if (skip) {
					delete skipMap[depth];
					if (options.disallowedTagsMode === "discard" || options.disallowedTagsMode === "completelyDiscard") {
						frame.updateParentNodeText();
						return;
					}
					tempResult = result;
					result = "";
				}
				if (transformMap[depth]) {
					name = transformMap[depth];
					delete transformMap[depth];
				}
				if (options.exclusiveFilter) {
					const filterResult = options.exclusiveFilter(frame);
					if (filterResult === "excludeTag") {
						if (skip) {
							result = tempResult;
							tempResult = "";
						}
						result = result.substring(0, frame.tagPosition) + result.substring(frame.tagPosition + frame.openingTagLength);
						return;
					} else if (filterResult) {
						result = result.substring(0, frame.tagPosition);
						return;
					}
				}
				frame.updateParentNodeMediaChildren();
				frame.updateParentNodeText();
				if (options.selfClosing.indexOf(name) !== -1 || isImplied && !tagAllowed(name) && ["escape", "recursiveEscape"].indexOf(options.disallowedTagsMode) >= 0) {
					if (skip) {
						result = tempResult;
						tempResult = "";
					}
					return;
				}
				result += "</" + name + ">";
				if (skip) {
					result = tempResult + escapeHtml(result);
					tempResult = "";
				}
				addedText = false;
			}
		}, options.parser);
		parser.write(html);
		parser.end();
		if (options.disallowedTagsMode === "escape" || options.disallowedTagsMode === "recursiveEscape") {
			const lastParsedIndex = parser.endIndex;
			if (lastParsedIndex != null && lastParsedIndex >= 0 && lastParsedIndex < html.length) {
				const unparsed = html.substring(lastParsedIndex);
				result += escapeHtml(unparsed);
			} else if ((lastParsedIndex == null || lastParsedIndex < 0) && html.length > 0 && result === "") result = escapeHtml(html);
		}
		return result;
		function initializeState() {
			result = "";
			depth = 0;
			stack = [];
			skipMap = {};
			transformMap = {};
			skipText = false;
			skipTextDepth = 0;
		}
		function escapeHtml(s, quote) {
			if (typeof s !== "string") s = s + "";
			if (options.parser.decodeEntities) {
				s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
				if (quote) s = s.replace(/"/g, "&quot;");
			}
			s = s.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			if (quote) s = s.replace(/"/g, "&quot;");
			return s;
		}
		function naughtyHref(name, href) {
			return launderNaughtyHref(href, {
				allowedSchemes: has(options.allowedSchemesByTag, name) ? options.allowedSchemesByTag[name] : options.allowedSchemes || [],
				allowProtocolRelative: options.allowProtocolRelative
			});
		}
		function parseUrl(value) {
			value = value.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, "$1//");
			if (value.startsWith("relative:")) throw new Error("relative: exploit attempt");
			let base = "relative://relative-site";
			for (let i = 0; i < 100; i++) base += `/${i}`;
			const parsed = new URL(value, base);
			return {
				isRelativeUrl: parsed && parsed.hostname === "relative-site" && parsed.protocol === "relative:",
				url: parsed
			};
		}
		/**
		* Filters user input css properties by allowlisted regex attributes.
		* Modifies the abstractSyntaxTree object.
		*
		* @param {object} abstractSyntaxTree  - Object representation of CSS attributes.
		* @property {array[Declaration]} abstractSyntaxTree.nodes[0] -
		* Each object contains prop and value key, i.e { prop: 'color', value: 'red' }.
		* @param {object} allowedStyles       - Keys are properties (i.e color),
		* value is list of permitted regex rules (i.e /green/i).
		* @return {object}                    - The modified tree.
		*/
		function filterCss(abstractSyntaxTree, allowedStyles) {
			if (!allowedStyles) return abstractSyntaxTree;
			const astRules = abstractSyntaxTree.nodes[0];
			let selectedRule;
			if (allowedStyles[astRules.selector] && allowedStyles["*"]) selectedRule = deepmerge(allowedStyles[astRules.selector], allowedStyles["*"]);
			else selectedRule = allowedStyles[astRules.selector] || allowedStyles["*"];
			if (selectedRule) abstractSyntaxTree.nodes[0].nodes = astRules.nodes.reduce(filterDeclarations(selectedRule), []);
			return abstractSyntaxTree;
		}
		/**
		* Extracts the style attributes from an AbstractSyntaxTree and formats those
		* values in the inline style attribute format.
		*
		* @param  {AbstractSyntaxTree} filteredAST
		* @return {string}             - Example:
		* "color:yellow;text-align:center !important;font-family:helvetica;"
		*/
		function stringifyStyleAttributes(filteredAST) {
			return filteredAST.nodes[0].nodes.reduce(function(extractedAttributes, attrObject) {
				extractedAttributes.push(`${attrObject.prop}:${attrObject.value}${attrObject.important ? " !important" : ""}`);
				return extractedAttributes;
			}, []).join(";");
		}
		/**
		* Filters the existing attributes for the given property. Discards any attributes
		* which don't match the allowlist.
		*
		* @param  {object} selectedRule - Example: { color: red, font-family: helvetica }
		* @param  {array} allowedDeclarationsList - List of declarations
		* which pass the allowlist.
		* @param  {object} attributeObject - Object representing the current css property.
		* @property {string} attributeObject.type - Typically 'declaration'.
		* @property {string} attributeObject.prop - The CSS property, i.e 'color'.
		* @property {string} attributeObject.value - The corresponding value to
		* the css property, i.e 'red'.
		* @return {function} - When used in Array.reduce,
		* will return an array of Declaration objects
		*/
		function filterDeclarations(selectedRule) {
			return function(allowedDeclarationsList, attributeObject) {
				if (has(selectedRule, attributeObject.prop)) {
					if (selectedRule[attributeObject.prop].some(function(regularExpression) {
						return regularExpression.test(attributeObject.value);
					})) allowedDeclarationsList.push(attributeObject);
				}
				return allowedDeclarationsList;
			};
		}
		function filterClasses(classes, allowed, allowedGlobs) {
			if (!allowed) return classes;
			classes = classes.split(/\s+/);
			return classes.filter(function(clss) {
				return allowed.indexOf(clss) !== -1 || allowedGlobs.some(function(glob) {
					return glob.test(clss);
				});
			}).join(" ");
		}
	}
	var htmlParserDefaults = { decodeEntities: true };
	sanitizeHtml.defaults = {
		allowedTags: [
			"address",
			"article",
			"aside",
			"footer",
			"header",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"hgroup",
			"main",
			"nav",
			"section",
			"blockquote",
			"dd",
			"div",
			"dl",
			"dt",
			"figcaption",
			"figure",
			"hr",
			"li",
			"menu",
			"ol",
			"p",
			"pre",
			"ul",
			"a",
			"abbr",
			"b",
			"bdi",
			"bdo",
			"br",
			"cite",
			"code",
			"data",
			"dfn",
			"em",
			"i",
			"kbd",
			"mark",
			"q",
			"rb",
			"rp",
			"rt",
			"rtc",
			"ruby",
			"s",
			"samp",
			"small",
			"span",
			"strong",
			"sub",
			"sup",
			"time",
			"u",
			"var",
			"wbr",
			"caption",
			"col",
			"colgroup",
			"table",
			"tbody",
			"td",
			"tfoot",
			"th",
			"thead",
			"tr"
		],
		nonBooleanAttributes: [
			"abbr",
			"accept",
			"accept-charset",
			"accesskey",
			"action",
			"allow",
			"alt",
			"as",
			"autocapitalize",
			"autocomplete",
			"blocking",
			"charset",
			"cite",
			"class",
			"color",
			"cols",
			"colspan",
			"content",
			"contenteditable",
			"coords",
			"crossorigin",
			"data",
			"datetime",
			"decoding",
			"dir",
			"dirname",
			"download",
			"draggable",
			"enctype",
			"enterkeyhint",
			"fetchpriority",
			"for",
			"form",
			"formaction",
			"formenctype",
			"formmethod",
			"formtarget",
			"headers",
			"height",
			"hidden",
			"high",
			"href",
			"hreflang",
			"http-equiv",
			"id",
			"imagesizes",
			"imagesrcset",
			"inputmode",
			"integrity",
			"is",
			"itemid",
			"itemprop",
			"itemref",
			"itemtype",
			"kind",
			"label",
			"lang",
			"list",
			"loading",
			"low",
			"max",
			"maxlength",
			"media",
			"method",
			"min",
			"minlength",
			"name",
			"nonce",
			"optimum",
			"pattern",
			"ping",
			"placeholder",
			"popover",
			"popovertarget",
			"popovertargetaction",
			"poster",
			"preload",
			"referrerpolicy",
			"rel",
			"rows",
			"rowspan",
			"sandbox",
			"scope",
			"shape",
			"size",
			"sizes",
			"slot",
			"span",
			"spellcheck",
			"src",
			"srcdoc",
			"srclang",
			"srcset",
			"start",
			"step",
			"style",
			"tabindex",
			"target",
			"title",
			"translate",
			"type",
			"usemap",
			"value",
			"width",
			"wrap",
			"onauxclick",
			"onafterprint",
			"onbeforematch",
			"onbeforeprint",
			"onbeforeunload",
			"onbeforetoggle",
			"onblur",
			"oncancel",
			"oncanplay",
			"oncanplaythrough",
			"onchange",
			"onclick",
			"onclose",
			"oncontextlost",
			"oncontextmenu",
			"oncontextrestored",
			"oncopy",
			"oncuechange",
			"oncut",
			"ondblclick",
			"ondrag",
			"ondragend",
			"ondragenter",
			"ondragleave",
			"ondragover",
			"ondragstart",
			"ondrop",
			"ondurationchange",
			"onemptied",
			"onended",
			"onerror",
			"onfocus",
			"onformdata",
			"onhashchange",
			"oninput",
			"oninvalid",
			"onkeydown",
			"onkeypress",
			"onkeyup",
			"onlanguagechange",
			"onload",
			"onloadeddata",
			"onloadedmetadata",
			"onloadstart",
			"onmessage",
			"onmessageerror",
			"onmousedown",
			"onmouseenter",
			"onmouseleave",
			"onmousemove",
			"onmouseout",
			"onmouseover",
			"onmouseup",
			"onoffline",
			"ononline",
			"onpagehide",
			"onpageshow",
			"onpaste",
			"onpause",
			"onplay",
			"onplaying",
			"onpopstate",
			"onprogress",
			"onratechange",
			"onreset",
			"onresize",
			"onrejectionhandled",
			"onscroll",
			"onscrollend",
			"onsecuritypolicyviolation",
			"onseeked",
			"onseeking",
			"onselect",
			"onslotchange",
			"onstalled",
			"onstorage",
			"onsubmit",
			"onsuspend",
			"ontimeupdate",
			"ontoggle",
			"onunhandledrejection",
			"onunload",
			"onvolumechange",
			"onwaiting",
			"onwheel"
		],
		disallowedTagsMode: "discard",
		allowedAttributes: {
			a: [
				"href",
				"name",
				"target"
			],
			img: [
				"src",
				"srcset",
				"alt",
				"title",
				"width",
				"height",
				"loading"
			]
		},
		allowedEmptyAttributes: ["alt"],
		selfClosing: [
			"img",
			"br",
			"hr",
			"area",
			"base",
			"basefont",
			"input",
			"link",
			"meta",
			"col"
		],
		allowedSchemes: [
			"http",
			"https",
			"ftp",
			"mailto",
			"tel"
		],
		allowedSchemesByTag: {},
		allowedSchemesAppliedToAttributes: [
			"href",
			"src",
			"cite",
			"action",
			"formaction",
			"data",
			"xlink:href",
			"poster",
			"background",
			"ping",
			"longdesc",
			"usemap",
			"codebase",
			"classid",
			"archive",
			"profile",
			"manifest",
			"itemid",
			"dynsrc",
			"lowsrc"
		],
		allowProtocolRelative: true,
		enforceHtmlBoundary: false,
		parseStyleAttributes: true,
		preserveEscapedAttributes: false
	};
	sanitizeHtml.simpleTransform = function(newTagName, newAttribs, merge) {
		merge = merge === void 0 ? true : merge;
		newAttribs = newAttribs || {};
		return function(tagName, attribs) {
			let attrib;
			if (merge) for (attrib in newAttribs) attribs[attrib] = newAttribs[attrib];
			else attribs = newAttribs;
			return {
				tagName: newTagName,
				attribs
			};
		};
	};
})))(), 1);
/**
* Sanitize HTML content to prevent XSS attacks.
*
* Allows standard formatting tags, images, iframes (from specific providers),
* and basic attributes.
*/
function sanitizeContent(html) {
	return (0, import_sanitize_html.default)(html, {
		allowedTags: [
			...import_sanitize_html.default.defaults.allowedTags,
			"img",
			"span",
			"iframe"
		],
		allowedAttributes: {
			...import_sanitize_html.default.defaults.allowedAttributes,
			"*": [
				"class",
				"id",
				"data-*"
			],
			iframe: [
				"src",
				"width",
				"height",
				"frameborder",
				"allow",
				"allowfullscreen"
			],
			img: [
				"src",
				"srcset",
				"alt",
				"title",
				"width",
				"height",
				"loading"
			]
		},
		allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"]
	});
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Embed.astro
createAstro("https://astro.build");
var $$Embed = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Embed;
	const { node } = Astro.props;
	if (!node?.url) return null;
	const { url: rawUrl, provider, html, caption } = node;
	const url = sanitizeHref(rawUrl);
	const YOUTUBE_ID_PATTERN = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const VIMEO_ID_PATTERN = /vimeo\.com\/(\d+)/;
	function getYouTubeId(input) {
		return input.match(YOUTUBE_ID_PATTERN)?.[1] || null;
	}
	function getVimeoId(input) {
		return input.match(VIMEO_ID_PATTERN)?.[1] || null;
	}
	const youtubeId = getYouTubeId(url);
	const vimeoId = getVimeoId(url);
	const isSelfHostedVideo = provider === "video";
	const isSelfHostedAudio = provider === "audio";
	return renderTemplate`${maybeRenderHead($$result)}<figure class="emdash-embed" data-astro-cid-ges5as5y>${isSelfHostedVideo ? renderTemplate`<div class="emdash-embed-video" data-astro-cid-ges5as5y><video controls preload="metadata" data-astro-cid-ges5as5y><source${addAttribute(url, "src")} data-astro-cid-ges5as5y>Your browser does not support the video element.</video></div>` : isSelfHostedAudio ? renderTemplate`<div class="emdash-embed-audio" data-astro-cid-ges5as5y><audio controls preload="metadata" data-astro-cid-ges5as5y><source${addAttribute(url, "src")} data-astro-cid-ges5as5y>Your browser does not support the audio element.</audio></div>` : youtubeId ? renderTemplate`<div class="emdash-embed-video" data-astro-cid-ges5as5y><iframe${addAttribute(`https://www.youtube.com/embed/${youtubeId}`, "src")} title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-astro-cid-ges5as5y></iframe></div>` : vimeoId ? renderTemplate`<div class="emdash-embed-video" data-astro-cid-ges5as5y><iframe${addAttribute(`https://player.vimeo.com/video/${vimeoId}`, "src")} title="Vimeo video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen data-astro-cid-ges5as5y></iframe></div>` : html ? renderTemplate`<div class="emdash-embed-html" data-astro-cid-ges5as5y>${unescapeHTML(sanitizeContent(html))}</div>` : renderTemplate`<a${addAttribute(url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-ges5as5y>${url}</a>`}${caption && renderTemplate`<figcaption data-astro-cid-ges5as5y>${caption}</figcaption>`}</figure>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Embed.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Gallery.astro
createAstro("https://astro.build");
var $$Gallery = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Gallery;
	function generateSrcset(getSrc, maxWidth, aspectRatio) {
		return RESPONSIVE_BREAKPOINTS.filter((w) => w <= maxWidth * 2).map((w) => {
			return `${getSrc({
				width: w,
				height: aspectRatio ? Math.round(w / aspectRatio) : void 0
			})} ${w}w`;
		}).join(", ");
	}
	const { node, placeholder = true } = Astro.props;
	const images = node?.images ?? [];
	const columns = node?.columns ?? 3;
	if (!images.length) return null;
	const resolvedImages = await Promise.all(images.map(async (image) => {
		const { asset, alt = "", width, height } = image;
		const aspectRatio = width && height ? width / height : void 0;
		let src = "";
		let srcset;
		let sizes;
		let astroImageSrc = "";
		const providerId = asset.provider;
		if (providerId && providerId !== "local") {
			const provider = await getMediaProvider(providerId);
			if (provider) try {
				const mediaValue = {
					provider: providerId,
					id: asset._ref,
					width,
					height,
					alt
				};
				const result = provider.getEmbed(mediaValue, {
					width,
					height
				});
				const embed = result instanceof Promise ? await result : result;
				if (embed.type === "image") {
					src = embed.src;
					if (embed.getSrc) {
						const maxWidth = width || 1200;
						srcset = generateSrcset(embed.getSrc, maxWidth, aspectRatio);
						sizes = width ? `(min-width: ${width}px) ${width}px, 100vw` : "100vw";
					}
				}
			} catch (error) {
				console.warn(`Failed to get embed for image ${asset._ref}:`, error);
			}
		}
		if (!src) {
			src = buildRenderMediaUrl(Astro.locals.emdash?.getPublicMediaUrl, {
				url: asset.url,
				id: asset._ref
			});
			if (width && height) astroImageSrc = toAbsoluteMediaUrl(src, getPublicOrigin(Astro.url, Astro.locals.emdash?.config));
		}
		let placeholderStyle = "";
		if (placeholder && image.blurhash) {
			const { blurhashToImageCssString } = await import("./dist_B6rHSkJ4.mjs");
			placeholderStyle = blurhashToImageCssString(image.blurhash);
		} else if (placeholder && image.dominantColor) placeholderStyle = `background-color: ${image.dominantColor};`;
		return {
			key: image._key,
			alt,
			caption: image.caption,
			width,
			height,
			src,
			srcset,
			sizes,
			astroImageSrc,
			placeholderStyle
		};
	}));
	return renderTemplate`${maybeRenderHead($$result)}<div class="emdash-gallery"${addAttribute(`--columns: ${columns}`, "style")} data-astro-cid-fre5hcg3>${resolvedImages.map((image) => renderTemplate`<figure class="emdash-gallery-item"${addAttribute(image.placeholderStyle || void 0, "style")} data-astro-cid-fre5hcg3>${image.astroImageSrc ? renderTemplate`${renderComponent($$result, "AstroImage", $$Image$1, {
		"src": image.astroImageSrc,
		"alt": image.alt,
		"width": image.width,
		"height": image.height,
		"layout": "constrained",
		"data-astro-cid-fre5hcg3": true
	})}` : renderTemplate`<img${addAttribute(image.src, "src")}${addAttribute(image.srcset, "srcset")}${addAttribute(image.sizes, "sizes")}${addAttribute(image.alt, "alt")}${addAttribute(image.width, "width")}${addAttribute(image.height, "height")} loading="lazy" decoding="async" data-astro-cid-fre5hcg3>`}${image.caption && renderTemplate`<figcaption data-astro-cid-fre5hcg3>${image.caption}</figcaption>`}</figure>`)}</div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Gallery.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Columns.astro
createAstro("https://astro.build");
var $$Columns = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Columns;
	const { node } = Astro.props;
	const columns = node?.columns ?? [];
	if (!columns.length) return null;
	return renderTemplate`${maybeRenderHead($$result)}<div class="emdash-columns"${addAttribute(`--column-count: ${columns.length}`, "style")} data-astro-cid-htogav4a>${columns.map((column) => renderTemplate`<div class="emdash-column"${addAttribute(column.width ? `flex-basis: ${column.width}` : void 0, "style")} data-astro-cid-htogav4a>${renderComponent($$result, "PortableText", $$PortableText$1, {
		"value": column.content,
		"data-astro-cid-htogav4a": true
	})}</div>`)}</div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Columns.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Break.astro
createAstro("https://astro.build");
var $$Break = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Break;
	const { node } = Astro.props;
	const style = node?.style || "line";
	return renderTemplate`${style === "dots" ? renderTemplate`${maybeRenderHead($$result)}<div class="emdash-break emdash-break-dots" data-astro-cid-unvhvql7>• • •</div>` : style === "space" ? renderTemplate`<div class="emdash-break emdash-break-space" data-astro-cid-unvhvql7></div>` : renderTemplate`<hr class="emdash-break emdash-break-line" data-astro-cid-unvhvql7>`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Break.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/HtmlBlock.astro
createAstro("https://astro.build");
var $$HtmlBlock = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$HtmlBlock;
	const { node } = Astro.props;
	if (!node?.html) return null;
	const sanitized = sanitizeContent(node.html);
	return renderTemplate`${maybeRenderHead($$result)}<div class="emdash-html-block" data-astro-cid-tuotpaqq>${unescapeHTML(sanitized)}</div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/HtmlBlock.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/marks/Link.astro
createAstro("https://astro.build");
var $$Link = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Link;
	const { node } = Astro.props;
	const href = sanitizeHref(node?.markDef?.href);
	const blank = !href.startsWith("#") && node?.markDef?.blank;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(blank ? "_blank" : void 0, "target")}${addAttribute(blank ? "noopener noreferrer" : void 0, "rel")}>${renderSlot($$result, $$slots["default"])}</a>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/marks/Link.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/marks/StrikeThrough.astro
var $$StrikeThrough = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<s>${renderSlot($$result, $$slots["default"])}</s>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/marks/StrikeThrough.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/marks/Subscript.astro
var $$Subscript = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<sub>${renderSlot($$result, $$slots["default"])}</sub>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/marks/Subscript.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/marks.ts
/**
* Shared mark component map for Portable Text rendering.
*
* Used by both the top-level `emdashComponents` config and individual block
* components (e.g. Table) that render nested inline content through the PT
* pipeline.
*/
var emdashMarkComponents = {
	superscript: createComponent(($$result, $$props, $$slots) => {
		return renderTemplate`${maybeRenderHead($$result)}<sup>${renderSlot($$result, $$slots["default"])}</sup>`;
	}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/marks/Superscript.astro", void 0),
	subscript: $$Subscript,
	underline: createComponent(($$result, $$props, $$slots) => {
		return renderTemplate`${maybeRenderHead($$result)}<u>${renderSlot($$result, $$slots["default"])}</u>`;
	}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/marks/Underline.astro", void 0),
	"strike-through": $$StrikeThrough,
	link: $$Link
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Table.astro
createAstro("https://astro.build");
var $$Table = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Table;
	const markComponents = { mark: emdashMarkComponents };
	const { node } = Astro.props;
	const rows = node?.rows ?? [];
	if (!rows.length) return null;
	function cellToBlock(cell) {
		return [{
			_type: "block",
			_key: cell._key,
			children: cell.content,
			markDefs: cell.markDefs ?? []
		}];
	}
	const hasHeader = node?.hasHeaderRow;
	const headerRow = hasHeader ? rows[0] : null;
	const bodyRows = hasHeader ? rows.slice(1) : rows;
	return renderTemplate`${maybeRenderHead($$result)}<div class="emdash-table-wrapper" data-astro-cid-fbnptxex><table class="emdash-table" data-astro-cid-fbnptxex>${headerRow && renderTemplate`<thead data-astro-cid-fbnptxex><tr data-astro-cid-fbnptxex>${headerRow.cells.map((cell) => renderTemplate`<th data-astro-cid-fbnptxex>${renderComponent($$result, "PortableText", $$PortableText$1, {
		"value": cellToBlock(cell),
		"components": markComponents,
		"data-astro-cid-fbnptxex": true
	})}</th>`)}</tr></thead>`}<tbody data-astro-cid-fbnptxex>${bodyRows.map((row) => renderTemplate`<tr data-astro-cid-fbnptxex>${row.cells.map((cell) => {
		const CellTag = cell.isHeader ? "th" : "td";
		return renderTemplate`${renderComponent($$result, "CellTag", CellTag, { "data-astro-cid-fbnptxex": true }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PortableText", $$PortableText$1, {
			"value": cellToBlock(cell),
			"components": markComponents,
			"data-astro-cid-fbnptxex": true
		})}` })}`;
	})}</tr>`)}</tbody></table></div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Table.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Button.astro
createAstro("https://astro.build");
var $$Button = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Button;
	const { node } = Astro.props;
	const { text, url: rawUrl, style = "default" } = node ?? {};
	const url = rawUrl ? sanitizeHref(rawUrl) : void 0;
	return renderTemplate`${url ? renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(url, "href")}${addAttribute(["emdash-button", `emdash-button--${style}`], "class:list")} data-astro-cid-mwg6rgny>${text}</a>` : renderTemplate`<span${addAttribute(["emdash-button", `emdash-button--${style}`], "class:list")} data-astro-cid-mwg6rgny>${text}</span>`}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Button.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Buttons.astro
createAstro("https://astro.build");
var $$Buttons = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Buttons;
	const { node } = Astro.props;
	const { buttons = [], layout = "horizontal" } = node ?? {};
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["emdash-buttons", `emdash-buttons--${layout}`], "class:list")} data-astro-cid-q3ptbosr>${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, {
		"node": button,
		"data-astro-cid-q3ptbosr": true
	})}`)}</div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Buttons.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Cover.astro
createAstro("https://astro.build");
var $$Cover = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Cover;
	const { node } = Astro.props;
	const { backgroundImage, backgroundVideo, overlayColor, overlayOpacity = .5, content = [], minHeight = "300px", alignment = "center" } = node ?? {};
	const hasBackground = backgroundImage || backgroundVideo;
	const overlayStyle = overlayColor ? `background-color: ${overlayColor}; opacity: ${overlayOpacity};` : `background-color: rgba(0, 0, 0, ${overlayOpacity});`;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["emdash-cover", `emdash-cover--align-${alignment}`], "class:list")}${addAttribute(`min-height: ${minHeight};`, "style")} data-astro-cid-willfy33>${backgroundImage && !backgroundVideo && renderTemplate`<img${addAttribute(backgroundImage, "src")} alt="" class="emdash-cover__background" loading="lazy" data-astro-cid-willfy33>`}${backgroundVideo && renderTemplate`<video class="emdash-cover__background emdash-cover__video" autoplay muted loop playsinline data-astro-cid-willfy33><source${addAttribute(backgroundVideo, "src")} data-astro-cid-willfy33></video>`}${hasBackground && renderTemplate`<div class="emdash-cover__overlay"${addAttribute(overlayStyle, "style")} data-astro-cid-willfy33></div>`}<div class="emdash-cover__content" data-astro-cid-willfy33>${renderComponent($$result, "PortableText", $$PortableText$1, {
		"value": content,
		"data-astro-cid-willfy33": true
	})}</div></div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Cover.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/File.astro
createAstro("https://astro.build");
var $$File = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$File;
	const { node } = Astro.props;
	const { url: rawUrl, filename, showDownloadButton = true } = node ?? {};
	const url = sanitizeHref(rawUrl);
	const displayName = filename || url?.split("/").pop()?.split("?")[0] || "Download";
	return renderTemplate`${maybeRenderHead($$result)}<div class="emdash-file" data-astro-cid-5ru7xuns><a${addAttribute(url, "href")} class="emdash-file__link"${addAttribute(filename, "download")} data-astro-cid-5ru7xuns><svg class="emdash-file__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5ru7xuns><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-5ru7xuns></path><polyline points="14 2 14 8 20 8" data-astro-cid-5ru7xuns></polyline></svg><span class="emdash-file__name" data-astro-cid-5ru7xuns>${displayName}</span></a>${showDownloadButton && renderTemplate`<a${addAttribute(url, "href")} class="emdash-file__download"${addAttribute(filename, "download")} aria-label="Download file" data-astro-cid-5ru7xuns><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5ru7xuns><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-5ru7xuns></path><polyline points="7 10 12 15 17 10" data-astro-cid-5ru7xuns></polyline><line x1="12" y1="15" x2="12" y2="3" data-astro-cid-5ru7xuns></line></svg></a>`}</div>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/File.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/Pullquote.astro
createAstro("https://astro.build");
var $$Pullquote = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Pullquote;
	const { node } = Astro.props;
	const { text, citation } = node ?? {};
	return renderTemplate`${maybeRenderHead($$result)}<figure class="emdash-pullquote" data-astro-cid-xhgn2iar><blockquote class="emdash-pullquote__text" data-astro-cid-xhgn2iar>${text}</blockquote>${citation && renderTemplate`<figcaption class="emdash-pullquote__citation" data-astro-cid-xhgn2iar>&mdash; ${citation}</figcaption>`}</figure>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/Pullquote.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/BlockquoteGroup.astro
createAstro("https://astro.build");
var $$BlockquoteGroup = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BlockquoteGroup;
	const { node } = Astro.props;
	const paragraphs = (node?.blocks ?? []).map((block) => ({
		...block,
		style: "normal"
	}));
	return renderTemplate`${maybeRenderHead($$result)}<blockquote>${renderComponent($$result, "PortableText", $$PortableText$1, {
		"value": paragraphs,
		"components": {
			block: $$Block,
			mark: emdashMarkComponents
		}
	})}</blockquote>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/BlockquoteGroup.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/page/metadata.ts
var SAFE_HREF_RE = /^(https?|at):\/\//i;
var HTML_ESCAPE_MAP = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
var HTML_ESCAPE_RE = /[&<>"']/g;
function escapeHtmlAttr(value) {
	return value.replace(HTML_ESCAPE_RE, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}
function isSafeHref(url) {
	return SAFE_HREF_RE.test(url);
}
var JSONLD_LT_RE = /</g;
var JSONLD_GT_RE = />/g;
var JSONLD_U2028_RE = /\u2028/g;
var JSONLD_U2029_RE = /\u2029/g;
function safeJsonLdSerialize(value) {
	return JSON.stringify(value).replace(JSONLD_LT_RE, "\\u003c").replace(JSONLD_GT_RE, "\\u003e").replace(JSONLD_U2028_RE, "\\u2028").replace(JSONLD_U2029_RE, "\\u2029");
}
async function createSha256CspHash(value) {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
	const bytes = new Uint8Array(digest);
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return `sha256-${btoa(binary)}`;
}
async function registerJsonLdCspHashes(enabled, getCsp, scripts) {
	if (!enabled || scripts.length === 0) return;
	const csp = getCsp();
	if (!csp) return;
	await Promise.all(scripts.map(async ({ json }) => {
		csp.insertScriptHash(await createSha256CspHash(json));
	}));
}
function resolvePageMetadata(contributions) {
	const result = {
		meta: [],
		properties: [],
		links: [],
		jsonld: []
	};
	const seenMeta = /* @__PURE__ */ new Set();
	const seenProperties = /* @__PURE__ */ new Set();
	const seenLinks = /* @__PURE__ */ new Set();
	const seenJsonLd = /* @__PURE__ */ new Set();
	for (const c of contributions) switch (c.kind) {
		case "meta": {
			const dedupeKey = c.key ?? c.name;
			if (seenMeta.has(dedupeKey)) continue;
			seenMeta.add(dedupeKey);
			result.meta.push({
				name: c.name,
				content: c.content
			});
			break;
		}
		case "property": {
			const dedupeKey = c.key ?? c.property;
			if (seenProperties.has(dedupeKey)) continue;
			seenProperties.add(dedupeKey);
			result.properties.push({
				property: c.property,
				content: c.content
			});
			break;
		}
		case "link":
			if (!isSafeHref(c.href)) {
				if (Object.assign({
					"ASSETS_PREFIX": void 0,
					"BASE_URL": "/",
					"DEV": false,
					"MODE": "production",
					"PROD": true,
					"SITE": void 0,
					"SSR": true
				}, {})?.DEV) console.warn(`[page:metadata] Rejected link contribution with unsafe href scheme: ${c.href}`);
				continue;
			}
			if (c.rel === "canonical") {
				if (seenLinks.has("canonical")) continue;
				seenLinks.add("canonical");
			} else {
				const dedupeKey = c.key ?? c.hreflang ?? c.href;
				if (seenLinks.has(dedupeKey)) continue;
				seenLinks.add(dedupeKey);
			}
			result.links.push({
				rel: c.rel,
				href: c.href,
				...c.hreflang && { hreflang: c.hreflang }
			});
			break;
		case "jsonld":
			if (c.id) {
				if (seenJsonLd.has(c.id)) continue;
				seenJsonLd.add(c.id);
			}
			result.jsonld.push({
				id: c.id,
				json: safeJsonLdSerialize(c.graph)
			});
	}
	return result;
}
function renderPageMetadata(metadata, options = {}) {
	const parts = [];
	const includeJsonLd = options.includeJsonLd ?? true;
	for (const m of metadata.meta) parts.push(`<meta name="${escapeHtmlAttr(m.name)}" content="${escapeHtmlAttr(m.content)}">`);
	for (const p of metadata.properties) parts.push(`<meta property="${escapeHtmlAttr(p.property)}" content="${escapeHtmlAttr(p.content)}">`);
	for (const l of metadata.links) {
		let tag = `<link rel="${escapeHtmlAttr(l.rel)}" href="${escapeHtmlAttr(l.href)}"`;
		if (l.hreflang) tag += ` hreflang="${escapeHtmlAttr(l.hreflang)}"`;
		tag += ">";
		parts.push(tag);
	}
	if (includeJsonLd) for (const j of metadata.jsonld) parts.push(`<script type="application/ld+json">${j.json}<\/script>`);
	return parts.join("\n");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/page/fragments.ts
/** Escape sequences that would break out of a script tag */
var SCRIPT_CLOSE_RE = /<\//g;
/**
* Filter contributions to a specific placement and deduplicate.
* - Contributions with the same `key + placement` are deduped (first wins).
* - External scripts with the same `src + placement` are deduped.
*/
function resolveFragments(contributions, placement) {
	const filtered = contributions.filter((c) => c.placement === placement);
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const c of filtered) {
		if (c.key) {
			const dedupeKey = `key:${c.key}`;
			if (seen.has(dedupeKey)) continue;
			seen.add(dedupeKey);
		} else if (c.kind === "external-script") {
			const dedupeKey = `src:${c.src}`;
			if (seen.has(dedupeKey)) continue;
			seen.add(dedupeKey);
		}
		result.push(c);
	}
	return result;
}
var EVENT_HANDLER_RE = /^on/i;
function renderAttributes(attrs) {
	return Object.entries(attrs).filter(([k]) => !EVENT_HANDLER_RE.test(k)).map(([k, v]) => ` ${escapeHtmlAttr(k)}="${escapeHtmlAttr(v)}"`).join("");
}
/** Render a single fragment contribution to HTML */
function renderFragment(c) {
	switch (c.kind) {
		case "external-script": {
			let tag = `<script src="${escapeHtmlAttr(c.src)}"`;
			if (c.async) tag += " async";
			if (c.defer) tag += " defer";
			if (c.attributes) tag += renderAttributes(c.attributes);
			tag += "><\/script>";
			return tag;
		}
		case "inline-script": {
			let tag = "<script";
			if (c.attributes) tag += renderAttributes(c.attributes);
			tag += `>${c.code.replace(SCRIPT_CLOSE_RE, "<\\/")}<\/script>`;
			return tag;
		}
		case "html": return c.html;
	}
}
/** Render a list of fragment contributions to an HTML string */
function renderFragments(contributions, placement) {
	return resolveFragments(contributions, placement).map(renderFragment).join("\n");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/JsonLdScript.astro
createAstro("https://astro.build");
var $$JsonLdScript = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$JsonLdScript;
	const { json } = Astro.props;
	return renderTemplate`<script type="application/ld+json">${unescapeHTML(json)}<\/script>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/JsonLdScript.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/page/jsonld.ts
/**
* Remove null/undefined values from a JSON-LD object recursively.
* JSON-LD validators prefer absent keys over null values.
*/
function cleanJsonLd(obj) {
	const cleaned = {};
	for (const [key, value] of Object.entries(obj)) if (value !== void 0 && value !== null) {
		if (typeof value === "object" && !Array.isArray(value)) cleaned[key] = cleanJsonLd(value);
		else cleaned[key] = value;
	}
	return cleaned;
}
/**
* Build a BlogPosting JSON-LD graph from page context.
* Used for article-type content pages.
*
* @param page - Page context for the current request.
* @param defaultOgImage - Optional site-wide fallback image URL, used when
*   the page has no own OG image. Matches the fallback applied to `og:image`
*   in `generateBaseSeoContributions`.
*/
function buildBlogPostingJsonLd(page, defaultOgImage) {
	if (page.pageType !== "article" || !page.canonical) return null;
	const ogTitle = page.seo?.ogTitle ?? page.pageTitle ?? page.title;
	const description = page.seo?.ogDescription || page.description;
	const ogImage = page.seo?.ogImage || page.image || defaultOgImage || null;
	const publishedTime = page.articleMeta?.publishedTime;
	const modifiedTime = page.articleMeta?.modifiedTime;
	const author = page.articleMeta?.author;
	const siteName = page.siteName;
	return cleanJsonLd({
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: ogTitle,
		description,
		image: ogImage || void 0,
		url: page.canonical,
		datePublished: publishedTime || void 0,
		dateModified: modifiedTime || publishedTime || void 0,
		author: author ? {
			"@type": "Person",
			name: author
		} : void 0,
		publisher: siteName ? {
			"@type": "Organization",
			name: siteName
		} : void 0,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": page.canonical
		}
	});
}
/**
* Build a WebSite JSON-LD graph from page context.
* Used for non-article pages (homepage, listing pages, etc.)
*/
function buildWebSiteJsonLd(page) {
	const siteName = page.siteName;
	if (!siteName) return null;
	let siteUrl;
	if (page.siteUrl) siteUrl = page.siteUrl;
	else try {
		siteUrl = new URL(page.url).origin;
	} catch {
		siteUrl = page.canonical || page.url;
	}
	return cleanJsonLd({
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteName,
		url: siteUrl
	});
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/page/seo-contributions.ts
/**
* Generate base metadata contributions from a page context's SEO data.
*
* @param page - Page context produced by the runtime for the current request.
* @param defaultOgImage - Optional site-wide fallback OG image URL, used when
*   the page has no own OG image (i.e., neither `seo.ogImage` nor `image`).
*   Sourced from `SiteSettings.seo.defaultOgImage` by `EmDashHead`.
*
* Returns an empty array if no SEO-relevant data is present.
*/
function generateBaseSeoContributions(page, defaultOgImage) {
	const contributions = [];
	const description = page.description;
	const ogTitle = page.seo?.ogTitle ?? page.pageTitle ?? page.title;
	const ogDescription = page.seo?.ogDescription || description;
	const ogImage = page.seo?.ogImage || page.image || defaultOgImage || null;
	const robots = page.seo?.robots;
	const canonical = page.canonical;
	const siteName = page.siteName;
	if (description) contributions.push({
		kind: "meta",
		name: "description",
		content: description
	});
	if (robots) contributions.push({
		kind: "meta",
		name: "robots",
		content: robots
	});
	if (canonical) contributions.push({
		kind: "link",
		rel: "canonical",
		href: canonical
	});
	contributions.push({
		kind: "property",
		property: "og:type",
		content: page.pageType === "article" ? "article" : "website"
	});
	if (ogTitle) contributions.push({
		kind: "property",
		property: "og:title",
		content: ogTitle
	});
	if (ogDescription) contributions.push({
		kind: "property",
		property: "og:description",
		content: ogDescription
	});
	if (ogImage) contributions.push({
		kind: "property",
		property: "og:image",
		content: ogImage
	});
	if (canonical) contributions.push({
		kind: "property",
		property: "og:url",
		content: canonical
	});
	if (siteName) contributions.push({
		kind: "property",
		property: "og:site_name",
		content: siteName
	});
	contributions.push({
		kind: "meta",
		name: "twitter:card",
		content: ogImage ? "summary_large_image" : "summary"
	});
	if (ogTitle) contributions.push({
		kind: "meta",
		name: "twitter:title",
		content: ogTitle
	});
	if (ogDescription) contributions.push({
		kind: "meta",
		name: "twitter:description",
		content: ogDescription
	});
	if (ogImage) contributions.push({
		kind: "meta",
		name: "twitter:image",
		content: ogImage
	});
	if (page.pageType === "article" && page.articleMeta) {
		const { publishedTime, modifiedTime, author } = page.articleMeta;
		if (publishedTime) contributions.push({
			kind: "property",
			property: "article:published_time",
			content: publishedTime
		});
		if (modifiedTime) contributions.push({
			kind: "property",
			property: "article:modified_time",
			content: modifiedTime
		});
		if (author) contributions.push({
			kind: "property",
			property: "article:author",
			content: author
		});
	}
	if (page.pageType === "article") {
		const blogPosting = buildBlogPostingJsonLd(page, defaultOgImage ?? null);
		if (blogPosting) contributions.push({
			kind: "jsonld",
			id: "primary",
			graph: blogPosting
		});
	} else if (siteName) {
		const webSite = buildWebSiteJsonLd(page);
		if (webSite) contributions.push({
			kind: "jsonld",
			id: "primary",
			graph: webSite
		});
	}
	return contributions;
}
/**
* Generate site-level SEO metadata contributions from SiteSettings.seo.
*
* These tags apply to every page (search engine ownership verification),
* so they're sourced from site settings rather than per-page context.
* Returns an empty array when no relevant settings are configured.
*/
function generateSiteSeoContributions(seoSettings) {
	const contributions = [];
	if (!seoSettings) return contributions;
	if (seoSettings.googleVerification) contributions.push({
		kind: "meta",
		name: "google-site-verification",
		content: seoSettings.googleVerification
	});
	if (seoSettings.bingVerification) contributions.push({
		kind: "meta",
		name: "msvalidate.01",
		content: seoSettings.bingVerification
	});
	return contributions;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/page/site-identity.ts
/**
* Build the `<head>` HTML for site identity tags. Returns an empty string
* when no identity fields are configured.
*/
function renderSiteIdentity(input) {
	if (!input) return "";
	const parts = [];
	const favicon = input.favicon;
	if (favicon?.url) {
		let tag = `<link rel="icon" href="${escapeHtmlAttr(favicon.url)}"`;
		if (favicon.contentType) tag += ` type="${escapeHtmlAttr(favicon.contentType)}"`;
		tag += ">";
		parts.push(tag);
	}
	return parts.join("\n");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/page/index.ts
/**
* Get the page runtime from Astro locals. Returns undefined when
* EmDash is not initialized (components render nothing in that case).
*/
function getPageRuntime(locals) {
	const emdash = locals.emdash;
	if (emdash && typeof emdash === "object" && "collectPageMetadata" in emdash && "collectPageFragments" in emdash) return emdash;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/page/absolute-url.ts
var HTTP_URL_RE = /^https?:\/\//i;
/**
* Protocol-relative URLs (`//cdn.example.com/x.png`) are dropped outright.
* They have no legitimate use in `og:image` (scrapers want a full URL) and
* are a well-known SSRF vector when reflected through server-side
* fetchers. Anything starting with `//` returns `null`.
*/
var PROTOCOL_RELATIVE_RE = /^\/\//;
/**
* URL schemes we pass through unchanged because they are legitimately
* useful as OG image values. `data:image/*` is sometimes used for inline
* social cards (rare, but legal). Everything else with a scheme
* (`mailto:`, `tel:`, `file:`, `blob:`, custom protocols) would be garbage
* in an `og:image`; we return `null` so the caller can decide whether to
* fall back or drop the tag.
*/
var PASSTHROUGH_SCHEME_RE = /^data:image\//i;
/**
* Detects URLs that have a scheme other than http/https (and other than
* the data:image/ form we pass through). Used to short-circuit garbage
* input rather than treating it as a relative path.
*/
var OTHER_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
/**
* Any ASCII whitespace or C0/C1 control character anywhere in the URL is
* an injection signal — legitimate media URLs never contain them. Without
* this guard, an input like `"  https://attacker/x"` would slip past the
* scheme regexes (which are anchored at offset 0) and get joined as a
* relative path with the site origin, producing
* `https://site.example/  https://attacker/x` — confusing but not
* exploitable, plus more pathological shapes like leading newlines that
* could inject across header boundaries downstream.
*/
var WHITESPACE_OR_CONTROL_RE = /[\s\u0000-\u001f\u007f-\u009f]/;
var TRAILING_SLASH_RE$1 = /\/$/;
/**
* `URL.origin` returns the literal string `"null"` (not the `null` value)
* for opaque origins like `data:`, `blob:`, and `about:blank`. Treating
* that as a valid origin would produce `null/og.png` in the output.
*/
function isUsableOrigin(origin) {
	return origin !== "null" && origin !== "";
}
/**
* Resolve the public origin to use when absolutizing a media URL.
*
* Precedence:
*  1. The configured `SiteSettings.url` (admin-controlled, canonical).
*  2. `PublicPageContext.siteUrl` (set by themes that override the origin,
*     e.g. when running behind a reverse proxy).
*  3. The origin parsed from `page.url`, which is the live request URL.
*
* Only `http:` and `https:` candidates count — anything else (e.g. `file:`,
* `data:`, `blob:`) would yield an unusable origin and is skipped. Returns
* `null` if no candidate parses to a usable HTTP(S) origin; callers should
* treat that as "leave the URL relative" rather than throw.
*/
function resolveSiteOrigin(configuredSiteUrl, page) {
	const candidates = [
		configuredSiteUrl,
		page.siteUrl,
		page.url
	];
	for (const candidate of candidates) {
		if (!candidate || typeof candidate !== "string") continue;
		try {
			const parsed = new URL(candidate);
			if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue;
			if (!isUsableOrigin(parsed.origin)) continue;
			return parsed.origin;
		} catch {}
	}
	return null;
}
/**
* Absolutize a media URL using the best available site origin.
*
* - Returns `null` for missing/empty input.
* - Passes through already-absolute `http(s):` URLs unchanged.
* - Passes through `data:image/*` URLs unchanged (rare but legal as OG
*   image content).
* - Returns `null` for protocol-relative URLs (`//cdn.com/x`): no
*   legitimate `og:image` use case, and a known SSRF vector when reflected
*   through server-side fetchers.
* - Returns `null` for any other scheme (`mailto:`, `blob:`, `file:`,
*   custom protocols): emitting those into `og:image` is worse than
*   omitting the tag.
* - Returns the original (relative) URL when no origin can be resolved —
*   preferable to dropping `og:image` outright because scrapers that follow
*   relative URLs are better off than ones that get nothing.
*
* @param url - The (possibly relative) media URL, e.g. `/_emdash/api/media/file/abc.jpg`.
* @param configuredSiteUrl - `SiteSettings.url` value (admin-controlled).
* @param page - The page context providing `siteUrl` and `url` fallbacks.
*/
function absolutizeMediaUrl(url, configuredSiteUrl, page) {
	if (!url) return null;
	if (WHITESPACE_OR_CONTROL_RE.test(url)) return null;
	if (HTTP_URL_RE.test(url)) return url;
	if (PASSTHROUGH_SCHEME_RE.test(url)) return url;
	if (PROTOCOL_RELATIVE_RE.test(url)) return null;
	if (OTHER_SCHEME_RE.test(url)) return null;
	const origin = resolveSiteOrigin(configuredSiteUrl, page);
	if (!origin) return url;
	const safePath = url.startsWith("/") ? url : `/${url}`;
	return `${origin.replace(TRAILING_SLASH_RE$1, "")}${safePath}`;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/search/match.ts
/**
* FTS5 match-expression builder for structured (non-user-syntax) queries.
*
* Unlike `escapeQuery` in `query.ts` (which powers the public search API and
* deliberately passes through FTS5 operators like AND/OR/NOT), this builder
* treats the input as plain words: every term is double-quoted with interior
* quotes escaped, so the result can never produce an FTS5 syntax error. Used
* by the admin content-list filter, where the input is a filter box, not a
* search-syntax field.
*/
var WHITESPACE_RE = /\s+/;
var DOUBLE_QUOTE_RE = /"/g;
var GLOB_SPECIAL_RE = /[[\]*?]/g;
/**
* Build a prefix-matching FTS5 MATCH expression from free-form input.
*
* `hello wor` becomes `"hello"* "wor"*` — implicit AND with per-term prefix
* matching. Returns `""` when the input contains no usable terms; callers
* must fall back to their non-FTS path in that case.
*/
function buildFtsPrefixMatch(input) {
	const terms = input.trim().split(WHITESPACE_RE).map((term) => term.replace(DOUBLE_QUOTE_RE, "\"\"")).filter((term) => term.length > 0);
	if (terms.length === 0) return "";
	return terms.map((term) => `"${term}"*`).join(" ");
}
/**
* Build a GLOB prefix pattern from free-form input, treating GLOB
* metacharacters (`* ? [ ]`) literally by wrapping each in a character
* class (GLOB has no ESCAPE clause).
*
* GLOB (unlike default LIKE) is case-sensitive, so with a lowercased
* pattern it matches slugs (lowercase by construction) while staying
* servable by the ordinary BINARY-collated slug index — SQLite's GLOB
* optimization turns a `prefix*` pattern into an index range scan.
*/
function buildSlugGlobPrefix(input) {
	return `${input.trim().toLowerCase().replace(GLOB_SPECIAL_RE, (c) => `[${c}]`)}*`;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/utils/slugify.ts
var DIACRITICS_PATTERN = /[\u0300-\u036f]/g;
var WHITESPACE_UNDERSCORE_PATTERN = /[\s_]+/g;
var NON_ALPHANUMERIC_HYPHEN_PATTERN = /[^a-z0-9-]/g;
var MULTIPLE_HYPHENS_PATTERN = /-+/g;
var LEADING_TRAILING_HYPHEN_PATTERN = /^-|-$/g;
var TRAILING_HYPHEN_PATTERN = /-$/;
function slugify(text, maxLength = 80) {
	return text.toLowerCase().normalize("NFD").replace(DIACRITICS_PATTERN, "").replace(WHITESPACE_UNDERSCORE_PATTERN, "-").replace(NON_ALPHANUMERIC_HYPHEN_PATTERN, "").replace(MULTIPLE_HYPHENS_PATTERN, "-").replace(LEADING_TRAILING_HYPHEN_PATTERN, "").slice(0, maxLength).replace(TRAILING_HYPHEN_PATTERN, "");
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/repositories/revision.ts
var monotonic = monotonicFactory();
/**
* Revision repository for version history
*
* Each revision stores a JSON snapshot of the content at a point in time.
* Used when collection has `supports: ["revisions"]` enabled.
*/
var RevisionRepository = class {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new revision
	*/
	async create(input) {
		const id = monotonic();
		const row = {
			id,
			collection: input.collection,
			entry_id: input.entryId,
			data: JSON.stringify(input.data),
			author_id: input.authorId ?? null
		};
		await this.db.insertInto("revisions").values(row).execute();
		const revision = await this.findById(id);
		if (!revision) throw new Error("Failed to create revision");
		return revision;
	}
	/**
	* Find revision by ID
	*/
	async findById(id) {
		const row = await this.db.selectFrom("revisions").selectAll().where("id", "=", id).executeTakeFirst();
		return row ? this.rowToRevision(row) : null;
	}
	/**
	* Get all revisions for an entry (newest first)
	*
	* Orders by monotonic ULID (descending). The monotonic factory
	* guarantees strictly increasing IDs even within the same millisecond.
	*/
	async findByEntry(collection, entryId, options = {}) {
		let query = this.db.selectFrom("revisions").selectAll().where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("id", "desc");
		if (options.limit) query = query.limit(options.limit);
		return (await query.execute()).map((row) => this.rowToRevision(row));
	}
	/**
	* Get the most recent revision for an entry
	*/
	async findLatest(collection, entryId) {
		const row = await this.db.selectFrom("revisions").selectAll().where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("id", "desc").limit(1).executeTakeFirst();
		return row ? this.rowToRevision(row) : null;
	}
	/**
	* Count revisions for an entry
	*/
	async countByEntry(collection, entryId) {
		const result = await this.db.selectFrom("revisions").select((eb) => eb.fn.count("id").as("count")).where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Delete all revisions for an entry (use when entry is deleted)
	*/
	async deleteByEntry(collection, entryId) {
		const result = await this.db.deleteFrom("revisions").where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Delete old revisions, keeping the most recent N
	*/
	async pruneOldRevisions(collection, entryId, keepCount) {
		const keepIds = (await this.db.selectFrom("revisions").select("id").where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("created_at", "desc").orderBy("id", "desc").limit(keepCount).execute()).map((r) => r.id);
		if (keepIds.length === 0) return 0;
		const result = await this.db.deleteFrom("revisions").where("collection", "=", collection).where("entry_id", "=", entryId).where("id", "not in", keepIds).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Update revision data in place
	* Used for autosave to avoid creating many small revisions.
	*/
	async updateData(id, data) {
		await this.db.updateTable("revisions").set({ data: JSON.stringify(data) }).where("id", "=", id).execute();
	}
	/**
	* Convert database row to Revision object
	*/
	rowToRevision(row) {
		return {
			id: row.id,
			collection: row.collection,
			entryId: row.entry_id,
			data: JSON.parse(row.data),
			authorId: row.author_id,
			createdAt: row.created_at
		};
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/database/repositories/content.ts
var ULID_PATTERN = /^[0-9A-Z]{26}$/;
var LIKE_WILDCARD_RE = /[\\%_]/g;
/**
* Whitelist mapping a public date-filter field to its physical column. Keeping
* this separate from `mapOrderField` makes the filterable set explicit and
* prevents filtering on arbitrary columns.
*/
var DATE_FILTER_COLUMNS = {
	createdAt: "created_at",
	updatedAt: "updated_at",
	publishedAt: "published_at"
};
/**
* System columns that exist in every ec_* table
*/
var SYSTEM_COLUMNS = /* @__PURE__ */ new Set([
	"id",
	"slug",
	"status",
	"author_id",
	"primary_byline_id",
	"created_at",
	"updated_at",
	"published_at",
	"scheduled_at",
	"deleted_at",
	"version",
	"live_revision_id",
	"draft_revision_id",
	"locale",
	"translation_group"
]);
/**
* Get the table name for a collection type
*/
function getTableName(type) {
	validateIdentifier(type, "collection type");
	return `ec_${type}`;
}
/**
* Serialize a value for database storage
* Objects/arrays are JSON-stringified
* Booleans are converted to 0/1 for SQLite
*/
function serializeValue(value) {
	if (value === null || value === void 0) return null;
	if (typeof value === "boolean") return value ? 1 : 0;
	if (typeof value === "object") return JSON.stringify(value);
	return value;
}
/**
* Deserialize a value from database storage
* Attempts to parse JSON strings that look like objects/arrays
*/
function deserializeValue(value) {
	if (typeof value === "string") {
		if (value.startsWith("{") || value.startsWith("[")) try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}
/** Pattern for escaping special regex characters */
var REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;
/**
* Escape special regex characters in a string for use in `new RegExp()`
*/
function escapeRegExp(s) {
	return s.replace(REGEX_ESCAPE_PATTERN, "\\$&");
}
/**
* Repository for content CRUD operations
*
* Content is stored in per-collection tables (ec_posts, ec_pages, etc.)
* Each field becomes a real column in the table.
*/
var ContentRepository = class {
	db;
	constructor(db) {
		this.db = db;
	}
	/**
	* Create a new content item
	*/
	async create(input) {
		const id = ulid();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const { type, slug, data, status = "draft", authorId, primaryBylineId, locale, translationOf, publishedAt, createdAt } = input;
		if (!type) throw new EmDashValidationError("Content type is required");
		const tableName = getTableName(type);
		let translationGroup = id;
		if (translationOf) {
			const source = await this.findById(type, translationOf);
			if (!source) throw new EmDashValidationError("Translation source content not found");
			translationGroup = source.translationGroup || source.id;
		}
		const columns = [
			"id",
			"slug",
			"status",
			"author_id",
			"primary_byline_id",
			"created_at",
			"updated_at",
			"published_at",
			"version",
			"locale",
			"translation_group"
		];
		const values = [
			id,
			slug || null,
			status,
			authorId || null,
			primaryBylineId ?? null,
			createdAt || now,
			now,
			publishedAt || null,
			1,
			locale || "en",
			translationGroup
		];
		if (data && typeof data === "object") {
			for (const [key, value] of Object.entries(data)) if (!SYSTEM_COLUMNS.has(key)) {
				validateIdentifier(key, "content field name");
				columns.push(key);
				values.push(serializeValue(value));
			}
		}
		const columnRefs = columns.map((c) => sql.ref(c));
		const valuePlaceholders = values.map((v) => v === null ? sql`NULL` : sql`${v}`);
		await sql`
			INSERT INTO ${sql.ref(tableName)} (${sql.join(columnRefs, sql`, `)})
			VALUES (${sql.join(valuePlaceholders, sql`, `)})
		`.execute(this.db);
		invalidateCollectionCache(type);
		const item = await this.findById(type, id);
		if (!item) throw new Error("Failed to create content");
		return item;
	}
	/**
	* Generate a unique slug for a content item within a collection.
	*
	* Checks the collection table for existing slugs that match `baseSlug`
	* (optionally scoped to a locale) and appends a numeric suffix (`-1`,
	* `-2`, etc.) on collision to guarantee uniqueness.
	*
	* Returns `null` if `baseSlug` is empty after slugification.
	*/
	async generateUniqueSlug(type, text, locale) {
		const baseSlug = slugify(text);
		if (!baseSlug) return null;
		const tableName = getTableName(type);
		if ((locale ? await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug}
					AND locale = ${locale}
					LIMIT 1
				`.execute(this.db) : await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug}
					LIMIT 1
				`.execute(this.db)).rows.length === 0) return baseSlug;
		const pattern = `${baseSlug}-%`;
		const candidates = locale ? await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE (slug = ${baseSlug} OR slug LIKE ${pattern})
					AND locale = ${locale}
				`.execute(this.db) : await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug} OR slug LIKE ${pattern}
				`.execute(this.db);
		let maxSuffix = 0;
		const suffixPattern = new RegExp(`^${escapeRegExp(baseSlug)}-(\\d+)$`);
		for (const row of candidates.rows) {
			const match = suffixPattern.exec(row.slug);
			if (match) {
				const n = parseInt(match[1], 10);
				if (n > maxSuffix) maxSuffix = n;
			}
		}
		return `${baseSlug}-${maxSuffix + 1}`;
	}
	/**
	* Duplicate a content item
	* Creates a new draft copy with "(Copy)" appended to the title.
	* A slug is auto-generated from the new title by the handler layer.
	*/
	async duplicate(type, id, authorId) {
		const original = await this.findById(type, id);
		if (!original) throw new EmDashValidationError("Content item not found");
		const newData = { ...original.data };
		if (typeof newData.title === "string") newData.title = `${newData.title} (Copy)`;
		else if (typeof newData.name === "string") newData.name = `${newData.name} (Copy)`;
		const slugSource = typeof newData.title === "string" ? newData.title : typeof newData.name === "string" ? newData.name : null;
		const slug = slugSource ? await this.generateUniqueSlug(type, slugSource, original.locale ?? void 0) : null;
		return this.create({
			type,
			slug,
			data: newData,
			status: "draft",
			authorId: authorId || original.authorId || void 0,
			locale: original.locale ?? void 0
		});
	}
	/**
	* Find content by ID
	*/
	async findById(type, id) {
		const tableName = getTableName(type);
		const row = (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find content by id, including trashed (soft-deleted) items.
	* Used by restore endpoint for ownership checks.
	*/
	async findByIdIncludingTrashed(type, id) {
		const tableName = getTableName(type);
		const row = (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE id = ${id}
		`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find content by ID or slug. Tries ID first if it looks like a ULID,
	* otherwise tries slug. Falls back to the other if the first lookup misses.
	*/
	async findByIdOrSlug(type, identifier, locale) {
		return this._findByIdOrSlug(type, identifier, false, locale);
	}
	/**
	* Find content by ID or slug, including trashed (soft-deleted) items.
	* Used by restore/permanent-delete endpoints.
	*/
	async findByIdOrSlugIncludingTrashed(type, identifier, locale) {
		return this._findByIdOrSlug(type, identifier, true, locale);
	}
	async _findByIdOrSlug(type, identifier, includeTrashed, locale) {
		const looksLikeUlid = ULID_PATTERN.test(identifier);
		const findById = includeTrashed ? (t, id) => this.findByIdIncludingTrashed(t, id) : (t, id) => this.findById(t, id);
		const findBySlug = includeTrashed ? (t, s) => this.findBySlugIncludingTrashed(t, s, locale) : (t, s) => this.findBySlug(t, s, locale);
		try {
			if (looksLikeUlid) {
				const byId = await findById(type, identifier);
				if (byId) return byId;
				return await findBySlug(type, identifier);
			}
			const bySlug = await findBySlug(type, identifier);
			if (bySlug) return bySlug;
			return await findById(type, identifier);
		} catch (error) {
			if (isMissingTableError(error)) return null;
			throw error;
		}
	}
	/**
	* Find content by slug
	*/
	async findBySlug(type, slug, locale) {
		const tableName = getTableName(type);
		const row = (locale ? await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND locale = ${locale}
					AND deleted_at IS NULL
				`.execute(this.db) : await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND deleted_at IS NULL
					ORDER BY locale ASC
					LIMIT 1
				`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find content by slug, including trashed (soft-deleted) items.
	* Used by restore/permanent-delete endpoints.
	*/
	async findBySlugIncludingTrashed(type, slug, locale) {
		const tableName = getTableName(type);
		const row = (locale ? await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND locale = ${locale}
				`.execute(this.db) : await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					ORDER BY locale ASC
					LIMIT 1
				`.execute(this.db)).rows[0];
		if (!row) return null;
		return this.mapRow(type, row);
	}
	/**
	* Find many content items with filtering and pagination
	*/
	async findMany(type, options = {}) {
		const tableName = getTableName(type);
		const limit = Math.min(options.limit || 50, 100);
		const orderField = options.orderBy?.field || "createdAt";
		const orderDirection = options.orderBy?.direction || "desc";
		const dbField = this.mapOrderField(orderField);
		const safeOrderDirection = orderDirection.toLowerCase() === "asc" ? "ASC" : "DESC";
		let query = this.db.selectFrom(tableName).selectAll().where("deleted_at", "is", null);
		if (options.where?.status) query = query.where("status", "=", options.where.status);
		if (options.where?.authorId) query = query.where("author_id", "=", options.where.authorId);
		if (options.where?.locale) query = query.where("locale", "=", options.where.locale);
		query = this.applySearchFilter(query, options.where, type);
		query = this.applyDateFilter(query, options.where);
		if (options.cursor) {
			const { orderValue, id: cursorId } = decodeCursor(options.cursor);
			if (safeOrderDirection === "DESC") query = query.where((eb) => eb.or([eb(dbField, "<", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", "<", cursorId)])]));
			else query = query.where((eb) => eb.or([eb(dbField, ">", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", ">", cursorId)])]));
		}
		query = query.orderBy(dbField, safeOrderDirection === "ASC" ? "asc" : "desc").orderBy("id", safeOrderDirection === "ASC" ? "asc" : "desc").limit(limit + 1);
		const [rows, total] = await Promise.all([query.execute(), this.count(type, options.where)]);
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit);
		const mappedResult = {
			items: items.map((row) => this.mapRow(type, row)),
			total
		};
		if (hasMore && items.length > 0) {
			const lastRow = items.at(-1);
			const lastOrderValue = lastRow[dbField];
			mappedResult.nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
		}
		return mappedResult;
	}
	/**
	* Update content
	*/
	async update(type, id, input) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const updates = {};
		if (input.status !== void 0) updates.status = input.status;
		if (input.slug !== void 0) updates.slug = input.slug;
		if (input.publishedAt !== void 0) updates.published_at = input.publishedAt;
		if (input.scheduledAt !== void 0) updates.scheduled_at = input.scheduledAt;
		if (input.authorId !== void 0) updates.author_id = input.authorId;
		if (input.primaryBylineId !== void 0) updates.primary_byline_id = input.primaryBylineId;
		if (input.data !== void 0 && typeof input.data === "object") {
			for (const [key, value] of Object.entries(input.data)) if (!SYSTEM_COLUMNS.has(key)) {
				validateIdentifier(key, "content field name");
				updates[key] = serializeValue(value);
			}
		}
		const hasColumnWrites = Object.keys(updates).length > 0;
		if (hasColumnWrites) updates.updated_at = now;
		updates.version = sql`version + 1`;
		await this.db.updateTable(tableName).set(updates).where("id", "=", id).where("deleted_at", "is", null).execute();
		if (input.status !== void 0 || input.publishedAt !== void 0 || input.scheduledAt !== void 0) await this.restampEntryPivot(type, id);
		if (hasColumnWrites) invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Delete content (soft delete - moves to trash)
	*/
	async delete(type, id) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const changed = ((await sql`
			UPDATE ${sql.ref(tableName)}
			SET deleted_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db)).numAffectedRows ?? 0n) > 0n;
		if (changed) {
			await this.restampEntryPivot(type, id);
			invalidateCollectionCache(type);
		}
		return changed;
	}
	/**
	* Restore content from trash
	*/
	async restore(type, id) {
		const tableName = getTableName(type);
		const restored = (await sql`
			UPDATE ${sql.ref(tableName)}
			SET deleted_at = NULL
			WHERE id = ${id}
			AND deleted_at IS NOT NULL
			RETURNING *
		`.execute(this.db)).rows[0];
		if (!restored) return null;
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		return this.mapRow(type, restored);
	}
	/**
	* Re-stamp the denormalized filter + sort columns on every
	* `content_taxonomies` pivot row for an entry from its authoritative `ec_*`
	* row (migration 051). Called after any mutation that moves one of those
	* columns so a taxonomy-filtered listing can seek the entry directly.
	*
	* A single correlated `UPDATE` reads the post-mutation values from `ec_*`, so
	* the pivot converges to the authoritative row. This is NOT atomic with the
	* `ec_*` mutation on D1 (no transactions), which is why the read path
	* re-checks the real predicates on the joined `ec_*` row. Untagged entries
	* have no pivot rows, so the statement is a cheap no-op for them.
	*/
	async restampEntryPivot(type, id) {
		const tableName = getTableName(type);
		await sql`
			UPDATE content_taxonomies
			SET (status, scheduled_at, deleted_at, locale, published_at, created_at) = (
				SELECT status, scheduled_at, deleted_at, locale, published_at, created_at
				FROM ${sql.ref(tableName)}
				WHERE ${sql.ref(tableName)}.id = ${id}
			)
			WHERE collection = ${type} AND entry_id = ${id}
		`.execute(this.db);
	}
	/**
	* Permanently delete content (cannot be undone)
	*/
	/**
	* Permanently delete a soft-deleted content row.
	*
	* Returns `true` only when a soft-deleted (trashed) row was removed.
	* Returns `false` when no row exists OR when the row exists but is live —
	* the caller is responsible for distinguishing these cases (typically via
	* a follow-up `findByIdOrSlugIncludingTrashed` to surface NOT_FOUND vs
	* NOT_TRASHED). The `AND deleted_at IS NOT NULL` clause is the safety net
	* that prevents permanent delete from bypassing the trash workflow.
	*/
	async permanentDelete(type, id) {
		const tableName = getTableName(type);
		const changed = ((await sql`
			DELETE FROM ${sql.ref(tableName)}
			WHERE id = ${id}
			AND deleted_at IS NOT NULL
		`.execute(this.db)).numAffectedRows ?? 0n) > 0n;
		if (changed) invalidateCollectionCache(type);
		return changed;
	}
	/**
	* Find trashed content items
	*/
	async findTrashed(type, options = {}) {
		const tableName = getTableName(type);
		const limit = Math.min(options.limit || 50, 100);
		const orderField = options.orderBy?.field || "deletedAt";
		const orderDirection = options.orderBy?.direction || "desc";
		const dbField = this.mapOrderField(orderField);
		const safeOrderDirection = orderDirection.toLowerCase() === "asc" ? "ASC" : "DESC";
		let query = this.db.selectFrom(tableName).selectAll().where("deleted_at", "is not", null);
		if (options.cursor) {
			const { orderValue, id: cursorId } = decodeCursor(options.cursor);
			if (safeOrderDirection === "DESC") query = query.where((eb) => eb.or([eb(dbField, "<", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", "<", cursorId)])]));
			else query = query.where((eb) => eb.or([eb(dbField, ">", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", ">", cursorId)])]));
		}
		query = query.orderBy(dbField, safeOrderDirection === "ASC" ? "asc" : "desc").orderBy("id", safeOrderDirection === "ASC" ? "asc" : "desc").limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit);
		const mappedResult = { items: items.map((row) => {
			const record = row;
			return {
				...this.mapRow(type, record),
				deletedAt: typeof record.deleted_at === "string" ? record.deleted_at : ""
			};
		}) };
		if (hasMore && items.length > 0) {
			const lastRow = items.at(-1);
			const lastOrderValue = lastRow[dbField];
			mappedResult.nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
		}
		return mappedResult;
	}
	/**
	* Count trashed content items
	*/
	async countTrashed(type) {
		const tableName = getTableName(type);
		const result = await this.db.selectFrom(tableName).select((eb) => eb.fn.count("id").as("count")).where("deleted_at", "is not", null).executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Apply the optional `q` filter.
	*
	* When the handler sets `useFts` (collection has a healthy FTS5 index
	* covering the display columns; SQLite only), the filter is served from
	* the index: a token-prefix MATCH against `_emdash_fts_<slug>` OR'd with
	* an index-served `slug GLOB 'term*'` prefix (the slug is not in the FTS
	* index). Both sides are index-backed, so SQLite's OR optimization avoids
	* the full-table scan the LIKE fallback needs (#1517). The trade-off is
	* search semantics: token-prefix matching instead of arbitrary substring.
	*
	* Fallback (Postgres, search disabled, or no usable terms): case-
	* insensitive substring LIKE across the handler-resolved `searchColumns`
	* (OR'd). User input is treated literally (LIKE wildcards escaped) and
	* `lower()` is applied on both sides for SQLite/Postgres parity.
	*/
	applySearchFilter(query, where, type) {
		const term = where?.q?.trim();
		const columns = where?.searchColumns;
		if (!term || !columns || columns.length === 0) return query;
		if (where.useFts) {
			const match = buildFtsPrefixMatch(term);
			if (match) {
				validateIdentifier(type, "collection slug");
				const ftsTable = `_emdash_fts_${type}`;
				const slugPrefix = buildSlugGlobPrefix(term);
				return query.where((eb) => eb.or([sql`id IN (SELECT id FROM ${sql.ref(ftsTable)} WHERE ${sql.ref(ftsTable)} MATCH ${match})`, sql`slug GLOB ${slugPrefix}`]));
			}
		}
		const pattern = `%${term.replace(LIKE_WILDCARD_RE, (c) => `\\${c}`)}%`;
		return query.where((eb) => eb.or(columns.map((col) => {
			validateIdentifier(col, "search column");
			return eb(sql`lower(${sql.ref(col)})`, "like", sql`lower(${pattern}) escape '\\'`);
		})));
	}
	/**
	* Apply the optional inclusive date-range filter. The field is mapped
	* through `DATE_FILTER_COLUMNS` (a closed whitelist), and bounds compare
	* lexicographically against the stored ISO 8601 timestamps. A `publishedAt`
	* range naturally excludes never-published rows (their column is NULL).
	*/
	applyDateFilter(query, where) {
		const filter = where?.dateFilter;
		if (!filter) return query;
		const column = DATE_FILTER_COLUMNS[filter.field];
		if (!column) throw new EmDashValidationError(`Invalid date filter field: ${filter.field}`);
		const { from, to } = filter;
		if (!from && !to) return query;
		let next = query;
		if (from) next = next.where((eb) => eb(column, ">=", from));
		if (to) next = next.where((eb) => eb(column, "<=", to));
		return next;
	}
	/**
	* Count content items
	*/
	async count(type, where) {
		const tableName = getTableName(type);
		let query = this.db.selectFrom(tableName).select((eb) => eb.fn.count("id").as("count")).where("deleted_at", "is", null);
		if (where?.status) query = query.where("status", "=", where.status);
		if (where?.authorId) query = query.where("author_id", "=", where.authorId);
		if (where?.locale) query = query.where("locale", "=", where.locale);
		query = this.applySearchFilter(query, where, type);
		query = this.applyDateFilter(query, where);
		const result = await query.executeTakeFirst();
		return Number(result?.count || 0);
	}
	/**
	* Distinct, non-null `author_id` values across the collection's live
	* (non-trashed) content. Used to populate the admin author filter with
	* only the users who have actually authored entries, rather than the
	* full user directory (which requires admin privileges to read).
	*/
	async findDistinctAuthorIds(type) {
		const tableName = getTableName(type);
		return (await this.db.selectFrom(tableName).select("author_id").distinct().where("deleted_at", "is", null).where("author_id", "is not", null).execute()).map((row) => row.author_id).filter((id) => id !== null);
	}
	async getStats(type) {
		const tableName = getTableName(type);
		const result = await this.db.selectFrom(tableName).select((eb) => [
			eb.fn.count("id").as("total"),
			eb.fn.sum(eb.case().when("status", "=", "published").then(1).else(0).end()).as("published"),
			eb.fn.sum(eb.case().when("status", "=", "draft").then(1).else(0).end()).as("draft"),
			sql`SUM(CASE WHEN scheduled_at IS NOT NULL THEN 1 ELSE 0 END)`.as("scheduled")
		]).where("deleted_at", "is", null).executeTakeFirst();
		return {
			total: Number(result?.total || 0),
			published: Number(result?.published || 0),
			draft: Number(result?.draft || 0),
			scheduled: Number(result?.scheduled || 0)
		};
	}
	/**
	* Schedule content for future publishing
	*
	* Sets status to 'scheduled' and stores the scheduled publish time.
	* The content will be auto-published when the scheduled time is reached.
	*/
	async schedule(type, id, scheduledAt) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const scheduledDate = new Date(scheduledAt);
		if (isNaN(scheduledDate.getTime())) throw new EmDashValidationError("Invalid scheduled date");
		if (scheduledDate <= /* @__PURE__ */ new Date()) throw new EmDashValidationError("Scheduled date must be in the future");
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		const newStatus = existing.status === "published" ? "published" : "scheduled";
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET status = ${newStatus},
				scheduled_at = ${scheduledAt},
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Unschedule content
	*
	* Clears the scheduled time. Published posts stay published;
	* draft/scheduled posts revert to 'draft'.
	*/
	async unschedule(type, id) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		const newStatus = existing.status === "published" ? "published" : "draft";
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET status = ${newStatus},
				scheduled_at = NULL,
				updated_at = ${now}
			WHERE id = ${id}
			AND scheduled_at IS NOT NULL
			AND deleted_at IS NULL
		`.execute(this.db);
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Find content that is ready to be published
	*
	* Returns all content where scheduled_at <= now, regardless of status.
	* This covers both draft-scheduled posts (status='scheduled') and
	* published posts with scheduled draft changes (status='published').
	*
	* `limit` (optional) caps how many due rows are returned, oldest-due first.
	* The scheduled-publishing sweep passes a limit so a large backlog can't
	* fan out unbounded publish/webhook work in a single tick (and blow a Worker
	* invocation's CPU/subrequest budget); the remainder drains on later ticks.
	*/
	async findReadyToPublish(type, limit) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const limitClause = typeof limit === "number" && Number.isInteger(limit) && limit > 0 ? sql`LIMIT ${limit}` : sql``;
		return (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE scheduled_at IS NOT NULL
			AND scheduled_at <= ${now}
			AND deleted_at IS NULL
			ORDER BY scheduled_at ASC
			${limitClause}
		`.execute(this.db)).rows.map((row) => this.mapRow(type, row));
	}
	/**
	* Find all translations in a translation group
	*/
	async findTranslations(type, translationGroup) {
		const tableName = getTableName(type);
		return (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE translation_group = ${translationGroup}
			AND deleted_at IS NULL
			ORDER BY locale ASC
		`.execute(this.db)).rows.map((row) => this.mapRow(type, row));
	}
	/**
	* Batch variant of {@link findTranslations}: every (non-deleted) locale
	* variant for any of `translationGroups`, in one `WHERE translation_group IN
	* (...)` query chunked at `SQL_BATCH_SIZE` for D1's bind-parameter limit.
	* Lets callers resolve many edge groups without an N+1 per group. The caller
	* groups the flat result by `translationGroup` itself.
	*
	* `publishedOnly` restricts the result to `status = 'published'` — reference
	* reads pass this for callers without `content:read_drafts` so draft/scheduled
	* entries never leak through an edge traversal.
	*
	* A reference edge stores only a collection slug (no SQL FK), so the table may
	* have been dropped since the edge was written. That is a tolerated dangling
	* state, not an error: a missing table resolves to no rows, mirroring how the
	* content read handlers treat `isMissingTableError`.
	*/
	async findTranslationsForGroups(type, translationGroups, options = {}) {
		if (translationGroups.length === 0) return [];
		const tableName = getTableName(type);
		const publishedFilter = options.publishedOnly ? sql`AND status = 'published'` : sql``;
		const items = [];
		try {
			for (const chunk of chunks(translationGroups, 50)) {
				const result = await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE translation_group IN (${sql.join(chunk)})
					AND deleted_at IS NULL
					${publishedFilter}
					ORDER BY locale ASC
				`.execute(this.db);
				for (const row of result.rows) items.push(this.mapRow(type, row));
			}
		} catch (error) {
			if (isMissingTableError(error)) return [];
			throw error;
		}
		return items;
	}
	/**
	* Batch variant of {@link findByIdOrSlug}: resolve many identifiers (each an
	* id OR a slug) within `type` in a constant number of queries — one `WHERE id
	* IN (...)` and one `WHERE slug IN (...)`, each chunked at `SQL_BATCH_SIZE`.
	* Returns a map from the input identifier to its resolved item; identifiers
	* that match nothing are absent. Used on write paths that accept a list of
	* references, so a single request doesn't fan out to an N+1 of point lookups.
	*
	* Resolution mirrors {@link findByIdOrSlug}: a ULID-shaped identifier prefers
	* the id match and falls back to slug; anything else prefers the slug match
	* and falls back to id. Slug matches collapse to the lowest-locale variant
	* (`ORDER BY locale ASC`), matching the slug-without-locale lookup.
	*/
	async findManyByIdOrSlug(type, identifiers) {
		const resolved = /* @__PURE__ */ new Map();
		const unique = [...new Set(identifiers)];
		if (unique.length === 0) return resolved;
		const tableName = getTableName(type);
		const byId = /* @__PURE__ */ new Map();
		const bySlug = /* @__PURE__ */ new Map();
		try {
			for (const chunk of chunks(unique, 50)) {
				const idRows = await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE id IN (${sql.join(chunk)})
					AND deleted_at IS NULL
				`.execute(this.db);
				for (const row of idRows.rows) {
					const item = this.mapRow(type, row);
					byId.set(item.id, item);
				}
				const slugRows = await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug IN (${sql.join(chunk)})
					AND deleted_at IS NULL
					ORDER BY locale ASC
				`.execute(this.db);
				for (const row of slugRows.rows) {
					const item = this.mapRow(type, row);
					if (item.slug != null && !bySlug.has(item.slug)) bySlug.set(item.slug, item);
				}
			}
		} catch (error) {
			if (isMissingTableError(error)) return resolved;
			throw error;
		}
		for (const identifier of unique) {
			const item = ULID_PATTERN.test(identifier) ? byId.get(identifier) ?? bySlug.get(identifier) : bySlug.get(identifier) ?? byId.get(identifier);
			if (item) resolved.set(identifier, item);
		}
		return resolved;
	}
	/**
	* Publish the current draft
	*
	* Promotes draft_revision_id to live_revision_id and clears draft pointer.
	* Syncs the draft revision's data into the content table columns so the
	* content table always reflects the published version.
	* If no draft revision exists, creates one from current data and publishes it.
	*
	* `publishedAt` (optional) overrides the publication timestamp. If omitted,
	* the existing `published_at` is preserved (idempotent re-publish keeps the
	* original date) and falls back to the current time on first publish. Pass
	* an explicit value to backdate a publish (e.g. when migrating content from
	* another CMS).
	*
	* `requireDue` (optional) gates the publish on the row still being due:
	* `scheduled_at` non-null and in the past. Used by the scheduled-publishing
	* sweep to avoid publishing content an editor unscheduled or rescheduled
	* between selection and publish. It claims the row with a single conditional
	* UPDATE (clearing `scheduled_at`) before any other write, so it is atomic
	* even on D1 (no multi-statement transactions) and serialises against
	* `unschedule()` and concurrent sweeps — no TOCTOU and no double publish.
	*/
	async publish(type, id, publishedAt, requireDue = false) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		let claimedScheduledAt = null;
		let claimedUpdatedAt = null;
		if (requireDue) {
			if (((await sql`
				UPDATE ${sql.ref(tableName)}
				SET scheduled_at = NULL,
					updated_at = ${now}
				WHERE id = ${id}
				AND scheduled_at IS NOT NULL
				AND scheduled_at <= ${now}
				AND deleted_at IS NULL
			`.execute(this.db)).numAffectedRows ?? 0n) === 0n) throw new ScheduledNotDueError();
			claimedScheduledAt = existing.scheduledAt;
			claimedUpdatedAt = existing.updatedAt;
		}
		let publishCommitted = false;
		try {
			const revisionRepo = new RevisionRepository(this.db);
			let revisionToPublish = existing.draftRevisionId || existing.liveRevisionId;
			if (!revisionToPublish) revisionToPublish = (await revisionRepo.create({
				collection: type,
				entryId: id,
				data: existing.data
			})).id;
			const revision = await revisionRepo.findById(revisionToPublish);
			if (revision) {
				const stagedSlug = typeof revision.data._slug === "string" ? revision.data._slug : null;
				if (stagedSlug !== null && stagedSlug !== existing.slug && existing.locale !== null) {
					const conflict = await this.findBySlugIncludingTrashed(type, stagedSlug, existing.locale);
					if (conflict && conflict.id !== id) throw new EmDashValidationError(`Cannot publish: slug '${stagedSlug}' is already used by another entry in this collection (id: ${conflict.id}). Choose a different slug.`, { code: "SLUG_CONFLICT" });
				}
				if (stagedSlug !== null) await sql`
						UPDATE ${sql.ref(tableName)}
						SET slug = ${stagedSlug}
						WHERE id = ${id}
					`.execute(this.db);
				await this.syncDataColumns(type, id, revision.data);
			}
			if (publishedAt !== void 0) await sql`
					UPDATE ${sql.ref(tableName)}
					SET live_revision_id = ${revisionToPublish},
						draft_revision_id = NULL,
						status = 'published',
						scheduled_at = NULL,
						published_at = ${publishedAt},
						updated_at = ${now}
					WHERE id = ${id}
					AND deleted_at IS NULL
				`.execute(this.db);
			else await sql`
					UPDATE ${sql.ref(tableName)}
					SET live_revision_id = ${revisionToPublish},
						draft_revision_id = NULL,
						status = 'published',
						scheduled_at = NULL,
						published_at = COALESCE(published_at, ${now}),
						updated_at = ${now}
					WHERE id = ${id}
					AND deleted_at IS NULL
				`.execute(this.db);
			publishCommitted = true;
			await this.restampEntryPivot(type, id);
			const updated = await this.findById(type, id);
			if (!updated) throw new Error("Content not found");
			invalidateCollectionCache(type);
			return updated;
		} catch (error) {
			if (requireDue && claimedScheduledAt && !publishCommitted) try {
				await sql`
						UPDATE ${sql.ref(tableName)}
						SET scheduled_at = ${claimedScheduledAt},
							updated_at = ${claimedUpdatedAt ?? now}
						WHERE id = ${id}
						AND scheduled_at IS NULL
						AND deleted_at IS NULL
						AND (status != 'published' OR draft_revision_id IS NOT NULL)
					`.execute(this.db);
			} catch (restoreError) {
				console.error(`[content] Failed to restore schedule for ${type}/${id} after publish failure:`, restoreError);
			}
			throw error;
		}
	}
	/**
	* Unpublish content
	*
	* Removes live pointer but preserves draft. If no draft exists,
	* creates one from the live version so the content isn't lost.
	*/
	async unpublish(type, id) {
		const tableName = getTableName(type);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		if (!existing.draftRevisionId && existing.liveRevisionId) {
			const revisionRepo = new RevisionRepository(this.db);
			const liveRevision = await revisionRepo.findById(existing.liveRevisionId);
			if (liveRevision) {
				const draft = await revisionRepo.create({
					collection: type,
					entryId: id,
					data: liveRevision.data
				});
				await sql`
					UPDATE ${sql.ref(tableName)}
					SET draft_revision_id = ${draft.id}
					WHERE id = ${id}
				`.execute(this.db);
			}
		}
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET live_revision_id = NULL,
				status = 'draft',
				published_at = NULL,
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
		await this.restampEntryPivot(type, id);
		invalidateCollectionCache(type);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Set the draft revision pointer for a content item.
	*
	* Used by seed/import paths that stage a new revision's data before
	* promoting it to live via `publish()`.
	*
	* Validates that the content item exists and is not soft-deleted, that
	* the revision exists, and that the revision belongs to the same
	* collection and entry. Without these checks, a caller could leave the
	* content row pointing at a missing or unrelated revision.
	*/
	async setDraftRevision(type, id, revisionId) {
		const tableName = getTableName(type);
		if (!await this.findById(type, id)) throw new EmDashValidationError("Content item not found");
		const revision = await new RevisionRepository(this.db).findById(revisionId);
		if (!revision) throw new EmDashValidationError("Revision not found");
		if (revision.collection !== type || revision.entryId !== id) throw new EmDashValidationError("Revision does not belong to the specified content item");
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET draft_revision_id = ${revisionId}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
	}
	/**
	* Discard pending draft changes
	*
	* Clears draft_revision_id. The content table columns already hold the
	* published version, so no data sync is needed.
	*/
	async discardDraft(type, id) {
		const tableName = getTableName(type);
		const existing = await this.findById(type, id);
		if (!existing) throw new EmDashValidationError("Content item not found");
		if (!existing.draftRevisionId) return existing;
		await sql`
			UPDATE ${sql.ref(tableName)}
			SET draft_revision_id = NULL
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
		const updated = await this.findById(type, id);
		if (!updated) throw new Error("Content not found");
		return updated;
	}
	/**
	* Sync data columns in the content table from a data object.
	* Used to promote revision data into the content table on publish.
	* Keys starting with _ are revision metadata (e.g. _slug) and are skipped.
	*/
	async syncDataColumns(type, id, data) {
		const tableName = getTableName(type);
		const updates = {};
		for (const [key, value] of Object.entries(data)) {
			if (SYSTEM_COLUMNS.has(key)) continue;
			if (key.startsWith("_")) continue;
			validateIdentifier(key, "content field name");
			updates[key] = serializeValue(value);
		}
		if (Object.keys(updates).length === 0) return;
		await this.db.updateTable(tableName).set(updates).where("id", "=", id).execute();
	}
	/**
	* Count content items with a pending schedule.
	* Includes both draft-scheduled (status='scheduled') and published
	* posts with scheduled draft changes (status='published', scheduled_at set).
	*/
	async countScheduled(type) {
		const tableName = getTableName(type);
		const result = await sql`
			SELECT COUNT(id) as count FROM ${sql.ref(tableName)}
			WHERE scheduled_at IS NOT NULL
			AND deleted_at IS NULL
		`.execute(this.db);
		return Number(result.rows[0]?.count || 0);
	}
	/**
	* Map database row to ContentItem
	* Extracts system columns and puts content fields in data
	* Excludes null values from data to match input semantics
	*/
	mapRow(type, row) {
		const data = {};
		for (const [key, value] of Object.entries(row)) if (!SYSTEM_COLUMNS.has(key) && value !== null) data[key] = deserializeValue(value);
		return {
			id: row.id,
			type,
			slug: row.slug,
			status: row.status,
			data,
			authorId: row.author_id,
			primaryBylineId: row.primary_byline_id ?? null,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			publishedAt: row.published_at,
			scheduledAt: row.scheduled_at,
			liveRevisionId: row.live_revision_id ?? null,
			draftRevisionId: row.draft_revision_id ?? null,
			version: typeof row.version === "number" ? row.version : 1,
			locale: row.locale ?? null,
			translationGroup: row.translation_group ?? null
		};
	}
	/**
	* Map order field names to database columns.
	* Only allows known fields to prevent column enumeration via crafted orderBy values.
	*/
	mapOrderField(field) {
		const mapped = {
			createdAt: "created_at",
			updatedAt: "updated_at",
			publishedAt: "published_at",
			scheduledAt: "scheduled_at",
			deletedAt: "deleted_at",
			title: "title",
			name: "name",
			slug: "slug",
			status: "status",
			locale: "locale"
		}[field];
		if (!mapped) throw new EmDashValidationError(`Invalid order field: ${field}`);
		return mapped;
	}
};
//#endregion
//#region self-essentials/emdash-main/packages/core/src/seo/hreflang.ts
var TRAILING_SLASH_RE = /\/$/;
var ABSOLUTE_URL_RE = /^https?:\/\//i;
/**
* IDs of variants flagged `noindex` in the SEO panel. Entries without
* an `_emdash_seo` row are indexable by default (same as the sitemap).
* The id list is bounded by the number of configured locales, so no
* chunking is needed.
*/
async function findNoindexIds(db, collection, ids) {
	if (ids.length === 0) return /* @__PURE__ */ new Set();
	const rows = await db.selectFrom("_emdash_seo").select("content_id").where("collection", "=", collection).where("content_id", "in", ids).where("seo_no_index", "=", 1).execute();
	return new Set(rows.map((r) => r.content_id));
}
/**
* Resolve hreflang alternates for a content entry.
*
* @example
* ```astro
* ---
* import { getHreflangAlternates } from "emdash";
*
* const alternates = await getHreflangAlternates("posts", entry.data.id, {
*   siteUrl: Astro.url.origin,
* });
* ---
* <head>
*   {alternates.map((a) => <link rel="alternate" hreflang={a.hreflang} href={a.href} />)}
* </head>
* ```
*/
async function getHreflangAlternates(collection, entryId, options = {}) {
	if (!isI18nEnabled()) return [];
	const key = `hreflang:${collection}:${entryId}:${options.siteUrl ?? ""}`;
	return requestCached(key, async () => {
		const { getDb } = await import("./loader_DNdroIRv.mjs");
		return getHreflangAlternatesWithDb(await getDb(), collection, entryId, options);
	});
}
/**
* Resolve hreflang alternates with an explicit db handle.
*
* @internal Use `getHreflangAlternates()` in templates. This variant is
* for routes/components that already have a database handle.
*/
async function getHreflangAlternatesWithDb(db, collection, entryId, options = {}) {
	if (!isI18nEnabled()) return [];
	let siteUrl = options.siteUrl;
	if (!siteUrl) siteUrl = (await getSiteSettingsWithDb(db)).url;
	if (!siteUrl || !ABSOLUTE_URL_RE.test(siteUrl)) return [];
	siteUrl = siteUrl.replace(TRAILING_SLASH_RE, "");
	const repo = new ContentRepository(db);
	const item = await repo.findByIdOrSlug(collection, entryId);
	if (!item) return [];
	const group = item.translationGroup || item.id;
	let variants = await repo.findTranslations(collection, group);
	if (variants.length === 0) variants = [item];
	let published = variants.filter((v) => v.status === "published");
	if (published.length === 0) return [];
	const noindexIds = await findNoindexIds(db, collection, published.map((v) => v.id));
	if (noindexIds.has(item.id)) return [];
	published = published.filter((v) => !noindexIds.has(v.id));
	const urlPattern = (await getCollectionInfoWithDb(db, collection))?.urlPattern ?? null;
	const resolved = [];
	for (const variant of published) {
		const locale = variant.locale || "en";
		const path = interpolateUrlPattern$1({
			pattern: urlPattern,
			collection,
			slug: variant.slug || variant.id,
			id: variant.id
		});
		const localized = await localizePath(path, locale);
		if (localized === null) continue;
		resolved.push({
			locale,
			href: `${siteUrl}${localized}`
		});
	}
	if (resolved.length === 0) return [];
	resolved.sort((a, b) => a.locale.localeCompare(b.locale));
	const alternates = resolved.map((r) => ({
		hreflang: r.locale,
		href: r.href
	}));
	const defaultLocale = getI18nConfig()?.defaultLocale;
	const xDefault = resolved.find((r) => r.locale === defaultLocale) ?? resolved[0];
	if (xDefault) alternates.push({
		hreflang: "x-default",
		href: xDefault.href
	});
	return alternates;
}
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/EmDashHead.astro
createAstro("https://astro.build");
var $$EmDashHead = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmDashHead;
	const { page } = Astro.props;
	const runtime = getPageRuntime(Astro.locals);
	let metadataHtml = "";
	let siteIdentityHtml = "";
	let fragmentsHtml = "";
	let jsonLdScripts = [];
	if (runtime) {
		const [siteSettings, pluginContributions, fragments] = await Promise.all([
			getSiteSettings$1(),
			runtime.collectPageMetadata(page),
			runtime.collectPageFragments(page)
		]);
		const baseContributions = generateBaseSeoContributions(page, absolutizeMediaUrl(siteSettings.seo?.defaultOgImage?.url, siteSettings.url, page));
		let hreflangContributions = [];
		if (page.content && isI18nEnabled()) {
			const siteUrl = page.siteUrl || siteSettings.url || new URL(page.url).origin;
			hreflangContributions = (await getHreflangAlternates(page.content.collection, page.content.id, { siteUrl })).map((a) => ({
				kind: "link",
				rel: "alternate",
				href: a.href,
				hreflang: a.hreflang
			}));
		}
		const siteContributions = generateSiteSeoContributions(siteSettings.seo);
		const resolved = resolvePageMetadata([
			...pluginContributions,
			...siteContributions,
			...baseContributions,
			...hreflangContributions
		]);
		jsonLdScripts = resolved.jsonld;
		metadataHtml = renderPageMetadata(resolved, { includeJsonLd: false });
		siteIdentityHtml = renderSiteIdentity({ favicon: siteSettings.favicon });
		fragmentsHtml = renderFragments(fragments, "head");
	} else {
		const resolved = resolvePageMetadata(generateBaseSeoContributions(page));
		jsonLdScripts = resolved.jsonld;
		metadataHtml = renderPageMetadata(resolved, { includeJsonLd: false });
	}
	await registerJsonLdCspHashes(config_default.astroCspEnabled === true, () => Astro.csp, jsonLdScripts);
	return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(metadataHtml)}` })}${jsonLdScripts.map(({ json }) => renderTemplate`${renderComponent($$result, "JsonLdScript", $$JsonLdScript, { "json": json })}`)}${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(siteIdentityHtml)}` })}${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(fragmentsHtml)}` })}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/EmDashHead.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/EmDashBodyStart.astro
createAstro("https://astro.build");
var $$EmDashBodyStart = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmDashBodyStart;
	const { page } = Astro.props;
	const runtime = getPageRuntime(Astro.locals);
	let html = "";
	if (runtime) html = renderFragments(await runtime.collectPageFragments(page), "body:start");
	return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(html)}` })}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/EmDashBodyStart.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/EmDashBodyEnd.astro
createAstro("https://astro.build");
var $$EmDashBodyEnd = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmDashBodyEnd;
	const { page } = Astro.props;
	const runtime = getPageRuntime(Astro.locals);
	let html = "";
	if (runtime) html = renderFragments(await runtime.collectPageFragments(page), "body:end");
	return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(html)}` })}`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/self-essentials/emdash-main/packages/core/src/components/EmDashBodyEnd.astro", void 0);
//#endregion
//#region self-essentials/emdash-main/packages/core/src/components/index.ts
/**
* Pre-configured components for EmDash Portable Text content
*
* Includes renderers for:
* - Block styles: paragraph, h1..h6, blockquote — with `textAlign` honoured
*   as a WordPress-style `has-text-align-{value}` class (#1201)
* - Block types: image, code, embed, gallery, columns, break, htmlBlock, table,
*   button, buttons, cover, file, pullquote
* - Marks: superscript, subscript, underline, strike-through, link
*/
var emdashComponents = {
	block: $$Block,
	type: {
		blockquoteGroup: $$BlockquoteGroup,
		image: $$Image,
		code: $$Code,
		embed: $$Embed,
		gallery: $$Gallery,
		columns: $$Columns,
		break: $$Break,
		htmlBlock: $$HtmlBlock,
		table: $$Table,
		button: $$Button,
		buttons: $$Buttons,
		cover: $$Cover,
		file: $$File,
		pullquote: $$Pullquote
	},
	mark: emdashMarkComponents
};
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/page/index.mjs
function isAstroInput(input) {
	return "Astro" in input;
}
function createPublicPageContext(input) {
	let url;
	let path;
	let locale;
	if (isAstroInput(input)) {
		url = input.Astro.url.href;
		path = input.Astro.url.pathname;
		locale = input.Astro.currentLocale ?? null;
	} else {
		const parsed = typeof input.url === "string" ? new URL(input.url) : input.url;
		url = parsed.href;
		path = parsed.pathname;
		locale = input.locale ?? null;
	}
	return {
		url,
		path,
		locale,
		kind: input.kind,
		pageType: input.pageType ?? (input.kind === "content" ? "article" : "website"),
		title: input.title ?? null,
		pageTitle: input.pageTitle ?? null,
		description: input.description ?? null,
		canonical: input.canonical ?? null,
		image: input.image ?? null,
		content: input.content ? {
			collection: input.content.collection,
			id: input.content.id,
			slug: input.content.slug ?? null
		} : void 0,
		seo: input.seo,
		articleMeta: input.articleMeta,
		siteName: input.siteName,
		breadcrumbs: input.breadcrumbs,
		siteUrl: input.siteUrl
	};
}
//#endregion
//#region src/layouts/Base.astro
createAstro("https://astro.build");
var $$Base = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Base;
	const { title, pageTitle, description, image, canonical, robots, type = "website", publishedTime, modifiedTime, author, content } = Astro.props;
	const { siteTitle, siteTagline, siteLogo } = resolveBlogSiteIdentity(await getSiteSettings());
	const fullTitle = title.includes(siteTitle) ? title : `${title} — ${siteTitle}`;
	const menu = await getMenu$1("primary");
	const socialMenu = await getMenu$1("social");
	const { entries: pages } = await getEmDashCollection("pages");
	const pageCtx = createPublicPageContext({
		Astro,
		kind: content ? "content" : "custom",
		pageType: type,
		title: fullTitle,
		pageTitle: pageTitle ?? title,
		description,
		canonical,
		image,
		content,
		seo: {
			ogImage: image,
			robots
		},
		articleMeta: {
			publishedTime,
			modifiedTime,
			author
		},
		siteName: siteTitle
	});
	const isLoggedIn = !!Astro.locals.user;
	return renderTemplate`<html lang="en" data-astro-cid-hkbrpulz><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-sans",
		"preload": true,
		"data-astro-cid-hkbrpulz": true
	})}${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-mono",
		"data-astro-cid-hkbrpulz": true
	})}<title>${fullTitle}</title>${renderComponent($$result, "EmDashHead", $$EmDashHead, {
		"page": pageCtx,
		"data-astro-cid-hkbrpulz": true
	})}<script>
			// Apply theme immediately to prevent flash
			(function () {
				var c = document.cookie;
				var i = c.indexOf("theme=");
				var theme = i >= 0 ? c.slice(i + 6).split(";")[0] : null;
				if (theme === "dark" || theme === "light") {
					document.documentElement.classList.add(theme);
				} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
					document.documentElement.classList.add("dark");
				}
			})();
		<\/script>${renderHead($$result)}</head><body data-astro-cid-hkbrpulz>${renderComponent($$result, "EmDashBodyStart", $$EmDashBodyStart, {
		"page": pageCtx,
		"data-astro-cid-hkbrpulz": true
	})}<header class="site-header" data-astro-cid-hkbrpulz><nav class="nav" data-astro-cid-hkbrpulz><a href="/" class="site-title" data-astro-cid-hkbrpulz>${siteLogo ? renderTemplate`<img${addAttribute(siteLogo.url, "src")}${addAttribute(siteLogo.alt || siteTitle, "alt")} class="site-logo-img" data-astro-cid-hkbrpulz>` : siteTitle}</a><div class="nav-right" data-astro-cid-hkbrpulz><button type="button" class="nav-search-btn" data-search-trigger aria-label="Search" data-astro-cid-hkbrpulz><svg class="nav-search-icon" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" data-astro-cid-hkbrpulz><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" data-astro-cid-hkbrpulz></path></svg><span data-astro-cid-hkbrpulz>Search</span><kbd class="nav-search-kbd" data-astro-cid-hkbrpulz>⌘K</kbd></button>${renderComponent($$result, "search-modal-snippet", "search-modal-snippet", {
		"id": "site-search",
		"api-url": "/api/ai-search",
		"placeholder": "Search…",
		"theme": "auto",
		"max-results": "30",
		"max-render-results": "10",
		"show-url": "true",
		"show-date": "true",
		"disable-analytics": "true",
		"data-astro-cid-hkbrpulz": true
	})}<div class="nav-links" data-astro-cid-hkbrpulz>${menu?.items.map((item) => renderTemplate`<a${addAttribute(item.url, "href")}${addAttribute(item.target, "target")} data-astro-cid-hkbrpulz>${item.label}</a>`)}</div>${isLoggedIn && renderTemplate`<a href="/_emdash/admin" class="nav-admin" data-astro-cid-hkbrpulz>Admin</a>`}</div></nav></header><main data-astro-cid-hkbrpulz>${renderSlot($$result, $$slots["default"])}</main><footer class="site-footer" data-astro-cid-hkbrpulz><div class="footer-inner" data-astro-cid-hkbrpulz><div class="footer-grid" data-astro-cid-hkbrpulz><div class="footer-brand" data-astro-cid-hkbrpulz><a href="/" class="footer-logo" data-astro-cid-hkbrpulz>${siteLogo ? renderTemplate`<img${addAttribute(siteLogo.url, "src")}${addAttribute(siteLogo.alt || siteTitle, "alt")} class="footer-logo-img" data-astro-cid-hkbrpulz>` : siteTitle}</a><p class="footer-tagline" data-astro-cid-hkbrpulz>${siteTagline}</p></div><div class="footer-nav" data-astro-cid-hkbrpulz><h4 class="footer-heading" data-astro-cid-hkbrpulz>Navigate</h4><ul class="footer-links" data-astro-cid-hkbrpulz><li data-astro-cid-hkbrpulz><a href="/" data-astro-cid-hkbrpulz>Home</a></li><li data-astro-cid-hkbrpulz><a href="/posts" data-astro-cid-hkbrpulz>All Posts</a></li>${pages.slice(0, 3).map((page) => renderTemplate`<li data-astro-cid-hkbrpulz><a${addAttribute(`/pages/${page.data.slug || page.id}`, "href")} data-astro-cid-hkbrpulz>${page.data.title}</a></li>`)}</ul></div><div class="footer-nav" data-astro-cid-hkbrpulz><h4 class="footer-heading" data-astro-cid-hkbrpulz>Connect</h4><ul class="footer-links" data-astro-cid-hkbrpulz>${socialMenu?.items.map((item) => renderTemplate`<li data-astro-cid-hkbrpulz><a${addAttribute(item.url, "href")}${addAttribute(item.target, "target")}${addAttribute(item.target === "_blank" ? "noopener noreferrer" : void 0, "rel")} data-astro-cid-hkbrpulz>${item.label}</a></li>`)}<li data-astro-cid-hkbrpulz><a href="/rss.xml" data-astro-cid-hkbrpulz>RSS Feed</a></li></ul></div><div class="footer-widgets-section" data-astro-cid-hkbrpulz>${renderComponent($$result, "WidgetArea", $$WidgetArea, {
		"name": "footer",
		"data-astro-cid-hkbrpulz": true
	})}</div></div><div class="footer-bottom" data-astro-cid-hkbrpulz><p class="footer-copyright" data-astro-cid-hkbrpulz>Powered by <a href="https://emdashcms.com" data-astro-cid-hkbrpulz>EmDash</a></p><div class="theme-switcher" data-astro-cid-hkbrpulz><button type="button" class="theme-btn" data-theme="light" aria-label="Light mode" data-astro-cid-hkbrpulz><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hkbrpulz><circle cx="12" cy="12" r="5" data-astro-cid-hkbrpulz></circle><line x1="12" y1="1" x2="12" y2="3" data-astro-cid-hkbrpulz></line><line x1="12" y1="21" x2="12" y2="23" data-astro-cid-hkbrpulz></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" data-astro-cid-hkbrpulz></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" data-astro-cid-hkbrpulz></line><line x1="1" y1="12" x2="3" y2="12" data-astro-cid-hkbrpulz></line><line x1="21" y1="12" x2="23" y2="12" data-astro-cid-hkbrpulz></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" data-astro-cid-hkbrpulz></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" data-astro-cid-hkbrpulz></line></svg></button><button type="button" class="theme-btn" data-theme="dark" aria-label="Dark mode" data-astro-cid-hkbrpulz><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hkbrpulz><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-astro-cid-hkbrpulz></path></svg></button><button type="button" class="theme-btn" data-theme="system" aria-label="System theme" data-astro-cid-hkbrpulz><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hkbrpulz><rect x="2" y="3" width="20" height="14" rx="2" ry="2" data-astro-cid-hkbrpulz></rect><line x1="8" y1="21" x2="16" y2="21" data-astro-cid-hkbrpulz></line><line x1="12" y1="17" x2="12" y2="21" data-astro-cid-hkbrpulz></line></svg></button></div></div></div></footer>${renderScript($$result, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/layouts/Base.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/layouts/Base.astro?astro&type=script&index=1&lang.ts")}${renderComponent($$result, "EmDashBodyEnd", $$EmDashBodyEnd, {
		"page": pageCtx,
		"data-astro-cid-hkbrpulz": true
	})}</body></html>`;
}, "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/src/layouts/Base.astro", void 0);
//#endregion
export { $$Comments as a, $$CommentForm as i, $$EmDashImage as n, $$PortableText as o, $$WidgetArea as r, renderScript as s, $$Base as t };
