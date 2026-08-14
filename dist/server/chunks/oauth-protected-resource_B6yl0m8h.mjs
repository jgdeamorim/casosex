import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { r as VALID_SCOPES } from "./passkey_eKvnpHNN.mjs";
import { t as config_default } from "./config_DTEuujs6.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-protected-resource.mjs
var oauth_protected_resource_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url, locals }) => {
	const origin = getPublicOrigin(url, locals.emdash?.config ?? config_default);
	return Response.json({
		resource: `${origin}/_emdash/api/mcp`,
		authorization_servers: [`${origin}/_emdash`],
		scopes_supported: [...VALID_SCOPES],
		bearer_methods_supported: ["header"]
	}, { headers: {
		"Cache-Control": "public, max-age=3600",
		"Access-Control-Allow-Origin": "*"
	} });
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-protected-resource@_@mjs
var page = () => oauth_protected_resource_exports;
//#endregion
export { page };
