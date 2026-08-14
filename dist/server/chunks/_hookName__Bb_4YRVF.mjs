import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { C as string, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs
var _hookName__exports = /* @__PURE__ */ __exportAll({
	PUT: () => PUT,
	prerender: () => false
});
/** Hook name format: namespace:action (e.g., "content:beforeSave") */
var HOOK_NAME_RE = /^[a-z]+:[a-zA-Z]+$/;
var setSelectionSchema = object({ pluginId: string().min(1).nullable() });
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;
	const hookName = params.hookName;
	if (!hookName) return apiError("VALIDATION_ERROR", "Hook name is required", 400);
	if (!HOOK_NAME_RE.test(hookName)) return apiError("VALIDATION_ERROR", "Invalid hook name format", 400);
	try {
		const pipeline = emdash.hooks;
		if (!pipeline.isExclusiveHook(hookName)) return apiError("NOT_FOUND", `Hook '${hookName}' is not a registered exclusive hook`, 404);
		const body = await parseBody(request, setSelectionSchema);
		if (isParseError(body)) return body;
		const optionsRepo = new OptionsRepository(emdash.db);
		const optionKey = `emdash:exclusive_hook:${hookName}`;
		if (body.pluginId === null) {
			await optionsRepo.delete(optionKey);
			pipeline.clearExclusiveSelection(hookName);
		} else {
			if (!pipeline.getExclusiveHookProviders(hookName).some((p) => p.pluginId === body.pluginId)) return apiError("VALIDATION_ERROR", `Plugin '${body.pluginId}' is not a provider for hook '${hookName}'`, 400);
			await optionsRepo.set(optionKey, body.pluginId);
			pipeline.setExclusiveSelection(hookName, body.pluginId);
		}
		return apiSuccess({
			hookName,
			selectedPluginId: body.pluginId
		});
	} catch (error) {
		return handleError(error, "Failed to set exclusive hook selection", "EXCLUSIVE_HOOK_SET_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/_hookName_@_@mjs
var page = () => _hookName__exports;
//#endregion
export { page };
