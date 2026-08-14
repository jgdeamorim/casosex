import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { nt as createWidgetBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as rowToWidget } from "./widgets-L-VndTKD_CdeTNh8j.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets.mjs
var widgets_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const { name } = params;
	const denied = requirePerm(user, "widgets:manage");
	if (denied) return denied;
	if (!name) return apiError("VALIDATION_ERROR", "name is required", 400);
	try {
		const area = await db.selectFrom("_emdash_widget_areas").select("id").where("name", "=", name).executeTakeFirst();
		if (!area) return apiError("NOT_FOUND", `Widget area "${name}" not found`, 404);
		const body = await parseBody(request, createWidgetBody);
		if (isParseError(body)) return body;
		const sortOrder = ((await db.selectFrom("_emdash_widgets").select(({ fn }) => fn.max("sort_order").as("maxOrder")).where("area_id", "=", area.id).executeTakeFirst())?.maxOrder ?? -1) + 1;
		const id = ulid();
		await db.insertInto("_emdash_widgets").values({
			id,
			area_id: area.id,
			sort_order: sortOrder,
			type: body.type,
			title: body.title ?? null,
			content: body.content ? JSON.stringify(body.content) : null,
			menu_name: body.menuName ?? null,
			component_id: body.componentId ?? null,
			component_props: body.componentProps ? JSON.stringify(body.componentProps) : null
		}).execute();
		return apiSuccess(rowToWidget(await db.selectFrom("_emdash_widgets").selectAll().$castTo().where("id", "=", id).executeTakeFirstOrThrow()), 201);
	} catch (error) {
		return handleError(error, "Failed to create widget", "WIDGET_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets@_@mjs
var page = () => widgets_exports;
//#endregion
export { page };
