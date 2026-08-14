import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as rowToWidget } from "./widgets-L-VndTKD_CdeTNh8j.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_.mjs
var _name__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const { name } = params;
	const denied = requirePerm(user, "widgets:read");
	if (denied) return denied;
	if (!name) return apiError("VALIDATION_ERROR", "name is required", 400);
	try {
		const area = await db.selectFrom("_emdash_widget_areas").selectAll().where("name", "=", name).executeTakeFirst();
		if (!area) return apiError("NOT_FOUND", `Widget area "${name}" not found`, 404);
		const widgets = await db.selectFrom("_emdash_widgets").selectAll().$castTo().where("area_id", "=", area.id).orderBy("sort_order", "asc").execute();
		return apiSuccess({
			...area,
			widgets: widgets.map((row) => rowToWidget(row))
		});
	} catch (error) {
		return handleError(error, "Failed to fetch widget area", "WIDGET_AREA_GET_ERROR");
	}
};
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const { name } = params;
	const denied = requirePerm(user, "widgets:manage");
	if (denied) return denied;
	if (!name) return apiError("VALIDATION_ERROR", "name is required", 400);
	try {
		const area = await db.selectFrom("_emdash_widget_areas").select("id").where("name", "=", name).executeTakeFirst();
		if (!area) return apiError("NOT_FOUND", `Widget area "${name}" not found`, 404);
		await db.deleteFrom("_emdash_widget_areas").where("id", "=", area.id).execute();
		return apiSuccess({ deleted: true });
	} catch (error) {
		return handleError(error, "Failed to delete widget area", "WIDGET_AREA_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_@_@mjs
var page = () => _name__exports;
//#endregion
export { page };
