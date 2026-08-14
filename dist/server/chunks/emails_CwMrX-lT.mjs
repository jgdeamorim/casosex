import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./email-console-C-9Ng8DM_BLDmwlIU.mjs";
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/dev/emails.mjs
var emails_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	return apiError("FORBIDDEN", "Dev emails endpoint is only available in development mode", 403);
};
var DELETE = async () => {
	return apiError("FORBIDDEN", "Dev emails endpoint is only available in development mode", 403);
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/dev/emails@_@mjs
var page = () => emails_exports;
//#endregion
export { page };
