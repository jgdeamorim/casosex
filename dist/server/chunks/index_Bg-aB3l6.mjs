import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { _ as number, l as boolean, v as object } from "./schemas_CzTFUUcv.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as ErrorCode } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { a as unwrapResult, n as apiSuccess, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import { a as getBackupSettings, s as listBackupArchives, u as updateBackupSettings } from "./backup-BTjSjBmr_CasaMkN4.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/index.mjs
var backups_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	PUT: () => PUT,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "backups:manage");
	if (denied) return denied;
	try {
		const settings = await getBackupSettings(emdash.db);
		let archives = [];
		const storageAvailable = !!emdash.storage;
		if (emdash.storage) {
			const listed = await listBackupArchives(emdash.storage);
			if (listed.success) archives = listed.data;
		}
		return apiSuccess({
			settings,
			archives,
			storageAvailable
		});
	} catch (error) {
		return handleError(error, "Failed to load backup settings", ErrorCode.BACKUP_SETTINGS_READ_ERROR);
	}
};
var settingsBody = object({
	enabled: boolean(),
	retention: number().int().min(1).max(30)
});
var PUT = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "backups:manage");
	if (denied) return denied;
	const body = await parseBody(request, settingsBody);
	if (isParseError(body)) return body;
	return unwrapResult(await updateBackupSettings(emdash.db, body));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/index@_@mjs
var page = () => backups_exports;
//#endregion
export { page };
