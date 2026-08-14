import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as apiSuccess, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
//#region self-essentials/emdash-main/packages/core/dist/components-DZkL4Fx0.mjs
/**
* Core widget components registry
* These are built-in widgets that ship with EmDash
*/
var coreWidgetComponents = [
	{
		id: "core:recent-posts",
		label: "Recent Posts",
		description: "Display a list of recent posts",
		props: {
			count: {
				type: "number",
				label: "Number of posts",
				default: 5
			},
			showThumbnails: {
				type: "boolean",
				label: "Show thumbnails",
				default: false
			},
			showDate: {
				type: "boolean",
				label: "Show date",
				default: true
			}
		}
	},
	{
		id: "core:categories",
		label: "Categories",
		description: "Display category list",
		props: {
			showCount: {
				type: "boolean",
				label: "Show post count",
				default: true
			},
			hierarchical: {
				type: "boolean",
				label: "Show hierarchy",
				default: true
			}
		}
	},
	{
		id: "core:tags",
		label: "Tags",
		description: "Display tag cloud",
		props: {
			showCount: {
				type: "boolean",
				label: "Show count",
				default: false
			},
			limit: {
				type: "number",
				label: "Maximum tags",
				default: 20
			}
		}
	},
	{
		id: "core:search",
		label: "Search",
		description: "Search form",
		props: { placeholder: {
			type: "string",
			label: "Placeholder text",
			default: "Search..."
		} }
	},
	{
		id: "core:archives",
		label: "Archives",
		description: "Monthly/yearly archives",
		props: {
			type: {
				type: "select",
				label: "Group by",
				default: "monthly",
				options: [{
					value: "monthly",
					label: "Monthly"
				}, {
					value: "yearly",
					label: "Yearly"
				}]
			},
			limit: {
				type: "number",
				label: "Limit",
				default: 12
			}
		}
	}
];
/**
* Get all widget component definitions (core + plugin-registered)
* For now, only returns core components. Plugin widgets will be added later.
*/
function getWidgetComponents() {
	return [...coreWidgetComponents];
}
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-components.mjs
var widget_components_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	try {
		return apiSuccess({ items: getWidgetComponents() });
	} catch (error) {
		return handleError(error, "Failed to fetch widget components", "WIDGET_COMPONENTS_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-components@_@mjs
var page = () => widget_components_exports;
//#endregion
export { page };
