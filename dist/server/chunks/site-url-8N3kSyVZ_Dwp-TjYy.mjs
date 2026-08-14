import { t as OptionsRepository } from "./options-BlmBHTvX_UAvxM4cG.mjs";
//#region self-essentials/emdash-main/packages/core/dist/site-url-8N3kSyVZ.mjs
async function getSiteBaseUrl(db, request) {
	const storedUrl = await new OptionsRepository(db).get("emdash:site_url");
	if (storedUrl) return `${storedUrl}/_emdash`;
	const url = new URL(request.url);
	return `${url.protocol}//${url.host}/_emdash`;
}
//#endregion
export { getSiteBaseUrl as t };
