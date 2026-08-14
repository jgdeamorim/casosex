import { AsyncLocalStorage } from "node:async_hooks";
//#region self-essentials/emdash-main/packages/core/src/request-context.ts
/**
* EmDash Request Context
*
* Uses AsyncLocalStorage to provide request-scoped state to query functions
* without requiring explicit parameter passing. The middleware wraps next()
* in als.run(), making the context available to all code during rendering.
*
* Middleware always wraps each request in a context so per-request
* metrics (db.*, cache.*) can be surfaced via Server-Timing. The cost is
* one ALS frame per request — sub-microsecond, negligible compared to
* any real work.
*
* The AsyncLocalStorage instance is stored on globalThis with a Symbol key
* to guarantee a singleton even when bundlers duplicate this module across
* code-split chunks. Without this, Rollup/Vite may inline the module into
* multiple chunks (e.g. middleware and page components), each with its own
* ALS instance — breaking request-scoped state propagation.
*/
var ALS_KEY = Symbol.for("emdash:request-context");
var storage = globalThis[ALS_KEY] ?? (() => {
	const als = new AsyncLocalStorage();
	globalThis[ALS_KEY] = als;
	return als;
})();
/**
* Get the current request context.
* Returns undefined if no context is set (logged-out fast path).
*/
function getRequestContext() {
	return storage.getStore();
}
//#endregion
export { getRequestContext as t };
