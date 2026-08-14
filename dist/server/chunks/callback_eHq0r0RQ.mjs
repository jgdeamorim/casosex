import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { i as encodeBase64 } from "./base64-B-PsqheR_CqpGr57O.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/callback.mjs
var callback_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url, cookies, redirect }) => {
	const siteUrl = url.searchParams.get("site_url");
	const userLogin = url.searchParams.get("user_login");
	const password = url.searchParams.get("password");
	if (!siteUrl || !userLogin || !password) return redirect("/_emdash/admin/import/wordpress?error=auth_rejected");
	const token = encodeBase64(`${userLogin}:${password}`);
	const encodedAuth = encodeBase64(JSON.stringify({
		siteUrl,
		userLogin,
		token,
		timestamp: Date.now()
	}));
	cookies.set("emdash_wp_auth", encodedAuth, {
		path: "/_emdash/",
		maxAge: 300,
		httpOnly: false,
		secure: url.protocol === "https:",
		sameSite: "lax"
	});
	return redirect("/_emdash/admin/import/wordpress?auth=success");
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/callback@_@mjs
var page = () => callback_exports;
//#endregion
export { page };
