import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import { n as apiSuccess, r as handleError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as VERSION, t as COMMIT } from "./version-BGLOkzgk_9sZYHkOK.mjs";
import { t as getAuthMode } from "./mode-fiXRMfeA_C0CvJuAB.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/manifest.mjs
var manifest_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash } = locals;
	try {
		const emdashManifest = emdash ? await emdash.getManifest() : null;
		const authMode = getAuthMode(emdash?.config);
		let adminBranding = emdash?.config?.admin;
		if (!adminBranding?.siteName && emdash?.db) try {
			const titles = await new OptionsRepository(emdash.db).getMany(["site:title", "emdash:site_title"]);
			const siteTitle = titles.get("site:title") || titles.get("emdash:site_title");
			if (siteTitle) adminBranding = {
				...adminBranding,
				siteName: siteTitle
			};
		} catch {}
		let signupEnabled = false;
		if (emdash?.db && authMode.type === "passkey") try {
			const { sql } = await import("./dist_DkjEvZSb.mjs");
			const result = await sql`
					SELECT COUNT(*) as cnt FROM allowed_domains WHERE enabled = 1
				`.execute(emdash.db);
			signupEnabled = Number(result.rows[0]?.cnt ?? 0) > 0;
		} catch {}
		return apiSuccess(emdashManifest ? {
			...emdashManifest,
			authMode: authMode.type === "external" ? authMode.providerType : "passkey",
			signupEnabled,
			admin: adminBranding
		} : {
			version: VERSION,
			commit: COMMIT,
			hash: "default",
			collections: {},
			plugins: {},
			taxonomies: [],
			authMode: "passkey",
			signupEnabled,
			admin: adminBranding
		});
	} catch (error) {
		return handleError(error, "Failed to build manifest", "MANIFEST_BUILD_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/manifest@_@mjs
var page = () => manifest_exports;
//#endregion
export { page };
