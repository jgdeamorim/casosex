import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { r as VALID_SCOPES } from "./passkey_eKvnpHNN.mjs";
import { t as config_default } from "./config_DTEuujs6.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-authorization-server.mjs
var oauth_authorization_server_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const origin = getPublicOrigin(url, locals.emdash?.config ?? config_default);
	const issuer = `${origin}/_emdash`;
	return Response.json({
		issuer,
		authorization_endpoint: `${origin}/_emdash/oauth/authorize`,
		token_endpoint: `${origin}/_emdash/api/oauth/token`,
		scopes_supported: [...VALID_SCOPES],
		response_types_supported: ["code"],
		grant_types_supported: [
			"authorization_code",
			"refresh_token",
			"urn:ietf:params:oauth:grant-type:device_code"
		],
		code_challenge_methods_supported: ["S256"],
		registration_endpoint: `${origin}/_emdash/api/oauth/register`,
		token_endpoint_auth_methods_supported: ["none"],
		device_authorization_endpoint: `${origin}/_emdash/api/oauth/device/code`
	}, { headers: {
		"Cache-Control": "public, max-age=3600",
		"Access-Control-Allow-Origin": "*"
	} });
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-authorization-server@_@mjs
var page = () => oauth_authorization_server_exports;
//#endregion
export { page };
