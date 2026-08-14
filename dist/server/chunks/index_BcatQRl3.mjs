import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as ulid } from "./node_BucsvNi-.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { tt as createWidgetAreaBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as rowToWidget } from "./widgets-L-VndTKD_CdeTNh8j.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/index.mjs
var widget_areas_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const denied = requirePerm(user, "widgets:read");
	if (denied) return denied;
	try {
		const areas = await db.selectFrom("_emdash_widget_areas").selectAll().orderBy("name", "asc").execute();
		return apiSuccess({ items: await Promise.all(areas.map(async (area) => {
			const widgets = await db.selectFrom("_emdash_widgets").selectAll().$castTo().where("area_id", "=", area.id).orderBy("sort_order", "asc").execute();
			return {
				...area,
				widgets: widgets.map((row) => rowToWidget(row)),
				widgetCount: widgets.length
			};
		})) });
	} catch (error) {
		return handleError(error, "Failed to fetch widget areas", "WIDGET_AREA_LIST_ERROR");
	}
};
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const denied = requirePerm(user, "widgets:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createWidgetAreaBody);
		if (isParseError(body)) return body;
		if (await db.selectFrom("_emdash_widget_areas").select("id").where("name", "=", body.name).executeTakeFirst()) return apiError("CONFLICT", `Widget area with name "${body.name}" already exists`, 409);
		const id = ulid();
		await db.insertInto("_emdash_widget_areas").values({
			id,
			name: body.name,
			label: body.label,
			description: body.description ?? null
		}).execute();
		return apiSuccess(await db.selectFrom("_emdash_widget_areas").selectAll().where("id", "=", id).executeTakeFirstOrThrow(), 201);
	} catch (error) {
		return handleError(error, "Failed to create widget area", "WIDGET_AREA_CREATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/index@_@mjs
var page = () => widget_areas_exports;
//#endregion
export { page };
