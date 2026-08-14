import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { Et as updateWidgetBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { n as rowToWidget } from "./widgets-L-VndTKD_CdeTNh8j.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	PUT: () => PUT,
	prerender: () => false
});
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const { name, id } = params;
	const denied = requirePerm(user, "widgets:manage");
	if (denied) return denied;
	if (!name || !id) return apiError("VALIDATION_ERROR", "name and id are required", 400);
	try {
		const area = await db.selectFrom("_emdash_widget_areas").select("id").where("name", "=", name).executeTakeFirst();
		if (!area) return apiError("NOT_FOUND", `Widget area "${name}" not found`, 404);
		if (!await db.selectFrom("_emdash_widgets").select("id").where("id", "=", id).where("area_id", "=", area.id).executeTakeFirst()) return apiError("NOT_FOUND", `Widget "${id}" not found in area "${name}"`, 404);
		const body = await parseBody(request, updateWidgetBody);
		if (isParseError(body)) return body;
		const updates = {};
		if (body.title !== void 0) updates.title = body.title || null;
		if (body.type !== void 0) updates.type = body.type;
		if (body.content !== void 0) updates.content = body.content ? JSON.stringify(body.content) : null;
		if (body.menuName !== void 0) updates.menu_name = body.menuName || null;
		if (body.componentId !== void 0) updates.component_id = body.componentId || null;
		if (body.componentProps !== void 0) updates.component_props = body.componentProps ? JSON.stringify(body.componentProps) : null;
		if (Object.keys(updates).length === 0) return apiError("VALIDATION_ERROR", "No fields to update", 400);
		await db.updateTable("_emdash_widgets").set(updates).where("id", "=", id).execute();
		return apiSuccess(rowToWidget(await db.selectFrom("_emdash_widgets").selectAll().$castTo().where("id", "=", id).executeTakeFirstOrThrow()));
	} catch (error) {
		return handleError(error, "Failed to update widget", "WIDGET_UPDATE_ERROR");
	}
};
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const { name, id } = params;
	const denied = requirePerm(user, "widgets:manage");
	if (denied) return denied;
	if (!name || !id) return apiError("VALIDATION_ERROR", "name and id are required", 400);
	try {
		const area = await db.selectFrom("_emdash_widget_areas").select("id").where("name", "=", name).executeTakeFirst();
		if (!area) return apiError("NOT_FOUND", `Widget area "${name}" not found`, 404);
		if (!await db.selectFrom("_emdash_widgets").select("id").where("id", "=", id).where("area_id", "=", area.id).executeTakeFirst()) return apiError("NOT_FOUND", `Widget "${id}" not found in area "${name}"`, 404);
		await db.deleteFrom("_emdash_widgets").where("id", "=", id).execute();
		return apiSuccess({ deleted: true });
	} catch (error) {
		return handleError(error, "Failed to delete widget", "WIDGET_DELETE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets/_id_@_@mjs
var page = () => _id__exports;
//#endregion
export { page };
