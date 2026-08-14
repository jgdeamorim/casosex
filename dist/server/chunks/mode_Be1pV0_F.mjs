import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { n as apiSuccess } from "./error-DmmN74gW_Djmejxxh.mjs";
import { t as getAuthMode } from "./mode-fiXRMfeA_C0CvJuAB.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/mode.mjs
var mode_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash } = locals;
	const authMode = getAuthMode(emdash?.config);
	let signupEnabled = false;
	if (emdash?.db && authMode.type === "passkey") try {
		const { sql } = await import("./dist_DkjEvZSb.mjs");
		const result = await sql`
				SELECT COUNT(*) as cnt FROM allowed_domains WHERE enabled = 1
			`.execute(emdash.db);
		signupEnabled = Number(result.rows[0]?.cnt ?? 0) > 0;
	} catch {}
	const providers = (emdash?.config?.authProviders ?? []).map((p) => ({
		id: p.id,
		label: p.label
	}));
	return apiSuccess({
		authMode: authMode.type === "external" ? authMode.providerType : "passkey",
		signupEnabled,
		providers
	});
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/mode@_@mjs
var page = () => mode_exports;
//#endregion
export { page };
