import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { i as Permissions } from "./dist_Lsl8Hpq0.mjs";
import { n as apiSuccess, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
import { t as requireScope } from "./scopes-Be2d8bSb_D78P5SWA.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs
var ____path__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PATCH: () => PATCH,
	POST: () => POST,
	PUT: () => PUT,
	prerender: () => false
});
/**
* Handle all methods by matching against plugin-defined routes
*/
var handleRequest = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const pluginId = params.pluginId;
	const path = params.path || "";
	const method = request.method.toUpperCase();
	if (!emdash?.handlePluginApiRoute) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const routeMeta = emdash.getPluginRouteMeta(pluginId, `/${path}`);
	if (!routeMeta) return apiError("NOT_FOUND", "Plugin route not found", 404);
	if (!routeMeta.public) {
		const permission = routeMeta.permission ?? "plugins:manage";
		if (!(permission in Permissions)) return apiError("INVALID_PLUGIN_ROUTE", "Plugin route declares an invalid permission", 500);
		const denied = requirePerm(user, permission);
		if (denied) return denied;
		const scopeError = requireScope(locals, "admin");
		if (scopeError) return scopeError;
		if (!locals.tokenScopes && request.headers.get("X-EmDash-Request") !== "1") return apiError("CSRF_REJECTED", "Missing required header", 403);
	}
	const result = await emdash.handlePluginApiRoute(pluginId, method, `/${path}`, request);
	if (!result.success) {
		const code = result.error?.code ?? "PLUGIN_ERROR";
		return apiError(code, code === "INTERNAL_ERROR" ? "Plugin route error" : result.error?.message ?? "Plugin route error", result.status ?? (code === "NOT_FOUND" ? 404 : 400));
	}
	const response = apiSuccess(result.data);
	if (routeMeta.cacheControl && (method === "GET" || method === "HEAD")) response.headers.set("Cache-Control", routeMeta.cacheControl);
	return response;
};
var GET = handleRequest;
var POST = handleRequest;
var PUT = handleRequest;
var PATCH = handleRequest;
var DELETE = handleRequest;
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/plugins/_pluginId_/_...path_@_@mjs
var page = () => ____path__exports;
//#endregion
export { page };
