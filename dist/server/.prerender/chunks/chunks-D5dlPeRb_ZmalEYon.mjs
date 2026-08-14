import { r as __exportAll } from "./runner-BsI18UgP_CTLRmh7U.mjs";
//#region self-essentials/emdash-main/packages/core/dist/chunks-D5dlPeRb.mjs
var chunks_exports = /* @__PURE__ */ __exportAll({
	SQL_BATCH_SIZE: () => 50,
	chunks: () => chunks
});
/**
* Split an array into chunks of at most `size` elements.
*
* Used to keep SQL `IN (?, ?, …)` clauses within Cloudflare D1's
* bound-parameter limit (~100 per statement).
*/
function chunks(arr, size) {
	if (arr.length === 0) return [];
	const result = [];
	for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
	return result;
}
//#endregion
export { chunks_exports as n, chunks as t };
