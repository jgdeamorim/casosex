import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as ErrorCode } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { i as generateBackupJson, n as archiveNameForDate } from "./backup-BTjSjBmr_CasaMkN4.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/export.mjs
var export_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "backups:manage");
	if (denied) return denied;
	try {
		const json = await generateBackupJson(emdash.db);
		return new Response(json, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Content-Disposition": `attachment; filename="${archiveNameForDate(/* @__PURE__ */ new Date())}"`,
				"Cache-Control": "private, no-store",
				"X-Content-Type-Options": "nosniff"
			}
		});
	} catch (error) {
		return handleError(error, "Failed to generate backup", ErrorCode.BACKUP_EXPORT_ERROR);
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/export@_@mjs
var page = () => export_exports;
//#endregion
export { page };
