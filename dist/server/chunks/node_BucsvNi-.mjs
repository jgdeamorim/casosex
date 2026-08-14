import crypto from "node:crypto";
//#region node_modules/.pnpm/layerr@3.0.0/node_modules/layerr/dist/error.js
function assertError(err) {
	if (!isError(err)) throw new Error("Parameter was not an error");
}
function isError(err) {
	return !!err && typeof err === "object" && objectToString(err) === "[object Error]" || err instanceof Error;
}
function objectToString(obj) {
	return Object.prototype.toString.call(obj);
}
var __name = "Layerr";
function getGlobalName() {
	return __name;
}
//#endregion
//#region node_modules/.pnpm/layerr@3.0.0/node_modules/layerr/dist/tools.js
function parseArguments(args) {
	let options, shortMessage = "";
	if (args.length === 0) options = {};
	else if (isError(args[0])) {
		options = { cause: args[0] };
		shortMessage = args.slice(1).join(" ") || "";
	} else if (args[0] && typeof args[0] === "object") {
		options = Object.assign({}, args[0]);
		shortMessage = args.slice(1).join(" ") || "";
	} else if (typeof args[0] === "string") {
		options = {};
		shortMessage = shortMessage = args.join(" ") || "";
	} else throw new Error("Invalid arguments passed to Layerr");
	return {
		options,
		shortMessage
	};
}
//#endregion
//#region node_modules/.pnpm/layerr@3.0.0/node_modules/layerr/dist/layerr.js
var Layerr = class Layerr extends Error {
	constructor(errorOptionsOrMessage, messageText) {
		const { options, shortMessage } = parseArguments([...arguments]);
		let message = shortMessage;
		if (options.cause) message = `${message}: ${options.cause.message}`;
		super(message);
		this.message = message;
		if (options.name && typeof options.name === "string") this.name = options.name;
		else this.name = getGlobalName();
		if (options.cause) Object.defineProperty(this, "_cause", { value: options.cause });
		Object.defineProperty(this, "_info", { value: {} });
		if (options.info && typeof options.info === "object") Object.assign(this._info, options.info);
		if (Error.captureStackTrace) {
			const ctor = options.constructorOpt || this.constructor;
			Error.captureStackTrace(this, ctor);
		}
	}
	static cause(err) {
		assertError(err);
		if (!err._cause) return null;
		return isError(err._cause) ? err._cause : null;
	}
	static fullStack(err) {
		assertError(err);
		const cause = Layerr.cause(err);
		if (cause) return `${err.stack}\ncaused by: ${Layerr.fullStack(cause)}`;
		return err.stack ?? "";
	}
	static info(err) {
		assertError(err);
		const output = {};
		const cause = Layerr.cause(err);
		if (cause) Object.assign(output, Layerr.info(cause));
		if (err._info) Object.assign(output, err._info);
		return output;
	}
	toString() {
		let output = this.name || this.constructor.name || this.constructor.prototype.name;
		if (this.message) output = `${output}: ${this.message}`;
		return output;
	}
};
//#endregion
//#region node_modules/.pnpm/ulidx@2.4.1/node_modules/ulidx/dist/node/index.js
var ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
var ENCODING_LEN = 32;
var TIME_MAX = 0xffffffffffff;
var TIME_LEN = 10;
var RANDOM_LEN = 16;
var ERROR_INFO = Object.freeze({ source: "ulid" });
/**
* Detect the best PRNG (pseudo-random number generator)
* @param root The root to check from (global/window)
* @returns The PRNG function
*/
function detectPRNG(root) {
	const rootLookup = root || detectRoot();
	const globalCrypto = rootLookup && (rootLookup.crypto || rootLookup.msCrypto) || (typeof crypto !== "undefined" ? crypto : null);
	if (typeof globalCrypto?.getRandomValues === "function") return () => {
		const buffer = /* @__PURE__ */ new Uint8Array(1);
		globalCrypto.getRandomValues(buffer);
		return buffer[0] / 255;
	};
	else if (typeof globalCrypto?.randomBytes === "function") return () => globalCrypto.randomBytes(1).readUInt8() / 255;
	else if (crypto?.randomBytes) return () => crypto.randomBytes(1).readUInt8() / 255;
	throw new Layerr({ info: {
		code: "PRNG_DETECT",
		...ERROR_INFO
	} }, "Failed to find a reliable PRNG");
}
function detectRoot() {
	if (inWebWorker()) return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	if (typeof globalThis !== "undefined") return globalThis;
	return null;
}
function encodeRandom(len, prng) {
	let str = "";
	for (; len > 0; len--) str = randomChar(prng) + str;
	return str;
}
/**
* Encode the time portion of a ULID
* @param now The current timestamp
* @param len Length to generate
* @returns The encoded time
*/
function encodeTime(now, len) {
	if (isNaN(now)) throw new Layerr({ info: {
		code: "ENC_TIME_NAN",
		...ERROR_INFO
	} }, `Time must be a number: ${now}`);
	else if (now > TIME_MAX) throw new Layerr({ info: {
		code: "ENC_TIME_SIZE_EXCEED",
		...ERROR_INFO
	} }, `Cannot encode a time larger than ${TIME_MAX}: ${now}`);
	else if (now < 0) throw new Layerr({ info: {
		code: "ENC_TIME_NEG",
		...ERROR_INFO
	} }, `Time must be positive: ${now}`);
	else if (Number.isInteger(now) === false) throw new Layerr({ info: {
		code: "ENC_TIME_TYPE",
		...ERROR_INFO
	} }, `Time must be an integer: ${now}`);
	let mod, str = "";
	for (let currentLen = len; currentLen > 0; currentLen--) {
		mod = now % ENCODING_LEN;
		str = ENCODING.charAt(mod) + str;
		now = (now - mod) / ENCODING_LEN;
	}
	return str;
}
function incrementBase32(str) {
	let done = void 0, index = str.length, char, charIndex, output = str;
	const maxCharIndex = 31;
	while (!done && index-- >= 0) {
		char = output[index];
		charIndex = ENCODING.indexOf(char);
		if (charIndex === -1) throw new Layerr({ info: {
			code: "B32_INC_ENC",
			...ERROR_INFO
		} }, "Incorrectly encoded string");
		if (charIndex === maxCharIndex) {
			output = replaceCharAt(output, index, ENCODING[0]);
			continue;
		}
		done = replaceCharAt(output, index, ENCODING[charIndex + 1]);
	}
	if (typeof done === "string") return done;
	throw new Layerr({ info: {
		code: "B32_INC_INVALID",
		...ERROR_INFO
	} }, "Failed incrementing string");
}
function inWebWorker() {
	return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
}
/**
* Create a ULID factory to generate monotonically-increasing
*  ULIDs
* @param prng The PRNG to use
* @returns A ulid factory
* @example
*  const ulid = monotonicFactory();
*  ulid(); // "01HNZXD07M5CEN5XA66EMZSRZW"
*/
function monotonicFactory(prng) {
	const currentPRNG = prng || detectPRNG();
	let lastTime = 0, lastRandom;
	return function _ulid(seedTime) {
		const seed = isNaN(seedTime) ? Date.now() : seedTime;
		if (seed <= lastTime) {
			const incrementedRandom = lastRandom = incrementBase32(lastRandom);
			return encodeTime(lastTime, TIME_LEN) + incrementedRandom;
		}
		lastTime = seed;
		const newRandom = lastRandom = encodeRandom(RANDOM_LEN, currentPRNG);
		return encodeTime(seed, TIME_LEN) + newRandom;
	};
}
function randomChar(prng) {
	let rand = Math.floor(prng() * ENCODING_LEN);
	if (rand === ENCODING_LEN) rand = 31;
	return ENCODING.charAt(rand);
}
function replaceCharAt(str, index, char) {
	if (index > str.length - 1) return str;
	return str.substr(0, index) + char + str.substr(index + 1);
}
/**
* Generate a ULID
* @param seedTime Optional time seed
* @param prng Optional PRNG function
* @returns A ULID string
* @example
*  ulid(); // "01HNZXD07M5CEN5XA66EMZSRZW"
*/
function ulid(seedTime, prng) {
	const currentPRNG = prng || detectPRNG();
	return encodeTime(isNaN(seedTime) ? Date.now() : seedTime, TIME_LEN) + encodeRandom(RANDOM_LEN, currentPRNG);
}
//#endregion
export { ulid as n, monotonicFactory as t };
