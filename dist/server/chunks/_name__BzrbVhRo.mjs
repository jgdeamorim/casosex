import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as ErrorCode } from "./errors-DtEXIQQV_DXdZZdDL.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { o as isValidArchiveName, r as deleteBackupArchive, t as BACKUP_STORAGE_PREFIX } from "./backup-BTjSjBmr_CasaMkN4.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/_name_.mjs
var _name__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const name = params.name ?? "";
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "backups:manage");
	if (denied) return denied;
	if (!emdash.storage) return apiError("STORAGE_NOT_CONFIGURED", "No storage backend is configured", 503);
	if (!isValidArchiveName(name)) return apiError("VALIDATION_ERROR", "Invalid archive name", 400);
	try {
		const result = await emdash.storage.download(`${BACKUP_STORAGE_PREFIX}${name}`);
		return new Response(result.body, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Content-Disposition": `attachment; filename="${name}"`,
				"Cache-Control": "private, no-store",
				"X-Content-Type-Options": "nosniff"
			}
		});
	} catch (error) {
		if (error instanceof Error && error.message.toLowerCase().includes("not found")) return apiError("NOT_FOUND", "Archive not found", 404);
		return handleError(error, "Failed to download archive", ErrorCode.BACKUP_DOWNLOAD_ERROR);
	}
};
var DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const name = params.name ?? "";
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "backups:manage");
	if (denied) return denied;
	if (!emdash.storage) return apiError("STORAGE_NOT_CONFIGURED", "No storage backend is configured", 503);
	return unwrapResult(await deleteBackupArchive(emdash.storage, name));
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/_name_@_@mjs
var page = () => _name__exports;
//#endregion
export { page };
