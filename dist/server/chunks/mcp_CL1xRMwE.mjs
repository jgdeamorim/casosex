import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { l as boolean, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as PluginStateRepository } from "./state-xxv6ZTMv_CY4fwMam.mjs";
import { n as apiSuccess, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/mcp.mjs
var mcp_exports = /* @__PURE__ */ __exportAll({
	PUT: () => PUT,
	prerender: () => false
});
var bodySchema = object({ enabled: boolean() });
var PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:manage");
	if (denied) return denied;
	if (!params.id) return apiError("INVALID_REQUEST", "Plugin ID required", 400);
	const parsed = await parseBody(request, bodySchema);
	if (parsed instanceof Response) return parsed;
	const tools = await emdash.getPluginMcpTools(params.id);
	if (parsed.enabled && tools.length === 0) return apiError("NO_MCP_TOOLS", "Plugin does not declare MCP tools", 400);
	const stateRepo = new PluginStateRepository(emdash.db);
	const existing = await stateRepo.get(params.id);
	const configuredVersion = emdash.configuredPlugins.find((plugin) => plugin.id === params.id)?.version ?? emdash.sandboxedPluginEntries.find((plugin) => plugin.id === params.id)?.version;
	const version = existing?.version ?? configuredVersion;
	if (!version) return apiError("NOT_FOUND", "Plugin not found", 404);
	const consent = parsed.enabled ? emdash.serializePluginMcpConsent(tools, params.id) : null;
	return apiSuccess({
		enabled: (await stateRepo.upsert(params.id, version, existing?.status ?? "active", {
			mcpToolsEnabled: parsed.enabled,
			mcpToolsConsent: consent
		})).mcpToolsEnabled,
		tools: tools.map(({ inputSchema: _, outputSchema: __, ...tool }) => tool)
	});
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/mcp@_@mjs
var page = () => mcp_exports;
//#endregion
export { page };
