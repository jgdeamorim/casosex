import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as MagicLinkError, y as verifyMagicLink } from "./dist_Lsl8Hpq0.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as createKyselyAdapter } from "./kysely_CgZkYw6d.mjs";
import { t as isSafeRedirect } from "./redirect-CDgfv9vh_Bn6Cqb8q.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/verify.mjs
var verify_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url, locals, session, redirect }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const token = url.searchParams.get("token");
	if (!token) return redirect("/_emdash/admin/login?error=missing_token");
	try {
		const adapter = createKyselyAdapter(emdash.db);
		const user = await verifyMagicLink(adapter, token);
		adapter.deleteExpiredTokens().catch(() => {});
		if (session) session.set("user", { id: user.id });
		const rawRedirect = url.searchParams.get("redirect");
		return redirect(isSafeRedirect(rawRedirect) ? rawRedirect : "/_emdash/admin");
	} catch (error) {
		console.error("Magic link verify error:", error);
		if (error instanceof MagicLinkError) switch (error.code) {
			case "invalid_token": return redirect("/_emdash/admin/login?error=invalid_link");
			case "token_expired": return redirect("/_emdash/admin/login?error=link_expired");
			case "user_not_found": return redirect("/_emdash/admin/login?error=user_not_found");
		}
		return redirect("/_emdash/admin/login?error=verification_failed");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/verify@_@mjs
var page = () => verify_exports;
//#endregion
export { page };
