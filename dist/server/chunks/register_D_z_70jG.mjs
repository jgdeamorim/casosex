import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as handleOAuthClientCreate } from "./oauth-clients-BwTxE1aE_Bl65d5J5.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/register.mjs
var register_exports = /* @__PURE__ */ __exportAll({
	OPTIONS: () => OPTIONS,
	POST: () => POST,
	prerender: () => false
});
var OAUTH_REGISTRATION_HEADERS = {
	"Cache-Control": "no-store",
	Pragma: "no-cache",
	"Access-Control-Allow-Origin": "*"
};
var OAUTH_PREFLIGHT_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Access-Control-Max-Age": "86400"
};
var SUPPORTED_GRANT_TYPES = /* @__PURE__ */ new Set([
	"authorization_code",
	"refresh_token",
	"urn:ietf:params:oauth:grant-type:device_code"
]);
var SUPPORTED_RESPONSE_TYPES = /* @__PURE__ */ new Set(["code"]);
function registrationError(description, status = 400) {
	return Response.json({
		error: "invalid_client_metadata",
		error_description: description
	}, {
		status,
		headers: OAUTH_REGISTRATION_HEADERS
	});
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}
function parseScope(value) {
	if (value === void 0) return void 0;
	if (typeof value === "string") {
		const scopes = value.split(" ").filter(Boolean);
		return scopes.length > 0 ? scopes : void 0;
	}
	if (isStringArray(value)) {
		const scopes = value.filter(Boolean);
		return scopes.length > 0 ? scopes : void 0;
	}
	return registrationError("scope must be a string or array of strings");
}
function parseSupportedStringArray(value, field, supported) {
	if (value === void 0) return void 0;
	if (!isStringArray(value)) return registrationError(`${field} must be an array of strings`);
	const invalidValue = value.find((item) => !supported.has(item));
	if (invalidValue) return registrationError(`${field} contains unsupported value: ${invalidValue}`);
	return value;
}
var OPTIONS = () => {
	return new Response(null, {
		status: 204,
		headers: OAUTH_PREFLIGHT_HEADERS
	});
};
var POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		let body;
		try {
			body = await request.json();
		} catch {
			return registrationError("Request body must be valid JSON");
		}
		if (!isRecord(body)) return registrationError("Request body must be a JSON object");
		if (!isStringArray(body.redirect_uris) || body.redirect_uris.length === 0) return registrationError("redirect_uris must be a non-empty array of strings");
		if (body.token_endpoint_auth_method !== void 0 && body.token_endpoint_auth_method !== "none") return registrationError("Only token_endpoint_auth_method=none is supported");
		const grantTypes = parseSupportedStringArray(body.grant_types, "grant_types", SUPPORTED_GRANT_TYPES);
		if (grantTypes instanceof Response) return grantTypes;
		const responseTypes = parseSupportedStringArray(body.response_types, "response_types", SUPPORTED_RESPONSE_TYPES);
		if (responseTypes instanceof Response) return responseTypes;
		const scopes = parseScope(body.scope);
		if (scopes instanceof Response) return scopes;
		const clientId = crypto.randomUUID();
		const clientName = typeof body.client_name === "string" && body.client_name ? body.client_name : `dynamic-${clientId.slice(0, 8)}`;
		const result = await handleOAuthClientCreate(emdash.db, {
			id: clientId,
			name: clientName,
			redirectUris: body.redirect_uris,
			scopes
		});
		if (!result.success) return registrationError(result.error.message);
		return Response.json({
			client_id: result.data.id,
			client_id_issued_at: Math.floor(new Date(result.data.createdAt).getTime() / 1e3),
			redirect_uris: result.data.redirectUris,
			client_name: result.data.name,
			grant_types: grantTypes ?? ["authorization_code", "refresh_token"],
			response_types: responseTypes ?? ["code"],
			token_endpoint_auth_method: "none",
			scope: result.data.scopes ? result.data.scopes.join(" ") : void 0
		}, {
			status: 201,
			headers: OAUTH_REGISTRATION_HEADERS
		});
	} catch (error) {
		return handleError(error, "Failed to register OAuth client", "CLIENT_REGISTER_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/register@_@mjs
var page = () => register_exports;
//#endregion
export { page };
