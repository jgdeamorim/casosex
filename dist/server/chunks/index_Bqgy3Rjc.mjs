import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/index.mjs
var exclusive_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;
	try {
		const pipeline = emdash.hooks;
		const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();
		const optionsRepo = new OptionsRepository(emdash.db);
		const hooks = [];
		for (const hookName of exclusiveHookNames) {
			const providers = pipeline.getExclusiveHookProviders(hookName);
			const selection = await optionsRepo.get(`emdash:exclusive_hook:${hookName}`);
			hooks.push({
				hookName,
				providers: providers.map((provider) => ({ pluginId: provider.pluginId })),
				selectedPluginId: selection
			});
		}
		return apiSuccess({ items: hooks });
	} catch (error) {
		return handleError(error, "Failed to list exclusive hooks", "EXCLUSIVE_HOOKS_LIST_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/index@_@mjs
var page = () => exclusive_exports;
//#endregion
export { page };
