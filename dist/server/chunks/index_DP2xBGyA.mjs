import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { a as unwrapResult, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { a as getBackupSettings, l as runBackupToStorage } from "./backup-BTjSjBmr_CasaMkN4.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/index.mjs
var archives_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "backups:manage");
	if (denied) return denied;
	if (!emdash.storage) return apiError("STORAGE_NOT_CONFIGURED", "No storage backend is configured", 503);
	const settings = await getBackupSettings(emdash.db);
	return unwrapResult(await runBackupToStorage(emdash.db, emdash.storage, settings.retention), 201);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/index@_@mjs
var page = () => archives_exports;
//#endregion
export { page };
