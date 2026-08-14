import { o as __toESM, t as __commonJSMin } from "./rolldown-runtime_BMI-E3GI.mjs";
import { A as ASTRO_GENERATOR, B as responseSentSymbol$1, D as isRoute500, E as isRoute404, F as clientAddressSymbol, I as fetchStateSymbol, M as REDIRECT_STATUS_CODES, N as REROUTABLE_STATUS_CODES, O as escape, P as appSymbol, R as originPathnameSymbol, V as s, b as normalizeCspResourceEntry, f as decodeKey, k as ASTRO_ERROR_HEADER, m as generateCspDigest, n as renderPage, w as renderEndpoint, x as pushDirective, z as pipelineSymbol } from "./server_Lac7W6ZE.mjs";
import { a as fileExtension, f as removeLeadingForwardSlash, h as slash, i as collapseDuplicateTrailingSlashes, l as joinPaths, m as removeTrailingForwardSlash, n as collapseDuplicateLeadingSlashes, o as hasFileExtension, r as collapseDuplicateSlashes, s as isInternalPath, t as appendForwardSlash, u as prependForwardSlash } from "./path_CsjwVQRw.mjs";
import { a as encode64, c as stringify_string, i as merge_operations, n as unflatten$1, o as DevalueError, r as default_stringify_operations, s as stringify_key, t as parse } from "./parse_DN83ZD-A.mjs";
import { C as NOOP_MIDDLEWARE_FN, D as levels, E as getEventPrefix, M as readBodyWithLimit, N as shouldAppendForwardSlash, O as createCrossOriginForbiddenResponse, S as validateAndDecodePathname, T as AstroLogger, _ as copyRequest, a as routeComparator, b as setOriginPathname, c as getCustom404Route, d as routeIsFallback, f as routeIsRedirect, g as sequence, h as RedirectSinglePageBuiltModule, i as PipelineFeatures, j as BodySizeLimitError, k as isForbiddenCrossOriginRequest, l as getFallbackRoute, m as getRouteGenerator, n as ALL_PIPELINE_FEATURES, o as getParams, p as SERVER_ISLAND_COMPONENT, r as Pipeline, s as getProps, t as Slots, u as routeHasHtmlExtension, v as findRouteToRewrite, w as AstroIntegrationLogger, x as MultiLevelEncodingError, y as getOriginPathname } from "./render_DtM3lYxL.mjs";
import { A as MiddlewareNotAResponse, D as LocalsNotAnObject, H as PrerenderClientAddressNotAvailable, J as SessionStorageInitError, K as ResponseSentError, O as LocalsReassigned, X as StaticClientAddressNotAvailable, Y as SessionStorageSaveError, a as CacheNotEnabled, i as AstroResponseHeadersReassigned, k as MiddlewareNoDataOrNextCalled, m as ForbiddenRewrite, n as ActionNotFoundError, o as ClientAddressNotAvailable, r as ActionsReturnedInvalidDataError, t as AstroError, tt as i18nNoLocaleFoundInPath } from "./errors_CPRp8csy.mjs";
import { n as matchPattern } from "./remote_Df8tYpvm.mjs";
import React, { createElement, memo } from "react";
import ReactDOM from "react-dom/server";
//#region node_modules/.pnpm/devalue@5.9.0/node_modules/devalue/src/stringify.js
/**
* Turn a value into a JSON string that can be parsed with `devalue.parse`
* @param {any} value
* @param {Record<string, (value: any) => any>} [reducers]
* @param {import('./types.js').StringifyOptions} [options]
*/
function stringify$2(value, reducers, options) {
	const stringified = run(false, value, reducers, options);
	return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
/**
* @param {boolean} async
* @param {any} value
* @param {Record<string, (value: any) => any>} [reducers]
* @param {import('./types.js').StringifyOptions} [options]
*/
function run(async, value, reducers, options) {
	const ops = merge_operations(default_stringify_operations, options?.operations);
	/** @type {any[]} */
	const stringified = [];
	/** @type {Map<any, number>} */
	const indexes = /* @__PURE__ */ new Map();
	/** @type {Array<{ key: string, fn: (value: any) => any }>} */
	const custom = [];
	if (reducers) for (const key of Object.getOwnPropertyNames(reducers)) custom.push({
		key,
		fn: reducers[key]
	});
	/** @type {string[]} */
	const keys = [];
	let p = 0;
	/**
	* @param {any} thing
	* @param {number} [index]
	*/
	function flatten(thing, index) {
		const type = ops.typeOf(thing);
		if (type === "undefined") return -1;
		/** @type {number | undefined} */
		let number;
		if (type === "number") {
			number = ops.toPrimitive(thing);
			if (Number.isNaN(number)) return -3;
			if (number === Infinity) return -4;
			if (number === -Infinity) return -5;
			if (number === 0 && 1 / number < 0) return -6;
		}
		const id = ops.identify(thing);
		if (indexes.has(id)) return indexes.get(id);
		index ??= p++;
		indexes.set(id, index);
		for (const { key, fn } of custom) {
			const value = fn(thing);
			if (value) {
				stringified[index] = `["${key}",${flatten(value)}]`;
				return index;
			}
		}
		if (type === "function") throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
		else if (type === "symbol") throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
		/** @type {string | Promise<any>} */
		let str = "";
		if (type !== "object") str = stringify_primitive(type === "number" ? number : ops.toPrimitive(thing));
		else if (ops.isThenable(thing)) {
			if (!async) throw new DevalueError(`Cannot stringify a Promise or thenable — use stringifyAsync instead`, keys, thing, value);
			str = ops.toPromise(thing).then((value) => {
				const i = flatten(value, index);
				if (i < 0) stringified[index] = i;
			});
		} else {
			const tag = ops.tagOf(thing);
			switch (tag) {
				case "Number":
				case "String":
				case "Boolean":
				case "BigInt":
					str = `["Object",${flatten(ops.unbox(thing))}]`;
					break;
				case "Date":
					str = `["Date","${ops.toISOString(thing)}"]`;
					break;
				case "URL":
					str = `["URL",${stringify_string(ops.toStringValue(thing))}]`;
					break;
				case "URLSearchParams":
					str = `["URLSearchParams",${stringify_string(ops.toStringValue(thing))}]`;
					break;
				case "RegExp":
					const { source, flags } = ops.regExpInfo(thing);
					str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
					break;
				case "Array": {
					let mostly_dense = false;
					const length = ops.lengthOf(thing);
					str = "[";
					for (let i = 0; i < length; i += 1) {
						if (i > 0) str += ",";
						if (ops.hasOwn(thing, i)) {
							keys.push(`[${i}]`);
							str += flatten(ops.get(thing, i));
							keys.pop();
						} else if (mostly_dense) str += -2;
						else {
							const populated_keys = ops.indicesOf(thing);
							const population = populated_keys.length;
							const d = String(length).length;
							if ((length - population) * 3 > 4 + d + population * (d + 1)) {
								str = "[-7," + length;
								for (let j = 0; j < populated_keys.length; j++) {
									const key = populated_keys[j];
									keys.push(`[${key}]`);
									str += "," + key + "," + flatten(ops.get(thing, key));
									keys.pop();
								}
								break;
							} else {
								mostly_dense = true;
								str += -2;
							}
						}
					}
					str += "]";
					break;
				}
				case "Set":
					str = "[\"Set\"";
					for (const value of ops.valuesOf(thing)) str += `,${flatten(value)}`;
					str += "]";
					break;
				case "Map":
					str = "[\"Map\"";
					for (const [key, value] of ops.entriesOf(thing)) {
						const key_type = ops.typeOf(key);
						const key_is_primitive = key_type !== "object" && key_type !== "function" && key_type !== "symbol";
						keys.push(`.get(${key_is_primitive ? stringify_primitive(ops.toPrimitive(key)) : "..."})`);
						str += `,${flatten(key)},${flatten(value)}`;
						keys.pop();
					}
					str += "]";
					break;
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array": {
					const info = ops.viewInfo(thing);
					str = "[\"" + tag + "\"," + flatten(info.buffer);
					if (info.byteLength !== info.bufferByteLength) str += `,${info.byteOffset},${info.length}`;
					str += "]";
					break;
				}
				case "DataView": {
					const info = ops.viewInfo(thing);
					str = "[\"" + tag + "\"," + flatten(info.buffer);
					if (info.byteLength !== info.bufferByteLength) str += `,${info.byteOffset},${info.byteLength}`;
					str += "]";
					break;
				}
				case "ArrayBuffer":
					str = `["ArrayBuffer","${encode64(ops.toArrayBuffer(thing))}"]`;
					break;
				case "Temporal.Duration":
				case "Temporal.Instant":
				case "Temporal.PlainDate":
				case "Temporal.PlainTime":
				case "Temporal.PlainDateTime":
				case "Temporal.PlainMonthDay":
				case "Temporal.PlainYearMonth":
				case "Temporal.ZonedDateTime":
					str = `["${tag}",${stringify_string(ops.toStringValue(thing))}]`;
					break;
				default: {
					const shape = ops.shapeOf(thing);
					if (shape.kind === "not-plain") throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
					if (shape.kind === "symbol-keys") throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
					if (shape.kind === "null-proto") {
						str = "[\"null\"";
						for (const key of shape.keys) {
							if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
							keys.push(stringify_key(key));
							str += `,${stringify_string(key)},${flatten(ops.get(thing, key))}`;
							keys.pop();
						}
						str += "]";
					} else {
						str = "{";
						let started = false;
						for (const key of shape.keys) {
							if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
							if (started) str += ",";
							started = true;
							keys.push(stringify_key(key));
							str += `${stringify_string(key)}:${flatten(ops.get(thing, key))}`;
							keys.pop();
						}
						str += "}";
					}
				}
			}
		}
		stringified[index] = str;
		return index;
	}
	const index = flatten(value);
	if (index < 0) return `${index}`;
	return stringified;
}
/**
* @param {any} thing
* @returns {string}
*/
function stringify_primitive(thing) {
	const type = typeof thing;
	if (type === "string") return stringify_string(thing);
	if (thing === void 0) return (-1).toString();
	if (thing === 0 && 1 / thing < 0) return (-6).toString();
	if (type === "bigint") return `["BigInt","${thing}"]`;
	return String(thing);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/actions/consts.js
var ACTION_QUERY_PARAMS = {
	actionName: "_action",
	actionPayload: "_astroActionPayload"
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/actions/runtime/client.js
var codeToStatusMap = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	CONTENT_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_CONTENT: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var statusToCodeMap = Object.fromEntries(Object.entries(codeToStatusMap).map(([key, value]) => [value, key]));
var ActionError = class ActionError extends Error {
	type = "AstroActionError";
	code = "INTERNAL_SERVER_ERROR";
	status = 500;
	constructor(params) {
		super(params.message);
		this.code = params.code;
		this.status = ActionError.codeToStatus(params.code);
		if (params.stack) this.stack = params.stack;
	}
	static codeToStatus(code) {
		return codeToStatusMap[code];
	}
	static statusToCode(status) {
		return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
	}
	static fromJson(body) {
		if (isInputError(body)) return new ActionInputError(body.issues);
		if (isActionError(body)) return new ActionError(body);
		return new ActionError({ code: "INTERNAL_SERVER_ERROR" });
	}
};
function isActionError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionError";
}
function isInputError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionInputError" && "issues" in error && Array.isArray(error.issues);
}
var ActionInputError = class extends ActionError {
	type = "AstroActionInputError";
	issues;
	fields;
	constructor(issues) {
		super({
			message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
			code: "BAD_REQUEST"
		});
		this.issues = issues;
		this.fields = {};
		for (const issue of issues) if (issue.path.length > 0) {
			const key = issue.path[0].toString();
			this.fields[key] ??= [];
			this.fields[key]?.push(issue.message);
		}
	}
};
function deserializeActionResult(res) {
	if (res.type === "error") {
		let json;
		try {
			json = JSON.parse(res.body);
		} catch {
			return {
				data: void 0,
				error: new ActionError({
					message: res.body,
					code: "INTERNAL_SERVER_ERROR"
				})
			};
		}
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {})?.PROD) return {
			error: ActionError.fromJson(json),
			data: void 0
		};
		else {
			const error = ActionError.fromJson(json);
			error.stack = actionResultErrorStack.get();
			return {
				error,
				data: void 0
			};
		}
	}
	if (res.type === "empty") return {
		data: void 0,
		error: void 0
	};
	return {
		data: parse(res.body, { URL: (href) => new URL(href) }),
		error: void 0
	};
}
var actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
	let errorStack;
	return {
		set(stack) {
			errorStack = stack;
		},
		get() {
			return errorStack;
		}
	};
})();
function getActionQueryString(name) {
	return `?${new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name }).toString()}`;
}
(function(A) {
	return A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase", A[A.StaticDeferPhase = 6] = "StaticDeferPhase", A[A.DynamicDeferPhase = 7] = "DynamicDeferPhase", A;
})({});
new Uint8Array(new Uint16Array([1]).buffer)[0];
var C = () => {
	return A = "AGFzbQEAAAABKwhgAAF/YAF/AX9gAABgAn9/AX9gBH9/f38AYAN/f38Bf2ABfwBgA39/fwADPj0CAgEEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgABBQICAgYBAQYBAQEFAQEBAQECAgIBAQEDAQEHAQMDBAUBcAECAgUHAQGCAoCAAgYPAn8BQaCLBAt/AEGgiwQLB80BHgZtZW1vcnkCAAJzYQACAWUABQJpcwAGAmllAAcCc3MACAJzZQAJAml0AAoCYWkACwJpZAAMAmlwAA0CZXMADgJlZQAPA2VscwAQA2VsZQARA2VzcwASAnJpABMCcmUAFAFmABUCbXMAFgJyYQAXA2FrcwAYA2FrZQAZA2F2cwAaA2F2ZQAbA3JzYQAcBXBhcnNlAB0LX19oZWFwX2Jhc2UDAQtfaW5pdGlhbGl6ZQABGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAkHAQBBAQsBAAwBAQrcVD0oAEHYCkGAwAA2AgBB0ApBoIsENgIAQbgKQSo2AgBB1ApBgIAENgIACwQAEAALWQBB6AkgADYCACAAQQF0IgBBADsBoIsEQewJIABBoosEajYCAEHECUEANgIAQdQJQQA2AgBBzAlBADYCAEHICUEANgIAQdwJQQA2AgBB0AlBADYCAEGgiwQLuAEBAn9B7AlB7AkoAgAiBEEoajYCAAJAQdQJKAIAIgVFBEBBxAkgBDYCAAwBCyAFIAQ2AiQLQdQJIAQ2AgBB2AkgBTYCACAEIAA2AgggBEIANwIgIAQgA0EBRiIAOgAYIAQgAzYCFCAEQQA2AhAgBCACNgIEIAQgATYCACAEQQNBAUECIAAbIANBAkYiARs2AhwgBCACIAJBAmpBACAAGyABGzYCDCADQQFrQQFNBEBB8AlBAToAAAsLdwECf0HsCUHsCSgCACIEQRhqNgIAAkBB3AkoAgAiBUUEQEHICSAENgIADAELIAUgBDYCFAtB3AkgBDYCACAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgBB4AkoAgAhACAEQQA2AhQgBCAANgIQQfAJQQE6AAALCABB9AkoAgALEwBBzAkoAgAoAgBBoIsEa0EBdQscAQF/QcwJKAIAKAIEIgBBoIsEa0EBdUF/IAAbCxMAQcwJKAIAKAIIQaCLBGtBAXULHAEBf0HMCSgCACgCDCIAQaCLBGtBAXVBfyAAGwsLAEHMCSgCACgCHAscAQF/QcwJKAIAKAIQIgBBoIsEa0EBdUF/IAAbCzUBAn9BfyEAAkACQAJAQcwJKAIAKAIUIgFBAWsOAgIBAAsgAUGgiwRrQQF1DwtBfiEACyAACwsAQcwJKAIALQAYCxMAQdAJKAIAKAIAQaCLBGtBAXULEwBB0AkoAgAoAgRBoIsEa0EBdQscAQF/QdAJKAIAKAIIIgBBoIsEa0EBdUF/IAAbCxwBAX9B0AkoAgAoAgwiAEGgiwRrQQF1QX8gABsLEwBB0AkoAgAoAhBBoIsEa0EBdQslAQF/QcwJQcwJKAIAIgBBJGpBxAkgABsoAgAiADYCACAAQQBHCyUBAX9B0AlB0AkoAgAiAEEUakHICSAAGygCACIANgIAIABBAEcLCABB+AktAAALCABB8AktAAALKwEBf0H8CUH8CSgCACIAQRBqQcwJKAIAQSBqIAAbKAIAIgA2AgAgAEEARwsTAEH8CSgCACgCAEGgiwRrQQF1CxMAQfwJKAIAKAIEQaCLBGtBAXULEwBB/AkoAgAoAghBoIsEa0EBdQsTAEH8CSgCACgCDEGgiwRrQQF1CwoAQfwJQQA2AgALow4BBn8jAEGA0ABrIgQkAEH4CUEBOgAAQYAIIQBBhApBgAg2AgBBnApBnosEIgFB6AkoAgBBAXRqIgU2AgBB8AlBADoAAEGACkEAOwEAQYIKQQA7AQBBiApBADoAAEH0CUEANgIAQeQJQQA6AABBjAogBEGAEGo2AgBBkAogBDYCAEGUCkEAOgAAA0AgACECQZgKIAFBAmoiADYCAAJAAkACfwJAAkAgASAFSQRAIAAvAQAiA0EJa0EFSQ0EAkACQAJAAkACQCADQeUAaw4FAQYGBgIACyADQSBGDQggA0EvRg0DIANBO0YNAgwFC0GCCi8BAA0BIAAQHkUNASABQQRqQYIIQQoQHw0BECBBmAooAgAhAEH4CS0AAA0BQYQKIAA2AgAgACICIQEMBQsgAS8BBEHtAEcNACAAEB5FDQAgASkABkLwgLyDoI6AOlINABAhQZgKKAIAIQALQYQKIAA2AgAMBgsgAS8BBCIAQSpHBEAgAEEvRw0CECIMBQtBARAjDAQLIAAhAUEAQeQJLQAADQIaDAELQfgJQQA6AAALA0ACQEGYCiABQQJqIgA2AgACQAJAAkAgASAFSQRAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAvAQAiA0Egaw4QDw4IDg4ODggBBQ4OBA4OCQALAkACQAJAAkAgA0HbAGsODwURBhERDRERAxEBERERAgALIANBCWtBBUkNESADQfsAaw4DCBAJEAtBggovAQANDyAAEB5FDQ8gAUEEakGCCEEKEB8NDxAgDA8LIAEvAQRB7QBHDQ4gABAeRQ0OIAEpAAZC8IC8g6COgDpSDQ4QIQwOCyABLwEEQewARw0NIAAQHkUNDSABQQZqQbIIQQYQHw0NIAEvAQwQJEUNDUGUCkEBOgAADA0LQYIKQYIKLwEAIgBBAWo7AQAgBEGAEGogAEEDdGoiAEEBNgIAIAAgAjYCBAwMC0GCCkGCCi8BACIAQQFqOwEAIARBgBBqIABBA3RqIgBBCDYCACAAIAI2AgQMCwtBggovAQAiAEUNDEGCCiAAQQFrOwEADAoLQYAKLwEAIgBFDQlBggovAQAiA0UNCSADQQN0IARqQfgPaigCAEEFRw0JIAQgAEECdGpBBGsoAgAiACgCBA0JIAAgAkECajYCBEGYCiABQQRqNgIAQQEQJRogAEGYCigCACIANgIQQZgKIABBAms2AgAMCQtBggovAQAiAEUNCkGCCiAAQQFrIgM7AQBBgAovAQAiAEUNCCAEQYAQaiADQf//A3FBA3RqKAIAQQVHDQggBCAAQQJ0akEEaygCACIDKAIERQRAIAMgAkECajYCBAsgAyABQQRqNgIMQYAKIABBAWs7AQAMCAsCQCACLwEAQSlHDQBB1AkoAgAiAEUNACAAKAIMIAJBAmpHDQBB1AlB2AkoAgAiADYCACAABEAgAEEANgIkDAELQcQJQQA2AgALQYIKQYIKLwEAIgBBAWo7AQAgBEGAEGogAEEDdGoiAEEGQQJBlAotAAAbNgIAIAAgAjYCBEGUCkEAOgAADAcLQYIKLwEAIgBFDQhBggogAEEBayIAOwEAIARBgBBqIABB//8DcUEDdGooAgBBBEYNAwwGCyADECYMBQsCQCABLwEEIgBBKkcEQCAAQS9HDQEQIgwHC0EBECMMBgsCQCACLwEAIgEQJwRAAkACQAJAIAFBK2sOBAEIAgAICyACQQJrLwEAQTBrQf//A3FBCkkNAwwHCyACQQJrLwEAQStGDQIMBgsgAkECay8BAEEtRg0BDAULIAFBKUcNACAEQYAQakGCCi8BAEEDdGooAgQQKA0ECwJAAkBBggovAQAiAEUgAUHmAEdyDQAgBEGAEGogAEEDdGoiA0EIaygCAEEBRw0AIAJBAmsvAQBB7wBHDQEgAkEEaxApRQ0BIANBBGsoAgBBnglBAxAqRQ0BDAULIAFB/QBHDQAgBEGAEGogAEEDdGoiACgCBBArDQQgACgCAEEGRg0ECyACECwNA0GICi0AACABQS9GcSABQQBHc0UNAwJAQdwJKAIAIgBFDQAgAiAAKAIASQ0AIAIgACgCBE0NBAsDQCACQaCLBEsEQEGECiACQQJrIgI2AgAgAi8BACIBEC1FDQELCyABQf//A3EQLgRAA0AgAkGgiwRLBEBBhAogAkECayICNgIAIAIvAQAQLg0BCwsgAhAvDQQLQYgKQQE6AAAMBAtBggpBggovAQAiAEEBajsBACAEQYAQaiAAQQN0aiIAIAI2AgQgAEEDNgIACxAwDAILQYAKLwEARUGCCi8BAEVB5AktAABBf3NxcQwFCxAxQYgKQQA6AAALQYQKQZgKKAIAIgI2AgALQZgKKAIAIQEMAQsLEDJBAAshAyAEQYDQAGokACADDwsgAiEAC0GYCigCACEBDAALAAsWACAAQaCLBEYEQEEBDwsgAEECaxAzC0MBA38CQCACRQ0AA0AgAC0AACIEIAEtAAAiBUYEQCABQQFqIQEgAEEBaiEAIAJBAWsiAg0BDAILCyAEIAVrIQMLIAML0ggBBX9BmApBmAooAgAiBEEMaiIBNgIAQdwJKAIAIQNBARAlIQICQAJAAkACQAJAAkAgAUGYCigCACIARgRAIAIQNEUNAQtB4AkgBDYCAAJAAkACQCACQSpHBEAgAkH7AEcNAUGYCiAAQQJqNgIAQQEQJSECQZwKKAIAIQFBmAooAgAhAANAAkAgAkH//wNxIgJBIkYgAkEnRnJFBEAgAhA1GkGYCigCACECDAELIAIQJkGYCkGYCigCAEECaiICNgIAC0EBECUaIAAgAhA2IgJBLEYEQEGYCkGYCigCAEECajYCAEEBECUhAgsgAkH9AEYNAyAAQZgKKAIAIgBGDQggACABTQ0ACwwHC0GYCiAAQQJqNgIAQQEQJRpBmAooAgAiACAAEDYaDAILQfgJQQA6AAACQAJAAkACQAJAAkAgAkHhAGsODAIIBAEIAwgICAgIBQALIAJB9gBGDQQMBwtBmAogAEEOaiIENgIAAkACQAJAAkBBARAlQeEAaw4GAAwCDAwBDAtBmAooAgAiASkAAkLzgOSD4I3AMVINCyABLwEKEC5FDQtBmAogAUEKajYCAEEAECUaC0GYCigCACIDQQJqQaIIQQ4QHw0KAkAgAy8BECIBECQNACABQShrDgMACwALC0GYCiADQRBqNgIAQQEQJSIBQSpGBEBBmApBmAooAgBBAmo2AgBBARAlIQELIAFBKEcNAQwKC0GYCigCACIDKQACQuyAhIOwjsA5Ug0JIAMvAQoiARAkRSABQfsAR3ENCUGYCiADQQpqNgIAQQEQJSIBQfsARg0JC0GYCigCACEDIAEQNRpBmAooAgAiASADTQ0IIAAgBCADIAEQBAwKC0GYCiAAQQpqNgIAQQAQJRpBmAooAgAhAAtBmAogAEEQajYCAEEBECUiAEEqRgRAQZgKQZgKKAIAQQJqNgIAQQEQJSEACwwJCwJAIAApAAJC7ICEg7COwDlSDQAgAC8BChAtRQ0AQZgKIABBCmo2AgBBARAlIQAMCQsgAEEEaiEAC0GYCiAAQQZqNgIAQZwKKAIAIQMDQEEBECUhAEGYCigCACIBIANLDQcgABA3IQJBmAooAgAiACABRg0EIAJBPUYEQEEBEDghAkGYCigCACEACyACQSxHDQRBmAogAEECajYCAAwACwALQfAJQQE6AABBmApBmAooAgBBAmo2AgALQQEQJSEAQZgKKAIAIQECQCAAQeYARw0AIAFBAmpBnAhBBhAfDQBBmAogAUEIajYCACAEQQEQJUEAEDkgA0EUakHICSADGyECA0AgAigCACIARQ0CIABCADcCCCAAQRRqIQIMAAsAC0GYCiABQQJrNgIACw8LIAAhAQwCCyAAIARBAEEAEARBmAogAEEMajYCAA8LEDIPC0GYCiABQQJrNgIADwtBmAooAgAhASAAEDUaIAFBmAooAgAiACABIAAQBEGYCiAAQQJrNgIAC4oLAQp/QZgKQZgKKAIAIgZBDGoiCTYCAEEBECUhAEGYCigCACECAkACQAJAAkACQAJAAn8gAEEuRgRAQZgKIAJBAmo2AgBBARAlIgBB5ABHBEAgAEHzAEcEQCAAQe0ARw0HQZgKKAIAIgBBAmpBjAhBBhAfDQdBhAooAgAiARA6RQRAIAEvAQBBLkYNCAsgBiAGIABBCGpBAhADDwtBmAooAgAiAEECakGSCEEKEB8NBkGECigCACIBEDpFBEAgAS8BAEEuRg0HC0GYCiAAQQxqNgIAQQEhCEEFIQRBARAlIQBBAQwCC0GYCigCACIAKQACQuWAmIPQjIA5Ug0FQYQKKAIAIgEQOkUEQCABLwEAQS5GDQYLQZgKIABBCmo2AgBBByEEQQEhBUEBECUhAEEBIQhBAgwBCwJAAkAgAEHzAEcgAiAJTXJFBEBB8wAhACACQQJqQZIIQQoQHw0BIAIvAQwQJEUNAUGYCiACQQxqIgA2AgBBASEIQQEQJSEBIABBmAooAgAiBEcEQEHmACEAIAFB5gBHBEBBBSEEIAEhAEEBDAULQQEhAyAEQQJqQZwIQQYQHw0FIAQvAQgQLUUNBQtBmAogAjYCAEEHIQRBASEHQQAhCCABIQBBAAwDC0EHIQRBASEHIABB5ABHIAIgBkEKak1yDQFB5AAhACACKQACQuWAmIPQjIA5Ug0AIAIvAQoQJEUNAEGYCiACQQpqNgIAQSohAEEBIQVBAiEDQQEQJSIBQSpGDQRBmAogAjYCAEEAIQUgASEAQQAMAgsgAiEEDAILQQALIQMgAEEoRgRAQYwKKAIAQYIKLwEAIgVBA3RqIgBBBTYCAEGCCiAFQQFqOwEAIABBmAooAgAiAjYCBEGECigCAC8BAEEuRg0EQZgKIAJBAmo2AgBBARAlIQAgBkGYCigCACIBQQAgAhADQdQJKAIAIQMgCARAIAMgBDYCHAtBgApBgAovAQAiBEEBajsBAEGQCigCACAEQQJ0aiADNgIAAkAgAEEiRiAAQSdGckUEQAJAIABB4ABHDQBBnAooAgAhBiABIQADQCAAIgIgBk8NAQJAAkAgAEECaiIALwEAIgdB3ABrDgUAAgICBQELIAJBBGohAAwBCyAHQSRHDQAgAi8BBEH7AEcNAAsLQZgKIAFBAms2AgAPCyAAECZBmAooAgAhAAtBmAogAEECaiIANgIAAkACQAJAQQEQJUEpaw4EAQICAAILQZgKQZgKKAIAQQJqNgIAQQEQJRogAyAANgIEQZgKKAIAIQAgA0EBOgAYIAMgADYCEAwIC0GCCiAFOwEAIAMgADYCBEGYCigCACEAIANBAToAGCADIABBAmo2AgxBgAogBDsBAA8LQZgKQZgKKAIAQQJrNgIADwsgB0UgAEH7AEdyRQRAQZgKKAIAIQBBggovAQANBkGcCigCACEBA0ACQAJAIAAgAUkEQEEBECUiAEEiRiAAQSdGcg0BIABB/QBHDQJBmApBmAooAgBBAmo2AgALQQEQJSEBQZgKKAIAIQAgAUHmAEYEQCAAQQJqQZwIQQYQHw0HC0GYCiAAQQhqNgIAQQEQJSIAQSJHIABBJ0dxDQYgBiAAQQAQOQ8LIAAQJgtBmApBmAooAgBBAmoiADYCAAwACwALAkACQCAAQSdrDgQDAQEDAAsgAEEiRg0CC0GYCigCACEECyAEIAlHDQBBmAogBEECazYCAA8LIABBKkcgBXENAkGCCi8BAA0CQZgKKAIAIQBBnAooAgAhAgNAIAAgAk8NASAALwEAIgFBJ0cgAUEiR3EEQEGYCiAAQQJqIgA2AgAMAQUgBiABIAMQOQ8LAAsACxAyCw8LQZgKQZgKKAIAQQJrNgIADwtBmAogAEECazYCAAtDAQN/QZgKKAIAIQBBnAooAgAhAgNAAkAgAEECaiEBIAAgAk8NACABIQAgAS8BAEEKaw4EAAEBAAELC0GYCiABNgIAC3ABBH9BmAooAgBBAmohAUGcCigCACEEAkADQCABIgJBAmohASACIARPDQEgAS8BACEDAkAgAEUEQCADQSpGDQEgA0EKaw4EAwICAwILIANBKkcNAQsgAi8BBEEvRw0ACyACQQRqIQELQZgKIAE2AgALCwAgAEGfgIAEEDwLfQEEf0GcCigCACEDQZgKKAIAIQEDQAJAAkACQCABLwEAIgJBL0YEQCABLwECIgFBKkcEQCABQS9GDQJBLw8LIAAQIwwCCyAABEAgAhAkDQIMAwsgAhAuDQEMAgsQIgtBmApBmAooAgAiBEECaiIBNgIAIAMgBEsNAQsLIAILhgEBBH9BmAooAgAhAUGcCigCACEEAkADQAJAIAEiAkECaiEBIAIgBE8NACABLwEAIgMgAEYNAiADQdwARwRAIANBCmsOBAECAgECCyACQQRqIQEgAi8BBEENRw0BIAJBBmogASACLwEGQQpGGyEBDAELC0GYCiABNgIAEDIPC0GYCiABNgIAC24BAX8CQCAAQSlHIABBKGtB//8DcUEHSXEgAEEhayIBQQVNQQBBASABdEExcRtyRQRAIABBOmsiAUH//wNxQSVPQr+AgICgAiABrYinQQFxRXINAQtBAQ8LIABB/QBHIABB+wBrQf//A3FBBElxCy4BAX9BASEBAkAgAEGUCUEFECoNACAAQZ4JQQMQKg0AIABBpAlBAhAqIQELIAELbwEBfwJ/IAAvAQAiARAkIAFBKUZyIAFB/QBGckUEQEEAIAFB3QBHDQEaCwNAAkAgAEGgiwRNDQAgARAkRQ0AIABBAmsiAC8BACEBDAELC0EBIAFBKUYgAUHdAEZyIAFB/QBGcg0AGiABEDRBAXMLCz4BAn8CQCAAIAJBAXQiAmsiBEECaiIAQaCLBEkNACAAIAEgAhAfDQAgAEGgiwRGBEBBAQ8LIAQQMyEDCyADC4MBAQJ/QQEhAgJAAkACQAJAAkACQCAALwEAIgFBO2sOBAUEBAEACwJAIAFB5QBrDgQDBAQCAAsgAUEpRg0EIAFB+QBHDQMgAEECa0GwCUEGECoPCyAAQQJrLwEAQT1GDwsgAEECa0GoCUEEECoPCyAAQQJrQbwJQQMQKg8LQQAhAgsgAguqAwECfwJAAkACQAJAAkACQAJAAkACQAJAIAAvAQBB5ABrDhQAAQIJCQkJAwkJBAUJCQYJBwkJCAkLAkACQCAAQQJrLwEAQekAaw4EAAoKAQoLIABBBGtBuAhBAhAqDwsgAEEEa0G8CEEDECoPCwJAAkACQCAAQQJrLwEAQfMAaw4DAAECCgsgAEEEay8BACIBQeEARwRAIAFB7ABHDQogAEEGa0HlABA7DwsgAEEGa0HjABA7DwsgAEEEa0HCCEEEECoPCyAAQQRrQcoIQQYQKg8LIABBAmsvAQBB7wBHDQYgAEEEay8BAEHlAEcNBiAAQQZrLwEAIgFB8ABHBEAgAUHjAEcNByAAQQhrQdYIQQYQKg8LIABBCGtB4ghBAhAqDwsgAEECa0HmCEEEECoPC0EBIQIgAEECayIAQekAEDsNBCAAQe4IQQUQKg8LIABBAmtB5AAQOw8LIABBAmtB+AhBBxAqDwsgAEECa0GGCUEEECoPCyAAQQJrLwEAIgFB7wBHBEAgAUHlAEcNASAAQQRrQe4AEDsPCyAAQQRrQY4JQQMQKiECCyACCzQBAX8gAEGgAUYgAEEJayIBQRdNQQBBASABdEGfgIAEcRtyRQRAIAAQNCAAQS5HcQ8LQQELCwAgAEGNgIAEEDwLSAECfwJAIAAvAQAiAkHlAEcEQCACQesARw0BIABBAmtB5ghBBBAqDwsgAEECay8BAEH1AEcNACAAQQRrQcoIQQYQKiEBCyABC94BAQR/QZgKKAIAIQBBnAooAgAhAwJAAkADQAJAIAAiAUECaiEAIAEgA08NAAJAAkACQCAALwEAIgJB3ABrDgUCBAQEAQALIAJBJEcNAyABLwEEQfsARw0DQZgKIAFBBGoiAjYCAEGMCigCAEGCCi8BACIAQQN0aiIBQQQ2AgBBggogAEEBajsBACABIAI2AgQPC0GYCiAANgIAQYIKQYIKLwEAQQFrIgE7AQBBjAooAgAgAUH//wNxQQN0aigCAEEDRw0DDAQLIAFBBGohAAwBCwtBmAogADYCAAsQMgsL2wEBBH9BmAooAgAhAEGcCigCACEDA0AgAEECaiEBAkACQCAAIANPDQACQAJAAkAgAS8BACICQdsAaw4CAQIACyABIQAgAkEKaw4EAgQEAgMLAkADQAJAIAFBAmohACABIANPDQACQAJAIAAvAQAiAkHcAGsOAgAEAQsgAUEEaiEBDAILIAAhASACQQprDgQAAQEAAQsLQZgKIAA2AgAQMkGYCigCACEADAQLQZgKIAA2AgAMAwsgAEEEaiEADAILQZgKIAE2AgAQMg8LIAJBL0cNAAtBmAogADYCAAszAQF/QeQJQQE6AABBmAooAgAhAEGYCkGcCigCAEECajYCAEH0CSAAQaCLBGtBAXU2AgALPQEBfwJ/QQEgAC8BACIBQQlrQf//A3FBBUkgAUGAAXJBoAFGcg0AGkEAIAEQNEUNABogABA6IAFBLkdyCwteAQF/AkAgAEH4/wNxQShGIABBIWsiAUEFTUEAQQEgAXRBMXEbckUEQCAAQTprIgFB//8DcUElT0K/gICAoAMgAa2Ip0EBcUVyDQELQQEPCyAAQfsAa0H//wNxQQRJC1cBA39BmAooAgAhAQNAAkAgAEH//wNxIgIQJARAIAAhAwwBCyAAIQMgAhA0DQBBACEDQZgKIAFBAmoiAjYCACABLwECIQAgAiEBIAANAQsLIANB//8DcQulAQEEfwJAQZgKKAIAIgMvAQAiBUHhAEcEQCABIQIgACEEDAELQZgKIANBBGo2AgBBARAlIQJBmAooAgAhBAJAIAJBIkYgAkEnRnJFBEAgAhA1GkGYCigCACECDAELIAIQJkGYCkGYCigCAEECaiICNgIAC0EBECUhBUGYCigCACEDCyADIARHBEAgBCACQQAgACAAIAFGIgAbQQAgASAAGxAECyAFC9MEAQd/QZgKKAIAIQECQCAAQd//A3FB2wBGBEAgAS8BACEFQZgKIAFBAmo2AgBB/QBB3QAgBUH7AEYbIQZBARAlIQNBnAooAgAhBwNAAkAgBiADQf//A3EiAkZBmAooAgAiASAHS3INAAJAIAJBLkcNACABLwECQS5HDQAgAS8BBEEuRw0AQZgKIAFBBmo2AgBBARAlEDchAwwCCwJAAn8CQCAFQfsARgRAAkAgAkEiRiACQSdGckUEQCACQdsARw0BQQAQOBpBmApBmAooAgBBAmo2AgAgAQwECyACECZBmApBmAooAgBBAmo2AgAgAQwDCyABIQAgA0Ewa0H//wNxQQlLDQEDQCAAIgJBAmohACACLwECIgNBMGtB//8DcUEKSQ0AIANBwQBrIgRBHk1BAEEBIAR0Qb+AgYQEcRsNACADQeEAayIEQRdNQQBBASAEdEG/wIEEcRsNAAJAAkAgA0Eraw4EAAEAAgELIAIvAQBBIHJB5QBGDQELC0GYCiAANgIAIAEMAgsgAkEsRgRAQZgKIAFBAmo2AgBBARAlIQMMBQsgAhA3IQIMAgsgAhA1GkGYCigCAAshAEEBECUiAkE6RgRAQZgKQZgKKAIAQQJqNgIAQQEQJRA3IQIMAQsgACABTQ0AIAEgACABIAAQBAsgAkE9RgRAQQAQOCECC0GYCigCACEBIAJBLEcNAEGYCiABQQJqNgIAQQEQJSEDDAELC0GYCiABQQJqNgIADAELIAAQNRpBmAooAgAiACABTQ0AIAEgACABIAAQBAtBARAlC54NAQx/QYQKQZgKKAIAIgE2AgBBkAooAgAhCkGMCigCACEHQZwKKAIAIQxBggovAQAhCyABIgQhAgJAA0BBmAogAkECaiIJNgIAIAIgDE8EQEEAIQYMAgsCQAJAIAkvAQAiAxAuDQACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkBBggovAQAiBSALRw0AIAMhBgJAAkAgA0Epaw4EGgEBGgALIANBO0YgA0HdAEZyIANB/QBGcg0XCyAAIAhxQQFHDQACQCADQSJrDg4MExMTEwwFCRMTCBMTDQALAkAgA0HbAGsODwYTBxMTDhMTBBMCExMTAwALAkAgA0H7AGsOAwoTCwALIANBCmsOBBgSEhgSCwJAIANBImsODgsSEhISCwQIEhIHEhIMAAsCQCADQdsAaw4PBRIGEhINEhIDEgESEhICAAsCQCADQQprDgQVEhIVAAsgA0H7AGsOAwgRCRELIAUNECAJEB5FDRAgAkEEakGCCEEKEB8NEBAgDBALIAIvAQRB7QBHDQ8gCRAeRQ0PIAIpAAZC8IC8g6COgDpSDQ8QIQwPCyACLwEEQewARw0OIAkQHkUNDiACQQZqQbIIQQYQHw0OIAIvAQwQJEUNDkGUCkEBOgAADA4LIAcgBUEDdGoiAUEBNgIAQYIKIAVBAWo7AQAgASAENgIEDA0LIAcgBUEDdGoiAUEINgIAQYIKIAVBAWo7AQAgASAENgIEDAwLIAVFDQxBggogBUEBazsBAAwLCyAFRQ0KQYAKLwEAIgFFDQogByAFQQN0akEIaygCAEEFRw0KIAogAUECdGpBBGsoAgAiASgCBA0KIAEgBEECajYCBEGYCiACQQRqNgIAQQEQJRogAUGYCigCACIBNgIQQZgKIAFBAms2AgAMCgsgBUUNCkGCCiAFQQFrIgY7AQBBgAovAQAiAUUNCSAHIAZB//8DcUEDdGooAgBBBUcNCSAKIAFBAnRqQQRrKAIAIgYoAgRFBEAgBiAEQQJqNgIECyAGIAJBBGo2AgxBgAogAUEBazsBAAwJCwJAIAQvAQBBKUcNAEHUCSgCACIBRQ0AIAEoAgwgBEECakcNAEHUCUHYCSgCACIBNgIAIAEEQCABQQA2AiQMAQtBxAlBADYCAAsgByAFQQN0aiIBQQZBAkGUCi0AABs2AgBBggogBUEBajsBACABIAQ2AgRBlApBADoAAAwICyAFRQ0IQYIKIAVBAWsiATsBACAHIAFB//8DcUEDdGooAgBBBEYNAwwHCyADECYMBgsCQCACLwEEIgJBKkcEQCACQS9HDQEQIgwJC0EBECMMCAsCQCAELwEAIgEQJwRAAkACQAJAIAFBK2sOBAEJAgAJCyAEQQJrLwEAQTBrQf//A3FBCkkNAwwICyAEQQJrLwEAQStGDQIMBwsgBEECay8BAEEtRg0BDAYLIAFBKUcNACAHIAVBA3RqKAIEECgNBQsCQAJAIAVFIAFB5gBHcg0AIAcgBUEDdGoiAkEIaygCAEEBRw0AIARBAmsvAQBB7wBHDQEgBEEEaxApRQ0BIAJBBGsoAgBBnglBAxAqRQ0BDAYLIAFB/QBHDQAgByAFQQN0aiICKAIEECsNBSACKAIAQQZGDQULIAQQLA0EQYgKLQAAIAFBL0ZxIAFBAEdzRQ0EQdwJKAIAIgZFDQIgBCAGKAIASQ0CIAQiAiAGKAIETQ0EDAMLIAcgBUEDdGoiASAENgIEQYIKIAVBAWo7AQAgAUEDNgIACxAwDAMLIAQhAgsDQCACQaCLBEsEQCACQQJrIgIvAQAiARAtRQ0BCwsgARAuBEADQCACQaCLBEsEQEGECiACQQJrIgI2AgAgAi8BABAuDQELCyACEC8NAQtBiApBAToAAAwBCxAxQYgKQQA6AAALQYQKQZgKKAIAIgE2AgAMAQsQMgtBACEGQeQJLQAADQMCQCABIARGBEAgAEUNAUGCCi8BACALRiAIcUUNAUEBIQggASEEQZgKKAIALwEAIgZBCmsOBAUCAgUCCyADQS9GBEBBiAotAABBAXMhCAwBC0EBIQggA0Ewa0H//wNxQQpJIANB3/8DcUHBAGtB//8DcUEaSXIgA0EkRiADQd8ARnJyIANB/wBLcg0AIAEhBAJAAkAgA0Enaw4DAwEDAAsCQCADQd0Aaw4EAwEBAwALIANBIkYgA0H9AEZyDQELQQAhCAsgASEEC0GYCigCACECDAELCyADDwsgBguvBAEHfyABQSJGIAFBJ0ZyRQRAEDIPC0GYCigCACEDIAEQJiAAIANBAmpBmAooAgBBARADIAIEQEHUCSgCAEEEQQYgAkEBRhs2AhwLQZgKQZgKKAIAQQJqNgIAQQAQJSEAQZgKKAIAIQQCQAJAIABB9wBHDQAgBC8BAkHpAEcNACAELwEEQfQARw0AIAQvAQZB6ABGDQELQZgKIARBAms2AgAPC0GYCiAEQQhqNgIAAkBBARAlQfsARwRADAELQewJKAIAIQNB1AkoAgAhBUGYCigCACIGIQBBACECA0AgAyEBQZgKIABBAmo2AgBBARAlIQBBmAooAgAhBwJAAkACQCAAQSJHBEAgAEEnRw0BQScQJgwCC0EiECYMAQsgABA1IQNBmAooAgAhAAwBC0GYCigCAEECaiEAQZgKIAA2AgBBARAlIQMLIANBOkcEQAwCC0GYCkGYCigCAEECajYCAEEBECUiA0EiRiADQSdGckUEQAwCC0GYCigCACEIIAMQJkHsCSABQRRqIgM2AgBBmAooAgAhCSABQQA2AhAgASAINgIIIAEgADYCBCABIAc2AgAgASAJQQJqIgA2AgwCQCACRQRAIAUgATYCIAwBCyACIAE2AhALQZgKIAA2AgACQEEBECUiAEEsRwRAIABB/QBGDQEMAwtBmApBmAooAgBBAmoiADYCACABIQIMAQsLIAUgBjYCECAFQZgKKAIAQQJqNgIMDwtBmAogBDYCAAstAQF/AkAgAC8BAEEuRw0AIABBAmsvAQBBLkcNACAAQQRrLwEAQS5GIQELIAELNQEBfwJAIABBoIsESQ0AIAAvAQAgAUcNACAAQaCLBEYEQEEBDwsgAEECay8BABAtIQILIAILKQEBfyAAQaABRiAAQQlrIgJBF01BAEEBIAJ0IAFxG3JFBEBBAA8LQQELC8cBAQBBgggLvwF4AHAAbwByAHQAZQB0AGEAbwB1AHIAYwBlAHIAbwBtAHUAbgBjAHQAaQBvAG4AbABhAHMAcwB2AG8AeQBpAGUAZABlAGwAZQBjAG8AbgB0AGkAbgBpAG4AcwB0AGEAbgB0AHkAYgByAGUAYQByAGUAdAB1AHIAZABlAGIAdQBnAGcAZQBhAHcAYQBpAHQAaAByAHcAaABpAGwAZQBmAG8AcgBpAGYAYwBhAHQAYwBmAGkAbgBhAGwAbABlAGwAcw==", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), (A) => A.charCodeAt(0));
	var A;
};
WebAssembly.compile(C()).then(WebAssembly.instantiate).then(({ exports: A }) => {});
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/actions/runtime/server.js
function getActionContext(context) {
	const callerInfo = getCallerInfo(context);
	const actionResultAlreadySet = Boolean(context.locals._actionPayload);
	let action = void 0;
	if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) action = {
		calledFrom: callerInfo.from,
		name: callerInfo.name,
		handler: async () => {
			const pipeline = Reflect.get(context, pipelineSymbol);
			const callerInfoName = shouldAppendForwardSlash(pipeline.manifest.trailingSlash, pipeline.manifest.buildFormat) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
			let baseAction;
			try {
				baseAction = await pipeline.getAction(callerInfoName);
			} catch (error) {
				if (error instanceof Error && "name" in error && typeof error.name === "string" && error.name === ActionNotFoundError.name) return {
					data: void 0,
					error: new ActionError({ code: "NOT_FOUND" })
				};
				throw error;
			}
			const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
			let input;
			try {
				input = await parseRequestBody(context.request, bodySizeLimit);
			} catch (e) {
				if (e instanceof ActionError) return {
					data: void 0,
					error: e
				};
				if (e instanceof TypeError) return {
					data: void 0,
					error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" })
				};
				throw e;
			}
			const omitKeys = [
				"props",
				"getActionResult",
				"callAction",
				"redirect"
			];
			const actionAPIContext = Object.create(Object.getPrototypeOf(context), Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(context)).filter(([key]) => !omitKeys.includes(key))));
			Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
			return baseAction.bind(actionAPIContext)(input);
		}
	};
	function setActionResult(actionName, actionResult) {
		context.locals._actionPayload = {
			actionResult,
			actionName
		};
	}
	return {
		action,
		setActionResult,
		serializeActionResult,
		deserializeActionResult
	};
}
function getCallerInfo(ctx) {
	if (ctx.routePattern === "/_actions/[...path]") return {
		from: "rpc",
		name: ctx.url.pathname.replace(/^.*\/_actions\//, "")
	};
	const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
	if (queryParam) return {
		from: "form",
		name: queryParam
	};
}
async function parseRequestBody(request, bodySizeLimit) {
	const contentType = request.headers.get("content-type");
	const contentLengthHeader = request.headers.get("content-length");
	const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
	const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
	if (!contentType) return void 0;
	if (hasContentLength && contentLength > bodySizeLimit) throw new ActionError({
		code: "CONTENT_TOO_LARGE",
		message: `Request body exceeds ${bodySizeLimit} bytes`
	});
	try {
		if (hasContentType(contentType, formContentTypes$1)) {
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				return await new Request(request.url, {
					method: request.method,
					headers: request.headers,
					body: toArrayBuffer(body)
				}).formData();
			}
			return await request.clone().formData();
		}
		if (hasContentType(contentType, ["application/json"])) {
			if (contentLength === 0) return void 0;
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				if (body.byteLength === 0) return void 0;
				return JSON.parse(new TextDecoder().decode(body));
			}
			return await request.clone().json();
		}
	} catch (e) {
		if (e instanceof BodySizeLimitError) throw new ActionError({
			code: "CONTENT_TOO_LARGE",
			message: `Request body exceeds ${bodySizeLimit} bytes`
		});
		throw e;
	}
	throw new TypeError("Unsupported content type");
}
var ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
var formContentTypes$1 = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
	const type = contentType.split(";")[0].toLowerCase();
	return expected.some((t) => type === t);
}
function serializeActionResult(res) {
	if (res.error) {
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {})?.DEV) actionResultErrorStack.set(res.error.stack);
		let body2;
		if (res.error instanceof ActionInputError) body2 = {
			type: res.error.type,
			issues: res.error.issues,
			fields: res.error.fields
		};
		else body2 = {
			...res.error,
			message: res.error.message
		};
		return {
			type: "error",
			status: res.error.status,
			contentType: "application/json",
			body: JSON.stringify(body2)
		};
	}
	if (res.data === void 0) return {
		type: "empty",
		status: 204
	};
	let body;
	try {
		body = stringify$2(res.data, { URL: (value) => value instanceof URL && value.href });
	} catch (e) {
		let hint = ActionsReturnedInvalidDataError.hint;
		if (res.data instanceof Response) hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
		throw new AstroError({
			...ActionsReturnedInvalidDataError,
			message: ActionsReturnedInvalidDataError.message(String(e)),
			hint
		});
	}
	return {
		type: "data",
		status: 200,
		contentType: "application/json+devalue",
		body
	};
}
function toArrayBuffer(buffer) {
	const copy = new Uint8Array(buffer.byteLength);
	copy.set(buffer);
	return copy.buffer;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/actions/utils.js
function hasActionPayload(locals) {
	return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
	return (actionFn) => {
		if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) return;
		return deserializeActionResult(locals._actionPayload.actionResult);
	};
}
function createCallAction(context) {
	return (baseAction, input) => {
		Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
		return baseAction.bind(context)(input);
	};
}
//#endregion
//#region node_modules/.pnpm/cookie@2.0.1/node_modules/cookie/dist/index.js
/**
* RegExp to match cookie-name in RFC 6265 sec 4.1.1
* This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
* which has been replaced by the token definition in RFC 7230 appendix B.
*
* cookie-name       = token
* token             = 1*tchar
* tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
*                     "*" / "+" / "-" / "." / "^" / "_" /
*                     "`" / "|" / "~" / DIGIT / ALPHA
*
* Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
* Allow same range as cookie value, except `=`, which delimits end of name.
*/
var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
/**
* RegExp to match cookie-value in RFC 6265 sec 4.1.1
*
* cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
* cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
*                     ; US-ASCII characters excluding CTLs,
*                     ; whitespace DQUOTE, comma, semicolon,
*                     ; and backslash
*
* Allowing more characters: https://github.com/jshttp/cookie/issues/191
* Comma, backslash, and DQUOTE are not part of the parsing algorithm.
*/
var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
/**
* RegExp to match domain-value in RFC 6265 sec 4.1.1
*
* domain-value      = <subdomain>
*                     ; defined in [RFC1034], Section 3.5, as
*                     ; enhanced by [RFC1123], Section 2.1
* <subdomain>       = <label> | <subdomain> "." <label>
* <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
*                     Labels must be 63 characters or less.
*                     'let-dig' not 'letter' in the first char, per RFC1123
* <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
* <let-dig-hyp>     = <let-dig> | "-"
* <let-dig>         = <letter> | <digit>
* <letter>          = any one of the 52 alphabetic characters A through Z in
*                     upper case and a through z in lower case
* <digit>           = any one of the ten digits 0 through 9
*
* Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
*
* > (Note that a leading %x2E ("."), if present, is ignored even though that
* character is not permitted, but a trailing %x2E ("."), if present, will
* cause the user agent to ignore the attribute.)
*/
var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/**
* RegExp to match path-value in RFC 6265 sec 4.1.1
*
* path-value        = <any CHAR except CTLs or ";">
* CHAR              = %x01-7F
*                     ; defined in RFC 5234 appendix B.1
*/
var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
/**
* RegExp to match RFC 6265 cookie-octet values (without % to preserve roundtrip) that need no URL encoding.
*/
var cookieOctetRegExp = /^[!#$&'()*+\-.\/0-9:<=>?@A-Z[\]\^_`a-z{|}~]*$/;
var NullObject = /* @__PURE__ */ (() => {
	const C = function() {};
	C.prototype = Object.create(null);
	return C;
})();
/**
* Parse a `Cookie` header.
*
* Parse the given cookie header string into an object
* The object has the various cookies as keys(names) => values
*/
function parseCookie(str, options) {
	const obj = new NullObject();
	const len = str.length;
	if (len < 2) return obj;
	const dec = options?.decode || decode;
	let index = 0;
	do {
		const eqIdx = eqIndex(str, index, len);
		if (eqIdx === len) break;
		const endIdx = endIndex(str, index, len);
		if (eqIdx > endIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = valueSlice(str, index, eqIdx);
		if (obj[key] === void 0) obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
		index = endIdx + 1;
	} while (index < len);
	return obj;
}
/**
* Serialize data into a cookie header.
*
* Serialize a name value pair into a cookie string suitable for
* http headers. An optional options object specifies cookie parameters.
*
* stringifySetCookie({ name: 'foo', value: 'bar', httpOnly: true })
*   => "foo=bar; HttpOnly"
*/
function stringifySetCookie(cookie, options) {
	const enc = options?.encode || defaultEncode;
	if (!cookieNameRegExp.test(cookie.name)) throw new TypeError(`argument name is invalid: ${cookie.name}`);
	const value = cookie.value == null ? "" : enc(cookie.value);
	if (!cookieValueRegExp.test(value)) throw new TypeError(`argument val is invalid: ${cookie.value}`);
	let str = cookie.name + "=" + value;
	if (cookie.maxAge !== void 0) {
		if (!Number.isInteger(cookie.maxAge)) throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
		str += "; Max-Age=" + cookie.maxAge;
	}
	if (cookie.domain) {
		if (!domainValueRegExp.test(cookie.domain)) throw new TypeError(`option domain is invalid: ${cookie.domain}`);
		str += "; Domain=" + cookie.domain;
	}
	if (cookie.path) {
		if (!pathValueRegExp.test(cookie.path)) throw new TypeError(`option path is invalid: ${cookie.path}`);
		str += "; Path=" + cookie.path;
	}
	if (cookie.expires) {
		if (!Number.isFinite(cookie.expires.valueOf())) throw new TypeError(`option expires is invalid: ${cookie.expires}`);
		str += "; Expires=" + cookie.expires.toUTCString();
	}
	if (cookie.httpOnly) str += "; HttpOnly";
	if (cookie.secure) str += "; Secure";
	if (cookie.partitioned) str += "; Partitioned";
	if (cookie.priority) switch (typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0) {
		case "low":
			str += "; Priority=Low";
			break;
		case "medium":
			str += "; Priority=Medium";
			break;
		case "high":
			str += "; Priority=High";
			break;
		default: throw new TypeError(`option priority is invalid: ${cookie.priority}`);
	}
	if (cookie.sameSite) switch (typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite) {
		case true:
		case "strict":
			str += "; SameSite=Strict";
			break;
		case "lax":
			str += "; SameSite=Lax";
			break;
		case "none":
			str += "; SameSite=None";
			break;
		default: throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
	}
	return str;
}
/**
* Find the next `;` character, or return `len`.
*/
function endIndex(str, min, len) {
	const index = str.indexOf(";", min);
	return index === -1 ? len : index;
}
/**
* Find the next `=` character, or return `len`.
*/
function eqIndex(str, min, len) {
	const index = str.indexOf("=", min);
	return index === -1 ? len : index;
}
/**
* Slice out a value between startPod to max.
*/
function valueSlice(str, min, max) {
	if (min === max) return "";
	let start = min;
	let end = max;
	do {
		const code = str.charCodeAt(start);
		if (code !== 32 && code !== 9) break;
	} while (++start < end);
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 32 && code !== 9) break;
		end--;
	}
	return str.slice(start, end);
}
/**
* URL-decode string value. Optimized to skip native call when no %.
*/
function decode(str) {
	if (str.indexOf("%") === -1) return str;
	try {
		return decodeURIComponent(str);
	} catch (e) {
		return str;
	}
}
/**
* URL-encode string value. Optimized to skip native call for roundtrip-safe cookie-octet values.
*/
function defaultEncode(str) {
	return cookieOctetRegExp.test(str) ? str : encodeURIComponent(str);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/cookies/cookies.js
var DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
var DELETED_VALUE = "deleted";
var responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
var identity = (value) => value;
var AstroCookie = class {
	value;
	constructor(value) {
		this.value = value;
	}
	json() {
		if (this.value === void 0) throw new Error(`Cannot convert undefined to an object.`);
		return JSON.parse(this.value);
	}
	number() {
		return Number(this.value);
	}
	boolean() {
		if (this.value === "false") return false;
		if (this.value === "0") return false;
		return Boolean(this.value);
	}
};
var AstroCookies = class {
	#request;
	#requestValues;
	#outgoing;
	#consumed;
	constructor(request) {
		this.#request = request;
		this.#requestValues = null;
		this.#outgoing = null;
		this.#consumed = false;
	}
	/**
	* Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
	* in a Set-Cookie header added to the response.
	* @param key The cookie to delete
	* @param options Options related to this deletion, such as the path of the cookie.
	*/
	delete(key, options) {
		this.#ensureOutgoingMap().set(key, [
			DELETED_VALUE,
			stringifySetCookie({
				...options,
				name: key,
				value: DELETED_VALUE,
				expires: DELETED_EXPIRATION,
				maxAge: void 0
			}),
			false
		]);
	}
	/**
	* Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
	* request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
	* from that set call, overriding any values already part of the request.
	* @param key The cookie to get.
	* @returns An object containing the cookie value as well as convenience methods for converting its value.
	*/
	get(key, options = void 0) {
		if (this.#outgoing?.has(key)) {
			let [serializedValue, , isSetValue] = this.#outgoing.get(key);
			if (isSetValue) return new AstroCookie(serializedValue);
			else return;
		}
		const decode = options?.decode ?? decodeURIComponent;
		const values = this.#ensureParsed();
		if (key in values) {
			const value = values[key];
			if (value) {
				let decodedValue;
				try {
					decodedValue = decode(value);
				} catch (_error) {
					decodedValue = value;
				}
				return new AstroCookie(decodedValue);
			}
		}
	}
	/**
	* Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
	* part of the initial request or set via Astro.cookies.set(key)
	* @param key The cookie to check for.
	* @param _options This parameter is no longer used.
	* @returns
	*/
	has(key, _options) {
		if (this.#outgoing?.has(key)) {
			let [, , isSetValue] = this.#outgoing.get(key);
			return isSetValue;
		}
		return this.#ensureParsed()[key] !== void 0;
	}
	/**
	* Astro.cookies.set(key, value) is used to set a cookie's value. If provided
	* an object it will be stringified via JSON.stringify(value). Additionally you
	* can provide options customizing how this cookie will be set, such as setting httpOnly
	* in order to prevent the cookie from being read in client-side JavaScript.
	* @param key The name of the cookie to set.
	* @param value A value, either a string or other primitive or an object.
	* @param options Options for the cookie, such as the path and security settings.
	*/
	set(key, value, options) {
		if (this.#consumed) {
			const warning = /* @__PURE__ */ new Error("Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page.");
			warning.name = "Warning";
			console.warn(warning);
		}
		let serializedValue;
		if (typeof value === "string") serializedValue = value;
		else {
			let toStringValue = value.toString();
			if (toStringValue === Object.prototype.toString.call(value)) serializedValue = JSON.stringify(value);
			else serializedValue = toStringValue;
		}
		const { encode, ...attributes } = options ?? {};
		this.#ensureOutgoingMap().set(key, [
			serializedValue,
			stringifySetCookie({
				...attributes,
				name: key,
				value: serializedValue
			}, { encode }),
			true
		]);
		if (this.#request[responseSentSymbol]) throw new AstroError({ ...ResponseSentError });
	}
	/**
	* Merges a new AstroCookies instance into the current instance. Any new cookies
	* will be added to the current instance, overwriting any existing cookies with the same name.
	*/
	merge(cookies) {
		const outgoing = cookies.#outgoing;
		if (outgoing) for (const [key, value] of outgoing) this.#ensureOutgoingMap().set(key, value);
	}
	/**
	* Astro.cookies.header() returns an iterator for the cookies that have previously
	* been set by either Astro.cookies.set() or Astro.cookies.delete().
	* This method is primarily used by adapters to set the header on outgoing responses.
	* @returns
	*/
	*headers() {
		if (this.#outgoing == null) return;
		for (const [, value] of this.#outgoing) yield value[1];
	}
	/**
	* Marks the cookies as consumed and returns the header values.
	* After consumption, any subsequent `set()` calls will warn.
	*/
	consume() {
		this.#consumed = true;
		return this.headers();
	}
	/**
	* @deprecated Use the instance method `cookies.consume()` instead.
	* Kept for backward compatibility with adapters.
	*/
	static consume(cookies) {
		return cookies.consume();
	}
	#ensureParsed() {
		if (!this.#requestValues) this.#parse();
		if (!this.#requestValues) this.#requestValues = /* @__PURE__ */ Object.create(null);
		return this.#requestValues;
	}
	#ensureOutgoingMap() {
		if (!this.#outgoing) this.#outgoing = /* @__PURE__ */ new Map();
		return this.#outgoing;
	}
	#parse() {
		const raw = this.#request.headers.get("cookie");
		if (!raw) return;
		this.#requestValues = parseCookie(raw, { decode: identity });
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/cookies/response.js
var astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
	Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
	let cookies = Reflect.get(response, astroCookiesSymbol);
	if (cookies != null) return cookies;
	else return;
}
function* getSetCookiesFromResponse(response) {
	const cookies = getCookiesFromResponse(response);
	if (!cookies) return [];
	for (const headerValue of cookies.consume()) yield headerValue;
	return [];
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/routing/pattern.js
function getPattern(segments, base, addTrailingSlash) {
	const pathname = segments.map((segment) => {
		if (segment.length === 1 && segment[0].spread) return "(?:\\/(.*?))?";
		else return "\\/" + segment.map((part) => {
			if (part.spread) return "(.*?)";
			else if (part.dynamic) return "([^/]+?)";
			else return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}).join("");
	}).join("");
	const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
	let initial = "\\/";
	if (addTrailingSlash === "never" && base !== "/" && pathname !== "") initial = "";
	return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
	if (addTrailingSlash === "always") return "\\/$";
	if (addTrailingSlash === "never") return "$";
	return "\\/?$";
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/i18n/fallback.js
function computeFallbackRoute(options) {
	const { pathname, responseStatus, fallback, fallbackType, locales, defaultLocale, strategy, base } = options;
	if (responseStatus !== 404) return { type: "none" };
	if (!fallback || Object.keys(fallback).length === 0) return { type: "none" };
	const urlLocale = pathname.split("/").find((segment) => {
		for (const locale of locales) if (typeof locale === "string") {
			if (locale === segment) return true;
		} else if (locale.path === segment) return true;
		return false;
	});
	if (!urlLocale) return { type: "none" };
	if (!Object.keys(fallback).includes(urlLocale)) return { type: "none" };
	const fallbackLocale = fallback[urlLocale];
	const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
	let newPathname;
	if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
		if (pathname.includes(`${base}`)) newPathname = pathname.replace(`/${urlLocale}`, ``);
		else newPathname = pathname.replace(`/${urlLocale}`, `/`);
	} else newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
	return {
		type: fallbackType,
		pathname: newPathname
	};
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/i18n/path.js
function pathHasLocale(path, locales) {
	const segments = path.split("/").map(normalizeThePath);
	for (const segment of segments) for (const locale of locales) if (typeof locale === "string") {
		if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) return true;
	} else if (segment === locale.path) return true;
	return false;
}
function normalizeTheLocale(locale) {
	return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
	return path.endsWith(".html") ? path.slice(0, -5) : path;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/i18n/router.js
var I18nRouter = class {
	#strategy;
	#defaultLocale;
	#locales;
	#base;
	#domains;
	constructor(options) {
		this.#strategy = options.strategy;
		this.#defaultLocale = options.defaultLocale;
		this.#locales = options.locales;
		this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
		this.#domains = options.domains;
	}
	/**
	* Evaluate routing strategy for a pathname.
	* Returns decision object (not HTTP Response).
	*/
	match(pathname, context) {
		if (this.shouldSkipProcessing(pathname, context)) return { type: "continue" };
		switch (this.#strategy) {
			case "manual": return { type: "continue" };
			case "pathname-prefix-always": return this.matchPrefixAlways(pathname, context);
			case "domains-prefix-always":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlways(pathname, context);
			case "pathname-prefix-other-locales": return this.matchPrefixOtherLocales(pathname, context);
			case "domains-prefix-other-locales":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixOtherLocales(pathname, context);
			case "pathname-prefix-always-no-redirect": return this.matchPrefixAlwaysNoRedirect(pathname, context);
			case "domains-prefix-always-no-redirect":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlwaysNoRedirect(pathname, context);
			default: return { type: "continue" };
		}
	}
	/**
	* Check if i18n processing should be skipped for this request
	*/
	shouldSkipProcessing(pathname, context) {
		if (pathname.includes("/404") || pathname.includes("/500")) return true;
		if (pathname.includes("/_server-islands/")) return true;
		if (context.isReroute) return true;
		if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") return true;
		return false;
	}
	/**
	* Strategy: pathname-prefix-always
	* All locales must have a prefix, including the default locale.
	*/
	matchPrefixAlways(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return {
			type: "redirect",
			location: `${this.#base === "/" ? "" : this.#base}/${this.#defaultLocale}`
		};
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-other-locales
	* Default locale has no prefix, other locales must have a prefix.
	*/
	matchPrefixOtherLocales(pathname, _context) {
		let pathnameContainsDefaultLocale = false;
		for (const segment of pathname.split("/")) if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
			pathnameContainsDefaultLocale = true;
			break;
		}
		if (pathnameContainsDefaultLocale) return {
			type: "notFound",
			location: pathname.replace(`/${this.#defaultLocale}`, "")
		};
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-always-no-redirect
	* Like prefix-always but allows root to serve instead of redirecting
	*/
	matchPrefixAlwaysNoRedirect(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return { type: "continue" };
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Check if the current locale doesn't belong to the configured domain.
	* Used for domain-based routing strategies.
	*/
	localeHasntDomain(currentLocale, currentDomain) {
		if (!this.#domains || !currentDomain) return false;
		if (!currentLocale) return false;
		const localesForDomain = this.#domains[currentDomain];
		if (!localesForDomain) return true;
		return !localesForDomain.includes(currentLocale);
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/i18n/handler.js
var I18n = class {
	#i18n;
	#base;
	#trailingSlash;
	#format;
	#router;
	constructor(i18n, base, trailingSlash, format) {
		this.#i18n = i18n;
		this.#base = base;
		this.#trailingSlash = trailingSlash;
		this.#format = format;
		this.#router = new I18nRouter({
			strategy: i18n.strategy,
			defaultLocale: i18n.defaultLocale,
			locales: i18n.locales,
			base,
			domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce((acc, domain) => {
				const locale = i18n.domainLookupTable[domain];
				if (!acc[domain]) acc[domain] = [];
				acc[domain].push(locale);
				return acc;
			}, {}) : void 0
		});
	}
	async finalize(state, response) {
		state.pipeline.usedFeatures |= PipelineFeatures.i18n;
		const i18n = this.#i18n;
		if (state.skipErrorReroute && typeof i18n.fallback === "undefined") return response;
		if (state.responseRouteType !== "page" && state.responseRouteType !== "fallback") return response;
		const url = state.url;
		const currentLocale = state.computeCurrentLocale();
		const isPrerendered = state.routeData.prerender;
		const routerContext = {
			currentLocale,
			currentDomain: url.hostname,
			routeType: state.responseRouteType,
			isReroute: false
		};
		const routeDecision = this.#router.match(url.pathname, routerContext);
		switch (routeDecision.type) {
			case "redirect": {
				let location = routeDecision.location;
				if (shouldAppendForwardSlash(this.#trailingSlash, this.#format)) location = appendForwardSlash(location);
				return new Response(null, {
					status: routeDecision.status ?? 302,
					headers: { Location: location }
				});
			}
			case "notFound": {
				if (isPrerendered) {
					const prerenderedRes = new Response(response.body, {
						status: 404,
						headers: response.headers
					});
					state.skipErrorReroute = true;
					if (routeDecision.location) prerenderedRes.headers.set("Location", routeDecision.location);
					return prerenderedRes;
				}
				const headers = new Headers();
				if (routeDecision.location) headers.set("Location", routeDecision.location);
				return new Response(null, {
					status: 404,
					headers
				});
			}
		}
		if (i18n.fallback && i18n.fallbackType) {
			const effectiveStatus = state.responseRouteType === "fallback" ? 404 : response.status;
			const fallbackDecision = computeFallbackRoute({
				pathname: url.pathname,
				responseStatus: effectiveStatus,
				currentLocale,
				fallback: i18n.fallback,
				fallbackType: i18n.fallbackType,
				locales: i18n.locales,
				defaultLocale: i18n.defaultLocale,
				strategy: i18n.strategy,
				base: this.#base
			});
			switch (fallbackDecision.type) {
				case "redirect": return new Response(null, {
					status: 302,
					headers: { Location: fallbackDecision.pathname + url.search }
				});
				case "rewrite": return await state.rewrite(fallbackDecision.pathname + url.search);
			}
		}
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/i18n/index.js
function getPathByLocale(locale, locales) {
	for (const loopLocale of locales) if (typeof loopLocale === "string") {
		if (loopLocale === locale) return loopLocale;
	} else for (const code of loopLocale.codes) if (code === locale) return loopLocale.path;
	throw new AstroError(i18nNoLocaleFoundInPath);
}
function getAllCodes(locales) {
	const result = [];
	for (const loopLocale of locales) if (typeof loopLocale === "string") result.push(loopLocale);
	else result.push(...loopLocale.codes);
	return result;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/i18n/utils.js
function parseLocale(header) {
	if (header === "*") return [{
		locale: header,
		qualityValue: void 0
	}];
	const result = [];
	const localeValues = header.split(",").map((str) => str.trim());
	for (const localeValue of localeValues) {
		const split = localeValue.split(";").map((str) => str.trim());
		const localeName = split[0];
		const qualityValue = split[1];
		if (!split) continue;
		if (qualityValue && qualityValue.startsWith("q=")) {
			const qualityValueAsFloat = Number.parseFloat(qualityValue.slice(2));
			if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) result.push({
				locale: localeName,
				qualityValue: void 0
			});
			else result.push({
				locale: localeName,
				qualityValue: qualityValueAsFloat
			});
		} else result.push({
			locale: localeName,
			qualityValue: void 0
		});
	}
	return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
	const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
	return browserLocaleList.filter((browserLocale) => {
		if (browserLocale.locale !== "*") return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
		return true;
	}).sort((a, b) => {
		if (a.qualityValue && b.qualityValue) return Math.sign(b.qualityValue - a.qualityValue);
		return 0;
	});
}
function computePreferredLocale(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = void 0;
	if (acceptHeader) {
		const firstResult = sortAndFilterLocales(parseLocale(acceptHeader), locales).at(0);
		if (firstResult && firstResult.locale !== "*") {
			outer: for (const currentLocale of locales) if (typeof currentLocale === "string") {
				if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
					result = currentLocale;
					break;
				}
			} else for (const currentCode of currentLocale.codes) if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
				result = currentCode;
				break outer;
			}
		}
	}
	return result;
}
function computePreferredLocaleList(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = [];
	if (acceptHeader) {
		const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
		if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") return getAllCodes(locales);
		else if (browserLocaleList.length > 0) {
			for (const browserLocale of browserLocaleList) for (const loopLocale of locales) if (typeof loopLocale === "string") {
				if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) result.push(loopLocale);
			} else for (const code of loopLocale.codes) if (code === browserLocale.locale) result.push(code);
		}
	}
	return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
	for (const segment of pathname.split("/").map(normalizeThePath)) for (const locale of locales) if (typeof locale === "string") {
		if (!segment.includes(locale)) continue;
		if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) return locale;
	} else if (locale.path === segment) return locale.codes.at(0);
	else for (const code of locale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(segment)) return code;
	for (const locale of locales) if (typeof locale === "string") {
		if (locale === defaultLocale) return locale;
	} else if (locale.path === defaultLocale) return locale.codes.at(0);
}
function computeCurrentLocaleFromParams(params, locales) {
	const byNormalizedCode = /* @__PURE__ */ new Map();
	const byPath = /* @__PURE__ */ new Map();
	for (const locale of locales) if (typeof locale === "string") byNormalizedCode.set(normalizeTheLocale(locale), locale);
	else {
		byPath.set(locale.path, locale.codes[0]);
		for (const code of locale.codes) byNormalizedCode.set(normalizeTheLocale(code), code);
	}
	for (const value of Object.values(params)) {
		if (!value) continue;
		const pathMatch = byPath.get(value);
		if (pathMatch) return pathMatch;
		const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
		if (codeMatch) return codeMatch;
	}
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/middleware/callMiddleware.js
async function callMiddleware(onRequest, apiContext, responseFunction) {
	let nextCalled = false;
	let responseFunctionPromise = void 0;
	const next = async (payload) => {
		nextCalled = true;
		responseFunctionPromise = responseFunction(apiContext, payload);
		return responseFunctionPromise;
	};
	const middlewarePromise = onRequest(apiContext, next);
	return await Promise.resolve(middlewarePromise).then(async (value) => {
		if (nextCalled) {
			if (typeof value !== "undefined") {
				if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
				return value;
			} else if (responseFunctionPromise) return responseFunctionPromise;
			else throw new AstroError(MiddlewareNotAResponse);
		} else if (typeof value === "undefined") throw new AstroError(MiddlewareNoDataOrNextCalled);
		else if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
		else return value;
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/cache/runtime/noop.js
var EMPTY_OPTIONS = Object.freeze({ tags: [] });
var NoopAstroCache = class {
	enabled = false;
	set() {}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {}
};
var hasWarned = false;
var DisabledAstroCache = class {
	enabled = false;
	#logger;
	constructor(logger) {
		this.#logger = logger;
	}
	#warn() {
		if (!hasWarned) {
			hasWarned = true;
			this.#logger?.warn("cache", "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `cache` to enable caching.");
		}
	}
	set() {
		this.#warn();
	}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {
		throw new AstroError(CacheNotEnabled);
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/middleware/astro-middleware.js
var AstroMiddleware = class {
	#pipeline;
	constructor(pipeline) {
		this.#pipeline = pipeline;
	}
	async handle(state, renderRouteCallback) {
		state.pipeline.usedFeatures |= PipelineFeatures.middleware;
		const pipeline = this.#pipeline;
		await state.getProps();
		const apiContext = state.getAPIContext();
		state.counter++;
		if (state.counter === 4) return new Response("Loop Detected", {
			status: 508,
			statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
		});
		const next = async (ctx, payload) => {
			if (payload) {
				pipeline.logger.debug("router", "Called rewriting to:", payload);
				applyRewriteToState(state, payload, await pipeline.tryRewrite(payload, state.request));
			}
			return renderRouteCallback(state, ctx);
		};
		let response;
		if (state.skipMiddleware) response = await next(apiContext);
		else {
			const pipelineMiddleware = await pipeline.getMiddleware();
			response = await callMiddleware(sequence(...pipeline.internalMiddleware, pipelineMiddleware), apiContext, next);
		}
		response = this.#finalize(state, response);
		state.response = response;
		return response;
	}
	/**
	* Like `handle`, but mirrors the app-level error handling that
	* `AstroHandler` provides on the standard path, the same way
	* `PagesHandler.handleWithErrorFallback` does for `pages()`. When no
	* route matched it returns a 404 marked with `X-Astro-Error` for the
	* app's post-check; when Astro's own middleware chain throws it logs the
	* error and renders the custom `500.astro`.
	*
	* Errors surfaced through `renderRouteCallback` (the host framework's
	* `next`, e.g. host middleware mounted below `middleware()`) are
	* re-thrown instead, so the host's own error handling still runs rather
	* than being swallowed into Astro's 500 page. A sentinel tells the two
	* apart.
	*
	* Used by the composable `astro/fetch` `middleware()` entry point, where
	* there is no surrounding `AstroHandler` to supply this fallback.
	*/
	async handleWithErrorFallback(app, state, renderRouteCallback) {
		if (!state.routeData) return new Response(null, {
			status: 404,
			headers: { [ASTRO_ERROR_HEADER]: "true" }
		});
		let nextError;
		try {
			return await this.handle(state, async (s, ctx) => {
				try {
					return await renderRouteCallback(s, ctx);
				} catch (err) {
					nextError = err;
					throw err;
				}
			});
		} catch (err) {
			if (err === nextError) throw err;
			app.logger.error(null, err.stack || err.message || String(err));
			return app.renderError(state.request, {
				...state.renderOptions,
				status: 500,
				error: err,
				pathname: state.pathname
			});
		}
	}
	#finalize(state, response) {
		attachCookiesToResponse(response, state.cookies);
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/pages/handler.js
var EMPTY_SLOTS = Object.freeze({});
var PagesHandler = class {
	#pipeline;
	constructor(pipeline) {
		this.#pipeline = pipeline;
	}
	async handle(state, ctx) {
		const { logger, streaming } = this.#pipeline;
		state.resetResponseMetadata();
		let response;
		const componentInstance = await state.loadComponentInstance();
		switch (state.routeData.type) {
			case "endpoint":
				response = await renderEndpoint(componentInstance, ctx, state.routeData.prerender, logger, state);
				break;
			case "page": {
				const props = await state.getProps();
				const actionApiContext = state.getActionAPIContext();
				const result = await state.createResult(componentInstance, actionApiContext);
				try {
					response = await renderPage(result, componentInstance?.default, props, state.slots ?? EMPTY_SLOTS, streaming, state.routeData);
				} catch (e) {
					result.cancelled = true;
					throw e;
				}
				state.responseRouteType = "page";
				if (state.routeData.route === "/404" || state.routeData.route === "/500") state.skipErrorReroute = true;
				break;
			}
			case "redirect": return new Response(null, {
				status: 404,
				headers: { [ASTRO_ERROR_HEADER]: "true" }
			});
			case "fallback":
				state.responseRouteType = "fallback";
				return new Response(null, { status: 500 });
		}
		const responseCookies = getCookiesFromResponse(response);
		if (responseCookies) state.cookies.merge(responseCookies);
		state.response = response;
		return response;
	}
	/**
	* Like `handle`, but mirrors the app-level error handling that
	* `AstroHandler` provides on the standard path: unmatched routes
	* return a 404 marked with `X-Astro-Error` for the app's post-check
	* to render the 404 error page, and render-time errors are logged
	* and render the 500 error page instead of propagating to the host
	* framework.
	*
	* Used by the composable `astro/fetch` `pages()` entry point, where
	* there is no surrounding `AstroHandler` to supply this fallback.
	*/
	async handleWithErrorFallback(app, state) {
		if (!state.routeData) return new Response(null, {
			status: 404,
			headers: { [ASTRO_ERROR_HEADER]: "true" }
		});
		const ctx = state.getAPIContext();
		if (this.#pipeline.manifest.checkOrigin && isForbiddenCrossOriginRequest(ctx.request, ctx.url, ctx.isPrerendered)) return createCrossOriginForbiddenResponse(ctx.request);
		try {
			return await this.handle(state, ctx);
		} catch (err) {
			app.logger.error(null, err.stack || err.message || String(err));
			return app.renderError(state.request, {
				...state.renderOptions,
				status: 500,
				error: err,
				pathname: state.pathname
			});
		}
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/util/normalized-url.js
function createNormalizedUrl(requestUrl) {
	return normalizeUrl(new URL(requestUrl));
}
function normalizeUrl(url) {
	try {
		url.pathname = validateAndDecodePathname(url.pathname);
	} catch {
		try {
			url.pathname = decodeURI(url.pathname);
		} catch {}
	}
	url.pathname = collapseDuplicateSlashes(url.pathname);
	return url;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/rewrites/handler.js
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
	const pipeline = state.pipeline;
	const oldPathname = state.pathname;
	const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
	if (pipeline.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) throw new AstroError({
		...ForbiddenRewrite,
		message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
		hint: ForbiddenRewrite.hint(routeData.component)
	});
	state.routeData = routeData;
	state.componentInstance = componentInstance;
	if (payload instanceof Request) state.request = payload;
	else state.request = copyRequest(newUrl, state.request, routeData.prerender, pipeline.logger, state.routeData.route);
	state.url = createNormalizedUrl(state.request.url);
	if (mergeCookies) {
		const newCookies = new AstroCookies(state.request);
		if (state.cookies) newCookies.merge(state.cookies);
		state.cookies = newCookies;
	}
	state.params = getParams(routeData, pathname);
	state.pathname = pathname;
	state.isRewriting = true;
	state.status = 200;
	setOriginPathname(state.request, oldPathname, pipeline.manifest.trailingSlash, pipeline.manifest.buildFormat);
	state.invalidateContexts();
}
var Rewrites = class {
	async execute(state, payload) {
		const pipeline = state.pipeline;
		pipeline.logger.debug("router", "Calling rewrite: ", payload);
		applyRewriteToState(state, payload, await pipeline.tryRewrite(payload, state.request), { mergeCookies: true });
		const middleware = new AstroMiddleware(pipeline);
		const pagesHandler = new PagesHandler(pipeline);
		return middleware.handle(state, pagesHandler.handle.bind(pagesHandler));
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/routing/match.js
function matchRoute(pathname, manifest) {
	if (isRoute404(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute404(route.route));
		if (errorRoute) return errorRoute;
	}
	if (isRoute500(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute500(route.route));
		if (errorRoute) return errorRoute;
	}
	return manifest.routes.find((route) => {
		return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
	});
}
function isRoute404or500(route) {
	return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
	return route.component === SERVER_ISLAND_COMPONENT;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/i18n/domain.js
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, logger, pathnameFromRequest) {
	let pathname = void 0;
	if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
		let host = request.headers.get("X-Forwarded-Host");
		let protocol = request.headers.get("X-Forwarded-Proto");
		if (protocol) protocol = protocol + ":";
		else protocol = url.protocol;
		if (!host) host = request.headers.get("Host");
		if (host && protocol) {
			host = host.split(":")[0];
			try {
				let locale;
				const hostAsUrl = new URL(`${protocol}//${host}`);
				for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
					const domainKeyAsUrl = new URL(domainKey);
					if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
						locale = localeValue;
						break;
					}
				}
				if (locale) {
					const requestPathname = pathnameFromRequest ?? removeBase(url.pathname, base);
					pathname = prependForwardSlash(joinPaths(normalizeTheLocale(locale), requestPathname));
					if (trailingSlash === "always") pathname = appendForwardSlash(pathname);
					else if (trailingSlash === "never") pathname = removeTrailingForwardSlash(pathname);
					else if (requestPathname.endsWith("/")) pathname = appendForwardSlash(pathname);
				}
			} catch (e) {
				logger.error("router", `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`);
				logger.error("router", `Error: ${e}`);
			}
		}
	}
	return pathname;
}
function removeBase(pathname, base) {
	pathname = collapseDuplicateLeadingSlashes(pathname);
	if (pathname.startsWith(base)) return pathname.slice(removeTrailingForwardSlash(base).length + 1);
	return pathname;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/render-options.js
var renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
	return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
	Reflect.set(request, renderOptionsSymbol, options);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/validate-headers.js
function getFirstForwardedValue(multiValueHeader) {
	return multiValueHeader?.toString().split(",").map((e) => e.trim())[0];
}
function sanitizeHost(hostname) {
	if (!hostname) return void 0;
	if (/[/\\]/.test(hostname)) return void 0;
	return hostname;
}
function parseHost(host) {
	const parts = host.split(":");
	return {
		hostname: parts[0],
		port: parts[1]
	};
}
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
	const urlString = `${protocol}://${port ? `${hostname}:${port}` : hostname}`;
	if (!URL.canParse(urlString)) return false;
	const testUrl = new URL(urlString);
	return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
function validateHost(host, protocol, allowedDomains) {
	if (!host || host.length === 0) return void 0;
	if (!allowedDomains || allowedDomains.length === 0) return void 0;
	const sanitized = sanitizeHost(host);
	if (!sanitized) return void 0;
	const { hostname, port } = parseHost(sanitized);
	if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) return sanitized;
}
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
	const result = {};
	if (forwardedProtocol) {
		if (allowedDomains && allowedDomains.length > 0) {
			if (allowedDomains.some((pattern) => pattern.protocol !== void 0)) try {
				const testUrl = new URL(`${forwardedProtocol}://example.com`);
				if (allowedDomains.some((pattern) => matchPattern(testUrl, { protocol: pattern.protocol }))) result.protocol = forwardedProtocol;
			} catch {}
			else if (/^https?$/.test(forwardedProtocol)) result.protocol = forwardedProtocol;
		}
	}
	if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
		if (allowedDomains.some((pattern) => pattern.port !== void 0)) {
			if (allowedDomains.some((pattern) => pattern.port === forwardedPort)) result.port = forwardedPort;
		}
	}
	if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
		const protoForValidation = result.protocol || "https";
		const sanitized = sanitizeHost(forwardedHost);
		if (sanitized) {
			const { hostname, port: portFromHost } = parseHost(sanitized);
			if (matchesAllowedDomains(hostname, protoForValidation, result.port || portFromHost, allowedDomains)) result.host = sanitized;
		}
	}
	return result;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/fetch/fetch-state.js
var FetchState = class {
	pipeline;
	/**
	* The request to render. Mutated during rewrites so subsequent renders
	* see the rewritten URL.
	*/
	request;
	routeData;
	/**
	* The pathname to use for routing and rendering. Starts out as the raw,
	* base-stripped, decoded pathname from the request. May be further
	* normalized by `AstroHandler` after routeData is known (in dev, when
	* the matched route has no `.html` extension, `.html` / `/index.html`
	* suffixes are stripped).
	*/
	pathname;
	/** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
	renderOptions;
	/** When the request started, used to log duration. */
	timeStart;
	/**
	* The route's loaded component module. Set before middleware runs; may
	* be swapped during in-flight rewrites from inside the middleware chain.
	*/
	componentInstance;
	/**
	* Slot overrides supplied by the container API. `undefined` for HTTP
	* requests — `PagesHandler` coalesces to `{}` on read so we don't
	* allocate an empty object per request.
	*/
	slots;
	/**
	* The `Response` produced by handlers, if any. Set after page
	* rendering or middleware completes.
	*/
	response;
	/**
	* Default HTTP status for the rendered response. Callers override
	* before rendering runs (e.g. `AstroHandler` sets this from
	* `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
	*/
	status = 200;
	/** Whether user middleware should be skipped for this request. */
	skipMiddleware = false;
	/**
	* Set to `true` when the request path was encoded too many times to fully
	* decode (see {@link validateAndDecodePathname}). These requests are
	* rejected with a `400` before middleware or routing run.
	*/
	invalidEncoding = false;
	/** A flag that tells the render content if the rewriting was triggered. */
	isRewriting = false;
	/** A safety net in case of loops (rewrite counter). */
	counter = 0;
	/** Cookies for this request. Created lazily on first access. */
	cookies;
	/** Route params derived from routeData + pathname. Computed lazily. */
	#params;
	get params() {
		if (!this.#params && this.routeData) this.#params = getParams(this.routeData, this.pathname);
		return this.#params;
	}
	set params(value) {
		this.#params = value;
	}
	/** Normalized URL for this request. */
	url;
	/** Client address for this request. */
	clientAddress;
	/** Whether this is a partial render (container API). */
	partial;
	/** Internal metadata about the current response route type. */
	responseRouteType;
	/** Internal flag to prevent rerouting this response to an error page. */
	skipErrorReroute = false;
	/** Whether to inject CSP meta tags. */
	shouldInjectCspMetaTags;
	/** Request-scoped locals object, shared with user middleware. */
	locals = {};
	/**
	* Memoized `props` (see `getProps`). `null` means "not yet computed"
	* — using `null` (rather than `undefined`) keeps the hidden class
	* stable and distinct from a valid-but-empty result.
	*/
	props = null;
	/** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
	actionApiContext = null;
	/** Memoized `APIContext` (see `getAPIContext`). */
	apiContext = null;
	/** Registered context providers keyed by name. Lazy-initialized on first provide(). */
	#providers;
	/** Cached values from resolved providers. Lazy-initialized on first resolve(). */
	#providersResolvedValues;
	/** Cached promise for lazy component instance loading. */
	#componentInstancePromise;
	/** SSR result for the current page render. */
	result;
	/** Initial props (from container/error handler). */
	initialProps = {};
	/** Rewrites handler instance. Lazy-initialized on first rewrite(). */
	#rewrites;
	/** Memoized Astro page partial. */
	#astroPagePartial;
	/**
	* Locale-prefixed pathname derived from the Host header for domain-based
	* i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
	* isn't served from a locale-mapped domain. When set, `this.pathname` is
	* derived from it so locale/param resolution match the route pattern.
	*/
	#domainPathname;
	/** Memoized current locale. */
	#currentLocale;
	/** Memoized preferred locale. */
	#preferredLocale;
	/** Memoized preferred locale list. */
	#preferredLocaleList;
	constructor(pipeline, request, options) {
		this.pipeline = pipeline;
		this.request = request;
		options ??= getRenderOptions(request);
		this.routeData = options?.routeData;
		const self = this;
		this.renderOptions = {
			...options ?? {
				addCookieHeader: false,
				clientAddress: void 0,
				prerenderedErrorPageFetch: fetch,
				routeData: void 0,
				waitUntil: void 0
			},
			get locals() {
				return self.locals;
			}
		};
		this.componentInstance = void 0;
		this.slots = void 0;
		const url = new URL(request.url);
		const publicPathname = this.#normalizePathname(url.pathname);
		const pathname = this.#computePathname(publicPathname);
		url.pathname = publicPathname;
		url.pathname = collapseDuplicateSlashes(url.pathname);
		const domainPathname = computePathnameFromDomain(request, url, pipeline.manifest.i18n, pipeline.manifest.base, pipeline.manifest.trailingSlash, pipeline.logger, pathname);
		if (domainPathname) {
			this.#domainPathname = domainPathname;
			this.pathname = domainPathname;
		} else this.pathname = pathname;
		this.timeStart = performance.now();
		this.clientAddress = options?.clientAddress;
		this.locals = options?.locals ?? {};
		this.url = url;
		this.cookies = new AstroCookies(request);
		if (pipeline.manifest.allowedDomains && pipeline.manifest.allowedDomains.length > 0 && !this.routeData?.prerender) this.#applyForwardedHeaders();
		if (!Reflect.get(this.request, originPathnameSymbol)) setOriginPathname(this.request, this.pathname, pipeline.manifest.trailingSlash, pipeline.manifest.buildFormat);
		this.#resolveRouteData();
	}
	/**
	* Triggers a rewrite. Delegates to the Rewrites handler.
	*/
	rewrite(payload) {
		return (this.#rewrites ??= new Rewrites()).execute(this, payload);
	}
	/**
	* Creates the SSR result for the current page render.
	*/
	async createResult(mod, ctx) {
		const pipeline = this.pipeline;
		const { clientDirectives, inlinedScripts, compressHTML, manifest, renderers, resolve } = pipeline;
		const routeData = this.routeData;
		const { links, scripts, styles } = await pipeline.headElements(routeData);
		const extraStyleHashes = [];
		const extraScriptHashes = [];
		const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest.shouldInjectCspMetaTags;
		const cspAlgorithm = manifest.csp?.algorithm ?? "SHA-256";
		if (shouldInjectCspMetaTags) {
			for (const style of styles) extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
			for (const script of scripts) extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
		}
		const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest.componentMetadata;
		const headers = new Headers({ "Content-Type": "text/html" });
		const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
		const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
		const status = this.status;
		const response = {
			status: actionResult?.error ? actionResult?.error.status : status,
			statusText: actionResult?.error ? actionResult?.error.type : "OK",
			get headers() {
				return headers;
			},
			set headers(_) {
				throw new AstroError(AstroResponseHeadersReassigned);
			}
		};
		const state = this;
		const result = {
			base: manifest.base,
			userAssetsBase: manifest.userAssetsBase,
			cancelled: false,
			clientDirectives,
			inlinedScripts,
			componentMetadata,
			compressHTML,
			cookies: this.cookies,
			createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
			links,
			params: this.params,
			partial,
			pathname: this.pathname,
			renderers,
			resolve,
			response,
			request: this.request,
			scripts,
			styles,
			actionResult,
			async getServerIslandNameMap() {
				return (await pipeline.getServerIslands()).serverIslandNameMap ?? /* @__PURE__ */ new Map();
			},
			key: manifest.key,
			trailingSlash: manifest.trailingSlash,
			_metadata: {
				hasHydrationScript: false,
				rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
				hasRenderedHead: false,
				renderedScripts: /* @__PURE__ */ new Set(),
				hasDirectives: /* @__PURE__ */ new Set(),
				hasRenderedServerIslandRuntime: false,
				headInTree: false,
				extraHead: [],
				extraStyleHashes,
				extraScriptHashes,
				propagators: /* @__PURE__ */ new Set(),
				routeHasPropagation: false,
				pendingSlotEvaluations: [],
				templateDepth: 0
			},
			cspDestination: manifest.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
			shouldInjectCspMetaTags,
			cspAlgorithm,
			directives: manifest.csp?.directives ? [...manifest.csp.directives] : [],
			scriptHashes: manifest.csp?.scriptHashes ? [...manifest.csp.scriptHashes] : [],
			scriptResources: manifest.csp?.scriptResources ? [...manifest.csp.scriptResources] : [],
			styleHashes: manifest.csp?.styleHashes ? [...manifest.csp.styleHashes] : [],
			styleResources: manifest.csp?.styleResources ? [...manifest.csp.styleResources] : [],
			isStrictDynamic: manifest.csp?.isStrictDynamic ?? false,
			scriptDirective: {
				resources: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.resources] : [],
				hashes: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.hashes] : [],
				strictDynamic: manifest.csp?.scriptDirective?.strictDynamic ?? false
			},
			styleDirective: {
				resources: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.resources] : [],
				hashes: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.hashes] : []
			},
			speculationRulesContent: manifest.csp?.speculationRulesContent,
			internalFetchHeaders: manifest.internalFetchHeaders
		};
		this.result = result;
		return result;
	}
	/**
	* Creates the Astro global object for a component render.
	*/
	createAstro(result, props, slotValues, apiContext) {
		let astroPagePartial;
		if (this.isRewriting) this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
		this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
		astroPagePartial = this.#astroPagePartial;
		const astroComponentPartial = {
			props,
			self: null
		};
		const Astro = Object.assign(Object.create(astroPagePartial), astroComponentPartial);
		let _slots;
		Object.defineProperty(Astro, "slots", { get: () => {
			if (!_slots) _slots = new Slots(result, slotValues, this.pipeline.logger);
			return _slots;
		} });
		return Astro;
	}
	/**
	* Creates the Astro page-level partial (prototype for Astro global).
	*/
	createAstroPagePartial(result, apiContext) {
		const state = this;
		const { cookies, locals, params, pipeline, url } = this;
		const { response } = result;
		const redirect = (path, status = 302) => {
			if (state.request[responseSentSymbol$1]) throw new AstroError({ ...ResponseSentError });
			return new Response(null, {
				status,
				headers: { Location: path }
			});
		};
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		const callAction = createCallAction(apiContext);
		const partial = {
			generator: ASTRO_GENERATOR,
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			cookies,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			locals,
			redirect,
			rewrite,
			request: this.request,
			response,
			site: pipeline.site,
			getActionResult: createGetActionResult(locals),
			get callAction() {
				return callAction;
			},
			url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return {
					info(msg) {
						pipeline.logger.info(null, msg);
					},
					warn(msg) {
						pipeline.logger.warn(null, msg);
					},
					error(msg) {
						pipeline.logger.error(null, msg);
					}
				};
			}
		};
		this.defineProviderGetters(partial);
		return partial;
	}
	getClientAddress() {
		const { pipeline, clientAddress } = this;
		const routeData = this.routeData;
		if (routeData.prerender) throw new AstroError({
			...PrerenderClientAddressNotAvailable,
			message: PrerenderClientAddressNotAvailable.message(routeData.component)
		});
		if (clientAddress) return clientAddress;
		if (pipeline.adapterName) throw new AstroError({
			...ClientAddressNotAvailable,
			message: ClientAddressNotAvailable.message(pipeline.adapterName)
		});
		throw new AstroError(StaticClientAddressNotAvailable);
	}
	getCookies() {
		return this.cookies;
	}
	getCsp() {
		const state = this;
		const { pipeline } = this;
		if (!pipeline.manifest.csp) {
			if (pipeline.runtimeMode === "production") pipeline.logger.warn("csp", `context.csp was used when rendering the route ${s.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`);
			return;
		}
		const warnedFallback = /* @__PURE__ */ new Set();
		const warnFallback = (family, kind) => {
			if (kind === "default" || !state.result) return;
			const defaultResources = (family === "script" ? state.result.scriptDirective : state.result.styleDirective).resources.map(normalizeCspResourceEntry).filter((entry) => entry.kind === "default").map((entry) => entry.resource);
			if (defaultResources.length === 0) return;
			const key = `${family}:${kind}`;
			if (warnedFallback.has(key)) return;
			warnedFallback.add(key);
			const general = `${family}-src`;
			const specific = `${general}-${kind === "element" ? "elem" : "attr"}`;
			pipeline.logger.warn("csp", `A resource was added to \`${specific}\`, but \`${general}\` also defines custom resources (${defaultResources.join(" ")}). Because \`${specific}\` overrides \`${general}\` for its scope (browsers do not fall back), those resources will not apply there. Add them to \`${specific}\` as well if needed.`);
		};
		return {
			insertDirective(payload) {
				if (state.result) state.result.directives = pushDirective(state.result.directives, payload);
			},
			insertScriptResource(payload) {
				if (!state.result) return;
				warnFallback("script", normalizeCspResourceEntry(payload).kind);
				state.result.scriptDirective.resources.push(payload);
			},
			insertStyleResource(payload) {
				if (!state.result) return;
				warnFallback("style", normalizeCspResourceEntry(payload).kind);
				state.result.styleDirective.resources.push(payload);
			},
			insertStyleHash(payload) {
				state.result?.styleDirective.hashes.push(payload);
			},
			insertScriptHash(payload) {
				state.result?.scriptDirective.hashes.push(payload);
			}
		};
	}
	computeCurrentLocale() {
		const { url, pipeline: { i18n }, routeData } = this;
		if (!i18n || !routeData) return;
		const { defaultLocale, locales, strategy } = i18n;
		const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
		if (this.#currentLocale) return this.#currentLocale;
		let computedLocale;
		if (isRouteServerIsland(routeData)) {
			let referer = this.request.headers.get("referer");
			if (referer) {
				if (URL.canParse(referer)) referer = new URL(referer).pathname;
				computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
			}
		} else {
			let pathname = routeData.pathname;
			if (this.#domainPathname) pathname = this.pathname;
			else if (url && !routeData.pattern.test(url.pathname)) {
				for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(url.pathname)) {
					pathname = fallbackRoute.pathname;
					break;
				}
			}
			pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
			computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
			if (routeData.params.length > 0) {
				const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
				if (localeFromParams) computedLocale = localeFromParams;
			}
		}
		this.#currentLocale = computedLocale ?? fallbackTo;
		return this.#currentLocale;
	}
	computePreferredLocale() {
		const { pipeline: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
	}
	computePreferredLocaleList() {
		const { pipeline: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
	}
	/**
	* Lazily loads the route's component module. Returns the cached
	* instance if already loaded. The promise is cached so concurrent
	* callers share the same load.
	*/
	async loadComponentInstance() {
		if (this.componentInstance) return this.componentInstance;
		if (this.#componentInstancePromise) return this.#componentInstancePromise;
		this.#componentInstancePromise = this.pipeline.getComponentByRoute(this.routeData).then((mod) => {
			this.componentInstance = mod;
			return mod;
		});
		return this.#componentInstancePromise;
	}
	/**
	* Registers a context provider under the given key. Handlers call
	* this to contribute values to the request context (e.g. sessions).
	* The `create` factory is called lazily on the first `resolve(key)`.
	*/
	provide(key, provider) {
		(this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
	}
	/**
	* Lazily resolves a provider registered under `key`. Calls
	* `provider.create()` on first access and caches the result.
	* Returns `undefined` if no provider was registered for the key.
	*/
	resolve(key) {
		if (this.#providersResolvedValues?.has(key)) return this.#providersResolvedValues.get(key);
		const provider = this.#providers?.get(key);
		if (!provider) return void 0;
		const value = provider.create();
		(this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
		return value;
	}
	/**
	* Runs all registered `finalize` callbacks. Should be called after
	* the response is produced, typically in a `finally` block.
	*
	* Returns synchronously (no promise allocation) when nothing needs
	* finalizing — important for the hot path where sessions are not used.
	*/
	finalizeAll() {
		if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
		let chain;
		for (const [key, provider] of this.#providers) if (provider.finalize && this.#providersResolvedValues.has(key)) {
			const result = provider.finalize(this.#providersResolvedValues.get(key));
			if (result) chain = chain ? chain.then(() => result) : result;
		}
		return chain;
	}
	/**
	* Adds lazy getters to `target` for each registered provider key.
	* Used by context creation (APIContext, Astro global) so that
	* provider values like `session` and `cache` appear as properties
	* without hard-coding the keys.
	*
	* Always defines a `session` getter (returning `undefined` when no
	* provider is registered) so `ctx.session` / `Astro.session` is a
	* present property regardless of whether the sessions handler was
	* included in the pipeline.
	*/
	defineProviderGetters(target) {
		const state = this;
		if (this.#providers) for (const key of this.#providers.keys()) Object.defineProperty(target, key, {
			get: () => state.resolve(key),
			enumerable: true,
			configurable: true
		});
		if (!this.#providers?.has("session")) {
			let warned = false;
			Object.defineProperty(target, "session", {
				get() {
					if (!warned) {
						warned = true;
						state.pipeline.logger.warn("session", "`Astro.session` was accessed but no session storage is configured. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/");
					}
				},
				enumerable: true,
				configurable: true
			});
		}
	}
	/**
	* Resolves the route to use for this request and stores it on
	* `this.routeData`. If the adapter (or the dev server) provided a
	* `routeData` via render options it's already set and this is a
	* no-op. Otherwise we use the app's synchronous route matcher and
	* fall back to a `404.astro` route so middleware can still run.
	*
	* Called eagerly from the constructor so individual handlers
	* (actions, pages, middleware, etc.) always see a resolved route
	* without the caller needing an extra setup step.
	*
	* Once routeData is known, finalizes `this.pathname`: in dev, if the
	* matched route has no `.html` extension, strip `.html` / `/index.html`
	* suffixes so the rendering pipeline sees the canonical pathname.
	*/
	/**
	* Strip `.html` / `/index.html` suffixes from the pathname so the
	* rendering pipeline sees the canonical route path. Only applies to
	* page routes where `.html` is framework-injected. Endpoint routes
	* preserve `.html` because any such suffix is user-provided (e.g.
	* from `getStaticPaths` params). Skipped when the matched route
	* itself has an `.html` extension in its definition.
	*/
	#stripHtmlExtension() {
		if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
	}
	#resolveRouteData() {
		const pipeline = this.pipeline;
		if (this.routeData) {
			this.#stripHtmlExtension();
			return;
		}
		const matched = pipeline.matchRoute(this.pathname);
		if (matched && matched.prerender && pipeline.manifest.serverLike) {
			if (matched.params.length > 0) {
				const allMatches = pipeline.matchAllRoutes(this.pathname);
				this.routeData = allMatches.find((r) => !r.prerender);
			} else this.routeData = void 0;
		} else this.routeData = matched;
		pipeline.logger.debug("router", "Astro matched the following route for " + this.request.url);
		pipeline.logger.debug("router", "RouteData:\n" + this.routeData);
		if (!this.routeData) {
			const custom404 = getCustom404Route(pipeline.manifestData);
			if (custom404 && !custom404.prerender) this.routeData = custom404;
		}
		if (!this.routeData) {
			pipeline.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
			pipeline.logger.debug("router", "Here's the available routes:\n", pipeline.manifestData);
			return;
		}
		this.#stripHtmlExtension();
	}
	/**
	* Strips the pipeline's base from a normalized request pathname and prepends
	* a forward slash.
	*
	* Mirrors `BaseApp.removeBase`, including the
	* `collapseDuplicateLeadingSlashes` fix that prevents middleware
	* authorization bypass when the URL starts with `//`.
	*/
	#computePathname(normalizedPathname) {
		let pathname = collapseDuplicateLeadingSlashes(normalizedPathname);
		const base = this.pipeline.manifest.base;
		if (pathname.startsWith(base)) {
			const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
			pathname = pathname.slice(baseWithoutTrailingSlash.length + 1);
		}
		return prependForwardSlash(pathname);
	}
	/**
	* Decodes and normalizes the public request pathname before deriving the
	* separate pathname used for route matching.
	*/
	#normalizePathname(pathname) {
		try {
			pathname = validateAndDecodePathname(pathname);
		} catch (e) {
			if (e instanceof MultiLevelEncodingError) this.invalidEncoding = true;
			else this.pipeline.logger.error(null, e.toString());
		}
		return collapseDuplicateSlashes(pathname);
	}
	/**
	* Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
	* from the request headers, validates them against the manifest's
	* `allowedDomains`, and updates `this.url` accordingly. Also resolves
	* `clientAddress` from X-Forwarded-For when the host is trusted.
	*
	* Only called when `allowedDomains` is configured — without it,
	* forwarded headers are never trusted.
	*/
	#applyForwardedHeaders() {
		const headers = this.request.headers;
		const allowedDomains = this.pipeline.manifest.allowedDomains;
		const validated = validateForwardedHeaders(getFirstForwardedValue(headers.get("x-forwarded-proto") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-host") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-port") ?? void 0), allowedDomains);
		if (!validated.protocol && !validated.host && !validated.port) return;
		if (validated.protocol) this.url.protocol = validated.protocol + ":";
		if (validated.host) {
			const colonIdx = validated.host.indexOf(":");
			if (colonIdx !== -1) {
				this.url.hostname = validated.host.slice(0, colonIdx);
				this.url.port = validated.host.slice(colonIdx + 1);
			} else {
				this.url.hostname = validated.host;
				this.url.port = "";
			}
		}
		if (validated.port) this.url.port = validated.port;
		if (validated.host !== void 0 && !this.clientAddress) {
			const forwardedFor = getFirstForwardedValue(this.request.headers.get("x-forwarded-for") ?? void 0);
			if (forwardedFor) this.clientAddress = forwardedFor;
		}
		const oldRequest = this.request;
		this.request = new Request(this.url, oldRequest);
		const app = Reflect.get(oldRequest, appSymbol);
		if (app !== void 0) Reflect.set(this.request, appSymbol, app);
	}
	/**
	* Returns the resolved `props` for this render, computing them lazily
	* from the route + component module on first access. If the
	* `initialProps` already carries user-supplied props (e.g. the
	* container API) those are used verbatim.
	*/
	async getProps() {
		if (this.props !== null) return this.props;
		if (Object.keys(this.initialProps).length > 0) {
			this.props = this.initialProps;
			return this.props;
		}
		const pipeline = this.pipeline;
		const mod = await this.loadComponentInstance();
		this.props = await getProps({
			mod,
			routeData: this.routeData,
			routeCache: pipeline.routeCache,
			pathname: this.pathname,
			logger: pipeline.logger,
			serverLike: pipeline.manifest.serverLike,
			base: pipeline.manifest.base,
			trailingSlash: pipeline.manifest.trailingSlash
		});
		return this.props;
	}
	/**
	* Returns the `ActionAPIContext` for this render, creating it lazily.
	* Used by middleware, actions, and page dispatch.
	*/
	getActionAPIContext() {
		if (this.actionApiContext !== null) return this.actionApiContext;
		const state = this;
		const ctx = {
			get cookies() {
				return state.cookies;
			},
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			generator: ASTRO_GENERATOR,
			get locals() {
				return state.locals;
			},
			set locals(_) {
				throw new AstroError(LocalsReassigned);
			},
			params: this.params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			request: this.request,
			site: this.pipeline.site,
			url: this.url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return {
					info(msg) {
						state.pipeline.logger.info(null, msg);
					},
					warn(msg) {
						state.pipeline.logger.warn(null, msg);
					},
					error(msg) {
						state.pipeline.logger.error(null, msg);
					}
				};
			}
		};
		this.defineProviderGetters(ctx);
		this.actionApiContext = ctx;
		return this.actionApiContext;
	}
	/**
	* Returns the `APIContext` for this render, creating it lazily from
	* the memoized props + action context.
	*
	* Callers must ensure `getProps()` has resolved at least once before
	* calling this.
	*/
	getAPIContext() {
		if (this.apiContext !== null) return this.apiContext;
		const actionApiContext = this.getActionAPIContext();
		const state = this;
		const redirect = (path, status = 302) => new Response(null, {
			status,
			headers: { Location: path }
		});
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		Reflect.set(actionApiContext, pipelineSymbol, this.pipeline);
		actionApiContext[fetchStateSymbol] = this;
		this.apiContext = Object.assign(actionApiContext, {
			props: this.props,
			redirect,
			rewrite,
			getActionResult: createGetActionResult(actionApiContext.locals),
			callAction: createCallAction(actionApiContext)
		});
		return this.apiContext;
	}
	/**
	* Invalidates the cached `APIContext` so the next `getAPIContext()`
	* call re-derives it from the (possibly mutated) state. Used
	* after an in-flight rewrite swaps the route / request / params.
	*/
	invalidateContexts() {
		this.props = null;
		this.actionApiContext = null;
		this.apiContext = null;
	}
	resetResponseMetadata() {
		this.responseRouteType = void 0;
		this.skipErrorReroute = false;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/actions/handler.js
var ActionHandler = class {
	/**
	* Run action handling for the current request. Expects the APIContext
	* that is already being used by the render pipeline.
	*
	* Returns a `Response` when the action fully handles the request (RPC),
	* or `undefined` when the caller should continue processing the
	* request (form actions or non-action requests).
	*/
	handle(apiContext, state) {
		state.pipeline.usedFeatures |= PipelineFeatures.actions;
		if (apiContext.isPrerendered) return;
		const { action, setActionResult } = getActionContext(apiContext);
		if (!action) return;
		if (state.pipeline.manifest.checkOrigin && isForbiddenCrossOriginRequest(apiContext.request, apiContext.url, apiContext.isPrerendered)) return Promise.resolve(createCrossOriginForbiddenResponse(apiContext.request));
		return this.#executeAction(action, setActionResult);
	}
	async #executeAction(action, setActionResult) {
		const serialized = serializeActionResult(await action.handler());
		if (action.calledFrom === "rpc") {
			if (serialized.type === "empty") return new Response(null, { status: serialized.status });
			return new Response(serialized.body, {
				status: serialized.status,
				headers: { "Content-Type": serialized.contentType }
			});
		}
		setActionResult(action.name, serialized);
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/prepare-response.js
function prepareResponse(response, { addCookieHeader }) {
	if (addCookieHeader) for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) response.headers.append("set-cookie", setCookieHeaderValue);
	Reflect.set(response, responseSentSymbol$1, true);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/routing/3xx.js
function redirectTemplate({ status, absoluteLocation, relativeLocation, from }) {
	const delay = status === 302 ? 2 : 0;
	const rel = escape(String(relativeLocation));
	return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${escape(String(absoluteLocation))}">
<body>
	<a href="${rel}">Redirecting ${from ? `from <code>${escape(from)}</code> ` : ""}to <code>${rel}</code></a>
</body>`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/routing/trailing-slash-handler.js
var TrailingSlashHandler = class {
	#app;
	constructor(app) {
		this.#app = app;
	}
	/**
	* Returns a redirect `Response` if the request pathname needs
	* normalization, or `undefined` if no redirect is required.
	*/
	handle(state) {
		const url = new URL(state.request.url);
		const redirect = this.#redirectTrailingSlash(url.pathname);
		if (redirect === url.pathname) return;
		const addCookieHeader = state.renderOptions.addCookieHeader;
		const status = state.request.method === "GET" ? 301 : 308;
		const response = new Response(redirectTemplate({
			status,
			relativeLocation: url.pathname,
			absoluteLocation: redirect,
			from: state.request.url
		}), {
			status,
			headers: { location: redirect + url.search }
		});
		prepareResponse(response, { addCookieHeader });
		return response;
	}
	#redirectTrailingSlash(pathname) {
		const { trailingSlash } = this.#app.manifest;
		if (pathname === "/" || isInternalPath(pathname)) return pathname;
		const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
		if (path !== pathname) return path;
		if (trailingSlash === "ignore") return pathname;
		if (trailingSlash === "always" && !hasFileExtension(pathname)) return appendForwardSlash(pathname);
		if (trailingSlash === "never") return removeTrailingForwardSlash(pathname);
		return pathname;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/cache/runtime/utils.js
function defaultSetHeaders(options) {
	const headers = new Headers();
	const directives = [];
	if (options.maxAge !== void 0) directives.push(`max-age=${options.maxAge}`);
	if (options.swr !== void 0) directives.push(`stale-while-revalidate=${options.swr}`);
	if (directives.length > 0) headers.set("CDN-Cache-Control", directives.join(", "));
	if (options.tags && options.tags.length > 0) headers.set("Cache-Tag", options.tags.join(", "));
	if (options.lastModified) headers.set("Last-Modified", options.lastModified.toUTCString());
	if (options.etag) headers.set("ETag", options.etag);
	return headers;
}
function isLiveDataEntry(value) {
	return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/cache/runtime/cache.js
var APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
var IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
var AstroCache = class {
	#options = {};
	#tags = /* @__PURE__ */ new Set();
	#disabled = false;
	#provider;
	enabled = true;
	constructor(provider) {
		this.#provider = provider;
	}
	set(input) {
		if (input === false) {
			this.#disabled = true;
			this.#tags.clear();
			this.#options = {};
			return;
		}
		this.#disabled = false;
		let options;
		if (isLiveDataEntry(input)) {
			if (!input.cacheHint) return;
			options = input.cacheHint;
		} else options = input;
		if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
		if ("swr" in options && options.swr !== void 0) this.#options.swr = options.swr;
		if ("etag" in options && options.etag !== void 0) this.#options.etag = options.etag;
		if (options.lastModified !== void 0) {
			if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) this.#options.lastModified = options.lastModified;
		}
		if (options.tags) for (const tag of options.tags) this.#tags.add(tag);
	}
	get tags() {
		return [...this.#tags];
	}
	/**
	* Get the current cache options (read-only snapshot).
	* Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
	*/
	get options() {
		return {
			...this.#options,
			tags: this.tags
		};
	}
	async invalidate(input) {
		if (!this.#provider) throw new AstroError(CacheNotEnabled);
		let options;
		if (isLiveDataEntry(input)) options = { tags: input.cacheHint?.tags ?? [] };
		else options = input;
		return this.#provider.invalidate(options);
	}
	/** @internal */
	[APPLY_HEADERS](response, request) {
		if (this.#disabled) return;
		const finalOptions = {
			...this.#options,
			tags: this.tags
		};
		if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
		const headers = this.#provider?.setHeaders?.(finalOptions, request) ?? defaultSetHeaders(finalOptions);
		for (const [key, value] of headers) response.headers.set(key, value);
	}
	/** @internal */
	get [IS_ACTIVE]() {
		return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
	}
};
function applyCacheHeaders(cache, response, request) {
	if (APPLY_HEADERS in cache) cache[APPLY_HEADERS](response, request);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/routing/parts.js
var ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
var ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
	const result = [];
	part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
		if (!str) return;
		const dynamic = i % 2 === 1;
		const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
		if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
		result.push({
			content,
			dynamic,
			spread: dynamic && ROUTE_SPREAD.test(content)
		});
	});
	return result;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/cache/runtime/route-matching.js
function compileCacheRoutes(routes, base, trailingSlash) {
	const compiled = Object.entries(routes).map(([path, options]) => {
		const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s) => getParts(s, path));
		return {
			pattern: getPattern(segments, base, trailingSlash),
			options,
			segments,
			route: path
		};
	});
	compiled.sort((a, b) => routeComparator({
		segments: a.segments,
		route: a.route,
		type: "page"
	}, {
		segments: b.segments,
		route: b.route,
		type: "page"
	}));
	return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
	for (const route of compiledRoutes) if (route.pattern.test(pathname)) return route.options;
	return null;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/cache/handler.js
var CACHE_KEY = "cache";
function provideCache(state) {
	const pipeline = state.pipeline;
	if (!pipeline.cacheConfig) {
		state.provide(CACHE_KEY, { create: () => new DisabledAstroCache(pipeline.logger) });
		return;
	}
	if (pipeline.runtimeMode === "development") {
		state.provide(CACHE_KEY, { create: () => new NoopAstroCache() });
		return;
	}
	return provideCacheAsync(state, pipeline);
}
async function provideCacheAsync(state, pipeline) {
	const cacheProvider = await pipeline.getCacheProvider();
	state.provide(CACHE_KEY, { create() {
		const cache = new AstroCache(cacheProvider);
		if (pipeline.cacheConfig?.routes) {
			if (!pipeline.compiledCacheRoutes) pipeline.compiledCacheRoutes = compileCacheRoutes(pipeline.cacheConfig.routes, pipeline.manifest.base, pipeline.manifest.trailingSlash);
			const matched = matchCacheRoute(state.pathname, pipeline.compiledCacheRoutes);
			if (matched) cache.set(matched);
		}
		return cache;
	} });
}
var CacheHandler = class {
	#app;
	constructor(app) {
		this.#app = app;
	}
	async handle(state, next) {
		this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
		if (!this.#app.pipeline.cacheProvider) return next();
		const cache = state.resolve(CACHE_KEY);
		const cacheProvider = await this.#app.pipeline.getCacheProvider();
		if (cacheProvider?.onRequest) {
			const response2 = await cacheProvider.onRequest({
				request: state.request,
				url: new URL(state.request.url),
				waitUntil: state.renderOptions.waitUntil
			}, async () => {
				const res = await next();
				applyCacheHeaders(cache, res, state.request);
				return res;
			});
			response2.headers.delete("CDN-Cache-Control");
			response2.headers.delete("Cache-Tag");
			return response2;
		}
		const response = await next();
		applyCacheHeaders(cache, response, state.request);
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/redirects/render.js
function isExternalURL(url) {
	return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
	if (typeof redirect === "string") return isExternalURL(redirect);
	else return isExternalURL(redirect.destination);
}
function computeRedirectStatus(method, redirect, redirectRoute) {
	return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
	if (typeof redirectRoute !== "undefined") return getRouteGenerator(redirectRoute.segments, trailingSlash)(params) || redirectRoute?.pathname || "/";
	else if (typeof redirect === "string") {
		if (redirectIsExternal(redirect)) return redirect;
		else {
			let target = redirect;
			for (const param of Object.keys(params)) {
				const paramValue = params[param];
				target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
			}
			return target;
		}
	} else if (typeof redirect === "undefined") return "/";
	return redirect.destination;
}
async function renderRedirect(state) {
	state.pipeline.usedFeatures |= PipelineFeatures.redirects;
	const { redirect, redirectRoute } = state.routeData;
	const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
	const headers = { location: encodeURI(resolveRedirectTarget(state.params, redirect, redirectRoute, state.pipeline.manifest.trailingSlash)) };
	if (redirect && redirectIsExternal(redirect)) {
		if (typeof redirect === "string") return Response.redirect(redirect, status);
		else return Response.redirect(redirect.destination, status);
	}
	return new Response(null, {
		status,
		headers
	});
}
//#endregion
//#region node_modules/.pnpm/destr@2.0.5/node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
	if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
		warnKeyDropped(key);
		return;
	}
	return value;
}
function warnKeyDropped(key) {
	console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
	if (typeof value !== "string") return value;
	if (value[0] === "\"" && value[value.length - 1] === "\"" && value.indexOf("\\") === -1) return value.slice(1, -1);
	const _value = value.trim();
	if (_value.length <= 9) switch (_value.toLowerCase()) {
		case "true": return true;
		case "false": return false;
		case "undefined": return;
		case "null": return null;
		case "nan": return NaN;
		case "infinity": return Number.POSITIVE_INFINITY;
		case "-infinity": return Number.NEGATIVE_INFINITY;
	}
	if (!JsonSigRx.test(value)) {
		if (options.strict) throw new SyntaxError("[destr] Invalid JSON");
		return value;
	}
	try {
		if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
			if (options.strict) throw new Error("[destr] Possible prototype pollution");
			return JSON.parse(value, jsonParseTransform);
		}
		return JSON.parse(value);
	} catch (error) {
		if (options.strict) throw error;
		return value;
	}
}
//#endregion
//#region node_modules/.pnpm/unstorage@1.17.5/node_modules/unstorage/dist/shared/unstorage.zVDD2mZo.mjs
function wrapToPromise(value) {
	if (!value || typeof value.then !== "function") return Promise.resolve(value);
	return value;
}
function asyncCall(function_, ...arguments_) {
	try {
		return wrapToPromise(function_(...arguments_));
	} catch (error) {
		return Promise.reject(error);
	}
}
function isPrimitive(value) {
	const type = typeof value;
	return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
	const proto = Object.getPrototypeOf(value);
	return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
	if (isPrimitive(value)) return String(value);
	if (isPureObject(value) || Array.isArray(value)) return JSON.stringify(value);
	if (typeof value.toJSON === "function") return stringify$1(value.toJSON());
	throw new Error("[unstorage] Cannot stringify value!");
}
var BASE64_PREFIX = "base64:";
function serializeRaw(value) {
	if (typeof value === "string") return value;
	return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
	if (typeof value !== "string") return value;
	if (!value.startsWith(BASE64_PREFIX)) return value;
	return base64Decode(value.slice(7));
}
function base64Decode(input) {
	if (globalThis.Buffer) return Buffer.from(input, "base64");
	return Uint8Array.from(globalThis.atob(input), (c) => c.codePointAt(0));
}
function base64Encode(input) {
	if (globalThis.Buffer) return Buffer.from(input).toString("base64");
	return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
	if (!key) return "";
	return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
	return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
	base = normalizeKey(base);
	return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
	if (depth === void 0) return true;
	let substrCount = 0;
	let index = key.indexOf(":");
	while (index > -1) {
		substrCount++;
		index = key.indexOf(":", index + 1);
	}
	return substrCount <= depth;
}
function filterKeyByBase(key, base) {
	if (base) return key.startsWith(base) && key[key.length - 1] !== "$";
	return key[key.length - 1] !== "$";
}
//#endregion
//#region node_modules/.pnpm/unstorage@1.17.5/node_modules/unstorage/dist/index.mjs
function defineDriver(factory) {
	return factory;
}
var DRIVER_NAME = "memory";
var memory = defineDriver(() => {
	const data = /* @__PURE__ */ new Map();
	return {
		name: DRIVER_NAME,
		getInstance: () => data,
		hasItem(key) {
			return data.has(key);
		},
		getItem(key) {
			return data.get(key) ?? null;
		},
		getItemRaw(key) {
			return data.get(key) ?? null;
		},
		setItem(key, value) {
			data.set(key, value);
		},
		setItemRaw(key, value) {
			data.set(key, value);
		},
		removeItem(key) {
			data.delete(key);
		},
		getKeys() {
			return [...data.keys()];
		},
		clear() {
			data.clear();
		},
		dispose() {
			data.clear();
		}
	};
});
function createStorage(options = {}) {
	const context = {
		mounts: { "": options.driver || memory() },
		mountpoints: [""],
		watching: false,
		watchListeners: [],
		unwatch: {}
	};
	const getMount = (key) => {
		for (const base of context.mountpoints) if (key.startsWith(base)) return {
			base,
			relativeKey: key.slice(base.length),
			driver: context.mounts[base]
		};
		return {
			base: "",
			relativeKey: key,
			driver: context.mounts[""]
		};
	};
	const getMounts = (base, includeParent) => {
		return context.mountpoints.filter((mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)).map((mountpoint) => ({
			relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
			mountpoint,
			driver: context.mounts[mountpoint]
		}));
	};
	const onChange = (event, key) => {
		if (!context.watching) return;
		key = normalizeKey(key);
		for (const listener of context.watchListeners) listener(event, key);
	};
	const startWatch = async () => {
		if (context.watching) return;
		context.watching = true;
		for (const mountpoint in context.mounts) context.unwatch[mountpoint] = await watch(context.mounts[mountpoint], onChange, mountpoint);
	};
	const stopWatch = async () => {
		if (!context.watching) return;
		for (const mountpoint in context.unwatch) await context.unwatch[mountpoint]();
		context.unwatch = {};
		context.watching = false;
	};
	const runBatch = (items, commonOptions, cb) => {
		const batches = /* @__PURE__ */ new Map();
		const getBatch = (mount) => {
			let batch = batches.get(mount.base);
			if (!batch) {
				batch = {
					driver: mount.driver,
					base: mount.base,
					items: []
				};
				batches.set(mount.base, batch);
			}
			return batch;
		};
		for (const item of items) {
			const isStringItem = typeof item === "string";
			const key = normalizeKey(isStringItem ? item : item.key);
			const value = isStringItem ? void 0 : item.value;
			const options2 = isStringItem || !item.options ? commonOptions : {
				...commonOptions,
				...item.options
			};
			const mount = getMount(key);
			getBatch(mount).items.push({
				key,
				value,
				relativeKey: mount.relativeKey,
				options: options2
			});
		}
		return Promise.all([...batches.values()].map((batch) => cb(batch))).then((r) => r.flat());
	};
	const storage = {
		hasItem(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			return asyncCall(driver.hasItem, relativeKey, opts);
		},
		getItem(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			return asyncCall(driver.getItem, relativeKey, opts).then((value) => destr(value));
		},
		getItems(items, commonOptions = {}) {
			return runBatch(items, commonOptions, (batch) => {
				if (batch.driver.getItems) return asyncCall(batch.driver.getItems, batch.items.map((item) => ({
					key: item.relativeKey,
					options: item.options
				})), commonOptions).then((r) => r.map((item) => ({
					key: joinKeys(batch.base, item.key),
					value: destr(item.value)
				})));
				return Promise.all(batch.items.map((item) => {
					return asyncCall(batch.driver.getItem, item.relativeKey, item.options).then((value) => ({
						key: item.key,
						value: destr(value)
					}));
				}));
			});
		},
		getItemRaw(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (driver.getItemRaw) return asyncCall(driver.getItemRaw, relativeKey, opts);
			return asyncCall(driver.getItem, relativeKey, opts).then((value) => deserializeRaw(value));
		},
		async setItem(key, value, opts = {}) {
			if (value === void 0) return storage.removeItem(key);
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (!driver.setItem) return;
			await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
			if (!driver.watch) onChange("update", key);
		},
		async setItems(items, commonOptions) {
			await runBatch(items, commonOptions, async (batch) => {
				if (batch.driver.setItems) return asyncCall(batch.driver.setItems, batch.items.map((item) => ({
					key: item.relativeKey,
					value: stringify$1(item.value),
					options: item.options
				})), commonOptions);
				if (!batch.driver.setItem) return;
				await Promise.all(batch.items.map((item) => {
					return asyncCall(batch.driver.setItem, item.relativeKey, stringify$1(item.value), item.options);
				}));
			});
		},
		async setItemRaw(key, value, opts = {}) {
			if (value === void 0) return storage.removeItem(key, opts);
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (driver.setItemRaw) await asyncCall(driver.setItemRaw, relativeKey, value, opts);
			else if (driver.setItem) await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
			else return;
			if (!driver.watch) onChange("update", key);
		},
		async removeItem(key, opts = {}) {
			if (typeof opts === "boolean") opts = { removeMeta: opts };
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (!driver.removeItem) return;
			await asyncCall(driver.removeItem, relativeKey, opts);
			if (opts.removeMeta || opts.removeMata) await asyncCall(driver.removeItem, relativeKey + "$", opts);
			if (!driver.watch) onChange("remove", key);
		},
		async getMeta(key, opts = {}) {
			if (typeof opts === "boolean") opts = { nativeOnly: opts };
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			const meta = /* @__PURE__ */ Object.create(null);
			if (driver.getMeta) Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
			if (!opts.nativeOnly) {
				const value = await asyncCall(driver.getItem, relativeKey + "$", opts).then((value_) => destr(value_));
				if (value && typeof value === "object") {
					if (typeof value.atime === "string") value.atime = new Date(value.atime);
					if (typeof value.mtime === "string") value.mtime = new Date(value.mtime);
					Object.assign(meta, value);
				}
			}
			return meta;
		},
		setMeta(key, value, opts = {}) {
			return this.setItem(key + "$", value, opts);
		},
		removeMeta(key, opts = {}) {
			return this.removeItem(key + "$", opts);
		},
		async getKeys(base, opts = {}) {
			base = normalizeBaseKey(base);
			const mounts = getMounts(base, true);
			let maskedMounts = [];
			const allKeys = [];
			let allMountsSupportMaxDepth = true;
			for (const mount of mounts) {
				if (!mount.driver.flags?.maxDepth) allMountsSupportMaxDepth = false;
				const rawKeys = await asyncCall(mount.driver.getKeys, mount.relativeBase, opts);
				for (const key of rawKeys) {
					const fullKey = mount.mountpoint + normalizeKey(key);
					if (!maskedMounts.some((p) => fullKey.startsWith(p))) allKeys.push(fullKey);
				}
				maskedMounts = [mount.mountpoint, ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))];
			}
			const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
			return allKeys.filter((key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base));
		},
		async clear(base, opts = {}) {
			base = normalizeBaseKey(base);
			await Promise.all(getMounts(base, false).map(async (m) => {
				if (m.driver.clear) return asyncCall(m.driver.clear, m.relativeBase, opts);
				if (m.driver.removeItem) {
					const keys = await m.driver.getKeys(m.relativeBase || "", opts);
					return Promise.all(keys.map((key) => m.driver.removeItem(key, opts)));
				}
			}));
		},
		async dispose() {
			await Promise.all(Object.values(context.mounts).map((driver) => dispose(driver)));
		},
		async watch(callback) {
			await startWatch();
			context.watchListeners.push(callback);
			return async () => {
				context.watchListeners = context.watchListeners.filter((listener) => listener !== callback);
				if (context.watchListeners.length === 0) await stopWatch();
			};
		},
		async unwatch() {
			context.watchListeners = [];
			await stopWatch();
		},
		mount(base, driver) {
			base = normalizeBaseKey(base);
			if (base && context.mounts[base]) throw new Error(`already mounted at ${base}`);
			if (base) {
				context.mountpoints.push(base);
				context.mountpoints.sort((a, b) => b.length - a.length);
			}
			context.mounts[base] = driver;
			if (context.watching) Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
				context.unwatch[base] = unwatcher;
			}).catch(console.error);
			return storage;
		},
		async unmount(base, _dispose = true) {
			base = normalizeBaseKey(base);
			if (!base || !context.mounts[base]) return;
			if (context.watching && base in context.unwatch) {
				context.unwatch[base]?.();
				delete context.unwatch[base];
			}
			if (_dispose) await dispose(context.mounts[base]);
			context.mountpoints = context.mountpoints.filter((key) => key !== base);
			delete context.mounts[base];
		},
		getMount(key = "") {
			key = normalizeKey(key) + ":";
			const m = getMount(key);
			return {
				driver: m.driver,
				base: m.base
			};
		},
		getMounts(base = "", opts = {}) {
			base = normalizeKey(base);
			return getMounts(base, opts.parents).map((m) => ({
				driver: m.driver,
				base: m.mountpoint
			}));
		},
		keys: (base, opts = {}) => storage.getKeys(base, opts),
		get: (key, opts = {}) => storage.getItem(key, opts),
		set: (key, value, opts = {}) => storage.setItem(key, value, opts),
		has: (key, opts = {}) => storage.hasItem(key, opts),
		del: (key, opts = {}) => storage.removeItem(key, opts),
		remove: (key, opts = {}) => storage.removeItem(key, opts)
	};
	return storage;
}
function watch(driver, onChange, base) {
	return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {};
}
async function dispose(driver) {
	if (typeof driver.dispose === "function") await asyncCall(driver.dispose);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/session/runtime.js
var PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
var DEFAULT_COOKIE_NAME = "astro-session";
var VALID_COOKIE_REGEX = /^[\w-]+$/;
var unflatten = (parsed, _) => {
	return unflatten$1(parsed, { URL: (href) => new URL(href) });
};
var stringify = (data, _) => {
	return stringify$2(data, { URL: (val) => val instanceof URL && val.href });
};
var AstroSession = class AstroSession {
	#cookies;
	#config;
	#cookieConfig;
	#cookieName;
	#storage;
	#data;
	#sessionID;
	#toDestroy = /* @__PURE__ */ new Set();
	#toDelete = /* @__PURE__ */ new Set();
	#dirty = false;
	#cookieSet = false;
	#sessionIDFromCookie = false;
	#partial = true;
	#logger;
	#driverFactory;
	static #sharedStorage = /* @__PURE__ */ new Map();
	constructor({ cookies, config, runtimeMode, driverFactory, mockStorage, logger }) {
		this.#logger = logger;
		if (!config) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("No driver was defined in the session configuration and the adapter did not provide a default driver.")
		});
		this.#cookies = cookies;
		this.#driverFactory = driverFactory;
		const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config;
		let cookieConfigObject;
		if (typeof cookieConfig === "object") {
			const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
			this.#cookieName = name;
			cookieConfigObject = rest;
		} else this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
		this.#cookieConfig = {
			sameSite: "lax",
			secure: runtimeMode === "production",
			path: "/",
			...cookieConfigObject,
			httpOnly: true
		};
		this.#config = configRest;
		if (mockStorage) this.#storage = mockStorage;
	}
	/**
	* Gets a session value. Returns `undefined` if the session or value does not exist.
	*/
	async get(key) {
		return (await this.#ensureData()).get(key)?.data;
	}
	/**
	* Checks if a session value exists.
	*/
	async has(key) {
		return (await this.#ensureData()).has(key);
	}
	/**
	* Gets all session values.
	*/
	async keys() {
		return (await this.#ensureData()).keys();
	}
	/**
	* Gets all session values.
	*/
	async values() {
		return [...(await this.#ensureData()).values()].map((entry) => entry.data);
	}
	/**
	* Gets all session entries.
	*/
	async entries() {
		return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
	}
	/**
	* Deletes a session value.
	*/
	delete(key) {
		this.#data ??= /* @__PURE__ */ new Map();
		this.#data.delete(key);
		if (this.#partial) this.#toDelete.add(key);
		this.#dirty = true;
	}
	/**
	* Sets a session value. The session is created if it does not exist.
	*/
	set(key, value, { ttl } = {}) {
		if (!key) throw new AstroError({
			...SessionStorageSaveError,
			message: "The session key was not provided."
		});
		let cloned;
		try {
			cloned = unflatten(JSON.parse(stringify(value)));
		} catch (err) {
			throw new AstroError({
				...SessionStorageSaveError,
				message: `The session data for ${key} could not be serialized.`,
				hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
			}, { cause: err });
		}
		if (!this.#cookieSet) {
			this.#setCookie();
			this.#cookieSet = true;
		}
		this.#data ??= /* @__PURE__ */ new Map();
		const lifetime = ttl ?? this.#config.ttl;
		const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
		this.#data.set(key, {
			data: cloned,
			expires
		});
		this.#dirty = true;
	}
	/**
	* Destroys the session, clearing the cookie and storage if it exists.
	*/
	destroy() {
		const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
		if (sessionId) this.#toDestroy.add(sessionId);
		this.#cookies.delete(this.#cookieName, this.#cookieConfig);
		this.#sessionID = void 0;
		this.#data = void 0;
		this.#dirty = true;
	}
	/**
	* Regenerates the session, creating a new session ID. The existing session data is preserved.
	*/
	async regenerate() {
		let data = /* @__PURE__ */ new Map();
		try {
			data = await this.#ensureData();
		} catch (err) {
			this.#logger.error("session", `Failed to load session data during regeneration: ${err}`);
			this.#partial = false;
		}
		const oldSessionId = this.#sessionID;
		this.#sessionID = crypto.randomUUID();
		this.#sessionIDFromCookie = false;
		this.#data = data;
		this.#dirty = true;
		await this.#setCookie();
		if (oldSessionId && this.#storage) this.#storage.removeItem(oldSessionId).catch((err) => {
			this.#logger.error("session", `Failed to remove old session ${oldSessionId}: ${err}`);
		});
	}
	async [PERSIST_SYMBOL]() {
		if (!this.#dirty && !this.#toDestroy.size) return;
		const storage = await this.#ensureStorage();
		if (this.#dirty && this.#data) {
			const data = await this.#ensureData();
			this.#toDelete.forEach((key2) => data.delete(key2));
			const key = this.#ensureSessionID();
			let serialized;
			try {
				serialized = stringify(data);
			} catch (err) {
				throw new AstroError({
					...SessionStorageSaveError,
					message: SessionStorageSaveError.message("The session data could not be serialized.", this.#config.driver)
				}, { cause: err });
			}
			await storage.setItem(key, serialized);
			this.#dirty = false;
		}
		if (this.#toDestroy.size > 0) {
			const cleanupPromises = [...this.#toDestroy].map((sessionId) => storage.removeItem(sessionId).catch((err) => {
				this.#logger.error("session", `Failed to remove session ${sessionId}: ${err}`);
			}));
			await Promise.all(cleanupPromises);
			this.#toDestroy.clear();
		}
	}
	get sessionID() {
		return this.#sessionID;
	}
	/**
	* Loads a session from storage with the given ID, and replaces the current session.
	* Any changes made to the current session will be lost.
	* This is not normally needed, as the session is automatically loaded using the cookie.
	* However it can be used to restore a session where the ID has been recorded somewhere
	* else (e.g. in a database).
	*/
	async load(sessionID) {
		this.#sessionID = sessionID;
		this.#data = void 0;
		await this.#setCookie();
		await this.#ensureData();
	}
	/**
	* Sets the session cookie.
	*/
	async #setCookie() {
		if (!VALID_COOKIE_REGEX.test(this.#cookieName)) throw new AstroError({
			...SessionStorageSaveError,
			message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
		});
		const value = this.#ensureSessionID();
		this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
	}
	/**
	* Attempts to load the session data from storage, or creates a new data object if none exists.
	* If there is existing partial data, it will be merged into the new data object.
	*/
	async #ensureData() {
		if (this.#data && !this.#partial) return this.#data;
		this.#data ??= /* @__PURE__ */ new Map();
		if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
			this.#partial = false;
			return this.#data;
		}
		const raw = await (await this.#ensureStorage()).get(this.#ensureSessionID());
		if (!raw) {
			if (this.#sessionIDFromCookie) {
				this.#sessionID = crypto.randomUUID();
				this.#sessionIDFromCookie = false;
				if (this.#cookieSet) await this.#setCookie();
			}
			return this.#data;
		}
		try {
			const storedMap = unflatten(raw);
			if (!(storedMap instanceof Map)) {
				this.destroy();
				throw new AstroError({
					...SessionStorageInitError,
					message: SessionStorageInitError.message("The session data was an invalid type.", this.#config.driver)
				});
			}
			const now = Date.now();
			for (const [key, value] of storedMap) {
				const expired = typeof value.expires === "number" && value.expires < now;
				if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) this.#data.set(key, value);
			}
			this.#partial = false;
			return this.#data;
		} catch (err) {
			this.destroy();
			if (err instanceof AstroError) throw err;
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("The session data could not be parsed.", this.#config.driver)
			}, { cause: err });
		}
	}
	/**
	* Returns the session ID, generating a new one if it does not exist.
	*/
	#ensureSessionID() {
		if (!this.#sessionID) {
			const cookieValue = this.#cookies.get(this.#cookieName)?.value;
			if (cookieValue) {
				this.#sessionID = cookieValue;
				this.#sessionIDFromCookie = true;
			} else this.#sessionID = crypto.randomUUID();
		}
		return this.#sessionID;
	}
	/**
	* Ensures the storage is initialized.
	* This is called automatically when a storage operation is needed.
	*/
	async #ensureStorage() {
		if (this.#storage) return this.#storage;
		if (AstroSession.#sharedStorage.has(this.#config.driver)) {
			this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
			return this.#storage;
		}
		if (!this.#driverFactory) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("Astro could not load the driver correctly. Does it exist?", this.#config.driver)
		});
		const driver = this.#driverFactory;
		try {
			this.#storage = createStorage({ driver: {
				...driver(this.#config.options),
				hasItem() {
					return false;
				},
				getKeys() {
					return [];
				}
			} });
			AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
			return this.#storage;
		} catch (err) {
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("Unknown error", this.#config.driver)
			}, { cause: err });
		}
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/session/handler.js
var SESSION_KEY = "session";
function provideSession(state) {
	state.pipeline.usedFeatures |= PipelineFeatures.sessions;
	const config = state.pipeline.manifest.sessionConfig;
	if (!config) return;
	return provideSessionAsync(state, config);
}
async function provideSessionAsync(state, config) {
	const pipeline = state.pipeline;
	const driverFactory = await pipeline.getSessionDriver();
	if (!driverFactory) return;
	state.provide(SESSION_KEY, {
		create() {
			const cookies = state.cookies;
			return new AstroSession({
				cookies,
				config,
				runtimeMode: pipeline.runtimeMode,
				driverFactory,
				mockStorage: null,
				logger: pipeline.logger
			});
		},
		finalize(session) {
			return session[PERSIST_SYMBOL]();
		}
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/routing/handler.js
var AstroHandler = class {
	#app;
	#trailingSlashHandler;
	#actionHandler;
	#astroMiddleware;
	#pagesHandler;
	#cacheHandler;
	/** Bound callback for the middleware chain — created once, reused per request. */
	#renderRouteCallback;
	/**
	* i18n post-processor. Only set when the app has i18n configured and
	* the strategy is not `manual` — for the manual strategy users wire
	* `astro:i18n.middleware(...)` into their own `onRequest`.
	*/
	#i18n;
	/** Whether sessions are configured on the manifest. */
	#hasSession;
	constructor(app) {
		this.#app = app;
		this.#trailingSlashHandler = new TrailingSlashHandler(app);
		this.#actionHandler = new ActionHandler();
		this.#astroMiddleware = new AstroMiddleware(app.pipeline);
		this.#pagesHandler = new PagesHandler(app.pipeline);
		this.#cacheHandler = new CacheHandler(app);
		this.#renderRouteCallback = this.#actionsAndPages.bind(this);
		this.#hasSession = !!app.manifest.sessionConfig;
		const i18n = app.manifest.i18n;
		if (i18n && i18n.strategy !== "manual") this.#i18n = new I18n(i18n, app.manifest.base, app.manifest.trailingSlash, app.manifest.buildFormat);
	}
	/**
	* Runs actions then pages — the callback at the bottom of the
	* middleware chain. Bound once in the constructor to avoid
	* per-request closure allocation.
	*/
	#actionsAndPages(state, ctx) {
		if (!state.skipMiddleware) {
			const actionResult = this.#actionHandler.handle(ctx, state);
			if (actionResult) return actionResult.then((response) => response ?? this.#pagesHandler.handle(state, ctx));
		}
		return this.#pagesHandler.handle(state, ctx);
	}
	async handle(state) {
		state.pipeline.usedFeatures |= ALL_PIPELINE_FEATURES;
		if (state.invalidEncoding) return new Response(null, {
			status: 400,
			statusText: "Bad Request"
		});
		const trailingSlashRedirect = this.#trailingSlashHandler.handle(state);
		if (trailingSlashRedirect) return trailingSlashRedirect;
		if (!state.routeData) return this.#app.renderError(state.request, {
			...state.renderOptions,
			status: 404,
			pathname: state.pathname
		});
		return this.render(state);
	}
	/**
	* Renders a response for the given `FetchState`. Assumes
	* trailing-slash redirects and routeData resolution have already run.
	*
	* User-triggered rewrites (`Astro.rewrite` / `ctx.rewrite`) go through
	* `Rewrites.execute` on the current `FetchState` — they mutate the
	* existing state in place and re-run middleware + page dispatch.
	*/
	async render(state) {
		const routeData = state.routeData;
		const pathname = state.pathname;
		const request = state.request;
		const { addCookieHeader } = state.renderOptions;
		state.status = this.#app.getDefaultStatusCode(routeData, pathname);
		let response;
		let finalizeError;
		try {
			const sessionP = this.#hasSession ? provideSession(state) : void 0;
			const cacheP = provideCache(state);
			if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
			state.pipeline.usedFeatures |= PipelineFeatures.sessions;
			if (routeData.type === "redirect") {
				const redirectResponse = await renderRedirect(state);
				this.#app.logThisRequest({
					pathname,
					method: request.method,
					statusCode: redirectResponse.status,
					isRewrite: false,
					timeStart: state.timeStart
				});
				prepareResponse(redirectResponse, { addCookieHeader });
				this.#app.pipeline.logger.flush();
				return redirectResponse;
			}
			if (!this.#app.pipeline.cacheProvider) {
				this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
				response = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
				if (this.#i18n) response = await this.#i18n.finalize(state, response);
			} else {
				const runPipeline = async () => {
					let res = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
					if (this.#i18n) res = await this.#i18n.finalize(state, res);
					return res;
				};
				response = await this.#cacheHandler.handle(state, runPipeline);
			}
			this.#app.logThisRequest({
				pathname,
				method: request.method,
				statusCode: response.status,
				isRewrite: state.isRewriting,
				timeStart: state.timeStart
			});
		} catch (err) {
			this.#app.logger.error(null, err.stack || err.message || String(err));
			return this.#app.renderError(request, {
				...state.renderOptions,
				status: 500,
				error: err,
				pathname: state.pathname
			});
		} finally {
			try {
				const finalize = state.finalizeAll();
				if (finalize) await finalize;
			} catch (err) {
				finalizeError = err;
				this.#app.logger.error(null, err.stack || err.message || String(err));
			}
		}
		if (finalizeError) return this.#app.renderError(request, {
			...state.renderOptions,
			status: 500,
			error: finalizeError,
			pathname: state.pathname
		});
		if (REROUTABLE_STATUS_CODES.includes(response.status) && response.body === null && !state.skipErrorReroute) return this.#app.renderError(request, {
			...state.renderOptions,
			response,
			status: response.status,
			error: response.status === 500 ? null : void 0,
			pathname: state.pathname
		});
		prepareResponse(response, { addCookieHeader });
		this.#app.pipeline.logger.flush();
		return response;
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/fetch/default-handler.js
var DefaultFetchHandler = class {
	#app;
	#handler;
	constructor(app) {
		this.#app = app ?? null;
		this.#handler = app ? new AstroHandler(app) : null;
	}
	/**
	* Fast path: called directly by `BaseApp.render()` with pre-resolved
	* options, avoiding the `Reflect.set/get` round-trip through the request.
	*/
	renderWithOptions(request, options) {
		if (!this.#app) {
			const app = Reflect.get(request, appSymbol);
			if (!app) throw new Error("No fetch handler provided.");
			this.#app = app;
			this.#handler = new AstroHandler(app);
		}
		const state = new FetchState(this.#app.pipeline, request, options);
		return this.#handler.handle(state);
	}
	fetch = (request) => {
		if (!this.#app) {
			const app = Reflect.get(request, appSymbol);
			if (!app) throw new Error("No fetch handler provided.");
			this.#app = app;
			this.#handler = new AstroHandler(app);
		}
		const state = new FetchState(this.#app.pipeline, request);
		if (!this.#handler) throw new Error("No fetch handler provided.");
		return this.#handler.handle(state);
	};
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/i18n/error-routes.js
function isLocalizedErrorRoute(route, status, locales) {
	if (!locales) return false;
	const suffix = `/${status}`;
	if (!route.endsWith(suffix)) return false;
	const localeSegment = route.slice(0, -suffix.length);
	if (!localeSegment || localeSegment.includes("/", 1)) return false;
	return pathHasLocale(localeSegment, locales);
}
function getErrorRoutePath(pathname, status, routes, locales, appendTrailingSlash = false) {
	const suffix = appendTrailingSlash ? "/" : "";
	if (locales) {
		const firstSegment = pathname.split("/").find(Boolean);
		if (firstSegment && pathHasLocale(`/${firstSegment}`, locales)) {
			const localized = `/${firstSegment}/${status}`;
			if (routes.some((route) => route.route === localized)) return `${localized}${suffix}`;
		}
	}
	return `/${status}${suffix}`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/output-filename.js
var STATUS_CODE_PAGES = /* @__PURE__ */ new Set(["/404", "/500"]);
function getOutputFilename(buildFormat, name, routeData) {
	if (routeData.type === "endpoint") return name;
	if (name === "/" || name === "") return name === "" ? "index.html" : "/index.html";
	if (buildFormat === "file" || STATUS_CODE_PAGES.has(name)) return `${removeTrailingForwardSlash(name || "index")}.html`;
	if (buildFormat === "preserve" && !routeData.isIndex) return `${removeTrailingForwardSlash(name || "index")}.html`;
	return `${removeTrailingForwardSlash(name)}/index.html`;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/errors/handler.js
function rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, renderedRouteData, response) {
	return skipMiddleware === false && renderedRouteData !== errorRouteData && response.body === null && REROUTABLE_STATUS_CODES.includes(response.status);
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/errors/default-handler.js
var DefaultErrorHandler = class {
	#app;
	#astroMiddleware;
	#pagesHandler;
	constructor(app) {
		this.#app = app;
		this.#astroMiddleware = new AstroMiddleware(app.pipeline);
		this.#pagesHandler = new PagesHandler(app.pipeline);
	}
	async renderError(request, { status, response: originalResponse, skipMiddleware = false, error, pathname, ...resolvedRenderOptions }) {
		const app = this.#app;
		const resolvedPathname = pathname ?? new FetchState(app.pipeline, request).pathname;
		const errorRouteData = matchRoute(getErrorRoutePath(resolvedPathname, status, app.manifestData.routes, app.manifest.i18n?.locales, app.manifest.trailingSlash === "always"), app.manifestData);
		const url = new URL(request.url);
		if (errorRouteData) {
			if (errorRouteData.prerender) {
				const allowedDomains = app.manifest.allowedDomains;
				const safeOrigin = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains) ? url.origin : `${url.protocol}//localhost`;
				const statusURL = new URL(`${app.baseWithoutTrailingSlash}${getOutputFilename(app.manifest.buildFormat, errorRouteData.route, errorRouteData)}`, safeOrigin);
				if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) try {
					const newResponse = mergeResponses(await resolvedRenderOptions.prerenderedErrorPageFetch(statusURL.toString()), originalResponse, {
						status,
						removeContentEncodingHeaders: true
					});
					prepareResponse(newResponse, resolvedRenderOptions);
					return newResponse;
				} catch {
					const response2 = mergeResponses(new Response(null, { status }), originalResponse);
					prepareResponse(response2, resolvedRenderOptions);
					return response2;
				}
			}
			const mod = await app.pipeline.getComponentByRoute(errorRouteData);
			const errorState = new FetchState(app.pipeline, request);
			errorState.skipMiddleware = skipMiddleware;
			errorState.clientAddress = resolvedRenderOptions.clientAddress;
			errorState.routeData = errorRouteData;
			errorState.pathname = resolvedPathname;
			errorState.status = status;
			errorState.componentInstance = mod;
			errorState.locals = resolvedRenderOptions.locals ?? {};
			errorState.initialProps = { error };
			try {
				await provideSession(errorState);
				const response2 = await this.#astroMiddleware.handle(errorState, this.#pagesHandler.handle.bind(this.#pagesHandler));
				if (rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, errorState.routeData, response2)) return this.renderError(request, {
					...resolvedRenderOptions,
					status,
					error,
					response: originalResponse,
					skipMiddleware: true,
					pathname: resolvedPathname
				});
				const newResponse = mergeResponses(response2, originalResponse);
				prepareResponse(newResponse, resolvedRenderOptions);
				return newResponse;
			} catch {
				if (skipMiddleware === false) return this.renderError(request, {
					...resolvedRenderOptions,
					status,
					error,
					response: originalResponse,
					skipMiddleware: true,
					pathname: resolvedPathname
				});
			} finally {
				await errorState.finalizeAll();
			}
		}
		const response = mergeResponses(new Response(null, { status }), originalResponse);
		prepareResponse(response, resolvedRenderOptions);
		return response;
	}
};
function mergeResponses(newResponse, originalResponse, override) {
	let newResponseHeaders = newResponse.headers;
	if (override?.removeContentEncodingHeaders) {
		newResponseHeaders = new Headers(newResponseHeaders);
		newResponseHeaders.delete("Content-Encoding");
		newResponseHeaders.delete("Content-Length");
	}
	if (!originalResponse) {
		if (override !== void 0) return new Response(newResponse.body, {
			status: override.status,
			statusText: newResponse.statusText,
			headers: newResponseHeaders
		});
		return newResponse;
	}
	const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
	try {
		originalResponse.headers.delete("Content-type");
		originalResponse.headers.delete("Content-Length");
		originalResponse.headers.delete("Transfer-Encoding");
	} catch {}
	const newHeaders = new Headers();
	const seen = /* @__PURE__ */ new Set();
	for (const [name, value] of originalResponse.headers) {
		newHeaders.append(name, value);
		seen.add(name.toLowerCase());
	}
	for (const [name, value] of newResponseHeaders) {
		const lower = name.toLowerCase();
		if (!seen.has(lower) || lower === "set-cookie") newHeaders.append(name, value);
	}
	const mergedResponse = new Response(newResponse.body, {
		status,
		statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
		headers: newHeaders
	});
	const originalCookies = getCookiesFromResponse(originalResponse);
	const newCookies = getCookiesFromResponse(newResponse);
	if (originalCookies) {
		if (newCookies) originalCookies.merge(newCookies);
		attachCookiesToResponse(mergedResponse, originalCookies);
	} else if (newCookies) attachCookiesToResponse(mergedResponse, newCookies);
	return mergedResponse;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/base.js
var BaseApp = class BaseApp {
	manifest;
	manifestData;
	pipeline;
	#adapterLogger;
	baseWithoutTrailingSlash;
	/**
	* The handler that turns incoming `Request` objects into `Response`s.
	* Defaults to a `DefaultFetchHandler` pinned to this app and can be
	* overridden via `setFetchHandler` — typically by the bundled
	* entrypoint after importing `virtual:astro:fetchable`.
	*/
	#fetchHandler;
	#errorHandler;
	/**
	* Whether a custom fetch handler (from `src/fetch.ts`) has been set
	* via `setFetchHandler`. When false, the `DefaultFetchHandler` is
	* in use and all features are implicitly active.
	*/
	#hasCustomFetchHandler = false;
	/**
	* Whether the missing-feature check has already run. We only want
	* to warn once — after the first request in dev, or at build end.
	*/
	#featureCheckDone = false;
	get logger() {
		return this.pipeline.logger;
	}
	get adapterLogger() {
		const currentOptions = this.logger.options;
		if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
		return this.#adapterLogger;
	}
	constructor(manifest, streaming = true, ...args) {
		this.manifest = manifest;
		this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest.base);
		this.pipeline = this.createPipeline(streaming, manifest, ...args);
		this.manifestData = this.pipeline.manifestData;
		this.#fetchHandler = new DefaultFetchHandler(this);
		this.#errorHandler = this.createErrorHandler();
	}
	/**
	* Override the fetch handler used to dispatch requests. Entrypoints
	* call this with the default export of `virtual:astro:fetchable` to
	* plug in a user-authored handler from `src/fetch.ts`.
	*/
	setFetchHandler(handler) {
		this.#fetchHandler = handler;
		this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
	}
	/**
	* Returns the error handler strategy used by this app. Override to
	* provide environment-specific behavior (dev overlay, build-time throws, etc.).
	*/
	createErrorHandler() {
		return new DefaultErrorHandler(this);
	}
	/**
	* Resets the cached adapter logger so it picks up a new logger instance.
	* Used by BuildApp when the logger is replaced via setOptions().
	*/
	resetAdapterLogger() {
		this.#adapterLogger = void 0;
	}
	getAllowedDomains() {
		return this.manifest.allowedDomains;
	}
	matchesAllowedDomains(forwardedHost, protocol) {
		return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
	}
	static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
		if (!allowedDomains || allowedDomains.length === 0) return false;
		try {
			const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
			return allowedDomains.some((pattern) => {
				return matchPattern(testUrl, pattern);
			});
		} catch {
			return false;
		}
	}
	set setManifestData(newManifestData) {
		this.manifestData = newManifestData;
		this.pipeline.manifestData = newManifestData;
		this.pipeline.rebuildRouter();
	}
	removeBase(pathname) {
		pathname = collapseDuplicateLeadingSlashes(pathname);
		if (pathname.startsWith(this.manifest.base)) return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
		return pathname;
	}
	/**
	* Decodes a pathname with `decodeURI`, falling back to the raw pathname when it
	* contains an invalid percent-sequence (e.g. `%C0%AF`, an overlong-UTF-8 encoding of
	* `/` commonly sent by path-traversal scanners). A raw `decodeURI()` would throw
	* `URIError: URI malformed`, and because `match()` runs before `render()` that error
	* escapes the adapter's request handler as an uncaught exception (HTTP 500) that user
	* middleware can't catch.
	*/
	safeDecodeURI(pathname) {
		try {
			return decodeURI(pathname);
		} catch (e) {
			this.adapterLogger.debug(e.toString());
			return pathname;
		}
	}
	/**
	* Extracts the base-stripped, decoded pathname from a request.
	* Used by adapters to compute the pathname for dev-mode route matching.
	*/
	getPathnameFromRequest(request) {
		const url = new URL(request.url);
		const pathname = prependForwardSlash(this.removeBase(url.pathname));
		return this.safeDecodeURI(pathname);
	}
	/**
	* Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
	* routes aren't returned, even if they are matched.
	*
	* When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
	* @param request
	* @param allowPrerenderedRoutes
	*/
	match(request, allowPrerenderedRoutes = false) {
		const url = new URL(request.url);
		if (this.manifest.assets.has(url.pathname)) return void 0;
		let pathname = this.computePathnameFromDomain(request);
		if (!pathname) pathname = prependForwardSlash(this.removeBase(url.pathname));
		const routeData = this.pipeline.matchRoute(this.safeDecodeURI(pathname));
		if (!routeData) return void 0;
		if (allowPrerenderedRoutes) return routeData;
		if (routeData.prerender) {
			if (routeData.params.length > 0) return this.pipeline.matchAllRoutes(this.safeDecodeURI(pathname)).find((r) => !r.prerender);
			return;
		}
		return routeData;
	}
	/**
	* A matching route function to use in the development server.
	* Contrary to the `.match` function, this function resolves props and params, returning the correct
	* route based on the priority, segments. It also returns the correct, resolved pathname.
	* @param pathname
	*/
	devMatch(pathname) {}
	computePathnameFromDomain(request) {
		return computePathnameFromDomain(request, new URL(request.url), this.manifest.i18n, this.manifest.base, this.manifest.trailingSlash, this.logger);
	}
	async render(request, { addCookieHeader = false, clientAddress = Reflect.get(request, clientAddressSymbol), locals, prerenderedErrorPageFetch = fetch, routeData, waitUntil } = {}) {
		await this.pipeline.getLogger();
		if (routeData) {
			this.logger.debug("router", "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ", request.url);
			this.logger.debug("router", "RouteData");
			this.logger.debug("router", routeData);
		}
		if (locals) {
			if (typeof locals !== "object") {
				const error = new AstroError(LocalsNotAnObject);
				this.logger.error(null, error.stack);
				return this.renderError(request, {
					addCookieHeader,
					clientAddress,
					prerenderedErrorPageFetch,
					locals: void 0,
					routeData,
					waitUntil,
					status: 500,
					error
				});
			}
		}
		if (!routeData) {
			const domainPathname = this.computePathnameFromDomain(request);
			if (domainPathname) routeData = this.pipeline.matchRoute(this.safeDecodeURI(domainPathname));
		}
		const resolvedOptions = {
			addCookieHeader,
			clientAddress,
			prerenderedErrorPageFetch,
			locals,
			routeData,
			waitUntil
		};
		let response;
		if (this.#fetchHandler instanceof DefaultFetchHandler) {
			Reflect.set(request, appSymbol, this);
			response = await this.#fetchHandler.renderWithOptions(request, resolvedOptions);
		} else {
			setRenderOptions(request, resolvedOptions);
			Reflect.set(request, appSymbol, this);
			response = await this.#fetchHandler.fetch(request);
		}
		this.#warnMissingFeatures();
		if (response.headers.get("X-Astro-Error")) {
			response.headers.delete(ASTRO_ERROR_HEADER);
			return this.renderError(request, {
				addCookieHeader,
				clientAddress,
				prerenderedErrorPageFetch,
				locals,
				routeData,
				waitUntil,
				response,
				status: response.status,
				error: response.status === 500 ? null : void 0
			});
		}
		return response;
	}
	setCookieHeaders(response) {
		return getSetCookiesFromResponse(response);
	}
	/**
	* Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
	* For example,
	* ```ts
	* for (const cookie_ of App.getSetCookieFromResponse(response)) {
	*     const cookie: string = cookie_
	* }
	* ```
	* @param response The response to read cookies from.
	* @returns An iterator that yields key-value pairs as equal-sign-separated strings.
	*/
	static getSetCookieFromResponse = getSetCookiesFromResponse;
	/**
	* If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
	* This also handles pre-rendered /404 or /500 routes.
	*
	* Delegates to the app's configured `ErrorHandler`. To customize behavior
	* for a specific environment, override `createErrorHandler()` rather than
	* this method.
	*/
	async renderError(request, options) {
		return this.#errorHandler.renderError(request, options);
	}
	/**
	* One-shot check: after the first request with a custom `src/fetch.ts`,
	* compare `usedFeatures` against the manifest and warn about any
	* configured features the user's pipeline doesn't call.
	*/
	#warnMissingFeatures() {
		if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
		this.#featureCheckDone = true;
		const manifest = this.manifest;
		const missing = [];
		const used = this.pipeline.usedFeatures;
		if (manifest.routes.some((r) => r.routeData.type === "redirect") && !(used & PipelineFeatures.redirects)) missing.push("redirects");
		if (manifest.sessionConfig && !(used & PipelineFeatures.sessions)) missing.push("sessions");
		if (manifest.actions && !(used & PipelineFeatures.actions)) missing.push("actions");
		if (manifest.middleware && !(used & PipelineFeatures.middleware)) missing.push("middleware");
		if (manifest.i18n && manifest.i18n.strategy !== "manual" && !(used & PipelineFeatures.i18n)) missing.push("i18n");
		if (manifest.cacheConfig && !(used & PipelineFeatures.cache)) missing.push("cache");
		for (const feature of missing) this.logger.warn("router", `Your project uses ${feature}, but your custom src/fetch.ts does not call the ${feature}() handler. This feature will not work unless you add it to your fetch.ts pipeline.`);
	}
	getDefaultStatusCode(routeData, pathname) {
		if (!routeData.pattern.test(pathname)) {
			for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(pathname)) return 302;
		}
		const route = removeTrailingForwardSlash(routeData.route);
		const locales = this.manifest.i18n?.locales;
		if (isRoute404(route) || isLocalizedErrorRoute(route, 404, locales)) return 404;
		if (isRoute500(route) || isLocalizedErrorRoute(route, 500, locales)) return 500;
		return 200;
	}
	getManifest() {
		return this.pipeline.manifest;
	}
	logThisRequest({ pathname, method, statusCode, isRewrite, timeStart }) {
		const timeEnd = performance.now();
		this.logRequest({
			pathname,
			method,
			statusCode,
			isRewrite,
			reqTime: timeEnd - timeStart
		});
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/assets/utils/getAssetsPrefix.js
function getAssetsPrefix(fileExtension, assetsPrefix) {
	let prefix = "";
	if (!assetsPrefix) prefix = "";
	else if (typeof assetsPrefix === "string") prefix = assetsPrefix;
	else prefix = assetsPrefix[fileExtension.slice(1)] || assetsPrefix.fallback;
	return prefix;
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/render/ssr-element.js
var URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
	const parsed = new URL(path, URL_PARSE_BASE);
	return {
		pathname: !URL.canParse(path) && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname,
		suffix: `${parsed.search}${parsed.hash}`
	};
}
function appendQueryParams(path, queryParams) {
	const queryString = queryParams.toString();
	if (!queryString) return path;
	const hashIndex = path.indexOf("#");
	const basePath = hashIndex === -1 ? path : path.slice(0, hashIndex);
	const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
	return `${basePath}${basePath.includes("?") ? "&" : "?"}${queryString}${hash}`;
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
	const { pathname, suffix } = splitAssetPath(href);
	let url = "";
	if (assetsPrefix) {
		const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
		url = joinPaths(pf, slash(pathname)) + suffix;
	} else if (base) url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
	else url = href;
	if (queryParams) url = appendQueryParams(url, queryParams);
	return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
	if (stylesheet.type === "inline") return {
		props: {},
		children: stylesheet.content
	};
	else return {
		props: {
			rel: "stylesheet",
			href: createAssetLink(stylesheet.src, base, assetsPrefix, queryParams)
		},
		children: ""
	};
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
	return new Set(stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix, queryParams)));
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
	if (script.type === "external") return createModuleScriptElementWithSrc(script.value, base, assetsPrefix, queryParams);
	else return {
		props: { type: "module" },
		children: script.value
	};
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
	return {
		props: {
			type: "module",
			src: createAssetLink(src, base, assetsPrefix, queryParams)
		},
		children: ""
	};
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/logger/public.js
function matchesLevel(messageLevel, configuredLevel) {
	return levels[messageLevel] >= levels[configuredLevel];
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/logger/impls/console.js
function consoleLogDestination(config = {}) {
	const { level = "info" } = config;
	return { write(event) {
		let dest = console.error;
		if (levels[event.level] < levels["error"]) dest = console.info;
		if (!matchesLevel(event.level, level)) return;
		if (event.label === "SKIP_FORMAT") dest(event.message);
		else dest(getEventPrefix(event) + " " + event.message);
	} };
}
function createConsoleLogger({ level }) {
	return new AstroLogger({
		level,
		destination: consoleLogDestination()
	});
}
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/pipeline.js
var AppPipeline = class AppPipeline extends Pipeline {
	getName() {
		return "AppPipeline";
	}
	static create({ manifest, streaming }) {
		const resolve = async function resolve2(specifier) {
			if (!(specifier in manifest.entryModules)) throw new Error(`Unable to resolve [${specifier}]`);
			const bundlePath = manifest.entryModules[specifier];
			if (bundlePath.startsWith("data:") || bundlePath.length === 0) return bundlePath;
			else return createAssetLink(bundlePath, manifest.base, manifest.assetsPrefix);
		};
		const logger = createConsoleLogger({ level: manifest.logLevel });
		return new AppPipeline(logger, manifest, "production", manifest.renderers, resolve, streaming, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
	}
	async headElements(routeData) {
		const { assetsPrefix, base } = this.manifest;
		const routeInfo = this.manifest.routes.find((route) => route.routeData.route === routeData.route);
		const links = /* @__PURE__ */ new Set();
		const scripts = /* @__PURE__ */ new Set();
		const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
		for (const script of routeInfo?.scripts ?? []) if ("stage" in script) {
			if (script.stage === "head-inline") scripts.add({
				props: {},
				children: script.children
			});
		} else scripts.add(createModuleScriptElement(script, base, assetsPrefix));
		return {
			links,
			styles,
			scripts
		};
	}
	componentMetadata() {}
	async getComponentByRoute(routeData) {
		return (await this.getModuleForRoute(routeData)).page();
	}
	async getModuleForRoute(route) {
		for (const defaultRoute of this.defaultRoutes) if (route.component === defaultRoute.component) return { page: () => Promise.resolve(defaultRoute.instance) };
		let routeToProcess = route;
		if (routeIsRedirect(route)) {
			if (route.redirectRoute) routeToProcess = route.redirectRoute;
			else return RedirectSinglePageBuiltModule;
		} else if (routeIsFallback(route)) routeToProcess = getFallbackRoute(route, this.manifest.routes);
		if (this.manifest.pageMap) {
			const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
			if (!importComponentInstance) throw new Error(`Unexpectedly unable to find a component instance for route ${route.route}`);
			return await importComponentInstance();
		} else if (this.manifest.pageModule) return this.manifest.pageModule;
		throw new Error("Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue.");
	}
	async tryRewrite(payload, request) {
		const { newUrl, pathname, routeData } = findRouteToRewrite({
			payload,
			request,
			routes: this.manifest?.routes.map((r) => r.routeData),
			trailingSlash: this.manifest.trailingSlash,
			buildFormat: this.manifest.buildFormat,
			base: this.manifest.base,
			outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
		});
		return {
			newUrl,
			pathname,
			componentInstance: await this.getComponentByRoute(routeData),
			routeData
		};
	}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/app.js
var App = class extends BaseApp {
	createPipeline(streaming) {
		return AppPipeline.create({
			manifest: this.manifest,
			streaming
		});
	}
	isDev() {
		return false;
	}
	logRequest(_options) {}
};
//#endregion
//#region node_modules/.pnpm/astro@7.2.1_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@24.10.13_jiti@2.7.0_yaml@2.9.0/node_modules/astro/dist/core/app/manifest.js
function deserializeManifest(serializedManifest, routesList) {
	const routes = [];
	if (serializedManifest.routes) for (const serializedRoute of serializedManifest.routes) {
		routes.push({
			...serializedRoute,
			routeData: deserializeRouteData(serializedRoute.routeData)
		});
		const route = serializedRoute;
		route.routeData = deserializeRouteData(serializedRoute.routeData);
	}
	if (routesList) for (const route of routesList?.routes) routes.push({
		file: "",
		links: [],
		scripts: [],
		styles: [],
		routeData: route
	});
	const assets = new Set(serializedManifest.assets);
	const componentMetadata = new Map(serializedManifest.componentMetadata);
	const inlinedScripts = new Map(serializedManifest.inlinedScripts);
	const clientDirectives = new Map(serializedManifest.clientDirectives);
	const key = decodeKey(serializedManifest.key);
	return {
		middleware() {
			return { onRequest: NOOP_MIDDLEWARE_FN };
		},
		...serializedManifest,
		rootDir: new URL(serializedManifest.rootDir),
		srcDir: new URL(serializedManifest.srcDir),
		publicDir: new URL(serializedManifest.publicDir),
		outDir: new URL(serializedManifest.outDir),
		cacheDir: new URL(serializedManifest.cacheDir),
		buildClientDir: new URL(serializedManifest.buildClientDir),
		buildServerDir: new URL(serializedManifest.buildServerDir),
		assets,
		componentMetadata,
		inlinedScripts,
		clientDirectives,
		routes,
		key
	};
}
function deserializeRouteData(rawRouteData) {
	return {
		route: rawRouteData.route,
		type: rawRouteData.type,
		pattern: new RegExp(rawRouteData.pattern),
		params: rawRouteData.params,
		component: rawRouteData.component,
		pathname: rawRouteData.pathname || void 0,
		segments: rawRouteData.segments,
		prerender: rawRouteData.prerender,
		redirect: rawRouteData.redirect,
		redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
		fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
			return deserializeRouteData(fallback);
		}),
		isIndex: rawRouteData.isIndex,
		origin: rawRouteData.origin,
		distURL: rawRouteData.distURL
	};
}
function deserializeRouteInfo(rawRouteInfo) {
	return {
		styles: rawRouteInfo.styles,
		file: rawRouteInfo.file,
		links: rawRouteInfo.links,
		scripts: rawRouteInfo.scripts,
		routeData: deserializeRouteData(rawRouteInfo.routeData)
	};
}
//#endregion
//#region \0astro:react:opts
var _astro_react_opts_default = {
	include: void 0,
	exclude: void 0,
	experimentalReactChildren: false,
	experimentalDisableStreaming: false
};
//#endregion
//#region node_modules/.pnpm/@astrojs+react@6.0.2_@types+node@24.10.13_@types+react-dom@19.2.3_@types+react@19.2.18__38bd3aa7c7a49ff490638be12ea7e61b/node_modules/@astrojs/react/dist/context.js
var contexts = /* @__PURE__ */ new WeakMap();
var ID_PREFIX = "r";
function getContext(rendererContextResult) {
	if (contexts.has(rendererContextResult)) return contexts.get(rendererContextResult);
	const ctx = {
		currentIndex: 0,
		get id() {
			return ID_PREFIX + this.currentIndex.toString();
		}
	};
	contexts.set(rendererContextResult, ctx);
	return ctx;
}
function incrementId(rendererContextResult) {
	const ctx = getContext(rendererContextResult);
	const id = ctx.id;
	ctx.currentIndex++;
	return id;
}
//#endregion
//#region node_modules/.pnpm/@astrojs+react@6.0.2_@types+node@24.10.13_@types+react-dom@19.2.3_@types+react@19.2.18__38bd3aa7c7a49ff490638be12ea7e61b/node_modules/@astrojs/react/dist/static-html.js
var StaticHtml = ({ value, name, hydrate = true }) => {
	if (value == null || value.trim() === "") return null;
	return createElement(hydrate ? "astro-slot" : "astro-static-slot", {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value }
	});
};
var static_html_default = memo(StaticHtml, () => true);
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var WIN_SLASH = "\\\\/";
	var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
	/**
	* Posix glob regex
	*/
	var DOT_LITERAL = "\\.";
	var PLUS_LITERAL = "\\+";
	var QMARK_LITERAL = "\\?";
	var SLASH_LITERAL = "\\/";
	var ONE_CHAR = "(?=.)";
	var QMARK = "[^/]";
	var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	var POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
		NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
		QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
		STAR: `${QMARK}*?`,
		START_ANCHOR,
		SEP: "/"
	};
	/**
	* Windows glob regex
	*/
	var WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
		SEP: "\\"
	};
	module.exports = {
		DEFAULT_MAX_EXTGLOB_RECURSION,
		MAX_LENGTH: 65536,
		POSIX_REGEX_SOURCE: {
			__proto__: null,
			alnum: "a-zA-Z0-9",
			alpha: "a-zA-Z",
			ascii: "\\x00-\\x7F",
			blank: " \\t",
			cntrl: "\\x00-\\x1F\\x7F",
			digit: "0-9",
			graph: "\\x21-\\x7E",
			lower: "a-z",
			print: "\\x20-\\x7E ",
			punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
			space: " \\t\\r\\n\\v\\f",
			upper: "A-Z",
			word: "A-Za-z0-9_",
			xdigit: "A-Fa-f0-9"
		},
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			__proto__: null,
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		/**
		* Create EXTGLOB_CHARS
		*/
		extglobChars(chars) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		/**
		* Create GLOB_CHARS
		*/
		globChars(win32) {
			return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.isWindows = () => {
		if (typeof navigator !== "undefined" && navigator.platform) {
			const platform = navigator.platform.toLowerCase();
			return platform === "win32" || platform === "windows";
		}
		if (typeof process !== "undefined" && process.platform) return process.platform === "win32";
		return false;
	};
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
			return match === "\\" ? "" : match;
		});
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
	exports.basename = (path, { windows } = {}) => {
		const segs = path.split(windows ? /[\\/]/ : "/");
		const last = segs[segs.length - 1];
		if (last === "") return segs[segs.length - 2];
		return last;
	};
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/scan.js
var require_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	var { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants();
	var isPathSeparator = (code) => {
		return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};
	var depth = (token) => {
		if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
	};
	/**
	* Quickly scans a glob pattern and returns an object with a handful of
	* useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	* `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	* with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	*
	* ```js
	* const pm = require('picomatch');
	* console.log(pm.scan('foo/bar/*.js'));
	* { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {Object} Returns an object with tokens and regex source string.
	* @api public
	*/
	var scan = (input, options) => {
		const opts = options || {};
		const length = input.length - 1;
		const scanToEnd = opts.parts === true || opts.scanToEnd === true;
		const slashes = [];
		const tokens = [];
		const parts = [];
		let str = input;
		let index = -1;
		let start = 0;
		let lastIndex = 0;
		let isBrace = false;
		let isBracket = false;
		let isGlob = false;
		let isExtglob = false;
		let isGlobstar = false;
		let braceEscaped = false;
		let backslashes = false;
		let negated = false;
		let negatedExtglob = false;
		let finished = false;
		let braces = 0;
		let prev;
		let code;
		let token = {
			value: "",
			depth: 0,
			isGlob: false
		};
		const eos = () => index >= length;
		const peek = () => str.charCodeAt(index + 1);
		const advance = () => {
			prev = code;
			return str.charCodeAt(++index);
		};
		while (index < length) {
			code = advance();
			let next;
			if (code === CHAR_BACKWARD_SLASH) {
				backslashes = token.backslashes = true;
				code = advance();
				if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
				continue;
			}
			if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
				braces++;
				while (eos() !== true && (code = advance())) {
					if (code === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (code === CHAR_LEFT_CURLY_BRACE) {
						braces++;
						continue;
					}
					if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (braceEscaped !== true && code === CHAR_COMMA) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (code === CHAR_RIGHT_CURLY_BRACE) {
						braces--;
						if (braces === 0) {
							braceEscaped = false;
							isBrace = token.isBrace = true;
							finished = true;
							break;
						}
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_FORWARD_SLASH) {
				slashes.push(index);
				tokens.push(token);
				token = {
					value: "",
					depth: 0,
					isGlob: false
				};
				if (finished === true) continue;
				if (prev === CHAR_DOT && index === start + 1) {
					start += 2;
					continue;
				}
				lastIndex = index + 1;
				continue;
			}
			if (opts.noext !== true) {
				if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === true && peek() === CHAR_LEFT_PARENTHESES) {
					isGlob = token.isGlob = true;
					isExtglob = token.isExtglob = true;
					finished = true;
					if (code === CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
					if (scanToEnd === true) {
						while (eos() !== true && (code = advance())) {
							if (code === CHAR_BACKWARD_SLASH) {
								backslashes = token.backslashes = true;
								code = advance();
								continue;
							}
							if (code === CHAR_RIGHT_PARENTHESES) {
								isGlob = token.isGlob = true;
								finished = true;
								break;
							}
						}
						continue;
					}
					break;
				}
			}
			if (code === CHAR_ASTERISK) {
				if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_QUESTION_MARK) {
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_LEFT_SQUARE_BRACKET) {
				while (eos() !== true && (next = advance())) {
					if (next === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						isBracket = token.isBracket = true;
						isGlob = token.isGlob = true;
						finished = true;
						break;
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
				negated = token.negated = true;
				start++;
				continue;
			}
			if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
				isGlob = token.isGlob = true;
				if (scanToEnd === true) {
					while (eos() !== true && (code = advance())) {
						if (code === CHAR_LEFT_PARENTHESES) {
							backslashes = token.backslashes = true;
							code = advance();
							continue;
						}
						if (code === CHAR_RIGHT_PARENTHESES) {
							finished = true;
							break;
						}
					}
					continue;
				}
				break;
			}
			if (isGlob === true) {
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
		}
		if (opts.noext === true) {
			isExtglob = false;
			isGlob = false;
		}
		let base = str;
		let prefix = "";
		let glob = "";
		if (start > 0) {
			prefix = str.slice(0, start);
			str = str.slice(start);
			lastIndex -= start;
		}
		if (base && isGlob === true && lastIndex > 0) {
			base = str.slice(0, lastIndex);
			glob = str.slice(lastIndex);
		} else if (isGlob === true) {
			base = "";
			glob = str;
		} else base = str;
		if (base && base !== "" && base !== "/" && base !== str) {
			if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
		}
		if (opts.unescape === true) {
			if (glob) glob = utils.removeBackslashes(glob);
			if (base && backslashes === true) base = utils.removeBackslashes(base);
		}
		const state = {
			prefix,
			input,
			start,
			base,
			glob,
			isBrace,
			isBracket,
			isGlob,
			isExtglob,
			isGlobstar,
			negated,
			negatedExtglob
		};
		if (opts.tokens === true) {
			state.maxDepth = 0;
			if (!isPathSeparator(code)) tokens.push(token);
			state.tokens = tokens;
		}
		if (opts.parts === true || opts.tokens === true) {
			let prevIndex;
			for (let idx = 0; idx < slashes.length; idx++) {
				const n = prevIndex ? prevIndex + 1 : start;
				const i = slashes[idx];
				const value = input.slice(n, i);
				if (opts.tokens) {
					if (idx === 0 && start !== 0) {
						tokens[idx].isPrefix = true;
						tokens[idx].value = prefix;
					} else tokens[idx].value = value;
					depth(tokens[idx]);
					state.maxDepth += tokens[idx].depth;
				}
				if (idx !== 0 || value !== "") parts.push(value);
				prevIndex = i;
			}
			if (prevIndex && prevIndex + 1 < input.length) {
				const value = input.slice(prevIndex + 1);
				parts.push(value);
				if (opts.tokens) {
					tokens[tokens.length - 1].value = value;
					depth(tokens[tokens.length - 1]);
					state.maxDepth += tokens[tokens.length - 1].depth;
				}
			}
			state.slashes = slashes;
			state.parts = parts;
		}
		return state;
	};
	module.exports = scan;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var constants = require_constants();
	var utils = require_utils();
	/**
	* Constants
	*/
	var { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants;
	/**
	* Helpers
	*/
	var expandRange = (args, options) => {
		if (typeof options.expandRange === "function") return options.expandRange(...args, options);
		args.sort();
		const value = `[${args.join("-")}]`;
		try {
			new RegExp(value);
		} catch (ex) {
			return args.map((v) => utils.escapeRegex(v)).join("..");
		}
		return value;
	};
	/**
	* Create the message for a syntax error
	*/
	var syntaxError = (type, char) => {
		return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};
	var splitTopLevel = (input) => {
		const parts = [];
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let value = "";
		let escaped = false;
		for (const ch of input) {
			if (escaped === true) {
				value += ch;
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				value += ch;
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				value += ch;
				continue;
			}
			if (quote === 0) {
				if (ch === "[") bracket++;
				else if (ch === "]" && bracket > 0) bracket--;
				else if (bracket === 0) {
					if (ch === "(") paren++;
					else if (ch === ")" && paren > 0) paren--;
					else if (ch === "|" && paren === 0) {
						parts.push(value);
						value = "";
						continue;
					}
				}
			}
			value += ch;
		}
		parts.push(value);
		return parts;
	};
	var isPlainBranch = (branch) => {
		let escaped = false;
		for (const ch of branch) {
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (/[?*+@!()[\]{}]/.test(ch)) return false;
		}
		return true;
	};
	var normalizeSimpleBranch = (branch) => {
		let value = branch.trim();
		let changed = true;
		while (changed === true) {
			changed = false;
			if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
				value = value.slice(2, -1);
				changed = true;
			}
		}
		if (!isPlainBranch(value)) return;
		return value.replace(/\\(.)/g, "$1");
	};
	var hasRepeatedCharPrefixOverlap = (branches) => {
		const values = branches.map(normalizeSimpleBranch).filter(Boolean);
		for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) {
			const a = values[i];
			const b = values[j];
			const char = a[0];
			if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) continue;
			if (a === b || a.startsWith(b) || b.startsWith(a)) return true;
		}
		return false;
	};
	var parseRepeatedExtglob = (pattern, requireEnd = true) => {
		if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") return;
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let escaped = false;
		for (let i = 1; i < pattern.length; i++) {
			const ch = pattern[i];
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				continue;
			}
			if (quote === 1) continue;
			if (ch === "[") {
				bracket++;
				continue;
			}
			if (ch === "]" && bracket > 0) {
				bracket--;
				continue;
			}
			if (bracket > 0) continue;
			if (ch === "(") {
				paren++;
				continue;
			}
			if (ch === ")") {
				paren--;
				if (paren === 0) {
					if (requireEnd === true && i !== pattern.length - 1) return;
					return {
						type: pattern[0],
						body: pattern.slice(2, i),
						end: i
					};
				}
			}
		}
	};
	var buildCharClassStar = (chars) => {
		return `${chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`}*`;
	};
	var getStarExtglobSequenceChars = (pattern) => {
		let index = 0;
		const chars = [];
		while (index < pattern.length) {
			const match = parseRepeatedExtglob(pattern.slice(index), false);
			if (!match || match.type !== "*") return;
			const branches = splitTopLevel(match.body).map((branch) => branch.trim());
			if (branches.length !== 1) return;
			const branch = normalizeSimpleBranch(branches[0]);
			if (!branch || branch.length !== 1) return;
			chars.push(branch);
			index += match.end + 1;
		}
		if (chars.length < 1) return;
		return chars;
	};
	var repeatedExtglobRecursion = (pattern) => {
		let depth = 0;
		let value = pattern.trim();
		let match = parseRepeatedExtglob(value);
		while (match) {
			depth++;
			value = match.body.trim();
			match = parseRepeatedExtglob(value);
		}
		return depth;
	};
	var analyzeRepeatedExtglob = (body, options) => {
		if (options.maxExtglobRecursion === false) return { risky: false };
		const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
		const branches = splitTopLevel(body).map((branch) => branch.trim());
		if (branches.length > 1) {
			if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) return { risky: true };
		}
		const safeChars = [];
		let sawStarSequence = false;
		let combinable = true;
		for (const branch of branches) {
			const chars = getStarExtglobSequenceChars(branch);
			if (chars) {
				sawStarSequence = true;
				safeChars.push(...chars);
				continue;
			}
			const literal = normalizeSimpleBranch(branch);
			if (literal && literal.length === 1) {
				safeChars.push(literal);
				continue;
			}
			combinable = false;
			if (repeatedExtglobRecursion(branch) > max) return { risky: true };
		}
		if (sawStarSequence) return combinable ? {
			risky: true,
			safeOutput: buildCharClassStar([...new Set(safeChars)])
		} : { risky: true };
		return { risky: false };
	};
	/**
	* Parse the given input string.
	* @param {String} input
	* @param {Object} options
	* @return {Object}
	*/
	var parse = (input, options) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		input = REPLACEMENTS[input] || input;
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		let len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		const bos = {
			type: "bos",
			value: "",
			output: opts.prepend || ""
		};
		const tokens = [bos];
		const capture = opts.capture ? "" : "?:";
		const PLATFORM_CHARS = constants.globChars(opts.windows);
		const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
		const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
		const globstar = (opts) => {
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const nodot = opts.dot ? "" : NO_DOT;
		const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
		let star = opts.bash === true ? globstar(opts) : STAR;
		if (opts.capture) star = `(${star})`;
		if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
		const state = {
			input,
			index: -1,
			start: 0,
			dot: opts.dot === true,
			consumed: "",
			output: "",
			prefix: "",
			backtrack: false,
			negated: false,
			brackets: 0,
			braces: 0,
			parens: 0,
			quotes: 0,
			globstar: false,
			tokens
		};
		input = utils.removePrefix(input, state);
		len = input.length;
		const extglobs = [];
		const braces = [];
		const stack = [];
		let prev = bos;
		let value;
		/**
		* Tokenizing helpers
		*/
		const eos = () => state.index === len - 1;
		const peek = state.peek = (n = 1) => input[state.index + n];
		const advance = state.advance = () => input[++state.index] || "";
		const remaining = () => input.slice(state.index + 1);
		const consume = (value = "", num = 0) => {
			state.consumed += value;
			state.index += num;
		};
		const append = (token) => {
			state.output += token.output != null ? token.output : token.value;
			consume(token.value);
		};
		const negate = () => {
			let count = 1;
			while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
				advance();
				state.start++;
				count++;
			}
			if (count % 2 === 0) return false;
			state.negated = true;
			state.start++;
			return true;
		};
		const increment = (type) => {
			state[type]++;
			stack.push(type);
		};
		const decrement = (type) => {
			state[type]--;
			stack.pop();
		};
		/**
		* Push tokens onto the tokens array. This helper speeds up
		* tokenizing by 1) helping us avoid backtracking as much as possible,
		* and 2) helping us avoid creating extra tokens when consecutive
		* characters are plain text. This improves performance and simplifies
		* lookbehinds.
		*/
		const push = (tok) => {
			if (prev.type === "globstar") {
				const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
				const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
				if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
					state.output = state.output.slice(0, -prev.output.length);
					prev.type = "star";
					prev.value = "*";
					prev.output = star;
					state.output += prev.output;
				}
			}
			if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
			if (tok.value || tok.output) append(tok);
			if (prev && prev.type === "text" && tok.type === "text") {
				prev.output = (prev.output || prev.value) + tok.value;
				prev.value += tok.value;
				return;
			}
			tok.prev = prev;
			tokens.push(tok);
			prev = tok;
		};
		const extglobOpen = (type, value) => {
			const token = {
				...EXTGLOB_CHARS[value],
				conditions: 1,
				inner: ""
			};
			token.prev = prev;
			token.parens = state.parens;
			token.output = state.output;
			token.startIndex = state.index;
			token.tokensIndex = tokens.length;
			const output = (opts.capture ? "(" : "") + token.open;
			increment("parens");
			push({
				type,
				value,
				output: state.output ? "" : ONE_CHAR
			});
			push({
				type: "paren",
				extglob: true,
				value: advance(),
				output
			});
			extglobs.push(token);
		};
		const extglobClose = (token) => {
			const literal = input.slice(token.startIndex, state.index + 1);
			const analysis = analyzeRepeatedExtglob(input.slice(token.startIndex + 2, state.index), opts);
			if ((token.type === "plus" || token.type === "star") && analysis.risky) {
				const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
				const open = tokens[token.tokensIndex];
				open.type = "text";
				open.value = literal;
				open.output = safeOutput || utils.escapeRegex(literal);
				for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
					tokens[i].value = "";
					tokens[i].output = "";
					delete tokens[i].suffix;
				}
				state.output = token.output + open.output;
				state.backtrack = true;
				push({
					type: "paren",
					extglob: true,
					value,
					output: ""
				});
				decrement("parens");
				return;
			}
			let output = token.close + (opts.capture ? ")" : "");
			let rest;
			if (token.type === "negate") {
				let extglobStar = star;
				if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
				if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
				if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${parse(rest, {
					...options,
					fastpaths: false
				}).output})${extglobStar})`;
				if (token.prev.type === "bos") state.negatedExtglob = true;
			}
			push({
				type: "paren",
				extglob: true,
				value,
				output
			});
			decrement("parens");
		};
		/**
		* Fast paths
		*/
		if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
			let backslashes = false;
			let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
				if (first === "\\") {
					backslashes = true;
					return m;
				}
				if (first === "?") {
					if (esc) return esc + first + (rest ? QMARK.repeat(rest.length) : "");
					if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
					return QMARK.repeat(chars.length);
				}
				if (first === ".") return DOT_LITERAL.repeat(chars.length);
				if (first === "*") {
					if (esc) return esc + first + (rest ? star : "");
					return star;
				}
				return esc ? m : `\\${m}`;
			});
			if (backslashes === true) {
				if (opts.unescape === true) output = output.replace(/\\/g, "");
				else output = output.replace(/\\+/g, (m) => {
					return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
				});
			}
			if (output === input && opts.contains === true) {
				state.output = input;
				return state;
			}
			state.output = utils.wrapOutput(output, state, options);
			return state;
		}
		/**
		* Tokenize input until we reach end-of-string
		*/
		while (!eos()) {
			value = advance();
			if (value === "\0") continue;
			/**
			* Escaped characters
			*/
			if (value === "\\") {
				const next = peek();
				if (next === "/" && opts.bash !== true) continue;
				if (next === "." || next === ";") continue;
				if (!next) {
					value += "\\";
					push({
						type: "text",
						value
					});
					continue;
				}
				const match = /^\\+/.exec(remaining());
				let slashes = 0;
				if (match && match[0].length > 2) {
					slashes = match[0].length;
					state.index += slashes;
					if (slashes % 2 !== 0) value += "\\";
				}
				if (opts.unescape === true) value = advance();
				else value += advance();
				if (state.brackets === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
			}
			/**
			* If we're inside a regex character class, continue
			* until we reach the closing bracket.
			*/
			if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
				if (opts.posix !== false && value === ":") {
					const inner = prev.value.slice(1);
					if (inner.includes("[")) {
						prev.posix = true;
						if (inner.includes(":")) {
							const idx = prev.value.lastIndexOf("[");
							const pre = prev.value.slice(0, idx);
							const posix = POSIX_REGEX_SOURCE[prev.value.slice(idx + 2)];
							if (posix) {
								prev.value = pre + posix;
								state.backtrack = true;
								advance();
								if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
								continue;
							}
						}
					}
				}
				if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
				if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
				if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* If we're inside a quoted string, continue
			* until we reach the closing double quote.
			*/
			if (state.quotes === 1 && value !== "\"") {
				value = utils.escapeRegex(value);
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* Double quotes
			*/
			if (value === "\"") {
				state.quotes = state.quotes === 1 ? 0 : 1;
				if (opts.keepQuotes === true) push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === "(") {
				increment("parens");
				push({
					type: "paren",
					value
				});
				continue;
			}
			if (value === ")") {
				if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
				const extglob = extglobs[extglobs.length - 1];
				if (extglob && state.parens === extglob.parens + 1) {
					extglobClose(extglobs.pop());
					continue;
				}
				push({
					type: "paren",
					value,
					output: state.parens ? ")" : "\\)"
				});
				decrement("parens");
				continue;
			}
			/**
			* Square brackets
			*/
			if (value === "[") {
				if (opts.nobracket === true || !remaining().includes("]")) {
					if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
					value = `\\${value}`;
				} else increment("brackets");
				push({
					type: "bracket",
					value
				});
				continue;
			}
			if (value === "]") {
				if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				if (state.brackets === 0) {
					if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				decrement("brackets");
				const prevValue = prev.value.slice(1);
				if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
				prev.value += value;
				append({ value });
				if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) continue;
				const escaped = utils.escapeRegex(prev.value);
				state.output = state.output.slice(0, -prev.value.length);
				if (opts.literalBrackets === true) {
					state.output += escaped;
					prev.value = escaped;
					continue;
				}
				prev.value = `(${capture}${escaped}|${prev.value})`;
				state.output += prev.value;
				continue;
			}
			/**
			* Braces
			*/
			if (value === "{" && opts.nobrace !== true) {
				increment("braces");
				const open = {
					type: "brace",
					value,
					output: "(",
					outputIndex: state.output.length,
					tokensIndex: state.tokens.length
				};
				braces.push(open);
				push(open);
				continue;
			}
			if (value === "}") {
				const brace = braces[braces.length - 1];
				if (opts.nobrace === true || !brace) {
					push({
						type: "text",
						value,
						output: value
					});
					continue;
				}
				let output = ")";
				if (brace.dots === true) {
					const arr = tokens.slice();
					const range = [];
					for (let i = arr.length - 1; i >= 0; i--) {
						tokens.pop();
						if (arr[i].type === "brace") break;
						if (arr[i].type !== "dots") range.unshift(arr[i].value);
					}
					output = expandRange(range, opts);
					state.backtrack = true;
				}
				if (brace.comma !== true && brace.dots !== true) {
					const out = state.output.slice(0, brace.outputIndex);
					const toks = state.tokens.slice(brace.tokensIndex);
					brace.value = brace.output = "\\{";
					value = output = "\\}";
					state.output = out;
					for (const t of toks) state.output += t.output || t.value;
				}
				push({
					type: "brace",
					value,
					output
				});
				decrement("braces");
				braces.pop();
				continue;
			}
			/**
			* Pipes
			*/
			if (value === "|") {
				if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Commas
			*/
			if (value === ",") {
				let output = value;
				const brace = braces[braces.length - 1];
				if (brace && stack[stack.length - 1] === "braces") {
					brace.comma = true;
					output = "|";
				}
				push({
					type: "comma",
					value,
					output
				});
				continue;
			}
			/**
			* Slashes
			*/
			if (value === "/") {
				if (prev.type === "dot" && state.index === state.start + 1) {
					state.start = state.index + 1;
					state.consumed = "";
					state.output = "";
					tokens.pop();
					prev = bos;
					continue;
				}
				push({
					type: "slash",
					value,
					output: SLASH_LITERAL
				});
				continue;
			}
			/**
			* Dots
			*/
			if (value === ".") {
				if (state.braces > 0 && prev.type === "dot") {
					if (prev.value === ".") prev.output = DOT_LITERAL;
					const brace = braces[braces.length - 1];
					prev.type = "dots";
					prev.output += value;
					prev.value += value;
					brace.dots = true;
					continue;
				}
				if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
					push({
						type: "text",
						value,
						output: DOT_LITERAL
					});
					continue;
				}
				push({
					type: "dot",
					value,
					output: DOT_LITERAL
				});
				continue;
			}
			/**
			* Question marks
			*/
			if (value === "?") {
				if (!(prev && prev.value === "(") && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("qmark", value);
					continue;
				}
				if (prev && prev.type === "paren") {
					const next = peek();
					let output = value;
					if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
					push({
						type: "text",
						value,
						output
					});
					continue;
				}
				if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
					push({
						type: "qmark",
						value,
						output: QMARK_NO_DOT
					});
					continue;
				}
				push({
					type: "qmark",
					value,
					output: QMARK
				});
				continue;
			}
			/**
			* Exclamation
			*/
			if (value === "!") {
				if (opts.noextglob !== true && peek() === "(") {
					if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
						extglobOpen("negate", value);
						continue;
					}
				}
				if (opts.nonegate !== true && state.index === 0) {
					negate();
					continue;
				}
			}
			/**
			* Plus
			*/
			if (value === "+") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("plus", value);
					continue;
				}
				if (prev && prev.value === "(" || opts.regex === false) {
					push({
						type: "plus",
						value,
						output: PLUS_LITERAL
					});
					continue;
				}
				if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
					push({
						type: "plus",
						value
					});
					continue;
				}
				push({
					type: "plus",
					value: PLUS_LITERAL
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value === "@") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					push({
						type: "at",
						extglob: true,
						value,
						output: ""
					});
					continue;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value !== "*") {
				if (value === "$" || value === "^") value = `\\${value}`;
				const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
				if (match) {
					value += match[0];
					state.index += match[0].length;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Stars
			*/
			if (prev && (prev.type === "globstar" || prev.star === true)) {
				prev.type = "star";
				prev.star = true;
				prev.value += value;
				prev.output = star;
				state.backtrack = true;
				state.globstar = true;
				consume(value);
				continue;
			}
			let rest = remaining();
			if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
				extglobOpen("star", value);
				continue;
			}
			if (prev.type === "star") {
				if (opts.noglobstar === true) {
					consume(value);
					continue;
				}
				const prior = prev.prev;
				const before = prior.prev;
				const isStart = prior.type === "slash" || prior.type === "bos";
				const afterStar = before && (before.type === "star" || before.type === "globstar");
				if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
				const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
				if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				while (rest.slice(0, 3) === "/**") {
					const after = input[state.index + 4];
					if (after && after !== "/") break;
					rest = rest.slice(3);
					consume("/**", 3);
				}
				if (prior.type === "bos" && eos()) {
					prev.type = "globstar";
					prev.value += value;
					prev.output = globstar(opts);
					state.output = prev.output;
					state.globstar = true;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
					prev.value += value;
					state.globstar = true;
					state.output += prior.output + prev.output;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
					const end = rest[1] !== void 0 ? "|$" : "";
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
					prev.value += value;
					state.output += prior.output + prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				if (prior.type === "bos" && rest[0] === "/") {
					prev.type = "globstar";
					prev.value += value;
					prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
					state.output = prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				state.output = state.output.slice(0, -prev.output.length);
				prev.type = "globstar";
				prev.output = globstar(opts);
				prev.value += value;
				state.output += prev.output;
				state.globstar = true;
				consume(value);
				continue;
			}
			const token = {
				type: "star",
				value,
				output: star
			};
			if (opts.bash === true) {
				token.output = ".*?";
				if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
				push(token);
				continue;
			}
			if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
				token.output = value;
				push(token);
				continue;
			}
			if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
				if (prev.type === "dot") {
					state.output += NO_DOT_SLASH;
					prev.output += NO_DOT_SLASH;
				} else if (opts.dot === true) {
					state.output += NO_DOTS_SLASH;
					prev.output += NO_DOTS_SLASH;
				} else {
					state.output += nodot;
					prev.output += nodot;
				}
				if (peek() !== "*") {
					state.output += ONE_CHAR;
					prev.output += ONE_CHAR;
				}
			}
			push(token);
		}
		while (state.brackets > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
			state.output = utils.escapeLast(state.output, "[");
			decrement("brackets");
		}
		while (state.parens > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
			state.output = utils.escapeLast(state.output, "(");
			decrement("parens");
		}
		while (state.braces > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
			state.output = utils.escapeLast(state.output, "{");
			decrement("braces");
		}
		if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
			type: "maybe_slash",
			value: "",
			output: `${SLASH_LITERAL}?`
		});
		if (state.backtrack === true) {
			state.output = "";
			for (const token of state.tokens) {
				state.output += token.output != null ? token.output : token.value;
				if (token.suffix) state.output += token.suffix;
			}
		}
		return state;
	};
	/**
	* Fast paths for creating regular expressions for common glob patterns.
	* This can significantly speed up processing and has very little downside
	* impact when none of the fast paths match.
	*/
	parse.fastpaths = (input, options) => {
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		const len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		input = REPLACEMENTS[input] || input;
		const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants.globChars(opts.windows);
		const nodot = opts.dot ? NO_DOTS : NO_DOT;
		const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
		const capture = opts.capture ? "" : "?:";
		const state = {
			negated: false,
			prefix: ""
		};
		let star = opts.bash === true ? ".*?" : STAR;
		if (opts.capture) star = `(${star})`;
		const globstar = (opts) => {
			if (opts.noglobstar === true) return star;
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const create = (str) => {
			switch (str) {
				case "*": return `${nodot}${ONE_CHAR}${star}`;
				case ".*": return `${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*.*": return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*/*": return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
				case "**": return nodot + globstar(opts);
				case "**/*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
				case "**/*.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "**/.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
				default: {
					const match = /^(.*?)\.(\w+)$/.exec(str);
					if (!match) return;
					const source = create(match[1]);
					if (!source) return;
					return source + DOT_LITERAL + match[2];
				}
			}
		};
		let source = create(utils.removePrefix(input, state));
		if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL}?`;
		return source;
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/picomatch.js
var require_picomatch$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var scan = require_scan();
	var parse = require_parse();
	var utils = require_utils();
	var constants = require_constants();
	var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
	/**
	* Creates a matcher function from one or more glob patterns. The
	* returned function takes a string to match as its first argument,
	* and returns true if the string is a match. The returned matcher
	* function also takes a boolean as the second argument that, when true,
	* returns an object with additional information.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch(glob[, options]);
	*
	* const isMatch = picomatch('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	*
	* // For environments without `node.js`, `picomatch/posix` provides you a dependency-free matcher, without automatic OS detection.
	* const picomatch = require('picomatch/posix');
	* // the same API, defaulting to posix paths
	* const isMatch = picomatch('a/*');
	* console.log(isMatch('a\\b')); //=> false
	* console.log(isMatch('a/b')); //=> true
	*
	* // you can still configure the matcher function to accept windows paths
	* const isMatch = picomatch('a/*', { options: windows });
	* console.log(isMatch('a\\b')); //=> true
	* console.log(isMatch('a/b')); //=> true
	* ```
	* @name picomatch
	* @param {String|Array} `globs` One or more glob patterns.
	* @param {Object=} `options`
	* @return {Function=} Returns a matcher function.
	* @api public
	*/
	var picomatch = (glob, options, returnState = false) => {
		if (Array.isArray(glob)) {
			const fns = glob.map((input) => picomatch(input, options, returnState));
			const arrayMatcher = (str) => {
				for (const isMatch of fns) {
					const state = isMatch(str);
					if (state) return state;
				}
				return false;
			};
			return arrayMatcher;
		}
		const isState = isObject(glob) && glob.tokens && glob.input;
		if (glob === "" || typeof glob !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
		const opts = options || {};
		const posix = opts.windows;
		const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
		const state = regex.state;
		delete regex.state;
		let isIgnored = () => false;
		if (opts.ignore) {
			const ignoreOpts = {
				...options,
				ignore: null,
				onMatch: null,
				onResult: null
			};
			isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
		}
		const matcher = (input, returnObject = false) => {
			const { isMatch, match, output } = picomatch.test(input, regex, options, {
				glob,
				posix
			});
			const result = {
				glob,
				state,
				regex,
				posix,
				input,
				output,
				match,
				isMatch
			};
			if (typeof opts.onResult === "function") opts.onResult(result);
			if (isMatch === false) {
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (isIgnored(input)) {
				if (typeof opts.onIgnore === "function") opts.onIgnore(result);
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (typeof opts.onMatch === "function") opts.onMatch(result);
			return returnObject ? result : true;
		};
		if (returnState) matcher.state = state;
		return matcher;
	};
	/**
	* Test `input` with the given `regex`. This is used by the main
	* `picomatch()` function to test the input string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.test(input, regex[, options]);
	*
	* console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	* // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp} `regex`
	* @return {Object} Returns an object with matching info.
	* @api public
	*/
	picomatch.test = (input, regex, options, { glob, posix } = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected input to be a string");
		if (input === "") return {
			isMatch: false,
			output: ""
		};
		const opts = options || {};
		const format = opts.format || (posix ? utils.toPosixSlashes : null);
		let match = input === glob;
		let output = match && format ? format(input) : input;
		if (match === false) {
			output = format ? format(input) : input;
			match = output === glob;
		}
		if (match === false || opts.capture === true) {
			if (opts.matchBase === true || opts.basename === true) match = picomatch.matchBase(input, regex, options, posix);
			else match = regex.exec(output);
		}
		return {
			isMatch: Boolean(match),
			match,
			output
		};
	};
	/**
	* Match the basename of a filepath.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.matchBase(input, glob[, options]);
	* console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	* @return {Boolean}
	* @api public
	*/
	picomatch.matchBase = (input, glob, options, posix = options && options.windows) => {
		return (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options)).test(utils.basename(input, { windows: posix }));
	};
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.isMatch(string, patterns[, options]);
	*
	* console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String|Array} str The string to test.
	* @param {String|Array} patterns One or more glob patterns to use for matching.
	* @param {Object} [options] See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const result = picomatch.parse(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	* @api public
	*/
	picomatch.parse = (pattern, options) => {
		if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
		return parse(pattern, {
			...options,
			fastpaths: false
		});
	};
	/**
	* Scan a glob pattern to separate the pattern into segments.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.scan(input[, options]);
	*
	* const result = picomatch.scan('!./foo/*.js');
	* console.log(result);
	* { prefix: '!./',
	*   input: '!./foo/*.js',
	*   start: 3,
	*   base: 'foo',
	*   glob: '*.js',
	*   isBrace: false,
	*   isBracket: false,
	*   isGlob: true,
	*   isExtglob: false,
	*   isGlobstar: false,
	*   negated: true }
	* ```
	* @param {String} `input` Glob pattern to scan.
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	picomatch.scan = (input, options) => scan(input, options);
	/**
	* Compile a regular expression from the `state` object returned by the
	* [parse()](#parse) method.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const state = picomatch.parse('*.js');
	* // picomatch.compileRe(state[, options]);
	*
	* console.log(picomatch.compileRe(state));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {Object} `state`
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	* @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	* @return {RegExp}
	* @api public
	*/
	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
		if (returnOutput === true) return state.output;
		const opts = options || {};
		const prepend = opts.contains ? "" : "^";
		const append = opts.contains ? "" : "$";
		let source = `${prepend}(?:${state.output})${append}`;
		if (state && state.negated === true) source = `^(?!${source}).*$`;
		const regex = picomatch.toRegex(source, options);
		if (returnState === true) regex.state = state;
		return regex;
	};
	/**
	* Create a regular expression from a parsed glob pattern.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.makeRe(state[, options]);
	*
	* const result = picomatch.makeRe('*.js');
	* console.log(result);
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `state` The object returned from the `.parse` method.
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	* @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
		if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
		let parsed = {
			negated: false,
			fastpaths: true
		};
		if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse.fastpaths(input, options);
		if (!parsed.output) parsed = parse(input, options);
		return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};
	/**
	* Create a regular expression from the given regex source string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.toRegex(source[, options]);
	*
	* const { output } = picomatch.parse('*.js');
	* console.log(picomatch.toRegex(output));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `source` Regular expression source string.
	* @param {Object} `options`
	* @return {RegExp}
	* @api public
	*/
	picomatch.toRegex = (source, options) => {
		try {
			const opts = options || {};
			return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
		} catch (err) {
			if (options && options.debug === true) throw err;
			return /$^/;
		}
	};
	/**
	* Picomatch constants.
	* @return {Object}
	*/
	picomatch.constants = constants;
	/**
	* Expose "picomatch"
	*/
	module.exports = picomatch;
}));
//#endregion
//#region node_modules/.pnpm/@astrojs+internal-helpers@0.10.2/node_modules/@astrojs/internal-helpers/dist/create-filter.js
var import_picomatch = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var pico = require_picomatch$1();
	var utils = require_utils();
	function picomatch(glob, options, returnState = false) {
		if (options && (options.windows === null || options.windows === void 0)) options = {
			...options,
			windows: utils.isWindows()
		};
		return pico(glob, options, returnState);
	}
	Object.assign(picomatch, pico);
	module.exports = picomatch;
})))(), 1);
function ensureArray(thing) {
	if (Array.isArray(thing)) return thing;
	if (thing == null) return [];
	return [thing];
}
function toMatcher(pattern) {
	if (pattern instanceof RegExp) return pattern;
	const normalized = slash(pattern);
	const fn = (0, import_picomatch.default)(normalized, { dot: true });
	return { test: (what) => fn(what) };
}
function createFilter(include, exclude) {
	const includeMatchers = ensureArray(include).map(toMatcher);
	const excludeMatchers = ensureArray(exclude).map(toMatcher);
	if (!includeMatchers.length && !excludeMatchers.length) return (id) => typeof id === "string" && !id.includes("\0");
	return function(id) {
		if (typeof id !== "string") return false;
		if (id.includes("\0")) return false;
		const pathId = slash(id);
		for (const matcher of excludeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return false;
		}
		for (const matcher of includeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return true;
		}
		return !includeMatchers.length;
	};
}
//#endregion
//#region node_modules/.pnpm/@astrojs+react@6.0.2_@types+node@24.10.13_@types+react-dom@19.2.3_@types+react@19.2.18__38bd3aa7c7a49ff490638be12ea7e61b/node_modules/@astrojs/react/dist/server.js
var slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
var reactTypeof = /* @__PURE__ */ Symbol.for("react.element");
var reactTransitionalTypeof = /* @__PURE__ */ Symbol.for("react.transitional.element");
var filter = _astro_react_opts_default?.include || _astro_react_opts_default?.exclude ? createFilter(_astro_react_opts_default.include, _astro_react_opts_default.exclude) : null;
async function check(Component, props, children, metadata) {
	if (typeof Component === "object") return Component["$$typeof"].toString().slice(7).startsWith("react");
	if (typeof Component !== "function") return false;
	if (Component.name === "QwikComponent") return false;
	if (typeof Component === "function" && Component["$$typeof"] === /* @__PURE__ */ Symbol.for("react.forward_ref")) return false;
	if (Component.prototype != null && typeof Component.prototype.render === "function") return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	if (filter && metadata?.componentUrl && !filter(metadata.componentUrl)) return false;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && (vnode["$$typeof"] === reactTypeof || vnode["$$typeof"] === reactTransitionalTypeof)) isReactComponent = true;
		} catch {}
		return React.createElement("div");
	}
	await renderToStaticMarkup.call(this, Tester, props, children);
	return isReactComponent;
}
async function getNodeWritable() {
	let { Writable } = await import(
		/* @vite-ignore */
		"node:stream"
);
	return Writable;
}
function needsHydration(metadata) {
	return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
	let prefix;
	if (this && this.result) prefix = incrementId(this.result);
	const attrs = { prefix };
	delete props["class"];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName(key);
		slots[name] = React.createElement(static_html_default, {
			hydrate: needsHydration(metadata),
			value,
			name
		});
	}
	const newProps = {
		...props,
		...slots
	};
	const newChildren = children ?? props.children;
	if (children && _astro_react_opts_default.experimentalReactChildren) {
		attrs["data-react-children"] = true;
		newProps.children = (await import("./vnode-children_D3zzekY7.mjs").then((mod) => mod.default))(children);
	} else if (newChildren != null) newProps.children = React.createElement(static_html_default, {
		hydrate: needsHydration(metadata),
		value: newChildren
	});
	const formState = this ? await getFormState(this) : void 0;
	if (formState) {
		attrs["data-action-result"] = JSON.stringify(formState[0]);
		attrs["data-action-key"] = formState[1];
		attrs["data-action-name"] = formState[2];
	}
	const vnode = React.createElement(Component, newProps);
	const renderOptions = {
		identifierPrefix: prefix,
		formState
	};
	let html;
	if (_astro_react_opts_default.experimentalDisableStreaming) html = ReactDOM.renderToString(vnode);
	else if ("renderToReadableStream" in ReactDOM) html = await renderToReadableStreamAsync(vnode, renderOptions);
	else html = await renderToPipeableStreamAsync(vnode, renderOptions);
	html = html.replace(/<link\s[^>]*rel="(?:preload|modulepreload|stylesheet|preconnect|dns-prefetch)"[^>]*>/g, "");
	return {
		html,
		attrs
	};
}
async function getFormState({ result }) {
	const { request, actionResult } = result;
	if (!actionResult) return void 0;
	if (!isFormRequest(request.headers.get("content-type"))) return void 0;
	const { searchParams } = new URL(request.url);
	const actionKey = (await request.clone().formData()).get("$ACTION_KEY")?.toString();
	const actionName = searchParams.get("_action");
	if (!actionKey || !actionName) return void 0;
	return [
		actionResult,
		actionKey,
		actionName
	];
}
async function renderToPipeableStreamAsync(vnode, options) {
	const Writable = await getNodeWritable();
	let html = "";
	return new Promise((resolve, reject) => {
		let error = void 0;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			...options,
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(new Writable({
					write(chunk, _encoding, callback) {
						html += chunk.toString("utf-8");
						callback();
					},
					destroy() {
						resolve(html);
					}
				}));
			}
		});
	});
}
async function readResult(stream) {
	const reader = stream.getReader();
	let result = "";
	const decoder = new TextDecoder("utf-8");
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) result += decoder.decode(value);
			else decoder.decode(/* @__PURE__ */ new Uint8Array());
			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}
