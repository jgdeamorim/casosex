import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import { i as runMigrations } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
import "./content-CpfKV9QE_DeIsRghk.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./taxonomy-DvwWAPvA_9icPwnll.mjs";
import "./content-refresh-DgqUBeTv_rkjORcMb.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import "./ssrf-CviKqWmq_Bm-KV_Vo.mjs";
import { _ as setupBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import "./redirect-BJ6d1yHh_Bhxbmzv-.mjs";
import "./byline-registry-BCuOp4UF_B00NrJCq.mjs";
import "./field-defs-cache-QMVnzTH6_BMcV50fT.mjs";
import "./byline-C5TAqs8N_UXuC5WkK.mjs";
import "./fts-manager-vncsZIJm_B2PuZ3wM.mjs";
import "./registry-BP1JK2xh_C4nDpLUe.mjs";
import { n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { t as validateSeed } from "./validate-Bs_wT2ul_BPxJkgx-.mjs";
import { t as applySeed } from "./apply-1_6ra7NP_C-N_rG76.mjs";
import { t as loadSeed } from "./load-BwTdWE8B_DBSeomMw.mjs";
import { t as getAuthMode } from "./mode-fiXRMfeA_C0CvJuAB.mjs";
import { n as getPublicOrigin } from "./public-url-DSGTnJFw_DEONbqkZ.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/index.mjs
var setup_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, url, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		try {
			const setupComplete = await new OptionsRepository(emdash.db).get("emdash:setup_complete");
			if (setupComplete === true || setupComplete === "true") return apiError("ALREADY_CONFIGURED", "Setup has already been completed", 409);
		} catch {}
		const body = await parseBody(request, setupBody);
		if (isParseError(body)) return body;
		try {
			await runMigrations(emdash.db);
		} catch (error) {
			return handleError(error, "Failed to run database migrations", "MIGRATION_ERROR");
		}
		const seed = await loadSeed();
		seed.settings = {
			...seed.settings,
			title: body.title,
			tagline: body.tagline
		};
		const validation = validateSeed(seed);
		if (!validation.valid) return apiError("INVALID_SEED", `Invalid seed file: ${validation.errors.join(", ")}`, 400);
		let result;
		try {
			result = await applySeed(emdash.db, seed, {
				includeContent: body.includeContent,
				onConflict: "skip",
				storage: emdash.storage ?? void 0
			});
		} catch (error) {
			return handleError(error, "Failed to apply seed", "SEED_ERROR");
		}
		const useExternalAuth = getAuthMode(emdash.config).type === "external";
		try {
			const options = new OptionsRepository(emdash.db);
			const siteUrl = getPublicOrigin(url, emdash.config);
			await options.setIfAbsent("emdash:site_url", siteUrl);
			if (useExternalAuth) {
				await options.set("emdash:setup_complete", true);
				await options.set("emdash:site_title", body.title);
				if (body.tagline) await options.set("emdash:site_tagline", body.tagline);
			} else await options.set("emdash:setup_state", {
				step: "site_complete",
				title: body.title,
				tagline: body.tagline
			});
		} catch (error) {
			console.error("Failed to save setup state:", error);
		}
		return apiSuccess({
			success: true,
			setupComplete: useExternalAuth,
			result
		});
	} catch (error) {
		return handleError(error, "Setup failed", "SETUP_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/index@_@mjs
var page = () => setup_exports;
//#endregion
export { page };
