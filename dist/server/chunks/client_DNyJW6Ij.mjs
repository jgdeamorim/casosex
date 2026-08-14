import { Buffer } from "node:buffer";
//#region node_modules/.pnpm/@atcute+uint8array@1.1.5/node_modules/@atcute/uint8array/dist/index.node.js
var _byteLength = /*#__PURE__*/ (() => Buffer.byteLength)();
String.fromCharCode;
/**
* checks if a string's UTF-8 byte length is within a given range
*
* @param str string to measure
* @param min minimum byte length (inclusive)
* @param max maximum byte length (inclusive)
* @returns true if byte length is within [min, max]
*/
var isUtf8LengthInRange = (str, min, max) => {
	const len = str.length;
	if (len * 3 < min) return false;
	if (len >= min && len * 3 <= max) return true;
	const utf8len = _byteLength(str, "utf8");
	return utf8len >= min && utf8len <= max;
};
//#endregion
//#region node_modules/.pnpm/@atcute+util-text@1.3.4/node_modules/@atcute/util-text/dist/utils.js
var isLatin1WithoutCr = (text) => {
	const len = text.length;
	let idx = 0;
	while (idx + 3 < len) {
		const a = text.charCodeAt(idx);
		const b = text.charCodeAt(idx + 1);
		const c = text.charCodeAt(idx + 2);
		const d = text.charCodeAt(idx + 3);
		if ((a | b | c | d) > 255 || a === 13 || b === 13 || c === 13 || d === 13) return false;
		idx += 4;
	}
	while (idx < len) {
		const code = text.charCodeAt(idx);
		if (code > 255 || code === 13) return false;
		idx++;
	}
	return true;
};
//#endregion
//#region node_modules/.pnpm/@atcute+util-text@1.3.4/node_modules/@atcute/util-text/dist/index.js
var segmenter = new Intl.Segmenter();
/**
* checks if the grapheme length of a string is within the specified range
*
* @param text string to check
* @param min minimum grapheme length (inclusive)
* @param max maximum grapheme length (inclusive)
* @returns true if the grapheme length is within range
*/
var isGraphemeLengthInRange = (text, min, max) => {
	const utf16Len = text.length;
	if (utf16Len < min) return false;
	if (min === 0 && utf16Len <= max) return true;
	if (isLatin1WithoutCr(text)) return utf16Len <= max;
	const iterator = segmenter.segment(text)[Symbol.iterator]();
	let count = 0;
	while (!iterator.next().done) {
		count++;
		if (count > max) return false;
	}
	return count >= min;
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/interfaces/bytes.js
var BYTES_SYMBOL = Symbol.for("@atcute/bytes-wrapper");
var BASE64_RE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?)?$/;
var isBase64 = (input) => {
	if (typeof input !== "string") return false;
	return BASE64_RE.test(input);
};
var isBytes = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	const v = input;
	return typeof v === "object" && v !== null && (BYTES_SYMBOL in v || isBase64(v.$bytes) && Object.keys(v).length === 1);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/cid.js
