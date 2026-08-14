import { r as __exportAll } from "./runner-BsI18UgP_CTLRmh7U.mjs";
//#region self-essentials/emdash-main/packages/core/dist/load-BwTdWE8B.mjs
var load_exports = /* @__PURE__ */ __exportAll({
	loadSeed: () => loadSeed,
	loadUserSeed: () => loadUserSeed
});
async function getSeedModule() {
	return import("./seed_CiNkAUWP.mjs");
}
/**
* Load the seed file (user seed or default).
*/
async function loadSeed() {
	const { seed } = await getSeedModule();
	return seed;
}
/**
* Load the user's seed file, or null if none exists.
*/
async function loadUserSeed() {
	const { userSeed } = await getSeedModule();
	return userSeed ?? null;
}
//#endregion
export { loadUserSeed as n, load_exports as r, loadSeed as t };
