import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as apiSuccess, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as isSafeRedirect } from "./redirect-CDgfv9vh_Bn6Cqb8q.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/logout.mjs
var logout_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ session, url }) => {
	try {
		if (session) session.destroy();
		const redirect = url.searchParams.get("redirect");
		if (isSafeRedirect(redirect)) return new Response(null, {
			status: 302,
			headers: { Location: redirect }
		});
		return apiSuccess({
			success: true,
			message: "Logged out successfully"
		});
	} catch (error) {
		return handleError(error, "Logout failed", "LOGOUT_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/logout@_@mjs
var page = () => logout_exports;
//#endregion
export { page };