var DASL_CID_RE = /^baf[ky]rei[a-z2-7]{52}$/;
var isCid = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	return typeof input === "string" && input.length === 59 && DASL_CID_RE.test(input);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/did.js
var DID_RE = /^did:([a-z]+):([a-zA-Z0-9._:%-]*[a-zA-Z0-9._-])$/;
var isDid = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	return typeof input === "string" && input.length >= 7 && input.length <= 2048 && DID_RE.test(input);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/utils/ascii.js
var isAsciiAlpha = /* @__NO_SIDE_EFFECTS__ */ (c) => {
	return c >= 65 && c <= 90 || c >= 97 && c <= 122;
};
var isAsciiAlphaNum = /* @__NO_SIDE_EFFECTS__ */ (c) => {
	return /* @__PURE__ */ isAsciiAlpha(c) || c >= 48 && c <= 57;
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/handle.js
var isValidLabel = (input, start, end) => {
	const len = end - start;
	if (len === 0 || len > 63) return false;
	if (!/* @__PURE__ */ isAsciiAlphaNum(input.charCodeAt(start))) return false;
	if (len > 1) {
		if (!/* @__PURE__ */ isAsciiAlphaNum(input.charCodeAt(end - 1))) return false;
		for (let j = start + 1; j < end - 1; j++) {
			const c = input.charCodeAt(j);
			if (!/* @__PURE__ */ isAsciiAlphaNum(c) && c !== 45) return false;
		}
	}
	return true;
};
var isHandle = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	if (typeof input !== "string") return false;
	const len = input.length;
	if (len < 3 || len > 253) return false;
	let labelStart = 0;
	let labelCount = 0;
	let lastLabelStart = 0;
	for (let i = 0; i <= len; i++) if (i === len || input.charCodeAt(i) === 46) {
		if (!isValidLabel(input, labelStart, i)) return false;
		lastLabelStart = labelStart;
		labelStart = i + 1;
		labelCount++;
	}
	if (labelCount < 2) return false;
	return /* @__PURE__ */ isAsciiAlpha(input.charCodeAt(lastLabelStart));
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/at-identifier.js
var isActorIdentifier = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	return /* @__PURE__ */ isDid(input) || /* @__PURE__ */ isHandle(input);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/nsid.js
var isNsid = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	if (typeof input !== "string") return false;
	const len = input.length;
	if (len < 5 || len > 317) return false;
	let lastDot = -1;
	for (let j = len - 1; j >= 0; j--) if (input.charCodeAt(j) === 46) {
		lastDot = j;
		break;
	}
	if (lastDot === -1) return false;
	let segStart = 0;
	let segIdx = 0;
	for (let i = 0; i <= lastDot; i++) if (i === lastDot || input.charCodeAt(i) === 46) {
		const segLen = i - segStart;
		if (segLen === 0 || segLen > 63) return false;
		const first = input.charCodeAt(segStart);
		if (segIdx === 0) {
			if (!/* @__PURE__ */ isAsciiAlpha(first)) return false;
		} else if (!/* @__PURE__ */ isAsciiAlphaNum(first)) return false;
		if (segLen > 1) {
			if (!/* @__PURE__ */ isAsciiAlphaNum(input.charCodeAt(i - 1))) return false;
			for (let j = segStart + 1; j < i - 1; j++) {
				const c = input.charCodeAt(j);
				if (!/* @__PURE__ */ isAsciiAlphaNum(c) && c !== 45) return false;
			}
		}
		segStart = i + 1;
		segIdx++;
	}
	if (segIdx < 2) return false;
	const nameStart = lastDot + 1;
	const nameLen = len - nameStart;
	if (nameLen === 0 || nameLen > 63) return false;
	if (!/* @__PURE__ */ isAsciiAlpha(input.charCodeAt(nameStart))) return false;
	for (let j = nameStart + 1; j < len; j++) if (!/* @__PURE__ */ isAsciiAlphaNum(input.charCodeAt(j))) return false;
	return true;
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/record-key.js
var isRecordKey = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	if (typeof input !== "string") return false;
	const len = input.length;
	if (len < 1 || len > 512) return false;
	if (len <= 2 && input.charCodeAt(0) === 46 && (len === 1 || input.charCodeAt(1) === 46)) return false;
	for (let i = 0; i < len; i++) {
		const c = input.charCodeAt(i);
		if (!/* @__PURE__ */ isAsciiAlphaNum(c) && c !== 95 && c !== 126 && c !== 46 && c !== 58 && c !== 45) return false;
	}
	return true;
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/at-uri.js
var AT_URI_MIN_LENGTH = 8;
var AT_URI_MAX_LENGTH = 8192;
var isFragmentChar = (c) => {
	return /* @__PURE__ */ isAsciiAlphaNum(c) || c === 46 || c === 95 || c === 126 || c === 58 || c === 64 || c === 33 || c === 36 || c === 38 || c === 37 || c === 39 || c === 41 || c === 40 || c === 42 || c === 43 || c === 44 || c === 59 || c === 61 || c === 45 || c === 91 || c === 93 || c === 47 || c === 92;
};
var isResourceUri = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	if (typeof input !== "string") return false;
	const len = input.length;
	if (len < AT_URI_MIN_LENGTH || len > AT_URI_MAX_LENGTH) return false;
	if (input.charCodeAt(0) !== 97 || input.charCodeAt(1) !== 116 || input.charCodeAt(2) !== 58 || input.charCodeAt(3) !== 47 || input.charCodeAt(4) !== 47) return false;
	const hash = input.indexOf("#", 5);
	const stop = hash === -1 ? len : hash;
	if (hash !== -1) {
		const fragmentStart = hash + 1;
		if (fragmentStart >= len || input.charCodeAt(fragmentStart) !== 47) return false;
		for (let idx = fragmentStart; idx < len; idx++) if (!isFragmentChar(input.charCodeAt(idx))) return false;
	}
	const firstSlash = input.indexOf("/", 5);
	let repoEnd = stop;
	let collection;
	let rkey;
	if (firstSlash !== -1 && firstSlash < stop) {
		repoEnd = firstSlash;
		const collectionStart = firstSlash + 1;
		if (collectionStart >= stop) return false;
		const secondSlash = input.indexOf("/", collectionStart);
		if (secondSlash !== -1 && secondSlash < stop) {
			if (secondSlash === collectionStart || secondSlash + 1 >= stop) return false;
			const thirdSlash = input.indexOf("/", secondSlash + 1);
			if (thirdSlash !== -1 && thirdSlash < stop) return false;
			collection = input.substring(collectionStart, secondSlash);
			rkey = input.substring(secondSlash + 1, stop);
		} else collection = input.substring(collectionStart, stop);
	}
	if (repoEnd <= 5) return false;
	return /* @__PURE__ */ isActorIdentifier(input.substring(5, repoEnd)) && (collection === void 0 || /* @__PURE__ */ isNsid(collection)) && (rkey === void 0 || /* @__PURE__ */ isRecordKey(rkey));
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/datetime.js
var DATE_TIME_RE = /^((?!0{4})\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))T((?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d))(\.\d+)?(Z|(?!-00:00)[+-](?:[01]\d|2[0-3]):(?:[0-5]\d))$/;
var isDatetime = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	return typeof input === "string" && input.length >= 20 && input.length <= 64 && DATE_TIME_RE.test(input);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/language.js
var LANGUAGE_CODE_RE = /^((?<grandfathered>(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?<language>([A-Za-z]{2,3}(-(?<extlang>[A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-(?<script>[A-Za-z]{4}))?(-(?<region>[A-Za-z]{2}|[0-9]{3}))?(-(?<variant>[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-(?<extension>[0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(?<privateUseA>x(-[A-Za-z0-9]{1,8})+))?)|(?<privateUseB>x(-[A-Za-z0-9]{1,8})+))$/;
var isLanguageCode = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	return typeof input === "string" && input.length >= 2 && LANGUAGE_CODE_RE.test(input);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/syntax/uri.js
var URI_RE = /^\w+:(?:\/\/)?[^\s/][^\s]*$/;
var isGenericUri = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	if (typeof input !== "string") return false;
	if (!isUtf8LengthInRange(input, 3, 8192)) return false;
	return URI_RE.test(input);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/utils.js
var assert = (condition, message) => {
	if (!condition) throw new Error(`Assertion failed`);
};
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/validations/utils.js
var lazyProperty = /* @__NO_SIDE_EFFECTS__ */ (obj, prop, value) => {
	Object.defineProperty(obj, prop, { value });
	return value;
};
var lazy = /* @__NO_SIDE_EFFECTS__ */ (getter) => {
	return { get value() {
		const value = getter();
		return /* @__PURE__ */ lazyProperty(this, "value", value);
	} };
};
var isArray = Array.isArray;
var isObject = /* @__NO_SIDE_EFFECTS__ */ (input) => {
	return typeof input === "object" && input !== null && !isArray(input);
};
var allowsEval = /*#__PURE__*/ lazy(() => {
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch {
		return false;
	}
});
//#endregion
//#region node_modules/.pnpm/@atcute+lexicons@2.0.3/node_modules/@atcute/lexicons/dist/validations/index.js
/**
* flag indicating whether xrpc schema generation helpers are used. set to true when query() or procedure() is
* called. this enables conditional tree-shaking of validation code when schemas are not used.
*
* @deprecated internal flag for tree-shaking, do not use directly
*/
var xrpcSchemaGenerated = false;
var joinIssues = /* @__NO_SIDE_EFFECTS__ */ (left, right) => {
	return left ? {
		ok: false,
		code: "join",
		left,
		right
	} : right;
};
var prependPath = /* @__NO_SIDE_EFFECTS__ */ (key, tree) => {
	return {
		ok: false,
		code: "prepend",
		key,
		tree
	};
};
var ok$1 = /* @__NO_SIDE_EFFECTS__ */ (value) => {
	return {
		ok: true,
		value
	};
};
var cloneIssueWithPath = (issue, path) => {
	const { ok: _ok, msg: _fmt, ...clone } = issue;
	return {
		...clone,
		path
	};
};
var collectIssues = (tree, path = [], issues = []) => {
	for (;;) switch (tree.code) {
		case "join":
			collectIssues(tree.left, path.slice(), issues);
			tree = tree.right;
			continue;
		case "prepend":
			path.push(tree.key);
			tree = tree.tree;
			continue;
		default:
			issues.push(cloneIssueWithPath(tree, path));
			return issues;
	}
};
var countIssues = (tree) => {
	let count = 0;
	for (;;) switch (tree.code) {
		case "join":
			count += countIssues(tree.left);
			tree = tree.right;
			continue;
		case "prepend":
			tree = tree.tree;
			continue;
		default: return count + 1;
	}
};
var formatLiteral = (value) => {
	return JSON.stringify(value);
};
var formatRangeMessage = (type, unit, min, max) => {
	let message = `expected ${type} `;
	if (min > 0) {
		if (max === min) message += `${min}`;
		else if (max !== Infinity) message += `between ${min} and ${max}`;
		else message += `at least ${min}`;
	} else message += `at most ${max}`;
	message += ` ${unit}(s)`;
	return message;
};
var formatIssueTree = (tree) => {
	let path = "";
	let count = 0;
	for (;;) {
		switch (tree.code) {
			case "join":
				count += countIssues(tree.right);
				tree = tree.left;
				continue;
			case "prepend":
				path += `.${tree.key}`;
				tree = tree.tree;
				continue;
		}
		break;
	}
	const message = tree.msg();
	let msg = `${tree.code} at ${path || "."} (${message})`;
	if (count > 0) msg += ` (+${count} other issue(s))`;
	return msg;
};
var ValidationError = class extends Error {
	name = "ValidationError";
	#issueTree;
	constructor(issueTree) {
		super();
		this.#issueTree = issueTree;
	}
	get message() {
		return formatIssueTree(this.#issueTree);
	}
	get issues() {
		return collectIssues(this.#issueTree);
	}
};
var ErrImpl = class {
	ok = false;
	#issueTree;
	constructor(issueTree) {
		this.#issueTree = issueTree;
	}
	get message() {
		return formatIssueTree(this.#issueTree);
	}
	get issues() {
		return collectIssues(this.#issueTree);
	}
	throw() {
		throw new ValidationError(this.#issueTree);
	}
};
var safeParse = /* @__NO_SIDE_EFFECTS__ */ (schema, input, options) => {
	let flags = 0;
	if (options?.strict) flags |= 2;
	const r = schema["~run"](input, flags);
	if (r === void 0) return /* @__PURE__ */ ok$1(input);
	if (r.ok) return r;
	return new ErrImpl(r);
};
var collectStandardIssues = (tree, path = [], issues = []) => {
	for (;;) switch (tree.code) {
		case "join":
			collectStandardIssues(tree.left, path.slice(), issues);
			tree = tree.right;
			continue;
		case "prepend":
			path.push(tree.key);
			tree = tree.tree;
			continue;
		default:
			issues.push({
				message: tree.msg(),
				path: path.length > 0 ? path : void 0
			});
			return issues;
	}
};
var toStandardSchema = (schema) => {
	return {
		version: 1,
		vendor: "@atcute/lexicons",
		validate(value) {
			const r = schema["~run"](value, 0);
			if (r === void 0) return { value };
			if (r.ok) return { value: r.value };
			return { issues: collectStandardIssues(r) };
		}
	};
};
var constrain = /* @__NO_SIDE_EFFECTS__ */ (base, constraints) => {
	const len = constraints.length;
	const run = (input, flags) => {
		let result = base["~run"](input, flags);
		let current;
		if (result === void 0) current = input;
		else if (result.ok) current = result.value;
		else return result;
		for (let idx = 0; idx < len; idx++) {
			const r = constraints[idx]["~run"](current, flags);
			if (r !== void 0) {
				if (r.ok) {
					current = r.value;
					if (result === void 0 || result.ok) result = r;
				} else if (flags & 1) return r;
				else if (result === void 0 || result.ok) result = r;
				else result = /* @__PURE__ */ joinIssues(result, r);
			}
		}
		return result;
	};
	return Object.defineProperties(Object.create(base), {
		"~run": {
			enumerable: true,
			value: run
		},
		constraints: {
			enumerable: true,
			value: constraints
		}
	});
};
var literal = /* @__NO_SIDE_EFFECTS__ */ (value) => {
	const issue = {
		ok: false,
		code: "invalid_literal",
		expected: [value],
		msg() {
			return `expected ${formatLiteral(value)}`;
		}
	};
	return {
		kind: "schema",
		type: "literal",
		expected: value,
		"~run"(input, _flags) {
			if (input !== value) return issue;
		},
		get "~standard"() {
			return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
		}
	};
};
var ISSUE_TYPE_BOOLEAN = {
	ok: false,
	code: "invalid_type",
	expected: "boolean",
	msg() {
		return `expected boolean`;
	}
};
var BOOLEAN_SCHEMA = {
	kind: "schema",
	type: "boolean",
	"~run"(input, _flags) {
		if (typeof input !== "boolean") return ISSUE_TYPE_BOOLEAN;
	},
	get "~standard"() {
		return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
	}
};
var boolean = /* @__NO_SIDE_EFFECTS__ */ () => {
	return BOOLEAN_SCHEMA;
};
var ISSUE_TYPE_INTEGER = {
	ok: false,
	code: "invalid_type",
	expected: "integer",
	msg() {
		return `expected integer`;
	}
};
var INTEGER_SCHEMA = {
	kind: "schema",
	type: "integer",
	"~run"(input, _flags) {
		if (typeof input !== "number") return ISSUE_TYPE_INTEGER;
		if (!Number.isSafeInteger(input)) return ISSUE_TYPE_INTEGER;
	},
	get "~standard"() {
		return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
	}
};
var integer = /* @__NO_SIDE_EFFECTS__ */ () => {
	return INTEGER_SCHEMA;
};
var integerRange = /* @__NO_SIDE_EFFECTS__ */ (min, max = Infinity) => {
	const issue = {
		ok: false,
		code: "invalid_integer_range",
		min,
		max,
		msg() {
			let message = `expected an integer `;
			if (min > 0) {
				if (max === min) message += `of exactly ${min}`;
				else if (max !== Infinity) message += `between ${min} and ${max}`;
				else message += `of at least ${min}`;
			} else message += `of at most ${max}`;
			return message;
		}
	};
	return {
		kind: "constraint",
		type: "integer_range",
		min,
		max,
		"~run"(input, _flags) {
			if (input < min) return issue;
			if (input > max) return issue;
		}
	};
};
var ISSUE_TYPE_STRING = {
	ok: false,
	code: "invalid_type",
	expected: "string",
	msg() {
		return `expected string`;
	}
};
var STRING_SINGLETON = {
	kind: "schema",
	type: "string",
	format: null,
	"~run"(input, _flags) {
		if (typeof input !== "string") return ISSUE_TYPE_STRING;
	},
	get "~standard"() {
		return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
	}
};
var string = /* @__NO_SIDE_EFFECTS__ */ () => {
	return STRING_SINGLETON;
};
var _formattedString = /* @__NO_SIDE_EFFECTS__ */ (format, validate) => {
	const issue = {
		ok: false,
		code: "invalid_string_format",
		expected: format,
		msg() {
			return `expected a ${format} formatted string`;
		}
	};
	const schema = {
		kind: "schema",
		type: "string",
		format,
		"~run"(input, _flags) {
			if (typeof input !== "string") return ISSUE_TYPE_STRING;
			if (!validate(input)) return issue;
		},
		get "~standard"() {
			return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
		}
	};
	return () => schema;
};
var resourceUriString = /*#__PURE__*/ _formattedString("at-uri", isResourceUri);
var cidString = /*#__PURE__*/ _formattedString("cid", isCid);
var datetimeString = /*#__PURE__*/ _formattedString("datetime", isDatetime);
var didString = /*#__PURE__*/ _formattedString("did", isDid);
var handleString = /*#__PURE__*/ _formattedString("handle", isHandle);
var languageCodeString = /*#__PURE__*/ _formattedString("language", isLanguageCode);
var genericUriString = /*#__PURE__*/ _formattedString("uri", isGenericUri);
var stringLength = /* @__NO_SIDE_EFFECTS__ */ (minLength, maxLength = Infinity) => {
	const issue = {
		ok: false,
		code: "invalid_string_length",
		minLength,
		maxLength,
		msg() {
			return formatRangeMessage("a string", "character", minLength, maxLength);
		}
	};
	return {
		kind: "constraint",
		type: "string_length",
		minLength,
		maxLength,
		"~run"(input, _flags) {
			if (!isUtf8LengthInRange(input, minLength, maxLength)) return issue;
		}
	};
};
var stringGraphemes = /* @__NO_SIDE_EFFECTS__ */ (minGraphemes, maxGraphemes = Infinity) => {
	const issue = {
		ok: false,
		code: "invalid_string_graphemes",
		minGraphemes,
		maxGraphemes,
		msg() {
			return formatRangeMessage("a string", "grapheme", minGraphemes, maxGraphemes);
		}
	};
	return {
		kind: "constraint",
		type: "string_graphemes",
		minGraphemes,
		maxGraphemes,
		"~run"(input, _flags) {
			if (!isGraphemeLengthInRange(input, minGraphemes, maxGraphemes)) return issue;
		}
	};
};
var ISSUE_EXPECTED_BYTES = {
	ok: false,
	code: "invalid_type",
	expected: "bytes",
	msg() {
		return `expected bytes`;
	}
};
var BYTES_SCHEMA = {
	kind: "schema",
	type: "bytes",
	"~run"(input, _flags) {
		if (!/* @__PURE__ */ isBytes(input)) return ISSUE_EXPECTED_BYTES;
	},
	get "~standard"() {
		return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
	}
};
var bytes = /* @__NO_SIDE_EFFECTS__ */ () => {
	return BYTES_SCHEMA;
};
var optional = /* @__NO_SIDE_EFFECTS__ */ (wrapped, defaultValue) => {
	return {
		kind: "schema",
		type: "optional",
		wrapped,
		default: defaultValue,
		"~run"(input, flags) {
			if (input === void 0) {
				if (defaultValue === void 0) return;
				return /* @__PURE__ */ ok$1(typeof defaultValue === "function" ? defaultValue() : defaultValue);
			}
			return wrapped["~run"](input, flags);
		},
		get "~standard"() {
			return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
		}
	};
};
var isOptionalSchema = (schema) => {
	return schema.type === "optional";
};
var ISSUE_TYPE_ARRAY = {
	ok: false,
	code: "invalid_type",
	expected: "array",
	msg() {
		return `expected array`;
	}
};
var array = /* @__NO_SIDE_EFFECTS__ */ (item) => {
	const resolvedShape = /* @__PURE__ */ lazy(() => {
		return typeof item === "function" ? item() : item;
	});
	return {
		kind: "schema",
		type: "array",
		get item() {
			return /* @__PURE__ */ lazyProperty(this, "item", resolvedShape.value);
		},
		get "~run"() {
			const shape = resolvedShape.value;
			const matcher = (input, flags) => {
				if (!isArray(input)) return ISSUE_TYPE_ARRAY;
				let issues;
				let output;
				for (let idx = 0, len = input.length; idx < len; idx++) {
					const val = input[idx];
					const r = shape["~run"](val, flags);
					if (r !== void 0) {
						if (r.ok) {
							if (output === void 0) output = input.slice();
							output[idx] = r.value;
						} else {
							if (flags & 1) return /* @__PURE__ */ prependPath(idx, r);
							issues = /* @__PURE__ */ joinIssues(issues, /* @__PURE__ */ prependPath(idx, r));
						}
					}
				}
				if (issues !== void 0) return issues;
				if (output !== void 0) return /* @__PURE__ */ ok$1(output);
			};
			return /* @__PURE__ */ lazyProperty(this, "~run", matcher);
		},
		get "~standard"() {
			return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
		}
	};
};
var arrayLength = /* @__NO_SIDE_EFFECTS__ */ (minLength, maxLength = Infinity) => {
	const issue = {
		ok: false,
		code: "invalid_array_length",
		minLength,
		maxLength,
		msg() {
			return formatRangeMessage("an array", "item", minLength, maxLength);
		}
	};
	return {
		kind: "constraint",
		type: "array_length",
		minLength,
		maxLength,
		"~run"(input, _flags) {
			const length = input.length;
			if (length < minLength) return issue;
			if (length > maxLength) return issue;
		}
	};
};
var ISSUE_TYPE_OBJECT = {
	ok: false,
	code: "invalid_type",
	expected: "object",
	msg() {
		return `expected object`;
	}
};
var ISSUE_MISSING = {
	ok: false,
	code: "missing_value",
	msg() {
		return `missing value`;
	}
};
var set = (obj, key, value) => {
	if (key === "__proto__") Object.defineProperty(obj, key, { value });
	else obj[key] = value;
};
var object = /* @__NO_SIDE_EFFECTS__ */ (shape) => {
	const resolvedEntries = /* @__PURE__ */ lazy(() => {
		const resolved = [];
		for (const key in shape) {
			const schema = shape[key];
			resolved.push({
				key,
				schema,
				optional: isOptionalSchema(schema),
				missing: /* @__PURE__ */ prependPath(key, ISSUE_MISSING)
			});
		}
		return resolved;
	});
	return {
		kind: "schema",
		type: "object",
		get shape() {
			const resolved = resolvedEntries.value;
			const obj = {};
			for (const entry of resolved) obj[entry.key] = entry.schema;
			return /* @__PURE__ */ lazyProperty(this, "shape", obj);
		},
		get "~run"() {
			const shape = resolvedEntries.value;
			const len = shape.length;
			const generateFastpass = () => {
				const fields = [
					["$ok", ok$1],
					["$joinIssues", joinIssues],
					["$prependPath", prependPath]
				];
				let doc = `let $iss,$out;`;
				for (let idx = 0; idx < len; idx++) {
					const entry = shape[idx];
					const key = entry.key;
					const esckey = JSON.stringify(key);
					const id = `_${idx}`;
					doc += `{const $val=$in[${esckey}];`;
					if (entry.optional) doc += `if($val!==undefined){`;
					else doc += `if($val!==undefined||${esckey} in $in){`;
					doc += `const $res=${id}$schema["~run"]($val,$flags);if($res!==undefined)if($res.ok)${key !== "__proto__" ? `($out??={...$in})[${esckey}]=$res.value` : `Object.defineProperty($out??={...$in},${esckey},{value:$res.value})`};else if((($iss=$joinIssues($iss,$prependPath(${esckey},$res))),$flags&1))return $iss;}`;
					if (entry.optional) {
						const schema = entry.schema;
						const innerSchema = schema.wrapped;
						const defaultValue = schema.default;
						fields.push([`${id}$schema`, innerSchema]);
						if (defaultValue !== void 0) {
							const calls = typeof defaultValue === "function" ? `${id}$default()` : `${id}$default`;
							fields.push([`${id}$default`, defaultValue]);
							doc += key !== "__proto__" ? `else($out??={...$in})[${esckey}]=${calls};` : `else Object.defineProperty($out??={...$in},${esckey},{value:${calls}});`;
						}
					} else {
						fields.push([`${id}$schema`, entry.schema]);
						fields.push([`${id}$missing`, entry.missing]);
						doc += `else if((($iss=$joinIssues($iss,${id}$missing)),$flags&1))return $iss;`;
					}
					doc += `}`;
				}
				doc += `if($iss!==undefined)return $iss;if($out!==undefined)return $ok($out);`;
				return new Function(`[${fields.map(([id]) => id).join(",")}]`, `return function matcher($in,$flags){${doc}}`)(fields.map(([, field]) => field));
			};
			if (allowsEval.value) {
				const fastpass = generateFastpass();
				const matcher = (input, flags) => {
					if (!/* @__PURE__ */ isObject(input)) return ISSUE_TYPE_OBJECT;
					return fastpass(input, flags);
				};
				return /* @__PURE__ */ lazyProperty(this, "~run", matcher);
			}
			const matcher = (input, flags) => {
				if (!/* @__PURE__ */ isObject(input)) return ISSUE_TYPE_OBJECT;
				let issues;
				let output;
				for (let idx = 0; idx < len; idx++) {
					const entry = shape[idx];
					const key = entry.key;
					const value = input[key];
					if (!entry.optional && value === void 0 && !(key in input)) {
						issues = /* @__PURE__ */ joinIssues(issues, entry.missing);
						if (flags & 1) return issues;
						continue;
					}
					const r = entry.schema["~run"](value, flags);
					if (r !== void 0) {
						if (r.ok) {
							if (output === void 0) output = { ...input };
							set(output, key, r.value);
						} else {
							issues = /* @__PURE__ */ joinIssues(issues, /* @__PURE__ */ prependPath(key, r));
							if (flags & 1) return issues;
						}
					}
				}
				if (issues !== void 0) return issues;
				if (output !== void 0) return /* @__PURE__ */ ok$1(output);
			};
			return /* @__PURE__ */ lazyProperty(this, "~run", matcher);
		},
		get "~standard"() {
			return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
		}
	};
};
var record = /* @__NO_SIDE_EFFECTS__ */ (key, object) => {
	const validatedObject = /* @__PURE__ */ lazy(() => {
		let t = object.shape.$type;
		assert(t !== void 0, `expected $type in record to be defined`);
		if (t.type === "optional") t = t.wrapped;
		assert(t.type === "literal" && typeof t.expected === "string", `expected $type to be a string literal`);
		return object;
	});
	return {
		kind: "schema",
		type: "record",
		key,
		get object() {
			return /* @__PURE__ */ lazyProperty(this, "object", validatedObject.value);
		},
		"~run"(input, flags) {
			return (/* @__PURE__ */ lazyProperty(this, "~run", validatedObject.value["~run"]))(input, flags);
		},
		get "~standard"() {
			return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
		}
	};
};
var ISSUE_TYPE_UNKNOWN = {
	ok: false,
	code: "invalid_type",
	expected: "unknown",
	msg() {
		return `expected unknown`;
	}
};
var UNKNOWN_SCHEMA = {
	kind: "schema",
	type: "unknown",
	"~run"(input, _flags) {
		if (typeof input !== "object" || input === null) return ISSUE_TYPE_UNKNOWN;
	},
	get "~standard"() {
		return /* @__PURE__ */ lazyProperty(this, "~standard", toStandardSchema(this));
	}
};
var unknown = /* @__NO_SIDE_EFFECTS__ */ () => {
	return UNKNOWN_SCHEMA;
};
var query = /* @__NO_SIDE_EFFECTS__ */ (nsid, options) => {
	xrpcSchemaGenerated = true;
	return {
		kind: "metadata",
		type: "xrpc_query",
		nsid,
		params: options.params,
		get output() {
			let val = options.output;
			switch (val?.type) {
				case "lex": val = {
					type: "lex",
					schema: val.schema
				};
			}
			return /* @__PURE__ */ lazyProperty(this, "output", val);
		}
	};
};
//#endregion
//#region node_modules/.pnpm/@atcute+client@5.1.1_@atcute+lexicons@2.0.3_typescript@6.0.3/node_modules/@atcute/client/dist/fetch-handler.js
var buildFetchHandler = (handler) => {
	if (typeof handler === "object") return handler.handle.bind(handler);
	return handler;
};
var simpleFetchHandler = ({ service, fetch: _fetch = fetch }) => {
	return async (pathname, init) => {
		return await _fetch(new URL(pathname, service).href, init);
	};
};
//#endregion
//#region node_modules/.pnpm/@atcute+client@5.1.1_@atcute+lexicons@2.0.3_typescript@6.0.3/node_modules/@atcute/client/dist/client.js
var JSON_CONTENT_TYPE_RE = /\bapplication\/json\b/;
/** XRPC API client */
var Client = class Client {
	constructor({ handler, proxy = null }) {
		this.handler = buildFetchHandler(handler);
		this.proxy = proxy;
	}
	/**
	* clones this XRPC client
	*
	* @param opts options to merge with
	* @returns the cloned XRPC client
	*/
	clone({ handler = this.handler, proxy = this.proxy } = {}) {
		return new Client({
			handler,
			proxy
		});
	}
	get(name, options = {}) {
		return this.#perform("get", name, options);
	}
	post(name, options = {}) {
		return this.#perform("post", name, options);
	}
	async call(schema, options = {}) {
		if (!xrpcSchemaGenerated) return;
		if ("mainSchema" in schema) schema = schema.mainSchema;
		if (schema.params !== null) {
			const paramsResult = /* @__PURE__ */ safeParse(schema.params, options.params);
			if (!paramsResult.ok) throw new ClientValidationError("params", paramsResult);
		}
		if (schema.type === "xrpc_procedure" && schema.input?.type === "lex") {
			const inputResult = /* @__PURE__ */ safeParse(schema.input.schema, options.input);
			if (!inputResult.ok) throw new ClientValidationError("input", inputResult);
		}
		const isQuery = schema.type === "xrpc_query";
		const method = isQuery ? "get" : "post";
		if (options.as === void 0 && schema.output?.type === "blob") throw new TypeError(`\`as\` option is required for endpoints returning blobs`);
		const format = options.as !== void 0 ? options.as : schema.output?.type === "lex" ? "json" : null;
		const response = await this.#perform(method, schema.nsid, {
			params: options.params,
			input: isQuery ? void 0 : options.input,
			as: format,
			signal: options.signal,
			headers: options.headers
		});
		if (format === "json" && response.ok && schema.output?.type === "lex") {
			const outputResult = /* @__PURE__ */ safeParse(schema.output.schema, response.data);
			if (!outputResult.ok) throw new ClientValidationError("output", outputResult);
			return {
				ok: true,
				status: response.status,
				headers: response.headers,
				data: outputResult.value
			};
		}
		return response;
	}
	async #perform(method, name, { signal, as: format = "json", headers, input, params }) {
		const isWebInput = input && (input instanceof Blob || ArrayBuffer.isView(input) || input instanceof ArrayBuffer || input instanceof ReadableStream);
		const url = `/xrpc/${name}` + _constructSearchParams(params);
		const response = await this.handler(url, {
			method,
			signal,
			body: input && !isWebInput ? JSON.stringify(input) : input,
			headers: _mergeHeaders(headers, {
				"content-type": input && !isWebInput ? "application/json" : null,
				"atproto-proxy": this.proxy
			}),
			duplex: input instanceof ReadableStream ? "half" : void 0
		});
		{
			const status = response.status;
			const headers = response.headers;
			const type = headers.get("content-type");
			if (status !== 200) {
				let json;
				if (type != null && JSON_CONTENT_TYPE_RE.test(type)) try {
					const parsed = await response.json();
					if (isXRPCErrorPayload(parsed)) json = parsed;
				} catch {}
				else await response.body?.cancel();
				return {
					ok: false,
					status,
					headers,
					data: json ?? {
						error: `UnknownXRPCError`,
						message: `Request failed with status code ${status}`
					}
				};
			}
			{
				let data;
				switch (format) {
					case "json":
						if (type != null && JSON_CONTENT_TYPE_RE.test(type)) data = await response.json();
						else {
							await response.body?.cancel();
							throw new TypeError(`Invalid response content-type (got ${type})`);
						}
						break;
					case null:
						data = null;
						await response.body?.cancel();
						break;
					case "blob":
						data = await response.blob();
						break;
					case "bytes":
						data = new Uint8Array(await response.arrayBuffer());
						break;
					case "stream": data = response.body;
				}
				return {
					ok: true,
					status,
					headers,
					data
				};
			}
		}
	}
};
var _constructSearchParams = (params) => {
	let searchParams;
	for (const key in params) {
		const value = params[key];
		if (value !== void 0) {
			searchParams ??= new URLSearchParams();
			if (Array.isArray(value)) for (let idx = 0, len = value.length; idx < len; idx++) {
				const val = value[idx];
				searchParams.append(key, "" + val);
			}
			else searchParams.set(key, "" + value);
		}
	}
	return searchParams ? `?` + searchParams.toString() : "";
};
var _mergeHeaders = (init, defaults) => {
	let headers;
	for (const name in defaults) {
		const value = defaults[name];
		if (value !== null) {
			headers ??= new Headers(init);
			if (!headers.has(name)) headers.set(name, value);
		}
	}
	return headers ?? init;
};
var isXRPCErrorPayload = (input) => {
	const val = input;
	if (typeof val !== "object" || val == null) return false;
	const kindType = typeof val.error;
	const messageType = typeof val.message;
	return kindType === "string" && (messageType === "undefined" || messageType === "string");
};
/**
* takes in the response returned by the client, and either returns the data if it is a successful response,
* or throws if it's a failed response.
*
* @example
* 	const data = await ok(client.get('com.atproto.server.describeServer'));
* 	//    ^? ComAtprotoServerDescribeServer.Output
*
* @param input either a ClientResponse, or a promise that resolves to a ClientResponse
* @returns the data from a successful response
*/
var ok = (input) => {
	if (input instanceof Promise) return input.then(ok);
	if (input.ok) return input.data;
	throw new ClientResponseError(input);
};
/** represents an error response returned by the client */
var ClientResponseError = class extends Error {
	constructor({ status, headers = new Headers(), data }) {
		super(`${data.error} > ${data.message ?? "(unspecified description)"}`);
		this.name = "ClientResponseError";
		this.error = data.error;
		this.description = data.message;
		this.status = status;
		this.headers = headers;
	}
};
/** represents a validation error during typed calls */
var ClientValidationError = class extends Error {
	constructor(target, result) {
		super(`validation failed for ${target}: ${result.message}`);
		this.name = "ClientValidationError";
		this.target = target;
		this.result = result;
	}
};
//#endregion
export { record as C, stringGraphemes as D, string as E, stringLength as O, query as S, safeParse as T, integerRange as _, simpleFetchHandler as a, object as b, boolean as c, constrain as d, datetimeString as f, integer as g, handleString as h, ok as i, unknown as k, bytes as l, genericUriString as m, ClientResponseError as n, array as o, didString as p, ClientValidationError as r, arrayLength as s, Client as t, cidString as u, languageCodeString as v, resourceUriString as w, optional as x, literal as y };
