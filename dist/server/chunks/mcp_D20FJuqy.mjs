import { a as __toCommonJS, n as __esmMin, o as __toESM, r as __exportAll, t as __commonJSMin } from "./rolldown-runtime_BMI-E3GI.mjs";
import { A as toJSONSchema, C as string, O as datetime, T as unknown, _ as number, _t as normalizeParams, a as _enum, b as preprocess, c as array, dt as parse, f as discriminatedUnion, ft as parseAsync, g as looseObject, gt as defineLazy, h as literal, ht as clone, l as boolean, lt as $ZodObject, mt as safeParseAsync$1, o as _null, p as intersection, pt as safeParse$1, r as ZodOptional$1, u as custom, ut as $ZodType, v as object$1, vt as $constructor, w as union, x as record, y as optional } from "./schemas_CzTFUUcv.mjs";
import { t as CONTENT_TYPE_RE } from "./media-DWIzoVFL_BXsPMJM8.mjs";
import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { D as bylineCreateBody, F as contentBylineInputSchema, V as contentSeoInput, k as bylineUpdateBody } from "./relations-C4duJnwI_Csyh7PoS.mjs";
import { t as Role } from "./types-ndj-bYfi_CKu1x_5-.mjs";
import { d as hasScope } from "./passkey_eKvnpHNN.mjs";
import { i as Permissions, m as hasPermission, o as canActOnOwn } from "./dist_Lsl8Hpq0.mjs";
import { t as apiError } from "./error-DmmN74gW_Djmejxxh.mjs";
import "./api-tokens-CEsW_jCg_B5pZxyoX.mjs";
import "./schemas_CKWG3bd1.mjs";
//#region self-essentials/emdash-main/packages/core/dist/portable-text-CNahFfj6.mjs
/**
* Convert Portable Text blocks to Markdown.
* Unknown block types are serialized as opaque fences.
*/
function portableTextToMarkdown(blocks) {
	const lines = [];
	let prevWasList = false;
	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];
		if (block._type === "block") {
			const isList = !!block.listItem;
			if (i > 0 && (!isList || !prevWasList)) lines.push("");
			lines.push(renderStandardBlock(block));
			prevWasList = isList;
		} else if (block._type === "code") {
			if (i > 0) lines.push("");
			const lang = block.language || "";
			const code = block.code || "";
			lines.push("```" + lang);
			lines.push(code);
			lines.push("```");
			prevWasList = false;
		} else if (block._type === "image") {
			if (i > 0) lines.push("");
			const alt = block.alt || "";
			const url = block.asset?.url || "";
			lines.push(`![${alt}](${url})`);
			prevWasList = false;
		} else {
			if (i > 0) lines.push("");
			lines.push(`<!--ec:block ${JSON.stringify(block)} -->`);
			prevWasList = false;
		}
	}
	return lines.join("\n") + "\n";
}
function renderStandardBlock(block) {
	const text = renderSpans(block.children ?? [], block.markDefs ?? []);
	if (block.listItem) return `${"  ".repeat(Math.max(0, (block.level ?? 1) - 1))}${block.listItem === "number" ? "1." : "-"} ${text}`;
	if (block.style && block.style.startsWith("h")) {
		const level = parseInt(block.style.substring(1), 10);
		if (level >= 1 && level <= 6) return `${"#".repeat(level)} ${text}`;
	}
	if (block.style === "blockquote") return `> ${text}`;
	return text;
}
function renderSpans(spans, markDefs) {
	let result = "";
	for (const span of spans) {
		if (span._type !== "span") continue;
		let text = span.text ?? "";
		const marks = span.marks ?? [];
		for (const mark of marks) {
			const def = markDefs.find((d) => d._key === mark);
			if (def) {
				if (def._type === "link") text = `[${text}](${def.href ?? ""})`;
			} else switch (mark) {
				case "strong":
					text = `**${text}**`;
					break;
				case "em":
					text = `_${text}_`;
					break;
				case "code":
					text = `\`${text}\``;
					break;
				case "strike-through":
				case "strikethrough":
					text = `~~${text}~~`;
					break;
			}
		}
		result += text;
	}
	return result;
}
var OPAQUE_FENCE_PATTERN = /^<!--ec:block (.+) -->$/;
var HEADING_PATTERN = /^(#{1,6})\s+(.+)$/;
var UNORDERED_LIST_PATTERN = /^(\s*)[-*+]\s+(.+)$/;
var ORDERED_LIST_PATTERN = /^(\s*)\d+\.\s+(.+)$/;
var IMAGE_PATTERN = /^!\[([^\]]*)\]\(([^)]+)\)$/;
var INLINE_MARKDOWN_PATTERN = /(\*\*(.+?)\*\*)|(_(.+?)_)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))|(~~(.+?)~~)/g;
/**
* Convert Markdown to Portable Text blocks.
* Opaque fences (<!--ec:block ... -->) are deserialized and spliced back in.
*/
function markdownToPortableText(markdown) {
	const blocks = [];
	const lines = markdown.split("\n");
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		const opaqueMatch = line.match(OPAQUE_FENCE_PATTERN);
		if (opaqueMatch) {
			try {
				blocks.push(JSON.parse(opaqueMatch[1]));
			} catch {
				blocks.push(makeBlock(line));
			}
			i++;
			continue;
		}
		if (line.startsWith("```")) {
			const lang = line.slice(3).trim();
			const codeLines = [];
			i++;
			while (i < lines.length && !lines[i].startsWith("```")) {
				codeLines.push(lines[i]);
				i++;
			}
			blocks.push({
				_type: "code",
				_key: generateKey(),
				language: lang || void 0,
				code: codeLines.join("\n")
			});
			i++;
			continue;
		}
		if (line.trim() === "") {
			i++;
			continue;
		}
		const headingMatch = line.match(HEADING_PATTERN);
		if (headingMatch) {
			blocks.push(makeBlock(headingMatch[2], `h${headingMatch[1].length}`));
			i++;
			continue;
		}
		if (line.startsWith("> ")) {
			blocks.push(makeBlock(line.slice(2), "blockquote"));
			i++;
			continue;
		}
		const ulMatch = line.match(UNORDERED_LIST_PATTERN);
		if (ulMatch) {
			const level = Math.floor(ulMatch[1].length / 2) + 1;
			blocks.push(makeListBlock(ulMatch[2], "bullet", level));
			i++;
			continue;
		}
		const olMatch = line.match(ORDERED_LIST_PATTERN);
		if (olMatch) {
			const level = Math.floor(olMatch[1].length / 2) + 1;
			blocks.push(makeListBlock(olMatch[2], "number", level));
			i++;
			continue;
		}
		const imgMatch = line.match(IMAGE_PATTERN);
		if (imgMatch) {
			blocks.push({
				_type: "image",
				_key: generateKey(),
				alt: imgMatch[1],
				asset: { url: imgMatch[2] }
			});
			i++;
			continue;
		}
		blocks.push(makeBlock(line));
		i++;
	}
	return blocks;
}
function makeBlock(text, style = "normal") {
	const { spans, markDefs } = parseInline(text);
	return {
		_type: "block",
		_key: generateKey(),
		style,
		markDefs,
		children: spans
	};
}
function makeListBlock(text, listItem, level) {
	const { spans, markDefs } = parseInline(text);
	return {
		_type: "block",
		_key: generateKey(),
		style: "normal",
		listItem,
		level,
		markDefs,
		children: spans
	};
}
/**
* Parse inline markdown (bold, italic, code, links, strikethrough) into PT spans + markDefs.
*/
function parseInline(text) {
	const spans = [];
	const markDefs = [];
	const regex = INLINE_MARKDOWN_PATTERN;
	let lastIndex = 0;
	let match;
	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) spans.push({
			_type: "span",
			_key: generateKey(),
			text: text.slice(lastIndex, match.index),
			marks: []
		});
		if (match[2] != null) spans.push({
			_type: "span",
			_key: generateKey(),
			text: match[2],
			marks: ["strong"]
		});
		else if (match[4] != null) spans.push({
			_type: "span",
			_key: generateKey(),
			text: match[4],
			marks: ["em"]
		});
		else if (match[6] != null) spans.push({
			_type: "span",
			_key: generateKey(),
			text: match[6],
			marks: ["code"]
		});
		else if (match[8] != null && match[9] != null) {
			const key = generateKey();
			markDefs.push({
				_key: key,
				_type: "link",
				href: match[9]
			});
			spans.push({
				_type: "span",
				_key: generateKey(),
				text: match[8],
				marks: [key]
			});
		} else if (match[11] != null) spans.push({
			_type: "span",
			_key: generateKey(),
			text: match[11],
			marks: ["strike-through"]
		});
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < text.length) spans.push({
		_type: "span",
		_key: generateKey(),
		text: text.slice(lastIndex),
		marks: []
	});
	if (spans.length === 0) spans.push({
		_type: "span",
		_key: generateKey(),
		text,
		marks: []
	});
	return {
		spans,
		markDefs
	};
}
var keyCounter = 0;
function generateKey() {
	return `k${(keyCounter++).toString(36)}`;
}
/**
* Convert content data for reading: PT fields -> markdown strings.
* Only converts fields with type "portableText" that contain arrays.
*/
function convertDataForRead(data, fields, raw = false) {
	if (raw) return data;
	const result = { ...data };
	for (const field of fields) if (field.type === "portableText" && Array.isArray(result[field.slug])) result[field.slug] = portableTextToMarkdown(result[field.slug]);
	return result;
}
/**
* Convert content data for writing: markdown strings -> PT arrays.
* Only converts fields with type "portableText" that contain strings.
*/
function convertDataForWrite(data, fields) {
	const result = { ...data };
	for (const field of fields) if (field.type === "portableText" && typeof result[field.slug] === "string") result[field.slug] = markdownToPortableText(result[field.slug]);
	return result;
}
/*!
* content-type
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/shared/mediaType.js
var import_content_type = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
	*
	* parameter     = token "=" ( token / quoted-string )
	* token         = 1*tchar
	* tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
	*               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
	*               / DIGIT / ALPHA
	*               ; any VCHAR, except delimiters
	* quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
	* qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
	* obs-text      = %x80-FF
	* quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
	*/
	var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
	/**
	* RegExp to match quoted-pair in RFC 7230 sec 3.2.6
	*
	* quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
	* obs-text    = %x80-FF
	*/
	var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
	/**
	* RegExp to match type in RFC 7231 sec 3.1.1.1
	*
	* media-type = type "/" subtype
	* type       = token
	* subtype    = token
	*/
	var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
	exports.parse = parse;
	/**
	* Parse media type to object.
	*
	* @param {string|object} string
	* @return {Object}
	* @public
	*/
	function parse(string) {
		if (!string) throw new TypeError("argument string is required");
		var header = typeof string === "object" ? getcontenttype(string) : string;
		if (typeof header !== "string") throw new TypeError("argument string is required to be a string");
		var index = header.indexOf(";");
		var type = index !== -1 ? header.slice(0, index).trim() : header.trim();
		if (!TYPE_REGEXP.test(type)) throw new TypeError("invalid media type");
		var obj = new ContentType(type.toLowerCase());
		if (index !== -1) {
			var key;
			var match;
			var value;
			PARAM_REGEXP.lastIndex = index;
			while (match = PARAM_REGEXP.exec(header)) {
				if (match.index !== index) throw new TypeError("invalid parameter format");
				index += match[0].length;
				key = match[1].toLowerCase();
				value = match[2];
				if (value.charCodeAt(0) === 34) {
					value = value.slice(1, -1);
					if (value.indexOf("\\") !== -1) value = value.replace(QESC_REGEXP, "$1");
				}
				obj.parameters[key] = value;
			}
			if (index !== header.length) throw new TypeError("invalid parameter format");
		}
		return obj;
	}
	/**
	* Get content-type from req/res objects.
	*
	* @param {object}
	* @return {Object}
	* @private
	*/
	function getcontenttype(obj) {
		var header;
		if (typeof obj.getHeader === "function") header = obj.getHeader("content-type");
		else if (typeof obj.headers === "object") header = obj.headers && obj.headers["content-type"];
		if (typeof header !== "string") throw new TypeError("content-type header is missing from object");
		return header;
	}
	/**
	* Class to represent a content type.
	* @private
	*/
	function ContentType(type) {
		this.parameters = Object.create(null);
		this.type = type;
	}
})))(), 1);
/**
* Extracts the media type (the lowercased `type/subtype` pair, without
* parameters) from a raw `Content-Type` header value, or `undefined` when the
* header is missing or empty.
*
* Content-Type comparisons must use the parsed media type, never a substring
* search of the raw header: a value like `text/plain; a=application/json`
* contains the substring `application/json` but its media type is
* `text/plain`, and case variants or parameters make naive string comparison
* wrong in both directions.
*
* "Essence" is the WHATWG MIME Sniffing standard's term for the bare
* `type/subtype` pair (https://mimesniff.spec.whatwg.org/#mime-type-essence);
* the Fetch standard's request classification is defined against it
* (https://fetch.spec.whatwg.org/#cors-safelisted-request-header).
*
* Parsing is RFC 9110 (`content-type` package) first. When the parameter
* section is malformed (`application/json;`, `application/json; charset=`),
* browsers and most HTTP stacks still derive the media type from the segment
* before the first `;` — the fallback matches that widely-implemented
* behavior, so a header whose media type is unambiguous is not rejected for
* a sloppy parameter section.
*/
function mediaTypeEssence(header) {
	if (!header) return;
	try {
		return import_content_type.parse(header).type;
	} catch {
		const essence = (header.split(";", 1)[0] ?? "").trim().toLowerCase();
		if (essence === "" || header.slice(essence.length).includes(",")) return;
		return essence;
	}
}
/**
* Whether a raw `Content-Type` header value denotes `application/json`.
* Parameters (for example `charset=utf-8`) are allowed and ignored; malformed
* parameter sections do not reject a header whose media type is unambiguously
* `application/json` (see `mediaTypeEssence` for the exact grammar).
*/
function isJsonContentType(header) {
	if (header === "application/json") return true;
	return mediaTypeEssence(header) === "application/json";
}
var MAX_TIMER_DELAY_MS = 2 ** 31 - 1;
/** Arms an unref'd timer, or disables keep-alive for invalid delays. */
function armSseKeepAlive(intervalMs, onTick) {
	if (!Number.isFinite(intervalMs) || intervalMs < 1) return;
	const timer = setInterval(onTick, Math.min(intervalMs, MAX_TIMER_DELAY_MS));
	timer.unref?.();
	return timer;
}
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
var LATEST_PROTOCOL_VERSION = "2025-11-25";
var SUPPORTED_PROTOCOL_VERSIONS = [
	LATEST_PROTOCOL_VERSION,
	"2025-06-18",
	"2025-03-26",
	"2024-11-05",
	"2024-10-07"
];
var RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
/**
* Assert 'object' type schema.
*
* @internal
*/
var AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function"));
/**
* A progress token, used to associate progress notifications with the original request.
*/
var ProgressTokenSchema = union([string(), number().int()]);
/**
* An opaque token used to represent a cursor for pagination.
*/
var CursorSchema = string();
looseObject({
	/**
	* Requested duration in milliseconds to retain task from creation.
	*/
	ttl: number().optional(),
	/**
	* Time in milliseconds to wait between task status requests.
	*/
	pollInterval: number().optional()
});
var TaskMetadataSchema = object$1({ ttl: number().optional() });
/**
* Metadata for associating messages with a task.
* Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.
*/
var RelatedTaskMetadataSchema = object$1({ taskId: string() });
var RequestMetaSchema = looseObject({
	/**
	* If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
	*/
	progressToken: ProgressTokenSchema.optional(),
	/**
	* If specified, this request is related to the provided task.
	*/
	[RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
});
/**
* Common params for any request.
*/
var BaseRequestParamsSchema = object$1({ 
/**
* See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
*/
_meta: RequestMetaSchema.optional() });
/**
* Common params for any task-augmented request.
*/
var TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* If specified, the caller is requesting task-augmented execution for this request.
* The request will return a CreateTaskResult immediately, and the actual result can be
* retrieved later via tasks/result.
*
* Task augmentation is subject to capability negotiation - receivers MUST declare support
* for task augmentation of specific request types in their capabilities.
*/
task: TaskMetadataSchema.optional() });
/**
* Checks if a value is a valid TaskAugmentedRequestParams.
* @param value - The value to check.
*
* @returns True if the value is a valid TaskAugmentedRequestParams, false otherwise.
*/
var isTaskAugmentedRequestParams = (value) => TaskAugmentedRequestParamsSchema.safeParse(value).success;
var RequestSchema = object$1({
	method: string(),
	params: BaseRequestParamsSchema.loose().optional()
});
var NotificationsParamsSchema = object$1({ 
/**
* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
* for notes on _meta usage.
*/
_meta: RequestMetaSchema.optional() });
var NotificationSchema = object$1({
	method: string(),
	params: NotificationsParamsSchema.loose().optional()
});
var ResultSchema = looseObject({ 
/**
* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
* for notes on _meta usage.
*/
_meta: RequestMetaSchema.optional() });
/**
* A uniquely identifying ID for a request in JSON-RPC.
*/
var RequestIdSchema = union([string(), number().int()]);
/**
* A request that expects a response.
*/
var JSONRPCRequestSchema = object$1({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema,
	...RequestSchema.shape
}).strict();
var isJSONRPCRequest = (value) => JSONRPCRequestSchema.safeParse(value).success;
/**
* A notification which does not expect a response.
*/
var JSONRPCNotificationSchema = object$1({
	jsonrpc: literal("2.0"),
	...NotificationSchema.shape
}).strict();
var isJSONRPCNotification = (value) => JSONRPCNotificationSchema.safeParse(value).success;
/**
* A successful (non-error) response to a request.
*/
var JSONRPCResultResponseSchema = object$1({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema,
	result: ResultSchema
}).strict();
/**
* Checks if a value is a valid JSONRPCResultResponse.
* @param value - The value to check.
*
* @returns True if the value is a valid JSONRPCResultResponse, false otherwise.
*/
var isJSONRPCResultResponse = (value) => JSONRPCResultResponseSchema.safeParse(value).success;
/**
* Error codes defined by the JSON-RPC specification.
*/
var ErrorCode;
(function(ErrorCode) {
	ErrorCode[ErrorCode["ConnectionClosed"] = -32e3] = "ConnectionClosed";
	ErrorCode[ErrorCode["RequestTimeout"] = -32001] = "RequestTimeout";
	ErrorCode[ErrorCode["ParseError"] = -32700] = "ParseError";
	ErrorCode[ErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
	ErrorCode[ErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
	ErrorCode[ErrorCode["InvalidParams"] = -32602] = "InvalidParams";
	ErrorCode[ErrorCode["InternalError"] = -32603] = "InternalError";
	ErrorCode[ErrorCode["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
})(ErrorCode || (ErrorCode = {}));
/**
* A response to a request that indicates an error occurred.
*/
var JSONRPCErrorResponseSchema = object$1({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema.optional(),
	error: object$1({
		/**
		* The error type that occurred.
		*/
		code: number().int(),
		/**
		* A short description of the error. The message SHOULD be limited to a concise single sentence.
		*/
		message: string(),
		/**
		* Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
		*/
		data: unknown().optional()
	})
}).strict();
/**
* Checks if a value is a valid JSONRPCErrorResponse.
* @param value - The value to check.
*
* @returns True if the value is a valid JSONRPCErrorResponse, false otherwise.
*/
var isJSONRPCErrorResponse = (value) => JSONRPCErrorResponseSchema.safeParse(value).success;
var JSONRPCMessageSchema = union([
	JSONRPCRequestSchema,
	JSONRPCNotificationSchema,
	JSONRPCResultResponseSchema,
	JSONRPCErrorResponseSchema
]);
union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
/**
* A response that indicates success but carries no data.
*/
var EmptyResultSchema = ResultSchema.strict();
var CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
	/**
	* The ID of the request to cancel.
	*
	* This MUST correspond to the ID of a request previously issued in the same direction.
	*/
	requestId: RequestIdSchema.optional(),
	/**
	* An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
	*/
	reason: string().optional()
});
/**
* This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
*
* The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
*
* This notification indicates that the result will be unused, so any associated processing SHOULD cease.
*
* A client MUST NOT attempt to cancel its `initialize` request.
*/
var CancelledNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/cancelled"),
	params: CancelledNotificationParamsSchema
});
/**
* Icon schema for use in tools, prompts, resources, and implementations.
*/
var IconSchema = object$1({
	/**
	* URL or data URI for the icon.
	*/
	src: string(),
	/**
	* Optional MIME type for the icon.
	*/
	mimeType: string().optional(),
	/**
	* Optional array of strings that specify sizes at which the icon can be used.
	* Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
	*
	* If not provided, the client should assume that the icon can be used at any size.
	*/
	sizes: array(string()).optional(),
	/**
	* Optional specifier for the theme this icon is designed for. `light` indicates
	* the icon is designed to be used with a light background, and `dark` indicates
	* the icon is designed to be used with a dark background.
	*
	* If not provided, the client should assume the icon can be used with any theme.
	*/
	theme: _enum(["light", "dark"]).optional()
});
/**
* Base schema to add `icons` property.
*
*/
var IconsSchema = object$1({ 
/**
* Optional set of sized icons that the client can display in a user interface.
*
* Clients that support rendering icons MUST support at least the following MIME types:
* - `image/png` - PNG images (safe, universal compatibility)
* - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
*
* Clients that support rendering icons SHOULD also support:
* - `image/svg+xml` - SVG images (scalable but requires security precautions)
* - `image/webp` - WebP images (modern, efficient format)
*/
icons: array(IconSchema).optional() });
/**
* Base metadata interface for common properties across resources, tools, prompts, and implementations.
*/
var BaseMetadataSchema = object$1({
	/** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
	name: string(),
	/**
	* Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
	* even by those unfamiliar with domain-specific terminology.
	*
	* If not provided, the name should be used for display (except for Tool,
	* where `annotations.title` should be given precedence over using `name`,
	* if present).
	*/
	title: string().optional()
});
/**
* Describes the name and version of an MCP implementation.
*/
var ImplementationSchema = BaseMetadataSchema.extend({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	version: string(),
	/**
	* An optional URL of the website for this implementation.
	*/
	websiteUrl: string().optional(),
	/**
	* An optional human-readable description of what this implementation does.
	*
	* This can be used by clients or servers to provide context about their purpose
	* and capabilities. For example, a server might describe the types of resources
	* or tools it provides, while a client might describe its intended use case.
	*/
	description: string().optional()
});
var FormElicitationCapabilitySchema = intersection(object$1({ applyDefaults: boolean().optional() }), record(string(), unknown()));
var ElicitationCapabilitySchema = preprocess((value) => {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		if (Object.keys(value).length === 0) return { form: {} };
	}
	return value;
}, intersection(object$1({
	form: FormElicitationCapabilitySchema.optional(),
	url: AssertObjectSchema.optional()
}), record(string(), unknown()).optional()));
/**
* Task capabilities for clients, indicating which request types support task creation.
*/
var ClientTasksCapabilitySchema = looseObject({
	/**
	* Present if the client supports listing tasks.
	*/
	list: AssertObjectSchema.optional(),
	/**
	* Present if the client supports cancelling tasks.
	*/
	cancel: AssertObjectSchema.optional(),
	/**
	* Capabilities for task creation on specific request types.
	*/
	requests: looseObject({
		/**
		* Task support for sampling requests.
		*/
		sampling: looseObject({ createMessage: AssertObjectSchema.optional() }).optional(),
		/**
		* Task support for elicitation requests.
		*/
		elicitation: looseObject({ create: AssertObjectSchema.optional() }).optional()
	}).optional()
});
/**
* Task capabilities for servers, indicating which request types support task creation.
*/
var ServerTasksCapabilitySchema = looseObject({
	/**
	* Present if the server supports listing tasks.
	*/
	list: AssertObjectSchema.optional(),
	/**
	* Present if the server supports cancelling tasks.
	*/
	cancel: AssertObjectSchema.optional(),
	/**
	* Capabilities for task creation on specific request types.
	*/
	requests: looseObject({ 
	/**
	* Task support for tool requests.
	*/
tools: looseObject({ call: AssertObjectSchema.optional() }).optional() }).optional()
});
/**
* Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
*/
var ClientCapabilitiesSchema = object$1({
	/**
	* Experimental, non-standard capabilities that the client supports.
	*/
	experimental: record(string(), AssertObjectSchema).optional(),
	/**
	* Present if the client supports sampling from an LLM.
	*/
	sampling: object$1({
		/**
		* Present if the client supports context inclusion via includeContext parameter.
		* If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
		*/
		context: AssertObjectSchema.optional(),
		/**
		* Present if the client supports tool use via tools and toolChoice parameters.
		*/
		tools: AssertObjectSchema.optional()
	}).optional(),
	/**
	* Present if the client supports eliciting user input.
	*/
	elicitation: ElicitationCapabilitySchema.optional(),
	/**
	* Present if the client supports listing roots.
	*/
	roots: object$1({ 
	/**
	* Whether the client supports issuing notifications for changes to the roots list.
	*/
listChanged: boolean().optional() }).optional(),
	/**
	* Present if the client supports task creation.
	*/
	tasks: ClientTasksCapabilitySchema.optional(),
	/**
	* Extensions that the client supports. Keys are extension identifiers (vendor-prefix/extension-name).
	*/
	extensions: record(string(), AssertObjectSchema).optional()
});
var InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
	/**
	* The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
	*/
	protocolVersion: string(),
	capabilities: ClientCapabilitiesSchema,
	clientInfo: ImplementationSchema
});
/**
* This request is sent from the client to the server when it first connects, asking it to begin initialization.
*/
var InitializeRequestSchema = RequestSchema.extend({
	method: literal("initialize"),
	params: InitializeRequestParamsSchema
});
var isInitializeRequest = (value) => InitializeRequestSchema.safeParse(value).success;
/**
* Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
*/
var ServerCapabilitiesSchema = object$1({
	/**
	* Experimental, non-standard capabilities that the server supports.
	*/
	experimental: record(string(), AssertObjectSchema).optional(),
	/**
	* Present if the server supports sending log messages to the client.
	*/
	logging: AssertObjectSchema.optional(),
	/**
	* Present if the server supports sending completions to the client.
	*/
	completions: AssertObjectSchema.optional(),
	/**
	* Present if the server offers any prompt templates.
	*/
	prompts: object$1({ 
	/**
	* Whether this server supports issuing notifications for changes to the prompt list.
	*/
listChanged: boolean().optional() }).optional(),
	/**
	* Present if the server offers any resources to read.
	*/
	resources: object$1({
		/**
		* Whether this server supports clients subscribing to resource updates.
		*/
		subscribe: boolean().optional(),
		/**
		* Whether this server supports issuing notifications for changes to the resource list.
		*/
		listChanged: boolean().optional()
	}).optional(),
	/**
	* Present if the server offers any tools to call.
	*/
	tools: object$1({ 
	/**
	* Whether this server supports issuing notifications for changes to the tool list.
	*/
listChanged: boolean().optional() }).optional(),
	/**
	* Present if the server supports task creation.
	*/
	tasks: ServerTasksCapabilitySchema.optional(),
	/**
	* Extensions that the server supports. Keys are extension identifiers (vendor-prefix/extension-name).
	*/
	extensions: record(string(), AssertObjectSchema).optional()
});
/**
* After receiving an initialize request from the client, the server sends this response.
*/
var InitializeResultSchema = ResultSchema.extend({
	/**
	* The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
	*/
	protocolVersion: string(),
	capabilities: ServerCapabilitiesSchema,
	serverInfo: ImplementationSchema,
	/**
	* Instructions describing how to use the server and its features.
	*
	* This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
	*/
	instructions: string().optional()
});
/**
* This notification is sent from the client to the server after initialization has finished.
*/
var InitializedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/initialized"),
	params: NotificationsParamsSchema.optional()
});
/**
* A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
*/
var PingRequestSchema = RequestSchema.extend({
	method: literal("ping"),
	params: BaseRequestParamsSchema.optional()
});
var ProgressSchema = object$1({
	/**
	* The progress thus far. This should increase every time progress is made, even if the total is unknown.
	*/
	progress: number(),
	/**
	* Total number of items to process (or total progress required), if known.
	*/
	total: optional(number()),
	/**
	* An optional message describing the current progress.
	*/
	message: optional(string())
});
var ProgressNotificationParamsSchema = object$1({
	...NotificationsParamsSchema.shape,
	...ProgressSchema.shape,
	/**
	* The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
	*/
	progressToken: ProgressTokenSchema
});
/**
* An out-of-band notification used to inform the receiver of a progress update for a long-running request.
*
* @category notifications/progress
*/
var ProgressNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/progress"),
	params: ProgressNotificationParamsSchema
});
var PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* An opaque token representing the current pagination position.
* If provided, the server should return results starting after this cursor.
*/
cursor: CursorSchema.optional() });
var PaginatedRequestSchema = RequestSchema.extend({ params: PaginatedRequestParamsSchema.optional() });
var PaginatedResultSchema = ResultSchema.extend({ 
/**
* An opaque token representing the pagination position after the last returned result.
* If present, there may be more results available.
*/
nextCursor: CursorSchema.optional() });
/**
* The status of a task.
* */
var TaskStatusSchema = _enum([
	"working",
	"input_required",
	"completed",
	"failed",
	"cancelled"
]);
/**
* A pollable state object associated with a request.
*/
var TaskSchema = object$1({
	taskId: string(),
	status: TaskStatusSchema,
	/**
	* Time in milliseconds to keep task results available after completion.
	* If null, the task has unlimited lifetime until manually cleaned up.
	*/
	ttl: union([number(), _null()]),
	/**
	* ISO 8601 timestamp when the task was created.
	*/
	createdAt: string(),
	/**
	* ISO 8601 timestamp when the task was last updated.
	*/
	lastUpdatedAt: string(),
	pollInterval: optional(number()),
	/**
	* Optional diagnostic message for failed tasks or other status information.
	*/
	statusMessage: optional(string())
});
/**
* Result returned when a task is created, containing the task data wrapped in a task field.
*/
var CreateTaskResultSchema = ResultSchema.extend({ task: TaskSchema });
/**
* Parameters for task status notification.
*/
var TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
/**
* A notification sent when a task's status changes.
*/
var TaskStatusNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/tasks/status"),
	params: TaskStatusNotificationParamsSchema
});
/**
* A request to get the state of a specific task.
*/
var GetTaskRequestSchema = RequestSchema.extend({
	method: literal("tasks/get"),
	params: BaseRequestParamsSchema.extend({ taskId: string() })
});
/**
* The response to a tasks/get request.
*/
var GetTaskResultSchema = ResultSchema.merge(TaskSchema);
/**
* A request to get the result of a specific task.
*/
var GetTaskPayloadRequestSchema = RequestSchema.extend({
	method: literal("tasks/result"),
	params: BaseRequestParamsSchema.extend({ taskId: string() })
});
ResultSchema.loose();
/**
* A request to list tasks.
*/
var ListTasksRequestSchema = PaginatedRequestSchema.extend({ method: literal("tasks/list") });
/**
* The response to a tasks/list request.
*/
var ListTasksResultSchema = PaginatedResultSchema.extend({ tasks: array(TaskSchema) });
/**
* A request to cancel a specific task.
*/
var CancelTaskRequestSchema = RequestSchema.extend({
	method: literal("tasks/cancel"),
	params: BaseRequestParamsSchema.extend({ taskId: string() })
});
/**
* The response to a tasks/cancel request.
*/
var CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
/**
* The contents of a specific resource or sub-resource.
*/
var ResourceContentsSchema = object$1({
	/**
	* The URI of this resource.
	*/
	uri: string(),
	/**
	* The MIME type of this resource, if known.
	*/
	mimeType: optional(string()),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
var TextResourceContentsSchema = ResourceContentsSchema.extend({ 
/**
* The text of the item. This must only be set if the item can actually be represented as text (not binary data).
*/
text: string() });
/**
* A Zod schema for validating Base64 strings that is more performant and
* robust for very large inputs than the default regex-based check. It avoids
* stack overflows by using the native `atob` function for validation.
*/
var Base64Schema = string().refine((val) => {
	try {
		atob(val);
		return true;
	} catch {
		return false;
	}
}, { message: "Invalid Base64 string" });
var BlobResourceContentsSchema = ResourceContentsSchema.extend({ 
/**
* A base64-encoded string representing the binary data of the item.
*/
blob: Base64Schema });
/**
* The sender or recipient of messages and data in a conversation.
*/
var RoleSchema = _enum(["user", "assistant"]);
/**
* Optional annotations providing clients additional context about a resource.
*/
var AnnotationsSchema = object$1({
	/**
	* Intended audience(s) for the resource.
	*/
	audience: array(RoleSchema).optional(),
	/**
	* Importance hint for the resource, from 0 (least) to 1 (most).
	*/
	priority: number().min(0).max(1).optional(),
	/**
	* ISO 8601 timestamp for the most recent modification.
	*/
	lastModified: datetime({ offset: true }).optional()
});
/**
* A known resource that the server is capable of reading.
*/
var ResourceSchema = object$1({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* The URI of this resource.
	*/
	uri: string(),
	/**
	* A description of what this resource represents.
	*
	* This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
	*/
	description: optional(string()),
	/**
	* The MIME type of this resource, if known.
	*/
	mimeType: optional(string()),
	/**
	* The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
	*
	* This can be used by Hosts to display file sizes and estimate context window usage.
	*/
	size: optional(number()),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: optional(looseObject({}))
});
/**
* A template description for resources available on the server.
*/
var ResourceTemplateSchema = object$1({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* A URI template (according to RFC 6570) that can be used to construct resource URIs.
	*/
	uriTemplate: string(),
	/**
	* A description of what this template is for.
	*
	* This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
	*/
	description: optional(string()),
	/**
	* The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
	*/
	mimeType: optional(string()),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: optional(looseObject({}))
});
/**
* Sent from the client to request a list of resources the server has.
*/
var ListResourcesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/list") });
/**
* The server's response to a resources/list request from the client.
*/
var ListResourcesResultSchema = PaginatedResultSchema.extend({ resources: array(ResourceSchema) });
/**
* Sent from the client to request a list of resource templates the server has.
*/
var ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/templates/list") });
/**
* The server's response to a resources/templates/list request from the client.
*/
var ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({ resourceTemplates: array(ResourceTemplateSchema) });
var ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
*
* @format uri
*/
uri: string() });
/**
* Parameters for a `resources/read` request.
*/
var ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to the server, to read a specific resource URI.
*/
var ReadResourceRequestSchema = RequestSchema.extend({
	method: literal("resources/read"),
	params: ReadResourceRequestParamsSchema
});
/**
* The server's response to a resources/read request from the client.
*/
var ReadResourceResultSchema = ResultSchema.extend({ contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema])) });
/**
* An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
*/
var ResourceListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/resources/list_changed"),
	params: NotificationsParamsSchema.optional()
});
var SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.
*/
var SubscribeRequestSchema = RequestSchema.extend({
	method: literal("resources/subscribe"),
	params: SubscribeRequestParamsSchema
});
var UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.
*/
var UnsubscribeRequestSchema = RequestSchema.extend({
	method: literal("resources/unsubscribe"),
	params: UnsubscribeRequestParamsSchema
});
/**
* Parameters for a `notifications/resources/updated` notification.
*/
var ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({ 
/**
* The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
*/
uri: string() });
/**
* A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.
*/
var ResourceUpdatedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/resources/updated"),
	params: ResourceUpdatedNotificationParamsSchema
});
/**
* Describes an argument that a prompt can accept.
*/
var PromptArgumentSchema = object$1({
	/**
	* The name of the argument.
	*/
	name: string(),
	/**
	* A human-readable description of the argument.
	*/
	description: optional(string()),
	/**
	* Whether this argument must be provided.
	*/
	required: optional(boolean())
});
/**
* A prompt or prompt template that the server offers.
*/
var PromptSchema = object$1({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* An optional description of what this prompt provides
	*/
	description: optional(string()),
	/**
	* A list of arguments to use for templating the prompt.
	*/
	arguments: optional(array(PromptArgumentSchema)),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: optional(looseObject({}))
});
/**
* Sent from the client to request a list of prompts and prompt templates the server has.
*/
var ListPromptsRequestSchema = PaginatedRequestSchema.extend({ method: literal("prompts/list") });
/**
* The server's response to a prompts/list request from the client.
*/
var ListPromptsResultSchema = PaginatedResultSchema.extend({ prompts: array(PromptSchema) });
/**
* Parameters for a `prompts/get` request.
*/
var GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
	/**
	* The name of the prompt or prompt template.
	*/
	name: string(),
	/**
	* Arguments to use for templating the prompt.
	*/
	arguments: record(string(), string()).optional()
});
/**
* Used by the client to get a prompt provided by the server.
*/
var GetPromptRequestSchema = RequestSchema.extend({
	method: literal("prompts/get"),
	params: GetPromptRequestParamsSchema
});
/**
* Text provided to or from an LLM.
*/
var TextContentSchema = object$1({
	type: literal("text"),
	/**
	* The text content of the message.
	*/
	text: string(),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* An image provided to or from an LLM.
*/
var ImageContentSchema = object$1({
	type: literal("image"),
	/**
	* The base64-encoded image data.
	*/
	data: Base64Schema,
	/**
	* The MIME type of the image. Different providers may support different image types.
	*/
	mimeType: string(),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* An Audio provided to or from an LLM.
*/
var AudioContentSchema = object$1({
	type: literal("audio"),
	/**
	* The base64-encoded audio data.
	*/
	data: Base64Schema,
	/**
	* The MIME type of the audio. Different providers may support different audio types.
	*/
	mimeType: string(),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* A tool call request from an assistant (LLM).
* Represents the assistant's request to use a tool.
*/
var ToolUseContentSchema = object$1({
	type: literal("tool_use"),
	/**
	* The name of the tool to invoke.
	* Must match a tool name from the request's tools array.
	*/
	name: string(),
	/**
	* Unique identifier for this tool call.
	* Used to correlate with ToolResultContent in subsequent messages.
	*/
	id: string(),
	/**
	* Arguments to pass to the tool.
	* Must conform to the tool's inputSchema.
	*/
	input: record(string(), unknown()),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* The contents of a resource, embedded into a prompt or tool call result.
*/
var EmbeddedResourceSchema = object$1({
	type: literal("resource"),
	resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* A resource that the server is capable of reading, included in a prompt or tool call result.
*
* Note: resource links returned by tools are not guaranteed to appear in the results of `resources/list` requests.
*/
var ResourceLinkSchema = ResourceSchema.extend({ type: literal("resource_link") });
/**
* A content block that can be used in prompts and tool results.
*/
var ContentBlockSchema = union([
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema,
	ResourceLinkSchema,
	EmbeddedResourceSchema
]);
/**
* Describes a message returned as part of a prompt.
*/
var PromptMessageSchema = object$1({
	role: RoleSchema,
	content: ContentBlockSchema
});
/**
* The server's response to a prompts/get request from the client.
*/
var GetPromptResultSchema = ResultSchema.extend({
	/**
	* An optional description for the prompt.
	*/
	description: string().optional(),
	messages: array(PromptMessageSchema)
});
/**
* An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
*/
var PromptListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/prompts/list_changed"),
	params: NotificationsParamsSchema.optional()
});
/**
* Additional properties describing a Tool to clients.
*
* NOTE: all properties in ToolAnnotations are **hints**.
* They are not guaranteed to provide a faithful description of
* tool behavior (including descriptive properties like `title`).
*
* Clients should never make tool use decisions based on ToolAnnotations
* received from untrusted servers.
*/
var ToolAnnotationsSchema = object$1({
	/**
	* A human-readable title for the tool.
	*/
	title: string().optional(),
	/**
	* If true, the tool does not modify its environment.
	*
	* Default: false
	*/
	readOnlyHint: boolean().optional(),
	/**
	* If true, the tool may perform destructive updates to its environment.
	* If false, the tool performs only additive updates.
	*
	* (This property is meaningful only when `readOnlyHint == false`)
	*
	* Default: true
	*/
	destructiveHint: boolean().optional(),
	/**
	* If true, calling the tool repeatedly with the same arguments
	* will have no additional effect on the its environment.
	*
	* (This property is meaningful only when `readOnlyHint == false`)
	*
	* Default: false
	*/
	idempotentHint: boolean().optional(),
	/**
	* If true, this tool may interact with an "open world" of external
	* entities. If false, the tool's domain of interaction is closed.
	* For example, the world of a web search tool is open, whereas that
	* of a memory tool is not.
	*
	* Default: true
	*/
	openWorldHint: boolean().optional()
});
/**
* Execution-related properties for a tool.
*/
var ToolExecutionSchema = object$1({ 
/**
* Indicates the tool's preference for task-augmented execution.
* - "required": Clients MUST invoke the tool as a task
* - "optional": Clients MAY invoke the tool as a task or normal request
* - "forbidden": Clients MUST NOT attempt to invoke the tool as a task
*
* If not present, defaults to "forbidden".
*/
taskSupport: _enum([
	"required",
	"optional",
	"forbidden"
]).optional() });
/**
* Definition for a tool the client can call.
*/
var ToolSchema = object$1({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* A human-readable description of the tool.
	*/
	description: string().optional(),
	/**
	* A JSON Schema 2020-12 object defining the expected parameters for the tool.
	* Must have type: 'object' at the root level per MCP spec.
	*/
	inputSchema: object$1({
		type: literal("object"),
		properties: record(string(), AssertObjectSchema).optional(),
		required: array(string()).optional()
	}).catchall(unknown()),
	/**
	* An optional JSON Schema 2020-12 object defining the structure of the tool's output
	* returned in the structuredContent field of a CallToolResult.
	* Must have type: 'object' at the root level per MCP spec.
	*/
	outputSchema: object$1({
		type: literal("object"),
		properties: record(string(), AssertObjectSchema).optional(),
		required: array(string()).optional()
	}).catchall(unknown()).optional(),
	/**
	* Optional additional tool information.
	*/
	annotations: ToolAnnotationsSchema.optional(),
	/**
	* Execution-related properties for this tool.
	*/
	execution: ToolExecutionSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* Sent from the client to request a list of tools the server has.
*/
var ListToolsRequestSchema = PaginatedRequestSchema.extend({ method: literal("tools/list") });
/**
* The server's response to a tools/list request from the client.
*/
var ListToolsResultSchema = PaginatedResultSchema.extend({ tools: array(ToolSchema) });
/**
* The server's response to a tool call.
*/
var CallToolResultSchema = ResultSchema.extend({
	/**
	* A list of content objects that represent the result of the tool call.
	*
	* If the Tool does not define an outputSchema, this field MUST be present in the result.
	* For backwards compatibility, this field is always present, but it may be empty.
	*/
	content: array(ContentBlockSchema).default([]),
	/**
	* An object containing structured tool output.
	*
	* If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
	*/
	structuredContent: record(string(), unknown()).optional(),
	/**
	* Whether the tool call ended in an error.
	*
	* If not set, this is assumed to be false (the call was successful).
	*
	* Any errors that originate from the tool SHOULD be reported inside the result
	* object, with `isError` set to true, _not_ as an MCP protocol-level error
	* response. Otherwise, the LLM would not be able to see that an error occurred
	* and self-correct.
	*
	* However, any errors in _finding_ the tool, an error indicating that the
	* server does not support tool calls, or any other exceptional conditions,
	* should be reported as an MCP error response.
	*/
	isError: boolean().optional()
});
CallToolResultSchema.or(ResultSchema.extend({ toolResult: unknown() }));
/**
* Parameters for a `tools/call` request.
*/
var CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	/**
	* The name of the tool to call.
	*/
	name: string(),
	/**
	* Arguments to pass to the tool.
	*/
	arguments: record(string(), unknown()).optional()
});
/**
* Used by the client to invoke a tool provided by the server.
*/
var CallToolRequestSchema = RequestSchema.extend({
	method: literal("tools/call"),
	params: CallToolRequestParamsSchema
});
/**
* An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
*/
var ToolListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/tools/list_changed"),
	params: NotificationsParamsSchema.optional()
});
object$1({
	/**
	* If true, the list will be refreshed automatically when a list changed notification is received.
	* The callback will be called with the updated list.
	*
	* If false, the callback will be called with null items, allowing manual refresh.
	*
	* @default true
	*/
	autoRefresh: boolean().default(true),
	/**
	* Debounce time in milliseconds for list changed notification processing.
	*
	* Multiple notifications received within this timeframe will only trigger one refresh.
	* Set to 0 to disable debouncing.
	*
	* @default 300
	*/
	debounceMs: number().int().nonnegative().default(300)
});
/**
* The severity of a log message.
*/
var LoggingLevelSchema = _enum([
	"debug",
	"info",
	"notice",
	"warning",
	"error",
	"critical",
	"alert",
	"emergency"
]);
/**
* Parameters for a `logging/setLevel` request.
*/
var SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
*/
level: LoggingLevelSchema });
/**
* A request from the client to the server, to enable or adjust logging.
*/
var SetLevelRequestSchema = RequestSchema.extend({
	method: literal("logging/setLevel"),
	params: SetLevelRequestParamsSchema
});
/**
* Parameters for a `notifications/message` notification.
*/
var LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
	/**
	* The severity of this log message.
	*/
	level: LoggingLevelSchema,
	/**
	* An optional name of the logger issuing this message.
	*/
	logger: string().optional(),
	/**
	* The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
	*/
	data: unknown()
});
/**
* Notification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.
*/
var LoggingMessageNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/message"),
	params: LoggingMessageNotificationParamsSchema
});
/**
* Hints to use for model selection.
*/
var ModelHintSchema = object$1({ 
/**
* A hint for a model name.
*/
name: string().optional() });
/**
* The server's preferences for model selection, requested of the client during sampling.
*/
var ModelPreferencesSchema = object$1({
	/**
	* Optional hints to use for model selection.
	*/
	hints: array(ModelHintSchema).optional(),
	/**
	* How much to prioritize cost when selecting a model.
	*/
	costPriority: number().min(0).max(1).optional(),
	/**
	* How much to prioritize sampling speed (latency) when selecting a model.
	*/
	speedPriority: number().min(0).max(1).optional(),
	/**
	* How much to prioritize intelligence and capabilities when selecting a model.
	*/
	intelligencePriority: number().min(0).max(1).optional()
});
/**
* Controls tool usage behavior in sampling requests.
*/
var ToolChoiceSchema = object$1({ 
/**
* Controls when tools are used:
* - "auto": Model decides whether to use tools (default)
* - "required": Model MUST use at least one tool before completing
* - "none": Model MUST NOT use any tools
*/
mode: _enum([
	"auto",
	"required",
	"none"
]).optional() });
/**
* The result of a tool execution, provided by the user (server).
* Represents the outcome of invoking a tool requested via ToolUseContent.
*/
var ToolResultContentSchema = object$1({
	type: literal("tool_result"),
	toolUseId: string().describe("The unique identifier for the corresponding tool call."),
	content: array(ContentBlockSchema).default([]),
	structuredContent: object$1({}).loose().optional(),
	isError: boolean().optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* Basic content types for sampling responses (without tool use).
* Used for backwards-compatible CreateMessageResult when tools are not used.
*/
var SamplingContentSchema = discriminatedUnion("type", [
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema
]);
/**
* Content block types allowed in sampling messages.
* This includes text, image, audio, tool use requests, and tool results.
*/
var SamplingMessageContentBlockSchema = discriminatedUnion("type", [
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema,
	ToolUseContentSchema,
	ToolResultContentSchema
]);
/**
* Describes a message issued to or received from an LLM API.
*/
var SamplingMessageSchema = object$1({
	role: RoleSchema,
	content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* Parameters for a `sampling/createMessage` request.
*/
var CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	messages: array(SamplingMessageSchema),
	/**
	* The server's preferences for which model to select. The client MAY modify or omit this request.
	*/
	modelPreferences: ModelPreferencesSchema.optional(),
	/**
	* An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
	*/
	systemPrompt: string().optional(),
	/**
	* A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
	* The client MAY ignore this request.
	*
	* Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
	* declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
	*/
	includeContext: _enum([
		"none",
		"thisServer",
		"allServers"
	]).optional(),
	temperature: number().optional(),
	/**
	* The requested maximum number of tokens to sample (to prevent runaway completions).
	*
	* The client MAY choose to sample fewer tokens than the requested maximum.
	*/
	maxTokens: number().int(),
	stopSequences: array(string()).optional(),
	/**
	* Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
	*/
	metadata: AssertObjectSchema.optional(),
	/**
	* Tools that the model may use during generation.
	* The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
	*/
	tools: array(ToolSchema).optional(),
	/**
	* Controls how the model uses tools.
	* The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
	* Default is `{ mode: "auto" }`.
	*/
	toolChoice: ToolChoiceSchema.optional()
});
/**
* A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
*/
var CreateMessageRequestSchema = RequestSchema.extend({
	method: literal("sampling/createMessage"),
	params: CreateMessageRequestParamsSchema
});
/**
* The client's response to a sampling/create_message request from the server.
* This is the backwards-compatible version that returns single content (no arrays).
* Used when the request does not include tools.
*/
var CreateMessageResultSchema = ResultSchema.extend({
	/**
	* The name of the model that generated the message.
	*/
	model: string(),
	/**
	* The reason why sampling stopped, if known.
	*
	* Standard values:
	* - "endTurn": Natural end of the assistant's turn
	* - "stopSequence": A stop sequence was encountered
	* - "maxTokens": Maximum token limit was reached
	*
	* This field is an open string to allow for provider-specific stop reasons.
	*/
	stopReason: optional(_enum([
		"endTurn",
		"stopSequence",
		"maxTokens"
	]).or(string())),
	role: RoleSchema,
	/**
	* Response content. Single content block (text, image, or audio).
	*/
	content: SamplingContentSchema
});
/**
* The client's response to a sampling/create_message request when tools were provided.
* This version supports array content for tool use flows.
*/
var CreateMessageResultWithToolsSchema = ResultSchema.extend({
	/**
	* The name of the model that generated the message.
	*/
	model: string(),
	/**
	* The reason why sampling stopped, if known.
	*
	* Standard values:
	* - "endTurn": Natural end of the assistant's turn
	* - "stopSequence": A stop sequence was encountered
	* - "maxTokens": Maximum token limit was reached
	* - "toolUse": The model wants to use one or more tools
	*
	* This field is an open string to allow for provider-specific stop reasons.
	*/
	stopReason: optional(_enum([
		"endTurn",
		"stopSequence",
		"maxTokens",
		"toolUse"
	]).or(string())),
	role: RoleSchema,
	/**
	* Response content. May be a single block or array. May include ToolUseContent if stopReason is "toolUse".
	*/
	content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
});
/**
* Primitive schema definition for boolean fields.
*/
var BooleanSchemaSchema = object$1({
	type: literal("boolean"),
	title: string().optional(),
	description: string().optional(),
	default: boolean().optional()
});
/**
* Primitive schema definition for string fields.
*/
var StringSchemaSchema = object$1({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	minLength: number().optional(),
	maxLength: number().optional(),
	format: _enum([
		"email",
		"uri",
		"date",
		"date-time"
	]).optional(),
	default: string().optional()
});
/**
* Primitive schema definition for number fields.
*/
var NumberSchemaSchema = object$1({
	type: _enum(["number", "integer"]),
	title: string().optional(),
	description: string().optional(),
	minimum: number().optional(),
	maximum: number().optional(),
	default: number().optional()
});
/**
* Schema for single-selection enumeration without display titles for options.
*/
var UntitledSingleSelectEnumSchemaSchema = object$1({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	enum: array(string()),
	default: string().optional()
});
/**
* Schema for single-selection enumeration with display titles for each option.
*/
var TitledSingleSelectEnumSchemaSchema = object$1({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	oneOf: array(object$1({
		const: string(),
		title: string()
	})),
	default: string().optional()
});
/**
* Use TitledSingleSelectEnumSchema instead.
* This interface will be removed in a future version.
*/
var LegacyTitledEnumSchemaSchema = object$1({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	enum: array(string()),
	enumNames: array(string()).optional(),
	default: string().optional()
});
var SingleSelectEnumSchemaSchema = union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]);
/**
* Schema for multiple-selection enumeration without display titles for options.
*/
var UntitledMultiSelectEnumSchemaSchema = object$1({
	type: literal("array"),
	title: string().optional(),
	description: string().optional(),
	minItems: number().optional(),
	maxItems: number().optional(),
	items: object$1({
		type: literal("string"),
		enum: array(string())
	}),
	default: array(string()).optional()
});
/**
* Schema for multiple-selection enumeration with display titles for each option.
*/
var TitledMultiSelectEnumSchemaSchema = object$1({
	type: literal("array"),
	title: string().optional(),
	description: string().optional(),
	minItems: number().optional(),
	maxItems: number().optional(),
	items: object$1({ anyOf: array(object$1({
		const: string(),
		title: string()
	})) }),
	default: array(string()).optional()
});
/**
* Combined schema for multiple-selection enumeration
*/
var MultiSelectEnumSchemaSchema = union([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema]);
/**
* Primitive schema definition for enum fields.
*/
var EnumSchemaSchema = union([
	LegacyTitledEnumSchemaSchema,
	SingleSelectEnumSchemaSchema,
	MultiSelectEnumSchemaSchema
]);
/**
* Union of all primitive schema definitions.
*/
var PrimitiveSchemaDefinitionSchema = union([
	EnumSchemaSchema,
	BooleanSchemaSchema,
	StringSchemaSchema,
	NumberSchemaSchema
]);
/**
* Parameters for an `elicitation/create` request for form-based elicitation.
*/
var ElicitRequestFormParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	/**
	* The elicitation mode.
	*
	* Optional for backward compatibility. Clients MUST treat missing mode as "form".
	*/
	mode: literal("form").optional(),
	/**
	* The message to present to the user describing what information is being requested.
	*/
	message: string(),
	/**
	* A restricted subset of JSON Schema.
	* Only top-level properties are allowed, without nesting.
	*/
	requestedSchema: object$1({
		type: literal("object"),
		properties: record(string(), PrimitiveSchemaDefinitionSchema),
		required: array(string()).optional()
	})
});
/**
* Parameters for an `elicitation/create` request for URL-based elicitation.
*/
var ElicitRequestURLParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	/**
	* The elicitation mode.
	*/
	mode: literal("url"),
	/**
	* The message to present to the user explaining why the interaction is needed.
	*/
	message: string(),
	/**
	* The ID of the elicitation, which must be unique within the context of the server.
	* The client MUST treat this ID as an opaque value.
	*/
	elicitationId: string(),
	/**
	* The URL that the user should navigate to.
	*/
	url: string().url()
});
/**
* The parameters for a request to elicit additional information from the user via the client.
*/
var ElicitRequestParamsSchema = union([ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema]);
/**
* A request from the server to elicit user input via the client.
* The client should present the message and form fields to the user (form mode)
* or navigate to a URL (URL mode).
*/
var ElicitRequestSchema = RequestSchema.extend({
	method: literal("elicitation/create"),
	params: ElicitRequestParamsSchema
});
/**
* Parameters for a `notifications/elicitation/complete` notification.
*
* @category notifications/elicitation/complete
*/
var ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({ 
/**
* The ID of the elicitation that completed.
*/
elicitationId: string() });
/**
* A notification from the server to the client, informing it of a completion of an out-of-band elicitation request.
*
* @category notifications/elicitation/complete
*/
var ElicitationCompleteNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/elicitation/complete"),
	params: ElicitationCompleteNotificationParamsSchema
});
/**
* The client's response to an elicitation/create request from the server.
*/
var ElicitResultSchema = ResultSchema.extend({
	/**
	* The user action in response to the elicitation.
	* - "accept": User submitted the form/confirmed the action
	* - "decline": User explicitly decline the action
	* - "cancel": User dismissed without making an explicit choice
	*/
	action: _enum([
		"accept",
		"decline",
		"cancel"
	]),
	/**
	* The submitted form data, only present when action is "accept".
	* Contains values matching the requested schema.
	* Per MCP spec, content is "typically omitted" for decline/cancel actions.
	* We normalize null to undefined for leniency while maintaining type compatibility.
	*/
	content: preprocess((val) => val === null ? void 0 : val, record(string(), union([
		string(),
		number(),
		boolean(),
		array(string())
	])).optional())
});
/**
* A reference to a resource or resource template definition.
*/
var ResourceTemplateReferenceSchema = object$1({
	type: literal("ref/resource"),
	/**
	* The URI or URI template of the resource.
	*/
	uri: string()
});
/**
* Identifies a prompt.
*/
var PromptReferenceSchema = object$1({
	type: literal("ref/prompt"),
	/**
	* The name of the prompt or prompt template
	*/
	name: string()
});
/**
* Parameters for a `completion/complete` request.
*/
var CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
	ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
	/**
	* The argument's information
	*/
	argument: object$1({
		/**
		* The name of the argument
		*/
		name: string(),
		/**
		* The value of the argument to use for completion matching.
		*/
		value: string()
	}),
	context: object$1({ 
	/**
	* Previously-resolved variables in a URI template or prompt.
	*/
arguments: record(string(), string()).optional() }).optional()
});
/**
* A request from the client to the server, to ask for completion options.
*/
var CompleteRequestSchema = RequestSchema.extend({
	method: literal("completion/complete"),
	params: CompleteRequestParamsSchema
});
function assertCompleteRequestPrompt(request) {
	if (request.params.ref.type !== "ref/prompt") throw new TypeError(`Expected CompleteRequestPrompt, but got ${request.params.ref.type}`);
}
function assertCompleteRequestResourceTemplate(request) {
	if (request.params.ref.type !== "ref/resource") throw new TypeError(`Expected CompleteRequestResourceTemplate, but got ${request.params.ref.type}`);
}
/**
* The server's response to a completion/complete request
*/
var CompleteResultSchema = ResultSchema.extend({ completion: looseObject({
	/**
	* An array of completion values. Must not exceed 100 items.
	*/
	values: array(string()).max(100),
	/**
	* The total number of completion options available. This can exceed the number of values actually sent in the response.
	*/
	total: optional(number().int()),
	/**
	* Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
	*/
	hasMore: optional(boolean())
}) });
/**
* Represents a root directory or file that the server can operate on.
*/
var RootSchema = object$1({
	/**
	* The URI identifying the root. This *must* start with file:// for now.
	*/
	uri: string().startsWith("file://"),
	/**
	* An optional name for the root.
	*/
	name: string().optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string(), unknown()).optional()
});
/**
* Sent from the server to request a list of root URIs from the client.
*/
var ListRootsRequestSchema = RequestSchema.extend({
	method: literal("roots/list"),
	params: BaseRequestParamsSchema.optional()
});
/**
* The client's response to a roots/list request from the server.
*/
var ListRootsResultSchema = ResultSchema.extend({ roots: array(RootSchema) });
/**
* A notification from the client to the server, informing it that the list of roots has changed.
*/
var RootsListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/roots/list_changed"),
	params: NotificationsParamsSchema.optional()
});
union([
	PingRequestSchema,
	InitializeRequestSchema,
	CompleteRequestSchema,
	SetLevelRequestSchema,
	GetPromptRequestSchema,
	ListPromptsRequestSchema,
	ListResourcesRequestSchema,
	ListResourceTemplatesRequestSchema,
	ReadResourceRequestSchema,
	SubscribeRequestSchema,
	UnsubscribeRequestSchema,
	CallToolRequestSchema,
	ListToolsRequestSchema,
	GetTaskRequestSchema,
	GetTaskPayloadRequestSchema,
	ListTasksRequestSchema,
	CancelTaskRequestSchema
]);
union([
	CancelledNotificationSchema,
	ProgressNotificationSchema,
	InitializedNotificationSchema,
	RootsListChangedNotificationSchema,
	TaskStatusNotificationSchema
]);
union([
	EmptyResultSchema,
	CreateMessageResultSchema,
	CreateMessageResultWithToolsSchema,
	ElicitResultSchema,
	ListRootsResultSchema,
	GetTaskResultSchema,
	ListTasksResultSchema,
	CreateTaskResultSchema
]);
union([
	PingRequestSchema,
	CreateMessageRequestSchema,
	ElicitRequestSchema,
	ListRootsRequestSchema,
	GetTaskRequestSchema,
	GetTaskPayloadRequestSchema,
	ListTasksRequestSchema,
	CancelTaskRequestSchema
]);
union([
	CancelledNotificationSchema,
	ProgressNotificationSchema,
	LoggingMessageNotificationSchema,
	ResourceUpdatedNotificationSchema,
	ResourceListChangedNotificationSchema,
	ToolListChangedNotificationSchema,
	PromptListChangedNotificationSchema,
	TaskStatusNotificationSchema,
	ElicitationCompleteNotificationSchema
]);
union([
	EmptyResultSchema,
	InitializeResultSchema,
	CompleteResultSchema,
	GetPromptResultSchema,
	ListPromptsResultSchema,
	ListResourcesResultSchema,
	ListResourceTemplatesResultSchema,
	ReadResourceResultSchema,
	CallToolResultSchema,
	ListToolsResultSchema,
	GetTaskResultSchema,
	ListTasksResultSchema,
	CreateTaskResultSchema
]);
var McpError = class McpError extends Error {
	constructor(code, message, data) {
		super(`MCP error ${code}: ${message}`);
		this.code = code;
		this.data = data;
		this.name = "McpError";
	}
	/**
	* Factory method to create the appropriate error type based on the error code and data
	*/
	static fromError(code, message, data) {
		if (code === ErrorCode.UrlElicitationRequired && data) {
			const errorData = data;
			if (errorData.elicitations) return new UrlElicitationRequiredError(errorData.elicitations, message);
		}
		return new McpError(code, message, data);
	}
};
/**
* Specialized error type when a tool requires a URL mode elicitation.
* This makes it nicer for the client to handle since there is specific data to work with instead of just a code to check against.
*/
var UrlElicitationRequiredError = class extends McpError {
	constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
		super(ErrorCode.UrlElicitationRequired, message, { elicitations });
	}
	get elicitations() {
		return this.data?.elicitations ?? [];
	}
};
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.js
/**
* Web Standards Streamable HTTP Server Transport
*
* This is the core transport implementation using Web Standard APIs (Request, Response, ReadableStream).
* It can run on any runtime that supports Web Standards: Node.js 18+, Cloudflare Workers, Deno, Bun, etc.
*
* For Node.js Express/HTTP compatibility, use `StreamableHTTPServerTransport` which wraps this transport.
*/
/**
* Server transport for Web Standards Streamable HTTP: this implements the MCP Streamable HTTP transport specification
* using Web Standard APIs (Request, Response, ReadableStream).
*
* This transport works on any runtime that supports Web Standards: Node.js 18+, Cloudflare Workers, Deno, Bun, etc.
*
* Usage example:
*
* ```typescript
* // Stateful mode - server sets the session ID
* const statefulTransport = new WebStandardStreamableHTTPServerTransport({
*   sessionIdGenerator: () => crypto.randomUUID(),
* });
*
* // Stateless mode - explicitly set session ID to undefined
* const statelessTransport = new WebStandardStreamableHTTPServerTransport({
*   sessionIdGenerator: undefined,
* });
*
* // Hono.js usage
* app.all('/mcp', async (c) => {
*   return transport.handleRequest(c.req.raw);
* });
*
* // Cloudflare Workers usage
* export default {
*   async fetch(request: Request): Promise<Response> {
*     return transport.handleRequest(request);
*   }
* };
* ```
*
* In stateful mode:
* - Session ID is generated and included in response headers
* - Session ID is always included in initialization responses
* - Requests with invalid session IDs are rejected with 404 Not Found
* - Non-initialization requests without a session ID are rejected with 400 Bad Request
* - State is maintained in-memory (connections, message history)
*
* In stateless mode:
* - No Session ID is included in any responses
* - No session validation is performed
*/
var WebStandardStreamableHTTPServerTransport = class {
	constructor(options = {}) {
		this._started = false;
		this._hasHandledRequest = false;
		this._streamMapping = /* @__PURE__ */ new Map();
		this._requestToStreamMapping = /* @__PURE__ */ new Map();
		/**
		* Request streams whose client holds a Last-Event-ID cursor (at least one
		* id-bearing event was delivered on them), so a stored response can be
		* replayed on resume.
		*/
		this._resumableStreams = /* @__PURE__ */ new Set();
		this._requestResponseMap = /* @__PURE__ */ new Map();
		this._initialized = false;
		this._enableJsonResponse = false;
		this._standaloneSseStreamId = "_GET_stream";
		this._closed = false;
		this.sessionIdGenerator = options.sessionIdGenerator;
		this._enableJsonResponse = options.enableJsonResponse ?? false;
		this._eventStore = options.eventStore;
		this._onsessioninitialized = options.onsessioninitialized;
		this._onsessionclosed = options.onsessionclosed;
		this._allowedHosts = options.allowedHosts;
		this._allowedOrigins = options.allowedOrigins;
		this._enableDnsRebindingProtection = options.enableDnsRebindingProtection ?? false;
		this._retryInterval = options.retryInterval;
		this._keepAliveMs = options.keepAliveMs ?? 15e3;
	}
	/**
	* Arms a keep-alive interval for an SSE stream that periodically writes an SSE
	* comment frame so intermediaries and idle timeouts don't kill the connection.
	* The returned timer is owned by the stream it was armed for: the stream's
	* cancel/cleanup callbacks must clear it. The interval clears itself if a
	* write fails (stream already closed/cancelled).
	*/
	startKeepAlive(controller, encoder) {
		if (this._closed) return void 0;
		const timer = armSseKeepAlive(this._keepAliveMs, () => {
			try {
				controller.enqueue(encoder.encode(": keepalive\n\n"));
			} catch {
				if (timer !== void 0) clearInterval(timer);
			}
		});
		return timer;
	}
	/**
	* Starts the transport. This is required by the Transport interface but is a no-op
	* for the Streamable HTTP transport as connections are managed per-request.
	*/
	async start() {
		if (this._started) throw new Error("Transport already started");
		this._started = true;
	}
	/**
	* Helper to create a JSON error response
	*/
	createJsonErrorResponse(status, code, message, options) {
		const error = {
			code,
			message
		};
		if (options?.data !== void 0) error.data = options.data;
		return new Response(JSON.stringify({
			jsonrpc: "2.0",
			error,
			id: null
		}), {
			status,
			headers: {
				"Content-Type": "application/json",
				...options?.headers
			}
		});
	}
	/**
	* Validates request headers for DNS rebinding protection.
	* @returns Error response if validation fails, undefined if validation passes.
	*/
	validateRequestHeaders(req) {
		if (!this._enableDnsRebindingProtection) return;
		if (this._allowedHosts && this._allowedHosts.length > 0) {
			const hostHeader = req.headers.get("host");
			if (!hostHeader || !this._allowedHosts.includes(hostHeader)) {
				const error = `Invalid Host header: ${hostHeader}`;
				this.onerror?.(new Error(error));
				return this.createJsonErrorResponse(403, -32e3, error);
			}
		}
		if (this._allowedOrigins && this._allowedOrigins.length > 0) {
			const originHeader = req.headers.get("origin");
			if (originHeader && !this._allowedOrigins.includes(originHeader)) {
				const error = `Invalid Origin header: ${originHeader}`;
				this.onerror?.(new Error(error));
				return this.createJsonErrorResponse(403, -32e3, error);
			}
		}
	}
	/**
	* Handles an incoming HTTP request, whether GET, POST, or DELETE
	* Returns a Response object (Web Standard)
	*/
	async handleRequest(req, options) {
		if (this._closed) return this.createJsonErrorResponse(404, -32001, "Session not found");
		if (!this.sessionIdGenerator && this._hasHandledRequest) throw new Error("Stateless transport cannot be reused across requests. Create a new transport per request.");
		this._hasHandledRequest = true;
		const validationError = this.validateRequestHeaders(req);
		if (validationError) return validationError;
		switch (req.method) {
			case "POST": return this.handlePostRequest(req, options);
			case "GET": return this.handleGetRequest(req);
			case "DELETE": return this.handleDeleteRequest(req);
			default: return this.handleUnsupportedRequest();
		}
	}
	/**
	* Writes a priming event to establish resumption capability.
	* Only sends if eventStore is configured (opt-in for resumability) and
	* the client's protocol version supports empty SSE data (>= 2025-11-25).
	*/
	async writePrimingEvent(controller, encoder, streamId, protocolVersion) {
		if (!this._eventStore) return;
		if (protocolVersion < "2025-11-25") return;
		const primingEventId = await this._eventStore.storeEvent(streamId, {});
		let primingEvent = `id: ${primingEventId}\ndata: \n\n`;
		if (this._retryInterval !== void 0) primingEvent = `id: ${primingEventId}\nretry: ${this._retryInterval}\ndata: \n\n`;
		controller.enqueue(encoder.encode(primingEvent));
		this._resumableStreams.add(streamId);
	}
	/**
	* Handles GET requests for SSE stream
	*/
	async handleGetRequest(req) {
		if (!req.headers.get("accept")?.includes("text/event-stream")) {
			this.onerror?.(/* @__PURE__ */ new Error("Not Acceptable: Client must accept text/event-stream"));
			return this.createJsonErrorResponse(406, -32e3, "Not Acceptable: Client must accept text/event-stream");
		}
		const sessionError = this.validateSession(req);
		if (sessionError) return sessionError;
		const protocolError = this.validateProtocolVersion(req);
		if (protocolError) return protocolError;
		if (this._eventStore) {
			const lastEventId = req.headers.get("last-event-id");
			if (lastEventId) return this.replayEvents(lastEventId);
		}
		if (this._streamMapping.get(this._standaloneSseStreamId) !== void 0) {
			this.onerror?.(/* @__PURE__ */ new Error("Conflict: Only one SSE stream is allowed per session"));
			return this.createJsonErrorResponse(409, -32e3, "Conflict: Only one SSE stream is allowed per session");
		}
		const encoder = new TextEncoder();
		let streamController;
		let keepAliveTimer = void 0;
		const readable = new ReadableStream({
			start: (controller) => {
				streamController = controller;
			},
			cancel: () => {
				if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
				if (this._streamMapping.get(this._standaloneSseStreamId)?.controller === streamController) this._streamMapping.delete(this._standaloneSseStreamId);
			}
		});
		const headers = {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no"
		};
		if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
		this._streamMapping.set(this._standaloneSseStreamId, {
			controller: streamController,
			encoder,
			cleanup: () => {
				if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
				this._streamMapping.delete(this._standaloneSseStreamId);
				try {
					streamController.close();
				} catch {}
			}
		});
		keepAliveTimer = this.startKeepAlive(streamController, encoder);
		return new Response(readable, { headers });
	}
	/**
	* Replays events that would have been sent after the specified event ID
	* Only used when resumability is enabled
	*/
	async replayEvents(lastEventId) {
		if (!this._eventStore) {
			this.onerror?.(/* @__PURE__ */ new Error("Event store not configured"));
			return this.createJsonErrorResponse(400, -32e3, "Event store not configured");
		}
		try {
			let streamId;
			if (this._eventStore.getStreamIdForEventId) {
				streamId = await this._eventStore.getStreamIdForEventId(lastEventId);
				if (!streamId) {
					this.onerror?.(/* @__PURE__ */ new Error("Invalid event ID format"));
					return this.createJsonErrorResponse(400, -32e3, "Invalid event ID format");
				}
				if (this._streamMapping.get(streamId) !== void 0) {
					this.onerror?.(/* @__PURE__ */ new Error("Conflict: Stream already has an active connection"));
					return this.createJsonErrorResponse(409, -32e3, "Conflict: Stream already has an active connection");
				}
			}
			const headers = {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
				"X-Accel-Buffering": "no"
			};
			if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
			const encoder = new TextEncoder();
			let streamController;
			let keepAliveTimer = void 0;
			let replayedStreamId = void 0;
			let cancelled = false;
			const readable = new ReadableStream({
				start: (controller) => {
					streamController = controller;
				},
				cancel: () => {
					cancelled = true;
					if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
					if (replayedStreamId !== void 0 && this._streamMapping.get(replayedStreamId)?.controller === streamController) this._streamMapping.delete(replayedStreamId);
				}
			});
			const replayedEventIds = /* @__PURE__ */ new Set();
			replayedStreamId = await this._eventStore.replayEventsAfter(lastEventId, { send: async (eventId, message) => {
				if (!this.writeSSEEvent(streamController, encoder, message, eventId)) {
					this.onerror?.(/* @__PURE__ */ new Error("Failed replay events"));
					try {
						streamController.close();
					} catch {}
				} else replayedEventIds.add(eventId);
			} });
			if (this._closed || cancelled) {
				try {
					streamController.close();
				} catch {}
				return this.createJsonErrorResponse(404, -32001, "Session not found");
			}
			this._streamMapping.get(replayedStreamId)?.cleanup();
			this._streamMapping.set(replayedStreamId, {
				controller: streamController,
				encoder,
				replayedEventIds,
				cleanup: () => {
					if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
					this._streamMapping.delete(replayedStreamId);
					try {
						streamController.close();
					} catch {}
				}
			});
			this._resumableStreams.add(replayedStreamId);
			keepAliveTimer = this.startKeepAlive(streamController, encoder);
			return new Response(readable, { headers });
		} catch (error) {
			this.onerror?.(error);
			return this.createJsonErrorResponse(500, -32e3, "Error replaying events");
		}
	}
	/**
	* Writes an event to an SSE stream via controller with proper formatting
	*/
	writeSSEEvent(controller, encoder, message, eventId) {
		try {
			let eventData = `event: message\n`;
			if (eventId) eventData += `id: ${eventId}\n`;
			eventData += `data: ${JSON.stringify(message)}\n\n`;
			controller.enqueue(encoder.encode(eventData));
			return true;
		} catch (error) {
			this.onerror?.(error);
			return false;
		}
	}
	/**
	* Handles unsupported requests (PUT, PATCH, etc.)
	*/
	handleUnsupportedRequest() {
		this.onerror?.(/* @__PURE__ */ new Error("Method not allowed."));
		return new Response(JSON.stringify({
			jsonrpc: "2.0",
			error: {
				code: -32e3,
				message: "Method not allowed."
			},
			id: null
		}), {
			status: 405,
			headers: {
				Allow: "GET, POST, DELETE",
				"Content-Type": "application/json"
			}
		});
	}
	/**
	* Handles POST requests containing JSON-RPC messages
	*/
	async handlePostRequest(req, options) {
		try {
			const acceptHeader = req.headers.get("accept");
			if (!acceptHeader?.includes("application/json") || !acceptHeader.includes("text/event-stream")) {
				this.onerror?.(/* @__PURE__ */ new Error("Not Acceptable: Client must accept both application/json and text/event-stream"));
				return this.createJsonErrorResponse(406, -32e3, "Not Acceptable: Client must accept both application/json and text/event-stream");
			}
			if (!isJsonContentType(req.headers.get("content-type"))) {
				this.onerror?.(/* @__PURE__ */ new Error("Unsupported Media Type: Content-Type must be application/json"));
				return this.createJsonErrorResponse(415, -32e3, "Unsupported Media Type: Content-Type must be application/json");
			}
			const requestInfo = {
				headers: Object.fromEntries(req.headers.entries()),
				url: new URL(req.url)
			};
			let rawMessage;
			if (options?.parsedBody !== void 0) rawMessage = options.parsedBody;
			else try {
				rawMessage = await req.json();
			} catch {
				this.onerror?.(/* @__PURE__ */ new Error("Parse error: Invalid JSON"));
				return this.createJsonErrorResponse(400, -32700, "Parse error: Invalid JSON");
			}
			let messages;
			try {
				if (Array.isArray(rawMessage)) messages = rawMessage.map((msg) => JSONRPCMessageSchema.parse(msg));
				else messages = [JSONRPCMessageSchema.parse(rawMessage)];
			} catch {
				this.onerror?.(/* @__PURE__ */ new Error("Parse error: Invalid JSON-RPC message"));
				return this.createJsonErrorResponse(400, -32700, "Parse error: Invalid JSON-RPC message");
			}
			if (this._closed) return this.createJsonErrorResponse(404, -32001, "Session not found");
			const isInitializationRequest = messages.some(isInitializeRequest);
			if (isInitializationRequest) {
				if (this._initialized && this.sessionId !== void 0) {
					this.onerror?.(/* @__PURE__ */ new Error("Invalid Request: Server already initialized"));
					return this.createJsonErrorResponse(400, -32600, "Invalid Request: Server already initialized");
				}
				if (messages.length > 1) {
					this.onerror?.(/* @__PURE__ */ new Error("Invalid Request: Only one initialization request is allowed"));
					return this.createJsonErrorResponse(400, -32600, "Invalid Request: Only one initialization request is allowed");
				}
				this.sessionId = this.sessionIdGenerator?.();
				this._initialized = true;
				if (this.sessionId && this._onsessioninitialized) await Promise.resolve(this._onsessioninitialized(this.sessionId));
			}
			if (!isInitializationRequest) {
				const sessionError = this.validateSession(req);
				if (sessionError) return sessionError;
				const protocolError = this.validateProtocolVersion(req);
				if (protocolError) return protocolError;
			}
			if (this._closed) return this.createJsonErrorResponse(404, -32001, "Session not found");
			if (!messages.some(isJSONRPCRequest)) {
				for (const message of messages) this.onmessage?.(message, {
					authInfo: options?.authInfo,
					requestInfo
				});
				return new Response(null, { status: 202 });
			}
			const streamId = crypto.randomUUID();
			const initRequest = messages.find((m) => isInitializeRequest(m));
			const clientProtocolVersion = initRequest ? initRequest.params.protocolVersion : req.headers.get("mcp-protocol-version") ?? "2025-03-26";
			if (this._enableJsonResponse) return new Promise((resolve) => {
				this._streamMapping.set(streamId, {
					resolveJson: resolve,
					cleanup: () => {
						this._streamMapping.delete(streamId);
					}
				});
				for (const message of messages) if (isJSONRPCRequest(message)) this._requestToStreamMapping.set(message.id, streamId);
				for (const message of messages) this.onmessage?.(message, {
					authInfo: options?.authInfo,
					requestInfo
				});
			});
			const encoder = new TextEncoder();
			let streamController;
			let keepAliveTimer = void 0;
			const readable = new ReadableStream({
				start: (controller) => {
					streamController = controller;
				},
				cancel: () => {
					if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
					if (this._streamMapping.get(streamId)?.controller === streamController) this._streamMapping.delete(streamId);
				}
			});
			const headers = {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
				"X-Accel-Buffering": "no"
			};
			if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
			for (const message of messages) if (isJSONRPCRequest(message)) {
				this._streamMapping.set(streamId, {
					controller: streamController,
					encoder,
					cleanup: () => {
						if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
						this._streamMapping.delete(streamId);
						try {
							streamController.close();
						} catch {}
					}
				});
				this._requestToStreamMapping.set(message.id, streamId);
			}
			try {
				await this.writePrimingEvent(streamController, encoder, streamId, clientProtocolVersion);
				for (const message of messages) {
					let closeSSEStream;
					let closeStandaloneSSEStream;
					if (isJSONRPCRequest(message) && this._eventStore && clientProtocolVersion >= "2025-11-25") {
						closeSSEStream = () => {
							this.closeSSEStream(message.id);
						};
						closeStandaloneSSEStream = () => {
							this.closeStandaloneSSEStream();
						};
					}
					this.onmessage?.(message, {
						authInfo: options?.authInfo,
						requestInfo,
						closeSSEStream,
						closeStandaloneSSEStream
					});
				}
			} catch (error) {
				this._streamMapping.get(streamId)?.cleanup();
				this._resumableStreams.delete(streamId);
				for (const message of messages) if (isJSONRPCRequest(message)) this._requestToStreamMapping.delete(message.id);
				throw error;
			}
			if (this._streamMapping.get(streamId)?.controller === streamController) keepAliveTimer = this.startKeepAlive(streamController, encoder);
			return new Response(readable, {
				status: 200,
				headers
			});
		} catch (error) {
			this.onerror?.(error);
			return this.createJsonErrorResponse(400, -32700, "Parse error", { data: String(error) });
		}
	}
	/**
	* Handles DELETE requests to terminate sessions
	*/
	async handleDeleteRequest(req) {
		const sessionError = this.validateSession(req);
		if (sessionError) return sessionError;
		const protocolError = this.validateProtocolVersion(req);
		if (protocolError) return protocolError;
		try {
			await Promise.resolve(this._onsessionclosed?.(this.sessionId));
			return new Response(null, { status: 200 });
		} finally {
			await this.close();
		}
	}
	/**
	* Validates session ID for non-initialization requests.
	* Returns Response error if invalid, undefined otherwise
	*/
	validateSession(req) {
		if (this.sessionIdGenerator === void 0) return;
		if (!this._initialized) {
			this.onerror?.(/* @__PURE__ */ new Error("Bad Request: Server not initialized"));
			return this.createJsonErrorResponse(400, -32e3, "Bad Request: Server not initialized");
		}
		const sessionId = req.headers.get("mcp-session-id");
		if (!sessionId) {
			this.onerror?.(/* @__PURE__ */ new Error("Bad Request: Mcp-Session-Id header is required"));
			return this.createJsonErrorResponse(400, -32e3, "Bad Request: Mcp-Session-Id header is required");
		}
		if (sessionId !== this.sessionId) {
			this.onerror?.(/* @__PURE__ */ new Error("Session not found"));
			return this.createJsonErrorResponse(404, -32001, "Session not found");
		}
	}
	/**
	* Validates the MCP-Protocol-Version header on incoming requests.
	*
	* For initialization: Version negotiation handles unknown versions gracefully
	* (server responds with its supported version).
	*
	* For subsequent requests with MCP-Protocol-Version header:
	* - Accept if in supported list
	* - 400 if unsupported
	*
	* For HTTP requests without the MCP-Protocol-Version header:
	* - Accept and default to the version negotiated at initialization
	*/
	validateProtocolVersion(req) {
		const protocolVersion = req.headers.get("mcp-protocol-version");
		if (protocolVersion !== null && !SUPPORTED_PROTOCOL_VERSIONS.includes(protocolVersion)) {
			this.onerror?.(/* @__PURE__ */ new Error(`Bad Request: Unsupported protocol version: ${protocolVersion} (supported versions: ${SUPPORTED_PROTOCOL_VERSIONS.join(", ")})`));
			return this.createJsonErrorResponse(400, -32e3, `Bad Request: Unsupported protocol version: ${protocolVersion} (supported versions: ${SUPPORTED_PROTOCOL_VERSIONS.join(", ")})`);
		}
	}
	async close() {
		if (this._closed) return;
		this._closed = true;
		this._streamMapping.forEach(({ cleanup }) => {
			cleanup();
		});
		this._streamMapping.clear();
		this._requestResponseMap.clear();
		this._resumableStreams.clear();
		this.onclose?.();
	}
	/**
	* Close an SSE stream for a specific request, triggering client reconnection.
	* Use this to implement polling behavior during long-running operations -
	* client will reconnect after the retry interval specified in the priming event.
	*/
	closeSSEStream(requestId) {
		const streamId = this._requestToStreamMapping.get(requestId);
		if (!streamId) return;
		const stream = this._streamMapping.get(streamId);
		if (stream) stream.cleanup();
	}
	/**
	* Close the standalone GET SSE stream, triggering client reconnection.
	* Use this to implement polling behavior for server-initiated notifications.
	*/
	closeStandaloneSSEStream() {
		const stream = this._streamMapping.get(this._standaloneSseStreamId);
		if (stream) stream.cleanup();
	}
	async send(message, options) {
		let requestId = options?.relatedRequestId;
		if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) requestId = message.id;
		if (requestId === void 0) {
			if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) throw new Error("Cannot send a response on a standalone SSE stream unless resuming a previous client request");
			let eventId;
			if (this._eventStore) eventId = await this._eventStore.storeEvent(this._standaloneSseStreamId, message);
			const standaloneSse = this._streamMapping.get(this._standaloneSseStreamId);
			if (standaloneSse === void 0) return;
			if (standaloneSse.controller && standaloneSse.encoder && (eventId === void 0 || !standaloneSse.replayedEventIds?.has(eventId))) this.writeSSEEvent(standaloneSse.controller, standaloneSse.encoder, message, eventId);
			return;
		}
		const streamId = this._requestToStreamMapping.get(requestId);
		if (!streamId) throw new Error(`No connection established for request ID: ${String(requestId)}`);
		let stream = this._streamMapping.get(streamId);
		if (!this._enableJsonResponse) {
			let eventId;
			if (this._eventStore) {
				eventId = await this._eventStore.storeEvent(streamId, message);
				stream = this._streamMapping.get(streamId);
			}
			if (stream?.controller && stream?.encoder && (eventId === void 0 || !stream.replayedEventIds?.has(eventId))) {
				if (this.writeSSEEvent(stream.controller, stream.encoder, message, eventId) && eventId !== void 0) this._resumableStreams.add(streamId);
			}
		}
		if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
			this._requestResponseMap.set(requestId, message);
			const relatedIds = Array.from(this._requestToStreamMapping.entries()).filter(([_, sid]) => sid === streamId).map(([id]) => id);
			if (relatedIds.every((id) => this._requestResponseMap.has(id))) {
				if (!stream) {
					if (this._closed) {
						for (const id of relatedIds) {
							this._requestResponseMap.delete(id);
							this._requestToStreamMapping.delete(id);
						}
						return;
					}
					if (!this._enableJsonResponse && this._eventStore && this._resumableStreams.has(streamId)) {
						for (const id of relatedIds) {
							this._requestResponseMap.delete(id);
							this._requestToStreamMapping.delete(id);
						}
						this._resumableStreams.delete(streamId);
						return;
					}
					for (const id of relatedIds) {
						this._requestResponseMap.delete(id);
						this._requestToStreamMapping.delete(id);
					}
					throw new Error(`No connection established for request ID: ${String(requestId)}`);
				}
				if (this._enableJsonResponse && stream.resolveJson) {
					const headers = { "Content-Type": "application/json" };
					if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
					const responses = relatedIds.map((id) => this._requestResponseMap.get(id));
					if (responses.length === 1) stream.resolveJson(new Response(JSON.stringify(responses[0]), {
						status: 200,
						headers
					}));
					else stream.resolveJson(new Response(JSON.stringify(responses), {
						status: 200,
						headers
					}));
				} else stream.cleanup();
				for (const id of relatedIds) {
					this._requestResponseMap.delete(id);
					this._requestToStreamMapping.delete(id);
				}
				this._resumableStreams.delete(streamId);
			}
		}
	}
};
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/helpers/util.js
var util;
(function(util) {
	util.assertEqual = (_) => {};
	function assertIs(_arg) {}
	util.assertIs = assertIs;
	function assertNever(_x) {
		throw new Error();
	}
	util.assertNever = assertNever;
	util.arrayToEnum = (items) => {
		const obj = {};
		for (const item of items) obj[item] = item;
		return obj;
	};
	util.getValidEnumValues = (obj) => {
		const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
		const filtered = {};
		for (const k of validKeys) filtered[k] = obj[k];
		return util.objectValues(filtered);
	};
	util.objectValues = (obj) => {
		return util.objectKeys(obj).map(function(e) {
			return obj[e];
		});
	};
	util.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
		const keys = [];
		for (const key in object) if (Object.prototype.hasOwnProperty.call(object, key)) keys.push(key);
		return keys;
	};
	util.find = (arr, checker) => {
		for (const item of arr) if (checker(item)) return item;
	};
	util.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
	function joinValues(array, separator = " | ") {
		return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
	}
	util.joinValues = joinValues;
	util.jsonStringifyReplacer = (_, value) => {
		if (typeof value === "bigint") return value.toString();
		return value;
	};
})(util || (util = {}));
var objectUtil;
(function(objectUtil) {
	objectUtil.mergeShapes = (first, second) => {
		return {
			...first,
			...second
		};
	};
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]);
var getParsedType = (data) => {
	switch (typeof data) {
		case "undefined": return ZodParsedType.undefined;
		case "string": return ZodParsedType.string;
		case "number": return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
		case "boolean": return ZodParsedType.boolean;
		case "function": return ZodParsedType.function;
		case "bigint": return ZodParsedType.bigint;
		case "symbol": return ZodParsedType.symbol;
		case "object":
			if (Array.isArray(data)) return ZodParsedType.array;
			if (data === null) return ZodParsedType.null;
			if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") return ZodParsedType.promise;
			if (typeof Map !== "undefined" && data instanceof Map) return ZodParsedType.map;
			if (typeof Set !== "undefined" && data instanceof Set) return ZodParsedType.set;
			if (typeof Date !== "undefined" && data instanceof Date) return ZodParsedType.date;
			return ZodParsedType.object;
		default: return ZodParsedType.unknown;
	}
};
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]);
var ZodError = class ZodError extends Error {
	get errors() {
		return this.issues;
	}
	constructor(issues) {
		super();
		this.issues = [];
		this.addIssue = (sub) => {
			this.issues = [...this.issues, sub];
		};
		this.addIssues = (subs = []) => {
			this.issues = [...this.issues, ...subs];
		};
		const actualProto = new.target.prototype;
		if (Object.setPrototypeOf) Object.setPrototypeOf(this, actualProto);
		else this.__proto__ = actualProto;
		this.name = "ZodError";
		this.issues = issues;
	}
	format(_mapper) {
		const mapper = _mapper || function(issue) {
			return issue.message;
		};
		const fieldErrors = { _errors: [] };
		const processError = (error) => {
			for (const issue of error.issues) if (issue.code === "invalid_union") issue.unionErrors.map(processError);
			else if (issue.code === "invalid_return_type") processError(issue.returnTypeError);
			else if (issue.code === "invalid_arguments") processError(issue.argumentsError);
			else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < issue.path.length) {
					const el = issue.path[i];
					if (!(i === issue.path.length - 1)) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue));
					}
					curr = curr[el];
					i++;
				}
			}
		};
		processError(this);
		return fieldErrors;
	}
	static assert(value) {
		if (!(value instanceof ZodError)) throw new Error(`Not a ZodError: ${value}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(mapper = (issue) => issue.message) {
		const fieldErrors = Object.create(null);
		const formErrors = [];
		for (const sub of this.issues) if (sub.path.length > 0) {
			const firstEl = sub.path[0];
			fieldErrors[firstEl] = fieldErrors[firstEl] || [];
			fieldErrors[firstEl].push(mapper(sub));
		} else formErrors.push(mapper(sub));
		return {
			formErrors,
			fieldErrors
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
ZodError.create = (issues) => {
	return new ZodError(issues);
};
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
	let message;
	switch (issue.code) {
		case ZodIssueCode.invalid_type:
			if (issue.received === ZodParsedType.undefined) message = "Required";
			else message = `Expected ${issue.expected}, received ${issue.received}`;
			break;
		case ZodIssueCode.invalid_literal:
			message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
			break;
		case ZodIssueCode.unrecognized_keys:
			message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
			break;
		case ZodIssueCode.invalid_union:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_union_discriminator:
			message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
			break;
		case ZodIssueCode.invalid_enum_value:
			message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
			break;
		case ZodIssueCode.invalid_arguments:
			message = `Invalid function arguments`;
			break;
		case ZodIssueCode.invalid_return_type:
			message = `Invalid function return type`;
			break;
		case ZodIssueCode.invalid_date:
			message = `Invalid date`;
			break;
		case ZodIssueCode.invalid_string:
			if (typeof issue.validation === "object") {
				if ("includes" in issue.validation) {
					message = `Invalid input: must include "${issue.validation.includes}"`;
					if (typeof issue.validation.position === "number") message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
				} else if ("startsWith" in issue.validation) message = `Invalid input: must start with "${issue.validation.startsWith}"`;
				else if ("endsWith" in issue.validation) message = `Invalid input: must end with "${issue.validation.endsWith}"`;
				else util.assertNever(issue.validation);
			} else if (issue.validation !== "regex") message = `Invalid ${issue.validation}`;
			else message = "Invalid";
			break;
		case ZodIssueCode.too_small:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "bigint") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.too_big:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "bigint") message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.custom:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_intersection_types:
			message = `Intersection results could not be merged`;
			break;
		case ZodIssueCode.not_multiple_of:
			message = `Number must be a multiple of ${issue.multipleOf}`;
			break;
		case ZodIssueCode.not_finite:
			message = "Number must be finite";
			break;
		default:
			message = _ctx.defaultError;
			util.assertNever(issue);
	}
	return { message };
};
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/errors.js
var overrideErrorMap = errorMap;
function getErrorMap() {
	return overrideErrorMap;
}
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
	const { data, path, errorMaps, issueData } = params;
	const fullPath = [...path, ...issueData.path || []];
	const fullIssue = {
		...issueData,
		path: fullPath
	};
	if (issueData.message !== void 0) return {
		...issueData,
		path: fullPath,
		message: issueData.message
	};
	let errorMessage = "";
	const maps = errorMaps.filter((m) => !!m).slice().reverse();
	for (const map of maps) errorMessage = map(fullIssue, {
		data,
		defaultError: errorMessage
	}).message;
	return {
		...issueData,
		path: fullPath,
		message: errorMessage
	};
};
function addIssueToContext(ctx, issueData) {
	const overrideMap = getErrorMap();
	const issue = makeIssue({
		issueData,
		data: ctx.data,
		path: ctx.path,
		errorMaps: [
			ctx.common.contextualErrorMap,
			ctx.schemaErrorMap,
			overrideMap,
			overrideMap === errorMap ? void 0 : errorMap
		].filter((x) => !!x)
	});
	ctx.common.issues.push(issue);
}
var ParseStatus = class ParseStatus {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		if (this.value === "valid") this.value = "dirty";
	}
	abort() {
		if (this.value !== "aborted") this.value = "aborted";
	}
	static mergeArray(status, results) {
		const arrayValue = [];
		for (const s of results) {
			if (s.status === "aborted") return INVALID;
			if (s.status === "dirty") status.dirty();
			arrayValue.push(s.value);
		}
		return {
			status: status.value,
			value: arrayValue
		};
	}
	static async mergeObjectAsync(status, pairs) {
		const syncPairs = [];
		for (const pair of pairs) {
			const key = await pair.key;
			const value = await pair.value;
			syncPairs.push({
				key,
				value
			});
		}
		return ParseStatus.mergeObjectSync(status, syncPairs);
	}
	static mergeObjectSync(status, pairs) {
		const finalObject = {};
		for (const pair of pairs) {
			const { key, value } = pair;
			if (key.status === "aborted") return INVALID;
			if (value.status === "aborted") return INVALID;
			if (key.status === "dirty") status.dirty();
			if (value.status === "dirty") status.dirty();
			if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) finalObject[key.value] = value.value;
		}
		return {
			status: status.value,
			value: finalObject
		};
	}
};
var INVALID = Object.freeze({ status: "aborted" });
var DIRTY = (value) => ({
	status: "dirty",
	value
});
var OK = (value) => ({
	status: "valid",
	value
});
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil) {
	errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
	errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
	constructor(parent, value, path, key) {
		this._cachedPath = [];
		this.parent = parent;
		this.data = value;
		this._path = path;
		this._key = key;
	}
	get path() {
		if (!this._cachedPath.length) {
			if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
			else this._cachedPath.push(...this._path, this._key);
		}
		return this._cachedPath;
	}
};
var handleResult = (ctx, result) => {
	if (isValid(result)) return {
		success: true,
		data: result.value
	};
	else {
		if (!ctx.common.issues.length) throw new Error("Validation failed but no issues detected.");
		return {
			success: false,
			get error() {
				if (this._error) return this._error;
				const error = new ZodError(ctx.common.issues);
				this._error = error;
				return this._error;
			}
		};
	}
};
function processCreateParams(params) {
	if (!params) return {};
	const { errorMap, invalid_type_error, required_error, description } = params;
	if (errorMap && (invalid_type_error || required_error)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
	if (errorMap) return {
		errorMap,
		description
	};
	const customMap = (iss, ctx) => {
		const { message } = params;
		if (iss.code === "invalid_enum_value") return { message: message ?? ctx.defaultError };
		if (typeof ctx.data === "undefined") return { message: message ?? required_error ?? ctx.defaultError };
		if (iss.code !== "invalid_type") return { message: ctx.defaultError };
		return { message: message ?? invalid_type_error ?? ctx.defaultError };
	};
	return {
		errorMap: customMap,
		description
	};
}
var ZodType = class {
	get description() {
		return this._def.description;
	}
	_getType(input) {
		return getParsedType(input.data);
	}
	_getOrReturnCtx(input, ctx) {
		return ctx || {
			common: input.parent.common,
			data: input.data,
			parsedType: getParsedType(input.data),
			schemaErrorMap: this._def.errorMap,
			path: input.path,
			parent: input.parent
		};
	}
	_processInputParams(input) {
		return {
			status: new ParseStatus(),
			ctx: {
				common: input.parent.common,
				data: input.data,
				parsedType: getParsedType(input.data),
				schemaErrorMap: this._def.errorMap,
				path: input.path,
				parent: input.parent
			}
		};
	}
	_parseSync(input) {
		const result = this._parse(input);
		if (isAsync(result)) throw new Error("Synchronous parse encountered promise.");
		return result;
	}
	_parseAsync(input) {
		const result = this._parse(input);
		return Promise.resolve(result);
	}
	parse(data, params) {
		const result = this.safeParse(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	safeParse(data, params) {
		const ctx = {
			common: {
				issues: [],
				async: params?.async ?? false,
				contextualErrorMap: params?.errorMap
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		return handleResult(ctx, this._parseSync({
			data,
			path: ctx.path,
			parent: ctx
		}));
	}
	"~validate"(data) {
		const ctx = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		if (!this["~standard"].async) try {
			const result = this._parseSync({
				data,
				path: [],
				parent: ctx
			});
			return isValid(result) ? { value: result.value } : { issues: ctx.common.issues };
		} catch (err) {
			if (err?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = true;
			ctx.common = {
				issues: [],
				async: true
			};
		}
		return this._parseAsync({
			data,
			path: [],
			parent: ctx
		}).then((result) => isValid(result) ? { value: result.value } : { issues: ctx.common.issues });
	}
	async parseAsync(data, params) {
		const result = await this.safeParseAsync(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	async safeParseAsync(data, params) {
		const ctx = {
			common: {
				issues: [],
				contextualErrorMap: params?.errorMap,
				async: true
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		const maybeAsyncResult = this._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
		return handleResult(ctx, await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult)));
	}
	refine(check, message) {
		const getIssueProperties = (val) => {
			if (typeof message === "string" || typeof message === "undefined") return { message };
			else if (typeof message === "function") return message(val);
			else return message;
		};
		return this._refinement((val, ctx) => {
			const result = check(val);
			const setError = () => ctx.addIssue({
				code: ZodIssueCode.custom,
				...getIssueProperties(val)
			});
			if (typeof Promise !== "undefined" && result instanceof Promise) return result.then((data) => {
				if (!data) {
					setError();
					return false;
				} else return true;
			});
			if (!result) {
				setError();
				return false;
			} else return true;
		});
	}
	refinement(check, refinementData) {
		return this._refinement((val, ctx) => {
			if (!check(val)) {
				ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
				return false;
			} else return true;
		});
	}
	_refinement(refinement) {
		return new ZodEffects({
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "refinement",
				refinement
			}
		});
	}
	superRefine(refinement) {
		return this._refinement(refinement);
	}
	constructor(def) {
		/** Alias of safeParseAsync */
		this.spa = this.safeParseAsync;
		this._def = def;
		this.parse = this.parse.bind(this);
		this.safeParse = this.safeParse.bind(this);
		this.parseAsync = this.parseAsync.bind(this);
		this.safeParseAsync = this.safeParseAsync.bind(this);
		this.spa = this.spa.bind(this);
		this.refine = this.refine.bind(this);
		this.refinement = this.refinement.bind(this);
		this.superRefine = this.superRefine.bind(this);
		this.optional = this.optional.bind(this);
		this.nullable = this.nullable.bind(this);
		this.nullish = this.nullish.bind(this);
		this.array = this.array.bind(this);
		this.promise = this.promise.bind(this);
		this.or = this.or.bind(this);
		this.and = this.and.bind(this);
		this.transform = this.transform.bind(this);
		this.brand = this.brand.bind(this);
		this.default = this.default.bind(this);
		this.catch = this.catch.bind(this);
		this.describe = this.describe.bind(this);
		this.pipe = this.pipe.bind(this);
		this.readonly = this.readonly.bind(this);
		this.isNullable = this.isNullable.bind(this);
		this.isOptional = this.isOptional.bind(this);
		this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (data) => this["~validate"](data)
		};
	}
	optional() {
		return ZodOptional.create(this, this._def);
	}
	nullable() {
		return ZodNullable.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return ZodArray.create(this);
	}
	promise() {
		return ZodPromise.create(this, this._def);
	}
	or(option) {
		return ZodUnion.create([this, option], this._def);
	}
	and(incoming) {
		return ZodIntersection.create(this, incoming, this._def);
	}
	transform(transform) {
		return new ZodEffects({
			...processCreateParams(this._def),
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "transform",
				transform
			}
		});
	}
	default(def) {
		const defaultValueFunc = typeof def === "function" ? def : () => def;
		return new ZodDefault({
			...processCreateParams(this._def),
			innerType: this,
			defaultValue: defaultValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodDefault
		});
	}
	brand() {
		return new ZodBranded({
			typeName: ZodFirstPartyTypeKind.ZodBranded,
			type: this,
			...processCreateParams(this._def)
		});
	}
	catch(def) {
		const catchValueFunc = typeof def === "function" ? def : () => def;
		return new ZodCatch({
			...processCreateParams(this._def),
			innerType: this,
			catchValue: catchValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodCatch
		});
	}
	describe(description) {
		const This = this.constructor;
		return new This({
			...this._def,
			description
		});
	}
	pipe(target) {
		return ZodPipeline.create(this, target);
	}
	readonly() {
		return ZodReadonly.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex$1;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
	let secondsRegexSource = `[0-5]\\d`;
	if (args.precision) secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
	else if (args.precision == null) secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
	const secondsQuantifier = args.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
	return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
	let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
	const opts = [];
	opts.push(args.local ? `Z?` : `Z`);
	if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
	regex = `${regex}(${opts.join("|")})`;
	return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
	if ((version === "v4" || !version) && ipv4Regex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6Regex.test(ip)) return true;
	return false;
}
function isValidJWT(jwt, alg) {
	if (!jwtRegex.test(jwt)) return false;
	try {
		const [header] = jwt.split(".");
		if (!header) return false;
		const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
		const decoded = JSON.parse(atob(base64));
		if (typeof decoded !== "object" || decoded === null) return false;
		if ("typ" in decoded && decoded?.typ !== "JWT") return false;
		if (!decoded.alg) return false;
		if (alg && decoded.alg !== alg) return false;
		return true;
	} catch {
		return false;
	}
}
function isValidCidr(ip, version) {
	if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) return true;
	return false;
}
var ZodString = class ZodString extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = String(input.data);
		if (this._getType(input) !== ZodParsedType.string) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.string,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.length < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.length > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "length") {
			const tooBig = input.data.length > check.value;
			const tooSmall = input.data.length < check.value;
			if (tooBig || tooSmall) {
				ctx = this._getOrReturnCtx(input, ctx);
				if (tooBig) addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				else if (tooSmall) addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "email") {
			if (!emailRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "email",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "emoji") {
			if (!emojiRegex$1) emojiRegex$1 = new RegExp(_emojiRegex, "u");
			if (!emojiRegex$1.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "emoji",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "uuid") {
			if (!uuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "uuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "nanoid") {
			if (!nanoidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "nanoid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid") {
			if (!cuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid2") {
			if (!cuid2Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid2",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ulid") {
			if (!ulidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ulid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "url") try {
			new URL(input.data);
		} catch {
			ctx = this._getOrReturnCtx(input, ctx);
			addIssueToContext(ctx, {
				validation: "url",
				code: ZodIssueCode.invalid_string,
				message: check.message
			});
			status.dirty();
		}
		else if (check.kind === "regex") {
			check.regex.lastIndex = 0;
			if (!check.regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "regex",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "trim") input.data = input.data.trim();
		else if (check.kind === "includes") {
			if (!input.data.includes(check.value, check.position)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: {
						includes: check.value,
						position: check.position
					},
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "toLowerCase") input.data = input.data.toLowerCase();
		else if (check.kind === "toUpperCase") input.data = input.data.toUpperCase();
		else if (check.kind === "startsWith") {
			if (!input.data.startsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { startsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "endsWith") {
			if (!input.data.endsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { endsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "datetime") {
			if (!datetimeRegex(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "datetime",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "date") {
			if (!dateRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "date",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "time") {
			if (!timeRegex(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "time",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "duration") {
			if (!durationRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "duration",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ip") {
			if (!isValidIP(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ip",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "jwt") {
			if (!isValidJWT(input.data, check.alg)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "jwt",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cidr") {
			if (!isValidCidr(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cidr",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64") {
			if (!base64Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64url") {
			if (!base64urlRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64url",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_regex(regex, validation, message) {
		return this.refinement((data) => regex.test(data), {
			validation,
			code: ZodIssueCode.invalid_string,
			...errorUtil.errToObj(message)
		});
	}
	_addCheck(check) {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	email(message) {
		return this._addCheck({
			kind: "email",
			...errorUtil.errToObj(message)
		});
	}
	url(message) {
		return this._addCheck({
			kind: "url",
			...errorUtil.errToObj(message)
		});
	}
	emoji(message) {
		return this._addCheck({
			kind: "emoji",
			...errorUtil.errToObj(message)
		});
	}
	uuid(message) {
		return this._addCheck({
			kind: "uuid",
			...errorUtil.errToObj(message)
		});
	}
	nanoid(message) {
		return this._addCheck({
			kind: "nanoid",
			...errorUtil.errToObj(message)
		});
	}
	cuid(message) {
		return this._addCheck({
			kind: "cuid",
			...errorUtil.errToObj(message)
		});
	}
	cuid2(message) {
		return this._addCheck({
			kind: "cuid2",
			...errorUtil.errToObj(message)
		});
	}
	ulid(message) {
		return this._addCheck({
			kind: "ulid",
			...errorUtil.errToObj(message)
		});
	}
	base64(message) {
		return this._addCheck({
			kind: "base64",
			...errorUtil.errToObj(message)
		});
	}
	base64url(message) {
		return this._addCheck({
			kind: "base64url",
			...errorUtil.errToObj(message)
		});
	}
	jwt(options) {
		return this._addCheck({
			kind: "jwt",
			...errorUtil.errToObj(options)
		});
	}
	ip(options) {
		return this._addCheck({
			kind: "ip",
			...errorUtil.errToObj(options)
		});
	}
	cidr(options) {
		return this._addCheck({
			kind: "cidr",
			...errorUtil.errToObj(options)
		});
	}
	datetime(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "datetime",
			precision: null,
			offset: false,
			local: false,
			message: options
		});
		return this._addCheck({
			kind: "datetime",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			offset: options?.offset ?? false,
			local: options?.local ?? false,
			...errorUtil.errToObj(options?.message)
		});
	}
	date(message) {
		return this._addCheck({
			kind: "date",
			message
		});
	}
	time(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "time",
			precision: null,
			message: options
		});
		return this._addCheck({
			kind: "time",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			...errorUtil.errToObj(options?.message)
		});
	}
	duration(message) {
		return this._addCheck({
			kind: "duration",
			...errorUtil.errToObj(message)
		});
	}
	regex(regex, message) {
		return this._addCheck({
			kind: "regex",
			regex,
			...errorUtil.errToObj(message)
		});
	}
	includes(value, options) {
		return this._addCheck({
			kind: "includes",
			value,
			position: options?.position,
			...errorUtil.errToObj(options?.message)
		});
	}
	startsWith(value, message) {
		return this._addCheck({
			kind: "startsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	endsWith(value, message) {
		return this._addCheck({
			kind: "endsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	min(minLength, message) {
		return this._addCheck({
			kind: "min",
			value: minLength,
			...errorUtil.errToObj(message)
		});
	}
	max(maxLength, message) {
		return this._addCheck({
			kind: "max",
			value: maxLength,
			...errorUtil.errToObj(message)
		});
	}
	length(len, message) {
		return this._addCheck({
			kind: "length",
			value: len,
			...errorUtil.errToObj(message)
		});
	}
	/**
	* Equivalent to `.min(1)`
	*/
	nonempty(message) {
		return this.min(1, errorUtil.errToObj(message));
	}
	trim() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((ch) => ch.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((ch) => ch.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((ch) => ch.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((ch) => ch.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((ch) => ch.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((ch) => ch.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((ch) => ch.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((ch) => ch.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((ch) => ch.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((ch) => ch.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((ch) => ch.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((ch) => ch.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((ch) => ch.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((ch) => ch.kind === "base64url");
	}
	get minLength() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxLength() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodString.create = (params) => {
	return new ZodString({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodString,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
function floatSafeRemainder(val, step) {
	const valDecCount = (val.toString().split(".")[1] || "").length;
	const stepDecCount = (step.toString().split(".")[1] || "").length;
	const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	return Number.parseInt(val.toFixed(decCount).replace(".", "")) % Number.parseInt(step.toFixed(decCount).replace(".", "")) / 10 ** decCount;
}
var ZodNumber = class ZodNumber extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
		this.step = this.multipleOf;
	}
	_parse(input) {
		if (this._def.coerce) input.data = Number(input.data);
		if (this._getType(input) !== ZodParsedType.number) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.number,
				received: ctx.parsedType
			});
			return INVALID;
		}
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "int") {
			if (!util.isInteger(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_type,
					expected: "integer",
					received: "float",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (floatSafeRemainder(input.data, check.value) !== 0) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "finite") {
			if (!Number.isFinite(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_finite,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	int(message) {
		return this._addCheck({
			kind: "int",
			message: errorUtil.toString(message)
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	finite(message) {
		return this._addCheck({
			kind: "finite",
			message: errorUtil.toString(message)
		});
	}
	safe(message) {
		return this._addCheck({
			kind: "min",
			inclusive: true,
			value: Number.MIN_SAFE_INTEGER,
			message: errorUtil.toString(message)
		})._addCheck({
			kind: "max",
			inclusive: true,
			value: Number.MAX_SAFE_INTEGER,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
	get isInt() {
		return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
	}
	get isFinite() {
		let max = null;
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") return true;
		else if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		} else if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return Number.isFinite(min) && Number.isFinite(max);
	}
};
ZodNumber.create = (params) => {
	return new ZodNumber({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodNumber,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodBigInt = class ZodBigInt extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
	}
	_parse(input) {
		if (this._def.coerce) try {
			input.data = BigInt(input.data);
		} catch {
			return this._getInvalidInput(input);
		}
		if (this._getType(input) !== ZodParsedType.bigint) return this._getInvalidInput(input);
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					type: "bigint",
					minimum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					type: "bigint",
					maximum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (input.data % check.value !== BigInt(0)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_getInvalidInput(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.bigint,
			received: ctx.parsedType
		});
		return INVALID;
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodBigInt.create = (params) => {
	return new ZodBigInt({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodBigInt,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
var ZodBoolean = class extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = Boolean(input.data);
		if (this._getType(input) !== ZodParsedType.boolean) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.boolean,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodBoolean.create = (params) => {
	return new ZodBoolean({
		typeName: ZodFirstPartyTypeKind.ZodBoolean,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodDate = class ZodDate extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = new Date(input.data);
		if (this._getType(input) !== ZodParsedType.date) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.date,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (Number.isNaN(input.data.getTime())) {
			addIssueToContext(this._getOrReturnCtx(input), { code: ZodIssueCode.invalid_date });
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.getTime() < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					message: check.message,
					inclusive: true,
					exact: false,
					minimum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.getTime() > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					message: check.message,
					inclusive: true,
					exact: false,
					maximum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: new Date(input.data.getTime())
		};
	}
	_addCheck(check) {
		return new ZodDate({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	min(minDate, message) {
		return this._addCheck({
			kind: "min",
			value: minDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	max(maxDate, message) {
		return this._addCheck({
			kind: "max",
			value: maxDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	get minDate() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min != null ? new Date(min) : null;
	}
	get maxDate() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max != null ? new Date(max) : null;
	}
};
ZodDate.create = (params) => {
	return new ZodDate({
		checks: [],
		coerce: params?.coerce || false,
		typeName: ZodFirstPartyTypeKind.ZodDate,
		...processCreateParams(params)
	});
};
var ZodSymbol = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.symbol) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.symbol,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodSymbol.create = (params) => {
	return new ZodSymbol({
		typeName: ZodFirstPartyTypeKind.ZodSymbol,
		...processCreateParams(params)
	});
};
var ZodUndefined = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.undefined,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodUndefined.create = (params) => {
	return new ZodUndefined({
		typeName: ZodFirstPartyTypeKind.ZodUndefined,
		...processCreateParams(params)
	});
};
var ZodNull = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.null) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.null,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodNull.create = (params) => {
	return new ZodNull({
		typeName: ZodFirstPartyTypeKind.ZodNull,
		...processCreateParams(params)
	});
};
var ZodAny = class extends ZodType {
	constructor() {
		super(...arguments);
		this._any = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodAny.create = (params) => {
	return new ZodAny({
		typeName: ZodFirstPartyTypeKind.ZodAny,
		...processCreateParams(params)
	});
};
var ZodUnknown = class extends ZodType {
	constructor() {
		super(...arguments);
		this._unknown = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodUnknown.create = (params) => {
	return new ZodUnknown({
		typeName: ZodFirstPartyTypeKind.ZodUnknown,
		...processCreateParams(params)
	});
};
var ZodNever = class extends ZodType {
	_parse(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.never,
			received: ctx.parsedType
		});
		return INVALID;
	}
};
ZodNever.create = (params) => {
	return new ZodNever({
		typeName: ZodFirstPartyTypeKind.ZodNever,
		...processCreateParams(params)
	});
};
var ZodVoid = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.void,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodVoid.create = (params) => {
	return new ZodVoid({
		typeName: ZodFirstPartyTypeKind.ZodVoid,
		...processCreateParams(params)
	});
};
var ZodArray = class ZodArray extends ZodType {
	_parse(input) {
		const { ctx, status } = this._processInputParams(input);
		const def = this._def;
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (def.exactLength !== null) {
			const tooBig = ctx.data.length > def.exactLength.value;
			const tooSmall = ctx.data.length < def.exactLength.value;
			if (tooBig || tooSmall) {
				addIssueToContext(ctx, {
					code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
					minimum: tooSmall ? def.exactLength.value : void 0,
					maximum: tooBig ? def.exactLength.value : void 0,
					type: "array",
					inclusive: true,
					exact: true,
					message: def.exactLength.message
				});
				status.dirty();
			}
		}
		if (def.minLength !== null) {
			if (ctx.data.length < def.minLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.minLength.message
				});
				status.dirty();
			}
		}
		if (def.maxLength !== null) {
			if (ctx.data.length > def.maxLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.maxLength.message
				});
				status.dirty();
			}
		}
		if (ctx.common.async) return Promise.all([...ctx.data].map((item, i) => {
			return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		})).then((result) => {
			return ParseStatus.mergeArray(status, result);
		});
		const result = [...ctx.data].map((item, i) => {
			return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		});
		return ParseStatus.mergeArray(status, result);
	}
	get element() {
		return this._def.type;
	}
	min(minLength, message) {
		return new ZodArray({
			...this._def,
			minLength: {
				value: minLength,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxLength, message) {
		return new ZodArray({
			...this._def,
			maxLength: {
				value: maxLength,
				message: errorUtil.toString(message)
			}
		});
	}
	length(len, message) {
		return new ZodArray({
			...this._def,
			exactLength: {
				value: len,
				message: errorUtil.toString(message)
			}
		});
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodArray.create = (schema, params) => {
	return new ZodArray({
		type: schema,
		minLength: null,
		maxLength: null,
		exactLength: null,
		typeName: ZodFirstPartyTypeKind.ZodArray,
		...processCreateParams(params)
	});
};
function deepPartialify(schema) {
	if (schema instanceof ZodObject) {
		const newShape = {};
		for (const key in schema.shape) {
			const fieldSchema = schema.shape[key];
			newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
		}
		return new ZodObject({
			...schema._def,
			shape: () => newShape
		});
	} else if (schema instanceof ZodArray) return new ZodArray({
		...schema._def,
		type: deepPartialify(schema.element)
	});
	else if (schema instanceof ZodOptional) return ZodOptional.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodNullable) return ZodNullable.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodTuple) return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
	else return schema;
}
var ZodObject = class ZodObject extends ZodType {
	constructor() {
		super(...arguments);
		this._cached = null;
		/**
		* @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
		* If you want to pass through unknown properties, use `.passthrough()` instead.
		*/
		this.nonstrict = this.passthrough;
		/**
		* @deprecated Use `.extend` instead
		*  */
		this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		const shape = this._def.shape();
		const keys = util.objectKeys(shape);
		this._cached = {
			shape,
			keys
		};
		return this._cached;
	}
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.object) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const { status, ctx } = this._processInputParams(input);
		const { shape, keys: shapeKeys } = this._getCached();
		const extraKeys = [];
		if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
			for (const key in ctx.data) if (!shapeKeys.includes(key)) extraKeys.push(key);
		}
		const pairs = [];
		for (const key of shapeKeys) {
			const keyValidator = shape[key];
			const value = ctx.data[key];
			pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
				alwaysSet: key in ctx.data
			});
		}
		if (this._def.catchall instanceof ZodNever) {
			const unknownKeys = this._def.unknownKeys;
			if (unknownKeys === "passthrough") for (const key of extraKeys) pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: {
					status: "valid",
					value: ctx.data[key]
				}
			});
			else if (unknownKeys === "strict") {
				if (extraKeys.length > 0) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.unrecognized_keys,
						keys: extraKeys
					});
					status.dirty();
				}
			} else if (unknownKeys === "strip") {} else throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
		} else {
			const catchall = this._def.catchall;
			for (const key of extraKeys) {
				const value = ctx.data[key];
				pairs.push({
					key: {
						status: "valid",
						value: key
					},
					value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
					alwaysSet: key in ctx.data
				});
			}
		}
		if (ctx.common.async) return Promise.resolve().then(async () => {
			const syncPairs = [];
			for (const pair of pairs) {
				const key = await pair.key;
				const value = await pair.value;
				syncPairs.push({
					key,
					value,
					alwaysSet: pair.alwaysSet
				});
			}
			return syncPairs;
		}).then((syncPairs) => {
			return ParseStatus.mergeObjectSync(status, syncPairs);
		});
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get shape() {
		return this._def.shape();
	}
	strict(message) {
		errorUtil.errToObj;
		return new ZodObject({
			...this._def,
			unknownKeys: "strict",
			...message !== void 0 ? { errorMap: (issue, ctx) => {
				const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
				if (issue.code === "unrecognized_keys") return { message: errorUtil.errToObj(message).message ?? defaultError };
				return { message: defaultError };
			} } : {}
		});
	}
	strip() {
		return new ZodObject({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new ZodObject({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(augmentation) {
		return new ZodObject({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...augmentation
			})
		});
	}
	/**
	* Prior to zod@1.0.12 there was a bug in the
	* inferred type of merged objects. Please
	* upgrade if you are experiencing issues.
	*/
	merge(merging) {
		return new ZodObject({
			unknownKeys: merging._def.unknownKeys,
			catchall: merging._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...merging._def.shape()
			}),
			typeName: ZodFirstPartyTypeKind.ZodObject
		});
	}
	setKey(key, schema) {
		return this.augment({ [key]: schema });
	}
	catchall(index) {
		return new ZodObject({
			...this._def,
			catchall: index
		});
	}
	pick(mask) {
		const shape = {};
		for (const key of util.objectKeys(mask)) if (mask[key] && this.shape[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	omit(mask) {
		const shape = {};
		for (const key of util.objectKeys(this.shape)) if (!mask[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	/**
	* @deprecated
	*/
	deepPartial() {
		return deepPartialify(this);
	}
	partial(mask) {
		const newShape = {};
		for (const key of util.objectKeys(this.shape)) {
			const fieldSchema = this.shape[key];
			if (mask && !mask[key]) newShape[key] = fieldSchema;
			else newShape[key] = fieldSchema.optional();
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	required(mask) {
		const newShape = {};
		for (const key of util.objectKeys(this.shape)) if (mask && !mask[key]) newShape[key] = this.shape[key];
		else {
			let newField = this.shape[key];
			while (newField instanceof ZodOptional) newField = newField._def.innerType;
			newShape[key] = newField;
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	keyof() {
		return createZodEnum(util.objectKeys(this.shape));
	}
};
ZodObject.create = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.strictCreate = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strict",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate = (shape, params) => {
	return new ZodObject({
		shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
var ZodUnion = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const options = this._def.options;
		function handleResults(results) {
			for (const result of results) if (result.result.status === "valid") return result.result;
			for (const result of results) if (result.result.status === "dirty") {
				ctx.common.issues.push(...result.ctx.common.issues);
				return result.result;
			}
			const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
		if (ctx.common.async) return Promise.all(options.map(async (option) => {
			const childCtx = {
				...ctx,
				common: {
					...ctx.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await option._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				}),
				ctx: childCtx
			};
		})).then(handleResults);
		else {
			let dirty = void 0;
			const issues = [];
			for (const option of options) {
				const childCtx = {
					...ctx,
					common: {
						...ctx.common,
						issues: []
					},
					parent: null
				};
				const result = option._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				});
				if (result.status === "valid") return result;
				else if (result.status === "dirty" && !dirty) dirty = {
					result,
					ctx: childCtx
				};
				if (childCtx.common.issues.length) issues.push(childCtx.common.issues);
			}
			if (dirty) {
				ctx.common.issues.push(...dirty.ctx.common.issues);
				return dirty.result;
			}
			const unionErrors = issues.map((issues) => new ZodError(issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
	}
	get options() {
		return this._def.options;
	}
};
ZodUnion.create = (types, params) => {
	return new ZodUnion({
		options: types,
		typeName: ZodFirstPartyTypeKind.ZodUnion,
		...processCreateParams(params)
	});
};
var getDiscriminator = (type) => {
	if (type instanceof ZodLazy) return getDiscriminator(type.schema);
	else if (type instanceof ZodEffects) return getDiscriminator(type.innerType());
	else if (type instanceof ZodLiteral) return [type.value];
	else if (type instanceof ZodEnum) return type.options;
	else if (type instanceof ZodNativeEnum) return util.objectValues(type.enum);
	else if (type instanceof ZodDefault) return getDiscriminator(type._def.innerType);
	else if (type instanceof ZodUndefined) return [void 0];
	else if (type instanceof ZodNull) return [null];
	else if (type instanceof ZodOptional) return [void 0, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodNullable) return [null, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodBranded) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodReadonly) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodCatch) return getDiscriminator(type._def.innerType);
	else return [];
};
var ZodDiscriminatedUnion = class ZodDiscriminatedUnion extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const discriminator = this.discriminator;
		const discriminatorValue = ctx.data[discriminator];
		const option = this.optionsMap.get(discriminatorValue);
		if (!option) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union_discriminator,
				options: Array.from(this.optionsMap.keys()),
				path: [discriminator]
			});
			return INVALID;
		}
		if (ctx.common.async) return option._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
		else return option._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	/**
	* The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
	* However, it only allows a union of objects, all of which need to share a discriminator property. This property must
	* have a different value for each object in the union.
	* @param discriminator the name of the discriminator property
	* @param types an array of object schemas
	* @param params
	*/
	static create(discriminator, options, params) {
		const optionsMap = /* @__PURE__ */ new Map();
		for (const type of options) {
			const discriminatorValues = getDiscriminator(type.shape[discriminator]);
			if (!discriminatorValues.length) throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
			for (const value of discriminatorValues) {
				if (optionsMap.has(value)) throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
				optionsMap.set(value, type);
			}
		}
		return new ZodDiscriminatedUnion({
			typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
			discriminator,
			options,
			optionsMap,
			...processCreateParams(params)
		});
	}
};
function mergeValues(a, b) {
	const aType = getParsedType(a);
	const bType = getParsedType(b);
	if (a === b) return {
		valid: true,
		data: a
	};
	else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
		const bKeys = util.objectKeys(b);
		const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return { valid: false };
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	} else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
		if (a.length !== b.length) return { valid: false };
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return { valid: false };
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	} else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) return {
		valid: true,
		data: a
	};
	else return { valid: false };
}
var ZodIntersection = class extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const handleParsed = (parsedLeft, parsedRight) => {
			if (isAborted(parsedLeft) || isAborted(parsedRight)) return INVALID;
			const merged = mergeValues(parsedLeft.value, parsedRight.value);
			if (!merged.valid) {
				addIssueToContext(ctx, { code: ZodIssueCode.invalid_intersection_types });
				return INVALID;
			}
			if (isDirty(parsedLeft) || isDirty(parsedRight)) status.dirty();
			return {
				status: status.value,
				value: merged.data
			};
		};
		if (ctx.common.async) return Promise.all([this._def.left._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		})]).then(([left, right]) => handleParsed(left, right));
		else return handleParsed(this._def.left._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}));
	}
};
ZodIntersection.create = (left, right, params) => {
	return new ZodIntersection({
		left,
		right,
		typeName: ZodFirstPartyTypeKind.ZodIntersection,
		...processCreateParams(params)
	});
};
var ZodTuple = class ZodTuple extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (ctx.data.length < this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_small,
				minimum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			return INVALID;
		}
		if (!this._def.rest && ctx.data.length > this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_big,
				maximum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			status.dirty();
		}
		const items = [...ctx.data].map((item, itemIndex) => {
			const schema = this._def.items[itemIndex] || this._def.rest;
			if (!schema) return null;
			return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
		}).filter((x) => !!x);
		if (ctx.common.async) return Promise.all(items).then((results) => {
			return ParseStatus.mergeArray(status, results);
		});
		else return ParseStatus.mergeArray(status, items);
	}
	get items() {
		return this._def.items;
	}
	rest(rest) {
		return new ZodTuple({
			...this._def,
			rest
		});
	}
};
ZodTuple.create = (schemas, params) => {
	if (!Array.isArray(schemas)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new ZodTuple({
		items: schemas,
		typeName: ZodFirstPartyTypeKind.ZodTuple,
		rest: null,
		...processCreateParams(params)
	});
};
var ZodRecord = class ZodRecord extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const pairs = [];
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		for (const key in ctx.data) pairs.push({
			key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
			value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
			alwaysSet: key in ctx.data
		});
		if (ctx.common.async) return ParseStatus.mergeObjectAsync(status, pairs);
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get element() {
		return this._def.valueType;
	}
	static create(first, second, third) {
		if (second instanceof ZodType) return new ZodRecord({
			keyType: first,
			valueType: second,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(third)
		});
		return new ZodRecord({
			keyType: ZodString.create(),
			valueType: first,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(second)
		});
	}
};
var ZodMap = class extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.map) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.map,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		const pairs = [...ctx.data.entries()].map(([key, value], index) => {
			return {
				key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
				value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
			};
		});
		if (ctx.common.async) {
			const finalMap = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (const pair of pairs) {
					const key = await pair.key;
					const value = await pair.value;
					if (key.status === "aborted" || value.status === "aborted") return INVALID;
					if (key.status === "dirty" || value.status === "dirty") status.dirty();
					finalMap.set(key.value, value.value);
				}
				return {
					status: status.value,
					value: finalMap
				};
			});
		} else {
			const finalMap = /* @__PURE__ */ new Map();
			for (const pair of pairs) {
				const key = pair.key;
				const value = pair.value;
				if (key.status === "aborted" || value.status === "aborted") return INVALID;
				if (key.status === "dirty" || value.status === "dirty") status.dirty();
				finalMap.set(key.value, value.value);
			}
			return {
				status: status.value,
				value: finalMap
			};
		}
	}
};
ZodMap.create = (keyType, valueType, params) => {
	return new ZodMap({
		valueType,
		keyType,
		typeName: ZodFirstPartyTypeKind.ZodMap,
		...processCreateParams(params)
	});
};
var ZodSet = class ZodSet extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.set) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.set,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const def = this._def;
		if (def.minSize !== null) {
			if (ctx.data.size < def.minSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.minSize.message
				});
				status.dirty();
			}
		}
		if (def.maxSize !== null) {
			if (ctx.data.size > def.maxSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.maxSize.message
				});
				status.dirty();
			}
		}
		const valueType = this._def.valueType;
		function finalizeSet(elements) {
			const parsedSet = /* @__PURE__ */ new Set();
			for (const element of elements) {
				if (element.status === "aborted") return INVALID;
				if (element.status === "dirty") status.dirty();
				parsedSet.add(element.value);
			}
			return {
				status: status.value,
				value: parsedSet
			};
		}
		const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
		if (ctx.common.async) return Promise.all(elements).then((elements) => finalizeSet(elements));
		else return finalizeSet(elements);
	}
	min(minSize, message) {
		return new ZodSet({
			...this._def,
			minSize: {
				value: minSize,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxSize, message) {
		return new ZodSet({
			...this._def,
			maxSize: {
				value: maxSize,
				message: errorUtil.toString(message)
			}
		});
	}
	size(size, message) {
		return this.min(size, message).max(size, message);
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodSet.create = (valueType, params) => {
	return new ZodSet({
		valueType,
		minSize: null,
		maxSize: null,
		typeName: ZodFirstPartyTypeKind.ZodSet,
		...processCreateParams(params)
	});
};
var ZodFunction = class ZodFunction extends ZodType {
	constructor() {
		super(...arguments);
		this.validate = this.implement;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.function) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.function,
				received: ctx.parsedType
			});
			return INVALID;
		}
		function makeArgsIssue(args, error) {
			return makeIssue({
				data: args,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_arguments,
					argumentsError: error
				}
			});
		}
		function makeReturnsIssue(returns, error) {
			return makeIssue({
				data: returns,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_return_type,
					returnTypeError: error
				}
			});
		}
		const params = { errorMap: ctx.common.contextualErrorMap };
		const fn = ctx.data;
		if (this._def.returns instanceof ZodPromise) {
			const me = this;
			return OK(async function(...args) {
				const error = new ZodError([]);
				const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
					error.addIssue(makeArgsIssue(args, e));
					throw error;
				});
				const result = await Reflect.apply(fn, this, parsedArgs);
				return await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
					error.addIssue(makeReturnsIssue(result, e));
					throw error;
				});
			});
		} else {
			const me = this;
			return OK(function(...args) {
				const parsedArgs = me._def.args.safeParse(args, params);
				if (!parsedArgs.success) throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
				const result = Reflect.apply(fn, this, parsedArgs.data);
				const parsedReturns = me._def.returns.safeParse(result, params);
				if (!parsedReturns.success) throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
				return parsedReturns.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...items) {
		return new ZodFunction({
			...this._def,
			args: ZodTuple.create(items).rest(ZodUnknown.create())
		});
	}
	returns(returnType) {
		return new ZodFunction({
			...this._def,
			returns: returnType
		});
	}
	implement(func) {
		return this.parse(func);
	}
	strictImplement(func) {
		return this.parse(func);
	}
	static create(args, returns, params) {
		return new ZodFunction({
			args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
			returns: returns || ZodUnknown.create(),
			typeName: ZodFirstPartyTypeKind.ZodFunction,
			...processCreateParams(params)
		});
	}
};
var ZodLazy = class extends ZodType {
	get schema() {
		return this._def.getter();
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		return this._def.getter()._parse({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
};
ZodLazy.create = (getter, params) => {
	return new ZodLazy({
		getter,
		typeName: ZodFirstPartyTypeKind.ZodLazy,
		...processCreateParams(params)
	});
};
var ZodLiteral = class extends ZodType {
	_parse(input) {
		if (input.data !== this._def.value) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_literal,
				expected: this._def.value
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
	get value() {
		return this._def.value;
	}
};
ZodLiteral.create = (value, params) => {
	return new ZodLiteral({
		value,
		typeName: ZodFirstPartyTypeKind.ZodLiteral,
		...processCreateParams(params)
	});
};
function createZodEnum(values, params) {
	return new ZodEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodEnum,
		...processCreateParams(params)
	});
}
var ZodEnum = class ZodEnum extends ZodType {
	_parse(input) {
		if (typeof input.data !== "string") {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				expected: util.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(this._def.values);
		if (!this._cache.has(input.data)) {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Values() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	extract(values, newDef = this._def) {
		return ZodEnum.create(values, {
			...this._def,
			...newDef
		});
	}
	exclude(values, newDef = this._def) {
		return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
			...this._def,
			...newDef
		});
	}
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
	_parse(input) {
		const nativeEnumValues = util.getValidEnumValues(this._def.values);
		const ctx = this._getOrReturnCtx(input);
		if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
			const expectedValues = util.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				expected: util.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(util.getValidEnumValues(this._def.values));
		if (!this._cache.has(input.data)) {
			const expectedValues = util.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get enum() {
		return this._def.values;
	}
};
ZodNativeEnum.create = (values, params) => {
	return new ZodNativeEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
		...processCreateParams(params)
	});
};
var ZodPromise = class extends ZodType {
	unwrap() {
		return this._def.type;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.promise,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK((ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data)).then((data) => {
			return this._def.type.parseAsync(data, {
				path: ctx.path,
				errorMap: ctx.common.contextualErrorMap
			});
		}));
	}
};
ZodPromise.create = (schema, params) => {
	return new ZodPromise({
		type: schema,
		typeName: ZodFirstPartyTypeKind.ZodPromise,
		...processCreateParams(params)
	});
};
var ZodEffects = class extends ZodType {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const effect = this._def.effect || null;
		const checkCtx = {
			addIssue: (arg) => {
				addIssueToContext(ctx, arg);
				if (arg.fatal) status.abort();
				else status.dirty();
			},
			get path() {
				return ctx.path;
			}
		};
		checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
		if (effect.type === "preprocess") {
			const processed = effect.transform(ctx.data, checkCtx);
			if (ctx.common.async) return Promise.resolve(processed).then(async (processed) => {
				if (status.value === "aborted") return INVALID;
				const result = await this._def.schema._parseAsync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			});
			else {
				if (status.value === "aborted") return INVALID;
				const result = this._def.schema._parseSync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			}
		}
		if (effect.type === "refinement") {
			const executeRefinement = (acc) => {
				const result = effect.refinement(acc, checkCtx);
				if (ctx.common.async) return Promise.resolve(result);
				if (result instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return acc;
			};
			if (ctx.common.async === false) {
				const inner = this._def.schema._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				executeRefinement(inner.value);
				return {
					status: status.value,
					value: inner.value
				};
			} else return this._def.schema._parseAsync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			}).then((inner) => {
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				return executeRefinement(inner.value).then(() => {
					return {
						status: status.value,
						value: inner.value
					};
				});
			});
		}
		if (effect.type === "transform") {
			if (ctx.common.async === false) {
				const base = this._def.schema._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (!isValid(base)) return INVALID;
				const result = effect.transform(base.value, checkCtx);
				if (result instanceof Promise) throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
				return {
					status: status.value,
					value: result
				};
			} else return this._def.schema._parseAsync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			}).then((base) => {
				if (!isValid(base)) return INVALID;
				return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
					status: status.value,
					value: result
				}));
			});
		}
		util.assertNever(effect);
	}
};
ZodEffects.create = (schema, effect, params) => {
	return new ZodEffects({
		schema,
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		effect,
		...processCreateParams(params)
	});
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
	return new ZodEffects({
		schema,
		effect: {
			type: "preprocess",
			transform: preprocess
		},
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		...processCreateParams(params)
	});
};
var ZodOptional = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.undefined) return OK(void 0);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodOptional.create = (type, params) => {
	return new ZodOptional({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodOptional,
		...processCreateParams(params)
	});
};
var ZodNullable = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.null) return OK(null);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodNullable.create = (type, params) => {
	return new ZodNullable({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodNullable,
		...processCreateParams(params)
	});
};
var ZodDefault = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		let data = ctx.data;
		if (ctx.parsedType === ZodParsedType.undefined) data = this._def.defaultValue();
		return this._def.innerType._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
ZodDefault.create = (type, params) => {
	return new ZodDefault({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodDefault,
		defaultValue: typeof params.default === "function" ? params.default : () => params.default,
		...processCreateParams(params)
	});
};
var ZodCatch = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const newCtx = {
			...ctx,
			common: {
				...ctx.common,
				issues: []
			}
		};
		const result = this._def.innerType._parse({
			data: newCtx.data,
			path: newCtx.path,
			parent: { ...newCtx }
		});
		if (isAsync(result)) return result.then((result) => {
			return {
				status: "valid",
				value: result.status === "valid" ? result.value : this._def.catchValue({
					get error() {
						return new ZodError(newCtx.common.issues);
					},
					input: newCtx.data
				})
			};
		});
		else return {
			status: "valid",
			value: result.status === "valid" ? result.value : this._def.catchValue({
				get error() {
					return new ZodError(newCtx.common.issues);
				},
				input: newCtx.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
ZodCatch.create = (type, params) => {
	return new ZodCatch({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodCatch,
		catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
		...processCreateParams(params)
	});
};
var ZodNaN = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.nan) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.nan,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
};
ZodNaN.create = (params) => {
	return new ZodNaN({
		typeName: ZodFirstPartyTypeKind.ZodNaN,
		...processCreateParams(params)
	});
};
var ZodBranded = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const data = ctx.data;
		return this._def.type._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	unwrap() {
		return this._def.type;
	}
};
var ZodPipeline = class ZodPipeline extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.common.async) {
			const handleAsync = async () => {
				const inResult = await this._def.in._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inResult.status === "aborted") return INVALID;
				if (inResult.status === "dirty") {
					status.dirty();
					return DIRTY(inResult.value);
				} else return this._def.out._parseAsync({
					data: inResult.value,
					path: ctx.path,
					parent: ctx
				});
			};
			return handleAsync();
		} else {
			const inResult = this._def.in._parseSync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			});
			if (inResult.status === "aborted") return INVALID;
			if (inResult.status === "dirty") {
				status.dirty();
				return {
					status: "dirty",
					value: inResult.value
				};
			} else return this._def.out._parseSync({
				data: inResult.value,
				path: ctx.path,
				parent: ctx
			});
		}
	}
	static create(a, b) {
		return new ZodPipeline({
			in: a,
			out: b,
			typeName: ZodFirstPartyTypeKind.ZodPipeline
		});
	}
};
var ZodReadonly = class extends ZodType {
	_parse(input) {
		const result = this._def.innerType._parse(input);
		const freeze = (data) => {
			if (isValid(data)) data.value = Object.freeze(data.value);
			return data;
		};
		return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodReadonly.create = (type, params) => {
	return new ZodReadonly({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodReadonly,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate;
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {
	ZodFirstPartyTypeKind["ZodString"] = "ZodString";
	ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
	ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
	ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
	ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
	ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
	ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
	ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
	ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
	ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
	ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
	ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
	ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
	ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
	ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
	ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
	ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
	ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
	ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
	ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
	ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
	ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
	ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
	ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
	ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
	ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
	ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
	ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
	ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
	ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
	ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
	ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
	ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
	ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
	ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
	ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
ZodString.create;
ZodNumber.create;
ZodNaN.create;
ZodBigInt.create;
ZodBoolean.create;
ZodDate.create;
ZodSymbol.create;
ZodUndefined.create;
ZodNull.create;
ZodAny.create;
ZodUnknown.create;
ZodNever.create;
ZodVoid.create;
ZodArray.create;
var objectType = ZodObject.create;
ZodObject.strictCreate;
ZodUnion.create;
ZodDiscriminatedUnion.create;
ZodIntersection.create;
ZodTuple.create;
ZodRecord.create;
ZodMap.create;
ZodSet.create;
ZodFunction.create;
ZodLazy.create;
ZodLiteral.create;
ZodEnum.create;
ZodNativeEnum.create;
ZodPromise.create;
ZodEffects.create;
ZodOptional.create;
ZodNullable.create;
ZodEffects.createWithPreprocess;
ZodPipeline.create;
//#endregion
//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/mini/schemas.js
var ZodMiniType = /*@__PURE__*/ $constructor("ZodMiniType", (inst, def) => {
	if (!inst._zod) throw new Error("Uninitialized schema in ZodMiniType.");
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse$1(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync$1(inst, data, params);
	inst.check = (...checks) => {
		return inst.clone({
			...def,
			checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)]
		}, { parent: true });
	};
	inst.with = inst.check;
	inst.clone = (_def, params) => clone(inst, _def, params);
	inst.brand = () => inst;
	inst.register = ((reg, meta) => {
		reg.add(inst, meta);
		return inst;
	});
	inst.apply = (fn) => fn(inst);
});
var ZodMiniObject = /*@__PURE__*/ $constructor("ZodMiniObject", (inst, def) => {
	$ZodObject.init(inst, def);
	ZodMiniType.init(inst, def);
	defineLazy(inst, "shape", () => def.shape);
});
// @__NO_SIDE_EFFECTS__
function object(shape, params) {
	return new ZodMiniObject({
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	});
}
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js
function isZ4Schema(s) {
	return !!s._zod;
}
function objectFromShape(shape) {
	const values = Object.values(shape);
	if (values.length === 0) return /* @__PURE__ */ object({});
	const allV4 = values.every(isZ4Schema);
	const allV3 = values.every((s) => !isZ4Schema(s));
	if (allV4) return /* @__PURE__ */ object(shape);
	if (allV3) return objectType(shape);
	throw new Error("Mixed Zod versions detected in object shape.");
}
function safeParse(schema, data) {
	if (isZ4Schema(schema)) return safeParse$1(schema, data);
	return schema.safeParse(data);
}
async function safeParseAsync(schema, data) {
	if (isZ4Schema(schema)) return await safeParseAsync$1(schema, data);
	return await schema.safeParseAsync(data);
}
function getObjectShape(schema) {
	if (!schema) return void 0;
	let rawShape;
	if (isZ4Schema(schema)) rawShape = schema._zod?.def?.shape;
	else rawShape = schema.shape;
	if (!rawShape) return void 0;
	if (typeof rawShape === "function") try {
		return rawShape();
	} catch {
		return;
	}
	return rawShape;
}
/**
* Normalizes a schema to an object schema. Handles both:
* - Already-constructed object schemas (v3 or v4)
* - Raw shapes that need to be wrapped into object schemas
*/
function normalizeObjectSchema(schema) {
	if (!schema) return void 0;
	if (typeof schema === "object") {
		const asV3 = schema;
		const asV4 = schema;
		if (!asV3._def && !asV4._zod) {
			const values = Object.values(schema);
			if (values.length > 0 && values.every((v) => typeof v === "object" && v !== null && (v._def !== void 0 || v._zod !== void 0 || typeof v.parse === "function"))) return objectFromShape(schema);
		}
	}
	if (isZ4Schema(schema)) {
		const def = schema._zod?.def;
		if (def && (def.type === "object" || def.shape !== void 0)) return schema;
	} else if (schema.shape !== void 0) return schema;
}
function getDotPath(path) {
	if (path.length === 0) return "object root";
	return path.reduce((acc, seg, index) => {
		if (index === 0) return String(seg);
		if (typeof seg === "number") return `${acc}[${seg}]`;
		return `${acc}.${seg}`;
	}, "");
}
/**
* Safely extracts an error message from a parse result error.
* Zod errors can have different structures, so we handle various cases.
*/
function getParseErrorMessage(error) {
	if (error && typeof error === "object") {
		if ("issues" in error && Array.isArray(error.issues) && error.issues.length > 0) return error.issues.map((i) => {
			if (!i.path?.length) return i.message;
			return `${i.message} at ${getDotPath(i.path)}`;
		}).join("\n");
		if ("message" in error && typeof error.message === "string") return error.message;
		try {
			return JSON.stringify(error);
		} catch {
			return String(error);
		}
	}
	return String(error);
}
/**
* Gets the description from a schema, if available.
* Works with both Zod v3 and v4.
*
* Both versions expose a `.description` getter that returns the description
* from their respective internal storage (v3: _def, v4: globalRegistry).
*/
function getSchemaDescription(schema) {
	return schema.description;
}
/**
* Checks if a schema is optional.
* Works with both Zod v3 and v4.
*/
function isSchemaOptional(schema) {
	if (isZ4Schema(schema)) return schema._zod?.def?.type === "optional";
	const v3Schema = schema;
	if (typeof schema.isOptional === "function") return schema.isOptional();
	return v3Schema._def?.typeName === "ZodOptional";
}
/**
* Gets the literal value from a schema, if it's a literal schema.
* Works with both Zod v3 and v4.
* Returns undefined if the schema is not a literal or the value cannot be determined.
*/
function getLiteralValue(schema) {
	if (isZ4Schema(schema)) {
		const def = schema._zod?.def;
		if (def) {
			if (def.value !== void 0) return def.value;
			if (Array.isArray(def.values) && def.values.length > 0) return def.values[0];
		}
	}
	const def = schema._def;
	if (def) {
		if (def.value !== void 0) return def.value;
		if (Array.isArray(def.values) && def.values.length > 0) return def.values[0];
	}
	const directValue = schema.value;
	if (directValue !== void 0) return directValue;
}
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/interfaces.js
/**
* Experimental task interfaces for MCP SDK.
* WARNING: These APIs are experimental and may change without notice.
*/
/**
* Checks if a task status represents a terminal state.
* Terminal states are those where the task has finished and will not change.
*
* @param status - The task status to check
* @returns True if the status is terminal (completed, failed, or cancelled)
* @experimental
*/
function isTerminal(status) {
	return status === "completed" || status === "failed" || status === "cancelled";
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/Options.js
var ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
var defaultOptions = {
	name: void 0,
	$refStrategy: "root",
	basePath: ["#"],
	effectStrategy: "input",
	pipeStrategy: "all",
	dateStrategy: "format:date-time",
	mapStrategy: "entries",
	removeAdditionalStrategy: "passthrough",
	allowedAdditionalProperties: true,
	rejectedAdditionalProperties: false,
	definitionPath: "definitions",
	target: "jsonSchema7",
	strictUnions: false,
	definitions: {},
	errorMessages: false,
	markdownDescription: false,
	patternStrategy: "escape",
	applyRegexFlags: false,
	emailStrategy: "format:email",
	base64Strategy: "contentEncoding:base64",
	nameStrategy: "ref",
	openAiAnyTypeName: "OpenAiAnyType"
};
var getDefaultOptions = (options) => typeof options === "string" ? {
	...defaultOptions,
	name: options
} : {
	...defaultOptions,
	...options
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/Refs.js
var getRefs = (options) => {
	const _options = getDefaultOptions(options);
	const currentPath = _options.name !== void 0 ? [
		..._options.basePath,
		_options.definitionPath,
		_options.name
	] : _options.basePath;
	return {
		..._options,
		flags: { hasReferencedOpenAiAnyType: false },
		currentPath,
		propertyPath: void 0,
		seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [def._def, {
			def: def._def,
			path: [
				..._options.basePath,
				_options.definitionPath,
				name
			],
			jsonSchema: void 0
		}]))
	};
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/errorMessages.js
function addErrorMessage(res, key, errorMessage, refs) {
	if (!refs?.errorMessages) return;
	if (errorMessage) res.errorMessage = {
		...res.errorMessage,
		[key]: errorMessage
	};
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
	res[key] = value;
	addErrorMessage(res, key, errorMessage, refs);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/getRelativePath.js
var getRelativePath = (pathA, pathB) => {
	let i = 0;
	for (; i < pathA.length && i < pathB.length; i++) if (pathA[i] !== pathB[i]) break;
	return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/any.js
function parseAnyDef(refs) {
	if (refs.target !== "openAi") return {};
	const anyDefinitionPath = [
		...refs.basePath,
		refs.definitionPath,
		refs.openAiAnyTypeName
	];
	refs.flags.hasReferencedOpenAiAnyType = true;
	return { $ref: refs.$refStrategy === "relative" ? getRelativePath(anyDefinitionPath, refs.currentPath) : anyDefinitionPath.join("/") };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/array.js
function parseArrayDef(def, refs) {
	const res = { type: "array" };
	if (def.type?._def && def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) res.items = parseDef(def.type._def, {
		...refs,
		currentPath: [...refs.currentPath, "items"]
	});
	if (def.minLength) setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
	if (def.maxLength) setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
	if (def.exactLength) {
		setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
		setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
	}
	return res;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
function parseBigintDef(def, refs) {
	const res = {
		type: "integer",
		format: "int64"
	};
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf": setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
	}
	return res;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
function parseBooleanDef() {
	return { type: "boolean" };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
function parseBrandedDef(_def, refs) {
	return parseDef(_def.type._def, refs);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
var parseCatchDef = (def, refs) => {
	return parseDef(def.innerType._def, refs);
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/date.js
function parseDateDef(def, refs, overrideDateStrategy) {
	const strategy = overrideDateStrategy ?? refs.dateStrategy;
	if (Array.isArray(strategy)) return { anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)) };
	switch (strategy) {
		case "string":
		case "format:date-time": return {
			type: "string",
			format: "date-time"
		};
		case "format:date": return {
			type: "string",
			format: "date"
		};
		case "integer": return integerDateParser(def, refs);
	}
}
var integerDateParser = (def, refs) => {
	const res = {
		type: "integer",
		format: "unix-time"
	};
	if (refs.target === "openApi3") return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			break;
		case "max": setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
	}
	return res;
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/default.js
function parseDefaultDef(_def, refs) {
	return {
		...parseDef(_def.innerType._def, refs),
		default: _def.defaultValue()
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
function parseEffectsDef(_def, refs) {
	return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef(refs);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
function parseEnumDef(def) {
	return {
		type: "string",
		enum: Array.from(def.values)
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
var isJsonSchema7AllOfType = (type) => {
	if ("type" in type && type.type === "string") return false;
	return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
	const allOf = [parseDef(def.left._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	}), parseDef(def.right._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"1"
		]
	})].filter((x) => !!x);
	let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
	const mergedAllOf = [];
	allOf.forEach((schema) => {
		if (isJsonSchema7AllOfType(schema)) {
			mergedAllOf.push(...schema.allOf);
			if (schema.unevaluatedProperties === void 0) unevaluatedProperties = void 0;
		} else {
			let nestedSchema = schema;
			if ("additionalProperties" in schema && schema.additionalProperties === false) {
				const { additionalProperties, ...rest } = schema;
				nestedSchema = rest;
			} else unevaluatedProperties = void 0;
			mergedAllOf.push(nestedSchema);
		}
	});
	return mergedAllOf.length ? {
		allOf: mergedAllOf,
		...unevaluatedProperties
	} : void 0;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
function parseLiteralDef(def, refs) {
	const parsedType = typeof def.value;
	if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") return { type: Array.isArray(def.value) ? "array" : "object" };
	if (refs.target === "openApi3") return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		enum: [def.value]
	};
	return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		const: def.value
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/string.js
var emojiRegex = void 0;
/**
* Generated from the regular expressions found here as of 2024-05-22:
* https://github.com/colinhacks/zod/blob/master/src/types.ts.
*
* Expressions with /i flag have been changed accordingly.
*/
var zodPatterns = {
	/**
	* `c` was changed to `[cC]` to replicate /i flag
	*/
	cuid: /^[cC][^\s-]{8,}$/,
	cuid2: /^[0-9a-z]+$/,
	ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
	/**
	* `a-z` was added to replicate /i flag
	*/
	email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
	/**
	* Constructed a valid Unicode RegExp
	*
	* Lazily instantiate since this type of regex isn't supported
	* in all envs (e.g. React Native).
	*
	* See:
	* https://github.com/colinhacks/zod/issues/2433
	* Fix in Zod:
	* https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
	*/
	emoji: () => {
		if (emojiRegex === void 0) emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
		return emojiRegex;
	},
	/**
	* Unused
	*/
	uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
	/**
	* Unused
	*/
	ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
	/**
	* Unused
	*/
	ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
	ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
	base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
	base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
	nanoid: /^[a-zA-Z0-9_-]{21}$/,
	jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
	const res = { type: "string" };
	if (def.checks) for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			break;
		case "max":
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "email":
			switch (refs.emailStrategy) {
				case "format:email":
					addFormat(res, "email", check.message, refs);
					break;
				case "format:idn-email":
					addFormat(res, "idn-email", check.message, refs);
					break;
				case "pattern:zod": addPattern(res, zodPatterns.email, check.message, refs);
			}
			break;
		case "url":
			addFormat(res, "uri", check.message, refs);
			break;
		case "uuid":
			addFormat(res, "uuid", check.message, refs);
			break;
		case "regex":
			addPattern(res, check.regex, check.message, refs);
			break;
		case "cuid":
			addPattern(res, zodPatterns.cuid, check.message, refs);
			break;
		case "cuid2":
			addPattern(res, zodPatterns.cuid2, check.message, refs);
			break;
		case "startsWith":
			addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
			break;
		case "endsWith":
			addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
			break;
		case "datetime":
			addFormat(res, "date-time", check.message, refs);
			break;
		case "date":
			addFormat(res, "date", check.message, refs);
			break;
		case "time":
			addFormat(res, "time", check.message, refs);
			break;
		case "duration":
			addFormat(res, "duration", check.message, refs);
			break;
		case "length":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "includes":
			addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
			break;
		case "ip":
			if (check.version !== "v6") addFormat(res, "ipv4", check.message, refs);
			if (check.version !== "v4") addFormat(res, "ipv6", check.message, refs);
			break;
		case "base64url":
			addPattern(res, zodPatterns.base64url, check.message, refs);
			break;
		case "jwt":
			addPattern(res, zodPatterns.jwt, check.message, refs);
			break;
		case "cidr":
			if (check.version !== "v6") addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
			if (check.version !== "v4") addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
			break;
		case "emoji":
			addPattern(res, zodPatterns.emoji(), check.message, refs);
			break;
		case "ulid":
			addPattern(res, zodPatterns.ulid, check.message, refs);
			break;
		case "base64":
			switch (refs.base64Strategy) {
				case "format:binary":
					addFormat(res, "binary", check.message, refs);
					break;
				case "contentEncoding:base64":
					setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
					break;
				case "pattern:zod": addPattern(res, zodPatterns.base64, check.message, refs);
			}
			break;
		case "nanoid": addPattern(res, zodPatterns.nanoid, check.message, refs);
	}
	return res;
}
function escapeLiteralCheckValue(literal, refs) {
	return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
var ALPHA_NUMERIC = /* @__PURE__ */ new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
	let result = "";
	for (let i = 0; i < source.length; i++) {
		if (!ALPHA_NUMERIC.has(source[i])) result += "\\";
		result += source[i];
	}
	return result;
}
function addFormat(schema, value, message, refs) {
	if (schema.format || schema.anyOf?.some((x) => x.format)) {
		if (!schema.anyOf) schema.anyOf = [];
		if (schema.format) {
			schema.anyOf.push({
				format: schema.format,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { format: schema.errorMessage.format } }
			});
			delete schema.format;
			if (schema.errorMessage) {
				delete schema.errorMessage.format;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.anyOf.push({
			format: value,
			...message && refs.errorMessages && { errorMessage: { format: message } }
		});
	} else setResponseValueAndErrors(schema, "format", value, message, refs);
}
function addPattern(schema, regex, message, refs) {
	if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
		if (!schema.allOf) schema.allOf = [];
		if (schema.pattern) {
			schema.allOf.push({
				pattern: schema.pattern,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { pattern: schema.errorMessage.pattern } }
			});
			delete schema.pattern;
			if (schema.errorMessage) {
				delete schema.errorMessage.pattern;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.allOf.push({
			pattern: stringifyRegExpWithFlags(regex, refs),
			...message && refs.errorMessages && { errorMessage: { pattern: message } }
		});
	} else setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
}
function stringifyRegExpWithFlags(regex, refs) {
	if (!refs.applyRegexFlags || !regex.flags) return regex.source;
	const flags = {
		i: regex.flags.includes("i"),
		m: regex.flags.includes("m"),
		s: regex.flags.includes("s")
	};
	const source = flags.i ? regex.source.toLowerCase() : regex.source;
	let pattern = "";
	let isEscaped = false;
	let inCharGroup = false;
	let inCharRange = false;
	for (let i = 0; i < source.length; i++) {
		if (isEscaped) {
			pattern += source[i];
			isEscaped = false;
			continue;
		}
		if (flags.i) {
			if (inCharGroup) {
				if (source[i].match(/[a-z]/)) {
					if (inCharRange) {
						pattern += source[i];
						pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
						inCharRange = false;
					} else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
						pattern += source[i];
						inCharRange = true;
					} else pattern += `${source[i]}${source[i].toUpperCase()}`;
					continue;
				}
			} else if (source[i].match(/[a-z]/)) {
				pattern += `[${source[i]}${source[i].toUpperCase()}]`;
				continue;
			}
		}
		if (flags.m) {
			if (source[i] === "^") {
				pattern += `(^|(?<=[\r\n]))`;
				continue;
			} else if (source[i] === "$") {
				pattern += `($|(?=[\r\n]))`;
				continue;
			}
		}
		if (flags.s && source[i] === ".") {
			pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
			continue;
		}
		pattern += source[i];
		if (source[i] === "\\") isEscaped = true;
		else if (inCharGroup && source[i] === "]") inCharGroup = false;
		else if (!inCharGroup && source[i] === "[") inCharGroup = true;
	}
	try {
		new RegExp(pattern);
	} catch {
		console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
		return regex.source;
	}
	return pattern;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/record.js
function parseRecordDef(def, refs) {
	if (refs.target === "openAi") console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
	if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		type: "object",
		required: def.keyType._def.values,
		properties: def.keyType._def.values.reduce((acc, key) => ({
			...acc,
			[key]: parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"properties",
					key
				]
			}) ?? parseAnyDef(refs)
		}), {}),
		additionalProperties: refs.rejectedAdditionalProperties
	};
	const schema = {
		type: "object",
		additionalProperties: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalProperties"]
		}) ?? refs.allowedAdditionalProperties
	};
	if (refs.target === "openApi3") return schema;
	if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
		const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
		return {
			...schema,
			propertyNames: keyType
		};
	} else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		...schema,
		propertyNames: { enum: def.keyType._def.values }
	};
	else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
		const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
		return {
			...schema,
			propertyNames: keyType
		};
	}
	return schema;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/map.js
function parseMapDef(def, refs) {
	if (refs.mapStrategy === "record") return parseRecordDef(def, refs);
	return {
		type: "array",
		maxItems: 125,
		items: {
			type: "array",
			items: [parseDef(def.keyType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"0"
				]
			}) || parseAnyDef(refs), parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"1"
				]
			}) || parseAnyDef(refs)],
			minItems: 2,
			maxItems: 2
		}
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
function parseNativeEnumDef(def) {
	const object = def.values;
	const actualValues = Object.keys(def.values).filter((key) => {
		return typeof object[object[key]] !== "number";
	}).map((key) => object[key]);
	const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
	return {
		type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
		enum: actualValues
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/never.js
function parseNeverDef(refs) {
	return refs.target === "openAi" ? void 0 : { not: parseAnyDef({
		...refs,
		currentPath: [...refs.currentPath, "not"]
	}) };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/null.js
function parseNullDef(refs) {
	return refs.target === "openApi3" ? {
		enum: ["null"],
		nullable: true
	} : { type: "null" };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/union.js
var primitiveMappings = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBigInt: "integer",
	ZodBoolean: "boolean",
	ZodNull: "null"
};
function parseUnionDef(def, refs) {
	if (refs.target === "openApi3") return asAnyOf(def, refs);
	const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
	if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
		const types = options.reduce((types, x) => {
			const type = primitiveMappings[x._def.typeName];
			return type && !types.includes(type) ? [...types, type] : types;
		}, []);
		return { type: types.length > 1 ? types : types[0] };
	} else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
		const types = options.reduce((acc, x) => {
			const type = typeof x._def.value;
			switch (type) {
				case "string":
				case "number":
				case "boolean": return [...acc, type];
				case "bigint": return [...acc, "integer"];
				case "object": if (x._def.value === null) return [...acc, "null"];
				default: return acc;
			}
		}, []);
		if (types.length === options.length) {
			const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
			return {
				type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
				enum: options.reduce((acc, x) => {
					return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
				}, [])
			};
		}
	} else if (options.every((x) => x._def.typeName === "ZodEnum")) return {
		type: "string",
		enum: options.reduce((acc, x) => [...acc, ...x._def.values.filter((x) => !acc.includes(x))], [])
	};
	return asAnyOf(def, refs);
}
var asAnyOf = (def, refs) => {
	const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			`${i}`
		]
	})).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
	return anyOf.length ? { anyOf } : void 0;
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
function parseNullableDef(def, refs) {
	if ([
		"ZodString",
		"ZodNumber",
		"ZodBigInt",
		"ZodBoolean",
		"ZodNull"
	].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
		if (refs.target === "openApi3") return {
			type: primitiveMappings[def.innerType._def.typeName],
			nullable: true
		};
		return { type: [primitiveMappings[def.innerType._def.typeName], "null"] };
	}
	if (refs.target === "openApi3") {
		const base = parseDef(def.innerType._def, {
			...refs,
			currentPath: [...refs.currentPath]
		});
		if (base && "$ref" in base) return {
			allOf: [base],
			nullable: true
		};
		return base && {
			...base,
			nullable: true
		};
	}
	const base = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"0"
		]
	});
	return base && { anyOf: [base, { type: "null" }] };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/number.js
function parseNumberDef(def, refs) {
	const res = { type: "number" };
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "int":
			res.type = "integer";
			addErrorMessage(res, "type", check.message, refs);
			break;
		case "min":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf": setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
	}
	return res;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/object.js
function parseObjectDef(def, refs) {
	const forceOptionalIntoNullable = refs.target === "openAi";
	const result = {
		type: "object",
		properties: {}
	};
	const required = [];
	const shape = def.shape();
	for (const propName in shape) {
		let propDef = shape[propName];
		if (propDef === void 0 || propDef._def === void 0) continue;
		let propOptional = safeIsOptional(propDef);
		if (propOptional && forceOptionalIntoNullable) {
			if (propDef._def.typeName === "ZodOptional") propDef = propDef._def.innerType;
			if (!propDef.isNullable()) propDef = propDef.nullable();
			propOptional = false;
		}
		const parsedDef = parseDef(propDef._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"properties",
				propName
			],
			propertyPath: [
				...refs.currentPath,
				"properties",
				propName
			]
		});
		if (parsedDef === void 0) continue;
		result.properties[propName] = parsedDef;
		if (!propOptional) required.push(propName);
	}
	if (required.length) result.required = required;
	const additionalProperties = decideAdditionalProperties(def, refs);
	if (additionalProperties !== void 0) result.additionalProperties = additionalProperties;
	return result;
}
function decideAdditionalProperties(def, refs) {
	if (def.catchall._def.typeName !== "ZodNever") return parseDef(def.catchall._def, {
		...refs,
		currentPath: [...refs.currentPath, "additionalProperties"]
	});
	switch (def.unknownKeys) {
		case "passthrough": return refs.allowedAdditionalProperties;
		case "strict": return refs.rejectedAdditionalProperties;
		case "strip": return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
	}
}
function safeIsOptional(schema) {
	try {
		return schema.isOptional();
	} catch {
		return true;
	}
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
var parseOptionalDef = (def, refs) => {
	if (refs.currentPath.toString() === refs.propertyPath?.toString()) return parseDef(def.innerType._def, refs);
	const innerSchema = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"1"
		]
	});
	return innerSchema ? { anyOf: [{ not: parseAnyDef(refs) }, innerSchema] } : parseAnyDef(refs);
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js
var parsePipelineDef = (def, refs) => {
	if (refs.pipeStrategy === "input") return parseDef(def.in._def, refs);
	else if (refs.pipeStrategy === "output") return parseDef(def.out._def, refs);
	const a = parseDef(def.in._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	});
	return { allOf: [a, parseDef(def.out._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			a ? "1" : "0"
		]
	})].filter((x) => x !== void 0) };
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
function parsePromiseDef(def, refs) {
	return parseDef(def.type._def, refs);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/set.js
function parseSetDef(def, refs) {
	const schema = {
		type: "array",
		uniqueItems: true,
		items: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "items"]
		})
	};
	if (def.minSize) setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
	if (def.maxSize) setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
	return schema;
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
function parseTupleDef(def, refs) {
	if (def.rest) return {
		type: "array",
		minItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
		additionalItems: parseDef(def.rest._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalItems"]
		})
	};
	else return {
		type: "array",
		minItems: def.items.length,
		maxItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
	};
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
function parseUndefinedDef(refs) {
	return { not: parseAnyDef(refs) };
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
function parseUnknownDef(refs) {
	return parseAnyDef(refs);
}
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
var parseReadonlyDef = (def, refs) => {
	return parseDef(def.innerType._def, refs);
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/selectParser.js
var selectParser = (def, typeName, refs) => {
	switch (typeName) {
		case ZodFirstPartyTypeKind.ZodString: return parseStringDef(def, refs);
		case ZodFirstPartyTypeKind.ZodNumber: return parseNumberDef(def, refs);
		case ZodFirstPartyTypeKind.ZodObject: return parseObjectDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBigInt: return parseBigintDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBoolean: return parseBooleanDef();
		case ZodFirstPartyTypeKind.ZodDate: return parseDateDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUndefined: return parseUndefinedDef(refs);
		case ZodFirstPartyTypeKind.ZodNull: return parseNullDef(refs);
		case ZodFirstPartyTypeKind.ZodArray: return parseArrayDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUnion:
		case ZodFirstPartyTypeKind.ZodDiscriminatedUnion: return parseUnionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodIntersection: return parseIntersectionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodTuple: return parseTupleDef(def, refs);
		case ZodFirstPartyTypeKind.ZodRecord: return parseRecordDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLiteral: return parseLiteralDef(def, refs);
		case ZodFirstPartyTypeKind.ZodEnum: return parseEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNativeEnum: return parseNativeEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNullable: return parseNullableDef(def, refs);
		case ZodFirstPartyTypeKind.ZodOptional: return parseOptionalDef(def, refs);
		case ZodFirstPartyTypeKind.ZodMap: return parseMapDef(def, refs);
		case ZodFirstPartyTypeKind.ZodSet: return parseSetDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLazy: return () => def.getter()._def;
		case ZodFirstPartyTypeKind.ZodPromise: return parsePromiseDef(def, refs);
		case ZodFirstPartyTypeKind.ZodNaN:
		case ZodFirstPartyTypeKind.ZodNever: return parseNeverDef(refs);
		case ZodFirstPartyTypeKind.ZodEffects: return parseEffectsDef(def, refs);
		case ZodFirstPartyTypeKind.ZodAny: return parseAnyDef(refs);
		case ZodFirstPartyTypeKind.ZodUnknown: return parseUnknownDef(refs);
		case ZodFirstPartyTypeKind.ZodDefault: return parseDefaultDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBranded: return parseBrandedDef(def, refs);
		case ZodFirstPartyTypeKind.ZodReadonly: return parseReadonlyDef(def, refs);
		case ZodFirstPartyTypeKind.ZodCatch: return parseCatchDef(def, refs);
		case ZodFirstPartyTypeKind.ZodPipeline: return parsePipelineDef(def, refs);
		case ZodFirstPartyTypeKind.ZodFunction:
		case ZodFirstPartyTypeKind.ZodVoid:
		case ZodFirstPartyTypeKind.ZodSymbol: return;
		default: return ((_) => void 0)(typeName);
	}
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/parseDef.js
function parseDef(def, refs, forceResolution = false) {
	const seenItem = refs.seen.get(def);
	if (refs.override) {
		const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
		if (overrideResult !== ignoreOverride) return overrideResult;
	}
	if (seenItem && !forceResolution) {
		const seenSchema = get$ref(seenItem, refs);
		if (seenSchema !== void 0) return seenSchema;
	}
	const newItem = {
		def,
		path: refs.currentPath,
		jsonSchema: void 0
	};
	refs.seen.set(def, newItem);
	const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
	const jsonSchema = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
	if (jsonSchema) addMeta(def, refs, jsonSchema);
	if (refs.postProcess) {
		const postProcessResult = refs.postProcess(jsonSchema, def, refs);
		newItem.jsonSchema = jsonSchema;
		return postProcessResult;
	}
	newItem.jsonSchema = jsonSchema;
	return jsonSchema;
}
var get$ref = (item, refs) => {
	switch (refs.$refStrategy) {
		case "root": return { $ref: item.path.join("/") };
		case "relative": return { $ref: getRelativePath(refs.currentPath, item.path) };
		case "none":
		case "seen":
			if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
				console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
				return parseAnyDef(refs);
			}
			return refs.$refStrategy === "seen" ? parseAnyDef(refs) : void 0;
	}
};
var addMeta = (def, refs, jsonSchema) => {
	if (def.description) {
		jsonSchema.description = def.description;
		if (refs.markdownDescription) jsonSchema.markdownDescription = def.description;
	}
	return jsonSchema;
};
//#endregion
//#region node_modules/.pnpm/zod-to-json-schema@3.25.2_zod@4.4.3/node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js
var zodToJsonSchema = (schema, options) => {
	const refs = getRefs(options);
	let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name, schema]) => ({
		...acc,
		[name]: parseDef(schema._def, {
			...refs,
			currentPath: [
				...refs.basePath,
				refs.definitionPath,
				name
			]
		}, true) ?? parseAnyDef(refs)
	}), {}) : void 0;
	const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
	const main = parseDef(schema._def, name === void 0 ? refs : {
		...refs,
		currentPath: [
			...refs.basePath,
			refs.definitionPath,
			name
		]
	}, false) ?? parseAnyDef(refs);
	const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
	if (title !== void 0) main.title = title;
	if (refs.flags.hasReferencedOpenAiAnyType) {
		if (!definitions) definitions = {};
		if (!definitions[refs.openAiAnyTypeName]) definitions[refs.openAiAnyTypeName] = {
			type: [
				"string",
				"number",
				"integer",
				"boolean",
				"array",
				"null"
			],
			items: { $ref: refs.$refStrategy === "relative" ? "1" : [
				...refs.basePath,
				refs.definitionPath,
				refs.openAiAnyTypeName
			].join("/") }
		};
	}
	const combined = name === void 0 ? definitions ? {
		...main,
		[refs.definitionPath]: definitions
	} : main : {
		$ref: [
			...refs.$refStrategy === "relative" ? [] : refs.basePath,
			refs.definitionPath,
			name
		].join("/"),
		[refs.definitionPath]: {
			...definitions,
			[name]: main
		}
	};
	if (refs.target === "jsonSchema7") combined.$schema = "http://json-schema.org/draft-07/schema#";
	else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
	if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
	return combined;
};
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js
function mapMiniTarget(t) {
	if (!t) return "draft-7";
	if (t === "jsonSchema7" || t === "draft-7") return "draft-7";
	if (t === "jsonSchema2019-09" || t === "draft-2020-12") return "draft-2020-12";
	return "draft-7";
}
function toJsonSchemaCompat(schema, opts) {
	if (isZ4Schema(schema)) return toJSONSchema(schema, {
		target: mapMiniTarget(opts?.target),
		io: opts?.pipeStrategy ?? "input"
	});
	return zodToJsonSchema(schema, {
		strictUnions: opts?.strictUnions ?? true,
		pipeStrategy: opts?.pipeStrategy ?? "input"
	});
}
function getMethodLiteral(schema) {
	const methodSchema = getObjectShape(schema)?.method;
	if (!methodSchema) throw new Error("Schema is missing a method literal");
	const value = getLiteralValue(methodSchema);
	if (typeof value !== "string") throw new Error("Schema method literal must be a string");
	return value;
}
function parseWithCompat(schema, data) {
	const result = safeParse(schema, data);
	if (!result.success) throw result.error;
	return result.data;
}
/**
* Implements MCP protocol framing on top of a pluggable transport, including
* features like request/response linking, notifications, and progress.
*/
var Protocol = class {
	constructor(_options) {
		this._options = _options;
		this._requestMessageId = 0;
		this._requestHandlers = /* @__PURE__ */ new Map();
		this._requestHandlerAbortControllers = /* @__PURE__ */ new Map();
		this._notificationHandlers = /* @__PURE__ */ new Map();
		this._responseHandlers = /* @__PURE__ */ new Map();
		this._progressHandlers = /* @__PURE__ */ new Map();
		this._timeoutInfo = /* @__PURE__ */ new Map();
		this._pendingDebouncedNotifications = /* @__PURE__ */ new Set();
		this._taskProgressTokens = /* @__PURE__ */ new Map();
		this._requestResolvers = /* @__PURE__ */ new Map();
		this.setNotificationHandler(CancelledNotificationSchema, (notification) => {
			this._oncancel(notification);
		});
		this.setNotificationHandler(ProgressNotificationSchema, (notification) => {
			this._onprogress(notification);
		});
		this.setRequestHandler(PingRequestSchema, (_request) => ({}));
		this._taskStore = _options?.taskStore;
		this._taskMessageQueue = _options?.taskMessageQueue;
		if (this._taskStore) {
			this.setRequestHandler(GetTaskRequestSchema, async (request, extra) => {
				const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
				if (!task) throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
				return { ...task };
			});
			this.setRequestHandler(GetTaskPayloadRequestSchema, async (request, extra) => {
				const handleTaskResult = async () => {
					const taskId = request.params.taskId;
					if (this._taskMessageQueue) {
						let queuedMessage;
						while (queuedMessage = await this._taskMessageQueue.dequeue(taskId, extra.sessionId)) {
							if (queuedMessage.type === "response" || queuedMessage.type === "error") {
								const message = queuedMessage.message;
								const requestId = message.id;
								const resolver = this._requestResolvers.get(requestId);
								if (resolver) {
									this._requestResolvers.delete(requestId);
									if (queuedMessage.type === "response") resolver(message);
									else {
										const errorMessage = message;
										resolver(new McpError(errorMessage.error.code, errorMessage.error.message, errorMessage.error.data));
									}
								} else {
									const messageType = queuedMessage.type === "response" ? "Response" : "Error";
									this._onerror(/* @__PURE__ */ new Error(`${messageType} handler missing for request ${requestId}`));
								}
								continue;
							}
							await this._transport?.send(queuedMessage.message, { relatedRequestId: extra.requestId });
						}
					}
					const task = await this._taskStore.getTask(taskId, extra.sessionId);
					if (!task) throw new McpError(ErrorCode.InvalidParams, `Task not found: ${taskId}`);
					if (!isTerminal(task.status)) {
						await this._waitForTaskUpdate(taskId, extra.signal);
						return await handleTaskResult();
					}
					if (isTerminal(task.status)) {
						const result = await this._taskStore.getTaskResult(taskId, extra.sessionId);
						this._clearTaskQueue(taskId);
						return {
							...result,
							_meta: {
								...result._meta,
								[RELATED_TASK_META_KEY]: { taskId }
							}
						};
					}
					return await handleTaskResult();
				};
				return await handleTaskResult();
			});
			this.setRequestHandler(ListTasksRequestSchema, async (request, extra) => {
				try {
					const { tasks, nextCursor } = await this._taskStore.listTasks(request.params?.cursor, extra.sessionId);
					return {
						tasks,
						nextCursor,
						_meta: {}
					};
				} catch (error) {
					throw new McpError(ErrorCode.InvalidParams, `Failed to list tasks: ${error instanceof Error ? error.message : String(error)}`);
				}
			});
			this.setRequestHandler(CancelTaskRequestSchema, async (request, extra) => {
				try {
					const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
					if (!task) throw new McpError(ErrorCode.InvalidParams, `Task not found: ${request.params.taskId}`);
					if (isTerminal(task.status)) throw new McpError(ErrorCode.InvalidParams, `Cannot cancel task in terminal status: ${task.status}`);
					await this._taskStore.updateTaskStatus(request.params.taskId, "cancelled", "Client cancelled task execution.", extra.sessionId);
					this._clearTaskQueue(request.params.taskId);
					const cancelledTask = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
					if (!cancelledTask) throw new McpError(ErrorCode.InvalidParams, `Task not found after cancellation: ${request.params.taskId}`);
					return {
						_meta: {},
						...cancelledTask
					};
				} catch (error) {
					if (error instanceof McpError) throw error;
					throw new McpError(ErrorCode.InvalidRequest, `Failed to cancel task: ${error instanceof Error ? error.message : String(error)}`);
				}
			});
		}
	}
	async _oncancel(notification) {
		if (!notification.params.requestId) return;
		this._requestHandlerAbortControllers.get(notification.params.requestId)?.abort(notification.params.reason);
	}
	_setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = false) {
		this._timeoutInfo.set(messageId, {
			timeoutId: setTimeout(onTimeout, timeout),
			startTime: Date.now(),
			timeout,
			maxTotalTimeout,
			resetTimeoutOnProgress,
			onTimeout
		});
	}
	_resetTimeout(messageId) {
		const info = this._timeoutInfo.get(messageId);
		if (!info) return false;
		const totalElapsed = Date.now() - info.startTime;
		if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout) {
			this._timeoutInfo.delete(messageId);
			throw McpError.fromError(ErrorCode.RequestTimeout, "Maximum total timeout exceeded", {
				maxTotalTimeout: info.maxTotalTimeout,
				totalElapsed
			});
		}
		clearTimeout(info.timeoutId);
		info.timeoutId = setTimeout(info.onTimeout, info.timeout);
		return true;
	}
	_cleanupTimeout(messageId) {
		const info = this._timeoutInfo.get(messageId);
		if (info) {
			clearTimeout(info.timeoutId);
			this._timeoutInfo.delete(messageId);
		}
	}
	/**
	* Attaches to the given transport, starts it, and starts listening for messages.
	*
	* The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
	*/
	async connect(transport) {
		if (this._transport) throw new Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
		this._transport = transport;
		const _onclose = this.transport?.onclose;
		this._transport.onclose = () => {
			_onclose?.();
			this._onclose();
		};
		const _onerror = this.transport?.onerror;
		this._transport.onerror = (error) => {
			_onerror?.(error);
			this._onerror(error);
		};
		const _onmessage = this._transport?.onmessage;
		this._transport.onmessage = (message, extra) => {
			_onmessage?.(message, extra);
			if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) this._onresponse(message);
			else if (isJSONRPCRequest(message)) this._onrequest(message, extra);
			else if (isJSONRPCNotification(message)) this._onnotification(message);
			else this._onerror(/* @__PURE__ */ new Error(`Unknown message type: ${JSON.stringify(message)}`));
		};
		await this._transport.start();
	}
	_onclose() {
		const responseHandlers = this._responseHandlers;
		this._responseHandlers = /* @__PURE__ */ new Map();
		this._progressHandlers.clear();
		this._taskProgressTokens.clear();
		this._pendingDebouncedNotifications.clear();
		for (const info of this._timeoutInfo.values()) clearTimeout(info.timeoutId);
		this._timeoutInfo.clear();
		for (const controller of this._requestHandlerAbortControllers.values()) controller.abort();
		this._requestHandlerAbortControllers.clear();
		const error = McpError.fromError(ErrorCode.ConnectionClosed, "Connection closed");
		this._transport = void 0;
		this.onclose?.();
		for (const handler of responseHandlers.values()) handler(error);
	}
	_onerror(error) {
		this.onerror?.(error);
	}
	_onnotification(notification) {
		const handler = this._notificationHandlers.get(notification.method) ?? this.fallbackNotificationHandler;
		if (handler === void 0) return;
		Promise.resolve().then(() => handler(notification)).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Uncaught error in notification handler: ${error}`)));
	}
	_onrequest(request, extra) {
		const handler = this._requestHandlers.get(request.method) ?? this.fallbackRequestHandler;
		const capturedTransport = this._transport;
		const relatedTaskId = request.params?._meta?.[RELATED_TASK_META_KEY]?.taskId;
		if (handler === void 0) {
			const errorResponse = {
				jsonrpc: "2.0",
				id: request.id,
				error: {
					code: ErrorCode.MethodNotFound,
					message: "Method not found"
				}
			};
			if (relatedTaskId && this._taskMessageQueue) this._enqueueTaskMessage(relatedTaskId, {
				type: "error",
				message: errorResponse,
				timestamp: Date.now()
			}, capturedTransport?.sessionId).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to enqueue error response: ${error}`)));
			else capturedTransport?.send(errorResponse).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send an error response: ${error}`)));
			return;
		}
		const abortController = new AbortController();
		this._requestHandlerAbortControllers.set(request.id, abortController);
		const taskCreationParams = isTaskAugmentedRequestParams(request.params) ? request.params.task : void 0;
		const taskStore = this._taskStore ? this.requestTaskStore(request, capturedTransport?.sessionId) : void 0;
		const fullExtra = {
			signal: abortController.signal,
			sessionId: capturedTransport?.sessionId,
			_meta: request.params?._meta,
			sendNotification: async (notification) => {
				if (abortController.signal.aborted) return;
				const notificationOptions = { relatedRequestId: request.id };
				if (relatedTaskId) notificationOptions.relatedTask = { taskId: relatedTaskId };
				await this.notification(notification, notificationOptions);
			},
			sendRequest: async (r, resultSchema, options) => {
				if (abortController.signal.aborted) throw new McpError(ErrorCode.ConnectionClosed, "Request was cancelled");
				const requestOptions = {
					...options,
					relatedRequestId: request.id
				};
				if (relatedTaskId && !requestOptions.relatedTask) requestOptions.relatedTask = { taskId: relatedTaskId };
				const effectiveTaskId = requestOptions.relatedTask?.taskId ?? relatedTaskId;
				if (effectiveTaskId && taskStore) await taskStore.updateTaskStatus(effectiveTaskId, "input_required");
				return await this.request(r, resultSchema, requestOptions);
			},
			authInfo: extra?.authInfo,
			requestId: request.id,
			requestInfo: extra?.requestInfo,
			taskId: relatedTaskId,
			taskStore,
			taskRequestedTtl: taskCreationParams?.ttl,
			closeSSEStream: extra?.closeSSEStream,
			closeStandaloneSSEStream: extra?.closeStandaloneSSEStream
		};
		Promise.resolve().then(() => {
			if (taskCreationParams) this.assertTaskHandlerCapability(request.method);
		}).then(() => handler(request, fullExtra)).then(async (result) => {
			if (abortController.signal.aborted) return;
			const response = {
				result,
				jsonrpc: "2.0",
				id: request.id
			};
			if (relatedTaskId && this._taskMessageQueue) await this._enqueueTaskMessage(relatedTaskId, {
				type: "response",
				message: response,
				timestamp: Date.now()
			}, capturedTransport?.sessionId);
			else await capturedTransport?.send(response);
		}, async (error) => {
			if (abortController.signal.aborted) return;
			const errorResponse = {
				jsonrpc: "2.0",
				id: request.id,
				error: {
					code: Number.isSafeInteger(error["code"]) ? error["code"] : ErrorCode.InternalError,
					message: error.message ?? "Internal error",
					...error["data"] !== void 0 && { data: error["data"] }
				}
			};
			if (relatedTaskId && this._taskMessageQueue) await this._enqueueTaskMessage(relatedTaskId, {
				type: "error",
				message: errorResponse,
				timestamp: Date.now()
			}, capturedTransport?.sessionId);
			else await capturedTransport?.send(errorResponse);
		}).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send response: ${error}`))).finally(() => {
			if (this._requestHandlerAbortControllers.get(request.id) === abortController) this._requestHandlerAbortControllers.delete(request.id);
		});
	}
	_onprogress(notification) {
		const { progressToken, ...params } = notification.params;
		const messageId = Number(progressToken);
		const handler = this._progressHandlers.get(messageId);
		if (!handler) {
			this._onerror(/* @__PURE__ */ new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
			return;
		}
		const responseHandler = this._responseHandlers.get(messageId);
		const timeoutInfo = this._timeoutInfo.get(messageId);
		if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress) try {
			this._resetTimeout(messageId);
		} catch (error) {
			this._responseHandlers.delete(messageId);
			this._progressHandlers.delete(messageId);
			this._cleanupTimeout(messageId);
			responseHandler(error);
			return;
		}
		handler(params);
	}
	_onresponse(response) {
		const messageId = Number(response.id);
		const resolver = this._requestResolvers.get(messageId);
		if (resolver) {
			this._requestResolvers.delete(messageId);
			if (isJSONRPCResultResponse(response)) resolver(response);
			else resolver(new McpError(response.error.code, response.error.message, response.error.data));
			return;
		}
		const handler = this._responseHandlers.get(messageId);
		if (handler === void 0) {
			this._onerror(/* @__PURE__ */ new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
			return;
		}
		this._responseHandlers.delete(messageId);
		this._cleanupTimeout(messageId);
		let isTaskResponse = false;
		if (isJSONRPCResultResponse(response) && response.result && typeof response.result === "object") {
			const result = response.result;
			if (result.task && typeof result.task === "object") {
				const task = result.task;
				if (typeof task.taskId === "string") {
					isTaskResponse = true;
					this._taskProgressTokens.set(task.taskId, messageId);
				}
			}
		}
		if (!isTaskResponse) this._progressHandlers.delete(messageId);
		if (isJSONRPCResultResponse(response)) handler(response);
		else handler(McpError.fromError(response.error.code, response.error.message, response.error.data));
	}
	get transport() {
		return this._transport;
	}
	/**
	* Closes the connection.
	*/
	async close() {
		await this._transport?.close();
	}
	/**
	* Sends a request and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* @example
	* ```typescript
	* const stream = protocol.requestStream(request, resultSchema, options);
	* for await (const message of stream) {
	*   switch (message.type) {
	*     case 'taskCreated':
	*       console.log('Task created:', message.task.taskId);
	*       break;
	*     case 'taskStatus':
	*       console.log('Task status:', message.task.status);
	*       break;
	*     case 'result':
	*       console.log('Final result:', message.result);
	*       break;
	*     case 'error':
	*       console.error('Error:', message.error);
	*       break;
	*   }
	* }
	* ```
	*
	* @experimental Use `client.experimental.tasks.requestStream()` to access this method.
	*/
	async *requestStream(request, resultSchema, options) {
		const { task } = options ?? {};
		if (!task) {
			try {
				yield {
					type: "result",
					result: await this.request(request, resultSchema, options)
				};
			} catch (error) {
				yield {
					type: "error",
					error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
				};
			}
			return;
		}
		let taskId;
		try {
			const createResult = await this.request(request, CreateTaskResultSchema, options);
			if (createResult.task) {
				taskId = createResult.task.taskId;
				yield {
					type: "taskCreated",
					task: createResult.task
				};
			} else throw new McpError(ErrorCode.InternalError, "Task creation did not return a task");
			while (true) {
				const task = await this.getTask({ taskId }, options);
				yield {
					type: "taskStatus",
					task
				};
				if (isTerminal(task.status)) {
					if (task.status === "completed") yield {
						type: "result",
						result: await this.getTaskResult({ taskId }, resultSchema, options)
					};
					else if (task.status === "failed") yield {
						type: "error",
						error: new McpError(ErrorCode.InternalError, `Task ${taskId} failed`)
					};
					else if (task.status === "cancelled") yield {
						type: "error",
						error: new McpError(ErrorCode.InternalError, `Task ${taskId} was cancelled`)
					};
					return;
				}
				if (task.status === "input_required") {
					yield {
						type: "result",
						result: await this.getTaskResult({ taskId }, resultSchema, options)
					};
					return;
				}
				const pollInterval = task.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1e3;
				await new Promise((resolve) => setTimeout(resolve, pollInterval));
				options?.signal?.throwIfAborted();
			}
		} catch (error) {
			yield {
				type: "error",
				error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
			};
		}
	}
	/**
	* Sends a request and waits for a response.
	*
	* Do not use this method to emit notifications! Use notification() instead.
	*/
	request(request, resultSchema, options) {
		const { relatedRequestId, resumptionToken, onresumptiontoken, task, relatedTask } = options ?? {};
		return new Promise((resolve, reject) => {
			const earlyReject = (error) => {
				reject(error);
			};
			if (!this._transport) {
				earlyReject(/* @__PURE__ */ new Error("Not connected"));
				return;
			}
			if (this._options?.enforceStrictCapabilities === true) try {
				this.assertCapabilityForMethod(request.method);
				if (task) this.assertTaskCapability(request.method);
			} catch (e) {
				earlyReject(e);
				return;
			}
			options?.signal?.throwIfAborted();
			const messageId = this._requestMessageId++;
			const jsonrpcRequest = {
				...request,
				jsonrpc: "2.0",
				id: messageId
			};
			if (options?.onprogress) {
				this._progressHandlers.set(messageId, options.onprogress);
				jsonrpcRequest.params = {
					...request.params,
					_meta: {
						...request.params?._meta || {},
						progressToken: messageId
					}
				};
			}
			if (task) jsonrpcRequest.params = {
				...jsonrpcRequest.params,
				task
			};
			if (relatedTask) jsonrpcRequest.params = {
				...jsonrpcRequest.params,
				_meta: {
					...jsonrpcRequest.params?._meta || {},
					[RELATED_TASK_META_KEY]: relatedTask
				}
			};
			const cancel = (reason) => {
				this._responseHandlers.delete(messageId);
				this._progressHandlers.delete(messageId);
				this._cleanupTimeout(messageId);
				this._transport?.send({
					jsonrpc: "2.0",
					method: "notifications/cancelled",
					params: {
						requestId: messageId,
						reason: String(reason)
					}
				}, {
					relatedRequestId,
					resumptionToken,
					onresumptiontoken
				}).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send cancellation: ${error}`)));
				reject(reason instanceof McpError ? reason : new McpError(ErrorCode.RequestTimeout, String(reason)));
			};
			this._responseHandlers.set(messageId, (response) => {
				if (options?.signal?.aborted) return;
				if (response instanceof Error) return reject(response);
				try {
					const parseResult = safeParse(resultSchema, response.result);
					if (!parseResult.success) reject(parseResult.error);
					else resolve(parseResult.data);
				} catch (error) {
					reject(error);
				}
			});
			options?.signal?.addEventListener("abort", () => {
				cancel(options?.signal?.reason);
			});
			const timeout = options?.timeout ?? 6e4;
			const timeoutHandler = () => cancel(McpError.fromError(ErrorCode.RequestTimeout, "Request timed out", { timeout }));
			this._setupTimeout(messageId, timeout, options?.maxTotalTimeout, timeoutHandler, options?.resetTimeoutOnProgress ?? false);
			const relatedTaskId = relatedTask?.taskId;
			if (relatedTaskId) {
				const responseResolver = (response) => {
					const handler = this._responseHandlers.get(messageId);
					if (handler) handler(response);
					else this._onerror(/* @__PURE__ */ new Error(`Response handler missing for side-channeled request ${messageId}`));
				};
				this._requestResolvers.set(messageId, responseResolver);
				this._enqueueTaskMessage(relatedTaskId, {
					type: "request",
					message: jsonrpcRequest,
					timestamp: Date.now()
				}).catch((error) => {
					this._cleanupTimeout(messageId);
					reject(error);
				});
			} else this._transport.send(jsonrpcRequest, {
				relatedRequestId,
				resumptionToken,
				onresumptiontoken
			}).catch((error) => {
				this._cleanupTimeout(messageId);
				reject(error);
			});
		});
	}
	/**
	* Gets the current status of a task.
	*
	* @experimental Use `client.experimental.tasks.getTask()` to access this method.
	*/
	async getTask(params, options) {
		return this.request({
			method: "tasks/get",
			params
		}, GetTaskResultSchema, options);
	}
	/**
	* Retrieves the result of a completed task.
	*
	* @experimental Use `client.experimental.tasks.getTaskResult()` to access this method.
	*/
	async getTaskResult(params, resultSchema, options) {
		return this.request({
			method: "tasks/result",
			params
		}, resultSchema, options);
	}
	/**
	* Lists tasks, optionally starting from a pagination cursor.
	*
	* @experimental Use `client.experimental.tasks.listTasks()` to access this method.
	*/
	async listTasks(params, options) {
		return this.request({
			method: "tasks/list",
			params
		}, ListTasksResultSchema, options);
	}
	/**
	* Cancels a specific task.
	*
	* @experimental Use `client.experimental.tasks.cancelTask()` to access this method.
	*/
	async cancelTask(params, options) {
		return this.request({
			method: "tasks/cancel",
			params
		}, CancelTaskResultSchema, options);
	}
	/**
	* Emits a notification, which is a one-way message that does not expect a response.
	*/
	async notification(notification, options) {
		if (!this._transport) throw new Error("Not connected");
		this.assertNotificationCapability(notification.method);
		const relatedTaskId = options?.relatedTask?.taskId;
		if (relatedTaskId) {
			const jsonrpcNotification = {
				...notification,
				jsonrpc: "2.0",
				params: {
					...notification.params,
					_meta: {
						...notification.params?._meta || {},
						[RELATED_TASK_META_KEY]: options.relatedTask
					}
				}
			};
			await this._enqueueTaskMessage(relatedTaskId, {
				type: "notification",
				message: jsonrpcNotification,
				timestamp: Date.now()
			});
			return;
		}
		if ((this._options?.debouncedNotificationMethods ?? []).includes(notification.method) && !notification.params && !options?.relatedRequestId && !options?.relatedTask) {
			if (this._pendingDebouncedNotifications.has(notification.method)) return;
			this._pendingDebouncedNotifications.add(notification.method);
			Promise.resolve().then(() => {
				this._pendingDebouncedNotifications.delete(notification.method);
				if (!this._transport) return;
				let jsonrpcNotification = {
					...notification,
					jsonrpc: "2.0"
				};
				if (options?.relatedTask) jsonrpcNotification = {
					...jsonrpcNotification,
					params: {
						...jsonrpcNotification.params,
						_meta: {
							...jsonrpcNotification.params?._meta || {},
							[RELATED_TASK_META_KEY]: options.relatedTask
						}
					}
				};
				this._transport?.send(jsonrpcNotification, options).catch((error) => this._onerror(error));
			});
			return;
		}
		let jsonrpcNotification = {
			...notification,
			jsonrpc: "2.0"
		};
		if (options?.relatedTask) jsonrpcNotification = {
			...jsonrpcNotification,
			params: {
				...jsonrpcNotification.params,
				_meta: {
					...jsonrpcNotification.params?._meta || {},
					[RELATED_TASK_META_KEY]: options.relatedTask
				}
			}
		};
		await this._transport.send(jsonrpcNotification, options);
	}
	/**
	* Registers a handler to invoke when this protocol object receives a request with the given method.
	*
	* Note that this will replace any previous request handler for the same method.
	*/
	setRequestHandler(requestSchema, handler) {
		const method = getMethodLiteral(requestSchema);
		this.assertRequestHandlerCapability(method);
		this._requestHandlers.set(method, (request, extra) => {
			const parsed = parseWithCompat(requestSchema, request);
			return Promise.resolve(handler(parsed, extra));
		});
	}
	/**
	* Removes the request handler for the given method.
	*/
	removeRequestHandler(method) {
		this._requestHandlers.delete(method);
	}
	/**
	* Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
	*/
	assertCanSetRequestHandler(method) {
		if (this._requestHandlers.has(method)) throw new Error(`A request handler for ${method} already exists, which would be overridden`);
	}
	/**
	* Registers a handler to invoke when this protocol object receives a notification with the given method.
	*
	* Note that this will replace any previous notification handler for the same method.
	*/
	setNotificationHandler(notificationSchema, handler) {
		const method = getMethodLiteral(notificationSchema);
		this._notificationHandlers.set(method, (notification) => {
			const parsed = parseWithCompat(notificationSchema, notification);
			return Promise.resolve(handler(parsed));
		});
	}
	/**
	* Removes the notification handler for the given method.
	*/
	removeNotificationHandler(method) {
		this._notificationHandlers.delete(method);
	}
	/**
	* Cleans up the progress handler associated with a task.
	* This should be called when a task reaches a terminal status.
	*/
	_cleanupTaskProgressHandler(taskId) {
		const progressToken = this._taskProgressTokens.get(taskId);
		if (progressToken !== void 0) {
			this._progressHandlers.delete(progressToken);
			this._taskProgressTokens.delete(taskId);
		}
	}
	/**
	* Enqueues a task-related message for side-channel delivery via tasks/result.
	* @param taskId The task ID to associate the message with
	* @param message The message to enqueue
	* @param sessionId Optional session ID for binding the operation to a specific session
	* @throws Error if taskStore is not configured or if enqueue fails (e.g., queue overflow)
	*
	* Note: If enqueue fails, it's the TaskMessageQueue implementation's responsibility to handle
	* the error appropriately (e.g., by failing the task, logging, etc.). The Protocol layer
	* simply propagates the error.
	*/
	async _enqueueTaskMessage(taskId, message, sessionId) {
		if (!this._taskStore || !this._taskMessageQueue) throw new Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
		const maxQueueSize = this._options?.maxTaskQueueSize;
		await this._taskMessageQueue.enqueue(taskId, message, sessionId, maxQueueSize);
	}
	/**
	* Clears the message queue for a task and rejects any pending request resolvers.
	* @param taskId The task ID whose queue should be cleared
	* @param sessionId Optional session ID for binding the operation to a specific session
	*/
	async _clearTaskQueue(taskId, sessionId) {
		if (this._taskMessageQueue) {
			const messages = await this._taskMessageQueue.dequeueAll(taskId, sessionId);
			for (const message of messages) if (message.type === "request" && isJSONRPCRequest(message.message)) {
				const requestId = message.message.id;
				const resolver = this._requestResolvers.get(requestId);
				if (resolver) {
					resolver(new McpError(ErrorCode.InternalError, "Task cancelled or completed"));
					this._requestResolvers.delete(requestId);
				} else this._onerror(/* @__PURE__ */ new Error(`Resolver missing for request ${requestId} during task ${taskId} cleanup`));
			}
		}
	}
	/**
	* Waits for a task update (new messages or status change) with abort signal support.
	* Uses polling to check for updates at the task's configured poll interval.
	* @param taskId The task ID to wait for
	* @param signal Abort signal to cancel the wait
	* @returns Promise that resolves when an update occurs or rejects if aborted
	*/
	async _waitForTaskUpdate(taskId, signal) {
		let interval = this._options?.defaultTaskPollInterval ?? 1e3;
		try {
			const task = await this._taskStore?.getTask(taskId);
			if (task?.pollInterval) interval = task.pollInterval;
		} catch {}
		return new Promise((resolve, reject) => {
			if (signal.aborted) {
				reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
				return;
			}
			const timeoutId = setTimeout(resolve, interval);
			signal.addEventListener("abort", () => {
				clearTimeout(timeoutId);
				reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
			}, { once: true });
		});
	}
	requestTaskStore(request, sessionId) {
		const taskStore = this._taskStore;
		if (!taskStore) throw new Error("No task store configured");
		return {
			createTask: async (taskParams) => {
				if (!request) throw new Error("No request provided");
				return await taskStore.createTask(taskParams, request.id, {
					method: request.method,
					params: request.params
				}, sessionId);
			},
			getTask: async (taskId) => {
				const task = await taskStore.getTask(taskId, sessionId);
				if (!task) throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
				return task;
			},
			storeTaskResult: async (taskId, status, result) => {
				await taskStore.storeTaskResult(taskId, status, result, sessionId);
				const task = await taskStore.getTask(taskId, sessionId);
				if (task) {
					const notification = TaskStatusNotificationSchema.parse({
						method: "notifications/tasks/status",
						params: task
					});
					await this.notification(notification);
					if (isTerminal(task.status)) this._cleanupTaskProgressHandler(taskId);
				}
			},
			getTaskResult: (taskId) => {
				return taskStore.getTaskResult(taskId, sessionId);
			},
			updateTaskStatus: async (taskId, status, statusMessage) => {
				const task = await taskStore.getTask(taskId, sessionId);
				if (!task) throw new McpError(ErrorCode.InvalidParams, `Task "${taskId}" not found - it may have been cleaned up`);
				if (isTerminal(task.status)) throw new McpError(ErrorCode.InvalidParams, `Cannot update task "${taskId}" from terminal status "${task.status}" to "${status}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
				await taskStore.updateTaskStatus(taskId, status, statusMessage, sessionId);
				const updatedTask = await taskStore.getTask(taskId, sessionId);
				if (updatedTask) {
					const notification = TaskStatusNotificationSchema.parse({
						method: "notifications/tasks/status",
						params: updatedTask
					});
					await this.notification(notification);
					if (isTerminal(updatedTask.status)) this._cleanupTaskProgressHandler(taskId);
				}
			},
			listTasks: (cursor) => {
				return taskStore.listTasks(cursor, sessionId);
			}
		};
	}
};
function isPlainObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function mergeCapabilities(base, additional) {
	const result = { ...base };
	for (const key in additional) {
		const k = key;
		const addValue = additional[k];
		if (addValue === void 0) continue;
		const baseValue = result[k];
		if (isPlainObject(baseValue) && isPlainObject(addValue)) result[k] = {
			...baseValue,
			...addValue
		};
		else result[k] = addValue;
	}
	return result;
}
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/code.js
var require_code$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
	var _CodeOrName = class {};
	exports._CodeOrName = _CodeOrName;
	exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
	var Name = class extends _CodeOrName {
		constructor(s) {
			super();
			if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
			this.str = s;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			return false;
		}
		get names() {
			return { [this.str]: 1 };
		}
	};
	exports.Name = Name;
	var _Code = class extends _CodeOrName {
		constructor(code) {
			super();
			this._items = typeof code === "string" ? [code] : code;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			if (this._items.length > 1) return false;
			const item = this._items[0];
			return item === "" || item === "\"\"";
		}
		get str() {
			var _a;
			return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
		}
		get names() {
			var _a;
			return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
				if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
				return names;
			}, {});
		}
	};
	exports._Code = _Code;
	exports.nil = new _Code("");
	function _(strs, ...args) {
		const code = [strs[0]];
		let i = 0;
		while (i < args.length) {
			addCodeArg(code, args[i]);
			code.push(strs[++i]);
		}
		return new _Code(code);
	}
	exports._ = _;
	var plus = new _Code("+");
	function str(strs, ...args) {
		const expr = [safeStringify(strs[0])];
		let i = 0;
		while (i < args.length) {
			expr.push(plus);
			addCodeArg(expr, args[i]);
			expr.push(plus, safeStringify(strs[++i]));
		}
		optimize(expr);
		return new _Code(expr);
	}
	exports.str = str;
	function addCodeArg(code, arg) {
		if (arg instanceof _Code) code.push(...arg._items);
		else if (arg instanceof Name) code.push(arg);
		else code.push(interpolate(arg));
	}
	exports.addCodeArg = addCodeArg;
	function optimize(expr) {
		let i = 1;
		while (i < expr.length - 1) {
			if (expr[i] === plus) {
				const res = mergeExprItems(expr[i - 1], expr[i + 1]);
				if (res !== void 0) {
					expr.splice(i - 1, 3, res);
					continue;
				}
				expr[i++] = "+";
			}
			i++;
		}
	}
	function mergeExprItems(a, b) {
		if (b === "\"\"") return a;
		if (a === "\"\"") return b;
		if (typeof a == "string") {
			if (b instanceof Name || a[a.length - 1] !== "\"") return;
			if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
			if (b[0] === "\"") return a.slice(0, -1) + b.slice(1);
			return;
		}
		if (typeof b == "string" && b[0] === "\"" && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
	}
	function strConcat(c1, c2) {
		return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
	}
	exports.strConcat = strConcat;
	function interpolate(x) {
		return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
	}
	function stringify(x) {
		return new _Code(safeStringify(x));
	}
	exports.stringify = stringify;
	function safeStringify(x) {
		return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}
	exports.safeStringify = safeStringify;
	function getProperty(key) {
		return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
	}
	exports.getProperty = getProperty;
	function getEsmExportName(key) {
		if (typeof key == "string" && exports.IDENTIFIER.test(key)) return new _Code(`${key}`);
		throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
	}
	exports.getEsmExportName = getEsmExportName;
	function regexpCode(rx) {
		return new _Code(rx.toString());
	}
	exports.regexpCode = regexpCode;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
	var code_1 = require_code$1();
	var ValueError = class extends Error {
		constructor(name) {
			super(`CodeGen: "code" for ${name} not defined`);
			this.value = name.value;
		}
	};
	var UsedValueState;
	(function(UsedValueState) {
		UsedValueState[UsedValueState["Started"] = 0] = "Started";
		UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
	})(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
	exports.varKinds = {
		const: new code_1.Name("const"),
		let: new code_1.Name("let"),
		var: new code_1.Name("var")
	};
	var Scope = class {
		constructor({ prefixes, parent } = {}) {
			this._names = {};
			this._prefixes = prefixes;
			this._parent = parent;
		}
		toName(nameOrPrefix) {
			return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		}
		name(prefix) {
			return new code_1.Name(this._newName(prefix));
		}
		_newName(prefix) {
			const ng = this._names[prefix] || this._nameGroup(prefix);
			return `${prefix}${ng.index++}`;
		}
		_nameGroup(prefix) {
			var _a, _b;
			if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
			return this._names[prefix] = {
				prefix,
				index: 0
			};
		}
	};
	exports.Scope = Scope;
	var ValueScopeName = class extends code_1.Name {
		constructor(prefix, nameStr) {
			super(nameStr);
			this.prefix = prefix;
		}
		setValue(value, { property, itemIndex }) {
			this.value = value;
			this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
		}
	};
	exports.ValueScopeName = ValueScopeName;
	var line = (0, code_1._)`\n`;
	var ValueScope = class extends Scope {
		constructor(opts) {
			super(opts);
			this._values = {};
			this._scope = opts.scope;
			this.opts = {
				...opts,
				_n: opts.lines ? line : code_1.nil
			};
		}
		get() {
			return this._scope;
		}
		name(prefix) {
			return new ValueScopeName(prefix, this._newName(prefix));
		}
		value(nameOrPrefix, value) {
			var _a;
			if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
			const name = this.toName(nameOrPrefix);
			const { prefix } = name;
			const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
			let vs = this._values[prefix];
			if (vs) {
				const _name = vs.get(valueKey);
				if (_name) return _name;
			} else vs = this._values[prefix] = /* @__PURE__ */ new Map();
			vs.set(valueKey, name);
			const s = this._scope[prefix] || (this._scope[prefix] = []);
			const itemIndex = s.length;
			s[itemIndex] = value.ref;
			name.setValue(value, {
				property: prefix,
				itemIndex
			});
			return name;
		}
		getValue(prefix, keyOrRef) {
			const vs = this._values[prefix];
			if (!vs) return;
			return vs.get(keyOrRef);
		}
		scopeRefs(scopeName, values = this._values) {
			return this._reduceValues(values, (name) => {
				if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return (0, code_1._)`${scopeName}${name.scopePath}`;
			});
		}
		scopeCode(values = this._values, usedValues, getCode) {
			return this._reduceValues(values, (name) => {
				if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return name.value.code;
			}, usedValues, getCode);
		}
		_reduceValues(values, valueCode, usedValues = {}, getCode) {
			let code = code_1.nil;
			for (const prefix in values) {
				const vs = values[prefix];
				if (!vs) continue;
				const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
				vs.forEach((name) => {
					if (nameSet.has(name)) return;
					nameSet.set(name, UsedValueState.Started);
					let c = valueCode(name);
					if (c) {
						const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
						code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
					} else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) code = (0, code_1._)`${code}${c}${this.opts._n}`;
					else throw new ValueError(name);
					nameSet.set(name, UsedValueState.Completed);
				});
			}
			return code;
		}
	};
	exports.ValueScope = ValueScope;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
	var code_1 = require_code$1();
	var scope_1 = require_scope();
	var code_2 = require_code$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return code_2._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return code_2.str;
		}
	});
	Object.defineProperty(exports, "strConcat", {
		enumerable: true,
		get: function() {
			return code_2.strConcat;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return code_2.nil;
		}
	});
	Object.defineProperty(exports, "getProperty", {
		enumerable: true,
		get: function() {
			return code_2.getProperty;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return code_2.stringify;
		}
	});
	Object.defineProperty(exports, "regexpCode", {
		enumerable: true,
		get: function() {
			return code_2.regexpCode;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return code_2.Name;
		}
	});
	var scope_2 = require_scope();
	Object.defineProperty(exports, "Scope", {
		enumerable: true,
		get: function() {
			return scope_2.Scope;
		}
	});
	Object.defineProperty(exports, "ValueScope", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScope;
		}
	});
	Object.defineProperty(exports, "ValueScopeName", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScopeName;
		}
	});
	Object.defineProperty(exports, "varKinds", {
		enumerable: true,
		get: function() {
			return scope_2.varKinds;
		}
	});
	exports.operators = {
		GT: new code_1._Code(">"),
		GTE: new code_1._Code(">="),
		LT: new code_1._Code("<"),
		LTE: new code_1._Code("<="),
		EQ: new code_1._Code("==="),
		NEQ: new code_1._Code("!=="),
		NOT: new code_1._Code("!"),
		OR: new code_1._Code("||"),
		AND: new code_1._Code("&&"),
		ADD: new code_1._Code("+")
	};
	var Node = class {
		optimizeNodes() {
			return this;
		}
		optimizeNames(_names, _constants) {
			return this;
		}
	};
	var Def = class extends Node {
		constructor(varKind, name, rhs) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.rhs = rhs;
		}
		render({ es5, _n }) {
			const varKind = es5 ? scope_1.varKinds.var : this.varKind;
			const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
			return `${varKind} ${this.name}${rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (!names[this.name.str]) return;
			if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		}
	};
	var Assign = class extends Node {
		constructor(lhs, rhs, sideEffects) {
			super();
			this.lhs = lhs;
			this.rhs = rhs;
			this.sideEffects = sideEffects;
		}
		render({ _n }) {
			return `${this.lhs} = ${this.rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
			this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return addExprNames(this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }, this.rhs);
		}
	};
	var AssignOp = class extends Assign {
		constructor(lhs, op, rhs, sideEffects) {
			super(lhs, rhs, sideEffects);
			this.op = op;
		}
		render({ _n }) {
			return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		}
	};
	var Label = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `${this.label}:` + _n;
		}
	};
	var Break = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `break${this.label ? ` ${this.label}` : ""};` + _n;
		}
	};
	var Throw = class extends Node {
		constructor(error) {
			super();
			this.error = error;
		}
		render({ _n }) {
			return `throw ${this.error};` + _n;
		}
		get names() {
			return this.error.names;
		}
	};
	var AnyCode = class extends Node {
		constructor(code) {
			super();
			this.code = code;
		}
		render({ _n }) {
			return `${this.code};` + _n;
		}
		optimizeNodes() {
			return `${this.code}` ? this : void 0;
		}
		optimizeNames(names, constants) {
			this.code = optimizeExpr(this.code, names, constants);
			return this;
		}
		get names() {
			return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		}
	};
	var ParentNode = class extends Node {
		constructor(nodes = []) {
			super();
			this.nodes = nodes;
		}
		render(opts) {
			return this.nodes.reduce((code, n) => code + n.render(opts), "");
		}
		optimizeNodes() {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i].optimizeNodes();
				if (Array.isArray(n)) nodes.splice(i, 1, ...n);
				else if (n) nodes[i] = n;
				else nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		optimizeNames(names, constants) {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i];
				if (n.optimizeNames(names, constants)) continue;
				subtractNames(names, n.names);
				nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		get names() {
			return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		}
	};
	var BlockNode = class extends ParentNode {
		render(opts) {
			return "{" + opts._n + super.render(opts) + "}" + opts._n;
		}
	};
	var Root = class extends ParentNode {};
	var Else = class extends BlockNode {};
	Else.kind = "else";
	var If = class If extends BlockNode {
		constructor(condition, nodes) {
			super(nodes);
			this.condition = condition;
		}
		render(opts) {
			let code = `if(${this.condition})` + super.render(opts);
			if (this.else) code += "else " + this.else.render(opts);
			return code;
		}
		optimizeNodes() {
			super.optimizeNodes();
			const cond = this.condition;
			if (cond === true) return this.nodes;
			let e = this.else;
			if (e) {
				const ns = e.optimizeNodes();
				e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
			}
			if (e) {
				if (cond === false) return e instanceof If ? e : e.nodes;
				if (this.nodes.length) return this;
				return new If(not(cond), e instanceof If ? [e] : e.nodes);
			}
			if (cond === false || !this.nodes.length) return void 0;
			return this;
		}
		optimizeNames(names, constants) {
			var _a;
			this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
			if (!(super.optimizeNames(names, constants) || this.else)) return;
			this.condition = optimizeExpr(this.condition, names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			addExprNames(names, this.condition);
			if (this.else) addNames(names, this.else.names);
			return names;
		}
	};
	If.kind = "if";
	var For = class extends BlockNode {};
	For.kind = "for";
	var ForLoop = class extends For {
		constructor(iteration) {
			super();
			this.iteration = iteration;
		}
		render(opts) {
			return `for(${this.iteration})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iteration = optimizeExpr(this.iteration, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iteration.names);
		}
	};
	var ForRange = class extends For {
		constructor(varKind, name, from, to) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.from = from;
			this.to = to;
		}
		render(opts) {
			const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
			const { name, from, to } = this;
			return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		}
		get names() {
			return addExprNames(addExprNames(super.names, this.from), this.to);
		}
	};
	var ForIter = class extends For {
		constructor(loop, varKind, name, iterable) {
			super();
			this.loop = loop;
			this.varKind = varKind;
			this.name = name;
			this.iterable = iterable;
		}
		render(opts) {
			return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iterable = optimizeExpr(this.iterable, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iterable.names);
		}
	};
	var Func = class extends BlockNode {
		constructor(name, args, async) {
			super();
			this.name = name;
			this.args = args;
			this.async = async;
		}
		render(opts) {
			return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
		}
	};
	Func.kind = "func";
	var Return = class extends ParentNode {
		render(opts) {
			return "return " + super.render(opts);
		}
	};
	Return.kind = "return";
	var Try = class extends BlockNode {
		render(opts) {
			let code = "try" + super.render(opts);
			if (this.catch) code += this.catch.render(opts);
			if (this.finally) code += this.finally.render(opts);
			return code;
		}
		optimizeNodes() {
			var _a, _b;
			super.optimizeNodes();
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNodes();
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNodes();
			return this;
		}
		optimizeNames(names, constants) {
			var _a, _b;
			super.optimizeNames(names, constants);
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNames(names, constants);
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNames(names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			if (this.catch) addNames(names, this.catch.names);
			if (this.finally) addNames(names, this.finally.names);
			return names;
		}
	};
	var Catch = class extends BlockNode {
		constructor(error) {
			super();
			this.error = error;
		}
		render(opts) {
			return `catch(${this.error})` + super.render(opts);
		}
	};
	Catch.kind = "catch";
	var Finally = class extends BlockNode {
		render(opts) {
			return "finally" + super.render(opts);
		}
	};
	Finally.kind = "finally";
	var CodeGen = class {
		constructor(extScope, opts = {}) {
			this._values = {};
			this._blockStarts = [];
			this._constants = {};
			this.opts = {
				...opts,
				_n: opts.lines ? "\n" : ""
			};
			this._extScope = extScope;
			this._scope = new scope_1.Scope({ parent: extScope });
			this._nodes = [new Root()];
		}
		toString() {
			return this._root.render(this.opts);
		}
		name(prefix) {
			return this._scope.name(prefix);
		}
		scopeName(prefix) {
			return this._extScope.name(prefix);
		}
		scopeValue(prefixOrName, value) {
			const name = this._extScope.value(prefixOrName, value);
			(this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set())).add(name);
			return name;
		}
		getScopeValue(prefix, keyOrRef) {
			return this._extScope.getValue(prefix, keyOrRef);
		}
		scopeRefs(scopeName) {
			return this._extScope.scopeRefs(scopeName, this._values);
		}
		scopeCode() {
			return this._extScope.scopeCode(this._values);
		}
		_def(varKind, nameOrPrefix, rhs, constant) {
			const name = this._scope.toName(nameOrPrefix);
			if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
			this._leafNode(new Def(varKind, name, rhs));
			return name;
		}
		const(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		}
		let(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		}
		var(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		}
		assign(lhs, rhs, sideEffects) {
			return this._leafNode(new Assign(lhs, rhs, sideEffects));
		}
		add(lhs, rhs) {
			return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
		}
		code(c) {
			if (typeof c == "function") c();
			else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
			return this;
		}
		object(...keyValues) {
			const code = ["{"];
			for (const [key, value] of keyValues) {
				if (code.length > 1) code.push(",");
				code.push(key);
				if (key !== value || this.opts.es5) {
					code.push(":");
					(0, code_1.addCodeArg)(code, value);
				}
			}
			code.push("}");
			return new code_1._Code(code);
		}
		if(condition, thenBody, elseBody) {
			this._blockNode(new If(condition));
			if (thenBody && elseBody) this.code(thenBody).else().code(elseBody).endIf();
			else if (thenBody) this.code(thenBody).endIf();
			else if (elseBody) throw new Error("CodeGen: \"else\" body without \"then\" body");
			return this;
		}
		elseIf(condition) {
			return this._elseNode(new If(condition));
		}
		else() {
			return this._elseNode(new Else());
		}
		endIf() {
			return this._endBlockNode(If, Else);
		}
		_for(node, forBody) {
			this._blockNode(node);
			if (forBody) this.code(forBody).endFor();
			return this;
		}
		for(iteration, forBody) {
			return this._for(new ForLoop(iteration), forBody);
		}
		forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		}
		forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
			const name = this._scope.toName(nameOrPrefix);
			if (this.opts.es5) {
				const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
				return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
					this.var(name, (0, code_1._)`${arr}[${i}]`);
					forBody(name);
				});
			}
			return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		}
		forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
			if (this.opts.ownProperties) return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		}
		endFor() {
			return this._endBlockNode(For);
		}
		label(label) {
			return this._leafNode(new Label(label));
		}
		break(label) {
			return this._leafNode(new Break(label));
		}
		return(value) {
			const node = new Return();
			this._blockNode(node);
			this.code(value);
			if (node.nodes.length !== 1) throw new Error("CodeGen: \"return\" should have one node");
			return this._endBlockNode(Return);
		}
		try(tryBody, catchCode, finallyCode) {
			if (!catchCode && !finallyCode) throw new Error("CodeGen: \"try\" without \"catch\" and \"finally\"");
			const node = new Try();
			this._blockNode(node);
			this.code(tryBody);
			if (catchCode) {
				const error = this.name("e");
				this._currNode = node.catch = new Catch(error);
				catchCode(error);
			}
			if (finallyCode) {
				this._currNode = node.finally = new Finally();
				this.code(finallyCode);
			}
			return this._endBlockNode(Catch, Finally);
		}
		throw(error) {
			return this._leafNode(new Throw(error));
		}
		block(body, nodeCount) {
			this._blockStarts.push(this._nodes.length);
			if (body) this.code(body).endBlock(nodeCount);
			return this;
		}
		endBlock(nodeCount) {
			const len = this._blockStarts.pop();
			if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
			const toClose = this._nodes.length - len;
			if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
			this._nodes.length = len;
			return this;
		}
		func(name, args = code_1.nil, async, funcBody) {
			this._blockNode(new Func(name, args, async));
			if (funcBody) this.code(funcBody).endFunc();
			return this;
		}
		endFunc() {
			return this._endBlockNode(Func);
		}
		optimize(n = 1) {
			while (n-- > 0) {
				this._root.optimizeNodes();
				this._root.optimizeNames(this._root.names, this._constants);
			}
		}
		_leafNode(node) {
			this._currNode.nodes.push(node);
			return this;
		}
		_blockNode(node) {
			this._currNode.nodes.push(node);
			this._nodes.push(node);
		}
		_endBlockNode(N1, N2) {
			const n = this._currNode;
			if (n instanceof N1 || N2 && n instanceof N2) {
				this._nodes.pop();
				return this;
			}
			throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		}
		_elseNode(node) {
			const n = this._currNode;
			if (!(n instanceof If)) throw new Error("CodeGen: \"else\" without \"if\"");
			this._currNode = n.else = node;
			return this;
		}
		get _root() {
			return this._nodes[0];
		}
		get _currNode() {
			const ns = this._nodes;
			return ns[ns.length - 1];
		}
		set _currNode(node) {
			const ns = this._nodes;
			ns[ns.length - 1] = node;
		}
	};
	exports.CodeGen = CodeGen;
	function addNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
		return names;
	}
	function addExprNames(names, from) {
		return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
	}
	function optimizeExpr(expr, names, constants) {
		if (expr instanceof code_1.Name) return replaceName(expr);
		if (!canOptimize(expr)) return expr;
		return new code_1._Code(expr._items.reduce((items, c) => {
			if (c instanceof code_1.Name) c = replaceName(c);
			if (c instanceof code_1._Code) items.push(...c._items);
			else items.push(c);
			return items;
		}, []));
		function replaceName(n) {
			const c = constants[n.str];
			if (c === void 0 || names[n.str] !== 1) return n;
			delete names[n.str];
			return c;
		}
		function canOptimize(e) {
			return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
		}
	}
	function subtractNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
	}
	function not(x) {
		return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
	}
	exports.not = not;
	var andCode = mappend(exports.operators.AND);
	function and(...args) {
		return args.reduce(andCode);
	}
	exports.and = and;
	var orCode = mappend(exports.operators.OR);
	function or(...args) {
		return args.reduce(orCode);
	}
	exports.or = or;
	function mappend(op) {
		return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
	}
	function par(x) {
		return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
	var codegen_1 = require_codegen();
	var code_1 = require_code$1();
	function toHash(arr) {
		const hash = {};
		for (const item of arr) hash[item] = true;
		return hash;
	}
	exports.toHash = toHash;
	function alwaysValidSchema(it, schema) {
		if (typeof schema == "boolean") return schema;
		if (Object.keys(schema).length === 0) return true;
		checkUnknownRules(it, schema);
		return !schemaHasRules(schema, it.self.RULES.all);
	}
	exports.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
		const { opts, self } = it;
		if (!opts.strictSchema) return;
		if (typeof schema === "boolean") return;
		const rules = self.RULES.keywords;
		for (const key in schema) if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
	}
	exports.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (rules[key]) return true;
		return false;
	}
	exports.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
		return false;
	}
	exports.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
		if (!$data) {
			if (typeof schema == "number" || typeof schema == "boolean") return schema;
			if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
		}
		return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	exports.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
		return unescapeJsonPointer(decodeURIComponent(str));
	}
	exports.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
		return encodeURIComponent(escapeJsonPointer(str));
	}
	exports.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
		if (typeof str == "number") return `${str}`;
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	exports.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
		return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	exports.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
		if (Array.isArray(xs)) for (const x of xs) f(x);
		else f(xs);
	}
	exports.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
		return (gen, from, to, toName) => {
			const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
			return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
		};
	}
	exports.mergeEvaluated = {
		props: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
				gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
			}),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
				if (from === true) gen.assign(to, true);
				else {
					gen.assign(to, (0, codegen_1._)`${to} || {}`);
					setEvaluated(gen, to, from);
				}
			}),
			mergeValues: (from, to) => from === true ? true : {
				...from,
				...to
			},
			resultToName: evaluatedPropsToName
		}),
		items: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
			mergeValues: (from, to) => from === true ? true : Math.max(from, to),
			resultToName: (gen, items) => gen.var("items", items)
		})
	};
	function evaluatedPropsToName(gen, ps) {
		if (ps === true) return gen.var("props", true);
		const props = gen.var("props", (0, codegen_1._)`{}`);
		if (ps !== void 0) setEvaluated(gen, props, ps);
		return props;
	}
	exports.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
		Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	exports.setEvaluated = setEvaluated;
	var snippets = {};
	function useFunc(gen, f) {
		return gen.scopeValue("func", {
			ref: f,
			code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
		});
	}
	exports.useFunc = useFunc;
	var Type;
	(function(Type) {
		Type[Type["Num"] = 0] = "Num";
		Type[Type["Str"] = 1] = "Str";
	})(Type || (exports.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
		if (dataProp instanceof codegen_1.Name) {
			const isNumber = dataPropType === Type.Num;
			return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
		}
		return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	exports.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
		if (!mode) return;
		msg = `strict mode: ${msg}`;
		if (mode === true) throw new Error(msg);
		it.self.logger.warn(msg);
	}
	exports.checkStrictMode = checkStrictMode;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/names.js
var require_names = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		data: new codegen_1.Name("data"),
		valCxt: new codegen_1.Name("valCxt"),
		instancePath: new codegen_1.Name("instancePath"),
		parentData: new codegen_1.Name("parentData"),
		parentDataProperty: new codegen_1.Name("parentDataProperty"),
		rootData: new codegen_1.Name("rootData"),
		dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
		vErrors: new codegen_1.Name("vErrors"),
		errors: new codegen_1.Name("errors"),
		this: new codegen_1.Name("this"),
		self: new codegen_1.Name("self"),
		scope: new codegen_1.Name("scope"),
		json: new codegen_1.Name("json"),
		jsonPos: new codegen_1.Name("jsonPos"),
		jsonLen: new codegen_1.Name("jsonLen"),
		jsonPart: new codegen_1.Name("jsonPart")
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.keywordError = { message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation` };
	exports.keyword$DataError = { message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)` };
	function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		const errObj = errorObjectCode(cxt, error, errorPaths);
		if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) addError(gen, errObj);
		else returnErrors(it, (0, codegen_1._)`[${errObj}]`);
	}
	exports.reportError = reportError;
	function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		addError(gen, errorObjectCode(cxt, error, errorPaths));
		if (!(compositeRule || allErrors)) returnErrors(it, names_1.default.vErrors);
	}
	exports.reportExtraError = reportExtraError;
	function resetErrorsCount(gen, errsCount) {
		gen.assign(names_1.default.errors, errsCount);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
	}
	exports.resetErrorsCount = resetErrorsCount;
	function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
		/* istanbul ignore if */
		if (errsCount === void 0) throw new Error("ajv implementation error");
		const err = gen.name("err");
		gen.forRange("i", errsCount, names_1.default.errors, (i) => {
			gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
			gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
			gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
			if (it.opts.verbose) {
				gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
				gen.assign((0, codegen_1._)`${err}.data`, data);
			}
		});
	}
	exports.extendErrors = extendErrors;
	function addError(gen, errObj) {
		const err = gen.const("err", errObj);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
		gen.code((0, codegen_1._)`${names_1.default.errors}++`);
	}
	function returnErrors(it, errs) {
		const { gen, validateName, schemaEnv } = it;
		if (schemaEnv.$async) gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
			gen.return(false);
		}
	}
	var E = {
		keyword: new codegen_1.Name("keyword"),
		schemaPath: new codegen_1.Name("schemaPath"),
		params: new codegen_1.Name("params"),
		propertyName: new codegen_1.Name("propertyName"),
		message: new codegen_1.Name("message"),
		schema: new codegen_1.Name("schema"),
		parentSchema: new codegen_1.Name("parentSchema")
	};
	function errorObjectCode(cxt, error, errorPaths) {
		const { createErrors } = cxt.it;
		if (createErrors === false) return (0, codegen_1._)`{}`;
		return errorObject(cxt, error, errorPaths);
	}
	function errorObject(cxt, error, errorPaths = {}) {
		const { gen, it } = cxt;
		const keyValues = [errorInstancePath(it, errorPaths), errorSchemaPath(cxt, errorPaths)];
		extraErrorProps(cxt, error, keyValues);
		return gen.object(...keyValues);
	}
	function errorInstancePath({ errorPath }, { instancePath }) {
		const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
		return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
	}
	function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
		if (schemaPath) schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		return [E.schemaPath, schPath];
	}
	function extraErrorProps(cxt, { params, message }, keyValues) {
		const { keyword, data, schemaValue, it } = cxt;
		const { opts, propertyName, topSchemaRef, schemaPath } = it;
		keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
		if (opts.messages) keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		if (opts.verbose) keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		if (propertyName) keyValues.push([E.propertyName, propertyName]);
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var boolError = { message: "boolean schema is false" };
	function topBoolOrEmptySchema(it) {
		const { gen, schema, validateName } = it;
		if (schema === false) falseSchemaError(it, false);
		else if (typeof schema == "object" && schema.$async === true) gen.return(names_1.default.data);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, null);
			gen.return(true);
		}
	}
	exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
		const { gen, schema } = it;
		if (schema === false) {
			gen.var(valid, false);
			falseSchemaError(it);
		} else gen.var(valid, true);
	}
	exports.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
		const { gen, data } = it;
		const cxt = {
			gen,
			keyword: "false schema",
			data,
			schema: false,
			schemaCode: false,
			schemaValue: false,
			params: {},
			it
		};
		(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/rules.js
var require_rules = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRules = exports.isJSONType = void 0;
	var jsonTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null",
		"object",
		"array"
	]);
	function isJSONType(x) {
		return typeof x == "string" && jsonTypes.has(x);
	}
	exports.isJSONType = isJSONType;
	function getRules() {
		const groups = {
			number: {
				type: "number",
				rules: []
			},
			string: {
				type: "string",
				rules: []
			},
			array: {
				type: "array",
				rules: []
			},
			object: {
				type: "object",
				rules: []
			}
		};
		return {
			types: {
				...groups,
				integer: true,
				boolean: true,
				null: true
			},
			rules: [
				{ rules: [] },
				groups.number,
				groups.string,
				groups.array,
				groups.object
			],
			post: { rules: [] },
			all: {},
			keywords: {}
		};
	}
	exports.getRules = getRules;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
		const group = self.RULES.types[type];
		return group && group !== true && shouldUseGroup(schema, group);
	}
	exports.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
		return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	exports.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
		var _a;
		return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
	}
	exports.shouldUseRule = shouldUseRule;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
	var rules_1 = require_rules();
	var applicability_1 = require_applicability();
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var DataType;
	(function(DataType) {
		DataType[DataType["Correct"] = 0] = "Correct";
		DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (exports.DataType = DataType = {}));
	function getSchemaTypes(schema) {
		const types = getJSONTypes(schema.type);
		if (types.includes("null")) {
			if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
		} else {
			if (!types.length && schema.nullable !== void 0) throw new Error("\"nullable\" cannot be used without \"type\"");
			if (schema.nullable === true) types.push("null");
		}
		return types;
	}
	exports.getSchemaTypes = getSchemaTypes;
	function getJSONTypes(ts) {
		const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
		if (types.every(rules_1.isJSONType)) return types;
		throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	exports.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
		const { gen, data, opts } = it;
		const coerceTo = coerceToTypes(types, opts.coerceTypes);
		const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
		if (checkTypes) {
			const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
			gen.if(wrongType, () => {
				if (coerceTo.length) coerceData(it, types, coerceTo);
				else reportTypeError(it);
			});
		}
		return checkTypes;
	}
	exports.coerceAndCheckDataType = coerceAndCheckDataType;
	var COERCIBLE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function coerceToTypes(types, coerceTypes) {
		return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
	}
	function coerceData(it, types, coerceTo) {
		const { gen, data, opts } = it;
		const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
		const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
		if (opts.coerceTypes === "array") gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
		gen.if((0, codegen_1._)`${coerced} !== undefined`);
		for (const t of coerceTo) if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") coerceSpecificType(t);
		gen.else();
		reportTypeError(it);
		gen.endIf();
		gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
			gen.assign(data, coerced);
			assignParentData(it, coerced);
		});
		function coerceSpecificType(t) {
			switch (t) {
				case "string":
					gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
					return;
				case "number":
					gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "integer":
					gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "boolean":
					gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
					return;
				case "null":
					gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
					gen.assign(coerced, null);
					return;
				case "array": gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
			}
		}
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
		gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
		const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
		let cond;
		switch (dataType) {
			case "null": return (0, codegen_1._)`${data} ${EQ} null`;
			case "array":
				cond = (0, codegen_1._)`Array.isArray(${data})`;
				break;
			case "object":
				cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
				break;
			case "integer":
				cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
				break;
			case "number":
				cond = numCond();
				break;
			default: return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
		}
		return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
		function numCond(_cond = codegen_1.nil) {
			return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
		}
	}
	exports.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
		if (dataTypes.length === 1) return checkDataType(dataTypes[0], data, strictNums, correct);
		let cond;
		const types = (0, util_1.toHash)(dataTypes);
		if (types.array && types.object) {
			const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
			cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
			delete types.null;
			delete types.array;
			delete types.object;
		} else cond = codegen_1.nil;
		if (types.number) delete types.integer;
		for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
		return cond;
	}
	exports.checkDataTypes = checkDataTypes;
	var typeError = {
		message: ({ schema }) => `must be ${schema}`,
		params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
	};
	function reportTypeError(it) {
		const cxt = getTypeErrorContext(it);
		(0, errors_1.reportError)(cxt, typeError);
	}
	exports.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
		const { gen, data, schema } = it;
		const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
		return {
			gen,
			keyword: "type",
			data,
			schema: schema.type,
			schemaCode,
			schemaValue: schemaCode,
			parentSchema: schema,
			params: {},
			it
		};
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assignDefaults = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function assignDefaults(it, ty) {
		const { properties, items } = it.schema;
		if (ty === "object" && properties) for (const key in properties) assignDefault(it, key, properties[key].default);
		else if (ty === "array" && Array.isArray(items)) items.forEach((sch, i) => assignDefault(it, i, sch.default));
	}
	exports.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
		const { gen, compositeRule, data, opts } = it;
		if (defaultValue === void 0) return;
		const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
		if (compositeRule) {
			(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
			return;
		}
		let condition = (0, codegen_1._)`${childData} === undefined`;
		if (opts.useDefaults === "empty") condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
		gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/code.js
var require_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	var util_2 = require_util();
	function checkReportMissingProp(cxt, prop) {
		const { gen, data, it } = cxt;
		gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
			cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
			cxt.error();
		});
	}
	exports.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
		return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
	}
	exports.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
		cxt.setParams({ missingProperty: missing }, true);
		cxt.error();
	}
	exports.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
		return gen.scopeValue("func", {
			ref: Object.prototype.hasOwnProperty,
			code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
		});
	}
	exports.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
		return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	exports.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
		return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	exports.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
		return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	exports.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
		return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	exports.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
		return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	exports.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
		const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
		const valCxt = [
			[names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
			[names_1.default.parentData, it.parentData],
			[names_1.default.parentDataProperty, it.parentDataProperty],
			[names_1.default.rootData, names_1.default.rootData]
		];
		if (it.opts.dynamicRef) valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
		const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
		return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
	}
	exports.callValidateCode = callValidateCode;
	var newRegExp = (0, codegen_1._)`new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
		const u = opts.unicodeRegExp ? "u" : "";
		const { regExp } = opts.code;
		const rx = regExp(pattern, u);
		return gen.scopeValue("pattern", {
			key: rx.toString(),
			ref: rx,
			code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
		});
	}
	exports.usePattern = usePattern;
	function validateArray(cxt) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		if (it.allErrors) {
			const validArr = gen.let("valid", true);
			validateItems(() => gen.assign(validArr, false));
			return validArr;
		}
		gen.var(valid, true);
		validateItems(() => gen.break());
		return valid;
		function validateItems(notValid) {
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			gen.forRange("i", 0, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				gen.if((0, codegen_1.not)(valid), notValid);
			});
		}
	}
	exports.validateArray = validateArray;
	function validateUnion(cxt) {
		const { gen, schema, keyword, it } = cxt;
		/* istanbul ignore if */
		if (!Array.isArray(schema)) throw new Error("ajv implementation error");
		if (schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated) return;
		const valid = gen.let("valid", false);
		const schValid = gen.name("_valid");
		gen.block(() => schema.forEach((_sch, i) => {
			const schCxt = cxt.subschema({
				keyword,
				schemaProp: i,
				compositeRule: true
			}, schValid);
			gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
			if (!cxt.mergeValidEvaluated(schCxt, schValid)) gen.if((0, codegen_1.not)(valid));
		}));
		cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	exports.validateUnion = validateUnion;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var code_1 = require_code();
	var errors_1 = require_errors();
	function macroKeywordCode(cxt, def) {
		const { gen, keyword, schema, parentSchema, it } = cxt;
		const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
		const schemaRef = useKeyword(gen, keyword, macroSchema);
		if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
		const valid = gen.name("valid");
		cxt.subschema({
			schema: macroSchema,
			schemaPath: codegen_1.nil,
			errSchemaPath: `${it.errSchemaPath}/${keyword}`,
			topSchemaRef: schemaRef,
			compositeRule: true
		}, valid);
		cxt.pass(valid, () => cxt.error(true));
	}
	exports.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
		var _a;
		const { gen, keyword, schema, parentSchema, $data, it } = cxt;
		checkAsyncKeyword(it, def);
		const validateRef = useKeyword(gen, keyword, !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate);
		const valid = gen.let("valid");
		cxt.block$data(valid, validateKeyword);
		cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
		function validateKeyword() {
			if (def.errors === false) {
				assignValid();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => cxt.error());
			} else {
				const ruleErrs = def.async ? validateAsync() : validateSync();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => addErrs(cxt, ruleErrs));
			}
		}
		function validateAsync() {
			const ruleErrs = gen.let("ruleErrs", null);
			gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
			return ruleErrs;
		}
		function validateSync() {
			const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
			gen.assign(validateErrs, null);
			assignValid(codegen_1.nil);
			return validateErrs;
		}
		function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
			const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
			const passSchema = !("compile" in def && !$data || def.schema === false);
			gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
		}
		function reportErrs(errors) {
			var _a;
			gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
		}
	}
	exports.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
		const { gen, data, it } = cxt;
		gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
		const { gen } = cxt;
		gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
			(0, errors_1.extendErrors)(cxt);
		}, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
		if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
		if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
		return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : {
			ref: result,
			code: (0, codegen_1.stringify)(result)
		});
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
		return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
	}
	exports.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
		/* istanbul ignore if */
		if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) throw new Error("ajv implementation error");
		const deps = def.dependencies;
		if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
		if (def.validateSchema) {
			if (!def.validateSchema(schema[keyword])) {
				const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
				if (opts.validateSchema === "log") self.logger.error(msg);
				else throw new Error(msg);
			}
		}
	}
	exports.validateKeywordUsage = validateKeywordUsage;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
		if (keyword !== void 0 && schema !== void 0) throw new Error("both \"keyword\" and \"schema\" passed, only one allowed");
		if (keyword !== void 0) {
			const sch = it.schema[keyword];
			return schemaProp === void 0 ? {
				schema: sch,
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}`
			} : {
				schema: sch[schemaProp],
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
			};
		}
		if (schema !== void 0) {
			if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) throw new Error("\"schemaPath\", \"errSchemaPath\" and \"topSchemaRef\" are required with \"schema\"");
			return {
				schema,
				schemaPath,
				topSchemaRef,
				errSchemaPath
			};
		}
		throw new Error("either \"keyword\" or \"schema\" must be passed");
	}
	exports.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
		if (data !== void 0 && dataProp !== void 0) throw new Error("both \"data\" and \"dataProp\" passed, only one allowed");
		const { gen } = it;
		if (dataProp !== void 0) {
			const { errorPath, dataPathArr, opts } = it;
			dataContextProps(gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true));
			subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
			subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
			subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
		}
		if (data !== void 0) {
			dataContextProps(data instanceof codegen_1.Name ? data : gen.let("data", data, true));
			if (propertyName !== void 0) subschema.propertyName = propertyName;
		}
		if (dataTypes) subschema.dataTypes = dataTypes;
		function dataContextProps(_nextData) {
			subschema.data = _nextData;
			subschema.dataLevel = it.dataLevel + 1;
			subschema.dataTypes = [];
			it.definedProperties = /* @__PURE__ */ new Set();
			subschema.parentData = it.data;
			subschema.dataNames = [...it.dataNames, _nextData];
		}
	}
	exports.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
		if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
		if (createErrors !== void 0) subschema.createErrors = createErrors;
		if (allErrors !== void 0) subschema.allErrors = allErrors;
		subschema.jtdDiscriminator = jtdDiscriminator;
		subschema.jtdMetadata = jtdMetadata;
	}
	exports.extendSubschemaMode = extendSubschemaMode;
}));
//#endregion
//#region node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region node_modules/.pnpm/json-schema-traverse@1.0.0/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var traverse = module.exports = function(schema, opts, cb) {
		if (typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		cb = opts.cb || cb;
		var pre = typeof cb == "function" ? cb : cb.pre || function() {};
		var post = cb.post || function() {};
		_traverse(opts, pre, post, schema, "", schema);
	};
	traverse.keywords = {
		additionalItems: true,
		items: true,
		contains: true,
		additionalProperties: true,
		propertyNames: true,
		not: true,
		if: true,
		then: true,
		else: true
	};
	traverse.arrayKeywords = {
		items: true,
		allOf: true,
		anyOf: true,
		oneOf: true
	};
	traverse.propsKeywords = {
		$defs: true,
		definitions: true,
		properties: true,
		patternProperties: true,
		dependencies: true
	};
	traverse.skipKeywords = {
		default: true,
		enum: true,
		const: true,
		required: true,
		maximum: true,
		minimum: true,
		exclusiveMaximum: true,
		exclusiveMinimum: true,
		multipleOf: true,
		maxLength: true,
		minLength: true,
		pattern: true,
		format: true,
		maxItems: true,
		minItems: true,
		uniqueItems: true,
		maxProperties: true,
		minProperties: true
	};
	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
		if (schema && typeof schema == "object" && !Array.isArray(schema)) {
			pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
			for (var key in schema) {
				var sch = schema[key];
				if (Array.isArray(sch)) {
					if (key in traverse.arrayKeywords) for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
				} else if (key in traverse.propsKeywords) {
					if (sch && typeof sch == "object") for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
				} else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
			}
			post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
		}
	}
	function escapeJsonPtr(str) {
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/resolve.js
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
	var util_1 = require_util();
	var equal = require_fast_deep_equal();
	var traverse = require_json_schema_traverse();
	var SIMPLE_INLINED = /* @__PURE__ */ new Set([
		"type",
		"format",
		"pattern",
		"maxLength",
		"minLength",
		"maxProperties",
		"minProperties",
		"maxItems",
		"minItems",
		"maximum",
		"minimum",
		"uniqueItems",
		"multipleOf",
		"required",
		"enum",
		"const"
	]);
	function inlineRef(schema, limit = true) {
		if (typeof schema == "boolean") return true;
		if (limit === true) return !hasRef(schema);
		if (!limit) return false;
		return countKeys(schema) <= limit;
	}
	exports.inlineRef = inlineRef;
	var REF_KEYWORDS = /* @__PURE__ */ new Set([
		"$ref",
		"$recursiveRef",
		"$recursiveAnchor",
		"$dynamicRef",
		"$dynamicAnchor"
	]);
	function hasRef(schema) {
		for (const key in schema) {
			if (REF_KEYWORDS.has(key)) return true;
			const sch = schema[key];
			if (Array.isArray(sch) && sch.some(hasRef)) return true;
			if (typeof sch == "object" && hasRef(sch)) return true;
		}
		return false;
	}
	function countKeys(schema) {
		let count = 0;
		for (const key in schema) {
			if (key === "$ref") return Infinity;
			count++;
			if (SIMPLE_INLINED.has(key)) continue;
			if (typeof schema[key] == "object") (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
			if (count === Infinity) return Infinity;
		}
		return count;
	}
	function getFullPath(resolver, id = "", normalize) {
		if (normalize !== false) id = normalizeId(id);
		return _getFullPath(resolver, resolver.parse(id));
	}
	exports.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
		return resolver.serialize(p).split("#")[0] + "#";
	}
	exports._getFullPath = _getFullPath;
	var TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
		return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	exports.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
		id = normalizeId(id);
		return resolver.resolve(baseId, id);
	}
	exports.resolveUrl = resolveUrl;
	var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
		if (typeof schema == "boolean") return {};
		const { schemaId, uriResolver } = this.opts;
		const schId = normalizeId(schema[schemaId] || baseId);
		const baseIds = { "": schId };
		const pathPrefix = getFullPath(uriResolver, schId, false);
		const localRefs = {};
		const schemaRefs = /* @__PURE__ */ new Set();
		traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
			if (parentJsonPtr === void 0) return;
			const fullPath = pathPrefix + jsonPtr;
			let innerBaseId = baseIds[parentJsonPtr];
			if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
			addAnchor.call(this, sch.$anchor);
			addAnchor.call(this, sch.$dynamicAnchor);
			baseIds[jsonPtr] = innerBaseId;
			function addRef(ref) {
				const _resolve = this.opts.uriResolver.resolve;
				ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
				if (schemaRefs.has(ref)) throw ambiguos(ref);
				schemaRefs.add(ref);
				let schOrRef = this.refs[ref];
				if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
				if (typeof schOrRef == "object") checkAmbiguosRef(sch, schOrRef.schema, ref);
				else if (ref !== normalizeId(fullPath)) {
					if (ref[0] === "#") {
						checkAmbiguosRef(sch, localRefs[ref], ref);
						localRefs[ref] = sch;
					} else this.refs[ref] = fullPath;
				}
				return ref;
			}
			function addAnchor(anchor) {
				if (typeof anchor == "string") {
					if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
					addRef.call(this, `#${anchor}`);
				}
			}
		});
		return localRefs;
		function checkAmbiguosRef(sch1, sch2, ref) {
			if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
		}
		function ambiguos(ref) {
			return /* @__PURE__ */ new Error(`reference "${ref}" resolves to more than one schema`);
		}
	}
	exports.getSchemaRefs = getSchemaRefs;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/validate/index.js
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema();
	var dataType_1 = require_dataType();
	var applicability_1 = require_applicability();
	var dataType_2 = require_dataType();
	var defaults_1 = require_defaults();
	var keyword_1 = require_keyword();
	var subschema_1 = require_subschema();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var errors_1 = require_errors();
	function validateFunctionCode(it) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				topSchemaObjCode(it);
				return;
			}
		}
		validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	exports.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
		if (opts.code.es5) gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
			gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
			destructureValCxtES5(gen, opts);
			gen.code(body);
		});
		else gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	}
	function destructureValCxt(opts) {
		return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
		gen.if(names_1.default.valCxt, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
			gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
		}, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.rootData, names_1.default.data);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
		});
	}
	function topSchemaObjCode(it) {
		const { schema, opts, gen } = it;
		validateFunction(it, () => {
			if (opts.$comment && schema.$comment) commentKeyword(it);
			checkNoDefault(it);
			gen.let(names_1.default.vErrors, null);
			gen.let(names_1.default.errors, 0);
			if (opts.unevaluated) resetEvaluated(it);
			typeAndKeywords(it);
			returnResults(it);
		});
	}
	function resetEvaluated(it) {
		const { gen, validateName } = it;
		it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
	}
	function funcSourceUrl(schema, opts) {
		const schId = typeof schema == "object" && schema[opts.schemaId];
		return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	function subschemaCode(it, valid) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				subSchemaObjCode(it, valid);
				return;
			}
		}
		(0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (self.RULES.all[key]) return true;
		return false;
	}
	function isSchemaObj(it) {
		return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
		const { schema, gen, opts } = it;
		if (opts.$comment && schema.$comment) commentKeyword(it);
		updateContext(it);
		checkAsyncSchema(it);
		const errsCount = gen.const("_errs", names_1.default.errors);
		typeAndKeywords(it, errsCount);
		gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
		(0, util_1.checkUnknownRules)(it);
		checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
		if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
		const types = (0, dataType_1.getSchemaTypes)(it.schema);
		schemaKeywords(it, types, !(0, dataType_1.coerceAndCheckDataType)(it, types), errsCount);
	}
	function checkRefsAndKeywords(it) {
		const { schema, errSchemaPath, opts, self } = it;
		if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	}
	function checkNoDefault(it) {
		const { schema, opts } = it;
		if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	}
	function updateContext(it) {
		const schId = it.schema[it.opts.schemaId];
		if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
		if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
		const msg = schema.$comment;
		if (opts.$comment === true) gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
		else if (typeof opts.$comment == "function") {
			const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
			const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
			gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
		}
	}
	function returnResults(it) {
		const { gen, schemaEnv, validateName, ValidationError, opts } = it;
		if (schemaEnv.$async) gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
			if (opts.unevaluated) assignEvaluated(it);
			gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
		}
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
		if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
		if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
		const { gen, schema, data, allErrors, opts, self } = it;
		const { RULES } = self;
		if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
			gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
			return;
		}
		if (!opts.jtd) checkStrictTypes(it, types);
		gen.block(() => {
			for (const group of RULES.rules) groupKeywords(group);
			groupKeywords(RULES.post);
		});
		function groupKeywords(group) {
			if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
			if (group.type) {
				gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
				iterateKeywords(it, group);
				if (types.length === 1 && types[0] === group.type && typeErrors) {
					gen.else();
					(0, dataType_2.reportTypeError)(it);
				}
				gen.endIf();
			} else iterateKeywords(it, group);
			if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
		}
	}
	function iterateKeywords(it, group) {
		const { gen, schema, opts: { useDefaults } } = it;
		if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
		gen.block(() => {
			for (const rule of group.rules) if ((0, applicability_1.shouldUseRule)(schema, rule)) keywordCode(it, rule.keyword, rule.definition, group.type);
		});
	}
	function checkStrictTypes(it, types) {
		if (it.schemaEnv.meta || !it.opts.strictTypes) return;
		checkContextTypes(it, types);
		if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
		checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
		if (!types.length) return;
		if (!it.dataTypes.length) {
			it.dataTypes = types;
			return;
		}
		types.forEach((t) => {
			if (!includesType(it.dataTypes, t)) strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
		});
		narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
		if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	}
	function checkKeywordTypes(it, ts) {
		const rules = it.self.RULES.all;
		for (const keyword in rules) {
			const rule = rules[keyword];
			if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
				const { type } = rule.definition;
				if (type.length && !type.some((t) => hasApplicableType(ts, t))) strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
			}
		}
	}
	function hasApplicableType(schTs, kwdT) {
		return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
	}
	function includesType(ts, t) {
		return ts.includes(t) || t === "integer" && ts.includes("number");
	}
	function narrowSchemaTypes(it, withTypes) {
		const ts = [];
		for (const t of it.dataTypes) if (includesType(withTypes, t)) ts.push(t);
		else if (withTypes.includes("integer") && t === "number") ts.push("integer");
		it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
		const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
		msg += ` at "${schemaPath}" (strictTypes)`;
		(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	var KeywordCxt = class {
		constructor(it, def, keyword) {
			(0, keyword_1.validateKeywordUsage)(it, def, keyword);
			this.gen = it.gen;
			this.allErrors = it.allErrors;
			this.keyword = keyword;
			this.data = it.data;
			this.schema = it.schema[keyword];
			this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
			this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
			this.schemaType = def.schemaType;
			this.parentSchema = it.schema;
			this.params = {};
			this.it = it;
			this.def = def;
			if (this.$data) this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
			else {
				this.schemaCode = this.schemaValue;
				if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
			}
			if ("code" in def ? def.trackErrors : def.errors !== false) this.errsCount = it.gen.const("_errs", names_1.default.errors);
		}
		result(condition, successAction, failAction) {
			this.failResult((0, codegen_1.not)(condition), successAction, failAction);
		}
		failResult(condition, successAction, failAction) {
			this.gen.if(condition);
			if (failAction) failAction();
			else this.error();
			if (successAction) {
				this.gen.else();
				successAction();
				if (this.allErrors) this.gen.endIf();
			} else if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		pass(condition, failAction) {
			this.failResult((0, codegen_1.not)(condition), void 0, failAction);
		}
		fail(condition) {
			if (condition === void 0) {
				this.error();
				if (!this.allErrors) this.gen.if(false);
				return;
			}
			this.gen.if(condition);
			this.error();
			if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		fail$data(condition) {
			if (!this.$data) return this.fail(condition);
			const { schemaCode } = this;
			this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
		}
		error(append, errorParams, errorPaths) {
			if (errorParams) {
				this.setParams(errorParams);
				this._error(append, errorPaths);
				this.setParams({});
				return;
			}
			this._error(append, errorPaths);
		}
		_error(append, errorPaths) {
			(append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
		}
		$dataError() {
			(0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
		}
		reset() {
			if (this.errsCount === void 0) throw new Error("add \"trackErrors\" to keyword definition");
			(0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
		}
		ok(cond) {
			if (!this.allErrors) this.gen.if(cond);
		}
		setParams(obj, assign) {
			if (assign) Object.assign(this.params, obj);
			else this.params = obj;
		}
		block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
			this.gen.block(() => {
				this.check$data(valid, $dataValid);
				codeBlock();
			});
		}
		check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
			if (!this.$data) return;
			const { gen, schemaCode, schemaType, def } = this;
			gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
			if (valid !== codegen_1.nil) gen.assign(valid, true);
			if (schemaType.length || def.validateSchema) {
				gen.elseIf(this.invalid$data());
				this.$dataError();
				if (valid !== codegen_1.nil) gen.assign(valid, false);
			}
			gen.else();
		}
		invalid$data() {
			const { gen, schemaCode, schemaType, def, it } = this;
			return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
			function wrong$DataType() {
				if (schemaType.length) {
					/* istanbul ignore if */
					if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
					const st = Array.isArray(schemaType) ? schemaType : [schemaType];
					return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
				}
				return codegen_1.nil;
			}
			function invalid$DataSchema() {
				if (def.validateSchema) {
					const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
					return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
				}
				return codegen_1.nil;
			}
		}
		subschema(appl, valid) {
			const subschema = (0, subschema_1.getSubschema)(this.it, appl);
			(0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
			(0, subschema_1.extendSubschemaMode)(subschema, appl);
			const nextContext = {
				...this.it,
				...subschema,
				items: void 0,
				props: void 0
			};
			subschemaCode(nextContext, valid);
			return nextContext;
		}
		mergeEvaluated(schemaCxt, toName) {
			const { it, gen } = this;
			if (!it.opts.unevaluated) return;
			if (it.props !== true && schemaCxt.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
			if (it.items !== true && schemaCxt.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
		}
		mergeValidEvaluated(schemaCxt, valid) {
			const { it, gen } = this;
			if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
				gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
				return true;
			}
		}
	};
	exports.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
		const cxt = new KeywordCxt(it, def, keyword);
		if ("code" in def) def.code(cxt, ruleType);
		else if (cxt.$data && def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
		else if ("macro" in def) (0, keyword_1.macroKeywordCode)(cxt, def);
		else if (def.compile || def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
	}
	var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
		let jsonPointer;
		let data;
		if ($data === "") return names_1.default.rootData;
		if ($data[0] === "/") {
			if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
			jsonPointer = $data;
			data = names_1.default.rootData;
		} else {
			const matches = RELATIVE_JSON_POINTER.exec($data);
			if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
			const up = +matches[1];
			jsonPointer = matches[2];
			if (jsonPointer === "#") {
				if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
				return dataPathArr[dataLevel - up];
			}
			if (up > dataLevel) throw new Error(errorMsg("data", up));
			data = dataNames[dataLevel - up];
			if (!jsonPointer) return data;
		}
		let expr = data;
		const segments = jsonPointer.split("/");
		for (const segment of segments) if (segment) {
			data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
			expr = (0, codegen_1._)`${expr} && ${data}`;
		}
		return expr;
		function errorMsg(pointerType, up) {
			return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
		}
	}
	exports.getData = getData;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {
		constructor(errors) {
			super("validation failed");
			this.errors = errors;
			this.ajv = this.validation = true;
		}
	};
	exports.default = ValidationError;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var resolve_1 = require_resolve();
	var MissingRefError = class extends Error {
		constructor(resolver, baseId, ref, msg) {
			super(msg || `can't resolve reference ${ref} from id ${baseId}`);
			this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
			this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
		}
	};
	exports.default = MissingRefError;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/compile/index.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
	var codegen_1 = require_codegen();
	var validation_error_1 = require_validation_error();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var validate_1 = require_validate();
	var SchemaEnv = class {
		constructor(env) {
			var _a;
			this.refs = {};
			this.dynamicAnchors = {};
			let schema;
			if (typeof env.schema == "object") schema = env.schema;
			this.schema = env.schema;
			this.schemaId = env.schemaId;
			this.root = env.root || this;
			this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
			this.schemaPath = env.schemaPath;
			this.localRefs = env.localRefs;
			this.meta = env.meta;
			this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
			this.refs = {};
		}
	};
	exports.SchemaEnv = SchemaEnv;
	function compileSchema(sch) {
		const _sch = getCompilingSchema.call(this, sch);
		if (_sch) return _sch;
		const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
		const { es5, lines } = this.opts.code;
		const { ownProperties } = this.opts;
		const gen = new codegen_1.CodeGen(this.scope, {
			es5,
			lines,
			ownProperties
		});
		let _ValidationError;
		if (sch.$async) _ValidationError = gen.scopeValue("Error", {
			ref: validation_error_1.default,
			code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
		});
		const validateName = gen.scopeName("validate");
		sch.validateName = validateName;
		const schemaCxt = {
			gen,
			allErrors: this.opts.allErrors,
			data: names_1.default.data,
			parentData: names_1.default.parentData,
			parentDataProperty: names_1.default.parentDataProperty,
			dataNames: [names_1.default.data],
			dataPathArr: [codegen_1.nil],
			dataLevel: 0,
			dataTypes: [],
			definedProperties: /* @__PURE__ */ new Set(),
			topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
				ref: sch.schema,
				code: (0, codegen_1.stringify)(sch.schema)
			} : { ref: sch.schema }),
			validateName,
			ValidationError: _ValidationError,
			schema: sch.schema,
			schemaEnv: sch,
			rootId,
			baseId: sch.baseId || rootId,
			schemaPath: codegen_1.nil,
			errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
			errorPath: (0, codegen_1._)`""`,
			opts: this.opts,
			self: this
		};
		let sourceCode;
		try {
			this._compilations.add(sch);
			(0, validate_1.validateFunctionCode)(schemaCxt);
			gen.optimize(this.opts.code.optimize);
			const validateCode = gen.toString();
			sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
			if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
			const validate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
			this.scope.value(validateName, { ref: validate });
			validate.errors = null;
			validate.schema = sch.schema;
			validate.schemaEnv = sch;
			if (sch.$async) validate.$async = true;
			if (this.opts.code.source === true) validate.source = {
				validateName,
				validateCode,
				scopeValues: gen._values
			};
			if (this.opts.unevaluated) {
				const { props, items } = schemaCxt;
				validate.evaluated = {
					props: props instanceof codegen_1.Name ? void 0 : props,
					items: items instanceof codegen_1.Name ? void 0 : items,
					dynamicProps: props instanceof codegen_1.Name,
					dynamicItems: items instanceof codegen_1.Name
				};
				if (validate.source) validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
			}
			sch.validate = validate;
			return sch;
		} catch (e) {
			delete sch.validate;
			delete sch.validateName;
			if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
			throw e;
		} finally {
			this._compilations.delete(sch);
		}
	}
	exports.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
		var _a;
		ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
		const schOrFunc = root.refs[ref];
		if (schOrFunc) return schOrFunc;
		let _sch = resolve.call(this, root, ref);
		if (_sch === void 0) {
			const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
			const { schemaId } = this.opts;
			if (schema) _sch = new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		if (_sch === void 0) return;
		return root.refs[ref] = inlineOrCompile.call(this, _sch);
	}
	exports.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
		if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
		return sch.validate ? sch : compileSchema.call(this, sch);
	}
	function getCompilingSchema(schEnv) {
		for (const sch of this._compilations) if (sameSchemaEnv(sch, schEnv)) return sch;
	}
	exports.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
		return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	function resolve(root, ref) {
		let sch;
		while (typeof (sch = this.refs[ref]) == "string") ref = sch;
		return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	function resolveSchema(root, ref) {
		const p = this.opts.uriResolver.parse(ref);
		const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
		let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
		if (Object.keys(root.schema).length > 0 && refPath === baseId) return getJsonPointer.call(this, p, root);
		const id = (0, resolve_1.normalizeId)(refPath);
		const schOrRef = this.refs[id] || this.schemas[id];
		if (typeof schOrRef == "string") {
			const sch = resolveSchema.call(this, root, schOrRef);
			if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
			return getJsonPointer.call(this, p, sch);
		}
		if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
		if (!schOrRef.validate) compileSchema.call(this, schOrRef);
		if (id === (0, resolve_1.normalizeId)(ref)) {
			const { schema } = schOrRef;
			const { schemaId } = this.opts;
			const schId = schema[schemaId];
			if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
			return new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		return getJsonPointer.call(this, p, schOrRef);
	}
	exports.resolveSchema = resolveSchema;
	var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"enum",
		"dependencies",
		"definitions"
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
		var _a;
		if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/") return;
		for (const part of parsedRef.fragment.slice(1).split("/")) {
			if (typeof schema === "boolean") return;
			const partSchema = schema[(0, util_1.unescapeFragment)(part)];
			if (partSchema === void 0) return;
			schema = partSchema;
			const schId = typeof schema === "object" && schema[this.opts.schemaId];
			if (!PREVENT_SCOPE_CHANGE.has(part) && schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
		}
		let env;
		if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
			const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
			env = resolveSchema.call(this, root, $ref);
		}
		const { schemaId } = this.opts;
		env = env || new SchemaEnv({
			schema,
			schemaId,
			root,
			baseId
		});
		if (env.schema !== env.root.schema) return env;
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/data.json
var data_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$1,
	additionalProperties: () => false,
	default: () => data_default,
	description: () => description,
	properties: () => properties$1,
	required: () => required,
	type: () => type$1
}), $id$1, description, type$1, required, properties$1, data_default;
var init_data = __esmMin((() => {
	$id$1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$1 = "object";
	required = ["$data"];
	properties$1 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default = {
		$id: $id$1,
		description,
		type: type$1,
		required,
		properties: properties$1,
		additionalProperties: false
	};
}));
//#endregion
//#region node_modules/.pnpm/fast-uri@3.1.5/node_modules/fast-uri/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {(value: string) => boolean} */
	var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
	/** @type {(value: string) => boolean} */
	var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
	/** @type {(value: string) => boolean} */
	var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
	/** @type {(value: string) => boolean} */
	var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
	/** @type {(value: string) => boolean} */
	var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
	/**
	* @param {Array<string>} input
	* @returns {string}
	*/
	function stringArrayToHexStripped(input) {
		let acc = "";
		let code = 0;
		let i = 0;
		for (i = 0; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (code === 48) continue;
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
			break;
		}
		for (i += 1; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
		}
		return acc;
	}
	/**
	* @typedef {Object} GetIPV6Result
	* @property {boolean} error - Indicates if there was an error parsing the IPv6 address.
	* @property {string} address - The parsed IPv6 address.
	* @property {string} [zone] - The zone identifier, if present.
	*/
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
	/**
	* @param {Array<string>} buffer
	* @returns {boolean}
	*/
	function consumeIsZone(buffer) {
		buffer.length = 0;
		return true;
	}
	/**
	* @param {Array<string>} buffer
	* @param {Array<string>} address
	* @param {GetIPV6Result} output
	* @returns {boolean}
	*/
	function consumeHextets(buffer, address, output) {
		if (buffer.length) {
			const hex = stringArrayToHexStripped(buffer);
			if (hex !== "") address.push(hex);
			else {
				output.error = true;
				return false;
			}
			buffer.length = 0;
		}
		return true;
	}
	/**
	* @param {string} input
	* @returns {GetIPV6Result}
	*/
	function getIPV6(input) {
		let tokenCount = 0;
		const output = {
			error: false,
			address: "",
			zone: ""
		};
		/** @type {Array<string>} */
		const address = [];
		/** @type {Array<string>} */
		const buffer = [];
		let endipv6Encountered = false;
		let endIpv6 = false;
		let consume = consumeHextets;
		for (let i = 0; i < input.length; i++) {
			const cursor = input[i];
			if (cursor === "[" || cursor === "]") continue;
			if (cursor === ":") {
				if (endipv6Encountered === true) endIpv6 = true;
				if (!consume(buffer, address, output)) break;
				if (++tokenCount > 7) {
					output.error = true;
					break;
				}
				if (i > 0 && input[i - 1] === ":") endipv6Encountered = true;
				address.push(":");
				continue;
			} else if (cursor === "%") {
				if (!consume(buffer, address, output)) break;
				consume = consumeIsZone;
			} else {
				buffer.push(cursor);
				continue;
			}
		}
		if (buffer.length) {
			if (consume === consumeIsZone) output.zone = buffer.join("");
			else if (endIpv6) address.push(buffer.join(""));
			else address.push(stringArrayToHexStripped(buffer));
		}
		output.address = address.join("");
		return output;
	}
	/**
	* @typedef {Object} NormalizeIPv6Result
	* @property {string} host - The normalized host.
	* @property {string} [escapedHost] - The escaped host.
	* @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	*/
	/**
	* @param {string} host
	* @returns {NormalizeIPv6Result}
	*/
	function normalizeIPv6(host) {
		if (findToken(host, ":") < 2) return {
			host,
			isIPV6: false
		};
		const ipv6 = getIPV6(host);
		if (!ipv6.error) {
			let newHost = ipv6.address;
			let escapedHost = ipv6.address;
			if (ipv6.zone) {
				newHost += "%" + ipv6.zone;
				escapedHost += "%25" + ipv6.zone;
			}
			return {
				host: newHost,
				isIPV6: true,
				escapedHost
			};
		} else return {
			host,
			isIPV6: false
		};
	}
	/**
	* @param {string} str
	* @param {string} token
	* @returns {number}
	*/
	function findToken(str, token) {
		let ind = 0;
		for (let i = 0; i < str.length; i++) if (str[i] === token) ind++;
		return ind;
	}
	/**
	* @param {string} path
	* @returns {string}
	*
	* @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	*/
	function removeDotSegments(path) {
		let input = path;
		const output = [];
		let nextSlash = -1;
		let len = 0;
		while (len = input.length) {
			if (len === 1) {
				if (input === ".") break;
				else if (input === "/") {
					output.push("/");
					break;
				} else {
					output.push(input);
					break;
				}
			} else if (len === 2) {
				if (input[0] === ".") {
					if (input[1] === ".") break;
					else if (input[1] === "/") {
						input = input.slice(2);
						continue;
					}
				} else if (input[0] === "/") {
					if (input[1] === "." || input[1] === "/") {
						output.push("/");
						break;
					}
				}
			} else if (len === 3) {
				if (input === "/..") {
					if (output.length !== 0) output.pop();
					output.push("/");
					break;
				}
			}
			if (input[0] === ".") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(3);
						continue;
					}
				} else if (input[1] === "/") {
					input = input.slice(2);
					continue;
				}
			} else if (input[0] === "/") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(2);
						continue;
					} else if (input[2] === ".") {
						if (input[3] === "/") {
							input = input.slice(3);
							if (output.length !== 0) output.pop();
							continue;
						}
					}
				}
			}
			if ((nextSlash = input.indexOf("/", 1)) === -1) {
				output.push(input);
				break;
			} else {
				output.push(input.slice(0, nextSlash));
				input = input.slice(nextSlash);
			}
		}
		return output.join("");
	}
	/**
	* Re-escape RFC 3986 gen-delims that must not appear literally in the host.
	* After the URI regex parses, these characters cannot be literal in the host
	* field, so any that appear after decoding came from percent-encoding and
	* must be restored to prevent authority structure changes.
	*
	* @param {string} host
	* @param {boolean} isIP - true for IPv4/IPv6 hosts (skip colon re-escaping)
	* @returns {string}
	*/
	var HOST_DELIMS = {
		"@": "%40",
		"/": "%2F",
		"?": "%3F",
		"#": "%23",
		":": "%3A"
	};
	var HOST_DELIM_RE = /[@/?#:]/g;
	var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
	function reescapeHostDelimiters(host, isIP) {
		const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
		re.lastIndex = 0;
		return host.replace(re, (ch) => HOST_DELIMS[ch]);
	}
	/**
	* Normalizes percent escapes and optionally decodes only unreserved ASCII bytes.
	* Reserved delimiters such as `%2F` and `%2E` stay escaped.
	*
	* @param {string} input
	* @param {boolean} [decodeUnreserved=false]
	* @returns {string}
	*/
	function normalizePercentEncoding(input, decodeUnreserved = false) {
		if (input.indexOf("%") === -1) return input;
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decodeUnreserved && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			output += input[i];
		}
		return output;
	}
	/**
	* Normalizes path data without turning reserved escapes into live path syntax.
	* Valid escapes are uppercased, raw unsafe characters are escaped, and only
	* unreserved bytes that are not `.` are decoded.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizePathEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decoded !== "." && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isPathCharacter(input[i])) output += input[i];
			else output += escape(input[i]);
		}
		return output;
	}
	/**
	* Escapes a component while preserving existing valid percent escapes.
	*
	* @param {string} input
	* @returns {string}
	*/
	function escapePreservingEscapes(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			output += escape(input[i]);
		}
		return output;
	}
	/**
	* @param {import('../types/index').URIComponent} component
	* @returns {string|undefined}
	*/
	function recomposeAuthority(component) {
		const uriTokens = [];
		if (component.userinfo !== void 0) {
			uriTokens.push(component.userinfo);
			uriTokens.push("@");
		}
		if (component.host !== void 0) {
			let host = unescape(component.host);
			if (!isIPv4(host)) {
				const ipV6res = normalizeIPv6(host);
				if (ipV6res.isIPV6 === true) host = `[${ipV6res.escapedHost}]`;
				else host = reescapeHostDelimiters(host, false);
			}
			uriTokens.push(host);
		}
		if (typeof component.port === "number" || typeof component.port === "string") {
			uriTokens.push(":");
			uriTokens.push(String(component.port));
		}
		return uriTokens.length ? uriTokens.join("") : void 0;
	}
	module.exports = {
		nonSimpleDomain,
		recomposeAuthority,
		reescapeHostDelimiters,
		normalizePercentEncoding,
		normalizePathEncoding,
		escapePreservingEscapes,
		removeDotSegments,
		isIPv4,
		isUUID,
		normalizeIPv6,
		stringArrayToHexStripped
	};
}));
//#endregion
//#region node_modules/.pnpm/fast-uri@3.1.5/node_modules/fast-uri/lib/schemes.js
var require_schemes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils();
	var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
	var supportedSchemeNames = [
		"http",
		"https",
		"ws",
		"wss",
		"urn",
		"urn:uuid"
	];
	/** @typedef {supportedSchemeNames[number]} SchemeName */
	/**
	* @param {string} name
	* @returns {name is SchemeName}
	*/
	function isValidSchemeName(name) {
		return supportedSchemeNames.indexOf(name) !== -1;
	}
	/**
	* @callback SchemeFn
	* @param {import('../types/index').URIComponent} component
	* @param {import('../types/index').Options} options
	* @returns {import('../types/index').URIComponent}
	*/
	/**
	* @typedef {Object} SchemeHandler
	* @property {SchemeName} scheme - The scheme name.
	* @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	* @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	* @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	* @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	* @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	* @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	*/
	/**
	* @param {import('../types/index').URIComponent} wsComponent
	* @returns {boolean}
	*/
	function wsIsSecure(wsComponent) {
		if (wsComponent.secure === true) return true;
		else if (wsComponent.secure === false) return false;
		else if (wsComponent.scheme) return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
		else return false;
	}
	/** @type {SchemeFn} */
	function httpParse(component) {
		if (!component.host) component.error = component.error || "HTTP URIs must have a host.";
		return component;
	}
	/** @type {SchemeFn} */
	function httpSerialize(component) {
		const secure = String(component.scheme).toLowerCase() === "https";
		if (component.port === (secure ? 443 : 80) || component.port === "") component.port = void 0;
		if (!component.path) component.path = "/";
		return component;
	}
	/** @type {SchemeFn} */
	function wsParse(wsComponent) {
		wsComponent.secure = wsIsSecure(wsComponent);
		wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
		wsComponent.path = void 0;
		wsComponent.query = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function wsSerialize(wsComponent) {
		if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") wsComponent.port = void 0;
		if (typeof wsComponent.secure === "boolean") {
			wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
			wsComponent.secure = void 0;
		}
		if (wsComponent.resourceName) {
			const [path, query] = wsComponent.resourceName.split("?");
			wsComponent.path = path && path !== "/" ? path : void 0;
			wsComponent.query = query;
			wsComponent.resourceName = void 0;
		}
		wsComponent.fragment = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function urnParse(urnComponent, options) {
		if (!urnComponent.path) {
			urnComponent.error = "URN can not be parsed";
			return urnComponent;
		}
		const matches = urnComponent.path.match(URN_REG);
		if (matches) {
			const scheme = options.scheme || urnComponent.scheme || "urn";
			urnComponent.nid = matches[1].toLowerCase();
			urnComponent.nss = matches[2];
			const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || urnComponent.nid}`);
			urnComponent.path = void 0;
			if (schemeHandler) urnComponent = schemeHandler.parse(urnComponent, options);
		} else urnComponent.error = urnComponent.error || "URN can not be parsed.";
		return urnComponent;
	}
	/** @type {SchemeFn} */
	function urnSerialize(urnComponent, options) {
		if (urnComponent.nid === void 0) throw new Error("URN without nid cannot be serialized");
		const scheme = options.scheme || urnComponent.scheme || "urn";
		const nid = urnComponent.nid.toLowerCase();
		const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || nid}`);
		if (schemeHandler) urnComponent = schemeHandler.serialize(urnComponent, options);
		const uriComponent = urnComponent;
		const nss = urnComponent.nss;
		uriComponent.path = `${nid || options.nid}:${nss}`;
		options.skipEscape = true;
		return uriComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidParse(urnComponent, options) {
		const uuidComponent = urnComponent;
		uuidComponent.uuid = uuidComponent.nss;
		uuidComponent.nss = void 0;
		if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) uuidComponent.error = uuidComponent.error || "UUID is not valid.";
		return uuidComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidSerialize(uuidComponent) {
		const urnComponent = uuidComponent;
		urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
		return urnComponent;
	}
	var http = {
		scheme: "http",
		domainHost: true,
		parse: httpParse,
		serialize: httpSerialize
	};
	var https = {
		scheme: "https",
		domainHost: http.domainHost,
		parse: httpParse,
		serialize: httpSerialize
	};
	var ws = {
		scheme: "ws",
		domainHost: true,
		parse: wsParse,
		serialize: wsSerialize
	};
	var SCHEMES = {
		http,
		https,
		ws,
		wss: {
			scheme: "wss",
			domainHost: ws.domainHost,
			parse: ws.parse,
			serialize: ws.serialize
		},
		urn: {
			scheme: "urn",
			parse: urnParse,
			serialize: urnSerialize,
			skipNormalize: true
		},
		"urn:uuid": {
			scheme: "urn:uuid",
			parse: urnuuidParse,
			serialize: urnuuidSerialize,
			skipNormalize: true
		}
	};
	Object.setPrototypeOf(SCHEMES, null);
	/**
	* @param {string|undefined} scheme
	* @returns {SchemeHandler|undefined}
	*/
	function getSchemeHandler(scheme) {
		return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
	}
	module.exports = {
		wsIsSecure,
		SCHEMES,
		isValidSchemeName,
		getSchemeHandler
	};
}));
//#endregion
//#region node_modules/.pnpm/fast-uri@3.1.5/node_modules/fast-uri/index.js
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
	var { SCHEMES, getSchemeHandler } = require_schemes();
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA.toLowerCase() === normalizedB.toLowerCase();
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		if (component.path !== void 0) {
			if (!options.skipEscape) {
				component.path = escapePreservingEscapes(component.path);
				if (component.scheme !== void 0) component.path = component.path.split("%3A").join(":");
			} else component.path = normalizePercentEncoding(component.path);
		}
		if (options.reference !== "suffix" && component.scheme) uriTokens.push(component.scheme, ":");
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = removeDotSegments(s);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", component.query);
		if (component.fragment !== void 0) uriTokens.push("#", component.fragment);
		return uriTokens.join("");
	}
	var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let isIP = false;
		if (options.reference === "suffix") {
			if (options.scheme) uri = options.scheme + ":" + uri;
			else uri = "//" + uri;
		}
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) {
				if (isIPv4(parsed.host) === false) {
					const ipv6result = normalizeIPv6(parsed.host);
					parsed.host = ipv6result.host.toLowerCase();
					isIP = ipv6result.isIPV6;
				} else isIP = true;
			}
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
				if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) try {
					parsed.host = new URL("http://" + parsed.host).hostname;
				} catch (e) {
					parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
				}
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (uri.indexOf("%") !== -1) {
					if (parsed.scheme !== void 0) parsed.scheme = unescape(parsed.scheme);
					if (parsed.host !== void 0) parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
				}
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.fragment) try {
					parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
				} catch {
					parsed.error = parsed.error || "URI malformed";
				}
			}
			if (schemeHandler && schemeHandler.parse) schemeHandler.parse(parsed, options);
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri === "string") {
			const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
			return malformedAuthorityOrPort ? void 0 : normalized;
		}
		if (typeof uri === "object") return serialize(uri, opts);
	}
	var fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/core.js
var require_core$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	var ref_error_1 = require_ref_error();
	var rules_1 = require_rules();
	var compile_1 = require_compile();
	var codegen_2 = require_codegen();
	var resolve_1 = require_resolve();
	var dataType_1 = require_dataType();
	var util_1 = require_util();
	var $dataRefSchema = (init_data(), __toCommonJS(data_exports).default);
	var uri_1 = require_uri();
	var defaultRegExp = (str, flags) => new RegExp(str, flags);
	defaultRegExp.code = "new RegExp";
	var META_IGNORE_OPTIONS = [
		"removeAdditional",
		"useDefaults",
		"coerceTypes"
	];
	var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
		"validate",
		"serialize",
		"parse",
		"wrapper",
		"root",
		"schema",
		"keyword",
		"pattern",
		"formats",
		"validate$data",
		"func",
		"obj",
		"Error"
	]);
	var removedOptions = {
		errorDataPath: "",
		format: "`validateFormats: false` can be used instead.",
		nullable: "\"nullable\" keyword is supported by default.",
		jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		sourceCode: "Use option `code: {source: true}`",
		strictDefaults: "It is default now, see option `strict`.",
		strictKeywords: "It is default now, see option `strict`.",
		uniqueItems: "\"uniqueItems\" keyword is always validated.",
		unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		cache: "Map is used as cache, schema object as key.",
		serialize: "Map is used as cache, schema object as key.",
		ajvErrors: "It is default now."
	};
	var deprecatedOptions = {
		ignoreKeywordsWithRef: "",
		jsPropertySyntax: "",
		unicode: "\"minLength\"/\"maxLength\" account for unicode characters by default."
	};
	var MAX_EXPRESSION = 200;
	function requiredOptions(o) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		const s = o.strict;
		const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
		const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		return {
			strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
			strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
			strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
			strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
			strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
			code: o.code ? {
				...o.code,
				optimize,
				regExp
			} : {
				optimize,
				regExp
			},
			loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
			loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
			meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
			messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
			inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
			schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
			addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
			validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
			validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
			unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
			int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
			uriResolver
		};
	}
	var Ajv = class {
		constructor(opts = {}) {
			this.schemas = {};
			this.refs = {};
			this.formats = Object.create(null);
			this._compilations = /* @__PURE__ */ new Set();
			this._loading = {};
			this._cache = /* @__PURE__ */ new Map();
			opts = this.opts = {
				...opts,
				...requiredOptions(opts)
			};
			const { es5, lines } = this.opts.code;
			this.scope = new codegen_2.ValueScope({
				scope: {},
				prefixes: EXT_SCOPE_NAMES,
				es5,
				lines
			});
			this.logger = getLogger(opts.logger);
			const formatOpt = opts.validateFormats;
			opts.validateFormats = false;
			this.RULES = (0, rules_1.getRules)();
			checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
			checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
			this._metaOpts = getMetaSchemaOptions.call(this);
			if (opts.formats) addInitialFormats.call(this);
			this._addVocabularies();
			this._addDefaultMetaSchema();
			if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
			if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
			addInitialSchemas.call(this);
			opts.validateFormats = formatOpt;
		}
		_addVocabularies() {
			this.addKeyword("$async");
		}
		_addDefaultMetaSchema() {
			const { $data, meta, schemaId } = this.opts;
			let _dataRefSchema = $dataRefSchema;
			if (schemaId === "id") {
				_dataRefSchema = { ...$dataRefSchema };
				_dataRefSchema.id = _dataRefSchema.$id;
				delete _dataRefSchema.$id;
			}
			if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		}
		defaultMeta() {
			const { meta, schemaId } = this.opts;
			return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
		}
		validate(schemaKeyRef, data) {
			let v;
			if (typeof schemaKeyRef == "string") {
				v = this.getSchema(schemaKeyRef);
				if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
			} else v = this.compile(schemaKeyRef);
			const valid = v(data);
			if (!("$async" in v)) this.errors = v.errors;
			return valid;
		}
		compile(schema, _meta) {
			const sch = this._addSchema(schema, _meta);
			return sch.validate || this._compileSchemaEnv(sch);
		}
		compileAsync(schema, meta) {
			if (typeof this.opts.loadSchema != "function") throw new Error("options.loadSchema should be a function");
			const { loadSchema } = this.opts;
			return runCompileAsync.call(this, schema, meta);
			async function runCompileAsync(_schema, _meta) {
				await loadMetaSchema.call(this, _schema.$schema);
				const sch = this._addSchema(_schema, _meta);
				return sch.validate || _compileAsync.call(this, sch);
			}
			async function loadMetaSchema($ref) {
				if ($ref && !this.getSchema($ref)) await runCompileAsync.call(this, { $ref }, true);
			}
			async function _compileAsync(sch) {
				try {
					return this._compileSchemaEnv(sch);
				} catch (e) {
					if (!(e instanceof ref_error_1.default)) throw e;
					checkLoaded.call(this, e);
					await loadMissingSchema.call(this, e.missingSchema);
					return _compileAsync.call(this, sch);
				}
			}
			function checkLoaded({ missingSchema: ref, missingRef }) {
				if (this.refs[ref]) throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
			}
			async function loadMissingSchema(ref) {
				const _schema = await _loadSchema.call(this, ref);
				if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
				if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
			}
			async function _loadSchema(ref) {
				const p = this._loading[ref];
				if (p) return p;
				try {
					return await (this._loading[ref] = loadSchema(ref));
				} finally {
					delete this._loading[ref];
				}
			}
		}
		addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
			if (Array.isArray(schema)) {
				for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
				return this;
			}
			let id;
			if (typeof schema === "object") {
				const { schemaId } = this.opts;
				id = schema[schemaId];
				if (id !== void 0 && typeof id != "string") throw new Error(`schema ${schemaId} must be string`);
			}
			key = (0, resolve_1.normalizeId)(key || id);
			this._checkUnique(key);
			this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
			return this;
		}
		addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
			this.addSchema(schema, key, true, _validateSchema);
			return this;
		}
		validateSchema(schema, throwOrLogError) {
			if (typeof schema == "boolean") return true;
			let $schema;
			$schema = schema.$schema;
			if ($schema !== void 0 && typeof $schema != "string") throw new Error("$schema must be a string");
			$schema = $schema || this.opts.defaultMeta || this.defaultMeta();
			if (!$schema) {
				this.logger.warn("meta-schema not available");
				this.errors = null;
				return true;
			}
			const valid = this.validate($schema, schema);
			if (!valid && throwOrLogError) {
				const message = "schema is invalid: " + this.errorsText();
				if (this.opts.validateSchema === "log") this.logger.error(message);
				else throw new Error(message);
			}
			return valid;
		}
		getSchema(keyRef) {
			let sch;
			while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
			if (sch === void 0) {
				const { schemaId } = this.opts;
				const root = new compile_1.SchemaEnv({
					schema: {},
					schemaId
				});
				sch = compile_1.resolveSchema.call(this, root, keyRef);
				if (!sch) return;
				this.refs[keyRef] = sch;
			}
			return sch.validate || this._compileSchemaEnv(sch);
		}
		removeSchema(schemaKeyRef) {
			if (schemaKeyRef instanceof RegExp) {
				this._removeAllSchemas(this.schemas, schemaKeyRef);
				this._removeAllSchemas(this.refs, schemaKeyRef);
				return this;
			}
			switch (typeof schemaKeyRef) {
				case "undefined":
					this._removeAllSchemas(this.schemas);
					this._removeAllSchemas(this.refs);
					this._cache.clear();
					return this;
				case "string": {
					const sch = getSchEnv.call(this, schemaKeyRef);
					if (typeof sch == "object") this._cache.delete(sch.schema);
					delete this.schemas[schemaKeyRef];
					delete this.refs[schemaKeyRef];
					return this;
				}
				case "object": {
					const cacheKey = schemaKeyRef;
					this._cache.delete(cacheKey);
					let id = schemaKeyRef[this.opts.schemaId];
					if (id) {
						id = (0, resolve_1.normalizeId)(id);
						delete this.schemas[id];
						delete this.refs[id];
					}
					return this;
				}
				default: throw new Error("ajv.removeSchema: invalid parameter");
			}
		}
		addVocabulary(definitions) {
			for (const def of definitions) this.addKeyword(def);
			return this;
		}
		addKeyword(kwdOrDef, def) {
			let keyword;
			if (typeof kwdOrDef == "string") {
				keyword = kwdOrDef;
				if (typeof def == "object") {
					this.logger.warn("these parameters are deprecated, see docs for addKeyword");
					def.keyword = keyword;
				}
			} else if (typeof kwdOrDef == "object" && def === void 0) {
				def = kwdOrDef;
				keyword = def.keyword;
				if (Array.isArray(keyword) && !keyword.length) throw new Error("addKeywords: keyword must be string or non-empty array");
			} else throw new Error("invalid addKeywords parameters");
			checkKeyword.call(this, keyword, def);
			if (!def) {
				(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
				return this;
			}
			keywordMetaschema.call(this, def);
			const definition = {
				...def,
				type: (0, dataType_1.getJSONTypes)(def.type),
				schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
			};
			(0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
			return this;
		}
		getKeyword(keyword) {
			const rule = this.RULES.all[keyword];
			return typeof rule == "object" ? rule.definition : !!rule;
		}
		removeKeyword(keyword) {
			const { RULES } = this;
			delete RULES.keywords[keyword];
			delete RULES.all[keyword];
			for (const group of RULES.rules) {
				const i = group.rules.findIndex((rule) => rule.keyword === keyword);
				if (i >= 0) group.rules.splice(i, 1);
			}
			return this;
		}
		addFormat(name, format) {
			if (typeof format == "string") format = new RegExp(format);
			this.formats[name] = format;
			return this;
		}
		errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
			if (!errors || errors.length === 0) return "No errors";
			return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
		}
		$dataMetaSchema(metaSchema, keywordsJsonPointers) {
			const rules = this.RULES.all;
			metaSchema = JSON.parse(JSON.stringify(metaSchema));
			for (const jsonPointer of keywordsJsonPointers) {
				const segments = jsonPointer.split("/").slice(1);
				let keywords = metaSchema;
				for (const seg of segments) keywords = keywords[seg];
				for (const key in rules) {
					const rule = rules[key];
					if (typeof rule != "object") continue;
					const { $data } = rule.definition;
					const schema = keywords[key];
					if ($data && schema) keywords[key] = schemaOrData(schema);
				}
			}
			return metaSchema;
		}
		_removeAllSchemas(schemas, regex) {
			for (const keyRef in schemas) {
				const sch = schemas[keyRef];
				if (!regex || regex.test(keyRef)) {
					if (typeof sch == "string") delete schemas[keyRef];
					else if (sch && !sch.meta) {
						this._cache.delete(sch.schema);
						delete schemas[keyRef];
					}
				}
			}
		}
		_addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
			let id;
			const { schemaId } = this.opts;
			if (typeof schema == "object") id = schema[schemaId];
			else if (this.opts.jtd) throw new Error("schema must be object");
			else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
			let sch = this._cache.get(schema);
			if (sch !== void 0) return sch;
			baseId = (0, resolve_1.normalizeId)(id || baseId);
			const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
			sch = new compile_1.SchemaEnv({
				schema,
				schemaId,
				meta,
				baseId,
				localRefs
			});
			this._cache.set(sch.schema, sch);
			if (addSchema && !baseId.startsWith("#")) {
				if (baseId) this._checkUnique(baseId);
				this.refs[baseId] = sch;
			}
			if (validateSchema) this.validateSchema(schema, true);
			return sch;
		}
		_checkUnique(id) {
			if (this.schemas[id] || this.refs[id]) throw new Error(`schema with key or id "${id}" already exists`);
		}
		_compileSchemaEnv(sch) {
			if (sch.meta) this._compileMetaSchema(sch);
			else compile_1.compileSchema.call(this, sch);
			/* istanbul ignore if */
			if (!sch.validate) throw new Error("ajv implementation error");
			return sch.validate;
		}
		_compileMetaSchema(sch) {
			const currentOpts = this.opts;
			this.opts = this._metaOpts;
			try {
				compile_1.compileSchema.call(this, sch);
			} finally {
				this.opts = currentOpts;
			}
		}
	};
	Ajv.ValidationError = validation_error_1.default;
	Ajv.MissingRefError = ref_error_1.default;
	exports.default = Ajv;
	function checkOptions(checkOpts, options, msg, log = "error") {
		for (const key in checkOpts) {
			const opt = key;
			if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		}
	}
	function getSchEnv(keyRef) {
		keyRef = (0, resolve_1.normalizeId)(keyRef);
		return this.schemas[keyRef] || this.refs[keyRef];
	}
	function addInitialSchemas() {
		const optsSchemas = this.opts.schemas;
		if (!optsSchemas) return;
		if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
		else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
	}
	function addInitialFormats() {
		for (const name in this.opts.formats) {
			const format = this.opts.formats[name];
			if (format) this.addFormat(name, format);
		}
	}
	function addInitialKeywords(defs) {
		if (Array.isArray(defs)) {
			this.addVocabulary(defs);
			return;
		}
		this.logger.warn("keywords option as map is deprecated, pass array");
		for (const keyword in defs) {
			const def = defs[keyword];
			if (!def.keyword) def.keyword = keyword;
			this.addKeyword(def);
		}
	}
	function getMetaSchemaOptions() {
		const metaOpts = { ...this.opts };
		for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
		return metaOpts;
	}
	var noLogs = {
		log() {},
		warn() {},
		error() {}
	};
	function getLogger(logger) {
		if (logger === false) return noLogs;
		if (logger === void 0) return console;
		if (logger.log && logger.warn && logger.error) return logger;
		throw new Error("logger must implement log, warn and error methods");
	}
	var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
	function checkKeyword(keyword, def) {
		const { RULES } = this;
		(0, util_1.eachItem)(keyword, (kwd) => {
			if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
			if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
		});
		if (!def) return;
		if (def.$data && !("code" in def || "validate" in def)) throw new Error("$data keyword must have \"code\" or \"validate\" function");
	}
	function addRule(keyword, definition, dataType) {
		var _a;
		const post = definition === null || definition === void 0 ? void 0 : definition.post;
		if (dataType && post) throw new Error("keyword with \"post\" flag cannot have \"type\"");
		const { RULES } = this;
		let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		if (!ruleGroup) {
			ruleGroup = {
				type: dataType,
				rules: []
			};
			RULES.rules.push(ruleGroup);
		}
		RULES.keywords[keyword] = true;
		if (!definition) return;
		const rule = {
			keyword,
			definition: {
				...definition,
				type: (0, dataType_1.getJSONTypes)(definition.type),
				schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
			}
		};
		if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
		else ruleGroup.rules.push(rule);
		RULES.all[keyword] = rule;
		(_a = definition.implements) === null || _a === void 0 || _a.forEach((kwd) => this.addKeyword(kwd));
	}
	function addBeforeRule(ruleGroup, rule, before) {
		const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		if (i >= 0) ruleGroup.rules.splice(i, 0, rule);
		else {
			ruleGroup.rules.push(rule);
			this.logger.warn(`rule ${before} is not defined`);
		}
	}
	function keywordMetaschema(def) {
		let { metaSchema } = def;
		if (metaSchema === void 0) return;
		if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
		def.validateSchema = this.compile(metaSchema, true);
	}
	var $dataRef = { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" };
	function schemaOrData(schema) {
		return { anyOf: [schema, $dataRef] };
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callRef = exports.getValidate = void 0;
	var ref_error_1 = require_ref_error();
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var util_1 = require_util();
	var def = {
		keyword: "$ref",
		schemaType: "string",
		code(cxt) {
			const { gen, schema: $ref, it } = cxt;
			const { baseId, schemaEnv: env, validateName, opts, self } = it;
			const { root } = env;
			if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
			const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
			if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
			if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
			return inlineRefSchema(schOrEnv);
			function callRootRef() {
				if (env === root) return callRef(cxt, validateName, env, env.$async);
				const rootName = gen.scopeValue("root", { ref: root });
				return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
			}
			function callValidate(sch) {
				callRef(cxt, getValidate(cxt, sch), sch, sch.$async);
			}
			function inlineRefSchema(sch) {
				const schName = gen.scopeValue("schema", opts.code.source === true ? {
					ref: sch,
					code: (0, codegen_1.stringify)(sch)
				} : { ref: sch });
				const valid = gen.name("valid");
				const schCxt = cxt.subschema({
					schema: sch,
					dataTypes: [],
					schemaPath: codegen_1.nil,
					topSchemaRef: schName,
					errSchemaPath: $ref
				}, valid);
				cxt.mergeEvaluated(schCxt);
				cxt.ok(valid);
			}
		}
	};
	function getValidate(cxt, sch) {
		const { gen } = cxt;
		return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	exports.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
		const { gen, it } = cxt;
		const { allErrors, schemaEnv: env, opts } = it;
		const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
		if ($async) callAsyncRef();
		else callSyncRef();
		function callAsyncRef() {
			if (!env.$async) throw new Error("async schema referenced by sync schema");
			const valid = gen.let("valid");
			gen.try(() => {
				gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
				addEvaluatedFrom(v);
				if (!allErrors) gen.assign(valid, true);
			}, (e) => {
				gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
				addErrorsFrom(e);
				if (!allErrors) gen.assign(valid, false);
			});
			cxt.ok(valid);
		}
		function callSyncRef() {
			cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
		}
		function addErrorsFrom(source) {
			const errs = (0, codegen_1._)`${source}.errors`;
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
			gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
		}
		function addEvaluatedFrom(source) {
			var _a;
			if (!it.opts.unevaluated) return;
			const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
			if (it.props !== true) {
				if (schEvaluated && !schEvaluated.dynamicProps) {
					if (schEvaluated.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
				} else {
					const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
					it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
				}
			}
			if (it.items !== true) {
				if (schEvaluated && !schEvaluated.dynamicItems) {
					if (schEvaluated.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
				} else {
					const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
					it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
				}
			}
		}
	}
	exports.callRef = callRef;
	exports.default = def;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/core/index.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var id_1 = require_id();
	var ref_1 = require_ref();
	exports.default = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		maximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		minimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		exclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		exclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.default = {
		keyword: Object.keys(KWDs),
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "multipleOf",
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
			params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, it } = cxt;
			const prec = it.opts.multipleOfPrecision;
			const res = gen.let("res");
			const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
			cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function ucs2length(str) {
		const len = str.length;
		let length = 0;
		let pos = 0;
		let value;
		while (pos < len) {
			length++;
			value = str.charCodeAt(pos++);
			if (value >= 55296 && value <= 56319 && pos < len) {
				value = str.charCodeAt(pos);
				if ((value & 64512) === 56320) pos++;
			}
		}
		return length;
	}
	exports.default = ucs2length;
	ucs2length.code = "require(\"ajv/dist/runtime/ucs2length\").default";
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var ucs2length_1 = require_ucs2length();
	exports.default = {
		keyword: ["maxLength", "minLength"],
		type: "string",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxLength" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode, it } = cxt;
			const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
			const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
			cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var util_1 = require_util();
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "pattern",
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const u = it.opts.unicodeRegExp ? "u" : "";
			if ($data) {
				const { regExp } = it.opts.code;
				const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
				const valid = gen.let("valid");
				gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
				cxt.fail$data((0, codegen_1._)`!${valid}`);
			} else {
				const regExp = (0, code_1.usePattern)(cxt, schema);
				cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxProperties", "minProperties"],
		type: "object",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxProperties" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "required",
		type: "object",
		schemaType: "array",
		$data: true,
		error: {
			message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
			params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
		},
		code(cxt) {
			const { gen, schema, schemaCode, data, $data, it } = cxt;
			const { opts } = it;
			if (!$data && schema.length === 0) return;
			const useLoop = schema.length >= opts.loopRequired;
			if (it.allErrors) allErrorsMode();
			else exitOnErrorMode();
			if (opts.strictRequired) {
				const props = cxt.parentSchema.properties;
				const { definedProperties } = cxt.it;
				for (const requiredKey of schema) if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
					const msg = `required property "${requiredKey}" is not defined at "${it.schemaEnv.baseId + it.errSchemaPath}" (strictRequired)`;
					(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
				}
			}
			function allErrorsMode() {
				if (useLoop || $data) cxt.block$data(codegen_1.nil, loopAllRequired);
				else for (const prop of schema) (0, code_1.checkReportMissingProp)(cxt, prop);
			}
			function exitOnErrorMode() {
				const missing = gen.let("missing");
				if (useLoop || $data) {
					const valid = gen.let("valid", true);
					cxt.block$data(valid, () => loopUntilMissing(missing, valid));
					cxt.ok(valid);
				} else {
					gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
					(0, code_1.reportMissingProp)(cxt, missing);
					gen.else();
				}
			}
			function loopAllRequired() {
				gen.forOf("prop", schemaCode, (prop) => {
					cxt.setParams({ missingProperty: prop });
					gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
				});
			}
			function loopUntilMissing(missing, valid) {
				cxt.setParams({ missingProperty: missing });
				gen.forOf(missing, schemaCode, () => {
					gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
					gen.if((0, codegen_1.not)(valid), () => {
						cxt.error();
						gen.break();
					});
				}, codegen_1.nil);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxItems", "minItems"],
		type: "array",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxItems" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/runtime/equal.js
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dataType_1 = require_dataType();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "uniqueItems",
		type: "array",
		schemaType: "boolean",
		$data: true,
		error: {
			message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
			params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
			if (!$data && !schema) return;
			const valid = gen.let("valid");
			const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
			cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
			cxt.ok(valid);
			function validateUniqueItems() {
				const i = gen.let("i", (0, codegen_1._)`${data}.length`);
				const j = gen.let("j");
				cxt.setParams({
					i,
					j
				});
				gen.assign(valid, true);
				gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
			}
			function canOptimize() {
				return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
			}
			function loopN(i, j) {
				const item = gen.name("item");
				const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
				const indices = gen.const("indices", (0, codegen_1._)`{}`);
				gen.for((0, codegen_1._)`;${i}--;`, () => {
					gen.let(item, (0, codegen_1._)`${data}[${i}]`);
					gen.if(wrongType, (0, codegen_1._)`continue`);
					if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
					gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
						gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
						cxt.error();
						gen.assign(valid, false).break();
					}).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
				});
			}
			function loopN2(i, j) {
				const eql = (0, util_1.useFunc)(gen, equal_1.default);
				const outer = gen.name("outer");
				gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
					cxt.error();
					gen.assign(valid, false).break(outer);
				})));
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "const",
		$data: true,
		error: {
			message: "must be equal to constant",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schemaCode, schema } = cxt;
			if ($data || schema && typeof schema == "object") cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
			else cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "enum",
		schemaType: "array",
		$data: true,
		error: {
			message: "must be equal to one of the allowed values",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
			const useLoop = schema.length >= it.opts.loopEnum;
			let eql;
			const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
			let valid;
			if (useLoop || $data) {
				valid = gen.let("valid");
				cxt.block$data(valid, loopEnum);
			} else {
				/* istanbul ignore if */
				if (!Array.isArray(schema)) throw new Error("ajv implementation error");
				const vSchema = gen.const("vSchema", schemaCode);
				valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
			}
			cxt.pass(valid);
			function loopEnum() {
				gen.assign(valid, false);
				gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
			}
			function equalCode(vSchema, i) {
				const sch = schema[i];
				return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var limitNumber_1 = require_limitNumber();
	var multipleOf_1 = require_multipleOf();
	var limitLength_1 = require_limitLength();
	var pattern_1 = require_pattern();
	var limitProperties_1 = require_limitProperties();
	var required_1 = require_required();
	var limitItems_1 = require_limitItems();
	var uniqueItems_1 = require_uniqueItems();
	var const_1 = require_const();
	var enum_1 = require_enum();
	exports.default = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateAdditionalItems = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "additionalItems",
		type: "array",
		schemaType: ["boolean", "object"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { parentSchema, it } = cxt;
			const { items } = parentSchema;
			if (!Array.isArray(items)) {
				(0, util_1.checkStrictMode)(it, "\"additionalItems\" is ignored when \"items\" is not an array of schemas");
				return;
			}
			validateAdditionalItems(cxt, items);
		}
	};
	function validateAdditionalItems(cxt, items) {
		const { gen, schema, data, keyword, it } = cxt;
		it.items = true;
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		if (schema === false) {
			cxt.setParams({ len: items.length });
			cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
		} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
			const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
			gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
			cxt.ok(valid);
		}
		function validateItems(valid) {
			gen.forRange("i", items.length, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
			});
		}
	}
	exports.validateAdditionalItems = validateAdditionalItems;
	exports.default = def;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateTuple = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var def = {
		keyword: "items",
		type: "array",
		schemaType: [
			"object",
			"array",
			"boolean"
		],
		before: "uniqueItems",
		code(cxt) {
			const { schema, it } = cxt;
			if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
		const { gen, parentSchema, data, keyword, it } = cxt;
		checkStrictTuple(parentSchema);
		if (it.opts.unevaluated && schArr.length && it.items !== true) it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
		const valid = gen.name("valid");
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		schArr.forEach((sch, i) => {
			if ((0, util_1.alwaysValidSchema)(it, sch)) return;
			gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
				keyword,
				schemaProp: i,
				dataProp: i
			}, valid));
			cxt.ok(valid);
		});
		function checkStrictTuple(sch) {
			const { opts, errSchemaPath } = it;
			const l = schArr.length;
			const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
			if (opts.strictTuples && !fullTuple) {
				const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
				(0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
			}
		}
	}
	exports.validateTuple = validateTuple;
	exports.default = def;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var items_1 = require_items();
	exports.default = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var additionalItems_1 = require_additionalItems();
	exports.default = {
		keyword: "items",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { schema, parentSchema, it } = cxt;
			const { prefixItems } = parentSchema;
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
			else cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "contains",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		trackErrors: true,
		error: {
			message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
			params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			let min;
			let max;
			const { minContains, maxContains } = parentSchema;
			if (it.opts.next) {
				min = minContains === void 0 ? 1 : minContains;
				max = maxContains;
			} else min = 1;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			cxt.setParams({
				min,
				max
			});
			if (max === void 0 && min === 0) {
				(0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
				return;
			}
			if (max !== void 0 && min > max) {
				(0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
				cxt.fail();
				return;
			}
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				let cond = (0, codegen_1._)`${len} >= ${min}`;
				if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
				cxt.pass(cond);
				return;
			}
			it.items = true;
			const valid = gen.name("valid");
			if (max === void 0 && min === 1) validateItems(valid, () => gen.if(valid, () => gen.break()));
			else if (min === 0) {
				gen.let(valid, true);
				if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
			} else {
				gen.let(valid, false);
				validateItemsWithCount();
			}
			cxt.result(valid, () => cxt.reset());
			function validateItemsWithCount() {
				const schValid = gen.name("_valid");
				const count = gen.let("count", 0);
				validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
			}
			function validateItems(_valid, block) {
				gen.forRange("i", 0, len, (i) => {
					cxt.subschema({
						keyword: "contains",
						dataProp: i,
						dataPropType: util_1.Type.Num,
						compositeRule: true
					}, _valid);
					block();
				});
			}
			function checkLimits(count) {
				gen.code((0, codegen_1._)`${count}++`);
				if (max === void 0) gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
				else {
					gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
					if (min === 1) gen.assign(valid, true);
					else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	exports.error = {
		message: ({ params: { property, depsCount, deps } }) => {
			const property_ies = depsCount === 1 ? "property" : "properties";
			return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
		},
		params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
	};
	var def = {
		keyword: "dependencies",
		type: "object",
		schemaType: "object",
		error: exports.error,
		code(cxt) {
			const [propDeps, schDeps] = splitDependencies(cxt);
			validatePropertyDeps(cxt, propDeps);
			validateSchemaDeps(cxt, schDeps);
		}
	};
	function splitDependencies({ schema }) {
		const propertyDeps = {};
		const schemaDeps = {};
		for (const key in schema) {
			if (key === "__proto__") continue;
			const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
			deps[key] = schema[key];
		}
		return [propertyDeps, schemaDeps];
	}
	function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		const { gen, data, it } = cxt;
		if (Object.keys(propertyDeps).length === 0) return;
		const missing = gen.let("missing");
		for (const prop in propertyDeps) {
			const deps = propertyDeps[prop];
			if (deps.length === 0) continue;
			const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
			cxt.setParams({
				property: prop,
				depsCount: deps.length,
				deps: deps.join(", ")
			});
			if (it.allErrors) gen.if(hasProperty, () => {
				for (const depProp of deps) (0, code_1.checkReportMissingProp)(cxt, depProp);
			});
			else {
				gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
				(0, code_1.reportMissingProp)(cxt, missing);
				gen.else();
			}
		}
	}
	exports.validatePropertyDeps = validatePropertyDeps;
	function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		for (const prop in schemaDeps) {
			if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
			gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
				const schCxt = cxt.subschema({
					keyword,
					schemaProp: prop
				}, valid);
				cxt.mergeValidEvaluated(schCxt, valid);
			}, () => gen.var(valid, true));
			cxt.ok(valid);
		}
	}
	exports.validateSchemaDeps = validateSchemaDeps;
	exports.default = def;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "propertyNames",
		type: "object",
		schemaType: ["object", "boolean"],
		error: {
			message: "property name must be valid",
			params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			const valid = gen.name("valid");
			gen.forIn("key", data, (key) => {
				cxt.setParams({ propertyName: key });
				cxt.subschema({
					keyword: "propertyNames",
					data: key,
					dataTypes: ["string"],
					propertyName: key,
					compositeRule: true
				}, valid);
				gen.if((0, codegen_1.not)(valid), () => {
					cxt.error(true);
					if (!it.allErrors) gen.break();
				});
			});
			cxt.ok(valid);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var util_1 = require_util();
	exports.default = {
		keyword: "additionalProperties",
		type: ["object"],
		schemaType: ["boolean", "object"],
		allowUndefined: true,
		trackErrors: true,
		error: {
			message: "must NOT have additional properties",
			params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, opts } = it;
			it.props = true;
			if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
			const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
			const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
			checkAdditionalProperties();
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function checkAdditionalProperties() {
				gen.forIn("key", data, (key) => {
					if (!props.length && !patProps.length) additionalPropertyCode(key);
					else gen.if(isAdditional(key), () => additionalPropertyCode(key));
				});
			}
			function isAdditional(key) {
				let definedProp;
				if (props.length > 8) {
					const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
					definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
				} else if (props.length) definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
				else definedProp = codegen_1.nil;
				if (patProps.length) definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
				return (0, codegen_1.not)(definedProp);
			}
			function deleteAdditional(key) {
				gen.code((0, codegen_1._)`delete ${data}[${key}]`);
			}
			function additionalPropertyCode(key) {
				if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
					deleteAdditional(key);
					return;
				}
				if (schema === false) {
					cxt.setParams({ additionalProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					if (opts.removeAdditional === "failing") {
						applyAdditionalSchema(key, valid, false);
						gen.if((0, codegen_1.not)(valid), () => {
							cxt.reset();
							deleteAdditional(key);
						});
					} else {
						applyAdditionalSchema(key, valid);
						if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					}
				}
			}
			function applyAdditionalSchema(key, valid, errors) {
				const subschema = {
					keyword: "additionalProperties",
					dataProp: key,
					dataPropType: util_1.Type.Str
				};
				if (errors === false) Object.assign(subschema, {
					compositeRule: true,
					createErrors: false,
					allErrors: false
				});
				cxt.subschema(subschema, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var validate_1 = require_validate();
	var code_1 = require_code();
	var util_1 = require_util();
	var additionalProperties_1 = require_additionalProperties();
	exports.default = {
		keyword: "properties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
			const allProps = (0, code_1.allSchemaProperties)(schema);
			for (const prop of allProps) it.definedProperties.add(prop);
			if (it.opts.unevaluated && allProps.length && it.props !== true) it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
			const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
			if (properties.length === 0) return;
			const valid = gen.name("valid");
			for (const prop of properties) {
				if (hasDefault(prop)) applyPropertySchema(prop);
				else {
					gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
					applyPropertySchema(prop);
					if (!it.allErrors) gen.else().var(valid, true);
					gen.endIf();
				}
				cxt.it.definedProperties.add(prop);
				cxt.ok(valid);
			}
			function hasDefault(prop) {
				return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
			}
			function applyPropertySchema(prop) {
				cxt.subschema({
					keyword: "properties",
					schemaProp: prop,
					dataProp: prop
				}, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var util_2 = require_util();
	exports.default = {
		keyword: "patternProperties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, data, parentSchema, it } = cxt;
			const { opts } = it;
			const patterns = (0, code_1.allSchemaProperties)(schema);
			const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
			if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) return;
			const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
			const valid = gen.name("valid");
			if (it.props !== true && !(it.props instanceof codegen_1.Name)) it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
			const { props } = it;
			validatePatternProperties();
			function validatePatternProperties() {
				for (const pat of patterns) {
					if (checkProperties) checkMatchingProperties(pat);
					if (it.allErrors) validateProperties(pat);
					else {
						gen.var(valid, true);
						validateProperties(pat);
						gen.if(valid);
					}
				}
			}
			function checkMatchingProperties(pat) {
				for (const prop in checkProperties) if (new RegExp(pat).test(prop)) (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
			}
			function validateProperties(pat) {
				gen.forIn("key", data, (key) => {
					gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
						const alwaysValid = alwaysValidPatterns.includes(pat);
						if (!alwaysValid) cxt.subschema({
							keyword: "patternProperties",
							schemaProp: pat,
							dataProp: key,
							dataPropType: util_2.Type.Str
						}, valid);
						if (it.opts.unevaluated && props !== true) gen.assign((0, codegen_1._)`${props}[${key}]`, true);
						else if (!alwaysValid && !it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "not",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		code(cxt) {
			const { gen, schema, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				cxt.fail();
				return;
			}
			const valid = gen.name("valid");
			cxt.subschema({
				keyword: "not",
				compositeRule: true,
				createErrors: false,
				allErrors: false
			}, valid);
			cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
		},
		error: { message: "must NOT be valid" }
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "anyOf",
		schemaType: "array",
		trackErrors: true,
		code: require_code().validateUnion,
		error: { message: "must match a schema in anyOf" }
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "oneOf",
		schemaType: "array",
		trackErrors: true,
		error: {
			message: "must match exactly one schema in oneOf",
			params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			if (it.opts.discriminator && parentSchema.discriminator) return;
			const schArr = schema;
			const valid = gen.let("valid", false);
			const passing = gen.let("passing", null);
			const schValid = gen.name("_valid");
			cxt.setParams({ passing });
			gen.block(validateOneOf);
			cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
			function validateOneOf() {
				schArr.forEach((sch, i) => {
					let schCxt;
					if ((0, util_1.alwaysValidSchema)(it, sch)) gen.var(schValid, true);
					else schCxt = cxt.subschema({
						keyword: "oneOf",
						schemaProp: i,
						compositeRule: true
					}, schValid);
					if (i > 0) gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
					gen.if(schValid, () => {
						gen.assign(valid, true);
						gen.assign(passing, i);
						if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "allOf",
		schemaType: "array",
		code(cxt) {
			const { gen, schema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			const valid = gen.name("valid");
			schema.forEach((sch, i) => {
				if ((0, util_1.alwaysValidSchema)(it, sch)) return;
				const schCxt = cxt.subschema({
					keyword: "allOf",
					schemaProp: i
				}, valid);
				cxt.ok(valid);
				cxt.mergeEvaluated(schCxt);
			});
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "if",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		error: {
			message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
			params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
		},
		code(cxt) {
			const { gen, parentSchema, it } = cxt;
			if (parentSchema.then === void 0 && parentSchema.else === void 0) (0, util_1.checkStrictMode)(it, "\"if\" without \"then\" and \"else\" is ignored");
			const hasThen = hasSchema(it, "then");
			const hasElse = hasSchema(it, "else");
			if (!hasThen && !hasElse) return;
			const valid = gen.let("valid", true);
			const schValid = gen.name("_valid");
			validateIf();
			cxt.reset();
			if (hasThen && hasElse) {
				const ifClause = gen.let("ifClause");
				cxt.setParams({ ifClause });
				gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
			} else if (hasThen) gen.if(schValid, validateClause("then"));
			else gen.if((0, codegen_1.not)(schValid), validateClause("else"));
			cxt.pass(valid, () => cxt.error(true));
			function validateIf() {
				const schCxt = cxt.subschema({
					keyword: "if",
					compositeRule: true,
					createErrors: false,
					allErrors: false
				}, schValid);
				cxt.mergeEvaluated(schCxt);
			}
			function validateClause(keyword, ifClause) {
				return () => {
					const schCxt = cxt.subschema({ keyword }, schValid);
					gen.assign(valid, schValid);
					cxt.mergeValidEvaluated(schCxt, valid);
					if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
					else cxt.setParams({ ifClause: keyword });
				};
			}
		}
	};
	function hasSchema(it, keyword) {
		const schema = it.schema[keyword];
		return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	exports.default = def;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["then", "else"],
		schemaType: ["object", "boolean"],
		code({ keyword, parentSchema, it }) {
			if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var additionalItems_1 = require_additionalItems();
	var prefixItems_1 = require_prefixItems();
	var items_1 = require_items();
	var items2020_1 = require_items2020();
	var contains_1 = require_contains();
	var dependencies_1 = require_dependencies();
	var propertyNames_1 = require_propertyNames();
	var additionalProperties_1 = require_additionalProperties();
	var properties_1 = require_properties();
	var patternProperties_1 = require_patternProperties();
	var not_1 = require_not();
	var anyOf_1 = require_anyOf();
	var oneOf_1 = require_oneOf();
	var allOf_1 = require_allOf();
	var if_1 = require_if();
	var thenElse_1 = require_thenElse();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/format.js
var require_format$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "format",
		type: ["number", "string"],
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
		},
		code(cxt, ruleType) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const { opts, errSchemaPath, schemaEnv, self } = it;
			if (!opts.validateFormats) return;
			if ($data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
				const fType = gen.let("fType");
				const format = gen.let("format");
				gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
				cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
				function unknownFmt() {
					if (opts.strictSchema === false) return codegen_1.nil;
					return (0, codegen_1._)`${schemaCode} && !${format}`;
				}
				function invalidFmt() {
					const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
					const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
					return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
				}
			}
			function validateFormat() {
				const formatDef = self.formats[schema];
				if (!formatDef) {
					unknownFormat();
					return;
				}
				if (formatDef === true) return;
				const [fmtType, format, fmtRef] = getFormat(formatDef);
				if (fmtType === ruleType) cxt.pass(validCondition());
				function unknownFormat() {
					if (opts.strictSchema === false) {
						self.logger.warn(unknownMsg());
						return;
					}
					throw new Error(unknownMsg());
					function unknownMsg() {
						return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
					}
				}
				function getFormat(fmtDef) {
					const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
					const fmt = gen.scopeValue("formats", {
						key: schema,
						ref: fmtDef,
						code
					});
					if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) return [
						fmtDef.type || "string",
						fmtDef.validate,
						(0, codegen_1._)`${fmt}.validate`
					];
					return [
						"string",
						fmtDef,
						fmt
					];
				}
				function validCondition() {
					if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
						if (!schemaEnv.$async) throw new Error("async format in sync schema");
						return (0, codegen_1._)`await ${fmtRef}(${data})`;
					}
					return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/format/index.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$1().default];
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contentVocabulary = exports.metadataVocabulary = void 0;
	exports.metadataVocabulary = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples"
	];
	exports.contentVocabulary = [
		"contentMediaType",
		"contentEncoding",
		"contentSchema"
	];
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var types_1 = require_types();
	var compile_1 = require_compile();
	var ref_error_1 = require_ref_error();
	var util_1 = require_util();
	exports.default = {
		keyword: "discriminator",
		type: "object",
		schemaType: "object",
		error: {
			message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
			params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
		},
		code(cxt) {
			const { gen, data, schema, parentSchema, it } = cxt;
			const { oneOf } = parentSchema;
			if (!it.opts.discriminator) throw new Error("discriminator: requires discriminator option");
			const tagName = schema.propertyName;
			if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
			if (schema.mapping) throw new Error("discriminator: mapping is not supported");
			if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
			const valid = gen.let("valid", false);
			const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
			gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
				discrError: types_1.DiscrError.Tag,
				tag,
				tagName
			}));
			cxt.ok(valid);
			function validateMapping() {
				const mapping = getMapping();
				gen.if(false);
				for (const tagValue in mapping) {
					gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
					gen.assign(valid, applyTagSchema(mapping[tagValue]));
				}
				gen.else();
				cxt.error(false, {
					discrError: types_1.DiscrError.Mapping,
					tag,
					tagName
				});
				gen.endIf();
			}
			function applyTagSchema(schemaProp) {
				const _valid = gen.name("valid");
				const schCxt = cxt.subschema({
					keyword: "oneOf",
					schemaProp
				}, _valid);
				cxt.mergeEvaluated(schCxt, codegen_1.Name);
				return _valid;
			}
			function getMapping() {
				var _a;
				const oneOfMapping = {};
				const topRequired = hasRequired(parentSchema);
				let tagRequired = true;
				for (let i = 0; i < oneOf.length; i++) {
					let sch = oneOf[i];
					if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
						const ref = sch.$ref;
						sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
						if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
						if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
					}
					const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
					if (typeof propSch != "object") throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
					tagRequired = tagRequired && (topRequired || hasRequired(sch));
					addMappings(propSch, i);
				}
				if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
				return oneOfMapping;
				function hasRequired({ required }) {
					return Array.isArray(required) && required.includes(tagName);
				}
				function addMappings(sch, i) {
					if (sch.const) addMapping(sch.const, i);
					else if (sch.enum) for (const tagValue of sch.enum) addMapping(tagValue, i);
					else throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
				}
				function addMapping(tagValue, i) {
					if (typeof tagValue != "string" || tagValue in oneOfMapping) throw new Error(`discriminator: "${tagName}" values must be unique strings`);
					oneOfMapping[tagValue] = i;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/refs/json-schema-draft-07.json
var json_schema_draft_07_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id,
	$schema: () => $schema,
	default: () => json_schema_draft_07_default,
	definitions: () => definitions,
	properties: () => properties,
	title: () => title,
	type: () => type
});
var $schema, $id, title, definitions, type, properties, json_schema_draft_07_default;
var init_json_schema_draft_07 = __esmMin((() => {
	$schema = "http://json-schema.org/draft-07/schema#";
	$id = "http://json-schema.org/draft-07/schema#";
	title = "Core schema meta-schema";
	definitions = {
		"schemaArray": {
			"type": "array",
			"minItems": 1,
			"items": { "$ref": "#" }
		},
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	type = ["object", "boolean"];
	properties = {
		"$id": {
			"type": "string",
			"format": "uri-reference"
		},
		"$schema": {
			"type": "string",
			"format": "uri"
		},
		"$ref": {
			"type": "string",
			"format": "uri-reference"
		},
		"$comment": { "type": "string" },
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
		"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"additionalItems": { "$ref": "#" },
		"items": {
			"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
			"default": true
		},
		"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
		"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"contains": { "$ref": "#" },
		"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
		"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/definitions/stringArray" },
		"additionalProperties": { "$ref": "#" },
		"definitions": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"properties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependencies": {
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
		},
		"propertyNames": { "$ref": "#" },
		"const": true,
		"enum": {
			"type": "array",
			"items": true,
			"minItems": 1,
			"uniqueItems": true
		},
		"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/definitions/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"format": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentEncoding": { "type": "string" },
		"if": { "$ref": "#" },
		"then": { "$ref": "#" },
		"else": { "$ref": "#" },
		"allOf": { "$ref": "#/definitions/schemaArray" },
		"anyOf": { "$ref": "#/definitions/schemaArray" },
		"oneOf": { "$ref": "#/definitions/schemaArray" },
		"not": { "$ref": "#" }
	};
	json_schema_draft_07_default = {
		$schema,
		$id,
		title,
		definitions,
		type,
		properties,
		"default": true
	};
}));
//#endregion
//#region node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/ajv.js
var require_ajv = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
	var core_1 = require_core$1();
	var draft7_1 = require_draft7();
	var discriminator_1 = require_discriminator();
	var draft7MetaSchema = (init_json_schema_draft_07(), __toCommonJS(json_schema_draft_07_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
	var Ajv = class extends core_1.default {
		_addVocabularies() {
			super._addVocabularies();
			draft7_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			if (!this.opts.meta) return;
			const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
			this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv = Ajv;
	module.exports = exports = Ajv;
	module.exports.Ajv = Ajv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
	function fmtDef(validate, compare) {
		return {
			validate,
			compare
		};
	}
	exports.fullFormats = {
		date: fmtDef(date, compareDate),
		time: fmtDef(getTime(true), compareTime),
		"date-time": fmtDef(getDateTime(true), compareDateTime),
		"iso-time": fmtDef(getTime(), compareIsoTime),
		"iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
		duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
		uri,
		"uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
		"uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
		url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
		email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
		hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
		ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
		ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
		regex,
		uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
		"json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
		"json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
		"relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
		byte,
		int32: {
			type: "number",
			validate: validateInt32
		},
		int64: {
			type: "number",
			validate: validateInt64
		},
		float: {
			type: "number",
			validate: validateNumber
		},
		double: {
			type: "number",
			validate: validateNumber
		},
		password: true,
		binary: true
	};
	exports.fastFormats = {
		...exports.fullFormats,
		date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
		time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
		"date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
		"iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
		"iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
		uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
		"uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
		email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
	};
	exports.formatNames = Object.keys(exports.fullFormats);
	function isLeapYear(year) {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}
	var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
	var DAYS = [
		0,
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	function date(str) {
		const matches = DATE.exec(str);
		if (!matches) return false;
		const year = +matches[1];
		const month = +matches[2];
		const day = +matches[3];
		return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
	}
	function compareDate(d1, d2) {
		if (!(d1 && d2)) return void 0;
		if (d1 > d2) return 1;
		if (d1 < d2) return -1;
		return 0;
	}
	var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
	function getTime(strictTimeZone) {
		return function time(str) {
			const matches = TIME.exec(str);
			if (!matches) return false;
			const hr = +matches[1];
			const min = +matches[2];
			const sec = +matches[3];
			const tz = matches[4];
			const tzSign = matches[5] === "-" ? -1 : 1;
			const tzH = +(matches[6] || 0);
			const tzM = +(matches[7] || 0);
			if (tzH > 23 || tzM > 59 || strictTimeZone && !tz) return false;
			if (hr <= 23 && min <= 59 && sec < 60) return true;
			const utcMin = min - tzM * tzSign;
			const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
			return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
		};
	}
	function compareTime(s1, s2) {
		if (!(s1 && s2)) return void 0;
		const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
		const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
		if (!(t1 && t2)) return void 0;
		return t1 - t2;
	}
	function compareIsoTime(t1, t2) {
		if (!(t1 && t2)) return void 0;
		const a1 = TIME.exec(t1);
		const a2 = TIME.exec(t2);
		if (!(a1 && a2)) return void 0;
		t1 = a1[1] + a1[2] + a1[3];
		t2 = a2[1] + a2[2] + a2[3];
		if (t1 > t2) return 1;
		if (t1 < t2) return -1;
		return 0;
	}
	var DATE_TIME_SEPARATOR = /t|\s/i;
	function getDateTime(strictTimeZone) {
		const time = getTime(strictTimeZone);
		return function date_time(str) {
			const dateTime = str.split(DATE_TIME_SEPARATOR);
			return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
		};
	}
	function compareDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const d1 = new Date(dt1).valueOf();
		const d2 = new Date(dt2).valueOf();
		if (!(d1 && d2)) return void 0;
		return d1 - d2;
	}
	function compareIsoDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
		const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
		const res = compareDate(d1, d2);
		if (res === void 0) return void 0;
		return res || compareTime(t1, t2);
	}
	var NOT_URI_FRAGMENT = /\/|:/;
	var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
	function uri(str) {
		return NOT_URI_FRAGMENT.test(str) && URI.test(str);
	}
	var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
	function byte(str) {
		BYTE.lastIndex = 0;
		return BYTE.test(str);
	}
	var MIN_INT32 = -(2 ** 31);
	var MAX_INT32 = 2 ** 31 - 1;
	function validateInt32(value) {
		return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
	}
	function validateInt64(value) {
		return Number.isInteger(value);
	}
	function validateNumber() {
		return true;
	}
	var Z_ANCHOR = /[^\\]\\Z/;
	function regex(str) {
		if (Z_ANCHOR.test(str)) return false;
		try {
			new RegExp(str);
			return true;
		} catch (e) {
			return false;
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/limit.js
var require_limit = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatLimitDefinition = void 0;
	var ajv_1 = require_ajv();
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		formatMaximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		formatMinimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		formatExclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		formatExclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.formatLimitDefinition = {
		keyword: Object.keys(KWDs),
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, keyword, it } = cxt;
			const { opts, self } = it;
			if (!opts.validateFormats) return;
			const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
			if (fCxt.$data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
				cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
			}
			function validateFormat() {
				const format = fCxt.schema;
				const fmtDef = self.formats[format];
				if (!fmtDef || fmtDef === true) return;
				if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
				const fmt = gen.scopeValue("formats", {
					key: format,
					ref: fmtDef,
					code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
				});
				cxt.fail$data(compareCode(fmt));
			}
			function compareCode(fmt) {
				return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
			}
		},
		dependencies: ["format"]
	};
	var formatLimitPlugin = (ajv) => {
		ajv.addKeyword(exports.formatLimitDefinition);
		return ajv;
	};
	exports.default = formatLimitPlugin;
}));
//#endregion
//#region node_modules/.pnpm/ajv-formats@3.0.1_ajv@8.20.0/node_modules/ajv-formats/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var formats_1 = require_formats();
	var limit_1 = require_limit();
	var codegen_1 = require_codegen();
	var fullName = new codegen_1.Name("fullFormats");
	var fastName = new codegen_1.Name("fastFormats");
	var formatsPlugin = (ajv, opts = { keywords: true }) => {
		if (Array.isArray(opts)) {
			addFormats(ajv, opts, formats_1.fullFormats, fullName);
			return ajv;
		}
		const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
		addFormats(ajv, opts.formats || formats_1.formatNames, formats, exportName);
		if (opts.keywords) (0, limit_1.default)(ajv);
		return ajv;
	};
	formatsPlugin.get = (name, mode = "full") => {
		const f = (mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats)[name];
		if (!f) throw new Error(`Unknown format "${name}"`);
		return f;
	};
	function addFormats(ajv, list, fs, exportName) {
		var _a;
		var _b;
		(_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 || (_b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`);
		for (const f of list) ajv.addFormat(f, fs[f]);
	}
	module.exports = exports = formatsPlugin;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = formatsPlugin;
}));
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/validation/ajv-provider.js
var import_ajv = /* @__PURE__ */ __toESM(require_ajv(), 1);
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
function createDefaultAjvInstance() {
	const ajv = new import_ajv.default({
		strict: false,
		validateFormats: true,
		validateSchema: false,
		allErrors: true
	});
	(0, import_dist.default)(ajv);
	return ajv;
}
/**
* @example
* ```typescript
* // Use with default AJV instance (recommended)
* import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
* const validator = new AjvJsonSchemaValidator();
*
* // Use with custom AJV instance
* import { Ajv } from 'ajv';
* const ajv = new Ajv({ strict: true, allErrors: true });
* const validator = new AjvJsonSchemaValidator(ajv);
* ```
*/
var AjvJsonSchemaValidator = class {
	/**
	* Create an AJV validator
	*
	* @param ajv - Optional pre-configured AJV instance. If not provided, a default instance will be created.
	*
	* @example
	* ```typescript
	* // Use default configuration (recommended for most cases)
	* import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
	* const validator = new AjvJsonSchemaValidator();
	*
	* // Or provide custom AJV instance for advanced configuration
	* import { Ajv } from 'ajv';
	* import addFormats from 'ajv-formats';
	*
	* const ajv = new Ajv({ validateFormats: true });
	* addFormats(ajv);
	* const validator = new AjvJsonSchemaValidator(ajv);
	* ```
	*/
	constructor(ajv) {
		this._ajv = ajv ?? createDefaultAjvInstance();
	}
	/**
	* Create a validator for the given JSON Schema
	*
	* The validator is compiled once and can be reused multiple times.
	* If the schema has an $id, it will be cached by AJV automatically.
	*
	* @param schema - Standard JSON Schema object
	* @returns A validator function that validates input data
	*/
	getValidator(schema) {
		const ajvValidator = "$id" in schema && typeof schema.$id === "string" ? this._ajv.getSchema(schema.$id) ?? this._ajv.compile(schema) : this._ajv.compile(schema);
		return (input) => {
			if (ajvValidator(input)) return {
				valid: true,
				data: input,
				errorMessage: void 0
			};
			else return {
				valid: false,
				data: void 0,
				errorMessage: this._ajv.errorsText(ajvValidator.errors)
			};
		};
	}
};
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/server.js
/**
* Experimental server task features for MCP SDK.
* WARNING: These APIs are experimental and may change without notice.
*
* @experimental
*/
/**
* Experimental task features for low-level MCP servers.
*
* Access via `server.experimental.tasks`:
* ```typescript
* const stream = server.experimental.tasks.requestStream(request, schema, options);
* ```
*
* For high-level server usage with task-based tools, use `McpServer.experimental.tasks` instead.
*
* @experimental
*/
var ExperimentalServerTasks = class {
	constructor(_server) {
		this._server = _server;
	}
	/**
	* Sends a request and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* This method provides streaming access to request processing, allowing you to
	* observe intermediate task status updates for task-augmented requests.
	*
	* @param request - The request to send
	* @param resultSchema - Zod schema for validating the result
	* @param options - Optional request options (timeout, signal, task creation params, etc.)
	* @returns AsyncGenerator that yields ResponseMessage objects
	*
	* @experimental
	*/
	requestStream(request, resultSchema, options) {
		return this._server.requestStream(request, resultSchema, options);
	}
	/**
	* Sends a sampling request and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* For task-augmented requests, yields 'taskCreated' and 'taskStatus' messages
	* before the final result.
	*
	* @example
	* ```typescript
	* const stream = server.experimental.tasks.createMessageStream({
	*     messages: [{ role: 'user', content: { type: 'text', text: 'Hello' } }],
	*     maxTokens: 100
	* }, {
	*     onprogress: (progress) => {
	*         // Handle streaming tokens via progress notifications
	*         console.log('Progress:', progress.message);
	*     }
	* });
	*
	* for await (const message of stream) {
	*     switch (message.type) {
	*         case 'taskCreated':
	*             console.log('Task created:', message.task.taskId);
	*             break;
	*         case 'taskStatus':
	*             console.log('Task status:', message.task.status);
	*             break;
	*         case 'result':
	*             console.log('Final result:', message.result);
	*             break;
	*         case 'error':
	*             console.error('Error:', message.error);
	*             break;
	*     }
	* }
	* ```
	*
	* @param params - The sampling request parameters
	* @param options - Optional request options (timeout, signal, task creation params, onprogress, etc.)
	* @returns AsyncGenerator that yields ResponseMessage objects
	*
	* @experimental
	*/
	createMessageStream(params, options) {
		const clientCapabilities = this._server.getClientCapabilities();
		if ((params.tools || params.toolChoice) && !clientCapabilities?.sampling?.tools) throw new Error("Client does not support sampling tools capability.");
		if (params.messages.length > 0) {
			const lastMessage = params.messages[params.messages.length - 1];
			const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
			const hasToolResults = lastContent.some((c) => c.type === "tool_result");
			const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : void 0;
			const previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [];
			const hasPreviousToolUse = previousContent.some((c) => c.type === "tool_use");
			if (hasToolResults) {
				if (lastContent.some((c) => c.type !== "tool_result")) throw new Error("The last message must contain only tool_result content if any is present");
				if (!hasPreviousToolUse) throw new Error("tool_result blocks are not matching any tool_use from the previous message");
			}
			if (hasPreviousToolUse) {
				const toolUseIds = new Set(previousContent.filter((c) => c.type === "tool_use").map((c) => c.id));
				const toolResultIds = new Set(lastContent.filter((c) => c.type === "tool_result").map((c) => c.toolUseId));
				if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every((id) => toolResultIds.has(id))) throw new Error("ids of tool_result blocks and tool_use blocks from previous message do not match");
			}
		}
		return this.requestStream({
			method: "sampling/createMessage",
			params
		}, CreateMessageResultSchema, options);
	}
	/**
	* Sends an elicitation request and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* For task-augmented requests (especially URL-based elicitation), yields 'taskCreated'
	* and 'taskStatus' messages before the final result.
	*
	* @example
	* ```typescript
	* const stream = server.experimental.tasks.elicitInputStream({
	*     mode: 'url',
	*     message: 'Please authenticate',
	*     elicitationId: 'auth-123',
	*     url: 'https://example.com/auth'
	* }, {
	*     task: { ttl: 300000 } // Task-augmented for long-running auth flow
	* });
	*
	* for await (const message of stream) {
	*     switch (message.type) {
	*         case 'taskCreated':
	*             console.log('Task created:', message.task.taskId);
	*             break;
	*         case 'taskStatus':
	*             console.log('Task status:', message.task.status);
	*             break;
	*         case 'result':
	*             console.log('User action:', message.result.action);
	*             break;
	*         case 'error':
	*             console.error('Error:', message.error);
	*             break;
	*     }
	* }
	* ```
	*
	* @param params - The elicitation request parameters
	* @param options - Optional request options (timeout, signal, task creation params, etc.)
	* @returns AsyncGenerator that yields ResponseMessage objects
	*
	* @experimental
	*/
	elicitInputStream(params, options) {
		const clientCapabilities = this._server.getClientCapabilities();
		const mode = params.mode ?? "form";
		switch (mode) {
			case "url":
				if (!clientCapabilities?.elicitation?.url) throw new Error("Client does not support url elicitation.");
				break;
			case "form": if (!clientCapabilities?.elicitation?.form) throw new Error("Client does not support form elicitation.");
		}
		const normalizedParams = mode === "form" && params.mode === void 0 ? {
			...params,
			mode: "form"
		} : params;
		return this.requestStream({
			method: "elicitation/create",
			params: normalizedParams
		}, ElicitResultSchema, options);
	}
	/**
	* Gets the current status of a task.
	*
	* @param taskId - The task identifier
	* @param options - Optional request options
	* @returns The task status
	*
	* @experimental
	*/
	async getTask(taskId, options) {
		return this._server.getTask({ taskId }, options);
	}
	/**
	* Retrieves the result of a completed task.
	*
	* @param taskId - The task identifier
	* @param resultSchema - Zod schema for validating the result
	* @param options - Optional request options
	* @returns The task result
	*
	* @experimental
	*/
	async getTaskResult(taskId, resultSchema, options) {
		return this._server.getTaskResult({ taskId }, resultSchema, options);
	}
	/**
	* Lists tasks with optional pagination.
	*
	* @param cursor - Optional pagination cursor
	* @param options - Optional request options
	* @returns List of tasks with optional next cursor
	*
	* @experimental
	*/
	async listTasks(cursor, options) {
		return this._server.listTasks(cursor ? { cursor } : void 0, options);
	}
	/**
	* Cancels a running task.
	*
	* @param taskId - The task identifier
	* @param options - Optional request options
	*
	* @experimental
	*/
	async cancelTask(taskId, options) {
		return this._server.cancelTask({ taskId }, options);
	}
};
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/helpers.js
/**
* Experimental task capability assertion helpers.
* WARNING: These APIs are experimental and may change without notice.
*
* @experimental
*/
/**
* Asserts that task creation is supported for tools/call.
* Used by Client.assertTaskCapability and Server.assertTaskHandlerCapability.
*
* @param requests - The task requests capability object
* @param method - The method being checked
* @param entityName - 'Server' or 'Client' for error messages
* @throws Error if the capability is not supported
*
* @experimental
*/
function assertToolsCallTaskCapability(requests, method, entityName) {
	if (!requests) throw new Error(`${entityName} does not support task creation (required for ${method})`);
	switch (method) {
		case "tools/call": if (!requests.tools?.call) throw new Error(`${entityName} does not support task creation for tools/call (required for ${method})`);
	}
}
/**
* Asserts that task creation is supported for sampling/createMessage or elicitation/create.
* Used by Server.assertTaskCapability and Client.assertTaskHandlerCapability.
*
* @param requests - The task requests capability object
* @param method - The method being checked
* @param entityName - 'Server' or 'Client' for error messages
* @throws Error if the capability is not supported
*
* @experimental
*/
function assertClientRequestTaskCapability(requests, method, entityName) {
	if (!requests) throw new Error(`${entityName} does not support task creation (required for ${method})`);
	switch (method) {
		case "sampling/createMessage":
			if (!requests.sampling?.createMessage) throw new Error(`${entityName} does not support task creation for sampling/createMessage (required for ${method})`);
			break;
		case "elicitation/create": if (!requests.elicitation?.create) throw new Error(`${entityName} does not support task creation for elicitation/create (required for ${method})`);
	}
}
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js
/**
* An MCP server on top of a pluggable transport.
*
* This server will automatically respond to the initialization flow as initiated from the client.
*
* To use with custom types, extend the base Request/Notification/Result types and pass them as type parameters:
*
* ```typescript
* // Custom schemas
* const CustomRequestSchema = RequestSchema.extend({...})
* const CustomNotificationSchema = NotificationSchema.extend({...})
* const CustomResultSchema = ResultSchema.extend({...})
*
* // Type aliases
* type CustomRequest = z.infer<typeof CustomRequestSchema>
* type CustomNotification = z.infer<typeof CustomNotificationSchema>
* type CustomResult = z.infer<typeof CustomResultSchema>
*
* // Create typed server
* const server = new Server<CustomRequest, CustomNotification, CustomResult>({
*   name: "CustomServer",
*   version: "1.0.0"
* })
* ```
* @deprecated Use `McpServer` instead for the high-level API. Only use `Server` for advanced use cases.
*/
var Server = class extends Protocol {
	/**
	* Initializes this server with the given name and version information.
	*/
	constructor(_serverInfo, options) {
		super(options);
		this._serverInfo = _serverInfo;
		this._loggingLevels = /* @__PURE__ */ new Map();
		this.LOG_LEVEL_SEVERITY = new Map(LoggingLevelSchema.options.map((level, index) => [level, index]));
		this.isMessageIgnored = (level, sessionId) => {
			const currentLevel = this._loggingLevels.get(sessionId);
			return currentLevel ? this.LOG_LEVEL_SEVERITY.get(level) < this.LOG_LEVEL_SEVERITY.get(currentLevel) : false;
		};
		this._capabilities = options?.capabilities ?? {};
		this._instructions = options?.instructions;
		this._jsonSchemaValidator = options?.jsonSchemaValidator ?? new AjvJsonSchemaValidator();
		this.setRequestHandler(InitializeRequestSchema, (request) => this._oninitialize(request));
		this.setNotificationHandler(InitializedNotificationSchema, () => this.oninitialized?.());
		if (this._capabilities.logging) this.setRequestHandler(SetLevelRequestSchema, async (request, extra) => {
			const transportSessionId = extra.sessionId || extra.requestInfo?.headers["mcp-session-id"] || void 0;
			const { level } = request.params;
			const parseResult = LoggingLevelSchema.safeParse(level);
			if (parseResult.success) this._loggingLevels.set(transportSessionId, parseResult.data);
			return {};
		});
	}
	/**
	* Access experimental features.
	*
	* WARNING: These APIs are experimental and may change without notice.
	*
	* @experimental
	*/
	get experimental() {
		if (!this._experimental) this._experimental = { tasks: new ExperimentalServerTasks(this) };
		return this._experimental;
	}
	/**
	* Registers new capabilities. This can only be called before connecting to a transport.
	*
	* The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
	*/
	registerCapabilities(capabilities) {
		if (this.transport) throw new Error("Cannot register capabilities after connecting to transport");
		this._capabilities = mergeCapabilities(this._capabilities, capabilities);
	}
	/**
	* Override request handler registration to enforce server-side validation for tools/call.
	*/
	setRequestHandler(requestSchema, handler) {
		const methodSchema = getObjectShape(requestSchema)?.method;
		if (!methodSchema) throw new Error("Schema is missing a method literal");
		const methodValue = getLiteralValue(methodSchema);
		if (typeof methodValue !== "string") throw new Error("Schema method literal must be a string");
		if (methodValue === "tools/call") {
			const wrappedHandler = async (request, extra) => {
				const validatedRequest = safeParse(CallToolRequestSchema, request);
				if (!validatedRequest.success) {
					const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call request: ${errorMessage}`);
				}
				const { params } = validatedRequest.data;
				const result = await Promise.resolve(handler(request, extra));
				if (params.task) {
					const taskValidationResult = safeParse(CreateTaskResultSchema, result);
					if (!taskValidationResult.success) {
						const errorMessage = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
						throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
					}
					return taskValidationResult.data;
				}
				const validationResult = safeParse(CallToolResultSchema, result);
				if (!validationResult.success) {
					const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call result: ${errorMessage}`);
				}
				return validationResult.data;
			};
			return super.setRequestHandler(requestSchema, wrappedHandler);
		}
		return super.setRequestHandler(requestSchema, handler);
	}
	assertCapabilityForMethod(method) {
		switch (method) {
			case "sampling/createMessage":
				if (!this._clientCapabilities?.sampling) throw new Error(`Client does not support sampling (required for ${method})`);
				break;
			case "elicitation/create":
				if (!this._clientCapabilities?.elicitation) throw new Error(`Client does not support elicitation (required for ${method})`);
				break;
			case "roots/list": if (!this._clientCapabilities?.roots) throw new Error(`Client does not support listing roots (required for ${method})`);
		}
	}
	assertNotificationCapability(method) {
		switch (method) {
			case "notifications/message":
				if (!this._capabilities.logging) throw new Error(`Server does not support logging (required for ${method})`);
				break;
			case "notifications/resources/updated":
			case "notifications/resources/list_changed":
				if (!this._capabilities.resources) throw new Error(`Server does not support notifying about resources (required for ${method})`);
				break;
			case "notifications/tools/list_changed":
				if (!this._capabilities.tools) throw new Error(`Server does not support notifying of tool list changes (required for ${method})`);
				break;
			case "notifications/prompts/list_changed":
				if (!this._capabilities.prompts) throw new Error(`Server does not support notifying of prompt list changes (required for ${method})`);
				break;
			case "notifications/elicitation/complete": if (!this._clientCapabilities?.elicitation?.url) throw new Error(`Client does not support URL elicitation (required for ${method})`);
		}
	}
	assertRequestHandlerCapability(method) {
		if (!this._capabilities) return;
		switch (method) {
			case "completion/complete":
				if (!this._capabilities.completions) throw new Error(`Server does not support completions (required for ${method})`);
				break;
			case "logging/setLevel":
				if (!this._capabilities.logging) throw new Error(`Server does not support logging (required for ${method})`);
				break;
			case "prompts/get":
			case "prompts/list":
				if (!this._capabilities.prompts) throw new Error(`Server does not support prompts (required for ${method})`);
				break;
			case "resources/list":
			case "resources/templates/list":
			case "resources/read":
				if (!this._capabilities.resources) throw new Error(`Server does not support resources (required for ${method})`);
				break;
			case "tools/call":
			case "tools/list":
				if (!this._capabilities.tools) throw new Error(`Server does not support tools (required for ${method})`);
				break;
			case "tasks/get":
			case "tasks/list":
			case "tasks/result":
			case "tasks/cancel": if (!this._capabilities.tasks) throw new Error(`Server does not support tasks capability (required for ${method})`);
		}
	}
	assertTaskCapability(method) {
		assertClientRequestTaskCapability(this._clientCapabilities?.tasks?.requests, method, "Client");
	}
	assertTaskHandlerCapability(method) {
		if (!this._capabilities) return;
		assertToolsCallTaskCapability(this._capabilities.tasks?.requests, method, "Server");
	}
	async _oninitialize(request) {
		const requestedVersion = request.params.protocolVersion;
		this._clientCapabilities = request.params.capabilities;
		this._clientVersion = request.params.clientInfo;
		return {
			protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requestedVersion) ? requestedVersion : LATEST_PROTOCOL_VERSION,
			capabilities: this.getCapabilities(),
			serverInfo: this._serverInfo,
			...this._instructions && { instructions: this._instructions }
		};
	}
	/**
	* After initialization has completed, this will be populated with the client's reported capabilities.
	*/
	getClientCapabilities() {
		return this._clientCapabilities;
	}
	/**
	* After initialization has completed, this will be populated with information about the client's name and version.
	*/
	getClientVersion() {
		return this._clientVersion;
	}
	getCapabilities() {
		return this._capabilities;
	}
	async ping() {
		return this.request({ method: "ping" }, EmptyResultSchema);
	}
	async createMessage(params, options) {
		if (params.tools || params.toolChoice) {
			if (!this._clientCapabilities?.sampling?.tools) throw new Error("Client does not support sampling tools capability.");
		}
		if (params.messages.length > 0) {
			const lastMessage = params.messages[params.messages.length - 1];
			const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
			const hasToolResults = lastContent.some((c) => c.type === "tool_result");
			const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : void 0;
			const previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [];
			const hasPreviousToolUse = previousContent.some((c) => c.type === "tool_use");
			if (hasToolResults) {
				if (lastContent.some((c) => c.type !== "tool_result")) throw new Error("The last message must contain only tool_result content if any is present");
				if (!hasPreviousToolUse) throw new Error("tool_result blocks are not matching any tool_use from the previous message");
			}
			if (hasPreviousToolUse) {
				const toolUseIds = new Set(previousContent.filter((c) => c.type === "tool_use").map((c) => c.id));
				const toolResultIds = new Set(lastContent.filter((c) => c.type === "tool_result").map((c) => c.toolUseId));
				if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every((id) => toolResultIds.has(id))) throw new Error("ids of tool_result blocks and tool_use blocks from previous message do not match");
			}
		}
		if (params.tools) return this.request({
			method: "sampling/createMessage",
			params
		}, CreateMessageResultWithToolsSchema, options);
		return this.request({
			method: "sampling/createMessage",
			params
		}, CreateMessageResultSchema, options);
	}
	/**
	* Creates an elicitation request for the given parameters.
	* For backwards compatibility, `mode` may be omitted for form requests and will default to `'form'`.
	* @param params The parameters for the elicitation request.
	* @param options Optional request options.
	* @returns The result of the elicitation request.
	*/
	async elicitInput(params, options) {
		switch (params.mode ?? "form") {
			case "url": {
				if (!this._clientCapabilities?.elicitation?.url) throw new Error("Client does not support url elicitation.");
				const urlParams = params;
				return this.request({
					method: "elicitation/create",
					params: urlParams
				}, ElicitResultSchema, options);
			}
			case "form": {
				if (!this._clientCapabilities?.elicitation?.form) throw new Error("Client does not support form elicitation.");
				const formParams = params.mode === "form" ? params : {
					...params,
					mode: "form"
				};
				const result = await this.request({
					method: "elicitation/create",
					params: formParams
				}, ElicitResultSchema, options);
				if (result.action === "accept" && result.content && formParams.requestedSchema) try {
					const validationResult = this._jsonSchemaValidator.getValidator(formParams.requestedSchema)(result.content);
					if (!validationResult.valid) throw new McpError(ErrorCode.InvalidParams, `Elicitation response content does not match requested schema: ${validationResult.errorMessage}`);
				} catch (error) {
					if (error instanceof McpError) throw error;
					throw new McpError(ErrorCode.InternalError, `Error validating elicitation response: ${error instanceof Error ? error.message : String(error)}`);
				}
				return result;
			}
		}
	}
	/**
	* Creates a reusable callback that, when invoked, will send a `notifications/elicitation/complete`
	* notification for the specified elicitation ID.
	*
	* @param elicitationId The ID of the elicitation to mark as complete.
	* @param options Optional notification options. Useful when the completion notification should be related to a prior request.
	* @returns A function that emits the completion notification when awaited.
	*/
	createElicitationCompletionNotifier(elicitationId, options) {
		if (!this._clientCapabilities?.elicitation?.url) throw new Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
		return () => this.notification({
			method: "notifications/elicitation/complete",
			params: { elicitationId }
		}, options);
	}
	async listRoots(params, options) {
		return this.request({
			method: "roots/list",
			params
		}, ListRootsResultSchema, options);
	}
	/**
	* Sends a logging message to the client, if connected.
	* Note: You only need to send the parameters object, not the entire JSON RPC message
	* @see LoggingMessageNotification
	* @param params
	* @param sessionId optional for stateless and backward compatibility
	*/
	async sendLoggingMessage(params, sessionId) {
		if (this._capabilities.logging) {
			if (!this.isMessageIgnored(params.level, sessionId)) return this.notification({
				method: "notifications/message",
				params
			});
		}
	}
	async sendResourceUpdated(params) {
		return this.notification({
			method: "notifications/resources/updated",
			params
		});
	}
	async sendResourceListChanged() {
		return this.notification({ method: "notifications/resources/list_changed" });
	}
	async sendToolListChanged() {
		return this.notification({ method: "notifications/tools/list_changed" });
	}
	async sendPromptListChanged() {
		return this.notification({ method: "notifications/prompts/list_changed" });
	}
};
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/server/completable.js
var COMPLETABLE_SYMBOL = Symbol.for("mcp.completable");
/**
* Checks if a schema is completable (has completion metadata).
*/
function isCompletable(schema) {
	return !!schema && typeof schema === "object" && COMPLETABLE_SYMBOL in schema;
}
/**
* Gets the completer callback from a completable schema, if it exists.
*/
function getCompleter(schema) {
	return schema[COMPLETABLE_SYMBOL]?.complete;
}
var McpZodTypeKind;
(function(McpZodTypeKind) {
	McpZodTypeKind["Completable"] = "McpCompletable";
})(McpZodTypeKind || (McpZodTypeKind = {}));
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/shared/toolNameValidation.js
/**
* Tool name validation utilities according to SEP: Specify Format for Tool Names
*
* Tool names SHOULD be between 1 and 128 characters in length (inclusive).
* Tool names are case-sensitive.
* Allowed characters: uppercase and lowercase ASCII letters (A-Z, a-z), digits
* (0-9), underscore (_), dash (-), and dot (.).
* Tool names SHOULD NOT contain spaces, commas, or other special characters.
*/
/**
* Regular expression for valid tool names according to SEP-986 specification
*/
var TOOL_NAME_REGEX = /^[A-Za-z0-9._-]{1,128}$/;
/**
* Validates a tool name according to the SEP specification
* @param name - The tool name to validate
* @returns An object containing validation result and any warnings
*/
function validateToolName(name) {
	const warnings = [];
	if (name.length === 0) return {
		isValid: false,
		warnings: ["Tool name cannot be empty"]
	};
	if (name.length > 128) return {
		isValid: false,
		warnings: [`Tool name exceeds maximum length of 128 characters (current: ${name.length})`]
	};
	if (name.includes(" ")) warnings.push("Tool name contains spaces, which may cause parsing issues");
	if (name.includes(",")) warnings.push("Tool name contains commas, which may cause parsing issues");
	if (name.startsWith("-") || name.endsWith("-")) warnings.push("Tool name starts or ends with a dash, which may cause parsing issues in some contexts");
	if (name.startsWith(".") || name.endsWith(".")) warnings.push("Tool name starts or ends with a dot, which may cause parsing issues in some contexts");
	if (!TOOL_NAME_REGEX.test(name)) {
		const invalidChars = name.split("").filter((char) => !/[A-Za-z0-9._-]/.test(char)).filter((char, index, arr) => arr.indexOf(char) === index);
		warnings.push(`Tool name contains invalid characters: ${invalidChars.map((c) => `"${c}"`).join(", ")}`, "Allowed characters are: A-Z, a-z, 0-9, underscore (_), dash (-), and dot (.)");
		return {
			isValid: false,
			warnings
		};
	}
	return {
		isValid: true,
		warnings
	};
}
/**
* Issues warnings for non-conforming tool names
* @param name - The tool name that triggered the warnings
* @param warnings - Array of warning messages
*/
function issueToolNameWarning(name, warnings) {
	if (warnings.length > 0) {
		console.warn(`Tool name validation warning for "${name}":`);
		for (const warning of warnings) console.warn(`  - ${warning}`);
		console.warn("Tool registration will proceed, but this may cause compatibility issues.");
		console.warn("Consider updating the tool name to conform to the MCP tool naming standard.");
		console.warn("See SEP: Specify Format for Tool Names (https://github.com/modelcontextprotocol/modelcontextprotocol/issues/986) for more details.");
	}
}
/**
* Validates a tool name and issues warnings for non-conforming names
* @param name - The tool name to validate
* @returns true if the name is valid, false otherwise
*/
function validateAndWarnToolName(name) {
	const result = validateToolName(name);
	issueToolNameWarning(name, result.warnings);
	return result.isValid;
}
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/mcp-server.js
/**
* Experimental McpServer task features for MCP SDK.
* WARNING: These APIs are experimental and may change without notice.
*
* @experimental
*/
/**
* Experimental task features for McpServer.
*
* Access via `server.experimental.tasks`:
* ```typescript
* server.experimental.tasks.registerToolTask('long-running', config, handler);
* ```
*
* @experimental
*/
var ExperimentalMcpServerTasks = class {
	constructor(_mcpServer) {
		this._mcpServer = _mcpServer;
	}
	registerToolTask(name, config, handler) {
		const execution = {
			taskSupport: "required",
			...config.execution
		};
		if (execution.taskSupport === "forbidden") throw new Error(`Cannot register task-based tool '${name}' with taskSupport 'forbidden'. Use registerTool() instead.`);
		return this._mcpServer._createRegisteredTool(name, config.title, config.description, config.inputSchema, config.outputSchema, config.annotations, execution, config._meta, handler);
	}
};
//#endregion
//#region node_modules/.pnpm/@modelcontextprotocol+sdk@1.30.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/server/mcp.js
/**
* High-level MCP server that provides a simpler API for working with resources, tools, and prompts.
* For advanced usage (like sending notifications or setting custom request handlers), use the underlying
* Server instance available via the `server` property.
*/
var McpServer = class {
	constructor(serverInfo, options) {
		this._registeredResources = {};
		this._registeredResourceTemplates = {};
		this._registeredTools = {};
		this._registeredPrompts = {};
		this._toolHandlersInitialized = false;
		this._completionHandlerInitialized = false;
		this._resourceHandlersInitialized = false;
		this._promptHandlersInitialized = false;
		this.server = new Server(serverInfo, options);
	}
	/**
	* Access experimental features.
	*
	* WARNING: These APIs are experimental and may change without notice.
	*
	* @experimental
	*/
	get experimental() {
		if (!this._experimental) this._experimental = { tasks: new ExperimentalMcpServerTasks(this) };
		return this._experimental;
	}
	/**
	* Attaches to the given transport, starts it, and starts listening for messages.
	*
	* The `server` object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
	*/
	async connect(transport) {
		return await this.server.connect(transport);
	}
	/**
	* Closes the connection.
	*/
	async close() {
		await this.server.close();
	}
	setToolRequestHandlers() {
		if (this._toolHandlersInitialized) return;
		this.server.assertCanSetRequestHandler(getMethodValue(ListToolsRequestSchema));
		this.server.assertCanSetRequestHandler(getMethodValue(CallToolRequestSchema));
		this.server.registerCapabilities({ tools: { listChanged: true } });
		this.server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: Object.entries(this._registeredTools).filter(([, tool]) => tool.enabled).map(([name, tool]) => {
			const toolDefinition = {
				name,
				title: tool.title,
				description: tool.description,
				inputSchema: (() => {
					const obj = normalizeObjectSchema(tool.inputSchema);
					return obj ? toJsonSchemaCompat(obj, {
						strictUnions: true,
						pipeStrategy: "input"
					}) : EMPTY_OBJECT_JSON_SCHEMA;
				})(),
				annotations: tool.annotations,
				execution: tool.execution,
				_meta: tool._meta
			};
			if (tool.outputSchema) {
				const obj = normalizeObjectSchema(tool.outputSchema);
				if (obj) toolDefinition.outputSchema = toJsonSchemaCompat(obj, {
					strictUnions: true,
					pipeStrategy: "output"
				});
			}
			return toolDefinition;
		}) }));
		this.server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
			try {
				const tool = this._registeredTools[request.params.name];
				if (!tool) throw new McpError(ErrorCode.InvalidParams, `Tool ${request.params.name} not found`);
				if (!tool.enabled) throw new McpError(ErrorCode.InvalidParams, `Tool ${request.params.name} disabled`);
				const isTaskRequest = !!request.params.task;
				const taskSupport = tool.execution?.taskSupport;
				const isTaskHandler = "createTask" in tool.handler;
				if ((taskSupport === "required" || taskSupport === "optional") && !isTaskHandler) throw new McpError(ErrorCode.InternalError, `Tool ${request.params.name} has taskSupport '${taskSupport}' but was not registered with registerToolTask`);
				if (taskSupport === "required" && !isTaskRequest) throw new McpError(ErrorCode.MethodNotFound, `Tool ${request.params.name} requires task augmentation (taskSupport: 'required')`);
				if (taskSupport === "optional" && !isTaskRequest && isTaskHandler) return await this.handleAutomaticTaskPolling(tool, request, extra);
				const args = await this.validateToolInput(tool, request.params.arguments, request.params.name);
				const result = await this.executeToolHandler(tool, args, extra);
				if (isTaskRequest) return result;
				await this.validateToolOutput(tool, result, request.params.name);
				return result;
			} catch (error) {
				if (error instanceof McpError) {
					if (error.code === ErrorCode.UrlElicitationRequired) throw error;
				}
				return this.createToolError(error instanceof Error ? error.message : String(error));
			}
		});
		this._toolHandlersInitialized = true;
	}
	/**
	* Creates a tool error result.
	*
	* @param errorMessage - The error message.
	* @returns The tool error result.
	*/
	createToolError(errorMessage) {
		return {
			content: [{
				type: "text",
				text: errorMessage
			}],
			isError: true
		};
	}
	/**
	* Validates tool input arguments against the tool's input schema.
	*/
	async validateToolInput(tool, args, toolName) {
		if (!tool.inputSchema) return;
		const parseResult = await safeParseAsync(normalizeObjectSchema(tool.inputSchema) ?? tool.inputSchema, args);
		if (!parseResult.success) {
			const errorMessage = getParseErrorMessage("error" in parseResult ? parseResult.error : "Unknown error");
			throw new McpError(ErrorCode.InvalidParams, `Input validation error: Invalid arguments for tool ${toolName}: ${errorMessage}`);
		}
		return parseResult.data;
	}
	/**
	* Validates tool output against the tool's output schema.
	*/
	async validateToolOutput(tool, result, toolName) {
		if (!tool.outputSchema) return;
		if (!("content" in result)) return;
		if (result.isError) return;
		if (!result.structuredContent) throw new McpError(ErrorCode.InvalidParams, `Output validation error: Tool ${toolName} has an output schema but no structured content was provided`);
		const parseResult = await safeParseAsync(normalizeObjectSchema(tool.outputSchema), result.structuredContent);
		if (!parseResult.success) {
			const errorMessage = getParseErrorMessage("error" in parseResult ? parseResult.error : "Unknown error");
			throw new McpError(ErrorCode.InvalidParams, `Output validation error: Invalid structured content for tool ${toolName}: ${errorMessage}`);
		}
	}
	/**
	* Executes a tool handler (either regular or task-based).
	*/
	async executeToolHandler(tool, args, extra) {
		const handler = tool.handler;
		if ("createTask" in handler) {
			if (!extra.taskStore) throw new Error("No task store provided.");
			const taskExtra = {
				...extra,
				taskStore: extra.taskStore
			};
			if (tool.inputSchema) {
				const typedHandler = handler;
				return await Promise.resolve(typedHandler.createTask(args, taskExtra));
			} else {
				const typedHandler = handler;
				return await Promise.resolve(typedHandler.createTask(taskExtra));
			}
		}
		if (tool.inputSchema) {
			const typedHandler = handler;
			return await Promise.resolve(typedHandler(args, extra));
		} else {
			const typedHandler = handler;
			return await Promise.resolve(typedHandler(extra));
		}
	}
	/**
	* Handles automatic task polling for tools with taskSupport 'optional'.
	*/
	async handleAutomaticTaskPolling(tool, request, extra) {
		if (!extra.taskStore) throw new Error("No task store provided for task-capable tool.");
		const args = await this.validateToolInput(tool, request.params.arguments, request.params.name);
		const handler = tool.handler;
		const taskExtra = {
			...extra,
			taskStore: extra.taskStore
		};
		const createTaskResult = args ? await Promise.resolve(handler.createTask(args, taskExtra)) : await Promise.resolve(handler.createTask(taskExtra));
		const taskId = createTaskResult.task.taskId;
		let task = createTaskResult.task;
		const pollInterval = task.pollInterval ?? 5e3;
		while (task.status !== "completed" && task.status !== "failed" && task.status !== "cancelled") {
			await new Promise((resolve) => setTimeout(resolve, pollInterval));
			const updatedTask = await extra.taskStore.getTask(taskId);
			if (!updatedTask) throw new McpError(ErrorCode.InternalError, `Task ${taskId} not found during polling`);
			task = updatedTask;
		}
		return await extra.taskStore.getTaskResult(taskId);
	}
	setCompletionRequestHandler() {
		if (this._completionHandlerInitialized) return;
		this.server.assertCanSetRequestHandler(getMethodValue(CompleteRequestSchema));
		this.server.registerCapabilities({ completions: {} });
		this.server.setRequestHandler(CompleteRequestSchema, async (request) => {
			switch (request.params.ref.type) {
				case "ref/prompt":
					assertCompleteRequestPrompt(request);
					return this.handlePromptCompletion(request, request.params.ref);
				case "ref/resource":
					assertCompleteRequestResourceTemplate(request);
					return this.handleResourceCompletion(request, request.params.ref);
				default: throw new McpError(ErrorCode.InvalidParams, `Invalid completion reference: ${request.params.ref}`);
			}
		});
		this._completionHandlerInitialized = true;
	}
	async handlePromptCompletion(request, ref) {
		const prompt = this._registeredPrompts[ref.name];
		if (!prompt) throw new McpError(ErrorCode.InvalidParams, `Prompt ${ref.name} not found`);
		if (!prompt.enabled) throw new McpError(ErrorCode.InvalidParams, `Prompt ${ref.name} disabled`);
		if (!prompt.argsSchema) return EMPTY_COMPLETION_RESULT;
		const field = getObjectShape(prompt.argsSchema)?.[request.params.argument.name];
		if (!isCompletable(field)) return EMPTY_COMPLETION_RESULT;
		const completer = getCompleter(field);
		if (!completer) return EMPTY_COMPLETION_RESULT;
		return createCompletionResult(await completer(request.params.argument.value, request.params.context));
	}
	async handleResourceCompletion(request, ref) {
		const template = Object.values(this._registeredResourceTemplates).find((t) => t.resourceTemplate.uriTemplate.toString() === ref.uri);
		if (!template) {
			if (this._registeredResources[ref.uri]) return EMPTY_COMPLETION_RESULT;
			throw new McpError(ErrorCode.InvalidParams, `Resource template ${request.params.ref.uri} not found`);
		}
		const completer = template.resourceTemplate.completeCallback(request.params.argument.name);
		if (!completer) return EMPTY_COMPLETION_RESULT;
		return createCompletionResult(await completer(request.params.argument.value, request.params.context));
	}
	setResourceRequestHandlers() {
		if (this._resourceHandlersInitialized) return;
		this.server.assertCanSetRequestHandler(getMethodValue(ListResourcesRequestSchema));
		this.server.assertCanSetRequestHandler(getMethodValue(ListResourceTemplatesRequestSchema));
		this.server.assertCanSetRequestHandler(getMethodValue(ReadResourceRequestSchema));
		this.server.registerCapabilities({ resources: { listChanged: true } });
		this.server.setRequestHandler(ListResourcesRequestSchema, async (request, extra) => {
			const resources = Object.entries(this._registeredResources).filter(([_, resource]) => resource.enabled).map(([uri, resource]) => ({
				uri,
				name: resource.name,
				...resource.metadata
			}));
			const templateResources = [];
			for (const template of Object.values(this._registeredResourceTemplates)) {
				if (!template.resourceTemplate.listCallback) continue;
				const result = await template.resourceTemplate.listCallback(extra);
				for (const resource of result.resources) templateResources.push({
					...template.metadata,
					...resource
				});
			}
			return { resources: [...resources, ...templateResources] };
		});
		this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
			return { resourceTemplates: Object.entries(this._registeredResourceTemplates).map(([name, template]) => ({
				name,
				uriTemplate: template.resourceTemplate.uriTemplate.toString(),
				...template.metadata
			})) };
		});
		this.server.setRequestHandler(ReadResourceRequestSchema, async (request, extra) => {
			const uri = new URL(request.params.uri);
			const resource = this._registeredResources[uri.toString()];
			if (resource) {
				if (!resource.enabled) throw new McpError(ErrorCode.InvalidParams, `Resource ${uri} disabled`);
				return resource.readCallback(uri, extra);
			}
			for (const template of Object.values(this._registeredResourceTemplates)) {
				const variables = template.resourceTemplate.uriTemplate.match(uri.toString());
				if (variables) return template.readCallback(uri, variables, extra);
			}
			throw new McpError(ErrorCode.InvalidParams, `Resource ${uri} not found`);
		});
		this._resourceHandlersInitialized = true;
	}
	setPromptRequestHandlers() {
		if (this._promptHandlersInitialized) return;
		this.server.assertCanSetRequestHandler(getMethodValue(ListPromptsRequestSchema));
		this.server.assertCanSetRequestHandler(getMethodValue(GetPromptRequestSchema));
		this.server.registerCapabilities({ prompts: { listChanged: true } });
		this.server.setRequestHandler(ListPromptsRequestSchema, () => ({ prompts: Object.entries(this._registeredPrompts).filter(([, prompt]) => prompt.enabled).map(([name, prompt]) => {
			return {
				name,
				title: prompt.title,
				description: prompt.description,
				arguments: prompt.argsSchema ? promptArgumentsFromSchema(prompt.argsSchema) : void 0
			};
		}) }));
		this.server.setRequestHandler(GetPromptRequestSchema, async (request, extra) => {
			const prompt = this._registeredPrompts[request.params.name];
			if (!prompt) throw new McpError(ErrorCode.InvalidParams, `Prompt ${request.params.name} not found`);
			if (!prompt.enabled) throw new McpError(ErrorCode.InvalidParams, `Prompt ${request.params.name} disabled`);
			if (prompt.argsSchema) {
				const parseResult = await safeParseAsync(normalizeObjectSchema(prompt.argsSchema), request.params.arguments);
				if (!parseResult.success) {
					const errorMessage = getParseErrorMessage("error" in parseResult ? parseResult.error : "Unknown error");
					throw new McpError(ErrorCode.InvalidParams, `Invalid arguments for prompt ${request.params.name}: ${errorMessage}`);
				}
				const args = parseResult.data;
				const cb = prompt.callback;
				return await Promise.resolve(cb(args, extra));
			} else {
				const cb = prompt.callback;
				return await Promise.resolve(cb(extra));
			}
		});
		this._promptHandlersInitialized = true;
	}
	resource(name, uriOrTemplate, ...rest) {
		let metadata;
		if (typeof rest[0] === "object") metadata = rest.shift();
		const readCallback = rest[0];
		if (typeof uriOrTemplate === "string") {
			if (this._registeredResources[uriOrTemplate]) throw new Error(`Resource ${uriOrTemplate} is already registered`);
			const registeredResource = this._createRegisteredResource(name, void 0, uriOrTemplate, metadata, readCallback);
			this.setResourceRequestHandlers();
			this.sendResourceListChanged();
			return registeredResource;
		} else {
			if (this._registeredResourceTemplates[name]) throw new Error(`Resource template ${name} is already registered`);
			const registeredResourceTemplate = this._createRegisteredResourceTemplate(name, void 0, uriOrTemplate, metadata, readCallback);
			this.setResourceRequestHandlers();
			this.sendResourceListChanged();
			return registeredResourceTemplate;
		}
	}
	registerResource(name, uriOrTemplate, config, readCallback) {
		if (typeof uriOrTemplate === "string") {
			if (this._registeredResources[uriOrTemplate]) throw new Error(`Resource ${uriOrTemplate} is already registered`);
			const registeredResource = this._createRegisteredResource(name, config.title, uriOrTemplate, config, readCallback);
			this.setResourceRequestHandlers();
			this.sendResourceListChanged();
			return registeredResource;
		} else {
			if (this._registeredResourceTemplates[name]) throw new Error(`Resource template ${name} is already registered`);
			const registeredResourceTemplate = this._createRegisteredResourceTemplate(name, config.title, uriOrTemplate, config, readCallback);
			this.setResourceRequestHandlers();
			this.sendResourceListChanged();
			return registeredResourceTemplate;
		}
	}
	_createRegisteredResource(name, title, uri, metadata, readCallback) {
		const registeredResource = {
			name,
			title,
			metadata,
			readCallback,
			enabled: true,
			disable: () => registeredResource.update({ enabled: false }),
			enable: () => registeredResource.update({ enabled: true }),
			remove: () => registeredResource.update({ uri: null }),
			update: (updates) => {
				if (typeof updates.uri !== "undefined" && updates.uri !== uri) {
					delete this._registeredResources[uri];
					if (updates.uri) this._registeredResources[updates.uri] = registeredResource;
				}
				if (typeof updates.name !== "undefined") registeredResource.name = updates.name;
				if (typeof updates.title !== "undefined") registeredResource.title = updates.title;
				if (typeof updates.metadata !== "undefined") registeredResource.metadata = updates.metadata;
				if (typeof updates.callback !== "undefined") registeredResource.readCallback = updates.callback;
				if (typeof updates.enabled !== "undefined") registeredResource.enabled = updates.enabled;
				this.sendResourceListChanged();
			}
		};
		this._registeredResources[uri] = registeredResource;
		return registeredResource;
	}
	_createRegisteredResourceTemplate(name, title, template, metadata, readCallback) {
		const registeredResourceTemplate = {
			resourceTemplate: template,
			title,
			metadata,
			readCallback,
			enabled: true,
			disable: () => registeredResourceTemplate.update({ enabled: false }),
			enable: () => registeredResourceTemplate.update({ enabled: true }),
			remove: () => registeredResourceTemplate.update({ name: null }),
			update: (updates) => {
				if (typeof updates.name !== "undefined" && updates.name !== name) {
					delete this._registeredResourceTemplates[name];
					if (updates.name) this._registeredResourceTemplates[updates.name] = registeredResourceTemplate;
				}
				if (typeof updates.title !== "undefined") registeredResourceTemplate.title = updates.title;
				if (typeof updates.template !== "undefined") registeredResourceTemplate.resourceTemplate = updates.template;
				if (typeof updates.metadata !== "undefined") registeredResourceTemplate.metadata = updates.metadata;
				if (typeof updates.callback !== "undefined") registeredResourceTemplate.readCallback = updates.callback;
				if (typeof updates.enabled !== "undefined") registeredResourceTemplate.enabled = updates.enabled;
				this.sendResourceListChanged();
			}
		};
		this._registeredResourceTemplates[name] = registeredResourceTemplate;
		const variableNames = template.uriTemplate.variableNames;
		if (Array.isArray(variableNames) && variableNames.some((v) => !!template.completeCallback(v))) this.setCompletionRequestHandler();
		return registeredResourceTemplate;
	}
	_createRegisteredPrompt(name, title, description, argsSchema, callback) {
		const registeredPrompt = {
			title,
			description,
			argsSchema: argsSchema === void 0 ? void 0 : objectFromShape(argsSchema),
			callback,
			enabled: true,
			disable: () => registeredPrompt.update({ enabled: false }),
			enable: () => registeredPrompt.update({ enabled: true }),
			remove: () => registeredPrompt.update({ name: null }),
			update: (updates) => {
				if (typeof updates.name !== "undefined" && updates.name !== name) {
					delete this._registeredPrompts[name];
					if (updates.name) this._registeredPrompts[updates.name] = registeredPrompt;
				}
				if (typeof updates.title !== "undefined") registeredPrompt.title = updates.title;
				if (typeof updates.description !== "undefined") registeredPrompt.description = updates.description;
				if (typeof updates.argsSchema !== "undefined") registeredPrompt.argsSchema = objectFromShape(updates.argsSchema);
				if (typeof updates.callback !== "undefined") registeredPrompt.callback = updates.callback;
				if (typeof updates.enabled !== "undefined") registeredPrompt.enabled = updates.enabled;
				this.sendPromptListChanged();
			}
		};
		this._registeredPrompts[name] = registeredPrompt;
		if (argsSchema) {
			if (Object.values(argsSchema).some((field) => {
				return isCompletable(field instanceof ZodOptional$1 ? field._def?.innerType : field);
			})) this.setCompletionRequestHandler();
		}
		return registeredPrompt;
	}
	_createRegisteredTool(name, title, description, inputSchema, outputSchema, annotations, execution, _meta, handler) {
		validateAndWarnToolName(name);
		const registeredTool = {
			title,
			description,
			inputSchema: getZodSchemaObject(inputSchema),
			outputSchema: getZodSchemaObject(outputSchema),
			annotations,
			execution,
			_meta,
			handler,
			enabled: true,
			disable: () => registeredTool.update({ enabled: false }),
			enable: () => registeredTool.update({ enabled: true }),
			remove: () => registeredTool.update({ name: null }),
			update: (updates) => {
				if (typeof updates.name !== "undefined" && updates.name !== name) {
					if (typeof updates.name === "string") validateAndWarnToolName(updates.name);
					delete this._registeredTools[name];
					if (updates.name) this._registeredTools[updates.name] = registeredTool;
				}
				if (typeof updates.title !== "undefined") registeredTool.title = updates.title;
				if (typeof updates.description !== "undefined") registeredTool.description = updates.description;
				if (typeof updates.paramsSchema !== "undefined") registeredTool.inputSchema = objectFromShape(updates.paramsSchema);
				if (typeof updates.outputSchema !== "undefined") registeredTool.outputSchema = objectFromShape(updates.outputSchema);
				if (typeof updates.callback !== "undefined") registeredTool.handler = updates.callback;
				if (typeof updates.annotations !== "undefined") registeredTool.annotations = updates.annotations;
				if (typeof updates._meta !== "undefined") registeredTool._meta = updates._meta;
				if (typeof updates.enabled !== "undefined") registeredTool.enabled = updates.enabled;
				this.sendToolListChanged();
			}
		};
		this._registeredTools[name] = registeredTool;
		this.setToolRequestHandlers();
		this.sendToolListChanged();
		return registeredTool;
	}
	/**
	* tool() implementation. Parses arguments passed to overrides defined above.
	*/
	tool(name, ...rest) {
		if (this._registeredTools[name]) throw new Error(`Tool ${name} is already registered`);
		let description;
		let inputSchema;
		let outputSchema;
		let annotations;
		if (typeof rest[0] === "string") description = rest.shift();
		if (rest.length > 1) {
			const firstArg = rest[0];
			if (isZodRawShapeCompat(firstArg)) {
				inputSchema = rest.shift();
				if (rest.length > 1 && typeof rest[0] === "object" && rest[0] !== null && !isZodRawShapeCompat(rest[0])) annotations = rest.shift();
			} else if (typeof firstArg === "object" && firstArg !== null) {
				if (Object.values(firstArg).some((v) => typeof v === "object" && v !== null)) throw new Error(`Tool ${name} expected a Zod schema or ToolAnnotations, but received an unrecognized object`);
				annotations = rest.shift();
			}
		}
		const callback = rest[0];
		return this._createRegisteredTool(name, void 0, description, inputSchema, outputSchema, annotations, { taskSupport: "forbidden" }, void 0, callback);
	}
	/**
	* Registers a tool with a config object and callback.
	*/
	registerTool(name, config, cb) {
		if (this._registeredTools[name]) throw new Error(`Tool ${name} is already registered`);
		const { title, description, inputSchema, outputSchema, annotations, _meta } = config;
		return this._createRegisteredTool(name, title, description, inputSchema, outputSchema, annotations, { taskSupport: "forbidden" }, _meta, cb);
	}
	prompt(name, ...rest) {
		if (this._registeredPrompts[name]) throw new Error(`Prompt ${name} is already registered`);
		let description;
		if (typeof rest[0] === "string") description = rest.shift();
		let argsSchema;
		if (rest.length > 1) argsSchema = rest.shift();
		const cb = rest[0];
		const registeredPrompt = this._createRegisteredPrompt(name, void 0, description, argsSchema, cb);
		this.setPromptRequestHandlers();
		this.sendPromptListChanged();
		return registeredPrompt;
	}
	/**
	* Registers a prompt with a config object and callback.
	*/
	registerPrompt(name, config, cb) {
		if (this._registeredPrompts[name]) throw new Error(`Prompt ${name} is already registered`);
		const { title, description, argsSchema } = config;
		const registeredPrompt = this._createRegisteredPrompt(name, title, description, argsSchema, cb);
		this.setPromptRequestHandlers();
		this.sendPromptListChanged();
		return registeredPrompt;
	}
	/**
	* Checks if the server is connected to a transport.
	* @returns True if the server is connected
	*/
	isConnected() {
		return this.server.transport !== void 0;
	}
	/**
	* Sends a logging message to the client, if connected.
	* Note: You only need to send the parameters object, not the entire JSON RPC message
	* @see LoggingMessageNotification
	* @param params
	* @param sessionId optional for stateless and backward compatibility
	*/
	async sendLoggingMessage(params, sessionId) {
		return this.server.sendLoggingMessage(params, sessionId);
	}
	/**
	* Sends a resource list changed event to the client, if connected.
	*/
	sendResourceListChanged() {
		if (this.isConnected()) this.server.sendResourceListChanged();
	}
	/**
	* Sends a tool list changed event to the client, if connected.
	*/
	sendToolListChanged() {
		if (this.isConnected()) this.server.sendToolListChanged();
	}
	/**
	* Sends a prompt list changed event to the client, if connected.
	*/
	sendPromptListChanged() {
		if (this.isConnected()) this.server.sendPromptListChanged();
	}
};
var EMPTY_OBJECT_JSON_SCHEMA = {
	type: "object",
	properties: {}
};
/**
* Checks if a value looks like a Zod schema by checking for parse/safeParse methods.
*/
function isZodTypeLike(value) {
	return value !== null && typeof value === "object" && "parse" in value && typeof value.parse === "function" && "safeParse" in value && typeof value.safeParse === "function";
}
/**
* Checks if an object is a Zod schema instance (v3 or v4).
*
* Zod schemas have internal markers:
* - v3: `_def` property
* - v4: `_zod` property
*
* This includes transformed schemas like z.preprocess(), z.transform(), z.pipe().
*/
function isZodSchemaInstance(obj) {
	return "_def" in obj || "_zod" in obj || isZodTypeLike(obj);
}
/**
* Checks if an object is a "raw shape" - a plain object where values are Zod schemas.
*
* Raw shapes are used as shorthand: `{ name: z.string() }` instead of `z.object({ name: z.string() })`.
*
* IMPORTANT: This must NOT match actual Zod schema instances (like z.preprocess, z.pipe),
* which have internal properties that could be mistaken for schema values.
*/
function isZodRawShapeCompat(obj) {
	if (typeof obj !== "object" || obj === null) return false;
	if (isZodSchemaInstance(obj)) return false;
	if (Object.keys(obj).length === 0) return true;
	return Object.values(obj).some(isZodTypeLike);
}
/**
* Converts a provided Zod schema to a Zod object if it is a ZodRawShapeCompat,
* otherwise returns the schema as is. Throws if the value is not a valid Zod schema.
*/
function getZodSchemaObject(schema) {
	if (!schema) return;
	if (isZodRawShapeCompat(schema)) return objectFromShape(schema);
	if (!isZodSchemaInstance(schema)) throw new Error("inputSchema must be a Zod schema or raw shape, received an unrecognized object");
	return schema;
}
function promptArgumentsFromSchema(schema) {
	const shape = getObjectShape(schema);
	if (!shape) return [];
	return Object.entries(shape).map(([name, field]) => {
		return {
			name,
			description: getSchemaDescription(field),
			required: !isSchemaOptional(field)
		};
	});
}
function getMethodValue(schema) {
	const methodSchema = getObjectShape(schema)?.method;
	if (!methodSchema) throw new Error("Schema is missing a method literal");
	const value = getLiteralValue(methodSchema);
	if (typeof value === "string") return value;
	throw new Error("Schema method literal must be a string");
}
function createCompletionResult(suggestions) {
	return { completion: {
		values: suggestions.slice(0, 100),
		total: suggestions.length,
		hasMore: suggestions.length > 100
	} };
}
var EMPTY_COMPLETION_RESULT = { completion: {
	values: [],
	hasMore: false
} };
//#endregion
//#region self-essentials/emdash-main/packages/core/dist/astro/routes/api/mcp.mjs
var mcp_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var COLLECTION_SLUG_PATTERN = /^[a-z][a-z0-9_]*$/;
/** http(s) scheme matcher used by `settings_update` URL validation. */
var HTTP_SCHEME_PATTERN = /^https?:\/\//i;
var settingsMediaReferenceSchema = object$1({
	mediaId: string().describe("Media item ID (use media_create or media_list)"),
	alt: string().optional().describe("Alt text for the media reference")
});
var settingsSocialSchema = object$1({
	twitter: string().optional(),
	github: string().optional(),
	facebook: string().optional(),
	instagram: string().optional(),
	linkedin: string().optional(),
	youtube: string().optional()
});
var settingsSeoSchema = object$1({
	titleSeparator: string().max(10).optional().describe("Separator between page title and site title (e.g. ' | ')"),
	defaultOgImage: settingsMediaReferenceSchema.optional().describe("Default Open Graph image when content has none"),
	robotsTxt: string().max(5e3).optional().describe("Custom robots.txt body. Leave unset for the EmDash default."),
	googleVerification: string().max(100).optional().describe("Google Search Console verification token"),
	bingVerification: string().max(100).optional().describe("Bing Webmaster Tools verification token")
});
var mediaUsageRepairToolSchema = object$1({
	scope: _enum(["collection", "all"]).describe("Repair one collection or all collections"),
	collection: string().min(1).max(63).regex(COLLECTION_SLUG_PATTERN, "Invalid collection slug").optional().describe("Collection slug; required only when scope is collection")
}).strict().superRefine((input, ctx) => {
	if (input.scope === "collection" && input.collection === void 0) ctx.addIssue({
		code: "custom",
		path: ["collection"],
		message: "Collection is required when scope is collection"
	});
	if (input.scope === "all" && input.collection !== void 0) ctx.addIssue({
		code: "custom",
		path: ["collection"],
		message: "Collection must be omitted when scope is all"
	});
});
/**
* Return a successful tool response with the data as pretty-printed JSON.
*/
function respondData(data) {
	return { content: [{
		type: "text",
		text: JSON.stringify(data, null, 2)
	}] };
}
/**
* Return a structured error tool response.
*
* The error code is emitted both in the human-readable message (as a stable
* `[CODE]` prefix that callers can match on) and in `_meta.code` so MCP-aware
* clients can read it programmatically once the SDK supports forwarding meta.
*/
function respondError(code, message, details) {
	const text = `[${code}] ${message}`;
	const meta = { code };
	if (details !== void 0) meta.details = details;
	return {
		content: [{
			type: "text",
			text
		}],
		isError: true,
		_meta: meta
	};
}
/**
* Auth/permission errors thrown from `requireScope` / `requireRole` /
* `requireOwnership` / `requireDraftAccess`. Carries a stable string `code`
* field so `respondHandlerError` can surface it through `_meta.code` and
* the message prefix.
*
* Distinct from `McpError` (which the SDK catches at JSON-RPC level — the
* code there is numeric, not a stable EmDash error code).
*/
var EmDashAuthError = class extends Error {
	name = "EmDashAuthError";
	constructor(message, code) {
		super(message);
		this.code = code;
	}
};
/**
* Map an unknown thrown error to a structured error envelope.
*
* Recognises (in priority order):
*  - `EmDashAuthError` — `code` is a stable EmDash auth code
*    (`UNAUTHORIZED`, `INSUFFICIENT_SCOPE`, `INSUFFICIENT_PERMISSIONS`).
*  - `Error` objects with an `apiError: { code, details? }` annotation
*    (handlers throw these for NOT_FOUND / CONFLICT inside transactions;
*    see `api/handlers/content.ts:538`).
*  - `SchemaError` (and any error with a string `code` field) — the code
*    is forwarded verbatim. `details` is forwarded too if present.
*  - Plain `Error` instances — message preserved, code falls back to
*    `fallbackCode` (or `INTERNAL_ERROR`).
*  - Strings — used directly as the message.
*  - Anything else — coerced via `String()`.
*
* The original message is always preserved so tests and humans can see the
* specific failure cause. Numeric `code` values (e.g. on `McpError`) are
* ignored — the field is reserved for stable string codes.
*/
function respondHandlerError(error, fallbackCode = "INTERNAL_ERROR") {
	let code = fallbackCode;
	let message;
	let details;
	if (error instanceof EmDashAuthError) {
		message = error.message || fallbackCode;
		code = error.code;
	} else if (error instanceof Error) {
		message = error.message || fallbackCode;
		const apiError = error.apiError;
		if (apiError && typeof apiError.code === "string" && apiError.code) {
			code = apiError.code;
			if (apiError.details && typeof apiError.details === "object") details = apiError.details;
		} else {
			const rawCode = error.code;
			if (typeof rawCode === "string" && rawCode) code = rawCode;
			const rawDetails = error.details;
			if (rawDetails && typeof rawDetails === "object") details = rawDetails;
		}
	} else if (typeof error === "string") message = error;
	else message = String(error);
	return respondError(code, message, details);
}
/**
* Unwrap an ApiResult<T> into MCP tool result format.
*
* On success returns the data as JSON. On failure propagates the structured
* `{ code, message, details }` from the handler so the caller sees both a
* machine-readable code (in `_meta.code` and as a `[CODE]` message prefix)
* and the original human-readable message.
*/
function unwrap(result) {
	if (result.success && result.data !== void 0) return respondData(result.data);
	const err = result.error && typeof result.error === "object" ? result.error : void 0;
	if (!err) return respondError("INTERNAL_ERROR", "Unknown error");
	return respondError(typeof err.code === "string" && err.code ? err.code : "INTERNAL_ERROR", typeof err.message === "string" && err.message ? err.message : "Unknown error", err.details && typeof err.details === "object" ? err.details : void 0);
}
/**
* Return a JSON text block (success path for tools that don't go through
* the ApiResult-returning handler layer, e.g. schema/menu/taxonomy).
*/
function jsonResult(data) {
	return respondData(data);
}
function isPublished(t) {
	return typeof t === "object" && t !== null && "status" in t && t.status === "published";
}
function getExtra(extra) {
	const payload = extra.authInfo?.extra;
	if (!payload?.emdash) throw new Error("EmDash not available — server misconfigured");
	return payload;
}
function getEmDash(extra) {
	return getExtra(extra).emdash;
}
async function getCollectionFields(ec, collection) {
	try {
		const { SchemaRegistry } = await import("./schema-eqZhkR0S_BWtW7MhK.mjs").then((n) => n.t);
		const col = await new SchemaRegistry(ec.db).getCollectionWithFields(collection);
		return col ? col.fields : null;
	} catch {
		return null;
	}
}
/**
* Convert markdown strings to Portable Text for `portableText` fields on write.
* Non-string values pass through, so callers may still send Portable Text. If
* the schema can't be loaded, data is returned unchanged for the handler to
* validate.
*/
async function convertWriteData(ec, collection, data) {
	const fields = await getCollectionFields(ec, collection);
	if (!fields) return data;
	return convertDataForWrite(data, fields);
}
/**
* Convert `portableText` field values on each item's `data` to markdown,
* mutating in place. Inverse of {@link convertWriteData}, gated on the read
* tools' `markdown` argument.
*/
async function applyReadMarkdown(ec, collection, items) {
	const fields = await getCollectionFields(ec, collection);
	if (!fields) return;
	for (const item of items) if (item.data && typeof item.data === "object") item.data = convertDataForRead(item.data, fields, false);
}
async function invalidateBylines() {
	const { invalidateBylineCache } = await import("./bylines-B8-WGdja_NYFFkMld.mjs").then((n) => n.t);
	invalidateBylineCache();
}
/**
* Enforce a scope requirement on the current request.
*
* When tokenScopes is undefined (session auth), all operations are allowed
* since session users have full access based on their role. When scopes are
* present (token auth), the required scope must be included.
*/
function requireScope(extra, scope) {
	const payload = getExtra(extra);
	if (payload.tokenScopes && !hasScope(payload.tokenScopes, scope)) throw new EmDashAuthError(`Insufficient scope: requires ${scope}`, "INSUFFICIENT_SCOPE");
}
/**
* Defense-in-depth: enforce a minimum RBAC role on the current request.
*
* This is checked in addition to scope requirements. Even if a token has
* the right scopes (e.g. due to a bug in scope clamping), the user's
* actual role must still meet the minimum.
*/
function requireRole(extra, minRole) {
	if (getExtra(extra).userRole < minRole) throw new EmDashAuthError("Insufficient permissions for this operation", "INSUFFICIENT_PERMISSIONS");
}
/**
* Whether the current user may read non-published content (drafts, scheduled,
* trashed, revisions, compare). SUBSCRIBER may hold content:read for
* member-only published content but must not see drafts.
*/
function canReadDrafts(extra) {
	return hasPermission({ role: getExtra(extra).userRole }, "content:read_drafts");
}
/**
* Throw if the current user cannot read non-published content. Used by
* editor-only views (revisions, compare, trash, preview-url).
*/
function requireDraftAccess(extra) {
	if (!canReadDrafts(extra)) throw new EmDashAuthError("Insufficient permissions for this operation", "INSUFFICIENT_PERMISSIONS");
}
/**
* Enforce ownership-based permission checks, mirroring the REST API's
* requireOwnerPerm() pattern.
*
* If the user is the owner, checks ownPermission. Otherwise checks
* anyPermission (which requires EDITOR+ role).
*/
function requireOwnership(extra, ownerId, ownPermission, anyPermission) {
	const payload = getExtra(extra);
	if (!canActOnOwn({
		id: payload.userId,
		role: payload.userRole
	}, ownerId, ownPermission, anyPermission)) throw new EmDashAuthError("Insufficient permissions for this operation", "INSUFFICIENT_PERMISSIONS");
}
/**
* Extract the author ID from a content handler response.
*
* Content handlers return `{ item: { id, authorId, ... }, _rev? }`.
* This helper navigates that shape safely. Returns "" when authorId is
* missing or non-string (e.g. seed-imported content with no author);
* `canActOnOwn` then decides based on the caller's permissions —
* an actor with `*:edit_any` succeeds, an actor with only `*:edit_own`
* is denied with a clean permission error.
*/
function extractContentAuthorId(data) {
	if (!data || typeof data !== "object") return "";
	const obj = data;
	const item = obj.item && typeof obj.item === "object" ? obj.item : obj;
	return typeof item?.authorId === "string" ? item.authorId : "";
}
/**
* Extract the resolved ID from a content handler response.
* Handles slug -> ID resolution performed by the handler.
*/
function extractContentId(data) {
	if (!data || typeof data !== "object") return void 0;
	const obj = data;
	const item = obj.item && typeof obj.item === "object" ? obj.item : obj;
	return typeof item?.id === "string" ? item.id : void 0;
}
function createMcpServer(pluginTools = [], request) {
	const server = new McpServer({
		name: "emdash",
		version: "0.1.0"
	}, { capabilities: { logging: {} } });
	const originalRegisterTool = server.registerTool.bind(server);
	server.registerTool = ((name, config, callback) => {
		const wrapped = async (...callbackArgs) => {
			try {
				return await callback(...callbackArgs);
			} catch (error) {
				return respondHandlerError(error, "INTERNAL_ERROR");
			}
		};
		return originalRegisterTool(name, config, wrapped);
	});
	for (const tool of pluginTools) {
		if (!(tool.permission in Permissions)) continue;
		server.registerTool(`${tool.pluginId}__${tool.name}`, {
			description: tool.description,
			inputSchema: tool.inputSchema,
			outputSchema: tool.outputSchema,
			annotations: { destructiveHint: tool.destructive }
		}, async (input, extra) => {
			const payload = getExtra(extra);
			const requiredScope = `mcp:tools:${tool.pluginId}`;
			if (payload.tokenScopes && !hasScope(payload.tokenScopes, requiredScope)) {
				if (request) await payload.emdash.handlePluginMcpDenied(tool.pluginId, tool.name, tool.route, payload.userId, request, `Missing scope: ${requiredScope}`);
				throw new EmDashAuthError(`Insufficient scope: requires ${requiredScope}`, "INSUFFICIENT_SCOPE");
			}
			if (!hasPermission({ role: payload.userRole }, tool.permission)) {
				if (request) await payload.emdash.handlePluginMcpDenied(tool.pluginId, tool.name, tool.route, payload.userId, request, `Missing permission: ${tool.permission}`);
				throw new EmDashAuthError(`Insufficient permission: requires ${tool.permission}`, "INSUFFICIENT_PERMISSIONS");
			}
			if (!request) return respondError("INTERNAL_ERROR", "Missing MCP request context");
			const result = await payload.emdash.handlePluginMcpTool(tool.pluginId, tool.name, tool.route, input, payload.userId, request);
			if (!result.success) return unwrap(result);
			if (tool.outputSchema) {
				if (!result.data || typeof result.data !== "object" || Array.isArray(result.data)) return respondError("INVALID_PLUGIN_OUTPUT", "Plugin tool output must be an object when outputSchema is declared");
				return {
					content: [{
						type: "text",
						text: JSON.stringify(result.data, null, 2)
					}],
					structuredContent: result.data
				};
			}
			return respondData(result.data);
		});
	}
	server.registerTool("content_list", {
		title: "List Content",
		description: "List content items in a collection with optional filtering and pagination. Returns items sorted by the specified field. Use the nextCursor value from the response to fetch the next page. Status can be 'draft', 'published', or 'scheduled'. If no status is given, all non-trashed items are returned.",
		inputSchema: object$1({
			collection: string().describe("Collection slug (e.g. 'posts', 'pages')"),
			status: _enum([
				"draft",
				"published",
				"scheduled"
			]).optional().describe("Filter by content status"),
			limit: number().int().min(1).max(100).optional().describe("Max items to return (default 50, max 100)"),
			cursor: string().min(1).max(2048).optional().describe("Pagination cursor from a previous response"),
			orderBy: string().optional().describe("Field to sort by (e.g. 'created_at', 'updated_at')"),
			order: _enum(["asc", "desc"]).optional().describe("Sort direction (default 'desc')"),
			locale: string().optional().describe("Filter by locale (e.g. 'en', 'fr'). Only relevant when i18n is enabled."),
			markdown: boolean().optional().describe("Return rich text (portableText) fields as Markdown strings instead of Portable Text arrays (default false).")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		const status = canReadDrafts(extra) ? args.status : "published";
		const result = await ec.handleContentList(args.collection, {
			status,
			limit: args.limit,
			cursor: args.cursor,
			orderBy: args.orderBy,
			order: args.order,
			locale: args.locale
		});
		if (result.success && args.markdown) {
			const payload = result.data;
			if (payload && typeof payload === "object" && "items" in payload && Array.isArray(payload.items)) await applyReadMarkdown(ec, args.collection, payload.items);
		}
		return unwrap(result);
	});
	server.registerTool("content_get", {
		title: "Get Content",
		description: "Get a single content item by its ID or slug. Returns the full content data including all field values, metadata, and a _rev token for optimistic concurrency (pass _rev back when updating to detect conflicts).",
		inputSchema: object$1({
			collection: string().describe("Collection slug (e.g. 'posts', 'pages')"),
			id: string().describe("Content item ID (ULID) or slug"),
			locale: string().optional().describe("Locale to scope slug lookup (e.g. 'fr'). Only affects slug resolution; IDs are globally unique."),
			markdown: boolean().optional().describe("Return rich text (portableText) fields as Markdown strings instead of Portable Text arrays (default false).")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		const result = await ec.handleContentGet(args.collection, args.id, args.locale);
		if (result.success && !canReadDrafts(extra)) {
			const data = result.data && typeof result.data === "object" ? result.data : void 0;
			const item = data?.item && typeof data.item === "object" ? data.item : void 0;
			if ((typeof item?.status === "string" ? item.status : null) !== "published") return unwrap({
				success: false,
				error: {
					code: "NOT_FOUND",
					message: `Content item not found: ${args.id}`
				}
			});
		}
		if (result.success && args.markdown && result.data?.item) await applyReadMarkdown(ec, args.collection, [result.data.item]);
		return unwrap(result);
	});
	server.registerTool("content_create", {
		title: "Create Content",
		description: "Create a new content item in a collection. The 'data' object should contain field values matching the collection's schema (use schema_get_collection to check). For rich text (portableText) fields, pass a Markdown string — converted to Portable Text automatically; prefer this. Pass a Portable Text JSON array only for complex content Markdown can't express (custom blocks, embeds). A slug is auto-generated if not provided. Items are created as 'draft' by default — use content_publish to make them live.",
		inputSchema: object$1({
			collection: string().describe("Collection slug (e.g. 'posts', 'pages')"),
			data: record(string(), unknown()).describe("Field values as key-value pairs matching the collection schema"),
			slug: string().optional().describe("URL slug (auto-generated from title if omitted)"),
			status: _enum(["draft", "published"]).optional().describe("Initial status (default 'draft'). Requires publish permission."),
			locale: string().optional().describe("Locale for this content (e.g. 'fr'). Defaults to default locale."),
			translationOf: string().optional().describe("ID of the content item this is a translation of. Links items in the same translation group."),
			bylines: array(contentBylineInputSchema).optional().describe("Bylines to credit. Each entry references an existing byline by id (see byline_list / byline_create) with an optional roleLabel. The first entry becomes the primary byline."),
			taxonomies: record(string(), array(string())).optional().describe("Taxonomy term assignments as { taxonomyName: [termSlug, ...] }. Term slugs are resolved in the entry's locale. Call taxonomy_list to see available taxonomies and taxonomy_list_terms to look up slugs. Missing keys leave that taxonomy unchanged.")
		}),
		annotations: { destructiveHint: false }
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.CONTRIBUTOR);
		const { emdash, userId } = getExtra(extra);
		if (args.translationOf) {
			const source = await emdash.handleContentGet(args.collection, args.translationOf);
			if (!source.success) return unwrap(source);
			requireOwnership(extra, extractContentAuthorId(source.data), "content:edit_own", "content:edit_any");
		}
		const data = await convertWriteData(emdash, args.collection, args.data);
		if (args.status === "published") {
			if (!hasPermission({
				id: userId,
				role: getExtra(extra).userRole
			}, "content:publish_own")) throw new EmDashAuthError("Insufficient permissions: publishing requires content:publish_own", "INSUFFICIENT_PERMISSIONS");
			const result = await emdash.handleContentCreate(args.collection, {
				data,
				slug: args.slug,
				authorId: userId,
				locale: args.locale,
				translationOf: args.translationOf,
				bylines: args.bylines,
				taxonomies: args.taxonomies
			});
			if (!result.success) return unwrap(result);
			const itemId = extractContentId(result.data);
			if (itemId) return unwrap(await emdash.handleContentPublish(args.collection, itemId));
			return unwrap(result);
		}
		return unwrap(await emdash.handleContentCreate(args.collection, {
			data,
			slug: args.slug,
			authorId: userId,
			locale: args.locale,
			translationOf: args.translationOf,
			bylines: args.bylines,
			taxonomies: args.taxonomies
		}));
	});
	server.registerTool("content_update", {
		title: "Update Content",
		description: "Update an existing content item. Only include fields you want to change in the 'data' object — unspecified fields are left unchanged. Rich text (portableText) fields accept a Markdown string (recommended, converted automatically); use a Portable Text JSON array only for complex content Markdown can't express (custom blocks, embeds). Pass the _rev token from content_get to enable optimistic concurrency checking (the update fails if the item was modified since you read it). `seo` and `bylines` are persisted alongside the field updates in a single transaction. `publishedAt` requires the content:publish_any permission and is useful for migrations or correcting historical dates.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug"),
			locale: string().optional().describe("Locale to scope slug lookup (e.g. 'fr'). Only affects slug resolution; IDs are globally unique."),
			data: record(string(), unknown()).optional().describe("Field values to update (only include changed fields)"),
			slug: string().optional().describe("New URL slug"),
			status: _enum(["draft", "published"]).optional().describe("New status. Setting to 'published' requires publish permission. Setting to 'draft' unpublishes the item and also requires publish permission."),
			seo: contentSeoInput.optional().describe("Per-content SEO metadata. Only valid for collections with SEO enabled (see schema_get_collection.hasSeo). Fields not included are left unchanged; pass null to clear."),
			bylines: array(contentBylineInputSchema).optional().describe("Replace the byline list for this item. The first entry becomes the primary byline. Pass an empty array to clear all bylines."),
			taxonomies: record(string(), array(string())).optional().describe("Replace taxonomy term assignments as { taxonomyName: [termSlug, ...] }. Term slugs are resolved in the entry's locale. Only named taxonomies are touched; other taxonomies are left unchanged. Pass an empty array to clear a taxonomy."),
			publishedAt: datetime({
				offset: true,
				message: "must be an ISO 8601 datetime"
			}).nullish().describe("Override the publication timestamp (ISO 8601). Requires content:publish_any permission. Pass null to clear. Useful for content migrations."),
			_rev: string().optional().describe("Revision token from content_get for conflict detection")
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const { emdash, userId, userRole } = getExtra(extra);
		const existing = await emdash.handleContentGet(args.collection, args.id, args.locale);
		if (!existing.success) return unwrap(existing);
		const ownerId = extractContentAuthorId(existing.data);
		requireOwnership(extra, ownerId, "content:edit_own", "content:edit_any");
		const data = args.data ? await convertWriteData(emdash, args.collection, args.data) : args.data;
		if (args.publishedAt !== void 0) {
			if (!hasPermission({
				id: userId,
				role: userRole
			}, "content:publish_any")) throw new EmDashAuthError("Setting publishedAt requires content:publish_any permission", "INSUFFICIENT_PERMISSIONS");
		}
		const resolvedId = extractContentId(existing.data) ?? args.id;
		if (args.status === "published") {
			requireOwnership(extra, ownerId, "content:publish_own", "content:publish_any");
			if (args.data || args.slug || args.seo !== void 0 || args.bylines !== void 0 || args.taxonomies !== void 0 || args.publishedAt !== void 0) {
				const updateResult = await emdash.handleContentUpdate(args.collection, resolvedId, {
					data,
					slug: args.slug,
					authorId: userId,
					locale: args.locale,
					seo: args.seo,
					bylines: args.bylines,
					taxonomies: args.taxonomies,
					publishedAt: args.publishedAt,
					_rev: args._rev
				});
				if (!updateResult.success) return unwrap(updateResult);
			}
			return unwrap(await emdash.handleContentPublish(args.collection, resolvedId));
		}
		if (args.status === "draft") {
			requireOwnership(extra, ownerId, "content:publish_own", "content:publish_any");
			if (args.data || args.slug || args.seo !== void 0 || args.bylines !== void 0 || args.taxonomies !== void 0 || args.publishedAt !== void 0) {
				const updateResult = await emdash.handleContentUpdate(args.collection, resolvedId, {
					data,
					slug: args.slug,
					authorId: userId,
					locale: args.locale,
					seo: args.seo,
					bylines: args.bylines,
					taxonomies: args.taxonomies,
					publishedAt: args.publishedAt,
					_rev: args._rev
				});
				if (!updateResult.success) return unwrap(updateResult);
			}
			return unwrap(await emdash.handleContentUnpublish(args.collection, resolvedId));
		}
		return unwrap(await emdash.handleContentUpdate(args.collection, resolvedId, {
			data,
			slug: args.slug,
			authorId: userId,
			locale: args.locale,
			seo: args.seo,
			bylines: args.bylines,
			taxonomies: args.taxonomies,
			publishedAt: args.publishedAt,
			_rev: args._rev
		}));
	});
	server.registerTool("content_delete", {
		title: "Delete Content (Trash)",
		description: "Soft-delete a content item by moving it to the trash. The item can be restored later with content_restore, or permanently deleted with content_permanent_delete.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		}),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleContentGet(args.collection, args.id);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:delete_own", "content:delete_any");
		const resolvedId = extractContentId(existing.data) ?? args.id;
		return unwrap(await ec.handleContentDelete(args.collection, resolvedId));
	});
	server.registerTool("content_restore", {
		title: "Restore Content",
		description: "Restore a soft-deleted content item from the trash back to its previous state.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleContentGetIncludingTrashed(args.collection, args.id);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:edit_own", "content:edit_any");
		const resolvedId = extractContentId(existing.data) ?? args.id;
		return unwrap(await ec.handleContentRestore(args.collection, resolvedId));
	});
	server.registerTool("content_permanent_delete", {
		title: "Permanently Delete Content",
		description: "Permanently and irreversibly delete a trashed content item. The item must be in the trash first (use content_delete). This cannot be undone.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		}),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.ADMIN);
		return unwrap(await getEmDash(extra).handleContentPermanentDelete(args.collection, args.id));
	});
	server.registerTool("content_publish", {
		title: "Publish Content",
		description: "Publish a content item, making it live on the site. Creates a published revision from the current draft. Further edits create a new draft without affecting the live version until re-published. Pass `publishedAt` to backdate (e.g. when migrating content from another CMS) — this requires the content:publish_any permission. Without `publishedAt`, the existing `published_at` is preserved on re-publish (idempotent) and falls back to the current time on first publish.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug"),
			publishedAt: datetime({
				offset: true,
				message: "must be an ISO 8601 datetime"
			}).optional().describe("Override publication timestamp (ISO 8601). Requires content:publish_any permission. Useful when importing content with original publish dates.")
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const { emdash, userId, userRole } = getExtra(extra);
		const existing = await emdash.handleContentGet(args.collection, args.id);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:publish_own", "content:publish_any");
		if (args.publishedAt !== void 0) {
			if (!hasPermission({
				id: userId,
				role: userRole
			}, "content:publish_any")) throw new EmDashAuthError("Setting publishedAt requires content:publish_any permission", "INSUFFICIENT_PERMISSIONS");
		}
		const resolvedId = extractContentId(existing.data) ?? args.id;
		return unwrap(await emdash.handleContentPublish(args.collection, resolvedId, { publishedAt: args.publishedAt }));
	});
	server.registerTool("content_unpublish", {
		title: "Unpublish Content",
		description: "Unpublish a content item, reverting it to draft status. It will no longer be visible on the live site but its content is preserved.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleContentGet(args.collection, args.id);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:publish_own", "content:publish_any");
		const resolvedId = extractContentId(existing.data) ?? args.id;
		return unwrap(await ec.handleContentUnpublish(args.collection, resolvedId));
	});
	server.registerTool("content_schedule", {
		title: "Schedule Content",
		description: "Schedule a content item for future publication. It will be automatically published at the specified date/time. The scheduledAt value must be an ISO 8601 datetime string in the future (e.g. '2025-06-01T09:00:00Z').",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug"),
			scheduledAt: string().describe("ISO 8601 datetime for publication (e.g. '2025-06-01T09:00:00Z')")
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleContentGet(args.collection, args.id);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:publish_own", "content:publish_any");
		const resolvedId = extractContentId(existing.data) ?? args.id;
		return unwrap(await ec.handleContentSchedule(args.collection, resolvedId, args.scheduledAt));
	});
	server.registerTool("content_unschedule", {
		title: "Cancel Scheduled Publication",
		description: "Cancel a previously scheduled publication. The item remains in its current status (typically 'draft' or 'scheduled'); only the scheduledAt timestamp is cleared. Idempotent — calling on an item that isn't scheduled is a no-op.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleContentGet(args.collection, args.id);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:publish_own", "content:publish_any");
		const resolvedId = extractContentId(existing.data) ?? args.id;
		return unwrap(await ec.handleContentUnschedule(args.collection, resolvedId));
	});
	server.registerTool("content_compare", {
		title: "Compare Live vs Draft",
		description: "Compare the published (live) version of a content item with its current draft. Returns both versions and a flag indicating whether there are changes. Useful for reviewing unpublished edits before publishing.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		requireDraftAccess(extra);
		return unwrap(await getEmDash(extra).handleContentCompare(args.collection, args.id));
	});
	server.registerTool("content_discard_draft", {
		title: "Discard Draft",
		description: "Discard the current draft changes and revert to the last published version. Only works on items that have been published at least once.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		}),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleContentGet(args.collection, args.id);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:edit_own", "content:edit_any");
		const resolvedId = extractContentId(existing.data) ?? args.id;
		return unwrap(await ec.handleContentDiscardDraft(args.collection, resolvedId));
	});
	server.registerTool("content_list_trashed", {
		title: "List Trashed Content",
		description: "List soft-deleted content items in a collection's trash. These items can be restored with content_restore or permanently deleted with content_permanent_delete.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			limit: number().int().min(1).max(100).optional().describe("Max items (default 50)"),
			cursor: string().min(1).max(2048).optional().describe("Pagination cursor")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		requireDraftAccess(extra);
		return unwrap(await getEmDash(extra).handleContentListTrashed(args.collection, {
			limit: args.limit,
			cursor: args.cursor
		}));
	});
	server.registerTool("content_duplicate", {
		title: "Duplicate Content",
		description: "Create a copy of an existing content item. The duplicate is created as a draft with '(Copy)' appended to the title and an auto-generated slug.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug to duplicate")
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.CONTRIBUTOR);
		return unwrap(await getEmDash(extra).handleContentDuplicate(args.collection, args.id));
	});
	server.registerTool("content_translations", {
		title: "Get Content Translations",
		description: "Get all locale variants of a content item. Returns the translation group and a summary of each locale version (id, locale, slug, status). Only relevant when i18n is enabled on the site.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const result = await getEmDash(extra).handleContentTranslations(args.collection, args.id);
		if (result.success && !canReadDrafts(extra)) {
			const data = result.data && typeof result.data === "object" ? result.data : void 0;
			const filtered = (Array.isArray(data?.translations) ? data.translations : []).filter(isPublished);
			return unwrap({
				success: true,
				data: {
					...data,
					translations: filtered
				}
			});
		}
		return unwrap(result);
	});
	server.registerTool("byline_list", {
		title: "List Bylines",
		description: "List bylines (author/contributor credits) with optional filtering and pagination. Bylines are standalone records referenced by content items; use the returned id with content_create/content_update or byline_get. Use the nextCursor value from the response to fetch the next page.",
		inputSchema: object$1({
			search: string().optional().describe("Filter by display name or slug substring"),
			isGuest: boolean().optional().describe("Filter by guest (true) or linked-user (false)"),
			userId: string().optional().describe("Filter to the byline linked to a CMS user ID"),
			locale: string().optional().describe("Filter by locale (omit for all)"),
			limit: number().int().min(1).max(100).optional().describe("Max items (default 50)"),
			cursor: string().min(1).max(2048).optional().describe("Pagination cursor")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { BylineRepository } = await import("./byline-C5TAqs8N_CAsx_sCB.mjs").then((n) => n.n);
			return jsonResult(await new BylineRepository(ec.db).findMany({
				search: args.search,
				isGuest: args.isGuest,
				userId: args.userId,
				locale: args.locale,
				limit: args.limit,
				cursor: args.cursor
			}));
		} catch (error) {
			return respondHandlerError(error, "BYLINE_LIST_ERROR");
		}
	});
	server.registerTool("byline_get", {
		title: "Get Byline",
		description: "Get a single byline by its ID, including bio, avatar, website, linked user, and any custom fields.",
		inputSchema: object$1({ id: string().describe("Byline ID") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { BylineRepository } = await import("./byline-C5TAqs8N_CAsx_sCB.mjs").then((n) => n.n);
			const byline = await new BylineRepository(ec.db).findById(args.id);
			if (!byline) return respondError("NOT_FOUND", `Byline '${args.id}' not found`);
			return jsonResult(byline);
		} catch (error) {
			return respondHandlerError(error, "BYLINE_GET_ERROR");
		}
	});
	server.registerTool("byline_create", {
		title: "Create Byline",
		description: "Create a new byline (author/contributor credit). The slug must be unique and contain only lowercase letters, digits, and hyphens. Link the byline to a CMS user via userId, or leave it as a standalone guest credit. The returned id can then be passed to content_create/content_update bylines.",
		inputSchema: object$1({ ...bylineCreateBody.shape }),
		annotations: { destructiveHint: false }
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleBylineCreate } = await import("./bylines-DGuqBLjV_BJqwvcnj.mjs").then((n) => n.t);
			const result = await handleBylineCreate(ec.db, args);
			if (result.success) await invalidateBylines();
			return unwrap(result);
		} catch (error) {
			return respondHandlerError(error, "BYLINE_CREATE_ERROR");
		}
	});
	server.registerTool("byline_update", {
		title: "Update Byline",
		description: "Update an existing byline. Any field can be omitted to leave it unchanged. Renaming the slug must not collide with another byline.",
		inputSchema: object$1({
			id: string().describe("Byline ID to update"),
			...bylineUpdateBody.shape
		})
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleBylineUpdate } = await import("./bylines-DGuqBLjV_BJqwvcnj.mjs").then((n) => n.t);
			const { id, ...input } = args;
			const result = await handleBylineUpdate(ec.db, id, input);
			if (result.success) await invalidateBylines();
			return unwrap(result);
		} catch (error) {
			return respondHandlerError(error, "BYLINE_UPDATE_ERROR");
		}
	});
	server.registerTool("byline_delete", {
		title: "Delete Byline",
		description: "Permanently delete a byline. Any content crediting this byline loses the association, and it is cleared as a primary byline where set.",
		inputSchema: object$1({ id: string().describe("Byline ID to delete") }),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { BylineRepository } = await import("./byline-C5TAqs8N_CAsx_sCB.mjs").then((n) => n.n);
			if (!await new BylineRepository(ec.db).delete(args.id)) return respondError("NOT_FOUND", `Byline '${args.id}' not found`);
			await invalidateBylines();
			return jsonResult({ deleted: args.id });
		} catch (error) {
			return respondHandlerError(error, "BYLINE_DELETE_ERROR");
		}
	});
	server.registerTool("byline_translations", {
		title: "List Byline Translations",
		description: "Return every locale variant of a byline, identified via its shared translation_group.",
		inputSchema: object$1({ id: string().describe("Byline id (or translation_group)") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { handleBylineTranslations } = await import("./bylines-DGuqBLjV_BJqwvcnj.mjs").then((n) => n.t);
			return unwrap(await handleBylineTranslations(ec.db, args.id));
		} catch (error) {
			return respondHandlerError(error, "BYLINE_TRANSLATIONS_ERROR");
		}
	});
	server.registerTool("schema_list_collections", {
		title: "List Collections",
		description: "List all content collections defined in the CMS. Each collection represents a content type (e.g. posts, pages, products) with its own schema and database table. Returns slug, label, supported features, and timestamps.",
		inputSchema: object$1({}),
		annotations: { readOnlyHint: true }
	}, async (_args, extra) => {
		requireScope(extra, "schema:read");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { SchemaRegistry } = await import("./schema-eqZhkR0S_BWtW7MhK.mjs").then((n) => n.t);
			return jsonResult({ items: await new SchemaRegistry(ec.db).listCollections() });
		} catch (error) {
			return respondHandlerError(error, "SCHEMA_LIST_ERROR");
		}
	});
	server.registerTool("schema_get_collection", {
		title: "Get Collection Schema",
		description: "Get detailed info about a collection including all field definitions. Fields describe the data model: name, type (string, text, number, boolean, datetime, portableText, image, reference, json, select, multiSelect, slug), constraints, and validation rules. Use this to understand what data content_create and content_update expect.",
		inputSchema: object$1({ slug: string().describe("Collection slug (e.g. 'posts'). Use schema_list_collections to see available slugs.") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "schema:read");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { SchemaRegistry } = await import("./schema-eqZhkR0S_BWtW7MhK.mjs").then((n) => n.t);
			const collection = await new SchemaRegistry(ec.db).getCollectionWithFields(args.slug);
			if (!collection) return respondError("NOT_FOUND", `Collection '${args.slug}' not found`);
			return jsonResult(collection);
		} catch (error) {
			return respondHandlerError(error, "SCHEMA_GET_ERROR");
		}
	});
	server.registerTool("schema_create_collection", {
		title: "Create Collection",
		description: "Create a new content collection (content type). This creates a database table and schema definition. The slug must be lowercase alphanumeric with underscores, starting with a letter. Supports: 'drafts' (draft/publish workflow), 'revisions' (version history), 'preview' (live preview), 'scheduling' (timed publish), 'search' (full-text indexing).",
		inputSchema: object$1({
			slug: string().regex(COLLECTION_SLUG_PATTERN).describe("Unique identifier (lowercase letters, numbers, underscores)"),
			label: string().describe("Display name (plural, e.g. 'Blog Posts')"),
			labelSingular: string().optional().describe("Singular display name (e.g. 'Blog Post')"),
			description: string().optional().describe("Description of this collection"),
			icon: string().optional().describe("Icon name for the admin UI"),
			supports: array(_enum([
				"drafts",
				"revisions",
				"preview",
				"scheduling",
				"search"
			])).optional().describe("Features to enable (default: ['drafts', 'revisions'])")
		})
	}, async (args, extra) => {
		requireScope(extra, "schema:write");
		requireRole(extra, Role.ADMIN);
		const ec = getEmDash(extra);
		try {
			const { SchemaRegistry } = await import("./schema-eqZhkR0S_BWtW7MhK.mjs").then((n) => n.t);
			const collection = await new SchemaRegistry(ec.db).createCollection({
				slug: args.slug,
				label: args.label,
				labelSingular: args.labelSingular,
				description: args.description,
				icon: args.icon,
				supports: args.supports
			});
			ec.invalidateUrlPatternCache();
			return jsonResult(collection);
		} catch (error) {
			return respondHandlerError(error, "SCHEMA_CREATE_ERROR");
		}
	});
	server.registerTool("schema_delete_collection", {
		title: "Delete Collection",
		description: "Delete a collection and its database table. This is irreversible and deletes all content in the collection. Use with extreme caution.",
		inputSchema: object$1({
			slug: string().describe("Collection slug to delete"),
			force: boolean().optional().describe("Force deletion even if the collection has content (default false)")
		}),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "schema:write");
		requireRole(extra, Role.ADMIN);
		const ec = getEmDash(extra);
		try {
			const { SchemaRegistry } = await import("./schema-eqZhkR0S_BWtW7MhK.mjs").then((n) => n.t);
			await new SchemaRegistry(ec.db).deleteCollection(args.slug, { force: args.force });
			ec.invalidateUrlPatternCache();
			return jsonResult({ deleted: args.slug });
		} catch (error) {
			return respondHandlerError(error, "SCHEMA_DELETE_ERROR");
		}
	});
	server.registerTool("schema_create_field", {
		title: "Add Field to Collection",
		description: "Add a new field to a collection's schema. This adds a column to the database table. Field types: string (short text), text (long text), number (decimal), integer, boolean, datetime, select (single choice), multiSelect (multiple), portableText (rich text), image, file, reference (link to another collection), json, slug (URL-safe id). For select/multiSelect, provide choices in validation.options array.",
		inputSchema: object$1({
			collection: string().describe("Collection slug to add the field to"),
			slug: string().regex(COLLECTION_SLUG_PATTERN).describe("Field identifier (lowercase letters, numbers, underscores)"),
			label: string().describe("Display name for the field"),
			type: _enum([
				"string",
				"text",
				"number",
				"integer",
				"boolean",
				"datetime",
				"select",
				"multiSelect",
				"portableText",
				"image",
				"file",
				"reference",
				"json",
				"slug"
			]).describe("Data type for this field"),
			required: boolean().optional().describe("Whether the field is required (default false)"),
			unique: boolean().optional().describe("Whether values must be unique (default false)"),
			defaultValue: unknown().optional().describe("Default value for new items"),
			validation: object$1({
				min: number().optional(),
				max: number().optional(),
				minLength: number().optional(),
				maxLength: number().optional(),
				pattern: string().optional(),
				options: array(string()).optional().describe("Allowed values for select/multiSelect")
			}).optional().describe("Validation constraints"),
			options: object$1({
				collection: string().optional().describe("Target collection slug for reference fields"),
				rows: number().optional().describe("Number of rows for textarea")
			}).passthrough().optional().describe("Widget configuration"),
			searchable: boolean().optional().describe("Include in full-text search index (default false)"),
			translatable: boolean().optional().describe("Whether this field is translatable (default true). Non-translatable fields are synced across all locales in a translation group.")
		})
	}, async (args, extra) => {
		requireScope(extra, "schema:write");
		requireRole(extra, Role.ADMIN);
		const ec = getEmDash(extra);
		try {
			const { SchemaRegistry } = await import("./schema-eqZhkR0S_BWtW7MhK.mjs").then((n) => n.t);
			return jsonResult(await new SchemaRegistry(ec.db).createField(args.collection, {
				slug: args.slug,
				label: args.label,
				type: args.type,
				required: args.required,
				unique: args.unique,
				defaultValue: args.defaultValue,
				validation: args.validation,
				options: args.options,
				searchable: args.searchable,
				translatable: args.translatable
			}));
		} catch (error) {
			return respondHandlerError(error, "FIELD_CREATE_ERROR");
		}
	});
	server.registerTool("schema_delete_field", {
		title: "Remove Field from Collection",
		description: "Remove a field from a collection. This drops the column from the database table and deletes all data in that field. Irreversible.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			fieldSlug: string().describe("Field slug to remove")
		}),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "schema:write");
		requireRole(extra, Role.ADMIN);
		const ec = getEmDash(extra);
		try {
			const { SchemaRegistry } = await import("./schema-eqZhkR0S_BWtW7MhK.mjs").then((n) => n.t);
			await new SchemaRegistry(ec.db).deleteField(args.collection, args.fieldSlug);
			return jsonResult({
				deleted: args.fieldSlug,
				collection: args.collection
			});
		} catch (error) {
			return respondHandlerError(error, "FIELD_DELETE_ERROR");
		}
	});
	server.registerTool("media_list", {
		title: "List Media",
		description: "List uploaded media files (images, documents, etc.) with optional MIME type filtering and pagination. Returns file metadata including filename, URL, dimensions, and alt text.",
		inputSchema: object$1({
			mimeType: string().optional().describe("Filter by MIME type prefix (e.g. 'image/', 'application/pdf')"),
			limit: number().int().min(1).max(100).optional().describe("Max items (default 50)"),
			cursor: string().min(1).max(2048).optional().describe("Pagination cursor")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "media:read");
		return unwrap(await getEmDash(extra).handleMediaList({
			mimeType: args.mimeType,
			limit: args.limit,
			cursor: args.cursor
		}));
	});
	server.registerTool("media_create", {
		title: "Register Uploaded Media",
		description: "Register a media file that has already been uploaded to storage. The caller is responsible for placing the file at `storageKey` (typically using a signed upload URL obtained from the admin UI or a separate API). This tool persists the metadata record so the file is discoverable via media_list / media_get and can be referenced by content. To upload the file itself, use media_upload (base64 data or a public URL) instead.",
		inputSchema: object$1({
			filename: string().describe("Original filename (e.g. 'logo.png')"),
			mimeType: string().describe("MIME type (e.g. 'image/png')"),
			storageKey: string().describe("Storage path/key the file was uploaded to"),
			size: number().int().nonnegative().optional().describe("File size in bytes"),
			width: number().int().positive().optional().describe("Image width in pixels"),
			height: number().int().positive().optional().describe("Image height in pixels"),
			contentHash: string().optional().describe("Hash of the file contents (for dedupe)"),
			blurhash: string().optional().describe("Blurhash for image placeholders"),
			dominantColor: string().optional().describe("Hex color string for the image's dominant color")
		})
	}, async (args, extra) => {
		requireScope(extra, "media:write");
		requireRole(extra, Role.AUTHOR);
		const { emdash, userId } = getExtra(extra);
		return unwrap(await emdash.handleMediaCreate({
			filename: args.filename,
			mimeType: args.mimeType,
			storageKey: args.storageKey,
			size: args.size,
			width: args.width,
			height: args.height,
			contentHash: args.contentHash,
			blurhash: args.blurhash,
			dominantColor: args.dominantColor,
			authorId: userId
		}));
	});
	server.registerTool("media_upload", {
		title: "Upload Media",
		description: "Upload a media file from base64-encoded data or an external URL and register it in the media library. Returns the media item with id, storageKey, and url — ready to reference from content fields (e.g. featured_image) via content_create / content_update. Uploads are deduplicated by content hash: re-uploading identical bytes returns the existing item with deduplicated: true. URL fetches must resolve to a public http(s) host (SSRF-guarded). Subject to the global upload MIME allowlist and the configured maximum upload size.",
		inputSchema: object$1({
			filename: string().min(1).describe("Filename including extension (e.g. 'cover.png')"),
			base64: string().optional().describe("Base64-encoded file contents. Provide exactly one of base64 / url."),
			url: string().url().optional().describe("Public http(s) URL to fetch the file from. Provide exactly one of base64 / url."),
			contentType: string().regex(CONTENT_TYPE_RE, "Invalid content type").optional().describe("MIME type (e.g. 'image/png'). Required with base64; with url it defaults to the response's Content-Type header."),
			alt: string().optional().describe("Alt text for accessibility")
		}),
		annotations: { destructiveHint: false }
	}, async (args, extra) => {
		requireScope(extra, "media:write");
		requireRole(extra, Role.CONTRIBUTOR);
		const { emdash, userId } = getExtra(extra);
		if (!emdash.storage) return respondError("NO_STORAGE", "Storage not configured");
		try {
			const { handleMediaUpload } = await import("./media-upload-Bc9Nc5Zf_CoMX0jaf.mjs");
			return unwrap(await handleMediaUpload(emdash.db, emdash.storage, {
				filename: args.filename,
				base64: args.base64,
				url: args.url,
				contentType: args.contentType,
				alt: args.alt,
				authorId: userId,
				maxUploadSize: emdash.config.maxUploadSize
			}));
		} catch (error) {
			return respondHandlerError(error, "UPLOAD_ERROR");
		}
	});
	server.registerTool("media_get", {
		title: "Get Media Item",
		description: "Get details of a single media file by its ID. Returns metadata including filename, MIME type, size, dimensions, alt text, and URL.",
		inputSchema: object$1({ id: string().describe("Media item ID") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "media:read");
		return unwrap(await getEmDash(extra).handleMediaGet(args.id));
	});
	server.registerTool("media_update", {
		title: "Update Media Metadata",
		description: "Update the metadata of an uploaded media file. You can change the alt text, caption, and dimensions. The file itself cannot be changed.",
		inputSchema: object$1({
			id: string().describe("Media item ID"),
			alt: string().optional().describe("Alt text for accessibility"),
			caption: string().optional().describe("Caption text"),
			width: number().int().optional().describe("Image width in pixels"),
			height: number().int().optional().describe("Image height in pixels")
		})
	}, async (args, extra) => {
		requireScope(extra, "media:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleMediaGet(args.id);
		if (!existing.success) return unwrap(existing);
		const media = existing.data?.item;
		requireOwnership(extra, typeof media?.authorId === "string" ? media.authorId : "", "media:edit_own", "media:edit_any");
		return unwrap(await ec.handleMediaUpdate(args.id, {
			alt: args.alt,
			caption: args.caption,
			width: args.width,
			height: args.height
		}));
	});
	server.registerTool("media_delete", {
		title: "Delete Media",
		description: "Permanently delete an uploaded media file. Removes the database record and the file from storage. Content referencing this media will have broken references. Cannot be undone.",
		inputSchema: object$1({ id: string().describe("Media item ID") }),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "media:write");
		requireRole(extra, Role.AUTHOR);
		const ec = getEmDash(extra);
		const existing = await ec.handleMediaGet(args.id);
		if (!existing.success) return unwrap(existing);
		const media = existing.data?.item;
		requireOwnership(extra, typeof media?.authorId === "string" ? media.authorId : "", "media:delete_own", "media:delete_any");
		return unwrap(await ec.handleMediaDelete(args.id));
	});
	server.registerTool("media_usage_repair", {
		title: "Repair Media Usage Index",
		description: "Repair content media usage indexes for one collection or every collection. Returns complete, partial, failed, or stale status; inspect the structured result.",
		inputSchema: mediaUsageRepairToolSchema
	}, async (args, extra) => {
		requireScope(extra, "admin");
		requireRole(extra, Role.ADMIN);
		const ec = getEmDash(extra);
		let input;
		if (args.scope === "collection") {
			if (args.collection === void 0) return respondError("VALIDATION_ERROR", "Collection is required when scope is collection");
			input = {
				scope: "collection",
				collection: args.collection
			};
		} else input = { scope: "all" };
		try {
			const { handleMediaUsageRepair } = await import("./media-usage-DPJcNaAq_B7AZkPI4.mjs").then((n) => n.i);
			return unwrap(await handleMediaUsageRepair(ec.db, input));
		} catch (error) {
			return respondHandlerError(error, "MEDIA_USAGE_REPAIR_ERROR");
		}
	});
	server.registerTool("search", {
		title: "Search Content",
		description: "Full-text search across content collections. Searches indexed fields for matching content. Collections must have 'search' in their supports list and fields must be marked as searchable. Returns collection, item ID, title, excerpt, and relevance score.",
		inputSchema: object$1({
			query: string().describe("Search query text"),
			collections: array(string()).optional().describe("Limit search to specific collection slugs (all if omitted)"),
			locale: string().optional().describe("Filter results by locale (omit to search all locales)"),
			limit: number().int().min(1).max(50).optional().describe("Max results (default 20)"),
			cursor: string().min(1).max(2048).optional().describe("Pagination cursor from a previous response")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { searchWithDb } = await import("./search-CeO678cp_DwoNx_bO.mjs").then((n) => n.t);
			return jsonResult(await searchWithDb(ec.db, args.query, {
				collections: args.collections,
				locale: args.locale,
				limit: args.limit,
				cursor: args.cursor
			}));
		} catch (error) {
			return respondHandlerError(error, "SEARCH_ERROR");
		}
	});
	server.registerTool("taxonomy_list", {
		title: "List Taxonomies",
		description: "List all taxonomy definitions (e.g. categories, tags). Taxonomies are classification systems applied to content. Each has a name, label, and can be hierarchical (categories) or flat (tags). Optionally filter by locale.",
		inputSchema: object$1({ locale: string().optional().describe("Filter by locale (omit for all)") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { handleTaxonomyList } = await import("./taxonomies-Dbdki3Un_5v-ciiog.mjs").then((n) => n.l);
			return unwrap(await handleTaxonomyList(ec.db, { locale: args.locale }));
		} catch (error) {
			return respondHandlerError(error, "TAXONOMY_LIST_ERROR");
		}
	});
	server.registerTool("taxonomy_list_terms", {
		title: "List Taxonomy Terms",
		description: "List terms in a taxonomy with pagination. Terms are individual entries (e.g. specific categories or tags). Hierarchical taxonomies can have parent-child relationships.",
		inputSchema: object$1({
			taxonomy: string().describe("Taxonomy name (e.g. 'categories', 'tags')"),
			limit: number().int().min(1).max(100).optional().describe("Max items (default 50)"),
			cursor: string().min(1).max(2048).optional().describe("Pagination cursor"),
			locale: string().optional().describe("Filter by locale (omit for all)")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { handleTaxonomyList } = await import("./taxonomies-Dbdki3Un_5v-ciiog.mjs").then((n) => n.l);
			const listResult = await handleTaxonomyList(ec.db, { locale: args.locale });
			if (!listResult.success) return unwrap(listResult);
			if (!listResult.data.taxonomies.find((t) => t.name === args.taxonomy)) return respondError("NOT_FOUND", `Taxonomy '${args.taxonomy}' not found`);
			const { TaxonomyRepository } = await import("./taxonomy-DvwWAPvA_CZTeL1g8.mjs").then((n) => n.n);
			const { decodeCursor, encodeCursor, InvalidCursorError } = await import("./types-XrQQ-Aex_CR4uDRET.mjs").then((n) => n.o);
			const repo = new TaxonomyRepository(ec.db);
			const limit = Math.min(args.limit ?? 50, 100);
			const terms = await repo.findByName(args.taxonomy, { locale: args.locale });
			let startIdx = 0;
			if (args.cursor) {
				let decoded;
				try {
					decoded = decodeCursor(args.cursor);
				} catch (error) {
					if (error instanceof InvalidCursorError) return respondError("INVALID_CURSOR", error.message);
					throw error;
				}
				startIdx = terms.findIndex((t) => t.label > decoded.orderValue || t.label === decoded.orderValue && t.id > decoded.id);
				if (startIdx < 0) startIdx = terms.length;
			}
			const page = terms.slice(startIdx, startIdx + limit);
			const hasMore = startIdx + limit < terms.length;
			const last = page.at(-1);
			const nextCursor = hasMore && last ? encodeCursor(last.label, last.id) : void 0;
			return jsonResult({
				items: page.map((t) => ({
					id: t.id,
					name: t.name,
					slug: t.slug,
					label: t.label,
					parentId: t.parentId,
					description: typeof t.data?.description === "string" ? t.data.description : void 0,
					locale: t.locale,
					translationGroup: t.translationGroup
				})),
				nextCursor
			});
		} catch (error) {
			return respondHandlerError(error, "TAXONOMY_LIST_TERMS_ERROR");
		}
	});
	server.registerTool("taxonomy_create_term", {
		title: "Create Taxonomy Term",
		description: "Create a new term in a taxonomy. For hierarchical taxonomies like categories, you can specify a parentId to create a child term. The parent must exist and belong to the same taxonomy. The parent's ancestor chain must not exceed 100 levels — attempts to attach a new term beneath a chain of 100+ existing ancestors are rejected.",
		inputSchema: object$1({
			taxonomy: string().describe("Taxonomy name (e.g. 'categories', 'tags')"),
			slug: string().describe("URL-safe identifier for the term"),
			label: string().describe("Display name"),
			parentId: string().optional().describe("Parent term ID for hierarchical taxonomies"),
			description: string().optional().describe("Description of the term"),
			locale: string().optional().describe("Locale for the new term (e.g. 'es')"),
			translationOf: string().optional().describe("Term id to join as a translation (same translation_group)")
		})
	}, async (args, extra) => {
		requireScope(extra, "taxonomies:manage");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleTermCreate } = await import("./taxonomies-Dbdki3Un_5v-ciiog.mjs").then((n) => n.l);
			return unwrap(await handleTermCreate(ec.db, args.taxonomy, {
				slug: args.slug,
				label: args.label,
				parentId: args.parentId,
				description: args.description,
				locale: args.locale,
				translationOf: args.translationOf
			}));
		} catch (error) {
			return respondHandlerError(error, "TAXONOMY_TERM_CREATE_ERROR");
		}
	});
	server.registerTool("taxonomy_update_term", {
		title: "Update Taxonomy Term",
		description: "Update an existing term in a taxonomy. Any field can be omitted to leave it unchanged. Renaming a term's slug must not collide with another term in the same taxonomy. Set parentId to null to detach from a parent. The new parent must exist, belong to the same taxonomy, and not introduce a cycle (a term cannot be its own ancestor). The new parent's ancestor chain must not exceed 100 levels — reparenting under a chain of 100+ ancestors is rejected.",
		inputSchema: object$1({
			taxonomy: string().describe("Taxonomy name (e.g. 'categories', 'tags')"),
			termSlug: string().describe("Current slug of the term to update"),
			slug: string().optional().describe("New slug (must be unique in the taxonomy)"),
			label: string().optional().describe("New display name"),
			parentId: string().nullable().optional().describe("New parent term ID; null to detach"),
			description: string().optional().describe("New description")
		})
	}, async (args, extra) => {
		requireScope(extra, "taxonomies:manage");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleTermUpdate } = await import("./taxonomies-Dbdki3Un_5v-ciiog.mjs").then((n) => n.l);
			return unwrap(await handleTermUpdate(ec.db, args.taxonomy, args.termSlug, {
				slug: args.slug,
				label: args.label,
				parentId: args.parentId,
				description: args.description
			}));
		} catch (error) {
			return respondHandlerError(error, "TAXONOMY_TERM_UPDATE_ERROR");
		}
	});
	server.registerTool("taxonomy_delete_term", {
		title: "Delete Taxonomy Term",
		description: "Permanently delete a term from a taxonomy. Any content tagged with this term loses the association. Cannot delete a term that has children — delete children first.",
		inputSchema: object$1({
			taxonomy: string().describe("Taxonomy name"),
			termSlug: string().describe("Slug of the term to delete")
		}),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "taxonomies:manage");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleTermDelete } = await import("./taxonomies-Dbdki3Un_5v-ciiog.mjs").then((n) => n.l);
			return unwrap(await handleTermDelete(ec.db, args.taxonomy, args.termSlug));
		} catch (error) {
			return respondHandlerError(error, "TAXONOMY_TERM_DELETE_ERROR");
		}
	});
	server.registerTool("taxonomy_term_translations", {
		title: "List Term Translations",
		description: "Return every locale variant of a taxonomy term, identified via its shared translation_group.",
		inputSchema: object$1({ id: string().describe("Term id (or translation_group)") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { handleTermTranslations } = await import("./taxonomies-Dbdki3Un_5v-ciiog.mjs").then((n) => n.l);
			return unwrap(await handleTermTranslations(ec.db, args.id));
		} catch (error) {
			return respondHandlerError(error, "TERM_TRANSLATIONS_ERROR");
		}
	});
	server.registerTool("menu_list", {
		title: "List Menus",
		description: "List navigation menus. Menus are per-locale: filter by `locale` to get just one locale's worth, or omit to list every row (one per locale per menu name).",
		inputSchema: object$1({ locale: string().optional().describe("Filter by locale (omit for all)") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { handleMenuList } = await import("./menus-BxPLFfIc_CCQ-UokT.mjs").then((n) => n.d);
			return unwrap(await handleMenuList(ec.db, { locale: args.locale }));
		} catch (error) {
			return respondHandlerError(error, "MENU_LIST_ERROR");
		}
	});
	server.registerTool("menu_get", {
		title: "Get Menu with Items",
		description: "Get a menu by name, including its items. When multiple locales exist, pass `locale` to pick the right one.",
		inputSchema: object$1({
			name: string().describe("Menu name (e.g. 'main', 'footer')"),
			locale: string().optional().describe("Locale to resolve the menu for")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { handleMenuGet } = await import("./menus-BxPLFfIc_CCQ-UokT.mjs").then((n) => n.d);
			return unwrap(await handleMenuGet(ec.db, args.name, { locale: args.locale }));
		} catch (error) {
			return respondHandlerError(error, "MENU_GET_ERROR");
		}
	});
	server.registerTool("menu_translations", {
		title: "List Menu Translations",
		description: "Return every locale variant of a menu, identified via the shared translation_group.",
		inputSchema: object$1({ id: string().describe("Menu id (or translation_group)") }),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		const ec = getEmDash(extra);
		try {
			const { handleMenuTranslations } = await import("./menus-BxPLFfIc_CCQ-UokT.mjs").then((n) => n.d);
			return unwrap(await handleMenuTranslations(ec.db, args.id));
		} catch (error) {
			return respondHandlerError(error, "MENU_TRANSLATIONS_ERROR");
		}
	});
	server.registerTool("menu_create", {
		title: "Create Menu",
		description: "Create a new navigation menu. The `name` is the stable identifier used by site templates (e.g. 'main', 'footer'); `label` is the human-readable name shown in the admin. Menus are per-locale, so pass `locale` when the same menu name exists in multiple translations. Add items afterwards with menu_set_items. If `translationOf` is set, `locale` must also be set.",
		inputSchema: object$1({
			name: string().regex(COLLECTION_SLUG_PATTERN).describe("Stable identifier (lowercase letters, numbers, underscores)"),
			label: string().describe("Display name for the admin"),
			locale: string().optional().describe("Locale for this menu (e.g. 'fr-fr')"),
			translationOf: string().optional().describe("Existing menu id to create this locale variant from")
		})
	}, async (args, extra) => {
		requireScope(extra, "menus:manage");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleMenuCreate } = await import("./menus-BxPLFfIc_CCQ-UokT.mjs").then((n) => n.d);
			return unwrap(await handleMenuCreate(ec.db, {
				name: args.name,
				label: args.label,
				locale: args.locale,
				translationOf: args.translationOf
			}));
		} catch (error) {
			return respondHandlerError(error, "MENU_CREATE_ERROR");
		}
	});
	server.registerTool("menu_update", {
		title: "Update Menu",
		description: "Update a menu's label. The `name` (stable identifier) cannot be changed. On multi-locale installs, pass `locale` so the correct translation is updated.",
		inputSchema: object$1({
			name: string().describe("Menu name to update"),
			label: string().describe("New display label"),
			locale: string().optional().describe("Locale of the menu to update")
		})
	}, async (args, extra) => {
		requireScope(extra, "menus:manage");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleMenuUpdate } = await import("./menus-BxPLFfIc_CCQ-UokT.mjs").then((n) => n.d);
			return unwrap(await handleMenuUpdate(ec.db, args.name, {
				label: args.label,
				locale: args.locale
			}));
		} catch (error) {
			return respondHandlerError(error, "MENU_UPDATE_ERROR");
		}
	});
	server.registerTool("menu_delete", {
		title: "Delete Menu",
		description: "Delete a menu. Items are also removed. Cannot be undone. On multi-locale installs, pass `locale` so only the intended translation is removed.",
		inputSchema: object$1({
			name: string().describe("Menu name to delete"),
			locale: string().optional().describe("Locale of the menu to delete")
		}),
		annotations: { destructiveHint: true }
	}, async (args, extra) => {
		requireScope(extra, "menus:manage");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleMenuDelete } = await import("./menus-BxPLFfIc_CCQ-UokT.mjs").then((n) => n.d);
			return unwrap(await handleMenuDelete(ec.db, args.name, { locale: args.locale }));
		} catch (error) {
			return respondHandlerError(error, "MENU_DELETE_ERROR");
		}
	});
	server.registerTool("menu_set_items", {
		title: "Set Menu Items",
		description: "Replace the entire item list of a menu in one call. This is atomic: the existing items are deleted and the new list is inserted in the order provided. Use this rather than per-item add/remove tools so the resulting order and parent links are unambiguous. On multi-locale installs, pass `locale` so only the intended translation is rewritten.",
		inputSchema: object$1({
			name: string().describe("Menu name to update"),
			locale: string().optional().describe("Locale of the menu to rewrite"),
			items: array(object$1({
				label: string().describe("Item display text"),
				type: _enum([
					"custom",
					"page",
					"post",
					"taxonomy",
					"collection"
				]).describe("Item kind"),
				customUrl: string().optional().describe("URL for type='custom' items (ignored otherwise)"),
				referenceCollection: string().optional().describe("Target collection slug for content references"),
				referenceId: string().optional().describe("Target content/term ID for references"),
				titleAttr: string().optional().describe("HTML title attribute"),
				target: string().optional().describe("HTML target attribute, e.g. '_blank'"),
				cssClasses: string().optional().describe("Space-separated CSS classes"),
				parentIndex: number().int().nonnegative().optional().describe("Array index of the parent item (must be earlier in the list). Omit for top-level items.")
			})).describe("Ordered list of menu items")
		})
	}, async (args, extra) => {
		requireScope(extra, "menus:manage");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleMenuSetItems } = await import("./menus-BxPLFfIc_CCQ-UokT.mjs").then((n) => n.d);
			return unwrap(await handleMenuSetItems(ec.db, args.name, args.items, { locale: args.locale }));
		} catch (error) {
			return respondHandlerError(error, "MENU_SET_ITEMS_ERROR");
		}
	});
	server.registerTool("revision_list", {
		title: "List Revisions",
		description: "List revision history for a content item. Revisions are snapshots created on publish or update. Returns newest-first. Requires the collection to support 'revisions'.",
		inputSchema: object$1({
			collection: string().describe("Collection slug"),
			id: string().describe("Content item ID or slug"),
			limit: number().int().min(1).max(50).optional().describe("Max revisions (default 20)")
		}),
		annotations: { readOnlyHint: true }
	}, async (args, extra) => {
		requireScope(extra, "content:read");
		requireDraftAccess(extra);
		return unwrap(await getEmDash(extra).handleRevisionList(args.collection, args.id, { limit: args.limit }));
	});
	server.registerTool("revision_restore", {
		title: "Restore Revision",
		description: "Restore a content item to a previous revision. Replaces the current draft with the specified revision's data. Not automatically published — use content_publish afterward if needed.",
		inputSchema: object$1({ revisionId: string().describe("Revision ID to restore") })
	}, async (args, extra) => {
		requireScope(extra, "content:write");
		requireRole(extra, Role.AUTHOR);
		const { emdash, userId } = getExtra(extra);
		const revision = await emdash.handleRevisionGet(args.revisionId);
		if (!revision.success) return unwrap(revision);
		const revItem = revision.data?.item;
		if (!revItem?.collection || !revItem?.entryId) return respondError("VALIDATION_ERROR", "Revision is missing collection or entry reference");
		const existing = await emdash.handleContentGet(revItem.collection, revItem.entryId);
		if (!existing.success) return unwrap(existing);
		requireOwnership(extra, extractContentAuthorId(existing.data), "content:edit_own", "content:edit_any");
		return unwrap(await emdash.handleRevisionRestore(args.revisionId, userId));
	});
	server.registerTool("settings_get", {
		title: "Get Site Settings",
		description: "Get all site-wide settings (title, tagline, logo, favicon, URL, date/time formatting, social links, SEO defaults). Media references (logo, favicon, defaultOgImage) include resolved URLs. Unset values are omitted from the response.",
		inputSchema: object$1({}),
		annotations: { readOnlyHint: true }
	}, async (_args, extra) => {
		requireScope(extra, "settings:read");
		requireRole(extra, Role.EDITOR);
		const ec = getEmDash(extra);
		try {
			const { handleSettingsGet } = await import("./settings-CREKyj8I_BBHCkvJv.mjs").then((n) => n.r);
			return unwrap(await handleSettingsGet(ec.db, ec.storage));
		} catch (error) {
			return respondHandlerError(error, "SETTINGS_READ_ERROR");
		}
	});
	server.registerTool("settings_update", {
		title: "Update Site Settings",
		description: "Update one or more site-wide settings. This is a partial update: only the fields provided are changed; omitted fields are left as-is. Returns the full settings object after the update. To set a media reference (logo, favicon, seo.defaultOgImage), pass an object with `mediaId` (and optional `alt`) — the media item must already exist (use media_create first).",
		inputSchema: object$1({
			title: string().optional().describe("Site title"),
			tagline: string().optional().describe("Site tagline / short description"),
			logo: settingsMediaReferenceSchema.optional().describe("Logo media reference ({ mediaId, alt? })"),
			favicon: settingsMediaReferenceSchema.optional().describe("Favicon media reference ({ mediaId, alt? })"),
			url: union([string().url().refine((u) => HTTP_SCHEME_PATTERN.test(u), "URL must use http or https"), literal("")]).optional().describe("Canonical site URL (http or https). Empty string clears it."),
			postsPerPage: number().int().min(1).max(100).optional().describe("Default page size for content listings"),
			dateFormat: string().optional().describe("Date format token string"),
			timezone: string().optional().describe("IANA timezone identifier"),
			social: settingsSocialSchema.optional().describe("Social handles / URLs"),
			seo: settingsSeoSchema.optional().describe("Site-wide SEO defaults")
		})
	}, async (args, extra) => {
		requireScope(extra, "settings:manage");
		requireRole(extra, Role.ADMIN);
		const ec = getEmDash(extra);
		try {
			const { handleSettingsUpdate } = await import("./settings-CREKyj8I_BBHCkvJv.mjs").then((n) => n.r);
			return unwrap(await handleSettingsUpdate(ec.db, ec.storage, args));
		} catch (error) {
			return respondHandlerError(error, "SETTINGS_UPDATE_ERROR");
		}
	});
	return server;
}
var POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);
	const server = createMcpServer(await emdash.getEnabledPluginMcpTools(), request);
	try {
		const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: void 0 });
		await server.connect(transport);
		return await transport.handleRequest(request, { authInfo: {
			token: "",
			clientId: "emdash-admin",
			scopes: [],
			extra: {
				emdash,
				userId: user.id,
				userRole: user.role,
				tokenScopes: locals.tokenScopes
			}
		} });
	} catch (error) {
		console.error("[MCP]", error);
		await server.close().catch(() => {});
		return new Response(JSON.stringify({
			jsonrpc: "2.0",
			error: {
				code: -32603,
				message: "Internal server error"
			},
			id: null
		}), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "private, no-store"
			}
		});
	}
};
/**
* GET — SSE stream. Not used in stateless mode.
*/
var GET = async () => {
	return new Response(JSON.stringify({
		jsonrpc: "2.0",
		error: {
			code: -32e3,
			message: "Method not allowed. This is a stateless MCP endpoint — use POST."
		},
		id: null
	}), {
		status: 405,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "private, no-store"
		}
	});
};
/**
* DELETE — Session close. Not used in stateless mode.
*/
var DELETE = async () => {
	return new Response(JSON.stringify({
		jsonrpc: "2.0",
		error: {
			code: -32e3,
			message: "Method not allowed. This is a stateless MCP endpoint."
		},
		id: null
	}), {
		status: 405,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "private, no-store"
		}
	});
};
//#endregion
//#region \0virtual:astro:page:self-essentials/emdash-main/packages/core/dist/astro/routes/api/mcp@_@mjs
var page = () => mcp_exports;
//#endregion
export { page };