async function renderToReadableStreamAsync(vnode, options) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode, options));
}
var formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function isFormRequest(contentType) {
	const type = contentType?.split(";")[0].toLowerCase();
	return formContentTypes.some((t) => type === t);
}
//#endregion
//#region \0virtual:astro:renderers
var renderers = [Object.assign({
	"name": "@astrojs/react",
	"clientEntrypoint": "@astrojs/react/client.js",
	"serverEntrypoint": "@astrojs/react/server.js"
}, { ssr: {
	name: "@astrojs/react",
	check,
	renderToStaticMarkup,
	supportsAstroStaticSlot: true
} })];
[
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "page",
			"component": "_server-islands.astro",
			"params": ["name"],
			"segments": [[{
				"content": "_server-islands",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "name",
				"dynamic": true,
				"spread": false
			}]],
			"pattern": "^\\/_server-islands\\/([^/]+?)\\/?$",
			"prerender": false,
			"isIndex": false,
			"fallbackRoutes": [],
			"route": "/_server-islands/[name]",
			"origin": "internal",
			"distURL": [],
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/_image",
			"component": "self-essentials/emdash-main/packages/core/dist/astro/image-endpoint.mjs",
			"params": [],
			"pathname": "/_image",
			"pattern": "^\\/_image\\/?$",
			"segments": [[{
				"content": "_image",
				"dynamic": false,
				"spread": false
			}]],
			"type": "endpoint",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"isIndex": false,
			"origin": "internal",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/.well-known/auth",
			"pattern": "^\\/_emdash\\/\\.well-known\\/auth\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": ".well-known",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/auth.mjs",
			"pathname": "/_emdash/.well-known/auth",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "page",
			"isIndex": false,
			"route": "/_emdash/admin/[...path]",
			"pattern": "^\\/_emdash\\/admin(?:\\/(.*?))?\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "...path",
					"dynamic": true,
					"spread": true
				}]
			],
			"params": ["...path"],
			"component": "self-essentials/emdash-main/packages/core/src/astro/routes/admin.astro",
			"prerender": false,
			"fallbackRoutes": [{
				"type": "fallback",
				"isIndex": false,
				"route": "/en/_emdash/admin/[...path]",
				"pattern": "^\\/en\\/_emdash\\/admin(?:\\/(.*?))?\\/?$",
				"segments": [
					[{
						"content": "en",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "_emdash",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "admin",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "...path",
						"dynamic": true,
						"spread": true
					}]
				],
				"params": ["...path"],
				"component": "self-essentials/emdash-main/packages/core/src/astro/routes/admin.astro",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "external",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/allowed-domains/[domain]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/allowed-domains\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "allowed-domains",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "domain",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["domain"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/_domain_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/allowed-domains",
			"pattern": "^\\/_emdash\\/api\\/admin\\/allowed-domains\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "allowed-domains",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/index.mjs",
			"pathname": "/_emdash/api/admin/allowed-domains",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/api-tokens/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/api-tokens\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api-tokens",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/api-tokens",
			"pattern": "^\\/_emdash\\/api\\/admin\\/api-tokens\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api-tokens",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/index.mjs",
			"pathname": "/_emdash/api/admin/api-tokens",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/byline-fields/reorder",
			"pattern": "^\\/_emdash\\/api\\/admin\\/byline-fields\\/reorder\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "byline-fields",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "reorder",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/reorder.mjs",
			"pathname": "/_emdash/api/admin/byline-fields/reorder",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/byline-fields/[slug]/usage",
			"pattern": "^\\/_emdash\\/api\\/admin\\/byline-fields\\/([^/]+?)\\/usage\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "byline-fields",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "usage",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/byline-fields/[slug]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/byline-fields\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "byline-fields",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/byline-fields",
			"pattern": "^\\/_emdash\\/api\\/admin\\/byline-fields\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "byline-fields",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/index.mjs",
			"pathname": "/_emdash/api/admin/byline-fields",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/bylines/[id]/translations",
			"pattern": "^\\/_emdash\\/api\\/admin\\/bylines\\/([^/]+?)\\/translations\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "bylines",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "translations",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/translations.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/bylines/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/bylines\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "bylines",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/bylines",
			"pattern": "^\\/_emdash\\/api\\/admin\\/bylines\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "bylines",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/index.mjs",
			"pathname": "/_emdash/api/admin/bylines",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/comments/bulk",
			"pattern": "^\\/_emdash\\/api\\/admin\\/comments\\/bulk\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "comments",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "bulk",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/bulk.mjs",
			"pathname": "/_emdash/api/admin/comments/bulk",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/comments/counts",
			"pattern": "^\\/_emdash\\/api\\/admin\\/comments\\/counts\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "comments",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "counts",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/counts.mjs",
			"pathname": "/_emdash/api/admin/comments/counts",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/comments/[id]/status",
			"pattern": "^\\/_emdash\\/api\\/admin\\/comments\\/([^/]+?)\\/status\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "comments",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "status",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_/status.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/comments/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/comments\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "comments",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/comments",
			"pattern": "^\\/_emdash\\/api\\/admin\\/comments\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "comments",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/index.mjs",
			"pathname": "/_emdash/api/admin/comments",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/hooks/exclusive/[hookName]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/hooks\\/exclusive\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "hooks",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "exclusive",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "hookName",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["hookName"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/hooks/exclusive",
			"pattern": "^\\/_emdash\\/api\\/admin\\/hooks\\/exclusive\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "hooks",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "exclusive",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/index.mjs",
			"pathname": "/_emdash/api/admin/hooks/exclusive",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/media-usage/repair",
			"pattern": "^\\/_emdash\\/api\\/admin\\/media-usage\\/repair\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media-usage",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "repair",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/media-usage/repair.mjs",
			"pathname": "/_emdash/api/admin/media-usage/repair",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/oauth-clients/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/oauth-clients\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth-clients",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/oauth-clients",
			"pattern": "^\\/_emdash\\/api\\/admin\\/oauth-clients\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth-clients",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/index.mjs",
			"pathname": "/_emdash/api/admin/oauth-clients",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/marketplace/[id]/icon",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/icon\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "marketplace",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "icon",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/marketplace/[id]/install",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/install\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "marketplace",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "install",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/marketplace/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "marketplace",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/marketplace",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "marketplace",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/index.mjs",
			"pathname": "/_emdash/api/admin/plugins/marketplace",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/registry/artifact",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/registry\\/artifact\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "registry",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "artifact",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/registry/artifact.mjs",
			"pathname": "/_emdash/api/admin/plugins/registry/artifact",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/registry/install",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/registry\\/install\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "registry",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "install",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/registry/install.mjs",
			"pathname": "/_emdash/api/admin/plugins/registry/install",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/updates",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/updates\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "updates",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/updates.mjs",
			"pathname": "/_emdash/api/admin/plugins/updates",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/[id]/disable",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/disable\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "disable",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/disable.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/[id]/enable",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/enable\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "enable",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/enable.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/[id]/mcp",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/mcp\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "mcp",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/mcp.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/[id]/settings",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/settings\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/settings.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/[id]/uninstall",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/uninstall\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "uninstall",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/[id]/update",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/update\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "update",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/update.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/plugins",
			"pattern": "^\\/_emdash\\/api\\/admin\\/plugins\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/index.mjs",
			"pathname": "/_emdash/api/admin/plugins",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/themes/marketplace/[id]/thumbnail",
			"pattern": "^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/([^/]+?)\\/thumbnail\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "themes",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "marketplace",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "thumbnail",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/themes/marketplace/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "themes",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "marketplace",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/themes/marketplace",
			"pattern": "^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "themes",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "marketplace",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/index.mjs",
			"pathname": "/_emdash/api/admin/themes/marketplace",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/users/[id]/disable",
			"pattern": "^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/disable\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "users",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "disable",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/disable.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/users/[id]/enable",
			"pattern": "^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/enable\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "users",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "enable",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/enable.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/users/[id]/send-recovery",
			"pattern": "^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/send-recovery\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "users",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "send-recovery",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/send-recovery.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/users/[id]",
			"pattern": "^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "users",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/admin/users",
			"pattern": "^\\/_emdash\\/api\\/admin\\/users\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "users",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/index.mjs",
			"pathname": "/_emdash/api/admin/users",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/dev-bypass",
			"pattern": "^\\/_emdash\\/api\\/auth\\/dev-bypass\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "dev-bypass",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/dev-bypass.mjs",
			"pathname": "/_emdash/api/auth/dev-bypass",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/invite/accept",
			"pattern": "^\\/_emdash\\/api\\/auth\\/invite\\/accept\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "invite",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "accept",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/accept.mjs",
			"pathname": "/_emdash/api/auth/invite/accept",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/invite/complete",
			"pattern": "^\\/_emdash\\/api\\/auth\\/invite\\/complete\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "invite",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "complete",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/complete.mjs",
			"pathname": "/_emdash/api/auth/invite/complete",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/invite/register-options",
			"pattern": "^\\/_emdash\\/api\\/auth\\/invite\\/register-options\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "invite",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "register-options",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/register-options.mjs",
			"pathname": "/_emdash/api/auth/invite/register-options",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/invite",
			"pattern": "^\\/_emdash\\/api\\/auth\\/invite\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "invite",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/index.mjs",
			"pathname": "/_emdash/api/auth/invite",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/logout",
			"pattern": "^\\/_emdash\\/api\\/auth\\/logout\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "logout",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/logout.mjs",
			"pathname": "/_emdash/api/auth/logout",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/magic-link/send",
			"pattern": "^\\/_emdash\\/api\\/auth\\/magic-link\\/send\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "magic-link",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "send",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/send.mjs",
			"pathname": "/_emdash/api/auth/magic-link/send",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/magic-link/verify",
			"pattern": "^\\/_emdash\\/api\\/auth\\/magic-link\\/verify\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "magic-link",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "verify",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/verify.mjs",
			"pathname": "/_emdash/api/auth/magic-link/verify",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/me",
			"pattern": "^\\/_emdash\\/api\\/auth\\/me\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "me",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/me.mjs",
			"pathname": "/_emdash/api/auth/me",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/mode",
			"pattern": "^\\/_emdash\\/api\\/auth\\/mode\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "mode",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/mode.mjs",
			"pathname": "/_emdash/api/auth/mode",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/oauth/[provider]/callback",
			"pattern": "^\\/_emdash\\/api\\/auth\\/oauth\\/([^/]+?)\\/callback\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "provider",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "callback",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["provider"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/oauth/_provider_/callback.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/oauth/[provider]",
			"pattern": "^\\/_emdash\\/api\\/auth\\/oauth\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "provider",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["provider"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/oauth/_provider_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/passkey/options",
			"pattern": "^\\/_emdash\\/api\\/auth\\/passkey\\/options\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "passkey",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "options",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/options.mjs",
			"pathname": "/_emdash/api/auth/passkey/options",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/passkey/register/options",
			"pattern": "^\\/_emdash\\/api\\/auth\\/passkey\\/register\\/options\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "passkey",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "register",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "options",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/register/options.mjs",
			"pathname": "/_emdash/api/auth/passkey/register/options",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/passkey/register/verify",
			"pattern": "^\\/_emdash\\/api\\/auth\\/passkey\\/register\\/verify\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "passkey",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "register",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "verify",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/register/verify.mjs",
			"pathname": "/_emdash/api/auth/passkey/register/verify",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/passkey/verify",
			"pattern": "^\\/_emdash\\/api\\/auth\\/passkey\\/verify\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "passkey",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "verify",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/verify.mjs",
			"pathname": "/_emdash/api/auth/passkey/verify",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/passkey/[id]",
			"pattern": "^\\/_emdash\\/api\\/auth\\/passkey\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "passkey",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/passkey",
			"pattern": "^\\/_emdash\\/api\\/auth\\/passkey\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "passkey",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/index.mjs",
			"pathname": "/_emdash/api/auth/passkey",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/signup/complete",
			"pattern": "^\\/_emdash\\/api\\/auth\\/signup\\/complete\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "signup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "complete",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/complete.mjs",
			"pathname": "/_emdash/api/auth/signup/complete",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/signup/request",
			"pattern": "^\\/_emdash\\/api\\/auth\\/signup\\/request\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "signup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "request",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/request.mjs",
			"pathname": "/_emdash/api/auth/signup/request",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/auth/signup/verify",
			"pattern": "^\\/_emdash\\/api\\/auth\\/signup\\/verify\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "signup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "verify",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/verify.mjs",
			"pathname": "/_emdash/api/auth/signup/verify",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/comments/[collection]/[contentId]/reactions",
			"pattern": "^\\/_emdash\\/api\\/comments\\/([^/]+?)\\/([^/]+?)\\/reactions\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "comments",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "contentId",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "reactions",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "contentId"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/comments/_collection_/_contentId_/reactions.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/comments/[collection]/[contentId]",
			"pattern": "^\\/_emdash\\/api\\/comments\\/([^/]+?)\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "comments",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "contentId",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["collection", "contentId"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/authors",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/authors\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "authors",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/authors.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/trash",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/trash\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "trash",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/trash.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/compare",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/compare\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "compare",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/compare.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/discard-draft",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/discard-draft\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "discard-draft",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/duplicate",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/duplicate\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "duplicate",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/permanent",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/permanent\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "permanent",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/permanent.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/preview-url",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/preview-url\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "preview-url",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/publish",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/publish\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "publish",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/publish.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/restore",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/restore\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "restore",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/restore.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/revisions",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/revisions\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "revisions",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/revisions.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/schedule",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/schedule\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "schedule",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/schedule.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/terms/[taxonomy]",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/terms\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "terms",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "taxonomy",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": [
				"collection",
				"id",
				"taxonomy"
			],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/translations",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/translations\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "translations",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/translations.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]/unpublish",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/unpublish\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "unpublish",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]/[id]",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["collection", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/content/[collection]",
			"pattern": "^\\/_emdash\\/api\\/content\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "content",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collection",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["collection"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/dashboard",
			"pattern": "^\\/_emdash\\/api\\/dashboard\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "dashboard",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/dashboard.mjs",
			"pathname": "/_emdash/api/dashboard",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/dev/emails",
			"pattern": "^\\/_emdash\\/api\\/dev\\/emails\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "dev",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "emails",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/dev/emails.mjs",
			"pathname": "/_emdash/api/dev/emails",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/probe",
			"pattern": "^\\/_emdash\\/api\\/import\\/probe\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "probe",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/probe.mjs",
			"pathname": "/_emdash/api/import/probe",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress/analyze",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress\\/analyze\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "analyze",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/analyze.mjs",
			"pathname": "/_emdash/api/import/wordpress/analyze",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress/execute",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress\\/execute\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "execute",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/execute.mjs",
			"pathname": "/_emdash/api/import/wordpress/execute",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress/media",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress\\/media\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/media.mjs",
			"pathname": "/_emdash/api/import/wordpress/media",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress/prepare",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress\\/prepare\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "prepare",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/prepare.mjs",
			"pathname": "/_emdash/api/import/wordpress/prepare",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress/rewrite-urls",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress\\/rewrite-urls\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "rewrite-urls",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/rewrite-urls.mjs",
			"pathname": "/_emdash/api/import/wordpress/rewrite-urls",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress-plugin/analyze",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/analyze\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress-plugin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "analyze",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/analyze.mjs",
			"pathname": "/_emdash/api/import/wordpress-plugin/analyze",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress-plugin/callback",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/callback\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress-plugin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "callback",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/callback.mjs",
			"pathname": "/_emdash/api/import/wordpress-plugin/callback",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/import/wordpress-plugin/execute",
			"pattern": "^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/execute\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "import",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "wordpress-plugin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "execute",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/execute.mjs",
			"pathname": "/_emdash/api/import/wordpress-plugin/execute",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/manifest",
			"pattern": "^\\/_emdash\\/api\\/manifest\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "manifest",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/manifest.mjs",
			"pathname": "/_emdash/api/manifest",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/mcp",
			"pattern": "^\\/_emdash\\/api\\/mcp\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "mcp",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/mcp.mjs",
			"pathname": "/_emdash/api/mcp",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/file/[...key]",
			"pattern": "^\\/_emdash\\/api\\/media\\/file(?:\\/(.*?))?\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "file",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "...key",
					"dynamic": true,
					"spread": true
				}]
			],
			"params": ["...key"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/file/_...key_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/providers/[providerId]/[itemId]",
			"pattern": "^\\/_emdash\\/api\\/media\\/providers\\/([^/]+?)\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "providers",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "providerId",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "itemId",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["providerId", "itemId"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/providers/[providerId]",
			"pattern": "^\\/_emdash\\/api\\/media\\/providers\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "providers",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "providerId",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["providerId"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/_providerId_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/providers",
			"pattern": "^\\/_emdash\\/api\\/media\\/providers\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "providers",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/index.mjs",
			"pathname": "/_emdash/api/media/providers",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/upload-url",
			"pattern": "^\\/_emdash\\/api\\/media\\/upload-url\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "upload-url",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/upload-url.mjs",
			"pathname": "/_emdash/api/media/upload-url",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/[id]/confirm",
			"pattern": "^\\/_emdash\\/api\\/media\\/([^/]+?)\\/confirm\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "confirm",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/confirm.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/[id]/upload",
			"pattern": "^\\/_emdash\\/api\\/media\\/([^/]+?)\\/upload\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "upload",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/upload.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/[id]/usage",
			"pattern": "^\\/_emdash\\/api\\/media\\/([^/]+?)\\/usage\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "usage",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/usage.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media/[id]",
			"pattern": "^\\/_emdash\\/api\\/media\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/media",
			"pattern": "^\\/_emdash\\/api\\/media\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "media",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/media.mjs",
			"pathname": "/_emdash/api/media",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/menus/[name]/items/[id]",
			"pattern": "^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/items\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "menus",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "items",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["name", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/menus/[name]/items",
			"pattern": "^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/items\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "menus",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "items",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/menus/[name]/reorder",
			"pattern": "^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/reorder\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "menus",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "reorder",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/reorder.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/menus/[name]/translations",
			"pattern": "^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/translations\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "menus",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "translations",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/translations.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/menus/[name]",
			"pattern": "^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "menus",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/menus",
			"pattern": "^\\/_emdash\\/api\\/menus\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "menus",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/index.mjs",
			"pathname": "/_emdash/api/menus",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/oauth/device/authorize",
			"pattern": "^\\/_emdash\\/api\\/oauth\\/device\\/authorize\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "device",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "authorize",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/authorize.mjs",
			"pathname": "/_emdash/api/oauth/device/authorize",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/oauth/device/code",
			"pattern": "^\\/_emdash\\/api\\/oauth\\/device\\/code\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "device",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "code",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/code.mjs",
			"pathname": "/_emdash/api/oauth/device/code",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/oauth/device/token",
			"pattern": "^\\/_emdash\\/api\\/oauth\\/device\\/token\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "device",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "token",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/token.mjs",
			"pathname": "/_emdash/api/oauth/device/token",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/oauth/register",
			"pattern": "^\\/_emdash\\/api\\/oauth\\/register\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "register",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/register.mjs",
			"pathname": "/_emdash/api/oauth/register",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/oauth/token/refresh",
			"pattern": "^\\/_emdash\\/api\\/oauth\\/token\\/refresh\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "token",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "refresh",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/refresh.mjs",
			"pathname": "/_emdash/api/oauth/token/refresh",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/oauth/token/revoke",
			"pattern": "^\\/_emdash\\/api\\/oauth\\/token\\/revoke\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "token",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "revoke",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/revoke.mjs",
			"pathname": "/_emdash/api/oauth/token/revoke",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/oauth/token",
			"pattern": "^\\/_emdash\\/api\\/oauth\\/token\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "token",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token.mjs",
			"pathname": "/_emdash/api/oauth/token",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/plugins/[pluginId]/[...path]",
			"pattern": "^\\/_emdash\\/api\\/plugins\\/([^/]+?)(?:\\/(.*?))?\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "plugins",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "pluginId",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "...path",
					"dynamic": true,
					"spread": true
				}]
			],
			"params": ["pluginId", "...path"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/redirects/404s/summary",
			"pattern": "^\\/_emdash\\/api\\/redirects\\/404s\\/summary\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "redirects",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "404s",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "summary",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/summary.mjs",
			"pathname": "/_emdash/api/redirects/404s/summary",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/redirects/404s",
			"pattern": "^\\/_emdash\\/api\\/redirects\\/404s\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "redirects",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "404s",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/index.mjs",
			"pathname": "/_emdash/api/redirects/404s",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/redirects/[id]",
			"pattern": "^\\/_emdash\\/api\\/redirects\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "redirects",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/redirects",
			"pattern": "^\\/_emdash\\/api\\/redirects\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "redirects",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/index.mjs",
			"pathname": "/_emdash/api/redirects",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/revisions/[revisionId]/restore",
			"pattern": "^\\/_emdash\\/api\\/revisions\\/([^/]+?)\\/restore\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "revisions",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "revisionId",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "restore",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["revisionId"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/restore.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/revisions/[revisionId]",
			"pattern": "^\\/_emdash\\/api\\/revisions\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "revisions",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "revisionId",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["revisionId"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema/collections/[slug]/fields/reorder",
			"pattern": "^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/reorder\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collections",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "fields",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "reorder",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema/collections/[slug]/fields/[fieldSlug]",
			"pattern": "^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collections",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "fields",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "fieldSlug",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["slug", "fieldSlug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema/collections/[slug]/fields",
			"pattern": "^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collections",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "fields",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema/collections/[slug]",
			"pattern": "^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collections",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema/collections",
			"pattern": "^\\/_emdash\\/api\\/schema\\/collections\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "collections",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/index.mjs",
			"pathname": "/_emdash/api/schema/collections",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema/orphans/[slug]",
			"pattern": "^\\/_emdash\\/api\\/schema\\/orphans\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "orphans",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/orphans/_slug_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema/orphans",
			"pattern": "^\\/_emdash\\/api\\/schema\\/orphans\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "orphans",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/orphans/index.mjs",
			"pathname": "/_emdash/api/schema/orphans",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/schema",
			"pattern": "^\\/_emdash\\/api\\/schema\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "schema",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/index.mjs",
			"pathname": "/_emdash/api/schema",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/search/enable",
			"pattern": "^\\/_emdash\\/api\\/search\\/enable\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "search",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "enable",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/enable.mjs",
			"pathname": "/_emdash/api/search/enable",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/search/rebuild",
			"pattern": "^\\/_emdash\\/api\\/search\\/rebuild\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "search",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "rebuild",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/rebuild.mjs",
			"pathname": "/_emdash/api/search/rebuild",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/search/stats",
			"pattern": "^\\/_emdash\\/api\\/search\\/stats\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "search",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "stats",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/stats.mjs",
			"pathname": "/_emdash/api/search/stats",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/search/suggest",
			"pattern": "^\\/_emdash\\/api\\/search\\/suggest\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "search",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "suggest",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/suggest.mjs",
			"pathname": "/_emdash/api/search/suggest",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/search",
			"pattern": "^\\/_emdash\\/api\\/search\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "search",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/index.mjs",
			"pathname": "/_emdash/api/search",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/sections/[slug]",
			"pattern": "^\\/_emdash\\/api\\/sections\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "sections",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/_slug_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/sections",
			"pattern": "^\\/_emdash\\/api\\/sections\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "sections",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/index.mjs",
			"pathname": "/_emdash/api/sections",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/settings/backups/archives/[name]",
			"pattern": "^\\/_emdash\\/api\\/settings\\/backups\\/archives\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "backups",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "archives",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/_name_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/settings/backups/archives",
			"pattern": "^\\/_emdash\\/api\\/settings\\/backups\\/archives\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "backups",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "archives",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/index.mjs",
			"pathname": "/_emdash/api/settings/backups/archives",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/settings/backups/export",
			"pattern": "^\\/_emdash\\/api\\/settings\\/backups\\/export\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "backups",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "export",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/export.mjs",
			"pathname": "/_emdash/api/settings/backups/export",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/settings/backups",
			"pattern": "^\\/_emdash\\/api\\/settings\\/backups\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "backups",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/index.mjs",
			"pathname": "/_emdash/api/settings/backups",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/settings/email",
			"pattern": "^\\/_emdash\\/api\\/settings\\/email\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "email",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/email.mjs",
			"pathname": "/_emdash/api/settings/email",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/settings",
			"pattern": "^\\/_emdash\\/api\\/settings\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings.mjs",
			"pathname": "/_emdash/api/settings",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/setup/admin/verify",
			"pattern": "^\\/_emdash\\/api\\/setup\\/admin\\/verify\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "setup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "verify",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin-verify.mjs",
			"pathname": "/_emdash/api/setup/admin/verify",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/setup/admin",
			"pattern": "^\\/_emdash\\/api\\/setup\\/admin\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "setup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "admin",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin.mjs",
			"pathname": "/_emdash/api/setup/admin",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/setup/dev-bypass",
			"pattern": "^\\/_emdash\\/api\\/setup\\/dev-bypass\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "setup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "dev-bypass",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-bypass.mjs",
			"pathname": "/_emdash/api/setup/dev-bypass",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/setup/dev-reset",
			"pattern": "^\\/_emdash\\/api\\/setup\\/dev-reset\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "setup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "dev-reset",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-reset.mjs",
			"pathname": "/_emdash/api/setup/dev-reset",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/setup/status",
			"pattern": "^\\/_emdash\\/api\\/setup\\/status\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "setup",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "status",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/status.mjs",
			"pathname": "/_emdash/api/setup/status",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/setup",
			"pattern": "^\\/_emdash\\/api\\/setup\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "setup",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/index.mjs",
			"pathname": "/_emdash/api/setup",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/snapshot",
			"pattern": "^\\/_emdash\\/api\\/snapshot\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "snapshot",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/snapshot.mjs",
			"pathname": "/_emdash/api/snapshot",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/taxonomies/[name]/terms/[slug]/translations",
			"pattern": "^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/([^/]+?)\\/translations\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "taxonomies",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "terms",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "translations",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["name", "slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/taxonomies/[name]/terms/[slug]",
			"pattern": "^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "taxonomies",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "terms",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "slug",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["name", "slug"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/taxonomies/[name]/terms",
			"pattern": "^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "taxonomies",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "terms",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/index.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/taxonomies",
			"pattern": "^\\/_emdash\\/api\\/taxonomies\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "taxonomies",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/index.mjs",
			"pathname": "/_emdash/api/taxonomies",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/themes/preview",
			"pattern": "^\\/_emdash\\/api\\/themes\\/preview\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "themes",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "preview",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/themes/preview.mjs",
			"pathname": "/_emdash/api/themes/preview",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/typegen",
			"pattern": "^\\/_emdash\\/api\\/typegen\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "typegen",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/typegen.mjs",
			"pathname": "/_emdash/api/typegen",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/widget-areas/[name]/reorder",
			"pattern": "^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/reorder\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "widget-areas",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "reorder",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/reorder.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/widget-areas/[name]/widgets/[id]",
			"pattern": "^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/widgets\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "widget-areas",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "widgets",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "id",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["name", "id"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/widget-areas/[name]/widgets",
			"pattern": "^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/widgets\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "widget-areas",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "widgets",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/widget-areas/[name]",
			"pattern": "^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "widget-areas",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "name",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["name"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/widget-areas",
			"pattern": "^\\/_emdash\\/api\\/widget-areas\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "widget-areas",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/index.mjs",
			"pathname": "/_emdash/api/widget-areas",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/api/widget-components",
			"pattern": "^\\/_emdash\\/api\\/widget-components\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "widget-components",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-components.mjs",
			"pathname": "/_emdash/api/widget-components",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/_emdash/oauth/authorize",
			"pattern": "^\\/_emdash\\/oauth\\/authorize\\/?$",
			"segments": [
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "authorize",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/authorize.mjs",
			"pathname": "/_emdash/oauth/authorize",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/.well-known/oauth-authorization-server/_emdash",
			"pattern": "^\\/\\.well-known\\/oauth-authorization-server\\/_emdash\\/?$",
			"segments": [
				[{
					"content": ".well-known",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "oauth-authorization-server",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "_emdash",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-authorization-server.mjs",
			"pathname": "/.well-known/oauth-authorization-server/_emdash",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/.well-known/oauth-protected-resource",
			"pattern": "^\\/\\.well-known\\/oauth-protected-resource\\/?$",
			"segments": [[{
				"content": ".well-known",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "oauth-protected-resource",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-protected-resource.mjs",
			"pathname": "/.well-known/oauth-protected-resource",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/404",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/404\\/?$",
			"segments": [[{
				"content": "404",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/404.astro",
			"pathname": "/404",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/404",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/404\\/?$",
				"segments": [[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}], [{
					"content": "404",
					"dynamic": false,
					"spread": false
				}]],
				"params": [],
				"component": "src/pages/404.astro",
				"pathname": "/en/404",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/als-test",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/als-test\\/?$",
			"segments": [[{
				"content": "als-test",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/als-test.astro",
			"pathname": "/als-test",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/als-test",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/als-test\\/?$",
				"segments": [[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}], [{
					"content": "als-test",
					"dynamic": false,
					"spread": false
				}]],
				"params": [],
				"component": "src/pages/als-test.astro",
				"pathname": "/en/als-test",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/ai-search/search",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/ai-search\\/search\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "ai-search",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "search",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/ai-search/search.ts",
			"pathname": "/api/ai-search/search",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/category/[slug]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/category\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "category",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "slug",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["slug"],
			"component": "src/pages/category/[slug].astro",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/category/[slug]",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/category\\/([^/]+?)\\/?$",
				"segments": [
					[{
						"content": "en",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "category",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "slug",
						"dynamic": true,
						"spread": false
					}]
				],
				"params": ["slug"],
				"component": "src/pages/category/[slug].astro",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/pages/[slug]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/pages\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "pages",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "slug",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["slug"],
			"component": "src/pages/pages/[slug].astro",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/pages/[slug]",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/pages\\/([^/]+?)\\/?$",
				"segments": [
					[{
						"content": "en",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "pages",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "slug",
						"dynamic": true,
						"spread": false
					}]
				],
				"params": ["slug"],
				"component": "src/pages/pages/[slug].astro",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/posts/[slug]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/posts\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "posts",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "slug",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["slug"],
			"component": "src/pages/posts/[slug].astro",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/posts/[slug]",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/posts\\/([^/]+?)\\/?$",
				"segments": [
					[{
						"content": "en",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "posts",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "slug",
						"dynamic": true,
						"spread": false
					}]
				],
				"params": ["slug"],
				"component": "src/pages/posts/[slug].astro",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/posts",
			"isIndex": true,
			"type": "page",
			"pattern": "^\\/posts\\/?$",
			"segments": [[{
				"content": "posts",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/posts/index.astro",
			"pathname": "/posts",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/posts",
				"isIndex": true,
				"type": "fallback",
				"pattern": "^\\/en\\/posts\\/?$",
				"segments": [[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}], [{
					"content": "posts",
					"dynamic": false,
					"spread": false
				}]],
				"params": [],
				"component": "src/pages/posts/index.astro",
				"pathname": "/en/posts",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/robots.txt",
			"pattern": "^\\/robots\\.txt$",
			"segments": [[{
				"content": "robots.txt",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/robots.txt.mjs",
			"pathname": "/robots.txt",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/rss.xml",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/rss\\.xml$",
			"segments": [[{
				"content": "rss.xml",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/rss.xml.ts",
			"pathname": "/rss.xml",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/sandbox-plugin-test",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/sandbox-plugin-test\\/?$",
			"segments": [[{
				"content": "sandbox-plugin-test",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/sandbox-plugin-test.astro",
			"pathname": "/sandbox-plugin-test",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/sandbox-plugin-test",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/sandbox-plugin-test\\/?$",
				"segments": [[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}], [{
					"content": "sandbox-plugin-test",
					"dynamic": false,
					"spread": false
				}]],
				"params": [],
				"component": "src/pages/sandbox-plugin-test.astro",
				"pathname": "/en/sandbox-plugin-test",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/sandbox-test",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/sandbox-test\\/?$",
			"segments": [[{
				"content": "sandbox-test",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/sandbox-test.astro",
			"pathname": "/sandbox-test",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/sandbox-test",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/sandbox-test\\/?$",
				"segments": [[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}], [{
					"content": "sandbox-test",
					"dynamic": false,
					"spread": false
				}]],
				"params": [],
				"component": "src/pages/sandbox-test.astro",
				"pathname": "/en/sandbox-test",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/sitemap.xml",
			"pattern": "^\\/sitemap\\.xml$",
			"segments": [[{
				"content": "sitemap.xml",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap.xml.mjs",
			"pathname": "/sitemap.xml",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/tag/[slug]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/tag\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "tag",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "slug",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["slug"],
			"component": "src/pages/tag/[slug].astro",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/tag/[slug]",
				"isIndex": false,
				"type": "fallback",
				"pattern": "^\\/en\\/tag\\/([^/]+?)\\/?$",
				"segments": [
					[{
						"content": "en",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "tag",
						"dynamic": false,
						"spread": false
					}],
					[{
						"content": "slug",
						"dynamic": true,
						"spread": false
					}]
				],
				"params": ["slug"],
				"component": "src/pages/tag/[slug].astro",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "endpoint",
			"isIndex": false,
			"route": "/sitemap-[collection].xml",
			"pattern": "^\\/sitemap-([^/]+?)\\.xml$",
			"segments": [[
				{
					"content": "sitemap-",
					"dynamic": false,
					"spread": false
				},
				{
					"content": "collection",
					"dynamic": true,
					"spread": false
				},
				{
					"content": ".xml",
					"dynamic": false,
					"spread": false
				}
			]],
			"params": ["collection"],
			"component": "self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap-_collection_.xml.mjs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "external",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/",
			"isIndex": true,
			"type": "page",
			"pattern": "^\\/$",
			"segments": [],
			"params": [],
			"component": "src/pages/index.astro",
			"pathname": "/",
			"prerender": false,
			"fallbackRoutes": [{
				"route": "/en/",
				"isIndex": true,
				"type": "fallback",
				"pattern": "^\\/en\\/?$",
				"segments": [[{
					"content": "en",
					"dynamic": false,
					"spread": false
				}]],
				"params": [],
				"component": "src/pages/index.astro",
				"pathname": "/en/",
				"prerender": false,
				"fallbackRoutes": [],
				"distURL": [],
				"origin": "project",
				"_meta": { "trailingSlash": "ignore" }
			}],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	}
].map(deserializeRouteInfo);
//#endregion
//#region \0virtual:astro:pages
var _page0 = () => import("./image-endpoint_6G54dtPx.mjs");
var _page1 = () => import("./auth_djLB9iiI.mjs");
var _page2 = () => import("./admin_CghfiGey.mjs");
var _page3 = () => import("./_domain__CRMalQ77.mjs");
var _page4 = () => import("./index_GOiX2uT6.mjs");
var _page5 = () => import("./_id__C6iIbmc9.mjs");
var _page6 = () => import("./index_C4B__8wJ.mjs");
var _page7 = () => import("./reorder_F99bzepU.mjs");
var _page8 = () => import("./usage_kEQBopO7.mjs");
var _page9 = () => import("./_slug__KXMXmHn_.mjs");
var _page10 = () => import("./index_BB3mntyt.mjs");
var _page11 = () => import("./translations_BJcWoxrV.mjs");
var _page12 = () => import("./index_BsLNQg07.mjs");
var _page13 = () => import("./index_DMZSVbz1.mjs");
var _page14 = () => import("./bulk_BTdVhGtE.mjs");
var _page15 = () => import("./counts_Ds1etn2w.mjs");
var _page16 = () => import("./status_BsVHNRH0.mjs");
var _page17 = () => import("./_id__D5Hx2wyR.mjs");
var _page18 = () => import("./index_DATvgizB.mjs");
var _page19 = () => import("./_hookName__Bb_4YRVF.mjs");
var _page20 = () => import("./index_Bqgy3Rjc.mjs");
var _page21 = () => import("./repair_MEDkd3QL.mjs");
var _page22 = () => import("./_id__DP2b-th82.mjs");
var _page23 = () => import("./index_BlH7-pna2.mjs");
var _page24 = () => import("./icon_C7xcm8d5.mjs");
var _page25 = () => import("./install_F_IN4fGN.mjs");
var _page26 = () => import("./index_DH89rLM3.mjs");
var _page27 = () => import("./index_Rt6p9Mhw.mjs");
var _page28 = () => import("./artifact_l0U0sz2N.mjs");
var _page29 = () => import("./install_C7dDqLr1.mjs");
var _page30 = () => import("./updates_B1QIXAlj.mjs");
var _page31 = () => import("./disable_BS8GT7Ze.mjs");
var _page32 = () => import("./enable_DLQt8DcC.mjs");
var _page33 = () => import("./mcp_CL1xRMwE.mjs");
var _page34 = () => import("./settings_DuwVHsNc.mjs");
var _page35 = () => import("./uninstall_EpwWXej8.mjs");
var _page36 = () => import("./update_FoR8_Wpm.mjs");
var _page37 = () => import("./index_BtF-g5qf.mjs");
var _page38 = () => import("./index_CUqy2O6g.mjs");
var _page39 = () => import("./thumbnail_B4uqQtmL.mjs");
var _page40 = () => import("./index__ia41lXe.mjs");
var _page41 = () => import("./index_DSgNDSDD.mjs");
var _page42 = () => import("./disable_5FS7ePyi.mjs");
var _page43 = () => import("./enable_YrqSHqnv.mjs");
var _page44 = () => import("./send-recovery_C--E3zCo.mjs");
var _page45 = () => import("./index_Dcs_z6pz.mjs");
var _page46 = () => import("./index_B5atpAmO.mjs");
var _page47 = () => import("./dev-bypass_CM_Kczh7.mjs");
var _page48 = () => import("./accept_B0RNqXGe.mjs");
var _page49 = () => import("./complete_eGhzdVjw.mjs");
var _page50 = () => import("./register-options_BlhVDdAm.mjs");
var _page51 = () => import("./index_S6Za2Fs9.mjs");
var _page52 = () => import("./logout_BkBGoZPI.mjs");
var _page53 = () => import("./send_CuFNiduQ.mjs");
var _page54 = () => import("./verify_C6JsnGAu.mjs");
var _page55 = () => import("./me_DpIb9Tii.mjs");
var _page56 = () => import("./mode_Be1pV0_F.mjs");
var _page57 = () => import("./callback_DyLBhjb9.mjs");
var _page58 = () => import("./_provider__Bp0x9uz8.mjs");
var _page59 = () => import("./options_CkWUmlJH.mjs");
var _page60 = () => import("./options_0DX1IC2-.mjs");
var _page61 = () => import("./verify_CqOUfIK9.mjs");
var _page62 = () => import("./verify_ByYYw0wp.mjs");
var _page63 = () => import("./_id__DQmzbvVf.mjs");
var _page64 = () => import("./index_BBhUvsnt.mjs");
var _page65 = () => import("./complete_B3DBxQ8D.mjs");
var _page66 = () => import("./request_C68PKFXi.mjs");
var _page67 = () => import("./verify_Bu3n19lA.mjs");
var _page68 = () => import("./reactions_DC9d52h_.mjs");
var _page69 = () => import("./index_Dc8NA6_g.mjs");
var _page70 = () => import("./authors_DKUjFPuM.mjs");
var _page71 = () => import("./trash_XBhb5MFB.mjs");
var _page72 = () => import("./compare_DZ7CpteM.mjs");
var _page73 = () => import("./discard-draft_CeZ6yMlJ.mjs");
var _page74 = () => import("./duplicate_CsvTqeSo.mjs");
var _page75 = () => import("./permanent_BT_jIZ-Q.mjs");
var _page76 = () => import("./preview-url_B_cFn4pN.mjs");
var _page77 = () => import("./publish_BiLfknoM.mjs");
var _page78 = () => import("./restore_Wd8j7jv9.mjs");
var _page79 = () => import("./revisions_nUZkqonu.mjs");
var _page80 = () => import("./schedule_78zbvMmJ.mjs");
var _page81 = () => import("./_taxonomy__J04Uv-Mt.mjs");
var _page82 = () => import("./translations_7OGTf4-u.mjs");
var _page83 = () => import("./unpublish_tAofFK5B.mjs");
var _page84 = () => import("./_id__D3z_i09j.mjs");
var _page85 = () => import("./index_Cuv9DQkE.mjs");
var _page86 = () => import("./dashboard_D5ao_dw2.mjs");
var _page87 = () => import("./emails_CwMrX-lT.mjs");
var _page88 = () => import("./probe_DYTkPF1h.mjs");
var _page89 = () => import("./analyze_-sG8LSMR.mjs");
var _page90 = () => import("./execute_CkVcEgmJ.mjs");
var _page91 = () => import("./media_B85zFglJ.mjs");
var _page92 = () => import("./prepare_DBs7m0x7.mjs");
var _page93 = () => import("./rewrite-urls_DBBcpf1y.mjs");
var _page94 = () => import("./analyze_C7YKFQRI.mjs");
var _page95 = () => import("./callback_eHq0r0RQ.mjs");
var _page96 = () => import("./execute_CcqABRgt.mjs");
var _page97 = () => import("./manifest_C5JO2Z4Q.mjs");
var _page98 = () => import("./mcp_D20FJuqy.mjs");
var _page99 = () => import("./_.._BSrSfwYc.mjs");
var _page100 = () => import("./_itemId__BonnAgte.mjs");
var _page101 = () => import("./index_CZ3OBif_.mjs");
var _page102 = () => import("./index_CCy79Cwt.mjs");
var _page103 = () => import("./upload-url_BMKzmrmv.mjs");
var _page104 = () => import("./confirm_CB6mP532.mjs");
var _page105 = () => import("./upload_DNPK2QCA.mjs");
var _page106 = () => import("./usage_CGOAfBi0.mjs");
var _page107 = () => import("./_id__BAjd1quR.mjs");
var _page108 = () => import("./media_CoNo4q7c.mjs");
var _page109 = () => import("./_id__mYPbVhVC.mjs");
var _page110 = () => import("./items_CMRUQ2QL.mjs");
var _page111 = () => import("./reorder_BJgHwFiR.mjs");
var _page112 = () => import("./translations_B4Si2aph.mjs");
var _page113 = () => import("./_name__ZwlrSzoH.mjs");
var _page114 = () => import("./index_CnnyFbZH.mjs");
var _page115 = () => import("./authorize_Bxb-H2au.mjs");
var _page116 = () => import("./code_C89dlBr_.mjs");
var _page117 = () => import("./token_ColK2ceU.mjs");
var _page118 = () => import("./register_D_z_70jG.mjs");
var _page119 = () => import("./refresh_BCqHgHoR.mjs");
var _page120 = () => import("./revoke_BC8f0UO8.mjs");
var _page121 = () => import("./token_CjqQIISm.mjs");
var _page122 = () => import("./_.._C8Q4ftz4.mjs");
var _page123 = () => import("./summary_CXqcqo6p.mjs");
var _page124 = () => import("./index_DwnNWF6Y.mjs");
var _page125 = () => import("./_id__CEdXhm0N.mjs");
var _page126 = () => import("./index_BRckbVbg2.mjs");
var _page127 = () => import("./restore_CfcptpmC.mjs");
var _page128 = () => import("./index_Chhv4tvq.mjs");
var _page129 = () => import("./reorder_kGgCQNYZ.mjs");
var _page130 = () => import("./_fieldSlug__B_n6a75V.mjs");
var _page131 = () => import("./index_CvZGEBuZ.mjs");
var _page132 = () => import("./index_eVMenSyu.mjs");
var _page133 = () => import("./index_I3BFSTMa.mjs");
var _page134 = () => import("./_slug__Dr9WpG1A.mjs");
var _page135 = () => import("./index_Bv4fVhkF.mjs");
var _page136 = () => import("./index_DZRRN2zq.mjs");
var _page137 = () => import("./enable_Dp-OwZlZ.mjs");
var _page138 = () => import("./rebuild_DoqKHSA2.mjs");
var _page139 = () => import("./stats_BrmT9xnP.mjs");
var _page140 = () => import("./suggest_OYzYxtFo.mjs");
var _page141 = () => import("./index_ExgZ9twj.mjs");
var _page142 = () => import("./_slug__CCB1f8Je.mjs");
var _page143 = () => import("./index_C6u9ppuF.mjs");
var _page144 = () => import("./_name__BzrbVhRo.mjs");
var _page145 = () => import("./index_DP2xBGyA.mjs");
var _page146 = () => import("./export_B2FeYRCa.mjs");
var _page147 = () => import("./index_Bg-aB3l6.mjs");
var _page148 = () => import("./email_JQ7eQt8B.mjs");
var _page149 = () => import("./settings_Dx5SRa04.mjs");
var _page150 = () => import("./admin-verify_BuzlU5dE.mjs");
var _page151 = () => import("./admin_C__q7J3h.mjs");
var _page152 = () => import("./dev-bypass_DRI_oqRP.mjs");
var _page153 = () => import("./dev-reset_BrgMurOg.mjs");
var _page154 = () => import("./status_CWs3JCKQ.mjs");
var _page155 = () => import("./index_BlU1acQO.mjs");
var _page156 = () => import("./snapshot_Cu24r2yq.mjs");
var _page157 = () => import("./translations_C-UhNoRd.mjs");
var _page158 = () => import("./_slug__DkRehJlg.mjs");
var _page159 = () => import("./index_ZnhfslrE.mjs");
var _page160 = () => import("./index_CNnSD1b3.mjs");
var _page161 = () => import("./preview_DqbrQW8Q.mjs");
var _page162 = () => import("./typegen_VyV0aIEf.mjs");
var _page163 = () => import("./reorder_BPazHwgh.mjs");
var _page164 = () => import("./_id__Bkgdnl-L.mjs");
var _page165 = () => import("./widgets_wvD9W8e4.mjs");
var _page166 = () => import("./_name__Bwvb5sZA.mjs");
var _page167 = () => import("./index_BcatQRl3.mjs");
var _page168 = () => import("./widget-components_CFybmEu8.mjs");
var _page169 = () => import("./authorize_DEiEOTyb.mjs");
var _page170 = () => import("./oauth-authorization-server_DnTyQAgX.mjs");
var _page171 = () => import("./oauth-protected-resource_B6yl0m8h.mjs");
var _page172 = () => import("./404_8tClPXzI.mjs");
var _page173 = () => import("./als-test_D6lYi4Qc.mjs");
var _page174 = () => import("./search_CwHT8ZGO.mjs");
var _page175 = () => import("./_slug__owvpw3PV.mjs");
var _page176 = () => import("./_slug__CriVEhyC.mjs");
var _page177 = () => import("./_slug__D7l0-wpU.mjs");
var _page178 = () => import("./index_BOBweiKY.mjs");
var _page179 = () => import("./robots_CJf0lJv8.mjs");
var _page180 = () => import("./rss_DYiuhGW6.mjs");
var _page181 = () => import("./sandbox-plugin-test_D2a89T3t.mjs");
var _page182 = () => import("./sandbox-test_V0sGFVn8.mjs");
var _page183 = () => import("./sitemap_DQ17GpD5.mjs");
var _page184 = () => import("./_slug__CBZX2Lvd.mjs");
var _page185 = () => import("./sitemap-_collection__BPKNt7vE.mjs");
var _page186 = () => import("./index_D2Ck9kY7.mjs");
var pageMap = /* @__PURE__ */ new Map([
	["self-essentials/emdash-main/packages/core/dist/astro/image-endpoint.mjs", _page0],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/auth.mjs", _page1],
	["self-essentials/emdash-main/packages/core/src/astro/routes/admin.astro", _page2],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/_domain_.mjs", _page3],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/allowed-domains/index.mjs", _page4],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/_id_.mjs", _page5],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/api-tokens/index.mjs", _page6],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/reorder.mjs", _page7],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_/usage.mjs", _page8],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/_slug_.mjs", _page9],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/byline-fields/index.mjs", _page10],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/translations.mjs", _page11],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/_id_/index.mjs", _page12],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/bylines/index.mjs", _page13],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/bulk.mjs", _page14],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/counts.mjs", _page15],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_/status.mjs", _page16],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/_id_.mjs", _page17],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/comments/index.mjs", _page18],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs", _page19],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/hooks/exclusive/index.mjs", _page20],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/media-usage/repair.mjs", _page21],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/_id_.mjs", _page22],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/oauth-clients/index.mjs", _page23],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs", _page24],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs", _page25],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs", _page26],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/marketplace/index.mjs", _page27],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/registry/artifact.mjs", _page28],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/registry/install.mjs", _page29],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/updates.mjs", _page30],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/disable.mjs", _page31],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/enable.mjs", _page32],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/mcp.mjs", _page33],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/settings.mjs", _page34],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs", _page35],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/update.mjs", _page36],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/_id_/index.mjs", _page37],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/plugins/index.mjs", _page38],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs", _page39],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs", _page40],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/themes/marketplace/index.mjs", _page41],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/disable.mjs", _page42],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/enable.mjs", _page43],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/send-recovery.mjs", _page44],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/_id_/index.mjs", _page45],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/admin/users/index.mjs", _page46],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/dev-bypass.mjs", _page47],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/accept.mjs", _page48],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/complete.mjs", _page49],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/register-options.mjs", _page50],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/invite/index.mjs", _page51],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/logout.mjs", _page52],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/send.mjs", _page53],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/magic-link/verify.mjs", _page54],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/me.mjs", _page55],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/mode.mjs", _page56],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/oauth/_provider_/callback.mjs", _page57],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/oauth/_provider_.mjs", _page58],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/options.mjs", _page59],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/register/options.mjs", _page60],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/register/verify.mjs", _page61],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/verify.mjs", _page62],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/_id_.mjs", _page63],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/passkey/index.mjs", _page64],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/complete.mjs", _page65],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/request.mjs", _page66],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/auth/signup/verify.mjs", _page67],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/comments/_collection_/_contentId_/reactions.mjs", _page68],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs", _page69],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/authors.mjs", _page70],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/trash.mjs", _page71],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/compare.mjs", _page72],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs", _page73],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs", _page74],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/permanent.mjs", _page75],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs", _page76],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/publish.mjs", _page77],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/restore.mjs", _page78],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/revisions.mjs", _page79],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/schedule.mjs", _page80],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs", _page81],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/translations.mjs", _page82],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs", _page83],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/_id_.mjs", _page84],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/content/_collection_/index.mjs", _page85],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/dashboard.mjs", _page86],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/dev/emails.mjs", _page87],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/probe.mjs", _page88],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/analyze.mjs", _page89],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/execute.mjs", _page90],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/media.mjs", _page91],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/prepare.mjs", _page92],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress/rewrite-urls.mjs", _page93],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/analyze.mjs", _page94],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/callback.mjs", _page95],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/import/wordpress-plugin/execute.mjs", _page96],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/manifest.mjs", _page97],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/mcp.mjs", _page98],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/file/_...key_.mjs", _page99],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs", _page100],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/_providerId_/index.mjs", _page101],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/providers/index.mjs", _page102],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/upload-url.mjs", _page103],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/confirm.mjs", _page104],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/upload.mjs", _page105],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_/usage.mjs", _page106],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media/_id_.mjs", _page107],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/media.mjs", _page108],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items/_id_.mjs", _page109],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/items.mjs", _page110],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/reorder.mjs", _page111],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_/translations.mjs", _page112],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/_name_.mjs", _page113],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/menus/index.mjs", _page114],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/authorize.mjs", _page115],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/code.mjs", _page116],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/device/token.mjs", _page117],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/register.mjs", _page118],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/refresh.mjs", _page119],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token/revoke.mjs", _page120],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/token.mjs", _page121],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs", _page122],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/summary.mjs", _page123],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/404s/index.mjs", _page124],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/_id_.mjs", _page125],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/redirects/index.mjs", _page126],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/restore.mjs", _page127],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/revisions/_revisionId_/index.mjs", _page128],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs", _page129],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs", _page130],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs", _page131],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/_slug_/index.mjs", _page132],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/collections/index.mjs", _page133],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/orphans/_slug_.mjs", _page134],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/orphans/index.mjs", _page135],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/schema/index.mjs", _page136],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/enable.mjs", _page137],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/rebuild.mjs", _page138],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/stats.mjs", _page139],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/suggest.mjs", _page140],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/search/index.mjs", _page141],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/_slug_.mjs", _page142],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/sections/index.mjs", _page143],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/_name_.mjs", _page144],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/archives/index.mjs", _page145],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/export.mjs", _page146],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/backups/index.mjs", _page147],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings/email.mjs", _page148],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/settings.mjs", _page149],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin-verify.mjs", _page150],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/admin.mjs", _page151],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-bypass.mjs", _page152],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/dev-reset.mjs", _page153],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/status.mjs", _page154],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/setup/index.mjs", _page155],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/snapshot.mjs", _page156],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs", _page157],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs", _page158],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/_name_/terms/index.mjs", _page159],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/taxonomies/index.mjs", _page160],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/themes/preview.mjs", _page161],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/typegen.mjs", _page162],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/reorder.mjs", _page163],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs", _page164],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_/widgets.mjs", _page165],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/_name_.mjs", _page166],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-areas/index.mjs", _page167],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/widget-components.mjs", _page168],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/oauth/authorize.mjs", _page169],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-authorization-server.mjs", _page170],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/api/well-known/oauth-protected-resource.mjs", _page171],
	["src/pages/404.astro", _page172],
	["src/pages/als-test.astro", _page173],
	["src/pages/api/ai-search/search.ts", _page174],
	["src/pages/category/[slug].astro", _page175],
	["src/pages/pages/[slug].astro", _page176],
	["src/pages/posts/[slug].astro", _page177],
	["src/pages/posts/index.astro", _page178],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/robots.txt.mjs", _page179],
	["src/pages/rss.xml.ts", _page180],
	["src/pages/sandbox-plugin-test.astro", _page181],
	["src/pages/sandbox-test.astro", _page182],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap.xml.mjs", _page183],
	["src/pages/tag/[slug].astro", _page184],
	["self-essentials/emdash-main/packages/core/dist/astro/routes/sitemap-_collection_.xml.mjs", _page185],
	["src/pages/index.astro", _page186]
]);
//#endregion
//#region \0virtual:astro:manifest
var _manifest = deserializeManifest("@@ASTRO_MANIFEST_REPLACE@@");
var manifestRoutes = _manifest.routes;
var manifest = Object.assign(_manifest, {
	renderers,
	actions: () => import("./noop-entrypoint_Z3zFhrGC.mjs"),
	middleware: () => import("../virtual_astro_middleware.mjs"),
	sessionDriver: () => import("./_virtual_astro_session-driver_Dp7RXjOf.mjs"),
	serverIslandMappings: () => import("./_virtual_astro_server-island-manifest_C1Q2srgE.mjs"),
	routes: manifestRoutes,
	pageMap
});
//#endregion
export { validateForwardedHeaders as a, getFirstForwardedValue as i, App as n, validateHost as o, DefaultFetchHandler as r, manifest as t };
