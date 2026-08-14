import { r as __exportAll } from "./runner-BsI18UgP_DY3LBvkk.mjs";
import { i as setSiteSettings, n as getSiteSettingsWithDb } from "./settings-DgKouY2S_DP0zmLXj.mjs";
//#region self-essentials/emdash-main/packages/core/dist/settings-CREKyj8I.mjs
var settings_exports = /* @__PURE__ */ __exportAll({
	handleSettingsGet: () => handleSettingsGet,
	handleSettingsUpdate: () => handleSettingsUpdate
});
/**
* Get all site settings
*/
async function handleSettingsGet(db, storage) {
	try {
		return {
			success: true,
			data: await getSiteSettingsWithDb(db, storage)
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SETTINGS_READ_ERROR",
				message: "Failed to get settings"
			}
		};
	}
}
/**
* Update site settings
*/
async function handleSettingsUpdate(db, storage, input) {
	try {
		await setSiteSettings(input, db);
		return {
			success: true,
			data: await getSiteSettingsWithDb(db, storage)
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SETTINGS_UPDATE_ERROR",
				message: "Failed to update settings"
			}
		};
	}
}
//#endregion
export { handleSettingsUpdate as n, settings_exports as r, handleSettingsGet as t };
