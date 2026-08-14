//#region self-essentials/emdash-main/packages/core/dist/after-B1IIdH3Y.mjs
var waitUntilReady = (async () => {
	try {
		return (await import("./wait-until_DmvIcgN5.mjs")).waitUntil ?? null;
	} catch {
		return null;
	}
})();
waitUntilReady.catch(() => {});
/**
* Schedule `fn` to run without blocking the response.
*
* Errors are caught and logged — a deferred task should never surface
* as an unhandled rejection because the response is long gone. Callers
* that care about errors should handle them inside `fn`.
*/
function after(fn) {
	const promise = Promise.resolve().then(fn).catch((error) => {
		console.error("[emdash] deferred task failed:", error);
	});
	waitUntilReady.then((waitUntil) => {
		if (waitUntil) waitUntil(promise);
		return null;
	});
}
//#endregion
export { after as t };
