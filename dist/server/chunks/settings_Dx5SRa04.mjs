import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./after-B1IIdH3Y_D2PBgJNO.mjs";
import "./object-cache-Bok5j2ae_D6Qn5mkk.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import "./media-tQDZEdu7_D9hYcuMC.mjs";
import "./request-cache-BSUptuJR_D0VqgZlt.mjs";
import "./loader-C1XOLV5b_C3i6HyEe.mjs";
import "./settings-DgKouY2S_DP0zmLXj.mjs";
import { _t as settingsUpdateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { n as handleSettingsUpdate, t as handleSettingsGet } from "./settings-CREKyj8I_sz1CfsBP.mjs";
import { a as unwrapResult, r as handleError, t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import { n as parseBody, t as isParseError } from "./parse-BL49yb9D_DEZsBUX3.mjs";
import "./schemas_CKWG3bd1.mjs";
import { r as requirePerm } from "./authorize-R5iYYrpa_Cy7kmN6L.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings.mjs
var settings_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
/**
* GET /_emdash/api/settings
*
* Returns all site settings as a JSON object.
* Unset values are undefined. Media references include resolved URLs.
*/
var GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:read");
	if (denied) return denied;
	try {
		return unwrapResult(await handleSettingsGet(emdash.db, emdash.storage));
	} catch (error) {
		return handleError(error, "Failed to get settings", "SETTINGS_READ_ERROR");
	}
};
/**
* POST /_emdash/api/settings
*
* Updates site settings. Accepts a partial settings object.
* Merges with existing settings and returns the updated settings.
*/
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, settingsUpdateBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleSettingsUpdate(emdash.db, emdash.storage, body));
	} catch (error) {
		return handleError(error, "Failed to update settings", "SETTINGS_UPDATE_ERROR");
	}
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings@_@mjs
var page = () => settings_exports;
//#endregion
export { page };
